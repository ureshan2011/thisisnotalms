---
number: 7
title: Database Normalization
subtitle: Functional dependencies, the normal forms 1NF–BCNF, and how to decompose a messy table into a clean design
objectives:
  - Explain the update, insertion and deletion anomalies caused by redundant data
  - Read and write functional dependencies, and identify determinants, dependents and candidate keys
  - Test whether a table satisfies 1NF, 2NF, 3NF and BCNF, and name the rule that is broken
  - Decompose an unnormalized table step by step, preserving lossless joins
  - Judge when a table is already normalized and needs no further splitting
---

## 7.1 Why normalize?

A database that stores the same fact in many places will eventually contradict itself. **Normalization** is the discipline of organising tables so that every fact is stored exactly once. To see why it matters, study this unnormalized table, which tries to record students, their departments and their courses all at once:

<table class="tbl-bad">
<thead><tr><th>StudentID</th><th>StudentName</th><th>Dept</th><th>DeptHead</th><th>Courses</th><th>Instructor</th></tr></thead>
<tbody>
<tr><td class="cell-pk">S1</td><td>Alice</td><td>CS</td><td>Dr. Smith</td><td class="cell-bad">DB, OS, Networks</td><td class="cell-bad">Prof. Lee, Prof. Ray, Prof. Kim</td></tr>
<tr><td class="cell-pk">S2</td><td>Bob</td><td>CS</td><td>Dr. Smith</td><td class="cell-bad">DB, AI</td><td class="cell-bad">Prof. Lee, Prof. Patel</td></tr>
<tr><td class="cell-pk">S3</td><td>Carol</td><td>Math</td><td>Dr. Jones</td><td class="cell-bad">Calculus</td><td class="cell-bad">Prof. Wang</td></tr>
<tr><td class="cell-pk">S3</td><td>Carol</td><td>Math</td><td>Dr. Jones</td><td class="cell-bad">Statistics</td><td class="cell-bad">Prof. Hill</td></tr>
</tbody>
</table>

Three distinct kinds of failure — the **anomalies** — follow directly from this design:

| Anomaly | What goes wrong | In this table |
|---|---|---|
| **Update anomaly** | Changing one fact requires editing many rows; miss one and the data contradicts itself | If Dr. Smith leaves, *every* CS row must be updated |
| **Insertion anomaly** | A fact cannot be recorded until some unrelated fact exists | We cannot record a new Physics department until a student enrols in it |
| **Deletion anomaly** | Removing one fact silently destroys another | If Carol drops Statistics, we lose the fact that Prof. Hill teaches it |

