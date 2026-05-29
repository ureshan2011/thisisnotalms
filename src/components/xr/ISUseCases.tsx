import { motion, type Variants } from 'framer-motion';

// ─── Latest AR / VR uses in Information Systems ─────────────────────────────
// Six discipline-specific use cases (2025–2026), each paired with a hand-built
// SVG illustration that explains the idea visually. Styled to match the
// Apple-inspired page: white background, soft tints, accent palette, motion.

const EASE = [0.16, 1, 0.3, 1] as const;

const C = {
  blue: '#0071e3',
  indigo: '#5e5ce6',
  green: '#30d158',
  purple: '#bf5af2',
  orange: '#ff9f0a',
  red: '#ff375f',
  ink: '#1d1d1f',
  grey: '#86868b',
};

const illoWrap =
  'relative w-full overflow-hidden rounded-[28px] ring-1 ring-black/[0.06]';
const illoBg = 'block h-auto w-full';

// ── 1. Immersive analytics — data as a 3D landscape ─────────────────────────
function ImmersiveAnalyticsIllo() {
  const bars = [
    { x: 150, h: 70, c: C.blue },
    { x: 195, h: 120, c: C.indigo },
    { x: 240, h: 55, c: C.blue },
    { x: 285, h: 150, c: C.indigo },
    { x: 330, h: 95, c: C.blue },
  ];
  return (
    <div className={illoWrap}>
      <svg viewBox="0 0 480 300" className={illoBg} style={{ background: 'linear-gradient(160deg,#eef2ff,#f8fafc)' }}>
        {/* perspective floor */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={60 + i * 20} y1={250} x2={120 + i * 75} y2={250 - i * 0} stroke="#c7c9ff" strokeWidth="1" opacity="0.5" />
        ))}
        {[230, 250, 270].map((y, i) => (
          <line key={y} x1={70 - i * 10} y1={y} x2={430 + i * 10} y2={y} stroke="#c7c9ff" strokeWidth="1" opacity={0.5 - i * 0.12} />
        ))}
        {/* animated bars */}
        {bars.map((b, i) => (
          <motion.rect
            key={i}
            x={b.x}
            width="30"
            rx="5"
            fill={b.c}
            initial={{ height: 20, y: 230 }}
            animate={{ height: [b.h * 0.5, b.h, b.h * 0.7, b.h], y: [230 - b.h * 0.5, 230 - b.h, 230 - b.h * 0.7, 230 - b.h] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          />
        ))}
        {/* floating scatter points */}
        {[[110, 90], [140, 60], [380, 70], [410, 110], [95, 140], [430, 150]].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="5"
            fill={i % 2 ? C.purple : C.green}
            animate={{ cy: [y, y - 8, y], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
        {/* headset glyph */}
        <g transform="translate(60,40)">
          <rect x="0" y="0" width="56" height="26" rx="13" fill={C.indigo} opacity="0.15" />
          <rect x="6" y="6" width="20" height="14" rx="7" fill={C.indigo} />
          <rect x="30" y="6" width="20" height="14" rx="7" fill={C.indigo} />
        </g>
      </svg>
    </div>
  );
}

// ── 2. Digital twin — real ↔ virtual sync ───────────────────────────────────
function DigitalTwinIllo() {
  return (
    <div className={illoWrap}>
      <svg viewBox="0 0 480 300" className={illoBg} style={{ background: 'linear-gradient(160deg,#ecfdf3,#f8fafc)' }}>
        {/* real factory (solid) */}
        <g transform="translate(40,110)">
          <rect x="0" y="40" width="150" height="100" rx="6" fill="#c8d0d8" />
          <polygon points="0,40 75,0 150,40" fill="#aeb8c2" />
          <rect x="20" y="70" width="28" height="28" rx="3" fill="#fff" />
          <rect x="62" y="70" width="28" height="28" rx="3" fill="#fff" />
          <rect x="104" y="70" width="28" height="28" rx="3" fill="#fff" />
          <rect x="60" y="108" width="30" height="32" fill="#8a96a3" />
        </g>
        {/* virtual twin (wireframe) */}
        <g transform="translate(290,110)" stroke={C.green} strokeWidth="2" fill="none">
          <rect x="0" y="40" width="150" height="100" rx="6" fill={C.green} fillOpacity="0.06" />
          <polygon points="0,40 75,0 150,40" />
          <rect x="20" y="70" width="28" height="28" rx="3" />
          <rect x="62" y="70" width="28" height="28" rx="3" />
          <rect x="104" y="70" width="28" height="28" rx="3" />
          <rect x="60" y="108" width="30" height="32" />
        </g>
        {/* data sync link */}
        <line x1="195" y1="180" x2="285" y2="180" stroke={C.green} strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cy="180"
            r="4"
            fill={C.green}
            animate={{ cx: [195, 285] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
          />
        ))}
        <text x="240" y="165" textAnchor="middle" fontSize="13" fontWeight="600" fill={C.green}>IoT · ERP</text>
        {/* labels */}
        <text x="115" y="275" textAnchor="middle" fontSize="13" fill={C.grey}>Physical asset</text>
        <text x="365" y="275" textAnchor="middle" fontSize="13" fill={C.grey}>Live digital twin</text>
      </svg>
    </div>
  );
}

// ── 3. AR vision picking — smart-glasses HUD ────────────────────────────────
function VisionPickingIllo() {
  return (
    <div className={illoWrap}>
      <svg viewBox="0 0 480 300" className={illoBg} style={{ background: 'linear-gradient(160deg,#eff6ff,#f8fafc)' }}>
        {/* shelf grid */}
        <g transform="translate(60,60)">
          {Array.from({ length: 9 }).map((_, i) => {
            const cx = (i % 3) * 120;
            const cy = Math.floor(i / 3) * 60;
            const target = i === 4;
            return (
              <g key={i} transform={`translate(${cx},${cy})`}>
                <rect width="110" height="50" rx="6" fill={target ? C.green : '#fff'} fillOpacity={target ? 0.18 : 1} stroke={target ? C.green : '#d2d7de'} strokeWidth={target ? 2.5 : 1.5} />
                {target && (
                  <>
                    <motion.rect
                      width="110" height="50" rx="6" fill="none" stroke={C.green} strokeWidth="2.5"
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <circle cx="55" cy="25" r="13" fill={C.green} />
                    <path d="M49 25 l4 4 l8 -9" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}
              </g>
            );
          })}
        </g>
        {/* pick arrow + qty */}
        <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <path d="M175 70 l0 -28 m0 28 l-7 -9 m7 9 l7 -9" stroke={C.blue} strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="150" y="14" width="52" height="24" rx="12" fill={C.blue} />
          <text x="176" y="31" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">PICK 3</text>
        </motion.g>
        {/* glasses HUD corner brackets */}
        {[['M30,30 v-14 h14', ''], ['M450,30 v-14 h-14', ''], ['M30,270 v14 h14', ''], ['M450,270 v14 h-14', '']].map(([d], i) => (
          <path key={i} d={d} stroke={C.blue} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
        ))}
        <text x="240" y="292" textAnchor="middle" fontSize="12" fill={C.grey}>Hands-free, synced to the WMS</text>
      </svg>
    </div>
  );
}

// ── 4. Collaborative virtual workspace ──────────────────────────────────────
function VirtualWorkspaceIllo() {
  const avatars = [
    { x: 90, y: 80, c: C.blue },
    { x: 390, y: 90, c: C.purple },
    { x: 110, y: 220, c: C.green },
    { x: 380, y: 220, c: C.orange },
  ];
  return (
    <div className={illoWrap}>
      <svg viewBox="0 0 480 300" className={illoBg} style={{ background: 'linear-gradient(160deg,#f5f0ff,#f8fafc)' }}>
        {/* connection lines */}
        {avatars.map((a, i) => (
          <line key={i} x1="240" y1="150" x2={a.x} y2={a.y} stroke="#cfc4f5" strokeWidth="1.5" strokeDasharray="4 4" />
        ))}
        {/* central holo model */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '240px 150px' }}>
          <polygon points="240,108 286,138 286,186 240,216 194,186 194,138" fill={C.indigo} fillOpacity="0.12" stroke={C.indigo} strokeWidth="2" />
          <line x1="240" y1="108" x2="240" y2="216" stroke={C.indigo} strokeWidth="1.5" opacity="0.5" />
          <line x1="194" y1="138" x2="286" y2="186" stroke={C.indigo} strokeWidth="1.5" opacity="0.5" />
          <line x1="286" y1="138" x2="194" y2="186" stroke={C.indigo} strokeWidth="1.5" opacity="0.5" />
        </motion.g>
        <text x="240" y="158" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.indigo}>Shared 3D model</text>
        {/* avatars with headset glyph + pulse */}
        {avatars.map((a, i) => (
          <g key={i}>
            <motion.circle cx={a.x} cy={a.y} r="20" fill={a.c} fillOpacity="0.18" animate={{ r: [20, 28, 20], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }} />
            <circle cx={a.x} cy={a.y} r="18" fill={a.c} />
            <rect x={a.x - 11} y={a.y - 4} width="22" height="9" rx="4.5" fill="#fff" />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── 5. AR-guided field service ──────────────────────────────────────────────
function FieldServiceIllo() {
  return (
    <div className={illoWrap}>
      <svg viewBox="0 0 480 300" className={illoBg} style={{ background: 'linear-gradient(160deg,#fff7ed,#f8fafc)' }}>
        {/* machine */}
        <g transform="translate(150,120)">
          <rect x="0" y="0" width="180" height="110" rx="10" fill="#cbd2da" />
          <circle cx="50" cy="55" r="34" fill="#9aa6b2" />
          <circle cx="50" cy="55" r="16" fill="#fff" />
          <rect x="110" y="20" width="55" height="30" rx="4" fill="#7e8a96" />
          <rect x="110" y="62" width="55" height="30" rx="4" fill="#7e8a96" />
        </g>
        {/* callout: temp OK */}
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
          <line x1="200" y1="175" x2="120" y2="90" stroke={C.green} strokeWidth="2" />
          <rect x="40" y="64" width="92" height="34" rx="8" fill="#fff" stroke={C.green} strokeWidth="2" />
          <circle cx="60" cy="81" r="7" fill={C.green} />
          <text x="76" y="86" fontSize="13" fontWeight="600" fill={C.ink}>72°C OK</text>
        </motion.g>
        {/* callout: warning */}
        <motion.g animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ transformOrigin: '380px 95px' }}>
          <line x1="300" y1="160" x2="380" y2="110" stroke={C.red} strokeWidth="2" />
          <rect x="330" y="70" width="118" height="40" rx="8" fill="#fff" stroke={C.red} strokeWidth="2" />
          <path d="M348 98 l10 -18 l10 18 z" fill={C.red} />
          <text x="343" y="80" fontSize="9" fontWeight="700" fill="#fff" transform="translate(15,16)">!</text>
          <text x="372" y="95" fontSize="12" fontWeight="600" fill={C.red}>Replace seal</text>
        </motion.g>
        <text x="240" y="285" textAnchor="middle" fontSize="12" fill={C.grey}>Overlays pulled live from asset-management systems</text>
      </svg>
    </div>
  );
}

// ── 6. Spatial computing dashboards ─────────────────────────────────────────
function SpatialDashboardIllo() {
  return (
    <div className={illoWrap}>
      <svg viewBox="0 0 480 300" className={illoBg} style={{ background: 'linear-gradient(160deg,#eef2ff,#f8fafc)' }}>
        {/* back panel - line chart */}
        <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <rect x="60" y="50" width="180" height="120" rx="14" fill="#fff" stroke="#dfe3ea" strokeWidth="1.5" opacity="0.95" />
          <polyline points="80,150 110,120 140,135 170,95 200,110 225,70" fill="none" stroke={C.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="80" y="75" fontSize="12" fontWeight="600" fill={C.grey}>Revenue</text>
        </motion.g>
        {/* front panel - KPI */}
        <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 4.2, repeat: Infinity, delay: 0.4 }}>
          <rect x="250" y="110" width="150" height="100" rx="14" fill="#fff" stroke="#dfe3ea" strokeWidth="1.5" />
          <text x="270" y="150" fontSize="34" fontWeight="700" fill={C.ink}>98%</text>
          <text x="270" y="175" fontSize="13" fill={C.grey}>SLA uptime</text>
          <rect x="270" y="185" width="110" height="8" rx="4" fill="#eef0f4" />
          <rect x="270" y="185" width="100" height="8" rx="4" fill={C.green} />
        </motion.g>
        {/* small panel - bars */}
        <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 4.8, repeat: Infinity, delay: 0.8 }}>
          <rect x="300" y="40" width="120" height="70" rx="12" fill="#fff" stroke="#dfe3ea" strokeWidth="1.5" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={314 + i * 26} y={95 - (i % 2 ? 30 : 20)} width="16" height={i % 2 ? 30 : 20} rx="3" fill={C.purple} />
          ))}
        </motion.g>
        <text x="240" y="280" textAnchor="middle" fontSize="12" fill={C.grey}>KPIs floating around the analyst as spatial panels</text>
      </svg>
    </div>
  );
}

