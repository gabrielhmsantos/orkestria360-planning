# Plano de implementação — login r1

Estado: proposta, dependente de revisão e aprovação; nenhuma implementação nesta execução. Entradas e SHAs: discovery e requirements desta revisão, Application `3ed550be9822b000082f2422aa21f5a3df66d465`, DS `314627a38ae356f9296bdc8600cb444a1de666a0`. Revalidar SHAs e instruções dos repositórios antes de executar; o commit de Planning aprovado ainda não existe.

## Escopo e sequência

1. T1 (D1/D4, R1/R6): em `resources/js/app.tsx`, selecionar um novo `resources/js/layouts/auth/auth-login-layout.tsx` para `auth/login` antes do ramo `auth/`; manter o ramo geral e o layout simples para as demais telas. O novo layout recebe título, descrição e children pela mesma interface do atual e compõe exatamente D1 usando Card, CardHeader e CardContent locais; preservar link/logo e h1. A página `resources/js/pages/auth/login.tsx` mantém os metadados e formulário, ajustando somente a linha da recuperação para quebra segura se necessário. Conferir em runtime que os metadados chegam e que há um único cabeçalho e Card; validar `h-full` do Card. Testar regressão das outras páginas auth. As cópias de Card têm API e classes estáticas iguais nos SHAs lidos, não compatibilidade funcional comprovada.
2. T2 (D2/D3, R2–R4): preservar `Form`, props, rotas e estado. Relacionar mensagens aos inputs e estado inválido quando presentes; verificar ordem de foco natural e controle de senha sem modificar autenticação. Não copiar `tabIndex=-1` do DS. Se alteração de `password-input`, `input-error` ou outro componente compartilhado for necessária, avaliar todos consumidores e alinhar contraparte DS/stories, com regressões nos dois repositórios.
3. T3 (R1/R4/R5): em Application isolada, comparar candidato com story e testar 320 px e desktop, zoom 200%, temas claro e escuro; capturar evidência sanitizada de normal, foco, inválido, processamento e status. Medir os limiares D5 em cada tema: inspecionar cores computadas e composição real de transparências sobre a superfície; calcular contraste por luminância relativa com ferramenta verificável, sem arredondar. Registrar pares de cores, valores, dimensão e estado, ferramenta, viewport, tema e SHA. Cobrir título, descrição, labels, placeholders, links, erros, status e texto do botão; limites/ícones de input, checkbox marcado e desmarcado, botão, visibilidade de senha, estados inválidos e indicador de foco. Para foco comparar também pixels correspondentes com/sem foco e área equivalente ao perímetro de 2 CSS px; verificar visualmente foco não oculto e ordem por teclado. Desabilitado é exceção conforme D5. Falhas exigem correção e nova medição, inclusive avaliação da contraparte DS. Testar teclado, nome do botão, leitura e associação dos erros, rolagem e recuperação.
4. T4 (R2/R3/R6): executar regressão de login válido/inválido, reset, remember marcado/desmarcado, recuperação disponível/indisponível e estados de submissão; conferir consumidores do layout. Executar testes de autenticação e recuperação existentes em `tests/Feature/Auth/AuthenticationTest.php` e `PasswordResetTest.php`, mais verificações de frontend `npm run types:check`, `npm run lint:check` e build conforme ambiente do repositório. Acrescentar testes de integração apenas onde necessário para cobrir lacunas. Se DS mudar, validar suas stories, acessibilidade e build conforme scripts próprios. Registrar comandos, resultados e SHAs, sem credenciais.
5. T5: revisão independente do diff e matriz, vínculo por hashes dos artefatos e candidatos; registrar diagnóstico e correções preservando evidências. Compor manifesto e gates antes de publicar pelos mecanismos autorizados.

## Matriz de rastreabilidade

| Requisito | Decisão | Tarefa | Aceite | Validação/evidência |
| --- | --- | --- | --- | --- |
| R1 | D1 | T1,T3 | composição e controles coerentes | comparação catálogo/candidato por SHA, temas |
| R2 | D2 | T2,T4 | submissão e estados preservados | testes auth e percurso válido/inválido |
| R3 | D2 | T2,T4 | remember e recuperação preservados | percurso e teste de integração por estado |
| R4 | D3,D5 | T2,T3 | teclado, associação, anúncio e foco | inspeção acessível e teclado nos dois temas |
| R5 | D1,D5 | T3 | responsivo e limiares D5 atendidos em cada tema | capturas e tabela de pares, valores, foco e estados em 320 px, desktop e zoom |
| R6 | D4 | T1,T4,T5 | impacto compartilhado e DS tratados | diff, consumidores e gates dos repos afetados |

## Dependências e gates

A execução depende de revisão dos artefatos, ambiente Application isolado com snapshot `orkestria360` para UI; testes que usam `RefreshDatabase` somente em `orkestria360_test`. Não executar migrations/testes no banco humano. Configuração e credenciais são externas ao manifesto. A alteração de DS só é necessária se uma mudança compartilhada exigir alinhamento; se ocorrer, compor e verificar ambos candidatos por SHA antes do aceite. Documentar limitações e diferenças de versão em vez de inferir compatibilidade.

Gates pendentes: análise independente por hash, aprovação da intenção, build e testes, inspeção visual/acessível, revisão completa de diff e publicação. A exceção desta execução autoriza apenas delivery nativo a integrar PR de Planning em `input/login-design-system`; não autoriza agente a publicar ou integrar diretamente, nem alterar política geral ou bases de produtos. PRs de produtos futuros seguem governança vigente e dependem de autorização apropriada.
