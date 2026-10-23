# Soluções e aprendizados

Consulte as notas pertinentes à tarefa e confira suas condições de aplicação contra o contrato e o SHA da entrega. Registre novos aprendizados com problema, causa, solução e evidência reproduzível. As decisões e os contratos aprovados da demanda orientam sua aplicação.

- [users-accounts-v2-architecture](users-accounts-v2-architecture.md) - Usuários e Contas usa fotografia geracional, reusa licenças e separa disponibilidade, frescor e resultado vazio | architecture | microsoft-365, graph, users-accounts
- [guest-b2b-analytics](guest-b2b-analytics.md) - Convidados usa estado B2B persistido, atividade publicada e domínio de mail sem inferir UPN #EXT# | pattern | microsoft-365, graph, users-accounts, guests
- [microsoft-365-activity-seams](microsoft-365-activity-seams.md) - Overview usa serviceAnnouncement/issues e auditLogs/directoryAudits; directory audits depende de AuditLog.Read.All | gotcha | microsoft-365, graph, permissions, activity
- [microsoft-365-summary-count-gotcha](microsoft-365-summary-count-gotcha.md) - Summary cards zeram quando o count usa $top=0 e o secure score depende de role ausente no token | gotcha | microsoft-365, graph, permissions, counts
- [microsoft-graph-php-seam](microsoft-graph-php-seam.md) - O SDK PHP instalado pede seam proprio com auth Kiota e chamadas backend controladas | gotcha | microsoft-graph, php, kiota, laravel
- [microsoft-365-healthscore-harness](microsoft-365-healthscore-harness.md) - Harness do Health Score usa coleta raw com paginacao e fan-out por grupos/roles/dominios | flow | microsoft-365, healthscore, graph, diagnostics
- [governance-document-workflow](governance-document-workflow.md) - Persisted governance workflow with protected files | flow | governance, inertia, laravel, storage

- [module-grid-layout-gotchas](module-grid-layout-gotchas.md) - Summary grids need self-start in module layouts | gotcha | layout, grid, modules
- [security-two-factor-gap](security-two-factor-gap.md) - 2FA tests and code are out of sync | gotcha | fortify, settings, tests
- [auth-shell-flow](auth-shell-flow.md) - Laravel web auth into Inertia app shell | flow | inertia, auth, layout
- [home-root-entry](home-root-entry.md) - Authenticated root now serves the Orkestria home and logout keeps using /welcome | flow | home, routing, fortify
- [module-page-pattern](module-page-pattern.md) - Module pages receive mock payloads from PHP routes and typed contracts from TS files | pattern | modules, inertia, routes, tests
- [shell-navigation-dual-source](shell-navigation-dual-source.md) - Sidebar navigation is rendered from the client registry and mirrored in Inertia shared props | gotcha | navigation, shell, inertia
- [licensing-ui-surface](licensing-ui-surface.md) - Shell Inertia e abas de Licenciamento separadas por módulos, com fronteiras comercial e nominal da V2 | flow | licensing, microsoft-365, inertia, ui
- [licensing-illustrated-extension](licensing-illustrated-extension.md) - Illustrated sponsor surfaces, eligible-seat integrity and prepared V2 states | flow | licensing, microsoft-365, inertia, ui
- [operational-ui-components](operational-ui-components.md) - Componentes operacionais são contratos separados, compostos de shadcn/ui e não carregam conteúdo de domínio | pattern | ui, components, users-accounts
- [shell-theme-surface](shell-theme-surface.md) - The live authenticated header for theming work is AppSidebarHeader, not AppHeader | gotcha | shell, theme, layout
- [chart-theme-vars](chart-theme-vars.md) - Recharts wrappers should pull from app CSS theme variables for light/dark parity | pattern | recharts, theme, dark-mode
