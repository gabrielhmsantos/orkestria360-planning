# HealthScore Orkestria360

Modelo de calculo V1 baseado apenas em dados coletaveis por API.

## Objetivo

Definir como calcular o HealthScore Orkestria360 a partir de pilares ponderados. Cada indicador gera uma nota de 0 a 100 e recebe 100% do seu peso interno quando atinge o criterio de excelencia definido. Nao ha dependencia de dados manuais.

## Formula Geral

```text
HealthScore =
  Seguranca * 0,30 +
  Licenciamento * 0,20 +
  Governanca * 0,15 +
  Disponibilidade * 0,10 +
  Compliance * 0,10 +
  Produtividade * 0,10 +
  Configuracoes Gerais * 0,05
```

## Observacao de Cobertura

Quando uma API nao estiver disponivel por licenca/permissao, o indicador deve ser marcado como `nao coletado`. O score deve exibir tambem a cobertura dos dados, para evitar uma nota aparentemente precisa com baixa coleta.

## 1. Seguranca - peso 30%

| Indicador | Peso interno | Calculo / criterio para atingir peso interno total | Fonte API |
| --- | --- | --- | --- |
| Secure Score Microsoft | 35% | Atinge 100 quando `currentScore / maxScore >= 80%`. Abaixo disso, pontua proporcionalmente. | `/security/secureScores` |
| Cobertura MFA dos usuarios | 20% | Atinge 100 quando `>= 95%` dos usuarios habilitados estao registrados/capazes para MFA. | `/reports/authenticationMethods/userRegistrationDetails` |
| MFA em administradores | 15% | Atinge 100 quando 100% dos usuarios em roles administrativas estao registrados/capazes para MFA. | `/directoryRoles`<br>`/directoryRoles/{id}/members`<br>`/reports/authenticationMethods/userRegistrationDetails` |
| Alertas/incidentes de seguranca abertos | 15% | Atinge 100 quando nao existem alertas ou incidentes `high/critical` abertos. Quanto mais alertas criticos, menor a nota. | `/security/alerts_v2`<br>`/security/incidents` |
| Conditional Access ou Security Defaults | 15% | Atinge 100 quando ha pelo menos uma politica ativa de Conditional Access relevante para MFA ou quando Security Defaults esta habilitado. | `/identity/conditionalAccess/policies`<br>`/policies/identitySecurityDefaultsEnforcementPolicy` |

## 2. Licenciamento - peso 20%

| Indicador | Peso interno | Calculo / criterio para atingir peso interno total | Fonte API |
| --- | --- | --- | --- |
| Utilizacao das licencas compradas | 40% | Atinge 100 quando a utilizacao fica entre `85%` e `95%`: `consumedUnits / prepaidUnits.enabled`. Abaixo disso indica desperdicio; acima disso indica risco de falta de licencas. | `/subscribedSkus` |
| Licencas atribuidas com uso recente | 35% | Atinge 100 quando `>= 90%` dos usuarios licenciados tiveram atividade nos ultimos 30 dias em algum servico Microsoft 365. | `/users?$select=assignedLicenses`<br>`/reports/getOffice365ActiveUserDetail(period='D30')` |
| Excesso de licencas disponiveis por SKU | 15% | Atinge 100 quando nenhuma SKU possui sobra maior que `25%` das licencas compradas. | `/subscribedSkus` |
| SKUs sem uso | 10% | Atinge 100 quando nao existe SKU comprada com `consumedUnits = 0`. | `/subscribedSkus` |

## 3. Governanca - peso 15%

