# Fontes e rastreabilidade — Microsoft 365 / Grupos

## Diretório informado

`docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Grupos/`

As referências foram tratadas como somente leitura.

## Inventário de referências

| Caminho relativo | Tipo | Status | Uso ou impacto |
| --- | --- | --- | --- |
| `Microsoft365_Grupos.docx` | Documento Word | `lida` | Objetivos, tópicos, dados Graph, limites de licença, sincronização e modelo interno. |
| `01.Dashboard Executivo.png` | Imagem PNG | `lida` | Cards, gráficos, tabela, alertas e recomendações. |
| `02.Diretório de Grupos.png` | Imagem PNG | `lida` | Filtros, tabela, resumos laterais e ações rápidas. |
| `03.Membros e Proprietários.png` | Imagem PNG | `lida` | Lista, painel de detalhe, distribuições e alertas de responsabilidade. |
| `04.Grupos Dinâmicos.png` | Imagem PNG | `lida` | KPIs, lista de regras, estado, alterações e simulação proposta. |
| `05.Licenciamento por Grupo.png` | Imagem PNG | `lida` | Distribuições, tabela, custos e oportunidades. |
| `06.Governança e Ciclo de Vida.png` | Imagem PNG | `lida` | Status, fluxo, expiração, tabela e políticas. |
| `07.Atividade e Inatividade.png` | Imagem PNG | `lida` | Faixas de atividade, impacto, lista e ações. |
| `08.Histórico e Auditoria.png` | Imagem PNG | `lida` | Categorias, tendência, log, detalhe e retenção. |
| Microsoft Learn — `group-list`, `group-delta`, `group-list-members`, `directoryaudit-list`, `reportroot-getoffice365groupsactivitydetail` | Documentação oficial | `lida` | Confirmação de envelopes, paginação, permissões, delta e redirect CSV. |
| `orkestria360/app/Support/Microsoft365/GraphClientFactory.php` e `GraphDataClient.php` | Conector existente | `lida` | Autenticação app-only, paginação e uso atual de `/groups` e auditoria. |

## Evidências utilizadas

- O recorte possui oito superfícies, nessa ordem — `Microsoft365_Grupos.docx` e imagens `01`–`08`.
- Diretório, membros, proprietários, grupos dinâmicos, licenças, ciclo de vida, atividade e auditoria têm fontes e condições distintas — `Microsoft365_Grupos.docx`.
- O produto requer complemento interno para contexto corporativo, achados, snapshots, auditoria e revisões — `Microsoft365_Grupos.docx`.
- As telas preservam shell Microsoft 365, navegação por abas, cards, filtros, tabelas, gráficos, painéis de detalhe e rodapé de proveniência — imagens `01`–`08`.
- Os contratos `api.md` e `openapi.yaml` foram validados contra documentação oficial atual: [list groups](https://learn.microsoft.com/en-us/graph/api/group-list?view=graph-rest-1.0), [group delta](https://learn.microsoft.com/en-us/graph/api/group-delta?view=graph-rest-1.0), [members](https://learn.microsoft.com/en-us/graph/api/group-list-members?view=graph-rest-1.0), [directory audits](https://learn.microsoft.com/en-us/graph/api/directoryaudit-list?view=graph-rest-1.0) e [activity detail](https://learn.microsoft.com/en-us/graph/api/reportroot-getoffice365groupsactivitydetail?view=graph-rest-1.0).
- O conector atual já usa `GraphClientFactory`/`GraphDataClient`, app-only, paginação por `@odata.nextLink` e contagem de `/groups`; não foi alterado.

## Lacunas e pendências

- Permissões efetivamente consentidas, SKUs Microsoft Entra/ID Governance e retenção disponível não estão comprovados — impacto: blocos podem ficar `restricted` ou `unavailable`; próximo passo: validar por tenant na futura Spec.
- Os pesos do score de governança são os nove percentuais definidos pelo sponsor. A nota é a soma ponderada da conformidade por dimensão; fonte ou evidência ausente contribui com `0%` na respectiva dimensão. Limiares, exceções e classificação textual continuam pendentes.
- Finalidade, responsáveis, criticidade, revisão, documentos, custos reais e políticas internas não têm fonte operacional definida — impacto: governança e custo não podem ser automatizados; próximo passo: aprovar modelos, responsáveis e fluxo de manutenção.
- Permissões consentidas, licenças e respostas do tenant ainda exigem homologação por ambiente — impacto: contratos documentam viabilidade e estados, mas não atestam disponibilidade para cada tenant.

## Tratamento de dados

O discovery não replica pessoas, grupos, e-mails, IPs, datas, contagens ou custos ilustrativos além do necessário para descrever estrutura e decisão.
