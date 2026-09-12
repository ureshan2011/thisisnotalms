import { useMemo, useState, type ReactNode } from 'react';
import { useLocalDraft } from '../../lib/useLocalDraft';
import { downloadArtefact, type Artefact } from '../../lib/artefactPdf';

// ─── Build something of your own, one question at a time ──────────────────
// Both lesson pages end by asking a student to bring a real example to class.
// Asking is the easy half. This is the other half: a guided pass over their
// own incident that produces a page they can actually carry in.
//
// The design decisions worth keeping:
//
// One question on screen at a time. A grid of empty boxes is a form, and
// people abandon forms. A single question with the framework's own words
// above it is a conversation, and they finish those.
//
// The artefact assembles as they type. The right-hand sheet is the thing
// they will take away, filling in live. That is the whole engagement loop:
// every sentence visibly becomes part of an object, so there is never a
// stretch of typing with nothing to show for it.
//
// The worked example is folded away. Showing a model answer beside an empty
// box anchors everybody to it. It is one click away for anyone stuck, and
// opening it is a deliberate act rather than the default view.
//
// Nothing is gated. No minimum character count blocks the next step, no step
// is mandatory, and export works on a half-finished sheet. A student who
// wants to think about layer three on the bus should be able to leave it
// empty and print the rest. Ruled space prints where an answer is missing.
//
// Nothing is validated at them either. The word count is a quiet nudge that
// changes tone once there is enough, never a red error on work in progress.

export type BuilderField =
  | { kind: 'line'; id: string; label: string; placeholder: string }
  | { kind: 'text'; id: string; label: string; placeholder: string; enough?: number }
  | { kind: 'choice'; id: string; label: string; options: { value: string; label: string }[] };

export interface BuilderStep {
  id: string;
  /** Two or three words for the rail. */
  label: string;
  eyebrow: string;
  /** The question itself, as a headline. */
  question: string;
  /** One or two sentences on how to answer it. */
  hint: string;
  fields: BuilderField[];
  /** The worked answer from the lesson, folded away until asked for. */
  example?: { label: string; body: string };
}

export type BuilderValues = Record<string, string>;