| Indicador | Peso interno | Calculo / criterio para atingir peso interno total | Fonte API |
| --- | --- | --- | --- |
| Grupos com owner definido | 25% | Atinge 100 quando `>= 95%` dos grupos suportados possuem pelo menos um owner. | `/groups`<br>`/groups/{id}/owners` |
| Contas inativas ainda habilitadas | 20% | Atinge 100 quando `<= 5%` dos usuarios habilitados estao sem login bem-sucedido ha mais de 90 dias. | `/users?$select=accountEnabled,signInActivity` |
| Usuarios convidados controlados | 15% | Atinge 100 quando convidados inativos ha mais de 90 dias representam `<= 5%` dos convidados ou quando nao existem convidados inativos. | `/users?$filter=userType eq 'Guest'&$select=signInActivity,accountEnabled,userType` |
| Roles administrativas monitoradas | 20% | Atinge 100 quando todas as roles administrativas possuem membros identificados e nenhum admin esta inativo ha mais de 90 dias. | `/directoryRoles`<br>`/directoryRoles/{id}/members`<br>`/users?$select=signInActivity` |
| Atividades administrativas sensiveis | 20% | Atinge 100 quando nao existem eventos sensiveis recentes sem revisao, como criacao de app, admin consent, alteracao de role ou mudanca critica de politica. | `/auditLogs/directoryAudits` |

## 4. Disponibilidade - peso 10%

| Indicador | Peso interno | Calculo / criterio para atingir peso interno total | Fonte API |
| --- | --- | --- | --- |
| Status dos servicos principais | 60% | Atinge 100 quando todos os servicos principais estao `serviceOperational`. | `/admin/serviceAnnouncement/healthOverviews` |
| Incidentes ativos | 30% | Atinge 100 quando nao existem `issues` ativas afetando servicos principais. | `/admin/serviceAnnouncement/issues` |
| Recorrencia de degradacao | 10% | Atinge 100 quando nao houve degradacao recorrente nos ultimos 30 dias, baseado nos snapshots coletados via API pelo Orkestria. | `/admin/serviceAnnouncement/healthOverviews`<br>`/admin/serviceAnnouncement/issues`<br>`Snapshots internos` |

## 5. Compliance - peso 10%

| Indicador | Peso interno | Calculo / criterio para atingir peso interno total | Fonte API |
| --- | --- | --- | --- |
| Controles de compliance/information protection | 30% | Atinge 100 quando controles do Secure Score relacionados a compliance, protecao de informacao e governanca estao `>= 80%` implementados. | `/security/secureScoreControlProfiles` |
| Sensitivity labels disponiveis | 25% | Atinge 100 quando existem labels habilitadas para classificacao/protecao de dados. | `security/dataSecurityAndGovernance/sensitivityLabels` |
| Saude do Purview | 15% | Atinge 100 quando o servico Purview esta `serviceOperational`. | `/admin/serviceAnnouncement/healthOverviews` |
| Auditoria administrativa disponivel | 15% | Atinge 100 quando ha coleta recente de auditoria e eventos administrativos estao disponiveis para analise. | `/auditLogs/directoryAudits` |
| Governanca de acesso externo | 15% | Atinge 100 quando convidados, grupos e acessos externos estao dentro dos limites definidos pelo Orkestria. | `/users`<br>`/groups`<br>`/groups/{id}/owners` |

## 6. Produtividade - peso 10%

| Indicador | Peso interno | Calculo / criterio para atingir peso interno total | Fonte API |
| --- | --- | --- | --- |
| Usuarios ativos Microsoft 365 | 30% | Atinge 100 quando `>= 80%` dos usuarios licenciados tiveram atividade nos ultimos 30 dias. | `/reports/getOffice365ActiveUserDetail(period='D30')` |
| Uso geral dos servicos | 20% | Atinge 100 quando os workloads principais tem atividade consistente nos ultimos 30 dias. | `/reports/getOffice365ServicesUserCounts(period='D30')` |
| Adocao do Teams | 15% | Atinge 100 quando `>= 60%` dos usuarios elegiveis usam Teams nos ultimos 30 dias. | `/reports/getTeamsUserActivityUserCounts(period='D30')` |
| Adocao do Exchange | 15% | Atinge 100 quando `>= 80%` dos usuarios com mailbox tiveram atividade de e-mail nos ultimos 30 dias. | `/reports/getEmailActivityUserCounts(period='D30')`<br>`/reports/getMailboxUsageMailboxCounts(period='D30')` |
| Adocao de OneDrive/SharePoint | 10% | Atinge 100 quando ha uso ativo de arquivos/sites por `>= 60%` dos usuarios elegiveis. | `/reports/getOneDriveUsageAccountCounts(period='D30')`<br>`/reports/getSharePointSiteUsageDetail(period='D30')` |
| Uso dos Microsoft 365 Apps | 10% | Atinge 100 quando `>= 80%` dos usuarios elegiveis usam ou ativaram apps Microsoft 365. | `/reports/getM365AppUserCounts(period='D30')`<br>`/reports/getOffice365ActivationsUserCounts` |

