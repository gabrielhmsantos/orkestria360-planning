# Atividade e Sincronização — Design sugerido

- **C6 aceita A pelo usuário em2026-10-15:** o KPI usa “Arquivos com atividade
  de compartilhamento”, em `activitySummary.sharedItems`, com período e
  contexto de arquivos distintos/atividade registrada. Criação de link sem
  uso pode contar; não apresentar como acesso concedido, sucesso ou estoque
  atual. `activitySummary.sharedItemsMetadata` fornece unidade, janela,
  referência, revisão, cobertura, disponibilidade e `unknownResultFileCount`
  de arquivos observados, sem confundir com eventos ou arquivos não resolvidos.
  Subtotal positivo parcial é identificado como observado; total desconhecido
  ou ausência de publicação não vira zero. A comparação D30 só aparece com
  baseline factual íntegro; os demais períodos não recebem comparação nova.
  A integração materializa esse significado e seus estados; a fixture mantém
  papel histórico. O blueprint responsável recebe esse contrato para
  reconciliação conceitual, preservando a composição aprovada.

- **C3 aceita A:** o volume em Principais Benefícios usa o rótulo
  “Armazenamento utilizado no OneDrive”, com valor global, referência/cobertura
  próprias e independente dos filtros de atividade. A integração usa
  `benefitMetrics.storageUsedBytes`; preserva a composição do card e o histórico
  da fixture. A medida descreve ocupação de armazenamento, sem afirmar backup.

- **C4 aceita A:** o percentual em Principais Benefícios mostra “Clientes com
  atualização recente e sem erro reportado”, uma casa decimal e contexto da
  fotografia/denominador classificado C2. Usa
  `benefitMetrics.recentHealthyClientsPercent.value`; denominador zero fica
  não avaliável e desconhecidos têm cobertura explícita. A medida de clientes
  com pastas protegidas reutiliza KFM com sua própria referência. Os três
  benefícios têm disponibilidade independente e conservam sua ordem; a
  integração substitui o binding histórico da taxa de sucesso de tentativas.

- **C2 aceita A:** apresentar saúde diária reportada nos três grupos aprovados, com data/coverage e Não avaliado explícito. Substitui a distribuição instantânea; não usar Pausado, Sincronizando ou Não configurado como nomes para timestamps. Listas de clientes OneDrive e dispositivos Intune têm contexto/unidades próprios; filtros de uma população não simulam correlação com a outra. Conservar série R3 e investigação de erros/KFM/versão. KFM aplicado descreve ao menos uma pasta conhecida protegida; score das três pastas permanece separado. A integração futura materializa esses bindings, sem reescrever a fixture histórica.

- KPIs do período vêm antes de filtros por período, departamento, pessoa, situação de sincronização e tipo de dispositivo.
- Três painéis analíticos apresentam evolução por pessoa, departamento e sincronização; tabelas de dispositivos e pessoas sem atividade concentram investigação.
- KFM, benefícios e alertas finalizam a leitura como resumos auxiliares.
- **Clarificação 3 aceita (2026-10-14):** a série mensal informa “Erros reportados nos 30 dias até a data do snapshot”, com data de referência; mantém 12 posições e meses ainda não coletados sem valor. Não apresenta o rolling30d como ocorrências exclusivas do mês.
- **R3 aceita (2026-10-14):** série azul Dispositivos sincronizados = clientes observados com estado atualizado reportado nos30dias até a fotografia. Série vermelha mantém quantidade de erros reportados. Unidades/eixos/referências são distintos; o KPI de arquivos não substitui contagem de clientes. Bindings históricos serão reconciliados na futura integração, sem trocar significado silenciosamente.
- **Estados aplicáveis:** `available`, `partial` quando a telemetria de sincronização não cobrir todos os dispositivos, `stale`, `restricted`, `unavailable` e `failed` por painel.
