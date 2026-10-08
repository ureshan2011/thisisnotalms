import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import ERTask from './er/ERTask';
import { ShapeSample } from './er/ChenDiagram';
import { TASKS } from './er/firstTasks';

// ─── MBI802 · Your first ER diagrams ───────────────────────────────────────
// A public, ungated Blend page (src/components/blend/README.md) on MBI802's
// warm orange. Practice for the ER diagram foundations lesson (/er-diagrams),
// written for students drawing an ER diagram for the very first time.
//
// It only uses what that lesson teaches: Chen's notation, the four shapes
// (entity, attribute, key attribute, relationship) and 1:1, 1:N and M:N.
// The one idea it adds is an attribute on a relationship, introduced
// gently in Task 2, because /er-activities expects it straight away.
//
// The tone is deliberate. Short sentences, one idea each, and a lot of
// "this is normal". First-timers usually know more than they think; what
// they lack is a routine, so the page gives them one (five steps and two
// questions) and then has them run it five times, two simple stories and
// three moderate ones. The answers open a part at a time, see ERTask.tsx.

const SHAPES: { kind: 'entity' | 'attr' | 'key' | 'rel'; label: string; name: string; what: string; clue: string }[] = [
  {
    kind: 'entity',
    label: 'CUSTOMER',
    name: 'Entity · rectangle',
    what: 'A thing the business keeps data about. It becomes a table later.',
    clue: 'A noun. You could have many of them.',
  },
  {
    kind: 'attr',
    label: 'FirstName',
    name: 'Attribute · ellipse',
    what: 'One fact about an entity. It becomes a column later.',
    clue: '“Each customer has a…”',
  },
  {
    kind: 'key',
    label: 'CustomerID',
    name: 'Key attribute · underlined',
    what: 'The fact that’s different for every single one. It becomes the primary key.',
    clue: 'Often an ID, a number or a code.',
  },
  {
    kind: 'rel',
    label: 'OWNS',
    name: 'Relationship · diamond',
    what: 'How two entities are linked.',
    clue: 'A verb: owns, joins, treats, teaches.',
  },
];

const NAMING: [string, string, string, string][] = [
  ['Entity', 'One thing, so singular. All capitals. Join two words with _.', 'CUSTOMER, ID_CARD', 'Customers, customer'],
  ['Relationship', 'A verb. All capitals. Join two words with _.', 'OWNS, WORKS_IN', 'Ownership, works in'],
  ['Attribute', 'Starts with a capital. No spaces. Each new word starts with a capital.', 'FirstName, DateOfBirth', 'first name, DOB, fname'],
  ['Key attribute', 'Same as an attribute, and underlined. Usually ends in ID, Number or Code.', 'CustomerID', 'id, Cust_No'],
];

const STEPS: [string, string][] = [
  ['Read the story twice.', 'The first time, just read it. The second time, have a pencil in your hand.'],
  ['Circle the nouns.', 'These are your entities. Leave out the business itself. The bank or the hospital is the whole system, not one box in it.'],
  ['List the facts for each entity.', 'These are its attributes. Then pick the key: the one fact no two of them can share.'],
  ['Underline the verbs that link two entities.', 'Each one is a relationship. Write it as ENTITY VERB ENTITY, like CUSTOMER OWNS ACCOUNT.'],
  ['Ask the two questions, then draw.', 'The two questions give you the numbers. Then draw rectangles first, diamonds between them, and ellipses last.'],
];

const MISTAKES: { title: string; fix: string }[] = [
  {
    title: 'A box for the business itself',
    fix: 'BANK or HOSPITAL in a rectangle. The business is the whole diagram, so it doesn’t need its own box.',
  },
  {
    title: 'Plural entity names',
    fix: 'CUSTOMERS. Name it for one of them: CUSTOMER. The table will hold many, but each one is a customer.',
  },
  {
    title: 'An entity with no key',
    fix: 'Every entity needs one underlined key. If nothing in the story is unique, add an ID. That’s allowed.',
  },
  {
    title: 'A link fact on an entity',
    fix: 'Grade on STUDENT. Ask “whose fact is this?” If it needs both sides to make sense, it goes on the diamond.',
  },
  {
    title: 'Guessing the cardinality',
    fix: 'Banks have joint accounts, so it must be M:N? Not in Task 1. Go by what the story says, every time.',
  },
  {
    title: 'A noun in a diamond',
    fix: 'OWNERSHIP or ENROLMENT. A relationship is something one entity does to another, so use a verb: OWNS, TAKES.',
  },
];

