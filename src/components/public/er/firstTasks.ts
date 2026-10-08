import type { DiagramSpec } from './ChenDiagram';

// ─── The five tasks on /er-first-steps ─────────────────────────────────────
// Two simple ones, then three moderate ones, for students drawing an ER
// diagram for the very first time. Every story is short and written in
// plain, short sentences. Two of them come back later, bigger: Mere's bank
// in Task 1 grows into Task 4, and Southfield University in Task 2 comes
// back in Task 5. Seeing a model they already drew change is the point —
// in particular, CUSTOMER OWNS ACCOUNT is 1:N in Task 1 and M:N in Task 4,
// because the story's rule changed, not the entities.
//
// Naming follows one convention throughout, and the lesson teaches it:
//   • Entity — a singular noun in capitals: CUSTOMER, ASSIGNMENT
//   • Relationship — a verb in capitals, words joined by _: OWNS, STAYS_IN
//   • Attribute — starts with a capital, no spaces, each word capitalised:
//     FirstName, DateOfBirth. The key attribute is underlined.
// Cardinality is written as 1, N or M beside the entity it counts.
//
// Story markup: {e|…} is an entity clue, {a|…} an attribute clue and
// {r|…} a relationship clue. They show only when a student asks for the
// clues; otherwise the story reads as plain text.

export interface RelAnswer {
  /** The relationship as a sentence, entity – verb – entity. */
  name: string;
  left: string;
  right: string;
  /** Asked from the left entity, then from the right one. */
  q: [string, string][];
  ratio: string;
  /** Where the numbers go, in one short sentence. */
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
  aside: string;
  /** Paragraphs, with {e|…} {a|…} {r|…} clue markup. */
  story: string[];
  questions: string[];
  hint: string;
  /** A new idea this task introduces, shown before the student starts. */
  newIdea?: { title: string; body: string };
  entities: { name: string; why: string }[];
  notEntities: string;
  attributes: { entity: string; key: string; others: string[] }[];
  attributesNote: string;
  rels: RelAnswer[];
  relsNote?: string;
  readAloud: string[];
  cheer: string;
  diagram: DiagramSpec;
  diagramLabel: string;
}

