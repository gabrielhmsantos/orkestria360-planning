# Cobertura e Registro de MFA — Contratos

- Dados: registro/capacidade/métodos do relatório, atributos de `/users`, exceção interna e snapshots.
- Integração: `userRegistrationDetails` e `/users`; exceção e histórico requerem banco Orkestria.

## Integração com o sync coordenado

Fato canônico: fotografia de identidades publicada (`/users`) e snapshot MFA (`userRegistrationDetails`). Decisão: projeção local; a coleta MFA é snapshot periódico dependente da etapa de identidades e correlaciona por `id`. Consumidores: Cobertura, Métodos e Dashboard. A tela não chama Graph para filtro, ordenação, paginação ou agregação. Falha/restrição preserva a publicação anterior e declara `availability`, `coverage`, `freshness`, `reason` e `result_state`; `200 []` é `empty_valid_response`. A etapa mede início/fim, duração, páginas, itens lidos/persistidos, tentativas, throttling/retry e motivo sanitizado. HTTP ocorre antes do staging e da promoção atômica.
