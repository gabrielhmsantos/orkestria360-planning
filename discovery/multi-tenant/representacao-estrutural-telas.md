# Representação estrutural das telas — Multi-tenancy

## Referências

- **Visuais do sponsor**: indisponíveis. O sponsor não forneceu referências de tela para este domínio.
- **Discovery e decisões**: `discovery/multi-tenant/README.md`, `arquitetura-e-decisoes.md`, `contratos.md` e `implementacao-propria-v1.md`.
- **Requisitos/specs**: `specs/011-multi-tenancy/spec.md` e `tasks.md`.
- **Padrões implementados**: `docs/DESIGN-orkestria.md`; a tela de aceite também toma como referência factual a composição de `orkestria360/resources/js/pages/auth/register.tsx`.

Esta representação define itens, ordem, agrupamento e proporção estrutural das superfícies aprovadas para o V1. Não define cores, fontes, pixel ou novos componentes. Na ausência de visual do sponsor, títulos e composições identificados como inferência são decisões de implementação aprovadas nesta conversa, e não uma preferência visual confirmada pelo sponsor.

## Convenções

- Em superfícies autenticadas, usar `PageScaffold` e faixas verticais. O conteúdo começa em `grid-cols-1 gap-4`; faixas de proporções distintas usam `xl:grid-cols-12`.
- Em telas públicas de autenticação, preservar a composição de coluna única e largura contida da tela de registro existente; não inserir sidebar, seletor ou contexto de outro tenant.
- `available`, `unavailable` e `restricted` indicam a condição factual de cada bloco. Ausência de fonte, falha ou dado histórico não é zero.
- Tabelas preservam colunas e ações no móvel por rolagem horizontal; alternativamente podem virar registros empilhados com cada rótulo visível. Nenhuma ação é removida apenas para acomodar largura.
- Ações críticas usam texto visível. Cancelar convite, reemitir convite, revogar acesso e desconectar exigem confirmação acessível.

## Elementos comuns

```text
Shell autenticado
Sidebar e navegação do produto
Cabeçalho: Organização atual: {nome autorizado pelo backend}
Conteúdo da rota
```

- Em desktop, o sidebar inicia recolhido em toda abertura/reload de rota. Ao receber hover enquanto recolhido, expande somente durante a interação e volta a recolher ao sair. Se o menu de usuário abrir, ele mantém o sidebar expandido enquanto o dropdown estiver ativo. O controle no cabeçalho permite mantê-lo expandido apenas na rota atual; reload ou qualquer navegação para outra rota o recolhe, sem persistência.

**Organização atual — identificação passiva**

- Região: cabeçalho do shell, após a identidade da pessoa e antes do conteúdo da rota quando o espaço permitir; no móvel, permanece no cabeçalho em linha própria ou quebra de linha.
- Conteúdo: rótulo `Organização atual` e nome do tenant autorizado, inclusive para o tenant `platform`.
- Estado e fonte: `available` somente com tenant resolvido e autorizado pelo backend. Não é dropdown, seletor, link de troca, campo de busca nem valor derivado do e-mail, domínio ou URL.
- Navegação: para `admin` de customer, o sidebar inclui o atalho direto `Usuários`, que abre a superfície do próprio tenant; esse atalho não aparece para `member` nem para `platform`.

---

## 01. Aceitar convite

Tela pública de criação de credenciais a partir de convite válido. Replica a estrutura da tela de registro existente, mas não cria cadastro público nem permite alterar identidade do convite.

### Faixa 1 — formulário de aceite (uma coluna)

`grid grid-cols-1 gap-6`; `Formulário de aceite: col-span-1`.

```text
| Aceitar convite                                      |
| Contexto: você foi convidado para esta organização   |
| [Nome do tenant: {nome}]                             |
| [E-mail convidado: {email}]                          |
| Senha                                                |
| [campo de senha]                                    |
| Confirmar senha                                      |
| [campo de confirmação]                               |
| [Aceitar convite]                                    |
```

#### Anatomia dos blocos desta faixa

**Aceitar convite — formulário de credenciais**

```text
Título e contexto do aceite
Label Nome do tenant       [valor somente leitura]
Label E-mail convidado     [valor somente leitura]
Label Senha                [campo com ajuda e erro associado]
Label Confirmar senha      [campo com ajuda e erro associado]
Botão primário Aceitar convite
```

