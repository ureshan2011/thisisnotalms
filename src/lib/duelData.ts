export type DuelTopic = 'er' | 'sql';
export type DuelDifficulty = 'medium' | 'hard' | 'fiendish';

export interface DuelQuestion {
  id: string;
  topic: DuelTopic;
  category: string;
  difficulty: DuelDifficulty;
  question: string;
  choices: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
  points: 10 | 15 | 20;
}

export interface DuelChallenge {
  questionId: string;
  question: DuelQuestion;
  postedAt: Date;
  postedByUid: string;
  isActive: boolean;
  date: string; // YYYY-MM-DD
}

export interface DuelResponse {
  id?: string;
  challengeDate: string;
  studentUid: string;
  studentName: string;
  studentSection: string;
  studentCampus: string;
  selectedChoice: 0 | 1 | 2 | 3;
  isCorrect: boolean;
  pointsEarned: number;
  responseTimeMs: number;
  submittedAt: Date;
}

export interface DuelStats {
  totalPoints: number;
  correctAnswers: number;
  totalAttempts: number;
  streak: number;
  bestStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
}

export const DUEL_QUESTIONS: DuelQuestion[] = [
  // ─── ER Diagram Questions ───────────────────────────────────────────────────
  {
    id: 'er_001',
    topic: 'er',
    category: 'Weak Entities',
    difficulty: 'medium',
    question:
      "APPOINTMENT has attributes (AppointmentID, Date, Time, Notes) and only exists within a PATIENT record. AppointmentID values restart per patient — Patient 1 has AppointmentID 1, 2, 3; Patient 2 also has AppointmentID 1, 2, 3. What type of entity is APPOINTMENT?",
    choices: [
      "A weak entity — identified by AppointmentID combined with PATIENT's primary key",
      "A strong entity with a composite primary key (PatientID, AppointmentID)",
      "A composite entity resolving an M:N relationship",
      "A derived entity computed from PATIENT records",
    ],
    correct: 0,
    explanation:
      "APPOINTMENT cannot be uniquely identified without its parent PATIENT. Its AppointmentID is a partial key that only becomes a full identifier when combined with PATIENT's primary key. This is the textbook definition of a weak entity — shown with a double rectangle in ER diagrams.",
    points: 10,
  },
  {
    id: 'er_002',
    topic: 'er',
    category: 'Participation Constraints',
    difficulty: 'hard',
    question:
      "EMPLOYEE has double-line (=====) participation in the ASSIGNED_TO relationship with PROJECT. What constraint does this impose in the relational schema?",
    choices: [
      "The FK referencing PROJECT in EMPLOYEE must be NOT NULL — every employee must be assigned to a project",
      "Each employee can be assigned to at most two projects",
      "Exactly two employees must be assigned per project",
      "The FK referencing PROJECT in EMPLOYEE can be NULL",
    ],
    correct: 0,
    explanation:
      "Double lines in ER diagrams mean 'total participation' — every entity instance MUST participate in the relationship. In the relational model, this translates directly to a NOT NULL constraint on the foreign key. Single line = partial participation = FK can be NULL.",
    points: 15,
  },
  {
    id: 'er_003',
    topic: 'er',
    category: 'M:N Relationships',
    difficulty: 'medium',
    question:
      "STUDENT and COURSE have an M:N relationship called ENROLLS_IN. When converting to a relational schema, what does the ENROLLS_IN relationship become?",
    choices: [
      "A FK column DeptID in STUDENT pointing to COURSE",
      "A FK column CourseID in COURSE pointing to STUDENT",
      "A new junction table ENROLLS_IN(Student_ID, Course_ID)",
      "Two separate FK columns, one in each table pointing to the other",
    ],
    correct: 2,
    explanation:
      "M:N relationships always need a separate junction/bridge table. Putting a single FK in either table alone would require repeating groups or multi-valued columns, violating 1NF. The junction table ENROLLS_IN holds FKs from both sides, with composite PK (Student_ID, Course_ID).",
    points: 10,
  },
  {
    id: 'er_004',
    topic: 'er',
    category: 'ISA Hierarchies',
    difficulty: 'fiendish',
    question:
      "VEHICLE is a supertype with subtypes CAR and TRUCK, marked as 'disjoint, total.' Vehicle ID=42 exists in the database. Which statement is TRUE?",
    choices: [
      "ID=42 must belong to exactly one of CAR or TRUCK — not both, not neither",
      "ID=42 can belong to both CAR and TRUCK simultaneously",
      "ID=42 exists only in VEHICLE and need not appear in any subtype",
      "The schema is invalid — disjoint subtypes cannot have total participation",
    ],
    correct: 0,
    explanation:
      "'Disjoint' means an entity belongs to AT MOST one subtype. 'Total' means every supertype entity must belong to AT LEAST one subtype. Together: each vehicle is in EXACTLY one subtype. Never both (disjoint), never neither (total). If it were 'overlapping, total,' ID=42 could be in multiple subtypes.",
    points: 20,
  },
  {
    id: 'er_005',
    topic: 'er',
    category: 'Attribute Types',
    difficulty: 'medium',
    question:
      "EMPLOYEE has these attributes: EmployeeID, DateOfBirth, Age (dashed oval), FullName (composite of FirstName + LastName), and {Phone} (multivalued). Which attribute is NOT stored as a column in the EMPLOYEE table?",
    choices: [
      "EmployeeID",
      "DateOfBirth",
      "Age",
      "The components of FullName (FirstName, LastName)",
    ],
    correct: 2,
    explanation:
      "A dashed oval in ER diagrams marks a derived attribute — it is computed from other stored data (Age from DateOfBirth) and is not physically stored in the table. DateOfBirth IS stored. FullName's components are stored as separate columns. {Phone} is stored in a separate table.",
    points: 10,
  },
  {
    id: 'er_006',
    topic: 'er',
    category: 'Recursive Relationships',
    difficulty: 'hard',
    question:
      "EMPLOYEE has a recursive SUPERVISES relationship: each supervisor manages many employees, and each employee has at most one supervisor. How is this represented in the relational schema?",
    choices: [
      "Create a separate SUPERVISES(Supervisor_ID, Employee_ID) junction table",
      "Add a Supervisor_ID FK column in EMPLOYEE that references EMPLOYEE.EmployeeID",
      "Create two separate EMPLOYEE tables — one for staff and one for managers",
      "Add a MANAGER subtype entity connected to EMPLOYEE",
    ],
    correct: 1,
    explanation:
      "A recursive (self-referential) 1:N relationship is modeled by adding a self-referencing FK in the same table. Supervisor_ID in EMPLOYEE points back to EmployeeID in the same EMPLOYEE table. A junction table is only needed for M:N recursive relationships. This is clean and avoids redundancy.",
    points: 15,
  },
  {
    id: 'er_007',
    topic: 'er',
    category: 'Multivalued Attributes',
    difficulty: 'medium',
    question:
      "STUDENT has multivalued attribute {Languages_Spoken}. If stored as a single column 'English,French,Maori' in STUDENT, which normal form is violated?",
    choices: [
      "0NF — but it is acceptable in practice",
      "First Normal Form (1NF) — atomic values are violated",
      "Second Normal Form (2NF) — a partial dependency exists",
      "Third Normal Form (3NF) — a transitive dependency exists",
    ],
    correct: 1,
    explanation:
      "1NF requires every column to contain atomic (indivisible) values. A comma-separated list in one column is not atomic — you can't query individual languages efficiently. The correct mapping is a separate STUDENT_LANGUAGES(Student_ID, Language) table where each language is its own row.",
    points: 10,
  },
  {
    id: 'er_008',
    topic: 'er',
    category: 'Bridge Tables',
    difficulty: 'hard',
    question:
      "A STUDENT_COURSE bridge table has columns: Student_ID (FK), Course_ID (FK), Enrollment_Date, Grade. What should be its primary key?",
    choices: [
      "A new auto-generated Enrollment_ID surrogate key",
      "Composite key (Student_ID, Course_ID)",
      "Student_ID alone",
      "Composite key (Student_ID, Course_ID, Enrollment_Date) — to allow re-enrollment",
    ],
    correct: 1,
    explanation:
      "The composite (Student_ID, Course_ID) naturally enforces that a student can enroll only once per course. An auto-generated ID would allow duplicate enrollments unless extra UNIQUE constraints were added. Using the natural composite key is cleaner and more semantically correct for a bridge table.",
    points: 15,
  },
  {
    id: 'er_009',
    topic: 'er',
    category: 'Participation Constraints',
    difficulty: 'fiendish',
    question:
      "DEPARTMENT has total participation in the HAS_MANAGER relationship with EMPLOYEE (each department has exactly one manager). Which column and constraint correctly model this in the relational schema?",
    choices: [
      "Add an EmployeeID FK to EMPLOYEE pointing to DEPARTMENT, with NOT NULL",
      "Add a Manager_ID FK to DEPARTMENT pointing to EMPLOYEE, with NOT NULL",
      "Add a DeptID FK to EMPLOYEE that cannot be NULL",
      "Add a Manager_ID FK to DEPARTMENT pointing to EMPLOYEE, that can be NULL",
    ],
    correct: 1,
    explanation:
      "Total participation is on DEPARTMENT's side — so DEPARTMENT holds the FK (Manager_ID → EMPLOYEE.EmployeeID). 'Total' means NOT NULL: every department must have a manager. Option D is partial participation (NULL allowed). Option C puts the FK on the wrong side and models the wrong thing entirely.",
    points: 20,
  },
  {
    id: 'er_010',
    topic: 'er',
    category: 'Ternary Relationships',
    difficulty: 'fiendish',
    question:
      "Ternary relationship SUPPLIES connects SUPPLIER, PART, and PROJECT. Each (Supplier, Part) combination maps to exactly one Project, but a Project can receive the same Part from multiple Suppliers. What is the minimal primary key of the SUPPLIES table?",
    choices: [
      "(Supplier_ID, Part_ID) — this functionally determines Project_ID",
      "(Supplier_ID, Project_ID)",
      "(Part_ID, Project_ID)",
      "(Supplier_ID, Part_ID, Project_ID) — all three are always required in ternary tables",
    ],
    correct: 0,
    explanation:
      "Because (Supplier, Part) → Project (a functional dependency), (Supplier_ID, Part_ID) is sufficient as a primary key — it uniquely identifies each row. The full three-attribute combination is a superkey but not the MINIMAL key. Most students default to all three; the tricky part is recognising the functional dependency that allows a smaller key.",
    points: 20,
  },
  {
    id: 'er_011',
    topic: 'er',
    category: 'Weak Entities',
    difficulty: 'hard',
    question:
      "What specifically distinguishes an identifying relationship from an ordinary relationship in an ER diagram?",
    choices: [
      "An identifying relationship always has M:N cardinality",
      "An identifying relationship connects a weak entity to its owner entity and is drawn with a double diamond",
      "An identifying relationship involves at least three entity types",
      "An identifying relationship always has total participation on both sides",
    ],
    correct: 1,
    explanation:
      "An identifying relationship specifically links a weak entity to its owner (identifying entity) — drawn with a double-lined diamond (◇◇) in ER diagrams. Without this relationship, the weak entity cannot be identified or exist. A regular relationship is drawn with a single diamond (◇).",
    points: 15,
  },
  {
    id: 'er_012',
    topic: 'er',
    category: "Crow's Foot Notation",
    difficulty: 'medium',
    question:
      "In crow's foot (IE) notation, what does the combination of a circle (O) and a single bar (|) on a relationship line represent?",
    choices: [
      "One and only one — mandatory exactly one",
      "Zero or one — optional, but at most one",
      "One or many",
      "Zero or many",
    ],
    correct: 1,
    explanation:
      "In crow's foot notation: circle = zero (optional), single bar = one (maximum one), double bar = exactly one (mandatory). The 'O|' combination means 'zero or one' — the entity may or may not participate, and if it does, it participates exactly once. Contrast '||' = exactly one (mandatory one).",
    points: 10,
  },
  {
    id: 'er_013',
    topic: 'er',
    category: 'NULL and Participation',
    difficulty: 'hard',
    question:
      "EMPLOYEE has a DeptID FK referencing DEPARTMENT.DeptID. Three out of twenty employee rows have DeptID = NULL. What does this reveal about the ER model design?",
    choices: [
      "There are three weak entities in EMPLOYEE",
      "EMPLOYEE has partial participation in the WORKS_IN relationship",
      "EMPLOYEE has total participation in the WORKS_IN relationship",
      "The schema has a referential integrity violation",
    ],
    correct: 1,
    explanation:
      "NULL in a FK means those employees don't participate in the relationship. In ER terms, this is partial participation — shown as a single line between EMPLOYEE and WORKS_IN. Total participation (double line) would require NOT NULL on DeptID. No integrity violation exists — NULL is a valid FK value when partial participation is modeled.",
    points: 15,
  },
  {
    id: 'er_014',
    topic: 'er',
    category: 'Composite Attributes',
    difficulty: 'medium',
    question:
      "CUSTOMER entity has a composite attribute Address, composed of (Street, City, State, PostCode). How is Address represented in the relational schema?",
    choices: [
      "One TEXT column 'Address' storing the full formatted address",
      "Separate columns Street, City, State, PostCode directly in CUSTOMER",
      "A separate ADDRESS table linked back to CUSTOMER with a FK",
      "A structured JSON column 'Address' in CUSTOMER",
    ],
    correct: 1,
    explanation:
      "Composite attributes are flattened into their atomic component attributes in the relational model. Each component (Street, City, State, PostCode) becomes a separate column in CUSTOMER. A separate linked table would be used for multivalued attributes, not composite ones. This allows indexing and querying individual components.",
    points: 10,
  },
  {
    id: 'er_015',
    topic: 'er',
    category: 'ISA Hierarchies',
    difficulty: 'fiendish',
    question:
      "EMPLOYEE has subtypes ENGINEER and MANAGER defined as 'overlapping, partial.' Employee E1 exists. Which scenario does the 'overlapping' constraint permit?",
    choices: [
      "E1 can be both an ENGINEER and a MANAGER simultaneously",
      "E1 must be either an ENGINEER or a MANAGER, never both",
      "E1 must appear in at least one subtype table",
      "E1 cannot exist as purely an EMPLOYEE without a subtype",
    ],
    correct: 0,
    explanation:
      "'Overlapping' means an entity CAN belong to multiple subtypes at the same time — E1 could be both an Engineer and a Manager. 'Partial' means entities DON'T have to belong to any subtype — E1 can be purely an EMPLOYEE. Contrast with 'disjoint, total': exactly one subtype, mandatory. This is one of the most commonly confused ISA constraint combinations.",
    points: 20,
  },
  {
    id: 'er_016',
    topic: 'er',
    category: '1:1 Relationships',
    difficulty: 'medium',
    question:
      "EMPLOYEE and LOCKER have a 1:1 optional relationship — each employee may have at most one locker, each locker is assigned to at most one employee. Both sides have partial participation. When converting to relational schema, where should the FK go?",
    choices: [
      "Add Locker_ID FK to EMPLOYEE (nullable) — OR Employee_ID FK to LOCKER (nullable). Either table can hold it.",
      "A new junction table EMPLOYEE_LOCKER(Employee_ID, Locker_ID) is required",
      "Add FKs in both tables simultaneously — Locker_ID in EMPLOYEE and Employee_ID in LOCKER",
      "FK columns are not used for 1:1 — use a UNIQUE constraint on the PK instead",
    ],
    correct: 0,
    explanation:
      "For 1:1 optional relationships, either side can hold the FK — it's a design choice. The FK must be nullable (partial participation = not mandatory). A junction table is needed only for M:N. Placing FKs in both tables creates circular references. Convention: put the FK in the more 'dependent' table or the one with fewer NULLs.",
    points: 10,
  },
  {
    id: 'er_017',
    topic: 'er',
    category: 'Relationship Attributes',
    difficulty: 'medium',
    question:
      "STUDENT and CLUB have an M:N relationship JOINS. A student can join multiple clubs; a club can have many students. The date a specific student joined a specific club must be stored. Where does Join_Date belong?",
    choices: [
      "In STUDENT — since joining is a student action",
      "In CLUB — since it describes club membership",
      "In the junction table JOINS(Student_ID, Club_ID, Join_Date)",
      "In a separate JOIN_HISTORY(JoinHistoryID, Student_ID, Club_ID, Join_Date) table",
    ],
    correct: 2,
    explanation:
      "Join_Date describes the specific (Student, Club) combination — it's a fact about the relationship itself, not the student alone or the club alone. Relationship attributes in M:N go into the junction table alongside the two FKs. A separate history table adds complexity only if you need to track multiple join events per student per club.",
    points: 10,
  },
  {
    id: 'er_018',
    topic: 'er',
    category: 'ISA Hierarchies',
    difficulty: 'medium',
    question:
      "ANIMAL is a supertype with subtypes DOG and CAT, marked 'disjoint, partial.' An Animal record with ID=99 exists. Which is a valid state for this data?",
    choices: [
      "ID=99 appears in both DOG and CAT tables simultaneously",
      "ID=99 appears only in ANIMAL — with no matching DOG or CAT row",
      "ID=99 must appear in exactly one of DOG or CAT",
      "The schema is invalid — partial specialization cannot coexist with disjoint",
    ],
    correct: 1,
    explanation:
      "'Partial' specialization means not every ANIMAL must be in a subtype — an animal can exist solely in ANIMAL. 'Disjoint' means it CANNOT be in both DOG and CAT simultaneously. So ID=99 being only in ANIMAL is perfectly valid. 'Total' would force every ANIMAL into at least one subtype. 'Partial' = coverage is optional; 'disjoint' = subtypes can't overlap.",
    points: 10,
  },
  {
    id: 'er_019',
    topic: 'er',
    category: 'Aggregation',
    difficulty: 'hard',
    question:
      "ENGINEER works on PROJECT — an M:N relationship. A COMPANY monitors specific engineer-project pairings. The MONITORS relationship has its own attribute: Start_Date. The most accurate ER construct for this scenario is:",
    choices: [
      "Ternary relationship MONITORS connecting ENGINEER, PROJECT, and COMPANY directly",
      "Aggregation — treat ENGINEER+WORKS_ON+PROJECT as a higher-level entity; connect COMPANY to that aggregate via MONITORS",
      "Add a CompanyID attribute to the WORKS_ON junction table",
      "Convert WORKS_ON into a strong entity and add a separate MONITORS table linking to COMPANY",
    ],
    correct: 1,
    explanation:
      "Aggregation is used when a relationship itself needs to participate in another relationship. Treating ENGINEER+WORKS_ON+PROJECT as an abstract unit lets COMPANY monitor that specific pairing via MONITORS with its Start_Date. A ternary (option A) mixes entity-level and relationship-level semantics. Option D (making WORKS_ON a strong entity) is functionally equivalent to aggregation and also works — but 'aggregation' is the formal ER term.",
    points: 15,
  },
  {
    id: 'er_020',
    topic: 'er',
    category: 'Cardinality Constraints',
    difficulty: 'medium',
    question:
      "A LIBRARY has BOOKS. Each BOOK belongs to exactly one LIBRARY. Each LIBRARY can have zero or many BOOKs. BOOK has total participation in the relationship. Which option correctly describes cardinality and participation?",
    choices: [
      "BOOK:LIBRARY is M:N — a book can travel between libraries",
      "BOOK:LIBRARY is 1:N — one library to many books; BOOK has total participation (must belong to a library)",
      "BOOK:LIBRARY is 1:1 — each library has exactly one book",
      "BOOK:LIBRARY is N:1 — many libraries share one book",
    ],
    correct: 1,
    explanation:
      "'Each BOOK belongs to exactly one LIBRARY' and 'each LIBRARY can have zero or many BOOKs' = 1:N (1 library : N books). Total participation on BOOK means every book must be associated with a library — FK in BOOK is NOT NULL. This is the textbook library/book 1:N pattern. Think: LIBRARY has many BOOKs; each BOOK belongs to one LIBRARY.",
    points: 10,
  },
  {
    id: 'er_021',
    topic: 'er',
    category: 'Participation Constraints',
    difficulty: 'hard',
    question:
      "DEPARTMENT(1) ——<< EMPLOYEE(N). EMPLOYEE has total participation in the relationship. How is this mapped to a relational schema?",
    choices: [
      "Add DeptID FK to DEPARTMENT pointing to EMPLOYEE",
      "Add DeptID FK to EMPLOYEE pointing to DEPARTMENT, with NOT NULL constraint",
      "Add DeptID FK to EMPLOYEE pointing to DEPARTMENT, allowing NULL",
      "Create a separate table DEPT_EMP(DeptID, EmpID) to represent the relationship",
    ],
    correct: 1,
    explanation:
      "In a 1:N relationship the FK goes on the 'many' side (EMPLOYEE). Total participation on EMPLOYEE = NOT NULL — every employee must be in a department. NULL would imply partial participation. A separate table is only needed for M:N. Option A puts the FK on the wrong side — DEPARTMENT can't reference a single EMPLOYEE since many employees share one department.",
    points: 15,
  },
  {
    id: 'er_022',
    topic: 'er',
    category: 'Weak Entities',
    difficulty: 'hard',
    question:
      "ORDER_LINE is a weak entity with partial key LineNumber. Its owner is ORDER with PK OrderID. Orders 101, 102, 103 each have lines 1, 2, 3. What is the primary key of the ORDER_LINE relational table?",
    choices: [
      "LineNumber alone — unique enough within the table",
      "(OrderID, LineNumber) — composite key combining owner's PK with the partial key",
      "A new auto-generated OrderLineID surrogate key",
      "OrderID alone — inherited from the parent ORDER",
    ],
    correct: 1,
    explanation:
      "A partial key (LineNumber) only identifies an order line WITHIN its parent order. Across all orders, LineNumber 1 appears in every order — it's not globally unique. The correct composite PK is (OrderID, LineNumber), where OrderID is also an FK referencing ORDER. This is the standard weak entity mapping: partial key + owner's PK = full primary key.",
    points: 15,
  },
  {
    id: 'er_023',
    topic: 'er',
    category: 'Generalization and Specialization',
    difficulty: 'medium',
    question:
      "A designer first models CAR and TRUCK as separate entities, then notices they share EngineSize, MaxSpeed, and RegistrationID. They create a new supertype VEHICLE and move the shared attributes up. This design process is called:",
    choices: [
      "Specialization — breaking a general entity into more specific subtypes",
      "Aggregation — grouping related entities into a higher-level construct",
      "Generalization — abstracting common properties from multiple entities into a supertype",
      "Normalization — removing redundancy by extracting repeated attributes",
    ],
    correct: 2,
    explanation:
      "Generalization is BOTTOM-UP: start with specific entities (CAR, TRUCK), identify common attributes, create a general supertype (VEHICLE). Specialization is TOP-DOWN: start with a general entity and break it into subtypes. Aggregation groups a relationship and its entities into a higher-level entity. Normalization is a relational schema process, not an ER design concept.",
    points: 10,
  },
  {
    id: 'er_024',
    topic: 'er',
    category: 'ISA Hierarchies',
    difficulty: 'fiendish',
    question:
      "EMPLOYEE supertype has subtypes ENGINEER and MANAGER (disjoint, total). Three strategies exist for mapping ISA to relational tables. Which strategy stores ALL data in ONE table with a Type discriminator column?",
    choices: [
      "Strategy 1 — Multiple tables: EMPLOYEE, ENGINEER, MANAGER each get their own table; subtypes join to the supertype",
      "Strategy 2 — Single table: one EMPLOYEE table with ALL attributes from all subtypes; subtype-only columns are NULL when not applicable",
      "Strategy 3 — Subtype tables only: separate ENGINEER and MANAGER tables each contain ALL attributes including inherited ones from EMPLOYEE",
      "Strategy 4 — View-based: virtual views simulating each subtype on top of a normalised base table",
    ],
    correct: 1,
    explanation:
      "Strategy 2 (table-per-hierarchy) collapses everything into one EMPLOYEE table with a Type column ('ENGINEER'/'MANAGER') and NULLs for inapplicable columns. Simple to query but wastes space and loses NOT NULL constraints on subtype-specific columns. Strategy 1 (table-per-type) requires joins. Strategy 3 (table-per-subtype) duplicates supertype attributes and has no central EMPLOYEE table. Knowing all three strategies is a common exam question.",
    points: 20,
  },
  {
    id: 'er_025',
    topic: 'er',
    category: 'Weak Entities',
    difficulty: 'hard',
    question:
      "An ER diagram contains a double-line diamond (◇◇) connecting two entities. What specifically does the double-line diamond signify?",
    choices: [
      "The relationship has M:N cardinality",
      "It is an identifying relationship — connecting a weak entity to its owner; the weak entity's identity depends on this link",
      "Both entities have total participation in the relationship",
      "It is a derived relationship computed from other relationships in the diagram",
    ],
    correct: 1,
    explanation:
      "The double-line diamond (◇◇) is used exclusively for IDENTIFYING relationships — those linking a weak entity to its owner (identifying entity). Without this relationship, the weak entity cannot be uniquely identified or even exist. The double diamond pairs with the double rectangle (□□) for the weak entity itself. Single diamond (◇) is used for all ordinary (non-identifying) relationships.",
    points: 15,
  },

  // ─── SQL Questions ──────────────────────────────────────────────────────────
  {
    id: 'sql_001',
    topic: 'sql',
    category: 'NULL Handling',
    difficulty: 'medium',
    question:
      "Table EMPLOYEE has 10 rows, 4 of which have salary = NULL. How many rows does this query return?\n\n  SELECT * FROM EMPLOYEE WHERE salary = NULL;",
    choices: [
      "4 — the rows where salary is NULL",
      "0 — NULL = NULL evaluates to UNKNOWN, never TRUE in SQL",
      "6 — the rows where salary is not NULL",
      "Error — you cannot use = with NULL values",
    ],
    correct: 1,
    explanation:
      "In SQL, any comparison using = against NULL evaluates to UNKNOWN (not TRUE or FALSE). Since WHERE only passes rows where the condition is TRUE, no rows pass — result is 0. The correct syntax is WHERE salary IS NULL. This trips up even experienced developers.",
    points: 10,
  },
  {
    id: 'sql_002',
    topic: 'sql',
    category: 'Aggregate Functions',
    difficulty: 'hard',
    question:
      "ORDERS has 10 rows; 3 rows have discount = NULL. What do these two expressions return?\n\n  SELECT COUNT(*), COUNT(discount) FROM ORDERS;",
    choices: [
      "10, 10 — COUNT always includes NULL values",
      "10, 7 — COUNT(*) includes NULLs; COUNT(column) ignores them",
      "7, 7 — both forms ignore NULL values",
      "7, 10 — COUNT(*) ignores NULLs; COUNT(column) includes them",
    ],
    correct: 1,
    explanation:
      "COUNT(*) counts every row including NULLs. COUNT(column) counts only non-NULL values in that column. With 3 NULL discounts: COUNT(*) = 10, COUNT(discount) = 7. This distinction matters in financial reporting — accidentally using COUNT(*) instead of COUNT(discount) overstates the number of discounted orders.",
    points: 15,
  },
  {
    id: 'sql_003',
    topic: 'sql',
    category: 'HAVING vs WHERE',
    difficulty: 'medium',
    question:
      "Find departments where the average salary of employees earning over $50,000 exceeds $75,000. Which query is correct?",
    choices: [
      "SELECT dept FROM emp HAVING salary > 50000 AND AVG(salary) > 75000 GROUP BY dept",
      "SELECT dept FROM emp WHERE salary > 50000 GROUP BY dept HAVING AVG(salary) > 75000",
      "SELECT dept FROM emp WHERE salary > 50000 AND AVG(salary) > 75000 GROUP BY dept",
      "SELECT dept FROM emp GROUP BY dept WHERE AVG(salary) > 75000 AND salary > 50000",
    ],
    correct: 1,
    explanation:
      "SQL execution order: FROM → WHERE → GROUP BY → HAVING → SELECT. WHERE filters individual rows BEFORE grouping (remove employees ≤ $50k). HAVING filters groups AFTER aggregation (keep depts with avg > $75k). You CANNOT use aggregate functions in WHERE — they haven't been computed yet at that stage.",
    points: 10,
  },
  {
    id: 'sql_004',
    topic: 'sql',
    category: 'Subqueries',
    difficulty: 'hard',
    question:
      "EMPLOYEE(EmpID, Name, Salary, ManagerID). Find all employees earning more than their own manager. Which query is logically correct?",
    choices: [
      "SELECT e.Name FROM EMPLOYEE e, EMPLOYEE m WHERE e.ManagerID = m.EmpID AND e.Salary > m.Salary",
      "SELECT e.Name FROM EMPLOYEE e JOIN EMPLOYEE m ON e.EmpID = m.ManagerID WHERE e.Salary > m.Salary",
      "SELECT e.Name FROM EMPLOYEE e WHERE e.Salary > e.ManagerID",
      "SELECT e.Name FROM EMPLOYEE e WHERE e.Salary > ALL (SELECT Salary FROM EMPLOYEE)",
    ],
    correct: 0,
    explanation:
      "Option A is the correct self-join: alias 'e' as employee, alias 'm' as manager, join where e's ManagerID matches m's EmpID, then compare salaries. Option B joins incorrectly (e.EmpID = m.ManagerID finds subordinates, not managers). Option C compares salary to ManagerID (a key value — logically nonsensical). Option D finds employees earning more than EVERYONE.",
    points: 15,
  },
  {
    id: 'sql_005',
    topic: 'sql',
    category: 'JOINs',
    difficulty: 'medium',
    question:
      "  SELECT s.Name, e.CourseName\n  FROM STUDENT s LEFT JOIN ENROLLMENT e\n    ON s.StudentID = e.StudentID;\n\nWhat appears in the result for students who have NEVER enrolled in any course?",
    choices: [
      "Those students are excluded from the result entirely",
      "Those students appear with NULL in the CourseName column",
      "Those students appear with an empty string '' in CourseName",
      "An error is raised for rows with no matching enrollment",
    ],
    correct: 1,
    explanation:
      "LEFT JOIN keeps ALL rows from the left table (STUDENT) regardless of whether they match. For students with no enrollment, all ENROLLMENT columns appear as NULL. This is precisely how you find 'students who haven't enrolled yet' — add WHERE e.StudentID IS NULL to filter only the unmatched students.",
    points: 10,
  },
  {
    id: 'sql_006',
    topic: 'sql',
    category: 'Aggregate Functions',
    difficulty: 'fiendish',
    question:
      "What is WRONG with this SQL query?\n\n  SELECT dept, MAX(salary)\n  FROM emp\n  WHERE MAX(salary) > 80000\n  GROUP BY dept;",
    choices: [
      "MAX() cannot be combined with GROUP BY in the same query",
      "Aggregate functions like MAX() cannot appear in WHERE — use HAVING instead",
      "WHERE must come after GROUP BY in the syntax",
      "You cannot filter aggregated results at all in SQL",
    ],
    correct: 1,
    explanation:
      "WHERE is evaluated BEFORE GROUP BY — aggregation hasn't happened yet, so MAX() has no meaning there. Move the condition to HAVING, which is evaluated AFTER grouping: GROUP BY dept HAVING MAX(salary) > 80000. This is one of the most common SQL mistakes and a favourite exam trap.",
    points: 20,
  },
  {
    id: 'sql_007',
    topic: 'sql',
    category: 'NULL Traps',
    difficulty: 'fiendish',
    question:
      "ORDERED.ProductID has some NULL values. How many rows does this return?\n\n  SELECT * FROM PRODUCT\n  WHERE ProductID NOT IN\n    (SELECT ProductID FROM ORDERED);",
    choices: [
      "All products that have never been ordered",
      "All products in PRODUCT",
      "Zero rows — the subquery's NULLs poison the NOT IN result",
      "Only products whose ProductID is NULL",
    ],
    correct: 2,
    explanation:
      "SQL's most infamous NULL trap. NOT IN with NULLs in the subquery returns UNKNOWN for every comparison: x NOT IN (1, 2, NULL) = (x<>1 AND x<>2 AND x<>NULL). Since x<>NULL = UNKNOWN, the entire expression is UNKNOWN — no rows pass. Fix: use NOT EXISTS(...) or exclude NULLs with WHERE ProductID IS NOT NULL in the subquery.",
    points: 20,
  },
  {
    id: 'sql_008',
    topic: 'sql',
    category: 'ORDER BY',
    difficulty: 'hard',
    question:
      "In standard SQL, when you ORDER BY salary ASC, where do NULL salary values appear in the result?",
    choices: [
      "Always first — NULLs are treated as the smallest possible value",
      "Always last — NULLs are treated as the largest possible value",
      "NULLs cause a runtime error in ORDER BY",
      "NULL placement is implementation-defined — it varies between database systems",
    ],
    correct: 3,
    explanation:
      "The SQL standard explicitly leaves NULL ordering as implementation-defined. PostgreSQL puts NULLs LAST in ASC by default (treats NULL as largest). MySQL also sorts NULLs first in ASC. To guarantee consistent behavior, use NULLS FIRST or NULLS LAST explicitly (PostgreSQL/Oracle support this). Never assume NULL order.",
    points: 15,
  },
  {
    id: 'sql_009',
    topic: 'sql',
    category: 'Range Queries',
    difficulty: 'medium',
    question:
      "EMPLOYEE salaries: 50000, 55000, 60000, 65000, 70000.\n\n  SELECT * FROM EMPLOYEE WHERE salary BETWEEN 55000 AND 65000;\n\nHow many rows are returned?",
    choices: [
      "1 — only 60000 (BETWEEN is exclusive on both ends)",
      "2 — 55000 and 65000 are excluded (exclusive lower and upper bounds)",
      "3 — BETWEEN is inclusive on both ends: 55000, 60000, 65000",
      "5 — BETWEEN selects all rows near the boundary values",
    ],
    correct: 2,
    explanation:
      "SQL's BETWEEN is fully INCLUSIVE: `BETWEEN a AND b` is exactly `>= a AND <= b`. So 55000 and 65000 are both included, giving 3 rows. Many developers assume BETWEEN is exclusive (like Python's range()) — always remember: in SQL, BETWEEN includes the boundary values.",
    points: 10,
  },
  {
    id: 'sql_010',
    topic: 'sql',
    category: 'Subqueries',
    difficulty: 'hard',
    question:
      "The Sales department has 5 employees with different salaries. What happens at runtime?\n\n  SELECT name FROM emp\n  WHERE salary = (SELECT salary FROM emp WHERE dept = 'Sales');",
    choices: [
      "Returns all employees whose salary matches any Sales salary",
      "A runtime error — single-row subquery returned more than one row",
      "Returns the employee matching the highest Sales salary",
      "Returns no rows — the subquery can't be evaluated",
    ],
    correct: 1,
    explanation:
      "Using = with a subquery assumes the subquery returns exactly ONE value. With 5 different Sales salaries, it returns 5 rows — causing a runtime error in standard SQL: 'subquery returned more than one row.' Fix: use IN for multi-row membership: WHERE salary IN (SELECT salary FROM emp WHERE dept = 'Sales').",
    points: 15,
  },
  {
    id: 'sql_011',
    topic: 'sql',
    category: 'Set Operations',
    difficulty: 'medium',
    question:
      "Both Table A and Table B contain the row (ID=1, Name='Alice'). What is the difference?\n\n  Query 1: SELECT * FROM A UNION SELECT * FROM B\n  Query 2: SELECT * FROM A UNION ALL SELECT * FROM B",
    choices: [
      "Query 1 returns 2 rows (Alice twice); Query 2 returns 1 row (deduplicated)",
      "Query 1 returns 1 row (deduplicated); Query 2 returns 2 rows (Alice twice)",
      "Both return 1 row — SQL always deduplicates combined results",
      "Both return 2 rows — duplicates are preserved in set operations",
    ],
    correct: 1,
    explanation:
      "UNION removes duplicate rows (implicit DISTINCT), so Alice appears once. UNION ALL preserves ALL rows including duplicates, so Alice appears twice. UNION ALL is faster (no deduplication step) — use UNION only when you actually need to eliminate duplicates, not just out of habit.",
    points: 10,
  },
  {
    id: 'sql_012',
    topic: 'sql',
    category: 'GROUP BY Rules',
    difficulty: 'fiendish',
    question:
      "What is wrong with this query in standard SQL?\n\n  SELECT department, name, MAX(salary)\n  FROM emp\n  GROUP BY department;",
    choices: [
      "MAX() cannot be used together with GROUP BY in SELECT",
      "'name' is not in GROUP BY and not aggregated — this violates standard SQL rules",
      "You must also add 'name' to GROUP BY to make the query work correctly",
      "Nothing — it correctly returns the name of the highest-paid employee per department",
    ],
    correct: 1,
    explanation:
      "Standard SQL requires every non-aggregated column in SELECT to appear in GROUP BY. 'name' is neither aggregated nor in GROUP BY — so this is invalid. MySQL without ONLY_FULL_GROUP_BY might silently return a random name per department (not the highest-paid employee's name). Fix: remove 'name' from SELECT, or use a subquery/window function to find the corresponding name.",
    points: 20,
  },
  {
    id: 'sql_013',
    topic: 'sql',
    category: 'UPDATE Statements',
    difficulty: 'hard',
    question:
      "EMPLOYEE(EmpID, Name, Salary, DeptName). Which UPDATE correctly gives all IT department employees a 10% salary raise?",
    choices: [
      "UPDATE EMPLOYEE SET Salary = Salary * 1.10 WHERE DeptName = 'IT'",
      "UPDATE EMPLOYEE SET Salary = Salary + 10 WHERE DeptName = 'IT'",
      "UPDATE EMPLOYEE SET Salary * 1.10 WHERE DeptName = 'IT'",
      "UPDATE EMPLOYEE(Salary) VALUES (Salary * 1.10) WHERE DeptName = 'IT'",
    ],
    correct: 0,
    explanation:
      "Option A is correct: SET Salary = Salary * 1.10 multiplies the current salary by 1.10, giving a genuine 10% raise. Option B adds a flat $10 regardless of current salary — that's not a percentage. Options C and D have invalid UPDATE syntax. The key insight: the right-hand side of SET can reference the column's current value.",
    points: 15,
  },
  {
    id: 'sql_014',
    topic: 'sql',
    category: 'Referential Integrity',
    difficulty: 'medium',
    question:
      "DEPARTMENT(DeptID PK) and EMPLOYEE(EmpID PK, DeptID FK with ON DELETE CASCADE).\n\nWhat happens when:\n  DELETE FROM DEPARTMENT WHERE DeptID = 5;",
    choices: [
      "Error — cannot delete a department that still has employees",
      "Only the DEPARTMENT row is deleted; employees keep DeptID=5 as an orphan FK",
      "The DEPARTMENT row is deleted AND all employees with DeptID=5 are also deleted",
      "All employees with DeptID=5 have their DeptID automatically set to NULL",
    ],
    correct: 2,
    explanation:
      "ON DELETE CASCADE automatically propagates the deletion to all child rows. Deleting department 5 cascades to delete all employees in that department — maintaining referential integrity automatically. ON DELETE SET NULL would set DeptID to NULL. ON DELETE RESTRICT/NO ACTION would block the deletion. The default (no clause) is usually RESTRICT.",
    points: 10,
  },
  {
    id: 'sql_015',
    topic: 'sql',
    category: 'Aggregate Functions',
    difficulty: 'hard',
    question:
      "SALES table Region values: 'North', 'South', 'North', NULL, 'East'.\n\n  SELECT COUNT(DISTINCT Region) FROM SALES;\n\nWhat does this return?",
    choices: [
      "5 — counts all rows including NULL",
      "4 — counts all non-NULL rows",
      "3 — counts distinct non-NULL values: North, South, East",
      "2 — only counts values that appear exactly once (no repeats)",
    ],
    correct: 2,
    explanation:
      "COUNT(DISTINCT column) counts distinct non-NULL values. The NULL row is ignored by COUNT. DISTINCT reduces {North, South, North, East} to {North, South, East} = 3 unique values. Note: COUNT(DISTINCT *) is not valid SQL — only COUNT(DISTINCT column) works. Also, the duplicate 'North' is deduplicated by DISTINCT.",
    points: 15,
  },
  {
    id: 'sql_016',
    topic: 'sql',
    category: 'NULL Handling',
    difficulty: 'medium',
    question:
      "EMPLOYEE has columns Name and Bonus (DECIMAL, nullable). You want to display each employee's bonus but show 0 for any employee with no bonus recorded. Which query achieves this?",
    choices: [
      "SELECT Name, Bonus = 0 FROM EMPLOYEE",
      "SELECT Name, COALESCE(Bonus, 0) AS Bonus FROM EMPLOYEE",
      "SELECT Name, ISNULL(Bonus) AS Bonus FROM EMPLOYEE",
      "SELECT Name, Bonus FROM EMPLOYEE WHERE Bonus IS NOT NULL",
    ],
    correct: 1,
    explanation:
      "COALESCE(value, replacement) returns the first non-NULL argument. If Bonus is NULL, COALESCE(Bonus, 0) returns 0; otherwise the actual bonus value is returned. Option A sets Bonus = 0 for ALL rows unconditionally — not conditional. ISNULL() (option C) requires two arguments: ISNULL(Bonus, 0) — it's also SQL Server-specific, not standard SQL. Option D filters out NULL rows entirely instead of substituting 0.",
    points: 10,
  },
  {
    id: 'sql_017',
    topic: 'sql',
    category: 'Subqueries',
    difficulty: 'hard',
    question:
      "Find all customers who have placed at least one order. CUSTOMER(CustID, Name) and ORDER(OrderID, CustID — nullable). Which approach is both correct and safe when ORDER.CustID contains NULLs?",
    choices: [
      "SELECT Name FROM CUSTOMER WHERE CustID IN (SELECT CustID FROM ORDER)",
      "SELECT Name FROM CUSTOMER c WHERE EXISTS (SELECT 1 FROM ORDER o WHERE o.CustID = c.CustID)",
      "SELECT Name FROM CUSTOMER WHERE CustID = ANY (SELECT CustID FROM ORDER)",
      "SELECT DISTINCT Name FROM CUSTOMER JOIN ORDER ON CUSTOMER.CustID = ORDER.CustID",
    ],
    correct: 1,
    explanation:
      "EXISTS checks for row existence rather than value equality, so NULLs in the subquery cannot poison the result. IN (option A) and ANY (option C) are equivalent and both fail when the subquery contains NULLs — the NULL comparison causes UNKNOWN, not FALSE, making no rows match. JOIN (option D) can return duplicate customer names if a customer has multiple orders — DISTINCT helps but EXISTS is cleaner and NULL-safe.",
    points: 15,
  },
  {
    id: 'sql_018',
    topic: 'sql',
    category: 'Conditional Logic',
    difficulty: 'medium',
    question:
      "EMPLOYEE has a Salary column. You want to label each employee: 'High' if salary > 80000, 'Mid' if salary >= 50000, otherwise 'Low'. Which SQL is correct?",
    choices: [
      "SELECT Name, IF(Salary > 80000, 'High', IF(Salary >= 50000, 'Mid', 'Low')) AS Grade FROM EMPLOYEE",
      "SELECT Name, CASE WHEN Salary > 80000 THEN 'High' WHEN Salary >= 50000 THEN 'Mid' ELSE 'Low' END AS Grade FROM EMPLOYEE",
      "SELECT Name, CASE Salary WHEN > 80000 THEN 'High' WHEN >= 50000 THEN 'Mid' ELSE 'Low' END AS Grade FROM EMPLOYEE",
      "SELECT Name, DECODE(Salary, 80000, 'High', 50000, 'Mid', 'Low') AS Grade FROM EMPLOYEE",
    ],
    correct: 1,
    explanation:
      "The searched CASE uses WHEN <condition> THEN <result>, evaluated top-to-bottom, returning the first matching branch. If Salary > 80000, 'High' is returned without checking the next condition. Option A — IF() is MySQL-specific, not standard SQL. Option C uses simple CASE syntax (CASE column WHEN value), which compares exact values — not valid for ranges with > or >=. DECODE() (option D) is Oracle-specific and also compares exact values.",
    points: 10,
  },
  {
    id: 'sql_019',
    topic: 'sql',
    category: 'Data Modification',
    difficulty: 'hard',
    question:
      "You need to remove ALL rows from EMPLOYEE, keep the table structure and constraints intact, and ensure the operation can be rolled back within an open transaction. Which command is correct?",
    choices: [
      "DROP TABLE EMPLOYEE — removes both all rows and the table definition",
      "TRUNCATE TABLE EMPLOYEE — removes all rows instantly but cannot be rolled back in most databases",
      "DELETE FROM EMPLOYEE — removes all rows, is fully logged DML, and is rollback-able",
      "DELETE * FROM EMPLOYEE — standard syntax for deleting all rows with full transaction support",
    ],
    correct: 2,
    explanation:
      "DELETE FROM EMPLOYEE (no WHERE clause) removes all rows, is DML (Data Manipulation Language), is fully transaction-logged, and can be rolled back. TRUNCATE is faster but is DDL in most databases — it typically cannot be rolled back and resets identity counters. DROP removes the entire table definition, not just rows. DELETE * FROM is invalid SQL syntax — the correct form is DELETE FROM table with no asterisk.",
    points: 15,
  },
  {
    id: 'sql_020',
    topic: 'sql',
    category: 'Window Functions',
    difficulty: 'hard',
    question:
      "EMPLOYEE(EmpID, DeptID, Salary). Find the highest-paid employee in each department. Which approach correctly returns exactly one employee per department (the top earner)?",
    choices: [
      "SELECT EmpID, DeptID, Salary FROM EMPLOYEE GROUP BY DeptID HAVING MAX(Salary)",
      "SELECT EmpID, DeptID, Salary FROM EMPLOYEE WHERE Salary IN (SELECT MAX(Salary) FROM EMPLOYEE GROUP BY DeptID)",
      "SELECT EmpID, DeptID, Salary FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY DeptID ORDER BY Salary DESC) AS rn FROM EMPLOYEE) t WHERE rn = 1",
      "SELECT EmpID, DeptID, MAX(Salary) FROM EMPLOYEE GROUP BY DeptID, EmpID",
    ],
    correct: 2,
    explanation:
      "ROW_NUMBER() OVER (PARTITION BY DeptID ORDER BY Salary DESC) assigns rank 1 to the highest earner per department. Filtering WHERE rn = 1 returns exactly one employee per department. Option A is syntactically invalid. Option B returns all employees matching the department max — returns multiple rows on salary ties. Option D groups by both DeptID and EmpID — each employee is their own group, so MAX just returns their own salary.",
    points: 15,
  },
  {
    id: 'sql_021',
    topic: 'sql',
    category: 'JOINs',
    difficulty: 'medium',
    question:
      "Table A has 4 rows. Table B has 6 rows. How many rows does this return?\n\n  SELECT * FROM A CROSS JOIN B;",
    choices: [
      "10 — CROSS JOIN adds the row counts of both tables",
      "24 — CROSS JOIN produces the Cartesian product (4 × 6)",
      "4 — CROSS JOIN returns only matching rows like INNER JOIN",
      "6 — CROSS JOIN returns all rows from B padded with NULLs from A",
    ],
    correct: 1,
    explanation:
      "CROSS JOIN produces the Cartesian product — every row in A is paired with every row in B. With 4 rows × 6 rows = 24 result rows. No join condition is needed. CROSS JOIN is useful for generating all combinations (e.g., sizes × colours for a product catalogue) but dangerous on large tables — 1,000 rows × 1,000 rows = 1,000,000 rows.",
    points: 10,
  },
  {
    id: 'sql_022',
    topic: 'sql',
    category: 'Subqueries',
    difficulty: 'hard',
    question:
      "What is WRONG with this query?\n\n  SELECT dept, avg_salary\n  FROM (SELECT dept, AVG(salary) AS avg_salary FROM emp GROUP BY dept)\n  WHERE avg_salary > 60000;",
    choices: [
      "AVG() cannot be used inside a subquery in the FROM clause",
      "The subquery in FROM is missing an alias — every derived table must have a name",
      "WHERE avg_salary > 60000 should be HAVING avg_salary > 60000",
      "The outer SELECT cannot reference columns from a subquery",
    ],
    correct: 1,
    explanation:
      "Every derived table (subquery in FROM) must be given an alias. Fix: FROM (...) AS dept_summary. Without the alias, SQL returns an error such as 'every derived table must have its own alias.' The outer WHERE clause is valid — avg_salary is a regular column at the outer query level. HAVING is only needed inside the GROUP BY query itself, not in the outer query filtering the derived table.",
    points: 15,
  },
  {
    id: 'sql_023',
    topic: 'sql',
    category: 'Subqueries',
    difficulty: 'fiendish',
    question:
      "EMPLOYEE(EmpID, Name, Salary, DeptID). Which query correctly finds employees earning MORE than the average salary of THEIR OWN department?",
    choices: [
      "SELECT Name FROM EMPLOYEE WHERE Salary > AVG(Salary)",
      "SELECT Name FROM EMPLOYEE WHERE Salary > (SELECT AVG(Salary) FROM EMPLOYEE)",
      "SELECT Name FROM EMPLOYEE e WHERE e.Salary > (SELECT AVG(Salary) FROM EMPLOYEE WHERE DeptID = e.DeptID)",
      "SELECT Name FROM EMPLOYEE e JOIN (SELECT DeptID, AVG(Salary) avg FROM EMPLOYEE) d ON e.DeptID = d.DeptID WHERE e.Salary > d.avg",
    ],
    correct: 2,
    explanation:
      "Option C is a correlated subquery — the inner query references e.DeptID from the outer query, computing each employee's own department average row by row. Option A is invalid (aggregate functions can't appear in WHERE). Option B compares against the company-wide average, not per-department. Option D's derived table is missing GROUP BY DeptID — without it, the subquery returns a single row (overall average) and the DeptID column is invalid.",
    points: 20,
  },
  {
    id: 'sql_024',
    topic: 'sql',
    category: 'Set Operations',
    difficulty: 'medium',
    question:
      "ENROLLED_SPRING and ENROLLED_FALL each contain StudentID values. Which query finds students enrolled in BOTH semesters?",
    choices: [
      "SELECT StudentID FROM ENROLLED_SPRING UNION SELECT StudentID FROM ENROLLED_FALL",
      "SELECT StudentID FROM ENROLLED_SPRING INTERSECT SELECT StudentID FROM ENROLLED_FALL",
      "SELECT StudentID FROM ENROLLED_SPRING EXCEPT SELECT StudentID FROM ENROLLED_FALL",
      "SELECT StudentID FROM ENROLLED_SPRING UNION ALL SELECT StudentID FROM ENROLLED_FALL",
    ],
    correct: 1,
    explanation:
      "INTERSECT returns only rows that appear in BOTH result sets — students enrolled in both semesters. UNION (option A) returns all students from either semester (deduplicated). EXCEPT / MINUS (option C) returns students in spring but NOT fall. UNION ALL (option D) returns all rows including duplicates — a student in both would appear twice. INTERSECT is the correct set operation for 'in common.'",
    points: 10,
  },
  {
    id: 'sql_025',
    topic: 'sql',
    category: 'Transactions',
    difficulty: 'hard',
    question:
      "A bank transfer debits Account A by $100 and credits Account B by $100 in a single transaction. The system crashes after the debit but before the credit. Which ACID property guarantees the entire transaction is undone, restoring both accounts?",
    choices: [
      "Consistency — the database always transitions from one valid state to another",
      "Isolation — concurrent transactions cannot see each other's uncommitted changes",
      "Atomicity — a transaction is an all-or-nothing unit; partial completion is impossible",
      "Durability — committed transactions survive system failures permanently",
    ],
    correct: 2,
    explanation:
      "Atomicity guarantees the transaction is treated as a single indivisible unit — either ALL operations commit or NONE do. After a crash, the incomplete transaction is rolled back, restoring both accounts. Consistency (A) means the database moves between valid states — but atomicity is what triggers the rollback. Isolation (B) is about concurrency. Durability (D) is the opposite scenario: ensuring committed data survives crashes.",
    points: 15,
  },
];

export const ER_QUESTIONS  = DUEL_QUESTIONS.filter(q => q.topic === 'er');
export const SQL_QUESTIONS = DUEL_QUESTIONS.filter(q => q.topic === 'sql');

export const DIFFICULTY_CONFIG = {
  medium:   { label: 'Medium',   color: '#f59e0b', bg: 'rgba(251,191,36,0.15)',   points: 10 },
  hard:     { label: 'Hard',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    points: 15 },
  fiendish: { label: 'Fiendish', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)',   points: 20 },
} as const;

export const TOPIC_CONFIG = {
  er:  { label: 'ER Diagram', color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)'  },
  sql: { label: 'SQL',        color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
} as const;
