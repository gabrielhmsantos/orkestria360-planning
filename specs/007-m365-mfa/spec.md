# Feature Specification: Microsoft 365 — Autenticação (MFA)

**Feature Branch**: `feat/007-m365-mfa`
**Created**: 2026-08-12
**Status**: Draft
**Input**: Discovery consolidado em `discovery/microsoft-365/v2/autenticacao-mfa`.

## Clarifications

### Session 2026-08-12

- Q: O que deve acontecer quando o administrador acionar Atualizar no módulo MFA? → A: O módulo não terá o controle Atualizar; somente o sync atualiza os dados coletados.
- Q: Qual deve ser o escopo de fontes de dados na primeira entrega deste módulo MFA? → A: Todas as fontes previstas, inclusive risco; quando uma licença não estiver disponível, o card ou gráfico dependente ficará indisponível com mensagem que explique a licença necessária.
- Q: Por quanto tempo o Orkestria deve reter localmente eventos de autenticação, riscos e auditoria coletados? → A: Seguir o padrão das coletas existentes: eventos publicados de sign-in e auditoria usam política por tenant com padrão de 180 dias; snapshots de identidade, MFA e risco seguem a poda de 12 meses.
- Q: Devemos adotar a regra recomendada do sponsor como a regra de elegibilidade desta entrega? → A: Sim. Usuários elegíveis são usuários internos ativos, excluídas contas de recurso, caixas compartilhadas sem login, contas de sincronização e contas técnicas formalmente excepcionadas; o cálculo fica indisponível quando faltar dado confiável para alguma exclusão ou exceção.
- Q: Como a primeira entrega deve classificar a segurança dos métodos de autenticação? → A: Implementar tabela interna de classificação por método, sem interface de manutenção nesta versão, preenchida inicialmente com os valores do DOCX: Passkey/FIDO2, Windows Hello for Business e Certificado como Forte; Microsoft Authenticator com number matching como Recomendado; Software OATH como Intermediário; SMS e chamada telefônica como Fraco; senha isolada como Crítico.
- Q: Como o valor Graph `mobilePhone` deve aparecer e ser classificado no módulo, já que ele não distingue SMS de ligação? → A: A coleta de política deve definir os rótulos: com SMS e Ligação desabilitados, exibir somente Telefone móvel como Fraco; com somente uma habilitada, exibir somente o canal habilitado; com ambas habilitadas, exibir SMS e Ligação. Os estados não podem ser hardcoded.
- Q: As políticas SMS e Ligação podem ser habilitadas apenas para grupos específicos. Como os canais devem ser exibidos para cada identidade com `mobilePhone`? → A: Avaliar os grupos incluídos e excluídos da política para cada identidade; se o escopo não puder ser resolvido, o canal fica indisponível.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar postura executiva de MFA (Priority: P1)

Como administrador, quero abrir o Dashboard Executivo de MFA para entender a postura geral do tenant e saber onde investigar, sem que fontes ausentes pareçam resultados favoráveis.

**Why this priority**: É o ponto de entrada para as demais superfícies.

**Independent Test**: Abrir a aba com fontes publicadas, restritas e indisponíveis e confirmar a comunicação de condição e contexto em cada bloco.

**Referência estrutural e cards**: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md): **MFA Health Score** (gauge); **KPI** (métrica: Elegíveis, Registrados, Capazes, Sem MFA, Admins sem MFA, Passwordless, Resistentes, Autenticações, Sucesso, Falhas); **Cobertura de MFA** (donut); **Evolução da cobertura de MFA** (linha); **Métodos mais utilizados (30 dias)** (barras); **Principais riscos e alertas** (tabela); **Distribuição por tipo de usuário** (donut); **Top 5 aplicações com maior uso de MFA (30 dias)** (ranking).

**Acceptance Scenarios**:

1. **Given** a fotografia de registro MFA publicada, **When** o administrador abre o dashboard, **Then** vê indicadores de cobertura e data de coleta.
2. **Given** que score, eventos, risco ou alerta não foram publicados, **When** o cartão é exibido, **Then** declara restrição ou indisponibilidade, sem apresentar zero como dado.

---

### User Story 2 - Investigar cobertura e registro (Priority: P1)

