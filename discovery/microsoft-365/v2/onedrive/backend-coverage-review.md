# Cobertura de backend — Microsoft 365 / OneDrive

> Discovery técnico para orientar a implementação. Prontidão de Discovery não
> significa backend implantado nem dados reais já publicados por conexão.

## Prontidão técnica do módulo

- **Gate técnico agregado:** `backend_implementation_ready`.
- **Análise independente final:** `[]` — nenhum achado confirmado nos69artefatos
  consolidados, cobrindo as oito abas e o blueprint completo em2026-10-15.
- **Cobertura:** oito de oito superfícies `data-backed` com contrato, fontes,
  validação, mapping, estratégia e falhas suficientes para
  `backend_implementation_ready`, confirmadas pela análise independente final.
- **Revisão corrente:** 2026-10-15. Substitui os pareceres anteriores de oito
  abas prontas e de sete prontas/B4 pendente. A1–A8 e B1–B11 estão resolvidos
  nos artefatos atuais. Não há clarificação de produto pendente.
- **Decisões:** Q1–Q5, R1–R5 e C1–C9 aceitas e incorporadas. C6–C9 são
  propostas do agente aceitas expressamente pelo usuário nesta rodada; não são
  atribuídas retroativamente ao DOCX ou aos números das imagens/fixture.
- **Critério:** `/beta` é aceito. Collector implantado, histórico acumulado,
  licença/consentimento de cada customer e novo `200` em cada conexão não são
  gates de Discovery. O frontend mantém `frontend_done` e `backend_ready`.
- **Evidência:** oito OpenAPI/33 operações conformes; Simulator com87operações/
  53caminhos literais, cinco serviços importados e smoke aprovado após a
  correção B5. Blueprint conceitual e fixture histórica são verificados
  separadamente; nenhum desses gates substitui a análise semântica integral.

## Categorias

| Categoria | Significado |
| --- | --- |
| `contract_required` | O contrato não identifica suficientemente os fatos a fornecer. |
| `source_required` | Falta fonte ou estratégia para um fato obrigatório. |
| `validation_required` | Candidato identificado, com validação técnica aplicável pendente. |
| `mapping_required` | Falta completar a normalização entre fonte e contrato. |
| `strategy_required` | Reuso/coleta, histórico ou tratamento de falha ainda não definidos. |
| `decision_required` | Falta decisão material de produto, contrato ou escopo. |
| `backend_implementation_ready` | Contrato, fontes, validação, mapping, estratégia e falhas permitem iniciar implementação. |
| `not_applicable` | A superfície não requer backend e não bloqueia o gate. |

## Como ler a coluna `Dados`

`data-backed` significa dependência de fatos reais e derivações rastreáveis:
APIs Microsoft, fontes internas ou projeções persistidas. Não significa
collector/controller existente ou produção habilitada. A categoria avalia
prontidão separadamente.

## Matriz por superfície

