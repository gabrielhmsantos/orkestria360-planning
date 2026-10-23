# Contract: Database and Microsoft 365 Compatibility

## Scope

Não há API, rota, tela ou comando público novo. Este é um contrato de compatibilidade entre persistência, sincronização e projeções existentes.

## Preserved Contracts

| Contract | Guarantee |
| --- | --- |
| Microsoft 365 | permissões, URLs, clientes, cadência e formatos de publicação não mudam. |
| Read path | telas/filtros/projeções leem snapshots e source states locais publicados; não fazem HTTP externo. |
| Licensing V2 | Graph observável; fallback `licenseDetails → /users` quando aplicável; dados comerciais indisponíveis até Assessment/CSV; nenhuma escrita no tenant. |

## Evidência PostgreSQL 18 — Phase 4

Em 2026-08-20, com PostgreSQL 18.4 isolado e `CACHE_STORE=database`, foram executados com fakes:

- `CoordinatedSyncTest --filter=global_lock` — exclusividade por tenant antes de criar ciclo;
- `CoordinatedSyncTest --filter=lost_lock` — perda de lock encerra cycle, stage, batch, geração e run, sem promoção posterior;
- `DatabaseLockIntegrationTest` — dois processos PHP e conexões PostgreSQL independentes cobrem owner, aquisição concorrente, refresh, expiração, release e isolamento por tenant;
- `SecureScoreSynchronizationTest` e `SecureScorePublishedDataTest` — UUID/tenant composto, checksum canônico, rerun idempotente, publicação preservada e telemetria factual;
- `LicensingSyncTest` — lock independente, source state factual na primeira falha, preservação de indisponibilidade comercial e nenhuma escrita externa.

Os contratos de leitura continuam locais: nenhuma projeção/tela executa HTTP. Falhas de fonte preservam publicação anterior como `stale`; sem publicação anterior, persistem somente disponibilidade, frescor e razão factual.
| Publication | falha posterior preserva publicação anterior com frescor/razão factual; na primeira falha, não fabrica publicação, vazio ou zero e registra indisponibilidade local com frescor/razão factual. |
| Sync lock | uma sincronização coordenada por tenant; o ciclo é registrado após adquirir o lock. Perda do lock encerra registros ativos e impede novas coletas/promoções. O lock de Licenciamento mantém sua topologia atual. |

## Persistence Contract

1. Relações coordenadas não cruzam tenant/ciclo; histórico/publicações não são apagados em cascata.
2. Reruns/payloads duplicados não criam publication, batch, position, revision ou snapshot adicional.
3. Telemetria separa lido, processado, criado, atualizado, persistido, deduplicado, excluído, tentativa e retry; persistido vem do banco, não do payload.
4. JSONB é somente dado não criptografado; checksum vem do payload pré-persistência.

## Regression Verification

- sincronização Graph/Defender fake: publicação, fallback, frescor, primeira falha sem publicação fabricada e zero HTTP na leitura;
- rerun e colisão: unicidade e métricas factuais;
- perda de lock: terminalização, release e publicação anterior;
- tenant A/B, ciclo ausente e delete histórico diretamente em PostgreSQL.
