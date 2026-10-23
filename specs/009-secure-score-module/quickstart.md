# Quickstart — Validação do Secure Score

1. Configurar tenant e permissões de leitura; aplicar migrations da feature.
2. Executar o ciclo coordenado e confirmar score/perfis, MFA reutilizado e fontes correlatas independentes com métricas e estado publicado.
3. Confirmar manifesto composto apenas após score e perfil íntegros do mesmo ciclo; telas não chamam fonte externa.
4. Simular paginação, 429, 401/403, vazio válido e primeira falha; validar retry, `unavailable`/stale e estados sem zero inventado.
5. Simular falha de perfil após score válido; confirmar publicação independente, manifesto anterior preservado e ausência de junção entre ciclos.
6. Publicar duas gerações e validar diffs, Antes x Depois e campos não coletados.
7. Validar as oito superfícies contra [spec.md](./spec.md), inclusive faixas/responsividade, tabelas móveis acessíveis, teclado/anúncio no detalhe, exportação `unavailable` e capacidades `coming_soon`.
8. Rodar `composer ci:check` e `composer test`.