const QUIZ: QuizQuestion[] = [
  {
    q: 'Which name follows the rules for an entity?',
    answer: 2,
    options: [
      { text: 'Customers', why: 'Close, but it’s plural and not in capitals. Name the entity for one of them.' },
      { text: 'customer', why: 'Singular is right. Entities are written in capitals, though.' },
      { text: 'CUSTOMER', why: 'Yes. One thing, so singular, and in capitals.' },
      { text: 'CUSTOMER_TABLE', why: 'Leave “table” out. It’s an entity on a diagram. It only becomes a table later.' },
    ],
  },
  {
    q: 'Which of these would you draw in a diamond?',
    answer: 1,
    options: [
      { text: 'BRANCH', why: 'BRANCH is a noun, a thing the bank keeps data about. That’s a rectangle.' },
      { text: 'WORKS_AT', why: 'Yes. It’s a verb that links EMPLOYEE and BRANCH, so it’s a relationship.' },
      { text: 'BranchCode', why: 'That’s a fact about a branch, so it’s an attribute. It’s the key, so it’s underlined.' },
      { text: 'City', why: 'City is a fact about a branch. That makes it an attribute, in an ellipse.' },
    ],
  },
  {
    q: 'One nurse works in one ward. One ward has many nurses. Where does the N go?',
    answer: 0,
    options: [
      { text: 'Beside NURSE', why: 'Yes. There are many nurses for each ward, so the N goes next to NURSE. The 1 goes next to WARD.' },
      { text: 'Beside WARD', why: 'Each nurse works in only one ward, so WARD gets the 1. The N goes beside NURSE, because there are many nurses.' },
      { text: 'Inside the diamond', why: 'The diamond holds the verb, WORKS_IN. The numbers go on the lines, next to the entities.' },
      { text: 'On both sides', why: 'That would mean many-to-many. Each nurse works in just one ward, so one side is a 1.' },
    ],
  },
  {
    q: 'Each student gets a grade for each course they take. Where does Grade go?',
    answer: 2,
    options: [
      { text: 'On STUDENT', why: 'A student in four courses has four grades. So a grade isn’t a fact about the student alone.' },
      { text: 'On COURSE', why: 'A course gives out a different grade to every student. So it isn’t about the course alone.' },
      { text: 'On the TAKES diamond', why: 'Yes. A grade only makes sense for one student in one course, so it belongs to the link.' },
      { text: 'In its own rectangle', why: 'A grade has no facts of its own to keep. It’s one fact, so it’s an attribute.' },
    ],
  },
  {
    q: 'Which attribute is the best key for CUSTOMER?',
    answer: 2,
    options: [
      { text: 'LastName', why: 'Lots of people share a last name. A key must be different for every customer.' },
      { text: 'PhoneNumber', why: 'People change numbers, and families can share one. A key should never repeat and never change.' },
      { text: 'CustomerID', why: 'Yes. The bank gives every customer their own ID, and it never changes.' },
      { text: 'FirstName', why: 'There are a lot of Sams and Priyas. A name can’t tell two customers apart.' },
    ],
  },
  {
    q: 'In Task 1, each account had one owner. In Task 4, an account can have many owners. What changed?',
    answer: 1,
    options: [
      { text: 'The entities', why: 'Still CUSTOMER and ACCOUNT. A joint account is still an ACCOUNT.' },
      { text: 'The cardinality of OWNS', why: 'Yes. It went from 1:N to M:N, because the rule in the story changed.' },
      { text: 'The key of ACCOUNT', why: 'AccountNumber is still the key. Every account still has its own number.' },
      { text: 'Nothing', why: 'Something did change. One account can now have many customers, and that changes the numbers on the line.' },
    ],
  },
  {
    q: 'Which attribute name is written the right way?',
    answer: 2,
    options: [
      { text: 'date of birth', why: 'No spaces in an attribute name. Spaces cause trouble when it becomes a column.' },
      { text: 'DOB', why: 'Short forms are hard to read, and people guess them differently. Write the words out.' },
      { text: 'DateOfBirth', why: 'Yes. A capital at the start of each word, and no spaces.' },
      { text: 'DATE_OF_BIRTH', why: 'Capitals with _ are for entities and relationships. Attributes start with a capital, then each new word does too.' },
    ],
  },
];

