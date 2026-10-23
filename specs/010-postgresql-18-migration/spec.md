# Feature Specification: Migração PostgreSQL 18

**Feature Branch**: `feat/010-postgresql-18-migration`

**Created**: 2026-08-17

**Status**: Draft

**Input**: User description: "Criar a especificação a partir de `docs/POSTGRESQL-18-MIGRATION-PLAN.md`."

## Clarifications

### Session 2026-08-17

- Q: Como devem ser preservados instantes técnicos e externos recebidos com `Z` ou offset? → A: Preservar o mesmo instante, normalizá-lo e operá-lo em UTC; validar entradas `Z` e offsets nas bordas de dia. Datas civis permanecem no dia informado.
- Q: Quais filhos de um ciclo usam a relação composta por tenant e ciclo, e qual é a exceção? → A: Dados de domínio coordenados pelo ciclo lógico usam `(tenant_id, sync_cycle_id)` com `RESTRICT`; `microsoft365_sync_stages` mantém a relação direta ao identificador técnico do ciclo. Histórico e publicações nunca são removidos em cascata nem desassociados por exclusão do ciclo.
- Q: Como deve ser comprovada a exclusividade da sincronização? → A: Por cenário de integração na base de testes PostgreSQL, usando `CACHE_STORE=database` para aquisição concorrente, renovação, perda e liberação do lock; doubles só podem ser usados fora desse cenário.
- Q: O que ocorre quando a exclusividade é perdida depois de iniciar uma sincronização? → A: Finalizar como falhos todos os ciclos, estágios, batches ou gerações ativos afetados, com motivo sanitizado e horário final; preservar publicação anterior, liberar o lock e não continuar coleta ou promoção.
### Session 2026-08-17

- Q: De onde vem o checksum de uma fotografia Secure Score persistida como JSONB? → A: Do payload canônico antes da persistência; JSONB não é representação textual estável para calcular ou recomputar checksum.
- Q: O bootstrap do schema oficial deve incluir factories e seeders? → A: Sim. Em PostgreSQL vazio, migrations, factories aplicáveis e seeders devem executar sem SQLite; seeders idempotentes mantêm o resultado em rerun.
- Q: Como reruns, colisões e retries devem registrar telemetria? → A: Com contagens factuais e distintas de leitura, processamento, criação, atualização, persistência, deduplicação, exclusão, tentativas e retries, derivadas do resultado real da persistência.

## User Scenarios & Testing *(mandatory)*

Esta é uma entrega estrutural, sem nova tela, aba ou subpágina; portanto, não há representação estrutural de telas aplicável. Toda a audiência autenticada continua vendo as mesmas capacidades após a migração.

### User Story 1 - Operar com dados confiáveis (Priority: P1)

Como gestor ou administrador, quero que as informações já publicadas do produto continuem disponíveis e consistentes após a mudança da base operacional, para tomar decisões sem perda de confiança nos dados.

**Why this priority**: A confiabilidade das informações governadas sustenta todos os módulos e fluxos existentes.

**Independent Test**: Em um ambiente novo, publicar e consultar dados representativos dos módulos existentes e confirmar que relações, valores válidos e dados previamente publicados se mantêm íntegros.

**Acceptance Scenarios**:

1. **Given** um ambiente operacional novo, **When** sua estrutura é preparada, **Then** todos os domínios atuais ficam disponíveis sem depender de uma base legada.
2. **Given** uma tentativa de gravar uma relação inválida, valor fora do limite ou duplicação de uma identidade de negócio, **When** a gravação é solicitada, **Then** ela é rejeitada e nenhum dado inconsistente é publicado.
3. **Given** dados válidos dos módulos existentes, **When** são consultados após a preparação do ambiente, **Then** mantêm sua semântica de datas, valores booleanos, documentos estruturados e informações protegidas.
4. **Given** um ciclo inexistente, um ciclo de outro tenant ou um ciclo com publicação histórica, **When** um dado coordenado é associado ou a remoção é solicitada, **Then** a associação inválida ou remoção é rejeitada.
5. **Given** um documento estruturado consultável, conteúdo criptografado, uma meta sem valor, um instante Graph com offset e uma data civil, **When** são persistidos e lidos, **Then** cada um preserva a regra de formato, nulidade, precisão e tempo definida para seu domínio.
6. **Given** uma fotografia Secure Score com payload estruturado, **When** seu checksum é usado para persistência ou idempotência, **Then** ele é calculado sobre o payload canônico antes da persistência e não é recomputado a partir do documento normalizado.

---

