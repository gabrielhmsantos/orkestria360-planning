# Design sugerido — Inventário de Licenças

## Papel da tela

É a superfície operacional de consulta e investigação do estado técnico dos produtos licenciados. O contexto comercial é reservado para a fase Assessment/CSV.

## Composição sugerida

1. Cabeçalho com exportação, última sincronização e navegação pelas abas.
2. Faixa de indicadores: produtos ativos, assentos técnicos, atribuídos, disponíveis e produtos em atenção; indicadores comerciais exibem indisponibilidade orientada.
3. Barra de busca e filtros por família, estado técnico/comercial, origem, renovação e filtros avançados.
4. Tabela principal expansível: produto/SKU, família, tipo, compradas, atribuídas, disponíveis, utilização e estado técnico; colunas de custo, vigência, renovação, compromisso e cobrança mostram indisponibilidade até Assessment/CSV.
5. Painel de detalhe do produto selecionado com resumo, usuários atribuídos, planos de serviço, contratos/assinaturas e histórico de alterações.

## Interação e estados

- A expansão não deve esconder a tabela; o detalhe abre abaixo ou em painel lateral conforme largura disponível.
- Campos comerciais podem estar indisponíveis enquanto dados técnicos continuam visíveis.
- Ação “solicitar alteração” exibe “Em breve — nenhuma solicitação ou alteração será realizada”.
- A fonte de cada valor deve ficar disponível no detalhe: Graph, Assessment/CSV futuro ou cálculo interno.

## Leitura das referências

O padrão de tabela densa com detalhe contextual é adequado ao caso de uso. Em telas menores, filtros e colunas devem priorizar produto, capacidade, utilização, renovação e atenção.
