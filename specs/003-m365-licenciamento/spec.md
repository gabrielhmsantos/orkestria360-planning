# Feature Specification: Licenciamento Microsoft 365 V2

**Feature Branch**: `feat/003-m365-licenciamento`  
**Created**: 2026-07-27  
**Status**: Approved (sponsor)
**Input**: Planejamento e implementação do submódulo de Licenciamento Microsoft 365 baseado no discovery.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender a saúde técnica do licenciamento (Priority: P1)

Como administrador da Contoso Ltda., quero abrir o Dashboard Executivo de Licenciamento para entender rapidamente a capacidade, a utilização e as oportunidades técnicas que exigem investigação.

**Why this priority**: É a entrada mais curta para decidir se deve investigar inventário, consumo ou otimização.

**Independent Test**: Com uma fotografia técnica sincronizada, o administrador abre a página e identifica totais de assentos, utilização, disponibilidade, health score técnico, oportunidades explicáveis e o horário/estado da sincronização.

**Acceptance Scenarios**:

1. **Given** uma sincronização técnica recente, **When** o administrador abre o Dashboard Executivo, **Then** ele vê totais de licenças, utilizadas e disponíveis, tendências e oportunidades técnicas com evidência.
2. **Given** que não há dados comerciais, **When** o administrador consulta custo, economia ou vencimentos, **Then** a interface informa que os dados comerciais aguardam o Assessment, sem exibir zero ou estimativa.
3. **Given** uma sincronização atrasada, falha ou indisponível, **When** o administrador abre qualquer resumo técnico, **Then** ele vê a última coleta, a próxima execução esperada e o estado de frescor correspondente.

---

### User Story 2 - Investigar inventário e adoção (Priority: P1)

Como administrador, quero navegar por SKUs e uso agregado para compreender quais produtos existem, sua capacidade e se há evidência de adoção, sem expor dados nominais nesta V2.

**Why this priority**: A investigação operacional sustenta as decisões indicadas pelo dashboard e evita conclusões baseadas somente em agregados.

**Independent Test**: O administrador filtra produtos, consulta capacidade e consumo agregado por workload; o payload não contém pessoa, departamento, atribuição ou exportação.

**Acceptance Scenarios**:

1. **Given** SKUs sincronizados, **When** o administrador busca, ordena ou filtra o Inventário, **Then** a tabela retorna apenas produtos técnicos correspondentes, com capacidade e status.
2. **Given** um SKU com atribuições, **When** o administrador consulta o Inventário, **Then** vê somente a capacidade técnica agregada; detalhe de usuário, atribuição e exportação não são disponibilizados nesta V2.
3. **Given** um relatório de uso agregado ou indisponível, **When** o administrador abre Consumo, **Then** a interface declara `anonymized` ou `unavailable` e apresenta somente a granularidade permitida.

---

### User Story 3 - Avaliar oportunidades técnicas com segurança (Priority: P2)

Como administrador, quero consultar recomendações de otimização priorizadas e explicáveis para analisar ociosidade, contas bloqueadas licenciadas, erros de atribuição e possíveis realocações sem alterar o tenant.

**Why this priority**: Transforma a evidência de inventário e consumo em uma fila segura de análise, preservando limites do MVP.

**Independent Test**: Com uma oportunidade gerada por regra, o administrador vê tipo, prioridade, confiança, período, evidências e impedimentos; qualquer ação operacional é apresentada como indisponível.

**Acceptance Scenarios**:

1. **Given** uma regra com evidência suficiente, **When** o administrador abre Otimização, **Then** vê a oportunidade com regra, versão, período, confiança, prioridade e evidências.
2. **Given** ausência de preço comercial, **When** a oportunidade seria elegível a economia, **Then** o impacto monetário fica indisponível, sem valor fictício.
3. **Given** uma ação de remover, realocar, simular ou fazer downgrade, **When** o administrador tenta iniciá-la, **Then** recebe o estado “Em breve” e nenhuma solicitação ou alteração é criada.

---

### User Story 4 - Auditar evolução e planejar tecnicamente (Priority: P2)

Como administrador, quero consultar a evolução técnica de licenças e cenários consultivos para explicar mudanças e discutir capacidade futura sem prometer ações comerciais.

**Why this priority**: Fornece memória auditável e uma conversa de planejamento baseada em premissas, sem ampliar o MVP para fluxo comercial.

**Independent Test**: O administrador filtra eventos e snapshots por período, produto, origem e estado de confirmação, abre uma evidência e consulta cenários/roadmap técnicos que indiquem suas premissas. Filtros por pessoa e área permanecem apenas como superfícies `restricted` até existir relatório identificado e autorização de tenant aprovada.

