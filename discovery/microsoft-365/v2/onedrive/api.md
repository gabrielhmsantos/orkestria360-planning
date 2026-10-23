# APIs — OneDrive

## Uso pela aplicação

A UI consulta somente uma publicação local tenant-scoped. O sincronizador busca os CSVs Graph em background e mapeia os campos abaixo; o browser nunca chama Graph nem recebe URL pré-autenticada.

| Fato UI | Fonte / campo CSV | Regra de mapeamento |
| --- | --- | --- |
| Contas provisionadas, ativas/inativas, cota e consumo | `getOneDriveUsageAccountDetail`: `Site Id`, `Owner Principal Name`, `Last Activity Date`, `Storage Used (Byte)`, `Storage Allocated (Byte)` | Agregar por proprietário; inativa se `Last Activity Date` estiver há mais de 90 dias; `≥80%` usa usados/alocados. |
| Arquivos totais e ativos | `getOneDriveUsageFileCounts`: linha `All`, `Total`, `Active` | Publicar somente o agregado do relatório. |
| Pessoas ativas e arquivos sincronizados reportados | `getOneDriveActivityUserDetail(period='{period}')`: `Last Activity Date`, `Synced File Count`, com D7/D30/D90/D180 | Reutilizar a publicação canônica do período e o mapping de Atividade. As contagens de sincronizados são reportadas por pessoa; não são tentativas nem arquivos globalmente únicos. Não expor CSV bruto. |
| Arquivos acessados e editados, separados | Auditoria canônica admitida, operações/chaves A2 | Contar conjuntos distintos por arquivo na janela publicada, conforme [mapping A2](atividade-e-sincronizacao/fontes-e-viabilidade.md#a2--itens-acessados-e-editados-separados). A coluna combinada `Viewed Or Edited File Count` não fornece dois KPIs separados. |
| Atividade de compartilhamento | Auditoria canônica, operações e conjuntos C6/A2 | C6 aceita A: arquivos únicos com atividade de compartilhamento registrada no período, sem afirmar sucesso, acesso vigente ou união aritmética das colunas Reports. [Mapping C6](atividade-e-sincronizacao/fontes-e-viabilidade.md#b4--arquivos-com-atividade-de-compartilhamento-c6-aceita-a). |
| Armazenamento total | `getOneDriveUsageStorage`: linha `All`, `Storage Used (Byte)` | Reutilizar a projeção de Licenciamento; não duplicar coleta. |
| Postura de compartilhamento/sincronização | `/admin/sharepoint/settings` | Reutilizar `oneDriveSettings` da publicação de Configurações. |

Veja [fontes-e-viabilidade.md](fontes-e-viabilidade.md) para limites e indisponibilidade.

Contratos e evidências completos por superfície: [Dashboard e projeções locais](dashboard-executivo/fontes-e-viabilidade.md), [Contas](contas-e-armazenamento/api.md), [Arquivos](arquivos-e-conteudo/api.md), [Compartilhamento](compartilhamento-e-acessos/api.md), [Atividade e sincronização](atividade-e-sincronizacao/api.md), [Usuários desligados](usuarios-desligados-e-retencao/api.md), [Configurações e segurança](configuracoes-e-seguranca/api.md) e [Histórico e auditoria](historico-e-auditoria/api.md).

## Inventário de APIs e estado da validação

| Superfície | Providers e rotas principais | Situação técnica relevante |
| --- | --- | --- |
| Dashboard | Publicações locais das outras superfícies; sem endpoint Microsoft próprio. | Mapping de composição e critérios default-v1 dos scores aprovados; publicação independente por bloco. |
| Contas | Graph Reports, identidade/licenciamento canônicos e coleção `/users/{id}/drives`; storage reutilizado de Licenciamento. | Reports, identidade e plural drives observados; singular `/users/{id}/drive` substituído porque a referência atual não suporta aplicação. Resolver drive empresarial por vínculo factual, com ambiguidade explícita. |
| Arquivos | Root delta com `sharepointIds,parentReference`, atividade por item, extração controlada de labels e lixeira Graph beta. | Operações documentadas/SUPPORTED; delta reconstrói localização por IDs, sem `parentReference.path`. Lixeira sem `200` local e POST de labels não executado continuam limites observacionais, não ausência de contrato. |
| Compartilhamento | Permissões Graph para estado atual; Management Activity para eventos. | Permissões e feed observados. Lifecycle de polling/snapshots definido; eventos antigos não comprovam exposição atual. |
| Atividade | Reports, Intune e export JSON Data Connect Health/Errors. | Q3 aprova última fotografia mensal rolling30d. Perfil oficial e primeira extração completos exigidos no onboarding; não presumir equivalência Errors_v0/v1. |
| Usuários desligados | Identidade, deletedItems, Reports/auditoria e projeção local. | Q1 aprova 7 dias de bloqueio observado + OneDrive, sem HR; exclusão técnica correlacionada imediata. Workflow humano desconhecido fica sem publicação; Q2 distingue baseline de retenção e ciclo Microsoft. |
| Configurações | Graph settings/CA/labels/alerts/Intune e exports SPO/CSOM/Purview/Exchange por certificado. | Fontes complementares documentadas e admitidas por perfil/primeira leitura antes de publicar, sem sessão executada. Catálogo Graph retentionLabels delegated-only substituído por Purview app-only. Q4/R4 fecham20itens/scores; R5 conta arquivos atuais com retenção comprovada e seu volume, sem usar ocupaçãoPHL como equivalente. |
| Histórico | Office 365 Management Activity API em `manage.office.com`. | POST start autorizado retornou `200 enabled` para SharePoint/General; GET list/content/blob também `200`, sem erro de licença. Blobs JSON observados em text/plain; parser e Simulator cobrem os dois media types. TTL90dias e risco default-v1 aprovados. |

### Correção de cobertura sintética — Reports de uso D180

A análise independente de2026-10-15 encontrou as assinaturas D180 cadastradas,
mas servidas com o CSV default D30 em `getOneDriveUsageAccountDetail` e
`getOneDriveUsageFileCounts`. O fluxo delegado corrigiu a seleção de payload
por período nas fixtures já existentes, preservando as operações D30/D180.
Agora D180 retorna `Report Period=180`, com detalhe coerente e série de180datas;
Na revisão complementar, o exemplo D30 de uso passou a publicar zero ativo
para atividade antiga e o agregado ativo foi reconciliado de962para842. As
datas de última atividade por pessoa em D30/D90/D180 foram alinhadas ao mesmo
snapshot D7, sem alterar as contagens de atividade. O smoke verifica os dois
Reports nos dois períodos,
schema, datas, contagens, ausências e D365→400InvalidPeriod; exige datas
compatíveis com atividade positiva e consistência da última atividade entre
períodos com a mesma referência. Essa verificação não exige universalmente
ActiveFileCount<=FileCount: arquivos ativos na janela podem já ter sido
excluídos. IsDeleted do relatório de atividade não comprova exclusão Entra. Geração, inventory87/53,
validate87/5, importação dos cinco serviços, smoke e diff-check aprovados.
É evidência sintética do provider, sem nova chamada de tenant ou alteração de
permissões/fluxo HTTP Microsoft. O mapping canônico continua nas abas.

O resultado consolidado por fato e o gate técnico estão em
[`backend-coverage-review.md`](backend-coverage-review.md). Cada `api.md` e
`openapi.yaml` de superfície contém assinatura, permissões, respostas,
observações temporárias e limitações. Um `200` em uma conexão valida somente a
forma observada e não prova consentimento ou cobertura de qualquer tenant.

## Schemas CSV observados — D30

As três rotas abaixo foram revalidadas em 12/09/2026 com `Accept: text/csv` e `Reports.Read.All`: Graph retornou `302`, o download pré-autenticado retornou `200 application/octet-stream`, UTF-8 com BOM e zero linhas malformadas. A evidência preserva apenas o schema, nunca linhas, URL ou IDs reais.

| Relatório | Colunas e tipos observados | Nulabilidade / PII |
| --- | --- | --- |
| `getOneDriveUsageAccountDetail` | `Report Refresh Date` (`date`); `Site Id`, `Owner Display Name`, `Owner Principal Name` (`string`); `Site URL` (`empty` na amostra); `Is Deleted` (`boolean`); `Last Activity Date` (`date`); `File Count`, `Active File Count`, `Storage Used (Byte)`, `Storage Allocated (Byte)`, `Report Period` (`integer`) | `Site URL` e `Last Activity Date` são anuláveis. Nome, UPN, URL e métricas associadas à conta são PII/sensíveis por proprietário. |
| `getOneDriveActivityUserDetail` | `Report Refresh Date`, `Last Activity Date` (`date`); `User Principal Name`, `Assigned Products` (`string`); `Is Deleted` (`boolean`); `Deleted Date` (`empty` na amostra); quatro contagens de atividade/compartilhamento e `Report Period` (`integer`) | `Deleted Date`, atividade e produtos são anuláveis; UPN, produtos e métricas por pessoa são PII. |
| `getOneDriveUsageFileCounts` | `Report Refresh Date`, `Report Date` (`date`); `Site Type` (`string`); `Total`, `Active`, `Report Period` (`integer`) | Não anulável na amostra; agregado, sem PII. |
