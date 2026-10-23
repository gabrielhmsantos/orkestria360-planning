# Research: Grupos Microsoft 365 V2

## Decisions

### Reutilizar o conector Graph e a fotografia geracional existentes

**Decision**: estender `GraphClient` e `GraphDataClient` e criar o domínio
`Services/Microsoft365/Groups`; sincronizar em uma geração `staging` que só é
promovida a `published` após êxito.

**Rationale**: Usuários e Contas já usa esse padrão para lock por tenant,
cursor delta, promoção atômica, recuperação de 410 e leitura consistente. A
documentação Laravel confirma o uso de `Cache::lock`, agendamento de commands e
transações para evitar execuções concorrentes e publicação parcial.

**Alternatives considered**: chamadas Graph diretas na página (rejeitada:
frescor e cobertura não seriam consistentes); novo cliente Graph (rejeitada:
duplicaria paginação, retry e autenticação); reutilizar somente a projeção de
associações de Usuários (rejeitada: não é catálogo canônico de grupos).

### Persistir somente a evidência temporal necessária

**Decision**: persistir catálogo atual e relações; manter snapshots para
atividade, licenciamento e ciclo de vida, e eventos normalizados para auditoria.

**Rationale**: a spec exige tendências e histórico nesses recortes, mas não
exige histórico universal de atributos de diretório. A abordagem mantém o POC
menor e permite declarar cobertura/frescor por fonte.

**Alternatives considered**: histórico de todos os atributos e relações
(rejeitado: custo e retenção sem valor validado); somente leitura atual
(rejeitado: inviabiliza tendência e auditoria).

### Modelar disponibilidade por fonte, não como zero

**Decision**: cada coletor registra disponibilidade, cobertura, atualização,
frescor e motivo sanitizado; `403`, licença ausente, 404, resposta vazia,
falha transitória e `coming_soon` permanecem semânticas distintas.

**Rationale**: os contratos de discovery distinguem explicitamente acesso
restrito, fonte indisponível, resposta vazia válida e filtro sem correspondência.
Isso cumpre FR-004 e FR-005 sem fabricar resultados.

**Alternatives considered**: um status global da página (rejeitado: uma fonte
parcial não pode derrubar as demais); omitir blocos indisponíveis (rejeitado:
perde a finalidade e a condição habilitadora).

### Usar props Inertia e abas finas com filtros na URL

**Decision**: `GroupsPageData` fornece um contrato tipado para uma página
Inertia fina; abas, filtros e paginação preservam a query string e o contexto ao
abrir um detalhe.

**Rationale**: é o padrão atual do módulo. A documentação Inertia confirma que
visitas podem preservar contexto visual, enquanto o módulo existente já usa
rotas e componentes por aba. Isso permite links compartilháveis e testes de
recorte.

**Alternatives considered**: API pública separada (rejeitada: não há consumidor
externo); estado global de filtros no navegador (rejeitado: enfraquece links,
atualização e testes de URL).

### Encapsular gráficos e garantir equivalente textual

**Decision**: usar wrappers de gráfico existentes, `ResponsiveContainer`,
legenda/valores e resumo textual em cada painel analítico.

**Rationale**: o design system exige que tooltip, cor ou eixo não sejam a única
fonte da conclusão. A documentação Recharts confirma responsividade por
container e suporte de acessibilidade para navegação por pontos; a legenda e o
resumo asseguram leitura equivalente.

**Alternatives considered**: gráficos diretamente nas abas sem wrapper
(rejeitado: acopla o domínio à biblioteca); gráfico sem resumo textual
(rejeitado: falha FR-010).

### Manter audiência única e ações mutáveis fora do escopo

**Decision**: reutilizar apenas `auth` e `verified`; todos os usuários criados
e autenticados veem os mesmos dados disponíveis. Mutações, revisões executáveis,
simulação e exportação não recebem endpoints nesta V2.

**Rationale**: a constituição v2.2.0 estabelece audiência única. O discovery
classifica ações mutáveis como `coming_soon` até haver autorização operacional,
confirmação, segregação e auditoria aprovadas.

**Alternatives considered**: RBAC/perfis (rejeitado: decisão de produto fora do
escopo); botões que chamam escrita no tenant (rejeitado: viola FR-009).

## Sources Consulted

- `discovery/microsoft-365/v2/grupos/` — produto, decisões e contratos de cada
  superfície.
- Implementação de `UsersAccounts` e `Licensing` no repositório da aplicação.
- Documentação atual de Laravel 13, Inertia e Recharts consultada via Context7.
- A consulta Context7 para Microsoft Graph falhou transitoriamente; os contratos
  Graph já validados no discovery permanecem a referência de planejamento.
