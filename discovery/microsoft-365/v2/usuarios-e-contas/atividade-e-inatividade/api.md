# APIs — Atividade e Inatividade

## `GET /users`

**Request:** `$select=id,displayName,userPrincipalName,userType,createdDateTime,accountEnabled,assignedLicenses,signInActivity`; sem corpo. **Resposta:** `{ "@odata.context": string, "value": User[], "@odata.nextLink": string? }`, em que cada `User` contém os campos selecionados e `signInActivity` com `lastSignInDateTime`, `lastSignInRequestId`, `lastNonInteractiveSignInDateTime`, `lastNonInteractiveSignInRequestId`, `lastSuccessfulSignInDateTime` e `lastSuccessfulSignInRequestId` (todos opcionais/nulos conforme cobertura). `createdDateTime` permite separar conta recente/nunca usada; `userType` permite aplicar regra de convidado.

O cálculo de atividade usa exclusivamente `lastSuccessfulSignInDateTime`: `lastSignInDateTime` registra tentativas interativas, inclusive malsucedidas. Inatividade crítica é o último acesso bem-sucedido anterior a `inactive_90_days` da configuração do tenant (90 dias por padrão); contas sem acesso permanecem na categoria independente de nunca utilizadas.

## `GET /auditLogs/signIns`

**Request:** para o Histórico/Auditoria, `$top=100` e `$orderby=createdDateTime desc`; sem corpo. O Graph pode fornecer `@odata.nextLink`, mas a coleta diária preserva deliberadamente somente a primeira página de até 100 eventos recentes. **Resposta:** envelope OData com `value[]`; item `signIn` inclui `id`, `createdDateTime`, identidade, aplicativo, `ipAddress`, `clientAppUsed`, `conditionalAccessStatus`, `status`, `deviceDetail`, `location` e sinais de risco. A coleta validou `200`; PII, retenção e permissões devem ser tratados como fonte `restricted` quando indisponíveis.

## `GET /reports/getOffice365ActiveUserDetail(period='D30')`

**Request:** parâmetro `period` no path funcional e `Accept: text/csv`; sem corpo. A Graph responde `302 Location` para download temporário, seguido de `200 application/octet-stream` com CSV. Cada linha possui estas 24 colunas: `Report Refresh Date`, `User Principal Name`, `Display Name`, `Is Deleted`, `Deleted Date`, `Has Exchange License`, `Has OneDrive License`, `Has SharePoint License`, `Has Skype For Business License`, `Has Yammer License`, `Has Teams License`, datas de última atividade e de atribuição de licença para os seis workloads, e `Assigned Products`.

O relatório exige `Reports.Read.All`; o `Location` é URL pré-autenticada, curta e sensível. O download é uma segunda requisição sem `Authorization`; não registrar `Location`, CSV ou linhas do arquivo. UPN, nome e produtos são PII. A classificação 30/60/90 dias é regra interna configurável, não campo retornado pela Graph.

Coleta técnica sanitizada em 12/09/2026 confirmou BOM UTF-8, 24 colunas e nenhuma linha malformada nas duas conexões. O schema observado, sem reter qualquer célula, é:

| Colunas | Tipo observado | Nulável | PII |
| --- | --- | --- | --- |
| `Report Refresh Date` | `date` | Não | Não |
| `User Principal Name`, `Display Name` | `string` | Não | Sim |
| `Is Deleted`, `Has * License` | `boolean` | Não | Não |
| `Deleted Date`, `Skype For Business Last Activity Date`, `Yammer Last Activity Date`, `Skype For Business License Assign Date` | `empty` na amostra | Sim | Não |
| Demais `* Last Activity Date` e `* License Assign Date` | `date` | Sim | Não |
| `Assigned Products` | `string` | Sim | Sim |

O CSV sintético equivalente do Simulator preserva essas 24 colunas, mas o runtime local responde CSV direto. O contrato externo continua sendo o redirect Graph seguido de download pré-autenticado.