- Regiões internas: título e texto de contexto no topo; dois campos somente leitura identificam o tenant e o e-mail convidado; senha e confirmação seguem a ordem, anatomia e validação da tela de registro; ação única ocupa toda a largura ao fim.
- Estado e fonte: `available` somente para token válido, pendente e não expirado. Em submissão, o botão fica indisponível e anuncia processamento. Erro de campo é associado ao campo e o foco vai ao resumo/primeiro erro.
- Estados alternativos: token inválido, expirado, revogado ou já utilizado substitui o formulário por mensagem sanitizada e orientação para contatar o administrador. Esses estados não expõem nome, e-mail ou qualquer dado de outro tenant.

---

## 02. Organizações

Visão exclusiva de administradores do tenant `platform` para provisionar e acompanhar customers no control plane.

### Faixa 1 — contexto e ação (duas regiões)

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; `Organizações: md:col-span-1 xl:col-span-8`; `Provisionar organização: md:col-span-1 xl:col-span-4`.

```text
| 2/3 Organizações                         | 1/3 Provisionar organização |
| título + texto de contexto                | ação primária               |
```

#### Anatomia dos blocos desta faixa

**Organizações — cabeçalho de página**

```text
Organizações
Contexto: customers provisionados pela plataforma
```

- Regiões internas: título e contexto à esquerda. Não contém seletor de tenant ou métricas.
- Estado e fonte: `restricted` para usuários fora do tenant `platform` ou sem capacidade administrativa; a rota devolve negação compreensível sem listar organizações.

**Provisionar organização — ação de criação**

```text
Botão Provisionar organização
```

- Regiões internas: uma ação textual abre o formulário contextual de provisioning; no móvel fica após o cabeçalho e mantém largura legível.
- Estado e fonte: `available` apenas para `admin` do `platform`. Durante envio, informa processamento e bloqueia duplicidade; validações pertencem ao formulário.

### Faixa 2 — lista de customers (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Lista de organizações: xl:col-span-12`.

```text
| Lista de organizações                                                   |
| Nome | Situação da organização | Convite inicial | Ação |
| ...                                                                     |
| paginação, se necessária                                                 |
```

#### Anatomia dos blocos desta faixa

**Lista de organizações — tabela operacional**

```text
Título Lista de organizações
Cabeçalho: Nome | Situação da organização | Convite inicial | Ação
Linhas: valores factuais por customer; ação Ver organização
Rodapé: total e paginação, quando aplicável
```

- Regiões internas: título, tabela com rolagem horizontal no móvel e rodapé conforme `OperationalTable`. O estado de entrega do convite é distinto do estado do convite. Não lê nem resume `microsoft_connections`.
- Estado e fonte: `available` para lista autorizada; `unavailable` em falha de consulta, com retry explícito; estado vazio informa `Nenhuma organização provisionada`. Não exibe URL, token, ciphertext ou detalhes de convite nesta listagem.

---

## 03. Organização

Detalhe de um customer para o `admin` do tenant `platform`, limitado ao control plane. Não concede acesso operacional aos dados do customer.

### Faixa 1 — identidade e bootstrap (duas regiões)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Organização: xl:col-span-8`; `Situação de bootstrap: xl:col-span-4`.

```text
| 2/3 Organização                         | 1/3 Situação de bootstrap |
| nome + contexto control plane            | status factual             |
```

#### Anatomia dos blocos desta faixa

**Organização — cabeçalho de detalhe**

```text
Nome da organização
Contexto: organização provisionada pela plataforma
```

- Regiões internas: identifica o customer sem apresentar módulos, pessoas ou dados operacionais do tenant.
- Estado e fonte: `restricted` para qualquer pessoa sem capacidade administrativa do `platform`.

**Situação de bootstrap — status factual**

```text
Situação de bootstrap
Status: aguardando aceite | concluído
```

- Regiões internas: rótulo e estado factual; não infere avanço percentual.
- Estado e fonte: `available` a partir do control plane.

### Faixa 2 — convite de bootstrap do customer (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Convite de bootstrap do customer: xl:col-span-12`.

```text
| Convite de bootstrap do customer                                    |
| Destinatário | Capacidade: admin | Motivo: customer_bootstrap    |
| Status | Validade | Estado de entrega                              |
| URL recuperável (somente quando pending e autorizado) [Copiar]       |
| [Cancelar convite] [Reemitir convite], quando permitidos             |
```

#### Anatomia dos blocos desta faixa

**Convite de bootstrap do customer — card operacional**

