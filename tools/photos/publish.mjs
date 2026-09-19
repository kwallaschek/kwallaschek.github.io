// Publishes the photos in PHOTOS_SRC to the R2 bucket behind photos.kl-w.de: resizes each one to
// WebP renditions, writes the index.json manifest the site reads, and mirrors the result to the bucket.
// Settings come from .env next to this file.
//
// Usage: node publish.mjs [--no-upload | --dry-run]

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import exifReader from 'exif-reader';
import sharp from 'sharp';

const WIDTHS = [480, 1200, 2400];
const QUALITY = 82;
const FORMATS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp']);
const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = join(HERE, 'out');
const upload = !process.argv.includes('--no-upload');
const dryRun = process.argv.includes('--dry-run');

try {
  process.loadEnvFile(join(HERE, '.env'));
} catch {
  // No .env yet; the checks below explain what is missing.
}

const src = process.env.PHOTOS_SRC;
if (!src) fail('PHOTOS_SRC is not set. Copy .env.example to .env and fill it in.');
if (upload) {
  for (const name of ['R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']) {
    if (!process.env[name]) fail(`${name} is not set. Copy .env.example to .env and fill it in.`);
  }
  try {
    execFileSync('aws', ['--version'], { stdio: 'ignore' });
  } catch {
    fail('The AWS CLI is missing. It is the S3 client this script uses to talk to R2: brew install awscli');
  }
}

let files;
try {
  files = (await readdir(src))
    .filter((file) => !file.startsWith('.') && FORMATS.has(extname(file).toLowerCase()))
    .sort();
} catch {
  fail(`PHOTOS_SRC is not a readable folder: ${src}`);
}
if (!files.length) fail(`No photos found in ${src}`);

await mkdir(OUT, { recursive: true });
const photos = [];
const current = new Set(['index.json']);
for (const file of files) {
  try {
    photos.push(await build(file));
  } catch (error) {
    fail(`${file}: ${error.message}`);
  }
}

photos.sort((a, b) => b.taken.localeCompare(a.taken) || a.id.localeCompare(b.id));
await writeFile(join(OUT, 'index.json'), JSON.stringify(photos, null, 2) + '\n');
for (const name of await readdir(OUT)) {
  if (!current.has(name)) await rm(join(OUT, name), { recursive: true });
}
console.log(`Wrote index.json with ${photos.length} photos`);

if (upload) {
  const bucket = `s3://${process.env.R2_BUCKET}`;
  const renditions = [OUT, bucket, '--exclude', 'index.json', '--exclude', '.*',
    '--cache-control', 'public, max-age=31536000, immutable'];
  // New renditions first, then the manifest that points at them, and only then remove what it no longer uses.
  // A dry run skips the first pass, because the last one already lists every upload and deletion.
  if (!dryRun) aws('s3', 'sync', ...renditions);
  aws('s3', 'cp', join(OUT, 'index.json'), `${bucket}/index.json`, '--cache-control', 'no-cache');
  aws('s3', 'sync', ...renditions, '--delete');
  console.log(dryRun ? 'Dry run: nothing was uploaded or deleted' : `Published to ${bucket}`);
}

async function build(file) {
  const id = slug(file);
  if (photos.some((photo) => photo.id === id)) throw new Error(`produces the id "${id}", which another file already has. Rename one of them.`);

  const source = await readFile(join(src, file));
  // The fingerprint changes whenever the photo or the output settings change. It is part of every
  // file name, so a re-exported photo gets new URLs instead of hiding behind year-long caches.
  const fingerprint = createHash('sha1').update(source).update(`${WIDTHS}|${QUALITY}`).digest('hex').slice(0, 8);
  const image = sharp(source).rotate(); // bakes in the EXIF orientation; renditions carry no metadata
  const meta = await image.metadata();
  const turned = meta.orientation >= 5;
  const width = turned ? meta.height : meta.width;
  const height = turned ? meta.width : meta.height;

  const sizes = [];
  for (const target of WIDTHS) {
    const actual = Math.min(target, width); // never enlarge
    if (sizes.some((size) => size.width === actual)) continue; // small originals need fewer renditions
    const name = `${id}-${fingerprint}-${actual}.webp`;
    if (!(await exists(join(OUT, name)))) {
      const partial = join(OUT, `.${name}.partial`); // an interrupted run must not leave a broken rendition behind
      await image.clone().resize({ width: actual }).webp({ quality: QUALITY }).toFile(partial);
      await rename(partial, join(OUT, name));
    }
    current.add(name);
    sizes.push({ width: actual, file: name });
  }

  const taken = takenDate(meta.exif) ?? (await stat(join(src, file))).mtime.toISOString().slice(0, 10);
  console.log(`${file} → ${id} (${sizes.map((size) => size.width).join(', ')}px)`);
  return { id, taken, width, height, sizes };
}

// Ids are ASCII so URLs and object keys stay simple. A name that loses letters on the way
// (Japanese, Cyrillic, ...) gets a short hash of the file name appended, which keeps it unique and stable.
function slug(file) {
  const name = file.slice(0, -extname(file).length).normalize('NFKD').replace(/\p{M}/gu, '');
  const ascii = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (ascii && !/(?![\x00-\x7f])[\p{L}\p{N}]/u.test(name)) return ascii;
  const hash = createHash('sha1').update(file.normalize('NFC')).digest('hex').slice(0, 8);
  return `${ascii || 'photo'}-${hash}`;
}

function takenDate(exif) {
  if (!exif) return null;
  try {
    const tags = exifReader(exif);
    const date = tags.Photo?.DateTimeOriginal ?? tags.Image?.DateTime;
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : null;
  } catch {
    return null;
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

// R2 speaks the S3 protocol and the AWS CLI is only the client for it. The environment is pinned so that
// nothing from a personal AWS setup leaks in: R2 rejects AWS region names and the checksums newer CLIs
// send by default, and a profile or session token would override or corrupt the R2 credentials.
function aws(...args) {
  const env = {
    ...process.env,
    AWS_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    AWS_REGION: 'auto',
    AWS_DEFAULT_REGION: 'auto',
    AWS_REQUEST_CHECKSUM_CALCULATION: 'when_required',
    AWS_RESPONSE_CHECKSUM_VALIDATION: 'when_required',
  };
  for (const name of ['AWS_PROFILE', 'AWS_DEFAULT_PROFILE', 'AWS_SESSION_TOKEN']) delete env[name];
  const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  try {
    execFileSync('aws', [...args, '--endpoint-url', endpoint, ...(dryRun ? ['--dryrun'] : [])], { stdio: 'inherit', env });
  } catch {
    fail('The upload failed; the AWS CLI output above says why.');
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
