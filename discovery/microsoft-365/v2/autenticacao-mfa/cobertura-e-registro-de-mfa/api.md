# APIs — Cobertura e Registro de MFA

## `GET /reports/authenticationMethods/userRegistrationDetails`

`GET` sem corpo, versão `v1.0`, com `Authorization: Bearer`. Consulta coletada: `$top=500`; `AuditLog.Read.All` (aplicação) é a permissão mínima. A resposta é `200 application/json`, envelope OData com `@odata.context`, `value[]` e `@odata.nextLink` opcional. No tenant de desenvolvimento a consulta retornou 35 itens, uma página, sem retry/throttling. Cada item observado trouxe `id`, `userPrincipalName`, `userDisplayName`, `userType`, `isAdmin`, estados SSPR/MFA/passwordless, `methodsRegistered[]`, preferências de método e `lastUpdatedDateTime`; `defaultMfaMethod` é variável e não foi observado nesta fotografia. Identidade e UPN são PII.

O endpoint não retorna usuários desabilitados. `200 { value: [] }` é `empty_valid_response`; filtro de tela sem correspondência não altera a fotografia. `403` é `restricted`, não coleção vazia. Referência: [Learn](https://learn.microsoft.com/graph/api/authenticationmethodsroot-list-userregistrationdetails?view=graph-rest-1.0).

## `GET /users`

Fonte canônica de identidade, já validada em [`../../usuarios-e-contas/diretorio-de-usuarios/api.md`](../../usuarios-e-contas/diretorio-de-usuarios/api.md): usar a projeção publicada, incluindo `accountEnabled`, `userType`, departamento e demais atributos de elegibilidade. Não chamar Graph para filtros ou junções desta tela.

## Uso pela aplicação

Estratégia: snapshot periódico de `userRegistrationDetails`, correlacionado por `id` (UPN apenas como contingência) à geração publicada de identidades. A tela consome a projeção de registro e a fotografia de diretório local; snapshots históricos, exceções e regras de elegibilidade são internos e ainda pendentes de norma aprovada.
