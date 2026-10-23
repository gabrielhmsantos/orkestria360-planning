# Feature Specification: Módulo Microsoft 365

**Feature Branch**: `feat/002-microsoft-365-module`

**Created**: 2026-06-26

**Status**: Ready for Implementation

**Input**: User description: "com base em discovery/microsoft-365 vamos viabilizar o modulo /microsoft-365"

## Clarifications

### Session 2026-06-26

- Q: Esta feature deve entregar só a overview executiva ou já incluir subáreas detalhadas? → A: Apenas a overview executiva em `/microsoft-365`; subáreas ficam como evolução futura.
- Q: Quem pode acessar o módulo Microsoft 365 nesta fase? → A: Qualquer usuário autenticado pode acessar a overview.
- Q: A configuração do app de integração precisa ter tela nesta feature? → A: Não; nesta fase, a parametrização da integração fica fora da interface do produto.

### Session 2026-06-26 (reescopo para dados reais)

- Q: A overview deve permanecer mockada com seam para Graph futuro, ou consumir dados reais do Microsoft Graph agora? → A: Consumir **dados reais** do Microsoft Graph nesta feature, usando o SDK oficial PHP em modo app-only com `ClientCredentialContext`. Credenciais do App Registration no Entra ID do tenant Contoso já estão disponíveis via ambiente. **Não haverá mock**: a origem dos blocos estruturados é sempre o Graph real.
- Q: Quais blocos passam a consumir Graph real? → A: Todos os blocos mapeados com endpoint oficial em `contracts/microsoft-365-overview.md`: `summaryCards` (`/users`, `/groups`, `/subscribedSkus` e a contagem fixa de serviços monitorados derivada do catálogo monitorado reconciliado com `serviceStatus`), `secureScore` (`/security/secureScores`), `serviceStatus` (`/admin/serviceAnnouncement/healthOverviews`), `licenseDistribution` (`/subscribedSkus`), `serviceUsage30d` (`/reports/getOffice365ServicesUserCounts` via CSV) e `recommendations` (`/security/secureScoreControlProfiles`). Os blocos editoriais `tenantHighlights`, `recentActivity` e `nextStep` permanecem editoriais por design, mas ancorados nos sinais estruturados reais agora disponíveis.
- Q: O que acontece quando uma chamada Graph falha para um bloco? → A: O backend serve o **cache/snapshot** do último valor bem-sucedido daquele bloco, marca `fresh: false`, preenche `lastUpdatedAt` com o timestamp do snapshot e a UI exibe o indicador "Última att. em {tempo relativo}". Se não existir snapshot cacheado, o bloco é normalizado para estado `empty` ou `informational`. Não existe mock como fallback.
- Q: O bloco indica ao usuário quando o dado está stale? → A: Sim. Todo bloco estruturado carrega `lastUpdatedAt` e `fresh`; quando `fresh: false`, a UI exibe "Última att. em {tempo relativo}" de forma visível, para que o usuário saiba que aquele dado é um snapshot e não uma leitura em tempo real.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ler a visão executiva do tenant (Priority: P1)

Como usuário autenticado da Contoso, eu quero abrir o módulo Microsoft 365 e entender rapidamente a escala do tenant, a saúde dos serviços, a postura de segurança e o próximo passo recomendado, para decidir onde agir primeiro sem consultar múltiplas fontes.

**Why this priority**: Esta é a principal promessa do módulo e a base para qualquer evolução posterior. Sem a visão executiva, o módulo não entrega valor demonstrável na POC.

**Independent Test**: Pode ser testado acessando `/microsoft-365` e verificando se a página apresenta uma leitura executiva completa, coerente e utilizável sem depender de subpáginas adicionais.

**Acceptance Scenarios**:

1. **Given** que um usuário autenticado acessa `/microsoft-365`, **When** a página é carregada, **Then** ele vê uma visão geral com indicadores de escala, saúde operacional, segurança, adoção e uma recomendação de próxima ação.
2. **Given** que existem sinais de atenção em segurança ou saúde de serviços, **When** o usuário autenticado visualiza a overview, **Then** esses sinais aparecem com linguagem de status consistente e prioridade clara.
3. **Given** que parte dos dados depende de curadoria editorial, **When** o usuário autenticado consulta highlights, atividade recente e próximo passo, **Then** o conteúdo continua plausível e alinhado ao estado geral do tenant.

---

### User Story 2 - Entender onde agir primeiro (Priority: P2)

