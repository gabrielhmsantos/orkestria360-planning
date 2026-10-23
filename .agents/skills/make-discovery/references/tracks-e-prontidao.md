# Tracks, contrato e prontidão

Leia esta referência antes de selecionar a entrada, executar um track ou
declarar prontidão. Ela preserva um discovery único; não cria produto ou
contrato paralelos.

## Intenção e entrada

| Intenção / track | Entrada mínima | Escrita permitida |
| --- | --- | --- |
| `criar` + `product-ui` | referências locais do sponsor e destino confirmado | pacote de produto/UI |
| `criar` + `backend` | discovery existente suficiente e `frontend-coverage-review.md` com módulo `backend_ready` | evidência, mapping e relatório backend |
| `atualizar` + `product-ui` | referências que justificam a alteração de produto/UI | superfícies afetadas |
| `atualizar` + `backend` | discovery existente e módulo `backend_ready`; referências do sponsor são opcionais | superfícies técnicas afetadas e relatório backend |
| `full` | referências do sponsor quando cria ou reabre produto; discovery existente quando apenas completa fontes | produto e fonte para a UI; backend somente após o handoff |
| `analisar` | a entrada do track correspondente | nenhuma |

Um `backend` sem contrato semântico suficiente não pode derivar produto de
endpoint, payload ou código. Também não pode iniciar antes de o módulo constar
como `backend_ready` no relatório de frontend. Registre o bloqueio e a
superfície que precisa de `product-ui` ou de `frontend_done`.

## Superfícies data-backed

Uma superfície é `data-backed` quando seu layout, campos, estados, relações,
cardinalidade, filtros, cálculos ou comportamento observável dependem
materialmente de Microsoft Graph, Defender, Azure, outra API externa, projeção
ou banco local, importação, agregação backend ou outra fonte estruturada.

Essa é uma característica da superfície dentro dos tracks existentes. Uma
superfície puramente estática, textual ou de navegação é `not_data_backed` e não
precisa dos gates de fonte externa. A classificação deve aparecer no artefato da
superfície e na matriz do `README.md` quando aplicável.

## Responsabilidade dos artefatos

| Artefato | Responsabilidade |
| --- | --- |
| `produto.md` | outcome, capacidades e limites de produto únicos |
| `design-sugerido.md` | experiência, composição essencial e interações de alto nível |
| `decisoes.md` | decisão, origem, evidência, pendência e clarificação aceitas |
| `contratos.md` | contrato semântico provider- e implementation-agnostic consumido pela superfície |
| `fontes-e-viabilidade.md` | mapping contrato → estratégia, fonte, normalização, viabilidade e limitações |
| `api.md` | evidência e decisão sobre API externa |
| `openapi.yaml` | request/response HTTP externo |
| `fixtures/` | instâncias sintéticas verificáveis do contrato Orkestria para cenários materiais |
| `fixtures/README.md` | proveniência mínima de contrato, cenário e linhas de mapping de cada fixture |
| `ui-blueprint.md` | composição estrutural e instâncias verificadas do design system |
| `frontend-coverage-review.md` | cobertura por superfície do discovery, fixtures, implementação e homologação frontend; contém o handoff agregado `backend_ready` |
| `backend-coverage-review.md` | cobertura técnica por superfície para implementação backend; só existe após o handoff frontend |

Uma exceção externa em `contratos.md` exige justificativa: só inclua provider,
proveniência ou categoria de restrição quando o usuário precisa observá-la para
interpretar o comportamento. Não inclua detalhes operacionais apenas porque o
backend os necessita.

## Contrato e fixtures seguros

Documente em `contratos.md`, quando aplicável, shape, tipos, nulabilidade,
cardinalidade, relações, unidades, ranges factuais, cálculos, filtros,
ordenação, paginação, availability, coverage, freshness e semântica de ausência.
Ele não recebe endpoints, propriedades obrigatórias do provider, collector ou
persistência física.

