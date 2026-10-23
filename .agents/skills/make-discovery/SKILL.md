---
name: make-discovery
description: Estruture, atualize ou analise o discovery único de uma feature do Orkestria 360 a partir de referências do sponsor ou de um discovery existente. Use para discovery de produto/UI, investigação de fontes/backend ou ambos, sem implementar código nem criar especificações de execução.
---

# Make Discovery

Conduza um único discovery autoritativo por feature. Produto e comportamento
convergem em um contrato semântico compartilhado; frontend e backend são
tracks que o consomem, não discoveries ou contratos paralelos.

`contratos.md` define o significado que o Orkestria oferece. Ele é provider- e
implementation-agnostic: não espelhe endpoint, versão, collector, persistência
ou nomes de propriedades de uma API. Uma fonte prova que esse significado pode
ser satisfeito; a normalização futura reconcilia os dois sem deixar a API definir
o produto.

Não produza código da aplicação, artefatos do Spec Kit, integrações, migrations,
coletores, jobs ou alterações de runtime.

## 1. Determine intenção, track e entrada antes de escrever

1. Extraia domínio, módulo, versão, objetivo e intenção: `criar`, `atualizar`
   ou `analisar`. Se o destino existir, exija intenção explícita. `analisar`
   nunca altera arquivos; `atualizar` preserva decisões ainda sustentadas.
2. Extraia o track: `product-ui`, `backend` ou `full`. Se ele for omitido,
   use `full` para preservar o comportamento anterior e registre essa escolha.
   Leia [tracks e prontidão](references/tracks-e-prontidao.md) antes de
   avaliar a entrada ou a prontidão.
3. Para `product-ui` — e para a parte de produto de um `full` que cria ou
   reabre o produto — exija um diretório local, legível e explicitamente
   informado com referências do sponsor. Normalize o caminho, confirme que é
   diretório e trate todo seu conteúdo como somente leitura. Se alguma condição
   falhar, informe o motivo e pare antes de criar ou alterar artefatos.
4. `backend` pode partir de um discovery existente quando `produto.md`,
   `decisoes.md` e `contratos.md` da superfície já permitem identificar o
   comportamento e os fatos a satisfazer. Antes de iniciar esse track, leia o
   `frontend-coverage-review.md`: só prossiga se o gate agregado do módulo for
   `backend_ready`; caso contrário, registre o bloqueio sem criar
   `backend-coverage-review.md`. Não exija novamente as referências originais
   do sponsor nesse caso. Sem discovery suficiente, exija uma entrada inicial
   que defina produto e contrato; não os invente a partir de uma API.
5. Pesquise `discovery/` para identificar convenções e destinos. Quando o
   destino puder ser inferido, proponha um caminho dentro de `discovery/` e
   obtenha confirmação antes de gravar. Não escolha entre destinos plausíveis.

## 2. Inventarie evidência e classifique a dependência de dados

1. Quando houver referências do sponsor, inventarie recursivamente os arquivos
   e registre caminho relativo, tipo e leitura como `lida`, `ilegível` ou
   `não processada`. Leia os materiais relevantes e registre impacto das
   lacunas sem replicar dados sensíveis desnecessários.
2. Classifique cada afirmação como `confirmada`, `derivação direta`,
   `sugerida/configurável`, `hipótese`, `conflito` ou `ausente`. Não apresente
   inferência como decisão do sponsor.
3. Preserve cada endpoint, API, host, feed, relatório, dataset, fonte interna ou combinação de fontes citado pelo sponsor como **candidato técnico** em `fontes-e-rastreabilidade.md`. Registre origem, fato/capacidade relacionado e status: `unvalidated`, `validated`, `rejected`, `superseded`, `blocked` ou `not_applicable`. Candidato não é fonte validada e não altera `contratos.md`.
4. Classifique cada superfície como `data-backed` quando layout, campos,
   estados, relações, cardinalidade, filtros, cálculos ou comportamento
   observável dependem materialmente de provider externo, projeção local,
   importação, agregação backend ou outra fonte estruturada. A classificação é
   da superfície, não um track novo. Superfícies puramente textuais, estáticas
   ou de navegação são `not_data_backed`.
5. Documente estados de domínio/runtime somente quando forem comportamento
   aprovado da superfície: `available`, `unavailable`, `restricted`,
   `partial`, `stale`, `failed`, `not_yet_published` e `coming_soon`.
   Eles não representam evidência nem prontidão de discovery.
6. Ausência de dado, fonte ou backend nunca significa zero, estimativa, pessoa,
   prazo ou fato de domínio não sustentado. Ausência de `backend_ready` ou de
   `backend_implementation_ready` também não torna uma capacidade
   `unavailable` automaticamente.
7. Discovery não valida, enumera nem registra acesso operacional de
   `tenant_id`, customer ou conexão. Permissões, licenças e consentimento são
   pré-requisitos abstratos da fonte; o collector de produção tratará o acesso
   real por conexão quando vier a ser implementado.

## 3. Conduza o track solicitado

### `product-ui`

