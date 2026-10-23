# APIs — Configurações e Segurança

As rotas reutilizadas possuem contrato externo e foram reobservadas nesta
rodada, sempre por publicação local — nunca pela tela:

- `GET /security/secureScores?$top=25`, `200` OData paginado, com `currentScore`,
  `maxScore`, `createdDateTime` e `controlScores`;
- `GET /security/secureScoreControlProfiles?$top=25`, `200` OData paginado,
  com categoria, `maxScore`, remediação, serviço, ameaças e estado do controle;
- `GET /admin/sharepoint/settings`, `200` JSON com flags de compartilhamento,
  sincronização e retenção.

As três leituras exigem as permissões documentadas de Security Events ou
SharePoint Tenant Settings e podem conter metadados sensíveis de postura. Esta
superfície consome somente a projeção local publicada; não há chamada em tela e
não se replica payload externo aqui.

Configuração de política Purview/DLP não é fornecida pelas rotas de achados.
A aplicação de sensibilidade por arquivo é a ação controlada documentada em
Arquivos e Conteúdo; o recorte de dispositivos Intune é documentado na subpágina
de Atividade e Sincronização, que é sua fonte canônica.

Também foram validadas como leituras externas de política — ainda sem chamada da
tela — as rotas Graph `GET /security/dataSecurityAndGovernance/sensitivityLabels?$top=25&$select=id,displayName,name,hasProtection,isDefault,priority`
com `SensitivityLabels.Read.All` e `GET /security/labels/retentionLabels?$top=25&$select=id,displayName,isInUse,behaviorDuringRetentionPeriod,actionAfterRetentionPeriod,retentionTrigger,retentionDuration,lastModifiedDateTime`.
Ambas respondem coleção OData; a primeira foi observada vazia. A permissão
mínima de aplicação para o catálogo de sensibilidade é `SensitivityLabel.Read`;
`SensitivityLabels.Read.All` é a permissão superior usada pela validação.

