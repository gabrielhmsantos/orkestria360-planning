# Data Model — Secure Score

## Entidades

| Entidade | Campos e regras principais |
| --- | --- |
| Geração de Score | tenant, `graph_score_id` único por tenant, checksum, revisão, `createdDateTime` para ordenação, `sync_cycle_id`, geração, observado/publicado, score atual/máximo, comparativos e estado da fonte; imutável após publicação. |
| Controle no Snapshot | geração + nome únicos; categoria, score, status Microsoft, associação de perfil e motivo/método de match. |
| Versão de Perfil | tenant, checksum do catálogo, `sync_cycle_id`, versão, publicação e estado; imutável. |
| Perfil Versionado | ID, máximo, categoria, depreciação, título, serviço, esforço, impacto, ameaças e orientação. |
| Publicação Secure Score | manifesto com geração de score, versão de perfil, versão de algoritmo de join e cobertura. |
| Estado de Fonte | disponibilidade publicada, cobertura, frescor, motivo sanitizado, resultado da última tentativa, páginas, itens, tentativas e throttling. |
| Fotografia Correlata | tenant, `sync_cycle_id`, fonte, payload minimizado, chave de correlação e cobertura/limites; publicada independentemente. |

## Relações e invariantes

- Uma geração possui muitos controles; uma versão possui muitos perfis.
- Releitura/retry da mesma fotografia usa `tenant + graph_score_id` e checksum para deduplicação; checksum idêntico é no-op. Se o payload de uma fotografia já publicada mudar, uma nova revisão compatível é criada sem sobrescrever a fotografia histórica nem criar evento/diff duplicado.
- Perfis são versionados por checksum do catálogo; o vínculo ciclo→versão permite comprovar a compatibilidade do manifesto sem consultar um catálogo atual.
- Um manifesto referencia exatamente uma geração e uma versão íntegras do mesmo `sync_cycle_id` (ou chave de compatibilidade persistida); consumidores de join leem somente manifesto publicado.
- Match exato precede fallback normalizado; colisão/ausência nunca seleciona perfil.
- Progresso usa score do controle versus máximo do perfil; dados ausentes reduzem cobertura.
- Diferença histórica compara somente dois manifestos e atributos persistidos em ambos.

## Estados

- Disponibilidade publicada: `available`, `restricted`, `unavailable`, `coming_soon`.
- Última tentativa: `success`, `empty_valid`, `failed`, `restricted`; `failed`/`restricted` posteriores preservam disponibilidade publicada e marcam frescor como defasado. Primeira falha sem publicação fica `unavailable`.
- Manifesto: `staging`, `published`, `superseded`, `failed`.
