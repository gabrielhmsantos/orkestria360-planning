# Fontes e viabilidade — Contas e Armazenamento

## Mapping

`getOneDriveUsageAccountDetail` é nova coleta justificada para proprietário, atividade, arquivos e cotas por conta. `getOneDriveUsageAccountCounts` e `getOneDriveUsageFileCounts` são relatórios complementares para agregados. `getOneDriveUsageStorage` reutiliza a fonte canônica existente de Licenciamento (`GraphDataClient::downloadOneDriveUsageStorage`). Identidade/licença/departamento são projeções da fotografia canônica de `IdentitySnapshot` e do catálogo/atribuições de Licenciamento, sem leitura paralela de `/users`. A descoberta complementar selecionada é `/users/{id}/drives`, compartilhada com Arquivos e Conteúdo; a rota singular `/users/{id}/drive` não é fonte app-only suportada pela documentação atual.

`getOneDriveUsageAccountDetail(period='D180')`,
`getOneDriveUsageAccountCounts(period='D180')` e
`getOneDriveUsageFileCounts(period='D180')` foram validados em duas conexões
técnicas como `302 → 200 application/octet-stream`, com BOM UTF-8 e sem linhas
malformadas. Os relatórios de contagem retornaram as seis colunas agregadas
documentadas; o detalhe retornou as 12 colunas de conta. O contrato exige
segundo GET protegido sem `Authorization`; `302` não representa erro de fonte.

O contrato `/users` selecionado foi validado, mas a implementação já publica
esses campos no superset canônico de identidade. A superfície consome essa
projeção e correlaciona identidade com o proprietário/`Site Id` da fotografia
de relatório, sem substituir a semântica do relatório. O Simulator cobre os
relatórios e `/users`; cobertura sintética não cria publicação de produção.

## Mapping contrato → fatos publicados

| Fato do contrato | Origem e normalização |
| --- | --- |
| Nome, login, departamento, pessoa habilitada/desabilitada | Fotografia canônica de identidade; correlacionar por ID estável quando conhecido e UPN normalizado quando o relatório publicar identidade. Nome exibível sozinho não é chave. UPN ocultado/anonimizado, identidade ausente ou mais de uma correspondência deixam vínculo indisponível. |
| Licença da pessoa | Atribuições canônicas `assignedLicenses.skuId` e `disabledPlans`, cruzadas com catálogo canônico de SKUs/planos. Não reduzir licenciamento real a E3/E5 nem assumir direito ao OneDrive pelo nome do produto; plano pertinente desabilitado não concede direito. SKU/catálogo desconhecido permanece sem afirmação. |
| `usedBytes`, `allocatedBytes`, `fileCount`, `activeFileCount`, `lastActivityAt` | Colunas `Storage Used (Byte)`, `Storage Allocated (Byte)`, `File Count`, `Active File Count`, `Last Activity Date` do report detalhado. Parse estrito de inteiro/data; célula ausente permanece ausente. `Report Refresh Date` é a âncora factual, distinta do horário de download. |
| Provisionamento | Linha de report com `Site Id` e `Is Deleted=false` é presença no snapshot do report. Descoberta app-only `/users/{id}/drives` com drive empresarial correlacionado confirma existência na leitura complementar. Ausência da linha de report isoladamente não confirma ausência. Ver regra de cobertura abaixo. |
| `utilizationPercent` e nível | `usedBytes / allocatedBytes × 100` quando ambos estão publicados e alocação >0; níveis aprovados `<80`, `80–<90`, `90–<95`, `≥95`. Zero de capacidade não significa 0% de utilização. |
| `activityBand` | Regra do DOCX sponsor: atividade até 30 dias → `active`; >30 até 90 → `low`; >90 até 180 → `inactive`; >180 → `critical`. Contar contra a âncora `Report Refresh Date`; ausência de data/âncora não recebe faixa. Essa faixa mede atividade OneDrive, não `signInActivity`. |
| Compartilhamento externo, risco, retenção | Projeções de Compartilhamento e Acessos, regras versionadas aprovadas do módulo e casos/configuração local de retenção. Falha ou falta dessas dependências não vira `false`, risco baixo ou retenção vigente. |
| Filtros, distribuições, rankings, detalhe | Agregações da mesma geração publicada com as dependências disponíveis; catálogo de filtros deriva dos valores reais publicados. |
| `summary` e comparações D30 | Agregado independente do inventário paginado, calculado dos reports de uma mesma referência temporal e projeções compatíveis. Baseline vem de snapshot real D30 anterior; falta de baseline mantém comparação ausente. |

## Descoberta, população e tratamento de erro

### Detalhe contextual e dependências delimitadas

