# Feature Specification: Módulo Secure Score

**Feature Branch**: `feat/009-secure-score-module`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "Planejar o módulo Microsoft 365 Secure Score a partir do discovery homologado, com disponibilidade dinâmica por tenant e superfícies de leitura."

## Clarifications

### Session 2026-08-14

- Q: Qual retenção deve valer para as fotografias de score e o Histórico Observado V2? → A: Reter até política corporativa aprovada, sem promessa de prazo no V2 (consenso: Sponsor e responsável pela Spec; origem: DOCX e discovery).
- Q: Como tratar mudança de perfil ao comparar snapshots históricos? → A: Vincular uma versão imutável de perfil a cada publicação e comparar somente atributos persistidos nas duas gerações (consenso: Tech Lead e responsável pela Spec; origem: contratos e modelo conceitual do discovery).
- Q: Como apresentar comparativos quando há média publicada, mas não há meta interna? → A: Mostrar somente Você e Média nos componentes comparativos; omitir Meta com indicação de capacidade futura, mantendo projeções e componentes dependentes de meta como `coming_soon` (consenso: QA e responsável pela Spec; origem: representação estrutural e limites V2 do discovery).

### Session 2026-08-16

- Q: Qual objetivo deve aparecer enquanto não houver configuração operacional de metas? → A: Persistir por tenant uma meta interna padrão de 80%, identificada como configuração de produto; esta entrega não inclui interface de edição, escrita no tenant Microsoft nem previsão de atingimento (decisão do responsável pelo produto no alinhamento de implementação).
- Q: O comparativo por categoria exige outra coleta? → A: Não. Reutilizar as categorias de `averageComparativeScores` já preservadas na fotografia canônica, somente quando média, máximo e categoria local forem compatíveis (decisão do responsável pelo produto no alinhamento de implementação).

## User Scenarios & Testing *(mandatory)*

Referência estrutural comum: [Representação estrutural das telas — Secure Score](../../discovery/microsoft-365/v2/secure-score/representacao-estrutural-das-telas.md). Todo usuário autenticado pertence à mesma audiência confiável e vê a mesma capacidade.

### User Story 1 - Consultar Dashboard Executivo (Priority: P1)

Como gestor, quero entender a postura atual e as principais oportunidades em uma visão consolidada, para decidir onde investigar primeiro.

**Cards implementados**: “Secure Score Atual”, “Pontos Conquistados”, “Pontos Disponíveis”, “Ações de Melhoria”, “Ganho Potencial”, “Meta de Secure Score”, “Evolução do Secure Score (últimos 90 dias)”, “Distribuição por Categoria”, “Ações por Prioridade”, “Principais Oportunidades (por ganho potencial)”, “Principais Riscos”, “Status do Plano de Remediação”, “Informações do Ambiente”, “Comparativo com outros tenants” e “Insights Inteligentes”.

**Why this priority**: É a entrada principal para compreensão da postura e precisa entregar valor mesmo quando fontes correlatas ou recursos internos ainda não estiverem disponíveis.

**Independent Test**: Publicar uma fotografia de score e verificar que o usuário compreende pontuação, frescor, categorias e oportunidades, com estados explícitos nos demais cards.

**Acceptance Scenarios**:

1. **Given** uma fotografia de score publicada, **When** o gestor abre o Dashboard Executivo, **Then** vê pontuação atual, máxima, percentual, classificação, variação disponível e frescor sem números ilustrativos.
2. **Given** uma fonte correlata indisponível para o tenant, **When** o card dependente é apresentado, **Then** ele informa disponibilidade, cobertura, frescor e motivo, sem exibir zero como dado real.
3. **Given** uma execução autorizada em outro tenant publica a fonte antes restrita, **When** o Dashboard é atualizado, **Then** os cards correspondentes passam a disponíveis sem configuração manual da interface.

---

### User Story 2 - Comparar Pontuação por Categoria (Priority: P1)

Como gestor, quero comparar categorias e a distribuição de progresso dos controles, para localizar lacunas de segurança e oportunidades de ganho.

