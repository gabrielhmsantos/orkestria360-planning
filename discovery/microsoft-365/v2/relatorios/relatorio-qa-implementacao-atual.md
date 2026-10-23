# QA UX/UI — implementação atual de Relatórios

**Data da revisão:** 2026-09-05  
**Escopo:** as oito rotas autenticadas de Microsoft 365 / Relatórios.  
**Perfil usado:** `Teste Target · Administrador`.  
**Ambientes e evidência:** aplicação local em `http://localhost:8000`; desktop 1440 × 1000 e mobile 390 × 844; inspeção pelo Playwright CLI; Storybook local via MCP.

## Documentos e componentes verificados

- [UI Blueprint](./ui-blueprint.md)
- [Relatório visual das referências do sponsor](./relatorio-visual-das-referencias-do-sponsor.md)
- [Relatório técnico dos dados implementados](./relatorio-tecnico-dados-implementados.md)
- Storybook MCP e stories locais: `DataAvailabilityPanel`, `OperationalKpiCard`, `OperationalTable`, `OperationalTimeline` e `ModuleTabBar`. A expansão posterior do `OperationalKpiCard` foi validada nas stories `Fraction`, `Radial Score`, `With Sparkline` e `Sparkline Without Comparable Series`.

O [UI Blueprint](./ui-blueprint.md) é a representação estrutural autoritativa do módulo nesta revisão. Cada conclusão de composição considera suas faixas, grids, colunas, spans, ordem dos blocos, responsividade e estados de disponibilidade; o relatório visual do sponsor complementa a intenção e a densidade das superfícies.

## Resultado executivo

Há progresso relevante no shell, nos estados de indisponibilidade e na paginação de Segurança. Porém, há **sete defeitos confirmados** de composição/linguagem e **quatro grupos de regiões ainda não implementadas** quando comparados à referência visual do sponsor. O problema central não é mostrar ausência de dados: os painéis existentes fazem isso corretamente. O problema é que, em várias abas, regiões inteiras de KPI, gráfico ou tabela ainda não existem para poderem exibir esse estado — ou ainda não consomem a anatomia compartilhada já disponível.

### Severidade dos achados

| Severidade | Quantidade | Significado nesta revisão |
| --- | ---: | --- |
| Alta | 1 | Expõe linguagem técnica/placeholder ao usuário. |
| Média | 5 | Falta de região material ou comportamento visual importante, prejudica compreensão, consistência ou acessibilidade. |
| Baixa / sugestão | 2 | Melhoria de acabamento; não bloqueia o fluxo atual. |

---

## A. Defeitos confirmados

### Achados superados na reconciliação de 05/09/2026

- **A1 removido:** a decisão de produto é Hero único `Relatórios` com `ModuleTabBar`; o nome da subaba não se repete no conteúdo. Títulos internos identificam apenas regiões, como `Filtros` e `Controles/evidências`.
- **A2 removido:** o Dashboard já adota as faixas `5/7`, `7/5`, `7/5` e `6/6`; `Relatórios recentes` e `Agenda` são regiões independentes.

### A3 — “Evolução e adoção” não implementa o gráfico quando a métrica estiver disponível

- **Severidade:** Média
- **Rota / estado:** `/microsoft-365/reports`; estado atual indisponível foi corretamente exibido com visual de linha. O ramo disponível foi verificado na implementação.
- **Evidência observada:** quando `data.adoption.availability === 'available'`, a página renderiza `Metric`/`OperationalKpiCard` (`Taxa de adoção`) em vez de `ChartPanel type="line"`. O payload atual não contém série temporal comparável.
- **Expectativa:** o blueprint determina `ChartPanel` com série comparável; sem série, `DataAvailabilityPanel visual="line"`. O relatório técnico também registra que a UI atual só recebe taxa agregada e não uma série.
- **Impacto:** a mesma região muda de um painel de linha indisponível para um KPI, não para a visualização que o usuário espera ao existir histórico. Isso impede comparar evolução no tempo.
- **Recomendação:** disponibilizar contrato de série comparável e renderizar `ChartPanel type="line"`; até isso existir, manter o painel de indisponibilidade, sem converter a região em KPI.

