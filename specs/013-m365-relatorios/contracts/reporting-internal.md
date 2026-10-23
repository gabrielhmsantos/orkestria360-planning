# Contratos internos — Relatórios

## Boundary e escopo

Relatórios é leitura/composição local: nenhuma rota chama Graph, Azure, Office
365 Management Activity API ou outro provedor. Data plane é sempre
`tenant_id + microsoft_connection_id`; as novas tabelas aplicam RLS e a FK
composta da conexão. `platform admin` opera catálogo global, nunca request,
manifesto, artifact, evento ou publicação do customer.

## Catálogo e preflight

`GET /microsoft-365/reports/catalog` retorna o catálogo fechado e avalia apenas
publicações/source states **atuais** da mesma tenant+conexão. Não cria/consulta
manifesto passado. Para uso/adoção, a V1 aceita publicações `D7`, `D30`, `D90`
e `D180` conforme o modo de coleta definido abaixo.

`POST /microsoft-365/reports/preflight` recebe template/versão, blocos, período e
filtros allowlisted. Ele normaliza, autoriza e devolve requisitos por bloco e
`can_accept`; não gera arquivo, request ou manifesto. Required ausente/restrito
retorna `can_accept=false`; degradable só passa quando o template autoriza saída
parcial explicitamente marcada.

## Aceite, manifesto e prévia

`POST /microsoft-365/reports/requests` recebe token opaco de preflight no mesmo
contexto tenant+conexão e formato permitido. Em transação, cria
`ReportRequest(state=preflight_passed)` e `ReportSourceManifest` imutável, com
versão do catálogo, parâmetros canônicos, estado, cobertura, frescor, PII/escopo
e hash indexado não único.

Cada `ReportManifestSource` materializa tenant/conexão e registra
`source_contract + source_record_id_text`. Somente no aceite, essa referência
tipada é resolvida na publicação local permitida e validada quanto a tenant,
connection, estado, geração, período, cobertura e autorização/PII; nenhuma FK
UUID é inventada para fontes bigint. A transação copia proveniência, geração,
estado/razão, cobertura, frescor, evidência permitida, `frozen_projection` e
`access_policy_snapshot`. Depois disso, `source_record_id_text` é apenas
proveniência/auditoria: não é FK, requisito de existência, lookup, fallback nem
reconstrução. Prévia usa apenas manifesto/fontes congelados; não relê a fonte,
não exige que o ID ainda exista e não troca por publicação mais nova. Alterar
template, bloco, período ou filtro exige novo preflight, request e manifesto.

## Download one-shot e auditoria

`POST /microsoft-365/reports/requests/{request}/download` só aceita request em
`preflight_passed`. Ele realiza `preflight_passed → generating`, gera CSV/XLSX
como stream usando exclusivamente `ReportSourceManifest` e
`ReportManifestSource.frozen_projection`, calcula hash/tamanho, cria um
`ReportArtifact` e evento sanitizado, depois termina em `completed` ou `failed`.
Não consulta, revalida ou resolve a publicação-fonte, portanto uma origem podada
ou uma geração mais nova não altera a saída. Falha persiste somente
request/evento sanitizado.

`UNIQUE(request_id)` garante no máximo uma evidência de entrega. Após tentativa
terminal, nova chamada download é recusada; uma nova entrega requer novo
preflight/request/manifesto. Não há blob, path, URL, token, storage, retenção,
expiração ou download posterior. Histórico retorna só metadados sanitizados no
mesmo tenant+conexão, inclusive `source_contract`, `source_record_id_text`,
`source_generation_id`, cobertura, frescor e evidência congelados; a origem já
removida não é erro histórico.

### Serialização e bytes de entrega

`ReportExportProjection` é construído uma vez a partir de
`ReportManifestSource.frozen_projection` e das políticas congeladas. CSV e XLSX
são apenas serializers dessa mesma projeção: mesmos headers/linhas, marcação de
parcialidade, `required`/`degradable` e mascaramento/PII. CSV é escrito com
`fputcsv`; XLSX usa `phpoffice/phpspreadsheet:^5.0`, uma worksheet nomeada pelo
template e `Writer\Xlsx::save($temporaryPath)`. Serializers não recebem models
nem executam lookup de publicação-fonte.

