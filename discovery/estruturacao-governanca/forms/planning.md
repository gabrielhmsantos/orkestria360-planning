# Planejamento — Fluxo Documental dos 8 Tópicos de Governança

## Objetivo

Planejar a evolução do módulo **Estruturação e Governança** para que cada um dos 8 tópicos funcione como um **processo documental**, e não como formulário de perguntas.

O fluxo esperado passa a ser:

1. preencher `Responsável` e `Vigência/Validade`
2. baixar um `template .docx`
3. produzir/preencher o documento fora da plataforma
4. enviar o documento para análise
5. aprovar o documento com usuário `admin`
6. definir a pontuação administrativa do tópico, de `0` a `100`

---

## Escopo Funcional

Cada um dos 8 tópicos terá:

1. metadados mínimos
2. um template `.docx` para download
3. área de upload do documento preenchido
4. trilha de status
5. aprovação final por usuário com role `admin`
6. definição de pontuação por usuário com role `admin`

Tópicos:

1. Inventário de Ativos de TI
2. Inventário de Licenças e Softwares
3. Matriz de Acessos e Permissões
4. Mapa de Rede e Infraestrutura
5. Política de Segurança da Informação
6. Procedimentos de Controle de Acessos
7. Documentação de Processos de TI
8. Relatórios de Diagnóstico e Recomendações

---

## Status

Os tópicos passarão a trabalhar com 4 status:

- `Pendente`
- `Em andamento`
- `Em análise`
- `Concluído`

### Regra de transição

#### 1. `Pendente`

O tópico entra em `Pendente` quando o usuário preencher:

- `Responsável`
- `Vigência/Validade`

#### 2. `Em andamento`

O tópico muda para `Em andamento` quando o usuário baixar o template `.docx`.

#### 3. `Em análise`

O tópico muda para `Em análise` quando o usuário enviar o documento preenchido.

#### 4. `Concluído`

O tópico muda para `Concluído` quando um usuário com role `admin` aprovar o documento enviado e definir a pontuação do tópico.

---

## Fluxo Esperado

1. O tópico inicia sem documento enviado.
2. O usuário define `Responsável` e `Vigência/Validade`.
3. O sistema marca o tópico como `Pendente`.
4. O usuário baixa o template `.docx`.
5. O sistema marca o tópico como `Em andamento`.
6. O usuário envia o documento preenchido.
7. O sistema marca o tópico como `Em análise`.
8. Um usuário `admin` revisa o documento.
9. O usuário `admin` define uma pontuação de `0` a `100`.
10. O usuário `admin` aprova o documento.
11. O sistema marca o tópico como `Concluído`.

---

## Pontuação Administrativa

Cada tópico deve receber uma pontuação administrativa definida por usuário com role `admin`.

### Escala

- valor mínimo: `0`
- valor máximo: `100`

### Regra

- a pontuação só pode ser definida quando o documento estiver em `Em análise`
- a pontuação deve ser obrigatória para aprovação final
- sem pontuação, o tópico não pode ser marcado como `Concluído`

### Finalidade

A pontuação administrativa de cada tópico será usada para compor o **score de maturidade** do módulo de Estruturação e Governança.

### Regra inicial sugerida para o score de maturidade

O score do módulo pode ser calculado pela média simples das pontuações dos 8 tópicos:

```text
score_maturidade = soma_das_pontuacoes_dos_8_topicos / 8
```

Exemplo:

- 8 tópicos com notas `80, 70, 90, 60, 75, 85, 65, 95`
- soma = `620`
- score de maturidade = `77.5`

Observação:
Se depois quisermos pesos diferentes por tópico, isso pode virar uma evolução futura. Neste planejamento, a recomendação é começar com **peso igual para todos os 8 tópicos**.

---

## Metadados por Tópico

Todos os 8 tópicos devem compartilhar pelo menos estes campos:

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| Responsável | `text` | Sim |
| Vigência/Validade | `select` | Sim |
| Data da última revisão | `date` | Não |
| Observações gerais | `textarea` | Não |

Opções de `Vigência/Validade`:

- `3 meses`
- `6 meses`
- `9 meses`
- `12 meses`
- `24 meses`

---

## Ações da Interface

Cada tópico deve oferecer as seguintes ações:

- `Preencher metadados`
- `Baixar template`
- `Enviar documento`
- `Visualizar documento enviado`
- `Aprovar documento` apenas para `admin`
- `Reprovar / solicitar ajuste` apenas para `admin` se essa etapa for adotada

---

## Regras de UI

### Na visão de overview

A tabela principal deve exibir:

- tópico
- responsável
- vigência
- status atual
- data do último envio
- ação principal

### Na visão de detalhe

Cada tópico deve exibir:

- metadados do tópico
- botão de download do template `.docx`
- área de upload do documento final
- histórico simples do último envio
- status atual
- campo de pontuação `0-100` para `admin`
- ação de aprovação para `admin`

---

## Regras de Negócio

1. O download do template só deve ficar habilitado após `Responsável` e `Vigência/Validade` serem preenchidos.
2. O upload do documento só deve ficar disponível após o template ter sido baixado.
3. Um documento enviado deve ficar com status `Em análise` até revisão administrativa.
4. Apenas usuários com role `admin` podem definir a pontuação e concluir o tópico.
5. Se houver substituição de arquivo em `Em análise`, o status deve permanecer `Em análise`.
6. Se um documento aprovado precisar ser refeito, o comportamento deve ser definido depois; por ora, considerar isso uma decisão em aberto.
7. A pontuação administrativa deve aceitar apenas valores inteiros de `0` a `100`.

---

## Modelo de Dados Sugerido

```ts
type GovernanceTopicStatus =
  | 'pending'
  | 'in-progress'
  | 'under-review'
  | 'completed';

type GovernanceTopicValidityMonths = 3 | 6 | 9 | 12 | 24;

type GovernanceTopicDocument = {
  fileName: string;
  fileType: 'docx' | 'pdf';
  uploadedAt: string | null;
  uploadedBy: string | null;
  url: string | null;
};

type GovernanceTopicTemplate = {
  fileName: string;
  url: string;
  downloadedAt: string | null;
  downloadedBy: string | null;
};

type GovernanceTopicWorkflow = {
  id: string;
  topic: string;
  ownerName: string | null;
  validityMonths: GovernanceTopicValidityMonths | null;
  lastReviewedAt: string | null;
  status: GovernanceTopicStatus | null;
  template: GovernanceTopicTemplate;
  submittedDocument: GovernanceTopicDocument | null;
  adminScore: number | null;
  approvedAt: string | null;
  approvedBy: string | null;
};
```

---

## Impacto na Tela Atual

Hoje a tela de Governança mostra maturidade com tabela e analytics. Com a nova abordagem, cada linha da tabela passa a representar um **workflow documental**.

Isso muda o foco de:

- “responder um formulário”

para:

- “baixar um modelo oficial”
- “produzir o documento”
- “enviar para análise”
- “obter aprovação”

---

## Fases de Implementação Sugeridas

### Fase 1 — Contrato e mock

- criar novo contrato de workflow documental
- mockar status, template, documento enviado e pontuação admin
- consolidar o planejamento atual no formato de fluxo documental, sem dependência de perguntas ou questionários

### Fase 2 — Overview da governança

- atualizar tabela dos 8 tópicos
- incluir responsável, vigência, status e ação principal
- refletir os 4 novos status

### Fase 3 — Página de detalhe do tópico

- bloco de metadados
- botão de download do template
- upload do documento
- área de visualização do documento enviado
- histórico simples do último envio

### Fase 4 — Aprovação administrativa

- exibir campo de pontuação `0-100` apenas para `admin`
- exibir ação de aprovação apenas para `admin`
- concluir tópico após pontuação + aprovação

### Fase 5 — Testes

- transição de `Pendente` → `Em andamento`
- transição de `Em andamento` → `Em análise`
- transição de `Em análise` → `Concluído`
- obrigatoriedade de pontuação antes da aprovação
- validação da faixa de pontuação entre `0` e `100`
- controle de permissão para aprovação

### Fase 6 — Score de maturidade

- calcular o score do módulo a partir das 8 pontuações administrativas
- definir regra de arredondamento/exibição do score
- refletir o score recalculado na visão executiva de Governança

---

## Critérios de Aceite

1. Cada um dos 8 tópicos deve possuir um template `.docx` disponível para download.
2. O tópico deve ficar `Pendente` ao preencher `Responsável` e `Vigência/Validade`.
3. O tópico deve ficar `Em andamento` ao baixar o template.
4. O tópico deve ficar `Em análise` ao enviar o documento.
5. O usuário `admin` deve definir uma pontuação de `0` a `100` antes de aprovar o documento.
6. O tópico deve ficar `Concluído` somente após pontuação + aprovação por usuário `admin`.
7. O score de maturidade deve poder ser calculado a partir das pontuações atribuídas aos 8 tópicos.
8. A tabela principal deve refletir corretamente o status de cada tópico.

---

## Decisões em Aberto

1. O sistema aceitará apenas `.docx` no upload ou também `pdf`?
2. O download do template precisa ser versionado?
3. Haverá reprovação com comentário do `admin`?
4. O documento aprovado poderá ser substituído depois?
5. Haverá histórico de múltiplos envios por tópico?
6. A pontuação do `admin` aceitará apenas inteiros ou também decimais?
7. O score final do módulo será arredondado, truncado ou exibido com casa decimal?
