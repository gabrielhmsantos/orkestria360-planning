# OneDrive UI — Frontend Completion Plan

## Propósito

Este documento organiza a conclusão e homologação do frontend do módulo Microsoft 365 — OneDrive após:

1. a primeira implementação das oito superfícies;
2. as revisões posteriores contra as expectativas do sponsor;
3. as rodadas de reconciliação das lacunas identificadas;
4. a consolidação das fixtures runtime;
5. a reconciliação final do UI Blueprint.

A implementação base já existe e já segue os padrões gerais do projeto.

Esta etapa **não é uma nova implementação da feature**, nem uma nova rodada de discovery.

O trabalho agora consiste em alinhar a implementação existente aos contratos mais recentes de cobertura e UI definidos principalmente por:

- `discovery/microsoft-365/v2/onedrive/reconciliacao-de-lacunas.md`;
- `discovery/microsoft-365/v2/onedrive/frontend-coverage-review.md`;
- `discovery/microsoft-365/v2/onedrive/ui-blueprint.md`.

Esses três documentos representam o estado reconciliado que esta execução deve materializar.

O objetivo é conduzir cada superfície, **uma por vez e na ordem definida neste documento**, de `frontend_implementation_ready` para `frontend_done`.

---

# Autoridade dos artefatos

## Fontes principais

Para esta execução, as fontes principais e autoritativas são:

### 1. Reconciliação de lacunas

`discovery/microsoft-365/v2/onedrive/reconciliacao-de-lacunas.md`

Define:

- quais blocos precisam existir;
- quais fatos podem ser apresentados;
- regras de interpretação;
- limites factuais;
- unidades, períodos e agregações relevantes;
- prontidão de cada bloco para frontend;
- restrições que impedem inferências incorretas.

É a principal referência para responder:

> O que precisa estar representado e qual é a semântica correta desse dado?

### 2. Frontend coverage review

`discovery/microsoft-365/v2/onedrive/frontend-coverage-review.md`

Define:

- situação consolidada de cada superfície;
- quais superfícies estão `frontend_implementation_ready`;
- quais blocos sustentam essa classificação;
- quando uma superfície pode ser considerada `frontend_done`;
- situação do handoff do módulo.

É a principal referência para responder:

> O que ainda falta concluir e quando podemos considerar a superfície entregue?

### 3. UI Blueprint

`discovery/microsoft-365/v2/onedrive/ui-blueprint.md`

Define:

- regiões visuais;
- IDs;
- composição;
- hierarquia;
- componentes;
- copy;
- bindings;
- estados;
- interações;
- responsividade;
- acessibilidade;
- tratamento visual de availability;
- relação com as referências do sponsor.

É a principal referência para responder:

> Como o fato reconciliado deve aparecer e se comportar na interface?

---

# Fontes de apoio

Os seguintes artefatos devem ser consultados quando forem necessários para compreender ou validar uma decisão específica:

- contratos específicos da superfície;
- decisões de produto/design da superfície;
- `discovery/microsoft-365/v2/onedrive/fontes-e-rastreabilidade.md`;
- `discovery/microsoft-365/v2/onedrive/expectativas-do-sponsor.md`;
- fixtures runtime em `orkestria360/resources/js/data/modules/onedrive/fixtures/`;
- tipos runtime do módulo OneDrive;
- implementação atual;
- Storybook e documentação dos componentes compartilhados;
- imagens `01` a `08` do sponsor.

Os artefatos em:

`specs/014-onedrive-ui/`

não precisam ser relidos integralmente como pré-condição desta execução.

Eles devem ser consultados apenas quando necessário, por exemplo para:

- recuperar uma regra transversal não reproduzida nos artefatos reconciliados;
- entender uma decisão arquitetural ainda relevante;
- confirmar comportamento originalmente aprovado que continua válido;
- resolver uma ambiguidade que os artefatos principais não resolvem.

A spec original não deve prevalecer sobre uma decisão posterior explicitamente reconciliada em:

