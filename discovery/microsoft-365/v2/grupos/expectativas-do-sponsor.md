# Expectativas do sponsor — Microsoft 365 / Grupos

## Referências primárias

- `Microsoft365_Grupos.docx`
- Imagens `01.Dashboard Executivo.png` a `08.Histórico e Auditoria.png`

## Capacidades e superfícies esperadas

| Superfície | Resultado esperado | Blocos ou capacidades | Estado e condição |
| --- | --- | --- | --- |
| Dashboard Executivo | Priorizar saúde e riscos dos grupos | KPIs, distribuição, tendência, score, tabela, atenção e recomendações | `available` para estrutura; score e indicadores internos dependem de regras/dados. |
| Diretório de Grupos | Consultar e contextualizar grupos | filtros, tabela, resumo, alertas, exportação e ações rápidas | `available` para leitura Graph; mutações são `coming_soon`. |
| Membros e Proprietários | Investigar acesso e responsabilidade | lista, detalhe, distribuição, alertas e recomendações | `restricted` conforme visibilidade de membros/proprietários e atributos de identidade. |
| Grupos Dinâmicos | Monitorar regras e seus efeitos | KPIs, regras, saúde, alterações e simulador | `restricted` por licença Entra ID P1/P2; simulador é `coming_soon`. |
| Licenciamento por Grupo | Controlar atribuições, erros e desperdício | distribuição, uso, tabela, custo e oportunidades | `restricted` por dados de licença; custo real é `unavailable` sem fonte interna. |
| Governança e Ciclo de Vida | Assegurar finalidade, responsável e revisão | status, fluxo, expiração, políticas, tabela e ações | `available` para estrutura; política e revisão interna são `unavailable` sem modelo aprovado. |
| Atividade e Inatividade | Investigar grupos sem uso sem falsos positivos | faixas, tendência, impacto, lista e ações | `restricted` por reports e tipo de grupo; segurança sem telemetria fica `unavailable` como evidência direta. |
| Histórico e Auditoria | Investigar alterações e exclusões | métricas, tendência, log, detalhe, retenção e exportação | `restricted` por auditoria/retenção; persistência histórica depende do Orkestria. |

## Critérios transversais

- Exibir origem, atualização e condição de disponibilidade em toda leitura baseada em dados.
- Manter filtros e aprofundamento contextual sem perder a superfície selecionada.
- Preservar ações na UI como intenção, mas rotulá-las `coming_soon` até autorização, confirmação e auditoria.
- Não tratar ausência de atividade como inatividade comprovada, sobretudo para grupos de segurança.

## Pendências

- Homologar score, limiares de saúde, janelas de inatividade e critérios de classificação.
- Definir modelo e responsáveis pelo cadastro interno de governança, custos e documentos.
- Validar permissões, licenças, retenção e contratos Graph por capacidade.
