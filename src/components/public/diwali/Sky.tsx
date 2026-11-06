import { useEffect, useRef } from 'react';
import { audio } from './audio';

// ─── The night sky: stars, fireworks, and a sparkler that follows you ─────
// One fixed canvas behind the whole page. Anything on the page can call
// sky.firework(x, y) or sky.show(seconds) without holding a ref; the
// component registers itself with the `sky` object on mount.
//
// It pauses when the tab is hidden, caps the pixel ratio at 2, and with
// prefers-reduced-motion it keeps the stars still, drops the sparkler trail
// and fires far fewer rockets.

const PALETTES = [
  ['#ffd36b', '#ffb02e', '#fff3c4'], // gold
  ['#ff4fa3', '#ff8fd0', '#ffe0f2'], // rani pink
  ['#2ee6d6', '#9bfff5', '#e6fffd'], // peacock teal
  ['#ff7a1a', '#ffb067', '#fff0dd'], // marigold
  ['#b67cff', '#dcc0ff', '#f6edff'], // violet
  ['#ff3b3b', '#ff9b6b', '#ffe3d6'], // red
  ['#e9f2ff', '#ffffff', '#cfe3ff'], // silver
];

type Kind = 'peony' | 'ring' | 'willow' | 'double' | 'palm';

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
  drag: number;
  flicker: boolean;
}

interface Rocket {
  x: number;
  y: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  t: number;
  dur: number;
  kind: Kind;
  palette: string[];
  size: number;
}

interface Flash {
  x: number;
  y: number;
  r: number;
  life: number;
  color: string;
}

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

interface SkyImpl {
  firework: (x: number, y: number, opts?: { kind?: Kind; size?: number; quiet?: boolean }) => void;
  burst: (x: number, y: number, opts?: { kind?: Kind; size?: number; palette?: number }) => void;
  show: (seconds: number) => void;
}

let impl: SkyImpl | null = null;