### User Story 2 - Executar sincronização Microsoft 365 com segurança (Priority: P1)

Como administrador, quero que uma sincronização completa do Microsoft 365 possa ser repetida com segurança, para manter as projeções internas atualizadas sem duplicidade ou mistura entre tenants.

**Why this priority**: A sincronização é a origem das projeções que sustentam as decisões do produto e não pode perder sua idempotência na mudança estrutural.

**Independent Test**: Executar uma coleta local completa com fontes simuladas, repeti-la e provocar disputa controlada entre execuções, verificando publicações, isolamento por tenant e preservação da última publicação válida.

**Acceptance Scenarios**:

1. **Given** fontes Microsoft 365 simuladas válidas, **When** uma sincronização completa é executada, **Then** os dados são coletados, registrados, publicados e lidos pelas projeções sem chamada externa durante a consulta.
2. **Given** a mesma coleta é repetida para o mesmo tenant e ciclo, **When** a publicação é concluída, **Then** não são criados registros ou revisões duplicados.
3. **Given** duas execuções concorrentes para o mesmo tenant, **When** disputam a mesma operação, **Then** somente uma mantém a gravação válida e a outra é tratada sem corromper ou misturar os dados.
4. **Given** uma falha ocorre após uma publicação válida, **When** a sincronização termina, **Then** a última publicação íntegra permanece consultável com seu estado de frescor apropriado.
5. **Given** o bloqueio coordenado é renovado, perdido ou uma unicidade concorrente é violada, **When** a coleta é reexecutada, **Then** o resultado é tratado de forma explícita, repetível e sem chamada externa dentro da transação de dados.
6. **Given** a sincronização de Licenciamento é validada localmente, **When** a fonte detalhada não está disponível, **Then** é aplicado o fallback publicado, dados comerciais continuam indisponíveis até Assessment/CSV e nenhuma escrita é enviada ao tenant.
7. **Given** um processo perde o lock após criar ciclo, estágio, batch ou geração, **When** a perda é detectada, **Then** todos os registros ativos afetados são finalizados como falhos com motivo sanitizado e horário final, a publicação anterior é preservada e nenhuma coleta ou promoção adicional ocorre.
8. **Given** duas execuções disputam o mesmo tenant na base de testes, **When** o lock é adquirido, renovado, perdido e liberado, **Then** a exclusividade é comprovada pelo store operacional de banco, sem depender de mock ou store em memória.
9. **Given** uma coleta é repetida, sofre colisão de unicidade ou retry, **When** sua telemetria é publicada, **Then** as contagens de leitura, processamento, criação, atualização, persistência, deduplicação, exclusão, tentativas e retries refletem as ações reais, sem inflar persistência pelo tamanho do payload.
10. **Given** não existe publicação anterior e uma fonte simulada falha, **When** a sincronização é encerrada, **Then** nenhuma publicação, dado comercial vazio ou valor zero é fabricado, o source state local registra indisponibilidade com frescor e razão factual, e a leitura continua sem HTTP externo.

---

### User Story 3 - Preparar ambientes reproduzíveis (Priority: P2)

Como membro da equipe, quero iniciar desenvolvimento, testes e validação contínua em ambientes equivalentes e isolados, para detectar incompatibilidades antes de elas afetarem o produto.

**Why this priority**: Ambientes reproduzíveis tornam a mudança verificável e impedem que uma configuração local esconda defeitos.

**Independent Test**: Em uma cópia nova do projeto, preparar os ambientes de aplicação e testes, executar a validação completa e confirmar que os testes nunca acessam os dados locais de desenvolvimento.

**Acceptance Scenarios**:

1. **Given** uma cópia nova do projeto, **When** a equipe segue as instruções de preparação, **Then** o ambiente fica saudável e pronto para criar toda a estrutura de dados sem arquivo de banco local.
2. **Given** a suíte automatizada é iniciada, **When** ela prepara seus dados, **Then** usa uma base dedicada e não altera os dados do ambiente de desenvolvimento.
3. **Given** a validação contínua é executada, **When** inicia os testes, **Then** aguarda um serviço de dados saudável, prepara a estrutura antes da suíte e conclui todos os gates sem depender de SQLite.
4. **Given** o ambiente local é redefinido, **When** o volume é recriado, **Then** as bases de aplicação e testes são provisionadas pelo mesmo mecanismo versionado e não reutilizam uma estrutura anterior incompatível.
5. **Given** a base de testes está ausente, aponta para a base de desenvolvimento ou o driver PostgreSQL não está disponível, **When** a suíte é iniciada, **Then** ela falha antes de executar testes ou alterar dados.
6. **Given** uma base PostgreSQL vazia, **When** migrations, factories aplicáveis e seeders são executados, **Then** todos concluem sem SQLite e um rerun dos seeders idempotentes preserva o resultado esperado.

