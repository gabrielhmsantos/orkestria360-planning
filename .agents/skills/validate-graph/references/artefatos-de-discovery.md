# Artefatos de discovery para APIs Microsoft externas

## `contratos.md`: contrato semântico compartilhado

Leia o contrato como a necessidade da aplicação, independente do provider. Ele
pode declarar propriedades, tipos, nulabilidade, unidades, cálculos,
cardinalidade, relações, availability, coverage, freshness, estados, filtros,
ordenação, paginação e resultados observáveis.

Não grave neste arquivo endpoint, permission, versão da API, collector, job,
sync, tabela, migration ou persistência física. Atualize-o somente se a
validação trouxer evidência suficiente de erro ou lacuna semântica e houver
autorização para alterar o comportamento de produto; normalize o provider no
backend quando isso preservar o contrato.

## `fontes-e-viabilidade.md`: consumo e viabilidade

Crie ou atualize o artefato por superfície para mapear cada fato exigido por
`contratos.md` a:

- estratégia (`projeção local`, `extensão canônica`, `leitura complementar`,
  `nova coleta justificada` ou ausência em escopo);
- fonte canônica e consumidores locais;
- evidência de contrato externo, permission, licença, audience, consentimento,
  versão, paginação, retry e freshness como pré-requisitos abstratos;
- limitações, bloqueio técnico, normalização e a estratégia futura de
  publicação, sem estados operacionais de customer;
- normalização que preserva o contrato ou incompatibilidade que exige decisão
  de produto.

Não registre `tenant_id`, conexão, cobertura, disponibilidade ou resultado de
acesso neste artefato. Esses fatos pertencem ao collector e à publicação de
produção. Uma tentativa local só pode documentar condições abstratas de acesso.

## `api.md`: contrato externo e evidência

Documente apenas o provider externo validado. Identifique `provider`, host e
versão antes de aplicar suas regras; `office365-management-activity` usa
`manage.office.com` worldwide e não é Graph.

- método, host/path, audience, versão, query, headers, permissões, licença,
  status e `Content-Type`;
- envelope OData, schemas, tipos, nulabilidade, paginação, redirects, PII e
  respostas de erro/restrição;
- vazio válido, filtro sem correspondências, throttling e reset quando
  aplicáveis.

Quando necessário, acrescente uma nota curta de consumo factual, com referência
a `fontes-e-viabilidade.md`; não replique estratégia de sync, staging,
persistência ou contrato de UI. Tentativas locais podem registrar somente o
status e a condição técnica sanitizada, sem identificar customer ou transformar
o resultado em cobertura global.

Não documente componentes, telas, comandos, transações, staging ou geração
publicada.

## `openapi.yaml`: shape HTTP externo

Modele request sem corpo para `GET` quando aplicável, respostas `200`, `302`,
`400`, `401`, `403`, `404`, `410` e `429` quando relevantes, envelopes e
schemas da API externa. Para relatórios, modele stream/arquivo. Não exponha
segredo, URL pré-autenticada, PII real, ID interno ou decisão de seleção de
conexão.

### Schemas obrigatórios

- Toda resposta de sucesso deve declarar `content` e um `schema` concreto.
  `description: Entidade JSON`, `description: Coleção OData` ou equivalente
  nunca substitui o schema.
- Para coleções Graph, modele o envelope com `@odata.context`, `value` tipado e
  `@odata.nextLink` como `string`/`uri` quando a rota puder paginar. Modele
  `@odata.deltaLink` quando a rota suportar delta.
- Modele o recurso de `value[]` ou a entidade diretamente retornada com
  propriedades, tipos, formatos (`date-time`, `uri`, etc.), arrays e objetos
  aninhados conhecidos. Use a coleta técnica para campos observados e a
  documentação oficial para campos não retornados na fotografia.
- Declare nulabilidade somente quando observada ou documentada. Não invente
  campos; para recurso polimórfico, use `oneOf`/`allOf` ou
  `additionalProperties` delimitado, com a razão no `api.md`.
- Reutilize componentes locais do arquivo para envelopes, links e o erro
  externo. Para Graph, inclua `GraphError` com `error.code`, `error.message` e
  `innerError` quando aplicável, além de um `responses/GraphError` referenciado
  pelos status de erro.
