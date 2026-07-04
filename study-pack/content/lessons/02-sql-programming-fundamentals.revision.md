---
maxPages: 2
---

## SQL in one box

**SQL** = the language · **MySQL** = the server that runs it.
DDL creates structure (`CREATE`); DML works with data (`INSERT`, `SELECT`, `UPDATE`, `DELETE`).
Keywords UPPERCASE by convention (not required); statements end with `;`.

## Data types cheat sheet

| Need | Use |
|---|---|
| Whole numbers / ids | `INT` (`BIGINT` if huge) |
| Money, GPA (exact) | `DECIMAL(p,s)` — e.g. `DECIMAL(3,2)` → 3.75 |
| Names, emails | `VARCHAR(n)` |
| Fixed codes | `CHAR(n)` |
| Long text | `TEXT` |
| Date / timestamp | `DATE` / `DATETIME` |
| Flags | `BOOLEAN` (1/0) |

## CREATE

```sql
CREATE DATABASE school_db;
USE school_db;

CREATE TABLE students (
  id    INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  gpa   DECIMAL(3,2)
);
```

- **PRIMARY KEY**: unique, never NULL.
- **AUTO_INCREMENT**: MySQL numbers rows — don't insert it yourself.
- **NOT NULL**: value required.

## INSERT

```sql
INSERT INTO students (name, gpa)
VALUES ('Alice', 3.80),
       ('Bob',   3.50);
```

Column list ↔ VALUES order must match. Quotes around text and dates, none around numbers. Duplicate PK ⇒ error.

## SELECT

```sql
SELECT * FROM students;              -- everything
SELECT name, gpa FROM students;      -- chosen columns
SELECT name AS 'Student' FROM students;  -- alias heading
```

::: tip
`SELECT *` for exploring; named columns in real apps (faster, stable).
:::
