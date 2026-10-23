# Fontes e rastreabilidade — Microsoft 365 / OneDrive

Este artefato rastreia referências do sponsor. O futuro mapping de fatos do contrato para fontes técnicas pertence a `fontes-e-viabilidade.md` de cada superfície, no track `backend`.

## Diretório informado

`docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Onedrive/`

## Inventário de referências

| Caminho relativo | Tipo | Status | Uso ou impacto |
| --- | --- | --- | --- |
| `Microsoft365_Onedrive.docx` | DOCX | lida | Escopo, oito superfícies, capacidades, limites, métricas, cálculos e ações futuras. |
| `01.Dashboard Executivo.png` | PNG | lida | Hierarquia KPI → análise → investigação e densidade da visão consolidada. |
| `02.Contas e Armazenamento.png` | PNG | lida | Filtros, cards, gráficos, tabela paginada e investigação por conta. |
| `03.Arquivos e Conteúdo.png` | PNG | lida | Inventário, distribuições e ações de investigação de conteúdo. |
| `04.Compartilhamento e Acessos.png` | PNG | lida | KPIs, gráficos, filtros, tabela de compartilhamentos, alertas e recomendações. |
| `05.Atividade e Sincronização.png` | PNG | lida | Adoção, indicadores de sincronização, tabelas e blocos de alerta. |
| `06.Usuários Desligados e Retenção.png` | PNG | lida | Processo, status, tabela e contexto de retenção. |
| `07.Configurações e Segurança.png` | PNG | lida | Score, categorias, políticas e postura consolidada. |
| `08.Histórico e Auditoria.png` | PNG | lida | Filtros temporais, distribuições, eventos recentes e atividades críticas. |

## Evidências utilizadas

- OneDrive é tratado separadamente de SharePoint e representa armazenamento pessoal corporativo — `Microsoft365_Onedrive.docx`.
- As oito abas e sua ordem são confirmadas pelo documento e pelo conjunto de imagens — fontes acima.
- O MVP de compartilhamento é somente leitura; mudanças em links/permissões são posteriores — `Microsoft365_Onedrive.docx`, seção 4.
- Limites de atividade, armazenamento, versões e comportamento são descritos como recomendados ou configuráveis — `Microsoft365_Onedrive.docx`.
- Ações e valores nas telas são composição de referência; nenhum dado exemplificado é promovido a fato do produto — todas as imagens.

### Releitura integral — revisão por imagens de 2026-10-14