- `reconciliacao-de-lacunas.md`;
- `frontend-coverage-review.md`;
- `ui-blueprint.md`.

---

# Precedência

Quando houver aparente divergência, use esta ordem de precedência:

1. decisões reconciliadas vigentes de produto/contrato;
2. `reconciliacao-de-lacunas.md`;
3. `frontend-coverage-review.md`;
4. `ui-blueprint.md`;
5. contratos e decisões específicos atualizados da superfície;
6. fixtures runtime;
7. imagens e documentação do sponsor;
8. artefatos originais da spec;
9. implementação atual.

A implementação existente nunca é autoridade para reduzir uma decisão reconciliada.

A spec original nunca deve ser usada para desfazer uma decisão que foi explicitamente amadurecida posteriormente pelo processo de reconciliação.

---

# Papel da implementação atual

A implementação existente deve ser tratada como a base sobre a qual esta etapa trabalha.

Antes de alterar uma superfície:

- inspecione o que já existe;
- identifique o que já está correto;
- preserve o que já atende os artefatos reconciliados;
- altere somente o necessário para fechar as lacunas reais.

Não reimplemente uma superfície do zero quando sua estrutura existente já estiver correta.

O objetivo é **remediar diferenças**, não gerar churn.

---

# Papel das imagens do sponsor

As imagens do sponsor devem ser utilizadas para validar:

- cobertura visual;
- hierarquia;
- densidade;
- agrupamentos;
- sequência de leitura;
- intenção visual da superfície.

Elas não são fonte factual para:

- valores;
- nomes;
- pessoas;
- arquivos;
- tenants;
- status;
- risco;
- classificação;
- ações.

Quando a referência visual do sponsor e os artefatos reconciliados divergirem, os artefatos reconciliados prevalecem.

Uma divergência deliberada deve permanecer explicável.

---

# Limites da execução

Esta etapa pode:

- corrigir regiões existentes;
- adicionar regiões reconciliadas que ainda não estejam materializadas;
- conectar bindings já aprovados;
- reorganizar composição quando necessário;
- corrigir availability;
- corrigir filtros;
- corrigir paginação;
- corrigir detalhes/contextos;
- corrigir responsividade;
- corrigir acessibilidade;
- corrigir comportamento de foco;
- corrigir componentes compartilhados quando estritamente necessário;
- solicitar ajustes de fixture quando comprovadamente necessários.

Esta etapa não autoriza criar:

- collector;
- integração Microsoft Graph;
- integração com outro provider;
- persistência de domínio;
- migration;
- sincronização;
- polling;
- endpoint de dados;
- chamada externa diretamente pela UI;
- operação administrativa;
- mutação não aprovada para esta feature.

`mutation_approved` nos artefatos de discovery não autoriza tornar a UI mutável.

---

# Modelo de execução

## Execução sequencial

As superfícies devem ser tratadas nesta ordem:

1. Dashboard Executivo;
2. Contas e Armazenamento;
3. Arquivos e Conteúdo;
4. Compartilhamento e Acessos;
5. Atividade e Sincronização;
6. Usuários Desligados e Retenção;
7. Configurações e Segurança;
8. Histórico e Auditoria.

Uma superfície deve completar integralmente seu ciclo antes do início da seguinte.

Essa ordem cria uma única linha de execução e permite que decisões e correções transversais amadureçam progressivamente.

---

# Ciclo obrigatório de cada superfície

Cada superfície percorre cinco etapas.

## Etapa 1 — Análise e alinhamento

Antes de alterar código, o executor deve confrontar:

- implementação atual;
- blocos da superfície em `reconciliacao-de-lacunas.md`;
- estado da superfície em `frontend-coverage-review.md`;
- seção da superfície em `ui-blueprint.md`;
- fixture runtime;
- tipos relevantes;
- imagem correspondente do sponsor;
- componentes compartilhados já utilizados.

A análise deve identificar somente diferenças reais.

Para cada diferença relevante, determinar:

- o que existe atualmente;
- o que os artefatos reconciliados exigem;
- por que existe diferença;
- qual comportamento precisa mudar;
- como a correção será validada.

O executor também deve confirmar explicitamente quais partes da superfície já estão conformes e devem ser preservadas.

Não criar um novo discovery.

Não replanejar toda a feature.

Não assumir que toda a superfície precisa ser refeita.

---

## Etapa 2 — Aprovação do alinhamento

Antes de implementar mudanças, o alinhamento da superfície deve passar por duas revisões independentes:

- QA/UX/UI;
- Tech Lead.

### QA/UX/UI

Deve validar principalmente:

- cobertura dos blocos reconciliados;
- fidelidade ao UI Blueprint;
- expectativa do sponsor;
- hierarquia;
- composição;
- copy;
- estados;
- interações;
- responsividade;
- acessibilidade;
- comportamento observável.

### Tech Lead

Deve validar principalmente:

- interpretação dos contratos;
- bindings;
- tipos;
- availability;
- uso das fixtures;
- seam de dados;
- componentes compartilhados;
- fronteira frontend-only;
- impacto transversal;
- risco de regressão;
- necessidade real de alteração de fixture.

A implementação somente começa depois de ambos aprovarem o alinhamento.

Se houver achado material, o executor deve ajustar o alinhamento e reenviá-lo para a revisão afetada.

---

## Etapa 3 — Implementação

Após a aprovação, o executor realiza as alterações necessárias.

A implementação deve:

- preservar o que já está correto;
- corrigir a causa das diferenças;
- materializar todos os blocos reconciliados;
- preservar a semântica factual dos dados;
- respeitar os bindings definidos;
- preservar os estados de availability;
- respeitar a composição do blueprint;
- respeitar os limites frontend-only.

Não reduzir o contrato para acomodar o código atual.

Não remover uma região obrigatória para eliminar uma lacuna.

Não substituir ausência de informação por um valor aparentemente útil.

---

## Etapa 4 — Validação da superfície

Após implementar, o executor deve validar tecnicamente e no navegador a superfície corrente.

A validação deve cobrir:

- cenário principal;
- demais cenários existentes no catálogo da fixture;
- blocos alterados;
- regiões afetadas;
- filtros aplicáveis;
- paginação;
- detalhes/contextos;
- availability;
- nulabilidade;
- empty;
- teclado;
- foco;
- captions;
- gráficos;
- resumos acessíveis;
- viewport wide;
- viewport compact;
- responsividade;
- ausência de ações não autorizadas.

Falha encontrada nessa etapa faz parte do trabalho da superfície.

O executor deve corrigir e repetir os gates afetados.

---

## Etapa 5 — Homologação final da superfície

Depois da validação técnica, a superfície deve passar por validação visual independente.

Essa homologação confronta diretamente:

- `reconciliacao-de-lacunas.md`;
- `frontend-coverage-review.md`;
- `ui-blueprint.md`;
- comportamento real da implementação;
- fixture e seus cenários;
- imagem do sponsor.

A homologação deve responder:

> Todos os blocos reconciliados estão corretamente materializados e a superfície representa visualmente o que o sponsor espera, dentro dos limites dos contratos aprovados?

Se não, a superfície permanece em execução.

Uma rejeição devolve o trabalho ao executor.

Após correções:

1. repetir os gates afetados;
2. repetir a validação em navegador;
3. solicitar nova homologação visual independente.

---

# Regras transversais

## Availability

Preservar como estados semanticamente distintos:

- `available`;
- `partial`;
- `unavailable`;
- `restricted`;
- `stale`;
- `failed`.

`empty` não é availability.

`empty` representa uma coleção factual disponível sem resultados.

### Partial

Preservar os blocos confirmados.

Declarar explicitamente a cobertura ausente.

### Unavailable

Substituir somente a região factual afetada.

Não converter para zero ou empty.

### Restricted

Representar restrição de acesso.

Não representar como ausência de dados.

### Stale

Apresentar o último snapshot publicado e sua data.

Não criar refresh manual.

### Failed

