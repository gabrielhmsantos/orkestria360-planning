# Plano de implementação — login Design System r1

Estado: proposta; execução depende de revisão e aprovação do conjunto. Entradas: `requirements.md`, `discovery/login-design-system/discovery.md`, briefing SHA de Planning `3ed28c02f495c7d5af94d82722d18f0551cf3b2f`; Application `3ed550be9822b000082f2422aa21f5a3df66d465`; DS `314627a38ae356f9296bdc8600cb444a1de666a0`. Commit de Planning aprovado e candidatos ainda não existem. Decisões propostas D1–D4 abaixo não são aprovação.

## Decisões e fronteiras

- D1: manter composição simples e primitivas locais existentes; confrontar com stories e tokens no navegador, corrigir apenas divergências demonstradas. Card e split não são obrigações do catálogo. Reavaliar layout compartilhado antes de qualquer alteração; preferir escopo do login.
- D2: preservar Form, rotas, condições e estado de autenticação; melhorar associação dos erros e ordem de foco no próprio formulário, mantendo o toggle operável. Não copiar `tabIndex=-1` do catálogo. Manter texto e comportamento do fluxo.
- D3: usar tokens disponíveis; medir status/erro antes de decidir reconciliação mínima. Não referenciar `success` inexistente em Application; se exigida alteração global, mapear consumidores e alinhar DS na mesma entrega. Sem novos tokens ou variantes sem justificativa.
- D4: validar independentemente layout, temas, acessibilidade e regressão de autenticação em ambiente isolado; sem interpretar stories como homologação.

## Tarefas ordenadas

| ID | Tarefa e dependência | Arquivos candidatos e resultado |
| --- | --- | --- |
| T1 | Fixar SHAs de entrada e baseline em navegador; comparar estados, stories, estilos e tema (D1, D3). | Application `resources/js/pages/auth/login.tsx`, `layouts/auth-layout.tsx`, `layouts/auth/auth-simple-layout.tsx`, `resources/css/app.css`; DS `src/app.css`, `src/components/ui/` e stories, `src/components/shell/` e stories. Registrar diferenças concretas e efeitos em outras páginas. |
| T2 | Após T1, ajustar composição local e associação/foco dos campos (D1, D2). | `login.tsx`; layout apenas se comprovadamente necessário e com regressão de todos consumidores. Primitivas e wrappers locais somente se necessário; nenhum backend previsto. |
| T3 | Se T1 demonstrar lacuna compartilhada, avaliar e alinhar contraparte DS antes de integrar; mapear consumidores, contratos e versões (D3). | Candidatos condicionais `resources/js/components/{ui/,password-input.tsx,input-error.tsx}`, `resources/css/app.css` e equivalentes DS `src/components/{ui/,shell/}`, `src/app.css` e stories. Alterar apenas arquivos comprovadamente necessários; validar variantes e consumidores. |
| T4 | Executar regressões e inspeção cruzada por SHA (D4), depois análise independente e entrega. | Testes Application existentes e testes proporcionais de regressão; Storybook/controles DS somente se alterados; evidências sanitizadas no manifesto. |

## Matriz de rastreabilidade

| Requisito | Decisão | Tarefa | Aceite | Validação |
| --- | --- | --- | --- | --- |
| R1 | D1 | T1–T2 | Controles e composição justificados pelo catálogo | Comparação visual anotada por SHA e stories nos dois temas |
| R2 | D3–D4 | T1–T4 | Contraste e estados conforme R2 | Medição de pares reais incluindo foco e erro, claro/escuro |
| R3 | D1–D4 | T1–T4 | Sem corte/overflow nas larguras e zoom de R3 | Navegador nos tamanhos indicados, registrar capturas sanitizadas |
| R4 | D2–D4 | T2–T4 | Nomes, erros, foco e toggle verificáveis | Teclado e leitor de tela, DOM e inspeção de acessibilidade |
| R5 | D2–D4 | T2–T4 | Fluxos e estados preservados | Testes Auth existentes e cenários reais de sucesso, falha, processamento e 2FA |
| R6 | D2–D4 | T2–T4 | Remember, recuperação condicional e status preservados | Exercitar marcado/desmarcado, link habilitado/desabilitado e status |
| R7 | D3 | T1, T3–T4 | Contrapartes e consumidores validados se alterados | Diff e testes de variantes nos dois SHAs; documentar ausência de alteração compartilhada quando aplicável |

## Gates e ambiente

Antes de implementar: revisão independente e aprovação explícita; atualizar SHAs se fontes mudarem. Ambiente UI Application com snapshot isolado `orkestria360`; testes em `orkestria360_test`, jamais banco humano. Ler `docs/agents/TESTING.md` da Application antes de alterar testes. Conforme `AGENTS.md` da Application executar testes direcionados via `composer test` ou ambiente de teste explícito documentado ali, `npm run types:check`, `npm run lint:check`, `npm run build` e `composer ci:check`; registrar saída sanitizada e falhas, sem substituir os testes funcionais por checks. Se DS mudar, executar `pnpm typecheck`, `pnpm lint`, `pnpm build-storybook` e testes de stories aplicáveis conforme setup e lockfile do próprio repositório; verificar contraste e teclado em componentes compartilhados. Investigar falhas existentes por baseline, não enfraquecer critérios.

Compor candidatos por SHA e documentar versão de Planning consumida, dependências e PRs por repositório afetado. Aplicação depende do alinhamento DS apenas se a mudança compartilhada for necessária; validar candidatos juntos sem exigir merge. Revisão de diff, gates e publicação cabem ao delivery autorizado: PR draft para base apropriada, sem merge, auto-merge ou push direto à base. Nesta execução nenhuma publicação ou modificação de produto é autorizada. Referência de implementação é plano, não prova de que o resultado passou.
