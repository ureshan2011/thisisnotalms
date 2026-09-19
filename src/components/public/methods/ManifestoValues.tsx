import { useState } from 'react';

// ─── The four values, and the half of the sentence everybody drops ────────
// The Agile Manifesto's four values are "A over B", and the closing line
// says that while there is value in the items on the right, the items on the
// left are valued more. The right-hand half is the part that disappears in
// practice, and it is where most "we're Agile so we don't do documents"
// arguments come from.
//
// So the widget makes you tip the balance yourself. Drag either way and the
// beam leans; the note underneath names what that reading costs. The
// intended reading is not the far left — it is clearly left of centre with
// the right-hand item still on the scale.

const VALUES: { left: string; right: string; note: string; far: string }[] = [
  {
    left: 'Individuals and interactions',
    right: 'processes and tools',
    note: 'A daily conversation resolves in five minutes what a workflow tool escalates for three days. The process still exists — it is just not the thing being served.',
    far: 'Drop processes and tools entirely and you get a team whose knowledge lives in whoever happened to be in the room, and no way to onboard anybody.',
  },
  {
    left: 'Working software',
    right: 'comprehensive documentation',
    note: 'Progress is measured by something that runs, not by a design document that has been approved. This is the value the cost-of-change curve pays for.',
    far: 'Read as "no documentation" and the operations team inherits a system nobody can run, the architecture lives in one contractor’s head, and the audit has nothing to look at.',
  },
  {
    left: 'Customer collaboration',
    right: 'contract negotiation',
    note: 'A customer in the room every fortnight beats a specification argued over by two legal teams. The contract still exists — it just is not the mechanism for deciding what to build.',
    far: 'With no contract at all, nobody can say what was promised, and "collaboration" becomes an unbounded obligation on whichever side has less power.',
  },
  {
    left: 'Responding to change',
    right: 'following a plan',
    note: 'A plan is a forecast, and a forecast made with new information beats one defended because it was signed. Re-planning is the work, not an admission of failure.',
    far: 'Without any plan there is no baseline, so nothing can be recognised as change — which is exactly how scope creep is not noticed until the budget is gone.',
  },
];

export default function ManifestoValues() {
  // 0 = all the way right, 50 = centre, 100 = all the way left.
  const [tilt, setTilt] = useState<number[]>(() => VALUES.map(() => 72));

  function set(i: number, v: number) {
    setTilt(prev => prev.map((x, idx) => (idx === i ? v : x)));
  }

  return (
    <div className="bt-sim">
      <p className="bt-sim__label">Four values · drag each beam</p>
      <div style={{ marginTop: 14, display: 'grid', gap: 18 }}>
        {VALUES.map((v, i) => {
          const t = tilt[i];
          const reading = t >= 90 ? 'far' : t >= 58 ? 'agile' : t >= 42 ? 'centre' : 'trad';
          return (
            // The row is capped at the beam's own width: let the beam
            // stretch to a full panel and the right-hand label ends up half a
            // screen away from the weight it names.
            <div key={v.left} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)', paddingTop: i === 0 ? 0 : 18, maxWidth: 620 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <b style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
                  {v.left}
                </b>
                <span style={{ fontSize: 12.5, color: 'var(--ink-400)' }}>over {v.right}</span>
              </div>

              {/* The beam. Its tilt is the slider's value, so the control and
                  the picture are one object rather than two. */}
              <svg viewBox="0 0 520 76" width="100%" style={{ display: 'block', marginTop: 8 }} aria-hidden="true">
                <line x1="260" y1="30" x2="260" y2="62" stroke="var(--ink-300)" strokeWidth="1.4" />
                <path d="M250 62 L270 62 L260 46 Z" fill="var(--ink-300)" />
                <g transform={`rotate(${((50 - t) / 50) * 5} 260 30)`}>
                  <line x1="54" y1="30" x2="466" y2="30" stroke="var(--ink-900)" strokeWidth="2.4" strokeLinecap="round" />
                  <circle cx="54" cy="30" r={6 + (t / 100) * 6} fill="var(--accent-500)" />
                  <circle cx="466" cy="30" r={6 + ((100 - t) / 100) * 6} fill="var(--ink-300)" />
                </g>
              </svg>

              <label className="bt-sim__label" htmlFor={`val-${i}`} style={{ display: 'block', marginTop: 4 }}>
                <span className="bt-tnum">{t}</span> / 100 toward “{v.left.toLowerCase()}”
              </label>
              <input
                id={`val-${i}`}
                type="range"
                min={0}
                max={100}
                step={2}
                value={t}
                onChange={e => set(i, Number(e.target.value))}
                style={{ width: '100%', marginTop: 8, accentColor: 'var(--accent-500)' }}
              />

              <p className="bt-chipnote" aria-live="polite">
                {reading === 'far' && <><b style={{ color: 'var(--ink-900)' }}>All the way over.</b> {v.far}</>}
                {reading === 'agile' && <><b style={{ color: 'var(--ink-900)' }}>The intended reading.</b> {v.note}</>}
                {reading === 'centre' && <><b style={{ color: 'var(--ink-900)' }}>Balanced.</b> Defensible, and not what the Manifesto says: it names a preference, not a tie.</>}
                {reading === 'trad' && <><b style={{ color: 'var(--ink-900)' }}>Tipped the other way.</b> A reasonable position for an audited or safety-critical project — and at that point you are describing Waterfall or PRINCE2, not Agile.</>}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bt-verdict" style={{ marginTop: 18 }}>
        <strong>“While there is value in the items on the right, we value the items on the left more.”</strong>
        That is the Manifesto’s own closing line, and it is the sentence most often left off the slide. Nothing on the
        right is abolished. Agile is a statement about which one wins when the two conflict — which is why an
        undocumented, uncontracted, unplanned project is not an Agile project. It is just an undisciplined one.
      </div>
    </div>
  );
}
