# Identidade e Acesso — Decisões

- A primeira implementação não cria, altera nem atribui políticas e funções — decisão do usuário, 2026-08-24.
- A consulta app-only de políticas Conditional Access depende de `Policy.Read.All` e consentimento administrativo; a coleta histórica que funcionou com `Policy.Read.ConditionalAccess` é evidência de tenant, não homologação da permissão mínima atual — documentação Graph atual.
- Clarificação — Q: critério para política crítica nesta trava → A: B; somente uma linha da matriz canônica homologada como `critical`, com baseline `enabled` e regra de comparação, pode ativá-la. Homologação é técnica/de produto, não aprovação operacional (origem: usuário; data: 2026-08-25).
- Clarificação — administrador sem MFA: a trava é `administrador AND isMfaRegistered=false`; `isMfaCapable` é informativo e não substitui registro. A regra não infere se uma política de acesso exige MFA (origem: usuário; data: 2026-08-25).
