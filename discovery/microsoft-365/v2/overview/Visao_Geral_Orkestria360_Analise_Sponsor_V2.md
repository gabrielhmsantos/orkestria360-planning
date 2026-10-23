# Visão Geral Microsoft 365 — Análise do Sponsor V2

## Finalidade

Consolidar a intenção de produto definida pelo sponsor para a Visão Geral do módulo Microsoft 365. Este documento interpreta conjuntamente `Microsof365_VisaoGeral.docx` e `HealthScore.xlsx`, ambos em `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Visão Geral/`.

Os arquivos em `discovery/microsoft-365/v2/health-score/` permanecem como histórico técnico V1. Esta V2 não altera nem presume compatibilidade numérica com eles.

## Narrativa de produto

O Microsoft entrega dados distribuídos por portais e workloads. O Orkestria 360 deve entregar uma leitura integrada: estado atual, significado dos sinais, prioridades e evolução do ambiente.

O índice proprietário da plataforma passa a se chamar **Índice de Maturidade Digital Orkestria (IMDO)**. “Health Score” é uma denominação histórica e não deve ser usada como rótulo principal da experiência.

## Submódulos confirmados

1. Visão Geral
2. Licenciamento
3. Usuários e Contas
4. Grupos
5. Autenticação (MFA)
6. Secure Score
7. Microsoft Defender
8. Intune
9. SharePoint
10. OneDrive
11. Teams
12. Exchange
13. Configurações
14. Relatórios

O IMDO é a síntese transversal desses submódulos; ele não substitui Secure Score nem qualquer score nativo da Microsoft.

## Blocos da tela

| Bloco | Pergunta respondida | Resultado esperado |
| --- | --- | --- |
| IMDO | Como está meu ambiente hoje? | Nota, classificação somente quando homologada, pilares, cobertura e confiabilidade. |
| KPIs executivos | Quais são os principais indicadores? | Leitura concisa de usuários, licenças, serviços, segurança e demais métricas prioritárias. |
| Plano de ação inteligente | O que devo fazer agora? | Ações ordenadas por criticidade, impacto, evidência e módulo de destino. |
| Insights inteligentes | O que os dados significam? | Síntese de pontos positivos, melhorias e pontos críticos. |
| Evolução do ambiente | Como o ambiente evoluiu? | Série histórica do IMDO, pilares e indicadores quando houver snapshots válidos. |
| Valor gerado pelo Orkestria | Qual foi o impacto da plataforma? | Melhorias comprovadas, riscos reduzidos, economia ou cobertura ampliada; não inferir sem baseline. |
| Integração com o Orkestria 360 | Como os módulos contribuem? | Proveniência e atalhos para Governança, Assessment, Segurança, Produtividade e módulos Microsoft 365. |

## Escopo do IMDO

O sponsor definiu seis domínios: Segurança, Governança, Licenciamento e Custos, Compliance, Disponibilidade e Produtividade. Os pesos e a matriz pertencem a `../imdo/`.

Na Visão Geral desta etapa, o bloco ocupa a posição de abertura da tela, mas é apresentado como **IMDO — Em breve**. A tela pode explicar os seis domínios e a proposta do índice, mas não exibe nota, classificação, pesos aplicados, tendência ou pilares pontuados até que o modelo, as fontes e os contratos internos estejam prontos para uma leitura honesta.

Três dimensões devem ser apresentadas sem serem confundidas:

- **nota**: qualidade medida pelos indicadores com regra homologada;
- **cobertura**: parcela ponderada de sinais disponíveis e interpretáveis;
- **confiabilidade**: qualidade da origem da evidência, indicada pelo sponsor como 100% Microsoft/Defender/Intune/Entra/Exchange, 80% Assessment, 70% Estruturação e Governança e 50% informação manual.

Confiabilidade e cobertura não alteram a nota do IMDO nesta V2. Elas qualificam a leitura da nota.

## Decisões registradas

- A Visão Geral é uma superfície executiva; não deve exibir detalhes técnicos sem contexto ou ação associada.
- O índice integra fontes Microsoft e fontes internas; não é um cálculo exclusivamente Graph.
- Nesta etapa, o IMDO é apresentado como “Em breve”; nenhum score de exemplo, classificação ou gráfico de evolução pode ser usado como dado operacional.
- O Secure Score deve permanecer visível como evidência de Segurança, mas não representa sozinho o IMDO.
- Custos, preço contratado e economia potencial usam uma Base de Custos de Licenças Orkestria vinculada ao tenant e ao SKU; a Graph permanece normativa para SKUs e quantidades, não para preço efetivamente pago.
- Ações priorizadas e insights inteligentes são registros persistidos por tenant, administráveis no futuro e passíveis de origem manual, por regra ou por análise assistida por IA; a origem, a evidência e a revisão humana permanecem visíveis.
- Regras sem fórmula, limiar ou fonte disponível devem aparecer como pendências de homologação, não como cálculo presumido.
- O bloco de evolução exige persistência temporal; a ausência de histórico deve ser comunicada como indisponibilidade, não como estabilidade.

## Fora de escopo nesta etapa

- Alteração da página, APIs, persistência ou componentes da aplicação.
- Script, comando Artisan ou execução automatizada dos cálculos.
- Alteração de componentes para apresentar a classificação operacional definida no modelo IMDO.
