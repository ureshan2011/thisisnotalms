// ─── The certificate poster ────────────────────────────────────────────────
// Drawn straight onto a canvas, so the PNG a student downloads is exactly the
// poster they see, with no print stylesheet in between. 2400 × 1697 is A4
// landscape at about 205 dpi: sharp on a LinkedIn post and good on paper.
//
// The look is a classic diploma: ivory paper, a double frame in deep ink and
// gold, corner rosettes, a guilloche watermark, serif type with wide letter
// spacing, and a scalloped gold seal. Nothing on it names a platform or an
// institution: only the person, the proficiency, the course, the issuer and
// a way to check it is real.

export type CertKind = 'basic' | 'advanced';

export interface CertArt {
  name: string;
  kind: CertKind;
  /** "Basic Proficiency in SQL" */
  title: string;
  /** ISO date. */
  issued: string;
  id: string;
  /** A canvas holding the QR code, drawn at the bottom left. */
  qr?: HTMLCanvasElement | null;
}

export const CERT_W = 2400;
export const CERT_H = 1697;

const SERIF = `Fraunces, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif`;

const THEME: Record<CertKind, { ink: string; deep: string; seal: string }> = {
  basic: { ink: '#14284b', deep: '#0c1b36', seal: 'BASIC' },
  advanced: { ink: '#4a1626', deep: '#2f0c18', seal: 'ADVANCED' },
};
const GOLD = '#b8913a';
const GOLD_LIGHT = '#e4c982';
const GOLD_DARK = '#8a6a22';
const PAPER_A = '#fdfaf1';
const PAPER_B = '#f5edd8';

const BODY: Record<CertKind, string> = {
  basic:
    'Awarded for completing the full pathway in the SQL language: creating databases and tables, inserting, querying, updating and deleting data, and protecting it with keys and constraints, with every step checked automatically.',
  advanced:
    'Awarded for solving all eight advanced SQL challenges: reasoning about the order of changes, missing values, uniqueness, referential integrity and changes that cannot be undone, each marked against hidden data sets.',
};

export async function loadCertFonts() {
  const faces = ['500 40px Fraunces', 'italic 400 40px Fraunces', 'italic 600 40px Fraunces'];
  try {
    await Promise.all(faces.map(f => document.fonts.load(f)));
  } catch {
    /* the serif fallbacks still look fine */
  }
}

