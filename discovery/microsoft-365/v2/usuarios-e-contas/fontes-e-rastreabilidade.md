# Fontes e rastreabilidade — Microsoft 365 / Usuários e Contas

## Diretório informado

`docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Usuários e Contas/`

As referências foram tratadas como somente leitura.

## Inventário de referências

| Caminho relativo | Tipo | Status | Uso ou impacto |
| --- | --- | --- | --- |
| `Microsoft365_UsuarioseContas.docx` | Documento Word | `lida` | Objetivos, blocos, fontes Graph, limites de licença e modelo conceitual. |
| `01.Dashboard Executivo.png` | Imagem PNG | `lida` | Estrutura do dashboard e ordem dos blocos. |
| `02.Diretório de Usuários.png` | Imagem PNG | `lida` | Tabela, filtros e painel de detalhe. |
| `03.Saúde das Contas.png` | Imagem PNG | `lida` | Achados, severidade, tendência e recomendações. |
| `04.Atividade e Inatividade.png` | Imagem PNG | `lida` | Faixas de atividade, tendência e investigação de inativos. |
| `05.Contas Privilegiadas.png` | Imagem PNG | `lida` | Funções, MFA, PIM, lista e alertas administrativos. |
| `06.Convidados e Usuários Externos.png` | Imagem PNG | `lida` | Status B2B, domínios, tabela e recomendações. |
| `07.Ciclo de Vida.png` | Imagem PNG | `lida` | Fluxos, solicitações, tarefas, indicadores e ações rápidas. |
| `08.Histórico e Auditoria.png` | Imagem PNG | `lida` | Categorias, tendência, eventos críticos, auditoria e exportações. |

## Evidências utilizadas

- O recorte possui oito tópicos e sua ordem — `Microsoft365_UsuarioseContas.docx` e imagens `01`–`08`.
- Diretório, autenticação, risco, funções, PIM e auditoria possuem dependências Graph distintas — `Microsoft365_UsuarioseContas.docx`.
- O produto precisa de histórico próprio e coleta incremental — `Microsoft365_UsuarioseContas.docx`.
- As telas preservam shell Microsoft 365, abas, indicadores, cards, visualizações e áreas de investigação — imagens `01`–`08`.

## Lacunas e pendências

- Permissões efetivamente consentidas por tenant, SKU Entra e política de retenção não foram comprovadas pelas referências — impacto: alguns blocos podem ficar `restricted` ou `unavailable`; próximo passo: validar no escopo técnico da Spec.
- Fórmula, faixas e governança do Score de Saúde das Identidades são apenas sugeridas — impacto: não há cálculo normativo; próximo passo: aprovar regra e exceções.
- Integração de RH, catálogo de tipos de identidade, dados de patrocinador e workflows operacionais não estão confirmados — impacto: classificação e ciclo de vida não podem ser automatizados; próximo passo: definir fontes e responsáveis.

## Tratamento de dados

O discovery não replica nomes, e-mails, IPs, datas nem contagens ilustrativas das referências além do necessário para descrever estrutura e decisão.
