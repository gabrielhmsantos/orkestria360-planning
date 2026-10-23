# APIs — Atividade e Inatividade

## `GET /reports/getOffice365GroupsActivityDetail(period='{D7|D30|D90|D180}')`

Não possui corpo. Requer `Reports.Read.All` (aplicação). No host Graph, sucesso é `302 Found` com `Location` para URL pré-autenticada temporária; a segunda fase responde `200 application/octet-stream`/CSV no host da `Location`, **sem** header `Authorization`. Não registrar URL nem linhas do arquivo.

Colunas documentadas: atualização do relatório, nome/ID do grupo, exclusão, UPN do proprietário, última atividade, tipo, membros/external members, e-mail Exchange, arquivos SharePoint, mensagens Yammer, itens/armazenamento Exchange e SharePoint e período. Nome, ID, UPN e atividade são PII/dados sensíveis. O relatório cobre grupos Microsoft 365; grupos de segurança sem sinal mensurável ficam `unavailable` como evidência direta.

`403` é `restricted`; `302` seguido do arquivo é disponibilidade; não tratar falha de redirect/CSV como lista vazia. `value: []` não se aplica a este endpoint. Faixas e decisão de inatividade são regras internas pendentes, não resposta Graph.

## Homologação de leitura

O host Graph respondeu `302` e a URL temporária respondeu `200 application/octet-stream` sem encaminhamento de `Authorization`. Foram lidos somente os cabeçalhos CSV documentados; nome/ID do grupo, UPN de proprietário e atividade permanecem PII e nenhuma linha foi persistida.
