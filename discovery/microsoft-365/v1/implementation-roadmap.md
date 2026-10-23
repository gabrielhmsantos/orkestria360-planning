# Roadmap de Implementação — Microsoft 365

## Objetivo

Transformar o módulo Microsoft 365 atual, hoje mockado inline em rota, em uma superfície preparada para crescer por fases sem retrabalho estrutural.

## Situação temporária — 2026-07-31

- A overview em `/microsoft-365` está desabilitada temporariamente e responde 404 para usuários autenticados.
- Os pontos de entrada do Microsoft 365 direcionam para Licenciamento, que permanece disponível.
- A overview será reestruturada antes de ser reaberta, usando snapshots persistidos para evitar que chamadas síncronas ao Microsoft Graph bloqueiem a navegação inicial.

## Estratégia de autenticação

- A integração futura com Microsoft Graph será feita com **App Registration** no Microsoft Entra.
- O modelo padrão será **app-only authentication** com **OAuth 2.0 client credentials flow**.
- Esta decisão foi tomada porque o Orkestria360 não terá tela de login Microsoft e a integração se enquadra no cenário oficial da Microsoft de **“where no user is present”**.
- O token será obtido no backend e usado em chamadas server-to-server para o Graph.
- O roadmap não prevê fluxo padrão de autenticação delegated em nome de usuário final.
- Se algum endpoint futuro exigir exclusivamente delegated auth, isso deverá ser tratado como exceção e reavaliado antes de implementação.

## Estratégia de consumo PHP

- A implementação futura deve usar o **SDK oficial PHP do Microsoft Graph** como baseline.
- Pacote previsto:
  - `microsoft/microsoft-graph`
- Dependência estrutural esperada no stack oficial:
  - `microsoft/kiota-authentication-phpleague` via `microsoft/microsoft-graph-core`
- Padrão técnico derivado dos tutoriais oficiais da Microsoft:
  - `ClientCredentialContext` para autenticação app-only
  - `GraphServiceClient` para chamadas ao Graph
  - escopo `https://graph.microsoft.com/.default`
- O backend Laravel deve encapsular esse client em provider/service próprio do projeto.
- `fetch`/HTTP manual não deve ser o caminho principal; só deve entrar como fallback pontual se algum endpoint específico exigir workaround.
- Referências oficiais adotadas para esse baseline:
  - `https://learn.microsoft.com/en-us/graph/tutorials/php-app-only`
  - `https://learn.microsoft.com/en-us/graph/tutorials/php-app-only-authentication`

## Fase 0 — Discovery concluído

- Consolidar narrativa de produto do módulo.
- Fechar domínios e prioridades.
- Fechar contrato alvo da overview.
- Mapear APIs oficiais Microsoft por capability.

## Fase 1 — Overview estruturada

### Escopo

- Extrair `/microsoft-365` de `routes/web.php` para controller dedicado.
- Introduzir um mapper/provider backend do módulo Microsoft 365.
- Migrar o payload atual para um contrato estável de overview.
- Preservar a UX visual atual, com refinamentos de contrato e sem integração real.

### Entregáveis

- `Microsoft365Controller` para a página overview
- classe de montagem de payload, no mesmo espírito do suporte usado em Governança
- provider/service backend para encapsular o cliente oficial PHP do Microsoft Graph
- testes HTTP/Inertia cobrindo o novo contrato
- mock data centralizado fora da rota

### Gate recomendado

- `composer ci:check`

## Fase 2 — Subáreas de maior valor

### Prioridade recomendada

1. Licenciamento
2. Secure Score
3. Usuários e Contas
4. Grupos
5. Teams
6. Exchange

### Objetivo

- Sair do conceito de “submenu apenas visual” e preparar 2 a 4 subpáginas com payloads próprios.
- Reaproveitar componentes já existentes de cards, gráficos, listas e badges.
- Manter tudo ainda mockado, porém com contratos compatíveis com Microsoft Graph.

## Fase 3 — Identity e relatórios

### Escopo

- Autenticação MFA
- Relatórios
- feed de atividade recente menos editorial e mais orientado a fontes oficiais

### Observação

- Esta fase depende de decisões mais finas sobre qual recorte de identidade e activity reporting queremos demonstrar.
- O bloco `recentActivity` deve continuar mockado até existir curadoria clara de múltiplas fontes.

## Fase 4 — Workloads especializadas

### Escopo provável

- Defender
- Intune
- SharePoint
- OneDrive
- Configurações

### Objetivo

- Completar a cobertura do submenu Microsoft 365.
- Só fechar endpoints detalhados quando cada workload virar frente ativa.

## Sequência Técnica Recomendada

1. Centralizar o payload overview no backend.
2. Introduzir o seam de integração com o SDK oficial PHP do Microsoft Graph.
3. Renomear/evoluir o contrato TypeScript da overview sem quebrar a página atual.
4. Criar seams claros para score, service health, licenças e reports.
5. Só depois abrir subrotas dedicadas.

## Dependências e Riscos

- O bloco de recent activity depende de curadoria entre várias superfícies oficiais; não deve guiar o desenho das demais áreas.
- Secure Score precisa separar score agregado de controle/remediação para não misturar conceitos no contrato.
- Workloads como Defender e Intune têm profundidade muito maior do que a overview precisa; manter escopo executivo.
- A integração futura deve partir de um principal já preparado com permissões e roles administrativas adequadas:
  - `Reports.Read.All` para relatórios
  - `ServiceHealth.Read.All` para saúde dos serviços
  - `LicenseAssignment.Read.All` para inventário de licenças
  - leitura ampla de diretório para usuários e grupos, com baseline conservadora em `Directory.Read.All`
- Os tutoriais oficiais da Microsoft para PHP app-only usam:
  - `microsoft/microsoft-graph`
  - `microsoft/kiota-authentication-phpleague`
  - `ClientCredentialContext`
  - `GraphServiceClient`
  - `https://graph.microsoft.com/.default`
- O roadmap assume que seguiremos esse padrão oficial antes de considerar qualquer implementação HTTP manual.
- O roadmap assume que groups, policies e consentimentos necessários já terão sido provisionados fora do escopo da POC.

## Definição de Pronto por Fase

### Fase 1

- Overview servida por controller dedicado
- contrato rastreável para APIs oficiais
- mock centralizado
- testes atualizados

### Fase 2

- ao menos 2 subáreas com payload próprio
- submenu deixa de ser apenas placeholder nessas áreas
- contratos alinhados ao `api-mapping.md`

### Fase 3+

- cada nova área implementada apenas quando o endpoint oficial e a narrativa executiva estiverem claros
