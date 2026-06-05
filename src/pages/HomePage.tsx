import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type Variants,
} from 'framer-motion';
import BrandMark from '../components/ui/BrandMark';

// ─── Home / launchpad (Not a LMS) ───────────────────────────────────────────
// A single entry point that introduces the project and lets you jump into each
// of the independent, interactive lessons. Built to feel like an Apple product
// page: a cinematic hero up top, then a quiet grid of lessons below.

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

// Each independent lesson page, in the order they appear on the launchpad.
// Use `href` for static HTML lessons (external link); use `to` for React-router pages.
const LESSONS: {
  to?: string;
  href?: string;
  eyebrow: string;
  title: string;
  body: string;
  emoji: string;
  from: string;
  to2: string;
}[] = [
  {
    to: '/cost-management',
    eyebrow: 'MBI804 · Project Management',
    title: 'Project Cost Management',
    body: 'Plan, estimate, budget — and avoid the traps that sink 75% of IT projects. 7 interactive sections built around the SecurePay NZ scenario: PERT calculator, budget builder, live S-curve, and a final challenge.',
    emoji: '💰',
    from: '#1e3a5f',
    to2: '#2a9d8f',
  },
  {
    to: '/five-stories',
    eyebrow: 'Strategic Information Systems',
    title: 'Five Stories That Changed Everything',
    body: 'Airbnb, Netflix, Xero, Canva, Alibaba — how each started from a single frustration and built a platform that rewired its industry. IS architecture, growth data, videos, and discussion questions included.',
    emoji: '🌐',
    from: '#c9a84c',
    to2: '#FF5A5F',
  },
  {
    to: '/xr-explorer',
    eyebrow: 'Extended Reality',
    title: "Let's make sense of Extended Reality",
    body: 'A friendly walk through AR, VR and Mixed Reality — with two demos you can try right in the browser. No headset needed.',
    emoji: '🥽',
    from: '#0071e3',
    to2: '#bf5af2',
  },
  {
    to: '/normalisation',
    eyebrow: 'Database design',
    title: "Let's make sense of Database Normalisation",
    body: 'From messy tables to clean ones. Spot the anomalies, then split a table step by step from 1NF all the way to 3NF.',
    emoji: '🧩',
    from: '#5e5ce6',
    to2: '#0071e3',
  },
  {
    to: '/er-mapping',
    eyebrow: 'Data modelling',
    title: "Let's make sense of ER → relational mapping",
    body: 'Turn entity-relationship diagrams into real relational tables — entities, relationships, keys and all the tricky cases in between.',
    emoji: '🗺️',
    from: '#30d158',
    to2: '#0071e3',
  },
  {
    to: '/sql-reels',
    eyebrow: 'SQL in practice',
    title: "Let's make sense of UPDATE & DELETE",
    body: 'Change and remove rows with confidence. Short, scrollable reels that show how to edit data without breaking everything.',
    emoji: '⚡️',
    from: '#962fbf',
    to2: '#ff375f',
  },
  {
    to: '/pre-class',
    eyebrow: 'Before class',
    title: 'The pre-class Idea Swarm',
    body: 'A full-screen countdown for the minutes before class. Key course concepts drift like a galaxy, then swarm together to reveal the course code right as we begin. (Password protected.)',
    emoji: '✨',
    from: '#8b5cf6',
    to2: '#0071e3',
  },
];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

