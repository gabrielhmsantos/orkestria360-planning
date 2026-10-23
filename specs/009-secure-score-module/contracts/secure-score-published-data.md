# Contract — Secure Score Published Data

```text
published_availability: available | restricted | unavailable | coming_soon
coverage: período, contagens, campos e limitações
freshness: geração exibida e indicação de defasagem
reason: explicação sanitizada
latest_attempt_result: success | empty_valid | failed | restricted
```

- Telas leem somente projeções publicadas.
- Vazio válido = disponível, cobertura zero e empty state; nunca score/risco zero.
- Primeira falha sem publicação = `published_availability: unavailable`, motivo sanitizado e sem zero/vazio fabricado.
- Falha/restrição posterior mantém a última geração disponível, mostra frescor defasado/motivo e registra `latest_attempt_result` sem substituir a disponibilidade publicada.
- Restrição é dinâmica por tenant/execução.
- Durante filtro/navegação, loading anuncia progresso e preserva a última publicação visível; `published` nunca é estado exibido à UI.
- Coletas aparecem na primeira publicação; diffs e Antes x Depois exigem duas publicações comparáveis.
- Diferenças não inferem causa, autoria, IP ou correlação.
