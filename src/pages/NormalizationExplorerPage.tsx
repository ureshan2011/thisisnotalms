import { type CSSProperties, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ChevronRight, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { CoursePage, Reveal } from '../components/blend';
import NormalisationHeroScene from '../components/public/NormalisationHeroScene';
import {
  AnomalyPlayground,
  AtomicSplitter,
  C,
  EASE,
  FDExplorer,
  NFChecklist,
  NFDetective,
  NF_SUMMARY,
  NormalizationStudio,
  OneNFSimulator,
  Pill,
  ThreeNFSimulator,
  TrueFalseQuiz,
  TwoNFSimulator,
} from '../components/public/NormalisationExplorerSims';
import '../styles/normalisation-explorer.css';

// ─── /normalisation — the Normalisation Explorer, MBI802 ──────────────────
// The whole normalisation lesson on one page: the anomalies that motivate
// it, functional dependencies, 1NF → 2NF → 3NF → BCNF, and decomposition,
// with ten simulations to play with. Built on Blend
// (src/components/blend/README.md) on MBI802's orange, like the other course
// pages; the simulations live in NormalisationExplorerSims.tsx and the hero
// drawing in NormalisationHeroScene.tsx. The teaching text is unchanged from
// the earlier Apple-styled version of this page. Nothing is collected or
// stored: every simulation runs entirely in the browser.

const NAV = [
  { id: 'anomalies', label: 'The problem' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'studio', label: 'Studio' },
  { id: 'first', label: '1NF' },
  { id: 'plain', label: '2NF & 3NF' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'walkthroughs', label: 'Walkthroughs' },
  { id: 'decomposition', label: 'Decomposition' },
  { id: 'detective', label: 'Detective' },
  { id: 'reference', label: 'At a glance' },
  { id: 'quiz', label: 'Quiz' },
];

// Smooth-scroll without touching the URL hash (the app runs under HashRouter).
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const cvar = (c: string) => ({ '--c': c }) as CSSProperties;

function Head({ eyebrow, title, stop, sub }: { eyebrow: string; title: string; stop?: string; sub?: ReactNode }) {
  return (
    <Reveal>
      <div className="nx-head">
        <div>
          <p className="bt-eyebrow">{eyebrow}</p>
          <h2>
            {title}
            {stop && <span className="bt-stop">{stop}</span>}
          </h2>
        </div>
        {sub && <p className="nx-head__sub">{sub}</p>}
      </div>
    </Reveal>
  );
}

/** Children rise in one after another as the group scrolls into view. */
function Stagger({ children, className, style }: { children: ReactNode[]; className: string; style?: CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children.map((c, i) => (
        <motion.div
          key={i}
          variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
          style={{ height: '100%' }}
        >
          {c}
        </motion.div>
      ))}
    </motion.div>
  );
}

const ANOMALIES: [typeof Pencil, string, string, string][] = [
  [Pencil, 'Update anomaly', C.red, 'A repeated fact is changed in some rows but not others, so the database ends up contradicting itself.'],
  [PlusCircle, 'Insertion anomaly', C.amber, 'You can’t record one fact without inventing another — a department needs a student before it can exist.'],
  [Trash2, 'Deletion anomaly', C.blue, 'Removing one row quietly destroys unrelated information that happened to live in the same place.'],
];

