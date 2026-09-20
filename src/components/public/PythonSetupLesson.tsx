import { useState, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { Reveal, SectionHead } from '../blend';

// ─── Python, from nothing to your first "Hello, World!" ───────────────────
// A beginner guide for MBI806B, written for a class with no IT background
// and a mix of Mac and Windows laptops. The one decision this guide makes:
// skip installing Python entirely and start in Google Colab, a free
// notebook that runs in the browser and is identical on every machine.
//
// Written the way it would be taught in the room: very short sentences,
// one idea per step, a picture of the thing rather than a paragraph about
// it. The "Hello, World!" demo is a static mock of a Colab cell rather than
// a real Python runtime — this page is about finding the button, not
// running code, and the real thing is one click away at the link below.

const BASE = import.meta.env.BASE_URL;

const COLAB_URL = 'https://colab.research.google.com';
const GOOGLE_SIGNUP_URL = 'https://accounts.google.com/signup';

/* ── A small picture of a browser, holding whatever's inside it ─────────── */
function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        background: 'var(--paper-0)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '11px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--paper-200)',
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#f87171' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fbbf24' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#34d399' }} />
        <span
          style={{
            marginLeft: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 11.5,
            color: 'var(--ink-400)',
            background: 'var(--paper-0)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 999,
            padding: '4px 14px',
          }}
        >
          {url}
        </span>
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  );
}

/* ── A small picture of one Colab code cell, run or not ──────────────────── */
function ColabCell({ code, output, ran }: { code: string; output?: string; ran: boolean }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          background: 'var(--ink-900)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--accent-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <span style={{ color: '#fff', fontSize: 10, marginLeft: 2 }}>▶</span>
        </span>
        <pre
          style={{
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: 13.5,
            lineHeight: 1.6,
            color: '#ede6e2',
            whiteSpace: 'pre-wrap',
          }}
        >
          {code}
        </pre>
      </div>
      {ran && output && (
        <div
          style={{
            marginTop: 6,
            marginLeft: 38,
            padding: '9px 14px',
            borderLeft: '2px solid var(--accent-500)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13.5,
            color: 'var(--ink-600)',
          }}
        >
          {output}
        </div>
      )}
    </div>
  );
}

/* ── Section 1: why Colab, not an install ────────────────────────────────── */
const WHY_CARDS: [string, string][] = [
  ['Installing Python yourself', 'Different steps on Mac and Windows. One typo and it breaks. Can eat a whole hour.'],
  ['Google Colab', 'One link. The same steps for everyone. Ready in under a minute.'],
];

/* ── Section 2: opening Colab ─────────────────────────────────────────────── */
const OPEN_STEPS: [string, string][] = [
  ['Open your browser', 'Chrome, Safari, Edge — any of them works.'],
  ['Go to colab.research.google.com', 'Type the address, or use the button below.'],
  ['Sign in with a Google account', 'Use one you already have. No account? Make a free one in a minute.'],
  ['Click "New notebook"', 'It’s on the welcome screen. A blank notebook opens, ready for code.'],
];

/* ── Section 4: what this sets up for ────────────────────────────────────── */
const NEXT_CARDS: [string, string][] = [
  ['Linear regression', 'Draw the straightest line through your data, then use it to guess the next point.'],
  ['Decision tree', 'A tree of yes/no questions that sorts your data into an answer.'],
  ['Random forest', 'Many decision trees voting together, usually more accurate than just one.'],
];

/* ── Section 5: troubleshooting ──────────────────────────────────────────── */
const HELP: [string, string][] = [
  ['I don’t have a Google account', 'Make one free at accounts.google.com. Two minutes, no cost, no card needed.'],
  ['Nothing happens when I press Run', 'Wait a few seconds. Colab is connecting you to a computer in the cloud.'],
  ['I closed the tab. Is my work gone?', 'No. Open Colab again, click File, then Open notebook, then Recent.'],
  ['My work laptop won’t let me sign in', 'Colab needs no install and no admin rights. If sign-in itself is blocked, bring it to class.'],
];

const LINKS: { href: string; label: string; note: string }[] = [
  { href: COLAB_URL, label: 'Google Colab', note: 'Where every step on this page happens. Free, no install.' },
  { href: GOOGLE_SIGNUP_URL, label: 'Make a free Google account', note: 'Only needed if you don’t already have one.' },
  { href: `${BASE}#/predicting-with-data`, label: 'Three ways to predict things', note: 'The next lesson: linear regression, decision trees and random forests, explained with no maths.' },
  { href: 'https://scikit-learn.org', label: 'scikit-learn', note: 'The Python library behind all three models. Already installed in every Colab notebook.' },
];

