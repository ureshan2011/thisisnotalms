import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CourseBrand from '../components/public/CourseBrand';
import IntroToBusinessAnalyticsLesson from '../components/public/IntroToBusinessAnalyticsLesson';
import '../styles/courseTheme.css';

// ─── /intro-to-business-analytics — MBI806B course intro, public ──────────
// The same Blended Teaching Content course-page theme as /intro-to-dbms,
// running on MBI806B's teal through the `.bt--analytics` accent variant:
// warm paper, one rationed accent, Manrope 800 display type, pill actions
// with a circular arrow badge, and a floating near-black pill nav.
//
// The hero opens on the thing the course is actually about — three rows of
// invented sales data and the one sentence a manager would act on — because
// that gap is the whole subject, and it beats a course blurb.
//
// Nothing here is pinned to a session number or a calendar day: when someone
// reads this page has nothing to do with when a class runs.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'decisions', label: 'Decisions' },
  { id: 'spot', label: 'AI in your life' },
  { id: 'course', label: 'The course' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'preview', label: 'Preview' },
  { id: 'setup', label: 'Power BI' },
  { id: 'prepared', label: 'Come prepared' },
];

// The same three rows the Power BI walkthrough later on the page asks you to
// type in, so the hero and the exercise are the same small dataset.
const HERO_ROWS: [string, number][] = [
  ['Coffee', 120],
  ['Tea', 90],
  ['Juice', 60],
];
const HERO_MAX = 120;

/** Floating near-black pill nav that highlights whichever section is in view. */
function PillNav() {
  const [active, setActive] = useState(NAV[0].id);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = NAV
      .map(n => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      entries => {
        const seen = entries.find(e => e.isIntersecting);
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );
    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    const current = bar?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!bar || !current) return;
    const left = current.offsetLeft - bar.clientWidth / 2 + current.clientWidth / 2;
    bar.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  return (
    <div className="bt-navdock">
      <nav ref={barRef} className="bt-pillbar" aria-label="Sections of this page">
        <span className="bt-wordmark" style={{ fontSize: 15, marginRight: 8 }}>MBI806B</span>
        {NAV.map(n => (
          <button
            key={n.id}
            type="button"
            aria-current={active === n.id}
            onClick={() => document.getElementById(n.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function IntroToBusinessAnalyticsPage() {
  return (
    <div className="bt bt--analytics" style={{ minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          className="bt-wrap"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBlock: 14, flexWrap: 'wrap' }}
        >
          <Link to="/home" style={{ textDecoration: 'none' }} aria-label="Back to the home page">
            <CourseBrand size={28} />
          </Link>
          <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>
            MBI806B · Business Data Analytics with Visualisation and Decision-Making
          </span>
        </div>
      </header>

      <PillNav />

      <div className="bt-wrap bt-hero">
        <div className="bt-herogrid">
          <div>
            <motion.span
              className="bt-flag"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="bt-dot" style={{ background: 'var(--accent-500)' }} />
              No maths, no coding · no login, no install
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Three numbers, and one <span className="bt-stop">decision.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Coffee outsells juice two to one. That much anyone can read. Working out what to do about it,
              and being able to defend the answer, is the actual job — and it is what MBI806B teaches.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Written by Yasas Sri Wickramasinghe, MBI806B lecturer · 15 credits, Level 8, built for beginners
            </motion.p>

            <motion.div
              className="bt-hero__cta"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.3 }}
            >
              <button
                type="button"
                className="bt-btn"
                onClick={() => document.getElementById('decisions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Walk a decision through
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Set up Power BI
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          {/* The chart the Power BI walkthrough builds, drawn to the same
              scale it uses — three rows of made-up data, nothing more. */}
          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">Sales by item · units</span>
            <div className="bt-minichart">
              {HERO_ROWS.map(([item, value], i) => (
                <div className="bt-minichart__row" key={item}>
                  <span className="bt-minichart__name">{item}</span>
                  <span className="bt-minichart__track">
                    <motion.i
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / HERO_MAX) * 100}%` }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.09 }}
                      style={{ background: i === 0 ? 'var(--accent-500)' : 'var(--accent-200)' }}
                    />
                  </span>
                  <span className="bt-minichart__val bt-tnum">{value}</span>
                </div>
              ))}
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>A chart is not the answer.</b> It is the start of an argument. Which is why this course spends as long on the decision as it does on the data.</span>
            </p>
          </motion.div>
        </div>
      </div>

      <main className="bt-wrap">
        <IntroToBusinessAnalyticsLesson />
      </main>

      <footer className="bt-footer">
        <div className="bt-footer__row">
          <div>
            <CourseBrand size={26} variant="on-dark" />
            <p style={{ marginTop: 12, color: 'var(--ink-400)' }}>
              MBI806B · Business Data Analytics with Visualisation and Decision-Making
            </p>
          </div>
          <p style={{ maxWidth: '40ch' }}>
            Nothing on this page is tracked or collected. No login required.
          </p>
        </div>
      </footer>
    </div>
  );
}
