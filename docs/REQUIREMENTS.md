# Requisitos de produto — Orkestria 360

## 1. Visão geral

O Orkestria 360 é uma plataforma SaaS para gestão, governança, conformidade, produtividade e segurança de ambientes corporativos de TI, com foco em Microsoft 365, Azure e maturidade operacional.

Este documento descreve cenários e áreas do produto. Cada entrega seleciona seu escopo, suas fontes, seus comportamentos e seus critérios de aceite nos requisitos e no plano aprovados em `plans/<delivery>/r<revision>/`. O catálogo não afirma implementação nem inicia a execução de todas as capacidades. Consulte [PRODUTO.md](PRODUTO.md) para as autoridades e [PRINCIPIOS.md](PRINCIPIOS.md) para as regras de qualidade.

Stack definida:

* Backend/base da aplicação: Laravel
* Frontend: React
* Bridge SPA/backend: Inertia.js
* Dados: fontes e contratos aprovados da capacidade; fixtures sintéticas apenas em contexto autorizado de desenvolvimento e validação
* Autenticação: contexto real de usuário e tenant, com autorização e isolamento definidos nos contratos

---

## 2. Objetivo do produto

Oferecer uma experiência SaaS que permita:

* Visão centralizada do ambiente de TI do cliente.
* Indicadores executivos de governança, segurança, conformidade e produtividade.
* Navegação por módulos estratégicos.
* Dashboards com cards, gráficos, tabelas, status, recomendações e próximos passos.
* Experiência visual consistente com o Design System e com os contratos das superfícies.

Coleta, persistência, integrações e automações integram a entrega quando necessárias ao resultado aprovado. A profundidade de implementação é definida pelo escopo e pelos critérios de aceite.

---

## 3. Público-alvo

Usuários principais:

* Gestores de TI
* Coordenadores de infraestrutura
* Analistas de segurança
* Consultores de governança e compliance
* Administradores Microsoft 365/Azure

O usuário opera no contexto autenticado e autorizado do seu tenant. Administradores de plataforma, administradores de customer e members seguem os limites dos princípios e contratos de isolamento. O papel de plataforma não concede acesso operacional aos dados de customer.

---

## 4. Áreas e escopo por entrega

### Incluso

A visão de produto abrange as seguintes áreas:

1. Página Inicial
2. Estruturação e Governança
3. Normas e Certificações
4. Microsoft 365
5. Azure
6. Assessment do Ambiente
7. Painel de Produtividade
8. Painel de Segurança

Também deve conter elementos globais:

* Sidebar lateral com navegação.
* Header superior com busca, notificações, empresa/tenant e usuário.
* Cards de indicadores.
* Gráficos com unidade, população, período e estados definidos no contrato.
* Tabelas e listas de recomendações.
* Ações com destino e comportamento definidos no escopo aprovado.

### Delimitação

Os requisitos da demanda explicitam as capacidades selecionadas, dependências e exclusões. O catálogo não exige ativar todas as integrações, workflows ou superfícies em uma única entrega. O modelo de autorização segue os princípios; novos papéis ou RBAC genérico exigem decisão explícita.

---

## 5. Estrutura de navegação

A aplicação deve possuir menu lateral fixo com os seguintes itens:

* Página Inicial
* Estruturação e Governança

  * Visão Geral
  * Inventário de Ativos de TI
  * Inventário de Licenças e Softwares
  * Matriz de Acessos e Permissões
  * Mapa de Rede e Infraestrutura
  * Política de Segurança da Informação
  * Procedimentos de Controle de Acessos
  * Documentação de Processos de TI
  * Relatórios de Diagnóstico e Recomendações
* Normas e Certificações

  * Visão Geral
  * ISO/IEC 27701
  * ISO/IEC 27001
  * ISO/IEC 27002
  * ISO/IEC 27005
  * PCI-DSS
  * Normas ISO 37000
  * SOC 2
  * Outras Normas
  * Minhas Certificações
* Microsoft 365

  * Visão Geral
  * Licenciamento
  * Usuários e Contas
  * Grupos
  * Autenticação MFA
  * Secure Score
  * Microsoft Defender
  * Intune
  * SharePoint
  * OneDrive
  * Teams
  * Exchange
  * Configurações
  * Relatórios
* Azure

  * Visão Geral
  * Assinaturas
  * Recursos e Grupos
  * IAM e Acessos
  * Security Center
  * Compliance
  * Backup e Recuperação
  * Rede
  * FinOps / Custos
  * Monitoramento
  * Governança
  * Políticas
  * Relatórios
