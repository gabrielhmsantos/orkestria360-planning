# Discovery — Microsoft 365 / OneDrive

## Objetivo

Permitir que administradores compreendam saúde, uso, risco, compartilhamento e governança dos espaços pessoais corporativos do OneDrive, mantendo-o separado do módulo SharePoint, que trata sites e colaboração departamental.

## Escopo e superfícies

1. Dashboard Executivo — leitura consolidada de saúde, utilização, segurança e prioridades.
2. Contas e Armazenamento — inventário operacional, capacidade e investigação contextual por conta.
3. Arquivos e Conteúdo — perfil do conteúdo, capacidade e riscos de governança.
4. Compartilhamento e Acessos — visibilidade de permissões, links e exposição externa.
5. Atividade e Sincronização — adoção, sinais de atividade e saúde da sincronização.
6. Usuários Desligados e Retenção — acompanhamento do ciclo de conteúdo de pessoas desligadas.
7. Configurações e Segurança — postura de controles, proteção e recomendações.
8. Histórico e Auditoria — rastreabilidade de eventos e investigações temporais.

## Limites da V2

- As telas são `data-backed`; sem investigação de fontes, mapping e fixtures rastreáveis, não devem mostrar números, listas, tendência ou status inventados.
- `data-backed` descreve a origem factual esperada do produto, não a prontidão do backend. `tenant-scenarios.json` é referência sintética de cenários e projeções para o Discovery/frontend; não define payloads de APIs nem formato de resposta de controller.
- O backend deve seguir os contratos das operações externas por recurso/fato e definir os endpoints locais de forma delimitada. Não haverá um único controller que responda todo o módulo com o agregado de `onedrive-tenant.generated.ts`.
- As referências exibem controles e ações rápidas, mas não definem o contrato operacional para alterar tenant, conteúdo, permissões ou processos. Esses fluxos permanecem pendentes de decisão de produto e de autorização operacional.
- A referência declara explicitamente que o MVP de Compartilhamento e Acessos é somente leitura; as ações ali listadas são futuras.
- Valores, pessoas, e-mails, datas, organizações, IPs e contagens nas imagens são ilustrações de composição, nunca dados do tenant.

## Princípios e dependências

- Ausência de uma fonte ou evidência não representa zero, ausência de risco ou conta sem atividade. A interface deve usar estado explícito de disponibilidade quando aplicável.
- Cada bloco deve distinguir, quando publicado, dado disponível, restrito, indisponível, parcial, desatualizado ou falho; `coming_soon` só é aplicável a capacidades explicitamente fora do recorte operacional.
- Filtros, exportação, relatórios, atualização e detalhe contextual são comportamentos visíveis nas referências; seus campos, regras de resultado e disponibilidade dependem do contrato de cada superfície.
- O documento e imagens do sponsor sustentam produto e composição; não constituem validação de fonte, cobertura, licença, integração ou backend.

## Decisões transversais

