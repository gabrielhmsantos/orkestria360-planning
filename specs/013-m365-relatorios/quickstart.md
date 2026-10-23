# Quickstart — Relatórios Microsoft 365 V1

## Pré-requisitos

- Customer e conexão Microsoft publicados; fontes locais com cobertura/frescor.
- Templates/blocos V1; a taxa de adoção requer uso e população elegível na mesma
  geração. Inventário e Active User Detail são publicações independentes.

## Cenários de validação

1. Abra Catálogo: requisitos ausentes aparecem antes de gerar; `required` bloqueia.
2. Faça preflight de `operational-usage` em `D30` após rotina ou `--force`; para
   `D7`, `D30`, `D90` e `D180`, execute antes, quando necessário, a coleta histórica
   `--recollect-days=7|30|90|180`. Aceite a solicitação e confirme que request +
   manifesto são criados. Altere filtro e confirme novo preflight, request e manifesto.
3. Após o aceite da geração A, publique B como âncora factual; quando A estiver
   com `published_at < cutoff`, remova-a pelo prune de Licenciamento.
   Request/manifesto A seguem existentes; prévia, CSV e XLSX continuam idênticos
   pela `frozen_projection` de A, sem resolver `source_record_id_text`, marcar
   `unavailable`, usar B como fallback ou criar novo preflight. O Histórico segue
   exibindo a proveniência congelada de A.
4. Gere saída parcial somente para bloco `degradable` permitido, rotulada como parcial.
5. Faça o único download CSV/XLSX: ele gera e transmite o stream, persiste
   hash/metadados e encerra o request. Confirme que uma segunda tentativa é
   rejeitada e que Histórico não tem arquivo, URL, retenção, expiração ou download posterior.
   Abra o XLSX: valide worksheet, headers e valores contra a mesma prévia do CSV,
   inclusive máscaras/PII e rótulo parcial. Confirme que hash/tamanho são dos
   bytes entregues e que o temporário não existe após sucesso ou erro de geração.
6. Remova o agregado histórico do denominador: Taxa de adoção fica `unavailable`, nunca zero.
7. Alterne `included_in_calculation` após geração: o cálculo histórico não muda.
8. Tente acesso por outro tenant/conexão e como platform admin: nenhum dado data-plane é retornado.
9. Execute `routine` e `--force`: ambos pedem somente `D30`. Execute
   `--recollect-days=7|30|90|180`: valide respectivamente `D7`, `D30`, `D90`
   e `D180`. Execute
   `--recollect-date=AAAA-MM-DD` e `--recollect-today`: nenhum chama Graph
   Reports, nenhuma publicação de Relatórios é criada, e a publicação `D30`
   anterior permanece utilizável conforme seu frescor.
10. Execute `app:prune-microsoft365 {tenant} 1y`: uma geração não ancorada com
    `published_at < cutoff` é removida, enquanto uma com `published_at >= cutoff`,
    a última factual de cada período, a população compatível e inventory atual
    permanecem. Alterar `technical_synced_at` ou `LicensingSyncRun.finished_at`
    não muda a decisão. Confirme que somente requests `completed`/`failed` com
    `completed_at < cutoff` saem com seus filhos; `preflight_passed`/`generating`
    antigos e seus manifestos permanecem. Em seguida execute
    `app:prune-microsoft365 {tenant} all`: todo data plane de Licenciamento e
    Relatórios daquele tenant sai, mas o catálogo global e outro tenant permanecem.
    Repita ambos os comandos sem erro e confira as contagens.
11. Simule falha de Graph Reports com `/subscribedSkus` válido: o inventário da
    conexão é publicado. Simule `getOffice365ActiveUserDetail(D30)` válido e
    confirme a linha agregada `active_users_detail`, sem CSV, URL, UPN ou nome
    persistidos.

Execute a suíte definida nas tarefas e `composer ci:check` antes de concluir implementação.
