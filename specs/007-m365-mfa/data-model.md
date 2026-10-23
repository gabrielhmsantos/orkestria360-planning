# Data Model: Microsoft 365 — Autenticação (MFA)

## Reutilização

| Entidade/publicação | Uso MFA |
|---|---|
| `DirectoryIdentity`, `IdentitySnapshot`, `IdentitySnapshotGeneration` | Elegibilidade, tipo, departamento e correlação por Graph ID. |
| `IdentityMfaRegistration` e `IdentitySourceState` | Registro, capacidade e `methodsRegistered[]` publicados. |
| `SignInEvent`, `DirectoryAuditEvent`, lotes e posições canônicas | Eventos, falhas e histórico, por janela publicada. |
| `IdentityRiskSignal` | Snapshot de risco por identidade quando a fonte/licença permitir. |
| `IdentityGroupMembership` e snapshots de grupo | Resolução local de alvos incluídos/excluídos da política. |
| `Microsoft365RetentionPolicy` | Retenção de 180 dias para eventos. |

## Novas entidades

### MfaMethodPolicySnapshot

Fotografia por tenant da política Graph de métodos.

| Campo | Regra |
|---|---|
| `tenant_id`, `generation_id`, `source` | Identificam a publicação e a fonte de política; cada endpoint tem estado independente. |
| `observed_at`, `published_at` | Determinam frescor. |
| `configurations` | Configurações normalizadas por ID; preserva estado e alvos, sem PII. Para métodos, vem de `authenticationMethodsPolicy`; strengths, Conditional Access e security defaults preservam sua configuração própria. |
| `source_state` | Disponibilidade, cobertura, razão e resultado. |

### MfaMethodClassification

Catálogo interno, somente leitura nesta versão.

| Campo | Regra |
|---|---|
| `method_key` | Valor Graph ou chave normalizada; único por tenant. |
| `security_level` | `strong`, `recommended`, `intermediate`, `weak`, `critical`. |
| `effective_at` | Base para evolução auditável futura. |

#### Valores Graph já validados

Os valores abaixo foram observados em `userRegistrationDetails.methodsRegistered` no tenant de desenvolvimento. O coletor os preserva sem tradução destrutiva e a projeção usa a chave de catálogo indicada.

| Valor Graph validado | Chave normalizada de catálogo | Tratamento na primeira entrega |
|---|---|---|
| `email` | `email` | Método de recuperação/SSPR; não compõe a métrica de força MFA. |
| `microsoftAuthenticatorPasswordless` | `microsoft_authenticator_passwordless` | Método passwordless do Microsoft Authenticator; não recebe nível por inferência. Sem uma linha configurada no catálogo, a classificação fica indisponível. |
| `microsoftAuthenticatorPush` | `microsoft_authenticator_push` | Push do Microsoft Authenticator; só recebe a classificação `recommended` quando a evidência publicada confirmar number matching; sem essa evidência, a classificação fica indisponível. |
| `mobilePhone` | `mobile_phone` | Não é convertido diretamente em SMS ou ligação: projeta `sms`, `voice` ou `mobile_phone` conforme política e escopo de grupo publicados. Todos os canais de telefone são `weak`. |
| `softwareOneTimePasscode` | `software_oath` | `intermediate`. |
| `windowsHelloForBusiness` | `windows_hello_for_business` | `strong`. |

Os defaults previstos para valores ainda não observados no tenant permanecem configurados: FIDO2/passkey e certificado `strong`; Authenticator com number matching `recommended`; senha `critical`; `sms` e `voice` `weak`. `mobilePhone` não tem canal fixo: a aplicabilidade de `sms`/`voice` é projetada pelas políticas SMS/Voice.

#### Tipos derivados de `authenticationMethod` e catálogo completo

