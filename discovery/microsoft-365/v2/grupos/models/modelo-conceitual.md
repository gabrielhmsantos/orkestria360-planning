# Modelo conceitual — Microsoft 365 / Grupos

## Finalidade

Complementar a leitura do Microsoft Graph com contexto corporativo, evolução temporal e trilha própria sem substituir o diretório como fonte técnica.

## Entidades propostas

| Entidade | Papel | Procedência e estado |
| --- | --- | --- |
| `directory_groups` | Snapshot de identidade e propriedades do grupo | Graph; `available` mediante permissão. |
| `group_memberships` e `group_owners` | Relações diretas/transitivas e responsáveis técnicos identificados | Graph; `restricted` por permissão/visibilidade. |
| `group_governance` | Finalidade, responsáveis de negócio/técnico, criticidade, revisão, exceções e documentos | Orkestria; `unavailable` até modelo e manutenção aprovados. |
| `group_health_findings` | Achados rastreáveis por regra e severidade | Orkestria; `unavailable` até regras homologadas. |
| `group_activity_snapshots` e `group_license_snapshots` | Evolução diária de atividade, consumo e erros | Graph + Orkestria; `restricted` conforme report/licença. |
| `group_audit_events` | Eventos normalizados e retenção própria | Graph + Orkestria; `restricted` por acesso/retenção. |
| `group_access_reviews` | Campanhas, decisões e evidências de revisão | Entra Governance ou workflow Orkestria; `coming_soon`. |

## Relações e retenção

- Um grupo possui muitos membros, proprietários, snapshots, achados e eventos.
- Contexto de governança é uma extensão 1:1 por grupo/tenant, auditável e datada.
- Snapshots e eventos preservam a evolução além da janela fornecida pelo provedor; política de retenção é pendência.

## Sincronização sugerida pelo sponsor

Carga completa inicial, `deltaLink` de `/groups/delta`, reconciliação de membros/proprietários e snapshots. A cadência sugerida é de 1–4 horas para alterações/auditoria e diária para reconciliação, atividade, licenciamento, ciclo de vida e snapshots. Isso é uma hipótese operacional a validar, não um SLA aprovado.
