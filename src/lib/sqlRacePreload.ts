// 10 starter SQL challenges for MBI802 SQL Grand Prix
// Topics: CREATE DATABASE, CREATE TABLE, INSERT, SELECT (no JOINs, single table, no AUTO_INCREMENT)
// Challenge order: DDL (1-3) → DML / INSERT (4-5) → DQL / SELECT simple-to-complex (6-10)

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
  // No dependencies — start here.
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
  // Depends on: Challenge 1 (database must exist).
  {
    sortOrder: 2,
    title: 'Lap 2 — Create the Student Table',
    description:
      'Define the structure that will store student records. Complete Challenge 1 (Create the Database) before attempting this.',
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

  // ── 3. CREATE TABLE course ─────────────────────────────────────────────────
  // Depends on: Challenge 2 (student table must exist first to establish context).
  {
    sortOrder: 3,
    title: 'Lap 3 — Create the Course Table',
    description:
      'Add a second table to the university database. Complete Challenge 2 (Create the Student Table) before attempting this.',
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

  // ── 4. INSERT single row ───────────────────────────────────────────────────
  // Depends on: Challenge 2 (student table must exist).
  {
    sortOrder: 4,
    title: 'Lap 4 — Insert a Single Student',
    description:
      'Insert one row into the student table using INSERT INTO … VALUES. Complete Challenge 2 (Create the Student Table) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Insert ONE new student into the student table with the following values:\n' +
      "  student_id = 106, full_name = 'Frank Lima', email = 'frank@uni.ac.nz', gpa = 3.10",
    requiredKeywords: ['insert', 'into', 'student', 'values'],
    pointValue: 8,
  },

  // ── 5. INSERT multiple rows ────────────────────────────────────────────────
  // Depends on: Challenge 4 (builds directly on single-row INSERT).
  {
    sortOrder: 5,
    title: 'Lap 5 — Bulk Insert Three Students',
    description:
      'Insert multiple rows in a single INSERT statement. Complete Challenge 4 (Insert a Single Student) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Insert ALL THREE of the following students using a SINGLE INSERT statement:\n' +
      "  (107, 'Grace Osei',   'grace@uni.ac.nz',   3.80)\n" +
      "  (108, 'Henry Zhao',   'henry@uni.ac.nz',   2.95)\n" +
      "  (109, 'Isla Nguyen',  'isla@uni.ac.nz',    3.45)",
    requiredKeywords: ['insert', 'into', 'student', 'values'],
    pointValue: 12,
  },

  // ── 6. SELECT all columns and rows ────────────────────────────────────────
  // Depends on: Challenges 4–5 (rows must exist to see meaningful output).
  {
    sortOrder: 6,
    title: 'Lap 6 — Retrieve All Student Records',
    description:
      'The most fundamental SELECT query — return every column and every row from a table. Complete Challenges 4–5 (INSERT challenges) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Write a SELECT query to retrieve ALL columns and ALL rows from the student table.',
    requiredKeywords: ['select', '*', 'from', 'student'],
    pointValue: 5,
  },

  // ── 7. SELECT specific columns ────────────────────────────────────────────
  // Depends on: Challenge 6 (you should be comfortable with basic SELECT first).
  {
    sortOrder: 7,
    title: 'Lap 7 — Contact List (Select Specific Columns)',
    description:
      'You do not always need every column. Practice selecting only the fields you need. Complete Challenge 6 (Retrieve All Student Records) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Retrieve ONLY the full_name and email columns for every student in the student table.',
    requiredKeywords: ['select', 'full_name', 'email', 'from', 'student'],
    pointValue: 8,
  },

  // ── 8. SELECT with WHERE ──────────────────────────────────────────────────
  // Depends on: Challenge 6 (basic SELECT must be understood first).
  {
    sortOrder: 8,
    title: 'Lap 8 — Honour Roll (Filter with WHERE)',
    description:
      'Use a WHERE clause to filter rows that meet a condition. Complete Challenge 6 (Retrieve All Student Records) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Retrieve all columns for students whose GPA is greater than 3.5.',
    requiredKeywords: ['select', 'from', 'student', 'where', 'gpa'],
    pointValue: 10,
  },

  // ── 9. SELECT with ORDER BY ───────────────────────────────────────────────
  // Depends on: Challenge 6 (basic SELECT must be understood first).
  {
    sortOrder: 9,
    title: 'Lap 9 — Rankings (Sort with ORDER BY)',
    description:
      'Use ORDER BY to control the sequence of your results. Complete Challenge 6 (Retrieve All Student Records) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Retrieve all columns from the student table, sorted by GPA from highest to lowest.',
    requiredKeywords: ['select', 'from', 'student', 'order by', 'gpa', 'desc'],
    pointValue: 12,
  },

  // ── 10. SELECT WHERE + ORDER BY + LIMIT ───────────────────────────────────
  // Depends on: Challenges 8 and 9 (WHERE and ORDER BY must be understood).
  {
    sortOrder: 10,
    title: 'Lap 10 — Top Performers (Filter, Sort & Limit)',
    description:
      'Combine WHERE, ORDER BY and LIMIT in a single query to produce a ranked shortlist. Complete Challenges 8 and 9 (WHERE and ORDER BY) before attempting this.',
    schemaContext: STUDENT_SCHEMA,
    question:
      'Retrieve the full_name and gpa of students with a GPA of 3.0 or above, sorted by GPA from highest to lowest. Return only the top 3 results.',
    requiredKeywords: [
      'select', 'full_name', 'gpa', 'from', 'student',
      'where', 'order by', 'desc', 'limit',
    ],
    pointValue: 15,
  },
];