### A4 — Segurança apresenta enumerações e placeholder técnico ao usuário

- **Severidade:** Alta
- **Rota / viewports:** `/microsoft-365/reports/security`, desktop e mobile.
- **Evidência observada:**
  - Em `Controles/evidências`, as dez linhas da página 1 mostram o estado literal `unavailable`; o donut e sua legenda também mostram `unavailable` e `100%`.
  - Em `Limitações`, quatro painéis mostram literalmente `source_reason_sanitized` como razão.
  - Isso foi reproduzido também na página 2 por teclado (`Próxima` focado e `Enter`), portanto não é somente uma primeira página estática.
- **Expectativa:** o blueprint exige estado compreensível e texto além de cor; a decisão posterior de produto remove origem, frescor e **status técnico** da apresentação. `source_reason_sanitized` não é uma explicação humana nem um estado publicável.
- **Impacto:** a tela exibe linguagem de contrato interno, não uma limitação acionável. Pode induzir a pessoa a interpretar uma falha técnica como conclusão de compliance.
- **Recomendação:** mapear estados de controle a texto localizado e orientado ao domínio (por exemplo, `Indisponível` apenas quando esse for de fato o estado publicado). Nunca renderizar códigos de sanitização; converter para uma razão humana segura ou omitir aquele item de limitação quando não houver mensagem publicável.

### Achados corrigidos ou reclassificados na reconciliação de 05/09/2026

- **A5 removido:** a tabela de Executivos agora possui estado vazio factual.
- **A6 removido:** o Histórico usa `OperationalTimeline`; a metodologia factual continua pendência de conteúdo sanitizado, não de componente.
- **A7 reclassificado:** Secure Score já usa `variant="fraction"`. Health Score só receberá `variant="radial-score"` se houver fonte canônica aprovada; `sparkline` só será usada com série comparável publicada. Não é permitido criar série para exercer a variante.

---

## B. Itens não implementados frente às imagens do sponsor

Estes itens são lacunas de implementação, não devem ser disfarçados com número zero. Quando seus dados ainda não têm contrato publicado, a região visual deve existir com `DataAvailabilityPanel` (`unavailable`, `restricted` ou `coming_soon`, conforme a causa).

### B1 — Executivos não materializa a composição executiva central

- **Severidade:** Média
- **Rota:** `/microsoft-365/reports/executive`.
- **Evidência:** a tela atual contém somente tabela de duas colunas, metodologia, progresso futuro e formato não aprovado. Não há faixa de seis KPIs/estados, ações rápidas, insights, ranking de relatórios mais gerados ou os quatro argumentos de valor descritos no relatório visual.
- **Expectativa:** relatório visual, seção `03. Relatórios Executivos`: seis regiões de KPI/estado, tabela rica e lateral de ações/insights/ranking; em mobile, regiões em uma coluna e tabela com rolagem informada.
- **Dados existentes:** o relatório técnico confirma que a projeção hoje não possui contratos para esses KPIs, ranking e insights.
- **Recomendação:** criar as regiões com estados explícitos antes de existirem dados; não mostrar valor, tendência ou ação decorativa. A tabela mantém o estado vazio factual já corrigido.

### B2 — Operacionais é apenas consulta de solicitações; falta a superfície operacional representada pelo sponsor

- **Severidade:** Média
- **Rota:** `/microsoft-365/reports/operational`.
- **Evidência:** a tela apresenta um filtro de texto, tabela de solicitações aceitas, detalhe e metodologia. Não há seis KPIs/estados, gráfico de atividade por serviço, donut de armazenamento/conformidade, tendência, top usuários, filtro operacional por escopo ou cards auxiliares.
- **Expectativa:** relatório visual, seção `04. Relatórios Operacionais`, prevê essas regiões e define que fontes restritas não podem virar zero. Os filtros devem permanecer visíveis e não ser decoração.
- **Dados existentes:** o relatório técnico declara que a implementação atual não possui esses contratos e que esta aba consulta pedidos de relatório, não telemetria operacional ampla.
- **Recomendação:** classificar a ampliação como trabalho pendente de produto/dados, mas preservar desde já os slots das regiões com indisponibilidade factual. Não apresentar KPIs sintéticos enquanto o contrato não existir.

