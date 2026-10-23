# Configurações e Segurança — Design sugerido

- **C8 aceita A:** a quinta linha de Retenção e Governança usa “Arquivos com
  fim nominal de retenção (15 dias)” e o novo binding
  `retentionGovernance.filesWithNominalRetentionEnd15d`. Unidade: arquivos
  atuais únicos, uma vez por arquivo e pelo fim combinado finito de retenção,
  considerando todas as regras aplicáveis resolvidas. Janela inclusiva entre
  a data UTC de referência e mais 15 dias, sem recalcular pelo browser. Um
  arquivo com regras terminando em 10 e 400 dias não aparece nessa contagem.
  Exibir referência/cobertura próprias; subtotal parcial informa o recorte e
  fim não determinável usa estado neutro, sem zero inventado. Não anunciar
  liberação, exclusão ou recuperação de espaço. Preservar cinco linhas no
  card e os demais quatro fatos R5 independentes. `expiringWithin15Days` e seu
  número sintético permanecem históricos, sem conversão silenciosa.

- **C7 aceita A:** Defender mostra “Alertas de segurança criados (30 dias)”,
  com contexto de alertas observados e referência/cobertura próprias. Usar
  `defenderIntegration.reportedAlerts30d`; a unidade é alerta e várias
  ocorrências sobre o mesmo arquivo podem contar separadamente. Não exibir
  essa medida como ameaça confirmada ou atividade necessariamente recente.
  Os três controles, quarentena e scores mantêm suas semânticas independentes.
  Preservar o campo/valor histórico da fixture, com novo binding na integração.

- **C5 aceita A:** Resumo de Riscos mostra o contexto “Arquivos atuais por nível
  de risco”, quatro linhas Crítico/Alto/Médio/Baixo e diferença em arquivos para
  o snapshot comparável de30dias antes. Informativo/desconhecido aparecem na
  cobertura, sem novas linhas ou zeros inventados. Referência e unidade vêm de
  `riskSummaryMetadata`; comparação sem baseline íntegro não aparece. O card
  continua somente leitura e não responde aos filtros de outras abas.

- **R5 aceita (2026-10-14; quinta linha definida por C8 em 2026-10-15):** manter cinco métricas em Retenção e Governança: políticas ativas, “Arquivos atuais sob retenção”, “Volume atual sob retenção”, usuários com retenção e “Arquivos com fim nominal de retenção (15 dias)”. Quantidade e volume usam os mesmos arquivos atuais com retenção efetiva comprovada; volume não significa espaço físico de cópias preservadas. A quinta linha tem unidade/cálculo C8 e disponibilidade independentes. Mostrar recorte/cobertura de subtotal parcial e estado neutro quando desconhecido; zero exige avaliação completa. A integração futura adapta rótulos/bindings, sem reinterpretar a fixture homologada.

- **R4 aceita (2026-10-14):** apresentar referência500versões sem requisito365dias. Modo automático é texto factual com avaliação neutra contra o baseline numérico, sem mostrar500 como valor aplicado. Divergência de quantidade é do baseline e não afirma falha de segurança; detector de conteúdo>50versões é independente.

- **Clarificação 4 (2026-10-14; retenção refinada na R5):** manter baseline recomendado separado do valor atual e declarar origem local/serviço quando necessária à interpretação. “Limite de download” identifica detector local; segundo estágio usa restante dos mesmos 93 dias. Quarentena significa catálogo atual de documentos OneDrive; a R5 substitui as duas linhas de artefatos/ocupaçãoPHL por arquivos atuais comprovadamente sob retenção e seu volume. Valores desconhecidos usam estado neutro; as novas semânticas constam no adendo conceitual do blueprint para a próxima entrega.

- Score, pontuação por categoria, resumo de risco e recomendações abrem a superfície em uma faixa de leitura prioritária. O score usa todos os pesos fixos; categoria sem coleta contribui zero e mantém a respectiva indisponibilidade explícita.
- Blocos de políticas organizam compartilhamento/links, sincronização/acesso, autenticação/acesso e capacidade/limites; proteção, rótulos, ameaças e retenção formam a segunda faixa.
- Um único card de Conformidade Global reapresenta as categorias publicadas
  de `securityScore.categories`, distinto de `complianceDomains`. Categorias,
  políticas, riscos e recomendações são apresentação somente leitura, sem
  seleção, navegação ou ação corretiva nesta aba. Não adicionar CTA implícito.
- **Estados aplicáveis:** `available`, `partial` por categoria, `stale`, `restricted`, `unavailable` e `failed`. Categoria sem coleta contribui zero ao seu peso e permanece explicitamente indisponível; não há classificação de qualidade substituta.