**Cards implementados**: “Secure Score Geral”, “Pontos Conquistados”, “Pontos Disponíveis”, “Ações de Melhoria”, “Ganho Potencial”, “Pontuação por Categoria”, “Distribuição dos Controles por Status”, “Comparativo por Categoria (vs. média de todos os tenants)”, “Evolução por Categoria (últimos 90 dias)” e “Top 5 Categorias com Maior Ganho Potencial”.

**Why this priority**: A visão por categoria traduz o score consolidado em prioridades compreensíveis e pode funcionar inteiramente em leitura.

**Independent Test**: Publicar score e catálogo de controles associados e validar percentuais, ganhos e grupos concluído/parcial/pendente por categoria.

**Acceptance Scenarios**:

1. **Given** controles associados com pontuação atual e máxima, **When** o gestor consulta uma categoria, **Then** vê pontos atuais, máximos, disponíveis e percentual calculados apenas a partir dos controles da categoria.
2. **Given** um controle associado com pontuação igual ao máximo, parcial ou zero, **When** a distribuição é exibida, **Then** ele é classificado respectivamente como concluído, parcial ou pendente.
3. **Given** máximo inválido, valor ausente ou controle sem associação ao perfil, **When** a distribuição é exibida, **Then** o controle não recebe classificação e a cobertura informa a exclusão.

---

### User Story 3 - Priorizar Ações de Melhoria (Priority: P1)

Como gestor, quero filtrar e ordenar recomendações de melhoria, para priorizar controles com maior ganho e contexto de risco.

**Cards implementados**: “Ações de Melhoria”, “Pontos Disponíveis”, “Ganho Potencial por Prioridade”, “Ações Rápidas”, “Top Ameaças Mitigadas”, “Distribuição por Status Orkestria”, “Distribuição por Esforço”, “Ações com Maior Ganho Potencial” e “Ações Vencidas ou Próximas do Prazo”.

**Why this priority**: O catálogo enriquecido permite priorização prática sem executar alterações no tenant.

**Independent Test**: Publicar score e perfis associados, aplicar filtros e confirmar que a lista apresenta apenas dados e cobertura publicados.

**Acceptance Scenarios**:

1. **Given** controles e perfis publicados, **When** o gestor filtra por categoria, serviço, status Microsoft, esforço ou impacto, **Then** a lista e os resumos refletem o mesmo conjunto filtrado.
2. **Given** uma recomendação com pontos atuais abaixo dos máximos, **When** o ganho potencial é apresentado, **Then** ele corresponde à diferença disponível e não fica negativo.
3. **Given** dados próprios de prazo, responsável ou status operacional ainda não existem, **When** esses campos são visualizados, **Then** são apresentados como capacidade futura, sem valor inventado.

---

### User Story 4 - Consultar Plano de Remediação Futuro (Priority: P2)

Como gestor, quero reconhecer a estrutura planejada do plano de remediação, para entender quais capacidades dependerão de gestão interna futura.

**Cards implementados**: “Pontos Disponíveis”, “Ações Abertas”, “Em Execução”, “Concluídas”, “Ações Vencidas”, “Ganho Potencial”, “Resumo do Plano”, “Evolução do Secure Score”, “Projeção para a Meta”, “Plano Kanban”, “Top Ações por Ganho Potencial”, “Ganhos por Período (Projeção)” e “Insights do Plano”.

**Why this priority**: Preserva a navegação e comunica claramente o limite da versão, sem simular um workflow inexistente.

**Independent Test**: Abrir cada aba do plano e verificar que a capacidade futura é visível, não executável e explica sua condição de habilitação.

**Acceptance Scenarios**:

1. **Given** o usuário navega para Plano de Remediação, **When** consulta qualquer visão de gestão, **Then** ela é identificada como `coming_soon` e não permite criar, mover ou alterar ações.
2. **Given** não existe seleção de ações ou meta publicada, **When** a projeção é mostrada, **Then** ela informa indisponibilidade em vez de estimar resultado.

---

### User Story 5 - Consultar Comparativos e Metas (Priority: P2)

Como gestor, quero contextualizar o score contra referências disponíveis e uma meta interna configurada, para distinguir dados comparativos publicados de objetivo operacional do produto.

