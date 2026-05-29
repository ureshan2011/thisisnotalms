import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';

// ─── Devices + development tools showcase ───────────────────────────────────
// Visual-first: device illustrations, real brand logos (Simple Icons CDN with a
// monogram fallback so nothing ever shows broken), and minimal text.

const EASE = [0.16, 1, 0.3, 1] as const;

const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// ── Brand logo with graceful fallback ───────────────────────────────────────
function Logo({ slug, name, color }: { slug?: string; name: string; color: string }) {
  const [failed, setFailed] = useState(!slug);
  if (failed || !slug) {
    const initials = name.replace(/[^A-Za-z0-9 ]/g, '').split(' ').slice(0, 2).map((w) => w[0]).join('');
    return (
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl text-[13px] font-bold text-white"
        style={{ background: color }}
      >
        {initials.toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={name}
      loading="lazy"
      className="h-9 w-9 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

// ── Device illustrations (3 silhouettes, recoloured per device) ─────────────
function Visor({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 240 140" className="h-auto w-full">
      <path d="M30 70 C30 40 50 34 120 34 C190 34 210 40 210 70 C210 104 188 110 120 110 C52 110 30 104 30 70 Z" fill={color} />
      <path d="M52 70 C52 52 66 48 120 48 C174 48 188 52 188 70 C188 90 172 96 120 96 C68 96 52 90 52 70 Z" fill="#0b0b0f" opacity="0.85" />
      <ellipse cx="95" cy="68" rx="14" ry="10" fill={color} opacity="0.55" />
      <ellipse cx="145" cy="68" rx="14" ry="10" fill={color} opacity="0.55" />
      <path d="M30 66 C18 64 12 70 14 80" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M210 66 C222 64 228 70 226 80" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function Glasses({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 240 140" className="h-auto w-full">
      <rect x="40" y="52" width="68" height="44" rx="14" fill="none" stroke={color} strokeWidth="9" />
      <rect x="132" y="52" width="68" height="44" rx="14" fill="none" stroke={color} strokeWidth="9" />
      <path d="M108 70 q12 -8 24 0" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M40 62 q-18 -6 -26 6" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M200 62 q18 -6 26 6" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
      <rect x="52" y="62" width="44" height="24" rx="8" fill={color} opacity="0.18" />
      <rect x="144" y="62" width="44" height="24" rx="8" fill={color} opacity="0.18" />
    </svg>
  );
}
function Cardboard({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 240 140" className="h-auto w-full">
      <rect x="56" y="38" width="128" height="74" rx="8" fill={color} />
      <rect x="56" y="38" width="128" height="74" rx="8" fill="#000" opacity="0.08" />
      <circle cx="96" cy="75" r="17" fill="#0b0b0f" opacity="0.8" />
      <circle cx="144" cy="75" r="17" fill="#0b0b0f" opacity="0.8" />
      <rect x="112" y="58" width="16" height="34" rx="3" fill="#000" opacity="0.15" />
      <path d="M56 60 l-16 -8 M184 60 l16 -8" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

type Shape = 'visor' | 'glasses' | 'cardboard';

interface Device {
  name: string;
  brand: string;
  slug?: string;
  type: string;
  typeColor: string;
  shape: Shape;
  shapeColor: string;
  tint: string;
}

const DEVICES: Device[] = [
  { name: 'Apple Vision Pro', brand: 'Apple', slug: 'apple', type: 'Spatial · MR', typeColor: '#5e5ce6', shape: 'visor', shapeColor: '#3a3a3c', tint: '#eef0ff' },
  { name: 'Meta Quest 3', brand: 'Meta', slug: 'meta', type: 'VR · MR', typeColor: '#0071e3', shape: 'visor', shapeColor: '#1d1d1f', tint: '#eaf2ff' },
  { name: 'Microsoft HoloLens 2', brand: 'Microsoft', type: 'Mixed Reality', typeColor: '#30d158', shape: 'glasses', shapeColor: '#2a2a2e', tint: '#eafaf0' },
  { name: 'PlayStation VR2', brand: 'Sony', slug: 'playstation', type: 'Console VR', typeColor: '#0071e3', shape: 'visor', shapeColor: '#1d1d1f', tint: '#eef2f8' },
  { name: 'Vuzix Smart Glasses', brand: 'Vuzix', type: 'AR · Enterprise', typeColor: '#ff9f0a', shape: 'glasses', shapeColor: '#3a3a3c', tint: '#fff6e8' },
  { name: 'Google Cardboard', brand: 'Google', slug: 'google', type: 'VR · Entry', typeColor: '#bf5af2', shape: 'cardboard', shapeColor: '#c9a27e', tint: '#faf5ff' },
];

function DeviceArt({ d }: { d: Device }) {
  if (d.shape === 'glasses') return <Glasses color={d.shapeColor} />;
  if (d.shape === 'cardboard') return <Cardboard color={d.shapeColor} />;
  return <Visor color={d.shapeColor} />;
}

// ── Dev tools ────────────────────────────────────────────────────────────────
interface Tool {
  name: string;
  slug?: string;
  color: string;
  group: string;
}
const TOOLS: Tool[] = [
  { name: 'Unity', slug: 'unity', color: '#1d1d1f', group: 'Engine' },
  { name: 'Unreal Engine', slug: 'unrealengine', color: '#1d1d1f', group: 'Engine' },
  { name: 'Godot', slug: 'godotengine', color: '#478cbf', group: 'Engine' },
  { name: 'three.js', slug: 'threedotjs', color: '#1d1d1f', group: 'Web 3D' },
  { name: 'A-Frame', slug: 'aframe', color: '#ef2d5e', group: 'Web 3D' },
  { name: 'WebGL', slug: 'webgl', color: '#990000', group: 'Web 3D' },
  { name: 'WebXR', color: '#0071e3', group: 'Web 3D' },
  { name: 'ARKit', slug: 'apple', color: '#1d1d1f', group: 'SDK' },
  { name: 'ARCore', slug: 'android', color: '#3ddc84', group: 'SDK' },
  { name: 'OpenXR', color: '#5e5ce6', group: 'SDK' },
  { name: 'Blender', slug: 'blender', color: '#e87d0d', group: '3D assets' },
];

const STEPS = [
  { n: '1', t: 'Pick an engine', s: 'Unity · Unreal · WebXR', c: '#0071e3', icon: '🛠️' },
  { n: '2', t: 'Add an XR SDK', s: 'OpenXR · ARKit · ARCore', c: '#5e5ce6', icon: '🧩' },
  { n: '3', t: 'Build & deploy', s: 'Headset or browser', c: '#30d158', icon: '🚀' },
];

export default function DevicesAndTools() {
  return (
    <>
      {/* ── DEVICES ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">The gear</p>
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-tight text-[#1d1d1f] sm:text-[44px]">
            Headsets and glasses you’ll hear about
          </h2>
        </div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DEVICES.map((d) => (
            <motion.div
              key={d.name}
              variants={cell}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.2)]"
            >
              <div className="flex h-44 items-center justify-center px-10" style={{ background: d.tint }}>
                <DeviceArt d={d} />
              </div>
              <div className="flex items-center gap-3 p-5">
                <Logo slug={d.slug} name={d.brand} color={d.typeColor} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-semibold tracking-tight text-[#1d1d1f]">{d.name}</p>
                  <span
                    className="text-[12px] font-semibold"
                    style={{ color: d.typeColor }}
                  >
                    {d.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── DEV TOOLS + SETUP ───────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">Want to build your own?</p>
          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-tight text-[#1d1d1f] sm:text-[44px]">
            The tools developers use
          </h2>
        </div>

        {/* Logo grid */}
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {TOOLS.map((t) => (
            <motion.div
              key={t.name}
              variants={cell}
              whileHover={{ y: -4 }}
              className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
            >
              <Logo slug={t.slug} name={t.name} color={t.color} />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-[#1d1d1f]">{t.name}</p>
                <p className="text-[12px] text-[#86868b]">{t.group}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Setup flow */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
                  className="flex flex-1 items-center gap-4 rounded-[24px] border border-black/[0.06] bg-white p-5"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                    style={{ background: s.c + '14' }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: s.c }}>STEP {s.n}</p>
                    <p className="text-[16px] font-semibold tracking-tight text-[#1d1d1f]">{s.t}</p>
                    <p className="text-[13px] text-[#86868b]">{s.s}</p>
                  </div>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <span className="hidden text-2xl text-[#c7c7cc] sm:block">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
