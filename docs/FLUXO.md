# Fluxo de planejamento e entrega

Este documento define os contratos de planejamento e entrega independentemente do orquestrador. Este repositório fornece o planejamento, os contratos e as evidências. A integração identifica os produtos por repositório e SHA.

## Materiais de entrada e branch recebida

O usuário fornece imagens, Markdown, DOCX e demais referências em `inputs/<delivery>/`, já versionados na branch entregue ao Planning. A organização dos arquivos dentro da pasta é livre; `briefing.md` é opcional e pode indicar objetivo, resultado esperado e prioridade entre referências. Veja [inputs/README.md](../inputs/README.md).

O intake identifica `input_branch`, `input_path` e `source_context_commit`, o SHA da branch recebida antes de produzir resultados. Registra em `source_files` os paths relativos e hashes das fontes consumidas. O planejamento começa nesse commit e preserva esse contexto ao avançar com commits de planejamento; não troca pela branch padrão nem exige merge prévio dos materiais. A base do PR e as branches dos produtos são entradas separadas.

Materiais fornecidos pelo usuário permanecem em `inputs/`; discovery, decisões, requisitos e planos são produzidos nas pastas de saída correspondentes. Cada conclusão relevante referencia as fontes efetivamente lidas, com path e commit. Se uma fonte estiver ausente, ilegível ou em conflito material sem prioridade definida, registre a lacuna para a clarificação; não invente seu conteúdo. Material novo após a fixação do contexto exige intake/revisão identificados.

Quando a ferramenta de execução usar um bundle de contexto, ele deve referenciar os materiais e seus hashes. `inputs/<delivery>/` continua sendo o diretório das fontes, distinto de qualquer bundle e de `artifact_root`.

## Destino dos artefatos

Novos planejamentos usam `plans/<delivery>/r<revision>/`, relativo à raiz deste repositório. A entrada da execução identifica `artifact_root`, `requirements_path` e `plan_path`, seguindo os caminhos convencionados abaixo. Não presuma que um orquestrador escolha esses caminhos automaticamente.

| Entrada do workflow | Convenção deste Planning |
| --- | --- |
| `artifact_root` | `plans/<delivery>/r<revision>/` |
| `requirements_path` | `<artifact_root>/requirements.md` |
| `plan_path` | `<artifact_root>/implementation-plan.md` |

Cada execução deve resolver e registrar os caminhos canônicos de requisitos e plano antes de produzir artefatos. Decomposição, revisões e relatórios permanecem sob a mesma raiz quando exigidos pelo escopo, com contratos e nomes explícitos.

Os artefatos de planejamento são Markdown com metadados e rastreabilidade proporcionais ao contrato da entrega; use YAML front matter quando exigido pelo validador adotado. Os templates auxiliam a redação, mas não substituem validação de conteúdo, campos obrigatórios ou gates.

`specs/` é acervo histórico para consulta. Não recebe novos planos, novas features ou reexecução dos procedimentos que descreve. Um contrato histórico pode ser selecionado explicitamente como entrada, sem promover comandos ou checkboxes históricos a instruções de execução.

Manifestos de composição e evidências aceitas ficam em `deliveries/<delivery>/r<revision>/`. Eles referenciam os artefatos de `plans/` e seus SHAs. Contexto de produto permanece em `discovery/` e aprendizados em `docs/solutions/`.

Essa convenção deve ser aplicada à configuração e às entradas do workflow adotado. A documentação não cria uma execução. Não criar artefatos de exemplo em `plans/` para simular uma execução concluída.

## Caminho de uma entrega

1. **Intake:** receber a branch e `inputs/<delivery>/`; fixar commit, paths e hashes das fontes, resultado pedido, escopo, restrições e repositórios possivelmente afetados.
2. **Discovery e clarificação:** resolver ambiguidades materiais; distinguir propostas, decisões, contrato semântico e evidência externa. Preservar diferenças entre tracks frontend/backend.
3. **Especificação e plano:** definir requisitos verificáveis, contratos, responsabilidades por repositório, dependências, critérios de aceite e gates. O plano não é aprovação automática de uma mudança de produto.
4. **Análise:** confrontar o conjunto com princípios, requisitos e superfícies; registrar findings e resolver os que impedem execução.
5. **Execução:** agentes operam nos worktrees autorizados e consomem o commit de Planning aprovado. A execução deve estabelecer distribuição, isolamento e ciclo de trabalho usando a ferramenta adotada.
6. **Integração e validação:** compor os SHAs candidatos sem merge na base. Registrar testes proporcionais no repositório proprietário; UI usa ambiente snapshot, suíte usa `_test`.
7. **Publicação:** branches candidatas publicadas e PRs OPEN, com destino/head/SHA corretos e auto-merge desligado. `validated-local` é intermediário; alterações concluem em `published-prs`.
8. **Compound:** registrar o aprendizado confirmado em `docs/solutions/`, citando causa, correção, evidência e condições de reaplicação. Um aprendizado deve ser confirmado no contexto em que será aplicado.

## Handoff entre repositórios

Cada handoff identifica entrega/revisão, commit de Planning, repositório/SHA de entrada, contrato consumido, artefatos produzidos, dependências e gate observável. Mudança material após aprovação exige nova revisão; não reescreva a intenção já consumida por outro worker.

O conjunto reproduzível é registrado por manifesto em [deliveries/](../deliveries/README.md); o ambiente de integração monta os worktrees necessários conforme esses SHAs. Dependências entre PRs permanecem explícitas, sem merge de agente para satisfazê-las.

## Responsabilidades da execução

A ferramenta de orquestração adotada deve respeitar as fontes de verdade, os caminhos, os critérios de aceite e a política de publicação deste repositório. `workspace.json` é um mapa de ownership e planejamento, não uma configuração executável do orquestrador. O manifesto de exemplo descreve intenção e composição; não é, por si só, autorização ou schema de execução.
