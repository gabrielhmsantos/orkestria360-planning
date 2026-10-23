# Avaliação de stack — multi-organização

## Parecer consolidado

| Responsabilidade | Veredito | Decisão para V1 |
| --- | --- | --- |
| Multi-tenancy / `CurrentTenant` | **Não adotar Spatie no V1** | Contrato próprio `CurrentTenant`, com binding `scoped`, parâmetros explícitos e porta de substituição futura. |
| Roles/permissões por tenant | **Não adotar Spatie no V1** | Membership com capacidade mínima `admin`/`member`; sem RBAC amplo. |
| Microsoft Graph | **Aprovar com ajuste** | Manter Kiota/HTTP atuais e tornar a factory `forConnection()`. |
| DI / contexto | **Aprovar com ajuste** | Laravel Service Container com `CurrentTenant` scoped; resolvers sem estado; Graph client transitório. |
| Autorização | **Aprovar com ajuste** | Policies/Gates avaliam membership e capacidade mínima `admin`/`member`. |
| Contexto / logs / jobs | **Aprovar com ajuste** | Laravel Context somente para correlação/telemetria. |
| Isolamento adicional | **Obrigatório no V1 multi-tenant** | PostgreSQL RLS para o tenant data plane, além de control plane, constraints, FKs compostas e wrapper transacional. |

## Justificativa técnica

### `spatie/laravel-multitenancy` 4.x

O pacote oferece finder, tasks e jobs tenant-aware, mas é mais valioso quando há troca de banco, filesystem ou configuração por tenant. O alvo do Orkestria é banco único com dados tenant-scoped, credencial Graph global e conexão Graph por organização. Ele não substitui constraints/FKs compostas, validação de `(tenant_id, microsoft_connection_id)`, escopo explícito de escrita, membership, revalidação de worker ou chaves de lock.

O risco é transformar `CurrentTenant` em estado global implícito, enquanto sincronização e Graph exigem sempre tenant **e** conexão explícitos. O contrato próprio já proposto preserva essa prova e reduz dependência: `CurrentTenant` scoped, repositories/services recebendo tenant validado, e `GraphClientFactory::forConnection()`.

### `spatie/laravel-permission` 8.x

O V1 adota uma distinção mínima de segurança dentro da membership: `admin` administra conexão Microsoft, configuração e memberships; `member` acessa as capacidades operacionais. Isto não justifica um modelo geral de roles/permissões. O modo Teams do pacote exige definir `team_id` global e invalidar relações de roles/permissões ao mudar de equipe, reintroduzindo contexto implícito e complexidade sem benefício aprovado.

`tenant_memberships` contém `(tenant_id, user_id, role)` com unique composta. O provisioning de tenant `customer` cria somente o convite para seu primeiro `admin`; o usuário e membership `admin` `active` surgem no aceite atômico, antes do onboarding Microsoft. Qualquer alteração administrativa é autorizada por Policy/Gate e pelo tipo de tenant, não por estado global. Um RBAC futuro continua exigindo decisão explícita, migração e testes de troca de contexto.

### Laravel nativo

O container do Laravel 13 descarta bindings `scoped` ao final de cada ciclo de request ou job; é apropriado para `CurrentTenant`. Jobs e comandos ainda devem serializar `tenant_id` e `microsoft_connection_id`, recarregar as entidades e validar a conexão antes de criar o cliente. `Context` propaga dados a jobs, mas é somente observabilidade: pode conter IDs/correlation ID, nunca token, secret, `state` OAuth bruto ou substituir autorização/persistência.

Policies/Gates autorizam seleção e operações pela capacidade da membership: `admin` para consentimento, desconexão, configuração e memberships; operações de leitura/uso seguem a capacidade operacional de `member` e `admin`. Não devem evoluir isso para hierarquia genérica de perfis no V1.

### RLS PostgreSQL

RLS é requisito estrutural do tenant data plane, não substituto de control plane, constraints e testes. `tenants`, memberships, convites de acesso e tentativas de conexão resolvem entrada/autorização antes de contexto RLS; connections, Governance tenant-scoped e módulos Microsoft 365 ficam sob RLS. A primeira entrega multi-tenant requer role runtime separada, sem owner/superuser/`BYPASSRLS`, policy deny-by-default e `set_config(..., true)` no início de cada transação curta de HTTP, queue e console. `SET LOCAL` expira no fim da transação; nunca envolver a chamada HTTP ao Graph numa transação apenas para manter RLS.

## Evidências consultadas

- [Laravel 13 — container scoped bindings](https://laravel.com/docs/13.x/container#binding-scoped-singletons) e [Context](https://laravel.com/docs/13.x/context): lifecycle request/job e propagação de telemetria para filas.
- [Laravel 13 — authorization](https://laravel.com/docs/13.x/authorization): Policies e Gates como mecanismos complementares.
- [Spatie Multitenancy — tenant-aware queues](https://spatie.be/docs/laravel-multitenancy/v4/basic-usage/making-queues-tenant-aware): o package marca/aplica tenant em jobs, mas não substitui invariantes do domínio.
- [Spatie Permission — teams](https://spatie.be/docs/laravel-permission/v8/basic-usage/teams-permissions): exige `team_id` ativo e limpeza de relações após a troca.

## Riscos a levar ao especialista

1. A capacidade mínima `admin`/`member` não deve crescer silenciosamente para RBAC; capacidades novas exigem decisão explícita.
2. Existe autorização legada baseada em e-mail fixo para administração/governança; ela deve migrar para associação explícita no tenant interno da plataforma ou no tenant do cliente, avaliada por Policy/Gate, sem instalar package de roles. E-mail ou domínio não pode conceder acesso.
3. RLS parcial ou sem controle transacional mascara vazamentos; a implementação deve cobrir todo tenant data plane, HTTP, workers e console desde o início, sem impedir o control plane de provar acesso.
4. A factory Graph atual ainda resolve tenant global; mantê-la assim anularia o isolamento definido.
