export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  choices: string[];
  correct: number; // 0-indexed
}

export const MBI802_QUIZ_ID = 'mbi802-dbms-basics-v1';
export const MBI802_QUIZ_TITLE = 'Database Management System Fundamentals';
export const MBI802_QUIZ_PASS_PERCENTAGE = 60;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Data vs Information ──────────────────────────────────────────────────────
  {
    id: 'q01',
    category: 'Data vs Information',
    question: 'Which of the following best describes "data"?',
    choices: [
      'Processed facts that are meaningful and useful to decision-makers',
      'Raw, unprocessed facts and figures that have no inherent meaning on their own',
      'A structured collection of related tables stored in a computer',
      'Instructions provided to a computer to perform a task',
    ],
    correct: 1,
  },
  {
    id: 'q02',
    category: 'Data vs Information',
    question:
      "A student's exam score \"85\" stored in isolation — with no student name, subject, or date — is best classified as:",
    choices: [
      'Information, because it refers to an academic grade',
      'Data, because it is a raw number with no context',
      'A record, because it belongs to a student profile',
      'Metadata, because it describes a student\'s performance',
    ],
    correct: 1,
  },
  {
    id: 'q03',
    category: 'Data vs Information',
    question: 'Which of the following is an example of information (not just data)?',
    choices: [
      '42',
      '"Auckland"',
      '"John Smith achieved a distinction grade in MBI802 during Semester 1, 2025"',
      'TRUE',
    ],
    correct: 2,
  },
  {
    id: 'q04',
    category: 'Data vs Information',
    question: 'What is the primary requirement for converting data into information?',
    choices: [
      'Storing it in a relational database',
      'Encrypting it to ensure security',
      'Providing context and processing to give it meaning',
      'Duplicating it across multiple servers for availability',
    ],
    correct: 2,
  },
  {
    id: 'q05',
    category: 'Data vs Information',
    question: 'Which of the following is NOT a characteristic of high-quality information?',
    choices: [
      'Accuracy — the information reflects reality',
      'Timeliness — the information is current and up-to-date',
      'Being in raw, unprocessed form without any context',
      'Relevance — the information is useful for the decision at hand',
    ],
    correct: 2,
  },
  {
    id: 'q06',
    category: 'Data vs Information',
    question:
      'A retail company exports a file containing thousands of transaction amounts from its point-of-sale system — just numbers, no product names, no dates. This file is best described as:',
    choices: [
      'Information, because it comes from a business system',
      'A report, because it was exported from software',
      'Data, because the numbers lack meaningful context on their own',
      'A database, because it contains many values',
    ],
    correct: 2,
  },
  {
    id: 'q07',
    category: 'Data vs Information',
    question:
      'Which statement correctly describes the relationship between data and information?',
    choices: [
      'Information and data are interchangeable terms meaning the same thing',
      'Data is always more valuable than information',
      'Data is the raw input; information is the meaningful output after processing',
      'Information is collected first, and data is produced from it',
    ],
    correct: 2,
  },

  // ── Relational Database Basics ───────────────────────────────────────────────
  {
    id: 'q08',
    category: 'Relational Database Basics',
    question: 'What is the purpose of a primary key in a relational database table?',
    choices: [
      'To link two tables together using a foreign reference',
      'To uniquely identify each row/record in the table',
      'To sort the rows in ascending order automatically',
      'To encrypt sensitive data stored in the table',
    ],
    correct: 1,
  },
  {
    id: 'q09',
    category: 'Relational Database Basics',
    question: 'A foreign key in one table refers to:',
    choices: [
      'Any column that contains text (string) values',
      'The primary key of the same table it belongs to',
      'The primary key (or unique key) of another table, establishing a link',
      'A key that is not used for searching or indexing',
    ],
    correct: 2,
  },
  {
    id: 'q10',
    category: 'Relational Database Basics',
    question: 'In relational database terminology, a "table" is formally known as a:',
    choices: ['Schema', 'Relation', 'Tuple', 'Domain'],
    correct: 1,
  },
  {
    id: 'q11',
    category: 'Relational Database Basics',
    question: 'RDBMS stands for:',
    choices: [
      'Real-time Database and Management System',
      'Relational Data and Backup Management System',
      'Relational Database Management System',
      'Remote Database Monitoring System',
    ],
    correct: 2,
  },
  {
    id: 'q12',
    category: 'Relational Database Basics',
    question: 'Which SQL statement is used to retrieve data from a database?',
    choices: ['INSERT', 'UPDATE', 'DELETE', 'SELECT'],
    correct: 3,
  },
  {
    id: 'q13',
    category: 'Relational Database Basics',
    question: 'In a database, a NULL value means:',
    choices: [
      'The value is zero (0)',
      'The value is an empty string ("")',
      'The field has no value or the value is unknown/missing',
      'The column has been deleted from the table',
    ],
    correct: 2,
  },
  {
    id: 'q14',
    category: 'Relational Database Basics',
    question: 'First Normal Form (1NF) requires that:',
    choices: [
      'Every non-key attribute depends on the whole primary key',
      'Every non-key attribute depends only on the primary key, not on other non-key attributes',
      'Each column holds atomic (indivisible) values, and each row is unique',
      'The table has at least one foreign key referencing another table',
    ],
    correct: 2,
  },
  {
    id: 'q15',
    category: 'Relational Database Basics',
    question: 'A composite key is:',
    choices: [
      'A primary key that is also a foreign key in another table',
      'A primary key formed by combining two or more columns to uniquely identify a row',
      'A key that allows duplicate values within the same column',
      'An index created automatically on every column in the table',
    ],
    correct: 1,
  },
  {
    id: 'q16',
    category: 'Relational Database Basics',
    question: 'Referential integrity in a relational database ensures that:',
    choices: [
      'All data is stored in sorted order for fast retrieval',
      'No two rows can have the same primary key value',
      'A foreign key value must either match an existing primary key value or be NULL',
      'All column names across all tables must be unique',
    ],
    correct: 2,
  },
  {
    id: 'q17',
    category: 'Relational Database Basics',
    question:
      'Which type of JOIN returns ALL records from both tables, matching where possible and filling NULLs where there is no match?',
    choices: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
    correct: 3,
  },
  {
    id: 'q18',
    category: 'Relational Database Basics',
    question: 'An Entity-Relationship (ER) diagram is used to:',
    choices: [
      'Write SQL queries in a visual format',
      'Plan and represent the logical structure of a database before implementation',
      'Monitor database performance in real time',
      'Back up and restore database records',
    ],
    correct: 1,
  },
  {
    id: 'q19',
    category: 'Relational Database Basics',
    question:
      'In database design, a many-to-many relationship between two entities is typically implemented by:',
    choices: [
      'Adding extra columns to one of the two tables',
      'Merging both tables into a single table',
      'Creating a junction (bridge) table that holds foreign keys from both tables',
      'Using NULL values to represent the missing side of the relationship',
    ],
    correct: 2,
  },
  {
    id: 'q20',
    category: 'Relational Database Basics',
    question:
      'Which of the following SQL data types is most appropriate for storing a phone number like "021-012-3456"?',
    choices: [
      'INT, because phone numbers are numeric',
      'FLOAT, because phone numbers can contain decimal points',
      'VARCHAR, because phone numbers can have leading zeros, dashes, and spaces',
      'BOOLEAN, because a phone number is either valid or invalid',
    ],
    correct: 2,
  },

  // ── Real-World Scenarios ─────────────────────────────────────────────────────
  {
    id: 'q21',
    category: 'Real-World Scenarios',
    question:
      'A hospital wants to manage patient records, doctor details, appointment schedules, and medical history. Is this a suitable scenario for a relational database?',
    choices: [
      'No, because medical data is too sensitive to be stored digitally',
      'No, because the data is too complex for any database',
      'Yes, because a relational database can handle related entities like patients, doctors, and appointments with enforced integrity',
      'Yes, but only if the hospital has more than 10,000 patients',
    ],
    correct: 2,
  },
  {
    id: 'q22',
    category: 'Real-World Scenarios',
    question:
      'A student stores all classmate information in a single database cell as: "John,25,MBI802,Auckland | Sarah,22,MBI800,Christchurch". What is the main problem with this approach?',
    choices: [
      'The cell will run out of storage space immediately',
      'It violates atomicity — multiple values in one cell break First Normal Form (1NF)',
      'MySQL does not support text fields larger than 50 characters',
      'There is no problem; this is a valid and efficient storage technique',
    ],
    correct: 1,
  },
  {
    id: 'q23',
    category: 'Real-World Scenarios',
    question:
      'A library system records which member has borrowed which book. Each book can be borrowed by only one member at a time, but one member can borrow many books. What is the relationship between Members and Books?',
    choices: [
      'Many-to-Many, because many books exist for many members',
      'One-to-One, because each book belongs to exactly one library',
      'One-to-Many, because one member can borrow many books, but each book is borrowed by only one member at a time',
      'No relationship; they should be stored in separate, unlinked databases',
    ],
    correct: 2,
  },
  {
    id: 'q24',
    category: 'Real-World Scenarios',
    question:
      'In a university system, students can enrol in many courses, and each course can have many students. What type of relationship exists between Students and Courses?',
    choices: ['One-to-One', 'One-to-Many', 'Many-to-One', 'Many-to-Many'],
    correct: 3,
  },
  {
    id: 'q25',
    category: 'Real-World Scenarios',
    question:
      'A business discovers that the same customer appears multiple times in their Customers table with slightly different spellings of their name. What type of database problem is this?',
    choices: [
      'A normalisation error — the table is not in 3NF',
      'A data redundancy and integrity problem — duplicate records compromise data quality',
      'A referential integrity violation — foreign keys are broken',
      'A performance issue — indexes are not set up correctly',
    ],
    correct: 1,
  },
  {
    id: 'q26',
    category: 'Real-World Scenarios',
    question:
      'A school wants to track which teachers teach which subjects, where one teacher can teach multiple subjects and one subject can be taught by multiple teachers. Can a relational database handle this?',
    choices: [
      'No, because teachers and subjects are too similar to store separately',
      'Yes, using a Many-to-Many relationship with a junction table (e.g., TeacherSubject)',
      'Yes, but only by merging teachers and subjects into one table',
      'No, because school data does not fit the relational model',
    ],
    correct: 1,
  },
  {
    id: 'q27',
    category: 'Real-World Scenarios',
    question:
      'You need to keep a quick grocery list of 5 items for a single trip to the supermarket. Should you build a relational database for this?',
    choices: [
      'Yes, always use a database for any data storage need',
      'Yes, because databases are the most efficient storage option for all sizes',
      'No, a simple note or text file is more appropriate — a full database is overkill for 5 items',
      'No, because grocery items cannot be modelled in a relational schema',
    ],
    correct: 2,
  },
  {
    id: 'q28',
    category: 'Real-World Scenarios',
    question:
      'A social media platform needs to store users who can follow each other (User A follows User B, User B also follows User A). What relationship type does this represent?',
    choices: [
      'One-to-One relationship between two user tables',
      'A self-referencing Many-to-Many relationship within the same Users table',
      'A One-to-Many relationship where one user leads all others',
      'A recursive One-to-One relationship',
    ],
    correct: 1,
  },
  {
    id: 'q29',
    category: 'Real-World Scenarios',
    question:
      "An e-commerce company's database has a Customers table and an Orders table. When a customer record is deleted and referential integrity (with ON DELETE RESTRICT) is enforced, what happens to their linked orders?",
    choices: [
      'The orders are automatically reassigned to a default customer',
      'Nothing; the orders remain with a NULL customer reference',
      'The deletion is blocked — the customer cannot be deleted while orders exist',
      'The database automatically creates a backup of the deleted customer',
    ],
    correct: 2,
  },
  {
    id: 'q30',
    category: 'Real-World Scenarios',
    question:
      'A developer creates a Products table with columns: ProductID, ProductName, Category, CategoryDescription, SupplierName, SupplierPhone. What database design problem does this table have?',
    choices: [
      'The table has too many columns — MySQL only allows 5 columns per table',
      'Category and Supplier details should be in separate tables; storing them here creates data redundancy and update anomalies',
      'ProductID should not be a primary key because product IDs can change',
      'The table is missing a foreign key to make it relational',
    ],
    correct: 1,
  },
  {
    id: 'q31',
    category: 'Real-World Scenarios',
    question:
      'A weather station records temperature readings every minute, 24/7, across 100 sensors. Over a year this generates tens of millions of rows. Is a relational database appropriate?',
    choices: [
      'No, relational databases cannot handle more than 10,000 rows',
      'Yes, but only if the data is kept in a single table with no indexes',
      'Yes, relational databases with proper indexing can handle very large datasets, though specialised time-series databases may be even more efficient for this use case',
      'No, weather data must always be stored in spreadsheets for accuracy',
    ],
    correct: 2,
  },
  {
    id: 'q32',
    category: 'Real-World Scenarios',
    question:
      'A company stores employee salary history. Each employee can have many salary records over time. The HR system needs to display the CURRENT salary quickly for thousands of employees. What design strategy would improve read performance?',
    choices: [
      'Store all salary history in a single comma-separated cell',
      'Add an indexed "isCurrent" boolean column or maintain a separate CurrentSalary table for fast lookups',
      'Delete historical salary records after each pay rise',
      'Store salaries in a separate database on a different server',
    ],
    correct: 1,
  },

  // ── Tricky Questions ─────────────────────────────────────────────────────────
  {
    id: 'q33',
    category: 'Tricky Questions',
    question: 'Technically, can a table in MySQL exist without a primary key?',
    choices: [
      'No — MySQL enforces a primary key on every table by default',
      'Yes — MySQL allows tables without a primary key, but it is considered very poor practice as it makes data management much harder',
      'Yes — and it is recommended for large tables to improve insert performance',
      'No — without a primary key, MySQL will refuse to create the table',
    ],
    correct: 1,
  },
  {
    id: 'q34',
    category: 'Tricky Questions',
    question: 'Can a NULL value be assigned to a primary key column?',
    choices: [
      'Yes, NULL is a valid primary key value meaning "unknown ID"',
      'Yes, but only for the first record inserted into the table',
      'No, primary key columns must always hold a non-NULL value to uniquely identify each row',
      'Yes, if the table has a composite primary key',
    ],
    correct: 2,
  },
  {
    id: 'q35',
    category: 'Tricky Questions',
    question: 'What is denormalisation in database design?',
    choices: [
      'The process of breaking a table into smaller tables to reduce redundancy',
      'Intentionally introducing redundancy into a database to improve read performance at the cost of storage and update complexity',
      'Removing all foreign keys from a database to simplify queries',
      'Converting a database from relational to NoSQL format',
    ],
    correct: 1,
  },
  {
    id: 'q36',
    category: 'Tricky Questions',
    question:
      'A database has three tables but no foreign keys linking them. Can it still be called a "relational database"?',
    choices: [
      'Yes, any database with multiple tables is automatically relational',
      'Yes, as long as it uses SQL it qualifies as a relational database',
      'Technically the software (e.g., MySQL) is an RDBMS, but without enforced relationships the design does not follow relational principles — it behaves like separate flat files',
      'No, MySQL requires at least one foreign key to operate correctly',
    ],
    correct: 2,
  },
  {
    id: 'q37',
    category: 'Tricky Questions',
    question:
      'Searching for a value in an indexed column vs. a non-indexed column in a large table — which is generally faster?',
    choices: [
      'Non-indexed search, because indexing adds overhead that slows queries',
      'They are always the same speed regardless of indexing',
      'Indexed search, because the index allows the database to jump directly to matching rows instead of scanning the entire table',
      'It depends on whether the query uses SELECT or INSERT',
    ],
    correct: 2,
  },
  {
    id: 'q38',
    category: 'Tricky Questions',
    question: 'Is Microsoft Excel a database management system?',
    choices: [
      'Yes, Excel is fully equivalent to MySQL and can replace it in all business applications',
      'Excel can store and query data like a flat-file database, but it lacks RDBMS features such as enforced relationships, multi-user concurrency control, and ACID transactions',
      'No, Excel cannot store any structured data and is purely a calculation tool',
      'Yes, because Excel supports pivot tables, which are a form of database relationship',
    ],
    correct: 1,
  },
];

export const QUIZ_CATEGORIES = [...new Set(QUIZ_QUESTIONS.map((q) => q.category))];