| Superfície | Dados | Categoria | Evidência e implementação delimitada |
| --- | --- | --- | --- |
| Dashboard Executivo | `data-backed` | `backend_implementation_ready` | [Mapping](dashboard-executivo/fontes-e-viabilidade.md): compor publicações canônicas, com disponibilidade independente. Distribuições e limites preservados; Health Score fora da UI atual. |
| Contas e Armazenamento | `data-backed` | `backend_implementation_ready` | [Mapping](contas-e-armazenamento/fontes-e-viabilidade.md): Reports, identidade/licenças, drives plurais, histórico e previsão com2–6snapshots factuais. Forecast usa `max(0,ceil(restante/crescimento))` apenas com crescimento positivo; capacidade restante assinada. B5 fecha períodos sintéticos de uso. |
| Arquivos e Conteúdo | `data-backed` | `backend_implementation_ready` | [Mapping](arquivos-e-conteudo/fontes-e-viabilidade.md): Q5 inventário de todos os drives elegíveis, delta/hierarquia, labels, lixeira beta, candidatos por hash. A7 exige zero explícito e cobertura íntegra; A8 versões paginadas/IDs distintos. Faixas de tamanho e idade explícitas. |
| Compartilhamento e Acessos | `data-backed` | `backend_implementation_ready` | [Mapping](compartilhamento-e-acessos/fontes-e-viabilidade.md): permissões atuais, feed e snapshots separados; C1 partição exclusiva de arquivos. Evento de criação não prova acesso vigente; herança e ausência não são presumidas. |
| Atividade e Sincronização | `data-backed` | `backend_implementation_ready` | [Mapping](atividade-e-sincronizacao/fontes-e-viabilidade.md): A2 conjuntos distintos, C2 saúde diária, R3 fotografias mensais, C3/C4 benefícios e C6 arquivos distintos com atividade de compartilhamento. B3 cobre4períodos. Inativos usam atividade da pessoa D180, independente de uso do espaço; Health e Intune têm populações separadas. |
| Usuários Desligados e Retenção | `data-backed` | `backend_implementation_ready` | [Mapping](usuarios-desligados-e-retencao/fontes-e-viabilidade.md): Q1 episódios observados7dias+OneDrive, exclusão correlacionada imediata, sem HR. R1 recomendações90/180/730+carência local30. Exposição externa vem das permissões atuais. Workflow humano desconhecido permanece ausente; sem mutação automática. |
| Configurações e Segurança | `data-backed` | `backend_implementation_ready` | [Mapping](configuracoes-e-seguranca/fontes-e-viabilidade.md): baselines/pesos Q4/R4/R5, C5 risco de arquivos atuais, C7 alertas criados D30 e C8 arquivos pelo fim nominal combinado. Cinco métricas de retenção independentes; leitores complementares por perfil/primeira leitura admitida. |
| Histórico e Auditoria | `data-backed` | `backend_implementation_ready` | [Mapping](historico-e-auditoria/fontes-e-viabilidade.md): feed, lifecycle, configuração local A4 e operações A5. Links Anônimos Criados só `AnonymousLinkCreated`; C9 seleciona Alto/Crítico antes dos filtros, até5IDs sem reposição. |

## Achados e condições de saída

As condições abaixo estão satisfeitas nos contratos/mappings e no adendo do
[blueprint](ui-blueprint.md). A última análise independente do conjunto
consolidado retornou `[]`, satisfazendo o critério adicional exigido pelo usuário.

