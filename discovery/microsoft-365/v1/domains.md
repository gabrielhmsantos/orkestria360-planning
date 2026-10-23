# Domínios do Módulo Microsoft 365

## Prioridades

- **P1**: entra no primeiro ciclo de implementação do módulo
- **P2**: detalhamento importante para a evolução do módulo
- **P3**: planejado para expansão posterior, sem necessidade de implementação imediata

## 1. Visão Geral

- Objetivo: concentrar a leitura executiva do tenant em uma única página.
- Perguntas: qual é o estado geral do tenant, quais riscos se destacam e qual próxima ação é recomendada?
- Componentes: summary cards, secure score, status de serviços, distribuição de licenças, adoção 30d, recomendações, highlights, atividades recentes, next step.
- Dados necessários: usuários ativos, licenças consumidas, serviços monitorados, score, controles prioritários, métricas agregadas de uso, eventos recentes.
- API oficial candidata: combinação de `/users`, `/groups`, `/subscribedSkus`, `/security/secureScores`, `/security/secureScoreControlProfiles`, `/admin/serviceAnnouncement/healthOverviews`, `/reports/*`.
- Prioridade: P1.
- Status POC: backend-prepared.

## 2. Licenciamento

- Objetivo: mostrar inventário, consumo e eficiência de licenças.
- Perguntas: quais SKUs estão contratados, quantas unidades foram consumidas e onde há subutilização?
- Componentes: cards de total contratado/consumido, gráfico por SKU, tabela de SKUs, bloco de oportunidades de realocação.
- Dados necessários: SKU, display name, capability status, consumed units, total units.
- API oficial candidata: `/subscribedSkus`.
- Prioridade: P2.
- Status POC: backend-prepared.

## 3. Usuários e Contas

- Objetivo: dar visibilidade de escala, perfil e atividade básica das contas do tenant.
- Perguntas: quantos usuários existem, quantos estão ativos e qual é a fotografia de contas do tenant?
- Componentes: KPIs de usuários, tabela resumida, distribuição por status/tipo, bloco de contas de atenção.
- Dados necessários: lista e contagem de usuários, principais atributos organizacionais, sinais de atividade.
- API oficial candidata: `/users` e relatórios de usuários ativos em `/reports/getOffice365ActiveUserDetail` e `/reports/getOffice365ActiveUserCounts`.
- Prioridade: P2.
- Status POC: backend-prepared.

## 4. Grupos

- Objetivo: representar colaboração estruturada e grupos com atividade relevante.
- Perguntas: quantos grupos existem, quais são mais ativos e como está a participação?
- Componentes: cards de total/ativos, gráfico de atividade, tabela de grupos, destaque para grupos mais relevantes.
- Dados necessários: grupos, membros, atividade e volumes agregados.
- API oficial candidata: `/groups`, `/groups/{id}/members/microsoft.graph.user`, `/reports/getOffice365GroupsActivityCounts`, `/reports/getOffice365GroupsActivityDetail`.
- Prioridade: P2.
- Status POC: backend-prepared.

## 5. Autenticação MFA

- Objetivo: mostrar cobertura de MFA e risco de identidade.
- Perguntas: quantos usuários estão cobertos por MFA, qual o sucesso das autenticações e onde estão as lacunas?
- Componentes: cards de cobertura, badge de risco, bloco de usuários sem cobertura, tendência de sucesso MFA.
- Dados necessários: usuários registrados/habilitados/capazes de MFA, métricas de sucesso, campanhas ou gaps de registro.
- API oficial candidata: authentication methods usage insights, `/reports/getMetricsForMfaSignInSuccess`, recursos de authentication methods.
- Prioridade: P2.
- Status POC: future integration seam.

## 6. Secure Score

- Objetivo: dar leitura do score agregado e das remediações mais impactantes.
- Perguntas: qual o score atual, qual o potencial de melhoria e quais controles devem ser priorizados?
- Componentes: score card, trend/target, lista de remediações, tabela de controles prioritários.
- Dados necessários: score agregado, max score, controles, tenant score por controle, custo/impacto de remediação.
- API oficial candidata: `/security/secureScores` e `/security/secureScoreControlProfiles`.
- Prioridade: P1.
- Status POC: backend-prepared.