```text
Convite de bootstrap do customer
Destinatário | Capacidade: admin | Motivo: customer_bootstrap
Status do convite | Expira em | Entrega
URL recuperável: [valor copiável] [Copiar]
Ações contextuais: Cancelar convite | Reemitir convite
```

- Regiões internas: dados factuais no topo; URL recuperável em região exclusiva abaixo, com feedback de cópia anunciado; ações no rodapé. Falha de e-mail não implica falha na criação do convite.
- Estado e fonte: `purpose=customer_bootstrap` e `role=admin` são dimensões distintas: o primeiro indica lifecycle de ativação, o segundo a capacidade concedida. URL `available` exclusivamente ao iniciador autorizado, enquanto `pending`; em qualquer outra situação ela é ausente. Cancelar/reemitir ficam `available` somente para customer com `tenant.activated_at` nulo, sem membership `admin active` e sem `customer_bootstrap pending` válido; reemitir só aparece após convite anterior `expired` ou `revoked` por cancelamento autorizado. Depois do primeiro aceite, ações desaparecem e texto informa que a administração passou ao customer. Convites substituídos preservam o status, sem URL.

---

### Faixa 3 — sincronização Microsoft 365 (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Sincronização Microsoft 365: xl:col-span-12`.

```text
| Sincronização Microsoft 365                                              |
| [Solicitar sincronização agora] [Atualizar]                               |
| Solicitada em | Origem | Status | Ação                                    |
| Modal: etapas, status, duração, contadores, cobertura e motivo sanitizado |
```

O `admin` do platform pode apenas criar uma solicitação `platform`, que deriva `--force` assíncrono, e observar as cinco solicitações mais recentes, incluindo rotina. A superfície não revela dados operacionais do customer, payloads, pessoas, URLs ou credenciais; o worker é o único componente que entra no RLS do customer.

## 04. Conexão Microsoft 365

Configuração exclusiva de `admin` do tenant `customer`. O tenant `platform` não possui esta superfície nem CTA de conexão.

### Faixa 1 — contexto (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Conexão Microsoft 365: xl:col-span-12`.

```text
| Conexão Microsoft 365                                               |
| contexto: vínculo da organização atual com Microsoft 365             |
```

#### Anatomia dos blocos desta faixa

**Conexão Microsoft 365 — cabeçalho de página**

```text
Conexão Microsoft 365
Vínculo da organização atual com Microsoft 365
```

- Regiões internas: título e contexto; não contém um seletor de organização.
- Estado e fonte: `restricted` para `member` e para tenant `platform`.

### Faixa 2 — estado e ação da conexão (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Conexão Microsoft 365: xl:col-span-12`.

```text
| Conexão Microsoft 365                                               |
| Organização Microsoft confirmada | Domínio                           |
| Estado | Última atualização | Razão sanitizada                   |
| [Conectar] ou [Desconectar], quando aplicável                        |
```

#### Anatomia dos blocos desta faixa

**Conexão Microsoft 365 — card de conexão**

```text
Conexão Microsoft 365
Organização Microsoft confirmada | Domínio
Status da conexão
Última atualização / frescor
Razão sanitizada, quando aplicável
Botão Conectar ou Desconectar
```

- Regiões internas: identidade externa confirmada e domínio aparecem antes do status quando existirem; estado, frescor e razão aparecem em seguida; a ação fica no rodapé. Não há gráfico, KPI ou progresso inventado.
- Estado e fonte: `available` para `admin` de customer. Representa `pending_consent`, `verifying`, `connected`, `consent_required`, `revoked`, `error` e `disconnected` com descrição factual.
- CTA: `Conectar` abre um diálogo de consentimento nos estados que permitem nova autorização, inclusive `disconnected`, `revoked`, `consent_required` e `error`; quando houver tentativa pendente, `Reiniciar consentimento` abre o mesmo diálogo com `restart`. O diálogo oferece `Continuar com o tenant Microsoft padrão` e `Informar outro tenant Microsoft`; esta última revela o campo obrigatório `Microsoft Entra Tenant ID`, aceita somente GUID e exibe o link externo “Como localizar o Tenant ID no Microsoft Entra”. A opção padrão usa `organizations`; a específica direciona o consentimento ao GUID informado. Em `verifying`, não há CTA genérico de repetição. Em `connected`, exibe somente `Desconectar`: abre confirmação acessível, posiciona foco no diálogo, descreve que futuras sincronizações deixam de ser elegíveis e que histórico/frescor permanecem, e oferece `Cancelar`/`Confirmar desconexão`. Durante envio, anuncia processamento; o retorno exibe estado factual ou erro sanitizado.