* Assessment do Ambiente

  * Visão Geral
  * Plano de Assessment
  * Histórico de Assessments
  * Plano de Ação
  * Relatórios
* Painel de Produtividade

  * Visão Geral
  * Adoção de Ferramentas
  * Insights de Produtividade
  * Colaboração e Comunicação
  * Armazenamento e Conteúdo
  * Automação e Integrações
  * Recomendações
* Painel de Segurança

  * Visão Geral
  * Secure Score
  * Alertas e Incidentes
  * Vulnerabilidades
  * Conformidade
  * Identidades e Acessos
  * Proteção de Dados
  * Dispositivos
  * Recomendações
  * Relatórios

A navegação de cada entrega corresponde às capacidades selecionadas. Destinos ainda indisponíveis precisam de tratamento explícito no contrato de interface.

---

# 6. Requisitos globais

## 6.1 Layout base

A aplicação deve possuir um layout padrão reutilizável contendo:

* Sidebar lateral escura.
* Logo do produto.
* Menu principal com ícones.
* Itens expansíveis/recolhíveis.
* Indicação visual da página ativa.
* Header superior.
* Área principal de conteúdo.
* Footer simples, quando aplicável.

## 6.2 Header

O header deve conter:

* Botão de menu/hambúrguer.
* Campo de busca com placeholder “Pesquisar no portal...”.
* Ícone de ajuda.
* Ícone de notificações com contador.
* Informação do tenant autorizado; seleção ou troca somente quando previstas no contrato.
* Nome do usuário.
* Papel do usuário.
* Avatar com iniciais.

Busca, ajuda e notificações seguem o comportamento e os estados definidos para a entrega; sua presença visual não comprova capacidade funcional.

## 6.3 Componentes visuais

As superfícies devem reutilizar os componentes pertinentes do Design System, como:

* Card de métrica.
* Card de score circular.
* Gráfico de linha.
* Gráfico de rosca/donut.
* Gráfico radar.
* Barras de progresso.
* Tabelas.
* Lista de recomendações.
* Lista de atividades recentes.
* Badges de status.
* Badges de severidade.
* CTA de próximo passo.

---

# 7. Requisitos por módulo

## 7.1 Página Inicial

Objetivo: apresentar uma visão de entrada da plataforma e acesso rápido aos principais módulos.

Funcionalidades:

* Exibir banner de boas-vindas.
* Apresentar texto institucional da plataforma.
* Exibir botões:

  * Explorar Dashboard
  * Personalizar Painel
* Mostrar cards dos principais módulos:

  * Página Inicial
  * Estruturação e Governança
  * Normas e Certificações
  * Microsoft 365
  * Azure
  * Assessment do Ambiente
  * Painel de Produtividade
  * Painel de Segurança
* Exibir status de conexão com Microsoft.
* Exibir tenant conectado.
* Exibir último acesso.
* Exibir botão “Gerenciar conta”.

Dados previstos no contrato da superfície:

* Tenant conectado.
* Último acesso.
* Cards com descrição curta.
* Status conectado/desconectado.

---

## 7.2 Estruturação e Governança

Objetivo: demonstrar a maturidade da governança de TI com base em guias, documentos e tópicos estruturantes.

Funcionalidades:

* Exibir título e descrição do módulo.
* Exibir score de maturidade.
* Exibir cards de resumo:

  * Total de itens
  * Concluídos
  * Em andamento
  * Pendentes
* Exibir tabela “Guias e Documentos” com:

  * Tópico
  * Status
  * Progresso
  * Última atualização
  * Ação “Ver detalhes”
* Exibir gráfico de evolução do score.
* Exibir gráfico de distribuição dos status.
* Exibir lista de benefícios da governança.
* Exibir bloco de próximo passo sugerido.

Status possíveis:

* Concluído
* Em andamento
* Pendente

Exemplos de tópicos:

* Inventário de Ativos de TI
* Inventário de Licenças e Softwares
* Matriz de Acessos e Permissões
* Mapa de Rede e Infraestrutura
* Política de Segurança da Informação
* Procedimentos de Controle de Acessos
* Documentação de Processos de TI
* Relatórios de Diagnóstico e Recomendações

---

## 7.3 Normas e Certificações

Objetivo: apresentar o acompanhamento de normas, certificações, evidências e marcos de conformidade.

Funcionalidades:

* Exibir score de conformidade.
* Exibir cards de resumo:

  * Certificações ativas
  * Normas em planejamento
  * Evidências registradas
