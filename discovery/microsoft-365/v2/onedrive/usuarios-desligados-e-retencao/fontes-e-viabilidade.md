# Fontes e viabilidade — Usuários Desligados e Retenção

## Fontes compostas

| Fato | Estratégia / fonte |
| --- | --- |
| Pessoa removida e data de exclusão | **Nova coleta justificada**: `GET /directory/deletedItems/microsoft.graph.user`, com `User.Read.All` mínimo; a coleta técnica foi executada com `Directory.Read.All` e observou envelopes OData válidos, inclusive coleção vazia em uma tentativa e item na outra. Os itens recuperáveis ficam no ciclo de exclusão temporária do diretório (até 30 dias), não em histórico permanente. |
| Uso/capacidade do OneDrive | **Projeção/extensão de relatório**: `getOneDriveUsageAccountDetail(period='D180')`, `Reports.Read.All`, CSV após redirect. |
| Evidência de ações históricas | **Leitura complementar fora do Graph**: Office 365 Management Activity API, `Audit.SharePoint`, conforme a normalização canônica de auditoria. Não comprova exposição remanescente. |
| Exposição externa atual do espaço do caso | **Reuso de projeção canônica**: inventário corrente e permissões de Compartilhamento e Acessos, correlacionados por pessoa/site/drive/arquivo comprovados; arquivos únicos e cobertura próprios, conforme GA3 abaixo. |
| Elegibilidade/caso técnico presumido | **Projeção local aprovada** de `accountEnabled=false` por 7 dias consecutivos observados + evidência de OneDrive no relatório/inventário. Não usa HR nem afirma data real de desligamento. |
| Transferência, responsável, prazo, ticket, aprovação e etapas humanas | **Estado operacional interno do Orkestria**, opcional nesta consulta. Ausência permanece desconhecida; a regra de elegibilidade não fabrica esses fatos. |

Usuário excluído não prova que havia OneDrive, retenção, transferência ou exclusão futura; correlacionar somente pelas chaves publicadas e manter ausência como desconhecida. A resposta `value: []` é um vazio factual apenas para o recorte devolvido.

## Cobertura sintética

O Simulator cobre identidade, relatórios e usuários excluídos; o caso técnico
é uma derivação local do contrato Orkestria, não payload Microsoft. Os links
de validação existentes conservam esta seção como referência.

## Projeção default sem HR — aprovada em 2026-10-14

A identidade canônica fornece o bloqueio e o relatório de uso/inventário fornece
a evidência de OneDrive; a projeção guarda o início do episódio observado e a
última observação. Após 7 dias, gera um caso estável por pessoa/episódio, com
origem presumida, situação Conta bloqueada e evidências. Não retroagir o relógio
para a criação da conta nem para sua última atividade. Reativação encerra o
episódio; um novo bloqueio inicia outra contagem. Sem snapshots íntegros ou com
lacuna superior a 48 horas na observação diária, reiniciar a contagem conservadora
na próxima observação: intervalo desconhecido não comprova bloqueio contínuo.

Os agregados correntes selecionam somente o episódio elegível vigente por
pessoa. O encerramento por reativação retira aquele episódio da população
atual; snapshots/registro encerrado continuam história, sem duplicar pessoa,
arquivos ou capacidade quando um novo episódio tornar-se elegível. Exclusão
técnica da pessoa de um caso já vigente atualiza suas evidências, sem abrir
uma segunda linha corrente para a mesma pessoa. A chave factual de pessoa e
os vínculos de OneDrive são preservados; nome/UPN exibível isolado não une
episódios. Essa é a consequência da regra Q1 de encerramento/recontagem, não
um workflow humano ou afirmação de transferência/limpeza Microsoft.

Usuário excluído entra imediatamente quando houver evidência correlacionada de
OneDrive; `deletedDateTime` é data de exclusão técnica, não data de saída de HR.
Licença removida é sinal separado. Dados humanos não publicados permanecem
nulos/sem publicação, conforme o contrato. Totais de candidatos, capacidade,
arquivos e distribuição por departamento/status vêm dessas evidências; a
exposição remanescente reutiliza a projeção corrente de permissões abaixo.
Transferência, progresso, aprovação e ticket não são
deduzidos. Uma publicação completa vazia permite zero de casos elegíveis;
falha ou população parcial não permite esse zero.

O Simulator cobre identidade/relatórios/usuários excluídos e o caso é uma
derivação local do contrato Orkestria, separada de payload Microsoft. A retenção
foi aprovada na clarificação 2; o baseline recomendado não é data efetiva do caso.

### Exposição externa atual dos casos — GA3

