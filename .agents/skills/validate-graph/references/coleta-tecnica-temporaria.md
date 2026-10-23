# Coleta técnica temporária

## Quando é obrigatória

Execute coleta técnica em conexão customer local quando não houver evidência equivalente para a combinação:

- endpoint normalizado;
- versão e query;
- permissão e condição de licença;
- headers ou comportamento de redirect;
- resposta/envelope esperado.

Não trate falta de método no `GraphClient`, `GraphDataClient` ou coletor de produção como bloqueio. Essa ausência é justamente um caso de validação temporária. Só registre pendência quando a coleta não puder executar por bloqueio técnico real, como credencial configurada ausente, acesso de rede indisponível ou falha reproduzível do ambiente; registre status e motivo sanitizado.

Para Office 365 Management Activity API, classifique a operação como `data-read`
ou `provider-feed-control`. O segundo pode ser documentado e representado no
Simulator quando necessário para viabilizar a leitura do feed, mas a coleta
técnica temporária nunca inicia, altera ou encerra assinatura: ela executa
somente leitores `GET`. Isso também não autoriza mutação de domínio, webhook,
scheduler, persistência ou configuração de aplicação.

## Selecionar o worktree

Informe `ORKESTRIA_APP_PATH` no ambiente do processo PHP. Não há fallback para `../orkestria360`, CWD ou checkout humano. Antes do bootstrap, confirme no ambiente privado do worktree o banco snapshot e a chave compatível; não use `_test` para obter uma conexão que depende de dados existentes. Os testes unitários do helper usam somente o autoloader indicado, sem bootstrap de Laravel ou coleta real.

## Procedimento

1. Crie o script específico em `validate-graph/tmp/`. Ele deve requerer `../scripts/validate-endpoint.php`, declarar somente endpoint sem query, query escalar e headers seguros, e chamar `validate('GET', ...)`. A base versionada inicializa Laravel; o script temporário não pode criar cliente, token, conexão ou chamada HTTP própria.
2. A base descobre em ordem determinística até duas conexões `connected` de customers ativos, entra em `TenantExecutionRunner`, revalida a conexão e usa somente seu `microsoft_tenant_id`. Nunca use tenant global, platform, `.env`, IDs fornecidos pelo payload ou fallback fora do banco local.
3. A base permite apenas `GET` HTTPS para `graph.microsoft.com`, `manage.office.com`, `*.azure.com` e `*.windows.net`; rejeita redirect, credentials na URL, fragmento, query embutida e headers de autenticação. Ela identifica o provider pelo host e obtém token `client_credentials` da configuração do Orkestria com `scope` igual a `{audience}/.default`, sem nunca imprimir o token.
   Para rotas Graph ou Office 365 Management Activity que exigem exclusivamente o identificador do tenant Microsoft da própria conexão, o path pode declarar o placeholder literal `{tenant-id}`; a base o resolve internamente e mantém o valor fora da saída.
   Para validar uma rota parametrizada cujo recurso precisa existir, o path pode usar `{first-domain-id}`, `{first-conditional-access-policy-id}`, `{first-user-id}`, `{first-drive-id}` ou `{first-drive-item-id}`. Os dois últimos resolvem, na mesma conexão, o drive do primeiro usuário e um filho da raiz desse drive, somente por `GET`. A base marca a tentativa como bloqueada quando a cadeia não puder ser resolvida. Nenhum identificador é impresso.
4. A base executa o mesmo `GET` em até duas conexões customer, inclusive para sucesso, consentimento, autorização, licença, rede, throttling ou resposta de contrato. Ela interrompe antes da segunda conexão somente quando a primeira resposta HTTP for `5xx`. Nenhum resultado de uma conexão pode alimentar dados de outra.
5. Imprima somente: posição da conexão (nunca IDs), host/path sem query, audience, status, `Content-Type`, headers seguros, chaves do envelope, schema, campos opcionais, links OData mascarados, páginas, itens lidos, tentativas, `Retry-After` e colunas de arquivo.
   Quando for necessário separar permissão Graph de uma restrição do serviço, o quinto argumento de `validate()` pode listar as app roles exigidas. A base decodifica localmente apenas a claim `roles` do token e imprime as roles requeridas ausentes, sem imprimir token, claims ou identificadores.
6. Ao terminar normalmente, remova o script e a saída em `validate-graph/tmp/`, preservando apenas `.gitkeep`. Em bloqueio técnico real, preserve o arquivo somente para diagnóstico local, sem commit e sem citar conteúdo em `fontes-e-viabilidade.md`, `api.md`, `openapi.yaml` ou `contratos.md`.

### Relatórios Graph em CSV

Para qualquer `GET` em `graph.microsoft.com` cujo request declare `Accept: text/csv`,
`302 Found` com `Location` é o fluxo de relatório, não uma falha JSON. A base aceita
somente `Location` HTTPS em subdomínio `*.office.com`, porta 443, sem credenciais ou
fragmento. Ela faz um segundo `GET` com redirects desabilitados, timeout e limites de
leitura; esse request **não recebe `Authorization` nem qualquer token**.

O CSV é lido em streaming e descartado. A saída contém apenas `column_count`, nomes e
hash do cabeçalho, tipos inferidos (`string`, `integer`, `decimal`, `boolean`, `date`,
`date-time` ou `empty`), nulabilidade, quantidade de linhas, linhas malformadas, BOM e
encoding. Ela nunca contém célula, PII, URL pré-autenticada, token, identificador de
tenant ou arquivo bruto. Os estágios `redirect_missing_location`,
`redirect_location_rejected`, `csv_download_failed`, `csv_invalid` e
`csv_limit_exceeded` distinguem a causa sem expor o dado sensível.

O handoff ao Simulator conserva `302 → download pré-autenticado` como contrato
Microsoft externo, mas atende o runtime local com CSV sintético direto. Cada relatório
validado deve ter fixture sintética ajustada ao schema sanitizado observado e atualizar
somente as superfícies de Discovery que consomem suas colunas, tipos, nulabilidade e
classificação de PII.

Modelo mínimo do arquivo em `tmp/`:

```php
<?php

$validator = require __DIR__.'/../scripts/validate-endpoint.php';
$result = $validator->validate(
    'GET',
    'https://graph.microsoft.com/v1.0/organization',
    ['$select' => 'id'],
);

echo json_encode($result, JSON_THROW_ON_ERROR).PHP_EOL;
```

O `POST` interno para obtenção de token é responsabilidade exclusiva da base; a requisição externa declarada pelo arquivo temporário continua sendo somente `GET`.

## Interpretação

- `200` com schema válido confirma uma observação técnica da resposta, inclusive quando `value` está vazia conforme o procedimento da skill; não mede cobertura de customers.
- Erro de autorização/licença documenta um pré-requisito de acesso, não indisponibilidade genérica do endpoint. A base pode testar até duas conexões, exceto após uma resposta HTTP `5xx` na primeira; não registre nem infira estado operacional delas no discovery.
- Falha transitória, timeout ou bloqueio local não prova que o endpoint seja inviável; documente o bloqueio técnico e mantenha a validação pendente.
- Evidência temporária valida o contrato externo. Ela não autoriza criar uma coleta de produção: a decisão e suas limitações pertencem a `fontes-e-viabilidade.md`; `contratos.md` permanece o contrato semântico a satisfazer.
