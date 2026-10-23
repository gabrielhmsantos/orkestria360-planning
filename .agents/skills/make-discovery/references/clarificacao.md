# Clarificação de regras para discovery

Use esta referência após ler as fontes acessíveis e antes de gravar decisões.
Classifique a lacuna antes de decidir se ela deve chegar ao usuário. O objetivo é
reduzir incerteza que muda produto, UX ou contrato, sem transformar discovery em
entrevista extensa nem transferir investigação técnica ao sponsor.

## Classificação da lacuna

| Classe | Use quando | Tratamento padrão |
| --- | --- | --- |
| `PRODUCT` | altera outcome, regra de negócio, capacidade ou limite de versão | clarificar se a evidência não decidir |
| `UI` | altera composição essencial, interação, navegação ou feedback observável | clarificar se material |
| `CONTRACT` | altera significado, cálculo, tipo, nulabilidade, unidade, estado ou resultado observável | clarificar se a evidência não decidir |
| `BACKEND_FEASIBILITY` | envolve provider, endpoint, permission, licença, paginação, retry, persistência, collector ou sync | investigar no track backend; não perguntar por padrão |

Uma investigação `BACKEND_FEASIBILITY` que revelar uma decisão real de produto
deve voltar classificada como `PRODUCT`, `UI` ou `CONTRACT`, com a evidência que
explica a mudança.

## Triagem

| Evidência | Classe e tratamento |
| --- | --- |
| Fórmula, operação e operandos explícitos | `CONTRACT` `confirmada`: documentar unidade, fonte e tratamento de entrada ausente. |
| Resultado que decorre diretamente de definição explícita | `CONTRACT` `derivação direta`: documentar derivação e fonte. |
| “Sugestão”, “exemplo”, “recomendação”, “poderá” ou “configurável” | `PRODUCT`, `UI` ou `CONTRACT`: clarificar se afetar comportamento; caso contrário, pendência. |
| Falta de dado, autorização, consentimento ou integração | `BACKEND_FEASIBILITY`: investigar fonte; não pedir ao usuário que a invente. Só declare runtime `unavailable` se esse comportamento já estiver aprovado. |
| Workflow futuro não autorizado | `PRODUCT` ou `UI`: `coming_soon` apenas para capacidade operacional fora do recorte. |
| Fontes conflitantes ou ausência de regra material | classificar pelo efeito; clarificar apenas se for produto, UI ou contrato material. |

## Quando perguntar

Pergunte somente se a decisão muda outcome, cálculo de produto, significado do
contrato, card/estado observável, interação, UX crítica ou workflow aprovado.
Não pergunte por detalhe cosmético, valor ilustrativo, endpoint, API version,
permission, retry, paginação, collector, tabela, persistência, normalização ou
topologia de sync que possam ser investigados tecnicamente. Priorize por impacto
× incerteza e limite a cinco perguntas na sessão.

## Limites de evidência das opções

Construa cada opção apenas com campos, regras, fontes ou hipóteses já rastreados. Antes da tabela, informe quais fontes e campos sustentam a recomendação e quais não foram definidos.

Para cálculo composto, faça cada opção fechar a decisão inteira. Detalhe:

- fatores incluídos e excluídos;
- fonte de cada fator (campo, dado interno ou decisão ainda ausente);
- escala/normalização de cada fator, incluindo faixas e arredondamento;
- comportamento para dado ausente, empate, valor fora da faixa, denominador zero e conjunto sem variação;
- se o resultado é numérico, ordenação explicável ou apenas apresentação de sinais separados.

Não ofereça uma alternativa que diga ou implique “definir depois”, “configurar depois”, “matriz pendente” ou equivalente. Agrupe todos os subparâmetros necessários na própria opção. Quando a fonte não definir uma política necessária, declare-a como **proposta do agente**, mostre como ela decorre dos campos/objetivos documentados e deixe sua aceitação explícita transformar a proposta em decisão do usuário — nunca em decisão retrospectiva do sponsor.

Não proponha fonte nova somente por ela parecer útil. Primeiro valide documentação
oficial, permissão, resposta/paginação e aderência ao módulo no track backend;
registre a conclusão em `fontes-e-viabilidade.md`. Até isso, a fonte é uma
lacuna, não uma alternativa selecionável.

## Formato da pergunta

Faça uma pergunta por vez, com exatamente três opções mutuamente exclusivas. Nunca apresente opções sem antes exibir o ponto de origem da clarificação: o trecho/regra da fonte, o que permanece indefinido e o efeito prático de não decidir. Comece então pela recomendação, baseada em fontes e contexto, em uma ou duas frases.

```markdown
**Ponto a clarificar:** <regra/trecho observado e fonte>.

**Por que perguntar agora:** <lacuna concreta e efeito em cálculo, card, contrato ou comportamento>.

**Evidência disponível:** <fontes/campos já rastreados>.

**Lacuna que as opções resolvem:** <fontes, escalas, normalização ou regra ausente>.

**Recomendação: B — <rótulo>.** <por que as referências favorecem esta escolha>.

| Opção | Decisão |
| --- | --- |
| A | <pacote fechado: fatores, fontes, fórmula/ordem, normalização, ausências, empate e efeito> |
| B | <pacote fechado: fatores, fontes, fórmula/ordem, normalização, ausências, empate e efeito> |
| C | <pacote fechado: fatores, fontes, fórmula/ordem, normalização, ausências, empate e efeito> |

Responda `A`, `B` ou `C`; diga `sim` para aceitar a recomendação; ou forneça outra resposta curta (até cinco palavras).
```

Valide a resposta antes de continuar. `sim`, `recomendada` ou `sugerida` aceita a recomendação atual. Se a resposta não mapear a uma opção nem couber na resposta curta, peça desambiguação sem consumir nova pergunta.

## Registro

Depois de cada resposta aceita, atualize imediatamente o artefato mais próximo:

- fórmula/cálculo → `decisoes.md` e `contratos.md`, com expressão, operandos, unidade, arredondamento quando decidido e estado de entrada ausente;
- comportamento/estado → `design-sugerido.md` e `expectativas-do-sponsor.md`;
- regra transversal → `README.md` e, quando existir, `models/`.

Uma conclusão `BACKEND_FEASIBILITY` que não exija decisão do usuário é registrada
em `fontes-e-viabilidade.md`, com link para `api.md`/`openapi.yaml` quando
existirem. Não replique estratégia de fonte, sync ou persistência física em
`contratos.md`.

Anote no `decisoes.md` da subpágina afetada — ou no `README.md` do módulo quando transversal: `Clarificação — Q: <pergunta> → A: <opção/texto> (origem: usuário; data: AAAA-MM-DD).` Para cálculo ou contrato, replique a regra executável no `contratos.md`; para regra transversal, também no modelo quando aplicável. Remova a alternativa ambígua substituída para não deixar decisão contraditória.

Se o usuário disser para não decidir, parar ou ignorar a pergunta, registre a pendência, seu impacto e condição de decisão. Nunca promova uma recomendação não aceita a decisão do sponsor.