1. Descubra outcome, capacidades, superfícies, composição essencial,
   informações, interações, estados, cálculos e limites de produto. Produto não
   é derivado da API.
2. Leia [clarificação](references/clarificacao.md) depois do inventário. Só
   encaminhe ao usuário lacunas `PRODUCT`, `UI` ou `CONTRACT` materiais. Campo,
   cálculo ou relação visual sem fonte ou mapping é `BACKEND_FEASIBILITY` até
   prova em contrário; não o invente para completar a composição.
3. Para cada superfície, registre a classificação de dados e documente produto,
   experiência, decisões e o contrato semântico compartilhado. O contrato deve
   expressar shape, semântica e comportamento observável sem carregar o payload
   do provider.
4. Para uma superfície `data-backed` sem fonte validada, registre os fatos de
   dados e a pendência técnica necessária; não crie fixture ou exemplo de dados
   que introduza campo, relação, regra ou semântica sem sustentação técnica. O produto, o contrato inicial e a UI conceitual
   podem avançar normalmente.
5. Delegue `$ui-blueprint` depois de produto, decisões relevantes e contrato
   inicial suficiente. Para uma superfície data-backed sem fixture rastreável,
   o handoff só pode produzir um blueprint **conceitual**, explícito sobre a
   pendência e sem exemplos com estrutura ou semântica não sustentadas. Com
   fonte e mapping válidos, o `$ui-blueprint` encaminha
   `$frontend-contract-fixtures`; depois receba seus cenários para reconciliação
   explícita do blueprint. Não crie ou edite `ui-blueprint.md` diretamente.
6. Avalie `frontend_implementation_ready` por superfície segundo os gates da
   referência e registre-o no `frontend-coverage-review.md`. Não exija endpoint,
   permission, collector, tabela, migration ou sync apenas por existirem; uma
   superfície data-backed, porém, não está pronta para implementação frontend
   enquanto a UI ainda depender de dados arbitrários. Após implementação e
   homologação visual aprovadas, atualize-a para `frontend_done`.

### `backend`

1. Leia o discovery alvo, especialmente `produto.md`, `decisoes.md`,
   `contratos.md` e `frontend-coverage-review.md`, como intenção e contrato a
   satisfazer. Exija o gate agregado `backend_ready` antes de criar ou atualizar
   `backend-coverage-review.md`.
2. Decomponha capacidades amplas em fatos independentes antes de procurar fonte. Um fato pode usar múltiplas fontes; registre cada contribuição, join e fonte interna sem procurar artificialmente uma única API para retenção, auditoria ou governança.
3. Para cada fato obrigatório, registre em `fontes-e-viabilidade.md` a
   estratégia de fornecimento, fonte canônica, evidência, viabilidade,
   limitações e o mapping fonte → contrato. Decida entre projeção local,
   extensão de fonte canônica, leitura complementar, nova coleta justificada ou
   ausência em escopo. Registre permission, licença, audience e consentimento
   como condições abstratas de consumo, nunca como cobertura ou estado de
   customer.
4. Para API Microsoft externa suportada pelo fluxo de validação que exija leitura nova ou estendida,
   delegue a `$validate-graph`. Ele valida o contrato externo e, na mesma tarefa,
   aciona `$m365-simulator-contracts`; não replique nem edite suas
   responsabilidades. Espere os artefatos `api.md`, `openapi.yaml`,
   `fontes-e-viabilidade.md`, a fonte canônica e a operação sintética
   `SUPPORTED` quando aplicável antes de concluir o mapping.
5. Resolva todos os candidatos técnicos aplicáveis preservados do sponsor antes de concluir um fato como `unavailable`. Ausência de collector, cobertura no Simulator ou homologação local não é ausência de fonte.
6. Trate “payload real” somente como shape, tipos, relações e semântica reais
   confirmados por documentação oficial, OpenAPI/metadata e validação técnica.
   Nunca copie resposta de tenant, PII, IDs, token ou payload bruto. A fixture do
   Simulator é o exemplo executável do provider; ela não é a fixture da UI.
7. Quando uma fonte divergir do contrato, documente a normalização comprovada:
   renomeação, enum, fallback, join, agregação, cálculo, unidade, cardinalidade,
   ausência, paginação, ordenação, enriquecimento ou deduplicação aplicáveis.
   Preserve o contrato quando isso bastar. Se a evidência exigir mudança real de
   produto, volte à clarificação `PRODUCT`, `UI` ou `CONTRACT`; não espelhe o
   provider silenciosamente.
8. Para toda superfície data-backed cuja viabilidade e mapping bastem, entregue
   contrato, mapping e estados ao `$ui-blueprint` conceitual. Ele encaminha o
   `$frontend-contract-fixtures`, que cria as instâncias sintéticas do contrato
   Orkestria sem copiar o payload externo quando a superfície ainda estiver no
   fluxo de produto. O track backend registra a evidência e não altera
   `frontend_done` nem implementa backend.
