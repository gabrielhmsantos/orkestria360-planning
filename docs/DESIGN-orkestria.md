# Design System: Orkestria 360

Referência consolidada de design da aplicação, preparada em 22 de outubro de
2026 com a skill `design-md`. As fontes são o catálogo Storybook e o código
do produto; não há projeto ou identificador Stitch associado a este documento.

## 1. Visual Theme & Atmosphere

O Orkestria 360 apresenta uma linguagem operacional, sóbria e organizada, voltada
à leitura de indicadores e à investigação de ambientes de nuvem. A densidade é
controlada: valores e classificações se destacam, enquanto explicações, períodos
e metadados ocupam um segundo nível de atenção. A hierarquia depende de
tipografia, alinhamento e espaço entre grupos.

Superfícies neutras sustentam um azul intenso para ações e orientação. Verde,
âmbar e vermelho comunicam estados específicos, sempre acompanhados de texto.
Os cantos arredondados suavizam os controles e os cartões; nos módulos
operacionais, contornos finos e profundidade discreta mantêm a leitura compacta.
O tema escuro preserva essa organização com fundos de carvão e superfícies
ligeiramente mais claras.

### Como aplicar e manter esta referência

- **Preferência visual:** nas divergências entre a aplicação e o Storybook,
  este documento adota o padrão do Storybook, conforme orientação do responsável
  pelo produto. A seção final identifica diferenças que ainda exigem alinhamento.
- **Complemento da aplicação:** padrões ausentes do catálogo podem ser
  documentados a partir da implementação e das diretrizes aprovadas, com sua
  origem explícita. A existência de uma tela isolada não transforma todos os
  seus detalhes em regras globais.
- **Limites:** composições e dados sintéticos das stories ilustram o design.
  Eles não aprovam novas capacidades, métricas, permissões ou regras de negócio.
  Contratos específicos de cada superfície e as instruções da aplicação
  continuam regendo esses assuntos.
- **Reutilização:** a base de controles é shadcn/ui. Os componentes operacionais
  compõem essa base para apresentar o conteúdo do produto. Antes de introduzir
  um tratamento visual, verificar os padrões existentes.
- **Manutenção:** atualizar este documento quando uma decisão visual for
  aprovada. Novas decisões precisam ser identificadas; uma lacuna não deve ser
  preenchida como se já fosse um padrão estabelecido.

### Fontes consultadas

Os caminhos abaixo são relativos ao repositório identificado, permitindo a
consulta tanto na cópia da aplicação quanto na cópia do workspace.

| Fonte | Repositório e localização |
| --- | --- |
| Cores, temas, fonte e raios | `orkestria360-design-system`, `src/app.css` |
| Controles, estados e navegação | `orkestria360-design-system`, `src/components/ui/` e `src/components/shell/`, com suas stories |
| Componentes operacionais e gráficos | `orkestria360-design-system`, `src/components/modules/`, com suas stories |
| Semântica de status | `orkestria360-design-system`, `src/lib/status-tone.ts` |
| Escolha de superfícies | Storybook `Decisions/Cards`; `orkestria360-design-system`, `src/stories/decisions-cards.stories.tsx` |
| Fundamentos e composições | Storybook `Foundations/Visão geral` e `Scenarios`; `orkestria360-design-system`, `src/stories/foundations.stories.tsx` e `src/stories/scenarios.stories.tsx` |
| Dashboard analítico | Storybook `Scenarios/OneDrive/Histórico e Auditoria`; `orkestria360-design-system`, `src/stories/onedrive-analytics.stories.tsx`, `src/stories/onedrive-audit-dashboard.tsx` e `docs/analytical-dashboard-pattern.md` |
| Limite do catálogo | `orkestria360-design-system`, `docs/storybook-catalog-audit.md` |
| Padrões da aplicação | `orkestria360`, `resources/css/app.css`, `resources/js/lib/status-tone.ts`, `resources/js/components/` e `resources/js/layouts/app/app-sidebar-layout.tsx` |
| Regras de composição, dados e acessibilidade | `orkestria360`, `AGENTS.md` e `docs/agents/FRONTEND.md` |

Base de referência: design system na revisão `314627a` e aplicação na revisão
`3ed550b`. O inventário anterior do workspace foi consultado para reconciliar as
decisões operacionais existentes; esta consolidação substitui seu conteúdo.

