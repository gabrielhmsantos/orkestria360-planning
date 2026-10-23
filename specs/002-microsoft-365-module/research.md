# Research: Módulo Microsoft 365

## Decision 1: Manter a feature limitada à overview executiva

**Decision**: A primeira entrega do módulo Microsoft 365 implementará apenas a overview executiva em `/microsoft-365`, mantendo subáreas como evolução futura.

**Rationale**: A spec aprovada restringe explicitamente o escopo da feature à overview. Isso reduz risco de escopo, preserva a capacidade demonstrável da POC e deixa o roadmap de subáreas para ciclos posteriores.

**Alternatives considered**:
- Entregar subáreas placeholder nesta mesma feature: rejeitada por diluir o foco do contrato principal.
- Entregar 2 a 4 subáreas agora: rejeitada por ampliar demais o esforço sem necessidade para validar o valor central do módulo.

## Decision 2: Centralizar o payload no backend Laravel com controller dedicado

**Decision**: Extrair `/microsoft-365` da rota inline atual para um controller dedicado e uma classe simples de montagem de payload, responsável por orquestrar as chamadas ao Microsoft Graph e normalizar o contrato Inertia.

**Rationale**: Isso alinha o módulo ao padrão já adotado no projeto, melhora testabilidade do contrato Inertia e cria o ponto natural onde o SDK oficial PHP do Graph é instanciado e os blocos estruturados são montados a partir de dados reais do tenant.

**Alternatives considered**:
- Manter o payload inline em `routes/web.php`: rejeitada por dificultar evolução e testes.
- Criar API JSON dedicada para o frontend: rejeitada por adicionar complexidade desnecessária ao monólito Inertia.

## Decision 3: Adotar o SDK oficial PHP do Microsoft Graph como caminho principal

**Decision**: Tratar o conjunto `microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague` e `microsoft/kiota-http-guzzle` como baseline oficial para a integração Graph em PHP nesta feature. O SDK é o caminho principal de consumo; HTTP manual só como fallback pontual.

**Rationale**: A documentação pública atual dos pacotes mostra `microsoft/microsoft-graph` como SDK principal, `microsoft/kiota-authentication-phpleague` como provider de autenticação e `microsoft/kiota-http-guzzle` como implementação HTTP do stack Kiota em PHP. Isso converge com o discovery atualizado e reduz o risco de criar uma solução manual divergente do ecossistema oficial.

**Alternatives considered**:
- HTTP manual como caminho principal: rejeitada por aumentar custo de manutenção e afastar o projeto do baseline oficial.
- Pacote Laravel de terceiros como baseline: rejeitada porque o discovery fechou o SDK oficial como referência principal.

## Decision 4: Fixar autenticação em app-only com client credentials

**Decision**: A autenticação Microsoft Graph desta feature é modo app-only, com App Registration no Entra, `ClientCredentialContext` e escopo `.default`. Credenciais (`MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET`) já estão disponíveis no ambiente do tenant Contoso.

**Rationale**: O módulo não terá login Microsoft para usuário final. O padrão app-only atende o cenário "where no user is present" e simplifica a arquitetura da integração. As permissões de aplicação (`Reports.Read.All`, `ServiceHealth.Read.All`, `LicenseAssignment.Read.All`, leitura ampla de diretório e `SecurityEvents.Read.All`) já foram concedidas com consentimento administrativo no App Registration do tenant Contoso.

**Alternatives considered**:
- Delegated auth por usuário: rejeitada por contradizer o fluxo do produto e o discovery.
- Adiar integração real para fase futura: rejeitada pelo reescopo desta feature (ver Decision 8).

## Decision 5: Manter recent activity e insights editoriais ancorados em dados reais

**Decision**: `tenantHighlights`, `recentActivity` e `nextStep` permanecem como blocos editoriais nesta feature, ancorados nos sinais estruturados reais disponíveis via Graph (score, service health, licenças, reports). Não há mocks: a origem dos blocos estruturados é sempre o Graph real.

**Rationale**: O discovery identifica que não existe uma única fonte canônica simples para um feed executivo de atividade recente do tenant. Manter esses blocos editoriais evita acoplamento prematuro a múltiplas superfícies oficiais, mas eles são derivados/coerentes com os dados reais lidos do Graph, não mocks isolados.

**Alternatives considered**:
- Integrar múltiplas fontes oficiais para o feed editorial já nesta fase: rejeitada por excesso de complexidade para a entrega inicial.
- Remover os blocos editoriais da overview: rejeitada por reduzir valor executivo da página.
- Manter os blocos editoriais apoiados em mocks mesmo com Graph real: rejeitada porque quebra a coerência com os blocos estruturados reais agora disponíveis.

## Decision 6: Mapear contratos oficiais dos endpoints da overview com exceção explícita para relatórios CSV

**Decision**: Formalizar no plano que `users`, `groups`, `subscribedSkus`, `secureScores`, `secureScoreControlProfiles` e `healthOverviews` seguem o padrão de coleções JSON do Graph, enquanto `getOffice365ServicesUserCounts` deve ser tratado como exceção por retornar `302` para um CSV temporário.

**Rationale**: A documentação oficial da Microsoft Graph mostra que a maioria dos blocos da overview pode ser consumida por coleções `value[]`, mas o endpoint de uso de serviços em 30 dias exige download e parsing de CSV. Registrar essa diferença agora evita assumir um contrato homogêneo incorretamente e justifica o fallback pontual previsto no discovery.