/** Draw text one letter at a time, because canvas letter-spacing is not in every browser. */
function tracked(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, track: number, align: 'center' | 'left' = 'center') {
  const chars = [...text];
  const widths = chars.map(c => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + track * (chars.length - 1);
  let x = align === 'center' ? cx - total / 2 : cx;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  chars.forEach((c, i) => {
    ctx.fillText(c, x, y);
    x += widths[i] + track;
  });
  ctx.textAlign = prev;
  return total;
}

function trackedWidth(ctx: CanvasRenderingContext2D, text: string, track: number) {
  return [...text].reduce((a, c) => a + ctx.measureText(c).width, 0) + track * ([...text].length - 1);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

function rosette(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, n: number, alpha: number, color: string, lw = 1.4) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lw;
  for (let i = 0; i < n; i++) {
    ctx.save();
    ctx.rotate((Math.PI * i) / n);
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function corner(ctx: CanvasRenderingContext2D, x: number, y: number, sx: number, sy: number, ink: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = i % 2 ? ink : GOLD;
    ctx.globalAlpha = i % 2 ? 0.55 : 1;
    ctx.beginPath();
    ctx.arc(0, 0, 26 + i * 15, 0, Math.PI / 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function emblem(ctx: CanvasRenderingContext2D, cx: number, cy: number, ink: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, 53, 0, Math.PI * 2);
  ctx.stroke();
  // A stack of three discs: a database, drawn with a quiet hand.
  ctx.fillStyle = ink;
  ctx.strokeStyle = PAPER_A;
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const y = -20 + i * 20;
    ctx.beginPath();
    ctx.ellipse(0, y + 12, 28, 9, 0, 0, Math.PI);
    ctx.lineTo(-28, y);
    ctx.ellipse(0, y, 28, 9, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, y, 28, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? ink : ink;
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function seal(ctx: CanvasRenderingContext2D, cx: number, cy: number, label: string, ink: string) {
  // Ribbon tails first, so the seal sits on top.
  ctx.save();
  ctx.translate(cx, cy);
  for (const dir of [-1, 1]) {
    ctx.save();
    ctx.rotate(dir * 0.22);
    ctx.fillStyle = ink;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-34, 60);
    ctx.lineTo(34, 60);
    ctx.lineTo(34, 200);
    ctx.lineTo(0, 172);
    ctx.lineTo(-34, 200);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  // Scalloped edge.
  const bumps = 40;
  const g = ctx.createRadialGradient(-30, -34, 10, 0, 0, 132);
  g.addColorStop(0, '#f3dd9c');
  g.addColorStop(0.55, GOLD);
  g.addColorStop(1, GOLD_DARK);
  ctx.fillStyle = g;
  ctx.shadowColor = 'rgba(70, 50, 10, 0.35)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.beginPath();
  for (let i = 0; i < bumps * 2; i++) {
    const a = (Math.PI * i) / bumps;
    const r = i % 2 ? 118 : 130;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = GOLD_DARK;
  ctx.lineWidth = 2;
  ctx.stroke();
  for (const [r, w, a] of [[102, 3, 0.9], [92, 1.5, 0.7]] as const) {
    ctx.strokeStyle = '#fff6d6';
    ctx.globalAlpha = a;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = `600 70px ${SERIF}`;
  ctx.fillText('SQL', 0, 16);
  // Long labels get smaller type so they stay inside the inner ring.
  ctx.font = `500 ${label.length > 6 ? 17 : 22}px ${SERIF}`;
  tracked(ctx, label, 0, 52, label.length > 6 ? 3 : 5);
  // Little stars either side of the top.
  ctx.font = `500 20px ${SERIF}`;
  tracked(ctx, '★ ★ ★', 0, -42, 6);
  ctx.restore();
}

export function drawCertificate(canvas: HTMLCanvasElement, art: CertArt) {
  const W = CERT_W;
  const H = CERT_H;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const t = THEME[art.kind];
  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = 'alphabetic';

  // Paper
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, PAPER_A);
  bg.addColorStop(1, PAPER_B);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.62);
  glow.addColorStop(0, 'rgba(255,255,255,0.55)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Watermark rosettes
  rosette(ctx, W / 2, H / 2 + 20, 560, 36, 0.07, GOLD, 1.6);
  rosette(ctx, W / 2, H / 2 + 20, 420, 28, 0.06, t.ink, 1.4);
  rosette(ctx, 150, 150, 210, 22, 0.1, GOLD);
  rosette(ctx, W - 150, 150, 210, 22, 0.1, GOLD);
  rosette(ctx, 150, H - 150, 210, 22, 0.1, GOLD);
  rosette(ctx, W - 150, H - 150, 210, 22, 0.1, GOLD);

  // Frame: thick ink, gold line, fine ink line
  ctx.strokeStyle = t.ink;
  ctx.lineWidth = 18;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 5;
  ctx.strokeRect(78, 78, W - 156, H - 156);
  ctx.strokeStyle = t.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(94, 94, W - 188, H - 188);
  corner(ctx, 94, 94, 1, 1, t.ink);
  corner(ctx, W - 94, 94, -1, 1, t.ink);
  corner(ctx, 94, H - 94, 1, -1, t.ink);
  corner(ctx, W - 94, H - 94, -1, -1, t.ink);

  ctx.textAlign = 'center';

  // Emblem and heading
  emblem(ctx, W / 2, 250, t.ink);
  ctx.fillStyle = GOLD_DARK;
  ctx.font = `500 36px ${SERIF}`;
  const head = 'CERTIFICATE OF ACHIEVEMENT';
  const hw = trackedWidth(ctx, head, 14);
  tracked(ctx, head, W / 2, 396, 14);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  for (const dir of [-1, 1]) {
    const x0 = W / 2 + dir * (hw / 2 + 50);
    ctx.beginPath();
    ctx.moveTo(x0, 384);
    ctx.lineTo(x0 + dir * 190, 384);
    ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.arc(x0 + dir * 205, 384, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#5b5444';
  ctx.font = `italic 400 44px ${SERIF}`;
  ctx.fillText('This is to certify that', W / 2, 486);

  // The name: as large as fits
  let size = 168;
  ctx.fillStyle = t.deep;
  do {
    ctx.font = `italic 600 ${size}px ${SERIF}`;
    size -= 4;
  } while (ctx.measureText(art.name).width > 1640 && size > 70);
  ctx.fillText(art.name, W / 2, 664);
  // Flourish under it
  const fw = Math.max(860, Math.min(1500, ctx.measureText(art.name).width + 120));
  const fg = ctx.createLinearGradient(W / 2 - fw / 2, 0, W / 2 + fw / 2, 0);
  fg.addColorStop(0, 'rgba(184,145,58,0)');
  fg.addColorStop(0.5, GOLD);
  fg.addColorStop(1, 'rgba(184,145,58,0)');
  ctx.strokeStyle = fg;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - fw / 2, 712);
  ctx.lineTo(W / 2 + fw / 2, 712);
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(W / 2, 700);
  ctx.lineTo(W / 2 + 12, 712);
  ctx.lineTo(W / 2, 724);
  ctx.lineTo(W / 2 - 12, 712);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#5b5444';
  ctx.font = `italic 400 42px ${SERIF}`;
  ctx.fillText('has achieved', W / 2, 800);

  // The proficiency, in capitals
  const title = art.title.toUpperCase();
  let ts = 98;
  ctx.fillStyle = t.ink;
  do {
    ctx.font = `500 ${ts}px ${SERIF}`;
    ts -= 4;
  } while (trackedWidth(ctx, title, ts * 0.12) > 1800 && ts > 50);
  tracked(ctx, title, W / 2, 925, ts * 0.12);

  ctx.fillStyle = GOLD_DARK;
  ctx.font = `italic 600 46px ${SERIF}`;
  ctx.fillText('MBI802 — Database Management Systems', W / 2, 1005);

  // What it means
  ctx.fillStyle = '#3d382d';
  ctx.font = `500 33px ${SERIF}`;
  const lines = wrap(ctx, BODY[art.kind], 1500);
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 1100 + i * 50));

  // Seal in the middle
  seal(ctx, W / 2, 1385, t.seal, t.ink);

  // Date (left) and issuer (right), each on a line
  const date = new Date(art.issued).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.strokeStyle = t.ink;
  ctx.lineWidth = 2;
  for (const [x0, x1] of [[290, 830], [1570, 2110]]) {
    ctx.beginPath();
    ctx.moveTo(x0, 1400);
    ctx.lineTo(x1, 1400);
    ctx.stroke();
  }
  ctx.fillStyle = t.deep;
  ctx.font = `italic 500 46px ${SERIF}`;
  ctx.fillText(date, 560, 1378);
  ctx.fillStyle = GOLD_DARK;
  ctx.font = `500 24px ${SERIF}`;
  tracked(ctx, 'DATE OF ISSUE', 560, 1444, 7);

  ctx.fillStyle = t.deep;
  ctx.font = `italic 600 50px ${SERIF}`;
  ctx.fillText('Yasas Sri Wickramasinghe', 1840, 1378);
  ctx.fillStyle = GOLD_DARK;
  ctx.font = `500 24px ${SERIF}`;
  tracked(ctx, 'SENIOR LECTURER', 1840, 1444, 7);

  // Verification: QR and ID
  const qx = 250;
  const qy = 1478;
  if (art.qr) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(qx - 8, qy - 8, 120, 120);
    ctx.drawImage(art.qr, qx, qy, 104, 104);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = GOLD_DARK;
  ctx.font = `500 22px ${SERIF}`;
  tracked(ctx, 'SCAN TO VERIFY', qx + 136, qy + 34, 6, 'left');
  ctx.fillStyle = t.deep;
  ctx.font = `500 30px ${SERIF}`;
  ctx.fillText(`Certificate ID  ${art.id}`, qx + 136, qy + 82);
  ctx.textAlign = 'center';
}
