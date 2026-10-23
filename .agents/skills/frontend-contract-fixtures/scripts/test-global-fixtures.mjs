#!/usr/bin/env node

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateGlobalFixtures, validateGlobalFixture } from './generate-global-fixtures.mjs';

function assert(value, message) {
    if (!value) throw new Error(message);
}

const surfaces = ['surface-a', 'surface-b'];
const scenario = (state) => Object.fromEntries(surfaces.map((surface) => [surface, { state, availability: {} }]));
const source = {
    fixtureVersion: 2,
    module: 'module-a',
    provenance: 'discovery/module-a/tenant.json',
    defaultScenario: 'populated',
    surfaces,
    runtime: {
        catalogExport: 'fixtureCatalog',
        definitionType: 'FixtureDefinition',
        definitionImport: '../fixture-harness',
        surfaceType: 'SurfaceKey',
        surfaceImport: '@/types/surface',
    },
    scenarios: {
        populated: { surfaces: scenario('available') },
        partial: { surfaces: scenario('partial') },
        empty: { surfaces: scenario('available') },
    },
};

assert(validateGlobalFixture(source).length === 0, 'base global deve validar');
const root = mkdtempSync(join(tmpdir(), 'global-fixtures-'));
try {
    const sourcePath = join(root, 'source.json');
    const runtime = join(root, 'runtime', 'fixtures.generated.ts');
    mkdirSync(join(root, 'runtime'), { recursive: true });
    writeFileSync(sourcePath, JSON.stringify(source));
    generateGlobalFixtures({ sourcePath, runtimeOutput: runtime });
    generateGlobalFixtures({ sourcePath, runtimeOutput: runtime, check: true });
    assert(readFileSync(runtime, 'utf8').includes('fixtureCatalog'), 'catálogo TypeScript deve ser gerado');
    delete source.scenarios.partial.surfaces['surface-b'];
    assert(validateGlobalFixture(source).some((error) => error.includes('matriz global')), 'matriz parcial deve falhar');
    console.log('global fixture tests passed');
} finally {
    rmSync(root, { recursive: true, force: true });
}
