import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Copy,
  KeyRound,
  PlusCircle,
  Printer,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import {
  EASE,
  LINES,
  MENU,
  NTable,
  ORDERS,
  RuleBox,
  Swatch,
  linesOf,
  money,
  orderOf,
  savePageAsPdf,
  usePrinting,
  type CellTone,
  type Col,
  type Group,
  type Row,
} from './NormalisationSimpleParts';

// ─── MBI802 · Normalisation, the simple way ───────────────────────────────
// A short, plain-language companion to the full /normalisation explorer, for
// a student who wants the idea before the theory. One running example (three
// phone orders at a pizza shop) goes from one messy sheet to four tables:
// why the sheet causes trouble, then 1NF, 2NF and 3NF, one step each, then
// the same trouble tried again on the finished tables.
//
// Colour carries the lesson. Every column is coloured by what it depends on,
// and that colour is the table it ends up in, so a reader can follow a column
// from the sheet to its new home. The page saves as a PDF through the
// browser's print window, with every stage drawn in its finished state (see
// NormalisationSimpleParts.tsx). Nothing is stored.

// ── Columns ──────────────────────────────────────────────────────────────
const C = {
  order: { k: 'order', label: 'Order', g: 'key', isKey: true } as Col,
  items: { k: 'item', label: 'Items', g: 'plain' } as Col,
  item: { k: 'item', label: 'Item', g: 'key', isKey: true } as Col,
  qty: { k: 'qty', label: 'Qty', g: 'plain' } as Col,
  price: { k: 'price', label: 'Price', g: 'plain' } as Col,
  date: { k: 'date', label: 'Date', g: 'plain' } as Col,
  cust: { k: 'cust', label: 'Cust ID', g: 'plain' } as Col,
  name: { k: 'name', label: 'Customer', g: 'plain' } as Col,
  phone: { k: 'phone', label: 'Phone', g: 'plain' } as Col,
};
const as = (c: Col, g: Group, isKey = false): Col => ({ ...c, g, isKey });

const UNF_COLS = [C.order, C.items, C.qty, C.price, C.date, C.cust, C.name, C.phone];

/** What each 1NF column depends on. This is the 2NF lesson in one object. */
const DEPENDS: Record<string, Group> = {
  qty: 'whole',
  price: 'item',
  date: 'order',
  cust: 'order',
  name: 'order',
  phone: 'order',
};

const cols1NF = (shown: (k: string) => boolean) => [
  C.order,
  C.item,
  ...[C.qty, C.price, C.date, C.cust, C.name, C.phone].map(c => as(c, shown(c.k) ? DEPENDS[c.k] : 'plain')),
];

// ── Rows ─────────────────────────────────────────────────────────────────
/** A list cell, with some entries marked. */
function List({ items, mark = [] }: { items: string[]; mark?: number[] }) {
  return (
    <span className="ns-list">
      {items.map((t, i) => (
        <span key={i}>
          <span className={mark.includes(i) ? 'ns-mark' : undefined}>{t}</span>
          {i < items.length - 1 && <span className="ns-list__sep">, </span>}
        </span>
      ))}
    </span>
  );
}

function unfRows(opts: { markChicken?: boolean; newPhone?: boolean } = {}): Row[] {
  return ORDERS.map(o => {
    const ls = linesOf(o.order);
    const mark = opts.markChicken ? ls.flatMap((l, i) => (l.item === 'Chicken Pizza' ? [i] : [])) : [];
    return {
      id: `u${o.order}`,
      cells: {
        order: o.order,
        item: <List items={ls.map(l => l.item)} mark={mark} />,
        qty: <List items={ls.map(l => String(l.qty))} mark={mark} />,
        price: <List items={ls.map(l => money(MENU[l.item]))} />,
        date: o.date,
        cust: o.cust,
        name: o.name,
        phone: opts.newPhone && o.order === '1001' ? '021 555 0199' : o.phone,
      },
    };
  });
}

const firstRows = (): Row[] =>
  LINES.map(l => {
    const o = orderOf(l.order);
    return {
      id: `${l.order}-${l.item}`,
      cells: {
        order: l.order,
        item: l.item,
        qty: l.qty,
        price: money(MENU[l.item]),
        date: o.date,
        cust: o.cust,
        name: o.name,
        phone: o.phone,
      },
    };
  });

// The four finished tables, as columns and rows.
const T_CUSTOMERS = [as(C.cust, 'cust', true), as(C.name, 'cust'), as(C.phone, 'cust')];
const T_ORDERS_2NF = [C.order, as(C.date, 'order'), as(C.cust, 'order'), as(C.name, 'cust'), as(C.phone, 'cust')];
const T_ORDERS = [C.order, as(C.date, 'order'), as(C.cust, 'order')];
const T_MENU = [C.item, as(C.price, 'item')];
const T_ITEMS = [C.order, C.item, as(C.qty, 'whole')];

const customerRows = (phone = '021 555 0101'): Row[] => [
  { id: 'C1', cells: { cust: 'C1', name: 'Amaya', phone } },
  { id: 'C2', cells: { cust: 'C2', name: 'Ravi', phone: '022 555 0202' } },
];
const orderRows = (): Row[] => ORDERS.map(o => ({ id: o.order, cells: { ...o } }));
const menuRows = (): Row[] =>
  Object.entries(MENU).map(([item, p]) => ({ id: item, cells: { item, price: money(p) } }));
const itemRows = (): Row[] =>
  LINES.map(l => ({ id: `${l.order}-${l.item}`, cells: { order: l.order, item: l.item, qty: l.qty } }));

