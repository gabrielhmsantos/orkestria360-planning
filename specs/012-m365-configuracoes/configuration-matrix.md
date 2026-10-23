# Matriz canônica inicial

## Regra central

**Homologação** e **elegibilidade** são distintas. Uma linha só é homologada com fonte, versão, escopo, valor, baseline, risco e comparação definidos. Depois de homologada e aplicável, continua elegível quando a fonte está `unavailable`: entra no denominador, soma zero e reduz cobertura. Indisponibilidade não é insegurança nem ativa trava.

## Relação com o source registry

Todo collector usa exclusivamente um `ConfigurationSourceContract` homologado e
allowlisted, separado desta matriz. O registry versionado define `source_key`,
provider/audience, API version, operação/endpoint, permissions, cadência,
freshness, coverage, falha e paginação/coleção. A cadeia é:

```text
SourceContract → ObservedConfigurationFact → (opcional) MatrixLine → Baseline / Comparison / Score / Gate
```

Assim, organização, branding, domínios, group settings, named locations,
inventário Intune e outros fatos de cards podem ser coletados/exibidos por seu
contrato sem MatrixLine. Uma linha da matriz referencia o `source_key`/versão e
`fact_key` do registry apenas quando aquele fato é homologado para comparação.
Não se cria linha artificial para registrar endpoint, permissão ou freshness.
Uma versão já referenciada é imutável: mudança de endpoint, API, permissions,
freshness, coverage, falha, paginação ou fact mapping publica um novo
`source_key@version`; a versão anterior continua disponível enquanto houver
fato, source state, MatrixLine ou publicação histórica que a referencie.

## Domínios e pesos do sponsor

**Origem**: `Microsoft365_Configurações.docx`, seção **Configuration Score**, tabela **Domínio / Peso**.

| Chave estável | Domínio canônico | Peso |
|---|---|---:|
| `identity_access` | Identidade e acesso | 20% |
| `security` | Segurança | 20% |
| `collaboration_sharing` | Colaboração e compartilhamento | 15% |
| `exchange_email_protection` | Exchange e proteção de e-mail | 10% |
| `devices_intune` | Dispositivos e Intune | 10% |
| `teams` | Teams | 5% |
| `sharepoint_onedrive` | SharePoint e OneDrive | 5% |
| `compliance_purview` | Compliance e Purview | 10% |
| `change_governance` | Governança de alterações | 5% |

## Linhas iniciais homologadas e elegíveis

| Chave | Domain/severity | Source contract (API/permissions) | Baseline/comparison | Availability semantics/gate |
|---|---|---|---|---|
| `identity.admin_mfa_registered` | `identity_access` / critical | `graph.entra.user-registration-details@1` — Graph v1.0 `userRegistrationDetails` / `AuditLog.Read.All` | admin `isMfaRegistered=true` | elegível; unavailable=zero; `false` ativa trava |
| `conditional_access.<policy>.enabled` | `identity_access` / critical local | `graph.entra.conditional-access-policies@1` — Graph v1.0 `conditionalAccess/policies` / `Policy.Read.All` | para política localmente crítica: `state=enabled` | elegível após classificação; unavailable=zero; estado diferente ativa trava |
| `collaboration.sharepoint_legacy_auth` | `sharepoint_onedrive` / critical | `graph.sharepoint.settings@1` — Graph v1.0 `sharepointSettings` / `SharePointTenantSettings.Read.All` | `isLegacyAuthProtocolsEnabled=false` | elegível; unavailable=zero; `true` ativa trava |
| `exchange.antiphish_policy_enabled` | `exchange_email_protection` / critical | `tcm.exchange.antiphish-policy@1` — TCM beta `antiPhishPolicy` / `ConfigurationMonitoring.Read.All`, Security Reader, Exchange.ManageAsApp | por política `Ensure=Present AND Enabled=true` | linha independente; unavailable=zero; `Enabled=false` ativa trava |
| `exchange.antiphish_rule_enabled` | `exchange_email_protection` / critical | `tcm.exchange.antiphish-rule@1` — TCM beta `antiPhishRule` / mesmos requisitos | por regra `Ensure=Present AND Enabled=true`, por `AntiPhishPolicy` | linha independente; unavailable=zero; `Enabled=false` ativa trava |
| `exchange.critical_inbound_tls` | `exchange_email_protection` / critical local | `tcm.exchange.inbound-connectors@1` — TCM beta `inboundConnector` / `ConfigurationMonitoring.Read.All`, Global Reader, Exchange.ManageAsApp | crítico local: `Ensure=Present AND RequireTls=true` | elegível; sem TCM unavailable=zero; `RequireTls=false` ativa trava |
| `exchange.critical_outbound_tls` | `exchange_email_protection` / critical local | `tcm.exchange.outbound-connectors@1` — TCM beta `outboundConnector` / mesmos requisitos | crítico local: `Ensure=Present` AND `TlsSettings` IN (`EncryptionOnly`, `CertificateValidation`, `DomainValidation`) AND (`TlsSettings != DomainValidation` OR `TlsDomain` não vazio) | elegível; sem TCM unavailable=zero; `TlsSettings` nulo/vazio, valor fora da lista, ou `DomainValidation` sem `TlsDomain` ativa trava |

