# Feature Specification: Workflow Documental de Governança

**Feature Branch**: `feat/001-governance-document-workflow`

**Created**: 2026-06-25

**Status**: Draft

**Input**: User description: "Vamos implementar planning.md e os forms discovery/estruturacao-governanca/forms/ como workflow documental dos 8 tópicos de governança"

## Clarifications

### Session 2026-06-25

- Q: Como o score de maturidade deve ser calculado enquanto ainda existem tópicos não concluídos? → A: Calcular sempre sobre os 8 tópicos, tratando não concluídos como nota 0.
- Q: O que deve acontecer quando um tópico já concluído recebe um novo documento? → A: Substituir o arquivo e devolver o tópico para validação do administrador.
- Q: Como a vigência deve ser definida e quando ela começa a contar? → A: A vigência é um select de meses e começa a contar após o tópico ser concluído.
- Q: Quais opções o select de vigência deve oferecer? → A: O select de vigência deve oferecer 3, 6, 9, 12, 24, 36, 48 e 60 meses.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preparar um tópico documental (Priority: P1)

Como responsável por um tópico de governança, quero registrar os metadados mínimos e baixar o modelo oficial do documento para iniciar o trabalho com clareza e rastreabilidade.

**Why this priority**: Sem esse passo, o fluxo documental não começa e nenhum dos oito tópicos pode avançar para produção do documento.

**Independent Test**: Pode ser testada ao preencher responsável e vigência em qualquer tópico e confirmar que o sistema libera o download do template correto, registra a ação e muda o status para refletir o início do trabalho.

**Acceptance Scenarios**:

0. **Given** um tópico sem metadados obrigatórios preenchidos, **When** o usuário visualiza a visão geral, **Then** o tópico aparece como `Não iniciado`, sem data de último envio, com a ação principal `Preencher metadados`.
1. **Given** um tópico sem responsável e sem vigência definidos, **When** o usuário informa ambos os campos obrigatórios, **Then** o tópico passa a exibir status `Pendente` e habilita a ação de baixar template.
2. **Given** um tópico com metadados obrigatórios preenchidos, **When** o usuário baixa o template oficial do tópico, **Then** o sistema registra que o modelo foi baixado e atualiza o status para `Em andamento`.
3. **Given** um tópico aprovado, **When** o administrador conclui o processo, **Then** o sistema inicia a contagem da vigência a partir da data de conclusão usando a quantidade de meses selecionada para o tópico.

---

### User Story 2 - Enviar documento para análise (Priority: P2)

Como responsável por um tópico de governança, quero enviar o documento preenchido e acompanhar seu status para saber quando ele está pronto para revisão administrativa.

**Why this priority**: O valor do módulo depende de transformar o tema em evidência documental revisável, e não apenas em um cadastro estático.

**Independent Test**: Pode ser testada após o download do template, enviando um documento preenchido e verificando o histórico básico do envio, o acesso para visualização e a transição para `Em análise`.

**Acceptance Scenarios**:

1. **Given** um tópico com template já baixado, **When** o usuário envia um documento preenchido, **Then** o sistema registra o último envio, disponibiliza a visualização do arquivo enviado e atualiza o status para `Em análise`.
2. **Given** um tópico em `Em análise`, **When** o usuário substitui o documento por uma nova versão antes da decisão administrativa, **Then** o sistema mantém o status `Em análise` e passa a exibir a versão mais recente como envio atual.
3. **Given** um tópico já `Concluído`, **When** o responsável envia um novo documento para substituir o vigente, **Then** o sistema substitui o arquivo ativo, limpa a decisão administrativa vigente e retorna o tópico para `Em análise`.

---

### User Story 3 - Aprovar e pontuar o tópico (Priority: P3)

Como administrador, quero revisar o documento enviado, atribuir uma pontuação de 0 a 100 e aprovar o tópico para concluir o processo e alimentar o score de maturidade do módulo.

**Why this priority**: A aprovação administrativa transforma o documento em evidência válida e gera a pontuação que sustenta a leitura de maturidade da governança.

**Independent Test**: Pode ser testada com um tópico já em `Em análise`, confirmando que somente administradores conseguem informar pontuação válida, aprovar o documento e concluir o tópico.

**Acceptance Scenarios**:

1. **Given** um tópico em `Em análise` com documento disponível, **When** um administrador informa uma pontuação inteira entre 0 e 100 e aprova o tópico, **Then** o sistema registra a aprovação, salva a pontuação e atualiza o status para `Concluído`.
2. **Given** um tópico em `Em análise`, **When** um usuário que não é administrador tenta aprovar ou pontuar o tópico, **Then** o sistema impede a ação e mantém o tópico aguardando revisão administrativa.
3. **Given** um tópico em `Em análise`, **When** um administrador tenta aprovar sem preencher a pontuação obrigatória, **Then** o sistema bloqueia a conclusão do tópico e informa que a pontuação é necessária.

### Edge Cases

