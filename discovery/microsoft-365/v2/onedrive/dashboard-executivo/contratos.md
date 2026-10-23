# Dashboard Executivo — Contrato semântico inicial

## Shape e semântica

- `summary`: totais opcionais de contas, capacidade usada/alocada, taxa de utilização, arquivos, contas acima de cota e contas com compartilhamento externo. Cada métrica publicada tem `value` e pode publicar `comparison.previousValue` com `comparison.periodDays`; o Dashboard Executivo usa a comparação D30. Ausência ou `null` declaram comparação não publicada. Base anterior zero é factual e publicada: permanece visível como comparação; em qualquer unidade, a variação é normalizada como `valor atual × 100%` (`0→1 = 100%`, `0→2 = 200%`).
- `activityDistribution` e `utilizationDistribution`: coleções de categoria, quantidade e participação; categorias de atividade e de utilização só são exibidas quando a regra correspondente estiver publicada. No Dashboard Executivo, as faixas de atividade são `Ativas (<= 30 Dias)`, `Baixa atividade (31 a 90 dias)`, `Inativas (91 a 180 dias)` e `Críticas (> 180 dias)`; as de utilização são `0% a 50%` (`0 ≤ u ≤ 50`), `50% a 80%` (`50 < u < 80`), `80% a 95%` (`80 ≤ u ≤ 95`) e `> 95%` (`u > 95`), com `u = 100 × uso/alocação` sem arredondamento. A [regra compartilhada das faixas](../contas-e-armazenamento/contratos.md#fronteiras-da-distribuição-de-utilização) define unidades, ausências e denominador; o Dashboard usa sua população global publicada, cobertura e `asOf` próprios. As faixas do donut não substituem os níveis 80/90/95: utilização exatamente 95 permanece na terceira faixa e já é crítica.
- `storageTrend`: pontos temporais ordenados, com quantidade usada e alocada na mesma unidade publicada. A série alocada só é exibida quando estiver integralmente publicada em todos os pontos; em caso contrário, a UI mostra somente usado e declara a série ausente.
- `sharingSummary.items` e `offboardingSummary.items`: coleções ordenadas de quatro itens, cada uma com `id`, `label`, `value` anulável e `icon`. `sharingSummary` mantém o recorte publicado em `period`.
- `risks`: coleção ordenada de itens com `id`, `label`, `value` anulável, `priority` e `icon`; a prioridade é semântica técnica e não é texto visível no Dashboard Executivo. `recommendations` é uma coleção ordenada de cinco itens com `id`, `label`, `priority` e `icon`; a prioridade é apresentada como badge localizado `Crítico`, `Alto` ou `Médio`.
- `icon`: composição tipada de `family` (`user`, `share`, `link`, `domain`, `transfer`, `retention`, `deletion`, `account`, `device` ou `file`) e `tone` (`neutral`, `success`, `warning` ou `danger`). O mapper central converte somente a família em Lucide e o tom em apresentação; nenhum dos dois é inferido de rótulo ou prioridade.
- `topAccounts`: coleção de cinco contas ordenadas por armazenamento utilizado publicado, com `label`, `department`, `usedBytes` e `utilizationPercent` anulável. A UI apresenta `Usuário | Departamento | Armazenamento | % da Cota`, sem calcular tendência.
- `departmentDistribution`, os resumos, `risks` e `recommendations` são coleções ordenáveis, possivelmente vazias, com disponibilidade independente. Itens que permitem investigação publicam `investigation` com `tab` de destino e filtros serializáveis já aplicáveis nessa aba; sem esse objeto, o item é somente leitura.
- `healthScore`: nota de `0` a `100` composta por dimensões com peso, pontuação, disponibilidade, evidência, `asOf` e cobertura. Permanece publicada e com cenários de fixture para a futura integração backend, mas não é materializada no Dashboard Executivo atual.
- Cada bloco de investigação publica `coverage`, `asOf` e `availability` próprios. Uma falha, restrição ou ausência em um bloco não altera os dados nem a disponibilidade dos outros.

## Comportamento observável

- Período altera somente blocos compatíveis com recorte temporal; a tela informa o recorte aplicado e a data de atualização publicada.
- Selecionar um ranking, risco ou recomendação com `investigation` navega à aba indicada, com os filtros desse objeto já aplicados. A navegação é investigativa, não executa correção nem comando mutável.
- Coleção vazia é diferente de `unavailable`; blocos sem dados confiáveis mostram estado de disponibilidade.
- A evolução de armazenamento apresenta valores em TB, com uma casa decimal, e usa escala de quatro marcas iniciada em zero. A escala é calculada separadamente por eixo a partir do maior valor numérico finito publicado; a unidade é responsabilidade do consumidor, não da regra de escala.

## Avaliação executável do Health Score — default-v1

`R(bons,elegíveis)=100×bons/elegíveis`; observação/classificação ausente não
entra em bons. População desconhecida contribui zero com disponibilidade
própria, sem inferir fato adverso. Pesos fixos no denominador 100, sem
redistribuição. Aplicam-se os fatores/ausências/precisão do Security Score,
incluindo 100 somente para ausência factual de exposição/casos e zero para
ausência de população avaliável de clientes/contas/arquivos de classificação.

| Dimensão / peso | Pontuação de 0 a 100 |
| --- | --- |
| Provisionamento / 10 | `R(contas humanas habilitadas/licenciadas com OneDrive confirmado, contas humanas habilitadas/licenciadas elegíveis)` |
| Armazenamento saudável / 15 | `R(contas com utilização factual <80%, contas OneDrive elegíveis com uso/cota a avaliar)` |
| Compartilhamento seguro / 20 | `R(arquivos compartilhados classificados sem risco alto/crítico, arquivos compartilhados elegíveis)` |
| Ausência de anônimos críticos / 15 | `R(links anônimos avaliados sem regra crítica satisfeita, links anônimos elegíveis)` |
| Retenção de desligados / 10 | Fator de casos técnicos com responsável/plano aprovado da dimensão Retenção do Security Score |
| Proteção/classificação / 10 | Pontuação DLP/classificação do Security Score |
| Sincronização saudável / 10 | `R(clientes com fotografia de saúde íntegra e zero erros reportados em 30 dias, clientes elegíveis)`; sem fonte de erro não afirmar zero |
| Governança de contas / 5 | `R(contas habilitadas/licenciadas com atividade factual <=90 dias, contas OneDrive elegíveis)` |
| Auditoria/monitoramento / 5 | Pontuação Auditoria do Security Score |

Calcular a soma `Σ(peso × pontuação / 100)` com precisão completa e publicar
a uma casa decimal, half-up. Comparação requer regra/versão/população
comparáveis. O valor 75/100 do fixture é exemplo, não resultado obrigatório.
Esses critérios aprovados em 2026-10-14 não inserem card na UI atual.

## State Matrix

| Cenário | Runtime state | Dados permitidos | Resultado observável |
| --- | --- | --- | --- |
| Snapshot completo | available | métricas e coleções publicadas | dashboard analítico navegável |
| Dimensão não coletada | partial | score preservado para integração futura | não materializado no Dashboard Executivo atual |
| Sem publicação | unavailable | nenhum valor substituto | painel de indisponibilidade no bloco |
| Publicação antiga | stale | último snapshot e data | aviso de frescor |
