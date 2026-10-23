## Microsoft 365 activity seams

- `App\Support\Microsoft365\GraphDataClient` agora usa dois endpoints adicionais para enriquecer a overview:
  - `GET /admin/serviceAnnouncement/issues` para `recentActivity` de incidentes/advisories
  - `GET /auditLogs/directoryAudits` para `recentActivity` de mudanças administrativas
- `directoryAudits` exige permissão de Graph para audit logs. Sem ela, o tenant retorna `403 Authentication_MSGraphPermissionMissing`, enquanto `serviceAnnouncement/issues` pode seguir funcionando normalmente.
- `App\Support\Microsoft365\Microsoft365OverviewPageData` continua tratando `tenantHighlights` como bloco derivado, mas passa a ancorá-lo em `service issues`, `directory audits`, `secure score` e `license distribution`.