export default function LessonBuilder({
  storageKey,
  steps,
  preview,
  toArtefact,
  privacyNote,
}: {
  /** localStorage key. Namespace it by course and activity. */
  storageKey: string;
  steps: BuilderStep[];
  /** The live sheet. Rendered beside the question on desktop, under it on a phone. */
  preview: (values: BuilderValues) => ReactNode;
  toArtefact: (values: BuilderValues) => Artefact;
  privacyNote: string;
}) {
  const empty = useMemo<BuilderValues>(() => {
    const v: BuilderValues = {};
    steps.forEach(s => s.fields.forEach(f => { v[f.id] = ''; }));
    return v;
  }, [steps]);

  const draft = useLocalDraft<BuilderValues>(storageKey, empty);
  const [at, setAt] = useState(0);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [exportState, setExportState] = useState<'idle' | 'working' | 'failed'>('idle');

  const values = draft.value;
  const step = steps[at];

  const isDone = (s: BuilderStep) => s.fields.every(f => (values[f.id] ?? '').trim().length > 0);
  const doneCount = steps.filter(isDone).length;
  const anything = Object.values(values).some(v => v.trim().length > 0);

  function setField(id: string, next: string) {
    draft.set(prev => ({ ...prev, [id]: next }));
  }

  async function save() {
    setExportState('working');
    try {
      await downloadArtefact(toArtefact(values));
      setExportState('idle');
    } catch {
      setExportState('failed');
    }
  }

  return (
    <div className="bt-build">
      <div className="bt-build__head">
        <span className="bt-build__count bt-tnum">{doneCount} of {steps.length} answered</span>
        <span className="bt-bar" aria-hidden="true">
          <i style={{ width: `${(doneCount / steps.length) * 100}%` }} />
        </span>
        <span className="bt-build__saved" aria-live="polite">
          {draft.justSaved ? 'Saved' : !draft.persisted && anything ? 'Not saved on this device' : ''}
        </span>
      </div>

      <ol className="bt-build__rail">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className={`bt-build__tab${i === at ? ' bt-build__tab--on' : ''}${isDone(s) ? ' bt-build__tab--done' : ''}`}
              aria-current={i === at}
              onClick={() => setAt(i)}
            >
              <span className="bt-build__dot" aria-hidden="true" />
              {s.label}
            </button>
          </li>
        ))}
      </ol>

      <div className="bt-build__grid">
        <div className="bt-build__work">
          <p className="bt-eyebrow">{step.eyebrow}</p>
          <h3 className="bt-build__q">{step.question}</h3>
          <p className="bt-build__hint">{step.hint}</p>

          {step.fields.map(field => {
            const value = values[field.id] ?? '';
            if (field.kind === 'choice') {
              return (
                <div key={field.id} className="bt-build__field">
                  <span className="bt-build__label">{field.label}</span>
                  <div className="bt-chiprow">
                    {field.options.map(o => (
                      <button
                        key={o.value}
                        type="button"
                        className="bt-ctxchip"
                        aria-pressed={value === o.value}
                        // Pressing the chosen option again clears it, so a
                        // student can undo a guess instead of being stuck
                        // with the first thing they tapped.
                        onClick={() => setField(field.id, value === o.value ? '' : o.value)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
            if (field.kind === 'line') {
              return (
                <div key={field.id} className="bt-build__field">
                  <label className="bt-build__label" htmlFor={`${storageKey}-${field.id}`}>{field.label}</label>
                  <input
                    id={`${storageKey}-${field.id}`}
                    className="bt-build__input"
                    type="text"
                    value={value}
                    placeholder={field.placeholder}
                    onChange={e => setField(field.id, e.target.value)}
                  />
                </div>
              );
            }
            const enough = field.enough ?? 60;
            return (
              <div key={field.id} className="bt-build__field">
                <label className="bt-build__label" htmlFor={`${storageKey}-${field.id}`}>{field.label}</label>
                <textarea
                  id={`${storageKey}-${field.id}`}
                  className="bt-build__area"
                  rows={5}
                  value={value}
                  placeholder={field.placeholder}
                  onChange={e => setField(field.id, e.target.value)}
                />
                <p className="bt-build__nudge">
                  {value.trim().length === 0
                    ? 'Plain sentences. Nobody marks this and nobody else reads it.'
                    : value.trim().length < enough
                      ? 'Keep going — a couple of sentences is usually enough.'
                      : 'That will do. Add more only if it changes the answer.'}
                </p>
              </div>
            );
          })}

          {step.example && (
            <details className="bt-build__example">
              <summary>{step.example.label}</summary>
              <p>{step.example.body}</p>
            </details>
          )}

          <div className="bt-build__nav">
            <button
              type="button"
              className="bt-btn bt-btn--tertiary bt-btn--sm"
              disabled={at === 0}
              onClick={() => setAt(a => Math.max(0, a - 1))}
            >
              Back
            </button>
            <button
              type="button"
              className="bt-btn bt-btn--sm"
              disabled={at === steps.length - 1}
              onClick={() => setAt(a => Math.min(steps.length - 1, a + 1))}
            >
              Next
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
            {at === steps.length - 1 && (
              <span className="bt-build__done">
                {doneCount === steps.length
                  ? 'All answered. Take it with you below.'
                  : 'Anything still blank prints as ruled space. That is fine.'}
              </span>
            )}
          </div>
        </div>

        <div className="bt-build__preview">
          <p className="bt-sim__label">Your page, so far</p>
          {preview(values)}
        </div>
      </div>

      <div className="bt-build__foot">
        <button type="button" className="bt-btn" disabled={!anything || exportState === 'working'} onClick={save}>
          {exportState === 'working' ? 'Building your page' : 'Take it with you'}
          <span className="bt-btn__badge" aria-hidden="true">↓</span>
        </button>

        {confirmingReset ? (
          <span className="bt-build__confirm" role="group" aria-label="Confirm starting again">
            <span>Delete everything you have written?</span>
            <button
              type="button"
              className="bt-btn bt-btn--sm bt-btn--tertiary"
              onClick={() => { draft.clear(); setAt(0); setConfirmingReset(false); }}
            >
              Yes, clear it
            </button>
            <button type="button" className="bt-btn bt-btn--sm bt-btn--tertiary" onClick={() => setConfirmingReset(false)}>
              Keep it
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="bt-btn bt-btn--sm bt-btn--tertiary"
            disabled={!anything}
            onClick={() => setConfirmingReset(true)}
          >
            Start again
          </button>
        )}

        <p className="bt-build__privacy">
          {exportState === 'failed'
            ? 'That download did not work. Try again, and tell me which browser you are on if it keeps failing.'
            : privacyNote}
        </p>
      </div>
    </div>
  );
}
