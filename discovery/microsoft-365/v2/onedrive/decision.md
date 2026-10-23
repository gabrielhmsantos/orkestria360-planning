# Decisão de implementação — fontes OneDrive

## Relatórios OneDrive para o simulador

Os três relatórios de uso são adicionados como cobertura `SUPPORTED` do simulador para permitir implementação e testes da projeção local antes de existir coletor da aplicação. A decisão se apoia em contrato oficial, `302` esperado observado em duas conexões customer e `Reports.Read.All` presente. Os fixtures são inteiramente sintéticos e não representam conteúdo de nenhum tenant.
