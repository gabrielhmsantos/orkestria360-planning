# Defaults e clarificações do backend OneDrive

Este é o roteiro de clarificação do Discovery único. Decisões aceitas são
registradas também em `decisoes.md`/`contratos.md` da aba correspondente; uma
proposta neste arquivo não é aprovação do sponsor. O objetivo é fechar fonte,
mapping, estratégia e comportamento inicial das oito superfícies para
`backend_implementation_ready`, sem exigir histórico ou collector já implantado.

## Evidência do sponsor relida

Fonte: Microsoft365_Onedrive.docx (referência histórica não disponível neste escopo),
documento completo, incluindo tabelas. As imagens/decisões anteriores continuam
referências de composição, e seus números não são valores observados do tenant.

| Seção | Regra presente | Lacuna encontrada |
| --- | --- | --- |
| 1 e 2 — contas | Atividade D30/D90/D180; cota 80/90/95%; crescimento D30 maior que 3× média de 6 meses; esgotamento = restante / crescimento diário | Operação inicial e preservação de histórico precisam de estratégia; fórmula/confiança já estão no contrato de Contas. |
| 3 — conteúdo | Grande >1 GB; antigo >3 anos; sem acesso >365 dias; >50 versões; extensões geram recomendação, não malware | Cobertura do inventário e do período precisam ser explícitas. |
| 4 — compartilhamento | Classificações crítico/alto/médio enumeradas; MVP somente leitura | Parte das categorias exige dados/contexto que podem estar desconhecidos; falta default de classificação residual. |
| 5 — sincronização | Combinar Reports, auditoria, Intune e telemetria; publicar quando disponível | Não define série de ocorrências de erro por 12 meses; Data Connect traz contagens de janela móvel. |
| 6 — desligamento | Inclui desabilitados/excluídos/sem licença; workflow próprio; exclusão próxima <=15 dias com transferência não concluída | Não define X dias de bloqueio nem duração universal de retenção. HR foi excluído pelo usuário. |
| 8 — auditoria | >500 arquivos baixados/30 min; >100 excluídos/15 min; >20 compartilhamentos externos/60 min; atividade com conta desabilitada; ransomware com três fatores | Não define prazo para retenção/exclusão dos eventos locais nem toda a severidade dos detectores. |
| Estratégia de coleta | Eventos 15/30 min, permissões 6h, relatórios/snapshots diários, inventário crítico semanal | Lifecycle e tratamento de ausência/primeira publicação precisam fechar a estratégia. |

O DOCX não estabelece retenção local de eventos do Orkestria. A imagem 06 mostra
90 dias geral, 180 dias para cargos críticos, **730 dias** legal/compliance e
30 dias após a retenção para usuários excluídos, com rodapé de política
Orkestria sujeita a aprovação. Os **7 anos** do pacote Q2 foram uma proposta
do agente aceita pelo usuário, não um valor da imagem. Essa atribuição incorreta
foi identificada na releitura de 2026-10-14 e corrigida pela R1 aceita na revisão
abaixo. Retenção de conteúdo e retenção do feed têm origens distintas; nenhum
dos números é apresentado como prazo legal universal.

## Clarificação 1 — desligamento sem HR: aceita A

**Decisão do usuário, 2026-10-14:** bloqueio observado continuamente por 7 dias +
OneDrive existente gera caso técnico presumido. Reativação encerra o episódio.
Exclusão técnica correlacionada entra imediatamente; remoção de licença é sinal
separado. Primeira observação não é data de saída nem de bloqueio real retroativo.
Dados humanos de transferência, responsável, aprovação, ticket e progresso
desconhecidos permanecem nulos/sem publicação. Ver
[decisões](usuarios-desligados-e-retencao/decisoes.md).

## Clarificação 2 — retenção e regras de risco: aceita A

**Decisão do usuário, 2026-10-14:** pacote comum integral aprovado com retenção
de eventos/JSON sanitizado por **90 dias**. As opções B/C abaixo ficam apenas
como histórico da pergunta, não como alternativas ativas.

As alternativas diferem pelo prazo de eventos. O pacote comum abaixo fecha
classificação, snapshots e distinção entre retenção local e conteúdo Microsoft.

| Opção | Eventos normalizados e JSON sanitizado | Proposta |
| --- | --- | --- |
| A — recomendada | 90 dias pelo instante do evento | Atende os recortes D1/D7/D30/D90 aprovados e evita conservar detalhe pessoal além da janela de investigação do produto. |
| B | 180 dias pelo instante do evento | Mantém mais detalhe para investigação retrospectiva, sem ampliar os filtros da UI atual. |
| C | 365 dias pelo instante do evento | Mantém um ano de detalhe, com maior volume e conservação de dados pessoais, sem ampliar os filtros da UI atual. |

### Pacote comum de retenção

- Snapshots diários de contas, permissões, postura, dispositivos e casos: 400
  dias. Rollups mensais: 13 meses, suficientes para 12 pontos e a âncora anterior.
  Guardar somente metadados necessários, sem conteúdo de arquivos nem URLs
  autenticadas do provider. Meses anteriores à primeira coleta permanecem sem
  valor; não completar história com zero.
- JSON do detalhe é sanitizado e limitado aos atributos aprovados. Eventos e
  detalhe expiram juntos no prazo escolhido; exclusão local roda diariamente.
  Esta regra não envia exclusão à Microsoft nem altera retenção Purview.
- Estado mínimo de última visualização/download por item e ledger de cobertura
  podem durar 400 dias, sem conservar todos os eventos brutos. A regra sem
  acesso por 365 dias só é avaliável com cobertura suficiente do item/categoria;
  primeira observação recente não prova um ano sem acesso.
- **Atualizado pela R1 aceita nesta revisão:** o baseline recomendado Orkestria
  é 90 dias geral, 180 dias para cargo explicitamente classificado crítico e
  730 dias somente para exceção legal/compliance aprovada. Risco crítico do
  caso não prova cargo crítico. Sem classificação/aprovação, não aplicar a
  exceção nem fabricar responsável, transferência ou prazo individual.
- A quarta regra visual é carência **local recomendada** de 30 dias após o
  encerramento factual/aprovado da retenção, para usuário excluído. Não garante
  extensão de armazenamento Microsoft. Configuração/ciclo técnico do tenant
  são fatos separados. Retenção/exclusão efetivas só recebem data com evidência
  suficiente do ciclo aplicável; bloqueio não inicia cleanup Microsoft e
  remoção de licença não confirma data de exclusão.
- Sem confirmação de transferência, o processo não é concluído. Uma data-base
  calculada de retenção Microsoft é estimativa do ciclo padrão, com origem
  explícita; Purview/eDiscovery podem alterar o prazo. Sem evidência de holds,
  não publicar essa estimativa como exclusão programada confirmada.

