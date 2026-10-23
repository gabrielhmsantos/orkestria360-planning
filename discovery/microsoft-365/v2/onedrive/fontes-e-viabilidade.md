# Fontes e viabilidade — OneDrive

Este arquivo é o índice das evidências técnicas do módulo. O mapping canônico
de cada fato fica no arquivo `fontes-e-viabilidade.md` da respectiva aba; status
e bloqueadores consolidados estão em
[`backend-coverage-review.md`](backend-coverage-review.md). As rotas e
permissões externas estão nos `api.md` e `openapi.yaml` por superfície.

## Índice por superfície

| Superfície | Principais fontes e uso | Mapping técnico |
| --- | --- | --- |
| Dashboard Executivo | Composição das projeções locais das demais abas; sem endpoint próprio. | [Fontes e derivações](dashboard-executivo/fontes-e-viabilidade.md) |
| Contas e Armazenamento | Graph Reports de uso, diretório `/users`, snapshots locais e projeção de storage já usada em Licenciamento. | [API](contas-e-armazenamento/api.md) · [Mapping e histórico](contas-e-armazenamento/fontes-e-viabilidade.md) |
| Arquivos e Conteúdo | Graph root delta, atividade por intervalo admitida e versões paginadas; extração controlada de labels; lixeira beta aceita, sem `200` real observado. | [API](arquivos-e-conteudo/api.md) · [Mapping e limitações](arquivos-e-conteudo/fontes-e-viabilidade.md) |
| Compartilhamento e Acessos | Permissões Graph por item para estado atual; Management Activity API para eventos de auditoria. | [API](compartilhamento-e-acessos/api.md) · [Mapping e histórico](compartilhamento-e-acessos/fontes-e-viabilidade.md) |
| Atividade e Sincronização | Reports por período, auditoria para métricas distintas, saúde diária Health/Errors e inventário Intune independente; benefícios C3/C4 reutilizam ocupação canônica, KFM e classificados C2; C6 usa auditoria para arquivos compartilhados distintos e inatividade usa ActivityUserDetailD180 da pessoa. | [API e schema externo](atividade-e-sincronizacao/api.md) · [Mapping e limites](atividade-e-sincronizacao/fontes-e-viabilidade.md) |
| Usuários Desligados e Retenção | Identidade/relatório, permissões atuais para exposição e projeção default aprovada de casos técnicos após 7 dias de bloqueio; sem HR e sem inventar etapas humanas. | [API](usuarios-desligados-e-retencao/api.md) · [Mapping e fonte operacional](usuarios-desligados-e-retencao/fontes-e-viabilidade.md) |
| Configurações e Segurança | Secure Score, settings SharePoint, alerts/Defender, Intune e catálogos Purview com limites de autenticação; Resumo de Riscos C5 usa arquivos atuais; C7 alertas criados D30; C8 arquivos pelo fim nominal combinado de retenção. | [API](configuracoes-e-seguranca/api.md) · [Mapping e lacunas de política](configuracoes-e-seguranca/fontes-e-viabilidade.md) |
| Histórico e Auditoria | Office 365 Management Activity API, provider separado do Graph, com publicação local incremental; C9 seleciona Alto/Crítico24h e o KPI de links anônimos exige AnonymousLinkCreated. | [API](historico-e-auditoria/api.md) · [Mapping, retenção e derivados](historico-e-auditoria/fontes-e-viabilidade.md) |

## Cobertura Graph validada

