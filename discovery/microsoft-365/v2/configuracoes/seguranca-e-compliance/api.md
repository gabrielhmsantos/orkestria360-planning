# APIs — Segurança e Compliance

Além das fontes TCM descritas abaixo, não há endpoint Microsoft Graph ou Azure adicional homologado para fatos Exchange nesta superfície. Os controles exibidos derivam das projeções de identidade, colaboração, configurações por serviço e auditoria que tiverem cobertura publicada.

## Tenant Configuration Management (TCM)

TCM foi **parcialmente validado em tenant**. Na revalidação, os tokens das duas conexões continham `ConfigurationMonitoring.Read.All`. `GET https://graph.microsoft.com/v1.0/admin/configurationManagement/configurationMonitors` respondeu `403` em uma conexão e `200` OData com `value: []` na outra. A listagem de monitores foi, portanto, exercitada; ela não retorna propriedades de recursos Exchange.

### Prontidão do principal TCM — observada em tenant

Foram homologadas duas leituras Graph `v1.0`, complementares à coleta TCM: `GET /servicePrincipals(appId='03b07b79-c5bc-4b5e-9bfa-13acf4a99998')?$select=appId,displayName,accountEnabled` e `GET /servicePrincipals(appId='03b07b79-c5bc-4b5e-9bfa-13acf4a99998')/memberOf/microsoft.graph.directoryRole` com `ConsistencyLevel: eventual`, `$count=true`, `$select=roleTemplateId,displayName` e filtro por `roleTemplateId`. A permission mínima documentada para ambas é `Application.Read.All` (ou uma permission Directory superior). A chamada pelo `appId` evita depender do object ID do tenant; `memberOf` verifica somente associação direta, não transitiva.

Nas duas conexões técnicas, a primeira retornou `200` para o principal e a segunda `404 Request_ResourceNotFound`; logo a instalação é um fato por customer, não uma premissa global. Na primeira, o filtro do template imutável de **Global Reader** (`f2ef992c-3afb-46b9-b7cf-a126ee74c451`) retornou `200` com um item. O filtro de **Security Reader** (`5d6b6bb7-de71-4623-b4af-96380a352509`) retornou `200` com `value: []`, enquanto a variante sem filtro retornou um item: `securityReaderAssigned=false` está comprovado para essa conexão, não é uma resposta vazia ambígua. Nenhum nome, ID de tenant, conexão ou payload nominal foi registrado.

Essas leituras confirmam pré-requisitos de coleta, não configuram nem executam TCM. Elas devem publicar, por customer, `tcmInstalled`, `m365AdminServicesInstalled`, `exchangeManageAsAppAssigned`, `globalReaderAssigned`, `securityReaderAssigned`, `observedAt`, `availability` e `reason`.

`m365AdminServicesInstalled` é validado por `GET /servicePrincipals(appId='6b91db1b-f05b-405a-a0b2-e3f60b28d645')?$select=appId,displayName,accountEnabled`, com permission mínima documentada `Application.Read.All`; essa leitura retornou `200` nas duas conexões. A tentativa prévia de criar novamente esse principal retornou `Request_MultipleObjectsWithSameKeyValue`, declarando que o service principal name já estava em uso. Essa é evidência complementar de que o principal já existia, não uma falha de instalação do TCM nem um método de detecção recorrente; request IDs e identificadores correlatos não são persistidos.

`exchangeManageAsAppAssigned` não é inferido por `value.length`. A validação resolve primeiro o principal oficial **Office 365 Exchange Online** com `GET /servicePrincipals(appId='00000002-0000-0ff1-ce00-000000000000')?$select=id,appId,displayName,appRoles`; localiza em `appRoles` a entrada cujo `value` é exatamente `Exchange.ManageAsApp` e guarda somente os IDs resolvidos em runtime: `exchangeServicePrincipal.id` e `exchangeManageAsAppRole.id`. Essa leitura retornou `200` com `id` e `appRoles` nas duas conexões.

Em seguida, lê `GET /servicePrincipals(appId='03b07b79-c5bc-4b5e-9bfa-13acf4a99998')/appRoleAssignments?$select=appRoleId,resourceId,resourceDisplayName,principalType`, com `Application.Read.All` (ou permission Directory superior). A consulta verifica o principal **TCM**, não o Orkestria 360. O resultado é `true` somente se houver assignment com `resourceId == exchangeServicePrincipal.id` **e** `appRoleId == exchangeManageAsAppRole.id`; `resourceDisplayName` é diagnóstico, nunca chave de autorização. `200` sem esse assignment retorna `false`; TCM ausente, `403`, erro ou resposta não verificável retorna `unavailable` com razão. Na evidência atual, a coleção do TCM retornou `200` com `value: []`, portanto `exchangeManageAsAppAssigned=false` para aquela conexão. Atribuições recentes podem sofrer atraso de replicação.

### Disponibilidade dos recursos Exchange via TCM

