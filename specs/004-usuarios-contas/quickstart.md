# Quickstart: Usuários e Contas Microsoft 365 V2

1. Em `orkestria360/`, configurar as credenciais app-only já utilizadas pelo módulo Microsoft 365 e o timezone IANA do tenant (inicialmente `America/Sao_Paulo`). Conceder somente permissões Graph documentadas para cada fonte e esperar estados `restricted` quando a licença ou permissão não existir.
2. Executar migrations e iniciar a sincronização do tenant de teste:

   ```bash
   php artisan migrate
   php artisan app:sync-microsoft365-users-accounts
   ```

3. Confirmar que a execução publicou uma única `snapshotGeneration`, mantendo fontes restritas como blocos explícitos e sem transformar falhas em contagens zero.
4. Autenticar com uma sessão verificada e abrir `/microsoft-365/usuarios-e-contas`. Confirmar as oito abas na ordem da especificação e o estado/fonte/cobertura em cada bloco; esta V2 não diferencia o acesso por papel.
5. No Diretório, buscar e filtrar uma identidade, abrir o detalhe e voltar mantendo o recorte. Validar separadamente “sem correspondências”, resposta vazia válida e fonte restrita.
6. Em Saúde, confirmar score, achados, categorias, distribuição, evolução e recomendações como `unavailable` até aprovação do catálogo. Em Privilégios, confirmar que PIM sem P2 fica `restricted`; em Ciclo de Vida, confirmar que nenhuma ação é executada.
7. Solicitar CSV autorizado de Diretório e Histórico/Auditoria; conferir cobertura/sensibilidade, as allowlists previstas, ausência de URL temporária e ausência de PII nos logs.
8. Rodar `composer ci:check` após lotes de implementação e `composer test` como gate final.

## Validação manual dos critérios de sucesso

- **SC-001 — investigação inicial em até 3 minutos:** com uma fotografia publicada, abrir o Dashboard Executivo, identificar uma métrica que exige investigação e confirmar no mesmo bloco a fonte, a cobertura e a última atualização. Não considerar um bloco `restricted` ou `unavailable` como contagem zero.
- **SC-002 — Diretório e perfil em até 3 interações:** abrir Diretório, aplicar um filtro ou busca, selecionar uma identidade e conferir que o botão de retorno preserva o recorte. Repetir a verificação a partir de Atividade, Contas Privilegiadas e Convidados quando houver dados publicados.
- **Estados de cobertura:** abrir Atividade, Contas Privilegiadas e Convidados com fontes limitadas e confirmar que a tela mostra o motivo de `restricted`/`unavailable`, sem esconder os dados locais que continuam disponíveis.

## Validação durante o desenvolvimento

Execute os testes isolados em `tests/Feature/UsersAccounts/` depois de cada
história. Antes de avançar uma fase, rode `composer ci:check`; antes de concluir
a feature, rode `composer test` e a validação navegador via Playwright contra a
sessão autenticada.
