/* Per-course output layout, shared by assemble/render/encrypt/verify so a
   multi-course build never has one course's dist/ wipe another's. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function distDirs(slug) {
  const root = path.join(ROOT, 'dist', slug);
  return {
    root,
    html: path.join(root, 'html'),
    pdfTmp: path.join(root, 'pdf-unencrypted'),
    pdf: path.join(root, 'pdf'),
    manifest: path.join(root, 'manifest.json'),
  };
}
