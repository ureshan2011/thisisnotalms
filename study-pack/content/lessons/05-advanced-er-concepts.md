---
number: 5
title: Advanced ER Concepts
subtitle: Weak entities, identifying relationships, composite / multivalued / derived attributes, and total vs partial participation
objectives:
  - Recognise when an entity is weak and draw it with its identifying relationship and partial key
  - Distinguish simple, composite, multivalued and derived attributes and use the correct notation for each
  - Translate business-rule wording into total (mandatory) or partial (optional) participation constraints
  - Predict how each advanced construct maps to SQL tables, columns and constraints
  - Apply the complete Chen symbol set to unfamiliar scenarios
---

## 5.1 Weak entities and identifying relationships

Some entities cannot be identified by their own attributes alone. Room "101" means nothing by itself — Room 101 could exist in *every* building on campus. The room only becomes identifiable in the context of its building.

::: definition
A **weak entity** cannot be uniquely identified by its own attributes; it depends on a **strong (owner) entity** for both its identity and its existence. It is drawn as a **double rectangle**, and connects to its owner through an **identifying relationship**, drawn as a **double diamond**.
:::

![A weak entity and its identifying relationship: ROOM depends on BUILDING.](diagrams/weak-entity.svg)

The rules that always travel together:

- A double diamond must have a weak entity (double rectangle) on one side — **they always appear as a pair**.
- Cardinality is **1 (strong) : N (weak)** — one building has many rooms.
- The weak side always has **total participation** (double line): a room cannot exist without its building.
- The weak entity has only a **partial key** (dashed underline), e.g. RoomNo. Its full identity is the owner's key plus the partial key: `{BuildingID, RoomNo}`.

Classic weak-entity pairs to recognise: ROOM depends on BUILDING; ORDER_ITEM depends on ORDER; DEPENDENT (an insured family member) depends on EMPLOYEE.

## 5.2 Beyond simple attributes

Lesson 4 used only **simple attributes** — flat ellipses holding one indivisible value. Real designs need three more kinds.

