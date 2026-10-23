# Fontes e rastreabilidade — Microsoft 365 / Autenticação (MFA)

## Diretório informado

`docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Autenticação (MFA)`

As referências foram mantidas somente para leitura.

## Inventário de referências

| Caminho relativo | Tipo | Status | Uso ou impacto |
| --- | --- | --- | --- |
| `Microsoft365_Autenticação (MFA).docx` | DOCX | `lida` | Escopo, oito superfícies, métricas, fontes Graph, permissões, coleta e modelo recomendado. |
| `01.Dashboard Executivo.png` | PNG | `lida` | Composição e blocos do dashboard. |
| `02.Cobertura e Registro de MFA.png` | PNG | `lida` | KPIs, gráficos, tabela, destaques e oportunidades. |
| `03.Métodos de Autenticação.png` | PNG | `lida` | KPIs, distribuição, adoção, tabela e recomendações. |
| `04.Eventos e Utilização.png` | PNG | `lida` | Filtros, gráficos operacionais, tabela e insights. |
| `05.Falhas e Bloqueios.png` | PNG | `lida` | Falhas, recorrência, IPs, aplicações e recomendações. |
| `06.Políticas e Proteção.png` | PNG | `lida` | Score, políticas, forças, exceções e verificações. |
| `07.Usuários de Risco.png` | PNG | `lida` | KPIs, tendências, risco geográfico, tabela e ações. |
| `08.Histórico e Auditoria.png` | PNG | `lida` | Filtros, tabela, detalhe, retenção e origens. |

## Evidências utilizadas

- As oito superfícies e sua ordem são confirmadas pelo DOCX e pelas oito imagens correspondentes.
- Registro em massa, diretório, sign-ins, políticas, risco e auditoria usam endpoints Microsoft Graph descritos no DOCX.
- A composição por cartões, gráficos, tabelas, painéis laterais, filtros e rodapé informativo é confirmada pelas imagens.
- A aplicação atual já trata MFA, risco e eventos como fontes de estado independentes — `docs/MICROSOFT365-SYNC-AVALIACAO.md` e `specs/004-usuarios-contas/status-de-dados.md`; isso é contexto técnico, não uma decisão do sponsor sobre este módulo.

## Auditoria de cobertura de endpoints

A auditoria confrontou todas as rotas `GET` explícitas no DOCX com os artefatos do discovery. Todas possuem contrato externo (`api.md`), shape HTTP (`openapi.yaml`) e decisão de consumo (`contratos.md`) na superfície indicada; `/users` reutiliza o contrato canônico de Diretório de Usuários, referenciado pela superfície de Cobertura.

| Endpoint | Origem | Superfície e artefatos | Resultado documentado |
| --- | --- | --- | --- |
| `/users` | DOCX | [Cobertura](cobertura-e-registro-de-mfa/api.md) + [Diretório canônico](../usuarios-e-contas/diretorio-de-usuarios/api.md) | projeção local de identidades. |
| `/reports/authenticationMethods/userRegistrationDetails` | DOCX | [Cobertura](cobertura-e-registro-de-mfa/api.md), [Métodos](metodos-de-autenticacao/api.md) | endpoint viável; snapshot MFA. |
| `/users/{user-id}/authentication/methods` | DOCX | [Métodos](metodos-de-autenticacao/api.md) | leitura complementar; `restricted` por permissão. |
| `/policies/authenticationMethodsPolicy` | DOCX | [Métodos](metodos-de-autenticacao/api.md), [Políticas](politicas-e-protecao/api.md) | endpoint viável; nova coleta snapshot justificada. |
| `/policies/authenticationStrengthPolicies` | DOCX | [Políticas](politicas-e-protecao/api.md) | endpoint viável; nova coleta snapshot justificada. |
| `/identity/conditionalAccess/policies` | DOCX | [Políticas](politicas-e-protecao/api.md) | endpoint viável; `empty_valid_response` no tenant. |
| `/policies/identitySecurityDefaultsEnforcementPolicy` | discovery | [Políticas](politicas-e-protecao/api.md) | endpoint viável; nova coleta snapshot justificada. |
| `/auditLogs/signIns` | DOCX | [Eventos](eventos-e-utilizacao/api.md), [Falhas](falhas-e-bloqueios/api.md) | endpoint viável; event store por watermark. |
| `/identityProtection/riskyUsers` | DOCX | [Risco](usuarios-de-risco/api.md) | `restricted` por licença Entra ID P2. |
| `/identityProtection/riskDetections` | DOCX | [Risco](usuarios-de-risco/api.md) | `restricted` por licença Entra ID P2. |
| `/identityProtection/riskyUsers/{user-id}/history` | DOCX | [Risco](usuarios-de-risco/api.md) | `restricted` por licença Entra ID P2. |
| `/auditLogs/directoryAudits` | DOCX | [Histórico](historico-e-auditoria/api.md) | endpoint viável; event store por watermark. |

## Lacunas e pendências

- Os números e amostras nas imagens são demonstrativos — impacto: não há dataset para valores iniciais; próximo passo: publicar estados de fonte e projeções reais.
- Elegibilidade, conta técnica, exceção, classificação de método, limiares de alerta e score são recomendados no DOCX, não aprovados como norma — impacto: devem ser configuráveis ou decididos na Spec.
- Licenciamento Entra, consentimento efetivo, cobertura e retenção por tenant não estão comprovados — impacto: blocos dependentes iniciam `restricted` ou `unavailable` conforme a fonte.
- Não há confirmação de workflow operacional para ações sensíveis — impacto: ações permanecem `coming_soon`.

## Tratamento de dados

Não são reproduzidos nomes, UPNs, IPs, IDs, correlações, valores de eventos ou outros dados pessoais presentes apenas como ilustração nas referências.
