import { ExternalLink } from 'lucide-react';
import { Reveal, SaveAsPdf, SectionHead } from '../blend';
import HospitalSheets from './dbms/HospitalSheets';
import DataToInformation from './dbms/DataToInformation';
import DataOrInformation from './dbms/DataOrInformation';
import WebAppStack from './dbms/WebAppStack';
import { DBMS_NOTES } from '../../content/notes/mbi802Dbms';

// ─── MBI802: Introduction to Database Management Systems ──────────────────
// A public, ungated course intro page in Blended Teaching Content's
// course-page design system, Blend (src/components/blend/README.md) —
// warm paper, one rationed accent, Manrope display type, pill actions.
//
// Nothing is pinned to a class number or a calendar day. The page describes
// the course and its lessons, which are stable; when it is read is not.
//
// The page is ordered to earn attention before it asks for any: it opens by
// letting you break a hospital's spreadsheet and turn a bare 85 into a
// sentence, and only then explains what the course is and how it is laid
// out. That ordering is deliberate — it is how the material itself builds.
//
// Every example, SQL snippet, diagram and video thumbnail is real material
// from the course: the MBI802 study pack chapters (study-pack/content/mbi802
// /lessons) and the video thumbnails from inside the course. Nothing here is
// a generic stock example.

const BASE = import.meta.env.BASE_URL;

interface OutlineLesson {
  n: string;
  title: string;
  subtitle: string;
  objective: string;
  here?: boolean;
}

// No outward links: the interactive lesson pages these would point to
// (/sql-programming, /er-diagrams, and so on) are still behind the
// platform's lesson password, and this page is meant to be openly
// shareable. Add links back once those pages are unlocked.
const OUTLINE: OutlineLesson[] = [
  {
    n: '01',
    title: 'Introduction to DBMS',
    subtitle: 'Data vs information, why file-based systems fail, the relational model, setting up MySQL.',
    objective: 'You are reading this lesson right now.',
    here: true,
  },
  {
    n: '02',
    title: 'SQL Programming Fundamentals',
    subtitle: 'The language of relational databases. Data types, CREATE, INSERT, and your first SELECT queries.',
    objective: 'Write DDL statements and insert your first rows into a real table.',
  },
  {
    n: '03',
    title: 'Advanced SQL Queries',
    subtitle: 'Filtering, sorting, safe UPDATE and DELETE, aggregate functions, and your first JOIN.',
    objective: 'Combine two related tables with an INNER JOIN.',
  },
  {
    n: '04',
    title: 'ER Diagrams Foundations',
    subtitle: "Chen's notation. Entities, attributes, keys, relationships, and cardinality.",
    objective: 'Draw a complete ER diagram from a written scenario.',
  },
  {
    n: '05',
    title: 'Advanced ER Concepts',
    subtitle: 'Weak entities, composite and multivalued attributes, and total vs partial participation.',
    objective: 'Apply the full Chen symbol set to a scenario you have not seen before.',
  },
  {
    n: '06',
    title: 'ER to Relational Mapping',
    subtitle: 'The eight rules that turn any ER diagram into a complete set of tables.',
    objective: 'Turn a diagram into a schema without guessing.',
  },
  {
    n: '07',
    title: 'Database Normalization',
    subtitle: 'Functional dependencies, 1NF through BCNF, and decomposing a messy table properly.',
    objective: 'Take a table that contradicts itself and split it until it doesn’t.',
  },
  {
    n: '08',
    title: 'Consolidation & Exam Preparation',
    subtitle: 'The full pipeline from raw data to a normalized, queryable database. Where to go next.',
    objective: 'Build a small database end to end, on your own.',
  },
];

const ACTIVITIES: [string, string][] = [
  ['Fix a hospital’s spreadsheet problem', 'The same exercise you just did at the top of this page, but in pairs and on paper. We name every failure, then name the DBMS feature that answers it.'],
  ['Write your first working queries', 'CREATE a table, INSERT real rows, and get a real result back from SELECT. Then filter it, sort it, and join it to a second table.'],
  ['Model a real system as an ER diagram', 'Five scenarios to choose from: a library, a university, a hospital, an online store, a hotel. You draw the diagram, then check it against a worked answer.'],
  ['Get your own SQL scenario', 'Later in the course you get a personal, randomly assigned scenario — a library, a gym, a car rental company — and build a small working database for it from scratch.'],
  ['Decompose a table that contradicts itself', 'Take an unnormalized table with real update and deletion problems, and split it, step by step, into a clean design.'],
];

const RESOURCES: [string, string][] = [
  ['The written study pack', 'A full study pack for MBI802, typeset as a proper book, with worked examples and answer keys for every chapter.'],
  ['Two knowledge checks', 'A 38 question check at the end of the DBMS section and a separate 20 question ER check. Instant feedback, and a badge if you do well.'],
  ['A TA verified SQL lab', 'You get a personal scenario, build the database, and a teaching assistant reads your actual schema. Not a marking rubric — a person.'],
  ['Nine free certifications', 'Genuinely free database certifications you can add to your profile once you are comfortable with SQL.'],
];

