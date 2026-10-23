#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const globalSections = ['Metadata', 'Blueprint status', 'Sources', 'Discovery readiness', 'Storybook status', 'Global conventions', 'Breakpoints', 'Global state conventions', 'Global accessibility conventions', 'UI decision log', 'Consolidated component matrix', 'Open UI decisions', 'Implementation handoff checklist'];
const surfaceSections = ['Surface metadata', 'Product intent', 'Visible content inventory', 'UI composition and ownership', 'Navigation and hero specification', 'KPI specification', 'Filter specification', 'Chart specification', 'Table/list specification', 'Detail specification', 'Action specification', 'Data bindings', 'State composition', 'Interaction contract', 'Desktop composition', 'Tablet composition', 'Mobile composition', 'Responsive transitions', 'Accessibility contract', 'Component instances and Storybook evidence', 'Sponsor divergences', 'Catalog gaps', 'Open decisions', 'Surface implementation checklist'];
const states = ['loading', 'empty', 'partial', 'stale', 'failed', 'unavailable', 'restricted', 'coming_soon'];
const decisionStatuses = new Set(['decided', 'pending_product_decision', 'pending_design_system_api']);
const strategies = new Set(['direct_reuse', 'domain_adapter', 'local_composition', 'design_system_extension']);
const apiStatuses = new Set(['storybook_verified', 'verified_children', 'module_local_contract', 'pending_design_system_api']);
const family = { KPI: ['Label', 'Binding', 'Formatter', 'Unit', 'Context', 'Variant', 'Exact props', 'States', 'Responsive behavior', 'Accessibility'], Filter: ['Label', 'Type', 'Component', 'Binding', 'Options source', 'Default', 'Placeholder', 'Apply', 'Reset', 'Dependencies', 'Pagination effect', 'Selection effect', 'Focus and keyboard'], Chart: ['Title', 'Type', 'Binding', 'Categories', 'Series', 'Unit', 'Period', 'Order', 'Legend', 'Tooltip', 'Axes', 'Coverage/freshness', 'Accessible summary'], Table: ['Caption', 'Dataset', 'Columns', 'Initial sort', 'Related filter', 'Selection', 'Pagination', 'Mobile behavior', 'Horizontal scroll', 'States'], Detail: ['Trigger', 'Title', 'Subtitle', 'Sections/fields', 'Action', 'Close and ESC', 'Focus initial', 'Focus return', 'Aria-live', 'Filter/pagination/disappeared selection behavior'], Hero: ['Category', 'Title', 'Subtitle', 'Freshness', 'Action', 'Action reason/status'], 'Tab bar': ['Order', 'Key', 'Label', 'Destination', 'Condition', 'Active'], Action: ['Label', 'Trigger', 'Result', 'Loading', 'Success', 'Failure', 'Focus and keyboard', 'Navigation'], Link: ['Label', 'Destination', 'Condition', 'Accessible name'] };
const typeToFamily = { kpi: 'KPI', filter: 'Filter', chart: 'Chart', table: 'Table', detail: 'Detail', hero: 'Hero', tab: 'Tab bar', action: 'Action', link: 'Link' };
const fixtureBoundTypes = new Set(['kpi', 'chart', 'table', 'detail']);
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const key = (value) => value.trim().toLowerCase();
const filled = (value) => Boolean(value && !/^<[^>]+>$/.test(value) && !/^\{\{.+\}\}$/.test(value) && (!/^not_applicable\b/i.test(value) || /^not_applicable\s*:\s*\S/i.test(value)));

