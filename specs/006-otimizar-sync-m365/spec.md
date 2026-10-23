# Feature Specification: Otimização dos Syncs Microsoft 365

**Feature Branch**: `feat/006-otimizar-sync-m365`  
**Created**: 2026-08-11  
**Status**: Draft  
**Input**: User description: "Vamos implementar os ajustes com base no que alinhamos no MICROSOFT365-SYNC-AVALIACAO.md"

## Clarifications

### Session 2026-08-11

- Q: Qual será a frequência da reconciliação completa de relacionamentos de grupo? → A: Semanal.
- Q: Por quanto tempo os eventos de entrada e auditoria devem ser retidos? → A: 180 dias, com retenção operacionalmente ajustável para evolução do POC.
- Q: Qual será a sobreposição da janela de eventos? → A: 15 minutos.
- Q: Se uma fonte primária falhar durante o ciclo coordenado, qual política deve ser aplicada às demais etapas? → A: Publicar etapas independentes e pular as dependentes.

## User Scenarios & Testing *(mandatory)*

**Exceção de superfícies**: as telas existentes de Usuários e Contas, Grupos e Licenciamento não formam novas jornadas separadas nesta feature; elas consomem as mesmas gerações e estados de fonte. As tarefas devem, porém, validar em cada superfície afetada que cobertura, frescor e indisponibilidade não alteram o significado dos dados publicados.

### User Story 1 - Dados consolidados confiáveis (Priority: P1)

Como administrador do tenant, quero que uma sincronização consolide Usuários, Licenciamento e Grupos a partir de uma mesma fotografia de dados, para consultar informações consistentes sem esperar leituras repetidas da mesma fonte.

**Why this priority**: A eliminação de leituras redundantes ataca diretamente a lentidão atual e evita divergência entre módulos que descrevem o mesmo recurso.

**Independent Test**: Executar um ciclo coordenado com dados de usuários alterados e verificar que as visões de Usuários e Licenciamento usam a mesma fotografia publicada, sem uma segunda coleta completa de usuários.

**Acceptance Scenarios**:

1. **Given** uma fotografia de usuários válida e atual, **When** o ciclo coordenado executar, **Then** Licenciamento será atualizado a partir dessa fotografia e não solicitará uma nova coleção completa de usuários.
2. **Given** alterações, inclusões ou remoções de usuários e grupos desde o último ciclo bem-sucedido, **When** a sincronização incremental executar, **Then** a fotografia publicada refletirá essas mudanças sem uma nova varredura completa da coleção.
3. **Given** uma coleção de auditoria disponível para o ciclo, **When** as projeções de Usuários e Grupos forem atualizadas, **Then** ambas usarão a mesma coleção canônica de eventos.

---

### User Story 2 - Histórico de auditoria íntegro (Priority: P1)

Como administrador do tenant, quero que os sinais de entrada e auditoria cubram integralmente cada janela sincronizada, para que as análises não confundam uma amostra recente com histórico completo.

**Why this priority**: A primeira página de eventos não representa todo o período e pode ocultar atividade relevante para governança e segurança.

**Independent Test**: Simular uma janela com múltiplas páginas, reexecutar uma janela parcialmente processada e confirmar que todos os eventos foram publicados uma vez, sem lacunas ou duplicidades.

**Acceptance Scenarios**:

1. **Given** eventos distribuídos em mais de uma página dentro da janela pendente, **When** a coleta de eventos terminar com sucesso, **Then** todos os eventos da janela serão persistidos e a cobertura registrada.
2. **Given** uma falha antes do fim da janela, **When** o próximo ciclo iniciar, **Then** a posição de progresso anterior será preservada e os eventos reprocessados não criarão duplicidades.
3. **Given** a coleta incremental de entradas ainda não estiver disponível, **When** um usuário visualizar esses dados, **Then** a interface identificará o resultado como um recorte recente, e não como histórico completo.

---

### User Story 3 - Operação previsível da sincronização (Priority: P2)

