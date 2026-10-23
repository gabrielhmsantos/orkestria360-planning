# Impacto concreto no repositório

## Dependências single-tenant encontradas

| Local | Evidência | Impacto |
| --- | --- | --- |
| `config/services.php` | `MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET` | Remover tenant global de runtime; manter client/credential globais por infraestrutura. |
| `app/Support/Microsoft365/GraphClientFactory.php` | `make()` lê os três configs e constrói `ClientCredentialContext` | Evoluir para receber somente `MicrosoftConnection` `connected`; manter o SDK/Kiota e `client_credentials`, criando `MicrosoftConnectionVerifier` separado para onboarding `pending`/`verifying`. |
| `app/Services/Microsoft365/Licensing/TenantContext.php` | retorna config ou fallback `contoso` | Substituir por contexto real; o fallback é risco de vazamento. |
| `app/Support/Microsoft365/Microsoft365OverviewPageData.php` | lê config diretamente | Receber tenant/contexto; eliminar fallback. |
| `app/Console/Commands/SyncMicrosoft365.php` | resolve `TenantContext` implicitamente | Adicionar identificadores obrigatórios e validar connection. |
| `routes/console.php` | resolve um tenant na carga, agenda um único sync/prune | Enumerar conexões no runtime e gerar unidades isoladas; locks sobre tenant+connection. |
| `CoordinatedSyncCoordinator` | lock já usa tenant, mas factory é global | Passar connection por toda a cadeia e registrar conexão no ciclo. |
| testes Secure Score/Licensing | alteram `services.microsoft_graph.tenant_id` | Trocar por factories de tenant/conexão e casos simultâneos. |

### Inventário completo dos usos de contexto legado em produção

`TenantContext` é consumido por `PruneMicrosoft365Events`, `PruneMicrosoft365UsersAccounts`, `SyncMicrosoft365`, `DirectoryGroupsQuery`, `GroupActivityProjection`, `GroupsPageData`, `GroupsSynchronizer`, `LicensingPageData`, `MfaPageData`, `SecureScoreActionsProjection`, `SecureScoreCategoryProjection`, `SecureScoreComparativesProjection`, `SecureScoreHistoryProjection`, `SecureScoreObservedHistoryProjection`, `SecureScorePageData`, `SecureScoreTargetProjection`, `CoordinatedSyncCoordinator`, `IdentityAccessAuditRecorder`, `IdentityCsvExport`, `UsersAccountsPageData`, `UsersAccountsSynchronizer` e `routes/console.php`, além da própria classe. Cada um deve receber o novo contexto/repository explicitamente ou ser invocado dentro de uma unidade de execução já delimitada.

Os únicos usos de configuração tenant global em código de produção são `TenantContext`, `GraphClientFactory`, `Microsoft365OverviewPageData` e a definição em `config/services.php`. Os usos adicionais estão em `.env`, `.env.example`, `.env.testing` e nos testes de Licensing, sync coordenado e páginas Secure Score; todos precisam migrar para fixtures/factories de conexão.

## Cobertura de `tenant_id` e lacunas

Os domínios Licensing, Identity, Groups, MFA, Microsoft 365 sync e Secure Score já carregam `tenant_id` em suas tabelas de negócio, com diversas uniques e índices compostos. Também há FKs compostas para ciclos Microsoft 365 e Secure Score. Locks já são tenant-aware em sync coordenado, licensing, users/accounts e groups.

Lacunas concretas para multi-organização: não existe tabela `tenants`, `tenant_memberships`, `tenant_access_invitations`, `microsoft_connections` ou tentativas de consentimento; `users` é global e `email` é unique global. `tenants`, memberships, convites de acesso e tentativas formam o control plane, sem RLS por tenant, para resolver entrada, autorização e callback; `microsoft_connections` e os módulos de domínio formam o tenant data plane, sob RLS. Governance deve substituir a mistura atual por `governance_topic_definitions` como catálogo global padrão e `tenant_governance_topics` tenant-scoped, criado para cada definição na criação de um tenant `customer`; documentos e score histories passam a pertencer à instância do tenant. `microsoft365_sync_stages`, `microsoft365_event_ingestion_batch_events`, `secure_score_controls` e `secure_score_publication_controls` são filhas de entidades tenant-scoped e devem ganhar FK composta/prova relacional suficiente para impedir parent cross-tenant. Tabelas Laravel core (sessions, jobs, batches, cache e locks) não devem ganhar `tenant_id`, mas os payloads/keys de domínio devem carregá-lo. `generation_id` único global em Identity/Groups é seguro contra colisão, porém a proveniência tenant deve continuar validada nas FKs/queries.

## Transição para ambiente descartável

1. Em PostgreSQL 18 vazio, criar a foundation de tenancy/connections após Laravel core e antes dos baselines de domínio; auditar e editar diretamente os baselines de Governance, Licensing, Identity, Groups, Microsoft 365 sync, MFA e Secure Score para o schema final. “Menor evolução” não autoriza criar `tenant_id` string para convertê-lo em seguida, nem adicionar FKs/índices/connections por migration corretiva sobre tabelas recém-criadas.
2. No bootstrap/seed, criar exclusivamente o tenant `platform`, `admin@example.com` e sua membership `admin active`; nenhum seeder cria/cita `test@example.com`, customer ou `microsoft_connection`.
3. Introduzir APIs explícitas de contexto/factory/verifier e adaptar sync, comandos, scheduler e queries; middleware só instala contexto após membership/capacidade, e scheduler enumera control plane sem `BYPASSRLS` antes de entrar em cada tenant.
4. Bloquear por testes arquiteturais novos usos de tenant global de runtime, `TenantContext`, fallback `contoso` e autorização por e-mail. Customers surgem somente por provisioning e connections somente por onboarding.
5. Habilitar onboarding após validar isolamento, consentimento e revogação em pelo menos duas organizações de teste.
