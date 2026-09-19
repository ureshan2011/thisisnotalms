import { useState } from 'react';

// ─── PRINCE2's seven, seven and seven (MBI804 · Lesson 2.4) ───────────────
// PRINCE2 is usually taught as three lists to memorise, which is how it ends
// up sounding like bureaucracy. Here the three lists are a switch, each item
// opens into what it actually stops going wrong, and the processes carry a
// map so the reader can see that "Directing a Project" runs above everything
// rather than before it.
//
// Naming follows the 2009/2017 editions, which is what the certifications
// and most workplaces still use. PRINCE2 7 (2023) renames the themes to
// practices and folds Change into Issues — noted on the page rather than
// quietly substituted, because a student meeting either version should
// recognise the other.

type Tab = 'principles' | 'themes' | 'processes';

interface Item {
  short: string;
  title: string;
  body: string;
  /** What goes wrong on a project that does not have it. */
  without: string;
}

const PRINCIPLES: Item[] = [
  {
    short: 'Continued business justification',
    title: 'There has to be a reason, and it has to still be true',
    body: 'A documented business case exists before the project is authorised, and it is re-checked at every stage boundary rather than filed. If the justification disappears — the market moved, the regulation changed, the benefit was already captured elsewhere — the project is stopped.',
    without: 'Projects that nobody can defend keep running because stopping them is somebody’s awkward conversation. This principle is what makes stopping a normal outcome instead of a failure.',
  },
  {
    short: 'Learn from experience',
    title: 'Lessons are sought, recorded and acted on',
    body: 'A lessons log is opened at the start, drawing on previous projects, added to as this one runs, and passed on at closure. It is an explicit activity with an owner, not a retrospective habit somebody hopefully has.',
    without: 'Every project re-discovers the same vendor problem, the same integration surprise, and the same optimistic estimate for data migration.',
  },
  {
    short: 'Defined roles and responsibilities',
    title: 'Somebody is the business, somebody is the user, somebody is the supplier',
    body: 'All three interests are represented on the project board: the executive owns the business case, the senior user speaks for the people who will live with the product, the senior supplier for the people building it. Every role is named, and one person can hold more than one on a small project.',
    without: 'Decisions stall because nobody can tell who is entitled to make them, and the user interest is represented by whoever happened to attend.',
  },
  {
    short: 'Manage by stages',
    title: 'Plan the next stage in detail, the rest in outline',
    body: 'The project is broken into management stages, each authorised separately. Detailed planning happens one stage ahead; everything beyond that is a project plan at outline level, which is honest about what can actually be known.',
    without: 'A twelve-month plan estimated to the day in month one, defended long after everybody knows it is wrong.',
  },
  {
    short: 'Manage by exception',
    title: 'The board hears from you when a tolerance breaks',
    body: 'Tolerances are agreed for six things — time, cost, scope, quality, risk and benefit. Inside them the project manager simply manages. Outside them, an exception report goes up and the board decides. It is the mechanism that makes governance affordable.',
    without: 'Either a board that meets weekly to approve nothing, or a board that hears about the overrun at the end. This principle is the difference between oversight and interference.',
  },
  {
    short: 'Focus on products',
    title: 'Agree what is being delivered before arguing about activity',
    body: 'Product descriptions define what each deliverable is and the quality criteria it has to meet, written before the work is scheduled. Plans are built from products rather than from tasks, so acceptance is against a written standard rather than an opinion.',
    without: 'A schedule full of busy activity and an argument at handover about whether the thing delivered was the thing meant.',
  },
  {
    short: 'Tailor to suit the project',
    title: 'The method is scaled to the project, deliberately',
    body: 'PRINCE2 is explicitly meant to be tailored to the size, risk, complexity and environment of the project, and the tailoring is recorded in the initiation documentation so it is a decision rather than a drift.',
    without: 'Either a two-person project drowning in documents, or a programme running on a template somebody quietly stopped filling in. Both are failures of the same principle.',
  },
];

