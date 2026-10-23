# APIs — Histórico e Auditoria

Não há rota externa própria. O histórico de relatórios é uma trilha local sanitizada, distinta da Office 365 Management Activity API.

## Uso pela aplicação

Resultado: **projeção local**. Eventos externos só aparecem se já existirem no event store canônico; a superfície não inicia assinatura de auditoria, não mostra payload e não chama Microsoft em tela. O arquivo V1 é efêmero: a trilha expõe apenas metadados sanitizados, hash e resultado.