Para uma superfície data-backed, uma fixture de Discovery é uma instância
sintética verificável desse contrato. Não é fonte de verdade do domínio nem
payload bruto do provider. Seus valores são sintéticos, sem customer, tenant,
PII, ID real, token ou resposta coletada, mas preservam estrutura, semântica,
tipos e relações plausíveis já sustentados pelo mapping.

Nomes, labels, IDs, datas, números, coleções e relações podem — e quando
necessário devem — ser sintéticos. IDs e relações fictícios são permitidos desde
que existam no dataset aplicável e respeitem contrato, tipos, nulabilidade,
cardinalidade, enums, ranges, cálculos, estados e mapping. A proibição é de IDs
ou dados reais de tenant, customer, conexão ou coleta de produção, e de
estrutura ou comportamento sem sustentação.

O `$frontend-contract-fixtures` cria `fixtures/default.json` e somente cenários
adicionais que mudem a UI. `empty` factual não equivale a `unavailable` por
fonte indisponível; mantenha a semântica de ausência definida no contrato. O
manifesto em `fixtures/README.md` aponta para o trecho de `contratos.md`, o
cenário, as linhas de `fontes-e-viabilidade.md` e o efeito observável da
fixture, sem copiar essas regras.

Inclua uma State Matrix em `contratos.md` quando ela tornar uma superfície
verificável. Ela relaciona cenário, runtime state, dados permitidos e resultado
observável; não force estados irrelevantes. `loading` de UI não substitui estado
de domínio.

## Provider, Simulator e mapping

O Simulator e a fixture de Discovery têm responsabilidades distintas:

```text
Simulator          = exemplo executável da resposta externa do provider
Discovery fixture  = exemplo executável do contrato Orkestria para a UI
```

Para uma API Microsoft externa suportada pelo fluxo (hoje Graph, Defender, Azure
e Office 365 Management Activity API), `$validate-graph` valida a fonte externa e
aciona `$m365-simulator-contracts`. O discovery então recebe `api.md`,
`openapi.yaml`, fonte canônica, viabilidade e uma operação sintética `SUPPORTED`
quando aplicável. Pode inspecionar o payload externo sintético pelo Microcks,
aplicar conceitualmente o mapping e compará-lo à fixture de Discovery; não copia
a fixture do Simulator nem documenta `mockPath`, URL Microcks ou detalhes de
runtime como contrato visual.

`fontes-e-viabilidade.md` responde, para cada fato estrutural que a UI espera:
de onde ele vem e qual transformação é necessária. Documente direto,
renomeação, enum, fallback, 1:1, 1:N, join, agregação, cálculo, unidade,
nulabilidade, ausência, ordenação, paginação, enriquecimento e deduplicação
quando aplicáveis. Distinga coleção vazia de provider indisponível; a segunda
deve produzir o estado semântico definido pelo contrato, não uma coleção vazia
inventada.

## UI Blueprint

Uma superfície data-backed sem fonte/mapping/fixture ainda pode ter blueprint
conceitual: ele usa o contrato inicial e registra a pendência técnica, sem
exemplos que acrescentem estrutura ou semântica não sustentada. Isso não é um
novo estado de readiness.

Com fonte e mapping válidos, o `$ui-blueprint` conceitual encaminha o
`$frontend-contract-fixtures`. Antes de finalizar ou reconciliar a UI Blueprint
data-backed, entregue ao `$ui-blueprint` o contrato Orkestria, cenários
relevantes, fixtures de Discovery, campos obrigatórios e opcionais,
nulabilidade, cardinalidade, estados, relações e limites. Não entregue o
payload Microsoft bruto como contrato visual. Se um blueprint anterior puder ter
sido afetado pelo shape, relações, cardinalidade, nulabilidade, estados ou
cálculos descobertos, a reconciliação é explícita.

## Eixos independentes e handoff

