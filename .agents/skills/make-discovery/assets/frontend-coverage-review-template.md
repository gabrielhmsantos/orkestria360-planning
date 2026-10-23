# Cobertura de frontend — <domínio> / <módulo>

> Relatório vivo da etapa frontend. Atualize-o ao criar ou alterar uma
> superfície; não o use como estado de runtime nem como autorização para criar
> collectors ou integrações.

## Handoff do módulo para backend

- **Gate:** `<backend_ready/blocked>`
- **Regra:** o módulo fica `backend_ready` somente quando todas as superfícies
  `data-backed` estiverem `frontend_done`. Superfícies `not_data_backed` são
  `not_applicable` e não bloqueiam.
- **Bloqueadores:** `<superfícies ainda fora de frontend_done, ou nenhum>`
- **Próximo passo:** `<implementação, homologação ou início do discovery backend>`

## Categorias

| Categoria | Significado |
| --- | --- |
| `source_required` | Falta identificar ou validar fonte/mapping suficiente para representar factual e seguramente a superfície. |
| `decision_required` | Falta decisão de produto, contrato, política ou workflow que impede fixture ou comportamento visual conforme. |
| `fixture_ready` | Fonte e mapping sustentam o contrato, mas fixture do Orkestria, blueprint ou UI ainda não estão completos. |
| `mutation_approved` | Ação externa tem fonte e regra de produto aprovadas; a UI ainda usa fixture sintética e a futura operação exige controles explícitos. |
| `frontend_implementation_ready` | Contrato, shape, mapping, fixtures e blueprint estão validados; a UI pode ser implementada. |
| `frontend_done` | A UI foi implementada e homologada visualmente. |
| `not_applicable` | A superfície não é `data-backed`; não bloqueia o handoff do módulo. |

`mutation_approved` pode qualificar uma superfície cuja categoria principal é
outra. Não transforme ausência de fonte ou fixture em dado de runtime.

## Regra de agregação

Registre cada bloco material em sua própria linha, repetindo a superfície quando
necessário. A seção agregada sempre usa o menor nível encontrado entre seus
blocos:

1. `source_required` ou `decision_required`;
2. `fixture_ready`;
3. `frontend_implementation_ready`;
4. `frontend_done`.

Se dois status diferentes ocuparem o menor nível, registre ambos no agregado;
`mutation_approved` é somente qualificador e `not_applicable` só se aplica
quando a superfície não tiver bloco `data-backed`.

## Matriz por bloco

| Superfície | Bloco material | Dados | Categoria | Qualificadores | Evidência ou bloqueador | Próximo passo |
| --- | --- | --- | --- | --- | --- | --- |
| `<aba ou superfície>` | `<bloco>` | `<data-backed/not_data_backed>` | `<categoria>` | `<mutation_approved ou —>` | `<link ou resumo rastreável>` | `<ação>` |

## Agregado por superfície

| Superfície | Status dos blocos | Categoria consolidada | Bloqueador ou evidência dominante | Próximo passo |
| --- | --- | --- | --- | --- |
| `<aba ou superfície>` | `<ex.: 3 × frontend_implementation_ready; 2 × fixture_ready>` | `<menor categoria>` | `<resumo>` | `<ação>` |

## Situação consolidada

- **Prontas para implementação frontend:** `<superfícies em frontend_implementation_ready>`
- **Implementadas e homologadas:** `<superfícies em frontend_done>`
- **Pendências de frontend:** `<superfícies e respectiva categoria>`

## Limites

- Este relatório não declara `available`, `unavailable`, `partial` ou qualquer
  estado de runtime.
- Evidência técnica necessária às fixtures deve permanecer rastreável nos
  artefatos de fonte e contrato do discovery.
