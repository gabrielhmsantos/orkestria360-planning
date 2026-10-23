# API — Histórico e Auditoria

## Office 365 Management Activity API (fora do Graph)

| Item | Contrato |
| --- | --- |
| Provider / host | `office365-management-activity` / `manage.office.com` (worldwide) |
| Versão | `v1.0` |
| Autorização | OAuth 2.0 app-only com role `ActivityFeed.Read`; incluir `PublisherIdentifier` do fornecedor em cada request. |
| Fluxo | `POST /subscriptions/start` (controle do feed), `GET /subscriptions/list`, `GET /subscriptions/content`, `GET contentUri`. Não há outra operação necessária ao escopo OneDrive atual. |
| Query | `contentType=Audit.SharePoint` ou `Audit.General`; `startTime` e `endTime` são usados juntos quando o intervalo é informado e cobrem no máximo 24h, iniciando no máximo 7 dias atrás. `PublisherIdentifier` é obrigatório por regra do projeto para quota dedicada (GUID do fornecedor, não do customer nem da aplicação); a Microsoft documenta quota compartilhada quando omitido. |
| Sucesso | `GET /subscriptions/content`: `200 application/json`, lista de descritores de blob (`contentType`, `contentId`, `contentUri`, `contentCreated`, `contentExpiration`). `GET contentUri`: a documentação descreve eventos em JSON; a execução observada retornou corpo em array JSON com `Content-Type: text/plain; charset=utf-8`. |
| Envelope / paginação | A operação devolve **array JSON**, não envelope Graph `value` nem `@odata.nextLink`; o único cursor é o header `NextPageUri` opaco, que deve ser seguido até não existir. |
| PII | Ator, caminhos de arquivos, IP/dispositivo/localização e conteúdo de evento, quando presentes. |
| Erros | `400 AF20023`, `401`, `403`, `429`; não representam ausência de eventos. |

Fonte oficial: [Office 365 Management Activity API reference](https://learn.microsoft.com/office/office-365-management-api/office-365-management-activity-api-reference?view=o365-worldwide).

O `POST /start` é somente `provider-feed-control` para habilitar consumo do feed;
não é mutação de domínio Orkestria. A coleta técnica temporária permanece
somente GET; separadamente, após autorização operacional explícita, `start`
retornou `200 enabled` para `Audit.SharePoint` e `Audit.General`, sem webhook.
`GET /list` e `GET /content` também retornaram `200`, e um `contentUri` de cada
tipo foi recuperado com `200`. O corpo observado era um array JSON com header
`text/plain; charset=utf-8`, embora a referência documente JSON. Não persistir
nem expor os eventos reais; `contentUri` e `NextPageUri` são URLs opacas. O feed
agrega eventos de datacenters distintos: a ordem de blobs e de eventos não é
garantida.

Depois de iniciado, o serviço pode levar até 12 horas para publicar os primeiros
blobs; não repita `/start` em intervalo menor que 15 minutos. `PublisherIdentifier`
é requisito da API para chamada direta de `start`, `list`, `content` e da URL
`contentUri`.

O Learn define `AF20023` como subscription desabilitada por administrador de
tenant ou serviço. Esse erro foi observado antes da ativação; naquele estado a
API não permitia listar nem recuperar conteúdo. Não existe variante OData que
contorne esse pré-requisito. A habilitação deve fazer parte do lifecycle
operacional aprovado para cada conexão.

O mapeamento campo a campo e a decisão sobre `stop`, webhook/notificações,
`DLP.All` e conteúdos adicionais estão em
[fontes-e-viabilidade.md](fontes-e-viabilidade.md#operações-necessárias-e-operações-condicionais).
