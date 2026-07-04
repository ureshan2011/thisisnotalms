---
maxPages: 2
---

## Data vs information

- **Data** = raw facts, no meaning: `85`, `"Auckland"`, `42`.
- **Information** = data + **context + processing**: "John scored 85% in MBI802, Sem 1."
- Quality information: **accurate · complete · timely · relevant**.

## File-based systems vs DBMS

| File/spreadsheet problem | DBMS fix |
|---|---|
| Redundancy (re-typed copies) | One shared store |
| Inconsistency (stale copies) | Central updates + constraints |
| No access control | Per-user permissions |
| Simultaneous edits collide | Concurrency control |
| No validation | Integrity rules + types |

DBMS families: **Relational** (MySQL, PostgreSQL, Oracle — this course), NoSQL (MongoDB), NewSQL.

## Relational vocabulary

| Everyday | Formal |
|---|---|
| Table | **Relation** |
| Row / record | **Tuple** |
| Column / field | **Attribute** |

- **Primary key** — uniquely identifies each row; never NULL/duplicate.
- **Foreign key** — references another table's PK; links tables.
- **Referential integrity** — FK must match an existing PK (or be NULL).
- **NULL** — unknown/absent; *not* 0, *not* `""` (test with `IS NULL`).
- **Composite key** — two+ columns together identify a row.
- **Schema** — the design: tables, columns, types, keys.

## MySQL setup

1. Install **MySQL Community Server** (port 3306, remember the root password!).
2. Install **MySQL Workbench**; connect to `localhost:3306`.
3. Verify:

```sql
SHOW DATABASES;
```

Expect `information_schema`, `mysql`, `performance_schema`…
