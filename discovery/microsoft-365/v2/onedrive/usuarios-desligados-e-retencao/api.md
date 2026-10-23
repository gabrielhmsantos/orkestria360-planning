# APIs — Usuários Desligados e Retenção

## Microsoft Graph v1.0

| Item | Contrato |
| --- | --- |
| Método / host | `GET https://graph.microsoft.com/v1.0` |
| Path | `/directory/deletedItems/microsoft.graph.user` |
| Query | `$select=id,displayName,userPrincipalName,department,deletedDateTime,createdDateTime` |
| Permissão app mínima | `User.Read.All`, com consentimento administrativo. `Directory.Read.All` também é suficiente, mas mais ampla. |
| Sucesso | `200 application/json`, envelope OData `value` e paginação por `@odata.nextLink` quando devolvida. |
| PII | nome, UPN, departamento e datas. |
| Erros | `401`, `403`, `429` e erros Graph; não representam lista vazia. |

O conjunto de itens excluídos corresponde ao período de retenção de objetos excluídos do Entra ID (até 30 dias); não é um histórico permanente de desligamentos. O relatório de uso e a API de auditoria são documentados em [../api.md](../api.md) e na subpágina de auditoria, respectivamente. [Documentação oficial](https://learn.microsoft.com/graph/api/directory-deleteditems-list?view=graph-rest-1.0).
