import { envUtils } from 'envious-type';
import { readFile } from 'node:fs/promises';
import { watchFile } from 'node:fs';
import path from 'node:path';

const { env, validateEnv } = envUtils({ lazyValidation: true, envPrefix: 'HLP_' });

export const config = validateEnv({
    port: env.PORT.integer().get({ dev: 3130, prod: 80 }),
    title: env.TITLE.string().get({ '*': 'Landing page' }),
    linkConfigPath: env.LINK_CONFIG_PATH.string().get({ dev: path.join(import.meta.dirname, '../examples/links.json') }),
});

/** @returns {Promise<import("./types").LinkConfig[]>} */
export async function readLinkConfig(configPath = config.linkConfigPath) {
    const raw = await readFile(configPath);
    const links = JSON.parse(raw);
    return links;
}

/** @param {import("./types").LinkConfig[]} links */
export async function watchLinkConfigUpdate(links, configPath = config.linkConfigPath) {
    // Using watchFile instead of watch, because the latter would not react
    // to all file changes
    watchFile(configPath, (curr, prev) => {
        console.debug('reload link config');

        readLinkConfig(configPath).then(newLinks => {
            links.splice(0, links.length);
            links.push(...newLinks);
        }, err => {
            console.error('Invalid link config', err);
        });
    });
}
