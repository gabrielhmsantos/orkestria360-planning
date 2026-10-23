# Componentes operacionais reutilizáveis

- Os padrões de interface extraídos de Usuários e Contas e consolidados em Licenciamento ficam em arquivos separados de `resources/js/components/modules/`, para permitir importação e evolução independentes. Não usar um arquivo agregador para componentes visualmente distintos.
- `ModuleHero` e `ModuleTabBar` formam a camada contextual do módulo. Hero recebe a atualização e ação já formatadas pela página; tab bar recebe rotas Inertia e somente define a superfície de navegação responsiva.
- `OperationalKpiCard`, `OperationalSectionCard`, `DataAvailabilityPanel`, `OperationalMetricGrid`, `SourceMetadata`, `DataFreshness`, `ProcessProgress` e `OperationalTable` são superfícies compostas de shadcn/ui e tokens existentes. Eles não escolhem métricas, fatos, filtros, colunas, cálculos ou regras de domínio.
- `DataAvailabilityPanel` preserva anatomia neutra de visualização sem produzir números sintéticos. `OperationalTable` só controla a casca, o cabeçalho e a rolagem horizontal: corpo, estado vazio e paginação permanecem no módulo. Use `variant="embedded"` quando a tabela estiver dentro de `OperationalSectionCard`, para não produzir uma superfície de card aninhada; `standalone` é o padrão para usos independentes.
- `CapacityMeter`, `OperationalFilterBar`, `InlineDetailPanel`, `OperationalTimeline` e `RecommendationCard` foram extraídos de Licenciamento em 2026-08-03. São contratos de apresentação: a aba continua responsável por valores, filtros, ordem cronológica, prioridade, estado aberto e ações de domínio.
- A vitrine autenticada em `orkestria360/routes/web.php` (`design-system`) renderiza `modules/design-system` e é o ponto de avaliação manual dos componentes e estados antes de uma adoção por módulos de produto. O teste `tests/Feature/DesignSystemPageTest.php` cobre o contrato de acesso e da página Inertia.

Updated: 2026-08-03
