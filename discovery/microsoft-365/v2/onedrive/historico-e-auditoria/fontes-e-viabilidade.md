# Fontes e viabilidade — Histórico e Auditoria

## Office 365 Management Activity API

Esta é uma **leitura complementar por provider próprio**, `office365-management-activity`, fora do Microsoft Graph. O DOCX aponta `manage.office.com` para `Audit.SharePoint` e `Audit.General`.

A listagem retorna blobs de conteúdo, com paginação via header `NextPageUri`; `contentUri` é opaca e deve ser obtida sem expor ou persistir a URL. `contentCreated` é a data de disponibilização do blob, não necessariamente o momento do evento. As entradas de arquivo SharePoint/OneDrive podem conter caminho e identidade, portanto são PII/sensíveis.

O contrato técnico cobre o controle mínimo de feed (`POST /subscriptions/start`),
`GET /subscriptions/list`, conteúdo disponível e recuperação do `contentUri`.
O controle é necessário para a leitura e não é escrita de domínio. A fixture do
Simulator representa o payload externo; qualquer fixture da UI continua sendo
um mapping separado para o contrato Orkestria.

Uma validação inicial somente GET observou `subscriptions/list` com `200
application/json` e lista vazia; `subscriptions/content` recebeu `400 AF20023`
com a assinatura desabilitada. Depois, com autorização operacional explícita,
`POST /start` retornou `200 enabled` para `Audit.SharePoint` e `Audit.General`;
`GET /list`, `GET /content` e um `GET contentUri` por tipo também retornaram
`200`. Os blobs observados tinham corpo em array JSON, mas o header era
`text/plain; charset=utf-8` (a referência Microsoft descreve JSON). Não houve
erro de licença. Esses resultados são evidência técnica limitada às chamadas
executadas, não cobertura contínua nem conclusão sobre outros tenants; nenhum
payload bruto, identidade, ID ou URL foi preservado.

## Mapa de coleta para a superfície

`Audit.General` pode conter Teams/outros workloads. O contentType não comprova
que cada registro pertence a OneDrive. Admitir somente eventos com vínculo
inequívoco a drive/site pessoal publicado: Workload/RecordType permitido e
chave de item/site/URL correlacionável no registry do mesmo tenant. Eventos
administrativos entram apenas quando operação/propriedade documentada afeta
OneDrive. Registros sem vínculo ficam fora da projeção OneDrive com motivo de
cobertura; nunca correlacionar por título ou texto livre. A identidade de
organização do evento deve coincidir com a conexão da coleta.

O contrato da tela não é o payload externo. O collector recupera os blobs,
normaliza os eventos e publica uma projeção tenant-scoped; a UI só consulta essa
projeção. `CreationTime` é o instante do evento e `Id` é a chave de
deduplicação. `contentCreated` serve somente para percorrer a disponibilidade do
feed — não ordena evento, não é a data da atividade e não deve aparecer como
“publicação” na tela.

| Dado publicado pela UI | Fonte no evento de auditoria | Regra de normalização |
| --- | --- | --- |
| Identidade, data/hora, evento e categoria | `Id`, `CreationTime`, `Operation`, `RecordType`, `Workload` e `contentType` | `Id` deduplica; a ordem é por `CreationTime`; categoria é uma classificação Orkestria versionada, nunca a ordem do blob. |
| Ator e resultado | `UserId`, `UserType` e, quando publicado, `ResultStatus` | Contas de sistema e `app@sharepoint` continuam identificadas como tal. Campo ausente é nulo, não sucesso inferido. |
| Arquivo, pasta e caminho | `ObjectId`; para operações de arquivo/SharePoint, `SiteUrl`, `SourceRelativeUrl`, `SourceFileName` e campos de destino em cópia/movimentação | A composição `SiteUrl` + `SourceRelativeUrl` + `SourceFileName` pode equivaler ao caminho em `ObjectId`. Expor somente a versão sanitizada/autorizada na projeção. |
| Compartilhamento, destinatário e permissão | `TargetUserOrGroupName`, `TargetUserOrGroupType`, `UserSharedWith`, `SharingType`, `UniqueSharingId` e, quando publicado, `EventData` | São campos específicos de eventos de compartilhamento. `EventData` requer parser versionado; ausência não é permissão negada nem destinatário inexistente. |
| IP, localização e dispositivo | `ClientIP`; `UserAgent` e, em eventos de sincronização que o publiquem, `MachineDomainInfo` | O feed fornece IP e metadados de cliente, não geolocalização pronta nem inventário de dispositivo. Localização exige enriquecimento interno aprovado a partir de IP; sem ele, localização é nula. |
| Antes/depois e correlação | `ModifiedProperties` quando o schema daquele evento o publicar; `AppAccessContext.CorrelationId` quando presente | `ModifiedProperties` não é universal (por exemplo, ocorre em eventos administrativos). Correlação é opcional e não deve ser fabricada. |
| Proprietário, origem, JSON e ação recomendada | proprietário por correlação com inventário/projeção de conta; origem por `contentType` + `Workload` + `RecordType`; evento bruto sanitizado; regra Orkestria | O provider não entrega um “proprietário da conta OneDrive” genérico no evento. A recomendação é uma regra local explicável, não um veredito do feed. |

