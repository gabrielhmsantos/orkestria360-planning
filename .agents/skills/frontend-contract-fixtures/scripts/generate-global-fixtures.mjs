#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function scenarioNames(source) {
    return Object.keys(source.scenarios ?? {});
}

export function validateGlobalFixture(source) {
    const errors = [];
    if (!isObject(source) || source.fixtureVersion !== 2) {
        return ['`fixtureVersion` deve ser 2.'];
    }
    if (typeof source.module !== 'string' || source.module.trim() === '') {
        errors.push('`module` deve ser texto não vazio.');
    }
    if (!Array.isArray(source.surfaces) || source.surfaces.length === 0) {
        errors.push('`surfaces` deve listar ao menos uma superfície.');
    } else if (
        source.surfaces.some((surface) => typeof surface !== 'string' || surface.trim() === '') ||
        new Set(source.surfaces).size !== source.surfaces.length
    ) {
        errors.push('`surfaces` deve conter chaves únicas e não vazias.');
    }
    if (!isObject(source.scenarios) || scenarioNames(source).length === 0) {
        errors.push('`scenarios` deve ser um objeto não vazio.');
        return errors;
    }
    if (!source.scenarios[source.defaultScenario]) {
        errors.push('`defaultScenario` deve existir em `scenarios`.');
    }
    if (!source.scenarios.populated || !source.scenarios.empty || !source.scenarios.partial) {
        errors.push('cenários globais `populated`, `partial` e `empty` são obrigatórios.');
    }
    for (const [name, scenario] of Object.entries(source.scenarios)) {
        if (!isObject(scenario) || !isObject(scenario.surfaces)) {
            errors.push(`${name}.surfaces deve ser um objeto.`);
            continue;
        }
        const declared = new Set(source.surfaces ?? []);
        const actual = Object.keys(scenario.surfaces);
        if (actual.length !== declared.size || actual.some((surface) => !declared.has(surface))) {
            errors.push(`${name}.surfaces deve conter exatamente a matriz global de superfícies.`);
        }
        for (const surface of source.surfaces ?? []) {
            if (!isObject(scenario.surfaces[surface])) {
                errors.push(`${name}.${surface} deve ser uma projeção de fixture.`);
            }
        }
    }
    if (!isObject(source.runtime)) {
        errors.push('`runtime` deve definir o catálogo TypeScript gerado.');
    } else {
        for (const field of ['catalogExport', 'definitionType', 'definitionImport', 'surfaceType', 'surfaceImport']) {
            if (typeof source.runtime[field] !== 'string' || source.runtime[field].trim() === '') {
                errors.push(`runtime.${field} deve ser texto não vazio.`);
            }
        }
    }
    return errors;
}

export function buildFixtureCatalog(source) {
    const errors = validateGlobalFixture(source);
    if (errors.length > 0) throw new Error(errors.join('\n'));
    return Object.fromEntries(source.surfaces.map((surface) => [surface, {
        fixtureVersion: 1,
        provenance: source.provenance,
        surface,
        defaultScenario: source.defaultScenario,
        scenarios: Object.fromEntries(scenarioNames(source).map((scenario) => [
            scenario,
            clone(source.scenarios[scenario].surfaces[surface]),
        ])),
    }]));
}

function runtimeContents(source, catalog) {
    const runtime = source.runtime;
    return `/** Gerado por frontend-contract-fixtures; não edite manualmente. */\nimport type { ${runtime.surfaceType} } from '${runtime.surfaceImport}';\nimport type { ${runtime.definitionType} } from '${runtime.definitionImport}';\n\nexport const ${runtime.catalogExport} = ${JSON.stringify(catalog, null, 4)} as const satisfies {\n    [S in ${runtime.surfaceType}]: ${runtime.definitionType}<S>;\n};\n`;
}

function parseArgs(argv) {
    const result = {};
    for (let index = 0; index < argv.length; index += 1) {
        if (argv[index] === '--check') result.check = true;
        else if (argv[index].startsWith('--')) result[argv[index].slice(2)] = argv[++index];
    }
    return result;
}

export function generateGlobalFixtures({ sourcePath, runtimeOutput, check = false }) {
    const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
    const catalog = buildFixtureCatalog(source);
    const outputs = [
        { path: runtimeOutput, contents: runtimeContents(source, catalog) },
    ];
    const stale = outputs.filter(({ path, contents }) => !existsSync(path) || readFileSync(path, 'utf8') !== contents);
    if (check) {
        if (stale.length > 0) {
            throw new Error(`Saídas desatualizadas:\n${stale.map(({ path }) => `- ${path}`).join('\n')}`);
        }
        return;
    }
    for (const { path, contents } of stale) writeFileSync(path, contents);
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (!args.source || !args['runtime-output']) {
        console.error('Uso: generate-global-fixtures.mjs --source <json> --runtime-output <ts> [--check]');
        process.exitCode = 2;
        return;
    }
    try {
        generateGlobalFixtures({
            sourcePath: resolve(args.source),
            runtimeOutput: resolve(args['runtime-output']),
            check: args.check === true,
        });
        console.log(`${args.check ? 'Saídas válidas' : 'Fixtures gerados'}: ${resolve(args.source)}`);
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
    }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
