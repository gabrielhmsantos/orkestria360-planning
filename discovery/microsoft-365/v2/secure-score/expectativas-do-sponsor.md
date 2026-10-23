# Expectativas do sponsor — Microsoft 365 / Secure Score

## Referências primárias

- `Microsoft365_SecureScore.docx` e as oito PNGs no diretório informado.

## Capacidades e superfícies esperadas

| Superfície | Resultado esperado | Blocos/capacidades | Estado e condição |
| --- | --- | --- | --- |
| Dashboard Executivo | compreender postura e oportunidades | score, evolução, categorias, riscos, plano, ambiente, comparativo e insights | disponibilidade dinâmica: `available` com fontes publicadas; `restricted` somente enquanto coleta/autorizações correlatas não permitirem cobertura. |
| Pontuação por Categoria | localizar força e lacuna por domínio | score por categoria, status, comparativo, evolução e Top 5 | disponibilidade dinâmica: `available` com score e perfis publicados; comparativo permanece `unavailable` sem média. |
| Ações de Melhoria | priorizar recomendações | filtros, lista, ganho, esforço, impacto, prazos e rankings | disponibilidade dinâmica para dados Graph; status, prazo e responsável internos permanecem `coming_soon`. |
| Plano de Remediação | acompanhar execução planejada | resumo, projeção, Kanban, roadmap, responsáveis e insights | `coming_soon`: requer workflow interno aprovado. |
| Comparativos e Metas | contextualizar e perseguir objetivo | médias, radar, progresso, projeções e metas | `unavailable`: metas e comparativos internos ainda não existem; Graph pode não retornar média. |
| Evolução e Tendências | entender variações e regressões | séries, eventos, categoria, distribuição e alertas | disponibilidade dinâmica: `available` na cobertura de snapshots publicada; causalidade, previsão e alertas ficam `unavailable`. |
| Controles Aceitos e Exceções | governar não implementação temporária | registros, revisão, detalhe, evidência e distribuição | `coming_soon`: exige fluxo de aceite e auditoria. |
| Histórico e Auditoria | rastrear mudanças observadas de score/controles e coletas | KPIs, filtros, gráficos, log e antes/depois disponíveis | disponibilidade dinâmica: `available` na primeira coleta autorizada; diffs e antes/depois exibem cobertura insuficiente até dois snapshots comparáveis. Causa/autoria e eventos operacionais permanecem `coming_soon` até event store e política de retenção. |

## Critérios transversais

- Exportação e atualização aparecem nas referências; atualizar é coleta sob autorização, exportar exige contrato de privacidade e ambos preservam estado explícito.
- Ações recomendadas orientam investigação. Alterações no tenant não fazem parte desta versão.
- Nenhum número ilustrativo representa referência inicial, meta, tendência ou prazo do tenant.

## Pendências

- Validar fontes, permissões, formatos e associação dos controles com respostas do tenant.
- Aprovar modelo de dados, fluxo de plano/exceção/auditoria e política de retenção.
- Definir se e quando comparativos internos, metas por categoria e ações operacionais serão habilitados.
