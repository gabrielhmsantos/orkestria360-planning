# APIs — Políticas e Proteção

Todas são leituras `GET` sem corpo, `v1.0`, com `Authorization: Bearer`, snapshots periódicos e `200 application/json`. A coleta técnica no tenant confirmou as quatro rotas abaixo; nenhuma retornou paginação nesta fotografia.

| Rota | Shape e permissão mínima de aplicação |
| --- | --- |
| `/policies/authenticationMethodsPolicy` | `200`, entidade de política com `authenticationMethodConfigurations[]`; `Policy.Read.AuthenticationMethod`. |
| `/policies/authenticationStrengthPolicies` | `200`, envelope OData `value[]` com forças internas/customizadas; `AuthenticationStrength.Read.All` como menor permissão de aplicação. `$top=100` devolve `400 badRequest`; a coleta usa a rota sem esse parâmetro. |
| `/identity/conditionalAccess/policies` | `200`, envelope OData válido vazio tanto com `$top=100` quanto sem query: `empty_valid_response`; `Policy.Read.ConditionalAccess` ou `Policy.Read.All`. |
| `/policies/identitySecurityDefaultsEnforcementPolicy` | `200`, entidade com `id`, `displayName`, `description`, `isEnabled`, `controlTypes` e `securityDefaultsUpsell`; `Policy.Read.All`. |

Configurações, IDs de grupos e exclusões são dados sensíveis de segurança. MFA legado por usuário não tem fonte Graph v1.0 aprovada nesta validação.

## Uso pela aplicação

Nova coleta justificada: somente estas configurações não existem em fontes publicadas. Cada snapshot preservará referência temporal, cobertura e razão; leitura da tela será local.
