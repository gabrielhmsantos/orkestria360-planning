# APIs — Colaboração e Compartilhamento

Todas as rotas são `GET`, sem corpo, em `https://graph.microsoft.com/v1.0`, com audience `https://graph.microsoft.com` e autenticação de aplicação.

| Rota ou fato | Evidência e contrato externo |
| --- | --- |
| `/admin/sharepoint/settings` | Coleta técnica temporária em duas conexões customer: `200 application/json;odata.metadata=minimal`, entidade Graph `v1.0`; `SharePointTenantSettings.Read.All` presente nos tokens. Foram observados, entre outros, `sharingCapability`, `sharingDomainRestrictionMode`, `sharingAllowedDomainList`, `sharingBlockedDomainList`, `isLegacyAuthProtocolsEnabled` e `isUnmanagedSyncAppForTenantRestricted`. É suficiente para o fato SharePoint/OneDrive de protocolos legados; `sharingCapability=externalUserAndGuestSharing` informa que links anônimos são permitidos. O payload não expõe tipo padrão de link anônimo nem permissão padrão `Edit`, portanto é insuficiente para a trava conjunta de link anônimo global com edição. `isUnmanagedSyncAppForTenantRestricted` trata sincronização, não a imposição de acesso por dispositivo gerenciado. |
| `/policies/authorizationPolicy` | `200 application/json;odata.metadata=minimal`, entidade com `allowInvitesFrom`, controles de convite e permissões padrão; `Policy.Read.All`. |
| `/policies/crossTenantAccessPolicy` | `200 application/json;odata.metadata=minimal`, entidade com `id`, `displayName` e `allowedCloudEndpoints`; `Policy.Read.All`. |
| Grupos e membros | Projeções locais da fonte canônica de grupos; detalhe de identidade somente quando a cobertura permitir. |

## Uso pela aplicação

Configurações SharePoint e grupos são projeções locais. `authorizationPolicy` e `crossTenantAccessPolicy` são novas coletas justificadas, pois não há fato publicado equivalente. A tela não chama Graph e retém o último estado publicado em restrição ou falha.