**Acceptance Scenarios**:

1. **Given** snapshots diários e eventos técnicos, **When** o administrador filtra Histórico, **Then** vê uma linha do tempo e variações com origem Graph ou snapshot, sem inventar causa comercial.
2. **Given** uma variação de capacidade sem evidência explicativa, **When** ela é detectada, **Then** o Histórico a apresenta como atenção pendente de confirmação.
3. **Given** um cenário técnico, **When** o administrador o consulta em Planejamento, **Then** vê pressupostos, dependências, benefícios e limites de evidência, sem preço, prazo, compra ou provisionamento.
4. **Given** que o relatório está anonimizável ou a autorização nominal não existe, **When** o administrador encontra filtros ou histórico por pessoa/área, **Then** a interface informa que essa granularidade está restrita e não inclui pessoa, departamento ou atribuição no payload da V2.

---

### User Story 5 - Compreender limites comerciais da V2 (Priority: P3)

Como administrador, quero encontrar estados explícitos para custos, contratos, renovações e ações comerciais para não confundir ausência de dados com ausência de custo ou de necessidade de gestão.

**Why this priority**: Mantém a V2 confiável enquanto prepara o espaço correto para a futura entrada comercial.

**Independent Test**: Sem dados comerciais importados, o administrador abre Custos e superfícies comerciais relacionadas e recebe uma mensagem consistente de indisponibilidade, incluindo o próximo passo informado.

**Acceptance Scenarios**:

1. **Given** que o Assessment ainda não forneceu dados comerciais, **When** o administrador abre Custos, **Then** vê “Aguardando dados comerciais do Assessment” e nenhum valor financeiro, renovação ou conciliação.
2. **Given** qualquer controle de cotação, compra, renovação, aprovação ou alteração, **When** o administrador o seleciona, **Then** ele é informado como “Em breve”, sem execução no tenant.
3. **Given** que ainda não há dados comerciais, **When** o administrador abre Custos, **Then** encontra as superfícies de resumo, evolução, custo por produto/departamento/usuário, eficiência, orçamento, alertas e renovação em estado `unavailable`, cada uma com a fonte e condição necessárias para habilitação.

---

### User Story 6 - Ler o Dashboard Executivo conforme a arquitetura ilustrada (Priority: P1)

Como administrador, quero encontrar no Dashboard Executivo todos os blocos de decisão ilustrados pelo sponsor, para distinguir a ausência de uma fonte da ausência da análise que ela suportará.

**Why this priority**: O dashboard é a primeira leitura do submódulo e atualmente oculta superfícies essenciais, como utilização, evolução de custo e visão futura por pessoa.

**Independent Test**: Com dados técnicos, sem fonte comercial e com relatório anonimizável, o administrador visualiza os KPIs, donut, evolução, oportunidades, tabela por produto, departamento, tendência e alertas; cada bloco explica se está disponível, restrito ou indisponível.

**Acceptance Scenarios**:

1. **Given** SKUs técnicos sincronizados, **When** o administrador abre o Dashboard Executivo, **Then** os indicadores e visualizações de capacidade usam exclusivamente o universo de SKUs incluídas na configuração do tenant e identificam essa regra de inclusão.
2. **Given** ausência de dados comerciais ou nominais, **When** o administrador encontra custo, economia, vencimento, departamento ou licença por usuário, **Then** o bloco permanece reconhecível e informa a fonte/condição faltante, sem número sintético ou remoção silenciosa.
3. **Given** uma oportunidade com evidência, **When** o administrador a seleciona, **Then** pode abrir sua análise em modo somente leitura; a ação operacional correspondente permanece “Em breve”.

---

### User Story 7 - Explorar Inventário e Consumo completos com segurança (Priority: P1)

Como administrador, quero que Inventário e Consumo preservem as seções de detalhe, filtros, cobertura e granularidade ilustradas, para investigar produtos e adoção sem concluir além da evidência permitida.

**Why this priority**: Essas abas sustentam os números executivos e precisam tornar visíveis as lacunas de dado, principalmente detalhes nominais, comerciais e de atividade.

**Independent Test**: O administrador encontra os campos e abas estruturais previstos para produto, planos, usuários, contratos, atividade, departamento e tendência; os dados técnicos aparecem quando existentes e os demais mostram o estado/condição correto.

**Acceptance Scenarios**:

1. **Given** um SKU fora do cálculo, **When** o administrador consulta o Inventário ou seus KPIs, **Then** ele permanece visível com esse estado sem alterar os totais, utilização, oportunidades ou planejamento.
2. **Given** um relatório de consumo anonimizado, incompleto ou com métricas de workloads diferentes, **When** o administrador abre Consumo, **Then** vê agregados e cobertura permitidos, sem deduzir usuários únicos, pessoa ou departamento.
3. **Given** dados comerciais ou detalhes nominais não autorizados, **When** o administrador abre a seção correspondente, **Then** recebe uma mensagem contextual que explica o que falta para habilitá-la.

---

### User Story 8 - Investigar as superfícies analíticas completas (Priority: P2)

Como administrador, quero que Otimização, Histórico e Planejamento mantenham as superfícies analíticas ilustradas e seus limites explícitos, para usar evidência técnica hoje e reconhecer o que depende de preço, workflow ou autorização futura.

**Why this priority**: A experiência esperada inclui fila, evidência, histórico, roadmap, simuladores e resultados; ocultar tudo o que ainda é futuro descaracteriza a proposta consultiva.

**Independent Test**: Em cada aba, o administrador encontra o bloco esperado, abre evidência técnica existente e entende a cobertura, dependência ou indisponibilidade dos blocos comerciais/nominais sem disparar qualquer efeito.

**Acceptance Scenarios**:

1. **Given** uma recomendação técnica, **When** o administrador a consulta, **Then** vê evidência, regra, confiança, impedimento e recursos impactados; valores de economia e controles de execução informam sua dependência.
2. **Given** histórico desde a implantação, **When** o administrador filtra ou abre um evento, **Then** diferencia ocorrência, detecção, sincronização, origem e confirmação; ausência anterior é apresentada como cobertura indisponível.
3. **Given** um cenário de planejamento sem base comercial, **When** o administrador o abre, **Then** vê premissas, dependências e benefício técnico, enquanto calendário de renovação, investimento, contratação e workflow explicam sua indisponibilidade.

---

### User Story 9 - Confiar nos estados e interações dos blocos preparados (Priority: P2)

Como administrador, quero que gráficos, cards, tabelas e ações futuras tenham estados acessíveis e explicativos, para saber o que posso investigar agora e o que depende de uma fase posterior.

**Why this priority**: Uma área vazia, um zero ou um controle desabilitado sem contexto pode ser interpretado como falha ou dado confirmado.

**Independent Test**: Sem uma fonte necessária, todos os blocos preparados mantêm título, propósito, condição de habilitação e status acessível; com evidência disponível, a investigação por teclado abre o detalhe correto.

**Acceptance Scenarios**:

1. **Given** ausência de fonte em um card, gráfico ou tabela, **When** ele é renderizado, **Then** o estado informa fonte faltante, último dado conhecido/cobertura quando houver e próximo passo, sem usar zero como fallback.
2. **Given** uma aba, painel expansível, gráfico ou ação “Em breve”, **When** o administrador navega por teclado ou leitor de tela, **Then** recebe semântica, foco e descrição coerentes com o estado e não encontra uma ação nominal ou mutação acessível indevidamente.

### Edge Cases

