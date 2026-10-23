# Discovery — Microsoft 365 / Secure Score

## Objetivo

Transformar o Microsoft Secure Score oficial em uma leitura operacional da postura de segurança: pontuação, controles, prioridades, plano, metas, tendências, exceções e auditoria, sem afirmar que uma mudança foi aplicada no tenant.

## Escopo e superfícies

1. Dashboard Executivo — consolida score, oportunidades, riscos e situação do plano.
2. Pontuação por Categoria — compara a postura por categoria de controle.
3. Ações de Melhoria — prioriza e filtra recomendações Microsoft.
4. Plano de Remediação — acompanha a execução interna das ações.
5. Comparativos e Metas — contextualiza o tenant e acompanha metas próprias.
6. Evolução e Tendências — explica histórico, eventos e regressões.
7. Controles Aceitos e Exceções — administra justificativas e respectivas revisões.
8. Histórico e Auditoria — apresenta alterações observadas de score/controles e coletas; a auditoria de ações internas é evolução futura.

## Limites da versão

- A integração confirmada é somente leitura por `SecurityEvents.Read.All`; escrever estados na Microsoft, aprovar ou encerrar exceções e editar metas são `coming_soon`.
- Pontuação, perfis, médias comparativas, categorias e janela de histórico só aparecem quando a coleta e a cobertura forem publicadas. Ausência não representa zero.
- Estados de fontes são avaliados a cada publicação e por tenant: uma fonte é `available` quando a execução autorizada publica uma geração íntegra (inclusive coleção vazia válida, com cobertura explícita); é `restricted` apenas enquanto autorização, licença, produto ou granularidade impedirem a coleta. Nenhuma restrição observada em um tenant é hardcoded para os demais.
- As pessoas, datas e números das imagens são ilustrações e não serão reproduzidos como dados do tenant.
- O Secure Score do Microsoft 365 não é somado ao Secure Score de Azure/Defender for Cloud nem ao Health Score proprietário do Orkestria.

## Princípios e dependências

- `secureScores` fornece fotografia e histórico; `secureScoreControlProfiles` descreve controles. A associação factual é `controlScores.controlName → secureScoreControlProfiles.id`, exata e com normalização apenas como fallback controlado.
- Cálculos confirmados pelo DOCX: percentual do Secure Score = `currentScore / maxScore × 100`; pontos disponíveis = `maxScore − currentScore`; pontuação atual/máxima por categoria = soma dos controles da categoria; percentual da categoria = `pontos atuais da categoria / pontos máximos da categoria × 100`; pontos ainda disponíveis por ação = `maxScore do perfil − score atual do controle`; ganho potencial = soma dos pontos ainda disponíveis nas ações abertas; score projetado = `(currentScore + soma dos ganhos potenciais selecionados) / maxScore × 100`.
- Derivações diretas: distância até a meta = `meta percentual − percentual atual`; ação parcial tem `0 < score atual < score máximo`. A definição operacional de “ação aberta” continua pendente, pois depende do catálogo de status interno.
- A projeção não altera o score oficial: é estimativa até validação e processamento Microsoft. Classificações, metas, priorização, planos, exceções, evidências e auditoria operacional continuam regras/dados próprios a aprovar na futura Spec. O Histórico Observado V2 é somente leitura: diffs de snapshots e telemetria de coleta, sem autoria ou causalidade inferida.
- O histórico Graph é aproximado a 90 dias; período superior exige snapshots próprios. Paginação e `Retry-After` devem ser respeitados pela integração futura.
- Integrações correlatas explicam as entidades afetadas: MFA já é projeção local de `userRegistrationDetails`; SharePoint/OneDrive já validou inventário paginado de sites, permissões de site e configurações globais; Exchange já validou regras de Inbox. Intune (`managedDevices`) e Defender for Endpoint (máquinas) retornaram `401`/`403` neste tenant, logo estão `restricted` somente nas publicações afetadas; um tenant/app-only autorizado os torna `available` sem mudança de código. A enumeração/permissões SharePoint e regras Exchange não bastam, isoladamente, para afirmar compartilhamento amplo de conteúdo ou todos os tipos de encaminhamento externo. A integração SharePoint é explicitamente somente leitura, aceitando apenas `GET`.

## Decisões transversais

- As oito abas, títulos e ordem vêm do DOCX e das imagens do sponsor.
- Todo cartão mostra condição de fonte, cobertura e frescor quando a métrica depender de Graph ou de dados internos.
- `restricted` não é configuração estática de interface: deriva de `availability` publicada por fonte e execução. `result_state` é diagnóstico complementar da resposta (`success`, falha ou coleção vazia válida). Ao trocar app-only ou tenant, uma execução autorizada e íntegra promove automaticamente o bloco para `available`; falhas preservam a última geração e expõem motivo/frescor/cobertura.
- Simulações deixam explícito que são estimativas até a validação e o processamento da Microsoft.
- A prioridade das ações usa score composto 0–100 e o conjunto remediável definido pelo usuário; consulte [Ações de Melhoria / decisões](acoes-de-melhoria/decisoes.md). A convenção de que maior `rank` recebe maior nota é decisão do usuário, não semântica confirmada pela Microsoft.
- A classificação do Secure Score usa as cinco faixas propostas no DOCX; consulte [Dashboard Executivo / decisões](dashboard-executivo/decisoes.md). Ela não se aplica a percentual indisponível ou fora de `0–100`.

## Models

Há necessidade de persistência para snapshots, projeções, ações internas, evidências, exceções, metas, coleta e auditoria. Consulte [models/modelo-conceitual.md](models/modelo-conceitual.md).

## Estado

`secureScores` e `secureScoreControlProfiles` foram validados no tenant de desenvolvimento (`200`). A fotografia devolveu a janela observada de 90 dias; o catálogo percorreu 5 páginas e 449 perfis, com associação de todos os 71 `controlScores.controlName` da fotografia atual a IDs de perfil após normalização. A Spec deve formalizar o sync coordenado, consentimento e permissões das fontes correlatas restritas, regras configuráveis de classificação/prioridade/regressão, retenção e privacidade, e os workflows internos hoje `coming_soon`.
