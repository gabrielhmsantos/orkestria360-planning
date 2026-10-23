import { validateBlueprint } from './validate-blueprint.mjs';

const ids = [['Hero', 'TEST-HERO-01'], ['Tab', 'TEST-TABS-01'], ['KPI', 'TEST-KPI-01'], ['Filter', 'TEST-FILTER-01'], ['Chart', 'TEST-CHART-01'], ['Table', 'TEST-TABLE-01'], ['Detail', 'TEST-DETAIL-01'], ['Action', 'TEST-ACTION-01'], ['Link', 'TEST-LINK-01']];
const fields = {
  KPI: ['Order', 'Label', 'Binding', 'Formatter', 'Unit', 'Context', 'Variant', 'Exact props', 'States', 'Responsive behavior', 'Accessibility'],
  Filter: ['Label', 'Type', 'Component', 'Binding', 'Options source', 'Default', 'Placeholder', 'Apply', 'Reset', 'Dependencies', 'Pagination effect', 'Selection effect', 'Focus and keyboard'],
  Chart: ['Title', 'Type', 'Binding', 'Categories', 'Series', 'Unit', 'Period', 'Order', 'Legend', 'Tooltip', 'Axes', 'Coverage/freshness', 'Accessible summary'],
  Table: ['Caption', 'Dataset', 'Columns', 'Initial sort', 'Related filter', 'Selection', 'Pagination', 'Mobile behavior', 'Horizontal scroll', 'States'],
  Detail: ['Trigger', 'Title', 'Subtitle', 'Sections/fields', 'Action', 'Close and ESC', 'Focus initial', 'Focus return', 'Aria-live', 'Filter/pagination/disappeared selection behavior'],
  Hero: ['Category', 'Title', 'Subtitle', 'Freshness', 'Action', 'Action reason/status'],
  Action: ['Label', 'Trigger', 'Result', 'Loading', 'Success', 'Failure', 'Focus and keyboard', 'Navigation'],
  Link: ['Label', 'Destination', 'Condition', 'Accessible name'],
};
const rows = (values) => `| ${values.join(' | ')} |`;
const separator = (count) => `| ${Array(count).fill('---').join(' | ')} |`;
const record = ([kind, id]) => kind === 'Tab'
  ? `#### Tab bar — ${id}\n| Order | Key | Label | Destination | Condition | Active |\n${separator(6)}\n| 1 | overview | Overview | /overview | always | active |`
  : `#### ${kind} — ${id}\n${fields[kind].map((name) => `- **${name}:** Value`).join('\n')}`;

