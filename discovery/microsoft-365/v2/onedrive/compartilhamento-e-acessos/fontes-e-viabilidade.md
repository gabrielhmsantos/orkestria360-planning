# Fontes e viabilidade — Compartilhamento e Acessos

## Residual local R2

A regra aceita usa permissão atual e evidência legítima de revisão/autorização
para acesso restrito de leitura; prazo<=30 dias é requisito quando externo.
Sem registro de revisão ou contexto obrigatório, não classificar como Baixo.
Informativo por encerramento exige estado atual comprovado sem exposição
remanescente, não somente evento antigo ou campo de expiração omitido. Reusar
as fontes selecionadas, mantendo data, revisão de regra e coverage próprias.

## Abrangência inicial definida

A resolução Q5 define todos os drives empresariais elegíveis como universo do
inventário base. A coleta de permissões parte dos itens/pastas com evidência de
compartilhamento, incluindo vínculo de ancestrais quando confirmado, e declara
candidatos/concluídos e limitações de retorno do chamador. Falta de faceta,
campo de link ou prova de identidade não vira permissão inexistente. Sem
resolver população/páginas, publicação parcial não afirma exposição global
zero. O feed de eventos e os snapshots de permissões têm coberturas próprias.

## Permissões de item

`GET /users/{user-id}/drive/items/{item-id}/permissions` é **leitura complementar** ao delta de conteúdo: o delta encontra o item e a permissão descreve exposição, papel, destinatário, link, escopo e expiração. Não é permitido deduzir compartilhamento de um item sem permissão publicada.

A coleta técnica da variante da raiz (`/users/{user-id}/drive/root/permissions`) observou `200 application/json` com `value`, `id`, `roles`, `shareId` e `grantedToV2`; a segunda tentativa retornou `404 ResourceNotFound` sem mysite. Ela confirma a família de permissões, mas não mede os itens compartilhados de qualquer customer. A coleta de produção deve consultar somente itens selecionados pelo inventário/delta, paginar `@odata.nextLink` quando presente e preservar campos opcionais como nulos.

