---
number: 4
title: ER Diagrams Foundations
subtitle: Chen's notation — entities, attributes, keys, relationships and cardinality — and how to draw a complete diagram from a scenario
objectives:
  - Explain what an ER diagram is for and why databases are designed on paper first
  - Draw and name the four Chen-notation shapes and state what each becomes in a relational database
  - Assign the correct cardinality (1:1, 1:N, M:N) to a relationship from a written scenario
  - Produce a complete ER diagram from a real-world description, step by step
  - Read an unfamiliar ER diagram back into plain-English business rules
---

## 4.1 What is an ER diagram, and why draw one?

An **entity-relationship (ER) diagram** is a blueprint for a database, drawn *before* any code is written. It shows the real-world things you need to track, their properties, and how they connect. The notation we use in MBI802 was invented by **Peter Chen in 1976** and remains the standard teaching notation because it is simple and language-neutral — a developer, a manager and a client can all read the same picture.

Think of it as an architect's drawing: the architect plans rooms before anyone pours concrete; the database designer plans tables before anyone writes `CREATE TABLE`.

Three practical reasons to design this way:

| Benefit | Why it matters |
|---|---|
| **Common language** | One diagram everyone understands — no technical jargon between developers, managers and clients |
| **Catch errors early** | A design mistake fixed on paper takes minutes; the same mistake in a live database can take days |
| **Road map to tables** | Every shape maps directly to a database structure — entity → table, attribute → column, key → primary key |

::: tip
There are two popular notations. **Chen's notation** (used in this course) draws explicit shapes — rectangles, ellipses, diamonds. **Crow's Foot notation**, common in industry tools such as Lucidchart, Visio and draw.io, encodes cardinality in the line-end symbols instead. The concepts are identical; only the drawing style differs. Learn Chen's here and you will read Crow's Foot with ten minutes' practice.
:::

## 4.2 The four shapes of Chen's notation

Chen's notation needs only four shapes, and each shape has exactly one job.

![The four Chen-notation shapes and what each becomes in the relational database.](diagrams/chen-shapes.svg)

**Entity — the rectangle.** A real-world "thing" we store data about: STUDENT, COURSE, TEACHER, PRODUCT. Entities are always **nouns**, written in uppercase, and each becomes a **table**. Quick test: *can you list many of them?* Many students, many courses → entities.

**Attribute — the ellipse.** A property of an entity, connected to it by a line: a STUDENT has Name, Email, BirthDate. Each attribute becomes a **column** in the entity's table.

**Key attribute — the underlined ellipse.** The attribute that uniquely identifies each instance. Two students may share a name, but each has a unique StudentID — so StudentID is underlined and becomes the **primary key**. *Every entity must have one.*

**Relationship — the diamond.** How two entities connect, written as a **verb**: *enrolls*, *teaches*, *manages*, *owns*. Lines join the diamond to both entities.

::: tip
Memory hook: **entity = noun, relationship = verb.** "STUDENT *enrolls* COURSE" — the nouns get rectangles, the verb gets the diamond. And no shape ever floats: attributes attach to entities, entities attach to diamonds.
:::

## 4.3 Cardinality — the numbers on the lines

Cardinality answers one question about each relationship: **how many instances on one side can relate to how many on the other?** It is written as labels (1, N, M) on the connecting lines.