| Eixo | Exemplos | Registro |
| --- | --- | --- |
| Evidência/decisão | `confirmada`, `derivação direta`, `hipótese`, `conflito`, `ausente` | decisões e afirmações do discovery |
| Runtime/domínio | `available`, `unavailable`, `restricted`, `partial`, `stale`, `failed`, `not_yet_published`, `coming_soon` | contrato e experiência da superfície |
| Cobertura frontend | `source_required`, `decision_required`, `fixture_ready`, `mutation_approved`, `frontend_implementation_ready`, `frontend_done` | `frontend-coverage-review.md` |
| Handoff do módulo | `backend_ready`, `blocked` | resumo do `frontend-coverage-review.md` e README |
| Cobertura backend | `contract_required`, `source_required`, `validation_required`, `mapping_required`, `strategy_required`, `decision_required`, `backend_implementation_ready`, `not_applicable` | `backend-coverage-review.md` |

Cobertura é sempre por superfície. `backend_ready` é excepcionalmente um gate
agregado de módulo: exige cada superfície `data-backed` em `frontend_done` e
não pode ocultar pendências. Não introduza `spec_ready` nesta fase: ele pertence
à futura formalização no Spec Kit.

## Gates de prontidão

Para toda superfície, marque `frontend_implementation_ready` somente quando outcome,
capacidades obrigatórias, composição essencial, interações materiais, contrato
semântico, tipos/nulabilidade/unidades relevantes, estados e cálculos que
alteram a UI estiverem definidos; clarificações `PRODUCT`, `UI` e `CONTRACT`
materiais estiverem resolvidas; e a UI Blueprint estiver concluída.

Para uma superfície `data-backed`, isso também exige:

1. contrato semântico suficiente;
2. fonte dos fatos identificada;
3. API externa validada quando houver provider externo;
4. shape externo conhecido por documentação oficial e contrato técnico;
5. operação relevante `SUPPORTED` pelo Simulator quando a API externa estiver no escopo do Simulator;
6. mapping fonte/provider → contrato Orkestria documentado;
7. fixtures de Discovery sintéticas e rastreáveis a esse mapping; e
8. UI Blueprint criado ou reconciliado com cenários representativos dessas fixtures.

Uma projeção local não exige API externa ou Simulator, mas continua exigindo
fonte identificada, mapping e fixture rastreável se sua realidade puder alterar
a UI. Fixture que apenas seria possível escrever, ou que exige campos, regras,
relações ou semântica livres para preencher componentes, não satisfaz o gate.
Valores concretos sintéticos e plausíveis, conformes ao contrato e ao mapping,
são esperados. Collector, tabela, migration, job, sync ou backend finalizado
não são pré-requisitos independentes. Após a UI estar implementada e homologada
visualmente, marque a superfície como `frontend_done`.

O módulo fica `backend_ready` somente quando todas as suas superfícies
`data-backed` estiverem `frontend_done`. Uma superfície `not_data_backed` é
`not_applicable`; qualquer outra categoria bloqueia o handoff e a criação do
`backend-coverage-review.md`.

Depois do handoff, marque `backend_implementation_ready` somente quando o
contrato estiver suficiente e cada fato
obrigatório tiver estratégia de fornecimento; reuso versus coleta decidido;
APIs necessárias documentadas ou validadas; permission, licença, consentimento,
paginação, retry e freshness relevantes compreendidos como pré-requisitos;
persistência/histórico descritos no nível de discovery; e o comportamento de
falha que o collector deverá tratar estiver semanticamente conhecido; cada candidato técnico aplicável preservado do sponsor tiver disposição final explícita. Não pode
restar incógnita técnica material que invalide o contrato. Este gate não mede
acesso, licença ou cobertura de customers individuais.

Registre no `README.md` os links, os bloqueadores de cada gate e o próximo
passo. O track de frontend não cria o relatório backend; o track backend não
altera `frontend_done`. Nenhum desses gates altera automaticamente o runtime
state.