Como responsável pela operação do tenant, quero iniciar e acompanhar um único ciclo coordenado de sincronização, para entender suas etapas, duração, cobertura e falhas sem depender de comandos isolados.

**Why this priority**: O fluxo atual é fragmentado, pode competir por recursos e não fornece evidência suficiente para diagnosticar lentidão ou limitação da fonte.

**Independent Test**: Executar o ciclo coordenado com uma fonte secundária indisponível e verificar que o resultado expõe a etapa afetada, preserva a última fotografia íntegra e permite a recuperação no ciclo seguinte.

**Acceptance Scenarios**:

1. **Given** o agendamento diário às 03:00 no fuso horário configurado do tenant, **When** chegar o horário de sincronização, **Then** o sistema executará um único ciclo coordenado com etapas e dependências explícitas.
2. **Given** uma fonte secundária falhar, **When** o ciclo for concluído, **Then** a última fotografia íntegra continuará disponível e o estado da fonte indicará a indisponibilidade.
3. **Given** um ciclo concluído, **When** o responsável consultar seu resultado, **Then** poderá identificar duração, itens processados, páginas, tentativas, limitação de taxa e motivo de falha por etapa.
4. **Given** a falha de uma fonte primária, **When** o ciclo coordenado prosseguir, **Then** etapas independentes poderão publicar sua nova geração e cada etapa dependente será pulada, preservando sua última fotografia íntegra.

### Edge Cases

