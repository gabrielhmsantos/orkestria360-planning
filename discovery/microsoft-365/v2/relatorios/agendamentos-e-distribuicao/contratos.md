# Agendamentos e Distribuição — Contratos

- Capacidade futura exige fila idempotente, timezone, retenção, expiração, criptografia, destinatários, retry e evento de auditoria local.
- Nenhuma operação Microsoft ou e-mail é autorizada por este discovery.

## Integração com o sync coordenado

- **Resultado: projeção local.** Agendamentos futuros consultam somente manifesto/publicação local; não iniciam sync, não usam outra conexão e não mudam os source states Microsoft.