9. Avalie e registre `backend_implementation_ready` por superfície no
   `backend-coverage-review.md`, sem redefinir os estados de runtime. Calcule o
   gate técnico agregado do módulo sem ocultar bloqueadores por superfície.

### `full`

Para cada superfície data-backed, execute e registre nesta ordem:

1. produto/UI conceitual;
2. contrato semântico inicial;
3. investigação de fonte/backend;
4. `$validate-graph` quando houver API Microsoft externa suportada pelo fluxo;
5. reutilização ou cobertura `SUPPORTED` pelo `$m365-simulator-contracts` quando aplicável;
6. mapping provider ou projeção → contrato Orkestria;
7. UI Blueprint conceitual e handoff ao `$frontend-contract-fixtures`;
8. fixtures sintéticas de Discovery conformes ao mapping e reconciliação
   explícita do UI Blueprint com esses cenários;
9. avaliação de `frontend_implementation_ready` e registro no relatório de
   frontend; só após todas as superfícies data-backed chegarem a
   `frontend_done`, uma etapa backend posterior pode criar o relatório de
   backend e avaliar `backend_implementation_ready`.

Produto continua antes da API. Um blueprint criado antes da investigação é
conceitual e não permanece automaticamente reconciliado se o shape, a
cardinalidade, a nulabilidade, as relações, os estados, os cálculos ou a
composição material forem afetados. Para uma superfície `not_data_backed`,
aplique o fluxo usual e os gates proporcionais.

## 4. Produza o pacote sem fragmentar a feature

Use os templates de `assets/` como ponto de partida e mantenha rastreabilidade.

1. Mantenha `README.md` com objetivo, escopo, decisões transversais e resumo de
   prontidão por superfície, incluindo classificação data-backed e a situação
   conceitual ou reconciliada do blueprint quando material. Em todo discovery
   criado ou atualizado, crie ou atualize `frontend-coverage-review.md` a partir
   do template correspondente e faça o README apontar para ele. Crie ou atualize
   `backend-coverage-review.md` somente no track backend — ou na etapa backend
   de full — depois de o frontend registrar o gate agregado `backend_ready`.
2. Mantenha `fontes-e-rastreabilidade.md` para inventário e evidências das
   referências de entrada; ele não é o mapeamento técnico de fontes.
3. Mantenha `expectativas-do-sponsor.md` para capacidades e resultados
   esperados, sem transformá-lo em atestado de viabilidade técnica.
4. Para cada superfície, mantenha `produto.md`, `design-sugerido.md`,
   `decisoes.md` e `contratos.md`. O último responde qual contrato semântico a
   aplicação deve fornecer — propriedades, tipos, nulabilidade, unidades,
   cálculos, relações, estados, filtros, ordenação, paginação e resultados
   observáveis — e não endpoint, permission, tabela, classe, collector, job,
   sync ou persistência física.
5. Para uma superfície tocada pelo `backend` ou pela fase backend de `full`,
   crie ou atualize `fontes-e-viabilidade.md` a partir de
   [assets/fontes-e-viabilidade-template.md](assets/fontes-e-viabilidade-template.md)
   `api.md` prova a API externa; `openapi.yaml` formaliza apenas seu HTTP
   externo.
6. Quando uma superfície data-backed tiver mapping validado, não crie
   `fixtures/` diretamente. O `$ui-blueprint` encaminha o
   `$frontend-contract-fixtures`, que cria o manifesto e somente os cenários
   que alteram layout, conteúdo, estado, ação, mensagem ou interação. Não
   duplique em outro artefato a informação de contrato, mapping ou provider.
7. Crie `models/` somente quando o módulo exigir um modelo conceitual de
   entidades, cálculo, importação ou histórico. Não descreva schema físico ou
   implementação de produção.

## 5. Compatibilidade e revisão

- Discoveries existentes são válidos. Não crie arquivos novos nem reescreva
  contratos históricos fora das superfícies tocadas.
- Ao atualizar um contrato antigo que mistura integração, separe
  progressivamente a estratégia em `fontes-e-viabilidade.md`, preservando
  decisão e rastreabilidade já sustentadas.
- Antes de concluir, aplique os gates de [tracks e prontidão](references/tracks-e-prontidao.md), confirme as referências usadas e revise os estados aplicáveis. Valores concretos de fixture devem ser sintéticos, plausíveis e conformes ao contrato e ao mapping; não invente campos, regras, semântica, relações ou comportamentos não sustentados.
- Confirme que o UI Blueprint recebeu contrato Orkestria, cenários e fixtures
  criados pelo `$frontend-contract-fixtures`, campos obrigatórios/opcionais,
  nulabilidade, cardinalidade, estados, relações e limites relevantes — nunca
  o payload Microsoft bruto — e que um blueprint conceitual foi reconciliado
  quando a investigação o exigir.
- Confirme que a prontidão é rastreável por superfície, que o handoff agregado
  do módulo não ignora pendências e que nenhuma spec, código, integração ou
  artefato interno do Simulator foi criado. Em `analisar`, apenas reporte a
  ausência dos relatórios ou dos gates; nunca os crie.