Para rótulos de retenção, a documentação atual não oferece permissão de
aplicação: `RecordsManagement.Read.All` é somente delegada. As tentativas
temporárias app-only retornaram `401`; isso não é resolvido adicionando uma role
ao client-credentials, e a rota não pode ser usada pelo coletor app-only atual.
Essa rota exige autorização delegada/OBO ou outra fonte. A estratégia
selecionada para o catálogo é export Purview app-only por certificado,
documentado abaixo, sem exigir OBO para essa publicação. [Permissões do
catálogo de retenção](https://learn.microsoft.com/graph/api/security-labelsroot-list-retentionlabel?view=graph-rest-1.0).

`GET /security/alerts_v2?$top=25`, com `SecurityAlert.Read.All`, é a leitura
Graph de alertas Defender adotada para ameaças. A coleta sanitizada encontrou
envelope OData vazio em uma conexão e `403` por condição de provider em outra;
nenhuma condição é publicada como ameaça ou coleção vazia. A rota pagina por
`@odata.nextLink`. `evidence` é uma propriedade do alerta, não uma navegação:
`$expand=evidence` retorna `400` e não faz parte da requisição aprovada. A
projeção só inclui o alerta quando uma `urlEvidence.url` HTTPS corresponder a
host SharePoint/OneDrive do próprio tenant.

Para DLP, a mesma coleção usa `GET /security/alerts_v2?$top=25&$filter=serviceSource eq 'dataLossPrevention'`, também com `SecurityAlert.Read.All`. A forma filtrada foi consultada de modo sanitizado: uma conexão retornou envelope OData válido vazio e outra apresentou condição local de provider. Ela pagina por `@odata.nextLink`; cada alerta publicado exige, além do filtro, `urlEvidence.url` HTTPS em host OneDrive/SharePoint do tenant. `serviceSource` confirma apenas a origem DLP do achado: coleção vazia, título, severidade ou ausência de alerta não comprovam política DLP, cobertura ou pontuação conforme.

`GET /drives/{drive-id}/items/{item-id}/retentionLabel`, com `Files.Read.All`,
é a leitura Graph adotada para retenção aplicada por arquivo. A coleta sanitizada
obteve `200 application/json` em uma conexão; a segunda ficou sem drive/item
resolvível. O `200` observado não publicou campos de `itemRetentionLabel`, logo
a projeção o preserva como desconhecido, sem interpretar a forma vazia como
ausência de retenção.

## Reutilização de Acesso Condicional — 14/10/2026

`GET https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies?$top=100`,
sem corpo, `Accept: application/json`, audience `https://graph.microsoft.com`,
autenticação de aplicação com `Policy.Read.All`, reutiliza a validação de
[Configurações/Identidade e Acesso](../../configuracoes/identidade-e-acesso/api.md):
`200` OData vazio válido em duas tentativas, com variante ampla também vazia.
O contrato documentado inclui `id`, `displayName`, `state`, `conditions`,
`grantControls` e `sessionControls`. Coleção vazia não comprova cobertura por
MFA ou gerenciamento de dispositivo. `@odata.nextLink` é opaco, e `401`, `403`
e `429` são erros/condições, nunca política ausente. Nome, IDs de usuário/grupo
e escopos são metadados sensíveis; a projeção minimiza os valores expostos.

A fonte já é canônica para CA. OneDrive deve reutilizar sua fotografia, sem
novo leitor por tela. `state=enabled` é distinto de report-only; avaliar
aplicações, usuários/grupos, exclusões e lógica de `grantControls` antes de
concluir que MFA ou dispositivo conforme são exigidos no recorte.
[Contrato Graph](https://learn.microsoft.com/en-us/graph/api/conditionalaccessroot-list-policies?view=graph-rest-1.0).

O handoff de Simulator reutiliza a assinatura já `SUPPORTED`
`GET /identity/conditionalAccess/policies?$top=100`, `application/json`.
Nenhuma operação nova é necessária. A fixture atual exemplifica política MFA
para administradores; ela não comprova que um avaliador de cobertura OneDrive
já trate todos os escopos/exceções.

## Leitores complementares documentados, sem execução nesta modalidade

Fontes PowerShell/CSOM são contratos de ferramenta/SDK, não endpoints Graph.
Não publicar um OpenAPI HTTP especulativo a partir do nome de um cmdlet.
O mapping de fatos e as sugestões de baseline estão em
[fontes e viabilidade](fontes-e-viabilidade.md).

| Fonte externa | Autenticação e autorização documentadas | Contrato relevante e limite da evidência |
| --- | --- | --- |
| `Connect-SPOService` → `Get-SPOTenant` e `Get-SPOSite -Detailed`; CSOM SharePoint | App identity com certificado no Shell; Entra app-only CSOM requer certificado e permissões SharePoint próprias. A modalidade Graph com client secret não demonstra acesso. | Configuração específica OneDrive, defaults de link, versões e controles por site. Nenhuma sessão/resposta sanitizada dessa modalidade foi coletada nesta investigação. [Connect-SPOService](https://learn.microsoft.com/en-us/powershell/module/microsoft.online.sharepoint.powershell/connect-sposervice?view=sharepoint-ps), [CSOM app-only](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azuread). |
| `Connect-IPPSSession` → leitores de política Purview | `ExchangeOnlineManagement` compatível, certificado, app-only, `Exchange.ManageAsApp` da API Microsoft Exchange Online Protection, consentimento e role/RBAC de leitura dos cmdlets | `Get-DlpCompliancePolicy`, `Get-RetentionCompliancePolicy -DistributionDetail` e `Get-ComplianceTag` são leitores selecionados para export de postura/catálogos, com perfil de entrada e primeira extração validados no onboarding. A modalidade geral é suportada; não há schema exportado/observação de sucesso desses leitores nesta tarefa. A rota Graph retentionLabels continua delegated-only. [Autenticação](https://learn.microsoft.com/en-us/powershell/exchange/app-only-auth-powershell-v2?view=exchange-ps), [retenção](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-retentioncompliancepolicy?view=exchange-ps), [rótulos](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-compliancetag?view=exchange-ps). |
| `Connect-ExchangeOnline` → configuração Defender for Office 365 | App-only com certificado, `Exchange.ManageAsApp` da API Office 365 Exchange Online, consentimento e role/RBAC de leitura própria | `Get-AtpPolicyForO365` e `Get-SafeLinksPolicy` permitem investigar estado de controles; não são leituras de alertas nem contagem de arquivos OneDrive em quarentena. Sem execução nesta modalidade. [Política de proteção de colaboração](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-atppolicyforo365?view=exchange-ps). |

O ambiente de validação temporária desta skill usa client credentials Graph
com client secret e allowlist de hosts de leitura; não fornece sessão
PowerShell/CSOM com certificado. Isso delimita a evidência desta rodada, sem
concluir que certificado/consentimento inexista em todos os ambientes ou que
as fontes sejam globalmente inviáveis. Habilitar a modalidade complementar e
validar seu export é trabalho de integração; recomendar defaults não comprova
valores atuais do tenant.

## Quarentena de arquivos — contrato de ferramenta selecionado

`Get-QuarantineMessage` é documentado pela Microsoft para mensagens e arquivos
em quarentena; arquivos são protegidos por Safe Attachments para SharePoint,
OneDrive e Teams. O exemplo oficial usa `-QuarantineTypes SPOMalware`.
`-EntityType SharePointOnline` é o valor documentado de filtro de workload;
`Spo` não figura no enum documentado atual. A forma de sumário admite
`-EntityType`, `-QuarantineTypes`, `-Page`, `-PageSize` e filtros de data. A
forma de detalhe usa `-Identity`, sem inventar `-QuarantineTypes` nesse
parameter set. São leitores de Exchange Online PowerShell; não são Graph nem
uma rota HTTP pública dedutível do nome do cmdlet.

`Page` e `PageSize` aceitam `1..1000`, com defaults 1 e 100. Datas de filtro
seguem a convenção documentada pelo módulo; o export precisa conservar UTC,
recorte e referência do snapshot explicitamente. Metadados de política e
arquivo podem conter PII. `PermissionTo*` reflete privilégios do executor,
sem provar permissões efetivas do destinatário.

[Referência do cmdlet](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-quarantinemessage?view=exchange-ps).
O [contrato funcional oficial](https://learn.microsoft.com/en-us/defender-office-365/quarantine-admin-manage-messages-files#view-quarantined-files)
lista URL/nome/tamanho de arquivo, Location, Document ID, Organization,
instante da detecção, status de liberação e expiração no portal. Isso
comprova a existência dos fatos no serviço; não formaliza os nomes internos
nem a nulabilidade de cada propriedade do objeto PowerShell. O perfil de
export selecionado deve fixar esses nomes/tipos no onboarding e validá-los em
um primeiro run completo. Não declarar `FileName` ou `SharePointUrl` como
propriedade retornada já observada.

Autenticação selecionada: app-only com certificado em `Connect-ExchangeOnline`,
permissão de aplicação `Exchange.ManageAsApp` da API Office 365 Exchange Online,
consentimento e role/RBAC de leitura do cmdlet. A
[modalidade de autenticação](https://learn.microsoft.com/en-us/powershell/exchange/app-only-auth-powershell-v2?view=exchange-ps)
é documentada; o acesso exato e o schema do export serão validados no
onboarding. Não houve sessão PowerShell, leitura de quarentena ou alteração de
estado externo nesta investigação.

O dado publicado corresponde ao catálogo atual de documentos não liberados
correlacionados a sites pessoais OneDrive do próprio tenant. Registros de
quarentena podem expirar enquanto o arquivo continua bloqueado no serviço;
portanto, isso não comprova a contagem de todo arquivo OneDrive bloqueado.

## Preservação — contrato de metadados CSOM selecionado

**Disposição após R5 (2026-10-14):** este contrato descreve fatos físicos
independentes. A opção A aceita substitui quantidade/ocupaçãoPHL no card por
quantidade e volume de arquivos atuais comprovadamente sob retenção, com o
[mapping das fontes já selecionadas](fontes-e-viabilidade.md#retenção-efetiva-dos-arquivos-atuais--r5-aceita-a).
Não há operação externa nova nem obrigação de consultar PHL para calcular
essas duas métricas. O contrato externo abaixo permanece documentado.

O export selecionado lê bibliotecas sistema de preservação vinculadas aos
sites pessoais do tenant. O contrato público CSOM fornece
`List.IsSystemList`, `RootFolder.StorageMetrics`, `List.GetItems(CamlQuery)` e
o cursor `ListItemCollectionPosition`. O perfil de onboarding identifica a
biblioteca correta por vínculo de site/biblioteca sistema e metadados da
origem; título sozinho não é identificador suficiente. A paginação por CAML
deve fechar o inventário antes da publicação. O export é leitura de metadados,
sem buscar conteúdo dos arquivos nem executar exclusão/mutação de retenção.

As propriedades abaixo são `CSOM Int64`, somente leitura, conforme
Open Specifications Microsoft:

| Propriedade | Semântica externa documentada |
| --- | --- |
| [TotalFileCount](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/a341e801-7b35-4001-b2ab-f295971b67cb) | Número agregado de arquivos na pasta/subpastas; exclui versões, anexos de lista e documentos não customizados |
| [TotalSize](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/fb1c205e-0bd9-4109-a6a1-9f2d97780e41) | Total agregado de bytes dos itens na pasta/subpastas; inclui streams, versões e metadados |
| [TotalFileStreamSize](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/635464fc-8505-43fa-97d7-02229acdb3c5) | Bytes de streams dos arquivos na pasta/subpastas; exclui versões, metadados, anexos de lista e documentos não customizados |

Esses números representam artefatos/ocupação da biblioteca identificada, não
todos os originais abrangidos por retenção. A
[documentação funcional de retenção](https://learn.microsoft.com/en-us/purview/retention-policies-sharepoint)
define a PHL como biblioteca sistema que conserva cópias quando necessário.
Não se devem editar, excluir ou mover manualmente os arquivos automaticamente
preservados. O fluxo selecionado não usa essas mutações.

CSOM app-only Entra exige certificado e autorização SharePoint específica; a
sessão e o perfil de resposta precisam da primeira validação no onboarding.
O Graph possui descoberta de listas sistema ao selecionar `system`, mas não
foi adotado um leitor Graph adicional nem alegada observação de PHL nessa
API. Esses contratos de SDK/export não geram endpoint HTTP fictício em
`openapi.yaml` ou operação fictícia no Simulator.
