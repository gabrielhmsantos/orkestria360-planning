---
name: m365-simulator-contracts
description: Opere, valide ou evolua contratos do simulador Microsoft 365 orientado a contrato. Use durante Discovery, planejamento e validação técnica para Graph, Defender, Azure e Office 365 Management Activity API; não use para mudar clientes da aplicação.
---

# M365 Simulator Contracts

O Simulator apoia Discovery, planejamento, validação técnica, desenvolvimento e teste: ele permite consultar contratos, entender payloads e executar requisições sintéticas antes ou depois de existir collector no aplicativo. Não é um ambiente para executar o Orkestria360 inteiro contra um Microsoft 365 fictício.

Evolua-o sem transformar mocks em fonte de verdade. Cada endpoint suportado deve derivar de uma chamada real do aplicativo **ou** de uma decisão explícita de cobertura pré-collector, além de fonte canônica versionada e fixture sintética verificável. Cobertura pré-collector não substitui integração de produção nem inventa `sourceEvidence`.

## Repositório obrigatório

Faça toda a implementação dentro do worktree apontado por `ORKESTRIA_SIMULATOR_PATH`, independentemente do diretório atual da sessão. Isso inclui fontes, inventário, fixtures, scripts, contratos gerados, documentação, comandos de geração, validações e commits do simulador.

`$ORKESTRIA_APP_PATH` é somente a fonte de evidência da chamada de produção: leia-o para confirmar o que o cliente emite e registrar `sourceEvidence`, mas não altere o cliente da aplicação para adequá-lo ao simulador. Também não crie contratos no repositório raiz do workspace.

Não edite manualmente `contracts/graph/`, `contracts/defender/`, `contracts/azure/`, `contracts/microcks/`, `contracts/services.json`, `dev-proxy/rewrites.json` ou `dev-proxy/devproxyrc.json`: esses artefatos pertencem aos geradores.

## Caminhos no workspace sem submódulos

Esta skill é uma cópia local, não um checkout do Simulator. Resolva `ORKESTRIA_SIMULATOR_PATH` e `ORKESTRIA_APP_PATH` pelos worktrees autorizados em [REPOSITORIOS.md](../../../docs/REPOSITORIOS.md). Execute comandos somente após entrar no worktree do Simulator. Para `npm run inventory`, o checker existente aceita `APP_ROOT` (caminho da aplicação) e `WORKSPACE_ROOT` (raiz autorizada que contém os repositórios e o Discovery). Passe esses valores explicitamente no ambiente da execução.

`validationEvidence` é relativo ao worktree do Simulator e deve resolver até os artefatos deste Planning, sem cópia intermediária. Valide os caminhos, as revisões e a evidência do inventário no contexto da entrega. Se não houver raiz autorizada comum ou os paths/evidências não resolverem, registre o bloqueio e não amplie permissões nem contorne o guard.

## Preparação

