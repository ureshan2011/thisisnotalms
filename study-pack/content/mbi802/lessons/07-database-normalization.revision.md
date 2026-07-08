---
maxPages: 2
---

## The three anomalies

| Anomaly | Symptom |
|---|---|
| **Update** | Same fact in many rows — change it everywhere or contradict yourself |
| **Insertion** | Can't record a fact until an unrelated fact exists |
| **Deletion** | Removing one fact silently erases another |

## Functional dependencies

**X → Y** — knowing X uniquely determines Y.

- **Determinant** = left side · **Dependent** = right side
- **Candidate key** — minimal set determining *all* attributes
- **Prime attribute** — belongs to some candidate key
- **Superkey** — any set that determines all attributes

FDs come from **business rules**, not sample data.

## The four normal forms

| Form | Rule (adds to previous) | Violation give-away |
|---|---|---|
| **1NF** | Atomic cells; PK exists; no repeating groups | Lists in a cell ("Chess, Drama") |
| **2NF** | No partial dependency on a *composite* key | Column depends on only part of the key |
| **3NF** | No transitive dependency | Non-key column depends on another non-key column; values repeat *in pairs* |
| **BCNF** | Every determinant is a superkey | FD whose left side isn't a key (overlapping candidate keys) |

::: tip
"**The key** (1NF), **the whole key** (2NF), **and nothing but the key** (3NF)."
:::

Single-column primary key ⇒ 2NF is automatic.

## Decomposition recipe

1. Find violating FD X → Y (X not a superkey / part of key).
2. New table (X ∪ Y), X becomes its PK.
3. Remove Y from the original; X stays as FK.
4. Repeat until every determinant is a superkey.

**Must be lossless-join** (rejoin = original, no spurious rows).

::: warning
BCNF is always lossless but can **lose dependency preservation**. 3NF guarantees both — the practical target in real systems.
:::

## Exam checklist for any table

1. Identify the key.
2. Lists in cells? → fix 1NF (one value per cell, one fact per row).
3. Composite key? → check each non-key column needs the *whole* key.
4. Chains (key → B → C)? → split the chain.
5. Every determinant a superkey? → else BCNF decomposition.
6. Already clean? **Say so and stop** — over-splitting adds join cost.

## Classic patterns to recognise

- `Order_Items(OrderID, ProductID, ProductName, Qty)` → ProductName is **partial** → split Products out.
- `Employees(EmpID, …, DeptID, DeptName)` → DeptName is **transitive** → split Departments out.
- `Advising(Student, Advisor, Dept)` with `Advisor → Dept` → **3NF but not BCNF**.
- `Movies(MovieID, Title, "Actor1, Actor2")` → **not 1NF**.