* Exibir catálogo de normas e certificações.
* Cada norma deve conter:

  * Nome
  * Descrição
  * Status
  * Progresso
  * Botão “Ver detalhes”
* Exibir evolução da conformidade.
* Exibir distribuição de status.
* Exibir próximos milestones.
* Exibir próximo passo sugerido.

Catálogo de normas contemplado na visão do produto:

* ISO/IEC 27701
* ISO/IEC 27001
* ISO/IEC 27002
* ISO/IEC 27005
* PCI-DSS
* ISO 37000
* SOC 2

Status possíveis:

* Em andamento
* Planejado
* Concluído

---

## 7.4 Microsoft 365

Objetivo: demonstrar uma visão consolidada do tenant Microsoft 365, incluindo segurança, licenças, serviços e recomendações.

Funcionalidades:

* Exibir indicadores principais:

  * Usuários ativos
  * Licenças atribuídas
  * Serviços ativos
  * Grupos
* Exibir score de segurança Microsoft 365.
* Exibir principais melhorias para aumento do score.
* Exibir status dos serviços:

  * Exchange
  * SharePoint
  * OneDrive
  * Teams
  * Microsoft Defender
  * Intune
  * Entra ID
  * Purview
* Exibir distribuição de licenças.
* Exibir recomendações principais.
* Exibir destaques do tenant.
* Exibir uso de serviços nos últimos 30 dias.
* Exibir atividades recentes.
* Exibir próximo passo sugerido.

Dados previstos no contrato da superfície:

* Quantidade de usuários.
* Total de licenças e licenças utilizadas.
* Serviços saudáveis.
* Distribuição por tipo de licença.
* Recomendações com severidade.

---

## 7.5 Azure

Objetivo: apresentar uma visão executiva do ambiente Azure, com foco em segurança, custos, recursos e alertas.

Funcionalidades:

* Exibir indicadores principais:

  * Assinaturas
  * Grupos de recursos
  * Recursos
  * Regiões
* Exibir Azure Security Score.
* Exibir segurança e conformidade geral.
* Exibir recomendações de segurança.
* Exibir distribuição por região.
* Exibir custos do mês.
* Exibir evolução de custos.
* Exibir uso de recursos por tipo.
* Exibir tabela de assinaturas com:

  * Nome da assinatura
  * ID da assinatura
  * Status
  * Custo atual
  * Variação
  * Ações
* Exibir alertas ativos.
* Exibir atividades recentes.
* Exibir próximo passo sugerido.

Tipos de recursos contemplados:

* Máquinas virtuais
* Armazenamento
* Bancos de dados
* Redes
* Containers
* Outros

Severidades de alerta:

* Crítico
* Alto
* Médio
* Informativo

---

## 7.6 Assessment do Ambiente

Objetivo: apresentar uma avaliação geral de maturidade do ambiente em pilares estratégicos.

Funcionalidades:

* Exibir score geral do ambiente.
* Exibir classificação do ambiente.
* Exibir gráfico radar de desempenho por pilar.
* Comparar:

  * Seu ambiente
  * Média do segmento
  * Ambiente ideal
* Exibir pontos fortes.
* Exibir pontos críticos.
* Exibir plano de ação recomendado.
* Exibir score por pilar.
* Exibir histórico de assessments.
* Exibir próximo passo sugerido.

Pilares avaliados:

* Infra
* Segurança da Informação
* Credenciais e Acessos
* Serviço de E-mail
* File Server e Armazenamento
* Firewall e Perímetro
* Licenciamento e Compliance
* Monitoramento e Suporte
* Backups e Disaster Recovery
* Governança e Políticas
* Produtividade e Colaboração

Classificações possíveis:

* Crítico
* Atenção
* Regular
* Bom
* Ótimo

---

## 7.7 Painel de Produtividade

Objetivo: demonstrar insights sobre adoção de ferramentas, colaboração, recursos subutilizados e oportunidades de ganho produtivo.

Funcionalidades:

* Exibir filtros de período.
* Exibir botão de filtros.
* Exibir cards principais:

  * Índice de produtividade
  * Usuários ativos Microsoft 365
  * Horas economizadas
  * Recursos subutilizados
  * Adoção de ferramentas
* Exibir adoção de ferramentas Microsoft 365:

  * Teams
  * OneDrive
  * SharePoint
  * Outlook
  * Power BI
  * Planner
  * Power Automate
  * Loop
