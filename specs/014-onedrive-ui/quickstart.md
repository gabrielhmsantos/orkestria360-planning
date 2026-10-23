# Quickstart de validação — Microsoft 365 OneDrive UI

## Pré-requisitos

- Branch raiz `feat/014-onedrive-ui` e dependências da aplicação instaladas em `orkestria360/`.
- Banco isolado de testes da aplicação disponível para os testes de rota, conforme `docs/agents/TESTING.md`. A UI OneDrive não deve exigir dado OneDrive no banco.
- Fixtures locais conferidas contra `discovery/microsoft-365/v2/onedrive/fixtures/`; cada uma deve manter somente cenários aprovados e sua provenance.

## Validação estática e de rota

Na raiz da aplicação:

```bash
cd orkestria360
npm run types:check
npm run lint:check
npm run build
APP_ENV=testing DB_CONNECTION=pgsql DB_DATABASE=orkestria360_test DB_URL='' CACHE_STORE=database DB_USERNAME=orkestria360 DB_PASSWORD=orkestria360 php artisan test tests/Feature/Onedrive
composer ci:check
```

Os testes de feature devem demonstrar:

- redirecionamento de visitante para login e acesso autenticado à raiz do OneDrive;
- componente Inertia `modules/onedrive`, aba ativa válida e as oito tabs na ordem aprovada;
- rejeição de slug de aba não publicado;
- inexistência de rotas OneDrive não-GET, de exportação, refresh, retry ou ações mutáveis.

## Matriz de fixtures

`tenant-scenarios.json` é a única base. Para cada cenário global
(`populated`, `partial`, `empty`, `unavailable`, `restricted`, `stale` e
`failed`), o fixture harness deve renderizar as oito abas com aquele mesmo
cenário e validar campos, tabelas, gráficos, filtros e mensagens contra o
contrato correspondente. A execução pode selecionar cenário pelo harness de
teste/devtools, mas esse mecanismo não é uma interação do produto nem uma API
do `OnedriveUiDataSource`.

O validador deve confirmar que todos os cenários contêm a matriz completa de
abas; não pode adivinhar, omitir ou compor cenários por superfície.

## Checklist comportamental por cenário

1. Confirmar a ordem: Dashboard Executivo, Contas e Armazenamento, Arquivos e Conteúdo, Compartilhamento e Acessos, Atividade e Sincronização, Usuários Desligados e Retenção, Configurações e Segurança, Histórico e Auditoria.
2. Verificar estrutura, números, rótulos, tooltips, coluna/tabela, gráfico e filtros exatamente contra o contrato e o UI Blueprint da superfície atual.
3. Exercitar cada filtro, paginação e seleção/painel inline publicados; mudança de filtro invalida seleção/página quando aplicável e não produz mutação.
4. Para uma coleção `empty` em cenário `available`, conferir mensagem de ausência específica e não um erro/zero. Para `unavailable` e `restricted`, conferir `DataAvailabilityPanel` com significado distinto. Para `partial`, conferir dados ainda visíveis mais alerta de cobertura. Para `stale`, conferir indicador de última publicação sem refresh. Para `failed`, conferir alerta destrutivo sem retry.
5. Confirmar que `null`, lacuna ou campo opcional não aparecem como zero, dado inventado ou indicador de sucesso.
6. Confirmar ausência de exportação, relatórios, personalização, refresh manual, drill-down sem destino, cabeçalho sem resultado e qualquer ação administrativa pendente.

## Responsividade e acessibilidade

Em viewport wide e compact, validar os breakpoints do blueprint (`sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem quando a superfície os usa): cards reorganizam sem perder contexto; tabelas usam o tratamento responsivo publicado; não há scroll horizontal de página não autorizado ou tabela com rolagem vertical aninhada.

Com teclado, percorrer tabs, filtros, paginação, linhas e detalhes. Confirmar foco visível, nomes acessíveis, relação de labels, ordem lógica, feedback de mudança de conteúdo/estado e contraste/ícones não dependentes apenas de cor. Use a validação de navegador existente do projeto (Playwright CLI quando aplicável) e não versione screenshots ou arquivos temporários.

## Preparação para geração de tarefas

O planejamento está pronto para `/speckit-tasks` quando o contrato tipado, a estratégia de adapter de fixtures, a matriz de cenários e os gates de validação estiverem definidos e rastreáveis aos artefatos aprovados. A verificação de todas as oito superfícies, de todos os cenários e dos gates é critério de entrega da implementação, não pré-condição para gerar tarefas.
