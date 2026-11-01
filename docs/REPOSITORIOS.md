# Repositórios e worktrees

O mapa portátil está em [workspace.json](../workspace.json). O Planning é um repositório independente, sem gitlinks, clones de produtos ou paths absolutos obrigatórios. Esta documentação define ownership e caminhos autorizados sem depender da ferramenta utilizada para orquestrar a execução.

| Área | Repositório | Caminho para uma execução |
| --- | --- | --- |
| Planning | `orkestria360-planning` | Checkout/worktree atual deste repositório |
| Application | `Orkestria360` | `ORKESTRIA_APP_PATH` |
| Design System | `orkestria360-design-system` | `ORKESTRIA_DESIGN_SYSTEM_PATH` |
| Simulator | `orkestria360-m365-simulator` | `ORKESTRIA_SIMULATOR_PATH` |

Este repositório fornece o conteúdo de planejamento e o mapa de ownership. Cada execução deve resolver e validar os caminhos autorizados, sem inferir worktrees adicionais.

## Caminhos locais

Copie `workspace.local.example.json` para `workspace.local.json` e informe os três caminhos absolutos dos worktrees autorizados. O arquivo local é ignorado pelo Git e não contém credenciais. Confira-o com:

```bash
python3 scripts/check-workspace.py --paths
```

As variáveis de ambiente correspondentes prevalecem sobre o arquivo local. O checker somente confere existência, identidade Git e sentinelas de cada produto; não exporta variáveis para seu shell e não executa comandos nos produtos.

Para helpers que usam ambiente, exporte explicitamente o path antes da execução. Exemplo com um caminho ilustrativo que deve ser substituído:

```bash
export ORKESTRIA_APP_PATH="/caminho/absoluto/worktree-application"
```

Não procure outros workspaces para preencher esse path. Use somente o worktree explicitamente autorizado para a execução. Escolha o worktree e confirme SHA, autorização e configuração privada da execução. A aplicação não é inicializada pelo checker.

## Simulator e evidências externas

O checker `scripts/check-inventory.mjs` do Simulator inspecionado aceita `APP_ROOT` e `WORKSPACE_ROOT`. `APP_ROOT` aponta ao worktree Application. `WORKSPACE_ROOT` deve ser uma raiz autorizada que contenha os worktrees e os artefatos de Planning referenciados pelo inventário.

`validationEvidence` é relativo ao worktree Simulator e deve resolver até os artefatos de Planning correspondentes ao SHA da entrega. Confira esses caminhos e suas evidências antes de declarar o gate aprovado. Não crie symlink, snapshot duplicado de Discovery ou exceção no guard para esconder uma referência inválida.

## Branch de entrada do Planning

O usuário entrega a branch com os materiais em `inputs/<delivery>/`. O worktree do Planning começa no commit resolvido dessa branch. Registre `input_branch`, `source_context_commit`, `input_path` e hashes das fontes; o commit de entrada permanece fixo quando a branch avança com discovery e planejamento. Esse campo é distinto do commit do planejamento aprovado consumido pelos produtos.

Não substituir a branch recebida por `main`, criar outra base por conveniência ou exigir merge prévio dos materiais. A base do PR e as branches dos produtos são definidas separadamente. Leia [o contrato dos materiais](FLUXO.md#materiais-de-entrada-e-branch-recebida).

## Documentos por execução

O Planning escreve novos artefatos em `plans/<delivery>/r<revision>/`, definido na entrada da execução como `artifact_root`. `requirements.md` e `implementation-plan.md` seguem os paths registrados pelo workflow. `specs/` é histórico de consulta; não recebe novas entregas. Consulte [o contrato dos paths](FLUXO.md#destino-dos-artefatos). Manifestos e evidências aceitas ficam em `deliveries/<delivery>/r<revision>/`.

## Reprodutibilidade sem gitlinks

Registre no manifesto de cada entrega repositório, SHA de entrada, branch candidata, SHA validado e PR de cada repositório afetado, além do commit de Planning consumido. SHAs devem ser publicados e alcançáveis antes de declarar a entrega reproduzível por outra máquina. O manifesto é evidência de composição, não autorização para merge ou execução de comandos nele contidos.
