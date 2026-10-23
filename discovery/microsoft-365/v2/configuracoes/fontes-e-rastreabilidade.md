# Fontes e rastreabilidade — Microsoft 365 / Configurações

## Diretório informado

`docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Configurações/`

## Inventário de referências

| Caminho relativo | Tipo | Status | Uso ou impacto |
| --- | --- | --- | --- |
| `Microsoft365_Configurações.docx` | Documento Word | `lida` | Escopo, fontes, cálculos, capacidades, fluxos e modelo de dados propostos pelo sponsor. |
| `01.Dashboard Executivo.png` | PNG | `lida` | Estrutura do dashboard e títulos dos blocos. |
| `02.Configurações do Tenant.png` | PNG | `lida` | Organização, branding, domínios, sincronização e tabela transversal. |
| `03.Identidade e Acesso.png` | PNG | `lida` | Políticas, métodos, PIM, usuários, aplicações e eventos. |
| `04.Colaboração e Compartilhamento.png` | PNG | `lida` | Compartilhamento, links, convidados, domínios e serviços de colaboração. |
| `05.Segurança e Compliance.png` | PNG | `lida` | Defender, Purview, auditoria, cobertura e recomendações. |
| `06.Configurações por Serviço.png` | PNG | `lida` | Catálogo por workload, filtros, detalhe e rankings. |
| `07.Baselines, Alterações e Implantação.png` | PNG | `lida` | Estrutura visual de baselines, cobertura e divergências. |
| `08.Histórico e Auditoria.png` | PNG | `lida` | Log, detalhe antes/depois, evidências, origem e risco. |

## Evidências utilizadas

- O módulo possui oito abas e é um centro unificado de consulta — `Microsoft365_Configurações.docx` e imagens `01` a `08`.
- Pesos do score, travas de “Excelente” e definição de conforme/divergente — `Microsoft365_Configurações.docx`.
- Fontes, endpoints e limites de Graph/PowerShell/TCM — `Microsoft365_Configurações.docx`; validação documental atual via Microsoft Graph, Context7, 2026-08-24.
- Ordem, composição e títulos canônicos dos cards — imagens `01` a `08`.

## Lacunas e pendências

- A fórmula por domínio e o tratamento de ausência não estavam definidos pelo sponsor; decisões `C` (domínio sem coleta) e `A` (linha homologada sem leitura comparável recebe zero pontos, preservando `unavailable`) foram registradas pelo usuário em `README.md` — impacto: contrato do score definido, aguardando homologação de cálculo por conector.
- Não há matriz publicada que associe cada `setting_key` a baseline, severidade, permissão e fonte de leitura — impacto: a cobertura do catálogo permanece dependente da homologação por conector.
- TCM, PowerShell e APIs de segurança/Defender/Purview não possuem payload, consentimento ou homologação fornecidos — impacto: estados devem refletir cobertura real por conector. Em especial, TCM exige o service principal oficial próprio, permissões de monitoramento/snapshot e autorizações por workload; a App Registration Graph do customer não prova essa prontidão.
- **Configurações do Tenant:** `/organization`, `/domains`, branding e group settings não homologam contatos técnico/privacidade/segurança, tecnologia de diretório, última/próxima sincronização, contagens sincronizadas ou o estado operacional de todos os serviços exibidos na referência. `onPremisesSyncEnabled` é somente o fato de sincronização local. Esses campos permanecem `unavailable`/`restricted` até projeção ou fonte específica; os exemplos visuais não os completam.
- **Alterações e recomendações:** a primeira versão é somente leitura. Não há fonte homologada para rascunho, validação, aprovação, agendamento, execução, rollback ou recomendação determinística da Configurações. Alterações externas e drifts podem ser observados; não recebem estado de aprovação/investigação. Recomendações permanecem `unavailable` até existir regra versionada da matriz ou fonte canônica explicitamente homologada.
- **Conflito de documentos estruturantes:** `docs/PRD.md` e `docs/REQUIREMENTS.md` descrevem a POC inicial orientada a mocks/frontend e excluem integrações, persistência e exportação. As instruções vigentes em `AGENTS.md` e o discovery atual exigem fontes reais ou estados explícitos de indisponibilidade quando a integração estiver no escopo aprovado. A futura Spec deve declarar explicitamente qual recorte prevalece, sem reutilizar mock como dado de domínio.

## Tratamento de dados

Os nomes, contas, domínios, IDs, endereços e números das imagens são exemplos de referência e não são reproduzidos como dados de produto.