Fontes técnicas: [retenção e exclusão OneDrive](https://learn.microsoft.com/en-us/sharepoint/retention-and-deletion),
[configuração para usuários excluídos](https://learn.microsoft.com/en-us/sharepoint/set-retention).
O default Microsoft de 30 dias não substitui a leitura da configuração do tenant;
bloqueio, licença removida, exclusão de usuário e lixeira são estados distintos.

### Pacote comum de classificação default-v1

São regras locais explicáveis, configuráveis/versionadas e sem bloqueio
automático. Limiares numéricos explicitamente dados pelo DOCX são reutilizados;
os demais itens abaixo são propostas do agente.

| Nível | Evidência necessária e regra |
| --- | --- |
| Crítico | Link anônimo com escrita; conteúdo confidencial exposto anonimamente; domínio explicitamente bloqueado; conta bloqueada com qualquer atividade OneDrive posterior ao bloqueio observado; malware confirmado ativo; >100 arquivos distintos excluídos pelo mesmo ator em 15 min. |
| Crítico — possível ransomware | >100 arquivos distintos modificados/renomeados em 15 min + mudança para extensão `.locked`, `.locky`, `.encrypted`, `.crypt`, `.crypto` ou `.enc` + dispositivo correlacionado com risco alto confirmado. É sinal de possível incidente, não veredito de malware. Todos os fatores são obrigatórios. |
| Alto | >500 arquivos distintos baixados pelo mesmo ator em 30 min; >20 compartilhamentos externos confirmados pelo mesmo ator em 60 min; link externo sem expiração; escrita para convidado; conteúdo sensível externo; >100 modificações/renomeações em 15 min sem evidência completa do detector ransomware. |
| Médio | Link organizacional amplo; permissão externa direta individual; acesso externo sem revisão/atividade há >90 dias somente com histórico suficiente; extensão de avaliação `.exe`, `.ps1`, `.bat`, `.cmd`, `.js`, `.vbs`, `.iso` ou `.img` conforme DOCX. Extensão sozinha não é malware. |
| Baixo — atualizado pela R2 | Evento rotineiro com sucesso explícito e contexto avaliado; ou compartilhamento restrito/revisado, destinatário autorizado e leitura, com expiração <=30 dias quando externo. Arquivo pode herdar Baixo de ao menos uma exposição atual confirmada, todas avaliadas como Baixo, sem regra superior própria. |
| Informativo — atualizado pela R2 | Arquivo avaliado sem achado adverso; registro de encerramento comprovado sem exposição remanescente; ou evento rotineiro conhecido com resultado não publicado. Não certifica segurança global nem afirma sucesso ausente. Critérios e contexto mínimo estão em R2. |
| Não classificado | Operação/contexto insuficiente ou dado obrigatório desconhecido. Risco permanece sem valor; denominador de distribuição é a população avaliada, com coverage explícita. Nunca converter desconhecido em baixo risco. |

Detecção por ator e tenant, janela móvel UTC `(t-duração, t]`, deduplicação por
ID de evento e identidade de arquivo. Contar arquivos distintos por ID
correlacionado ou ObjectId inequívoco; sem identidade estável, o detector fica
não avaliável. Compartilhamentos requerem destino externo comprovado. Eventos
repetidos/tentativas sem sucesso não são duplicados de arquivos nem exposições
atuais. Resultado ausente permanece desconhecido; não impede contar uma operação
auditada canônica como evento registrado, nem autoriza rotulá-la como sucesso.
A severidade é a maior regra satisfeita;
empate ordena instante decrescente e depois ID estável. Não há média numérica de
severidades. Armazenar regra/versão/evidências usadas; comparações entre versões
incompatíveis ficam não publicadas.

Detecção agrupada referencia os eventos Microsoft de origem. Não incrementar
o total de eventos com um evento de provider inventado `BulkDownload` ou
`BulkDeletion`; esses códigos podem nomear o sinal derivado e sua recomendação.

## Clarificação 3 — série de sincronização: aceita A

**Decisão do usuário, 2026-10-14:** última fotografia diária íntegra de cada
mês, com a legenda “Erros reportados nos 30 dias até a data do snapshot”.
O pacote comum de perfil imutável/primeira extração completa também foi aceito.
As opções B/C são somente histórico da pergunta, não alternativas ativas.

O dataset Errors fornece contagem de erros reportados nos últimos 30 dias,
por dispositivo/tipo, sem timestamp de cada ocorrência. A série original de
ocorrências mensais não pode ser calculada somando fotografias sobrepostas.
As três alternativas publicam 12 posições mensais, com unidade e referência
explícitas, mantendo janela fixa independente de D7/D30/D90/D180.

| Opção | Medida mensal completa |
| --- | --- |
| A — recomendada | Última fotografia diária íntegra de cada mês: somar `ErrorCount` dos pares dispositivo/tipo deduplicados daquele run; descrever como erros reportados nos 30 dias até a data do snapshot. Nunca somar runs nem pontos mensais como ocorrências anuais. |
| B | Média das contagens de fotografias diárias íntegras do mês, calculada pela soma dos totais de cada run dividida pelo número de dias observados; uma fotografia mais recente por dia. Descrever como média diária de erros reportados na janela móvel de 30 dias, arredondada a uma casa decimal. |
| C | Maior contagem observada em uma fotografia diária íntegra do mês; descrever como pico mensal de erros reportados na janela móvel de 30 dias. Empate usa a fotografia mais recente. |

Comum: chave de erro/dispositivo é obtida do perfil validado da origem; não
confundir códigos/títulos iguais com identidade universal nem multiplicar
registros duplicados. Mês sem snapshot íntegro fica sem valor; mês com apenas
parte das datas observadas declara coverage parcial e a data de referência.
Valor zero só é publicado quando a fotografia completa comprovar zero, nunca
pela ausência de export. **Atualização R3 aceita:** a série azul usa clientes
observados do Health, enquanto arquivos sincronizados dos Reports permanecem
indicador separado. A série de erros não equivale a quantidade de falhas
ocorridas no mês. Não usar `TotalErrorCount` do Health como substituto oculto.

**Estratégia técnica comum:** selecionar a exportação JSON Data Connect da
origem, não um endpoint REST. O catálogo atual recomenda Errors_v1, mas seu
link primário de schema aponta ao documento intitulado v0. O leitor será
tipado por perfil imutável de entrada obtido do Schema oficial no onboarding,
com versão, colunas/tipos, conversões sem perda, procedência e hash explícitos.
Sem perfil validado e primeira extração completa validando dispositivo, chave/
código de erro, título, descrição e recorrência, a coleção de erros não é
publicada. Divergência bloqueia promoção e conserva a última publicação válida.
Não afirmar v0=v1; um manifesto local é da integração Orkestria, não uma resposta
inventada da Microsoft. Essa estratégia preserva o outcome completo com
pré-requisitos por conexão; não reivindica adapter estático v1 validado.

Fontes e investigação: [API/schema](atividade-e-sincronizacao/api.md) e
[perfil/importação](atividade-e-sincronizacao/fontes-e-viabilidade.md).

## Clarificação 4 — baseline de configurações: aceita A

**Decisão do usuário, 2026-10-14:** A — colaboração controlada, convidados
autenticados com allowlist e links anônimos somente leitura, até 30 dias.
Aceitos também os 20 itens, a semântica dos fatos complementares e todos os
critérios/ausências/cálculos abaixo. B/C ficam como histórico da pergunta.

**Origem:** DOCX §7 fornece controles e pesos, mas não a avaliação executável de
cada dimensão nem política universal dos 20 itens. A imagem é baseline de
fixture. As regras desta seção são **propostas do agente aceitas pelo usuário**,
não política observada nem decisão retrospectiva do sponsor.

Recomendação **A**, preservando colaboração da referência, somente leitura
anônima com prazo e convidados autenticados. B elimina links anônimos; C
restringe colaboração a pessoas internas. As três opções aceitam integralmente
os 15 itens comuns, a semântica dos fatos e os dois cálculos abaixo.

| Opção | `external-sharing` / `guest-access` | `anonymous-links` / `anonymous-edit-links` | `allowed-domains` |
| --- | --- | --- | --- |
| A — colaboração controlada, recomendada | Convidados autenticados, novos/existentes, sujeitos às restrições explícitas do tenant | Permitidos somente leitura; edição bloqueada; máximo 30 dias | Allowlist explícita não vazia para destinatários autenticados externos; não afirma restringir quem usa link anônimo |
| B — somente externos autenticados | Convidados autenticados, novos/existentes, sujeitos às restrições explícitas do tenant | Bloqueados; edição bloqueada | Allowlist explícita não vazia para destinatários externos |
| C — somente interno | Compartilhamento externo e acesso de convidados bloqueados | Bloqueados; edição bloqueada | Restrição externa desabilitada por não haver colaboração externa; listas armazenadas não são autorização de acesso |

### Itens comuns dos quatro grupos

A tabela fecha os demais IDs; os cinco IDs da tabela anterior não são
recontados. São recomendações Orkestria, nunca fallback para valor atual.

| ID | Regra recomendada / significado |
| --- | --- |
| `default-link-type` | Pessoas específicas, distinguindo de pessoas com acesso existente |
| `default-link-expiration` | 30 dias recomendado/máximo para links anônimos quando habilitados; com capacidade anônima bloqueada, mostrar não aplicável à criação de link anônimo, com evidência do bloqueio |
| `unmanaged-device-sync` | Exigir dispositivo conforme e gerenciado no acesso de clientes de sincronização; avaliar enforcement e população coberta, não simples ingresso no domínio |
| `offline-access` | Permitido somente a clientes gerenciados/conformes no escopo observado; não existe fato global inferido a partir de uma flag de biblioteca; sem avaliação completa, valor atual desconhecido/parcial |
| `download-limit` | Detector **Orkestria**, ativo para >500 arquivos distintos/30 min por ator, sem bloqueio automático; não é configuração de throttling Microsoft |
| `block-download` | Recomendado no escopo protegido: OneDrive de caso técnico de desligamento ou com conteúdo confidencial confirmado; exceções explicitamente aprovadas ficam declaradas. Não afirmar aplicação global; o valor atual requer controles por site/escopo e licença pertinente |
| `known-folder-move` | Desktop, Documents e Pictures protegidas nos clientes Windows elegíveis que suportem as três pastas; outros clientes são excluídos explicitamente do denominador |
| `legacy-authentication` | Bloqueada para SharePoint/OneDrive |
| `conditional-access` | Política em enforcement cobrindo acesso OneDrive da população interativa; report-only não é aplicação; exceções/condições não resolvidas impedem avaliação global |
| `mfa-required` | MFA obrigatório na população interativa OneDrive; escopo e operador dos controles devem garantir MFA, não somente registro ou alternativa em OR |
| `default-quota` | Referência 1 TB, comparada somente se os direitos de licença e a unidade estiverem resolvidos; não altera quota ou direito de cada usuário |
| `max-file-size` | Limite público versionado do serviço: 250 GB na documentação vigente; origem identificada, sem fingir configuração de tenant |
| `version-retention` | Atualizado por R4: referência manual de 500 versões principais, sem requisito de prazo em dias. Manual500 alinhado; outro valor diverge da referência, sem inferir falha de segurança. Modo automático publicado com comparação numérica não avaliável, sem equivalência automática a500 |
| `onedrive-recycle-bin` | Janela total do serviço de 93 dias desde a exclusão original; exclusão manual/quota podem encerrar antes |
| `second-stage-recycle-bin` | Restante dos mesmos 93 dias, sem novo prazo de 30 ou 93 dias |

### Fatos complementares e ausência

- Os valores atuais exigem fonte própria: Graph já evidenciado, export oficial
  SPO/CSOM, Purview/Exchange por certificado ou Data Connect. O onboarding
  valida perfil de entrada/versionamento, colunas/tipos, enum, escopo, unidade,
  cardinalidade/paginação e primeira leitura completa, antes da publicação;
  divergência suspende promoção e preserva a última publicação válida. Isso é
  estratégia de admissão de fonte, não alegação de execução dos cmdlets.
- `currentValue` ausente permanece nulo e `evaluation=not_evaluable`. Regras
  locais/recomendadas e limites públicos têm origem explícita. Valor mais
  restritivo satisfaz a regra quando ela é limite; a comparação usa a regra
  semântica, não igualdade de textos formatados. Não usar o fixture como estado.
- Quarentena significa **catálogo atual de documentos OneDrive em quarentena**,
  deduplicado por documento e correlacionado ao tenant/site. O catálogo pode
  expirar enquanto o arquivo segue bloqueado; não equivale a todos os arquivos
  bloqueados. Fonte documentada: `Get-QuarantineMessage`, tipo
  `SharePointOnline`/`SPOMalware`, sem contar emails/Teams não correlacionados.
- **R5 substitui o universo de preservação da Q4:** o card publica arquivos
  atuais com retenção efetiva comprovada e o volume atual desses mesmos
  arquivos únicos. Exclui pastas, itens remotos duplicados, excluídos,
  versões, lixeira e cópias da Preservation Hold Library. Quantidade e bytes
  têm cobertura e disponibilidade próprias; total global só após avaliação
  íntegra, tamanho ausente impede total de bytes e zero exige ausência
  comprovada. A contagem/ocupação física da biblioteca é fato distinto e não
  preenche essas métricas. Políticas, usuários alcançados e vencimentos são
  fatos independentes. A referência física anterior permanece apenas como
  histórico da Q4, substituído pela [R5 aceita](#r5--arquivos-sob-retenção-e-cópias-preservadas-aceita-a).
- Vencimento nominal de retenção só existe com âncora factual e regra finita
  resolvidas. Hold, evento-base desconhecido, disposition ou conflito impedem
  publicar vencimento. Nunca derivar da exclusão prevista de usuário.
- Distribuição DLP conta políticas distintas com inclusão efetiva do OneDrive:
  enforcement, teste/simulação e desabilitada são categorias explícitas do
  perfil, não alertas. Escopo/exclusões/distribuição desconhecidos deixam o
  registro fora do universo avaliado, com coverage. Sensibilidade conta somente
  arquivos efetivamente avaliados; sem rótulo exige avaliação concluída.

Fontes/campos e limites: [mapping técnico de Segurança](configuracoes-e-seguranca/fontes-e-viabilidade.md).

### Fórmulas comuns de avaliação — default-v1 aprovado

Os pesos do DOCX e o denominador 100 já foram aprovados. Aqui se propõem os
critérios ausentes. `B(condição)` vale 100 se comprovadamente satisfeita, zero
se comprovadamente divergente; sem evidência, contribuição zero com motivo de
ausência, nunca afirmação de divergência. `R(bons,elegíveis)=100×bons/elegíveis`.
Um elegível não observado/classificado não entra em bons; publicar observados,
elegíveis e exclusões. Se a população elegível nem puder ser determinada, o
fator contribui zero e fica indisponível. Média abaixo usa número **fixo** de
fatores, sem redistribuir peso de fator ausente. Resultado parcial preserva
coverage; não premia seleção de uma amostra favorável.

Denominador factual zero e leitura íntegra: 100 somente nas medidas de ausência
de exposição, de incidente ou de casos pendentes. Zero clientes elegíveis em
KFM/sync/dispositivo, zero arquivos elegíveis em classificação, ou zero contas
elegíveis: contribuição zero e motivo “sem população avaliável”, sem remover
peso. Sem coleta não é população zero. Contagens incoerentes, negativas,
numerador maior que denominador, timestamp inválido ou valores fora do domínio
invalidam o fator; não ajustar silenciosamente. Conjunto sem variação não exige
normalização por min/max. Arredondar somente pontuações publicadas e score
final a uma casa decimal, half-up; calcular com precisão completa antes disso.

| Security Score / peso | Critério executável |
| --- | --- |
| Compartilhamento externo / 20 | Média de `B(capacidade OneDrive, convidados e modo de domínios satisfazem o perfil escolhido)` e `R(arquivos externos sem risco alto/crítico e com classificação completa, arquivos externos elegíveis)` |
| Links anônimos / 15 | Média de `B(capacidade/tipos satisfazem o perfil)`, `R(links anônimos sem escrita e sem conteúdo confidencial, links anônimos elegíveis)` e `R(links anônimos com prazo factual <=30 dias a partir da criação, links anônimos elegíveis)`. Nos perfis B/C qualquer link anônimo atual diverge nos dois fatores de inventário; zero links confirmado dá 100 nesses fatores |
| Dispositivos / 15 | C2 aceita A atualiza o segundo universo: média de `B(CA em enforcement exige gerenciamento/conformidade nos clientes de sync OneDrive)` e `R(dispositivos Intune únicos gerenciados/conformes, dispositivos Intune únicos elegíveis publicados)`. População Intune observada, sem join Health–Intune presumido; pesos e ausência preservados |
| DLP e classificação / 15 | Média de `B(ao menos uma política DLP em enforcement com distribuição/escopo OneDrive confirmados)` e `R(arquivos suportados avaliados com rótulo, arquivos suportados elegíveis do inventário)` |
| Retenção / 10 | Média de `B(política de retenção ativa com escopo OneDrive confirmado e duração/ação conhecidas)` e `R(casos técnicos com responsável e plano explicitamente registrados/aprovados, casos técnicos elegíveis)`; inexistência de workflow humano não cria um plano |
| KFM / 10 | `R(clientes Windows elegíveis com Desktop, Documents e Pictures protegidas, clientes Windows elegíveis)` |
| Antimalware / 5 | Média de `B(Safe Attachments para SharePoint/OneDrive habilitado)` e `B(download de arquivo infectado bloqueado)`. Alertas/quarentena são achados independentes, não substituem configuração |
| Autenticação / 5 | Média de `B(legado SharePoint bloqueado)` e `B(MFA efetivamente exigido para a população interativa OneDrive)` |
| Auditoria / 5 | `B(ambos os feeds habilitados, última coleta completa <=1h e ledger sem lacuna de ingestão dos conteúdos publicados nas últimas 24h)`. Não garante que o provider já publicou todo evento ocorrido |

Score final = `Σ(peso × pontuação / 100)`, sem bônus nem ajuste do denominador.
Faixas existentes do Security Score e Conformidade Global continuam as já
aprovadas. Recomendações ordenam severidade decrescente da regra, contribuição
perdida decrescente e ID estável; ausência de evidência gera orientação de
coleta, não achado de controle desabilitado. Comparação D30 exige mesma versão
de perfil/fórmula e populações comparáveis; caso contrário, sem delta.

| Health Score / peso | Critério executável para futura publicação, sem inserir card na UI atual |
| --- | --- |
| Provisionamento / 10 | `R(contas humanas habilitadas/licenciadas elegíveis com OneDrive confirmado, contas humanas habilitadas/licenciadas elegíveis)` |
| Armazenamento saudável / 15 | `R(contas OneDrive com utilização factual <80%, contas OneDrive elegíveis com uso/cota a avaliar)` |
| Compartilhamento seguro / 20 | `R(arquivos compartilhados classificados sem risco alto/crítico, arquivos compartilhados elegíveis)` |
| Ausência de anônimos críticos / 15 | `R(links anônimos avaliados sem regra crítica satisfeita, links anônimos elegíveis)` |
| Retenção de desligados / 10 | Mesmo fator de casos técnicos com responsável/plano aprovado da dimensão Retenção acima |
| Proteção/classificação / 10 | Mesma pontuação DLP/classificação do Security Score |
| Sincronização saudável / 10 | `R(clientes elegíveis com snapshot de saúde íntegro e zero erros reportados nos 30 dias, clientes elegíveis)`; ausência de export Errors não prova zero |
| Governança de contas / 5 | `R(contas OneDrive habilitadas, licenciadas e com atividade factual <=90 dias, contas OneDrive elegíveis)`; não inferir atividade de data de criação |
| Auditoria/monitoramento / 5 | Mesma pontuação Auditoria do Security Score |

Health usa a mesma soma ponderada, ausência, precisão e comparabilidade. Os
75/100 da fixture continuam exemplo sintético, não resultado destas regras.

## Clarificação 5 — cobertura inicial: definida B por inferência autorizada

**Resolução, 2026-10-14:** o usuário solicitou reler a imagem e inferir a opção
ideal. Após leitura direta de `03.Arquivos e Conteúdo.png`, a opção **B —
detalhe completo** satisfaz a composição: KPI Arquivos Totais e distribuição
por tipo repetem 124.856; filtros Todos abrangem proprietário/departamento;
rankings e sensibilidade não são apresentados como população só crítica.
O número é ilustrativo, usado apenas como evidência da relação entre regiões.
Origem: inferência do agente autorizada pelo usuário, não escolha literal B
nem validação de dado de tenant. O pacote comum abaixo fecha as semânticas.

**Origem:** DOCX §§3/4/estratégia recomenda relatórios para todas as contas,
inventário detalhado de contas críticas, delta em drives monitorados e
permissões dos itens compartilhados. O contrato atual de Conteúdo define o
total filtrado como tenant-wide; Reports não fornecem o total filtrado por
extensão/pasta/tamanho. A clarificação decide esse universo de produto.

As opções abaixo são histórico da pergunta; a recomendação inicial A foi
substituída por **B** após a leitura da imagem solicitada pelo usuário.
B amplia todo o detalhamento; C amplia metadados, mantendo avaliação seletiva.
As três opções mantêm as oito abas e todos os blocos aprovados, com publicação
independente, e aceitam integralmente as semânticas comuns abaixo.

| Opção | Inventário/escopo completo | Permissões, rótulos e descarte | Total filtrado e análises |
| --- | --- | --- | --- |
| A — camadas do sponsor, recomendada | Todas as contas em diretório/Reports. Bootstrap completo e delta diário nos drives críticos/monitorados; os demais ainda não têm detalhe | Permissões de itens compartilhados a cada 6h; rótulos suportados de arquivos ativos do escopo monitorado; lixeira dos sites desse escopo diariamente; revisão completa semanal de críticos | Total, filtros, rankings, distribuições, duplicidade e sensibilidade referem-se ao escopo coletado; KPIs globais de Reports ficam independentes. Sem alegar tenant-wide detalhado |
| B — detalhe completo | Bootstrap completo e delta diário de todos os drives empresariais elegíveis descobertos; revisão completa semanal dos críticos | Permissões de todos os itens compartilhados a cada 6h; rótulos de todos os arquivos ativos suportados; lixeira de todos os sites elegíveis diariamente | Total/análises de metadados são tenant-wide somente após cobertura íntegra; permissões/rótulos/lixeira têm cobertura própria |
| C — metadados completos, avaliação seletiva | Mesmo inventário de metadados de todos os drives de B | Permissões de itens compartilhados a cada 6h; rótulos somente de arquivos compartilhados ou pertencentes a drives críticos; lixeira de todos os sites diariamente; revisão semanal de críticos | Total/análises de metadados podem ser tenant-wide após cobertura íntegra, mas rótulos e avaliação de risco mantêm escopo seletivo explícito |

### Critérios completos de seleção e publicação

Proposta: crítico = utilização >=90%, caso técnico de desligamento, risco
alto/crítico confirmado ou malware/quarentena correlacionados. Na opção A,
também monitorar drive cuja conta tenha compartilhamento externo registrado
no Report de atividade D30. Critérios são OR, com identidade factual; sem
vínculo inequívoco, registrar candidato não resolvido e nunca escolher drive
pelo primeiro resultado. Reavaliar diariamente. Drive admitido permanece
monitorado por ao menos 30 dias sem nenhum critério antes da saída prospectiva
do escopo; história permanece somente pelo TTL aprovado. Na opção C, arquivo
compartilhado vem da faceta/evidência atual, não apenas de evento antigo.

Cada ciclo declara candidatos/elegíveis, concluídos, falhas/ambiguidade e data.
Concluir todas as páginas e promover inventário/cursor atomicamente por drive.
Falha de um drive permite publicar os outros com cobertura parcial. Sem
população íntegra conhecida, nem B/C afirmam total tenant-wide de detalhe.
Ausência de dado não cria zero nem retira silenciosamente conta do denominador.
Os ratios dos scores da clarificação 4 usam o universo eleito, publicam esse
universo e mantêm elegíveis não avaliados fora do numerador de bons.

### Semânticas comuns aceitas junto à opção

- `contentItems.total` = cardinalidade do **escopo detalhado publicado** após
  filtros, antes da paginação. A amostra/página não é inventário completo.
  KPIs de contas/uso são totais globais Reports da mesma referência e não são
  recalculados por filtros ou inventário parcial. Distribuições/rankings e
  economia potencial usam exclusivamente inventário do escopo publicado.
- “Arquivos ativos” do KPI usa a atividade factual da janela do relatório de
  uso selecionado — D180 na fonte atual de Contas. A UI deve informar esse
  período. `contentItems.status=active` significa existente/não excluído e
  pode incluir arquivo sem atividade recente; não reconciliar esses dois
  universos como quantidades iguais. “Armazenamento utilizado” do Report pode
  incluir versões/lixeira, não é soma de tamanhos do inventário corrente.
- Localização requer hierarquia factual completa por IDs/nome; delta não
  fornece caminho completo. Pasta pai desconhecida deixa localização sem valor.
  Tombstone não fornece data real de exclusão: só preencher por lixeira/auditoria
  correlacionada; horário de observação não substitui horário de exclusão.
- Duplicidade significa **candidatos** agrupados por hash QuickXor não vazio
  igual, sem prova byte a byte. `verifiedAt` é data da avaliação de hashes;
  economia potencial = soma dos tamanhos menos a maior cópia, desconhecida se
  faltar tamanho. Nada autoriza exclusão nem afirma economia já realizada.
- `permanentDeletionAt` passa a significar **prazo nominal estimado** de lixeira,
  com rótulo/contexto “Estimativa da janela padrão”: exclusão **original**
  factual +93 dias. Segundo estágio não reinicia a conta. Sem data original
  comprovada, fica nulo; exclusão manual/quota podem antecipar e políticas de
  preservação podem manter cópias. Não é data real nem agendamento confirmado;
  não afirmar exclusão permanente já efetuada. Datas de casos de desligamento
  mantêm a regra própria da clarificação 2, independente desse prazo de item.
- Sem acesso >365 dias só é avaliável com ledger/estado de última atividade
  suficientes por item; janelas Graph de 90 dias não provam 365. História começa
  na primeira cobertura íntegra. Ausência de acesso observado fora de cobertura
  não gera recomendação de abandono.
- As 12 posições mensais permanecem; meses não observados ficam nulos. D30
  anterior e previsão (2–6 snapshots conforme contrato) só publicam com seus
  operandos factuais. Estado inicial dos fatos ainda não coletados é
  `not_yet_published`; falha/restrição/parcial/stale preservam significado e
  dados válidos de outros blocos. Coleta inteira vazia permite zero naquele
  universo; collector ausente não permite. Não reconstruir meses com snapshot
  de janela móvel atual.
- TTL 90/400/13 expira eventos/histórico/rollups, **não** remove arquivo ativo
  do inventário operacional porque não foi modificado há 400 dias. Esse estado
  dura enquanto o recurso for monitorado e até exclusão factual/reconciliação
  legítima; a última modificação de conteúdo é independente da observação.

Essas regras permitem implementar desde o primeiro ciclo, sem alegar collector
implantado, cobertura atual de tenant ou decisões operacionais de workflow.

## Revisão das inferências — imagens do sponsor — 2026-10-14

Solicitação: reler integralmente os defaults e as oito imagens, clarificando
somente divergências de decisões **não explícitas no DOCX**. As decisões Q1–Q5
acima são histórico e continuam vigentes até substituição expressa nesta
rodada. Inferência de imagem não é observação de tenant. O objetivo desta rodada
é produto/contrato dentro do Discovery existente; não há implementação,
alteração de fixture ou nova validação operacional de tenant.

### Evidência e triagem integral

Foram relidos todos os 1.129 parágrafos não vazios do DOCX, incluindo tabelas,
e visualizadas diretamente as oito imagens originais. Não derivar regras
numéricas de contagens ilustrativas nem usar desenho como comprovação de API.

| Parte dos defaults | DOCX / imagem relevante | Resultado desta revisão |
| --- | --- | --- |
| Q1 — bloqueio 7 dias, origem presumida, exclusão imediata correlacionada e licença separada | DOCX §6 inclui estados técnicos e workflow, sem prazo de 7 dias. Imagem06 não define esse prazo | Sem divergência visual comprovada; preservar decisão do usuário e ausência de HR |
| Q2 — eventos90dias, snapshots400dias, rollups13meses e poda local | Imagem08 mostra D30/comparação; imagens01/02/04/05 mostram12meses; não prescrevem TTL | Não reabrir somente por falta de TTL na imagem. O DOCX fala em snapshots permanentes (§2); essa questão explícita do texto fica fora do recorte solicitado |
| Q2 — conteúdo90/180/7anos e quarta regra de excluídos | Imagem06:90/180 para cargos críticos/**730dias**/30dias após retenção. DOCX não fixa essas durações | R1 aceitaA:90/180 por cargo crítico/730 legal aprovado e carência local30dias. Corrigida a atribuição de7anos à imagem |
| Q2 — limiares de download/exclusão/compartilhamento e regras de alto/crítico/médio descritas | DOCX §§4/8 define limiares e categorias, mesmo onde imagens ilustram outra severidade | Preservar o explícito do DOCX; não perguntar por severidade para contrariá-lo nesta rodada |
| Q2 — residual Baixo/Informativo e aplicação da mesma matriz a conteúdo, exposição e evento | Imagens03/04/08 têm Baixo/Informativo; imagem08 apresenta acessos/edições de rotina como Baixo. DOCX não define residual de cada objeto | R2 aceitaA: residual por objeto com evidência mínima; contexto insuficiente não classificado e regras superiores preservadas |
| Q2 — janelasUTC, deduplicação, maior severidade e detectores derivados | Imagens não definem mecânica técnica ou fórmula residual | Sem divergência demonstrada; preservar decisões, sem reabrir implementação técnica |
| Q3 — fotografia mensal rolling30d, gaps e perfil de export | Imagem05 mostra duas unidades: **dispositivos sincronizados** e falhas. O pacote deixou a série azul em Reports/sincronizações de arquivos | R3 aceitaA: dispositivos/clientes Health e quantidade de erros reportados30dias; KPI Reports de arquivos separado, referências/coverage próprias |
| Q4 — colaboração, anonymousread30dias, legado, MFA, tipo de link e cotas | Imagem07 compatível em apresentação; DOCX define controles gerais. “5domínios” é cardinalidade ilustrativa | Preservar valores sustentados e não inventar domínios autorizados; acesso offline permitido pode coexistir com requisito de dispositivo gerenciado |
| Q4 — versões Automatic ou manual<=500 e expiração<=365 | Imagem07 mostra somente **500versões**. DOCX não determina validade365dias ou equivalência de modos | R4 aceitaA: referência manual500 sem prazo adicional; automático publicado/não comparável ao número |
| Q4 — download local, escopo protegido, limites do serviço e lixeira | Imagem07 mostra títulos genéricos e30dias no segundo estágio; fontes já registram restrições reais | A imagem não prova controle de throttling nem muda regra do serviço. Preservar origem local, escopo e janela única93dias; não oferecer valor factual falso como alternativa |
| Q4 — nove pesos e denominador100 | Pesos explícitos no DOCX; imagem07 agrupa apresentação em sete linhas | Não reabrir pesos por agrupamento visual. Ausência=contribuição0 é decisão anterior do usuário; contagens ilustrativas não determinam fórmula |
| Q4 — quarentena, DLP e sensibilidade | Imagem07 separa controles, ameaças e quarentena; distribuição inclui Semrótulo | Preservar fatos independentes e universo avaliado. Ausência de alerta não prova controle, zero quarentena ou ausência de rótulo |
| Q4 — retenção: arquivos/bytes redefinidos como artefatosPHL | Imagem07 diz **Arquivos em retenção** e **Conteúdo preservado**, sem restringir ambos a cópiasPHL. DOCX não define essas métricas | R5 aceitaA: arquivos atuais comprovadamente retidos e seu volume corrente no mesmo universo; cinco métricas, sem substituir por cópias/ocupaçãoPHL |
| Q5 — abrangência de todos os drives e incrementais | Imagem03 repete universo em KPI/distribuição e permite todos proprietários/departamentos | Preservar resolução B e coverage; não reabrir população já inferida a pedido do usuário |
| Q5 — ativos do Report, hierarquia, candidatos a duplicidade e prazo estimado da lixeira | Imagem03 não prova identidade de conteúdo ou agendamento real; DOCX aponta Report como origem de ativos | Preservar distinção de unidades/ausência. A comparaçãoD30 não prova que toda métrica tenha janelaD30; não inferir igualdade de contagens de exemplos |
| Q5 — falta de histórico, estado inicial e TTL do inventário corrente | Imagens não definem coldstart ou preenchimento de ausência | Preservar: mês desconhecido sem valor, histórico distinto de estado corrente e nenhum fallback sintético |

### R1 — pacote de retenção da imagem06: aceita A

**Decisão do usuário, 2026-10-14:** A — 90 dias geral, 180 dias por cargo
crítico, 730 dias legal/compliance e carência local de 30 dias. Substitui as
partes correspondentes da Q2; TTL de auditoria e demais regras não mudam.
B/C abaixo permanecem somente como histórico da pergunta.

**Origem:** card Retenção Configurada da imagem06: padrão90dias; cargos
críticos180dias; legal/compliance730dias; usuários excluídos30dias após retenção.
O rodapé atribui processos às políticas Orkestria e exige aprovação. O DOCX §6
não estabelece esses prazos. O pacote anterior mudou730dias para7anos e cargos
críticos para casos de risco crítico; sua quarta linha passou a valor técnico
Microsoft, de outro significado.

**Recomendação A, proposta do agente:** preservar as quatro regras de negócio
da imagem como recomendações Orkestria. Nenhuma regra preenche prazo real de
caso ou altera Microsoft automaticamente. “Cargo crítico” exige classificação
explicitamente registrada, sem inferir de risco, departamento ou título, e sem
HR. Regra legal só se aplica como baseline de exceção expressamente aprovada.

| Opção | Quatro regras fechadas |
| --- | --- |
| A — imagem06 | Geral90dias; cargo explicitamente crítico180dias; exceção legal/compliance aprovada730dias; carência recomendada Orkestria30dias após o encerramento factual/aprovado da retenção para usuário excluído. Origem local explícita; sem início/fim aprovado não gerar data de caso. O ciclo Microsoft é fato separado |
| B — pacote anterior | Geral90dias; caso explicitamente classificado crítico180dias; exceção legal/compliance aprovada7anos; quarta linha mostra duração técnica Microsoft coletada ou desconhecida, sem carência local adicional |
| C — valores90/180/730 com quarta linha técnica | Geral90dias; cargo explicitamente crítico180dias; exceção legal/compliance aprovada730dias; quarta linha mostra duração técnica Microsoft coletada ou desconhecida, sem carência local adicional |

Comum: valores são contexto/recomendação, não aplicação ou prazo legal universal;
carência local nunca declara extensão garantida de armazenamento Microsoft.
Somente datas com evidência e aprovação pertinente alimentam previsão; holds,
exceções e ciclo real Microsoft mantêm sua verificação independente. Nenhuma
transferência ou exclusão é executada nesta revisão.

### R2 — Baixo/Informativo por objeto: aceita A

**Decisão do usuário, 2026-10-14:** A — residual por objeto. Arquivo avaliado
sem achado adverso é Informativo; evento rotineiro com sucesso e contexto
suficiente é Baixo; compartilhamento restrito/revisado é Baixo, exigindo
prazo<=30 dias quando externo. Substitui apenas os residuais globais da Q2;
regras superiores do DOCX prevalecem. B/C são histórico da pergunta.

**Origem:** imagens03/04 mostram conteúdo e compartilhamentos com Baixo e
Informativo; imagem08 apresenta leitura, edição e sincronização de rotina
bem-sucedidas como Baixo. A Q2 restringiu Baixo a compartilhamento revisado de
leitura com expiração<=30dias e Informativo a operação conhecida. Aplicada
literalmente a todos os objetos, essa regra não define o residual de um arquivo
sem achado nem reproduz a classificação dos eventos de rotina da imagem08.
O DOCX não define Baixo/Informativo. As regras explícitas de Crítico/Alto/Médio
do texto continuam prevalecendo, inclusive quando uma linha ilustrativa da
imagem tem outro nível.

**Recomendação A, proposta do agente:** residual depende do objeto avaliado.
Nenhuma das opções transforma dado faltante em seguro ou usa percentual da
imagem como meta. Aplicar primeiro todas as regras superiores documentadas;
os residuais abaixo só entram quando nenhuma regra superior for satisfeita e
houver contexto suficiente para avaliar as regras aplicáveis.

| Opção | Conteúdo | Exposição/compartilhamento | Evento auditado |
| --- | --- | --- | --- |
| A — residual por objeto | Informativo para arquivo avaliado sem achado adverso; herda Baixo quando suas exposições atuais avaliadas forem controladas de baixo risco | Baixo para acesso restrito/revisado, destinatário autorizado e leitura; se externo, expiração factual<=30dias. Registro de remoção/encerramento comprovado sem exposição remanescente pode ser Informativo | Baixo para leitura/visualização, criação/edição comum ou sync conhecidos, com sucesso explícito e contexto avaliado; operação rotineira conhecida com resultado não publicado fica Informativo, sem afirmar sucesso |
| B — manter residual global anterior | Sem regra residual própria; só classifica se houver evidência que satisfaça a matriz global; caso contrário, nulo | Baixo exige revisão, destinatário conhecido, leitura e expiração<=30dias inclusive no acesso interno; demais casos sem regra ficam nulos | Rotina conhecida sem regra adversa é Informativo; Baixo só quando satisfizer todos os fatores de compartilhamento da matriz anterior |
| C — residual Informativo comum | Arquivo avaliado sem achado é Informativo | Baixo somente para compartilhamento revisado com destinatário autorizado, leitura e expiração<=30dias; encerramento comprovado sem exposição é Informativo | Toda rotina conhecida sem regra adversa é Informativo, mesmo com sucesso; Baixo fica reservado aos fatores de compartilhamento |

Em A, avaliação de arquivo requer identidade/hierarquia e metadados atuais,
extensão conhecida, sinais de malware/alerta consultados no escopo publicado,
estado de exposição resolvido e rótulo quando necessário a uma regra de
exposição sensível. Ausência de flag malware é ausência de sinal naquela fonte,
não atestado de arquivo limpo. Regra inaplicável exige condição factual que a
torne inaplicável, não campo ausente. Herança de risco usa somente relações
confirmadas e a maior severidade. Herança de Baixo exige ao menos uma exposição
atual confirmada e todas avaliadas como Baixo; conjunto vazio não satisfaz essa
condição. Não importa snapshot corrente como prova de
exposição na data de evento antigo. Revisão/autorização não são presumidas.

As operações rotineiras são as operações canônicas de acesso/visualização,
criação/edição e sincronização já reconhecidas no mapping de auditoria;
administração, exclusão, compartilhamento novo, operação desconhecida ou
resultado falho não recebem Baixo por esse residual. Resultado não contemplado
por outra regra permanece sem classificação, não recebe Informativo por
fallback. Sem contexto para alguma
regra obrigatória, nulo/Não classificado, sem incluí-lo como Informativo. A
distribuição usa os classificados e publica cobertura do universo; não inventa
uma classe para completar100%. Zero de classificados com população>0 é
distribuição não avaliável, não cinco zeros de risco. Desempate e ordenação
vigentes continuam instante decrescente e ID estável, sem média de severidades.
Registrar a revisão de regras usada; comparações históricas exigem a mesma
revisão, com reavaliação explícita quando os critérios diferirem.

### R3 — unidade da evolução de sincronização: aceita A

**Decisão do usuário, 2026-10-14:** A — Dispositivos sincronizados + quantidade
de erros reportados. Série azul conta clientes observados do Health; vermelha
mantém a medida Errors aprovada na Q3. Esta revisão substitui a fonte/unidade
Reports da série azul, sem alterar o KPI de arquivos sincronizados. B/C ficam
como histórico da pergunta.

**Origem:** a imagem05 distingue KPI Arquivos Sincronizados do gráfico
Evolução da Sincronização, cuja linha azul/primeiro eixo é **Dispositivos
sincronizados** e a linha vermelha/segundo eixo é Falhas de sincronização.
O DOCX §5 enumera ambos, sem determinar a unidade do gráfico mensal. A Q3
fixou a medida de erros e conservou a outra série em Reports, que fornece
arquivos sincronizados por usuário, não número de dispositivos.

**Evidência técnica existente conferida:** o schema primário de
[SyncHealth_v1](https://github.com/microsoftgraph/dataconnect-solutions/blob/6f75a7ce78d53a8a81588289d688230d2fc336b2/Datasets/data-connect-dataset-onedrivesynchealth.md)
fornece um objeto por cliente OneDrive com reports habilitados, identificador
interno `OneDriveDeviceId` e `LastSyncedTimestampUTC`. Este último significa
quando o cliente reportou estar atualizado; não é contagem de transferências.
O universo é clientes observados, não inventário físico completo nem pessoas.

**Proposta A:** em cada mês, a última fotografia Health íntegra fornece os
clientes distintos com último estado atualizado reportado em `(T-30dias,T]`;
T é a referência daquela fotografia. Legenda Dispositivos sincronizados,
com contexto “clientes OneDrive observados; estado atualizado reportado nos
30dias até a fotografia”. ID interno repetido só conta uma vez; não unir por
nome. Identidade/data inválidas deixam o universo parcial, sem zero inventado.

| Opção | Série azul | Série vermelha |
| --- | --- | --- |
| A — unidade da imagem | Clientes/dispositivos observados na medida Health acima | Soma de erros reportados30dias da última fotografia Errors íntegra do mês, conforme Q3 |
| B — conservar Reports com nome correto | Soma de SyncedFileCount por usuário da última fotografia ReportD30 íntegra do mês, identificada como Arquivos sincronizados reportados; não é arquivos globalmente distintos | Mesma medida de errosQ3 |
| C — duas séries de dispositivos | Mesma medida Health de A | Clientes distintos com ErrorCount>0 no snapshot Errors mensal e vínculo à população Health confirmado; não é quantidade de erros. Legenda Dispositivos com erros reportados |

Comum:12posições, data/coverage/unidade por série, sem soma entre meses para
total anual de eventos. Health e Errors têm publicações independentes; falha
de uma não zera a outra. Meses não coletados são nulos; zero exige fotografia
completa. Em C, erro sem vínculo de cliente não vira dispositivo novo ou zero:
fica excluído do universo avaliado com motivo/cobertura. Nenhuma opção usa
lastSync do Intune como sincronização OneDrive. Perfil e primeira extração
continuam sujeitos à admissão já aprovada.

### R4 — versões e expiração acrescentada: aceita A

**Decisão do usuário, 2026-10-14:** A — referência500versões sem prazo
adicional; modo automático não comparável ao número. Substitui o requisito
365dias e a equivalência automática da Q4. B/C são histórico da pergunta.

**Origem:** imagem07, Armazenamento e Limites, mostra “Versão de arquivo
(retenção) —500versões”. O DOCX não fixa esse setting nem365dias; a regra
explícita de conteúdo com mais de50versões é detector separado. Q4 introduziu
conformidade de modo automático **ou** manual<=500 com expiração<=365dias e
tratou expiração ilimitada como divergente. A imagem não sustenta esse prazo.

**Proposta A:** baseline de referência500versões no modo manual, sem regra
de expiração em dias. Valor numérico manual conhecido compara com500; outro
valor é divergência do baseline, sem afirmar falha de segurança. Automático
é publicado com seu modo real, sem converter a número500 ou declarar
equivalência automática; avaliação contra referência numérica fica não
avaliável. Duração não é requisito de conformidade desse item.

| Opção | Regra fechada |
| --- | --- |
| A — referência da imagem | Manual500versões alinhado; manual diferente divergente; automático publicado/não comparável ao baseline numérico; sem exigência365dias |
| B — manter Q4 | Automático alinhado; manual alinhado se<=500versões e0<prazo<=365dias; manual sem expiração diverge |
| C — priorizar automático | Recomendar modo automático; automático alinhado e manual divergente, qualquer que seja número/prazo; não criar um limite em dias |

Comum: setting efetivo conhecido, overrides/coverage explícitos, sem mudança
Microsoft. Valor/modo ausente não avaliável. O detector de arquivo com mais
de50versões do DOCX continua independente e não é substituído pelo setting.

### R5 — arquivos sob retenção e cópias preservadas: aceita A

**Decisão do usuário, 2026-10-14:** A — arquivos atuais sob retenção e seu
volume, mantendo as cinco métricas da imagem. Substitui a contagem de
artefatos/ocupaçãoPHL da Q4 para as duas linhas do card; B/C abaixo são
somente histórico da pergunta. Os rótulos vigentes são “Arquivos atuais sob
retenção” e “Volume atual sob retenção”. A proposta de mapping abaixo foi
aceita com cobertura e ausência explícitas.

**Origem:** imagem07, Retenção e Governança, apresenta “Arquivos em retenção”
e “Conteúdo preservado”. Q4 restringiu ambos a artefatos/ocupação da biblioteca
de preservação (PHL). O DOCX §7 não define o universo dessas duas métricas.

**Constatação técnica:** a
[documentação Microsoft](https://learn.microsoft.com/en-us/purview/retention-policies-sharepoint)
distingue arquivo sujeito a retenção de cópia criada quando necessário na PHL.
Um arquivo retido pode permanecer em sua localização original. A contagem de
artefatosPHL não representa todos os arquivos atuais protegidos.

**Mapping conceitual investigado, sem fonte nova:** o inventário completoQ5
identifica arquivos atuais por chave de drive/item; o export Purview selecionado
fornece política/regra de retenção, ação, distribuição, escopo e exceções; a
leitura por item já selecionada fornece rótulo aplicado e data quando presentes.
Unir somente vínculos únicos/compatíveis e evidência de aplicação/distribuição
efetiva, distinguindo política que retém de política apenas de exclusão. Prazo
finito exige âncora resolvida e ainda vigente; retenção indefinida exige regra
explícita. Política apenas publicada/configurada, rótulo apenas disponível no
catálogo, autoaplicação ainda não comprovada, escopo adaptativo não resolvido,
âncora ausente ou regra conflitante não confirmam proteção por arquivo.

Definir `arquivosAtuaisComRetencao` como cardinalidade das chaves únicas dos
arquivos atuais comprovadamente abrangidos; contar uma vez mesmo com vários
rótulos/políticas. Considerar somente arquivos locais existentes, não pastas,
itens remotos duplicados, tombstones ou cópiasPHL. O volume corrente sob
retenção é a soma de `size` desses mesmos arquivos únicos; exclui versões,
lixeira e cópiasPHL. Se faltar tamanho de algum arquivo abrangido, o total de
bytes fica sem valor, preservando contagem/cobertura já sustentadas. Não
substituir pela quota/StorageUsed do Report nem por ocupação físicaPHL.
Publicar elegíveis/avaliados e desconhecidos; não usar totais do catálogo como
quantidade de arquivos. Só afirmar total global após avaliação íntegra. Sem
prova suficiente, o bloco é parcial/sem valor; zero depende de avaliação íntegra
de ausência. Essa estratégia usa os leitores/perfis já aprovados e acrescenta
uma projeção local, sem alegar enumeração real ou inventar propriedade de API.

**Proposta A:** conservar o significado de negócio da imagem com um universo
coerente para quantidade e volume: arquivos atuais abrangidos por retenção e
seu volume atual. Isso não afirma que cada byte foi copiado para uma biblioteca
de preservação. A contagem/ocupaçãoPHL continua sendo fato físico independente,
selecionável em B/C. Não somar cópias e originais ou misturar volume lógico
atual com ocupação que inclui versões/metadados.

| Opção | Contagem e apresentação | Bytes |
| --- | --- | --- |
| A — significado de negócio da imagem | Linha “Arquivos atuais sob retenção” usa a projeção de cobertura comprovada acima; preserva as cinco métricas do card | Linha “Volume atual sob retenção”: soma dos tamanhos dos mesmos arquivos atuais, com origem/universo explícitos |
| B — conservar só cópias materiais | Contagem continua artefatosPHL, com rótulo “Cópias/artefatos preservados na PHL”; não declara quantos arquivos atuais estão sob política | OcupaçãoPHL, como no pacote anterior, com rótulo explícito |
| C — apresentar ambos separadamente | Mantém arquivos atuais/volume de A e acrescenta duas métricas, artefatosPHL e ocupaçãoPHL; card passa de cinco a sete métricas | Volume corrente de arquivos e ocupação físicaPHL separados, sem soma entre universos |

Comum: política, usuários alcançados e vencimentos permanecem fatos próprios;
não inferir arquivo protegido ou vencimento pelo desligamento. Cada métrica
tem data/coverage e disponibilidade próprias. A primeira leitura/perfil ainda
é condição da publicação futura; não há default numérico ou coleta operacional
nesta revisão.

### Resultado da revisão por imagens

As cinco clarificações R1–R5 foram aceitas na opção A pelo usuário em
2026-10-14 e incorporadas às decisões, contratos e mappings das abas afetadas.
A triagem integral preservou regras explícitas no DOCX e decisões anteriores
sem divergência visual comprovada. As inferências são propostas do agente
aceitas pelo usuário, sem atribuição retroativa ao sponsor. Não resta
clarificação pendente desta rodada.

O blueprint recebe os novos rótulos/unidades em adendo conceitual; fixture e
frontend homologados continuam como evidência histórica. A implementação
futura deve reconciliar os bindings reais, sem reinterpretar silenciosamente
os números da fixture. Não há nova API externa, operação de provider ou
implementação de backend nesta revisão.

## Fechamento dos bloqueadores A1–A8 — clarificação — 2026-10-14

Intenção: atualizar o Discovery existente no track backend, com clarificação
de produto/contrato quando material. O objetivo é resolver todas as categorias
pendentes do relatório backend. R1–R5 e o frontend_done histórico permanecem
válidos. A fixture representa a expectativa atual da interface, não o modelo
de persistência, wire format Microsoft ou controller agregado.

| Achado | Classe inicial | Tratamento |
| --- | --- | --- |
| A1 — OpenAPI | BACKEND_FEASIBILITY | Corrigir estrutura e validar, sem pergunta de produto |
| A2 — acessados/editados | BACKEND_FEASIBILITY | Investigar fonte complementar e fechar unidade/cálculo/cobertura sem separar artificialmente o CSV combinado |
| A3 — estados/correlação | BACKEND_FEASIBILITY; CONTRACT se a fonte não sustentar a semântica atual | Investigar fontes oficiais; só encaminhar decisão material após evidência |
| A4 — fontes configuradas | CONTRACT e BACKEND_FEASIBILITY | Distinguir configuração de coleta, serviço e feed; investigar evidência por entrada antes da pergunta |
| A5 — operações canônicas | BACKEND_FEASIBILITY | Fechar normalização versionada de operações/resultados reais |
| A6 — partição de compartilhamentos | CONTRACT | C1 abaixo, uma pergunta com três pacotes fechados |
| A7 — acesso sem uso | BACKEND_FEASIBILITY | Resolver incompletude estatística e admissão de zero sem novo default factual |
| A8 — versões por arquivo | BACKEND_FEASIBILITY | Validar leitura/paginação e encaminhar operação ao Simulator; preservar detector>50 e baseline500 separados |

### C1 — partição do compartilhamento: aceita A

**Resposta do usuário (2026-10-14):** A — contar cada arquivo uma vez pela
precedência Anônimo > Convidado externo > Aplicativo > Organização > Pessoas
específicas, preservando donut e KPI de arquivos. O pacote comum abaixo integra
a decisão. A ordem de apresentação não altera o riscoR2.

**Origem:** a imagem04 apresenta um donut Compartilhamentos por Tipo cujo total
central coincide com o KPI Itens Compartilhados. O contrato vigente pede uma
distribuição exclusiva. O DOCX não fixa precedência entre as cinco categorias
quando um mesmo arquivo tem múltiplas concessões. Uma concessão a convidado
também pode usar Pessoas específicas. Contagens ilustrativas não resolvem isso.

**Evidência disponível:** inventário correnteQ5 e permissões atuais já
selecionadas/validadas; `link.scope`, identidades concedidas e vínculo legítimo
de destinatário ao diretório/domínios. Aplicativo exige concessão explícita
observada ao item; não inferir acesso de todo app instalado. Herança só entra
quando comprovada. Evento histórico não comprova concessão atual.

**Proposta do agente — A:** cada arquivo atual compartilhado conta uma vez;
na sobreposição, classificar pela primeira categoria confirmada da ordem
Anônimo > Convidado externo > Aplicativo/Integração > Organização > Pessoas
específicas. É ordem de apresentação, independente da classificação de risco.
Mantém donut e unidade de arquivos do KPI, sem transformar permissão em arquivo.

Comum às opções: usar arquivos locais atuais do escopo detalhadoQ5; excluir
pastas como unidade de contagem, tombstones, cópias de preservação e duplicações
remotas. Pastas permanecem contexto/hierarquia e podem aparecer nos eventos da
tabela; permissões herdadas comprovadas podem alcançar arquivos. Somente
concessões de compartilhamento efetivas confirmadas participam; acesso do
próprio proprietário isoladamente não prova compartilhamento. Não afirmar
completude global sem inventário/permissões resolvidos.

Uma exposição é Anônimo se o link tem scope anonymous; Convidado externo se há
destinatário externo factual; Aplicativo se há identidade de aplicativo
concedida, não apenas aplicativo criador do link; Organização se o link tem scope organization; Pessoas específicas
se há link users ou concessão direta restrita a identidades internas conhecidas.
O conjunto necessário de concessões deve estar resolvido para classificar o
arquivo; dado obrigatório desconhecido fica fora da composição com cobertura,
sem atribuição automática a Pessoas específicas. Não inferir identidade externa
por nome ou de grupo não resolvido. Zero requer população íntegra avaliada.
`link.scope=existingAccess` não concede novo acesso por si: avaliar as concessões
atuais subjacentes, sem criar categoria ou assumir compartilhamento. A ausência
de `inheritedFrom` em OneDrive empresarial não comprova ausência de herança.

| Opção | Unidade, classificação e apresentação fechadas |
| --- | --- |
| A — arquivo único, recomendado | Uma chave de arquivo atual por `(driveId,itemId)`, categoria pela precedência Anônimo > Convidado externo > Aplicativo > Organização > Pessoas específicas. Donut exclusivo; denominador=arquivos compartilhados classificados. Soma das fatias=denominador; cobertura distingue total elegível/avaliado/classificado/desconhecido. KPI compartilhados conta arquivos únicos e mantém cobertura própria |
| B — concessão atual | Uma concessão por chave factual `(driveId,itemId,permissionId)`, sem multiplicar destinatários da mesma permissão. A mesma precedência resolve concessão com mais de uma característica. Donut exclusivo rotulado Concessões por Tipo; denominador=concessões classificadas. KPI Itens Compartilhados continua arquivos únicos e não precisa coincidir com o donut. Sem identidade estável de concessão, excluir com coverage |
| C — todas as exposições por arquivo | Cada arquivo conta no máximo uma vez em cada categoria confirmada, podendo entrar em várias. Substituir donut por barras rotuladas Tipos de exposição por arquivo; denominador comum=arquivos compartilhados avaliados/classificáveis, quantidade por categoria=arquivos únicos nela. Percentuais podem somar>100% e têm contexto explícito; total de arquivos não soma as barras. KPI permanece arquivos únicos |

Percentual=100×quantidade/denominador, calculado com precisão completa e
publicado com duas casas decimais, half-up; não ajustar categoria para forçar
100% após arredondamento. Denominador factual zero com avaliação íntegra produz
coleção vazia e contexto sem arquivos/concessões, não divisão por zero.
População>0 sem classificação suficiente produz estado não avaliável/parcial,
não cinco zeros. Ordenação fixa das cinco categorias segue a precedência acima;
paginação da tabela não determina contagens. Nenhuma opção altera permissões,
as regras de riscoR2 ou os exemplos históricos da fixture.

### C2 — estados instantâneos e correlação de dispositivos: aceita A

**Resposta do usuário (2026-10-14):** A — substituir estados instantâneos por
saúde diária reportada e manter clientes OneDrive e dispositivos Intune como
populações separadas. O pacote comum abaixo integra a decisão, inclusive o
universo explícito do fator de dispositivos. R3 e os pesos permanecem válidos.

**Origem:** o DOCX §5 inclui sincronização pausada; o frontend também prevê
sincronizando/atualizado/pausado/erro/não configurado. A investigação A3 nos
[schemas e limites](atividade-e-sincronizacao/fontes-e-viabilidade.md#investigação-a3--estados-identidade-e-universo-dos-clientes--14102026)
não encontrou fonte pública cloud/app-only que forneça esses estados nem a
ponte entre ID do cliente OneDrive e ID do dispositivo Intune. Trocar seu
significado ou diferir o bloco exige decisão do usuário, mesmo sendo explícito
no DOCX. Não se trata de um erro de licença ou de recusar `/beta`.

**Evidência disponível:** Health/Errors diários comprovam cliente observado,
versão, SO, KFM, timestamps e erros reportados; Intune comprova seu próprio
inventário/conformidade/gerenciamento. `OneDriveDeviceId` liga Health a Errors,
não a `azureADDeviceId`. Nome, usuário e data antiga não comprovam identidade,
pausa ou não configuração. APIs locais Windows não comprovam leitor cloud do
estado de OneDrive nem cobertura Mac. Não oferecer agente local como fonte
pronta sem contrato e integração comprovados.

**Proposta do agente — A:** usar a saúde diária comprovada e separar os
inventários. Mantém investigação por cliente e uma distribuição útil, com
nomes que descrevem a observação histórica. Não publica estado instantâneo.

**Comum aos três pacotes:** preservar Reports, Health/Errors, KFM, detalhes de
erro e as séries mensaisR3. Mostrar clientes OneDrive e dispositivos Intune
como populações separadas; nenhuma junção por nome/pessoa. Tipo físico não é
inferido de SO/modelo; Notebook/Desktop permanece sem valor sem fonte factual
própria. Conformidade/risco/gerenciamento Intune não preenchem campos do cliente
OneDrive. O score de proteção de dispositivos passa a medir enforcementCA e
postura da população Intune publicada, explicitamente limitada a esse universo:
média dos dois fatores já previstos; proporção de dispositivos gerenciados e
conformes usa os IDs Intune únicos elegíveis, não IDsHealth. Desconhecidos não
entram no numerador; ausência de fator contribui zero com motivo no peso fixo,
como Q4, e denominador factual zero não afirma conformidade universal. Não
afirmar cobertura de todos os endpoints OneDrive. Não muda os pesos aprovados.
Dashboard e detalhe de conta reutilizam fatos de cada origem com unidade e
coverage próprias. Ausência de cliente/registro não prova não configuração.

| Opção | Decisão completa para o bloco de estados |
| --- | --- |
| A — saúde diária, recomendada | Substituir os cinco estados instantâneos por distribuição exclusiva de clientes Health: Erro reportado (`TotalErrorCount>0`); Atualizado reportado nos últimos30dias (`TotalErrorCount=0` e `LastSyncedTimestampUTC` em `(T-30dias,T]`); Sem atualização reportada nos últimos30dias (`TotalErrorCount=0` e timestamp válido `<=T-30dias`). T é referência factual da fotografia completa. Campo necessário ausente/inválido ou timestamp futuro mantém Não avaliado fora da composição com cobertura, nunca pausa/não configuração. Deduplicar por OneDriveDeviceId, erro precede os demais; contagem inteira e participação sobre classificados, sem divisão por zero. Não há detector de Pausado/Sincronizando/Não configurado neste recorte aprovado |
| B — sinais sem distribuição de estado | Retirar a distribuição por estado deste escopo; publicar lista por cliente com versão, SO, KFM, última atualização e erros, cada fato com referência/coverage. Priorizar por erro reportado e última atualização, sem criar estado composto ou afirmar pausa/não configuração. R3 permanece. Não há bloco de estados instantâneos nem promessa operacional dele nesta entrega |
| C — bloco instantâneo explicitamente futuro | Preservar os cinco estados como capacidade futura fora do backend desta entrega, com bloco `coming_soon` e texto de escopo explícito; não publicar percentuais/contagens/status substitutos ali. Nesta entrega, disponibilizar somente fatos de cliente/erros/KFM e R3 já comprovados, em seus blocos independentes. A correlação Health–Intune também fica fora do recorte aprovado; a conclusão do Discovery deste recorte não declara essa capacidade futura viabilizada |

Nenhum pacote altera configurações Microsoft, inicia coleta real, muda R3 ou
reinterpreta valores da fixture. Todos alteram explicitamente o recorte do
pedido original de estado instantâneo, pois a investigação não o viabilizou.
Com a resposta, A3 fica resolvida no recorte aprovado, sem afirmar que estados
instantâneos ou a ponte Health–Intune foram viabilizados. A alteração é decisão
expressa do usuário após investigação, não conteúdo retroativo do DOCX.


### Resultado do fechamento A1–A8 — histórico

C1 e C2 foram aceitas A pelo usuário em2026-10-14 e incorporadas aos artefatos
mais próximos. A1/A2/A4/A5/A7/A8 foram resolvidos por investigação e mapping
técnicos, sem transferir escolhas de API ao usuário. Oito OpenAPI conformes;
A7/A8 SUPPORTED e gates do Simulator aprovados com87operações no inventário.
O relatório backend registrou oito de oito superfícies prontas para implementar
nessa rodada. A revisão complementar posterior identificou B1–B3 e passou o
gate agregado para `blocked`, com seis de oito superfícies prontas. Perfis,
primeiras leituras, licenças e consentimento reais
são condições operacionais da publicação futura, não afirmações de coleta.
A fixture e o frontend_done histórico permanecem preservados; bindings novos
serão materializados na integração. As decisões daquela rodada permanecem
fechadas; as lacunas posteriores são tratadas abaixo.

## Clarificação dos achados B1–B3 — 2026-10-14

O objetivo desta rodada foi resolver todas as categorias pendentes do
[`backend-coverage-review.md`](backend-coverage-review.md), preservando os
critérios já aceitos. B3 é `BACKEND_FEASIBILITY`: ampliar/validar a cobertura
sintética dos períodos oficiais pelo fluxo delegado de validação. Não requer
escolha de API pelo usuário. B1/B2 afetavam significados ainda não definidos e
foram resolvidos pelas decisões `CONTRACT` C3/C4/C5 aceitas abaixo.

### C3 — volume do card Principais Benefícios: aceita A

**Resposta do usuário (2026-10-14):** A — Armazenamento utilizado no OneDrive,
conforme Reports. Aceito o pacote comum, com referência/cobertura próprias,
bytes factuais e substituição expressa do significado “Dados protegidos na
nuvem”. As opções B/C abaixo são histórico da pergunta, não alternativas ativas.

**Origem:** a imagem05 publica “Dados protegidos na nuvem” em bytes. O DOCX §5
descreve adoção, atividade, KFM e fontes complementares, sem definir essa medida
ou um volume de backup protegido. Health/Errors não fornecem esse volume.
O campo `protected-data` da fixture é expectativa da composição atual, não
fonte nem prova de proteção. As opções são propostas do agente para substituir
expressamente esse significado por uma medida sustentada.

**Evidência disponível:** [Contas e Armazenamento](contas-e-armazenamento/fontes-e-viabilidade.md)
já define o agregado `summary.storageUsedBytes` a partir de Reports;
[Arquivos e Conteúdo](arquivos-e-conteudo/fontes-e-viabilidade.md) define tamanho
dos arquivos atuais; [R5](#r5--arquivos-sob-retenção-e-cópias-preservadas-aceita-a)
define volume atual sob retenção. São três universos distintos, já selecionados
no Discovery. Nenhuma opção exige API nova ou telemetria local de estação.

**Proposta do agente: A.** A medida de armazenamento utilizado reutiliza o total
canônico já apresentado nas abas de contas e Dashboard, mantendo um indicador
global útil no mesmo card. O rótulo deixa de afirmar backup, aplicação de KFM ou
sucesso de sincronização que essa fonte não comprova.

| Opção | Medida e regra completas |
| --- | --- |
| A — armazenamento utilizado, recomendada | Rótulo “Armazenamento utilizado no OneDrive”. Reutilizar exatamente `summary.storageUsedBytes` do snapshot canônico de Contas e Armazenamento, com seu universo, referência e cobertura; não recalcular a partir da página ou filtro de atividade. Mantém a semântica de armazenamento do Report, inclusive versões/lixeira quando contabilizadas pela fonte. Não afirma proteção ou sincronização desses bytes. |
| B — tamanho dos arquivos atuais | Rótulo “Tamanho atual dos arquivos no OneDrive”. Somar `size` dos arquivos locais existentes únicos por `(driveId,itemId)` do inventário Q5 publicado; excluir pastas, tombstones, itens remotos duplicados, versões, lixeira e cópiasPHL. Não é a ocupação total do Report. Total global exige inventário íntegro e tamanho válido de todos os arquivos elegíveis; faltas preservam coverage e valor total desconhecido. |
| C — volume sob retenção | Rótulo “Volume atual sob retenção”. Reutilizar exatamente `retentionGovernance.currentRetainedBytes` aprovado em R5, com seu universo, referência e cobertura: arquivos atuais únicos com retenção efetiva comprovada. Não afirma backup de pastas nem proteção de todo o armazenamento. |

**Comum às opções:** valor semântico em bytes inteiros não negativos, sem
arredondamento da quantidade; apresentação usa o formatador de armazenamento
do módulo. Cada medida mantém `asOf`, coverage e availability próprios;
referência do filtro de atividade não muda seu universo. Zero exige população
íntegra avaliada comprovando zero; publicação ausente/restrita/falha ou entrada
necessária inválida não recebe zero nem número da fixture. Falha preserva a
última publicação válida com seu frescor. O bloco não recebe comparação
histórica nova. A escolha não altera os outros dois benefícios, KFM, C2, R3,
R5, pesos ou configurações Microsoft. Após a escolha, adotar binding semântico
próprio; não renomear silenciosamente `protected-data` em dados reais.

### C4 — percentual do card Principais Benefícios: aceita A

**Resposta do usuário (2026-10-14):** A — Clientes com atualização recente e
sem erro reportado. Aceitos a substituição expressa da taxa de sucesso de
tentativas, o denominador dos três estados C2 e o pacote comum abaixo.
As opções B/C são histórico da pergunta, não alternativas ativas.

**Origem:** imagem05, “Taxa de sucesso na sincronização”, reproduzida em
`benefitItems[id=sync-success-rate]`. O DOCX §5 não define tentativas nem fórmula.
Health/Errors não fornecem o total de tentativas bem-sucedidas/falhas que
permitiria calcular essa taxa. `Synced File Count` conta arquivos, e
`ErrorCount` é recorrência de erros em janela móvel; não são parcelas do mesmo
universo de tentativas.

**Evidência disponível:** [C2](#c2--estados-instantâneos-e-correlação-de-dispositivos-aceita-a)
já define os três estados de saúde diária, por cliente único e referência
factual. O [mapping de KFM](atividade-e-sincronizacao/fontes-e-viabilidade.md#kfm-perfil-cardinalidade-e-denominadores)
define clientes com pastas conhecidas protegidas e seu universo avaliado.
As opções usam somente essas fontes selecionadas e substituem expressamente o
rótulo/fórmula atual. São propostas do agente, sem decisão do sponsor.

**Proposta do agente: A.** É a medida mais próxima de saúde da sincronização
que pode ser calculada pelo critério C2 já aprovado, com observação reportada e
janela explícitas. Não é taxa de sucesso de transferências nem SLA.

| Opção | Percentual e regra completos |
| --- | --- |
| A — atualização recente sem erro, recomendada | Rótulo “Clientes com atualização recente e sem erro reportado”. `100 × clientes em upToDateReported / clientes classificados nos três estados C2`, no último snapshot Health íntegro admitido. `upToDateReported` exige contador válido zero e último estado atualizado reportado em `(T-30dias,T]`. O denominador inclui os outros dois estados classificados; os não avaliados ficam fora com cobertura explícita. |
| B — ausência de erro reportado | Rótulo “Clientes sem erros reportados na fotografia”. `100 × clientes com TotalErrorCount=0 / clientes com TotalErrorCount inteiro válido não negativo`, no último snapshot Health íntegro admitido. Não exige timestamp de atualização recente, por isso não afirma atualidade do cliente. Contador omitido/inválido não é zero; informar referência e cobertura. |
| C — adoção de pastas protegidas | Rótulo “Clientes com pastas protegidas”. `100 × kfmSummary.applied / kfmSummary.total`, com os critérios aprovados de clientes observados cujo conjunto KFM é avaliável, incluindo ao menos uma pasta conhecida protegida no numerador. Não mede sucesso/atualidade de sincronização nem exige as três pastas do score. |

**Comum às opções:** uma identidade factual de cliente conta uma vez, sem join
ao Intune ou deduplicação por pessoa/nome. Resultado entre0e100, com precisão
completa no cálculo e publicação a uma casa decimal, half-up; nenhuma soma de
erros ou arquivos forma o denominador. Denominador factual zero produz valor
nulo/não avaliável, nunca100%. Dados desconhecidos ficam fora da razão e são
declarados em eligible/observed/evaluated/unknown, sem apresentar a amostra
como todos os endpoints do tenant. Zero percentual exige numerador factual
zero e denominador positivo com avaliação íntegra do universo declarado.
Run/perfil incompatível não é publicado; preservar última publicação válida e
seu frescor. Cada medida é independente de D7/D30/D90/D180 e mantém a referência
do snapshot da fonte. Não cria comparação histórica ou altera C2/R3/KFM/score.
O binding real deve identificar a medida escolhida, sem reinterpretar o93% da
fixture ou manter o rótulo de taxa de sucesso para uma razão diferente.

### C5 — população do Resumo de Riscos: aceita A

**Resposta do usuário (2026-10-14):** A — Arquivos atuais, uma vez por arquivo
e pelo maior risco. Aceito o pacote comum de classificação, cobertura,
comparação por snapshot D30 e exclusão de Informativo/desconhecido das quatro
linhas. As opções B/C abaixo são histórico da pergunta, não alternativas ativas.

**Origem:** imagem07 e contrato `riskSummary`, com quatro níveis e comparação
a30dias. O DOCX §7 não define a unidade dessa contagem. A matriz default-v1/R2
define severidade por objeto, mas não escolhe qual universo este card agrega.
Sem decisão, não há um número determinístico a fornecer ao frontend.

**Evidência disponível:** inventário/risco por arquivo em
[Arquivos e Conteúdo](arquivos-e-conteudo/contratos.md), permissões atuais e
risco em [Compartilhamento e Acessos](compartilhamento-e-acessos/fontes-e-viabilidade.md),
eventos normalizados em [Histórico e Auditoria](historico-e-auditoria/contratos.md).
As três opções reutilizam projeções já selecionadas; a classificação e os
pesos dos scores continuam independentes. Nenhuma fonte nova é proposta.

**Proposta do agente: A.** Contar arquivos atuais permite resumir a exposição
do conteúdo OneDrive, abrangendo os achados comprovados de cada arquivo e
mantendo unidade única. É uma proposta de contrato, não inferência dos números
ilustrativos da imagem.

| Opção | Unidade e agregação completas |
| --- | --- |
| A — arquivos atuais, recomendada | Contexto “Arquivos atuais por nível de risco”. Contar arquivos locais existentes únicos por `(driveId,itemId)` do inventário Q5, classificados pelo default-v1/R2, uma vez no maior nível comprovado. Excluir pastas, excluídos/tombstones, versões, cópiasPHL e itens remotos duplicados. Informativo e não classificado ficam fora das quatro linhas, mas têm contagem de cobertura separada. Não contar permissões ou eventos como arquivos adicionais. |
| B — concessões de compartilhamento atuais | Contexto “Concessões atuais por nível de risco”. Contar concessões efetivas atuais únicas por `(driveId,itemId,permissionId)`, uma vez no maior risco comprovado da concessão, sem multiplicar destinatários da mesma permissão. Excluir concessão sem identidade estável com cobertura; não contar evento antigo como permissão atual. Informativo e não classificado ficam fora das quatro linhas, com cobertura separada. Não equivale a arquivos únicos nem ao donut C1. |
| C — eventos dos últimos30dias | Contexto “Eventos nos últimos30dias por nível de risco”. Contar IDs únicos de eventos canônicos OneDrive em `[T-30dias,T)`, pela maior severidade comprovada no contexto do evento. T é fim exclusivo da última dataUTC integralmente publicada. Deduplicar feed/replay e não acrescentar sinais locais em massa ao total de eventos. Informativo e não classificado ficam fora das quatro linhas, com cobertura separada. A comparação usa a janela anterior `[T-60dias,T-30dias)`. |

**Comum às opções:** ordem Crítico/Alto/Médio/Baixo, contagens inteiras não
negativas sem média de severidades. A classificação usa default-v1 e R2, com
revisão/evidências; ausência de contexto permanece sem classificação. Publicar
unidade, referência, elegíveis/observados/classificados/informativos/desconhecidos
e escopo de cobertura, independente da página ou filtros de outras abas. Uma
contagem positiva parcial pode ser publicada como quantidade observada no
escopo coberto; zero global exige avaliação íntegra, e população não avaliada
não produz quatro zeros. Ausência de fonte mantém disponibilidade própria e
última publicação válida com seu frescor.

Em A/B, comparar o snapshot atual com o último snapshot íntegro cuja dataUTC de
referência seja exatamente a data do atual menos30dias. Sem esse baseline,
comparação ausente; não interpolar ou repetir o atual. Comparar somente com
cobertura íntegra em ambos, mesma revisão de classificação e mesmos critérios
de escopo; mudanças naturais dos arquivos/permissões fazem parte da variação,
sem exigir as mesmas identidades nos dois snapshots. Em C, as duas janelas
devem ter cobertura íntegra e regras comparáveis. Publicar `previousValue` e
`periodDays:30` só quando esses critérios forem satisfeitos; a UI apresenta
diferença de contagem atual menos anterior. A opção não altera os outros cards,
as classificações por objeto, os scores ou a retenção já aprovada de snapshots
400dias/eventos90dias. A fixture permanece histórica até a integração.

### Resultado do fechamento B1–B3 — histórico

C3, C4 e C5 foram aceitas A pelo usuário em2026-10-14 e incorporadas aos
artefatos das duas abas e ao blueprint conceitual. B1 reutiliza Reports, KFM e
saúde C2 com fórmulas/unidades explícitas; B2 reutiliza classificação de arquivos
atuais e snapshotsD30. B3 amplia a mesma operação de atividade por usuário para
D7/D30/D90/D180, com CSV11colunas/ReportPeriod, D365400InvalidPeriod e gates do
Simulator aprovados. Oito OpenAPI/33operações passaram na revalidação.

O [relatório backend](backend-coverage-review.md) registrou oito de oito
superfícies `backend_implementation_ready` ao final daquela rodada. A revisão
integral de 2026-10-15 identificou B4 e reabriu o gate agregado; seu fechamento
é tratado na convergência abaixo. Os números/textos históricos da fixture e `frontend_done` são
preservados; a integração materializará os novos bindings e cenários. Perfis,
primeiras leituras, licença e consentimento continuam condições operacionais
da publicação, sem afirmação de backend implantado ou coleta real nova.

## Convergência com análise independente — 2026-10-15

O usuário solicitou rodadas de `make-discovery` analyze/clarify com subagentes
até uma análise do estado atualizado não retornar achados. A rodada de análise
cobre as oito abas e seus fatos obrigatórios. Este registro não aprova as
propostas abaixo nem conclui a meta antes da reanálise independente.

### C6 — significado de Arquivos Compartilhados: aceita A

**Resposta do usuário (2026-10-15):** A — Arquivos distintos com atividade
registrada; criação de link sem uso pode contar. Aceitas a unidade de arquivo,
deduplicação entre públicos/atores/dias, operações qualificantes e regras de
janela, resultado desconhecido, cobertura e comparação D30 deste pacote.
As opções B/C abaixo são histórico da pergunta, sem vigência.

**Origem:** B4, KPI de Atividade e Sincronização, DOCX §5/imagem05 e contrato
`activitySummary.sharedItems`. O período é D7/D30/D90/D180, mas o contrato não
fixa quais atividades tornam um arquivo compartilhado para esse contador.
Link criado, convite e concessão não representam o mesmo fato de acesso.

**Classe:** `CONTRACT` para a unidade/critério observável. Fonte, normalização,
chaves, histórico e cobertura são `BACKEND_FEASIBILITY`, investigados pelo
subagente sem pedir escolha de API ao usuário. Não é necessária outra API.

**Evidência disponível:** Reports publica contagens interna/externa sem IDs
de arquivos/interseção; a auditoria canônica já selecionada publica operações
de compartilhamento. A2 define conjuntos por arquivo/ator/dia e histórico de
400 dias. [API Reports](https://learn.microsoft.com/en-us/graph/api/reportroot-getonedriveactivityuserdetail?view=graph-rest-1.0),
[auditoria de compartilhamento](https://learn.microsoft.com/en-us/purview/audit-log-sharing),
[catálogo de atividades](https://learn.microsoft.com/en-us/purview/audit-log-activities#sharing-and-access-request-activities).

**Proposta do agente aceita pelo usuário: A.** Mantém um KPI de arquivos no período e explicita
que atividade registrada não prova acesso vigente, aceite ou sucesso da
operação. Não é regra atribuída retroativamente ao sponsor.

| Opção | Pacote de significado |
| --- | --- |
| A — arquivos com atividade, recomendada | Rótulo “Arquivos com atividade de compartilhamento”. Contar arquivos distintos com compartilhamento direto registrado, criação de link anônimo/organizacional/específico, inclusão de destinatário em link específico ou convite comprovadamente dirigido ao arquivo. Um mesmo arquivo conta uma vez no período, independentemente de públicos, atores e dias. Link sem uso/convite sem aceite podem contar como atividade; uso, remoção ou aceite isolados não iniciam novo compartilhamento. |
| B — eventos de compartilhamento | Rótulo “Eventos de compartilhamento de arquivos”. Mesmas operações e exigência de alvo factual de A, mas cada ID de evento conta uma vez; ações diferentes sobre o mesmo arquivo aumentam o valor. Não é quantidade de arquivos distintos nem de pessoas. |
| C — contagens interna/externa separadas | Substituir o KPI único por duas medidas: “Contagem reportada — interno” e “Contagem reportada — externo”. Somar separadamente cada coluna válida do Report por usuário, preservando as definições Microsoft. Não unir as duas contagens nem declará-las arquivos globalmente únicos; o mesmo arquivo pode contribuir em ambas e em registros de mais de uma pessoa. |

**Regras comuns de publicação:** contagens inteiras não negativas, com período,
referência, disponibilidade e cobertura próprias. Ausência/erro não viram zero;
falha preserva última publicação válida com seu frescor. Comparação somente
D30, com janela atual `[T-30dias,T)` e anterior `[T-60dias,T-30dias)`, mesma
unidade/regras/escopo e cobertura íntegra. Em C, usar fotografia factual do mesmo
relatório D30 com referência exatamente30dias anterior; sem ela não comparar.
D7/D90/D180 não ganham comparações novas. Não altera C1/estoque atual, risco,
outros KPIs, pesos ou prazos de retenção já aprovados.

**A/B:** somente arquivos comprovados no OneDrive empresarial, entre atores
humanos internos identificados do mesmo recorte A2; pastas/sites não contam
nem expandem para arquivos filhos. Evento sem chave inequívoca ou ator reduz
cobertura. Reconhecer `SharingSet`, `SharingInvitationCreated`,
`AnonymousLinkCreated`, `CompanyLinkCreated`, `SecureLinkCreated` e
`AddedToSecureLink` pelo código original; falha/parcial explícitos ficam fora.
Resultado ausente permanece desconhecido, sem afirmar sucesso ou concessão,
com quantidade de resultados desconhecidos publicada no contexto da métrica.
O documento específico atual descreve `SharingInvitationCreated` como convite
de site; esse evento não entra sem evidência real de alvo de arquivo, e nunca
é convertido em compartilhamento de todos os arquivos do site.

T é o fim exclusivo da última dataUTC integralmente publicada. A/B usam
`[T-Ndias,T)`, deduplicação de evento por ID e de arquivo por chave factual,
com conjuntos diários retidos400dias para consultar D180 sem conservar JSON
além dos90dias aprovados. Quantidade positiva parcial é observada no escopo
coberto; zero exige janela íntegra e ausência comprovada de qualificantes.
Primeira coleta não retroprojeta o passado. A resposta aceita é incorporada ao
contrato/mapping e encaminhada ao blueprint conceitual nesta convergência.

### C7 — medida de alertas no card Defender: aceita A

**Resposta do usuário (2026-10-15):** A — Alertas de segurança criados nos
últimos30dias, de qualquer classificação/status. Aceitas unidade de alerta,
deduplicação por identidade, relógio de criação, evidência de workload,
cobertura/ausência e ausência de comparação nova deste pacote. B/C abaixo
permanecem como histórico da pergunta.

**Origem:** achado B9 da análise independente. A imagem07/blueprint exibe
“Ameaças detectadas (30 dias)” e a fixture histórica usa `detectedThreats30d`.
O DOCX não fixa se a unidade é alerta, arquivo ou incidente nem escolhe o
relógio da janela. Dois alertas podem envolver o mesmo arquivo; um alerta pode
ser criado hoje e tratar de atividade iniciada há40dias. A classificação pode
ser falso positivo ou ainda não definida. As diferenças mudam o valor.

**Evidência:** `alerts_v2` já selecionado fornece ID de alerta,
`createdDateTime`, `firstActivityDateTime`, classificação e status. A admissão
pela evidência HTTPS OneDrive/SharePoint do tenant é a regra já aprovada.
`createdDateTime` significa criação do alerta no Defender, não instante da
atividade; `classification=truePositive` comprova a classificação de detecção
maliciosa. Context7 e [schema Microsoft atual](https://learn.microsoft.com/en-us/graph/api/resources/security-alert?view=graph-rest-1.0)
foram consultados nesta rodada. Não há nova fonte proposta.

**Classe:** `CONTRACT`. **Proposta do agente aceita pelo usuário: A**, contando alertas criados e
observados, com rótulo que não os apresente como ameaças confirmadas. A nova
semântica não é atribuída retroativamente ao DOCX/imagem nem à fixture.

| Opção | Significado fechado |
| --- | --- |
| A — alertas criados, recomendada | Rótulo “Alertas de segurança criados (30 dias)”, contexto de alertas observados. Contar IDs únicos admitidos cujo instante de criação esteja em `[T-30dias,T)`, independentemente do status ou classificação, incluindo não classificados, falsos positivos, atividade esperada e resolvidos. É volume de registros reportados, sem certificar ameaça nem atividade recente do arquivo. |
| B — alertas confirmados criados | Rótulo “Alertas confirmados criados (30 dias)”. Mesmo ID/relógio/janela de A, mas admitir somente classificação explícita `truePositive`, em qualquer status, inclusive resolvido. Excluir falso positivo, atividade esperada e ainda não classificado; classificação ausente/futura é desconhecida, nunca confirmação. Não equivale a arquivos maliciosos únicos nem ameaças atualmente ativas. |
| C — alertas com início de atividade na janela | Rótulo “Alertas com início de atividade (30 dias)”, contexto de alertas observados. Contar IDs únicos admitidos cujo `firstActivityDateTime` esteja em `[T-30dias,T)`, independentemente do status/classificação. Um alerta criado hoje para atividade iniciada há40dias fica fora. É referência ao início, não a toda atividade ocorrida na janela. |

**Comum:** unidade alerta; vários alertas do mesmo arquivo/incidente contam
separadamente e múltiplas evidências/páginas/atualizações do mesmo ID não o
multiplicam. Usar ID da fonte na fronteira de normalização, sem deduplicar por
título, nome de ameaça, URL ou `incidentId`. Não somar alertas de outro tenant
ou sem evidência admitida. Status/resolução não apagam um alerta histórico
qualificante; classificação e status são os publicados na geração avaliada.

T é a referênciaUTC factual da última publicação íntegra do conjunto de
alertas, distinta da hora da tela. ID, relógio escolhido, vínculo ou evidência
obrigatórios ausentes/inválidos reduzem cobertura, sem fallback para outro
timestamp. Classificação ausente não invalida A/C, que incluem todos os
registros; em B preserva desconhecimento. Timestamp posterior a T é
incompatível com essa publicação e não entra até avaliação válida.

Publicar inteiro não negativo ou nulo com unidade, definição de janela,
referência, cobertura e availability independentes dos três controles e da
quarentena. Positivo parcial é subtotal observado. Zero exige avaliação
íntegra do universo declarado de alertas observados; não atesta ausência de
ameaças ou cobertura de toda detecção do tenant. Paginação incompleta/falha
mantém estado próprio e última publicação válida. Nenhuma opção cria
comparação histórica nova, muda os scores, infere malware por título/extensão
ou converte catálogo de quarentena em contagem de alertas.

O mapping deverá reutilizar o leitor canônico de alertas e snapshots já
aprovados, sem consulta síncrona pela UI. Retenção da publicação local segue
os400dias já definidos para postura; a origem não é usada para reconstruir
alertas que não publicou. O novo binding identificará a medida aceita, sem
reinterpretar o valor sintético de `detectedThreats30d`.

### C8 — unidade dos vencimentos de retenção: aceita A

**Resposta do usuário (2026-10-15):** A — Arquivos atuais, uma vez por arquivo
e pelo fim nominal combinado de retenção. Aceitos janela de datasUTC inclusiva,
reconciliação de regras/âncoras/holds e limites de cobertura/ausência do pacote.
B/C abaixo permanecem como histórico da pergunta.

**Origem:** B10 da análise independente. Imagem07: “Próximas retenções a
expirar (15 dias)”. DOCX §7 não define unidade; R5 manteve vencimentos como
fato independente. O mapping anterior admite “item/caso”. Um arquivo com
regras terminando em10 e400dias e um caso com fim local em10dias pode gerar
zero arquivos, uma aplicação de regra ou um caso. A ausência permitida não
resolve qual unidade publicar quando as evidências estiverem disponíveis.

**Classe:** `CONTRACT`. **Proposta do agente aceita pelo usuário: A**, mantendo o card centrado
no conteúdo OneDrive e no fim nominal combinado das preservações aplicáveis.
A nova semântica não é atribuída retroativamente ao sponsor ou à fixture.

**Fontes existentes:** inventário Q5, regras/políticas Purview e aplicações
por item com âncora factual, além dos casos locais vigentes Q1 legitimamente
registrados. Não há novo provider. Context7 e os [princípios Microsoft](https://learn.microsoft.com/en-us/purview/retention)
confirmam que se comparam datas finais, considerando trigger e âncora, e que
hold/outra preservação impedem inferir liberação ou exclusão efetiva.

| Opção | Unidade e cálculo fechados |
| --- | --- |
| A — arquivos atuais, recomendada | Rótulo “Arquivos com fim nominal de retenção (15 dias)”. Contar uma vez cada arquivo atual único Q5 por `(driveId,itemId)` cujo fim combinado finito de retenção esteja na janela. Excluir pastas, excluídos, versões, PHL e duplicações remotas. Resolver todas as preservações aplicáveis/precedência e suas datas finais; entre preservações simultâneas, considerar a data final mais tardia, sem simplesmente escolher a maior duração. Regra indefinida, hold/revisão pendente, substituição ou escopo/âncora não resolvidos impedem fim determinável e ficam na cobertura. Regra em10dias e outra em400dias não qualificam o arquivo. |
| B — aplicações de retenção | Rótulo “Prazos de regras por arquivo (15 dias)”. Contar cada vínculo vigente comprovado arquivo/regra/aplicação com prazo nominal finito na janela. Deduplicar por identidade estável do arquivo, regra e aplicação vigente, preservando revisão/âncora; replay ou versões antigas não multiplicam. Um arquivo pode contribuir mais de uma vez. Outra regra ou hold pode continuar protegendo o arquivo e não elimina o prazo individual; se o próprio prazo depende de liberação/revisão não datada, ele é desconhecido. |
| C — casos locais | Rótulo “Casos com fim de retenção aprovado (15 dias)”. Contar casos elegíveis vigentes Q1, uma vez por pessoa/episódio atual, com `retentionUntil` factual e aprovação registrada do ciclo local. Excluir encerrados, recomendações R1 sem aplicação aprovada, prazo ausente e suspensão local não resolvida. Não somar arquivos/regras Microsoft. Origem local explícita e independente de holds/políticas Microsoft, sem afirmar liberação Microsoft. |

**Comum:** referência é a dataUTC factual D da publicação; finais nominais
entre D e D+15dias, inclusive, com precisão da origem preservada, sem horário
inventado. Datas já vencidas ficam fora. Regra, unidade da duração, trigger e
âncora devem estar resolvidos no perfil admitido; bloqueio/desligamento não
substituem âncora Microsoft. Contagem inteira não negativa ou nula, sem
percentual/arredondamento, com unidade, referência, revisão, cobertura de
elegíveis/observados/avaliados/desconhecidos e availability próprias.

Subtotal positivo parcial identifica seu universo; zero global exige
avaliação íntegra. Falha preserva última publicação válida e frescor. Nenhuma
opção presume ausência de hold, cria coleta nova ou converte prazo nominal em
exclusão programada/efetiva. Snapshots seguem a retenção local aprovada; novo
binding/unidade não reinterpreta a fixture nem altera as outras quatro métricas
R5. A resposta foi incorporada no contrato/mapping e no blueprint conceitual.

### C9 — inclusão em Atividades Críticas: aceita A

**Resposta do usuário (2026-10-15):** A — Somente Alto/Crítico, priorizando
maior risco e depois recência. Aceitos o contexto de níveis explícitos, janela
factual24h, até cinco eventos de origem, desempate e interseção dos filtros
sobre a lista publicada. B/C abaixo ficam como histórico da pergunta.

**Origem:** B11 da análise independente. Imagem08 mostra comportamentos
prioritários nas últimas24h, enquanto o contrato fixa até cinco eventos/IDs e
interseção pelos filtros, sem escolher o critério de entrada. Default-v1/R2
classifica risco, mas não seleciona membros desse card. Cinco leituras Baixo
recentes podem ocultar uma exclusão em massa Crítico anterior se somente a
recência for usada. A imagem não fixa cinco detectores obrigatórios nem permite
criar um detector novo de “upload incomum”.

**Classe:** `CONTRACT`. **Proposta do agente aceita pelo usuário: A**, selecionando níveis Alto e
Crítico já comprovados pelo classificador aprovado, com prioridade explícita.
A nova seleção não é atribuída retroativamente ao DOCX ou à fixture.

| Opção | Critério e apresentação fechados |
| --- | --- |
| A — Alto/Crítico, recomendada | Manter “Atividades Críticas (Últimas24h)” com contexto “Eventos de risco Alto ou Crítico”. Admitir somente eventos classificados nesses dois níveis, priorizando Crítico antes de Alto e depois instante decrescente/ID estável. Rotina Baixo/Informativo, Médio e não classificado ficam fora. |
| B — achados adversos de qualquer nível | Rótulo “Achados priorizados (Últimas24h)”. Admitir eventos com ao menos uma regra adversa não residual default-v1 comprovada; excluir rotinas classificadas apenas pelo residual R2 e eventos sem evidência de achado. Ordenar maior severidade comprovada, instante decrescente e ID estável. Médio pode entrar quando houver regra adversa, sem inventar detector/limiar. |
| C — toda atividade recente | Rótulo “Atividades Recentes (Últimas24h)”. Admitir todos os eventos canônicos, mesmo rotina Baixo/Informativo ou não classificada, ordenados por instante decrescente e ID estável. Não apresentar essa lista como seleção de risco ou incidentes prioritários. |

**Comum:** reutilizar os eventos canônicos e revisões de risco já aprovados;
janela factualUTC `[T-24h,T)`, com T igual ao fim exclusivo publicado da
consulta. Deduplicar por ID do evento e publicar até cinco, sem preencher
faltantes. Sinais locais em massa referenciam IDs de origem; não criar evento
de provider ou linha extra para aumentar a lista.

Aplicar o critério sobre a janela completa publicada, ordenar conforme a
opção e limitar a cinco na publicação base, sem usar apenas a página visível
da tabela. Preservar o comportamento aprovado dos filtros: intersectar os IDs
dessa lista com o inventário completo filtrado, mantendo ordem, sem completar
a lista com IDs que não foram publicados. Vazio após filtro significa nenhum
dos itens selecionados corresponde, sem afirmar inexistência de outros
eventos/achados não incluídos na lista limitada. Não inferir risco desconhecido
nem desempatar por nome de pessoa. Fonte/janela incompleta mantém disponibilidade
e cobertura próprias; ausência não é uma lista vazia comprovada. Nenhuma opção
altera a contagem de eventos, KPIs D30, demais gráficos ou auditSources.

### Incorporação da rodada C6–C9 —2026-10-15

As quatro respostas A foram incorporadas aos contratos, mappings, decisões,
designs das abas e ao adendo conceitual do blueprint. Nenhuma pergunta desta
rodada permanece aberta. A8/B3/B5 têm cobertura sintética validada; os reparos
B6/B7/B8 e as normalizações de forecast/faixas/scores preservam o significado
aprovado. Em B8, a primeira proposta técnica baseada no uso dos espaços foi
rejeitada por contraexemplo e substituída por atividade da própria pessoa em
ActivityUserDetailD180, conforme o significado explícito do DOCX §5.

A reanálise independente consolidada dos69artefatos retornou `[]` em2026-10-15,
satisfazendo o critério exigido pelo usuário. As oito abas e o módulo estão em
`backend_implementation_ready`; o fechamento e as evidências estão no
[relatório backend](backend-coverage-review.md). A fixture histórica permanece
inalterada e não representa payload externo ou um controller monolítico.