`accountDetail` publica seus oito blocos com estado próprio: overview e storage
reutilizam a mesma conta/Report; files usa o inventário correlacionado; sharing
conta arquivos com exposição atual comprovada; retention usa casos/retenção
comprovados; audit conta IDs de eventos correlacionados ao drive/site da conta
na janela publicada. Falha de um bloco não preenche os demais por aproximação.
Synchronization publica somente o último instante Health de estado atualizado
reportado pelos clientes daquela pessoa, com referência do export; não afirma
pausa/transferência em curso. Devices pode publicar a quantidade de dispositivos
gerenciados Intune ligados por `userId` à identidade canônica da pessoa, com
esse universo explícito. Nome/e-mail exibível sozinho não correlaciona aparelho.
Não há necessidade de unir uma linha Health a uma linha Intune para esses dois
agregados por conta; suas populações e datas são independentes. A3 da aba de
sincronização não é suprida silenciosamente pelo detalhe.

O OpenAPI desta aba foi corrigido em A1 e aprovado por SwaggerParser12.1.0,
incluindo parâmetros templados required. Fontes/mappings próprios da conta e
este detalhe estão definidos; implementação de consumers/projeções permanece
trabalho futuro, com publicação factual por bloco.

`GET /users/{id}/drives?$select=id,driveType,sharepointIds,owner,webUrl,system`
é **leitura complementar**: fornece apenas identificação e correlação do drive,
sem repetir quota/uso publicados pelos reports. A coleção suporta aplicação
com `Files.Read.All` ou escopo superior documentado. A coleta GET observou `200`
OData e `404 ResourceNotFound`; a role mínima ausente no resumo não é bloqueio
global da fonte nem gate de Discovery. O contrato está documentado e a extensão
sintética SUPPORTED passou nesta revisão por generate/inventory/validate/import/
smoke, preservando cenários múltiplos, opcionais, vazios e de erro.

Para cada usuário da população canônica avaliada, seguir todas as páginas;
considerar drives `business` não marcados como `system`, correlacionando
`owner.user.id` quando presente ou `sharepointIds.siteId` com `Site Id` do report.
Proprietário pode ser omitido. Múltiplos candidatos empresariais sem correlação
única ficam `ambiguous`, sem selecionar arbitrariamente o primeiro drive. A
população descoberta e a fotografia do report têm cobertura/data próprias.

`provisioned: false` exige usuário canônico existente, elegível e acesso
documentado ao escopo, mais leitura concluída sem drive empresarial pertencente
ao usuário ou `404` específico de mysite ausente. `404` genérico, recurso
inexistente, acesso não comprovado, ambiguidade e ausência de linha de report
ficam desconhecidos. A contagem `unprovisionedAccounts` só é completa quando
toda a população elegível foi resolvida; o sponsor chama a subtração
licenciados menos linhas de report de **potencialmente não provisionadas**, que
não pode substituir a semântica factual aprovada.

`401`/`403` publicam falha/restrição da fonte e não ausência de drive. `429`
mantém fotografia anterior, respeita `Retry-After` e retoma a mesma página;
timeout/`5xx` não promovem fotografia parcial como completa. `200 value: []`
é vazio válido somente após a consulta ampla aplicável e paginação concluída;
não implica que os demais usuários tenham sido avaliados. Toda falha preserva
`availability`, `coverage`, `freshness`, motivo e resultado; a UI consulta
somente projeções publicadas.

## Fatos derivados localmente e histórico

- `Active File Count` é atividade na janela D180 do Report, distinta de todos
  os arquivos existentes no delta. `Storage Used` mantém o universo de storage
  do Report, que pode incluir versões/lixeira. A normalização não força
  igualdade com contagem/tamanhos do inventário detalhado. A clarificação 5
  definiu todos os drives elegíveis como universo de conteúdo, com cobertura
  própria até bootstrap completo.

- `utilizationPercent` é calculado de bytes usados/alocados somente quando a
  cota alocada é publicada e maior que zero. Faixas de utilização, `activityBand`,
  filtros por data, distribuições por departamento/licença e rankings são
  projeções determinísticas do snapshot; um valor ausente permanece sem
  classificação.
- `capacityForecast` usa os snapshots mensais publicados para a conta, calcula
  crescimento médio diário na janela de até seis meses e aplica a confiança
  definida no contrato. Não é previsão fornecida pelo Graph; menos de dois
  snapshots, cota restante ausente ou crescimento não positivo não produzem
  estimativa.
- Os relatórios Graph são fotografias/relatórios de janela, não uma série
  histórica mensal por conta nem o baseline anterior pronto para cada métrica
  D30. Para satisfazer `storageTrend` de 12 meses e comparações D30, a futura
  projeção precisa reter snapshots tenant-scoped datados dos relatórios e usar
  somente a fotografia efetivamente disponível no mês/âncora. Sem histórico
  suficiente, publicar `partial`/comparação ausente; não reconstruir meses
  anteriores a partir de um único relatório D180.
