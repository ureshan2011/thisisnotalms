---
number: 2
title: SQL Programming Fundamentals
subtitle: The language of relational databases — data types, CREATE, INSERT and your first SELECT queries in MySQL
objectives:
  - Explain what SQL is and how MySQL executes it
  - Select appropriate data types (INT, VARCHAR, DATE, DECIMAL, BOOLEAN) for attributes
  - Write DDL statements — CREATE DATABASE and CREATE TABLE with a primary key
  - Insert records with INSERT INTO, both single and multiple rows
  - Retrieve data with SELECT, choosing columns and using aliases
---

## 2.1 What is SQL?

::: definition
**SQL (Structured Query Language)** is the standard language for talking to relational databases: creating structures (`CREATE`), adding and reading data (`INSERT`, `SELECT`), and modifying or removing it (`UPDATE`, `DELETE`).
:::

**MySQL** is a *database server* that understands SQL — the world's most popular open-source database, used by Facebook, YouTube and thousands of other applications. Your SQL statements travel to the server, which manages storage, enforces keys and constraints, and sends results back.

![How SQL connects your application to the data.](diagrams/sql-overview.svg)

::: tip
SQL is **not case-sensitive** — `SELECT`, `select` and `Select` all work. Writing keywords in UPPERCASE is nonetheless standard practice: it makes the structure of a query instantly visible. Every statement ends with a semicolon `;`.
:::

## 2.2 MySQL data types

Every column must declare a **data type** — it tells MySQL what kind of value to expect and how to store it.

| Category | Type | Holds | Example |
|---|---|---|---|
| Numbers | `INT` | Whole numbers | `1`, `25`, `1000` |
| | `BIGINT` | Very large whole numbers | `9,223,372,036…` |
| | `DECIMAL(p,s)` / `FLOAT` | Decimal numbers | `3.14`, `99.99` |
| Text | `VARCHAR(n)` | Text up to *n* characters | `'Alice'` |
| | `CHAR(n)` | Fixed-length text | country code `'NZ'` |
| | `TEXT` | Long text, no set limit | a blog post |
| Time | `DATE` | Calendar date | `'2026-03-01'` |
| | `DATETIME` | Date + time | `'2026-03-01 09:30:00'` |
| Logic | `BOOLEAN` | True / false (1 / 0) | `is_active = TRUE` |

::: tip
`DECIMAL(3,2)` means *3 digits in total, 2 after the decimal point* — perfect for a GPA like `3.75`. Use `DECIMAL` (exact) rather than `FLOAT` (approximate) for money and grades.
:::

## 2.3 Creating databases and tables

Creating structure is **DDL — Data Definition Language**. Two steps every project starts with:

```sql
-- Step 1: create and select the database
CREATE DATABASE school_db;
USE school_db;

-- Step 2: create a table
CREATE TABLE students (
  id     INT PRIMARY KEY,
  name   VARCHAR(100),
  age    INT,
  email  VARCHAR(150),
  gpa    DECIMAL(3,2)
);
```

Key ideas in that statement:

- **`PRIMARY KEY`** — the unique identifier for each row; no two rows may share a value, and it cannot be NULL.
- Each column pairs a **name** with a **data type** (and optional constraints such as `NOT NULL`).
- The result is an empty table: five columns, zero rows.

::: example Worked Example — a client scenario
*You have been hired by the City Public Library to build their book-tracking database.* A realistic table adds `NOT NULL` for required fields and `AUTO_INCREMENT` so MySQL numbers the rows for you:

```sql
CREATE DATABASE library_db;
USE library_db;

CREATE TABLE books (
  book_id        INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(100) NOT NULL,
  author         VARCHAR(80)  NOT NULL,
  genre          VARCHAR(40),
  year_published INT
);
```

`AUTO_INCREMENT` means you never insert `book_id` yourself — MySQL assigns 1, 2, 3… automatically.
:::

## 2.4 Inserting data — INSERT INTO

```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```

The anatomy: **`INSERT INTO`** names the table, the **(columns)** list says which columns you are filling, and **`VALUES`** supplies the data — *in the same order as the column list*. Text and dates take single quotes; numbers do not.

```sql
-- insert three students in one statement
INSERT INTO students (id, name, age, email, gpa)
VALUES
  (1, 'Alice', 20, 'alice@uni.edu', 3.80),
  (2, 'Bob',   22, 'bob@uni.edu',   3.50),
  (3, 'Carol', 21, 'carol@uni.edu', 3.90);
```