- **C6–C9 aceitas A (usuário;2026-10-15):** Atividade conta arquivos distintos
  com atividade registrada de compartilhamento; Defender conta alertas criados
  D30 de qualquer classificação/status; vencimentos contam arquivos atuais
  pelo fim nominal combinado resolvido; Atividades Críticas seleciona somente
  Alto/Crítico, com maior risco antes da recência, até5IDs e filtros sem
  reposição. Cobertura, janelas, identidade e ausência estão nos contratos e
  [pacotes aceitos](backend-defaults-e-clarificacoes.md#convergência-com-análise-independente--2026-10-15).
  São decisões explícitas do usuário sobre propostas do agente.


- **C3/C4/C5 aceitas A (usuário; 2026-10-14):** Principais Benefícios usa
  armazenamento utilizado no OneDrive da publicação canônica Reports,
  clientes com pastas protegidas conforme KFM e percentual de clientes com
  atualização recente/sem erro reportado entre os classificados C2. Resumo de
  Riscos conta arquivos atuais únicos no maior risco comprovado, com contexto
  de unidade e baseline de snapshotD30. Fórmulas, ausência e cobertura estão nos
  contratos/mappings das duas abas e no [registro das decisões](backend-defaults-e-clarificacoes.md#clarificação-dos-achados-b1b3--2026-10-14).
  São alterações de significado aceitas pelo usuário, sem reinterpretar os
  números/textos históricos da fixture ou atribuí-las ao DOCX original.

- **C2 aceita A:** estados instantâneos são substituídos por saúde diária reportada: Erro reportado, Atualizado reportado nos últimos30dias e Sem atualização reportada nesse prazo, com Não avaliado/cobertura explícitos. Clientes OneDrive e dispositivos Intune são populações separadas; score de dispositivos explicita o universo Intune sem vínculo presumido. R3 e pesos preservados. É alteração expressa do recorte do DOCX aprovada pelo usuário após investigação. *(usuário; 2026-10-14; [C2](backend-defaults-e-clarificacoes.md#c2--estados-instantâneos-e-correlação-de-dispositivos-aceita-a))*

- **C1 aceita A:** Compartilhamentos por Tipo conta cada arquivo uma vez pela precedência Anônimo > Convidado externo > Aplicativo/Integração > Organização > Pessoas específicas. Donut e KPI mantêm unidade de arquivos; desconhecidos declaram cobertura, sem categoria inventada. A ordem não muda risco. *(usuário; 2026-10-14; [C1](backend-defaults-e-clarificacoes.md#c1--partição-do-compartilhamento-aceita-a))*

- **Revisão das imagens — R5 aceita:** Retenção e Governança mantém cinco métricas; quantidade e volume representam os mesmos arquivos atuais únicos com retenção efetiva comprovada. Total global exige avaliação íntegra, zero exige ausência comprovada e falta de tamanho impede total de bytes. Cópias/ocupaçãoPHL são fatos físicos distintos; não preenchem essas duas linhas. *(usuário; 2026-10-14; [R5](backend-defaults-e-clarificacoes.md#r5--arquivos-sob-retenção-e-cópias-preservadas-aceita-a))*

- **Revisão das imagens — R4 aceita:** versões usam referência manual500, sem exigência365dias; modo automático mostra valor real com comparação numérica não avaliável. O detector>50versões do DOCX continua separado. *(usuário; 2026-10-14; [R4](backend-defaults-e-clarificacoes.md#r4--versões-e-expiração-acrescentada-aceita-a))*

- **Revisão das imagens — R3 aceita:** evolução mensal usa dispositivos/clientes Health na série azul e quantidade de erros reportados na vermelha, como as unidades da imagem05. Referências/coberturas próprias, meses sem coleta nulos e sem somas anuais de ocorrências. KPI de arquivos Reports permanece separado. *(usuário; 2026-10-14; [R3](backend-defaults-e-clarificacoes.md#r3--unidade-da-evolução-de-sincronização-aceita-a))*

- **Revisão das imagens — R2 aceita:** residual por objeto: arquivo avaliado sem achado é Informativo; evento rotineiro bem-sucedido com contexto é Baixo; compartilhamento restrito/revisado de leitura pode ser Baixo, com prazo<=30 dias quando externo. Regras superiores prevalecem e contexto insuficiente mantém não classificado. Comparações exigem mesma revisão de regra. *(usuário; 2026-10-14; [R2](backend-defaults-e-clarificacoes.md#r2--baixoinformativo-por-objeto-aceita-a))*

- **Revisão das imagens — R1 aceita:** o card de retenção usa recomendações Orkestria90dias geral/180 por cargo explicitamente crítico/730 para exceção legal aprovada e carência local30dias após fim de retenção aprovado para usuário excluído. Substitui os 7anos e a quarta linha técnica da Q2. Não garante armazenamento Microsoft nem gera data/ação automática. *(usuário; 2026-10-14; [R1](backend-defaults-e-clarificacoes.md#r1--pacote-de-retenção-da-imagem06-aceita-a))*

- **Clarificação resolvida por inferência autorizada:** conteúdo usa B — inventário de todos os drives elegíveis, com permissões dos compartilhados e rótulos dos arquivos suportados. A leitura da imagem 03 sustenta universo global das análises; cobertura incompleta permanece parcial. Arquivos ativos do Report, candidatos a duplicidade e prazo estimado de lixeira têm semânticas distintas e explícitas. *(origem: inferência do agente autorizada pelo usuário; 2026-10-14; [resolução](backend-defaults-e-clarificacoes.md#clarificação-5--cobertura-inicial-definida-b-por-inferência-autorizada))*

- **Clarificação confirmada:** baseline default-v1 de colaboração controlada e critérios dos Security/Health Scores aprovados; valores atuais desconhecidos ficam sem valor. Detector local de download, janela única de lixeira de 93 dias e universos de quarentena/preservação são explícitos. Nenhum controle Microsoft é alterado automaticamente. *(origem: usuário; 2026-10-14; [pacote aceito](backend-defaults-e-clarificacoes.md#clarificação-4--baseline-de-configurações-aceita-a))*

- **Clarificação confirmada:** a série mensal de erros usa a última fotografia íntegra do mês e informa que são erros reportados nos 30 dias até o snapshot. Meses não coletados ficam sem valor. Errors exige perfil oficial de entrada e primeira extração compatíveis, sem presumir equivalência entre v0/v1. *(origem: usuário; 2026-10-14; [pacote aceito](backend-defaults-e-clarificacoes.md#clarificação-3--série-de-sincronização-aceita-a))*

- **Clarificação confirmada:** eventos/JSON sanitizado duram 90 dias; snapshots diários, 400 dias; rollups mensais, 13 meses. Classificação default-v1 usa regras/limiares aprovados com maior severidade satisfeita e contexto insuficiente sem classificação. A exclusão é local; defaults de conteúdo são recomendação Orkestria, sem ação automática Microsoft. *(origem: usuário; 2026-10-14; [pacote aceito](backend-defaults-e-clarificacoes.md#clarificação-2--retenção-e-regras-de-risco-aceita-a))*

- **Clarificação confirmada:** não haverá integração HR. O backend pode projetar desligamento presumido após 7 dias consecutivos de bloqueio observado e evidência de OneDrive; reativação interrompe a contagem. Exclusão técnica entra imediatamente quando correlacionável. A origem é explícita e os fatos de workflow humano desconhecidos permanecem nulos/sem publicação. *(origem: usuário; 2026-10-14; [decisão](usuarios-desligados-e-retencao/decisoes.md))*

- **Confirmada:** a navegação preserva as oito abas e sua ordem, conforme `Microsoft365_Onedrive.docx` e as imagens numeradas `01` a `08`.
- **Confirmada:** o módulo prioriza leitura administrativa e investigação; não assume alteração automática de recursos.
- **Clarificação confirmada:** o OneDrive Health Score é próprio desta superfície, com suas nove dimensões do DOCX. Como no OneDrive Security Score, peso não coletado continua no denominador de `100` e recebe pontuação `0`; a fixture de homologação do Health Score usa `75/100`. *(origem: usuário; 2026-09-14)*
- **Clarificação confirmada:** o OneDrive Security Score mantém os nove pesos no denominador de `100`. Uma dimensão sem coleta recebe pontuação `0` no respectivo peso; ela não é removida do cálculo. *(origem: usuário; 2026-09-14)*
- **Clarificação confirmada:** blocos do Dashboard têm publicação, cobertura e disponibilidade independentes; uma lacuna local não oculta os outros blocos publicados. *(origem: usuário; 2026-09-14)*
- **Clarificação confirmada:** `fixtures/tenant-scenarios.json` serve de referência semântica para o Discovery do backend e os cenários da UI; não é fixture no wire format das APIs externas nem especificação do payload de controllers. O backend será organizado por operações/responsabilidades delimitadas, sem endpoint único equivalente ao `onedrive-tenant.generated.ts`. *(origem: usuário; 2026-10-14)*
- **Sugerida/configurável:** limites de atividade, armazenamento, versões e detecção comportamental devem ser configuráveis quando a respectiva capacidade for formalizada; os valores do documento são referência inicial, não política imutável.
- **Pendente de produto:** definir quais ações administrativas, de transferência, retenção, correção ou exportação tornam-se operacionais, com confirmação e auditoria.

## Prontidão

| Superfície | Dados | Produto | Contrato | UI Blueprint | Cobertura frontend | Cobertura backend |
| --- | --- | --- | --- | --- | --- | --- |
| Dashboard Executivo | data-backed | confirmada | composição e dependências C1/C2 definidas | homologação anterior; adendo conceitual | frontend_done | backend_implementation_ready |
| Contas e Armazenamento | data-backed | confirmada | Reports, descoberta e detalhe delimitados; OpenAPI validado | homologação anterior; adendo conceitual | frontend_done | backend_implementation_ready |
| Arquivos e Conteúdo | data-backed | confirmada | inventárioQ5, admissãoA7 e versõesA8 definidos/SUPPORTED | homologação anterior; adendo conceitual | frontend_done | backend_implementation_ready |
| Compartilhamento e Acessos | data-backed | confirmada | C1 aceita A; partição/mapping definidos | homologação anterior; adendo conceitual | frontend_done | backend_implementation_ready |
| Atividade e Sincronização | data-backed | confirmada | A2/C2/R3/C3/C4/C6 definidos;4períodos SUPPORTED; inatividade da pessoa D180 | homologação anterior; adendo conceitual | frontend_done | backend_implementation_ready |
| Usuários Desligados e Retenção | data-backed | confirmada | casos técnicos sem HR; fatos humanos opcionais | homologação anterior; adendo conceitual | frontend_done | backend_implementation_ready |
| Configurações e Segurança | data-backed | confirmada | baselines/R4/R5/C2, risco C5, alertas C7 e vencimentos C8 definidos | homologação anterior; adendo conceitual | frontend_done | backend_implementation_ready |
| Histórico e Auditoria | data-backed | confirmada | feed, configuração por perfil, normalização A4/A5 e seleção C9 definidos | homologação anterior; adendo conceitual | frontend_done | backend_implementation_ready |

- [Cobertura de frontend](frontend-coverage-review.md): as oito superfícies
  estão `frontend_done`; o handoff do módulo é `backend_ready`.
- [Cobertura de backend](backend-coverage-review.md): gate agregado
  **`backend_implementation_ready`**, com oito de oito superfícies prontas.
  A reanálise independente final dos69artefatos retornou `[]` em2026-10-15.
  A1–A8/B1–B11 estão resolvidos; Q1–Q5/R1–R5/C1–C9 preservados.
  Oito OpenAPI/33operações válidos e Simulator87operações/53caminhos, cinco
  serviços importados e smoke aprovados após a correção dos Reports. Prontidão
  não atesta backend implantado ou dados reais já publicados.
- [UI Blueprint](ui-blueprint.md): homologação histórica preservada e adendo
  conceitual para os bindings/textos da fonte real. Materializar essa
  reconciliação na futura integração, sem alterar fixture nesta entrega.
- O mapping por aba, incluindo fatos sem API direta e derivações locais, está
  nos arquivos de fontes listados no
  [índice técnico](fontes-e-viabilidade.md) e linkados na matriz do relatório
  backend.

### Próximo passo

- Formalizar a implementação conforme os contratos/mappings e o
  [relatório backend](backend-coverage-review.md), com fontes
  canônicas, importadores, projeções/histórico e endpoints locais delimitados.
  Materializar os bindings aceitos C1–C9/R3/R5 na integração;
  licenças/consentimento/perfis/primeiras leituras permanecem pré-requisitos de
  publicação por conexão, sem dados inventados.
- A [fixture semântica](fixtures/tenant-scenarios.json) representa expectativas
  históricas do frontend. Ela não define a modelagem de persistência, o payload
  Microsoft ou um controller agregado; sua validação não substitui os mappings.

Os estados desta seção são cobertura de discovery e handoff; não são estados de
runtime da capacidade.
