# Feature Specification: Relatórios Microsoft 365 V1

**Feature Branch**: `feat/013-m365-relatorios`
**Created**: 2026-09-02
**Status**: Ready for implementation
**Input**: discovery aprovado em `discovery/microsoft-365/v2/relatorios/`.

## User Scenarios & Testing

Cada história usa a [representação estrutural](../../discovery/microsoft-365/v2/relatorios/ui-blueprint.md)
como contrato visual. A ordem US1–US8 abaixo é canônica também em `tasks.md`.

### User Story 1 — Dashboard Executivo (Priority: P1)

Como `member` ou `customer admin`, quero compreender postura, adoção, riscos e
relatórios locais publicados.

**Cards:** `Síntese de postura`; `Evolução e adoção`; `Riscos e oportunidades`;
`Relatórios recentes e agenda`.

**Independent Test:** uma fonte publicada exibe valor, período, cobertura e
frescor; Health Score sem fonte é `unavailable`, sem número, meta ou variação.

### User Story 2 — Catálogo de Relatórios (Priority: P1)

Como pessoa usuária do customer, quero localizar template e entender requisitos
atuais antes de solicitar geração.

**Cards:** `Filtros`; `Templates`; `Requisitos`.

**Independent Test:** catálogo expõe os três templates, formatos, PII e estado
atual por tenant+conexão, sem chamada externa nem reutilização de manifesto.

### User Story 3 — Relatórios Executivos (Priority: P2)

Como `customer admin`, quero consultar composição executiva e metodologia sem
receber formato ou conteúdo não aprovado.

**Cards:** `Lista de templates`; `Metodologia/fontes`; `Progresso futuro`;
`Formato não aprovado`.

**Independent Test:** fontes e limitações são exibidas; PDF, PPTX e IA continuam
`coming_soon` e não iniciam operação.

### User Story 4 — Relatórios Operacionais (Priority: P1)

Como pessoa autorizada, quero consultar dado publicado e fazer uma única entrega
CSV/XLSX no exato escopo da prévia.

**Cards:** `Filtros`; `Consulta`; `Detalhe restrito`; `Metodologia`.

**Independent Test:** o download one-shot cria stream/hash/metadados pelo
manifesto e encerra o request; nova tentativa não tem arquivo, URL ou download.

### User Story 5 — Relatórios de Segurança e Compliance (Priority: P2)

Como pessoa usuária, quero consultar evidências e limites por fonte sem
certificação, Health Score alternativo ou taxa de conformidade.

**Cards:** `Postura por fonte`; `Controles/evidências`; `Distribuição`;
`Limitações`.

**Independent Test:** Secure Score publicado conserva cobertura; Health Score,
Economia anual sem Assessment e Conformidade são `unavailable`.

### User Story 6 — Construtor de Relatórios (Priority: P1)

Como `member`, quero compor template, blocos, período permitido e filtros allowlisted,
validar o preflight, aceitar a solicitação e pré-visualizar a fotografia.

**Cards:** `Etapas`; `Filtros e seleção`; `Prévia e origem`; `Ação indisponível`.

**Independent Test:** required bloqueia no preflight; degradable só segue como
parcial marcada; alteração material exige novo preflight, request e manifesto.

### User Story 7 — Agendamentos e Distribuição (Priority: P3)

Como pessoa usuária, quero reconhecer capacidades futuras sem iniciar envio,
agenda, aprovação, retenção ou distribuição.

**Cards:** `Estado de recorrência`; `Lista`; `Canal não habilitado`;
`Segurança/retenção`.

**Independent Test:** consultar CTAs future não cria job, destinatário, arquivo
ou canal externo.

### User Story 8 — Histórico e Auditoria (Priority: P1)

Como `customer admin`, quero auditar request, manifesto, resultado e hash
sanitizados sem acessar arquivo nem outro data plane.

**Cards:** `KPIs`; `Filtros/tabela`; `Detalhe`; `Evento sem evidência`.

**Independent Test:** somente tenant+conexão autorizados retornam registros;
platform admin, outra tenant e outra conexão não recebem data plane.

## Edge Cases

