# Skills locais

As seis skills estão versionadas em `.agents/skills/`, com referências, templates e validadores locais. Arquivos `agents/openai.yaml` internos às skills são metadados de interface; não configuram agentes de execução.

| Skill | Uso | Contexto necessário |
| --- | --- | --- |
| [make-discovery](../.agents/skills/make-discovery/SKILL.md) | Discovery de produto/UI, fontes/backend e prontidão por track | Materiais da demanda e contratos pertinentes |
| [validate-graph](../.agents/skills/validate-graph/SKILL.md) | Validação técnica de APIs Microsoft | `ORKESTRIA_APP_PATH` explícito e configuração privada autorizada para coleta real |
| [frontend-contract-fixtures](../.agents/skills/frontend-contract-fixtures/SKILL.md) | Fixtures globais sintéticas | Contrato aprovado e output explícito no worktree Application |
| [analyze-code-review](../.agents/skills/analyze-code-review/SKILL.md) | Análise de apontamentos recebidos, somente quando invocada | Escopo, diff e apontamentos; não cria especialistas nem executa nova review |
| [ui-blueprint](../.agents/skills/ui-blueprint/SKILL.md) | Blueprint de interface e validação estrutural | Contratos de produto; Storybook para comprovar APIs do Design System |
| [m365-simulator-contracts](../.agents/skills/m365-simulator-contracts/SKILL.md) | Contratos Microsoft e fixtures do Simulator | Worktrees Application e Simulator selecionados explicitamente |

## Ferramentas conforme a tarefa

Context7 consulta documentação técnica; Storybook MCP comprova APIs de componentes. Confira as ferramentas disponíveis no ambiente da execução. Sem acesso ao catálogo necessário, um blueprint pode permanecer `conceptual`; não alegue props verificadas.

Impeccable, Vercel Composition Patterns e Playwright são competências externas opcionais, usadas quando disponíveis e necessárias. A leitura e o planejamento deste repositório não dependem de instalá-las.

## Manutenção

Revise alterações nas skills com todos os seus recursos e preserve a compatibilidade dos validadores e templates. Não use symlinks para worktrees externos. Uma atualização baseada no Design System ou Simulator deve identificar o repositório e commit consultados e as adaptações locais no commit/PR. Alterar ou publicar um produto exige uma entrega no repositório proprietário.

## Verificar helpers sem coleta real

```bash
node .agents/skills/frontend-contract-fixtures/scripts/test-global-fixtures.mjs
node .agents/skills/ui-blueprint/scripts/test-validate-blueprint.mjs
php .agents/skills/validate-graph/scripts/application-path-test.php
php -l .agents/skills/validate-graph/scripts/application-path.php
php -l .agents/skills/validate-graph/scripts/validate-endpoint.php
```

O teste completo de `validate-endpoint-test.php` exige somente dependências PHP da aplicação indicada em `ORKESTRIA_APP_PATH`; não inicializa Laravel ou banco. A coleta técnica real depende de configuração privada e autorização do contexto. Um teste de helper não valida credenciais, snapshot ou Graph ao vivo.
