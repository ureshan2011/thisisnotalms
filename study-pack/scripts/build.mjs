/* Study-pack build orchestrator.
   Usage: node scripts/build.mjs [--lesson N] [--no-encrypt] [--keep-html]
   Env:   STUDY_PACK_USER_PASSWORD, STUDY_PACK_OWNER_PASSWORD (required unless --no-encrypt) */
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadCourse, assemble } from './assemble.mjs';
import { renderAll } from './render.mjs';
import { encryptAll, passthroughAll, getPasswords } from './encrypt.mjs';
import { verifyAll, writeManifest } from './verify.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const noEncrypt = flag('--no-encrypt');
const keepHtml = flag('--keep-html');
const only = opt('--lesson');

const course = loadCourse();
const passwords = getPasswords({ required: !noEncrypt });

console.log(`Building ${course.code} study pack${only ? ` (lesson ${only} only)` : ''}${noEncrypt ? ' [UNPROTECTED DRAFT]' : ''}`);

fs.rmSync(path.join(ROOT, 'dist'), { recursive: true, force: true });

console.log('• Assembling HTML…');
const outputs = assemble(course, { only });
if (!outputs.length) {
  console.error('Nothing to build — no lesson content found.');
  process.exit(1);
}

console.log('• Rendering PDFs…');
const rendered = await renderAll(outputs);

let built;
if (noEncrypt) {
  console.warn('• Skipping encryption (--no-encrypt) — outputs named *-UNPROTECTED-DRAFT.pdf');
  built = passthroughAll(rendered);
} else {
  console.log('• Encrypting (AES-256, user+owner password, copy/edit restricted)…');
  built = await encryptAll(rendered, passwords);
}

console.log('• Verifying…');
const { problems, warnings, manifest } = await verifyAll(built, course, {
  encrypted: !noEncrypt,
  userPassword: passwords.userPassword,
});

let gitSha = null;
try {
  gitSha = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
} catch { /* not a git checkout */ }
writeManifest(manifest, {
  course: course.code,
  academicYear: course.academicYear,
  encrypted: !noEncrypt,
  gitSha,
});

if (!keepHtml) fs.rmSync(path.join(ROOT, 'dist', 'html'), { recursive: true, force: true });

for (const w of warnings) console.warn(`  [warn] ${w}`);
if (problems.length) {
  for (const p of problems) console.error(`  [FAIL] ${p}`);
  process.exit(1);
}
console.log(`✓ Build complete — ${built.length} PDF(s) in study-pack/dist/pdf/`);