- Uma posição de progresso de uma coleção incremental fica inválida ou expira: o sistema executa uma reconciliação completa excepcional sem publicar dados parciais.
- Eventos chegam à fonte com atraso ou são repetidos em janelas adjacentes: a sobreposição de janelas não pode produzir registros duplicados.
- Um relacionamento indireto de grupo não pode ser coletado: a projeção o apresenta como indisponível, nunca como zero por ausência de dados.
- A execução ultrapassa a duração esperada ou recebe limitação de taxa: a exclusividade da execução é preservada e as novas tentativas respeitam a orientação recebida da fonte.
- Um relatório periódico não possui atualização nova: a última fotografia válida continua publicada, com seu frescor identificável.
- A duração de retenção é alterada: o novo prazo é aplicado à manutenção subsequente sem comprometer as fotografias publicadas.
- Uma fonte primária falha: etapas independentes seguem o ciclo; etapas dependentes permanecem com sua última geração íntegra e declaram que foram puladas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE disponibilizar um ciclo coordenado único diário às 03:00 no fuso horário configurado do tenant, que organize a atualização de Licenciamento, Usuários e Contas e Grupos, respeitando dependências entre suas etapas.
- **FR-002**: O sistema DEVE manter uma fotografia canônica de identidades que contenha os dados necessários às visões de Usuários, Atividade e Licenciamento; uma fotografia válida não pode ser coletada novamente apenas para atender outra visão.
- **FR-003**: O sistema DEVE manter uma coleção canônica de eventos de auditoria e derivar dela as projeções de Usuários e Grupos durante o mesmo ciclo.
- **FR-004**: O sistema DEVE aplicar alterações incrementais de identidades e grupos, incluindo inclusões, modificações e remoções, e usar uma reconciliação completa somente como recuperação ou verificação periódica.
- **FR-005**: O sistema DEVE tratar eventos de entrada e auditoria como coleções temporais: cobrir todas as páginas da janela, tolerar uma sobreposição inicial de 15 minutos, impedir duplicidades e avançar a posição de progresso somente após publicação bem-sucedida de toda a janela.
- **FR-006**: O sistema DEVE registrar para cada etapa executada início, fim, duração, quantidade de itens, páginas, tentativas, limitação de taxa, resultado e motivo de falha, de forma consultável pela operação.
- **FR-007**: O sistema DEVE manter a última fotografia íntegra publicada se uma fonte secundária falhar e expor explicitamente o estado de disponibilidade e frescor daquela fonte.
- **FR-008**: O sistema DEVE atualizar relações e verificações derivadas de grupos somente quando o grupo for afetado ou durante uma reconciliação completa semanal, preservando a detecção de remoções.
- **FR-009**: O sistema DEVE publicar dados de relacionamentos indiretos de grupo somente quando forem efetivamente coletados; caso contrário, deve informá-los como indisponíveis.
- **FR-010**: O sistema DEVE reutilizar a última fotografia válida de relatórios periódicos enquanto não houver uma atualização mais recente da fonte.
- **FR-011**: O sistema DEVE preservar a exclusividade de uma execução saudável durante toda a sua duração e aplicar novas tentativas de forma compatível com o tempo de espera indicado pela fonte.
- **FR-012**: O sistema DEVE evitar publicar resultados parciais e manter a promoção de uma nova fotografia como uma operação curta e atômica.
- **FR-013**: Enquanto a cobertura completa de entradas não estiver disponível, a interface DEVE declarar claramente que os dados representam apenas um recorte recente.
- **FR-014**: O sistema DEVE preservar os contratos atuais das telas de Licenciamento, Usuários e Contas e Grupos, exceto pela comunicação explícita de frescor, cobertura ou indisponibilidade quando aplicável.
- **FR-015**: A feature NÃO inclui reativar ou expandir a visão geral inativa do Microsoft 365, criar controles de acesso, nem adicionar novas fontes de dados além das já avaliadas.
- **FR-016**: O sistema DEVE reter eventos de entrada e auditoria por 180 dias e permitir o ajuste operacional desse prazo para a evolução do POC, sem exigir alteração do fluxo de sincronização.
- **FR-017**: Quando uma fonte primária falhar, o sistema DEVE publicar as etapas independentes que concluíram com sucesso, pular as etapas dependentes e preservar a última geração íntegra destas, declarando o motivo de não atualização.
- **FR-018**: O sistema DEVE publicar, inclusive para as fontes próprias de Licenciamento, uma data de referência, cobertura completa ou recorte recente, e estado fresco, defasado, indisponível ou restrito sem transformar ausência de coleta em valor zero.
- **FR-019**: Quando uma fotografia canônica contiver o superset necessário, as visões DEVEM aplicar seleção de campos, ordenação, limite e filtros no dado local; uma nova chamada Graph só pode ocorrer para uma fonte com semântica, permissão, retenção ou frescor distintos.
- **FR-020**: Roles, elegibilidades PIM, registros MFA e sinais de risco DEVEM permanecer snapshots periódicos independentes, cada um com estado de fonte, data de referência, cobertura e frescor próprios; não devem ser tratados como delta ou watermark sem contrato específico.
- **FR-021**: Relações usuário–grupo DEVEM ser atualizadas para identidades afetadas e passar por reconciliação completa semanal, de modo que uma alteração de associação sem delta da identidade não permaneça indefinidamente sem detecção.

### Key Entities *(include if feature involves data)*