![Composite, multivalued and derived attributes in Chen's notation, with their SQL consequences.](diagrams/attribute-types.svg)

### Composite attributes

::: definition
A **composite attribute** can be broken into smaller, individually meaningful **sub-attributes**. It is drawn as an ellipse with smaller ellipses branching off it. Example: `Address` = StreetName + City + PostCode; `Name` = FirstName + MiddleName + LastName.
:::

The decision test: **"Will I ever need to search, sort or filter by a *part* of this attribute?"** If you will query by City or sort by LastName, model the attribute as composite. In SQL, *only the leaf sub-attributes become columns* — a PERSON table gets `first_name`, `last_name`, `street_name`, `city`, `post_code`, and there is **no** `name` or `address` column at all.

### Multivalued attributes

::: definition
A **multivalued attribute** holds *more than one value* for a single entity instance — drawn as a **double ellipse**, written with braces: `{PhoneNumbers}`, `{Skills}`, `{Languages}`.
:::

Why not just add columns `Phone1`, `Phone2`, `Phone3`? Because you cannot know in advance how many values an instance will have — the double ellipse is an open-ended list. In SQL a multivalued attribute becomes a **separate table**: `CUSTOMER_PHONE(customer_id FK, phone_number)`.

### Derived attributes

::: definition
A **derived attribute** is *calculated* from other stored data and is never stored itself — drawn as a **dashed ellipse**, written in parentheses: `(Age)`.
:::

Examples: `(Age)` from DateOfBirth, `(TotalPrice)` from UnitPrice × Quantity, `(YearsOfService)` from HireDate.

::: warning
Storing derived data invites inconsistency: if DateOfBirth is corrected but a stored Age is not, the database contradicts itself. Compute derived values on demand — they are then always accurate.
:::

| Attribute type | Notation | Example | SQL consequence |
|---|---|---|---|
| Simple | Plain ellipse | DateOfBirth | Ordinary column |
| Composite | Ellipse with branching sub-ellipses | Address → Street, City, PostCode | Leaf parts become columns; parent never does |
| Multivalued | Double ellipse, `{braces}` | {PhoneNumber} | Separate table with FK |
| Derived | Dashed ellipse, `(parens)` | (Age) | Not stored — computed in queries/views |

## 5.3 Participation constraints

Cardinality says *how many*; participation says *whether joining is compulsory*.

::: definition
A **participation constraint** specifies whether **all** entities of a set must take part in a relationship (**total participation**, drawn as a **double line ══**) or only **some** need to (**partial participation**, the default **single line ──**).
:::

![Total vs partial participation: every employee must work in a department; only some employees manage one.](diagrams/participation.svg)

Participation is a *contract written in the business rules*. Learn to spot the wording:

| Constraint | Business-rule keywords | Examples | SQL consequence |
|---|---|---|---|
| **Total ══** | must · every · all · required · always | Every ORDER must belong to a CUSTOMER; every EMPLOYEE must work in a DEPARTMENT | Foreign key declared `NOT NULL` |
| **Partial ──** | may · can · optional · might · not required | Some CUSTOMERs have placed no ORDER yet; most EMPLOYEEs manage nothing | Foreign key column allows `NULL` |

::: tip
The same entity can have different participation in different relationships. EMPLOYEE participates **totally** in *works_in* (everyone has a department) but **partially** in *manages* (few employees manage one). Read each rule separately.
:::

## 5.4 The complete Chen symbol reference

You now know the full symbol set used in MBI802. Keep this table beside every exercise:

| Symbol | Element | Meaning |
|---|---|---|
| Rectangle | Entity | Real-world object or concept |
| Double rectangle | Weak entity | Cannot exist without its owner |
| Plain ellipse | Simple attribute | One indivisible value |
| Underlined ellipse | Key attribute | Unique identifier → primary key |
| Dashed-underline ellipse | Partial key | Weak entity's discriminator |
| Branching ellipses | Composite attribute | Made of queryable parts |
| Double ellipse | Multivalued attribute | Holds several values |
| Dashed ellipse | Derived attribute | Computed, never stored |
| Diamond | Relationship | Verb linking entities |
| Double diamond | Identifying relationship | Links weak entity to owner |
| Single line | Partial participation | Optional membership |
| Double line | Total participation | Mandatory membership |

## 5.5 Key concepts and terminology

<div class="key-concepts">

| Term | Definition |
|---|---|
| Weak entity | Entity identifiable only through its owner; double rectangle |
| Strong (owner) entity | The entity a weak entity depends on |
| Identifying relationship | Double diamond linking weak entity to owner; 1:N with total participation on the weak side |
| Partial key (discriminator) | Attribute that distinguishes weak instances *within one owner* (dashed underline) |
| Composite attribute | Attribute made of meaningful sub-attributes (Address → City…) |
| Multivalued attribute | Attribute holding several values; double ellipse; becomes its own table |
| Derived attribute | Computed value, never stored; dashed ellipse |
| Participation constraint | Whether membership in a relationship is mandatory (total ══) or optional (partial ──) |
| Total participation | Every instance must participate; FK becomes NOT NULL |
| Partial participation | Some instances may not participate; FK allows NULL |

</div>

## 5.6 Summary

::: summary End-of-topic summary
- A **weak entity** (double rectangle) cannot stand alone; its **identifying relationship** (double diamond) to the owner is always 1:N with **total participation** and the weak side carries only a **partial key** — full identity = owner key + partial key.
- **Composite** attributes branch into queryable parts (only the leaves become SQL columns); **multivalued** attributes (double ellipse) become a separate table; **derived** attributes (dashed ellipse) are computed, never stored.
- **Participation** encodes obligation: "must/every/all" → total (double line, NOT NULL FK); "may/can/optional" → partial (single line, nullable FK).
- The full Chen symbol set is twelve symbols — know each one's drawing, meaning and SQL consequence.
:::

## Practice Questions

1. **University buildings & rooms.** Each building has a building ID, name and location, plus *multiple contact phone numbers*. Each building has many rooms; a room number like "101" only makes sense within a specific building, and a room cannot exist without its building. Each room has a room number, a room type, a seating capacity, and a *utilisation rate calculated automatically from bookings*. Draw the full ER segment, choosing the correct notation for every element.

2. **Employees & dependants.** Each employee has an employee ID, name, hire date and date of birth. A dependant (family member covered by insurance) has only a name and a relationship type, and cannot exist without their employee — "Emma" only makes sense in the context of a specific employee. Employees may speak *multiple languages*, and each profile must display *years of service*, which must never be stored. Draw the diagram.

3. **Bookstore composites.** Each BOOK has BookId (key), Title, Price, and a publication address comprising Building, StreetName, City and Country. Each AUTHOR has AuthorId (key) and a full name with FirstName and LastName. Identify the composite attributes and describe the resulting SQL columns.

4. **University participation.** Business rules: (1) every LECTURER must teach at least one MODULE; (2) a MODULE may or may not currently be taught; (3) every MODULE must be assigned to exactly one DEPARTMENT; (4) a DEPARTMENT can exist with no MODULEs. Draw LECTURER–teaches–MODULE and MODULE–assigned_to–DEPARTMENT with the correct participation on each of the four line-ends.

5. **Quick fire.** For each item, name the notation: (a) `{EmailAddresses}`; (b) `(TotalPrice)`; (c) ORDER_ITEM within an ORDER; (d) Name split into First/Last; (e) "every order must belong to a customer".

## Answer Key

1. BUILDING is a strong entity with key <u>BuildingID</u>, simple attributes Name and Location, and **multivalued** {PhoneNumbers} (double ellipse). ROOM is a **weak entity** (double rectangle) with **partial key** RoomNo (dashed underline), simple attributes RoomType and Capacity, and **derived** (UtilisationRate) (dashed ellipse). They connect through the **identifying relationship** *has* (double diamond), cardinality 1:N, with a **double line (total participation)** on the ROOM side. Room identity = {BuildingID, RoomNo}.

2. EMPLOYEE: key <u>EmpID</u>; simple Name, HireDate, DateOfBirth; **multivalued** {Languages}; **derived** (YearsOfService) computed from HireDate. DEPENDANT is a **weak entity** with partial key DepName and attribute Relationship, joined by identifying relationship *has_dependant* (double diamond, 1:N, total participation on the DEPENDANT side). A dependant's full identity is {EmpID, DepName}.

3. Composites: BOOK's **PublicationAddress** (sub-attributes Building, StreetName, City, Country) and AUTHOR's **Name** (FirstName, LastName). Title, Price, BookId, AuthorId are simple. SQL: BOOK(book_id, title, price, building, street_name, city, country) and AUTHOR(author_id, first_name, last_name) — the composite parents never become columns.

4. *teaches*: LECTURER side **double line** (rule 1 — every lecturer must teach), MODULE side **single line** (rule 2 — a module may be untaught). *assigned_to*: MODULE side **double line** (rule 3 — every module must belong to a department), DEPARTMENT side **single line** (rule 4 — a department may have no modules).

5. (a) multivalued attribute — double ellipse; (b) derived attribute — dashed ellipse; (c) weak entity with identifying relationship to ORDER; (d) composite attribute with two sub-attributes; (e) total participation — double line from ORDER to the *places* relationship (FK NOT NULL).
