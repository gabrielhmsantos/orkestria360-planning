# Visão Geral Microsoft 365 — Contrato Conceitual V2

## Objetivo

Definir o contrato conceitual entre as fontes do Orkestria e a tela Visão Geral. É um contrato de discovery: descreve a informação necessária para a experiência, sem obrigar ainda uma API, storage ou tipo TypeScript de produção.

## Envelope da página

| Campo | Finalidade | Estado mínimo |
| --- | --- | --- |
| `imdo` | Síntese de maturidade do ambiente | Obrigatório; pode ter nota indisponível. |
| `executiveKpis` | Indicadores executivos selecionados | Obrigatório; coleção pode estar vazia. |
| `actionPlan` | Próximas ações priorizadas | Obrigatório; indicar ausência de recomendações quando aplicável. |
| `insights` | Positivos, melhorias e críticos | Obrigatório; cada insight referencia evidências. |
| `evolution` | Histórico de IMDO e pilares | Opcional até existir snapshot persistido. |
| `generatedValue` | Impacto comparado a baseline | Opcional até existir baseline homologado. |
| `moduleContributions` | Relação entre módulos e resultado | Obrigatório; informa proveniência e navegação futura. |
| `asOf` | Momento de consolidação | Obrigatório quando houver qualquer sinal coletado. |

## Contratos dos blocos

### IMDO

| Campo | Descrição |
| --- | --- |
| `score` | Nota de 0 a 100 ou `null` quando o modelo ainda não puder produzir uma nota honesta. |
| `domains` | Seis domínios, peso, nota, cobertura, confiabilidade agregada e estado de homologação. |
| `coverage` | Cobertura ponderada do conjunto de evidências disponíveis. |
| `reliability` | Confiabilidade agregada das fontes; não modifica `score`. |
| `status` | `ready`, `partial`, `blocked` ou `not_available`. |
| `unavailableReasons` | Fontes, permissões, licenças, histórico ou regras pendentes que impedem leitura completa. |

Na Visão Geral desta etapa, `imdo.status` é `not_available` e a experiência usa o rótulo **Em breve**. Ela pode apresentar o propósito do índice e os seis domínios — Segurança, Governança, Licenciamento e Custos, Compliance, Disponibilidade e Produtividade — mas `score`, classificação, distribuição de pesos e séries históricas não são apresentados. O contrato completo é preservado para a futura ativação do índice, sem autorizar valores de exemplo na tela.

## Estrutura e blocos da Visão Geral

| Bloco | Pergunta respondida | Conteúdo mínimo | Disponibilidade inicial |
| --- | --- | --- | --- |
| Contexto da página | Qual ambiente e período estou consultando? | tenant, período selecionado, última atualização e estado da coleta | Disponível quando houver coleta; filtros não devem alterar dados sem indicar o período. |
| IMDO | Como está a maturidade integrada do ambiente? | proposta do índice, seis domínios e estado **Em breve** | `not_available` nesta etapa. |
| KPIs executivos | Quais são os sinais principais agora? | seis cards definidos no catálogo abaixo | Parcial, métrica a métrica. |
| Plano de ação inteligente | O que precisa ser resolvido primeiro? | ações priorizadas, evidência, impacto, origem e destino | Parcial; regras e ações consultivas são distinguíveis. |
| Insights inteligentes | O que os sinais significam? | interpretações positivas, oportunidades, tendências e riscos com evidência | Parcial; não usar benchmark ou inferência sem base. |
| Evolução do ambiente | O que mudou ao longo do tempo e por quê? | gráficos, comparação de período e eventos explicativos | Depende de snapshots comparáveis. |
| Resumo executivo | Qual leitura deve orientar a decisão? | situação, pontos fortes, melhorias e críticos respaldados pelos blocos anteriores | Disponível apenas para dados suficientes; caso contrário, explicar a limitação. |
| Próximo passo recomendado | Qual ação deve ser tomada agora? | CTA para o plano de ação ou para configurar uma fonte pendente | Depende da ação prioritária ou indisponibilidade dominante. |
| Valor gerado pelo Orkestria | Qual foi o impacto comprovado? | melhoria, risco reduzido, economia ou cobertura com baseline | Futuro até haver baseline e método homologado. |
| Contribuição entre módulos | Que módulos sustentam essa leitura? | proveniência, indicadores atendidos e atalhos futuros | Parcial, conforme cada módulo fornecer evidência. |

### KPIs executivos

Cada KPI deve fornecer `id`, rótulo, valor, unidade, período, tendência quando existente, fonte, frescor e estado. O KPI não deve declarar uma meta ou tom de risco sem regra aprovada.