* Exibir tendência de produtividade.
* Exibir principais insights.
* Exibir colaboração e comunicação.
* Exibir recursos subutilizados.
* Exibir produtividade por departamento.
* Exibir próximas ações sugeridas.
* Exibir próximo passo sugerido.

Exemplos de departamentos, conforme a população autorizada:

* TI
* Financeiro
* Comercial
* Operações
* Recursos Humanos
* Marketing

---

## 7.8 Painel de Segurança

Objetivo: apresentar uma visão consolidada da postura de segurança da organização.

Funcionalidades:

* Exibir filtros de período.
* Exibir cards principais:

  * Microsoft Secure Score
  * Identidades protegidas
  * Dispositivos em conformidade
  * Incidentes
  * Vulnerabilidades críticas
* Exibir evolução do Secure Score.
* Exibir distribuição de alertas.
* Exibir alertas críticos recentes.
* Exibir vulnerabilidades por severidade.
* Exibir conformidade por norma.
* Exibir principais recomendações.
* Exibir postura de segurança por pilar.
* Exibir atividades recentes.
* Exibir próximo passo sugerido.

Categorias de alerta:

* Críticos
* Altos
* Médios
* Baixos

Pilares de segurança:

* Identidades e Acessos
* Dispositivos
* Dados
* Aplicações
* Infraestrutura
* Governança

---

# 8. Requisitos técnicos

Application usa Laravel, Inertia.js e React. A organização de código, as rotas e as dependências seguem o repositório proprietário e seus contratos.

Persistência, coleta e projeções precisam preservar identidade do tenant, autorização, unidade, população, período e disponibilidade dos dados. Fixtures sintéticas são determinísticas e isoladas dos fatos de produção.

Componentes compartilhados pertencem ao Design System; contratos Microsoft e fixtures de provider pertencem ao Simulator. Os caminhos dos worktrees são explícitos e registrados conforme [REPOSITORIOS.md](REPOSITORIOS.md).

---

# 9. Requisitos de interface

A interface segue [DESIGN-orkestria.md](DESIGN-orkestria.md), o catálogo do Design System e os contratos estruturais selecionados para a demanda. As referências fornecidas em `inputs/<delivery>/` definem intenção e conteúdo dentro do escopo aprovado.

* Layout, navegação e hierarquia consistentes entre superfícies equivalentes.
* Tokens semânticos de tema, contraste e estados nos modos suportados.
* Tipografia legível, foco de teclado e interações acessíveis.
* Cards, tabelas e gráficos adequados ao significado e à unidade dos dados.
* Composição responsiva e estados de carregamento, vazio, restrição e falha definidos pelo contrato.

---

# 10. Comportamentos esperados

* A navegação identifica a superfície ativa e leva aos destinos definidos no contrato.
* Ações, filtros, busca, detalhes e exportações cumprem o comportamento aprovado, incluindo autorização e estados de indisponibilidade.
* Tenant, usuário e papel refletem o contexto autorizado.
* Cards, gráficos e tabelas preservam zero factual, vazio, ausência de coleta, restrição, parcialidade, desatualização e falha.
* Comparações, classificações e scores exibem somente conclusões sustentadas pelas fontes e regras aprovadas.
* Capacidades não disponíveis não são apresentadas como operações concluídas.

---

# 11. Critérios de aceite por entrega

A revisão aprovada define os critérios verificáveis de cada capacidade. A aceitação exige:

* Jornadas e superfícies do escopo rastreáveis aos requisitos.
* Autenticação, autorização e isolamento de tenant verificados nos limites pertinentes.
* Dados, cálculos, estados e interações compatíveis com os contratos aprovados.
* Consistência com o Design System, acessibilidade e responsividade conforme a superfície.
* Gates executados e evidências identificadas por repositório e SHA.
* Branches candidatas publicadas e PRs abertos, sem merge por agente.

O manifesto e as evidências aceitas ficam em `deliveries/<delivery>/r<revision>/`. A documentação de uma capacidade não comprova sua implementação. Veja [FLUXO.md](FLUXO.md).

---

# 12. Qualidade dos indicadores

Cada indicador exige definição de fonte, população, período, unidade e cálculo. Comparações com média de segmento ou ambiente ideal, horas economizadas e índices compostos só podem ser materializados quando houver base factual e regra aprovada. Ausência dessa definição exige clarificação ou estado explícito; não autoriza números demonstrativos em produção.

Os contratos específicos selecionados para a demanda refinam este catálogo. Divergências materiais precisam de decisão registrada antes de orientar a implementação.
