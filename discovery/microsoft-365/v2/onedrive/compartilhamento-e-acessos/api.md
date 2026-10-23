# API — Compartilhamento e Acessos

## Microsoft Graph v1.0

| Item | Contrato |
| --- | --- |
| Método / host | `GET https://graph.microsoft.com/v1.0` |
| Path | `/users/{user-id}/drive/items/{item-id}/permissions` |
| Query | `$select=id,roles,link,grantedToV2,grantedToIdentitiesV2,expirationDateTime,inheritedFrom,hasPassword,shareId` |
| Permissão app | `Files.Read.All` (ou escopo superior aceito pela Microsoft), com consentimento administrativo. |
| Sucesso | `200 application/json`, coleção OData de `permission`; `value` pode ser vazia. |
| Erros | `401`, `403`, `404`, `429`; `304` pode ocorrer com `If-None-Match`. |
| Campos chave | `roles`; `link.type`, `link.scope`, `link.webUrl`; concedidos e expiração opcionais. |

O contrato externo não oferece, sozinho, série histórica de criação/uso de links; esse fato vem da auditoria.

A resposta de permissões pode ser parcial: a documentação informa que o proprietário vê todas as permissões, enquanto outro chamador pode receber somente as permissões aplicáveis a ele. `shareId` e `link.webUrl` são valores ocultos quando o chamador não tem capacidade de criar a permissão correspondente; sua ausência não prova que não exista link. Com `Files.Read.All`, trate esses campos como opcionais e exponha a disponibilidade/limitação da leitura. A observação sanitizada incluiu ambos em um item, mas não prova que apareçam para todos os itens ou chamadores. [Documentação oficial de permissões de driveItem](https://learn.microsoft.com/graph/api/driveitem-list-permissions?view=graph-rest-1.0).
