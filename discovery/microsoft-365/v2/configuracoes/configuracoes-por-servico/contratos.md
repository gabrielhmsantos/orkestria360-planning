# Configurações por Serviço — Contratos

- Catálogo: `settingKey`, serviço, categoria, nome, descrição, fonte de leitura, API, permissões, escopo, tipo e risco.
- Estado: tenant, objeto/escopo, valor atual, hash, baseline, conformidade, risco, origem, versão, `sourceLastModifiedAt`, `lastObservedChangeAt` e `lastCollectedAt`. As três datas não são intercambiáveis.
- Detalhe: metadados de leitura e `availabilityState`.
- Uma linha da matriz é versionada e só pode participar de baseline, conformidade, cobertura ou score quando homologar conjuntamente `settingKey`, fonte, versão, escopo, valor atual, baseline Orkestria/sponsor, risco/severidade e regra de comparação. A ordem de escolha da fonte é Graph `v1.0`, TCM oficialmente suportado, API oficial especializada e PowerShell para lacuna comprovada.

## Integração com o sync coordenado

As cinco coleções Intune não têm projeção canônica equivalente, mas são endpoints viáveis para discovery: a primeira conexão retornou `401 UnknownError` em todas, apesar de a claim `DeviceManagementConfiguration.Read.All` estar presente; a segunda retornou `200` em todas. A restrição da primeira não é falta dessa role e não pode ser atribuída a licença sem código Graph explícito. `deviceCompliancePolicies` e `deviceConfigurations` são `v1.0`; `configurationPolicies`, `intents` e `groupPolicyConfigurations` são exclusivas de `beta` e não entram como fonte estável da primeira implementação sem decisão explícita. `intents` retornou envelope OData vazio válido na conexão viável. A disponibilidade, cobertura, frescor, razão e `result_state` são publicados por conexão customer, sem fallback ou transferência de dados; a tela não chama Graph.