1. Entre no worktree apontado por `ORKESTRIA_SIMULATOR_PATH`, preserve alterações existentes fora do pedido e leia `README.md` e `docs/contract-updates.md`.
2. Se o pedido é usar, integrar ou testar o simulador, leia [uso do simulador](references/uso-do-simulador.md). Ele explica Microcks direto, cenários, Dev Proxy, certificados e diagnóstico.
3. Antes de implementar qualquer endpoint, execute a [pré-validação de cobertura](references/uso-do-simulador.md#pré-validar-cobertura-antes-de-implementar). Não crie uma rota porque ela não está evidente na tela ou porque a URL parece nova.
4. Inspecione a chamada correspondente em `$ORKESTRIA_APP_PATH`: host, versão, método, path, query, headers, conteúdo, paginação, consumidor e linhas de código. Se ainda não houver collector, exija uma necessidade concreta de Discovery e os artefatos de validação do `$validate-graph`; não crie linha ou caminho de código fictício. Sem chamada real **nem** decisão/documentação de superfície futura, pare e peça direcionamento.
5. Para sintaxe, disponibilidade, permissões ou comportamento do serviço, consulte a documentação oficial atual via Context7. Não invente um endpoint para completar uma tela, métrica ou fixture.
6. Leia [fontes e fluxos](references/fontes-e-fluxos.md) e escolha a fonte canônica. Para Office 365 Management Activity API, use a snapshot documental/schema pinada e o OpenAPI local derivado, claramente identificado como derivado; `manage.office.com` não é Graph.
7. Leia [inventário e validação](references/inventario-e-validacao.md) antes de alterar `operations.json`, fixtures ou smoke tests.

## Decidir entre usar ou implementar

Trate uma operação como já coberta quando a combinação de `provider`, `host`, `apiVersion`, `method`, `path`, queries, headers, media type e comportamento requerido já estiver coberta no inventário, contrato e fixture. Nesse caso, não crie outra entrada: em Discovery, inspecione diretamente o Microcks; para reproduzir a URL Microsoft, use o Dev Proxy. Execute os gates aplicáveis.

O mesmo path pode aparecer em mais de uma entrada, pois consumidores diferentes podem emitir queries ou headers distintos. Não considere isso duplicidade automaticamente. Compare a forma completa da request e a resposta que o consumidor espera. Só crie uma operação nova quando a chamada real representar uma forma ainda não permitida ou uma resposta materialmente distinta; se a diferença for apenas uma query adicional já aceita, atualize a entrada que a representa em vez de duplicá-la.

## Contrato do endpoint

O inventário é o arquivo `contracts/inventory/operations.json`, especialmente o array `operations`. Ele é a matriz auditável que conecta cada chamada do aplicativo — ou uma decisão pré-collector verificável — ao contrato, fixture, consumidor e evidência. `npm run inventory` compara as chamadas existentes ao `$ORKESTRIA_APP_PATH` e verifica evidências de validação; a geração usa-o para selecionar contratos, produzir exemplos Microcks, manifesto de importação e rewrites do Dev Proxy; `npm run validate` exige cobertura de contrato e fixture.

Registre uma operação com `id`, `provider`, `apiVersion`, `method`, `path`, `contractPath` quando diferir, `query`, `headers`, `mediaType`, `consumer`, `fixture` e `status`. Inclua `sourceEvidence` para chamada já emitida pelo aplicativo. Para cobertura pré-collector, omita esse campo e informe `validationEvidence` com `implementationDecision`, `viability`, `api` e `openapi` autoritativos do Discovery; `..` é permitido somente se o destino permanecer no workspace autorizado. Azure também exige `host`, `contractId` e o `api-version` obrigatório. Management Activity exige `host: manage.office.com`, `apiVersion: v1.0` e `operationKind: data-read|provider-feed-control`.

`SUPPORTED` significa que o Simulator representa e serve a operação. Não prova collector, código de produção, feature entregue, licença ou acesso de tenant. `consumer` pode ser uma classe existente, mas para pré-collector pode ser o fluxo, módulo, feature ou responsabilidade funcional planejada.

`path`, query e headers descrevem a `externalRequest`: a chamada Microsoft real e a única forma que pode aparecer em `api.md`, OpenAPI, specs e código de produção. Use `mockPath` somente quando uma limitação conhecida de matching do Microcks exigir uma `mockRequest` interna diferente, sem mudar a `externalRequest`. `mockPath` é detalhe de runtime do Simulator. Se a chamada real não puder ser suportada, registre `INTENTIONALLY_UNSUPPORTED` com um motivo revisável; não crie um fallback silencioso.

Crie uma fixture determinística e sem dados de tenant. Ela é um exemplo executável, não o schema completo: reflita o media type e a estrutura do cenário anunciado, mas consulte OpenAPI, metadata e Learn para todos os campos possíveis. Reflita envelope OData `value` para coleções JSON, `@odata.nextLink` quando a paginação fizer parte do fluxo e corpo CSV para endpoints de relatório. Cubra apenas cenários que o consumidor usa ou trata, sempre com `default` válido; um subconjunto local não restringe o comportamento permitido pela Microsoft.

## Geração e verificação

Depois das fontes, inventário e fixtures estarem coerentes, gere os artefatos no repositório do simulator:

```bash
npm run contracts:generate
npm run inventory
npm run validate
```

Quando a entrega precisar ser exercida contra a composição local, execute `npm run up` e `npm run smoke`; ajuste o smoke somente quando a nova superfície introduzir um comportamento do próprio Simulator ainda sem cobertura: serviço importado, operação acessível, status, media type, payload, cenário ou paginação. Não use smoke para testar banco, collectors, synchronizers ou persistência do Orkestria360. Use `npm run smoke:proxy` apenas para validar a integração opcional pelo Dev Proxy já configurado e com CA confiável. Para Azure, confirme também a URL canônica `https://<host>/<path>?api-version=<versão>` pelo proxy, nunca uma base Microcks deduzida.

Revise os diffs, incluindo contratos e exemplos gerados. Pare e corrija a causa se a fonte canônica, inventário, fixture, schema, Microcks ou smoke divergirem; não contorne gates apagando validações ou relaxando contratos. A sequência completa, inclusive quando usar `contracts:update`, está em [fontes e fluxos](references/fontes-e-fluxos.md).

## Segurança e procedência

Não versione tokens, credenciais, identificadores de tenant, respostas reais ou cache remoto. A obtenção de metadata autenticada ocorre somente por canal autorizado e fora do runtime cotidiano do simulador. Registre checksum, data, URL canônica e escopo da snapshot; a geração e os testes locais devem operar a partir dos artefatos versionados.

## Handoff obrigatório do `$validate-graph`

Toda rota `data-read` ou `provider-feed-control` de provider suportado validada pelo `$validate-graph` deve acionar esta skill na **mesma tarefa**. O handoff entrega assinatura HTTP externa, fonte oficial pinada, consumidor, cenários e `validationEvidence` para os quatro artefatos autoritativos do Discovery. Nunca materialize `docs/provider-validation/**`; a coleta técnica limitada nunca fornece payload real ao simulador.

Antes de cadastrar algo, execute a pré-validação do inventário. Se uma operação equivalente já estiver `SUPPORTED` pela assinatura completa e pelo comportamento necessário, reutilize-a: não duplique contrato, fixture ou rewrite. Se a chamada vier antes do collector, ela pode entrar como `SUPPORTED` somente quando o contrato canônico, a fixture e a evidência de validação forem completos. O guard atual detecta deriva de paths e templates conhecidos no aplicativo; a extração automática completa de todas as queries e headers do cliente ainda não existe. Preserve essa limitação e compare a assinatura manualmente no handoff.
