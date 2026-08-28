/**
 * Walks public/assets and writes the list of files that actually exist to
 * lib/asset-manifest.json.
 *
 * Why this exists: a browser logs a red 404 for any missing <source> or <img>
 * before application JS can intervene, and that error is not suppressible.
 * The acceptance criterion is ZERO console errors with /assets deleted, so the
 * only correct answer is to never issue the request. MediaFrame consults this
 * manifest and renders its placeholder without touching the network.
 *
 * Runs automatically on predev and prebuild. If you drop new files into
 * public/assets while the dev server is already running, re-run:
 *   npm run assets
 */
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const PUBLIC_DIR = join(process.cwd(), 'public');
const ASSET_DIR = join(PUBLIC_DIR, 'assets');
const OUT = join(process.cwd(), 'lib', 'asset-manifest.json');

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (!entry.name.startsWith('.')) out.push(full);
  }
  return out;
}

const files = await walk(ASSET_DIR);
const manifest = files
  // Public paths are URLs, so always forward slashes regardless of platform.
  .map((f) => '/' + relative(PUBLIC_DIR, f).split(sep).join('/'))
  .sort();

/**
 * Wrapped in an object rather than emitted as a bare array so an EMPTY assets
 * folder is distinguishable from "the generator never ran". A bare [] is
 * ambiguous, and guessing wrong there means either requesting every missing
 * file (console errors) or blanking every real one.
 */
await mkdir(join(process.cwd(), 'lib'), { recursive: true });
await writeFile(OUT, JSON.stringify({ generated: true, files: manifest }, null, 2) + '\n');

console.log(`[assets] manifest written: ${manifest.length} file(s) found in public/assets`);
