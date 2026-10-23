# Catálogo fechado V1 — Relatórios Microsoft 365

## Convenções aplicáveis a todo template

- **Versão:** todos os IDs abaixo são `version=1`. Uma alteração de fonte,
  fórmula, granularidade, PII, requisito ou formato cria uma versão nova; nunca
  altera uma solicitação/manifesto existente.
- **Fonte:** cada leitura é uma publicação local do mesmo `tenant_id` e
  `microsoft_connection_id`; disponibilidade no catálogo é avaliada no estado
  atual dessa publicação. Nenhuma definição chama Graph ou cria coleta paralela.
- **Período:** a V1 pode publicar localmente `D7`, `D30`, `D90` e `D180`.
  Rotina e `--force` publicam `D30`; `--recollect-days` publica o período
  solicitado. `recollect_date` e `recollect_today` não publicam fatos de
  Licenciamento para Relatórios. `operational-usage`, `taxa-de-adocao` e
  `uso-agregado-office365` aceitam exclusivamente valores que já existam nessa
  publicação local; qualquer outro período fica indisponível até publicação local
  aprovada.
- **PII:** a saída herda a política da publicação. Um bloco `aggregate_only` não
  pode receber identificadores; `published_masked` mantém máscara; `restricted`
  não é exportável para `member`.
- **Requisitos:** `required` ausente ou `restricted` bloqueia. `degradable` só
  continua com `partial_output_policy=labelled_allowed`, mantendo bloco, fonte,
  cobertura, frescor e razão no resultado parcial.

## Templates

| ID estável / objetivo / público | Formatos / parcial / período | Blocos, requisito e fonte |
|---|---|---|
| `operational-usage` — acompanhar uso publicado e adoção comparável; `member`, `customer admin` | CSV/XLSX; `forbidden`; `D7`, `D30`, `D90` ou `D180` | `taxa-de-adocao` (**required**): `LicenseUsagePublication` de `Office 365 Active` do período selecionado + `LicensedPopulationPublication` da mesma `publication_generation_id`. `uso-agregado-office365` (**required**): `LicenseUsagePublication` do período selecionado. |
| `operational-licensing` — conferir inventário de SKUs, capacidade e consumo; `member`, `customer admin` | CSV/XLSX; `forbidden`; fotografia da geração publicada mais recente | `inventario-skus-capacidade` (**required**): `LicenseInventoryPublication` da `LicensingSyncRun` publicada, no mesmo tenant/conexão. |
| `security-posture` — comunicar evidência publicada de postura e suas limitações; `member`, `customer admin` | CSV/XLSX; `labelled_allowed`; fotografia Secure Score publicada | `secure-score-postura` (**required**): publicação/versionamento de Secure Score. `limitacoes-de-evidencia` (**degradable**): `SourceState` e metadados de cobertura/frescor das fontes integrantes. |

O público descreve capacidade de uso do customer; o `platform admin` apenas mantém
o catálogo no control plane e não visualiza qualquer execução ou fonte data-plane.

## Blocos

| ID / tipo visual | Fonte e campos/fórmula fechados | Filtros allowlisted / granularidade / PII | Disponibilidade e degradação |
|---|---|---|---|
| `taxa-de-adocao` / KPI percentual | `Office 365 Active` do período selecionado ÷ `eligible_distinct_person_count` × 100. Ambos vêm de publicações append-only da mesma `publication_generation_id`. | `report_period` em `D7`, `D30`, `D90` ou `D180`; série apenas quando houver gerações comparáveis; `aggregate_only`. | `required`. Fica `unavailable` quando faltar publicação, geração inequívoca, cobertura compatível, denominador positivo ou regra de SKU reproduzível. |
| `uso-agregado-office365` / tabela + série | workload, usuários ativos e metadados de `LicenseUsagePublication`; nenhuma linha nominal. | `report_period` em `D7`, `D30`, `D90` ou `D180`; ordenação por workload permitido; agregado por geração; `aggregate_only`. | `required`. Fonte incompleta, restrita ou ausente bloqueia; zero somente quando a publicação válida declarar zero. |
| `inventario-skus-capacidade` / tabela operacional | SKU part number/nome, capacidade habilitada, consumida, disponível, estado técnico e planos de `LicenseInventoryPublication`. | `sku_part_number` allowlisted e `availability_state`; fotografia da geração; `aggregate_only`. | `required`. Não expõe atribuições individuais, origem direta/grupo ou PII. Ausência/restrição bloqueia. |
| `secure-score-postura` / KPI + tabela de controles publicados | score atual/máximo, controles, categoria, estado Microsoft, cobertura e versão do manifesto Secure Score. | categoria e estado publicados; fotografia de geração; `aggregate_only`. | `required`. Não produz Health Score nem taxa de conformidade. Fonte indisponível/restrita bloqueia. |
| `limitacoes-de-evidencia` / quadro de metodologia | estado, cobertura, frescor e motivo sanitizado de cada fonte do manifesto, sem payload bruto. | sem filtro adicional; por fonte; `aggregate_only`. | `degradable`. Se indisponível/restrito e o template permitir, permanece como bloco estrutural com motivo e o arquivo recebe `partial=true`. |

## Blocos estruturais não geráveis na V1

| ID | Estado e regra |
|---|---|
| `health-score` | `unavailable`: IMDO não integra a entrega; Secure Score não o substitui e não há nota, meta ou variação alternativa. |
| `economia-anual-estimada` | `unavailable`: fórmula aprovada é `economia mensal estimada × 12`, mas não existe publicação do Assessment. |
| `taxa-de-conformidade` | `unavailable`: não há catálogo/fonte/cobertura canônicos de controles avaliados. |
| agendamento, distribuição, e-mail, Teams, SharePoint, OneDrive, PDF, PPTX, IA e builder livre | `coming_soon` ou fora de escopo; não têm operação, persistência ou job oculto. |
