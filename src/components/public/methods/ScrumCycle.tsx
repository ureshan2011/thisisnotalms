import { useState } from 'react';

// ─── The Scrum framework, as one clickable object (MBI804 · Lesson 2.6) ───
// Every Scrum summary draws this diagram and then explains it in a list
// somewhere else, so the reader has to hold the two together. Here the
// diagram is the control: tap any box and the panel underneath says who is
// in it, how long it lasts and what it produces.
//
// Timeboxes are the Scrum Guide's maxima for a one-month Sprint. The
// proportional-scaling rule for shorter sprints is the next widget's job, so
// it is stated here and demonstrated there.

type Key = 'backlog' | 'planning' | 'sprintbacklog' | 'daily' | 'work' | 'review' | 'retro' | 'increment';

interface Node {
  key: Key;
  name: string;
  kind: 'Artefact' | 'Event' | 'Work';
  who: string;
  timebox: string;
  output: string;
  body: string;
  /** The thing people get wrong about it. */
  trap: string;
}

const NODES: Record<Key, Node> = {
  backlog: {
    key: 'backlog', name: 'Product Backlog', kind: 'Artefact',
    who: 'Owned by the Product Owner',
    timebox: 'Never finished',
    output: 'An ordered list',
    body: 'The single ordered list of everything that might be needed in the product. One list, one owner, and it is the only source of work for the team. It is refined continuously rather than written once — around a tenth of the team’s capacity typically goes on refinement.',
    trap: 'It is ordered, not prioritised into buckets. “High priority” with fourteen items in it is not an order, and the moment two things are equally first, somebody outside the team is choosing.',
  },
  planning: {
    key: 'planning', name: 'Sprint Planning', kind: 'Event',
    who: 'The whole Scrum Team',
    timebox: 'Max 8 hours',
    output: 'A Sprint Goal and a Sprint Backlog',
    body: 'Three questions, in order. Why is this Sprint valuable — the Product Owner proposes, and the team shapes it into a Sprint Goal. What can be done — the Developers select what they are confident of finishing. How will it be done — the Developers break the selection into tasks.',
    trap: 'Only the Developers may decide how much is taken on. A Product Owner or manager who sets the amount has converted a commitment into an instruction, and the forecast stops meaning anything.',
  },
  sprintbacklog: {
    key: 'sprintbacklog', name: 'Sprint Backlog', kind: 'Artefact',
    who: 'Owned by the Developers',
    timebox: 'Updated daily',
    output: 'The plan for this Sprint',
    body: 'The Sprint Goal, the items selected to meet it, and the plan for delivering them. It belongs to the Developers: only they change it, and they change it every day as they learn what the work actually involves.',
    trap: 'Scope may be clarified and renegotiated with the Product Owner mid-Sprint. What may not happen is somebody adding work that puts the Sprint Goal at risk — including the Product Owner.',
  },
  daily: {
    key: 'daily', name: 'Daily Scrum', kind: 'Event',
    who: 'The Developers',
    timebox: '15 minutes, every day',
    output: 'An adapted plan for the next day',
    body: 'Fifteen minutes, same time, same place, to inspect progress toward the Sprint Goal and re-plan the day. The classic three questions — what I did, what I will do, what is blocking me — are one way to run it, not a rule.',
    trap: 'It is not a status report to management, and it is not where problems get solved. Name the impediment, take the discussion offline, and the meeting stays fifteen minutes for the whole year.',
  },
  work: {
    key: 'work', name: 'The Sprint', kind: 'Work',
    who: 'The whole Scrum Team',
    timebox: '1–4 weeks, a consistent length',
    output: 'A Done Increment',
    body: 'The container for everything else. A new Sprint starts the moment the last one ends — no gap, no cool-down week. Its length stays the same from Sprint to Sprint, which is what makes velocity mean anything.',
    trap: 'Only the Product Owner can cancel a Sprint, and only when its Goal has become obsolete. It is rare, and it is not a tool for expressing dissatisfaction with progress.',
  },
  review: {
    key: 'review', name: 'Sprint Review', kind: 'Event',
    who: 'The Scrum Team and stakeholders',
    timebox: 'Max 4 hours',
    output: 'A revised Product Backlog',
    body: 'The team shows what is actually Done to the people who asked for it, and everyone works out together what should happen next. The Product Backlog is adjusted in the room, on the evidence of a working increment.',
    trap: 'Not a sign-off meeting and not a demo performance. If stakeholders do not attend, the feedback loop the whole framework is built on is missing, and the team is running a slow Waterfall with standups.',
  },
  retro: {
    key: 'retro', name: 'Sprint Retrospective', kind: 'Event',
    who: 'The Scrum Team only',
    timebox: 'Max 3 hours',
    output: 'One improvement, taken into the next Sprint',
    body: 'The team inspects how it worked rather than what it built: people, interactions, process, tools, and whether the Definition of Done is still right. The most useful improvement is added to the next Sprint Backlog so it competes for real time.',
    trap: 'Improvements that live on a separate wall-chart never happen. If it is not in the Sprint Backlog, it lost to feature work, and it will lose again next Sprint.',
  },
  increment: {
    key: 'increment', name: 'Increment', kind: 'Artefact',
    who: 'Produced by the Developers',
    timebox: 'At least one per Sprint',
    output: 'Usable product',
    body: 'A concrete stepping stone toward the Product Goal. It must be usable and meet the Definition of Done. Several increments may be created within a Sprint, and they may be released whenever the Product Owner decides — releasing is not the same as being Done.',
    trap: '“Done except for testing” is not Done. The Definition of Done is a shared quality standard, and an increment that does not meet it does not count toward the Sprint, however finished it feels.',
  },
};

