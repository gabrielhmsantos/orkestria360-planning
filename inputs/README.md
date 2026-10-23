# Materiais de entrada

Coloque os materiais de cada entrega em `inputs/<delivery>/` e versione-os na branch que será entregue ao rig Planning. Imagens, Markdown, DOCX e outros formatos podem ficar juntos; a organização interna é livre.

Exemplo de estrutura, sem criar uma entrega fictícia:

```text
inputs/<delivery>/
  briefing.md
  requisitos.docx
  dashboard.png
  observacoes.md
```

`briefing.md` é opcional. Ele pode indicar o objetivo, o resultado esperado, as restrições e a prioridade entre referências. O identificador `<delivery>` mantém os materiais de entregas distintas organizados quando suas branches forem incorporadas ao repositório.

## Consumo pelo Planning

O rig recebe a branch e começa no commit indicado pelo intake. Registra `input_branch`, o SHA `source_context_commit`, `input_path` e os paths/hashes das fontes consumidas. A base do PR e as branches dos produtos são definidas separadamente; não é necessário incorporar os materiais à branch-base para começar o planejamento.

O SHA de entrada permanece registrado quando a branch avança com os resultados. Cada análise referencia as fontes por path e commit. O rig não altera os materiais de entrada para ajustá-los às suas conclusões. Fonte ausente, ilegível ou conflito material sem prioridade suficiente é lacuna explícita de clarificação.

## Resultados

- [Discovery](../discovery/README.md): análises, decisões e contratos produzidos.
- [Planos](../docs/FLUXO.md#destino-dos-artefatos): novos requisitos e planos em `plans/<delivery>/r<revision>/`.
- [Entregas](../deliveries/README.md): manifestos e evidências aceitas.

Material novo fornecido após a fixação do contexto exige intake/revisão identificados, mantendo rastreável o que cada execução consumiu. O diretório das fontes não substitui o bundle YAML/JSON passado em `context_path` nem o `artifact_root` dos resultados. Veja [o contrato de entrada](../docs/FLUXO.md#materiais-de-entrada-e-branch-recebida).
