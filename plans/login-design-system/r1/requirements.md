# Requisitos — login Design System r1

Estado: proposta, não aprovada. Responsável pela aprovação: não identificado. Fonte: briefing `inputs/login-design-system/briefing.md` no Planning `3ed28c02f495c7d5af94d82722d18f0551cf3b2f`; investigação em `discovery/login-design-system/discovery.md`. Decisões propostas em `decisions.md`. Entrada: `input_branch=input/login-design-system`, `input_path=inputs/login-design-system/`, `artifact_root=plans/login-design-system/r1/`, `requirements_path=plans/login-design-system/r1/requirements.md`, `plan_path=plans/login-design-system/r1/implementation-plan.md`.

Jornada J1: pessoa não autenticada identifica a tela, informa credenciais, pode controlar visibilidade da senha e lembrar sessão, submete e recebe resultado ou acessa recuperação quando disponível.

| ID | Requisito e critério de aceite observável |
| --- | --- |
| R1 | J1 apresenta fundo `bg-muted/40`, área centralizada com padding 6 e altura mínima da viewport, Card `w-full max-w-md`, marca vinculada à rota home no início do CardHeader, seguida do título em h1 e descrição existentes; CardContent contém email, senha com recuperação condicional à direita do rótulo (quebrando sem sobreposição em espaço estreito), remember, botão e status existentes. A marca e recuperação são adaptações preservadas da Application, ausentes da story; comparar estrutura e controles com `AuthenticationAndAccess` nos dois temas, sem reproduzir seu conteúdo demonstrativo. |
| R2 | Email, senha, validação, mensagens por campo, status, envio, spinner e desabilitação durante processamento mantêm comportamento; sucesso limpa senha conforme contrato existente; credenciais inválidas não autenticam. |
| R3 | `remember` continua selecionável e enviado; recuperação aparece somente quando `canResetPassword` e navega à rota existente; não introduzir capacidade ou regra de autenticação. |
| R4 | Senha permanece mascarada inicialmente, alternável por ponteiro e teclado, com nome acessível atualizado; rótulos associados, erros identificados e anunciados, foco visível e ordem lógica, sem depender apenas de cor. |
| R5 | Em 320 px e desktop, a 200% de zoom e nos temas claro/escuro, conteúdo e controles permanecem legíveis, utilizáveis e sem corte ou rolagem horizontal indevida; contraste de texto, estados e foco atende aos limiares e método em D5, com medições registradas para cada tema e estado aplicável. |
| R6 | Mudança em componente reutilizável exige avaliar contraparte DS, documentar compatibilidade e alinhar no repositório proprietário quando necessário; sem padrão visual paralelo, sem regressão das demais telas que compartilham layout. |

Não há contrato de dados novo, mudança de tenant, permissão, backend ou cópia de conteúdo sintético da story. Aceite exige evidência funcional e visual nos SHAs candidatos, não apenas análise estática. Aprovação, revisão e resultados de execução permanecem pendentes.
