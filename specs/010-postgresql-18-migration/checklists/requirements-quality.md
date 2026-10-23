# Requirements Quality Checklist: Migração PostgreSQL 18

**Purpose**: Avaliar se os requisitos escritos da migração PostgreSQL 18 são completos, claros, consistentes, mensuráveis e cobrem falhas, integrações e limites relevantes.
**Created**: 2026-08-17
**Feature**: [spec.md](../spec.md), [plan.md](../plan.md), [data-model.md](../data-model.md), [compatibility contract](../contracts/database-and-sync-compat.md) e [quickstart.md](../quickstart.md)

**Note**: Este checklist é um artefato de revisão de qualidade dos requisitos gerado pelo `$speckit-checklist`.
**Review Ownership**: Marcar `[x]` apenas quando a revisão comprovar que o critério de qualidade do requisito foi satisfeito.
**Marker Semantics**: `[x]` significa requisito revisado e satisfatório; não significa implementação concluída.

## Requirement Completeness

- [x] CHK001 Estão definidos o banco único, a incompatibilidade do baseline e a exclusão explícita de migração/backfill de dados? [Completeness, Spec §FR-001–FR-003, Assumptions, Out of Scope]
- [x] CHK002 A cadeia baseline, sua ordem e a fonte normativa por tabela estão identificadas sem depender de interpretação implícita? [Completeness, Spec §FR-003; Data Model §Baseline Chain]
- [x] CHK003 As regras de integridade de tenant/ciclo distinguem claramente pai, filhos lógicos e a exceção técnica de stages? [Completeness, Spec §FR-006; Data Model §Cycle Relationship Matrix]
- [x] CHK004 Os tipos, nulidade e semântica de tempo, JSONB e ciphertext estão definidos para os dados sensíveis e consultáveis relevantes? [Completeness, Spec §FR-005, FR-007–FR-008; Data Model §Cross-Cutting Rules]
- [x] CHK005 Os contratos preservados de Microsoft 365 e Licenciamento, incluindo fallback e ausência de escrita no tenant, estão documentados como compatibilidade e não como API nova? [Completeness, Spec §FR-019; Contract §Scope, §Preserved Contracts]
- [x] CHK006 A separação de ambiente de aplicação, ambiente de testes e CI identifica banco, driver, credenciais e mecanismo versionado de provisionamento? [Completeness, Spec §FR-013–FR-016; Quickstart §Local Bootstrap]

## Requirement Clarity and Measurability

- [x] CHK007 A expressão “imagem PostgreSQL 18 fixada em versão menor e digest aprovados” identifica quem/qual registro aprova e onde o valor final fica registrado? [Clarity, Ambiguity, Spec §FR-013, Assumptions]
- [x] CHK008 A composição preservada da CI (build, análise estática e testes) é nomeada de modo inequívoco e permanece consistente com os gates locais exigidos? [Clarity, Consistency, Spec §FR-015; SC-008; Plan §Phase 4]
- [x] CHK009 As consultas JSONB classificadas como críticas estão enumeradas, ou há um critério objetivo para incluí-las na evidência de `EXPLAIN (ANALYZE, BUFFERS)`? [Clarity, Gap, Spec §FR-017; Plan §Phase 2]
- [x] CHK010 As métricas de telemetria definem fonte factual, categorias distintas e tratamento de rerun/colisão/retry sem depender do tamanho do payload? [Measurability, Spec §FR-023; Acceptance Scenario US2.9]
- [x] CHK011 Os critérios de sucesso distinguem resultado local, gate CI e evidência por linha do mapa, permitindo verificar cada um objetivamente? [Measurability, Spec §SC-001–SC-012]
- [x] CHK012 A política de rollback delimita claramente o que é seguro reverter e evita inferir suporte ao rollback do baseline incompatível? [Clarity, Spec §FR-004; Plan §Phase 1]

## Consistency and Traceability

- [x] CHK013 A regra de lock por tenant, criado antes do ciclo, é consistente entre especificação, plano, pesquisa e contrato de compatibilidade? [Consistency, Spec §FR-012, FR-020; Plan §Phase 2; Research §Lock; Contract §Sync lock]
- [x] CHK014 As regras de `RESTRICT` impedem cascade/null-on-delete de histórico em todos os artefatos, inclusive para stages e batches? [Consistency, Spec §FR-006; Data Model §Cycle Relationship Matrix]
- [x] CHK015 A exigência de PostgreSQL sem SQLite é consistente entre requisitos, cenários, quickstart e plano, sem preservar um caminho alternativo? [Consistency, Spec §FR-001, FR-014–FR-016; Quickstart; Plan §Phase 3–4]
- [x] CHK016 A composição remota atual de build, análise estática e `php artisan test` é consistente com `migrate` em PostgreSQL efêmero e com o roteiro local limitado a `migrate:fresh`? [Consistency, Spec §SC-006, SC-008; Plan §Phase 3–4; Quickstart §Validation Matrix]
- [x] CHK017 O mapa obrigatório, os requisitos FR e os critérios SC fornecem rastreabilidade suficiente entre schema final, evidência requerida e critérios de conclusão? [Traceability, Spec §FR-003, SC-007; Data Model §Baseline Chain]

