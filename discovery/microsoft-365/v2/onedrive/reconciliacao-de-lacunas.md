# Reconciliação de lacunas — OneDrive

> **Registro histórico da preparação do frontend em setembro de2026.** As
> categorias desta matriz registram aquela etapa, anterior a `frontend_done`;
> não são a prontidão atual do backend. Contratos/mappings vigentes por aba,
> decisões Q/R/C aceitas e o adendo para a fonte real do
> [blueprint](ui-blueprint.md) prevalecem sobre exemplos/bindings históricos.
> O gate técnico atual está em [backend-coverage-review.md](backend-coverage-review.md).
> Em particular, C2 separa Health/Intune e substitui estados instantâneos; A7
> exige zero explícito e cobertura integral, sem inferir ausência de acesso de
> buckets omitidos/incompletos.

## Decisão

Esta matriz transforma as lacunas encontradas na revisão de cobertura em fatos
de dados explícitos. Ela não cria endpoints, fixtures, integração, persistência
ou frontend. Nesta etapa, a matriz classifica exclusivamente a prontidão para
fixture e UI: não autoriza criar collector, persistência, backend ou chamada de
provider pela tela. `fixture_ready` significa que o collector está aprovado por
fonte oficial e mapping; para providers HTTP, inclui contrato `SUPPORTED` no
Simulator, e para exportações não HTTP inclui schema/versionamento verificável
sem uma rota fictícia. Não exige a sua implementação de produção agora.
`mutation_approved` indica fonte e regra de
produto aprovadas para uma ação Graph cuja operação sintética é servida pelo
Simulator; ela ainda exige controles operacionais antes do coletor futuro,
enquanto a UI usa fixture sintética do contrato semântico. `source_unavailable` registra
que não há fonte Graph concreta para o fato; a UI só pode exercitar o estado
indisponível, sem valor sintético afirmativo.

## Dados necessários por superfície

