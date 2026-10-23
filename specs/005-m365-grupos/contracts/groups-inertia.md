# Contract: Grupos Microsoft 365 — Inertia

## Scope

Contrato interno entre backend e página Inertia de `/microsoft-365/grupos`.
Não é API pública. Usuários autenticados recebem o mesmo contrato; não há props
ou capacidades condicionadas a perfil.

## Routes

| Método | Caminho | Propósito |
|---|---|---|
| `GET` | `/microsoft-365/grupos` | Dashboard Executivo de Grupos |
| `GET` | `/microsoft-365/grupos/{tab}` | Uma das sete abas complementares |
| `GET` | `/microsoft-365/grupos/diretorio/{group}` | Contexto de grupo preservando filtros de origem |

`tab` aceita: `diretorio`, `membros-proprietarios`, `dinamicos`,
`licenciamento`, `governanca-ciclo-de-vida`, `atividade-inatividade` e
`historico-auditoria`.

## Page Props

```text
data:
  activeTab: dashboard | diretorio | membros-proprietarios | dinamicos |
             licenciamento | governanca-ciclo-de-vida | atividade-inatividade |
             historico-auditoria
  tenant: { name, timezone }
  sourceStates: SourceState[]
  dashboard | directory | membersOwners | dynamicGroups | licensing |
  lifecycle | activity | audit: surface-specific payload
```

Cada bloco factual possui `availabilityStatus`, `source`, `coverage`,
`lastUpdatedAt`, `freshness` e `reason` quando não estiver totalmente
disponível. Listas distinguem `no_matches` de `empty_valid_response`.

## Interaction Rules

- Busca, filtros, ordenação e paginação permanecem na query string.
- Detalhe retorna ou mantém a query de origem; nenhuma prop expõe permissão por
  usuário ou cria diferenciação de audiência.
- Ações mutáveis e exportações usam uma intenção `coming_soon`; não existe rota
  POST, PATCH, PUT ou DELETE nesta feature.
