# Atividade e Sincronização — Decisões

<a id="b3-periodos-do-relatorio-de-atividade"></a>
<a id="fechamento-tecnico-b3-periodos-do-relatorio-de-atividade"></a>

## Fechamento técnico B3 — períodos do relatório de atividade

O filtro `activityPeriod` já aprovado exige D7/D30/D90/D180. Reutilizar a mesma
operação Graph `getOneDriveActivityUserDetail(period='{period}')` e sua fonte
canônica para os quatro recortes, com publicações/CSV próprios por período e
data de referência; não escalar D30. A ampliação sintética usa uma operação
SUPPORTED, preserva `Accept: text/csv`, as11colunas e o período correspondente.
Geração, inventory87/53, validate, importação5serviços e smoke dos quatro
períodos/erroD365 passaram. B3 fecha cobertura técnica, sem nova decisão de
produto, nova API ou observação real de D7/D90/D180. Ver
[API](api.md#b3-periodos-do-relatorio-de-atividade) e
[mapping](fontes-e-viabilidade.md#b3-periodos-do-relatorio-de-atividade).
*(Investigação técnica, 2026-10-14; evidência externa limitada a D30 preservada.)*

## Decisões de produto e contrato

- **Clarificação C6 — Q:** qual significado deve ter o KPI Arquivos
  Compartilhados no período? **A:** A — arquivos distintos com atividade
  registrada, inclusive criação de link sem uso, sob o rótulo “Arquivos com
  atividade de compartilhamento”. Compartilhamento direto, criação de links,
  inclusão de destinatário em link específico e convite comprovadamente
  dirigido ao arquivo qualificam; uso, aceite isolado, remoção/atualização e
  mudança genérica de permissão não iniciam presença. Deduplicar entre
  públicos/atores/dias, no recorte de atores humanos internos A2 e janela
  `[T-Ndias,T)`. Falha/parcial explícitos ficam fora; resultado desconhecido
  pode contar como atividade sem afirmar sucesso e tem quantidade própria de
  arquivos observados. Exigir arquivo/tipo/ator inequívocos, sem depender de
  o arquivo continuar ativo ou compartilhado hoje. Conjuntos diários400dias,
  eventos/JSON90dias e comparação somente D30 com baseline anterior íntegro
  preservam as decisões existentes. Os bindings são `activitySummary.sharedItems`,
  `activitySummary.sharedItemsMetadata` e a comparação D30 opcional já prevista.
  Identidades/lacunas não resolvidas mantêm total global desconhecido e zero
  exige cobertura íntegra. É proposta do agente aceita expressamente, sem
  atribuição retroativa ao sponsor. *(origem: usuário; data: 2026-10-15;
  [pacote C6 aceito](../backend-defaults-e-clarificacoes.md#c6--significado-de-arquivos-compartilhados-aceita-a);
  [mapping B4](fontes-e-viabilidade.md#b4--arquivos-com-atividade-de-compartilhamento-c6-aceita-a).)*

- **Clarificação C4 — Q:** qual percentual mostrar em Principais Benefícios? **A:** A — Clientes com atualização recente e sem erro reportado: `100 × clientes em upToDateReported / clientes classificados nos três estados C2` da última fotografia Health íntegra. Uma identidade de cliente conta uma vez; resultado publicado a uma casa decimal, half-up, com referência/cobertura próprias e independente do filtro de atividade. Denominador zero fica nulo; desconhecidos são declarados sem afirmar cobertura de todos os endpoints. Substitui expressamente a taxa de sucesso de tentativas da imagem05, sem reinterpretar o93% da fixture. O binding é `benefitMetrics.recentHealthyClientsPercent`; os pesos, KFM e R3 permanecem aprovados. *(origem: usuário; 2026-10-14; [pacote C4 aceito](../backend-defaults-e-clarificacoes.md#c4--percentual-do-card-principais-benefícios-aceita-a))*

- **Clarificação C3 — Q:** qual volume mostrar em Principais Benefícios? **A:** A — Armazenamento utilizado no OneDrive, conforme Reports. Reutilizar o agregado canônico de Contas e Armazenamento, com o mesmo universo, referência, cobertura e disponibilidade, independente dos filtros de atividade. Valor em bytes inteiros não negativos; zero exige comprovação e ausência mantém valor desconhecido/última publicação válida com frescor. Substitui expressamente “Dados protegidos na nuvem”; não afirma backup/KFM ou sucesso de sincronização. A fixture histórica não é reinterpretada. *(origem: usuário; 2026-10-14; [pacote C3 aceito](../backend-defaults-e-clarificacoes.md#c3--volume-do-card-principais-benefícios-aceita-a))*

- **Clarificação C2 — Q:** como tratar estados instantâneos e a correlação de dispositivos? **A:** A — saúde diária reportada, com Erro reportado, Atualizado reportado nos últimos30dias e Sem atualização reportada nesse prazo; desconhecidos mantêm cobertura. Clientes OneDrive e dispositivos Intune são populações separadas, sem join presumido. R3 e pesos preservados; score de dispositivos explicita população Intune. Substitui expressamente o recorte de estado instantâneo do DOCX, sem afirmar que ele foi viabilizado. *(origem: usuário; 2026-10-14; [pacote C2 aceito](../backend-defaults-e-clarificacoes.md#c2--estados-instantâneos-e-correlação-de-dispositivos-aceita-a))*

- **Fechamento técnico A2 (2026-10-14):** acessados/editados usam conjuntos distintos da auditoria canônica, sem dividir a coluna combinada de Reports. Deduplicação global por arquivo e, por departamento, por arquivo no grupo dos atores; grupos podem se sobrepor. Snapshots diários de presença mantêm os 400 dias já aprovados e permitem deduplicar D180; eventos/JSON continuam com 90 dias. Janela, chaves/atores ausentes e gaps têm cobertura explícita. Ver [mapping A2](fontes-e-viabilidade.md#a2--itens-acessados-e-editados-separados). Estados/correlação A3 têm disposição própria na C2 aceita acima.

- **Revisão por imagens — R3:** Q: quais unidades usar na evolução de sincronização? → A: Dispositivos sincronizados + quantidade de erros reportados. Série azul = clientes OneDrive distintos na última fotografia Health íntegra de cada mês com estado atualizado reportado nos30dias até sua referência; série vermelha mantém soma de erros da última fotografia Errors íntegra. As séries têm referência/cobertura próprias,12posições e nulos em meses não coletados. Não representam ocorrências exclusivas do mês ou inventário físico completo; não são somadas como total anual. Reports de arquivos sincronizados continuam indicador separado. *(Usuário; 2026-10-14; [R3 aceita](../backend-defaults-e-clarificacoes.md#r3--unidade-da-evolução-de-sincronização-aceita-a).)*

- **Clarificação — Q:** como representar os erros na série mensal? **A:** A — última fotografia íntegra do mês; erros reportados nos 30 dias até a data do snapshot. Somar uma vez os pares dispositivo/tipo do run, sem somar fotografias sobrepostas nem pontos mensais como ocorrências anuais. Mês sem coleta fica sem valor; zero exige fotografia completa. *(origem: usuário; data: 2026-10-14; [pacote integral](../backend-defaults-e-clarificacoes.md#clarificação-3--série-de-sincronização-aceita-a))*
- **Clarificação confirmada (2026-10-14):** Errors usa perfil imutável de versão/colunas/tipos do Schema oficial, validado no onboarding e na primeira extração completa. O catálogo recomenda `Errors_v1`, mas liga ao schema intitulado v0; não presumir equivalência. Sem perfil/run compatível não publicar erros e preservar a última publicação válida. Esta decisão substitui a seleção estática de `Errors_v0` de 2026-09-14, mantendo Data Connect como fonte e todos os campos de detalhe exigidos.

- **Confirmada:** indicadores incluem pessoas/contas ativas, arquivos acessados/editados/compartilhados, sincronizações, falhas, dispositivos e KFM.
- **Confirmada:** a superfície combina atividade, inventário de dispositivo, conformidade, risco e KFM quando esses fatos forem publicados.
- **Confirmada:** sincronização em dispositivo não gerenciado ou em risco pode elevar a prioridade de investigação, mas não aciona bloqueio automático.
- **Confirmada:** a imagem 05 mostra filtro de período com padrão “Últimos 30 dias”. Atividade de usuários, KPIs e análise por departamento seguem esse recorte; a evolução de sincronização é uma série mensal fixa dos últimos 12 meses.
- **Confirmada:** inventário, situação de gerenciamento, conformidade, plataforma, última sincronização com Intune e sinal de risco do dispositivo usam `managedDevices` quando a conexão tiver Intune habilitado. Isso descreve o dispositivo gerenciado, não uma sessão do cliente OneDrive.
- **Confirmada (2026-09-14; perfil de Errors atualizado em 2026-10-14):** falha detalhada de sincronização do OneDrive, versão do cliente, KFM e timestamps próprios do cliente usam a exportação suportada do Microsoft Graph Data Connect for SharePoint, não uma rota REST do Graph. Saúde usa `BasicDataSet_v0.OneDriveSyncHealth_v1`; erros usam o dataset/perfil admitido pela regra acima. A chave de correlação do cliente é validada nesse perfil, sem inferir identidade somente pelo nome do dispositivo.
- **Confirmada (2026-09-14):** `https://clients.config.office.net/odbhealth/...` é endpoint interno observado no Apps Admin Center e foi rejeitado como integração: não possui contrato público estável, o fluxo antigo dependia de token de sessão do portal e seu autor registra alteração incompatível de resposta. A interface nunca o chama.
- **Confirmada (2026-09-14):** Graph Data Connect é pipeline de exportação para armazenamento Azure, não endpoint HTTP de consulta. O simulador atual não representa esse tipo de pipeline; a cobertura de payload fica no contrato semântico/fixture de frontend, sem inventar uma rota do provider.

- **Correção técnica GA4 (2026-10-15):** usuários sem atividade representam
  atividade da pessoa licenciada, inclusive em espaço alheio. Reusar o detalhe
  de atividade D180 e identidade/licença canônicas; não usar a última atividade
  do espaço de propriedade. Corte estrito>90dias, referência factual e datas
  UTC; linha/data/licença/identidade desconhecida mantém cobertura desconhecida.
  A regra de Contas por espaço e o filtro de atividade permanecem independentes.
  É fechamento do significado explícito no DOCX §5, sem nova decisão de produto.
