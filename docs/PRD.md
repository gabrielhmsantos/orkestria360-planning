# PRD — Orkestria 360

## Problema

Gestores e equipes de TI precisam relacionar governança, conformidade, produtividade e segurança de ambientes corporativos. Informações dispersas sobre Microsoft 365, Azure, documentação e avaliações dificultam a leitura executiva e a priorização de ações.

## Proposta de produto

O Orkestria 360 reúne essas informações em uma plataforma SaaS com contexto autenticado de usuário e tenant, navegação por módulos, indicadores, análises, recomendações e workflows definidos pelo escopo de cada entrega.

As áreas de produto são Página Inicial, Estruturação e Governança, Normas e Certificações, Microsoft 365, Azure, Assessment do Ambiente, Painel de Produtividade e Painel de Segurança. O catálogo de cenários em [REQUIREMENTS.md](REQUIREMENTS.md) detalha essa visão; cada demanda seleciona suas capacidades e critérios de aceite em `plans/<delivery>/r<revision>/`. A visão de produto não afirma que todas essas capacidades estejam implementadas.

Identidade, autorização e dados operacionais vêm das fontes aprovadas. Fixtures sintéticas apoiam desenvolvimento e validação quando autorizadas pelo contrato. A experiência distingue zero, vazio, indisponibilidade, restrição, parcialidade e falha conforme [PRINCIPIOS.md](PRINCIPIOS.md).

## User Stories

1. As an administrador de tenant, I want acessar uma Página Inicial institucional e orientada a ações, so that eu entenda imediatamente o valor da plataforma.
2. As an gestor de TI, I want visualizar os módulos estratégicos da Orkestria 360 em destaque, so that eu saiba por onde navegar.
3. As an administrador, I want ver o tenant conectado e meu perfil no header, so that eu identifique o contexto autorizado em uso.
4. As an usuário autenticado, I want navegar entre os módulos principais pela sidebar, so that eu acesse as capacidades disponíveis da plataforma.
5. As an gestor de TI, I want enxergar claramente qual módulo está ativo no menu, so that eu mantenha orientação durante a navegação.
6. As an analista de segurança, I want ver submenus visuais por domínio, so that eu encontre as capacidades pertinentes ao meu trabalho.
7. As an decisor executivo, I want visualizar indicadores resumidos em cards, so that eu compreenda rapidamente o estado geral do ambiente.
8. As an usuário da plataforma, I want encontrar CTAs como “Explorar Dashboard” e “Personalizar Painel”, so that eu encontre as ações disponíveis e seus destinos.
9. As an administrador Microsoft 365, I want ver um status de conexão com Microsoft, so that eu associe a plataforma ao ecossistema que ela monitora.
10. As an gestor de governança, I want ver um score de maturidade em Estruturação e Governança, so that eu avalie a situação do ambiente de forma executiva.
11. As an consultor de compliance, I want acompanhar itens concluídos, em andamento e pendentes, so that eu identifique o progresso dos tópicos estruturantes.
12. As an gestor de TI, I want consultar uma tabela de guias e documentos com status e progresso, so that eu entenda o nível de organização da governança.
13. As an usuário de governança, I want ver a evolução do score ao longo do tempo, so that eu perceba melhoria contínua.
14. As an decisor, I want receber um próximo passo sugerido em cada módulo, so that eu encontre direcionamento prático.
15. As an responsável por conformidade, I want ver um score de conformidade em Normas e Certificações, so that eu avalie prontidão regulatória.
16. As an consultor de compliance, I want visualizar o catálogo de normas e certificações com progresso e status, so that eu priorize esforços de adequação.
17. As an auditor interno, I want acompanhar marcos e evidências de conformidade, so that eu reconheça a estrutura de acompanhamento proposta pelo produto.
18. As an administrador Microsoft 365, I want ver indicadores de usuários, licenças, grupos e serviços ativos, so that eu tenha uma visão consolidada do tenant.
19. As an gestor de segurança, I want ver o Microsoft Secure Score e recomendações principais, so that eu identifique oportunidades de melhoria.
20. As an administrador Microsoft 365, I want acompanhar o estado de Exchange, SharePoint, OneDrive, Teams, Defender, Intune, Entra ID e Purview, so that eu enxergue cobertura ampla do tenant.
21. As an tomador de decisão, I want ver distribuição de licenças e uso dos serviços nos últimos 30 dias, so that eu avalie adoção e eficiência.
22. As an gestor de nuvem, I want acessar um módulo Azure com visão executiva de assinaturas, recursos, regiões e custos, so that eu acompanhe o ambiente de forma centralizada.
23. As an responsável por cloud security, I want ver Azure Security Score, alertas e recomendações, so that eu identifique riscos prioritários.
24. As an gestor financeiro de TI, I want ver evolução de custos e distribuição de recursos por tipo, so that eu relacione uso técnico com impacto financeiro.
25. As an administrador Azure, I want consultar uma tabela de assinaturas com status, custo e variação, so that eu compare rapidamente os contextos monitorados.
26. As an consultor de assessment, I want ver um score geral do ambiente com classificação, so that eu resuma a maturidade operacional do cliente.
27. As an gestor de operações, I want comparar meu ambiente com a média do segmento e com o ambiente ideal, so that eu entenda lacunas de maturidade.
28. As an decisor executivo, I want visualizar um radar por pilares estratégicos, so that eu identifique forças e fraquezas de forma intuitiva.
29. As an usuário de assessment, I want ver histórico de assessments e plano de ação recomendado, so that eu perceba continuidade evolutiva.
30. As an gestor de produtividade, I want acompanhar adoção de ferramentas Microsoft 365, so that eu identifique oportunidades de ganho operacional.
31. As an líder de departamento, I want ver produtividade por área como TI, Financeiro, Comercial e RH, so that eu relacione adoção digital ao contexto organizacional.
32. As an patrocinador do produto, I want ver horas economizadas e recursos subutilizados, so that eu enxergue valor de negócio e desperdícios.
33. As an analista de segurança, I want acessar um Painel de Segurança com foco em incidentes, vulnerabilidades e conformidade, so that eu monitore postura de segurança de forma consolidada.
34. As an gestor de segurança, I want ver evolução do Secure Score, distribuição de alertas e alertas críticos recentes, so that eu priorize resposta e endurecimento.
35. As an responsável por risco, I want acompanhar vulnerabilidades por severidade e conformidade por norma, so that eu relacione riscos técnicos com obrigações regulatórias.
36. As an administrador de identidade, I want ver métricas de identidades protegidas e dispositivos em conformidade, so that eu acompanhe pilares centrais de proteção.
37. As an executivo, I want uma interface limpa, enterprise e visualmente coerente com as referências, so that eu compreenda os dados e as ações disponíveis.
38. As an usuário, I want distinguir dados disponíveis de fontes indisponíveis ou restritas, so that eu tome decisões sem interpretar ausência como sucesso.
39. As an time de produto, I want cenários sintéticos coerentes com os contratos aprovados, so that o desenvolvimento e a validação visual preservem a semântica do produto.
40. As an time de engenharia, I want contratos explícitos entre dados e apresentação, so that integrações e frontend possam ser desenvolvidos e validados com responsabilidades claras.
41. As an usuário recorrente, I want consistência entre header, sidebar, cards, tabelas e gráficos em todas as telas, so that a navegação pareça unificada.
42. As an patrocinador do projeto, I want a aplicação utilizável em desktop e notebook, so that as jornadas aprovadas possam ser realizadas nesses dispositivos.
43. As an time de implementação, I want capacidades ainda indisponíveis identificadas conforme o contrato, so that a navegação comunique os limites da entrega.
44. As an usuário de busca, I want encontrar a busca quando essa capacidade fizer parte do escopo, so that eu localize conteúdo no contexto autorizado.
45. As an usuário corporativo, I want ver notificações, ajuda, avatar e informações de tenant no topo, so that a experiência tenha sinais familiares de portal enterprise.
46. As an time comercial, I want cada módulo mostrar benefícios, insights e recomendações, so that a plataforma apoie a tomada de decisão.
47. As an time técnico, I want as rotas principais existirem de forma explícita por módulo, so that a arquitetura reflita a navegação esperada do produto.
48. As an time de design e frontend, I want componentes reutilizáveis para métricas, score, gráficos, listas e status, so that a expansão do produto preserve consistência.