- Ausente, restrito, anônimo, incompleto ou cobertura incompatível nunca vira
  zero nem relatório completo.
- Preflight bloqueado não cria request. Aceite cria request e manifesto; fonte
  alterada, substituída ou removida depois do aceite não muda
  prévia/download daquela solicitação.
- A Taxa de adoção é `unavailable` sem as duas publicações append-only da mesma
  geração, período compatível, cobertura compatível ou denominador positivo.

## Functional Requirements

- **FR-001:** Expor as oito superfícies e os cards exatos acima, preservando
  `available`, `unavailable`, `restricted` e `coming_soon`.
- **FR-002:** Toda saída declara fonte, período, cobertura, frescor e razão de
  indisponibilidade quando aplicável.
- **FR-003:** Catálogo usa somente publicações/source states atuais do mesmo
  `tenant_id` + `microsoft_connection_id`; não usa manifesto passado.
- **FR-004:** O catálogo fechado V1 é o de [catalogo-v1.md](contracts/catalogo-v1.md):
  `operational-usage`, `operational-licensing` e `security-posture`, seus cinco
  blocos, filtros, PII, requisito e parcialidade definidos.
- **FR-005:** Builder aceita somente definição global fechada/versionada;
  proíbe SQL, GraphQL, query Graph, fórmula arbitrária, código, HTML/JS, URL ou
  upload executável.
- **FR-006:** Preflight valida autorização, tenant, conexão, template, bloco,
  um de `D7`, `D30`, `D90` ou `D180`, filtros e requisitos. Required ausente/restrito bloqueia sem request;
  degradable só passa sob política parcial marcada.
- **FR-007:** Aceite cria `ReportRequest(preflight_passed)` e
  `ReportSourceManifest` imutável na mesma transação. Nesse único momento,
  resolve e valida a publicação permitida e congela sua proveniência, estado,
  cobertura, frescor, evidência, projeção e política. Prévia lê somente o
  manifesto; alteração, publicação mais nova ou remoção posterior da fonte não
  exige lookup, fallback ou novo preflight.
- **FR-008:** `POST /requests/{request}/download` é one-shot: faz
  `preflight_passed → generating → completed|failed`, gera stream exclusivamente
  pela fotografia congelada do manifesto, persiste artifact/metadados e evento;
  não relê nem exige a publicação-fonte. Segunda tentativa é rejeitada.
- **FR-008a:** CSV e XLSX são dois serializers das mesmas
  `ReportManifestSource.frozen_projection`; mantêm os mesmos headers, linhas,
  máscaras/PII, estado `required`/`degradable` e indicação de parcialidade. A
  geração calcula hash/tamanho sobre os bytes serializados que a resposta entrega.
  XLSX pode usar temporário local apenas na operação, removido em `finally` em
  sucesso ou erro, sem path, blob, URL ou storage persistente.
- **FR-009:** `ReportArtifact` é `UNIQUE(request_id)` e guarda apenas formato,
  tamanho, hash, resultado e entrega. Não persiste conteúdo, URL, token,
  storage, retenção, expiração ou download posterior.
- **FR-010:** Relatórios preserva granularidade, anonimização, máscara e
  autorização canônica em tela, prévia, stream e histórico; não reidentifica,
  não reconstrói identificadores e não faz fallback tenant/conexão.
- **FR-011:** `taxa-de-adocao` calcula `Office 365 Active ÷ população licenciada
  elegível × 100` somente entre `LicenseUsagePublication` e
  `LicensedPopulationPublication` append-only da mesma
  `publication_generation_id`, tenant, conexão e período permitido. Nunca lê snapshots ou
  assignments correntes.
- **FR-012:** Licenciamento publica uso, população e inventário no mesmo ciclo:
  uso contém
  período, workload, métrica, valor, estado, cobertura, `report_updated_at`,
  instante técnico/evidência; população contém contagem distinta, estado,
  cobertura/evidência e snapshot de `included_in_calculation`. Mudança futura da
  regra não altera geração histórica; inventário é uma fotografia append-only de
  SKU/capacidade/consumo/planos sem PII; `technical_synced_at` não é chave lógica.