**Cards implementados**: “Secure Score Atual”, “Sua Posição (Todos os tenants)”, “Média (Todos os tenants)”, “Sua Meta Geral”, “Projeção para atingir a meta”, “Comparativo por Categoria”, “Radar de Comparação”, “Evolução vs. Meta (Geral)”, “Progresso das Metas por Categoria”, “Ganho Necessário por Categoria”, “Insights de Comparação”, “Referências dos Comparativos” e “Metas Configuradas”.

**Why this priority**: Evita que médias ausentes ou metas ainda não criadas pareçam dados reais.

**Independent Test**: Publicar uma comparação disponível e verificar sua apresentação; repetir sem comparação e confirmar o estado indisponível.

**Acceptance Scenarios**:

1. **Given** uma média comparativa publicada, **When** o gestor abre a visão, **Then** vê a comparação apenas nos cards e categorias cobertos pela referência.
2. **Given** a média comparativa ausente ou igual a zero, **When** a visão é exibida, **Then** a comparação é indisponível e não é substituída por valor calculado.
3. **Given** o tenant ainda não possui configuração própria, **When** o gestor consulta a meta, **Then** vê o padrão interno persistido de 80%, a distância factual até ele e nenhuma previsão de atingimento.
4. **Given** uma média comparativa publicada, **When** o gestor consulta tabela, cards ou radar de comparação, **Then** vê Você, Média e Meta interna; componentes de projeção continuam `coming_soon` sem uma regra preditiva publicada.

---

### User Story 6 - Analisar Evolução e Tendências (Priority: P1)

Como gestor, quero analisar a evolução temporal do score e de categorias, para identificar alterações observadas sem atribuir causalidade indevida.

**Cards implementados**: “Secure Score Atual”, “Variação (7 dias)”, “Maior Score (período)”, “Menor Score (período)”, “Média (período)”, “Tendência Geral (30 dias)”, “Evolução do Secure Score”, “Eventos que impactaram o Score”, “Evolução por Categoria (últimos 90 dias)”, “Variação Mensal do Score”, “Score Máximo e Controles”, “Distribuição do Score (último dia)”, “Insights e Tendências”, “Previsão de Atingimento da Meta” e “Alertas de Regressão”.

**Why this priority**: A tendência é viável com fotografias publicadas e transforma mudanças diárias em investigação orientada.

**Independent Test**: Publicar dois snapshots comparáveis e confirmar séries e variações; repetir com uma única fotografia e confirmar o estado sem base comparável.

**Acceptance Scenarios**:

1. **Given** duas fotografias comparáveis, **When** o gestor seleciona um período, **Then** vê séries, variações e alterações observadas dentro da cobertura publicada.
2. **Given** somente uma fotografia publicada, **When** a comparação temporal é solicitada, **Then** a interface mostra ausência de base comparável, sem zero ou causa inferida.
3. **Given** uma diferença entre fotografias, **When** ela aparece na análise, **Then** é rotulada como alteração observada e não como ação, causa ou autoria confirmada.

---

### User Story 7 - Consultar Controles Aceitos e Exceções Futuras (Priority: P2)

Como gestor, quero visualizar a superfície de exceções e seus limites, para saber que aceite, aprovação e revisão ainda dependem de workflow interno.

**Cards implementados**: “Total de Controles com Exceção”, “Pontos Impactados”, “Risco Aceito”, “Mitigado por Terceiro”, “Não Aplicável”, “Em Revisão”, “Controles Aceitos e Exceções”, “Detalhes da Exceção”, “Distribuição por Tipo de Exceção”, “Pontos Impactados ao Longo do Tempo”, “Situação das Revisões”, “Pontos por Categoria”, “Importante”, “Atenção” e “Recomendação”.

**Why this priority**: A superfície deve ser transparente quanto ao que ainda não pode ser governado pelo produto.

**Independent Test**: Navegar até a tela e confirmar que dados de controle publicados podem ser contextualizados, mas nenhum fluxo de exceção é executado.

**Acceptance Scenarios**:

1. **Given** controles publicados, **When** o gestor acessa a superfície, **Then** vê a disponibilidade dinâmica dos dados de controle e os limites da capacidade interna.
2. **Given** o gestor tenta editar, encerrar, aprovar ou anexar uma exceção, **When** seleciona a ação, **Then** ela permanece desabilitada como `coming_soon` e não produz alteração.

