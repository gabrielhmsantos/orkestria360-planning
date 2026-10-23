# Data Model: Usuários e Contas Microsoft 365 V2

| Entidade | Propósito e campos principais | Relações e regras |
|---|---|---|
| `IdentitySyncRun` | execução do tenant configurado, escopada por `tenant_id` e ciclo: `generation_id`, status, fontes, cursor/delta link protegido, contagens, erro sanitizado, início/fim | lock único; idempotente por ciclo; somente geração completa pode ser promovida |
| `IdentitySnapshotGeneration` | fotografia publicável: `tenant_id` configurado, identificador, estado `staging`/`published`/`failed`, início/fim, cursor, cobertura e ponteiro de publicação | uma única geração publicada; promoção transacional exclusiva com cursor; nunca misturar geração em uma página |
| `DirectoryIdentity` | identidade corrente por `(tenant_id, graph_id)`: nome, UPN/mail, tipo, conta habilitada, departamento, cargo, localidade, origem on-premises, criação, atributos conhecidos | PII protegido; `last_seen_generation`, tombstone/`removed_at`; atributo ausente permanece nulo/`não informado` |
| `IdentityGroupMembership` | associação observada entre identidade e grupo: `tenant_id`, identidade, identificador/nome/tipo do grupo, fonte e geração | leitura somente; atributo não fornecido permanece nulo e acesso restrito é diagnosticado por fonte |
| `IdentitySnapshot` | observação append-only por identidade e geração, com atributos comparáveis, atribuições de licença reconciliadas e `observed_at` | retenção local de 12 meses; base para tendência e evolução; nunca depende de um ciclo externo de Licenciamento para a geração publicada |
| `IdentitySourceState` | disponibilidade por fonte/superfície: status, motivo sanitizado, cobertura, última coleta, último estado conhecido, páginas, tentativas e latência | separa `availabilityStatus` de `freshness`; registra `empty_valid_response`, `no_matches` e falha transitória corretamente |
| `TenantActivitySetting` | janelas do tenant configurado: nunca usada, 30, 60 e 90 dias, mais timezone IANA | inicia em 15/30/60/90 e `America/Sao_Paulo`; `inactive_90_days` define inatividade crítica; `tenant_id` é escopo de dado, não suporte multi-tenant |
| `IdentityActivitySignal` | último acesso bem-sucedido, classificação, período, origem e cobertura | usa `signInActivity.lastSuccessfulSignInDateTime`; não mistura `signInActivity`, logs e relatório CSV; ausência de fonte não é inatividade |
| `IdentityMfaRegistration` / `IdentityRiskSignal` | evidência de MFA e risco com fonte, cobertura, observação e estado | disponibilidade independente de identidade e privilégios |
| `AdministrativePrivilege` | função permanente ou PIM: identidade, papel, escopo, tipo, status e evidência | PIM sem P2 registra `restricted` (inclusive `AadPremiumLicenseRequired`), não ausência de elegibilidade |
| `DirectoryAuditEvent` / `SignInEvent` | evento investigável: origem, ator, alvo, atividade, resultado, ocorreu/coletado e referência de evidência | filtros por período/categoria/atividade/identidade; cobertura e retenção externas declaradas |
| `UserLicenseAssignment` / `TenantLicenseSku` | atribuições e catálogo já existentes no Licenciamento | reutilizar por `tenant_id` e `user_external_id`; não duplicar planos ou origem direta/grupo |
| `IdentityExport` | auditoria de CSV: solicitante, superfície, filtros canônicos, allowlist versionada, sensibilidade, cobertura, estado, expiração | geração local autorizada; sem conteúdo bruto, URL temporária ou PII nos logs |
| `IdentityAccessAudit` | trilha de acesso a PII, detalhe e exportação | tenant, usuário autorizado, recurso, horário, resultado e motivo sanitizado |

## State Semantics

| Dimensão | Valores | Significado |
|---|---|---|
| Disponibilidade | `available`, `restricted`, `unavailable`, `coming_soon` | capacidade da fonte, licença, permissão ou escopo |
| Frescor | `fresh`, `stale`, `unavailable` | idade da última coleta bem-sucedida, sem redefinir a capacidade |
| Resultado de consulta | `items`, `no_matches`, `empty_valid_response` | resultado efetivo de uma consulta; não é disponibilidade |
| Geração | `staging`, `published`, `failed` | ciclo de fotografia, separado de uma fonte individual |

## Retenção e proteção

- Snapshots, sinais e eventos próprios expiram após 12 meses para o tenant configurado por uma tarefa agendada; referências privadas expiram ou são removidas junto da evidência aplicável.
- Dados brutos de relatório, URLs de redirecionamento e mensagens Graph detalhadas não entram no payload Inertia, logs ou tabelas de exportação.
- As exportações derivam somente das colunas autorizadas de uma geração publicada e declaram cobertura/sensibilidade antes do download.
