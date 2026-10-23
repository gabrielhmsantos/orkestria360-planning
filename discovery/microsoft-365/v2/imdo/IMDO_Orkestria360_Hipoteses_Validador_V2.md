# IMDO Orkestria360 — Hipóteses para o Validador V2

## Objetivo

Transformar as lacunas de fórmula da planilha do sponsor em hipóteses executáveis. Este documento é a especificação do futuro script de teste: ele recebe fixtures locais, calcula notas e expõe o efeito de cada regra sem depender de APIs ou conectores ativos.

As hipóteses não são pendências do sponsor. Elas são baselines técnicas do Orkestria, sujeitas a ajuste posterior quando os resultados de fixtures ou do tenant real mostrarem comportamento inadequado.

## Primitivas reutilizáveis

| Código | Regra |
| --- | --- |
| `weighted` | Soma de `nota_da_evidência × peso_da_evidência`; pesos ausentes são normalizados somente dentro do indicador. |
| `binary` | Evidência presente/conforme = 100; ausente/não conforme = 0. |
| `ternary` | Implementado = 100; parcial = 60; inexistente = 0. Usa as faixas já recorrentes na planilha. |
| `ratio` | Percentual real convertido pela faixa do sponsor; quando não houver faixa, usa nota igual ao percentual, limitada a 0–100. |
| `inverse_ratio` | `100 - percentual`, limitado a 0–100; aplicado a sobra, risco, ociosidade e divergência quando não houver faixa. |
| `age` | Faixas de atualização/validade publicadas pelo sponsor; sem faixa, usa a convenção de frescor do modelo. |
| `count_penalty` | Zero ocorrências = 100; aplica as faixas do sponsor ou, sem faixa, reduz 20 pontos por ocorrência até zero. |

## Hipóteses por domínio

### Segurança

| Indicador | Hipótese executável para fixture |
| --- | --- |
| MFA | `weighted(50% cobertura MFA geral, 30% MFA admins, 10% métodos fortes, 10% inverse_ratio usuários sem MFA há 30 dias)`. Cobertura geral e admins usam o percentual limitado a 100; métodos fortes conta Authenticator/FIDO2=100, SMS=50 e só senha=0. |
| Conditional Access | `weighted(20% políticas existentes, 20% habilitadas, 30% proporção de políticas recomendadas, 15% inverse_ratio exclusões excessivas, 15% cobertura)`. Quantidade e cobertura usam as faixas existentes; “recomendada” é uma fixture booleana por política. |
| Defender | `weighted(30% Exposure Score, 20% recomendações aplicadas/total, 20% incidentes, 15% alertas, 15% devices protegidos/ativos)`. Exposure e alertas usam as faixas da planilha; incidentes usa a mesma faixa de alertas. |
| Intune Compliance | `weighted(40% compliant, 20% BitLocker, 10% Defender ativo, 20% Windows atualizado, 10% inverse_ratio órfãos)`. Percentuais usam as faixas de compliance; órfãos: 0=100, até 5%=90, >5% e até 10%=70, >10%=50. |
| Identity Protection | `weighted(30% inverse_ratio risky users, 30% inverse_ratio risky sign-ins, 20% policy de risco, 20% remediação automática)`. Riscos usam as faixas publicadas; policy/remediação são binárias. |
| Administradores | `weighted(30% faixa de Global Admins, 30% MFA admins, 20% PIM, 20% contas nominativas)`. A fixture informa porte e intervalo recomendado; fora do intervalo, nota proporcional à distância. |
| Legacy Authentication | `weighted(40% protocolos bloqueados, 40% inverse_ratio sign-ins legacy, 20% CA bloqueando legacy)`. Protocolos e sign-ins usam as faixas da planilha. |
| Break Glass | `weighted(25% conta existente, 15% Global Admin, 20% exclusão correta de CA, 15% senha/procedimento, 10% tratamento MFA emergencial, 15% alertas)`. MFA não é penalidade quando a fixture marca o procedimento de emergência como válido. |
| Assessment Segurança | A fixture fornece `assessmentSecurityScore`; a regra é identidade: nota = score informado. |

### Governança

| Indicador | Hipótese executável para fixture |
| --- | --- |
| Inventários de ativos e licenças | `weighted` das evidências já ponderadas na planilha; cobertura = inventário/Graph × 100; divergência = `inverse_ratio(abs(inventário - Graph)/Graph)`. |
| Documentação, políticas e procedimentos | Cada item de conteúdo usa os pesos da planilha; cada etapa documental usa `binary` (criado, completo, revisado, aprovado, vigente). |
| Processos e KPIs | Cada item usa `ternary`; a nota do indicador é `weighted` pelos pesos já indicados. |
| Assessments de Governança | A fixture fornece `assessmentGovernanceScore`; nota = score informado. |

### Licenciamento e Custos