---

### User Story 8 - Consultar Histórico Observado e Auditoria Futura (Priority: P1)

Como gestor, quero consultar coletas e alterações observadas, para investigar diferenças de score sem confundir dados técnicos com auditoria operacional.

**Cards implementados**: “Total de Eventos”, “Eventos Microsoft”, “Eventos Orkestria”, “Pontuação Alterada”, “Controles Afetados”, “Usuários Envolvidos”, “Eventos por Tipo”, “Eventos ao Longo do Tempo”, “Eventos por Origem”, “Detalhes do Evento”, “Histórico de Eventos”, “Exportação e Auditoria”, “Conformidade e LGPD” e “Dica”.

**Why this priority**: Gera rastreabilidade útil já no V2, mantendo explícito que autoria e causa não são conhecidas.

**Independent Test**: Publicar uma coleta e, depois, dois snapshots comparáveis; verificar a transição de coletas disponíveis para diferenças observadas e comparativo antes/depois.

**Acceptance Scenarios**:

1. **Given** a primeira coleta autorizada publicada, **When** o gestor abre Histórico e Auditoria, **Then** vê coletas do Orkestria e seus estados, mesmo sem diferença de score disponível.
2. **Given** duas fotografias comparáveis, **When** o gestor consulta o histórico, **Then** vê alterações observadas no Microsoft Graph e o comparativo antes/depois somente para atributos persistidos nas duas publicações.
3. **Given** uma fotografia ou campo sem base comparável, **When** o detalhe é exibido, **Then** apresenta “sem base comparável” ou “não coletado”, sem zero, usuário, IP, justificativa ou causa inventados.
4. **Given** o gestor abre um detalhe por teclado, **When** usa Enter ou Espaço em uma linha, **Then** o detalhe recebe foco; Esc o fecha e devolve foco à linha acionadora.

### Edge Cases