const THEMES: Item[] = [
  {
    short: 'Business Case',
    title: 'Why — and is it still why?',
    body: 'Costs, benefits, timescales and risks, held in one document that is created in outline before the project starts, refined at initiation, and re-checked at every boundary. Benefits are measured after closure, usually by somebody outside the project.',
    without: 'The project’s purpose quietly becomes "finish the project".',
  },
  {
    short: 'Organization',
    title: 'Who decides, who does, who is spoken for',
    body: 'The project board, project manager, team managers and project assurance, with the business, user and supplier interests all represented. Change authority and its limits are named here too.',
    without: 'Escalation by seniority rather than by role, which means the loudest stakeholder is the governance.',
  },
  {
    short: 'Quality',
    title: 'What "good enough" means, written down first',
    body: 'Quality expectations and acceptance criteria are agreed with the customer, product descriptions carry testable quality criteria, and a quality register records what was checked and by whom.',
    without: 'Quality is defended in a meeting at the end, by the person with the most at stake.',
  },
  {
    short: 'Plans',
    title: 'Three levels, and only one of them is detailed',
    body: 'A project plan in outline, a stage plan in detail for the stage about to start, and team plans where a supplier needs one. Product-based planning builds all three from what is being delivered rather than from a list of activities.',
    without: 'One enormous plan that is either out of date or being maintained instead of managed.',
  },
  {
    short: 'Risk',
    title: 'Identify, assess, plan, implement — and own',
    body: 'A risk register with an owner and an actionee for every entry, and responses chosen from avoid, reduce, transfer, share, accept or, for an opportunity, exploit. Risk appetite and tolerance are set by the board rather than assumed by the manager.',
    without: 'A spreadsheet of worries that nobody has been made responsible for, reviewed the week before an audit.',
  },
  {
    short: 'Change',
    title: 'A request is an event with a route, not an interruption',
    body: 'Issues and change requests are logged, assessed for impact against the baseline, and decided by whoever holds change authority within an agreed change budget. Configuration management keeps track of which version of a product is the approved one.',
    without: 'Scope creep, which is not a single decision anybody made but the sum of many nobody recorded.',
  },
  {
    short: 'Progress',
    title: 'Where we actually are, against where we said',
    body: 'Tolerances, checkpoint and highlight reports, exception reports when a tolerance will be breached, and end-stage assessments. Progress is measured against the baseline, which is why the baseline has to exist.',
    without: 'A status of "90% done" for three months, which is the most expensive sentence in project management.',
  },
];

const PROCESSES: Item[] = [
  {
    short: 'Starting up a Project',
    title: 'Is this even worth initiating?',
    body: 'Pre-project. Appoints the executive and project manager, captures previous lessons, outlines the business case, and produces the project brief. It is deliberately short and deliberately cheap: its output is a recommendation about whether to spend money on initiation at all.',
    without: 'Projects are initiated because somebody asked, not because anybody checked.',
  },
  {
    short: 'Directing a Project',
    title: 'The board’s own process, running throughout',
    body: 'Not a phase. It runs above the whole project for its entire life: authorise initiation, authorise the project, authorise each stage or an exception plan, give ad-hoc direction, and authorise closure. The board manages by exception and does not do the project manager’s job.',
    without: 'Governance that is either a rubber stamp or a second project manager.',
  },
  {
    short: 'Initiating a Project',
    title: 'Build the contract the project will be run against',
    body: 'Produces the project initiation documentation: the detailed business case, the project plan, the four strategies (risk, quality, change, communication), the project controls, and how the method has been tailored. This is what the board authorises.',
    without: 'A project with no baseline, which means nothing later can be said to have changed.',
  },
  {
    short: 'Controlling a Stage',
    title: 'The project manager’s day job',
    body: 'Authorise work packages, monitor progress, capture and examine issues and risks, report to the board through highlight reports, and take corrective action inside tolerance. Most of a project’s elapsed time is spent here.',
    without: 'Reporting replaces controlling: the project is described accurately and steered by nobody.',
  },
  {
    short: 'Managing Product Delivery',
    title: 'The bridge to the people doing the work',
    body: 'The team manager accepts a work package, executes it, and delivers a product that meets its quality criteria. This is the seam where a delivery method sits — Scrum, or a build phase, or a subcontractor — because PRINCE2 itself never says how the work is done.',
    without: 'A management method pretending to be a delivery method, which is the most common way PRINCE2 is misused.',
  },
  {
    short: 'Managing a Stage Boundary',
    title: 'Report the stage, plan the next, re-justify the whole',
    body: 'Produces the end stage report, the next stage plan, and an updated business case and risk register — or an exception plan if a tolerance has been breached. This is the process that makes the go/no-go decision possible.',
    without: 'Stages that run together, and a business case last examined at the beginning.',
  },
  {
    short: 'Closing a Project',
    title: 'A deliberate end, with the lessons written down',
    body: 'Confirms acceptance, hands products to operations with follow-on action recommendations, writes the end project report and the lessons report, and sets up the benefits review that will happen after the team has gone.',
    without: 'A project that fades out, with no acceptance, no lessons, and nobody ever checking whether the benefit arrived.',
  },
];

const TABS: { key: Tab; label: string; lead: string; items: Item[] }[] = [
  { key: 'principles', label: '7 principles', lead: 'Non-negotiable. A project that drops one of these is not being run under PRINCE2, whatever the documents say.', items: PRINCIPLES },
  { key: 'themes', label: '7 themes', lead: 'The aspects that have to be managed continuously, not once. Every theme has a document and an owner.', items: THEMES },
  { key: 'processes', label: '7 processes', lead: 'Who does what, when. Six of them run in sequence or inside a stage; one of them runs above the whole project.', items: PROCESSES },
];