Como administrador, quero filtrar o diretório de cobertura para localizar identidades registradas, capazes ou em lacuna de MFA sem classificar exceções como não conformidade.

**Why this priority**: Registro e capacidade são a evidência inicial de preparo para MFA.

**Independent Test**: Pesquisar uma identidade e aplicar os filtros de status, capacidade e tipo, validando tabela, indicadores e estados de fonte.

**Referência estrutural e cards**: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md): **KPI** (métrica: Elegíveis, Registrados, Capazes, Sem MFA, Admins sem MFA, Passwordless); **Distribuição por status de MFA** (donut); **Evolução da cobertura de MFA** (linha); **Cobertura por tipo de usuário** (barras empilhadas); **Usuários por status de MFA** (tabela); **Destaques** e **Oportunidades de melhoria** (listas).

**Acceptance Scenarios**:

1. **Given** identidades e registro MFA publicados, **When** o administrador filtra por Status MFA, Capacidade MFA ou Tipo de usuário, **Then** o diretório mostra registros correspondentes e paginação.
2. **Given** que elegibilidade, exceções ou histórico não têm regra ou fonte aprovada, **When** vê seus blocos, **Then** a condição é explicada sem conclusão normativa.

---

### User Story 3 - Avaliar métodos de autenticação (Priority: P2)

Como administrador, quero analisar métodos cadastrados e sua adoção para reduzir dependência em métodos fracos sem acionar mudanças no tenant.

**Why this priority**: Complementa a cobertura, mas depende de dados e regras adicionais.

**Independent Test**: Abrir a aba somente com registro publicado e confirmar distribuição disponível, enquanto uso, política, classificação e recomendações expõem suas condições.

**Referência estrutural e cards**: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md): **KPI** (métrica: Métodos habilitados, Authenticator, Fortes, SMS/voz, 2+ métodos, Passwordless); **Distribuição de usuários por método registrado** (donut); **Adoção dos métodos ao longo do tempo (usuários)** (linhas); **Distribuição por nível de segurança dos métodos** (donut); **Métodos de autenticação disponíveis** (tabela); **Recomendações** e **Métodos mais utilizados (30 dias)** (listas/ranking).

**Acceptance Scenarios**:

1. **Given** registro MFA publicado, **When** o administrador abre Métodos de Autenticação, **Then** vê distribuição normalizada sem dados pessoais demonstrativos.
2. **Given** uso em sign-ins ou política restritos, **When** o catálogo ou gráfico é mostrado, **Then** a interface declara a dependência e não permite alteração.

---

### User Story 4 - Investigar eventos e utilização (Priority: P2)

Como administrador, quero consultar autenticações por período, método, aplicação, localização e dispositivo para contextualizar sucesso e falha de MFA.

**Why this priority**: Traz evidência operacional, mas depende de permissão, retenção e cobertura de sign-ins.

**Independent Test**: Definir uma janela de tempo com fonte disponível ou restrita e verificar filtros, análises, tabela e comunicação de cobertura.

**Referência estrutural e cards**: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md): **KPI** (métrica: Total, Com MFA, Sucesso, Falhas auth, Falhas MFA, Únicos, Taxa sucesso); **Autenticações ao longo do tempo** (séries); **Autenticações por método** (donut); **Autenticações por aplicação** (barras); **Taxa de sucesso por método** (tabela); **Autenticações por localização** (mapa/lista); **Autenticações por dispositivo** (barras); **Últimos eventos de autenticação** (tabela); **Insights e recomendações** (lista).

**Acceptance Scenarios**:

1. **Given** eventos publicados, **When** altera período, comparação ou granularidade, **Then** análises e tabela refletem a mesma janela e contexto de MFA.
2. **Given** a fonte de sign-ins restrita, **When** a aba é aberta, **Then** os blocos preservam título e resumo, indicam a razão e não simulam eventos vazios.

---

### User Story 5 - Investigar falhas e bloqueios (Priority: P2)

Como administrador, quero identificar falhas recorrentes, bloqueios, IPs, métodos e aplicações para orientar investigação sem bloquear identidades automaticamente.

**Why this priority**: Ajuda adoção e segurança, mas os limiares ainda não são normas aprovadas.

**Independent Test**: Consultar uma janela de eventos publicada e validar categorização, rankings, tabela de falhas e ações somente orientativas.

