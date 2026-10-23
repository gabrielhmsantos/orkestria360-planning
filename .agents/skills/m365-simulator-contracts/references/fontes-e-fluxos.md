# Fontes e fluxos de contrato

## Microsoft Graph: OpenAPI oficial fixado

Use este fluxo para endpoints de `graph.microsoft.com`. O simulador não usa um CSDL baixado de Graph como fonte de contrato.

1. Atualize `sources/graph/metadata-lock.json` somente após revisar uma revisão Git imutável de 40 caracteres e os SHA-256 dos artefatos v1.0/beta do `microsoftgraph/msgraph-metadata`.
2. Execute `npm run contracts:update`. O script baixa para staging, valida cada checksum e só então publica o cache não versionado daquela revisão. Não substitua o cache nem os contratos com downloads manuais.
3. Cadastre a operação no inventário. `path` é a URL emitida pelo aplicativo; `contractPath` é o path exato no OpenAPI. Eles podem divergir para funções Graph, como `getAllSites()` ou relatórios com `period`.
4. Adicione a fixture em `fixtures/graph/v1.0/responses.json` ou `fixtures/graph/beta/responses.json`; relatórios CSV podem usar um `bodyFile` em `fixtures/graph/<versão>/reports/`.
5. Execute `npm run contracts:generate`. O gerador seleciona somente os paths inventariados, conserva componentes alcançáveis e gera `contracts/graph/`, exemplos Microcks e rewrites do Dev Proxy.

Não edite `contracts/graph/`, `contracts/microcks/` ou `dev-proxy/rewrites.json` diretamente.

## Provedor OData com CSDL

Use este fluxo quando a fonte canônica disponível é uma CSDL, como o Microsoft Defender for Endpoint.

1. Primeiro determine o escopo do documento. `GET /api/$metadata` normalmente retorna o modelo de todo o serviço, não de uma coleção. Um sufixo `#Machines` é um fragmento de contexto OData e não é enviado ao servidor como filtro HTTP.
2. Para uma snapshot global, mantenha a fonte bruta no caminho do provedor adotado pelo repositório, por exemplo `sources/defender/metadata.csdl`, e indique no `provenance.json` que seu escopo é `provider-global`. Não renomeie uma CSDL global como se ela descrevesse somente Machines.
3. Para uma fonte efetivamente limitada a um recurso, use um diretório ou nome que identifique esse recurso e registre-o na proveniência. Não duplique uma snapshot global apenas para rotulá-la por endpoint.
4. Obtenha a CSDL apenas por uma conexão autorizada. Se o pedido incluir validação ao vivo ou obtenção da metadata, use `$validate-graph` quando disponível. Atualize o arquivo por meio do script de atualização do provedor e atualize na mesma mudança o SHA-256, data, URL canônica e método de aquisição. Nunca salve a credencial ou a resposta de negócio.
5. Gere um recorte derivado do entity set solicitado e do fecho de tipos que ele referencia. Mantenha recortes em `.cache/derived/<provider>/<endpoint>.csdl` ou em outro caminho explicitamente gerado; eles não substituem a snapshot bruta. Remova navegações fora do inventário somente no recorte derivado.
6. Transforme o recorte com o gerador declarado pelo repositório (Defender usa Microsoft Hidi), decore apenas as normalizações necessárias ao contrato publicado e gere os artefatos derivados. CSDL não descreve necessariamente campos do protocolo OData, como `@odata.context`; acrescente-os somente quando a resposta real os requer.
7. Faça a fixture respeitar os tipos e enums vigentes no CSDL. Ao mudar a CSDL, revise fixtures e schema antes de concluir.

O fluxo atual de Defender está implementado em `scripts/update-defender-csdl.sh`, `scripts/extract-defender-machine-csdl.mjs`, `scripts/generate-contracts.sh` e `scripts/decorate-defender-contract.mjs`.

## Azure Resource Manager: Swagger/OpenAPI oficial pinado

