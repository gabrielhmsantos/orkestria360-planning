# Fontes e viabilidade — Configurações e Segurança

## B2 — Resumo de Riscos: população C5 aceita A

**Decisão do usuário, 2026-10-14:** contar arquivos atuais únicos no maior risco
comprovado, com contexto “Arquivos atuais por nível de risco”. A semântica está
no [contrato](contratos.md); não deriva das contagens ilustrativas da imagem07.

| Fato semântico | Fonte canônica e transformação | Ausência, cobertura e limite |
| --- | --- | --- |
| Universo e chave | Projeção corrente Q5 de [Arquivos e Conteúdo](../arquivos-e-conteudo/fontes-e-viabilidade.md). Arquivo local existente único por `(driveId,itemId)`; excluir pastas, tombstones/excluídos, versões, cópiasPHL e remotos duplicados. | Publicar geração/escopo factual do inventário. Página da tabela não determina total; drive/item não observado reduz cobertura e não vira ausência de arquivo. |
| `riskSummary[].value` | Reutilizar a classificação canônica default-v1/R2 do arquivo, com evidências atuais de metadados, exposição, sensibilidade, malware/alertas conforme cada regra. Agrupar IDs únicos no maior nível comprovado `critical/high/medium/low`; cada arquivo conta uma vez. | Não somar eventos, concessões ou alertas como novos arquivos. Contexto obrigatório não resolvido mantém risco nulo; Informativo é contabilizado somente na cobertura. Contagem positiva parcial é observada, zero global exige avaliação íntegra. |
| `riskSummaryMetadata` | Projeção local com `unit: file`, `asOf`, revisão de classificação, escopo e contagens factuais de elegíveis/observados/classificados/informativos/desconhecidos. | Campos não apurados permanecem nulos. A mera quantidade observada não prova população global; não misturar gerações/revisões incompatíveis. |
| `comparison.previousValue` e `periodDays: 30` | Reutilizar snapshots diários aprovados em Q2, retidos400dias. Para o snapshot atual, selecionar o último íntegro com dataUTC de referência exatamente30dias anterior e agregar pela mesma regra. | Comparação exige cobertura íntegra nos dois snapshots, mesma revisão de classificação e critérios de escopo. Sem baseline/comparabilidade, omitir comparação; não preencher história. Mudanças naturais de arquivos fazem parte da diferença. |

O resumo mantém quatro níveis, contagens inteiras não negativas e delta de
arquivos atual menos anterior. Filtros de conteúdo/atividade, página de tabela,
janela D30 de eventos e C1 não mudam sua unidade. Disponibilidade e freshness
são próprias; falha preserva a última publicação válida e seu frescor. Não
criar leitor/GET, classificador ou catálogo de risco paralelo para Segurança:
reutilizar a avaliação publicada de conteúdo e seus snapshots versionados.
B2 fica resolvido com a definição C5 e este mapping; a integração futura
materializa contexto/metadados sem reinterpretar a fixture ou alterar pesos.

## B9 — Alertas de segurança criados em30dias: C7 aceita A

**Decisão:** usuário, 2026-10-15, opção A. Reutilizar o leitor canônico
`GET /security/alerts_v2?$top=25` já selecionado/SUPPORTED, com todas as páginas.
Não criar chamada paralela por card, nova API ou filtro síncrono da UI.

O novo binding `defenderIntegration.reportedAlerts30d` publica
`{ value, unit: alert, window: { startInclusive, endExclusive }, asOf,
coverage, availability }`, conforme o contrato. Sua referência T é o instanteUTC
factual da publicação de coleta íntegra avaliada, registrado separadamente dos
timestamps do alerta. Esse instante não é recalculado quando a tela abre.
Se a geração da fonte não admitir referência coerente, não promover a medida.

| Fato | Normalização selecionada |
| --- | --- |
| Unidade/identidade | Alerta único por `id`, no tenant da conexão. Repetição de página, várias evidências e atualização do mesmo ID não contam novamente. `providerAlertId`, `incidentId`, título, URL e nome de ameaça não substituem essa identidade. IDs distintos do mesmo arquivo/incidente continuam dois alertas. |
| Janela | `createdDateTime` válido em `[T-30dias,T)`. `firstActivityDateTime`, `lastActivityDateTime`, `lastUpdateDateTime`, `resolvedDateTime` e hora da coleta não substituem criação ausente. Alerta criado hoje para atividade iniciada há40dias entra pela criação; alerta atualizado hoje mas criado há40dias fica fora. |
| Escopo | Mesmo predicado HTTPS/host registrado OneDrive/SharePoint do tenant já aprovado abaixo. Validar vínculo antes de sanitizar; URL do portal/título/severidade sozinhos não qualificam. Ausência de vínculo obrigatório reduz a cobertura. Evidência não sai no contrato da UI como URL bruta. |
| Classificação/status | Todos entram: `unknown`, `falsePositive`, `truePositive`, `informationalExpectedActivity`, novos valores ou ausência de classificação, assim como `new`, `inProgress`, `resolved` ou status não publicado. A medida conta registros reportados, sem confirmar ameaça. Não inferir classificação por `determination`/severidade nem remover resolvido da janela. |
| Cobertura | Registrar páginas concluídas, candidatos avaliados/admitidos/excluídos/desconhecidos e janela da fonte. Data/identidade inválidas ou vínculo necessário ausente não recebem fallback. Quantidade global/elegível não conhecida fica nula; o universo é o conjunto observado, sem promessa de toda detecção do tenant. |

Deduplicar antes de contar. Registros repetidos conflitantes nos campos de
identidade/criação/escopo não são arbitrariamente somados nem escolhidos por
ordem de página: invalidam a promoção dessa medida até reconciliação. Contar
somente registros admitidos na geração; não acrescentar alerta desaparecido da
origem como se estivesse presente na coleção corrente. Um resolvido retornado
continua contando se criado na janela.

Inteiro não negativo ou nulo; positivo parcial é subtotal explicitamente
observado. Zero exige avaliação íntegra desse universo observado e nunca
atesta ausência de ameaças. Falha, restrição ou paginação incompleta preservam
última publicação válida com janela/frescor próprios, sem avançar T. Os três
controles, quarentena, DLP e scores são medidas independentes. Não há comparação
histórica nova. Snapshots de postura seguem400dias; não reconstruir alertas
que a origem não publicou nem reinterpretar `detectedThreats30d` da fixture.

