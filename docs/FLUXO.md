# Planejamento para o fluxo GasCity

Este documento define o uso dos artefatos do rig Planning. A City coordena a execução das fórmulas e dos agentes; este repositório fornece o planejamento, os contratos e as evidências. A integração identifica os produtos por repositório e SHA.

## Materiais de entrada e branch recebida

O usuário fornece imagens, Markdown, DOCX e demais referências em `inputs/<delivery>/`, já versionados na branch entregue ao Planning. A organização dos arquivos dentro da pasta é livre; `briefing.md` é opcional e pode indicar objetivo, resultado esperado e prioridade entre referências. Veja [inputs/README.md](../inputs/README.md).

O intake identifica `input_branch`, `input_path` e `source_context_commit`, o SHA da branch recebida antes de produzir resultados. Registra em `source_files` os paths relativos e hashes das fontes consumidas. O rig começa nesse commit e preserva esse contexto ao avançar com commits de planejamento; não troca pela branch padrão nem exige merge prévio dos materiais. A base do PR e as branches dos produtos são entradas separadas.

Materiais fornecidos pelo usuário permanecem em `inputs/`; discovery, decisões, requisitos e planos são produzidos nas pastas de saída correspondentes. Cada conclusão relevante referencia as fontes efetivamente lidas, com path e commit. Se uma fonte estiver ausente, ilegível ou em conflito material sem prioridade definida, registre a lacuna para a clarificação; não invente seu conteúdo. Material novo após a fixação do contexto exige intake/revisão identificados.

Quando a fórmula exigir `context_path`, o adapter gera o bundle YAML/JSON esperado, referenciando os materiais e seus hashes. `inputs/<delivery>/` é o diretório das fontes, não esse bundle nem um substituto de `artifact_root`.

## Destino dos artefatos

Novos planejamentos do rig Planning usam `plans/<delivery>/r<revision>/`, relativo à raiz deste repositório. A City fornece esse diretório como `artifact_root` e informa `requirements_path` e `plan_path` na entrada da fórmula. Não há um destino universal escolhido automaticamente pelo GasCity; o workflow resolve os caminhos.

| Entrada do workflow | Convenção deste Planning |
| --- | --- |
| `artifact_root` | `plans/<delivery>/r<revision>/` |
| `requirements_path` | `<artifact_root>/requirements.md` |
| `plan_path` | `<artifact_root>/implementation-plan.md` |

O contrato `build-base` deriva esses nomes quando os paths opcionais estão vazios e registra os paths canônicos em `gc.build.requirements_path` e `gc.build.plan_path`. Para a fórmula de planejamento, forneça os dois paths explicitamente e respeite os paths registrados pelo workflow. Decomposição, revisões e relatórios ficam sob a mesma raiz quando exigidos pela fórmula, com nomes e schemas próprios do pack.

Os artefatos nativos são Markdown com YAML front matter e precisam passar pelos validadores do pack. Os templates deste repositório auxiliam a redação das seções; não substituem os schemas, os campos de rastreabilidade ou os gates.

`specs/` é acervo histórico para consulta. Não recebe novos planos, novas features ou reexecução dos procedimentos que descreve. Um contrato histórico pode ser selecionado explicitamente como entrada, sem promover comandos ou checkboxes históricos a instruções de execução.

Manifestos de composição e evidências aceitas ficam em `deliveries/<delivery>/r<revision>/`. Eles referenciam os artefatos de `plans/` e seus SHAs. Contexto de produto permanece em `discovery/` e aprendizados em `docs/solutions/`.

Essa convenção deve ser aplicada na configuração e nas entradas de lançamento da City. A documentação não instala fórmulas nem cria uma execução. Não criar artefatos de exemplo em `plans/` para simular uma execução concluída.

Referências do contrato do pack: [preparação de build](https://github.com/gastownhall/gascity-packs/blob/820c7ca0d57335550487af6a6d2eb2f16ba66414/gascity/assets/workflows/build-base/prepare.md) e [planning-base](https://github.com/gastownhall/gascity-packs/blob/820c7ca0d57335550487af6a6d2eb2f16ba66414/gascity/formulas/planning-base.formula.toml).

## Caminho de uma entrega

1. **Intake:** receber a branch e `inputs/<delivery>/`; fixar commit, paths e hashes das fontes, resultado pedido, escopo, restrições e repositórios possivelmente afetados.
2. **Discovery e clarificação:** resolver ambiguidades materiais; distinguir propostas, decisões, contrato semântico e evidência externa. Preservar diferenças entre tracks frontend/backend.
3. **Especificação e plano:** definir requisitos verificáveis, contratos, responsabilidades por rig, dependências, critérios de aceite e gates. O plano não é aprovação automática de uma mudança de produto.
4. **Análise:** confrontar o conjunto com princípios, requisitos e superfícies; registrar findings e resolver os que impedem execução.
5. **Execução:** workers operam nos worktrees dos produtos e consomem o commit de Planning aprovado. A City controla distribuição, isolamento e ciclo de execução.
6. **Integração e validação:** compor os SHAs candidatos sem merge na base. Registrar testes proporcionais no repositório proprietário; UI usa ambiente snapshot, suíte usa `_test`.
7. **Publicação:** branches candidatas publicadas e PRs OPEN, com destino/head/SHA corretos e auto-merge desligado. `validated-local` é intermediário; alterações concluem em `published-prs`.
8. **Compound:** registrar o aprendizado confirmado em `docs/solutions/`, citando causa, correção, evidência e condições de reaplicação. Um aprendizado deve ser confirmado no contexto em que será aplicado.

## Handoff entre rigs

Cada handoff identifica entrega/revisão, commit de Planning, repositório/SHA de entrada, contrato consumido, artefatos produzidos, dependências e gate observável. Mudança material após aprovação exige nova revisão; não reescreva a intenção já consumida por outro worker.

O conjunto reproduzível é registrado por manifesto em [deliveries/](../deliveries/README.md); o ambiente de integração monta os worktrees necessários conforme esses SHAs. Dependências entre PRs permanecem explícitas, sem merge de agente para satisfazê-las.

## Responsabilidades da City

Packs, fórmulas, beads, nomes de agentes e estados operacionais são responsabilidade da City. `workspace.json` não é `city.toml`. Não converter documentação em comandos de ativação nem inventar agentes para completar o roteiro. Antes de entregar trabalho ao Refinery, conferir a estratégia efetiva `mr`, incluindo tarefas antigas e o smoke.

Os contratos e gates operacionais são definidos pela City. O manifesto de exemplo deste Planning documenta intenção e composição; não é ainda o schema de entrada de uma fórmula GasCity.

Fonte técnica consultada para separar City e rigs: [Gas City — how it works](https://github.com/gastownhall/gascity/blob/main/docs/getting-started/how-gas-city-works.md), via Context7 em 23/10/2026. A versão/configuração efetivamente instalada na City prevalece para comandos operacionais.