## 2. Color Palette & Roles

### Leitura da paleta

Os valores originais do catálogo são definidos em OKLCH. Os hexadecimais abaixo
são representações em sRGB, arredondadas a oito bits por canal, para referência
visual e uso em ferramentas de design. Cores fora desse espaço podem sofrer
limitação na conversão. O valor OKLCH original permanece na fonte indicada;
esta tabela não instrui a substituir os tokens do produto por valores literais.

Hexadecimais com oito dígitos preservam transparência. A aparência final dessas
cores depende da superfície sobre a qual são aplicadas. A combinação de texto e
fundo precisa ser verificada no contexto de uso; listar a paleta não constitui
uma certificação de contraste.

### Superfícies, conteúdo, ações e navegação

| Nome visual e referência | Claro | Escuro | Papel |
| --- | --- | --- | --- |
| Branco de base / carvão profundo (`background`) | #FFFFFF | #0A0A0A | Plano de fundo da aplicação. |
| Tinta principal / branco suave (`foreground`) | #0A0A0A | #FAFAFA | Texto principal sobre o fundo da aplicação. |
| Branco de superfície / carvão de superfície (`card`) | #FFFFFF | #171717 | Fundo de cartões. |
| Tinta de cartão / branco suave (`card-foreground`) | #0A0A0A | #FAFAFA | Conteúdo sobre cartões. |
| Branco sobreposto / carvão de superfície (`popover`) | #FFFFFF | #171717 | Menus e superfícies sobrepostas. |
| Tinta sobreposta / branco suave (`popover-foreground`) | #0A0A0A | #FAFAFA | Conteúdo de menus e sobreposições. |
| Azul intenso de ação (`primary`) | #1447E6 | #193CB8 | Ação principal e orientação ativa. |
| Branco azulado (`primary-foreground`) | #EFF6FF | #EFF6FF | Texto e ícones sobre a ação primária. |
| Cinza porcelana / grafite frio (`secondary`) | #F4F4F5 | #27272A | Ações secundárias e superfícies de menor ênfase. |
| Tinta fria / branco suave (`secondary-foreground`) | #18181B | #FAFAFA | Conteúdo sobre a superfície secundária. |
| Cinza névoa / grafite neutro (`muted`) | #F5F5F5 | #262626 | Fundos discretos, trilhos e agrupamentos. |
| Cinza de apoio (`muted-foreground`) | #737373 | #A1A1A1 | Descrições, metadados, eixos e texto secundário. |
| Cinza de interação (`accent`) | #F5F5F5 | #262626 | Realce neutro de interação, sem substituir o azul primário. |
| Tinta de interação / branco suave (`accent-foreground`) | #171717 | #FAFAFA | Conteúdo sobre o realce neutro. |
| Vermelho de ação destrutiva (`destructive`) | #E7000B | #FF6467 | Ações destrutivas, erros e indicadores críticos que usam esse papel. |
| Vermelho de conteúdo declarado (`destructive-foreground`) | #E7000B | #FB2C36 | Valor declarado pelo tema; preservar a combinação de fundo e texto do componente. |
| Cinza de contorno / branco a 10% (`border`) | #E5E5E5 | #FFFFFF1A | Divisores e limites de superfícies. |
| Cinza de entrada / branco a 15% (`input`) | #E5E5E5 | #FFFFFF26 | Base de fundo dos campos, com a opacidade adicional do componente. |
| Cinza de foco (`ring`) | #A1A1A1 | #737373 | Anéis e contornos de foco. |
| Branco suave de navegação / carvão de superfície (`sidebar`) | #FAFAFA | #171717 | Plano da navegação lateral. |
| Tinta de navegação / branco suave (`sidebar-foreground`) | #0A0A0A | #FAFAFA | Conteúdo da navegação lateral. |
| Azul de navegação (`sidebar-primary`) | #155DFC | #2B7FFF | Ênfase primária própria da navegação. |
| Branco azulado de navegação (`sidebar-primary-foreground`) | #EFF6FF | #EFF6FF | Conteúdo sobre a ênfase primária da navegação. |
| Cinza de navegação ativa (`sidebar-accent`) | #F5F5F5 | #262626 | Realce neutro de itens da sidebar. |
| Tinta ativa / branco suave (`sidebar-accent-foreground`) | #171717 | #FAFAFA | Texto dos itens realçados da sidebar. |
| Contorno da navegação (`sidebar-border`) | #E5E5E5 | #FFFFFF1A | Separação da navegação lateral. |
| Foco da navegação (`sidebar-ring`) | #A1A1A1 | #737373 | Anel de foco dos controles laterais. |

