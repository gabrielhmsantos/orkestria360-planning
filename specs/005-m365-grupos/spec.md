# Feature Specification: Grupos Microsoft 365 V2

**Feature Branch**: `feat/005-m365-grupos`

**Created**: 2026-08-04

**Status**: Draft

**Input**: User description: "grupos"; referências em `discovery/microsoft-365/v2/grupos/`.

## Clarifications

### Session 2026-08-04

- Q: A exportação de dados dos recortes de Grupos deve fazer parte desta V2? → A: Não incluir exportação nesta V2; manter a intenção como “em breve”, sem gerar arquivo.
- Q: Qual é a postura de dados temporais na V2? → A: Persistir snapshots e eventos somente para atividade, licenciamento, auditoria e sinais de ciclo de vida; exibir diretório e relações atuais mesmo sem histórico.
- Q: Como a V2 deve tratar os dados de grupos para usuários da aplicação? → A: Qualquer usuário criado e autenticado na aplicação acessa os dados disponíveis; a V2 não diferencia perfis, cargos ou campos por pessoa usuária.
- Q: Qual desempenho mínimo deve ser aceito para consulta e investigação em um tenant de teste com até 10.000 grupos? → A: Carregamento inicial, aplicação de filtro e abertura de detalhe devem mostrar conteúdo ou estado explícito em até 5 segundos.
- Q: Qual isolamento de dados a V2 deve exigir? → A: Todos os dados devem ser escopados ao tenant Contoso configurado, sem suporte para selecionar ou operar múltiplos tenants nesta V2.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Priorizar a saúde dos grupos (Priority: P1)

Como usuário da aplicação da Contoso, quero abrir uma visão executiva de grupos para entender sua composição, riscos e prioridades de investigação, sem precisar consultar listas brutas ou concluir que um dado indisponível significa ausência de risco.

**Why this priority**: É a porta de entrada para a governança de grupos e permite priorizar investigação em vez de navegar sem contexto.

**Independent Test**: Pode ser testada abrindo o dashboard com dados completos, parciais ou indisponíveis e verificando a leitura consolidada, os encaminhamentos e a proveniência de cada bloco.

**Acceptance Scenarios**:

1. **Given** grupos disponíveis no tenant, **When** a pessoa usuária abre o Dashboard Executivo, **Then** visualiza indicadores de composição e risco, distribuição por tipo, evolução, principais grupos, itens que requerem atenção e encaminhamentos para investigação.
2. **Given** uma dimensão do score de governança sem evidência publicada, **When** o dashboard é exibido, **Then** a dimensão contribui com zero conforme seu peso e a composição explicita o percentual apurado, sem classificação textual inventada.

---

### User Story 2 - Consultar o diretório de grupos (Priority: P1)

Como usuário da aplicação, quero pesquisar, filtrar e abrir o contexto de qualquer grupo para localizar rapidamente o que preciso investigar.

**Why this priority**: O diretório é a base operacional para os demais recortes e entrega valor mesmo sem dados internos de governança.

**Independent Test**: Pode ser testada pesquisando e combinando filtros, verificando a paginação e abrindo o resumo de um resultado, inclusive quando a consulta não retorna grupos.

**Acceptance Scenarios**:

1. **Given** um conjunto de grupos disponível, **When** a pessoa usuária pesquisa ou filtra por tipo, associação, origem, visibilidade ou status, **Then** vê somente resultados compatíveis, sua quantidade e a possibilidade de limpar ou ajustar os filtros.
2. **Given** atributos de membros, convidados, licenças ou atividade não estão autorizados, **When** a pessoa usuária consulta o diretório ou o resumo de um grupo, **Then** cada atributo afetado informa a restrição sem ocultar o grupo nem apresentar zero como valor confirmado.

---

### User Story 3 - Investigar membros e proprietários (Priority: P1)

