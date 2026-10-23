# IMDO Orkestria360 — Catálogo de Endpoints V2

## Finalidade

Catalogar as superfícies necessárias para coletar as evidências da planilha `HealthScore.xlsx` do sponsor. Este catálogo é uma especificação de coleta; não executa chamadas e não substitui o validador com fixtures.

`Microsoft Graph` é a superfície padrão. APIs especializadas só entram quando a planilha exige sinal que Graph não fornece com fidelidade suficiente. A ausência de licença/workload para um indicador previsto retorna nota zero; falta de permissão retorna `insufficient_privileges`; integrações explicitamente fora de escopo retornam `not_applicable`.

## Convenções de acesso

| Superfície | Base | Autorização/observação |
| --- | --- | --- |
| Microsoft Graph | `https://graph.microsoft.com/v1.0` | App-only; permissões dependem do recurso. Reports exigem `Reports.Read.All`; Conditional Access exige `Policy.Read.All`; Service Health exige `ServiceHealth.Read.All`. |
| Defender XDR | `https://api.security.microsoft.com/api` | Token para o recurso Defender XDR e permissões/roles de segurança correspondentes; não presumir que o token Graph atende esta API. |
| Power BI REST | `https://api.powerbi.com/v1.0/myorg` | Operações administrativas exigem configuração administrativa/Fabric e autorização apropriada; service principal é suportado em cenários administrativos documentados. |
| Power Platform Inventory API | URL do Power Platform Admin configurada por tenant | Requer app registrado/identidade administrativa da Power Platform; a API inventaria recursos, não substitui automaticamente telemetria de execuções. |
| Fontes internas | Orkestria | Assessment, Governança, tabela de preços e futuras fontes de vigência têm contratos próprios. |

## 1. Tenant, identidade e licenciamento

| Evidência da planilha | Endpoint/canal | Dados mínimos |
| --- | --- | --- |
| Tenant | `GET /organization` | tenant, nome e identificadores. |
| Domínios | `GET /domains` | verificação e domínio padrão. |
| Registros de domínio | `GET /domains/{domain-id}/serviceConfigurationRecords` | registros requeridos por serviço. |
| Usuários, convidados e último login | `GET /users?$select=id,displayName,userType,accountEnabled,assignedLicenses,signInActivity` | população, convidados, licenças e atividade. |
| Sign-ins legacy | `GET /auditLogs/signIns` com filtro de `clientAppUsed` | autenticação legada e volume. |
| Grupos e owners | `GET /groups`; `GET /groups/{id}/owners` | grupos, ownership e cobertura. |
| Roles e administradores | `GET /directoryRoles`; `GET /directoryRoles/{id}/members`; `GET /roleManagement/directory/roleAssignments` | admins, memberships e atribuições. |
| SKUs e unidades | `GET /subscribedSkus` | `skuId`, `skuPartNumber`, `consumedUnits`, `prepaidUnits`, `servicePlans` e status. |
| Preço unitário | Tabela de preços Orkestria por `skuId`/`skuPartNumber` | valor real pago/contratado e moeda; não fornece quantidade. |

## 2. Segurança, identidade e administração

| Evidência da planilha | Endpoint/canal | Dados mínimos |
| --- | --- | --- |
| Secure Score | `GET /security/secureScores` | `currentScore`, `maxScore`, serviços e comparativos. |
| Controles Secure Score | `GET /security/secureScoreControlProfiles` | controles, categoria, remediação e impacto. |
| Registro MFA | `GET /reports/authenticationMethods/userRegistrationDetails` | registro, capacidade e métodos. |
| Métodos por usuário / Break Glass | `GET /users/{id}/authentication/*` | métodos registrados por identidade. |
| Conditional Access | `GET /identity/conditionalAccess/policies` | estado, condições, grants e exclusões. |
| Security Defaults | `GET /policies/identitySecurityDefaultsEnforcementPolicy` | estado da proteção padrão. |
| Risky users e detections | `GET /identityProtection/riskyUsers`; `GET /identityProtection/riskDetections` | risco, estado e remediação. |
| Alertas e incidentes Graph | `GET /security/alerts_v2`; `GET /security/incidents` | severidade, status e evidências. |
| Auditoria de diretório | `GET /auditLogs/directoryAudits` | atividades administrativas, consentimentos, roles e políticas. |

## 3. Defender, Intune e configurações especializadas

