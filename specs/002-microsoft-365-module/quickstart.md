# Quickstart: Módulo Microsoft 365

## Goal

Validar de ponta a ponta a overview executiva do módulo Microsoft 365, agora servida por backend Laravel com contrato Inertia estável e alimentada por **dados reais** do Microsoft Graph do tenant Contoso via SDK oficial PHP em modo app-only. Não existe mock: falhas transitórias do Graph são tratadas via cache/snapshot com indicador "Última att. em {tempo relativo}".

## Prerequisites

- Dependências instaladas em `orkestria360/` (incluindo `microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague` e `microsoft/kiota-http-guzzle`)
- Ambiente Laravel configurado
- Build frontend funcional
- Usuário autenticado disponível para os testes de navegação
- Credenciais do App Registration no Entra ID do tenant Contoso configuradas no ambiente (`MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET`)
- Permissões de aplicação concedidas com consentimento administrativo (`Reports.Read.All`, `ServiceHealth.Read.All`, `LicenseAssignment.Read.All`, leitura ampla de diretório, `SecurityEvents.Read.All`)

## Setup

```bash
cd orkestria360
composer install
npm install
```

## Validation Scenarios

### 1. Overview autenticada responde pelo controller dedicado

```bash
cd orkestria360
php artisan test tests/Feature/Microsoft365
```

**Expected outcome**:

- `/microsoft-365` responde para usuário autenticado
- `/microsoft-365` continua indisponível para requisições não autenticadas
- a página é servida por payload Inertia estável, não por dados inline hardcoded na rota
- o contrato principal da overview está presente na resposta
- os blocos estruturados exibem `source: graph-*` (dados reais do Graph) e carregam `lastUpdatedAt` + `fresh`

### 2. Payload contém todos os blocos executivos esperados com dados reais

Fluxo:

1. Autenticar no dashboard
2. Acessar `/microsoft-365`
3. Inspecionar a resposta Inertia e a renderização da página

**Expected outcome**:

- `summaryCards`, `secureScore`, `serviceStatus`, `licenseDistribution`, `serviceUsage30d`, `recommendations`, `tenantHighlights`, `recentActivity` e `nextStep` aparecem no payload
- `summaryCards`, `secureScore`, `serviceStatus`, `licenseDistribution`, `serviceUsage30d` e `recommendations` refletem dados reais do tenant Contoso lidos do Microsoft Graph
- o card `services` em `summaryCards` representa a quantidade fixa de serviços monitorados na overview, derivada do catálogo monitorado reconciliado com `serviceStatus`, e não do report de adoção 30d
- a ordem e a composição visual da overview permanecem coerentes com a experiência atual

### 3. Blocos com falha transitória do Graph servem cache/snapshot com indicador "Última att."

Fluxo:

1. Simular uma falha transitória do Graph (timeout/429/5xx) em um bloco que já tem snapshot cacheado
2. Simular `recentActivity` e `tenantHighlights` como editoriais ancorados nos sinais reais
3. Abrir a overview

**Expected outcome**:

- a página continua íntegra mesmo quando um bloco Graph falha
- o bloco afetado é servido do cache/snapshot com `fresh: false` e `lastUpdatedAt` preenchido
- a UI exibe "Última att. em {tempo relativo}" no bloco afetado, de forma visível
- os demais blocos permanecem intactos e `fresh: true`
- se não houver snapshot cacheado, o bloco é normalizado para `empty`/`informational` (sem mock)

### 4. Contrato permanece rastreável para os endpoints Graph reais

Fluxo:

1. Revisar o contrato em [contracts/microsoft-365-overview.md](./contracts/microsoft-365-overview.md)
2. Revisar o data model em [data-model.md](./data-model.md)
3. Conferir coerência com `discovery/microsoft-365/api-mapping.md`

**Expected outcome**:

- cada bloco estruturado da overview tem um endpoint Graph real mapeado
- `serviceUsage30d` é o único bloco que depende do endpoint de reports com `302` para CSV; `summaryCards` não depende desse endpoint
- o seam técnico do Graph está ativo e documentado, com `GraphServiceClient` + `ClientCredentialContext`

### 4.1 Pré-requisitos do App Registration estão validados

Fluxo:

1. Conferir no App Registration do tenant Contoso que as variáveis `MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID` e `MS_GRAPH_CLIENT_SECRET` estão presentes no ambiente da aplicação
2. Confirmar que as permissões `Reports.Read.All`, `ServiceHealth.Read.All`, `LicenseAssignment.Read.All`, leitura ampla de diretório e `SecurityEvents.Read.All` foram concedidas com consentimento administrativo
3. Registrar o resultado dessa conferência antes da validação funcional

**Expected outcome**:

- o App Registration atende os pré-requisitos documentados da feature
- a validação funcional não depende de descoberta tardia de permissão ausente

### 5. Navegação e linguagem visual permanecem consistentes

Fluxo:

1. Comparar a overview nova com a experiência atual do módulo e com outros módulos do produto
2. Validar labels, tons de status, cards e gráficos em desktop e mobile web

**Expected outcome**:

- a página preserva o shell, os wrappers de charts e a linguagem visual existente
- a mudança é percebida como troca de origem dos dados (mock → Graph real), não como ruptura de UX
- blocos stale exibem o indicador "Última att. em {tempo relativo}" sem quebrar a linguagem visual

### 6. Parser de CSV para `serviceUsage30d` funciona end-to-end

Fluxo:

1. Confirmar que `/reports/getOffice365ServicesUserCounts(period='D30')` retorna `302` para CSV
2. Validar que o backend faz download e parsing sem expor CSV bruto ao cliente

**Expected outcome**:

- `serviceUsage30d` exibe dados reais de adoção 30d no contrato Inertia
- o formato CSV nunca aparece no payload enviado ao frontend

### 7. Script manual de validacao

Use este roteiro curto para validar a entrega em ambiente com credenciais reais:

```bash
cd orkestria360
php artisan optimize:clear
php artisan test tests/Feature/Microsoft365PageTest.php
composer ci:check
composer test
```

Checklist manual:

1. Confirmar que `MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID` e `MS_GRAPH_CLIENT_SECRET` estao preenchidos no ambiente.
2. Abrir `/microsoft-365` autenticado e validar que a overview carrega em uma unica resposta Inertia.
3. Verificar que blocos estruturados trazem `source: graph-*`, `fresh` e `lastUpdatedAt`.
4. Simular falha transitória do Graph em um bloco e confirmar a exibicao de `Ultima att. em ...` com snapshot stale.
5. Repetir a carga apos a recuperacao do Graph e confirmar o retorno de `fresh: true`.

## Recommended Verification Commands

```bash
cd orkestria360
composer ci:check
composer test
```

## Execution Notes

- Esta feature exige credenciais Microsoft reais do App Registration do tenant Contoso configuradas no ambiente.
- Variáveis de ambiente: `MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET` em `orkestria360/.env`.
- O stack oficial PHP do Graph (`microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague` e `microsoft/kiota-http-guzzle`) é dependência obrigatória de execução desta feature.
- A autenticação é app-only com `ClientCredentialContext` e escopo `https://graph.microsoft.com/.default`.
- Não existe mock: falhas transitórias do Graph são tratadas via cache/snapshot (`fresh: false`) com indicador "Última att. em {tempo relativo}", ou normalização para `empty`/`informational` quando não há snapshot.
- O cache/snapshot usa o cache storage nativo do Laravel (driver de `config/cache.php` — Redis, database, file, memcached, etc.) com TTL controlado por bloco; sobrevive a restarts quando o driver é persistente, mas tem expiração. Não constitui persistência analítica nem histórico.

## Related Artifacts

- [Plan](./plan.md)
- [Research](./research.md)
- [Data Model](./data-model.md)
- [Contract](./contracts/microsoft-365-overview.md)
