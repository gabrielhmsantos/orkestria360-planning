# Fixture global de contrato de UI — OneDrive

[`tenant-scenarios.json`](./tenant-scenarios.json) é a única fonte sintética
canônica do tenant OneDrive. Ele contém os oito contratos de superfície em uma
matriz única de cenários globais, relações estáveis e a população `populated`
de 12 contas; não existem fixtures independentes por aba.

Essa autoridade é exclusiva dos cenários sintéticos da homologação histórica
do frontend. As decisões posteriores Q/R/C e o adendo conceitual do
[blueprint](../ui-blueprint.md) definem as semânticas/bindings da integração;
não reinterpretar os números antigos como medidas novas. A fixture não define
payload Microsoft, persistência ou controller agregado. Os contratos/mappings
vigentes por aba e o [relatório backend](../backend-coverage-review.md)
determinam o handoff técnico atual.

Os valores são sintéticos, determinísticos e exclusivos de desenvolvimento,
teste e validação visual. Não representam tenant, pessoa, conteúdo ou dado de
produção e não podem se tornar fallback de uma fonte real.

## Cenários globais

- `populated`: tenant completo e publicado.
- `partial`: mesma população de `populated`, com limitações de disponibilidade
  explicitamente publicadas.
- `empty`: tenant e agregados factualmente vazios em todas as superfícies.
- `unavailable`, `restricted`, `stale` e `failed`: estados do tenant inteiro;
  nunca são selecionados de forma diferente por aba.

## Runtime

O único artefato de runtime é
`orkestria360/resources/js/data/modules/onedrive/fixtures/onedrive-tenant.generated.ts`.
Ele é gerado pela skill, importado pelo fixture harness e não lê o workspace em
runtime:

```sh
node .agents/skills/frontend-contract-fixtures/scripts/validate-global-fixtures.mjs \
  discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json

node .agents/skills/frontend-contract-fixtures/scripts/generate-global-fixtures.mjs \
  --source discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json \
  --runtime-output orkestria360/resources/js/data/modules/onedrive/fixtures/onedrive-tenant.generated.ts
```

Use `--check` no segundo comando para confirmar que o artefato gerado não está
desatualizado. Componentes recebem somente `OnedriveUiDataSource`; não importam
fixture, cenário ou provenance.
