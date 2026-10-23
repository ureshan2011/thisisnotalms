import { motion } from 'framer-motion';
import { CoursePage } from '../components/blend';
import DashboardStudioLesson, { StudioPdf } from '../components/public/DashboardStudioLesson';

// ─── /dashboard-design-studio — MBI806B, public and ungated ───────────────
// Built on Blend (src/components/blend/README.md), on MBI806B's teal.
// The activity is described at the top of DashboardStudioLesson.tsx. The hero
// shows a small dashboard of the kind the teams will be designing, with its
// title written as a finding rather than a topic.

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { id: 'start', label: 'Start' },
  { id: 'tool', label: 'Tool' },
  { id: 'method', label: 'Method' },
  { id: 'layout', label: 'Layout' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'run', label: 'Session' },
  { id: 'review', label: 'Feedback' },
  { id: 'check', label: 'Check' },
];

const BARS: [string, number, boolean][] = [
  ['Sat', 100, true], ['Sun', 88, false], ['Fri', 72, false], ['Thu', 58, false], ['Mon', 48, false],
];

export default function DashboardStudioPage() {
  return (
    <CoursePage
      accent="analytics"
      courseCode="MBI806B"
      courseName="Business Data Analytics with AI and ML"
      nav={NAV}
      footerNote="Nothing on this page is tracked or saved. No login, no personal data collected."
      hero={
        <div className="bt-herogrid">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.06 }}
            >
              Design the dashboard before you <span className="bt-stop">build it.</span>
            </motion.h1>

            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
            >
              A group activity for five teams. Each team gets a different client and a different reader, then decides
              the layout, picks the right chart for every question, and mocks it up in a free tool.
            </motion.p>

            <motion.p
              className="bt-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
            >
              Yasas Sri Wickramasinghe, MBI806B lecturer · About 90 minutes · Five scenarios
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
                onClick={() => document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Find my team’s scenario
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <StudioPdf tertiary />
            </motion.div>
          </div>

          <motion.div
            className="bt-heroart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          >
            <span className="bt-heroart__lbl">A title that says what to see</span>
            <p className="dds-hero__title">Saturday sales are double Monday’s</p>
            <div className="bt-minichart" style={{ marginTop: 14 }}>
              {BARS.map(([day, value, hot], i) => (
                <div className="bt-minichart__row" key={day}>
                  <span className="bt-minichart__name">{day}</span>
                  <span className="bt-minichart__track">
                    <motion.i
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.09 }}
                      style={{ background: hot ? 'var(--accent-500)' : 'var(--accent-200)' }}
                    />
                  </span>
                  <span className="bt-minichart__val bt-tnum">{value}</span>
                </div>
              ))}
            </div>
            <p className="bt-keyline">
              <span className="bt-keyline__swatch" aria-hidden="true" />
              <span><b>One strong colour, the rest quiet.</b> The title makes the claim, and the chart is the proof.</span>
            </p>
          </motion.div>
        </div>
      }
    >
      <DashboardStudioLesson />
    </CoursePage>
  );
}
