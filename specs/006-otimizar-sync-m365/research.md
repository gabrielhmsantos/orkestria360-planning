# Research: Otimização dos Syncs Microsoft 365

## Delta de identidades e grupos

**Decision**: Tratar `@odata.deltaLink` como cursor opaco, seguir todas as páginas, aplicar itens ao staging e promover somente após o último link delta. Processar `@removed` como tombstone e reiniciar de uma carga completa ao receber reset/expiração.

**Rationale**: A documentação do Microsoft Graph informa que respostas delta podem repetir itens, que tokens de objetos de diretório expiram e que `410 Gone` exige reinicialização. A aplicação atual já armazena delta links e tombstones, mas ainda lê as coleções completas após o delta.

**Alternatives considered**:

- Usar watermark em usuários/grupos: rejeitado, pois remoções e propriedades de estado não são cobertas com segurança.
- Manter leitura completa após delta: rejeitado, pois anula a economia e contraria SC-001.

## Eventos temporais e paginação

**Decision**: Usar watermark por tenant e fonte para directory audits e sign-ins, com overlap inicial de 15 minutos, janela fechada no início da execução, paginação até não haver `@odata.nextLink` e `upsert` por `external_id`.

**Rationale**: Sign-ins e directory audits aceitam filtro temporal; Graph exige seguir `@odata.nextLink` até o fim. O overlap e o identificador externo tornam replays e atrasos seguros. O watermark só avança depois da persistência total.

**Alternatives considered**:

- Relê todo o histórico diariamente: rejeitado por volume crescente e risco de throttling.
- Manter somente a primeira página: rejeitado porque não atende cobertura histórica; só seria aceitável com a UI declarando amostra.

## Throttling e exclusividade

**Decision**: Respeitar o `Retry-After` integralmente; quando ausente, aplicar backoff exponencial com jitter. Usar lock global por tenant e manter sua vigência por toda a execução saudável.

**Rationale**: A orientação Graph estabelece que antecipar a nova tentativa mantém consumo sendo contabilizado e agrava o throttling. Laravel oferece locks atômicos e `withoutOverlapping`, mas os locks atuais de 900 segundos são isolados por domínio.

**Alternatives considered**:

- Limitar a espera a 10 segundos: rejeitado por poder violar o prazo da fonte.
- Paralelizar chamadas imediatamente: rejeitado até a telemetria provar limite seguro de concorrência.

## Persistência e promoção

**Decision**: Coletar e persistir staging fora da transação de promoção; usar `upsert` em lotes onde a semântica permitir; promover a geração em transação curta.

**Rationale**: Os sincronizadores atuais mantêm transação aberta durante HTTP e loops N+1. As tabelas de snapshots e eventos já fornecem as bases de publicação e idempotência.

**Alternatives considered**:

- Manter uma única transação longa: rejeitado por locks de banco durante paginação/retry.
- Criar uma plataforma de filas distribuídas: rejeitado para manter o POC simples.

## Relacionamentos de grupos e relatórios

**Decision**: Recoletar relações e erros de licença somente de grupos afetados pelo delta; atualizar relações `user → memberOf` somente para identidades afetadas; reconciliar ambas as direções semanalmente. Reusar CSVs enquanto `reportRefreshDate` não mudar.

**Rationale**: O delta fornece parte do conjunto afetado, mas uma alteração de associação pode não produzir delta da identidade correspondente; apenas um watermark não detecta remoções de relações. Relatórios de período não são feed incremental de eventos.

**Alternatives considered**:

- Executar N+1 para todos os grupos em cada ciclo: rejeitado pelo custo em 10.000 grupos.
- Nunca reconciliar: rejeitado porque remoções e divergências podem persistir.

## Consultas locais e snapshots sem delta

**Decision**: Aplicar `$select`, ordenação, `top` e filtros de tela sobre a fotografia canônica local quando ela contiver o superset necessário. Manter roles, PIM, MFA e risco como snapshots periódicos por fonte, com estado, data de referência, cobertura e frescor próprios.

**Rationale**: Reconsultar Graph apenas para variar a apresentação de um mesmo recurso reintroduz a duplicação que esta feature elimina. Essas quatro fontes não possuem cursor incremental adotado pelo diagnóstico; tratá-las como delta ou watermark ocultaria remoções e alterações de estado.

**Alternatives considered**:

- Reconsultar Graph para cada filtro, ordenação ou limite de tela: rejeitado por duplicar a coleção canônica.
- Aplicar delta ou watermark a roles, PIM, MFA e risco sem contrato específico: rejeitado por não cobrir corretamente remoções e mudanças de estado.

## Dados de licença no delta

**Decision**: Não adicionar uma chamada individual de detalhes de licença por usuário ao ciclo canônico. A coleta de usuários deve selecionar e validar os campos de atribuição já usados pela projeção (`assignedLicenses`, `assignedPlans` e `licenseAssignmentStates`); quando a fonte não os entregar por limitação de permissão/contrato, a projeção de Licenciamento preserva o último dado íntegro e declara a fonte como restrita ou indisponível. Antes de remover uma eventual coleta de `licenseDetails`, mapear consumidores e provar que seus campos exclusivos já estão cobertos por outra projeção.

**Rationale**: A validação no tenant confirmou `GET /users/{id}/licenseDetails` com `200` em client credentials, embora a matriz pública do Learn ainda declare application permissions não suportadas. O endpoint fornece `skuPartNumber` e planos por usuário, incluindo `servicePlanType` e `provisioningStatus`, mas o fluxo produtivo atual não o chama nem persiste esses campos: ele já projeta atribuições a partir da coleção `/users`. Portanto, a otimização não remove dados hoje coletados. Caso uma futura superfície passe a depender desses campos exclusivos, essa necessidade deve virar requisito próprio; não se deve retirar a coleta correspondente sem uma fonte/projeção equivalente comprovada.

**Alternatives considered**:

- Consultar detalhes de licença por usuário como fallback genérico: rejeitado por reintroduzir N+1. Só poderá ser proposto para um requisito explícito que consuma campos exclusivos e com estratégia de cobertura, custo e testes definida.
- Publicar atribuições vazias quando a propriedade faltar: rejeitado por poder remover dados corretos da última geração.

## Sources

- [Microsoft Graph — delta query overview](https://learn.microsoft.com/en-us/graph/delta-query-overview)
- [Microsoft Graph — list sign-ins](https://learn.microsoft.com/en-us/graph/api/signin-list)
- [Microsoft Graph — paging](https://learn.microsoft.com/en-us/graph/paging)
- [Microsoft Graph — throttling](https://learn.microsoft.com/en-us/graph/throttling)
- [Laravel 13 — scheduling](https://laravel.com/docs/13.x/scheduling)
- [Laravel 13 — cache locks](https://laravel.com/docs/13.x/cache#atomic-locks)
- [Laravel 13 — upsert](https://laravel.com/docs/13.x/eloquent#upserts)
