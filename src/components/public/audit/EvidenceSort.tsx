import { useState } from 'react';

// ─── Restating, asserting, auditing (MBI804 · peer audit activity) ────────
// The single most common way this activity loses marks is a report that
// summarises the scenario back at the marker. The second most common is a
// report full of confident verdicts with nothing behind them. Both feel like
// work while being written, which is why naming the difference out loud —
// on real sentences rather than in the abstract — is worth a section.
//
// Eight sentences, three buckets, and a running count of how many the reader
// has placed correctly. The sentences are drawn from the practice scenario
// so the exercise is continuous with the one above it.

type Bucket = 'restate' | 'assert' | 'audit';

const BUCKETS: { key: Bucket; label: string; blurb: string }[] = [
  { key: 'restate', label: 'Restates', blurb: 'True, and already in the document. Adds nothing a marker did not have.' },
  { key: 'assert', label: 'Asserts', blurb: 'A verdict with no evidence attached. Could have been written without reading.' },
  { key: 'audit', label: 'Audits', blurb: 'A claim, the evidence for it, and why it matters. This is the one that earns marks.' },
];

interface Line {
  text: string;
  answer: Bucket;
  why: string;
}

const LINES: Line[] = [
  {
    text: 'The author says the project took eleven weeks against a planned eight.',
    answer: 'restate',
    why: 'Accurate, and it is a sentence from the scenario with the words changed. A marker has already read it. Restating is how a report reaches the word count without reaching a finding.',
  },
  {
    text: 'The methodology verdict is wrong.',
    answer: 'assert',
    why: 'It might be. Nothing here says which half is wrong, or what in the write-up makes it wrong. A verdict with no evidence is indistinguishable from a guess.',
  },
  {
    text: 'The author calls the large-text mode a nice-to-have, but it is how a patient with low vision signs in unaided — that reclassification is where quality moved.',
    answer: 'audit',
    why: 'A claim (quality moved), the evidence (the author’s own reclassification, quoted), and the consequence (who can no longer sign in). Three moves in one sentence.',
  },
  {
    text: 'This project was clearly badly managed from the start.',
    answer: 'assert',
    why: 'Confident, unfalsifiable and unattached to anything in the document. It also breaks the auditor’s stance: the job is to test conclusions, not to grade the author.',
  },
  {
    text: 'The clinic’s IT person was on leave, and only he held the rights to open the port.',
    answer: 'restate',
    why: 'Straight from the scenario. It becomes an audit only once you add what follows from it — that it cost three weeks on a project where three weeks cost nothing.',
  },
  {
    text: 'The receptionist’s objection in week two is recorded as a problem that resolved itself, with no evidence offered beyond her agreeing.',
    answer: 'audit',
    why: 'It notices what the document does not say. Auditing is as much about the gap between a claim and its support as about what is written down.',
  },
  {
    text: 'Agile would have solved this.',
    answer: 'assert',
    why: 'The project already called itself Agile. A sentence like this could be written about any project without reading it, which is the test for whether something is an assertion.',
  },
  {
    text: 'Sprints and a daily standup are named, but the first demo to the clinic was week ten of eleven, so the iteration loop never closed with a user inside it.',
    answer: 'audit',
    why: 'It checks a label against a date in the same document, and says what the gap means. This is the sentence the second audit question is asking for.',
  },
];

export default function EvidenceSort() {
  const [placed, setPlaced] = useState<Record<number, Bucket>>({});
  const [open, setOpen] = useState<number | null>(null);

  const right = LINES.filter((l, i) => placed[i] === l.answer).length;
  const done = Object.keys(placed).length;

  function place(i: number, b: Bucket) {
    if (placed[i]) return;
    setPlaced(prev => ({ ...prev, [i]: b }));
    setOpen(i);
  }

  return (
    <div className="bt-sim">
      <div className="bt-pairgrid bt-pairgrid--three" style={{ marginTop: 0 }}>
        {BUCKETS.map(b => (
          <div key={b.key} className="bt-card">
            <h4>{b.label}</h4>
            <p>{b.blurb}</p>
          </div>
        ))}
      </div>

      <p className="bt-sim__label" style={{ marginTop: 26 }}>Eight sentences from a draft audit · put each one in a bucket</p>

      <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
        {LINES.map((l, i) => {
          const pick = placed[i];
          const correct = pick === l.answer;
          return (
            <div
              key={l.text}
              style={{
                border: `1px solid ${pick ? (correct ? 'rgba(47, 163, 107, 0.34)' : 'rgba(217, 58, 43, 0.28)') : 'var(--border-subtle)'}`,
                background: pick ? (correct ? 'var(--green-50)' : 'var(--red-50)') : 'var(--paper-50)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
              }}
            >
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-900)' }}>“{l.text}”</p>

              {!pick ? (
                <div className="bt-chiprow" style={{ marginTop: 11 }}>
                  {BUCKETS.map(b => (
                    <button key={b.key} type="button" className="bt-ctxchip" onClick={() => place(i, b.key)}>
                      {b.label}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <p style={{ marginTop: 10, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: correct ? '#186845' : '#8f2318' }}>
                    {correct ? `${BUCKETS.find(b => b.key === l.answer)!.label} · right` : `You said ${BUCKETS.find(b => b.key === pick)!.label} · it ${BUCKETS.find(b => b.key === l.answer)!.label.toLowerCase()}`}
                  </p>
                  <button
                    type="button"
                    className="bt-btn bt-btn--tertiary bt-btn--sm"
                    style={{ marginTop: 10 }}
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    {open === i ? 'Hide why' : 'Why'}
                    <span className="bt-btn__badge" aria-hidden="true">{open === i ? '↑' : '↓'}</span>
                  </button>
                  {open === i && (
                    <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6, color: 'var(--ink-600)', maxWidth: '72ch' }}>{l.why}</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <p className="cc__tally">
        <span className="bt-tnum">{right}</span> right of <span className="bt-tnum">{done}</span> placed. A report made
        only of the first two buckets can be long, fluent and still say nothing a marker could disagree with — which is
        what makes it a weak audit rather than a short one.
      </p>
    </div>
  );
}
