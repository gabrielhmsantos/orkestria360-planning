# Feature Specification: Microsoft 365 — OneDrive UI

**Feature Branch**: `feat/014-onedrive-ui`

**Created**: 2026-09-12

**Status**: Draft

**Input**: Interface completa e somente leitura do módulo OneDrive, baseada nos contratos e fixtures reconciliados do Discovery.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Orientar a investigação do OneDrive (Priority: P1)

Como administrador, quero abrir a visão executiva e avançar para a superfície operacional pertinente para compreender uso, capacidade, conteúdo, compartilhamentos e atividade sem confundir ausência de dado com um resultado saudável.

**Why this priority**: A jornada entrega a leitura inicial e as investigações operacionais que permitem priorizar o trabalho administrativo diário.

**Independent Test**: Selecionar o cenário `populated` de Dashboard Executivo e percorrer as superfícies Dashboard Executivo, Contas e Armazenamento, Arquivos e Conteúdo, Compartilhamento e Acessos e Atividade e Sincronização usando somente os fixtures aprovados.

**Acceptance Scenarios**:

1. **Given** o cenário `populated` do Dashboard Executivo, **When** o administrador abre o módulo, **Then** vê os KPIs, análises e listas que possuem publicação e painéis explícitos apenas nas regiões indisponíveis.
2. **Given** uma conta publicada, **When** o administrador filtra, pagina e abre seu contexto, **Then** a lista preserva consulta e página ao fechar o detalhe e não apresenta cálculo de utilização quando a capacidade alocada não estiver publicada.
3. **Given** registros sintéticos de conteúdo, compartilhamento ou atividade, **When** o administrador aplica os filtros aprovados, **Then** a coleção e análises compatíveis refletem o recorte, a primeira página é restaurada e a interface anuncia o resultado.
4. **Given** um bloco com classificação, risco, telemetria ou tendência indisponível, **When** a superfície é exibida, **Then** ele não é rotulado como baixo risco, saudável ou vazio.

---

### User Story 2 - Acompanhar governança sem executar ações não aprovadas (Priority: P1)

Como administrador, quero acompanhar casos de desligamento, retenção, postura e recomendações para investigar prioridades de governança, sem que a interface prometa transferência, exclusão, correção ou mudança de política.

**Why this priority**: Conteúdo de pessoas desligadas e postura de segurança são jornadas de governança com impacto direto em risco e continuidade.

**Independent Test**: Exercitar os cenários `populated`, `partial`, `unavailable` e `restricted` do fixture de Usuários Desligados e Retenção, além de `populated` (com blocos `partial`), `unavailable` e `restricted` do fixture de Configurações e Segurança.

**Acceptance Scenarios**:

1. **Given** um caso de desligamento publicado com campos nulos, **When** o administrador consulta a tabela e o processo, **Then** responsável, retenção, prazo e progresso ausentes permanecem explicitamente não publicados, sem etapa ou workflow inventado.
2. **Given** a postura publicada parcialmente, **When** o administrador abre Configurações e Segurança, **Then** políticas disponíveis são apresentadas como leitura e score, riscos ou categorias sem publicação mostram disponibilidade em vez de pontuação ou conformidade inferida.
3. **Given** recomendações ou contexto de investigação sem destino publicado, **When** o administrador os visualiza, **Then** não há ligação ou controle que simule uma ação corretiva.

---

### User Story 3 - Investigar eventos com cobertura explícita (Priority: P2)

Como administrador, quero filtrar eventos de auditoria, examinar seu contexto e entender a cobertura do recorte para investigar atividade sem concluir que campos ou eventos ausentes não ocorreram.

**Why this priority**: A investigação temporal complementa as leituras operacionais e preserva o caráter auditável do módulo.

**Independent Test**: Exercitar os cenários `populated`, `empty`, `partial`, `restricted`, `stale` e `failed` do fixture de Histórico e Auditoria, incluindo seleção e fechamento de evento.

**Acceptance Scenarios**:

1. **Given** eventos publicados, **When** o administrador aplica os filtros e seleciona um evento, **Then** o detalhe abre no fluxo, mostra somente campos publicados e retorna o foco para a linha de origem ao fechar.
2. **Given** cobertura parcial de fonte ou campos sensíveis, **When** o resultado é exibido, **Then** a cobertura fica associada à consulta e os campos não publicados não recebem valores substitutos.
3. **Given** o resultado fica vazio após a consulta ou o evento selecionado deixa de existir no recorte, **When** a tabela é atualizada, **Then** a consulta permanece visível, o detalhe é fechado e o estado factual é anunciado.

---

### User Story 4 - Interpretar disponibilidade e frescor de forma confiável (Priority: P1)

Como administrador, quero distinguir dados vazios, parciais, indisponíveis, restritos, desatualizados e falhos em todas as superfícies para tomar decisões proporcionais à evidência publicada.

**Why this priority**: Esta semântica é transversal e impede que uma interface aparentemente completa falsifique a verdade factual do tenant.

**Independent Test**: Para cada uma das oito superfícies, selecionar todos os cenários presentes no fixture correspondente e verificar a composição da superfície e de cada bloco de disponibilidade.

**Acceptance Scenarios**:

1. **Given** um cenário `empty` disponível, **When** o administrador consulta a região, **Then** vê uma mensagem factual de nenhum resultado, filtros preservados e total zero somente quando publicado.
2. **Given** um cenário `partial`, **When** a superfície é exibida, **Then** os blocos confirmados permanecem visíveis e a lacuna de cobertura é declarada sem retry inventado.
3. **Given** um cenário `stale`, `unavailable`, `restricted` ou `failed`, **When** a superfície é exibida, **Then** o snapshot datado, a indisponibilidade, a restrição ou a falha têm tratamento próprio e não são convertidos entre si.

### Edge Cases

