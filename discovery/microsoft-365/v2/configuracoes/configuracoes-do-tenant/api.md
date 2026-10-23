# APIs — Configurações do Tenant

Todas as rotas usam `GET`, sem corpo, para `https://graph.microsoft.com/v1.0`, audience `https://graph.microsoft.com`, autenticação de aplicação e `Accept: application/json`.

| Rota | Evidência no tenant | Contrato externo |
| --- | --- | --- |
| `/organization?$select=id,displayName,verifiedDomains,onPremisesSyncEnabled,createdDateTime,countryLetterCode,preferredLanguage` | `200 application/json;odata.metadata=minimal`, coleção OData `value[]`; primeiro item continha todos os campos selecionados. | `Organization.Read.All`; os campos podem ser nulos; não houve paginação na coleta. |
| `/domains` | `200 application/json;odata.metadata=minimal` nos dois tenants, envelope OData `value[]`; itens com autenticação, disponibilidade, flags de domínio, serviços, janelas de senha e estado. | `Domain.Read.All`; não exige nova coleta enquanto `verifiedDomains` e a projeção de domínios publicada cobrirem o catálogo. |
| `/domains/{domain-id}` | `200 application/json;odata.metadata=minimal` nos dois tenants, entidade `domain` com o mesmo shape da coleção. | `Domain.Read.All`; é mapeado, mas não chamado pela tela. `404` representa domínio inexistente, não catálogo vazio. |
| `/organization/{organization-id}/branding` | `200 application/json;odata.metadata=minimal`, entidade com campos de cor, logos, textos e URLs relativas de branding. | `OrganizationalBranding.Read.All`; o identificador foi resolvido internamente da conexão customer e não é registrado. |
| `/groupSettings?$top=100` | `200 application/json;odata.metadata=minimal`, OData `value[]`, itens com `id`, `displayName`, `templateId` e `values`. | `GroupSettings.Read.All`; `values` é coleção de pares de configuração e pode estar vazia. |
| `/groupSettingTemplates` | `$top=100` retornou `400 application/json`; a variante sem query retornou `200 application/json;odata.metadata=minimal`, OData `value[]`, itens com `id`, `deletedDateTime`, `displayName`, `description` e `values`. | `GroupSettings.Read.All`; coletar sem `$top` e seguir `@odata.nextLink` quando existir. |

Dados de branding, domínios e valores de configuração podem revelar nomes e endereços do tenant; não há payload nem identificadores reais neste discovery.

## Uso pela aplicação

`/organization` é uma extensão da fonte canônica de organização já usada pelo Orkestria; domínios derivam da mesma publicação. Branding, configurações de grupo e modelos são novas coletas justificadas por não existirem nas projeções atuais. A tela lê somente as projeções publicadas e expõe disponibilidade, cobertura, frescor e razão quando a fonte não puder ser coletada.