### Estados e classificação

O catálogo distingue **neutro**, **informação**, **sucesso**, **atenção** e
**crítico**. Neutro serve a ausência de classificação e conteúdo secundário;
informação usa o azul primário. Ausência de dados não recebe automaticamente
uma classificação positiva ou crítica.

| Nome visual e referência | Claro | Escuro | Papel |
| --- | --- | --- | --- |
| Verde esmeralda (`success`) | #00BC7D | #00BC7D | Sucesso ou condição favorável publicada. |
| Conteúdo sobre o verde (`success-foreground`) | #FAFAFA | #0A0A0A | Branco suave no tema claro; tinta escura no tema escuro. |
| Âmbar vivo (`warning`) | #FE9A00 | #FE9A00 | Atenção ou condição que exige acompanhamento. |
| Tinta sobre o âmbar (`warning-foreground`) | #0A0A0A | #0A0A0A | Conteúdo escuro sobre o estado de atenção. |
| Vermelho coral (`critical`) | #FF6467 | #FF6467 | Estado crítico nos componentes que usam esse token. |
| Branco sobre o coral (`critical-foreground`) | #FAFAFA | #FAFAFA | Conteúdo claro sobre o estado crítico declarado. |

Nos badges de sucesso e atenção, a cor do estado aparece em texto e em um fundo
translúcido: 15% no tema claro e 25% no escuro; a interação pode usar 20%.
O badge crítico usa o tratamento destrutivo. As funções de cor sólida do catálogo
também usam a cor destrutiva para o tom crítico; isso não torna os papéis
`critical` e `destructive` intercambiáveis em qualquer contexto.

As cores expressam uma classificação recebida do domínio. Limiares de score,
risco ou utilização não são regras universais de design e não devem ser
deduzidos a partir da cor.

### Séries de gráficos

A sequência padrão dos gráficos percorre cinco azuis, do céu luminoso ao azul
profundo. Os valores são os mesmos nos dois temas. Essa sequência diferencia
séries e categorias; ela não é uma escala de gravidade.

| Nome visual e referência | Claro | Escuro | Papel |
| --- | --- | --- | --- |
| Céu luminoso (`chart-1`) | #74D4FF | #74D4FF | Posição 1 da sequência de séries. |
| Azul celeste vivo (`chart-2`) | #00A6F4 | #00A6F4 | Posição 2 da sequência de séries. |
| Azul médio (`chart-3`) | #0084D1 | #0084D1 | Posição 3 da sequência de séries. |
| Azul profundo (`chart-4`) | #0069A8 | #0069A8 | Posição 4 da sequência de séries. |
| Azul oceânico escuro (`chart-5`) | #00598A | #00598A | Posição 5 da sequência de séries. |

Outras cores podem aparecer quando a composição documentada declara uma
semântica específica. Preservar a associação entre cor, série e legenda ao longo
do mesmo recorte. Estados de risco continuam precisando de rótulos textuais.

## 3. Typography Rules

A família de referência é **DM Sans Variable**, com alternativa genérica
sem serifa. Ela está importada no catálogo, declarada no tema final e citada em
`Foundations/Visão geral`. Títulos e conteúdo compartilham a mesma família;
a diferenciação vem de tamanho, peso e espaçamento.

A tabela descreve hierarquias implementadas, não cria uma nova escala de tokens.
As equivalências em pixels consideram tamanho raiz de 16 px; a interface deve
continuar respeitando as preferências de tamanho de texto do navegador.

