# Azure Resource Manager — Subscriptions List

- Método: `GET`
- Host: `management.azure.com`
- Path: `/subscriptions`
- Query: `api-version=2022-12-01`
- Sucesso: `200 application/json` com coleção `value` e `nextLink` opcional.
- Erro relevante: `403 application/json` com `CloudError`.