Para KPIs de custo, preço contratado ou economia potencial, as quantidades e os SKUs vêm da Microsoft Graph e o preço vem da Base de Custos de Licenças Orkestria. Essa base deve identificar ao menos tenant, SKU, moeda, valor unitário, vigência e responsável pela atualização. Sem um registro vigente e correspondente, o KPI financeiro fica indisponível; não pode usar preço estimado nem ser convertido em zero.

### Catálogo de KPIs executivos

O sponsor definiu seis cards para a leitura inicial do ambiente. Eles são KPIs executivos independentes do IMDO: não devem receber uma nota proprietária enquanto o IMDO estiver marcado como **Em breve**. Quando houver um score nativo Microsoft, ele deve ser nomeado explicitamente — por exemplo, `Secure Score` — e não apresentado como IMDO.

| Card | Métricas iniciais | Fontes/evidências | Estado V2 e regra de apresentação |
| --- | --- | --- | --- |
| Usuários | total de usuários; novos no período; bloqueados; sem licença; sem MFA; convidados, administradores, inativos e usuários de risco quando disponíveis | Graph `/users`, `/directory/deletedItems`, relatórios de registro de métodos de autenticação, `signInActivity`, roles e proteção de identidade | Parcialmente disponível. Cada métrica informa sua data de referência; inatividade e risco não podem ser inferidos se a permissão ou o relatório estiver indisponível. |
| Licenciamento | licenças contratadas, atribuídas/em uso, disponíveis; licenças Premium subutilizadas; custo mensal e renovação | Graph `/subscribedSkus` e licenças atribuídas por usuário; relatórios de uso; Base de Custos de Licenças Orkestria; fonte contratual de renovação | Quantidades parcialmente disponíveis. Subutilização exige relatório de uso; custo exige preço vigente na base própria; renovação permanece futura até existir fonte contratual. |
| Segurança | `Secure Score`; cobertura MFA; alertas/incidentes; condições críticas de identidade; conformidade de dispositivos, Defender e Conditional Access quando disponíveis | Graph Security, relatórios de métodos de autenticação, Entra ID, Intune e Defender | Parcialmente disponível e dependente de licença/permissão. O card pode exibir `Secure Score`, mas não um “Health Score” ou IMDO de Segurança. |
| Serviços | estado dos serviços subscritos; serviços afetados; incidentes/avisos no período | Graph `/admin/serviceAnnouncement/healthOverviews` e `/admin/serviceAnnouncement/issues` | Parcialmente disponível. `Todos online` só é válido quando todos os serviços monitorados retornarem saudáveis; Service Health Microsoft não equivale ao SLA percebido pelo cliente. |
| Compliance | Compliance Score, LGPD, ISO 27001, DLP, retenção, sensitivity labels, Purview e Assessment de Compliance | Purview/Graph onde aplicável; Assessment e Governança Orkestria | Integração futura/parcial. Métricas normativas ou documentais não recebem score presumido; o card mostra somente evidência e estado de disponibilidade. |
| Custos | custo mensal, economia potencial, licenças ociosas e Premium subutilizadas; renovação quando disponível | Base de Custos de Licenças Orkestria, Graph para SKUs/quantidades e relatórios de uso; fonte contratual de renovação | Base própria necessária. Sem preço vigente por tenant/SKU, custo e economia ficam indisponíveis; não se usa estimativa nem zero. |

Para todos os cards, uma tendência só é exibida quando houver dois snapshots comparáveis. O card deve preservar fonte, data de referência, frescor e estado de cada métrica, mesmo quando o layout mostrar apenas o valor principal e dois ou três indicadores secundários.

### Plano de ação inteligente

Cada ação deve carregar `id`, título, domínio, prioridade, motivo, evidências, impacto estimado somente quando calculável, módulo de destino e estado. A priorização futura deve ser explicável; ações editoriais precisam declarar a origem editorial.

O plano consolida uma fila de execução, não uma simples lista de recomendações de produtos Microsoft. Seus itens são persistidos em uma tabela própria por tenant, permitindo cadastro e manutenção futuros pelo administrador. A origem é obrigatória: `rule` para regra automatizada da biblioteca, `consulting` para recomendação incluída por consultoria, `manual` para ação criada pelo administrador/gestor e `ai` para sugestão produzida por análise assistida por IA. Ações consultivas, manuais e assistidas por IA exibem autor ou agente, data, justificativa e estado de revisão.

O registro persistido de ação precisa comportar: tenant, código/regra de origem quando houver, título, descrição/motivo, domínio, prioridade, impacto estimado e sua unidade, evidências e respectivas referências, módulo de destino, origem, autor/agente, estado de revisão, estado de execução, responsável, datas de criação/atualização/conclusão e validade. Uma sugestão de IA não é publicada como ação prioritária sem evidência vinculada e revisão humana explícita.

