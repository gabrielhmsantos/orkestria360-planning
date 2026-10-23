# Inventário e validação

## O que é o inventário

`contracts/inventory/operations.json` é o registro canônico das operações que o simulador declara suportar. Seu array `operations` não é uma lista de desejos nem um catálogo das APIs Microsoft: cada item representa uma chamada de leitura que o `APP_ROOT` (worktree explícito de Application) realmente emite **ou** uma necessidade concreta de Discovery pré-collector, com contrato e decisão verificáveis.

Ele é consumido por quatro verificações:

1. `scripts/check-inventory.mjs` confronta chamadas e templates conhecidos do aplicativo com as entradas e as linhas de `sourceEvidence`, ou valida `validationEvidence` pré-collector dentro do workspace.
2. Os geradores de subset selecionam somente paths inventariados: `scripts/generate-graph-subsets.mjs` para Graph e `scripts/generate-azure-subsets.mjs` para Azure; Defender deriva o recorte CSDL declarado.
3. `scripts/generate-microcks-examples.mjs` e `scripts/generate-dev-proxy-rewrites.mjs` constroem artefatos secundários a partir de inventário e fixtures.
4. `scripts/validate.mjs` exige contrato, fixture, cenário `default`, status, media type, schema e cobertura coerentes para cada operação `SUPPORTED`.

## Campos de uma operação

| Campo | Regra |
| --- | --- |
| `id` | Identificador estável, único e semântico, por exemplo `graph.v1.users.delta` ou `defender.machines`. |
| `provider` | `graph`, `defender`, `azure` ou `office365-management-activity`; este último usa `manage.office.com` e nunca `graph`. |
| `apiVersion` | `v1.0` ou `beta` para Graph; `null` quando o provedor não usa versão de API na URL; para Azure, a versão exigida por `api-version`. |
| `host` | Obrigatório para Azure: hostname externo sem protocolo ou path, por exemplo `management.azure.com`. Graph e Defender usam hosts implícitos do catálogo. |
| `contractId` | Obrigatório para Azure: identificador estável do pacote fonte, usado sob `sources/azure/`, `contracts/azure/` e `fixtures/azure/`. |
| `method` | Verbo HTTP da `externalRequest` canônica. O Simulator não restringe verbos por provider: inventário, fonte canônica, fixture e contrato precisam cobrir a operação. Restrições de execução real pertencem ao Discovery e ao futuro collector. |
| `path` | Path da `externalRequest` Microsoft, sem host e preservando parâmetros de rota. É a forma usada pela aplicação, `api.md`, OpenAPI e specs. |
| `contractPath` | Path da fonte OpenAPI/CSDL transformada. É obrigatório quando a forma canônica diverge de `path`, como funções Graph com `()`. |
| `mockPath` | Opcional. Path da `mockRequest`, usado apenas no runtime do Simulator para contornar limitação documentada do Microcks, como funções de relatório parametrizadas. Nunca muda `path` nem faz parte do contrato Microsoft. |
| `query` | Conjunto/padrão de queries aceito pelo cliente. Registre valores reais; não libere `$select`, filtros ou períodos genéricos sem evidência. |
| `headers` | Cabeçalhos de request exigidos, por exemplo `ConsistencyLevel: eventual` ou `Accept: text/csv`. |
| `mediaType` | Conteúdo da resposta, normalmente `application/json` ou `text/csv`. |
| `consumer` | Classe, coletor, fluxo, módulo, feature ou responsabilidade funcional que consome ou consumirá a chamada. Em pré-collector, use o nome do fluxo planejado; não invente classe futura. |
| `sourceEvidence` | Caminho relativo a `APP_ROOT` (worktree explícito de Application) e linha(s) que provam a chamada. Atualize se o código for movido. Opcional somente para cobertura pré-collector. |
| `validationEvidence` | Obrigatória quando `sourceEvidence` não existe: objeto com `implementationDecision`, `viability`, `api` e `openapi`. Os paths são relativos ao repositório do Simulator; podem usar `..` somente se, depois de resolvidos, permanecerem dentro do workspace autorizado. Decisão e viabilidade apontam para âncora Markdown existente. |
| `fixture` | Chave da fixture em `fixtures/<provider>/.../responses.json`; deve existir e ser usada pela operação. |
| `status` | `SUPPORTED` quando o Simulator consegue representar e servir contrato e fixture completos, com ou sem collector/produção/licença/acesso de tenant. `INTENTIONALLY_UNSUPPORTED` somente com motivo revisável e sem fallback enganoso. |

## Handoff e procedência

`validationEvidence` referencia diretamente os quatro artefatos autoritativos do Discovery. Não crie nem aceite cópias em `docs/provider-validation/**`; o guard falha se esse diretório contiver artefatos. Fontes pinadas e fixtures externas pertencem ao Simulator, mas decisões, viabilidade, `api.md` e `openapi.yaml` continuam no Discovery.

## Sequência para uma operação suportada

1. Normalize a `externalRequest` completa e consulte o inventário antes de criar qualquer artefato. Compare provider, host, apiVersion, método, path, query, headers, media type e comportamento. Reutilize uma operação equivalente; amplie a existente se a nova necessidade couber nela; crie entrada somente diante de diferença material. Para uma superfície pré-collector, use a assinatura e os quatro artefatos emitidos pelo `$validate-graph`, sem fabricar `sourceEvidence`. Confirme na documentação oficial os detalhes que não são visíveis no código, como paginação, OData e media type.
2. Atualize a fonte canônica conforme o tipo de provedor. Para Graph, isto pode exigir mudar o lock revisado e rodar `npm run contracts:update`; para CSDL, atualize a snapshot e a proveniência por mecanismo autorizado; para Azure, use o lock imutável, bundle Swagger 2 → OpenAPI 3 e o subset do Azure REST API Specs.
3. Adicione ou altere a operação no array `operations`. Use uma fixture existente apenas se status, cabeçalhos, media type e schema forem realmente compatíveis; caso contrário, crie uma chave própria.
4. Crie a fixture sintética como exemplo executável. Para JSON, alinhe campos, enums, envelopes OData e paginação ao cenário anunciado; para CSV, preserve cabeçalho, colunas e quebras de linha que o consumidor interpreta. Não use respostas exportadas de tenant e não trate a ausência de campo, período, filtro ou cenário local como limitação da API Microsoft.
5. Execute `npm run contracts:generate`. Ele altera os contratos derivados, exemplos Microcks e rewrites necessários; não tente reproduzir essas mudanças manualmente.
6. Execute, nesta ordem, `npm run inventory` e `npm run validate`. Se a composição local estiver em escopo, rode `npm run up` antes de `npm run smoke`.
7. Se houver novo comportamento significativo de rota, paginação, conteúdo CSV ou status que o smoke ainda não observa, acrescente uma asserção pontual em `scripts/smoke.mjs` e valide novamente.

## Interpretação dos erros

- Erro de inventário: a chamada real, sua evidência, `validationEvidence` ou o padrão de query diverge do registro. Corrija a representação, não silencie o guard.
- Erro de geração Graph: a revisão/cache/checksum não está consistente com `metadata-lock.json`; execute a atualização autorizada e reveja o lock.
- Erro de schema/fixture: alinhe a fixture com a fonte e o contrato gerado, sem ampliar arbitrariamente o schema.
- Erro de Microcks ou rewrite: examine `mockPath`, media type, headers e URL externa. O Dev Proxy deve preservar a URL que o cliente emite.
- Erro de smoke: garanta que `npm run up` importou os artefatos mais recentes e que a asserção representa o comportamento contratado.
