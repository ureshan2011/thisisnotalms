import type { jsPDF } from 'jspdf';

// ─── The student's own artefact, as a one-page PDF ────────────────────────
// Deliberately a separate builder from notesPdf.ts, for one reason: this
// document is not mine. The notes PDF is course material, so it is encrypted,
// watermarked and licensed. This one is a student's own analysis of their own
// incident, so it carries no password, no permissions, no watermark and no
// copyright line. It is theirs to email, print, annotate or throw away.
//
// It is also built entirely in the browser. Nothing about the student's work
// is uploaded, which is what makes it safe to ask somebody to write down
// something that actually went wrong at their workplace.

export interface ArtefactBlock {
  /** Small-caps label above the body, e.g. "Structures". */
  label: string;
  /** What the student wrote. Empty is allowed and prints as a ruled gap. */
  body: string;
  /** A chosen option shown as a tag beside the label, e.g. "Waterfall". */
  tag?: string;
  /** One line of framework guidance, printed small under the label. */
  caption?: string;
}

export interface Artefact {
  code: string;
  course: string;
  /** The framework this applies, e.g. "The Iceberg Model". */
  framework: string;
  /** The student's own one-line title for the thing they analysed. */
  title: string;
  /** Where it came from, printed in the footer. */
  source: string;
  fileName: string;
  blocks: ArtefactBlock[];
}

// A4 in millimetres.
const PAGE_W = 210;
const PAGE_H = 297;
const M_X = 18;
const M_TOP = 18;
const M_BOTTOM = 20;
const CONTENT_W = PAGE_W - M_X * 2;
const MAX_Y = PAGE_H - M_BOTTOM;

const INK: [number, number, number] = [26, 22, 21];
const BODY: [number, number, number] = [58, 52, 49];
const MUTED: [number, number, number] = [124, 116, 112];
const HAIR: [number, number, number] = [214, 205, 199];

/** Characters the standard PDF fonts render badly, mapped to safe equivalents. */
function clean(s: string): string {
  return s
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s*—\s*/g, ' - ')
    .replace(/\s*–\s*/g, '-')
    .replace(/…/g, '...')
    .replace(/ /g, ' ')
    .replace(/→/g, '->')
    .replace(/×/g, 'x');
}

const lineHeight = (size: number) => size * 0.3528 * 1.34;

export async function buildArtefactPdf(a: Artefact): Promise<jsPDF> {
  const { jsPDF: JsPDF } = await import('jspdf');
  const doc = new JsPDF({ unit: 'mm', format: 'a4' });

  doc.setProperties({
    title: `${a.code} - ${a.title}`,
    subject: `${a.framework}, applied. Prepared by a student of ${a.course}.`,
    creator: 'Blended Teaching Content',
  });

  let y = M_TOP;

  const setFont = (size: number, style: 'normal' | 'bold' | 'italic' = 'normal') => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  };
  const setColor = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const rule = (atY: number) => {
    doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
    doc.setLineWidth(0.2);
    doc.line(M_X, atY, PAGE_W - M_X, atY);
  };
  const ensure = (h: number) => {
    if (y + h <= MAX_Y) return;
    doc.addPage();
    y = M_TOP;
  };

  // ── Masthead ────────────────────────────────────────────────────────────
  setFont(8, 'bold');
  setColor(MUTED);
  doc.text(`${a.code}  ${a.framework.toUpperCase()}`, M_X, y);
  setFont(8, 'normal');
  doc.text(
    new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }),
    PAGE_W - M_X,
    y,
    { align: 'right' },
  );
  y += 4;
  rule(y);
  y += 10;

  // ── The student's title ─────────────────────────────────────────────────
  setFont(19, 'bold');
  setColor(INK);
  const titleLines = doc.splitTextToSize(clean(a.title || 'Untitled'), CONTENT_W) as string[];
  titleLines.forEach(line => {
    ensure(lineHeight(19));
    doc.text(line, M_X, y);
    y += lineHeight(19);
  });
  y += 7;

  // ── Blocks ──────────────────────────────────────────────────────────────
  a.blocks.forEach((b, i) => {
    if (i > 0) {
      ensure(8);
      rule(y - 3);
      y += 4;
    }

    ensure(14);
    setFont(8.5, 'bold');
    setColor(INK);
    doc.text(clean(b.label.toUpperCase()), M_X, y);

    if (b.tag) {
      setFont(8.5, 'normal');
      setColor(MUTED);
      doc.text(clean(b.tag), PAGE_W - M_X, y, { align: 'right' });
    }
    y += 5;

    if (b.caption) {
      setFont(8, 'italic');
      setColor(MUTED);
      const capLines = doc.splitTextToSize(clean(b.caption), CONTENT_W) as string[];
      capLines.forEach(line => {
        ensure(lineHeight(8));
        doc.text(line, M_X, y);
        y += lineHeight(8);
      });
      y += 1.5;
    }

    const text = b.body.trim();
    if (text) {
      setFont(10.5, 'normal');
      setColor(BODY);
      const lines = doc.splitTextToSize(clean(text), CONTENT_W) as string[];
      lines.forEach(line => {
        ensure(lineHeight(10.5));
        doc.text(line, M_X, y);
        y += lineHeight(10.5);
      });
    } else {
      // An unanswered step prints as ruled space rather than disappearing,
      // so a half-finished sheet is still usable on paper in class.
      doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
      doc.setLineWidth(0.15);
      for (let n = 0; n < 2; n += 1) {
        ensure(7);
        doc.line(M_X, y + 2, PAGE_W - M_X, y + 2);
        y += 7;
      }
    }
    y += 5;
  });

  // ── Footer, on every page ───────────────────────────────────────────────
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    rule(PAGE_H - M_BOTTOM + 6);
    setFont(7.5, 'normal');
    setColor(MUTED);
    doc.text(clean(a.source), M_X, PAGE_H - M_BOTTOM + 11);
    doc.text(
      'Your own work. Built in your browser, never uploaded.',
      PAGE_W - M_X,
      PAGE_H - M_BOTTOM + 11,
      { align: 'right' },
    );
  }

  return doc;
}

export async function downloadArtefact(a: Artefact): Promise<void> {
  const doc = await buildArtefactPdf(a);
  doc.save(`${a.fileName}.pdf`);
}
