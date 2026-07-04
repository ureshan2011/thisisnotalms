---
number: 1
title: Introduction to DBMS
subtitle: Data, information, why file-based systems fail, the relational model, and setting up your MySQL environment
objectives:
  - Distinguish between data and information using real-world examples
  - Explain the advantages of a DBMS over file-based systems
  - Identify the key components of a relational database — tables, rows, columns and keys
  - Install and verify MySQL Community Server with MySQL Workbench
---

## 1.1 Data vs information

The two words are used interchangeably in everyday speech; in this course they are precisely different things.

::: definition
**Data** is raw, unprocessed facts and figures with no inherent meaning on their own — `85`, `"Auckland"`, `42`. **Information** is data that has been *processed and given context* so it becomes meaningful and useful for decisions — "John Smith achieved a distinction (85%) in MBI802 during Semester 1."
:::

![Data becomes information through processing and context.](diagrams/data-to-information.svg)

The transformation requirement is **context + processing**. A file of thousands of bare transaction amounts is data; a report showing "sales rose 12% in March, driven by the Auckland store" is information.

Not all information is equally useful. **Quality information** is:

| Characteristic | Meaning |
|---|---|
| **Accurate** | Reflects reality — wrong information is worse than none |
| **Complete** | Nothing essential is missing from the picture |
| **Timely** | Current and available when the decision is made |
| **Relevant** | Actually useful for the decision at hand |

## 1.2 Why file-based systems fail

Before databases, organisations kept records in separate files — and many small ones still run on spreadsheets.

::: example Worked Example — the hospital spreadsheet
*A hospital stores patient records in Excel spreadsheets. What goes wrong?*

- **Redundancy** — the same patient's details are re-typed in the admissions sheet, the ward sheet and the pharmacy sheet.
- **Inconsistency** — the patient changes address; two of the three copies never get updated. Which one is true?
- **Security** — anyone with the file has *all* the data; there is no per-user access control for reception vs doctors.
- **Concurrency** — two nurses open the file at once; the second save silently overwrites the first ("last writer wins").
- **No integrity rules** — nothing stops a discharge date earlier than the admission date, or a row with no patient ID at all.
:::

A **DBMS (Database Management System)** is software purpose-built to solve exactly these problems:

| File-based problem | DBMS answer |
|---|---|
| Redundant copies everywhere | One shared, structured store — each fact once |
| Inconsistent updates | Centralised updates; constraints keep data valid |
| All-or-nothing file access | Fine-grained security: each user sees only what they should |
| Simultaneous edits collide | Concurrency control — many users, safely, at once |
| No validation | Integrity rules enforced by the system itself |

There are several families of DBMS — **relational** (MySQL, PostgreSQL, Oracle — the subject of this course), **NoSQL** (document/key-value stores like MongoDB for flexible, huge-scale data) and **NewSQL** (relational guarantees at NoSQL scale). MBI802 focuses on the relational model, which still runs the overwhelming majority of business systems.

## 1.3 Inside a relational database

::: definition
A **relational database** organises data into **tables** (formally *relations*) made of **rows** (*records/tuples*) and **columns** (*fields/attributes*). An **RDBMS** — Relational Database Management System — is the software that manages them.
:::

The vocabulary, on one small example:

| student_id | name | age | city |
|---|---|---|---|
| <span class="cell-pk">1001</span> | Alice Chen | 20 | Auckland |
| <span class="cell-pk">1002</span> | Ben Kumar | 22 | Wellington |

- Each **row** is one real-world instance — one student.
- Each **column** holds one kind of value for every row — every `age` is a number.
- The **primary key** (`student_id`) uniquely identifies each row; it can never be NULL or duplicated.
- A **foreign key** in another table (say `enrolments.student_id`) refers back to this primary key, linking the tables. **Referential integrity** means a foreign key value must match an existing primary key (or be NULL) — the DBMS refuses orphaned references.
- **NULL** means *no value / unknown* — it is not zero and not an empty string.
- A **composite key** combines two or more columns to identify a row (you will meet these properly in Lessons 6–7).
- The **schema** is the overall design — which tables exist, their columns, types and keys.

::: tip
Formal vs everyday terms appear in exams: table = **relation**, row = **tuple**, column = **attribute**. Know both directions.
:::

## 1.4 Setting up MySQL

Your toolchain for the whole course is **MySQL Community Server** (the database engine) plus **MySQL Workbench** (the graphical client you type SQL into).