| Evidência da planilha | Endpoint/canal | Dados mínimos | Situação |
| --- | --- | --- | --- |
| Defender — Exposure Score | Defender XDR `GET /exposureScore` | score de exposição. | API especializada. |
| Defender — recomendações | Defender XDR `GET /recommendations` | recomendações e estado. | API especializada. |
| Defender — alertas/incidentes | Defender XDR `GET /alerts`; `GET /incidents` | severidade, status, devices e alertas associados. | API especializada; Graph Security pode complementar. |
| Defender — devices | Defender XDR `GET /machines` | devices ativos/protegidos. | API especializada. |
| Intune — devices | `GET /deviceManagement/managedDevices` | compliance, criptografia, risco e estado. | Graph, depende de Intune. |
| Intune — compliance | `GET /deviceManagement/deviceCompliancePolicies` | políticas e cobertura. | Graph, depende de Intune. |
| Intune — configuração/updates | `GET /deviceManagement/deviceConfigurations`; `GET /deviceManagement/windowsUpdateForBusinessConfigurations` | configuração e atualização Windows. | Graph, depende de Intune. |

## 4. Serviços, incidentes e relatórios Microsoft 365

| Evidência da planilha | Endpoint/canal | Dados mínimos |
| --- | --- | --- |
| Service Health | `GET /admin/serviceAnnouncement/healthOverviews` | estado de cada serviço. |
| Incidentes Microsoft | `GET /admin/serviceAnnouncement/issues` | incidentes, advisory, status e datas. |
| Usuários ativos M365 / ociosidade | `GET /reports/getOffice365ActiveUserDetail(period='D30')` e `D90` | atividade por usuário. |
| Uso agregado M365 | `GET /reports/getOffice365ServicesUserCounts(period='D30')` | contagens de Exchange, Teams, OneDrive e SharePoint. |
| Teams | `GET /reports/getTeamsUserActivityUserDetail(period='D30')`; `getTeamsUserActivityCounts`; `getTeamsDeviceUsageUserDetail` | usuários, reuniões, chat e devices. |
| Exchange | `GET /reports/getEmailActivityUserDetail(period='D30')`; `getMailboxUsageDetail`; `getMailboxUsageMailboxCounts` | atividade, mailboxes e uso. |
| SharePoint | `GET /reports/getSharePointSiteUsageDetail(period='D30')`; `getSharePointSiteUsageStorage`; `GET /sites` | sites, atividade e storage. |
| OneDrive | `GET /reports/getOneDriveUsageAccountDetail(period='D30')`; `getOneDriveUsageStorage` | contas, sincronização e storage. |
| Microsoft 365 Apps | `GET /reports/getM365AppUserCounts(period='D30')`; `GET /reports/getOffice365ActivationsUserCounts` | adoção e ativações. |
| Exchange/Teams/SharePoint/OneDrive — configurações | Canal administrativo específico por workload quando Graph/Reports não expuser a configuração | SPF, DKIM, DMARC, políticas Teams, versionamento, retenção, DLP e sharing. | Não inferir de relatório de uso. |

Os endpoints `reports/*` podem responder por redirecionamento para CSV e exigem parser próprio, conforme o estudo V1.

## 4.1 Malha Microsoft Graph validada no Health Score V1

Esta é a malha completa já exercitada pelo simulador V1. Ela é incorporada à V2 para evitar regressão dos endpoints, queries, fan-outs e formatos que já foram observados em tenant real. `Validado` significa que a família foi executada no snapshot V1; não significa que todo tenant terá a licença, permissão ou dados necessários.

### Endpoints base JSON

| ID estável | Path e query mínima | Modo | Finalidade IMDO | Resultado V1 |
| --- | --- | --- | --- | --- |
| `organization` | `GET /organization` | `json_collection` | Identidade do tenant | Validado |
| `domains` | `GET /domains` | `json_collection` | Domínios e verificação | Validado |
| `identity_security_defaults` | `GET /policies/identitySecurityDefaultsEnforcementPolicy` | `json_entity` | Proteção base de identidade | Validado |
| `subscribed_skus` | `GET /subscribedSkus` | `json_collection` | SKU, unidades, service plans e capacidade | Validado |
| `users` | `GET /users?$select=id,displayName,userPrincipalName,accountEnabled,userType,assignedLicenses,signInActivity` | `json_collection` | Usuários, licenças e atividade | Validado |
| `guest_users` | `GET /users?$filter=userType eq 'Guest'&$select=id,accountEnabled,userType,signInActivity` | `json_collection` | Convidados e inatividade | Validado |
| `groups` | `GET /groups` | `json_collection` | Inventário de grupos | Validado |
| `directory_roles` | `GET /directoryRoles` | `json_collection` | Roles administrativas | Validado |
| `directory_audits` | `GET /auditLogs/directoryAudits?$orderby=activityDateTime desc` | `json_collection` | Eventos administrativos sensíveis | Validado |
| `secure_scores` | `GET /security/secureScores?$top=1` | `json_collection` | Secure Score e comparativos | Validado |
| `user_registration_details` | `GET /reports/authenticationMethods/userRegistrationDetails` | `json_collection` | Registro/capacidade MFA | Validado |
| `conditional_access_policies` | `GET /identity/conditionalAccess/policies` | `json_collection` | Políticas e estado Conditional Access | Validado; coleção vazia é dado válido |
| `alerts_v2` | `GET /security/alerts_v2` | `json_collection` | Alertas de segurança | Provider inativo no snapshot |
| `incidents` | `GET /security/incidents` | `json_collection` | Incidentes de segurança | Provider inativo no snapshot |
| `service_health_overviews` | `GET /admin/serviceAnnouncement/healthOverviews` | `json_collection` | Saúde dos serviços Microsoft | Validado |
| `service_announcement_issues` | `GET /admin/serviceAnnouncement/issues` | `json_collection` | Incidentes/advisories de serviço | Validado |
| `secure_score_control_profiles` | `GET /security/secureScoreControlProfiles` | `json_collection` | Controles e remediações | Validado |
| `sensitivity_labels` | `GET /security/dataSecurityAndGovernance/sensitivityLabels` | `json_collection` | Labels de classificação | Validado; coleção vazia é dado válido |

