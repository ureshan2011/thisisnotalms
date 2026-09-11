import type { jsPDF } from 'jspdf';

// ─── Course notes as a password-protected PDF ─────────────────────────────
// Turns a NotesDoc — a curated, print-shaped condensation of a course page —
// into an A4 document and encrypts it before download.
//
// Why a hand-written document model rather than printing the page: these
// pages are half interactive. A spreadsheet you break, a chart you build, a
// stepper you walk. None of that survives a print stylesheet, and a PDF full
// of dead widgets is worse than no PDF. So each page declares what its notes
// should say, and this renders that.
//
// On the encryption: jsPDF writes the standard PDF security handler, which
// makes every reader ask for the password before showing a page. It is a
// deterrent, not a vault — the scheme is old RC4, and because the file is
// built in the browser the password necessarily ships in the page's
// JavaScript. Treat it as "not casually openable", never as confidential.

export interface NoteBlock {
  type: 'p' | 'bullets' | 'numbered' | 'table' | 'code' | 'callout' | 'kv';
  /** p, code: the body. callout: the body. */
  text?: string;
  /** callout: its heading. */
  title?: string;
  /** bullets: one line each. */
  items?: string[];
  /** numbered, kv: a label and its explanation. */
  pairs?: [string, string][];
  /** table: header cells. */
  head?: string[];
  /** table: body rows. */
  rows?: string[][];
  /** table: relative column widths, defaults to equal. */
  weights?: number[];
}

export interface NoteSection {
  heading: string;
  /** One line under the heading, before the blocks. */
  standfirst?: string;
  blocks: NoteBlock[];
}

export interface NotesDoc {
  /** Course code, e.g. "MBI802". */
  code: string;
  /** Full course name. */
  course: string;
  /** What this particular document covers. */
  title: string;
  /** One sentence on the scope of these notes. */
  summary: string;
  /** Accent as [r, g, b], matching the page these notes came from. */
  accent: [number, number, number];
  /** Downloaded filename, without the extension. */
  fileName: string;
  sections: NoteSection[];
}

/** The password a reader must type to open any notes PDF this builds. */
export const NOTES_PASSWORD = 'MBINote2026';

const AUTHOR = 'Yasas Sri Wickramasinghe';
const BRAND = 'Blended Teaching Content';
const COPYRIGHT = `© ${new Date().getFullYear()} ${AUTHOR}. All rights reserved.`;

const PURPOSE =
  'This document is generated as extra reading material. It is a summary, not the ' +
  'primary lesson content — refer to your LMS for the authoritative course material, ' +
  'assessments, deadlines and announcements.';

const TERMS =
  'Provided to enrolled students for personal study only. Not to be redistributed, ' +
  'republished, uploaded to any file-sharing or study-notes service, or used to train ' +
  'automated systems, without the author\'s written permission.';

// A4 in millimetres.
const PAGE_W = 210;
const PAGE_H = 297;
const M_X = 20;
const M_TOP = 20;
const M_BOTTOM = 24;
const CONTENT_W = PAGE_W - M_X * 2;
const MAX_Y = PAGE_H - M_BOTTOM;

const INK: [number, number, number] = [26, 22, 21];
const BODY: [number, number, number] = [58, 52, 49];
const MUTED: [number, number, number] = [124, 116, 112];
const HAIR: [number, number, number] = [214, 205, 199];
const PAPER: [number, number, number] = [250, 246, 242];

/** Characters the standard PDF fonts render badly, mapped to safe equivalents. */
function clean(s: string): string {
  return s
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    // Collapse the spaces around a dash rather than adding to them.
    .replace(/\s*—\s*/g, ' - ')
    .replace(/\s*–\s*/g, '-')
    .replace(/…/g, '...')
    .replace(/ /g, ' ')
    .replace(/[→]/g, '->')
    .replace(/[×]/g, 'x');
}

class Renderer {
  private y = M_TOP;
  private page = 1;