Como usuário da aplicação, quero analisar pertencimento e responsáveis dos grupos para encontrar ausência, insuficiência ou inconsistências de propriedade e acesso.

**Why this priority**: A clareza de responsabilidade é indispensável para tratar riscos de governança.

**Independent Test**: Pode ser testada selecionando um grupo na lista e verificando seu detalhe, relações disponíveis, distribuições, alertas e recomendações de aprofundamento.

**Acceptance Scenarios**:

1. **Given** relações de membros e proprietários disponíveis, **When** a pessoa usuária seleciona um grupo, **Then** vê seu resumo e a separação entre membros diretos, transitivos, proprietários e relações superiores quando cada evidência estiver disponível.
2. **Given** a visibilidade de uma relação ou atributo de identidade é restrita, **When** a tela é aberta, **Then** a relação preserva sua finalidade e mostra a restrição correspondente, sem inferir que não existem membros ou proprietários.

---

### User Story 4 - Monitorar grupos dinâmicos (Priority: P2)

Como usuário da aplicação, quero acompanhar grupos de associação calculada, suas regras e seu processamento para priorizar exceções antes de qualquer mudança.

**Why this priority**: Regras dinâmicas podem ampliar o impacto de uma alteração, mas a leitura depende de capacidade e autorização específicas.

**Independent Test**: Pode ser testada abrindo a superfície com dados disponíveis e indisponíveis, verificando filtros, lista, estado de regras, alterações recentes e as condições do simulador.

**Acceptance Scenarios**:

1. **Given** informações autorizadas de grupos dinâmicos, **When** a pessoa usuária aplica filtros ou abre uma regra, **Then** vê tipo de associação, regra, estado de processamento, membros, atualização e alterações recentes.
2. **Given** não há licença ou autorização suficiente para esse recorte, **When** a tela é aberta, **Then** os blocos mostram estado restrito e sua condição habilitadora, e o simulador permanece identificado como “em breve”.

---

### User Story 5 - Investigar licenciamento por grupo (Priority: P2)

Como usuário da aplicação, quero entender atribuições de licenças por grupo, falhas de processamento e oportunidades de investigação sem assumir custos ou alterar atribuições.

**Why this priority**: A superfície torna visíveis efeitos de atribuições centralizadas, mas valores financeiros dependem de fonte corporativa aprovada.

**Independent Test**: Pode ser testada verificando distribuição, uso, ranking, tabela e oportunidades com dados disponíveis e com custo ou detalhes de licença indisponíveis.

**Acceptance Scenarios**:

1. **Given** evidências de atribuições por grupo disponíveis, **When** a pessoa usuária abre a superfície, **Then** vê distribuição, uso, erros, grupos relevantes e oportunidades de aprofundamento.
2. **Given** não existe fonte corporativa aprovada para custo, **When** a pessoa usuária visualiza custo estimado, **Then** o bloco declara indisponibilidade e não apresenta valor financeiro fictício.

---

### User Story 6 - Avaliar governança e ciclo de vida (Priority: P2)

Como usuário da aplicação, quero avaliar finalidade, responsáveis, políticas, revisões e expiração de grupos para compreender sua etapa de ciclo de vida e priorizar não conformidades.

**Why this priority**: A leitura organiza o processo de governança mesmo quando dados internos ou políticas ainda não foram definidos.

**Independent Test**: Pode ser testada abrindo os indicadores, distribuição, fluxo, expiração, tabela e recomendações com e sem os dados corporativos necessários.

**Acceptance Scenarios**:

1. **Given** evidências disponíveis de expiração e política, **When** a pessoa usuária abre a superfície, **Then** vê o status, o fluxo de ciclo de vida, grupos próximos a expirar e orientações para investigação.
2. **Given** finalidade, responsável corporativo, criticidade ou revisão não foram cadastrados, **When** a tela é exibida, **Then** esses campos e blocos ficam indisponíveis de forma explícita, sem dados preenchidos artificialmente.

