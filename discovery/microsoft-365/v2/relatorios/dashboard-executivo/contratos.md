# Dashboard Executivo — Contratos

- **Projeção local:** Licenciamento, Usuários, MFA, Grupos, Secure Score e Configurações, cada qual com publicação e estado próprios. Uso M365 vem da publicação de Licenciamento; não se confunde com login de diretório.
- **Regras:** tendência exige snapshots comparáveis; preço/economia exige base comercial; falha preserva publicação anterior e sua rastreabilidade.

## Integração com o sync coordenado

- **Resultado: projeção local.** Dashboard lê somente publicações/sources states atuais por tenant+conexão; não adiciona chamada Graph.
- Cada bloco mantém `availability`, `coverage`, `freshness`, `reason` e `result_state`; uma fonte falha preserva a última publicação e não converte o KPI em zero.
- O bloco Health Score tem `result_state=unavailable`: IMDO não integra esta entrega e não existe fonte canônica aprovada nem cálculo alternativo para nota, meta ou variação.
- `Usuários ativos M365 (30 dias)` consome somente o agregado publicado de `getOffice365ActiveUserDetail(D30)`; `getOffice365ActiveUserCounts` é elegível apenas para série comparável. `signInActivity` não preenche esse bloco.
- Licenças contratadas/atribuídas/capacidade usam a geração de `LicenseInventoryPublication` da conexão atual; `/subscribedSkus` é coletado pelo domínio de Licenciamento, não pela tela.
- Para template/configuração, requisito `required` indisponível bloqueia gerar; `degradable` só permanece como bloco `unavailable`/`restricted` quando o contrato permitir saída parcial marcada. Dashboard nunca usa outra fonte, tenant ou conexão para preencher a lacuna nem amplia PII em KPI, detalhe ou exportação.
