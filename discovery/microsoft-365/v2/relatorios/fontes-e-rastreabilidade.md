# Fontes e rastreabilidade — Microsoft 365 / Relatórios

## Diretório informado

`docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Relatórios/`

As referências foram tratadas como somente leitura.

## Inventário de referências

| Caminho relativo | Tipo | Status | Uso ou impacto |
| --- | --- | --- | --- |
| `Microsoft365_Relatórios.docx` | DOCX | `lida` | Escopo das oito superfícies, fontes, formatos, cálculos sugeridos, workflows e limites. |
| `01.Dashboard Executivo.png` | PNG | `lida` | Hierarquia de síntese, KPIs, riscos, oportunidades e agenda. |
| `02.Catálogo de Relatórios.png` | PNG | `lida` | Biblioteca, filtros, metadados e ação contextual de template. |
| `03.Relatórios Executivos.png` | PNG | `lida` | Tabela, visualizações, formatos e detalhe de relatório executivo. |
| `04.Relatórios Operacionais.png` | PNG | `lida` | Consulta densa, filtros, tabela e exportação operacional. |
| `05.Relatórios de Segurança e Compliance.png` | PNG | `lida` | Postura, evidências, controles e limitações de compliance. |
| `06.Construtor de Relatórios.png` | PNG | `lida` | Fluxo de composição, filtros e prévia pretendidos. |
| `07.Agendamentos e Distribuição.png` | PNG | `lida` | Recorrência, destinos, status e aprovação pretendidos. |
| `08.Histórico e Auditoria.png` | PNG | `lida` | Linha do tempo, tabela, detalhe e integridade pretendidos. |

## Evidências utilizadas

- O sponsor confirma que o módulo consolida dados dos demais submódulos e não deve repetir todas as coletas — DOCX, seção “Fontes de dados”.
- A família Graph Reports é candidata à atividade/adoção; o projeto já tem homologação sanitizada de `getOffice365*`, Teams, Exchange, OneDrive, SharePoint e M365 Apps em `../licenciamento/consumo/contratos.md`.
- Fontes já publicadas de identidades, MFA, Grupos, Licenciamento, Secure Score, Configurações e eventos de diretório são as candidatas canônicas; a tela não cria leituras redundantes.
- **Decisão do usuário:** a Taxa de adoção usa `Office 365 Active` de `LicenseConsumptionSnapshot` (`getOffice365ServicesUserCounts`) como numerador e o agregado local imutável de população licenciada elegível da mesma geração de Licenciamento como denominador. Ele é derivado das atribuições já coletadas no ciclo e fixa a regra `included_in_calculation`; a definição completa, inclusive cobertura e indisponibilidade, está em `construtor-de-relatorios/contratos.md`.
- Service health é fonte independente (`ServiceHealth.Read.All`); relatórios de uso usam `Reports.Read.All`; Defender/Intune/Purview não são inferidos como parte dessas permissões.
- Validação de 05/09/2026 em conexões customer locais confirmou `302` seguido de CSV protegido para `getOffice365ActiveUserDetail(D30)` e `getOffice365ActiveUserCounts(D180)`. O primeiro contém PII e só pode alimentar o agregado publicado; o segundo é série por produto. A validação não autoriza leitura Graph na tela.
- `subscribedSkus.consumedUnits`, e não a Reports API, é o fato externo de licenças atribuídas. O consumidor de Relatórios reutiliza a publicação de inventário já congelada por tenant e conexão.

## Lacunas e pendências

- **Health Score, custo e economia:** IMDO e Assessment não integram esta entrega. O Health Score é `unavailable`, pois não há fonte canônica aprovada para produzi-lo e Relatórios não calcula alternativa. Não há publicação histórica/comercial para custo e economia. O bloco futuro de Economia anual estimada foi definido como `economia mensal estimada × 12` sobre publicação canônica do Assessment, mas permanece `unavailable` nesta V1. Cards, tendências e templates não recebem série ou valor ilustrativo.
- **Active User Detail e Active User Counts:** os endpoints são viáveis, mas ainda requerem extensão do coletor de Uso/Licenciamento: agregar `D30` sem persistir PII e reter a série somente quando sua coleção/publicação própria estiver pronta. Até a publicação existir, o KPI/região permanece `unavailable`.
- **Taxa de conformidade:** o DOCX a apresenta como exemplo, mas não define catálogo canônico de controles, fontes, regra para estado parcial ou cobertura. Por decisão do usuário, não há bloco nem cálculo dessa taxa na V1.
- **Auditoria unificada:** a Management Activity API exige operação de assinatura e autoridade própria; impacto: histórico V1 cobre somente eventos locais/evidência canônica já publicada.
- **Construtor guiado:** decisão do usuário autoriza a primeira release com template, bloco, período e filtros allowlisted sobre projeções locais. O lifecycle está definido: preflight, manifesto imutável por solicitação e CSV/XLSX efêmero; o primeiro catálogo concreto de blocos é item da futura Spec. Builder livre permanece fora.
- **Geração e distribuição:** a V1 não armazena arquivo, URL ou segredo; persiste apenas manifesto, request, metadados/hash e auditoria sanitizada. Filas, retenção de artefato, expiração, destinatários, aprovação e política de e-mail continuam fora em Agendamentos e Distribuição.
- **Papéis:** os seis papéis do sponsor continuam fora. A decisão do usuário mantém `member`, `customer admin` e `platform admin`, com capacidades limitadas do Construtor guiado.

## Tratamento de dados

Não reproduzir UPN, e-mail, nomes, sites, IPs, payloads, URLs de redirect, tokens ou dados das imagens. Colunas potencialmente pessoais de CSV e detalhes de auditoria permanecem protegidos e só podem ser projetados em escopo autorizado. Relatórios não podem combinar fontes para reidentificar pessoa, desmascarar campo ou usar outra tenant/conexão como fallback.