| Regra inicial do sponsor | Condição/evidência mínima | Ação | Origem principal | Estado V2 |
| --- | --- | --- | --- | --- |
| MFA incompleto | cobertura MFA abaixo do limiar homologado | Habilitar MFA | relatórios de autenticação | Parcial |
| Autenticação legada ativa | política ou evidência de uso disponível | Bloquear autenticação legada | Entra ID | Parcial |
| Licença Premium sem uso | licença atribuída e ausência de uso compatível | Revisar downgrade ou remoção | Graph, reports e base de custos | Parcial |
| Inventário inexistente | evidência de governança ausente ou não aprovada | Criar ou revisar inventário | Estruturação e Governança | Integração futura |
| DLP ausente | política não encontrada em fonte confiável | Criar política DLP | Purview | Integração futura |
| Economia relevante | economia calculável acima do limiar homologado | Revisar licenciamento | Graph e base de custos | Parcial |
| Backup ausente | evidência interna ou de conector de backup ausente | Implantar ou validar backup | conector/registro interno | Futuro |
| Baixa adoção do Teams | percentual de adoção abaixo do limiar homologado | Planejar treinamento ou adoção | Graph Reports | Parcial |

Criticidade, impacto e ordem não podem ser inferidos exclusivamente da aparência do card. Cada item deve informar a regra aplicada ou a justificativa editorial, o momento da evidência e o módulo de destino.

### Insights inteligentes

Cada insight é classificado como `positive`, `improvement` ou `critical` e carrega texto, evidências, domínio, fonte e data de referência. “Crítico” deve indicar uma condição mensurável ou avaliação registrada, não uma inferência visual.

| Categoria de leitura | Pergunta respondida | Exemplos de evidência | Regra de disponibilidade |
| --- | --- | --- | --- |
| Economia | Onde existe redução mensurável de custo? | licenças ociosas, downgrade e preço vigente | Requer base de custos e cálculo rastreável. |
| Oportunidade | Que recurso contratado pode gerar mais valor? | adoção de OneDrive, Teams, Copilot ou recursos Premium | Requer população elegível e relatório de uso. |
| Comparativo | Como o ambiente se compara a uma referência? | benchmark de porte ou segmento | Futuro; só é exibido com método e base anonimizada homologados. |
| Tendência | Que métrica mudou de forma relevante? | crescimento de storage, custo ou adoção | Requer snapshots comparáveis e período explícito. |
| Risco | Que condição aumenta exposição ou impacto? | MFA ausente, privilégios, incidente ou política ausente | Requer condição mensurável, fonte e limiar/avaliação registrada. |
| Maturidade | Que evolução foi obtida em um domínio? | melhoria de cobertura MFA, dispositivos ou governança | Sem IMDO nesta etapa; descreve somente métricas observáveis. |
| Produtividade | Que adoção requer atenção ou pode ser expandida? | utilização dos workloads e licenças elegíveis | Requer relatório de uso e definição de elegibilidade. |

Insights não repetem o valor do KPI: explicam impacto, condição observada e evidência. Eles são persistidos em uma tabela própria por tenant, de modo que possam ser cadastrados e mantidos pelo administrador ou originados por regras e, futuramente, por análise assistida por IA. O registro comporta: tenant, código/origem, categoria, domínio, título, texto, evidências e referências, fontes, período/data de referência, estado, autor/agente, estado de revisão, validade e auditoria de criação/atualização. Uma camada de IA pode redigir ou agrupar interpretações, mas não substitui regras, fontes, rastreabilidade ou revisão humana antes da publicação.

### Evolução e valor gerado

Os dois blocos usam snapshots datados. Cada ponto informa valor, métrica, origem, cobertura e confiabilidade. Valor gerado só pode ser exibido quando houver baseline comparável, período e método de comparação documentados.

O seletor de período poderá oferecer 30 dias, 90 dias, 6 meses, 12 meses, 24 meses e intervalo personalizado, limitando-se à retenção real dos snapshots. Cada gráfico mostra valor atual, valor inicial, variação absoluta e percentual, tendência e eventos que expliquem a mudança. Sem dois snapshots comparáveis, apresenta estado de histórico insuficiente.

