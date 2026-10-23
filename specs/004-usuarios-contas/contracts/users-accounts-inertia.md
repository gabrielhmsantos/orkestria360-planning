# Contract: Usuários e Contas — Inertia

## Rotas previstas

| Rota | Superfície | Parâmetros |
|---|---|---|
| `GET /microsoft-365/usuarios-e-contas` | Dashboard Executivo | — |
| `GET /microsoft-365/usuarios-e-contas/{tab}` | uma das sete abas restantes | `tab` restrito às chaves suportadas |
| `GET /microsoft-365/usuarios-e-contas/diretorio/{identity}` | perfil da identidade | mantém query de origem quando houver |
| `GET /microsoft-365/usuarios-e-contas/export/{surface}` | CSV protegido | filtros canônicos na query; revalida sessão |

Todas exigem somente `auth` e `verified`; esta V2 não inclui Gate nem limitação por papel. Ações de ciclo de vida não recebem rota mutável.

## Envelope comum

```ts
type Availability = 'available' | 'restricted' | 'unavailable' | 'coming_soon';
type Freshness = 'fresh' | 'stale' | 'unavailable';

type SourceBlock<T> = {
  availabilityStatus: Availability;
  freshness: Freshness;
  source: string;
  coverage: { from?: string; to?: string; description: string };
  lastUpdatedAt: string | null;
  reason?: string;
  lastKnown?: T;
};

type UsersAccountsPageData = {
  activeTab: string;
  tabs: { key: string; label: string; href: string }[];
  snapshotGeneration: string | null;
  sync: SourceBlock<{ lastSuccessfulAt: string | null; nextExpectedAt: string | null }>;
  blocks: Record<string, SourceBlock<unknown>>;
  filters: Record<string, string | number | boolean | null>;
};

type InvestigationRecommendation = {
  evidence: string[];
  condition: string;
  impediment: string | null;
  nextStep: string;
  operationalAction: false;
};
```

`availabilityStatus` responde se a capacidade existe; `freshness` responde quando ela foi coletada. Ausência de atributo é `null`; nunca `0`, `false` ou texto inferido.

## Coleções, filtros e vazio

```ts
type PageResult<T> = {
  items: T[];
  page: number;
  perPage: 25;
  total: number | null;
  resultState: 'items' | 'no_matches' | 'empty_valid_response';
};
```

A paginação da interface usa 25 itens por página e consulta a fotografia local. Ela não espelha o `$top` da coleta Graph: quando `signInActivity` é selecionado, o coletor pode solicitar até 500 itens técnicos por página e deve seguir `@odata.nextLink` antes de publicar uma geração.

- `no_matches`: filtros foram aplicados e a resposta efetiva foi `value: []`; a UI informa “resposta filtrada sem correspondências”.
- `empty_valid_response`: a rota sem filtro também respondeu validamente vazia; não é erro, mas não prova ausência de fonte.
- `restricted` e `unavailable`: não preenchem `items`, `total` ou indicadores com zero.

## Exportação CSV

O download somente ocorre para Diretório e Histórico/Auditoria com `availabilityStatus: available`, sessão autenticada/verificada e coluna allowlisted. A resposta usa `text/csv`, nome sem PII e cabeçalhos de cobertura/sensibilidade. A solicitação cria `IdentityExport` e `IdentityAccessAudit`; o contrato não devolve URL temporária nem conteúdo bruto em JSON.

| Superfície | Colunas CSV permitidas |
|---|---|
| Diretório | `displayName`, `userPrincipalName`, `userType`, `accountEnabled`, `department`, `jobTitle`, `licenseSummary`, `source`, `coverage` |
| Histórico e Auditoria | `occurredAt`, `source`, `category`, `activity`, `actor`, `target`, `result`, `detectedAt`, `collectedAt`, `coverage` |

`userPrincipalName`, `actor` e `target` são PII e só aparecem no CSV após a revalidação da sessão autenticada/verificada. Qualquer recomendação mostrada no payload usa `InvestigationRecommendation`; ela orienta investigação e nunca representa uma ação executada.

Antes da serialização CSV, toda célula textual iniciada por `=`, `+`, `-` ou `@` recebe prefixo apóstrofo; a resposta usa `Content-Disposition: attachment`.
