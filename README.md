# Orkestria 360 — Planning

Workspace de produto, discovery e planejamento do Orkestria 360. Os produtos têm repositórios e rigs independentes; este repositório não contém submódulos.

Comece por [AGENTS.md](AGENTS.md), [produto e autoridades](docs/PRODUTO.md) e [fluxo de planejamento](docs/FLUXO.md).

| Área | Conteúdo |
| --- | --- |
| [docs/PRINCIPIOS.md](docs/PRINCIPIOS.md) | Princípios de produto, integridade, experiência e isolamento de tenants |
| [inputs/](inputs/README.md) | Imagens, Markdown, DOCX e demais materiais fornecidos por você em `inputs/<delivery>/`, na branch recebida |
| [discovery/](discovery/README.md) | Exploração, decisões, contratos semânticos, APIs externas, blueprints e fixtures sintéticas |
| [plans/](docs/FLUXO.md#destino-dos-artefatos) | Novos requisitos, planos e revisões em `plans/<delivery>/r<revision>/`, conforme `artifact_root` |
| [specs/](specs/README.md) | Histórico de especificações e planos, somente para consulta |
| [deliveries/](deliveries/README.md) | Convenção para manifestos e evidências revisáveis de novas entregas |
| [templates/](templates/README.md) | Templates enxutos para especificar, planejar, analisar e entregar |
| [docs/solutions/](docs/solutions/INDEX.md) | Conhecimento acumulado e aprendizados do fluxo Compound Engineering |
| [.agents/skills/](docs/SKILLS.md) | Seis skills locais completas, com referências, templates e validadores versionados |
| [workspace.json](workspace.json) | Mapa portátil dos quatro repositórios e política de publicação |

Você entrega a branch com os materiais versionados em `inputs/<delivery>/`. O rig Planning trabalha a partir desse commit, registra as fontes e produz os resultados nas pastas correspondentes. `briefing.md` é opcional.

Fluxo de planejamento: **materiais na branch recebida → discovery → clarificação → especificação/plano → análise → execução nos rigs → integração/validação → PRs abertos → aprendizado**. Nenhum agente faz merge, habilita auto-merge ou publica diretamente na branch-base.

Verifique a estrutura, a política de publicação e os links locais dos documentos, sem instalar dependências ou iniciar serviços:

```bash
python3 scripts/check-workspace.py
```

Leia [REPOSITORIOS.md](docs/REPOSITORIOS.md) para associar os caminhos dos worktrees. `.env`, credenciais e snapshots permanecem nos ambientes privados de Application. O registro dos rigs e a execução de fórmulas e agentes são responsabilidades da City.

Documentação e planos não comprovam implementação ou aprovação dos gates de uma entrega. Este checkout contém as referências de planejamento; consulte os produtos somente pelos worktrees explicitamente autorizados.