1. Download MySQL Community Server from the official MySQL site (`dev.mysql.com/downloads`).
2. **Windows:** run the MySQL Installer (it will add the Visual C++ runtime if needed) and follow the configuration wizard — choose the default port 3306 and set a root password you will remember. **macOS:** install the DMG, then enable the server in System Settings and add MySQL to your PATH.
3. Install MySQL Workbench and create a connection to `localhost:3306` as `root`.
4. **Verify** the installation by running your first statement:

```sql
SHOW DATABASES;
```

If a list including `information_schema` and `mysql` appears, the server is alive and you are ready for Lesson 2.

::: warning
The root password you set during installation is the master key to your local server — if you lose it, recovery is fiddly. Write it in your password manager now, not later.
:::

## 1.5 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| Data | Raw facts and figures without inherent meaning |
| Information | Data processed and contextualised to be useful for decisions |
| DBMS | Software that stores, manages and secures shared databases |
| File-based system | Pre-database record keeping; suffers redundancy, inconsistency, insecurity |
| Relational database | Data organised into related tables of rows and columns |
| RDBMS | Relational Database Management System (MySQL, PostgreSQL, Oracle) |
| Table / relation | A named grid of rows and columns describing one entity type |
| Row / record / tuple | One instance — one student, one order |
| Column / field / attribute | One property, same type for every row |
| Primary key | Column(s) uniquely identifying each row; never NULL |
| Foreign key | Column referencing another table's primary key |
| Referential integrity | Foreign keys must point at existing rows (or be NULL) |
| NULL | No value / unknown — not zero, not empty string |
| Schema | The database's design: tables, columns, types, keys |

</div>

## 1.6 Summary

::: summary End-of-topic summary
- **Data** is raw; **information** = data + context + processing. Quality information is accurate, complete, timely, relevant.
- File-based systems fail on **redundancy, inconsistency, security, concurrency and integrity** — a DBMS solves all five by centralising storage behind managed software.
- Relational databases hold **tables** of **rows** and **columns**; **primary keys** identify rows, **foreign keys** link tables, and **referential integrity** keeps the links valid.
- Your environment: MySQL Community Server + MySQL Workbench, verified with `SHOW DATABASES;`.
:::

## Practice Questions

1. Classify each as data or information, with one sentence of justification: (a) `42`; (b) "Auckland"; (c) "Enrolments in MBI802 grew 15% between 2025 and 2026"; (d) a file of 10,000 bare transaction amounts.

2. What is the *primary requirement* for converting data into information?

3. A café chain keeps each branch's sales in its own spreadsheet, emailed weekly to head office. Name three specific problems this causes and the DBMS feature that fixes each.

4. In one sentence each: what do primary key, foreign key and referential integrity guarantee?

5. Give the formal terms for table, row and column.

6. In a `customers` table, the `phone` column of one row is NULL. What does that mean — and how is it different from an empty string?

7. Which SQL statement verifies a fresh MySQL installation is running, and what should you expect to see?

## Answer Key

1. (a) **Data** — a bare number with no context. (b) **Data** — a place name in isolation tells you nothing actionable. (c) **Information** — processed, contextualised and decision-ready. (d) **Data** — volume doesn't create meaning; there is still no context.

2. **Context plus processing** — the data must be organised and related to something meaningful (who, what, when) before it informs a decision.

3. Any three of: **redundancy** (customer/product details re-typed per branch — solved by one shared store); **inconsistency** (price updated in one sheet only — solved by centralised updates and constraints); **security** (whole file readable by anyone — solved by per-user permissions); **concurrency** (simultaneous edits overwrite each other — solved by the DBMS's concurrency control); **integrity** (typos like negative sales accepted — solved by validation rules and types).

4. A **primary key** guarantees every row can be uniquely identified. A **foreign key** links a row to a row in another table by storing that table's key. **Referential integrity** guarantees every foreign-key value actually matches an existing primary key (or is NULL) — no orphaned links.

5. Table = **relation**; row = **tuple**; column = **attribute**.

6. NULL means **the value is unknown or absent** — the customer's phone number was never recorded. An empty string `""` is a known value that happens to be empty; NULL is the absence of any value. They compare differently in SQL (`IS NULL`, not `= ''`).

7. `SHOW DATABASES;` — a successful server returns the list of system databases (`information_schema`, `mysql`, `performance_schema`, …).
