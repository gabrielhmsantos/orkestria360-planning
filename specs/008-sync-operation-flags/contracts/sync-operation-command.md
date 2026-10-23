# Contract: Modos Operacionais do Comando Microsoft 365

## Interface pública

```text
php artisan app:sync-microsoft365 {--force} {--recollect-days=} {--recollect-date=} {--recollect-today}
```

`--full-reconciliation` não pertence mais à interface pública.

| Entrada | Validação e efeito |
|---|---|
| sem flags | Modo `routine`: mantém cursores/watermarks e cadência incremental atuais. |
| `--force` | Modo `force`: tenta todas as fontes, ignora controles de cadência, preserva posições incrementais e conserva deduplicação/reutilização de conteúdo inalterado. |
| `--recollect-days=N` | `N` aceita somente `7`, `30`, `90` ou `180`, equivalentes a `D7`, `D30`, `D90` e `D180` da documentação Learn. `60`, outros inteiros e valores não numéricos falham antes do ciclo. Modo `recollect_days`: estado/relações como fotografia atual completa; eventos entre 00:00:00 do dia atual menos N dias e 00:00:00 do dia atual. |
| `--recollect-date=AAAA-MM-DD` | Data de calendário válida e não futura no timezone do tenant. Modo `recollect_date`: estado completo e eventos no dia civil `[00:00, próximo 00:00)`; se a data for hoje, usa a mesma cobertura parcial de `--recollect-today`. |
| `--recollect-today` | Modo `recollect_today`: resolve uma vez a data atual do tenant e equivale à intenção da recoleta explícita dessa data. Antes do fim do dia, solicita o dia completo, mas publica cobertura parcial somente até `observed_at`, instante UTC único congelado no início do ciclo. |

Os quatro modos são mutuamente exclusivos: use `--force` **ou** exatamente um `--recollect-*`. A recoleta já força a execução global e define reconstrução/janela, portanto `--force` com recoleta falha antecipadamente. Erros de valor, data ou combinação retornam falha e orientação de correção antes de obter lock, criar ciclo, chamar Graph ou alterar publicação.

## Aplicação global a todos os coletores

As flags não selecionam um subconjunto de fontes. Em cada execução, o coordenador passa o mesmo modo a todos os coletores elegíveis do ciclo; a dependência define apenas se uma etapa precisa ser pulada após a falha de uma publicação necessária no ciclo atual. O parâmetro de período/data não torna coletores de estado, snapshot ou relação opcionais: eles executam a reconstrução atual que sua fonte suporta.

## Semântica por tipo de fonte

| Tipo de fonte | Rotina / force | Recoleta |
|---|---|---|
| Estado e relações | Rotina incremental; `force` reexecuta fonte sem reset de posição. | Reconstrói fotografia atual completa e relações disponíveis. |
| Evento temporal (`directory_audits`, `sign_ins`, `risk_detections`) | Watermark + overlap na rotina e no `force`; deduplicação/reutilização permanece. | Consulta a janela UTC derivada do período/data solicitada. |
| Snapshot sem histórico | Atualiza conforme capacidade da fonte. | Reconstrói apenas fotografia atual; cobertura não afirma histórico inexistente. |

## Resultado e persistência

O ciclo registra o modo efetivo, opções normalizadas, timezone e janela UTC solicitada. Toda janela de recoleta é calculada por limites de dia civil do tenant, não pelo horário em que o comando foi executado. O console identifica esses valores e mantém a tabela de estágios, telemetria, motivos sanitizados e status final atuais. Para cada fonte temporal, `coverage` versão 1 expõe `requested_window`, `effective_window`, `collected_through_at`, `coverage_status`, `limitation_reason` e `source_limit_at`.

Em uma recoleta da data local atual, por `--recollect-date` ou `--recollect-today`, a janela solicitada é `[00:00, próximo 00:00)`, mas a janela efetiva de `directory_audits`, `sign_ins` e `risk_detections` termina exatamente no mesmo `observed_at` UTC; o estado é `partial` com razão `dia_em_curso`. Nunca declarar horas futuras como coletadas. Recoletas preservam cursores/watermarks incrementais publicados; somente rotina e `--force` os avançam após uma publicação válida.

Todas as variantes usam o mesmo lock por tenant; uma execução ativa rejeita a nova. O ciclo renova o TTL do lock que possui antes de expirar, inclusive entre páginas e retries de uma etapa longa; se não puder renovar ou perder ownership, aborta antes de nova publicação. Cada fonte promove dados somente após coleta válida. Falhas mantêm a última publicação válida; fontes independentes continuam; dependentes sem publicação da dependência no ciclo atual são `skipped` com motivo explícito.

## Scheduler

| Agenda | Comando |
|---|---|
| Diária, 03:00, exceto domingo | `app:sync-microsoft365` |
| Semanal, domingo 03:00 | `app:sync-microsoft365 --recollect-today` |

As duas tarefas conservam o timezone do tenant e `withoutOverlapping()`. Prunes continuam tarefas separadas.
