# Health Score Orkestria360 - Coletor Tecnico Graph V1

## Finalidade

Este documento descreve o componente coletor da Microsoft Graph usado no Health Score V1.

Sua funcao e executar a malha de coleta definida para o modelo e devolver um dataset bruto, consistente e utilizavel pelo calculo.

Esse componente faz chamadas reais na Graph.

Ele nao simula payload.

## Papel arquitetural

Dentro da arquitetura do health score, o coletor e a camada responsavel por transformar definicoes abstratas de endpoints em respostas concretas, normalizadas e classificadas.

Fluxo conceitual:

1. recebe o catalogo de endpoints
2. autentica na Microsoft Graph
3. executa as requisicoes base
4. descobre requisicoes dependentes
5. executa as requisicoes dependentes
6. consolida os resultados em um dataset unico
7. entrega esse dataset para a camada de interpretacao/calculo

## Responsabilidades

O coletor deve:

- adquirir token de acesso da Graph
- executar endpoints HTTP definidos no catalogo
- tratar JSON de colecao
- tratar JSON de entidade unica
- tratar endpoints de CSV via redirect
- seguir paginacao quando necessario
- registrar evidencias de sucesso e falha por endpoint
- classificar falhas em categorias tecnicas reutilizaveis

O coletor nao deve:

- decidir quais endpoints fazem parte do modelo
- interpretar regra de score
- aplicar heuristicas de negocio
- apresentar score final

## Entradas tecnicas

O coletor depende de:

- uma malha declarativa de endpoints
- credenciais de aplicacao para a Microsoft Graph
- configuracao de timeout, headers e comportamento de redirect

Credenciais esperadas:

- `tenant_id`
- `client_id`
- `client_secret`

Escopo esperado:

- `https://graph.microsoft.com/.default`

## Saida tecnica

O resultado da coleta deve ser um dataset estruturado com:

- timestamp da execucao
- raiz Graph utilizada
- parametros da execucao
- resumo agregado
- lista de endpoints executados

Cada endpoint deve poder registrar, no minimo:

- `id`
- `status`
- `ok`
- `requestUrl`
- `headers`
- `parsedBody`
- `bodyPreview`
- `valueCount`
- `sampleKeys`
- `nextLink`
- `csvDownload`
- `csvBody`
- `usable`
- `error`
- `errorCategory`

Isso permite que a camada seguinte trabalhe sobre um contrato uniforme, independentemente do recurso original da Graph.

## Modos de operacao

### Modo diagnostico

Objetivo:

- validar endpoint
- inspecionar payload
- reduzir volume de dados

Caracteristicas:

- amostragem pequena
- preview resumido
- sem obrigacao de paginacao completa

### Modo de calculo

Objetivo:

- entregar material suficiente para o score

Caracteristicas:

- preserva payload cru
- tenta seguir paginacao
- executa fan-out necessario para cruzamentos

Esses dois modos compartilham o mesmo motor de coleta, mudando apenas profundidade e nivel de preservacao dos dados.

## Pipeline de execucao

### 1. Carregamento das definicoes primarias

O coletor recebe os endpoints base do modelo.

### 2. Execucao das definicoes primarias

Cada definicao vira uma chamada HTTP real.

### 3. Descoberta de definicoes dependentes

Com base nas respostas iniciais, o coletor expande a malha.

Exemplos:

- membros por role
- owners por grupo
- records por dominio

### 4. Execucao das definicoes dependentes

O mesmo pipeline e repetido para as novas chamadas.

### 5. Consolidacao

Todas as execucoes sao unificadas em uma lista coerente de endpoints processados.

## Tratamento de formatos

### JSON collection

Quando o recurso responde com `value`, o coletor deve:

- armazenar o payload parseado
- identificar quantidade de itens
- extrair chaves da amostra
- gerar preview reduzido

### JSON entity

Quando o recurso responde com entidade unica, o coletor deve:

- armazenar o objeto parseado
- extrair chaves principais
- gerar preview reduzido

### CSV redirect

Quando o recurso responde com `302`, o coletor deve:

1. capturar o header `Location`
2. baixar o CSV na URL preautenticada
3. armazenar:
   - status do download
   - headers do download
   - linhas de amostra
   - corpo completo do CSV

Esse comportamento e obrigatorio para os endpoints de `reports/*`.

## Paginacao

Colecoes Graph podem retornar `@odata.nextLink`.

O coletor deve conseguir:

- nao seguir paginacao em modo diagnostico
- seguir paginacao em modo de calculo
- limitar o numero maximo de paginas por seguranca operacional

Isso evita tanto subcoleta em calculo real quanto explosao de custo em execucoes exploratorias.

## Classificacao de falhas

O coletor deve transformar falhas tecnicas em categorias reutilizaveis pelo report.

Categorias praticas:

- `provider_inactive`
- `insufficient_privileges`
- `unsupported_query`
- `not_applicable`
- `not_collected`

Essas categorias sao importantes porque a camada de score precisa diferenciar:

- problema de permissao
- provider/licenca nao ativo
- consulta invalida
- ausencia real de dado

Sem essa classificacao, o score ficaria dependente de parsing ad hoc de mensagens de erro.

## Beneficios tecnicos

Manter um coletor dedicado traz estes ganhos:

- isola autenticacao Graph
- padroniza a saida de endpoints heterogeneos
- trata CSV e JSON no mesmo contrato
- simplifica o builder do score
- facilita troubleshooting por endpoint
- permite reutilizacao em harness de validacao e em fluxo de calculo real

## Riscos e cuidados

Como esse componente fala diretamente com a Graph, ele precisa lidar com instabilidade estrutural:

- permissoes incompletas
- workloads desativados
- redirect ausente em endpoints de relatorio
- mudanca de shape no payload
- paginação longa em tenants maiores
- combinacoes de licenca que alteram comportamento do recurso

Por isso, o coletor deve ser tratado como infraestrutura de dados do health score, nao como simples utilitario de debug.
