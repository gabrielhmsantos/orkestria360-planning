# Fixtures — OneDrive

## Limites de responsabilidade

Os fixtures de integração do Simulator exercitam a forma Graph/Management Activity sintética. Os fixtures de UI ficam em [`fixtures/`](fixtures/README.md) e exercitam o contrato Orkestria já projetado para cada superfície. Um não substitui o outro.

Os fixtures de UI são determinísticos, contêm somente valores sintéticos e selecionam cenário explicitamente. Eles não são dados de tenant, não carregam URL pré-autenticada/token e não podem se tornar fallback de produção.

## Estados

| Estado | Regra do contrato de UI |
| --- | --- |
| `empty` | Coleção confirmada vazia; zero aparece somente para métrica publicada. |
| `partial` | Mantém blocos confirmados e declara cobertura/lacuna por bloco. |
| `unavailable` | Exibe motivo e não calcula zero. |
| `restricted` | Explica a restrição e omite os valores não observados. |
| `stale` | Exibe a data da última publicação e preserva somente aquele snapshot. |
| `failed` | Mantém o recorte, remove o resultado falho e não inventa retry. |

Compartilhamento detalhado, retenção e auditoria agora também têm cenários `populated` sintéticos para composição de UI, sempre marcados como fixture. A disponibilidade da fonte real continua independente e não é inferida desses cenários.