Remover somente o resultado falho.

Preservar o recorte e contexto aplicáveis.

Não inventar retry.

### Empty

Preservar filtros/consulta.

Exibir ausência factual de resultados.

---

# Nulabilidade

Manter distinta a semântica de:

- `null`;
- campo ausente;
- zero confirmado;
- coleção vazia;
- bloco indisponível;
- bloco parcial.

Não usar formatação, labels ou defaults que alterem essa diferença.

---

# Responsividade

A implementação final deve preservar:

- uma única rolagem vertical principal;
- tabs com overflow horizontal quando necessário;
- filtros refluindo conforme blueprint;
- regiões analíticas reorganizando conforme breakpoint;
- tabelas com rolagem horizontal;
- ausência de rolagem vertical aninhada não prevista.

---

# Acessibilidade

As superfícies devem preservar:

- hierarquia semântica de headings;
- labels visíveis;
- navegação por teclado;
- foco visível;
- foco previsível após navegação;
- retorno de foco ao fechar contexto;
- caption em tabelas;
- instrução de overflow quando necessária;
- resumos textuais dos gráficos;
- status e risco que não dependam somente de cor;
- announcements de mudança de resultado/estado quando previstos.

---

# Superfície 1 — Dashboard Executivo

## Objetivo

Concluir a visão executiva consolidada do OneDrive, garantindo que todos os fatos reconciliados estejam representados sem comprometer a sequência:

**KPI → análise → investigação → recomendações**

## Cobertura obrigatória

### Resumo

Representar os KPIs aprovados e somente os valores efetivamente publicados.

### Armazenamento

Representar:

- tendência;
- distribuição de utilização;
- ranking;
- armazenamento por departamento.

### Atividade

Representar a distribuição de atividade aprovada.

Cada bloco deve preservar sua própria:

- unidade;
- período;
- cobertura;
- `asOf`;
- availability.

### Compartilhamento

Representar o resumo de compartilhamento externo aprovado.

### Desligamento

Representar o resumo de desligamento aprovado.

### Riscos e recomendações

Representar os itens publicados sem criar ação ou destino quando não houver `investigation`.

### Health Score

Representar as nove dimensões aprovadas com:

- peso;
- pontuação;
- evidência;
- disponibilidade;
- contribuição.

Fórmula:

`Σ(peso × pontuaçãoDaDimensão / 100)`

Dimensão não publicada:

- contribui `0` somente na própria parcela ponderada;
- permanece no denominador;
- continua visualmente indisponível.

Não atribuir interpretações qualitativas não publicadas à pontuação.

## Referência visual

`01.Dashboard Executivo.png`

Validar especialmente:

- hierarquia executiva;
- densidade;
- organização das análises;
- relação entre visão geral e investigação.

## Conclusão

A superfície só pode ser homologada quando:

- todos os blocos reconciliados estiverem materializados;
- availability estiver independente por bloco;
- Health Score estiver correto;
- composição estiver coerente com o blueprint;
- expectativa visual do sponsor estiver coberta;
- todos os cenários aplicáveis tiverem sido validados.

---

# Superfície 2 — Contas e Armazenamento

## Objetivo

Concluir a investigação de contas, capacidade, tendência e previsão preservando a diferença entre valor publicado e cálculo indisponível.

## Cobertura obrigatória

### Inventário

Preservar:

- consulta;
- filtros;
- ordenação;
- paginação;
- contexto da conta.

Fechar o contexto deve preservar a consulta existente.

### Utilização

Capacidade nula ou zero não autoriza percentual de utilização.

### Tendência

Representar a série histórica publicada.

### Distribuições

Representar:

- distribuição de utilização;
- distribuição/detalhe por área quando publicados.

### Previsão

Representar somente quando os requisitos reconciliados forem satisfeitos.

A previsão pode usar, quando publicados:

- snapshots históricos;
- crescimento;
- dias estimados;
- data estimada;
- confiança.

Indisponibilidade da previsão não deve remover inventário ou outras análises publicadas.

