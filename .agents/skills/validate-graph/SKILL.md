---
name: validate-graph
description: Valida APIs Microsoft externas necessárias ao Discovery do Orkestria 360 — inclusive Graph, Defender, Azure e Office 365 Management Activity API — sem redefinir o contrato semântico da superfície.
---

# Validate Graph

Apesar do nome legado, valide fontes e contratos de APIs Microsoft externas por
documentação oficial, fonte canônica e coleta técnica limitada quando ela for
possível. Não faça censo, inventário ou validação operacional de customers;
uma conexão local pode fornecer evidência técnica, mas não define a
disponibilidade global do endpoint. Não implemente integração de produção,
operação de escrita de domínio, comando público ou agendamento. Uma operação `provider-feed-control` estritamente necessária para habilitar leitura de feed deve ser classificada separadamente de `data-read`, mas a coleta técnica temporária permanece estritamente `GET`.

## Caminhos e ambiente no Planning

Leia [o mapa dos repositórios](../../../docs/REPOSITORIOS.md). O Planning não contém a aplicação. Antes de uma coleta, defina `ORKESTRIA_APP_PATH` com o caminho absoluto do worktree de Application autorizado para a execução; o helper falha se ele não for informado e não procura um repositório vizinho. Esse worktree deve usar seu banco snapshot `orkestria360`, preservando a chave de criptografia e a conexão Microsoft; o banco vazio `orkestria360_test` é reservado à suíte. Não copie credenciais para este repositório. O helper pode renovar token em memória/configuração conforme a aplicação; uma coleta externa real exige que o contexto da tarefa autorize esse acesso.

## Referências do skill

- Leia [references/sync-coordenado.md](references/sync-coordenado.md) antes de decidir se uma superfície consome uma projeção local, estende uma fonte canônica ou justifica nova leitura. Ele explica o modelo operacional e o que reutilizar; não é um retrato imutável dos arquivos atuais.
- Leia [references/coleta-tecnica-temporaria.md](references/coleta-tecnica-temporaria.md) antes de validar endpoint sem evidência equivalente ou quando query, permissão, versão ou licença diferir materialmente.
- Leia [references/artefatos-de-discovery.md](references/artefatos-de-discovery.md) antes de criar ou atualizar `fontes-e-viabilidade.md`, `api.md` e `openapi.yaml`.
- Para modelar um `openapi.yaml` completo, use [examples/openapi-get-odata-completo.yaml](examples/openapi-get-odata-completo.yaml) como referência de estrutura; adapte os recursos e campos ao contrato efetivamente documentado e validado.

## 1. Descobrir e decidir antes da coleta

1. Leia os `AGENTS.md` aplicáveis, o discovery alvo e seus artefatos existentes.
2. Pesquise endpoints já evidenciados apenas em `discovery/**/api.md` e `discovery/**/openapi.yaml`, usando o path normalizado. Pesquise também a implementação e projeções existentes para identificar o fato canônico.
3. Identifique o provider antes de validar: `graph` usa metadata/OpenAPI Graph; `defender` a fonte oficial aplicável; `azure` Azure REST API Specs; `office365-management-activity` Microsoft Learn e `MicrosoftDocs/office-365-management-api` pinado. Não aplique regras Graph a outro provider. Para Management Activity API worldwide, use `manage.office.com`, versão `v1.0`; o OpenAPI produzido é derivado localmente da documentação e schema oficiais pinados, nunca OpenAPI oficial Microsoft.
4. Leia `contratos.md` como o contrato semântico que a fonte deve satisfazer. Classifique cada fato da superfície como `projeção local`, extensão de fonte canônica, leitura complementar ou nova coleta justificada e registre a justificativa em `fontes-e-viabilidade.md` antes de propor chamada Graph adicional.
5. Não confunda ausência de conector ou coletor de produção com impedimento técnico. Se não houver evidência equivalente, execute a coleta técnica temporária obrigatória; só registre pendência se a execução for realmente bloqueada e documente a evidência do bloqueio. Falta de licença, permission ou consentimento em uma conexão é condição de acesso, não bloqueio global da fonte.

## 2. Validar a API externa

Para cada endpoint, registre método, host/path, versão, query, headers relevantes, status, `Content-Type`, envelope, campos, nulabilidade, paginação e PII. Nunca replique valores pessoais, tokens, IDs de tenant/conexão, URLs pré-autenticadas ou payload bruto. Para Management Activity API, documente o fluxo necessário — controle de feed, listagem de conteúdo e recuperação de `contentUri` — incluindo `contentType`, janela temporal, `NextPageUri` opaco, expiração e ordering não garantido; a coleta técnica executa somente leitores `GET`, como `subscriptions/list`. Webhook fica fora do fluxo salvo requisito explícito.