- Se o usuário tentar baixar o template antes de preencher `Responsável` e `Vigência`, o sistema deve bloquear a ação, manter o tópico em `Não iniciado` e exibir orientação para concluir os metadados obrigatórios.
- Se o usuário tentar enviar documento sem ter registrado o download do template, o sistema deve bloquear o envio, manter o status atual e informar que o download do modelo é pré-requisito.
- A visão geral deve distinguir claramente `Não iniciado`, `Pendente`, `Em andamento`, `Em análise` e `Concluído`, exibindo ação principal, datas disponíveis e campos vazios coerentes em cada caso.
- Se um administrador informar pontuação fora do intervalo `0-100` ou valor não inteiro, o sistema deve rejeitar a submissão, manter o tópico em `Em análise` e exibir erro de validação objetivo.
- Se um tópico concluído precisar ser refeito, o novo envio deve substituir o documento vigente, remover a aprovação vigente e devolver o tópico para `Em análise`, sem abrir fluxo formal de reprovação com comentários.

### Lifecycle & Action Mapping

Convenção canônica de status neste planejamento:

- Rótulo funcional em português: `Não iniciado`, `Pendente`, `Em andamento`, `Em análise`, `Concluído`
- Chave técnica para implementação e contratos: `not_started`, `pending`, `in_progress`, `under_review`, `completed`

| Estado | Critério | Ação principal esperada |
| --- | --- | --- |
| `Não iniciado` | Sem `Responsável` ou sem `Vigência` preenchidos | `Preencher metadados` |
| `Pendente` | Metadados obrigatórios preenchidos, template ainda não baixado | `Baixar template` |
| `Em andamento` | Template baixado, sem documento vigente enviado | `Enviar documento` |
| `Em análise` | Documento vigente aguardando validação administrativa | `Acompanhar análise` para usuário operacional e `Revisar e pontuar` para administrador |
| `Concluído` | Documento aprovado com pontuação válida | `Visualizar documento` |

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST representar os oito tópicos de governança como fluxos documentais independentes, cada um com seu próprio status, metadados, template oficial, documento enviado e decisão administrativa.
- **FR-001A**: O sistema MUST tratar `Não iniciado` como o estado inicial explícito de um tópico ainda sem os metadados obrigatórios preenchidos.
- **FR-002**: O sistema MUST exigir o preenchimento de `Responsável` e de uma vigência definida por um select de meses com as opções `3`, `6`, `9`, `12`, `24`, `36`, `48` e `60` antes de considerar um tópico iniciado.
- **FR-003**: O sistema MUST atualizar o status do tópico para `Pendente` assim que os campos obrigatórios do tópico forem preenchidos.
- **FR-004**: O sistema MUST disponibilizar um template oficial distinto para cada tópico e só permitir seu download após o preenchimento dos metadados obrigatórios.
- **FR-005**: O sistema MUST atualizar o status para `Em andamento` quando o template oficial do tópico for baixado pela primeira vez.
- **FR-006**: O sistema MUST permitir o envio de documento somente depois que o template do tópico tiver sido baixado.
- **FR-007**: O sistema MUST registrar o último envio do documento, incluindo ao menos nome do arquivo, responsável pelo envio e data do envio, e disponibilizar a visualização do documento atual por abertura em nova aba quando houver preview suportado no navegador e, no mínimo, uma ação secundária de download em qualquer caso.
- **FR-008**: O sistema MUST atualizar o status do tópico para `Em análise` sempre que houver um documento enviado aguardando revisão administrativa.
- **FR-009**: O sistema MUST manter o status `Em análise` quando um documento já enviado for substituído antes da conclusão administrativa.
- **FR-009A**: O sistema MUST permitir que um tópico já `Concluído` receba um novo envio, substitua o documento vigente, remova a aprovação e a pontuação vigentes da versão anterior e retorne automaticamente o status para `Em análise`, aguardando nova validação administrativa.
- **FR-010**: O sistema MUST restringir a aprovação final e a definição de pontuação aos usuários autenticados com o papel funcional `Administrador` do tenant no módulo.
- **FR-011**: O sistema MUST aceitar apenas pontuações inteiras de 0 a 100 e exigir essa pontuação como pré-requisito para concluir um tópico.
- **FR-012**: O sistema MUST atualizar o status para `Concluído` somente quando um administrador aprovar o documento e registrar a pontuação obrigatória, iniciando nessa mesma data a contagem da vigência configurada em meses para o tópico.
- **FR-013**: O sistema MUST exibir na visão geral, para cada tópico, o nome do tópico, responsável, vigência em meses selecionada, data de início da vigência quando existir, status atual, data do último envio, ação principal disponível e ausência explícita de dados quando o tópico ainda estiver `Não iniciado`.
- **FR-013A**: O sistema MUST mapear a ação principal por estado da seguinte forma: `Preencher metadados` para `Não iniciado`, `Baixar template` para `Pendente`, `Enviar documento` para `Em andamento`, `Acompanhar análise` ou `Revisar e pontuar` para `Em análise` conforme papel do usuário, e `Visualizar documento` para `Concluído`.
- **FR-014**: O sistema MUST exibir na visão de detalhe do tópico os metadados, o acesso ao template oficial, a área de envio do documento final, o histórico simples do último envio, o status atual, as três datas de referência separadas (`última revisão`, `último envio` e `início da vigência`) e as ações administrativas cabíveis.
- **FR-015**: O sistema MUST preservar linguagem visual e comportamental consistente com os demais estados equivalentes do módulo, incluindo o mesmo padrão de badge de status entre visão geral e detalhe, a mesma hierarquia de ações primárias e secundárias, bloqueios com mensagem objetiva de motivo e a mesma estrutura tabular/base visual já usada no overview do módulo.
- **FR-016**: O sistema MUST calcular o score de maturidade do módulo a partir da média simples dos oito tópicos deste fluxo, tratando como nota `0` cada tópico ainda não concluído.
- **FR-017**: O sistema MUST declarar como fora de escopo inicial qualquer fluxo de reprovação formal com ajustes e comentários estruturados, mantendo como única exceção a reavaliação de um tópico já concluído quando um novo documento substituir o arquivo vigente e reiniciar a análise administrativa.
- **FR-018**: O sistema MUST tratar templates oficiais e documentos vigentes como arquivos internos do módulo no primeiro release, armazenados sem dependência de repositório documental externo ou integração de terceiros.
- **FR-019**: O sistema MUST restringir o acesso às páginas do workflow, aos downloads de template e à visualização dos documentos vigentes a usuários autenticados do tenant, sem expor URLs públicas permanentes para arquivos administrativos; neste POC, `tenant` representa o contexto autenticado atual da Contoso Ltda., e não um isolamento multi-tenant dinâmico entre organizações.
- **FR-020**: O sistema MUST distinguir semanticamente `Data da última revisão` como referência manual do tópico, `Data do último envio` como timestamp do documento vigente e `Data de início da vigência` como a data da aprovação administrativa vigente.

