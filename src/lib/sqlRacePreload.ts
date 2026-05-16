// 10 starter SQL challenges for MBI802 SQL Grand Prix
// Topics: CREATE DATABASE, CREATE TABLE, INSERT, SELECT (no JOINs, single table, no AUTO_INCREMENT)
//
// Dependency order:
//   Lap 1  — CREATE DATABASE          (no dependency)
//   Lap 2  — CREATE TABLE student     (needs Lap 1)
//   Lap 3  — INSERT single row        (needs Lap 2)
//   Lap 4  — INSERT multiple rows     (needs Lap 3)
//   Lap 5  — SELECT *                 (needs Lap 3–4)
//   Lap 6  — SELECT specific columns  (needs Lap 5)
//   Lap 7  — SELECT with WHERE        (needs Lap 5)
//   Lap 8  — SELECT with ORDER BY     (needs Lap 5)
//   Lap 9  — SELECT WHERE+ORDER BY+LIMIT  (needs Laps 7–8)
//   Lap 10 — CREATE TABLE course      (needs Lap 1; independent of INSERT/SELECT)

const STUDENT_SCHEMA = `-- Table: student
CREATE TABLE student (
    student_id   INT          PRIMARY KEY,
    full_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(100),
    gpa          DECIMAL(3,2)
);

-- Sample rows already inserted:
INSERT INTO student VALUES (101, 'Alice Chen',   'alice@uni.ac.nz',  3.75);
INSERT INTO student VALUES (102, 'Bob Kumar',    'bob@uni.ac.nz',    3.20);
INSERT INTO student VALUES (103, 'Chloe Park',   'chloe@uni.ac.nz',  3.90);
INSERT INTO student VALUES (104, 'David Tran',   'david@uni.ac.nz',  2.85);
INSERT INTO student VALUES (105, 'Emma Wilson',  'emma@uni.ac.nz',   3.55);`;

export interface PreloadChallenge {
  title: string;
  description: string;
  schemaContext: string;
  question: string;
  requiredKeywords: string[];
  pointValue: number;
  sortOrder: number;
}

