# Health Score Orkestria360 - Payloads Graph V1

## Objetivo

Este documento registra o formato real de resposta dos endpoints usados no estudo do `HealthScore_Orkestria360_Modelo_Calculo_V1.md`, com base em coleta ao vivo na Microsoft Graph.

Artefatos gerados:

- script de simulação: simulate_m365_health_score_requests.php (`Application: scripts/simulate_m365_health_score_requests.php`; verificar no worktree autorizado)
- snapshot salvo: snapshot histórico indisponível neste Planning; não recuperar dados privados de outro checkout

Data da coleta documentada aqui:

- `generatedAt`: `2026-07-08T22:17:38+00:00`

## Como gerar

```bash
cd orkestria360
php scripts/simulate_m365_health_score_requests.php
```

Opcoes suportadas:

- `--only=<prefixo_do_endpoint>`
- `--sample-size=<n>`
- `--output=<caminho>`

Exemplos:

```bash
php scripts/simulate_m365_health_score_requests.php --only=subscribed_skus
php scripts/simulate_m365_health_score_requests.php --only=office365_active_user_detail --sample-size=5
```

## Resumo da coleta

- total de endpoints executados: `36`
- utilizaveis: `31`
- warnings: `9`
- falhas classificadas: `5`

Classificacao observada no tenant:

- `provider_inactive`
  - `alerts_v2`
  - `incidents`
- `insufficient_privileges`
  - `domain_service_configuration_records:knowhow.com`
  - `domain_service_configuration_records:knowhow360.com`
  - `domain_service_configuration_records:GrupoKnowHow360.onmicrosoft.com`

## Tipos de resposta encontrados

### 1. `json_collection`

Padrao:

```json
{
  "value": [
    {
      "...": "..."
    }
  ]
}
```

Campos capturados no snapshot:

- `status`
- `usable`
- `errorCategory`
- `valueCount`
- `sampleKeys`
- `bodyPreview`

Exemplos:

- `organization`
  - `valueCount=1`
  - chaves da amostra: `id`, `displayName`, `countryLetterCode`, `tenantType`, `assignedPlans`, `verifiedDomains`
- `domains`
  - `valueCount=7`
  - chaves da amostra: `id`, `isVerified`, `isDefault`, `isInitial`, `supportedServices`, `state`
- `subscribed_skus`
  - `valueCount=16`
  - chaves da amostra: `skuPartNumber`, `capabilityStatus`, `consumedUnits`, `prepaidUnits`, `servicePlans`
- `users`
  - `valueCount=5`
  - chaves da amostra: `displayName`, `userPrincipalName`, `accountEnabled`, `userType`, `assignedLicenses`, `signInActivity`
- `directory_roles`
  - `valueCount=86`
  - chaves da amostra: `id`, `displayName`, `description`, `roleTemplateId`
- `secure_scores`
  - `valueCount=1`
  - chaves da amostra: `currentScore`, `maxScore`, `activeUserCount`, `enabledServices`, `averageComparativeScores`, `controlScores`
- `user_registration_details`
  - `valueCount=6`
  - chaves da amostra: `isAdmin`, `isMfaRegistered`, `isMfaCapable`, `methodsRegistered`, `lastUpdatedDateTime`
- `service_health_overviews`
  - `valueCount=24`
  - chaves da amostra: `service`, `status`, `id`
- `secure_score_control_profiles`
  - `valueCount=25`
  - chaves da amostra: `controlCategory`, `title`, `maxScore`, `remediation`, `service`, `threats`, `controlStateUpdates`
- `directory_audits`
  - `valueCount=10`
  - chaves da amostra: `activityDisplayName`, `activityDateTime`, `loggedByService`, `operationType`, `initiatedBy`, `targetResources`

Casos especiais ainda dentro de `json_collection`:

- `conditional_access_policies`
  - `status=200`
  - `usable=true`
  - `valueCount=0`
  - `bodyPreview=[]`
- `sensitivity_labels`
  - `status=200`
  - `usable=true`
  - `valueCount=0`
  - `bodyPreview=[]`
