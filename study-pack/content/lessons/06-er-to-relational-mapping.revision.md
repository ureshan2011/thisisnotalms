---
maxPages: 2
---

## The 8 mapping rules

| # | Construct | Rule |
|---|---|---|
| 1 | Strong entity | → table; key attr → **PK**; simple attrs → columns |
| 2 | Composite attribute | → **flatten**: leaf sub-attrs become columns; parent never stored |
| 3 | Multivalued attribute | → **new table**: owner PK as FK + value; composite PK |
| 4 | 1:N relationship | → **FK on the N side** (many side points to its one owner) |
| 5 | M:N relationship | → **junction table**: both PKs as FKs; relationship attrs live here |
| 6 | 1:1 relationship | → FK in **either** table; prefer the total-participation side (or merge) |
| 7 | Weak entity | → table with **composite PK** = owner PK (FK) + partial key |
| 8 | Derived attribute | → **do not store**; compute at query time |

## Table count check

tables = strong entities + weak entities + multivalued attributes + M:N relationships

## Canonical snippets

```sql
-- Rule 3: multivalued
employee_skill(emp_id FK, skill,
  PRIMARY KEY (emp_id, skill))

-- Rule 5: M:N junction
enrolment(student_id FK, module_code FK, grade,
  PRIMARY KEY (student_id, module_code))

-- Rule 7: weak entity
room(building_id FK, room_no,
  PRIMARY KEY (building_id, room_no))
```

## Placement memory hooks

- **FK → MANY side** (Rule 4). `order.customer_id`, `module.dept_id`.
- **Grade goes in the junction** — a relationship attribute belongs to the pair.
- **1:1** → FK on the side that *must* participate; add `NOT NULL` + `UNIQUE`.
- Total participation → FK `NOT NULL`; partial → nullable.

## The four classic mistakes

| ❌ | ✅ |
|---|---|
| `age INT` stored | store `date_of_birth`, compute age |
| `address VARCHAR(200)` | `street_name`, `city`, `post_code` |
| M:N via a single FK | junction table, always |
| FK on the "1" side | FK on the **N** side |
