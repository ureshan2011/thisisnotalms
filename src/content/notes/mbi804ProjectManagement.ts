import type { NotesDoc } from '../../lib/notesPdf';

// Condensed notes for /intro-to-project-management. The constraint toggle,
// the methodology chooser and the risk desk become, on paper, the three
// constraint positions, the methodology fit table, and the exposure
// arithmetic with its four responses.

export const PM_NOTES: NotesDoc = {
  code: 'MBI804',
  course: 'IT Project Management',
  title: 'Lesson 1 — What a Project Is, and What Decides How to Run It',
  summary:
    'What makes something a project, the triple constraint, critical path and float, how Agile, Waterfall and PRINCE2 differ and when each fits, and turning a risk into an exposure figure.',
  accent: [171, 53, 92],
  fileName: 'MBI804-IT-Project-Management-notes',
  sections: [
    {
      heading: 'What this lesson is for',
      standfirst: 'Lesson 1 of 9. Assumes MBI800 and MBI801.',
      blocks: [
        {
          type: 'bullets',
          title: 'By the end of this lesson you can',
          items: [
            'Say what makes something a project rather than the work an organisation already does',
            'Name which of scope, time and cost is actually free to move on a given project',
            'Explain why two tasks can slip by the same amount and only one of them costs the launch',
            'Match a project’s attributes to Agile, Waterfall or PRINCE2, and defend the match',
            'Turn a risk into an exposure figure, and choose a response that costs less than it removes',
          ],
        },
        {
          type: 'numbered',
          title: 'Three tests for a project',
          pairs: [
            ['Temporary', 'A definite start and a definite end. Not short — temporary. A five-year programme is a project; running the service it delivers is not.'],
            ['Unique', 'It produces a result that did not exist before. The hundredth store fit-out is still a project, because this site and this landlord have never been done.'],
            ['Progressively elaborated', 'You know least on the first day and commit anyway. Detail arrives as the work does, which is why an estimate has a maturity and a plan has versions.'],
          ],
        },
        {
          type: 'kv',
          title: 'Three levels of success, and only one gets reported',
          pairs: [
            ['Delivered', 'On time, inside budget, matching the agreed scope. The only level most projects measure.'],
            ['Adopted', 'The people it was built for actually use it. A system delivered perfectly and used by nobody consumed the whole budget and returned nothing.'],
            ['Worth it', 'The benefit the business case promised arrived. Measured months after closure, usually by somebody else, and the only level that pays for the other two.'],
          ],
        },
      ],
    },
    {
      heading: 'Critical path and float',
      standfirst: 'Why two identical delays cost completely different amounts.',
      blocks: [
        {
          type: 'p',
          text:
            'A schedule is not a list of dates. It is a network of dependencies, and somewhere in that network runs the longest chain with no slack in it: the critical path. A task on it has nothing to give, so every week it loses the project loses. A task off it has float — time it can lose before anything downstream notices.',
        },
        {
          type: 'p',
          title: 'Worked example',
          text:
            'On the SecurePay NZ integration, discovery, gateway integration, security review and user acceptance testing form the critical path and finish at week 14. Merchant onboarding documentation runs alongside and finishes at week 7, four weeks before user acceptance testing can start. A three-week slip on the integration moves the launch to week 17. The same three-week slip on the documentation moves the launch not at all — it spends three of that task’s four weeks of float. Past four weeks the documentation joins the critical path and starts costing launch weeks like everything else on it.',
        },
        {
          type: 'callout',
          title: 'What this changes about your day',
          text:
            'A project manager who treats every delay as equally urgent spends their attention in the wrong place. The first question about a slipped task is not how late it is, but what is waiting on it.',
        },
      ],
    },
    {
      heading: 'The triple constraint',
      standfirst: 'Scope, time and cost. Hold two and the third moves.',
      blocks: [
        {
          type: 'p',
          text:
            'Every project is bounded by scope, time and cost, and the three are linked. Fixing two of them determines the third, whether or not anybody says so out loud. Naming which corner is free is most of what a project manager does in the first week.',
        },
        {
          type: 'numbered',
          title: 'What each position means',
          pairs: [
            ['Time and cost fixed, scope moves', 'The feature list is the variable. Handled openly this is how an Agile backlog works: the sponsor gets the most valuable slice by the date. Handled quietly it becomes features dropped in the final fortnight, which is the same outcome with the trust removed.'],
            ['Scope and cost fixed, time moves', 'The date is the release valve. Defensible on a regulated or safety-critical build, where an incomplete system is worse than a late one. Indefensible when the date was promised to a customer who has not been told.'],
            ['Scope and time fixed, cost moves', 'Money is the only lever: more people, overtime, contractors. The assumption underneath is that effort converts cleanly into speed. It does not — adding people to a late project carries ramp-up and communication costs, and past a point makes it later.'],
          ],
        },
        {
          type: 'callout',
          title: 'When all three are fixed',
          text:
            'Quality becomes the undeclared variable. Testing gets compressed, review gets skipped, and the cost arrives later as defects. A sponsor insisting on all three has not removed the trade-off, only the conversation about it.',
        },
      ],
    },
    {
      heading: 'Choosing a methodology (LO1)',
      standfirst: 'No methodology is good or bad alone, only fit or unfit for a project’s attributes.',
      blocks: [
        {
          type: 'table',
          head: ['', 'Agile (Scrum)', 'Waterfall', 'PRINCE2'],
          rows: [
            ['Delivery', 'Incremental, every sprint', 'One delivery at the end', 'Staged, board-approved'],
            ['Requirements', 'Evolving, change welcomed', 'Fixed up front, change is costly', 'Fixed per stage, re-justified between'],
            ['Customer', 'Continuous involvement', 'Start and end only', 'Represented on the project board'],
            ['Testing', 'Continuous, every sprint', 'A phase after development', 'Per stage, with stage assurance'],
            ['Risk', 'Surfaced early and often', 'Discovered late, expensively', 'Reviewed at every boundary'],
            ['Best suited to', 'Complex, evolving software', 'Fixed scope, stable requirements', 'Governance-heavy, publicly funded work'],
          ],
          weights: [0.9, 1.2, 1.2, 1.3],
        },
        {
          type: 'bullets',
          title: 'Four project shapes, and what fits them',
          items: [
            'A client integration where requirements will move as the client sees it working: Agile fits. Waterfall turns every change into a variation request.',
            'A regulated migration with signed, auditable requirements: Waterfall fits. An emerging scope is the one thing this project must not have.',
            'A publicly funded multi-agency platform with stage funding gates: PRINCE2 fits. Waterfall gives no boundary at which stopping is an option.',
            'A new product nobody can yet specify: Agile fits. A specification written before anybody knows what the product should do is fiction with a signature on it.',
          ],
        },
        {
          type: 'callout',
          title: 'PRINCE2 is a management method, not a delivery method',
          text:
            'It defines roles, stages and decision points; it never says how the build is sequenced. Choosing PRINCE2 still leaves the delivery choice — Waterfall or Agile — to be made underneath it. The two combine, and often do.',
        },
      ],
    },
    {
      heading: 'Estimating and reserves',
      standfirst: 'An estimate has a maturity. Demanding accuracy early does not create it.',
      blocks: [
        {
          type: 'table',
          head: ['Estimate type', 'When', 'Typical range'],
          rows: [
            ['Rough order of magnitude', 'Very early, before requirements settle', '−25% to +75%'],
            ['Budgetary', 'Once scope is roughly known, to allocate money', '−10% to +25%'],
            ['Definitive', 'Late, from a decomposed work breakdown structure', '−5% to +10%'],
          ],
          weights: [1.4, 2, 1],
        },
        {
          type: 'p',
          title: 'Three-point (PERT) estimating',
          text:
            'E = (O + 4M + P) ÷ 6, weighting the most likely case four to one while still counting the tails. A payment-gateway integration at 4 weeks optimistic, 6 most likely and 14 pessimistic gives (4 + 24 + 14) ÷ 6 = 7 weeks, not 6. The pessimistic tail alone moved the plan by a week.',
        },
        {
          type: 'bullets',
          title: 'Why estimates go wrong',
          items: [
            'Made under time pressure: the estimate is the first deliverable of the project and routinely gets the least time of anything in it.',
            'Estimating unfamiliar work, often by the person who knows least about it.',
            'Optimism bias: people estimate the version of the task where nothing goes wrong.',
            'Accuracy demanded too early: a definitive number at rough-order-of-magnitude maturity is the same guess with the uncertainty hidden.',
          ],
        },
        {
          type: 'kv',
          title: 'Two reserves, two owners',
          pairs: [
            ['Contingency reserve', 'Covers identified risks, the known unknowns. Inside the cost baseline, spent by the project manager.'],
            ['Management reserve', 'Covers what nobody saw coming. Outside the cost baseline, released only by the sponsor.'],
          ],
        },
      ],
    },
    {
      heading: 'Risk (LO2)',
      standfirst: 'Probability times impact gives you something you can compare and act on.',
      blocks: [
        {
          type: 'p',
          text:
            'Expected monetary value is probability multiplied by impact in money: a 50% chance of a $40,000 consequence is a $20,000 exposure. The number is not a prediction. It is a way of ranking risks against each other so that attention and reserve go where they earn most, and so that a mitigation costing more than the exposure it removes is visible as the bad trade it is.',
        },
        {
          type: 'numbered',
          title: 'The four responses to a threat',
          pairs: [
            ['Avoid', 'Change the plan so the risk cannot occur: drop the feature, choose the integration you already know, move the dependency off the critical path. The only response that takes exposure to zero, and the only one that costs scope.'],
            ['Transfer', 'Move the consequence to somebody equipped to carry it: insurance, a fixed-price contract, a managed service with the obligation written in. The risk still happens; somebody else pays, and you pay a premium for that.'],
            ['Mitigate', 'Reduce probability, impact or both: a spike to de-risk an unknown integration, a staged rollout, an earlier load test. The most common response, and the one that needs a number attached.'],
            ['Accept', 'Decide deliberately to carry it. Active acceptance sets aside a contingency reserve for exactly this; passive acceptance does nothing and hopes. Only one of the two is a plan.'],
          ],
        },
        {
          type: 'callout',
          title: 'What finishes a register row',
          text:
            'An owner, a response, a trigger to watch for, and a review date. Without all four it is a list of worries rather than a risk register, and the 40% assessment on this course is marked against exactly that difference.',
        },
      ],
    },
    {
      heading: 'Scope, Scrum and the people part',
      blocks: [
        {
          type: 'p',
          title: 'Scope',
          text:
            'The work breakdown structure decomposes the deliverable until every piece is small enough to estimate and assign. The scope baseline records what is in — which is also the only way to recognise scope creep, because each request that causes it is individually reasonable and free to ask for.',
        },
        {
          type: 'kv',
          title: 'Scrum in brief',
          pairs: [
            ['Three roles', 'Product Owner (one person, maximises value, owns the backlog); Scrum Master (servant-leader, removes impediments); Developers (3–9, cross-functional, own the increment).'],
            ['Three artifacts', 'Product Backlog with a Product Goal; Sprint Backlog with a Sprint Goal, owned by the developers; Increment, held to the Definition of Done.'],
            ['Five events', 'The Sprint (1–4 weeks); Sprint Planning (max 8 hours); Daily Scrum (15 minutes); Sprint Review (max 4 hours); Retrospective (max 3 hours). Timeboxes are for a four-week sprint and scale down proportionally.'],
          ],
        },
        {
          type: 'kv',
          title: 'Thomas-Kilmann conflict modes',
          pairs: [
            ['Competing', 'Assertive, uncooperative. Right when a decision is urgent and unpopular, or safety is at stake.'],
            ['Collaborating', 'Assertive and cooperative. Named first by almost everybody, and the most expensive: it needs time and trust from both sides.'],
            ['Compromising', 'Moderate on both. Fast and fair-looking; can leave both sides equally unhappy with something neither believes in.'],
            ['Avoiding', 'Unassertive, uncooperative. Occasionally correct, corrosive as a habit.'],
            ['Accommodating', 'Unassertive, cooperative. Right when you are wrong, or when the relationship outweighs this particular point.'],
          ],
        },
      ],
    },
    {
      heading: 'Course details and assessment',
      standfirst: 'MBI804, Level 8, 15 credits, trimester two.',
      blocks: [
        {
          type: 'kv',
          title: 'At a glance',
          pairs: [
            ['Credits and level', '15 credits at Level 8'],
            ['Hours', '150 total: 36 contact, 114 self-directed'],
            ['Prerequisites', 'MBI800 and MBI801'],
            ['Delivery', 'Face-to-face, blended or online'],
          ],
        },
        {
          type: 'table',
          head: ['LO', 'Outcome'],
          rows: [
            ['LO1', 'Critically analyse the attributes of an IT project to recommend the most suitable project management methodologies in an organisation.'],
            ['LO2', 'Assess potential risks associated with IT projects to propose mitigation strategies for an organisation.'],
            ['LO3', 'Apply IT project management approaches and practices within specialised domains in a professional context.'],
          ],
          weights: [0.6, 4],
        },
        {
          type: 'table',
          head: ['Weighting', 'Assessment', 'Assesses'],
          rows: [
            ['60%', 'Project methodology selection: case study (individual)', 'LO1, LO3'],
            ['40%', 'Risk management plan: report (individual)', 'LO2, LO3'],
          ],
          weights: [0.8, 3, 0.8],
        },
      ],
    },
  ],
};
