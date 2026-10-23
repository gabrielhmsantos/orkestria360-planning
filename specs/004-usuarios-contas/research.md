# Research: Usuários e Contas Microsoft 365 V2

## Decisões

### Fotografia de Diretório e continuidade Graph

**Decision**: a aplicação é single-tenant e coleta o tenant configurado em geração de staging. Materializar a geração publicada no staging, fazer merge idempotente por `graph_id`, aplicar `@removed` como tombstone e promover por ponteiro exclusivo somente depois de gravar a fotografia íntegra e o cursor na mesma transação. Usar `/users/delta` nos ciclos incrementais; reiniciar uma sincronização completa quando o cursor for inválido.

**Rationale**: links `@odata.nextLink` e `@odata.deltaLink` são opacos, e um delta contém apenas mudanças. Um reset ou remoção não pode expor combinação de itens novos/antigos, perder itens inalterados ou preservar itens removidos. `tenant_id` continua no dado como escopo, mas não seleciona outra conexão Graph.

**Alternatives considered**: atualizar a tabela visível item a item (rejeitada: pode misturar gerações); chamar Graph a cada abertura de página (rejeitada: instável, expõe cobertura variável e não preserva histórico).

### Disponibilidade, vazio e frescor

**Decision**: modelar `availabilityStatus` separado de `freshness`. Uma resposta `value: []` válida é `empty_valid_response`; se um filtro causar o vazio e a consulta sem filtro tiver itens, registrar a consulta filtrada como `no_matches`, mantendo a rota disponível. `403`, `404`, erro Graph e `400 AadPremiumLicenseRequired` formam diagnósticos de restrição/indisponibilidade.

**Rationale**: zero, ausência de itens, falta de licença, erro e fotografia antiga têm significados diferentes e não podem ser colapsados na interface.

**Alternatives considered**: uma flag única de status (rejeitada: perde frescor ou capacidade); substituir a resposta filtrada pela não filtrada (rejeitada: altera o contrato efetivamente recebido).

### Integração Graph e licenças

**Decision**: reutilizar `GraphClientFactory`/`GraphDataClient` app-only e estender `GraphClient` com métodos de leitura de identidade. A reconciliação diária da geração obtém `assignedLicenses`, `assignedPlans` e `licenseAssignmentStates` diretamente de `/users`; `UserLicenseAssignment` e `TenantLicenseSku` são leitura cruzada suplementar com frescor declarado. `licenseDetails` permanece enriquecimento opcional observado como viável no tenant de validação, com fallback normativo em `/users`.

**Rationale**: o conector existente já centraliza credenciais, paginação e chamadas de backend; o Diretório exige atributos além dos campos mínimos de Licenciamento.

**Alternatives considered**: SDK/chamadas HTTP diretamente nos controllers (rejeitada: duplica autenticação e dificulta mocks); depender de `delta` para atribuições (rejeitada: não rastreia `licenseAssignmentStates`); depender só de `licenseDetails` (rejeitada: a compatibilidade app-only requer fallback).

### Relatórios CSV, PII e exportação

**Decision**: para relatórios Graph em `302`, seguir somente a URL pré-autenticada para obter o arquivo, sem reenviar bearer token, e ler cabeçalhos para normalizar campos permitidos. Persistir referência privada e derivados necessários; nunca linhas brutas, URL de download ou PII em logs. A exportação do produto é CSV local, autorizada e auditada.

**Rationale**: relatórios de atividade podem conter PII e possuem cobertura/defasagem própria. O produto precisa declarar a origem sem expor a transferência original.

**Alternatives considered**: passar CSV para o navegador ou logs (rejeitada: exposição); suportar XLSX agora (rejeitada: fora do recorte V2).

### Fontes dependentes de licença ou permissão

**Decision**: coletar cada fonte de forma isolada e persistir seu diagnóstico. Funções permanentes podem ficar disponíveis independentemente de PIM; respostas de PIM sem P2 são `restricted`. O catálogo inicial aprovado permite categorias e severidades derivadas da geração publicada; score composto, triagem, evolução, recomendações, RH e revisão de acesso permanecem `unavailable` até fonte e regras aprovadas.

**Rationale**: uma fonte limitada não deve bloquear os dados básicos, nem criar conclusões por ausência.

**Alternatives considered**: ocultar blocos sem licença (rejeitada: mascara a cobertura); inferir dados internos pelo Graph (rejeitada: sem fonte autorizada).

### Autorização e proteção de dados

**Decision**: reutilizar somente `auth` e `verified` já existentes, sem criar papel local ou Gate nesta V2; registrar acesso/solicitação de exportação para rastreabilidade. Todos os acessos e consultas persistidas são filtrados por `tenant_id`; PII e evidência ficam em armazenamento protegido.

**Rationale**: as rotas Microsoft 365 atuais usam apenas `auth, verified`; isso não atende à restrição de público da V2.

**Alternatives considered**: criar papel local ou Gate específico (rejeitada: o Orkestria 360 ainda não possui limitações por papel); criar matriz por campo (rejeitada: fora do escopo atual).

## Sources Consulted

- [Contrato de viabilização Graph](../../discovery/microsoft-365/v2/usuarios-e-contas/api-viabilizacao.md)
- [Usuários e contas: estrutura das telas](../../discovery/microsoft-365/v2/usuarios-e-contas/representacao-estrutural-das-telas.md)
- Microsoft Learn: [user delta](https://learn.microsoft.com/graph/delta-query-users), [active user detail](https://learn.microsoft.com/graph/api/reportroot-getoffice365activeuserdetail), [role eligibility instances](https://learn.microsoft.com/graph/api/rbacapplication-list-roleeligibilityscheduleinstances), [role assignment instances](https://learn.microsoft.com/graph/api/rbacapplication-list-roleassignmentscheduleinstances)
- Padrões internos: `GraphClientFactory`, `GraphDataClient`, `SyncMicrosoft365Licensing` e `LicensingPageData`.
