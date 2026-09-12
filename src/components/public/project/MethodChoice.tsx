import { useState } from 'react';

// ─── Which methodology suits which project? (MBI804, LO1) ─────────────────
// Four project shapes, three methodologies, every one of the twelve cells
// filled in. Pick a project and a method and the widget says whether that
// pairing fits, works at a cost, or sets the project up to fail.
//
// The lesson is the grid itself: no methodology is good or bad on its own,
// only fit or unfit for a project's attributes. That sentence is LO1, and
// the course's 60% case study is marked on the argument rather than on which
// method a student lands on.
//
// It reuses the picker/stage/verdict widget styles in blend.css (the `cc-`
// block, first built for MBI806B's chart chooser) so the two behave
// identically, and the accent comes from whichever course page hosts it.

type ProjectKey = 'client' | 'regulated' | 'public' | 'unknown';
type MethodKey = 'agile' | 'waterfall' | 'prince2';
type Verdict = 'good' | 'ok' | 'bad';

const PROJECTS: { key: ProjectKey; label: string; full: string; attrs: [string, string][] }[] = [
  {
    key: 'client',
    label: 'A client integration',
    full: 'A payment gateway integration for one retail client, who will change their mind once they see it working.',
    attrs: [
      ['Requirements', 'will move'],
      ['Customer', 'available weekly'],
      ['Governance', 'one account manager'],
    ],
  },
  {
    key: 'regulated',
    label: 'A regulated migration',
    full: 'A hospital records migration under external audit, with every requirement fixed in a signed specification.',
    attrs: [
      ['Requirements', 'fixed and signed'],
      ['Customer', 'sign-off only'],
      ['Governance', 'external auditor'],
    ],
  },
  {
    key: 'public',
    label: 'A public platform',
    full: 'A multi-agency government platform, funded from public money, with a business case re-justified before each stage.',
    attrs: [
      ['Requirements', 'negotiated between agencies'],
      ['Customer', 'a project board'],
      ['Governance', 'stage funding gates'],
    ],
  },
  {
    key: 'unknown',
    label: 'A new product',
    full: 'A new internal analytics product, where nobody can yet say what it should do.',
    attrs: [
      ['Requirements', 'unknown'],
      ['Customer', 'colleagues down the hall'],
      ['Governance', 'a department budget'],
    ],
  },
];

const METHODS: { key: MethodKey; label: string; shows: string }[] = [
  { key: 'agile', label: 'Agile (Scrum)', shows: 'Repeating sprints, each ending in a usable increment' },
  { key: 'waterfall', label: 'Waterfall', shows: 'Sequential phases, one release at the end' },
  { key: 'prince2', label: 'PRINCE2', shows: 'Management by stages, with a board decision at each boundary' },
];

const VERDICTS: Record<ProjectKey, Record<MethodKey, { v: Verdict; why: string }>> = {
  client: {
    agile: {
      v: 'good',
      why: 'Requirements that move as the client sees the product working is the case Scrum was built for. Short sprints, a review the client attends, and a backlog they help re-order. Changing their mind stops being a crisis, because the framework already has a place to put it.',
    },
    waterfall: {
      v: 'bad',
      why: 'A signed specification for requirements that have not settled. Every change becomes a variation request, the relationship turns contractual, and what finally ships is what the client wanted six months ago rather than what they want now.',
    },
    prince2: {
      v: 'ok',
      why: 'The governance is sound and the stage boundaries would force useful conversations, but this is one integration for one client. PRINCE2 wrapped around an Agile delivery is a real and common combination — on a project this size it is more process than the work can pay for.',
    },
  },
  regulated: {
    agile: {
      v: 'bad',
      why: 'An emerging scope is the one thing this project must not have: the requirements are signed, and an auditor needs each one traced to the evidence it was met. A backlog that reprioritises every fortnight is the opposite of that. Individual Agile practices — automated regression tests, incremental cutover — are still worth stealing. The framework is not the fit.',
    },
    waterfall: {
      v: 'good',
      why: 'Fixed scope, a signed specification and an auditor who wants to trace each requirement to the test that proves it. Sequential phases with formal sign-off produce exactly that paper trail, and there is nothing to gain from re-deciding scope every two weeks.',
    },
    prince2: {
      v: 'ok',
      why: 'Strong on the governance an audit wants: defined roles, stage assurance, documented exceptions. But PRINCE2 is a management method, not a delivery method — it never says how the build is sequenced. Choose it here and you still have to choose Waterfall underneath it.',
    },
  },
  public: {
    agile: {
      v: 'ok',
      why: 'Increments and early feedback are genuinely valuable when several agencies have to be satisfied. What Scrum does not supply is the funding gate: a board that re-justifies the business case before each stage has no ceremony in the framework to do it at. Teams solve this by running Scrum inside a staged governance wrapper.',
    },
    waterfall: {
      v: 'bad',
      why: 'One long sequence, with the whole business case justified once at the beginning. Public-money projects that fail this way are a genre: the requirements were right in year one, the world moved, and there was no boundary at which stopping was one of the options.',
    },
    prince2: {
      v: 'good',
      why: 'What PRINCE2 exists for. A defined project board, management by stages with a go/no-go decision at each boundary, continued business justification as an explicit principle, and management by exception so the board is only pulled in when tolerances are actually breached.',
    },
  },
  unknown: {
    agile: {
      v: 'good',
      why: 'Nobody can specify what they cannot yet describe. Build the smallest useful slice, show it to the people who asked, and let what you learn re-order the backlog. The first two ideas being wrong is the expected path here, not a planning failure.',
    },
    waterfall: {
      v: 'bad',
      why: 'A specification written before anybody knows what the product should do is fiction with a signature on it. Every later phase inherits the error, and it surfaces during testing — the most expensive place in the whole sequence to find it.',
    },
    prince2: {
      v: 'ok',
      why: 'Staged funding is a reasonable answer to genuine uncertainty: commit a little, review, commit again. But PRINCE2 manages the project without saying how the work gets done, so an exploratory build still needs an Agile delivery running inside the stages.',
    },
  },
};