**Alternatives considered**:
- Tratar todos os endpoints como JSON homogêneo: rejeitada porque contradiz o contrato oficial de reports.
- Evitar documentar a exceção até a implementação: rejeitada por aumentar o risco de retrabalho no seam de integração.

## Decision 7: Tornar o contrato da overview a referência normativa da feature

**Decision**: Tratar `contracts/microsoft-365-overview.md` como a referência normativa para payload, cardinalidade de blocos, comportamento de estados parciais/vazios e mapeamento oficial de endpoints desta feature.

**Rationale**: Depois da validação do checklist, a maior fonte de risco deixou de ser "qual endpoint usar" e passou a ser divergência entre intenção de produto, artefatos de planejamento e contrato da página. Centralizar a autoridade no contrato reduz ambiguidade para tarefas e implementação.

**Alternatives considered**:
- Manter `discovery/` como referência principal para contrato: rejeitada porque discovery mistura racional, fases futuras e escopo não implementável agora.
- Distribuir a autoridade igualmente entre spec, plan e contract: rejeitada por aumentar o risco de conflito interpretativo.

## Decision 8: Reescopo da feature para consumir dados reais do Microsoft Graph, sem mock

**Decision**: A feature 002 passa a consumir **dados reais** do Microsoft Graph do tenant Contoso nesta entrega, e não mais mocks com seam para futuro. Todos os blocos estruturados mapeados em `contracts/microsoft-365-overview.md` são alimentados por chamadas reais ao Graph via SDK oficial PHP em modo app-only; os blocos editoriais (`tenantHighlights`, `recentActivity`, `nextStep`) permanecem editoriais por design, mas ancorados nos sinais reais agora disponíveis. **Não existe mock**: a origem dos blocos estruturados é sempre o Graph real, seja em tempo real (`fresh: true`) ou via cache/snapshot (`fresh: false`).

**Rationale**: O usuário confirmou que o App Registration no Entra ID do tenant Contoso já existe com permissões de aplicação e consentimento administrativo concedidos, e que o objetivo da feature é validar o produto com dados reais do tenant, não com mocks. O usuário também confirmou que mock não deve existir nem como fallback: quando uma chamada Graph falha, o backend serve o último snapshot cacheado com indicador "Última att. em {tempo relativo}", ou normaliza para `empty`/`informational` quando não há snapshot. O padrão app-only com `ClientCredentialContext` e `GraphServiceClient` foi confirmado via Context7 como o caminho oficial atual do SDK PHP.

**Alternatives considered**:
- Manter mocks com seam para Graph futuro: rejeitada pelo usuário (reescopo explícito).
- Manter mock como fallback de diagnóstico: rejeitada pelo usuário (sem mock nenhum).
- Criar uma spec nova (003) para integração real: rejeitada porque o usuário quer evoluir a 002, não abrir feature paralela.

## Decision 9: Tratar exceção de CSV em `serviceUsage30d` como parte do escopo real

**Decision**: O endpoint `/reports/getOffice365ServicesUserCounts(period='D30')` retorna `302` para CSV temporário; esta feature inclui o download e parsing backend desse CSV como parte da integração real, sem expor o formato bruto ao contrato Inertia.

**Rationale**: Confirmado no contrato e no discovery que este é o único endpoint da overview com shape CSV em vez de coleção JSON `value[]`. Ignorar essa exceção tornaria o bloco `serviceUsage30d` inutilizável com dados reais. O parser backend é a única forma de preservar o contrato de página consistente.

**Alternatives considered**:
- Deixar `serviceUsage30d` mockado mesmo com Graph real nos demais blocos: rejeitada por quebrar a coerência da narrativa de adoção e por eliminar mock do escopo.
- Remover o bloco da overview: rejeitada por reduzir valor executivo.

## Decision 10: Cache/snapshot com indicador "Última att." em vez de mock como fallback

**Decision**: Quando uma chamada Graph falha transitóriamente para um bloco estruturado, o backend serve o **cache/snapshot** do último valor bem-sucedido daquele bloco, marca `fresh: false`, preenche `lastUpdatedAt` com o timestamp do snapshot, e a UI exibe "Última att. em {tempo relativo}". Se não existir snapshot cacheado, o bloco é normalizado para `empty` ou `informational`. Não existe mock em hipótese alguma.

**Rationale**: O usuário confirmou explicitamente que mock não é fallback e não existirá. O modelo de resiliência adotado é cache/snapshot de curto prazo + indicador de stale ao usuário, que é mais honesto e transparente do que servir dados fictícios. Isso preserva a credibilidade da overview mesmo durante indisponibilidades transitórias do Graph, e mantém o usuário informado de que aquele dado é um snapshot. O cache usa o cache storage nativo do Laravel (driver configurado em `config/cache.php` — Redis, database, file, memcached, etc.) com TTL controlado por bloco, sobrevive a restarts quando o driver é persistente, e não constitui persistência analítica nem histórico.

**Alternatives considered**:
- Servir mock como fallback em falha Graph: rejeitada pelo usuário explicitamente.
- Derrubar a overview inteira em falha Graph: rejeitada por degradar experiência sem necessidade.
- Servir apenas `empty`/`informational` em toda falha, sem cache: rejeitada porque perde valor executivo quando já existe um snapshot recente disponível.