---

### User Story 7 - Investigar atividade e inatividade (Priority: P2)

Como usuário da aplicação, quero investigar sinais de atividade dos grupos para priorizar revisões sem tratar ausência de telemetria como inatividade comprovada.

**Why this priority**: Evita decisões incorretas sobre grupos cujo uso não é diretamente observável.

**Independent Test**: Pode ser testada observando faixas de atividade, tendência, impacto e lista de candidatos para grupos com telemetria e para grupos sem evidência direta.

**Acceptance Scenarios**:

1. **Given** sinais de atividade disponíveis para um grupo elegível, **When** a pessoa usuária abre a superfície, **Then** vê faixas temporais, evolução, impacto e grupos candidatos à revisão como evidência para investigar.
2. **Given** um grupo não possui telemetria direta aplicável, **When** ele aparece no recorte, **Then** o sistema informa que a evidência é indisponível e não o classifica automaticamente como inativo.

---

### User Story 8 - Rastrear histórico e auditoria (Priority: P2)

Como usuário da aplicação, quero pesquisar eventos e exclusões relacionados a grupos para explicar alterações, seus responsáveis e a cobertura temporal disponível.

**Why this priority**: Rastreabilidade apoia a investigação e dá contexto às demais superfícies.

**Independent Test**: Pode ser testada filtrando o log, abrindo um detalhe e verificando tendência, administradores, exclusões e a declaração de retenção e cobertura.

**Acceptance Scenarios**:

1. **Given** eventos de auditoria disponíveis, **When** a pessoa usuária filtra por período, categoria, grupo ou responsável, **Then** visualiza eventos compatíveis, seu detalhe, tendência e a origem da evidência.
2. **Given** a cobertura ou retenção disponível não contempla o período solicitado, **When** a pessoa usuária consulta o histórico, **Then** a tela informa o limite de cobertura em vez de sugerir que não ocorreram eventos.

### Edge Cases