const VERDICT_LABEL: Record<Verdict, string> = {
  good: 'Fits',
  ok: 'Works, at a cost',
  bad: 'Sets it up to fail',
};

const W = 560;
const H = 190;

/** Sequential phases, one release, no way back. */
function WaterfallShape() {
  const phases = ['Requirements', 'Design', 'Build', 'Test', 'Deploy'];
  const boxW = 96;
  const gap = 10;
  const stepY = 20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="Waterfall: five phases running left to right and stepping downward — requirements, design, build, test, deploy — with a single release at the end.">
      {phases.map((p, i) => {
        const x = 14 + i * (boxW + gap);
        const y = 24 + i * stepY;
        return (
          <g key={p}>
            <rect x={x} y={y} width={boxW} height="34" rx="9" fill="var(--accent-50)" stroke="var(--accent-200)" />
            <text x={x + boxW / 2} y={y + 22} textAnchor="middle" fontSize="11" fill="var(--accent-700)" fontFamily="var(--font-body)">{p}</text>
            {i < phases.length - 1 && (
              <path d={`M${x + boxW} ${y + 17} L${x + boxW + gap} ${y + 17} L${x + boxW + gap} ${y + stepY + 17}`}
                fill="none" stroke="var(--ink-300)" strokeWidth="1.2" />
            )}
          </g>
        );
      })}
      <circle cx="532" cy="141" r="11" fill="var(--accent-500)" />
      <text x="532" y="145" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="var(--font-display)">1</text>
      <text x="532" y="170" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">release</text>
    </svg>
  );
}

