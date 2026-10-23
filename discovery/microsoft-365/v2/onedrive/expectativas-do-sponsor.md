# Expectativas do sponsor — Microsoft 365 / OneDrive

## Referências primárias

- `Microsoft365_Onedrive.docx` e `01`–`08` PNG no diretório informado.

## Capacidades e superfícies esperadas

### Dashboard Executivo

- **Resultado esperado:** identificar saúde, utilização, segurança, governança e prioridades do OneDrive sem percorrer dados brutos.
- **Blocos ou capacidades:** KPIs, score, distribuições, tendências, destaques, riscos e recomendações.

### Operação e conteúdo

- **Resultado esperado:** investigar contas, armazenamento, arquivos, compartilhamentos, atividade e sincronização por recortes operacionais.
- **Blocos ou capacidades:** filtros, gráficos, tabelas paginadas, painéis de detalhe e alertas contextuais.

### Governança

- **Resultado esperado:** acompanhar conteúdo de desligados, postura de segurança e eventos auditáveis.
- **Blocos ou capacidades:** processo, políticas, score, linha temporal, eventos e recomendações.

## Critérios transversais

- O módulo não confunde armazenamento pessoal com sites colaborativos do SharePoint.
- Resultados analíticos, tendências e risco dependem de dados estruturados publicados; sua ausência deve ficar explícita.
- Ações de compartilhamento são futuras e o MVP dessa superfície é leitura.

## Decisões complementares aceitas —2026-10-15

As escolhas C6–C9 foram propostas pelo agente e aceitas em A pelo usuário,
sem atribuí-las ao DOCX: arquivos distintos com atividade de compartilhamento;
alertas criados30dias de qualquer classificação/status; arquivos atuais pelo
fim nominal combinado de retenção15dias; atividades críticas somente
Alto/Crítico24h, com prioridade por risco/recência. Os contratos/mappings e
adendo conceitual do blueprint incorporam as escolhas e sua cobertura.

O §5 distingue adoção/atividade da pessoa da atividade no espaço proprietário
tratada no §1. A normalização de usuários inativos usa a fonte por usuário,
sem alterar o significado explícito ou perguntar novamente uma regra definida.

## Pendências

- **C3 aceita pelo usuário em2026-10-14:** na aba Atividade e Sincronização,
  o volume de Principais Benefícios passa a significar “Armazenamento utilizado
  no OneDrive”, reutilizando a publicação canônica de Reports. Substitui
  expressamente o rótulo de dados protegidos da imagem05; é uma proposta do
  agente aceita após investigação, sem atribuição retroativa ao DOCX ou prova
  de backup/KFM.

- **C4 aceita pelo usuário em2026-10-14:** no mesmo card, o percentual passa a
  significar “Clientes com atualização recente e sem erro reportado”, usando
  os classificados na fotografia de saúde C2. Substitui a taxa de sucesso da
  imagem05 por decisão expressa após investigação; não declara tentativas de
  transferência bem-sucedidas.

- **C5 aceita pelo usuário em2026-10-14:** Resumo de Riscos em Configurações e
  Segurança conta arquivos atuais únicos, cada um no maior risco comprovado,
  com contexto/unidade explícitos e baseline de snapshotD30. A unidade não
  estava definida no DOCX/imagem07; esta é a proposta do agente aceita pelo
  usuário. Informativo/desconhecido ficam na cobertura e não alteram as quatro
  linhas. A decisão não modifica os pesos dos scores ou a classificação R2.

- **Disposições posteriores aceitas pelo usuário em2026-10-14:** C1 define
  partição exclusiva de compartilhamentos por arquivo e precedência; C2 altera
  expressamente o pedido de estados instantâneos para saúde diária reportada,
  com clientes OneDrive e dispositivos Intune separados. “Pausado” permanece
  expectativa original do DOCX, substituída neste recorte por decisão do
  usuário após investigação, não por inferência do estado do tenant. Não
  atribuir essas novas semânticas ao documento original.

- Ações administrativas futuras permanecem apresentação estática/indisponível conforme os contratos; não integram a entrega de leitura backend.
- O frontend foi homologado com fixture sintética. As clarificações de backend de 2026-10-14 fecharam defaults e fontes; o adendo do blueprint registra os bindings/textos que a futura integração deve reconciliar, sem alterar a homologação histórica ou os exemplos do sponsor.
- A revisão integral das oito imagens e do DOCX originou cinco inferências não explícitas no texto, aceitas pelo usuário em 2026-10-14: retenção90/180/730 e carência local30dias; risco residual por objeto; dispositivos/erros na série mensal; referência500versões sem prazo adicional; arquivos atuais sob retenção e seu volume no mesmo universo, mantendo cinco métricas. São decisões do usuário a partir de propostas do agente, sem atribuição retroativa ao sponsor. Ver [triagem e decisões R1–R5](backend-defaults-e-clarificacoes.md#revisão-das-inferências--imagens-do-sponsor--2026-10-14).

Este documento registra expectativa e evidência de entrada; não atesta viabilidade técnica, backend readiness ou disponibilidade factual em runtime.
