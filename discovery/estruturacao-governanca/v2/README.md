# Estruturação e Governança — Contrato de Evidências V2

Esta pasta descreve a evolução proposta do workflow documental para produzir evidências auditáveis para o IMDO, sem alterar os oito tópicos de Governança.

## Artefatos

- `governance-evidence-form-v1.yaml`: definição declarativa dos oito tópicos, suas seções, pesos, modo de envio e chaves de evidência IMDO.
- `examples/contoso-governance-submission-v1.json`: resposta fictícia e completa de um único tenant, com todos os campos respondidos e cada seção revisada pelo administrador.

## Decisões do contrato

- Cada tópico conserva um responsável, uma vigência e um ciclo de aprovação.
- Cada seção aceita o modo de evidência definido no fixture: `text`, `template_file` ou `text_or_file`. Anexos complementares podem acompanhar qualquer resposta.
- O arquivo anexado é evidência, não conclusão automática. O administrador revisa todas as seções e registra `absent`, `partial` ou `conformant`, com nota `0`, `60` ou `100` e comentário.
- O score do tópico é a média ponderada das seções revisadas. Só a revisão administrativa produz evidência consumível pelo IMDO.
- CSV/XLSX é usado quando a informação é tabular e validável (inventários e matriz de acessos). Políticas, mapas, procedimentos e relatórios podem ser texto no produto ou arquivo, conforme a seção.

O contrato é um artefato de discovery. Ele não altera o workflow hoje implementado em `orkestria360/` e não autoriza inferir conteúdo de um arquivo sem revisão humana.
