import type { DiagramSpec } from './ChenDiagram';

// ─── The five tasks in the ER diagram tutorial ─────────────────────────────
// Two simple tasks, then three moderate ones, for students drawing an ER
// diagram for the first time. Used by the web page (/er-first-steps) and the
// two printable PDFs (scripts/er-tutorial-pdf).
//
// Task 4 reuses the bank from Task 1 with one rule changed, so CUSTOMER OWNS
// ACCOUNT goes from 1:N to M:N. Task 5 returns to the university from Task 2.
//
// Naming follows one convention throughout (see NAMING in tutorial.ts):
//   • Entity: singular noun in capitals, e.g. CUSTOMER, ASSIGNMENT
//   • Relationship: verb in capitals, words joined by _, e.g. OWNS, STAYS_IN
//   • Attribute: no spaces, each word capitalised, e.g. DateOfBirth.
//     The key attribute is underlined.
// Cardinality is written as 1, N or M next to the entity it counts.
//
// Scenario markup: {e|…} marks an entity word, {a|…} an attribute and
// {r|…} a relationship. The page highlights them when asked; otherwise, and
// in the PDF, they print as plain text.

export interface RelAnswer {
  /** The relationship as ENTITY VERB ENTITY. */
  name: string;
  left: string;
  right: string;
  /** Asked from the left entity, then from the right one. */
  q: [string, string][];
  ratio: string;
  /** Where the numbers go. */
  numbers: string;
  attrs?: string[];
  note?: string;
}

export interface ERTaskSpec {
  id: string;
  n: number;
  level: 'Simple' | 'Moderate';
  place: string;
  time: string;
  title: string;
  /** One or two sentences on what the task involves. */
  aside: string;
  /** Paragraphs, with {e|…} {a|…} {r|…} markup. */
  scenario: string[];
  questions: string[];
  hint: string;
  /** A new idea this task needs, explained before the student starts. */
  newIdea?: { title: string; body: string };
  entities: { name: string; why: string }[];
  notEntities: string;
  attributes: { entity: string; key: string; others: string[] }[];
  attributesNote: string;
  rels: RelAnswer[];
  /** What the finished diagram says, one sentence per line. */
  readAloud: string[];
  diagram: DiagramSpec;
  diagramLabel: string;
}

/** The scenario text with the markup removed. */
export function plainScenario(text: string): string {
  return text.replace(/\{[ear]\|([^}]+)\}/g, '$1');
}

