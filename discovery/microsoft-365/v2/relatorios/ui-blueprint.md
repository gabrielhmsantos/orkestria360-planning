# UI Blueprint — Microsoft 365 / Relatórios

## Fontes consultadas

- Discovery deste diretório: `README.md`, expectativas, contratos e decisões das oito superfícies.
- Referência visual do sponsor: `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Relatórios/01` a `08` e `Microsoft365_Relatórios.docx`.
- Catálogo Storybook ativo, revalidado em 2026-09-05; os componentes e props abaixo são somente os documentados pelo MCP.

## Estado do Storybook MCP

O catálogo está disponível. Foram verificados `PageScaffold`, `ModuleHero`, `ModuleTabBar`, `OperationalMetricGrid`, `OperationalKpiCard`, `OperationalSectionCard`, `OperationalFilterBar`, `OperationalTable`, `InlineDetailPanel`, `ProcessProgress`, `DataAvailabilityPanel` e `ChartPanel` (line/bar/donut). Não há recomendação de prop não documentada.

Previews revalidados: [shell](http://localhost:6006/?path=/story/operational-pagescaffold--em-contexto), [hero](http://localhost:6006/?path=/story/operational-modulehero--em-contexto), [abas](http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto), [grade KPI](http://localhost:6006/?path=/story/operational-operationalmetricgrid--em-contexto), [fração](http://localhost:6006/?path=/story/operational-operationalkpicard--fraction), [score radial](http://localhost:6006/?path=/story/operational-operationalkpicard--radial-score), [indisponível](http://localhost:6006/?path=/story/operational-dataavailabilitypanel--unavailable), [restrito](http://localhost:6006/?path=/story/operational-dataavailabilitypanel--restricted), [em breve](http://localhost:6006/?path=/story/operational-dataavailabilitypanel--coming-soon), [linha](http://localhost:6006/?path=/story/charts-line--two-series), [donut](http://localhost:6006/?path=/story/charts-donut--side-table), [tabela](http://localhost:6006/?path=/story/operational-operationaltable--em-contexto), [detalhe](http://localhost:6006/?path=/story/operational-inlinedetailpanel--em-contexto), [filtros](http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto), [processo](http://localhost:6006/?path=/story/operational-processprogress--em-contexto), [timeline](http://localhost:6006/?path=/story/operational-operationaltimeline--em-contexto), [select](http://localhost:6006/?path=/story/ui-select--default) e [checkbox desabilitado](http://localhost:6006/?path=/story/ui-checkbox--disabled).

## Convenções globais de composição

- Shell: `PageScaffold` recebe `hero` e conteúdo; `ModuleHero` usa `category`, `title`, `subtitle`, `update` e `action` somente quando publicados. `ModuleTabBar` recebe as oito abas e `activeKey`.
- O Hero é exclusivo do módulo: título `Relatórios` e subtítulo aprovado do Dashboard. Não há H1 ou título que repita o nome da subaba no conteúdo; títulos internos nomeiam somente regiões, como `Controles/evidências`.
- O canvas é a única rolagem vertical. Tabelas usam `OperationalTable` com `scrollHint`/`scrollLabel` em colunas extensas; o `InlineDetailPanel` fica adjacente no desktop e abaixo no tablet/mobile.
- A tela nunca representa dado ausente por zero ou série fictícia. `DataAvailabilityPanel` usa `state` (`unavailable`, `restricted`, `coming_soon`), `reason` e o `visual` correspondente; origem, cobertura, frescor e status técnico não são props nem conteúdo visível.
- KPIs usam `OperationalKpiCard` somente para dado publicado. `icon` é uma `LucideIcon` verificada na story `With Icon`; `variant="score"`, `qualifier`, `variation` e `progress` só aparecem se sua regra/fonte estiver disponível; não há score proprietário ilustrativo.
- As props de grid (`columns`, `midColumns`) pertencem a `OperationalMetricGrid`; spans de 12 colunas neste documento descrevem composição da página, não props de componentes.

## Ampliação formal da composição

**Decisão confirmada:** as regiões presentes nas referências visuais do sponsor para Executivos, Operacionais, Segurança e Agendamentos passam a integrar a composição das oito telas. Esta ampliação é visual: não autoriza coleta, persistência, ação, filtro ou dado novo.

- Cada região nova ocupa sua posição desde a primeira entrega. Sem contrato factual publicado, é uma instância inteira de `DataAvailabilityPanel`, com `state`, `reason` humano e `visual` coerente (`gauge`, `line`, `bars` ou `donut`). Ela não é removida nem convertida em KPI, gráfico ou tabela vazia.
- `coming_soon` é reservado para capacidade futura deliberada (agendamento, canal ou fluxo); `unavailable`/`restricted` representam ausência ou limitação de dado de uma região já prevista.
- `OperationalKpiCard` fica diretamente dentro de `OperationalMetricGrid`; `OperationalSectionCard` não envolve KPIs para simular um segundo card. `ChartPanel` só recebe `data` e `lineSeries`/`barSeries` publicados e comparáveis.
- Tabela sem publicação usa `DataAvailabilityPanel`. `OperationalTable` com linha vazia somente representa consulta válida cujo resultado factual é vazio.
- O canvas mantém uma única rolagem vertical. Em tablet/mobile, faixas empilham sem omitir regiões; tabela pode rolar horizontalmente com `scrollHint` e `scrollLabel`.

| Superfície ampliada | Regiões que deixam de ser omitidas | Estado inicial sem fato |
| --- | --- | --- |
| Executivos | seis KPIs, insights, ranking, ações e benefícios | `DataAvailabilityPanel` em cada KPI/região; ações somente `coming_soon` quando não forem funcionais |
| Operacionais | seis KPIs, atividade por serviço, armazenamento, tendência, top usuários, conformidade e apoios | `DataAvailabilityPanel` individual, sem telemetria sintética |
| Segurança | MFA, risco, incidentes, vulnerabilidades, DLP, auditoria, exposição, recomendações e compliance | `DataAvailabilityPanel` independente por fonte/região |
| Agendamentos | seis KPIs, próximas execuções, execuções recentes, distribuição e modelos | `DataAvailabilityPanel state="coming_soon"`, sem datas ou contagens fictícias |

### Convenção de ícones dos KPIs

Os ícones preservam a intenção dos cartões das referências do sponsor: são semânticos, ficam antes do valor e não codificam por si só severidade ou disponibilidade. Todos são exports confirmados de `lucide-react`; a prop `icon` do `OperationalKpiCard` foi verificada na story `operational-operationalkpicard--with-icon`. Quando o dado estiver `unavailable`, `restricted` ou `coming_soon`, trocar o KPI inteiro por `DataAvailabilityPanel` — não manter o ícone como se a métrica fosse válida.

| Grupo / título do KPI | Ícone Lucide | Aplicação e condição |
| --- | --- | --- |
| Microsoft 365 Health Score; evolução consolidada | `ChartNoAxesCombined` | IMDO está fora desta entrega e não há fonte canônica aprovada; painel `unavailable`, sem nota, meta ou variação. |
| Usuários totais | `Users` | Diretório local publicado. |
| Usuários ativos; contas conformes | `UserCheck` | Somente com período e cobertura da fonte de atividade. |
| Contas desabilitadas | `UserX` | Diretório local publicado; não usar para ausência de sinal. |
| Convidados e usuários externos | `UserRoundPlus` | Identidade/tipo publicados e autorização compatível. |
| Licenças contratadas, atribuídas, disponíveis, ociosas; análise por SKU | `BadgeDollarSign` | Fato técnico de licenciamento publicado. Economia anual estimada usa `economia mensal estimada × 12` somente após publicação do Assessment; como ele está fora desta entrega, fica `unavailable`. |
| Secure Score; postura de segurança disponível | `ShieldCheck` | Score oficial/fonte disponível; não representa certificação. |
| Usuários sem MFA; usuários/dispositivos em risco; vulnerabilidades; políticas ausentes | `ShieldAlert` | Apenas evidência publicada pela fonte correspondente. |
| Cobertura e métodos MFA | `KeyRound` | Fonte MFA disponível e com cobertura declarada. |
| Dispositivos gerenciados ou conformes | `MonitorSmartphone` | Intune/Defender somente quando o customer tiver fonte autorizada; caso contrário, `restricted`/`unavailable`. |
| Incidentes, alertas e falhas críticas | `Siren` | Fonte de incidentes/health publicada; não inferir zero em restrição. |
| Vulnerabilidades e CVEs | `Bug` | Defender ou fonte especializada publicada. |
| Usuários ativos, adoção de serviços e produtividade | `Activity` | Reports/snapshot local com período e frescor. Taxa de adoção usa `Office 365 Active` e o agregado imutável de população elegível da mesma geração publicada; sem vínculo inequívoco, cobertura ou denominador válido, `unavailable`. |
| Reuniões, chamadas e mensagens | `MessagesSquare` | Fonte Teams/Exchange publicada; não pressupõe Call Records. |
| Armazenamento e capacidade | `HardDrive` | Uso publicado por workload; sem tendência se não houver snapshots comparáveis. |
| Grupos sem proprietário, exceções e governança | `Scale` | Regra explicável e fonte local publicada. |
| Grupos/equipes sem responsável | `UsersRound` | Projeção local de grupos/Teams, sem inferir responsável ausente quando a fonte é parcial. |
| Drift e alterações de configuração | `SlidersHorizontal` | Publicação de Configurações com comparabilidade declarada. |
| Serviços saudáveis, incidentes e disponibilidade | `HeartPulse` | Service health separado, com `ServiceHealth.Read.All` e estado publicado. |
| Relatórios gerados/concluídos/falhos e recentes | `FileText` | Apenas depois de existir `ReportRequest`/`ReportArtifact` local. |
| Agendamentos e próxima execução | `CalendarClock` | `coming_soon` até implementação de processo recorrente. |
| Tempo de geração, entrega e última execução | `Clock3` | Dado de processo publicado, nunca valor demonstrativo; V1 não possui expiração de arquivo persistido. |
| Auditoria, controles avaliados e metodologia | `ClipboardCheck` | Evidência e limitações visíveis; não comunica certificação. |
| Integridade de artefato/manifesta | `Fingerprint` | Somente após hash/manifesta imutável aprovado; não exibir “100%” sem método. |
| Retry/falha transitória de geração | `TimerReset` | Futuro estado de processo; não implica reexecução automática em V1. |

## 01. Dashboard Executivo

### Inventário visual

| Ordem | Região | Necessidade visual | Prioridade |
| --- | --- | --- | --- |
| 1 | Síntese de postura | hero, score e KPIs | dominante |
| 2 | Evolução e adoção | séries e distribuição somente quando comparáveis | média |
| 3 | Riscos e oportunidades | ranking explicável e lista contextual | dominante |
| 4 | Relatórios recentes e agenda | tabelas curtas com estado | média |

### Grade e proporções

- **Desktop:** 12 colunas; faixa 1 `5/7`, faixa 2 `7/5`, faixa 3 `7/5`, faixa 4 `6/6`.
- **Tablet:** score/KPIs em duas faixas; regiões dominantes antes das auxiliares.
- **Mobile:** uma coluna; gráficos e tabelas preservam resumo acessível; sem remover estado/limitação humana.
- **Rolagem e prioridade:** canvas único; riscos e metodologia precedem agenda.

| Região | Classificação | Componente/composição | API verificada | Preview |
| --- | --- | --- | --- | --- |
| Hero e abas | Reuso direto | `PageScaffold` + `ModuleHero` + `ModuleTabBar` | `hero`, `children`, `category`, `title`, `subtitle`, `update`, `action`, `tabs`, `activeKey` | shell/hero/abas acima |
| KPIs publicados | Reuso direto | `OperationalMetricGrid` + `OperationalKpiCard` | `columns`, `midColumns`, `label`, `value`, `context`, `variation`, `progress`, `icon` | KPI indisponível acima |
| Score/linha sem base | Reuso direto | `DataAvailabilityPanel` | `state`, `reason`, `visual="gauge"`/`"line"` | restrito/linha vazia acima |
| Riscos e oportunidades | Composição local | `OperationalSectionCard` + tabela/lista local | `title`, `icon`, `action`, `children` | tabela acima |
| Agenda e recentes | Reuso direto | `OperationalTable variant="embedded"` | `caption`, `head`, `pagination`, `scrollHint`, `scrollLabel`, `variant` | tabela acima |

### Especificação de instâncias

| Região | Instância e variante | Anatomia/estados | Alternativa rejeitada |
| --- | --- | --- | --- |
| Postura | KPI padrão com `ChartNoAxesCombined` ou `DataAvailabilityPanel` | rótulo, valor/estado, período e cobertura; como IMDO está fora desta entrega e não há fonte aprovada, painel `unavailable` em vez de score | gauge com número ilustrativo |
| Evolução | `ChartPanel type="line"` | `data`, `height`, `lineSeries` somente com snapshots comparáveis; sem série, estado indisponível | linha zerada |
| Riscos | `OperationalSectionCard` | condição, período e recomendação de investigação; sem dado, painel | badge sem evidência |
| Agenda | `OperationalTable embedded` | relatório, período e situação humana; agendamento ainda `coming_soon` | marcar “ativo” por referência visual |

### Divergências e disponibilidade

O Health Score, economia e evolução anual presentes na referência não entram até publicação comprovada. O módulo preserva a intenção de síntese, mas usa estados explícitos por bloco.

## 02. Catálogo de Relatórios

### Grade e proporções

- **Desktop:** 12 colunas: filtros em faixa própria; catálogo `8` e detalhe/requisitos `4`.
- **Tablet:** filtros em duas colunas; catálogo antes do detalhe. **Mobile:** filtros empilhados e cartões/tabela em uma coluna.
- **Rolagem e prioridade:** catálogo é dominante; detalhe aparece no fluxo.

| Região | Classificação | Componente/composição | API verificada | Preview |
| --- | --- | --- | --- | --- |
| Hero/abas | Reuso direto | shell global | mesmas APIs globais | hero/abas |
| Filtros | Reuso direto | `OperationalFilterBar` | `children`, `ariaLabel`, `columns` | filtros |
| Templates | Reuso direto | `OperationalTable` | `caption`, `head`, `children`, `pagination`, `variant` | tabela |
| Requisitos | Reuso direto | `InlineDetailPanel` ou `DataAvailabilityPanel` | `title`, `subtitle`, `action`, `ariaLive`; estados/razão/visual | restrito |

### Especificação de instâncias

- A tabela mostra nome, público, período, formato, disponibilidade e requisito `required`/`degradable`; “Gerar relatório” só é ação de template habilitado. Restrito/indisponível em `required` abre detalhe de requisitos e bloqueia; `degradable` só pode seguir quando o template declarar saída parcial, não erro tardio.
- `InlineDetailPanel` mantém requisitos no fluxo com `ariaLive="polite"`; mobile o coloca após a tabela. `Card` genérico é rejeitado porque não preserva a consulta tabular e seus estados.

## 03. Relatórios Executivos

### Inventário visual

| Ordem | Região | Necessidade visual | Prioridade |
| --- | --- | --- | --- |
| 1 | Faixa de seis KPIs | síntese executiva completa, sem ocultar métrica ausente | dominante |
| 2 | Relatórios executivos | consulta principal e metodologia contextual | dominante |
| 3 | Insights, ranking e ações | apoio decisório; nunca aparenta ação operacional sem fluxo | média |
| 4 | Benefícios e progresso | conteúdo explicativo e capacidades futuras | média |

### Grade e proporções

- **Desktop:** faixa de KPIs em seis colunas; relatórios `7` + metodologia `5`; insights `6` + ranking `6`; ações `6` + benefícios/progresso `6`.
- **Tablet:** KPIs em três colunas e as faixas `7/5` e `6/6` passam a duas linhas, preservando a região dominante primeiro.
- **Mobile:** uma coluna: KPIs, consulta, metodologia, insights, ranking, ações e benefícios/progresso. Nenhuma região é removida.
- **Rolagem e prioridade:** canvas único; não há título de subaba entre as abas e a faixa de KPIs.

| Região | Classificação | Componente/composição | API verificada | Preview |
| --- | --- | --- | --- | --- |
| Lista de templates | Reuso direto | `OperationalTable embedded` | tabela/paginação/scroll | tabela |
| Metodologia/fontes | Composição local | `OperationalSectionCard` | título, ação opcional, children | tabela |
| Progresso futuro | Reuso direto | `ProcessProgress` | `steps`, `progress`, `unavailableMessage`, `ariaLabel` | processo |
| Formato não aprovado | Reuso direto | `DataAvailabilityPanel state="coming_soon"` | reason/visual | restrito |
| Faixa de KPIs | Reuso direto | `OperationalMetricGrid` + `OperationalKpiCard` / `DataAvailabilityPanel` | `columns`, `midColumns`, `label`, `value`, `icon`, `variant`, `fraction`, `radialScore`, `state`, `reason`, `visual` | grade KPI/fração/score radial/indisponível |
| Insights/ranking/benefícios | Composição local | `OperationalSectionCard` + lista factual ou `DataAvailabilityPanel` | `title`, `icon`, `children`, `state`, `reason`, `visual` | tabela/indisponível |
| Ações rápidas | Composição local | `OperationalSectionCard` + `Button` somente para ação funcional; caso contrário `DataAvailabilityPanel` | `title`, `action`, `children`, `variant`, `state`, `reason` | tabela/em breve |

### Divergências e disponibilidade

Os seis slots são: Health Score, Secure Score, Usuários ativos, Licenças atribuídas, Economia estimada e Incidentes. Apenas KPI publicado usa `OperationalKpiCard`: Secure Score usa `variant="fraction"` e os demais só usam `radialScore`, `fraction`, `sparkline`, `variation` ou `progress` quando o respectivo contrato publicar esses valores. Sem fato, cada slot usa `DataAvailabilityPanel`; não há série sintética. Insights, ranking, ações e benefícios também permanecem presentes e indisponíveis quando não houver conteúdo factual. PPTX/PDF e texto por IA permanecem capacidades futuras.

## 04. Relatórios Operacionais

### Inventário visual

| Ordem | Região | Necessidade visual | Prioridade |
| --- | --- | --- | --- |
| 1 | Faixa de seis KPIs | síntese operacional da referência | dominante |
| 2 | Atividade por serviço, armazenamento e conformidade | leitura comparativa por visualização | média |
| 3 | Atividade recente, tendência e top usuários | análise operacional; não expõe PII | dominante |
| 4 | Consulta de solicitações e detalhe | fluxo factual existente | dominante |
| 5 | Relacionados, exportações, agenda e insights | apoios sem simular operação | média |

### Grade e proporções

- **Desktop:** KPIs em seis colunas; atividade por serviço `7` + armazenamento `5`; tendência `7` + conformidade `5`; atividade recente `7` + top usuários `5`; filtros `12`; tabela `8` + detalhe `4`; apoios em `4/4/4`; metodologia `12`.
- **Tablet:** KPIs em três colunas; pares `7/5` ficam em sequência; tabela antes do detalhe.
- **Mobile:** uma coluna; tabela preserva campos materiais por rolagem horizontal sinalizada, sem canvas aninhado.
- **Rolagem e prioridade:** a leitura de telemetria precede a consulta; ausência de publicação não remove nenhuma faixa.

| Região | Classificação | Componente/composição | API verificada | Preview |
| --- | --- | --- | --- | --- |
| Filtros | Reuso direto | `OperationalFilterBar` | children/columns/ariaLabel | filtros |
| Consulta | Reuso direto | `OperationalTable standalone` | caption, pagination, scrollHint, scrollLabel | tabela |
| Detalhe restrito | Reuso direto | `InlineDetailPanel` + `DataAvailabilityPanel` | ariaLive; state/reason | restrito |
| Metodologia | Composição local | `OperationalSectionCard` | title/children | tabela |
| KPIs/visuais sem contrato | Reuso direto | `OperationalMetricGrid` + `DataAvailabilityPanel` | `columns`, `midColumns`, `title`, `reason`, `state`, `visual="bars"`/`"donut"`/`"line"` | grade KPI/indisponível |
| Atividade por serviço | Reuso direto | `ChartPanel type="bar"` ou `DataAvailabilityPanel` | `data`, `barSeries`, `barOrientation`; `state`, `reason`, `visual="bars"` | linha/indisponível |
| Tendência/top usuários/apoios | Composição local | `ChartPanel type="line"` / `OperationalTable` / `OperationalSectionCard`, cada qual com fallback próprio | APIs de gráfico/tabela/seção; `state`, `reason`, `visual` | linha/tabela/indisponível |

### Especificação de instâncias

Filtros preservam o mesmo escopo na tabela, detalhe, preflight e exportação CSV/XLSX efêmera da solicitação aceita. A exportação usa o manifesto congelado, a mesma autorização e o mesmo tratamento de PII, sem ampliar granularidade/sensibilidade ou oferecer download posterior. PII/IP/JSON bruto usa `restricted` ou campos mascarados; um estado vazio somente ocorre após consulta local válida. `Sheet` é rejeitado como fluxo padrão por criar contexto paralelo.

As seis posições de KPI, atividade por serviço, armazenamento, tendência, top usuários, conformidade e os quatro apoios são regiões explícitas. Enquanto não houver contrato publicado, cada uma recebe `DataAvailabilityPanel`, sem número, percentual, série ou lista fictícia. A consulta existente continua factual: `Detalhe restrito` só é usado em indisponibilidade real; uma solicitação válida abre `InlineDetailPanel` com título humano.

## 05. Relatórios de Segurança e Compliance

### Inventário visual

| Ordem | Região | Necessidade visual | Prioridade |
| --- | --- | --- | --- |
| 1 | Faixa de seis KPIs | postura e riscos independentes por região | dominante |
| 2 | Controles/evidências e distribuição | consulta factual e distribuição completa | dominante |
| 3 | Incidentes, auditoria e exposição | investigação de segurança sem consolidar fontes | média |
| 4 | Recomendações e compliance | orientação e escopo factual | média |

### Grade e proporções

- **Desktop:** KPIs `xl:grid-cols-6`; evidências e controles `7/5`; metodologia e limitações `12`.
- **Desktop ampliado:** incidentes/auditoria `7/5`; exposição `7` + recomendações `5`; resumo de compliance e limitações `12`.
- **Tablet/mobile:** evidências antes de recomendações; donut lateral vira empilhado quando não houver largura; todas as regiões seguem em fluxo único.
- **Rolagem e prioridade:** controles são dominantes; uma indisponibilidade local não afeta os demais KPIs ou a tabela publicada.

| Região | Classificação | Componente/composição | API verificada | Preview |
| --- | --- | --- | --- | --- |
| Postura por fonte | KPI ou disponibilidade | `OperationalMetricGrid` + `OperationalKpiCard` / `DataAvailabilityPanel` | APIs globais | KPI/indisponível |
| Controles/evidências | Reuso direto | `OperationalTable embedded` | table APIs | tabela |
| Distribuição | Reuso direto | `ChartPanel type="donut"` | `data`, `height`, `donutLegendLayout`, `donutLegendVariant`, `variant` | donut indisponível |
| Limitações | Composição local | `OperationalSectionCard` | title/children | tabela |
| MFA, risco, incidentes, vulnerabilidades e DLP | Reuso direto | `OperationalMetricGrid` com `OperationalKpiCard` ou `DataAvailabilityPanel` por slot | `columns`, `midColumns`, `label`, `value`, `icon`, `state`, `reason`, `visual` | grade KPI/indisponível |
| Incidentes/auditoria e exposição | Composição local | `OperationalSectionCard` + `OperationalTable`/`ChartPanel`, ou painel por região | APIs de seção/tabela/gráfico; `state`, `reason`, `visual="bars"`/`"donut"` | tabela/donut/indisponível |
| Recomendações/compliance | Composição local | `OperationalSectionCard` + lista factual, ou painel por região | `title`, `icon`, `children`, `state`, `reason`, `visual` | tabela/indisponível |

### Divergências e disponibilidade

Os seis slots são Secure Score, MFA, usuários de risco, incidentes, vulnerabilidades críticas e DLP. Secure Score disponível usa somente `OperationalKpiCard variant="fraction"`, com numerador/denominador factuais da mesma publicação; indisponível/restrito substitui a região inteira por `DataAvailabilityPanel`. Os demais cinco slots, incidentes/auditoria, exposição, recomendações e compliance permanecem presentes e recebem painel independente até terem contrato factual. Os selos “LGPD/ISO adequado” tornam-se “controles com evidência disponível” e preservam escopo/limitação; não há selo verde, zero ou agregação de fontes distintas.

## 06. Construtor de Relatórios

### Grade e proporções

- **Desktop:** processo `12`; seleção/filtros `4/4/4`; prévia/metodologia `8/4`.
- **Tablet:** duas colunas. **Mobile:** etapas e controles empilhados; sem canvas/preview aninhado.

| Região | Classificação | Componente/composição | API verificada | Preview |
| --- | --- | --- | --- | --- |
| Etapas | Reuso direto | `ProcessProgress` | `steps`, `progress`, `unavailableMessage`, `ariaLabel`; etapas permitidas: configurar, validar, prévia, gerar | processo |
| Filtros e seleção | Composição local | `OperationalFilterBar` + `Select`/`Checkbox`/`Label` | `children`, `columns`, `ariaLabel`; `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`; `Checkbox disabled` | filtros/select/checkbox desabilitado |
| Prévia | Composição local | `OperationalSectionCard` | `title`/`children`; mostra template, período, blocos, parcialidade e estado da solicitação | tabela |
| Ação indisponível | Reuso direto | `DataAvailabilityPanel coming_soon` | `state`, `reason`, `visual`; para compartilhar, agendar ou recurso fora do template | restrito |

### Divergências e disponibilidade

O Construtor guiado da primeira release habilita somente template, bloco, período e filtros allowlisted, seguidos por preflight, criação de manifesto, prévia e geração local. O preflight usa estados internos atuais; a prévia e a geração usam a fotografia congelada no manifesto. A prévia mostra template, período, blocos, parcialidade e situação da solicitação, sem origem/cobertura/frescor técnico. Compartilhar, salvar template livre, fórmulas arbitrárias e agendamento continuam `coming_soon`; não há canvas livre, fonte ao vivo, ampliação de PII ou fallback de tenant/conexão.

Cada requisito indisponível, restrito ou futuro de um bloco aparece no próprio contexto de seleção como `DataAvailabilityPanel`, com razão humana; o painel agregado não substitui a leitura por bloco. `Select` e `Checkbox` são controles do design system, agrupados semanticamente com `Label` e `fieldset`/`legend`; controles desabilitados preservam o motivo publicado. Não há título `Construtor de Relatórios` repetido no conteúdo.

## 07. Agendamentos e Distribuição

### Inventário visual

| Ordem | Região | Necessidade visual | Prioridade |
| --- | --- | --- | --- |
| 1 | Faixa de seis KPIs | capacidade futura explicitamente declarada | dominante |
| 2 | Próximas execuções e processo | planejamento sem simular agenda existente | dominante |
| 3 | Execuções recentes, distribuição e modelos | apoio operacional futuro | média |
| 4 | Canal, segurança e retenção | limitação declarada | média |

### Grade e proporções

- **Desktop:** KPIs em seis colunas; próximas execuções `8` + detalhe/processo `4`; execuções recentes `4` + distribuição `4` + modelos `4`; segurança/retenção `12`.
- **Tablet:** KPIs em três colunas; `8/4` fica em sequência e a faixa `4/4/4` vira duas linhas.
- **Mobile:** uma coluna, preservando todas as regiões e o processo após a lista.
- **Rolagem e prioridade:** canvas único; até existir workflow persistido a tela comunica capacidade futura, não uma agenda vazia.

| Região | Classificação | Componente/composição | API verificada | Preview |
| --- | --- | --- | --- | --- |
| Estado de recorrência | Reuso direto | `ProcessProgress` | steps/progress/unavailableMessage | processo |
| Lista | Reuso direto | `OperationalTable` | caption/pagination/scroll | tabela |
| Canal não habilitado | Reuso direto | `DataAvailabilityPanel coming_soon` | state/reason/visual | restrito |
| Segurança/retenção | Composição local | `OperationalSectionCard` | title/action/children | tabela |
| KPIs/próximas execuções | Reuso direto | `OperationalMetricGrid` / `DataAvailabilityPanel` + `ProcessProgress` | `columns`, `midColumns`, `state`, `reason`, `visual`, `steps`, `progress`, `unavailableMessage` | grade KPI/em breve/processo |
| Execuções, distribuição e modelos | Composição local | `OperationalTable`/`ChartPanel`/`OperationalSectionCard`, cada qual com painel próprio | APIs de tabela/gráfico/seção; `state`, `reason`, `visual` | tabela/donut/em breve |

### Divergências e disponibilidade

Os seis slots são agendamentos ativos, execuções no mês, relatórios enviados, falhas, próximas execuções e downloads. Eles, a lista, o processo, execuções recentes, distribuição e modelos iniciam como `DataAvailabilityPanel state="coming_soon"`; não possuem valor, data, destinatário ou ação. `OperationalTable`, `ChartPanel` e `OperationalTimeline` só substituem o painel quando houver fatos persistidos e publicados. Nenhum item aparece “Ativo” até existir agendamento publicado.

## 08. Histórico e Auditoria

### Grade e proporções

- **Desktop:** KPIs `xl:grid-cols-6`; filtros `12`; tabela `8` + detalhe `4`; linha do tempo/metodologia `12`.
- **Tablet/mobile:** detalhe segue abaixo da tabela; campos sensíveis preservam estado restrito.

| Região | Classificação | Componente/composição | API verificada | Preview |
| --- | --- | --- | --- | --- |
| KPIs | Reuso direto | grid + KPI / disponibilidade | APIs globais | KPI/indisponível |
| Filtros/tabela | Reuso direto | `OperationalFilterBar` + `OperationalTable` | APIs de filtros/tabela | filtros/tabela |
| Detalhe | Reuso direto | `InlineDetailPanel` | title/subtitle/action/ariaLive | tabela |
| Evento sem evidência | Reuso direto | `DataAvailabilityPanel` | state/reason/visual | restrito |

### Divergências e disponibilidade

“Integridade 100%” não aparece sem hash/manifesta publicado. O arquivo V1 é efêmero: o histórico mostra somente formato, tamanho, hash, resultado e instante, sem URL ou download posterior. Logs técnicos são sanitizados; JSON externo não é uma região visual aprovada.

## Lacunas e decisões de componentes

Não há componente novo justificado. `OperationalSectionCard` permite composições locais para metodologia, prévia e segurança de distribuição; tabelas, processo e disponibilidade já cobrem as anatomias recorrentes. O Construtor guiado usa componentes existentes; builder livre e agendamento continuam fora do recorte.

## Matriz consolidada de componentes

| Superfície | Região | Classificação | Componente | ID da story | Preview |
| --- | --- | --- | --- | --- | --- |
| Todas | Shell | Reuso direto | PageScaffold / ModuleHero / ModuleTabBar | `operational-*-em-contexto` | links globais |
| Dashboard/Segurança/Histórico | estado de fonte | Reuso direto | DataAvailabilityPanel | `operational-dataavailabilitypanel--restricted` | link global |
| Catálogo/Operacionais/Histórico | consulta | Reuso direto | OperationalFilterBar / OperationalTable | `operational-operationalfilterbar--em-contexto`, `operational-operationaltable--em-contexto` | links globais |
| Executivos/Construtor/Agenda | workflow | Reuso direto | ProcessProgress | `operational-processprogress--em-contexto` | link global |
| Dashboard/Segurança | visualização | Reuso direto | ChartPanel | `charts-line--empty`, `charts-donut--unavailable` | links globais |
| Executivos/Operacionais/Segurança/Agendamentos | regiões ampliadas sem fato | Reuso direto | DataAvailabilityPanel | `operational-dataavailabilitypanel--unavailable`, `--restricted`, `--coming-soon` | previews globais |
| Executivos/Operacionais/Segurança/Agendamentos | KPIs publicados | Reuso direto | OperationalMetricGrid / OperationalKpiCard | `operational-operationalmetricgrid--em-contexto`, `operational-operationalkpicard--fraction`, `--radial-score` | previews globais |
| Operacionais/Segurança/Agendamentos | gráfico factual | Reuso direto | ChartPanel line/bar/donut | `charts-line--two-series`, `charts-bar--horizontal`, `charts-donut--side-table` | previews globais |
| Construtor | seleção allowlisted | Composição local | OperationalFilterBar + Select + Checkbox + Label | `operational-operationalfilterbar--em-contexto`, `ui-select--default`, `ui-checkbox--disabled` | previews globais |

## Checklist de handoff para implementação

- As oito superfícies possuem regiões, grade, responsividade, prioridade e estados documentados.
- Toda API/variante nomeada foi verificada no Storybook MCP e tem preview citado.
- A ampliação de Executivos, Operacionais, Segurança e Agendamentos materializa todas as regiões da referência sem antecipar coleta, workflow ou dado; cada ausência usa `DataAvailabilityPanel`.
- Health Score, finanças, compliance completo, builder livre e distribuição não viram dados inventados; fatos publicados são condição para substituir o estado de disponibilidade.
- Hero único e `ModuleTabBar` cobrem as oito superfícies; nenhuma subaba repete seu título no conteúdo.
- A futura Spec precisa formalizar o primeiro conjunto de templates/blocos, seus requisitos concretos e contratos físicos do Construtor guiado; lifecycle de manifesto e arquivo efêmero já está decidido.
