# API Mapping — Microsoft 365

## Estratégia

Este arquivo mapeia cada capacidade de produto do módulo Microsoft 365 para as superfícies oficiais da Microsoft que melhor sustentam a futura implementação. O objetivo não é travar a POC em integração real agora, e sim garantir que o desenho do módulo seja compatível com APIs oficiais desde o início.

## Authentication Strategy

- A estratégia padrão de integração futura com Microsoft Graph neste projeto será **app-only**.
- O Orkestria360 **não terá tela de login Microsoft** para o usuário final.
- Portanto, as chamadas ao Graph devem ser feitas no backend com **Application permissions** e obtenção de token via **OAuth 2.0 client credentials flow**.
- Esta decisão segue a orientação oficial da Microsoft para cenários **“where no user is present”**.
- O principal configurado no Microsoft Entra será uma **App Registration**, e não um usuário humano operando via delegated auth.
- Sempre que possível, os endpoints escolhidos para o módulo Microsoft 365 devem ser compatíveis com **Application permissions**.
- Se algum endpoint futuro só suportar **Delegated permissions**, isso deve ser tratado como exceção de arquitetura e reavaliado antes de entrar no escopo de implementação.

## PHP Integration Baseline

- A implementação futura no backend Laravel deve priorizar o **SDK oficial PHP do Microsoft Graph**, e não chamadas HTTP manuais como caminho principal.
- Pacote oficial indicado pela documentação da Microsoft:
  - `microsoft/microsoft-graph`
- Dependência relevante citada no tutorial oficial:
  - `microsoft/kiota-authentication-phpleague`
- Papel do `microsoft/kiota-authentication-phpleague`:
  - é a camada de autenticação usada pelo ecossistema Kiota/Graph SDK em PHP
  - sustenta o fluxo app-only com `ClientCredentialContext`
  - no uso padrão do projeto, ele deve ser tratado como dependência do stack oficial do SDK, não como alternativa paralela ao SDK
- Relação entre os pacotes oficiais:
  - `microsoft/microsoft-graph` depende de `microsoft/microsoft-graph-core`
  - `microsoft/microsoft-graph-core` depende de `microsoft/kiota-authentication-phpleague`
- Dependências e objetos-base destacados nos tutoriais oficiais:
  - `Microsoft\Graph\GraphServiceClient`
  - `Microsoft\Kiota\Authentication\Oauth\ClientCredentialContext`
  - `Microsoft\Graph\Core\Authentication\GraphPhpLeagueAccessTokenProvider`
- Fluxo-base documentado pela Microsoft para PHP app-only:
  - carregar `CLIENT_ID`, `CLIENT_SECRET` e `TENANT_ID`
  - criar `ClientCredentialContext`
  - instanciar `GraphServiceClient`
  - usar o escopo `https://graph.microsoft.com/.default`
- Diretriz de projeto:
  - usar SDK oficial para autenticação e consumo do Graph
  - assumir `microsoft/kiota-authentication-phpleague` como parte do stack oficial suportado pelo SDK
  - admitir HTTP manual apenas como fallback pontual, quando algum endpoint ou comportamento não estiver bem coberto pelo SDK

## Fontes Oficiais de Referência

- Microsoft Graph overview: `https://graph.microsoft.com`
- Users overview: `https://github.com/microsoftgraph/microsoft-graph-docs-contrib/blob/main/concepts/azuread-users-concept-overview.md`
- Service communications overview: `https://github.com/microsoftgraph/microsoft-graph-docs-contrib/blob/main/concepts/service-communications-concept-overview.md`
- Reports overview: `https://github.com/microsoftgraph/microsoft-graph-docs-contrib/blob/main/concepts/reportroot-concept-overview.md`
- Security API overview: `https://github.com/microsoftgraph/microsoft-graph-docs-contrib/blob/main/api-reference/v1.0/resources/security-api-overview.md`

## Mapeamento por Capability

