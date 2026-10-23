# Feature Specification: Usuários e Contas Microsoft 365 V2

**Feature Branch**: `feat/004-usuarios-contas`
**Created**: 2026-07-31
**Status**: Approved (sponsor)
**Input**: Consolidar `discovery/microsoft-365/v2/usuarios-e-contas` em uma especificação implementável e validar a cobertura da necessidade do sponsor.

## Clarifications

### Session 2026-07-31

- Q: Qual regra inicial de inatividade deve orientar a V2? → A: 30/60/90 dias, com conta nunca usada após 15 dias.
- Q: Qual é o escopo do Score de Saúde das Contas na V2? → A: O score composto permanece `unavailable`; o catálogo inicial aprovado publica categorias e severidades derivadas de dados sincronizados, sem recomendações ou tratamento.
- Q: Qual formato de exportação protegida será oferecido inicialmente? → A: CSV apenas; XLSX fica fora do recorte atual.
- Q: Qual retenção inicial deve valer para snapshots e eventos próprios? → A: 12 meses por tenant.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ler o Dashboard Executivo (Priority: P1)

Como pessoa usuária autenticada, quero abrir o Dashboard Executivo para saber onde investigar primeiro a saúde das identidades.

**Why this priority**: É a entrada da área e orienta a decisão sem exigir consulta prévia a uma identidade específica.

**Independent Test**: Com uma fotografia disponível, a pessoa usuária identifica indicadores, distribuição, qualidade, eventos, alertas e a cobertura de cada bloco.

**Acceptance Scenarios**:

1. **Given** dados atuais de identidade, **When** a pessoa usuária abre o Dashboard Executivo, **Then** vê totais, distribuição, qualidade, eventos e alertas que apontam a próxima investigação.
2. **Given** uma fonte de risco, MFA ou auditoria indisponível, **When** o bloco correspondente é exibido, **Then** ele informa `restricted` ou `unavailable`, sem usar zero como substituto.

---

### User Story 2 - Consultar o Diretório de Usuários (Priority: P1)

Como pessoa usuária autenticada, quero buscar, filtrar e abrir uma identidade para compreender seu contexto antes de tomar uma decisão.

**Why this priority**: O Diretório é a triagem central para as demais investigações da área.

**Independent Test**: A pessoa usuária encontra uma identidade, aplica filtros, abre o perfil e distingue dados conhecidos de fontes restritas.

**Acceptance Scenarios**:

1. **Given** identidades sincronizadas, **When** a pessoa usuária busca ou filtra por tipo, status, departamento, MFA ou licença, **Then** a lista mostra resultados compatíveis ou explica a ausência de correspondências.
2. **Given** uma identidade selecionada, **When** abre o perfil, **Then** vê resumo, identidade, acessos, licenças, grupos, autenticação e histórico conforme a evidência autorizada.
3. **Given** dados autorizados para exportação, **When** solicita a exportação do recorte, **Then** recebe um CSV com somente o conteúdo permitido, cobertura e sensibilidade declaradas.

---

### User Story 3 - Priorizar Saúde das Contas (Priority: P1)

Como pessoa usuária autenticada, quero reconhecer a condição de habilitação de Saúde das Contas para não interpretar ausência de catálogo como ausência de risco.

**Why this priority**: A superfície precisa permanecer visível, mas não pode criar fila, categoria ou severidade sem catálogo aprovado.

**Independent Test**: A pessoa usuária abre Saúde das Contas e identifica que score, achados, categorias, distribuição, evolução e recomendações aguardam catálogo aprovado, sem dados ou ações inventadas.

**Acceptance Scenarios**:

1. **Given** uma geração publicada, **When** a pessoa usuária abre Saúde das Contas, **Then** vê distribuição, severidades e categorias derivadas somente do catálogo inicial aprovado; score, evolução e recomendações permanecem indisponíveis sem regras adicionais.
2. **Given** catálogo, fórmula, pesos ou exceções não aprovados, **When** consulta a área, **Then** score e achados permanecem `unavailable`; somente uma futura aprovação explícita pode habilitar sua exibição.

---

### User Story 4 - Analisar Atividade e Inatividade (Priority: P1)

Como pessoa usuária autenticada, quero analisar uso e inatividade para identificar contas que podem demandar investigação de acesso ou licença.

**Why this priority**: A atividade conecta uso real, risco operacional e possível desperdício sem concluir automaticamente uma ação.

**Independent Test**: A pessoa usuária consulta faixas de atividade e a lista correspondente, identificando período, cobertura e contas nunca usadas ou licenciadas sem uso.

**Acceptance Scenarios**:

