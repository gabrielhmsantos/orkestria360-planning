# Contract: Sincronização de Usuários e Contas

## Entrada do command

```text
php artisan app:sync-microsoft365-users-accounts {--force}
```

- `--force` repete o ciclo de forma controlada, sem publicar uma fotografia parcial.
- O command e a agenda usam exclusivamente `TenantContext`/a conexão Graph configurada; `tenant_id` permanece escopo persistido, não argumento multi-tenant.
- A agenda resolve o timezone IANA de `TenantActivitySetting` do tenant configurado (valor inicial `America/Sao_Paulo`) e usa um lock único dessa sincronização.

## Resultado estrutural

```ts
type SyncSourceResult = {
  source: string;
  availabilityStatus: 'available' | 'restricted' | 'unavailable';
  freshness: 'fresh' | 'stale' | 'unavailable';
  coverage: { from?: string; to?: string; description: string };
  itemCount: number | null;
  diagnostic?: 'empty_valid_response' | 'permission_missing' | 'premium_license_required' | 'not_found' | 'throttled' | 'transient_failure' | 'graph_error';
};

type IdentitySyncResult = {
  tenantId: string;
  generationId: string;
  status: 'completed' | 'failed' | 'skipped';
  published: boolean;
  sources: SyncSourceResult[];
};
```

## Regras de publicação

1. Criar `IdentitySyncRun` e uma geração `staging` sob lock do tenant configurado; ao iniciar delta, materializar no staging a geração publicada.
2. Buscar Diretório paginado. Em delta, seguir `@odata.nextLink` até receber `@odata.deltaLink`, fazer merge por `graph_id` e gravar `@removed` como tombstone; guardar links somente como dados protegidos.
3. Coletar enriquecimentos de modo isolado. Uma falha de MFA, PIM, risco, auditoria ou relatório não invalida a fotografia base.
4. Reconciliar diariamente `assignedLicenses`, `assignedPlans` e `licenseAssignmentStates` pelo lote completo de `/users`; não usar delta como fonte dessas atribuições.
5. Na mesma transação, persistir fotografia materializada, snapshots e cursor, atualizar o ponteiro exclusivo da geração `published` e preservar a anterior até a promoção concluir.
6. Se Graph devolver cursor inválido ou reset, abandonar a geração de staging e iniciar fotografia completa; a geração publicada anterior continua sendo exibida até a substituta concluir.
7. Para `429` e `503`, respeitar `Retry-After` quando presente e aplicar retry limitado com backoff/jitter e timeout total; registrar diagnóstico transitório distinto de restrição. Desabilitar redirect automático e baixar URL pré-autenticada sem `Authorization`.
8. Registrar apenas diagnóstico sanitizado; não registrar token, URL de relatório, CSV ou atributos pessoais.