Sem TCM/licença/roles/snapshot, antiphishing permanece **elegível + unavailable + zero**, sem inferir `Enabled=false` ou ativar trava.

## Classificação local de CA

Uma classificação de criticidade é configuração local cuja autoridade é o
Orkestria/customer admin: `tenant_id`, referência externa da política, versão
da matriz, `critical`, ator, instante e motivo; única por tenant + referência.
Não coloca IDs tenant no catálogo global nem é removida pelo prune Microsoft.
Para política marcada crítica, a linha é
`conditional_access.<referência>.enabled`, baseline `state=enabled`; somente
leitura comparável diferente ativa a trava. A classificação é Orkestria, não
alteração Microsoft 365.

## Bootstrap da referência inicial

A matriz, os nove domínios/pesos e o perfil global inicial entram por migration
incremental com `upsert` idempotente. Assim, `php artisan migrate` em banco
existente é suficiente e não depende de `db:seed`. O catálogo permanece global
e protegido de escrita pelo runtime; uma nova versão homologada entra por nova
migration ou publicador de deploy aprovado.

## Pendentes de homologação, portanto não elegíveis

| Linha | Lacuna comprovada |
|---|---|
| Link anônimo global com edição | Sponsor define o risco; `sharepointSettings` prova link anônimo permitido, mas não permissão padrão `Edit`. Falta fonte homologada para o segundo fato e comparação conjunta. |
| Acesso irrestrito por dispositivo não gerenciado | Intune v1.0 retornou 200 em um tenant. O payload exemplar Microsoft Learn de `deviceCompliancePolicy` permite normalizar, por política, `id`, `displayName`, `description`, `version`, `lastModifiedDateTime` e propriedades específicas por plataforma (por exemplo, senha, criptografia, integridade e versão mínima); ele será usado como contrato de coleta/normalização de inventário e conformidade de dispositivo. Porém não prova a atribuição da política nem uma regra Conditional Access que bloqueie ou permita acesso a recurso por dispositivo não gerenciado. `isUnmanagedSyncAppForTenantRestricted` não é equivalente. Falta a composição homologada entre política/atribuição e controle de acesso, portanto a **trava** continua pendente e não elegível. |

## Vigência da criticidade e stale

Políticas CA e conectores começam como não críticos, continuam coletados e exibidos, e suas linhas dependentes só se tornam elegíveis após marcação explícita do customer admin. A classificação inclui tipo do objeto, é única por tenant + tipo + referência e é auditada. Sua vigência começa na própria alteração: não recalcula scores/publicações históricas.

Quando a fonte atual está `unavailable`, o último valor conhecido pode ser exibido apenas como histórico `stale`, com instante, razão atual e cobertura. Ele não é valor atual comparável: a linha elegível continua no denominador, recebe zero, reduz cobertura, não fica conforme/divergente e não ativa trava.

Uma classificação crítica é protegida por concorrência otimista: edição baseada em versão desatualizada é rejeitada. Ela só fica inativa/não elegível após ausência em coleta canônica válida e conclusiva; falha, `restricted`, `unavailable`, snapshot inacessível ou publicação parcial inconclusiva não equivalem à ausência. A mesma referência externa reativa a classificação; uma nova referência inicia não crítica.

Freshness segue exclusivamente a cadência e o prazo do contrato de cada fonte no sync coordenado. Sem prazo publicado, freshness é `unavailable`/indeterminada sem alterar disponibilidade. Somente valor dentro desse contrato é comparável para score/trava; valor expirado pode ser histórico `stale`.

## Retenção

Estado current/source state: enquanto customer existir, exceto no modo destrutivo explícito `all`. A cadeia histórica Microsoft de geração, fatos observacionais, source states/readiness, comparações, score por domínio, materialização de baseline, snapshots, publicações, alterações/drift e auditoria derivada: 365 dias. Telemetria/evidência técnica: seis meses-calendário. Matriz/perfis globais versionados: enquanto interpretarem publicações preservadas. A classificação crítica local e sua auditoria são autoridade Orkestria e não entram no prune M365. Os prazos são fixos nesta versão e não são alteráveis pela interface. Disconnect não apaga histórico; evidência vencida aparece como `retention_expired`, sem afirmar ausência de fato. `app:prune-microsoft365 <tenant> all` remove integralmente somente o data-plane Microsoft 365 coletado/derivado, inclusive current, e preserva configurações locais.

O `Microsoft365DataRetentionPruner` já aceita cutoff ou `all`, mas hoje só abrange módulos existentes e eventos (padrão destes é 180 dias). O módulo adicionará `ConfigurationsRetentionPruner` com política própria baseada em `runAt`: 365 dias para histórico e `subMonthsNoOverflow(6)` para evidência, sem obedecer ao cutoff genérico dos módulos existentes. O caminho `all` remove apenas os dados Configurações coletados/derivados Microsoft e nunca `critical_classifications`, seus audits ou outras decisões/preferências locais.