Use este fluxo para endpoints de `management.azure.com`. Não crie um OpenAPI manual como fonte primária e não derive a rota de uma tela: primeiro procure cobertura existente no aplicativo, discovery e inventário do simulador.

1. Registre a assinatura externa completa: host, método, path, `api-version`, demais queries, headers, media type, paginação, schema, erros, permissões e pré-requisitos. Consulte Context7 para a API/SDK aplicável; se não houver documentação oficial suficiente ali, use Microsoft Learn e registre a fonte no pacote de validação.
2. Na página REST da operação no Learn, use o link ou metadado `x-ms-original-file` como pista para localizar a especificação canônica no repositório `Azure/azure-rest-api-specs`. Pesquise por serviço, versão e path. Para subscriptions `2022-12-01`, o upstream é `specification/resources/resource-manager/Microsoft.Resources/subscriptions/stable/2022-12-01/subscriptions.json`.
3. Fixe um commit Git completo e o SHA-256 do arquivo adquirido em `sources/azure/<contractId>/metadata-lock.json`. O lock contém `repository`, `revision`, `upstreamPath`, `sourceUrl` raw imutável, `apiVersion`, `contractId` e checksum. Ele não é atualizado por geração cotidiana: mudar a revisão ou checksum exige atualização explícita e revisão humana.
4. Rode `npm run contracts:update`. `scripts/update-azure-sources.mjs` busca o raw URL imutável do commit, valida o checksum, resolve referências externas no mesmo commit, converte Swagger 2 para OpenAPI 3 e publica somente o cache não versionado em `.cache/upstream/azure/<contractId>/`.
5. Crie ou atualize a operação Azure no inventário, com `host`, `contractId`, `apiVersion` e `api-version=<versão>` em `query`. Para uma rota anterior ao collector, substitua `sourceEvidence` por `validationEvidence` completo; não invente caminho ou linha do aplicativo.
6. Crie a fixture em `fixtures/azure/<contractId>/responses.json`. Mantenha-a sintética e determinística; para listas pagináveis, modele `nextLink` opaco e uma segunda página sem duplicação. Um cenário `restricted` pode testar resposta HTTP de acesso negado, sem simular OAuth ou autorização real.
7. Rode `npm run contracts:generate`. O gerador extrai apenas as operações Azure inventariadas para `contracts/azure/<contractId>/openapi.yaml`, cria exemplos Microcks, atualiza `contracts/services.json` e gera rewrites/`urlsToWatch` do Dev Proxy a partir do host inventariado.

## Office 365 Management Activity API: documentação e schema pinados

Use `sources/office365-management-activity/provenance.json` para fixar a
referência e schema oficiais do repositório `MicrosoftDocs/office-365-management-api`.
`openapi-derived.yaml` é um contrato local derivado e rastreável, não uma
especificação OpenAPI oficial Microsoft. Restrinja o subset a operações exigidas
no Discovery: controle de feed, subscriptions, conteúdo e `contentUri`; não
adicione webhook ou outros workloads por antecipação. O provider é
`office365-management-activity`, host worldwide `manage.office.com`, versão
`v1.0`. Gere o contrato, exemplos, manifesto e rewrites a partir do inventário.

O Simulator nunca copia `decision.md`, `fontes-e-viabilidade.md`, `api.md` ou
`openapi.yaml` para `docs/provider-validation/**`: `validationEvidence` aponta
diretamente aos artefatos autoritativos do Discovery.

## Checklist de entrega

- Há chamada existente no aplicativo com `sourceEvidence` ou necessidade concreta de Discovery com `validationEvidence`; nunca invente uma das duas.
- A fonte canônica, o inventário e a fixture descrevem o mesmo endpoint.
- A fixture é sintética, determinística e compatível com o schema e media type.
- Para Azure, o lock fixa commit, raw URL reconstruível, caminho upstream, versão e SHA-256; o contrato publicado é um subset derivado após bundling e conversão.
- Contratos, exemplos Microcks e rewrites foram regenerados, não editados à mão.
- `npm run inventory`, `npm run validate` e os smokes aplicáveis passaram.
