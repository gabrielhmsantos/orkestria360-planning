# Dashboard Executivo — Contratos

- `configurationScore`: `score` (0–100), `coveragePercent` (0–100), `classification`, `gates`, `domains[]`, `source`, `lastUpdatedAt`, `freshness`.
- Domínio: `weight`, `eligibleCount`, `availableCount`, `conformantCount`, `scorePercent`; `scorePercent = conformantCount / eligibleCount × 100`. `eligibleCount` contém cada linha homologada e aplicável da matriz, inclusive a que esteja sem leitura comparável; ela contribui `0` ao numerador. `availableCount` contém somente leituras comparáveis e fundamenta a cobertura. Quando `eligibleCount = 0`, o domínio é `unavailable` e sua contribuição para o score é zero por decisão do usuário.
- KPIs e listas: contagens por status, risco, origem, período e cobertura; ausência de coleta mantém razão e condição habilitadora. `unavailable` nunca é convertido em `currentValue=false`, divergência ou risco, embora não receba pontos no score.
- `classification`: `Crítico` para `0–59`, `Atenção` para `60–74`, `Bom` para `75–89` e `Excelente` para `90–100`. Se qualquer item de `gates` estiver ativo, o score permanece numérico e somente `Excelente` é apresentado como `Bom`.
- `gates` só contém fatos Microsoft 365 homologados nesta versão: administrador sem MFA, política crítica desabilitada, autenticação legada permitida, link anônimo global com edição, antiphishing desabilitado, acesso irrestrito por dispositivos não gerenciados e conector Exchange crítico sem TLS. Alteração não aprovada e drift não investigado são eventos observados, não gates.
- Para `política crítica desabilitada`, o fato só é elegível quando uma linha homologada da matriz declarar `riskLevel=critical`, `baselineValue=enabled` e a regra de comparação correspondente. Essa homologação não é aprovação de alteração no tenant.
- Para `autenticação legada permitida`, a trava é o `OR` dos fatos homologados por workload. A primeira linha é SharePoint/OneDrive em Graph `v1.0`: baseline conforme `isLegacyAuthProtocolsEnabled=false`; ativa somente se `currentValue=true`. Fonte ausente ou restrita não ativa a trava; mantém o controle `unavailable` e, se a linha for elegível, recebe zero pontos conforme a regra geral do score.
- Para `link anônimo global com edição`, o fato exige `sharingCapability=externalUserAndGuestSharing` e uma fonte homologada que prove permissão padrão `Edit`. Sem o segundo fato, o resultado é `unavailable`, não um gate ativo.

## Integração com o sync coordenado

O dashboard é projeção local: agrega somente configurações publicadas pelas fontes das demais superfícies. Não cria coleta Graph, não usa conexão como fallback de dados e não chama fonte externa na tela. Score e exportações preservam os metadados `availability`, `coverage`, `freshness`, `reason` e `result_state` recebidos de cada fonte.
