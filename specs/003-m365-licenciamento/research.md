# Research: Licenciamento Microsoft 365 V2

## Decisões

### Leitura Graph e contingência de atribuições

**Decision**: usar SKUs, usuários e relatórios como fontes técnicas; a coleta paginada de usuários é a base de atribuições e `licenseDetails` é enriquecimento opcional revalidado por tenant.

**Rationale**: a homologação do discovery demonstrou `licenseDetails` app-only, mas a matriz oficial ainda não o garante. O estado dos usuários mantém o fluxo funcional.

**Alternatives considered**: depender de `licenseDetails` por usuário (rejeitada: falha parcial bloqueia Inventário/Consumo); usar apenas delta (rejeitada: não traz estados de atribuição).

### Histórico e frescor

**Decision**: gravar snapshots diários e eventos internos, separando `technicalSyncedAt` de `reportUpdatedAt` e do frescor da fonte.

**Rationale**: Graph representa estado atual e relatórios têm defasagem própria; a V2 precisa explicar evolução sem inventar causas.

**Alternatives considered**: renderizar dados Graph a cada visita (rejeitada: instável e sem trilha); um único timestamp (rejeitada: mascara atraso de uso).

### Dados comerciais

**Decision**: modelar somente estados `unavailable` e mensagens orientativas nesta entrega.

**Rationale**: Graph não fornece preço, contratos, imposto ou renovação; a importação Assessment/CSV é futura.

**Alternatives considered**: estimar custo por tabela pública (rejeitada: não representa o contrato do tenant); implementar importação agora (rejeitada: fora do escopo V2).

### Privacidade e isolamento

**Decision**: todo registro e consulta é escopado por tenant; evidência bruta é protegida por referência e PII não entra em logs/mensagens de erro.

**Rationale**: relatórios podem conter identificação pessoal e a experiência deve operar também em modo anonimizado.

**Alternatives considered**: persistir CSV em payload ou logs (rejeitada: exposição desnecessária).
