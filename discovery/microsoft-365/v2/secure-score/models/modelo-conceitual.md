# Modelo conceitual — Secure Score

## Entidades propostas

| Entidade | Finalidade | Procedência | Estado |
| --- | --- | --- | --- |
| Fotografia e Snapshot de Score | score atual, máximos, categorias, serviços e comparativos por data | Graph `secureScores`; snapshot Orkestria | `viável`: `200`, 90 fotografias observadas. |
| Controle atual e Perfil de controle | pontuação de cada controle e seus metadados/remediação | Graph; associação validada | `viável`: 449 perfis em 5 páginas; 71/71 controles atuais associados. |
| Ação de remediação | prioridade, responsável, prazo, progresso, dependências e validação | Orkestria | `coming_soon`. |
| Evidência | referência/URL, submissão e validação ligada à ação | Orkestria | `coming_soon`. |
| Exceção | justificativa, risco, compensação, aprovação, validade e revisão | Orkestria | `coming_soon`. |
| Meta | objetivo geral/categoria, linha de base, data e situação | Orkestria | `coming_soon`. |
| Alteração observada | diferença publicada entre snapshots de score/controle, sem causa atribuída | snapshots `secureScores` + versão de perfil | `available` quando a fonte é autorizada; requer duas gerações para cobertura comparável. |
| Evento de auditoria operacional | antes/depois, origem, entidade, resultado e correlação de ações internas | Orkestria | `coming_soon`. |
| Controle de coleta | execução, watermark/paginação, retry, resposta e erro | Orkestria | `available` já na primeira publicação; `restricted` por autorização/tenant; falha preserva a última geração. |

## Regras e limites

- Percentual = `currentScore / maxScore × 100`; pontos disponíveis = `maxScore − currentScore`. Por categoria, somar os controles da categoria antes de calcular o percentual. Só derivar resultado quando os operandos necessários estiverem disponíveis.
- Score projetado = `(currentScore + soma dos ganhos potenciais selecionados) / maxScore × 100`.
- Ganho potencial por controle = `maxScore do perfil − score atual`; ação parcial = `0 < score atual < score máximo`. O conjunto remediável de ganho/prioridade e seus status de inclusão/exclusão estão definidos em `acoes-de-melhoria/decisoes.md`.
- Ação de remediação deve reter prazo, marca de dependência regulatória e o score composto de prioridade calculado, para reproduzir a decisão aprovada em `acoes-de-melhoria/decisoes.md`.
- O ganho simulado não altera a fotografia oficial; permanece uma estimativa até a atualização Microsoft.
- A chave usa `controlScores.controlName → secureScoreControlProfiles.id` exata, com normalização apenas como fallback controlado; colisões ou ausências reduzem cobertura. Retenção, dados pessoais mínimos, integridade de auditoria, versionamento de perfis e estados operacionais precisam de decisão na Spec.
- Estados de disponibilidade não são propriedades fixas do tenant de desenvolvimento: são publicados por fonte e execução com `availability`, `coverage`, `freshness`, `reason` e `result_state`. Uma coleção OData vazia válida mantém a fonte disponível e informa cobertura zero; autorização ausente ou produto indisponível a torna `restricted` somente naquela execução/tenant.
