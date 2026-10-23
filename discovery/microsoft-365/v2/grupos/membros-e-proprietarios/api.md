# APIs — Membros e Proprietários

## Coleções de relacionamento

Todos os `GET` abaixo não têm corpo e retornam `200 application/json` no envelope OData `{ "@odata.context": string, "value": DirectoryObject[], "@odata.nextLink": string? }`:

| Endpoint | Uso | Permissão mínima de aplicação considerada |
| --- | --- | --- |
| `/groups/{group-id}/members` | membros diretos, não transitivos | `GroupMember.Read.All` |
| `/groups/{group-id}/transitiveMembers` | membros diretos e aninhados | `GroupMember.Read.All` |
| `/groups/{group-id}/owners` | proprietários Graph | `GroupMember.Read.All` |
| `/groups/{group-id}/memberOf` e `/transitiveMemberOf` | grupos superiores diretos/transitivos | `GroupMember.Read.All` |

`DirectoryObject` tem `@odata.type` e `id`; tipos concretos podem incluir usuário, grupo, dispositivo, contato organizacional e service principal. Atributos adicionais dependem do tipo, seleção e permissão. Nome, UPN/e-mail, departamento, status e dados de acesso são PII. Coleções são pagináveis; em consultas avançadas/casts, aplicar `ConsistencyLevel: eventual` e parâmetros exigidos pelo Graph. Para membership oculto é necessária permissão adicional `Member.Read.Hidden`.

`404` para o grupo é recurso ausente; `403` é `restricted`. A documentação Learn registra que service principals podem não aparecer em `/members` v1.0; o item deve ser tratado como cobertura parcial, não ausência confirmada. Responsável de negócio/técnico é `unavailable` sem dado Orkestria.

## Homologação de leitura

Contra um grupo existente, membros diretos, transitivos e proprietários responderam `200` com envelope OData; membros diretos/transitivos expuseram `@odata.nextLink`. O schema do primeiro item continha `@odata.type`, `id` e atributos pessoais usuais (nome, e-mail/UPN, telefone, cargo e local), todos tratados como PII e não persistidos nesta coleta.