## 7. Microsoft Defender

- Objetivo: resumir postura de proteção e principais riscos de segurança do ecossistema Microsoft.
- Perguntas: quais ameaças e recomendações impactam mais o tenant?
- Componentes: cards de incidentes/risco, recomendações críticas, highlights de postura.
- Dados necessários: recomendações e sinais de segurança relevantes ao tenant.
- API oficial candidata: família `security/*`, começando por secure score e expandindo depois para entidades específicas.
- Prioridade: P3.
- Status POC: future integration seam.

## 8. Intune

- Objetivo: mostrar governança básica de dispositivos e gestão moderna.
- Perguntas: quantos dispositivos gerenciados existem e onde há gaps de conformidade?
- Componentes: cards de dispositivos, status de conformidade, highlights de MDM.
- Dados necessários: visão agregada de device/app management.
- API oficial candidata: superfícies de device and app management do Microsoft Graph.
- Prioridade: P3.
- Status POC: future integration seam.

## 9. SharePoint

- Objetivo: representar adoção e uso de colaboração documental.
- Perguntas: qual o uso recente, onde há crescimento e quais sites exigem atenção?
- Componentes: cards de atividade, gráfico de adoção, tabela resumida de sites.
- Dados necessários: uso, atividade, storage e colaboração.
- API oficial candidata: relatórios de SharePoint em `/reports/*`.
- Prioridade: P3.
- Status POC: future integration seam.

## 10. OneDrive

- Objetivo: expor uso e capacidade do armazenamento individual no tenant.
- Perguntas: como está a adoção do OneDrive e onde há risco de quota ou baixa utilização?
- Componentes: cards de contas/atividade, gráfico de uso, destaques de atenção.
- Dados necessários: atividade de contas, consumo e tendência.
- API oficial candidata: relatórios de OneDrive em `/reports/*`.
- Prioridade: P3.
- Status POC: future integration seam.

## 11. Teams

- Objetivo: medir colaboração e engajamento do tenant.
- Perguntas: o Teams está sendo adotado, por quem e em qual intensidade?
- Componentes: cards de usuários ativos, gráfico de atividade, highlights de reuniões/chamadas/chat.
- Dados necessários: atividade por workload Teams e tendência de adoção.
- API oficial candidata: relatórios de Teams em `/reports/*`.
- Prioridade: P2.
- Status POC: backend-prepared.

## 12. Exchange

- Objetivo: representar atividade básica de email e colaboração tradicional.
- Perguntas: como está o uso de mailbox e quais sinais de adoção ou pressão de storage existem?
- Componentes: cards de mailboxes ativas, gráfico de uso, alertas de armazenamento.
- Dados necessários: mailbox activity, mailbox usage e sinais operacionais.
- API oficial candidata: relatórios de Exchange em `/reports/*`.
- Prioridade: P2.
- Status POC: backend-prepared.

## 13. Configurações

- Objetivo: concentrar a visão de postura e decisões administrativas do tenant.
- Perguntas: quais políticas ou configurações merecem revisão administrativa?
- Componentes: checklist executivo, cards de configuração, links/CTAs para ações.
- Dados necessários: recortes de identidade, segurança e posture.
- API oficial candidata: combinação de identity, authentication methods e security.
- Prioridade: P3.
- Status POC: future integration seam.

## 14. Relatórios

- Objetivo: servir como hub de leitura analítica do tenant.
- Perguntas: quais relatórios executivos e operacionais precisam ser consumidos com frequência?
- Componentes: catálogo de relatórios, filtros por workload, tabela de snapshots/exportáveis.
- Dados necessários: recortes de uso, atividade, grupos, apps, MFA, serviços e storage.
- API oficial candidata: `/reports/*`, `serviceAnnouncement` e, futuramente, superfícies de auditoria.
- Prioridade: P2.
- Status POC: future integration seam.
