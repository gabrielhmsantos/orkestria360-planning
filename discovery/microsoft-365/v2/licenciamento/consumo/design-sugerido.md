# Design sugerido — Consumo

## Papel da tela

Mostra adoção e ociosidade de forma investigável, separando indicadores consolidados de análises por produto, pessoa e departamento.

## Composição sugerida

1. Cabeçalho com período de análise, exportação e data de atualização do relatório.
2. Cinco KPIs técnicos: licenças atribuídas, usuários ativos, licenças efetivamente utilizadas, ociosas e taxa de adoção; custo sem utilização fica `unavailable` até Assessment/CSV.
3. Duas análises paralelas: tabela por produto com janelas de 7/30/90 dias e tabela pesquisável por usuário.
4. Rodapé analítico: distribuição por departamento, tendência de utilização com seletor de horizonte e painel de ociosidade/alertas/oportunidades.

## Interação e estados

- A janela escolhida precisa ser visível em cada tabela e gráfico; 30 dias não equivale a 90 dias.
- Relatórios anonimizados preservam agregados, mas a visão nominal de usuários deve indicar indisponibilidade.
- Status de usuário (ativo, subutilizado, ocioso, exceção) abre evidência e período analisado.
- O painel de oportunidades encaminha para Otimização, onde regra, confiança e exceção são tratadas.
- A interface informa que a sincronização técnica é diária, com última coleta, próxima execução prevista e eventual defasagem/falha.

## Leitura das referências

A imagem organiza bem o percurso “indicador → produto/pessoa → área/tendência → ação”. A recomendação é manter esse fluxo, evitando interpretar custo ocioso como decisão automática de remoção.