- **Ciclo coordenado**: Uma execução identificável que reúne etapas dependentes de sincronização e seu resultado operacional.
- **Fotografia canônica**: Conjunto íntegro e publicado de dados de um recurso compartilhado, reutilizável por mais de uma visão.
- **Geração publicada**: Versão consistente de uma fotografia que permanece disponível até uma nova versão completa ser promovida.
- **Posição incremental**: Estado de progresso que permite retomar atualizações de recursos de estado ou de eventos sem reler todo o histórico.
- **Janela de eventos**: Intervalo temporal efetivamente coberto por uma coleta de auditoria, incluindo a sobreposição preventiva inicial de 15 minutos.
- **Estado da fonte**: Frescor, disponibilidade, cobertura e motivo de falha mais recente de uma fonte de dados.
- **Relacionamento de grupo**: Associação direta ou indireta entre grupo e objeto relacionado, com cobertura e disponibilidade explícitas.
- **Política de retenção**: Prazo operacional aplicável aos eventos persistidos, inicialmente definido em 180 dias.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos ciclos incrementais válidos verificados, cada coleção canônica compartilhada é obtida no máximo uma vez por ciclo e abastece todas as visões dependentes.
- **SC-002**: Em 100% dos cenários de teste com múltiplas páginas de eventos, todos os eventos dentro da janela coberta são publicados exatamente uma vez, inclusive após repetição de uma janela por falha.
- **SC-003**: Em 100% dos cenários de falha de uma fonte secundária, a última geração íntegra permanece disponível e apresenta estado de indisponibilidade e frescor identificáveis.
- **SC-004**: Em uma execução de referência com 10.000 grupos, as leituras derivadas por grupo incidem apenas sobre grupos alterados no ciclo, exceto na reconciliação completa semanal.
- **SC-005**: Em 10 execuções saudáveis consecutivas medidas, nenhuma segunda execução concorrente é iniciada antes do encerramento da primeira.
- **SC-006**: O responsável consegue identificar, para 100% dos ciclos concluídos, o resultado e as métricas de cada etapa sem analisar registros técnicos brutos.
- **SC-007**: Todos os fluxos existentes de Licenciamento, Usuários e Contas e Grupos continuam apresentando dados compatíveis com seus contratos atuais após a publicação de uma nova geração.
- **SC-008**: Uma alteração da política de retenção entra em vigor na manutenção subsequente sem interromper um ciclo coordenado nem invalidar uma geração já publicada.
- **SC-009**: Em 100% dos cenários de falha de uma fonte primária, nenhuma etapa dependente publica dados calculados sobre uma fotografia desatualizada, enquanto etapas independentes bem-sucedidas permanecem disponíveis.
- **SC-010**: Em 100% dos cenários de scheduler testados, há somente um ciclo diário às 03:00 no fuso do tenant e uma fonte só é apresentada como fresca se sua última publicação íntegra tiver menos de 26 horas.
- **SC-011**: Em 100% dos cenários de tela com filtros, ordenação, limite ou seleção já cobertos pela fotografia canônica, a projeção é calculada localmente sem nova chamada Graph.
- **SC-012**: Em cenários de alteração de associação sem delta da identidade, a reconciliação semanal recupera a relação; roles, PIM, MFA e risco publicam estado de snapshot independente, sem serem apresentados como coleção incremental.

## Assumptions

- O tenant mantém acesso às fontes de dados já utilizadas pelo produto e permite leituras suficientes para a coleta incremental e as reconciliações programadas.
- A primeira execução após a entrega pode demandar uma carga completa para estabelecer fotografias e posições iniciais.
- Os eventos de entrada e auditoria serão retidos por 180 dias inicialmente; o prazo será ajustável operacionalmente caso o POC evolua para produto.
- A sobreposição inicial das janelas de eventos será de 15 minutos e permanecerá ajustável operacionalmente conforme a observação de atraso de disponibilidade.
- A reconciliação completa semanal para relações de grupo terá frequência separada do ciclo incremental.
- Todos os usuários autenticados da aplicação pertencem à mesma audiência confiável; controles de acesso por perfil permanecem fora de escopo.
- As telas existentes serão reutilizadas; não há uma nova tela de produto nesta feature, apenas estados de frescor, cobertura e disponibilidade onde necessários.
- A visão geral Microsoft 365 permanece inativa durante esta entrega.
- As dependências entre etapas serão explicitadas no planejamento; uma falha de fonte primária não impede a publicação de etapas independentes bem-sucedidas.
- O horário padrão do ciclo coordenado é 03:00 no timezone armazenado em TenantActivitySetting; uma fonte é considerada fresca por até 26 horas após sua última publicação íntegra.

## Dependencies

- Diagnóstico e decisões: MICROSOFT365-SYNC-AVALIACAO.md (referência histórica não disponível neste escopo).
- Contratos de dados e sincronizações atuais de Licenciamento, Usuários e Contas e Grupos.
- Ambiente de teste capaz de simular coleções paginadas, falhas transitórias, repetição de eventos e mudanças incrementais.
