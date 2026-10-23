# Atividade e Inatividade — Produto

- Papel: revelar uso real, inatividade e potencial risco/desperdício.
- Resultado esperado: distinguir faixas de atividade, contas nunca usadas e contas inativas ainda licenciadas.
- Fonte: Word §4 e imagem `04`.
- Regra operacional: inatividade crítica usa `lastSuccessfulSignInDateTime` acima da janela configurada do tenant (`inactive_90_days`, padrão de 90 dias). Contas sem login não compõem esse total e permanecem em “Nunca acessaram”.
