# Template CSV comercial futuro

## Finalidade e limite de versão

Este é o contrato do arquivo que o Assessment fornecerá ao responsável do tenant para preencher. A importação e qualquer tela de cadastro comercial estão **fora da V2**; este desenho evita que a fase futura crie um formato incompatível com o modelo de Licenciamento.

Cada linha representa uma assinatura comercial de um SKU. Um SKU pode ter várias linhas/assinaturas. O CSV é a fonte de entrada comercial, não altera a fotografia técnica do Graph.

## Arquivo

- Nome sugerido: `licenciamento-comercial-{tenant}-{yyyy-mm-dd}.csv`.
- Codificação UTF-8, separador vírgula, primeira linha como cabeçalho e datas em `YYYY-MM-DD`.
- O Assessment deve pré-preencher `tenant_external_id`, `sku_id`, `sku_part_number` e `product_name` a partir do inventário Graph quando conhecidos; o responsável completa os campos comerciais.
- Uma linha com erro não deve substituir dado válido já importado. A futura importação deverá mostrar prévia, erros por linha e resultado do lote.

## Colunas

| Coluna CSV | Tipo/formato | Obrigatória | Validação e destino |
| --- | --- | --- | --- |
| `tenant_external_id` | UUID | sim | Deve identificar o tenant alvo e coincidir com o contexto do Assessment. Não cria tenant. |
| `sku_id` | UUID | sim | Deve corresponder a um SKU Graph conhecido no tenant ou ser rejeitado para correção. Mapeia `license_product_id`. |
| `sku_part_number` | texto, até 255 | sim | Deve corresponder ao SKU informado; serve de conferência legível. |
| `product_name` | texto, até 255 | não | Nome apresentado ao responsável; não substitui o catálogo técnico. |
| `provider` | texto, até 100 | sim | Fornecedor, revenda ou distribuidor. |
| `provider_subscription_id` | texto, até 255 | não | Identificador externo da assinatura; único por `provider` quando informado. |
| `contract_reference` | texto, até 255 | não | Contrato, pedido ou referência de fatura. |
| `billed_quantity` | inteiro positivo | sim | Quantidade faturada/contratada; não é sobrescrita por `prepaidUnits.enabled`. |
| `unit_price` | decimal não negativo, ponto como separador | sim | Preço unitário efetivo, antes de desconto/impostos separados. |
| `currency` | ISO 4217, 3 letras maiúsculas | sim | Ex.: `BRL`, `USD`. |
| `discount` | decimal não negativo | não | Desconto monetário aplicado à assinatura/período. |
| `taxes` | decimal não negativo | não | Impostos monetários conhecidos. |
| `adjustments` | decimal, positivo ou negativo | não | Crédito, ajuste ou acréscimo pontual. |
| `billing_cycle` | enum | sim | `monthly`, `annual`, `quarterly`, `other`. |
| `commitment_term` | enum | não | `monthly`, `annual`, `multi_year`, `other`. |
| `start_date` | data `YYYY-MM-DD` | não | Início da vigência. |
| `end_date` | data `YYYY-MM-DD` | não | Fim da vigência; se houver início, não pode ser anterior. |
| `renewal_date` | data `YYYY-MM-DD` | não | Data conhecida de renovação. |
| `auto_renew` | booleano | sim | Aceita somente `true` ou `false`. |
| `commercial_status` | enum | sim | `active`, `pending`, `expired`, `scheduled_cancellation`, `cancelled`, `unknown`. |
| `source_reference` | texto, até 500 | não | Referência de documento/evidência comercial. |
| `last_updated_at` | timestamp ISO 8601 UTC | sim | Data declarada da última atualização comercial. |

## Chave de linha e comportamento de importação futuro

A chave preferencial é `tenant_external_id + provider + provider_subscription_id`. Quando não houver ID externo, a importação deve exigir revisão humana e usar uma chave provisória composta por tenant, fornecedor, SKU, ciclo e início de vigência. Reimportar a mesma chave deve atualizar o registro, não duplicá-lo; cada lote mantém quem enviou, quando foi processado, linhas aceitas/rejeitadas e a versão original do arquivo protegida.

## Exemplo

```csv
tenant_external_id,sku_id,sku_part_number,product_name,provider,provider_subscription_id,contract_reference,billed_quantity,unit_price,currency,discount,taxes,adjustments,billing_cycle,commitment_term,start_date,end_date,renewal_date,auto_renew,commercial_status,source_reference,last_updated_at
[tenant-guid],[sku-guid],SPB,Microsoft 365 Business Premium,Distribuidor Exemplo,SUB-123,CTR-456,180,105.00,BRL,5.00,0.00,0.00,monthly,annual,2026-01-01,2026-12-31,2026-12-31,true,active,CONTRATO-456,2026-07-27T12:00:00Z
```
