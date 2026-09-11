import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import PowerBISetupLesson from '../components/public/PowerBISetupLesson';

// ─── /power-bi-setup — installing and meeting Power BI ────────────────────
// Built on Blend (src/components/blend/README.md), on MBI806B's teal.
// The guide itself, and the reasoning behind its browser-first line, is
// documented at the top of PowerBISetupLesson.tsx.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'what', label: 'What it is' },
  { id: 'path', label: 'Your setup' },
  { id: 'hello', label: 'First chart' },
  { id: 'limits', label: 'Limits' },
  { id: 'trouble', label: 'Problems' },
  { id: 'links', label: 'Links' },
];

export default function PowerBISetupPage() {
  return (
    <CoursePage
      accent="analytics"
      courseCode="MBI806B"
      courseName="Setting up Power BI"
      nav={NAV}
      footerNote="Nothing on this page is tracked or collected. No login required to read it."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Power BI, from nothing to your <span className="bt-stop">first chart.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              Written for people who have never opened a data tool. Everybody starts in the browser, which
              works the same on a Mac as on a PC. Nobody should spend the first class watching a download bar.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI806B lecturer · checked against Microsoft’s documentation
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
                onClick={() => document.getElementById('path')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Find my setup
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="bt-btn bt-btn--tertiary"
                onClick={() => document.getElementById('hello')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Skip to the first chart
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
          </div>

          {/* What you are aiming for: the finished hello-world. */}
          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">What you’ll have built</span>
            <div className="bt-minichart">
              {([['Coffee', 120], ['Tea', 90], ['Juice', 60]] as [string, number][]).map(([item, value], i) => (
                <div className="bt-minichart__row" key={item}>
                  <span className="bt-minichart__name">{item}</span>
                  <span className="bt-minichart__track">
                    <motion.i
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / 120) * 100}%` }}
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
              <span><b>Three rows and one chart.</b> Everything else in the course is the same move, with real data and harder questions behind it.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <PowerBISetupLesson />
    </CoursePage>
  );
}
