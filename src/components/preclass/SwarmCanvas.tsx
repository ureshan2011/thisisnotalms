import { useEffect, useRef } from 'react';

// ─── Phases ───────────────────────────────────────────────────────
// drift  → words float in a gentle galaxy
// gather → particles ease toward positions that spell the course code
// burst  → flash + outward impulse at countdown zero
// hold   → code held assembled and glowing ("Class is starting")
// restart→ re-scatter, then back to drift
export type SwarmPhase = 'drift' | 'gather' | 'burst' | 'hold' | 'restart';

interface SwarmCanvasProps {
  words: string[];
  palette: string[];     // contrasting word colors, cycled across the words
  accent: string;        // used for the burst flash tint
  targetText: string;    // the course code to assemble, e.g. 'MBI802'
  phase: SwarmPhase;
  gatherProgress: number; // 0..1 within the final gather window
  reducedMotion: boolean;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;
  hasTarget: boolean;
  wordIndex: number;
  scale: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface Sprite {
  canvas: HTMLCanvasElement;
  w: number; // logical (CSS) px
  h: number;
}

const MAX_PARTICLES = 240;
const DRIFT_SPEED = 14; // px/s baseline drift
const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function easeInOutCubic(g: number): number {
  return g < 0.5 ? 4 * g * g * g : 1 - Math.pow(-2 * g + 2, 3) / 2;
}

export default function SwarmCanvas({
  words, palette, accent, targetText, phase, gatherProgress, reducedMotion,
}: SwarmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Live values the rAF loop reads without restarting.
  const phaseRef = useRef(phase);
  const gatherRef = useRef(gatherProgress);
  const reducedRef = useRef(reducedMotion);
  phaseRef.current = phase;
  gatherRef.current = gatherProgress;
  reducedRef.current = reducedMotion;

  // Refs that the loop closure depends on but that change on prop updates.
  const wordsRef = useRef(words);
  const paletteRef = useRef(palette);
  const accentRef = useRef(accent);
  const targetTextRef = useRef(targetText);
  wordsRef.current = words;
  paletteRef.current = palette;
  accentRef.current = accent;
  targetTextRef.current = targetText;

  // Mutable engine state.
  const particlesRef = useRef<Particle[]>([]);
  const spritesRef = useRef<Sprite[]>([]);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const prevPhaseRef = useRef<SwarmPhase>('drift');
  const burstStartRef = useRef(0);
  const rafRef = useRef(0);

  // Re-render sprites when the words or palette change.
  useEffect(() => {
    buildSprites();
    // keep particle wordIndex within bounds after a word-list swap
    const n = wordsRef.current.length;
    particlesRef.current.forEach((p, i) => { p.wordIndex = i % Math.max(1, n); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, palette]);

  function buildSprites() {
    const { dpr } = sizeRef.current;
    const ratio = dpr || 1;
    const fontPx = 23; // logical font size for drifting words
    const pal = paletteRef.current.length ? paletteRef.current : ['#ffffff'];
    const fontStack = `600 ${fontPx}px ${APPLE_FONT}`;
    const sprites: Sprite[] = wordsRef.current.map((word, i) => {
      const color = pal[i % pal.length];
      const measure = document.createElement('canvas').getContext('2d')!;
      measure.font = fontStack;
      const textW = measure.measureText(word).width;
      const padX = 22, padY = 16;
      const logicalW = Math.ceil(textW + padX * 2);
      const logicalH = Math.ceil(fontPx + padY * 2);

      const c = document.createElement('canvas');
      c.width = Math.ceil(logicalW * ratio);
      c.height = Math.ceil(logicalH * ratio);
      const ctx = c.getContext('2d')!;
      ctx.scale(ratio, ratio);
      ctx.font = fontStack;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cx = logicalW / 2, cy = logicalH / 2;
      // 1) soft colored glow so words read against video / gradient
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.fillStyle = color;
      ctx.fillText(word, cx, cy);
      // 2) dark outline keeps contrast over bright background frames
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 4;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0,0,0,0.40)';
      ctx.strokeText(word, cx, cy);
      // 3) crisp colored fill on top
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      ctx.fillText(word, cx, cy);

      return { canvas: c, w: logicalW, h: logicalH };
    });
    spritesRef.current = sprites;
  }

  function initParticles() {
    const { w, h } = sizeRef.current;
    const n = wordsRef.current.length || 1;
    const count = Math.min(MAX_PARTICLES, Math.max(n, Math.floor((w * h) / 14000)));
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const seed = i * 2654435761;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * DRIFT_SPEED,
        vy: (Math.random() - 0.5) * DRIFT_SPEED,
        tx: 0, ty: 0,
        hasTarget: false,
        wordIndex: i % n,
        scale: 0.55 + ((seed >>> 8) % 100) / 100 * 0.7,
        baseAlpha: 0.45 + ((seed >>> 16) % 100) / 100 * 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.6 + Math.random() * 1.4,
      });
    }
    particlesRef.current = particles;
  }

  // Sample opaque pixels of the rendered course code → target coordinates (CSS px).
  function computeTargets(): { x: number; y: number }[] {
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return [];
    const off = document.createElement('canvas');
    off.width = w; off.height = h; // CSS-px space
    const ctx = off.getContext('2d')!;
    // Fit the code text to ~78% of width.
    let fontPx = Math.min(h * 0.42, w * 0.26);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fit = () => {
      ctx.font = `800 ${fontPx}px ${APPLE_FONT}`;
      return ctx.measureText(targetTextRef.current).width;
    };
    while (fit() > w * 0.82 && fontPx > 24) fontPx -= 4;
    ctx.fillStyle = '#fff';
    ctx.fillText(targetTextRef.current, w / 2, h / 2);

    const img = ctx.getImageData(0, 0, w, h).data;
    const step = 7;
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (img[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
      }
    }
    return pts;
  }

  function assignTargets() {
    const particles = particlesRef.current;
    let pts = computeTargets();
    if (!pts.length) return;
    shuffle(pts);
    // Balance target count with particle count.
    if (pts.length > particles.length) {
      const keep = Math.ceil(pts.length / particles.length);
      pts = pts.filter((_, i) => i % keep === 0);
    }
    particles.forEach((p, i) => {
      if (i < pts.length) {
        p.tx = pts[i].x; p.ty = pts[i].y; p.hasTarget = true;
      } else {
        p.hasTarget = false;
      }
    });
  }

  function scatter() {
    const particles = particlesRef.current;
    particles.forEach((p) => {
      p.hasTarget = false;
      const a = Math.random() * Math.PI * 2;
      const s = DRIFT_SPEED + Math.random() * DRIFT_SPEED * 2;
      p.vx = Math.cos(a) * s;
      p.vy = Math.sin(a) * s;
    });
  }

  // Main effect: size, particles, rAF loop, listeners.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const first = sizeRef.current.w === 0;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const prev = sizeRef.current;
      sizeRef.current = { w, h, dpr };
      buildSprites();
      if (first) {
        initParticles();
      } else if (prev.w > 0) {
        // keep particles proportionally placed
        const sx = w / prev.w, sy = h / prev.h;
        particlesRef.current.forEach((p) => { p.x *= sx; p.y *= sy; });
      }
      const ph = phaseRef.current;
      if (ph === 'gather' || ph === 'hold' || ph === 'burst') assignTargets();
    };

    resize();

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    });
    ro.observe(wrap);

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // seconds, clamped
      const tSec = now / 1000;
      last = now;
      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;
      const sprites = spritesRef.current;
      const ph = phaseRef.current;
      const reduced = reducedRef.current;

      // Phase transitions
      if (ph !== prevPhaseRef.current) {
        if (ph === 'gather' || ph === 'hold') assignTargets();
        if (ph === 'burst') { assignTargets(); burstStartRef.current = now; impulseOutward(); }
        if (ph === 'drift' || ph === 'restart') scatter();
        prevPhaseRef.current = ph;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2;
      for (const p of particles) {
        if (!reduced) {
          if ((ph === 'gather' || ph === 'hold' || ph === 'burst') && p.hasTarget) {
            if (ph === 'burst') {
              // fly out then get pulled back during the burst window
              p.x += p.vx * dt; p.y += p.vy * dt;
              p.vx *= 0.90; p.vy *= 0.90;
              p.x += (p.tx - p.x) * 0.06;
              p.y += (p.ty - p.y) * 0.06;
            } else {
              const prog = ph === 'hold' ? 1 : gatherRef.current;
              const ease = 0.04 + easeInOutCubic(Math.max(0, Math.min(1, prog))) * 0.20;
              const jitter = (1 - prog) * 6;
              p.x += (p.tx - p.x) * ease + (Math.random() - 0.5) * jitter * dt;
              p.y += (p.ty - p.y) * ease + (Math.random() - 0.5) * jitter * dt;
            }
          } else {
            // drift: cheap flow field + gentle pull to center, wrap at edges
            const ang = Math.sin(p.x * 0.003 + tSec * 0.4) + Math.cos(p.y * 0.003 - tSec * 0.3);
            p.vx += Math.cos(ang) * 6 * dt + (cx - p.x) * 0.0004;
            p.vy += Math.sin(ang) * 6 * dt + (cy - p.y) * 0.0004;
            const sp = Math.hypot(p.vx, p.vy);
            const maxSp = DRIFT_SPEED * 2.2;
            if (sp > maxSp) { p.vx = (p.vx / sp) * maxSp; p.vy = (p.vy / sp) * maxSp; }
            p.x += p.vx * dt; p.y += p.vy * dt;
            const m = 60;
            if (p.x < -m) p.x = w + m; else if (p.x > w + m) p.x = -m;
            if (p.y < -m) p.y = h + m; else if (p.y > h + m) p.y = -m;
          }
        } else if ((ph === 'gather' || ph === 'hold' || ph === 'burst') && p.hasTarget) {
          // reduced motion: snap to targets, no animation
          p.x = p.tx; p.y = p.ty;
        }

        const sprite = sprites[p.wordIndex];
        if (!sprite) continue;
        let alpha = p.baseAlpha;
        if (!reduced) {
          alpha *= 0.6 + 0.4 * Math.sin(p.twinklePhase + tSec * p.twinkleSpeed);
        }
        if ((ph === 'gather' || ph === 'hold' || ph === 'burst') && !p.hasTarget) {
          alpha *= 0.18; // surplus particles fade into background during assembly
        }
        ctx.globalAlpha = Math.max(0.05, Math.min(1, alpha));
        const dw = sprite.w * p.scale;
        const dh = sprite.h * p.scale;
        ctx.drawImage(sprite.canvas, p.x - dw / 2, p.y - dh / 2, dw, dh);
      }
      ctx.globalAlpha = 1;

      // burst flash overlay
      if (ph === 'burst' && !reduced) {
        const elapsed = (now - burstStartRef.current) / 1000;
        const flash = Math.max(0, 1 - elapsed / 0.5);
        if (flash > 0) {
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
          g.addColorStop(0, `rgba(255,255,255,${flash * 0.5})`);
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    function impulseOutward() {
      const { w, h } = sizeRef.current;
      const cx = w / 2, cy = h / 2;
      particlesRef.current.forEach((p) => {
        const dx = p.x - cx, dy = p.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const s = 180 + Math.random() * 220;
        p.vx = (dx / d) * s;
        p.vy = (dy / d) * s;
      });
    }

    const start = () => {
      last = performance.now();
      rafRef.current = requestAnimationFrame(draw);
    };
    const stop = () => cancelAnimationFrame(rafRef.current);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    start();

    return () => {
      stop();
      ro.disconnect();
      window.clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
