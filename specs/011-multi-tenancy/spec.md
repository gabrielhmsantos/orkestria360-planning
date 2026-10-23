# Feature Specification: Multi-tenancy Microsoft 365

**Feature Branch**: `feat/011-multi-tenancy`

**Created**: 2026-08-21

**Status**: Ready for planning

**Input**: User description: "quero implementar multi tenancy no orkestria, já fizemos discovery está em discovery/multi-tenant; se baseie nele, ele é a fonte."

## Clarifications

### Session 2026-08-21

- Q: Como o primeiro usuário com e-mail corporativo passa a pertencer à organização que será criada? → A: Somente um `admin` do tenant interno da plataforma Orkestria360 provisiona, de forma atômica, o tenant do cliente e o convite para seu primeiro `admin`; o usuário e seu membership `admin` são criados no aceite. Não há registro público, autoatendimento ou membership por domínio de e-mail.
- Q: Quando um `admin` do tenant adicionar um usuário, como esse usuário receberá acesso inicial? → A: Convite individual, temporário e de uso único, enviado por e-mail e com URL também exibida no front ao iniciador autorizado; o mesmo modelo vale para o primeiro `admin` de um novo tenant provisionado.
- Q: Como a plataforma deve identificar quem pode atuar como administrador global e provisionar novos tenants? → A: Um tenant interno da plataforma concentra essa capacidade; seu primeiro usuário é criado por seed e seus administradores provisionam tenants de clientes.
- Q: Nesta entrega, como novos administradores do tenant interno da plataforma serão adicionados depois do usuário criado por seed? → A: Um `admin` já existente do tenant da plataforma convida outro `admin` da plataforma pelo mesmo modelo de convite individual.
- Q: Qual deve ser a validade de um convite de acesso antes que ele expire? → A: 7 dias.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Aceitar convite fechado (Priority: P1)

Como destinatário de um convite individual, quero criar minhas credenciais e aceitar o convite para acessar somente a organização a que fui associado.

