# Contas e Armazenamento — Contrato semântico inicial

## Shape e semântica

- `summary`: snapshot independente do inventário paginado, com os sete KPIs publicados como `{ value, comparison: { previousValue, periodDays } }`. A comparação é sempre D30 nesta superfície; `previousValue` nulo não autoriza percentual. `previousValue: 0` é baseline factual: em qualquer unidade, a variação é normalizada como `valor atual × 100%` (`0→1 = 100%`, `0→2 = 200%`, `0→0 = 0%`).
- `accounts`: coleção paginada de `account` com identificador sintético/estável, nome exibível, identificador de login, departamento opcional, situação da pessoa, provisionamento, última atividade opcional, contagens de arquivos, capacidade usada/alocada, utilização calculada, nível de utilização (`normal`, `attention`, `high` ou `critical`), licença, faixa de atividade, sinal de compartilhamento externo, risco e situação de retenção opcional.
- `filters`: valores selecionáveis e seus estados de disponibilidade; busca por pessoa ou departamento. O catálogo de nível usa Normal (`< 80%`), Atenção (`80–<90%`), Alto (`90–<95%`) e Crítico (`≥95%`); o catálogo de licença publica E3 e E5 quando há associação por conta.
- O filtro `activeLast30Days` usa `lastActivityAt` entre `accounts.availability.asOf - 30 dias` e a âncora, inclusive; `inactiveOver90Days` exige data anterior a `asOf - 90 dias`. Sem data ou âncora publicada, esses filtros não afirmam correspondência. `activityBand` continua sendo a origem do rótulo Status da Conta, não do cálculo temporal.
- `storageTrend`: pontos mensais por `accountId`, período, `usedBytes` e `allocatedBytes`. A UI soma exclusivamente os pontos das contas do recorte; se faltar uso para uma conta/período, declara que a evolução não foi publicada; se faltar somente capacidade em qualquer ponto, mostra apenas a série utilizada e declara a série alocada ausente, sem preenchimento.
- `capacityForecast`: por conta crítica, contém capacidade restante factual em bytes (inclusive zero ou negativa), `historicalMonths` de 2 a 6, crescimento médio diário, dias estimados inteiros não negativos, data estimada e confiança `low` (2–3 snapshots), `medium` (4–5) ou `high` (6). Aplicam-se a fórmula e as condições de publicação abaixo.
- `accountDetail`: agregado do mesmo `account`, dividido nas áreas de contexto descritas no produto. A tabela só expõe o gatilho local de leitura quando esse agregado está publicado; não há ação administrativa.

## Fronteiras da distribuição de utilização

A distribuição conta as contas do recorte com utilização factual publicada,
calculada sem arredondamento por `u = 100 × usedBytes / allocatedBytes`, com
uso não negativo e alocação positiva. Uso/alocação ausentes, inválidos ou
alocação zero não recebem faixa. `asOf` é a referência factual das contas do
recorte; o relógio da visualização não altera a distribuição.

| Rótulo preservado | Intervalo efetivo de `u` |
| --- | --- |
| `0% a 50%` | `0 ≤ u ≤ 50` |
| `50% a 80%` | `50 < u < 80` |
| `80% a 95%` | `80 ≤ u ≤ 95` |
| `> 95%` | `u > 95`, inclusive acima de 100 |

Essas são faixas do donut, distintas dos níveis Normal/Atenção/Alto/Crítico:
80 pertence à terceira faixa e ao nível Atenção; 90 permanece na terceira e
passa ao nível Alto; 95 permanece na terceira e já tem nível Crítico. Cada
conta avaliável pertence a uma única faixa. Participação é
`100 × quantidade da faixa / contas com utilização avaliável no recorte`,
sem incluir desconhecidos no denominador. Se não houver contas avaliáveis,
não há divisão: quantidades/participações das faixas são zero sobre o conjunto
classificado vazio, preservando a cobertura para distinguir população vazia de
população com utilização não publicada. A projeção parcial mantém seu escopo;
não se apresenta como distribuição integral do tenant.

## Horizonte da previsão de esgotamento

Na janela aprovada de seis meses, usar de dois a seis snapshots mensais reais,
sem preencher meses ausentes. `historicalMonths` é a quantidade observada;
`g = (uso final − uso inicial) / dias efetivamente decorridos` em bytes/dia.
Os extremos precisam de datas factuais distintas e ordenadas. A capacidade
restante é `R = allocatedBytes − usedBytes` do último par factual da conta,
na mesma referência `asOf` que ancora a previsão. Preservar `R` assinado:
negativo informa excesso de uso e não é substituído por zero.

Com histórico suficiente, `g > 0`, uso inteiro não negativo, alocação inteira
positiva e âncora publicada:

- `estimatedDays = max(0, ceil(R / g))`;
- `estimatedDate = asOf + estimatedDays × 24 horas`;
- confiança `low` para 2–3 snapshots, `medium` para 4–5 e `high` para 6.

Com `R = 0` ou `R < 0`, o horizonte é zero e a data estimada é a própria
âncora factual. Esse resultado afirma esgotamento já observado na fotografia;
não estima retrospectivamente quando a conta cruzou a cota. A normalização
limita somente o horizonte futuro e preserva os operandos factuais.

Menos de dois snapshots, datas extremas ausentes/sem intervalo positivo,
uso/alocação/âncora ausentes ou inválidos, ou `g ≤ 0` mantêm a projeção nula,
inclusive quando o último uso já alcança a cota. Confiança e gates de
histórico não são elevados pelo esgotamento. Não substituir âncora factual
pelo horário atual nem publicar dias negativos.

## Comportamento observável

- `activeFileCount` significa atividade de arquivos na janela do relatório, D180 na fonte selecionada, explicitamente informada; não é contagem de itens existentes com status `active`. Armazenamento utilizado do relatório pode incluir versões/lixeira e mantém o universo do report. KPIs e séries não são reconstruídos a partir de páginas do inventário de conteúdo. *(Clarificação 5, inferência autorizada pelo usuário, 2026-10-14.)*

- Os KPIs usam exclusivamente o snapshot `summary`; filtros e paginação do inventário não recalculam nem alteram sua comparação D30.
- Busca e filtros alteram a coleção, donut de utilização, evolução, departamento e previsão; quando o inventário é parcial, tabela e contagem mostram somente a página publicada filtrada, com aviso de escopo, e a paginação permanece desabilitada. A ordem da tabela é a ordem publicada, sem controle de ordenação. A linha de análises segue `Contas por Nível de Utilização` → `Evolução do Armazenamento (Últimos 12 meses)` → `Distribuição por Departamento (Armazenamento Utilizado)` → `Previsão de Esgotamento (Contas Críticas)`. A previsão lista somente contas críticas (`≥95%`) com projeção completa nas colunas Usuário, % Utilização, Armazenamento Restante e Dias Estimados; ela usa a variante discreta `OperationalTable insight`, sem grades internas, e o CTA aplica o filtro Crítico, fecha o detalhe, volta à página 1 e move o foco para a tabela. Uma utilização, departamento, licença ou ponto histórico nulo não recebe classificação ou valor inventado. Colunas secundárias podem usar rolagem horizontal sem criar canvas vertical aninhado.
- A tabela é materializada em `OperationalSectionCard` com `OperationalTable` embutida. Exibe Usuário, UPN, Departamento, Status da Conta, Provisionado, Última Atividade, Armazenamento Utilizado, Armazenamento Alocado, % Utilização, Nível, Arquivos Totais, Arquivos Ativos, Compart. Externo, Risco e Ações. Retenção permanece tipada exclusivamente no detalhe inline. A paginação usa `Anterior`/`Próxima`, sem números, com 10 linhas no primeiro recorte do cenário `populated` e 2 no segundo.
- `activityBand` é apresentado como Status da Conta localizado (`Ativo`, `Baixa atividade`, `Inativo` ou `Crítica`). Provisionado, Nível e Risco são badges localizados; datas usam pt-BR; compartilhamento externo usa `Sim`, `Não` ou `Não publicado`. Valores nulos ou não reconhecidos não expõem enum técnico: recebem o estado neutro factual `Não publicado`.
- % Utilização mostra percentual e medidor de capacidade acessível. O medidor usa tom `success`, `warning` ou `critical` conforme o nível publicado; sem nível, permanece neutro e não inventa classificação. O ícone de reticências abre apenas um `accountDetail` publicado; nos demais casos fica desabilitado, nomeado e explica `Detalhe não publicado`.
- Selecionar uma conta revela o detalhe contextual na própria superfície; fechar restaura a lista e seus filtros.
- Utilização não é calculada quando capacidade alocada é nula ou zero; a UI explicita indisponibilidade do cálculo.

## State Matrix

| Cenário | Runtime state | Dados permitidos | Resultado observável |
| --- | --- | --- | --- |
| Inventário publicado | available | contas paginadas e análise | tabela, filtros e detalhe disponíveis |
| Sem resultados | available | coleção vazia | mensagem factual de nenhum resultado |
| Histórico insuficiente | partial | menos de dois snapshots, capacidade ausente ou crescimento não positivo | previsão informa ausência, sem estimativa |
| Base parcial | partial | 2–5 snapshots e crescimento positivo | previsão com base histórica e confiança `low` ou `medium` |
| Inventário indisponível | unavailable | nenhum dado inventado | painel no bloco afetado |