interface ISCase {
  Illo: () => JSX.Element;
  tags: { label: string; color: string }[];
  title: string;
  body: string;
  stat: string;
}

const CASES: ISCase[] = [
  {
    Illo: ImmersiveAnalyticsIllo,
    tags: [{ label: 'VR', color: C.indigo }, { label: 'AR', color: C.blue }],
    title: 'Immersive analytics & VR business intelligence',
    body:
      'Analysts step inside their data, exploring multi-dimensional datasets as 3D landscapes instead of flat charts. AI surfaces patterns in real time, accelerating predictive analytics and big-data decisions.',
    stat: 'Immersive analytics market: $1.2B in 2025 → $6.2B by 2035 (18% CAGR)',
  },
  {
    Illo: DigitalTwinIllo,
    tags: [{ label: 'MR', color: C.green }, { label: 'VR', color: C.indigo }],
    title: 'Industrial digital twins',
    body:
      'A live virtual replica of a factory, product or supply chain, wired to ERP and IoT feeds. Teams simulate changes, run predictive maintenance and rehearse operations before touching the real system.',
    stat: 'In 2025 digital twins moved from pilots to core operational infrastructure',
  },
  {
    Illo: VisionPickingIllo,
    tags: [{ label: 'AR', color: C.blue }],
    title: 'AR vision picking in the warehouse',
    body:
      'Smart glasses overlay pick paths and quantities straight onto the shelf, hands-free and synced to the warehouse management system. On-device computer vision even flags damage and predicts the next item to grab.',
    stat: 'Amazon deployed Vuzix AR glasses (May 2025) · +15–25% picking productivity · −40% errors',
  },
  {
    Illo: VirtualWorkspaceIllo,
    tags: [{ label: 'VR', color: C.indigo }, { label: 'MR', color: C.green }],
    title: 'Collaborative virtual workspaces',
    body:
      'Distributed teams meet inside a shared 3D model to co-design products and review changes together — data-infused workflows connected back to asset-management systems and knowledge bases.',
    stat: 'The “industrial metaverse” enabling real-time remote engineering collaboration',
  },
  {
    Illo: FieldServiceIllo,
    tags: [{ label: 'AR', color: C.blue }, { label: 'MR', color: C.green }],
    title: 'AR-guided field service & maintenance',
    body:
      'Technicians see equipment condition, fault diagnostics and step-by-step repair instructions overlaid directly on the machine, pulled live from asset-management systems and knowledge bases.',
    stat: 'Boeing’s Virtual Airplane lets engineers explore internal aircraft systems in 3D',
  },
  {
    Illo: SpatialDashboardIllo,
    tags: [{ label: 'MR', color: C.green }, { label: 'AR', color: C.blue }],
    title: 'Spatial computing dashboards',
    body:
      'With headsets like Apple Vision Pro, KPIs and BI dashboards float around the analyst as spatial panels. 5G and AI-enhanced XR keep them streaming and personalised in real time.',
    stat: 'Global AR revenue projected to surpass $100B by 2026',
  },
];

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function ISUseCases() {
  return (
    <section className="px-6 py-24 sm:py-28">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">In Information Systems · 2025–2026</p>
        <h2 className="text-[32px] font-semibold leading-[1.08] tracking-tight text-[#1d1d1f] sm:text-[44px]">
          The newest ways AR &amp; VR power IS
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73]">
          Beyond games and gadgets, Extended Reality is reshaping how organisations capture, analyse and act on
          information. Here are the most current applications across the Information Systems discipline.
        </p>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-20">
        {CASES.map((c, i) => {
          const { Illo } = c;
          const flip = i % 2 === 1;
          return (
            <motion.div
              key={c.title}
              variants={rowVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={flip ? 'md:order-2' : ''}>
                <Illo />
              </div>
              <div className={flip ? 'md:order-1' : ''}>
                <div className="mb-3 flex gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t.label}
                      className="rounded-full px-2.5 py-1 text-[12px] font-semibold"
                      style={{ background: t.color + '14', color: t.color }}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                <h3 className="text-[26px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[30px]">
                  {c.title}
                </h3>
                <p className="mt-3 text-[17px] leading-relaxed text-[#6e6e73]">{c.body}</p>
                <p className="mt-5 border-l-2 border-[#0071e3] pl-4 text-[15px] font-medium text-[#1d1d1f]">{c.stat}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