## Referência visual

`02.Contas e Armazenamento.png`

Validar especialmente:

- filtros;
- KPIs;
- análises;
- tabela dominante;
- contexto de conta.

## Conclusão

A superfície só pode ser homologada quando:

- inventário estiver correto;
- tendência estiver correta;
- distribuições estiverem presentes;
- previsão respeitar as condições do contrato;
- filtros/paginação/contexto estiverem corretos;
- utilização não for inferida;
- todos os cenários aplicáveis tiverem sido validados.

---

# Superfície 3 — Arquivos e Conteúdo

## Objetivo

Concluir a leitura de inventário, composição, descarte, duplicidade, sensibilidade, inatividade e risco de conteúdo sem inferências indevidas.

## Cobertura obrigatória

### Inventário

Representar:

- itens;
- tipos;
- tamanhos;
- idades;
- extensões;
- pastas;
- maiores itens;
- agregados publicados.

### Duplicidade

Duplicidade exata depende de `quickXorHash`.

Não usar como fallback:

- nome;
- tamanho;
- extensão.

### Malware

Representar risco de infecção somente a partir do sinal factual reconciliado.

Extensão potencialmente perigosa não prova infecção.

Ausência de malware publicado não equivale a ausência de risco.

### Descarte

Representar lixeira/descarte com os campos publicados e availability própria.

### Sensibilidade

Representar:

- rótulo;
- método de atribuição;
- vínculo com catálogo;

somente quando publicados.

Não introduzir ação mutável.

### Acesso sem uso

Representar o fato reconciliado de acesso sem uso por mais de 90 dias.

Esse dado deve possuir presença visual explícita.

Não pode existir apenas como propriedade invisível da fixture.

## Referência visual

`03.Arquivos e Conteúdo.png`

Validar especialmente:

- distribuições;
- rankings;
- inventário;
- densidade;
- blocos de investigação.

## Conclusão

A superfície só pode ser homologada quando:

- todos os blocos reconciliados estiverem materializados;
- duplicidade não for inferida;
- malware não for inferido;
- sensibilidade não for inferida;
- acesso sem uso estiver visível;
- availability for independente;
- nenhuma mutação tiver sido introduzida;
- todos os cenários aplicáveis tiverem sido validados.

---

# Superfície 4 — Compartilhamento e Acessos

## Objetivo

Concluir a investigação de compartilhamento, exposição externa, histórico e atenção preservando o caráter exclusivamente read-only da superfície.

## Cobertura obrigatória

Representar:

- snapshot atual;
- comparação D30;
- janela própria dos registros;
- tendência externa de 12 meses;
- distribuição por escopo;
- distribuição por tipo;
- `linkType`;
- `linkScope`;
- domínios;
- atenção estruturada.

`linkType` e `linkScope` não devem ser tratados como o mesmo conceito.

Ausência de tendência histórica afeta apenas a tendência.

Registros publicados continuam visíveis.

## Ações proibidas

Não disponibilizar:

- remover acesso;
- alterar acesso;
- expirar acesso;
- revogar acesso;
- notificar destinatário;
- modificar permissão.

## Referência visual

`04.Compartilhamento e Acessos.png`

Validar especialmente:

- KPIs;
- gráficos;
- filtros;
- tabela;
- alertas;
- recomendações.

## Conclusão

A superfície só pode ser homologada quando:

- janelas temporais estiverem corretas;
- tipo e escopo de link estiverem distintos;
- tendência estiver materializada;
- atenção estiver materializada;
- interface continuar read-only;
- todos os cenários aplicáveis tiverem sido validados.

---

# Superfície 5 — Atividade e Sincronização

## Objetivo

Concluir a leitura de atividade, sincronização, dispositivos, Sync Health, Sync Errors e KFM sem misturar fontes ou inferir estados saudáveis.

## Cobertura obrigatória

### Atividade

Representar:

- KPIs;
- séries;
- distribuições;
- listas publicadas.

### Períodos

Disponibilizar os períodos reconciliados:

- D7;
- D30;
- D90;
- D180.

Alterar o período de atividade não deve alterar séries com janela fixa própria quando o contrato não determinar isso.

### Evolução de sincronização

Representar a série de 12 meses de:

- sincronizações;
- falhas.

Ausência de falha publicada não equivale a zero.

### Dispositivos

Representar, quando publicados:

- dispositivo;
- pessoa;
- plataforma;
- última sincronização Intune;
- gerenciamento;
- conformidade;
- risco.

Não interpretar inventário Intune como sessão OneDrive.

Não interpretar última sincronização Intune como última sincronização do cliente OneDrive.

### Sync Health / Sync Errors

Representar:

- falhas detalhadas;
- versão do cliente;
- timestamps;
- cobertura temporal;
- demais fatos reconciliados.

Ausência de telemetria não equivale a condição saudável.

### KFM

Representar os estados publicados por pasta.

Não calcular percentual sem denominador publicado.

## Referência visual

`05.Atividade e Sincronização.png`

Validar especialmente:

- adoção;
- tendências;
- dispositivos;
- alertas;
- situação de sincronização.

## Conclusão

A superfície só pode ser homologada quando:

- períodos estiverem corretos;
- série fixa de sincronização estiver correta;
- Intune e Sync Health não estiverem semanticamente misturados;
- ausência de dado não virar estado saudável;
- KFM estiver corretamente materializado;
- todos os cenários aplicáveis tiverem sido validados.

---

# Superfície 6 — Usuários Desligados e Retenção

## Objetivo

Concluir a representação visual dos casos de desligamento, processo, retenção, transferência e exclusão sem transformar simulação visual em workflow real.

## Cobertura obrigatória

Representar:

- casos;
- processo;
- distribuições;
- retenção;
- próximas exclusões;
- contexto por departamento;
- availability independente.

Campos ausentes como:

- responsável;
- retenção;
- prazo;
- destinatário;
- progresso;

continuam ausentes.

Não completar etapas artificialmente.

## Workflow

A superfície não implementa workflow real nesta etapa.

Não criar:

- transferência;
- atribuição;
- alteração de retenção;
- exclusão;
- comando administrativo.

## Referência visual

`06.Usuários Desligados e Retenção.png`

Validar especialmente:

- processo;
- tabela;
- retenção;
- próximos casos;
- densidade da visão operacional.

## Conclusão

A superfície só pode ser homologada quando:

- processo for factual;
- campos ausentes permanecerem ausentes;
- retenção/exclusão possuírem availability independente;
- simulação não parecer estado real do provider;
- nenhuma ação administrativa tiver sido introduzida;
- todos os cenários aplicáveis tiverem sido validados.

---

# Superfície 7 — Configurações e Segurança

## Objetivo

Concluir a leitura de score, categorias, políticas, proteção, ameaças, retenção, conformidade, DLP e recomendações preservando rigorosamente a evidência publicada.

## Cobertura obrigatória

### Security Score

Usar:

`Σ(peso × pontuaçãoDaDimensão / 100)`

Representar as nove dimensões com:

- nome;
- peso;
- pontuação;
- disponibilidade;
- evidência.

Dimensão indisponível:

- recebe `0` somente na própria contribuição;
- permanece no denominador;
- permanece visualmente identificada como indisponível.

Não inventar interpretação qualitativa da nota.

### Categorias

Representar as categorias ponderadas e sua cobertura.

### Políticas

Representar exclusivamente como informação de leitura.

Não utilizar controles que sugiram edição.

### Proteção e sensibilidade

Representar:

- data protection;
- catálogo de sensibilidade;
- aplicação quando publicada;
- disponibilidade;
- cobertura.

Catálogo não comprova aplicação por item.

### Ameaças

Só associar ameaça a OneDrive/SharePoint quando houver evidência factual aprovada.

Título, severidade ou produto isoladamente não comprovam vínculo.

### Retenção

Representar rótulo e configuração por item quando publicados.

Ausência de campos permanece desconhecida.

### Dispositivos