1. **Given** dados de atividade disponíveis, **When** a pessoa usuária abre Atividade e Inatividade, **Then** distingue as faixas iniciais de 30, 60 e 90 dias, contas nunca usadas após 15 dias e contas licenciadas sem uso.
2. **Given** ausência de atividade ou logs autorizados, **When** consulta a área, **Then** vê o estado `restricted` e a última informação conhecida quando existir.

---

### User Story 5 - Investigar Contas Privilegiadas (Priority: P1)

Como pessoa usuária autenticada, quero investigar funções administrativas, MFA, risco e atividade para avaliar a postura de privilégios.

**Why this priority**: Privilégios administrativos exigem investigação clara, inclusive quando a cobertura PIM não está licenciada.

**Independent Test**: A pessoa usuária abre Contas Privilegiadas e diferencia funções permanentes, elegibilidades quando disponíveis e sinais de cobertura restrita.

**Acceptance Scenarios**:

1. **Given** fontes de privilégios permanentes disponíveis, **When** a pessoa usuária abre Contas Privilegiadas, **Then** vê funções, escopo e sinais associados à identidade.
2. **Given** dados PIM sem cobertura de licença, **When** consulta o bloco PIM, **Then** ele é exibido como `restricted`, sem inferir ausência de elegibilidades.

---

### User Story 6 - Governar Convidados e Usuários Externos (Priority: P2)

Como pessoa usuária autenticada, quero consultar convidados externos para investigar estado B2B, domínio, licença e atividade quando houver cobertura.

**Why this priority**: Identidades B2B precisam continuar visíveis mesmo quando as fontes complementares não estão disponíveis.

**Independent Test**: A pessoa usuária abre a lista de convidados, aplica filtros e identifica dados básicos, atividade e dependências internas separadamente.

**Acceptance Scenarios**:

1. **Given** convidados existentes, **When** a pessoa usuária abre Convidados e Usuários Externos, **Then** vê lista base, estado B2B, domínio, licença e recomendações sustentadas por evidência.
2. **Given** atividade de convidado indisponível, **When** consulta a lista, **Then** os dados básicos permanecem disponíveis e somente a atividade é `restricted`.
3. **Given** patrocinador, classificação ou revisão sem fonte aprovada, **When** a pessoa usuária abre o detalhe, **Then** esses campos são `unavailable`, sem informação inferida.
4. **Given** a geração possui estado B2B e atividade publicados, **When** a pessoa usuária abre a aba, **Then** vê comparativos mensais e as análises de status, tendência de 90 dias e domínios externos sem usar o UPN B2B como domínio.
5. **Given** uma geração anterior não contém `externalUserState`, **When** a pessoa usuária abre a aba, **Then** a distribuição de status é `restricted`, sem tratar a ausência como aceite.

---

### User Story 7 - Acompanhar o Ciclo de Vida (Priority: P2)

Como pessoa usuária autenticada, quero reconhecer as etapas e capacidades planejadas de onboarding, offboarding e revisão de acesso sem que a versão execute operações.

**Why this priority**: O sponsor espera a superfície completa, embora workflows e integrações operacionais ainda não estejam aprovados.

**Independent Test**: A pessoa usuária abre Ciclo de Vida e identifica etapas, solicitações, tarefas, SLAs, indicadores e atalhos com estado e condição de habilitação.

**Acceptance Scenarios**:

1. **Given** a pessoa usuária abre Ciclo de Vida, **When** consulta a área, **Then** vê etapas, solicitações, tarefas, SLAs, indicadores e atalhos como evidência disponível ou `coming_soon`.
2. **Given** uma ação de criar, aprovar, bloquear, revogar ou excluir, **When** a pessoa usuária tenta iniciá-la, **Then** recebe “Em breve” e nenhuma solicitação ou alteração é criada.

---

### User Story 8 - Investigar Histórico e Auditoria (Priority: P2)

Como pessoa usuária autenticada, quero investigar eventos de diretório e autenticação para compreender mudanças e atividades relevantes.

**Why this priority**: A rastreabilidade sustenta investigações de segurança e governança, respeitando retenção e cobertura disponíveis.

**Independent Test**: A pessoa usuária filtra eventos por período, categoria, atividade ou identidade, abre o detalhe e exporta somente o conteúdo autorizado.

**Acceptance Scenarios**:

1. **Given** eventos auditáveis disponíveis, **When** a pessoa usuária abre Histórico e Auditoria, **Then** pode investigar categorias, tendência e detalhes com período, origem, ator, alvo e resultado.
2. **Given** uma fonte sem cobertura, permissão ou retenção suficiente, **When** consulta o recorte, **Then** vê a restrição e não uma lista vazia ou um evento inventado.
3. **Given** exportação autorizada para a fonte e o recorte, **When** a pessoa usuária a solicita, **Then** recebe um CSV com somente o conteúdo permitido, cobertura e sensibilidade declaradas.

