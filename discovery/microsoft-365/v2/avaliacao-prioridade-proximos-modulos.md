# Avaliação de prioridade — próximos módulos Microsoft 365

**Data:** 2026-09-02
**Objetivo:** escolher o próximo módulo com maior cobertura útil por tenant e menor dependência de licenças, APIs especializadas ou identidades administrativas exclusivas.

## Escopo e método

Esta avaliação cobre apenas módulos do diretório de referências do sponsor que ainda não possuem uma frente de implementação própria: **Relatórios, SharePoint, OneDrive, Teams, Exchange, Intune e Microsoft Defender**. Licenciamento, Usuários e Contas, Grupos, Autenticação (MFA), Secure Score e Configurações já têm discovery/spec/implementação em andamento e não foram reordenados.

O critério de prioridade é, nesta ordem:

1. aderência ao principal app-only já usado pelo Orkestria;
2. ausência de licença adicional exclusiva do workload;
3. endpoint `v1.0` Graph suportado, sem API de produto/audience específico, e evidência já obtida em conexão customer ou fonte canônica local reutilizável;
4. proporção da referência do sponsor que pode ser entregue sem declarar uma falsa cobertura;
5. menor necessidade de PowerShell, API com audience diferente, API beta ou permissão extremamente ampla.

O procedimento temporário obrigatório do skill (`validate-graph/scripts/validate-endpoint.php`) não existe neste checkout. Por isso, **não houve uma nova chamada externa nesta rodada**: seria inadequado criar um cliente ad hoc ou usar credenciais fora do fluxo aprovado. A conclusão combina evidência técnica já versionada, código de coleta existente e documentação oficial consultada via Context7. Não transfere disponibilidade entre customers.

## Resultado: ordem recomendada

| Ordem | Módulo | Decisão | Dependência de licença/integração | Evidência atual e recorte inicial seguro |
| --- | --- | --- | --- | --- |
| 1 | **Relatórios** | Próximo módulo recomendado | Não requer SKU especializado do Orkestria: a autorização app-only dos relatórios Microsoft 365 usa `Reports.Read.All`, com consentimento administrativo. Depende, naturalmente, de serviços Microsoft 365 licenciados que emitam o relatório. | A família `/reports` é Graph `v1.0` e já sustenta Licenciamento, Grupos e usuários. Começar por catálogo e relatórios executivos/operacionais CSV, mantendo preço, custo, agendamento e distribuição como dados locais ou `unavailable`. |
| 2 | **SharePoint** | Melhor módulo operacional após Relatórios | Sem licença exclusiva além do SharePoint Online do tenant. Inventário de sites pode usar `Sites.Read.All`; postura de tenant requer `SharePointTenantSettings.Read.All`. Permissões diretas de site exigem permissão mais ampla no contrato já validado, mas a coleta continua estritamente `GET`. | `sites/getAllSites`, `sites/{site-id}/permissions` e `admin/sharepoint/settings` já responderam `200`. Entregar inventário, postura global e permissões diretas observadas; não afirmar inventário de arquivos, permissões de itens ou exposição efetiva sem nova coleta. |
| 3 | **OneDrive** | Implementar junto ou logo após SharePoint, em recorte de uso e postura | Sem licença exclusiva se o tenant já possui OneDrive. O relatório de uso por conta é Graph `v1.0` com somente `Reports.Read.All`; inventário detalhado de drives/arquivos amplia permissões, volume e PII. | Reutiliza `admin/sharepoint/settings` para postura e protocolos legados. Iniciar por contas, armazenamento e atividade agregada de relatórios; postergar conteúdo, compartilhamento por item e retenção individual. |
| 4 | **Teams** | Viável, mas não é o próximo melhor custo/complexidade | Adoção usa `Reports.Read.All`, mas qualidade de reuniões requer o privilégio exclusivo `CallRecords.Read.All` para todas as chamadas/reuniões e só há retenção Graph de 30 dias. PSTN, Phone e Premium acrescentam dependências próprias. | Reutilizar Grupos para equipes e a família de reports para adoção. Deixar `callRecords`, conteúdo de mensagens, apps pessoais, Teams Phone e Premium fora do primeiro corte. |
| 5 | **Exchange** | Adiar como módulo completo; só é viável agora como recorte de relatórios | Relatórios básicos usam `Reports.Read.All`, mas a referência exige inventário de mailbox, fluxo, conectores, regras de transporte, retenção e proteção que dependem de Exchange Online PowerShell, Purview/Defender ou TCM. | `messageRules` de Inbox já retornou `200 value: []`, mas não cobre forwarding de mailbox nem regras de transporte. Um módulo completo teria cobertura excessivamente parcial; se antecipado, nomeá-lo explicitamente como “Uso do Exchange”. |
| 6 | **Intune** | Não priorizar | Requer licença Intune ativa e habilitação por tenant, além de permissões `DeviceManagement*`. Alguns recursos úteis são somente `beta`. | `managedDevices` retornou `401` na evidência existente; outras coleções retornaram `200` apenas em uma segunda conexão e `401` na primeira, embora a role estivesse presente. Implementar apenas quando houver customer com licença e consentimento confirmados. |
| 7 | **Microsoft Defender** | Não priorizar | Exige produto Defender apropriado, API de segurança com audience próprio e `Machine.Read.All`; a referência também envolve Defender for Office 365 e Purview. | `https://api.security.microsoft.com/api/machines` retornou `403`. Não há base suficiente para uma superfície de incidentes, vulnerabilidades e resposta sem estados majoritariamente `restricted`. |

