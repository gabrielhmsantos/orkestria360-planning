# Expectativas do sponsor — Microsoft 365 / Relatórios

## Referências primárias

- `Microsoft365_Relatórios.docx`
- `01.Dashboard Executivo.png` a `08.Histórico e Auditoria.png`

## Capacidades e superfícies esperadas

| Superfície | Resultado esperado pelo sponsor | Estado no discovery | Fonte e condição |
| --- | --- | --- | --- |
| Dashboard Executivo | Leitura única de postura, adoção, riscos, oportunidades e relatórios recentes | `available` por bloco | Apenas KPIs locais publicados; o Health Score (IMDO fora desta entrega) é `unavailable`, assim como custos e tendências sem base. |
| Catálogo | Localizar e entender relatórios prontos | `available` por template | Cada item declara finalidade, período, formato, requisito e disponibilidade, sem expor metadados técnicos de fonte. |
| Executivos | Materiais para direção, riscos, evolução e valor entregue | `available` parcial | Requisito `required` bloqueia; `degradable` só aparece como bloco indisponível/restrito em saída parcial marcada. |
| Operacionais | Consulta detalhada, filtros, drill-down e exportação | `available` parcial | Usa manifesto congelado e mesmo escopo de PII; arquivo CSV/XLSX é efêmero. |
| Segurança e Compliance | Evidências, controles, riscos e limitações | `restricted`/`unavailable` por fonte | Não há certificação automática; Defender/Intune/Purview dependem de fonte habilitada. |
| Construtor | Composição sem desenvolvimento | `available` condicionada | Primeira release: template, bloco, período e filtros allowlisted sobre publicação local; sem consultas/fontes ao vivo. |
| Agendamentos e Distribuição | Processo recorrente e seguro de entrega | `coming_soon` | Requer fila, approval, canais, retenção e política de e-mail. |
| Histórico e Auditoria | Rastrear solicitação, geração, entrega e falha | `available` parcial | Histórico local sanitizado; arquivo não é persistido e não equivale à auditoria Microsoft unificada. |

## Critérios transversais

- Todo KPI, gráfico, insight, template, arquivo e evento preserva internamente seu contrato de publicação, período e estado; a interface mostra somente o estado e a razão humana necessários.
- Ausência não é convertida em zero, tendência, sucesso, conformidade ou economia.
- Um relatório financeiro exige base comercial vigente; um regulatório declara evidência, escopo e limitações.
- Tabelas com PII e auditoria têm máscara ou estado `restricted`; exportação preserva exatamente o escopo aplicado à tela.
- Um requisito `required` ausente/restrito bloqueia a geração; `degradable` só integra saída parcial quando o template o declarar, com bloco e razão humana explícitos.
- Prévia, CSV/XLSX efêmero e histórico nunca ampliam visibilidade, granularidade ou sensibilidade autorizada pela publicação canônica; não há fallback entre tenants/conexões nem reidentificação por combinação de fontes.
- O Construtor guiado explicita validação, prévia, processamento, concluído e falho. Estados de expiração, aprovação e distribuição permanecem futuros.

## Pendências

- Formalizar o primeiro conjunto fechado de templates/blocos CSV/XLSX, seus requisitos concretos e os contratos físicos de validação/persistência antes de expor “Gerar relatório”.
