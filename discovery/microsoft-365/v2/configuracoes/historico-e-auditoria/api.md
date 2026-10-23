# APIs — Histórico e Auditoria

| Rota | Evidência e contrato externo |
| --- | --- |
| `/auditLogs/directoryAudits?$top=100&$orderby=activityDateTime asc` | Evidência equivalente do discovery de MFA: `GET` em `https://graph.microsoft.com/v1.0`, `200 application/json`, coleção OData de eventos, `AuditLog.Read.All`. A fonte usa watermark temporal, paginação por `@odata.nextLink` opaco e preserva o último estado publicado em falha. |

Os eventos podem conter ator, alvo e valores alterados; o discovery não armazena payload ou identidade real. Office 365 Management Activity API, PowerShell e APIs especializadas não foram validadas aqui por não serem endpoints Graph/Azure `GET` incluídos no escopo técnico desta rodada.

## Uso pela aplicação

O histórico é projeção local da auditoria canônica e das mudanças observadas por coletores. A tela não faz consulta Graph; filtros e exportações consultam somente dados publicados pelo Orkestria.
