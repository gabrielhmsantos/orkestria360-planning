# APIs — Grupos Dinâmicos

## `GET /groups`

**Request:** sem corpo. Consulta prevista: `$filter=groupTypes/any(c:c eq 'DynamicMembership')` com `$select=id,displayName,groupTypes,membershipRule,membershipRuleProcessingState,createdDateTime`; `$top` e paginação OData. Filtros avançados requerem `ConsistencyLevel: eventual` e `$count=true` quando solicitada contagem. **Resposta:** `200 application/json` com `value: Group[]` e `@odata.nextLink` opcional.

Campos: `id` (string), `displayName` (string ou `null`), `groupTypes` (string[]), `membershipRule` (string ou `null`), `membershipRuleProcessingState` (string ou `null`) e `createdDateTime` (ISO 8601 ou `null`). Regra e nome podem revelar estrutura organizacional; são PII/dado corporativo.

`Group.Read.All` é a permissão de aplicação considerada para a coleção. A capacidade é `restricted` se o tenant não dispuser de Microsoft Entra ID P1/P2 para associação dinâmica; `400` por licença não é coleção vazia. `value: []` no filtro é resposta filtrada sem correspondências até a variante sem filtro confirmar `empty_valid_response`.

Simulação, risco de abrangência e diferenças contra a regra atual são processamento interno `coming_soon`, sem endpoint Graph de escrita neste discovery.

## Homologação de leitura

A consulta filtrada por `DynamicMembership` respondeu `200 application/json` com item e os campos de regra solicitados. Isso confirma a rota no tenant coletado, não a cobertura de todos os grupos nem a disponibilidade de simulação.
