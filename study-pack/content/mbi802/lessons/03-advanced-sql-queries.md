---
number: 3
title: Advanced SQL Queries
subtitle: Filtering, sorting, safe updates and deletes, aggregate functions and your first JOIN
objectives:
  - Filter rows with WHERE using comparison and logical operators, and search text with LIKE
  - Sort and limit results with ORDER BY and LIMIT
  - Modify and remove records safely — UPDATE and DELETE always scoped by WHERE
  - Summarise data with COUNT, SUM, AVG, MAX, MIN and GROUP BY … HAVING
  - Combine two related tables with INNER JOIN
---

## 3.1 Filtering rows — WHERE

`WHERE` keeps only the rows that satisfy a condition:

```sql
SELECT columns FROM table WHERE condition;

-- students older than 20
SELECT * FROM students WHERE age > 20;

-- one specific student
SELECT * FROM students WHERE name = 'Alice';

-- multiple conditions
SELECT * FROM students WHERE age > 20 AND gpa >= 3.70;
```

| Operator | Meaning | | Operator | Meaning |
|---|---|---|---|---|
| `=` | equal to | | `>=` | greater or equal |
| `!=` | not equal | | `<=` | less or equal |
| `>` | greater than | | `AND` | both conditions true |
| `<` | less than | | `OR` | either condition true |

::: tip
Search inside text with **`LIKE`** and the `%` wildcard: `WHERE name LIKE 'A%'` finds names starting with A; `WHERE title LIKE '%data%'` finds "data" anywhere in the title.
:::

## 3.2 Sorting and limiting — ORDER BY and LIMIT

```sql
-- highest GPA first
SELECT * FROM students ORDER BY gpa DESC;

-- alphabetical
SELECT * FROM students ORDER BY name ASC;

-- filter + sort + top 10 (a leaderboard)
SELECT * FROM students
WHERE  age > 20
ORDER  BY gpa DESC
LIMIT  10;
```

**`ASC`** (the default) sorts smallest → largest, A → C; **`DESC`** sorts largest → smallest. `LIMIT n` returns only the first *n* rows of the sorted result. Clause order matters: `WHERE` → `ORDER BY` → `LIMIT`.

## 3.3 Changing data — UPDATE

```sql
UPDATE table SET column = new_value WHERE condition;

-- Bob improved his grade
UPDATE students SET gpa = 3.75 WHERE id = 2;

-- several columns at once
UPDATE students
SET    age = 23, email = 'bob.new@uni.edu'
WHERE  id = 2;
```

## 3.4 Removing data — DELETE

```sql
DELETE FROM table WHERE condition;

-- remove one student
DELETE FROM students WHERE id = 2;
```

| Statement | Effect |
|---|---|
| `DELETE FROM t WHERE …` | Removes only the matching rows |
| `DELETE FROM t` | Removes **all** rows, one by one (slow) |
| `TRUNCATE TABLE t` | Wipes all rows instantly and resets AUTO_INCREMENT |

## 3.5 The WHERE clause is your safety net

`UPDATE` and `DELETE` are the two statements that can destroy data, and both apply to **every row in the table** if you omit `WHERE`.

::: warning
**Never run UPDATE or DELETE without a WHERE clause** (unless you truly mean the whole table). Classic disasters:

- `UPDATE products SET price = 9.99;` — every product is now $9.99.
- `DELETE FROM students;` — the entire table is emptied.
- `UPDATE users SET role = 'admin' WHERE 1 = 1;` — the condition is *always true*, so every user just became an admin.

The professional habit: **SELECT first, then act.** Run `SELECT * FROM t WHERE <condition>` to see exactly which rows match; only when the preview is right do you swap in `UPDATE`/`DELETE`.
:::

::: example Worked Example — safe or dangerous?
Classify each statement before reading the verdicts:

1. `DELETE FROM students;` → **dangerous** — no WHERE; wipes every student.
2. `UPDATE accounts SET balance = 0 WHERE id = 42;` → **safe** — targets exactly one row.
3. `DELETE FROM orders WHERE status = 'cancelled';` → **safe** — scoped to cancelled orders only.
4. `UPDATE users SET role = 'admin' WHERE 1 = 1;` → **dangerous** — a tautology is the same as no WHERE at all.
:::

## 3.6 Aggregate functions and GROUP BY

Aggregates calculate **across many rows** and return a single value:

```sql
SELECT COUNT(*) FROM students;          -- how many rows → 3
SELECT AVG(gpa)  FROM students;          -- average → 3.73
SELECT MAX(gpa), MIN(gpa) FROM students; -- extremes → 3.90, 3.50
SELECT SUM(credits) FROM enrolment;      -- total
```

