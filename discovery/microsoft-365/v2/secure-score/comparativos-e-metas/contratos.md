# Comparativos e Metas — Contratos

- Dados: `averageComparativeScores`, snapshots, categoria e entidade Meta.
- Fonte e limite: médias só quando retornadas. A Meta é configuração local por tenant, persistida com padrão de produto de 80%; não vem do Graph e não altera o tenant Microsoft. A gestão editável continua `coming_soon`.

## Integração com o sync coordenado

- `averageComparativeScores` é projeção local da fotografia canônica `secureScores`, validada em resposta `200`; não justifica coleta adicional nem chamada Graph na tela.
- Cobertura representa as bases/categorias efetivamente retornadas; ausência de média é indisponibilidade factual, nunca referência fabricada. Falha preserva a última geração e declara `availability`, `coverage`, `freshness`, `reason` e `result_state`.
- As categorias comparativas reutilizam a normalização da fotografia canônica. `AllTenants` publica a Média todos e `TotalSeats` publica a Média mesmo porte, sem coleta adicional. A base exige `averageScore` publicado e maior que zero; cada célula exige ainda score e máximo válidos na respectiva base. Ausência de uma média não remove a categoria local nem é preenchida pela meta.
- A diferença da tabela é cálculo factual para a meta geral persistida (`meta geral - score da categoria`, em p.p.). Não representa uma meta específica por categoria, que permanece não publicada. A distância do KPI geral é `meta - score atual`. Previsão de atingimento requer série, plano e regra preditiva publicados, portanto continua indisponível.