### B3 — Segurança só materializa Secure Score, controles e distribuição; métricas de risco e áreas de incidentes/compliance não existem

- **Severidade:** Média
- **Rota:** `/microsoft-365/reports/security`.
- **Evidência:** há Secure Score, tabela paginada, donut, limitações e metodologia. Não há regiões independentes para MFA, usuários de risco, incidentes Defender, vulnerabilidades ou DLP; tampouco donut/lista de incidentes, barras de exposição, auditoria, recomendações ou resumo de compliance.
- **Expectativa:** relatório visual, seção `05`, define essas áreas, e determina que falta de Defender/Intune/Purview mantém cada área informativa em indisponível/restrito — não as elimina.
- **Dados existentes:** o relatório técnico marca os contratos correspondentes como lacunas factuais.
- **Recomendação:** adicionar as regiões em estado explícito e somente conectá-las a dados aprovados quando disponíveis. A implementação correta já existente de Secure Score não deve ser usada como substituto visual dessas métricas independentes.

### B4 — Agendamentos não preserva as regiões KPI/execução/distribuição previstas como “Em breve”

- **Severidade:** Média
- **Rota:** `/microsoft-365/reports/schedule`.
- **Evidência:** a tela traz `Estado de recorrência`, a coluna `Lista` em `coming_soon`, `Canal não habilitado` e `Segurança/retenção`. Não há seis regiões KPI/estado, próximas execuções, execuções recentes, distribuição recente ou modelos de agendamento.
- **Expectativa:** relatório visual, seção `07`: enquanto não houver agenda real, as regiões continuam visíveis e não podem exibir contagem/data fictícia. O relatório técnico confirma que não há recorrência persistida na V1.
- **Recomendação:** manter o estado atual de recorrência como correto, mas adicionar regiões de capacidade futura como `coming_soon`; não criar botões que aparentem concluir novo agendamento.

---

## C. Comportamentos corretos — não são defeitos

| Superfície | Evidência observada | Conclusão QA |
| --- | --- | --- |
| Dashboard | Health Score, Licenças, Evolução e Riscos permanecem no layout e mostram `Dados indisponíveis`; Agenda mostra `Em breve`. | Correto: não há zero artificial e as áreas existentes não somem. |
| Catálogo | Mesmo sem templates, filtros permanecem disponíveis; a tabela contém “Nenhum template corresponde aos filtros atuais” e Requisitos explica que é preciso selecionar um template. | Correto: tabela e detalhe permanecem visíveis. |
| Operacionais | A tabela mostra mensagem factual quando não há solicitações; detalhe permanece no fluxo com painel de disponibilidade. | Correto para a superfície de consulta atualmente implementada. |
| Segurança | Secure Score disponível usa fração factual, sem a antiga lista técnica embaixo. A tabela tem dez controles por página; página 1 de 20 e página 2 de 20 mantiveram o donut em 194/100%. A navegação `Próxima` funcionou com teclado no mobile. | Correto quanto à remoção da lista técnica, à variante `fraction` e à paginação; A4 cobre somente linguagem técnica ainda exposta. |
| Construtor | Sem template, os três blocos `Filtros e seleção`, `Blocos e saída` e `Prévia` permanecem visíveis; blocos e prévia explicam o estado. O layout desktop é `4/4/4`; JSON não é exposto. | Correto. |
| Agendamentos | Recorrência, lista e canal dizem explicitamente `Em breve`, sem marcar job, data, destinatário ou entrega como ativa. | Correto dentro do recorte V1 já implementado. |
| Histórico | Quatro contagens `0` refletem ausência factual de requests/eventos locais; tabela, detalhe e evento sem evidência permanecem no layout. | Correto: não deve ser tratado como ausência de KPI por indisponibilidade. |