**Referência estrutural e cards**: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md): **KPI** (métrica: Falhas, Falhas MFA, Recorrentes, Bloqueadas, IPs suspeitos, Taxa, Método crítico); **Falhas ao longo do tempo** (séries); **Falhas por categoria** (donut); **Falhas por método** (barras); **Usuários com falhas recorrentes**, **IPs com maior volume de falhas** e **Aplicações com mais falhas** (rankings); **Últimos eventos de falha** (tabela); **Ações recomendadas** (lista).

**Acceptance Scenarios**:

1. **Given** eventos de falha publicados, **When** filtra por período, tipo ou resultado, **Then** vê categorias, rankings e eventos minimizados da mesma seleção.
2. **Given** recorrência, IP suspeito ou alertas dependentes de limiar não aprovado, **When** o bloco é exibido, **Then** fica indisponível ou contextualizado e não toma ação automática.

---

### User Story 6 - Avaliar políticas e proteção (Priority: P2)

Como administrador, quero visualizar registro, MFA legado, exigência por Acesso Condicional e uso efetivo separadamente para avaliar controles e exceções declaradas.

**Why this priority**: Evita confusão entre conceitos distintos de MFA.

**Independent Test**: Abrir a aba com fontes de política restritas ou disponíveis e confirmar procedência e estado em controles, políticas, exceções e verificações.

**Referência estrutural e cards**: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md): **MFA Protection Score** (gauge); controles **MFA para administradores**, **MFA para todos os usuários**, **Autenticação legada**, **Security Defaults** e **Contas de emergência**; tabelas **Política de Métodos de Autenticação**, **Forças de Autenticação** e **Acesso Condicional relacionado a MFA**; **Resumo de Proteções** (lista); **Exceções e Exclusões** (abas/tabela); **Status das Políticas** (lista).

**Acceptance Scenarios**:

1. **Given** fotografia de política publicada, **When** abre a aba, **Then** distingue cada controle e fonte sem inferir conformidade do registro MFA.
2. **Given** exceções ou pesos de score não aprovados, **When** os blocos são apresentados, **Then** ficam indisponíveis e nenhuma política pode ser alterada.

---

### User Story 7 - Priorizar usuários de risco (Priority: P3)

Como administrador, quero consultar riscos de identidade relacionados à autenticação para priorizar investigação, especialmente com privilégio e MFA.

**Why this priority**: A fonte depende de licença e consentimento específicos.

**Independent Test**: Abrir a aba restrita e validar a comunicação; com fonte publicada, filtrar e abrir dados minimizados sem remediação.

**Referência estrutural e cards**: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md): **KPI** (métrica: Risco total, Alto, Médio, Baixo, Logins de risco, Admins em risco); **Evolução de usuários de risco** (linhas); **Riscos por tipo** (donut); **Risco por localização** (mapa/lista); **Usuários de risco** (tabela); **Ações rápidas** (lista ordenada); **Insights e recomendações** (lista).

**Acceptance Scenarios**:

1. **Given** a fonte de risco restrita por licença ou consentimento, **When** abre a aba, **Then** entende a razão e não vê um conjunto vazio como ausência de risco.
2. **Given** riscos publicados, **When** filtra e seleciona um registro, **Then** vê contexto minimizado e orientação, sem revogar sessão ou redefinir senha.

---

### User Story 8 - Consultar histórico e auditoria (Priority: P3)

Como administrador, quero buscar mudanças de métodos, políticas, risco e futuras ações internas para entender origem e consultar detalhes minimizados.

**Why this priority**: Traz rastreabilidade, mas depende de auditoria, retenção e contrato de privacidade.

**Independent Test**: Aplicar período e categoria a eventos publicados, abrir um detalhe e confirmar origem Microsoft/Orkestria e ausência de PII excedente.

**Referência estrutural e cards**: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md): **KPI** (métrica: Eventos, Políticas, Métodos, Ações usuário, Falhas administrativas, Retenção); **Período de retenção** (KPI específico); **Eventos de auditoria** (tabela); **Filtros rápidos de atividade** (lista); **Origens dos eventos** (donut); **Retenção e armazenamento** (lista); **Ações disponíveis** (lista ordenada); **Detalhes do evento selecionado** (pares atributo/valor); **Informações adicionais** (estrutura colapsável).