- Fonte autorizada retorna coleção vazia válida: a superfície permanece disponível, com cobertura zero explícita.
- Fonte falha após publicação anterior: a última geração continua visível como defasada, com motivo e frescor.
- Uma associação entre controle e perfil está ausente ou ambígua: o item não é enriquecido nem classificado; a cobertura é reduzida e a condição é exposta.
- Fotografia atual e catálogo divergem em categoria ou máximo: não são usados para fabricar ganho, status ou passado histórico.
- A versão de perfil de uma publicação não está disponível: diferenças de máximo, categoria, depreciação e demais metadados do perfil ficam indisponíveis ou defasadas; o catálogo atual nunca substitui retroativamente a versão ausente.
- Dados correlatos de dispositivos ou máquinas não podem ser coletados no tenant: riscos relacionados permanecem restritos apenas naquela publicação.
- Primeira tentativa de uma fonte falha sem fotografia anterior: a fonte fica `unavailable`, mostra motivo sanitizado e não apresenta vazio/zero; durante troca de filtro ou navegação, o carregamento não limpa a última publicação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O módulo DEVE manter as oito superfícies na ordem definida: Dashboard Executivo, Pontuação por Categoria, Ações de Melhoria, Plano de Remediação, Comparativos e Metas, Evolução e Tendências, Controles Aceitos e Exceções e Histórico e Auditoria.
- **FR-002**: O módulo DEVE exibir somente dados publicados para o tenant atual, com disponibilidade, cobertura, frescor, motivo e estado de resultado quando aplicáveis.
- **FR-003**: O estado de uma fonte DEVE ser avaliado por tenant e execução publicada; uma execução autorizada e íntegra a torna disponível, e uma restrição de autorização, licença, produto ou granularidade a restringe apenas enquanto persistir.
- **FR-004**: Uma coleção vazia válida DEVE permanecer disponível e declarar cobertura zero; ela nunca DEVE ser apresentada como erro ou como métrica de segurança igual a zero.
- **FR-005**: Em falha posterior a uma publicação válida, o módulo DEVE preservar a última geração visível e indicar que está defasada, com motivo e frescor.
- **FR-006**: O Dashboard Executivo DEVE apresentar score atual, pontos atuais/máximos/disponíveis e cartões dependentes de fontes correlatas sem preencher ausências com dados ilustrativos.
- **FR-007**: Pontuação por Categoria DEVE calcular pontos atuais, máximos, disponíveis e percentual por categoria somente a partir de controles cobertos.
- **FR-008**: Para um controle associado com pontuação atual e máxima válidas, a distribuição de progresso DEVE classificá-lo como concluído quando atingir o máximo, parcial quando estiver entre zero e máximo, e pendente quando for zero; controles sem dados ou associação suficientes DEVEM reduzir cobertura.
- **FR-009**: O status fornecido pela Microsoft DEVE ser exibido como informação de contexto e não DEVE substituir a classificação de progresso calculada.
- **FR-010**: Ações de Melhoria DEVE permitir filtrar recomendações publicadas e apresentar ganho potencial sem valores negativos; dados internos não publicados DEVEM permanecer claramente indisponíveis ou futuros.
- **FR-010b**: A prioridade publicada DEVE usar o score composto homologado: risco 35%, ganho 25%, ranking Microsoft 15%, facilidade 10%, vencimento 10% e dependência regulatória 5%; aplicar as normalizações, conjunto remediável, ausências, desempate e a guarda visível de impacto definidos no discovery, sem inventar dados operacionais ausentes.
- **FR-010d**: O score composto de prioridade DEVE ser classificado de modo centralizado como Crítica `85,0–100,0`, Alta `70,0–<85,0`, Média `50,0–<70,0` e Baixa `0,0–<50,0`; filtro, tabela, rankings, donut e barras devem reutilizar essa classificação. A elevação automática por sinais correlatos permanece fora de escopo até esses sinais serem publicados.
- **FR-010a**: Quando houver média comparativa publicada, os componentes comparativos DEVEM mostrar Você, Média e a Meta interna aplicável; ausência de média continua indisponibilidade factual e não autoriza referência calculada.
- **FR-010c**: O módulo DEVE manter uma meta interna por tenant, com padrão persistido de 80%, valor limitado de 0 a 100 e origem `product_default` ou `configured`; sua leitura não executa escrita no tenant Microsoft. A distância até a meta é factual; projeções dependentes de série, plano ou regra preditiva permanecem `coming_soon`.
- **FR-011**: Evolução e Tendências DEVE mostrar séries e diferenças apenas dentro da cobertura de snapshots comparáveis e rotular diferenças como observadas, sem atribuir causa, usuário ou ação.
- **FR-011a**: “Alertas de Regressão” NÃO DEVE criar alerta automático, crítico ou classificação causal nesta versão; quando não houver base comparável, deve mostrar `— vs. período anterior`.
- **FR-012**: Histórico e Auditoria DEVE disponibilizar coletas desde a primeira publicação autorizada; diferenças e comparativo antes/depois DEVEM exigir duas gerações comparáveis.
- **FR-013**: O Histórico Observado DEVE identificar visualmente “Alterações observadas no Microsoft Graph” e “Coletas do Orkestria”, informar que diferenças não identificam causa ou autor e apresentar usuário como não disponível nessa modalidade.
- **FR-014**: O comparativo antes/depois DEVE limitar-se aos atributos persistidos nas duas publicações e indicar campos ausentes como não coletados.
- **FR-014a**: Cada fotografia publicada DEVE referenciar a versão imutável do perfil usada em sua projeção; diferenças de máximo, categoria, depreciação e metadados de perfil DEVEM usar somente versões presentes nas duas fotografias comparadas.
- **FR-014b**: Cada fotografia de score DEVE preservar o identificador do Secure Score no Graph como chave natural única por tenant; retries ou reexecuções da mesma janela DEVEM atualizar/deduplicar a fotografia sem criar série, diferença observada ou evento adicional.
- **FR-015**: Plano de Remediação, gestão editável de metas, operações de exceção e Auditoria Operacional DEVEM permanecer visíveis como `coming_soon`, sem executar criação, aprovação, edição, encerramento, anexação ou alteração no tenant.
- **FR-015a**: “Exportação e Auditoria” DEVE permanecer `unavailable` até contrato de privacidade aprovado, sem exportar dados.
- **FR-016**: Fontes correlatas devem reutilizar projeções canônicas quando existentes (incluindo MFA); fontes homologadas ainda sem projeção — SharePoint/OneDrive, Exchange, Intune e Defender — DEVEM ter coleta independente no ciclo coordenado, estado publicado por execução e promoção automática após coleta autorizada.
- **FR-016a**: A integração SharePoint prevista para riscos correlatos DEVE permanecer somente leitura, aplicar allow-list de `GET` antes da requisição e bloquear `POST`, `PUT`, `PATCH` e `DELETE`.
- **FR-017**: Tabelas densas, filtros e painéis de detalhe DEVEM manter equivalência de informação e navegação por teclado em telas menores; detalhes acionáveis DEVEM devolver o foco ao item de origem quando fechados.
- **FR-017a**: Em móvel, as tabelas de Categoria, Ações, Comparativos, Exceções e Histórico DEVEM ter rolagem horizontal focável, cabeçalhos associados, foco visível e resumo textual antes da tabela; o detalhe do Histórico DEVE anunciar sua abertura/atualização a leitores de tela.

