# Feature Specification: Modos Operacionais do Sync Microsoft 365

**Feature Branch**: `feat/008-sync-operation-flags`
**Created**: 2026-08-13
**Status**: Draft
**Input**: "Planeje a implementação das 4 flags" para distinguir execução forçada, recoleta por período, recoleta por data e recoleta do dia no ciclo Microsoft 365.

## Clarifications

### Session 2026-08-13

- Q: Como deve ficar o agendamento que hoje usa `--full-reconciliation`? → A: Substituir pela execução semanal com `--recollect-today`.
- Q: Como `--force` deve tratar fontes que respondem com a mesma versão ou conteúdo já publicados? → A: Consultar todas as fontes e manter a reutilização/deduplicação de conteúdo inalterado.
- Q: Durante `--force` ou qualquer `--recollect-*`, como tratar uma etapa dependente quando sua fonte primária falha? → A: Tentar todas as fontes independentes e pular as etapas dependentes com motivo explícito.
- Q: As flags de recoleta se aplicam apenas aos coletores de eventos temporais? → A: Não. As quatro flags são globais: todos os coletores do ciclo recebem o mesmo modo; a janela de período/data é usada pelas fontes temporais, enquanto os demais coletores executam a reconstrução/fotografia compatível com a sua fonte.
- Q: Quais valores `--recollect-days` aceita? → A: A interface numérica aceita somente `7`, `30`, `90` ou `180`, correspondentes aos períodos Learn `D7`, `D30`, `D90` e `D180`. `D60` não é período aceito nos endpoints de relatório Microsoft Graph validados.
- Q: Como uma recoleta da data atual, explícita ou por `--recollect-today`, declara sua cobertura antes do fim do dia? → A: Solicita o dia civil completo, mas publica como parcial somente o intervalo observável até `observedAt`, instante UTC congelado uma única vez no início do ciclo e compartilhado por todas as fontes; nunca declara horas futuras como coletadas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Executar o ciclo fora da cadência normal (Priority: P1)

Como administrador do tenant, quero forçar a execução completa do ciclo agora, sem reiniciar seu progresso incremental, para atualizar todas as fontes quando necessário.

**Why this priority**: Permite uma intervenção operacional simples sem alterar cursores, janelas de histórico ou dados publicados.

**Independent Test**: Pode ser validada iniciando um ciclo com `--force` após uma execução concluída e verificando que todas as fontes elegíveis executam, preservando seus pontos incrementais.

**Referência estrutural e cards**: N/A — operação de linha de comando sem superfície visual.

**Acceptance Scenarios**:

1. **Given** que uma ou mais fontes já foram concluídas na cadência atual, **When** o administrador executa o ciclo com `--force`, **Then** todas as fontes do ciclo são tentadas novamente sem resetar seus cursores ou watermarks.
2. **Given** que outro ciclo do mesmo tenant está ativo, **When** o administrador executa o ciclo com `--force`, **Then** a nova execução é recusada e a execução em curso permanece exclusiva.

---

### User Story 2 - Recoletar um período histórico (Priority: P1)

Como administrador do tenant, quero reconstruir o ciclo para uma janela histórica definida em dias, para corrigir ou completar dados coletados em um período anterior.

**Why this priority**: Recupera dados e relações potencialmente divergentes sem exigir uma limpeza manual nem deixar as telas sem uma publicação válida.

**Independent Test**: Pode ser validada executando `--recollect-days=180` e verificando que todos os coletores entram no modo de reconstrução e que os eventos cobrem exatamente a janela solicitada, limitada pela disponibilidade da fonte.

**Referência estrutural e cards**: N/A — operação de linha de comando sem superfície visual.

**Acceptance Scenarios**:

1. **Given** que há dados incrementais publicados, **When** o administrador executa `--recollect-days=180`, **Then** coleções de estado e relações são reconstruídas a partir do estado atual completo e eventos são recoletados entre 00:00:00 do dia civil atual menos 180 dias e 00:00:00 do dia civil atual, no timezone do tenant.
2. **Given** que a fonte limita a disponibilidade histórica, **When** a janela solicitada começa antes do limite disponível, **Then** o ciclo registra e publica a cobertura realmente obtida sem apresentar a parte indisponível como coletada.
3. **Given** que uma recoleta falha antes de publicar uma fonte, **When** o ciclo termina, **Then** a última publicação válida dessa fonte continua disponível.

---

### User Story 3 - Recoletar uma data informada (Priority: P2)

Como administrador do tenant, quero reconstruir o ciclo e recoletar eventos de uma data específica, para investigar ou corrigir um dia determinado.

**Why this priority**: Permite recuperação e diagnóstico precisos sem uma varredura histórica desnecessária.

**Independent Test**: Pode ser validada executando `--recollect-date=2026-08-13` e verificando que os eventos usam o início e o fim daquele dia no timezone do tenant, enquanto as fontes de estado são reconstruídas como fotografia atual.

**Referência estrutural e cards**: N/A — operação de linha de comando sem superfície visual.

**Acceptance Scenarios**:

