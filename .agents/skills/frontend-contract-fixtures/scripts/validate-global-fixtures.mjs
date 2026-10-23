#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGlobalFixture } from './generate-global-fixtures.mjs';

export function validateFixtureFile(sourcePath) {
    try {
        return validateGlobalFixture(JSON.parse(readFileSync(sourcePath, 'utf8')));
    } catch (error) {
        return [error instanceof Error ? error.message : String(error)];
    }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const [sourcePath] = process.argv.slice(2);
    const errors = sourcePath ? validateFixtureFile(resolve(sourcePath)) : ['Informe uma base global JSON.'];
    if (errors.length > 0) {
        console.error(errors.map((error) => `- ${error}`).join('\n'));
        process.exitCode = 1;
    } else {
        console.log(`Fixture global válido: ${resolve(sourcePath)}`);
    }
}
