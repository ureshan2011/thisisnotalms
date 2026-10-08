// ─── Shared text for the ER diagram tutorial ──────────────────────────────
// Used by the web page (/er-first-steps) and by the two printable PDFs
// (scripts/er-tutorial-pdf), so the page and the handouts always say the
// same thing. The five tasks themselves live in firstTasks.ts.

export const PDF_DIR = 'mbi802/er-tutorial';
export const PDF_TUTORIAL = 'MBI802-ER-Diagram-Tutorial.pdf';
export const PDF_ANSWERS = 'MBI802-ER-Diagram-Tutorial-Answers.pdf';

export interface ShapeInfo {
  kind: 'entity' | 'attr' | 'key' | 'rel';
  /** The example drawn inside the shape. */
  label: string;
  name: string;
  shape: string;
  what: string;
  clue: string;
}

export const SHAPES: ShapeInfo[] = [
  {
    kind: 'entity',
    label: 'CUSTOMER',
    name: 'Entity',
    shape: 'Rectangle',
    what: 'A person, place, thing or event that the organisation stores data about. Each entity becomes a table.',
    clue: 'Usually a noun, such as customer or course.',
  },
  {
    kind: 'attr',
    label: 'FirstName',
    name: 'Attribute',
    shape: 'Ellipse',
    what: 'One piece of information about an entity. Each attribute becomes a column.',
    clue: 'Often follows “each customer has a…”.',
  },
  {
    kind: 'key',
    label: 'CustomerID',
    name: 'Key attribute',
    shape: 'Ellipse, name underlined',
    what: 'An attribute whose value is different for every instance. It becomes the primary key.',
    clue: 'Often an ID, a number or a code.',
  },
  {
    kind: 'rel',
    label: 'OWNS',
    name: 'Relationship',
    shape: 'Diamond',
    what: 'Shows how two entities are connected.',
    clue: 'Usually a verb, such as owns, joins or teaches.',
  },
];

/** Shape, rule, correct example, incorrect example. */
export const NAMING: [string, string, string, string][] = [
  ['Entity', 'Singular noun in capitals. Use _ between words.', 'CUSTOMER, ID_CARD', 'Customers, customer'],
  ['Relationship', 'Verb in capitals. Use _ between words.', 'OWNS, WORKS_IN', 'Ownership, works in'],
  ['Attribute', 'No spaces. Start each word with a capital letter.', 'FirstName, DateOfBirth', 'first name, DOB, fname'],
  ['Key attribute', 'Same as an attribute, with the name underlined. Usually ends in ID, Number or Code.', 'CustomerID', 'id, Cust_No'],
];

export const STEPS: [string, string][] = [
  ['Read the scenario.', 'Read it once to understand it. Then read it again and mark the important words.'],
  ['Find the entities.', 'Look for nouns that the organisation stores data about. Do not include the organisation itself.'],
  ['List the attributes.', 'Write down the facts stored about each entity. Choose the key attribute: the one that is unique for each instance.'],
  ['Find the relationships.', 'Look for verbs that connect two entities. Write each one as ENTITY VERB ENTITY, for example CUSTOMER OWNS ACCOUNT.'],
  ['Work out the cardinality and draw.', 'Use the two questions below for each relationship. Draw the entities first, then the relationships, then the attributes.'],
];

export const CARDINALITY = {
  intro: 'For each relationship, ask one question from each side.',
  example: [
    ['One CUSTOMER can own how many ACCOUNTs?', 'Many'],
    ['One ACCOUNT is owned by how many CUSTOMERs?', 'One'],
  ] as [string, string][],
  rules: [
    ['Both answers are “one”', '1:1'],
    ['One answer is “one” and the other is “many”', '1:N'],
    ['Both answers are “many”', 'M:N'],
  ] as [string, string][],
  where:
    'Write each number next to the entity it counts. A customer has many accounts, so N goes next to ACCOUNT. An account has one customer, so 1 goes next to CUSTOMER.',
};

export const CHECKLIST = [
  'Every entity is a singular noun in capitals, inside a rectangle.',
  'Every entity has one key attribute, and its name is underlined.',
  'Every relationship is a verb in capitals, inside a diamond, connected to two entities.',
  'Every relationship line has a 1, N or M next to its entity.',
  'Every ellipse is connected to an entity or a relationship.',
];

export const LAYOUT_NOTE =
  'Your layout can be different from the answer. Your diagram is correct if it has the same entities, keys, relationships and cardinalities.';

export const MISTAKES: { title: string; fix: string }[] = [
  {
    title: 'Drawing the organisation as an entity',
    fix: 'BANK or HOSPITAL is the whole system, not one entity in it. Leave it out.',
  },
  {
    title: 'Using plural names',
    fix: 'Write CUSTOMER, not CUSTOMERS. An entity name describes one instance.',
  },
  {
    title: 'Leaving out the key',
    fix: 'Every entity needs one key attribute, underlined. If the scenario has no unique attribute, add an ID.',
  },
  {
    title: 'Putting a relationship attribute on an entity',
    fix: 'If a fact needs both entities to make sense, such as Grade, attach it to the relationship.',
  },
  {
    title: 'Guessing the cardinality',
    fix: 'Use the rules in the scenario. In Task 1 each account has one owner, even though real banks often allow joint accounts.',
  },
  {
    title: 'Using a noun for a relationship',
    fix: 'Write OWNS or TAKES, not OWNERSHIP or ENROLMENT.',
  },
];
