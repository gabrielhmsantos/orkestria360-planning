# Configurações do Tenant — Contratos

- Organização: propriedades normalizadas, domínios, serviços, sincronização e metadados de fonte/frescor.
- Item transversal: `settingKey`, `displayName`, `currentValue`, `baselineValue`, `complianceStatus`, `source`, `apiVersion`, `sourceLastModifiedAt`, `lastObservedChangeAt` e `lastCollectedAt`. `sourceLastModifiedAt` só representa alteração declarada pela fonte; diferença identificada entre snapshots usa `lastObservedChangeAt`.
- Branding e domínios declaram somente a permissão de leitura exigida pelo conector.

## Integração com o sync coordenado

`/organization` é extensão da fonte canônica de organização: acrescenta campos de postura sem alterar a unidade operacional, que é a conexão customer explícita. `/domains` é projeção canônica de domínios; `/domains/{domain-id}` é mapeado somente para rastreabilidade e não justifica leitura individual, pois a coleção já contém o fato consumido. Branding, `groupSettings` e `groupSettingTemplates` são novas coletas justificadas e viáveis; branding correlaciona exclusivamente o identificador de organização da própria conexão, o primeiro aceita `$top=100` e o segundo foi validado somente sem `$top`. Cada fonte coleta antes do staging, deduplica pela chave externa, segue paginação quando houver e promove atomicamente. Falha ou restrição preserva publicação anterior com `availability`, `coverage`, `freshness`, `reason` e `result_state`; a tela não chama Graph.