---

## D. Responsividade, acessibilidade e acabamento

### D1 — Barra de abas no desktop quebra em segunda linha com uma única aba isolada

- **Classificação:** Sugestão de melhoria
- **Evidência:** em 1440 × 1000, `Histórico e Auditoria` é deslocada sozinha para uma segunda linha; em 390 × 844 há rolagem horizontal (`scrollWidth` 1461, `clientWidth` 358) e indicador `→`.
- **Impacto:** em desktop, a aba isolada parece item fora do grupo e aumenta a altura antes do conteúdo. Em mobile, a rolagem funciona e a sequência pode ser alcançada por teclado — ao focar abas seguintes o container desloca corretamente — portanto não foi classificado como barreira de acesso.
- **Recomendação:** manter rolagem horizontal uniforme ou reduzir densidade/padding de tabs no desktop intermediário, evitando alternar para `flex-wrap` enquanto as oito não couberem na mesma linha.

### D2 — Construtor usa controles HTML nativos em vez da anatomia do design system

- **Classificação:** Sugestão de melhoria
- **Evidência de implementação:** checkboxes e selects de template/bloco/período/formato são `<input type="checkbox">` e `<select>` com classes locais. O Storybook MCP oferece `Checkbox` e `Select` documentados para os controles do sistema.
- **Impacto:** no estado de dados atuais não há template para testar o grupo, mas a divergência pode produzir foco, tamanho e contraste diferentes do restante da aplicação quando os templates forem publicados.
- **Recomendação:** ao ativar essa massa de dados, compor com os controles documentados do design system, preservando label clicável, agrupamento `fieldset/legend` e os estados disabled/busy já corretos.

---

## E. Decisões documentais já superadas — não registrar como regressão

Qualquer referência histórica a metadados de origem, cobertura, frescor ou status técnico não é critério válido para abrir defeito. A decisão posterior e o pedido explícito removeram essa apresentação globalmente.

Esta revisão usou a decisão posterior como fonte de verdade. Por isso:

- não foi considerado defeito o Hero não mostrar fonte/frescor;
- não foi considerado defeito o painel de indisponibilidade não receber `source`;
- não foi considerado defeito o Secure Score não exibir a longa lista técnica anterior;
- A4 é defeito porque ainda expõe **código técnico/placeholder** ao usuário, não porque deixou de mostrar a origem.

## Cobertura de revisão

| Rota | Desktop | Mobile | Resultado resumido |
| --- | --- | --- | --- |
| `/microsoft-365/reports` | Revisada | Revisada | Estados e grade corretos; A3 permanece. |
| `/microsoft-365/reports/catalog` | Revisada | Revisada | Estado vazio/filtros corretos. |
| `/microsoft-365/reports/executive` | Revisada | Revisada | Estado vazio factual corrigido; B1 permanece. |
| `/microsoft-365/reports/operational` | Revisada | Revisada | Superfície de consulta correta; B2 permanece. |
| `/microsoft-365/reports/security` | Revisada, página 1/2 | Revisada, teclado na paginação | A4 e B3 permanecem; fração e paginação corretas. |
| `/microsoft-365/reports/builder` | Revisada | Revisada | Disponibilidade/4-4-4 corretos; D2 permanece. |
| `/microsoft-365/reports/schedule` | Revisada | Revisada | Capacidade atual correta; B4 permanece. |
| `/microsoft-365/reports/history` | Revisada | Revisada | Timeline e vazio factual/KPIs locais corretos; metodologia sanitizada permanece. |

## Próxima priorização sugerida

1. Corrigir A4 e A3 antes de nova validação visual: linguagem técnica em Segurança e a série comparável de Evolução/Adoção ainda não estão resolvidas.
2. Planejar B1–B4 conforme a ampliação formal do `ui-blueprint.md`: materializar as regiões com disponibilidade, sem inserir métricas, séries ou ações fictícias.
3. Aplicar D1/D2 e a metodologia sanitizada do Histórico como acabamento de responsividade, acessibilidade e consistência de design system.
