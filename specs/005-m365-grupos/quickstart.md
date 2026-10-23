# Quickstart: Grupos Microsoft 365 V2

## Prerequisites

1. Em `orkestria360/`, configurar as credenciais app-only já usadas pelo módulo
   Microsoft 365 para o tenant Contoso. A feature é leitura somente.
2. Conceder somente as permissões documentadas nos contratos de discovery para
   as fontes que serão validadas. Fonte sem permissão ou licença deve aparecer
   como `restricted`, não como zero.
3. Executar migrations e a sincronização de Grupos quando os artefatos de
   implementação existirem.

```bash
cd orkestria360
php artisan migrate
php artisan app:sync-microsoft365-groups --force
```

## Validation Scenarios

1. Autentique-se com qualquer usuário criado na aplicação e abra
   `/microsoft-365/grupos`. Confirme que não existe diferenciação por perfil e
   que o Dashboard mostra origem, frescor e estado dos blocos.
2. Abra cada uma das oito superfícies. Para uma fonte disponível, confira
   conteúdo; para uma restrita ou indisponível, confira título, condição e
   ausência de conclusão indevida.
3. No Diretório, aplique busca/filtros/paginação, abra um grupo e confirme que a
   URL preserva o recorte. Repita para filtros no Histórico.
4. Confirme que grupo de segurança sem telemetria direta não é marcado como
   inativo e que custo sem fonte corporativa não exibe valor.
5. Confirme que exportar, criar, editar, renovar, arquivar, excluir, simular e
   revisar são somente intenções `coming_soon`, sem alteração externa.
6. Rode os testes e os gates:

```bash
php artisan test tests/Feature/Groups
composer ci:check
composer test
```

## Expected Evidence

- [Contrato Inertia](./contracts/groups-inertia.md) para abas, rotas e props.
- [Contrato de sincronização](./contracts/groups-sync.md) para dados, falhas e
  promoção de geração.
- [Modelo de dados](./data-model.md) para entidades e transições.