/* ── A small, click-through "Hello, World!" you can try right here ──────── */
function HelloWorldDemo() {
  const [ran, setRan] = useState(false);
  return (
    <div>
      <ColabCell code='print("Hello, World!")' output="Hello, World!" ran={ran} />
      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="bt-btn bt-btn--sm" onClick={() => setRan(true)}>
          Press ▶ Run
        </button>
        {ran && (
          <button type="button" className="bt-btn bt-btn--tertiary bt-btn--sm" onClick={() => setRan(false)}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default function PythonSetupLesson() {
  return (
    <div>
      {/* ══ Why Colab ══════════════════════════════════════════════════════ */}
      <section id="why" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Start here"
            title="Why we start in Colab"
            aside="You don't need to install anything. Not today, maybe not ever."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="bt-prose">
            Some of you have a Mac. Some have Windows. Installing Python is a different
            fight on each one, and it often breaks. Colab skips all of that. It runs on
            Google's computer, not yours.
          </p>
          <div className="bt-pairgrid" style={{ marginTop: 22 }}>
            {WHY_CARDS.map(([title, body]) => (
              <div key={title} className="bt-card">
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Opening Colab ══════════════════════════════════════════════════ */}
      <section id="open" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step by step"
            title="Open Google Colab"
            aside="Four clicks. Same four clicks whether you're on a Mac or a Windows laptop."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-flow">
            {OPEN_STEPS.map(([title, body], i) => (
              <li key={title}>
                <span className="bt-flow__n bt-tnum">{i + 1}</span>
                <div><h4>{title}</h4><p>{body}</p></div>
              </li>
            ))}
          </ol>
          <a
            className="bt-btn"
            href={COLAB_URL}
            target="_blank"
            rel="noreferrer"
            style={{ marginTop: 22, textDecoration: 'none' }}
          >
            Open Google Colab
            <span className="bt-btn__badge" aria-hidden="true">↗</span>
          </a>

          <div style={{ marginTop: 26 }}>
            <BrowserFrame url="colab.research.google.com">
              <p className="bt-eyebrow" style={{ marginBottom: 10 }}>A blank notebook</p>
              <ColabCell code="" ran={false} />
              <p className="bt-note" style={{ marginTop: 12 }}>
                This is what you'll see after step 4. One empty grey box, waiting for code.
              </p>
            </BrowserFrame>
          </div>
        </Reveal>
      </section>

      {/* ══ Hello, World ═══════════════════════════════════════════════════ */}
      <section id="hello" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Your first code"
            title="Say hello to Python"
            aside="One line. One button. Try it right here first."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-flow bt-flow--tight">
            <li>
              <span className="bt-flow__n bt-tnum">1</span>
              <div><h4>Click inside the empty grey box</h4><p>That's a code cell. It's where Python code goes.</p></div>
            </li>
            <li>
              <span className="bt-flow__n bt-tnum">2</span>
              <div><h4>Type the line below, exactly</h4><p>Quotes, brackets and capital letters all matter.</p></div>
            </li>
            <li>
              <span className="bt-flow__n bt-tnum">3</span>
              <div><h4>Press ▶, or Shift + Enter</h4><p>Python reads your line and prints the answer right below it.</p></div>
            </li>
          </ol>

          <div style={{ marginTop: 22 }}>
            <BrowserFrame url="colab.research.google.com">
              <HelloWorldDemo />
            </BrowserFrame>
          </div>

          <p className="bt-note" style={{ marginTop: 14 }}>
            Try it for real: in your own notebook, change the words between the quotes and run it
            again. Your own message appears.
          </p>
        </Reveal>
      </section>

      {/* ══ Where this goes ═══════════════════════════════════════════════ */}
      <section id="next" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Where this goes"
            title="From one line to real predictions"
            aside="This same notebook is where we try three simple ways computers learn to predict things."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-pairgrid bt-pairgrid--three">
            {NEXT_CARDS.map(([title, body]) => (
              <div key={title} className="bt-card">
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <a
            className="bt-btn"
            href={`${BASE}#/predicting-with-data`}
            style={{ marginTop: 22, textDecoration: 'none' }}
          >
            Try the three models
            <span className="bt-btn__badge" aria-hidden="true">→</span>
          </a>
        </Reveal>
      </section>

      {/* ══ When it goes wrong ═══════════════════════════════════════════ */}
      <section id="help" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Stuck?"
            title="When it goes wrong"
            aside="These four come up every year. None of them are your fault."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-rows">
            {HELP.map(([q, a]) => (
              <div key={q}>
                <h4>{q}</h4>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Links ════════════════════════════════════════════════════════ */}
      <section id="links" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Links"
            title="Where to go from here"
            aside="Bookmark the first one. You'll open it every week."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="pbi-links">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <ExternalLink size={12} aria-hidden="true" />
                </a>
                <span>{l.note}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>Bring a laptop and a Google account<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              That's genuinely everything you need. If Colab won't open, or the sign-in step gets
              stuck, come and ask me. It's faster to fix in person than to fight it alone the night
              before class.
            </p>
            <p className="bt-signoff__name">
              Yasas Sri Wickramasinghe
              <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer">
                MBI806B lecturer <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
