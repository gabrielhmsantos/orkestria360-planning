# Research — Secure Score

## Fonte canônica e sincronização

**Decision**: duas fontes canônicas independentes, score diário e catálogo de perfis, no ciclo coordenado existente.

**Rationale**: score e catálogo têm semânticas distintas; telas devem ler dados publicados e o tenant validou ambas as fontes.

**Alternatives considered**: coletor único atômico (rejeitado: 429 do catálogo descarta score válido); leitura externa por tela (rejeitada: perde cobertura/frescor e repete custo).

## Consistência histórica

**Decision**: perfil imutável por versão e manifesto composto por publicação.

**Rationale**: máximo, categoria e depreciação podem mudar; catálogo atual não pode reescrever o passado.

**Alternatives considered**: catálogo atual para histórico (rejeitado: altera séries retroativamente); não mostrar mudança de perfil (rejeitado: reduz capacidade já demonstrável).

## Deduplicação e revisões de score

**Decision**: usar checksum para deduplicar a releitura de `tenant + graph_score_id`; retry com checksum idêntico é no-op e payload alterado após publicação cria uma revisão imutável compatível.

**Rationale**: preserva o passado publicado, evita eventos/diffs duplicados em retry e permite corrigir uma fotografia observada sem atualização destrutiva.

**Alternatives considered**: sobrescrever a fotografia publicada (rejeitado: reescreve histórico); sempre criar nova geração (rejeitado: cria séries e diferenças artificiais).

## Estados de fonte e UX

**Decision**: estado por tenant/execução com disponibilidade, cobertura, frescor, motivo e resultado.

**Rationale**: vazio válido, restrição, falha defasada e capacidade futura têm sentidos diferentes.

**Alternatives considered**: hardcode de restrição (rejeitado: impede promoção em tenant autorizado); vazio como zero (rejeitado: fabrica postura).

## Comparativos e histórico

**Decision**: mostrar Você/Média sem meta; histórico mostra coletas na primeira publicação e diffs com duas gerações comparáveis.

**Rationale**: preserva leitura útil sem meta, causa ou autoria inventada.
