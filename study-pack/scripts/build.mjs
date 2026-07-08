/* Study-pack build orchestrator.
   Usage: node scripts/build.mjs [--course slug] [--lesson N] [--no-encrypt] [--keep-html]
   Omit --course to build every course found under content/<slug>/course.json.
   Env:   STUDY_PACK_USER_PASSWORD, STUDY_PACK_OWNER_PASSWORD (required unless --no-encrypt) */
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { loadCourse, listCourses, assemble } from './assemble.mjs';
import { renderAll } from './render.mjs';
import { encryptAll, passthroughAll, getPasswords } from './encrypt.mjs';
import { verifyAll, writeManifest } from './verify.mjs';
import { distDirs } from './paths.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const noEncrypt = flag('--no-encrypt');
const keepHtml = flag('--keep-html');
const only = opt('--lesson');
const courseArg = opt('--course');

const slugs = courseArg ? [courseArg] : listCourses();
if (!slugs.length) {
  console.error('No courses found under content/*/course.json.');
  process.exit(1);
}

const passwords = getPasswords({ required: !noEncrypt });
let gitSha = null;
try {
  gitSha = execSync('git rev-parse --short HEAD').toString().trim();
} catch { /* not a git checkout */ }

let anyProblems = false;

for (const slug of slugs) {
  const course = loadCourse(slug);
  const dirs = distDirs(slug);

  console.log(
    `Building ${course.code} study pack${only ? ` (lesson ${only} only)` : ''}${noEncrypt ? ' [UNPROTECTED DRAFT]' : ''}`
  );

  fs.rmSync(dirs.root, { recursive: true, force: true });

  console.log('• Assembling HTML…');
  const outputs = assemble(course, { only });
  if (!outputs.length) {
    console.error(`Nothing to build for ${course.code} — no lesson content found.`);
    process.exit(1);
  }

  console.log('• Rendering PDFs…');
  const rendered = await renderAll(outputs, slug);

  let built;
  if (noEncrypt) {
    console.warn('• Skipping encryption (--no-encrypt) — outputs named *-UNPROTECTED-DRAFT.pdf');
    built = passthroughAll(rendered, slug);
  } else {
    console.log('• Encrypting (AES-256, user+owner password, copy/edit restricted)…');
    built = await encryptAll(rendered, passwords, slug);
  }

  console.log('• Verifying…');
  const { problems, warnings, manifest } = await verifyAll(built, course, {
    encrypted: !noEncrypt,
    userPassword: passwords.userPassword,
  });

  writeManifest(
    manifest,
    { course: course.code, academicYear: course.academicYear, encrypted: !noEncrypt, gitSha },
    slug
  );

  if (!keepHtml) fs.rmSync(dirs.html, { recursive: true, force: true });

  for (const w of warnings) console.warn(`  [warn] ${w}`);
  if (problems.length) {
    for (const p of problems) console.error(`  [FAIL] ${p}`);
    anyProblems = true;
    continue;
  }
  console.log(`✓ ${course.code} build complete — ${built.length} PDF(s) in study-pack/dist/${slug}/pdf/`);
}

if (anyProblems) process.exit(1);
