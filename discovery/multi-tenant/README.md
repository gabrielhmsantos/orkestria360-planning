# Discovery — Microsoft 365 app-only multi-organization

## Objetivo e estado

Planejar a evolução do Orkestria360 de uma integração Microsoft Graph app-only de um único tenant para uma única App Registration multi-tenant, conectada a várias organizações por admin consent e ainda autenticada por `client_credentials`. Esta é uma discovery técnica: não cria código, migrations, callbacks ou configuração de produção.

O sponsor não forneceu diretório de referências. Por autorização explícita, esta discovery usa a solicitação registrada, o repositório atual e a documentação oficial Microsoft; a ausência permanece uma limitação de rastreabilidade de produto.

## Nota de rollout

A evolução arquitetural parte de uma aplicação single-tenant no código, mas esta feature é entregue em ambientes descartáveis. Não há instalação, customer, usuário, conexão Microsoft ou dado anterior a preservar: o caminho suportado é fresh deployment, com banco recriado e onboarding normal para cada customer e connection.

## Decisão arquitetural recomendada

Uma App Registration do Orkestria360, configurada para **Accounts in any organizational directory**, mantém um único `client_id` e uma credencial global. Cada organização aprova as Application Permissions no seu próprio tenant, criando ali o service principal (Enterprise Application). O Orkestria persiste a conexão e usa sempre o `microsoft_tenant_id` daquela conexão para obter token em `https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token` com `grant_type=client_credentials` e `scope=https://graph.microsoft.com/.default`.

Usar `https://login.microsoftonline.com/organizations/adminconsent` para iniciar o admin-consent quando ainda não se conhece a organização; quando o admin informar um Microsoft Entra Tenant ID GUID, usar `https://login.microsoftonline.com/{tenant-id}/adminconsent`. `common` não faz parte do contrato de onboarding. Nenhuma authority genérica pode ser usada para token app-only: o runtime usa sempre o tenant ID ou domínio explícito da conexão.

## Limites e princípios

- O tenant interno Orkestria nunca é o Microsoft Entra Tenant ID. Existem exatamente um tenant `platform`, criado no bootstrap/seed, e tenants `customer`, criados por provisioning. Apenas tenant `customer` pode ter zero ou uma conexão Graph; cada `microsoft_tenant_id` pode estar associado globalmente a apenas um tenant `customer`.
- Escolha e leitura de tenant exigem membership local. `admin` administra conexão Microsoft, configurações e memberships; `member` usa as capacidades operacionais, mas não administra a fronteira de segurança do tenant. Não há RBAC amplo nem Spatie neste V1.
- O tenant interno não é criado por autoatendimento. O seed cria somente o `platform` e seu `admin@example.com` ativo. Seus administradores fazem o provisioning do customer inativo, do convite `role=admin`/`purpose=customer_bootstrap` e dos temas de Governance. Antes do aceite não há `User` nem membership do cliente; o primeiro aceite válido cria ambos como `admin active` e preenche `activated_at` write-once, sem depender do consentimento Microsoft. `role` (`admin`/`member`) concede capacidade; `purpose` (`customer_bootstrap`/`access`) define lifecycle: admins adicionais, inclusive do platform, usam `admin/access`. O convite tem validade de 7 dias, uso único, envio por e-mail e URL recuperável ao iniciador autorizado enquanto `pending`; o scheduler o expira idempotentemente e elimina o ciphertext. Não há registro público de usuário nem acesso por domínio de e-mail. Tentativa posterior de associar o mesmo Entra tenant a outro tenant interno é negada de forma sanitizada.
- Governance preserva um catálogo global padrão de temas/templates e cria a instância de cada tema para todo novo tenant `customer`. Cadastro e controle desse catálogo ficam fora deste escopo.
- O control plane (`tenants`, memberships, convites de acesso e tentativas de conexão) resolve a entrada e não usa RLS por `app.current_tenant_id`; o tenant data plane usa RLS obrigatório, complementar a `CurrentTenant`, Policies, constraints e testes.
- Nenhuma query, cache, lock, job ou Graph client pode descobrir tenant por configuração global ou sessão implícita.
- `client_secret` por cliente não é necessário neste desenho e não deve ser salvo no PostgreSQL. A credencial global deve sair de secret manager/identity de workload.
- Dados de uma conexão revogada ou com falha permanecem históricos, com frescor e estado explícitos, até exclusão administrativa explícita; esse fluxo de exclusão não faz parte do V1 e os dados não viram vazios ou zero.

## Conteúdo do pacote

- [Fontes e rastreabilidade](fontes-e-rastreabilidade.md)
- [Arquitetura e decisões](arquitetura-e-decisoes.md)
- [Contratos, schema e runtime](contratos.md)
- [Impacto concreto no repositório](impacto-no-repositorio.md)
- [Plano de testes e critérios de aceite](plano-de-testes.md)
- [Avaliação de stack e parecer do tech lead](avaliacao-stack.md)
- [Blueprint de implementação própria V1](implementacao-propria-v1.md)

## Prontidão para Spec

Pronto para formalizar a arquitetura e a primeira fatia de implementação. As superfícies de onboarding, control plane, conexão/desconexão e memberships seguem a [representação estrutural aprovada](representacao-estrutural-telas.md). O V1 não tem seletor ou troca de tenant no front; a credencial global fica em secret manager, com rotação e monitoramento de expiração; e dados históricos são mantidos até exclusão administrativa explícita fora do escopo.
