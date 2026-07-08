---
number: 6
title: ER to Relational Mapping
subtitle: The eight deterministic rules that turn any ER diagram into a complete relational schema
objectives:
  - Apply the eight mapping rules to convert any Chen-notation ER diagram into tables
  - Place foreign keys correctly for 1:N, M:N and 1:1 relationships
  - Map weak entities to tables with composite primary keys
  - Flatten composite attributes and extract multivalued attributes into their own tables
  - Avoid the four classic mapping mistakes
---

## 6.1 From diagram to schema — the big picture

Lessons 4 and 5 taught you to *draw* the design; this lesson turns the drawing into tables. The translation is **deterministic**: eight rules, applied in order, convert any ER diagram into a relational schema with no guesswork. Two designers applying the rules to the same diagram will produce the same tables — that reliability is exactly why we design in ER first.

![The mapping pipeline: a Chen ER diagram, transformed by the eight rules into a relational schema.](diagrams/mapping-rules.svg)

## 6.2 The eight mapping rules

### Rule 1 — Strong entity → table

Each strong entity becomes a table: entity name → table name, each simple attribute → a column, key attribute → **PRIMARY KEY**.

### Rule 2 — Composite attribute → flatten

A composite attribute is **never stored as a single column**. Each sub-attribute becomes its own column and the composite parent is discarded — it exists only in the diagram.

```sql
-- Address (Street, City, PostCode) and Name (First, Last) flattened:
CREATE TABLE student (
  student_id    INT PRIMARY KEY,
  first_name    VARCHAR(50),
  last_name     VARCHAR(50),
  street_name   VARCHAR(80),
  city          VARCHAR(50),
  post_code     VARCHAR(10)
);  -- note: no "name" or "address" column exists
```

### Rule 3 — Multivalued attribute → new table

A multivalued attribute (double ellipse) creates a **new table** holding: the attribute as a column, the owning entity's PK as a foreign key, and a **composite primary key** of both.

```sql
CREATE TABLE employee_skill (
  emp_id  INT REFERENCES employee(emp_id),
  skill   VARCHAR(80),
  PRIMARY KEY (emp_id, skill)
);
```

### Rule 4 — 1:N relationship → FK on the N side

The primary key of the "1" entity is added as a **foreign key in the "N" entity's table**. No new table is needed.

::: tip
Memory hook: **the FK always goes to the MANY side** — there are many instances, each pointing back to its one owner. `DEPARTMENT (1) employs EMPLOYEE (N)` → `dept_id` FK in EMPLOYEE. `CUSTOMER (1) places ORDER (N)` → `customer_id` FK in ORDER.
:::

### Rule 5 — M:N relationship → junction table

A many-to-many relationship **cannot** be represented with a single FK. Create a **junction (bridge) table** containing the PKs of *both* entities as foreign keys; its primary key is normally the combination of the two. **Relationship attributes become columns of the junction table** — Grade belongs to ENROLMENT, not to STUDENT or MODULE.

```sql
CREATE TABLE enrolment (
  student_id   INT REFERENCES student(student_id),
  module_code  VARCHAR(10) REFERENCES module(module_code),
  grade        DECIMAL(4,2),
  PRIMARY KEY (student_id, module_code)
);
```

### Rule 6 — 1:1 relationship → FK choice

For 1:1, the FK can live in **either** table, so choose deliberately. Best practice: put the FK on the **total-participation side** (the side that must belong to the other). If the two entities always co-exist, merging them into one table is also valid.

::: example Worked Example — company cars
`EMPLOYEE (1) — assigned — (1) COMPANY_CAR`. Not every employee has a car, but every company car is assigned to exactly one employee. The car side has total participation → put `employee_id` (FK, `NOT NULL`, `UNIQUE`) in the COMPANY_CAR table.
:::

### Rule 7 — Weak entity → composite PK

A weak entity becomes a table whose primary key is **composite**: the owner's PK (serving double duty as FK) plus the weak entity's partial key.

```sql
CREATE TABLE room (
  building_id  INT REFERENCES building(building_id),
  room_no      VARCHAR(10),
  room_type    VARCHAR(30),
  PRIMARY KEY (building_id, room_no)
);
```

### Rule 8 — Derived attribute → do NOT store

Derived attributes are computed at query time, never stored — a stored `age` column goes stale on every birthday.

```sql
SELECT first_name,
       TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age
FROM   employee;
```

*(Some modern systems offer computed/virtual columns; the default mapping rule remains: omit derived attributes from the schema.)*

## 6.3 Worked example — university enrolment

**The diagram:** STUDENT (<u>StudentID</u>, Name composite: First/Last, DateOfBirth, Address composite: Street/City/PostCode) — *enrols_in* (M:N, with Grade) — MODULE (<u>ModuleCode</u>, ModuleName, Credits) — *belongs_to* (N:1) — DEPARTMENT (<u>DeptID</u>, DeptName).

**Step 1 — map the entities (Rules 1 + 2).** Three tables; both composites flattened:

| Table | Columns | Rule |
|---|---|---|
| `student` | student_id **PK**, first_name, last_name, date_of_birth, street_name, city, post_code | 1 + 2 |
| `module` | module_code **PK**, module_name, credits | 1 |
| `department` | dept_id **PK**, dept_name | 1 |

**Step 2 — map the relationships (Rules 4 + 5).**