// ── Small shared bits ────────────────────────────────────────────────────
function Pop({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Said({ tone, children, id }: { tone: 'bad' | 'good' | 'info'; children: ReactNode; id?: string }) {
  return (
    <motion.p
      key={id}
      className={`ns-said ns-said--${tone}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      aria-live="polite"
    >
      {children}
    </motion.p>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 1 · Why: one copy against many
// ═══════════════════════════════════════════════════════════════════════
function CopiesPicture() {
  return (
    <div className="ns-copies">
      <Pop className="ns-copies__panel ns-copies__panel--bad">
        <p className="ns-copies__title">Copies everywhere</p>
        <div className="ns-notes">
          {[
            ['Order 1001', '021 555 0199', -3, true],
            ['Order 1003', '021 555 0101', 2.5, true],
          ].map(([order, phone, rot, odd], i) => (
            <motion.div
              key={order as string}
              className="ns-note"
              initial={{ opacity: 0, y: -30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: rot as number }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.2 }}
            >
              <span className="ns-note__k">{order}</span>
              <b>Amaya</b>
              <motion.span
                className="ns-note__phone"
                initial={{ color: '#2e2826' }}
                whileInView={{ color: odd ? '#b42318' : '#2e2826' }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                {phone as string}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <motion.span
          className="ns-badge ns-badge--bad"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3, duration: 0.4, ease: EASE }}
        >
          <AlertTriangle size={14} /> Which number is right?
        </motion.span>
        <p className="ns-copies__cap">
          Amaya’s phone number is written on every order. Change one copy, miss another, and now there are two
          numbers for one person.
        </p>
      </Pop>

      <Pop className="ns-copies__panel ns-copies__panel--good" delay={0.12}>
        <p className="ns-copies__title">One copy, pointed to</p>
        <div className="ns-onecopy">
          <motion.div
            className="ns-custcard"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
          >
            <span className="ns-note__k">Customer C1</span>
            <b>Amaya</b>
            <span>021 555 0199</span>
          </motion.div>
          <div className="ns-pointers">
            {['Order 1001', 'Order 1003'].map((o, i) => (
              <motion.div
                key={o}
                className="ns-ticket"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.6 + i * 0.18 }}
              >
                <motion.i
                  className="ns-ticket__line"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.95 + i * 0.18 }}
                />
                {o} <ArrowRight size={13} /> <b>C1</b>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.span
          className="ns-badge ns-badge--good"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.4, ease: EASE }}
        >
          Always the same number
        </motion.span>
        <p className="ns-copies__cap">
          The number is written once. Each order just says which customer it belongs to. Change the number once
          and every order sees the change.
        </p>
      </Pop>
    </div>
  );
}

const BENEFITS: [typeof Copy, string, string][] = [
  [Copy, 'Less typing', 'Each fact is written once, not on every order.'],
  [AlertTriangle, 'No contradictions', 'One copy of a phone number can’t disagree with itself.'],
  [PlusCircle, 'Add things any time', 'A new pizza can go on the menu before anyone orders it.'],
  [Trash2, 'Delete safely', 'Cancelling an order doesn’t wipe out the customer.'],
  [Search, 'Easy to search', 'One value per cell means a query can count and filter.'],
];

function Benefits() {
  return (
    <div className="ns-benefits">
      {BENEFITS.map(([Icon, title, body], i) => (
        <Pop key={title} className="ns-benefit" delay={i * 0.07}>
          <span className="ns-benefit__icon">
            <Icon size={20} strokeWidth={2.2} />
          </span>
          <b>{title}</b>
          <span>{body}</span>
        </Pop>
      ))}
    </div>
  );
}

// ── The four problems, played on the shop's sheet ────────────────────────
type ProblemId = 'update' | 'insert' | 'delete' | 'count';

const PROBLEMS: {
  id: ProblemId;
  tab: string;
  icon: typeof Copy;
  ask: string;
  button: string;
  after: string;
  book: string;
}[] = [
  {
    id: 'update',
    tab: 'A phone number changes',
    icon: Copy,
    ask: 'Amaya gets a new phone number. The owner fixes it on order 1001, but forgets order 1003.',
    button: 'Change the number',
    after: 'Now the sheet has two numbers for Amaya. Which one is right? Nobody can tell.',
    book: 'Your textbook calls this an update anomaly.',
  },
  {
    id: 'insert',
    tab: 'A new pizza',
    icon: PlusCircle,
    ask: 'The shop adds a Hawaiian Pizza for $17. Nobody has ordered it yet. Where does the price go?',
    button: 'Try to add it',
    after:
      'Every row is an order. A price on its own has no row to live in, so the owner would have to make up a fake order.',
    book: 'Your textbook calls this an insertion anomaly.',
  },
  {
    id: 'delete',
    tab: 'An order is cancelled',
    icon: Trash2,
    ask: 'Ravi cancels order 1002, so the owner deletes that row.',
    button: 'Delete the row',
    after: 'Ravi’s phone number went with it. So did the only note that a Veggie Pizza costs $16.',
    book: 'Your textbook calls this a deletion anomaly.',
  },
  {
    id: 'count',
    tab: 'Count the pizzas',
    icon: Search,
    ask: 'How many Chicken Pizzas did the shop sell?',
    button: 'Find them',
    after:
      'You have to read inside each cell and match the first item with the first number: 1 + 2 = 3. A person can do that. A database query can’t, at least not easily.',
    book: 'This is why 1NF asks for one value in each cell.',
  },
];

function ProblemStage({ id, played }: { id: ProblemId; played: boolean }) {
  let rows = unfRows({ markChicken: id === 'count' && played, newPhone: id === 'update' && played });
  let tone: ((r: string, c: string) => CellTone | undefined) | undefined;

  if (id === 'update') {
    tone = (r, c) => (c === 'phone' && (r === 'u1001' || r === 'u1003') ? (played ? 'bad' : 'focus') : undefined);
  }
  if (id === 'insert' && played) {
    rows = [
      ...rows,
      {
        id: 'ghost',
        state: 'new',
        cells: { order: '?', item: 'Hawaiian Pizza', qty: '?', price: '$17', date: '?', cust: '?', name: '?', phone: '?' },
      },
    ];
    tone = (r, c) => (r === 'ghost' ? (c === 'item' || c === 'price' ? 'warn' : 'bad') : undefined);
  }
  if (id === 'delete') {
    rows = rows.map(r => (r.id === 'u1002' && played ? { ...r, state: 'gone' } : r));
    tone = (r, c) =>
      r === 'u1002' && ['name', 'phone', 'item', 'price'].includes(c) ? (played ? 'bad' : 'focus') : undefined;
  }

  return <NTable name="The shop’s order sheet" tone="plain" cols={UNF_COLS} rows={rows} cellTone={tone} />;
}

function ProblemDemo() {
  const printing = usePrinting();
  const [at, setAt] = useState<ProblemId>('update');
  const [played, setPlayed] = useState(false);

  if (printing) {
    return (
      <div className="ns-printlist">
        {PROBLEMS.map(p => (
          <div key={p.id} className="ns-demo ns-avoid">
            <div className="ns-demo__text">
              <p className="ns-demo__tag">{p.tab}</p>
              <p className="ns-demo__ask">{p.ask}</p>
              <p className="ns-said ns-said--bad">{p.after}</p>
              <p className="ns-book">{p.book}</p>
            </div>
            <ProblemStage id={p.id} played />
          </div>
        ))}
      </div>
    );
  }

  const p = PROBLEMS.find(x => x.id === at)!;

  return (
    <div className="ns-demo">
      <div className="ns-tabs" role="group" aria-label="Choose a problem">
        {PROBLEMS.map(x => {
          const Icon = x.icon;
          return (
            <button
              key={x.id}
              type="button"
              className="bt-tab"
              aria-pressed={x.id === at}
              onClick={() => {
                setAt(x.id);
                setPlayed(false);
              }}
            >
              <Icon size={15} /> {x.tab}
            </button>
          );
        })}
      </div>

      <div className="ns-demo__text">
        <motion.p
          key={p.id}
          className="ns-demo__ask"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {p.ask}
        </motion.p>
        <div className="ns-demo__acts">
          {!played ? (
            <button type="button" className="bt-btn bt-btn--md" onClick={() => setPlayed(true)}>
              {p.button}
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
          ) : (
            <button type="button" className="bt-btn bt-btn--md bt-btn--tertiary" onClick={() => setPlayed(false)}>
              Put it back
              <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={13} /></span>
            </button>
          )}
        </div>
        {played && (
          <>
            <Said tone="bad" id={p.id}>{p.after}</Said>
            <p className="ns-book">{p.book}</p>
          </>
        )}
      </div>

      <ProblemStage id={at} played={played} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 2 · The plan, and two words
// ═══════════════════════════════════════════════════════════════════════
const LADDER: [string, string, string][] = [
  ['Start', 'The messy sheet', 'Lists inside cells. The same facts typed again and again.'],
  ['1NF', 'First normal form', 'One value in each cell.'],
  ['2NF', 'Second normal form', 'Every column needs the whole key.'],
  ['3NF', 'Third normal form', 'Columns depend on the key, not on each other.'],
];

function Ladder() {
  return (
    <div className="ns-ladder">
      {LADDER.map(([n, name, rule], i) => (
        <div key={n} className={`ns-step ns-step--${i}`}>
          <motion.div
            className="ns-step__body"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.25 + i * 0.18 }}
          >
            <span className="ns-step__n">{n}</span>
            <b>{name}</b>
            <span>{rule}</span>
          </motion.div>
          <motion.div
            className="ns-step__bar"
            style={{ originY: 1 }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.18 }}
          />
        </div>
      ))}
    </div>
  );
}

function TwoWords() {
  return (
    <div className="ns-two">
      <Pop className="ns-word">
        <span className="ns-word__icon"><KeyRound size={22} /></span>
        <p className="ns-word__name">Key</p>
        <p>
          The column that picks out exactly one row. Order <b>1001</b> means one order and only one, like a
          student ID means one student.
        </p>
        <div className="ns-keydemo">
          <span className="ns-chip ns-chip--key"><KeyRound size={13} /> 1001</span>
          <ArrowRight size={16} />
          <span className="ns-chip">one row</span>
        </div>
        <p className="ns-small">Sometimes one column isn’t enough and two columns together make the key.</p>
      </Pop>

      <Pop className="ns-word" delay={0.1}>
        <span className="ns-word__icon"><ArrowRight size={22} /></span>
        <p className="ns-word__name">Depends on</p>
        <p>
          If you know one thing, you know the other. Know the item and you know its price. So <b>Price depends
          on Item</b>.
        </p>
        <div className="ns-pairs">
          {[
            ['Cola', '$3'],
            ['Chicken Pizza', '$18'],
          ].map(([a, b], i) => (
            <div key={a} className="ns-pair">
              <motion.span
                className="ns-chip ns-chip--item"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.3, duration: 0.4 }}
              >
                {a}
              </motion.span>
              <motion.i
                className="ns-pair__arrow"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.3, duration: 0.4, ease: EASE }}
              />
              <motion.span
                className="ns-chip"
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.75 + i * 0.3, duration: 0.35 }}
              >
                {b}
              </motion.span>
            </div>
          ))}
        </div>
        <p className="ns-small">Textbooks write this as Item → Price and call it a functional dependency.</p>
      </Pop>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 3 · 1NF
// ═══════════════════════════════════════════════════════════════════════
const FINDS: { id: string; label: string; match: (r: Row) => boolean; said: string }[] = [
  {
    id: 'o',
    label: 'Order = 1001',
    match: r => r.cells.order === '1001',
    said: '2 rows. Order alone is not enough any more.',
  },
  {
    id: 'i',
    label: 'Item = Chicken Pizza',
    match: r => r.cells.item === 'Chicken Pizza',
    said: '2 rows. Item alone is not enough either.',
  },
  {
    id: 'oi',
    label: 'Order 1001 and Chicken Pizza',
    match: r => r.cells.order === '1001' && r.cells.item === 'Chicken Pizza',
    said: '1 row. Order and Item together pick out exactly one row, so together they are the key.',
  },
];

const AMAYA = new Set(['1001-Chicken Pizza', '1001-Garlic Bread', '1003-Chicken Pizza', '1003-Cola']);

function FirstNF() {
  const printing = usePrinting();
  const [split, setSplit] = useState(false);
  const [find, setFind] = useState<string | null>(null);
  const done = split || printing;

  const listTone = (r: string, c: string): CellTone | undefined =>
    (r === 'u1001' || r === 'u1003') && ['item', 'qty', 'price'].includes(c) ? 'warn' : undefined;

  const f = printing ? undefined : FINDS.find(x => x.id === find);
  const after = firstRows().map(r => (f ? { ...r, state: f.match(r) ? ('match' as const) : ('dim' as const) } : r));

  return (
    <div className="ns-stage">
      <div className="ns-stage__bar">
        <span className={`ns-pill${done ? '' : ' ns-pill--on'}`}>Before</span>
        <motion.span className="ns-stage__arrow" animate={{ x: done ? 4 : 0 }}>
          <ArrowRight size={16} />
        </motion.span>
        <span className={`ns-pill${done ? ' ns-pill--on' : ''}`}>After 1NF</span>
        <span className="ns-stage__spacer" />
        {!printing &&
          (split ? (
            <button
              type="button"
              className="bt-btn bt-btn--sm bt-btn--tertiary"
              onClick={() => {
                setSplit(false);
                setFind(null);
              }}
            >
              Start again
              <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={11} /></span>
            </button>
          ) : (
            <button type="button" className="bt-btn bt-btn--sm" onClick={() => setSplit(true)}>
              Split the lists
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
          ))}
      </div>

      {(!done || printing) && (
        <NTable
          name={printing ? 'Before: lists inside cells' : 'The shop’s order sheet'}
          tone="plain"
          cols={UNF_COLS}
          rows={unfRows()}
          cellTone={listTone}
          caption="Orange cells hold more than one value. That is what 1NF fixes."
        />
      )}

      {done && (
        <>
          <NTable
            name="After 1NF: one value in each cell"
            tone="key"
            cols={cols1NF(() => false)}
            rows={after}
            animateKey={printing ? undefined : 'split'}
            cellTone={(r, c) => (!f && (c === 'phone' || c === 'name') && AMAYA.has(r) ? 'warn' : undefined)}
            caption={
              <>
                Every cell now holds one value. But look at Amaya: her phone number was typed twice before, now it
                is typed <b>four times</b>. 1NF often adds repeats. Steps 2 and 3 take them away.
              </>
            }
          />
          {!printing && (
            <div className="ns-find">
              <p className="ns-find__q">Which column picks out one row now? Try each one.</p>
              <div className="ns-find__btns">
                {FINDS.map(x => (
                  <button
                    key={x.id}
                    type="button"
                    className="bt-tab"
                    aria-pressed={find === x.id}
                    onClick={() => setFind(find === x.id ? null : x.id)}
                  >
                    <Search size={14} /> {x.label}
                  </button>
                ))}
              </div>
              {f && <Said tone={f.id === 'oi' ? 'good' : 'info'} id={f.id}>{f.said}</Said>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const HOW_1NF: [string, string][] = [
  ['Find the lists.', 'Look for any cell with more than one value in it. Here: Items, Qty and Price on orders 1001 and 1003.'],
  ['Give each value its own row.', 'Order 1001 had two items, so it becomes two rows. Copy the date and customer onto both.'],
  ['Pick the key.', 'An order now has several rows, so Order alone can’t pick out one row. Order and Item together can.'],
];

// ═══════════════════════════════════════════════════════════════════════
// 4 · 2NF
// ═══════════════════════════════════════════════════════════════════════
const ASK: { k: string; label: string; answer: string }[] = [
  { k: 'qty', label: 'Qty', answer: 'Both. Order 1001 has 1 Chicken Pizza and order 1003 has 2. You need the order and the item.' },
  { k: 'price', label: 'Price', answer: 'Just the Item. A Chicken Pizza is $18 whatever order it is in.' },
  { k: 'date', label: 'Date', answer: 'Just the Order. Order 1001 was on 3 March, whatever was in it.' },
  { k: 'cust', label: 'Cust ID', answer: 'Just the Order. Order 1001 was placed by C1.' },
  { k: 'name', label: 'Customer', answer: 'Just the Order. Order 1001 is Amaya’s.' },
  { k: 'phone', label: 'Phone', answer: 'Just the Order. The order tells you the customer, and so her phone.' },
];

function SecondNF() {
  const printing = usePrinting();
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [split, setSplit] = useState(false);

  const all = printing || split || shown.size === ASK.length;
  const isShown = (k: string) => all || shown.has(k);
  const done = split || printing;

  const reveal = (k: string) => setShown(prev => new Set(prev).add(k));

  return (
    <div className="ns-stage">
      <NTable
        name="The 1NF table, coloured by what each column needs"
        tone="key"
        cols={cols1NF(isShown)}
        rows={firstRows()}
        tint
      />

      <div className="ns-legend">
        <Swatch g="key">Key: Order + Item</Swatch>
        <Swatch g="whole">Needs both</Swatch>
        <Swatch g="item">Needs only the Item</Swatch>
        <Swatch g="order">Needs only the Order</Swatch>
      </div>

      <p className="ns-find__q">For each column, ask: to know this value, what do I need? Tap a card.</p>
      <div className="ns-askgrid">
        {ASK.map((a, i) => {
          const on = isShown(a.k);
          const g = DEPENDS[a.k];
          return (
            <motion.button
              key={a.k}
              type="button"
              className={`ns-ask${on ? ` ns-ask--on ns-ask--${g}` : ''}`}
              onClick={() => reveal(a.k)}
              aria-pressed={on}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.06 }}
            >
              <span className="ns-ask__col">{a.label}</span>
              {on ? (
                <motion.span
                  key="a"
                  className="ns-ask__a"
                  initial={{ opacity: 0, rotateX: -70 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {a.answer}
                </motion.span>
              ) : (
                <span className="ns-ask__q">To know the {a.label}, what do I need?</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {!printing && (
        <div className="ns-stage__bar ns-stage__bar--foot">
          {!all && (
            <button
              type="button"
              className="bt-btn bt-btn--sm bt-btn--tertiary"
              onClick={() => setShown(new Set(ASK.map(a => a.k)))}
            >
              Show all answers
              <span className="bt-btn__badge" aria-hidden="true">→</span>
            </button>
          )}
          {!split ? (
            <button type="button" className="bt-btn bt-btn--sm" onClick={() => setSplit(true)}>
              Split by colour
              <span className="bt-btn__badge" aria-hidden="true">↓</span>
            </button>
          ) : (
            <button
              type="button"
              className="bt-btn bt-btn--sm bt-btn--tertiary"
              onClick={() => {
                setSplit(false);
                setShown(new Set());
              }}
            >
              Start again
              <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={11} /></span>
            </button>
          )}
        </div>
      )}

      {done && (
        <>
          <motion.div
            className="ns-splitdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ArrowDown size={18} /> One table per colour
          </motion.div>
          <div className="ns-split ns-split--3">
            {[
              <NTable key="i" name="Order items" tone="whole" cols={T_ITEMS} rows={itemRows()} tint compact />,
              <NTable key="m" name="Menu" tone="item" cols={T_MENU} rows={menuRows()} tint compact />,
              <NTable
                key="o"
                name="Orders"
                tone="order"
                cols={T_ORDERS_2NF.map(c => (c.isKey ? c : as(c, 'order')))}
                rows={orderRows()}
                tint
                compact
                cellTone={(r, c) => ((c === 'name' || c === 'phone') && r !== '1002' ? 'warn' : undefined)}
              />,
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 + i * 0.16 }}
              >
                {t}
              </motion.div>
            ))}
          </div>
          <p className="ns-note">
            The keys travel with their columns: Order items keeps both, Menu keeps Item, Orders keeps Order. The
            price of a Chicken Pizza is now written once. But Orders still repeats Amaya’s name and phone (in
            orange). That is the job for step 3.
          </p>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 5 · 3NF
// ═══════════════════════════════════════════════════════════════════════
function Chain() {
  const boxes: [string, string, Group][] = [
    ['Order', '1001', 'order'],
    ['Cust ID', 'C1', 'order'],
    ['Customer and Phone', 'Amaya · 021 555 0101', 'cust'],
  ];
  return (
    <div className="ns-chain">
      {boxes.map(([label, value, g], i) => (
        <div key={label} className="ns-chain__part">
          {i > 0 && (
            <motion.span
              className="ns-chain__arrow"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.2 + i * 0.45 }}
            >
              <span>tells you</span>
              <ArrowRight size={20} />
            </motion.span>
          )}
          <motion.div
            className={`ns-chain__box ns-chain__box--${g}`}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.45 }}
          >
            <span>{label}</span>
            <b>{value}</b>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

function ThirdNF() {
  const printing = usePrinting();
  const [split, setSplit] = useState(false);
  const done = split || printing;

  return (
    <div className="ns-stage">
      <Chain />
      <p className="ns-note ns-note--center">
        The order tells you the customer, and the customer tells you the name and phone. The phone number is a fact
        about Amaya, not about order 1001.
      </p>

      {(!done || printing) && (
        <NTable
          name={printing ? 'Before: Orders, from step 2' : 'Orders, from step 2'}
          tone="order"
          cols={T_ORDERS_2NF}
          rows={orderRows()}
          tint
          cellTone={(r, c) => ((c === 'name' || c === 'phone') && r !== '1002' ? 'warn' : undefined)}
          caption="Customer and Phone (amber) depend on Cust ID, not on Order. Amaya is typed twice."
        />
      )}

      {!printing && (
        <div className="ns-stage__bar ns-stage__bar--foot">
          {!split ? (
            <button type="button" className="bt-btn bt-btn--sm" onClick={() => setSplit(true)}>
              Move the customer details out
              <span className="bt-btn__badge" aria-hidden="true">↓</span>
            </button>
          ) : (
            <button type="button" className="bt-btn bt-btn--sm bt-btn--tertiary" onClick={() => setSplit(false)}>
              Start again
              <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={11} /></span>
            </button>
          )}
        </div>
      )}

      {done && (
        <>
          <div className="ns-split ns-split--2">
            {[
              <NTable key="o" name="Orders" tone="order" cols={T_ORDERS} rows={orderRows()} tint />,
              <NTable key="c" name="Customers" tone="cust" cols={T_CUSTOMERS} rows={customerRows()} tint />,
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.18 }}
              >
                {t}
              </motion.div>
            ))}
          </div>
          <p className="ns-note">
            Cust ID stays in Orders, so each order still points to its customer. It becomes the key of the new
            Customers table. Amaya is now written once.
          </p>
        </>
      )}
    </div>
  );
}

function MemoryLine() {
  const parts: [string, string, Group][] = [
    ['the key', '1NF', 'key'],
    ['the whole key', '2NF', 'whole'],
    ['and nothing but the key', '3NF', 'cust'],
  ];
  return (
    <Pop className="ns-memory">
      <p className="bt-eyebrow">One line to remember</p>
      <p className="ns-memory__line">
        Every column should be about{' '}
        {parts.map(([text, nf, g], i) => (
          <span key={nf} className="ns-memory__seg">
            <span className={`ns-memory__text ns-memory__text--${g}`}>
              {text}
              <motion.i
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.4 }}
              />
            </span>
            <motion.span
              className={`ns-memory__nf ns-h--${g}`}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.4 }}
            >
              {nf}
            </motion.span>
            {i < parts.length - 1 ? ', ' : '.'}
          </span>
        ))}
      </p>
    </Pop>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 6 · The result, and the same problems again
// ═══════════════════════════════════════════════════════════════════════
type Act = null | 'phone' | 'pizza' | 'cancel';

const ACTS: { id: Exclude<Act, null>; label: string; icon: typeof Copy; said: string }[] = [
  {
    id: 'phone',
    label: 'Amaya changes her number',
    icon: Copy,
    said: 'One cell changed. Orders 1001 and 1003 both point to C1, so both see the new number. Nothing can disagree.',
  },
  {
    id: 'pizza',
    label: 'Add a Hawaiian Pizza',
    icon: PlusCircle,
    said: 'The Menu table is about pizzas, not orders, so the new pizza just gets its own row. No fake order needed.',
  },
  {
    id: 'cancel',
    label: 'Cancel order 1002',
    icon: Trash2,
    said: 'The order is gone. Ravi is still a customer, and the Veggie Pizza still costs $16.',
  },
];

function Link({ area, label, horizontal }: { area: string; label: string; horizontal?: boolean }) {
  return (
    <div className={`ns-link${horizontal ? ' ns-link--h' : ''}`} style={{ gridArea: area }}>
      <motion.i
        className="ns-link__line"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
      />
      <motion.span
        className="ns-link__label"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.8 }}
      >
        <KeyRound size={12} /> {label}
      </motion.span>
    </div>
  );
}

function Result() {
  const printing = usePrinting();
  const [picked, setAct] = useState<Act>(null);
  // The PDF shows the tables as designed; the three outcomes are written out under them.
  const act = printing ? null : picked;

  const customers = customerRows(act === 'phone' ? '021 555 0199' : '021 555 0101');
  const orders = orderRows().map(r => (act === 'cancel' && r.id === '1002' ? { ...r, state: 'gone' as const } : r));
  const items = itemRows().map(r => (act === 'cancel' && r.id.startsWith('1002') ? { ...r, state: 'gone' as const } : r));
  const menu: Row[] =
    act === 'pizza'
      ? [...menuRows(), { id: 'Hawaiian Pizza', state: 'new', cells: { item: 'Hawaiian Pizza', price: '$17' } }]
      : menuRows();

  const custTone = (r: string, c: string): CellTone | undefined =>
    act === 'phone' && r === 'C1' && c === 'phone' ? 'good' : act === 'cancel' && r === 'C2' && c !== 'cust' ? 'good' : undefined;
  const menuTone = (r: string): CellTone | undefined =>
    (act === 'pizza' && r === 'Hawaiian Pizza') || (act === 'cancel' && r === 'Veggie Pizza') ? 'good' : undefined;

  const a = ACTS.find(x => x.id === act);

  return (
    <div className="ns-stage">
      {!printing && (
        <div className="ns-rerun">
          <p className="ns-find__q">Try the same three problems on the new tables.</p>
          <div className="ns-find__btns">
            {ACTS.map(x => {
              const Icon = x.icon;
              return (
                <button
                  key={x.id}
                  type="button"
                  className="bt-tab"
                  aria-pressed={act === x.id}
                  onClick={() => setAct(act === x.id ? null : x.id)}
                >
                  <Icon size={14} /> {x.label}
                </button>
              );
            })}
            {act && (
              <button type="button" className="bt-btn bt-btn--sm bt-btn--tertiary" onClick={() => setAct(null)}>
                Reset
                <span className="bt-btn__badge" aria-hidden="true"><RotateCcw size={11} /></span>
              </button>
            )}
          </div>
          {a && <Said tone="good" id={a.id}>{a.said}</Said>}
        </div>
      )}

      <div className="ns-schema">
        <div style={{ gridArea: 'cust' }}>
          <NTable name="Customers" tone="cust" cols={T_CUSTOMERS} rows={customers} cellTone={custTone} tint compact />
        </div>
        <Link area="l1" label="Cust ID" horizontal />
        <div style={{ gridArea: 'orders' }}>
          <NTable name="Orders" tone="order" cols={T_ORDERS} rows={orders} tint compact />
        </div>
        <Link area="l2" label="Order" />
        <div style={{ gridArea: 'items' }}>
          <NTable name="Order items" tone="whole" cols={T_ITEMS} rows={items} tint compact />
        </div>
        <Link area="l3" label="Item" horizontal />
        <div style={{ gridArea: 'menu' }}>
          <NTable name="Menu" tone="item" cols={T_MENU} rows={menu} cellTone={menuTone} tint compact />
        </div>
      </div>

      {printing && (
        <ul className="ns-printacts">
          {ACTS.map(x => (
            <li key={x.id}>
              <b>{x.label}.</b> {x.said}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const STATS: [string, number, number][] = [
  ['Times Amaya’s phone number is stored', 4, 1],
  ['Times the Chicken Pizza price is stored', 2, 1],
  ['Places to fix when a price goes up', 2, 1],
];

function Stats() {
  return (
    <div className="ns-stats">
      {STATS.map(([label, from, to], i) => (
        <Pop key={label} className="ns-stat" delay={i * 0.1}>
          <div className="ns-stat__nums">
            <span className="ns-stat__old">
              {from}
              <motion.i
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              />
            </span>
            <ArrowRight size={20} />
            <motion.span
              className="ns-stat__new"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.8 + i * 0.1 }}
            >
              {to}
            </motion.span>
          </div>
          <span className="ns-stat__label">{label}</span>
        </Pop>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Check yourself
// ═══════════════════════════════════════════════════════════════════════
const CHECK: QuizQuestion[] = [
  {
    q: 'A cell says “Maths, Science, English”. Which step fixes this?',
    answer: 0,
    options: [
      { text: '1NF', why: 'Right. One value in each cell is the 1NF rule. Give each subject its own row.' },
      { text: '2NF', why: '2NF is about columns that need only part of the key. A list in a cell is an earlier problem, fixed in 1NF.' },
      { text: '3NF', why: '3NF is about columns that depend on other columns. Lists in cells are fixed first, in 1NF.' },
      { text: 'Nothing, it is fine', why: 'A list in a cell is hard to search and update. To find everyone taking Science you would have to read inside every cell.' },
    ],
  },
  {
    q: 'Enrolments has StudentID, CourseID, StudentName and Grade. The key is StudentID and CourseID together. Which column breaks 2NF?',
    answer: 0,
    options: [
      { text: 'StudentName', why: 'Right. You only need the StudentID to know the name. It needs part of the key, so it moves to a Students table.' },
      { text: 'Grade', why: 'A grade needs both: which student and which course. That is the whole key, so Grade stays.' },
      { text: 'CourseID', why: 'CourseID is part of the key. The 2NF question is asked about the columns that are not in the key.' },
      { text: 'None of them', why: 'StudentName needs only StudentID, which is part of the key. That is exactly what 2NF does not allow.' },
    ],
  },
  {
    q: 'Staff has StaffID, Name, DeptID and DeptName. The key is StaffID. What is wrong?',
    answer: 2,
    options: [
      { text: 'It breaks 1NF', why: 'Every cell holds one value, so 1NF is fine.' },
      { text: 'It breaks 2NF', why: 'The key is one column, so no column can depend on part of it. A one-column key can’t break 2NF.' },
      { text: 'DeptName depends on DeptID, not on StaffID', why: 'Right. Know the DeptID and you know the DeptName. One non-key column depends on another, which breaks 3NF. Move DeptID and DeptName to a Departments table and keep DeptID in Staff.' },
      { text: 'Nothing is wrong', why: 'Every person in Sales repeats the name “Sales”. Rename the department and you must fix every one of those rows.' },
    ],
  },
  {
    q: 'In the shop’s first sheet, why can’t the owner add the Hawaiian Pizza price before anyone orders one?',
    answer: 1,
    options: [
      { text: 'Pizza names can’t be stored in a table', why: 'They can. In the finished design they live in the Menu table.' },
      { text: 'Every row is an order, so a pizza on its own has no row', why: 'Right. The sheet mixes orders and prices together, so a price can only be written down as part of an order.' },
      { text: 'The sheet is already in 3NF', why: 'It is not even in 1NF. In 3NF there is a Menu table, and the new pizza just gets a row there.' },
      { text: 'The price is missing a key', why: 'Close, but the real issue is that there is no table about pizzas at all. Once there is a Menu table, Item is its key.' },
    ],
  },
  {
    q: 'A table is in 1NF and its key is a single column. Which is true?',
    answer: 0,
    options: [
      { text: 'It is already in 2NF', why: 'Right. 2NF is about depending on part of the key. A one-column key has no parts, so there is nothing to break.' },
      { text: 'It is already in 3NF', why: 'Not always. A column can still depend on another non-key column, like DeptName on DeptID.' },
      { text: 'It needs a second key column', why: 'No. A key should be as small as it can be while still picking out one row.' },
      { text: 'It can’t be normalised further', why: 'It can still have a 3NF problem, so it may need another split.' },
    ],
  },
  {
    q: 'What is the main point of normalisation?',
    answer: 2,
    options: [
      { text: 'Fewer tables', why: 'It usually gives you more tables, each one smaller and about one thing.' },
      { text: 'Remove every repeated value', why: 'Some repeats are needed. C1 appears in Orders twice, and that is how both orders point to Amaya. What goes is repeated facts, like her phone number.' },
      { text: 'Store each fact once, so copies can’t disagree', why: 'Right. The rest follows from this: less typing, no contradictions, and adding or deleting one thing doesn’t break another.' },
      { text: 'Make every query faster', why: 'Speed is not the reason. Joining tables can even make some reads slower. The reason is data you can trust.' },
    ],
  },
];

function Check() {
  const printing = usePrinting();
  if (printing) {
    return (
      <ol className="ns-printquiz">
        {CHECK.map(q => (
          <li key={q.q} className="ns-avoid">
            <p className="ns-printquiz__q">{q.q}</p>
            <p>
              <b>Answer: {q.options[q.answer].text}.</b> {q.options[q.answer].why.replace(/^Right\.\s*/, '')}
            </p>
          </li>
        ))}
      </ol>
    );
  }
  return <Quiz questions={CHECK} closing="That’s all six. If one surprised you, go back to that step and try its buttons again." />;
}

// ═══════════════════════════════════════════════════════════════════════
// The page body
// ═══════════════════════════════════════════════════════════════════════
export default function NormalisationSimpleLesson() {
  return (
    <div className="ns">
      {/* ══ 1 · Why ══════════════════════════════════════════════════════ */}
      <section id="why" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="1 · Why it matters"
            title="Store each fact once"
            stop="."
            aside="Normalisation means splitting a big table into smaller ones, so every piece of information is written in one place only."
          />
        </Reveal>
        <CopiesPicture />
        <Benefits />

        <Reveal delay={0.05}>
          <div className="ns-subhead">
            <h3>Meet the pizza shop</h3>
            <p>
              A small pizza shop takes orders by phone. The owner writes every order on one sheet, like this. Pick a
              problem below and press the button to see what goes wrong.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <ProblemDemo />
        </Reveal>
      </section>

      {/* ══ 2 · The plan ═════════════════════════════════════════════════ */}
      <section id="plan" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="2 · The plan"
            title="Three steps, one at a time"
            stop="."
            aside="Each step fixes one kind of mess. A table must pass a step before it can move to the next."
          />
        </Reveal>
        <Ladder />
        <Reveal delay={0.05}>
          <div className="ns-subhead">
            <h3>Two words you need first</h3>
          </div>
        </Reveal>
        <TwoWords />
      </section>

      {/* ══ 3 · 1NF ══════════════════════════════════════════════════════ */}
      <section id="first" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="3 · Step 1 · First normal form"
            title="One value in each cell"
            stop="."
            aside="No lists inside a cell. If an order has two pizzas, that is two rows."
          />
        </Reveal>
        <RuleBox label="The 1NF rule" tone="key">
          Every cell holds <b>one value</b>, and every row can be picked out by a <b>key</b>.
        </RuleBox>
        <ol className="ns-how">
          {HOW_1NF.map(([t, b], i) => (
            <Pop key={t} className="ns-how__step" delay={i * 0.1}>
              <span className="ns-how__n">{i + 1}</span>
              <span>
                <b>{t}</b> {b}
              </span>
            </Pop>
          ))}
        </ol>
        <Reveal delay={0.05}>
          <FirstNF />
        </Reveal>
      </section>

      {/* ══ 4 · 2NF ══════════════════════════════════════════════════════ */}
      <section id="second" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="4 · Step 2 · Second normal form"
            title="Every column needs the whole key"
            stop="."
            aside="Our key is two columns, Order and Item. A column that needs only one of them is in the wrong table."
          />
        </Reveal>
        <RuleBox label="The 2NF rule" tone="whole">
          The table is in 1NF, and every other column needs <b>the whole key</b>, not just part of it.
          <span className="ns-rule__aside">
            If the key is a single column, there are no parts, so the table is already in 2NF.
          </span>
        </RuleBox>
        <Reveal delay={0.05}>
          <SecondNF />
        </Reveal>
      </section>

      {/* ══ 5 · 3NF ══════════════════════════════════════════════════════ */}
      <section id="third" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="5 · Step 3 · Third normal form"
            title="Columns depend on the key, not on each other"
            stop="."
            aside="If one ordinary column tells you another, those two belong in their own table."
          />
        </Reveal>
        <RuleBox label="The 3NF rule" tone="cust">
          The table is in 2NF, and no column depends on <b>another column that is not the key</b>.
          <span className="ns-rule__aside">
            Quick test: cover the key. Can one of the other columns tell you another? If yes, move them out.
          </span>
        </RuleBox>
        <Reveal delay={0.05}>
          <ThirdNF />
        </Reveal>
        <MemoryLine />
      </section>

      {/* ══ 6 · The result ═══════════════════════════════════════════════ */}
      <section id="result" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="6 · The result"
            title="Four small tables, each about one thing"
            stop="."
            aside="Customers, Orders, Order items and Menu. The keys link them, so nothing is lost and nothing is typed twice."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Result />
        </Reveal>
        <Stats />
      </section>

      {/* ══ Check ════════════════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Check yourself"
            title="Six quick questions"
            aside="Answer, read why, move on. Nothing is stored and there is no pass mark."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Check />
        </Reveal>
      </section>

      <Recap
        title="One sheet became four tables, and each fact now lives in one place."
        points={[
          ['Store each fact once.', 'Copies drift apart. One copy can’t disagree with itself.'],
          ['1NF: one value in each cell.', 'Lists become rows, and a key picks out each row.'],
          ['2NF: every column needs the whole key.', 'Price needed only the Item, so it moved to Menu.'],
          ['3NF: columns depend on the key, not on each other.', 'Customer details moved to Customers, linked by Cust ID.'],
          ['Check with one question.', 'For each column ask: to know this value, what do I need?'],
        ]}
      />

      {/* ══ Save as PDF ══════════════════════════════════════════════════ */}
      <section id="pdf" className="bt-sec ns-noprint">
        <Reveal>
          <div className="ns-pdf">
            <div className="ns-pdf__art" aria-hidden="true">
              <motion.div
                className="ns-pdf__sheet"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <i /><i /><i className="ns-pdf__c1" /><i /><i className="ns-pdf__c2" /><i />
              </motion.div>
              <Printer size={46} strokeWidth={1.6} />
            </div>
            <div>
              <p className="bt-eyebrow">Take it with you</p>
              <h2>
                Save this page as a PDF<span className="bt-stop">.</span>
              </h2>
              <p className="ns-pdf__lead">
                The PDF keeps the colours and every table, with each step shown finished and the answers to the
                questions written out.
              </p>
              <ol className="ns-pdf__steps">
                <li>Press the button below.</li>
                <li>In the window that opens, set the destination to <b>Save as PDF</b>.</li>
                <li>Press <b>Save</b>.</li>
              </ol>
              <button type="button" className="bt-btn" onClick={savePageAsPdf}>
                Save as PDF
                <span className="bt-btn__badge" aria-hidden="true">↓</span>
              </button>
              <p className="bt-note">
                If the colours come out grey, open More settings and tick Background graphics.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bt-sec ns-copyright">
        <p className="bt-note">© All rights reserved · Yasas Sri Wickramasinghe</p>
      </section>
    </div>
  );
}