**Superfície estrutural**: [Aceitar convite](../../discovery/multi-tenant/representacao-estrutural-telas.md#01-aceitar-convite). **Card implementado**: `Aceitar convite — formulário de credenciais`.

**Independent Test**: Um convite válido cria/reutiliza o usuário e sua membership atomicamente; tokens expirados, revogados ou reutilizados não expõem dados nem criam acesso.

**Acceptance Scenarios**:

1. **Given** um convite individual válido, **When** o destinatário define as credenciais, **Then** usuário, membership e consumo do convite são criados atomicamente.
2. **Given** token inválido, expirado, revogado ou já utilizado, **When** a tela é aberta, **Then** ela exibe orientação sanitizada sem nome, e-mail ou dados de outro tenant.

---

### User Story 2 - Administrar organizações no control plane (Priority: P1)

Como `platform admin`, quero provisionar e listar customers para iniciar seu onboarding fechado sem acessar seus dados operacionais.

**Superfície estrutural**: [Organizações](../../discovery/multi-tenant/representacao-estrutural-telas.md#02-organizações). **Cards implementados**: `Organizações — cabeçalho de página`, `Provisionar organização — ação de criação`, `Lista de organizações — tabela operacional`.

**Independent Test**: O único tenant `platform` provisiona customer inativo, convite bootstrap e temas juntos, e lista somente dados de control plane.

**Acceptance Scenarios**:

1. **Given** `platform admin`, **When** provisiona customer, **Then** customer, convite bootstrap e temas são criados sem usuário/membership customer antes do aceite.

---

### User Story 3 - Acompanhar bootstrap de uma organização (Priority: P1)

Como `platform admin`, quero consultar o detalhe de um customer para recuperar ou encerrar seu onboarding inicial sem acessar dados operacionais.

**Superfície estrutural**: [Organização](../../discovery/multi-tenant/representacao-estrutural-telas.md#03-organização). **Cards implementados**: `Organização — cabeçalho de detalhe`, `Situação de bootstrap — status factual`, `Convite de bootstrap do customer — card operacional`.

**Independent Test**: O iniciador autorizado vê o estado factual do bootstrap, recupera a URL somente enquanto pending e reemite/cancela apenas nas transições permitidas.

**Acceptance Scenarios**:

1. **Given** envio de e-mail falho ou convite expirado/revogado, **When** o iniciador autorizado abre o detalhe, **Then** recupera a URL pendente ou reemite nas condições permitidas, preservando o histórico.
2. **Given** customer já ativado, **When** o platform admin tenta alterar o convite inicial, **Then** a operação é negada e nenhum dado operacional é exposto.

---

### User Story 4 - Conectar e sincronizar Microsoft 365 (Priority: P1)

Como `customer admin`, quero conectar Microsoft 365 e acompanhar sincronizações independentes para confiar no estado factual dos dados da minha organização.

**Superfície estrutural**: [Conexão Microsoft 365](../../discovery/multi-tenant/representacao-estrutural-telas.md#04-conexão-microsoft-365). **Cards implementados**: `Conexão Microsoft 365 — cabeçalho de página`, `Conexão Microsoft 365 — card de conexão`, `Disponibilidade dos dados Microsoft 365 — painel de disponibilidade`.

**Independent Test**: Duas conexões ativas executam independentemente; autorização inválida não ativa conexão e falha/revogação em A não bloqueia B nem apaga seu histórico.

**Acceptance Scenarios**:

1. **Given** retorno de autorização válido, **When** o tenant Microsoft é confirmado, **Then** a conexão é ativada apenas para o customer correto e sem colisão global.
2. **Given** duas conexões, **When** sync de uma falha, **Then** a outra permanece elegível e cada resultado mantém tenant+connection corretos.
3. **Given** revogação, consentimento ausente ou erro, **When** a conexão é exibida, **Then** estado, razão sanitizada e frescor são factuais, sem inventar zero/vazio.
4. **Given** platform admin em um customer conectado, **When** solicita sync, **Then** uma solicitação de control plane assíncrona executa `--force` e expõe somente diagnóstico agregado/sanitizado; as rotinas usam a mesma fila sem conceder leitura do data plane ao platform.
5. **Given** o admin customer precisa consentir em um tenant Entra no qual é guest ou administrador, **When** escolhe informar o Tenant ID GUID, **Then** o redirect usa `/{tenant-id}/adminconsent` e o callback só pode promover a conexão quando o tenant retornado corresponder à intenção persistida e for confirmado pelo Graph.

---

### User Story 5 - Administrar membros sem acesso cruzado (Priority: P1)

Como `customer admin`, quero administrar convites e memberships do meu customer para manter acessos explícitos e os dados isolados entre organizações.

**Superfície estrutural**: [Usuários do customer](../../discovery/multi-tenant/representacao-estrutural-telas.md#05-usuários-do-customer). **Cards implementados**: `Usuários — cabeçalho de página`, `Convidar pessoa — ação de criação`, `Usuários — tabela operacional`, `Convites pendentes — tabela operacional`.

**Independent Test**: Com dois customers, o admin só administra seu customer; member não administra, e consultas/mutations/documentos/auditoria não cruzam organizações.

**Acceptance Scenarios**:

1. **Given** customer admin, **When** convida, revoga ou reativa pessoa, **Then** a ação ocorre apenas no tenant atual e respeita o lifecycle do convite e a exclusividade global de acesso ativo.
2. **Given** member ou usuário sem membership, **When** tenta administrar ou acessar dados de outro tenant, **Then** a operação é negada antes da exposição.
3. **Given** dados equivalentes em dois customers, **When** um é alterado, **Then** o outro não é modificado nem revelado.

---

### User Story 6 - Identificar organização autorizada no shell (Priority: P1)

Como usuário autenticado com membership ativa, quero ver passivamente minha organização atual no shell para compreender o contexto sem selecionar ou trocar tenant.

**Superfície estrutural**: [Organização atual — identificação passiva](../../discovery/multi-tenant/representacao-estrutural-telas.md#organização-atual--identificação-passiva). **Card implementado**: `Organização atual — identificação passiva`.

**Independent Test**: O shell recebe tenant autorizado exclusivamente do backend; usuários sem membership não recebem identificação nem dados organizacionais, e não há seletor, rota ou troca de tenant.

**Acceptance Scenarios**:

1. **Given** membership ativa, **When** a rota autenticada abre, **Then** o cabeçalho mostra `Organização atual` com o nome autorizado.
2. **Given** ausência de membership, **When** alguém acessa rota organizacional, **Then** a operação é negada sem inferência por e-mail, domínio ou URL.

---

### User Story 7 - Administrar acessos da plataforma (Priority: P1)

Como `platform admin`, quero convidar, acompanhar e revogar outros administradores da plataforma para manter explícito quem opera o control plane.

**Superfície estrutural**: [Usuários do platform](../../discovery/multi-tenant/representacao-estrutural-telas.md#06-usuários-do-platform). **Cards implementados**: `Usuários — cabeçalho de página`, `Convidar administrador da plataforma — ação de criação`, `Usuários — tabela operacional`, `Convites pendentes da plataforma — tabela operacional`.

**Independent Test**: Um `platform admin` administra apenas memberships e convites `admin/access` do tenant `platform`, registra auditoria de control plane e não abre contexto RLS de customer.

**Acceptance Scenarios**:

1. **Given** `platform admin`, **When** convida outra pessoa, **Then** o convite é individual `admin/access` do tenant `platform`, com o lifecycle e URL recuperável já aprovados.
2. **Given** dois ou mais administradores ativos do `platform`, **When** um acesso é revogado, **Then** somente a membership alvo é revogada e a ação é auditada; a revogação do último administrador ativo é negada. Uma membership revogada pode ser reativada diretamente quando a pessoa não possui acesso ativo em outra organização.
3. **Given** `customer admin`, `member` ou pessoa sem membership, **When** tenta abrir ou alterar acessos da plataforma, **Then** a operação é negada sem expor pessoas, convites ou dados de customers.

### Edge Cases

- A organização Microsoft retornada pela autorização não corresponde à organização confirmada posteriormente pelo provedor.
- Duas tentativas concorrentes tentam vincular a mesma organização Microsoft a organizações internas distintas.
- Uma falha de credencial compartilhada afeta a infraestrutura, mas não deve marcar arbitrariamente cada conexão individual como revogada ou desconectada.
- Um processo de longa duração falha durante uma operação de uma organização e depois atende outra; o contexto anterior não pode persistir.
- Uma leitura ou escrita fora do caminho normal de aplicação tenta acessar dados de outra organização ou criar uma relação entre organizações diferentes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE manter exatamente um tenant interno `platform` da Orkestria360, criado no bootstrap/seed com `admin@example.com` como seu primeiro `admin active`; nenhum seeder DEVE criar ou citar `test@example.com` ou um customer. Somente `admin` desse tenant DEVE provisionar uma organização `customer` com identificador próprio, nome, slug e estado, sem reutilizar o identificador da organização Microsoft, e convidar outro `admin` da plataforma pelo mesmo modelo de convite individual `admin/access`.
- **FR-002**: O provisioning DEVE criar na mesma operação customer com `activated_at=null`, seu convite individual `role=admin`/`purpose=customer_bootstrap` e os temas de Governance; não DEVE criar `User` nem membership do cliente antes do aceite. Reemissão é exclusiva de `admin` ativo do `platform` quando customer está inativo, sem `admin active` e sem bootstrap pendente válido, somente após o anterior expirar ou ser revogado explicitamente. O aceite DEVE criar/reutilizar `User`, criar membership `admin active`, consumir o convite, preencher `activated_at` write-once e definir credenciais na mesma transação; consentimento Microsoft não afeta ativação.
- **FR-003**: O sistema DEVE manter associações únicas e explícitas por usuário e organização, com as capacidades mínimas `admin` e `member`; `admin` administra associações, configurações e conexão Microsoft somente no próprio tenant, enquanto `member` usa as capacidades operacionais da sua organização. O `admin` adiciona usuários pelo mesmo modelo de convite individual usado no provisioning inicial. No V1, uma pessoa só pode ter uma membership `active` globalmente; emissão, aceite e reativação são serializados por e-mail normalizado e revalidam essa regra. O modelo de dados não impede memberships futuros em múltiplos tenants.
- **FR-004**: O sistema DEVE restringir leitura e operações de uma organização a usuários com associação local comprovada antes de disponibilizar dados organizacionais; domínio de e-mail não pode descobrir tenant nem criar ou conceder membership.
- **FR-004a**: Cada convite DEVE ter `role` independente (`admin`/`member`) e `purpose` (`customer_bootstrap`/`access`), ser individual, uso único e TTL de 7 dias. `customer_bootstrap` só é `admin` e só existe para customer inativo; admins adicionais são `admin/access`. O scheduler DEVE expirar idempotentemente convites `pending` vencidos, apagar ciphertext recuperável e nunca alterar `accepted`/`revoked`. Um convite que expira permanece `expired`; uma reemissão cria outro `pending` e nunca converte retroativamente esse histórico em `revoked`. `revoked` é exclusivamente cancelamento explícito autorizado, com sua razão factual. O sistema valida token por hash, reexibe URL criptografada somente ao iniciador enquanto `pending`, envia e-mail e nunca registra URL, token/ciphertext em logs. No V1, convite para e-mail com membership ativo ou convite pendente/aceito DEVE ser bloqueado; expirado não bloqueia nova emissão autorizada. Reativação não cria convite: um admin autorizado do mesmo tenant ou da plataforma pode restaurar a membership revogada, preservando sua identidade e papel, somente se não existir membership ativa em outro tenant.
- **FR-005**: O sistema DEVE permitir zero ou uma conexão Microsoft por organização `customer`, não permitir conexão para o tenant `platform` e impedir que uma mesma organização Microsoft seja associada a mais de uma organização `customer`.
- **FR-006**: O sistema DEVE iniciar a autorização administrativa com `state` correlacionado, opaco, de uso único e expiração curta; dados de organização, permissões ou destinos arbitrários não podem compor o `state`. Antes do redirect, o admin pode manter a authority padrão `organizations` ou informar exclusivamente um Microsoft Entra Tenant ID GUID; quando informado, esse identificador é normalizado e persistido apenas na tentativa como `expected_microsoft_tenant_id` opcional.
- **FR-007**: O sistema DEVE validar o retorno da autorização, confirmar que o iniciador ainda é `admin` e confirmar a identidade da organização Microsoft antes de ativar a conexão. Quando a tentativa tiver `expected_microsoft_tenant_id`, o `tenant` devolvido pelo callback é somente candidato e DEVE corresponder a ele antes da verificação server-to-server pelo Graph; divergência, cancelamento ou erro falham a tentativa com razão sanitizada e nunca promovem outro tenant.
- **FR-008**: O sistema DEVE usar uma única identidade de integração compartilhada pela aplicação para as conexões autorizadas, sem guardar segredos de clientes ou tokens de acesso nos dados das organizações.
- **FR-009**: Cada operação da integração Microsoft DEVE ser realizada para a organização Microsoft registrada na conexão correspondente; não pode depender de uma organização padrão, sessão implícita ou configuração global de runtime.
- **FR-010**: O sistema DEVE expor estados de conexão `pending_consent`, `verifying`, `connected`, `consent_required`, `revoked`, `error` e `disconnected`, bem como última atualização e razão sanitizada. Somente admin ativo do customer pode desconectar; a operação audita, torna futuros syncs inelegíveis, revalida jobs despachados antes de escrita e preserva histórico/frescor.
- **FR-011**: O sistema DEVE preservar dados históricos de conexões com falha, revogadas ou desconectadas, identificando claramente a disponibilidade e o frescor dos dados, até uma futura exclusão administrativa explícita; o fluxo de exclusão não faz parte desta entrega.
- **FR-012**: O sistema DEVE isolar todos os dados organizacionais de Microsoft 365, Governance, documentos, histórico e auditoria; nenhuma leitura, escrita, relação, busca, cache, bloqueio ou chave de idempotência pode cruzar organizações.
- **FR-013**: O sistema DEVE manter um catálogo global padrão de temas e modelos de Governance e criar uma instância independente de cada tema para todo novo tenant `customer`.
- **FR-014**: O sistema DEVE registrar auditoria mínima de control plane para provisioning, convites, ativação e ações do tenant `platform`, e auditoria tenant-scoped para criação de organização, alteração de associações, conexão, desconexão e ações administrativas de customer, sem incluir segredos, tokens, intenção bruta de autorização ou dados Graph desnecessários.
- **FR-015**: O sistema DEVE executar sincronizações por par organização interna + conexão Microsoft, revalidar o vínculo e o estado antes da execução e manter falhas, limites e tentativas de uma organização isolados das demais.
- **FR-016**: O sistema DEVE classificar falhas de integração pelo estágio e pela evidência disponível, respeitar a orientação de nova tentativa quando informada e não deduzir o estado da conexão apenas de um código de acesso negado.
- **FR-017**: Nesta entrega, o front DEVE operar um tenant por vez e não oferece registro público, autoatendimento, seletor, troca de organização, rota ou subdomínio de organização. Essa limitação do V1 não cria impedimento estrutural para memberships futuras em múltiplos tenants.
- **FR-018**: A aplicação DEVE consumir a identidade compartilhada da integração exclusivamente por secret manager, sem persistir segredos no banco. Rotação e monitoramento de expiração NÃO fazem parte da aplicação: são responsabilidade operacional externa da infraestrutura, cuja evidência é pré-requisito de implantação desta entrega.
- **FR-019**: Toda sincronização Microsoft 365 DEVE nascer em uma solicitação de control plane com origem `platform` ou `routine`. Origem `platform` deriva `--force`; rotinas preservam apenas sua intenção agendada válida. O platform pode consultar no máximo cinco diagnósticos agregados/sanitizados, nunca dados operacionais do customer.
- **FR-020**: Convite cria credencial apenas para conta local nova. Para conta existente, o destinatário autentica-se pelo fluxo normal, incluindo recuperação de senha quando necessária, e o aceite confirma o e-mail autenticado sem redefinir a senha.
- **FR-021**: Uma request de sincronização possui claim exclusiva com token e lease renovável; somente seu proprietário pode vinculá-la a um ciclo ou registrar seu resultado terminal. Entrega duplicada não altera o resultado da execução proprietária.
- **FR-022**: Desconexão é recusada enquanto houver ciclo de sincronização em execução. A execução revalida a conexão antes de Graph e qualquer interrupção torna todos os registros transitórios terminalmente factuais.
- **FR-023**: A retenção agendada enumera customers no control plane e executa cada limpeza em contexto explícito, sem exigir conexão Microsoft ativa.

### Key Entities *(include if feature involves data)*

- **Organização interna**: Tenant interno do tipo `platform` ou `customer`, identificado internamente e separado da organização Microsoft.
- **Tenant interno da plataforma**: Único tenant `platform`, criado no bootstrap/seed, que concentra a capacidade de provisioning; seus administradores não obtêm acesso operacional aos dados dos tenants `customer` por esse papel.
- **Associação à organização**: Vínculo entre usuário e organização que determina a capacidade mínima `admin` ou `member`; é criado `active` somente no aceite do convite (ou no bootstrap da plataforma) e pode ser `revoked` por cancelamento explícito de acesso.
- **Convite de acesso**: Permissão temporária de 7 dias, individual e de uso único para criar/ativar o acesso no aceite, usada no provisioning inicial e na adição de usuários pelo `admin` do tenant; antes do aceite, não existe usuário nem membership do destinatário.
- **Conexão Microsoft**: Vínculo verificável, opcional e único entre um tenant `customer` e uma organização Microsoft, incluindo seu estado, prova e frescor.
- **Tentativa de conexão**: Intenção temporária, de uso único, que correlaciona o retorno da autorização administrativa ao administrador e à organização que a iniciou.
- **Definição de tema de Governance**: Tema ou modelo padrão global do produto, sem dados específicos de um cliente.
- **Tema de Governance da organização**: Instância isolada de uma definição global, incluindo responsável, estado, documentos, pontuação e histórico.
- **Evento de auditoria da organização**: Registro mínimo e sanitizado de uma ação relevante dentro de uma organização.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes com duas organizações de teste, 100% das tentativas de leitura, escrita, relação, cache, bloqueio e sincronização cruzada são recusadas ou permanecem limitadas à organização correta.
- **SC-002**: 100% dos provisionings autorizados criam de forma consistente um tenant `customer`, o convite para seu primeiro `admin` e uma instância de cada tema padrão de Governance; em 100% dos aceites válidos, o usuário e seu membership `admin` ativo são criados de forma atômica. 100% das tentativas de registro público, autoatendimento ou membership por domínio de e-mail são recusadas.
- **SC-007**: Em 100% das falhas simuladas de entrega de convite, a URL permanece disponível somente ao iniciador autorizado até o convite expirar, sem ser registrada em logs.
- **SC-003**: Em duas organizações de teste autorizadas, 100% das conexões ativas usam a organização Microsoft correspondente e nenhuma conexão é ativada sem confirmação independente da identidade da organização.
- **SC-004**: Em cenários de consentimento ausente, revogação, permissão insuficiente, limitação ou erro transitório, 100% dos resultados exibem estado e frescor factuais, sem substituir dados históricos por resultados vazios ou zero.
- **SC-005**: Em uma execução com duas sincronizações simultâneas, uma falha em uma organização não impede a conclusão elegível da outra, e 100% dos registros resultantes mantêm a organização e a conexão de origem corretas.
- **SC-006**: 100% das ações administrativas previstas deixam um evento de auditoria sanitizado e nenhuma evidência de teste contém segredo, token de acesso ou intenção bruta de autorização.

## Assumptions

- A aplicação é um produto fechado: o único tenant `platform`, iniciado por seed, realiza o provisioning; usuários do cliente não se registram livremente.
- A primeira entrega permite no máximo uma conexão Microsoft por tenant `customer`, nenhuma para `platform`, e não oferece várias conexões, credenciais de cliente ou múltiplas integrações por cliente.
- A integração permanece uma única identidade de serviço para múltiplas organizações, com autorizações administrativas concedidas por cada organização conectada.
- A aplicação consome essa identidade por secret manager; rotação e monitoramento de expiração são responsabilidade operacional externa da infraestrutura, que fornece o responsável e a evidência verificável de conformidade.
- As superfícies de onboarding, control plane, conexão/desconexão e memberships seguem a [representação estrutural aprovada](../../discovery/multi-tenant/representacao-estrutural-telas.md). O onboarding começa depois do provisioning e não exige, nesta entrega, seletor ou troca de organização.
- O catálogo global de temas de Governance já terá definições padrão disponíveis; cadastro e governança desse catálogo estão fora do escopo.
- Esta entrega parte de ambientes descartáveis, sem banco, customer, usuário, conexão Microsoft, estado de Governance ou histórico que precisem ser preservados. `migrate:fresh` deve iniciar diretamente o modelo multi-tenant final.

## Out of Scope

- Identidades de integração separadas por organização ou armazenamento de credenciais de cliente nos dados da aplicação.
- Permissões delegadas baseadas em sessão de usuário para sincronização.
- Hierarquias amplas de perfis, modelos genéricos de permissões ou fluxos de aprovação de acesso.
- Seletor, troca de organização, rotas ou subdomínios específicos por organização no front do V1.
- Registro público, criação self-service de tenant e concessão ou descoberta de acesso por domínio de e-mail.
- Fluxo de exclusão de dados e logs históricos após desconexão ou revogação.
- Exclusão automática de dados históricos ao desconectar uma organização.
- Gestão de cadastro ou aprovação do catálogo global de temas de Governance.
- Upgrade in-place, migração, importação, backfill ou preservação de dados da instalação single-tenant anterior, inclusive customers, usuários e conexões Microsoft derivados automaticamente da configuração atual.