function base() {
  const decisionLog = [
    rows(['Decision ID', 'Scope', 'Affected IDs', 'Decision', 'Evidence', 'Rationale', 'Alternatives considered', 'Owner', 'Status', 'Dependencies']),
    separator(10),
    rows(['UI-BASE-01', 'global', 'global', 'Assign a UI composition and owner to each material region', 'Approved product contract and verified Storybook APIs', 'The surface owns facts and the component owns its documented presentation', 'not_applicable: baseline fixture validates one accepted structure', 'surface', 'decided', 'none: standalone self-test']),
  ].join('\n');
  const composition = [
    rows(['Region/IDs', 'Component strategy', 'Composition', 'Data/derivation owner', 'State/filter relationship', 'Responsibility boundary (does/does not)', 'Decision ID']),
    separator(7),
    ...ids.map(([, id]) => rows([id, 'direct_reuse', 'VerifiedComponent / default', 'surface projection', 'snapshot', 'component presents supplied facts; does not derive domain rules', 'UI-BASE-01'])),
  ].join('\n');
  const evidence = [
    rows(['ID', 'Selection type', 'Component / variant', 'API status', 'Verified props / UI contract', 'Story ID(s)', 'Preview URL(s)', 'Decision ID']),
    separator(8),
    ...ids.map(([, id]) => rows([id, 'direct_reuse', 'VerifiedComponent / default', 'storybook_verified', 'label, value', 'component--default', 'http://localhost:6006/?path=/story/component--default', 'UI-BASE-01'])),
  ].join('\n');
  return `# UI Blueprint — Test

## Metadata
- **Blueprint status:** \`reconciled\`
## Blueprint status
## Sources
## Discovery readiness
## Storybook status
## Global conventions
## Breakpoints
| Token | Value | Verified source | Surface effect |
| --- | --- | --- | --- |
| md | 48rem | Tailwind configuration | stack regions |
## Global state conventions
## Global accessibility conventions
## UI decision log
${decisionLog}

## Surface — Test
### Surface metadata
- **Surface status:** \`reconciled\`
- **Data classification:** \`data-backed\`
- **Action:** none
- **Action reason/status:** no action authorized by product contract
### Product intent
### Visible content inventory
${rows(['ID', 'Type', 'Text/copy', 'Source', 'Status'])}
${separator(5)}
${ids.map(([kind, id]) => rows([id, kind, `${kind} label`, 'contratos.md', 'defined'])).join('\n')}
### UI composition and ownership
${composition}
### Navigation and hero specification
${record(ids[0])}
${record(ids[1])}
### KPI specification
${record(ids[2])}
### Filter specification
${record(ids[3])}
### Chart specification
${record(ids[4])}
### Table/list specification
${record(ids[5])}
### Detail specification
${record(ids[6])}
### Action specification
${record(ids[7])}
${record(ids[8])}
### Data bindings
${rows(['ID', 'Fixture/scenario', 'Path', 'Expected type', 'Formatter/unit', 'Null', 'Absence', 'Visual transformation'])}
${separator(8)}
${ids.filter(([kind]) => ['KPI', 'Chart', 'Table', 'Detail'].includes(kind)).map(([, id]) => rows([id, 'fixtures/default.json', 'data.value', 'string', 'text/none', 'not_applicable: no null', 'not_applicable: no absence', 'none'])).join('\n')}
### State composition
${rows(['State', 'Visible/removed/substituted', 'Component and exact copy', 'Action/retry/data preserved', 'Freshness/focus/aria-live', 'Filter/selection/pagination'])}
${separator(6)}
${['loading', 'empty', 'partial', 'stale', 'failed', 'unavailable', 'restricted', 'coming_soon'].map((state) => rows([state, 'visible and substituted', 'Panel: exact copy', 'retry; preserve data', 'freshness; focus; aria-live', 'filter; selection; pagination'])).join('\n')}
### Interaction contract
${rows(['ID', 'Interaction', 'Trigger/result', 'Loading/success/failure', 'Focus/keyboard', 'Context/reset/pagination/selection', 'Navigation'])}
${separator(7)}
${ids.filter(([kind]) => ['Tab', 'Filter', 'Table', 'Detail', 'Action', 'Link'].includes(kind)).map(([, id]) => rows([id, 'inspect', 'activate then update', 'loading/success/failure', 'focus and keyboard', 'preserve/reset context', 'navigate or stay'])).join('\n')}
### Desktop composition
12-column composition with primary regions and one main scroll.
### Tablet composition
Two-column composition with stacked secondary regions.
### Mobile composition
One-column composition with horizontal table overflow and detail below.
### Responsive transitions
${rows(['Region/ID', 'Breakpoint token', 'Span', 'Order', 'Visibility', 'Transition'])}
${separator(6)}
${ids.map(([, id]) => rows([id, 'md', '6', '1', 'visible', 'stack below desktop'])).join('\n')}
### Accessibility contract
Focus order, keyboard behavior and aria-live are defined by each instance.
### Component instances and Storybook evidence
${evidence}
### Sponsor divergences
### Catalog gaps
### Open decisions
### Surface implementation checklist

## Consolidated component matrix
## Open UI decisions
## Implementation handoff checklist
`;
}

function expectPass(name, markdown) {
  const errors = validateBlueprint(markdown);
  if (errors.length) throw new Error(`${name} should pass: ${errors.join('; ')}`);
}
function expectFail(name, markdown, pattern) {
  const errors = validateBlueprint(markdown);
  if (!errors.some((error) => pattern.test(error))) throw new Error(`${name} should fail with ${pattern}; got: ${errors.join('; ')}`);
}