/** Repeating sprints, an increment out of each one. */
function AgileShape() {
  const sprints = [1, 2, 3, 4];
  const boxW = 112;
  const gap = 28;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="Agile: four two-week sprints in a row, each producing a shippable increment, with a daily fifteen-minute scrum inside every sprint.">
      <text x="14" y="24" fontSize="10" letterSpacing="1.3" fill="var(--ink-400)" fontFamily="var(--font-body)">BACKLOG, RE-ORDERED EVERY SPRINT</text>
      <rect x="14" y="34" width="518" height="10" rx="5" fill="var(--accent-100)" />
      {sprints.map((s, i) => {
        const x = 14 + i * (boxW + gap);
        return (
          <g key={s}>
            <rect x={x} y="62" width={boxW} height="56" rx="12" fill="var(--accent-50)" stroke="var(--accent-200)" />
            <text x={x + boxW / 2} y="84" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--accent-700)" fontFamily="var(--font-display)">{`Sprint ${s}`}</text>
            <text x={x + boxW / 2} y="101" textAnchor="middle" fontSize="10" fill="var(--accent-600)" fontFamily="var(--font-body)">2 weeks · daily 15 min</text>
            <line x1={x + boxW / 2} y1="118" x2={x + boxW / 2} y2="132" stroke="var(--ink-300)" strokeWidth="1.2" />
            <circle cx={x + boxW / 2} cy="143" r="11" fill="var(--accent-500)" />
            <text x={x + boxW / 2} y="147" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="var(--font-display)">{s}</text>
            <text x={x + boxW / 2} y="170" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">increment</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Stages, with a board decision at every boundary. */
function Prince2Shape() {
  const stages = ['Initiation', 'Stage 1', 'Stage 2', 'Closure'];
  const boxW = 102;
  const gap = 40;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="PRINCE2: four stages separated by decision points, where the project board re-justifies the business case before funding the next stage.">
      <text x="14" y="24" fontSize="10" letterSpacing="1.3" fill="var(--ink-400)" fontFamily="var(--font-body)">PROJECT BOARD</text>
      <rect x="14" y="32" width="518" height="12" rx="6" fill="var(--accent-100)" />
      {stages.map((s, i) => {
        const x = 14 + i * (boxW + gap);
        return (
          <g key={s}>
            <rect x={x} y="74" width={boxW} height="46" rx="12" fill="var(--accent-50)" stroke="var(--accent-200)" />
            <text x={x + boxW / 2} y="102" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--accent-700)" fontFamily="var(--font-display)">{s}</text>
            <line x1={x + boxW / 2} y1="44" x2={x + boxW / 2} y2="72" stroke="var(--ink-300)" strokeWidth="1" strokeDasharray="3 4" />
            {i < stages.length - 1 && (
              <g>
                <path d={`M${x + boxW + gap / 2} 82 L${x + boxW + gap / 2 + 14} 97 L${x + boxW + gap / 2} 112 L${x + boxW + gap / 2 - 14} 97 Z`}
                  fill="var(--accent-500)" />
                <text x={x + boxW + gap / 2} y="138" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-body)">go /</text>
                <text x={x + boxW + gap / 2} y="149" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-body)">no-go</text>
              </g>
            )}
          </g>
        );
      })}
      <text x="273" y="176" textAnchor="middle" fontSize="10" fill="var(--ink-400)" fontFamily="var(--font-body)">the business case is re-justified at every boundary</text>
    </svg>
  );
}

export default function MethodChoice() {
  const [project, setProject] = useState<ProjectKey>('client');
  const [method, setMethod] = useState<MethodKey>('agile');
  const [seen, setSeen] = useState<Set<string>>(new Set(['client:agile']));

  const verdict = VERDICTS[project][method];
  const p = PROJECTS.find(x => x.key === project)!;
  const m = METHODS.find(x => x.key === method)!;

  function pick(nextP: ProjectKey, nextM: MethodKey) {
    setProject(nextP);
    setMethod(nextM);
    setSeen(prev => new Set(prev).add(`${nextP}:${nextM}`));
  }

  return (
    <div className="cc">
      <div className="cc__bar">
        <div className="cc__group">
          <span className="cc__label">The project</span>
          <div className="cc__pills">
            {PROJECTS.map(x => (
              <button key={x.key} type="button" className="cc__pill" aria-pressed={project === x.key} onClick={() => pick(x.key, method)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className="cc__group">
          <span className="cc__label">The methodology</span>
          <div className="cc__pills">
            {METHODS.map(x => (
              <button key={x.key} type="button" className="cc__pill" aria-pressed={method === x.key} onClick={() => pick(project, x.key)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="cc__asking">
        <span>Running</span> {p.full}
      </p>

      <div className="cc__stage">
        <div className="cc__plot">
          {/* These drawings are type-heavy rather than chart-heavy, so on a
              phone they scroll inside their own box instead of shrinking
              their labels out of legibility. */}
          <div className="cc__diagram">
            {method === 'agile' && <AgileShape />}
            {method === 'waterfall' && <WaterfallShape />}
            {method === 'prince2' && <Prince2Shape />}
          </div>
          <p className="cc__caption">{m.label} · {m.shows}</p>
        </div>

        {/* The project's attributes, not a colour key — the drawing has one
            accent already, and three identical swatches would spend it
            again for nothing. */}
        <ul className="cc__legend">
          {p.attrs.map(([name, value]) => (
            <li key={name}>
              <b style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{name}</b> {value}
            </li>
          ))}
        </ul>
      </div>

      <div className={`cc__verdict cc__verdict--${verdict.v}`} aria-live="polite">
        <p className="cc__stamp">{VERDICT_LABEL[verdict.v]}</p>
        <p>{verdict.why}</p>
      </div>

      <p className="cc__tally">
        <span className="bt-tnum">{seen.size}</span> of 12 combinations tried. Every project here has a method that
        fits it and a method that would wreck it, and no method fits all four.
      </p>
    </div>
  );
}