### Edge Cases

- Se existir dado fora do escopo descartável em uma instalação anterior, a execução é interrompida para um plano separado de exportação e importação; a entrega não tenta convertê-lo automaticamente.
- Se uma relação de ciclo referenciar tenant diferente, ciclo inexistente ou histórico que não pode ser removido, a operação é rejeitada sem alterar os registros válidos.
- Se valores de data incluírem offsets em torno da mudança de dia, o instante é preservado de forma inequívoca; datas civis permanecem no dia informado.
- Se uma consulta de busca receber caracteres de caixa mista, valores nulos ou datas repetidas, o resultado mantém a regra de busca e uma ordem estável.
- Se a infraestrutura de teste não estiver disponível ou apontar para a base errada, a execução falha antes de alterar ou validar dados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O produto DEVE adotar PostgreSQL 18 como única base relacional operacional para desenvolvimento local, testes automatizados e validação contínua.
- **FR-002**: O produto DEVE criar uma estrutura de dados final consolidada em ambiente novo; não DEVE oferecer atualização incremental nem preservação automática de instalações baseadas no histórico anterior.
- **FR-003**: A estrutura consolidada DEVE substituir integralmente as 71 migrations atuais pela cadeia baseline definida no Mapa obrigatório de substituição (referência histórica não disponível neste escopo), preservando o estado final de cada linha mapeada e mantendo somente migrations posteriores ao baseline, sem branches por engine, rebuilds, backfills, operações de transição ou alterações temporárias de índices e uniques.
- **FR-004**: A estrutura consolidada DEVE preservar todos os relacionamentos, identidades de negócio, unicidades, limites de valor, índices, valores padrão e demais invariantes finais dos domínios existentes; nomes SQL definidos manualmente DEVEM ter no máximo 63 caracteres e índices compostos DEVEM ser validados com seus maiores valores UTF-8. A cadeia baseline é criação incompatível e não promete rollback; migration posterior somente PODE expor reversão quando ela for segura e a condição estiver documentada na própria migration.
- **FR-005**: O produto DEVE rejeitar diretamente tentativas de persistir relações inexistentes ou entre tenants distintos, duplicidades de negócio, metas fora de 0 a 100, fontes de meta diferentes de `product_default` ou `configured`, valores obrigatórios nulos e contadores negativos quando essas regras forem aplicáveis ao domínio; scores e metas DEVEM preservar as precisões numéricas finais definidas no mapa obrigatório.
- **FR-006**: O produto DEVE identificar o ciclo coordenado por UUID e garantir a unique do pai `(tenant_id, cycle_id)`; dados de domínio coordenados pelo ciclo lógico DEVEM usar a FK composta `(tenant_id, sync_cycle_id)`, com `RESTRICT` quando houver histórico ou publicação, e as intermediárias Secure Score DEVEM registrar `tenant_id`. `microsoft365_sync_stages` mantém a relação direta ao identificador técnico do ciclo; registros históricos ou publicados não PODEM ser removidos em cascata nem desassociados pela exclusão do ciclo.
- **FR-007**: O produto DEVE preservar o mesmo instante técnico ou externo em `timestamptz`, normalizá-lo e operá-lo em UTC; entradas Graph com `Z` e offsets DEVEM ser validadas nas bordas de dia. Datas civis DEVEM permanecer no dia informado em `date`, sem conversão.
- **FR-008**: O produto DEVE armazenar documentos estruturados não criptografados e consultáveis em `jsonb`, e informações criptografadas em `text`; conteúdo protegido não PODE ser tratado como documento estruturado.
- **FR-009**: O produto DEVE manter os resultados existentes de busca de grupos sem distinção de caixa e paginação determinística, incluindo registros sem data e registros com a mesma data.
- **FR-010**: O produto DEVE tratar estados habilitado, desabilitado e ausente como valores booleanos, sem comparações numéricas inválidas.
- **FR-011**: O produto DEVE manter sincronizações repetíveis: uma reexecução da mesma coleta não pode criar publicações, posições, batches, revisões ou fotografias duplicadas.
- **FR-012**: O produto DEVE coordenar operações concorrentes do mesmo tenant por lock compartilhado no store operacional de banco, cobrindo renovação, perda e liberação; a semântica do lock DEVE ser comprovada em cenário de integração contra PostgreSQL com `CACHE_STORE=database`, sem mock ou store em memória. Todos os caminhos coordenados de criação ou atualização DEVEM tratar explicitamente colisões de unicidade, sem manter chamada HTTP externa dentro de transação de dados.
- **FR-013**: O ambiente local DEVE usar a única imagem oficial PostgreSQL 18 fixada no `docker-compose.yml` como referência imutável `postgres:18.<menor>@sha256:<digest>`, resolvida do repositório oficial antes da implementação; DEVE usar volume nomeado em `/var/lib/postgresql` e healthcheck para provisionar exclusivamente a base operacional `orkestria360`. Após confirmar a inexistência, o desenvolvedor cria manualmente a base isolada `orkestria360_test`; Compose e aplicação não podem criá-la. A redefinição do volume recria somente `orkestria360`, e o provisionamento de produção é responsabilidade de desenvolvimento/DevOps.
- **FR-014**: `.env.testing` NÃO DEVE ser versionado nem exigido. Localmente, o executor DEVE fornecer explicitamente no ambiente do processo `APP_ENV=testing`, `APP_KEY`, `DB_CONNECTION=pgsql`, os `DB_*` de `orkestria360_test`, `DB_URL=''` e `CACHE_STORE=database`. No CI, o job fornece `APP_ENV`, os `DB_*`/`DB_URL` e `CACHE_STORE=database`; a chave é gerada no `.env` efêmero do workspace. `phpunit.xml` NÃO DEVE declarar `DB_CONNECTION`, `DB_DATABASE`, `DB_URL` nem `CACHE_STORE`. O bootstrap local DEVE executar `php artisan config:clear` e confirmar que `bootstrap/cache/config.php` está ausente antes de migrations ou casts criptografados. Antes de cada `php artisan migrate:fresh --env=testing --force` local, o executor DEVE cumprir o roteiro de segurança do quickstart e interromper a execução se a configuração efetiva `testing`, a conexão ou o banco não corresponderem ao roteiro; `RefreshDatabase` permanece como isolamento base e uma guarda de infraestrutura DEVE confirmar `pgsql` e `orkestria360_test` antes da suíte tocar dados. Os testes nunca DEVEM usar a base local da aplicação.
- **FR-015**: A validação contínua DEVE iniciar um serviço PostgreSQL 18 saudável, fixado por tag menor e digest, com credenciais exclusivamente de teste. O `env:` do job DEVE declarar `APP_ENV=testing`, os `DB_*` de `orkestria360_test`, `DB_URL=''` e `CACHE_STORE=database`; o job DEVE habilitar `pdo_pgsql`, gerar a chave no workspace efêmero, executar `php artisan migrate --env=testing --force` e preservar a composição atual de build, análise estática e `php artisan test`. As actions DEVEM permanecer pinadas por SHA e o workflow de lint DEVE usar no máximo `contents: read`.
- **FR-016**: Nenhuma configuração, script, fluxo de preparação ou validação contínua DEVE criar, selecionar por ausência de configuração ou exigir `database/database.sqlite`.
- **FR-017**: A consulta de contenção JSONB `@>` em `directory_groups.group_types` DEVE ser validada com `EXPLAIN (ANALYZE, BUFFERS)` em carga representativa; índice GIN ou de expressão somente PODE ser criado quando essa evidência demonstrar necessidade. Nenhuma outra consulta JSONB entra neste critério nesta entrega sem decisão explícita registrada.
- **FR-018**: A migração NÃO DEVE inferir ordenação, identidade de negócio ou ausência de lacunas em sequences/identities.
- **FR-019**: A migração NÃO DEVE alterar contratos, permissões, URLs, cadência, clientes nem formatos de publicação dos módulos Microsoft 365 e Licenciamento V2; deve preservar Graph observável, o fallback `licenseDetails → /users` quando aplicável, dados comerciais vazios até Assessment/CSV e nenhuma escrita no tenant.
- **FR-020**: Se o lock coordenado for perdido após criar um ciclo, estágio, batch ou geração, o produto DEVE finalizar todos os registros ativos afetados como falhos, com motivo sanitizado e horário final, preservar a última publicação válida, liberar o lock e interromper novas coletas ou promoções.
- **FR-021**: Checksum de fotografia Secure Score DEVE ser calculado sobre o payload canônico antes da persistência; documentos JSONB não PODEM ser usados como representação textual para calcular ou recomputar checksum.
- **FR-022**: Em PostgreSQL vazio, migrations, factories aplicáveis e seeders DEVEM executar sem SQLite; seeders com comportamento idempotente DEVEM preservar o resultado em reruns.
- **FR-023**: Sincronizações DEVEM registrar contagens factuais e distintas de leitura, processamento, criação, atualização, persistência, deduplicação, exclusão, tentativas e retries, derivadas do resultado real da persistência; tamanho de payload não PODE substituir itens efetivamente persistidos.

