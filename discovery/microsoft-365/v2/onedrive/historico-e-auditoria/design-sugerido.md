# Histórico e Auditoria — Design sugerido

- **C9 aceita A:** preservar “Atividades Críticas (Últimas24h)” com contexto
  “Eventos de risco Alto ou Crítico”. Até cinco eventos publicados, Crítico
  antes de Alto, mais recentes primeiro dentro do nível e ID estável no empate.
  Os filtros mantêm a interseção da lista base publicada, sem preencher vagas
  com eventos não incluídos. Não exibir rotina como crítica, criar linha de
  evento para detector local ou afirmar ausência global com cobertura parcial.
  Os valores/IDs históricos da fixture não provam essa nova seleção; a
  integração materializará o contrato e seus estados aprovados.

- KPIs do período antecedem filtros temporais e de evento, pessoa, ação, localização, dispositivo e resultado.
- A faixa analítica apresenta categorias, evolução, risco e principais pessoas; a tabela dominante de eventos recentes fica ao lado de atividades críticas e cobertura de fontes.
- Detalhe de evento abre no fluxo da tela, mantém o resultado da consulta e apresenta, quando publicados, operação, proprietário, usuário executor, arquivo, caminho, IP, localização, dispositivo, user agent, destinatário externo, permissão, antes/depois, correlation ID, origem, JSON e ação recomendada.
- **Estados aplicáveis:** `available`, `partial` quando fontes/categorias tiverem cobertura declarada parcial, `stale`, `restricted`, `unavailable` e `failed`; evento ausente não prova ausência de atividade.