export const PRELOADED_CHALLENGES: PreloadChallenge[] = [
  // ── 1. CREATE DATABASE ─────────────────────────────────────────────────────
  {
    sortOrder: 1,
    title: 'Lap 1 — Create the Database',
    description:
      'Every database project begins with a database. Create the university database before any tables can be built. Start here.',
    schemaContext: '',
    question: 'Write the SQL statement to create a database called university.',
    requiredKeywords: ['create', 'database', 'university'],
    pointValue: 5,
  },

  // ── 2. CREATE TABLE student ────────────────────────────────────────────────
  // Depends on: Lap 1
  {
    sortOrder: 2,
    title: 'Lap 2 — Create the Student Table',
    description:
      'Define the structure that will store student records. Complete Lap 1 (Create the Database) before attempting this.',
    schemaContext: '-- You are working inside the university database.',
    question:
      'Create a table called student with the following columns:\n' +
      '  • student_id   INT            (Primary Key)\n' +
      '  • full_name    VARCHAR(100)   (must not be null)\n' +
      '  • email        VARCHAR(100)\n' +
      '  • gpa          DECIMAL(3,2)',
    requiredKeywords: ['create', 'table', 'student', 'primary key'],
    pointValue: 10,
  },

  // ── 3. INSERT single row ───────────────────────────────────────────────────
  // Depends on: Lap 2 (student table must exist)
  {
    sortOrder: 3,
    title: 'Lap 3 — Insert a Single Student',
    description:
      'Now that the student table exists, add your first row of data. Complete Lap 2 (Create the Student Table) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Insert ONE new student into the student table with the following values:\n' +
      "  student_id = 106, full_name = 'Frank Lima', email = 'frank@uni.ac.nz', gpa = 3.10",
    requiredKeywords: ['insert', 'into', 'student', 'values'],
    pointValue: 8,
  },

  // ── 4. INSERT multiple rows ────────────────────────────────────────────────
  // Depends on: Lap 3 (builds directly on single-row INSERT)
  {
    sortOrder: 4,
    title: 'Lap 4 — Bulk Insert Three Students',
    description:
      'Extend your INSERT skills by adding multiple rows in a single statement. Complete Lap 3 (Insert a Single Student) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Insert ALL THREE of the following students using a SINGLE INSERT statement:\n' +
      "  (107, 'Grace Osei',   'grace@uni.ac.nz',   3.80)\n" +
      "  (108, 'Henry Zhao',   'henry@uni.ac.nz',   2.95)\n" +
      "  (109, 'Isla Nguyen',  'isla@uni.ac.nz',    3.45)",
    requiredKeywords: ['insert', 'into', 'student', 'values'],
    pointValue: 12,
  },

  // ── 5. SELECT all columns and rows ────────────────────────────────────────
  // Depends on: Laps 3–4 (rows must exist to see meaningful output)
  {
    sortOrder: 5,
    title: 'Lap 5 — Retrieve All Student Records',
    description:
      'The most fundamental SELECT query — return every column and every row from a table. Complete Laps 3–4 (INSERT challenges) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Write a SELECT query to retrieve ALL columns and ALL rows from the student table.',
    requiredKeywords: ['select', '*', 'from', 'student'],
    pointValue: 5,
  },

  // ── 6. SELECT specific columns ────────────────────────────────────────────
  // Depends on: Lap 5
  {
    sortOrder: 6,
    title: 'Lap 6 — Contact List (Select Specific Columns)',
    description:
      'You do not always need every column. Practice selecting only the fields you need. Complete Lap 5 (Retrieve All Student Records) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Retrieve ONLY the full_name and email columns for every student in the student table.',
    requiredKeywords: ['select', 'full_name', 'email', 'from', 'student'],
    pointValue: 8,
  },

  // ── 7. SELECT with WHERE ──────────────────────────────────────────────────
  // Depends on: Lap 5
  {
    sortOrder: 7,
    title: 'Lap 7 — Honour Roll (Filter with WHERE)',
    description:
      'Use a WHERE clause to filter rows that meet a condition. Complete Lap 5 (Retrieve All Student Records) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Retrieve all columns for students whose GPA is greater than 3.5.',
    requiredKeywords: ['select', 'from', 'student', 'where', 'gpa'],
    pointValue: 10,
  },

  // ── 8. SELECT with ORDER BY ───────────────────────────────────────────────
  // Depends on: Lap 5
  {
    sortOrder: 8,
    title: 'Lap 8 — Rankings (Sort with ORDER BY)',
    description:
      'Use ORDER BY to control the sequence of your results. Complete Lap 5 (Retrieve All Student Records) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Retrieve all columns from the student table, sorted by GPA from highest to lowest.',
    requiredKeywords: ['select', 'from', 'student', 'order by', 'gpa', 'desc'],
    pointValue: 12,
  },

  // ── 9. SELECT WHERE + ORDER BY + LIMIT ───────────────────────────────────
  // Depends on: Laps 7 and 8 (WHERE and ORDER BY must be understood)
  {
    sortOrder: 9,
    title: 'Lap 9 — Top Performers (Filter, Sort & Limit)',
    description:
      'Combine WHERE, ORDER BY and LIMIT in a single query to produce a ranked shortlist. Complete Laps 7 and 8 (WHERE and ORDER BY) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Retrieve the full_name and gpa of students with a GPA of 3.0 or above, sorted by GPA from highest to lowest. Return only the top 3 results.',
    requiredKeywords: [
      'select', 'full_name', 'gpa', 'from', 'student',
      'where', 'order by', 'desc', 'limit',
    ],
    pointValue: 15,
  },

  // ── 10. CREATE TABLE course ───────────────────────────────────────────────
  // Depends on: Lap 1 (database must exist); independent of INSERT/SELECT laps
  {
    sortOrder: 10,
    title: 'Lap 10 — Create the Course Table',
    description:
      'Extend the university schema with a second table. This challenge is independent of the INSERT and SELECT laps — you only need Lap 1 (Create the Database) done first.',
    schemaContext:
      '-- You are working inside the university database.\n' +
      '-- The student table already exists.',
    question:
      'Create a table called course with the following columns:\n' +
      '  • course_code   CHAR(6)        (Primary Key)\n' +
      '  • course_name   VARCHAR(150)   (must not be null)\n' +
      '  • credits       INT\n' +
      '  • department    VARCHAR(50)',
    requiredKeywords: ['create', 'table', 'course', 'primary key'],
    pointValue: 10,
  },
];

// Maps every known historical title → correct sortOrder.
// Used by the "Sync Starter Challenges" function to patch existing
// Firestore documents in-place (preserving IDs and student submissions).
export const TITLE_TO_SORT_ORDER: Record<string, number> = {
  // v1 — original titles (loaded before any PR fixes)
  'Race Start: Create the Database': 1,
  'Build the Students Table': 2,
  'Add Your First Student': 3,
  'Bulk Enrolment — Insert Three Students': 4,
  'Retrieve All Students': 5,
  'Contact List — Specific Columns': 6,
  'Honour Roll — Filter by GPA': 7,
  'Rankings — Sort by GPA': 8,
  'Top Performers — Filter, Sort & Limit': 9,
  'Create the Courses Table': 10,
  // v2 — "Lap N" titles (loaded after previous PR, before this fix)
  'Lap 1 — Create the Database': 1,
  'Lap 2 — Create the Student Table': 2,
  'Lap 3 — Create the Course Table': 10,        // old position 3 → new position 10
  'Lap 4 — Insert a Single Student': 3,          // old position 4 → new position 3
  'Lap 5 — Bulk Insert Three Students': 4,
  'Lap 6 — Retrieve All Student Records': 5,
  'Lap 7 — Contact List (Select Specific Columns)': 6,
  'Lap 8 — Honour Roll (Filter with WHERE)': 7,
  'Lap 9 — Rankings (Sort with ORDER BY)': 8,
  'Lap 10 — Top Performers (Filter, Sort & Limit)': 9,
};
