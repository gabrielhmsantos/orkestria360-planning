# APIs — Dashboard Executivo

| Endpoint | Estrutura de resposta `200` |
| --- | --- |
| `GET /users` | `{ "value": User[], "@odata.nextLink": string? }`; selecionar `id`, `displayName`, `userPrincipalName`, `mail`, `accountEnabled`, `userType`, `department`, `jobTitle`, `companyName`, `employeeId`, `usageLocation`, `createdDateTime`, `assignedLicenses`, `onPremisesSyncEnabled` e `signInActivity`, com `$expand=manager($select=id)`. Sustenta população, sem licença e os nove critérios ponderados de qualidade; ausência de atributo não vira zero. |
| `GET /reports/authenticationMethods/userRegistrationDetails` | `{ "value": UserRegistrationDetail[], "@odata.nextLink": string? }`; item: `id`, `userPrincipalName`, `userDisplayName`, `isAdmin`, `isSsprRegistered`, `isMfaRegistered`, `isMfaCapable`, `isPasswordlessCapable`, `methodsRegistered[]`, `defaultMfaMethod`, `lastUpdatedDateTime`, `userType`. |
| `GET /identityProtection/riskyUsers` | `{ "value": RiskyUser[], "@odata.nextLink": string? }`; item: `id`, `userDisplayName`, `userPrincipalName`, `riskLevel`, `riskState`, `riskDetail`, `riskLastUpdatedDateTime`. |
| `GET /auditLogs/directoryAudits` | `{ "value": DirectoryAudit[], "@odata.nextLink": string? }`; item: `id`, `activityDisplayName`, `activityDateTime`, `category`, `loggedByService`, `operationType`, `result`, `initiatedBy`, `targetResources[]`. |
| `GET /directoryRoles` e `GET /roleManagement/directory/roleAssignments` | Roles ativadas e atribuições (`roleDefinitionId`, `principalId`, escopo); correlacionar `principalId` com `User.id` para o indicador de administradores. |

Todos são `GET` sem corpo de requisição; filtros, ordenação e seleção pertencem à query string. `riskyUsers` depende de Entra P2 e `IdentityRiskyUser.Read.All`; um `403` expressa consentimento ausente, não um schema alternativo. O score é cálculo interno; APIs fornecem evidência, não uma nota pronta.

Cada bloco normalizado pelo backend deve declarar `source`, `lastUpdatedAt`, `freshness` e estado `available`, `restricted` ou `unavailable`; fontes ausentes não são agregadas como zero.