| Superfície | Bloco | Dados necessários à fixture/UI | Regra de interpretação | Prontidão desta etapa |
| --- | --- | --- | --- | --- |
| Dashboard | resumo, armazenamento, utilização, ranking, risco e recomendação visuais | métricas e coleções sintéticas já publicadas | card/gráfico/lista preserva unidade, período e disponibilidade próprios | `frontend_implementation_ready` |
| Dashboard | atividade, compartilhamento, desligamento, departamento e Health Score detalhado | categorias/contagens/participação; catálogo das nove dimensões, pesos, pontuação, `asOf` e evidência | `Σ(peso × pontuaçãoDaDimensão / 100)`; dimensão sem coleta recebe `0` no próprio peso e não sai do denominador | `frontend_implementation_ready` |
| Contas | tabela e tendência | contas e tendência sintéticas já publicadas | utilização nula não invalida a distribuição coberta | `frontend_implementation_ready` |
| Contas | previsão, distribuições e detalhe por área | snapshots, crescimento, dias/data/confiança e blocos por área | previsão requer 2–6 snapshots, capacidade e crescimento positivo | `frontend_implementation_ready` |
| Arquivos | inventário, tipos, tamanhos, idades, extensões e pastas | itens e agregados sintéticos já publicados | delta sustenta inventário, tamanho e datas | `frontend_implementation_ready` |
| Arquivos | duplicidade exata | grupos e contagens sintéticos por `quickXorHash` | dois ou mais arquivos ativos do tenant com o mesmo hash não vazio; sem fallback por nome/tamanho | `frontend_implementation_ready` |
| Arquivos | risco de infecção | itens/agregados sintéticos da faceta `malware` | sinal factual de malware detectado; extensão de risco não é infecção | `frontend_implementation_ready` |
| Arquivos | descarte atual | itens de lixeira sintéticos por site pessoal, com data e localização de origem | `GET /beta/sites/{site-id}/recycleBin/items`; Graph beta, com disponibilidade/cobertura próprias | `frontend_implementation_ready` |
| Arquivos | sensibilidade por item | rótulos e métodos de atribuição sintéticos, vinculados ao catálogo | ação Graph v1.0 aprovada com lote/escopo explícito; o Simulator serve o POST sintético, enquanto o coletor real preserva os controles de metadado | `frontend_implementation_ready` + `mutation_approved` |
| Arquivos | acesso sem uso | itens ativos do snapshot e buckets diários de acesso sintéticos | Correção A7 vigente: exigir zero explícito em todos os buckets/ações que cobrem a janela, sem incompleteData/lacunas; coleção vazia/campo omitido não comprova zero. [Admissão atual](arquivos-e-conteudo/fontes-e-viabilidade.md#acesso-sem-uso) | `frontend_implementation_ready` histórico |
| Compartilhamento | snapshot, comparação D30, tendência, tipo de link e atenção | registros, série, `linkType`/`linkScope`, severidade, evidência e destino | não há filtro de data; permissions sustenta snapshot e auditoria sustenta histórico | `frontend_implementation_ready` |
| Atividade | KPIs e atividade D30; distribuição e evolução de sincronização/falhas | métricas D30, série `syncTrend` de 12 meses e listas sintéticas já publicadas | período de atividade não altera a evolução fixa de sincronização; não converter distribuição pontual em série temporal | `frontend_implementation_ready` |
| Atividade | filtro D7/D90/D180 e projections de atividade correspondentes | `activityByPeriod` tipado publica D7/D30/D90/D180, cada um com availability, resumo, tendência, departamento e metadados próprios | selecionar somente uma projection publicada; não derivar série/KPI local | `frontend_implementation_ready` |
| Atividade | dispositivo factual, gerenciamento, conformidade e sinal de risco | `deviceSources` e cada item publicam Intune, Sync Health e correlação com availability independente | `managedDevices` não descreve sessão nem sincronização do cliente OneDrive; cada origem preserva seu timestamp e availability | `frontend_implementation_ready` |
| Atividade | falhas detalhadas, versão de cliente, KFM e timestamps do cliente | Sync Health/Errors, chave opaca de dispositivo e agregados estão tipados na fixture | Graph Data Connect exporta snapshots diários ao ADLS; não é Graph REST nem telemetria do Intune; erro detalhado cobre 30 dias | `frontend_implementation_ready` |
| Desligados | casos, processo, retenção e transferências visuais | cenário sintético de workflow, sem comando mutável | workflow ainda não definido; a simulação não afirma estado Microsoft | `frontend_implementation_ready` |
| Segurança | score sintético, riscos, políticas e recomendações | fixture atual de score/políticas | somente leitura, sem correção de configuração | `frontend_implementation_ready` |
| Segurança | categorias/pesos/evidência do score e postura mapeada | catálogo por dimensão, `asOf` e disponibilidade | dimensão sem coleta recebe `0` no peso e permanece no denominador | `frontend_implementation_ready` |
| Segurança | catálogos de sensibilidade e retenção; conformidade/risco de dispositivo | rótulos de política e recorte Intune sintéticos | catálogo não prova aplicação por arquivo; Intune não cobre todo o tenant | `frontend_implementation_ready` |
| Segurança | ameaças explicitamente OneDrive/SharePoint | alertas Defender paginados com evidência de URL | só publica `urlEvidence.url` HTTPS em host SharePoint/OneDrive do tenant; título, produto e severidade não inferem vínculo | `frontend_implementation_ready` |
| Segurança | retenção aplicada por arquivo | rótulo e configurações sintéticos por item | `itemRetentionLabel` é leitura GET; resposta sem campos de rótulo permanece desconhecida | `frontend_implementation_ready` |
| Segurança | aplicação de sensibilidade por arquivo | rótulos e método de atribuição sintéticos | ação Graph controlada aprovada em Arquivos e Conteúdo; o Simulator serve o POST sintético e o coletor real preserva os controles de metadado | `frontend_implementation_ready` + `mutation_approved` |
| Segurança | DLP | achados, `serviceSource`, severidade, data e evidência de URL sintéticos | somente `alerts_v2` DLP com URL OneDrive/SharePoint; ausência de achado não afirma cobertura/política ou score conforme | `frontend_implementation_ready` |
| Auditoria | KPIs, tabela, gráficos e detalhe sintético | eventos e atributos sintéticos mapeados | `contentCreated` não ordena evento; campo não publicado é nulo | `frontend_implementation_ready` |
| Auditoria | allowlist tipada do detalhe e catálogos de fixture | 16 atributos aprovados no contrato, opções/defaults de filtros e cenário consistente | todos os filtros compartilham o recorte selecionado e não alteram os KPIs posicionados antes da barra | `frontend_implementation_ready` |

## Invariantes de publicação

1. Cada bloco data-backed inclui `asOf`, período/janela quando aplicável,
   cobertura, nulabilidade e `availability` próprios.
2. O fluxo de reports Graph é `302 → CSV` pré-autenticado; URL e conteúdo bruto
   são descartados. Erros de acesso não são convertidos em coleção vazia.
3. Delta só promove cursor após fotografia íntegra; tombstone e `410` exigem
   reenumeração idempotente.
4. Auditoria mantém cursor/watermark, deduplicação e ordenação pelo instante do
   evento; o detalhe expõe os campos aprovados pelo DOCX somente quando forem
   publicados, e as fixtures usam exclusivamente valores sintéticos.
5. Toda fonte é tenant-scoped e publicada somente depois de uma fotografia
   coerente; a interface nunca consulta provider externo.

## Handoff

- Fontes revalidadas nesta rodada: os relatórios D180 de contas, arquivos,
  atividade de usuários e atividade de arquivos; identidade de conta; delta de
  drive; permissões por item; usuários excluídos; Secure Score/perfis;
  configurações SharePoint e listagem de assinaturas da Management Activity API.
- O handoff ao Simulator reutilizou as operações já equivalentes para Secure
  Score, perfis, configurações e auditoria; incorporou as assinaturas
  pré-collector restantes, inclusive os relatórios agregados D180 e as formas
  externas por usuário de delta/permissões. A cobertura sintética não afirma
  existência de collector, dados publicados nem acesso de customer.
- A seleção futura de Purview, Defender ou Intune só ocorre quando um fato da
  tabela tiver unidade, período e agregação aprovados; então exige nova rodada
  `validate-graph` e handoff ao Simulator.