  constructor(private doc: jsPDF, private meta: NotesDoc) {}

  private setFont(size: number, style: 'normal' | 'bold' | 'italic' = 'normal', font = 'helvetica') {
    this.doc.setFont(font, style);
    this.doc.setFontSize(size);
  }

  private setColor(c: [number, number, number]) {
    this.doc.setTextColor(c[0], c[1], c[2]);
  }

  /** Height of `text` once wrapped to `width`, in mm. */
  private measure(text: string, width: number, size: number, style: 'normal' | 'bold' | 'italic' = 'normal', font = 'helvetica') {
    this.setFont(size, style, font);
    const lines = this.doc.splitTextToSize(clean(text), width) as string[];
    return { lines, height: lines.length * (size * 0.3528 * 1.32) };
  }

  private lineHeight(size: number) {
    return size * 0.3528 * 1.32;
  }

  private ensure(height: number) {
    if (this.y + height <= MAX_Y) return;
    this.newPage();
  }

  private newPage() {
    this.doc.addPage();
    this.page += 1;
    this.y = M_TOP;
    this.runningHead();
  }

  private runningHead() {
    this.setFont(7.5, 'normal');
    this.setColor(MUTED);
    this.doc.text(`${this.meta.code} - ${this.meta.title}`, M_X, 12);
    this.doc.text('Extra reading material', PAGE_W - M_X, 12, { align: 'right' });
    this.doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
    this.doc.setLineWidth(0.2);
    this.doc.line(M_X, 14.5, PAGE_W - M_X, 14.5);
    this.y = M_TOP + 2;
  }

  /** Paragraph. */
  private para(text: string, size = 10, color = BODY, style: 'normal' | 'bold' | 'italic' = 'normal', indent = 0) {
    const width = CONTENT_W - indent;
    const { lines } = this.measure(text, width, size, style);
    const lh = this.lineHeight(size);
    this.setColor(color);
    for (const line of lines) {
      this.ensure(lh);
      this.setFont(size, style);
      this.setColor(color);
      this.doc.text(line, M_X + indent, this.y + lh * 0.75);
      this.y += lh;
    }
  }

  private gap(mm: number) {
    this.y += mm;
  }

  private sectionHeading(text: string, standfirst?: string) {
    const { height } = this.measure(text, CONTENT_W, 13.5, 'bold');
    this.ensure(height + 14);
    this.gap(4);
    this.doc.setDrawColor(this.meta.accent[0], this.meta.accent[1], this.meta.accent[2]);
    this.doc.setLineWidth(0.8);
    this.doc.line(M_X, this.y, M_X + 14, this.y);
    this.gap(4.5);
    this.para(text, 13.5, this.meta.accent, 'bold');
    if (standfirst) {
      this.gap(1.5);
      this.para(standfirst, 9, MUTED, 'italic');
    }
    this.gap(2.5);
  }

  private subHeading(text: string) {
    const { height } = this.measure(text, CONTENT_W, 10.5, 'bold');
    this.ensure(height + 6);
    this.gap(2);
    this.para(text, 10.5, INK, 'bold');
    this.gap(0.8);
  }

  private bullets(items: string[]) {
    for (const item of items) {
      const { lines } = this.measure(item, CONTENT_W - 6, 10);
      const lh = this.lineHeight(10);
      this.ensure(lh);
      this.setFont(10, 'bold');
      this.setColor(this.meta.accent);
      this.doc.text('•', M_X + 1, this.y + lh * 0.75);
      this.setFont(10, 'normal');
      this.setColor(BODY);
      lines.forEach((line, i) => {
        if (i > 0) this.ensure(lh);
        this.setFont(10, 'normal');
        this.setColor(BODY);
        this.doc.text(line, M_X + 6, this.y + lh * 0.75);
        this.y += lh;
      });
      this.gap(1.4);
    }
  }

