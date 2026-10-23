# Viabilização técnica — APIs de Usuários e Contas

## Convenções de integração

O módulo reutiliza a credencial app-only já configurada para Microsoft Graph. Não há payload de escrita nesta V2: as chamadas mapeadas são `GET`, com parâmetros na query string quando aplicável e sem corpo de requisição.

## Reuso de descobertas anteriores

| Evidência anterior | Reuso nesta área |
| --- | --- |
| `licenciamento/consumo/contratos.md` | coleta real de `/users` com `signInActivity`, e CSV de `getOffice365ActiveUserDetail` (incluindo suas colunas). |
| `health-score/HealthScore_Orkestria360_Payloads_Graph_V1.md` | respostas reais para roles, membros de role, MFA, `riskyUsers`, auditoria e relatórios CSV. |
| `imdo/IMDO_Orkestria360_Catalogo_Endpoints_V2.md` | catálogo, fan-out de membros de roles e estados esperados de permissão/licença. |
| `v1/api-mapping.md` | identifica relatórios de usuários ativos como fonte oficial, com coleta backend. |

Os contratos por superfície e os OpenAPI correspondentes estão na respectiva subpasta. Uma resposta `403`, `404`, `400` de licença ou coleção vazia deve ser preservada no diagnóstico; não deve virar contagem zero. Para coleções, `@odata.nextLink` e `@odata.deltaLink` são opacos: devem ser seguidos/persistidos integralmente, sem recompor a query.

## Relatório CSV confirmado

`GET /reports/getOffice365ActiveUserDetail(period='D30')`, com `Accept: text/csv`, retorna download CSV após redirecionamento. A coleta real de 2026-07-27 registrou estas colunas:

`Report Refresh Date`, `User Principal Name`, `Display Name`, `Is Deleted`, `Deleted Date`, licenças e datas de atividade/atribuição de Exchange, OneDrive, SharePoint, Skype for Business, Yammer e Teams, e `Assigned Products`.

UPN, nome e produtos atribuídos são PII e devem permanecer redigidos fora do armazenamento técnico protegido. O `Location` do `302` é uma URL pré-autenticada e temporária: o downloader o segue manualmente, sem encaminhar o bearer token, e não registra a URL, o CSV nem suas linhas; somente metadados estruturais permitidos são persistidos.

## Guarda de PII

O módulo é restrito a gestores e administradores autorizados; colaboradores padrão não têm acesso. Nesta V2 não há diferenciação de visibilidade por campo entre esses perfis autorizados. Ainda assim, o conector mantém armazenamento técnico protegido, retenção definida por fonte, trilha de acesso e proibição de registrar URL pré-autenticada, CSV ou eventos brutos fora da área protegida. Nenhum valor ausente deve ser substituído por dado mascarado ou por zero.
