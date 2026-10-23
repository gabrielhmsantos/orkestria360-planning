# APIs — Relatórios Operacionais

## Evidência equivalente já versionada

As rotas abaixo foram homologadas em tenant real em 2026-07-27 no discovery de Licenciamento, para a mesma combinação Graph `v1.0`, app-only, `Reports.Read.All`, período `D30`, `Accept: text/csv` e download CSV após redirect. Logo são **endpoints viáveis** como fonte canônica de uso; esta superfície não as chama diretamente.

| Rota | Status e formato observados | Campos/PII relevantes |
| --- | --- | --- |
| `GET /reports/getOffice365ServicesUserCounts(period='D30')` | Graph responde `302`; o `GET` da URL pré-autenticada devolve `200 application/octet-stream` CSV | `Report Refresh Date`, ativos/inativos por workload, `Report Period`; não contém identidade individual. **Coletor/publisher existente.** |
| `GET /reports/getOffice365ActiveUserCounts(period='D180')` | Validação técnica de 05/09/2026: `302` seguido de `200 application/octet-stream` CSV | contagens diárias Office 365/Exchange/OneDrive/SharePoint/Teams e período. O coletor de Licenciamento publica apenas a série agregada Office 365, append-only por data do relatório e `reportRefreshDate`. |
| `GET /reports/getOffice365ActiveUserDetail(period='D30')` | Validação técnica de 05/09/2026: `302` seguido de `200 application/octet-stream` CSV | UPN, nome, usuário excluído, licenças/produtos e atividade por workload — PII. O coletor publica somente a contagem agregada D30; CSV e PII são descartados. |
| `GET /reports/getEmailActivityUserDetail(period='D30')` | `302` seguido de CSV | `Send Count` por usuário; a aplicação soma somente este campo e descarta as linhas. |
| `GET /reports/getTeamsUserActivityUserDetail(period='D30')` | `302` seguido de CSV | `Meeting Count` por usuário; publica participações, não reuniões únicas. |
| `GET /reports/getSharePointSiteUsageSiteCounts(period='D30')` | `302` seguido de CSV | Última linha `All`, campo `Active`, publica sites ativos. |
| `GET /reports/getSharePointSiteUsageStorage(period='D30')` e `getOneDriveUsageStorage(period='D30')` | `302` seguido de CSV | Última linha `All`; converte bytes para MB inteiros e não persiste bytes. |

Cada `GET` Graph bem-sucedido recebe `302 Found` com `Location` de curta duração para download pré-autenticado; o Graph **não** devolve o CSV como `200` nesse mesmo endpoint. O `200 application/octet-stream` ocorre apenas no segundo `GET` à URL opaca. O destino é tratado como não confiável, validado antes da requisição e recebe **zero** headers `Authorization`; a URL não é persistida. Não há envelope OData, `nextLink`, `deltaLink` ou corpo JSON.

`getOffice365ActiveUserDetail` aceita somente os períodos `D7`, `D30`, `D90` e `D180` nesta integração. A variante oficial por `date` não faz parte deste contrato V1.

`Reports.Read.All` requer consentimento administrativo. Dados de usage report são sensíveis; identificadores podem estar anonimizados pela configuração do tenant e não são reconstruídos.

Erros `401`, `403`, `404` e `429` nunca representam contagem zero. `401`/`403` sem limitação confirmada permanecem `unavailable`; somente uma exigência de licença/acesso comprovada é `restricted`. Em `429`, respeitar `Retry-After`; reports CSV possuem limite documentado de 14 requisições por app+tenant em 10 minutos.

## Referências oficiais

- [getOffice365ServicesUserCounts](https://learn.microsoft.com/graph/api/reportroot-getoffice365servicesusercounts?view=graph-rest-1.0)
- [getOffice365ActiveUserCounts](https://learn.microsoft.com/graph/api/reportroot-getoffice365activeusercounts?view=graph-rest-1.0)
- [getOffice365ActiveUserDetail](https://learn.microsoft.com/graph/api/reportroot-getoffice365activeuserdetail?view=graph-rest-1.0)

## Uso pela aplicação

Resultado: **projeção local** para a tela. A fonte canônica é a publicação de Licenciamento, com estratégia `reportRefreshDate`. Services User Counts, Active User Detail D30, detalhes de e-mail/Teams, sites e armazenamento são famílias independentes; uma falha preserva a última publicação válida das demais. Active User Counts D180 mantém apenas a série Office 365 agregada e só habilita tendência após duas atualizações comparáveis. Relatórios só consulta publicações e snapshots locais; não repete redirect, CSV ou agregação no request da tela.