As operações Graph Reports `getOneDriveUsageAccountDetail`,
`getOneDriveActivityUserDetail` e `getOneDriveUsageFileCounts` foram observadas
em coleta técnica sanitizada: a chamada Graph retornou `302`, seguida pelo
download `200 application/octet-stream`. Os schemas CSV, colunas, tipos e
limitações observadas estão documentados em [APIs — OneDrive, schemas CSV
observados](api.md#schemas-csv-observados--d30). Essa validação confirma o
contrato externo observado, não consentimento, cobertura de todos os tenants,
persistência ou implementação de collector.

## Semânticas de coleta transversais

Fechamento A1–A8: OpenAPI conformes; atividade separada por conjuntos de
auditoria; fontes configuradas por perfil local; operações canônicas
versionadas; partição C1 aceita; saúde diária e populações separadas C2 aceitas;
estatística de acesso com admissão de completude; versões por IDs distintos.
O Simulator concluiu os gates A7/A8 com87operações no inventário. O mapping
canônico continua por aba; estes resultados não são backend implantado.

Fechamento B1–B3: C3/C4 aceitas A definem os três benefícios sem criar fonte de
backup ou taxa de sucesso de tentativas; C5 aceita A define arquivos atuais
únicos como população do Resumo de Riscos. Reutilizar projeções canônicas e
seus metadados, sem leituras por tela. B3 amplia a mesma operação de atividade
por usuário no Simulator para D7/D30/D90/D180, com CSV11colunas e período
correspondente, geração/inventory/validate/import/smoke aprovados. Observação
real anterior continua limitada a D30 para esse detalhe; os outros períodos
não são declarados observados em tenant por causa da cobertura sintética.

### Convergência técnica e decisões C6–C9 —2026-10-15

C6 publica arquivos únicos com atividade de compartilhamento registrada,
com conjuntos diários400dias, resultado desconhecido explícito e comparação
somenteD30. C7 conta IDs de alertas criados em30dias, qualquer classificação/
status, com evidência do escopo OneDrive/SharePoint. C8 conta arquivos atuais
pelo fim nominal combinado resolvido em datasUTC de hoje até+15inclusive.
C9 admite somente eventos Alto/Crítico24h, maior risco/recência, até5IDs antes
dos filtros; a interseção não repõe eventos. As quatro propostas foram aceitas
pelo usuário; detalhes e ausência são canônicos por aba.

Correções sem nova decisão: Links Anônimos Criados só AnonymousLinkCreated;
exposição de desligados usa permissões atuais; usuários licenciados sem
atividade usam **atividade da pessoa** em ActivityUserDetailD180 e identidade
canônica, corte>90dias, nunca a data de uso do espaço de propriedade. Reports
de uso D180 e datas de Activity entre períodos foram corrigidos no Simulator;
todos os gates passaram, sem nova observação tenant. Faixas analíticas,
forecast e intervalos decimais de scores estão explícitos nos contratos.

### Estratégia operacional default de leitura

As cadências são escolhas técnicas dentro das faixas descritas pelo DOCX; não
criam comandos de administração na UI. Reutilizar identidade, licenças, Reports,
settings, Intune e Secure Score já canônicos no Orkestria, evitando consultas
iguais em collectors separados para cada aba.

| Fonte/publicação | Cadência e tratamento |
| --- | --- |
| Auditoria | Polling a cada 15 min; subscription/start somente no controle operacional inicial quando necessário. Watermark pela disponibilidade do blob, deduplicação pelo ID de evento e ordenação de domínio pelo instante de evento. |
| Permissões/exposição atual | Atualização a cada 6h no escopo de conteúdo selecionado; snapshots diários para comparação/histórico e último snapshot íntegro por mês para a tendência. |
| Diretório, licenças, uso/capacidade, settings e avaliações | Reusar publicação canônica diária. Guardar data de referência da fonte e instante de coleta separadamente; receber novamente o mesmo relatório não cria nova história. |
| Data Connect | Importar cada export diário completo e admitido pelo perfil de schema. Client OneDrive e Intune mantêm fontes/coberturas independentes. |
| Conteúdo | Q5 definiu B: bootstrap completo de todos os drives elegíveis, delta diário, revisão completa de críticos semanal; prioridade técnica em camadas sem limitar universo do produto. Permissões dos compartilhados 6h, lixeira diária e labels suportados em lotes declarados, incrementais após baseline. |

Auditoria fica stale após 1h sem leitura bem-sucedida; permissões após 12h;
publicações diárias após 48h sem referência nova esperada. Esses limites são
freshness da projeção, não inatividade de pessoa/dispositivo. Uma coleta vazia
íntegra é sucesso; ausência/falha da coleta preserva a última publicação como
stale ou falha/restrição sem dado, conforme os estados aprovados.

Publicar por fonte/aba geração consistente, período, população avaliada,
completude de paginação e motivos de exclusão. Não promover antes de concluir
as páginas necessárias; falha de uma origem não destrói blocos de outras
origens. Mudança de versão de regra/schema invalida comparações incompatíveis.
`429` respeita `Retry-After`; `5xx`/timeout usam retentativa progressiva limitada.
`401`/`403` suspendem a fonte afetada e registram pré-requisito, sem zero de
domínio. `410` de delta exige novo baseline antes de voltar a afirmar
completude. Não substituir dado faltante pela fixture.

### História, primeira publicação e expiração

A retenção aceita é 90 dias de eventos/JSON sanitizado, 400 dias de snapshots
diários e 13 meses de rollups mensais. A implementação terá poda diária local;
ela não executa exclusão no Microsoft 365. Série de 12 meses usa somente meses
com observação factual e inclui a data de referência de cada ponto. Reports
agregados históricos podem inicializar apenas os fatos/datas que realmente
publicam; uma fotografia D180 não recria histórico mensal por conta.

No primeiro ciclo, publicar blocos já avaliáveis e manter baseline D30/tendência
ausentes ou parciais até existir história suficiente. Não aguardar um ano para
iniciar implementação nem preencher meses não coletados. Forecast reutiliza
a fórmula e confiança já aprovadas em Contas (2–6 snapshots); não precisa de
novo modelo sugerido. A política de risco e a configuração local de retenção
ficam versionadas conforme [defaults aceitos](backend-defaults-e-clarificacoes.md).

### Responsabilidade de adapters e controllers

Adapters/consumidores externos respeitam os formatos Microsoft de `api.md` e
`openapi.yaml`. Controllers locais publicam o contrato semântico da aba/bloco,
após normalização e autorização tenant-scoped. A fixture semântica ajuda a
entender esses contratos; não é um endpoint monolítico nem dado de produção.

- Relatórios Graph em CSV usam `302` e URL pré-autenticada. O download seguinte
  é GET sem `Authorization`; a URL e o CSV bruto não são persistidos. `302` é
  parte do fluxo de sucesso, enquanto erro, restrição, falta de provisionamento
  e coleção vazia são resultados distintos.
- `@odata.nextLink`, `@odata.deltaLink`, `NextPageUri` e `contentUri` são
  opacos. O collector deve seguir a paginação/documentar watermark, sem expor
  links externos ou tratar ausência de uma página como coleção completa.
- Dados históricos, comparações e tendências são publicações locais derivadas
  de snapshots/eventos retidos. Um endpoint de estado corrente ou relatório de
  janela móvel não reconstrói, sozinho, histórico de meses anteriores.
- As observações GET foram sanitizadas e limitam-se a status, schema e
  nulabilidade. Um `200` numa conexão não comprova permissão, cobertura ou
  disponibilidade em qualquer tenant; `401`, `403`, `404` e `429` não equivalem
  a zero.

## Limitações consolidadas

- O projeto aceita Graph `/beta`; a ressalva Microsoft de suporte da rota de
  lixeira fica registrada como risco conhecido, não como bloqueio. Ainda não foi
  observado `200` para `/beta/sites/{site-id}/recycleBin/items` porque faltaram
  `site-id` resolvido e `Files.Read.All` na conexão. A alternativa SharePoint
  REST em Previous Versions segue sem validação para SPO/app-only e não é
  necessária enquanto a rota beta aceita for usada.
- O catálogo Learn lista Errors_v1 e aponta ao schema intitulado v0. A
  clarificação 3 aprovou perfil oficial imutável e primeira extração admitida
  no onboarding, sem presumir equivalência. A série mensal mede o último
  snapshot de erros reportados em 30 dias, sem somar janelas sobrepostas.
- Casos técnicos sem HR e baselines locais foram aprovados. Fatos humanos de
  workflow continuam opcionais/desconhecidos. Os valores Microsoft atuais
  continuam exigindo fonte; exports complementares por certificado têm perfil
  de admissão e primeira leitura, sem alegação de execução nesta investigação.
  Quarentena/vencimentos mantêm universos e limites aprovados; R5 substitui
  quantidade/ocupaçãoPHL do card por arquivos atuais com retenção comprovada
  e seu volume corrente. PHL permanece fato físico independente. R3 separa
  dispositivos/clientes Health e erros reportados na tendência mensal.
- A cobertura sintética do Simulator não altera APIs externas nem é prova de
  integração em produção. Divergências de query, parâmetros ou autenticação
  ficam listadas no relatório de backend e nas fontes da superfície.
- C2 substitui expressamente estados instantâneos por saúde diária reportada;
  não há ponte presumida Health–Intune. A7 exige zero explícito e cobertura
  íntegra: `200`/vazio, ausência de access e incompleteData não provam sem uso.
  Detector>365 permanece condicional à evidência contínua, não à idade do
  ledger. Falta de dado mantém disponibilidade própria sem fallback sintético.
