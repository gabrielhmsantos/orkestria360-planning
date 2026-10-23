# Research: Modos Operacionais do Sync Microsoft 365

## Contrato de opções Artisan e exclusividade

**Decision**: Declarar `--force`, `--recollect-days=`, `--recollect-date=` e `--recollect-today` na assinatura do único comando `app:sync-microsoft365`. `--recollect-days` mantém uma entrada numérica, mas aceita apenas `7`, `30`, `90` e `180`, os equivalentes de `D7`, `D30`, `D90` e `D180` dos relatórios Learn; `D60`/`60` são inválidos. O comando converte as opções em `SyncOperation` e rejeita combinações/valores inválidos antes de chamar o coordenador; `--full-reconciliation` deixa de ser aceito.

**Rationale**: A assinatura Artisan é o contrato de entrada dos comandos e os testes de console exercitam o comando com a mesma sintaxe. Os endpoints Microsoft Graph de relatórios validados documentam somente `D7`, `D30`, `D90` e `D180`; centralizar essa allowlist e a normalização em um value object evita que cada coletor aceite uma janela diferente.

**Alternatives considered**:

- Preservar `--full-reconciliation` como alias: rejeitado por FR-012, que exige sua remoção da interface pública.
- Passar flags cruas a cada sincronizador: rejeitado porque duplicaria a validação e permitiria divergência de janela/modo entre fontes.
- Aceitar qualquer inteiro positivo ou incluir `60`: rejeitado porque não corresponde aos períodos de relatório Microsoft Learn validados e levaria o comando a prometer uma janela não suportada de forma uniforme.

## Janelas temporais no timezone do tenant

**Decision**: Resolver a data civil uma única vez no começo do ciclo, mas não usar a hora do disparo como limite. Para `recollect_days=N`, usar `[00:00 do dia local atual − N dias, 00:00 do dia local atual)`; para `recollect_date`, converter o início inclusivo e o próximo início exclusivo do dia civil informado no timezone de `TenantActivitySetting` para UTC; `recollect_today` resolve a mesma data local uma única vez e reutiliza `[00:00, próximo 00:00)`. Registrar limites solicitados e efetivamente coletados.

**Rationale**: Janelas UTC persistidas evitam ambiguidade e o intervalo semiaberto evita duplicação na fronteira entre dias. Limites em 00:00:00 tornam a mesma recoleta reproduzível, mesmo se o comando for iniciado no meio do dia; a resolução única evita que uma execução atravessando meia-noite mude silenciosamente de data. O coletor atual já publica os limites UTC em lotes de eventos.

**Decision for day in progress**: Uma recoleta da data local atual, explícita ou por `recollect_today`, mantém a janela civil solicitada, mas `SyncOperation` congela `observed_at` UTC uma única vez no início do ciclo. As três fontes temporais usam esse mesmo teto para medir cobertura efetiva e publicam `partial` com razão `dia_em_curso` até que uma recoleta posterior cubra o restante; não enviam ou declaram como obtidos instantes futuros.

**Rationale**: O scheduler semanal ocorre às 03:00 e o atalho é explicitamente destinado ao dia em curso. Exigir um dia já encerrado o descaracterizaria; publicar a cobertura parcial preserva honestidade operacional e a promoção atômica por fonte.

**Alternatives considered**:

- Usar timezone da máquina: rejeitado, pois viola a premissa do tenant e torna testes/execuções em servidores diferentes inconsistentes.
- Calcular “hoje” em cada fonte ou usar a hora de disparo como fim da janela: rejeitado, pois fontes iniciadas depois da meia-noite poderiam recoletar dias diferentes e a mesma operação variaria conforme o horário de execução.

## Semântica de force versus recoleta

