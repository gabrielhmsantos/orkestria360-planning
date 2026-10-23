# Uso do simulador

## Dois modos de uso

O Simulator tem dois caminhos complementares; o Dev Proxy não é pré-requisito para consultar uma fixture.

### Modo A — inspeção e Discovery pelo Microcks

Use diretamente a URL local do Microcks para conhecer payloads sintéticos, experimentar JSON ou CSV, testar parser, entender cenários e estudar o contrato durante Discovery e planejamento:

```text
Discovery / planejamento → Microcks → payload sintético
```

Esse é o caminho mais simples e não exige Dev Proxy, CA, configuração de proxy ou troca de host. A URL chamada nesse modo é uma `mockRequest`: ela pertence ao runtime do Simulator e não é contrato Microsoft.

### Modo B — reproduzir a URL Microsoft pelo Dev Proxy

Use o Dev Proxy quando o objetivo for preservar a forma da requisição externa — host, versão, path, query e headers — como `https://graph.microsoft.com/...`, `https://api.security.microsoft.com/...` ou `https://management.azure.com/...`:

```text
URL Microsoft → Dev Proxy → Microcks → payload sintético
```

A `externalRequest` é a chamada real publicada pela Microsoft e é a única forma que pode constar em `api.md`, OpenAPI, specs ou código de produção. Não converta uma URL do Learn em uma rota Microcks. O `mockPath` e `dev-proxy/rewrites.json` fazem o mapeamento interno quando ele for necessário.

## Iniciar o runtime local

Execute os comandos dentro do worktree indicado por `ORKESTRIA_SIMULATOR_PATH`. São necessários Node.js 22+, Docker, Docker Compose e, para o proxy, Dev Proxy instalado separadamente.

Instale dependências em uma cópia nova ou quando `package-lock.json` mudar:

```bash
npm install
```

Para usar os contratos já versionados, inicie o Microcks e importe os artefatos atuais:

```bash
npm run up
```

Não execute `npm run contracts:update` como passo de uso diário. Ele busca fontes Graph remotas e só pertence a uma atualização deliberada da metadata fixada. `npm run contracts:generate` só é necessário depois de mudar fonte, inventário ou fixture.

Para acompanhar ou encerrar o runtime:

```bash
npm run logs
npm run down
```

## Modo A — consultar Microcks diretamente

Com a composição em execução, use a base local do serviço para inspeção e Discovery. Estes exemplos são `mockRequest`, não URLs Microsoft:

```bash
curl http://localhost:8080/rest/Orkestria360+Graph+v1.0/1.0.0/users
curl http://localhost:8080/rest/Orkestria360+Defender/1.0.0/machines
curl 'http://localhost:8080/rest/Orkestria360+Azure+azure-resource-manager-subscriptions-2022-12-01/1.0.0/subscriptions?api-version=2022-12-01'
curl 'http://localhost:8080/rest/Orkestria360+Office+365+Management+Activity+API+v1.0/1.0.0/api/v1.0/00000000-0000-4000-8000-000000000001/activity/feed/subscriptions/content?contentType=Audit.SharePoint'
curl http://localhost:8080/rest/Orkestria360+Graph+v1.0/1.0.0/reports/getOffice365ServicesUserCounts/D30
```

Use o cabeçalho local `X-Orkestria-Simulator-Scenario` para selecionar um cenário anunciado. Ele não autentica nem autoriza ninguém e não deve entrar no cliente de produção.

## Modo B — consumir a URL Microsoft pelo Dev Proxy

O Dev Proxy contém somente rewrites gerados do inventário: não hospeda mocks nem injeta payloads. Ele é instalado separadamente e a porta reservada para o projeto é a **8001**; a 8000 é do Laravel:

```bash
npm run proxy:validate
npm run proxy
```

O comando é contínuo. Em outro terminal, execute o cliente ou `curl` com `HTTPS_PROXY` apontando para a mesma porta. Com o proxy ativo na porta padrão 8001, use a `externalRequest` canônica:

```bash
HTTPS_PROXY=http://127.0.0.1:8001 \
  curl -i https://graph.microsoft.com/v1.0/users

HTTPS_PROXY=http://127.0.0.1:8001 \
  curl -i https://api.security.microsoft.com/api/machines

HTTPS_PROXY=http://127.0.0.1:8001 \
  curl -i 'https://management.azure.com/subscriptions?api-version=2022-12-01'
```

Para uma função de relatório, preserve a sintaxe Graph e desative a expansão de glob do `curl`:

```bash
HTTPS_PROXY=http://127.0.0.1:8001 \
  curl --globoff -i "https://graph.microsoft.com/v1.0/reports/getOffice365ServicesUserCounts(period='D30')"
```

O cabeçalho local `X-Orkestria-Simulator-Scenario` seleciona cenários sintéticos anunciados para a operação. Ele atravessa o proxy, mas não deve ser colocado no cliente de produção:

```bash
HTTPS_PROXY=http://127.0.0.1:8001 \
  curl -i \
  -H 'X-Orkestria-Simulator-Scenario: throttling' \
  https://graph.microsoft.com/v1.0/users
```

Se for necessário trocar de porta, altere o processo e a variável do cliente juntos:

```bash
npm run proxy -- --port 8002
HTTPS_PROXY=http://127.0.0.1:8002 curl -i https://graph.microsoft.com/v1.0/users
```

## Pré-validar cobertura antes de implementar

Esta etapa é obrigatória antes de criar fontes, contratos ou fixtures. Seu objetivo é descobrir se o simulator já atende a chamada do Learn, sem deduzir URLs internas.

1. Registre a forma externa completa da request: host/provedor, versão, método, path, query, headers, media type, consumidor e resposta esperada.
2. Procure o path externo em `contracts/inventory/operations.json`. Por exemplo:

   ```bash
   rg -n -F '"path":"/users"' contracts/inventory/operations.json
   ```

3. Para cada ocorrência, compare `provider`, `host` quando aplicável, `contractId` quando Azure, `operationKind` quando Management Activity, `apiVersion`, `method`, `path`, `query`, `headers`, `mediaType`, `fixture` e a evidência aplicável (`sourceEvidence` ou `validationEvidence`). O inventário pode ter mais de uma entrada para o mesmo path porque consumidores distintos usam queries ou respostas distintas.
4. Inspecione a fixture indicada e o contrato gerado para confirmar que a resposta e o cenário requeridos existem. Não derive uma rota Microcks a partir disso.
5. Execute os guards sem buscar metadata remota:

   ```bash
   npm run inventory
   npm run validate
   ```

6. Se a operação estiver coberta, rode `npm run up`. Para Discovery, inspecione a `mockRequest` diretamente; para validar a forma externa, inicie o proxy e teste a `externalRequest` pelo `HTTPS_PROXY` configurado.

Decisão:

- A combinação completa já está coberta: use a operação existente; não implemente endpoint novo.
- O path existe, mas a forma da request não está coberta: avalie ampliar a operação existente ou registrar uma operação nova para o consumidor distinto. Preserve a evidência dos dois casos.
- O path não existe: só então siga os fluxos de Graph, CSDL ou Azure REST API Specs para implementar a nova superfície. Não envie a URL desconhecida pelo proxy antes de ela estar inventariada e com rewrite gerado.

## Validar a composição

Após `npm run up`, valide os artefatos e o Microcks:

```bash
npm run inventory
npm run validate
npm run smoke
```

`npm run smoke` verifica o Microcks diretamente, mas a IA não precisa conhecer nem reconstruir essas rotas internas. Para validar o caminho que um cliente real percorre, com proxy e CA já confiáveis:

```bash
DEVPROXY_URL=http://127.0.0.1:8001 \
DEVPROXY_CA_FILE=/usr/local/share/ca-certificates/dev-proxy-ca.crt \
npm run smoke:proxy
```

Use o smoke do proxy para cobertura transversal. Para confirmar uma operação específica já inventariada, faça também uma chamada à sua URL canônica pelo proxy e verifique status, media type e corpo esperados.

## Limite entre contrato externo e rota simulada

Use Microcks diretamente para inspecionar e exercitar payloads; não use sua URL para implementar, documentar ou integrar uma chamada do aplicativo. Em particular, `mockPath` é detalhe de runtime e não pertence ao contrato externo.

Exemplo de distinção:

```text
externalRequest Microsoft: GET /reports/getOffice365ActiveUserDetail(period='D30')
mockRequest Microcks:      GET /reports/getOffice365ActiveUserDetail/D30
```

Antes de depurar matching ou importação, verifique `contracts/inventory/operations.json` e rode `npm run validate`. Inspecione o rewrite gerado correspondente em `dev-proxy/rewrites.json` e consulte `npm run logs` ou o console local em `http://127.0.0.1:8080` quando necessário.

Não edite `dev-proxy/rewrites.json` para corrigir um caso. Corrija inventário, fixture ou gerador e rode `npm run contracts:generate` seguido de `npm run up`.

## Certificado e diagnóstico do Dev Proxy

Para HTTPS, a CA local do Dev Proxy precisa ser confiável. Depois de instalar e iniciar o proxy, execute:

```bash
devproxy cert ensure
```

No WSL/Linux, siga o procedimento de exportação e instalação manual de CA no README se esse comando não conseguir atualizar a store. Não use `curl -k` como configuração normal; ele só serve para diagnosticar localmente um problema de certificado.

| Sintoma | Verificação e ação |
| --- | --- |
| Conexão recusada em `127.0.0.1:8080` | Rode `npm run up`; se falhar, veja `npm run logs`. |
| `CONNECT ... 404` | A porta configurada não é o Dev Proxy. Confirme `npm run proxy`, o processo na porta e `HTTPS_PROXY`. |
| Porta `8001` ocupada | Verifique com `ss -ltnp '( sport = :8001 )'`; não use a 8000, que pertence ao Laravel; use `--port 8002` nos dois terminais se necessário. |
| Erro de certificado no `curl` | Confie na CA com `devproxy cert ensure` ou siga o README; não desabilite TLS permanentemente. |
| `devproxy: command not found` | Instale o Dev Proxy separadamente e abra um shell novo/rode `hash -r`; `npm install` não fornece esse binário. |
| URL canônica não retorna o mock esperado | Não tente adivinhar uma URL Microcks. Verifique primeiro se a forma completa está no inventário; então rode `npm run validate`, `npm run contracts:generate` quando houve mudança e `npm run up` para reimportar. |