1. **Given** uma data válida, **When** o administrador executa `--recollect-date=AAAA-MM-DD`, **Then** os eventos são recoletados somente no dia civil informado, conforme o timezone configurado para o tenant.
2. **Given** uma data inválida ou futura, **When** o administrador informa `--recollect-date`, **Then** o comando falha antes de iniciar o ciclo e informa como corrigir o valor.

---

### User Story 4 - Recoletar hoje rapidamente (Priority: P3)

Como administrador do tenant, quero usar um atalho para a recoleta da data atual, para reprocessar rapidamente o dia em curso.

**Why this priority**: Reduz erro manual na operação mais frequente de recoleta por data.

**Independent Test**: Pode ser validada executando `--recollect-today` e verificando que o resultado equivale a executar `--recollect-date` com a data atual do timezone do tenant.

**Referência estrutural e cards**: N/A — operação de linha de comando sem superfície visual.

**Acceptance Scenarios**:

1. **Given** o timezone configurado para o tenant, **When** o administrador executa `--recollect-today`, **Then** o ciclo usa os mesmos limites temporais que a recoleta explícita da data atual daquele timezone.
2. **Given** que a execução ocorre perto da mudança de dia, **When** o ciclo inicia, **Then** a data é determinada uma única vez no início do ciclo e permanece consistente até seu término.
3. **Given** que o dia atual ainda não terminou, **When** o administrador executa `--recollect-today`, **Then** o resultado identifica o dia civil completo como solicitado, mas a cobertura efetiva de todas as fontes temporais termina no mesmo `observedAt` UTC congelado no início do ciclo e fica marcada como parcial por dia em curso.

### Edge Cases

- `--recollect-days` aceita somente os inteiros `7`, `30`, `90` ou `180`; zero, negativos, `60`, outros inteiros e valores não numéricos são rejeitados antes de iniciar o ciclo.
- `--recollect-days`, `--recollect-date` e `--recollect-today` não podem ser usados juntos.
- Uma fonte sem histórico temporal reconstrói apenas sua fotografia atual completa; ela não deve alegar uma reconstrução histórica que a fonte não oferece.
- Falhas, restrições ou indisponibilidade de uma fonte mantêm sua última publicação válida e deixam o resultado/razão explícitos.
- Falhas de uma fonte não interrompem fontes independentes; etapas dependentes não usam publicação anterior como substituta da dependência exigida no ciclo atual.
- Nenhum modo ignora a exclusividade de uma sincronização ativa do mesmo tenant.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O comando sem flags DEVE manter a coleta incremental cotidiana atual, usando os pontos de progresso publicados de cada fonte.
- **FR-002**: O sistema DEVE oferecer `--force` como modo global que tenta novamente todos os coletores do ciclo, ignorando controles de cadência e preservando cursores, watermarks e outras posições incrementais; cada fonte consultada DEVE manter sua deduplicação ou reutilização normal quando confirmar que o conteúdo não mudou.
- **FR-003**: O sistema DEVE oferecer `--recollect-days=N` como modo global de reconstrução para todos os coletores, onde `N` é obrigatoriamente um dos períodos numéricos `7`, `30`, `90` ou `180`, correspondentes a `D7`, `D30`, `D90` e `D180` da documentação Microsoft Learn.
- **FR-004**: No modo `--recollect-days=N`, fontes temporais DEVEM recoletar a janela entre 00:00:00 do dia civil atual menos `N` dias e 00:00:00 do dia civil atual, no timezone do tenant, convertida para UTC; a hora em que o comando foi disparado não altera esses limites. Fontes de estado DEVEM reconstruir a fotografia completa atual e todas as relações disponíveis.
- **FR-005**: O sistema DEVE oferecer `--recollect-date=AAAA-MM-DD` como modo global de reconstrução que recoleta fontes temporais dentro do dia civil informado no timezone do tenant e reconstrói as demais fontes como fotografia atual completa.
- **FR-006**: O sistema DEVE oferecer `--recollect-today` como atalho funcionalmente equivalente a `--recollect-date` resolvido para a data atual do timezone do tenant no começo do ciclo.
- **FR-007**: Qualquer modo `--recollect-*` DEVE obrigar a execução de todos os coletores e dispensar controles de cadência, reutilização e progresso incremental que impediriam uma reconstrução.
- **FR-008**: O sistema DEVE validar as combinações de opções antes de iniciar o ciclo: os três modos `--recollect-*` são mutuamente exclusivos e `--force` não pode acompanhar nenhum modo de recoleta, pois a recoleta já impõe a reconstrução global.
- **FR-009**: Nenhuma das quatro flags DEVE contornar a exclusividade de sincronização por tenant.
- **FR-010**: Em todos os modos, a substituição dos dados publicados de cada fonte DEVE ocorrer somente após uma coleta válida dessa fonte; falhas DEVEM preservar a última publicação válida e seu estado de disponibilidade.
- **FR-011**: O resultado operacional do ciclo DEVE identificar claramente o modo solicitado, a janela temporal efetiva quando aplicável, a cobertura efetivamente disponível e qualquer limitação de fonte.
- **FR-011a**: `SyncOperation` DEVE congelar `observed_at` em UTC uma única vez no início do ciclo e todas as fontes temporais DEVEM usá-lo como o mesmo teto de leitura/publicação quando a janela solicitada inclui horas futuras. A cobertura de cada fonte temporal DEVE separar `requested_window`, `effective_window`, `coverage_status`, `limitation_reason`, `source_limit_at` e `collected_through_at`. Em uma recoleta da data atual — por `--recollect-date` ou `--recollect-today` — antes de seu fim, `coverage_status` DEVE ser `partial`, `effective_window` e `collected_through_at` DEVEM terminar em `observed_at` e a razão DEVE informar que o dia está em curso.
- **FR-011b**: Uma recoleta NÃO DEVE avançar, resetar nem substituir os cursores/watermarks incrementais publicados; suas janelas e publicações são evidência de reconstrução/backfill. Somente rotina e `--force` podem atualizar posições incrementais após publicação válida.
- **FR-012**: A opção legada `--full-reconciliation` DEVE ser removida da interface pública; o agendamento semanal que a usa DEVE passar a executar `--recollect-today` e quaisquer outros consumidores DEVEM usar um dos novos modos explicitamente definidos.
- **FR-013**: Em todos os quatro modos, fontes independentes DEVEM continuar sendo tentadas após a falha de outra fonte; uma etapa dependente sem publicação válida de sua dependência no ciclo atual DEVE ser pulada e registrar o motivo de modo explícito.
- **FR-014**: O lock global por tenant DEVE permanecer válido durante todo o ciclo, inclusive paginação ou retries de uma recoleta de 180 dias; a execução DEVE renovar o TTL de seu próprio lock antes de expirar, entre páginas/retries e antes de cada etapa segura. Se a renovação falhar ou perder ownership, o ciclo DEVE abortar antes de nova publicação e uma segunda execução não pode adquiri-lo enquanto a primeira estiver saudável.

