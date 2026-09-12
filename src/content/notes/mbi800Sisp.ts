import type { NotesDoc } from '../../lib/notesPdf';

// Condensed notes for /intro-to-sisp. The Iceberg stepper, the system/
// collection flip cards and the six-dimension diagnostic become, on paper,
// the four layers as a table, the swap test as a list, and the Rational
// Adaptation profile written out.

export const SISP_NOTES: NotesDoc = {
  code: 'MBI800',
  course: 'Strategic Information Systems Planning',
  title: 'Lesson 1 — Introduction and Systems Thinking',
  summary:
    'What SISP is and is not, systems against collections, the feedback loop, the Iceberg Model, and a look ahead to the four tests and the six process dimensions.',
  accent: [81, 76, 168],
  fileName: 'MBI800-Strategic-IS-Planning-notes',
  sections: [
    {
      heading: 'What this lesson is for',
      standfirst: 'Lesson 1 of 11. No prerequisites, and nothing to install.',
      blocks: [
        {
          type: 'bullets',
          title: 'By the end of this lesson you can',
          items: [
            'Say what Strategic Information Systems Planning is, and what problem it solves',
            'Explain how SISP differs from planning a single IT project',
            'Tell a system from a collection, and say why that distinction decides how you plan',
            'Use the Iceberg Model to get from an observed failure down to the belief that produced it',
            'Name the layer an improvement is operating at, and predict whether it will hold',
          ],
        },
      ],
    },
    {
      heading: 'What SISP is',
      standfirst: 'The question asked before a project starts, not during it.',
      blocks: [
        {
          type: 'p',
          text:
            'Strategic Information Systems Planning is the process of identifying and prioritising information systems investments so that they support an organisation’s business strategy, rather than being pursued independently of it. A project plan answers "how do we build this on time and on budget?" SISP answers the prior question: "should this system exist at all, and why, before any budget is committed?"',
        },
        {
          type: 'callout',
          title: 'Why getting this wrong is expensive',
          text:
            'The best-executed project in the world still fails if it solves a problem the organisation did not have. Duplicated capability, systems nobody asked for, and spending that drifts from what the business needs are all SISP failures, not delivery failures.',
        },
        {
          type: 'numbered',
          title: 'Three forces that make it hard',
          pairs: [
            ['Systems shape strategy too', 'A retailer adopting real-time inventory data does not just automate a process; it opens strategic options that did not exist before. Planning has to run from strategy down to systems and from systems capability back up.'],
            ['Uncertainty and constraint', 'Technology moves faster than planning cycles, budgets are finite, and the people who understand the business rarely share a time horizon with the people who understand the technology.'],
            ['It is a human process first', 'Frameworks exist because organisations are made of people with competing incentives, incomplete information and legitimate disagreement about priorities.'],
          ],
        },
      ],
    },
    {
      heading: 'Systems thinking and the Iceberg Model',
      standfirst: 'Every later framework assumes you can already see an organisation as a system.',
      blocks: [
        {
          type: 'p',
          title: 'System or collection',
          text:
            'A collection is a set of items with no meaningful interaction. A system is a set of interacting parts producing behaviour none of the parts produces alone. The test: remove or change one part. In a collection, the rest is unaffected. In a system, removing one part changes how the others behave. A bowl of fruit and a toolbox are collections; a football team, a kitchen and a toaster are systems; a customer database is a collection until other processes depend on its answers, at which point it becomes a system.',
        },
        {
          type: 'p',
          title: 'Systems thinking',
          text:
            'A way of seeing that replaces two habits of ordinary problem-solving: it looks for interrelationships among parts rather than isolated linear cause-and-effect, and for processes of change over time rather than discrete snapshots.',
        },
        {
          type: 'p',
          title: 'The sales performance loop',
          text:
            'A company reports poor sales. Inadequate selling effort feeds out-of-date sales procedures, which produce poor performance, which is reported back through incorrect sales information to poor sales management — which is itself a cause of the inadequate effort. The loop closes on itself. Telling the sales team to work harder addresses the output alone, so it improves the numbers for roughly a quarter and then the loop pulls them back below where they started. Rebuilding the reporting is slower and costs a quarter of visible progress, and it is the intervention that compounds, because management finally acts on numbers that are true.',
        },
        {
          type: 'callout',
          title: 'Why the wrong fix keeps winning',
          text:
            'The event-layer fix looks best at the three-month review, which is usually when the review happens. Nothing in the loop is anybody behaving unreasonably: management acts on the information it is given, and that information is produced by the performance it is meant to explain.',
        },
        {
          type: 'table',
          head: ['Layer', 'The question it answers'],
          rows: [
            ['Events', 'What is happening. Visible without investigation, and the only layer most improvement effort reaches.'],
            ['Patterns of behaviour', 'What has been happening. Trends across many events, where a one-off becomes something you can plan against.'],
            ['Structures', 'What makes the patterns possible: policies, technical architecture, workflows, resource allocations.'],
            ['Mental models', 'The values, beliefs and assumptions that keep the structures in place, usually unwritten.'],
          ],
          weights: [1, 2.6],
        },
        {
          type: 'callout',
          title: 'Learning and leverage both run downward',
          text:
            'Each layer down explains more about why the layer above happens, and an intervention at a deeper layer is more durable because structures and mental models shape many future events. Patching a single event fixes nothing about the next one.',
        },
        {
          type: 'numbered',
          title: 'Worked example: the 2024 vendor update outage',
          pairs: [
            ['Event', 'A faulty content update crashed Windows machines worldwide. Flights grounded, hospital systems down, payments stalled.'],
            ['Patterns of behaviour', 'Outages of this class cluster around urgent updates pushed outside the normal review window.'],
            ['Structures', 'Kernel-level deployment with no staged rollout or canary ring, and a channel classified as content rather than code, so it skipped code review.'],
            ['Mental models', 'An assumption that vendor security updates are low-risk enough to skip staged deployment. Nobody wrote it down; everybody acted on it.'],
          ],
        },
      ],
    },
    {
      heading: 'A testable definition of SISP',
      standfirst: 'Segars, Grover and Teng (1998). Fail any one test and it is not SISP.',
      blocks: [
        {
          type: 'p',
          text:
            'SISP is a formal process, conducted at a broad scope, from an upper-management perspective, over a long-range time frame, at a conceptual rather than operational level of abstraction.',
        },
        {
          type: 'numbered',
          title: 'What each property rules out',
          pairs: [
            ['Broad scope', 'Rules out a planning exercise confined to a single department’s systems.'],
            ['Upper-management perspective', 'Rules out planning that never leaves the IT department. SISP must be owned where organisation-wide resources can be committed.'],
            ['Long-range time frame', 'Rules out a horizon measured in one project’s duration.'],
            ['Conceptual abstraction', 'Rules out jumping to technical specification before the business question is settled.'],
          ],
        },
        {
          type: 'numbered',
          title: 'The three jobs SISP does',
          pairs: [
            ['Support and influence', 'Identify which systems would genuinely add value, rather than automating a process the organisation already runs.'],
            ['Technological integration', 'Coordinate disparate technologies into one information architecture, so independently built systems do not duplicate data or block integration.'],
            ['Implementation strategy', 'Produce macro-level blueprints detailed enough to sequence and prioritise investment, without descending into project specification.'],
          ],
        },
      ],
    },
    {
      heading: 'The six process dimensions',
      standfirst: 'How to describe, and then evaluate, any planning process.',
      blocks: [
        {
          type: 'table',
          head: ['Dimension', 'What it measures'],
          rows: [
            ['Comprehensiveness', 'Thoroughness: how wide a range of alternatives is canvassed, how much evaluation data is sought, how carefully risks are weighed, whether contingencies are set in advance.'],
            ['Formalization', 'Reliance on written procedures, explicit policies and repeatable pathways for collecting information, rather than ad-hoc conversation.'],
            ['Focus', 'The balance between an innovative orientation (novel solutions) and an integrative one (budgetary control, cost performance, asset protection).'],
            ['Flow', 'The locus of planning authority: top-down from upper management, or bottom-up from functional management.'],
            ['Participation', 'The breadth of organisational involvement. Narrow means an isolated planning team; broad means diverse functional areas actively incorporated.'],
            ['Consistency', 'The frequency and regularity of the planning cycle, from sporadic and annual to continuous and embedded in operations.'],
          ],
          weights: [1, 3],
        },
        {
          type: 'callout',
          title: 'Participation and consistency are commonly misread',
          text:
            'Participation is about who co-designs versus who is merely informed. A plan that surveys staff after the decisions are made has low participation however many people were surveyed. Consistency is not just meeting frequency: it means every individual IS decision can be traced back to a stated strategic theme.',
        },
        {
          type: 'p',
          title: 'Rational Adaptation',
          text:
            'No configuration that is high on every dimension performs best. The strongest planning processes combine Rational Tendencies — high comprehensiveness, strong formalization, an integrative focus and top-down flow — with Adaptive Tendencies — broad participation and high planning consistency. The rational half supplies discipline and accountability; the adaptive half stops that discipline calcifying into a process too disconnected and too rarely updated to track real change.',
        },
        {
          type: 'bullets',
          title: 'Two failure profiles',
          items: [
            'Rational but not adaptive: a thorough, well-documented plan that is out of date within a year. The fix is broader participation earlier and a shorter interval between reviews, not less discipline.',
            'Adaptive but not rational: continuous, broadly consulted activity with no discipline behind it. Motion without a plan.',
          ],
        },
      ],
    },
    {
      heading: 'Course details and assessment',
      standfirst: 'MBI800, Level 8, 15 credits, no prerequisites.',
      blocks: [
        {
          type: 'kv',
          title: 'At a glance',
          pairs: [
            ['Credits and level', '15 credits at Level 8'],
            ['Hours', '150 total: 36 contact, 114 self-directed'],
            ['Prerequisites', 'None. MBI804 later lists MBI800 as one of its prerequisites.'],
            ['Delivery', 'Face-to-face, blended or online'],
          ],
        },
        {
          type: 'table',
          head: ['LO', 'Outcome'],
          rows: [
            ['LO1', 'Assess current information systems to identify strategic opportunities and associated risks for improvement in a business context.'],
            ['LO2', 'Evaluate the impact of cultural protocols and data privacy on the successful implementation of information systems in diverse cultural settings.'],
            ['LO3', 'Develop strategic plans to align information systems with organisational goals in a business context.'],
          ],
          weights: [0.6, 4],
        },
        {
          type: 'table',
          head: ['Weighting', 'Assessment', 'Assesses'],
          rows: [
            ['60%', 'Strategic Information Systems Planning report (individual)', 'LO1, LO3'],
            ['40%', 'Case study analysis: cultural and ethical analysis in information systems implementation (individual)', 'LO2'],
          ],
          weights: [0.8, 3, 0.8],
        },
        {
          type: 'callout',
          title: 'Culturally responsive planning carries 40%',
          text:
            'Systems handling personal or culturally sensitive data carry planning obligations beyond cost and schedule. The course works through information services for Māori and Pasifika health providers as a case: data sovereignty, cultural protocols and community consent, not only technical privacy controls.',
        },
      ],
    },
  ],
};
