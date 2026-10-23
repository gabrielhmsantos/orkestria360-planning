# Expectativas ilustradas do sponsor — Licenciamento

**Fonte primária**: `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Licenciamento/01…07` e `Microsoft365_Licenciamento.docx`.

## Como ler as referências

As sete imagens definem o **resultado de produto e a arquitetura de informação esperados**; não são uma ordem para inventar preço, renovação, pessoa identificável ou executar alterações no tenant. Cada bloco ilustrado precisa existir na experiência com um dos estados abaixo.

| Estado | Significado |
| --- | --- |
| `available` | Há evidência técnica/comercial autorizada e o bloco mostra o dado e sua procedência. |
| `unavailable` | O bloco continua visível, explica qual dado falta e não mostra zero, dado sintético ou CTA executável. |
| `restricted` | A evidência existe, mas a granularidade nominal depende de identificação do relatório e autorização do tenant. |
| `coming_soon` | É uma capacidade operacional futura; descreve o efeito pretendido e não cria workflow, solicitação ou mutação. |

Em todos os casos, fonte, cobertura temporal, última atualização e frescor pertencem ao bloco — não somente ao cabeçalho da página.

## Contrato por aba

### 1. Dashboard Executivo

O sponsor espera uma leitura executiva que una capacidade, utilização, risco e oportunidade. A aba contém:

- faixa de KPIs com assentos elegíveis totais, atribuídos, disponíveis, custo mensal, economia potencial e health score;
- donut de utilização, lista de licenças premium subutilizadas e gráfico de evolução de custo;
- oportunidades priorizadas, alertas/lembretes e licenças próximas à renovação;
- tabela de licenças por produto, distribuição por departamento e tendência de utilização;
- ações rápidas orientadas para contratação, alteração, simulação, lembretes e exportação.

Na V2, capacidade e utilização técnicas são `available` somente para SKUs classificados como elegíveis. Custo, economia e renovação ficam `unavailable` até a entrada comercial; departamento e uso por pessoa são `restricted`; ações que alterem algo são `coming_soon`. Os painéis continuam no layout para que a ausência de fonte não seja confundida com ausência da necessidade de gestão.

### 2. Inventário de Licenças

O sponsor espera KPIs de produtos, assentos, assinaturas, custo e atenção; busca, filtros e uma tabela densa com dados técnicos e comerciais. Cada produto abre detalhe com Resumo, Usuários atribuídos, Planos de serviço, Contratos/assinaturas e Histórico de alterações.

Capacidade, consumo, estado e planos são `available` a partir da fotografia técnica. Custo, vigência, compromisso, cobrança, origem comercial e contratos são `unavailable` sem Assessment/CSV. Usuários, departamento e última atividade são `restricted`, não removidos silenciosamente. A tabela deve identificar a classificação do SKU (cobrável/elegível, gratuito, trial, capacidade, técnico ou suspenso), para que os totais não sejam contaminados por SKUs fora do universo de assentos.

### 3. Consumo

O sponsor espera KPIs de licenças atribuídas, usuários ativos, uso efetivo, ociosidade, adoção e custo não utilizado; análises por produto e usuário em janelas 7/30/90 dias, distribuição por departamento, tendência e alertas/oportunidades.

O agregado por produto pode ser `available`; pessoa e departamento são `restricted` quando os relatórios forem anonimizados ou o acesso não autorizar identificação. Custo ocioso permanece `unavailable` sem preço confiável. A experiência não pode somar métricas de workloads diferentes como se representassem usuários únicos e deve declarar a cobertura de cada métrica.

### 4. Custos

O sponsor espera resumo financeiro, evolução de custos, custo por produto/departamento/usuário, eficiência, orçamento, alertas e próxima renovação. Essas superfícies permanecem visíveis na V2 como `unavailable`, explicando a dependência de contratos, faturamento e preço efetivo do Assessment/CSV. Valores ausentes, economia, prazo de renovação e conciliação não recebem substitutos numéricos.

### 5. Otimização

O sponsor espera resumo de oportunidades, economia, licenças removíveis, downgrade, realocação e subutilização; fila priorizada, distribuição por categoria, recomendações por produto/pessoa, simulador, exceções/aprovações e resultado realizado.

Recomendações técnicas com regra, período, evidência, confiança, impedimento e recursos impactados podem ser `available`. Economia, simulação, aprovação, remoção, downgrade e realocação são `unavailable` ou `coming_soon` conforme dependam de preço, política, identificação ou workflow. “Analisar evidência” deve continuar acessível quando existe evidência; não pode ser apresentado como uma ação desabilitada sem explicação.

### 6. Histórico

O sponsor espera KPIs de alterações e impacto, linha do tempo filtrável, evolução quantitativa e financeira, e tabelas por produto e usuário. O histórico técnico usa snapshots e eventos próprios, declarando a cobertura desde a implantação. Evolução financeira fica `unavailable`; histórico por usuário é `restricted`. Um evento expõe origem, momento de ocorrência/detecção/sincronização, estado de confirmação e evidência, sem atribuir causa comercial inexistente.

### 7. Planejamento

O sponsor espera indicadores de aquisição, investimento, renovação, economia, crescimento, projetos e solicitações; calendário de renovação, simulador de crescimento, roadmap, simulações, central comercial, consultoria e recomendações estratégicas.

Na V2, cenários técnicos, roadmap e recomendações com premissas podem ser `available`. Aquisição, investimento, renovação, economia, solicitações, central comercial e execução são `unavailable` ou `coming_soon`, pois dependem de fonte comercial e workflow. O espaço deve comunicar o próximo dado necessário, sem criar promessa de compra ou provisionamento.

## Critérios transversais derivados das imagens

1. **Completude estrutural antes de completude de fonte**: blocos ilustrados relevantes permanecem reconhecíveis mesmo quando ainda não podem exibir números.
2. **Universo de cálculo explícito**: totais, donuts, tendências e oportunidades informam se consideram somente SKUs elegíveis; gratuitos, trial, capacidade, técnicos e suspensos não entram automaticamente.
3. **Não confundir ausência com zero**: sem snapshot concluído, preço, relatório ou cobertura histórica, o estado é indisponível/cobertura insuficiente.
4. **Evidência navegável, ação segura**: investigação é leitura; qualquer mutação, pedido, aprovação ou exportação nominal fica indisponível até a fase que a autorizar.
5. **Detalhe condicionado, não apagado**: as áreas por usuário, departamento e contrato mostram a razão de restrição e a condição para habilitação.

## Fora do recorte destas sete telas

A barra de navegação ilustrada também cita Central de Contratação e Renovação e Compliance. Não há telas correspondentes no conjunto `01…07`; portanto elas são referências de ecossistema futuro, não novas abas comprometidas por esta extensão da V2.
