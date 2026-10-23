# Discovery — Microsoft 365 / Usuários e Contas

## Objetivo

Permitir que o administrador do tenant compreenda quem possui acesso, o estado e o risco das identidades, as pendências de governança e o andamento do ciclo de vida, sem executar mudanças no tenant nesta versão de discovery.

## Escopo e superfícies

1. Dashboard Executivo — leitura consolidada da saúde das identidades.
2. Diretório de Usuários — consulta, filtros e perfil contextual de cada identidade.
3. Saúde das Contas — não conformidades e qualidade cadastral.
4. Atividade e Inatividade — uso, inatividade e contas licenciadas sem uso.
5. Contas Privilegiadas — postura de identidades administrativas.
6. Convidados e Usuários Externos — governança B2B e de identidades externas.
7. Ciclo de Vida — acompanhamento de onboarding, offboarding e revisão de acessos.
8. Histórico e Auditoria — eventos de diretório, autenticação e ações do Orkestria.

## Limites da V2

- A referência descreve ações que alteram o tenant, mas requer autorização, confirmação, trilha de auditoria e segregação; elas permanecem `coming_soon` até haver escopo operacional aprovado.
- Risco de identidade depende de Microsoft Entra ID P2; atividade de entrada depende de Entra ID P1/P2 e `AuditLog.Read.All`.
- Dados de RH, patrocinador, classificações de contas técnicas, exceções e retenção de histórico dependem de dados internos ou integrações ainda não confirmadas.
- Números e pessoas exibidos nas imagens são ilustrações do sponsor, não dados a reproduzir.

## Princípios e dependências

- Microsoft Graph sustenta o estado atual; snapshots e eventos internos preservam a evolução além da retenção disponível no serviço.
- Ausência de dado ou permissão é exibida como `unavailable` ou `restricted`, jamais como zero.
- Ações recomendadas orientam investigação; não afirmam que uma alteração foi executada.
- Dados pessoais e de acesso exigem visibilidade compatível com autorização do usuário autenticado.

## Decisões transversais

- A navegação interna mantém a ordem das oito superfícies observada no Word e nas telas do sponsor.
- O shell do módulo Microsoft 365, cabeçalho, navegação por abas, cards, tabelas, gráficos, filtros e indicadores de atualização são padrões estruturais das referências.
- Cada bloco que consome dados deve poder declarar origem, atualização e frescor; o detalhe do contrato permanece conceitual neste discovery.

## Models

O módulo necessita de entidades persistentes para classificações, achados, solicitações e tarefas de ciclo de vida, snapshots e eventos próprios. Veja [models/modelo-conceitual.md](models/modelo-conceitual.md).

## Estado

Discovery pronto para futura formalização: há superfícies, fontes e limites identificados. A futura Spec deve decidir permissões de produto, frequência de sincronização, política de retenção, cálculo normativo do score e quais ações transacionais serão habilitadas.
