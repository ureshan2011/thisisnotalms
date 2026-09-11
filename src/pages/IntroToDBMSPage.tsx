import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';
import IntroToDBMSLesson from '../components/public/IntroToDBMSLesson';
import '../styles/ictcampus.css';

// ─── /intro-to-dbms — MBI802 class 1, public and ungated ──────────────────
// Dressed in the ICTCAMPUS design system's cream world: flat warm paper, one
// rationed orange, Manrope 800 display type at negative tracking, pill-shaped
// actions with a circular arrow badge, and a floating near-black pill nav.
// Tokens and component classes live in src/styles/ictcampus.css, namespaced
// under `.ict` so none of it reaches the rest of the app.
//
// The hero leads with the hospital spreadsheet rather than a course blurb,
// because that is the thing a student can act on in the first ten seconds —
// and acting on it is the entire argument for why databases exist.

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
    <div className="ict-navdock">
      <nav ref={barRef} className="ict-pillbar" aria-label="Sections of this lesson">
        <span className="ict-wordmark" style={{ fontSize: 15, marginRight: 8 }}>MBI802</span>
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
    <div className="ict" style={{ minHeight: '100vh' }}>
      {/* ── Site identity, kept separate from the page's own nav ── */}
      <header style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          className="ict-wrap"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBlock: 14, flexWrap: 'wrap' }}
        >
          <Link to="/home" style={{ textDecoration: 'none' }} aria-label="Back to the home page">
            <BrandLogo iconSize={26} variant="on-light" />
          </Link>
          <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>
            MBI802 · Database Management Systems · Class 1 of 8
          </span>
        </div>
      </header>

      <PillNav />

      {/* ── Hero ── */}
      <div className="ict-wrap ict-hero">
        <div className="ict-herogrid">
          <div>
            <motion.span
              className="ict-flag"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="ict-dot" style={{ background: 'var(--orange-500)' }} />
              Class 1 of 8 · no login, no install
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              A hospital keeps patients in a <span className="ict-stop">spreadsheet.</span>
            </motion.h1>

            <motion.p
              className="ict-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Let’s break it together, in about ninety seconds, and you will understand why databases exist.
              That is genuinely the first lesson of MBI802, and you can do it right here before you enrol.
            </motion.p>

            <motion.p
              className="ict-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Written by Yasas Sri Wickramasinghe, MBI802 lecturer · 15 credits, Level 8, no prerequisites
            </motion.p>

            <motion.div
              className="ict-hero__cta"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.3 }}
            >
              <button
                type="button"
                className="ict-btn"
                onClick={() => document.getElementById('break')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Break the spreadsheet
                <span className="ict-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="ict-btn ict-btn--tertiary"
                onClick={() => document.getElementById('outline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                See all eight lessons
                <span className="ict-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          {/* A real relational table, with the primary key called out — the
              thing the whole course is ultimately about. */}
          <motion.div
            className="ict-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="ict-heroart__lbl">school_db · students</span>
            <div className="ict-scroll">
              <table className="ict-grid">
                <thead>
                  <tr><th>student_id</th><th>name</th><th>age</th><th>city</th></tr>
                </thead>
                <tbody>
                  {HERO_ROWS.map(r => (
                    <tr key={r[0]}>
                      <td><span className="ict-pk">{r[0]}</span></td>
                      <td>{r[1]}</td>
                      <td className="ict-tnum">{r[2]}</td>
                      <td>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ict-keyline">
              <span className="ict-keyline__swatch" aria-hidden="true" />
              <span><b>Primary key.</b> Unique, never NULL. It is the thing that makes a row findable at all, and by Lesson 3 you will be joining on it.</span>
            </p>
          </motion.div>
        </div>
      </div>

      <main className="ict-wrap">
        <IntroToDBMSLesson />
      </main>

      <footer className="ict-footer">
        <div className="ict-footer__row">
          <div>
            <BrandLogo iconSize={24} variant="on-dark" />
            <p style={{ marginTop: 10, color: 'var(--ink-400)' }}>
              MBI802 · Database Management Systems · Class 1 of 8
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
