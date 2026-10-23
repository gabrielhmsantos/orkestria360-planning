# Histórico e Auditoria — Contratos

- Dados: data, categoria, atividade, alvo/ator minimizados, resultado, contexto, origem, antes/depois e correlação.
- Integração: Graph `/auditLogs/directoryAudits` e store de auditoria Orkestria; `AuditLog.Read.All` conforme DOCX.

## Integração com o sync coordenado

Fato canônico: `GET /auditLogs/directoryAudits`; decisão: projeção local do event store publicado. Estratégia watermark com janela `[início,fim)`, overlap de 15 min, páginas completas e deduplicação por `id`; quando Graph limita o início histórico, registrar a menor data aceita e repetir uma vez. Auditoria interna é fonte separada. A tela não chama Graph e, em falha/restrição, mantém a publicação anterior com metadata de fonte. Métricas de etapa e promoção atômica ocorrem depois do staging, sem HTTP na transação.