- Quando o Graph omitir campos opcionais, paginar resultados, não permitir `licenseDetails` ou falhar, a superfície técnica preserva dados conhecidos e declara `fresh`, `stale` ou `unavailable`; campos ausentes não viram zero.
- Quando relatórios de uso forem anonimizados, a experiência preserva agregados permitidos, impede recomendação nominal e declara o motivo.
- Quando uma atribuição vier por grupo ou múltiplos grupos, a origem é preservada e não é simplificada como atribuição direta ao usuário.
- Quando uma conclusão depender de preço, contrato, vencimento, exceção, política ou evidência insuficiente, ela fica indisponível, bloqueada ou pendente; nunca é apresentada como fato confirmado.
- Estados de carregamento, vazio, erro, filtro e indisponibilidade reutilizam o vocabulário, tons e componentes estabelecidos no módulo Microsoft 365.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE expor as sete superfícies do submódulo na ordem: Dashboard Executivo, Inventário, Consumo, Custos, Otimização, Histórico e Planejamento.
- **FR-002**: O sistema DEVE apresentar em todos os blocos estruturados a fonte, a data/hora da última atualização e o estado de frescor `fresh`, `stale` ou `unavailable`.
- **FR-003**: O sistema DEVE usar a fotografia técnica de SKUs, capacidade, planos e atribuições como base para inventário e indicadores, preservando a origem e a data da observação.
- **FR-003a**: O sistema DEVE usar a coleta paginada de usuários com atribuições, planos e estados de atribuição como base e fallback obrigatório para atribuições; o detalhe individual de licença é somente enriquecimento revalidado por tenant e sua indisponibilidade não bloqueia Inventário ou Consumo.
- **FR-003b**: A sincronização diária DEVE reconciliar integralmente atribuições, incluindo origem direta, por grupo ou múltiplos grupos, planos desabilitados e estados ausentes sem inferência; uma coleta incremental pode otimizar o processo, mas não substitui essa reconciliação.
- **FR-004**: A V2 DEVE permitir investigação técnica agregada por produto, com busca e filtros de elegibilidade. Dados nominais por usuário, exportação e detalhe de atribuições permanecem fora do payload e da interface até existir um modelo de associação e autorização de tenant aprovado.
- **FR-005**: O sistema DEVE apresentar consumo e adoção por produto, pessoa ou departamento apenas na granularidade permitida pela evidência, declarando se o relatório está identificado, anonimizado, insuficiente ou indisponível e exibindo separadamente a data do relatório, a data da coleta técnica e o frescor de cada fonte.
- **FR-006**: O sistema DEVE produzir recomendações técnicas explicáveis com tipo, prioridade, confiança, versão da regra, período, evidência e exceções/impedimentos aplicáveis.
- **FR-007**: O sistema DEVE manter snapshots diários e eventos técnicos próprios para exibir evolução, variações e reconciliação de estado; o estado atual externo não substitui esse histórico.
- **FR-008**: O sistema DEVE apresentar cenários e roadmap técnicos somente com premissas, dependências, benefício e limite de evidência explícitos.
- **FR-009**: O sistema DEVE manter custo, preço, contratos, faturas, impostos, descontos, renovações e dados comerciais como indisponíveis até a entrada futura pelo Assessment, sem converter ausência em zero, estimativa ou data inventada.
- **FR-010**: O sistema NÃO DEVE criar workflow, solicitação, cotação, compra, aprovação, alteração de licença ou provisionamento no tenant nesta V2; controles correspondentes DEVEM informar “Em breve”.
- **FR-011**: O sistema DEVE informar uma sincronização diária, a próxima execução esperada e falhas/defasagens; mudanças intradia podem aparecer somente no ciclo seguinte.
- **FR-012**: O sistema DEVE preservar contexto de dados pessoais e impedir recomendações por pessoa quando a evidência não permitir identificação.
- **FR-012a**: O sistema DEVE isolar toda leitura, persistência e resposta por tenant; evidências e relatórios brutos ficam protegidos e referenciados, e nomes, UPNs e atributos organizacionais não podem ser expostos em logs ou mensagens de erro.
- **FR-012b**: O sistema DEVE restringir a visualização nominal a evidência identificada e acesso autorizado ao tenant.
- **FR-013**: O sistema DEVE preservar ou estender intencionalmente padrões existentes de shell, layout, estados, status, tabelas, filtros e visualização responsiva do módulo Microsoft 365.
- **FR-014**: O sistema DEVE limitar a V2 a licenças Microsoft 365 observáveis tecnicamente; produtos sem essa leitura técnica permanecem fora do escopo até uma fonte apropriada futura.
- **FR-015**: O sistema DEVE manter todos os SKUs técnicos visíveis. A participação em totais de assentos, utilização, oportunidades e planejamento DEVE ser definida por configuração persistida por tenant/SKU, e não por heurística do nome ou de capacidade retornada pelo Graph. SKUs sem configuração prévia entram no cálculo; SKUs configuradas como fora do cálculo permanecem visíveis no Inventário e Histórico.
- **FR-016**: O sistema DEVE preservar, nas sete abas, os blocos de informação ilustrados pelo sponsor como superfícies reconhecíveis de decisão, classificando cada um como `available`, `unavailable`, `restricted` ou `coming_soon`; a ausência de fonte não autoriza remover silenciosamente o bloco.
- **FR-017**: O Dashboard Executivo DEVE conter faixas de KPIs, utilização, evolução de custo, oportunidades, produtos, distribuição, tendência e avisos; dados financeiros, comerciais ou nominais indisponíveis DEVEM permanecer no bloco correspondente com sua condição de habilitação explícita.
- **FR-018**: Inventário e Consumo DEVEM expor a estrutura de detalhamento por produto, planos, atribuições/usuários, contratos, atividade, departamento e tendência, respeitando a granularidade autorizada e explicando restrições de identificação, preço, contrato ou qualidade de dado.
- **FR-019**: Otimização, Histórico e Planejamento DEVEM expor respectivamente as superfícies de fila/evidência/simulador, linha do tempo/evoluções e cenários/roadmap/renovações, preservando em estado explícito os trechos dependentes de dados comerciais, workflow ou autorização nominal.
- **FR-020**: Métricas de consumo DEVEM declarar sua população e cobertura; contagens de workloads distintos não podem ser agregadas e rotuladas como usuários únicos sem reconciliação identificável.
- **FR-021**: Blocos indisponíveis, restritos e ações futuras DEVEM manter título, objetivo, condição de habilitação e descrição acessível; ações de investigação com evidência disponível não podem ser desabilitadas sem alternativa equivalente.
- **FR-022**: Custos DEVE preservar os blocos ilustrados de resumo financeiro, evolução, análise por produto/departamento/usuário, eficiência, orçamento, alertas e próxima renovação; sem dados comerciais, cada bloco DEVE ser `unavailable` e informar a dependência de Assessment/CSV, sem exibir valor, prazo ou conciliação fictícios.