export function validateBlueprint(markdown) {
  const errors = [];
  if (!/^#\s+UI Blueprint\s+—\s+\S/m.test(markdown)) errors.push('missing document title');
  for (const title of globalSections) if (!hasHeading(markdown, 2, title)) errors.push(`missing global section: ${title}`);
  if (/(\{\{[^}]+\}\}|<[^>\n]+>)/.test(markdown)) errors.push('contains unresolved placeholder');

  const status = field(markdown, 'Blueprint status')?.toLowerCase();
  if (!['conceptual', 'reconciled'].includes(status)) errors.push('missing valid blueprint status');
  const breakpointTable = table(section(markdown, 'Breakpoints', 2), ['Token', 'Value', 'Verified source', 'Surface effect']);
  const breakpoints = new Set((breakpointTable?.rows ?? []).map((row) => object(breakpointTable.headers, row).token).filter(filled));
  if (status === 'reconciled' && !breakpoints.size) errors.push('reconciled blueprint lacks declared breakpoints');

  const decisions = readDecisionLog(markdown, errors);
  const seenIds = new Set();
  const surfaces = headings(markdown, 2, 'Surface — ');
  if (!surfaces.length) errors.push('missing at least one surface heading');
  const surfaceStatuses = new Map();
  const idToSurface = new Map();
  for (const surface of surfaces) {
    const surfaceStatus = field(section(surface.body, 'Surface metadata'), 'Surface status')?.toLowerCase() ?? status;
    surfaceStatuses.set(surface.title, surfaceStatus);
    validateSurface(surface.title, surface.body, status, surfaceStatus, breakpoints, seenIds, idToSurface, decisions.byId, errors);
  }
  validateDecisionLog(decisions.rows, status, surfaceStatuses, idToSurface, errors);
  return errors;
}

function readDecisionLog(markdown, errors) {
  const required = ['Decision ID', 'Scope', 'Affected IDs', 'Decision', 'Evidence', 'Rationale', 'Alternatives considered', 'Owner', 'Status', 'Dependencies'];
  const parsed = table(section(markdown, 'UI decision log', 2), required);
  if (!parsed) {
    errors.push('UI decision log is missing its structured table');
    return { rows: [], byId: new Map() };
  }
  if (!parsed.rows.length) errors.push('UI decision log has no material decisions');

  const byId = new Map();
  const rows = [];
  for (const raw of parsed.rows) {
    const decision = object(parsed.headers, raw);
    const id = decision['decision id'];
    for (const column of required) if (!filled(decision[key(column)])) errors.push(`UI decision log row lacks ${column}`);
    if (byId.has(id)) errors.push(`duplicate decision ID: ${id}`);
    if (!decisionStatuses.has(key(decision.status))) errors.push(`${id || '(blank)'} has invalid decision status ${decision.status || '(missing)'}`);
    byId.set(id, decision);
    rows.push(decision);
  }
  return { rows, byId };
}

function validateDecisionLog(rows, blueprintStatus, surfaceStatuses, idToSurface, errors) {
  const surfacesByKey = new Map([...surfaceStatuses.keys()].map((name) => [key(name), name]));
  for (const decision of rows) {
    const id = decision['decision id'];
    const scope = key(decision.scope);
    const affected = parseIds(decision['affected ids']);
    const surfaceName = surfacesByKey.get(scope);
    if (scope !== 'global' && !surfaceName) errors.push(`${id}: decision scope does not match a surface or global`);
    if (affected.global && scope !== 'global') errors.push(`${id}: affected IDs global requires global scope`);
    for (const affectedId of affected.ids) {
      const owningSurface = idToSurface.get(affectedId);
      if (!owningSurface) errors.push(`${id}: affected ID does not exist: ${affectedId}`);
      else if (surfaceName && owningSurface !== surfaceName) errors.push(`${id}: affected ID ${affectedId} is outside scope ${surfaceName}`);
    }

    if (key(decision.status) === 'decided') continue;
    const targetSurfaces = affected.global || (scope === 'global' && !affected.ids.length)
      ? [...surfaceStatuses.keys()]
      : surfaceName ? [surfaceName] : [...new Set(affected.ids.map((affectedId) => idToSurface.get(affectedId)).filter(Boolean))];
    const reconciledTargets = targetSurfaces.filter((name) => surfaceStatuses.get(name) === 'reconciled');
    if (reconciledTargets.length) errors.push(`${id}: ${decision.status} blocks reconciled surface(s): ${reconciledTargets.join(', ')}`);
    if (scope === 'global' && !affected.ids.length && blueprintStatus === 'reconciled') errors.push(`${id}: pending global decision blocks reconciled blueprint`);
  }
}