O schema oficial é em duas camadas — comum e específico do serviço. Por isso a
presença dos campos específicos depende de `RecordType`/operação; o adapter não
pode exigir `SourceFileName`, `TargetUserOrGroupName`, `ModifiedProperties`,
`UserAgent` ou `AppAccessContext` para aceitar todo evento.

## Operações necessárias e operações condicionais

O projeto exige `PublisherIdentifier` em todas as chamadas (`POST /start`,
`GET /list`, `GET /content` e recuperação do `contentUri`) para usar a quota
dedicada do fornecedor. A Microsoft documenta quota compartilhada quando o
parâmetro é omitido; não afirma rejeição universal de requests sem ele. As operações
`SUPPORTED` do Simulator agora o declaram como obrigatório em todas as quatro
operações. `contracts:generate`, `inventory`, `validate` e `smoke` passaram com
esse parâmetro nas chamadas sintéticas. Na execução autorizada, também foi
enviado em `start`, `list`, `content` e `contentUri`; o feed respondeu com
`200 enabled` e os endpoints de leitura retornaram `200`. O estado não prova
completude nem frequência de publicação. A rota `content` conserva a
restrição de `startTime` e `endTime` juntos.

| Operação / conteúdo | Decisão para OneDrive | Motivo e condição de entrada |
| --- | --- | --- |
| `POST /subscriptions/start` para `Audit.SharePoint` e `Audit.General` | Necessária na integração futura; já representada e validada | Controle técnico do feed, fora da UI. A execução exige autorização operacional explícita; definir como o lifecycle de conexão fará essa habilitação em produção. |
| `GET /subscriptions/list` | Necessária; já representada | Verifica pré-requisito e estado das duas subscriptions antes de tratar conteúdo como acessível. |
| `GET /subscriptions/content` para `Audit.SharePoint` e `Audit.General` | Necessária; já representada e validada | Descobre blobs, segue `NextPageUri` opaca e usa `PublisherIdentifier` em todas as chamadas de produção para a quota dedicada do fornecedor. |
| `GET contentUri` | Necessária; já representada e validada | Obtém o array de eventos que sustenta KPIs, séries, ranking, tabela e detalhe. Uma leitura por tipo retornou array JSON com `Content-Type: text/plain`; usar URL opaca/efêmera e tolerar o media type observado ao interpretar JSON. |
| `POST /subscriptions/stop` | Não necessária agora | Só entra no lifecycle de desconexão/desprovisionamento do provider. Não é exigida para coleta, UI ou fixture atuais; quando esse lifecycle for aprovado, exige operação e cenário próprios no Simulator. |
| Webhook e histórico de notificações | Não necessários agora | O collector usará polling com watermark/deduplicação. Adicionar webhook somente se existir requisito de latência/entrega que não seja atendido pelo polling; então serão necessários listener seguro, validação e o contrato de notificações. |
| `DLP.All` e `GET /resources/dlpSensitiveTypes` | Não necessários agora | Só entram quando uma superfície aprovar fatos de DLP/tipo sensível. O recurso de nomes amigáveis documentado pela API é específico de `DlpSensitiveType`; ele não resolve arquivos, usuários ou permissões do OneDrive. |
| `Audit.Exchange`, `Audit.AzureActiveDirectory` e demais conteúdos | Fora do escopo atual | Não são necessários para os fatos OneDrive aprovados. Uma nova necessidade deve declarar o fato, unidade, período e regra de agregação antes de expandir `contentType`, contrato ou fixture. |

