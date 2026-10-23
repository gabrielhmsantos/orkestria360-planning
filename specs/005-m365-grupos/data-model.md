# Data Model: Grupos Microsoft 365 V2

| Entidade | Propósito e campos principais | Relações e regras |
|---|---|---|
| `GroupSyncRun` | execução por tenant: status, início/fim, fontes, cursor, contagens e erro sanitizado | lock único; idempotente; falha não substitui a geração publicada |
| `GroupSnapshotGeneration` | fotografia publicável: tenant, estado `staging`/`published`/`failed`/`superseded`, cobertura, cursor e timestamps | uma única geração publicada por tenant; promoção transacional exclusiva |
| `DirectoryGroup` | catálogo atual: chave externa, nome, descrição, e-mail, tipo, visibilidade, origem, associação, Teams, classificação, criação e ciclo de vida | único por tenant + chave externa; pertence à geração publicada ou staging |
| `GroupMembership` | projeção de vínculo de membro na tabela `group_relationships`: grupo, identidade externa, tipo, direto/transitivo, origem e momento | escopo fixo `relationship_kind=member`; ausência de visibilidade é estado da fonte, não ausência do vínculo |
| `GroupOwner` | projeção de vínculo de proprietário na tabela `group_relationships`: grupo, identidade externa, tipo, origem e momento | escopo fixo `relationship_kind=owner`; separado de membro e suporta múltiplos proprietários |
| `GroupGovernance` | conceito futuro: complemento corporativo de finalidade, responsáveis, criticidade, revisão, exceção e documento | não é persistido nem possui model, migration ou coletor nesta V2; a UI usa `GroupSourceState=unavailable` até fonte e manutenção aprovadas |
| `GroupHealthFinding` | conceito futuro: achado rastreável com grupo, regra, categoria, severidade, evidência, status e datas | não é persistido nem possui model, migration ou coletor nesta V2; somente regra homologada e fonte aprovada autorizam trabalho futuro |
| `GroupActivitySnapshot` | fotografia de uso: data, membros, convidados, última atividade, sinais de e-mail/arquivo e cobertura | somente grupos com telemetria aplicável; segurança sem sinal não recebe inatividade inferida |
| `GroupLicenseSnapshot` | fotografia de licença: SKU, membros, licenciados, erros e processamento | custo não pertence à entidade sem fonte corporativa aprovada |
| `GroupLifecycleSnapshot` | fotografia de expiração, renovação e política observada | política ou dado ausente é disponibilidade explícita |
| `GroupAuditEvent` | evento normalizado: id externo, grupo, ator, alvo, atividade, resultado, ocorreu/coletado, origem e cobertura | único por tenant + id externo; retenção local nunca promete cobertura maior que a fonte |
| `GroupSourceState` | estado de cada fonte/superfície: disponibilidade, motivo, cobertura, última coleta, frescor, páginas e tentativas | diferencia `empty_valid_response`, `no_matches`, restrição e falha transitória |

## State Transitions

```text
staging -> published -> superseded
   |          ^
   v          |
 failed ------+
```

- Uma geração `staging` só se torna `published` após coleta e normalização
  coerentes; a anterior torna-se `superseded` na mesma promoção.
- Falha ou cursor delta inválido marca a execução/geração e preserva a última
  fotografia publicada. O próximo ciclo faz reconciliação completa antes de
  promover novo cursor.
- Estados de fonte não são estado de geração: cada fonte pode ser disponível,
  restrita, indisponível ou futura independentemente.

## Data Constraints

- Toda entidade persistida tem escopo obrigatório do tenant Contoso; a V2 não
  seleciona ou opera múltiplos tenants.
- `group_relationships` concentra os vínculos tipados: `relationship_kind` é
  `member`, `owner` ou `parent`; `membership_scope` é `direct` ou `transitive`
  somente quando o tipo for `member`. A tabela guarda tenant, geração, grupo,
  identidade externa, origem e momento observado; possui índice de leitura por
  tenant + geração + grupo + tipo e chave idempotente que inclui identidade e
  tipo. Uma constraint impede escopo de associação em vínculos `owner` ou
  `parent`.
- Cursores, erros e metadados externos são sanitizados; nenhum estado de fonte
  expõe credenciais ou URL temporária de relatório.
- Chaves externas e campos omitidos preservam nulidade/indisponibilidade, sem
  substituição por valor inventado.
