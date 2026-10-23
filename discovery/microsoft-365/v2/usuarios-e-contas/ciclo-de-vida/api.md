# APIs — Ciclo de Vida

Não há endpoint Graph normativo de workflow nesta V2. Solicitação, aprovação, tarefa, responsável, evidência, prazo e resultado são entidades internas do Orkestria e seu corpo será definido pelo contrato interno da futura Spec.

As evidências Graph são somente leitura: `GET /users` retorna envelope OData `value[]` de `User` (estado, tipo, criação, licenças e atividade conforme seleção) e `GET /auditLogs/directoryAudits` retorna `value[]` de `DirectoryAudit` (atividade, ator, alvo, resultado e data). Os schemas completos estão em [Diretório de Usuários](../diretorio-de-usuarios/api.md) e [Histórico e Auditoria](../historico-e-auditoria/api.md).

Criação, bloqueio, revogação e exclusão não têm request body aprovado nesta V2.
