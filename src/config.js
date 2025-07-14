import { envUtils } from 'envious-type';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const { env, validateEnv } = envUtils({ lazyValidation: true, envPrefix: 'HLP_' });

export const config = validateEnv({
    port: env.PORT.integer().get({ dev: 3130, prod: 80 }),
    title: env.TITLE.string().get({ '*': 'Landing page' }),
    linkConfigPath: env.LINK_CONFIG_PATH.string().get({ dev: path.join(import.meta.dirname, '../examples/links.json') }),
});

/** @returns {import("./types").LinkConfig[]} */
export async function readLinkConfig(path = config.linkConfigPath) {
    const raw = await readFile(path);
    const links = JSON.parse(raw);
    return links;
}