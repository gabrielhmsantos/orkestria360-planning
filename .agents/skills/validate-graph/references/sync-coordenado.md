# Sync coordenado Microsoft 365

## Finalidade desta referência

Use este documento para decidir **como uma evidência Graph deve entrar no Orkestria**, não para copiar a implementação atual. Preserve estes princípios mesmo que nomes de classes, etapas ou tabelas evoluam.

## Modelo operacional

1. Uma fonte Graph ou Azure coleta um fato uma vez por ciclo compatível com sua semântica, sempre pela conexão explícita do customer.
2. A coleta ocorre fora de transação de promoção, persiste staging em operações curtas e só publica uma fotografia/event store íntegro.
3. Source state declara disponibilidade, cobertura, frescor, motivo e resultado; falha não converte a última publicação em zero ou vazio.
4. Páginas consultam somente fotografia, source state, projeção ou event store publicado. Elas não chamam APIs externas Microsoft para reproduzir filtro, ordenação, paginação ou agregação local.

## Evidência técnica limitada

A coleta técnica pode observar um endpoint em até duas conexões customer locais.
A segunda só ocorre após restrição explícita por licença na primeira. Essa
amostra complementa documentação e fonte canônica com status, shape e
pré-requisitos observados; ela não mede acesso, cobertura ou disponibilidade de
customers, nem declara o endpoint globalmente restrito. Não autoriza fallback
operacional, leitura cruzada, projeção, sync ou cobertura compartilhada. A
coleta de produção permanece presa à sua própria conexão explícita.

## Decisão de reutilização

Para cada fato, percorra esta ordem:

1. **Projeção local** — o fato e os campos já estão publicados. Documente consumidor local; não proponha nova leitura.
2. **Extensão canônica** — a mesma coleção pode receber campos adicionais sem mudar semântica, permissão, cobertura, cadência ou custo material. Documente a ampliação do `$select` e os consumidores locais.
3. **Leitura complementar** — o campo não cabe na fonte canônica. Solicite somente chave de correlação e campos exclusivos; não repita o superset já materializado.
4. **Nova coleta justificada** — a fonte é semanticamente distinta ou exige permissão, cobertura/cadência ou volume diferente. Documente a justificativa e a estratégia.

Ausência de método no conector de produção não altera essa ordem nem elimina a validação técnica do endpoint.

## Estratégias por semântica

| Fonte | Estratégia | Regras |
| --- | --- | --- |
| Estado com remoções rastreáveis | `delta` | tratar cursor opaco, seguir páginas, aceitar replays, aplicar tombstone, recuperar reset e promover cursor só com fotografia íntegra. |
| Evento histórico | `watermark` | fechar janela no início do ciclo; início inclusivo/fim exclusivo; overlap; paginação total; deduplicar por chave estável; avançar watermark após publicação. |
| Fonte sem delta seguro | `snapshot` | publicar fotografia com cobertura, data de referência e frequência próprias. |
| Relatório CSV/XLSX | `reportRefreshDate` | registrar colunas/redirect e reutilizar conteúdo enquanto a data do relatório não mudar. |

Roles, PIM, MFA e risco usam snapshot periódico até existir contrato específico que aprove outra estratégia. Não inferir histórico incremental deles.

## Exceção condicionada de `signInActivity`

Use esta regra apenas se o trabalho adicionar ou alterar coleta de `/users` ou `/users/delta`:

- consultar `signInActivity` em leitura dedicada, paginada, de `/users`;
- nunca solicitar `signInActivity` em `/users/delta`;
- usar `signInActivity.lastSuccessfulSignInDateTime` para atividade/inatividade;
- reservar `auditLogs/signIns` ao histórico e auditoria de autenticações.

## Contrato de estágio e falha

Todo estágio deve registrar início/fim, duração, páginas, itens lidos/persistidos/deduplicados, tentativas, throttling/retry e motivo sanitizado. Se fonte ou dependência falhar, preserve a publicação anterior e declare `availability`, `coverage`, `freshness`, `reason` e `result_state` em vez de fabricar resultado.
