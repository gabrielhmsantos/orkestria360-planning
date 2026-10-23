# Bindings e fixtures

Em `reconciled` data-backed, cada dado exibido declara fixture/cenário, path, tipo, formatter, unidade, null, ausência e transformação exclusivamente visual. Aponte à fixture do contrato Orkestria, nunca a endpoint, provider ou mapping externo. Sem fixture rastreável, mantenha `conceptual`; valor sintético é exemplo permitido, não autorização para semântica nova.

Além do path, decida e registre no mapa de composição onde ocorre cada transformação: projeção da superfície/adaptador de domínio ou renderização de uma API documentada. Declare quais regiões leem o mesmo recorte e quais são snapshots independentes ou dados estáveis por tenant. Uma região não deve recalcular por conta própria o filtro compartilhado, nem derivar um KPI de uma tabela, a menos que o contrato de produto defina essa relação.

Componentes de apresentação recebem fatos e classificações já projetados. Não lhes atribua decisões de domínio — por exemplo, thresholds, agregações, interpretação de ausência ou disponibilidade — apenas porque a API comporta um valor visual semelhante.

Filtro não precisa de fixture quando opções e default forem estáticos e definidos por produto/contrato. Nesse caso, declare `product contract` como proveniência em sua especificação, opções/default e interação; não invente binding de fixture. Filtros cujas opções/defaults dependem de dados continuam rastreáveis à fixture.