### Key Entities *(include if feature involves data)*

- **Publicação de fonte**: estado utilizável de uma coleta por tenant, incluindo disponibilidade, cobertura, frescor, motivo e resultado.
- **Fotografia de score**: registro temporal de pontuação, máximo, categorias, comparativos e controles cobertos em uma data.
- **Versão de perfil de controle**: descrição, máximo, categoria, depreciação e metadados de uma recomendação, imutáveis para a publicação à qual se associa.
- **Alteração observada**: diferença entre duas fotografias comparáveis, sem causa ou autoria atribuída.
- **Estágio de coleta**: resultado temporal de uma execução de coleta, disponível desde a primeira publicação.
- **Fonte correlata publicada**: fotografia independente de MFA, SharePoint/OneDrive, Exchange, Intune ou Defender, associada ao ciclo, à cobertura e aos limites próprios da fonte.
- **Meta interna de Secure Score**: configuração local por tenant, com valor percentual, origem e vigência; não é dado Graph nem altera a configuração Microsoft.
- **Capacidade operacional futura**: plano, meta, exceção ou auditoria operacional que aparece no produto mas não executa workflow nesta versão.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Com uma publicação íntegra de score, 100% dos cards que dependem exclusivamente dessa publicação exibem valor ou estado explícito de cobertura, sem valores ilustrativos.
- **SC-002**: Com controles associados e dados válidos, 100% deles são classificados em concluído, parcial ou pendente; itens sem dados suficientes ficam fora da distribuição e são contabilizados na cobertura.
- **SC-003**: Após trocar para um tenant em que uma fonte antes restrita esteja autorizada, os blocos dependentes são apresentados como disponíveis na primeira publicação válida, sem alteração manual de configuração.
- **SC-004**: Com uma publicação, o usuário consegue consultar todos os estágios de coleta; com duas fotografias comparáveis, consegue identificar 100% das diferenças persistidas sem visualizar causa ou autoria inventadas.
- **SC-005**: Em verificação por teclado, 100% dos detalhes acionáveis do Histórico Observado podem ser abertos e fechados preservando contexto de foco.
- **SC-006**: Uma fonte com primeira tentativa falha apresenta `unavailable` e motivo sanitizado; uma falha ou restrição posterior preserva a última publicação como defasada e não a substitui por zero ou vazio.

## Assumptions

- O módulo atende uma única audiência autenticada, sem diferenciação de permissões dentro do produto.
- As fontes publicadas são atualizadas por uma coleta coordenada futura; nenhuma tela busca dados diretamente durante a navegação.
- A versão inicial é somente leitura e não altera configurações do tenant.
- O período inicialmente disponível depende da cobertura publicada. O V2 não promete prazo de retenção próprio: qualquer retenção além da janela fornecida pela fonte depende de política corporativa aprovada e de snapshots próprios.
- A meta interna padrão persistida está no escopo de leitura; sua gestão editável, plano de remediação, exceções, evidências e auditoria operacional permanecem fora do escopo funcional desta entrega.
