import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from 'framer-motion';
import BrandMark from '../components/ui/BrandMark';

// ─── ER → Relational Mapping lesson (Not a LMS) ─────────────────────────────
// A self-contained, independently accessible page that walks through turning an
// ER diagram into relational tables: the 8 mapping rules, cardinality choices,
// attribute handling, a worked university example and practice. Built in the
// same Apple-styled language as the XR Explorer and Normalisation lessons, with
// several interactive simulations. Nothing is collected — it all runs in the
// browser.

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

// Semantic colours
const C = {
  pk: '#0071e3', // primary key / primary action
  fk: '#bf5af2', // foreign key
  entity: '#5e5ce6', // entity / table
  rel: '#ff9f0a', // relationship
  good: '#30d158',
  bad: '#ff375f',
} as const;

// ─── Scroll-reveal wrapper ──────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  y = 48,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ─── Section head ───────────────────────────────────────────────────────────
function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      {eyebrow && <p className="mb-3 text-[15px] font-semibold tracking-tight text-[#0071e3]">{eyebrow}</p>}
      <h2 className="text-[32px] font-semibold leading-[1.08] tracking-tight text-[#1d1d1f] sm:text-[44px]">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73]">{sub}</p>}
    </div>
  );
}

// Pill
function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold"
      style={{ background: color + '1a', color }}
    >
      {children}
    </span>
  );
}

// ─── Relational table card (schema view: column defs) ───────────────────────
interface Col {
  name: string;
  type?: string;
  pk?: boolean;
  fk?: string; // referenced table
}
function TableCard({
  name,
  color = C.entity,
  cols,
  note,
  className = '',
}: {
  name: string;
  color?: string;
  cols: Col[];
  note?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white ${className}`} style={{ borderColor: color + '40' }}>
      <div className="px-4 py-2.5 text-center font-mono text-[13px] font-semibold tracking-wide text-white" style={{ background: color }}>
        {name}
      </div>
      <div className="divide-y divide-black/[0.05]">
        {cols.map((c) => (
          <div key={c.name} className="flex items-center justify-between gap-3 px-4 py-2">
            <span className="flex items-center gap-1.5 font-mono text-[13px]">
              {c.pk && <span title="primary key">🔑</span>}
              {c.fk && <span title="foreign key">🔗</span>}
              <span className={c.fk ? 'font-medium text-[#bf5af2]' : c.pk ? 'font-semibold text-[#0071e3]' : 'text-[#1d1d1f]'}>
                {c.name}
              </span>
            </span>
            {c.type && (
              <span className="whitespace-nowrap font-mono text-[11px] text-[#86868b]">
                {c.type}
                {c.fk ? ` FK→${c.fk}` : ''}
              </span>
            )}
          </div>
        ))}
      </div>
      {note && <div className="border-t border-black/[0.05] bg-[#fafafa] px-4 py-2 text-center text-[12px] text-[#86868b]">{note}</div>}
    </div>
  );
}

// ─── ER primitives ──────────────────────────────────────────────────────────
function Entity({ children, weak = false }: { children: React.ReactNode; weak?: boolean }) {
  return (
    <div className={weak ? 'rounded-[12px] p-[3px]' : ''} style={weak ? { border: `2px solid ${C.entity}` } : undefined}>
      <div
        className="rounded-lg bg-white px-5 py-3 text-center text-[14px] font-semibold text-[#1d1d1f]"
        style={{ border: `2px solid ${C.entity}` }}
      >
        {children}
      </div>
    </div>
  );
}

function Attr({ children, kind = 'simple' }: { children: React.ReactNode; kind?: 'simple' | 'key' | 'multi' | 'derived' | 'composite' }) {
  const base = 'inline-flex items-center rounded-full bg-white px-3 py-1 text-[12.5px] text-[#424245]';
  if (kind === 'key')
    return <span className={`${base} font-semibold underline decoration-2 underline-offset-2`} style={{ border: '1.5px solid #86868b' }}>{children}</span>;
  if (kind === 'multi')
    return <span className={`${base} ring-2 ring-offset-1`} style={{ border: `1.5px solid ${C.entity}`, color: C.entity }}>{`{${''}`}{children}{`}`}</span>;
  if (kind === 'derived')
    return <span className={base} style={{ border: '1.5px dashed #86868b' }}>{children}</span>;
  if (kind === 'composite')
    return <span className={base} style={{ border: '1.5px solid #86868b', background: '#f5f5f7' }}>{children}</span>;
  return <span className={base} style={{ border: '1.5px solid #d2d2d7' }}>{children}</span>;
}

function Diamond({ label, weak = false }: { label: string; weak?: boolean }) {
  return (
    <div className="relative flex h-[64px] w-[120px] items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          background: C.rel + '22',
          border: `2px solid ${C.rel}`,
          transform: 'rotate(45deg) scale(0.72)',
          borderRadius: 6,
          boxShadow: weak ? `0 0 0 4px #fff, 0 0 0 6px ${C.rel}` : 'none',
        }}
      />
      <span className="relative z-10 text-[12px] font-semibold text-[#9a6a00]">{label}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 1 — The 8 Rules Explorer
// Click a rule; watch the ER construct on the left turn into relational table(s)
// on the right.
// ════════════════════════════════════════════════════════════════════════════
interface RuleDef {
  n: number;
  short: string;
  title: string;
  desc: React.ReactNode;
  er: React.ReactNode;
  tables: () => React.ReactNode;
  key: string; // one-line "key idea"
}