  private numbered(pairs: [string, string][]) {
    pairs.forEach(([title, body], i) => {
      const n = `${i + 1}.`;
      const { lines: tLines } = this.measure(title, CONTENT_W - 8, 10, 'bold');
      const lh = this.lineHeight(10);
      const bodyLines = body ? this.measure(body, CONTENT_W - 8, 9.5).lines.length : 0;
      const whole = lh * tLines.length + this.lineHeight(9.5) * bodyLines + 2;
      // Orphan control: never leave a numbered heading stranded at the foot
      // of a page, unless the item is too tall for a page of its own anyway.
      if (whole <= MAX_Y - M_TOP) this.ensure(whole);
      else this.ensure(lh * (tLines.length + 1));
      this.setFont(10, 'bold');
      this.setColor(this.meta.accent);
      this.doc.text(n, M_X + 0.5, this.y + lh * 0.75);
      tLines.forEach((line, li) => {
        if (li > 0) this.ensure(lh);
        this.setFont(10, 'bold');
        this.setColor(INK);
        this.doc.text(line, M_X + 8, this.y + lh * 0.75);
        this.y += lh;
      });
      if (body) this.para(body, 9.5, BODY, 'normal', 8);
      this.gap(2);
    });
  }

  private kv(pairs: [string, string][]) {
    const labelW = 46;
    for (const [k, v] of pairs) {
      const { lines: vLines } = this.measure(v, CONTENT_W - labelW - 4, 9.5);
      const { lines: kLines } = this.measure(k, labelW - 2, 9.5, 'bold');
      const lh = this.lineHeight(9.5);
      const rows = Math.max(vLines.length, kLines.length);
      this.ensure(lh * rows + 2.5);
      const top = this.y;
      kLines.forEach((line, i) => {
        this.setFont(9.5, 'bold');
        this.setColor(INK);
        this.doc.text(line, M_X, top + lh * (i + 0.75));
      });
      vLines.forEach((line, i) => {
        this.setFont(9.5, 'normal');
        this.setColor(BODY);
        this.doc.text(line, M_X + labelW, top + lh * (i + 0.75));
      });
      this.y = top + lh * rows + 1.2;
      this.doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
      this.doc.setLineWidth(0.15);
      this.doc.line(M_X, this.y, PAGE_W - M_X, this.y);
      this.gap(1.8);
    }
  }

  private table(head: string[], rows: string[][], weights?: number[]) {
    const w = weights && weights.length === head.length ? weights : head.map(() => 1);
    const total = w.reduce((a, b) => a + b, 0);
    const cols = w.map(x => (CONTENT_W * x) / total);
    const pad = 2;

    const drawHead = () => {
      const lh = this.lineHeight(8.5);
      const cells = head.map((h, i) => this.measure(h, cols[i] - pad * 2, 8.5, 'bold').lines);
      const rowH = Math.max(...cells.map(c => c.length)) * lh + 3;
      this.ensure(rowH + 8);
      this.doc.setFillColor(PAPER[0], PAPER[1], PAPER[2]);
      this.doc.rect(M_X, this.y, CONTENT_W, rowH, 'F');
      let x = M_X;
      cells.forEach((lines, i) => {
        lines.forEach((line, li) => {
          this.setFont(8.5, 'bold');
          this.setColor(INK);
          this.doc.text(line, x + pad, this.y + 1.5 + lh * (li + 0.75));
        });
        x += cols[i];
      });
      this.y += rowH;
      this.doc.setDrawColor(this.meta.accent[0], this.meta.accent[1], this.meta.accent[2]);
      this.doc.setLineWidth(0.4);
      this.doc.line(M_X, this.y, PAGE_W - M_X, this.y);
    };

    drawHead();

    for (const row of rows) {
      const lh = this.lineHeight(8.5);
      const cells = row.map((c, i) => this.measure(c, cols[i] - pad * 2, 8.5).lines);
      const rowH = Math.max(...cells.map(c => c.length)) * lh + 3;
      if (this.y + rowH > MAX_Y) {
        this.newPage();
        drawHead();
      }
      let x = M_X;
      cells.forEach((lines, i) => {
        lines.forEach((line, li) => {
          this.setFont(8.5, 'normal');
          this.setColor(i === 0 ? INK : BODY);
          this.doc.text(line, x + pad, this.y + 1.5 + lh * (li + 0.75));
        });
        x += cols[i];
      });
      this.y += rowH;
      this.doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
      this.doc.setLineWidth(0.15);
      this.doc.line(M_X, this.y, PAGE_W - M_X, this.y);
    }
    this.gap(3);
  }