## Recomendação de entrega

1. Formalizar **Relatórios** como módulo de agregação de fontes já suportadas: catálogo, executivos, operacionais e exportação local. Não prometer custo, construtor, agendamento ou distribuição sem autoridade local aprovada.
2. Em seguida, abrir **SharePoint** com as três fontes já comprovadas e publicação local coordenada.
3. Acrescentar **OneDrive** como extensão do mesmo ciclo apenas para postura e uso agregado; decidir uma nova coleta antes de qualquer enumeração de arquivos ou permissões de item.
4. Tratar **Teams** como próximo candidato somente depois de reutilizar os fatos de Grupos e Relatórios.

## Restrições e pendências por fonte

- **Relatórios:** `Reports.Read.All` permite a família de reports em app-only; os arquivos CSV e sua data de atualização precisam de estratégia `reportRefreshDate`, redirect protegido e tratamento de PII conforme a fonte.
- **SharePoint/OneDrive:** a resposta vazia de permissões diretas é válida e não significa ausência de compartilhamento em subsites, bibliotecas, pastas ou arquivos. A permissão ampla deve ser acompanhada de conector read-only e publicação de cobertura/frescor.
- **Teams:** o módulo de referência mistura inventário, adoção, qualidade de chamadas e governança. Apenas os dois primeiros têm um corte inicial de baixa dependência; não usar métricas de call records para representar toda a qualidade do tenant.
- **Exchange:** não substituir Exchange Online PowerShell/TCM/Purview por Graph Reports. Cada fonte ausente deve ficar `unavailable` ou `restricted`, nunca ser inferida como política segura ou inexistência de risco.
- **Intune:** `401`/`403` não é zero dispositivos. A viabilidade observada em outra conexão prova somente que o endpoint pode ser usado, não que todo customer tenha Intune habilitado.
- **Defender:** `403` não prova ausência de máquinas ou incidentes; prova restrição atual de autorização/produto. Requer validação posterior por audience separado.

## Evidências consultadas

- `discovery/microsoft-365/v2/secure-score/dashboard-executivo/api.md`: resultados anteriores de SharePoint (`200`), Exchange Inbox Rules (`200 value: []`), Intune (`401`) e Defender for Endpoint (`403`).
- `discovery/microsoft-365/v2/configuracoes/colaboracao-e-compartilhamento/api.md`: validação em duas conexões de `/admin/sharepoint/settings` e os campos seguros para a postura SharePoint/OneDrive.
- `discovery/microsoft-365/v2/configuracoes/configuracoes-por-servico/api.md`: resultado misto das coleções Intune nas duas conexões.
- Referências do sponsor em `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/`: o módulo Exchange depende explicitamente de Exchange Online PowerShell e fontes complementares; Intune exige licença ativa; Teams combina reports com call records; Defender concentra fontes especializadas.

## Documentação Microsoft Learn que fundamenta a ordem

- [Autorização dos relatórios de uso Microsoft 365](https://learn.microsoft.com/graph/reportroot-authorization): application-only é suportado com consentimento administrativo; a família é protegida por `Reports.Read.All`.
- [Relatório detalhado de uso OneDrive](https://learn.microsoft.com/graph/api/reportroot-getonedriveusageaccountdetail?view=graph-rest-1.0): endpoint `v1.0`, `Reports.Read.All`, retorno CSV via `302` para URL pré-autenticada temporária.
- [Inventário de sites SharePoint](https://learn.microsoft.com/graph/api/site-getallsites?view=graph-rest-1.0) e [configurações SharePoint/OneDrive do tenant](https://learn.microsoft.com/graph/api/sharepointsettings-get?view=graph-rest-1.0): endpoints Graph `v1.0`, app-only, com permissões de leitura específicas e sem exigir produto Intune/Defender.
- [Call Records](https://learn.microsoft.com/graph/api/callrecords-cloudcommunications-list-callrecords?view=graph-rest-1.0): requer `CallRecords.Read.All` exclusivamente em application permission e conserva somente 30 dias de registros.
- [Intune managedDevices](https://learn.microsoft.com/graph/api/intune-devices-manageddevice-list?view=graph-rest-1.0): requer licença Intune ativa no tenant, além de `DeviceManagementManagedDevices.Read.All`.
- [Máquinas do Defender for Endpoint](https://learn.microsoft.com/defender-endpoint/api/get-machines): API fora do host Graph, com audience próprio e `Machine.Read.All`.

## Próxima validação autorizada

Quando o `validate-graph/scripts/validate-endpoint.php` estiver disponível no checkout, executar a coleta técnica em até duas conexões, nesta ordem:

1. Relatórios: um endpoint CSV de uso por workload, sem registrar conteúdo ou URL de redirect.
2. OneDrive: endpoint de relatório de uso, depois do recorte de PII.
3. Teams: um endpoint de relatório de atividade e a listagem de equipes, sem `callRecords` no primeiro ciclo.
4. Exchange: um endpoint de relatório de mailbox, mantendo PowerShell/TCM como pendências independentes.

Os resultados devem atualizar `api.md`, `openapi.yaml` e `contratos.md` da subpágina escolhida antes de uma Spec de implementação.