O sponsor também cita `/security/informationProtection/sensitivityLabels`. A integração V2 deve manter teste de compatibilidade para as duas superfícies e usar aquela disponível para o tenant e versão Graph adotada; não deve assumir que uma coleção vazia é erro.

### Endpoints dependentes (fan-out)

| ID estável | Descoberto a partir de | Path | Modo | Resultado V1 |
| --- | --- | --- | --- | --- |
| `directory_role_members:{roleId}` | `directory_roles` | `GET /directoryRoles/{roleId}/members` | `json_collection` | Validado; role sem membros retorna coleção vazia |
| `group_owners:{groupId}` | `groups` | `GET /groups/{groupId}/owners` | `json_collection` | Validado |
| `domain_service_configuration_records:{domainId}` | `domains` | `GET /domains/{domainId}/serviceConfigurationRecords` | `json_collection` | Localizado; `insufficient_privileges` no snapshot |

O coletor deve limitar páginas e fan-out no modo diagnóstico; no modo de cálculo, deve percorrer todas as páginas e entidades aplicáveis.

### Endpoints de relatório CSV

| ID estável | Path | Finalidade IMDO | Resultado V1 |
| --- | --- | --- | --- |
| `office365_active_user_detail` | `GET /reports/getOffice365ActiveUserDetail(period='D30')` | Atividade, licença ociosa e adoção | Validado via `302` + CSV |
| `office365_services_user_counts` | `GET /reports/getOffice365ServicesUserCounts(period='D30')` | Uso agregado por workload | Validado via `302` + CSV |
| `teams_user_activity_user_counts` | `GET /reports/getTeamsUserActivityUserCounts(period='D30')` | Teams: chat, calls, meetings e ações | Validado via `302` + CSV |
| `email_activity_user_counts` | `GET /reports/getEmailActivityUserCounts(period='D30')` | Adoção Exchange | Validado via `302` + CSV |
| `mailbox_usage_mailbox_counts` | `GET /reports/getMailboxUsageMailboxCounts(period='D30')` | Mailboxes e utilização | Validado via `302` + CSV |
| `onedrive_usage_account_counts` | `GET /reports/getOneDriveUsageAccountCounts(period='D30')` | Adoção OneDrive | Validado via `302` + CSV |
| `sharepoint_site_usage_detail` | `GET /reports/getSharePointSiteUsageDetail(period='D30')` | Atividade e sites SharePoint | Validado via `302` + CSV |
| `m365_app_user_counts` | `GET /reports/getM365AppUserCounts(period='D30')` | Uso de Microsoft 365 Apps | Validado via `302` + CSV |
| `office365_activations_user_counts` | `GET /reports/getOffice365ActivationsUserCounts` | Ativações Microsoft 365 Apps | Validado via `302` + CSV |

Os endpoints detalhados adicionais indicados pelo sponsor — Teams por usuário/device, Exchange detail, SharePoint storage e OneDrive detail/storage — permanecem no catálogo da seção 4. Eles complementam a malha V1 para os cálculos de produtividade e disponibilidade mais granulares.

### Contrato operacional de coleta herdado do V1