export const TASKS: ERTaskSpec[] = [
  // ── Task 1 · Simple · Bank ────────────────────────────────────────────
  {
    id: 'task1',
    n: 1,
    level: 'Simple',
    place: 'Bank',
    time: '10 minutes',
    title: 'Customers and accounts',
    aside: 'Two entities and one relationship. The other tasks follow the same steps.',
    scenario: [
      'Mere runs a small community bank in Hamilton. She keeps all her records in a paper notebook and wants to move them into a database.',
      'The bank has {e|customers}. For each customer, Mere records a {a|customer ID}, {a|first name}, {a|last name} and {a|phone number}. Each customer has a different customer ID.',
      'Customers open {e|accounts}. Each account has an {a|account number}, an {a|account type} (savings or everyday) and a {a|balance}. Each account has a different account number.',
      'A customer {r|owns} one or more accounts. Each account belongs to only one customer.',
    ],
    questions: [
      'List the entities. There are two.',
      'List the attributes of each entity and identify the key attribute.',
      'Identify the relationship and its cardinality.',
      'Draw the ER diagram using Chen’s notation.',
    ],
    hint: 'Look for nouns that the bank stores many of. The bank itself is not an entity, because it is the whole system.',
    entities: [
      { name: 'CUSTOMER', why: 'The bank stores details about many customers.' },
      { name: 'ACCOUNT', why: 'The bank stores details about many accounts.' },
    ],
    notEntities: 'The bank is the whole system, so it is not drawn as an entity. Mere uses the database, so she is not an entity either.',
    attributes: [
      { entity: 'CUSTOMER', key: 'CustomerID', others: ['FirstName', 'LastName', 'PhoneNumber'] },
      { entity: 'ACCOUNT', key: 'AccountNumber', others: ['AccountType', 'Balance'] },
    ],
    attributesNote: 'Two customers can have the same name, but not the same CustomerID. That is why CustomerID is the key.',
    rels: [
      {
        name: 'CUSTOMER OWNS ACCOUNT',
        left: 'CUSTOMER',
        right: 'ACCOUNT',
        q: [
          ['One CUSTOMER can own how many ACCOUNTs?', 'Many'],
          ['One ACCOUNT is owned by how many CUSTOMERs?', 'One'],
        ],
        ratio: '1:N',
        numbers: 'Write 1 next to CUSTOMER and N next to ACCOUNT.',
      },
    ],
    readAloud: [
      'One CUSTOMER OWNS many ACCOUNTs.',
      'Each ACCOUNT is owned by one CUSTOMER.',
    ],
    diagramLabel: 'Chen ER diagram: CUSTOMER, with key CustomerID and attributes FirstName, LastName and PhoneNumber, OWNS ACCOUNT, with key AccountNumber and attributes AccountType and Balance. 1 beside CUSTOMER, N beside ACCOUNT.',
    diagram: {
      w: 860,
      h: 340,
      minWidth: 620,
      entities: [
        { id: 'CUSTOMER', x: 190, y: 170 },
        { id: 'ACCOUNT', x: 670, y: 170 },
      ],
      rels: [{ id: 'OWNS', x: 430, y: 170, links: [['CUSTOMER', '1'], ['ACCOUNT', 'N']] }],
      attrs: [
        { label: 'CustomerID', x: 110, y: 62, of: 'CUSTOMER', key: true },
        { label: 'FirstName', x: 270, y: 58, of: 'CUSTOMER' },
        { label: 'LastName', x: 110, y: 282, of: 'CUSTOMER' },
        { label: 'PhoneNumber', x: 275, y: 285, of: 'CUSTOMER' },
        { label: 'AccountNumber', x: 590, y: 60, of: 'ACCOUNT', key: true },
        { label: 'AccountType', x: 760, y: 62, of: 'ACCOUNT' },
        { label: 'Balance', x: 670, y: 285, of: 'ACCOUNT' },
      ],
    },
  },

  // ── Task 2 · Simple · University ──────────────────────────────────────
  {
    id: 'task2',
    n: 2,
    level: 'Simple',
    place: 'University',
    time: '10 minutes',
    title: 'Students and clubs',
    aside: 'Two entities and a many-to-many relationship. One attribute belongs to the relationship.',
    scenario: [
      'Sione works in the student centre at Southfield University. He looks after the student clubs, such as the chess club, the hiking club and the cooking club.',
      'Each {e|student} has a {a|student ID}, {a|first name}, {a|last name} and {a|email}. Each {e|club} has a {a|club ID}, {a|club name} and {a|meeting day}.',
      'A student can {r|join} many clubs, and a club has many students. Sione also wants to record the {a|date} each student joined each club.',
    ],
    questions: [
      'List the entities.',
      'List the attributes of each entity and identify the key attribute.',
      'Identify the relationship and its cardinality.',
      'Decide where the join date belongs.',
      'Draw the ER diagram using Chen’s notation.',
    ],
    hint: 'Ask two questions. How many clubs can one student join? How many students can one club have?',
    newIdea: {
      title: 'Attributes on a relationship',
      body: 'Some facts do not belong to either entity on its own. The join date is one of them. A student in three clubs has three different join dates, and a club has a different join date for each member. The date only makes sense for one student and one club together, so it is connected to the relationship diamond.',
    },
    entities: [
      { name: 'STUDENT', why: 'Sione stores details about many students.' },
      { name: 'CLUB', why: 'Sione stores details about many clubs.' },
    ],
    notEntities: 'The university, the student centre and Sione are not entities. Chess, hiking and cooking are not entities either. They are examples of clubs, so they are values of ClubName.',
    attributes: [
      { entity: 'STUDENT', key: 'StudentID', others: ['FirstName', 'LastName', 'Email'] },
      { entity: 'CLUB', key: 'ClubID', others: ['ClubName', 'MeetingDay'] },
    ],
    attributesNote: 'DateJoined is not listed here because it belongs to the relationship, not to STUDENT or CLUB.',
    rels: [
      {
        name: 'STUDENT JOINS CLUB',
        left: 'STUDENT',
        right: 'CLUB',
        q: [
          ['One STUDENT can join how many CLUBs?', 'Many'],
          ['One CLUB can have how many STUDENTs?', 'Many'],
        ],
        ratio: 'M:N',
        numbers: 'Write M next to STUDENT and N next to CLUB.',
        attrs: ['DateJoined'],
        note: 'Both answers are “many”, so the relationship is many-to-many. DateJoined is connected to the JOINS diamond.',
      },
    ],
    readAloud: [
      'A STUDENT JOINS many CLUBs.',
      'A CLUB has many STUDENTs.',
      'DateJoined records when a student joined a club.',
    ],
    diagramLabel: 'Chen ER diagram: STUDENT, with key StudentID and attributes FirstName, LastName and Email, JOINS CLUB, with key ClubID and attributes ClubName and MeetingDay. DateJoined is an attribute of JOINS. M beside STUDENT, N beside CLUB.',
    diagram: {
      w: 860,
      h: 350,
      minWidth: 620,
      entities: [
        { id: 'STUDENT', x: 190, y: 195 },
        { id: 'CLUB', x: 670, y: 195 },
      ],
      rels: [{ id: 'JOINS', x: 430, y: 195, links: [['STUDENT', 'M'], ['CLUB', 'N']] }],
      attrs: [
        { label: 'StudentID', x: 105, y: 80, of: 'STUDENT', key: true },
        { label: 'FirstName', x: 265, y: 72, of: 'STUDENT' },
        { label: 'LastName', x: 105, y: 305, of: 'STUDENT' },
        { label: 'Email', x: 270, y: 310, of: 'STUDENT' },
        { label: 'DateJoined', x: 430, y: 66, of: 'JOINS' },
        { label: 'ClubID', x: 590, y: 80, of: 'CLUB', key: true },
        { label: 'ClubName', x: 755, y: 80, of: 'CLUB' },
        { label: 'MeetingDay', x: 670, y: 310, of: 'CLUB' },
      ],
    },
  },

  // ── Task 3 · Moderate · Hospital ──────────────────────────────────────
  {
    id: 'task3',
    n: 3,
    level: 'Moderate',
    place: 'Hospital',
    time: '20 minutes',
    title: 'Wards, nurses, doctors and patients',
    aside: 'Four entities and three relationships. Work on one relationship at a time.',
    scenario: [
      'Priya is a charge nurse at Riverside Hospital. The hospital tracks patients on whiteboards, and Priya has been asked to help design a database.',
      'The hospital has {e|wards}. Each ward has a {a|ward number}, {a|ward name} and {a|number of beds}.',
      '{e|Patients} {r|stay in} wards. Each patient stays in one ward, and a ward has many patients. For each patient, the hospital records a {a|patient ID}, {a|first name}, {a|last name} and {a|date of birth}.',
      '{e|Nurses} {r|work in} wards. Each nurse works in one ward, and a ward has many nurses. A nurse has a {a|nurse ID}, {a|first name}, {a|last name} and {a|shift} (day or night).',
      '{e|Doctors} {r|treat} patients. A doctor treats many patients, and a patient can be treated by many doctors. A doctor has a {a|doctor ID}, {a|first name}, {a|last name} and {a|specialty}. Each time a doctor treats a patient, the hospital records the {a|treatment date} and the {a|diagnosis}.',
    ],
    questions: [
      'List the entities. There are four.',
      'List the attributes of each entity and identify the key attributes.',
      'Identify the three relationships and the cardinality of each.',
      'Which relationship has its own attributes?',
      'Draw the ER diagram using Chen’s notation.',
    ],
    hint: 'Draw the four entities first and leave space between them. Then add one relationship at a time and work out its cardinality before moving to the next.',
    entities: [
      { name: 'WARD', why: 'The hospital stores details about each ward.' },
      { name: 'PATIENT', why: 'The hospital stores details about many patients.' },
      { name: 'NURSE', why: 'The hospital stores details about many nurses.' },
      { name: 'DOCTOR', why: 'The hospital stores details about many doctors.' },
    ],
    notEntities: 'The hospital and the whiteboards are not entities. Priya is a nurse, so she would be stored as one row in NURSE. She does not need her own entity.',
    attributes: [
      { entity: 'WARD', key: 'WardNumber', others: ['WardName', 'NumberOfBeds'] },
      { entity: 'PATIENT', key: 'PatientID', others: ['FirstName', 'LastName', 'DateOfBirth'] },
      { entity: 'NURSE', key: 'NurseID', others: ['FirstName', 'LastName', 'Shift'] },
      { entity: 'DOCTOR', key: 'DoctorID', others: ['FirstName', 'LastName', 'Specialty'] },
    ],
    attributesNote: 'Store DateOfBirth, not Age. Age changes every year, but a date of birth does not. NURSE and DOCTOR both have FirstName and LastName. That is fine, because each attribute belongs to its own entity.',
    rels: [
      {
        name: 'PATIENT STAYS_IN WARD',
        left: 'PATIENT',
        right: 'WARD',
        q: [
          ['One PATIENT stays in how many WARDs?', 'One'],
          ['One WARD has how many PATIENTs?', 'Many'],
        ],
        ratio: 'N:1',
        numbers: 'Write N next to PATIENT and 1 next to WARD.',
        note: 'N:1 is the same as 1:N read from the other side: one ward, many patients.',
      },
      {
        name: 'NURSE WORKS_IN WARD',
        left: 'NURSE',
        right: 'WARD',
        q: [
          ['One NURSE works in how many WARDs?', 'One'],
          ['One WARD has how many NURSEs?', 'Many'],
        ],
        ratio: 'N:1',
        numbers: 'Write N next to NURSE and 1 next to WARD.',
      },
      {
        name: 'DOCTOR TREATS PATIENT',
        left: 'DOCTOR',
        right: 'PATIENT',
        q: [
          ['One DOCTOR treats how many PATIENTs?', 'Many'],
          ['One PATIENT is treated by how many DOCTORs?', 'Many'],
        ],
        ratio: 'M:N',
        numbers: 'Write M next to DOCTOR and N next to PATIENT.',
        attrs: ['TreatmentDate', 'Diagnosis'],
        note: 'TreatmentDate and Diagnosis describe one doctor treating one patient, so they are connected to TREATS.',
      },
    ],
    readAloud: [
      'A PATIENT STAYS_IN one WARD. A WARD has many PATIENTs.',
      'A NURSE WORKS_IN one WARD. A WARD has many NURSEs.',
      'A DOCTOR TREATS many PATIENTs. A PATIENT can be treated by many DOCTORs.',
      'Each treatment records a TreatmentDate and a Diagnosis.',
    ],
    diagramLabel: 'Chen ER diagram for the hospital: DOCTOR TREATS PATIENT, M to N, with TreatmentDate and Diagnosis on TREATS. PATIENT STAYS_IN WARD, N to 1. NURSE WORKS_IN WARD, N to 1. Keys DoctorID, PatientID, WardNumber and NurseID.',
    diagram: {
      w: 1190,
      h: 655,
      minWidth: 900,
      entities: [
        { id: 'DOCTOR', x: 140, y: 230 },
        { id: 'PATIENT', x: 600, y: 230 },
        { id: 'WARD', x: 1030, y: 230 },
        { id: 'NURSE', x: 1030, y: 540 },
      ],
      rels: [
        { id: 'TREATS', x: 365, y: 230, links: [['DOCTOR', 'M'], ['PATIENT', 'N']] },
        { id: 'STAYS_IN', x: 820, y: 230, links: [['PATIENT', 'N'], ['WARD', '1']] },
        { id: 'WORKS_IN', x: 1030, y: 385, links: [['WARD', '1'], ['NURSE', 'N']] },
      ],
      attrs: [
        { label: 'DoctorID', x: 70, y: 110, of: 'DOCTOR', key: true },
        { label: 'FirstName', x: 205, y: 100, of: 'DOCTOR' },
        { label: 'LastName', x: 70, y: 350, of: 'DOCTOR' },
        { label: 'Specialty', x: 210, y: 360, of: 'DOCTOR' },
        { label: 'TreatmentDate', x: 365, y: 95, of: 'TREATS' },
        { label: 'Diagnosis', x: 370, y: 365, of: 'TREATS' },
        { label: 'PatientID', x: 525, y: 105, of: 'PATIENT', key: true },
        { label: 'FirstName', x: 672, y: 100, of: 'PATIENT' },
        { label: 'LastName', x: 525, y: 355, of: 'PATIENT' },
        { label: 'DateOfBirth', x: 682, y: 360, of: 'PATIENT' },
        { label: 'WardNumber', x: 950, y: 105, of: 'WARD', key: true },
        { label: 'WardName', x: 1105, y: 100, of: 'WARD' },
        { label: 'NumberOfBeds', x: 1125, y: 300, of: 'WARD' },
        { label: 'NurseID', x: 880, y: 500, of: 'NURSE', key: true },
        { label: 'FirstName', x: 905, y: 615, of: 'NURSE' },
        { label: 'LastName', x: 1140, y: 615, of: 'NURSE' },
        { label: 'Shift', x: 1140, y: 495, of: 'NURSE' },
      ],
    },
  },

  // ── Task 4 · Moderate · Bank ──────────────────────────────────────────
  {
    id: 'task4',
    n: 4,
    level: 'Moderate',
    place: 'Bank',
    time: '25 minutes',
    title: 'Branches, employees and joint accounts',
    aside: 'The bank from Task 1 with new rules. Two entities are connected by two different relationships.',
    scenario: [
      'This task uses Mere’s bank from Task 1. The bank now has three branches and needs a larger database.',
      'The bank has {e|branches}. Each branch has a {a|branch code}, {a|branch name} and {a|city}.',
      '{e|Customers} have a {a|customer ID}, {a|first name}, {a|last name} and {a|phone number}, as before. {e|Accounts} have an {a|account number}, {a|account type} and {a|balance}.',
      'One rule has changed. The bank now offers joint accounts, so a customer can {r|own} many accounts and an account can be owned by more than one customer. For example, two partners can share one account. The bank records the {a|date each customer was added} to an account.',
      'Each account is opened at one branch. A branch {r|holds} many accounts.',
      'The bank also has {e|employees}. Each employee has an {a|employee ID}, {a|first name}, {a|last name} and {a|job title}. Each employee {r|works at} one branch, and a branch has many employees. Each branch is {r|managed} by one employee, and an employee can manage only one branch.',
    ],
    questions: [
      'List the entities. There are four.',
      'List the attributes of each entity and identify the key attributes.',
      'Identify the four relationships and the cardinality of each.',
      'In Task 1, OWNS was 1:N. What is it now, and why?',
      'EMPLOYEE and BRANCH are connected in two ways. Show both relationships.',
      'Draw the ER diagram using Chen’s notation.',
    ],
    hint: 'Working at a branch and managing a branch are two different facts. Each one needs its own relationship, even though both connect EMPLOYEE and BRANCH.',
    entities: [
      { name: 'CUSTOMER', why: 'Same as Task 1.' },
      { name: 'ACCOUNT', why: 'Same as Task 1.' },
      { name: 'BRANCH', why: 'The bank stores details about each branch.' },
      { name: 'EMPLOYEE', why: 'The bank stores details about many employees.' },
    ],
    notEntities: 'A joint account is still an ACCOUNT. “Joint” means it can have more than one owner, and that is shown by the cardinality. A manager is not a separate entity either. A manager is an EMPLOYEE who also MANAGES a branch.',
    attributes: [
      { entity: 'CUSTOMER', key: 'CustomerID', others: ['FirstName', 'LastName', 'PhoneNumber'] },
      { entity: 'ACCOUNT', key: 'AccountNumber', others: ['AccountType', 'Balance'] },
      { entity: 'BRANCH', key: 'BranchCode', others: ['BranchName', 'City'] },
      { entity: 'EMPLOYEE', key: 'EmployeeID', others: ['FirstName', 'LastName', 'JobTitle'] },
    ],
    attributesNote: 'DateAdded is not listed here. It describes one customer and one account together, so it belongs to the OWNS relationship.',
    rels: [
      {
        name: 'CUSTOMER OWNS ACCOUNT',
        left: 'CUSTOMER',
        right: 'ACCOUNT',
        q: [
          ['One CUSTOMER can own how many ACCOUNTs?', 'Many'],
          ['One ACCOUNT can be owned by how many CUSTOMERs?', 'Many (joint accounts)'],
        ],
        ratio: 'M:N',
        numbers: 'Write M next to CUSTOMER and N next to ACCOUNT.',
        attrs: ['DateAdded'],
        note: 'The entities are the same as in Task 1, but the rule has changed, so the cardinality has changed from 1:N to M:N. Always use the rules given in the scenario.',
      },
      {
        name: 'BRANCH HOLDS ACCOUNT',
        left: 'BRANCH',
        right: 'ACCOUNT',
        q: [
          ['One BRANCH holds how many ACCOUNTs?', 'Many'],
          ['One ACCOUNT is held at how many BRANCHes?', 'One'],
        ],
        ratio: '1:N',
        numbers: 'Write 1 next to BRANCH and N next to ACCOUNT.',
      },
      {
        name: 'EMPLOYEE WORKS_AT BRANCH',
        left: 'EMPLOYEE',
        right: 'BRANCH',
        q: [
          ['One EMPLOYEE works at how many BRANCHes?', 'One'],
          ['One BRANCH has how many EMPLOYEEs?', 'Many'],
        ],
        ratio: 'N:1',
        numbers: 'Write N next to EMPLOYEE and 1 next to BRANCH.',
      },
      {
        name: 'EMPLOYEE MANAGES BRANCH',
        left: 'EMPLOYEE',
        right: 'BRANCH',
        q: [
          ['One EMPLOYEE manages how many BRANCHes?', 'One at most'],
          ['One BRANCH is managed by how many EMPLOYEEs?', 'One'],
        ],
        ratio: '1:1',
        numbers: 'Write 1 on both sides.',
        note: 'Both answers are “one”, so this relationship is one-to-one.',
      },
    ],
    readAloud: [
      'A CUSTOMER OWNS many ACCOUNTs, and an ACCOUNT can have many owners. DateAdded is recorded for each owner.',
      'A BRANCH HOLDS many ACCOUNTs. Each ACCOUNT is held at one BRANCH.',
      'An EMPLOYEE WORKS_AT one BRANCH. A BRANCH has many EMPLOYEEs.',
      'One EMPLOYEE MANAGES one BRANCH.',
    ],
    diagramLabel: 'Chen ER diagram for the bank: CUSTOMER OWNS ACCOUNT, M to N, with DateAdded on OWNS. BRANCH HOLDS ACCOUNT, 1 to N. EMPLOYEE WORKS_AT BRANCH, N to 1. EMPLOYEE MANAGES BRANCH, 1 to 1. Keys CustomerID, AccountNumber, BranchCode and EmployeeID.',
    diagram: {
      w: 1240,
      h: 700,
      minWidth: 940,
      entities: [
        { id: 'CUSTOMER', x: 140, y: 220 },
        { id: 'ACCOUNT', x: 600, y: 220 },
        { id: 'BRANCH', x: 1030, y: 220 },
        { id: 'EMPLOYEE', x: 1030, y: 550 },
      ],
      rels: [
        { id: 'OWNS', x: 370, y: 220, links: [['CUSTOMER', 'M'], ['ACCOUNT', 'N']] },
        { id: 'HOLDS', x: 815, y: 220, links: [['ACCOUNT', 'N'], ['BRANCH', '1']] },
        { id: 'WORKS_AT', x: 930, y: 385, links: [['BRANCH', '1'], ['EMPLOYEE', 'N', true]] },
        { id: 'MANAGES', x: 1130, y: 385, links: [['BRANCH', '1'], ['EMPLOYEE', '1', true]] },
      ],
      attrs: [
        { label: 'CustomerID', x: 70, y: 100, of: 'CUSTOMER', key: true },
        { label: 'FirstName', x: 210, y: 92, of: 'CUSTOMER' },
        { label: 'LastName', x: 70, y: 345, of: 'CUSTOMER' },
        { label: 'PhoneNumber', x: 215, y: 352, of: 'CUSTOMER' },
        { label: 'DateAdded', x: 370, y: 95, of: 'OWNS' },
        { label: 'AccountNumber', x: 560, y: 100, of: 'ACCOUNT', key: true },
        { label: 'AccountType', x: 545, y: 345, of: 'ACCOUNT' },
        { label: 'Balance', x: 680, y: 350, of: 'ACCOUNT' },
        { label: 'BranchCode', x: 955, y: 95, of: 'BRANCH', key: true },
        { label: 'BranchName', x: 1115, y: 95, of: 'BRANCH' },
        { label: 'City', x: 1175, y: 220, of: 'BRANCH' },
        { label: 'EmployeeID', x: 860, y: 555, of: 'EMPLOYEE', key: true },
        { label: 'FirstName', x: 900, y: 650, of: 'EMPLOYEE' },
        { label: 'LastName', x: 1160, y: 650, of: 'EMPLOYEE' },
        { label: 'JobTitle', x: 1175, y: 555, of: 'EMPLOYEE' },
      ],
    },
  },

  // ── Task 5 · Moderate · University ────────────────────────────────────
  {
    id: 'task5',
    n: 5,
    level: 'Moderate',
    place: 'University',
    time: '25 minutes',
    title: 'Courses, lecturers and assignments',
    aside: 'Four entities and four relationships. Three attributes belong to relationships.',
    scenario: [
      'Dr Aroha Ngata teaches database design at Southfield University. She wants a database for her courses and their assignments.',
      'Each {e|lecturer} has a {a|staff ID}, {a|first name}, {a|last name} and {a|email}. A lecturer {r|teaches} many courses, and each course is taught by one lecturer.',
      'Each {e|course} has a {a|course code}, {a|title} and number of {a|credits}.',
      'Each {e|student} has a {a|student ID}, {a|first name}, {a|last name} and {a|email}. A student {r|takes} many courses, and a course has many students. Each student receives a {a|grade} for each course they take.',
      'Each course {r|sets} several {e|assignments}, and each assignment belongs to one course. An assignment has an {a|assignment ID}, {a|title}, {a|due date} and {a|weight} (the percentage it counts towards the course).',
      'Students {r|submit} assignments. A student submits many assignments, and each assignment is submitted by many students. For each submission, the university records the {a|date submitted} and the {a|mark}.',
    ],
    questions: [
      'List the entities. There are four.',
      'List the attributes of each entity and identify the key attributes.',
      'Identify the four relationships and the cardinality of each.',
      'Which relationships have their own attributes?',
      'Draw the ER diagram using Chen’s notation.',
    ],
    hint: 'Look at Grade. Does it describe a student, a course, or one student in one course? Ask the same question about Mark.',
    entities: [
      { name: 'LECTURER', why: 'The university stores details about each lecturer.' },
      { name: 'COURSE', why: 'The university stores details about each course.' },
      { name: 'STUDENT', why: 'The university stores details about each student.' },
      { name: 'ASSIGNMENT', why: 'Each assignment has its own ID, title, due date and weight.' },
    ],
    notEntities: 'Dr Ngata is one LECTURER, so she is not a separate entity. “Submission” is not an entity here either. It describes a student submitting an assignment, so it is shown as the SUBMITS relationship.',
    attributes: [
      { entity: 'LECTURER', key: 'StaffID', others: ['FirstName', 'LastName', 'Email'] },
      { entity: 'COURSE', key: 'CourseCode', others: ['Title', 'Credits'] },
      { entity: 'STUDENT', key: 'StudentID', others: ['FirstName', 'LastName', 'Email'] },
      { entity: 'ASSIGNMENT', key: 'AssignmentID', others: ['Title', 'DueDate', 'Weight'] },
    ],
    attributesNote: 'Grade, DateSubmitted and Mark are not listed here. Each one describes a student together with a course or an assignment, so they belong to relationships.',
    rels: [
      {
        name: 'LECTURER TEACHES COURSE',
        left: 'LECTURER',
        right: 'COURSE',
        q: [
          ['One LECTURER teaches how many COURSEs?', 'Many'],
          ['One COURSE is taught by how many LECTURERs?', 'One'],
        ],
        ratio: '1:N',
        numbers: 'Write 1 next to LECTURER and N next to COURSE.',
      },
      {
        name: 'STUDENT TAKES COURSE',
        left: 'STUDENT',
        right: 'COURSE',
        q: [
          ['One STUDENT takes how many COURSEs?', 'Many'],
          ['One COURSE has how many STUDENTs?', 'Many'],
        ],
        ratio: 'M:N',
        numbers: 'Write M next to STUDENT and N next to COURSE.',
        attrs: ['Grade'],
        note: 'A student has a different grade in each course, and a course gives a grade to each student. So Grade belongs to TAKES.',
      },
      {
        name: 'COURSE SETS ASSIGNMENT',
        left: 'COURSE',
        right: 'ASSIGNMENT',
        q: [
          ['One COURSE sets how many ASSIGNMENTs?', 'Many'],
          ['One ASSIGNMENT belongs to how many COURSEs?', 'One'],
        ],
        ratio: '1:N',
        numbers: 'Write 1 next to COURSE and N next to ASSIGNMENT.',
      },
      {
        name: 'STUDENT SUBMITS ASSIGNMENT',
        left: 'STUDENT',
        right: 'ASSIGNMENT',
        q: [
          ['One STUDENT submits how many ASSIGNMENTs?', 'Many'],
          ['One ASSIGNMENT is submitted by how many STUDENTs?', 'Many'],
        ],
        ratio: 'M:N',
        numbers: 'Write M next to STUDENT and N next to ASSIGNMENT.',
        attrs: ['DateSubmitted', 'Mark'],
      },
    ],
    readAloud: [
      'A LECTURER TEACHES many COURSEs. Each COURSE has one LECTURER.',
      'A STUDENT TAKES many COURSEs. A COURSE has many STUDENTs. Each student gets a Grade for each course.',
      'A COURSE SETS many ASSIGNMENTs. Each ASSIGNMENT belongs to one COURSE.',
      'A STUDENT SUBMITS many ASSIGNMENTs. Each submission records a DateSubmitted and a Mark.',
    ],
    diagramLabel: 'Chen ER diagram for the university: LECTURER TEACHES COURSE, 1 to N. STUDENT TAKES COURSE, M to N, with Grade on TAKES. COURSE SETS ASSIGNMENT, 1 to N. STUDENT SUBMITS ASSIGNMENT, M to N, with DateSubmitted and Mark on SUBMITS. Keys StaffID, CourseCode, StudentID and AssignmentID.',
    diagram: {
      w: 1290,
      h: 700,
      minWidth: 980,
      entities: [
        { id: 'LECTURER', x: 150, y: 200 },
        { id: 'COURSE', x: 620, y: 200 },
        { id: 'ASSIGNMENT', x: 620, y: 540 },
        { id: 'STUDENT', x: 1060, y: 370 },
      ],
      rels: [
        { id: 'TEACHES', x: 385, y: 200, links: [['LECTURER', '1'], ['COURSE', 'N']] },
        { id: 'TAKES', x: 840, y: 285, links: [['STUDENT', 'M'], ['COURSE', 'N']] },
        { id: 'SETS', x: 620, y: 370, links: [['COURSE', '1'], ['ASSIGNMENT', 'N']] },
        { id: 'SUBMITS', x: 840, y: 455, links: [['STUDENT', 'M', true], ['ASSIGNMENT', 'N']] },
      ],
      attrs: [
        { label: 'StaffID', x: 75, y: 85, of: 'LECTURER', key: true },
        { label: 'FirstName', x: 220, y: 80, of: 'LECTURER' },
        { label: 'LastName', x: 75, y: 315, of: 'LECTURER' },
        { label: 'Email', x: 225, y: 320, of: 'LECTURER' },
        { label: 'CourseCode', x: 530, y: 85, of: 'COURSE', key: true },
        { label: 'Title', x: 680, y: 75, of: 'COURSE' },
        { label: 'Credits', x: 790, y: 120, of: 'COURSE' },
        { label: 'Grade', x: 930, y: 185, of: 'TAKES' },
        { label: 'AssignmentID', x: 450, y: 520, of: 'ASSIGNMENT', key: true },
        { label: 'Title', x: 470, y: 625, of: 'ASSIGNMENT' },
        { label: 'DueDate', x: 610, y: 655, of: 'ASSIGNMENT' },
        { label: 'Weight', x: 745, y: 640, of: 'ASSIGNMENT' },
        { label: 'DateSubmitted', x: 890, y: 600, of: 'SUBMITS' },
        { label: 'Mark', x: 1000, y: 540, of: 'SUBMITS' },
        { label: 'StudentID', x: 1165, y: 262, of: 'STUDENT', key: true },
        { label: 'FirstName', x: 1225, y: 330, of: 'STUDENT' },
        { label: 'LastName', x: 1225, y: 415, of: 'STUDENT' },
        { label: 'Email', x: 1165, y: 480, of: 'STUDENT' },
      ],
    },
  },
];

/** The small diagram in the hero: part of Task 1's answer. */
export const HERO_DIAGRAM: DiagramSpec = {
  w: 600,
  h: 232,
  minWidth: 0,
  entities: [
    { id: 'CUSTOMER', x: 115, y: 116 },
    { id: 'ACCOUNT', x: 485, y: 116 },
  ],
  rels: [{ id: 'OWNS', x: 300, y: 116, links: [['CUSTOMER', '1'], ['ACCOUNT', 'N']] }],
  attrs: [
    { label: 'CustomerID', x: 92, y: 32, of: 'CUSTOMER', key: true },
    { label: 'FirstName', x: 150, y: 202, of: 'CUSTOMER' },
    { label: 'AccountNumber', x: 500, y: 32, of: 'ACCOUNT', key: true },
    { label: 'Balance', x: 450, y: 202, of: 'ACCOUNT' },
  ],
};