Representar conformidade/risco somente dentro da cobertura publicada.

Não inferir cobertura total do tenant a partir de Intune.

### DLP

Representar os achados aprovados com:

- fonte;
- severidade;
- data;
- evidência;
- availability.

Ausência de achado não comprova:

- política;
- cobertura completa;
- conformidade;
- score saudável.

### Recomendações

São informação.

Não são ações corretivas.

## Referência visual

`07.Configurações e Segurança.png`

Validar especialmente:

- score;
- categorias;
- políticas;
- postura;
- recomendações.

## Conclusão

A superfície só pode ser homologada quando:

- score estiver correto;
- nove dimensões estiverem representadas;
- disponibilidade estiver clara;
- proteção, sensibilidade, ameaças, retenção, dispositivos e DLP estiverem explicitamente materializados;
- nenhuma inferência de segurança indevida existir;
- nenhuma ação corretiva tiver sido introduzida;
- todos os cenários aplicáveis tiverem sido validados.

---

# Superfície 8 — Histórico e Auditoria

## Objetivo

Concluir a investigação de auditoria com recortes, cobertura e detalhe sem inferir completude da fonte.

## Cobertura obrigatória

### KPIs

Preservar o recorte definido pelo contrato.

KPIs anteriores aos filtros permanecem no snapshot aprovado quando esse for o comportamento reconciliado.

### Filtros

Representar o catálogo aprovado de:

- período;
- tipo/categoria;
- usuário;
- ação/operação;
- localização;
- dispositivo;
- resultado.

Filtros compartilham o mesmo recorte das regiões posteriores.

### Análises

Representar:

- categorias;
- tendência;
- risco;
- top actors.

### Tabela

Representar:

- eventos;
- paginação;
- cobertura;
- ordenação/recorte aplicável.

### Detalhe

Expor somente os 16 atributos aprovados quando publicados.

Campo ausente não recebe valor substituto.

### Cobertura

A cobertura da fonte deve permanecer associada ao resultado.

Resultado vazio com cobertura parcial não prova inexistência de eventos fora do recorte coberto.

### Seleção

Se o evento selecionado deixar de existir após:

- filtro;
- paginação;
- alteração do recorte;

o detalhe deve fechar.

O foco deve retornar para um ponto válido da consulta.

## Referência visual

`08.Histórico e Auditoria.png`

Validar especialmente:

- filtros;
- análises;
- eventos;
- detalhe;
- atividades críticas;
- densidade investigativa.

## Conclusão

A superfície só pode ser homologada quando:

- filtros estiverem corretos;
- recortes estiverem corretos;
- top actors estiver materializado;
- coverage permanecer explícito;
- detalhe respeitar a allowlist;
- campos ausentes não forem inventados;
- seleção/foco estiver correto;
- todos os cenários aplicáveis tiverem sido validados.

---

# Ajustes de fixture

A implementação deve partir das fixtures runtime reconciliadas.

Fixture não deve ser alterada simplesmente para acomodar uma UI incorreta.

Quando surgir uma necessidade real de alteração, o executor deve identificar:

- superfície;
- bloco;
- comportamento esperado;
- limitação atual da fixture;
- decisão reconciliada que sustenta a necessidade;
- alteração mínima necessária.

A necessidade deve ser validada pelo Tech Lead.

O Tech Lead é responsável pela decisão e execução do ajuste da fixture.

Depois de uma alteração de fixture:

1. executar novamente os validadores correspondentes;
2. repetir os cenários afetados;
3. repetir a validação da superfície;
4. repetir a homologação caso ela já tivesse ocorrido.

---

# Atualização de frontend coverage

Uma superfície permanece `frontend_implementation_ready` enquanto estiver em execução.

Ela só muda para:

`frontend_done`

após a homologação visual final independente.

Não inferir `frontend_done` a partir de:

- componente existente;
- código concluído;
- fixture pronta;
- binding tipado;
- teste aprovado;
- build aprovado;
- alinhamento aprovado.