### Key Entities *(include if feature involves data)*

- **Modo operacional do ciclo**: Intenção de execução selecionada pelo administrador: rotina, forçada, recoleta por período, por data ou pela data atual.
- **Janela de recoleta**: Intervalo temporal efetivo aplicado às fontes que oferecem histórico, incluindo timezone, limites solicitados e cobertura realmente obtida.
- **Ponto de progresso da fonte**: Estado que permite coleta incremental ou reutilização e que pode ser preservado, ignorado durante uma reconstrução ou registrado novamente após êxito.
- **Publicação de fonte**: Último conjunto de dados válido consumido pelas telas, que é preservado caso a nova coleta não possa ser concluída.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Operadores conseguem iniciar cada um dos quatro modos documentados com um único comando, e valores inválidos são recusados antes de qualquer fonte iniciar coleta.
- **SC-002**: Em 100% das execuções de recoleta concluídas com sucesso, o relatório operacional identifica o modo e a janela temporal efetiva quando existe uma janela temporal.
- **SC-003**: Em 100% das falhas de uma fonte durante os modos de recoleta, a última publicação válida daquela fonte permanece consultável e o resultado registra uma razão compreensível.
- **SC-004**: Uma execução de `--recollect-today` produz a mesma janela temporal que `--recollect-date` com a data atual do tenant, em testes realizados nos limites de mudança de dia.
- **SC-005**: Nenhuma combinação das quatro flags permite duas sincronizações simultâneas para o mesmo tenant.

## Assumptions

- A audiência continua sendo única e confiável; as flags são operadas por pessoas que já têm acesso ao ambiente de execução, sem introduzir RBAC.
- A data civil é determinada pelo timezone já configurado para o tenant e não pelo timezone da máquina que dispara o comando. Toda recoleta usa limites de dia civil: início inclusivo às 00:00:00 e fim exclusivo no início do dia seguinte ou, em recoleta por período, no início do dia atual.
- Uma recoleta da data local atual, explícita ou por `--recollect-today`, preserva como janela solicitada `[00:00, próximo 00:00)`, mas antes do fim do dia sua janela efetiva termina em `observed_at` e é parcial; isso mantém a equivalência entre os dois modos.
- Fontes de estado sem histórico só podem entregar uma fotografia atual completa; uma solicitação de período não cria evidência histórica inexistente.
- `--force` é exclusivo do modo forçado: não pode ser combinado a `--recollect-*`, pois toda recoleta já força a execução global. No modo `--force`, conteúdo inalterado continua sujeito à deduplicação/reutilização normal da fonte.
- `--fresh` para reiniciar individualmente o progresso de uma fonte foi discutido, mas está fora do escopo destas quatro flags e poderá ser especificado como uma operação de manutenção separada.
- Não há nova tela, tab ou subpágina; por isso as histórias não exigem representação estrutural de telas.

## Out of Scope

- A flag `--fresh=fonte|all` e a remoção física antecipada de dados publicados.
- Consultar dados históricos que a fonte externa não disponibiliza.
- Contornar locks de execução, executar ciclos simultâneos ou alterar permissões de acesso.
