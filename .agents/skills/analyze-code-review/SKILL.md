---
name: analyze-code-review
description: "Valide retornos de code review contra código e contratos ativos do projeto, produzindo relatório fundamentado sem executar uma nova review, corrigir código ou administrar threads de PR. Use somente quando invocada explicitamente."
---

# Analyze Code Review

Analise apontamentos já recebidos em JSON, texto/Markdown ou link de PR/review.
O resultado é um relatório de validação; não implemente, planeje, commit, envie
alterações nem resolva comentários como parte desta skill.

## Entrada e investigação

- Normalize cada apontamento em prioridade original, arquivo/linha quando
  houver, título, descrição e origem. Se um link não puder ser lido com as
  ferramentas autorizadas, peça o conteúdo do review.
- Leia o local citado, o fluxo diretamente relacionado e os testes relevantes.
  Não trate a linha apontada como prova suficiente.
- Antes do veredito, reconcilie o apontamento com os contratos ativos do
  projeto. Identifique a feature pela solicitação, branch e paths afetados;
  leia somente os artefatos pertinentes em `plans/`, `deliveries/`, `discovery/`,
  `docs/` e `AGENTS.md`. `specs/` é histórico para consulta; use-o apenas quando
  o contrato histórico estiver explicitamente selecionado no escopo. Se a feature não puder ser identificada, declare a limitação em
  vez de presumir que a regra geral do review prevalece.
- Use a seguinte precedência: solicitação atual do usuário, decisão aprovada da
  feature, instruções do projeto, contratos técnicos/documentação e, por fim,
  código e testes atuais. O code review é evidência de risco, não fonte de
  requisitos do produto.
- Preserve a prioridade recebida. Explique o risco quando necessário, mas não
  repriorize automaticamente.
- Não execute uma nova review. Para comentários de PR, esta skill avalia o
  conteúdo recebido; não faz push nem resolve threads.

## Revisão especializada

Este Planning não configura agentes em `.codex/agents`. Os nomes abaixo são papéis opcionais quando disponibilizados pelo fluxo; não crie nem presuma sessões, agentes ou configuração para satisfazer esta skill. Sem especialistas disponíveis, analise localmente e declare a limitação.


- Direcione backend, banco, concorrência, segurança, integrações, arquitetura
  e deploy ao `tech_lead` quando esse agente estiver disponível.
- Direcione frontend, UX, acessibilidade e interação ao `qa_ux_ui` quando esse
  agente estiver disponível.
- Consulte ambos para itens que cruzem essas áreas.
- Se o especialista não estiver disponível, mantenha a análise local e declare
  a limitação no relatório.

## Relatório

Para cada apontamento, informe em tabela: prioridade original, especialista
consultado, veredito, evidência de código, contrato consultado e impacto.

Use apenas estes vereditos:

- `Confirmado`: o código viola um requisito técnico ou de produto aplicável.
- `Rejeitado por decisão aprovada`: o apontamento conflita com uma decisão
  documentada e o código a implementa corretamente.
- `Confirmado apesar da decisão`: existe decisão documentada, mas ela não
  elimina um risco real de segurança, integridade ou operação.
- `Precisa de decisão`: a documentação está ausente, contraditória ou parece
  desatualizada para o comportamento observado.

Feche com totais por prioridade e as decisões que dependem do usuário. Uma
conclusão `Precisa de decisão` deve apresentar as alternativas e a razão da
ambiguidade, sem escolher produto ou arquitetura em nome do usuário.

Sempre cite o arquivo e a seção, ou linha quando disponível, do contrato usado
para rejeitar ou confirmar um apontamento. Uma decisão aprovada não justifica
aceitar silenciosamente uma falha de segurança, integridade ou operação.

## Limites

- Não substitua `run-review`: ela executa uma revisão nova.
- Não substitua `check-pr-comments`: ela trata threads e pode corrigir código.
- Planejamento ou implementação só começam em uma solicitação posterior e
  explícita do usuário.