**Acceptance Scenarios**:

1. **Given** eventos de auditoria publicados, **When** filtra por período e categoria e abre um evento, **Then** vê origem, resultado e detalhe minimizados.
2. **Given** auditoria ou retenção indisponível, **When** a aba é aberta, **Then** declara a limitação e mantém exportações e ações sensíveis indisponíveis.

### Edge Cases

- Resposta vazia válida é distinta de restrição, erro ou ausência de coleta.
- Falha após publicação preserva a última fotografia, identificando frescor, cobertura e motivo sanitizado; não infere zero.
- Em tela estreita, controles empilham, tabelas mantêm rolagem horizontal e foco permanece acessível.
- O módulo não oferece Atualizar: somente o sync atualiza os dados coletados; exportação, mudanças de tenant e remediações sensíveis permanecem indisponíveis nesta versão.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE oferecer as oito abas na ordem definida no discovery.
- **FR-002**: O sistema DEVE apresentar procedência, cobertura, frescor, disponibilidade e motivo sanitizado quando aplicável; disponibilidade, restrição, indisponibilidade, erro e resposta vazia válida devem ser distintos.
- **FR-003**: O sistema DEVE consumir estados publicados e preservar a última publicação utilizável quando uma coleta posterior falhar ou for restringida.
- **FR-003a**: A primeira entrega DEVE contemplar as fontes previstas para registro, eventos, políticas, risco e auditoria. Quando uma fonte depender de licença indisponível, cada card ou gráfico dependente DEVE ficar indisponível e informar, em texto, a licença necessária.
- **FR-003b**: O sistema DEVE aplicar a retenção já usada pelas coletas: eventos publicados de autenticação e auditoria seguem política por tenant, com padrão de 180 dias; fotografias de identidade, registro MFA e risco seguem retenção de 12 meses. Eventos ainda não publicados não podem ser removidos por essa rotina.
- **FR-004**: O sistema DEVE manter distintos elegibilidade, registro MFA, capacidade MFA, exigência por política e uso efetivo.
- **FR-004a**: O sistema DEVE calcular usuários elegíveis como usuários internos ativos, excluídas contas de recurso, caixas compartilhadas sem login, contas de sincronização e contas técnicas formalmente excepcionadas. Se qualquer dado necessário para uma exclusão ou exceção não estiver confiável ou publicado, a elegibilidade e seus percentuais derivados DEVEM ficar indisponíveis.
- **FR-004b**: O sistema DEVE manter uma tabela interna de classificação de segurança por método, sem interface de manutenção nesta versão. Seus valores iniciais são: Passkey/FIDO2, Windows Hello for Business e Certificado = Forte; Microsoft Authenticator com number matching = Recomendado; Software OATH = Intermediário; SMS e Ligação = Fraco; senha isolada = Crítico. A aplicabilidade de SMS e Ligação para `mobilePhone` continua dinâmica e definida pela política publicada.
- **FR-004c**: Para o valor Graph `mobilePhone`, o sistema DEVE usar os estados e os grupos incluídos/excluídos publicados pelas políticas SMS e Ligação, sem hardcode: se ambas estiverem desabilitadas, exibe somente Telefone móvel como Fraco; se somente uma estiver habilitada para a identidade, exibe somente o canal habilitado como Fraco; se ambas estiverem habilitadas para a identidade, exibe SMS e Ligação como Fracos. Se o escopo de grupos não puder ser resolvido, o canal fica indisponível.
- **FR-005**: O sistema DEVE permitir busca, filtros, paginação e detalhe apenas quando houver dados publicados, com identidades e contexto minimizados.
- **FR-006**: O sistema DEVE exibir a última coleta do módulo no cabeçalho, ou “Aguardando primeiro ciclo”.
- **FR-007**: O sistema NÃO DEVE exibir nem oferecer o controle Atualizar; somente o ciclo de sync atualiza os dados coletados e a interface exibe a data e hora da última coleta publicada.
- **FR-008**: Exportar, alteração de métodos, revogação de sessões, redefinição de senha, Temporary Access Pass, bloqueio e mudanças de política DEVEM permanecer `coming_soon` ou restritos até aprovação operacional, de privacidade e auditoria.
- **FR-009**: Score, recorrência, alertas e exceções DEVEM ser exibidos apenas quando regras e fontes forem aprovadas; caso contrário, devem declarar indisponibilidade sem limiar implícito. A classificação de método segue a tabela interna definida nesta especificação e a retenção exibida deve refletir a política efetiva da coleta.
- **FR-010**: O sistema DEVE fornecer resumo textual para gráficos, preservar títulos nos estados de disponibilidade e tornar controles operáveis por teclado e anunciáveis.
- **FR-011**: O sistema DEVE preservar shell, padrões de status e responsividade do Microsoft 365, incluindo controles empilhados e rolagem horizontal das tabelas.
- **FR-012**: Cada superfície DEVE implementar os cards nomeados em sua história, preservando ordem e finalidade da representação estrutural citada.
- **FR-013**: Todos os usuários autenticados DEVEM acessar as mesmas informações e capacidades; RBAC e diferenciação de acesso estão fora de escopo.

