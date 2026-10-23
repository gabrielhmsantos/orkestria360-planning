# Fontes e rastreabilidade

## Fontes utilizadas

| Fonte | Estado | Evidência usada |
| --- | --- | --- |
| Solicitação do usuário (arquivo de objetivo) | lida | Escopo, fluxo app-only, requisitos de discovery e ausência de implementação. |
| Repositório `orkestria360/` | lido | Configuração atual, factory Kiota, contexto, scheduler, sync, schema e testes. |
| [Daemon apps — configuração](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-daemon-app-configuration) | lida | Authority explícita por tenant; `client_credentials`; secret, certificado ou workload identity federation; não usar `common`/`organizations` para daemon token. |
| [Admin consent](https://learn.microsoft.com/en-us/entra/identity-platform/v2-admin-consent) | lida | Endpoint v2, `redirect_uri`, `state`, parâmetros de retorno e a advertência de não autorizar pelo `tenant` de callback. |
| [Application objects e service principals](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals) | lida | Um application object no tenant de origem e service principals por tenant consumidor. |
| [Converter aplicação para multitenant](https://learn.microsoft.com/en-us/entra/identity-platform/howto-convert-app-to-be-multi-tenant) | lida | Conversão da audiência e comportamento de consentimento. |
| [Throttling do Microsoft Graph](https://learn.microsoft.com/en-us/graph/throttling-limits) | lida | Limites globais, por tenant e por app/tenant; limites variam por serviço. |
| Análise técnica anexada (`pasted-text.txt`) | lida | Ajustes propostos para admin consent, token opaco, classificação de falhas, conexão Microsoft, Governance, scheduler, RLS e credenciais. |
| Decisões explícitas do usuário nesta conversa | lida | Membership `admin`/`member`; RLS obrigatório; exatamente um `platform` criado por seed com `admin@example.com`, distinto dos `customer`; admin platform provisiona atomicamente customer inativo + convite `admin/customer_bootstrap` + temas Governance, enquanto User/membership `active` surgem no aceite e preenchem `activated_at`; convites separam `role` de `purpose`, expiram em 7 dias por scheduler idempotente que apaga ciphertext e fornecem e-mail/URL recuperável ao iniciador; admins/members adicionais usam `purpose=access`; convite é `pending`/`accepted`/`expired`/`revoked`, e membership só `active`/`revoked`; V1 bloqueia convite para e-mail com membership ativo ou convite pendente/aceito, mas convite expirado não bloqueia e o schema preserva multi-membership futuro; não há registro público, criação self-service ou seleção por domínio; catálogo Governance global e provisionamento na criação do tenant. |
| Decisão de rollout fresh deployment | lida | A aplicação não está em produção, não há dados a preservar e os ambientes podem ser recriados; upgrade in-place e importação do estado single-tenant foram removidos do escopo. |
| Retorno técnico posterior à atualização | lido | Primeiro `admin` anterior ao consentimento; candidato não instala contexto autorizado/RLS; scheduler sem `BYPASSRLS`; verifier de onboarding separado da factory runtime. |
| Validação técnica de control plane e RLS | lida | Separação explícita: tenants, memberships, convites de acesso e tentativas no control plane antes de RLS; tenant data plane protegido depois da autorização. |

Context7 foi consultado para Microsoft Graph: confirmou o POST de token com authority tenant-específica, `.default` e `client_credentials`, e o fluxo de admin consent com callback de `admin_consent`, `tenant` e `state`.

## Validação no tenant de desenvolvimento

| Data | Fluxo | Resultado |
| --- | --- | --- |
| 2026-08-21 | Admin consent → callback com `state` → token app-only por authority explícita → `GET /organization?$select=id` | `endpoint viável`: consentimento confirmado; token `200`; Graph `200` OData; ID da organização confirmou o tenant. |

A coleta foi executada por harness PHP em `/tmp`, sem escrita no tenant, sem persistência local e sem exposição de token, secret, callback ou payload. O harness foi descartado após a evidência.

## Lacunas e impacto

- A representação estrutural aprovada em `representacao-estrutural-telas.md` cobre onboarding, control plane, conexão/desconexão e memberships. As decisões de membership, provisioning fechado, primeiro vínculo e catálogo Governance foram confirmadas pelo usuário nesta conversa; não há tela de registro público, seletor ou troca de tenant no V1.
- Houve validação real no tenant de desenvolvimento de admin consent, token app-only e `GET /organization`; a evidência está sanitizada em `api.md`. Permissões efetivas de todas as superfícies, políticas de publisher verification, Conditional Access e restrições por produto ainda devem ser homologadas em dois tenants de teste.
- A documentação Microsoft alerta que `tenant` retornado no callback não é evidência suficiente para autenticar/autorizar. A confirmação posterior por token/Graph contra o tenant persistido é obrigatória.
