import { DIYA, DIYA_PAINT, PAINTS, RANGOLI, type DiyaPaint } from './geometry';

// ─── The student's own Diwali card, drawn on a canvas ─────────────────────
// 1080 × 1350 (a 4:5 portrait, the shape phones and chat apps show best).
// Drawn directly with the 2D API rather than by rasterising the page's SVG,
// so the web fonts are used and nothing taints the canvas: it can always be
// saved or shared.

export const CARD_W = 1080;
export const CARD_H = 1350;

function drawDiya(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, paint: DiyaPaint) {
  const [light, dark, trim] = DIYA_PAINT[paint];
  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  ctx.scale(size / 120, size / 120);

  const glow = ctx.createRadialGradient(60, 42, 0, 60, 42, 52);
  glow.addColorStop(0, 'rgba(255,210,122,0.8)');
  glow.addColorStop(0.45, 'rgba(255,154,46,0.25)');
  glow.addColorStop(1, 'rgba(255,122,26,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(60, 42, 52, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = dark;
  ctx.fill(new Path2D(DIYA.foot));
  const body = ctx.createLinearGradient(0, 62, 0, 100);
  body.addColorStop(0, light);
  body.addColorStop(1, dark);
  ctx.fillStyle = body;
  ctx.fill(new Path2D(DIYA.body));
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.ellipse(60, 62, 46, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5a2208';
  ctx.beginPath();
  ctx.ellipse(60, 62.5, 39, 5.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = trim;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.stroke(new Path2D(DIYA.band));
  ctx.fillStyle = trim;
  for (const [dx, dy] of DIYA.dots) {
    ctx.beginPath();
    ctx.arc(dx, dy, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  const flame = ctx.createLinearGradient(0, 60, 0, 14);
  flame.addColorStop(0, '#ff5a1a');
  flame.addColorStop(0.45, '#ffb52e');
  flame.addColorStop(1, '#fff2b0');
  ctx.fillStyle = flame;
  ctx.fill(new Path2D(DIYA.flame));
  ctx.fillStyle = '#fffbe6';
  ctx.fill(new Path2D(DIYA.core));
  ctx.restore();
}

function drawRangoli(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  for (const layer of RANGOLI) {
    const p = new Path2D(layer.d);
    ctx.fillStyle = layer.fill;
    if (layer.stroke) {
      ctx.strokeStyle = layer.stroke;
      ctx.lineWidth = 1.2;
    }
    for (let k = 0; k < layer.count; k++) {
      ctx.save();
      ctx.rotate((((360 / layer.count) * k + (layer.offset ?? 0)) * Math.PI) / 180);
      ctx.translate(0, -layer.radius);
      ctx.fill(p);
      if (layer.stroke) ctx.stroke(p);
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawToran(ctx: CanvasRenderingContext2D, W: number) {
  const swags = 6;
  const sw = W / swags;
  const colors = ['#ff8c1a', '#ffc61a', '#ff6a00', '#ffc61a'];
  const ball = (x: number, y: number, r: number, i: number) => {
    ctx.fillStyle = colors[i % 4];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,241,184,0.5)';
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  };
  ctx.fillStyle = '#7a3b00';
  ctx.fillRect(0, 14, W, 5);
  for (let s = 0; s < swags; s++) {
    const x0 = s * sw;
    // mango leaves
    for (const lx of [x0 + sw * 0.25, x0 + sw * 0.75]) {
      ctx.save();
      ctx.translate(lx, 16);
      ctx.fillStyle = '#2f8f3a';
      ctx.fill(new Path2D('M0 0 Q 12 24 0 50 Q -12 24 0 0 Z'));
      ctx.restore();
    }
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const x = x0 + 2 * (1 - t) * t * (sw / 2) + t * t * sw;
      const y = (1 - t) ** 2 * 20 + 2 * (1 - t) * t * 120 + t * t * 20;
      ball(x, y, 11, i);
    }
  }
  for (let s = 0; s <= swags; s++) {
    const x = s * sw;
    for (let j = 0; j < 4; j++) ball(x, 36 + j * 20, 9.5, j + 1);
    ctx.fillStyle = '#ffcf5a';
    ctx.beginPath();
    ctx.arc(x, 124, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Fit a line of text into `max` px by shrinking the font. */
function fitText(ctx: CanvasRenderingContext2D, text: string, family: string, size: number, max: number) {
  let s = size;
  ctx.font = `${s}px ${family}`;
  while (ctx.measureText(text).width > max && s > 20) {
    s -= 2;
    ctx.font = `${s}px ${family}`;
  }
}

export async function drawCard(canvas: HTMLCanvasElement, rawName: string) {
  const name = rawName.trim().slice(0, 28);
  const W = CARD_W;
  const H = CARD_H;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  try {
    await Promise.all([
      document.fonts.load('120px "Yatra One"', 'शुभ दीपावली'),
      document.fonts.load('80px "Rozha One"', 'Happy Diwali'),
      document.fonts.load('52px "Kalam"', `Dear ${name || 'friend'}`),
    ]);
  } catch {
    /* fall back to whatever the system has */
  }

  const bg = ctx.createRadialGradient(W / 2, H * 0.45, 40, W / 2, H * 0.45, H * 0.85);
  bg.addColorStop(0, '#4a1670');
  bg.addColorStop(0.5, '#24093e');
  bg.addColorStop(1, '#0c041e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  ctx.fillStyle = '#fff6df';
  for (let i = 0; i < 150; i++) {
    ctx.globalAlpha = 0.25 + rnd() * 0.7;
    ctx.beginPath();
    ctx.arc(rnd() * W, rnd() * H, rnd() < 0.1 ? 2.4 : 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Frame
  ctx.strokeStyle = 'rgba(255,211,107,0.85)';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, W - 60, H - 60);
  ctx.strokeStyle = 'rgba(255,211,107,0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(44, 44, W - 88, H - 88);

  drawToran(ctx, W);

  // Rangoli, with a soft glow behind it
  const halo = ctx.createRadialGradient(W / 2, 610, 0, W / 2, 610, 300);
  halo.addColorStop(0, 'rgba(255,170,60,0.35)');
  halo.addColorStop(1, 'rgba(255,170,60,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(W / 2 - 300, 310, 600, 600);
  drawRangoli(ctx, W / 2, 612, 0.92);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Headline
  const gold = ctx.createLinearGradient(0, 160, 0, 250);
  gold.addColorStop(0, '#fff3c4');
  gold.addColorStop(0.5, '#ffd36b');
  gold.addColorStop(1, '#ff9f1a');
  ctx.shadowColor = 'rgba(255,170,60,0.8)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = gold;
  ctx.font = '118px "Yatra One", "Noto Serif Devanagari", serif';
  ctx.fillText('शुभ दीपावली', W / 2, 248);
  ctx.shadowBlur = 16;
  ctx.fillStyle = '#fff4dc';
  ctx.font = '70px "Rozha One", Georgia, serif';
  ctx.fillText('Happy Diwali', W / 2, 332);
  ctx.shadowBlur = 0;

  // Message
  ctx.fillStyle = '#ffd36b';
  fitText(ctx, `Dear ${name || 'friend'},`, '"Kalam", cursive', 58, W - 200);
  ctx.fillText(`Dear ${name || 'friend'},`, W / 2, 910);
  ctx.fillStyle = '#fff4dc';
  ctx.font = '40px "Kalam", cursive';
  ctx.fillText('Wishing you a Diwali full of light,', W / 2, 970);
  ctx.fillText('sweets, laughter and good news.', W / 2, 1020);
  ctx.fillStyle = '#ffd36b';
  ctx.font = '36px "Kalam", cursive';
  ctx.fillText('— Yasas, your MBI802 lecturer', W / 2, 1072);

  // Diyas
  const n = 7;
  for (let i = 0; i < n; i++) {
    const x = W / 2 + (i - (n - 1) / 2) * 120;
    const lift = Math.abs(i - (n - 1) / 2) * 6;
    drawDiya(ctx, x, 1160 + lift, 104, PAINTS[i % PAINTS.length]);
  }

  ctx.fillStyle = 'rgba(255,244,220,0.75)';
  ctx.font = '26px "DM Sans", system-ui, sans-serif';
  ctx.fillText('All three diyas lit  ·  1NF  ·  2NF  ·  3NF  ·  Diwali 2026', W / 2, 1268);
}

export function cardFileName(name: string) {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `diwali-card${slug ? `-${slug}` : ''}.png`;
}

export function cardBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}
