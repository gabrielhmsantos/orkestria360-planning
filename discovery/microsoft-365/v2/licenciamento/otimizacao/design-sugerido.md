# Design sugerido — Otimização

## Papel da tela

É a central de investigação assistida: transforma evidência de inventário e uso em recomendações técnicas priorizadas. Custo, simulação, exceção e aprovação ficam para fase futura.

## Composição sugerida

1. Faixa de resumo: oportunidades técnicas, licenças para análise e erros de atribuição; economia e resultado realizado ficam indisponíveis.
2. Tabela de oportunidades priorizadas com recomendação, categoria, evidência, confiança e ação contextual.
3. Painel de distribuição por categoria; economia potencial fica indisponível até Assessment/CSV.
4. Tabelas complementares por produto e por usuário, com pesquisa e filtros de status.
5. Simulador de economia e chamadas de aprovação exibem “Em breve”.
6. Blocos de exceções, validações, aprovações e resultados realizados ficam para fase futura.

## Interação e estados

- O simulador não está disponível na V2; seu controle exibe “Em breve”.
- Cada recomendação abre evidência, recursos afetados, período, confiança, risco e exceções aplicáveis.
- A ação disponível é analisar evidência. Realocar, remover, simular e solicitar aprovação exibem “Em breve — nenhuma solicitação ou alteração será realizada”.
- Economia potencial, aprovada e realizada ficam indisponíveis até haver preço Assessment/CSV e workflow futuro.

## Leitura das referências

As referências acertam ao reservar área considerável para o simulador e para o resultado alcançado. A implementação deve preservar o caráter humano de validação antes da execução.