const RULES: RuleDef[] = [
  {
    n: 1,
    short: 'Strong entity',
    title: 'Strong entity → Table',
    desc: (
      <>
        Each strong entity becomes a table. Every simple attribute becomes a column, and the key attribute becomes
        the <strong>PRIMARY KEY</strong>.
      </>
    ),
    er: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          <Attr kind="key">StudentId</Attr>
          <Attr>FirstName</Attr>
          <Attr>LastName</Attr>
        </div>
        <Entity>STUDENT</Entity>
      </div>
    ),
    tables: () => (
      <TableCard
        name="STUDENT"
        cols={[
          { name: 'student_id', type: 'INT', pk: true },
          { name: 'first_name', type: 'VARCHAR(50)' },
          { name: 'last_name', type: 'VARCHAR(50)' },
        ]}
      />
    ),
    key: 'Entity name → table · key attribute → PRIMARY KEY.',
  },
  {
    n: 2,
    short: 'Composite attr',
    title: 'Composite attribute → Flatten',
    desc: (
      <>
        A composite attribute is never stored as one column. Each sub-attribute becomes its own column; the parent
        exists only in the diagram.
      </>
    ),
    er: (
      <div className="flex flex-col items-center gap-3">
        <Attr kind="composite">Address</Attr>
        <div className="flex flex-wrap justify-center gap-2">
          <Attr>street</Attr>
          <Attr>city</Attr>
          <Attr>postcode</Attr>
        </div>
        <Entity>CUSTOMER</Entity>
      </div>
    ),
    tables: () => (
      <TableCard
        name="CUSTOMER"
        cols={[
          { name: 'customer_id', type: 'INT', pk: true },
          { name: 'street_name', type: 'VARCHAR(100)' },
          { name: 'city', type: 'VARCHAR(60)' },
          { name: 'post_code', type: 'VARCHAR(10)' },
        ]}
        note="No single 'address' column — it is flattened"
      />
    ),
    key: 'Break the composite into one column per sub-attribute.',
  },
  {
    n: 3,
    short: 'Multivalued',
    title: 'Multivalued attribute → New table',
    desc: (
      <>
        A multivalued attribute (double ellipse) becomes its <strong>own table</strong> holding the value plus a
        foreign key back to the entity. The PK is composite.
      </>
    ),
    er: (
      <div className="flex flex-col items-center gap-3">
        <Attr kind="multi">PhoneNumber</Attr>
        <Entity>MEMBER</Entity>
      </div>
    ),
    tables: () => (
      <div className="flex flex-col gap-3">
        <TableCard name="MEMBER" cols={[{ name: 'member_id', type: 'INT', pk: true }, { name: 'member_name', type: 'VARCHAR' }]} />
        <TableCard
          name="MEMBER_PHONE"
          color={C.fk}
          cols={[
            { name: 'member_id', type: 'INT', pk: true, fk: 'MEMBER' },
            { name: 'phone_number', type: 'VARCHAR', pk: true },
          ]}
          note="PK = (member_id, phone_number)"
        />
      </div>
    ),
    key: 'Each repeating value gets its own row in a new table.',
  },
  {
    n: 4,
    short: '1:N',
    title: '1:N relationship → FK on the N-side',
    desc: (
      <>
        The primary key of the “one” entity is added as a <strong>foreign key</strong> in the “many” entity’s table.
        No new table is needed.
      </>
    ),
    er: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Entity>DEPARTMENT</Entity>
          <span className="text-[14px] font-bold text-[#9a6a00]">1</span>
          <Diamond label="employs" />
          <span className="text-[14px] font-bold text-[#9a6a00]">N</span>
          <Entity>EMPLOYEE</Entity>
        </div>
      </div>
    ),
    tables: () => (
      <div className="flex flex-col gap-3">
        <TableCard name="DEPARTMENT" cols={[{ name: 'dept_id', type: 'INT', pk: true }, { name: 'dept_name', type: 'VARCHAR(80)' }]} />
        <TableCard
          name="EMPLOYEE"
          cols={[
            { name: 'employee_id', type: 'INT', pk: true },
            { name: 'first_name', type: 'VARCHAR' },
            { name: 'dept_id', type: 'INT', fk: 'DEPARTMENT' },
          ]}
          note="FK lives on the many-side"
        />
      </div>
    ),
    key: 'The FK always goes on the MANY side.',
  },
  {
    n: 5,
    short: 'M:N',
    title: 'M:N relationship → Junction table',
    desc: (
      <>
        A many-to-many relationship needs a new <strong>junction (bridge) table</strong> holding both entities’ keys
        as foreign keys. Relationship attributes (like Grade) live here.
      </>
    ),
    er: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Entity>STUDENT</Entity>
          <span className="text-[14px] font-bold text-[#9a6a00]">M</span>
          <Diamond label="enrols" />
          <span className="text-[14px] font-bold text-[#9a6a00]">N</span>
          <Entity>MODULE</Entity>
        </div>
        <span className="text-[12px] text-[#86868b]">Grade ◆ on the relationship</span>
      </div>
    ),
    tables: () => (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <TableCard name="STUDENT" cols={[{ name: 'student_id', type: 'INT', pk: true }, { name: 'first_name' }]} />
          <TableCard name="MODULE" cols={[{ name: 'module_code', type: 'VARCHAR', pk: true }, { name: 'module_name' }]} />
        </div>
        <TableCard
          name="ENROLMENT"
          color={C.fk}
          cols={[
            { name: 'student_id', type: 'INT', pk: true, fk: 'STUDENT' },
            { name: 'module_code', type: 'VARCHAR', pk: true, fk: 'MODULE' },
            { name: 'grade', type: 'DECIMAL(4,2)' },
          ]}
          note="PK = (student_id, module_code)"
        />
      </div>
    ),
    key: 'M:N always becomes a third, junction table.',
  },
  {
    n: 6,
    short: '1:1',
    title: '1:1 relationship → FK choice',
    desc: (
      <>
        Add the foreign key in <strong>either</strong> table — best on the total-participation (mandatory) side. If
        both always co-exist, you may merge them into one table.
      </>
    ),
    er: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Entity>EMPLOYEE</Entity>
          <span className="text-[14px] font-bold text-[#9a6a00]">1</span>
          <Diamond label="assigned" />
          <span className="text-[14px] font-bold text-[#9a6a00]">1</span>
          <Entity>COMPANY_CAR</Entity>
        </div>
      </div>
    ),
    tables: () => (
      <div className="flex flex-col gap-3">
        <TableCard name="EMPLOYEE" cols={[{ name: 'employee_id', type: 'INT', pk: true }, { name: 'employee_name' }]} />
        <TableCard
          name="COMPANY_CAR"
          cols={[
            { name: 'car_reg', type: 'VARCHAR', pk: true },
            { name: 'car_model', type: 'VARCHAR' },
            { name: 'employee_id', type: 'INT', fk: 'EMPLOYEE' },
          ]}
          note="FK on the total-participation side"
        />
      </div>
    ),
    key: 'FK on the mandatory side — or merge if always together.',
  },
  {
    n: 7,
    short: 'Weak entity',
    title: 'Weak entity → Composite PK',
    desc: (
      <>
        A weak entity becomes a table whose primary key is its partial key <em>plus</em> the identifying entity’s key
        (which doubles as a foreign key).
      </>
    ),
    er: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <Entity>BUILDING</Entity>
          <Diamond label="located_in" weak />
          <Entity weak>ROOM</Entity>
        </div>
        <span className="text-[12px] text-[#86868b]">RoomNo is only a partial key</span>
      </div>
    ),
    tables: () => (
      <div className="flex flex-col gap-3">
        <TableCard name="BUILDING" cols={[{ name: 'building_id', type: 'INT', pk: true }, { name: 'building_name' }]} />
        <TableCard
          name="ROOM"
          color={C.fk}
          cols={[
            { name: 'building_id', type: 'INT', pk: true, fk: 'BUILDING' },
            { name: 'room_no', type: 'INT', pk: true },
            { name: 'room_type', type: 'VARCHAR' },
          ]}
          note="PK = (building_id, room_no)"
        />
      </div>
    ),
    key: 'Partial key + owner key → composite primary key.',
  },
  {
    n: 8,
    short: 'Derived attr',
    title: 'Derived attribute → Do NOT store',
    desc: (
      <>
        Derived attributes (dashed ellipse) are calculated from other data. They are <strong>not stored</strong> —
        they go stale and waste space. Compute them in a query instead.
      </>
    ),
    er: (
      <div className="flex flex-col items-center gap-3">
        <Attr kind="derived">age</Attr>
        <Entity>EMPLOYEE</Entity>
      </div>
    ),
    tables: () => (
      <div className="flex flex-col gap-3">
        <TableCard name="EMPLOYEE" cols={[{ name: 'employee_id', type: 'INT', pk: true }, { name: 'date_of_birth', type: 'DATE' }]} note="no 'age' column" />
        <div className="rounded-2xl border border-[#30d158]/30 bg-[#30d158]/[0.06] p-4">
          <p className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#248a3d]">Compute at query time</p>
          <code className="block whitespace-pre font-mono text-[12px] leading-relaxed text-[#1d1d1f]">{`SELECT DATEDIFF(YEAR, date_of_birth,
  GETDATE()) AS age
FROM EMPLOYEE`}</code>
        </div>
      </div>
    ),
    key: 'If it can be calculated, don’t store it.',
  },
];