Foram relidos os1.129parágrafos não vazios do DOCX (incluindo tabelas) e
visualizadas as oito imagens originais. As cinco divergências materiais de
defaults não explícitos no texto foram clarificadas e aceitas em A pelo
usuário: imagem06→R1; imagens03/04/08→R2; imagem05→R3;
imagem07→R4/R5. A [triagem e o registro das respostas](backend-defaults-e-clarificacoes.md#revisão-das-inferências--imagens-do-sponsor--2026-10-14)
distinguem o que foi confirmado, inferido e substituído. As propostas aceitas
não são decisões retroativas do sponsor nem evidência de dado operacional.

## Candidatos técnicos citados pelo sponsor

| ID | Fato ou capacidade | Provider/API candidata | Host / operação | Origem | Status |
| --- | --- | --- | --- | --- | --- |
| `SRC-OD-01` | contas, cotas e uso | Microsoft Graph Reports | `getOneDriveUsageAccountDetail/Counts/FileCounts/Storage` | `Microsoft365_Onedrive.docx` | `validated` |
| `SRC-OD-02` | atividade e sincronização agregada | Microsoft Graph Reports + Graph Data Connect | `getOneDriveActivityUserDetail/Counts/FileCounts`; export OneDrive Sync Health/Errors | `Microsoft365_Onedrive.docx` | `validated`: Reports observado; fonte export documentada com admissão por perfil oficial/primeiro run. Q3 define snapshot mensal rolling30d; equivalência estática Errors_v0/v1 não é alegada |
| `SRC-OD-03` | diretório e provisionamento pontual | Microsoft Graph | `/users`, `/directory/deletedItems/microsoft.graph.user`; candidato original `/users/{id}/drive` | `Microsoft365_Onedrive.docx` | `superseded` somente para drive singular: documento atual não suporta aplicação. Identidade/deletedItems continuam validados; usar alternativa plural abaixo |
| `SRC-OD-03b` | descoberta app-only de drive | Microsoft Graph | `/users/{id}/drives`, paginado, vínculo empresarial único | Revisão técnica do candidato `SRC-OD-03` | `validated`: contrato primário, GET sanitizado e Simulator SUPPORTED, sem seleção arbitrária de drive |
| `SRC-OD-04` | inventário de conteúdo | Microsoft Graph | delta raiz com sharepointIds/parentReference; lixeira Graph beta | `Microsoft365_Onedrive.docx` | `validated`: documentação/schema/SUPPORTED; delta observado; beta aceito, lixeira ainda sem 200 local. Caminho reconstruído por IDs, não parentReference.path |
| `SRC-OD-05` | compartilhamento detalhado | Microsoft Graph | `driveItem permissions` | `Microsoft365_Onedrive.docx` | `validated` com campos de link opcionais conforme chamador |
| `SRC-OD-06` | configurações de compartilhamento e retenção | Microsoft Graph | `/admin/sharepoint/settings` | `Microsoft365_Onedrive.docx` | `validated` |
| `SRC-OD-07` | auditoria | Office 365 Management Activity API | `manage.office.com`, start/list/content/blob | `Microsoft365_Onedrive.docx` | `validated`: start autorizado200 enabled e leituras200, sem erro de licença; PublisherIdentifier e blobs JSON text/plain cobertos no Simulator. Amostra não garante continuidade |
| `SRC-OD-08` | retenção/desligamento | composição | Graph + auditoria + projeção/registro interno Orkestria | `Microsoft365_Onedrive.docx` | `validated`: Q1/Q2 aprovam casos técnicos 7dias sem HR e baseline de retenção. Workflow humano continua desconhecido quando não registrado |
| `SRC-OD-09a` | Secure Score e categorias | Microsoft Graph | `/security/secureScores`, `/security/secureScoreControlProfiles` | `Microsoft365_Onedrive.docx`; discovery Secure Score | `validated` |
| `SRC-OD-09b` | postura de sincronização e compartilhamento | Microsoft Graph | `/admin/sharepoint/settings` | `Microsoft365_Onedrive.docx`; discovery Configurações | `validated` |
| `SRC-OD-09c` | dispositivos, ameaça, DLP, sensibilidade e retenção | Intune, Defender, Purview, SPO/CSOM | Graph observado e exports complementares por certificado | `Microsoft365_Onedrive.docx` | `validated`: estratégia/fontes/mapping documentados. Q4 aprova perfil/primeira leitura antes da publicação. Cmdlets/CSOM não foram executados; catálogo Graph delegated foi substituído por export Purview para app-only |
| `SRC-OD-10` | estatísticas de acesso por intervalo | Microsoft Graph | `driveItem/getActivitiesByInterval` | Fato de acesso sem uso e revisão técnica A7 | `validated`: contrato/SUPPORTED e cenários de zero explícito/incompleteData/ausência. Vazio não prova zero; avaliação depende de cobertura íntegra |
| `SRC-OD-11` | detector de versões>50 | Microsoft Graph | `driveItem/versions`, paginado | Detector explícito do DOCX e revisão A8 | `validated`: contrato primário/metadata/OpenAPI e Simulator SUPPORTED; IDs opacos únicos, separado do baseline500 |
| `SRC-OD-A3a` | diferenciação notebook/desktop | Intune beta | `managedDevice.chassisType` | Investigação técnica A3 | `not_applicable` no recorte C2: campo documentado, mas extensão não selecionada; não resolve ponte ao Health e não cria fonte de tipo físico por cliente |
| `SRC-OD-A3b` | estados instantâneos do cliente | Windows SDK local | Cloud Files / StorageProviderState | Investigação técnica A3 | `rejected` como leitor cloud de tenant: não comprova acesso externo ao estado OneDrive, identidade ou Mac; C2 aprovou saúde diária |
| `SRC-OD-A3c` | estado no portal Sync Health | Endpoint interno do portal | `clients.config.office.net/odbhealth/...` | Investigação técnica de telemetria | `rejected`: sem contrato público app-only estável; não usar sessão manual/scraping |

## Lacunas e pendências

- O usuário confirmou em 2026-10-13 que Graph `/beta` é aceito no projeto. Assim, o aviso Microsoft de suporte da rota `/sites/{site-id}/recycleBin/items` é risco conhecido, não bloqueador por versão. A resposta `200` ainda não foi observada porque não se resolveu `site-id` nem se tinha `Files.Read.All` na conexão. `SP.Site.recycleBin` em SharePoint REST Previous Versions é alternativa não validada para SPO/app-only, desnecessária enquanto a rota beta for usada. A ausência de resposta não comprova lixeira vazia.
- Graph Data Connect é exportação assíncrona. O catálogo indica Errors_v1 e liga ao schema intitulado v0. A Q3 aprovou perfil oficial imutável e primeira extração compatível, sem presumir equivalência. A série mensal representa última fotografia rolling30d, não soma de eventos de falha.
- `GET /security/labels/retentionLabels` permanece delegated-only e não integra a estratégia app-only; o export Purview por certificado é a fonte selecionada. Postura SPO, DLP, quarentena e preservação usam leitores complementares documentados/perfil de admissão, não inferência a partir de alertas. Não houve execução desses leitores nesta investigação.
- Casos técnicos sem HR usam Q1; dados humanos opcionais não são deduzidos de identidade. Q2/Q4 aprovam regras locais, distinguindo recomendações e fatos Microsoft.
- Cada candidato técnico acima tem disposição explícita nos arquivos `api.md` e `fontes-e-viabilidade.md` por superfície. Ausência de collector ou de homologação anterior no Simulator não significa que a fonte seja `unavailable`.

`validated` nesta matriz significa fonte/contrato e estratégia técnica
documentados suficientemente para Discovery. As observações executadas e seus
limites estão nos `api.md`; a classificação não afirma execução de todo leitor,
schema estático v1 comprovado, licença ou acesso de customer.
- O recorte operacional de ações exibidas em algumas telas não está definido fora da regra explícita de somente leitura para compartilhamento — impacto: controles mutáveis permanecem pendentes; próximo passo: decisão de produto antes da implementação.

## Convergência independente —2026-10-15

Análises delegadas confrontaram todas as oito abas, contratos/fontes/APIs,
blueprint e expectativas históricas do frontend. C6–C9 foram propostas pelo
agente para lacunas não explícitas do DOCX e aceitas em A pelo usuário:
compartilhamento de arquivos por atividade, alertas por criação, fim nominal
de retenção por arquivo e seleção Alto/Crítico24h. O
[registro integral](backend-defaults-e-clarificacoes.md) distingue essas decisões
das fontes originais; não houve nova atribuição ao sponsor.

A releitura do §5 confirmou a diferença entre atividade da pessoa e uso do
espaço no §1: inatividade de usuário usa ActivityUserDetailD180. Correções de
payloads/datas do Simulator são evidência sintética de contrato, sem nova
chamada de tenant. A disposição dos candidatos SRC permanece válida; o
[relatório backend](backend-coverage-review.md) registra rodadas, condições
satisfeitas e o critério de análise final sem achados.

## Tratamento de dados

Não foram replicados dados pessoais, identificadores, IPs ou conteúdo ilustrativo das referências além dos nomes de arquivos necessários para rastreabilidade.
