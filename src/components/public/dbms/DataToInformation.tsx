import { useState } from 'react';

// ─── Lesson 1, section 1.1: data vs information ────────────────────────────
// The definition box from the study pack turned into something you operate.
// Start with a bare 85 — which means nothing — and add the pieces of context
// one at a time until it reads as the chapter's worked example: "John Smith
// achieved a distinction (85%) in MBI802 during Semester 1."
//
// Each chip also satisfies one of the four quality characteristics from the
// same section, so the checklist on the right fills in as a side effect of
// building the sentence rather than being a separate thing to memorise.

type Quality = 'accurate' | 'complete' | 'timely' | 'relevant';

interface Piece { key: string; label: string; quality: Quality; note: string; }

const PIECES: Piece[] = [
  { key: 'who', label: 'John Smith', quality: 'relevant', note: 'Who it is about. Without a subject there is no decision to make.' },
  { key: 'what', label: 'in MBI802', quality: 'relevant', note: 'Which course. The same 85 means different things in different papers.' },
  { key: 'scale', label: 'out of 100', quality: 'accurate', note: 'The scale. 85 out of 100 and 85 out of 200 are not the same result.' },
  { key: 'when', label: 'Semester 1', quality: 'timely', note: 'When it happened. Last year’s mark does not help this year’s decision.' },
  { key: 'grade', label: 'a distinction', quality: 'complete', note: 'What the number actually earned. This is the part a reader acts on.' },
];

const QUALITIES: { key: Quality; name: string; meaning: string }[] = [
  { key: 'accurate', name: 'Accurate', meaning: 'Reflects reality. Wrong information is worse than none.' },
  { key: 'complete', name: 'Complete', meaning: 'Nothing essential is missing from the picture.' },
  { key: 'timely', name: 'Timely', meaning: 'Current, and available when the decision is made.' },
  { key: 'relevant', name: 'Relevant', meaning: 'Actually useful for the decision at hand.' },
];

export default function DataToInformation() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [last, setLast] = useState<Piece | null>(null);

  const any = PIECES.some(p => on[p.key]);
  const all = PIECES.every(p => on[p.key]);

  function toggle(p: Piece) {
    setOn(prev => ({ ...prev, [p.key]: !prev[p.key] }));
    setLast(on[p.key] ? null : p);
  }

  const score = PIECES.filter(p => on[p.key]).length / PIECES.length;

  // Assemble the sentence from whichever pieces are switched on. Only the
  // fragment you just added is orange — settled ones go white, so the panel
  // keeps to one accent at a time rather than turning into a highlighter.
  const frag = (key: string, text: string) =>
    last?.key === key ? <u>{text}</u> : <b>{text}</b>;

  const mark = on.scale ? frag('scale', '85%') : <>85</>;
  const sentence = !any ? <>85</> : (
    <>
      {on.who ? frag('who', 'John Smith') : 'Someone'}
      {on.grade ? <> achieved {frag('grade', 'a distinction')} ({mark})</> : <> scored {mark}</>}
      {on.what && <> in {frag('what', 'MBI802')}</>}
      {on.when && <> during {frag('when', 'Semester 1')}</>}
      .
    </>
  );

  return (
    <div className="ict-builder">
      <div className="ict-card">
        <p className="ict-eyebrow ict-eyebrow--quiet">Raw data</p>
        <div className="ict-rawval">85</div>
        <p className="ict-rawnote">
          A bare number. It could be a mark, an age, a heart rate, a bus route or a temperature. Nobody can
          decide anything with it, which is exactly what makes it data.
        </p>

        <p className="ict-eyebrow" style={{ marginTop: 26 }}>Add context</p>
        <div className="ict-chiprow">
          {PIECES.map(p => (
            <button
              key={p.key}
              type="button"
              className="ict-ctxchip"
              aria-pressed={!!on[p.key]}
              onClick={() => toggle(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="ict-chipnote" aria-live="polite">
          {last ? last.note : 'Tap the pieces in any order. Each one does a different job.'}
        </p>
      </div>

      <div className="ict-outbox">
        <p className="ict-eyebrow">Information</p>
        <p className="ict-sentence">{sentence}</p>

        <div className="ict-qual">
          <div className="ict-qualhead">
            <span>Quality information is…</span>
            <span className="ict-bar" aria-hidden="true"><i style={{ width: `${Math.round(score * 100)}%` }} /></span>
          </div>
          {QUALITIES.map(q => {
            const met = PIECES.some(p => p.quality === q.key && on[p.key]);
            return (
              <div key={q.key} className={`ict-qrow${met ? ' ict-qrow--on' : ''}`}>
                <span className="ict-qbox" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12.5 5 5L20 6.5" /></svg>
                </span>
                <span><b>{q.name}</b> — {q.meaning}</span>
              </div>
            );
          })}
        </div>

        <p className="ict-outfoot">
          {all
            ? 'That is the worked example from the chapter, built piece by piece. The requirement is context plus processing — nothing more exotic than that.'
            : 'Keep going. The transformation requirement is context plus processing, and you are part of the way there.'}
        </p>
      </div>
    </div>
  );
}