Como usuário autenticado da Contoso, eu quero identificar os serviços e recomendações que mais exigem atenção, para priorizar remediações de maior impacto sem precisar interpretar dados brutos.

**Why this priority**: Depois da leitura executiva, a capacidade de priorizar ações é o principal ganho prático do módulo.

**Independent Test**: Pode ser testado verificando se a página destaca serviços em atenção, recomendações priorizadas e a relação entre postura atual e oportunidade de melhoria.

**Acceptance Scenarios**:

1. **Given** que o tenant possui recomendações relevantes, **When** o usuário autenticado abre o módulo, **Then** ele vê uma lista priorizada de ações com severidade compreensível.
2. **Given** que um serviço monitorado apresenta risco ou atenção, **When** ele aparece na visão geral, **Then** o usuário autenticado consegue distinguir quais serviços estão saudáveis e quais exigem ação imediata.

---

### User Story 3 - Navegar a evolução do módulo com clareza (Priority: P3)

Como usuário autenticado da Contoso, eu quero entender que o módulo cobre uma visão geral agora e já organiza suas subáreas futuras, para confiar que a experiência pode evoluir sem parecer improvisada.

**Why this priority**: A POC precisa mostrar direção de produto, mas sem prometer profundidade que ainda não está em escopo de entrega imediata.

**Independent Test**: Pode ser testado verificando se a experiência deixa claro o que já está disponível, o que é apenas visão executiva e quais áreas permanecem como evolução planejada.

**Acceptance Scenarios**:

1. **Given** que o módulo possui subáreas planejadas além da overview, **When** o usuário autenticado navega pelo módulo, **Then** ele entende quais áreas já entregam valor e quais permanecem como evolução posterior.
2. **Given** que uma subárea ainda não tem profundidade funcional nesta fase, **When** o usuário autenticado interage com o módulo, **Then** a experiência não induz a erro nem promete ações detalhadas fora do escopo atual.

### Edge Cases