### Key Entities

- **Registro MFA atual**: Estado por identidade de registro, capacidade e métodos, com procedência e frescor.
- **Elegibilidade MFA**: Conjunto calculado de usuários internos ativos, após exclusões e exceções formalmente publicadas; não é calculado de forma parcial.
- **Snapshot de cobertura**: Fotografia temporal de cobertura e adoção, disponível somente com regra e ciclo aprovados.
- **Política de método e força**: Configuração de métodos, forças e controles com estado declarado de fonte.
- **Classificação de segurança do método**: Regra interna por método, iniciada pelos valores recomendados pelo sponsor e preparada para manutenção futura auditável.
- **Política de telefone**: Estado publicado de SMS e Ligação, com seus alvos, que determina os canais exibíveis para registros `mobilePhone`.
- **Evento de autenticação**: Registro minimizado de tentativa, resultado, contexto, método e correlação investigativa.
- **Sinal de risco**: Evidência de risco de identidade ou login, com nível, estado e condição de disponibilidade.
- **Exceção, alerta e auditoria**: Contextos internos dependentes de regra, workflow e retenção aprovados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em aceitação, 100% das oito abas exibem título, finalidade e estado explícito em todos os blocos com fonte não publicada.
- **SC-002**: Em 20 verificações de disponibilidade, restrição, indisponibilidade, erro e vazio válido, 100% não apresentam ausência de dados como zero ou sucesso.
- **SC-003**: Pelo menos 90% dos administradores de teste localizam uma lacuna de registro ou capacidade em até 3 minutos, sem assistência.
- **SC-004**: Pelo menos 90% dos administradores de teste distinguem corretamente registro, capacidade, exigência por política e uso efetivo.
- **SC-005**: Em testes de teclado e tela estreita, 100% dos destinos, filtros, CTAs permitidos e detalhes permanecem alcançáveis e compreensíveis.
- **SC-006**: Nenhuma alteração de tenant ou exportação é executável antes de aprovação operacional e de privacidade.

## Assumptions

- Esta versão é somente leitura para o público único e confiável da aplicação.
- Ordem, rótulos e composição seguem a representação estrutural; números e identidades das referências não são dados iniciais.
- Registro e identidades podem ser publicados como fotografia; eventos, políticas, risco e auditoria fazem parte da primeira entrega e podem ficar indisponíveis conforme permissões, retenção ou licença do tenant. Somente o ciclo de sync atualiza essas publicações.
- A experiência não executa consultas externas ad hoc para filtro, ordenação ou agregação; usa estados publicados com condição e frescor declarados.
- Eventos de autenticação e auditoria publicados seguem política de retenção configurável por tenant, inicialmente de 180 dias; snapshots de identidade, MFA e risco seguem a poda existente de 12 meses.
- Score, exceções, alertas, recorrência, retenção e ações dependem de decisão normativa, privacidade e workflow aprovados. A elegibilidade segue a regra recomendada pelo sponsor e fica indisponível quando os dados das exclusões ou exceções não forem confiáveis. A classificação de segurança inicia com os valores do DOCX e não tem interface de manutenção nesta versão; os canais de telefone seguem os estados publicados das políticas SMS e Ligação.
- Exportação e ciclo de vida de dados pessoais ainda não estão aprovados; a interface minimiza identidades e contexto sensível.