  private code(text: string) {
    const lines = clean(text).split('\n');
    const lh = this.lineHeight(8.5);
    const boxH = lines.length * lh + 6;
    this.ensure(Math.min(boxH, 40));
    const start = this.y;
    this.doc.setFillColor(245, 242, 238);
    this.doc.rect(M_X, start, CONTENT_W, Math.min(boxH, MAX_Y - start), 'F');
    this.y += 3;
    for (const line of lines) {
      if (this.y + lh > MAX_Y) {
        this.newPage();
        this.doc.setFillColor(245, 242, 238);
        this.doc.rect(M_X, this.y, CONTENT_W, MAX_Y - this.y, 'F');
        this.y += 2;
      }
      this.setFont(8.5, 'normal', 'courier');
      this.setColor(INK);
      this.doc.text(line || ' ', M_X + 3, this.y + lh * 0.75);
      this.y += lh;
    }
    this.gap(4);
  }

  private callout(title: string, text: string) {
    const { lines: bLines } = this.measure(text, CONTENT_W - 10, 9.5);
    const lh = this.lineHeight(9.5);
    const boxH = bLines.length * lh + 13;
    this.ensure(boxH + 2);
    const start = this.y;
    this.doc.setFillColor(PAPER[0], PAPER[1], PAPER[2]);
    this.doc.rect(M_X, start, CONTENT_W, boxH, 'F');
    this.doc.setFillColor(this.meta.accent[0], this.meta.accent[1], this.meta.accent[2]);
    this.doc.rect(M_X, start, 1.4, boxH, 'F');
    this.setFont(8, 'bold');
    this.setColor(this.meta.accent);
    this.doc.text(clean(title).toUpperCase(), M_X + 5, start + 5.5);
    bLines.forEach((line, i) => {
      this.setFont(9.5, 'normal');
      this.setColor(BODY);
      this.doc.text(line, M_X + 5, start + 9 + lh * (i + 0.75));
    });
    this.y = start + boxH + 3;
  }

  /** Page 1: who wrote it, what it is, and what it is not. */
  private cover() {
    const a = this.meta.accent;
    this.doc.setFillColor(a[0], a[1], a[2]);
    this.doc.rect(0, 0, PAGE_W, 6, 'F');

    this.y = 34;
    this.para(BRAND, 15, INK, 'bold');
    this.gap(0.5);
    this.para(`by ${AUTHOR}`, 9.5, MUTED);
    this.gap(14);

    this.doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
    this.doc.setLineWidth(0.3);
    this.doc.line(M_X, this.y, PAGE_W - M_X, this.y);
    this.gap(10);

    this.para(`${this.meta.code}  ·  ${this.meta.course}`, 9, a, 'bold');
    this.gap(4);
    this.para(this.meta.title, 24, INK, 'bold');
    this.gap(5);
    this.para(this.meta.summary, 11, BODY);
    this.gap(12);

    this.callout('What this document is', PURPOSE);
    this.gap(3);
    this.callout('Terms of use', TERMS);

    // Pinned to the foot of the cover.
    this.y = PAGE_H - 52;
    this.doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
    this.doc.setLineWidth(0.3);
    this.doc.line(M_X, this.y, PAGE_W - M_X, this.y);
    this.gap(6);
    this.para(COPYRIGHT, 9, INK, 'bold');
    this.gap(1.5);
    this.para(
      `Generated ${new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}. ` +
      'Course material and menu names change; where this document and your LMS disagree, the LMS is correct.',
      8.5,
      MUTED,
    );
  }