- Se um bloco estruturado não tiver dados suficientes no Graph (workload não habilitado, tenant sem sinal, resposta vazia), a overview deve continuar renderizando e exibir estado informativo do próprio bloco, sem derrubar a página inteira.
- Os 8 serviços monitorados devem continuar presentes na overview mesmo quando um workload não estiver habilitado ou não produzir sinal suficiente no Graph; nesses casos, o detalhe deve comunicar indisponibilidade ou baixa relevância, não falha do sistema.
- Se uma chamada Graph falhar transitóriamente (timeout, 429, 5xx, token expirado) para um bloco, o backend deve servir o cache/snapshot do último valor bem-sucedido com `fresh: false` e `lastUpdatedAt` preenchido, e a UI deve exibir "Última att. em {tempo relativo}"; os demais blocos permanecem intactos.
- Se uma chamada Graph falhar e não existir snapshot cacheado para o bloco, o backend deve normalizar o bloco para estado `empty` ou `informational`, sem servir dados fictícios.
- `serviceUsage30d` depende do endpoint `/reports/getOffice365ServicesUserCounts(period='D30')` que retorna `302` para CSV temporário; o backend deve baixar e fazer o parsing desse CSV sem expor o formato bruto ao contrato Inertia.
- `tenantHighlights`, `recentActivity` e `nextStep` permanecem editoriais por design, mas não podem contradizer os blocos estruturados reais nem ser a única base para o entendimento do estado do tenant.
- A experiência deve manter a mesma linguagem visual e de status do restante do produto quando houver estados vazios, informativos, parciais ou stale (cache/snapshot).
- Se as credenciais do App Registration estiverem ausentes, inválidas ou sem consentimento administrativo, o backend deve comunicar indisponibilidade de forma segura e estruturada, sem expor detalhes de autenticação ao usuário final.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar o módulo `/microsoft-365` como a porta de entrada executiva para a leitura do tenant Microsoft 365.
- **FR-001a**: O sistema MUST permitir acesso à overview do módulo Microsoft 365 para qualquer usuário autenticado nesta fase.
- **FR-002**: O sistema MUST apresentar, na visão geral do módulo, quatro indicadores fixos de escala operacional do tenant: usuários, grupos, licenças e serviços monitorados.
- **FR-003**: O sistema MUST apresentar uma leitura resumida da postura de segurança do tenant, incluindo score atual e potencial claro de melhoria.
- **FR-004**: O sistema MUST destacar a saúde dos serviços monitorados com estados compreensíveis e comparáveis entre si.
- **FR-005**: O sistema MUST apresentar sinais agregados de adoção ou uso dos serviços Microsoft 365 em período recente, permitindo leitura rápida de workloads mais utilizados ou subutilizados.
- **FR-006**: O sistema MUST apresentar recomendações priorizadas de melhoria com severidade compreensível para o usuário autenticado.
- **FR-007**: O sistema MUST incluir highlights do tenant, atividades recentes e um próximo passo recomendado que sintetizem o estado atual em linguagem executiva.
- **FR-008**: O sistema MUST preservar ou intencionalmente estender os padrões visuais, de status e de priorização já usados nos demais módulos equivalentes do produto.
- **FR-009**: O sistema MUST deixar claro quais partes do módulo já entregam funcionalidade nesta fase e quais subáreas permanecem como evolução planejada.
- **FR-009a**: O sistema MUST limitar o escopo desta feature à overview executiva do módulo em `/microsoft-365`, sem exigir entrega funcional de subáreas detalhadas nesta mesma fase.
- **FR-009b**: O sistema MUST tratar a parametrização da integração Graph como capacidade fora da interface do produto, sem exigir fluxo de configuração visível ao usuário; credenciais vivem no ambiente do backend.
- **FR-010**: O sistema MUST aceitar que diferentes blocos do módulo possam exibir dados completos, parciais ou indisponíveis sem comprometer a compreensão geral da página, mesmo quando a fonte é o Microsoft Graph real.
- **FR-011**: O sistema MUST garantir que os blocos estruturados da overview (`summaryCards`, `secureScore`, `serviceStatus`, `licenseDistribution`, `serviceUsage30d` e `recommendations`) sejam alimentados por dados reais do Microsoft Graph do tenant Contoso, obtidos em tempo de execução no backend. Não existe mock como origem.
- **FR-012**: O sistema MUST declarar explicitamente que, nesta feature, a visão geral combina dados reais do Microsoft Graph (blocos estruturados) com conteúdo editorial (`tenantHighlights`, `recentActivity`, `nextStep`) ancorado nesses sinais reais, mantendo a experiência crível e verificável para a validação do produto.
- **FR-012a**: O sistema MUST garantir que todo bloco estruturado carregue `lastUpdatedAt` (timestamp do último sucesso da chamada Graph) e `fresh` (booleano indicando se o valor é ao vivo ou proveniente de cache/snapshot), para que a UI possa exibir o indicador "Última att. em {tempo relativo}" quando o dado estiver stale. Blocos editoriais (`tenantHighlights`, `recentActivity`, `nextStep`) MUST NOT carregar `BlockFreshness`, pois não possuem origem Graph.
- **FR-012b**: O sistema MUST, quando uma chamada Graph falhar transitóriamente (timeout, 429, 5xx, token expirado) para um bloco estruturado, servir o **cache/snapshot** do último valor bem-sucedido daquele bloco com `fresh: false` e `lastUpdatedAt` preenchido, preservando os demais blocos e a renderização integral da overview.
- **FR-012c**: O sistema MUST, quando não existir snapshot cacheado para um bloco cuja chamada Graph falhou, normalizar o bloco para estado `empty` ou `informational`, sem servir dados fictícios nem derrubar a overview.
- **FR-012d**: O sistema MUST, quando uma chamada Graph voltar a ter sucesso para um bloco previamente stale, restaurar o bloco para `fresh: true`, atualizar `lastUpdatedAt` com o timestamp do novo sucesso e atualizar o snapshot cacheado com o novo valor, de forma automática sem intervenção manual.
- **FR-013**: O sistema MUST estruturar a informação e a composição visual da overview de modo que futuras subáreas como licenciamento, usuários, grupos, secure score, relatórios e workloads especializados possam ser acopladas sem alterar o contrato principal, a hierarquia executiva dos blocos nem a narrativa-base do módulo.
- **FR-014**: O sistema MUST tratar `summaryCards` como um conjunto fixo de quatro blocos com os seguintes significados: `users` para escala de contas do tenant, `groups` para colaboração estruturada, `licenses` para capacidade/consumo de licenças e `services` para quantidade de serviços monitorados na overview.
- **FR-015**: O sistema MUST tratar `serviceStatus` como um catálogo fixo de 8 serviços monitorados na fase 1; cada item deve permanecer presente mesmo quando o serviço não estiver habilitado, estiver sem sinal suficiente ou retornar apenas dados parciais do Graph.
- **FR-016**: O sistema MUST tratar `recommendations` como uma lista executiva fixa das 5 recomendações mais relevantes, ordenadas por severidade e impacto percebido, derivadas dos control profiles reais do Secure Score do tenant.
- **FR-017**: O sistema MUST tratar `tenantHighlights` como um conjunto de 2 a 4 insights editoriais, cada um ancorado nos sinais estruturados reais agora disponíveis no tenant ou em premissas documentadas e coerentes com os demais blocos da overview.
- **FR-018**: O sistema MUST tratar `recentActivity` como uma lista de 3 a 5 eventos recentes em linguagem executiva, coerente com os blocos estruturados reais e adequada para leitura rápida do estado do tenant.
- **FR-019**: O sistema MUST tratar `nextStep` como exatamente uma ação recomendada, derivada do principal gap identificado em risco, adoção, operação ou postura de segurança a partir dos dados reais do tenant.
- **FR-020**: O sistema MUST considerar os blocos editoriais obrigatórios no payload da overview como suporte contextual; eles não podem contradizer os blocos estruturados reais nem substituir a leitura executiva baseada em dados estruturados.
- **FR-021**: O sistema MUST garantir coerência interna entre blocos da mesma overview, de modo que os números e mensagens dos cards, distribuições, listas e conteúdo editorial não se contradigam, ainda que a origem seja o tenant real.
- **FR-022**: O sistema MUST normalizar no backend estados de bloco `graph-backed` (fresco), `stale` (cache/snapshot), `partial`, `editorial`, `empty` e `informational` sem alterar o contrato da página nem expor detalhes sensíveis de integração ao usuário final. Não existe estado `mock`.
- **FR-023**: O sistema MUST manter credenciais, tokens, permissões e demais detalhes sensíveis do seam Graph exclusivamente no backend ou em ambiente seguro, sem expô-los em props Inertia ou elementos visíveis da overview.
- **FR-024**: O sistema MUST consumir o Microsoft Graph em modo app-only com `ClientCredentialContext` usando o stack oficial PHP composto por `microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague` e `microsoft/kiota-http-guzzle`, escopo `https://graph.microsoft.com/.default` e permissões de aplicação já concedidas ao App Registration do tenant Contoso.
- **FR-024a**: O sistema MUST tratar as permissões Graph (`Reports.Read.All`, `ServiceHealth.Read.All`, `LicenseAssignment.Read.All`, `Directory.Read.All` ou equivalente de least privilege, e `SecurityEvents.Read.All`) e o consentimento administrativo como pré-requisitos documentados e atendidos pelo App Registration do tenant Contoso antes da execução desta feature.
- **FR-024b**: O sistema MUST tratar `serviceUsage30d` como exceção de contrato: o endpoint `/reports/getOffice365ServicesUserCounts(period='D30')` retorna `302` para CSV temporário, exigindo download e parsing backend sem expor o formato bruto ao cliente.
- **FR-025**: O sistema MUST declarar requisitos mínimos de acessibilidade para a overview, incluindo navegação por teclado nos elementos interativos, labels e headings semanticamente claros e estados de foco/contraste consistentes com os padrões do produto.
- **FR-026**: O sistema MUST declarar requisitos mínimos de observabilidade do seam, permitindo distinguir internamente blocos `graph-backed`, `stale`, `partial`, `editorial`, `empty` e `informational` quando houver diagnóstico de comportamento, indisponibilidade ou falha de chamada ao Graph.
- **FR-026a**: O sistema MUST garantir que o indicador "Última att. em {tempo relativo}" seja exibido na UI dentro ou adjacente a cada bloco estruturado com `fresh: false`, com contraste mínimo igual ao padrão de labels do produto e texto legível em desktop e mobile, para que o usuário identifique visualmente que aquele dado é um snapshot e não uma leitura em tempo real.
- **FR-027**: O sistema MUST considerar [contracts/microsoft-365-overview.md](./contracts/microsoft-365-overview.md) a referência normativa para o contrato de payload e para o mapeamento oficial dos endpoints desta feature.

