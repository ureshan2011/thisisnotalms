import { useState, useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';

const ARDemo = lazy(() => import('../components/xr/ARDemo'));
const GyroVRScene = lazy(() => import('../components/xr/GyroVRScene'));
const ISUseCases = lazy(() => import('../components/xr/ISUseCases'));
const DevicesAndTools = lazy(() => import('../components/xr/DevicesAndTools'));

// ─── Apple-inspired Extended Reality lesson ─────────────────────────────────
// White background, SF-style typography, generous spacing, pill buttons and
// scroll-triggered motion — built to feel like a page on apple.com. The AR and
// VR sections embed real, working demos (live camera AR and gyroscope VR).

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

// Generic scroll-reveal wrapper
function Reveal({
  children,
  delay = 0,
  y = 48,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ─── Section: eyebrow + title + subtitle ────────────────────────────────────
function SectionHead({
  eyebrow,
  title,
  sub,
  dark = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">{eyebrow}</p>
      )}
      <h2
        className={`text-[32px] font-semibold leading-[1.08] tracking-tight sm:text-[44px] ${
          dark ? 'text-white' : 'text-[#1d1d1f]'
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mx-auto mt-4 max-w-2xl text-[19px] leading-relaxed ${dark ? 'text-white/70' : 'text-[#6e6e73]'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Reality–Virtuality continuum (light, Apple-styled) ─────────────────────
function RealitySpectrum() {
  const [pos, setPos] = useState(35);
  const getInfo = () => {
    if (pos < 18) return { name: 'Physical Reality', color: '#86868b', desc: 'Entirely the real world — no digital content at all.' };
    if (pos < 40) return { name: 'Augmented Reality', color: '#0071e3', desc: 'Digital overlays sit on top of the real world. Your surroundings stay fully visible and interactive.' };
    if (pos < 60) return { name: 'Mixed Reality', color: '#30d158', desc: 'Digital objects are spatially anchored and react to real surfaces. Hard to tell the two apart.' };
    if (pos < 82) return { name: 'Augmented Virtuality', color: '#bf5af2', desc: 'Mostly virtual, but real-world elements are captured and blended in.' };
    return { name: 'Virtual Reality', color: '#5e5ce6', desc: 'A fully synthetic environment. The real world is completely replaced.' };
  };
  const info = getInfo();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex justify-between text-[13px] font-medium text-[#86868b]">
        <span>Real world</span>
        <span>Virtual world</span>
      </div>
      <div
        className="relative h-9 overflow-hidden rounded-full"
        style={{ background: 'linear-gradient(to right, #c7c7cc, #0071e3, #30d158, #bf5af2, #5e5ce6)' }}
      >
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(+e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Reality to virtuality slider"
        />
        <div
          className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-[left]"
          style={{ left: `calc(${pos}% - 14px)` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-[#aeaeb2]">
        <span>Physical</span>
        <span>AR</span>
        <span>MR</span>
        <span>AV</span>
        <span>VR</span>
      </div>
      <motion.div
        key={info.name}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mt-7 rounded-3xl border p-6 text-left"
        style={{ background: info.color + '0d', borderColor: info.color + '33' }}
      >
        <p className="text-[20px] font-semibold tracking-tight" style={{ color: info.color }}>
          {info.name}
        </p>
        <p className="mt-1 text-[16px] leading-relaxed text-[#424245]">{info.desc}</p>
      </motion.div>
    </div>
  );
}

// ─── Comparison table ───────────────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    { aspect: 'Real world visible?', ar: 'Yes', vr: 'Blocked', mr: 'Yes' },
    { aspect: 'Digital objects?', ar: 'Overlaid', vr: 'Everything', mr: 'Anchored' },
    { aspect: 'Interacts with real space?', ar: 'Limited', vr: 'None', mr: 'Fully' },
    { aspect: 'Typical device', ar: 'Phone / glasses', vr: 'Headset', mr: 'Smart glasses' },
    { aspect: 'Examples', ar: 'Pokémon GO, IKEA Place', vr: 'Meta Quest, PSVR', mr: 'HoloLens, Vision Pro' },
  ];
  const head = [
    { k: 'ar', label: 'AR', color: '#0071e3' },
    { k: 'vr', label: 'VR', color: '#5e5ce6' },
    { k: 'mr', label: 'MR', color: '#30d158' },
  ] as const;
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-black/[0.08] bg-white">
      <table className="w-full text-[15px]">
        <thead>
          <tr className="border-b border-black/[0.06]">
            <th className="w-44 px-5 py-4 text-left font-medium text-[#86868b]">Aspect</th>
            {head.map((h) => (
              <th key={h.k} className="px-5 py-4 text-center font-semibold" style={{ color: h.color }}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.aspect} className={i % 2 ? 'bg-[#fafafa]' : ''}>
              <td className="px-5 py-4 font-medium text-[#6e6e73]">{r.aspect}</td>
              <td className="px-5 py-4 text-center text-[#1d1d1f]">{r.ar}</td>
              <td className="px-5 py-4 text-center text-[#1d1d1f]">{r.vr}</td>
              <td className="px-5 py-4 text-center text-[#1d1d1f]">{r.mr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const USE_CASES = [
  { emoji: '🏥', title: 'Medicine', body: 'Surgeons overlay live scans during operations; VR trains clinicians in risk-free simulations.' },
  { emoji: '🏗️', title: 'Architecture', body: 'Clients walk through buildings before a single brick is laid, using VR and MR overlays on blueprints.' },
  { emoji: '🎓', title: 'Education', body: 'Students dissect virtual frogs, tour ancient Rome and explore the solar system from the classroom.' },
  { emoji: '🛒', title: 'Retail', body: 'AR lets shoppers try on clothes or place furniture in their room before they buy.' },
  { emoji: '🏭', title: 'Manufacturing', body: 'MR headsets guide technicians through assembly with holographic, step-by-step instructions.' },
  { emoji: '🎮', title: 'Entertainment', body: 'Immersive VR worlds and AR mobile hits like Pokémon GO redefined interactive play.' },
];

// ─── Quiz ───────────────────────────────────────────────────────────────────
const QUIZ = [
  { q: 'You can see the real world through a VR headset.', a: false, e: 'VR replaces your entire field of view with a synthetic environment.' },
  { q: 'AR stands for “Augmented Reality”.', a: true, e: 'AR overlays digital content onto the real world.' },
  { q: 'Mixed Reality is just a marketing name for VR.', a: false, e: 'MR is its own category — digital objects interact with real surfaces.' },
  { q: 'Pokémon GO is an example of an AR application.', a: true, e: 'It overlays virtual creatures onto your environment via the camera.' },
  { q: 'In MR, holograms can appear to rest on a real table.', a: true, e: 'MR anchors virtual objects to real-world geometry.' },
];

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (opt: boolean) => {
    if (answer !== null) return;
    setAnswer(opt);
    if (opt === QUIZ[idx].a) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 >= QUIZ.length) return setDone(true);
    setIdx((i) => i + 1);
    setAnswer(null);
  };
  const reset = () => {
    setIdx(0);
    setAnswer(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.08] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10">
      {!done ? (
        <>
          <div className="mb-2 flex justify-between text-[14px] font-medium text-[#86868b]">
            <span>
              Question {idx + 1} of {QUIZ.length}
            </span>
            <span>Score {score}</span>
          </div>
          <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[#0071e3]"
              animate={{ width: `${(idx / QUIZ.length) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
          <p className="mb-8 text-[24px] font-semibold leading-snug tracking-tight text-[#1d1d1f]">{QUIZ[idx].q}</p>
          <div className="flex gap-4">
            {[true, false].map((opt) => {
              const answered = answer !== null;
              const correct = opt === QUIZ[idx].a;
              const chosen = opt === answer;
              let cls = 'flex-1 rounded-2xl py-4 text-[17px] font-medium transition ';
              if (!answered) cls += 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececee]';
              else if (correct) cls += 'bg-[#30d158]/15 text-[#248a3d] ring-1 ring-[#30d158]/40';
              else if (chosen) cls += 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40';
              else cls += 'bg-[#f5f5f7] text-[#aeaeb2]';
              return (
                <button key={String(opt)} onClick={() => choose(opt)} className={cls}>
                  {opt ? 'True' : 'False'}
                </button>
              );
            })}
          </div>
          {answer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-[#f5f5f7] p-5"
            >
              <p className={`font-semibold ${answer === QUIZ[idx].a ? 'text-[#248a3d]' : 'text-[#d70015]'}`}>
                {answer === QUIZ[idx].a ? 'Correct' : 'Not quite'}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[#424245]">{QUIZ[idx].e}</p>
              <button
                onClick={next}
                className="mt-4 rounded-full bg-[#0071e3] px-5 py-2 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
              >
                {idx + 1 < QUIZ.length ? 'Next question' : 'See results'}
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <div className="py-6 text-center">
          <div className="text-6xl">{score >= 4 ? '🏆' : score >= 3 ? '🎯' : '📚'}</div>
          <p className="mt-4 text-[44px] font-semibold tracking-tight text-[#1d1d1f]">
            {score} / {QUIZ.length}
          </p>
          <p className="mx-auto mt-2 max-w-md text-[17px] text-[#6e6e73]">
            {score === 5
              ? 'Perfect score. You’ve mastered AR, VR and MR.'
              : score >= 3
              ? 'Nicely done. Revisit the demos above to close any gaps.'
              : 'Good start — try the live demos again and come back.'}
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// Smooth-scroll to a section by id WITHOUT touching the URL hash. The app runs
// under a HashRouter, so plain `href="#ar"` anchors would hijack the router and
// navigate to a non-existent route (showing the shutdown notice). This scrolls
// in place instead.
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const DemoFallback = ({ label }: { label: string }) => (
  <div className="mx-auto flex aspect-video w-full max-w-[820px] items-center justify-center rounded-[1.75rem] bg-[#f5f5f7] text-[15px] text-[#86868b]">
    Loading {label}…
  </div>
);

// ─── Page ───────────────────────────────────────────────────────────────────
export default function XRExplorerPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div className="bg-white text-[#1d1d1f]" style={{ fontFamily: APPLE_FONT }}>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        {/* soft ambient wash */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#0071e3]/[0.07] blur-3xl" />
          <div className="absolute bottom-[-10%] right-[12%] h-[420px] w-[420px] rounded-full bg-[#bf5af2]/[0.06] blur-3xl" />
        </div>

        <motion.div style={{ scale: heroScale, opacity: heroOpacity, y: heroY }} className="relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[17px] font-medium text-[#6e6e73]"
          >
            Interactive Learning · Dr. Yasas Sri Wickramasinghe
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="text-[44px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[72px] lg:text-[88px]"
          >
            Extended Reality.
            <br />
            <span className="bg-gradient-to-r from-[#0071e3] via-[#5e5ce6] to-[#bf5af2] bg-clip-text text-transparent">
              Experience it now.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73] sm:text-[22px]"
          >
            A hands-on lesson in AR, VR and Mixed Reality — with a real camera AR demo and a
            gyroscope-powered VR world that runs right in your browser. No headset required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          >
            <button
              onClick={() => scrollToSection('ar')}
              className="rounded-full bg-[#0071e3] px-7 py-3 text-[17px] font-medium text-white transition hover:bg-[#0077ed]"
            >
              Try the AR demo
            </button>
            <button
              onClick={() => scrollToSection('vr')}
              className="text-[17px] font-medium text-[#0071e3] hover:underline"
            >
              Enter the VR world ›
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 text-[13px] font-medium text-[#aeaeb2]"
        >
          Scroll to explore
        </motion.div>
      </section>

      {/* ── FOUNDATION / CONTINUUM ─────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="The foundation"
            title="One spectrum, from real to virtual"
            sub="Extended Reality (XR) is the umbrella term for every technology that blends the physical and the digital. Drag the slider to see where each one sits on Milgram’s reality–virtuality continuum."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <RealitySpectrum />
        </Reveal>

        {/* Three pillars */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
        >
          {[
            { e: '📱', t: 'Augmented Reality', c: '#0071e3', d: 'Digital overlays on your real-world view. Your surroundings stay visible while virtual content is layered on top.' },
            { e: '🥽', t: 'Virtual Reality', c: '#5e5ce6', d: 'Your whole field of view is replaced by a computer-generated world. Total immersion, disconnected from the room.' },
            { e: '🌐', t: 'Mixed Reality', c: '#30d158', d: 'Digital content is anchored to real surfaces and reacts to real geometry. The two worlds genuinely coexist.' },
          ].map((p) => (
            <motion.div
              key={p.t}
              variants={item}
              className="rounded-[28px] border border-black/[0.07] bg-[#fafafa] p-8 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.18)]"
            >
              <div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                style={{ background: p.c + '14' }}
              >
                {p.e}
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">{p.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#6e6e73]">{p.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── AR DEMO ─────────────────────────────────────────────────────────── */}
      <section id="ar" className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Augmented Reality · live demo"
            title="Drop 3D objects into your room"
            sub="This uses your phone’s real rear camera. Place objects with a tap, then move your phone — the gyroscope keeps them anchored in the world, just like real AR."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Suspense fallback={<DemoFallback label="AR demo" />}>
            <ARDemo />
          </Suspense>
        </Reveal>
        <p className="mx-auto mt-10 max-w-xl text-center text-[14px] leading-relaxed text-[#86868b]">
          Best on a phone. Camera and motion access stay on your device — nothing is uploaded or stored.
        </p>
      </section>

      {/* ── VR DEMO ─────────────────────────────────────────────────────────── */}
      <section id="vr" className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Virtual Reality · gyroscope"
            title="Look around a world that moves with you"
            sub="A 360° solar system rendered in WebGL. On a phone, tap “Move your phone to look around” and physically turn — the gyroscope steers the camera. Switch on Cardboard mode for a stereo headset view."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Suspense fallback={<DemoFallback label="VR scene" />}>
            <GyroVRScene />
          </Suspense>
        </Reveal>
        <p className="mx-auto mt-10 max-w-xl text-center text-[14px] leading-relaxed text-[#86868b]">
          On a laptop, just drag to look around. On a phone, Cardboard mode splits the view for a £10 headset.
        </p>
      </section>

      {/* ── COMPARISON ──────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="At a glance" title="AR vs VR vs MR" sub="How the three technologies really differ." />
        </Reveal>
        <Reveal delay={0.1}>
          <ComparisonTable />
        </Reveal>
      </section>

      {/* ── USE CASES ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="In the real world"
            title="Where XR is changing everything"
            sub="From operating theatres to the factory floor, Extended Reality is already at work."
          />
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {USE_CASES.map((u) => (
            <motion.div
              key={u.title}
              variants={item}
              className="rounded-[28px] border border-black/[0.07] bg-[#fafafa] p-8 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.18)]"
            >
              <div className="mb-4 text-4xl">{u.emoji}</div>
              <h3 className="text-[20px] font-semibold tracking-tight text-[#1d1d1f]">{u.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#6e6e73]">{u.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── AR/VR IN INFORMATION SYSTEMS (illustrated) ──────────────────────── */}
      <Suspense fallback={<div className="py-24 text-center text-[15px] text-[#86868b]">Loading…</div>}>
        <ISUseCases />
      </Suspense>

      {/* ── DEVICES + DEV TOOLS / SETUP ─────────────────────────────────────── */}
      <Suspense fallback={<div className="py-24 text-center text-[15px] text-[#86868b]">Loading…</div>}>
        <DevicesAndTools />
      </Suspense>

      {/* ── QUIZ ────────────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="Check yourself" title="Five quick questions" sub="See how much of the lesson stuck." />
        </Reveal>
        <Reveal delay={0.1}>
          <Quiz />
        </Reveal>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <p className="text-[14px] text-[#6e6e73]">
          Designed and curated by{' '}
          <span className="font-medium text-[#1d1d1f]">Dr. Yasas Sri Wickramasinghe</span> · Extended Reality Learning
          Module
        </p>
        <p className="mt-2 text-[12px] text-[#aeaeb2]">
          All demos run entirely in your browser. No camera, motion or personal data is collected or stored.
        </p>
      </footer>
    </div>
  );
}
