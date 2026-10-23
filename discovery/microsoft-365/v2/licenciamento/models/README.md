# Modelos de dados sugeridos — Licenciamento

## Status

Este diretório descreve um **modelo físico sugerido** para o domínio de Licenciamento. Não é fonte de verdade, contrato de API, migration nem autorização para persistir os dados. As superfícies Graph foram homologadas no tenant de teste; integração comercial e limites com demais domínios continuam futuros.

O objetivo é estabelecer uma linguagem comum e evitar que Overview, IMDO, Custos ou Planejamento criem cópias concorrentes de preço, renovação, atribuição ou consumo de licenças.

## Fronteiras de domínio propostas

- Licenciamento é dono do vínculo entre SKU técnico, assinatura comercial, atribuição, consumo, oportunidade e evento.
- Tenant, usuário, grupo, departamento e centro de custo são referências externas; seus modelos não pertencem a este submódulo.
- A Microsoft Graph é a origem homologada para estado técnico, atribuições, grupos, eventos de diretório e relatórios de uso. Os campos recebidos são mapeados por adaptadores; cada tabela abaixo identifica se recebe dados Graph, internos ou comerciais.
- A tabela comercial interna permanece como fonte futura para preço, vigência e renovação. Na V2 ela fica vazia; os dados entrarão posteriormente via Assessment/importação CSV, com possível reconciliação por Partner Center/distribuidor.

## Mapa de relações proposto

```text
tenant ──< tenant_license_skus >── license_products
                              │
                              ├──< tenant_license_sku_service_plans
                              ├──< tenant_license_sku_subscription_refs
                              ├──< license_inventory_snapshots
                              ├──< commercial_subscriptions ──< subscription_price_periods
                              ├──< user_license_assignments >── user (referência)
                              ├──< license_consumption_snapshots ──< license_consumption_snapshot_metrics
                              ├──< license_optimization_opportunities ──< license_exceptions
                              └──< license_events
```

O contrato do arquivo de entrada futura está em [Template CSV comercial](template-csv-comercial.md).

## Convenções físicas

Os tipos abaixo são portáveis para migrations Laravel com SQLite, MySQL ou PostgreSQL. Datas são sempre UTC. Toda FK para `tenant`, `user`, `group`, `department` ou `cost_center` é uma referência externa: a tabela dona não é criada neste submódulo.

| Convenção | Decisão |
| --- | --- |
| Chaves internas | `uuid` como PK (`id`); o gerador deve criar o valor antes da inserção. |
| Chaves Graph | `uuid` quando o Graph entrega GUID; `varchar(255)` para IDs compostos/opacos. Nunca substituir a PK interna. |
| Datas | `timestamp` UTC; `date` somente para datas civis de contrato/relatório. |
| Valores financeiros | `decimal(18,4)` e `char(3)` para moeda ISO. |
| Campos variáveis | `json` para listas/objetos que não participam de filtros frequentes; arquivos brutos ficam fora do banco e são apontados por `*_reference`. |
| Auditoria | tabelas mutáveis usam `created_at` e `updated_at`; snapshots e eventos usam `collected_at`/`detected_at` e são append-only. |
| Exclusão | não usar cascade para fatos, snapshots, eventos, preço ou consumo; preservar histórico. |

Os campos descritos a seguir têm quatro colunas: tipo físico, nulidade, restrição/índice e origem. `NOT NULL` significa necessário para a finalidade da tabela, não que o Graph sempre o forneça; adaptadores devem registrar ausência em campos opcionais e não inventar valores.

## Critérios para homologação futura

1. Confirmar a chave técnica estável do SKU e como tratar mudanças de catálogo. O payload homologado contém `skuId`, `id` composto, `subscriptionIds` e planos; `skuId` é a chave de integração principal.
2. Confirmar quais campos de atribuição, uso e planos estão disponíveis por permissões/tenant. Os endpoints homologados retornaram `licenseAssignmentStates`, CSVs de uso, grupos e auditoria, mas o conector deve continuar tratando campos omitidos e paginação.
3. Definir unicidade comercial quando um SKU possuir múltiplas assinaturas ativas.
4. Definir retenção, periodicidade e granularidade dos snapshots.
5. Validar ownership dos dados de usuário, grupo, departamento, workflow e documentos.