| Papel | Tratamento observado | Uso |
| --- | --- | --- |
| Título de módulo | 30 px, seminegrito, letras ligeiramente aproximadas | Principal referência de orientação da página em `ModuleHero`. |
| Categoria do módulo | 12 px, seminegrito, maiúsculas e letras espaçadas | Identificação contextual acima do título; não se aplica a todos os rótulos. |
| Título de seção | 16 px, peso médio | Cabeçalho de cartões e painéis operacionais. |
| Valor de KPI | 24 px, seminegrito, letras ligeiramente aproximadas | Número principal no cartão operacional padrão; frações e scores classificados usam 30 px e composições próprias. |
| Rótulo de KPI | 14 px, peso médio | Nome da métrica, com espaço reservado para rótulos de alturas diferentes. |
| Texto de leitura | 14 px | Descrições, linhas de tabela e conteúdo de painéis. |
| Contexto e variação | 12 px, geralmente em cinza secundário | Comparação, período e qualificação subordinados ao valor. |
| Campos de texto | 16 px em telas estreitas e 14 px a partir do tamanho médio | Legibilidade de entrada no componente `Input`. |
| Eixos de gráfico | 12 px, cinza secundário | Referência numérica sem competir com os dados. |
| Badge | 12 px, peso médio | Classificação curta e legível. |

`MetricCard` mantém uma composição distinta, com rótulo de 12 px em maiúsculas,
espaçamento de 0,16 em entre letras e valor de 24 px. Esse tratamento não deve
substituir o padrão de `OperationalKpiCard` em novas composições operacionais.

Em scores classificados, o valor e o denominador têm pesos visuais diferentes,
com classificação textual explícita. Nas comparações tabulares e indicadores
que já adotam algarismos de largura uniforme, preservar o alinhamento numérico.
Valores ausentes usam travessão, sem acrescentar unidades a um valor inexistente.

Textos longos devem quebrar de maneira legível. Truncamento é apropriado quando
a composição mantém uma forma de ler o conteúdo completo; não omitir a
informação necessária à decisão apenas para igualar a altura dos cartões.

## 4. Component Stylings

### Botões e ações

Botões têm contorno fortemente arredondado, próximo a uma cápsula, com raio de
26 px no tamanho padrão. O botão primário combina fundo azul e texto claro;
a interação reduz a opacidade do fundo. A altura padrão é 36 px, com margem
interna horizontal de 12 px. Os tamanhos compacto e amplo têm 32 e 40 px de
altura; o tamanho extra compacto tem 24 px.

As alternativas secundária, com contorno, discreta e em formato de link oferecem
pesos visuais menores. A ação destrutiva usa vermelho sobre fundo vermelho
translúcido. A variante primária identifica a ação principal do contexto,
conforme a documentação de `Button`.

O foco visível usa borda e anel de 3 px com a cor de foco a 30%. O estado
desabilitado reduz a opacidade à metade e bloqueia a interação. O botão pode
deslocar-se 1 px para baixo ao ser pressionado, exceto no tratamento destinado
a controles com popup. Ações apenas com ícone precisam de nome acessível.

### Cartões, superfícies e profundidade

O catálogo `Decisions/Cards` distingue as funções abaixo. Uma nova composição
deve escolher o cartão pelo conteúdo e pela tarefa, preservando seu tratamento.

| Componente de referência | Forma e profundidade | Finalidade |
| --- | --- | --- |
| `Card` | Cantos amplos de 26 px, sombra moderada e anel sutil; espaçamento interno de 24 px ou 16 px na versão compacta. | Conteúdo geral, formulários e configurações. |
| `OperationalSectionCard` | Cantos de 18 px, borda fina, superfície de cartão e ausência de sombra; margens internas de 16 px. | Seção de leitura operacional, com título, ícone e ação contextual quando necessários. |
| `OperationalKpiCard` | Mesma superfície compacta e plana, com valor dominante. | Métrica, fração, score, tendência ou progresso publicado. |
| `ModuleHero` | Cantos de 22 px, borda fina, sem sombra e margem interna de 24 px. | Categoria, título, descrição e atualização ou ação do módulo. |
| `RecommendationCard` | Superfície operacional plana, com badges, evidência e ação opcional. | Orientar uma próxima ação com seu contexto. |
| `InlineDetailPanel` | Cantos de 18 px, borda fina e fundo neutro a 30%, sem sombra. | Detalhar um item sem retirar a pessoa da lista ou análise. |
| `DataAvailabilityPanel` | Cantos de 18 px, borda tracejada, fundo neutro a 20% e sem sombra. | Explicar restrição, indisponibilidade ou capacidade futura. |

