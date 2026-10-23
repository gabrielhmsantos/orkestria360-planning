# Diagnóstico de licenciamento Microsoft Graph

## Contexto

O coletor manual está em `orkestria360/scripts/collect-licensing-graph.php`. Ele inicializa o Laravel e repete a autenticação client-credentials de `app/Support/Microsoft365/GraphClientFactory.php`, sem expor o token, para registrar respostas reais de endpoints de licenciamento.

## Descobertas

- `/subscribedSkus`, `/users`, `/users/delta`, `/groups?$filter=assignedLicenses/any()`, `/groups/{id}/members`, `/auditLogs/directoryAudits`, `/organization` e todos os relatórios citados nos contratos retornaram `200` no tenant em 2026-07-27.
- `users/delta` devolveu `@odata.nextLink`, e campos não preenchidos podem ser omitidos. O consumidor deve continuar até `@odata.deltaLink` e manter reconciliação de atribuições.
- Não havia grupos licenciados; portanto `/groups/{id}/members` não teve um alvo de origem real.
- Apesar da documentação do Graph declarar `licenseDetails` sem suporte a Application, `GET /users/{id}/licenseDetails` retornou `200` com o `ClientCredentialContext` app-only configurado no tenant. Tratar essa divergência como comportamento a revalidar, não como garantia contratual.
- Todos os relatórios foram entregues após redirecionamento como `application/octet-stream`, com corpo CSV; não assuma `Content-Type: text/csv`.
- Os relatórios detalhados incluem PII e dados organizacionais; os exemplos em `contratos.md` preservam o schema, mas redigem esses valores.
- Os modelos conceituais em `discovery/microsoft-365/v2/licenciamento/models/` foram alinhados aos payloads: SKU técnico agora preserva planos e `subscriptionIds`; atribuições retêm estado/data do Graph; consumo modela tipo de relatório, workload e métricas variáveis; eventos preservam correlação, ator e alvo da auditoria.
- Os arquivos de `models/` agora contêm desenho de tabela portável para Laravel: campo, tipo, nulidade, chave/restrição e origem/uso. Não são migrations nem schema executável.

## Ponteiros

- `orkestria360/scripts/collect-licensing-graph.php`
- `discovery/microsoft-365/v2/licenciamento/*/contratos.md`