| Capability do produto | Recurso / endpoint oficial | Natureza dos dados | Overview vs subpágina | Estratégia POC inicial |
| --- | --- | --- | --- | --- |
| Total de usuários e fotografia de contas | `/users` | Diretório de usuários do tenant | Overview com agregados; subpágina com tabela e filtros | `backend seam` |
| Usuários ativos Microsoft 365 | `/reports/getOffice365ActiveUserDetail`, `/reports/getOffice365ActiveUserCounts` | Relatórios de atividade por usuário e agregados | Overview com count; subpágina com breakdown | `backend seam` |
| Total de grupos e membros | `/groups`, `/groups/{id}/members/microsoft.graph.user` | Diretório de grupos e membros | Overview com count; subpágina com detalhe | `backend seam` |
| Atividade de grupos Microsoft 365 | `/reports/getOffice365GroupsActivityCounts`, `/reports/getOffice365GroupsActivityDetail` | Relatórios de atividade e colaboração por grupo | Melhor em subpágina; overview usa resumo | `future integration` |
| Inventário de licenças | `/subscribedSkus` | SKUs contratadas, capacidade e consumo | Overview com gráfico; subpágina com tabela completa | `backend seam` |
| Saúde dos serviços | `/admin/serviceAnnouncement/healthOverviews` | Health overviews e issues de serviços Microsoft 365 | Overview direto; subpágina opcional | `backend seam` |
| Comunicados operacionais / message center | `serviceAnnouncement` family | Posts e comunicações de serviço | Melhor em subpágina ou recent activity contextual | `future integration` |
| Secure Score agregado | `/security/secureScores` | Score agregado e metadata de score | Overview direto; subpágina com histórico e comparativos | `backend seam` |
| Recomendações e controles de remediação | `/security/secureScoreControlProfiles` | Controles, impacto, remediation, tenant score | Overview com top 3-5; subpágina com tabela completa | `backend seam` |
| Uso e adoção Microsoft 365 por app | `/reports/getM365AppUserDetail` | Uso por usuário e app | Overview com agregados; subpágina analítica depois | `future integration` |
| Serviços ativos / uso 30 dias | `/reports/getOffice365ServicesUserCounts` | Contagem por serviço e atividade | Overview direto | `backend seam` |
| Teams adoption | `reports` family for Teams activity | Métricas de colaboração por workload Teams | Melhor em subpágina; overview usa resumo | `future integration` |
| Exchange usage | `reports` family for mailbox activity/usage | Uso e capacidade de mailbox | Overview com resumo; subpágina depois | `future integration` |
| SharePoint usage | `reports` family for SharePoint activity/site usage | Adoção, atividade e sites | Melhor em subpágina | `future integration` |
| OneDrive usage | `reports` family for OneDrive activity/account usage | Contas, atividade e armazenamento | Melhor em subpágina | `future integration` |
| MFA success metrics | `/reports/getMetricsForMfaSignInSuccess` | Métricas de sucesso de autenticação MFA | Overview com risco resumido; subpágina depois | `future integration` |
| Cobertura de métodos de autenticação | authentication methods usage insights | Registro/capacidade de MFA, SSPR e passwordless | Melhor em subpágina MFA | `future integration` |
| Atividade recente do tenant | combinação de `serviceAnnouncement`, `reports/*` e superfícies futuras de auditoria | Eventos recentes operacionais e analíticos | Overview com feed editorial agregado | `mock now, seam later` |

## Mapeamento do Mock Atual

| Bloco atual da página | Contrato atual | API oficial candidata |
| --- | --- | --- |
| Summary cards | `summaryCards[]` | `/users`, `/subscribedSkus`, `/groups`, `/reports/getOffice365ServicesUserCounts` |
| Secure Score | `secureScore` | `/security/secureScores` |
| Status dos serviços | `serviceStatus[]` | `/admin/serviceAnnouncement/healthOverviews` |
| Distribuição de licenças | `licenseDistribution[]` | `/subscribedSkus` |
| Uso 30 dias | `serviceUsage30d[]` | `/reports/getOffice365ServicesUserCounts` e famílias de reports por workload |
| Recomendações | `recommendations[]` | `/security/secureScoreControlProfiles` |
| Tenant highlights | `tenantHighlights[]` | composição editorial derivada de score, reports e licenças |
| Recent activity | `recentActivity[]` | service communications + reports + futuras superfícies de auditoria |
| Next step | `nextStep` | composição editorial baseada em controls/reports |

