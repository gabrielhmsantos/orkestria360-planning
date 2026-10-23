# Cobertura de backend — <domínio> / <módulo>

> Crie este relatório somente após o `frontend-coverage-review.md` registrar o
> módulo como `backend_ready`. Ele controla a descoberta técnica para a futura
> implementação backend; não implementa collectors, persistência ou runtime.

## Prontidão técnica do módulo

- **Gate:** `<backend_implementation_ready/blocked>`
- **Regra:** o módulo fica `backend_implementation_ready` somente quando todas
  as superfícies `data-backed` estiverem nessa categoria. `not_applicable` não
  bloqueia.
- **Bloqueadores:** `<superfícies e categorias pendentes, ou nenhum>`
- **Próximo passo:** `<validação, mapping, estratégia ou implementação backend>`

## Categorias

| Categoria | Significado |
| --- | --- |
| `contract_required` | O contrato semântico não permite identificar os fatos que o backend deve satisfazer. |
| `source_required` | Ainda falta identificar fonte canônica ou estratégia de fornecimento para fato obrigatório. |
| `validation_required` | Há candidato técnico, mas documentação oficial, contrato externo ou validação aplicável ainda não o comprovam. |
| `mapping_required` | Fonte validada, mas a normalização fonte/projeção → contrato Orkestria ainda não está documentada. |
| `strategy_required` | Fonte e mapping existem, mas reuso/coleta, projeção, histórico, persistência ou tratamento de falha ainda não foram decididos. |
| `decision_required` | Falta decisão material de produto, contrato, escopo ou operação para fechar a estratégia. |
| `backend_implementation_ready` | Contrato, fonte, validação, mapping, estratégia e falhas estão definidos para iniciar implementação backend. |
| `not_applicable` | A superfície não requer backend; não bloqueia o gate técnico do módulo. |

## Matriz por superfície

| Superfície | Dados | Categoria | Fato ou capacidade | Evidência ou bloqueador | Próximo passo |
| --- | --- | --- | --- | --- | --- |
| `<aba ou superfície>` | `<data-backed/not_data_backed>` | `<categoria>` | `<fatos cobertos>` | `<link ou resumo rastreável>` | `<ação>` |

## Situação consolidada

- **Prontas para implementação backend:** `<superfícies em backend_implementation_ready>`
- **Pendências técnicas:** `<superfícies e respectiva categoria>`

## Limites

- Este relatório não redefine produto, contrato visual ou estados de runtime.
- Permissões, licenças, consentimento e acesso real de customer são
  pré-requisitos da futura operação, não evidência de cobertura individual.