export default function NormalizationExplorerPage() {
  return (
    <CoursePage
      courseCode="MBI802"
      courseName="Database Management Systems"
      nav={NAV}
      footerNote="Everything here runs in your own browser. No personal data is collected or stored."
      hero={
        <div className="nx-herogrid nx-hero">
          <div>
            <motion.span
              className="bt-flag"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="bt-dot" style={{ background: 'var(--accent-500)' }} />
              An interactive lesson · Dr. Yasas Sri Wickramasinghe
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            >
              Let’s make sense of
              <span className="nx-hero__l2">Database Normalisation.</span>
            </motion.h1>
            <motion.p
              className="bt-hero__lede"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            >
              We’ll start with the messes that bad table design creates, then climb the ladder — 1NF, 2NF, 3NF and BCNF —
              one rung at a time. Along the way you can play with live simulations: trigger the anomalies, split tables
              apart, and test yourself. No headset, no sign-in, nothing collected.
            </motion.p>
            <motion.div
              className="bt-hero__cta"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            >
              <button type="button" className="bt-btn" onClick={() => scrollToSection('studio')}>
                Open the Normalisation Studio
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
              <button type="button" className="bt-btn bt-btn--tertiary" onClick={() => scrollToSection('anomalies')}>
                Start with the problem
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </motion.div>
            <motion.p
              className="nx-hero__scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <motion.span
                style={{ display: 'inline-flex' }}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: 3, ease: 'easeInOut', delay: 1.4 }}
              >
                <ArrowDown size={14} />
              </motion.span>
              Scroll to explore
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          >
            <NormalisationHeroScene />
          </motion.div>
        </div>
      }
    >
      {/* ── WHY / ANOMALIES ─────────────────────────────────────────────── */}
      <section id="anomalies" className="bt-sec">
        <Head
          eyebrow="Start here"
          title="What goes wrong without normalisation"
          stop="?"
          sub="When one table tries to store everything at once, the same fact gets written in many places. That redundancy quietly breeds three classic anomalies. Poke the table below to feel each one."
        />
        <Reveal delay={0.1}>
          <AnomalyPlayground />
        </Reveal>
        <Stagger className="nx-grid3" style={{ marginTop: 28 }}>
          {ANOMALIES.map(([Icon, t, c, d]) => (
            <div key={t} className="nx-card nx-lift" style={{ ...cvar(c), height: '100%' }}>
              <div className="nx-icon">
                <Icon size={24} strokeWidth={2.2} />
              </div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </Stagger>
      </section>

      {/* ── FUNCTIONAL DEPENDENCIES ─────────────────────────────────────── */}
      <section id="dependencies" className="bt-sec">
        <Head
          eyebrow="The core idea"
          title="Functional dependencies"
          stop="."
          sub="Normalisation is really about one question: which columns determine which? We write X → Y to mean “if you know X, you know exactly one Y.” Getting these right is the whole game."
        />
        <Reveal delay={0.05}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <motion.span
              className="nx-fdbig"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              X
              <motion.b
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
              >
                →
              </motion.b>
              Y
            </motion.span>
            <p className="nx-hint">
              X is the <strong style={{ color: 'var(--ink-900)' }}>determinant</strong> · Y is the{' '}
              <strong style={{ color: 'var(--ink-900)' }}>dependent</strong>
            </p>
          </div>
        </Reveal>
        <FDExplorer />
      </section>

      {/* ── THE STUDIO ──────────────────────────────────────────────────── */}
      <section id="studio" className="bt-sec">
        <Head
          eyebrow="Interactive · the main event"
          title="The Normalisation Studio"
          sub="Here is one messy table. Step it up the ladder and watch tables split apart, redundancy drain away and the anomalies disappear — the whole journey from un-normalised to BCNF in one place."
        />
        <Reveal delay={0.1}>
          <NormalizationStudio />
        </Reveal>
      </section>

      {/* ── 1NF DEEP DIVE ───────────────────────────────────────────────── */}
      <section id="first" className="bt-sec">
        <Head
          eyebrow="First Normal Form · 1NF"
          title="Break apart the lists"
          stop="."
          sub="1NF asks for one thing: every cell holds a single, atomic value — no comma-separated lists, no repeating groups. Flip the table below and watch a multi-valued column become tidy rows."
        />
        <Reveal delay={0.1}>
          <AtomicSplitter />
        </Reveal>
      </section>

      {/* ── 1NF REAL-WORLD SIMULATOR ────────────────────────────────────── */}
      <section className="bt-sec">
        <Head
          eyebrow="1NF · Real-world walkthrough"
          title="Fixing a music streaming playlist table"
          sub="This is the kind of table a junior dev might design for a Spotify-style app. Walk through three steps to see exactly what 1NF demands — and what gets unlocked when every cell is atomic."
        />
        <Reveal delay={0.1}>
          <OneNFSimulator />
        </Reveal>
      </section>

      {/* ── 2NF & 3NF in plain words ────────────────────────────────────── */}
      <section id="plain" className="bt-sec">
        <Head
          eyebrow="Climbing higher"
          title="2NF and 3NF, in really plain words"
          sub="1NF was about tidying up the cells. 2NF and 3NF are about one thing only: making sure each column is sitting in the right table. Let’s take them one at a time — slowly."
        />
        <div className="nx-mid nx-stack" style={{ gap: 18 }}>
          <Reveal delay={0.05}>
            <div className="nx-plain" style={cvar(C.amber)}>
              <Pill color={C.amber} solid>2NF · use the whole key</Pill>
              <p className="nx-plain__q">
                Does each column need the <em>whole</em> key, or just half of it?
              </p>
              <p className="nx-plain__p">
                2NF only matters when your table’s key is made of two columns stuck together (a “composite” key). Picture
                an order table where the key is <span className="nx-plain__mono">{'{OrderID, ProductID}'}</span>. Now look
                at <strong>ProductName</strong>. Does it care which order it was on? Nope — it only depends on{' '}
                <strong>ProductID</strong>. So you’d be repeating “iPhone 15” on every single order that includes it.
              </p>
              <p className="nx-plain__p">
                The fix: move ProductName into its own little Products table, where ProductID alone is the key.
              </p>
              <p className="nx-plain__line">
                In one line: if a column only needs <em>part</em> of the key, it’s sitting in the wrong table.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="nx-plain" style={cvar(C.blue)}>
              <Pill color={C.blue} solid>3NF · no middlemen</Pill>
              <p className="nx-plain__q">Does each column point straight at the key — or sneak in through another column?</p>
              <p className="nx-plain__p">
                Once 2NF is sorted, 3NF asks the next question. Take an employee table. Each <strong>Employee</strong> has a{' '}
                <strong>DeptID</strong>, and that DeptID tells you the <strong>DeptName</strong> and{' '}
                <strong>DeptPhone</strong>. So DeptName doesn’t really depend on the employee — it depends on the{' '}
                <em>department</em>, which depends on the employee. That extra hop is a “middleman”:
              </p>
              <p className="nx-plain__p" style={{ textAlign: 'center' }}>
                <span className="nx-dep">Employee → DeptID → DeptName</span>
              </p>
              <p className="nx-plain__p">
                The fix: give departments their own table, and let the employee row just keep the DeptID.
              </p>
              <p className="nx-plain__line">
                In one line: every column should point straight at the key — no hopping through another column.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="nx-plain" style={cvar(C.green)}>
              <Pill color={C.green} solid>BCNF · optional extra</Pill>
              <p className="nx-plain__q">Nice to have — but you usually don’t need it.</p>
              <p className="nx-plain__p">
                Here’s the honest truth: most real databases stop at 3NF and are completely fine. BCNF is just a stricter,
                extra-tidy version of 3NF that handles a few rare edge cases. Think of it as a polish, not a box you{' '}
                <em>have</em> to tick. If your table is solidly in 3NF, you’re already in great shape — so feel free to
                treat this one as bonus reading.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE CHECKLIST ───────────────────────────────────────────────── */}
      <section id="checklist" className="bt-sec">
        <Head
          eyebrow="Self-check"
          title="Is my table in this form"
          stop="?"
          sub="A quick checklist for the three forms that matter. Tap a tab and run down the boxes — if they all hold true, your table has reached that form."
        />
        <Reveal delay={0.1}>
          <NFChecklist />
        </Reveal>
      </section>

      {/* ── 2NF REAL-WORLD SIMULATOR ────────────────────────────────────── */}
      <section id="walkthroughs" className="bt-sec">
        <Head
          eyebrow="2NF · Real-world walkthrough"
          title="Fixing an e-commerce order table"
          sub="This is the table a new developer builds on day one. It looks sensible — until you trace the partial dependencies and see the update anomalies hiding inside."
        />
        <Reveal delay={0.1}>
          <TwoNFSimulator />
        </Reveal>
      </section>

      {/* ── 3NF REAL-WORLD SIMULATOR ────────────────────────────────────── */}
      <section className="bt-sec">
        <Head
          eyebrow="3NF · Real-world walkthrough"
          title="Fixing an HR employee records table"
          sub="Employee info that carries along department details creates transitive chains. Watch the chain animate, then see exactly which table gets extracted and why."
        />
        <Reveal delay={0.1}>
          <ThreeNFSimulator />
        </Reveal>
      </section>

      {/* ── DECOMPOSITION ───────────────────────────────────────────────── */}
      <section id="decomposition" className="bt-sec">
        <Head
          eyebrow="The fine print"
          title="A good split keeps two promises"
          stop="."
          sub="Splitting a table isn’t free — a careless decomposition can invent fake rows or lose rules you cared about. Two properties tell you whether a split is safe."
        />
        <Stagger className="nx-grid2 nx-mid">
          {[
            <div key="l" className="nx-card nx-lift" style={{ ...cvar(C.blue), height: '100%' }}>
              <Pill color={C.blue} solid>Lossless join</Pill>
              <p style={{ marginTop: 14 }}>
                Joining the pieces back together must reproduce the <em>exact</em> original table — no spurious, invented
                rows and nothing lost.
              </p>
              <p className="nx-formula">R = R₁ ⋈ R₂</p>
            </div>,
            <div key="d" className="nx-card nx-lift" style={{ ...cvar(C.violet), height: '100%' }}>
              <Pill color={C.violet} solid>Dependency preserving</Pill>
              <p style={{ marginTop: 14 }}>
                Every functional dependency from the original can still be checked on the new tables, without re-joining
                them first.
              </p>
              <p className="nx-formula">F ≡ F₁ ∪ F₂</p>
            </div>,
          ]}
        </Stagger>
        <Reveal delay={0.15}>
          <div className="nx-tradeoff nx-mid">
            <strong>The trade-off:</strong> BCNF always gives you a lossless join but may sacrifice dependency preservation.
            3NF guarantees <em>both</em> — which is why it’s often the practical target in real systems.
          </div>
        </Reveal>
      </section>

      {/* ── PRACTICE: DETECTIVE ─────────────────────────────────────────── */}
      <section id="detective" className="bt-sec">
        <Head
          eyebrow="Interactive · put it together"
          title="Normal Form Detective"
          sub="Read each schema and its dependencies, then call the highest normal form it satisfies. This is exactly the reasoning you’ll use on real designs."
        />
        <Reveal delay={0.1}>
          <NFDetective />
        </Reveal>
      </section>

      {/* ── QUICK REFERENCE ─────────────────────────────────────────────── */}
      <section id="reference" className="bt-sec">
        <Head
          eyebrow="At a glance"
          title="The normal forms, side by side"
          sub="One card per rung of the ladder — the rule it enforces and how you fix a violation."
        />
        <Stagger className="nx-grid2 nx-mid">
          {NF_SUMMARY.map(n => (
            <div key={n.nf} className="nx-card nx-ref nx-lift" style={{ ...cvar(n.color), height: '100%' }}>
              <span className="nx-ref__nf">{n.nf}</span>
              <p className="nx-ref__rule">{n.rule}</p>
              <p className="nx-ref__fix" style={{ marginTop: 8 }}>
                <b>Fix:</b> {n.fix}
              </p>
            </div>
          ))}
        </Stagger>
        <Reveal delay={0.1}>
          <div className="nx-ladder" aria-label="Unnormalised → 1NF → 2NF → 3NF → BCNF">
            {['Unnormalised', '1NF', '2NF', '3NF', 'BCNF'].map((s, i) => (
              <motion.span
                key={s}
                className="nx-ladder__item"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.12 }}
              >
                {i > 0 && <ChevronRight size={16} />}
                <span className={`nx-ladder__step${i === 4 ? ' nx-ladder__step--end' : ''}`}>{s}</span>
              </motion.span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── CLOSING QUIZ ────────────────────────────────────────────────── */}
      <section id="quiz" className="bt-sec">
        <Head eyebrow="Check yourself" title="Five quick questions" sub="See how much of the lesson stuck." />
        <Reveal delay={0.1}>
          <TrueFalseQuiz />
        </Reveal>
      </section>

      <Reveal>
        <p className="nx-signoff">
          A Database Normalisation lesson, put together by <b>Dr. Yasas Sri Wickramasinghe</b>.
        </p>
      </Reveal>
    </CoursePage>
  );
}
