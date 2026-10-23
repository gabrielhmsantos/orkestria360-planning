# Colaboração e Compartilhamento — Decisões

- `sharepointSettings` é a fonte Graph prevista para propriedades suportadas de SharePoint e OneDrive; lacunas requerem fonte específica, não valor presumido — sponsor.
- Configurações Teams não integralmente suportadas pelo Graph dependem de PowerShell e sua homologação — sponsor.
- Clarificação — Q: escopo da trava de autenticação legada → A: B; fatos versionados por workload ligados por `OR`, começando por SharePoint/OneDrive em Graph `v1.0`. O baseline é `isLegacyAuthProtocolsEnabled=false` e somente `currentValue=true` ativa a trava; Entra e Exchange entram somente após homologação individual (origem: usuário; data: 2026-08-25).
- Clarificação — Q: link anônimo global com edição → A: A; requer fatos distintos de link anônimo permitido e permissão padrão `Edit`; sem ambos homologados, é `unavailable` e não ativa trava (origem: usuário; data: 2026-08-25).
