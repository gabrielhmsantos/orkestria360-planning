# Fontes e viabilidade — Dashboard Executivo

## Composição dos fatos

O Dashboard não tem endpoint próprio. Ele agrega publicações locais das
superfícies Contas e Armazenamento, Arquivos e Conteúdo, Compartilhamento e
Acessos, Atividade e Sincronização, Usuários Desligados e Retenção,
Configurações e Segurança e Histórico e Auditoria. Cada bloco mantém sua
availability, cobertura e `asOf`; indisponibilidade em uma origem não deve
zerar, ocultar ou invalidar os demais blocos.

| Fato publicado | Origem e transformação local | Limite |
| --- | --- | --- |
| KPIs de contas, capacidade, arquivos, cotas e compartilhamento externo | Snapshot publicado pelas superfícies de contas, conteúdo e compartilhamento; normalização de unidade e recorte D30 conforme os contratos dessas superfícies. | Não recalcular a partir da página filtrada de contas nem misturar snapshots com âncoras diferentes. |
| Distribuições de atividade, utilização e departamentos; ranking `topAccounts` | Inventário local de contas com atividade, cotas e identidade correlacionada; agrupar pelas faixas publicadas e ordenar armazenamento usado. | Faixas, denominadores e itens sem classificação devem seguir o contrato de Contas; não inferir departamento ausente. |
| Evolução de armazenamento | Série de snapshots mensais publicada por Contas e Armazenamento, agregada por ponto temporal. | Exige histórico local coerente e unidades iguais; não interpolar pontos nem preencher capacidade alocada ausente. |
| Resumo de compartilhamento, riscos e recomendações | Publicações locais de permissões, eventos de auditoria, segurança e regras versionadas de classificação/prioridade. | Um snapshot de permissões não é histórico; cada item deve manter sua evidência, recorte e destino de investigação quando publicado. |
| Resumo de desligamento | Projeção aprovada de Usuários Desligados e Retenção: bloqueio observado por 7 dias + OneDrive existente, ou exclusão técnica correlacionada; origem presumida explícita e sem HR. | A regra publica elegibilidade/casos técnicos. Transferência, responsável, retenção e conclusão continuam fatos independentes; desconhecidos não viram zero nem conclusão. |
| OneDrive Health Score | Cálculo local sobre as nove dimensões e pesos aprovados em `decisoes.md`; cada dimensão usa avaliação publicada pela respectiva superfície. | Os pesos somam 100; dimensão não coletada contribui zero sem sair do denominador. O contrato prevê integração futura, mas o score não é materializado no Dashboard atual. Não promover o 75/100 da fixture a dado de tenant. |

## Fatos sem API direta e regras locais

- Variações, percentuais, faixas de atividade/utilização, rankings e agregações
  são cálculos locais sobre snapshots publicados; não são campos prontos de uma
  API OneDrive.
- Riscos, recomendações, prioridades, badges e destinos de investigação são
  classificações versionadas do Orkestria. Cada regra precisa declarar as
  evidências mínimas e preservar resultado desconhecido quando a cobertura for
  insuficiente.
- A evolução mensal e comparações históricas dependem de retenção local de
  snapshots. Relatórios de uso com janela móvel não fornecem, sozinhos, a série
  histórica mensal por conta requerida pelas superfícies.
- Ícones e tons são apresentação estática derivada do tipo semântico publicado;
  não constituem dado de provider.
- Ações rápidas e navegação apenas encaminham para uma investigação publicada;
  não alteram permissões, conteúdo, políticas ou lifecycle.

## Dependências de publicação

A2 e C1 definem as métricas/partição das origens; C2 aceita A define saúde
diária reportada e populações Health/Intune independentes. Riscos/distribuições
reutilizam essas publicações sem juntar clientes e dispositivos por pessoa,
nome ou timestamp. Regra que exigir vínculo factual de aparelho só dispara
quando existir essa evidência, nunca a partir do agregado Intune. Os critérios
do Health Score continuam aprovados e ele permanece fora da UI atual. As
dependências de Discovery estão fechadas; publicação real exige as gerações
compatíveis de cada bloco, sem chamadas duplicadas.

O Dashboard só pode publicar cada fato composto quando as projeções de origem
forem publicadas com `asOf`, cobertura e availability compatíveis. A estratégia
de armazenamento histórico, casos técnicos sem HR, critérios de avaliação e
cobertura inicial foi definida nas cinco clarificações. Reusar essas projeções,
sem chamadas duplicadas ao provider. O Health Score tem fórmula/critérios
aprovados, continua fora da UI atual e publica evidências somente quando as
origens forem efetivamente coletadas. Histórico ou collector ainda não
implantados são trabalho de implementação, não incógnita de fonte. Consulte
[`backend-coverage-review.md`](../backend-coverage-review.md) para a disposição
consolidada.
