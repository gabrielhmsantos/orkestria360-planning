# Design sugerido — Dashboard Executivo

## Papel da tela

É a porta de entrada do submódulo. Deve responder rapidamente “qual é o estado, onde está o risco e qual ação merece atenção”, sem substituir as análises das abas especializadas.

## Composição sugerida

1. Cabeçalho com título, descrição curta, seletor de período e filtros globais.
2. Faixa de KPIs: licenças totais, utilizadas, disponíveis e health score técnico; custo e economia exibem indisponibilidade orientada.
3. Linha analítica: donut de utilização, oportunidades com evidência homologada e tendência técnica; evolução de custo e vencimentos ficam indisponíveis.
4. Oportunidades de otimização em cards de prioridade; cada uma leva à análise, não executa mudança.
5. Linha operacional: tabela resumida de produtos, distribuição por departamento e tendência de utilização.
6. Coluna/rodapé de avisos técnicos; ações comerciais e renovações exibem “Em breve”.

## Interação e estados

- Custo, economia e renovação exibem estado indisponível quando faltar base comercial; não usar zero como substituto.
- Cada bloco mostra origem e última atualização ao abrir detalhes.
- Links devem preservar o filtro de período ao navegar para Consumo, Custos, Otimização ou Planejamento.

## Leitura das referências

As imagens favorecem hierarquia por cards e painéis, com oportunidades e renovação visíveis acima da dobra. Isso é uma boa direção de informação, não especificação visual rígida.
