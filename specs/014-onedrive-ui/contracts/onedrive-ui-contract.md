# Contrato de integração da UI — OneDrive

## Propósito

Definir o seam semântico permanente da UI para a feature `014-onedrive-ui`. Ele permite que a UI seja construída e verificada agora com fixtures aprovadas e que, depois, o adapter de fixtures seja removido em favor de uma fonte aprovada, sem transformar collector, persistência ou integração Microsoft em requisito desta entrega.

Não é contrato HTTP, banco de dados ou Microsoft Graph. Não autoriza endpoints, mutações, refresh, exportação, relatórios ou dados reais.

## Consumidor e implementações

```text
pages/modules/onedrive.tsx
        │
        ▼
OnedriveUiDataSource (contrato TypeScript)
        │
        ▼
OnedriveSurfaceEnvelope<TProjection>
        │
        ▼
components/modules/onedrive/*-tab.tsx
```

Tabs e página conhecem somente esse contrato. Componentes não importam arquivos em `fixtures/`, não escolhem cenário ou fallback e não inferem estados a partir de campos ausentes.

## Operações permitidas

| Operação | Entrada | Resultado | Observação |
|---|---|---|---|
| `getSurface` | superfície | envelope tipado | leitura semântica; a UI não conhece a origem da projection |

Nenhuma operação é mutável. O seam não possui `scenario`, `getDefaultScenario`, `listScenarios`, `refresh`, `retry`, `export`, `update`, `delete`, `share`, `retain` ou comando administrativo.

## Regras do envelope

- `surface` deve ser uma das oito chaves na ordem especificada no [modelo](../data-model.md).
- `availability` chega inalterada à camada de apresentação. Estados de bloco continuam dentro da projection quando o contrato assim define.
- `data: null` é válido e é renderizado de acordo com a disponibilidade, não convertido em objeto/coleção artificial.

## Harness transitório de fixtures

Durante esta feature, a composição de desenvolvimento/teste usa um `OnedriveFixtureHarness` separado do seam. Ele mantém o catálogo de fixtures, `defaultScenario`, listagem de cenários, seleção explícita, scenario override e provenance/versão de fixture. A partir dessa configuração, o harness instancia `OnedriveFixtureDataSource`, que implementa apenas `OnedriveUiDataSource` para a página.

```text
fixtureHarness (catálogo + seleção + override + provenance)
        │
        ▼
OnedriveFixtureDataSource configurado ──implements──► OnedriveUiDataSource
```

Cenário desconhecido falha explicitamente dentro do harness e nunca recai em `defaultScenario` ou payload semelhante. Esse harness não é rota, endereço de domínio, controle de produto ou fallback de uma fonte real; ele e as fixtures runtime são removíveis quando um adapter real aprovado passar a implementar o seam.

## Garantias para um adapter futuro

Um adapter futuro somente poderá substituir `OnedriveFixtureDataSource` se:

1. implementar `getSurface(surface)` e preservar as oito chaves/superfícies, sem conhecer fixtures ou cenários;
2. entregar projection equivalente para cada contrato de discovery, incluindo campos nulos/opcionais e estados por bloco;
3. preservar os seis valores de disponibilidade (`available`, `partial`, `unavailable`, `restricted`, `stale` e `failed`), além de resultados factuais vazios em cenários `available`, com seus `asOf`, motivo e campos afetados quando existentes;
4. não converter indisponibilidade em zero, vazio ou sucesso;
5. for aprovado em artefato próprio para fontes, autorização, tenant boundary, retenção e observabilidade.

Essas condições não criam esse adapter, nem pressupõem que ele exista para concluir esta feature.

## Referências normativas

- [README de readiness reconciliado](../../../discovery/microsoft-365/v2/onedrive/README.md)
- [UI Blueprint](../../../discovery/microsoft-365/v2/onedrive/ui-blueprint.md)
- [Overview das fixtures](../../../discovery/microsoft-365/v2/onedrive/fixtures/README.md)
- Os oito contratos e fixtures enumerados na [rastreabilidade do plano](../plan.md#Mapeamento-de-entrega-e-rastreabilidade)