- Departamento e identidade vêm do enriquecimento de `/users`; o vínculo entre
  a linha de relatório e o usuário deve ser feito no mesmo recorte publicado.
  Licença e status não devem ser inventados quando a correlação ou o catálogo de
  SKUs não for publicado. Situação de retenção por conta, quando houver, depende
  de publicação operacional interna; `accountEnabled` ou usuário excluído não
  provam estado de retenção.
- `Site Id` publicado no relatório prova a presença no snapshot do report;
  ausência isolada não prova desprovisionamento. A descoberta app-only usa a
  coleção `/users/{id}/drives`, com a regra de população/erros acima. A antiga
  operação singular permanece apenas como evidência auxiliar não selecionada.

Snapshots mensais usam a última fotografia factual do mês com sua data de
referência e sem preencher mês faltante. A previsão considera de dois a seis
snapshots mensais reais na janela aprovada: crescimento médio diário é a
diferença entre uso final e inicial dividida pelos dias efetivamente decorridos;
preserva crescimento não positivo como ausência de previsão. Capacidade
restante vem do último par uso/alocação publicado; o horizonte arredonda
para cima com limite inferior zero e confiança usa a quantidade de snapshots
conforme contrato. Reports
novos não reconstroem retroativamente doze meses. Frequência e limiar de frescor
são configuração operacional versionada do módulo; o backend recebe a data do
report e a publicação anterior em vez de afirmar frescor pela hora do request.

### Normalização do horizonte já esgotado — derivação direta, 2026-10-15

**Origem:** `Microsoft365_Onedrive.docx`, tabela de cálculo de Contas e
Armazenamento, parágrafos 259–265 de `word/document.xml`: previsão por espaço
restante dividido pelo crescimento médio diário, com dias, data e
confiabilidade. A clarificação de confiança de 2026-09-14 em `decisoes.md`
define 2–6 snapshots e ausência de previsão para crescimento não positivo.
O [contrato](contratos.md#horizonte-da-previsão-de-esgotamento) fecha o domínio
matemático do horizonte futuro sem modificar essa decisão.

Mapear `Storage Allocated (Byte) − Storage Used (Byte)` para `remainingBytes`,
sem clamp do resultado factual; obter `averageDailyGrowthBytes` dos extremos
mensais com intervalo positivo. Ancorar a previsão na data factual do último
par uso/cota, compatível com a ponta final usada no crescimento, nunca na hora
de coleta ou de renderização. A denominação histórica `daysRemaining` nesta
análise corresponde a `estimatedDays` no contrato já homologado;
`estimatedDate` é sua data calculada, sem introduzir outro campo.

Para `g > 0`, publicar `max(0, ceil(remainingBytes/g))`: restante positivo
produz ao menos um dia; zero ou negativo produz zero dias e a própria data
factual da fotografia. Restante negativo permanece negativo. Não há fonte
para o instante real de cruzamento da cota; a data nessa condição não o
afirma. Menos de dois snapshots, intervalo não positivo, entrada/data ausente
ou inválida e crescimento zero/negativo continuam sem projeção, inclusive
para conta já esgotada. Confiança continua exclusivamente ligada à quantidade
de snapshots. É normalização determinística do prazo até um limite já
alcançado, sem nova API, nova classificação de risco ou aprovação atribuída
ao sponsor.

### Faixas do donut — evidência da homologação histórica, 2026-10-15

**Origem:** reuso do comportamento homologado, não inferência de thresholds
novos a partir de uma API. No app em `3ed550b`,
`resources/js/components/modules/onedrive/accounts-storage-derivations.ts:18–34`
define os predicados `≤50`, `>50 e <80`, `≥80 e ≤95`, `>95`;
`deriveUtilizationDistribution` nas linhas 113–137 conta somente utilizações
publicadas e divide por esse conjunto. O histórico `c633371` e a homologação
registrada em `../frontend-coverage-review.md` sustentam sua preservação.

Aplicar os mesmos intervalos ao donut de Contas e ao agregado global do
Dashboard, cada um sobre seu escopo publicado. A fonte factual continua sendo
bytes usados/alocados do report, com referência `Report Refresh Date`;
identidades ou cotas desconhecidas não são criadas para completar o conjunto.
Calcular percentual com precisão completa antes da classificação: 50 está na
primeira faixa, 80 e 95 na terceira, e valores acima de 100 permanecem na
última. O domínio admissível deriva de bytes não negativos e alocação >0;
ausência, valor inválido ou alocação zero ficam sem classificação. Não há
dedução de faixa a partir do nível: o nível Crítico começa em 95, enquanto a
última faixa começa estritamente acima de 95.

Denominador é o número de contas com utilização avaliável do próprio recorte;
sem classificados não dividir nem redistribuir desconhecidos. Zeros sobre o
conjunto classificado vazio preservam cobertura para informar se a população
é vazia ou apenas não avaliável. Uma população parcial não vira tenant-wide,
e a data é a da publicação, sem recálculo contra o relógio atual. Essas regras
apenas tornam executáveis as faixas preservadas no contrato.