- Quando o contrato público fornecer um shape mas a conexão não devolveu `200`,
  o schema ainda deve representar o contrato externo e receber
  `x-observed: false`; registre em `api.md` o status realmente observado. Não
  trate resposta de erro como schema de sucesso nem como coleção vazia.
- Uma subpágina sem rota externa deve declarar `paths: {}`. Não crie schemas
  fictícios para dados exclusivamente locais.

Consulte [../examples/openapi-get-odata-completo.yaml](../examples/openapi-get-odata-completo.yaml) para uma referência completa e adaptável.

## Resultado obrigatório por rota/fato

Escolha um e deixe-o explícito em `fontes-e-viabilidade.md`, associado ao fato
de `contratos.md` que ele pode ou não satisfazer:

| Resultado | Significado |
| --- | --- |
| `contrato externo documentado` | endpoint, shape e pré-requisitos confirmados pela documentação oficial e fonte canônica; uma coleta local pode complementar a evidência, sem medir customers. |
| `projeção local` | a superfície consome fato já publicado, sem nova chamada Graph. |
| `extensão canônica` | a coleta existente deve ampliar campos sem mudar suas propriedades operacionais. |
| `leitura complementar` | campos exclusivos exigem correlação sem repetir o superset já publicado. |
| `nova coleta justificada` | fonte distinta exige integração futura, com motivo e estratégia documentados. |
| `cobertura sintética do simulador` | fixture e cenários `SUPPORTED` serão exercitados no simulador para desenvolvimento/teste; não provam dados ou acesso de customer. |
| `bloqueio técnico de validação` | coleta temporária foi tentada, mas impedimento real foi evidenciado; não conclui inviabilidade do endpoint. |

## Handoff ao simulador

Depois de documentar uma rota `data-read` ou `provider-feed-control` de provider suportado, entregue-a
na mesma tarefa ao `$m365-simulator-contracts`. O handoff contém somente a
assinatura Microsoft externa: `provider`, `host` quando aplicável,
`apiVersion`, método HTTP, path, query, headers e media type. Entregue também
fonte canônica pinada, commit/revisão quando aplicável, consumidor real ou
planejado, cenários, decisão de implementação, esta viabilidade, `api.md` e
`openapi.yaml`. Esses artefatos comprovam uma cobertura pré-collector sem
alegar que a aplicação já emite a chamada.

O handoff nunca contém URL Microcks, `mockPath`, serviço, dispatcher,
APIExamples, rewrite, fixture interna, token, customer, tenant, conexão, ID
real ou resposta bruta. `api.md` e `openapi.yaml` são o contrato Microsoft;
fixtures do Simulator são exemplos sintéticos para experimentar respostas e não
limitam os valores, filtros, páginas, CSV, redirects ou erros permitidos pela
documentação Microsoft.

O Discovery, Microsoft Learn e a metadata oficial continuam sendo as fontes
autoritativas. O Simulator não cria snapshots em `docs/provider-validation/**`:
`validationEvidence` referencia diretamente os quatro artefatos do Discovery.
Os paths são relativos ao Simulator e podem usar `..` somente quando continuarem
dentro do workspace autorizado.

Antes de registrar cobertura, o Simulator procura assinatura e comportamento
equivalentes para reutilizar ou ampliar a operação existente; só cria entrada
quando a diferença for material. Sem collector, não fabrique `sourceEvidence`:
use `validationEvidence` e um `consumer` que pode ser fluxo, módulo ou feature
planejada. Após a cobertura existir, o próprio Discovery pode usar o Simulator
para inspecionar payloads sintéticos, testar parser, paginação, CSV e cenários
de erro antes da implementação de produção.

Para Azure, registre também host, `api-version`, paginação, schema, erros e
pré-requisitos. A página REST do Learn e seu `x-ms-original-file` orientam a
busca no Azure REST API Specs; o simulador fixa commit e SHA-256 da fonte antes
de gerar o subset OpenAPI. A coleta técnica autenticada, quando existir,
continua sanitizada e não fornece resposta real ao mock.