const full = base();
expectPass('full reconciled fixture', full);
expectPass('conceptual fixture', full.replaceAll('reconciled', 'conceptual').replace('`data-backed`', '`not_data_backed`'));
expectPass('static product-contract filter', full.replace('- **Options source:** Value', '- **Options source:** product contract: fixed periods'));
expectFail('KPI without label', full.replace('- **Label:** Value', '- **Label:** '), /TEST-KPI-01 KPI lacks Label/);
expectFail('inventoried KPI without specification', full.replace('#### KPI — TEST-KPI-01', '#### KPI — TEST-KPI-02'), /lacks KPI specification/);
expectFail('table without columns', full.replace('- **Columns:** Value', '- **Columns:** '), /TEST-TABLE-01 Table lacks Columns/);
expectFail('chart without period', full.replace('- **Period:** Value', '- **Period:** '), /TEST-CHART-01 Chart lacks Period/);
expectFail('chart without accessible summary', full.replace('- **Accessible summary:** Value', '- **Accessible summary:** '), /TEST-CHART-01 Chart lacks Accessible summary/);
expectFail('filter without reset', full.replace('- **Reset:** Value', '- **Reset:** '), /TEST-FILTER-01 Filter lacks Reset/);
expectFail('partial as word only', full.replace(/^\| partial \|.*$/m, 'partial'), /state composition omits partial/);
expectFail('stale as word only', full.replace(/^\| stale \|.*$/m, 'stale'), /state composition omits stale/);
expectFail('responsive token only', full.replace('| TEST-KPI-01 | md | 6 | 1 | visible | stack below desktop |', 'md'), /TEST-KPI-01 lacks responsive transition/);
expectFail('detail without focus', full.replace('- **Focus initial:** Value', '- **Focus initial:** '), /TEST-DETAIL-01 Detail lacks Focus initial/);
expectFail('implicit action', full.replace('- **Action:** none', '- **Action:** '), /action is not explicit/);
expectFail('duplicate stable ID', full.replace('| TEST-DETAIL-01 | Detail | Detail label', '| TEST-KPI-01 | Detail | Detail label'), /duplicate stable ID/);
expectFail('binding without fixture', full.replace('fixtures/default.json', 'no-fixture'), /binding lacks fixture JSON reference/);
expectFail('component without story', full.replace('| TEST-KPI-01 | direct_reuse | VerifiedComponent / default | storybook_verified | label, value | component--default', '| TEST-KPI-01 | direct_reuse | VerifiedComponent / default | storybook_verified | label, value | '), /lacks Story ID/);
expectFail('pending reconciled decision', full.replace('no action authorized by product contract', 'pending'), /contains pending material decision/);
expectFail('filter without interaction', full.replace('| TEST-FILTER-01 | inspect | activate then update | loading/success/failure | focus and keyboard | preserve/reset context | navigate or stay |', ''), /TEST-FILTER-01 lacks interaction contract/);
expectFail('paginated table without interaction', full.replace('| TEST-TABLE-01 | inspect | activate then update | loading/success/failure | focus and keyboard | preserve/reset context | navigate or stay |', ''), /TEST-TABLE-01 lacks interaction contract/);
expectFail('detail without interaction', full.replace('| TEST-DETAIL-01 | inspect | activate then update | loading/success/failure | focus and keyboard | preserve/reset context | navigate or stay |', ''), /TEST-DETAIL-01 lacks interaction contract/);
expectFail('empty desktop composition', full.replace('12-column composition with primary regions and one main scroll.', ''), /Desktop composition is empty/);
expectFail('hero without specification', full.replace('#### Hero — TEST-HERO-01', '#### Hero — TEST-HERO-02'), /lacks Hero specification/);
expectFail('tab bar without specification', full.replace('#### Tab bar — TEST-TABS-01', '#### Tab bar — TEST-TABS-02'), /lacks Tab bar specification/);
expectFail('undeclared breakpoint', full.replace('| TEST-KPI-01 | md | 6 | 1 | visible | stack below desktop |', '| TEST-KPI-01 | xl | 6 | 1 | visible | stack below desktop |'), /uses undeclared breakpoint token xl/);
expectFail('invalid preview URL', full.replace('http://localhost:6006/?path=/story/component--default', 'not-a-url'), /has invalid preview URL/);
expectFail('decision without rationale', full.replace('The surface owns facts and the component owns its documented presentation', ''), /UI decision log row lacks Rationale/);
expectFail('decision without evidence', full.replace('Approved product contract and verified Storybook APIs', ''), /UI decision log row lacks Evidence/);
expectFail('decision references unknown ID', full.replace('| UI-BASE-01 | global | global | Assign', '| UI-BASE-01 | global | UNKNOWN-ID | Assign'), /affected ID does not exist: UNKNOWN-ID/);
expectFail('composition references unknown decision', full.replace('| TEST-KPI-01 | direct_reuse | VerifiedComponent / default | surface projection | snapshot | component presents supplied facts; does not derive domain rules | UI-BASE-01 |', '| TEST-KPI-01 | direct_reuse | VerifiedComponent / default | surface projection | snapshot | component presents supplied facts; does not derive domain rules | MISSING-DECISION |'), /composition references unknown decision ID/);
expectFail('composition without state/data owner', full.replace('| TEST-KPI-01 | direct_reuse | VerifiedComponent / default | surface projection | snapshot | component presents supplied facts; does not derive domain rules | UI-BASE-01 |', '| TEST-KPI-01 | direct_reuse | VerifiedComponent / default |  | snapshot | component presents supplied facts; does not derive domain rules | UI-BASE-01 |'), /composition row lacks Data\/derivation owner/);
expectFail('invalid pending decision type', full.replace('| UI-BASE-01 | global | global | Assign', '| UI-BASE-01 | global | global | Assign').replace('| surface | decided | none: standalone self-test |', '| surface | pending_api | none: standalone self-test |'), /has invalid decision status pending_api/);

