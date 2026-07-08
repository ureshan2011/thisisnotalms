---
maxPages: 2
---

## WHERE — filtering

`= != > < >= <=` · combine with `AND` / `OR` · text search `LIKE 'A%'`, `LIKE '%data%'`.

```sql
SELECT * FROM students
WHERE age > 20 AND gpa >= 3.70;
```

## ORDER BY + LIMIT

```sql
SELECT * FROM students
WHERE age > 20
ORDER BY gpa DESC
LIMIT 10;          -- top-N leaderboard
```

`ASC` default (A→Z, 1→9); `DESC` reverses. Order: WHERE → ORDER BY → LIMIT.

## UPDATE & DELETE — the danger pair

```sql
UPDATE students SET gpa = 3.75 WHERE id = 2;
DELETE FROM students WHERE id = 2;
```

::: warning
No `WHERE` ⇒ **every row** changes/disappears. `WHERE 1=1` is the same as no WHERE. Habit: **SELECT first, then UPDATE/DELETE** with the same condition.
:::

`TRUNCATE TABLE t` = instant full wipe + AUTO_INCREMENT reset.

## Aggregates

| Fn | Gives |
|---|---|
| `COUNT(*)` | row count |
| `SUM` / `AVG` | total / mean |
| `MAX` / `MIN` | extremes |

```sql
SELECT genre, COUNT(*) AS total
FROM books
GROUP BY genre
HAVING COUNT(*) >= 5;
```

**WHERE** filters rows *before* grouping · **HAVING** filters groups *after* (use it for aggregate conditions).

## INNER JOIN

```sql
SELECT s.name, g.score
FROM students AS s
INNER JOIN grades AS g
  ON s.id = g.student_id;
```

Returns **only matching rows** from both tables. Aliases (`AS s`) keep it readable; qualify columns as `s.name`.
