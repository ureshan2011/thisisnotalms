export interface ErMcqQuestion {
  id: string;
  category: string;
  question: string;
  choices: string[];
  correct: number; // 0-indexed
}

export const ER_MCQ_COLLECTION = 'erMcqResults';
export const ER_MCQ_QUIZ_TITLE = 'ER Diagrams & Advanced ER Concepts';
export const ER_MCQ_PASS_PERCENTAGE = 50;
export const ER_MCQ_DISTINCTION_PERCENTAGE = 90; // badge threshold
export const ER_MCQ_MAX_ATTEMPTS = 3;

export const ER_MCQ_QUESTIONS: ErMcqQuestion[] = [
  // ── ER Diagram Fundamentals ───────────────────────────────────────────────
  {
    id: 'er01',
    category: 'ER Diagram Fundamentals',
    question: 'In Chen\'s ER notation, which shape is used to represent an entity?',
    choices: [
      'Diamond',
      'Oval',
      'Rectangle',
      'Double rectangle',
    ],
    correct: 2,
  },
  {
    id: 'er02',
    category: 'ER Diagram Fundamentals',
    question: 'In Chen\'s ER notation, which shape represents a relationship between entities?',
    choices: [
      'Rectangle',
      'Diamond',
      'Oval',
      'Double oval',
    ],
    correct: 1,
  },
  {
    id: 'er03',
    category: 'ER Diagram Fundamentals',
    question: 'What shape is used to represent an attribute in Chen\'s ER notation?',
    choices: [
      'Rectangle',
      'Diamond',
      'Oval',
      'Double rectangle',
    ],
    correct: 2,
  },
  {
    id: 'er04',
    category: 'ER Diagram Fundamentals',
    question: 'What is a key attribute in an ER diagram?',
    choices: [
      'An attribute that can hold multiple values for a single entity',
      'An attribute whose value uniquely identifies each entity instance',
      'An attribute calculated from other stored attributes',
      'An attribute that can be left empty (NULL)',
    ],
    correct: 1,
  },
  {
    id: 'er05',
    category: 'ER Diagram Fundamentals',
    question: 'In an ER diagram, what does cardinality describe?',
    choices: [
      'The data type stored in each attribute',
      'The total number of entities allowed in the database',
      'The number of instances of one entity that can be associated with instances of another',
      'The storage size required for each relationship',
    ],
    correct: 2,
  },
  {
    id: 'er06',
    category: 'ER Diagram Fundamentals',
    question: 'What is a composite attribute in an ER diagram?',
    choices: [
      'An attribute that uniquely identifies an entity',
      'An attribute that can store multiple values simultaneously',
      'An attribute made up of multiple sub-attributes (e.g., Full Name = First + Last)',
      'An attribute derived from a calculation on other attributes',
    ],
    correct: 2,
  },
  {
    id: 'er07',
    category: 'ER Diagram Fundamentals',
    question: 'How is a key attribute distinguished from other attributes in Chen\'s ER notation?',
    choices: [
      'It is drawn as a double oval',
      'Its name is underlined',
      'It is placed inside the entity rectangle',
      'It is connected to the entity with a double line',
    ],
    correct: 1,
  },

  // ── Relationships & Cardinality ───────────────────────────────────────────
  {
    id: 'er08',
    category: 'Relationships & Cardinality',
    question: 'A student can enrol in many courses, and each course can have many students. What relationship type exists between Student and Course?',
    choices: [
      'One-to-One',
      'One-to-Many',
      'Many-to-One',
      'Many-to-Many',
    ],
    correct: 3,
  },
  {
    id: 'er09',
    category: 'Relationships & Cardinality',
    question: 'In a hospital, each patient is assigned to exactly one primary doctor, and a doctor can manage many patients. What is the relationship between Doctor and Patient?',
    choices: [
      'Many-to-Many',
      'One-to-Many',
      'One-to-One',
      'Many-to-One',
    ],
    correct: 1,
  },
  {
    id: 'er10',
    category: 'Relationships & Cardinality',
    question: 'In an online store, each order belongs to exactly one customer, but a customer can place many orders. What relationship exists between Customer and Order?',
    choices: [
      'One-to-One',
      'Many-to-Many',
      'One-to-Many',
      'Many-to-One',
    ],
    correct: 2,
  },
  {
    id: 'er11',
    category: 'Relationships & Cardinality',
    question: 'What does "total participation" mean in an ER diagram?',
    choices: [
      'Only some entity instances participate in the relationship',
      'Every entity instance must participate in at least one instance of the relationship',
      'The relationship must have a maximum cardinality of one on both sides',
      'All entities in the database are linked to each other',
    ],
    correct: 1,
  },
  {
    id: 'er12',
    category: 'Relationships & Cardinality',
    question: 'In a university, every faculty member must be assigned to a department, but a department can exist without any assigned faculty. Which entity has total participation in the "Assigned-To" relationship?',
    choices: [
      'Department',
      'Faculty Member',
      'Both entities',
      'Neither entity',
    ],
    correct: 1,
  },
  {
    id: 'er13',
    category: 'Relationships & Cardinality',
    question: 'In a hotel system, a room can be booked by many guests over time, and a guest can book many rooms across different stays. What is the relationship between Guest and Room?',
    choices: [
      'One-to-One',
      'One-to-Many',
      'Many-to-Many',
      'Many-to-One',
    ],
    correct: 2,
  },

  // ── Advanced ER Concepts ──────────────────────────────────────────────────
  {
    id: 'er14',
    category: 'Advanced ER Concepts',
    question: 'What is a weak entity in an ER diagram?',
    choices: [
      'An entity with no attributes',
      'An entity that cannot be uniquely identified by its own attributes alone and depends on an owner entity',
      'An entity with fewer than three attributes',
      'An entity that only participates in one-to-one relationships',
    ],
    correct: 1,
  },
  {
    id: 'er15',
    category: 'Advanced ER Concepts',
    question: 'How is a weak entity represented in Chen\'s ER notation?',
    choices: [
      'Single rectangle',
      'Oval with a dashed border',
      'Double rectangle',
      'Diamond with a double border',
    ],
    correct: 2,
  },
  {
    id: 'er16',
    category: 'Advanced ER Concepts',
    question: 'What is an identifying relationship in an ER diagram?',
    choices: [
      'A relationship between two strong entities that share a primary key',
      'The relationship that connects a weak entity to its owner (identifying) entity',
      'A relationship where all participating entities have the same key attribute',
      'A many-to-many relationship that requires a junction table',
    ],
    correct: 1,
  },
  {
    id: 'er17',
    category: 'Advanced ER Concepts',
    question: 'What is a multivalued attribute in an ER diagram?',
    choices: [
      'An attribute whose value is calculated from other attributes',
      'An attribute composed of multiple sub-parts',
      'An attribute that can hold more than one value for a single entity instance (e.g., multiple phone numbers)',
      'An attribute that uniquely identifies an entity',
    ],
    correct: 2,
  },
  {
    id: 'er18',
    category: 'Advanced ER Concepts',
    question: 'How is a multivalued attribute shown in Chen\'s ER notation?',
    choices: [
      'Single oval',
      'Dashed oval',
      'Double oval',
      'Underlined name inside a single oval',
    ],
    correct: 2,
  },
  {
    id: 'er19',
    category: 'Advanced ER Concepts',
    question: 'What is a derived attribute in an ER diagram?',
    choices: [
      'An attribute that uniquely identifies each entity instance',
      'An attribute that can be computed from other stored attributes (e.g., Age derived from Date of Birth)',
      'An attribute that can store multiple values',
      'An attribute shared between two related entities',
    ],
    correct: 1,
  },
  {
    id: 'er20',
    category: 'Advanced ER Concepts',
    question: 'What is a partial key (discriminator) in the context of weak entities?',
    choices: [
      'The primary key of the owner entity copied into the weak entity',
      'A foreign key that links the weak entity to its owner entity',
      'An attribute set that uniquely identifies weak entity instances among those associated with the same owner',
      'The relationship diamond connecting the weak entity to its owner',
    ],
    correct: 2,
  },
];

export const ER_MCQ_CATEGORIES = [...new Set(ER_MCQ_QUESTIONS.map((q) => q.category))];
