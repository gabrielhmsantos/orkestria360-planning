# Pesquisa técnica — Microsoft 365 OneDrive UI

## Rota de montagem, sem backend de domínio

**Decisão**: seguir o padrão de módulos Microsoft 365 existente com GET autenticado para a raiz e abas publicadas, um `OnedriveController` mínimo e `Inertia::render('modules/onedrive', { activeTab })`.

**Racional**: fornece URL navegável, proteção já estabelecida e navegação interna por `Link`, sem transportar dados OneDrive pelo Laravel. A página resolve tudo a partir do datasource de fixtures. A documentação do Inertia recomenda `Link` para navegação interna e preservação explícita de scroll/estado apenas quando aplicável; não será usada navegação mutável ou visita a endpoint de dados.

**Alternativas rejeitadas**:

- Reutilizar um serviço Laravel de PageData: acrescentaria uma dependência de backend não aprovada.
- Colocar JSON de fixtures nas props da resposta Inertia: mistura a fixture de desenvolvimento com o ponto de montagem e dificulta a futura substituição do adapter.
- Uma única URL sem aba: enfraquece a navegação publicável que os módulos irmãos já adotam.

## Boundary de dados frontend

**Decisão**: expor `OnedriveUiDataSource` como seam semântico permanente com somente `getSurface(surface)` e implementar `OnedriveFixtureDataSource` como única fonte neste ciclo. Catálogo, `defaultScenario`, seleção explícita, scenario override e provenance pertencem a um fixture harness transitório que cria/injeta o datasource já configurado.

**Racional**: o contrato semântico já foi reconciliado, mas não há fonte real como pré-requisito. Um boundary tipado permite que cada tab dependa de uma projection, não de um arquivo JSON. O harness garante seleção explícita dos cenários para validação sem contaminar esse boundary. Uma fonte futura implementará o mesmo contrato e entregará disponibilidade equivalente sem conhecer fixtures, cenários ou override e sem alterar componentes.

**Alternativas rejeitadas**:

- Importar fixtures diretamente por cada tab: cria acoplamento distribuído, reduz testabilidade e torna a troca futura insegura.
- Expor APIs de cenário no datasource permanente: obrigaria uma fonte real a sustentar um detalhe transitório de fixture e impediria a remoção limpa do harness.
- Criar store global, React Query ou camada de cache: não há fetch assíncrono, fonte remota ou requisito de cache; adicionaria complexidade sem benefício.
- Usar dados plausíveis inventados onde um campo estiver ausente: viola o contrato e torna estados de indisponibilidade invisíveis.

## Contratos e fixtures locais

**Decisão**: portar os oito fixtures aprovados para `resources/js/data/modules/onedrive/fixtures/`, mantendo nomes de cenários, envelope, disponibilidade e valores sintéticos; registrar no próprio módulo a origem em `discovery/microsoft-365/v2/onedrive/fixtures/` e sua versão/revisão de contrato.

**Racional**: código da aplicação não deve depender de uma leitura em runtime fora de `orkestria360/`. A portabilidade mantém a aplicação autocontida e os fixtures explicitamente de desenvolvimento, sem mudar sua semântica. A validação compara cenário e forma esperada com o discovery antes da entrega.

**Alternativas rejeitadas**:

- Ler os JSONs diretamente no diretório de discovery: acopla o build da aplicação a um artefato de planejamento externo.
- Converter fixture em seed ou tabela: introduz persistência e sugere dado operacional onde só existe cenário de UI.

## Composição da UI

**Decisão**: manter uma page shell fina e oito componentes de superfície locais, compondo `PageScaffold`, `ModuleHero`, `ModuleTabBar`, `OperationalMetricGrid`, `ChartPanel`, `OperationalFilterBar`, `OperationalTable`, `InlineDetailPanel`, `ProcessProgress`, `DataAvailabilityPanel`, `LastUpdatedIndicator`, `Alert` e demais componentes já verificados no blueprint.

