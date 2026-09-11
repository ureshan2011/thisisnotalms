import { ExternalLink } from 'lucide-react';
import Reveal from './Reveal';
import HospitalSheets from './dbms/HospitalSheets';
import DataToInformation from './dbms/DataToInformation';

// ─── MBI802, Class 1: Introduction to Database Management Systems ─────────
// A public, ungated "Day 1" course page, dressed in the ICTCAMPUS design
// system (see src/styles/ictcampus.css) — warm cream, one rationed orange,
// Manrope display type at negative tracking, and pill-shaped actions.
//
// The page is ordered to earn attention before it asks for any: it opens by
// letting you break a hospital's spreadsheet and turn a bare 85 into a
// sentence, and only then explains what the course is and how it is laid
// out. That ordering is deliberate — it is how the real first class runs.
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
    objective: 'Take a table that contradicts itself and split it until it does not.',
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

function SectionHead({ eyebrow, title, stop, aside }: { eyebrow: string; title: string; stop?: string; aside: string }) {
  return (
    <div className="ict-sechead">
      <div>
        <p className="ict-eyebrow">{eyebrow}</p>
        <h2>
          {title}
          {stop && <span className="ict-stop">{stop}</span>}
        </h2>
      </div>
      <p className="ict-aside">{aside}</p>
    </div>
  );
}

