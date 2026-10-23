# Workflow Checklist: Workflow Documental de Governança

**Purpose**: Validar a clareza, completude, consistência e mensurabilidade dos requisitos do workflow documental antes da decomposição em tarefas
**Created**: 2026-06-25
**Feature**: [spec.md](../spec.md)

**Note**: Este checklist avalia a qualidade dos requisitos escritos no spec, plan e contract para uso do próprio autor na revisão pré-implementação.

## Requirement Completeness

- [x] CHK001 As exigências para a visão de detalhe cobrem todos os campos necessários para editar metadados, baixar template, reenviar documento e aprovar o tópico? [Completeness, Spec §FR-014, Contract §/governance/{topic}]
- [x] CHK002 Os requisitos definem de forma completa quais dados devem aparecer na visão geral para diferenciar tópicos não iniciados, em andamento, em análise e concluídos? [Completeness, Spec §FR-013, Contract §/governance]
- [x] CHK003 Os requisitos deixam explícito quais informações mínimas devem existir para cada template oficial além do vínculo com o tópico? [Gap, Spec §FR-004, Spec §Template Oficial]
- [x] CHK004 Os requisitos documentam de forma suficiente o que compõe o “histórico simples do último envio” para evitar interpretações divergentes entre overview e detalhe? [Clarity, Spec §FR-007, Spec §FR-014]

## Requirement Clarity

- [x] CHK005 O termo “permissão administrativa” está claro o suficiente para distinguir o ator autorizado sem depender de interpretação implícita do contexto atual do app? [Ambiguity, Spec §FR-010, Spec §Assumptions]
- [x] CHK006 A expressão “ação principal disponível” está especificada com critérios objetivos para cada status do tópico? [Clarity, Spec §FR-013, Contract §/governance]
- [x] CHK007 As regras de vigência deixam claro como a UI deve exibir simultaneamente “meses escolhidos” e “início da vigência” após conclusão? [Clarity, Spec §FR-002, Spec §FR-012, Spec §Tópico de Governança]
- [x] CHK008 O requisito de visualização do documento atual define com precisão se “visualizar” significa abrir no navegador, baixar arquivo ou ambos? [Ambiguity, Spec §FR-007, Spec §FR-014, Contract §GovernanceTopicDetailPageData]

## Requirement Consistency

- [x] CHK009 Os estados descritos nas user stories, requisitos funcionais, modelo de dados e contrato usam a mesma terminologia sem ambiguidade entre `Em andamento`, `Em análise` e seus equivalentes técnicos? [Consistency, Spec §User Scenarios, Spec §FR-005, Spec §FR-008, Data Model §State Transitions, Contract §Inertia Page Contract]
- [x] CHK010 A exceção de reenvio após `Concluído` está alinhada entre escopo, edge cases, requisitos funcionais e modelo de dados, sem deixar conflito com a ideia de “fora de escopo” para reabertura? [Consistency, Spec §FR-009A, Spec §FR-017, Spec §Edge Cases, Data Model §State Transitions]
- [x] CHK011 Os requisitos de score e os critérios de sucesso permanecem consistentes quanto ao tratamento de tópicos não concluídos como nota `0`? [Consistency, Spec §FR-016, Spec §SC-004, Spec §Score de Maturidade]

## Acceptance Criteria Quality

- [x] CHK012 Os acceptance scenarios cobrem de forma mensurável a consequência de salvar metadados, baixar template, enviar documento e aprovar com score? [Acceptance Criteria, Spec §User Story 1, Spec §User Story 2, Spec §User Story 3]
- [x] CHK013 Existe critério objetivo suficiente para verificar a meta de “95% das tentativas válidas” sem depender de interpretação futura sobre o que conta como tentativa válida? [Measurability, Spec §SC-002]
- [x] CHK014 A meta de revisão “em menos de 2 minutos” está apoiada por requisitos que delimitem início/fim da medição e pré-condições do cenário? [Measurability, Spec §SC-003]

## Scenario Coverage

- [x] CHK015 Os requisitos cobrem explicitamente o fluxo alternativo em que o usuário salva metadados mas nunca baixa o template, incluindo o estado esperado na visão geral? [Coverage, Spec §FR-003, Spec §FR-013, Spec §Edge Cases]
- [x] CHK016 O conjunto de cenários cobre de forma clara o comportamento quando um tópico concluído recebe novo envio e volta para análise administrativa? [Coverage, Spec §FR-009A, Spec §Clarifications, Data Model §State Transitions]
- [x] CHK017 As transições de status previstas contemplam todos os cenários primários e alternativos sem deixar lacunas entre `Pendente` e `Concluído`? [Coverage, Spec §FR-003-012, Data Model §State Transitions]

## Edge Case Coverage

- [x] CHK018 Os edge cases listados foram convertidos em requisitos claros ou permanecem como perguntas abertas que ainda podem gerar interpretação durante a implementação? [Edge Case, Spec §Edge Cases, Gap]
- [x] CHK019 Há requisitos suficientes para tratar entradas inválidas de vigência fora da lista permitida e pontuação fora do intervalo sem depender apenas do contrato técnico? [Coverage, Spec §FR-002, Spec §FR-011, Contract §Request Contract]
- [x] CHK020 O spec define o comportamento esperado quando não existe documento enviado, mas já existem metadados e template baixado, tanto no detalhe quanto no overview? [Coverage, Spec §FR-013, Spec §FR-014, Spec §Edge Cases]

## Non-Functional Requirements

- [x] CHK021 Os requisitos não funcionais de segurança cobrem explicitamente autorização, proteção do acesso a arquivos e exposição limitada de ações administrativas? [Non-Functional, Spec §FR-010, Plan §Constitution Check, Gap]
- [x] CHK022 Os requisitos de consistência visual são específicos o bastante para orientar a adaptação da tabela atual para workflow sem perder comparabilidade com o restante do módulo? [Clarity, Spec §FR-015, Plan §Consistent User Experience]

## Dependencies & Assumptions

- [x] CHK023 As assumptions documentam de forma verificável a dependência de 8 tópicos fixos e de templates locais sem deixar em aberto quem mantém esses arquivos oficiais? [Assumption, Spec §Assumptions, Data Model §Seed Data]
- [x] CHK024 A dependência de armazenamento local para documentos e templates foi refletida como restrição de requisito ou ficou apenas no plano técnico? [Dependency, Plan §Technical Context, Research §Decision 1, Gap]

## Ambiguities & Conflicts

- [x] CHK025 O spec resolve de forma inequívoca a diferença entre “data da última revisão”, “data do último envio” e “data de início da vigência” para evitar uso inconsistente desses campos? [Ambiguity, Spec §Metadados implícitos em FR-007/013/014, Data Model §GovernanceTopic]
- [x] CHK026 Existe alguma tensão entre o princípio de POC simples e a expectativa de workflow completo que ainda precise ser explicitamente delimitada nos requisitos? [Conflict, Plan §POC Scope with Credible Outcomes, Spec §FR-017]

## Notes

- Use este checklist para revisar a qualidade do texto dos requisitos antes de gerar `tasks.md`
- Marque `[x]` apenas quando o requisito estiver claro no documento, não quando “der para decidir depois”
