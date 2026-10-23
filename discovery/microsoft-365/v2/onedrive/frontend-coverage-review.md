# Cobertura de frontend — Microsoft 365 / OneDrive

> Migrado em 14/09/2026 da revisão de cobertura anterior. Este relatório é
> vivo: `frontend_done` só pode ser registrado após a UI implementada ser
> homologada visualmente; ele não é inferido de fixture, contrato ou blueprint.

## Alcance da homologação e precedência

`frontend_done` e `backend_ready` registram a implementação/homologação
histórica de setembro, preservada neste track backend. As matrizes abaixo,
a fixture e a evidência original do blueprint descrevem aquele recorte.
Para a futura integração, prevalecem os contratos/mappings atuais, Q1–Q5,
R1–R5/C1–C9 e o adendo conceitual do [blueprint](ui-blueprint.md). Em especial,
Health/Intune não têm vínculo físico presumido; Health Score não integra a UI
atual, e novas unidades/rótulos não reinterpretam os números da fixture.
O [relatório backend](backend-coverage-review.md) avalia prontidão técnica
separadamente. Esta precedência não declara as mudanças de integração já
implementadas ou homologadas na aplicação.

## Handoff do módulo para backend

- **Gate:** `backend_ready`.
- **Regra:** o módulo só fica `backend_ready` quando todas as superfícies
  `data-backed` estiverem `frontend_done`.
- **Bloqueadores:** nenhum na camada de frontend.
- **Próximo passo:** o discovery backend pode avançar usando os contratos já
  reconciliados; esta revisão não autoriza criar integração fora do escopo aprovado.

## Categorias

| Categoria | Significado |
| --- | --- |
| `source_required` | Falta identificar ou validar fonte/mapping suficiente para representar factual e seguramente a superfície. |
| `decision_required` | Falta decisão de produto, contrato, política ou workflow que impede fixture ou comportamento visual conforme. |
| `fixture_ready` | Fonte e mapping sustentam o contrato, mas fixture do Orkestria, blueprint ou UI ainda não estão completos. |
| `mutation_approved` | Ação externa tem fonte e regra de produto aprovadas; a UI ainda usa fixture sintética e a futura operação exige controles explícitos. |
| `frontend_implementation_ready` | Contrato, shape, mapping, fixtures e blueprint estão validados; a UI pode ser implementada. |
| `frontend_done` | A UI foi implementada e homologada visualmente. |
| `not_applicable` | A superfície não é `data-backed`; não bloqueia o handoff do módulo. |

`mutation_approved` qualifica uma superfície cuja categoria principal é outra.
Os estados desta tabela não são estados de runtime.

## Regra de agregação

Cada bloco material preserva seu próprio status. O agregado de cada aba usa o
menor nível entre eles: `source_required` ou `decision_required`, depois
`fixture_ready`, `frontend_implementation_ready` e, por fim, `frontend_done`.
`mutation_approved` é somente qualificador.

## Agregado por superfície

