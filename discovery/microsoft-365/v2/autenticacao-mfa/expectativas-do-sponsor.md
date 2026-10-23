# Expectativas do sponsor — Microsoft 365 / Autenticação (MFA)

## Referências primárias

- `Microsoft365_Autenticação (MFA).docx` e `01` a `08` PNG no diretório de referências informado.

## Capacidades e superfícies esperadas

| Superfície | Resultado esperado | Blocos/capacidades | Estado e condição |
| --- | --- | --- | --- |
| Dashboard Executivo | entender a postura geral | Health Score, KPIs, cobertura, tendência, métodos, alertas, tipo de usuário e aplicações | `restricted`: depende da publicação das fontes. |
| Cobertura e Registro | localizar preparo e lacunas | KPIs, distribuição, evolução, tipo, tabela e oportunidades | `available` para registro publicado; exceções e histórico dependem de fonte própria. |
| Métodos | orientar adoção de métodos seguros | distribuição, adoção, nível, catálogo e recomendações | `restricted`: uso detalhado e política exigem permissões/licenças. |
| Eventos | compreender autenticações efetivas | tendência, método, aplicação, localização, dispositivo e eventos | `restricted`: requer sign-ins e cobertura declarada. |
| Falhas | investigar problemas e sinais | falhas, categorias, métodos, recorrência, IPs e aplicações | `restricted`: requer sign-ins e regras normativas configuradas. |
| Políticas | avaliar controles de proteção | métodos, forças, CA, defaults, exceções e verificações | `restricted`: requer permissões de Policy/CA e dados internos de exceção. |
| Risco | priorizar identidades e detecções | KPIs, tendência, tipos, localização, tabela e recomendações | `restricted`: requer Entra ID Protection e consentimento. |
| Histórico | rastrear mudanças e ações | KPIs, tabela, detalhe, origens e retenção | `restricted`: requer auditoria Graph e armazenamento interno. |

## Critérios transversais

- Há controles globais de período, filtro, atualização e exportação nas referências; exportação exige contrato de privacidade e não está aprovada neste discovery.
- Toda ação recomendada orienta investigação. Alterações no tenant exigem fluxo futuro explícito.
- Cada bloco deve declarar fonte, cobertura, frescor e condição de disponibilidade.

## Pendências

- Validar critérios do MFA Health Score e do MFA Protection Score.
- Confirmar o conjunto mínimo de permissões/licenças e a política de retenção.
- Decidir quais ações, se alguma, serão habilitadas após a versão somente leitura.