- Capacidade alocada nula ou zero não gera percentual de utilização; a região explica que o cálculo não está disponível.
- Coleção publicada vazia é preservada como vazia factual, inclusive quando outra região da mesma superfície é parcial ou indisponível.
- Campos nulos de risco, sensibilidade, conformidade, destinatário, dispositivo, geolocalização, retenção, previsão ou evento não recebem classificação, identidade, data ou resultado substituto.
- Um estado `failed` remove somente o resultado falho, conserva o recorte visível e não oferece retry sem contrato.
- Em tela estreita, tabelas largas mantêm suas colunas em rolagem horizontal, sem uma segunda área de rolagem vertical; tabs continuam acessíveis horizontalmente.
- Se o item selecionado não estiver mais no resultado após filtro ou paginação, o contexto é fechado e o foco retorna a um ponto válido da consulta.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A interface DEVE disponibilizar as oito superfícies na seguinte ordem invariável: Dashboard Executivo, Contas e Armazenamento, Arquivos e Conteúdo, Compartilhamento e Acessos, Atividade e Sincronização, Usuários Desligados e Retenção, Configurações e Segurança e Histórico e Auditoria.
- **FR-002**: Cada superfície DEVE materializar os IDs, copy, estrutura, regiões, estados, interações, responsividade e acessibilidade definidos para ela no [UI Blueprint reconciliado](../../discovery/microsoft-365/v2/onedrive/ui-blueprint.md), sem duplicar ou redefinir esse contrato estrutural.
- **FR-003**: A interface DEVE usar exclusivamente os contratos semânticos e fixtures de UI aprovados em [fixtures/README.md](../../discovery/microsoft-365/v2/onedrive/fixtures/README.md) durante esta feature; os valores sintéticos nunca podem ser apresentados como dados de tenant.
- **FR-004**: A escolha do cenário do fixture DEVE ser explícita. A interface não DEVE alternar silenciosamente para `populated`, preencher valores ausentes nem usar fixture como fallback de produção.
- **FR-005**: A fonte de dados da interface DEVE permanecer substituível por uma fonte futura que entregue o mesmo contrato semântico, sem exigir mudança estrutural nas superfícies e sem tornar backend, collector, persistência ou integração externa pré-requisitos desta feature.
- **FR-006**: A interface DEVE preservar `null`, campo ausente, zero confirmado e coleção vazia como significados distintos, conforme o contrato de cada superfície.
- **FR-007**: A interface DEVE tratar `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed` com composições visuais e semânticas distintas; nenhum desses estados pode ser colapsado em outro.
- **FR-008**: Em `partial`, a interface DEVE manter os blocos confirmados e informar cobertura ou lacuna por bloco; em `stale`, DEVE mostrar somente o último snapshot e sua data publicada.
- **FR-009**: Em `unavailable` e `restricted`, a interface DEVE substituir apenas a região factual afetada por mensagem e razão legíveis; em `failed`, DEVE remover apenas o resultado falho, manter o recorte e não inventar retry.
- **FR-010**: A interface DEVE exibir atualização, período, unidade, legenda, porcentagem, risco, status e cobertura apenas quando publicados e com a semântica correspondente ao conjunto de dados exibido.
- **FR-011**: Dashboard Executivo DEVE preservar a sequência KPI → análise → investigação → recomendações e somente permitir navegação contextual quando o destino estiver publicado.
- **FR-012**: Contas e Armazenamento DEVE oferecer a consulta, filtros, ordenação, paginação e contexto de conta aprovados; fechar o contexto restaura lista, filtros, ordenação e página.
- **FR-013**: Arquivos e Conteúdo DEVE disponibilizar filtros, análises, rankings e inventário compatíveis com o recorte publicado, sem inferir sensibilidade, duplicidade ou risco ausente.
- **FR-014**: Compartilhamento e Acessos DEVE ser estritamente somente leitura; não DEVE expor como disponíveis operações de remover, alterar, expirar, revogar ou notificar acessos.
- **FR-015**: Atividade e Sincronização DEVE distinguir telemetria, dispositivos, KFM e alertas que não foram publicados de uma condição saudável ou coleção vazia.
- **FR-016**: Usuários Desligados e Retenção DEVE mostrar somente processo, progresso, retenção, destinatário, prazo e evidência publicados; não DEVE habilitar transferência, atribuição, retenção, exclusão ou outro comando administrativo.
- **FR-017**: Configurações e Segurança DEVE apresentar postura, políticas, riscos e recomendações como leitura; score e categoria sem regra ou publicação não podem receber nota, classificação ou conformidade inferida.
- **FR-018**: Histórico e Auditoria DEVE oferecer filtros, paginação, cobertura de fonte e contexto de evento aprovados; campos sensíveis ou opcionais não publicados devem permanecer ausentes ou identificados como não publicados.
- **FR-019**: Filtros aprovados DEVEM preservar os demais critérios, atualizar apenas coleções e análises compatíveis, restaurar a primeira página, limpar contexto selecionado e anunciar o resultado.
- **FR-020**: Paginação aprovada DEVE preservar o recorte e ordenação, levar o foco ao caption da tabela e retornar a tabela ao início; controles ou tamanhos ainda pendentes não devem ser inventados.
- **FR-021**: Detalhes contextuais aprovados DEVEM abrir no fluxo da própria superfície, receber foco no título, fechar por controle ou ESC e devolver foco ao gatilho; detalhes sem campos ou gatilho formalizado permanecem fora do escopo.
- **FR-022**: Todas as tabelas DEVEM ter caption e, quando necessárias, rolagem horizontal com instrução acessível; a interface deve manter uma única rolagem vertical principal.
- **FR-023**: Gráficos DEVEM ser renderizados somente com dados publicados e oferecer resumo textual de unidade, período, leitura principal, cobertura e frescor; risco e status não podem depender exclusivamente de cor.
- **FR-024**: A interface DEVE manter rótulos visíveis e uso por teclado em filtros, tabs e controles; o título principal deve receber foco após navegação entre superfícies, e anúncios de estado devem seguir a severidade definida no blueprint.
- **FR-025**: A responsividade DEVE seguir as transições do blueprint: tabs com rolagem horizontal a partir de telas estreitas, filtros refluindo para duas e depois uma coluna, regiões analíticas empilhando e tabelas preservando rolagem horizontal.
- **FR-026**: A interface NÃO DEVE incluir exportação, relatórios, personalização, ação manual de atualização/refresh, drill-down sem destino publicado, controles de cabeçalho sem contrato de resultado, nem ações mutáveis pendentes.
- **FR-027**: A implementação DEVE ser verificável integralmente com os cenários listados nos fixtures de cada superfície, sem depender da prontidão de fonte real ou de outro track.

### Traceability