- Coleções JSON seguem `@odata.nextLink`; cálculo real deve paginar, diagnóstico pode limitar páginas.
- Reports seguem `302 Location` para URL CSV pré-autenticada; o coletor deve armazenar o status do redirect e do download, cabeçalho e preview do CSV.
- Cada execução deve registrar `id`, URL, query, modo de resposta, status, contagem, chaves de amostra, `nextLink`, erro e `errorCategory`.
- Categorias técnicas: `provider_inactive`, `insufficient_privileges`, `unsupported_query`, `not_applicable` e `not_collected`.
- `provider_inactive` por licença/workload ausente em indicador IMDO previsto resulta em nota zero; `insufficient_privileges` reduz cobertura, conforme o modelo V2.

## 5. Compliance e Purview

| Evidência da planilha | Endpoint/canal | Dados mínimos | Situação |
| --- | --- | --- | --- |
| Sensitivity labels | `GET /security/informationProtection/sensitivityLabels` | labels, publicação e configuração. | Graph/Purview, depende de licença. |
| DLP | Purview API/canal administrativo de DLP | políticas, estado, workloads e alertas. | Superfície especializada a confirmar na integração. |
| Retenção | Purview API/canal administrativo de retenção | políticas, labels, workloads e revisão. | Superfície especializada a confirmar na integração. |
| Audit/eDiscovery/Insider Risk | Purview e Graph Security audit queries | cobertura e evidências de controles. | Depende de licença e permissões. |
| LGPD e ISO 27001 | Governança + Assessment + sinais Purview/Graph | evidências técnicas e documentais. | Não representa certificação ou parecer jurídico. |

## 6. Planner, Power BI, Power Automate e Copilot

| Evidência da planilha | Endpoint/canal | Dados mínimos | Situação |
| --- | --- | --- | --- |
| Planner | `GET /planner/plans`; `GET /planner/tasks`; `GET /planner/buckets` | planos, tarefas, buckets, atualização e colaboração. | Graph; validar permissão app-only e escopo por grupo/plano no tenant. |
| Power BI — reports | Power BI REST `GET /admin/reports` | reports do tenant. | API especializada definida. |
| Power BI — datasets | Power BI REST `GET /admin/groups/{groupId}/datasets` | datasets, refreshability e configuração. | API especializada definida. |
| Power BI — acesso | Power BI REST `GET /groups/{groupId}/users` e `GET /admin/users/{userId}/artifactAccess` | usuários e direitos de acesso. | API especializada definida. |
| Power BI — refresh | Power BI REST `GET /datasets/{datasetId}/refreshSchedule` | agendamento de atualização. | Histórico/resultado de refresh requer endpoint adicional do dataset. |
| Power Automate — inventário | Power Platform Inventory API `POST {PowerPlatformAPI}/resourcequery/resources/query?api-version=2024-10-01` com `PowerPlatformResources` | ambientes e `microsoft.powerautomate/cloudflows`. | API especializada definida. |
| Power Automate — owners | `Get-AdminFlowOwnerRole` (Power Platform Admin PowerShell) | owner do flow. | Canal administrativo definido. |
| Power Automate — execução/sucesso | Telemetria/API administrativa do Power Automate a confirmar | runs, sucesso e falhas. | Ainda sem endpoint normativo no catálogo. |
| Copilot | Relatórios Graph sob o segmento `/reports/copilot` | uso, usuários habilitados/ativos, tendência e detalhe. | Surface Graph atual; o endpoint exato e período devem ser validados no tenant. |

## Cobertura da planilha e decisão sobre DEP-007

O catálogo resolve a parte de **discovery** do DEP-007: identifica as superfícies necessárias, separa Graph de APIs especializadas e elimina a hipótese de que Power BI, Power Automate, Copilot ou Defender possam ser coletados por um único payload Graph genérico.

Ele não resolve a parte de **implementação em produção**: ainda serão necessários conectores autenticados, consentimentos, tratamento de paginação/CSV, rate limits e confirmação do endpoint de execução do Power Automate e do relatório Copilot aplicável ao tenant.

Portanto, DEP-007 muda de “API indefinida” para **“catálogo definido; conectores pendentes de implementação”**. Isso não bloqueia o validador por fixture.

## Referências oficiais consultadas

- [Microsoft Graph — subscribedSku](https://learn.microsoft.com/graph/api/resources/subscribedsku)
- [Microsoft Graph — permissions reference](https://learn.microsoft.com/graph/permissions-reference)
- [Microsoft Graph — reports authorization](https://learn.microsoft.com/graph/reportroot-authorization)
- [Microsoft Defender XDR APIs](https://learn.microsoft.com/defender-xdr/api-overview)
- [Power BI REST API](https://learn.microsoft.com/rest/api/power-bi/)
- [Power Platform Inventory API](https://learn.microsoft.com/power-platform/admin/inventory-api)