function validateSurface(name, body, blueprintStatus, status, breakpoints, seenIds, idToSurface, decisions, errors) {
  for (const title of surfaceSections) if (!hasHeading(body, 3, title)) errors.push(`${name}: missing section ${title}`);
  if (!['conceptual', 'reconciled'].includes(status)) errors.push(`${name}: missing valid surface status`);
  const dataBacked = field(section(body, 'Surface metadata'), 'Data classification') === 'data-backed';
  const action = field(section(body, 'Surface metadata'), 'Action');
  const actionStatus = field(section(body, 'Surface metadata'), 'Action reason/status');
  if (!filled(action)) errors.push(`${name}: action is not explicit`);
  if (!filled(actionStatus)) errors.push(`${name}: action reason/status is not explicit`);
  if (status === 'reconciled' && /\bpending\b/i.test(`${actionStatus ?? ''}\n${section(body, 'Open decisions')}`)) errors.push(`${name}: reconciled surface contains pending material decision`);

  const inventory = table(section(body, 'Visible content inventory'), ['ID', 'Type', 'Text/copy', 'Source', 'Status']);
  if (!inventory) { errors.push(`${name}: visible content inventory is not enumerated`); return; }
  const items = inventory.rows.map((row) => object(inventory.headers, row));
  for (const item of items) if (!filled(item.id) || !filled(item.type) || !filled(item['text/copy']) || !filled(item.source) || !filled(item.status)) errors.push(`${name}: visible content row is incomplete`);
  const ids = items.map((item) => item.id).filter(filled);
  for (const id of ids) {
    if (seenIds.has(id)) errors.push(`${name}: duplicate stable ID across blueprint: ${id}`);
    seenIds.add(id);
    idToSurface.set(id, name);
  }

  const material = items.filter((item) => typeToFamily[key(item.type)]);
  const compositionById = validateCompositionAndOwnership(name, body, material, ids, decisions, errors);
  validateEvidence(name, body, material, status, decisions, compositionById, errors);
  if (status !== 'reconciled') return;

  const bindings = table(section(body, 'Data bindings'), ['ID', 'Fixture/scenario', 'Path', 'Expected type', 'Formatter/unit', 'Null', 'Absence', 'Visual transformation']);
  if (dataBacked && !bindings) errors.push(`${name}: reconciled data-backed surface lacks fixture/binding table`);
  const bindingById = byId(bindings);
  for (const item of material) {
    const id = item.id;
    const record = recordFor(body, typeToFamily[key(item.type)], id);
    const selectedFamily = typeToFamily[key(item.type)];
    if (!record) errors.push(`${name}: ${id} is inventoried but lacks ${selectedFamily} specification`);
    else if (selectedFamily === 'Tab bar') validateTabBar(name, id, record, errors);
    else for (const requirement of family[selectedFamily]) if (!filled(field(record, requirement))) errors.push(`${name}: ${id} ${selectedFamily} lacks ${requirement}`);
    if (dataBacked && fixtureBoundTypes.has(key(item.type))) validateBinding(name, id, bindingById.get(id), errors);
  }
  validateStates(name, section(body, 'State composition'), errors);
  validateInteractions(name, material, body, errors);
  validateCompositions(name, body, errors);
  validateResponsive(name, material.map((item) => item.id), section(body, 'Responsive transitions'), breakpoints, errors);
}

function validateCompositionAndOwnership(name, body, material, inventoryIds, decisions, errors) {
  const required = ['Region/IDs', 'Component strategy', 'Composition', 'Data/derivation owner', 'State/filter relationship', 'Responsibility boundary (does/does not)', 'Decision ID'];
  const parsed = table(section(body, 'UI composition and ownership'), required);
  if (!parsed) {
    errors.push(`${name}: UI composition and ownership lacks its structured table`);
    return new Map();
  }
  const localIds = new Set(inventoryIds);
  const covered = new Set();
  const strategyById = new Map();
  const decisionById = new Map();
  for (const raw of parsed.rows) {
    const row = object(parsed.headers, raw);
    for (const column of required) if (!filled(row[key(column)])) errors.push(`${name}: composition row lacks ${column}`);
    const regionIds = parseIds(row['region/ids']);
    if (regionIds.global || !regionIds.ids.length) errors.push(`${name}: composition region must list surface IDs`);
    for (const id of regionIds.ids) {
      if (!localIds.has(id)) errors.push(`${name}: composition references unknown surface ID ${id}`);
      if (covered.has(id)) errors.push(`${name}: ${id} appears in multiple composition rows`);
      covered.add(id);
      strategyById.set(id, key(row['component strategy']));
      decisionById.set(id, row['decision id']);
    }
    if (!strategies.has(key(row['component strategy']))) errors.push(`${name}: invalid component strategy ${row['component strategy'] || '(missing)'}`);
    const decision = decisions.get(row['decision id']);
    if (!decision) errors.push(`${name}: composition references unknown decision ID ${row['decision id'] || '(missing)'}`);
    else if (!decisionCovers(decision, name, regionIds.ids)) errors.push(`${name}: decision ${row['decision id']} does not cover the composition scope`);
  }
  for (const item of material) if (!covered.has(item.id)) errors.push(`${name}: ${item.id} lacks composition/ownership decision`);
  return new Map([...strategyById.keys()].map((id) => [id, { strategy: strategyById.get(id), decisionId: decisionById.get(id) }]));
}

