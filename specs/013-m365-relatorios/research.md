# Research — Relatórios Microsoft 365 V1

## Decisions

### Publicações locais
**Decision**: telas usam somente fatos/source states publicados. **Rationale**: preserva isolamento, frescor e não duplica coleta. **Alternative rejected**: chamar Graph em request.

### Adoção reproduzível
**Decision**: `LicenseUsagePublication`, `LicensedPopulationPublication` e
`LicenseInventoryPublication` são append-only, compartilham
`publication_generation_id` e congelam uso, população, inventário e
`included_in_calculation`. **Rationale**: `LicenseConsumptionSnapshot`,
`LicenseInventorySnapshot` e `UserLicenseAssignment` são mutáveis.
**Alternative rejected**: consultar atribuições, inventário ou consumo corrente
por timestamp.

### Período publicado
**Decision**: uso/adoção V1 aceita `D7`, `D30`, `D90` e `D180` quando publicados
localmente. `routine` e `--force` publicam somente `D30`; `--recollect-days=7`,
`30`, `90` ou `180` publica seu período correspondente. **Rationale**:
Relatórios apenas lê essas fotografias locais, sem transformar uma rotina normal
em coleta de todos os períodos.
**Alternative rejected**: consultar Graph sob demanda no fluxo de relatório ou
aceitar períodos sem publicação local.

### Arquivo e manifesto
**Decision**: manifesto imutável por solicitação e CSV/XLSX efêmero. **Rationale**: reprodução/auditoria sem persistir conteúdo ou URL. **Alternative rejected**: storage de artefato.

### Fonte congelada após aceite
**Decision**: a publicação local só é resolvida e validada durante a transação de
aceite que cria `ReportSourceManifest`. O aceite confirma contrato, tenant,
connection, estado, geração, período, cobertura, autorização/PII e copia para
`ReportManifestSource` a proveniência, estado/razão, cobertura, frescor,
evidência permitida, `frozen_projection` e `access_policy_snapshot`.
**Rationale**: prévia, CSV/XLSX e histórico continuam factuais e reproduzíveis
quando o pruner do domínio-fonte remove a publicação original. Depois do aceite,
`source_record_id_text` é somente evidência/correlação, não FK, lookup runtime,
fallback ou reconstrução. **Alternative rejected**: revalidar a linha append-only
antes de exportar, pois tornaria uma solicitação aceita inválida após retention.

### Serialização XLSX e entrega efêmera
**Decision**: adicionar `phpoffice/phpspreadsheet:^5.0` para a serialização XLSX
server-side. O projeto usa PHP `^8.3`; a documentação atual do PhpSpreadsheet
declara PHP `^8.1` e suporte de escrita XLSX. OpenSpout 5 foi avaliado, mas exige
PHP `~8.4.0 || ~8.5.0` e, portanto, não é compatível com o runtime atual.

**Estratégia**: uma única `ReportExportProjection`, derivada exclusivamente de
`ReportManifestSource.frozen_projection`, fornece headers, linhas, rótulos de
parcialidade e máscara/PII aos dois serializers. CSV usa `fputcsv`; XLSX usa uma
`Spreadsheet`, uma worksheet nomeada pelo template e `Xlsx::save($temporaryPath)`.
Os dois serializers escrevem um arquivo temporário local, de nome aleatório, em
diretório controlado pelo processo; ele não pertence ao storage do produto.

Depois que a serialização fecha com sucesso, o exportador calcula `filesize` e
`hash_file('sha256', ...)` sobre esse mesmo arquivo e transmite exatamente seus
bytes em `StreamedResponse`. Assim `ReportArtifact.byte_size` e
`content_sha256` representam os bytes entregues, não uma projeção ou buffer
anterior. O `Spreadsheet` é desconectado/liberado antes do término da operação.
O arquivo é removido obrigatoriamente em `finally`, tanto após a transmissão
quanto em qualquer exceção; path nunca entra em banco, evento, payload ou log.
Falha de limpeza gera apenas sinal técnico sanitizado de observabilidade, sem
vazar o path.

**Memória e temporários**: XLSX requer workspace temporário para o ZIP e mantém
células do workbook em memória; a V1 usa somente projeções tabulares permitidas,
sem imagens/fórmulas/cálculo, e cria uma planilha por entrega. A task de
implementação deve validar as extensões exigidas pelo Composer e limpar a
instância/temporário em sucesso e erro. Não há URL, blob, disk do Laravel,
retenção ou arquivo recuperável após a resposta.

