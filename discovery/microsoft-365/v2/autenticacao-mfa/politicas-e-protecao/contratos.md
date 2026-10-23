# Políticas e Proteção — Contratos

- Dados: política de métodos, forças, CA relevante, Security Defaults, MFA legado, exceções e coleta.
- Integração: políticas Graph e fonte interna de exceções; permissões Policy descritas no DOCX.

## Integração com o sync coordenado

Fatos: `GET /policies/authenticationMethodsPolicy`, `GET /policies/authenticationStrengthPolicies`, `GET /identity/conditionalAccess/policies` e `GET /policies/identitySecurityDefaultsEnforcementPolicy`. Decisão: novas coletas snapshot periódicas justificadas porque suas configurações não existem nas projeções atuais; as quatro foram tecnicamente validadas. `authenticationStrengthPolicies` requer `AuthenticationStrength.Read.All` e não aceita `$top`; a coleta chama a rota sem esse parâmetro. Cada fonte é independente, conserva a última fotografia em falha/restrição e publica metadata de disponibilidade/cobertura/frescor/razão/resultado. IDs de grupos são a correlação com identidades/grupos publicados. A tela nunca chama Graph; cada etapa deve medir páginas, itens, tentativas, throttling/retry e motivo sanitizado, coletar antes do staging e promover atomicamente.
