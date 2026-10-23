# Research: Workflow Documental de Governança

## Decision 1: Usar Laravel convencional com Eloquent, Form Requests e Storage

**Decision**: Implementar o workflow com models Eloquent, migrations, form requests, controllers web e disco local do Laravel para templates/documentos.

**Rationale**: A documentação atual do Laravel 13 reforça o uso de `app/Models` para models Eloquent, `rules()` em form requests para validação e feature tests como principal camada de cobertura. Isso atende o princípio de Laravel convencional e mantém o POC simples.

**Alternatives considered**:
- Repository/service layer dedicada: rejeitada por adicionar indirection sem problema comprovado.
- Armazenamento externo (S3/Azure Blob): rejeitado por aumentar a complexidade e sair do escopo do POC.

## Decision 2: Tratar o módulo como páginas Inertia server-driven, não como API separada

**Decision**: Manter overview e detalhe como páginas Inertia alimentadas por props do servidor, com submissões usando `useForm`.

**Rationale**: A documentação do Inertia mostra `useForm` como padrão para submissões, erros de validação e uploads multipart, além de `usePage` para consumir props compartilhadas e da página. Isso combina com a estrutura atual de `/governance` e evita criar API REST paralela apenas para o frontend interno.

**Alternatives considered**:
- API JSON + client state manager: rejeitada por duplicar contrato e fluxo de autenticação.
- Estado totalmente mockado no frontend: rejeitado porque não valida upload, aprovação e score persistido.

## Decision 3: Persistir 8 tópicos fixos e um documento ativo por tópico

**Decision**: Tratar os 8 tópicos de governança como catálogo fixo seedado, cada um com um estado atual e um documento vigente.

**Rationale**: A spec define escopo fixo de 8 tópicos e apenas um documento ativo por tópico. Isso reduz modelagem dinâmica e facilita overview, score e testes.

**Alternatives considered**:
- Cadastro livre de tópicos: rejeitado por fugir do escopo do módulo atual.
- Histórico completo de versões: rejeitado porque a spec pede apenas documento vigente e histórico simples do último envio.

## Decision 4: Calcular score no backend a partir dos 8 tópicos persistidos

**Decision**: Calcular o score de maturidade no backend como média simples dos 8 tópicos, com valor `0` para tópicos não concluídos.

**Rationale**: A regra já foi fixada na spec. Mantê-la no backend evita divergência entre overview, testes e futuras ações administrativas.

**Alternatives considered**:
- Cálculo no frontend: rejeitado por duplicar regra de negócio.
- Score apenas com concluídos: rejeitado por contrariar a clarificação aprovada.

## Decision 5: Implementar autorização administrativa mínima

**Decision**: Restringir aprovação e pontuação com autorização Laravel simples, inicialmente baseada em uma capacidade/papel administrativo coerente com o contexto do usuário autenticado.

**Rationale**: A spec só exige diferenciação funcional entre operacional e administrador. Um mecanismo simples de autorização reduz risco e atende o comportamento esperado do POC.

**Alternatives considered**:
- ACL granular completa: rejeitada por overengineering.
- Sem autorização no backend: rejeitada por quebrar regra central da feature.