- Uma consulta filtrada sem correspondências deve ser distinguida de falha de coleta, falta de autorização ou fonte indisponível.
- Um grupo excluído, restaurado ou com propriedades ausentes deve preservar sua condição e evidências disponíveis, sem prometer recuperação ou detalhe inexistente.
- Dados coletados em momentos diferentes devem informar seu próprio frescor; a tela não deve declarar atualização uniforme sem evidência.
- Tabelas extensas devem manter cabeçalhos e ações acessíveis em telas menores, sem remover informação essencial ou impedir navegação por teclado.
- Qualquer ação que possa criar, alterar, renovar, arquivar, excluir, atribuir licença, modificar associação ou executar revisão deve permanecer “em breve” até existir autorização, confirmação, segregação e trilha operacional aprovadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE disponibilizar oito superfícies distintas de Grupos Microsoft 365: Dashboard Executivo, Diretório de Grupos, Membros e Proprietários, Grupos Dinâmicos, Licenciamento por Grupo, Governança e Ciclo de Vida, Atividade e Inatividade e Histórico e Auditoria.
- **FR-002**: O sistema DEVE apresentar em cada superfície os blocos de leitura, filtros, tabelas, detalhes, visualizações e encaminhamentos definidos para sua finalidade, preservando a capacidade mesmo quando seus dados estiverem parciais ou indisponíveis.
- **FR-003**: O sistema DEVE permitir pesquisar, filtrar, paginar e aprofundar grupos e eventos nos recortes onde essas interações são aplicáveis, preservando a superfície e os filtros selecionados ao abrir contexto relacionado.
- **FR-004**: O sistema DEVE distinguir evidência disponível, acesso restrito, fonte indisponível e capacidade “em breve” em cada bloco afetado, explicando origem, atualização/frescor e condição de disponibilidade.
- **FR-005**: O sistema NÃO DEVE converter ausência de dado, permissão, licença, retenção, telemetria, custo ou falha de coleta em zero, lista vazia, inatividade comprovada, risco inexistente ou conclusão positiva, exceto na dimensão correspondente do score de governança, cuja evidência ausente vale zero por decisão explícita.
- **FR-006**: O sistema DEVE separar conceitos de membros diretos, transitivos, proprietários e relações superiores sempre que a evidência correspondente estiver disponível.
- **FR-007**: O sistema DEVE calcular o score de governança com os pesos definidos pelo sponsor e exibir a conformidade de cada dimensão. Limiares de saúde, severidades, crescimento abrupto, regra ampla, faixas de inatividade e classificação textual permanecem hipóteses de investigação até homologação.
- **FR-008**: O sistema DEVE exibir custo, finalidade, responsáveis corporativos, criticidade, políticas, revisões, exceções e documentos somente quando houver fonte corporativa aprovada; caso contrário, deve declarar a indisponibilidade correspondente.
- **FR-009**: O sistema DEVE permitir apenas ações de navegação, aprofundamento e investigação nesta fase. Ações que modifiquem grupos, associações, licenças, revisões ou ciclo de vida DEVEM permanecer visíveis como intenção “em breve”, sem executar alteração.
- **FR-009a**: O sistema NÃO DEVE gerar exportações de dados nesta V2. Onde a intenção de exportar for exibida, ela DEVE permanecer como “em breve”, sem produzir arquivo ou expor dados.
- **FR-010**: O sistema DEVE fornecer resumo textual equivalente para cada visualização analítica, de modo que sua conclusão não dependa exclusivamente de gráfico, cor, tooltip ou eixo.
- **FR-011**: O sistema DEVE preservar os padrões existentes de navegação, estado, status, tabelas, recomendações, layout responsivo e acessibilidade do módulo Microsoft 365.
- **FR-012**: O sistema DEVE manter uma barra persistente de proveniência ao final de cada superfície, identificando as fontes envolvidas, a atualização/frescor e as restrições aplicáveis.
- **FR-013**: O sistema DEVE declarar como fronteiras de integração os dados do diretório Microsoft 365 e os complementos corporativos de governança, snapshots, licenciamento, auditoria e revisão; apenas leituras autorizadas integram esta fase.
- **FR-013a**: O sistema DEVE preservar snapshots ou eventos apenas nos recortes em que a evidência temporal é essencial: atividade, licenciamento, auditoria e sinais de ciclo de vida. O diretório e as relações atuais DEVEM continuar consultáveis quando não houver histórico, sempre com frescor e disponibilidade próprios.
- **FR-014**: O sistema DEVE apresentar estados vazios, restritos, indisponíveis e de erro de forma consistente, mantendo título, propósito, condição habilitadora e, quando houver, um caminho de recuperação ou aprofundamento.
- **FR-015**: O sistema DEVE disponibilizar os dados de grupos, relações, licenciamento, atividade e auditoria que estiverem disponíveis para qualquer usuário criado e autenticado na aplicação, sem diferenciação de perfil, cargo ou campo nesta V2.
- **FR-016**: O sistema DEVE associar toda leitura, snapshot, evento e achado ao tenant Contoso configurado e impedir a mistura de dados entre contextos de tenant. A V2 NÃO DEVE oferecer seleção, configuração ou operação de múltiplos tenants.

### Key Entities

