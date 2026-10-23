# Discovery — Módulo Microsoft 365

## Objetivo

Definir o discovery funcional e técnico do módulo **Microsoft 365** da Orkestria 360 para orientar a futura implementação da visão geral do tenant e de suas subáreas, com rastreabilidade explícita para APIs oficiais da Microsoft.

Este discovery assume que a POC continua **mockada por padrão**, mas já prepara:

- a narrativa de produto do módulo
- a estrutura funcional das subáreas do submenu
- o contrato futuro da overview
- o mapa técnico das superfícies oficiais do ecossistema Microsoft 365

## Contexto Atual

Hoje o módulo já existe no app como uma página overview mockada em `/microsoft-365`, com:

- 4 summary cards
- um card de Secure Score
- grid de status de 8 serviços
- gráfico de distribuição de licenças
- gráfico de uso dos serviços em 30 dias
- recomendações
- highlights do tenant
- atividades recentes
- próximo passo sugerido

O submenu global do módulo já sugere 14 áreas:

1. Visão Geral
2. Licenciamento
3. Usuários e Contas
4. Grupos
5. Autenticação MFA
6. Secure Score
7. Microsoft Defender
8. Intune
9. SharePoint
10. OneDrive
11. Teams
12. Exchange
13. Configurações
14. Relatórios

## Narrativa de Produto

O módulo Microsoft 365 deve comunicar uma visão executiva do tenant da Contoso, combinando:

- escala operacional do ambiente
- saúde dos serviços
- postura de segurança
- adoção de workloads
- oportunidades práticas de melhoria

Na POC, a primeira entrega continua sendo a **overview executiva**, mas este discovery cobre o módulo inteiro para evitar decisões em aberto nas próximas fases.

## Problemas que o Módulo Precisa Responder

- Quantos usuários, grupos, licenças e serviços ativos existem no tenant?
- O tenant está saudável do ponto de vista operacional?
- Quais workloads exigem atenção imediata?
- Como está o Secure Score e quais remediações têm maior impacto?
- Quais produtos Microsoft 365 estão mais adotados ou subutilizados?
- Que fatos recentes explicam o estado atual do tenant?
- Qual deve ser o próximo passo recomendado para o administrador?

## Princípios para a Implementação Futura

- A overview deve seguir como porta de entrada do módulo.
- O contrato da página deve ter origem conceitual clara em APIs oficiais da Microsoft.
- A POC não precisa integrar Microsoft Graph agora, mas o desenho não deve inventar estruturas difíceis de mapear depois.
- Os dados mockados devem continuar plausíveis para um tenant corporativo médio.
- Sempre que uma área depender de múltiplas superfícies Microsoft, isso deve ficar explícito no contrato e no roadmap.

## Decisões de Escopo

- **Entra agora no discovery**: overview completa, taxonomia das subáreas, contratos futuros, mapa oficial de APIs e roadmap de fases.
- **Não entra agora na implementação**: integração real com Microsoft Graph, autenticação Microsoft real, persistência analítica ou rotas detalhadas já codificadas.
- **Fase 1 recomendada de implementação**: consolidar `/microsoft-365` com controller dedicado e mapper/backend provider mockado.

## Status POC por Tipo de Dado

- **Mock-only**: destaques narrativos, textos de próximo passo, composição editorial de highlights.
- **Backend-prepared**: summary cards, secure score, recomendações, status de serviços, gráficos de licença e adoção, recent activity.
- **Future integration seam**: MFA posture, relatórios detalhados por workload, Defender/Intune aprofundados, auditoria e compliance activity.
