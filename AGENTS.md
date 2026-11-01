# AGENTS.md — Orkestria 360 Planning

## Responsabilidade deste repositório

Este é o repositório de produto, discovery, decisões, especificações e evidências do Orkestria 360. Implementação de Application, Design System e Simulator pertence aos respectivos repositórios. Consulte [REPOSITORIOS.md](docs/REPOSITORIOS.md) e `workspace.json`; não crie cópias de produtos dentro deste Planning.

Este repositório define os artefatos, convenções e evidências de planejamento. A ferramenta utilizada para executar agentes e workflows deve respeitar esses contratos, sem impor dependência de um orquestrador específico.

## Fontes locais autorizadas

Use este checkout para planejamento e os worktrees de produto configurados no mapa local da execução para consultar ou alterar implementações. Resolva os caminhos pelo repositório proprietário. Quando faltar evidência necessária, registre a lacuna.

## Materiais fornecidos pelo usuário

Leia imagens, Markdown, DOCX e demais referências em `inputs/<delivery>/` na branch recebida. `briefing.md` é opcional. A organização interna dos arquivos é livre.

Antes de escrever resultados, confira a branch e o commit de entrada indicados no intake. Registre `input_branch`, `source_context_commit`, `input_path` e os paths/hashes das fontes consumidas. Comece nesse commit e mantenha o SHA de entrada como referência quando a branch avançar com os resultados. Não crie uma nova base em `main` nem exija merge dos materiais para iniciar Planning. A base do PR e as branches dos produtos são entradas distintas.

