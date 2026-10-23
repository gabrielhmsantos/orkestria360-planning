# Relatórios Operacionais — Design sugerido

- Barra de filtros, tabela dominante, detalhe no fluxo e metodologia acompanham a referência.
- PII, IP, logs e JSON bruto são `restricted`; vazio, falha e indisponibilidade são estados distintos. Em saída parcial permitida, o bloco degradável preserva estrutura, fonte, cobertura, frescor e razão; requisito obrigatório ausente bloqueia gerar.
