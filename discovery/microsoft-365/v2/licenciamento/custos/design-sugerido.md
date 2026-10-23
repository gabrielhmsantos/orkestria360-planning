# Design sugerido — Custos

## Papel da tela

Na V2, comunica de forma orientada que dados financeiros ainda não foram recebidos pelo Assessment. A análise financeira será habilitada posteriormente.

## Composição sugerida

1. Cabeçalho com explicação da dependência de dados comerciais e ação “Em breve” para importação Assessment/CSV.
2. Estado vazio orientado: “Aguardando dados comerciais do Assessment”; nenhum KPI financeiro recebe zero substituto.
3. Prévia das análises que serão habilitadas: evolução, custo por produto/departamento/usuário, eficiência, orçamento e renovação.

## Interação e estados

- Quando a fase comercial existir, mostrar `estimado`, `conciliado` ou `incompleto` junto aos valores financeiros.
- A tabela futura compara quantidade faturada, capacidade técnica e utilização; diferenças são alertas, não correções automáticas.
- O período de evolução pode variar (3/6/12/24 meses), desde que haja snapshots comparáveis.
- Informações de margem/custo interno só aparecem para perfis autorizados; o design deve suportar ocultação de colunas.

## Leitura das referências

O layout é consistente ao colocar evolução e custo por produto no núcleo, seguido por alocação e eficiência. A próxima renovação merece destaque por ser uma decisão temporal, não somente um KPI.
