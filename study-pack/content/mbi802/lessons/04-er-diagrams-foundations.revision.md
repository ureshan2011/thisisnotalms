---
maxPages: 2
---

## The four Chen shapes

| Shape | Element | Becomes |
|---|---|---|
| **Rectangle** | Entity — a real-world *noun* (STUDENT) | Table |
| **Ellipse** | Attribute — a property (Name) | Column |
| **Underlined ellipse** | Key attribute (StudentID) | Primary key |
| **Diamond** | Relationship — a *verb* (enrolls) | FK or junction table |

Entity = noun · Relationship = verb. No floating shapes — everything connects with lines.

## Cardinality

| Type | Rule | Classic example |
|---|---|---|
| **1:1** | One ↔ one | Employee–Passport |
| **1:N** | One → many; each "many" has one owner | Teacher–Courses |
| **M:N** | Many ↔ many | Students–Courses |

::: warning
Check **both directions**: "how many Bs per A?" *and* "how many As per B?". One-directional thinking turns M:N into 1:N by mistake.
:::

## Five drawing steps

1. Entities (nouns)
2. Attributes of each
3. Underline the key
4. Relationships (verbs)
5. Cardinality on every line — both directions

Then **read the diagram back** as sentences and compare with the scenario.

## Relationship attributes

An attribute that describes a **pair** goes on the **diamond**, not an entity:
Grade → *enrolls*; BorrowDate/ReturnDate → *borrows*; Quantity → *contains*.

## Mapping preview (Lesson 6)

- Entity → table; attribute → column; key → PK.
- **1:N** → foreign key on the N side.
- **M:N** → separate **junction table** (e.g. `ENROLLMENT(StudentID, CourseID, Grade)`).

## Scenario patterns to recognise

- "…over time / many different…" both ways → **M:N** with event dates on the diamond.
- "each X belongs to exactly one Y" → **1:N** (N on the X side).
- Two IDs plus data about the pair → junction-table shape.
