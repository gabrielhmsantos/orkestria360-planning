# Modelo conceitual — Usuários e Contas

## Entidades persistentes candidatas

| Entidade | Finalidade | Procedência | Estado |
| --- | --- | --- | --- |
| Identidade de diretório | Fotografia normalizada da identidade e vínculo ao tenant | Microsoft Graph | `available` mediante consentimento. |
| Achado de saúde | Não conformidade detectada, severidade, regra e resolução | Regras Orkestria + Graph | `available` após regras aprovadas. |
| Classificação de identidade | Tipo técnico, proprietários, finalidade, revisão e exceção | Orkestria + classificação manual | `unavailable` até definição operacional. |
| Solicitação e tarefa de ciclo de vida | Onboarding, offboarding e evidências de conclusão | Portal Orkestria e integrações futuras | `coming_soon`. |
| Snapshot de diretório | Histórico diário para análise de evolução | Coletor Orkestria | `available` após decisão de retenção. |
| Evento de auditoria | Evento normalizado, fonte, ator, alvo e resultado | Graph + Orkestria | `restricted` por permissão e retenção. |

## Relações e limites

- Todas as entidades pertencem a um tenant; uma identidade pode possuir muitos snapshots, achados e eventos.
- Solicitações de ciclo de vida podem ter muitas tarefas e evidências; sua execução não está autorizada por este discovery.
- Dados oriundos de Graph conservam fonte e data de coleta. Dados internos conservam responsável e trilha de alteração.
- O modelo é conceitual: não fixa tabelas, tipos físicos, retenção, índices ou endpoint.
