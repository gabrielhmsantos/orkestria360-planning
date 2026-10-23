# IMDO Orkestria360 — Matriz de Indicadores V2

## Como ler esta matriz

Esta é a transcrição normalizada da planilha final do sponsor. `homologada` identifica regra já fechada na planilha; `parcial` e `pendente` identificam regras que serão exercitadas pelas hipóteses do validador em `IMDO_Orkestria360_Hipoteses_Validador_V2.md`, e não perguntas pendentes ao sponsor. Fontes citadas como “futuro” não estão disponíveis por definição nesta V2, mas podem ser simuladas por fixture.

Para evidências provenientes de Estruturação e Governança, a referência de contrato é [`governance-evidence-form-v1.yaml`](../../../estruturacao-governanca/v2/governance-evidence-form-v1.yaml). Ele conserva os oito tópicos de Governança, aceita texto ou arquivo conforme a seção e exige revisão administrativa explícita (`absent`, `partial` ou `conformant`) antes de qualquer fato alimentar o IMDO. O [exemplo JSON](../../../estruturacao-governanca/v2/examples/contoso-governance-submission-v1.json) é apenas uma fixture fictícia de preenchimento e revisão.

## 1. Segurança — 30%

| Indicador | Peso | Evidências principais | Regra definida | Fonte | Estado |
| --- | ---: | --- | --- | --- | --- |
| Secure Score | 20% | `currentScore`, `maxScore`, serviços habilitados | >=85%=100; 80–84=95; 75–79=90; 70–74=85; 60–69=75; 50–59=60; 40–49=40; <40=20 | Graph `/security/secureScores` | homologada |
| MFA | 15% | MFA usuários/admins, métodos fortes, usuários sem MFA | Pesos de evidência 50/30/10/10; faixas apenas para cobertura de admins e métodos | Reports e `/users/{id}/authentication` | parcial |
| Conditional Access | 10% | políticas, habilitadas, recomendadas, exclusões, cobertura | Pesos 20/20/30/15/15; faixas de quantidade e cobertura | Graph `/identity/conditionalAccess/policies` | parcial |
| Defender | 10% | Exposure Score, recomendações, alertas, incidentes, devices | Faixas para Exposure Score e alertas; demais composição sem fórmula | Defender XDR e Graph Security | parcial |
| Intune Compliance | 10% | compliance, BitLocker, Defender, updates, órfãos | Faixas para compliance e órfãos; pesos de evidência definidos | Intune / Graph `deviceManagement` | parcial |
| Identity Protection | 10% | risky users, risky sign-ins, policies, remediação | Faixas de risco; policy/remediação binárias | Entra Identity Protection | parcial |
| Administradores | 10% | número de Global Admins, MFA, PIM, contas nominativas | Pesos de evidência definidos; exemplo sem fórmula | Graph / role management | parcial |
| Legacy Authentication | 5% | protocolos, logins legacy e CA | Faixas de protocolos e volume de sign-ins | Graph, Exchange e Entra | parcial |
| Break Glass | 5% | conta, role, exclusão CA, senha, MFA emergencial, alertas | Regras binárias para existência, CA e alertas; demais sem fórmula | Graph e Entra | parcial |
| Assessment Segurança | 5% | firewall, antivírus, backup, monitoramento, vulnerabilidades, física, conscientização | Reutiliza score do pilar do Assessment | Assessment Orkestria | futura |

Pesos internos: 100%.

## 2. Governança — 20%

| Indicador | Peso | Evidências principais | Regra definida | Fonte | Estado |
| --- | ---: | --- | --- | --- | --- |
| Inventário de Ativos | 15% | existência, aprovação, atualização, campos, cobertura e divergência | Faixas de atualização; exemplo de cobertura; composição parcial | Governança + Graph | parcial |
| Inventário de Licenças | 10% | inventário, atualização, correspondência, custo, aprovação | Faixas de atualização; cobertura exemplificada | Governança, Graph (SKUs e quantidades), tabela de preços Orkestria | parcial |
| Documentação da Infraestrutura | 10% | rede, servidores, M365, Azure, atualização e aprovação | Etapas com peso uniforme de evidência | Governança/Assessment | parcial |
| Políticas Corporativas | 15% | políticas de segurança, backup, senha, acesso, LGPD, BYOD e classificação | Pesos de evidência e etapas de documento | Governança | parcial |
| Procedimentos | 10% | backup, restore, onboarding, offboarding, mudanças, incidentes | Pesos de evidência e etapas de documento | Governança | parcial |
| Processos | 10% | incidentes, mudanças, problemas, ativos, riscos e indicadores | 100/60/0 para implantado/parcial/inexistente | Governança/Assessment | parcial |
| KPIs | 10% | SLA, disponibilidade, chamados, backup, segurança, custos e produtividade | 100/60/0 para implantado/parcial/inexistente | Governança | parcial |
| Assessment Governança | 20% | score do pilar Governança | Reutiliza o score do Assessment | Assessment Orkestria | futura |

Pesos internos: 100%.

## 3. Licenciamento e Custos — 15%

