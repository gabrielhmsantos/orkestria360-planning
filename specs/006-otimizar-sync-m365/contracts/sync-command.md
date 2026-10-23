# Contract: Ciclo Coordenado Microsoft 365

## Command

```text
php artisan app:sync-microsoft365 {tenant?} {--force} {--full-reconciliation}
```

## Scheduling

O scheduler invoca o comando uma vez por dia às 03:00 no timezone configurado em `TenantActivitySetting`; a manutenção de eventos ocorre após esse ciclo. O prune de identidades continua uma manutenção separada. A execução manual preserva o timezone do tenant para calcular janelas de evento, que sempre são persistidas em UTC.

O POC opera o único tenant configurado pelo `TenantContext`; seleção de múltiplos tenants e políticas específicas de mudança de horário são deliberadamente fora de escopo. Janelas persistidas em UTC evitam ambiguidade de horário local.

| Entrada | Regra |
|---|---|
| `tenant` | Opcional; usa o tenant configurado quando ausente. |
| `--force` | Permite nova execução manual, mantendo idempotência e lock global. |
| `--full-reconciliation` | Solicita reconciliação excepcional de recursos de estado; não muda o watermark de eventos sem coleta bem-sucedida. |

## Etapas e dependências

| Etapa | Depende de | Resultado quando a dependência falha |
|---|---|---|
| `identities` | — | Falha; mantém geração publicada anterior. |
| `identity_secondary_snapshots` (roles, PIM, MFA e risco) | — | Falha; mantém estado e snapshot anterior de cada fonte, sem bloquear etapas independentes. |
| `user_memberships` | `identities` publicada no ciclo, ou reconciliação semanal | `skipped`; mantém projeção anterior. |
| `licensing_assignments` | `identities` publicada no ciclo | `skipped`; mantém projeção anterior. |
| `groups` | — | Falha; mantém geração publicada anterior. |
| `group_relationships` | `groups` publicada no ciclo | `skipped`; mantém projeção anterior. |
| `directory_audits` | — | Falha; mantém coleção e estado anterior. |
| `user_audit_projection` | `directory_audits` | `skipped`. |
| `group_audit_projection` | `directory_audits`, `groups` | `skipped`. |
| `sign_ins` | — | Falha; mantém coleção e estado anterior. |
| `subscribed_skus` e relatórios CSV | — | Podem concluir com aviso sem invalidar etapas independentes. |

## Saída de console

Cada etapa imprime uma linha legível com: chave, status, duração, páginas, itens, tentativas e, quando aplicável, período de cobertura ou motivo sanitizado de falha/skip. O comando retorna falha quando nenhuma etapa primária publica ou quando o lock impede uma execução solicitada; retornos com avisos preservam as etapas independentes concluídas.

## Garantias

- Um lock global por tenant impede dois ciclos simultâneos.
- Não há nova leitura completa de usuários/grupos em ciclo delta válido.
- Uma fonte compartilhada é coletada somente uma vez por ciclo.
- Etapas dependentes nunca usam fotografia anterior como se fosse resultado do ciclo atual.