### Key Entities *(include if feature involves data)*

- **Tópico de Governança**: Unidade de acompanhamento de um dos oito temas documentais, com identificação do tema, responsável, vigência em meses escolhida entre `3`, `6`, `9`, `12`, `24`, `36`, `48` e `60`, data de início da vigência após conclusão, status atual e dados de revisão.
- **Template Oficial**: Modelo disponibilizado para um tópico específico, com referência ao arquivo, nome identificável do documento, formato suportado, registro do primeiro download, usuário do primeiro download para trilha mínima de auditoria e vínculo com o tópico correspondente.
- **Documento Enviado**: Evidência documental mais recente submetida pelo responsável do tópico, com identificação do arquivo, data de envio, autor do envio e capacidade de substituir o arquivo vigente mesmo após conclusão, reiniciando a validação administrativa.
- **Decisão Administrativa**: Resultado da revisão de um documento enviado, contendo aprovador, data da decisão e pontuação atribuída.
- **Score de Maturidade**: Indicador agregado calculado a partir da média das pontuações dos oito tópicos, atribuindo nota `0` aos tópicos ainda não concluídos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos oito tópicos podem ser iniciados com preenchimento de responsável e vigência, sem depender de formulário de perguntas.
- **SC-002**: Em pelo menos 95% das tentativas válidas, definidas como fluxos em que um usuário autenticado preenche metadados obrigatórios, baixa o template do tópico correto e envia um documento em formato aceito antes de qualquer decisão administrativa, o processo deve ser concluído sem necessidade de suporte operacional.
- **SC-003**: Administradores conseguem concluir a revisão de um tópico em menos de 2 minutos, medidos a partir da abertura de um tópico já `Em análise` com metadados completos e documento vigente disponível até o registro da pontuação e mudança para `Concluído`.
- **SC-004**: 100% dos tópicos concluídos possuem pontuação administrativa válida entre 0 e 100 antes de entrarem no cálculo de maturidade.
- **SC-005**: A visão geral permite identificar o status e a próxima ação de cada um dos oito tópicos em uma única tela, sem navegação adicional, para pelo menos 90% dos casos de acompanhamento operacional.

## Assumptions

- Os oito tópicos usarão o mesmo fluxo base, variando apenas o nome do tema e o template oficial associado.
- Os usuários já autenticados no módulo continuarão usando os papéis atuais, com uma distinção funcional clara entre usuário operacional e usuário com papel `Administrador`.
- Neste POC, `tenant` significa apenas o contexto autenticado atual da Contoso Ltda., sem necessidade de modelar isolamento multi-tenant configurável nesta entrega.
- O primeiro release tratará apenas um documento ativo por tópico, considerando a substituição como atualização do envio atual.
- A vigência será configurada como uma duração em meses escolhida entre `3`, `6`, `9`, `12`, `24`, `36`, `48` e `60`, e passará a valer a partir da conclusão administrativa do tópico.
- Os templates oficiais serão arquivos internos do módulo, mantidos pela governança administrativa do tenant no primeiro release.
- A visualização e o armazenamento dos arquivos permanecerão internos ao módulo no primeiro release, sem repositório documental externo.
- A visualização do documento enviado atenderá à necessidade de consulta do arquivo atual, sem exigir histórico completo de versões neste momento.
- O fluxo de reprovação formal com solicitação de ajuste continuará fora de escopo inicial, mesmo com a possibilidade de reenviar um documento após conclusão para nova validação administrativa.
