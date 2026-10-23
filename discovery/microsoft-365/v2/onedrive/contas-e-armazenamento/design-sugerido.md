# Contas e Armazenamento — Design sugerido

- KPIs de inventário e capacidade precedem filtros, análise de distribuição/evolução/previsão e uma tabela dominante de contas.
- A tabela abre detalhe no fluxo da superfície, com áreas de visão geral, capacidade, arquivos, compartilhamentos, sincronização, dispositivos, retenção, auditoria e ações administrativas pendentes.
- A previsão de esgotamento é um bloco separado. Quando publicada, expõe dias e data estimados, base histórica de 2–6 meses e confiança baixa, média ou alta; sem pré-requisitos, declara ausência de previsão sem estimar.
- **Estados aplicáveis:** `available`, `partial`, `stale`, `restricted`, `unavailable` e `failed`; tabela vazia preserva filtros e explica que não há resultados, sem representar falha de fonte.
