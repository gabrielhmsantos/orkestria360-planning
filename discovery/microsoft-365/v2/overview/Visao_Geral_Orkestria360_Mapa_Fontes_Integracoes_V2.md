# Visão Geral Microsoft 365 — Mapa de Fontes e Integrações V2

## Finalidade

Mapear a origem de cada família de evidências da Visão Geral e do IMDO. O mapa separa capacidades existentes na Microsoft Graph das que dependem de produtos Microsoft especializados, módulos internos ou conectores futuros.

## Mapa de fontes

| Fonte | Sinais principais | Integração | Estado V2 | Limitações e pré-requisitos |
| --- | --- | --- | --- | --- |
| Microsoft Graph — diretório | Tenant, domínios, usuários, convidados, roles, grupos, licenças | `/organization`, `/domains`, `/users`, `/groups`, `/directoryRoles`, `/subscribedSkus` | Parcialmente disponível | Exige permissões de leitura de diretório; não resolve regras internas de governança. |
| Microsoft Graph — segurança e identidade | Secure Score, MFA, Conditional Access, alertas, incidentes, risco | `/security/*`, `/reports/authenticationMethods/*`, `/identity/conditionalAccess/*`, `/identityProtection/*` | Parcial | Há disponibilidade dependente de licença, roles e superfície de segurança. Quando a licença/workload de indicador previsto não existe, o IMDO registra `provider_inactive`, nota zero e oportunidade de evolução; `Policy.Read.All` é necessário para Conditional Access e relatórios requerem `Reports.Read.All`. |
| Microsoft Graph — Service Health e reports | Saúde de serviço, incidentes, uso de workloads | `/admin/serviceAnnouncement/*`, `/reports/*` | Parcialmente disponível | Service Health requer `ServiceHealth.Read.All`; reports retornam CSV/redirecionamento e dependem de workload/licença. |
| Intune | Dispositivos gerenciados, compliance, BitLocker, configurações e updates | Microsoft Graph `deviceManagement/*` | Integração futura | Requer Intune ativo e permissões específicas de Device Management. |
| Microsoft Defender | Exposure Score, recomendações, alertas, incidentes e cobertura de dispositivos | Graph Security e Defender XDR API | Integração futura | Nem todos os sinais são cobertos pelo mesmo endpoint; validar licença Defender e permissões de segurança. |
| Microsoft Purview | DLP, retenção, labels, audit, eDiscovery e proteção da informação | Graph/Purview APIs conforme capacidade | Integração futura | A disponibilidade varia por licença e superfície; LGPD e ISO não podem ser inferidas apenas por API. |
| Exchange, Teams, SharePoint e OneDrive | Uso, saúde e configurações de workload | Graph reports, Service Health e APIs administrativas quando aplicável | Parcial | Há métricas e configurações que exigem contratos por workload. |
| Estruturação e Governança | Inventários, documentos, políticas, procedimentos, processos e KPIs | Dados internos do Orkestria | Dependência interna | A fonte normativa é o contrato híbrido [`governance-evidence-form-v1.yaml`](../../../estruturacao-governanca/v2/governance-evidence-form-v1.yaml): texto ou arquivo por seção, revisão obrigatória do admin (`absent`/`partial`/`conformant`), aprovação, validade e cobertura. A implementação do contrato continua futura. |
| Assessment Orkestria | Scores de Segurança, Governança, Compliance e Produtividade | Dados internos do Orkestria | Dependência interna | Confiabilidade indicada pelo sponsor: 80%; requer contrato de resultado e data de aplicação. |
| Microsoft Graph — licenciamento | SKUs, unidades contratadas, atribuídas e disponíveis | `/subscribedSkus`, usuários e relatórios | Parcialmente disponível | É a fonte normativa de SKU e quantidade nesta V2; não traz o preço real pago pelo cliente. |
| Base de custos de licenças Orkestria | Preço/valor unitário efetivamente contratado por SKU e tenant | Base interna própria | Decisão V2 | Fonte normativa do valor real pago/contratado. Cada registro deve vincular tenant e SKU, moeda, preço unitário, vigência e responsável pela manutenção. Complementa as quantidades retornadas pela Graph; não as substitui. |
| Ações e insights Orkestria | Fila priorizada, interpretações, autoria, revisão, execução e evidências | Tabelas próprias por tenant | Decisão V2 | Registros podem ser cadastrados pelo administrador, criados por regras ou sugeridos futuramente por IA. A origem, as evidências e a revisão humana são obrigatórias para publicação. |
| ITSM e provedores de backup | MTTR, causa raiz, backup, restore e DR | Conectores futuros | Fora da fase atual | Backup e evidências de ITSM não entram como nota zero: ficam `not_applicable`, preservam o peso do sponsor, saem do denominador e reduzem a cobertura. DR pode usar evidências internas do Orkestria. |
| Power BI, Power Platform e Copilot | Adoção e uso especializado | APIs específicas de cada produto | Futuro | Não devem ser tratados como métricas Graph genéricas sem validar a fonte e a licença. |
| Cadastro manual | DPO, custos, planejamento e evidências não integráveis | Formulários internos | Futuro | Confiabilidade indicada pelo sponsor: 50%; exige responsável, revisão e validade. |

## Regras de proveniência

- O registro de evidência deve preservar `sourceType`, `sourceReference`, `collectedAt`, `freshness`, disponibilidade e confiabilidade.
- A fonte precisa ser apresentada ao usuário quando a nota depender de Assessment, Governança ou cadastro manual.
- Credenciais, segredos e consentimentos não pertencem a contratos de página ou documentação de score.
- O uso de dados de Graph deve respeitar a disponibilidade real do tenant; erro de permissão ou workload inativo não é evidência negativa.

## Dependências de implementação já existentes

O app contém um seam de Microsoft Graph em `orkestria360/app/Support/Microsoft365/`, com dados de overview, snapshots e client próprio. Ele atende parcialmente a cards, Secure Score, Service Health, licenças, reports, recomendações e auditorias; o IMDO exigirá contratos adicionais, não uma extensão implícita desse payload.

## Próximas validações técnicas

1. Confirmar por tenant as permissões e licenças efetivamente disponíveis.
2. Definir contratos internos para Governança e Assessment antes de somar suas notas ao IMDO.
3. Implementar o cadastro comercial interno de licenças — chave de tenant e SKU, preço/valor unitário, moeda, vigência, renovação e responsável — antes de habilitar custos ou economia em produção. A primeira carga é manual; Partner Center/distribuidor é uma reconciliação futura, não uma dependência para a fonte normativa interna.
4. Homologar, no sponsor, as fórmulas listadas em `../imdo/IMDO_Orkestria360_Pendencias_Homologacao_V2.md`.