## 7. Configuracoes Gerais - peso 5%

| Indicador | Peso interno | Calculo / criterio para atingir peso interno total | Fonte API |
| --- | --- | --- | --- |
| Tenant identificado corretamente | 15% | Atinge 100 quando os dados basicos do tenant sao coletados com sucesso. | `/organization` |
| Dominios verificados | 25% | Atinge 100 quando 100% dos dominios em uso estao verificados. | `/domains` |
| Registros de dominio essenciais | 20% | Atinge 100 quando os registros necessarios para os servicos Microsoft 365 estao presentes e validos. | `/domains/{domainName}/serviceConfigurationRecords`<br>`DNS lookup` |
| Protecao base de identidade | 25% | Atinge 100 quando Security Defaults esta habilitado ou existe Conditional Access ativo cobrindo MFA. | `/policies/identitySecurityDefaultsEnforcementPolicy`<br>`/identity/conditionalAccess/policies` |
| Freshness das coletas | 15% | Atinge 100 quando todas as coletas obrigatorias foram executadas com sucesso dentro da janela definida, por exemplo, ultimas 24h. | `Logs internos do Orkestria gerados pelas coletas de API` |

## Como Calcular Quando o Indicador Nao Atinge 100

- Cada indicador deve ser convertido para uma nota de 0 a 100 antes de aplicar o peso interno.
- Contribuicao no pilar = `score_do_indicador * peso_interno`.
- Contribuicao no HealthScore = `score_do_indicador * peso_interno * peso_do_pilar`.
- Exemplo: Licenciamento pesa 20% no HealthScore, e Utilizacao das licencas pesa 40% dentro de Licenciamento. Se esse indicador fizer 100 pontos, ele contribui com 40 pontos no pilar e 8 pontos no HealthScore geral.

## Fontes Oficiais Consultadas

- Microsoft Graph - subscribedSkus: https://learn.microsoft.com/en-us/graph/api/subscribedsku-list?view=graph-rest-1.0
- Microsoft Graph - Service Health healthOverviews: https://learn.microsoft.com/en-us/graph/api/serviceannouncement-list-healthoverviews?view=graph-rest-1.0
- Microsoft Graph - userRegistrationDetails: https://learn.microsoft.com/en-us/graph/api/authenticationmethodsroot-list-userregistrationdetails?view=graph-rest-1.0
- Microsoft Graph - Security API overview: https://learn.microsoft.com/en-us/graph/api/resources/security-api-overview?view=graph-rest-1.0
- Microsoft Graph - Reports API overview: https://learn.microsoft.com/en-us/graph/reportroot-concept-overview
- Microsoft Graph - Group owners: https://learn.microsoft.com/en-us/graph/api/group-list-owners?view=graph-rest-1.0
- Microsoft Graph - signInActivity: https://learn.microsoft.com/en-us/graph/api/resources/signinactivity?view=graph-rest-1.0
- Microsoft Graph - serviceConfigurationRecords: https://learn.microsoft.com/en-us/graph/api/domain-list-serviceconfigurationrecords?view=graph-rest-1.0