| Function | Returns |
|---|---|
| `COUNT(*)` | Number of rows |
| `SUM(col)` | Total of a numeric column |
| `AVG(col)` | Average value |
| `MAX(col)` / `MIN(col)` | Largest / smallest value |

**`GROUP BY`** splits the rows into groups and runs the aggregate *per group*; **`HAVING`** then filters the groups (it is the WHERE of the grouped world):

```sql
-- students per age
SELECT age, COUNT(*) AS total
FROM   students
GROUP  BY age;

-- only ages with more than one student
SELECT age, COUNT(*) AS total
FROM   students
GROUP  BY age
HAVING COUNT(*) > 1;
```

::: tip
`WHERE` filters **rows before** grouping; `HAVING` filters **groups after** aggregation. If your condition mentions an aggregate (`COUNT`, `AVG`…), it belongs in `HAVING`.
:::

## 3.7 Combining tables — INNER JOIN

Related data lives in separate tables (that was the whole point of Lessons 6–7). `JOIN` brings it back together at query time.

![How INNER JOIN pairs rows from two tables through the ON condition.](diagrams/inner-join.svg)

```sql
SELECT s.name, g.score
FROM   students AS s
INNER JOIN grades AS g
       ON s.id = g.student_id;
```

Reading it: take `students` (alias `s`), pair each row with the `grades` rows (alias `g`) whose `student_id` matches `s.id`, and return the combined columns. **INNER JOIN returns only rows that match in both tables** — a student with no grade, or a grade with no student, is omitted.

## 3.8 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| WHERE | Clause filtering rows by a condition |
| LIKE / % | Text pattern matching; % matches any sequence of characters |
| ORDER BY … ASC/DESC | Sorts the result set ascending/descending |
| LIMIT | Caps the number of rows returned |
| UPDATE … SET | Changes column values in matching rows |
| DELETE / TRUNCATE | Row removal (scoped) vs instant full-table wipe |
| Aggregate function | COUNT/SUM/AVG/MAX/MIN — one value from many rows |
| GROUP BY | Runs aggregates per group of equal values |
| HAVING | Filters groups after aggregation |
| INNER JOIN … ON | Combines rows of two tables where the ON condition matches |
| Table alias | Short name (`students AS s`) used to qualify columns |

</div>

## 3.9 Summary

::: summary End-of-topic summary
- `WHERE` filters with `= != > < >= <=`, combined by `AND`/`OR`; `LIKE '%x%'` searches text.
- `ORDER BY col DESC LIMIT n` = instant leaderboard; clause order is WHERE → ORDER BY → LIMIT.
- `UPDATE`/`DELETE` **always with WHERE** — preview the rows with a SELECT first. `WHERE 1=1` is no protection at all.
- Aggregates summarise rows; `GROUP BY` makes them per-group; `HAVING` filters the groups.
- `INNER JOIN … ON` recombines normalized tables and returns only matching rows.
:::

## Practice Questions

Use `books(book_id, title, author, genre, year_published)` and, for Q6–7, `members(member_id, name)` with `loans(loan_id, member_id, book_id, due_date)`.

1. List all Fantasy books published after 1990, newest first.

2. Show the three most recent books (title and year only).

3. The library recatalogued: change the genre of book 12 to `'Classic'`. Then write the *preview* query you would run first.

4. Which of these is safe to run, and what does each do? (a) `DELETE FROM loans WHERE due_date < '2025-01-01';` (b) `UPDATE books SET genre = 'Unknown';`

5. How many books exist per genre — but show only genres with at least 5 books?

6. List each member's name beside the titles they currently have on loan.

7. Explain the difference between `WHERE` and `HAVING` in one sentence each.

## Answer Key

1. ```sql
   SELECT * FROM books
   WHERE  genre = 'Fantasy' AND year_published > 1990
   ORDER  BY year_published DESC;
   ```

2. ```sql
   SELECT title, year_published FROM books
   ORDER  BY year_published DESC
   LIMIT  3;
   ```

3. ```sql
   -- preview first:
   SELECT * FROM books WHERE book_id = 12;
   -- then act:
   UPDATE books SET genre = 'Classic' WHERE book_id = 12;
   ```

4. (a) **Safe** — scoped by WHERE; it removes only loans due before 2025. (b) **Dangerous** — no WHERE, so *every* book's genre becomes 'Unknown'.

5. ```sql
   SELECT genre, COUNT(*) AS total
   FROM   books
   GROUP  BY genre
   HAVING COUNT(*) >= 5;
   ```

6. ```sql
   SELECT m.name, b.title
   FROM   members AS m
   INNER JOIN loans AS l ON m.member_id = l.member_id
   INNER JOIN books AS b ON l.book_id  = b.book_id;
   ```

7. `WHERE` filters individual **rows before** any grouping happens; `HAVING` filters whole **groups after** the aggregate has been computed.