Não há outro endpoint da Office 365 Management Activity API necessário para o
escopo atual. A única expansão prevista acima é condicional e não autoriza criar
rota, fixture ou operação do Simulator antecipadamente.

## Limites que a projeção local resolve

`startTime` e `endTime` devem ser enviados juntos; a janela é de até 24 horas e
o início não pode estar mais de 7 dias no passado. Além disso, conteúdo expirado
não pode mais ser recuperado. Portanto, o período de 30 dias da UI é consultado
na projeção Orkestria retida, criada por coleta incremental de janelas curtas,
watermark e deduplicação — não por uma chamada Management API de 30 dias.

Fontes oficiais: [referência da API](https://learn.microsoft.com/office/office-365-management-api/office-365-management-activity-api-reference?view=o365-worldwide) e [schema Common/SharePoint](https://learn.microsoft.com/pt-br/office/office-365-management-api/office-365-management-activity-api-schema). A cópia canônica pinada para o Simulator está no repositório [MicrosoftDocs/office-365-management-api](https://github.com/MicrosoftDocs/office-365-management-api/tree/1d883fea350c3374e664405fb783b823fa9b3df3/office-365-management-api).

## A5 — normalização canônica audit-operations-v1

**Evidência:** [catálogo de atividades Microsoft](https://learn.microsoft.com/en-us/purview/audit-log-activities)
e [schema Common/SharePoint](https://learn.microsoft.com/en-us/office/office-365-management-api/office-365-management-activity-api-schema).
Aplicar após admissão de tenant, workload e vínculo OneDrive. Manter a operação
original sanitizada e a versão do mapping na projeção interna; não renomear o
payload do provider nem usar os códigos ilustrativos da fixture como operações
Microsoft. Cada `Id` admitido gera um único evento canônico, mesmo se satisfizer
vários predicados analíticos. Replays não geram outro evento.

| Operação real / condição comprovada | Código Orkestria | Categoria / limite |
| --- | --- | --- |
| `FileAccessed`, `FileAccessedExtended` | `FileAccessed` | Acesso a arquivo; repetições estendidas continuam eventos do provider, não acessos físicos completos |
| `FilePreviewed` | `FileViewed` | Acesso a arquivo; prévia de arquivo, sem converter `PagePrefetched` em leitura |
| `FileDownloaded` | `FileDownloaded` | Acesso a arquivo |
| `AnonymousLinkUsed`, `CompanyLinkUsed`, `SecureLinkUsed`, com alvo de arquivo comprovado | `FileAccessed` | Acesso a arquivo; link usado não prova identidade externa |
| `SharingSet`, `SharingInvitationCreated`, `CompanyLinkCreated`, `SecureLinkCreated` | `SharingSet` | Compartilhamento; criação/convite não comprova concessão atualmente vigente nem aceitação do convite |
| `AnonymousLinkCreated` | `AnonymousLinkCreated` | Compartilhamento |
| `AnonymousLinkRemoved` | `AnonymousLinkRemoved` | Compartilhamento; remoção não incrementa links criados |
| `SharingRevoked`, `AddedToSecureLink`, `RemovedFromSecureLink`, `SharingInheritanceBroken`, `PermissionLevelsInheritanceBroken`, `CompanyLinkRemoved`, `SecureLinkDeleted`, `AnonymousLinkUpdated`, `SharingInvitationUpdated`, `SharingInvitationRevoked` | `PermissionChanged` | Compartilhamento; preservar a ação original para distinguir inclusão, atualização e revogação |
| `FileModified`, `FileModifiedExtended` | `FileModified` | Modificação de conteúdo ou propriedades |
| `FileMoved`, `FileRenamed`, `FileRestored`, `FolderCreated` | Mesmo código | Modificação; preservar arquivo/pasta e origem/destino quando publicados |
| `ListItemCreated`, somente quando tipo arquivo e identidade do item estiverem comprovados | `FileCreated` | Modificação; criação de item genérico não comprova arquivo |
| `FileSyncUploadedFull`, `FileSyncDownloadedFull`, `FileSyncUploadedPartial`, `FileSyncDownloadedPartial`, `ManagedSyncClientAllowed`, `UnmanagedSyncClientBlocked` | `Synchronization` | Sincronização; variantes Partial são legado depreciado. Evento Allowed/Blocked não comprova transferência ou sucesso do cliente |
| `FileDeleted`, `FileRecycled`, `FileDeletedFirstStageRecycleBin`, `FileDeletedSecondStageRecycleBin` | `FileDeleted` | Exclusão; conservar etapa original. Excluir remoção de versão deste predicado de arquivo |
| `ComplianceSettingChanged` | `RetentionChanged` | Administração; rótulo de retenção aplicado/removido não prova mudança de toda a política |
| `FileMalwareDetected` | `MalwareDetected` | Outros; achado factual, distinto da extensão do arquivo |
| `FileUploaded` sem criação/edição anterior comprovada, demais operações conhecidas sem equivalência acima e novas operações desconhecidas | `OtherAuditActivity` | Outros; sem inferir criação, edição, transferência de propriedade ou sucesso. Preservar código original no detalhe sanitizado |

Antes do código base de acesso, admitir `GuestAccessed` somente quando o
evento de acesso e a identidade externa no instante estiverem comprovados;
admitir `AdminOneDriveAccessed` somente para acesso por administrador explícito
ao OneDrive de outra pessoa, com esse vínculo no instante. Se ambos forem
comprovados, Administração precede Guest; sem contexto, manter o acesso base.
Não aplicar essas especializações por UPN, IP ou proprietário atuais isolados.
`SiteCollectionAdminAdded` prova concessão administrativa, não o acesso em si;
sem equivalência canônica específica, permanece `OtherAuditActivity`.
`OwnershipTransferred` não é sintetizado de troca de proprietário entre
snapshots: só publica esse código quando existir fato de transferência
comprovado. O catálogo de códigos possíveis não garante eventos de todos eles
em cada fonte, janela ou tenant.

**Resultado:** no perfil Common/SharePoint, `Succeeded` → sucesso explícito e
`Failed` → falha explícita. `PartiallySucceeded` permanece resultado parcial
identificado, sem ser sucesso integral; se a forma de apresentação não admitir
esse código, o resultado é não publicado e conserva o original no detalhe.
Ausência, `Success`, booleanos/strings True/False ou outros valores não são
convertidos por heurística: exigem perfil específico comprovado para o
workload. A documentação admite semânticas diferentes entre workloads; por
isso `ResultStatus` de outro serviço não autoriza sucesso para este perfil.
`UnmanagedSyncClientBlocked` comprova bloqueio daquela tentativa mesmo sem
resultado genérico, mas não prova que todo cliente esteja pausado/sem sync.
Nenhuma regra R2 que exige sucesso é satisfeita por resultado desconhecido.

**KPIs e sinais:** total de eventos = quantidade de `Id` distintos admitidos;
categorias particionam esses eventos, incluindo Outros. Downloads contam os
eventos `FileDownloaded` e `FileSyncDownloadedFull` observados, com contexto de
transferência; versões Partial legadas ficam identificadas separadamente.
Exclusões contam os eventos de arquivo da linha correspondente, preservando
suas etapas. `auditSummary.linkCount`, apresentado como “Links Anônimos Criados”,
conta exclusivamente `AnonymousLinkCreated`, por `Id` distinto admitido na
janela UTC D30 publicada do resumo. `CompanyLinkCreated` e `SecureLinkCreated`
não incrementam esse KPI; atualização, revogação e uso também ficam fora.
Compartilhamentos criados contam `SharingSet`, `SharingInvitationCreated`,
`AnonymousLinkCreated`, `CompanyLinkCreated` e `SecureLinkCreated`, sem
presumir que eventos distintos representem uma
única intenção humana. Acessos externos exigem identidade/contexto externos
comprovados. Pessoas e itens afetados deduplicam, respectivamente, identidade
factual do ator humano e chave estável do arquivo; eventos sem chave reduzem
a cobertura da métrica, mas não desaparecem do total de eventos.

`BulkDownload`/`BulkDeletion` são sinais locais com IDs dos eventos originais;
não são novas linhas nem incrementam totais/categorias. Regras aprovadas de
volume usam arquivos distintos por ator/janela, não número de blobs ou versões
do mesmo arquivo. Falha explícita não é execução bem-sucedida; contexto ou
resultado desconhecidos não completam regra que os exija. Eventos desconhecidos
não recebem risco de rotina. Séries e comparações registram a versão do
mapping; não comparar versões incompatíveis nem reconstituir detalhe expirado.

Esta normalização reutiliza o HTTP e schema já selecionados. Não acrescenta
API externa nem requer outra operação no Simulator. A2 reutiliza seus eventos
e snapshots para métricas distintas; a classificação de eventos e a contagem
de arquivos têm denominadores independentes.

### Fechamento GA1 — links anônimos criados

O predicado específico do KPI prevalece sobre a expressão genérica “links
criados”. Para o agregado de compartilhamentos, as criações de links continuam
sendo `AnonymousLinkCreated`, `CompanyLinkCreated` e `SecureLinkCreated`; essa
união não alimenta `linkCount`. O evento é contado como registro de auditoria,
conforme o tratamento de resultado do perfil A5, sem inferir sucesso ou uma
concessão atualmente vigente. Replays entre páginas, blobs ou feeds não
multiplicam o `Id`.

Se T é o fim exclusivo da janela UTC D30 do resumo, aplicar `[T-30dias,T)` a
`CreationTime`; a comparação usa `[T-60dias,T-30dias)` e o mesmo predicado e
revisão. Cada publicação conserva referência, cobertura de ingestão e
disponibilidade próprias. Sem janela/operação integralmente coberta, não
publicar zero nem comparação completa; falha preserva a última publicação
válida com seu frescor. Um `SecureLinkCreated` isolado mantém o KPI anônimo
em zero somente quando a cobertura íntegra comprovar ausência de criação
anônima. Fechamento técnico em 2026-10-15, conforme o label já aprovado no
[blueprint](../ui-blueprint.md#surface--histórico-e-auditoria), sem decisão nova
de produto ou alteração da assinatura externa `SUPPORTED`.

## Fatos derivados localmente e retenção

### B11 — Atividades Críticas: C9 aceita A

O usuário aprovou em2026-10-15 a seleção de eventos Alto/Crítico, priorizando
severidade e depois recência. Reutilizar a projeção normalizada canônica de
eventos, sem outra API, feed ou detector. `risk` deve estar comprovado pelo
default-v1/R2 na revisão admitida; usar evidências do instante do evento, não
permissão/risco corrente do arquivo como substituto histórico.

Definir T como `events.window.endExclusive`UTC publicado. Sobre todos os eventos
admitidos na conexão e em `[T-24h,T)`, deduplicar `Id`, excluir risco fora de
`critical/high` e ordenar `(severidade crítica antes de alta, CreationTime
decrescente, Id ascendente)`. Só então selecionar no máximo cinco. Evento sem
identidade/instante válidos ou com classificação não avaliada não é rotina
para completar a lista; registrar exclusão/desconhecido na cobertura.

Publicar os mesmos IDs e atributos de evento em `criticalActivities`, com
`criticalActivitiesMetadata` informando janela, T, revisão de normalização/risco,
predicado, limite e avaliação/cobertura/disponibilidade. Não criar ID de evento
para `BulkDownload`/`BulkDeletion`; sinais locais referenciam eventos existentes
e o evento entra uma vez no maior nível satisfeito. Não inventar detector de
upload incomum para reproduzir o texto ilustrativo da imagem.

A lista base é independente da página da tabela. Os filtros locais já
aprovados intersectam seus IDs com o inventário completo filtrado; mantêm a
ordem e não buscam substitutos para completar cinco. Uma lista filtrada vazia
não significa ausência de outros achados fora dos cinco selecionados.
Coleção base vazia só é factual com ingestão/classificação íntegras no universo
declarado; gaps preservam parcial ou última publicação válida com frescor.

Os eventos continuam com retenção90dias. Presença agregada não reconstitui
detalhe expirado; essa lista24h usa eventos admitidos reais. Nada altera KPIs
D30, distribuição, scores, `auditSources` ou cardinalidade de eventos. O HTTP e
sua cobertura SUPPORTED já existentes são suficientes.

- **R2 aceita:** o residual de evento rotineiro com sucesso explicitamente
  normalizado e contexto avaliado pode ser Baixo; resultado ausente não vira
  sucesso e só pode alimentar Informativo para rotina conhecida com demais
  requisitos satisfeitos. Catálogo de operação e perfil de ResultStatus
  controlam o mapping; valor desconhecido não é interpretado como sucesso.
  Contexto corrente não comprova contexto do instante do evento. Sem regra
  residual aplicável ou evidência obrigatória, risco nulo; nenhuma leitura
  externa adicional é criada por essa classificação local.

- O provider entrega eventos, não os agregados da tela. `auditSummary`,
  distribuição por categoria/risco, série diária/mensal, top atores, atividades
  críticas, filtros, labels em português e recomendações são projeções locais
  sobre eventos normalizados. A classificação de operação segue o mapa do
  contrato; risco e criticidade exigem regras versionadas e limiares aprovados,
  que não vêm do feed nem estão integralmente definidos pelo DOCX.
- Localidade geográfica exige enriquecimento separado de `ClientIP`; o feed
  fornece IP/metadados de cliente, não geolocalização pronta. Sem essa fonte e
  aprovação, `ipLocation` fica nulo e não compõe catálogo/filtro. User agent,
  destinatário, mudança antes/depois e correlation ID também são opcionais por
  tipo de evento.
- `auditSources.status` representa configuração local do perfil de ingestão,
  conforme A4 abaixo; não é status das subscriptions, coverage nem prova de
  eventos coletados. Coverage/freshness vem da publicação local do collector
  e permanece independente.
- Como o provider só conserva blobs disponíveis por período curto e não oferece
  consulta retroativa por evento, o collector precisa percorrer janelas curtas,
  seguir `NextPageUri`/`contentUri`, persistir eventos normalizados por
  `Id`/`CreationTime` e publicar watermark/completude próprios. A tela exige
  recortes até D90; séries mensais consumidas por outras superfícies devem usar
  rollups ou snapshots próprios, não reler blobs antigos.
- Retenção/exclusão e risco estão aprovados na clarificação 2: eventos e JSON
  sanitizado por 90 dias, snapshots diários por 400 dias, rollups por 13 meses e
  matriz default-v1. Localidade só é publicada com fonte explicitamente
  disponível e semanticamente comprovada; enriquecimento geográfico separado
  não entra como integração obrigatória. Sem ele, permanece nula.

## A4 — configuração das quatro fontes

O contrato já distingue **estado configurado** de cobertura. A estratégia é
uma projeção local do registro de integração por conexão/perfil: `enabled`
explícito, vínculo ao consumidor canônico, referência da configuração e origem
da decisão. Ativo = ingestão daquele perfil habilitada no Orkestria;
Desativado = ingestão explicitamente desabilitada no Orkestria. Não são
diagnóstico do serviço Microsoft, auditoria global do tenant, estado de
política ou prova de coleta bem-sucedida. Falha/ausência de eventos não muda
automaticamente a intenção configurada; publica seu estado operacional em
`sourceCoverage`/availability próprios.

| Entrada fixa do card | Configuração/fonte canônica reutilizada | Limite |
| --- | --- | --- |
| Unified Audit Log (SharePoint/OneDrive) | Perfil local do consumidor compartilhado de `Audit.SharePoint` e `Audit.General` descrito nesta aba | `subscriptions/list` comprova estado de cada feed, separado do enabled local; uma assinatura habilitada não demonstra as outras três entradas |
| Microsoft Graph Audit Logs | Perfil local ligado ao consumidor canônico `directory_audits` de `CanonicalAuditEventsCollector`/`PublishedEventQuery`, já existente na aplicação | Reuso de publicação/metadados canônicos, sem novo collector/GET. Card configurado não inclui automaticamente eventos Entra na lista OneDrive; continuam exigindo vínculo de domínio comprovado |
| Microsoft Purview DLP | Perfil local do leitor de política/export Purview e de achados DLP selecionados em Configurações e Segurança | `alerts_v2` vazio não prova DLP desativado; habilitar o perfil não comprova política aplicada a arquivo nem pontua o score |
| Microsoft Defender for Cloud Apps | Perfil local de ingestão dos alertas do produto na coleção Defender já selecionada, distinguindo `serviceSource=microsoftDefenderForCloudApps` | Não equivale a feed completo de atividades Cloud Apps nem a todo Defender. Presença/ausência de alerta não determina ativação do produto |

O registry deve ser criado pelo lifecycle de configuração com valores
explícitos para os quatro perfis; perfil não solicitado nasce desabilitado
como configuração local registrada, nunca como inferência sobre Microsoft.
Não usar um `false` de fallback ao ler registro ausente. Sem configuração
registrada, não publicar o card completo: `not_yet_published`/partial conforme
os fatos já existentes; preservar última publicação válida quando houver.
Uma configuração enabled sem consumidor/contrato canônico compatível é
inválida e não é promovida. Não fabricar opções por fixture ou número de
eventos. Nenhuma configuração ou operação real foi alterada nesta revisão.

O [mapping de Configurações e Segurança](../configuracoes-e-seguranca/fontes-e-viabilidade.md)
continua definindo políticas/achados, permissões, licenças e evidência por
arquivo. Aqui só se publica a intenção de ingestão registrada. Esta disposição
resolve a atribuição incorreta das quatro linhas às duas subscriptions,
preservando o significado já aprovado de estado configurado e os quatro nomes.
Não exige novo endpoint externo ou operação no Simulator.

O enum de origem está documentado em [serviceSource](https://learn.microsoft.com/en-us/graph/api/resources/enums-security?view=graph-rest-1.0#servicesource-values).
Filtrar a publicação já coletada por esse valor não requer um request com
filtro novo. Vínculo OneDrive continua exigindo evidência explícita de URL
autorizada, como no leitor canônico de alertas.

## Lifecycle default do feed e publicação

No onboarding de uma conexão connected e autorizada, consultar list; para
Audit.SharePoint/General ausentes/desabilitados, executar start uma vez e
confirmar list. Não repetir start antes de 15 min. Se já enabled, reutilizar;
não chamar start indiscriminadamente nem remover webhook existente. Webhook
não é criado no default polling; uma configuração existente que não puder ser
preservada exige revisão operacional, enquanto publicações válidas existentes
mantêm seu estado próprio. `PublisherIdentifier` vem do tenant fornecedor
configurado; não adivinhar o GUID de outro customer/aplicativo.

Seguir janelas de disponibilidade de até 24h, com revisita sobreposta de 24h
para blobs tardios, paginação NextPageUri e deduplicação por event Id. Usar
contentCreated para watermark do feed e CreationTime para dados de negócio.
Recuperar janelas ainda disponíveis dentro do limite de 7 dias; um intervalo
perdido além disso continua gap permanente de cobertura. Blob expirado, falha
de página ou schema inválido não são janela vazia íntegra. Tratar JSON
documentado e JSON em text/plain observado antes de validar o array e cada
registro; URLs opacas ficam restritas ao host aprovado e recebem o
PublisherIdentifier sem encaminhar token a host arbitrário.

Após start, até 12h para primeiros blobs é inicialização, não ausência de
atividade. A primeira janela completa é publicada com início real de cobertura;
D30/D90 anteriores à coleta são parciais. Ao desconectar/revogar a conexão,
interromper consumo e marcar a publicação stale/restrita conforme o contexto;
preservar dados autorizados dentro da retenção local. Não enviar stop como
efeito automático: auditoria e compartilhamento usam o mesmo feed; o lifecycle
de remoção deve comprovar que não há consumidor legítimo e autorização própria.

## Decisão

Eventos, tendências, links anônimos criados, downloads e exclusões dependem
da integração futura e da publicação local por watermark/deduplicação. Antes
da primeira publicação, usar o estado de ausência aprovado no contrato do
bloco (`not_yet_published` quando aplicável), com motivo/cobertura conhecidos;
falha, restrição e desatualização mantêm seus estados próprios. Prontidão de
Discovery não é estado runtime nem prova de coleta; não concluir inexistência
de fonte ou usar fixture como histórico factual.
