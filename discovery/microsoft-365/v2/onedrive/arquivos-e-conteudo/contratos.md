# Arquivos e Conteúdo — Contrato semântico inicial

## Shape e semântica

- `contentSummary`: sete métricas opcionais de itens, itens ativos, criados/modificados/excluídos no período, itens descartados e tamanho total. `itemCount` e `activeItemCount` são agregados tenant-wide dos relatórios e reconciliam as contagens das contas da mesma referência temporal; `totalBytes` reconcilia seu armazenamento utilizado. Ativos no KPI significa arquivos com atividade na janela do relatório, D180 na fonte selecionada, com período explicitamente informado; não equivale a todos os itens existentes do inventário. Armazenamento utilizado pode incluir versões/lixeira e não equivale à soma dos tamanhos correntes. Cada métrica publica `value` e, quando disponível, comparação D30 com `previousValue` e `periodDays: 30`; ausência ou `null` não autorizam percentual ou direção inventados. `previousValue: 0` é baseline factual, mantém o contexto D30 e normaliza a variação como `valor atual × 100%`.
- `filters`: catálogo publicado de proprietário, departamento, tipo, status (`active`/`deleted`), risco e período de modificação (`allTime`/`last7Days`/`last30Days`/`last90Days`). O período padrão é D30; `allTime` remove somente o recorte de data; a busca cobre nome, localização e proprietário.
- `contentItems`: página normalizada de itens existentes (`active`) e excluídos, com nome, proprietário, departamento, localização, tipo/extensão, tamanho, datas de criação/modificação, status, situação de compartilhamento, classificação de sensibilidade opcional e risco opcional. O escopo contratado é todos os drives empresariais elegíveis. `total` é a cardinalidade do inventário publicado após filtros, antes da paginação; só é total tenant-wide com cobertura íntegra de todos os drives. Publicação parcial declara seu escopo e não substitui KPIs globais. `items` contém somente a página solicitada. Em fixtures de desenvolvimento, `inventory` pode publicar a coleção completa sintética para derivar filtros e análises locais; isso não altera a semântica paginada nem transforma o campo em fonte de produção.
- As análises derivadas do recorte classificam extensões em Documentos, Planilhas, Apresentações, PDFs, Imagens, Vídeos e Outros; tamanho em seis faixas de `< 1 MB` a `> 1 GB`; e antiguidade em cinco faixas de `< 6 meses` a `> 3 anos`. Risco exibe somente Crítico, Alto, Médio, Baixo e Informativo; risco nulo fica apenas no filtro Não classificado.
- Os rankings do recorte são tabelas de insight sem grades internas: extensões publicam extensão, quantidade e participação sobre todos os itens filtrados, inclusive os sem extensão; pastas agrupam pasta e proprietário, com quantidade de arquivos e tamanho; maiores arquivos publicam arquivo, proprietário, tamanho e modificação relativa em uma única unidade contra `asOf`. Arquivo e proprietário são truncados visualmente, com tooltip do valor publicado; a modificação tem tooltip com a data pt-BR completa. Pastas e arquivos são limitados aos dez maiores resultados.
- `disposal`, `duplicates` e `sensitiveContent`: agregados independentes que reagem ao mesmo recorte filtrado; ausência de publicação não equivale a valor zero. `disposal.items[].permanentDeletionAt` é anulável e significa prazo nominal estimado da janela padrão, explicitamente apresentado como estimativa: exclusão original comprovada +93 dias. Segundo estágio não reinicia a contagem. Sem data original fica nulo; não é data real nem agendamento confirmado. Grupos de `duplicates` publicam `potentialSavingsBytes` e `verifiedAt`; cada resultado de `sensitiveContent.labels[]` publica `detectedByDlp` e `analyzedAt` quando disponíveis.
- `duplicates`: candidatos agrupados por igualdade de hash publicado não vazio em ao menos dois arquivos existentes do inventário. Não é verificação byte a byte. Pastas, tombstones e itens sem hash não participam; sem fallback por nome/extensão/tamanho. `verifiedAt` é a data da avaliação dos hashes; economia potencial = soma dos tamanhos menos a maior cópia, sem valor se faltar tamanho, sem promessa de economia realizada ou autorização para excluir. O hash técnico não é publicado na UI.
- `disposal`: itens atualmente presentes na lixeira do site pessoal de um OneDrive corporativo, com `name`, `size`, `deletedDateTime`, `permanentDeletionAt` e `deletedFromLocation` quando publicados. O agregado só contabiliza sites lidos com sucesso; falha, falta de permissão ou cobertura parcial preservam a disponibilidade e cobertura próprias, sem converter em zero. Não infere itens já eliminados definitivamente nem usa tombstones do delta como lixeira.
- O recorte filtrado local é aplicado a todas as regiões abaixo da barra. KPIs continuam sendo snapshots D30 independentes. Um item excluído preserva os metadados publicados do inventário no momento da exclusão; propriedades não publicadas não recebem classificação derivada.
- `sensitiveContent`: rótulos retornados por `extractSensitivityLabels` para arquivos ativos do escopo explicitamente aprovado. Cada resultado traz `sensitivityLabelId` e `assignmentMethod`, resolvidos contra o catálogo de rótulos; item bloqueado, não suportado, sem acesso ou sem resultado não é tratado como “sem rótulo”. A cobertura expõe drives/itens candidatos e concluídos, além de falhas por motivo, porque a ação pode atualizar metadados defasados.
- `quickActions`: quatro itens estáticos tipados por `id`, `label` e composição de ícone `family`/`tone`. São affordances visuais sem fluxo, clique, tooltip ou handler nesta etapa.

