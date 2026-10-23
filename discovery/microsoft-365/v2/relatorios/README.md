# Discovery — Microsoft 365 / Relatórios

## Objetivo

Transformar publicações Microsoft 365 já consolidadas pelo Orkestria em relatórios executivos e operacionais rastreáveis, sem recolher dados ao abrir a tela e sem representar como disponíveis dados, custos, tendências ou certificações que não tenham fonte publicada.

## Escopo e superfícies

1. Dashboard Executivo — síntese por fonte, cobertura e período.
2. Catálogo de Relatórios — biblioteca de templates e respectivos pré-requisitos.
3. Relatórios Executivos — composição determinística orientada a gestão.
4. Relatórios Operacionais — consulta/exportação com granularidade e escopo publicados.
5. Relatórios de Segurança e Compliance — evidência disponível, limites e ressalva de não certificação.
6. Construtor de Relatórios — composição guiada, tenant-scoped, sobre blocos e fontes locais aprovadas.
7. Agendamentos e Distribuição — intenção de recorrência e entrega futura, sem execução nesta versão.
8. Histórico e Auditoria — histórico local de solicitações e artefatos, distinto da auditoria unificada Microsoft.

## Limites da versão

- V1 é uma camada local, tenant-scoped e predominantemente de leitura; nenhuma tela chama Graph, Office 365 Management Activity API ou outro provedor em tempo de request.
- Templates só usam fatos/publicações locais com fonte, período, cobertura e frescor conhecidos. A Reports API pode ampliar fontes futuras, mas não substitui os fatos já publicados nem autoriza nova coleta redundante.
- O Construtor guiado da primeira release permite selecionar template/blocos aprovados, período e filtros allowlisted sobre publicações locais. A geração CSV/XLSX é efêmera e determinística: o arquivo só existe no download controlado da solicitação; não há storage, URL persistida, download posterior, retenção, expiração ou exclusão de arquivo na V1. PPTX, PDF, IA generativa, links externos, e-mail, Teams, SharePoint, OneDrive, agendamento, aprovação e distribuição são `coming_soon`.
- Custo, economia, renovação e cenário comercial são `unavailable` até entrada vigente do Assessment/CSV por tenant e SKU.
- Defender, Intune, Purview, TCM e fontes especializadas publicam `restricted` ou `unavailable` conforme a execução do customer; não sustentam certificação automática nem ausência de risco.

## Princípios e dependências

- Catálogo e seleção inicial calculam disponibilidade com `ReportTemplate`, requisitos e publicações/source states **atuais** da mesma tenant+conexão; não consultam manifestos de execuções anteriores. Antes da geração há preflight. Somente uma solicitação aceita cria `ReportSourceManifest` imutável com tenant, conexão, versão do template/configuração, publicações selecionadas, source states, período efetivo, parâmetros/filtros normalizados, disponibilidade/cobertura/frescor e hash. A prévia e a geração dessa solicitação usam exclusivamente essa seleção congelada; qualquer mudança material cria novo preflight, solicitação e manifesto.
- Todo requisito de template/bloco é `required` ou `degradable`. Falta/restrição de requisito `required` deixa template/configuração indisponível e bloqueia a geração com motivo. Um `degradable` pode permanecer estruturalmente no relatório como `unavailable`/`restricted`, com fonte, cobertura, frescor e razão, somente quando o contrato do template o permitir; a saída é marcada como parcial e nunca se apresenta como relatório completo.
- A fonte de uso Graph pode redirecionar para CSV pré-autenticado; o download futuro não encaminha `Authorization`, não persiste a URL e trata UPN, nome, produto, site e e-mail como PII.
- A API Office 365 Management Activity permanece fora do recorte: requer audience próprio, `ActivityFeed.Read`, auditoria unificada habilitada e assinatura iniciada por `POST`.
- A fronteira de acesso continua somente `platform admin`, `customer admin` e `member`. Os seis papéis propostos pelo sponsor não autorizam novo RBAC.
- O Construtor guiado respeita essa fronteira: `member` gera a partir de template e filtros permitidos; `customer admin` mantém configurações locais a partir de blocos aprovados; `platform admin` mantém o catálogo global sem acesso ao data plane do customer.
- **Não ampliação de acesso/PII:** nenhuma tela, prévia, geração, exportação, arquivo efêmero ou histórico pode aumentar visibilidade, granularidade ou sensibilidade além da publicação canônica autorizada para tenant, conexão e usuário. Anonimização e mascaramento são preservados; fontes não são combinadas para reidentificar; `restricted` não dispara consulta alternativa; outra conexão/customer jamais é fallback. Exportação usa exatamente o escopo do manifesto e `platform admin` não acessa o data plane do customer.