### Key Entities *(include if feature involves data)*

- **Tenant Overview**: Representa a leitura executiva consolidada do ambiente Microsoft 365 do cliente, reunindo escala, saúde, segurança, adoção e priorização.
- **Summary Indicator**: Representa um indicador agregado do tenant, como total de usuários, licenças, grupos ou serviços monitorados.
- **Service Health Item**: Representa o estado de um serviço Microsoft 365 monitorado, com status e detalhe resumido.
- **Security Score Snapshot**: Representa a fotografia atual da postura de segurança, incluindo score e oportunidade de melhoria.
- **Recommendation**: Representa uma ação recomendada para elevar a postura do tenant, com prioridade e severidade.
- **Usage Signal**: Representa um recorte agregado de uso ou adoção de serviços em um período recente.
- **Editorial Insight**: Representa highlights, atividade recente e próximo passo construídos para contextualizar o estado do tenant.
- **Module Area**: Representa uma área funcional do módulo Microsoft 365, distinguindo o que já está disponível agora do que é evolução planejada.
- **Overview Block State**: Representa o estado normalizado de um bloco da overview, incluindo disponibilidade completa, parcial, informativa ou vazia, sem expor detalhes internos do seam Graph.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos acessos ao módulo `/microsoft-365` exibem uma visão geral com todos os blocos essenciais previstos para leitura executiva do tenant.
- **SC-002**: Em até 2 minutos após abrir `/microsoft-365`, um usuário autenticado consegue identificar corretamente a escala do tenant, a postura resumida de segurança, pelo menos um serviço em atenção e a próxima ação recomendada.
- **SC-003**: Em validação interna da POC, pelo menos 90% dos revisores conseguem apontar corretamente quais serviços ou recomendações exigem atenção prioritária após consultar a overview.
- **SC-004**: A experiência deixa claro, para 100% dos fluxos demonstrados, o que já está disponível na overview e o que permanece como evolução posterior do módulo.
- **SC-005**: Em 100% dos cenários demonstrados, `tenantHighlights`, `recentActivity` e `nextStep` reforçam a leitura executiva, mas não substituem nem contradizem os blocos estruturados obrigatórios da overview.