## Fronteiras das distribuições de tamanho e antiguidade

As duas distribuições usam o inventário publicado **após os filtros e antes
da paginação**, no escopo de drives e status já contratado; não derivam da
página visível nem dos totais dos relatórios. A participação, quando publicada,
usa somente os itens avaliáveis naquela distribuição. Um tamanho desconhecido
não impede avaliar antiguidade publicada, e vice-versa. Campos ausentes ou
inválidos ficam fora da respectiva distribuição, com cobertura explícita;
conjunto sem avaliáveis não é evidência de ausência de arquivos. Categorias
sem itens podem permanecer ausentes, conforme a coleção histórica.

Preservam-se os rótulos históricos de tamanho, com comparação em bytes
inteiros não negativos e base 1024: `MB = 1024² bytes` e
`GB = 1024³ bytes`. A classificação usa os valores integrais, antes de qualquer
arredondamento de exibição.

| Rótulo preservado | Intervalo efetivo de tamanho `s` |
| --- | --- |
| `< 1 MB` | `0 ≤ s ≤ 1 MB` |
| `1 MB a 10 MB` | `1 MB < s ≤ 10 MB` |
| `10 MB a 100 MB` | `10 MB < s ≤ 100 MB` |
| `100 MB a 500 MB` | `100 MB < s ≤ 500 MB` |
| `500 MB a 1 GB` | `500 MB < s ≤ 1 GB` |
| `> 1 GB` | `s > 1 GB` |

A antiguidade é a idade da **última modificação**, sem inferir último acesso.
Usar `d = floor((asOf − modifiedAt) / 24 horas)`, com a âncora factual de
`contentItems` da mesma publicação, nunca o relógio atual. O ano convencional
tem 365 dias e o corte de seis meses tem 182 dias; não são meses/anos de
calendário. Data ou âncora ausente/inválida não recebe faixa.

| Rótulo preservado | Intervalo efetivo de `d`, em dias inteiros |
| --- | --- |
| `< 6 meses` | `d ≤ 182` |
| `6 a 12 meses` | `182 < d ≤ 365` |
| `1 a 2 anos` | `365 < d ≤ 730` |
| `2 a 3 anos` | `730 < d ≤ 1095` |
| `> 3 anos` | `d > 1095` |

Limites exatos pertencem à faixa anterior: 1 MB e 182 dias ficam na primeira;
1 GB e 1095 dias ficam na penúltima. Uma modificação posterior à âncora produz
`d < 0` e permanece na primeira faixa, preservando a convenção histórica;
o recorte temporal, quando ativo, continua excluindo datas posteriores a
`asOf`. Os rótulos são nomes das categorias homologadas; os intervalos acima
definem sua execução sem sobreposição nem alteração de população.

## Comportamento observável

- **Risco residual R2:** arquivo avaliado sem achado adverso é Informativo. Pode herdar Baixo somente com ao menos uma exposição atual confirmada e todas avaliadas como Baixo, sem regra superior própria. Avaliação exige identidade/hierarquia/metadados atuais, extensão conhecida, sinais de malware/alerta consultados no escopo, exposição resolvida e sensibilidade quando necessária à regra. Ausência de flag é ausência de sinal naquela fonte, sem atestado de arquivo limpo. Condição inaplicável precisa de evidência; ausência de campo não a torna inaplicável. Contexto insuficiente mantém risco nulo. Distribuição usa classificados e coverage explícita; população>0 sem classificados produz bloco não avaliável. Comparações exigem mesma revisão de regras. *(Usuário, 2026-10-14.)*

- **Abrangência definida na clarificação 5:** lista/análises abrangem todos os drives elegíveis, com sensibilidade de todos os arquivos existentes suportados e permissões dos compartilhados. Enquanto a coleta não estiver íntegra, mostrar cobertura parcial de cada bloco; desconhecido não vira zero. Localização e data de exclusão só existem quando sustentadas por hierarquia/evidência factual. Prazo nominal de lixeira informa possibilidade de exclusão anterior e preservação de cópias por outra política. Meses não coletados ficam sem valor e comparações exigem baseline real. *(origem: inferência autorizada pelo usuário após leitura da imagem 03; 2026-10-14.)*

- Filtros por proprietário, departamento, tipo, status, risco e período mudam somente dados compatíveis; busca localiza arquivo, pasta ou pessoa quando publicado. A janela temporal usa a âncora de disponibilidade própria de `contentItems`; sem essa âncora, o filtro temporal não restringe a coleção.
- Os três cartões factuais publicam métrica, unidade e fatos secundários em `dl`; seu CTA é texto estático. Ações rápidas são uma lista estática, sem execução até decisão operacional.
- Tamanho é apresentado em unidade legível preservando a unidade de origem; itens sem classificação/riscos publicados ficam sem afirmação, não em categoria segura.