/** Talk to the sky from anywhere. Calls before it mounts are dropped. */
export const sky = {
  /** Launch a rocket from the bottom of the screen to (x, y), in viewport px. */
  firework(x: number, y: number, opts?: { kind?: Kind; size?: number; quiet?: boolean }) {
    impl?.firework(x, y, opts);
  },
  /** A burst right where you say, with no rocket. */
  burst(x: number, y: number, opts?: { kind?: Kind; size?: number; palette?: number }) {
    impl?.burst(x, y, opts);
  },
  /** A finale: many rockets for a few seconds. */
  show(seconds: number) {
    impl?.show(seconds);
  },
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

export default function Sky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const particles: Particle[] = [];
    const rockets: Rocket[] = [];
    const flashes: Flash[] = [];
    let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShooting = performance.now() + rand(5000, 9000);

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(160, (W * H) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() < 0.12 ? rand(1.1, 1.7) : rand(0.4, 1),
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.6, 2),
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const explode = (x: number, y: number, kind: Kind, palette: string[], size: number) => {
      const scale = Math.min(1.25, Math.max(0.55, Math.min(W, 900) / 700)) * size;
      flashes.push({ x, y, r: 90 * scale, life: 1, color: palette[0] });
      const add = (p: Partial<Particle> & { vx: number; vy: number }) => {
        particles.push({
          x,
          y,
          px: x,
          py: y,
          life: 1,
          decay: rand(0.011, 0.018),
          color: pick(palette),
          size: rand(1.2, 2.2),
          gravity: 0.035,
          drag: 0.982,
          flicker: Math.random() < 0.3,
          ...p,
        });
      };
      const n = Math.round((reduced ? 40 : 90) * size);
      if (kind === 'ring' || kind === 'double') {
        const rings = kind === 'double' ? [1, 0.55] : [1];
        rings.forEach((k, ri) => {
          const m = Math.round(n * 0.6 * k);
          const tilt = rand(0.45, 1);
          const pal = ri === 1 ? PALETTES[Math.floor(Math.random() * PALETTES.length)] : palette;
          for (let i = 0; i < m; i++) {
            const a = (i / m) * Math.PI * 2;
            const sp = 3.6 * scale * k;
            add({ vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * tilt, color: pick(pal), decay: rand(0.012, 0.016) });
          }
        });
      } else if (kind === 'willow') {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = rand(0.6, 3.2) * scale;
          add({
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            color: pick(['#ffd36b', '#ffc44a', '#fff1b8']),
            decay: rand(0.006, 0.009),
            gravity: 0.045,
            drag: 0.975,
            size: rand(1, 1.8),
            flicker: true,
          });
        }
      } else if (kind === 'palm') {
        const arms = 8;
        for (let a = 0; a < arms; a++) {
          const ang = (a / arms) * Math.PI * 2 + rand(-0.1, 0.1);
          for (let j = 0; j < 9; j++) {
            const sp = (1.2 + j * 0.42) * scale;
            add({ vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.6, decay: rand(0.01, 0.014), size: 2 });
          }
        }
      } else {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = Math.sqrt(Math.random()) * 4.2 * scale;
          add({ vx: Math.cos(a) * sp, vy: Math.sin(a) * sp });
        }
      }
    };

    const local: SkyImpl = {
      firework(tx, ty, opts) {
        const dur = rand(0.85, 1.15);
        const kind = opts?.kind ?? pick<Kind>(['peony', 'peony', 'ring', 'willow', 'double', 'palm']);
        rockets.push({
          x: tx + rand(-40, 40),
          y: H + 10,
          sx: tx + rand(-40, 40),
          sy: H + 10,
          tx,
          ty,
          t: 0,
          dur,
          kind,
          palette: pick(PALETTES),
          size: opts?.size ?? 1,
        });
        if (!opts?.quiet) audio.launch(dur);
      },
      burst(x, y, opts) {
        const palette = opts?.palette !== undefined ? PALETTES[opts.palette] : pick(PALETTES);
        explode(x, y, opts?.kind ?? 'peony', palette, opts?.size ?? 0.6);
      },
      show(seconds) {
        const count = reduced ? Math.round(seconds) : Math.round(seconds * 3.2);
        for (let i = 0; i < count; i++) {
          window.setTimeout(() => {
            local.firework(rand(W * 0.1, W * 0.9), rand(H * 0.12, H * 0.5), { quiet: i % 3 !== 0 });
          }, (i / count) * seconds * 1000 + rand(0, 200));
        }
      },
    };
    impl = local;

    // The sparkler: a few sparks wherever the pointer moves.
    let lastSpark = 0;
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const now = performance.now();
      if (now - lastSpark < 16) return;
      lastSpark = now;
      const n = e.pointerType === 'mouse' ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rand(0.4, 2.2);
        particles.push({
          x: e.clientX,
          y: e.clientY,
          px: e.clientX,
          py: e.clientY,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.4,
          life: 1,
          decay: rand(0.04, 0.07),
          color: pick(['#fff3c4', '#ffd36b', '#ffffff', '#ffb02e']),
          size: rand(0.8, 1.5),
          gravity: 0.06,
          drag: 0.95,
          flicker: true,
        });
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      ctx.clearRect(0, 0, W, H);

      // Stars
      const time = now / 1000;
      for (const s of stars) {
        const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(time * s.speed + s.phase);
        ctx.globalAlpha = tw;
        ctx.fillStyle = '#fff6df';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // A shooting star now and then
      if (!reduced) {
        if (!shooting && now > nextShooting) {
          shooting = { x: rand(W * 0.1, W * 0.7), y: rand(0, H * 0.3), vx: rand(7, 10), vy: rand(2.5, 4), life: 1 };
          nextShooting = now + rand(9000, 16000);
        }
        if (shooting) {
          const s = shooting;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.life -= 0.02 * dt;
          const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
          g.addColorStop(0, `rgba(255,246,223,${Math.max(0, s.life)})`);
          g.addColorStop(1, 'rgba(255,246,223,0)');
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12);
          ctx.stroke();
          if (s.life <= 0) shooting = null;
        }
      }

      ctx.globalCompositeOperation = 'lighter';

      // Flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, `${f.color}${Math.round(f.life * 90).toString(16).padStart(2, '0')}`);
        g.addColorStop(1, `${f.color}00`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        f.life -= 0.06 * dt;
        if (f.life <= 0) flashes.splice(i, 1);
      }

      // Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.t += (dt * 16.67) / 1000;
        const k = Math.min(1, r.t / r.dur);
        const e = 1 - (1 - k) ** 2;
        const nx = r.sx + (r.tx - r.sx) * e + Math.sin(k * 12) * 1.5;
        const ny = r.sy + (r.ty - r.sy) * e;
        ctx.strokeStyle = 'rgba(255,220,150,0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        if (Math.random() < 0.7) {
          particles.push({
            x: nx,
            y: ny,
            px: nx,
            py: ny,
            vx: rand(-0.4, 0.4),
            vy: rand(0.5, 1.4),
            life: 0.8,
            decay: 0.05,
            color: '#ffcf7a',
            size: 1,
            gravity: 0.02,
            drag: 0.96,
            flicker: true,
          });
        }
        r.x = nx;
        r.y = ny;
        if (k >= 1) {
          explode(r.x, r.y, r.kind, r.palette, r.size);
          audio.boom(Math.min(1, r.size));
          rockets.splice(i, 1);
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.px = p.x;
        p.py = p.y;
        p.vx *= p.drag ** dt;
        p.vy = p.vy * p.drag ** dt + p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const a = p.flicker && Math.random() < 0.3 ? p.life * 0.3 : p.life;
        ctx.globalAlpha = Math.max(0, a);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.px - p.vx * 1.5, p.py - p.vy * 1.5);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      if (impl === local) impl = null;
    };
  }, []);

  return <canvas ref={ref} className="dw-sky" aria-hidden="true" />;
}
