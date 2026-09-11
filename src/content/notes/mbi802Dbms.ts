import type { NotesDoc } from '../../lib/notesPdf';

// Condensed notes for /intro-to-dbms. Drawn from the same MBI802 study pack
// chapter the page is built on, reshaped for reading on paper: the two
// interactive pieces become the arguments they were making, and the outline
// becomes a table.

export const DBMS_NOTES: NotesDoc = {
  code: 'MBI802',
  course: 'Database Management Systems',
  title: 'Introduction to DBMS',
  summary:
    'Data versus information, why file-based systems fail, the parts of a relational database, and setting up MySQL.',
  accent: [244, 85, 30],
  fileName: 'MBI802-Introduction-to-DBMS-notes',
  sections: [
    {
      heading: 'Data and information',
      standfirst: 'Section 1.1',
      blocks: [
        {
          type: 'p',
          text:
            'Data is raw, unprocessed facts and figures with no inherent meaning on their own: 85, "Auckland", 42. Information is data that has been processed and given context, so it becomes meaningful and useful for a decision: "John Smith achieved a distinction (85%) in MBI802 during Semester 1."',
        },
        {
          type: 'p',
          text:
            'The transformation requirement is context plus processing. A file of ten thousand bare transaction amounts is data; a report showing "sales rose 12% in March, driven by the Auckland store" is information. Volume does not create meaning.',
        },
        {
          type: 'table',
          title: 'Quality information is',
          head: ['Characteristic', 'What it means'],
          rows: [
            ['Accurate', 'Reflects reality. Wrong information is worse than none.'],
            ['Complete', 'Nothing essential is missing from the picture.'],
            ['Timely', 'Current, and available at the moment the decision is made.'],
            ['Relevant', 'Actually useful for the decision at hand.'],
          ],
          weights: [1, 2.6],
        },
        {
          type: 'callout',
          title: 'Exam note',
          text:
            'You may be asked to classify items as data or information and justify each in a sentence. The justification carries the marks: name what context is present or missing.',
        },
      ],
    },
    {
      heading: 'Why file-based systems fail',
      standfirst: 'Section 1.2',
      blocks: [
        {
          type: 'p',
          text:
            'Before databases, organisations kept records in separate files, and plenty of small ones still run on spreadsheets. Take a hospital storing patient records in Excel, with the same patient typed into an admissions sheet, a ward sheet and a pharmacy sheet.',
        },
        {
          type: 'numbered',
          title: 'What goes wrong, and the DBMS answer to each',
          pairs: [
            ['Redundancy', 'The same patient details are re-typed in three places. A DBMS keeps one shared, structured store, so each fact is recorded once.'],
            ['Inconsistency', 'The patient moves and two of the three copies are never updated. Which one is true? A DBMS centralises updates and uses constraints to keep data valid.'],
            ['Security', 'Anyone holding the file holds all of it; there is no way to let reception see less than the doctors. A DBMS grants fine-grained, per-user access.'],
            ['Concurrency', 'Two nurses open the file at once and the second save silently overwrites the first. A DBMS provides concurrency control, so many users can work safely at the same time.'],
            ['No integrity rules', 'Nothing stops a discharge date earlier than the admission date, or a row with no patient ID at all. A DBMS enforces validation and typing itself.'],
          ],
        },
        {
          type: 'p',
          text:
            'A DBMS (Database Management System) is software built to solve those five problems. The families are relational (MySQL, PostgreSQL, Oracle — what this course covers), NoSQL document and key-value stores such as MongoDB, and NewSQL, which aims at relational guarantees with NoSQL scale. The relational model still runs most business systems.',
        },
        {
          type: 'callout',
          title: 'Memorise these',
          text:
            'Redundancy, inconsistency, security, concurrency, integrity. Almost every "why use a database" question is one of these five in disguise.',
        },
      ],
    },
    {
      heading: 'Inside a relational database',
      standfirst: 'Section 1.3',
      blocks: [
        {
          type: 'p',
          text:
            'A relational database organises data into tables, made of rows and columns. An RDBMS — Relational Database Management System — is the software that manages them.',
        },
        {
          type: 'kv',
          title: 'Terms you need both ways round',
          pairs: [
            ['Table / relation', 'A named grid of rows and columns describing one kind of thing.'],
            ['Row / record / tuple', 'One real-world instance. One student, one order.'],
            ['Column / field / attribute', 'One property, the same type for every row.'],
            ['Primary key', 'The column or columns that uniquely identify each row. Never NULL, never duplicated.'],
            ['Foreign key', 'A column that references another table\'s primary key, linking the two.'],
            ['Referential integrity', 'Every foreign-key value must match an existing primary key, or be NULL. The DBMS refuses orphaned references.'],
            ['NULL', 'No value, or unknown. It is not zero and not an empty string; compare with IS NULL, not = \'\'.'],
            ['Composite key', 'Two or more columns combined to identify a row.'],
            ['Schema', 'The overall design: which tables exist, their columns, types and keys.'],
          ],
        },
        {
          type: 'table',
          title: 'A small example',
          head: ['student_id', 'name', 'age', 'city'],
          rows: [
            ['1001', 'Alice Chen', '20', 'Auckland'],
            ['1002', 'Ben Kumar', '22', 'Wellington'],
            ['1003', 'Mia Tuilagi', '19', 'Hamilton'],
          ],
          weights: [1, 1.4, 0.7, 1.1],
        },
        {
          type: 'p',
          text:
            'student_id is the primary key here. If a second table, enrolments, carries a student_id column, that is a foreign key pointing back at this one. An enrolment referring to student 1009, who is not listed above, breaks referential integrity. A DBMS would refuse to store it; a spreadsheet would accept it without comment.',
        },
        {
          type: 'callout',
          title: 'Exam note',
          text:
            'Both sets of terms appear in questions: table equals relation, row equals tuple, column equals attribute. Know it in both directions.',
        },
      ],
    },
    {
      heading: 'Setting up MySQL',
      standfirst: 'Section 1.4',
      blocks: [
        {
          type: 'p',
          text:
            'Two pieces: MySQL Community Server, which is the database engine, and MySQL Workbench, the graphical client you type SQL into.',
        },
        {
          type: 'numbered',
          pairs: [
            ['Download MySQL Community Server', 'From the official MySQL site, dev.mysql.com/downloads.'],
            ['Windows: run the MySQL Installer', 'It adds the Visual C++ runtime if needed. Follow the configuration wizard, keep the default port 3306, and set a root password you will remember.'],
            ['macOS: install the DMG', 'Then enable the server in System Settings and add MySQL to your PATH.'],
            ['Install MySQL Workbench', 'Create a connection to localhost:3306 as root.'],
            ['Verify it', 'Run SHOW DATABASES; — if a list including information_schema and mysql appears, the server is alive.'],
          ],
        },
        { type: 'code', title: 'The verification statement', text: 'SHOW DATABASES;' },
        {
          type: 'callout',
          title: 'Do this on the installer screen',
          text:
            'The root password you set during installation is the master key to your local server, and recovery is fiddly if you lose it. Put it in your password manager now.',
        },
      ],
    },
    {
      heading: 'A preview of what is coming',
      standfirst: 'Material from later chapters.',
      blocks: [
        {
          type: 'code',
          title: 'Lesson 2: your first table and query',
          text: `CREATE DATABASE school_db;
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
FROM   students;`,
        },
        {
          type: 'p',
          title: 'Lesson 4: designing before building',
          text:
            'We plan tables before anyone writes CREATE TABLE, the way an architect plans rooms before anyone pours concrete. Chen\'s notation: rectangles for entities, ovals for attributes, diamonds for relationships, lines carrying cardinality.',
        },
        {
          type: 'p',
          title: 'Lesson 7: cleaning up a bad table',
          text:
            'A single table recording students, departments and courses at once contains update, insertion and deletion anomalies. If a department head leaves, every row for that department needs changing and it is easy to miss one. Normalization names all three, then splits the table step by step until it cannot contradict itself.',
        },
      ],
    },
    {
      heading: 'The eight lessons',
      standfirst: 'Each lesson assumes the one before it.',
      blocks: [
        {
          type: 'table',
          head: ['#', 'Lesson', 'By the end you can'],
          rows: [
            ['01', 'Introduction to DBMS', 'Tell data from information, name why file systems fail, and set up MySQL.'],
            ['02', 'SQL Programming Fundamentals', 'Write DDL statements and insert your first rows into a real table.'],
            ['03', 'Advanced SQL Queries', 'Combine two related tables with an INNER JOIN.'],
            ['04', 'ER Diagrams Foundations', 'Draw a complete ER diagram from a written scenario.'],
            ['05', 'Advanced ER Concepts', 'Apply the full Chen symbol set to a scenario you have not seen.'],
            ['06', 'ER to Relational Mapping', 'Turn a diagram into a schema without guessing.'],
            ['07', 'Database Normalization', 'Split a table that contradicts itself until it does not.'],
            ['08', 'Consolidation and Exam Preparation', 'Build a small database end to end, on your own.'],
          ],
          weights: [0.35, 1.5, 2.4],
        },
        {
          type: 'p',
          text:
            'MBI802 is a 15 credit, Level 8 course with no prerequisites. 150 learning hours: 36 in class, 114 on your own. Most of your career will be spent on databases other people built, so the course covers judging and repairing designs as much as creating them.',
        },
      ],
    },
    {
      heading: 'Practice questions',
      standfirst: 'Answer these before checking the key below.',
      blocks: [
        {
          type: 'numbered',
          pairs: [
            ['Classify each as data or information, with one sentence of justification', '(a) 42  (b) "Auckland"  (c) "Enrolments in MBI802 grew 15% between 2025 and 2026"  (d) a file of 10,000 bare transaction amounts.'],
            ['What is the primary requirement for converting data into information?', ''],
            ['A cafe chain keeps each branch\'s sales in its own spreadsheet, emailed weekly to head office', 'Name three specific problems this causes, and the DBMS feature that fixes each.'],
            ['In one sentence each, what do primary key, foreign key and referential integrity guarantee?', ''],
            ['Give the formal terms for table, row and column.', ''],
            ['In a customers table, one row\'s phone column is NULL', 'What does that mean, and how is it different from an empty string?'],
            ['Which SQL statement verifies a fresh MySQL installation, and what should you expect to see?', ''],
          ],
        },
        {
          type: 'kv',
          title: 'Answer key',
          pairs: [
            ['1', '(a) Data - a bare number with no context. (b) Data - a place name in isolation tells you nothing actionable. (c) Information - processed, contextualised and decision-ready. (d) Data - volume does not create meaning.'],
            ['2', 'Context plus processing. The data must be organised and related to something meaningful before it can inform a decision.'],
            ['3', 'Any three of: redundancy, solved by one shared store; inconsistency, solved by centralised updates and constraints; security, solved by per-user permissions; concurrency, solved by the DBMS\'s concurrency control; integrity, solved by validation rules and types.'],
            ['4', 'A primary key guarantees every row can be uniquely identified. A foreign key links a row to a row in another table. Referential integrity guarantees every foreign-key value matches an existing primary key, or is NULL.'],
            ['5', 'Table equals relation, row equals tuple, column equals attribute.'],
            ['6', 'NULL means the value is unknown or absent - it was never recorded. An empty string is a known value that happens to be empty. They compare differently: use IS NULL, not = \'\'.'],
            ['7', 'SHOW DATABASES; A working server returns the system databases, including information_schema, mysql and performance_schema.'],
          ],
        },
      ],
    },
  ],
};
