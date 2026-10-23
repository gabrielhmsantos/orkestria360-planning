# Templates de planejamento

Use os templates conforme a necessidade da tarefa; não produza todos por rotina. Eles auxiliam a redação e não executam hooks. Os artefatos produzidos pelo GasCity devem respeitar o schema e o YAML front matter exigidos pelo pack.

- [spec.md](spec.md): conteúdo de requisitos, jornadas, superfícies e critérios de aceite para `requirements.md`.
- [plan.md](plan.md): estratégia, responsabilidades por rig, dependências e validação para `implementation-plan.md`.
- [analysis.md](analysis.md): findings contra princípios, contratos e cobertura de aceite.
- [handoff.md](handoff.md): escopo e evidências de uma passagem entre rigs ou para revisão humana.
- [manifest.example.json](manifest.example.json): composição documental de uma entrega; exemplo incompleto, sem autoridade para executar.

Escreva os novos artefatos em `plans/<delivery>/r<revision>/`, conforme `artifact_root` e os paths do workflow; veja [destino dos artefatos](../docs/FLUXO.md#destino-dos-artefatos). Os nomes dos arquivos nesta pasta são templates de conteúdo, não um layout de saída. `specs/` é histórico para consulta e não recebe novas features. Decisões e contratos compartilhados devem ser referenciados, evitando duplicação com conteúdos divergentes.