### Faixa 3 — disponibilidade dos dados dependentes (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Disponibilidade dos dados Microsoft 365: xl:col-span-12`.

```text
| Disponibilidade dos dados Microsoft 365                              |
| Estado de disponibilidade | motivo | último dado histórico/frescor    |
```

#### Anatomia dos blocos desta faixa

**Disponibilidade dos dados Microsoft 365 — painel de disponibilidade**

```text
Disponibilidade dos dados Microsoft 365
Motivo explícito de indisponibilidade/restrição
Última atualização dos dados históricos, quando existir
```

- Regiões internas: motivo, estado e frescor. Quando a conexão estiver íntegra, o painel pode ser omitido por não comunicar indisponibilidade.
- Estado e fonte: `unavailable` ou `restricted` para conexão ausente, revogada, sem consentimento, erro ou restrição de infraestrutura. Preserva a data de dados históricos quando ela existir; nunca substitui a ausência por zero ou conjunto vazio.

---

## 05. Usuários do customer

Administração do tenant `customer` pelo seu `admin`, sem seletor de tenant.

### Faixa 1 — contexto e convite (duas regiões)

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; `Usuários: md:col-span-1 xl:col-span-8`; `Convidar pessoa: md:col-span-1 xl:col-span-4`.

```text
| 2/3 Usuários                              | 1/3 Convidar pessoa |
| título + contexto do tenant atual         | ação primária       |
```

#### Anatomia dos blocos desta faixa

**Usuários — cabeçalho de página**

```text
Usuários
Contexto: acesso da organização atual
```

- Regiões internas: título e contexto; não expõe outro tenant nem permite sua troca.
- Estado e fonte: `restricted` para `member`; uma rota acessada diretamente devolve mensagem de acesso negado sem dados administrativos.

**Convidar pessoa — ação de criação**

```text
Botão Convidar pessoa
```

- Regiões internas: ação textual que abre formulário de e-mail e `role` prevista (`admin` ou `member`); o `purpose=access` é interno e não substitui a capacidade. Validação comunica bloqueio para membership ativa ou convite pendente/aceito.
- Estado e fonte: `available` apenas a `admin` do customer. Durante envio, bloqueia duplicidade e informa processamento.

### Faixa 2 — usuários (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Usuários: xl:col-span-12`.

```text
| Usuários                                                               |
| Nome | E-mail | Capacidade | Status | Ação                           |
| ...                                                                    |
| paginação, se necessária                                                |
```

#### Anatomia dos blocos desta faixa

**Usuários — tabela operacional**

```text
Usuários
Cabeçalho: Nome | E-mail | Capacidade | Status | Ação
Linhas: membro ativo ou revogado; ação Revogar acesso para ativo e Ativar acesso para revogado quando permitida
Rodapé: total e paginação, quando aplicável
```

- Regiões internas: tabela com rótulos e ações textuais; no móvel, rolagem horizontal ou registros empilhados com os mesmos rótulos.
- Estado e fonte: `available` para dados do tenant atual. Revogar e ativar acesso pedem confirmação com consequência explícita. Ativar acesso pode ser bloqueado quando a pessoa já tiver acesso ativo em outra organização.

### Faixa 3 — convites pendentes (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Convites pendentes: xl:col-span-12`.

```text
| Convites pendentes                                                    |
| E-mail | Capacidade | Expira em | Entrega | Ação                         |
| ...                                                                    |
```

#### Anatomia dos blocos desta faixa

**Convites pendentes — tabela operacional**

```text
Convites pendentes
Cabeçalho: E-mail | Capacidade | Expira em | Entrega | Ação
Linhas: convite pending; ação Cancelar convite; URL recuperável só ao iniciador
```

- Regiões internas: colunas distinguem validade de entrega. A URL recuperável, quando autorizada, é ação/controle de cópia contextual da linha, não conteúdo de célula padrão ou dado de listagem compartilhada.
- Estado e fonte: inclui somente `pending`; convites `revoked` não são exibidos, conforme T045. Convites expirados/cancelados e falha de entrega são descritos factualmente no feedback ou histórico permitido, sem reexpor URL. Cancelar exige confirmação.

---

## 06. Usuários do platform

Visão exclusiva de `admin` do tenant `platform` para administrar quem opera o control plane. Não lista customers nem expõe dados do data plane.