## Decisões transversais

- **Confirmada — consumo local:** o sponsor afirma que Relatórios não deve refazer coletas e deve consumir principalmente o banco consolidado do Orkestria; telas consultam apenas publicações locais.
- **Confirmada — semântica de uso e licenciamento:** “Usuários ativos M365 (30 dias)” deriva do agregado sem PII de `getOffice365ActiveUserDetail(D30)` publicado pelo domínio de Licenciamento; a série, quando aprovada, deriva de `getOffice365ActiveUserCounts`. “Licenças atribuídas” deriva de `subscribedSkus.consumedUnits`, pela mesma regra de SKUs elegíveis, ativos e incluídos do Inventário. `signInActivity` continua sendo “contas com login ativo”, não substituto desses KPIs.
- **Confirmada — fronteira da Reports API:** ela sustenta uso/adoção. Secure Score, MFA, risco, diretório, grupos, configurações, controles, auditoria local e inventário de licenças são fatos de seus próprios coletores; Health Score, custos/economia, incidentes Defender, CVEs, DLP/Purview e auditoria unificada permanecem indisponíveis até publicação canônica.
- **Confirmada — privacidade:** nomes anonimizados nos usage reports não são reconstruídos; dado individual só aparece dentro de cobertura e autorização publicadas.
- **Confirmada — ressalva regulatória:** relatórios LGPD, ISO 27001, CIS e Zero Trust descrevem controles avaliados, evidências, recomendações e limitações; não declaram certificação automática.
- **Confirmada — decisão do usuário:** o Construtor guiado integra a primeira release. Ele fixa um manifesto imutável e não aceita fórmula arbitrária, SQL, GraphQL, consulta Graph, HTML/JS, URL ou upload executável.
- **Confirmada — decisão do usuário:** o bloco versionado de Taxa de adoção usa o snapshot agregado de uso e o agregado imutável de população elegível publicado na mesma geração de Licenciamento; a definição canônica está em `construtor-de-relatorios/contratos.md`. Sem vínculo inequívoco ou denominador válido, declara `unavailable`.
- **Confirmada — Health Score:** IMDO está fora desta entrega e não há fonte canônica aprovada; o bloco existe, mas permanece `unavailable`, sem nota, meta, variação ou cálculo alternativo.
- **Confirmada — decisão do usuário:** a Office 365 Management Activity API permanece fora desta release; o histórico é local e declara cobertura limitada.
- **Confirmada — lifecycle V1:** `ReportArtifact` persiste somente metadados e evidência de uma geração efêmera (`format`, tamanho, hash, resultado e instante); o conteúdo não é persistido. `ReportRequest`, manifesto, metadados e eventos sanitizados são a trilha reprodutível/auditável.

## Estado

O discovery está estruturado a partir das oito referências do sponsor, do parecer técnico e do parecer QA. Está pronto para futura Spec: a Spec deve definir o primeiro conjunto fechado de templates/blocos, seus requisitos concretos e contratos físicos, sem rediscutir os lifecycles aqui fechados. Agendamento, distribuição, builder livre e fontes externas de auditoria permanecem deliberadamente fora da primeira implementação.