// A floating, blurred colour orb that drifts slowly behind the hero.
function Orb({
  className,
  duration,
  delay = 0,
}: {
  className: string;
  duration: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{
        x: [0, 28, -18, 0],
        y: [0, -22, 16, 0],
        scale: [1, 1.08, 0.96, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  // Subtle pointer-driven parallax for the headline and orbs.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const titleX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const titleY = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const orbX = useTransform(sx, [-0.5, 0.5], [30, -30]);
  const orbY = useTransform(sy, [-0.5, 0.5], [24, -24]);

  function handlePointer(e: React.MouseEvent) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <div className="bg-white text-[#1d1d1f]" style={{ fontFamily: APPLE_FONT }}>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handlePointer}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      >
        {/* brand lockup */}
        <div className="absolute left-6 top-6 z-20 flex items-center gap-2.5 sm:left-10 sm:top-8">
          <BrandMark className="h-8 w-8 rounded-[9px]" />
          <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
            Not a <span className="text-[#0071e3]">LMS</span>
          </span>
        </div>

        {/* drifting ambient orbs */}
        <motion.div style={{ x: orbX, y: orbY }} className="pointer-events-none absolute inset-0">
          <Orb className="left-1/2 top-[-12%] h-[560px] w-[560px] -translate-x-1/2 bg-[#0071e3]/[0.10]" duration={16} />
          <Orb className="bottom-[-14%] right-[8%] h-[460px] w-[460px] bg-[#bf5af2]/[0.10]" duration={20} delay={1.5} />
          <Orb className="bottom-[2%] left-[6%] h-[380px] w-[380px] bg-[#30d158]/[0.08]" duration={22} delay={0.8} />
        </motion.div>

        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-6 text-[15px] font-semibold uppercase tracking-[0.2em] text-[#6e6e73]"
          >
            An interactive learning playground
          </motion.p>

          <motion.div style={{ x: titleX, y: titleY }}>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
              className="text-[52px] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-[96px] lg:text-[120px]"
            >
              <span className="block">This is</span>
              <span className="block">
                <span className="text-[#1d1d1f]">not a </span>
                <motion.span
                  className="bg-[length:200%_auto] bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg,#0071e3,#5e5ce6,#bf5af2,#ff375f,#0071e3)',
                  }}
                  animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  LMS
                </motion.span>
              </span>
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="mt-8 text-[22px] font-medium tracking-tight text-[#1d1d1f] sm:text-[30px]"
          >
            by{' '}
            <span className="bg-gradient-to-r from-[#0071e3] to-[#bf5af2] bg-clip-text font-semibold text-transparent">
              Yasas Sri Wickramasinghe
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="mx-auto mt-7 max-w-xl text-[18px] leading-relaxed text-[#6e6e73] sm:text-[20px]"
          >
            A small collection of hands-on lessons — no logins, no marks, no busywork.
            Just pick a topic below and start exploring.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            onClick={() =>
              document.getElementById('lessons')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="mt-10 rounded-full bg-[#0071e3] px-8 py-3.5 text-[17px] font-medium text-white transition hover:bg-[#0077ed]"
          >
            Explore the lessons
          </motion.button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 text-[13px] font-medium text-[#aeaeb2]"
        >
          Scroll to begin
        </motion.div>
      </section>

      {/* ── LESSON LAUNCHPAD ───────────────────────────────────────────────── */}
      <section id="lessons" className="px-6 py-24 sm:py-28">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]"
          >
            Where to begin
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
            className="text-[34px] font-semibold leading-[1.06] tracking-tight sm:text-[48px]"
          >
            Pick a lesson and dive in
          </motion.h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2"
        >
          {LESSONS.map((l) => {
            const key = l.to ?? l.href ?? l.title;
            const inner = (
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative h-full overflow-hidden rounded-[28px] border border-black/[0.07] bg-[#fafafa] p-8 transition group-hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.22)]"
              >
                {/* colour wash that warms up on hover */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle, ${l.from}33, transparent 70%)` }}
                />
                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: `linear-gradient(135deg, ${l.from}1f, ${l.to2}1f)` }}
                >
                  {l.emoji}
                </div>
                <p
                  className="mb-2 text-[13px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: l.from }}
                >
                  {l.eyebrow}
                </p>
                <h3 className="text-[24px] font-semibold leading-[1.12] tracking-tight text-[#1d1d1f] sm:text-[26px]">
                  {l.title}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-[#6e6e73]">{l.body}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-[16px] font-medium text-[#0071e3]">
                  Start lesson
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    ›
                  </span>
                </span>
              </motion.div>
            );
            return (
              <motion.div key={key} variants={card}>
                {l.href ? (
                  <a href={l.href} className="group block h-full" target="_self" rel="noopener">
                    {inner}
                  </a>
                ) : (
                  <Link to={l.to!} className="group block h-full">
                    {inner}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <BrandMark className="h-7 w-7 rounded-[8px]" />
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
            Not a <span className="text-[#0071e3]">LMS</span>
          </span>
        </div>
        <p className="text-[14px] text-[#6e6e73]">
          A set of interactive lessons, put together by{' '}
          <span className="font-medium text-[#1d1d1f]">Yasas Sri Wickramasinghe</span>.
        </p>
        <p className="mt-2 text-[12px] text-[#aeaeb2]">
          Everything here runs in your own browser. No personal data is collected or stored.
        </p>
      </footer>
    </div>
  );
}
