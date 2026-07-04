---
maxPages: 2
---

## Weak entities

- **Weak entity** = cannot be identified alone → **double rectangle**.
- Linked to its **owner** by an **identifying relationship** → **double diamond**. They always appear as a pair.
- Cardinality **1 (strong) : N (weak)**; weak side always **total participation** (double line).
- Weak entity has a **partial key** (dashed underline); full key = owner key + partial key, e.g. `{BuildingID, RoomNo}`.
- Classics: ROOM–BUILDING · ORDER_ITEM–ORDER · DEPENDANT–EMPLOYEE.

## Attribute types

| Type | Notation | SQL result |
|---|---|---|
| Simple | plain ellipse | ordinary column |
| **Composite** | branching sub-ellipses | leaf parts become columns; parent never does |
| **Multivalued** `{…}` | double ellipse | separate table with FK |
| **Derived** `(…)` | dashed ellipse | never stored — computed on demand |

- Composite test: *"will I search/sort by a part of it?"* (City, LastName → yes).
- Multivalued: unknown count → own table `CUSTOMER_PHONE(cust_id, phone)`.
- Derived: storing it risks inconsistency — compute `(Age)` from DateOfBirth.

## Participation constraints

| Constraint | Line | Keywords | SQL |
|---|---|---|---|
| **Total** (mandatory) | double ══ | must · every · all · required | FK `NOT NULL` |
| **Partial** (optional) | single ── | may · can · optional · might | FK nullable |

::: tip
Same entity, different rules: EMPLOYEE is **total** in *works_in* but **partial** in *manages*. Judge every line-end separately.
:::

## Symbol quick reference

- Rectangle entity · **double rectangle** weak entity
- Ellipse attribute · **underlined** key · **dashed-underline** partial key
- **Branching** composite · **double ellipse** multivalued · **dashed ellipse** derived
- Diamond relationship · **double diamond** identifying
- Single line partial · **double line** total participation