| Superfície | Status dos blocos | Categoria consolidada | Bloqueador ou evidência dominante | Próximo passo |
| --- | --- | --- | --- | --- |
| Dashboard Executivo | `2 × frontend_done` | `frontend_done` | Homologado visualmente em wide e compacto; Health Score de nove dimensões, availability independente e cenário parcial preservados. | Concluído no frontend. |
| Contas e Armazenamento | `2 × frontend_done` | `frontend_done` | Homologado visualmente em wide e compacto; distribuições publicadas, previsão condicionada, tabela completa e detalhe factual de oito blocos preservados. | Concluído no frontend. |
| Arquivos e Conteúdo | `5 × frontend_done`; `1 × mutation_approved` | `frontend_done` | Homologado visualmente em wide, tablet e compacto; inventário, análises, disponibilidade independente de malware, duplicidade factual e detalhe contextual preservados. | Concluído no frontend; manter o controle da mutação. |
| Compartilhamento e Acessos | `2 × frontend_done` | `frontend_done` | Homologado visualmente em wide, tablet e compacto; KPIs, janelas D30/12 meses independentes, tabela factual de links, availability e atenção somente leitura preservadas. | Concluído no frontend. |
| Atividade e Sincronização | `4 × frontend_done` | `frontend_done` | Homologado visualmente em wide, tablet e compacto; períodos, fontes Sync Health/Intune/correlação, evolução fixa, erros, KFM factual e availability composta preservados. | Concluído no frontend. |
| Usuários Desligados e Retenção | `2 × frontend_done` | `frontend_done` | Homologado visualmente em wide e compacto; casos, processo, retenção, exclusões e transferências preservam availability própria, sem workflow. | Concluído no frontend. |
| Configurações e Segurança | `6 × frontend_done`; `1 × mutation_approved` | `frontend_done` | Homologado visualmente em wide e compacto; score canônico de nove dimensões, postura com availability/coverage, DLP datado e recomendações somente internas preservados. | Concluído no frontend; manter o controle da mutação. |
| Histórico e Auditoria | `2 × frontend_done` | `frontend_done` | Revalidação das Linhas 5–6 em wide, tablet e compacto: fixture de 150 eventos/30 datas reconciliada, 10 itens por página e 15 páginas; sete categorias e cinco riscos rotulados pelos catálogos; filtros preservam os KPIs D30 e agregam o inventário filtrado completo; ranking usa `OperationalSectionCard` com cinco linhas, sem expansão ou navegação. | Concluído no frontend. |

## Matriz por bloco

### `frontend_implementation_ready`

Esses blocos já podem avançar com UI, mas não alteram o agregado da aba enquanto
houver outro bloco material em `fixture_ready`.

| Superfície | Blocos |
| --- | --- |
| Dashboard Executivo | KPIs de resumo, tendência de armazenamento, distribuição de utilização, ranking, riscos e recomendações visuais. |

### `frontend_done`

| Superfície | Evidência de homologação |
| --- | --- |
| Dashboard Executivo | Implementação reconciliada, typecheck/lint/build e testes Feature OneDrive aprovados; browser acceptance wide/compact confirmou todos os blocos, tabela do Health Score com overflow horizontal isolado e score visível em mobile. Code review sem P0/P1 confirmado; homologação visual independente APPROVED. |
| Contas e Armazenamento | Implementação reconciliada, typecheck/lint/build e testes Feature OneDrive aprovados; browser acceptance confirmou cenários populated, partial, empty, unavailable, restricted, stale e failed. A revisão de código não confirmou P0/P1; homologação visual independente APPROVED em 1440 e 390, com tabela rolável, Retenção e detalhe de oito blocos. |
| Arquivos e Conteúdo | Implementação reconciliada, typecheck/lint/build e testes Feature OneDrive aprovados; browser acceptance confirmou os cenários published e de availability, busca, tabela, detalhe contextual e breakpoints 1440/768/390. P0/P1 confirmados do code review foram corrigidos; P0/P1 rejeitados ficaram fundamentados nos contratos reconciliados. Homologação visual independente APPROVED. |
| Compartilhamento e Acessos | Implementação reconciliada, typecheck/lint/build e testes Feature OneDrive aprovados; browser acceptance confirmou os cenários published, empty, partial, unavailable, restricted, stale e failed, filtros indisponíveis, 13 colunas factuais e breakpoints 1440/768/390. Code review sem P0/P1; homologação visual independente APPROVED, inclusive com rolagem horizontal interna e por teclado no compacto. |
| Atividade e Sincronização | Implementação reconciliada, typecheck/lint/build e testes Feature OneDrive aprovados; browser acceptance confirmou D7/D30/D90/D180, série fixa de 12 meses, fontes por dispositivo, estados populated/partial/stale/empty, grid wide/tablet/compact e rolagem interna. A extração final preservou esses contratos em componentes de período/análise, dispositivos, observabilidade e suporte. Revalidação autenticada de 15/09 confirmou também `unavailable`, `restricted` e `failed`, sem erros de console. P0/P1 confirmados foram corrigidos; P0/P1 rejeitados ficaram fundamentados nos contratos reconciliados. Homologação visual independente APPROVED. |
| Usuários Desligados e Retenção | Implementação reconciliada, typecheck/lint/build e testes Feature OneDrive aprovados; browser acceptance confirmou populated, empty, partial, unavailable, restricted, stale e failed, filtros indisponíveis, 12 colunas factuais e breakpoints 1440/390. P1 de paginação e apresentação foram corrigidos; P1 sem catálogo de status foi rejeitado por decisão aprovada. Homologação visual independente APPROVED. |
| Configurações e Segurança | Implementação reconciliada, typecheck/lint/build e testes Feature OneDrive aprovados; browser acceptance confirmou populated, empty, partial, unavailable, restricted, stale e failed em 1440/390, teclado, links internos e ausência de overflow. O score usa nove dimensões e contribuição canônica; DLP, sensibilidade, ameaças, retenção e conformidade exibem availability/coverage próprios. P1 confirmados do code review foram corrigidos; P1 de evidência textual e da pontuação zero indisponível foram rejeitados por decisão aprovada. Homologação visual independente APPROVED. |
| Histórico e Auditoria | Implementação reconciliada, typecheck/lint/build e testes Feature OneDrive aprovados; browser acceptance confirmou filtros por catálogo, snapshot D30, análises derivadas, tabela, detalhe allowlist e breakpoints wide/compact. O recorte local usa exclusivamente a janela UTC publicada `[startInclusive, endExclusive)`. Revalidação autenticada de 15/09 confirmou D1 vazio, D7/D30 com os eventos publicados, detalhe com foco/ESC/retorno ao gatilho e os cenários `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed`, sem erros de console. P1 confirmados do code review foram corrigidos; a exigência de D30 como período padrão foi rejeitada por decisão aprovada. A disponibilidade independente de cada bloco analítico foi preservada por contrato. Homologação visual independente APPROVED. |