### Key Entities *(include if feature involves data)*

- **Baseline de estrutura**: definição consolidada e inicial dos domínios do produto, capaz de preparar uma instalação nova com as regras finais de integridade.
- **Ciclo de sincronização**: execução identificada por tenant e ciclo, que coordena coleta, persistência, publicação e estados de fontes.
- **Publicação**: conjunto íntegro de dados de uma fonte, disponível para leitura pelas projeções e preservado quando uma tentativa posterior falha.
- **Ambiente de aplicação**: base destinada ao uso local da aplicação.
- **Ambiente de testes**: base dedicada e isolada para execução automatizada, sem acesso aos dados do ambiente de aplicação.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das preparações de uma base PostgreSQL 18 vazia, a estrutura completa é criada sem caminho alternativo por mecanismo de banco ou arquivo local.
- **SC-002**: Em testes de integridade representativos, 100% das tentativas de violar relação entre tenants, unicidade, limite de meta ou contador não negativo são rejeitadas.
- **SC-003**: Em uma sincronização local completa com fontes simuladas, 100% das etapas de coleta, persistência, idempotência, publicação e leitura pelas projeções são concluídas sem HTTP externo durante a consulta.
- **SC-004**: Em reexecução e disputa concorrente da mesma sincronização, 0 registros duplicados ou associações entre tenants são produzidos.
- **SC-005**: Em uma cópia nova do projeto, a equipe prepara os ambientes de aplicação e teste e executa os gates completos sem criar ou consultar `database/database.sqlite`.
- **SC-006**: A validação contínua conclui build, análise estática e `php artisan test`, com 100% da suíte contra uma base de testes PostgreSQL 18 saudável e isolada.
- **SC-007**: Antes de encerrar a entrega, 100% das linhas do Mapa obrigatório de substituição possuem evidência de `migrate:fresh` e, conforme aplicável, teste da constraint, índice ou query correspondente.
- **SC-008**: Localmente, `composer ci:check` conclui com sucesso contra PostgreSQL 18, incluindo a suíte PHP; remotamente, a composição atual de build, análise estática e `php artisan test` é executada sem SQLite, e a guarda de infraestrutura comprova o driver `pgsql`.
- **SC-009**: Existe evidência de `EXPLAIN (ANALYZE, BUFFERS)` para a contenção JSONB `@>` em `directory_groups.group_types`; nenhum índice GIN ou de expressão é incluído sem essa evidência.
- **SC-010**: Em cenário de integração com PostgreSQL e `CACHE_STORE=database`, 100% dos casos de aquisição concorrente, renovação, perda e liberação do lock apresentam estado terminal consistente, sem registros ativos abandonados.
- **SC-011**: Em PostgreSQL 18 vazio, migrations, factories aplicáveis e seeders concluem sem SQLite; um rerun de cada seeder idempotente não altera o conjunto de dados esperado.
- **SC-012**: Em testes de rerun, colisão e retry, 100% das contagens publicadas de leitura, processamento, persistência, deduplicação, exclusão, tentativas e retries correspondem às ações reais verificadas na persistência.

## Assumptions

- Não há requisito de preservar, importar ou converter dados de instalações baseadas no histórico anterior; dados fora do escopo descartável exigem iniciativa própria.
- Todos os usuários autenticados continuam pertencendo à audiência única confiável, sem diferenciação de acesso.
- O ciclo ponta a ponta de Microsoft 365 é validado localmente com fakes ou mocks; a entrega não autoriza tráfego HTTP contra tenant durante essa validação.
- A referência imutável da imagem será resolvida do repositório oficial e registrada no Compose versionado antes da implementação; credenciais locais permanecem fora de versionamento e a validação contínua usa somente credenciais de teste.
- A execução inicial não habilita testes paralelos; essa evolução depende de validação posterior do isolamento de bases.

## Out of Scope

- Migração incremental, backfill ou conversão automática de dados de SQLite, MySQL ou MariaDB.
- Alterações de escopo funcional, navegação, permissões, contratos externos ou formatos de publicação de Microsoft 365 e Licenciamento V2.
- Criação de tela de administração do banco, novo modelo de autorização ou coleta HTTP contra tenant real para validar a migração.