### Edge Cases

- Quando uma consulta filtrada não encontra itens, a experiência informa que não há correspondências para o filtro, sem tratar a resposta como falha ou total zero.
- Quando uma fonte externa responde com limitação de licença, permissão, retenção, paginação ou falha, o bloco preserva sua estrutura, mostra a última informação conhecida quando existir e informa o estado correto.
- Quando o acompanhamento incremental precisar ser reiniciado, a nova fotografia só passa a ser exibida após a reconciliação completa; a pessoa usuária não vê uma mistura de gerações de dados.
- Quando dados externos omitirem um atributo opcional, a interface o apresenta como não informado, sem inferir valor, status ou recomendação.
- Quando uma tela for usada em espaço reduzido, busca, filtros, tabelas e detalhe mantêm acesso ao conteúdo e contexto sem remover capacidades investigativas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE disponibilizar as oito superfícies na ordem: Dashboard Executivo, Diretório de Usuários, Saúde das Contas, Atividade e Inatividade, Contas Privilegiadas, Convidados e Usuários Externos, Ciclo de Vida e Histórico e Auditoria.
- **FR-002**: Nesta V2, o sistema DEVE aplicar somente a autenticação e verificação de e-mail já existentes; não há limitação de acesso por papel, matriz de visibilidade ou segregação por perfil.
- **FR-003**: O sistema DEVE exibir, em cada bloco dependente de dados, fonte, período/cobertura, última atualização e estado `available`, `restricted`, `unavailable` ou `coming_soon`.
- **FR-004**: O sistema NÃO DEVE converter ausência de dado, licença, permissão, retenção ou falha de coleta em zero, conclusão positiva ou lista vazia.
- **FR-005**: O Dashboard Executivo DEVE manter indicadores de identidade, distribuição, cobertura de segurança, qualidade, eventos e alertas, permitindo aprofundar somente em evidências disponíveis.
- **FR-006**: O Diretório DEVE permitir busca, filtros, ordenação, paginação e seleção de identidade, preservando o contexto dos filtros e distinguindo resultado sem correspondência de fonte indisponível.
- **FR-007**: O perfil de identidade DEVE organizar resumo, dados cadastrais, acessos, licenças, grupos, autenticação e histórico, com cada seção declarando sua disponibilidade e origem.
- **FR-008**: Saúde das Contas DEVE publicar somente o catálogo inicial aprovado de achados e severidades, preservando fonte restrita como indisponível. Score composto, triagem, evolução e recomendações permanecem `unavailable` até aprovação de fórmula, tratamento e evidências adicionais.
- **FR-009**: Atividade e Inatividade DEVE permitir analisar atividade recente, inatividade, contas nunca usadas e contas licenciadas sem uso. A configuração inicial é de 30, 60 e 90 dias, com conta nunca usada após 15 dias; as janelas permanecem configuráveis por tenant e devem declarar período e cobertura.
- **FR-010**: Contas Privilegiadas DEVE diferenciar funções permanentes das informações PIM quando observáveis; indisponibilidade de licença PIM DEVE ser exibida como restrição, não como ausência de privilégios.
- **FR-011**: Convidados e Usuários Externos DEVE manter a leitura básica B2B disponível independentemente de atividade; patrocinador, classificação técnica/compartilhada e revisão ficam indisponíveis até existir fonte interna aprovada.
- **FR-012**: Histórico e Auditoria DEVE permitir investigação por período, categoria, atividade e identidade dentro da cobertura disponível, preservando origem, ator, alvo, resultado e data de detecção/coleta.
- **FR-013**: O sistema DEVE manter a coleta do tenant configurado atualizada diariamente no seu fuso e apresentar estado de frescor, última coleta bem-sucedida e condição de falha ou defasagem.
- **FR-014**: Em reinício de sincronização, o sistema DEVE reconciliar a fotografia completa de forma idempotente, aplicar remoções como tombstones e só publicar a nova geração de dados após confirmar conjuntamente a fotografia materializada e seu cursor de continuidade.
- **FR-015**: O sistema DEVE manter snapshots e eventos próprios por 12 meses, escopados pelo `tenant_id` do tenant configurado, para comparar evolução além da cobertura externa e declarar a cobertura de cada fonte.
- **FR-016**: Dados pessoais, de autenticação, localização e auditoria DEVEM permanecer em armazenamento protegido, com trilha de acesso e sem exposição em registros de erro, URLs temporárias ou exportações não autorizadas.
- **FR-017**: O sistema DEVE disponibilizar exportação protegida em CSV no Diretório e em Histórico e Auditoria quando a fonte, o recorte e a autorização permitirem. Cada exportação DEVE declarar cobertura e sensibilidade; XLSX fica fora desta V2, e conteúdo bruto ou URLs temporárias não podem ser expostos fora da área protegida.
- **FR-018**: Ciclo de Vida DEVE manter visíveis as superfícies de etapas, solicitações, tarefas, SLAs, indicadores e atalhos. Solicitações, aprovações, criação, bloqueio, revogação, exclusão e workflows DEVEM permanecer `coming_soon` nesta versão e sem efeito operacional.
- **FR-019**: O sistema DEVE preservar os padrões de navegação, estados, filtros, tabelas, gráficos, acessibilidade e responsividade já estabelecidos para Microsoft 365.
- **FR-020**: O sistema DEVE manter recomendações como orientação de investigação, exibindo evidência, condição e impedimento, sem afirmar que uma alteração foi executada.

