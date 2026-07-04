---
maxPages: 2
---

## The whole course in one pipeline

**Scenario → ER diagram (L4–5) → 8 mapping rules (L6) → normal forms (L7) → CREATE/INSERT (L2) → queries (L3)**

The connecting thread: an **M:N relationship** becomes a **junction table** (Rule 5), whose **composite key** is what 2NF inspects, and which **INNER JOIN** reassembles at query time.

## One-line lesson summaries

| L | Essence |
|---|---|
| 1 | Information = data + context; DBMS beats files on redundancy, consistency, security, concurrency, integrity |
| 2 | Types matter; `CREATE TABLE` with PK; `INSERT` column↔value order; `SELECT` columns/aliases |
| 3 | `WHERE` filters; `ORDER BY…LIMIT` ranks; UPDATE/DELETE **always with WHERE**; aggregates + `GROUP BY…HAVING`; `INNER JOIN…ON` |
| 4 | Rectangle/ellipse/underline/diamond; cardinality both directions; Grade lives on the diamond |
| 5 | Weak entity + double diamond; composite/multivalued/derived attrs; total ══ vs partial ── |
| 6 | 8 rules; FK on the N side; junction for M:N; composite PK for weak; never store derived |
| 7 | FDs; 1NF atomic → 2NF whole key → 3NF nothing but the key → BCNF determinants are superkeys |

## Exam checklists

**Normalization question:** key? → lists in cells? → partial deps? → transitive chains? → determinants superkeys? → decompose, or say "already 3NF".

**Mapping question:** table count = entities + weak + multivalued + M:N.

**SQL question:** clause order `SELECT → FROM → JOIN/ON → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT`.

**MCQ technique:** eliminate two, distrust "always/never", check the option answers *the question asked*.

## Final assessment facts

38 questions · pass mark 60% · categories: data vs information, relational basics, real-world scenarios, tricky questions.

## After the course

Oracle MySQL certs · Azure DP-900 · AWS database track · MongoDB University · daily practice on SQLBolt / HackerRank SQL.
