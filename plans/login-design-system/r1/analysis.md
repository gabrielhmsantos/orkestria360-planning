# Análise inicial — r1

Não é revisão independente nem aprovação. Conjunto: briefing e fontes com SHAs no discovery; requirements, decisions e plano r1. Revisores devem registrar diagnóstico, hashes exatos dos artefatos revisados, achados e resolução; hashes e evidências anteriores não devem ser apagados.

| ID | Achado | Impacto e encaminhamento |
| --- | --- | --- |
| A1 | Cenário DS não cobre logo nem recuperação; é demonstração. | D1 preserva ambos e requer comparação e revisão visual; posicionamento específico ainda não validado. |
| A2 | Botão de senha DS é retirado do tab; Application é focável; erro Application anuncia alerta. | D3 preserva acesso e anúncio; testar ordem e associação de erros. Não copiar cegamente. |
| A3 | Layout simples compartilhado e dependências de versões diferentes. | D4 limita impacto e exige avaliar consumidores, Card e alinhamento DS; compatibilidade não provada. |
| A4 | Temas, contraste, recuperação condicional e remember não foram executados. | T3/T4 exigem evidência observável; sem ela aceite é pendente. |
| A5 | Aprovação, revisão independente e publicação ainda não observadas. | Não iniciar execução como aprovada nem declarar ready; registrar resultados vinculados a hashes. |

Resultado: `changes-required` para gates de revisão, aprovação e evidências ainda não realizadas; não é julgamento de implementação nem de aprovação do planejamento.

## Histórico de revisão e reparo

A revisão de aceite rejeitou a ausência de limiares/método para contraste e foco, a composição indeterminada de marca/recuperação e a ausência de histórico de reparos; a revisão de código rejeitou a estratégia apenas em login.tsx e a descrição incorreta da cor da marca. Ambas revisaram a mesma versão: discovery `21c3bbeb1df9df62be5a601853bb51bda44a2368c4b81fcd62e06951a6b817ee`; requirements `bd56583bb82741207f26c6be509f80fc7a419e41433ab5761e04a6b5a15f5209`; decisions `3daf61e77c87b8843e2126216a884cd0eab9805f2c119ba67457ae050070e06c`; plano `1bedf04bbf88ebe66c98a5f95a655e09171cc195b44f78058fe92948aedf1b65`; análise `1f25799d3f9b2ee13a5a3f70cd729bfea6341e27656ec0f1ff4e2863840ced43`; manifesto `6e81b4e51159a5c4e156b3cf4c0e91360759f863ddc68cab6b9a981096bf5983` (SHA-256).

Reparo proposto: D5 e T3 explicitam limiares e método; R1/D1/T1 fixam composição e seleção de layout exclusivo; discovery corrige a cor e registra `app.tsx` e Card. Esta é autorrevisão, sem verificação independente da correção. Não há histórico independente de reparos anteriores disponível no checkout ou feedback; portanto não é possível inspecionar ou afirmar sua resolução. Os achados A1–A5 acima permanecem como evidência inicial; A1–A3 receberam tratamento proposto, A4–A5 continuam pendentes de evidência. Revisão da versão reparada, aprovação e publicação continuam pendentes.
