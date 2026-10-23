# Health Score Orkestria360 - Catalogo Tecnico de Coleta Graph V1

## Finalidade

Este documento descreve o componente de catalogo de coleta da Microsoft Graph usado pelo estudo do Health Score V1.

A funcao desse componente e definir, de forma declarativa, a malha de endpoints necessaria para montar o dataset bruto do health score.

Ele existe para responder estas perguntas:

- quais endpoints precisam ser consultados
- qual indicador ou pilar depende de cada endpoint
- qual formato de resposta cada endpoint retorna
- quais endpoints dependem de descobertas previas
- quais filtros ou parametros minimos devem ser aplicados

Esse componente nao executa requisicoes. Ele apenas descreve a coleta.

## Papel arquitetural

Dentro da arquitetura do health score, o catalogo ocupa a camada de definicao da coleta.

Fluxo conceitual:

1. o catalogo declara a malha de endpoints
2. o coletor executa a malha declarada
3. o parser normaliza formatos especiais, como CSV
4. o builder interpreta o dataset
5. o calculador aplica as formulas do modelo

Sem esse catalogo, os detalhes da Graph ficariam espalhados entre a coleta e o calculo.

## Responsabilidades

O catalogo deve:

- listar endpoints base do modelo V1
- listar endpoints dinamicos derivados de respostas anteriores
- indicar o tipo de resposta esperado
- registrar os metadados minimos da coleta
- separar claramente a definicao da coleta da execucao da coleta

O catalogo nao deve:

- autenticar na Graph
- abrir conexoes HTTP
- paginar resultados
- classificar erros de coleta
- calcular score

## Estrutura de uma definicao

Cada definicao de endpoint deve carregar, no minimo, os seguintes campos:

- `id`
  - identificador interno estavel da coleta
- `pillar`
  - pilar do modelo ao qual o endpoint da suporte
- `indicator`
  - indicador do modelo ao qual o endpoint da suporte
- `path`
  - caminho Graph a ser consultado
- `responseMode`
  - modo esperado de resposta
- `accept`
  - header `Accept` esperado
- `query`
  - query params, quando aplicavel
- `note`
  - observacao tecnica da finalidade da coleta

## Modos de resposta esperados

O modelo V1 exige suporte a 3 familias de resposta.

### `json_collection`

Usado para endpoints que respondem com colecao em `value`.

Shape esperado:

```json
{
  "value": [
    {}
  ]
}
```

Exemplos tipicos:

- organizacao
- dominios
- skus assinadas
- usuarios
- grupos
- roles
- auditorias
- health overviews

### `json_entity`

Usado para endpoints que retornam uma entidade unica.

Shape esperado:

```json
{
  "id": "...",
  "displayName": "..."
}
```

Exemplo tipico:

- policy de `Security Defaults`

### `csv_redirect`

Usado para endpoints de `reports/*` que respondem em duas etapas:

1. resposta inicial `302`
2. download final do CSV em URL preautenticada

Exemplos tipicos:

- atividade de usuarios Microsoft 365
- activity counts de Teams
- contagens de Exchange
- uso de OneDrive
- uso detalhado de SharePoint
- uso de Microsoft 365 Apps

## Endpoints base do modelo V1

O catalogo base do Health Score V1 cobre, pelo menos, estes blocos:

### Configuracoes Gerais

- organizacao
- dominios
- policy de `Security Defaults`

### Licenciamento

- skus assinadas
- relatorios de atividade do Office 365

### Governanca

- usuarios
- convidados
- grupos
- roles administrativas
- auditorias de diretorio

### Seguranca

- secure score
- detalhes de registro de autenticacao
- policies de Conditional Access
- alertas
- incidentes

### Disponibilidade

- service health overviews
- service announcement issues

### Compliance

- secure score control profiles
- sensitivity labels

### Produtividade

- relatorios agregados de servicos
- Teams
- Exchange
- OneDrive
- SharePoint
- Microsoft 365 Apps

## Endpoints dependentes

Parte da malha nao e conhecida no inicio da execucao. Ela depende do que a primeira coleta descobre.

Casos principais:

- para cada role descoberta, coletar membros da role
- para cada grupo descoberto, coletar owners do grupo
- para cada dominio descoberto, coletar service configuration records do dominio

Esses endpoints dinamicos existem para permitir cruzamentos que nao sao atendidos por um unico recurso base.

## Fan-out controlado

Como endpoints dependentes podem crescer com o tenant, o catalogo deve permitir amostragem ou limites de expansao durante diagnostico, sem alterar a estrutura conceitual da coleta.

Isso e importante para:

- validacao de payload
- testes exploratorios
- reducao de custo/tempo de execucao em analise manual

Na coleta real de calculo, a expansao pode ser mais ampla.

## Beneficios tecnicos

Manter a malha de coleta em um catalogo dedicado traz estas vantagens:

- remove hardcode de URLs do calculo
- centraliza filtros e parametros
- facilita revisar cobertura do modelo
- permite trocar ou expandir endpoints sem reescrever a camada de score
- melhora rastreabilidade entre modelo conceitual e fonte de dados

## Riscos e cuidados

O catalogo deve ser mantido com atencao porque pequenas mudancas na Graph podem impactar toda a coleta:

- endpoints que passam a exigir permissao adicional
- endpoints que mudam de shape
- endpoints de `reports` que alteram cabecalhos CSV
- recursos com comportamento diferente por licenca ou workload ativo

Por isso, esse componente deve ser tratado como parte do contrato tecnico do health score, e nao como artefato temporario de diagnostico.
