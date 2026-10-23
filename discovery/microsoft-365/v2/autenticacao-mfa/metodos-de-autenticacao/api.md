# APIs — Métodos de Autenticação

## `GET /reports/authenticationMethods/userRegistrationDetails`

Contrato e evidência técnica: ver [Cobertura e Registro](../cobertura-e-registro-de-mfa/api.md). `methodsRegistered[]` é a fonte em massa; normalização e classificação forte/fraco são regras Orkestria, não campos Graph.

Validação complementar no tenant (2026-08-12): a consulta com `$top=500` retornou `200 application/json`, envelope OData `value[]`, 35 itens e uma página. Os valores observados em `methodsRegistered[]` foram `email`, `microsoftAuthenticatorPasswordless`, `microsoftAuthenticatorPush`, `mobilePhone`, `softwareOneTimePasscode` e `windowsHelloForBusiness`. Em particular, o valor canônico observado para Microsoft Authenticator por push é `microsoftAuthenticatorPush`; o registro de telefone vem como `mobilePhone`.

`mobilePhone` não distingue, neste relatório, SMS de ligação. A confirmação dessa característica exige leitura individual de `phoneAuthenticationMethod`; não inferir SMS ou ligação a partir de `mobilePhone`.

## `GET /users/{user-id}/authentication/methods`

`GET` sem corpo, `v1.0`, `Authorization: Bearer`, `UserAuthenticationMethod.Read.All`. É coleção OData heterogênea de métodos concretos e leitura complementar investigativa por `user-id`, não varredura. Com a permissão consentida, a validação retornou `200 application/json`, envelope OData `value[]` e três métodos para uma identidade solicitada, sem paginação. Os discriminadores observados foram `#microsoft.graph.passwordAuthenticationMethod`, `#microsoft.graph.phoneAuthenticationMethod` e `#microsoft.graph.microsoftAuthenticatorAuthenticationMethod`. `404` permanece ausência do usuário, não zero.

## `GET /users/{user-id}/authentication/phoneMethods`

`GET` sem corpo, `v1.0`, `Authorization: Bearer`, `UserAuthenticationMethod.Read.All`. É leitura complementar por identidade, usada somente para distinguir `phoneType` (`mobile`, `alternateMobile` ou `office`) e `smsSignInState`; números de telefone são PII e não são registrados no discovery. Com a permissão consentida, a validação retornou `200 application/json`, envelope OData `value[]` e um método com `phoneType: mobile` e `smsSignInState: notAllowedByPolicy` para a identidade solicitada. Isso prova telefone móvel registrado e SMS não habilitado por política para esse método; não prova, por si só, o uso de ligação. `404` representa ausência da identidade.

## `GET /policies/authenticationMethodsPolicy`

`GET` sem corpo; entidade JSON com `@odata.context`, `id`, `displayName`, `description`, `lastModifiedDateTime`, `policyVersion`, `policyMigrationState`, `registrationEnforcement` e `authenticationMethodConfigurations[]`, cujas configurações variam por método. Permissão mínima de aplicação: `Policy.Read.AuthenticationMethod`. A coleta técnica confirmou `200 application/json`, uma entidade, sem paginação. Snapshot periódico, sem delta.

## `GET /policies/authenticationMethodsPolicy/authenticationMethodConfigurations/sms`

`GET` sem corpo, `v1.0`, `Authorization: Bearer`, `Policy.Read.AuthenticationMethod`. A validação retornou `200 application/json` com `#microsoft.graph.smsAuthenticationMethodConfiguration`, `id: Sms`, `state: disabled`, um alvo incluído e nenhum excluído. A configuração específica prova o contrato de SMS; sua leitura não é necessária em produção quando a fotografia de `authenticationMethodsPolicy` já materializa a mesma configuração.

## `GET /policies/authenticationMethodsPolicy/authenticationMethodConfigurations/voice`

`GET` sem corpo, `v1.0`, `Authorization: Bearer`, `Policy.Read.AuthenticationMethod`. A validação retornou `200 application/json` com `#microsoft.graph.voiceAuthenticationMethodConfiguration`, `id: Voice`, `state: disabled`, um alvo incluído, nenhum excluído e `isOfficePhoneAllowed: false`. A configuração específica prova o contrato de ligação; sua leitura não é necessária em produção quando a fotografia de `authenticationMethodsPolicy` já materializa a mesma configuração.

## Uso pela aplicação

A distribuição de métodos usa a projeção local de registro MFA. O normalizador preserva os valores Graph observados e exibe `mobilePhone` como telefone sem atribuir SMS ou ligação. A fotografia de política fornece `Sms` e `Voice`, com seus estados e alvos, para definir quais rótulos de canal são aplicáveis; os endpoints individuais validam esse contrato, mas não devem duplicar a coleta de política. Quando a investigação individual estiver autorizada, `phoneMethods` pode acrescentar `phoneType` e `smsSignInState`; não é fonte de agregação em massa.