Context7 e o [schema oficial do alerta](https://learn.microsoft.com/en-us/graph/api/resources/security-alert?view=graph-rest-1.0)
confirmam identidade, relógios e classificação. A decisão C7 escolhe o cálculo;
o fato HTTP e sua cobertura SUPPORTED existentes são reutilizados.

## Fontes reutilizáveis validadas

Em 14/09/2026, `GET /admin/sharepoint/settings` foi revalidado pelo
`validate-graph` em duas conexões customer: `200 application/json` e a role
`SharePointTenantSettings.Read.All` estavam presentes. O schema sanitizado
confirmou, entre outros, `sharingCapability`, listas/restrição de domínios,
`isLegacyAuthProtocolsEnabled`,
`isUnmanagedSyncAppForTenantRestricted` e retenção de site pessoal. O resultado
é evidência de postura global; não prova edição de link anônimo, conformidade de
dispositivo ou ameaça por item.

| Fato do contrato | Estratégia | Fonte e evidência | Limite de normalização |
| --- | --- | --- | --- |
| Score, máximo e categorias de controles | leitura complementar da fotografia local Secure Score | `GET /security/secureScores?$top=25` e catálogo `GET /security/secureScoreControlProfiles?$top=25`, reobservados como envelopes OData paginados | O OneDrive Security Score tem categorias e pesos diferentes do OneDrive Health Score do Dashboard, mas ambos mantêm peso sem coleta no denominador e atribuem contribuição zero. A fonte ainda deve publicar a evidência que permite avaliar cada controle. |
| Postura global de compartilhamento e sincronização | projeção local reutilizada | `GET /admin/sharepoint/settings`, já validado em Configurações e Secure Score | Permite flags globais; não prova link anônimo com edição, conformidade de dispositivo ou postura por item. |
| Risco e recomendações de compartilhamento | projeção complementar | inventário de permissões e auditoria OneDrive | Requer período, cobertura e severidade normalizada; snapshot de permissões não cria tendência. |
| Catálogo de sensibilidade | leitura de política do tenant | `GET /security/dataSecurityAndGovernance/sensitivityLabels?$top=25&$select=id,displayName,name,hasProtection,isDefault,priority`, observado como envelope OData válido vazio | A permissão mínima de aplicação é `SensitivityLabel.Read`; a validação usou `SensitivityLabels.Read.All`, que é superior. Publica catálogo/contagem de rótulos somente; não identifica nem conta arquivos rotulados. |
| Catálogo de retenção | leitura de política do tenant, somente delegated | `GET /security/labels/retentionLabels?$top=25&$select=id,displayName,isInUse,behaviorDuringRetentionPeriod,actionAfterRetentionPeriod,retentionTrigger,retentionDuration,lastModifiedDateTime`; as tentativas app-only retornaram `401` | A Microsoft não oferece permissão de aplicação para esta rota; `RecordsManagement.Read.All` é delegada. Ela não é viável no client-credentials do coletor atual. Qualquer uso exige fluxo delegated/OBO aprovado. Não prova aplicação de rótulo por arquivo. |
| Retenção aplicada por arquivo | leitura complementar por item do snapshot local | `GET /drives/{drive-id}/items/{item-id}/retentionLabel`, com `Files.Read.All`, recebeu `200 application/json` em uma conexão; a outra não teve drive/item resolvível | A rota é passiva e publica `itemRetentionLabel` quando disponível. A resposta observada trouxe somente contexto OData: ausência de campos não equivale a rótulo ausente. |
| Conformidade e sinal de risco de dispositivo | projeção limitada de Intune | `GET /deviceManagement/managedDevices` com seleção de conformidade, gerenciamento e `partnerReportedThreatState` | Mede somente a população Intune publicada; não equivale a postura de todos os dispositivos ou de arquivos OneDrive. |
| Ameaças explicitamente OneDrive/SharePoint | leitura complementar de alertas Defender | `GET /security/alerts_v2?$top=25`, com `SecurityAlert.Read.All`, retornou OData válido vazio em uma conexão; outra apresentou condição local de provider | Paginar por `@odata.nextLink`; publicar somente alerta que contenha `urlEvidence.url` HTTPS em host SharePoint/OneDrive registrado para o tenant pela própria projeção local. Não inferir por título, produto ou severidade. |
| Achados DLP explicitamente OneDrive/SharePoint | leitura complementar de alertas Defender | `GET /security/alerts_v2?$top=25&$filter=serviceSource eq 'dataLossPrevention'`, com `SecurityAlert.Read.All`, retornou envelope OData válido vazio em uma conexão; outra apresentou condição local de provider | Paginar por `@odata.nextLink`, exigir simultaneamente `serviceSource=dataLossPrevention` e `urlEvidence.url` HTTPS em host SharePoint/OneDrive do tenant. Ausência de alerta não prova cobertura/configuração de política nem pontuação conforme. |

Os catálogos não são reinterpretados como DLP; a sensibilidade aplicada é a
ação controlada documentada em Arquivos e Conteúdo, e a retenção aplicada usa a
leitura por item acima. O catálogo Graph de retenção permanece indisponível ao
backend app-only; a estratégia complementar selecionada abaixo usa export
Purview por certificado. A dimensão
DLP/classificação mantém disponibilidade independente dos achados e recebe
pontuação zero enquanto não houver avaliação de política publicada.

## Estado e segurança

Cada dimensão publica `availability`, cobertura, frescor e motivo próprios.
Permissões/licenças são pré-requisitos abstratos; um `401`/`403` de uma conexão
não é valor zero nem condição global da tela. A projeção minimiza controles,
recomendações e evidências, sem expor URLs, identificadores de tenant ou
payloads de provider.

## Cobertura sintética

As rotas de Secure Score, configurações SharePoint, sensitivity labels, alerts,
alertas DLP e retenção por item reutilizam operações Graph `SUPPORTED`. O
Simulator tem uma operação `SUPPORTED` para o catálogo de retenção, mas sua
fixture app-only não pode validar uma rota para a qual a Microsoft não oferece
permissão de aplicação. A modalidade delegated dessa rota não foi selecionada
para o backend app-only; o catálogo usa o export Purview aprovado abaixo.
Não é um gate de autorização OBO da estratégia selecionada. CA reutiliza a
operação já `SUPPORTED`, sem entrada nova.

## Fatos derivados localmente e lacunas de política

- O Security Score do OneDrive é fórmula local de nove dimensões e pesos
  aprovados; ele não é o `currentScore` geral do Microsoft Secure Score. Cada
  dimensão precisa de evidência e regra de avaliação OneDrive. Catálogo de
  controles (`secureScoreControlProfiles`), alerta ou setting isolado não
  preenche por si só a pontuação nem a comparação D30. Sem avaliação publicada,
  manter availability própria e contribuição zero conforme o contrato.
- Classificação da faixa visual do score, `Conformidade Global`, prioridade de
  recomendações e contagens por severidade são cálculos/regras locais; não são
  valores retornados pelas APIs.
- Os 20 itens de `policies` misturam settings globais, configuração de
  autenticação/dispositivo, cotas, limites, versões e regras da lixeira. O
  endpoint `/admin/sharepoint/settings` cobre somente parte das flags. Os
  valores recomendados vieram da imagem/fixture; o DOCX fornece controles gerais,
  sem prescrever todos esses valores. São baseline visual, não valores
  oficiais universais. A tabela abaixo seleciona fontes por valor atual e
  explicita os itens que exigem definição semântica; item sem fato publicado
  continua não avaliável.
- `alerts_v2` permite publicar achados DLP/ameaça apenas com evidência explícita
  de URL OneDrive/SharePoint do tenant. Alertas não fornecem configuração,
  distribuição de status ou cobertura de políticas DLP. `sensitivityLabels`
  fornece catálogo, não distribuição de arquivos; esta exige resultado por item
  da extração controlada e agregação local. Achados Defender também não provam
  controles ativos ou arquivos em quarentena.
- `retentionGovernance` usa política Purview e aplicação por item/caso,
  combinadas ao inventário corrente para contar arquivos atuais sob retenção
  e seu volume, conforme R5. Usuários e vencimentos mantêm fatos próprios;
  artefatos/ocupaçãoPHL são físicos e não preenchem as duas métricas correntes. O
  catálogo `retentionLabels` é delegated-only no Graph atual e não está
  disponível ao collector app-only. `itemRetentionLabel` só publica metadados
  explicitamente presentes e o `200` observado não trouxe campos de rótulo.
- A disponibilidade, coverage e `asOf` de cada domínio são projeções locais.
  Valores das 20 políticas, distribuições, integração Defender e governança de
  retenção que aparecem na fixture permanecem sintéticos até cada fonte estar
  habilitada e validada para a modalidade de autenticação aprovada.

## Clarify — fontes dos 20 itens e baseline aprovado

O DOCX exige complementos por SharePoint Management Shell/CSOM, Intune,
Purview, Defender e banco do Orkestria. Isso permite selecionar uma fonte
adequada; não comprova configuração de tenant. A tabela distingue fonte
documentada de leitura já evidenciada. O usuário aprovou o pacote A na Q4 de
14/10/2026; o [baseline e fórmulas aceitos](../backend-defaults-e-clarificacoes.md)
prevalecem sobre a antiga referência sintética e sobre sugestões anteriores.
`currentValue` só recebe o fato retornado pela fonte do próprio tenant ou um
limite público explicitamente apresentado como limite do serviço. O baseline
Orkestria alimenta `recommendedValue` e a regra de avaliação; não preenche
`currentValue` ausente. A allowlist restringe destinatários externos
autenticados; não é evidência de restrição da pessoa que utiliza link anônimo.

| `policies.items.id` | Fonte/mapping para valor atual | Baseline aprovado na Q4 | Limitação/estado da validação |
| --- | --- | --- | --- |
| `external-sharing` | `Get-SPOTenant.OneDriveSharingCapability`; `sharingCapability` do Graph é teto SharePoint, não configuração específica OneDrive | Convidados autenticados e domínios aprovados; preservar categoria textual Restrito | Shell/CSOM com certificado; contrato documentado, sem execução nessa modalidade |
| `anonymous-links` | Capacidade OneDrive acima combinada com `FileAnonymousLinkType`/`FolderAnonymousLinkType` | Se permitidos, somente exibição com prazo de até 30 dias | Shell/CSOM; enum/override devem ser importados como retornados |
| `anonymous-edit-links` | `FileAnonymousLinkType`/`FolderAnonymousLinkType` e permissões atuais do inventário | Bloqueado; qualquer exposição atual de edição é achado prioritário | Setting e ocorrência efetiva são fatos distintos; criação histórica não prova link ativo |
| `default-link-type` | `OneDriveDefaultShareLinkScope` e `OneDriveDefaultLinkToExistingAccess` de `Get-SPOTenant`, resolvendo herança/default global | Pessoas específicas | Shell/CSOM; “Pessoas com acesso existente” não é “Pessoas específicas” |
| `default-link-expiration` | `OneDriveAnyoneSharingLinkRecommendedExpirationInDays`, `OneDriveAnyoneSharingLinkMaxExpirationInDays` e restrição global pertinente | Recomendado 30 dias; máximo 30 para links anônimos quando existirem | Shell/CSOM; não chamar validade de link anônimo de validade universal de todo link |
| `unmanaged-device-sync` | `Get-SPOTenant.ConditionalAccessPolicy` + políticas CA efetivas e exceções; flag Graph de restrição de sync por domínio é evidência complementar | Bloquear sync corporativo em dispositivo não conforme/não gerenciado | CA é reutilizada; Graph `isUnmanagedSyncAppForTenantRestricted` restringe domínio, não comprova gerenciamento Intune |
| `offline-access` | Configuração SharePoint/CSOM por site/biblioteca, inclusive exclusão do cliente offline, e controles de acesso relevantes | Permitido somente no recorte gerenciado aprovado | Não existe boolean global equivalente selecionado; `ExcludeFromOfflineClient` não prova todo mecanismo de download offline; publicar parcial/desconhecido quando não avaliável |
| `download-limit` | Regra local publicada pelo Orkestria; detector e estado de ativação próprios, sem configuração Microsoft equivalente | Detector ativo para mais de 500 arquivos distintos em 30 minutos por ator, sem bloqueio automático | Semântica local aprovada na Q4; não mapear para throttling do serviço |
| `block-download` | `Get-SPOSite -Detailed`/CSOM, `BlockDownloadPolicy`, exceções e escopo por site; controles de acesso para não gerenciados permanecem independentes | Habilitar no OneDrive de caso técnico de desligamento ou conteúdo confidencial confirmado, com exceções aprovadas explícitas | Shell/CSOM; não é boolean tenant universal; enforcement depende da licença SharePoint Advanced Management aplicável |
| `known-folder-move` | Export `OneDriveSyncHealth_v1`, políticas KFM e `KFMEnabledFolders` por cliente elegível | Desktop, Documents e Pictures protegidas nos clientes Windows elegíveis que suportam as três pastas | Export aprovado; outros clientes são excluídos explicitamente do denominador; atribuição de política não prova aplicação |
| `legacy-authentication` | `isLegacyAuthProtocolsEnabled` da fotografia Graph SharePoint | Bloqueada | Leitura já validada; não substitui políticas globais de autenticação de outros workloads |
| `conditional-access` | Fotografia canônica `GET /identity/conditionalAccess/policies?$top=100`, avaliando estado, escopo de SharePoint/Office 365, usuários e exceções | Política em enforcement com escopo suficiente para OneDrive | Leitura app-only já evidenciada em Configurações/Identidade e Acesso; report-only não equivale a aplicada |
| `mfa-required` | Mesma fotografia CA, `grantControls`/authentication strength, escopo e operador; Security Defaults é fato complementar específico | Exigir MFA no escopo OneDrive aprovado | Leitura CA reutilizada; registro/capacidade de MFA não comprova exigência, nem `OR` com outro controle garante MFA |
| `guest-access` | Capacidade OneDrive de `Get-SPOTenant`, condições de convite/resharing Graph e regras de acesso/guest aplicáveis | Convidados autenticados com acesso restrito | Sem catálogo completo/exceções não afirmar conformidade global |
| `allowed-domains` | `sharingDomainRestrictionMode`, `sharingAllowedDomainList`/`sharingBlockedDomainList` da fotografia Graph e overrides de site quando houver | Allowlist aprovada; comparar domínios autorizados, sem número universal | Leitura Graph validada; “5 domínios” é amostra visual, não baseline de produção |
| `default-quota` | `personalSiteDefaultStorageLimitInMB` da fotografia Graph; quota individual segue a fonte canônica de contas | 1 TB como referência inicial, ajustável à licença/necessidade | Leitura Graph validada; o padrão não prova quota de cada conta nem direito da licença |
| `max-file-size` | Limite público do serviço OneDrive/SharePoint, versionado com fonte/data | 250 GB conforme documentação vigente | Não é configuração personalizável do tenant; mostrar origem de limite do serviço, sem fingir GET |
| `version-retention` | `Get-SPOTenant` (`EnableAutoExpirationVersionTrim`, `MajorVersionLimit`, `ExpireVersionsAfterDays`) e override de biblioteca/site | R4: referência manual500versões, sem requisito de prazo em dias | Manual500 alinhado e outro número divergente do baseline; automático publicado/não avaliável contra500. `ExpireVersionsAfterDays` pode continuar factual, mas não participa dessa avaliação; não inferir falha de segurança por divergência numérica |
| `onedrive-recycle-bin` | Regra pública do serviço corporativo de 93 dias a partir da exclusão original | 93 dias, identificados como janela do serviço | Não é retenção de usuário desligado nem política Purview; exclusão manual/quota pode encerrar antes |
| `second-stage-recycle-bin` | Regra pública: segundo estágio usa o restante da mesma janela total de 93 dias | Restante da janela total de 93 dias | Correção aprovada na Q4; sem novo prazo independente de 30 ou 93 dias |

Fontes primárias da tabela: [SharePoint settings Graph](https://learn.microsoft.com/en-us/graph/api/resources/sharepointsettings?view=graph-rest-1.0),
[Connect-SPOService com certificado](https://learn.microsoft.com/en-us/powershell/module/microsoft.online.sharepoint.powershell/connect-sposervice?view=sharepoint-ps),
[settings SPO](https://learn.microsoft.com/en-us/powershell/module/microsoft.online.sharepoint.powershell/set-spotenant?view=sharepoint-ps),
[limites de versão](https://learn.microsoft.com/en-us/sharepoint/set-default-org-version-limits),
[bloqueio de download](https://learn.microsoft.com/en-us/sharepoint/block-download-from-sites),
[controle de não gerenciados](https://learn.microsoft.com/en-us/sharepoint/control-access-from-unmanaged-devices),
[limites do serviço](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits),
[janela dos dois estágios da lixeira](https://support.microsoft.com/en-us/sharepoint/admin/restore-deleted-items-from-the-site-collection-recycle-bin).

## Fontes complementares de política: modalidade de autenticação

**SharePoint Management Shell/CSOM:** a documentação atual de
`Connect-SPOService` oferece identidade de aplicação com certificado, além de
modalidades interativas/managed identity. CSOM app-only Entra exige certificado;
o `client_secret` Graph não deve ser reaproveitado como prova de acesso CSOM.
As [permissões de aplicação SharePoint](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azuread)
e o acesso administrativo compatível devem ser concedidos à identidade do
collector/export; não confundir `SharePointTenantSettings.Read.All` do Graph
com autorização para todas as operações administrativas SPO. Escolher um
export de leitura que publique somente os campos do mapping e um manifesto
tenant-scoped. A modalidade está documentada, mas não foi executada nesta
investigação; nenhuma resposta Shell/CSOM foi registrada como GET validado.

**Purview:** o catálogo Graph `retentionLabels` continua delegated-only.
Existe alternativa documentada de automação app-only por
`Connect-IPPSSession`, certificado, `Exchange.ManageAsApp` da API Microsoft
Exchange Online Protection, consentimento e roles/RBAC de leitura compatíveis.
Leitores selecionados para a estratégia de export: `Get-DlpCompliancePolicy`/`Get-DlpComplianceRule` para
configuração DLP; `Get-RetentionCompliancePolicy -DistributionDetail` e
`Get-RetentionComplianceRule` para escopo/duração/ação de retenção;
`Get-ComplianceTag` para catálogo de rótulos; `Get-Label`/`Get-LabelPolicy`
para configuração/publicação de sensibilidade quando necessárias. Isso
remove a hipótese de que toda postura Purview exige OBO, mas não constitui
validação executada desses leitores. A role de cada cmdlet e o schema
exportado precisam ser validados na modalidade escolhida.

Usar `-DistributionDetail` é necessário para escopo/distribuição de retenção:
a Microsoft alerta que `DistributionStatus` e propriedades `*Location` podem
ser inexatas sem ele. `Workload` isolado também não identifica a aplicação
efetiva a OneDrive. Considerar `OneDriveLocation`, exceções, estado e resultado
de distribuição. Política configurada não prova quantidade de arquivos/bytes
preservados nem vencimento de cada arquivo/caso.

Fontes: [autenticação app-only de Security & Compliance PowerShell](https://learn.microsoft.com/en-us/powershell/exchange/app-only-auth-powershell-v2?view=exchange-ps),
[leitura DLP](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-dlpcompliancepolicy?view=exchange-ps),
[leitura de retenção](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-retentioncompliancepolicy?view=exchange-ps),
[catálogo de rótulos de retenção](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-compliancetag?view=exchange-ps).

**Defender:** Graph `alerts_v2` continua a fonte validada de achados. Estado de
controle Safe Attachments para SharePoint/OneDrive, Safe Links em Office e
proteção de arquivos infectados têm leitores complementares selecionados em
Exchange Online PowerShell (`Get-AtpPolicyForO365`, `Get-SafeLinksPolicy`) e
SharePoint (`DisallowInfectedFileDownload`). Não generalizar controle de email
para proteção OneDrive. [Get-AtpPolicyForO365](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-atppolicyforo365?view=exchange-ps)
descreve política de proteção SharePoint/OneDrive/Teams. A modalidade app-only
do Exchange usa sua própria `Exchange.ManageAsApp`, consentimento e roles de
leitura; o consentimento de SecurityAlert Graph não a substitui.
O catálogo de arquivos em quarentena tem fonte complementar selecionada em
`Get-QuarantineMessage`, com o mapping/recorte detalhado abaixo. Ausência de
alertas, resolução de incidente ou quarentena de email não satisfazem esse
fato.

**Intune:** catálogos de configuração `beta` foram evidenciados em
[Configurações por Serviço](../../configuracoes/configuracoes-por-servico/api.md).
`beta` é aceito pelo usuário nesta tarefa. A coleção de políticas não publica
sozinha todos os settings, atribuições ou o resultado aplicado. Se usada para
postura KFM, complementar com settings/assignments e resultado, com
`DeviceManagementConfiguration.Read.All`, Intune licenciado e validação das
operações específicas. A telemetria Data Connect permite observar KFM sem
afirmar aplicação de uma política Intune.

## Clarify — avaliação aprovada das nove dimensões

Os pesos são do DOCX; critérios/limiares Orkestria foram aprovados na Q4.
As fórmulas executáveis e regras de precisão/denominador/ausência estão no
[baseline aceito](../backend-defaults-e-clarificacoes.md).
A tabela abaixo associa os fatores às fontes. Cada dimensão mantém peso fixo e indisponibilidade
explícita. Controles sem evidência contribuem zero, conforme contrato vigente,
sem inferir ausência de política.

| Dimensão/peso | Evidência para avaliação factual | Critério aprovado — detalhes no baseline |
| --- | --- | --- |
| Compartilhamento externo — 20% | Configuração OneDrive específica, allowlist aprovada e permissões atuais com cobertura | Média de baseline de capacidade/convidados/domínios e razão de arquivos externos classificados sem risco alto/crítico |
| Links anônimos — 15% | Tipos/permissões permitidos, prazos configurados e links atuais inventariados | Média de configuração alinhada, links sem escrita/conteúdo confidencial e links com prazo factual até 30 dias desde a criação |
| Proteção de dispositivos — 15% | Controles CA de acesso/sync e população Intune publicada, independente de Health | C2 aceita A: média de enforcement CA e razão de IDs Intune únicos com `managementState=managed` e `complianceState=compliant` sobre IDs Intune únicos elegíveis publicados. Não é razão de clientes OneDrive; ausência não entra no numerador e conserva cobertura/motivo |
| DLP e classificação — 15% | Export Purview de política em enforcement com escopo/distribuição OneDrive + avaliação por item | Média de política DLP efetiva e razão de arquivos suportados avaliados com rótulo sobre os suportados elegíveis |
| Retenção — 10% | Política/escopo/duração/ação de retenção e processos locais com aprovação | Média de política ativa conhecida e razão de casos técnicos com responsável/plano aprovado; ausência de workflow humano não cria plano |
| Known Folder Move — 10% | Clientes Windows elegíveis do export e pastas protegidas | Razão dos clientes Windows elegíveis com Desktop, Documents e Pictures protegidas; exclusões declaradas |
| Antimalware/Defender — 5% | Configuração Safe Attachments OneDrive e download infectado | Média de Safe Attachments SPO/OneDrive habilitado e download de infectado bloqueado; alertas/quarentena são independentes |
| Autenticação — 5% | Legacy auth SharePoint e exigência MFA efetiva no escopo | Média de legado bloqueado e MFA exigida com escopo/exceções resolvidos |
| Auditoria — 5% | Ambos os feeds, collector, watermark, continuidade e frescor | Ambos habilitados, última coleta completa até 1h e ledger sem lacuna de ingestão de conteúdos publicados nas últimas 24h |

Comparações D30 precisam de snapshots das avaliações com a mesma versão de
baseline/fórmula. Mudança de regra não vira melhora/piora de postura sem
reavaliação comparável. No primeiro ciclo, não publicar delta de score ou risco
inventado.

**Disposição A3/C2:** os IDs Intune são deduplicados dentro da geração e
universo publicados; registro sem identidade válida não cria dispositivo e
reduz cobertura. O denominador inclui os dispositivos elegíveis desse
inventário, não todos os endpoints OneDrive. Gerenciamento/conformidade
desconhecidos não são sucesso. Fator ausente ou denominador factual zero segue
a regra aprovada de contribuição zero com motivo no peso fixo, sem alegar
postura universal. C2 revisa o universo do fator, preserva os dois componentes,
o peso15, precisão e falhas; baselines anteriores não geram comparação D30
compatível sem reavaliação. Não unir Health/Intune por nome ou pessoa.

## O que o baseline fecha e o que exige validação real

O baseline fecha critérios, textos recomendados e regras locais; as fontes
Graph já evidenciadas permitem implementação das respectivas projeções.
Onboarding de certificado/consentimento/licença é condição abstrata de acesso,
não bloqueio global da fonte. Contudo, leitores Shell/CSOM/Purview/Exchange
ainda sem sessão, schema de export e mapping executado não se tornam
“validados” por essa condição. Antes de publicar valores atuais desses
domínios, a modalidade escolhida precisa de evidência de resposta/schema e
projeção. Nenhuma rota HTTP desses serviços foi inventada no OpenAPI/Simulator.
Downloads locais, segunda lixeira e baseline de domínios foram definidos na Q4.
Retenção preservada/quarentena usam fontes selecionadas
abaixo com perfil de entrada e primeira extração validados no onboarding;
ausência de fato confirmado não recebe default factual.

## Fontes selecionadas: catálogo de quarentena e governança de retenção

### Quarentena de arquivos de colaboração

Fonte selecionada: export de metadados de leitura por Exchange Online
PowerShell, com `Get-QuarantineMessage -EntityType SharePointOnline -QuarantineTypes SPOMalware`,
paginação por `-Page`/`-PageSize`, e detalhes por `-Identity` quando necessários.
A documentação atual usa o enum `SharePointOnline`; `Spo` não é valor
documentado. O exemplo oficial de `-QuarantineTypes SPOMalware` identifica
arquivos protegidos por Safe Attachments em SharePoint, OneDrive e Teams.
Não usar parâmetros de email como vínculo factual de arquivo OneDrive.

Autenticação selecionada: `Connect-ExchangeOnline` app-only com certificado,
`Exchange.ManageAsApp` da API Office 365 Exchange Online, consentimento e
roles/RBAC de leitura do cmdlet. Essa é uma modalidade documentada, sem sessão
executada nesta investigação. O perfil de export deve registrar a versão do
módulo e os campos reais retornados, confirmar a role de leitura e validar a
primeira extração completa. Não inventar endpoint HTTP do cmdlet.

O [contrato do cmdlet](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-quarantinemessage?view=exchange-ps)
documenta filtros, identidade e paginação, mas não publica schema completo
tipado do resultado para arquivos. O
[contrato funcional Microsoft da quarentena](https://learn.microsoft.com/en-us/defender-office-365/quarantine-admin-manage-messages-files#view-quarantined-files)
descreve Location (SharePoint/OneDrive), nome e URL do arquivo, tamanho,
status de liberação, expiração e, no detalhe, Document ID, Organization e
instante da detecção. O perfil imutável de onboarding mapeia essas semânticas
aos nomes/tipos efetivamente retornados; `FileName`/`SharePointUrl` não são
nomes de propriedades garantidos pela página do cmdlet. Sem vínculo de URL
ou documento comprovado no export, o registro não alimenta a contagem factual
OneDrive.

Mapping para `defenderIntegration.quarantinedFiles`: contar documentos únicos
do catálogo de quarentena não liberados, com chave de documento e URL/local
correlacionadas à fotografia de sites pessoais do próprio tenant. Deduplicar
registros da mesma identidade/documento, validar HTTPS, host e limite exato de
path do site; arquivos SharePoint de equipes ficam fora do recorte OneDrive.
URLs/nomes e organização são PII/metadados sensíveis e não são serializados no
contrato de UI. `PermissionTo*` descreve permissões do executor, não o estado
de proteção ou ações permitidas ao destinatário.

Paginar todas as páginas: a documentação limita `Page` e `PageSize` a
`1..1000`. Se o limite impedir fechar o inventário, particionar a janela de
recebimento com deduplicação e conservar cobertura parcial até reconciliação
completa. Export com falha/perfil incompatível preserva a publicação anterior;
zero só é publicado após consulta completa, perfil válido e recorte
reconciliado. O valor significa **catálogo atual de arquivos em quarentena**:
a Microsoft ressalta que a expiração/remoção do registro da quarentena pode
deixar o arquivo bloqueado no OneDrive. Ele não é contagem de todo arquivo
bloqueado ou de todo arquivo malicioso histórico.

### Retenção efetiva dos arquivos atuais — R5 aceita A

A [R5](../backend-defaults-e-clarificacoes.md#r5--arquivos-sob-retenção-e-cópias-preservadas-aceita-a)
substitui o mapping físico da Q4 para duas métricas do card, preservando cinco
linhas. É projeção local de fontes já selecionadas: inventário completoQ5,
export Purview por certificado e leitura Graph de retenção aplicada por item.
Não exige endpoint novo nem mistura PHL com originais.

| Fato do contrato | Mapping selecionado | Unidade/universo e condição |
| --- | --- | --- |
| `retentionGovernance.activePolicies` | Export Purview `Get-RetentionCompliancePolicy -DistributionDetail` + regras, estado, escopo OneDrive e exceções | Políticas efetivamente em enforcement no recorte, com distribuição confirmada; não contar todo catálogo ou `Workload` isolado |
| `retentionGovernance.currentRetainedFileCount` | Arquivos atuais do inventárioQ5, deduplicados por `(driveId,itemId)`, unidos a escopo/regra Purview efetivos ou rótulo realmente aplicado por `itemRetentionLabel` e sua regra resolvida | Cardinalidade de arquivos únicos com ação de reter vigente comprovada. Excluir pastas, remotos duplicados, tombstones, excluídos e cópiasPHL; vários vínculos não multiplicam um arquivo |
| `retentionGovernance.currentRetainedBytes` | Soma de `driveItem.size` corrente dos mesmos arquivos únicos que alimentam a contagem anterior | Bytes lógicos atuais, sem versões, lixeira, metadados de ocupação ou cópiasPHL. Tamanho ausente de algum arquivo protegido impede total de bytes; não substituir por Report StorageUsed/quota nem por StorageMetrics |
| `retentionGovernance.usersWithRetention` | Escopo de políticas/rótulos efetivos, sites pessoais e vínculo de proprietário resolvido | Pessoas distintas comprovadamente alcançadas no universo observado; contagem de arquivos ou inventárioPHL não substituem esse fato |
| `retentionGovernance.filesWithNominalRetentionEnd15d` | Inventário Q5 + export Purview de regras/aplicação efetivas + metadados por item admitidos; combinar preservações aplicáveis e âncoras conforme C8 | Arquivos atuais únicos cujo fim combinado finito esteja entre D e D+15 dias UTC, inclusive. Uma vez por arquivo; contexto de hold, regra, escopo ou âncora não resolvido permanece não determinável, com cobertura própria. Não é contagem de aplicações ou casos |

Resolver proprietário/site/drive/item e identidade/versionamento da regra por
vínculos únicos e compatíveis com as fotografias admitidas. Para políticas,
usar estado, resultado de distribuição, inclusãoOneDrive e exclusões
efetivos. Para rótulos, o catálogo disponível ou uma política de autoaplicação
não prova aplicação ao arquivo: exigir metadados realmente publicados pela
leitura por item. Nome textual ambíguo não sustenta join. O perfil de export
mapeia os campos reais; não inventar uma propriedade por arquivo no Purview.

A ação deve reter, não somente excluir. Prazo finito exige trigger e âncora
factuais resolvidos e ainda vigentes; prazo indefinido exige regra explícita.
Escopo adaptativo não resolvido, aplicação/distribuição desconhecidas,
resposta por item sem campos, âncora ausente ou conflito não resolvido deixam
o arquivo desconhecido. A existência de uma política configurada não confirma
proteção de todos os arquivos, e a ausência de rótulo não exclui uma política
aplicável. Fatos humanos de desligamento não substituem âncora Microsoft.

Publicar elegíveis, avaliados, desconhecidos e exclusões por referência e
disponibilidade de cada métrica. Subtotal comprovado em avaliação parcial
identifica o recorte; total global requer inventário e avaliação íntegros.
Zero exige avaliação completa de ausência, não ausência de collector, fonte ou
PHL. Quantidade já sustentada pode sobreviver à falta de tamanho; bytes sem
integridade ficam nulos. As primeiras leituras/perfis continuam sendo
pré-requisitos da publicação futura, sem afirmar que ocorreram nesta revisão.

Os campos/valores históricos `filesInRetention`/`preservedBytes` da fixture
não passam a representar essas medidas por renomeação silenciosa. A futura
integração publica os novos bindings semânticos e reconcilia a UI. Políticas,
usuários e vencimentos preservam contratos independentes; nenhum prazo ou
volume físico pode ser inferido desta quantidade.

### Artefatos da Preservation Hold Library — fonte física independente

Fonte anteriormente selecionada na Q4: export de metadados SharePoint CSOM
app-only com certificado, pela mesma modalidade complementar de leitura.
A R5 retira essas medidas das duas linhas do card; sua leitura física não é
pré-requisito da projeção de arquivos atuais/volume. O contrato externo
documentado permanece como evidência independente, sem acrescentar métricas
visíveis nesta opção. Caso consumido, o onboarding vincula cada site
pessoal e sua biblioteca sistema de preservação a IDs estáveis e verifica o
perfil de metadados na primeira extração. Nome textual sozinho não autentica
a biblioteca: exigir vínculo ao site pessoal, identificação de sistema
(`List.IsSystemList`) e confirmação da biblioteca/endereço e tipo na origem.
Não adotar GUID de template ou nome de campo encontrado em resposta de fórum
como contrato universal. A biblioteca pode não existir antes de ser necessária;
isso é distinto de erro de acesso ou inventário incompleto.

O Graph tem primitiva documentada para descobrir listas sistema: incluir
`system` no `$select` de `lists` torna essas listas visíveis. A estratégia
selecionada é o export CSOM; não foi criada chamada Graph adicional para
substituir a identificação de PHL nem executada consulta de PHL nesta rodada.
[Listas sistema](https://learn.microsoft.com/en-us/graph/api/list-list?view=graph-rest-1.0),
[IsSystemList](https://learn.microsoft.com/en-us/dotnet/api/microsoft.sharepoint.client.list.issystemlist?view=sharepoint-csom).

O perfil selecionado exporta metadados de `RootFolder.StorageMetrics` e,
quando necessários para correlação por item, itens paginados de
`List.GetItems(CamlQuery)`/`ListItemCollectionPosition`, identificador, tipo
arquivo/pasta e metadados do arquivo. Só leitura de metadados: o DOCX pede
governança e a Microsoft não suporta edição/exclusão/movimentação manual dos
arquivos automaticamente preservados. A leitura não cria hold, biblioteca,
arquivo nem job de limpeza.

| Fato físico independente — não alimenta o card R5 | Mapping documentado | Unidade/universo e condição |
| --- | --- | --- |
| Quantidade de artefatosPHL | `RootFolder.StorageMetrics.TotalFileCount` das PHL identificadas | Arquivos/artefatos atuais das bibliotecas de preservação; exclui versões como contagem independente. Não é quantidade de arquivos originais sob política |
| OcupaçãoPHL | `RootFolder.StorageMetrics.TotalSize` das mesmas PHL | Ocupação em bytes incluindo stream, versões e metadados. Não substituir por `TotalFileStreamSize`, que exclui versões/metadados |

As [especificações CSOM de TotalFileCount](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/a341e801-7b35-4001-b2ab-f295971b67cb)
e [TotalSize](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/fb1c205e-0bd9-4109-a6a1-9f2d97780e41)
definem precisamente as unidades e exclusões. `TotalFileCount` exclui versões,
anexos de lista e documentos não customizados; `TotalSize` inclui stream,
versões e metadados de itens sob pasta/subpastas. Guardar também a data das
métricas para não misturar observações diferentes. Valores de biblioteca
parcial ou inacessível não são zero.

A [semântica oficial de preservação](https://learn.microsoft.com/en-us/purview/retention-policies-sharepoint)
explica que a PHL guarda cópias/versões por retenção; conteúdo não alterado pode
continuar em sua localização original. A Q4 havia escolhido esses fatos
físicos para o card; a R5 os substitui por arquivos atuais comprovadamente
retidos e seu volume. Não reinterpretar métricasPHL como quantidade/volume de
originais nem os novos bytes correntes como ocupação física de cópias.

### Fim nominal combinado dos arquivos atuais — B10/C8 aceita A

**Decisão do usuário em 2026-10-15:** contar arquivos atuais únicos pelo fim
nominal combinado finito de retenção, com o rótulo “Arquivos com fim nominal de
retenção (15 dias)”. O novo binding é
`retentionGovernance.filesWithNominalRetentionEnd15d`; o antigo
`expiringWithin15Days` permanece referência histórica sem unidade
reinterpretada. Esta seção substitui o mapping ambíguo “por item/caso”, sem
reabrir R5 ou alterar as outras quatro linhas do card.

#### Fontes e fatos necessários — sem coleta adicional

Reutilizar inventário Q5 e exports/perfis Purview já selecionados em R5.
`Get-RetentionCompliancePolicy -DistributionDetail` e suas regras sustentam
estado, distribuição, inclusão/exceção OneDrive, ação, duração e trigger quando
publicados; `Get-ComplianceTag` resolve a regra do rótulo. O
`itemRetentionLabel` Graph já selecionado informa aplicação, nome, instante e
settings somente quando retornados; não publica um vencimento pronto e um
`200` sem campos continua desconhecido. A identidade/versionamento da regra
deve ser unívoca; nome textual ambíguo não sustenta join.

| Fato de entrada | Fonte/transformação admitida | Ausência ou limite |
| --- | --- | --- |
| Arquivo atual, identidade e vínculo ao espaço OneDrive | Inventário Q5 corrente, chave `(driveId,itemId)` e vínculos canônicos de site/drive | Página da tabela não determina população; excluir pastas, remotos duplicados, tombstones/excluídos, versões e cópiasPHL |
| Preservações aplicáveis vigentes | Regras/políticas Purview com escopo/distribuição efetivos e rótulo realmente aplicado por item | Catálogo disponível, autoaplicação apenas configurada ou `Workload` isolado não provam aplicação; escopo/grupo/condição não resolvido mantém desconhecido |
| Duração, unidade, ação, trigger e âncora | Perfil Purview admitido; criação/modificação factuais do item ou aplicação do rótulo; evento-base somente se realmente publicado pelas fontes admitidas | Regra apenas de excluir não prova retenção; não usar observação/download, data de bloqueio/desligamento ou prazo recomendado/local do caso como âncora Microsoft |
| Holds, revisão e cadeia de preservação | Somente fatos e contexto explicitamente admitidos pelas mesmas fontes/perfis aprovados | Não presumir ausência de hold nem um catálogo completo a partir de campo/registro ausente. Hold/revisão pendente, indefinida, substituição ou conflito não resolvido impede fim combinado determinável |
| Referência, revisão e cobertura | Geração consistente das publicações locais e perfil de avaliação versionado | Não misturar referências incompatíveis nem usar hora do browser; fatos não apurados permanecem nulos |

O perfil da duração deve conhecer a unidade e o calendário aplicáveis à fonte;
conversão não comprovada não ganha duração default. A ausência de uma fonte
de contexto de hold não autoriza inventar um leitor ou resultado negativo:
o arquivo permanece não determinável, com motivo explícito. Configurar/admitir
o perfil e a primeira extração continua a estratégia aprovada, sem alegar
execução ou cobertura de customer nesta revisão.

#### Combinação, identidade e janela

1. Reconciliar as preservações aplicáveis vigentes de cada arquivo pela
   identidade estável da regra/aplicação, revisão e referência compatíveis.
   Repetição idêntica é replay; aplicações substituídas e revisões antigas
   são históricas e não viram vínculos correntes extras. Não somar linhas de
   rótulo/política como unidades da métrica.
2. Calcular cada data final nominal somente com duração/unidade, trigger e
   âncora factual resolvidos. Criação, última modificação, aplicação e evento
   de retenção são âncoras distintas. Preservar precisão; não adivinhar uma
   data de evento nem converter ausência de campo em início da retenção.
3. Aplicar as precedências Microsoft documentadas às preservações resolvidas.
   Entre preservações simultâneas que continuam retendo, o fim combinado é a
   data final mais tardia. Não usar `max(duração)` sem considerar as âncoras:
   uma duração menor pode terminar depois por começar mais tarde. Se outra
   regra, hold, revisão, substituição, escopo ou âncora aplicável não estiver
   resolvido, não confirmar um fim finito para o arquivo. Retenção indefinida
   também não fornece fim finito para esta contagem.
   A avaliação conserva chave do arquivo, regras/revisões e âncoras usadas,
   cada data final admitida e o fim combinado resultante, ou fim nulo e motivo
   quando não determinável; não precisa serializar payload bruto na UI.
4. Definir D como `referenceDate`, data UTC factual da avaliação admitida.
   Converter o fim combinado para sua data UTC preservando a referência
   original e admitir somente `0 <= dataUTC(fimCombinado) - D <= 15`, em dias
   de calendário UTC. Publicar `window.startDateInclusive=D` e
   `window.endDateInclusive=D+15dias`. Datas anteriores a D ficam fora; D e
   D+15 entram. Sem D, não construir janela nem valor com o relógio local.
5. Contar uma vez cada `(driveId,itemId)` qualificante. Regras terminando em
   10 e 400 dias deixam o arquivo fora. Vários vínculos com fim combinado em
   10 dias produzem um arquivo, não vários prazos. `size` ausente não impede
   essa contagem: a disponibilidade de bytes de R5 continua independente.

Os [princípios Microsoft de retenção](https://learn.microsoft.com/en-us/purview/retention)
comprovam a precedência e a comparação das datas finais, considerando âncoras.
[Retenção em SharePoint/OneDrive](https://learn.microsoft.com/en-us/purview/retention-policies-sharepoint)
separa o prazo nominal do processamento e de outras preservações.
[itemRetentionLabel](https://learn.microsoft.com/en-us/graph/api/resources/itemretentionlabel?view=graph-rest-1.0)
e [retentionLabel](https://learn.microsoft.com/en-us/graph/api/resources/security-retentionlabel?view=graph-rest-1.0)
documentam aplicação e triggers; nenhum desses fatos isolados garante ausência
de outra preservação. Não publicar liberação, exclusão automática/realizada,
vencimento de caso local ou economia de armazenamento a partir desta métrica.

#### Publicação, desconhecidos e histórico

A projeção publica o objeto de medida definido no [contrato](contratos.md#arquivos-com-fim-nominal-de-retenção--c8-aceita-a):
`value`, unidade `file`, datas inclusivas, `referenceDate`, `asOf`, `coverage`,
`availability` e `ruleRevision`. O valor é cardinalidade inteira, sem
percentual/arredondamento. `asOf` conserva a referência factual e precisão da
avaliação; não dar horário a uma origem que publica somente data.

Cobertura usa arquivos atuais do escopo, não quantidade de políticas ou casos:
eligible = população Q5 quando conhecida; observed = arquivos únicos
observados; evaluated = arquivos com contexto suficiente para decidir se
qualificam, inclusive não abrangidos comprovados; unknown = eligible menos
evaluated somente quando ambos forem conhecidos. Sem população elegível
apurada, unknown continua nulo. Motivos distinguem hold/indefinida, cadeia,
escopo, âncora e origem não resolvidos, sem converter não determinável em
ausência de retenção. Se não há referência ou nenhuma avaliação factual
suficiente, `value` é nulo. Quando as contagens forem conhecidas, exigir
`value <= evaluated <= observed <= eligible`, sem corrigir inconsistência
por clamp, estimativa ou alteração de população.

Subtotal positivo em cobertura parcial é explicitamente observado; zero
global só após inventário, vínculos, regras/contexto e avaliação íntegros sem
qualificantes ou desconhecidos. Cobertura parcial sem qualificante comprovado
mantém valor nulo, sem zero. Paginação incompleta, fonte restrita ou falha
mantém disponibilidade própria ou última publicação válida com frescor; não
publicar zero ou somar snapshots. Cada medida do card continua independente.
Guardar a avaliação e sua revisão nos snapshots de postura por 400 dias já
aprovados, sem comparação histórica nova nem reinterpretação de
`expiringWithin15Days` ou do número sintético da fixture. Datas/fatos de
eventos expirados não são reconstruídos. B10 fecha no recorte C8 aceito com
mapping local sobre fontes já selecionadas; não muda API externa, Simulator,
collector ou workflow humano.

### Perfil comum dos exports complementares — aprovado na Q4

Para SPO/Purview/Exchange, registrar nome/versão do módulo, leitores executados,
autorização compatível, schema e mapping imutáveis, período/data de referência,
tenant/site binding, estado de conclusão e lista de arquivos do run. O
importer é tipado no contrato normalizado e valida o run inteiro antes de
publicar. Um perfil novo ou incompleto não é aceito com conversão permissiva;
primeira extração completa no onboarding demonstra o mapping factual.
O manifesto acompanhante é contrato local da integração, não uma promessa de
manifesto universal desses providers.

Para `dlpPolicyDistribution`, conservar os valores nativos de Mode do export
Purview e a configuração de regras/escopo; `Enable`, `Disable`,
`TestWithNotifications` e `TestWithoutNotifications` são modos distintos.
O mapping para os quatro rótulos existentes é: `Enable` → Ativa,
`Disable` → Desativada, `TestWithoutNotifications` → Somente Monitoramento e
`TestWithNotifications` → Em Teste. Ambos os modos Test permanecem sem
enforcement; notificações de teste não comprovam bloqueio. Validar também
estado/distribuição/escopo e regras aplicáveis; enum não reconhecido fica fora
do universo avaliado com coverage, sem classificação inventada. Esse mapping
integra o perfil semântico versionado de produto. Não usar ausência de alerta
DLP para produzir distribuição ou sucesso de policy.

Para os três controles de `defenderIntegration`, o perfil deve trazer a
propriedade real de proteção SPO/OneDrive/Teams (incluindo
`EnableATPForSPOTeamsODB` de `Get-AtpPolicyForO365`), o setting SharePoint de
bloqueio de download de arquivo infectado e configurações/rules Safe Links
para Office apps com escopo, prioridade e exceções resolvidos. A
[referência Microsoft de configuração](https://learn.microsoft.com/en-us/defender-office-365/safe-attachments-for-spo-odfb-teams-configure)
documenta a leitura de `EnableATPForSPOTeamsODB` e a função de
`DisallowInfectedFileDownload`; o
[modelo Safe Links](https://learn.microsoft.com/en-us/defender-office-365/safe-links-about)
separa proteção de Office apps de email. O estado de um controle do tenant
não garante scan de toda URL/arquivo nem substitui a contagem de ameaças
observadas. O mapping semântico dos controles permanece explícito no perfil;
o exporter não os preenche com valores recomendados.
