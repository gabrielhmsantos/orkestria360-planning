# Documento — Matriz de Acessos e Permissões

## Objetivo

Este tópico representa o fluxo documental da matriz corporativa de acessos e permissões.

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

- `template-matriz-de-acessos-e-permissoes.docx`

## Conteúdo esperado no documento enviado

O template deve orientar a produção de um documento corporativo com:

- sistemas e ambientes cobertos
- perfis e permissões controlados
- critérios de concessão, alteração e revogação
- responsáveis e aprovadores
- periodicidade de revisão
- tratamento de acessos privilegiados
- uso de MFA e controles críticos
- exceções, riscos e pendências

## Regras específicas

1. O download do template coloca o tópico em `Em andamento`.
2. O envio da matriz preenchida coloca o tópico em `Em análise`.
3. A aprovação do documento por `admin` conclui o tópico.

