# Discovery — <domínio> / <módulo>

## Objetivo

<decisão ou resultado que o módulo deve viabilizar>

## Escopo e superfícies

- <superfície ou subpágina e seu papel>

## Limites da versão

- <capacidade fora do recorte, fonte ausente ou ação futura>

## Princípios e dependências

- <regra transversal, disponibilidade ou dependência de produto relevante>

## Decisões transversais

- <decisão confirmada e fonte>

## Prontidão

| Superfície | Dados | Produto | Contrato | UI Blueprint | Agregado frontend | Cobertura backend |
| --- | --- | --- | --- | --- | --- | --- |
| `<superfície>` | `<data-backed/not_data_backed>` | `<estado de evidência>` | `<estado de evidência>` | `<conceitual/reconciliado/pendente/not_applicable>` | `<menor categoria dos blocos no frontend-coverage-review.md>` | `<não iniciada ou categoria do backend-coverage-review.md>` |

- [Cobertura de frontend](frontend-coverage-review.md): `<estado agregado e próximo bloqueador>`
- **Cobertura de backend:** `<não iniciada ou bloqueada pelo handoff>`; após sua
  criação, use [backend-coverage-review.md](backend-coverage-review.md) para o
  estado agregado.

### Handoff para backend

- **Gate do módulo:** `<backend_ready/blocked>`.
- **Regra:** o módulo só fica `backend_ready` quando toda superfície
  `data-backed` estiver `frontend_done`; `not_applicable` não bloqueia.
- **Bloqueadores:** `<superfícies que ainda não estão frontend_done>`.

### Próximo passo

- `<track e ação que reduzem o bloqueador sem redefinir produto ou runtime>`

Os estados desta seção são prontidão de discovery. Não os use como estados de
runtime da capacidade.
