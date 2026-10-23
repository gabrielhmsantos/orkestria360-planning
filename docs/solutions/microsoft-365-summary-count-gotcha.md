# microsoft-365-summary-count-gotcha

- O bloco `summaryCards` do Microsoft 365 falha por inteiro em Microsoft365OverviewPageData (`Application: app/Support/Microsoft365/Microsoft365OverviewPageData.php:142`; verificar no worktree autorizado) quando `countUsers()` ou `countGroups()` lança excecao, mesmo que `subscribedSkus` esteja retornando corretamente.
- O client atual usa `/$count` com `?$top=0` em GraphDataClient::count() (`Application: app/Support/Microsoft365/GraphDataClient.php:73`; verificar no worktree autorizado), e a Graph responde `400 Request_UnsupportedQuery` com `Invalid page size specified: '0'. Must be between 1 and 999 inclusive.`.
- O endpoint alternativo `/users?$count=true&$top=1&$select=id` e o equivalente de groups respondem `200` com `@odata.count` no tenant atual, entao o problema nao e ausencia de permissao para leitura de usuarios/grupos.
- O endpoint `/security/secureScores?$top=1` responde `403` no token atual. O JWT da app registration traz `Group.Read.All`, `LicenseAssignment.Read.All`, `Directory.Read.All`, `GroupMember.Read.All`, `ServiceHealth.Read.All` e `Reports.Read.All`, mas nao traz a role necessaria para `secureScores`.
- Script reutilizavel de diagnostico: scripts/debug_m365_graph.php (`Application: scripts/debug_m365_graph.php:1`; verificar no worktree autorizado).