const pendingApi = full
  .replace('| UI-BASE-01 | global | global |', '| UI-KPI-API-01 | Test | TEST-KPI-01 | Add a shared classification presentation component | Approved surface structure | Existing catalog lacks the presentation contract | not_applicable: scope is the extension contract | design_system | pending_design_system_api | Storybook story and API publication |\n| UI-BASE-01 | global | global |')
  .replace('- **Blueprint status:** `reconciled`', '- **Blueprint status:** `conceptual`')
  .replace('- **Surface status:** `reconciled`', '- **Surface status:** `conceptual`')
  .replace('| TEST-KPI-01 | direct_reuse | VerifiedComponent / default | surface projection | snapshot | component presents supplied facts; does not derive domain rules | UI-BASE-01 |', '| TEST-KPI-01 | design_system_extension | Proposed classified presentation | surface projection | snapshot | proposed component presents supplied facts; does not derive domain rules | UI-KPI-API-01 |')
  .replace('| TEST-KPI-01 | direct_reuse | VerifiedComponent / default | storybook_verified | label, value | component--default | http://localhost:6006/?path=/story/component--default | UI-BASE-01 |', '| TEST-KPI-01 | design_system_extension | Proposed classified presentation | pending_design_system_api | not_applicable: API is not published | not_applicable: no story exists | not_applicable: no preview exists | UI-KPI-API-01 |');
expectPass('conceptual surface with explicit API dependency', pendingApi);
expectFail('extension API claimed as verified', pendingApi.replace('| TEST-KPI-01 | design_system_extension | Proposed classified presentation | pending_design_system_api |', '| TEST-KPI-01 | design_system_extension | Proposed classified presentation | storybook_verified |'), /design-system extension must remain pending/);
expectFail('reconciled surface with pending design-system API', pendingApi.replace('- **Blueprint status:** `conceptual`', '- **Blueprint status:** `reconciled`').replace('- **Surface status:** `conceptual`', '- **Surface status:** `reconciled`'), /blocks reconciled/);
expectFail('API evidence status conflated with product decision', pendingApi.replace('| UI-KPI-API-01 | Test | TEST-KPI-01 | Add a shared classification presentation component | Approved surface structure | Existing catalog lacks the presentation contract | not_applicable: scope is the extension contract | design_system | pending_design_system_api | Storybook story and API publication |', '| UI-KPI-API-01 | Test | TEST-KPI-01 | Add a shared classification presentation component | Approved surface structure | Existing catalog lacks the presentation contract | not_applicable: scope is the extension contract | product | pending_product_decision | Storybook story and API publication |'), /matching pending_design_system_api decision/);

const duplicateAcrossSurfaces = full.replace('## Consolidated component matrix', `## Surface — Other
### Surface metadata
- **Surface status:** \`conceptual\`
- **Data classification:** \`not_data_backed\`
- **Action:** none
- **Action reason/status:** no action authorized
### Visible content inventory
| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| TEST-KPI-01 | KPI | Duplicate | contratos.md | defined |
## Consolidated component matrix`);
expectFail('duplicate ID across surfaces', duplicateAcrossSurfaces, /duplicate stable ID across blueprint/);
expectFail('incomplete document', '# UI Blueprint — Broken', /missing global section/);
console.log('Validator self-test passed: existing content, binding, interaction and responsive regressions plus UI decision/ownership/API status cases.');
