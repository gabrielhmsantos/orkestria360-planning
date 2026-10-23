# Documento — Inventário de Ativos de TI

## Objetivo

Este tópico representa o fluxo documental do inventário corporativo de ativos de TI da empresa.

## Workflow

- preencher `Responsável`
- preencher `Vigência/Validade`
- baixar template `.docx`
- enviar documento preenchido
- aguardar aprovação do `admin`

## Status aplicáveis

- `Pendente`
- `Em andamento`
- `Em análise`
- `Concluído`

## Metadados obrigatórios

| Campo | Tipo |
| --- | --- |
| Responsável | `text` |
| Vigência/Validade | `select` |

## Template esperado

Nome sugerido do template:

- `template-inventario-de-ativos-de-ti.docx`

## Conteúdo esperado no documento enviado

O template deve orientar a produção de um documento corporativo com:

- objetivo do inventário
- escopo do inventário
- categorias de ativos cobertas
- visão consolidada por unidade, área ou ambiente
- critérios de identificação dos ativos
- responsáveis pela manutenção do inventário
- frequência de atualização
- principais lacunas, riscos ou pendências

## Regras específicas

1. O download do template coloca o tópico em `Em andamento`.
2. O envio do inventário preenchido coloca o tópico em `Em análise`.
3. A aprovação do documento por `admin` conclui o tópico.