| Achado | Situação atual | Evidência / condição satisfeita |
| --- | --- | --- |
| A1 — conformidade OpenAPI | Resolvido | Path Item/Operation de Contas e Atividade corrigidos; descrições YAML de Arquivos/Segurança corrigidas; `{period}` declarado no raiz. Oito contratos aprovados por SwaggerParser12.1.0 e parâmetros required conferidos. |
| A2 — acessados/editados | Resolvido | [Mapping](atividade-e-sincronizacao/fontes-e-viabilidade.md#a2--itens-acessados-e-editados-separados): auditoria canônica, conjuntos distintos de arquivo/ator, janela UTC, departamento não aditivo, snapshots diários400dias e detalhe90dias. Não dividir o CSV combinado. |
| A3 — estados/correlação | Resolvido: C2 aceita A | [Mapping](atividade-e-sincronizacao/fontes-e-viabilidade.md#disposição-c2-aceita-a--saúde-diária): saúde diária reportada, clientes OneDrive e inventário Intune separados; fator de dispositivos com universo explícito. É revisão de escopo aprovada, sem alegar estados instantâneos ou equivalência de IDs. |
| A4 — quatro fontes de auditoria | Resolvido | [Mapping por perfil](historico-e-auditoria/fontes-e-viabilidade.md#a4--configuração-das-quatro-fontes): Ativo/Desativado são enabled local registrado; configuração ausente não vira false. Feed, serviço/política e cobertura são fatos distintos. Reuso dos consumidores canônicos. |
| A5 — operações canônicas | Resolvido | [audit-operations-v1](historico-e-auditoria/fontes-e-viabilidade.md#a5--normalização-canônica-audit-operations-v1): operações reais, resultados específicos do schema, código/categoria, KPI, desconhecidos e sinais derivados; um evento por Id. |
| A6 — partição de compartilhamento | Resolvido: C1 aceita A | [Decisão e mapping](compartilhamento-e-acessos/fontes-e-viabilidade.md#a6--distribuição-exclusiva-c1-aceita-a): arquivo único, precedência aprovada, denominador classificado e cobertura. Risco permanece independente. |
| A7 — estatística incompleta | Resolvido | [Admissão de acesso](arquivos-e-conteudo/fontes-e-viabilidade.md#acesso-sem-uso): zero explícito por bucket/ação, janela inteira coberta e sem incompleteData. `200 value:[]`, access ausente e gaps são desconhecidos. Ledger400dias não corrige incompletude da origem; >365 é condicional. |
| A8 — versões por arquivo | Resolvido | [API](arquivos-e-conteudo/api.md#versoes-disponiveis-por-arquivo), [mapping](arquivos-e-conteudo/fontes-e-viabilidade.md#versoes-por-arquivo), OpenAPI e operação `graph.v1.onedrive.drive-item-versions` SUPPORTED. Contagem por IDs distintos, nextLink, leitura parcial e cadência definidos; gates aprovados. |
| B1 — métricas de benefícios da sincronização | Resolvido — C3/C4 aceitas A | [Contrato](atividade-e-sincronizacao/contratos.md#principais-benefícios--c3c4-aceitas) e [mapping](atividade-e-sincronizacao/fontes-e-viabilidade.md#b1--benefícios-c3c4-aceitas): armazenamento utilizado canônico de Reports; KFM aplicado por cliente; razão upToDateReported/classificadosC2. Tipos/unidades/asOf/cobertura/ausência e novos bindings explícitos. |
| B2 — população do Resumo de Riscos | Resolvido — C5 aceita A | [Contrato](configuracoes-e-seguranca/contratos.md#shape-e-semântica) e [mapping](configuracoes-e-seguranca/fontes-e-viabilidade.md#b2--resumo-de-riscos-população-c5-aceita-a): arquivos atuais únicos no maior risco, quatro níveis, Informativo/desconhecido na cobertura, snapshot comparávelD30 e sem baseline inventado. |
| B3 — períodos de atividade no Simulator | Resolvido | [API](atividade-e-sincronizacao/api.md#b3-periodos-do-relatorio-de-atividade), [mapping](atividade-e-sincronizacao/fontes-e-viabilidade.md#b3-periodos-do-relatorio-de-atividade) e mesma operação SUPPORTED para D7/D30/D90/D180; CSV11colunas/ReportPeriod e erroD365 cobertos, gates aprovados e evidências da aba vinculadas ao inventário. |
| B4 — KPI único de compartilhamento | Resolvido — C6 aceita A | [Contrato e mapping](atividade-e-sincronizacao/fontes-e-viabilidade.md): arquivos únicos com atividade registrada, operações qualificantes, identidades factuais, união entre atores/públicos/dias, conjuntos400dias e comparação sóD30. Resultado ausente não afirma sucesso; cobertura explícita. |
| B5 — payloads Reports no Simulator | Resolvido | [Correção sintética](api.md#correção-de-cobertura-sintética--reports-de-uso-d180): Usage D180 deixou de servir CSV D30; datas/atividade D30 e coerência entre janelas corrigidas. Mesmas operações, gates completos aprovados. |
| B6 — Links Anônimos Criados | Resolvido técnico | [Mapping Auditoria](historico-e-auditoria/fontes-e-viabilidade.md): somente `AnonymousLinkCreated`, IDs únicos D30. Links de organização/específicos não entram nesse KPI. |
| B7 — exposição externa de desligados | Resolvido técnico | [Mapping Desligados](usuarios-desligados-e-retencao/fontes-e-viabilidade.md): permissões atuais canônicas e arquivos únicos por caso; evento histórico não comprova acesso vigente. |
| B8 — usuários sem atividade (GA4) | Resolvido técnico após contraexemplo | [Mapping Atividade](atividade-e-sincronizacao/fontes-e-viabilidade.md#usuários-sem-atividade--atividade-da-pessoa-ga4): pessoa licenciada, identidade canônica e ActivityUserDetailD180/LastActivityDate/ReportRefreshDate, corte>90dias. Atividade do espaço de propriedade não substitui a da pessoa; data/linha/identidade/licença desconhecida reduz cobertura. |
| B9 — unidade/relógio do Defender | Resolvido — C7 aceita A | [Mapping Segurança](configuracoes-e-seguranca/fontes-e-viabilidade.md): `reportedAlerts30d`, IDs de alertas criados em `[T-30dias,T)`, qualquer classificação/status, evidência OneDrive/SharePoint do tenant. Contexto de alertas observados, sem afirmar ameaça confirmada. |
| B10 — próximas retenções | Resolvido — C8 aceita A | [Contrato Segurança](configuracoes-e-seguranca/contratos.md): `filesWithNominalRetentionEnd15d`, arquivos atuais únicos pelo último fim nominal aplicável resolvido, datasUTC de hoje até+15inclusive. Holds/âncoras não resolvidos são desconhecidos; sem promessa de liberação/exclusão. |
| B11 — Atividades Críticas24h | Resolvido — C9 aceita A | [Contrato Auditoria](historico-e-auditoria/contratos.md): somente Alto/Crítico, risco descendente/recência/ID, janela factual24h, base até5eventos únicos. Filtros intersectam a base sem reposição; não gerar eventos para sinais em massa. |

### Normalizações técnicas adicionais

- **Forecast:** capacidade restante pode ser negativa; dias até saturação têm
  piso0 com crescimento positivo. Data projetada não é data histórica de
  estouro; referência factual e pré-requisitos2–6snapshots preservados.
- **Faixas:** utilização, tamanhos base1024 e idade em dias completos têm
  fronteiras explícitas nos contratos de Contas/Dashboard/Arquivos. O bucket
  visual de utilização e o limiar operacional crítico são regras diferentes.
- **Scores:** intervalos contínuos aceitam decimais sem lacunas; denominadores,
  pesos fixos e ausência com motivo permanecem aprovados.
- **Sincronizados:** soma das contribuições reportadas por pessoa, uma por
  identidade/período; não cardinalidade global de arquivos, tentativas ou
  clientes. R3 mensal continua independente.
- **Rastreabilidade:** removidos conflitos atuais de filtros, navegação e
  estados de runtime. Revisões históricas de frontend/fixture/reconciliação
  têm precedência explicitada para Q/R/C atuais e adendo conceitual.

## Rodadas de convergência —2026-10-15

| Rodada | Escopo e resultado | Tratamento |
| --- | --- | --- |
| 1 — análises delegadas por domínio | Oito abas, contratos/fontes/APIs e frontend como expectativa histórica. Confirmou B4/B5, unidades de auditoria/Defender, exposição de desligados, inatividade e normalizações. | Reparos técnicos e investigação; C6/C7 preparadas a partir de alternativas fechadas. |
| 2 — contraexemplos e clarificação | Reavaliação dos domínios e gráficos/métricas. C6/C7 aceitas; identificadas populações de vencimentos e seleção de atividades críticas. | C8/C9 aceitas A; contratos/fontes/decisões/design e blueprint alinhados. |
| 3 — análise global independente | Leitura dos69artefatos do Discovery, incluindo blueprint completo; cruzamento com fontes primárias e Simulator. Encontrou incoerências temporais adicionais do provider e o contraexemplo de atividade da pessoa versus espaço. | B5 reforçado e smoke completo aprovado; B8 corrigido para ActivityUserDetailD180. Resíduos de precedência e links saneados. |
| 4 — reanálise final consolidada | Revisor independente releu69artefatos estáveis e os oito domínios; resultado `[]`. | Nenhum achado confirmado ou incógnita técnica material no recorte aprovado; gate agregado `backend_implementation_ready`. |

A correção inicial B8 por uso dos espaços foi rejeitada na terceira rodada:
uma pessoa pode agir em espaço alheio, e terceiros podem usar seu espaço.
A correção atual preserva o significado explícito do DOCX §5 e usa a fonte por
usuário já selecionada. Esse contraexemplo não foi ocultado pela aprovação
estrutural dos artefatos.

A análise final foi executada pelo subagente independente
`analyze_global_convergence`, após liberação de todos os escritores. Seu
snapshot de entrada, anterior apenas ao registro deste fechamento, teve
SHA-256 agregado `440212dc5a80e2b85cccb950f6ed83f0b29346f173d6a08681c0e2ab00f70103`.
A revisão verificou origem/mapping, unidade/cardinalidade, identidade/joins,
cálculos, ausência, cobertura/frescor, histórico, paginação/erros e cobertura
`SUPPORTED` aplicável, sem tratar gates estruturais como prova de semântica.

## Verificações documentais e sintéticas

- **OpenAPI:** SwaggerParser12.1.0 nos oito contratos externos, com resolução
  de referências e conferência dos parâmetros obrigatórios:33operações,
  zero falhas. Dashboard compõe projeções e não exige OpenAPI Microsoft próprio.
- **Simulator:** geração, inventário87operações/53caminhos, validação87/5,
  importação dos5serviços e smoke aprovados após B5. Abrange Activity
  D7/D30/D90/D180, UsageAccountDetail/FileCounts D30/D180, coerência temporal,
  campos ausentes e D365→400InvalidPeriod; mantém A7/A8. Sem nova chamada tenant.
- **Blueprint:** validador estrutural aprovado;241links/âncoras locais de
  todos os Markdown conferidos, zero erros. O adendo conceitual registra
  unidades/bindings/ausência C6–C9 e separa pessoas, espaços, clientes e Intune.
- **Frontend:** fixture global válida e TypeScript gerado consistente
  (`--check`), como evidência histórica. Não validam fórmulas de produção,
  integrações ou as novas semânticas por reprodução de números sintéticos.
  `git diff --check` também aprovado.
- **Escopo:** nenhum teste ou código de aplicação foi criado/executado nesta
  convergência; mudanças no Simulator são do contrato externo delegado.

## Resultado da revisão por imagens — R1–R5

| Decisão aceita | Mudança vigente e limite |
| --- | --- |
| R1 — Retenção Configurada | 90dias geral/180 cargo explicitamente crítico/730 exceção legal aprovada; carência local30dias. Recomendações não garantem armazenamento Microsoft ou criam datas de caso |
| R2 — risco residual por objeto | Arquivo avaliado sem achado Informativo; evento rotineiro com sucesso/contexto Baixo; compartilhamento restrito/revisado de leitura Baixo, com prazo<=30dias se externo. Regras superiores DOCX prevalecem; contexto insuficiente não classificado |
| R3 — evolução mensal | Dispositivos/clientes Health e quantidade de erros reportados30dias, com referências/coberturas próprias. KPI Reports de arquivos separado; meses não coletados nulos |
| R4 — versões | Referência manual500, sem365dias adicional; automático não avaliável contra o número. Detector>50versões por arquivo permanece independente |
| R5 — retenção corrente | Quantidade de arquivos atuais comprovadamente protegidos e soma de seus tamanhos atuais; cinco métricas no card. Exclui versões/lixeira/cópiasPHL; sem prova mantém parcial/desconhecido, zero exige avaliação íntegra |

As mudanças R3/R5 têm bindings semânticos próprios: a fixture histórica não
é reinterpretada para representar unidades/populações diferentes. R1/R2/R4
também exigem reconciliação futura dos textos/regras publicados. Não houve
nova fonte externa ou execução de operação de provider na rodada R1–R5. Regras
explícitas no DOCX e defaults sem divergência visual comprovada foram
preservados; a [triagem integral](backend-defaults-e-clarificacoes.md#evidência-e-triagem-integral)
explica cada disposição.

## Limites observacionais e pré-requisitos de publicação

- Graph `GET /beta/sites/{site-id}/recycleBin/items`: beta aceita pelo projeto;
  falta observar resposta `200` porque a validação não tinha `site-id` resolvido
  nem claim `Files.Read.All`.
- Graph `POST /drives/{drive-id}/items/{item-id}/extractSensitivityLabels`:
  nenhuma chamada real foi feita, pois a operação pode atualizar metadados do
  item; somente contrato oficial e resposta sintética do Simulator estão
  registrados.
- Graph `GET /security/labels/retentionLabels`: as tentativas app-only
  retornaram `401`; a Microsoft documenta somente permissão delegated para essa
  rota. Não integra a estratégia selecionada; export Purview por certificado
  fornece o catálogo necessário, com perfil/primeira leitura no onboarding.
- Graph Data Connect OneDrive Sync Errors não é endpoint REST síncrono. O
  catálogo/schema tem divergência de versão preservada. Q3 aprovou importer por
  perfil oficial e primeiro run completo, com snapshot rolling30d mensal.
  Não afirmar compatibilidade estática v1 nem ocorrências exclusivas do mês.
- SPO/CSOM/Purview/Exchange: fontes de leitura primárias documentadas com
  autenticação/mapping definidos, sem sessão executada nesta investigação.
  Antes da publicação, validar perfil/roles/certificado e primeira leitura
  completa; ausência/incompatibilidade preserva estado desconhecido/última
  publicação válida. Não criar endpoint HTTP fictício no Simulator.

Esses limites são condições operacionais de publicação por conexão/fato;
não são falta de estratégia ou de fonte no Discovery aprovado. Collector,
certificado, consentimento/licença, primeira extração e snapshots reais serão
tratados pela implementação. Falta de fonte publicada não autoriza zero nem
fallback sintético.

`subscriptions/start` já foi executado após autorização explícita e retornou
sucesso para Audit.SharePoint/General, sem erro de licença. Esta convergência
não executou chamadas de tenant nem alterou subscriptions.

**Correção documental incorporada:** a referência Microsoft de Management
Activity descreve `PublisherIdentifier` como identificação do fornecedor para
quota dedicada; requests sem ele compartilham quota. Incluí-lo em todas as
chamadas pode permanecer regra do projeto, mas não significa rejeição universal
da API quando ausente. API e mapping de auditoria já distinguem a regra do
projeto da exigência externa ao fechar A4/A5. [Referência Microsoft](https://learn.microsoft.com/en-us/office/office-365-management-api/office-365-management-activity-api-reference).

## Relação entre fixture e contratos do backend

`fixtures/tenant-scenarios.json` contém cenários sintéticos organizados para
exercitar as projeções semânticas aprovadas no frontend. Ele ajuda a entender
quais fatos, estados de disponibilidade e variações de tenant as superfícies
precisam apresentar; **não** é payload de resposta do Microsoft Graph nem define
o wire format dos endpoints/controladores do backend.

`onedrive-tenant.generated.ts` é uma projeção gerada para o harness da UI. Não é
modelo de um controller agregado. Adapters/consumidores externos respeitam
os formatos Microsoft de `api.md`/`openapi.yaml`. Controllers locais publicam
contratos semânticos delimitados por aba/bloco após normalização e autorização
tenant-scoped; seus dados podem ter a forma semântica ilustrada no fixture,
sem expor o payload externo bruto. O Discovery não prevê controller que entregue o
tenant inteiro com a estrutura do fixture ou do artefato TypeScript. A
responsabilidade de cada rota/consumidor deve ser delimitada por operação ou
necessidade de dado, sem inferir uma API monolítica do JSON de cenários.

## Próximo passo

Formalizar a implementação dos adapters/coletores, persistência,
importadores, projeções/histórico e endpoints locais delimitados. Materializar
os bindings aceitos C1–C9/R3/R5 na integração; dados atuais desconhecidos
permanecem desconhecidos, com disponibilidade própria por bloco.

Este relatório mede prontidão de Discovery; não atesta backend implantado,
acesso de customer ou publicação factual já disponível em produção.