function Figure({ src, caption, maxWidth = 560 }: { src: string; caption: string; maxWidth?: number }) {
  return (
    <figure className="ict-figure">
      <div className="ict-figure__frame">
        <img src={src} alt={caption} style={{ maxWidth, width: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Code({ children, title }: { children: string; title?: string }) {
  return (
    <div className="ict-code">
      {title && <div className="ict-code__bar"><span className="ict-dot" style={{ background: 'var(--green-500)' }} />{title}</div>}
      <pre>{children}</pre>
    </div>
  );
}

export default function IntroToDBMSLesson() {
  return (
    <div>
      {/* ══ 1.2 — break a file-based system ══════════════════════════════ */}
      <section id="break" className="ict-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 1.2 · Why file-based systems fail"
            title="Change her address. Watch what breaks"
            stop="."
            aside="Three sheets. One patient. Her details were typed into all three, because that is what happens when nobody has a database. Give her a new address, save it, then open the other tabs and see which sheets now disagree."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <HospitalSheets />
        </Reveal>
      </section>

      {/* ══ 1.1 — data vs information ════════════════════════════════════ */}
      <section id="meaning" className="ict-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 1.1 · Data vs information"
            title="85 means nothing. Add context and it decides things"
            stop="."
            aside="This is the idea the whole course sits on, and it is simpler than it sounds. Data is raw. Information is data that has been processed and given context. Add the pieces and watch a number turn into something somebody can act on."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <DataToInformation />
        </Reveal>
      </section>

      {/* ══ What this course is ══════════════════════════════════════════ */}
      <section id="course" className="ict-sec">
        <Reveal>
          <SectionHead
            eyebrow="What this course is"
            title="Database Management Systems"
            stop="."
            aside="15 credits, Level 8, no prerequisites. Everyone starts from the same place — including the people who have never opened a database in their life."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="ict-prose">
            <p>
              Over the trimester you will design relational databases, query them with SQL, and think about
              who owns the data you are storing and why that matters. It is 150 learning hours in total.
              36 of those are in class with me, and 114 are yours, spent building and fixing things on your own.
            </p>
            <p>
              By the end of the course, you should be able to do three things: make good decisions about who
              gets access to data and why, judge whether a database design will actually hold up under real use,
              and look at someone else’s database and say what is wrong with it and how to fix it. That last one
              matters more than it sounds. Most of your career will be spent working with databases other people
              built, not ones you designed from scratch.
            </p>
          </div>

          <div className="ict-stats">
            <div><b className="ict-tnum">15</b><span>Credits, Level 8, no prerequisites</span></div>
            <div><b className="ict-tnum">150</b><span>Learning hours: 36 in class, 114 yours</span></div>
            <div><b className="ict-tnum">8</b><span>Lessons, in a deliberate order</span></div>
            <div><b className="ict-tnum">58</b><span>Knowledge-check questions with instant feedback</span></div>
          </div>
        </Reveal>
      </section>

      {/* ══ Outline ══════════════════════════════════════════════════════ */}
      <section id="outline" className="ict-sec">
        <Reveal>
          <SectionHead
            eyebrow="The lesson outline"
            title="Eight lessons, in order"
            stop="."
            aside="The real structure of the course, the same one the study pack and the lesson plans follow. Each one assumes the one before it, so the order is not a suggestion."
          />
        </Reveal>
        {/* A numbered track rather than eight identical cards: the content is
            genuinely a sequence, and each row carries the one thing you should
            be able to do by the end of it. */}
        <Reveal delay={0.05}>
          <ol className="ict-track">
            {OUTLINE.map(lesson => (
              <li key={lesson.n} className={`ict-trackrow${lesson.here ? ' ict-trackrow--here' : ''}`}>
                <span className="ict-trackrow__n ict-tnum" aria-hidden="true">{lesson.n}</span>
                <div className="ict-trackrow__body">
                  <h3>
                    {lesson.title}
                    {lesson.here && <span className="ict-here">You are here</span>}
                  </h3>
                  <p>{lesson.subtitle}</p>
                </div>
                <p className="ict-trackrow__obj">
                  <span>By the end</span>
                  {lesson.objective}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ══ Preview ══════════════════════════════════════════════════════ */}
      <section id="preview" className="ict-sec">
        <Reveal>
          <SectionHead
            eyebrow="A small preview"
            title="Here is some of what is coming"
            stop="."
            aside="Pulled straight from the actual lessons. There is a lot more inside once we get going — I am showing you these so you know what the course will feel like, not just what it is called."
          />
        </Reveal>

        <div className="ict-preview">
          <Reveal>
            <div className="ict-step">
              <span className="ict-step__n">01</span>
              <div>
                <h3>First, we separate data from information.</h3>
                <p className="ict-prose">
                  You did the interactive version of this at the top of the page. In the chapter it looks like
                  this, and the four quality characteristics get a table of their own, because a marker will
                  ask you to name them.
                </p>
                <Figure src={`${BASE}mbi802/data-to-information.svg`} caption="From the Lesson 1 chapter: data becomes information through processing and context." />
                <div className="ict-scroll">
                  <table className="ict-plaintable">
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
            <div className="ict-step">
              <span className="ict-step__n">02</span>
              <div>
                <h3>Then you start writing SQL.</h3>
                <p className="ict-prose">
                  Not toy examples. A real table, real rows, and a query that actually returns something.
                  This is the exact code from Lesson 2.
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
                <p className="ict-note">
                  A few lessons later you do the same thing again, but with a table you designed yourself, for
                  a scenario chosen for you: a library, a hospital, a hotel, a gym. Everyone gets a different one.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="ict-step">
              <span className="ict-step__n">03</span>
              <div>
                <h3>A few classes in, we design before we build.</h3>
                <p className="ict-prose">
                  I like to compare it to an architect’s drawing. An architect plans the rooms before anyone
                  pours concrete. We plan the tables before anyone writes CREATE TABLE. This is Chen’s notation,
                  the diagramming style we use for the whole course.
                </p>
                <Figure src={`${BASE}mbi802/chen-shapes.svg`} caption="From the Lesson 4 chapter: the four Chen notation shapes, and what each one becomes in the database." />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="ict-step">
              <span className="ict-step__n">04</span>
              <div>
                <h3>By Lesson 7, we clean up a table that was never designed properly.</h3>
                <p className="ict-prose">
                  A real example from the normalization chapter. It tries to record students, departments and
                  courses all in one table. The red columns are where it goes wrong.
                </p>
                <div className="ict-scroll ict-badtable">
                  <table className="ict-grid">
                    <thead>
                      <tr>
                        <th>StudentID</th><th>Name</th><th>Dept</th><th>DeptHead</th>
                        <th className="ict-th--bad">Courses</th><th className="ict-th--bad">Instructor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>S1</td><td>Alice</td><td>CS</td><td>Dr. Smith</td>
                        <td className="ict-td--bad">DB, OS, Networks</td><td className="ict-td--bad">Lee, Ray, Kim</td>
                      </tr>
                      <tr>
                        <td>S2</td><td>Bob</td><td>CS</td><td>Dr. Smith</td>
                        <td className="ict-td--bad">DB, AI</td><td className="ict-td--bad">Lee, Patel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="ict-prose">
                  If Dr. Smith leaves, every CS row needs updating, and it is easy to miss one. That is an update
                  anomaly, one of three problems this design has. We will name all three, then split this into
                  clean tables that do not contradict themselves — which is the same instinct you used on the
                  hospital sheets, done formally.
                </p>
                <Figure src={`${BASE}mbi802/nf-ladder.svg`} caption="From the Lesson 7 chapter: the normalization ladder, 1NF through BCNF." maxWidth={480} />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="ict-step">
              <span className="ict-step__n">05</span>
              <div>
                <h3>And some of it, you will just watch.</h3>
                <p className="ict-prose">
                  You will receive a video recording for every lecture, plus additional video resources on top
                  of that. These are a few of the actual thumbnails from inside the course.
                </p>
                <div className="ict-videos">
                  {VIDEO_PREVIEWS.map(v => (
                    <figure key={v.file}>
                      <div className="ict-videos__frame">
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
      <section id="practice" className="ict-sec">
        <Reveal>
          <SectionHead
            eyebrow="What you'll actually do"
            title="Not hypothetical exercises"
            stop="."
            aside="Every one of these is a real activity from the course, with a worked answer waiting on the other side of it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="ict-activities">
            {ACTIVITIES.map(([title, body], i) => (
              <div key={title} className="ict-activity">
                <span className="ict-activity__n">{String(i + 1).padStart(2, '0')}</span>
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
      <section id="resources" className="ict-sec">
        <Reveal>
          <SectionHead
            eyebrow="Beyond this page"
            title="There is more waiting through the course"
            stop="."
            aside="A few things you get access to as we go. Not all of it is visible from here, which is the point of enrolling."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="ict-resources">
            {RESOURCES.map(([title, body]) => (
              <div key={title} className="ict-card">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="ict-sec">
        <Reveal>
          <div className="ict-signoff">
            <p className="ict-eyebrow">Your lecturer</p>
            <h2>See you in class<span className="ict-stop">.</span></h2>
            <p className="ict-signoff__body">
              You have just done the first half of class one — you broke a file-based system, named what went
              wrong, and turned data into information. That is genuinely where MBI802 starts. The rest is eight
              lessons of doing it properly, with someone to ask when it does not work.
            </p>
            <p className="ict-signoff__name">
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
