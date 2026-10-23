# Discovery — Microsoft 365 / Configurações

## Objetivo

Mapear o centro unificado de consulta das configurações do tenant Microsoft 365: coletar e normalizar estado, compará-lo com baselines, expor divergências, drift e histórico observado.

## Escopo e superfícies

1. [Dashboard Executivo](dashboard-executivo/)
2. [Configurações do Tenant](configuracoes-do-tenant/)
3. [Identidade e Acesso](identidade-e-acesso/)
4. [Colaboração e Compartilhamento](colaboracao-e-compartilhamento/)
5. [Segurança e Compliance](seguranca-e-compliance/)
6. [Configurações por Serviço](configuracoes-por-servico/)
7. [Baselines e Conformidade](baselines-e-conformidade/)
8. [Histórico e Auditoria](historico-e-auditoria/)

## Limites da versão

- A primeira implementação é exclusivamente de leitura; a interface e seus contratos cobrem somente dados coletados e normalizados.
- Uma configuração sem conector, licença, permissão, workload habilitado ou resposta comparável permanece `unavailable`; identificadores ou detalhes cuja leitura dependa de autorização ficam `restricted`.
- DNS externo não é gerenciado pelo módulo. APIs beta só podem ser usadas como fonte de leitura após validação de estabilidade e consentimento.

## Princípios e dependências

- O catálogo registra fonte de leitura, versão de API, permissões requeridas, escopo, tipo e risco do dado.
- Fontes previstas: Microsoft Graph, Tenant Configuration Management (TCM), APIs especializadas, PowerShell de cada workload e dados/auditoria próprios do Orkestria.
- A trilha de auditoria registra somente mudanças observadas pelos conectores e pelo histórico interno.
- Dados exibidos devem informar fonte, cobertura, última coleta e frescor. Ausência não é convertida em dado inventado.

## Decisões transversais

- **Configuration Score — decisão do usuário, 2026-08-24; clarificação A, 2026-08-25:** cada domínio usa `configurações conformes / configurações elegíveis × 100`; o score pondera os nove domínios pela matriz do sponsor. Toda linha homologada, aplicável ao tenant e sem leitura comparável permanece `unavailable`, mas entra no denominador com contribuição `0`: ausência de evidência não vira valor de configuração, porém não recebe pontos. Domínio sem linha elegível ou sem coleta contribui `0` com seu peso original; cobertura ponderada (`linhas com leitura comparável / linhas elegíveis`) é exibida separadamente. As travas impedem a classificação “Excelente”, sem mudar a nota numérica.
- **Classificação do Configuration Score — decisão do usuário, 2026-08-25:** `0–59` = `Crítico`; `60–74` = `Atenção`; `75–89` = `Bom`; `90–100` = `Excelente`. Quando qualquer trava crítica estiver ativa, a nota numérica é preservada, mas a classificação `Excelente` é exibida como `Bom`.
- **Datas de configuração — decisão do usuário, 2026-08-25:** `sourceLastModifiedAt` existe somente quando a fonte declara a modificação; `lastObservedChangeAt` registra uma diferença entre snapshots detectada pelo Orkestria; `lastCollectedAt` registra a coleta. A apresentação distingue alteração informada pela fonte de alteração detectada pelo Orkestria.
- **Matriz canônica — decisão do usuário, 2026-08-25:** a matriz é versionada, incremental e expansível. Uma linha só é publicada quando sua fonte, valor atual, baseline, severidade/risco e regra de comparação forem homologados; não há inferência de cobertura, baseline, risco ou conformidade. A prioridade de fonte por configuração é Graph `v1.0`, TCM via Graph para recurso oficialmente suportado, API oficial especializada e, somente ante lacuna comprovada, PowerShell. TCM é fonte de estado e snapshots/drift, não autoridade automática de baseline ou risco.
- **Travas de score na versão somente leitura — decisão do usuário, 2026-08-25:** somente fatos Microsoft 365 homologados podem ativar as travas de administrador sem MFA, política crítica desabilitada, autenticação legada permitida, link anônimo global com edição, antiphishing desabilitado, acesso irrestrito por dispositivos não gerenciados e conector Exchange crítico sem TLS. Alteração crítica não aprovada e drift crítico não investigado não são travas desta versão; alterações e drifts continuam apenas observados. Toda trava ativa bloqueia apenas `Excelente`, sem mudar a nota numérica.
- **Política crítica desabilitada — decisão do usuário, 2026-08-25:** a trava só é ativada por fato ligado a uma linha da matriz canônica que declare explicitamente criticidade `critical`, baseline `enabled` e regra de comparação homologada. Homologação é validação de contrato técnico/produto da linha — fonte, permissão, valor, baseline, risco, comparação e indisponibilidade — e não aprovação operacional de usuário.
- **Autenticação legada — decisão do usuário, 2026-08-25:** a trava é derivada por `OR` de fatos versionados por workload. Para SharePoint/OneDrive, o baseline conforme é `isLegacyAuthProtocolsEnabled=false` em Graph `v1.0`; a trava fica ativa somente quando o valor atual é `true`. Entra e Exchange só ingressam com `settingKey` e fonte homologados. Restrição ou ausência reduz cobertura, nunca ativa a trava.
- **Link anônimo global com edição — decisão do usuário, 2026-08-25:** a trava exige prova conjunta de links anônimos permitidos e permissão padrão `Edit`. Enquanto não houver uma fonte homologada para ambos, fica `unavailable`, reduz cobertura e não bloqueia `Excelente`; “anônimo permitido” não é sinônimo de “anônimo com edição”.
- Conformidade é a comparação direta entre valor atual e baseline; divergência é a desigualdade entre ambos.
- Os valores e identidades presentes nas referências visuais são exemplos de apresentação, não dados de um tenant real.

## Estado

Discovery estruturado para futura formalização. Há fontes visuais e documentais lidas, decisões de score e regras de leitura rastreadas; faltam homologação do catálogo por conector, cobertura de auditoria e política de retenção dos dados observados.
