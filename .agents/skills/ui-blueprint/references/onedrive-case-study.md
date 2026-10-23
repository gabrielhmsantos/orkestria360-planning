# Estudo de caso: decisões finais de UI do OneDrive

Este estudo sintetiza somente o estado final preservado nos sete documentos consolidados de decisão. Não registra experimentos, histórico de revisão ou alternativas intermediárias descartadas. As classificações são por decisão: **princípio transferível** descreve um critério aplicável quando a mesma semântica existir; **decisão local ao OneDrive** registra uma escolha específica deste módulo; **limite final** descreve o que a interface comunica ou preserva no estado entregue. Os componentes citados são exemplos do produto, não um catálogo obrigatório para outros módulos.

## Dashboard Executivo

- **Princípio transferível:** `OperationalMetricGrid` define a distribuição responsiva; `OnedriveSummaryKpi` apresenta métricas já publicadas com unidade, baseline opcional e comparação. Variação relativa e pontos percentuais seguem a unidade da métrica; baseline ausente ou zero não cria comparação percentual indevida.
- **Princípio transferível:** `ChartPanel` materializa gráficos. A superfície fornece séries, ordem, agregações, formatação e thresholds sustentados pelos dados.
- **Decisão local ao OneDrive:** oito KPIs, distribuição 8/4/2/1 e composição analítica aprovada para o dashboard.
- **Limite final:** Health Score aparece somente quando há fonte definida; ações recomendadas não executam administração sem fluxo autorizado.

## Contas e Armazenamento

- **Princípio transferível:** filtros recebem opções publicadas e a superfície possui o recorte. Projeções, tabelas e detalhes não devem transformar dado ausente em zero, risco ou sucesso.
- **Princípio transferível:** um CTA de análise pode aplicar um filtro factual e mover foco para o resultado quando essa navegação estiver definida.
- **Decisão local ao OneDrive:** grade analítica de quatro cards responsiva e tabela de contas com a composição e colunas aprovadas para esta superfície.
- **Limite final:** detalhe inline só apresenta conteúdo quando o detalhe está publicado; dados de retenção ficam no detalhe, sem inferência na linha principal.

## Arquivos e Conteúdo

- **Princípio transferível:** uma derivação única do filtro alimenta as regiões que dependem do mesmo recorte; KPIs permanecem snapshots independentes quando essa é a semântica aprovada.
- **Princípio transferível:** a pergunta de cada análise define o gráfico; rankings curtos podem usar tabelas de insight sem se passar por inventários completos.
- **Decisão local ao OneDrive:** os sete KPIs comparáveis reutilizam `OnedriveSummaryKpi`; análises combinam donuts, barras e tabelas de ranking conforme os dados publicados.
- **Limite final:** malware, acesso sem uso, inventário, paginação e detalhe inline não são materializados sem suporte no contrato e na referência aprovada.

## Compartilhamento e Acessos

- **Princípio transferível:** tabela, alertas e recomendações refletem o mesmo recorte por interseção de filtros; KPIs e análises permanecem snapshots independentes.
- **Princípio transferível:** totais e categorias preservam sua semântica quando registros têm propriedades sobrepostas; enumerações técnicas são localizadas na apresentação sem mudar o contrato.
- **Decisão local ao OneDrive:** a evolução combina barras de itens compartilhados e linha de convidados em eixos próprios; a tabela recente e o aside usam a composição aprovada.
- **Limite final:** alertas e recomendações são fatos/orientação; não executam ação administrativa sem destino e workflow publicados.

## Atividade e Sincronização

- **Princípio transferível:** a superfície possui ordenação e agregação, como Top 5 + “Outros”; o `ChartPanel` não conhece departamentos nem regras de domínio. A grade de KPI e seu renderer mantêm responsabilidades distintas.
- **Princípio transferível:** controles de filtro afetam somente as regiões declaradas; um período pode trocar uma projeção publicada sem alterar o snapshot dos KPIs.
- **Decisão local ao OneDrive:** Departamento, Usuário, Situação da Sincronização e Tipo de Dispositivo filtram a tabela de dispositivos; as composições e colunas seguem o contrato desta aba.
- **Limite final:** status de dispositivo e badges conservam significado factual e localização; nenhum valor de origem/granularidade é acrescentado como texto persistente sem necessidade.

## Usuários Desligados e Retenção

- **Princípio transferível:** a derivação de filtros abastece tabela, próximos de exclusão e transferências dependentes. Conteúdo estável por tenant e ações visuais estáticas permanecem independentes do recorte.
- **Princípio transferível:** escolha a representação de processo conforme orientação e semântica; sequências horizontais e progresso vertical mantêm padrões distintos. Tabela compacta preserva rolagem acessível, foco e leitura.
- **Decisão local ao OneDrive:** a superfície usa `OnedriveSummaryKpi`, `OperationalFilterBar` e `ProcessTimeline` com as métricas, etapas e layout aprovados.
- **Limite final:** zero publicado continua visível; ausência factual de transferência/retenção não se apresenta como sucesso; ações rápidas sem workflow não são acionáveis.

## Configurações e Segurança

- **Princípio transferível:** semântica distinta permanece distinta mesmo quando os dados cabem no mesmo card. A regra de domínio e os thresholds ficam na superfície/adaptador; componentes compartilhados recebem itens já projetados.
- **Princípio transferível:** disponibilidade e cobertura independentes continuam separadas; uma fonte ou categoria não determina estado de outra.
- **Decisão local ao OneDrive:** `OperationalClassificationCard` apresenta os itens classificados já formatados; composição de políticas, riscos e recomendações permanece específica à aba.
- **Limite final:** thresholds de Security Score e classificação visual são distintos; categorias de score não se tornam certificação global. Baselines sintéticos de política são dados desta fixture, não recomendações universais.

## Leitura do estudo

Use cada princípio somente quando produto, semântica, dados e responsabilidades coincidirem. As quantidades de KPIs, nomes, thresholds, colunas, breakpoints e hierarquias citados são decisões locais do OneDrive. A confirmação de qualquer API compartilhada continua dependendo do Storybook atual.

Fontes consolidadas: Dashboard Executivo; Contas e Armazenamento; Arquivos e Conteúdo; Compartilhamento e Acessos; Atividade e Sincronização; Usuários Desligados e Retenção; Configurações e Segurança.
