# Fontes e viabilidade — Arquivos e Conteúdo

## Delta de drive

`GET /users/{user-id}/drive/root/delta` é a **fonte canônica** do inventário factual de itens. A query seleciona `sharepointIds,parentReference` além dos campos de conteúdo já usados. A variante ampliada foi observada por coleta sanitizada em `200 application/json`, `@odata.nextLink`, `value` e ambos os membros nos itens; não foi reexecutada nesta revisão. Outra tentativa retornou `404 ResourceNotFound` porque o usuário não possuía mysite, condição que não equivale a coleção vazia. O resumo de roles indicou `Files.Read.All` ausente nas duas conexões; portanto a observação atesta o contrato query/shape, mas não o consentimento da role mínima documentada pela Microsoft.

`sharepointIds` fornece interoperabilidade SharePoint, não um ID Graph pronto.
`siteId` é o GUID de SPSite; `webId` é o GUID de SPWeb. O `site-id` usado na
lixeira é `hostname,siteId,webId`, com hostname extraído de `siteUrl` publicado
no recurso correlacionado. Sem tupla completa não há chamada de lixeira daquele
drive nem afirmação de vazio. O `Site Id` do report ajuda a correlacionar a site
collection, mas não substitui o `webId`. `parentReference` integra a query final
para localização e relação parental: `id` liga à pasta já publicada e os nomes
na hierarquia local compõem o caminho. O delta não publica
`parentReference.path`, conforme sua documentação; caminhos de descendentes
devem ser recalculados quando uma pasta for renomeada ou movida, mesmo sem
alteração individual desses descendentes. O `driveId` é apenas correlação adicional; a coleção
complementar mantém a identificação de drives sem itens. Quando publicado,
`parentReference.siteId` já é o ID Graph composto e pode ser reutilizado para o
mesmo site correlacionado. Fontes: [itemReference](https://learn.microsoft.com/graph/api/resources/itemreference?view=graph-rest-1.0),
[limitações do delta](https://learn.microsoft.com/graph/api/driveitem-delta?view=graph-rest-1.0#remarks),
[sharepointIds](https://learn.microsoft.com/graph/api/resources/sharepointids?view=graph-rest-1.0)
e [site.id composto](https://learn.microsoft.com/graph/api/resources/site?view=graph-rest-1.0#id-property).

Para identificar o drive mesmo sem itens, a **leitura complementar** escolhida
é `GET /users/{user-id}/drives?$select=id,driveType,sharepointIds,owner,webUrl,system`,
compartilhada com Contas e Armazenamento. A coleta sanitizada observou `200`
OData e `404 ResourceNotFound` por mysite ausente. A Microsoft documenta
`Files.Read.All` e alternativas superiores para aplicação; a ausência da role
mínima no resumo local não comprova ausência dessas alternativas nem bloqueia
o contrato global. `sharepointIds` é a grafia documental; `sharePointIds` foi
observado e é normalizado para o mesmo objeto. Selecionar apenas `business`
não `system`, com vínculo de `owner.user.id` quando presente ou site collection
correlacionada ao report. Proprietário pode faltar; mais de um candidato sem
vínculo único preserva ambiguidade, sem selecionar o primeiro. Identidade e
proprietário são projeções canônicas locais, não nova varredura `/users`.
[List drives](https://learn.microsoft.com/graph/api/drive-list?view=graph-rest-1.0).

A antiga leitura singular `/users/{user-id}/drive` continua como observação
auxiliar `200`/`404`, mas [Get drive](https://learn.microsoft.com/graph/api/drive-get?view=graph-rest-1.0)
atualmente declara aplicação não suportada. Foi substituída na estratégia
app-only, sem usar uma chamada delegated que pode provisionar automaticamente
o drive como teste de existência.

Os GETs de metadados de item e de filhos foram observados com `200 application/json` apenas como verificações auxiliares, usando item resolvido por GET no drive da mesma conexão. Eles não são necessários para o inventário canônico e não devem ser adicionados como varreduras paralelas. A tentativa sem drive/item resolvível não produziu coleta. A operação Simulator `drive-item-delta` é uma alternativa não selecionada e não substitui o delta de raiz aprovado.

Use `Files.Read.All` ou escopo de aplicação superior documentado, consentido pelo administrador. O cursor é opaco: seguir `@odata.nextLink`, promover `@odata.deltaLink` somente após fotografia íntegra, aplicar a faceta `deleted` como tombstone e reiniciar enumeração idempotente em `410 syncStateNotFound`.

O delta satisfaz inventário, tamanho, datas e a evidência para duplicidade: quando disponível no facet `file`, `file.hashes.quickXorHash` permite agrupar arquivos ativos do tenant por igualdade de hash. Não há fallback por nome ou tamanho; pastas, tombstones e itens sem hash ficam fora desse agregado. A faceta `malware` é o sinal factual de infecção de um item; foi revalidada na mesma forma de delta, com `200` OData em uma conexão e `404 ResourceNotFound` por mysite ausente na outra. Ela não representa DLP, conteúdo sensível nem acesso sem uso, que continuam leituras complementares ou indisponíveis.

## Lixeira corporativa

`GET /beta/sites/{site-id}/recycleBin/items` é **leitura complementar** para
descarte, com o ID composto resolvido como acima. A resposta OData documenta
`id`, `name`, `size`, `deletedDateTime` e `deletedFromLocation`; seguir páginas
quando houver. `id` identifica a transação de exclusão, não o `driveItem.id`;
correlação com metadados anteriores exige evidência adicional e não pode usar
igualdade de nome como prova. O agregado representa lixeira atual, não
tombstones nem exclusões permanentes. **Graph `/beta` é aceito pelo projeto**,
com ressalva Microsoft registrada. O `200` não foi observado porque a tentativa
local não resolveu site e a role mínima não foi encontrada. A documentação
primária, metadata beta pinada e Simulator `SUPPORTED` fecham o contrato
externo; essa condição local não é ausência de fonte nem gate adicional de
sucesso real. O OpenAPI mantém `x-observed: false`.

A documentação oficial classifica a rota como Graph `beta`, sujeita a mudança e não indicada pela Microsoft para produção. O projeto aceita essa versão conforme clarificação do usuário acima; a nota oficial é risco conhecido, não critério de bloqueio do projeto. A coleta técnica local não alcançou a rota porque não foi possível resolver um site pessoal e o token não continha `Files.Read.All`; isso documenta uma condição de acesso local, não uma coleção vazia nem ausência global da fonte. O contrato e o Simulator permanecem explícitos sobre a versão `beta`.

`SP.Site.recycleBin` (`GET {site}/_api/site/recycleBin`) é uma candidata
alternativa do SharePoint REST para a lixeira do site. As páginas Microsoft Learn
encontradas pertencem a **Previous Versions** e declaram aplicabilidade a apps de
SharePoint/SharePoint Server 2013; não validam operação em SharePoint Online,
client credentials, permissões do app, paginação, nem o shape necessário ao
contrato. Não entra no OpenAPI selecionado nem no Simulator porque não é a fonte
escolhida. Como o projeto aceita a rota Graph beta, essa alternativa não é
necessária para o gate atual. Só deve ser reavaliada se a fonte beta deixar de
ser aceitável. [SP.Site.recycleBin](https://learn.microsoft.com/en-us/previous-versions/office/sharepoint-visio/jj245316%28v%3Doffice.15%29) e [SP.RecycleBinItemCollection](https://learn.microsoft.com/en-us/previous-versions/office/sharepoint-visio/jj246968%28v%3Doffice.15%29).

## Acesso sem uso

`GET /drives/{drive-id}/items/{driveItem-id}/getActivitiesByInterval(...)` é
**nova coleta justificada**, compartilhada entre os fatos de acesso D90 e o
ledger de acesso de longo prazo; não existe varredura tenant-wide nesta API.
Partir somente de arquivos ativos e drives correlacionados da fotografia
canônica; pastas, tombstones, itens remotos e recursos sem vínculo inequívoco
não ganham estatística de outro item. Não acrescentar chamadas HTTP às páginas.

### Admissão por ação e intervalo

A Microsoft ressalva que agregados podem não estar disponíveis para todos os
tipos de ação. `200` comprova uma resposta HTTP, não completude de `access`.
O schema externo aceita `access`/contadores/datas ausentes ou nulos e a faceta
`incompleteData`. [Função](https://learn.microsoft.com/graph/api/itemactivitystat-getactivitybyinterval?view=graph-rest-1.0),
[estatística](https://learn.microsoft.com/graph/api/resources/itemactivitystat?view=graph-rest-1.0)
e [incompletude](https://learn.microsoft.com/graph/api/resources/incompletedata?view=graph-rest-1.0)
definem as limitações; elas não são corrigidas pelo parser nem pelo Simulator.

| Resposta ou fato observado | Publicação/uso admitido |
| --- | --- |
| `access.actionCount > 0` inteiro e não negativo | Há acesso observado no bucket. Se a resposta for incompleta, o número é apenas contagem observada/lower bound; não contagem exata nem prova sobre outras ações. Esse positivo impede declarar sem acesso no intervalo que o contém. |
| `access.actionCount: 0` explícito | Zero estatístico candidato somente para aquele bucket/ação; exigir datas válidas, recurso correto e ausência de faceta de incompletude. Não preencher buckets ou propriedades ausentes. |
| `access` omitido/nulo ou `actionCount` omitido/nulo | Ação não publicada/não avaliável. `actorCount: 0`, dados de `edit` ou ausência de evento bruto não substituem o contador `access`. |
| `incompleteData` não nulo, inclusive `{}` ou somente `wasThrottled: false` | Bucket incompleto. A faceta em si é o indicador; false não certifica integralidade. `wasThrottled: true` relata dados não gravados; `missingDataBeforeDateTime` relata ausência anterior. Preservar motivo e lacuna. |
| `200 value: []` | Resposta vazia válida de shape, mas sem buckets que comprovem cobertura/zero da ação. `unknown`, não “sem acesso”. A interpretação anterior da amostra vazia como zero foi corrigida. |
| Bucket sem data, com intervalo inválido, fora da janela, sobreposto incoerente ou contador negativo/não inteiro | Erro de contrato/admissão; não publicar zero ou contagem exata. Replays idênticos podem ser deduplicados por item/ação/início/fim, sem somar duas vezes. |
| Falha de página, `401`/`403`/`404`/`429`, timeout, `5xx` ou fonte não disponível para a ação | Não avaliável/partial com motivo. Respeitar retry da fonte e preservar a última publicação; falha não produz ausência de uso. |

O requisito de `>90 dias` usa dois requests contíguos de menos de 90 dias:
`[T-90d,T-1d)` e `[T-1d,T)`, com `interval='day'`, onde `T` fecha um dia UTC
completo. Seguir toda paginação que o provider publicar. Validar a união dos
buckets normalizados contra a janela solicitada, sem lacunas ou inventar
datas/contagens; deduplicar a fronteira, sem soma dupla. Admitir “sem acesso
estatístico em D90” apenas se **todos** os buckets de **ambas** as janelas
publicarem zero explícito de `access` e forem íntegros. O arquivo deve existir
durante a janela avaliada: primeira observação ou criação recente não prova
mais de 90 dias de vida sem acesso. Contagem positiva, idade insuficiente,
coleção vazia, ausência de ação ou qualquer lacuna impedem essa afirmação.
O resultado se limita às ações de acesso publicadas pela fonte, sem certificação
universal de que ninguém interagiu com o conteúdo.

### Reuso, cobertura e horizonte de 400 dias

Reutilizar buckets já admitidos para o mesmo item/ação/janela; não recomputar
história com a data do último request. Após a avaliação inicial D90, consultar
diariamente os dias fechados ainda não admitidos, com overlap de um dia para
deduplicação e detecção de divergência, respeitando o limite de cada request.
Críticos têm prioridade na fila; repetir estatística incompleta não muda sua
classe para zero. Resultados contraditórios de uma janela invalidam a avaliação
até reconciliação. O estado continua datado e sua cadência não é promessa de
completude do serviço.

O ledger de 400 dias registra intervalo solicitado/coberto, ação avaliada,
âncora, recurso/escopo, resultado de admissão, origem/revisão, completude,
paginação, lacunas e última coleta íntegra. O estado mínimo de último acesso
guarda apenas um instante **explicitamente datado** por evento correlacionado;
um bucket positivo só localiza o acesso dentro de `[start,end)`, portanto manter
esse intervalo, sem fabricar um timestamp exato. Reutilizar eventos Microsoft
já normalizados de auditoria quando houver correlação estável, sem novo leitor
do mesmo feed para esta aba. Ausência desses eventos não comprova zero.

`>365 dias` é detector condicional: exigir existência do arquivo anterior ao
início da janela e união contínua de evidências admitidas de **access** durante
todo o período, sem último acesso positivo dentro dele. Registro com intervalo
positivo que cruza a fronteira mantém a resposta desconhecida; só concluir o
limiar quando o limite mais recente possível desse acesso estiver fora da
janela. Comprovar cobertura de ingestão de blobs publicados não comprova todas
as ações que o provider pode ter deixado de produzir. Uma fonte/ação incompleta,
mudança incompatível de semântica, reset, coleta interrompida ou período antes
do onboarding mantém lacuna. Não somar coleções vazias por 400 dias, não
retroagir onboarding e não usar `lastModifiedDateTime` como último acesso.
O ledger viabiliza avaliação quando a evidência existir; não torna essa
estatística universal nem garante que todo arquivo será avaliável.

Nenhuma chamada real adicional foi feita nesta revisão por instrução do usuário.
A assinatura existente foi reutilizada no Simulator como
`graph.v1.onedrive.item-activities-by-interval`, `SUPPORTED`, com cenários
explícitos de zeros integrais, positivos, ausência/nulo de ação ou contador,
vazio, variantes de `incompleteData`, lacunas, paginação e erros. Geração,
inventário, validação, import e smoke passaram. Essa cobertura valida exemplos
HTTP sintéticos; não implementa o ledger/coletor nem comprova integralidade
estatística de uma conexão.

<a id="versoes-por-arquivo"></a>

## Versões por arquivo

`GET /drives/{drive-id}/items/{driveItem-id}/versions` é **leitura complementar**
de estado que o root delta não fornece; não inferir cardinalidade do setting de
retenção, de `eTag`, de rótulo de versão, de tamanho ou do número de snapshots
Orkestria. Selecionar somente arquivos ativos do inventário canônico, com drive
inequívoco. A rota v1.0 suporta aplicação `Files.Read.All` ou permissão superior
documentada; não inclui download, restauração, exclusão nem POST de versão.
Seu contrato/paginação/schema estão em [api.md](api.md#versoes-disponiveis-por-arquivo)
e no OpenAPI; o contrato externo foi documentado por fontes primárias e metadata
pinada, sem executar nova chamada real por instrução do usuário.

### Contagem, detector e ranges

- Ler a coleção e seguir todos os `@odata.nextLink` opacos. A listagem vem da
  versão mais recente para a mais antiga; não emitir `$orderby`, `$count`,
  `$filter` ou `$top` especulativos. A paginação do contrato é confirmada por
  `x-ms-pageable` da metadata; versões podem ter expirado ou sido removidas.
- Deduplicar por `(driveId,itemId,version.id)` opaco dentro da enumeração.
  `51.0`, `10.7` ou `1.0` são identificadores, não contadores nem ranges
  sequenciais. Não adicionar versão atual que não veio na coleção e não
  fabricar IDs para preencher lacunas. ID omitido/nulo ou páginas incoerentes
  impedem uma contagem exata; metadados opcionais ausentes não anulam ID válido.
- `versionCount` é a cardinalidade de versões disponíveis retornadas na
  enumeração concluída, com sua data/escopo. Não é total histórico de versões
  criadas, número de edições, total de versões principais nem conformidade do
  setting manual de **500 versões da R4**. Todos os IDs listados participam;
  não excluir publicações/rascunhos sem regra adicional de produto.
- Aplicar `>50` estritamente: 50 não dispara; 51 dispara. A operação não altera
  o baseline500 nem impõe365 dias de expiração. O limite é configurável e sua
  versão acompanha o sinal. `200 value: []` concluído é zero versões retornadas
  nessa consulta, não ausência de arquivo ou ausência universal de histórico.
- Uma leitura parcial que já encontrou 51 IDs distintos comprova apenas
  `atLeast: 51` e o predicado positivo `>50`; quantidade exata permanece
  ausente até concluir todas as páginas. Com 50 ou menos e página pendente,
  não afirmar “sem versões excessivas”. Falha ou acesso insuficiente preserva
  estado desconhecido/última contagem datada, nunca zero.
- Não prometer snapshot atômico do histórico em paginação concorrente. Se o
  ciclo de inventário revelar arquivo alterado durante a enumeração, invalidar
  a avaliação para a geração nova e repetir o leitor de versões; ausência de
  mudança não prova que retenção automática não aparou versões. O resultado
  sempre declara referência e limite temporal da leitura.

### Cadência e reuso

Fazer um bootstrap paginado de versões para todos os arquivos elegíveis da
população contratada, com cobertura própria, em fila limitada pelo throttling.
O delta diário enfileira novos/alterados e invalida a relação da contagem antiga
com a nova revisão do arquivo. Reusar a última contagem íntegra datada para
arquivo não alterado, sem apresentá-la como leitura corrente. Reavaliar todo o
escopo ao menos semanalmente, inclusive arquivos não alterados, porque trimming
de versões pode ocorrer sem nova edição; críticos têm prioridade e revisão
semanal mínima conforme estratégia aprovada. Não disparar leitura por filtro,
ordenação, navegação ou abertura de detalhe. `429` respeita `Retry-After`, retoma
a mesma página e não promove o cursor/resultado incompleto. Arquivo excluído
sai do detector ativo; a contagem histórica expira com o histórico aprovado,
sem restaurar versões eliminadas nem apagar estado corrente por idade do
arquivo.

A operação `graph.v1.onedrive.drive-item-versions` está `SUPPORTED` no Simulator
com fixtures de 0/50/51 versões, paginação, IDs opacos não sequenciais,
duplicata/replay entre páginas e erros `401`/`403`/`404`/`429`/`503`. Geração,
inventário, validação, import e smoke passaram. Trata-se de cobertura sintética
de contrato, sem dados reais ou collector pronto. A decisão de
fonte está sustentada; a disponibilidade inicial depende da futura integração
por conexão, não de exigir um novo `200` em cada tenant para o Discovery.

## Limites das lacunas restantes

Para OneDrive corporativo, a operação de restauração e a opção
`includeDeletedItems` são restritas ao OneDrive pessoal. A rota `recycleBin`
em Graph v1.0 é de SharePoint Embedded; a rota de site usada para descarte é a
variante Graph `beta` documentada acima.

## Sensibilidade por item

`POST /drives/{drive-id}/items/{driveItem-id}/extractSensitivityLabels` é a fonte
aprovada para rótulos efetivamente aplicados ao arquivo. A rota v1.0 não recebe
body, requer `Files.Read.All` como permissão mínima de aplicação e devolve `sensitivityLabelId` e
`assignmentMethod`. Ela consulta metadados já extraídos e, quando estiverem
defasados do conteúdo do arquivo, atualiza-os antes de responder; portanto não
é uma leitura passiva.

A decisão A limita a execução ao lote de arquivos ativos pertencentes ao escopo
declarado antes da coleta. Não há chamada originada pela UI, descoberta implícita
de escopo, inclusão de pasta/tombstone ou retry automático de `423 Locked`.
Extensão não suportada, item bloqueado, falha de extração ou acesso insuficiente
preservam cobertura/indisponibilidade por item. A validação técnica temporária
não executa POST contra o provider por desenho; portanto, a resposta `200`
continua sem observação técnica local. O Simulator serve a mesma assinatura
POST com respostas inteiramente sintéticas, sem essa restrição de verbo.

O contrato externo documentado e o `mutation_approved` vigente fecham a fonte
para implementar o coletor controlado. A falta de POST real executado não muda
a categoria para `validation_required`: os controles já aprovados definem o
escopo, e a primeira execução de produção deve publicar resultado/cobertura
por item. `200 value.labels: []` é ausência factual de rótulo apenas para item
avaliado com sucesso, não para extensões ignoradas ou falhas. DLP exige alerta
correlacionado ao item; catálogo de labels sozinho não prova detecção DLP.

## Cobertura sintética

O Simulator possui operações `SUPPORTED` para delta de raiz, identificação do
drive por usuário, delta por item, GET de metadados/filhos, lixeira `beta`,
buckets de atividade por item, versões disponíveis por arquivo e extração POST
de rótulos. O inventário mantém a
request externa `GET /users/{user-id}/drive/root/delta` e o contrato canônico
de delta, preservando aliases internos somente onde o matching do Microcks
exige. Query/fixture do root delta incluem `sharepointIds`; o handoff desta
revisão amplia a mesma operação com `parentReference`, cuja query já teve
observação técnica equivalente, para localização e pastas. A paginação
seleciona uma segunda página distinta. A leitura `/users/{user-id}/drive`
também tem cenários provisionado e não provisionado, mas é evidência auxiliar
não selecionada para app-only. A fonte selecionada é a coleção `/users/{id}/drives`,
com operação sintética SUPPORTED nesta revisão. O root delta final inclui
`sharepointIds,parentReference`, hierarquia por IDs e paginação. Os gates
`generate`, `inventory`, `validate`, import e `smoke` passaram;
não comprovam acesso
de tenant nem exigem role mínima quando o contrato aceita uma superior. As operações de delta
por item e GET de metadados/filhos são extras não requeridos pelo fluxo aprovado.
As fixtures sintéticas exercitam cenários sem alegar conteúdo de customer.

Fechamento A7/A8 em 2026-10-14: a operação de estatística foi ampliada por
reuso e a de versões foi incorporada com a mesma fonte pinada. O handoff
obrigatório terminou com `contracts:generate` (68 paths Graph v1.0 e 2 beta),
`inventory` (87 operações/53 Graph path literals), `validate` (87 operações,
cinco contratos e rewrites), import dos cinco serviços, `smoke` e
`git diff --check` aprovados. Esses totais são do Simulator inteiro, não número
de fatos OneDrive nem cobertura real de tenant. O OpenAPI desta aba passou
`SwaggerParser.validate` 12.1.0, com sete operações de sucesso tipadas e
parâmetros de path obrigatórios declarados; a descrição YAML da rota singular
auxiliar foi corrigida sem mudar a fonte app-only selecionada.

## Mapping completo e publicação

| Fato do contrato | Fonte/normalização e cobertura |
| --- | --- |
| Itens ativos, nome, tamanho, criação/modificação, tipo | Estado final do root delta por `(driveId,itemId)`. Facetas determinam arquivo/pasta/tombstone; campos omitidos em delta preservam metadados anteriores. Itens remotos não são duplicados como conteúdo local de outro drive. |
| Proprietário/departamento e localização | Vínculo do drive com a fotografia canônica de identidade; caminho reconstruído por `parentReference.id` e hierarquia já publicada, porque `parentReference.path` não é fornecido pelo delta. O nome do arquivo/pasta compõe o segmento final. Pasta desconhecida não recebe caminho inventado. Renomeação/mudança de pai recalcula os descendentes da mesma geração; não exige outro GET por item. |
| Itens excluídos | Tombstone remove o item do inventário ativo e preserva metadados previamente publicados no arquivo histórico local. O delta entrega estado recente, não todos os eventos nem data factual de cada exclusão. |
| `contentSummary` total/ativos/bytes | Os totais tenant-wide usam o mesmo snapshot de report de Contas e Armazenamento e reconciliam seus valores. Contagem detalhada do inventário só é tenant-wide quando todos os drives da população declarada estão completos; não substituir total do report por soma de escopo parcial. |
| Criados/modificados/excluídos em D30 | Datas factuais dos itens para criação/última modificação; exclusão requer `deletedDateTime` da lixeira ou evento de auditoria explicitamente correlacionado. Não usar horário de coleta de tombstone como horário de exclusão. Se não houver história/correlação suficiente, publicar métrica ausente/parcial. Delta não permite contar todas as edições ocorridas entre dois ciclos. |
| Sensibilidade e `analyzedAt` | Resultado de extração no escopo aprovado, catálogo canônico de labels e instante real da análise concluída. `detectedByDlp` vem de alerta/avaliação com vínculo explícito; ausência de alerta ou catálogo não vira false. |
| Acesso sem uso D90 e detector >365 dias | Buckets explícitos de `access` admitidos pelo protocolo desta fonte; ausência/incompleteData/coleção vazia não são zero. Ledger400 guarda intervalos e lacunas, sem inventar timestamp de último acesso ou completude universal. Publicar não avaliável quando qualquer pré-requisito do intervalo faltar. |
| Detector >50 versões | Leitura complementar paginada de versões disponíveis por arquivo, IDs opacos deduplicados e limiar estrito. Contagem exata só com enumeração íntegra; 51 IDs já observados permitem apenas lower bound positivo em leitura parcial. Não usar setting500, sufixo do ID ou snapshots como quantidade. |
| Malware/risco | Faceta `malware` e alertas correlacionados fornecem evidência factual; nível final usa regra local versionada aprovada. Extensão/nome/idade não afirmam infecção. |
| `disposal` e descartados | Snapshot paginado da lixeira; quantidade e bytes apenas dos sites concluídos. A API não publica data de eliminação permanente. Q5 define `permanentDeletionAt` como estimativa da janela padrão: data original factual de exclusão +93 dias UTC. Exigir evidência da exclusão original; estágio dois não reinicia o prazo. Sem essa evidência, nulo; manual/quota podem antecipar, preservação pode manter cópias. Nunca afirmar data real/agendamento confirmado. |
| `duplicates` e economia potencial | Agrupar ao menos dois arquivos ativos com `quickXorHash` igual, conforme contrato. `verifiedAt` é o instante em que a projeção agrupou os itens da geração coerente, não verificação byte a byte. Economia potencial = soma dos bytes publicados do grupo menos os bytes da maior cópia; se faltar tamanho, manter o valor ausente. Não promete economia real nem executa exclusão. |
| Análises, rankings, filtros e recorte | Projeções locais da mesma geração/escopo detalhado; respeitar nulos e cobertura. Percentuais exigem denominador factual >0; filtro temporal usa a âncora própria da fonte. |
| Comparações D30 | Snapshot anterior efetivamente publicado; sem baseline, comparação ausente. Sem doze meses observados, histórico parcial. |
| `quickActions` | Conteúdo estático aprovado sem execução administrativa. |

A clarificação 5 foi resolvida pela leitura da imagem solicitada pelo usuário:
B, todos os drives empresariais elegíveis. A imagem usa o mesmo universo global
em KPI/distribuição, com filtros de todos os proprietários/departamentos. As
camadas do DOCX determinam prioridade/cadência técnica sem limitar o universo
final contratado. Reports fornecem totais globais; bootstrap completo + delta
diário fornecem inventário/total filtrado/análises. Permissões dos compartilhados
atualizam a cada 6h; lixeira de todos os sites elegíveis, diariamente. Rótulos
abrangem todos os arquivos ativos suportados, com lotes declarados antes da
extração controlada. Inicialmente avaliar todo o conjunto; depois reavaliar
arquivos alterados/novos e revisar críticos semanalmente, sem repetir extração
desnecessária de arquivo não alterado e resultado ainda válido.

Críticos usam utilização >=90%, caso técnico de desligamento ou risco
alto/crítico/malware/quarentena confirmados, com identidade factual. Reavaliar
diariamente. Falha/ambiguidade de drive ou página pendente mantém partial e
escopo explícito; não restringir a população a quem retornou sucesso nem
declarar tenant-wide até concluir todos os elegíveis. Estado corrente ativo
permanece enquanto monitorado até tombstone/reconciliação legítima; o TTL de
histórico não apaga arquivo que deixou de mudar. `Active File Count` do report
D180 mede atividade naquele período; status `active` do inventário mede
existência, e os totais não precisam coincidir. `Storage Used` do report pode
incluir versões/lixeira; não reconcilia com soma de tamanhos correntes.

Janelas Graph de acesso de 90 dias são sinal daquele intervalo. A regra do
DOCX sem acesso >365 dias exige ledger de cobertura e estado mínimo de último
acesso mantidos por 400 dias; não é derivada de uma consulta vazia de 90 dias.
Sem cobertura suficiente, esse detector fica não avaliável.

O delta é fonte de **estado**, não event log: seguir links opacos, deduplicar
por drive/item com a última ocorrência do ciclo, manter tombstone e promover
cursor/fotografia juntos após todas as páginas. Em `410`/`syncStateNotFound` ou
códigos de resync documentados, enumerar novamente de forma idempotente e
preservar a última publicação com frescor degradado até concluir. Reset não
reconstrói eventos perdidos. `401`/`403`, `404` ambíguo, `423`, `429`, timeout e
`5xx` nunca produzem zero ou remoção de dados por falha de fonte. Snapshot da
lixeira tem cobertura própria, e um `404` não significa lixeira vazia. Cada
publicação registra âncora, escopo candidato/concluído, falhas por motivo,
último sucesso e dependências; a UI usa somente a publicação local.

## Fatos derivados localmente e limites

### Fronteiras das distribuições — derivação da homologação, 2026-10-15

**Origem:** comportamento histórico do app em `3ed550b`,
`resources/js/components/modules/onedrive/files-content-derivations.ts`:
`deriveContentAnalytics` (linhas 78–98), `aggregateCount` (177–200),
`sizeCategory` (289–315) e `ageCategory` (317–347), introduzidos em `61a365a`;
homologação registrada em `../frontend-coverage-review.md`. Essa leitura não
altera app ou fixtures e não transforma seus valores sintéticos em dados
de produção. A evidência fixa a **regra já executada**, preservada na
[tabela semântica](contratos.md#fronteiras-das-distribuições-de-tamanho-e-antiguidade).

Mapear o tamanho factual do inventário para bytes, sem converter para decimal:
cortes `1024²`, `10×1024²`, `100×1024²`, `500×1024²`, `1024³`. As comparações
são `>` em ordem decrescente; portanto o limite exato fica na categoria
anterior. Zero e exatamente `1024²` entram em `< 1 MB`; `1024³` entra em
`500 MB a 1 GB`. Os nomes MB/GB são preservados como labels históricos de
unidade base1024, sem substituir o fato em bytes ou redesenhar as categorias.
Ausência/tamanho inválido fica fora somente desse agregado; não vira zero.

A data factual `lastModifiedDateTime` alimenta `modifiedAt`. A âncora é
`availability.contentItems.asOf`, repassada pelo consumer
`files-content-tab.tsx:53–75,263`; usar o instante publicado da mesma geração,
não horário de request. A fórmula executada arredonda a idade para baixo em
dias de 86.400 segundos; compara `>182`, `>365`, `>730` e `>1095`, nessa
ordem lógica de faixas. Assim 182/365/730/1095 ficam na faixa inferior,
183/366/731/1096 na seguinte. Dias fracionários não antecipam o corte.
Valores de modificação posteriores à âncora caem historicamente na primeira
faixa por `d < 0`; o filtro temporal, se ativo, já exige data `≤asOf`. Sem data
ou âncora válida, não há idade categorizada, mesmo que o filtro sem âncora
preserve o inventário por sua regra própria.

Aplicar os agregados ao inventário filtrado completo antes de paginar, dentro
da cobertura realmente publicada e com o status selecionado; itens excluídos
só conservam atributos cuja evidência foi preservada. Não reconstruir o
inventário a partir dos Reports nem somar tamanhos correntes para substituí-los.
`aggregateCount` ignora categoria ausente e não cria faixas vazias. Cada
distribuição mantém seu conjunto avaliável e cobertura: desconhecido em uma
dimensão não remove o item da outra; eventual participação divide pelo seu
próprio conjunto avaliável e não divide por zero. Tamanho e antiguidade são
classificações descritivas, sem inferência de risco ou inatividade por acesso.

### Demais projeções e limites

- **R2 aceita:** normalizar residual conforme o objeto do contrato. Arquivo
  com avaliação concluída sem achado adverso pode ser Informativo; Baixo pode
  vir de ao menos uma exposição atual confirmada, todas avaliadas como Baixo,
  sem regra superior própria. Reusar inventário, permissões, labels e alertas
  correlacionados; extensão ou ausência de alerta não atestam arquivo limpo.
  Dado obrigatório ausente mantém não classificado. Registrar revisão e
  cobertura; essa regra local não exige nova API nem altera o provider.

- Distribuições por tipo/extensão, tamanho e antiguidade, percentuais, totais,
  top extensões/pastas/arquivos e filtros são agregações locais do inventário
  publicado. A classificação não converte extensão em ameaça; risco só usa
  evidência publicada por malware, rótulo/alerta ou outra fonte explicitamente
  mapeada.
- Duplicidade é agrupamento local de `quickXorHash` igual e não vazio em ao
  menos dois arquivos ativos. O hash não é publicado como fato de interface e
  não há fallback por nome ou tamanho. `detectedByDlp` requer alerta com vínculo
  explícito ao item; catálogo de rótulos ou categoria de arquivo não prova DLP.
- KPIs comparativos D30 dependem de snapshots locais do inventário/summary.
  Delta e relatórios trazem o recorte corrente, não o baseline histórico pronto;
  sem snapshot anterior a comparação fica ausente.
- `quickActions` é conteúdo estático sem API, handler ou efeito de backend.
  Extração de rótulos é uma operação POST controlada do futuro coletor: usa
  somente o escopo aprovado de arquivos ativos e preserva desconhecido para
  falha, `423`, extensão não suportada ou falta de acesso; não é chamada pela
  interface.
- `disposal` usa a rota Graph beta aceita pelo projeto. A resposta `200` ainda
  não foi observada porque a coleta técnica não resolveu `site-id`; a ausência
  da role mínima em uma conexão é condição operacional local. A estratégia
  implementável usa o contrato documentado, ID composto, cobertura e erros.
  `SP.Site.recycleBin` (`/_api/site/recycleBin`) é apenas uma alternativa
  SharePoint REST encontrada em documentação Previous Versions, não validada
  para SPO/app-only e desnecessária enquanto a rota Graph beta for aceita.
  Ausência de resultado não pode ser publicada como lixeira vazia.
