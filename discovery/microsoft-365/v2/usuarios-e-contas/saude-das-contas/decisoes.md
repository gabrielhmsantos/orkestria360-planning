# Saúde das Contas — Decisões

- Categorias iniciais incluem bloqueio, licença, atributos ausentes, gestor, localização, UPN, domínio e sincronização — Word §3.
- Qualidade cadastral mede completude e usa os pesos do Word §3.1: nome 10%, UPN 10%, e-mail 10%, departamento 15%, cargo 10%, gestor 15%, empresa 10%, Employee ID 10% e Usage Location 10%. O índice é a soma ponderada da completude de cada critério.
- O Word não define faixas qualitativas. A imagem do Dashboard confirma `82 = Muito Bom`; para tornar o indicador determinístico, as faixas adotadas são: `80–100 Muito Bom`, `60–79 Bom`, `40–59 Ruim` e `0–39 Péssimo`.
- Catálogo inicial aprovado: críticos são conta desabilitada com licença e risco; altos são inatividade crítica, ausência de MFA e Member sem licença; médios são cadastro incompleto e ausência de gestor; baixos são UPN inválido e Usage Location ausente. Guest sem licença não gera achado.
- Cadastro incompleto conta uma identidade uma vez quando faltar nome, e-mail, departamento, cargo, empresa ou Employee ID. Gestor, UPN e Usage Location continuam categorias específicas. Achados podem se sobrepor por identidade; o donut soma problemas, não pessoas únicas.
