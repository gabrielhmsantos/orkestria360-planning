# Quickstart: Validar Syncs Microsoft 365 Otimizados

## Pré-requisitos

1. Dependências PHP e JavaScript instaladas em `orkestria360/`.
2. Ambiente de teste configurado e migrations aplicadas.
3. Credenciais Graph disponíveis apenas para validação manual controlada; a suíte automatizada usa dublês do contrato Graph.

## Cenários automatizados

Na raiz da aplicação:

```bash
cd orkestria360
php artisan test tests/Feature/UsersAccounts/UsersAccountsSyncTest.php
php artisan test tests/Feature/Groups/GroupsSyncTest.php
php artisan test tests/Feature/LicensingSyncTest.php
php artisan test tests/Feature/UsersAccounts/GraphDataClientTest.php
php artisan test tests/Feature/Microsoft365/CoordinatedSyncTest.php
php artisan test tests/Feature/Microsoft365/CoordinatedSyncScheduleTest.php
composer ci:check
composer test
```

Verifique os cenários definidos em [data-model.md](./data-model.md) e nos contratos de [comando](./contracts/sync-command.md) e [estado de fonte](./contracts/source-state.md):

1. Delta de usuários/grupos aplica alteração e tombstone sem leitura completa em ciclo válido.
2. O mesmo snapshot de identidade alimenta Licenciamento sem nova coleta de usuários.
3. Directory audits e sign-ins percorrem todas as páginas da janela, deduplicam por identificador externo e avançam a posição somente após êxito. Se `directoryAudits` rejeitar a janela inicial de 180 dias, o coletor repete uma única vez desde a menor data aceita pelo Graph e a persiste para os próximos ciclos.
4. Falha de fonte primária pula dependentes e preserva suas gerações anteriores; etapas independentes ainda podem publicar.
5. Relações de grupos consultam somente IDs alterados e a reconciliação semanal recupera remoções.
6. Retenção de 180 dias e mudança de política não interrompem ciclo nem apagam janela pendente.
7. Estados de cobertura, fonte defasada, fonte restrita e etapa pulada aparecem corretamente nas superfícies de Usuários, Grupos e Licenciamento; a atividade de identidades é derivada de `auditLogs/signIns`, não de `signInActivity` em `/users/delta`.

## Validação manual controlada

Após implementar o comando, execute:

```bash
php artisan app:sync-microsoft365 --force
```

Confirme no resultado do comando que cada etapa mostra status, duração, páginas, itens, itens persistidos, tentativas, espera de retry e, quando aplicável, motivo sanitizado. A cobertura e o frescor ficam registrados nos source states. Execute novamente sem mudanças e confirme que as coleções canônicas compartilhadas não são lidas duas vezes. Para uma reconciliação excepcional, use:

```bash
php artisan app:sync-microsoft365 --full-reconciliation
```

## Critérios de aprovação

- Não há HTTP em transação de promoção.
- O lock global por tenant impede sobreposição de ciclos coordenados.
- Não há duplicidade de evento após reprocessar uma janela sobreposta.
- Todas as verificações do `composer test` passam.

## Última validação registrada

Em 11 de agosto de 2026, os cenários direcionados deste quickstart passaram com **24 testes e 102 asserções**. Os gates `composer ci:check` e `composer test` passaram com **198 testes aprovados**, **4 pulados** e **2.693 asserções**, além de Pint e PHPStan sem erros. Uma execução controlada no tenant real concluiu as 13 etapas: persistiu `earliest_available_at = 2026-07-11` após o fallback de `directoryAudits` e projetou 7 sinais de atividade a partir dos sign-ins canônicos.
