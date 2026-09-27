// ─── What the voice says ──────────────────────────────────────────────────
// Every beat in timeline.ts has a caption written to be read. This turns it
// into something written to be heard — symbols spelled out, shouty capitals
// lowered, "pts" said as points — and gives each distinct sentence a stable
// id. The id names the pre-generated clip in public/audio/scrum-studio/,
// so a sentence edited in timeline.ts simply has no clip until the
// generator is re-run (scripts/scrum-narration/), and the studio falls back
// to the browser's own speech voice for it in the meantime.
//
// Pure, with no browser or Vite dependencies, because the generator script
// imports it too.

import type { Beat } from './timeline';

const KEEP_CAPS = new Set(['GPS', 'PO']); // PO is expanded below

export function speakable(raw: string): string {
  return raw
    .replace(/\((\d+)\)/g, ', with $1,')
    .replace(/\s*·\s*/g, ', ')
    .replace(/[“”"]/g, '')
    .replace(/[‘’]/g, '\'')
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*→\s*/g, ' to ')
    .replace(/≤\s*/g, 'at most ')
    .replace(/~\s*/g, 'about ')
    .replace(/(\d+)\s*%/g, '$1 percent')
    .replace(/\b(\d+):00\b/g, '$1 o\'clock')
    .replace(/\s=\s/g, ' is ')
    .replace(/\?\s*pts\b/g, 'question-mark points')
    .replace(/\bpts\b/g, 'points')
    .replace(/\bMs\b/g, 'Miz')
    .replace(/\bMr\b/g, 'Mister')
    .replace(/\b1 kg\b/g, 'one kilogram')
    .replace(/\b([A-Z]{3,})\b/g, w => (KEEP_CAPS.has(w) ? w : w.toLowerCase()))
    .replace(/&/g, 'and')
    .replace(/\s\+\s/g, ' plus ')
    .replace(/\bPO\b/g, 'Product Owner')
    .replace(/…/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/\.\s*\./g, '.')
    .replace(/([!?])\./g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function spokenFor(b: Beat): string {
  return speakable(b.say ?? `${b.tag}. ${b.text}`);
}

/** FNV-1a, 32-bit, as eight hex digits: the clip's file name. */
export function speechId(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