Os raios derivam de uma base de 10 px. A escala observada é de 6, 8, 10, 14,
18, 22 e 26 px, respectivamente para os nomes de tamanho pequeno, médio,
grande, extra grande, duplo, triplo e quádruplo do tema. Barras de progresso e
anéis usam formas contínuas e extremidades arredondadas.

Painéis operacionais se separam por bordas, alinhamento e respiro. A sombra do
cartão básico não deve ser propagada a todos os painéis. Elementos sobrepostos,
como tooltips de gráficos, conservam profundidade própria: cantos de 16 px,
borda de 1 px e sombra difusa de 0 por 10 px, com desfoque de 30 px e azul
escuro a 12% de opacidade.

### Indicadores e classificações

O KPI operacional começa pelo rótulo e, quando presente, um ícone contextual
pequeno de 16 px. O cabeçalho reserva ao menos 40 px para alinhar métricas com
nomes de comprimentos diferentes. O valor tem maior peso; contexto, variação e
qualificação ficam subordinados a ele. Uma fonte técnica não ocupa o corpo do
indicador por padrão.

As composições documentadas incluem valor simples, fração, score radial fechado,
score classificado, minissérie e barra de progresso. O semicírculo permanece
identificado no catálogo como variante legada. Escolher a representação de
acordo com a métrica; não tratar um medidor como decoração nem inventar um
denominador para preencher um anel.

Classificações agrupadas usam ícone, valor e texto de classificação, mantendo
todos os itens visíveis em uma grade que se adapta à largura disponível.
Minisséries precisam de alternativa textual e série comparável; progresso e
capacidade dependem de valores e limites factuais. O domínio fornece os fatos,
a classificação e a ordem de leitura.

### Campos, formulários e filtros

Campos de texto têm cantos suaves de 22 px, altura de 36 px, preenchimento
horizontal de 12 px e fundo de entrada a 50%. A borda inicial é transparente;
o foco revela borda e anel, enquanto erro usa contorno e anel destrutivos.
O estado desabilitado reduz a opacidade e impede a edição.

Manter rótulos visíveis e associados aos controles. Erros de campo aparecem
próximos ao campo; falhas de submissão podem receber um resumo com orientação.
Mensagens transitórias de confirmação usam o padrão de notificação do catálogo;
avisos que precisam permanecer disponíveis usam alertas contextuais.

A barra de filtros organiza controles em uma grade com intervalos de 12 px.
Sua composição padrão passa para duas colunas em telas médias e quatro em
telas amplas; cenários específicos podem declarar outras quantidades. A ação
de limpar é identificável e restaura o recorte definido pela superfície.
Não converter os filtros de uma story em filtros obrigatórios de todo módulo.

### Navegação, shell e detalhe contextual

A navegação lateral estabelece orientação persistente. No desktop, sua largura
de referência é 312 px; recolhida em ícones, 48 px. Em telas móveis, ela passa
a um painel sobreposto com largura declarada de 320 px, sujeito ao espaço
disponível. A transição de largura observada dura 200 ms.

As abas de módulo aparecem em uma faixa horizontal com contorno inferior.
A página ativa recebe fundo azul, texto claro e cantos de 14 px; os demais
itens usam texto secundário e fundo neutro na interação. Quando a faixa excede
a largura disponível, a composição documentada permite rolagem e controles
direcionais, preservando o item ativo visível.

A aparência de links do catálogo não altera o mecanismo de navegação da
aplicação. Navegação interna preserva os contratos de Inertia e o estado da
superfície. Painéis de detalhe conservam o contexto da lista e apresentam
fechamento quando o fluxo permitir; dialogs ficam reservados a confirmação ou
tarefa focada, conforme a documentação do catálogo.

### Tabelas operacionais

Tabelas mantêm cabeçalho discreto, divisores finos e texto de leitura compacto.
Seu contêiner independente oferece superfície própria; a composição incorporada
ao cartão evita uma segunda moldura. A composição de resumo investigativo
também é documentada no catálogo e preserva a hierarquia da seção que a contém.

