# Requisitos — copiar e-mail no perfil — r1

Estado: proposta, não aprovada. Fonte: `inputs/copiar-email-perfil/briefing.md` no commit `1f36b34e7a0fc9f2b0d0308ef0e694e1920216d5`; discovery `discovery/copiar-email-perfil/r1.md`; decisões `plans/copiar-email-perfil/r1/decisions.md`; princípios `docs/PRINCIPIOS.md`. Jornada J1: usuário autenticado edita ou consulta o perfil e copia o valor visível sem salvar.

| ID | Requisito e critério de aceite observável |
| --- | --- |
| R1 | Na página Perfil, ação identificada como “Copiar e-mail” junto ao campo copia exatamente seu valor no instante da ativação, inclusive edição ainda não salva, sem normalização ou cópia de outros dados. Verificar também diferença entre valor original e editado. |
| R2 | Só após confirmação da escrita, mostrar feedback discreto em português e anunciável por leitor de tela. Antes da confirmação não anunciar sucesso; limpar/inval­idar feedback anterior em nova tentativa ou edição, e impedir resultado assíncrono antigo de prevalecer. |
| R3 | Campo vazio não é copiado e não gera sucesso; indicar “Informe um e-mail para copiar.”. API ausente ou permissão negada/rejeição mostra “Não foi possível copiar o e-mail. Copie-o manualmente.”, sem falso sucesso; usuário pode selecionar manualmente. |
| R4 | Ação acionável por ponteiro e teclado, nome acessível “Copiar e-mail”, foco visível, botão `type="button"`; feedback perceptível visualmente e por região de anúncio, sem mover foco. Preservar rótulo e erros do campo. |
| R5 | Copiar não altera dados nem dispara submit, requisição de atualização ou persistência; edição não salva permanece; Salvar, validações, processamento e exclusão de conta permanecem funcionais. |
| R6 | Uso de primitivas e tokens existentes; campo, ação e feedback legíveis e acessíveis em viewport estreita e larga, temas claro e escuro. |
| R7 | Cobrir sucesso, valor editado, vazio, API ausente e rejeição, repetição/concorrência, teclado, foco, anúncio, ausência de submit e regressões do perfil com evidências reproduzíveis; executar verificações de tipos, lint, build e gates da Application. |

O valor vazio significa string de comprimento zero; não transformar valores não vazios, inclusive espaços. Nenhum dado é enviado a terceiros. Não alterar backend, rotas, persistência, autorização ou criar biblioteca/abstração compartilhada sem necessidade demonstrada. As decisões registram propostas técnicas, não aprovação humana. Revisão independente e aprovação aplicável permanecem pendentes.
