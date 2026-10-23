# Contract: Sync — Autenticação (MFA)

| Fato | Fonte canônica | Estratégia | Consumidores |
|---|---|---|---|
| Registro e métodos | `userRegistrationDetails` | Snapshot periódico correlacionado por `id` | Dashboard, Cobertura, Métodos. |
| Política de métodos/SMS/Voice | `authenticationMethodsPolicy` | Novo snapshot periódico | Métodos, Políticas, Dashboard. |
| Proteções de autenticação | Authentication strengths, Conditional Access e security defaults | Snapshots independentes por endpoint | Políticas, Dashboard. |
| Eventos e falhas | `auditLogs/signIns` | Event store por watermark canônico | Eventos, Falhas, Dashboard. |
| Auditoria | `auditLogs/directoryAudits` | Event store por watermark canônico | Histórico, Dashboard. |
| Risco | `riskyUsers` e `riskDetections` | Snapshots independentes quando licença/consentimento permitir | Risco, Dashboard. |

- Em cada ciclo de sync, a etapa de política consulta novamente `authenticationMethodsPolicy` e publica `Sms` e `Voice` com estado, alvos e `isOfficePhoneAllowed`. Os endpoints individuais de SMS e Voice foram usados apenas na validação técnica e não são chamados em produção, pois repetiriam o fato já entregue pela política consolidada.
- Falha ou 403 de uma das quatro fontes de política não torna as demais indisponíveis; o estado é publicado por endpoint, preservando a última fotografia válida daquela origem.
- Em falha, restrição ou licença ausente, preservar publicação anterior e emitir `availability`, `coverage`, `freshness`, `reason` e `result_state`.
- Toda coleta ocorre antes de staging/promoção; telas e filtros usam somente dados publicados.
- `app:sync-microsoft365 --force` reinicializa a janela de retenção dos event stores `auditLogs/signIns` e `auditLogs/directoryAudits` para recoleta/deduplicação completa. Não remove watermark, eventos ou lotes publicados antecipadamente: somente uma janela concluída avança a posição; falha preserva a publicação anterior.