A rota literal por item foi revalidada com um item resolvido apenas por GET no mesmo drive: `200 application/json`, envelope `value` e campos de permissão. A anotação anterior de `inheritedFrom` não pode sustentar o mapping empresarial: a [referência Microsoft](https://learn.microsoft.com/en-us/graph/api/resources/permission?view=graph-rest-1.0) declara que OneDrive for Business e bibliotecas SharePoint não retornam essa propriedade. Sua ausência não prova concessão direta nem ausência de herança; herança exige evidência complementar comprovada. A ausência de item na outra tentativa foi bloqueio de parâmetro, não coleção vazia.

`Files.Read.All` ou escopo de aplicação superior, com consentimento administrativo, é pré-requisito documentado. Links e destinatários podem conter PII e URLs de compartilhamento; normalizar e publicar somente o necessário à superfície.

A lista pode ser parcial conforme o chamador: proprietário recebe todas as permissões; outro chamador pode receber somente permissões aplicáveis a si. `shareId` e `link.webUrl` podem ser omitidos se a identidade não puder criar a permissão correspondente. Portanto, ausência desses campos não é evidência de link não compartilhado. O `200` sanitizado com esses valores confirma apenas que a resposta pode publicá-los. [Documentação oficial](https://learn.microsoft.com/graph/api/driveitem-list-permissions?view=graph-rest-1.0).

## Cobertura sintética

O simulador inclui uma permissão sintética de item com link `anonymous`, papel `write` e expiração, além de uma página vazia, para testar classificação; não representa configuração nem exposição real.

## A6 — distribuição exclusiva C1 aceita A

O [pacote C1 aprovado](../backend-defaults-e-clarificacoes.md#c1--partição-do-compartilhamento-aceita-a)
seleciona arquivos atuais únicos por `(driveId,itemId)` no inventário completoQ5.
Pastas continuam contexto/hierarquia e podem aparecer em eventos; não são
unidades do donut. Excluir tombstones, cópiasPHL e duplicações remotas.

Resolver as concessões atuais necessárias e classificar na primeira categoria
confirmada: `link.scope=anonymous` → Anônimo; destinatário externo factual →
Convidado externo; identidade de aplicação explicitamente concedida ao item →
Aplicativo/Integração; `link.scope=organization` → Organização;
`link.scope=users` ou concessão restrita a identidades internas conhecidas →
Pessoas específicas. Deduplicar o arquivo antes de contar a categoria. O app
criador do link não comprova concessão de acesso ao próprio app.
`existingAccess` não concede acesso novo por si; avaliar permissões subjacentes.
Acesso do proprietário sozinho não comprova compartilhamento. Não classificar
grupo não expandido como interno nem inferir herança pela ausência de
`inheritedFrom`, que não é retornado para bibliotecas empresariais.

Campos/grupos/concessões necessários não resolvidos deixam o arquivo fora da
composição com cobertura explícita, sem default em Pessoas específicas.
Denominador = arquivos compartilhados classificados, soma das cinco categorias
= denominador. O KPI conta arquivos únicos com cobertura própria; quando ambas
as populações forem íntegras, o total do donut coincide com o KPI. Percentuais
seguem o contrato, sem corrigir arredondamento artificialmente. População
avaliada vazia permite zero; falta de evidência não. A ordem não altera riscoR2,
permissões ou o significado de evento histórico. Este é um mapping local das
leituras existentes, sem nova API externa ou operação do Simulator.

`sharingRecords` reutiliza [audit-operations-v1](../historico-e-auditoria/fontes-e-viabilidade.md#a5--normalização-canônica-audit-operations-v1),
mantendo a operação original e o contexto do instante. Não deduplicar dois
eventos distintos como um arquivo no total de auditoria: são unidades próprias.

## Fatos derivados localmente e histórico de exposição

A estratégia default reutiliza o feed e as [cadências/publicações do módulo](../fontes-e-viabilidade.md#estratégia-operacional-default-de-leitura):
permissões a cada 6h, fotografia diária e último snapshot íntegro de cada mês,
com 400 dias/13 meses de retenção aprovados. Estado corrente significa estado
observado em asOf, não garantia de tempo real. Avaliar expiração quando
explicitamente publicada; uma permissão expirada não prova ausência de outras
permissões. Links omitidos pelo chamador não significam não compartilhado.

A classificação usa [default-v1 aceito](../backend-defaults-e-clarificacoes.md#pacote-comum-de-classificação-default-v1),
com contexto desconhecido sem classificação. Eventos criados/removidos no
período e permissões presentes no snapshot são publicações distintas. Não usar
o contador de criação para fabricar exposição atualmente ativa ou fechar gaps
de histórico. Cada comparação exige população e versão de regra compatíveis.

- Tipo de compartilhamento, modo de acesso, convidados/domínios, links sem
  expiração e distribuição de risco são normalizações e agregações locais das
  permissões publicadas. Regras de risco usam somente as evidências confirmadas
  nas decisões (por exemplo, link anônimo com edição, domínio bloqueado ou
  conteúdo sensível exposto); sem evidência suficiente o item fica não
  classificado, nunca “baixo risco”.
- `sharingRecords` dos últimos 30 dias deve refletir eventos de
  `Audit.SharePoint`/`Audit.General`, normalizados por `CreationTime` e operação.
  A permissão atual é contexto da exposição presente, não histórico do evento;
  somente correlacionar os dois quando houver chave de item/compartilhamento
  inequívoca. Atributos ausentes no evento ou na permissão permanecem nulos.
- KPIs D30 e `externalTrend` de 12 meses são snapshots/rollups locais. A API de
  permissões só descreve a leitura corrente; ela não reconstrói a exposição
  dos meses anteriores. Guardar publicações mensais tenant-scoped de permissões
  e convidados para formar a série; até existir histórico completo, declarar
  cobertura parcial. Eventos de criação/remover link não substituem a contagem
  de links que continuam ativos em cada mês.
- Alertas, recomendações, severidade, participação por domínio e seus vínculos
  `relatedRecordIds` são derivados por regras locais versionadas sobre o recorte
  publicado. São somente leitura; não removem links nem alteram permissões.