- Em `200` com `value: []`, repita sem filtros ou seleção restritiva não obrigatória. Registre `filtered_no_match` quando a variante ampla retornar itens; registre `empty_valid_response` somente quando ambas forem OData válidas e vazias.
- Classifique `401`, `403`, `404`, `429` e erros dos providers suportados como condição ou erro da tentativa, nunca como zero. Evidência explícita de licença, inclusive `400 AadPremiumLicenseRequired`, documenta um pré-requisito de consumo; não torna o endpoint globalmente `restricted`.
- A coleta temporária pode executar o mesmo `GET` nas até duas conexões customer selecionadas pela base para ampliar a evidência técnica, inclusive após `200`, `401`, `403`, `404`, `429`, condição de licença ou erro de contrato. Não execute a segunda tentativa quando a primeira resposta HTTP for `5xx`. Não derive dessa amostra disponibilidade, cobertura ou acesso de customers e não registre suas identidades.
- Para CSV/XLSX, siga redirect em ambiente protegido, registre somente colunas/PII e não envie `Authorization` ao host pré-autenticado de `Location`.
- Trate `@odata.nextLink` e `@odata.deltaLink` como URLs opacas. Em `410`/`syncStateNotFound`, documente reset, replay e sincronização completa idempotente.
- Aplique a regra de `signInActivity` apenas ao criar ou mudar coleta de `/users` ou `/users/delta`; consulte a referência de sync para a exceção completa.

## 3. Documentar os artefatos

Atualize em conjunto `fontes-e-viabilidade.md`, `api.md` e `openapi.yaml` para cada subpágina atingida. Use a referência de artefatos para manter as responsabilidades separadas:

- `contratos.md` permanece o contrato semântico compartilhado; ele é entrada para esta validação, não plano de sync.
- `fontes-e-viabilidade.md` documenta o mapeamento contrato → estratégia/fonte, viabilidade, limitações, normalização e incompatibilidades.
- `api.md` prova o contrato externo e sua evidência.
- `openapi.yaml` formaliza somente o shape HTTP externo, com schemas completos de request e response.

Não transforme documentação de Graph em plano de UI, comando, agendamento ou implementação de produção. Atualize `contratos.md` somente se evidência suficiente revelar que sua semântica está incorreta ou incompleta e a mudança estiver autorizada; o shape do provider por si só não autoriza essa alteração.

Para **toda** rota `data-read` ou `provider-feed-control` de provider suportado que foi validada — com
ou sem collector existente — invoque `$m365-simulator-contracts` na mesma
tarefa, depois de gravar os artefatos. O handoff é obrigatório para avaliar a
cobertura sintética e deve terminar em reutilização ou incorporação da operação;
não use-o para popular endpoints especulativos ou adjacentes.

Entregue somente o contrato Microsoft externo: `provider`, `host` quando
aplicável, `apiVersion`, método HTTP, path externo, query, headers e media
type; fonte oficial, commit/revisão quando aplicável; consumidor real ou
planejado; e comportamentos/cenários relevantes. Inclua a decisão relacionada
à implementação, `fontes-e-viabilidade.md`, `api.md` e `openapi.yaml`. O
handoff é global e não contém customer, conexão, token, tenant, IDs reais,
estado operacional ou payload real.

Não entregue URL Microcks, `mockPath`, nome de serviço, dispatcher, APIExamples,
rewrite, fixture interna ou rota do Dev Proxy. Esses detalhes pertencem ao
Simulator. `api.md` e `openapi.yaml` continuam representando exclusivamente a
request Microsoft externa; uma fixture sintética é exemplo executável, não
substitui a documentação oficial, metadata ou schema completo.

Os artefatos do Discovery e a fonte Microsoft permanecem autoritativos. O
Simulator não materializa snapshots em `docs/provider-validation/**`: seu
`validationEvidence` referencia diretamente `decision.md`/`decisoes.md`,
`fontes-e-viabilidade.md`, `api.md` e `openapi.yaml` autoritativos, por paths
externos dentro do workspace autorizado.

Antes de criar cobertura, a skill do simulador compara assinatura e
comportamento com operações `SUPPORTED` existentes e decide reutilizar, ampliar
ou criar entrada materialmente distinta. Ausência de collector não impede
`SUPPORTED`: nesse caso não crie `sourceEvidence`; use `validationEvidence`
verificável e um `consumer` que pode ser fluxo, módulo ou feature planejada.
Depois do handoff, o Discovery pode exercitar a cobertura sintética para
inspecionar payload, parser, paginação, CSV e erros, sem concluir que a fixture
limita o comportamento documentado pela Microsoft.

## 4. Verificar

1. Valide YAML alterado e execute `git diff --check`.
2. Confirme que cada resposta `200` possui `content.application/json.schema` (ou schema de stream/arquivo), envelope e recurso tipados; descrições como `Entidade JSON` ou `Coleção OData` sem schema são inválidas.
3. Confirme que os erros externos relevantes referenciam schema padronizado de erro do provider e que paginação, links OData, nulabilidade e campos sensíveis estão modelados quando aplicáveis.
4. Confirme que toda rota sem evidência equivalente teve coleta temporária executada ou bloqueio técnico comprovado.
5. Confirme que `fontes-e-viabilidade.md` distingue contrato externo documentado, projeção local, extensão canônica, leitura complementar, nova coleta justificada, cobertura sintética do simulador e bloqueio técnico quando aplicáveis, sem estado, cobertura ou dados de customer.
6. Quando a decisão exigir mudança de conector/coletor, exija testes proporcionais de estratégia, paginação, retry, reset, deduplicação, falha de fonte e ausência de leitura redundante.
7. Confirme que cada rota validada teve o handoff ao `$m365-simulator-contracts` concluído ou reutilizado, sem duplicar cobertura existente.
8. Reporte separadamente contrato documentado, observações técnicas limitadas, respostas vazias, condições de acesso, bloqueios técnicos reais, decisão de integração, handoffs ao simulador e pendências.
