# Health Score Orkestria360 - Especificacao Tecnica dos Calculos V1

## Finalidade

Este documento descreve a especificacao tecnica dos calculos efetivamente adotados no estudo de viabilidade do Health Score Orkestria360 V1.

O objetivo aqui nao e redefinir o modelo conceitual original, e sim registrar:

- como cada indicador e convertido para nota de `0` a `100`
- como a nota do indicador contribui para o pilar
- como o pilar contribui para o health score geral
- quais heuristicas foram assumidas quando a fonte de dados nao entrega o sinal ideal
- quais situacoes reduzem score por problema real do tenant
- quais situacoes reduzem score ou cobertura por indisponibilidade de coleta

Este documento deve ser lido como contrato tecnico do calculo V1.

## Estrutura do score

O modelo trabalha com:

- score por indicador: `0` a `100`
- score por pilar: soma ponderada dos indicadores do pilar
- health score geral: soma ponderada dos pilares
- cobertura: percentual de evidencias efetivamente coletadas

## Pesos dos pilares

- `Seguranca`: `30%`
- `Licenciamento`: `20%`
- `Governanca`: `15%`
- `Disponibilidade`: `10%`
- `Compliance`: `10%`
- `Produtividade`: `10%`
- `Configuracoes Gerais`: `5%`

## Formulas gerais

### Contribuicao do indicador no pilar

```text
contribuicao_no_pilar = score_do_indicador * peso_interno_do_indicador
```

### Contribuicao do indicador no health score

```text
contribuicao_no_health_score =
  score_do_indicador
  * peso_interno_do_indicador
  * peso_do_pilar
```

### Health score final

```text
health_score =
  soma de todas as contribuicoes_no_health_score
```

### Cobertura final

A cobertura final representa o quanto dos indicadores conseguiu ser coletado com sucesso, ponderado pelos pesos do modelo.

Ela nao e a mesma coisa que o health score.

Leitura correta:

- `health score` mede qualidade do tenant
- `coverage` mede completude da coleta

## Regras numericas reutilizadas

O modelo V1 usa quatro familias de regra.

### 1. Meta minima com proporcionalidade

Usada quando o indicador atinge `100` ao alcancar um minimo desejado.

Formula:

```text
se valor_atual >= meta:
  score = 100
senao:
  score = (valor_atual / meta) * 100
```

Uso tipico:

- MFA
- usuarios ativos
- adocao
- secure score proporcional ate um threshold

### 2. Teto maximo aceitavel

Usada quando o indicador atinge `100` se ficar abaixo de um limite maximo tolerado.

Formula conceitual:

```text
se valor_atual <= teto:
  score = 100
senao:
  score cai proporcionalmente
```

Uso tipico:

- contas inativas
- convidados inativos
- sobra de licencas

### 3. Faixa ideal

Usada quando o valor bom nao e o maximo absoluto, mas uma faixa de equilibrio.

Formula conceitual:

```text
se valor_atual estiver dentro da faixa:
  score = 100
se estiver abaixo:
  score cresce proporcionalmente ate o limite inferior ideal
se estiver acima:
  score cai proporcionalmente acima do limite superior ideal
```

Uso tipico:

- utilizacao de licencas compradas

### 4. Penalidade fixa por ocorrencia

Usada quando o modelo conceitual exige “quanto menos, melhor”, mas nao define funcao numerica precisa.

Heuristica adotada:

```text
score = max(0, 100 - quantidade_de_ocorrencias * 20)
```

Uso tipico:

- alertas/incidentes high/critical
- eventos administrativos sensiveis

## Cobertura e status

Cada indicador deve carregar dois eixos independentes:

- `score`
- `coverage`

### Status tecnicos aceitos

- `collected`
- `provider_inactive`
- `insufficient_privileges`
- `unsupported_query`
- `not_applicable`
- `not_collected`

### Regra operacional

- quando o dado existe e pode ser interpretado, o indicador recebe score normal
- quando o dado nao e coletavel, o indicador pode zerar e ao mesmo tempo registrar baixa cobertura
- por isso o health score sempre precisa ser lido junto da cobertura

## Especificacao por pilar

## 1. Seguranca

Peso do pilar: `30%`

### 1.1 Secure Score Microsoft

Peso interno: `35%`

Fonte de dado:

- secure score executivo do tenant

Regra:

- calcular `currentScore / maxScore`
- meta de excelencia: `>= 80%`
- abaixo disso: score proporcional ate `80%`

Exemplo conceitual:

```text
currentScore = 60
maxScore = 100
razao = 0,60
meta = 0,80
score = (0,60 / 0,80) * 100 = 75
```

### 1.2 Cobertura MFA dos usuarios

Peso interno: `20%`

Fonte de dado:

- usuarios habilitados
- informacoes de registro/capacidade MFA

Regra:

- universo = usuarios habilitados
- protegido = usuario com sinal de MFA registrado ou MFA capaz
- meta de excelencia: `>= 95%`
- abaixo disso: score proporcional

Observacao:

- o modelo aceita MFA registrado ou MFA capaz como cobertura suficiente nesta versao

### 1.3 MFA em administradores

Peso interno: `15%`

Fonte de dado:

- roles administrativas
- membros das roles
- dataset de MFA

Regra:

- universo = usuarios encontrados nas roles administrativas
- protegido = admin com sinal de MFA registrado ou MFA capaz
- meta de excelencia: `100%`
- abaixo disso: score proporcional

### 1.4 Alertas/incidentes de seguranca abertos

Peso interno: `15%`

Fonte de dado:

- alertas de seguranca
- incidentes de seguranca

Regra ideal:

- score `100` se nao houver achados `high` ou `critical` abertos

Heuristica V1:

- contar alertas/incidentes `high` ou `critical` ainda abertos
- aplicar penalidade fixa de `20` pontos por ocorrencia

Formula:

```text
score = max(0, 100 - ocorrencias * 20)
```

Regra de indisponibilidade:

- se o provider de seguranca estiver inativo, o indicador e marcado como indisponivel e o score fica zerado na versao atual

### 1.5 Conditional Access ou Security Defaults

Peso interno: `15%`

Fonte de dado:

- policies de Conditional Access
- estado de `Security Defaults`

Regra:

- score `100` se `Security Defaults` estiver habilitado
- score `100` se houver ao menos uma policy ativa e relevante para MFA
- caso contrario, score `0`

Heuristica de policy relevante:

- estado ativo
- ou grant control de MFA
- ou indicios textuais claros de MFA/multifactor

## 2. Licenciamento

Peso do pilar: `20%`

### 2.1 Utilizacao das licencas compradas

Peso interno: `40%`

Fonte de dado:

- inventario de skus assinadas

Regra:

- incluir apenas SKUs faturaveis com `enabled > 0`
- excluir SKUs free, dev, viral, trial e store/tecnicas
- excluir tambem SKUs sem estoque comprado efetivo, mesmo que ainda aparecam com consumo residual
- calcular:

```text
utilizacao = consumedUnits / prepaidUnits.enabled
```

Faixa ideal:

- minimo ideal: `85%`
- maximo ideal: `95%`

Leitura:

- abaixo de `85%`: sobra de licenca
- entre `85%` e `95%`: uso equilibrado
- acima de `95%`: risco de saturacao

### 2.2 Licencas atribuidas com uso recente

Peso interno: `35%`

Fonte de dado:

- usuarios com licenca atribuida
- relatorio de atividade dos ultimos 30 dias

Regra:

- universo = usuarios com `assignedLicenses`
- ativo = usuario com atividade recente em workload Microsoft 365
- meta de excelencia: `>= 90%`
- abaixo disso: score proporcional

### 2.3 Excesso de licencas disponiveis por SKU

Peso interno: `15%`

Fonte de dado:

- inventario de skus assinadas

Regra:

- considerar apenas SKUs faturaveis com `enabled > 0`
- para cada SKU calcular:

```text
sobra = (enabled - consumed) / enabled
```

- usar a maior sobra entre as SKUs
- excelencia quando nenhuma SKU tiver sobra superior a `25%`

Leitura:

- basta uma SKU com sobra muito alta para derrubar o indicador

### 2.4 SKUs sem uso

Peso interno: `10%`

Fonte de dado:

- inventario de skus assinadas

Regra:

- considerar apenas SKUs faturaveis com `enabled > 0`
- identificar quantas possuem `consumedUnits = 0`

Formula:

```text
score = 100 * (1 - skus_sem_uso / total_skus_ativas)
```

## 3. Governanca

Peso do pilar: `15%`

### 3.1 Grupos com owner definido

Peso interno: `25%`

Fonte de dado:

- grupos
- owners dos grupos

Regra:

- universo = grupos descobertos
- adequado = grupo com pelo menos um owner
- meta de excelencia: `>= 95%`
- abaixo disso: score proporcional

### 3.2 Contas inativas ainda habilitadas

Peso interno: `20%`

Fonte de dado:

- usuarios habilitados
- sinal de ultimo login bem-sucedido

Regra:

- universo = usuarios habilitados
- inativo = usuario sem login bem-sucedido recente
- janela adotada no V1: `90 dias`
- excelencia quando a razao de inativos habilitados for `<= 5%`

### 3.3 Usuarios convidados controlados

Peso interno: `15%`

Fonte de dado:

- convidados
- sinal de ultimo login

Regra:

- universo = usuarios `Guest`
- inativo = convidado sem atividade recente ha mais de `90 dias`
- excelencia quando inativos representam `<= 5%`
- se nao houver convidados, score = `100`

### 3.4 Roles administrativas monitoradas

Peso interno: `20%`

Fonte de dado:

- roles administrativas
- membros das roles
- atividade dos administradores

Regra V1:

- calcular duas razoes:
  - `roles_com_membros / total_de_roles`
  - `admins_ativos / total_de_admins`
- usar a menor das duas como score base

Leitura:

- o indicador exige simultaneamente:
  - cobertura minima das roles com membros resolvidos
  - administradores nao inativos

### 3.5 Atividades administrativas sensiveis

Peso interno: `20%`

Fonte de dado:

- auditorias administrativas

Regra ideal:

- score alto quando nao existirem eventos sensiveis recentes sem contexto de revisao

Heuristica V1:

- eventos sensiveis reduzem `20` pontos por ocorrencia
- score minimo `0`

Exemplos de evento sensivel considerados:

- alteracao de role
- criacao/alteracao de app
- consentimento administrativo
- mudanca de configuracao critica
- mudanca relevante de usuario ou grupo administrativo

## 4. Disponibilidade

Peso do pilar: `10%`

### 4.1 Status dos servicos principais

Peso interno: `60%`

Fonte de dado:

- health overviews de servicos Microsoft 365

Regra:

- universo = servicos considerados relevantes para o modelo
- saudavel = servico em `serviceOperational`
- score proporcional pela razao de servicos operacionais

### 4.2 Incidentes ativos

Peso interno: `30%`

Fonte de dado:

- issues ativas de service announcement

Regra:

- score `100` quando nao ha incidentes ativos relevantes
- abaixo disso, o indicador cai conforme a quantidade de issues ativas

Versao V1:

- a ausencia de issues ativas produz score maximo

### 4.3 Recorrencia de degradacao

Peso interno: `10%`

Fonte de dado:

- snapshots historicos internos

Regra:

- exige historico persistido de degradacoes/incidentes

Estado V1:

- quando o historico nao existe, o indicador fica como `not_collected`
- a cobertura registra explicitamente essa limitacao

## 5. Compliance

Peso do pilar: `10%`

### 5.1 Controles de compliance/information protection

Peso interno: `30%`

Fonte de dado:

- catalogo de controles do secure score

Regra ideal:

- medir percentual de controles de compliance efetivamente implementados

Limite V1:

- a fonte observada descreve o controle, mas nem sempre entrega estado implementado suficiente
- por isso, quando nao ha sinal confiavel, o indicador permanece `not_collected`

### 5.2 Sensitivity labels disponiveis

Peso interno: `25%`

Fonte de dado:

- labels de sensibilidade

Regra:

- score `100` se houver labels disponiveis para classificacao/protecao
- score `0` se nao houver nenhuma label

### 5.3 Saude do Purview

Peso interno: `15%`

Fonte de dado:

- health overviews

Regra:

- localizar o workload ligado a Purview/compliance
- score maximo quando o servico estiver operacional

### 5.4 Auditoria administrativa disponivel

Peso interno: `15%`

Fonte de dado:

- auditorias administrativas

Regra:

- score `100` quando existe coleta recente e utilizavel de auditoria
- score `0` quando a auditoria nao pode ser usada

### 5.5 Governanca de acesso externo

Peso interno: `15%`

Fonte de dado:

- convidados
- grupos
- owners

Regra V1:

- indicador composto que observa qualidade minima da governanca de acesso externo
- quanto mais convidados inativos e estruturas sem ownership, menor o score

