import path from 'node:path';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';


// The actual symlink entity in the file system
const existing = path.join(import.meta.dirname, '../examples/link-images');

// Where the symlink should point to
const link = path.join(import.meta.dirname, '../public/link-images');

if (existsSync(link)) {
    await fs.unlink(link);
}

try {
    await fs.symlink(existing, link);
} catch (err) {
    console.error('Could not create symlink for example link images', err);
    process.exit(1);
}