Reutilizar a publicação corrente de
[Compartilhamento e Acessos](../compartilhamento-e-acessos/fontes-e-viabilidade.md),
sem outro leitor ou feed. A fonte factual é seu inventário Q5 e a avaliação
de permissões atuais, com o mesmo predicado canônico de exposição externa;
`sharingRecords` histórico e o número de criações/convites não o substituem.

1. Resolver pessoa do caso → espaços OneDrive por vínculos canônicos de
   proprietário/site/drive. Chaves do inventário e da permissão devem referir-se
   ao mesmo arquivo corrente `(driveId,itemId)` no tenant autorizado. Um nome,
   URL textual ambígua, evento antigo ou titularidade presumida não resolve
   esse join. Vários espaços comprovadamente vinculados são unidos pelo
   conjunto de arquivos, sem selecionar arbitrariamente o primeiro drive.
2. `externalExposure` é a cardinalidade das chaves de arquivos locais atuais
   que a projeção comprova estarem externamente expostas naquele espaço e
   referência. Contar cada arquivo uma vez, mesmo com vários links,
   destinatários ou concessões. Excluir pastas, tombstones/excluídos, cópias de
   preservação e duplicações remotas, conforme o universo corrente canônico.
   A precedência visual C1 não elimina exposições sobrepostas relevantes a
   esse predicado.
3. Reutilizar `asOf`, geração, revisão do predicado, cobertura de arquivos e
   permissões e freshness da publicação de origem. Grupo não resolvido,
   herança não comprovada, paginação incompleta ou limitações do chamador
   mantêm desconhecidos; ausência de `inheritedFrom` em OneDrive empresarial
   não comprova concessão direta ou ausência de herança. Não recalcular a
   métrica pelo filtro D30 da auditoria ou pela página de casos/arquivos.
4. Vínculo não resolvido ou nenhuma avaliação factual disponível mantém a
   medida nula com motivo. Um subtotal positivo comprovado pode ser publicado
   como observado, com recorte parcial explícito; zero requer inventário,
   vínculos e permissões íntegros comprovando ausência no universo do caso.
   Falha/restrição conserva a última publicação válida e seu frescor; não
   substitui exposição por zero nem por eventos de criação/remover link.

O fechamento de 2026-10-15 explicita reuso das leituras já selecionadas e
`SUPPORTED`. Não cria operação Microsoft, política de retenção, destinatário,
aprovação ou comando; responsáveis e demais fatos humanos continuam opcionais.

### Atualização R1 — origem das quatro regras

A revisão por imagens substituiu os defaults de conteúdo: 90 dias geral,
180 por cargo explicitamente crítico, 730 para exceção legal/compliance
aprovada e carência local recomendada30dias após fim factual/aprovado da
retenção de usuário excluído. Fonte: configuração/recomendação Orkestria
versionada, inferida da imagem06 e aceita pelo usuário. Cargo crítico requer
registro explícito local; não derivar de risco, departamento ou título, nem
introduzir HR. Datas efetivas vêm do caso/ciclo aplicável com evidência e
aprovação; não somar carência a política Microsoft ou prometer armazenamento
além do ciclo factual. Os leitores Microsoft continuam fontes independentes
de configuração/holds, sem alterar API ou disparar ação nesta revisão.

## Fatos sem API e fonte operacional necessária

- A elegibilidade e a situação inicial do caso têm a regra default aprovada
  acima. Responsável, destinatário, ticket, aprovação, etapa/progresso,
  transferência e exceções dependem de evidência interna legítima; HR fica fora
  do escopo. Prazo de retenção e exclusão prevista não decorrem do bloqueio.
- A lista de `deletedItems` é um conjunto temporário de objetos removidos, com
  retenção de diretório de até 30 dias; não identifica quem está em processo de
  desligamento antes da remoção e não é histórico permanente. Uso no relatório
  OneDrive e eventos `Audit.SharePoint` são apenas evidências auxiliares para
  correlacionar uma publicação de caso já existente.
- Totais e distribuições de casos técnicos são agregações da projeção aprovada.
  Próximos de excluir, transferências e progresso dependem dos fatos específicos
  publicados; ausência mantém esses blocos `not_yet_published`/parciais. Não
  transformar o bloqueio em conclusão de workflow ou cronograma Microsoft.
- Os valores de retenção da imagem do sponsor e da fixture não são política do
  tenant. O catálogo Graph de `retentionLabels` não fornece, no modo app-only
  atual, as regras globais nem os prazos por caso; a leitura por arquivo tampouco
  comprova lifecycle de uma pessoa desligada.
- `Ações Rápidas` e os botões do workflow são apresentação estática, sem
  endpoint ou handler aprovado. Não executar atribuição, transferência ou
  exclusão nesta superfície.
