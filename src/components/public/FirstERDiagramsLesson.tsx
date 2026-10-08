import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import ERTask from './er/ERTask';
import { ShapeSample } from './er/ChenDiagram';
import { TASKS } from './er/firstTasks';
import { CARDINALITY, MISTAKES, NAMING, PDF_ANSWERS, PDF_DIR, PDF_TUTORIAL, SHAPES, STEPS } from './er/tutorial';

// ─── MBI802 · ER diagram tutorial ──────────────────────────────────────────
// A public, ungated Blend page (src/components/blend/README.md) on MBI802's
// warm orange. Practice for the ER diagrams lesson (/er-diagrams), for
// students drawing an ER diagram for the first time.
//
// It only uses what that lesson teaches: Chen's notation, the four shapes
// (entity, attribute, key attribute, relationship) and 1:1, 1:N and M:N,
// plus attributes on a relationship, introduced in Task 2.
//
// The same content is available as two printable PDFs, the tutorial and the
// answers, built from the same data by scripts/er-tutorial-pdf.

const BASE = import.meta.env.BASE_URL;
const TUTORIAL_PDF_URL = `${BASE}${PDF_DIR}/${PDF_TUTORIAL}`;
const ANSWERS_PDF_URL = `${BASE}${PDF_DIR}/${PDF_ANSWERS}`;

