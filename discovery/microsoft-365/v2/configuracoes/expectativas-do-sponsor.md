# Expectativas do sponsor — Microsoft 365 / Configurações

## Referências primárias

- `Microsoft365_Configurações.docx` e as oito PNGs do diretório informado.

## Capacidades e superfícies esperadas

| Superfície | Resultado esperado | Estado e condição |
| --- | --- | --- |
| Dashboard Executivo | postura consolidada, conformidade, risco, cobertura, drift e recomendações de investigação | `available` na cobertura de conectores publicados; score segue a decisão do usuário. |
| Configurações do Tenant | propriedades, branding, domínios, grupos e configuração transversal | leitura `available` conforme Graph e autorização. |
| Identidade e Acesso | políticas Entra, métodos, administração, PIM e aplicações | leitura `available`/`restricted` conforme consentimento e funções. |
| Colaboração e Compartilhamento | SharePoint, OneDrive, convidados, grupos e Teams | disponibilidade de leitura por conector; dados de usuários podem ser `restricted`. |
| Segurança e Compliance | Defender, proteção de dados, Purview, auditoria e baselines | cobertura por fonte e conector homologado. |
| Configurações por Serviço | catálogo filtrável e detalhe de configuração | `available` somente para itens normalizados com metadados de origem. |
| Baselines e Conformidade | baselines publicados, cobertura e divergências | `available` com snapshots comparáveis; sem snapshot, `unavailable` com causa. |
| Histórico e Auditoria | trilha de mudanças observadas, evidências de leitura e diffs | `available` após coleta e armazenamento histórico; autoria externa e payloads podem ser `restricted`. |

## Critérios transversais

- A estrutura ilustrada permanece visível quando a fonte ainda não habilita o bloco.
- A primeira implementação cobre exclusivamente leitura, filtros, navegação, exportação e relatórios sobre dados coletados.
- Exportação e relatórios usam exclusivamente dados já coletados pelo Orkestria 360; são leituras e permanecem disponíveis conforme dados e política de privacidade.
- Para cada item, a experiência informa origem, versão de API, permissão, cobertura e condição de leitura.

## Pendências

- Homologar o catálogo e a leitura por configuração e tenant.
- Definir retenção, acesso a evidências e tratamento de dados pessoais.
