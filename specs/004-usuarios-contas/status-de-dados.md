# Usuários e Contas — estado de dados por tela

**Revisado em:** 2026-08-03
**Base:** última geração publicada do tenant configurado, coletores efetivamente chamados por `UsersAccountsSynchronizer` e projeções Inertia atuais.

## Fotografia publicada

| Fonte | Estado atual | O que significa |
|---|---|---|
| Microsoft Graph `/users` | `available` / `fresh` | Diretório publicado: 36 identidades, 35 com `accountEnabled=true`, 1 com `accountEnabled=false` e nenhuma com status desconhecido. |
| Microsoft Graph `userRegistrationDetails` | `available` / `fresh` | Registros MFA publicados e associados às identidades da geração. |
| Microsoft Graph `signInActivity` | `restricted` | O campo não foi retornado na sincronização atual; não há classificação de inatividade confiável. |
| Funções administrativas | `restricted` | O coletor consultou o endpoint real, que respondeu `400 AadPremiumLicenseRequired`: o tenant precisa de Microsoft Entra ID P2. |
| PIM, risco e auditoria | sem estado publicado | Há métodos Graph preparados, mas não há coletor desses dados no fluxo atual. |
| Catálogo de Saúde | `unavailable` | Regras, severidades, fórmula, pesos e exceções não foram aprovados. |
| Workflow de Ciclo de Vida | `coming_soon` | Não há dados nem operações de ciclo de vida nesta V2. |

> `accountEnabled=false` significa **conta desabilitada para login no diretório**. Não representa, por si só, bloqueio temporário por risco, Conditional Access ou lockout.

## Dashboard Executivo

### Disponível

- Total de identidades, contas habilitadas, **contas desabilitadas**, convidados externos, distribuição por tipo e departamento, todos da fotografia `/users`.
- Contagem de identidades sem MFA, quando `userRegistrationDetails` está publicado.
- Bloco de cobertura MFA com a fonte declarada.

### Pendente ou restrito

- Inatividade: depende de `signInActivity`, hoje `restricted`.
- Administradores e funções: o coletor está ativo, mas o endpoint requer Microsoft Entra ID P2 no tenant atual; a tela exibe essa restrição, sem total inventado.
- Risco: depende do coletor de Identity Protection, inexistente no fluxo.
- Últimos eventos e alertas de auditoria: depende do coletor de auditLogs, inexistente no fluxo.

## Diretório de Usuários e perfil

### Disponível

- Busca, filtros por nome, tipo e departamento, paginação e perfil contextual.
- Nome, UPN, tipo, `accountEnabled`, departamento, cargo, localização e atributos da fotografia `/users`.
- Total, habilitadas, **contas desabilitadas**, convidados e status individual/contagem MFA.
- Atribuições de licença armazenadas no snapshot e exportação CSV do Diretório.

### Pendente ou restrito

- Filtros por status, MFA e licença previstos na especificação ainda não estão expostos na interface.
- Memberships de grupos: método Graph existe, mas não há coletor.
- Administradores/funções e risco: sem coletores e sem fonte publicada.
- O perfil ainda não projeta MFA, atividade, privilégios ou auditoria individuais; só mostra a fonte básica e os campos internos indisponíveis.

## Saúde das Contas

### Disponível

- Catálogo inicial de achados: conta desabilitada licenciada, risco, inatividade crítica, MFA, licença Member, cadastro, gestor, UPN e Usage Location.
- Distribuição, severidade e ranking de categorias usam a geração publicada e não convertem fonte restrita em zero.

### Pendente ou restrito

- Score composto, triagem por usuário, evolução de achados e recomendações continuam `unavailable` até regras de tratamento, fórmula e evidências complementares aprovadas.

## Atividade e Inatividade

### Disponível

- A métrica de contas desabilitadas vem da fotografia `/users`, independente de atividade.
- Estrutura de filtros, classificação, paginação e links de investigação já existe para quando a fonte for publicada.

### Pendente ou restrito

- A fonte `signInActivity` está `restricted` na geração atual; por isso não há totais de ativas/inativas/nunca usadas/licenciadas sem uso.
- Tendência histórica de atividade ainda não é projetada, mesmo quando a fonte estiver disponível.

## Contas Privilegiadas

### Disponível

- A fonte MFA está disponível e pode enriquecer uma identidade privilegiada quando houver função publicada.

### Pendente ou restrito

- Funções administrativas permanentes: o coletor está ativo, mas a resposta real foi `AadPremiumLicenseRequired`; a tela mostra a exigência de Microsoft Entra ID P2, sem concluir que não existam funções.
- Elegibilidades PIM: o método Graph existe, mas não há coletor; não se pode concluir que não existem elegibilidades.
- Risco e atividade administrativa: sem coletores próprios.
- A tela ainda precisa receber um `SourceBlock` específico para funções permanentes, para evitar que uma tabela vazia seja lida como ausência de privilégios enquanto não há coleta.

## Convidados e Usuários Externos

### Disponível

- Convidados B2B da geração `/users`, `externalUserState`, situação `accountEnabled`, paginação, filtro por domínio e link ao perfil.
- Contagem de licenças, domínio de `mail`, comparativos mensais dos sete KPIs e painéis de status, tendência e Top 10 de domínios quando suas fontes estão disponíveis.

### Pendente ou restrito

- Atividade de convidados compartilha `signInActivity`; sem ela, inatividade, nunca acesso, distribuição e tendência ficam restritos.
- Distribuição B2B exige uma geração que já possua `externalUserState`; snapshots anteriores não inferem aceite a partir de `null`.
- Patrocinador, classificação interna/técnica, revisão de acesso e insights internos não têm fonte aprovada.

## Ciclo de Vida

### Disponível

- Etapas, capacidades e ações planejadas, explicitamente sem operação.

### Pendente ou restrito

- Solicitações, tarefas, SLAs, indicadores, aprovação, bloqueio, revogação e workflows estão todos `coming_soon` e não acionam o tenant.

## Histórico e Auditoria

### Disponível

- A sincronização coleta `auditLogs/directoryAudits` e a primeira página de até 100 eventos recentes de `auditLogs/signIns`; os eventos ficam em `DirectoryAuditEvent` e `SignInEvent` por até 12 meses.
- A consulta local combina as duas fontes, e os filtros e a exportação CSV do Histórico/Auditoria estão disponíveis.

### Pendente ou restrito

- A extensão de retenção, coleta incremental e volume acima dos 100 eventos recentes depende de validação com o sponsor.
- A fonte de auditoria deve continuar a diferenciar coleção vazia válida, restrição de permissão/licença e indisponibilidade temporária.

## Próxima ordem recomendada

1. Publicar coletores isolados de funções permanentes/PIM, risco e auditoria, cada um com orçamento de execução e `IdentitySourceState` próprio.
2. Habilitar os filtros previstos do Diretório (status, MFA e licença) usando a fotografia local.
3. Projetar totais já disponíveis para Convidados e SourceBlocks explícitos para Privilégios e Auditoria.
4. Só iniciar indicadores de Saúde após a aprovação formal do catálogo normativo.
