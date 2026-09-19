import { useState } from 'react';

// ─── Agile is a family name (MBI804 · Lesson 2.5) ─────────────────────────
// "Agile" is not a methodology. It is a set of values with a dozen
// frameworks underneath it, and students routinely use the word to mean
// Scrum specifically — which is why the next section can be about Scrum
// only once this one has been seen.
//
// One fan diagram, seven branches, and one short card each. Deliberately
// shallow: the point is recognition and a sense of the spread, not coverage.
// Scrum is the exception, and gets its own section rather than a longer card
// here.
//
// The adoption figure is the 17th State of Agile Report, also cited in the
// gated Agile Scrum deck this course already uses.

type Key = 'scrum' | 'xp' | 'kanban' | 'crystal' | 'lean' | 'fdd' | 'dsdm';

interface Member {
  key: Key;
  label: string;
  /** Two letters for the leaf itself. */
  initials: string;
  /** The name as the leaf carries it, broken into at most two short lines —
   *  the full label runs wider than a leaf's share of the fan and would be
   *  written over its neighbours. */
  leaf: [string, string];
  origin: string;
  /** One sentence: what it is. */
  what: string;
  /** The one idea it contributed that the others borrowed. */
  idea: string;
  /** Where it turns up. */
  where: string;
  /** Rough share of Agile teams using it, for the bar. */
  share: number;
  shareNote: string;
}

const MEMBERS: Member[] = [
  {
    key: 'scrum',
    initials: 'Sc',
    leaf: ['Scrum', ''],
    label: 'Scrum',
    origin: 'Schwaber & Sutherland, 1995',
    what: 'A lightweight framework of three accountabilities, three artefacts and five timeboxed events, repeating in sprints of one to four weeks.',
    idea: 'The timebox. A sprint is a fixed length that the work is fitted into, rather than a length that expands to fit the work.',
    where: 'The default in commercial software, and the one you are most likely to be interviewed about.',
    share: 87,
    shareNote: '87% of Agile teams use Scrum or a Scrum hybrid — 17th State of Agile Report.',
  },
  {
    key: 'xp',
    initials: 'XP',
    leaf: ['Extreme', 'Programming'],
    label: 'Extreme Programming',
    origin: 'Kent Beck, 1996',
    what: 'An engineering-practice framework: pair programming, test-driven development, continuous integration, collective code ownership, small releases and an on-site customer.',
    idea: 'Technical discipline is not separate from agility. If changing the code is expensive, no amount of ceremony makes a team able to respond to change.',
    where: 'Rarely adopted whole, borrowed from constantly. Most of what a modern team calls "good practice" — CI, TDD, code review — came out of XP.',
    share: 11,
    shareNote: 'Adopted whole by around one in ten teams, and its practices by far more than that.',
  },
  {
    key: 'kanban',
    initials: 'Kb',
    leaf: ['Kanban', ''],
    label: 'Kanban',
    origin: 'From Toyota, via David Anderson, 2010',
    what: 'A flow method: visualise the work, limit work in progress, measure how long things actually take, and improve from that measurement.',
    idea: 'Limit work in progress. A team with eight things started and none finished is slower than a team with two, and the board makes that visible.',
    where: 'Support, operations, BAU and anywhere work arrives continuously instead of in planned batches. Often run alongside Scrum as "Scrumban".',
    share: 56,
    shareNote: 'Used by over half of Agile teams, usually in combination with something else.',
  },
  {
    key: 'crystal',
    initials: 'Cr',
    leaf: ['Crystal', ''],
    label: 'Crystal',
    origin: 'Alistair Cockburn, 1990s',
    what: 'A family of methods rather than one — Crystal Clear, Yellow, Orange, Red — sized by how many people are involved and how much damage a defect would do.',
    idea: 'Process weight should scale with team size and criticality. A four-person team and a forty-person safety-critical team should not run the same method, and saying so out loud was Crystal’s contribution.',
    where: 'Seldom named in job listings, and the origin of the tailoring instinct every other framework now claims.',
    share: 2,
    shareNote: 'Rarely adopted by name; its argument about tailoring is everywhere.',
  },
  {
    key: 'lean',
    initials: 'Ln',
    leaf: ['Lean', ''],
    label: 'Lean software development',
    origin: 'Mary & Tom Poppendieck, 2003',
    what: 'Seven principles carried over from lean manufacturing: eliminate waste, build quality in, create knowledge, defer commitment, deliver fast, respect people, optimise the whole.',
    idea: 'Waste is anything the customer would not pay for — including half-finished work, handovers and waiting. Optimise the whole system, not each department’s local efficiency.',
    where: 'Underneath Kanban, and behind most arguments about flow, batch size and cycle time.',
    share: 17,
    shareNote: 'Named by around one team in six, and absorbed into how most of the others talk.',
  },
  {
    key: 'fdd',
    initials: 'FD',
    leaf: ['Feature-', 'Driven'],
    label: 'Feature-Driven Development',
    origin: 'Jeff De Luca, 1997',
    what: 'Build a model of the domain, list the features, then plan, design and build by feature — in short cycles, with named owners for each class of the model.',
    idea: 'Scale through a shared domain model and individual ownership, which is why it survives on larger teams where collective ownership gets noisy.',
    where: 'Larger enterprise builds, often where a strong domain model already exists.',
    share: 4,
    shareNote: 'A small share by name, and the ancestor of feature-team structures used much more widely.',
  },
  {
    key: 'dsdm',
    initials: 'DS',
    leaf: ['DSDM', ''],
    label: 'DSDM / AgilePF',
    origin: 'UK consortium, 1994',
    what: 'A full project framework with roles, phases and governance, built around fixing time and cost and letting features vary — MoSCoW prioritisation comes from here.',
    idea: 'Fix time and cost, flex the features. It is the constraint triangle answered the other way round from a fixed-scope contract, and written into the method.',
    where: 'Governed environments and the public sector, and the framework that sits most comfortably beside PRINCE2.',
    share: 5,
    shareNote: 'Small by headcount, disproportionately present where governance is heavy.',
  },
];

