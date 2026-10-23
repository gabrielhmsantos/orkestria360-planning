# API — Contas e Armazenamento

Graph v1.0, com `Accept: text/csv` e `Reports.Read.All`, expõe
`getOneDriveUsageAccountDetail(period='D180')`,
`getOneDriveUsageAccountCounts(period='D180')` e
`getOneDriveUsageFileCounts(period='D180')`. Todos responderam, nas duas
conexões técnicas, pelo fluxo `302 → 200 application/octet-stream` do CSV
pré-autenticado. O segundo GET não recebe `Authorization`; URL e conteúdo
bruto não são persistidos. `getOneDriveUsageStorage` segue como projeção local
da fonte já usada por Licenciamento, sem nova coleta para esta superfície.

`GET /users?$select=id,displayName,userPrincipalName,accountEnabled,assignedLicenses,department,userType,createdDateTime` tem `User.Read.All` como permissão mínima de aplicação e paginação OData. `Directory.Read.All` também cobre a rota, mas concede acesso mais amplo; a coleta técnica existente usou esse escopo superior. No consumo futuro, esses campos são projeção da fotografia canônica de identidade já existente; a documentação desta assinatura não autoriza outra leitura de `/users` por esta aba.

`getOneDriveUsageAccountDetail(period='D180')` devolveu CSV UTF-8 com BOM,
12 colunas e zero linhas malformadas: `Report Refresh Date` (`date`), `Site
Id` (`string`), `Site URL` (`empty` na amostra e anulável), `Owner Display
Name` (`string`), `Is Deleted` (`boolean`), `Last Activity Date` (`date`,
anulável), `File Count`/`Active File Count`/`Storage Used (Byte)`/`Storage
Allocated (Byte)`/`Report Period` (`integer`) e `Owner Principal Name`
(`string`). Os dois relatórios de contagem devolvem seis colunas não anuláveis:
`Report Refresh Date`, `Site Type`, `Total`, `Active`, `Report Date` e `Report
Period`. Nome, UPN, URL e métricas por proprietário são PII/sensíveis.

`GET /users` com o `$select` documentado retornou envelope OData, paginação
opaca quando aplicável e os oito campos solicitados. Identidade, UPN,
departamento e licenças são PII/sensíveis; a leitura complementa o relatório e
não substitui seu snapshot de uso.

## Descoberta de drives com autenticação de aplicação

| Item | Contrato externo selecionado |
| --- | --- |
| Método/host/versão | `GET https://graph.microsoft.com/v1.0` |
| Path | `/users/{user-id}/drives` |
| Query | `$select=id,driveType,sharepointIds,owner,webUrl,system` |
| Permissão mínima de aplicação | `Files.Read.All`; a Microsoft também aceita `Files.ReadWrite.All`, `Sites.Read.All` ou `Sites.ReadWrite.All`. Consentimento administrativo. |
| Sucesso | `200 application/json`, `value[]` de `drive`, `@odata.nextLink` opaco quando houver. `owner`, `system` e identificadores SharePoint são opcionais. |
| Erros | `401`, `403`, `404`, `429`; preservar erro Graph e respeitar `Retry-After`. |
| PII/sensibilidade | identidade do proprietário, URL e identificadores de recursos; nunca registrar valores reais no Discovery. |

Em 2026-10-14, a coleta GET sanitizada desta query observou `200` OData com
`value[]` e chaves `id`, `webUrl`, `driveType`, `owner`, `sharePointIds`, `system`;
outra tentativa recebeu `404 ResourceNotFound` por mysite ausente. O resumo de
roles indicou `Files.Read.All` ausente nas tentativas. Isso não mede o conjunto
de permissões superiores aceitas nem cria requisito de obter a role mínima
quando uma alternativa documentada já foi consentida. A evidência confirma
shape/status limitado; acesso e população continuam condições de runtime.

A fonte Microsoft pinada é `microsoftgraph/msgraph-metadata`, revisão
`0d13ff1c5e4c8e5e3acc8200de615dfb36233395`, subset v1.0. A referência atual
[List drives](https://learn.microsoft.com/en-us/graph/api/drive-list?view=graph-rest-1.0)
confirma esta rota e as permissões. O recurso
[drive](https://learn.microsoft.com/en-us/graph/api/resources/drive?view=graph-rest-1.0)
documenta `sharepointIds`; a resposta observada usou a grafia `sharePointIds`.
O parser preserva ambas como variantes do mesmo objeto, sem gerar identificador
quando estiver ausente.

`GET /users/{user-id}/drive` tinha uma observação limitada `200` e outra `404`,
mas [Get drive](https://learn.microsoft.com/en-us/graph/api/drive-get?view=graph-rest-1.0)
atualmente declara aplicação **não suportada**. A afirmação anterior de
`Files.Read.All` app-only para essa operação foi corrigida; a observação não
substitui o contrato público. A rota singular deixa de ser dependência da
estratégia app-only. Ela pode provisionar automaticamente o drive de um usuário
licenciado quando chamada com autenticação delegated; não é usada para testar
provisionamento nesta estratégia.
