# Histórico de especificações

`specs/` é acervo histórico para consulta. Não criar novas features, planos ou execuções nesta pasta. Procedimentos e comandos descritos nos documentos não são instruções para o fluxo atual.

Novos planejamentos usam `plans/<delivery>/r<revision>/`, conforme `artifact_root` e os paths definidos pela City; veja [destino dos artefatos](../docs/FLUXO.md#destino-dos-artefatos). Um contrato deste acervo só entra em uma entrega quando explicitamente selecionado como referência; checkboxes e relatórios não comprovam os gates atuais.

| ID e feature | Especificação | Plano |
| --- | --- | --- |
| 001-governance-document-workflow | [spec.md](001-governance-document-workflow/spec.md) | [plan.md](001-governance-document-workflow/plan.md) |
| 002-microsoft-365-module | [spec.md](002-microsoft-365-module/spec.md) | [plan.md](002-microsoft-365-module/plan.md) |
| 003-m365-licenciamento | [spec.md](003-m365-licenciamento/spec.md) | [plan.md](003-m365-licenciamento/plan.md) |
| 004-usuarios-contas | [spec.md](004-usuarios-contas/spec.md) | [plan.md](004-usuarios-contas/plan.md) |
| 005-m365-grupos | [spec.md](005-m365-grupos/spec.md) | [plan.md](005-m365-grupos/plan.md) |
| 006-otimizar-sync-m365 | [spec.md](006-otimizar-sync-m365/spec.md) | [plan.md](006-otimizar-sync-m365/plan.md) |
| 007-m365-mfa | [spec.md](007-m365-mfa/spec.md) | [plan.md](007-m365-mfa/plan.md) |
| 008-sync-operation-flags | [spec.md](008-sync-operation-flags/spec.md) | [plan.md](008-sync-operation-flags/plan.md) |
| 009-secure-score-module | [spec.md](009-secure-score-module/spec.md) | [plan.md](009-secure-score-module/plan.md) |
| 010-postgresql-18-migration | [spec.md](010-postgresql-18-migration/spec.md) | [plan.md](010-postgresql-18-migration/plan.md) |
| 011-multi-tenancy | [spec.md](011-multi-tenancy/spec.md) | [plan.md](011-multi-tenancy/plan.md) |
| 012-m365-configuracoes | [spec.md](012-m365-configuracoes/spec.md) | [plan.md](012-m365-configuracoes/plan.md) |
| 013-m365-relatorios | [spec.md](013-m365-relatorios/spec.md) | [plan.md](013-m365-relatorios/plan.md) |
| 014-onedrive-ui | [spec.md](014-onedrive-ui/spec.md) | [plan.md](014-onedrive-ui/plan.md) |

Os [templates de planejamento](../templates/README.md) auxiliam novos artefatos em `plans/`; não devem ser usados para regenerar este acervo.

Algumas specs históricas citam referências que não fazem parte deste escopo. A indicação de indisponibilidade preserva a rastreabilidade, sem autorizar sua recuperação ou comprovar que os gates antigos continuam satisfeitos.
