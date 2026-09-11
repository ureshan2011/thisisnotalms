import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CourseBrand from '../components/public/CourseBrand';
import IntroToDBMSLesson from '../components/public/IntroToDBMSLesson';
import '../styles/courseTheme.css';

// ─── /intro-to-dbms — MBI802 course intro, public and ungated ─────────────
// Blended Teaching Content's course-page theme: flat warm paper, one rationed
// accent, Manrope 800 display type at negative tracking, pill-shaped actions
// with a circular arrow badge, and a floating near-black pill nav. Tokens and
// component classes live in src/styles/courseTheme.css, namespaced under `.bt`
// so none of it reaches the rest of the app.
//
// The hero leads with the hospital spreadsheet rather than a course blurb,
// because that is the thing a reader can act on straight away — and acting on
// it is the entire argument for why databases exist.
//
// Nothing here is pinned to a particular class, session or calendar day: when
// somebody reads this page has nothing to do with when a class runs.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'break', label: 'The problem' },
  { id: 'meaning', label: 'Data' },
  { id: 'course', label: 'The course' },
  { id: 'outline', label: 'Outline' },
  { id: 'preview', label: 'Preview' },
  { id: 'practice', label: "You'll build" },
  { id: 'resources', label: 'Resources' },
];

const HERO_ROWS = [
  ['1001', 'Alice Chen', '20', 'Auckland'],
  ['1002', 'Ben Kumar', '22', 'Wellington'],
  ['1003', 'Mia Tuilagi', '19', 'Hamilton'],
];

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

  // Keep the current section's pill in view when the bar has to scroll
  // sideways, which it does on narrow screens.
  useEffect(() => {
    const bar = barRef.current;
    const current = bar?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!bar || !current) return;
    const left = current.offsetLeft - bar.clientWidth / 2 + current.clientWidth / 2;
    bar.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  return (
    <div className="bt-navdock">
      <nav ref={barRef} className="bt-pillbar" aria-label="Sections of this lesson">
        <span className="bt-wordmark" style={{ fontSize: 15, marginRight: 8 }}>MBI802</span>
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

export default function IntroToDBMSPage() {
  return (
    <div className="bt" style={{ minHeight: '100vh' }}>
      {/* ── Site identity, kept separate from the page's own nav ── */}
      <header style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          className="bt-wrap"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBlock: 14, flexWrap: 'wrap' }}
        >
          <Link to="/home" style={{ textDecoration: 'none' }} aria-label="Back to the home page">
            <CourseBrand size={28} />
          </Link>
          <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>
            MBI802 · Database Management Systems
          </span>
        </div>
      </header>

      <PillNav />

      {/* ── Hero ── */}
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
              Open to everyone · no login, no install
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              A hospital keeps patients in a <span className="bt-stop">spreadsheet.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Let’s break it together, right here on this page, and you will understand why databases exist.
              That is where MBI802 starts, and you can do it before you enrol — no account, nothing to install.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Written by Yasas Sri Wickramasinghe, MBI802 lecturer · 15 credits, Level 8, no prerequisites
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
                onClick={() => document.getElementById('break')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Break the spreadsheet
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('outline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                See all eight lessons
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          {/* A real relational table, with the primary key called out — the
              thing the whole course is ultimately about. */}
          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">school_db · students</span>
            <div className="bt-scroll">
              <table className="bt-grid">
                <thead>
                  <tr><th>student_id</th><th>name</th><th>age</th><th>city</th></tr>
                </thead>
                <tbody>
                  {HERO_ROWS.map(r => (
                    <tr key={r[0]}>
                      <td><span className="bt-pk">{r[0]}</span></td>
                      <td>{r[1]}</td>
                      <td className="bt-tnum">{r[2]}</td>
                      <td>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>Primary key.</b> Unique, never NULL. It is the thing that makes a row findable at all, and by Lesson 3 you will be joining on it.</span>
            </p>
          </motion.div>
        </div>
      </div>

      <main className="bt-wrap">
        <IntroToDBMSLesson />
      </main>

      <footer className="bt-footer">
        <div className="bt-footer__row">
          <div>
            <CourseBrand size={26} variant="on-dark" />
            <p style={{ marginTop: 12, color: 'var(--ink-400)' }}>
              MBI802 · Database Management Systems
            </p>
          </div>
          <p style={{ maxWidth: '40ch' }}>
            Everything on this page runs in your own browser. No login, no personal data collected.
          </p>
        </div>
      </footer>
    </div>
  );
}