## Arquitetura e experiência

- Application usa Laravel, Inertia.js e React. Código, testes e instruções de implementação pertencem ao repositório Application.
- Layout, navegação e contexto autenticado são compartilhados; as superfícies usam o Design System e os contratos aprovados. Consulte [DESIGN-orkestria.md](DESIGN-orkestria.md).
- Tenant, usuário e papel refletem o contexto autorizado. O modelo de isolamento e os limites entre control plane e data plane seguem os princípios e os contratos pertinentes.
- Métricas, classificações e comparações exigem população, período, fonte e cálculo definidos. Dados ausentes não viram números ou conclusões inventadas.
- Ações, filtros, busca, exportação e notificações têm comportamento definido no escopo. A interface deve comunicar quando uma capacidade não está disponível.
- Frontend e backend podem avançar como tracks independentes quando há contrato semântico aprovado e uma integração explicitamente delimitada. Persistência e integrações são entregues quando necessárias ao resultado aprovado.

## Validação e entrega

Os critérios de aceite verificam resultados observáveis: jornada autorizada, isolamento de tenant, contratos de dados, estados, cálculos e interações pertinentes. Validação de interface usa cenários contratuais; ela não comprova uma integração real.

Testes rodam no repositório proprietário e no ambiente adequado à entrega. Application separa o snapshot de desenvolvimento/UI do banco `_test` da suíte automatizada. Manifestos e evidências aceitas identificam os SHAs validados.

A entrega de alterações conclui com branches candidatas publicadas e PRs abertos, sem merge por agente. Consulte [FLUXO.md](FLUXO.md) e [REPOSITORIOS.md](REPOSITORIOS.md).

## Delimitação de escopo

Os requisitos e o plano aprovados de cada demanda definem jornadas, superfícies, integrações, regras, dependências e exclusões. Recursos não selecionados não entram automaticamente na execução. As autoridades de produto e o tratamento de divergências estão em [PRODUTO.md](PRODUTO.md).