const VIDEO_PREVIEWS = [
  { title: 'Normalization, Introduction', file: 'NormIntro.png' },
  { title: 'Normalization, Why Normalise?', file: 'NormWhy.png' },
  { title: 'Normalization, First Normal Form', file: 'Norm1NF.png' },
  { title: 'Advanced ER, Activity Walkthrough', file: 'Activity1.png' },
];

function Figure({ src, caption, maxWidth = 560 }: { src: string; caption: string; maxWidth?: number }) {
  return (
    <figure className="bt-figure">
      <div className="bt-figure__frame">
        <img src={src} alt={caption} style={{ maxWidth, width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Code({ children, title }: { children: string; title?: string }) {
  return (
    <div className="bt-code">
      {title && <div className="bt-code__bar"><span className="bt-dot" style={{ background: 'var(--green-500)' }} />{title}</div>}
      <pre>{children}</pre>
    </div>
  );
}

export default function IntroToDBMSLesson() {
  return (
    <div>
      {/* ══ 1.2 — break a file-based system ══════════════════════════════ */}
      <section id="break" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 1.2 · Why file-based systems fail"
            title="The hospital spreadsheet"
            aside="Three sheets, one patient. Her details were typed into all three because nobody had a database. Change her address, save it, then check the other tabs."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <HospitalSheets />
        </Reveal>
      </section>

      {/* ══ 1.1 — data vs information ════════════════════════════════════ */}
      <section id="meaning" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 1.1 · Data vs information"
            title="Data and information"
            aside="Data is raw. Information is data with context and processing applied to it. Add the pieces below and the difference gets obvious."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <DataToInformation />
        </Reveal>
        <Reveal delay={0.05}>
          <h3 className="bt-subhead">Now tell them apart</h3>
          <p className="bt-note" style={{ maxWidth: '62ch' }}>
            Six items from the chapter. Some are raw, some have had context and processing applied. An exam
            will ask you to classify them and justify each in a sentence, and the justification carries the
            marks.
          </p>
          <DataOrInformation />
        </Reveal>
      </section>

      {/* ══ Where a database sits in a real system ═══════════════════════ */}
      <section id="stack" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 1.3 · The relational model at work"
            title="Where the database actually sits"
            aside="Every site you use runs on one, but almost nobody can say where. Walk a single click through the system and watch the SQL appear in the middle of it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <WebAppStack />
        </Reveal>
      </section>

      {/* ══ What this course is ══════════════════════════════════════════ */}
      <section id="course" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="What this course is"
            title="Database Management Systems"
            stop="."
            aside="15 credits, Level 8, no prerequisites. Plenty of people arrive having never opened a database."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Over the trimester you’ll design relational databases, query them with SQL, and think about who
              gets access to the data you’re storing. 150 learning hours: 36 in class with me, 114 on your own.
            </p>
            <p>
              By the end you should be able to decide who gets access to data and why, judge whether a design
              will hold up under real use, and look at someone else’s database and say what’s wrong with it.
              Most of your career will be spent on databases other people built, so that last one gets a lot of
              attention.
            </p>
          </div>

          <div className="bt-stats">
            <div><b className="bt-tnum">15</b><span>Credits, Level 8, no prerequisites</span></div>
            <div><b className="bt-tnum">150</b><span>Learning hours: 36 in class, 114 yours</span></div>
            <div><b className="bt-tnum">8</b><span>Lessons, in a deliberate order</span></div>
            <div><b className="bt-tnum">58</b><span>Knowledge-check questions with instant feedback</span></div>
          </div>
        </Reveal>
      </section>

      {/* ══ Outline ══════════════════════════════════════════════════════ */}
      <section id="outline" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The lesson outline"
            title="Eight lessons"
            aside="The same structure the study pack and the lesson plans follow. Each lesson assumes the one before it."
          />
        </Reveal>
        {/* A numbered track rather than eight identical cards: the content is
            genuinely a sequence, and each row carries the one thing you should
            be able to do by the end of it. */}
        <Reveal delay={0.05}>
          <ol className="bt-track">
            {OUTLINE.map(lesson => (
              <li key={lesson.n} className={`bt-trackrow${lesson.here ? ' bt-trackrow--here' : ''}`}>
                <span className="bt-trackrow__n bt-tnum" aria-hidden="true">{lesson.n}</span>
                <div className="bt-trackrow__body">
                  <h3>
                    {lesson.title}
                    {lesson.here && <span className="bt-here">You are here</span>}
                  </h3>
                  <p>{lesson.subtitle}</p>
                </div>
                <p className="bt-trackrow__obj">
                  <span>By the end</span>
                  {lesson.objective}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ══ Preview ══════════════════════════════════════════════════════ */}
      <section id="preview" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="A small preview"
            title="Some of what's coming"
            aside="Examples from the actual lessons. There's a good deal more once we get going."
          />
        </Reveal>

        <div className="bt-preview">
          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">01</span>
              <div>
                <h3>Data and information</h3>
                <p className="bt-prose">
                  Same idea as the widget at the top of the page. Learn the four quality characteristics
                  properly — you’ll be asked to name them.
                </p>
                <Figure src={`${BASE}mbi802/data-to-information.svg`} caption="From the Lesson 1 chapter: data becomes information through processing and context." />
                <div className="bt-scroll">
                  <table className="bt-plaintable">
                    <thead>
                      <tr><th>Quality information is</th><th>Meaning</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Accurate</td><td>Reflects reality. Wrong information is worse than none.</td></tr>
                      <tr><td>Complete</td><td>Nothing essential is missing from the picture.</td></tr>
                      <tr><td>Timely</td><td>Current, and available when the decision is made.</td></tr>
                      <tr><td>Relevant</td><td>Actually useful for the decision at hand.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">02</span>
              <div>
                <h3>Writing SQL</h3>
                <p className="bt-prose">
                  A real table, real rows, and a query that returns something. This is the code from Lesson 2.
                </p>
                <Code title="lesson02_sql_fundamentals.sql">{`CREATE DATABASE school_db;
USE school_db;

CREATE TABLE students (
  id     INT PRIMARY KEY,
  name   VARCHAR(100),
  age    INT,
  email  VARCHAR(150),
  gpa    DECIMAL(3,2)
);

INSERT INTO students (id, name, age, email, gpa)
VALUES
  (1, 'Alice', 20, 'alice@uni.edu', 3.80),
  (2, 'Bob',   22, 'bob@uni.edu',   3.50),
  (3, 'Carol', 21, 'carol@uni.edu', 3.90);

SELECT name AS 'Student Name',
       gpa  AS 'Grade Point'
FROM   students;`}</Code>
                <p className="bt-note">
                  A few lessons later you do the same thing again, but with a table you designed yourself, for
                  a scenario chosen for you: a library, a hospital, a hotel, a gym. Everyone gets a different one.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">03</span>
              <div>
                <h3>Designing before building</h3>
                <p className="bt-prose">
                  An architect plans the rooms before anyone pours concrete. We plan the tables before anyone
                  writes CREATE TABLE. Chen’s notation is what we use for the whole course.
                </p>
                <Figure src={`${BASE}mbi802/chen-shapes.svg`} caption="From the Lesson 4 chapter: the four Chen notation shapes, and what each one becomes in the database." />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">04</span>
              <div>
                <h3>Cleaning up a bad table</h3>
                <p className="bt-prose">
                  From the normalization chapter. It records students, departments and courses in one table.
                  The red columns are where it goes wrong.
                </p>
                <div className="bt-scroll bt-badtable">
                  <table className="bt-grid">
                    <thead>
                      <tr>
                        <th>StudentID</th><th>Name</th><th>Dept</th><th>DeptHead</th>
                        <th className="bt-th--bad">Courses</th><th className="bt-th--bad">Instructor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>S1</td><td>Alice</td><td>CS</td><td>Dr. Smith</td>
                        <td className="bt-td--bad">DB, OS, Networks</td><td className="bt-td--bad">Lee, Ray, Kim</td>
                      </tr>
                      <tr>
                        <td>S2</td><td>Bob</td><td>CS</td><td>Dr. Smith</td>
                        <td className="bt-td--bad">DB, AI</td><td className="bt-td--bad">Lee, Patel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="bt-prose">
                  If Dr. Smith leaves, every CS row needs updating and it’s easy to miss one. That’s an update
                  anomaly — one of three problems here. We name all three, then split the table until it stops
                  contradicting itself.
                </p>
                <Figure src={`${BASE}mbi802/nf-ladder.svg`} caption="From the Lesson 7 chapter: the normalization ladder, 1NF through BCNF." maxWidth={480} />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bt-step">
              <span className="bt-step__n">05</span>
              <div>
                <h3>Recordings</h3>
                <p className="bt-prose">
                  Every lecture is recorded, and there are extra videos on top of that. A few thumbnails from
                  inside the course:
                </p>
                <div className="bt-videos">
                  {VIDEO_PREVIEWS.map(v => (
                    <figure key={v.file}>
                      <div className="bt-videos__frame">
                        <img src={`${BASE}${v.file}`} alt={v.title} loading="lazy" />
                      </div>
                      <figcaption>{v.title}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Activities ═══════════════════════════════════════════════════ */}
      <section id="practice" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="What you'll do"
            title="Activities from the course"
            aside="Each one has a worked answer to check yourself against."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-activities">
            {ACTIVITIES.map(([title, body], i) => (
              <div key={title} className="bt-activity">
                <span className="bt-activity__n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Resources ════════════════════════════════════════════════════ */}
      <section id="resources" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Beyond this page"
            title="What else you get"
            aside="A few things that open up once you're enrolled."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-resources">
            {RESOURCES.map(([title, body]) => (
              <div key={title} className="bt-card">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <SaveAsPdf doc={DBMS_NOTES} />

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>See you in class<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              That’s roughly where MBI802 starts. The rest is eight lessons of doing it properly, with someone
              to ask when it doesn’t work. Bring questions.
            </p>
            <p className="bt-signoff__name">
              Yasas Sri Wickramasinghe
              <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer">
                MBI802 lecturer <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