- `antiPhishPolicy` e `antiPhishRule` só ficam disponíveis com TCM instalado, M365 Admin Services provisionado, `Exchange.ManageAsApp` atribuído ao principal TCM, `Security Reader` atribuído ao principal TCM, licença elegível e snapshot TCM acessível que contenha esses recursos.
- `inboundConnector` e `outboundConnector` só ficam disponíveis com TCM instalado, M365 Admin Services provisionado, `Exchange.ManageAsApp` atribuído ao principal TCM, `Global Reader` atribuído ao principal TCM, licença elegível e snapshot TCM acessível que contenha esses recursos.

Em particular: `Security Reader` ausente torna apenas `antiPhishPolicy`/`antiPhishRule` `unavailable`; `Global Reader` ausente torna apenas `inboundConnector`/`outboundConnector` `unavailable`; `Exchange.ManageAsApp` ausente torna ambos os grupos `unavailable`. Nenhuma dessas indisponibilidades equivale a política desabilitada, conector sem TLS ou configuração insegura, ativa trava ou autoriza criação de snapshot pelo Orkestria.

O contrato do repositório Microsoft Graph distingue as versões: em `v1.0`, a tabela informa que a listagem de snapshots não suporta Application; em `beta`, a tabela indicada para `GET /admin/configurationManagement/configurationSnapshots` aceita `ConfigurationMonitoring.Read.All` em Application (e `ReadWrite.All` como privilégio maior). A fonte TCM candidata para a conexão app-only é, portanto, **beta**, sujeita à instabilidade dessa versão.

Na validação beta, `GET https://graph.microsoft.com/beta/admin/configurationManagement/configurationSnapshots` não retornou sucesso: em uma conexão, `403` com `error.code: UnknownError` e corpo informando requisito de licença Microsoft 365 E3 ou Azure AD Premium P1; na outra, `404` com `error.code: UnknownError` e `message` vazia. Na segunda conexão, `GET /beta/admin/configurationManagement/configurationSnapshotJobs` respondeu `200` OData com `value: []`, usando a mesma permission. Os dois tenants de validação não possuem snapshot Exchange disponível. Não houve criação de snapshot: o Orkestria não cria snapshots TCM e o módulo é read-only.

Após a confirmação do principal TCM e de sua role **Global Reader** na conexão habilitada, a listagem `GET /beta/admin/configurationManagement/configurationSnapshotJobs` foi repetida com e sem `$select=status,resources,resourceLocation,completedDateTime`: nessa conexão ela respondeu `403` com requisito explícito de licença E3/P1; na outra, ambas as variantes responderam `200` OData com `value: []`. Logo, Global Reader satisfaz o pré-requisito Entra documentado para conectores, mas não substitui a licença TCM nem fornece um snapshot. O fluxo TCM documentado expõe os recursos Exchange no resultado de um snapshot job; sem job/snapshot acessível que inclua `microsoft.exchange.inboundConnector` ou `microsoft.exchange.outboundConnector`, não há payload de conector a validar por `GET` nesta rodada.

### Contrato Exchange documentado no Microsoft Learn — não observado em tenant

Os recursos a seguir são schemas documentados de recursos dentro de snapshots TCM; nenhum payload Exchange deles foi observado nos dois tenants e todos têm `x-observed=false` no OpenAPI local.

| Recurso | Propriedades relevantes para a trava | Permissões documentadas para leitura |
| --- | --- | --- |
| `antiPhishPolicy` | `Identity`, `Ensure`, `Enabled` | O service principal **TCM** requer `Security Reader`; a leitura Exchange requer `Exchange.ManageAsApp`. |
| `antiPhishRule` | `Identity`, `AntiPhishPolicy`, `Ensure`, `Enabled`, `Priority`; `AntiPhishPolicy` correlaciona regra e política | O service principal **TCM** requer `Security Reader`; a leitura Exchange requer `Exchange.ManageAsApp`. |
| `inboundConnector` | `Identity`, `Ensure`, `Enabled`, `RequireTls`, `RestrictDomainsToCertificate`, `TlsSenderCertificateName` | O service principal **TCM** requer `Global Reader`; a leitura Exchange requer `Exchange.ManageAsApp`. |
| `outboundConnector` | `Identity`, `Ensure`, `Enabled`, `TlsSettings` (`EncryptionOnly`, `CertificateValidation`, `DomainValidation`) e `TlsDomain` | O service principal **TCM** requer `Global Reader`; a leitura Exchange requer `Exchange.ManageAsApp`. |

O service principal TCM é o principal Microsoft de application ID `03b07b79-c5bc-4b5e-9bfa-13acf4a99998`; não é o service principal Orkestria 360. A permissão Graph `ConfigurationMonitoring.Read.All` pertence à chamada Graph do Orkestria e não substitui as roles/permissões do principal TCM para o workload. Em runtime, antiphishing e conectores TLS permanecem `unavailable` enquanto não houver snapshot TCM acessível com esses recursos. Essa indisponibilidade não significa política desabilitada, conector sem TLS ou valor zero. PowerShell não foi testado nem introduzido.

## Uso pela aplicação

A superfície é leitura local. Defender, Purview, PowerShell e APIs especializadas permanecem fora desta validação; TCM tem contrato documentado e validação parcial de transporte, mas não payload Exchange observado. Ausência de fonte acessível é exibida como cobertura indisponível, sem dado inferido.