::: warning
Because `id` is the PRIMARY KEY (and not auto-increment here), you **must** supply it, and it must be unique — inserting a second row with `id = 1` fails with a duplicate-key error. Mismatching the column list and the value order is the most common beginner INSERT bug.
:::

## 2.5 Reading data — SELECT

`SELECT` is the query workhorse; you will use it more than every other statement combined.

```sql
-- all columns
SELECT * FROM students;

-- specific columns only
SELECT name, gpa FROM students;

-- with column aliases for nicer report headings
SELECT name AS 'Student Name',
       gpa  AS 'Grade Point'
FROM   students;
```

`SELECT *` returns every column; naming columns returns just those, in the order you list them:

| `SELECT * FROM students;` |
|---|

| id | name | age | email | gpa |
|---|---|---|---|---|
| 1 | Alice | 20 | alice@uni.edu | 3.80 |
| 2 | Bob | 22 | bob@uni.edu | 3.50 |
| 3 | Carol | 21 | carol@uni.edu | 3.90 |

::: tip
Use `SELECT *` while exploring a table interactively; in real applications always name the columns you need — the query is faster, and it keeps working even if new columns are added later.
:::

## 2.6 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| SQL | Structured Query Language — the standard language of relational databases |
| MySQL | A popular open-source database server that executes SQL |
| DDL | Data Definition Language — statements that create/alter structure (CREATE) |
| DML | Data Manipulation Language — statements that work with data (INSERT, SELECT, UPDATE, DELETE) |
| Data type | The kind of value a column stores (INT, VARCHAR, DATE…) |
| PRIMARY KEY | Column(s) uniquely identifying each row; never NULL, never duplicated |
| AUTO_INCREMENT | MySQL assigns the next number automatically on insert |
| NOT NULL | Constraint: a value is required in this column |
| Alias (AS) | A temporary display name for a column or table in a query |

</div>

## 2.7 Summary

::: summary End-of-topic summary
- SQL is the one language for **defining** structure (DDL: `CREATE DATABASE`, `CREATE TABLE`) and **manipulating** data (DML: `INSERT`, `SELECT`, later `UPDATE`/`DELETE`).
- Choose types deliberately: `INT` for counts and ids, `DECIMAL` for exact money/grades, `VARCHAR(n)` for names, `DATE`/`DATETIME` for time, `BOOLEAN` for flags.
- Every table needs a **PRIMARY KEY**; `AUTO_INCREMENT` lets MySQL generate it.
- `INSERT INTO t (cols) VALUES (…)` — column list and value order must match; strings and dates in single quotes.
- `SELECT columns FROM table` reads data; `*` for exploration, named columns for real code, `AS` for readable headings.
:::

## Practice Questions

1. Choose the best data type for each attribute of a gym-membership system: (a) member's full name; (b) monthly fee (e.g. 49.90); (c) join date; (d) is the membership active?; (e) number of visits this year.

2. *Sunrise Academy* needs a `students` table in a database `school_db` with an auto-numbered student id, a required full name (up to 100 characters), an enrolment date, and a year level (whole number). Write both `CREATE` statements.

3. Write one `INSERT` statement that adds these two books to the library `books` table (columns: title, author, genre, year_published — book_id is auto-increment): *The Great Gatsby* / F. Scott Fitzgerald / Classic / 1925, and *Harry Potter* / J.K. Rowling / Fantasy / 1997.

4. From the `students` table, write queries to: (a) show everything; (b) show only names and emails; (c) show names and GPAs with the headings "Student" and "GPA".

5. Explain why this statement fails: `INSERT INTO students (id, name) VALUES ('Alice', 1);`

## Answer Key

1. (a) `VARCHAR(100)`; (b) `DECIMAL(5,2)` — exact for money; (c) `DATE`; (d) `BOOLEAN`; (e) `INT`.

2. ```sql
   CREATE DATABASE school_db;
   USE school_db;
   CREATE TABLE students (
     student_id     INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     full_name      VARCHAR(100) NOT NULL,
     enrolment_date DATE,
     year_level     INT
   );
   ```

3. ```sql
   INSERT INTO books (title, author, genre, year_published)
   VALUES
     ('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 1925),
     ('Harry Potter', 'J.K. Rowling', 'Fantasy', 1997);
   ```

4. (a) `SELECT * FROM students;` (b) `SELECT name, email FROM students;` (c) `SELECT name AS 'Student', gpa AS 'GPA' FROM students;`

5. The values are in the wrong order for the column list: `id` receives the string `'Alice'` (a type mismatch for INT) and `name` receives `1`. The column list and VALUES must correspond position by position: `VALUES (1, 'Alice')`.
