# Configurações por Serviço — Decisões

- O catálogo é a autoridade da interface para fonte de leitura, versão, permissões, escopo e risco — decisão adaptada ao escopo somente leitura, 2026-08-24.
- APIs Intune beta devem aparecer como beta e só podem alimentar leitura após validação de estabilidade e consentimento — sponsor adaptado ao escopo.
- Clarificação — Q: semântica de datas de alteração → A: B (separar `sourceLastModifiedAt`, `lastObservedChangeAt` e `lastCollectedAt`) (origem: usuário; data: 2026-08-25).
- Clarificação — Q: autoridade e escopo inicial da matriz canônica → A: B, ajustada pelo usuário para matriz versionada, incremental e expansível; apenas linhas integralmente homologadas; prioridade Graph `v1.0`, TCM, API oficial especializada e PowerShell somente em lacuna comprovada; TCM não é baseline automático (origem: usuário; data: 2026-08-25).
