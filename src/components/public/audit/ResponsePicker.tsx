import { useState } from 'react';

// ─── Avoid, mitigate, transfer, accept (MBI804 · peer audit activity) ─────
// The Corrective Action Plan asks for a top risk with a named response
// strategy, and "mitigate" is what almost everybody writes for almost
// everything — it sounds responsible and commits to nothing.
//
// Four risks from the practice scenario, four responses, and a verdict on
// every one of the sixteen pairings. The teaching is in the pattern rather
// than in any single cell: the right response follows from the size of the
// consequence and from who is best placed to carry it, and for one of these
// four risks mitigating is actively the wrong answer.

type Resp = 'avoid' | 'mitigate' | 'transfer' | 'accept';

const RESPONSES: { key: Resp; label: string; gloss: string }[] = [
  { key: 'avoid', label: 'Avoid', gloss: 'Change the plan so the risk cannot occur' },
  { key: 'mitigate', label: 'Mitigate', gloss: 'Reduce how likely it is, or how much it costs' },
  { key: 'transfer', label: 'Transfer', gloss: 'Move the consequence to somebody better placed, for a premium' },
  { key: 'accept', label: 'Accept', gloss: 'Take it knowingly, with a reserve behind it' },
];

interface Risk {
  key: string;
  label: string;
  full: string;
  best: Resp;
  verdicts: Record<Resp, string>;
}

const RISKS: Risk[] = [
  {
    key: 'admin',
    label: 'One admin',
    full: 'Only one person at the clinic holds the rights the project needs, and he takes leave mid-project.',
    best: 'mitigate',
    verdicts: {
      avoid: 'You would have to design the project so it never needs clinic-side rights at all, which means never deploying to their network. Avoidance is real but it removes the project along with the risk.',
      mitigate: 'Right, and it is cheap: have a second person named with the same rights at kick-off, and ask for the change in week one rather than week nine. This is what the author of the scenario correctly identified.',
      transfer: 'Transfer moves a consequence to somebody better placed to carry it, usually contractually. There is nobody to move this one to — the rights belong to the clinic, and so does the person.',
      accept: 'Defensible if nothing waits on it, and on this project nothing did. It is the response that should have been taken deliberately rather than by default, which is the difference between an accepted risk and an ignored one.',
    },
  },
  {
    key: 'access',
    label: 'No path for a patient',
    full: 'A patient who cannot use a touchscreen — low vision, tremor, no English — has no way to sign in once the paper sheet goes.',
    best: 'avoid',
    verdicts: {
      avoid: 'Right, and it is the one risk here where mitigating is the wrong answer. The consequence is that somebody does not get seen at a health clinic. You do not reduce the likelihood of that — you design it out: a staffed path that never depends on the kiosk, in place before the paper sheet is removed.',
      mitigate: 'The instinct, and it is wrong here. Mitigation leaves a residual likelihood, and the residue in this case is a patient turned away. When the consequence is somebody’s access to care, reducing the odds is not a plan.',
      transfer: 'There is nobody to transfer it to. Insurance does not cover a patient who did not get seen, and the clinic cannot contract away its duty to the people who walk in.',
      accept: 'Accepting means writing down that some patients will not be able to sign in and going ahead anyway. If that is genuinely the decision, it belongs in front of the clinic manager in writing — which is exactly what did not happen.',
    },
  },
  {
    key: 'wifi',
    label: 'Network drops',
    full: 'The clinic’s network is occasionally unavailable for a few minutes at a time.',
    best: 'mitigate',
    verdicts: {
      avoid: 'Avoiding means never depending on the network — an entirely offline kiosk. Possible, and it trades a small operational risk for a much larger one about where patient data lives.',
      mitigate: 'Right. Cache locally, queue, and sync when the connection returns, so a few minutes of downtime is invisible to the person standing at the kiosk. Cheap, proportionate, and the thing the scenario never tested.',
      transfer: 'A service-level agreement with the network provider moves some of the cost of an outage, and moves none of the experience of standing in front of a frozen kiosk.',
      accept: 'Reasonable for a few minutes a month in a low-stakes setting, and it is what this project did by default — without ever testing what the kiosk does when the network goes, which is acceptance in name only.',
    },
  },
  {
    key: 'theft',
    label: 'Tablet stolen',
    full: 'The kiosk tablet is mounted in a public waiting room overnight.',
    best: 'transfer',
    verdicts: {
      avoid: 'Taking the tablet in every night avoids the theft and creates a daily task somebody will eventually forget, which is how an avoided risk quietly becomes an accepted one.',
      mitigate: 'A physical mount and a locked cabinet genuinely reduce this, and are worth doing. They do not cover the replacement cost, which is what the strongest answer adds.',
      transfer: 'Right for the asset: insurance or a leased-device agreement moves the replacement cost to somebody who prices that risk for a living. Worth stating plainly that this transfers the hardware and not the patient data on it — that half stays yours, and needs mitigating.',
      accept: 'Fine for a cheap device with nothing on it. Less fine once it is the only way anybody signs in, and the point at which you would notice is the morning it is gone.',
    },
  },
];

export default function ResponsePicker() {
  const [risk, setRisk] = useState(0);
  const [resp, setResp] = useState<Resp | null>(null);

  const r = RISKS[risk];

  return (
    <div className="cc">
      <div className="cc__bar">
        <div className="cc__group">
          <span className="cc__label">The risk</span>
          <div className="cc__pills">
            {RISKS.map((x, i) => (
              <button key={x.key} type="button" className="cc__pill" aria-pressed={risk === i} onClick={() => { setRisk(i); setResp(null); }}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="cc__asking"><span>Risk</span> {r.full}</p>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
        {RESPONSES.map(x => {
          const isBest = x.key === r.best;
          const picked = resp === x.key;
          // See AuditWalkthrough: a light reveal tint has to restate the
          // label colour, or the pressed-state rule leaves it white.
          const tint = !resp
            ? null
            : isBest
              ? { bg: 'var(--green-50)', border: 'rgba(47, 163, 107, 0.34)', ink: '#186845' }
              : picked
                ? { bg: 'var(--red-50)', border: 'rgba(217, 58, 43, 0.28)', ink: '#8f2318' }
                : null;
          return (
            <button
              key={x.key}
              type="button"
              className="bt-sim__choice"
              aria-pressed={picked}
              onClick={() => setResp(x.key)}
              style={tint ? { background: tint.bg, borderColor: tint.border } : undefined}
            >
              <b style={tint ? { color: tint.ink } : undefined}>{x.label}{resp && isBest ? ' ✓' : ''}</b>
              <span style={tint ? { color: tint.ink, opacity: 0.85 } : undefined}>{x.gloss}</span>
            </button>
          );
        })}
      </div>

      {resp && (
        <div className={`cc__verdict cc__verdict--${resp === r.best ? 'good' : 'bad'}`} style={{ marginTop: 16 }} aria-live="polite">
          <p className="cc__stamp">{RESPONSES.find(x => x.key === resp)!.label}</p>
          <p>{r.verdicts[resp]}</p>
        </div>
      )}

      <p className="cc__tally">
        Three of these four are best answered by mitigating or transferring. One is not, and it is the one where the
        consequence lands on a person rather than on a schedule or a budget — which is the test worth carrying into
        your own Corrective Action Plan.
      </p>
    </div>
  );
}