Os materiais de entrada são fornecidos pelo usuário; não os altere para adequá-los ao plano. Produza análises em `discovery/`, requisitos e planos em `plans/` e evidências aceitas em `deliveries/`, referenciando as fontes por path e commit. Fontes ausentes, ilegíveis ou conflitantes sem decisão suficiente exigem lacuna/clarificação explícita. Veja [o contrato de entrada](docs/FLUXO.md#materiais-de-entrada-e-branch-recebida).

## Intenção e fontes de verdade

Leia [PRINCIPIOS.md](docs/PRINCIPIOS.md) e [PRODUTO.md](docs/PRODUTO.md). Para cada tarefa, identifique o discovery/spec/contrato ativo e leia somente os artefatos pertinentes.

Priorize a solicitação atual do usuário, decisões aprovadas do escopo, princípios e instruções aplicáveis, contratos técnicos e evidências. Divergência material exige registrar a decisão correspondente; não altere requisito ou teste correto para justificar o código produzido. Estado antigo ou código existente não substitui intenção aprovada.

`docs/PRD.md`, `docs/REQUIREMENTS.md` e as notas técnicas fornecem contexto de produto. Selecione o escopo pelo pedido atual e pelos artefatos aprovados pertinentes. Checkboxes, datas e versões de documentos não comprovam uma entrega; os gates aplicáveis precisam de evidência.

## Produto e qualidade

- Preserve a semântica de zero, vazio, ausência de coleta, indisponibilidade, restrição, parcialidade, desatualização e falha. Não invente fatos para completar UI, score, gráfico ou teste.
- Fixtures autorizadas são sintéticas, determinísticas e isoladas da verdade de produção. Contrato semântico, API Microsoft e fixture do Simulator têm autoridades distintas.
- Preserve isolamento de tenants e autorização mínima. Não introduza RBAC genérico, novos papéis ou acesso operacional de `platform admin` a dados de customer sem decisão explícita.
- Requisitos, jornadas, superfícies e critérios de aceite devem permanecer rastreáveis. Frontend e backend podem avançar separadamente quando há contrato aprovado e integração explicitamente delimitada.
- Uma alteração de componente reutilizável da aplicação exige avaliar e alinhar sua contraparte no Design System na mesma entrega. Declare dependências e ausências; não invente API de componente.

## Planejamento e execução

Use `inputs/<delivery>/` para os materiais fornecidos pelo usuário; `discovery/` para exploração e contratos de produto; `plans/<delivery>/r<revision>/` para novos requisitos, planos e revisões; `deliveries/<delivery>/r<revision>/` para o conjunto reproduzível e suas evidências.

**`specs/` é histórico para consulta e não é destino de novos planejamentos.** Não criar novas pastas, regenerar arquivos ou executar comandos descritos nesse acervo como parte de uma entrega atual. Consuma um contrato histórico apenas quando explicitamente selecionado no escopo.

Cada execução deve fixar `artifact_root=plans/<delivery>/r<revision>/`, `requirements_path=<artifact_root>/requirements.md` e `plan_path=<artifact_root>/implementation-plan.md`. Confira os paths canônicos antes de escrever. Entrada ausente ou apontando para `specs/` precisa ser corrigida antes de iniciar o planejamento. Respeite os nomes, metadados e validadores aplicáveis aos artefatos, conforme [destino dos artefatos](docs/FLUXO.md#destino-dos-artefatos).

Clarifique ambiguidades materiais e analise o plano contra princípios, contratos e critérios de aceite antes da execução. A análise deve encontrar lacunas, não aprovar o próprio documento por ausência de erro de sintaxe. Use os [templates](templates/README.md) na proporção necessária à tarefa.

Execute código no worktree do repositório proprietário e leia seu `AGENTS.md` quando existir. Caminhos precisam ser explícitos; não presuma produtos irmãos do Planning. Estado de execução, segredos e outputs brutos ficam fora do conteúdo versionado. Registre SHAs, dependências entre repositórios, gates e evidências sanitizadas no manifesto da entrega.

## Publicação obrigatória por PR

Para uma entrega de alteração autorizada, o fluxo conclui com as branches candidatas publicadas e os PRs abertos nos repositórios proprietários dos entregáveis. Investigações sem entrega de alteração podem concluir com relatório local.

**Nenhum agente — incluindo coordenador, integrador ou publicador — faz merge, habilita auto-merge ou push direto na `main` ou em outra branch-base.** Merge humano acontece fora deste fluxo. Antes de cada handoff e publicação, confira que a configuração efetiva respeita essa política; não presuma que defaults de qualquer ferramenta a imponham.

Antes de publicar, revise o diff completo contra a base, os gates e o repositório proprietário. PRs devem descrever toda a entrega, usar Markdown real e ficar draft por padrão, salvo orientação diferente. Confirme estado OPEN, head/base/SHA esperados e auto-merge desligado. Validação local é estado intermediário; não confunda PR aberto com código incorporado à base. Não crie PR de Planning apenas por tê-lo consultado; publique-o quando os artefatos forem entregáveis versionados da demanda.

Faça commits focados, revise o que será incluído e preserve trabalho humano existente. Não versione `.env`, snapshots, tokens, PII, dados reais de tenant, outputs temporários ou dependências geradas.

## Skills e documentação técnica

As skills do projeto estão versionadas em `.agents/skills/`, com seus recursos locais. Leia [SKILLS.md](docs/SKILLS.md) para uso, limites e atualização. Alterações nos produtos exigem uma entrega no repositório proprietário.

Use Context7 para documentação atual de bibliotecas, frameworks, SDKs, APIs, ferramentas CLI e serviços cloud: primeiro `resolve-library-id`, depois `query-docs` por conceito. Se indisponível, use documentação oficial e declare a limitação. Não o exija para raciocínio geral ou leitura de regras de negócio locais.

`analyze-code-review` continua de uso explícito. Não instale ou crie especialistas para executá-la. CodeNavi só deve ser usado quando solicitado ou quando uma investigação complexa o justificar e o usuário tiver confirmado seu uso; não o ative por mera presença de implementação.

## Ambientes de Application

Desenvolvimento/UI e coleta técnica que precisam de login/conexão usam o banco snapshot `orkestria360` do ambiente isolado. A suíte automatizada usa `orkestria360_test`; `RefreshDatabase` deve ficar nesse contexto. Configuração privada de `.env`/`.env.testing`, porta exclusiva, `DB_URL` e chave compatível com o snapshot são responsabilidade do ambiente de Application. Não execute migrations ou testes contra o banco humano de origem.

## Comunicação e comandos longos

Prefira português e comunicação objetiva. Informe limites reais da validação; documentação e checker estrutural não provam integração funcional.

Ao executar comandos por wrappers, preserve `output`, `session_id` e `exit_code`. Se houver sessão viva, continue a mesma sessão até obter resultado terminal; não repita ou sobreponha o comando porque houve timeout de observação.
