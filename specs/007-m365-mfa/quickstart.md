# Quickstart: Validar Autenticação (MFA)

## Pré-requisitos

- Dependências da aplicação instaladas em `orkestria360/`.
- Tenant Graph configurado e consentimentos declarados; risco pode permanecer restrito por licença.
- Uma execução concluída do `app:sync-microsoft365` para publicar as fontes disponíveis.

## Verificações

1. Executar os testes focados de sync/página MFA e confirmar os contratos de [dados](data-model.md) e [Inertia](contracts/mfa-inertia.md).
2. Executar `composer ci:check` e, ao concluir o fluxo, `composer test` em `orkestria360/`.
3. Abrir cada uma das oito abas e confirmar os cards mapeados na [spec](spec.md), a última coleta no cabeçalho e ausência do controle Atualizar.
4. Com registro MFA publicado, confirmar Authenticator e telefone conforme `methodsRegistered`; com política SMS/Voice, confirmar que `mobilePhone` só mostra canais aplicáveis aos grupos publicados.
5. Simular/usar estados `restricted`, `unavailable`, falha após publicação e `empty_valid_response`; confirmar que nenhum bloco mostra zero como resultado de fonte ausente.
6. Confirmar teclado, resumo textual de gráficos, rolagem de tabelas em tela estreita e PII minimizada.
7. Para cada uma das oito abas, registrar a validação por teclado e viewport estreito: destino ativo, filtros, detalhe quando publicado, foco visível, rolagem horizontal da tabela, tema e resumo textual do gráfico. A ausência de detalhe ou filtro por fonte não publicada deve manter o título e explicar a indisponibilidade.

## Registro de validação transversal — T059 (2026-08-12)

| Aba | Destino e teclado | Viewport estreito/tema | Resumo e estados |
|---|---|---|---|
| Dashboard Executivo | Tabs alcançáveis por Tab e ativáveis por Enter; não há Atualizar. | Tabs rolam horizontalmente sem overflow global; claro/escuro preservam tokens. | Score, Cobertura, Evolução, Métodos e Tipo mantêm título e razão quando restritos. |
| Cobertura e Registro | Filtros, paginação e Detalhes são operáveis por teclado. | Tabela rola horizontalmente sem cortar o viewport. | Distribuição e Tipo têm resumo; vazio filtrado é distinto de fonte indisponível. |
| Métodos de Autenticação | Tabs e ação `Em breve` têm foco visível e anúncio de indisponibilidade. | Grades empilham e tabela continua navegável. | Segurança, adoção e laterais preservam disponibilidade por fonte. |
| Eventos e Utilização | Período, comparação, granularidade e paginação são navegáveis por teclado. | Filtros empilham e tabela rola horizontalmente. | Linha informa Total/MFA/Falhas; Método preserva título no vazio válido. |
| Falhas e Bloqueios | Filtros, paginação e detalhe são acessíveis por teclado; sem bloqueio/remediação. | Tabela preserva rolagem horizontal. | Linha/categoria/método e rankings distinguem indisponível de resposta vazia. |
| Políticas e Proteção | Controles e tabelas são somente leitura e operáveis por teclado. | Grade de controles quebra sem ocultar destinos. | Tabelas preservam motivo individual de cada endpoint. |
| Usuários de Risco | Filtros e Detalhes são acessíveis por teclado; ações futuras não têm handler. | Tabela rola horizontalmente; lateral permanece após o conteúdo principal. | Tendência e Tipo têm resumo; Admin/MFA mantêm `restricted`/`unavailable` por fonte. |
| Histórico e Auditoria | Cinco filtros, paginação e detalhe são acessíveis por teclado; sem exportação. | Tabela de 11 colunas rola horizontalmente; lateral e subgrid se empilham. | Origens tem resumo; Detalhe/Informações preservam estado explícito até existir seleção/fonte. |

O roteiro foi revalidado contra a representação estrutural das oito abas. A inspeção manual deve ser repetida em um tenant com dados publicados após qualquer alteração de componente compartilhado.

## Roteiro de fonte, licença e telefone (T004)

1. Execute o sync com a fonte de registro MFA disponível e confirme estado
   `available`, cobertura e a última publicação; repita para uma resposta vazia
   válida e confirme `empty_valid_response`, sem total artificialmente zerado.
2. Negue o consentimento ou use um tenant sem licença para risky users/risk
   detections. Confirme `restricted`, motivo sanitizado e preservação da última
   publicação quando houver uma anterior.
3. Publique as políticas SMS e Voice com alvos include/exclude e grupos locais.
   Uma identidade com `mobilePhone` deve apresentar somente os canais
   aplicáveis; sem grupos ou política publicados, o canal deve ser
   `unavailable`, nunca inferido como SMS ou voz.
