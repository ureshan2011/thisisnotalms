<div class="glossary-intro">

Terms are grouped by theme. A number in brackets shows the lesson where the term is introduced.

</div>

## Foundations

<dl>
<dt>Data [1]</dt><dd>Raw, unprocessed facts and figures with no inherent meaning — <code>85</code>, <code>"Auckland"</code>.</dd>
<dt>Information [1]</dt><dd>Data given context and processing so it becomes meaningful and decision-ready.</dd>
<dt>DBMS [1]</dt><dd>Database Management System — software that stores, secures and manages shared data, solving the redundancy, consistency, security, concurrency and integrity problems of file-based systems.</dd>
<dt>RDBMS [1]</dt><dd>Relational DBMS (MySQL, PostgreSQL, Oracle) — manages data as related tables.</dd>
<dt>Relation / tuple / attribute [1]</dt><dd>The formal names for table, row and column.</dd>
<dt>Primary key (PK) [1]</dt><dd>Column(s) that uniquely identify each row; never NULL, never duplicated.</dd>
<dt>Foreign key (FK) [1]</dt><dd>A column referencing another table's primary key, linking the two.</dd>
<dt>Referential integrity [1]</dt><dd>The guarantee that every FK value matches an existing PK (or is NULL).</dd>
<dt>NULL [1]</dt><dd>The absence of a value — not zero, not an empty string; tested with <code>IS NULL</code>.</dd>
<dt>Schema [1]</dt><dd>The database's design: its tables, columns, data types and keys.</dd>
</dl>

## SQL

<dl>
<dt>SQL [2]</dt><dd>Structured Query Language — the standard language of relational databases.</dd>
<dt>DDL / DML [2]</dt><dd>Data Definition Language (CREATE…) defines structure; Data Manipulation Language (INSERT, SELECT, UPDATE, DELETE) works with data.</dd>
<dt>Data type [2]</dt><dd>What a column stores: INT, DECIMAL(p,s), VARCHAR(n), CHAR(n), TEXT, DATE, DATETIME, BOOLEAN.</dd>
<dt>AUTO_INCREMENT [2]</dt><dd>MySQL assigns the next integer key automatically on insert.</dd>
<dt>NOT NULL [2]</dt><dd>Constraint requiring a value in the column.</dd>
<dt>Alias (AS) [2]</dt><dd>A temporary display name for a column or table in a query.</dd>
<dt>WHERE [3]</dt><dd>Clause filtering rows by a condition before any grouping.</dd>
<dt>LIKE / % [3]</dt><dd>Text pattern matching; <code>%</code> matches any character sequence.</dd>
<dt>ORDER BY / LIMIT [3]</dt><dd>Sorts results (ASC/DESC) and caps the number of rows returned.</dd>
<dt>TRUNCATE [3]</dt><dd>Instantly removes all rows from a table and resets AUTO_INCREMENT.</dd>
<dt>Aggregate function [3]</dt><dd>COUNT, SUM, AVG, MAX, MIN — one result computed across many rows.</dd>
<dt>GROUP BY / HAVING [3]</dt><dd>Runs aggregates per group of equal values; HAVING filters the groups afterwards.</dd>
<dt>INNER JOIN [3]</dt><dd>Combines rows of two tables where the ON condition matches; non-matching rows are dropped.</dd>
</dl>

## ER modelling

<dl>
<dt>ER diagram [4]</dt><dd>A visual blueprint of entities, attributes and relationships, drawn before implementation (Chen, 1976).</dd>
<dt>Entity [4]</dt><dd>A real-world noun we track (rectangle); becomes a table.</dd>
<dt>Attribute [4]</dt><dd>A property of an entity (ellipse); becomes a column.</dd>
<dt>Key attribute [4]</dt><dd>The underlined ellipse uniquely identifying instances; becomes the PK.</dd>
<dt>Relationship [4]</dt><dd>A verb connecting entities (diamond).</dd>
<dt>Relationship attribute [4]</dt><dd>An attribute of the pair itself (Grade on <em>enrolls</em>); lands in the junction table.</dd>
<dt>Cardinality [4]</dt><dd>How many instances may relate: 1:1, 1:N or M:N — always judged in both directions.</dd>
<dt>Weak entity [5]</dt><dd>Cannot be identified alone (double rectangle); owned by a strong entity.</dd>
<dt>Identifying relationship [5]</dt><dd>Double diamond linking weak entity to owner; 1:N with total participation on the weak side.</dd>
<dt>Partial key / discriminator [5]</dt><dd>Distinguishes weak instances within one owner (dashed underline); full key = owner PK + partial key.</dd>
<dt>Composite attribute [5]</dt><dd>An attribute with meaningful sub-parts (Address → Street, City, PostCode); only the leaves become columns.</dd>
<dt>Multivalued attribute [5]</dt><dd>Holds several values (double ellipse, {braces}); becomes its own table.</dd>
<dt>Derived attribute [5]</dt><dd>Computed from stored data (dashed ellipse, parentheses); never stored.</dd>
<dt>Participation constraint [5]</dt><dd>Total (double line — every instance must participate; FK NOT NULL) vs partial (single line — optional; FK nullable).</dd>
</dl>

## Mapping & normalization

<dl>
<dt>Mapping [6]</dt><dd>The deterministic 8-rule translation from ER diagram to relational schema.</dd>
<dt>Junction (bridge) table [6]</dt><dd>Implements an M:N relationship; holds both FKs, composite PK, plus relationship attributes.</dd>
<dt>Flattening [6]</dt><dd>Replacing a composite attribute with columns for its leaf sub-attributes.</dd>
<dt>Composite primary key [6]</dt><dd>A PK of two or more columns — junction tables, weak entities, multivalued tables.</dd>
<dt>Normalization [7]</dt><dd>Organising tables so every fact is stored exactly once, eliminating anomalies.</dd>
<dt>Update / insertion / deletion anomaly [7]</dt><dd>Contradiction, blocked insert, or silent data loss caused by redundancy.</dd>
<dt>Functional dependency (FD) [7]</dt><dd>X → Y: the value of X uniquely determines the value of Y.</dd>
<dt>Determinant / dependent [7]</dt><dd>The left / right side of an FD.</dd>
<dt>Candidate key / superkey / prime attribute [7]</dt><dd>Minimal determining set / any determining set / an attribute belonging to some candidate key.</dd>
<dt>1NF [7]</dt><dd>Atomic cells, no repeating groups, a primary key exists.</dd>
<dt>2NF [7]</dt><dd>1NF + no partial dependencies on a composite key.</dd>
<dt>3NF [7]</dt><dd>2NF + no transitive dependencies ("nothing but the key").</dd>
<dt>BCNF [7]</dt><dd>Every determinant of every non-trivial FD is a superkey.</dd>
<dt>Partial dependency [7]</dt><dd>A non-prime attribute depending on only part of a composite key (breaks 2NF).</dd>
<dt>Transitive dependency [7]</dt><dd>Key → B → C with B non-prime (breaks 3NF).</dd>
<dt>Decomposition [7]</dt><dd>Splitting a relation to remove violations; must be lossless-join, ideally dependency-preserving.</dd>
<dt>Lossless-join [7]</dt><dd>Rejoining the pieces reproduces the original exactly — no lost or spurious rows.</dd>
<dt>Dependency preservation [7]</dt><dd>All original FDs remain enforceable without joins; guaranteed by 3NF, sometimes lost by BCNF.</dd>
</dl>