| Superfície | Requisitos principais | Contrato e fixture aprovados |
| --- | --- | --- |
| 1. Dashboard Executivo | FR-001, FR-002, FR-007–011, FR-023–027 | [contrato](../../discovery/microsoft-365/v2/onedrive/dashboard-executivo/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 2. Contas e Armazenamento | FR-001, FR-002, FR-006–010, FR-012, FR-019–027 | [contrato](../../discovery/microsoft-365/v2/onedrive/contas-e-armazenamento/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 3. Arquivos e Conteúdo | FR-001, FR-002, FR-006–010, FR-013, FR-019–027 | [contrato](../../discovery/microsoft-365/v2/onedrive/arquivos-e-conteudo/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 4. Compartilhamento e Acessos | FR-001, FR-002, FR-006–010, FR-014, FR-019–027 | [contrato](../../discovery/microsoft-365/v2/onedrive/compartilhamento-e-acessos/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 5. Atividade e Sincronização | FR-001, FR-002, FR-006–010, FR-015, FR-019–027 | [contrato](../../discovery/microsoft-365/v2/onedrive/atividade-e-sincronizacao/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 6. Usuários Desligados e Retenção | FR-001, FR-002, FR-006–010, FR-016, FR-019–027 | [contrato](../../discovery/microsoft-365/v2/onedrive/usuarios-desligados-e-retencao/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 7. Configurações e Segurança | FR-001, FR-002, FR-006–010, FR-017, FR-023–027 | [contrato](../../discovery/microsoft-365/v2/onedrive/configuracoes-e-seguranca/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 8. Histórico e Auditoria | FR-001, FR-002, FR-006–010, FR-018–027 | [contrato](../../discovery/microsoft-365/v2/onedrive/historico-e-auditoria/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |

### Key Entities *(include if feature involves data)*

- **Superfície OneDrive**: Uma das oito visões de leitura administrativa, com regiões e comportamento definidos pelo blueprint reconciliado.
- **Cenário de fixture**: Seleção determinística de dados sintéticos, estado global e disponibilidade por bloco para uma superfície.
- **Bloco de disponibilidade**: Região factual que declara se seus dados estão disponíveis, parciais, indisponíveis, restritos, desatualizados ou falhos, sem alterar o significado de outras regiões.
- **Consulta operacional**: Conjunto visível de filtros, ordenação, paginação e seleção que governa uma lista ou análise compatível.
- **Contexto de investigação**: Detalhe somente leitura de uma conta ou evento publicado, aberto no fluxo da superfície.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: As 8 superfícies são alcançáveis na ordem aprovada por teclado e ponteiro; após cada navegação, o título de destino é perceptível e recebe foco em uma única ação.
- **SC-002**: 100% dos cenários declarados nos 8 fixtures podem ser selecionados e avaliados sem fonte real, persistência, collector ou integração externa.
- **SC-003**: Em 100% dos cenários avaliados, `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed` permanecem visual e semanticamente distintos, sem zero, risco baixo, conformidade ou saúde inferidos.
- **SC-004**: 100% das tabelas, gráficos, filtros e detalhes aprovados atendem seus critérios de contexto textual, foco, teclado, anúncio e responsividade definidos no blueprint.
- **SC-005**: Em validação com os fixtures, um administrador consegue completar as jornadas de orientação operacional, governança e auditoria sem acionar ou receber promessa de uma operação mutável não aprovada.

## Assumptions

- A audiência autenticada já aprovada para o módulo é composta por administradores, gestores de rede e proprietários de tenant dentro dos limites de tenant existentes.
- O [UI Blueprint reconciliado](../../discovery/microsoft-365/v2/onedrive/ui-blueprint.md), seus contratos e fixtures são a fonte de verdade para esta feature; decisões pendentes continuam fora do escopo.
- Fixtures são apenas insumo de desenvolvimento, demonstração e verificação da interface; nunca são dados de produção, fallback factual ou proxy de uma fonte Microsoft.
- A futura fonte de dados entregará o contrato semântico já aprovado; esta specification não define, altera ou exige fonte, collector, persistência, integração ou operação administrativa.
- Nenhum `plan.md` ou `tasks.md` é parte desta entrega de Specify.