const ORDER: Key[] = ['backlog', 'planning', 'sprintbacklog', 'work', 'daily', 'review', 'retro', 'increment'];

export default function ScrumCycle() {
  const [key, setKey] = useState<Key>('backlog');
  const [seen, setSeen] = useState<Set<Key>>(new Set(['backlog']));
  const n = NODES[key];

  function pick(k: Key) {
    setKey(k);
    setSeen(prev => new Set(prev).add(k));
  }

  /** A clickable group: the whole box is the button. */
  const hit = (k: Key) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-pressed': key === k,
    'aria-label': `${NODES[k].name} — ${NODES[k].kind}, ${NODES[k].timebox}`,
    style: { cursor: 'pointer' },
    onClick: () => pick(k),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); }
    },
  });

  const fill = (k: Key) => (key === k ? 'var(--accent-500)' : 'var(--accent-50)');
  const stroke = (k: Key) => (key === k ? 'var(--accent-600)' : 'var(--accent-200)');
  const ink = (k: Key) => (key === k ? '#fff' : 'var(--accent-700)');
  const sub = (k: Key) => (key === k ? 'rgba(255,255,255,0.82)' : 'var(--accent-600)');

  return (
    <div className="cc">
      <div className="cc__stage" style={{ marginTop: 0 }}>
        <div className="cc__plot">
          <div className="cc__diagram">
            <svg viewBox="0 0 700 320" width="100%" style={{ maxWidth: 740 }} role="img"
              aria-label="The Scrum framework: the Product Backlog feeds Sprint Planning, which produces the Sprint Backlog. Inside the Sprint — one to four weeks — development runs with a fifteen-minute Daily Scrum repeating each day. The Sprint ends with a Sprint Review and a Sprint Retrospective, and produces a Done Increment, after which the next Sprint begins.">

              {/* The Sprint container. Drawn first so everything inside sits
                  on top of it, and labelled on its own top edge so the boxes
                  inside keep their room. */}
              <rect x="168" y="44" width="412" height="216" rx="20" fill="var(--paper-200)" opacity="0.6" />
              <g {...hit('work')}>
                <rect x="168" y="44" width="412" height="216" rx="20" fill="transparent"
                  stroke={key === 'work' ? 'var(--accent-500)' : 'var(--border-subtle)'} strokeWidth={key === 'work' ? 2.4 : 1.4} />
                <text x="190" y="68" fontSize="11" fontWeight="800" letterSpacing="0.1em" fontFamily="var(--font-display)"
                  fill={key === 'work' ? 'var(--accent-600)' : 'var(--ink-400)'} style={{ pointerEvents: 'none' }}>
                  THE SPRINT · 1–4 WEEKS
                </text>
              </g>

              {/* Product Backlog */}
              <g {...hit('backlog')}>
                <rect x="14" y="96" width="126" height="80" rx="14" fill={fill('backlog')} stroke={stroke('backlog')} strokeWidth="1.4" />
                <text x="77" y="128" textAnchor="middle" fontSize="12.5" fontWeight="800" fontFamily="var(--font-display)" fill={ink('backlog')} style={{ pointerEvents: 'none' }}>Product</text>
                <text x="77" y="145" textAnchor="middle" fontSize="12.5" fontWeight="800" fontFamily="var(--font-display)" fill={ink('backlog')} style={{ pointerEvents: 'none' }}>Backlog</text>
                <text x="77" y="162" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('backlog')} style={{ pointerEvents: 'none' }}>ordered, never finished</text>
              </g>
              <path d="M140 136 L154 136 L154 107 L182 107" fill="none" stroke="var(--ink-300)" strokeWidth="1.4" />
              <path d="M182 102 L190 107 L182 112 Z" fill="var(--ink-300)" />

              {/* Sprint Planning */}
              <g {...hit('planning')}>
                <rect x="190" y="76" width="110" height="62" rx="13" fill={fill('planning')} stroke={stroke('planning')} strokeWidth="1.4" />
                <text x="245" y="100" textAnchor="middle" fontSize="11.5" fontWeight="800" fontFamily="var(--font-display)" fill={ink('planning')} style={{ pointerEvents: 'none' }}>Sprint Planning</text>
                <text x="245" y="115" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('planning')} style={{ pointerEvents: 'none' }}>max 8 hrs</text>
                <text x="245" y="128" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('planning')} style={{ pointerEvents: 'none' }}>why · what · how</text>
              </g>
              <path d="M245 138 L245 152" stroke="var(--ink-300)" strokeWidth="1.4" />
              <path d="M240 152 L245 160 L250 152 Z" fill="var(--ink-300)" />

              {/* Sprint Backlog */}
              <g {...hit('sprintbacklog')}>
                <rect x="190" y="160" width="110" height="62" rx="13" fill={fill('sprintbacklog')} stroke={stroke('sprintbacklog')} strokeWidth="1.4" />
                <text x="245" y="186" textAnchor="middle" fontSize="11.5" fontWeight="800" fontFamily="var(--font-display)" fill={ink('sprintbacklog')} style={{ pointerEvents: 'none' }}>Sprint Backlog</text>
                <text x="245" y="202" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('sprintbacklog')} style={{ pointerEvents: 'none' }}>the Developers’ plan</text>
              </g>
              <path d="M300 191 L318 191 L318 150 L334 150" fill="none" stroke="var(--ink-300)" strokeWidth="1.4" />
              <path d="M334 145 L342 150 L334 155 Z" fill="var(--ink-300)" />

              {/* Daily Scrum, with the ring that makes it a repeat rather
                  than a meeting. The ring sits at r=58, clear of the boxes
                  on either side, with its gap at the top. */}
              <path d="M419 100 A58 58 0 1 1 361 100" fill="none" stroke="var(--ink-300)" strokeWidth="1.3" strokeDasharray="4 4" />
              <path d="M355 96 L363 104 L353 106 Z" fill="var(--ink-300)" />
              <g {...hit('daily')}>
                <circle cx="390" cy="150" r="46" fill={fill('daily')} stroke={stroke('daily')} strokeWidth="1.4" />
                <text x="390" y="144" textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="var(--font-display)" fill={ink('daily')} style={{ pointerEvents: 'none' }}>Daily</text>
                <text x="390" y="159" textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="var(--font-display)" fill={ink('daily')} style={{ pointerEvents: 'none' }}>Scrum</text>
                <text x="390" y="174" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('daily')} style={{ pointerEvents: 'none' }}>15 min</text>
              </g>
              <text x="390" y="230" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">development work, every day</text>

              {/* Review and Retrospective */}
              <path d="M436 150 L452 150 M452 107 L452 191 M452 107 L462 107 M452 191 L462 191" fill="none" stroke="var(--ink-300)" strokeWidth="1.4" />
              <path d="M462 102 L470 107 L462 112 Z" fill="var(--ink-300)" />
              <path d="M462 186 L470 191 L462 196 Z" fill="var(--ink-300)" />
              <g {...hit('review')}>
                <rect x="468" y="78" width="104" height="58" rx="13" fill={fill('review')} stroke={stroke('review')} strokeWidth="1.4" />
                <text x="520" y="102" textAnchor="middle" fontSize="11.5" fontWeight="800" fontFamily="var(--font-display)" fill={ink('review')} style={{ pointerEvents: 'none' }}>Sprint Review</text>
                <text x="520" y="118" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('review')} style={{ pointerEvents: 'none' }}>max 4 hrs · stakeholders</text>
              </g>
              <g {...hit('retro')}>
                <rect x="468" y="162" width="104" height="58" rx="13" fill={fill('retro')} stroke={stroke('retro')} strokeWidth="1.4" />
                <text x="520" y="186" textAnchor="middle" fontSize="11.5" fontWeight="800" fontFamily="var(--font-display)" fill={ink('retro')} style={{ pointerEvents: 'none' }}>Retrospective</text>
                <text x="520" y="202" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('retro')} style={{ pointerEvents: 'none' }}>max 3 hrs · team only</text>
              </g>

              {/* Increment */}
              <path d="M580 152 L596 152" stroke="var(--ink-300)" strokeWidth="1.4" />
              <path d="M596 147 L604 152 L596 157 Z" fill="var(--ink-300)" />
              <g {...hit('increment')}>
                <rect x="604" y="118" width="86" height="68" rx="14" fill={fill('increment')} stroke={stroke('increment')} strokeWidth="1.4" />
                <text x="647" y="146" textAnchor="middle" fontSize="12.5" fontWeight="800" fontFamily="var(--font-display)" fill={ink('increment')} style={{ pointerEvents: 'none' }}>Increment</text>
                <text x="647" y="162" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('increment')} style={{ pointerEvents: 'none' }}>usable · meets</text>
                <text x="647" y="174" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill={sub('increment')} style={{ pointerEvents: 'none' }}>the DoD</text>
              </g>

              {/* The next Sprint starts immediately: the loop runs under the
                  Sprint container rather than through it. */}
              <path d="M647 190 C 647 292, 77 298, 77 186" fill="none" stroke="var(--ink-300)" strokeWidth="1.3" strokeDasharray="4 5" />
              <path d="M71 186 L77 176 L83 186 Z" fill="var(--ink-300)" />
              <text x="360" y="314" textAnchor="middle" fontSize="10" fontFamily="var(--font-body)" fill="var(--ink-400)">
                the next Sprint starts the moment this one ends — there is no gap in the framework
              </text>
            </svg>
          </div>
          <p className="cc__caption">Tap any part of the diagram · {seen.size} of 8 opened</p>
        </div>
      </div>

      <p className="cc__asking" aria-live="polite">
        <span>{n.kind}</span> {n.name}
      </p>

      <div className="bt-pairgrid bt-pairgrid--three">
        <div className="bt-card">
          <h4>Who</h4>
          <p>{n.who}</p>
        </div>
        <div className="bt-card">
          <h4>How long</h4>
          <p>{n.timebox}</p>
        </div>
        <div className="bt-card">
          <h4>What it produces</h4>
          <p>{n.output}</p>
        </div>
      </div>

      <div className="cc__verdict" style={{ marginTop: 14 }} aria-live="polite">
        <p className="cc__stamp">What it is</p>
        <p>{n.body}</p>
      </div>

      <div className="bt-verdict bt-verdict--bad" style={{ marginTop: 12 }} aria-live="polite">
        <strong>The part teams get wrong</strong>
        {n.trap}
      </div>

      <p className="cc__tally">
        <span className="bt-tnum">{seen.size}</span> of {ORDER.length} opened. Every timebox here is a maximum for a
        one-month Sprint, and every one of them is part of the framework rather than a suggestion.
      </p>
    </div>
  );
}
