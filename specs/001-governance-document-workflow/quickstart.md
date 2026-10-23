# Quickstart: Workflow Documental de Governança

## Goal

Validar de ponta a ponta o novo fluxo documental dos 8 tópicos de governança no app Laravel + Inertia sem depender de integrações externas.

## Prerequisites

- Dependências instaladas em `orkestria360/`
- Ambiente Laravel configurado
- Banco local disponível para migrations e testes

## Setup

```bash
cd orkestria360
composer install
npm install
php artisan migrate
```

## Validation Scenarios

### 1. Overview autenticado exibe os 8 tópicos persistidos

```bash
cd orkestria360
php artisan test tests/Feature/Governance/GovernanceOverviewTest.php tests/Feature/GovernancePageTest.php
```

**Expected outcome**:

- `/governance` responde autenticado
- payload Inertia contém `score`, `summaryCards`, `documentRows` com 8 tópicos
- estados incluem `Pendente`, `Em andamento`, `Em análise` e `Concluído` conforme seed/fixtures

### 2. Usuário operacional inicia um tópico

Fluxo:

1. Acessar o detalhe de um tópico ainda não iniciado
2. Salvar `Responsável` e `Vigência` com uma das opções permitidas
3. Confirmar mudança para status `Pendente`

**Expected outcome**:

- formulário aceita apenas vigências `3/6/9/12/24/36/48/60`
- overview reflete responsável, vigência e ação principal correta

### 3. Download do template altera o status

Fluxo:

1. Com metadados preenchidos, acionar download do template
2. Confirmar registro de download

**Expected outcome**:

- arquivo do template é retornado
- status do tópico muda para `Em andamento`

### 4. Upload do documento envia para análise

Fluxo:

1. Enviar documento válido após download do template
2. Visualizar o documento vigente no detalhe

**Expected outcome**:

- upload é persistido
- status muda para `Em análise`
- overview mostra data do último envio

### 5. Aprovação administrativa conclui o tópico e inicia vigência

Fluxo:

1. Autenticar como admin
2. Aprovar o tópico com pontuação inteira entre 0 e 100

**Expected outcome**:

- status muda para `Concluído`
- `validity_starts_at` passa a contar da aprovação
- score do módulo é recalculado no overview

### 6. Reenvio após conclusão retorna para análise

Fluxo:

1. Em um tópico concluído, enviar novo documento

**Expected outcome**:

- documento vigente é substituído
- status volta para `Em análise`
- aprovação administrativa anterior deixa de representar a versão vigente

## Recommended Verification Command

```bash
cd orkestria360
composer test
```

## Storage Notes

- Os templates oficiais são armazenados no disco `local` do Laravel em `storage/app/private/governance/templates/`
- Se um template ainda não existir no disco, o app cria um arquivo markdown base na primeira tentativa de download
- Os documentos enviados ficam em `storage/app/private/governance/documents/{slug-do-topico}/`
- Para renovar o catálogo fixo dos 8 tópicos ou seus caminhos de template, rode o seeder `php artisan db:seed --class=GovernanceTopicSeeder`

## Execution Notes

- Validação automatizada executada em `2026-06-26` com `composer test`
- Suíte específica da feature: `php artisan test tests/Feature/Governance tests/Feature/GovernancePageTest.php`

## Related Artifacts

- [Plan](./plan.md)
- [Data Model](./data-model.md)
- [Contract](./contracts/governance-document-workflow.md)
