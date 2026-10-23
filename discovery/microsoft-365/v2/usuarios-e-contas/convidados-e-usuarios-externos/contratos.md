# Convidados e Usuários Externos — Contratos

- Dados: usuários Guest, estado externo, criação, atividade, empresa/domínio, licença, risco e patrocinador quando disponível.
- Fonte: `/users` e dados internos Orkestria; informações de aplicativo e revisão requerem logs/workflow adicional.
- A coleta completa e delta solicita `externalUserState` e `externalUserStateChangeDateTime`; os valores são preservados no atributo criptografado da geração. `PendingAcceptance`, `Accepted` e `null` são dados distintos: `null` não é convertido em aceite.
- Os sete KPIs usam todo o inventário Guest da geração publicada e comparam com a geração elegível do mês anterior. Sem base comparável, o contrato devolve comparação nula.
- Status analítico é mutuamente exclusivo, nesta ordem: desabilitado, aguardando aceite, nunca acessou, inatividade crítica configurada e ativo. Removidos Guest dos últimos 30 dias são uma fatia adicional do recorte.
- Domínios vêm somente de `mail` válido; UPN B2B com `#EXT#` não é reconstituído. Ausências são `Não informado` e o excedente ao Top 10 é agregado.