Após a homologação de cada superfície:

- atualizar somente seu estado em `frontend-coverage-review.md`;
- manter as demais superfícies no estado efetivamente comprovado.

---

# Alterações transversais

Alterações em:

- componentes compartilhados;
- formatters;
- availability;
- layout global;
- tipos;
- fixture infrastructure;

podem afetar superfícies anteriormente homologadas.

Quando uma alteração transversal acontecer:

1. identificar superfícies potencialmente afetadas;
2. executar os gates correspondentes;
3. verificar visualmente o impacto;
4. corrigir regressões antes de continuar.

Não deixar regressão acumulada para o gate final.

---

# Gate integrado final

Após as oito superfícies estarem individualmente homologadas, executar os gates integrados do módulo.

Na raiz de `orkestria360/`:

```bash
npm run types:check
npm run lint:check
npm run build
APP_ENV=testing DB_CONNECTION=pgsql DB_DATABASE=orkestria360_test DB_URL='' CACHE_STORE=database DB_USERNAME=orkestria360 DB_PASSWORD=orkestria360 php artisan test tests/Feature/Onedrive
composer ci:check
```

Falhas introduzidas pelas remediações devem ser investigadas e corrigidas.

---

# Browser acceptance integrada

Após os gates técnicos, executar uma validação integrada das oito superfícies.

Percorrer:

- todas as tabs;
- todos os cenários existentes nos catálogos das fixtures;
- filtros;
- paginação;
- detalhes;
- availability;
- empty;
- partial;
- unavailable;
- restricted;
- stale;
- failed;
- teclado;
- foco;
- wide;
- compact;
- responsividade;
- acessibilidade relevante;
- ausência de controles proibidos.

Playwright CLI deve ser utilizado quando aplicável à infraestrutura atual do projeto.

Screenshots, traces e logs são evidência temporária de execução e não devem ser versionados salvo decisão explícita.

---

# Revisão final de regressão

Depois da aceitação integrada:

- revisar o diff final;
- revisar componentes compartilhados modificados;
- revisar fixtures alteradas;
- verificar as oito superfícies novamente quando necessário;
- confirmar ausência de mudanças acidentais;
- confirmar ausência de regressões em superfícies homologadas anteriormente.

Qualquer regressão material deve ser corrigida antes do encerramento.

Se a regressão alterar visualmente ou semanticamente uma superfície já homologada, sua homologação deve ser repetida.

---

# Handoff do módulo

O frontend do módulo só pode ser considerado concluído quando as oito superfícies estiverem comprovadamente:

`frontend_done`

O gate de handoff existente em:

`frontend-coverage-review.md`

somente deve ser reavaliado depois disso.

Este documento não inicia e não autoriza o discovery backend.

---

# Critério global de conclusão

A execução deste plano está concluída somente quando:

1. Dashboard Executivo estiver `frontend_done`;
2. Contas e Armazenamento estiver `frontend_done`;
3. Arquivos e Conteúdo estiver `frontend_done`;
4. Compartilhamento e Acessos estiver `frontend_done`;
5. Atividade e Sincronização estiver `frontend_done`;
6. Usuários Desligados e Retenção estiver `frontend_done`;
7. Configurações e Segurança estiver `frontend_done`;
8. Histórico e Auditoria estiver `frontend_done`;
9. cada superfície tiver passado por alinhamento aprovado por QA/UX/UI e Tech Lead;
10. cada superfície tiver passado por validação técnica e de navegador;
11. cada superfície tiver passado por homologação visual final independente;
12. todos os blocos `frontend_implementation_ready` tiverem sido materializados;
13. todos os achados bloqueantes tiverem sido resolvidos;
14. os gates integrados estiverem aprovados;
15. a aceitação integrada estiver aprovada;
16. não houver regressão material aberta;
17. `frontend-coverage-review.md` refletir o estado real comprovado;
18. o gate de handoff tiver sido recalculado a partir desse estado.

Enquanto existir uma correção executável compatível com os artefatos reconciliados, a execução deve continuar.