function FlipCard({ n, title, fix }: { n: number; title: string; fix: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={`bt-flip${on ? ' bt-flip--on' : ''}`}
      aria-pressed={on}
      onClick={() => setOn(o => !o)}
    >
      <span className="bt-flip__kicker">{on ? 'The fix' : `Mistake ${n}`}</span>
      <span className="bt-flip__body">{on ? fix : title}</span>
      {!on && <span className="erf-flip__hint">Tap to see the fix</span>}
    </button>
  );
}

export default function FirstERDiagramsLesson() {
  return (
    <div>
      {/* ══ Before you start ═════════════════════════════════════════════ */}
      <section id="start" className="bt-sec">
        <Reveal>
          <section className="bt-lessonhead" aria-labelledby="lessonhead-title">
            <div>
              <p className="bt-eyebrow">Practice · ER diagram foundations</p>
              <h2 id="lessonhead-title">Your first ER diagrams</h2>
              <p className="bt-lessonhead__lead">
                An ER diagram is a drawing of the data a business needs to keep. You don’t need any software. A
                pencil is fine. This page gives you five short stories to practise on. Two easy ones first, then
                three a bit bigger.
              </p>
              <p className="bt-lessonmeta">
                <span>Time <b>about 90 minutes</b></span>
                <span>Assumes <b>the ER diagrams lesson</b></span>
                <span>You need <b>paper and a pencil</b></span>
              </p>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">By the end of this page you can</p>
              <ul className="bt-objectives">
                {[
                  'Pick out the entities in a short story',
                  'List each entity’s attributes and choose its key',
                  'Find the relationships and give each one a cardinality',
                  'Draw a full ER diagram in Chen’s notation',
                  'Name everything the same way, every time',
                  'Check your own drawing against a worked answer',
                ].map(o => (
                  <li key={o}>
                    <span className="bt-objectives__ring" aria-hidden="true" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="erf-calm">
            <p className="bt-eyebrow">First, a word from me</p>
            <p>
              Almost nobody gets their first ER diagram right. That’s fine. It isn’t a test. You’ll rub things
              out, move boxes around and change your mind. That is what drawing one looks like, even for people
              who have done it for years. Go slowly, check one part at a time, and you’ll be surprised how
              quickly it clicks.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ The four shapes ══════════════════════════════════════════════ */}
      <section id="shapes" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before you start · The shapes"
            title="Four shapes. That’s all."
            aside="Chen’s notation gives each shape one job. Learn these four and you can read every diagram on this page."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="erf-shapes">
            {SHAPES.map(s => (
              <div key={s.name} className="erf-shape">
                <ShapeSample kind={s.kind} label={s.label} />
                <h3>{s.name}</h3>
                <p>{s.what}</p>
                <p className="erf-shape__clue"><span>Clue in the story</span>{s.clue}</p>
              </div>
            ))}
          </div>
          <p className="bt-note">
            Lines join everything. An attribute is joined to the entity it describes. A relationship is joined to the
            two entities it links. Nothing floats on its own.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 className="bt-subhead">Name things the same way every time</h3>
          <p className="bt-prose">
            Later in the course, each entity becomes a table and each attribute becomes a column. Clean names now
            mean clean tables later. These are the rules we use on every diagram in MBI802.
          </p>
          <div className="bt-scroll">
            <table className="bt-plaintable erf-naming">
              <thead>
                <tr><th>Shape</th><th>The rule</th><th>Like this</th><th>Not like this</th></tr>
              </thead>
              <tbody>
                {NAMING.map(([shape, rule, good, bad]) => (
                  <tr key={shape}>
                    <td>{shape}</td>
                    <td>{rule}</td>
                    <td className="erf-naming__good">{shape === 'Key attribute' ? <span className="erf-key">{good}</span> : good}</td>
                    <td className="erf-naming__bad">{bad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ══ The routine ══════════════════════════════════════════════════ */}
      <section id="method" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before you start · The routine"
            title="Five steps, every time"
            aside="You don’t need to be clever to draw an ER diagram. You need a routine. Use this one on every task below."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="erf-method">
            <ol className="bt-flow">
              {STEPS.map(([title, body], i) => (
                <li key={title}>
                  <span className="bt-flow__n">{i + 1}</span>
                  <div>
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="erf-twoqbox">
              <p className="bt-eyebrow">The two questions</p>
              <h3>How many on each side?</h3>
              <p>For every diamond, ask one question from each side.</p>
              <dl className="erf-twoq">
                <div>
                  <dt>One CUSTOMER can own how many ACCOUNTs?</dt>
                  <dd>Many.</dd>
                </div>
                <div>
                  <dt>One ACCOUNT is owned by how many CUSTOMERs?</dt>
                  <dd>One.</dd>
                </div>
              </dl>
              <table className="erf-ratios">
                <tbody>
                  <tr><td>Both answers are “one”</td><td className="bt-tnum">1:1</td></tr>
                  <tr><td>One “one” and one “many”</td><td className="bt-tnum">1:N</td></tr>
                  <tr><td>Both answers are “many”</td><td className="bt-tnum">M:N</td></tr>
                </tbody>
              </table>
              <p className="erf-twoqbox__where">
                <b>Where do the numbers go?</b> Next to the entity they count. A customer has many accounts, so the N
                goes beside ACCOUNT. An account has one customer, so the 1 goes beside CUSTOMER.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ The five tasks ═══════════════════════════════════════════════ */}
      {TASKS.map(task => (
        <section key={task.id} id={task.id} className="bt-sec">
          <Reveal>
            <SectionHead
              eyebrow={`Task ${task.n} of ${TASKS.length} · ${task.level} · ${task.place}`}
              title={task.title}
              aside={task.aside}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <ERTask task={task} />
          </Reveal>
        </section>
      ))}

      {/* ══ Mistakes ═════════════════════════════════════════════════════ */}
      <section id="mistakes" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Worth knowing"
            title="Six mistakes everyone makes once"
            aside="I see these every trimester. Making one doesn’t mean you’re bad at this. It means you’re learning it. Tap each card to see the fix."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-flipgrid">
            {MISTAKES.map((m, i) => <FlipCard key={m.title} n={i + 1} {...m} />)}
          </div>
        </Reveal>
      </section>

      {/* ══ Quick check ══════════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Quick check"
            title="Seven quick questions"
            stop="."
            aside="Nothing is saved or marked. If you pick a wrong answer, read why. That’s where the learning is."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz questions={QUIZ} closing="All done. Go back to any task that still feels shaky and try it again." />
        </Reveal>
      </section>

      {/* ══ Recap ═════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 84 }}>
        <Recap
          title="If you can say it, you can draw it."
          points={[
            ['Nouns become rectangles.', 'Singular and in capitals. The business itself never gets a box.'],
            ['Facts become ellipses.', 'One fact each, joined to what it describes. The key is underlined.'],
            ['Verbs become diamonds.', 'In capitals, joined to the two entities they link.'],
            ['Ask two questions for every diamond.', 'One from each side. The number goes next to the entity it counts.'],
            ['A fact about the link sits on the diamond.', 'If it needs both sides to make sense, it belongs to neither on its own.'],
            ['Go by the story, not your guess.', 'The same two entities can be 1:N in one story and M:N in the next.'],
          ]}
        />
      </div>

      {/* ══ Next ══════════════════════════════════════════════════════════ */}
      <section id="next" className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>You’ve drawn five<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              If your diagrams look a little different from mine, that’s normal. Ask one question: does mine say the
              same thing? Same boxes, same keys, same diamonds, same numbers. Then you got it. Bring anything you’re
              unsure about to class. That’s what class is for.
            </p>
            <div className="bt-hero__cta" style={{ marginTop: 22 }}>
              <Link to="/er-activities" className="bt-btn">
                Next: five more, on your own
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </Link>
              <Link to="/er-diagrams" className="bt-btn bt-btn--tertiary">
                Go over the shapes again
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="bt-signoff__name">Yasas Sri Wickramasinghe, MBI802 lecturer</p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