| Série evolutiva | Métricas iniciais | Fonte/snapshot | Estado V2 |
| --- | --- | --- | --- |
| IMDO | score geral e seis domínios | motor IMDO próprio | **Em breve**; não exibir série de exemplo. |
| Segurança | Secure Score, MFA, dispositivos conformes, risco, incidentes e acesso condicional quando disponíveis | Graph, Intune, Defender e Entra ID | Parcial. |
| Compliance | DLP, retenção, labels, evidências de LGPD/ISO e Assessment | Purview, Governança e Assessment | Futuro/parcial. |
| Usuários e identidade | usuários ativos/totais, convidados, inativos e administradores | Graph e snapshots próprios | Parcial. |
| Licenciamento e custos | SKUs contratados, atribuídos/disponíveis, custo, economia potencial e renovações | Graph, base de custos e fonte contratual | Parcial; dados financeiros exigem a base própria. |
| Produtividade e adoção | adoção de Teams, SharePoint, OneDrive e Copilot quando licenciado | Graph Reports e fontes especializadas | Parcial. |
| Disponibilidade e incidentes | serviços saudáveis, incidentes, duração e recorrência | Service Health, ITSM e monitoramento futuro | Parcial; não representa SLA percebido sem fonte complementar. |

Eventos explicativos usam `data`, `título`, `tipo`, `origem`, `métricas afetadas` e descrição. Podem vir de ação concluída, documento aprovado, assessment revisado, política implantada, mudança de licença, incidente Microsoft, alteração metodológica ou registro manual. Mudanças de metodologia devem ficar visíveis para não serem confundidas com evolução do ambiente.

### Resumo executivo e próximo passo

O resumo responde à situação geral em quatro partes: situação atual, pontos fortes, pontos de melhoria e pontos críticos. Ele não soma métricas nem declara maturidade IMDO enquanto o índice estiver em **Em breve**. Cada afirmação precisa referenciar KPI, ação ou insight disponível; se não houver evidência suficiente, a seção informa quais fontes ou snapshots ainda faltam.

O próximo passo recomendado aponta para a ação de maior prioridade com evidência disponível. Se não houver ação elegível, o CTA orienta a configurar a fonte que mais limita a leitura — por exemplo, Base de Custos de Licenças, permissões Graph, Assessment ou Governança — sem classificar o ambiente como saudável ou crítico.

### Valor gerado pelo Orkestria

Valor gerado é uma comparação de baseline, e não uma projeção visual. Cada resultado deve registrar métrica, baseline, valor atual, período, método, fontes, cobertura, confiabilidade e as ações/eventos relacionados. Exemplos permitidos após homologação incluem economia realizada, redução de risco mensurável, cobertura ampliada e melhoria de adoção. Antes disso, o bloco fica indisponível ou explica que aguarda baseline.

### Contribuição entre módulos

Cada contribuição informa módulo de origem, domínio IMDO afetado, indicadores atendidos, tipo de evidência (`graph`, `external_provider`, `assessment`, `governance`, `manual`) e estado (`available`, `future_integration`, `not_collected`, `blocked`).

| Origem | Contribuição esperada para a Visão Geral | Estado inicial |
| --- | --- | --- |
| Submódulos Microsoft 365 | usuários, licenças, identidade, Secure Score, saúde de serviço e uso por workload | Parcial, conforme Graph e permissões. |
| Estruturação e Governança | inventários, políticas, procedimentos, processos e KPIs aprovados | Integração futura. |
| Assessment | resultados de Segurança, Governança, Compliance e Produtividade, com data da aplicação | Integração futura. |
| Painel de Segurança | recomendações, incidentes e evidências de proteção correlacionáveis | Parcial/futuro por conector. |
| Painel de Produtividade | adoção e oportunidades de uso dos workloads | Parcial/futuro por relatório. |
| Governança, fornecedores e cadastros internos | custos, contratos, vigências e eventos manuais revisados | Base de custos definida; demais contratos futuros. |

## Estados de disponibilidade

| Estado | Significado |
| --- | --- |
| `available` | Evidência atual disponível e interpretável. |
| `stale` | Última evidência existe, mas está fora da janela de frescor acordada. |
| `not_collected` | A fonte existe, porém ainda não foi coletada. |
| `insufficient_privileges` | Acesso autorizado no produto, mas sem permissão exigida pela fonte. |
| `provider_inactive` | Workload ou licença exigido por indicador do IMDO não está ativo no tenant; o indicador recebe nota zero e mantém seu peso. |
| `future_integration` | Dependência prevista, sem conector implementado. |
| `rule_pending` | Evidência existe, mas a transformação em nota não foi homologada. |

## Invariantes

- Todo valor calculado aponta para evidência e data de referência.
- Score indisponível não pode ser serializado como zero.
- Cobertura baixa não é sinônimo de maturidade baixa.
- Fonte manual deve identificar responsável, data e validade antes de ser elegível à consolidação.