### Key Entities *(include if feature involves data)*

- **Produto de licença**: SKU canônico e seus planos de serviço, identificado tecnicamente e classificado para apresentação.
- **SKU do tenant**: fotografia atual da capacidade, consumo, disponibilidade e estado técnico de um produto no tenant.
- **Atribuição de licença**: observação do vínculo entre pessoa e SKU, incluindo origem, estado e planos desabilitados.
- **Snapshot de consumo**: evidência de adoção por período e sujeito permitido, com estado de identificação e métricas normalizadas.
- **Oportunidade de otimização**: conclusão técnica versionada, priorizada e sustentada por evidência e exceções.
- **Evento de licença**: alteração técnica detectada por snapshot ou fonte externa, com confirmação e referência de evidência.
- **Cenário de licenciamento**: análise consultiva versionada, com pressupostos e alterações propostas sem efeito operacional.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um administrador consegue identificar, em até 3 minutos, capacidade total, utilizadas, disponíveis, estado da sincronização e a principal oportunidade técnica a partir do Dashboard Executivo.
- **SC-002**: Para cada SKU técnico exibido, o administrador consegue acessar capacidade, planos e atribuições disponíveis em até 3 interações a partir do Inventário.
- **SC-003**: 100% dos blocos que dependem de dados externos exibem fonte, última atualização e um estado de frescor válido.
- **SC-004**: 100% das oportunidades exibidas informam regra, período, evidência, prioridade e confiança; as sem preço ou evidência suficiente não exibem valor ou conclusão inventada.
- **SC-005**: 100% das superfícies financeiras e ações comerciais na ausência de dados comerciais exibem estado explícito de indisponibilidade e não criam efeitos no tenant.
- **SC-006**: Uma variação de capacidade entre snapshots diários fica consultável no Histórico com origem e estado de confirmação.
- **SC-007**: 100% dos blocos decisórios presentes nas sete ilustrações possuem uma representação visível em sua aba, com estado de disponibilidade e dependência verificáveis.
- **SC-008**: 100% dos totais, donuts, tendências, oportunidades e cenários de capacidade aplicam a configuração de participação por tenant/SKU; uma SKU fora do cálculo não altera esse universo e permanece identificável no Inventário.
- **SC-009**: Uma pessoa usuária consegue identificar, em até uma interação adicional em qualquer bloco preparado, a fonte ou autorização necessária para habilitá-lo e, quando houver evidência técnica, abrir a investigação por teclado.

## Assumptions

- O administrador autenticado do tenant é o público da V2 e usa a navegação existente do Microsoft 365.
- A sincronização técnica possui acesso previamente consentido às fontes Microsoft necessárias; falha de permissão é um estado tratável na interface, não um bloqueio silencioso.
- Relatórios de uso, coleta técnica e evidências podem ter datas e estados de frescor distintos, que permanecem rastreáveis em toda conclusão derivada.
- A entrada comercial por Assessment/CSV, integrações de parceiro/distribuidor, workflow e alteração de tenant são fases futuras, não parte desta entrega.
- Histórico e regras podem ser persistidos quando necessários para uma experiência crível; integrações externas permanecem no menor escopo viável.
- A implementação reutiliza componentes compartilhados e encapsula gráficos, preservando a experiência do produto.
- As sete imagens do sponsor são a referência de completude de informação; o detalhamento em `discovery/microsoft-365/v2/licenciamento/expectativas-ilustradas.md` traduz cada bloco para os limites de evidência da V2.