| Indicador | Hipótese executável para fixture |
| --- | --- |
| Utilização das licenças | Usa as faixas do sponsor até 98%; acima disso: 99%=90, 100%=80, >100%=0 para sinalizar excedente de capacidade. |
| Licenças ociosas | `weighted` dos percentuais sem login, sem atividade, bloqueadas e desligadas; cada percentual usa a faixa de ociosidade publicada. |
| Aproveitamento Premium | Cada capacidade recebe `ratio` de uso entre os usuários com a SKU elegível; nota final é `weighted` pelos pesos do sponsor. |
| Licenciamento correto | A fixture já classifica usuário como subdimensionado, adequado ou superdimensionado; nota = proporção de adequados, ajustada pelos grupos automáticos. |
| Economia potencial | Cálculo sobre `economia_potencial / custo_mensal`, usando as faixas do sponsor. SKUs e quantidades vêm da Graph; preço/valor unitário vem da tabela de preços própria do Orkestria. |
| Renovação | A fórmula pode ser exercitada por fixture, mas fica `not_applicable` em produção até que exista fonte para vigência, avisos, simulação e renovação automática. |
| Compliance de licenciamento | `weighted` de usuários sem licença, expiradas, automático, inventário e auditoria; riscos usam `inverse_ratio`, controles usam `binary`. |

### Compliance

| Indicador | Hipótese executável para fixture |
| --- | --- |
| Compliance Score | Usa `score_atual / score_máximo` e as faixas do sponsor; controles, ações e tendência compõem o peso de evidência publicado. |
| LGPD e ISO 27001 | Medem maturidade operacional, não certificação ou conformidade legal. Evidências usam `ternary` e os pesos da planilha. |
| DLP, retenção, labels e Purview | Evidências de implantação usam `ternary`; criação/publicação e features habilitadas usam `binary`; nota final é `weighted`. |
| Assessment Compliance | A fixture fornece `assessmentComplianceScore`; nota = score informado. |

### Disponibilidade

| Indicador | Hipótese executável para fixture |
| --- | --- |
| Service Health | `weighted(40% serviços saudáveis/monitorados, 30% incidentes críticos, 15% avisos recorrentes, 15% disponibilidade 30d)`. Incidentes e disponibilidade usam faixas do sponsor. |
| Incidentes | `weighted(40% críticos, 30% MTTR, 20% recorrentes, 10% causa raiz)`. Nesta fase, MTTR e causa raiz são `not_applicable` por dependerem de ITSM; críticos e recorrência são normalizados sobre 60% e a cobertura interna é 60%. |
| Backup e DR | **Backup** é `not_applicable` nesta fase, pois não haverá integração com provider externo. **DR** continua calculável por evidências internas: itens documentais usam `binary`; teste DR usa faixas temporais; RTO/RPO usam `binary`. |
| Exchange e Teams | `weighted` dos pesos de evidência publicados; disponibilidade e incidentes usam faixas; configurações recomendadas são flags binárias. |
| SharePoint e OneDrive | `weighted` de disponibilidade, atividade/sincronização, storage, compartilhamento e configuração. Storage e compartilhamento usam `inverse_ratio`; configurações são flags binárias. |

### Produtividade

| Indicador | Hipótese executável para fixture |
| --- | --- |
| Teams, SharePoint e OneDrive | `weighted` das evidências da planilha. Adoção usa faixas >=95% a <70%; crescimento compara D30 com média D90: >=10%=100, 0–<10%=80, -1 a -10%=60, <-10%=40. |
| Planner | `weighted(25% planos ativos, 25% tarefas concluídas/criadas, 20% usuários ativos, 15% atualização, 15% colaboração)`; cada taxa usa `ratio`. |
| Power BI | `weighted` igual entre workspaces ativos, relatórios publicados, usuários ativos, refresh automático e compartilhamento; cada evidência usa `ratio`. |
| Power Automate | `weighted(25% fluxos ativos, 20% executados, 20% sucesso, 20% usuários, 15% fluxos críticos saudáveis)`; cada taxa usa `ratio`. |
| Copilot | `weighted(30% ativos/licenciados, 20% frequência, 20% aplicações usadas, 15% crescimento, 15% licenças usadas)`; cada taxa usa `ratio`. |
| Assessment Produtividade | A fixture fornece `assessmentProductivityScore`; nota = score informado. |

## Contrato mínimo de fixture

Cada fixture deve conter `domain`, `indicator`, `evidence`, `weight`, `sourceType`, `collectedAt`, `applicable` e o valor bruto da evidência. O script deve devolver nota da evidência, nota do indicador, contribuição do domínio, cobertura, confiabilidade e uma lista de regras aplicadas.

## Casos mínimos do futuro script

1. Caso de excelência: todas as evidências atendem a regra e o indicador retorna 100.
2. Caso limítrofe: cada faixa do sponsor é validada nos dois extremos.
3. Caso degradado: evidência de risco/ausência produz redução previsível.
4. Caso não aplicável: remove peso do denominador sem zerar a nota.
5. Caso sem integração deliberadamente fora de escopo: fixture local marca o indicador/evidência como `not_applicable`, remove seu peso do denominador, preserva o peso original no relatório e reduz a cobertura.
6. Caso de licença/workload ausente: fixture confirma que o produto é exigido pela matriz, retorna nota zero, mantém o peso no denominador e registra a oportunidade de evolução/contratação.
7. Caso legal: LGPD e ISO exibem “maturidade operacional”, sem alegar certificação ou conformidade jurídica.