const QUIZ: QuizQuestion[] = [
  {
    q: 'Which name follows the naming rules for an entity?',
    answer: 2,
    options: [
      { text: 'Customers', why: 'This is plural and not in capitals. An entity name describes one instance.' },
      { text: 'customer', why: 'Singular is correct, but entity names are written in capitals.' },
      { text: 'CUSTOMER', why: 'Correct. A singular noun in capitals.' },
      { text: 'CUSTOMER_TABLE', why: 'Leave out “table”. It is an entity on the diagram and only becomes a table later.' },
    ],
  },
  {
    q: 'Which of these is drawn as a diamond?',
    answer: 1,
    options: [
      { text: 'BRANCH', why: 'BRANCH is a noun that the bank stores data about, so it is an entity (rectangle).' },
      { text: 'WORKS_AT', why: 'Correct. It is a verb that connects EMPLOYEE and BRANCH, so it is a relationship.' },
      { text: 'BranchCode', why: 'This is a fact about a branch, so it is an attribute. It is the key, so it is underlined.' },
      { text: 'City', why: 'City is a fact about a branch, so it is an attribute (ellipse).' },
    ],
  },
  {
    q: 'One nurse works in one ward. One ward has many nurses. Where does the N go?',
    answer: 0,
    options: [
      { text: 'Next to NURSE', why: 'Correct. There are many nurses for each ward, so N goes next to NURSE and 1 goes next to WARD.' },
      { text: 'Next to WARD', why: 'Each nurse works in only one ward, so WARD gets the 1. N goes next to NURSE.' },
      { text: 'Inside the diamond', why: 'The diamond holds the relationship name, WORKS_IN. The numbers go on the lines, next to the entities.' },
      { text: 'On both sides', why: 'That would mean many-to-many. Each nurse works in only one ward, so one side is 1.' },
    ],
  },
  {
    q: 'Each student gets a grade for each course they take. Where does Grade belong?',
    answer: 2,
    options: [
      { text: 'On STUDENT', why: 'A student in four courses has four grades, so a grade does not describe the student alone.' },
      { text: 'On COURSE', why: 'A course gives a different grade to each student, so a grade does not describe the course alone.' },
      { text: 'On the TAKES relationship', why: 'Correct. A grade describes one student in one course, so it belongs to the relationship.' },
      { text: 'As a separate entity', why: 'A grade is a single fact, not something with its own attributes, so it is an attribute.' },
    ],
  },
  {
    q: 'Which attribute is the best key for CUSTOMER?',
    answer: 2,
    options: [
      { text: 'LastName', why: 'Many people share a last name. A key must be different for every customer.' },
      { text: 'PhoneNumber', why: 'People change numbers, and family members can share one. A key should not repeat or change.' },
      { text: 'CustomerID', why: 'Correct. Each customer has their own ID, and it does not change.' },
      { text: 'FirstName', why: 'Many customers can have the same first name, so it cannot identify one customer.' },
    ],
  },
  {
    q: 'In Task 1 each account had one owner. In Task 4 an account can have many owners. What changed?',
    answer: 1,
    options: [
      { text: 'The entities', why: 'The entities are still CUSTOMER and ACCOUNT. A joint account is still an ACCOUNT.' },
      { text: 'The cardinality of OWNS', why: 'Correct. It changed from 1:N to M:N because the rule in the scenario changed.' },
      { text: 'The key of ACCOUNT', why: 'AccountNumber is still the key. Each account still has its own number.' },
      { text: 'Nothing', why: 'One account can now have many customers, which changes the cardinality.' },
    ],
  },
  {
    q: 'Which attribute name follows the naming rules?',
    answer: 2,
    options: [
      { text: 'date of birth', why: 'Attribute names do not have spaces.' },
      { text: 'DOB', why: 'Avoid short forms. Write the full words so everyone reads it the same way.' },
      { text: 'DateOfBirth', why: 'Correct. No spaces, and each word starts with a capital letter.' },
      { text: 'DATE_OF_BIRTH', why: 'Capitals with _ are used for entities and relationships, not attributes.' },
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
      <span className="bt-flip__kicker">{on ? 'How to fix it' : `Mistake ${n}`}</span>
      <span className="bt-flip__body">{on ? fix : title}</span>
      {!on && <span className="erf-flip__hint">Select to see the fix</span>}
    </button>
  );
}

/** The two PDF downloads: in the hero, and again at the top of the lesson. */
export function PdfDownloads({ small = false, tertiary = false }: { small?: boolean; tertiary?: boolean }) {
  const size = small ? ' bt-btn--sm' : '';
  const icon = small ? 12 : 14;
  return (
    <div className="erf-pdfs">
      <a className={`bt-btn${tertiary ? ' bt-btn--tertiary' : ''}${size}`} href={TUTORIAL_PDF_URL} download={PDF_TUTORIAL}>
        Download tutorial (PDF)
        <span className="bt-btn__badge" aria-hidden="true"><Download size={icon} /></span>
      </a>
      <a className={`bt-btn bt-btn--tertiary${size}`} href={ANSWERS_PDF_URL} download={PDF_ANSWERS}>
        Download answers (PDF)
        <span className="bt-btn__badge" aria-hidden="true"><Download size={icon} /></span>
      </a>
    </div>
  );
}

export default function FirstERDiagramsLesson() {
  return (
    <div>
      {/* ══ Introduction ══════════════════════════════════════════════════ */}
      <section id="start" className="bt-sec">
        <Reveal>
          <section className="bt-lessonhead" aria-labelledby="lessonhead-title">
            <div>
              <p className="bt-eyebrow">Tutorial · ER diagrams</p>
              <h2 id="lessonhead-title">ER diagram tutorial</h2>
              <p className="bt-lessonhead__lead">
                An ER diagram shows the data an organisation needs to store and how it is connected. This tutorial
                has five tasks: two simple ones and three moderate ones. For each task, read the scenario, answer
                the questions and draw the diagram on paper. Then check your work against the answer.
              </p>
              <p className="bt-lessonmeta">
                <span>Time <b>about 90 minutes</b></span>
                <span>Before this <b>the ER diagrams lesson</b></span>
                <span>You need <b>paper and a pencil</b></span>
              </p>
            </div>
            <div>
              <p className="bt-eyebrow bt-eyebrow--quiet">After this tutorial you should be able to</p>
              <ul className="bt-objectives">
                {[
                  'Identify the entities in a scenario',
                  'List the attributes of each entity and choose the key',
                  'Identify the relationships and their cardinality',
                  'Draw an ER diagram using Chen’s notation',
                  'Use the correct naming conventions',
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
          <div className="erf-printable">
            <div>
              <p className="bt-eyebrow">Printable version</p>
              <p>
                The same five tasks as a PDF you can print and write on. The answers are in a separate PDF, so you
                can try the tasks first.
              </p>
            </div>
            <PdfDownloads small />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="erf-calm">
            <p className="bt-eyebrow">Before you start</p>
            <p>
              Most people find their first ER diagram difficult, so don’t worry if yours takes a few attempts. You
              will probably move things around and redraw parts of it. Work slowly and check one part at a time.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ The four shapes ══════════════════════════════════════════════ */}
      <section id="shapes" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Part 1"
            title="Chen’s notation"
            aside="These four shapes are all you need for this tutorial. Each shape has one purpose."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="erf-shapes">
            {SHAPES.map(s => (
              <div key={s.name} className="erf-shape">
                <ShapeSample kind={s.kind} label={s.label} />
                <h3>{s.name} · {s.shape.toLowerCase()}</h3>
                <p>{s.what}</p>
                <p className="erf-shape__clue"><span>In the scenario</span>{s.clue}</p>
              </div>
            ))}
          </div>
          <p className="bt-note">
            Lines connect the shapes. Each attribute is connected to its entity, and each relationship is connected to
            the two entities it links.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 className="bt-subhead">Naming conventions</h3>
          <p className="bt-prose">
            Later in the course, each entity becomes a table and each attribute becomes a column. Using the same
            naming rules now makes that step easier. We use these rules for every diagram in MBI802.
          </p>
          <div className="bt-scroll">
            <table className="bt-plaintable erf-naming">
              <thead>
                <tr><th>Shape</th><th>Rule</th><th>Correct</th><th>Incorrect</th></tr>
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

      {/* ══ Steps ════════════════════════════════════════════════════════ */}
      <section id="method" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Part 2"
            title="How to draw an ER diagram"
            aside="Follow these steps for each task."
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
              <p className="bt-eyebrow">Step 5 in detail</p>
              <h3>Finding the cardinality</h3>
              <p>{CARDINALITY.intro}</p>
              <dl className="erf-twoq">
                {CARDINALITY.example.map(([q, a]) => (
                  <div key={q}>
                    <dt>{q}</dt>
                    <dd>{a}</dd>
                  </div>
                ))}
              </dl>
              <table className="erf-ratios">
                <tbody>
                  {CARDINALITY.rules.map(([when, ratio]) => (
                    <tr key={ratio}><td>{when}</td><td className="bt-tnum">{ratio}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="erf-twoqbox__where">
                <b>Where the numbers go.</b> {CARDINALITY.where}
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
            eyebrow="Part 3"
            title="Common mistakes"
            aside="These come up often in first ER diagrams. Select a card to see how to fix it."
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
            eyebrow="Part 4"
            title="Check your understanding"
            aside="Seven questions. Nothing is saved or marked. Read the explanation after each answer."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz questions={QUIZ} closing="Finished. If a question was unclear, go back to that part of the tutorial." />
        </Reveal>
      </section>

      {/* ══ Summary ═══════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 84 }}>
        <Recap
          title="Key points"
          points={[
            ['Entities are rectangles.', 'Use a singular noun in capitals. Do not draw the organisation itself.'],
            ['Attributes are ellipses.', 'Each one is a single fact connected to its entity. The key is underlined.'],
            ['Relationships are diamonds.', 'Use a verb in capitals and connect it to the two entities.'],
            ['Ask two questions for each relationship.', 'One from each side. Write each number next to the entity it counts.'],
            ['Some attributes belong to a relationship.', 'If a fact needs both entities to make sense, connect it to the diamond.'],
            ['Use the rules in the scenario.', 'The same two entities can be 1:N in one scenario and M:N in another.'],
          ]}
        />
      </div>

      {/* ══ Next ══════════════════════════════════════════════════════════ */}
      <section id="next" className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Next steps</p>
            <h2>More practice<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              Your diagrams may be laid out differently from the answers. That is fine if they have the same entities,
              keys, relationships and cardinalities. Bring any questions to class.
            </p>
            <div className="bt-hero__cta" style={{ marginTop: 22 }}>
              <Link to="/er-activities" className="bt-btn">
                ER diagrams in practice
                <span className="bt-btn__badge" aria-hidden="true">→</span>
              </Link>
              <Link to="/er-diagrams" className="bt-btn bt-btn--tertiary">
                Review the ER diagrams lesson
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
