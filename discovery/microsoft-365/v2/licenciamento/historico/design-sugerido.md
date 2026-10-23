# Design sugerido — Histórico

## Papel da tela

É a memória explicável do ciclo de vida técnico de licenças: o que mudou, quando foi detectado e qual foi o efeito técnico. Dados comerciais e workflow ficam para fase futura.

## Composição sugerida

1. Cabeçalho com período, exportação e atualização.
2. KPIs do período: alterações técnicas, adições, remoções, mudanças de atribuição e falhas; renovação, economia e custo ficam indisponíveis.
3. Linha do tempo pesquisável e filtrável por evento, produto, pessoa e estado de conciliação.
4. Gráficos de evolução quantitativa, com granularidade diária a partir da implantação; evolução financeira fica indisponível até Assessment/CSV.
5. Tabelas de histórico por produto e usuário.

## Interação e estados

- Um evento abre detalhe com fonte, evidência e confirmação técnica; referências comerciais futuras aparecem como indisponíveis.
- A opção “variações detectadas” evidencia mudanças de snapshot ainda sem causa conhecida.
- Datas de ocorrência, detecção e sincronização não devem ser confundidas.
- Ausência de histórico anterior à implantação é um estado de cobertura, não um período sem mudanças.
- A V2 coleta snapshots uma vez ao dia; mudanças intradia podem só aparecer no ciclo seguinte.

## Leitura das referências

A linha do tempo como elemento principal funciona bem, pois preserva contexto causal. Os gráficos devem servir à leitura de tendência e não competir com a trilha de auditoria.
