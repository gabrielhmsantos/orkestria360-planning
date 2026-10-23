# Modelo conceitual — Configurações Microsoft 365

## Entidades persistentes necessárias

O módulo precisa manter catálogo, estado normalizado, baselines publicados, snapshots e histórico observado. Graph e PowerShell não substituem essa leitura interna consolidada.

| Entidade | Finalidade | Relações principais |
| --- | --- | --- |
| Catálogo de configuração | Define chave, serviço, categoria, origem de leitura, permissões, risco e escopo. | Referenciada por estado atual e baseline. |
| Estado atual de configuração | Snapshot normalizado por tenant, objeto e escopo. | Pertence ao tenant e catálogo; compara baseline. |
| Baseline e item de baseline | Modelo versionado e valores esperados por configuração. | Baseline contém itens e compara o estado atual. |
| Snapshot e evento de drift | Evidência histórica e mudança externa detectada. | Snapshot pertence ao tenant; drift referencia catálogo e snapshots. |
| Evento de auditoria observado | Registro de mudança identificada por fonte autorizada. | Referencia tenant, catálogo, snapshot e origem. |

## Regras confirmadas

- Toda entidade operacional é isolada por `tenant_id`.
- Valores de configuração são estruturados (`JSON`) e preservam valor anterior, desejado e efetivo sem reduzir ausência a zero.
- A persistência sustenta somente consulta de estado, baseline, snapshots, drift e evidências observadas.
- Datas preservam semânticas independentes: `sourceLastModifiedAt` é fato declarado pela fonte; `lastObservedChangeAt` é detecção por comparação de snapshots; `lastCollectedAt` é o instante de coleta.
- Para score, uma linha homologada e aplicável da matriz é elegível mesmo quando sua fonte estiver `unavailable`: preserva esse estado e sua razão, não recebe `currentValue` inventado e contribui `0` ao numerador. A cobertura é calculada separadamente pelas linhas com leitura comparável; uma trava exige evidência positiva do risco e não é ativada pela indisponibilidade.

## Limites

Os nomes físicos, política de retenção, índices e granularidade de evidências ainda dependem de decisão de futura Spec.