## Ambiguidades e Recomendações

## Prerequisites and Availability

### Assunção operacional da integração

- Para este discovery, assumimos que a **aplicação** configurada para consumir Microsoft Graph no futuro já terá:
  - permissões Graph necessárias
  - consentimento administrativo quando aplicável
  - roles, policies, grupos e escopos organizacionais necessários para leitura dos dados previstos

- Em outras palavras: o problema principal modelado por este discovery **não é** “como conceder acesso”, e sim “quais superfícies oficiais usar e o que pode variar por tenant”, assumindo integração **sem usuário presente**.

### Permissões, roles e grupos necessários por família de endpoint

#### Reports (`/reports/*`)

- **Permissão Graph mínima confirmada**
  - Application: `Reports.Read.All`
- **Observação sobre delegated auth**
  - A documentação oficial também aceita delegated auth com `Reports.Read.All` e papéis administrativos específicos, mas este projeto não adotará esse modelo como padrão.
- **Groups / policies**
  - Não há exigência de grupo funcional específico no discovery.
  - Políticas organizacionais devem permitir que o principal configurado consulte usage reports.

#### Service health (`/admin/serviceAnnouncement/healthOverviews`)

- **Permissão Graph mínima confirmada**
  - Application: `ServiceHealth.Read.All`
- **Admin consent**
  - Necessário.
- **Roles**
  - Este discovery não fixa um papel nominal adicional além do acesso já concedido à App Registration configurada.
- **Groups / policies**
  - O principal deve estar liberado para leitura administrativa de saúde dos serviços do tenant.

#### Secure Score (`/security/secureScores`)

- **Permissão Graph**
  - O discovery assume um principal com permissão administrativa suficiente para leitura de Secure Score.
- **Implementação futura**
  - Ao ativar integração real, confirmar a permissão Graph exata do endpoint escolhido e aplicar least privilege.
- **Roles / policies**
  - O principal deve ter leitura administrativa de postura de segurança do tenant.

#### Secure Score controls (`/security/secureScoreControlProfiles`)

- **Permissão Graph**
  - O discovery assume um principal com permissão administrativa suficiente para leitura de controles e remediações de Secure Score.
- **Implementação futura**
  - Confirmar a permissão Graph exata do endpoint usado e restringir escopo no app registration.
- **Roles / policies**
  - O principal deve ter leitura administrativa sobre dados de postura/remediação.

#### Diretório de usuários (`/users`)

- **Permissão Graph recomendada para cenário de dashboard tenant-wide**
  - Application: planejar `Directory.Read.All` como baseline conservadora
- **Observação**
  - Dependendo do recorte final de campos e do endpoint realmente usado, a implementação pode reduzir para permissões mais específicas como `User.Read.All` ou `User.ReadBasic.All`.
- **Roles / groups**
  - O principal precisa de leitura ampla do diretório, sem dependência de grupo funcional específico documentada aqui.

#### Diretório de grupos (`/groups`, `/groups/{id}/members/microsoft.graph.user`)

- **Permissões Graph mínimas confirmadas**
  - Leitura de grupos: `Group.Read.All`
  - Leitura de membros de grupos: `GroupMember.Read.All`
- **Application**
  - O discovery assume equivalentes de leitura ampla em app context, compatíveis com dashboard tenant-wide.
- **Roles / groups**
  - O principal precisa de leitura organizacional de grupos e membros.

#### Licenciamento (`/subscribedSkus`)

- **Permissão Graph mínima confirmada**
  - Application: `LicenseAssignment.Read.All`