## Scenario and Edge-Case Coverage

- [x] CHK018 Os cenários cobrem rejeição de tenant/ciclo inexistente, duplicidade, limites e exclusão de evidência histórica sem apagar dados válidos? [Coverage, Spec US1.2–US1.5, Edge Cases]
- [x] CHK019 Os cenários cobrem aquisição, renovação, perda e liberação de lock, além da terminalização e bloqueio de coleta/promoção posteriores? [Coverage, Spec US2.5, US2.7–US2.8; Clarifications]
- [x] CHK020 Os cenários cobrem rerun, colisão concorrente e retry para persistência e telemetria, não apenas o caminho de sucesso? [Coverage, Spec US2.2–US2.3, US2.9; FR-011–FR-012, FR-023]
- [x] CHK021 Os limites temporais, nulos e ordenação determinística da busca de grupos estão documentados para resultados alternativos e bordas de data? [Coverage, Spec §FR-007, FR-009; Edge Cases]
- [x] CHK022 A indisponibilidade do ambiente de teste, banco ausente/errado e driver indisponível tem comportamento negativo seguro e anterior a qualquer alteração de dados? [Coverage, Exception Flow, Spec US3.5; FR-014; Quickstart §Safety Stops]
- [x] CHK023 A preservação de publicação anterior e o estado de frescor estão definidos para falhas depois da publicação, inclusive na primeira falha sem dados publicados? [Coverage, Edge Case, Spec US2.4; Contract §Publication]

## Non-Functional Requirements and Boundaries

- [x] CHK024 O requisito de índice JSONB evita otimização especulativa e define evidência de desempenho compatível com carga representativa? [Non-Functional, Spec §FR-017, SC-009; Research §Índices JSONB]
- [x] CHK025 O isolamento de credenciais, a ausência de `DB_*` no PHPUnit e o roteiro obrigatório evitam herança acidental da conexão local para migrations, PHPUnit e CI? [Security, Spec §FR-014–FR-016; Plan §Phase 3; Quickstart §Local Bootstrap]
- [x] CHK026 As restrições de integração proíbem HTTP externo em leitura e em transação, mantêm Graph observável e delimitam fakes locais? [Integration, Spec §FR-012, FR-019; Contract §Read path]
- [x] CHK027 A não autorização de paralelismo, migração incremental, conversão de dados, RBAC, telas e alteração de contratos externos está explicitamente delimitada? [Boundary, Spec §Assumptions, §Out of Scope]
- [x] CHK028 A ausência de superfície UI está explicitamente justificada, preservando a audiência única e evitando requisitos de UX artificiais? [Scope, Spec §User Scenarios; Constitution §VI–VII]

## Notes

- Marque itens `[x]` apenas após revisão baseada em evidência dos requisitos.
- Itens com finding devem ser corrigidos no artefato de requisito apropriado e reavaliados em uma nova rodada completa.
- `$speckit-implement` lê os marcadores do checklist, mas não os altera.

## Review Evidence

- CHK001–CHK006: requisitos FR-001–FR-016, a cadeia de oito baselines e o contrato de compatibilidade cobrem o schema, integridade, integração e ambientes sem depender de código.
- CHK007: a ambiguidade foi removida: FR-013 exige referência imutável resolvida da imagem oficial e registrada no Compose versionado.
- CHK008 e CHK016: FR-015 e SC-006/SC-008 preservam a composição remota atual em PostgreSQL efêmero, distinguem os dois gates locais padrão e limitam o roteiro obrigatório ao `migrate:fresh` local.
- CHK009 e CHK024: FR-017 e SC-009 fecham o universo nesta entrega à contenção `directory_groups.group_types @>` e condicionam qualquer índice à evidência de plano.
- CHK010–CHK012: FR-023, SC-001–SC-012 e FR-004 definem fonte de métricas, evidências e a ausência de rollback prometido para o baseline.
- CHK013–CHK017: spec, plan, research, data model, quickstart e contrato usam lock por tenant, `RESTRICT`, PostgreSQL exclusivo, roteiro antes da migração destrutiva e o mapa obrigatório de forma compatível.
- CHK018–CHK023: os cenários, edge cases e contrato abrangem invalidações, concorrência, tempo/paginação, roteiro antes de migração destrutiva e agora também a primeira falha sem publicação fabricada.
- CHK025–CHK028: os limites de credencial, integração, escopo e ausência de UI estão explícitos na spec, quickstart, contrato e constituição.
