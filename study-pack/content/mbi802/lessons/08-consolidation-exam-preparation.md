---
number: 8
title: Consolidation & Exam Preparation
subtitle: The grand review — from data to database — an integrated practice lab, a final mock assessment, and where to go next
objectives:
  - Trace the complete design pipeline from raw data to a normalized, queryable database
  - Complete an integrated build-a-database lab covering CREATE, INSERT and SELECT
  - Test yourself against exam-style questions spanning every lesson
  - Plan your next steps with professional certification pathways
---

## 8.1 The grand review — from data to database

Everything in MBI802 is one continuous pipeline. Read it top to bottom and check you can explain every arrow:

| Stage | Lesson | You can now… |
|---|---|---|
| **Data → Information** | 1 | Distinguish raw facts from decision-ready information; justify why a DBMS beats files |
| **Requirements → ER diagram** | 4, 5 | Turn a written scenario into entities, attributes, keys, relationships, cardinality, participation |
| **ER diagram → Relational schema** | 6 | Apply the 8 mapping rules to produce tables, PKs and FKs deterministically |
| **Schema → Clean schema** | 7 | Test 1NF–BCNF, find partial/transitive dependencies, decompose losslessly |
| **Schema → Working database** | 2 | `CREATE DATABASE` / `CREATE TABLE` with the right data types |
| **Database → Answers** | 2, 3 | `INSERT`, `SELECT`, `WHERE`, `ORDER BY`, aggregates, `GROUP BY … HAVING`, `INNER JOIN` — and `UPDATE`/`DELETE` *always* scoped by WHERE |

::: tip
The single most connected idea in the course: **an M:N relationship in the ER diagram becomes a junction table (Rule 5), whose composite key is exactly what 2NF scrutinises, and which you reassemble at query time with INNER JOIN.** If you can narrate that one sentence, Lessons 4–7 have clicked.
:::

## 8.2 Integrated practice lab — build it end to end

This is the same shape as the personalised YooBees SQL Practice Lab: a client brief taken all the way to working queries. Do it in MySQL Workbench without looking back at earlier chapters, then check the answer key.

::: activity Lab — City Public Library
*You have been hired as a database developer for the City Public Library. They need a system to track their book collection and loans.*

1. Create a database `library_db` and select it.
2. Create a `books` table: auto-numbered `book_id` (PK), required `title` (≤100 chars), required `author` (≤80), `genre` (≤40), `year_published` (whole number).
3. Insert three books of your choice in **one** statement.
4. Retrieve: (a) all books; (b) title + author of Fantasy books, newest first; (c) how many books per genre.
5. Design check: members can borrow many books over time and each book can be borrowed by many members, with borrow/return dates recorded. What table(s) does this add, and why?
:::

## 8.3 Mock assessment

Forty minutes, no notes — mirrors the final knowledge check (38 questions, pass 60%). A selection across every category is in the Practice Questions below; the answer key explains *why* each answer is right, which is where the real revision happens.

**Exam technique for MCQs:** eliminate the obviously wrong pair first; beware options that are true statements but don't answer the question; "always/never" options are usually wrong in database design (except genuine rules like "a PK is never NULL").

## 8.4 Certification pathways — after MBI802

Skills from this course map directly to entry-level professional certifications. All of these have free learning tracks:

| Pathway | What it validates | Good next step if you enjoyed… |
|---|---|---|
| **Oracle MySQL certifications** | Deep MySQL administration and development | Lessons 2–3 (SQL craft) |
| **Microsoft Azure Data Fundamentals (DP-900)** | Cloud data concepts, relational + non-relational | Lesson 1 (the big picture) |
| **AWS Certified Cloud Practitioner → Database specialty** | Cloud-hosted database services | Deploying what you built |
| **MongoDB University free courses** | Document/NoSQL modelling | Comparing paradigms |
| **Free SQL practice** (LeetCode DB, HackerRank SQL, SQLBolt) | Query fluency under time pressure | Lesson 3 & 8's lab |

## 8.5 Revision priorities

If your time is limited, revise in this order:

1. **Normalization walkthroughs** (Lesson 7) — the highest-mark, most-practised exam skill: name the form, name the violation, decompose.
2. **The 8 mapping rules** (Lesson 6) — deterministic marks; the table-count check (`entities + weak + multivalued + M:N`) catches most slips.
3. **SQL syntax under pressure** (Lessons 2–3) — write CREATE/INSERT/SELECT/JOIN cold; know WHERE vs HAVING.
4. **ER notation** (Lessons 4–5) — the symbol table and participation keywords ("must/every" vs "may/can").
5. **Vocabulary** (Lesson 1 + Glossary) — relation/tuple/attribute, NULL semantics, referential integrity.

## 8.6 Summary

::: summary End-of-course summary
- The pipeline is one story: **scenario → ER diagram → mapped schema → normalized schema → SQL implementation → queries**.
- Every design decision is testable: cardinality from business rules, FK placement from Rule 4/5, normal forms from FDs.
- Safety habits are marks *and* professionalism: preview before UPDATE/DELETE; never store what you can derive; stop normalizing when the table is clean.
- Keep building: the certifications table gives you free, structured next steps.
:::

## Practice Questions

1. Which best describes **data**? (a) processed facts meaningful to decision-makers; (b) raw, unprocessed facts with no inherent meaning; (c) a structured collection of related tables; (d) instructions given to a computer.

2. A foreign key in one table refers to… (a) any text column; (b) the primary key of the same table; (c) the primary key (or unique key) of another table, establishing a link; (d) an unindexed key.

3. In relational terminology, a table is formally a… (a) schema; (b) relation; (c) tuple; (d) domain.

4. NULL in a database means… (a) zero; (b) empty string; (c) no value / unknown; (d) a deleted column.

5. A many-to-many relationship is typically implemented by… (a) extra columns in one table; (b) merging the tables; (c) a junction table holding both FKs; (d) NULLs for the missing side.

6. Which JOIN returns **all** records from both tables, filling NULLs where there is no match? (a) INNER; (b) LEFT; (c) RIGHT; (d) FULL OUTER.

7. Referential integrity ensures that… (a) data is stored sorted; (b) no duplicate PKs; (c) an FK value matches an existing PK or is NULL; (d) column names are globally unique.

8. `Enrollment(StudentID, CourseID, StudentName, Grade)` with PK {StudentID, CourseID}: which normal form does `StudentID → StudentName` violate, and what is the fix?

9. Write the complete SQL for lab steps 1–3 of Section 8.2 (database, table, three-row insert).

10. Lab step 5: what does the loans requirement add to the schema?

## Answer Key

1. **(b)** — data is raw and meaningless until processed with context (that processed form is information).

2. **(c)** — the FK stores another table's key value, creating the link that JOINs later follow.

3. **(b)** — relation; row = tuple, column = attribute.

4. **(c)** — NULL is the *absence* of a value; it is not 0 and not `""`, and is tested with `IS NULL`.

5. **(c)** — a junction (bridge) table with both PKs as FKs, composite PK, plus any relationship attributes (Rule 5).

6. **(d)** — FULL OUTER JOIN; INNER returns only matches, LEFT/RIGHT keep all rows of one side only.

7. **(c)** — the DBMS refuses orphaned foreign-key references.

8. **2NF** — `StudentName` depends on only *part* of the composite key (a partial dependency). Fix: decompose into `Students(StudentID PK, StudentName)` and `Enrollment(StudentID FK, CourseID FK, Grade)`.

9. ```sql
   CREATE DATABASE library_db;
   USE library_db;

   CREATE TABLE books (
     book_id        INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     title          VARCHAR(100) NOT NULL,
     author         VARCHAR(80)  NOT NULL,
     genre          VARCHAR(40),
     year_published INT
   );

   INSERT INTO books (title, author, genre, year_published)
   VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 1925),
          ('To Kill a Mockingbird', 'Harper Lee', 'Drama', 1960),
          ('Harry Potter', 'J.K. Rowling', 'Fantasy', 1997);
   ```
   Query answers for step 4: (a) `SELECT * FROM books;` (b) `SELECT title, author FROM books WHERE genre = 'Fantasy' ORDER BY year_published DESC;` (c) `SELECT genre, COUNT(*) FROM books GROUP BY genre;`

10. Members↔books borrowing is **M:N with relationship attributes**, so it adds a `members` table plus a junction table `loans(member_id FK, book_id FK, borrow_date, return_date)` — with a surrogate `loan_id` PK (or a composite key including the date, since the same member can re-borrow the same book later).
