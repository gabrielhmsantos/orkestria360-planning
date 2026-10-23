# APIs — Configurações por Serviço

Rotas Intune avaliadas com `GET`, sem corpo, em `https://graph.microsoft.com/v1.0`, audience `https://graph.microsoft.com` e autenticação de aplicação. A permissão documentada é `DeviceManagementConfiguration.Read.All`; a cobertura também depende de licença e habilitação Intune no customer.

| Rota | Resultado da coleta técnica | Uso permitido |
| --- | --- | --- |
| `/deviceManagement/configurationPolicies` | Rota `beta`: a primeira conexão retornou `401 UnknownError`; a segunda, `200 application/json;odata.metadata=minimal` com OData `value[]` e campos de política. A role requerida estava presente em ambas. | Endpoint viável para discovery; preview não entra como fonte estável sem decisão explícita. A disponibilidade permanece por conexão. |
| `/deviceManagement/deviceCompliancePolicies` | A primeira conexão retornou `401 UnknownError`; a segunda, `200 application/json;odata.metadata=minimal` com OData `value[]` e campos de política. A role requerida estava presente em ambas. | Endpoint viável para discovery; a primeira conexão continua restrita por causa não confirmada. |
| `/deviceManagement/deviceConfigurations` | A primeira conexão retornou `401 UnknownError`; a segunda, `200 application/json;odata.metadata=minimal` com OData `value[]` e campos de configuração. A role requerida estava presente em ambas. | Endpoint viável para discovery; a primeira conexão continua restrita por causa não confirmada. |
| `/deviceManagement/intents` | Rota `beta`: a primeira conexão retornou `401 UnknownError`; a segunda, `200 application/json;odata.metadata=minimal` com envelope OData vazio válido. A role requerida estava presente em ambas. Sem item observado, o schema usa o exemplo oficial com `@odata.type`, `id`, `displayName`, `description`, `isAssigned`, `isMigratingToConfigurationPolicy`, `lastModifiedDateTime`, `templateId` e `roleScopeTagIds`. | Endpoint viável para discovery; preview não entra como fonte estável sem decisão explícita. A disponibilidade permanece por conexão. |
| `/deviceManagement/groupPolicyConfigurations` | Rota `beta`: a primeira conexão retornou `401 UnknownError`; a segunda, `200 application/json;odata.metadata=minimal` com OData `value[]` e campos de Group Policy. A role requerida estava presente em ambas. | Endpoint viável para discovery; preview não entra como fonte estável sem decisão explícita. A disponibilidade permanece por conexão. |

As respostas de erro não foram reproduzidas, e nenhum valor, dispositivo, usuário ou identificador foi persistido neste discovery.

## Uso pela aplicação

Não há projeção local equivalente para as cinco coleções. Todas são viáveis para discovery porque uma conexão retornou `200`; a outra retornou `401 UnknownError`, mesmo com a role requerida no token. A viabilidade não transfere cobertura, disponibilidade ou dados entre customers. O catálogo local mostra somente a cobertura e a razão observada; a tela não chama Graph.