function validateEvidence(name, body, material, surfaceStatus, decisions, compositionById, errors) {
  const required = ['ID', 'Selection type', 'Component / variant', 'API status', 'Verified props / UI contract', 'Story ID(s)', 'Preview URL(s)', 'Decision ID'];
  const parsed = table(section(body, 'Component instances and Storybook evidence'), required);
  if (!parsed) { errors.push(`${name}: component/Storybook evidence table is missing`); return; }
  const records = new Map();
  for (const raw of parsed.rows) {
    const row = object(parsed.headers, raw);
    const id = row.id;
    if (records.has(id)) errors.push(`${name}: duplicate component evidence row for ${id}`);
    records.set(id, row);
  }
  for (const item of material) {
    const id = item.id;
    const row = records.get(id);
    if (!row) { errors.push(`${name}: ${id} lacks component/Storybook evidence`); continue; }
    for (const column of required.slice(1)) if (!filled(row[key(column)])) errors.push(`${name}: ${id} component evidence lacks ${column}`);
    const selectionType = key(row['selection type']);
    const apiStatus = key(row['api status']);
    if (!strategies.has(selectionType)) errors.push(`${name}: ${id} has invalid selection type ${row['selection type'] || '(missing)'}`);
    if (!apiStatuses.has(apiStatus)) errors.push(`${name}: ${id} has invalid API status ${row['api status'] || '(missing)'}`);

    const composition = compositionById.get(id);
    if (composition && composition.strategy !== selectionType) errors.push(`${name}: ${id} selection type disagrees with composition strategy`);
    if (composition && composition.decisionId !== row['decision id']) errors.push(`${name}: ${id} evidence references a different decision than its composition`);
    const decision = decisions.get(row['decision id']);
    if (!decision) errors.push(`${name}: ${id} evidence references unknown decision ID ${row['decision id'] || '(missing)'}`);
    else if (!decisionCovers(decision, name, [id])) errors.push(`${name}: decision ${row['decision id']} does not cover evidence for ${id}`);

    if (selectionType === 'direct_reuse' && apiStatus !== 'storybook_verified') errors.push(`${name}: ${id} direct reuse must have Storybook-verified API`);
    if (selectionType === 'design_system_extension' && apiStatus !== 'pending_design_system_api') errors.push(`${name}: ${id} design-system extension must remain pending until Storybook verification`);
    if (['domain_adapter', 'local_composition'].includes(selectionType) && !['verified_children', 'module_local_contract', 'storybook_verified'].includes(apiStatus)) errors.push(`${name}: ${id} local adapter/composition has invalid API status`);

    if (apiStatus === 'storybook_verified') {
      requireEvidenceValue(name, id, row['verified props / ui contract'], 'verified props', errors);
      requireEvidenceValue(name, id, row['story id(s)'], 'Story ID', errors);
      validatePreviewUrls(name, id, row['preview url(s)'], errors);
    } else if (apiStatus === 'verified_children') {
      requireEvidenceValue(name, id, row['verified props / ui contract'], 'verified child APIs', errors);
      requireEvidenceValue(name, id, row['story id(s)'], 'child Story IDs', errors);
      validatePreviewUrls(name, id, row['preview url(s)'], errors);
    } else if (apiStatus === 'module_local_contract') {
      if (!/^module_local_contract\s*:/i.test(row['verified props / ui contract'])) errors.push(`${name}: ${id} must describe its module-local UI contract without inventing a Storybook API`);
      if (!/^not_applicable\s*:/i.test(row['story id(s)']) || !/^not_applicable\s*:/i.test(row['preview url(s)'])) errors.push(`${name}: ${id} module-local contract must explain why Storybook evidence is not applicable`);
    } else if (apiStatus === 'pending_design_system_api') {
      if (selectionType !== 'design_system_extension') errors.push(`${name}: ${id} pending API must be classified as design_system_extension`);
      if (!/^not_applicable\s*:/i.test(row['verified props / ui contract']) || !/^not_applicable\s*:/i.test(row['story id(s)']) || !/^not_applicable\s*:/i.test(row['preview url(s)'])) errors.push(`${name}: ${id} proposed API must not claim verified props, story or preview`);
      if (surfaceStatus === 'reconciled') errors.push(`${name}: ${id} pending design-system API blocks reconciled`);
      if (!decision || key(decision.status) !== 'pending_design_system_api') errors.push(`${name}: ${id} pending API lacks a matching pending_design_system_api decision`);
    }
    if (decision && key(decision.status) === 'pending_design_system_api' && apiStatus !== 'pending_design_system_api') errors.push(`${name}: ${id} claims verified API while its decision is pending_design_system_api`);
  }
}

