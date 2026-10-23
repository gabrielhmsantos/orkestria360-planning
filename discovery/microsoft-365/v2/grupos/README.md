# Discovery — Microsoft 365 / Grupos

## Objetivo

Permitir que administradores entendam quais grupos existem, sua finalidade, responsáveis, acesso e riscos de governança, sem executar alterações no tenant nesta fase.

## Escopo e superfícies

1. Dashboard Executivo — leitura consolidada da saúde, distribuição, alertas e recomendações.
2. Diretório de Grupos — consulta, filtros e contexto de cada grupo.
3. Membros e Proprietários — relações de pertencimento, responsabilidade e exceções.
4. Grupos Dinâmicos — regras, processamento, saúde e simulação proposta.
5. Licenciamento por Grupo — atribuições, erros, consumo e oportunidades.
6. Governança e Ciclo de Vida — finalidade, política, revisões, expiração e arquivamento.
7. Atividade e Inatividade — sinais de uso e investigação contextual.
8. Histórico e Auditoria — eventos, exclusões e rastreabilidade temporal.

## Limites da V2

- As ações de criar, alterar, renovar, arquivar, excluir, atribuir licença e executar revisão são `coming_soon`: requerem autorização, confirmação, segregação e auditoria operacional aprovadas.
- Informações de finalidade, responsáveis de negócio/técnico, criticidade, revisões, exceções e custos dependem de persistência do Orkestria; não são inferidas do Graph.
- Indicadores de atividade são diretamente mensuráveis somente para grupos Microsoft 365; para grupos de segurança, falta de mensagens ou arquivos não comprova inatividade.
- Grupos dinâmicos e revisões de acesso dependem de licenciamento Microsoft Entra ID/Governance compatível.
- Números, nomes, e-mails, IPs, datas e valores financeiros nas referências são ilustrações, não dados operacionais.

## Princípios e dependências

- Microsoft Graph é a fonte técnica primária; o banco Orkestria complementa contexto corporativo e preserva histórico/snapshots.
- Ausência de sinal, permissão, licença ou fonte é `unavailable` ou `restricted`, nunca zero ou confirmação negativa, exceto na composição do score de governança: cada evidência ausente vale `0%` apenas em sua dimensão.
- Todo bloco de dados deve informar origem, atualização e frescor; detalhes de permissões e consentimento ficam fora da UI.
- Recomendações orientam investigação. Ações mutáveis só poderão ser habilitadas após contrato operacional e trilha de auditoria.

## Decisões transversais

- A ordem de navegação preserva as oito superfícies e a composição observadas no documento e nas imagens do sponsor.
- O score de governança é proprietário do Orkestria e usa os nove pesos do documento do sponsor. Cada dimensão é calculada sobre os grupos da geração publicada; evidência ou fonte ausente vale zero na dimensão correspondente.
- O módulo usa estados `available`, `restricted`, `unavailable` e `coming_soon` por bloco, sem esconder o propósito da capacidade.

## Models

O módulo requer entidades persistentes para contexto de governança, achados, snapshots de atividade e licenciamento, auditoria e revisões. Veja [models/modelo-conceitual.md](models/modelo-conceitual.md).

## Contratos Graph

As superfícies que consomem Graph possuem `api.md` e `openapi.yaml` por diretório. Eles registram somente leitura, envelopes OData, permissões, paginação, vazios, PII, delta e redirect de relatórios; não autorizam operações de escrita nem alteram o conector existente.

## Estado

Discovery pronto para futura formalização em `specs/`: superfícies, fontes, dados internos necessários e limites estão rastreados. A futura Spec deve detalhar limiares adicionais, permissões/licenças por endpoint, frequência e retenção, modelo de autorização e quais workflows mutáveis serão ativados.
