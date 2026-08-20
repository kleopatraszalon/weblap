import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const partsDir = resolve(root, 'public/booking/hero-parts');
const output = resolve(root, 'public/booking/booking4-hero-approved.webp');
const expectedBytes = 41000;
const expectedSha256 = '84bfa160c7a07f3e77970474ed6572bb970d72979aa59357c498a4cd80df6dd2';

const base64 = Array.from({ length: 7 }, (_, index) =>
  readFileSync(resolve(partsDir, `part${index}.b64`), 'utf8').trim(),
).join('');

const image = Buffer.from(base64, 'base64');
const sha256 = createHash('sha256').update(image).digest('hex');
const riff = image.subarray(0, 4).toString('ascii');
const webp = image.subarray(8, 12).toString('ascii');

if (image.length !== expectedBytes || riff !== 'RIFF' || webp !== 'WEBP' || sha256 !== expectedSha256) {
  throw new Error(
    `Booking hero integrity check failed: bytes=${image.length}, riff=${riff}, webp=${webp}, sha256=${sha256}`,
  );
}

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, image);
console.log(`Booking hero rebuilt and verified: ${image.length} bytes, sha256=${sha256}`);