Tabelas largas têm região de rolagem horizontal nomeada e acessível por teclado,
legenda e orientação visível quando necessária. Não reduzir todas as colunas
até tornar números e rótulos ilegíveis. A paginação apresenta total, tipo de
item e página atual, com ações **Anterior** e **Próxima** visíveis e
desabilitadas nos limites. A story de foco documenta o retorno à legenda após
a troca de página.

### Gráficos e leitura analítica

`ChartPanel` reúne linhas, barras, combinações, donuts, medidores e radar.
`RadarPanel` também existe como componente específico. Usar essas composições
para preservar títulos, eixos, legendas, tooltips e alternativas textuais;
evitar criar um contêiner concorrente em uma página.

Gráficos independentes usam a superfície operacional plana; gráficos
incorporados compartilham a seção existente. Eixos e grades são discretos,
com rótulos secundários de 12 px. Dados, unidades, período e legendas devem
descrever o mesmo conjunto. Quando há duas unidades, eixos e descrições
preservam essa distinção. Séries temporais seguem a ordem cronológica.

Donuts oferecem duas composições: legenda lateral ou abaixo do gráfico.
A lateral é tabular e pode empilhar quando o próprio cartão não oferece
largura suficiente, a partir dos limites de 21 e 26 rem documentados no
componente. A opção empilhada mantém a legenda abaixo também no desktop.
Esses limites pertencem ao contêiner, não à largura total da janela.

O radar específico usa a segunda cor de série com preenchimento a 24%.
Nenhuma representação deve aumentar um zero factual para produzir área visível.
Alternativas textuais explicam categorias, valores e séries sem depender
exclusivamente da percepção de cor.

### Feedback e disponibilidade

| Situação | Comunicação visual e conteúdo |
| --- | --- |
| Carregamento | Estrutura neutra de carregamento, sem números ou tendências que pareçam publicados. |
| Zero factual | Número zero com sua unidade e contexto válidos. |
| Consulta válida sem resultados | Mensagem de ausência de resultados no recorte, preservando filtros e possibilidade de ajuste. |
| Não publicado ou não coletado | Ausência explícita e motivo aplicável; um valor inexistente não recebe unidade nem classificação presumida. |
| Indisponível ou restrito | Painel neutro com motivo e ícone contextual; restrição de acesso permanece distinta de ausência da fonte. |
| Cobertura parcial | Aviso de limitação junto ao resultado aproveitável; não apresentar a parcela observada como total completo. |
| Dados desatualizados | Indicar a atualidade e preservar a última publicação factual quando o contrato permitir. |
| Falha | Mensagem de erro com motivo seguro e ação permitida pelo fluxo, sem substituir a falha por resultado vazio. |
| Capacidade futura | Identificação explícita de disponibilidade futura; não simular uma integração em funcionamento. |

`DataAvailabilityPanel` cobre diretamente restrição, indisponibilidade e
capacidade futura. Os demais estados exigem a composição apropriada ao contrato
da superfície. A implementação de disponibilidade do OneDrive complementa o
catálogo com avisos de cobertura parcial, desatualização e falha.

Os desenhos neutros de barras, linha, donut ou medidor em painéis indisponíveis
servem apenas para preservar a anatomia visual. Não representam métricas,
percentuais ou tendências observadas. Razão, cobertura e atualidade permanecem
em texto legível e na região de contexto correspondente.

## 5. Layout Principles

### Ritmo, alinhamento e largura

A estrutura de página `PageScaffold` usa margens internas de 16 px, ampliadas
para 24 px a partir das telas médias, e separação vertical de 24 px. Painéis de
subabas operacionais usam 16 px entre faixas irmãs. Dentro de grades de KPIs e
seções, 16 px é um intervalo recorrente; filtros usam 12 px. Esses valores
descrevem responsabilidades diferentes, não uma margem única para toda a tela.

O shell com navegação lateral permite ao conteúdo ocupar a largura restante e
encolher junto à navegação. O limite de 80 rem do layout com cabeçalho não é
um teto universal para os dashboards com sidebar. Conteúdo largo permanece
contido em sua própria região; uma tabela não deve alargar o shell.

O catálogo também demonstra páginas com margens de 24 px, ampliadas para
32 px em telas grandes. O cenário analítico do OneDrive usa 16 px nas telas
estreitas e 32 px nas grandes. Preservar a composição declarada pela superfície,
sem normalizar essas variações silenciosamente.

