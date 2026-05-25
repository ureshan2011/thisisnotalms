export interface SqlExamQuestion {
  id: string;
  category: string;
  question: string;
  choices: string[];
  correct: number; // 0-indexed
}

export const SQL_EXAM_COLLECTION = 'sqlExamResults';
export const SQL_EXAM_CERTIFICATES_COLLECTION = 'sqlExamCertificates';
export const SQL_EXAM_TITLE = 'SQL Fundamentals Certificate Exam';
export const SQL_EXAM_PASS_PERCENTAGE = 70;
export const SQL_EXAM_MAX_ATTEMPTS = 3;
export const SQL_EXAM_DURATION_MINUTES = 45;

export const SQL_EXAM_CATEGORIES = [
  'SQL Basics',
  'Filtering & Sorting',
  'Aggregates & Grouping',
  'Joins',
  'Data Definition',
  'Data Manipulation',
];

export const SQL_EXAM_QUESTIONS: SqlExamQuestion[] = [
  // ── SQL Basics ────────────────────────────────────────────────────────────
  {
    id: 'sql01',
    category: 'SQL Basics',
    question: 'Which SQL statement is used to retrieve data from a database?',
    choices: ['INSERT', 'SELECT', 'UPDATE', 'FETCH'],
    correct: 1,
  },
  {
    id: 'sql02',
    category: 'SQL Basics',
    question: 'Which clause specifies the table to query in a SELECT statement?',
    choices: ['INTO', 'FROM', 'WHERE', 'USING'],
    correct: 1,
  },
  {
    id: 'sql03',
    category: 'SQL Basics',
    question: 'What does SELECT * mean?',
    choices: [
      'Select only numeric columns',
      'Select the first column',
      'Select all columns',
      'Select no columns',
    ],
    correct: 2,
  },
  {
    id: 'sql04',
    category: 'SQL Basics',
    question: 'Which keyword is used to give a column or table a temporary alias?',
    choices: ['RENAME', 'AS', 'ALIAS', 'LABEL'],
    correct: 1,
  },
  {
    id: 'sql05',
    category: 'SQL Basics',
    question: 'What does NULL represent in SQL?',
    choices: [
      'The value zero',
      'An empty string',
      'An unknown or missing value',
      'A boolean false',
    ],
    correct: 2,
  },

  // ── Filtering & Sorting ───────────────────────────────────────────────────
  {
    id: 'sql06',
    category: 'Filtering & Sorting',
    question: 'Which clause is used to filter rows in a SELECT statement?',
    choices: ['HAVING', 'FILTER', 'WHERE', 'LIMIT'],
    correct: 2,
  },
  {
    id: 'sql07',
    category: 'Filtering & Sorting',
    question: 'Which keyword removes duplicate rows from a result set?',
    choices: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'NODUPS'],
    correct: 1,
  },
  {
    id: 'sql08',
    category: 'Filtering & Sorting',
    question: 'Which clause sorts query results?',
    choices: ['SORT BY', 'ORDER BY', 'ARRANGE BY', 'GROUP BY'],
    correct: 1,
  },
  {
    id: 'sql09',
    category: 'Filtering & Sorting',
    question: 'What does the LIKE operator use to match any sequence of characters?',
    choices: ['*', '_', '%', '?'],
    correct: 2,
  },
  {
    id: 'sql10',
    category: 'Filtering & Sorting',
    question: 'Which operator checks whether a value exists within a list of values?',
    choices: ['BETWEEN', 'IN', 'EXISTS', 'ANY'],
    correct: 1,
  },

  // ── Aggregates & Grouping ─────────────────────────────────────────────────
  {
    id: 'sql11',
    category: 'Aggregates & Grouping',
    question: 'Which aggregate function returns the total number of rows?',
    choices: ['SUM()', 'TOTAL()', 'COUNT()', 'NUM()'],
    correct: 2,
  },
  {
    id: 'sql12',
    category: 'Aggregates & Grouping',
    question: 'Which clause groups rows with the same values in specified columns?',
    choices: ['PARTITION BY', 'GROUP BY', 'CLUSTER BY', 'ORDER BY'],
    correct: 1,
  },
  {
    id: 'sql13',
    category: 'Aggregates & Grouping',
    question: 'Which clause filters groups after GROUP BY (like WHERE but for groups)?',
    choices: ['WHERE', 'FILTER', 'HAVING', 'GROUPFILTER'],
    correct: 2,
  },
  {
    id: 'sql14',
    category: 'Aggregates & Grouping',
    question: 'Which aggregate function returns the average value of a numeric column?',
    choices: ['MEAN()', 'AVERAGE()', 'AVG()', 'MEDIAN()'],
    correct: 2,
  },
  {
    id: 'sql15',
    category: 'Aggregates & Grouping',
    question: 'What is the correct order of these clauses in a SELECT statement?\nSELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY',
    choices: [
      'SELECT → FROM → GROUP BY → WHERE → HAVING → ORDER BY',
      'SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY',
      'SELECT → WHERE → FROM → HAVING → GROUP BY → ORDER BY',
      'FROM → SELECT → WHERE → GROUP BY → ORDER BY → HAVING',
    ],
    correct: 1,
  },

  // ── Joins ─────────────────────────────────────────────────────────────────
  {
    id: 'sql16',
    category: 'Joins',
    question: 'Which JOIN returns only rows where there is a match in BOTH tables?',
    choices: ['LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'INNER JOIN'],
    correct: 3,
  },
  {
    id: 'sql17',
    category: 'Joins',
    question: 'Which JOIN returns all rows from the left table and matched rows from the right table (NULLs for no match)?',
    choices: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
    correct: 1,
  },
  {
    id: 'sql18',
    category: 'Joins',
    question: 'What is a CROSS JOIN?',
    choices: [
      'Joins two tables using a common column automatically',
      'Returns every combination of rows from both tables (Cartesian product)',
      'Returns only unmatched rows from both tables',
      'Joins tables across different databases',
    ],
    correct: 1,
  },
  {
    id: 'sql19',
    category: 'Joins',
    question: 'In a JOIN, which keyword specifies the condition linking the two tables?',
    choices: ['MATCH', 'WHERE', 'ON', 'USING'],
    correct: 2,
  },

  // ── Data Definition ───────────────────────────────────────────────────────
  {
    id: 'sql20',
    category: 'Data Definition',
    question: 'Which SQL command creates a new table?',
    choices: ['MAKE TABLE', 'ADD TABLE', 'CREATE TABLE', 'BUILD TABLE'],
    correct: 2,
  },
  {
    id: 'sql21',
    category: 'Data Definition',
    question: 'Which constraint ensures that no two rows have the same value in a column?',
    choices: ['PRIMARY KEY', 'UNIQUE', 'NOT NULL', 'CHECK'],
    correct: 1,
  },
  {
    id: 'sql22',
    category: 'Data Definition',
    question: 'What does a FOREIGN KEY do?',
    choices: [
      'Encrypts sensitive columns',
      'Enforces a link between two tables by referencing a primary key in another table',
      'Ensures a column cannot be NULL',
      'Automatically generates unique values',
    ],
    correct: 1,
  },

  // ── Data Manipulation ─────────────────────────────────────────────────────
  {
    id: 'sql23',
    category: 'Data Manipulation',
    question: 'Which statement adds new rows to a table?',
    choices: ['ADD INTO', 'INSERT INTO', 'PUT INTO', 'APPEND INTO'],
    correct: 1,
  },
  {
    id: 'sql24',
    category: 'Data Manipulation',
    question: 'Which statement modifies existing rows in a table?',
    choices: ['MODIFY', 'ALTER', 'UPDATE', 'CHANGE'],
    correct: 2,
  },
  {
    id: 'sql25',
    category: 'Data Manipulation',
    question: 'What happens if you run DELETE FROM students; without a WHERE clause?',
    choices: [
      'It deletes only the first row',
      'It raises an error',
      'It deletes all rows from the table but keeps the table structure',
      'It drops the entire table',
    ],
    correct: 2,
  },
];
