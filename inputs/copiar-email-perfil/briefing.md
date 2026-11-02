# Briefing — Copiar e-mail na tela de Perfil

## Objetivo

Adicionar uma ação **Copiar e-mail** junto ao campo de e-mail da página de Perfil do usuário, permitindo copiar o endereço exibido para a área de transferência sem precisar selecioná-lo manualmente.

Esta é uma demanda pequena de interface da **Application**. O objetivo desta entrada é gerar um planejamento SDD; **não implementar a funcionalidade durante o planejamento**.

## Contexto existente

- Repositório de produto: `gabrielhmsantos/Orkestria360`.
- Tela já existente: `resources/js/pages/user-settings/profile.tsx`.
- A tela possui um formulário Inertia para editar nome e e-mail, com botão **Salvar** e mensagens de validação.
- O projeto já possui primitivas visuais e convenções de acessibilidade; consultar a Application e o repositório `gabrielhmsantos/orkestria360-design-system` como referências, nos commits efetivamente observados.
- Esta entrega é independente do planejamento anterior da tela de login.

## Comportamento desejado

1. Na página de Perfil, apresentar uma ação identificável como **Copiar e-mail**, visualmente associada ao campo de e-mail existente.
2. Ao acioná-la, copiar exatamente o valor **atualmente visível no campo**, inclusive se tiver sido editado mas ainda não salvo. A ação de copiar não deve salvar ou modificar o perfil.
3. Quando a cópia for confirmada, exibir feedback discreto e acessível em português.
4. Quando o campo estiver vazio ou a área de transferência estiver indisponível, a interface não deve afirmar sucesso; deve tratar o caso com feedback adequado ou indisponibilidade explícita da ação.
5. A ação deve funcionar por teclado e ponteiro, ter nome acessível, foco visível e não submeter acidentalmente o formulário.
6. Preservar integralmente a edição de nome/e-mail, validações, erros, estados de processamento e o fluxo de exclusão da conta.
7. Manter responsividade e consistência com os temas claro e escuro e os componentes já adotados.

## Limites da entrega

- Priorizar a menor mudança frontend que atenda ao comportamento.
- Não alterar backend, endpoints, rotas, modelos, migrations, banco de dados, autenticação, autorização ou regras de persistência.
- Não criar uma nova biblioteca de clipboard, abstração compartilhada ou componente de Design System sem necessidade comprovada.
- Não copiar dados adicionais nem enviar o e-mail para serviços externos.
- Evitar introduzir estilos ou componentes paralelos aos padrões existentes.

## Critérios de aceite para planejar e validar futuramente

- O botão fica disponível no contexto correto e copia exatamente o e-mail visível no momento do clique.
- A cópia bem-sucedida e a falha de cópia são diferenciadas sem mensagens enganosas.
- Edição não salva permanece não salva após copiar; o botão **Salvar** conserva a função original.
- Campo vazio, permissão de clipboard negada e indisponibilidade da API possuem comportamento definido.
- Navegação por teclado, rótulo acessível, indicador de foco, leitores de tela quando aplicável, viewport estreita e temas claro/escuro são cobertos.
- O planejamento identifica testes adequados à stack e às instruções existentes, incluindo typecheck/lint/build e regressões pertinentes ao perfil.

## Entrega esperada nesta fase

Produzir discovery, requisitos verificáveis, decisões, plano de implementação e manifesto com proveniência/hashes, seguindo os contratos vigentes do Planning.

Os revisores independentes devem avaliar a solução mínima, a preservação do formulário, a acessibilidade e a consistência dos artefatos. **Não realizar a implementação do produto nesta fase.**
