# Contract: Governance Document Workflow

## Scope

Contrato interno entre backend Laravel e frontend Inertia/React para overview, detalhe e ações do workflow documental do módulo de governança.

Neste contrato, `tenant` significa o contexto autenticado atual da Contoso Ltda. no POC, sem requisito de isolamento multi-tenant configurável entre organizações.

## Canonical Status Mapping

| Functional label | Technical key |
|------------------|---------------|
| `Não iniciado` | `not_started` |
| `Pendente` | `pending` |
| `Em andamento` | `in_progress` |
| `Em análise` | `under_review` |
| `Concluído` | `completed` |

## Routes

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/governance` | Renderiza overview com score, cards, tabela e insights | Authenticated |
| `GET` | `/governance/{topic}` | Renderiza detalhe de um tópico documental | Authenticated |
| `PATCH` | `/governance/{topic}/metadata` | Salva responsável, vigência, revisão e observações | Authenticated |
| `POST` | `/governance/{topic}/template-download` | Registra download do template e retorna arquivo | Authenticated |
| `POST` | `/governance/{topic}/document` | Envia ou substitui documento vigente | Authenticated |
| `PATCH` | `/governance/{topic}/approval` | Aprova tópico e salva pontuação administrativa | Admin only |

## Inertia Page Contract: `/governance`

```ts
type GovernanceOverviewPageData = {
  score: {
    value: number;
    label: 'Score de Maturidade';
  };
  summaryCards: Array<{
    id: 'total' | 'not_started' | 'completed' | 'under_review' | 'in_progress' | 'pending';
    label: string;
    value: string;
    tone: 'info' | 'success' | 'warning';
  }>;
  documentRows: Array<{
    id: string;
    topic: string;
    ownerName: string | null;
    validityLabel: string | null;
    validityStartsAtLabel: string | null;
    status: 'not_started' | 'pending' | 'in_progress' | 'under_review' | 'completed';
    lastSubmissionAtLabel: string | null;
    primaryAction: {
      label: string;
      href: string;
    };
  }>;
  scoreTrend: Array<{ label: string; value: number }>;
  statusDistribution: Array<{ label: string; value: number }>;
  benefits: string[];
  nextStep: {
    title: string;
    body: string;
    actionLabel: string;
  };
};
```

## Inertia Page Contract: `/governance/{topic}`

```ts
type GovernanceTopicDetailPageData = {
  topic: {
    id: string;
    title: string;
    slug: string;
    status: 'not_started' | 'pending' | 'in_progress' | 'under_review' | 'completed';
    ownerName: string | null;
    validityMonths: 3 | 6 | 9 | 12 | 24 | 36 | 48 | 60 | null;
    validityStartsAtLabel: string | null;
    lastReviewedAt: string | null;
    notes: string | null;
    adminScore: number | null;
  };
  template: {
    fileName: string;
    downloadUrl: string;
    downloadedAtLabel: string | null;
    downloadedByName: string | null;
  };
  currentDocument: {
    fileName: string;
    viewUrl: string | null;
    uploadedAtLabel: string | null;
    uploadedByName: string | null;
  } | null;
  actions: {
    canEditMetadata: boolean;
    canDownloadTemplate: boolean;
    canUploadDocument: boolean;
    canApprove: boolean;
  };
};
```

## Request Contract: Update Metadata

```ts
type GovernanceTopicMetadataRequest = {
  owner_name: string;
  validity_months: 3 | 6 | 9 | 12 | 24 | 36 | 48 | 60;
  last_reviewed_at?: string | null;
  notes?: string | null;
};
```

**Rules**:

- `owner_name` é obrigatório
- `validity_months` é obrigatório e limitado às opções definidas na spec
- Ao salvar dados válidos, o tópico deve estar ao menos em `pending`

## Primary Action Mapping

| Status | Default primary action |
|--------|------------------------|
| `not_started` | `Preencher metadados` |
| `pending` | `Baixar template` |
| `in_progress` | `Enviar documento` |
| `under_review` | `Acompanhar análise` para usuário operacional; `Revisar e pontuar` para administrador |
| `completed` | `Visualizar documento` |

## Request Contract: Upload Document

```ts
type GovernanceTopicDocumentRequest = {
  document: File;
};
```

**Rules**:

- Requer template previamente baixado
- Substitui o documento vigente
- Se o tópico estiver `completed`, retorna para `under-review`

## Request Contract: Approve Topic

```ts
type GovernanceTopicApprovalRequest = {
  admin_score: number;
};
```

**Rules**:

- Apenas admin
- `admin_score` deve ser inteiro de `0` a `100`
- Aprovação define `approved_at`, `approved_by`, `validity_starts_at` e status `completed`

## Error/Validation Contract

- Erros de validação retornam pelo fluxo padrão do Laravel + Inertia para `form.errors`
- Usuário não admin recebendo tentativa de aprovação deve receber resposta proibida (`403`) ou equivalente do fluxo web
- Upload sem template baixado deve retornar erro de validação ou regra de negócio exibível na UI
- Visualização do documento deve abrir em nova aba quando houver preview suportado, mantendo download como fallback/ação secundária
- Downloads de template e visualizações de documentos não devem usar links públicos permanentes