- **Permissões mais amplas aceitas pela doc**
  - `Directory.Read.All`
  - `Directory.ReadWrite.All`
  - `Organization.Read.All`
  - `Organization.ReadWrite.All`
- **Roles / groups**
  - O principal precisa de leitura organizacional de inventário de licenças.

#### Authentication / MFA insights

- **Permissão Graph**
  - Este discovery assume um principal com acesso administrativo suficiente às superfícies de authentication methods e relatórios MFA.
- **Implementação futura**
  - Confirmar endpoint final e permissão exata antes de integrar, porque esse domínio costuma variar mais entre relatórios, authentication methods usage insights e métricas de sign-in.
- **Policies**
  - O tenant precisa ter as políticas e workloads de identidade relevantes habilitados para produzir sinal útil.

### O que ainda varia entre tenants

- Mesmo com credenciais corretamente configuradas, a disponibilidade funcional e a densidade de dados continuam variando por tenant:
  - licenças contratadas
  - workloads efetivamente habilitados
  - adoção real de cada serviço
  - volume de atividade dentro do período de retenção dos relatórios
  - postura de segurança efetivamente configurada no ambiente

### Interpretação para a POC

- Para a futura integração, devemos tratar os endpoints como **tecnicamente acessíveis** pelo principal configurado no sistema.
- O que pode mudar de empresa para empresa é:
  - se existe dado para aquele workload
  - se o dado vem completo, parcial ou vazio
  - se aquele domínio faz sentido para o tenant em questão

### Impacto no desenho do módulo

- A UI e o contrato de dados devem aceitar:
  - blocos com dados vazios
  - workloads não habilitados
  - recomendações não aplicáveis
  - score/postura variando conforme serviços habilitados

### Exemplos práticos

- `reports/*`: assumimos que a App Registration configurada terá `Reports.Read.All`; o que varia é se o tenant tem uso suficiente para gerar sinal útil.
- `/admin/serviceAnnouncement/healthOverviews`: assumimos acesso autorizado; o que varia é o conjunto de serviços efetivamente assinados e monitorados pelo tenant.
- `/security/secureScores` e `/security/secureScoreControlProfiles`: assumimos acesso autorizado; o que varia é a postura real do tenant e os serviços de segurança habilitados.
- `/users`, `/groups`, `/subscribedSkus`: assumimos acesso autorizado; o que varia é a composição real do diretório e do portfólio de licenças.

### Referência oficial para PHP app-only

- Tutorial base:
  - `Build PHP apps with Microsoft Graph and app-only authentication`
  - `https://learn.microsoft.com/en-us/graph/tutorials/php-app-only`
- Etapa de autenticação:
  - `Add app-only authentication to PHP apps for Microsoft Graph`
  - `https://learn.microsoft.com/en-us/graph/tutorials/php-app-only-authentication`
- Esses tutoriais reforçam 4 decisões do discovery:
  - App Registration no Entra
  - `client credentials flow`
  - `GraphServiceClient` no backend PHP
  - uso de `.default` para as application permissions concedidas à app

### Atividade recente

- Não existe um único endpoint canônico, simples e suficiente para um feed executivo de “recent activity” cobrindo todo o tenant.
- Recomendação: manter `recentActivity` como bloco editorial mockado na fase 1.
- Evolução futura: compor esse feed com service communications, relatórios e, se necessário, superfícies de auditoria.

### Microsoft Defender / Intune / Configurações

- O submenu já sugere páginas dedicadas, mas a superfície oficial exata ainda depende do nível de profundidade desejado.
- Recomendação: usar o discovery atual para posicionar essas áreas como subpáginas futuras e só fechar endpoints detalhados quando elas virarem fase ativa de implementação.

### Secure Score

- Para score agregado, usar `/security/secureScores`.
- Para remediações, usar `/security/secureScoreControlProfiles`.
- Recomendação: separar claramente esses dois papéis no contrato futuro da overview.
