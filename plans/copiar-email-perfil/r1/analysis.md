# Análise — copiar e-mail no perfil r1

Conjunto: briefing e fontes/SHAs em `discovery/copiar-email-perfil/r1.md`; requisitos, decisões e plano desta revisão; `docs/PRINCIPIOS.md`, `docs/PRODUTO.md`, `docs/FLUXO.md`, instruções frontend e testes da Application. Revisão do autor, não independente.

| ID | Prioridade | Evidência e impacto | Tratamento |
| --- | --- | --- | --- |
| A1 | Alta | Input não controlado usa `defaultValue`: ler auth copiaria dado salvo em vez da edição (R1). | D1 lê elemento no clique; regressão com valores diferentes. |
| A2 | Alta | Hook retorna false para indisponibilidade e rejeição, e pode reter `copiedText` anterior na ausência de API (R2–R3). | D2 usa retorno da tentativa e limpa feedback; cenários de falha exigidos. |
| A3 | Alta | Operações assíncronas e edição podem tornar anúncio obsoleto (R2). | D3 invalida respostas antigas; teste de ordem inversa e edição pendente. |
| A4 | Média | Button não define tipo por padrão; dentro do Form pode submeter (R4–R5). | D4 exige `type="button"` e observação de requisições. |
| A5 | Média | Teste PHP de perfil cobre persistência/exclusão, não clipboard, foco ou responsividade (R7). | Plano exige navegador e ambiente isolado; infraestrutura efetiva e evidência continuam pendentes. |
| A6 | Média | Hook do Design System tem API diferente; não há evidência de importação compartilhada. | Reutilizar hook Application, sem copiar API ou mudar componente; avaliar contraparte se houver alteração compartilhada. |

Cobertura: R1–R7 ligados a tarefas 1–7 e critérios observáveis; princípios I e VI preservam intenção e rastreabilidade, II e IV orientam reuso e contraparte, III impede falso sucesso, V mantém fronteira existente, VII exige evidência funcional. Não foi identificado conflito material ou necessidade de novo contrato de backend. Resultado: `ready` para revisão independente da proposta, não para declarar implementação validada ou aprovada; revisão, aprovação aplicável, testes funcionais e publicação permanecem pendentes. Nenhuma evidência de aprovação foi observada.