O endpoint individual `/users/{id}/authentication/methods` devolve objetos pelo `@odata.type`, não somente os rótulos resumidos de `methodsRegistered`. O catálogo mantém todos os tipos atualmente documentados pelo Graph v1.0, mesmo os que ainda não apareceram no tenant; isso evita criar novas chaves ad hoc quando uma coleta justificada os encontrar. A leitura individual não substitui o relatório em massa nem autoriza uma varredura N+1 de usuários.

| Tipo Graph individual | Chave de catálogo | Classificação/tratamento inicial |
|---|---|---|
| `emailAuthenticationMethod` | `email` | Recuperação/OTP por e-mail; não compõe força MFA. |
| `externalAuthenticationMethod` | `external_authentication` | Sem nível inferido: depende do provedor externo e de regra publicada. |
| `fido2AuthenticationMethod` | `fido2` | `strong`. |
| `microsoftAuthenticatorAuthenticationMethod` | `microsoft_authenticator_push` ou `microsoft_authenticator_passwordless` | Correlacionar com o valor do relatório; push é `recommended` somente com number matching publicado; passwordless não recebe nível inferido sem linha configurada. |
| `passwordAuthenticationMethod` | `password` | `critical`. |
| `phoneAuthenticationMethod` | `mobile_phone`, `sms` ou `voice` | `phoneType` e `smsSignInState` enriquecem o fato; SMS/voz continuam definidos pela política e escopo de grupo publicados. Canais de telefone são `weak`. |
| `platformCredentialAuthenticationMethod` | `platform_credential` | Sem nível inferido até a semântica/força publicada da credencial; não assumir que toda credencial de plataforma é passkey. |
| `qrCodePinAuthenticationMethod` | `qr_code_pin` | Sem nível inicial; tratar como indisponível até regra aprovada. |
| `softwareOathAuthenticationMethod` | `software_oath` | `intermediate`. |
| `temporaryAccessPassAuthenticationMethod` | `temporary_access_pass` | Método identificado, mas ações e gestão ficam `coming_soon`; sem uso normativo na primeira entrega. |
| `windowsHelloForBusinessAuthenticationMethod` | `windows_hello_for_business` | `strong`; preservar também `keyStrength` (`normal`, `weak` ou `unknown`) quando o enriquecimento individual for justificado. |

Além dos tipos de recurso, o catálogo conhece os modos de política `x509CertificateMultiFactor` (`strong`) e `x509CertificateSingleFactor` (não é forte por si só), assim como `sms`, `voice`, `hardwareOath`, `federatedSingleFactor` e `federatedMultiFactor`. Um modo ou tipo sem nível inicial configurado não entra em percentuais de força: a projeção declara a classificação indisponível, nunca atribui um nível por suposição.

### MfaCoverageSnapshot

Série de cobertura publicada por tenant, somente após regra de elegibilidade e ciclo íntegros.

| Campo | Regra |
|---|---|
| `tenant_id`, `observed_at` | Chave temporal. |
| `eligible`, `registered`, `capable`, `passwordless` | Inteiros somente quando as exclusões e exceções forem resolvidas. |
| `coverage_state`, `reason` | Explicam indisponibilidade de cálculo parcial. |

### RiskDetectionEvent

Evento de detecção de risco com identificador externo, momento de ocorrência e lote publicado. Não sobrecarrega `IdentityRiskSignal`, que representa somente um sinal por identidade/fonte/geração; segue retenção de 180 dias.

## Regras e transições

- Snapshot: `staging → published | failed`; consumidor lê somente `published`.
- Política SMS/Voice: aplicar `state` e alvos incluídos/excluídos à identidade pelos grupos locais; ausência de grupos ou política publicada produz `unavailable`.
- Elegibilidade: internos ativos menos recursos, caixas sem login, sincronização e exceções formais; uma exclusão sem dado impede percentuais derivados.
- Eventos: visíveis apenas quando pertencem a lote publicado; `mobilePhone` não é convertido em SMS ou voz sem política e escopo.