export const TASKS: ERTaskSpec[] = [
  // ── Task 1 · Simple · Bank ────────────────────────────────────────────
  {
    id: 'task1',
    n: 1,
    level: 'Simple',
    place: 'Bank',
    time: '10 minutes',
    title: 'Customers and their accounts',
    aside: 'Two entities and one relationship. Take your time with this one. Every other task on the page is built the same way.',
    story: [
      'Mere runs a small community bank in Hamilton. Right now she keeps everything in a big paper notebook. She wants a database instead.',
      'The bank has {e|customers}. For each customer, Mere writes down a {a|customer ID}, a {a|first name}, a {a|last name} and a {a|phone number}. Every customer gets a different customer ID.',
      'Customers open {e|accounts}. Each account has an {a|account number}, an {a|account type} (savings or everyday) and a {a|balance}. No two accounts have the same account number.',
      'A customer {r|owns} one or more accounts. In Mere’s bank, each account belongs to just one customer.',
    ],
    questions: [
      'What are the entities? There are two.',
      'What attributes does each entity have? Which one is the key?',
      'What is the relationship between them? What is its cardinality?',
      'Draw the ER diagram in Chen’s notation.',
    ],
    hint: 'Look for nouns you could have many of. “Bank” is not one. The bank is the whole system, so it doesn’t get its own box.',
    entities: [
      { name: 'CUSTOMER', why: 'Mere keeps facts about each customer, and there are many customers.' },
      { name: 'ACCOUNT', why: 'Each account has its own facts too, and there are many accounts.' },
    ],
    notEntities: 'The bank is not an entity. It’s where the database lives. Mere isn’t one either. She uses the database. She isn’t stored in it.',
    attributes: [
      { entity: 'CUSTOMER', key: 'CustomerID', others: ['FirstName', 'LastName', 'PhoneNumber'] },
      { entity: 'ACCOUNT', key: 'AccountNumber', others: ['AccountType', 'Balance'] },
    ],
    attributesNote: 'Two customers could both be called Sam Lee. They can’t share a CustomerID. That’s why the ID is the key, and not the name.',
    rels: [
      {
        name: 'CUSTOMER OWNS ACCOUNT',
        left: 'CUSTOMER',
        right: 'ACCOUNT',
        q: [
          ['One CUSTOMER can own how many ACCOUNTs?', 'Many.'],
          ['One ACCOUNT is owned by how many CUSTOMERs?', 'One. The story says so.'],
        ],
        ratio: '1:N',
        numbers: '1 goes beside CUSTOMER. N goes beside ACCOUNT.',
      },
    ],
    readAloud: [
      'One CUSTOMER OWNS many ACCOUNTs.',
      'Each ACCOUNT is owned by one CUSTOMER.',
      'Every CUSTOMER has their own CustomerID. Every ACCOUNT has its own AccountNumber.',
    ],
    cheer: 'That’s your first ER diagram. Really. Every bigger diagram is just more of this.',
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
    aside: 'Still two entities. This time the link goes both ways, and one fact belongs to the link itself.',
    story: [
      'Sione works at the student centre at Southfield University. He looks after the student clubs. There’s a chess club, a hiking club, a cooking club and plenty more.',
      'Each {e|student} has a {a|student ID}, a {a|first name}, a {a|last name} and an {a|email}. Each {e|club} has a {a|club ID}, a {a|club name} and a {a|meeting day}.',
      'A student can {r|join} as many clubs as they like. A club has lots of students. Sione also wants to keep the {a|date} each student joined each club.',
    ],
    questions: [
      'What are the entities?',
      'What attributes does each entity have? Underline the key.',
      'What is the relationship? What is its cardinality?',
      'Where does the join date go?',
      'Draw the ER diagram in Chen’s notation.',
    ],
    hint: 'Ask the two questions. One student can join how many clubs? One club can have how many students?',
    newIdea: {
      title: 'New idea: a fact about the link',
      body: 'Look at the join date. Is it a fact about the student? Not really. A student in three clubs has three join dates. Is it about the club? No. A club has a different join date for every member. It only makes sense for one student joining one club. So it hangs off the diamond, not off a rectangle.',
    },
    entities: [
      { name: 'STUDENT', why: 'Sione keeps facts about each student, and there are many students.' },
      { name: 'CLUB', why: 'Each club has its own facts, and there are many clubs.' },
    ],
    notEntities: 'The university and the student centre are not entities. Sione isn’t one either. Chess, hiking and cooking aren’t entities. They are examples of clubs, so they would be values of ClubName.',
    attributes: [
      { entity: 'STUDENT', key: 'StudentID', others: ['FirstName', 'LastName', 'Email'] },
      { entity: 'CLUB', key: 'ClubID', others: ['ClubName', 'MeetingDay'] },
    ],
    attributesNote: 'DateJoined isn’t in either list. It isn’t about the student alone or the club alone. It belongs to the relationship.',
    rels: [
      {
        name: 'STUDENT JOINS CLUB',
        left: 'STUDENT',
        right: 'CLUB',
        q: [
          ['One STUDENT can join how many CLUBs?', 'Many.'],
          ['One CLUB can have how many STUDENTs?', 'Many.'],
        ],
        ratio: 'M:N',
        numbers: 'M goes beside STUDENT. N goes beside CLUB.',
        attrs: ['DateJoined'],
        note: 'Both answers were “many”, so it’s many-to-many. DateJoined sits on the JOINS diamond.',
      },
    ],
    readAloud: [
      'A STUDENT JOINS many CLUBs.',
      'A CLUB has many STUDENTs.',
      'Each time a student joins a club, we keep the DateJoined.',
    ],
    cheer: 'Two done. If you put DateJoined on the diamond, you’ve already got an idea a lot of people miss.',
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
    aside: 'Four entities and three relationships. Nothing new to learn. There’s just more of it, so go one relationship at a time.',
    story: [
      'Priya is a charge nurse at Riverside Hospital. The hospital still keeps track of patients on whiteboards. She has been asked to help design a database.',
      'The hospital has {e|wards}. Each ward has a {a|ward number}, a {a|ward name} and a {a|number of beds}.',
      '{e|Patients} {r|stay in} a ward. Each patient stays in one ward. A ward has many patients. For each patient, the hospital keeps a {a|patient ID}, a {a|first name}, a {a|last name} and a {a|date of birth}.',
      '{e|Nurses} {r|work in} wards. Each nurse works in one ward. A ward has many nurses. A nurse has a {a|nurse ID}, a {a|first name}, a {a|last name} and a {a|shift} (day or night).',
      '{e|Doctors} {r|treat} patients. One doctor treats many patients. One patient can be treated by many doctors. A doctor has a {a|doctor ID}, a {a|first name}, a {a|last name} and a {a|specialty}. Each time a doctor treats a patient, the hospital writes down the {a|treatment date} and the {a|diagnosis}.',
    ],
    questions: [
      'What are the entities? There are four.',
      'What attributes does each entity have? Underline each key.',
      'Find the three relationships. Give each one its cardinality.',
      'Which relationship has attributes of its own?',
      'Draw the full ER diagram in Chen’s notation.',
    ],
    hint: 'Draw the four rectangles first, spread out. Then add one diamond, ask the two questions and write the numbers. Then do the next diamond.',
    entities: [
      { name: 'WARD', why: 'The hospital keeps facts about each ward.' },
      { name: 'PATIENT', why: 'Many patients, each with their own facts.' },
      { name: 'NURSE', why: 'Many nurses, each with their own facts.' },
      { name: 'DOCTOR', why: 'Many doctors, each with their own facts.' },
    ],
    notEntities: 'The hospital and the whiteboards are not entities. And Priya? She is a nurse, so she isn’t a new entity. She would be one of the nurses stored in NURSE.',
    attributes: [
      { entity: 'WARD', key: 'WardNumber', others: ['WardName', 'NumberOfBeds'] },
      { entity: 'PATIENT', key: 'PatientID', others: ['FirstName', 'LastName', 'DateOfBirth'] },
      { entity: 'NURSE', key: 'NurseID', others: ['FirstName', 'LastName', 'Shift'] },
      { entity: 'DOCTOR', key: 'DoctorID', others: ['FirstName', 'LastName', 'Specialty'] },
    ],
    attributesNote: 'We keep DateOfBirth, not Age. A birthday never changes. An age changes every year. Also, NURSE and DOCTOR both have a FirstName. That’s fine. Each one belongs to its own entity.',
    rels: [
      {
        name: 'PATIENT STAYS_IN WARD',
        left: 'PATIENT',
        right: 'WARD',
        q: [
          ['One PATIENT stays in how many WARDs?', 'One.'],
          ['One WARD has how many PATIENTs?', 'Many.'],
        ],
        ratio: 'N:1',
        numbers: 'N goes beside PATIENT. 1 goes beside WARD.',
        note: 'N:1 is just 1:N read from the other end. One ward, many patients. Same thing.',
      },
      {
        name: 'NURSE WORKS_IN WARD',
        left: 'NURSE',
        right: 'WARD',
        q: [
          ['One NURSE works in how many WARDs?', 'One.'],
          ['One WARD has how many NURSEs?', 'Many.'],
        ],
        ratio: 'N:1',
        numbers: 'N goes beside NURSE. 1 goes beside WARD.',
      },
      {
        name: 'DOCTOR TREATS PATIENT',
        left: 'DOCTOR',
        right: 'PATIENT',
        q: [
          ['One DOCTOR treats how many PATIENTs?', 'Many.'],
          ['One PATIENT is treated by how many DOCTORs?', 'Many.'],
        ],
        ratio: 'M:N',
        numbers: 'M goes beside DOCTOR. N goes beside PATIENT.',
        attrs: ['TreatmentDate', 'Diagnosis'],
        note: 'A diagnosis isn’t about the doctor alone or the patient alone. It’s about this doctor seeing this patient. So both facts sit on TREATS.',
      },
    ],
    readAloud: [
      'A PATIENT STAYS_IN one WARD. A WARD has many PATIENTs.',
      'A NURSE WORKS_IN one WARD. A WARD has many NURSEs.',
      'A DOCTOR TREATS many PATIENTs. A PATIENT can be treated by many DOCTORs.',
      'Each treatment has a TreatmentDate and a Diagnosis.',
    ],
    cheer: 'Four entities, three relationships. That’s a real hospital design. If your drawing is laid out differently, that’s fine. Same boxes, same links and same numbers means the same diagram.',
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
    title: 'Mere’s bank grows',
    aside: 'The bank from Task 1, a few years later. Watch what happens to OWNS when the rules change, and see two entities linked twice.',
    story: [
      'Remember Mere’s bank from Task 1? Business is going well. It now has three branches, and the old database is too small.',
      'The bank has {e|branches}. Each branch has a {a|branch code}, a {a|branch name} and a {a|city}.',
      '{e|Customers} still have a {a|customer ID}, a {a|first name}, a {a|last name} and a {a|phone number}. {e|Accounts} still have an {a|account number}, an {a|account type} and a {a|balance}.',
      'Here’s the big change. The bank now offers joint accounts. A customer can {r|own} many accounts, and one account can be owned by more than one customer. For example, a couple can share an account. The bank keeps the {a|date each customer was added} to an account.',
      'Each account is opened at one branch. A branch {r|holds} many accounts.',
      'The bank also has {e|employees}. Each employee has an {a|employee ID}, a {a|first name}, a {a|last name} and a {a|job title}. Each employee {r|works at} one branch. A branch has many employees. Each branch is {r|managed} by one employee. An employee can manage only one branch.',
    ],
    questions: [
      'What are the four entities?',
      'What attributes does each entity have? Underline each key.',
      'Find all four relationships and give each one its cardinality.',
      'CUSTOMER and ACCOUNT were 1:N in Task 1. What are they now, and why?',
      'EMPLOYEE and BRANCH are linked in two different ways. Can you show both?',
      'Draw the full ER diagram in Chen’s notation.',
    ],
    hint: 'Working at a branch and managing a branch are two different facts. Two different facts need two different diamonds, even between the same two entities.',
    entities: [
      { name: 'CUSTOMER', why: 'Same as Task 1.' },
      { name: 'ACCOUNT', why: 'Same as Task 1.' },
      { name: 'BRANCH', why: 'New. The bank keeps facts about each branch.' },
      { name: 'EMPLOYEE', why: 'New. Many employees, each with their own facts.' },
    ],
    notEntities: '“Joint account” is not a new entity. It’s still an ACCOUNT. Joint only means it has more than one owner, and that’s a cardinality, not a box. Manager isn’t a separate entity either. A manager is an EMPLOYEE who also MANAGES a branch.',
    attributes: [
      { entity: 'CUSTOMER', key: 'CustomerID', others: ['FirstName', 'LastName', 'PhoneNumber'] },
      { entity: 'ACCOUNT', key: 'AccountNumber', others: ['AccountType', 'Balance'] },
      { entity: 'BRANCH', key: 'BranchCode', others: ['BranchName', 'City'] },
      { entity: 'EMPLOYEE', key: 'EmployeeID', others: ['FirstName', 'LastName', 'JobTitle'] },
    ],
    attributesNote: 'DateAdded is missing from these lists on purpose. It’s about one customer and one account together, so it goes on the OWNS diamond.',
    rels: [
      {
        name: 'CUSTOMER OWNS ACCOUNT',
        left: 'CUSTOMER',
        right: 'ACCOUNT',
        q: [
          ['One CUSTOMER can own how many ACCOUNTs?', 'Many.'],
          ['One ACCOUNT can be owned by how many CUSTOMERs?', 'Many. That’s what joint means.'],
        ],
        ratio: 'M:N',
        numbers: 'M goes beside CUSTOMER. N goes beside ACCOUNT.',
        attrs: ['DateAdded'],
        note: 'Same two entities as Task 1, but now M:N. The rule in the story changed, so the cardinality changed. Always go by the story, not by what you think banks usually do.',
      },
      {
        name: 'BRANCH HOLDS ACCOUNT',
        left: 'BRANCH',
        right: 'ACCOUNT',
        q: [
          ['One BRANCH holds how many ACCOUNTs?', 'Many.'],
          ['One ACCOUNT is held at how many BRANCHes?', 'One.'],
        ],
        ratio: '1:N',
        numbers: '1 goes beside BRANCH. N goes beside ACCOUNT.',
      },
      {
        name: 'EMPLOYEE WORKS_AT BRANCH',
        left: 'EMPLOYEE',
        right: 'BRANCH',
        q: [
          ['One EMPLOYEE works at how many BRANCHes?', 'One.'],
          ['One BRANCH has how many EMPLOYEEs?', 'Many.'],
        ],
        ratio: 'N:1',
        numbers: 'N goes beside EMPLOYEE. 1 goes beside BRANCH.',
      },
      {
        name: 'EMPLOYEE MANAGES BRANCH',
        left: 'EMPLOYEE',
        right: 'BRANCH',
        q: [
          ['One EMPLOYEE manages how many BRANCHes?', 'One, at most.'],
          ['One BRANCH is managed by how many EMPLOYEEs?', 'One.'],
        ],
        ratio: '1:1',
        numbers: '1 goes on both sides.',
        note: 'This is your first 1:1. Both answers were “one”.',
      },
    ],
    readAloud: [
      'A CUSTOMER OWNS many ACCOUNTs. An ACCOUNT can have many owners. Each owner has a DateAdded.',
      'A BRANCH HOLDS many ACCOUNTs. Each ACCOUNT is held at one BRANCH.',
      'An EMPLOYEE WORKS_AT one BRANCH. A BRANCH has many EMPLOYEEs.',
      'One EMPLOYEE MANAGES one BRANCH.',
    ],
    cheer: 'Two diamonds between the same pair of boxes is the bit most people get stuck on. If you drew both, you’re doing well.',
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
    aside: 'Back at Southfield University. You’ve handed in assignments yourself, so you already know how this one works. You just haven’t drawn it yet.',
    story: [
      'Dr Aroha Ngata teaches database design at Southfield University. She wants one database for her courses and the assignments in them.',
      'Each {e|lecturer} has a {a|staff ID}, a {a|first name}, a {a|last name} and an {a|email}. A lecturer {r|teaches} many courses. Each course is taught by one lecturer.',
      'Each {e|course} has a {a|course code}, a {a|title} and a number of {a|credits}.',
      '{e|Students} have a {a|student ID}, a {a|first name}, a {a|last name} and an {a|email}. A student {r|takes} many courses. A course has many students. At the end, each student gets a {a|grade} for each course.',
      'Each course {r|sets} several {e|assignments}. An assignment belongs to one course. Each assignment has an {a|assignment ID}, a {a|title}, a {a|due date} and a {a|weight} (how much it counts, like 40%).',
      'Students {r|submit} assignments. A student submits many assignments. Each assignment is submitted by many students. For every submission, the university keeps the {a|date submitted} and the {a|mark}.',
    ],
    questions: [
      'What are the four entities?',
      'What attributes does each entity have? Underline each key.',
      'Find all four relationships and give each one its cardinality.',
      'Which relationships have attributes of their own?',
      'Draw the full ER diagram in Chen’s notation.',
    ],
    hint: 'The grade is the tricky one. Is it about the student? About the course? Or about one student in one course? Ask the same thing about the mark.',
    entities: [
      { name: 'LECTURER', why: 'Facts about each lecturer.' },
      { name: 'COURSE', why: 'Facts about each course.' },
      { name: 'STUDENT', why: 'Facts about each student.' },
      { name: 'ASSIGNMENT', why: 'Each assignment has its own ID, title, due date and weight.' },
    ],
    notEntities: 'Dr Ngata is one LECTURER, not a new entity. And “submission” sounds like a noun, but here it means the act of submitting. It links one student to one assignment, so it’s the SUBMITS diamond.',
    attributes: [
      { entity: 'LECTURER', key: 'StaffID', others: ['FirstName', 'LastName', 'Email'] },
      { entity: 'COURSE', key: 'CourseCode', others: ['Title', 'Credits'] },
      { entity: 'STUDENT', key: 'StudentID', others: ['FirstName', 'LastName', 'Email'] },
      { entity: 'ASSIGNMENT', key: 'AssignmentID', others: ['Title', 'DueDate', 'Weight'] },
    ],
    attributesNote: 'Grade, DateSubmitted and Mark aren’t in these lists. Each of them needs two sides to make sense, so they go on diamonds.',
    rels: [
      {
        name: 'LECTURER TEACHES COURSE',
        left: 'LECTURER',
        right: 'COURSE',
        q: [
          ['One LECTURER teaches how many COURSEs?', 'Many.'],
          ['One COURSE is taught by how many LECTURERs?', 'One.'],
        ],
        ratio: '1:N',
        numbers: '1 goes beside LECTURER. N goes beside COURSE.',
      },
      {
        name: 'STUDENT TAKES COURSE',
        left: 'STUDENT',
        right: 'COURSE',
        q: [
          ['One STUDENT takes how many COURSEs?', 'Many.'],
          ['One COURSE has how many STUDENTs?', 'Many.'],
        ],
        ratio: 'M:N',
        numbers: 'M goes beside STUDENT. N goes beside COURSE.',
        attrs: ['Grade'],
        note: 'You get a different grade in each course, and each course gives out many grades. A grade is about one student in one course.',
      },
      {
        name: 'COURSE SETS ASSIGNMENT',
        left: 'COURSE',
        right: 'ASSIGNMENT',
        q: [
          ['One COURSE sets how many ASSIGNMENTs?', 'Many.'],
          ['One ASSIGNMENT belongs to how many COURSEs?', 'One.'],
        ],
        ratio: '1:N',
        numbers: '1 goes beside COURSE. N goes beside ASSIGNMENT.',
      },
      {
        name: 'STUDENT SUBMITS ASSIGNMENT',
        left: 'STUDENT',
        right: 'ASSIGNMENT',
        q: [
          ['One STUDENT submits how many ASSIGNMENTs?', 'Many.'],
          ['One ASSIGNMENT is submitted by how many STUDENTs?', 'Many.'],
        ],
        ratio: 'M:N',
        numbers: 'M goes beside STUDENT. N goes beside ASSIGNMENT.',
        attrs: ['DateSubmitted', 'Mark'],
      },
    ],
    readAloud: [
      'A LECTURER TEACHES many COURSEs. Each COURSE has one LECTURER.',
      'A STUDENT TAKES many COURSEs. A COURSE has many STUDENTs. Each pair has a Grade.',
      'A COURSE SETS many ASSIGNMENTs. Each ASSIGNMENT belongs to one COURSE.',
      'A STUDENT SUBMITS many ASSIGNMENTs. Each submission has a DateSubmitted and a Mark.',
    ],
    cheer: 'That’s all five. A week ago this would have looked like a maze. Now you can read every line of it.',
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

/** The small diagram in the hero: Task 1's answer, cut down. */
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
