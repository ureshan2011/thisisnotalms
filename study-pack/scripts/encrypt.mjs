/* Encrypt rendered PDFs: AES-256, user (open) password + owner password with
   copy/edit/annotate restrictions. Backend: @cantoo/pdf-lib (pure JS).
   Swap this module's exports to change backend (e.g. qpdf) without touching
   build.mjs. */
import path from 'node:path';
import fs from 'node:fs';
import { PDFDocument, PDFHeader } from '@cantoo/pdf-lib';
import { distDirs } from './paths.mjs';

export function getPasswords({ required }) {
  const userPassword = process.env.STUDY_PACK_USER_PASSWORD;
  const ownerPassword = process.env.STUDY_PACK_OWNER_PASSWORD;
  if (!required) return { userPassword, ownerPassword };
  if (!userPassword || !ownerPassword) {
    throw new Error(
      'STUDY_PACK_USER_PASSWORD and STUDY_PACK_OWNER_PASSWORD must be set ' +
        '(or pass --no-encrypt for an unprotected draft build).'
    );
  }
  if (userPassword === ownerPassword) {
    throw new Error('The user (open) password and owner password must differ.');
  }
  return { userPassword, ownerPassword };
}

export async function encryptAll(rendered, { userPassword, ownerPassword }, slug) {
  const dirs = distDirs(slug);
  fs.mkdirSync(dirs.pdf, { recursive: true });
  const results = [];
  for (const item of rendered) {
    const bytes = fs.readFileSync(item.pdfTmp);
    const doc = await PDFDocument.load(bytes);
    // '1.7ext3' selects the AES-256 (V5/AESV3, R5) security handler; the
    // emitted header stays %PDF-1.7 as per the Adobe Extension Level 3 spec.
    doc.context.header = PDFHeader.forVersion(1, '7ext3');
    doc.setTitle(item.pdfName.replace(/\.pdf$/, '').replace(/-/g, ' '));
    doc.encrypt({
      userPassword,
      ownerPassword,
      permissions: {
        printing: 'highResolution',
        copying: false,
        modifying: false,
        annotating: false,
        fillingForms: false,
        documentAssembly: false,
        contentAccessibility: true,
      },
    });
    const outPath = path.join(dirs.pdf, item.pdfName);
    // Object streams are required here: @cantoo/pdf-lib's encryption garbles
    // strings written as plain indirect objects (Info title, outline entries
    // show up as mojibake/"undefined" in viewers). Inside object streams the
    // whole stream is encrypted as one unit, which round-trips correctly.
    // verify.mjs asserts the decrypted title and bookmarks stay readable.
    fs.writeFileSync(outPath, await doc.save({ useObjectStreams: true }));
    fs.rmSync(item.pdfTmp);
    console.log(`  [encrypt] ${item.pdfName}`);
    results.push({ ...item, pdf: outPath });
  }
  fs.rmSync(dirs.pdfTmp, { recursive: true, force: true });
  return results;
}

export function passthroughAll(rendered, slug) {
  // --no-encrypt draft mode: move files with a loud name, never the real name.
  const dirs = distDirs(slug);
  fs.mkdirSync(dirs.pdf, { recursive: true });
  return rendered.map((item) => {
    const draftName = item.pdfName.replace(/\.pdf$/, '-UNPROTECTED-DRAFT.pdf');
    const outPath = path.join(dirs.pdf, draftName);
    fs.renameSync(item.pdfTmp, outPath);
    return { ...item, pdf: outPath, pdfName: draftName, draft: true };
  });
}