  /** Footer on every page but the cover, added once the total is known. */
  private footers() {
    const total = this.doc.getNumberOfPages();
    for (let p = 2; p <= total; p += 1) {
      this.doc.setPage(p);
      this.doc.setDrawColor(HAIR[0], HAIR[1], HAIR[2]);
      this.doc.setLineWidth(0.2);
      this.doc.line(M_X, PAGE_H - 17, PAGE_W - M_X, PAGE_H - 17);
      this.setFont(7.5, 'normal');
      this.setColor(MUTED);
      this.doc.text(COPYRIGHT, M_X, PAGE_H - 12.5);
      this.doc.text('Extra reading material - see your LMS for the primary content', M_X, PAGE_H - 9);
      this.doc.text(`Page ${p - 1} of ${total - 1}`, PAGE_W - M_X, PAGE_H - 12.5, { align: 'right' });
    }
  }

  render() {
    this.cover();
    this.doc.addPage();
    this.page = 2;
    this.y = M_TOP;
    this.runningHead();

    for (const section of this.meta.sections) {
      this.sectionHeading(section.heading, section.standfirst);
      for (const b of section.blocks) {
        switch (b.type) {
          case 'p':
            if (b.title) this.subHeading(b.title);
            if (b.text) this.para(b.text);
            this.gap(2);
            break;
          case 'bullets':
            if (b.title) this.subHeading(b.title);
            this.bullets(b.items ?? []);
            this.gap(1);
            break;
          case 'numbered':
            if (b.title) this.subHeading(b.title);
            this.numbered(b.pairs ?? []);
            break;
          case 'kv':
            if (b.title) this.subHeading(b.title);
            this.kv(b.pairs ?? []);
            this.gap(1);
            break;
          case 'table':
            if (b.title) this.subHeading(b.title);
            this.table(b.head ?? [], b.rows ?? [], b.weights);
            break;
          case 'code':
            if (b.title) this.subHeading(b.title);
            this.code(b.text ?? '');
            break;
          case 'callout':
            this.callout(b.title ?? 'Note', b.text ?? '');
            this.gap(2);
            break;
        }
      }
      this.gap(4);
    }

    this.footers();
  }
}

/**
 * Builds the encrypted document and returns it, without saving. Separate from
 * the download so the layout can be rendered and inspected outside a browser.
 * jsPDF is imported here rather than at the top of the module so its ~350KB
 * only loads when somebody actually asks for a document.
 */
export async function buildNotesPdf(meta: NotesDoc): Promise<jsPDF> {
  const { jsPDF: JsPDF } = await import('jspdf');

  const doc = new JsPDF({
    unit: 'mm',
    format: 'a4',
    encryption: {
      userPassword: NOTES_PASSWORD,
      // A separate owner password nobody is given, so the permissions below
      // cannot simply be lifted by opening with the reader password.
      ownerPassword: `${NOTES_PASSWORD}-owner-${meta.code}`,
      // Reading and printing for study; no copy-paste extraction, no editing.
      userPermissions: ['print'],
    },
  });

  doc.setProperties({
    title: `${meta.code} - ${meta.title}`,
    subject: `${meta.course}. Extra reading material.`,
    author: AUTHOR,
    creator: BRAND,
    keywords: [meta.code, 'course notes', 'extra reading material'].join(', '),
  });

  new Renderer(doc, meta).render();
  return doc;
}

/** Builds the notes and hands the browser a download. */
export async function downloadNotes(meta: NotesDoc): Promise<void> {
  const doc = await buildNotesPdf(meta);
  doc.save(`${meta.fileName}.pdf`);
}
