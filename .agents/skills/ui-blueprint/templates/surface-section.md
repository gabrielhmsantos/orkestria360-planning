## Surface — <name>

### Surface metadata

- **Surface status:** `conceptual` | `reconciled`
- **Data classification:** `data-backed` | `not_data_backed`
- **Action:** `none` | `<authorized action>`
- **Action reason/status:** `<reason>` | `pending`

### Product intent
### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |

### UI composition and ownership

Mapeie cada região visível/material para a estratégia decidida. Agrupe IDs somente quando compartilham composição e ownership. Para `State/filter relationship`, declare explicitamente `snapshot`, `derived: <filter/state IDs>`, `tenant-stable` ou `not_applicable: <reason>`.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |

Estratégia: `direct_reuse`, `domain_adapter`, `local_composition` ou `design_system_extension`. Componentes de apresentação não absorvem regra de domínio; transformações, recortes e baselines pertencem ao owner declarado.

### Navigation and hero specification

#### Hero — <id>
- **Category:**
- **Title:**
- **Subtitle:**
- **Freshness:**
- **Action:**
- **Action reason/status:**

#### Tab bar — <id>

| Order | Key | Label | Destination | Condition | Active |
| --- | --- | --- | --- | --- | --- |
### KPI specification

#### KPI — <id>
- **Order:**
- **Label:**
- **Binding:**
- **Formatter:**
- **Unit:**
- **Context:**
- **Variant:**
- **Exact props:**
- **States:**
- **Responsive behavior:**
- **Accessibility:**
### Filter specification

#### Filter — <id>
- **Label:**
- **Type:**
- **Component:**
- **Binding:**
- **Options source:**
- **Default:**
- **Placeholder:**
- **Apply:**
- **Reset:**
- **Dependencies:**
- **Pagination effect:**
- **Selection effect:**
- **Focus and keyboard:**
### Chart specification

#### Chart — <id>
- **Title:**
- **Type:**
- **Binding:**
- **Categories:**
- **Series:**
- **Unit:**
- **Period:**
- **Order:**
- **Legend:**
- **Tooltip:**
- **Axes:**
- **Coverage/freshness:**
- **Accessible summary:**
### Table/list specification

#### Table — <id>
- **Caption:**
- **Dataset:**
- **Columns:**
- **Initial sort:**
- **Related filter:**
- **Selection:**
- **Pagination:**
- **Mobile behavior:**
- **Horizontal scroll:**
- **States:**
### Detail specification

#### Detail — <id>
- **Trigger:**
- **Title:**
- **Subtitle:**
- **Sections/fields:**
- **Action:**
- **Close and ESC:**
- **Focus initial:**
- **Focus return:**
- **Aria-live:**
- **Filter/pagination/disappeared selection behavior:**
### Action specification

#### Action — <id>
- **Label:**
- **Trigger:**
- **Result:**
- **Loading:**
- **Success:**
- **Failure:**
- **Focus and keyboard:**
- **Navigation:**

#### Link — <id>
- **Label:**
- **Destination:**
- **Condition:**
- **Accessible name:**
### Data bindings

| ID | Fixture/scenario | Path | Expected type | Formatter/unit | Null | Absence | Visual transformation |
| --- | --- | --- | --- | --- | --- | --- | --- |

### State composition

| State | Visible/removed/substituted | Component and exact copy | Action/retry/data preserved | Freshness/focus/aria-live | Filter/selection/pagination |
| --- | --- | --- | --- | --- | --- |
### Interaction contract

| ID | Interaction | Trigger/result | Loading/success/failure | Focus/keyboard | Context/reset/pagination/selection | Navigation |
| --- | --- | --- | --- | --- | --- | --- |
### Desktop composition
Describe the complete desktop composition, regions, reading order, spans and main scroll.
### Tablet composition
Describe the complete tablet composition, region order, stacking and overflow.
### Mobile composition
Describe the complete mobile composition, visibility, stacking, overflow and detail placement.
### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
### Accessibility contract

Document landmarks/headings, names, captions, focus order/transfer/return, keyboard, aria-live and textual chart equivalents.
### Component instances and Storybook evidence

Registre uma linha para cada ID material. Para composição local/adaptador, cite as APIs filhas verificadas; o contrato do wrapper local fica no mapa de composição. Uma extensão do design system sem Storybook usa `pending_design_system_api` e não declara props, story ou preview como verificados.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |

API status: `storybook_verified`, `verified_children`, `module_local_contract` ou `pending_design_system_api`. Em status sem API Storybook, use `not_applicable: <reason>` nos campos de props/stories/previews.

### Sponsor divergences
### Catalog gaps
### Open decisions
### Surface implementation checklist
