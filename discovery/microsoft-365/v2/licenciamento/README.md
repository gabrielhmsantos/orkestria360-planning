# Discovery — Microsoft 365 / Licenciamento

O submódulo é composto por sete subpáginas/abas: Dashboard Executivo, Inventário, Consumo, Custos, Otimização, Histórico e Planejamento. A V2 entrega fotografia técnica e evidência de uso do Microsoft 365; dados comerciais e ações transacionais permanecem fora desta versão.

O detalhamento de cada bloco esperado pelo sponsor, inclusive os espaços que permanecem visíveis enquanto dependem de fonte futura, está em [Expectativas ilustradas do sponsor](expectativas-ilustradas.md). Esse documento é a referência de completude de informação; os limites de fonte e operação abaixo continuam válidos.

## Ordem das subpáginas

1. [Dashboard Executivo](dashboard-executivo/)
2. [Inventário de Licenças](inventario/)
3. [Consumo](consumo/)
4. [Custos](custos/)
5. [Otimização](otimizacao/)
6. [Histórico](historico/)
7. [Planejamento](planejamento/)

## Princípios transversais

- **Graph não é fonte financeira**: preços, contratos, renovações, faturas e margem não estão disponíveis na V2. Futuramente pertencerão ao Assessment/importação CSV e à base comercial do Orkestria.
- **Conclusões são explicáveis**: economia, ociosidade, downgrade e priorização precisam registrar regra, evidência, período, confiança e exceções.
- **Histórico é próprio**: Graph representa o estado atual; snapshots e eventos internos mantêm a trilha de evolução.
- **Leitura não é execução**: a V2 não cria workflow, solicitação, compra ou alteração no tenant. Controles que dependeriam disso exibem “Em breve”.
- **Dados pessoais têm contexto**: a tela declara se os relatórios estão identificados, anonimizados, indisponíveis ou com permissão insuficiente.
- **Sincronização MVP**: a coleta Graph ocorre uma vez ao dia. A interface informa última sincronização, próxima execução esperada e falha/defasagem; mudanças intradia podem aparecer apenas no ciclo seguinte.

## Convenções de contrato

Os contratos são internos entre o backend Laravel e páginas Inertia/React. Todos os blocos estruturados expõem `source`, `lastUpdatedAt` e `freshness` (`fresh`, `stale` ou `unavailable`). Valores monetários usam `{ amount, currency }`; valores ausentes não são convertidos em zero.

## Dependências comuns

| Domínio | Fonte preferencial |
| --- | --- |
| SKUs, capacidade e planos | Microsoft Graph `/subscribedSkus` |
| Usuários e atribuições | Microsoft Graph `/users` e `/users/{id}/licenseDetails` |
| Uso e adoção | Microsoft 365 usage reports e conectores específicos por produto |
| Contratos, preços e faturas | indisponível na V2; futuro Assessment/importação CSV |
| Histórico e regras | snapshots, eventos e serviços Orkestria |

## Decisão V2 — dados comerciais e importação futura

O modelo comercial interno permanece desenhado e vinculado a `tenant_id` e `sku_id`/`sku_part_number`, mas **não será preenchido nem importado na V2**. Ele complementará, futuramente, a fotografia técnica de `/subscribedSkus`.

O Assessment disponibilizará um CSV para preenchimento pelo responsável do tenant e uma futura importação validará esses dados. O template deve conter fornecedor, identificador externo da assinatura, SKU, quantidade contratada/faturada, preço unitário efetivo, moeda, desconto, impostos, ciclo de cobrança, termo de compromisso, início, fim, renovação, renovação automática, status, origem e data de atualização. Deve suportar múltiplas assinaturas por SKU, pré-visualização de erros, idempotência e trilha de importação.

Até essa entrada existir, cada campo e cálculo comercial deve permanecer `unavailable` com a mensagem “Aguardando dados comerciais do Assessment”; ausência nunca é convertida em zero, estimativa ou data inventada. O Graph é normativo apenas para SKU, capacidade e consumo técnico. Partner Center ou distribuidor poderão futuramente reconciliar os mesmos registros.

## Escopo da V2

A V2 cobre somente licenças Microsoft 365 observáveis pelo Microsoft Graph. Windows Server, SQL Server, CAL/RDS, Azure e demais produtos sem leitura Graph neste submódulo ficam para uma fase futura, alimentados por Assessment/CSV ou por fonte comercial apropriada.

## Homologação de acesso app-only

As superfícies abaixo foram homologadas em tenant real com o coletor PHP do projeto. Cada novo tenant ainda exige consentimento administrativo, licença aplicável e teste de conectividade.

| Superfície | Aplicação candidata | Situação app-only | Observação |
| --- | --- | --- | --- |
| `GET /subscribedSkus` | `LicenseAssignment.Read.All` | Compatível | Base técnica de SKU e capacidade. |
| `GET /users` e `GET /users/delta` | `User.Read.All` | Compatível | `delta` não acompanha `licenseAssignmentStates`. |
| `GET /groups` e membros | `Group.Read.All` / `GroupMember.Read.All` | Compatível | Necessário somente para explicar atribuição por grupo. |
| Microsoft 365 usage reports | `Reports.Read.All` | Compatível | Relatórios retornam CSV/redirecionamento e podem estar anonimizados. |
| `GET /auditLogs/directoryAudits` | `AuditLog.Read.All` + `Directory.Read.All` | Compatível | Cobertura e retenção devem ser avaliadas por tenant. |
| `GET /organization` | `Organization.Read.All` | Compatível | Opcional, apenas para contexto do tenant. |
| `GET /users/{id}/licenseDetails` | `LicenseAssignment.Read.All` | Observado como `200 OK` | A documentação do endpoint ainda declara `Application: Not supported`; tratar como enriquecimento e revalidar por tenant. |

Referências de validação: [subscribedSkus](https://learn.microsoft.com/en-us/graph/api/subscribedsku-list?view=graph-rest-1.0), [usuários](https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0), [delta](https://learn.microsoft.com/en-us/graph/api/user-delta?view=graph-rest-1.0), [relatórios](https://learn.microsoft.com/en-us/graph/reportroot-authorization), [auditoria](https://learn.microsoft.com/en-us/graph/api/directoryaudit-list?view=graph-rest-1.0) e [licenseDetails](https://learn.microsoft.com/en-us/graph/api/user-list-licensedetails?view=graph-rest-1.0).

### Ponto de viabilização — `licenseDetails`

`GET /users/{id}/licenseDetails` respondeu `200 OK` com o fluxo app-only do tenant homologado. Porém, a matriz de permissões atual do próprio endpoint ainda informa `Application: Not supported`.

Portanto, o conector deve revalidá-lo por tenant e usar `/users` em lote com `assignedLicenses`, `assignedPlans` e `licenseAssignmentStates` como fallback. A indisponibilidade de `licenseDetails` não bloqueia Inventário ou Consumo.

## Estado

Discovery de produto e arquitetura. Não define ainda uma rota pública, esquema físico definitivo ou integração comercial específica.