![The three cardinality types in Chen's notation.](diagrams/cardinality.svg)

| Type | Meaning | Examples |
|---|---|---|
| **1 : 1** | Each instance on side A matches exactly one on side B, and vice versa | One employee holds one passport; one principal leads one school |
| **1 : N** | One A relates to many Bs, but each B belongs to only one A | One teacher teaches many courses; each course has one teacher. One mother has many children |
| **M : N** | Many on both sides simultaneously | One student enrolls in many courses *and* each course has many students; actors and movies |

::: warning
Cardinality is decided by the **business rules in the scenario, in both directions**. Always ask two questions: "how many Bs can one A have?" *and* "how many As can one B have?" Answering only one direction is the most common exam mistake — it turns M:N relationships into 1:N by accident.
:::

Looking ahead to Lesson 6: a **1:N** relationship is implemented with a **foreign key** on the N side, while every **M:N** relationship needs a separate **junction table** (for example ENROLLMENT). That is why identifying cardinality correctly now matters so much later.

## 4.4 Drawing a complete ER diagram — the five steps

Work through every scenario in the same order:

1. **Identify the entities** — what real-world things do we store data about? (Hunt for the *nouns*.)
2. **List the attributes** of each entity — what properties does it have?
3. **Mark the key attribute** — which attribute uniquely identifies each instance? Underline it.
4. **Identify the relationships** — how do entities connect? (Hunt for the *verbs*.)
5. **Add cardinality** — 1:1, 1:N or M:N on each relationship line, checking *both* directions.

::: example Worked Example — university enrolment
**Scenario:** "A university has students and courses. Students can enrol in many courses. Each course is taught by one teacher. Teachers can teach many courses. Each enrolment records the grade the student received."

*Step 1 — entities:* STUDENT, COURSE, TEACHER (the nouns).
*Step 2–3 — attributes and keys:* StudentID (key), Name for STUDENT; CourseID (key), Title for COURSE; TeacherID (key), Name for TEACHER.
*Step 4 — relationships:* **enrolls** (STUDENT–COURSE), **teaches** (TEACHER–COURSE).
*Step 5 — cardinality:* a student enrols in many courses and a course has many students → **M:N**. A teacher teaches many courses but each course has one teacher → **1:N**.

Note where **Grade** lives: it describes the *pair* (student, course) — neither the student alone nor the course alone — so it attaches to the **enrolls diamond** as a relationship attribute.

![The complete university ER diagram in Chen's notation.](diagrams/er-university.svg)
:::

**Reading it back** (always do this as a self-check): one TEACHER teaches many COURSEs; each COURSE is taught by one TEACHER; a STUDENT can enrol in many COURSEs; a COURSE can have many STUDENTs. If any sentence contradicts the scenario, fix the diagram.

## 4.5 From diagram to database

Every element of the finished diagram maps mechanically to the relational world — this is the bridge to Lesson 6:

| ER element | Becomes |
|---|---|
| STUDENT / COURSE / TEACHER entity | A table each |
| StudentID (underlined) | Primary key of its table |
| Name, Email, Title… | Columns |
| teaches (1:N) | Foreign key `TeacherID` in the COURSE table |
| enrolls (M:N) | Junction table `ENROLLMENT(StudentID, CourseID, Grade)` |

## 4.6 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| ER diagram | A visual blueprint of a database's entities, attributes and relationships, drawn before implementation |
| Chen's notation | The 1976 shape-based ER notation: rectangles, ellipses, diamonds |
| Crow's Foot notation | An industry ER notation that shows cardinality with line-end symbols |
| Entity | A real-world thing we track (a noun); becomes a table |
| Attribute | A property of an entity; becomes a column |
| Key attribute | The underlined attribute that uniquely identifies each instance; becomes the primary key |
| Relationship | A verb connecting two entities, drawn as a diamond |
| Relationship attribute | An attribute that belongs to the relationship itself (e.g. Grade on *enrolls*) |
| Cardinality | How many instances of each entity can participate: 1:1, 1:N or M:N |
| Junction table | The extra table that implements an M:N relationship |

</div>

## 4.7 Summary

::: summary End-of-topic summary
- ER diagrams are **design tools**: draw before you code, and errors cost minutes instead of days.
- Four shapes, four jobs: **rectangle** = entity → table; **ellipse** = attribute → column; **underlined ellipse** = key → primary key; **diamond** = relationship (a verb).
- Cardinality (**1:1, 1:N, M:N**) comes from the business rules — always check both directions.
- Attributes that describe a *pair* (like Grade) hang off the **relationship**, not an entity.
- Five steps every time: entities → attributes → keys → relationships → cardinality; then read the diagram back to verify.
:::

## Practice Questions

For each scenario, draw the full ER diagram in Chen's notation: entities with attributes, underlined keys, relationship diamonds, cardinality on every line, and relationship attributes where needed. Model answers describe the correct structure.

1. **Library.** A library lends books to its members. Each book has an ISBN, title and genre. Each member has a member ID, name and email. A member can borrow multiple books over time, and the same book may be borrowed by many members. Each borrowing records a borrow date and a return date.

2. **University.** Each student has a student ID, full name and GPA. Each course has a course code, title and credits. Students enrol in multiple courses each semester and each course has many students. The enrolment records the semester and the grade.

3. **Hospital.** Doctors, patients and departments. Each doctor has a doctor ID, name and specialization; each patient a patient ID, name and date of birth; each department a department ID and name. Each doctor works in exactly one department (a department has many doctors). Doctors treat many patients and patients may be treated by many doctors; each treatment records a treatment date.

4. **Online store.** Customers, orders and products. Each customer has a customer ID, name and address; each product a product ID, name and unit price; each order an order ID and order date. A customer places many orders (each order belongs to one customer). An order contains multiple products and a product appears in many orders; each order-line records a quantity.

5. **Hotel.** Guests and rooms. Each guest has a guest ID, full name and phone number; each room a room number, room type and nightly rate. A guest can book multiple rooms over different stays and the same room is booked by many guests over time. Each booking records a check-in date and a check-out date.

## Answer Key

1. **Library.** Entities: MEMBER (<u>MemberID</u>, Name, Email) and BOOK (<u>ISBN</u>, Title, Genre). One relationship diamond **borrows** between them, cardinality **M:N** (a member borrows many books; a book is borrowed by many members over time). BorrowDate and ReturnDate attach to the *borrows* diamond — they describe each borrowing event, not the member or the book.

2. **University.** Entities: STUDENT (<u>StudentID</u>, FullName, GPA) and COURSE (<u>CourseCode</u>, Title, Credits). Relationship **enrolls_in**, cardinality **M:N**. Semester and Grade are relationship attributes on the diamond.

3. **Hospital.** Entities: DOCTOR (<u>DoctorID</u>, Name, Specialization), PATIENT (<u>PatientID</u>, Name, DateOfBirth), DEPARTMENT (<u>DeptID</u>, Name). Two diamonds: **works_in** between DOCTOR and DEPARTMENT with cardinality **N:1** (many doctors per department, one department per doctor), and **treats** between DOCTOR and PATIENT with cardinality **M:N**, carrying TreatmentDate as a relationship attribute.

4. **Online store.** Entities: CUSTOMER (<u>CustomerID</u>, Name, Address), ORDER (<u>OrderID</u>, OrderDate), PRODUCT (<u>ProductID</u>, Name, UnitPrice). Diamonds: **places** between CUSTOMER and ORDER, cardinality **1:N** (one customer, many orders; each order one customer), and **contains** between ORDER and PRODUCT, cardinality **M:N**, with Quantity on the diamond.

5. **Hotel.** Entities: GUEST (<u>GuestID</u>, FullName, Phone) and ROOM (<u>RoomNumber</u>, RoomType, NightlyRate). Relationship **books**, cardinality **M:N** (a guest books many rooms across stays; a room is booked by many guests). CheckInDate and CheckOutDate are attributes of the *books* relationship.