- `directory_role_members:*`
  - retornam colecao
  - no snapshot, algumas roles retornaram `[]`, o que indica role sem membros e nao erro de query

### 2. `json_entity`

Padrao:

```json
{
  "@odata.context": "...",
  "id": "...",
  "...": "..."
}
```

Endpoint observado:

- `identity_security_defaults`
  - `status=200`
  - chaves: `@odata.context`, `id`, `displayName`, `description`, `isEnabled`, `controlTypes`, `securityDefaultsUpsell`

Exemplo de shape:

```json
{
  "id": "00000000-0000-0000-0000-000000000005",
  "displayName": "Security Defaults",
  "isEnabled": true
}
```

### 3. `csv_redirect`

Padrao:

- chamada Graph retorna `302`
- header `Location` aponta para URL preautenticada
- download final retorna CSV

Campos capturados no snapshot:

- `status=302`
- `csvDownload.status`
- `csvDownload.sampleLines`
- `csvBody`

Endpoints observados nesse formato:

- `office365_active_user_detail`
- `office365_services_user_counts`
- `teams_user_activity_user_counts`
- `email_activity_user_counts`
- `mailbox_usage_mailbox_counts`
- `onedrive_usage_account_counts`
- `sharepoint_site_usage_detail`
- `m365_app_user_counts`
- `office365_activations_user_counts`

Exemplos de cabechalhos CSV:

- `office365_active_user_detail`

```text
Report Refresh Date,User Principal Name,Display Name,Is Deleted,...,Assigned Products
```

- `teams_user_activity_user_counts`

```text
Report Refresh Date,Report Date,Team Chat Messages,Private Chat Messages,Calls,Meetings,Other Actions,Report Period
```

- `sharepoint_site_usage_detail`

```text
Report Refresh Date,Site Id,Site URL,Owner Display Name,Is Deleted,Last Activity Date,...,Report Period
```

## Mapeamento dos endpoints validos no snapshot

### Configuracoes Gerais

- `organization`
- `domains`
- `identity_security_defaults`

### Licenciamento

- `subscribed_skus`
- `office365_active_user_detail`

### Governanca

- `users`
- `guest_users`
- `groups`
- `directory_roles`
- `directory_role_members:*`
- `group_owners:*`
- `directory_audits`

### Seguranca

- `secure_scores`
- `user_registration_details`
- `conditional_access_policies`

### Disponibilidade

- `service_health_overviews`
- `service_announcement_issues`

### Compliance

- `secure_score_control_profiles`
- `sensitivity_labels`

### Produtividade

- `office365_services_user_counts`
- `teams_user_activity_user_counts`
- `email_activity_user_counts`
- `mailbox_usage_mailbox_counts`
- `onedrive_usage_account_counts`
- `sharepoint_site_usage_detail`
- `m365_app_user_counts`
- `office365_activations_user_counts`

## Bloqueios reais encontrados

### `alerts_v2`

- `status=403`
- `errorCategory=provider_inactive`
- mensagem:
  - `Unauthorized request - Account Mode is not Active. MTP status: Suspended, MDE account mode: Suspended.`

Conclusao:

- o endpoint responde
- a permissao por si so nao basta
- o workload/provider de seguranca precisa estar ativo no tenant

### `incidents`

- mesmo comportamento de `alerts_v2`

### `domain_service_configuration_records:*`

- `status=403`
- `errorCategory=insufficient_privileges`
- mensagem:
  - `Insufficient privileges to complete the operation.`

Conclusao:

- a familia de endpoints foi localizada corretamente
- o tenant atual nao libera leitura com o conjunto de permissoes/condicoes atual

## Observacoes de viabilidade

- o harness de simulacao e util para descobrir:
  - formato real da resposta
  - chaves disponiveis
  - se o endpoint vem como JSON, entidade unica ou CSV via redirect
  - se o bloqueio e de permissao, provider inativo ou colecao vazia
- ele nao substitui o harness de calculo, porque a simulacao trabalha com amostras pequenas e previews
- para calculo final, o fluxo correto continua sendo o report live via calculate_m365_health_score.php (`Application: scripts/calculate_m365_health_score.php`; verificar no worktree autorizado)