## 6. Produtividade

Peso do pilar: `10%`

### 6.1 Usuarios ativos Microsoft 365

Peso interno: `30%`

Regra:

- universo = usuarios licenciados
- ativo = usuario com atividade recente no relatorio de uso
- meta de excelencia: `>= 80%`

### 6.2 Uso geral dos servicos

Peso interno: `20%`

Regra V1:

- usar o relatorio agregado de workloads
- extrair uma razao media de atividade dos servicos principais
- converter essa razao para score `0-100`

### 6.3 Adocao do Teams

Peso interno: `15%`

Regra:

- comparar uso de Teams com universo elegivel/licenciado
- meta de excelencia: `>= 60%`

Heuristica V1:

- usar o maior contador numerico do relatorio como estimativa de usuarios ativos

### 6.4 Adocao do Exchange

Peso interno: `15%`

Regra:

- combinar atividade de email e contagem de mailbox
- meta de excelencia: `>= 80%`

### 6.5 Adocao de OneDrive/SharePoint

Peso interno: `10%`

Regra:

- medir uso ativo de contas/sites elegiveis
- meta de excelencia: `>= 60%`

### 6.6 Uso dos Microsoft 365 Apps

Peso interno: `10%`

Regra:

- medir usuarios com uso/ativacao de apps
- meta de excelencia: `>= 80%`

## 7. Configuracoes Gerais

Peso do pilar: `5%`

### 7.1 Tenant identificado corretamente

Peso interno: `15%`

Regra:

- score `100` se os dados basicos do tenant forem coletados com sucesso

### 7.2 Dominios verificados

Peso interno: `25%`

Regra:

- calcular razao entre dominios verificados e dominios observados
- score proporcional ate `100%`

### 7.3 Registros de dominio essenciais

Peso interno: `20%`

Regra ideal:

- score maximo quando todos os dominios relevantes retornam records necessarios

Estado V1:

- quando a operacao nao pode ser executada por privilegio insuficiente, o indicador fica explicitamente bloqueado

### 7.4 Protecao base de identidade

Peso interno: `25%`

Regra:

- score `100` se `Security Defaults` estiver habilitado
- ou se houver Conditional Access adequado para MFA
- caso contrario, score `0`

### 7.5 Freshness das coletas

Peso interno: `15%`

Regra:

- score maximo quando a execucao do dataset ocorreu dentro da janela operacional esperada

Versao V1:

- a propria data/hora da execucao e usada como referencia de freshness

## Heuristicas explicitas do V1

As heuristicas abaixo nao devem ser confundidas com verdade definitiva de negocio. Elas existem para viabilizar o calculo com os sinais atualmente observaveis.

Heuristicas declaradas:

- `20` pontos de penalidade por ocorrencia sensivel em indicadores sem formula fechada
- `90 dias` como janela para inatividade de usuarios e convidados
- `MFA capaz` conta como cobertura suficiente na versao V1
- maior contador numerico do relatorio de Teams usado como proxy de usuarios ativos
- SKUs free/dev/viral/trial/store excluidas do calculo de licenciamento
- SKUs com `enabled = 0` excluidas do universo de licencas compradas

## Limites conhecidos

O calculo V1 tem limitacoes tecnicas que precisam ser lembradas durante a leitura do score:

- alguns endpoints dependem de workload/licenca ativa, nao apenas de permissao
- alguns indicadores exigiriam historico persistido, que pode nao existir ainda
- alguns recursos da Graph descrevem catalogos de controle, mas nao estado implementado suficiente
- parte dos relatorios de produtividade exige interpretacao indireta do CSV

Por isso, a interpretacao correta do resultado final exige sempre observar:

- `health score`
- `coverage`
- `status` dos indicadores bloqueados
- `reason` ou causa da indisponibilidade

## Leitura operacional recomendada

A leitura do resultado V1 deve seguir esta ordem:

1. verificar cobertura geral
2. separar indicadores zerados por indisponibilidade dos zerados por problema real
3. priorizar pilares com menor score ponderado
4. usar as evidencias de cada indicador para decidir se a causa e:
   - configuracao
   - licenciamento
   - governanca
   - baixa adocao
   - falta de provider/permissao/historico

Essa leitura evita tratar limitacao de coleta como se fosse problema intrinseco do tenant, e evita tratar problema real do tenant como simples detalhe de integracao.