Cada serializer grava em temporário local controlado, com nome aleatório, durante
a requisição. Após fechamento, `filesize` e `hash_file('sha256', ...)` são
calculados sobre esse mesmo arquivo, que é transmitido byte a byte pela resposta;
somente então `ReportArtifact` recebe tamanho/hash. O callback de stream fecha
recursos e remove o temporário em `finally`, tanto em sucesso quanto após exceção.
Falha de serialização ou transmissão termina a request em `failed`, não cria
artefato de entrega e registra somente evento/erro técnico sanitizado. Não se
persiste nem registra path, URL, blob, token ou retenção.

## Adoção: contrato com Licenciamento

No ciclo técnico concluído, Licenciamento gera uma UUID
`publication_generation_id` e publica:

1. `LicenseUsagePublication`: período definido pelo modo de coleta, workload `Office 365 Active`, valor de
   `getOffice365ServicesUserCounts`, estado, cobertura, `report_updated_at`,
   instante técnico e evidência;
2. `LicensedPopulationPublication`: contagem distinta elegível, cobertura,
   estado, evidência e snapshot das SKUs `included_in_calculation`.
3. `LicenseInventoryPublication`: fotografia permitida por SKU de capacidade,
   consumo, disponibilidade, estado e planos, sem atribuições individuais.

As três publicações contêm tenant, Microsoft connection e `licensing_sync_run_id`
`BIGINT` do mesmo ciclo, com FK física do tipo real, além de `published_at`
`timestamptz NOT NULL`. `published_at` é atribuído uma única vez na promoção
canônica e é igual para toda `publication_generation_id`; rerun idempotente não o
altera. O manifesto de adoção fixa ambas pelo mesmo
`publication_generation_id`; `technical_synced_at` é apenas metadado, e nem ele
nem `LicensingSyncRun.finished_at` definem retention. Ausência, estado ruim,
escopo/período/cobertura incompatível, regra não
reproduzível ou denominador zero retorna `unavailable`. Relatórios nunca usa
`LicenseConsumptionSnapshot` ou `UserLicenseAssignment` correntes para repetir
uma solicitação aceita.

### Períodos por modo de coleta

`routine` e `--force` coletam e publicam **somente `D30`**. `--force` apenas
contorna a reutilização do ciclo; não altera o período. A coleta histórica
`--recollect-days=N` publica o período correspondente: `7 → D7`, `30 → D30`,
`90 → D90` e `180 → D180`. Relatórios aceita `D7`, `D30`, `D90` ou `D180` apenas
quando a respectiva publicação local existe para a mesma tenant+conexão.

`recollect_date` e `recollect_today` não chamam Graph Reports nem criam
`LicenseUsagePublication`, `LicensedPopulationPublication` ou
`LicenseInventoryPublication`: sua janela diária não é convertida em `D7`,
`D30`, `D90` ou `D180`. A etapa registra `not_collected` como semântica do modo,
sem falha da fonte e sem gerar uma `publication_generation_id` parcial. Ela não
altera nem invalida publicações anteriores; catálogo e preflight continuam usando
a última publicação factual elegível, ou retornam ausência histórica real.

## Retention/purge central

Somente `app:prune-microsoft365 {tenant_id} {window|all}` aciona a retenção.
`Microsoft365DataRetentionPruner` chama `LicensingRetentionPruner` estendido e
`ReportsRetentionPruner`, devolvendo contagens reais e separadas, por exemplo
`licensing_usage_publications`, `licensing_population_publications`,
`licensing_inventory_publications`, `reports_audit_events`, `reports_artifacts`,
`reports_manifest_sources`, `reports_requests`, `reports_manifests` e
`reports_configurations`. Nenhum aceita `microsoft_connection_id` da CLI; cada
pruner limita todas as consultas ao tenant informado e suas connections.

Na janela, Licenciamento só considera geração com `published_at < cutoff`;
preserva a última publicação factual de uso por período e métrica, a população
compatível de cada geração retida e o inventário factual mais recente; remove
gerações não ancoradas por inteiro e só depois runs sem referência. Relatórios
preserva configurações e só seleciona execução `completed`/`failed` com
`completed_at < cutoff`; `preflight_passed`/`generating` e manifesto não são
selecionados por idade. A remoção permanece audit events → artifacts → manifest
sources → requests → manifests.
Em `all`, ambos removem integralmente os respectivos data planes do tenant nessa
ordem. Catálogo global e conteúdo efêmero CSV/XLSX ficam fora do purge.
