# Contract — Secure Score Sync

| Estágio | Publicação independente | Dependência |
| --- | --- | --- |
| `secure_scores` | sim | nenhuma |
| `secure_score_profiles` | sim | nenhuma |
| `secure_score_publication` | não | score + perfil íntegros do mesmo `sync_cycle_id`/chave de compatibilidade |
| `sharepoint_posture`, `intune_managed_devices`, `defender_machines` | sim | nenhuma; nunca bloqueiam score/perfis |
| `exchange_inbox_rules` | sim | geração de identidades publicada para definir mailboxes elegíveis; sua ausência torna somente este estágio `skipped`/`restricted` |

Cada estágio informa páginas, itens lidos/persistidos, tentativas, retry, disponibilidade, cobertura, frescor, motivo e resultado.

1. Coletar/paginar fora da promoção e respeitar Retry-After.
2. Persistir cada snapshot por `tenant + graph_score_id` e checksum; retry/reexecução com o mesmo checksum é no-op. Payload alterado de fotografia publicada cria revisão imutável compatível, sem criar evento/diff adicional por retry.
3. Promover cada fonte íntegra atomicamente.
4. Criar manifesto somente com versões vinculadas explicitamente pela mesma chave de ciclo; score isolado pode publicar sem substituir manifesto anterior.
5. Falha preserva geração e manifesto anteriores; nunca usa catálogo atual como substituição retroativa.
6. SharePoint permite somente `GET`: a allow-list de host/path e o bloqueio de `POST`/`PUT`/`PATCH`/`DELETE` são aplicados no limite do cliente HTTP antes da requisição. Exchange persiste domínio/indicador externo, não destinatários; Intune e Defender restritos publicam estado, não payload Learn como dado de sucesso.