::: tip
When revising, remember the anomalies as **U-I-D**: **U**pdate (many rows to change), **I**nsertion (can't add a fact alone), **D**eletion (removing one fact erases another). Every normal form exists to eliminate one or more of these.
:::

## 7.2 Functional dependencies

Normal forms are defined in terms of **functional dependencies (FDs)**, so master this idea first.

::: definition
Attribute **Y** is *functionally dependent* on attribute (or set of attributes) **X** — written **X → Y** — if knowing the value of X uniquely determines the value of Y. We read it as "X determines Y" or "Y depends on X".
:::

![A functional dependency X → Y: the determinant on the left uniquely fixes the dependent on the right.](diagrams/fd-concept.svg)

The vocabulary around FDs appears in every exam question on this topic:

| Term | Meaning |
|---|---|
| **Determinant** | The left-hand side of an FD (the X in X → Y) |
| **Dependent** | The right-hand side of an FD (the Y in X → Y) |
| **Candidate key** | A *minimal* set of attributes that determines every attribute in the table |
| **Primary key** | The candidate key chosen to identify rows |
| **Prime attribute** | An attribute that is part of at least one candidate key |
| **Non-prime attribute** | An attribute that belongs to no candidate key |
| **Superkey** | Any set of attributes that determines every attribute (not necessarily minimal) |

::: example Worked Example — reading dependencies from meaning
Real-world rules become FDs. In a university database:

- `StudentID → StudentName` — one student ID maps to exactly one name.
- `Dept → DeptHead` — each department has exactly one head.
- `{OrderID, ProductID} → Quantity` — a *composite* determinant: you need both the order **and** the product to know the quantity.

Notice that FDs come from the *business rules*, not from the sample data you happen to have. Always ask "could two rows with the same X ever have different Y?"
:::

## 7.3 The normalization ladder

The normal forms are cumulative: each one keeps all the rules of the previous form and adds a stricter test.

![The normalization ladder — each form adds a stricter rule and includes all previous rules.](diagrams/nf-ladder.svg)

A useful one-line summary of 1NF→3NF, attributed to database folklore: every non-key attribute must depend on **"the key, the whole key, and nothing but the key."** "The key" is 1NF (a key exists and cells are atomic), "the whole key" is 2NF (no partial dependencies), "nothing but the key" is 3NF (no transitive dependencies).

## 7.4 First Normal Form (1NF)

::: definition
A table is in **1NF** if every cell contains a single, atomic (indivisible) value, each column holds one type of data, there are no repeating groups of columns, and every row is uniquely identifiable — a primary key exists.
:::

The give-away violation is a list inside a cell. In this library table, each member has borrowed several books, and both `BooksCheckedOut` and `ReturnDates` hold comma-separated lists:

<table class="tbl-bad">
<thead><tr><th>MemberID</th><th>Name</th><th>BooksCheckedOut</th><th>ReturnDates</th></tr></thead>
<tbody>
<tr><td>M1</td><td>Alice</td><td class="cell-bad">Harry Potter, Dune</td><td class="cell-bad">Dec 1, Dec 5</td></tr>
<tr><td>M2</td><td>Bob</td><td class="cell-bad">1984, Brave New World, Hobbit</td><td class="cell-bad">Dec 3, Dec 3, Dec 10</td></tr>
</tbody>
</table>

You cannot query "who has Dune?" without string surgery, and the pairing between books and dates is ambiguous. The fix is always the same: **one value per cell, one fact per row**.

<table class="tbl-good">
<thead><tr><th>MemberID</th><th>Name</th><th>Book</th><th>ReturnDate</th></tr></thead>
<tbody>
<tr><td class="cell-pk">M1</td><td>Alice</td><td class="cell-ok">Harry Potter</td><td>Dec 1</td></tr>
<tr><td class="cell-pk">M1</td><td>Alice</td><td class="cell-ok">Dune</td><td>Dec 5</td></tr>
<tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">1984</td><td>Dec 3</td></tr>
<tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">Brave New World</td><td>Dec 3</td></tr>
<tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">The Hobbit</td><td>Dec 10</td></tr>
</tbody>
</table>

The primary key becomes the composite `{MemberID, Book}`. Every cell is atomic and every borrowing is one queryable row.

::: warning
Reaching 1NF usually *increases* visible repetition (Alice's name now appears twice). That is expected — the repetition is dealt with by the higher normal forms, not by 1NF itself.
:::

## 7.5 Second Normal Form (2NF)

::: definition
A table is in **2NF** if it is in 1NF *and* every non-prime attribute is **fully functionally dependent** on the *entire* primary key — there are no **partial dependencies** (attributes that depend on only part of a composite key).
:::

2NF only ever bites when the primary key is **composite**. If the key is a single attribute, the table is automatically in 2NF — there is nothing to depend partially on.

::: example Worked Example — online store order lines
The table `OrderLines` has primary key `{OrderID, ProductID}`:

<table class="tbl-bad">
<thead><tr><th>OrderID 🔑</th><th>ProductID 🔑</th><th>ProductName</th><th>UnitPrice</th><th>CustomerName</th><th>Qty</th></tr></thead>
<tbody>
<tr><td>O1</td><td>P10</td><td class="cell-bad">Laptop</td><td class="cell-bad">$999</td><td class="cell-bad">Alice</td><td>1</td></tr>
<tr><td>O1</td><td>P20</td><td class="cell-bad">Mouse</td><td class="cell-bad">$29</td><td class="cell-bad">Alice</td><td>2</td></tr>
<tr><td>O2</td><td>P10</td><td class="cell-bad">Laptop</td><td class="cell-bad">$999</td><td class="cell-bad">Bob</td><td>1</td></tr>
</tbody>
</table>

Test each non-key attribute against the key:

- `{OrderID, ProductID} → Qty` — **full** dependency ✔ (you need both parts)
- `ProductID → ProductName, UnitPrice` — **partial** ✘ (product facts ignore the order)
- `OrderID → CustomerName` — **partial** ✘ (customer facts ignore the product)

Decompose so that each attribute lives with exactly the key it depends on:

- `Orders(OrderID PK, CustomerName)`
- `Products(ProductID PK, ProductName, UnitPrice)`
- `OrderLines(OrderID FK, ProductID FK, Qty)` with PK `{OrderID, ProductID}`

"Laptop / $999" is now stored once, no matter how many orders contain it.
:::

## 7.6 Third Normal Form (3NF)

::: definition
A table is in **3NF** if it is in 2NF *and* no non-prime attribute is **transitively dependent** on the primary key. A transitive dependency is a chain A → B → C in which B is a non-prime attribute: C depends on the key only *indirectly*, through B.
:::

![Cutting a transitive dependency chain into two tables restores 3NF.](diagrams/transitive-cut.svg)

::: example Worked Example — hospital employees
`PK: EmpID`, and each employee belongs to a department:

<table class="tbl-bad">
<thead><tr><th>EmpID</th><th>EmpName</th><th>DeptID</th><th>DeptName</th><th>DeptLocation</th></tr></thead>
<tbody>
<tr><td class="cell-pk">E1</td><td>Alice</td><td>D1</td><td class="cell-bad">Cardiology</td><td class="cell-bad">Floor 3</td></tr>
<tr><td class="cell-pk">E2</td><td>Bob</td><td>D1</td><td class="cell-bad">Cardiology</td><td class="cell-bad">Floor 3</td></tr>
<tr><td class="cell-pk">E3</td><td>Carol</td><td>D2</td><td class="cell-bad">Neurology</td><td class="cell-bad">Floor 5</td></tr>
</tbody>
</table>

The chain is `EmpID → DeptID → DeptName, DeptLocation`. Department facts reach the key only through `DeptID`, so they are transitive. Split the chain:

- `Employees(EmpID PK, EmpName, DeptID FK)`
- `Departments(DeptID PK, DeptName, DeptLocation)`

If Cardiology moves floors, we now update **one row** — the update anomaly is gone.
:::

::: tip
A quick smell test for 3NF: scan the table for columns whose values repeat *together* (Cardiology always appears with Floor 3). Attributes that travel in pairs usually belong in their own table.
:::

## 7.7 Boyce–Codd Normal Form (BCNF)

::: definition
A table is in **BCNF** if, for every non-trivial functional dependency X → Y, the determinant **X is a superkey**. BCNF is a stricter version of 3NF: 3NF tolerates an FD whose right-hand side is a *prime* attribute; BCNF does not.
:::

A table can be in 3NF but not BCNF only when it has **overlapping candidate keys**. The classic case is course scheduling:

<table class="tbl-bad">
<thead><tr><th>Student</th><th>Subject</th><th>Teacher</th></tr></thead>
<tbody>
<tr><td>Alice</td><td>Math</td><td>Prof. Taylor</td></tr>
<tr><td>Alice</td><td>Science</td><td>Prof. Adams</td></tr>
<tr><td>Bob</td><td>Math</td><td>Prof. Lee</td></tr>
<tr><td>Bob</td><td>Science</td><td>Prof. Adams</td></tr>
</tbody>
</table>

The FDs are `{Student, Subject} → Teacher` and `Teacher → Subject` (each teacher teaches exactly one subject). `Teacher` determines `Subject` but is **not a superkey**, so BCNF is violated — even though the table is in 3NF (`Subject` is a prime attribute). The BCNF decomposition is:

- `TeacherSubject(Teacher PK, Subject)`
- `StudentTeacher(Student, Teacher)` with PK `{Student, Teacher}`

## 7.8 Decomposition — doing it safely

Splitting a table is only correct if nothing is lost in the process. A good decomposition must satisfy two properties:

| Property | Meaning | Test |
|---|---|---|
| **Lossless-join** | Joining the pieces back together reproduces *exactly* the original rows — no lost data, no spurious tuples | R = R₁ ⋈ R₂ (natural join) |
| **Dependency-preserving** | Every original FD can still be enforced inside a single piece, without joining | F ≡ F₁ ∪ F₂ |

::: warning
There is a genuine trade-off at the top of the ladder: **BCNF always guarantees a lossless join but may sacrifice dependency preservation.** In the scheduling example above, the FD `{Student, Subject} → Teacher` can no longer be checked inside either new table. **3NF guarantees both properties**, which is why 3NF is the usual practical target in real systems.
:::

A mechanical recipe you can apply in the exam:

1. Find a violating FD **X → Y** where X is not a superkey (or is only part of the key).
2. Create a new table containing **X ∪ Y**, with X as its primary key.
3. Remove Y from the original table; keep X there as a **foreign key**.
4. Repeat until every remaining FD has a superkey on its left-hand side.

## 7.9 A checklist for any table

When a question drops an unfamiliar table in front of you, work through this sequence:

1. **Identify the key.** What minimal set of columns identifies a row?
2. **1NF:** any lists or repeating groups in cells? If yes, split into rows first.
3. **2NF:** is the key composite? If so, does any non-key column depend on only part of it?
4. **3NF:** any chains — a non-key column that depends on another non-key column?
5. **BCNF:** list all determinants; is each one a superkey?
6. **Stop when done.** If the table already passes, say so — over-splitting a clean table adds join cost for no benefit.

## 7.10 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| Normalization | Organising tables to store every fact exactly once, eliminating anomalies |
| Update anomaly | One fact changed in some rows but not others, causing contradiction |
| Insertion anomaly | A fact cannot be added until an unrelated fact exists |
| Deletion anomaly | Deleting one fact unintentionally destroys another |
| Functional dependency | X → Y: the value of X uniquely determines the value of Y |
| Partial dependency | A non-prime attribute depends on only part of a composite key (breaks 2NF) |
| Transitive dependency | Key → B → C where B is non-prime; C depends on the key indirectly (breaks 3NF) |
| Decomposition | Splitting a relation into smaller relations to remove violations |
| Lossless-join | Rejoining decomposed tables reproduces the original exactly |
| Dependency preservation | All original FDs remain enforceable without joins |
| Superkey | Any attribute set that determines all attributes of the table |

</div>

## 7.11 Summary

::: summary End-of-topic summary
- Redundancy causes **update, insertion and deletion anomalies**; normalization removes them by design.
- **FDs** are the language of normalization: X → Y means X uniquely fixes Y. Know determinant, dependent, candidate key, prime/non-prime.
- **1NF** — atomic cells, a primary key exists. **2NF** — no partial dependencies on a composite key. **3NF** — no transitive dependencies. **BCNF** — every determinant is a superkey.
- Decomposition must be **lossless**; 3NF also preserves all dependencies, BCNF sometimes cannot — which is why 3NF is the common practical target.
- Normalize *to the point of correctness*, then stop: a table already in 3NF does not benefit from further splitting.
:::

## Practice Questions

Work each problem on paper before opening the answer key at the end of this guide. State the highest normal form the table currently satisfies, name the violated rule, then write the decomposed tables.

1. **University enrolment.** `Enrollment(StudentID 🔑, CourseID 🔑, StudentName, CourseName, Grade)` with FDs `{StudentID, CourseID} → Grade`, `StudentID → StudentName`, `CourseID → CourseName`. Which normal form is violated, and why? Decompose.

2. **Employee projects.** `Employee_Project(EmpID 🔑, EmpName, ProjectID, ProjectName, ManagerID, ManagerPhone)` with FDs `EmpID → EmpName, ProjectID, ManagerID`; `ProjectID → ProjectName`; `ManagerID → ManagerPhone`. The table is in 2NF. Find all transitive dependencies and decompose to 3NF.

3. **Advising (BCNF challenge).** `Advising(Student, Advisor, Department)` with FDs `{Student, Department} → Advisor` and `Advisor → Department`; candidate keys `{Student, Department}` and `{Student, Advisor}`. Is it in 3NF? In BCNF? Decompose if needed, and state whether your decomposition is lossless and dependency-preserving.

4. **Order lines.** `Order_Items(OrderID 🔑, ProductID 🔑, ProductName, Quantity)`. "Keyboard" repeats every time product P1 is ordered. Diagnose and fix.

5. **Movies.** `Movies(MovieID 🔑, Title, Actors)` where `Actors` holds values like "DiCaprio, Hardy". Diagnose and fix.

6. **Books.** `Books(BookID 🔑, Title, PublisherID, PublisherCity)` — "London" repeats for every book from publisher PUB1. Diagnose and fix.

7. **Customers.** `Customers(CustomerID 🔑, CustomerName, Email)`. What, if anything, needs fixing?

8. **Clinic appointments.** `Appointments(PatientID 🔑, PatientName, DoctorID 🔑, DoctorName, Fee)` with PK `{PatientID, DoctorID}`; the fee depends on patient and doctor together. This one hides *two* problems — find both and decompose.

## Answer Key

1. **Violates 2NF** — `StudentName` depends only on `StudentID` and `CourseName` only on `CourseID`: two partial dependencies on the composite key. Decompose into `Students(StudentID PK, StudentName)`, `Courses(CourseID PK, CourseName)`, `Enrollment(StudentID FK, CourseID FK, Grade)` with PK `{StudentID, CourseID}`.

2. Two transitive chains: `EmpID → ProjectID → ProjectName` and `EmpID → ManagerID → ManagerPhone`. Decompose into `Employees(EmpID PK, EmpName, ProjectID FK, ManagerID FK)`, `Projects(ProjectID PK, ProjectName)`, `Managers(ManagerID PK, ManagerPhone)` — now in 3NF.

3. **3NF: yes** — in `Advisor → Department`, the right-hand side `Department` is a prime attribute, which 3NF permits. **BCNF: no** — `Advisor` is a determinant but not a superkey. Decompose into `R1(Advisor PK, Department)` and `R2(Student, Advisor)` with PK `{Student, Advisor}`. The decomposition **is lossless** (the shared attribute `Advisor` is the key of R1) but **not dependency-preserving**: `{Student, Department} → Advisor` can no longer be checked without a join.

4. **In 1NF, not 2NF** — `ProductName` depends only on `ProductID` (partial dependency). Decompose into `Products(ProductID PK, ProductName)` and `Order_Items(OrderID, ProductID, Quantity)` with PK `{OrderID, ProductID}`; `ProductID` remains as a foreign key.

5. **Not in 1NF** — `Actors` holds multiple values in one cell. Put each actor on its own row: `Movie_Cast(MovieID, Title, Actor)` with PK `{MovieID, Actor}`. (Better still, split `Movies(MovieID PK, Title)` from `Movie_Cast(MovieID FK, Actor)` to avoid repeating the title.)

6. **In 2NF, not 3NF** — chain `BookID → PublisherID → PublisherCity` is a transitive dependency. Decompose into `Books(BookID PK, Title, PublisherID FK)` and `Publishers(PublisherID PK, PublisherCity)`.

7. **Nothing.** Every cell is atomic (1NF); the key is a single column, so 2NF holds automatically; both non-key attributes depend directly on `CustomerID` with no chain, so 3NF holds. Part of normalizing well is recognising when to stop.

8. Every cell is atomic (1NF holds), but there are **two partial dependencies** on the composite key: `PatientID → PatientName` and `DoctorID → DoctorName`. Decompose into `Patients(PatientID PK, PatientName)`, `Doctors(DoctorID PK, DoctorName)`, `Appointments(PatientID FK, DoctorID FK, Fee)` with PK `{PatientID, DoctorID}`. The result is also in 3NF — no non-key attribute depends on another non-key attribute.