Cartões irmãos ocupam a mesma altura quando a composição assim define.
Cabeçalhos, valores e rodapés mantêm alinhamento sem inserir conteúdo fictício.
A estrutura de disponibilidade conserva os espaços e a posição dos painéis
previstos no contrato da tela.

### Ordem de leitura e responsividade

Uma composição operacional pode reunir cabeçalho e navegação, indicadores,
filtros, análises, resultados e detalhe contextual. A ordem e os elementos
obrigatórios vêm do contrato da superfície; os exemplos do catálogo demonstram
como organizar essas regiões.

A grade padrão de indicadores começa em uma coluna, passa a duas em telas
pequenas, quatro em telas grandes e seis em telas extra grandes. O dashboard
analítico demonstra uma variação de oito indicadores na largura máxima. Grades
de análise podem usar doze colunas para distribuir larguras desiguais, voltando
a uma sequência vertical em telas estreitas.

As referências de tamanho usadas nessas composições correspondem a 640, 768,
1024, 1280 e 1536 px. O tratamento móvel da sidebar usa o limite de 768 px.
Esses valores registram o comportamento atual; não substituem as regras de
largura específicas de cada componente.

No cenário de auditoria, os indicadores são um snapshot independente dos
filtros abaixo deles; análises e tabela compartilham o recorte filtrado.
Essa independência é declarada pela story e não deve ser generalizada a todos
os dashboards. Toda região que afirma representar um filtro precisa refletir
esse filtro, inclusive totais e exportações quando existirem.

### Acessibilidade como parte da composição

- Preservar foco visível, ordem de navegação coerente e controles operáveis por
  teclado; regiões roláveis precisam de nome acessível.
- Identificar campos, ações e classificações por texto. Ícones decorativos não
  substituem rótulos; botões apenas com ícone têm nome acessível próprio.
- Associar títulos, descrições, abas e painéis com identificadores únicos e
  referências que correspondam a elementos realmente presentes.
- Manter alternativas textuais para gráficos, unidades legíveis e avisos de
  estado compreensíveis sem depender de cores ou animações.
- Conferir contraste, foco, conteúdo longo e reorganização nos dois temas e
  nas larguras relevantes. A configuração atual de acessibilidade do Storybook
  registra problemas como pendências; não comprova conformidade por si só.

### Divergências e lacunas a acompanhar

| Tema | Evidência e referência adotada |
| --- | --- |
| Cores de status | O catálogo declara cores semânticas próprias para sucesso, atenção e crítico. A aplicação ainda usa verdes e âmbares literais em partes do helper de status e não declara os mesmos tokens no CSS. A referência deste documento é a do catálogo; alinhar o código exige entrega própria. |
| Família tipográfica | Ambos os estilos preservam uma declaração anterior de Instrument Sans e uma declaração final de DM Sans. Foundations e o tema final sustentam DM Sans como referência; a declaração residual deve ser reconciliada. |
| Texto e localização | Há mensagens em inglês no catálogo, como o fechamento de dialog e a ausência de métricas, enquanto a aplicação usa português. Essa diferença textual não estabelece uma nova regra visual; este guia usa português e preserva os contratos de localização da aplicação. |
| Navegação e integrações | O catálogo usa links e callbacks de demonstração. A aplicação conserva navegação interna, autorização e acesso a dados reais definidos em seus contratos. |
| Catálogo e padrões antigos | O inventário anterior citava componentes de metadados e atualidade sem arquivos correspondentes na árvore atual. Registrar o papel de fonte e atualidade sem presumir que esses componentes existem. |
| Tipografia e espaçamento | Há uma hierarquia e intervalos recorrentes verificáveis, mas não uma escala semântica completa aprovada para todo contexto. As tabelas acima registram o que existe. |
| Marca, ilustração e movimento | Não há nas fontes consultadas um guia completo para expressão de marca, ilustrações, motion ou comportamento de movimento reduzido. As transições locais não constituem uma política global. |
| Acessibilidade e toque | As fontes não demonstram uma homologação global de contraste, leitor de tela ou uma política única de áreas mínimas de toque. Não interpretar as medidas compactas como prova de acessibilidade. |

Este documento consolida a direção visual de referência. Sua existência não
significa que todas as telas da aplicação já foram reconciliadas com o catálogo.