- **Grupo**: Unidade de colaboração ou segurança identificada no diretório do tenant configurado, com tipo, associação, origem, visibilidade, status e evidências relacionadas.
- **Relação de grupo**: Vínculo de membro, proprietário ou relação superior, sempre qualificado por tipo de relação, disponibilidade e momento de observação.
- **Contexto de governança**: Informações corporativas por grupo, como finalidade, responsáveis, criticidade, revisão, exceções e documentos, quando aprovadas e mantidas.
- **Achado de saúde**: Sinal rastreável de atenção associado a uma regra, evidência, severidade e condição de homologação.
- **Snapshot de atividade ou licenciamento**: Fotografia temporal de uso, consumo, processamento ou erro, com origem, cobertura e frescor próprios.
- **Snapshot de ciclo de vida**: Fotografia temporal de expiração ou política observada, com origem, cobertura e frescor próprios.
- **Evento de auditoria**: Registro temporal de criação, alteração, exclusão ou mudança de associação, com ator, alvo, evidência e cobertura disponível.
- **Revisão de acesso**: Campanha ou fluxo de decisão sobre relações de grupo; nesta fase é uma capacidade futura identificada como “em breve”.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em teste de aceitação, 100% das oito superfícies podem ser abertas e mantêm seu objetivo, estrutura e proveniência quando os dados estão disponíveis, restritos ou indisponíveis.
- **SC-002**: Pelo menos 90% das pessoas usuárias de teste localizam um grupo ou chegam a um recorte de investigação usando pesquisa ou filtros em até 2 minutos, sem ajuda externa.
- **SC-003**: Em 100% dos cenários de ausência de permissão, licença, telemetria, custo ou retenção, a pessoa usuária recebe um estado explícito e não vê valor zero ou conclusão negativa apresentada como fato.
- **SC-004**: Em 100% dos blocos analíticos avaliados, uma pessoa usuária consegue identificar a conclusão principal por título, legenda/valores e resumo textual, sem depender exclusivamente de elementos visuais.
- **SC-005**: Pelo menos 90% das pessoas usuárias de teste identificam a origem, o frescor e a condição de um dado exibido em até 30 segundos.
- **SC-006**: Em 100% dos testes de navegação, nenhuma ação marcada “em breve” gera alteração em grupos, membros, proprietários, licenças, revisões ou ciclo de vida.
- **SC-007**: Em um tenant de teste com até 10.000 grupos, o carregamento inicial de uma superfície, a aplicação de filtros e a abertura de um detalhe mostram conteúdo ou estado explícito em até 5 segundos, medidos da ação da pessoa usuária até a resposta visível.

## Scope Boundaries

**Incluído**: leitura e investigação das oito superfícies, proveniência, disponibilidade, filtros, tabelas, detalhes, resumos textuais e encaminhamentos contextuais.

**Não incluído**: exportação de dados, criação, edição, exclusão, restauração, renovação, arquivamento, alteração de membros ou proprietários, atribuição de licença, simulação de regra, execução de revisão, definição definitiva de score/limiares, precificação corporativa e configuração de permissões ou licenças do tenant.

## Assumptions

- Todo usuário criado e autenticado na aplicação acessa os dados disponíveis de Grupos. O público esperado é formado por gestores de rede, administradores e donos do tenant da Contoso; a V2 não implementa verificação, perfis, restrição por campo ou matriz granular de autorização.
- O diretório Microsoft 365 é a fonte técnica para leituras de grupos, e sua disponibilidade varia de acordo com autorização, licença, retenção e tipo de grupo.
- Contexto corporativo de governança, custo, documentos, achados e histórico ampliado será exibido somente após definição de fonte, responsáveis e política de manutenção.
- A primeira entrega usa os padrões de navegação e experiência já existentes no módulo Microsoft 365, incluindo comportamento responsivo e acessível.
- Dados e valores presentes nas referências do sponsor são ilustrativos e não representam dados operacionais.
- Frequência de coleta, retenção, limiares e critérios de classificação permanecem decisões de homologação posteriores. Os pesos do score são os definidos pelo sponsor e a ausência de evidência vale zero somente em sua dimensão.
- A preservação temporal é limitada a atividade, licenciamento, auditoria e ciclo de vida; diretório e relações de grupo são leituras correntes quando não houver histórico disponível.
- A Contoso é o único tenant operacional desta V2; o contexto de tenant permanece obrigatório para dados, eventos e rastreabilidade, mas não há suporte a múltiplos tenants.