**Alternatives rejected**: `laravel-excel` adicionaria uma camada Laravel e
dependências sobre PhpSpreadsheet sem necessidade para um único serializer;
OpenSpout 5 tem perfil de memória atraente, mas seu requisito atual de PHP não
aceita PHP 8.3; enviar XLSX diretamente a `php://output` não permite registrar
antes, com precisão, tamanho/hash dos bytes efetivamente entregues nem controlar
de forma verificável a limpeza do workspace.

**Context7 evidence**: documentação oficial atual de
`/phpoffice/phpspreadsheet` (composer e guia de escrita) confirmou PHP `^8.1`,
extensões requeridas e `Writer\Xlsx::save(...)`; documentação de
`/openspout/openspout` confirmou que a linha 5 requer PHP 8.4/8.5, oferece
`openToFile`/`openToBrowser` e usa temporários para XLSX.

### Recoleta por data e Relatórios
**Decision**: `recollect_date` e `recollect_today` não chamam
`getOffice365ServicesUserCounts` e não criam `LicenseUsagePublication`,
`LicensedPopulationPublication` ou `LicenseInventoryPublication`. Eles descrevem
uma janela diária arbitrária, enquanto o contrato de uso Microsoft Graph usa os
períodos agregados `D7`, `D30`, `D90` e `D180`.

**Rationale**: converter uma data em `D7`/`D30`, ou hoje em `D7`, mudaria o
significado solicitado e permitiria uma geração parcial que Relatórios poderia
parear incorretamente. As capacidades próprias das demais etapas do sync seguem
seus contratos, mas a etapa de Licenciamento sinaliza `not_collected` para as
publicações de Relatórios, sem criar geração. A publicação factual anterior
permanece intacta; ela pode continuar disponível conforme seu frescor, e a
ausência dessa coleta não é uma falha Graph nem transforma `D30` em unavailable.

### Retention/purge tenant-scoped
**Decision**: usar a infraestrutura central existente
`app:prune-microsoft365` → `Microsoft365DataRetentionPruner`; estender
`LicensingRetentionPruner` para as três publicações e criar
`ReportsRetentionPruner` para o data plane próprio. Não haverá comando, scheduler
ou pruner paralelo de Licenciamento.

**Licenciamento — janela**: a unidade de remoção é
`tenant_id + microsoft_connection_id + publication_generation_id`. `published_at`
é escrito uma única vez na promoção e é o mesmo instante lógico nas três
publicações da geração; ele não muda em rerun idempotente. Uma geração é
candidata apenas quando `published_at < cutoff`, nunca pelo metadado técnico
`technical_synced_at` nem por `LicensingSyncRun.finished_at`. Gerações candidatas
só são removidas se não forem âncora factual:
a última publicação `available` por tenant/conexão/período/workload/métrica de
uso (`D7`, `D30`, `D90`, `D180`) permanece; a população da mesma geração de toda
linha de uso preservada também permanece; a geração factual de inventário mais
recente por tenant/conexão permanece. Assim uma população órfã antiga pode sair,
mas uma taxa de adoção retida nunca fica com uso sem população compatível. O
pruner remove primeiro as publicações elegíveis e somente então os
`licensing_sync_runs` antigos não referenciados, sem depender de `CASCADE`.

**Relatórios — janela**: `report_configurations` são estado operacional e não
saem por cutoff. A unidade é somente request terminal: `state IN ('completed',
'failed') AND completed_at < cutoff`. `accepted_at`/`created_at` antigos não
selecionam request; `preflight_passed` e `generating` ficam fora do prune normal,
pois recovery não é retention histórica. Cada request elegível é removido com
seus eventos, artifacts, manifest sources e manifesto; o manifesto nunca é
selecionado isoladamente por sua idade. A ordem de FK é audit events → artifacts
→ manifest sources → requests → manifests. A
fotografia `frozen_projection` continua suficiente enquanto o manifesto existir;
não se cria FK polimórfica para bloquear o prune da fonte original. Assim, uma
geração aceita A pode ser removida depois que B se torna âncora e cruza a janela:
request `preflight_passed`, preview e exportação continuam exclusivamente pela
fotografia de A, sem buscar A ou substituir por B.

**Purga `all`**: elimina todas as publicações de Licenciamento antes de seus runs
e todo data plane de Relatórios na ordem acima, incluindo configurations. O
catálogo global de templates/blocos não é customer-scoped e permanece. Todas as
consultas têm predicado obrigatório de tenant e percorrem todas as connections
desse tenant; connection nunca é argumento livre. Execuções repetidas são
idempotentes e as contagens registram somente deletes reais.
