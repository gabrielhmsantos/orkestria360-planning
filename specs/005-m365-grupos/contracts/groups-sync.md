# Contract: Sincronização de Grupos Microsoft 365

## Scope

Contrato interno da sincronização read-only do tenant Contoso. A coleta ocorre
somente no backend e nunca altera grupos, membros, proprietários, licenças ou
ciclo de vida no provedor.

## Inputs and Outputs

| Entrada | Resultado esperado |
|---|---|
| tenant configurado e lock obtido | uma execução `GroupSyncRun` e geração `staging` |
| catálogo e delta de grupos | `DirectoryGroup` atual e cursor opaco protegido |
| relações, regras, licença, ciclo, atividade e auditoria | dados/snapshots/eventos ou `GroupSourceState` por fonte |
| coleta íntegra | promoção atômica da geração para `published` |
| coleta parcial ou falha | diagnóstico de fonte e última geração publicada preservada |

## Source Semantics

| Condição | Normalização |
|---|---|
| resposta vazia válida | `empty_valid_response`, sem concluir zero global |
| filtro sem resultado | `no_matches`, sem indisponibilidade |
| 403, licença ou visibilidade insuficiente | `restricted` com condição sanitizada |
| 404 de recurso/associação | dado não disponível para o recurso, não coleção vazia |
| 429/5xx ou falha de redirect/CSV | falha transitória; respeitar tentativa posterior e preservar fotografia publicada |
| cursor delta inválido/expirado | reconciliação completa idempotente antes de novo cursor |

## Boundaries

- Relatório de atividade pode redirecionar para CSV temporário; a URL e o
  conteúdo bruto não são registrados como diagnóstico.
- Custo comercial, revisão de acesso executável e qualquer workflow de escrita
  estão fora deste contrato. O score de governança usa as evidências
  sincronizadas; evidência ausente vale zero na dimensão correspondente.
- Cada estado indica fonte, cobertura e frescor; não há status global que
  esconda a disponibilidade independente das superfícies.