### Key Entities *(include if feature involves data)*

- **Identidade**: Pessoa, convidado ou conta representada no tenant, com atributos de estado, tipo, origem e contexto disponível.
- **Fotografia de identidades**: Estado reconciliado de uma geração de coleta, com cobertura, frescor e cursor de continuidade.
- **Achado de saúde (futuro)**: Problema explicável associado a uma identidade ou população, com categoria, severidade, evidência e recomendação; não é produzido nesta V2 sem catálogo aprovado.
- **Sinal de atividade**: Evidência de uso, inatividade ou ausência de uso, com período e cobertura declarados.
- **Privilégio administrativo**: Função permanente ou elegível associada a uma identidade, com tipo, escopo e estado de cobertura.
- **Convidado externo**: Identidade B2B com estado externo, domínio, licença e evidências de atividade quando disponíveis.
- **Evento de auditoria**: Ocorrência investigável com origem, ator, alvo, resultado, data e condição de retenção.
- **Processo de ciclo de vida**: Acompanhamento futuro de admissão, desligamento ou revisão, com estado e evidência; ações permanecem fora do escopo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em até 3 minutos, uma pessoa usuária autenticada consegue identificar no Dashboard Executivo a principal área que exige investigação e a cobertura de seus indicadores.
- **SC-002**: Em até 3 interações, uma pessoa usuária consegue localizar uma identidade no Diretório e abrir seu perfil contextual.
- **SC-003**: 100% dos blocos dependentes de fonte externa exibem origem, atualização/cobertura e estado de disponibilidade verificável.
- **SC-004**: 100% das restrições de licença, permissão, retenção e ausência de fonte são comunicadas sem exibir contagem zero ou conclusão inventada.
- **SC-005**: 100% das recomendações exibidas apresentam evidência, condição e próximo passo investigativo, sem executar alteração no tenant.
- **SC-006**: Uma conta em atenção pode ser localizada a partir de Atividade, Privilégios, Convidados ou Histórico e investigada no contexto da identidade sem perder o recorte inicial. Saúde passa a integrar esse fluxo somente depois da aprovação do catálogo.
- **SC-007**: A fotografia exibida para um tenant corresponde integralmente a uma geração de sincronização confirmada; nenhuma tela mistura dados de gerações diferentes.
- **SC-008**: 100% das ações mutáveis previstas nesta área permanecem claramente identificadas como `coming_soon` e não produzem efeito operacional.

## Assumptions

- Nesta V2, o Orkestria 360 não possui limitação de acesso por papel nem matriz de visibilidade por campo; as rotas seguem somente a autenticação e verificação de e-mail já existentes.
- As fontes externas necessárias podem estar restritas por permissão, licença, retenção ou cobertura; esses são estados normais e visíveis da experiência.
- Catálogo de regras/evidências/severidades/exceções, fórmula e pesos de Saúde não fazem parte desta V2; categorias técnicas internas, dados de RH, patrocinador e revisões de acesso permanecem fontes futuras até receberem aprovação.
- A aplicação é single-tenant; `tenant_id` permanece somente como escopo do modelo de dados. A sincronização diária usa o timezone IANA do tenant configurado, inicialmente `America/Sao_Paulo`, enquanto horário operacional e monitoramento detalhado permanecem para fase futura.
- As faixas iniciais de atividade são 30, 60 e 90 dias, e uma conta sem uso após 15 dias é classificada como nunca usada; o tenant pode configurar essas janelas.
- Exportações protegidas do Diretório e Histórico/Auditoria usam CSV; XLSX não pertence ao recorte desta V2.
- Snapshots e eventos próprios de Usuários e Contas ficam retidos por 12 meses por tenant; a retenção não é indefinida.
- Workflows e alterações no tenant não pertencem a esta entrega, mesmo quando a referência visual apresenta seus controles.
- A implementação reutilizará a navegação e os padrões de experiência já existentes no módulo Microsoft 365.