### Faixa 1 — contexto e convite (duas regiões)

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; `Usuários: md:col-span-1 xl:col-span-8`; `Convidar administrador da plataforma: md:col-span-1 xl:col-span-4`.

```text
| 2/3 Usuários                              | 1/3 Convidar administrador |
| contexto do control plane                  | e-mail + ação               |
```

**Usuários — cabeçalho de página**

```text
Usuários
Contexto: administradores que operam exclusivamente o control plane
```

**Convidar administrador da plataforma — ação de criação**

```text
E-mail [campo]
Contexto: capacidade fixa Administrador
[Convidar administrador]
```

- Estado e fonte: ambos ficam `available` somente para `admin` ativo do `platform`; o convite emitido é sempre individual `role=admin`/`purpose=access` e usa o lifecycle comum de sete dias.

### Faixa 2 — usuários (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Usuários: xl:col-span-12`.

**Usuários — tabela operacional**

```text
Usuários
Nome | E-mail | Perfil de acesso | Status | Ação
```

- Estado e fonte: lista memberships `admin` do tenant `platform`, ativas e revogadas. Revogar acesso exige confirmação e só está disponível para acesso ativo; a ação do último administrador ativo é negada com explicação compreensível. Ativar acesso exige confirmação e só está disponível para acesso revogado quando a pessoa não possui acesso ativo em outra organização.

### Faixa 3 — convites pendentes (uma região)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; `Convites pendentes da plataforma: xl:col-span-12`.

**Convites pendentes da plataforma — tabela operacional**

```text
Convites pendentes
E-mail | Expira em | Entrega | URL recuperável | Ação
```

- Estado e fonte: lista somente convites `admin/access pending` do `platform`; a URL é copiável apenas pelo iniciador autorizado enquanto pendente. Cancelar exige confirmação e elimina a possibilidade de aceite e recuperação.

---

## Decisões explícitas

- A fonte visual primária está ausente; as seis superfícies e seus títulos foram aprovados como decisão de implementação, com exceção de `Convite do administrador`, título explicitamente definido pelo usuário.
- Convites têm dimensões independentes: `role=admin|member` define a capacidade após aceite; `purpose=customer_bootstrap|access` define o motivo/lifecycle. O primeiro admin customer usa `admin/customer_bootstrap`; todo admin adicional usa `admin/access`; membros usam `member/access`.
- A tela **Aceitar convite** replica a composição da tela de registro existente e mostra, como campos somente leitura, `Nome do tenant` e `E-mail convidado`, antes de `Senha` e `Confirmar senha`.
- O shell mostra somente a identificação passiva `Organização atual: {nome}`; o V1 não contém seletor, troca, rota ou subdomínio de tenant.
- Em conexão Microsoft, `Conectar` abre o diálogo de escolha entre authority padrão e Tenant ID Entra específico nos estados que autorizam nova tentativa (`disconnected`, `revoked`, `consent_required` e `error`); `Reiniciar consentimento` usa o mesmo diálogo somente em `pending_consent`; `Desconectar`, com confirmação acessível, aparece somente em `connected`. Em `verifying`, não há tentativa genérica.
- Não há dashboard, KPI, gráfico ou progresso nesta entrega porque nenhuma fonte sustenta essas visualizações.

## Divergências e pendências

- Não há referência visual do sponsor. A validação futura com o sponsor pode alterar títulos, agrupamentos e proporções sem reinterpretar as regras de segurança já aprovadas.
- A aparência detalhada de loading, erro e responsividade não é canônica em `docs/DESIGN-orkestria.md`; as regras deste documento são decisões explícitas para esta implementação.
- A decisão autoriza o CTA `Conectar`, mas a implementação ainda deve restringi-lo às transições permitidas pelo backend e comunicar razão sanitizada; nenhum botão pode inferir que uma falha de infraestrutura foi resolvida.

## Verificação de coerência

- As seis superfícies aprovadas estão representadas: aceite, organizações/detalhe, conexão Microsoft, usuários do customer, usuários do platform e identidade passiva do shell.
- Cada faixa declara contêiner, `gap`, breakpoints, spans e diagrama compatíveis com sua anatomia.
- Não há gráficos nesta representação; os cards e tabelas não usam tipos visuais como substitutos de títulos de negócio.
- Estados de convite, conexão, disponibilidade, restrição e dados históricos permanecem explícitos e não usam zero ou vazio como substituto de informação ausente.
