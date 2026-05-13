// 10 starter SQL challenges for MBI802 SQL Grand Prix
// Topics: CREATE DATABASE, CREATE TABLE, INSERT, SELECT (no JOINs, single table, no AUTO_INCREMENT)

const STUDENTS_SCHEMA = `-- Table: students
CREATE TABLE students (
    student_id   INT          PRIMARY KEY,
    full_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(100),
    gpa          DECIMAL(3,2)
);

-- Sample rows already inserted:
INSERT INTO students VALUES (101, 'Alice Chen',   'alice@uni.ac.nz',  3.75);
INSERT INTO students VALUES (102, 'Bob Kumar',    'bob@uni.ac.nz',    3.20);
INSERT INTO students VALUES (103, 'Chloe Park',   'chloe@uni.ac.nz',  3.90);
INSERT INTO students VALUES (104, 'David Tran',   'david@uni.ac.nz',  2.85);
INSERT INTO students VALUES (105, 'Emma Wilson',  'emma@uni.ac.nz',   3.55);`;

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
  // ── 1. CREATE DATABASE ──────────────────────────────────────
  {
    sortOrder: 1,
    title: 'Race Start: Create the Database',
    description: 'The very first step in any database project.',
    schemaContext: '',
    question:
      'Write the SQL statement to create a database called university.',
    requiredKeywords: ['create', 'database', 'university'],
    pointValue: 5,
  },

  // ── 2. CREATE TABLE ──────────────────────────────────────────
  {
    sortOrder: 2,
    title: 'Build the Students Table',
    description: 'Define the structure that will hold student records.',
    schemaContext: '-- You are working inside the university database.',
    question:
      'Create a table called students with the following columns:\n' +
      '  • student_id   INT            (Primary Key)\n' +
      '  • full_name    VARCHAR(100)   (must not be null)\n' +
      '  • email        VARCHAR(100)\n' +
      '  • gpa          DECIMAL(3,2)',
    requiredKeywords: ['create', 'table', 'students', 'primary key'],
    pointValue: 10,
  },

  // ── 3. CREATE TABLE with constraints ──────────────────────────
  {
    sortOrder: 3,
    title: 'Create the Courses Table',
    description: 'Add a second table to the university database.',
    schemaContext: '-- You are working inside the university database.\n-- The students table already exists.',
    question:
      'Create a table called courses with the following columns:\n' +
      '  • course_code   CHAR(6)        (Primary Key)\n' +
      '  • course_name   VARCHAR(150)   (must not be null)\n' +
      '  • credits       INT\n' +
      '  • department    VARCHAR(50)',
    requiredKeywords: ['create', 'table', 'courses', 'primary key'],
    pointValue: 10,
  },

  // ── 4. INSERT single row ──────────────────────────────────────
  {
    sortOrder: 4,
    title: 'Add Your First Student',
    description: 'Insert a single record into the students table.',
    schemaContext: STUDENTS_SCHEMA,
    question:
      'Insert ONE new student into the students table:\n' +
      '  student_id = 106, full_name = \'Frank Lima\', email = \'frank@uni.ac.nz\', gpa = 3.10',
    requiredKeywords: ['insert', 'into', 'students', 'values'],
    pointValue: 8,
  },

  // ── 5. INSERT multiple rows ────────────────────────────────────
  {
    sortOrder: 5,
    title: 'Bulk Enrolment — Insert Three Students',
    description: 'Write a single INSERT statement that adds multiple rows at once.',
    schemaContext: STUDENTS_SCHEMA,
    question:
      'Insert ALL THREE of the following students in a SINGLE INSERT statement:\n' +
      '  (107, \'Grace Osei\',   \'grace@uni.ac.nz\',   3.80)\n' +
      '  (108, \'Henry Zhao\',   \'henry@uni.ac.nz\',   2.95)\n' +
      '  (109, \'Isla Nguyen\',  \'isla@uni.ac.nz\',    3.45)',
    requiredKeywords: ['insert', 'into', 'students', 'values'],
    pointValue: 12,
  },

  // ── 6. SELECT all ─────────────────────────────────────────────
  {
    sortOrder: 6,
    title: 'Retrieve All Students',
    description: 'The most fundamental SELECT — grab everything.',
    schemaContext: STUDENTS_SCHEMA,
    question:
      'Write a query to retrieve ALL columns and ALL rows from the students table.',
    requiredKeywords: ['select', '*', 'from', 'students'],
    pointValue: 5,
  },

  // ── 7. SELECT specific columns ────────────────────────────────
  {
    sortOrder: 7,
    title: 'Contact List — Specific Columns',
    description: 'Not always do you need every column.',
    schemaContext: STUDENTS_SCHEMA,
    question:
      'Retrieve ONLY the full_name and email columns for every student in the table.',
    requiredKeywords: ['select', 'full_name', 'email', 'from', 'students'],
    pointValue: 8,
  },

  // ── 8. SELECT with WHERE ──────────────────────────────────────
  {
    sortOrder: 8,
    title: 'Honour Roll — Filter by GPA',
    description: 'Use WHERE to find high-achieving students.',
    schemaContext: STUDENTS_SCHEMA,
    question:
      'Retrieve all columns for students whose GPA is greater than 3.5.',
    requiredKeywords: ['select', 'from', 'students', 'where', 'gpa'],
    pointValue: 10,
  },

  // ── 9. SELECT with ORDER BY ───────────────────────────────────
  {
    sortOrder: 9,
    title: 'Rankings — Sort by GPA',
    description: 'Order results to see who leads the class.',
    schemaContext: STUDENTS_SCHEMA,
    question:
      'Retrieve all columns from the students table, sorted by GPA from highest to lowest.',
    requiredKeywords: ['select', 'from', 'students', 'order by', 'gpa', 'desc'],
    pointValue: 12,
  },

  // ── 10. SELECT WHERE + ORDER BY + LIMIT ───────────────────────
  {
    sortOrder: 10,
    title: 'Top Performers — Filter, Sort & Limit',
    description: 'Combine WHERE, ORDER BY and LIMIT in one query.',
    schemaContext: STUDENTS_SCHEMA,
    question:
      'Retrieve the full_name and gpa of students with a GPA of 3.0 or above, sorted by GPA from highest to lowest. Show only the top 3 results.',
    requiredKeywords: ['select', 'full_name', 'gpa', 'from', 'students', 'where', 'order by', 'desc', 'limit'],
    pointValue: 15,
  },
];