function decisionCovers(decision, surfaceName, ids) {
  const scope = key(decision.scope);
  const affected = parseIds(decision['affected ids']);
  if (scope !== 'global' && scope !== key(surfaceName)) return false;
  if (affected.global) return scope === 'global';
  return ids.every((id) => affected.ids.includes(id));
}

function parseIds(value) {
  if (key(value) === 'global') return { global: true, ids: [] };
  return { global: false, ids: value.split(',').map((id) => id.trim()).filter(Boolean) };
}

function requireEvidenceValue(surface, id, value, label, errors) {
  if (!filled(value) || /^not_applicable\s*:/i.test(value)) errors.push(`${surface}: ${id} lacks ${label}`);
}

function validatePreviewUrls(surface, id, value, errors) {
  if (!filled(value) || /^not_applicable\s*:/i.test(value)) { errors.push(`${surface}: ${id} lacks Storybook preview URL(s)`); return; }
  const urls = value.split(/[;\n]/).map((part) => part.trim()).filter(Boolean);
  if (!urls.length) { errors.push(`${surface}: ${id} lacks Storybook preview URL(s)`); return; }
  for (const url of urls) {
    try { new URL(url); } catch { errors.push(`${surface}: ${id} has invalid preview URL ${url}`); }
  }
}

function validateBinding(name, id, row, errors) {
  if (!row) { errors.push(`${name}: ${id} lacks data binding`); return; }
  for (const column of ['fixture/scenario', 'path', 'expected type', 'formatter/unit', 'null', 'absence', 'visual transformation']) if (!filled(row[column])) errors.push(`${name}: ${id} binding lacks ${column}`);
  if (!/\.json\b/.test(row['fixture/scenario'] ?? '')) errors.push(`${name}: ${id} binding lacks fixture JSON reference`);
}
function validateTabBar(name, id, record, errors) {
  const tabs = table(record, family['Tab bar']);
  if (!tabs?.rows.length) { errors.push(`${name}: ${id} Tab bar lacks tab rows`); return; }
  for (const row of tabs.rows) for (const [index, column] of tabs.headers.entries()) if (!filled(row[index])) errors.push(`${name}: ${id} Tab bar lacks ${column}`);
}
function validateStates(name, content, errors) {
  const stateTable = table(content, ['State', 'Visible/removed/substituted', 'Component and exact copy', 'Action/retry/data preserved', 'Freshness/focus/aria-live', 'Filter/selection/pagination']);
  if (!stateTable) { errors.push(`${name}: state composition lacks structured table`); return; }
  const rows = byId(stateTable, 'state');
  for (const state of states) {
    const row = rows.get(state);
    if (!row) { errors.push(`${name}: state composition omits ${state}`); continue; }
    for (const column of stateTable.headers.slice(1)) if (!filled(row[column])) errors.push(`${name}: ${state} state lacks ${column}`);
  }
}
function validateInteractions(name, material, body, errors) {
  const interactive = material.filter((item) => {
    const type = key(item.type);
    if (['filter', 'detail', 'action', 'link', 'tab'].includes(type)) return true;
    if (type !== 'table') return false;
    const record = recordFor(body, 'Table', item.id);
    return ['Pagination', 'Initial sort', 'Selection'].some((label) => !/^not_applicable\s*:/i.test(field(record, label) ?? ''));
  });
  if (!interactive.length) return;
  const interactions = table(section(body, 'Interaction contract'), ['ID', 'Interaction', 'Trigger/result', 'Loading/success/failure', 'Focus/keyboard', 'Context/reset/pagination/selection', 'Navigation']);
  if (!interactions) { errors.push(`${name}: interactive surface lacks structured interaction contract`); return; }
  const rows = byId(interactions);
  for (const item of interactive) {
    const row = rows.get(item.id);
    if (!row) { errors.push(`${name}: ${item.id} lacks interaction contract`); continue; }
    for (const column of interactions.headers.slice(1)) if (!filled(row[column])) errors.push(`${name}: ${item.id} interaction lacks ${column}`);
  }
}
function validateCompositions(name, body, errors) {
  for (const title of ['Desktop composition', 'Tablet composition', 'Mobile composition']) if (!filled(section(body, title).trim())) errors.push(`${name}: ${title} is empty`);
}
function validateResponsive(name, ids, content, breakpoints, errors) {
  const responsive = table(content, ['Region/ID', 'Breakpoint token', 'Span', 'Order', 'Visibility', 'Transition']);
  if (!responsive) { errors.push(`${name}: responsive transitions lacks structured table`); return; }
  const rows = byId(responsive, 'region/id');
  for (const id of ids) {
    const row = rows.get(id);
    if (!row) { errors.push(`${name}: ${id} lacks responsive transition`); continue; }
    for (const column of responsive.headers.slice(1)) if (!filled(row[column])) errors.push(`${name}: ${id} responsive transition lacks ${column}`);
    if (!breakpoints.has(row['breakpoint token'])) errors.push(`${name}: ${id} uses undeclared breakpoint token ${row['breakpoint token'] ?? '(missing)'}`);
  }
}