| Indicador | Peso | Evidências principais | Regra definida | Fonte | Estado |
| --- | ---: | --- | --- | --- | --- |
| Utilização das Licenças | 20% | atribuídas/contratadas, planejamento, capacidade e crescimento | 95–98%=100; 90–94=95; 85–89=90; 80–84=80; 70–79=65; <70=40 | Graph `/subscribedSkus` e Governança | parcial |
| Licenças Ociosas | 20% | sem login, sem atividade, bloqueados e desligados licenciados | 0=100; <=2%=95; <=5%=90; <=10%=75; <=15%=60; >15%=30 | Reports, sign-ins e Graph | parcial |
| Aproveitamento Premium | 15% | uso Intune, Defender, Purview, Entra, Power BI, Teams Premium e Copilot | Faixas >=95% a <60%; composição por evidência | Várias fontes Microsoft | parcial |
| Licenciamento Correto | 15% | sub/superdimensionamento, adequação e grupos automáticos | Faixas 1 a <70%; sem definição da métrica base | Graph, Reports e Governança | parcial |
| Economia Potencial | 10% | downgrade, remoção, produtos sem uso e duplicidade | Faixas <=2% a >15% do custo mensal | Graph (SKUs e quantidades) + tabela de preços Orkestria | parcial |
| Renovação | 10% | vigência, monitoramento, avisos, simulação e renovação automática | 100/80/60/0 por itens ausentes; vínculo entre evidências incompleto | Fonte de vigência a definir | futura |
| Compliance de Licenciamento | 10% | sem licença, expiradas, automático, inventário e auditoria | Pesos de evidência, sem conversão em nota | Graph, Governança, Assessment | parcial |

Pesos internos: 100%.

## 4. Compliance — 15%

| Indicador | Peso | Evidências principais | Regra definida | Fonte | Estado |
| --- | ---: | --- | --- | --- | --- |
| Compliance Score | 20% | score, controles, ações pendentes e tendência | >=90%=100; 85–89=95; 80–84=90; 70–79=80; 60–69=65; <60=40 | Purview, Graph e Reports | parcial |
| LGPD | 15% | política, inventário de dados, labels, DLP, retenção, DPO, assessment | 100/60/0 por situação; pesos de evidência | Governança, Assessment e Purview | parcial |
| ISO 27001 | 10% | políticas, risco, acesso, continuidade, inventário e auditorias | 100/60/0 por situação; pesos de evidência | Assessment, Governança e M365 | parcial |
| DLP | 10% | políticas, habilitação, Exchange, SharePoint, OneDrive e alertas | 100/70/0 por situação; pesos de evidência | Purview | parcial |
| Retenção | 10% | políticas, labels, workloads, revisão e conformidade | 100/70/0 por situação; pesos de evidência | Purview | parcial |
| Sensitivity Labels | 10% | criação, publicação, workloads, uso e auto-labeling | Regra binária parcial; pesos de evidência | Purview | parcial |
| Microsoft Purview | 15% | information protection, DLP, lifecycle, eDiscovery, audit e insider risk | 100/60/0 por situação; pesos de evidência | Purview | parcial |
| Assessment Compliance | 15% | score do pilar Compliance | Reutiliza score do Assessment | Assessment Orkestria | futura |

Pesos internos: 100%.

## 5. Disponibilidade — 10%

| Indicador | Peso | Evidências principais | Regra definida | Fonte | Estado |
| --- | ---: | --- | --- | --- | --- |
| Service Health | 20% | serviços saudáveis, incidentes, avisos e indisponibilidade média | Faixas de disponibilidade e incidentes | Graph Service Health | parcial |
| Incidentes | 15% | críticos, MTTR, recorrentes e causa raiz | Faixas para tempo e quantidade; composição parcial | Service Health, ITSM | parcial |
| Backup | 20% | implantação, M365, servidores, restore, monitoramento e política | Faixas para teste de restore e monitoramento | Governança, Assessment e provedores | futura |
| Disaster Recovery | 15% | plano, aprovação, testes, RTO/RPO e revisão | Faixas para teste e regras binárias RTO/RPO | Governança e Assessment | parcial |
| Exchange Online | 10% | disponibilidade, incidentes, mailboxes, fluxo e configuração | Faixas de disponibilidade/incidentes; configuração sem consolidação | Graph e Exchange | parcial |
| Teams | 10% | disponibilidade, incidentes, chamadas, uso e configuração | Faixas de disponibilidade; configuração sem consolidação | Reports e Graph | parcial |
| SharePoint | 5% | disponibilidade, uso, storage, compartilhamento, permissões e configuração | Indicadores descritivos sem função fechada | Graph e SharePoint | parcial |
| OneDrive | 5% | disponibilidade, sync, storage, compartilhamento e configuração | Indicadores descritivos sem função fechada | Reports e Graph | parcial |

Pesos internos: 100%.

## 6. Produtividade — 10%

| Indicador | Peso | Evidências principais | Regra definida | Fonte | Estado |
| --- | ---: | --- | --- | --- | --- |
| Microsoft Teams | 20% | ativos, reuniões, chat, arquivos, canais, devices e Premium | Faixas >=95% a <70%; composição por evidência | Graph Reports | parcial |
| SharePoint | 15% | sites, usuários, compartilhamento, crescimento e colaboração | Faixas >=95% a <70%; crescimento sem fórmula | Graph Reports | parcial |
| OneDrive | 15% | usuários, sync, storage, compartilhamento e crescimento | Faixas >=95% a <70%; crescimento sem fórmula | Graph Reports | parcial |
| Planner | 10% | planos, tarefas, usuários, atualização e colaboração | Hipótese de média ponderada no validador | Planner API | parcial |
| Power BI | 10% | workspaces, relatórios, datasets, refresh e compartilhamento | Sem função de nota | Power BI REST API | futura |
| Power Automate | 10% | fluxos, execuções, sucesso, usuários e criticidade | Sem função de nota | Power Platform Admin | futura |
| Microsoft Copilot | 10% | ativos, frequência, apps, adoção e licenças usadas | Sem função de nota | Copilot/Reports | futura |
| Assessment Produtividade | 10% | score do pilar Produtividade | Reutiliza score do Assessment | Assessment Orkestria | futura |

Pesos internos informados: **100%**.
