# Requisitos — login Design System, r1

Status: proposta, não aprovada. Fonte e contexto: [discovery](../../../discovery/login-design-system/discovery.md), briefing no commit `3ed28c02f495c7d5af94d82722d18f0551cf3b2f`, princípios IV, VI e VII em `docs/PRINCIPIOS.md` no mesmo commit. Escopo exclusivamente visual e acessibilidade da tela de login; sem nova funcionalidade, tradução obrigatória, mudança de backend, autenticação, regras de acesso ou novo padrão paralelo. Identidade da revisão: `login-design-system/r1`; responsável/aprovador ainda não registrado.

Jornada J1: pessoa acessa o login, identifica campos, informa credenciais, pode revelar/ocultar senha, escolher remember, solicitar recuperação quando habilitada e receber feedback da submissão.

| ID | Requisito e critério de aceite observável |
| --- | --- |
| R1 | Login usa tokens e primitivas oficiais existentes adequados, com hierarquia, foco e estados consistentes com catálogo efetivamente comparado; sem introduzir padrão paralelo. Comparar superfície renderizada com stories e registrar diferenças e justificativas. |
| R2 | Em claro e escuro, texto, campos, foco, erro e status são legíveis e contrastes medidos atendem WCAG 2.2 AA aplicável (texto 4,5:1, texto grande 3:1, componentes/foco essenciais 3:1); não depender apenas de cor. |
| R3 | Em 320px, 768px e desktop, e zoom 200%, conteúdo e controles são alcançáveis e legíveis sem corte ou rolagem horizontal da página; ordem lógica e conteúdo preservados. Registrar viewport e evidência. |
| R4 | Campos têm nomes associados; erros visíveis e associados aos campos inválidos, anunciáveis sem duplicação indevida; foco visível e ordem coerente por teclado incluindo revelar senha, remember, recuperação e envio. Estado do toggle e seu nome são compreensíveis. |
| R5 | Preservar envio, nomes e valores, validação e erros do servidor, limpeza de senha após sucesso, loading/desabilitação, sucesso/redirect e desafio 2FA existentes; sem mudanças em autenticação. |
| R6 | Remember mantém valor selecionado no envio; recuperação aparece somente quando permitida e navega ao destino existente; status fornecido continua visível e semanticamente distinto de erro. |
| R7 | Mudanças em controles/tokens compartilhados exigem avaliação de impacto nos consumidores e alinhamento da contraparte no Design System, com evidência dos dois candidatos; sem presumir cópia compatível. Mudança local de composição deve evitar impacto em outros fluxos de auth. |

A aplicação e o catálogo são evidências, não aprovação de intenção. Não há contrato visual específico de login nem teste de navegador/contraste prévio; diferenças e viabilidade devem ser medidas antes de editar. A revisão e autorização para execução são gates pendentes, não inferidas deste documento.
