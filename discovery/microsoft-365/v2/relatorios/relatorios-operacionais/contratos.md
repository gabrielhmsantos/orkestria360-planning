# Relatórios Operacionais — Contratos

- A tela usa projeções locais por domínio; não chama Reports API para paginar, filtrar ou montar CSV em request.
- Exportação CSV/XLSX da solicitação aceita consulta o mesmo manifesto/snapshot/filtro da prévia e retorna metadados sanitizados de período, cobertura e frescor; o arquivo é efêmero e não fica disponível para download posterior.
- Requisito `required` indisponível bloqueia gerar. Requisito `degradable` só pode aparecer como bloco `unavailable`/`restricted` em saída parcial explicitamente permitida pelo template; nunca produz zero, série fictícia ou relatório apresentado como completo.

## Integração com o sync coordenado

- **Resultado: extensão canônica implementada.** Services User Counts, Active User Detail D30 e Active User Counts D180 pertencem ao domínio de Licenciamento; Relatórios consome somente suas publicações locais e não cria coletor, payload ou projeção paralela para usuários ativos.
- A estratégia é `reportRefreshDate`: após download protegido do CSV, normalizar colunas e reutilizar publicação enquanto a data de atualização não mudar. Não há delta seguro.
- Caso seja necessário ampliar a fonte, a coleta ocorre por tenant+conexão, fora da promoção; segue redirect revalidado sem `Authorization`, registra páginas/itens/tentativas/`Retry-After` e promove somente fotografia íntegra.
- `401`, `403`, `404`, `429`, CSV inválido ou falha de redirect preservam a publicação anterior e publicam `availability`, `coverage`, `freshness`, `reason` e `result_state`, sem zero artificial. Um `401`/`403` isolado não prova restrição e permanece `unavailable`; `restricted` exige limitação de licença/acesso confirmada pela resposta.
- Consulta, preview e exportação não ampliam PII: UPN, nome, e-mail, site, IP, identificador ou campo mascarado só saem no mesmo escopo autorizado pela publicação congelada; outra tenant/conexão não é fallback.
- Active User Detail publica para Relatórios apenas a contagem agregada D30 e seu estado. A coleção detalhada, que contém UPN e nome, não é persistida nem projetada sem requisito de produto/autorização específico. Active User Counts D180 persiste somente Office 365 por data do relatório e só habilita linha quando houver pelo menos duas atualizações comparáveis.

- A telemetria operacional usa famílias independentes de `license_usage_publications`: `emails_sent` (Exchange), `meeting_participations` (Teams), `active_sites` (SharePoint) e `storage_used_mb` (SharePoint/OneDrive). Armazenamento é convertido de bytes para MB arredondando para cima; o contrato não armazena bytes. `Meeting Count` é participação de usuário, não reunião única.
- Dispositivos gerenciados e a distribuição de conformidade reutilizam o último ciclo publicado de snapshots Intune; não há nova coleta Intune para Relatórios. A contagem inclui apenas snapshots `published` do `published_sync_cycle_id` da fonte. Zero só é factual quando o estado publicado confirma `empty_valid` com zero itens lidos e persistidos; fotografia ausente é `unavailable`.