### Blocos `fixture_ready`

Não há bloco material pendente de fixture runtime.

### Evidência de conclusão de `fixture_ready`

As fixtures runtime ficam em
[`orkestria360/resources/js/data/modules/onedrive/fixtures/`](https://github.com/gabrielhmsantos/Orkestria360/tree/11271a6e88a656e8f2faf4b5522db798a433392d/resources/js/data/modules/onedrive/fixtures),
e não são os exemplos JSON históricos do discovery. Elas agora têm shape
tipado, provenance local, cenários materiais e disponibilidade por bloco. O
harness rejeita bloco `available`, `partial` ou `stale` sem projection
correspondente e aplica o overlay de cenário antes de entregar os dados à UI.
Em Atividade e Sincronização, `OnedriveActivityPeriod` restringe D7/D30/D90/D180
e `Record<OnedriveActivityPeriod, OnedriveActivityPeriodProjection>` exige a
projection de cada janela, com metadados e availability próprios. O contrato
também publica Sync Health, Intune e correlação como fontes distintas por
coleção e por dispositivo; Sync Errors usa chave opaca exclusiva de Sync Health.

## Qualificadores `mutation_approved`

- **Arquivos e Conteúdo:** `extractSensitivityLabels` tem escopo e controles
  aprovados; o Simulator serve o POST com fixture sintética. O coletor real
  continua sujeito aos controles explícitos de escopo e atualização de metadado.
- **Configurações e Segurança:** sensibilidade aplicada por item reutiliza esse
  POST sintético; a operação real continua controlada pelo mesmo escopo.

## Ausências de bloqueio

- Não há fato classificado como `source_required` na matriz de reconciliação
  frontend vigente, nem decisão de produto pendente que bloqueie fixture ou UI
  nesta etapa.
- Todas as oito superfícies estão `frontend_done`; por isso o handoff do módulo
  está `backend_ready`. A cobertura técnica posterior está registrada
  separadamente em [`backend-coverage-review.md`](backend-coverage-review.md)
  e não altera os estados `frontend_done`.

## Limites

Este relatório trata da cobertura de frontend e não implementa collector,
persistência, backend, polling ou consumo de provider pela tela. O discovery
técnico de backend e suas pendências estão no relatório linkado acima. A fonte
Management Activity API já foi aprovada para um futuro collector; a chamada
`start` permanece uma operação provider-feed-control, não executada durante a
validação GET.