function hasHeading(content, level, title) { return new RegExp(`^${'#'.repeat(level)}\\s+${escape(title)}\\s*$`, 'mi').test(content); }
function headings(content, level, prefix) {
  const matches = [...content.matchAll(new RegExp(`^${'#'.repeat(level)}\\s+${escape(prefix)}(.+)$`, 'gmi'))];
  return matches.map((match, index) => ({ title: match[1].trim(), body: content.slice(match.index, index + 1 < matches.length ? matches[index + 1].index : content.length) }));
}
function section(content, title, level = 3) {
  const marker = '#'.repeat(level);
  const match = new RegExp(`^${marker}\\s+${escape(title)}\\s*$`, 'mi').exec(content);
  if (!match || match.index === undefined) return '';
  const after = match.index + match[0].length;
  const next = new RegExp(`^${marker}\\s+`, 'mi').exec(content.slice(after));
  return content.slice(after, next?.index === undefined ? content.length : after + next.index);
}
function field(content, label) {
  const match = new RegExp(`^[-*]\\s+\\*\\*${escape(label)}:\\*\\*[ \\t]*` + '`?' + '([^`\\n]+)' + '`?' + '[ \\t]*$', 'mi').exec(content);
  return match?.[1]?.trim();
}
function table(content, requiredHeaders) {
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length - 1; index++) {
    if (!lines[index].trim().startsWith('|') || !/^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) continue;
    const headers = cells(lines[index]).map(key);
    if (!requiredHeaders.every((header) => headers.includes(key(header)))) continue;
    const rows = [];
    for (let row = index + 2; row < lines.length && lines[row].trim().startsWith('|'); row++) rows.push(cells(lines[row]));
    return { headers, rows };
  }
  return null;
}
function cells(line) { return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()); }
function object(headers, row) { return Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() ?? ''])); }
function byId(parsed, idColumn = 'id') { return new Map((parsed?.rows ?? []).map((row) => { const value = object(parsed.headers, row); return [value[idColumn], value]; })); }
function recordFor(body, kind, id) {
  const match = new RegExp(`^####\\s+${escape(kind)}\\s+—\\s+${escape(id)}\\s*$`, 'mi').exec(body);
  if (!match || match.index === undefined) return '';
  const after = match.index + match[0].length;
  const next = /^(?:####|###)\s+/mi.exec(body.slice(after));
  return body.slice(after, next?.index === undefined ? body.length : after + next.index);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  if (!process.argv[2]) { console.error('Usage: node skills/ui-blueprint/scripts/validate-blueprint.mjs <ui-blueprint.md>'); process.exit(2); }
  const errors = validateBlueprint(readFileSync(process.argv[2], 'utf8'));
  if (errors.length) { console.error(`Blueprint validation failed (${errors.length}):`); errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
  console.log('Blueprint validation passed.');
}
