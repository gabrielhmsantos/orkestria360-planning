# Validação técnica — admin consent e identidade da organização

## Resultado

O fluxo de onboarding app-only multitenant foi validado com admin consent, token `200` e GET Graph `200`; o identificador de organização devolvido correspondeu ao tenant validado. O contrato implementado de admin consent usa o endpoint legado abaixo. Nenhum token, secret, URL de callback, nome de organização ou payload foi registrado.

## Contrato Entra ID

| Item | Valor validado |
| --- | --- |
| Método | `GET` |
| Endpoint | `https://login.microsoftonline.com/organizations/adminconsent` para a authority padrão; `https://login.microsoftonline.com/{tenant-id}/adminconsent` quando o admin informou Tenant ID GUID |
| Parâmetros | `client_id`, `redirect_uri` registrada exatamente e `state` opaco de uso único; `scope` não é parâmetro deste endpoint legado |
| Resposta de sucesso | redirect com `admin_consent=True`, `tenant` GUID e `state` |
| Segurança | validar `state`; o `tenant` do callback é candidato, não autorização; se a tentativa persistiu Tenant ID esperado, exigir igualdade antes de verificar pelo token e Graph. |

O endpoint exige interação de administrador. O callback não entrega token de usuário nem muda o runtime para delegated permissions.

## Contrato Graph pós-consentimento

| Item | Valor validado |
| --- | --- |
| Método/path | `GET /v1.0/organization?$select=id` |
| Autenticação | Bearer token obtido por `client_credentials` contra `https://login.microsoftonline.com/{microsoft_tenant_id}/oauth2/v2.0/token` |
| Scope | `https://graph.microsoft.com/.default` |
| Status/Content-Type | `200`; `application/json` OData |
| Envelope | OData `value` com ao menos uma organização |
| Campo usado | `value[0].id`, comparado ao tenant candidato; o access token é tratado como opaco e não é decodificado para ler `tid` |
| PII | não consumida; somente identificador técnico. |

## Uso pela aplicação

É uma leitura complementar, exclusiva do onboarding: confirma a organização que concedeu consentimento antes de ativar `microsoft_connections`. A promoção é idempotente e depende da unique global de `microsoft_tenant_id`; colisão com vínculo de outro tenant interno é negada sem revelar dados da conexão existente. Não substitui nem repete fontes de sync; não é chamada por telas ou por ciclos de coleta.
