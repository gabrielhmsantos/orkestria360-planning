# Fontes e rastreabilidade — Microsoft 365 / Secure Score

## Diretório informado

`docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Secure Score/`

As referências permaneceram somente leitura.

## Inventário de referências

| Caminho relativo | Tipo | Status | Uso ou impacto |
| --- | --- | --- | --- |
| `Microsoft365_SecureScore.docx` | DOCX | `lida` | Objetivo, superfícies, cálculos sugeridos, fontes, permissões, coleta, modelos e limites. |
| `01.Dashboard Executivo.png` | PNG | `lida` | Faixas, cards e links do Dashboard Executivo. |
| `02.Pontuação por Categoria.png` | PNG | `lida` | KPIs, filtros, tabela e análises por categoria. |
| `03.Ações de Melhoria.png` | PNG | `lida` | Resumo, filtros, tabela e painéis de priorização. |
| `04.Plano de Remediação.png` | PNG | `lida` | Resumo, projeção, Kanban e roadmap. |
| `05.Comparativos e Metas.png` | PNG | `lida` | Comparativos, radar, metas e projeção. |
| `06.Evolução e Tendências.png` | PNG | `lida` | Histórico, eventos, distribuição e alertas. |
| `07.Controles Aceitos e Exceções.png` | PNG | `lida` | Exceções, detalhe lateral, revisões e distribuição. |
| `08.Histórico e Auditoria.png` | PNG | `lida` | KPIs, filtros, gráficos, tabela e detalhe lateral. |

## Evidências utilizadas

- As oito superfícies e seus nomes são confirmados pelo DOCX e pelas PNGs correspondentes.
- `/security/secureScores` e `/security/secureScoreControlProfiles`, leitura por `SecurityEvents.Read.All`, coleta diária e histórico de aproximadamente 90 dias são citados no DOCX. A validação no tenant confirmou `200`, paginação, 90 fotografias, 449 perfis e associação de todos os 71 controles atuais.
- Composição em cards, filtros, tabelas, painéis laterais, gráficos, Kanban e barra de informação é confirmada pelas imagens.

## Lacunas e pendências

- Intune e Defender retornaram `401`/`403` neste tenant; esse estado é publicado por execução, não fixado por código. Em outro tenant/app-only, uma coleta autorizada deve promovê-los para `available` sem edição de código; enquanto isso, preservar a última publicação e expor disponibilidade/cobertura/frescor/motivo, sem converter restrição em zero.
- A classificação de prioridade do score composto foi aprovada pelo sponsor e usa as faixas Crítica 85–100, Alta 70–<85, Média 50–<70 e Baixa 0–<50. Regressão, prazo, responsabilidades, exceções, retenção e elevação automática por sinais correlatos permanecem pendentes de regra/dados publicados.
- As médias comparativas podem estar ausentes ou ser zero — impacto: comparativos entram `unavailable`, sem substituição; próximo passo: publicar estado de resposta.
- A relação `controlScores.controlName → perfil.id` foi validada para os 71 controles atuais. A implementação precisa registrar ausência, colisão e versão do catálogo para manter a cobertura verificável.

## Tratamento de dados

O discovery não reproduz identidades, responsáveis, datas, pontuações, IPs, anexos ou IDs das ilustrações.