**Racional**: o blueprint já determina densidade, estrutura e ações. As formas dos contratos são diferentes o suficiente para que cada superfície preserve seus campos e microestados; uma pequena composição local de disponibilidade reduz repetição sem esconder a semântica.

**Alternativas rejeitadas**:

- Criar novo design system ou cards/tabelas paralelos: redundante e conflita com o blueprint/repositório.
- Um tab genérico que tenta interpretar todos os contratos: perderia colunas, filtros, avisos por bloco e regras responsivas próprias.
- Duplicar o blueprint em JSX de planejamento: a implementação deve referenciá-lo e obedecê-lo, não criar uma segunda fonte estrutural.

## Disponibilidade e ausência

**Decisão**: representar disponibilidade como union discriminado e renderizar no nível indicado pelo contrato: global ou de bloco. Valores `null`, coleções vazias, lacunas de cobertura e freshness são preservados antes da formatação.

**Racional**: `available` indica publicação disponível. `empty` é um resultado factual (por exemplo, coleção vazia) dentro de um cenário que pode continuar `available`; não integra o union de disponibilidade. `unavailable` indica ausência de coleta/capacidade; `restricted`, bloqueio de acesso; `partial`, cobertura incompleta; `stale`, dado publicado fora do frescor esperado; e `failed`, falha de processamento/publicação. O blueprint prescreve componentes e copy distintos e proíbe retry/refresh manual.

**Alternativas rejeitadas**:

- Um estado “sem dados” único: colapsa significado operacional e falha os critérios da spec.
- Converter `null` em zero ou texto genérico: inventa precisão e muda o sentido do contrato.
- Botão de atualizar/retry: não possui resultado publicado e é excluído por FR-026.

## Estado local, filtros e acessibilidade

**Decisão**: filtros, paginação, seleção de linha e painel inline ficam no estado local da superfície e são derivados imutavelmente do projection atual. Ao mudar filtro que invalide seleção/página, resetar ambos conforme `FRONTEND.md`. Tabs usam links internos com identificação estável.

**Racional**: os cenários são estáticos e o comportamento é verificável sem fonte. A documentação React recomenda derivar coleções filtradas com `useMemo` quando há filtragem/cálculo e dependências explícitas. A documentação Inertia suporta navegação com `Link` e preservação explícita de estado/scroll, que será usada somente se o blueprint exigir continuidade observável.

**Alternativas rejeitadas**:

- Estado de filtro no backend/query string: não há backend de dados neste track.
- Seleção persistida ou restaurada entre sessões: não é resultado aprovado.

## Estratégia de teste

**Decisão**: cobrir montagem e rotas em testes PHPUnit/Inertia; validar tipos, lint e build; executar aceitação determinística no navegador contra cada cenário declarado dos oito fixtures, nos breakpoints do blueprint, incluindo teclado/foco e anúncios de indisponibilidade.

**Racional**: a aplicação atual já oferece padrão `ModulePageTestCase` para rotas/Inertia, enquanto o guia frontend define navegador como gate quando não há infraestrutura de testes de componente configurada. Assim a UI continua verificável independentemente de collectors, banco de dados de domínio e integrações externas.

**Alternativas rejeitadas**:

- Testar somente o cenário default: deixaria sem prova os estados semânticos exigidos.
- Acrescentar framework de testes de componentes só para esta feature: amplia toolchain sem necessidade demonstrada.

## Fontes consultadas

- Código local: `routes/web.php`, módulos Microsoft 365 existentes, `ModulePageTestCase`, `docs/agents/FRONTEND.md` e `docs/agents/TESTING.md`.
- [React — `useMemo`](https://react.dev/reference/react/useMemo) para coleções derivadas por filtro e dependências explícitas.
- [Inertia React — Links](https://inertiajs.com/links) e [scroll management](https://inertiajs.com/scroll-management) para navegação interna e preservação explícita de estado/scroll.
- [Laravel — Controllers](https://laravel.com/docs/controllers) para o ponto de entrada HTTP mínimo e [Inertia responses](https://inertiajs.com/responses) para renderização da página.