## Out of Scope

- Entregar subáreas detalhadas além da overview executiva em `/microsoft-365` nesta fase.
- Introduzir fluxo de configuração da integração Microsoft Graph na interface do produto.
- Exigir login Microsoft delegado do usuário final ou qualquer autenticação interativa com a Microsoft.
- Criar persistência analítica, histórico de longo prazo, filas ou automações operacionais fora do cache/snapshot por bloco.
- Expor credenciais, tokens, consentimentos, detalhes sensíveis de integração ou CSV bruto de reports ao frontend.
- Implementar profundidade funcional completa para workloads especializados como Defender, Intune, SharePoint e OneDrive nesta entrega.

## Assumptions

- A narrativa de tenant continua usando a Contoso e o contexto administrativo como referência de produto, sem restringir o acesso da feature além de usuários autenticados.
- A overview precisa ser consumível por qualquer usuário autenticado.
- A primeira entrega do módulo continua centrada na visão geral executiva, não na profundidade operacional de todas as subáreas.
- Nesta feature, o submenu pode comunicar áreas futuras, mas a única área que precisa de entrega funcional completa é a overview executiva de `/microsoft-365`.
- A parametrização da integração Graph permanece fora da interface do produto; credenciais vivem no ambiente do backend.
- A experiência reutiliza a navegação, a linguagem visual e os padrões de status já adotados no produto, salvo necessidade explícita de extensão.
- Dados de highlights, atividade recente e próximo passo permanecem editoriais nesta feature, mas ancorados nos sinais estruturados reais agora disponíveis via Graph.
- Os blocos estruturados (`summaryCards`, `secureScore`, `serviceStatus`, `licenseDistribution`, `serviceUsage30d`, `recommendations`) são alimentados por dados reais do Microsoft Graph do tenant Contoso em tempo de execução. Não existe mock.
- O App Registration no Entra ID do tenant Contoso já existe com permissões de aplicação (`Reports.Read.All`, `ServiceHealth.Read.All`, `LicenseAssignment.Read.All`, leitura ampla de diretório e `SecurityEvents.Read.All`) e consentimento administrativo concedido.
- O backend mantém um cache/snapshot do último valor bem-sucedido por bloco via cache storage nativo do Laravel (driver configurado em `config/cache.php`, com TTL controlado por bloco), para servir como resiliência quando uma chamada Graph falha transitóriamente; este cache não é persistência analítica nem histórico, e sobrevive a restarts quando o driver de cache é persistente (ex: Redis, database, file).
- Workloads especializados como Defender, Intune, SharePoint e OneDrive permanecem fora do escopo detalhado desta primeira entrega, embora façam parte da visão de evolução do módulo.
- A estrutura do módulo deve suportar tenants com dados incompletos, serviços não habilitados ou sinais insuficientes vindos do Graph sem comprometer a narrativa executiva.
- O contrato oficial de endpoints documentado para esta feature é autoritativo para o planejamento da overview; os artefatos de `discovery/` permanecem como racional técnico e visão de evolução.
