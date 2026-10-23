# Quickstart: Licenciamento Microsoft 365 V2

1. Em `orkestria360/`, configurar credenciais Graph já usadas pelo módulo Microsoft 365 e executar a sincronização técnica do tenant de teste.
2. Executar `php artisan test tests/Feature` para validar autenticação, contratos Inertia, faltas de fonte e isolamento por tenant.
3. Abrir `/microsoft-365/licenciamento` autenticado e confirmar cards técnicos, fonte/data/frescor e links para as sete abas.
4. Em Inventário/Consumo, validar paginação, origem de atribuição, relatório identificado/anonimizado e datas separadas de coleta e relatório.
5. Em Otimização/Histórico/Planejamento, confirmar evidência, confiança, eventos e premissas; nenhuma ação operacional deve alterar tenant.
6. Em Custos, confirmar a mensagem “Aguardando dados comerciais do Assessment” sem preço, renovação ou valores fictícios.
7. Executar `composer ci:check` durante lotes e `composer test` como gate final.