- *belongs_to* is 1:N → add `dept_id` **FK** to the `module` table (the N side). No new table.
- *enrols_in* is M:N → create the junction table `enrolment(student_id PK+FK, module_code PK+FK, grade)`. The relationship attribute Grade lands here.

**The complete schema — four tables** (three entities + one junction):

```sql
department(dept_id PK, dept_name)
module(module_code PK, module_name, credits, dept_id FK→department)
student(student_id PK, first_name, last_name, date_of_birth,
        street_name, city, post_code)
enrolment(student_id PK+FK→student, module_code PK+FK→module, grade)
```

## 6.4 Common mapping mistakes

| Common mistake | Correct approach |
|---|---|
| Storing a derived attribute (`age INT` goes stale every birthday) | Store `date_of_birth`; compute age in the query |
| One column for a composite (`address VARCHAR(200)`) | Flatten: `street_name`, `city`, `post_code` — individually queryable |
| Implementing M:N by putting both FKs into one *entity* table | Always create a junction table with both FKs + relationship attributes |
| FK on the "1" side of a 1:N (e.g. `dept_id` list in DEPARTMENT) | FK always on the **N side**: `module.dept_id → department.dept_id` |

## 6.5 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| Relational schema | The set of table definitions (columns, PKs, FKs) implementing a design |
| Mapping | The rule-based translation from ER diagram to relational schema |
| Foreign key (FK) | A column referencing the primary key of another table |
| Junction (bridge) table | The extra table implementing an M:N relationship; PK = both FKs |
| Flattening | Replacing a composite attribute with columns for its leaf sub-attributes |
| Composite primary key | A PK made of two or more columns (junction tables, weak entities, multivalued tables) |
| Total-participation side | In 1:1 mapping, the side that must belong to the other — where the FK goes |
| Computed at query time | How derived attributes are produced instead of being stored |

</div>

## 6.6 Summary

::: summary End-of-topic summary
- Mapping is **deterministic**: strong entity → table (1); composite → flatten (2); multivalued → own table (3); 1:N → FK on the N side (4); M:N → junction table (5); 1:1 → FK on the total side or merge (6); weak entity → composite PK of owner-PK + partial key (7); derived → never stored (8).
- Relationship attributes always land in the **junction table**.
- Count check for any diagram: tables = strong entities + weak entities + multivalued attributes + M:N relationships.
- The four classic errors: stored derived values, un-flattened composites, M:N without a junction table, FK on the wrong side of 1:N.
:::

## Practice Questions

1. **Project management.** EMPLOYEE has EmpId (key), Name (composite: FirstName, LastName) and {SkillSet} (multivalued). PROJECT has ProjectId (key), ProjectName, StartDate. An employee works on many projects and a project has many employees; WORKS_ON records HoursPerWeek. Every employee must work on at least one project; a project may exist before anyone is assigned. Apply the eight rules: list every table with columns, PKs and FKs, and name the rule that creates each table.

2. **Which rule?** For each construct, name the rule and the outcome: (a) `{PhoneNumbers}` on CUSTOMER; (b) *places* between CUSTOMER (1) and ORDER (N); (c) (TotalPrice) on ORDER; (d) ROOM weak within BUILDING; (e) Name = First + Last on AUTHOR.

3. **1:1 placement.** Every LAPTOP in an asset register is assigned to exactly one STAFF member; some staff have no laptop. Which table receives the FK, and with which constraints?

4. **Spot the errors.** A student proposes: `STUDENT(student_id PK, name, address VARCHAR(200), age INT, module_code FK)` for students who enrol in many modules (and modules have many students). Identify every mapping error and write the corrected schema.

## Answer Key

1. Four tables. `employee(emp_id PK, first_name, last_name)` — Rule 1, Name flattened by Rule 2. `project(project_id PK, project_name, start_date)` — Rule 1. `employee_skill(emp_id PK+FK→employee, skill PK)` — Rule 3 (multivalued {SkillSet}); composite PK (emp_id, skill). `works_on(emp_id PK+FK→employee, project_id PK+FK→project, hours_per_week)` — Rule 5 (M:N with relationship attribute); composite PK (emp_id, project_id). The participation rules ("every employee must work on ≥1 project") are enforced by application/constraint logic, not by extra tables.

2. (a) Rule 3 — new table `customer_phone(customer_id FK, phone_number)`, composite PK. (b) Rule 4 — `customer_id` FK added to ORDER (the N side). (c) Rule 8 — not stored; computed as UnitPrice × Qty in queries. (d) Rule 7 — `room(building_id FK, room_no)` with composite PK. (e) Rule 2 — flatten to `first_name`, `last_name`; no `name` column.

3. The FK goes on the **total-participation side**: every laptop must be assigned, so `staff_id` goes in the LAPTOP table, declared `NOT NULL` (total participation) and `UNIQUE` (to keep the relationship 1:1 rather than 1:N).

4. Errors: (i) `address` stores a composite as one column — flatten to street/city/postcode (Rule 2); (ii) `age` is derived — store `date_of_birth` instead (Rule 8); (iii) `module_code FK` inside STUDENT implements an M:N with a single FK — impossible; create a junction table (Rule 5). Corrected: `student(student_id PK, first_name, last_name, date_of_birth, street_name, city, post_code)`, `module(module_code PK, …)`, `enrolment(student_id PK+FK, module_code PK+FK, grade)`.
