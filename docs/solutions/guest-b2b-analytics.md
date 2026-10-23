# Análises B2B de convidados

## Contrato persistido

`externalUserState` e `externalUserStateChangeDateTime` devem entrar tanto no `$select` completo de `/users` quanto no delta. Eles ficam no `IdentitySnapshot.attributes`, que já é criptografado; não há coluna ou migration adicional.

## Disponibilidade correta

O donut de status exige que cada snapshot Guest corrente contenha a chave `externalUserState` e que atividade esteja disponível. Snapshots antigos sem essa chave são `restricted`; `null` é um valor Graph válido e não significa aceite.

## Regras de projeção

- Ordem exclusiva: desabilitado → aceite pendente → nunca usou → inativo crítico → ativo.
- Removidos Guest em 30 dias formam uma fatia à parte do donut.
- A tendência usa 13 semanas; semanas sem geração disponível são zero, mas fonte de atividade corrente restrita bloqueia todo o painel.
- Domínio vem somente de `DirectoryIdentity.mail` válido. Nunca extrair de UPN B2B `#EXT#`; usar `Não informado` e agregar após Top 10.