- **FR-012a:** `routine` e `--force` coletam exclusivamente `D30`; `--force`
  apenas reexecuta essa coleta e publica nova geração append-only. A coleta
  histórica `--recollect-days=N` publica `D7`, `D30`, `D90` ou `D180` conforme
  `N=7|30|90|180`. Relatórios só aceita período com publicação local existente.
- **FR-012b:** `recollect_date` e `recollect_today` não convertem janela de
  calendário em período Graph e não coletam/publicam uso, população ou inventário
  de Relatórios. Eles não criam geração parcial, não sobrescrevem publicação
  factual anterior e não tornam uma publicação histórica `D30` indisponível;
  distinguem `not_collected` de falha da fonte e de ausência histórica utilizável.
- **FR-012c:** Retention/purge usa exclusivamente `app:prune-microsoft365` e
  `Microsoft365DataRetentionPruner`. `LicensingRetentionPruner` remove, por
  tenant, gerações de publicações elegíveis antes de remover seus
  `LicensingSyncRun`. Em janela, a elegibilidade é exclusivamente
  `published_at < cutoff`, sendo `published_at` o instante imutável de promoção
  compartilhado pelas três publicações de uma geração — nunca
  `technical_synced_at` nem `LicensingSyncRun.finished_at`. Preserva a última
  publicação factual necessária por escopo e nunca deixa a dupla uso/população
  de adoção quebrada. `all` remove todo esse data plane após os dependentes, sem
  atingir outro tenant.
- **FR-012d:** `ReportsRetentionPruner`, integrado ao agregador central, remove
  histórico de execução por cutoff em ordem de FK: seleciona somente requests
  `completed` ou `failed` com `completed_at < cutoff`. Requests
  `preflight_passed` e `generating` não entram na janela por idade. Mantém
  `report_configurations` correntes na janela normal. `all` remove todo data
  plane de Relatórios do tenant, mas nunca o catálogo global. Preview/histórico
  retidos usam a fotografia congelada, não a publicação de origem já removida.
- **FR-013:** Novas tabelas data plane materializam `tenant_id` e
  `microsoft_connection_id`, usam tipos reais nas FKs, FK composta de conexão,
  índices tenant-first e RLS `USING`/`WITH CHECK`. Referências heterogêneas de
  publicação usam `source_contract + source_record_id_text`, não FK UUID falsa:
  são somente proveniência/auditoria, jamais requisito de existência, fallback ou
  lookup runtime após o aceite.
- **FR-014:** Health Score, Economia anual sem Assessment e Taxa de conformidade
  ficam `unavailable`; Secure Score não substitui Health Score.
- **FR-015:** Agendamento, distribuição, e-mail, Teams, SharePoint, OneDrive,
  PDF, PPTX, IA, Management Activity API e builder livre são `coming_soon` ou
  fora de escopo, sem operação oculta.
- **FR-016:** `member` gera apenas template/filtros permitidos; `customer admin`
  mantém configuração local; `platform admin` mantém catálogo control-plane sem
  ler data plane.

## Success Criteria

- **SC-001:** em até três interações — acessar `Catálogo de Relatórios`,
  selecionar um template disponível e visualizar `Requisitos`/preflight — a
  pessoa usuária compreende o template e seus requisitos, sem fonte externa em
  request.
- **SC-002:** 100% das saídas informam fonte, período, cobertura, frescor e
  parcialidade quando houver degradação.
- **SC-003:** 100% dos required ausentes bloqueiam antes da criação de request.
- **SC-004:** 100% dos downloads concluídos deixam apenas hash/metadados/evento
  e recusam download posterior da mesma solicitação.
- **SC-005:** 100% das tentativas cross-tenant, cross-connection, PII ampliada,
  fallback ou geração histórica por snapshot mutável são recusadas.

## Assumptions and Scope

Licenciamento continua dono de coleta/publicação e Relatórios apenas compõe.
A V1 aceita `D7`, `D30`, `D90` e `D180` somente quando já publicados pelo
coletor local: rotina/`--force` publicam `D30`; `--recollect-days` publica o
período solicitado. Nenhuma decisão de produto do discovery é reaberta.