/** Where the seven processes sit in relation to each other. */
function ProcessMap() {
  const stage = (x: number, w: number, label: string, sub: string) => (
    <g key={label}>
      <rect x={x} y="74" width={w} height="42" rx="11" fill="var(--accent-50)" stroke="var(--accent-200)" />
      <text x={x + w / 2} y="92" textAnchor="middle" fontSize="10.5" fontWeight="700" fontFamily="var(--font-display)" fill="var(--accent-700)">{label}</text>
      <text x={x + w / 2} y="106" textAnchor="middle" fontSize="9" fontFamily="var(--font-body)" fill="var(--accent-600)">{sub}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 560 176" width="100%" role="img"
      aria-label="The PRINCE2 process model: Directing a Project runs as a band across the top for the whole project. Below it, Starting up a Project precedes Initiating a Project, then Controlling a Stage and Managing Product Delivery repeat inside each stage, with Managing a Stage Boundary between stages, and Closing a Project at the end.">
      <text x="12" y="20" fontSize="9.5" letterSpacing="1.2" fontFamily="var(--font-body)" fill="var(--ink-400)">RUNS ABOVE EVERYTHING, FOR THE WHOLE PROJECT</text>
      <rect x="12" y="28" width="536" height="26" rx="13" fill="var(--accent-500)" />
      <text x="280" y="45" textAnchor="middle" fontSize="11.5" fontWeight="800" fontFamily="var(--font-display)" fill="#fff">Directing a Project · the board</text>

      {stage(12, 96, 'Starting up', 'pre-project')}
      {stage(116, 104, 'Initiating', 'build the baseline')}
      {stage(228, 150, 'Controlling a Stage', 'with Managing Product Delivery')}
      {stage(386, 76, 'Boundary', 'go / no-go')}
      {stage(470, 78, 'Closing', 'and lessons')}

      {[108, 220, 378, 462].map(x => (
        <path key={x} d={`M${x} 95 L${x + 8} 95`} stroke="var(--ink-300)" strokeWidth="1.4" />
      ))}
      {/* The loop back: stages repeat until the last boundary says stop. */}
      <path d="M414 118 C 414 146, 300 146, 300 122" fill="none" stroke="var(--ink-300)" strokeWidth="1.2" strokeDasharray="4 4" />
      <text x="357" y="160" textAnchor="middle" fontSize="9.5" fontFamily="var(--font-body)" fill="var(--ink-400)">repeat per stage, until the board authorises closure</text>
    </svg>
  );
}

export default function Prince2Explorer() {
  const [tab, setTab] = useState<Tab>('principles');
  const [i, setI] = useState(0);

  const t = TABS.find(x => x.key === tab)!;
  const item = t.items[i];

  function pickTab(next: Tab) {
    setTab(next);
    setI(0);
  }

  return (
    <div className="cc">
      <div className="cc__bar">
        <div className="cc__group">
          <span className="cc__label">PRINCE2 is three lists of seven</span>
          <div className="cc__pills">
            {TABS.map(x => (
              <button key={x.key} type="button" className="cc__pill" aria-pressed={tab === x.key} onClick={() => pickTab(x.key)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="cc__asking"><span>{t.label}</span> {t.lead}</p>

      <div className="bt-chiprow" role="group" aria-label={`The ${t.label}`}>
        {t.items.map((x, idx) => (
          <button key={x.short} type="button" className="bt-ctxchip" aria-pressed={i === idx} onClick={() => setI(idx)}>
            {x.short}
          </button>
        ))}
      </div>

      {tab === 'processes' && (
        <div className="cc__stage" style={{ marginTop: 18 }}>
          <div className="cc__plot">
            <div className="cc__diagram"><ProcessMap /></div>
            <p className="cc__caption">Directing a Project is a band, not a box in the sequence — that is the part most summaries get wrong</p>
          </div>
        </div>
      )}

      <div className="cc__verdict" style={{ marginTop: 18 }} aria-live="polite">
        <p className="cc__stamp">{item.short}</p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--ink-900)', marginBottom: 8 }}>
          {item.title}
        </p>
        <p>{item.body}</p>
      </div>

      <div className="bt-verdict bt-verdict--bad" style={{ marginTop: 12 }} aria-live="polite">
        <strong>What a project without it looks like</strong>
        {item.without}
      </div>

      <p className="cc__tally">
        <span className="bt-tnum">{i + 1}</span> of 7 in this list. PRINCE2 7, published in 2023, renames the themes to
        practices and folds Change into Issues — the same material under newer labels, and worth recognising in both
        forms because workplaces and certifications are split across the two.
      </p>
    </div>
  );
}