function RuleExplorer() {
  const [active, setActive] = useState(0);
  const r = RULES[active];
  return (
    <div className="mx-auto max-w-5xl">
      {/* Rule rail */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {RULES.map((rule, i) => (
          <button
            key={rule.n}
            onClick={() => setActive(i)}
            className={`rounded-xl px-2 py-2.5 text-[12.5px] font-semibold transition ${
              i === active ? 'bg-[#0071e3] text-white' : 'bg-white text-[#6e6e73] ring-1 ring-black/[0.08] hover:bg-[#f5f5f7]'
            }`}
          >
            <span className="block text-[11px] opacity-70">Rule {rule.n}</span>
            {rule.short}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={r.n}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="rounded-[28px] border border-black/[0.08] bg-[#fafafa] p-6 sm:p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <Pill color={C.entity}>Rule {r.n}</Pill>
            <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">{r.title}</h3>
          </div>
          <p className="mb-7 max-w-3xl text-[16px] leading-relaxed text-[#424245]">{r.desc}</p>

          <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            {/* ER side */}
            <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
              <p className="mb-4 text-center text-[12px] font-semibold uppercase tracking-wider text-[#86868b]">ER diagram</p>
              <div className="flex min-h-[140px] items-center justify-center">{r.er}</div>
            </div>
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-[#0071e3]/[0.08] px-4 py-2 text-[15px] font-semibold text-[#0071e3]">
                maps to →
              </div>
            </div>
            {/* Table side */}
            <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
              <p className="mb-4 text-center text-[12px] font-semibold uppercase tracking-wider text-[#86868b]">Relational tables</p>
              <div className="flex min-h-[140px] items-center justify-center">
                <div className="w-full max-w-[360px]">{r.tables()}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#0071e3]/[0.06] p-4 text-center">
            <span className="text-[14px] font-medium text-[#0071e3]">💡 {r.key}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 2 — The Cardinality Studio
// Switch a relationship between 1:1 / 1:N / M:N and watch the schema change.
// ════════════════════════════════════════════════════════════════════════════
type Card = '1:1' | '1:N' | 'M:N';

const CARD_DATA: Record<Card, { left: string; right: string; verb: string; lc: string; rc: string; blurb: React.ReactNode; tables: React.ReactNode }> = {
  '1:1': {
    left: 'PERSON',
    right: 'PASSPORT',
    verb: 'holds',
    lc: '1',
    rc: '1',
    blurb: (
      <>
        Each person holds one passport and each passport belongs to one person. Put the foreign key on the{' '}
        <strong>total-participation side</strong> (every passport must have an owner), or merge the two if they always
        co-exist.
      </>
    ),
    tables: (
      <div className="flex flex-col gap-3">
        <TableCard name="PERSON" cols={[{ name: 'person_id', type: 'INT', pk: true }, { name: 'full_name', type: 'VARCHAR' }]} />
        <TableCard
          name="PASSPORT"
          cols={[
            { name: 'passport_no', type: 'VARCHAR', pk: true },
            { name: 'expiry_date', type: 'DATE' },
            { name: 'person_id', type: 'INT', fk: 'PERSON' },
          ]}
          note="one FK, on either side"
        />
      </div>
    ),
  },
  '1:N': {
    left: 'DEPARTMENT',
    right: 'EMPLOYEE',
    verb: 'employs',
    lc: '1',
    rc: 'N',
    blurb: (
      <>
        One department employs many employees, but each employee belongs to one department. Add the department’s key as
        a <strong>foreign key on the many-side</strong> — no extra table required.
      </>
    ),
    tables: (
      <div className="flex flex-col gap-3">
        <TableCard name="DEPARTMENT" cols={[{ name: 'dept_id', type: 'INT', pk: true }, { name: 'dept_name', type: 'VARCHAR' }]} />
        <TableCard
          name="EMPLOYEE"
          cols={[
            { name: 'employee_id', type: 'INT', pk: true },
            { name: 'first_name', type: 'VARCHAR' },
            { name: 'dept_id', type: 'INT', fk: 'DEPARTMENT' },
          ]}
          note="FK on the N-side"
        />
      </div>
    ),
  },
  'M:N': {
    left: 'STUDENT',
    right: 'MODULE',
    verb: 'enrols',
    lc: 'M',
    rc: 'N',
    blurb: (
      <>
        A student takes many modules and a module has many students — a single FK can’t express this. Create a{' '}
        <strong>junction table</strong> with both keys, and any relationship data (like the grade) lives there.
      </>
    ),
    tables: (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <TableCard name="STUDENT" cols={[{ name: 'student_id', type: 'INT', pk: true }, { name: 'first_name' }]} />
          <TableCard name="MODULE" cols={[{ name: 'module_code', type: 'VARCHAR', pk: true }, { name: 'module_name' }]} />
        </div>
        <TableCard
          name="ENROLMENT"
          color={C.fk}
          cols={[
            { name: 'student_id', type: 'INT', pk: true, fk: 'STUDENT' },
            { name: 'module_code', type: 'VARCHAR', pk: true, fk: 'MODULE' },
            { name: 'grade', type: 'DECIMAL(4,2)' },
          ]}
          note="new junction table"
        />
      </div>
    ),
  },
};

function CardinalityStudio() {
  const [card, setCard] = useState<Card>('1:N');
  const d = CARD_DATA[card];
  return (
    <div className="mx-auto max-w-4xl">
      {/* Segmented control */}
      <div className="mx-auto mb-8 flex max-w-md overflow-hidden rounded-2xl border border-black/[0.08]">
        {(['1:1', '1:N', 'M:N'] as Card[]).map((c, i) => (
          <button
            key={c}
            onClick={() => setCard(c)}
            className={`flex-1 py-3 text-[16px] font-semibold transition ${
              card === c ? 'bg-[#0071e3] text-white' : 'bg-white text-[#6e6e73] hover:bg-[#f5f5f7]'
            } ${i > 0 ? 'border-l border-black/[0.08]' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ER row */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <Entity>{d.left}</Entity>
        <span className="text-[16px] font-bold text-[#9a6a00]">{d.lc}</span>
        <Diamond label={d.verb} />
        <span className="text-[16px] font-bold text-[#9a6a00]">{d.rc}</span>
        <Entity>{d.right}</Entity>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-black/[0.08] bg-[#fafafa] p-6">
          <Pill color={C.rel}>{card} relationship</Pill>
          <p className="mt-4 text-[15px] leading-relaxed text-[#424245]">{d.blurb}</p>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-white p-3">
            <span className="text-xl">{card === 'M:N' ? '🔀' : '🔗'}</span>
            <span className="text-[14px] font-medium text-[#1d1d1f]">
              {card === 'M:N' ? 'A new junction table is created' : card === '1:N' ? 'One FK is added to the many-side' : 'One FK is added to either side'}
            </span>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#86868b]">Resulting schema</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={card}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {d.tables}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 3 — Attribute Mapper (build the schema)
// Classify each attribute of STUDENT; watch the schema assemble itself.
// ════════════════════════════════════════════════════════════════════════════
type MapAction = 'one' | 'flatten' | 'newtable' | 'omit';
const ACTION_LABELS: Record<MapAction, string> = {
  one: 'One column',
  flatten: 'Flatten into several columns',
  newtable: 'New table + FK',
  omit: 'Don’t store (compute it)',
};

interface AttrQ {
  id: string;
  label: string;
  erType: string;
  correct: MapAction;
  hint: string;
}
const ATTR_QS: AttrQ[] = [
  { id: 'sid', label: 'StudentId', erType: 'key attribute', correct: 'one', hint: 'A simple key — one column, and it becomes the PRIMARY KEY.' },
  { id: 'name', label: 'Name (First, Last)', erType: 'composite', correct: 'flatten', hint: 'Composite attributes flatten into one column per part.' },
  { id: 'dob', label: 'DateOfBirth', erType: 'simple', correct: 'one', hint: 'A plain simple attribute — just one column.' },
  { id: 'age', label: 'Age', erType: 'derived', correct: 'omit', hint: 'Derived from DateOfBirth — never stored, computed in queries.' },
  { id: 'phones', label: 'PhoneNumbers', erType: 'multivalued', correct: 'newtable', hint: 'Multivalued attributes move to their own table with a FK.' },
];

function AttributeMapper() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [wrong, setWrong] = useState<{ id: string; action: MapAction } | null>(null);

  const handle = (q: AttrQ, action: MapAction) => {
    if (done[q.id]) return;
    if (action === q.correct) {
      setDone((d) => ({ ...d, [q.id]: true }));
      setWrong(null);
    } else {
      setWrong({ id: q.id, action });
    }
  };

  // Build STUDENT columns from completed attributes
  const cols: Col[] = [{ name: 'student_id', type: 'INT', pk: true }];
  if (done.name) cols.push({ name: 'first_name', type: 'VARCHAR(50)' }, { name: 'last_name', type: 'VARCHAR(50)' });
  if (done.dob) cols.push({ name: 'date_of_birth', type: 'DATE' });
  const allDone = ATTR_QS.every((q) => done[q.id]);

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr]">
      {/* Questions */}
      <div className="flex flex-col gap-3">
        <p className="mb-1 text-[14px] text-[#86868b]">
          For each attribute of <strong className="text-[#1d1d1f]">STUDENT</strong>, choose how it maps into the schema.
        </p>
        {ATTR_QS.map((q) => {
          const isDone = done[q.id];
          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-4 transition ${isDone ? 'border-[#30d158]/40 bg-[#30d158]/[0.06]' : 'border-black/[0.08] bg-white'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-[15px] font-semibold text-[#1d1d1f]">{q.label}</span>
                  <span className="ml-2 text-[12px] text-[#86868b]">{q.erType}</span>
                </div>
                {isDone && <span className="text-[14px] font-semibold text-[#248a3d]">✓ mapped</span>}
              </div>
              {!isDone && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Object.keys(ACTION_LABELS) as MapAction[]).map((a) => {
                    const isWrong = wrong && wrong.id === q.id && wrong.action === a;
                    return (
                      <button
                        key={a}
                        onClick={() => handle(q, a)}
                        className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                          isWrong ? 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececee]'
                        }`}
                      >
                        {ACTION_LABELS[a]}
                      </button>
                    );
                  })}
                </div>
              )}
              {isDone && <p className="mt-2 text-[13px] leading-relaxed text-[#6e6e73]">{q.hint}</p>}
              {wrong && wrong.id === q.id && !isDone && (
                <p className="mt-2 text-[13px] font-medium text-[#d70015]">Not quite — try another mapping.</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Live schema */}
      <div className="md:sticky md:top-6 md:self-start">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#86868b]">Schema so far</p>
        <div className="flex flex-col gap-3">
          <motion.div layout transition={{ duration: 0.35, ease: EASE }}>
            <TableCard name="STUDENT" cols={cols} />
          </motion.div>
          <AnimatePresence>
            {done.phones && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <TableCard
                  name="STUDENT_PHONE"
                  color={C.fk}
                  cols={[
                    { name: 'student_id', type: 'INT', pk: true, fk: 'STUDENT' },
                    { name: 'phone_number', type: 'VARCHAR', pk: true },
                  ]}
                  note="from the multivalued attribute"
                />
              </motion.div>
            )}
          </AnimatePresence>
          {done.age && (
            <div className="rounded-2xl border border-dashed border-[#86868b]/40 bg-[#fafafa] p-3 text-center text-[12px] text-[#86868b]">
              age is computed in queries — not stored
            </div>
          )}
        </div>
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl bg-[#30d158]/[0.1] p-4 text-center text-[14px] font-medium text-[#248a3d]"
            >
              🎉 Schema complete — every attribute mapped correctly.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 4 — Schema Builder (university worked example, stepped)
// ════════════════════════════════════════════════════════════════════════════
interface BuildStep {
  label: string;
  rule: string;
  blurb: React.ReactNode;
  render: React.ReactNode;
}
const BUILD_STEPS: BuildStep[] = [
  {
    label: 'Entities',
    rule: 'Rule 1',
    blurb: 'Three strong entities — STUDENT, MODULE and DEPARTMENT — each become a table with its key as PRIMARY KEY.',
    render: (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TableCard name="STUDENT" cols={[{ name: 'student_id', type: 'INT', pk: true }, { name: 'first_name' }, { name: 'last_name' }]} />
        <TableCard name="MODULE" cols={[{ name: 'module_code', type: 'VARCHAR', pk: true }, { name: 'module_name' }, { name: 'credits', type: 'INT' }]} />
        <TableCard name="DEPARTMENT" cols={[{ name: 'dept_id', type: 'INT', pk: true }, { name: 'dept_name' }]} />
      </div>
    ),
  },
  {
    label: 'Composite address',
    rule: 'Rule 2',
    blurb: 'STUDENT has a composite Address. It flattens into street_name, city and post_code columns on STUDENT.',
    render: (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TableCard
          name="STUDENT"
          cols={[
            { name: 'student_id', type: 'INT', pk: true },
            { name: 'first_name' },
            { name: 'last_name' },
            { name: 'street_name' },
            { name: 'city' },
            { name: 'post_code' },
          ]}
          note="Address flattened"
        />
        <TableCard name="MODULE" cols={[{ name: 'module_code', type: 'VARCHAR', pk: true }, { name: 'module_name' }, { name: 'credits', type: 'INT' }]} />
        <TableCard name="DEPARTMENT" cols={[{ name: 'dept_id', type: 'INT', pk: true }, { name: 'dept_name' }]} />
      </div>
    ),
  },
  {
    label: '1:N DEPT→MODULE',
    rule: 'Rule 4',
    blurb: 'A department offers many modules (1:N). MODULE — the many-side — gets a dept_id foreign key.',
    render: (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TableCard name="STUDENT" cols={[{ name: 'student_id', type: 'INT', pk: true }, { name: '…' }]} />
        <TableCard
          name="MODULE"
          cols={[
            { name: 'module_code', type: 'VARCHAR', pk: true },
            { name: 'module_name' },
            { name: 'credits', type: 'INT' },
            { name: 'dept_id', type: 'INT', fk: 'DEPARTMENT' },
          ]}
          note="FK added on the N-side"
        />
        <TableCard name="DEPARTMENT" cols={[{ name: 'dept_id', type: 'INT', pk: true }, { name: 'dept_name' }]} />
      </div>
    ),
  },
  {
    label: 'M:N enrolment',
    rule: 'Rule 5',
    blurb: 'Students enrol in many modules and vice-versa (M:N), and we track a grade. That needs a junction table, ENROLMENT.',
    render: (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TableCard name="STUDENT" cols={[{ name: 'student_id', type: 'INT', pk: true }, { name: '…' }]} />
          <TableCard name="MODULE" cols={[{ name: 'module_code', type: 'VARCHAR', pk: true }, { name: 'dept_id', type: 'INT', fk: 'DEPARTMENT' }]} />
          <TableCard name="DEPARTMENT" cols={[{ name: 'dept_id', type: 'INT', pk: true }, { name: 'dept_name' }]} />
        </div>
        <TableCard
          name="ENROLMENT"
          color={C.fk}
          cols={[
            { name: 'student_id', type: 'INT', pk: true, fk: 'STUDENT' },
            { name: 'module_code', type: 'VARCHAR', pk: true, fk: 'MODULE' },
            { name: 'grade', type: 'DECIMAL(4,2)' },
          ]}
          note="PK = (student_id, module_code)"
        />
      </div>
    ),
  },
];

function SchemaBuilder() {
  const [step, setStep] = useState(0);
  const s = BUILD_STEPS[step];
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex overflow-hidden rounded-2xl border border-black/[0.08]">
        {BUILD_STEPS.map((b, i) => (
          <button
            key={b.label}
            onClick={() => setStep(i)}
            className={`flex-1 px-2 py-3 text-[12.5px] font-semibold transition ${
              i === step ? 'bg-[#0071e3] text-white' : i < step ? 'bg-[#0071e3]/[0.08] text-[#0071e3]' : 'bg-white text-[#86868b] hover:bg-[#f5f5f7]'
            } ${i > 0 ? 'border-l border-black/[0.08]' : ''}`}
          >
            <span className="block text-[10px] opacity-70">{b.rule}</span>
            {b.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-black/[0.08] bg-[#fafafa] p-5">
        <p className="text-[15px] leading-relaxed text-[#424245]">{s.blurb}</p>
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
            {s.render}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep((i) => Math.max(0, i - 1))}
          disabled={step === 0}
          className="rounded-full px-5 py-2.5 text-[15px] font-medium text-[#0071e3] transition hover:underline disabled:opacity-30 disabled:no-underline"
        >
          ‹ Back
        </button>
        <span className="text-[13px] text-[#86868b]">
          Step {step + 1} of {BUILD_STEPS.length}
        </span>
        <button
          onClick={() => setStep((i) => Math.min(BUILD_STEPS.length - 1, i + 1))}
          disabled={step === BUILD_STEPS.length - 1}
          className="rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed] disabled:opacity-30"
        >
          {step === BUILD_STEPS.length - 1 ? 'Schema complete' : 'Next step ›'}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 5 — Mapping Detective (scenario quiz)
// ════════════════════════════════════════════════════════════════════════════
interface MCase {
  scenario: React.ReactNode;
  options: string[];
  answer: number;
  why: string;
}
const MCASES: MCase[] = [
  {
    scenario: 'A CUSTOMER can place many ORDERs; each ORDER is placed by exactly one CUSTOMER.',
    options: ['Add customer_id FK to ORDER', 'Add order_id FK to CUSTOMER', 'Create a junction table', 'Merge into one table'],
    answer: 0,
    why: 'This is 1:N. The FK goes on the many-side, so ORDER gets a customer_id foreign key.',
  },
  {
    scenario: 'A STUDENT takes many COURSEs and a COURSE has many STUDENTs; each enrolment has a grade.',
    options: ['Add course_id FK to STUDENT', 'Create a junction table with a grade column', 'Add a grades list column', 'Merge STUDENT and COURSE'],
    answer: 1,
    why: 'M:N with a relationship attribute → a junction table ENROLMENT(student_id, course_id, grade).',
  },
  {
    scenario: 'EMPLOYEE has a composite attribute FullName made of FirstName and LastName.',
    options: ['One column full_name VARCHAR(200)', 'A new FULLNAME table', 'Separate first_name and last_name columns', 'Don’t store it'],
    answer: 2,
    why: 'Composite attributes are flattened: one column per sub-attribute, so first_name and last_name.',
  },
  {
    scenario: 'ROOM only exists inside a BUILDING, and RoomNo repeats across different buildings.',
    options: ['PK = room_no only', 'PK = (building_id, room_no)', 'Give ROOM its own surrogate key only', 'Store rooms as a column on BUILDING'],
    answer: 1,
    why: 'ROOM is a weak entity. Its PK is the partial key plus the owner’s key: (building_id, room_no).',
  },
  {
    scenario: 'EMPLOYEE has a derived attribute yearsOfService, calculated from hire_date.',
    options: ['Store years_of_service INT', 'Compute it in queries; store only hire_date', 'Put it in a new table', 'Make it the primary key'],
    answer: 1,
    why: 'Derived attributes aren’t stored — they go stale. Keep hire_date and compute the value when needed.',
  },
];

function MappingDetective() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [doneAll, setDoneAll] = useState(false);
  const c = MCASES[idx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === c.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 >= MCASES.length) return setDoneAll(true);
    setIdx((i) => i + 1);
    setPicked(null);
  };
  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDoneAll(false);
  };

  if (doneAll) {
    return (
      <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.08] bg-white p-10 text-center shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)]">
        <div className="text-6xl">{score === MCASES.length ? '🕵️' : score >= 3 ? '🎯' : '📚'}</div>
        <p className="mt-4 text-[44px] font-semibold tracking-tight text-[#1d1d1f]">
          {score} / {MCASES.length}
        </p>
        <p className="mx-auto mt-2 max-w-md text-[17px] text-[#6e6e73]">
          {score === MCASES.length ? 'Flawless — you can map any ER construct on sight.' : 'Good work. Replay the Rule Explorer and try again.'}
        </p>
        <button onClick={reset} className="mt-6 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.08] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10">
      <div className="mb-2 flex justify-between text-[14px] font-medium text-[#86868b]">
        <span>Case {idx + 1} of {MCASES.length}</span>
        <span>Score {score}</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
        <motion.div className="h-full rounded-full bg-[#0071e3]" animate={{ width: `${(idx / MCASES.length) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
      </div>
      <p className="mb-6 text-[20px] font-semibold leading-snug tracking-tight text-[#1d1d1f]">{c.scenario}</p>
      <p className="mb-3 text-[15px] font-medium text-[#6e6e73]">How do you map it?</p>
      <div className="flex flex-col gap-3">
        {c.options.map((opt, i) => {
          const answered = picked !== null;
          const correct = i === c.answer;
          const chosen = i === picked;
          let cls = 'rounded-2xl px-5 py-3.5 text-left text-[15px] font-medium transition ';
          if (!answered) cls += 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececee]';
          else if (correct) cls += 'bg-[#30d158]/15 text-[#248a3d] ring-1 ring-[#30d158]/40';
          else if (chosen) cls += 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40';
          else cls += 'bg-[#f5f5f7] text-[#aeaeb2]';
          return (
            <button key={i} onClick={() => choose(i)} className={cls}>
              {opt}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {picked !== null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-2xl bg-[#f5f5f7] p-5">
            <p className={`font-semibold ${picked === c.answer ? 'text-[#248a3d]' : 'text-[#d70015]'}`}>
              {picked === c.answer ? 'Correct' : 'Not quite'}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-[#424245]">{c.why}</p>
            <button onClick={next} className="mt-4 rounded-full bg-[#0071e3] px-5 py-2 text-[15px] font-medium text-white transition hover:bg-[#0077ed]">
              {idx + 1 < MCASES.length ? 'Next case' : 'See results'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION 6 — Closing true/false quiz
// ════════════════════════════════════════════════════════════════════════════
const QUIZ = [
  { q: 'In a 1:N relationship, the foreign key goes on the “many” side.', a: true, e: 'The many-side stores one FK pointing back to the single related row.' },
  { q: 'A multivalued attribute can be stored as a comma-separated column.', a: false, e: 'It must become its own table with a FK — comma lists break atomicity.' },
  { q: 'Every M:N relationship needs its own junction table.', a: true, e: 'A single FK can’t express many-to-many, so a bridge table is mandatory.' },
  { q: 'A composite attribute becomes one column named after the parent.', a: false, e: 'It is flattened — one column per sub-attribute, no parent column.' },
  { q: 'Derived attributes should generally not be stored as columns.', a: true, e: 'They go stale; compute them from stored data at query time instead.' },
];

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (opt: boolean) => {
    if (answer !== null) return;
    setAnswer(opt);
    if (opt === QUIZ[idx].a) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 >= QUIZ.length) return setDone(true);
    setIdx((i) => i + 1);
    setAnswer(null);
  };
  const reset = () => {
    setIdx(0);
    setAnswer(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-black/[0.08] bg-white p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)] sm:p-10">
      {!done ? (
        <>
          <div className="mb-2 flex justify-between text-[14px] font-medium text-[#86868b]">
            <span>Question {idx + 1} of {QUIZ.length}</span>
            <span>Score {score}</span>
          </div>
          <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div className="h-full rounded-full bg-[#0071e3]" animate={{ width: `${(idx / QUIZ.length) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
          </div>
          <p className="mb-8 text-[24px] font-semibold leading-snug tracking-tight text-[#1d1d1f]">{QUIZ[idx].q}</p>
          <div className="flex gap-4">
            {[true, false].map((opt) => {
              const answered = answer !== null;
              const correct = opt === QUIZ[idx].a;
              const chosen = opt === answer;
              let cls = 'flex-1 rounded-2xl py-4 text-[17px] font-medium transition ';
              if (!answered) cls += 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ececee]';
              else if (correct) cls += 'bg-[#30d158]/15 text-[#248a3d] ring-1 ring-[#30d158]/40';
              else if (chosen) cls += 'bg-[#ff375f]/12 text-[#d70015] ring-1 ring-[#ff375f]/40';
              else cls += 'bg-[#f5f5f7] text-[#aeaeb2]';
              return (
                <button key={String(opt)} onClick={() => choose(opt)} className={cls}>
                  {opt ? 'True' : 'False'}
                </button>
              );
            })}
          </div>
          {answer !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl bg-[#f5f5f7] p-5">
              <p className={`font-semibold ${answer === QUIZ[idx].a ? 'text-[#248a3d]' : 'text-[#d70015]'}`}>
                {answer === QUIZ[idx].a ? 'Correct' : 'Not quite'}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[#424245]">{QUIZ[idx].e}</p>
              <button onClick={next} className="mt-4 rounded-full bg-[#0071e3] px-5 py-2 text-[15px] font-medium text-white transition hover:bg-[#0077ed]">
                {idx + 1 < QUIZ.length ? 'Next question' : 'See results'}
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <div className="py-6 text-center">
          <div className="text-6xl">{score >= 4 ? '🏆' : score >= 3 ? '🎯' : '📚'}</div>
          <p className="mt-4 text-[44px] font-semibold tracking-tight text-[#1d1d1f]">{score} / {QUIZ.length}</p>
          <p className="mx-auto mt-2 max-w-md text-[17px] text-[#6e6e73]">
            {score === QUIZ.length ? 'Perfect — the mapping rules have clearly clicked.' : score >= 3 ? 'Nice work. Revisit the Rule Explorer to firm up the rest.' : 'Good start. Replay the simulations above, then try again.'}
          </p>
          <button onClick={reset} className="mt-6 rounded-full bg-[#0071e3] px-6 py-2.5 text-[15px] font-medium text-white transition hover:bg-[#0077ed]">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Common mistakes data ───────────────────────────────────────────────────
const MISTAKES = [
  { wrong: 'Storing a derived "age" column that goes stale every birthday.', right: 'Store date_of_birth and compute age with DATEDIFF() when needed.' },
  { wrong: 'One "address VARCHAR(200)" column for a composite Address.', right: 'Flatten into street_name, city and post_code — each queryable.' },
  { wrong: 'Putting both FKs of an M:N inside one of the entity tables.', right: 'Always create a junction table holding both foreign keys.' },
  { wrong: 'Adding the FK on the "1" side of a 1:N relationship.', right: 'The FK always lives on the many-side of a 1:N.' },
];

// Smooth-scroll without touching the URL hash (the app runs under HashRouter).
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function ERMappingExplorerPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div className="bg-white text-[#1d1d1f]" style={{ fontFamily: APPLE_FONT }}>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute left-6 top-6 z-20 flex items-center gap-2.5 sm:left-10 sm:top-8">
          <BrandMark className="h-8 w-8 rounded-[9px]" />
          <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
            Not a <span className="text-[#0071e3]">LMS</span>
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#5e5ce6]/[0.07] blur-3xl" />
          <div className="absolute bottom-[-10%] right-[12%] h-[420px] w-[420px] rounded-full bg-[#bf5af2]/[0.06] blur-3xl" />
        </div>

        <motion.div style={{ scale: heroScale, opacity: heroOpacity, y: heroY }} className="relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="mb-5 text-[17px] font-medium text-[#6e6e73]">
            An interactive lesson · Dr. Yasas Sri Wickramasinghe
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="text-[44px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[72px] lg:text-[88px]"
          >
            From ER diagrams to
            <br />
            <span className="bg-gradient-to-r from-[#0071e3] via-[#5e5ce6] to-[#bf5af2] bg-clip-text text-transparent">relational tables.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-[19px] leading-relaxed text-[#6e6e73] sm:text-[22px]"
          >
            Every box, ellipse and diamond in an ER diagram maps to a specific relational structure. We’ll walk through
            all eight mapping rules and build a real schema together — with live simulations you can play with. No
            sign-in, nothing collected.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
          >
            <button onClick={() => scrollToSection('rules')} className="rounded-full bg-[#0071e3] px-7 py-3 text-[17px] font-medium text-white transition hover:bg-[#0077ed]">
              Explore the 8 rules
            </button>
            <button onClick={() => scrollToSection('cardinality')} className="text-[17px] font-medium text-[#0071e3] hover:underline">
              Jump to the Cardinality Studio ›
            </button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-9 left-1/2 -translate-x-1/2 text-[13px] font-medium text-[#aeaeb2]">
          Scroll to explore
        </motion.div>
      </section>

      {/* ── BIG PICTURE ────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="The big picture"
            title="One pipeline, eight rules"
            sub="Mapping isn’t guesswork. You read the ER diagram, apply a deterministic set of rules to each construct, and out comes a clean set of relational tables."
          />
        </Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { e: '🗂️', t: 'ER diagram', c: C.entity, d: 'Entities, attributes and relationships, drawn in Chen’s notation.' },
            { e: '⚙️', t: '8 mapping rules', c: '#0071e3', d: 'A fixed recipe: each construct has exactly one correct relational form.' },
            { e: '🗄️', t: 'Relational tables', c: C.good, d: 'Clean tables with primary keys and foreign keys, ready for SQL.' },
          ].map((p) => (
            <motion.div key={p.t} variants={item} className="rounded-[28px] border border-black/[0.07] bg-[#fafafa] p-8 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.18)]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ background: p.c + '14' }}>
                {p.e}
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">{p.t}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#6e6e73]">{p.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── RULE EXPLORER ──────────────────────────────────────────────────── */}
      <section id="rules" className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Interactive · the main event"
            title="The 8 Rules Explorer"
            sub="Tap a rule to see the ER construct on the left turn into the exact relational table(s) on the right. These eight cover everything you’ll meet in a diagram."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <RuleExplorer />
        </Reveal>
      </section>

      {/* ── CARDINALITY STUDIO ─────────────────────────────────────────────── */}
      <section id="cardinality" className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Interactive · relationships"
            title="The Cardinality Studio"
            sub="The trickiest part of mapping is relationships. Flip between 1:1, 1:N and M:N and watch where the foreign key lands — and when a whole new junction table appears."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <CardinalityStudio />
        </Reveal>
      </section>

      {/* ── ATTRIBUTE MAPPER ───────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Interactive · attributes"
            title="Build the table, attribute by attribute"
            sub="Attributes come in flavours — simple, composite, multivalued and derived — and each maps differently. Classify each one and watch the STUDENT schema assemble itself."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <AttributeMapper />
        </Reveal>
      </section>

      {/* ── SCHEMA BUILDER ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Interactive · worked example"
            title="Map a university enrolment diagram"
            sub="Put the rules together on a real example. Step through entities, a composite address, a 1:N link and an M:N enrolment to reach the complete four-table schema."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <SchemaBuilder />
        </Reveal>
      </section>

      {/* ── COMMON MISTAKES ────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="Watch out" title="Four classic mistakes" sub="Most mapping errors come down to these. Here’s the wrong move and the fix for each." />
        </Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {MISTAKES.map((m, i) => (
            <motion.div key={i} variants={item} className="overflow-hidden rounded-[28px] border border-black/[0.07] bg-white">
              <div className="border-b border-black/[0.05] bg-[#ff375f]/[0.06] p-6">
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#d70015]">❌ Wrong</p>
                <p className="text-[15px] leading-relaxed text-[#424245]">{m.wrong}</p>
              </div>
              <div className="bg-[#30d158]/[0.06] p-6">
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#248a3d]">✅ Right</p>
                <p className="text-[15px] leading-relaxed text-[#424245]">{m.right}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── MAPPING DETECTIVE ──────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="Interactive · put it together" title="Mapping Detective" sub="Read each scenario and pick the correct mapping. This is exactly the reasoning you’ll use designing real schemas." />
        </Reveal>
        <Reveal delay={0.1}>
          <MappingDetective />
        </Reveal>
      </section>

      {/* ── QUICK REFERENCE ────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="At a glance" title="The 8 rules, side by side" sub="One line per rule — the construct and what it becomes." />
        </Reveal>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {RULES.map((r) => (
            <motion.div key={r.n} variants={item} className="flex items-start gap-4 rounded-2xl border border-black/[0.07] bg-white p-5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-[15px] font-bold text-white" style={{ background: C.entity }}>
                {r.n}
              </div>
              <div>
                <p className="text-[16px] font-semibold tracking-tight text-[#1d1d1f]">{r.title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-[#6e6e73]">{r.key}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CLOSING QUIZ ───────────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:py-28">
        <Reveal>
          <SectionHead eyebrow="Check yourself" title="Five quick questions" sub="See how much of the lesson stuck." />
        </Reveal>
        <Reveal delay={0.1}>
          <Quiz />
        </Reveal>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <BrandMark className="h-7 w-7 rounded-[8px]" />
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
            Not a <span className="text-[#0071e3]">LMS</span>
          </span>
        </div>
        <p className="text-[14px] text-[#6e6e73]">
          An ER-to-Relational mapping lesson, put together by <span className="font-medium text-[#1d1d1f]">Dr. Yasas Sri Wickramasinghe</span>.
        </p>
        <p className="mt-2 text-[12px] text-[#aeaeb2]">Everything here runs in your own browser. No personal data is collected or stored.</p>
      </footer>
    </div>
  );
}