const CX = 280;
const TOP = 34;

export default function AgileFamily() {
  const [key, setKey] = useState<Key>('scrum');
  const m = MEMBERS.find(x => x.key === key)!;

  // A fan: one trunk at the Manifesto, seven branches spreading to a row of
  // leaves. Each leaf is the button, so the drawing is the control.
  const n = MEMBERS.length;
  const spread = 486;
  const leafY = 150;
  const leafW = spread / n;

  return (
    <div className="cc">
      <div className="cc__stage" style={{ marginTop: 0 }}>
        <div className="cc__plot">
          <div className="cc__diagram">
            <svg viewBox="0 0 560 208" width="100%" role="img"
              aria-label={`The Agile family: the Agile Manifesto at the top branching to seven frameworks — ${MEMBERS.map(x => x.label).join(', ')}. Currently showing ${m.label}.`}>
              <rect x={CX - 96} y={TOP - 22} width="192" height="32" rx="16" fill="var(--ink-900)" />
              <text x={CX} y={TOP - 1} textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="var(--font-display)" fill="#fff">Agile Manifesto, 2001</text>
              <text x={CX} y={TOP + 26} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">four values, twelve principles — and no instructions</text>

              {MEMBERS.map((x, i) => {
                const lx = 37 + i * leafW + leafW / 2;
                const on = x.key === key;
                return (
                  <g key={x.key}
                    role="button"
                    tabIndex={0}
                    aria-pressed={on}
                    aria-label={`${x.label} — ${x.origin}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setKey(x.key)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setKey(x.key); } }}
                  >
                    {/* The hit area. A bare <g> is not clickable where it
                        has nothing painted, so the whole leaf — circle and
                        both label lines — sits behind one transparent
                        rectangle, which also makes it a thumb-sized target
                        rather than a 24px dot. */}
                    <rect x={lx - leafW / 2} y={leafY - 20} width={leafW} height="66" fill="transparent" />
                    <path d={`M${CX} ${TOP + 34} C ${CX} ${leafY - 26}, ${lx} ${TOP + 62}, ${lx} ${leafY - 18}`}
                      fill="none" stroke={on ? 'var(--accent-500)' : 'var(--border-subtle)'} strokeWidth={on ? 2.2 : 1.2}
                      style={{ pointerEvents: 'none' }} />
                    <circle cx={lx} cy={leafY} r={on ? 15 : 12}
                      fill={on ? 'var(--accent-500)' : 'var(--paper-200)'}
                      stroke={on ? 'var(--accent-600)' : 'var(--border-subtle)'} strokeWidth="1.2"
                      style={{ pointerEvents: 'none' }} />
                    <text x={lx} y={leafY + 4} textAnchor="middle" fontSize="10.5" fontWeight="800"
                      fontFamily="var(--font-display)" fill={on ? '#fff' : 'var(--ink-400)'} style={{ pointerEvents: 'none' }}>
                      {x.initials}
                    </text>
                    {x.leaf.filter(Boolean).map((line, li) => (
                      <text key={line} x={lx} y={leafY + 28 + li * 11} textAnchor="middle" fontSize="9"
                        fontFamily="var(--font-body)" fill={on ? 'var(--ink-900)' : 'var(--ink-400)'} style={{ pointerEvents: 'none' }}>
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="cc__caption">Tap any branch · none of these is “Agile”, and all of them are</p>
        </div>
      </div>

      <p className="cc__asking" aria-live="polite">
        <span>{m.origin}</span> {m.what}
      </p>

      <div className="bt-pairgrid">
        <div className="bt-card">
          <h4>The idea it contributed</h4>
          <p>{m.idea}</p>
        </div>
        <div className="bt-card">
          <h4>Where you meet it</h4>
          <p>{m.where}</p>
        </div>
      </div>

      <div className="bt-meter" style={{ marginTop: 16 }}>
        <div className="bt-meter__head">
          <span className="bt-meter__name">{m.label} · share of Agile teams</span>
          <span className="bt-meter__val bt-tnum">{m.share}%</span>
        </div>
        <span className="bt-bar" aria-hidden="true"><i style={{ width: `${m.share}%` }} /></span>
        <p className="bt-meter__note">
          {m.shareNote} Shares add to well over a hundred because most teams run more than one. Only Scrum’s figure
          is quoted from the report; the rest are indicative orders of magnitude, not measured shares.
        </p>
      </div>

      <p className="cc__tally">
        Only one of these gets a full section in this lesson, and it is the one on the left of the fan. That is a
        statement about what you are likely to walk into, not about which framework is best.
      </p>
    </div>
  );
}
