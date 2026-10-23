# Contratos internos — Custos

```ts
type Money = { amount: number; currency: 'BRL' | 'USD' | string };
type CostProductRow = { skuId: string; billedQuantity?: number; technicalQuantity: number; unitPrice?: Money; monthlyCost?: Money; idleCost?: Money; variancePct?: number };
```

- `GET /subscribedSkus` apenas confirma quantidade/capacidade técnica.
- `commercial_subscriptions`, `subscription_prices`, faturas e orçamento interno são fontes financeiras.
- Propostos: `GET /licenciamento/custos`, `GET /licenciamento/custos/produtos`, `GET /licenciamento/faturas`.
- Respostas financeiras informam `calculationState` (`estimated`, `reconciled`, `incomplete`) e origem do preço.

## Dados comerciais futuros

`commercial_subscriptions` é a tabela interna futura que atrela a assinatura comercial ao `tenant_id` e ao `sku_id`/`sku_part_number` técnico. Na V2 ela permanece vazia. O Assessment fornecerá um CSV preenchido pelo responsável do tenant contendo, no mínimo, `provider`, `provider_subscription_id`, `sku_id`, `quantity`, `unit_price`, `currency`, `discount`, `taxes`, `billing_cycle`, `commitment_term`, `start_date`, `end_date`, `renewal_date`, `auto_renew`, `status`, `source` e `updated_at`.

O CSV futuro deve validar SKU/tenant, múltiplas assinaturas por SKU, erros de linha, idempotência e trilha de importação. Uma integração com Partner Center ou distribuidor poderá criar, atualizar ou reconciliar o mesmo registro. Até a entrada comercial existir, Custos mostra “Aguardando dados comerciais do Assessment”, sem valores fictícios.

## APIs candidatas e viabilização

O Graph não é uma fonte de preço, fatura, imposto, desconto, termo comercial ou renovação. As únicas leituras candidatas para contextualizar custos são:

| Necessidade | Superfície candidata | Permissão de aplicação candidata | Papel |
| --- | --- | --- | --- |
| Capacidade técnica para conciliação | `GET /subscribedSkus` | `LicenseAssignment.Read.All` | Compara unidades habilitadas/consumidas com quantidade faturada. |
| Base de utilização para custo ocioso | Relatórios de uso do Microsoft 365 | `Reports.Read.All` | Alimenta cálculo interno; não retorna custo. |
| Atribuição para rateio | `GET /users?$select=id,department,assignedLicenses,accountEnabled` | `User.Read.All` | Possibilita rateio proposto por usuário/departamento. |

Partner Center e APIs de distribuidores são integrações comerciais futuras a viabilizar; elas não alteram o contrato interno nem tornam dados financeiros do Graph.

## Homologação Graph — `GET /subscribedSkus`

Validado em tenant real em 2026-07-27: `200 OK`, `application/json`. Request sem corpo e sem query string.

```json
{
  "value": [{
    "skuId": "[guid]",
    "skuPartNumber": "POWERAPPS_DEV",
    "capabilityStatus": "Enabled",
    "consumedUnits": 1,
    "prepaidUnits": { "enabled": 10000, "suspended": 0, "warning": 0, "lockedOut": 0 }
  }]
}
```

O retorno confirma capacidade técnica; não contém preço, fatura, imposto, desconto ou renovação.

## Homologação Graph — `GET /users` (rateio)

Validado em tenant real em 2026-07-27: `200 OK`, JSON; 36 itens retornados sem paginação nesta coleta. Request sem corpo:

```http
GET /v1.0/users?$top=100&$select=id,displayName,userPrincipalName,accountEnabled,department,companyName,userType,jobTitle,assignedLicenses,assignedPlans,licenseAssignmentStates,signInActivity
```

```json
{
  "value": [{
    "id": "[guid]", "accountEnabled": true, "department": null,
    "assignedLicenses": [{ "disabledPlans": [], "skuId": "[guid]" }]
  }]
}
```