**Decision**: As quatro flags são operação global: o coordenador entrega o mesmo `SyncOperation` a todos os coletores elegíveis, sem reduzir etapas a eventos. `--force` só dispensa controles de cadência: todas as fontes são tentadas, `delta_link`/watermarks continuam preservados e conteúdo idêntico continua deduplicado/reutilizado. Todo `--recollect-*` seleciona reconstrução: fontes de estado/snapshot fazem fotografia ou reconciliação atual completa e fontes temporais (`directory_audits`, `sign_ins` e `risk_detections`) usam a janela explícita. `--force` é mutuamente exclusivo com recoleta porque não acrescenta efeito à reconstrução já escolhida.

**Rationale**: O ciclo existente já usa `force` para reler dados e atualizar evidência sem apagar conteúdo publicado, enquanto `fullReconciliation` determina coleta completa de relações/estado. A implementação atual também usa `force` para descartar `delta_link` em identidades/grupos e ampliar eventos para 180 dias; isso conflita com FR-002 e deve ser corrigido. Tornar a intenção explícita mantém efeitos distintos e satisfaz FR-002, FR-004, FR-007 e FR-008.

**Alternatives considered**:

- Fazer `--force` resetar posições: rejeitado por FR-002 e pelo risco de uma recuperação cara não solicitada.
- Usar `--recollect-days` apenas para eventos: rejeitado porque FR-003 exige reconstrução global de todos os coletores.
- Aceitar `--force` com recoleta: rejeitado porque a recoleta já força todos os coletores e define a janela; a combinação não acrescenta semântica operacional.

## Lock, scheduler e publicação

**Decision**: Manter o lock `microsoft365:{tenant}:sync` do coordenador para todos os modos, renovando o TTL do lock já adquirido antes de expirar, inclusive dentro de paginação/retries longos e após cada etapa segura; `withoutOverlapping()` permanece no scheduler. Se `refresh()` falhar ou ownership for perdido, abortar antes de qualquer nova promoção. Trocar somente o job semanal para `app:sync-microsoft365 --recollect-today`; rotina diária e prunes continuam separados. Publicações continuam promovidas por fonte após coleta válida, e falhas não bloqueiam fontes independentes. Recoletas preservam cursores/watermarks incrementais; somente rotina e `force` avançam posições após êxito.

**Rationale**: Laravel documenta `withoutOverlapping()` como bloqueio baseado no cache para tarefas agendadas e comandos isoláveis/locks atômicos para evitar instâncias concorrentes. O lock do coordenador continua protegendo também disparos manuais, e `Lock::refresh()` renova a expiração para operações longas. Preservar a posição durante recoleta impede que um backfill altere a fronteira do ciclo incremental corrente.

**Alternatives considered**:

- Confiar apenas no `withoutOverlapping()`: rejeitado, porque não protege chamadas manuais do comando.
- Interromper o ciclo na primeira falha: rejeitado por FR-013 e pelo contrato de estágios independentes.
- Manter TTL fixo de 7.200 segundos: rejeitado porque uma recoleta de 180 dias pode ultrapassá-lo e perder a exclusividade manual.
- Avançar watermark até o fim solicitado de uma recoleta: rejeitado porque o fim pode estar no futuro ou não ter sido efetivamente coberto; preservar a posição incremental evita lacunas.

## Sources

- Context7, [Laravel 13 — Artisan](https://laravel.com/docs/13.x/artisan): assinaturas de comandos e testes de console.
- Context7, [Laravel 13 — Scheduling](https://laravel.com/docs/13.x/scheduling): agendamento de comandos com opções e `withoutOverlapping()`.
- Context7, [Laravel 13 — Cache locks](https://laravel.com/docs/13.x/cache): renovação de lock com `refresh()` durante operações longas.
- Context7, [Microsoft Graph — Office 365 Groups activity detail](https://learn.microsoft.com/en-us/graph/api/reportroot-getoffice365groupsactivitydetail): períodos aceitos `D7`, `D30`, `D90`, `D180`.
- [Contrato do ciclo coordenado anterior](../006-otimizar-sync-m365/contracts/sync-command.md): lock por tenant, dependências e publicação atual.
