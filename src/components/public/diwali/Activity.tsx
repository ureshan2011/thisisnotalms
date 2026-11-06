import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { KeyRound, Receipt, RotateCcw, Sparkles, User } from 'lucide-react';
import { Bow, Diya, Sweet, type SweetName } from './Art';
import { audio } from './audio';

// ─── Light the three diyas: 1NF, 2NF and 3NF on a sweet shop's orders ────
// Before Diwali every home gets a deep clean, and everything goes back in its
// own place. The activity does the same to a messy order sheet. Each step is
// one small action, and each one lights a diya.
//   1. Tap the box holding two sweets: it splits into rows (1NF).
//   2. Put Customer, Phone, Price and Boxes into the box they belong in (2NF).
//   3. Decide who a phone number belongs to: the order or the customer (3NF).

export type Col = 'order' | 'customer' | 'phone' | 'sweet' | 'boxes' | 'price';

interface Row {
  order: string;
  customer: string;
  phone: string;
  sweet: SweetName;
  boxes: number;
  price: number;
}

const ROWS: Row[] = [
  { order: '101', customer: 'Priya', phone: '021 555 0101', sweet: 'Ladoo', boxes: 2, price: 12 },
  { order: '101', customer: 'Priya', phone: '021 555 0101', sweet: 'Barfi', boxes: 1, price: 15 },
  { order: '102', customer: 'Arjun', phone: '022 555 0202', sweet: 'Jalebi', boxes: 3, price: 10 },
  { order: '103', customer: 'Priya', phone: '021 555 0101', sweet: 'Ladoo', boxes: 1, price: 12 },
];

export const LABEL: Record<Col, string> = {
  order: 'Order',
  customer: 'Customer',
  phone: 'Phone',
  sweet: 'Sweet',
  boxes: 'Boxes',
  price: 'Price',
};

/** Keep the first row for each value of `by`, in order. */
function unique<T>(rows: T[], by: (r: T) => string): T[] {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const k = by(r);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export const FINAL = {
  customers: unique(ROWS, (r) => r.customer),
  orders: unique(ROWS, (r) => r.order),
  lines: ROWS,
  sweets: unique(ROWS, (r) => r.sweet),
};

function Value({ col, row }: { col: Col; row: Row }) {
  if (col === 'sweet')
    return (
      <span className="dw-sw">
        <Sweet name={row.sweet} size={20} />
        {row.sweet}
      </span>
    );
  if (col === 'price') return <>${row.price}</>;
  return <>{row[col]}</>;
}

/** A small table. `keys` get a key icon; `mark` decides which cells glow. */
export function MiniTable({
  cols,
  rows,
  keys = [],
  mark,
  className = '',
}: {
  cols: Col[];
  rows: Row[];
  keys?: Col[];
  mark?: (row: Row, col: Col, i: number) => string | undefined;
  className?: string;
}) {
  return (
    <div className={`dw-tablewrap ${className}`}>
      <table className="dw-table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} className={keys.includes(c) ? 'is-key' : undefined}>
                {keys.includes(c) && <KeyRound size={12} aria-label="key" />}
                {LABEL[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={`${r.order}-${r.sweet}-${r.customer}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              {cols.map((c) => (
                <td key={c} className={mark?.(r, c, i)}>
                  <Value col={c} row={r} />
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A sweet box with a ribbon: how every finished table is drawn. */
export function SweetBox({
  title,
  icon,
  tone,
  children,
  className = '',
}: {
  title: string;
  icon?: ReactNode;
  tone: 'pink' | 'gold' | 'teal' | 'violet';
  children: ReactNode;
  className?: string;
}) {
  const bow = { pink: '#ffd36b', gold: '#e0218a', teal: '#ffd36b', violet: '#ffd36b' }[tone];
  return (
    <div className={`dw-box dw-box--${tone} ${className}`}>
      <div className="dw-box__bow">
        <Bow color={bow} />
      </div>
      <div className="dw-box__title">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

// ── Step 1 ───────────────────────────────────────────────────────────────
// The lists come first, so on a phone the cell to find is on screen.
const MESSY_COLS: Col[] = ['order', 'sweet', 'boxes', 'price', 'customer', 'phone'];

function StepOne({ done, onDone }: { done: boolean; onDone: () => void }) {
  const [hint, setHint] = useState(false);
  const [shake, setShake] = useState<string | null>(null);

  const tap = (rowKey: string, col: Col, isList: boolean) => {
    if (done) return;
    if (isList) {
      onDone();
      return;
    }
    audio.softNo();
    setHint(true);
    setShake(`${rowKey}-${col}`);
    window.setTimeout(() => setShake(null), 450);
  };

  const listCols: Col[] = ['sweet', 'boxes', 'price'];

  return (
    <div>
      <p className="dw-ask">
        One box in this order sheet is holding <b>two sweets</b>. Tap it.
      </p>
      <div className="dw-tablewrap">
        <table className={`dw-table ${done ? '' : 'dw-table--tap'}`}>
          <thead>
            <tr>
              {MESSY_COLS.map((c) => (
                <th key={c}>{LABEL[c]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!done ? (
              <>
                <tr>
                  {MESSY_COLS.map((c) => {
                    const isList = listCols.includes(c);
                    const key = `101-${c}`;
                    return (
                      <td key={c} className={shake === key ? 'is-shake' : undefined}>
                        <button
                          type="button"
                          className={`dw-cellbtn ${isList ? 'is-list' : ''}`}
                          onClick={() => tap('101', c, isList)}
                        >
                          {c === 'sweet' ? (
                            <span className="dw-sw">
                              <Sweet name="Ladoo" size={18} />
                              <Sweet name="Barfi" size={18} />
                              Ladoo, Barfi
                            </span>
                          ) : c === 'boxes' ? (
                            '2, 1'
                          ) : c === 'price' ? (
                            '$12, $15'
                          ) : (
                            <Value col={c} row={ROWS[0]} />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
                {[ROWS[2], ROWS[3]].map((r) => (
                  <tr key={r.order}>
                    {MESSY_COLS.map((c) => {
                      const key = `${r.order}-${c}`;
                      return (
                        <td key={c} className={shake === key ? 'is-shake' : undefined}>
                          <button type="button" className="dw-cellbtn" onClick={() => tap(r.order, c, false)}>
                            <Value col={c} row={r} />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            ) : (
              ROWS.map((r, i) => (
                <motion.tr
                  key={`${r.order}-${r.sweet}`}
                  layout
                  initial={i === 1 ? { opacity: 0, scale: 0.9 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={r.order === '101' ? 'is-glow' : undefined}
                >
                  {MESSY_COLS.map((c) => (
                    <td key={c}>
                      <Value col={c} row={r} />
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {hint && !done && (
          <motion.p className="dw-hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            That box holds just one thing. Look for a comma.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Step 2 ───────────────────────────────────────────────────────────────
type BoxId = 'orders' | 'sweets' | 'lines';
type ChipId = 'customer' | 'phone' | 'price' | 'boxes';

const CHIPS: { id: ChipId; home: BoxId; why: string }[] = [
  { id: 'customer', home: 'orders', why: 'Who placed order 102? The order number alone tells you: Arjun.' },
  { id: 'price', home: 'sweets', why: 'A Ladoo is $12 in every order. The sweet alone tells you the price.' },
  { id: 'boxes', home: 'lines', why: 'How many boxes? You need both: which order, and which sweet.' },
  { id: 'phone', home: 'orders', why: 'The phone for order 102? The order number is enough.' },
];

const BOXES: { id: BoxId; title: string; need: string; keys: Col[]; tone: 'pink' | 'gold' | 'teal' }[] = [
  { id: 'orders', title: 'Orders', need: 'the order no. tells you', keys: ['order'], tone: 'pink' },
  { id: 'sweets', title: 'Sweets', need: 'the sweet tells you', keys: ['sweet'], tone: 'gold' },
  { id: 'lines', title: 'Order lines', need: 'you need both', keys: ['order', 'sweet'], tone: 'teal' },
];

const BOX_ROWS: Record<BoxId, Row[]> = {
  orders: FINAL.orders,
  sweets: FINAL.sweets,
  lines: FINAL.lines,
};

function StepTwo({ done, onDone }: { done: boolean; onDone: () => void }) {
  const [placed, setPlaced] = useState<Partial<Record<ChipId, BoxId>>>(done ? { customer: 'orders', phone: 'orders', price: 'sweets', boxes: 'lines' } : {});
  const [picked, setPicked] = useState<ChipId | null>(null);
  const [why, setWhy] = useState<string | null>(null);
  const [shake, setShake] = useState<BoxId | null>(null);

  const left = CHIPS.filter((c) => !placed[c.id]);
  const allIn = left.length === 0;

  const pick = (id: ChipId) => {
    audio.tap();
    setPicked(id);
    setWhy(null);
  };

  const drop = (box: BoxId) => {
    if (!picked) {
      setWhy('First tap a detail above, then tap its box.');
      return;
    }
    const chip = CHIPS.find((c) => c.id === picked)!;
    if (chip.home === box) {
      audio.sparkle();
      const next = { ...placed, [picked]: box };
      setPlaced(next);
      setPicked(null);
      setWhy(null);
      if (CHIPS.every((c) => next[c.id])) window.setTimeout(onDone, 500);
    } else {
      audio.softNo();
      setWhy(chip.why);
      setShake(box);
      window.setTimeout(() => setShake(null), 450);
    }
  };

  return (
    <div>
      <p className="dw-ask">
        <b>Order + Sweet</b> together pick out one line. But does every detail need both? Ask:{' '}
        <i>what do I need to know this?</i>
      </p>
      <MiniTable
        cols={MESSY_COLS}
        rows={ROWS}
        keys={['order', 'sweet']}
        className="dw-tablewrap--small"
        mark={(_, c) => {
          const box = placed[c as ChipId];
          return box ? `is-tone-${BOXES.find((b) => b.id === box)!.tone}` : undefined;
        }}
      />

      <LayoutGroup>
        <div className="dw-tray" aria-live="polite">
          {left.length > 0 ? (
            <>
              <span className="dw-tray__label">Tap a detail, then tap its box:</span>
              {left.map((c) => (
                <motion.button
                  layoutId={`chip-${c.id}`}
                  key={c.id}
                  type="button"
                  className={`dw-chip ${picked === c.id ? 'is-picked' : ''}`}
                  onClick={() => pick(c.id)}
                  aria-pressed={picked === c.id}
                >
                  {LABEL[c.id]}
                </motion.button>
              ))}
            </>
          ) : (
            <span className="dw-tray__label">Every detail is in its box.</span>
          )}
        </div>

        <AnimatePresence>
          {why && (
            <motion.p className="dw-hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {why}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="dw-boxes">
          {BOXES.map((b) => {
            const inside = CHIPS.filter((c) => placed[c.id] === b.id).map((c) => c.id);
            return (
              <motion.div
                key={b.id}
                role={allIn ? undefined : 'button'}
                tabIndex={allIn ? undefined : 0}
                aria-label={allIn ? undefined : `${b.title} box: ${b.need}`}
                className={`dw-dropbox dw-box dw-box--${b.tone} ${picked ? 'is-ready' : ''} ${shake === b.id ? 'is-shake' : ''} ${allIn ? 'is-full' : ''}`}
                onClick={allIn ? undefined : () => drop(b.id)}
                onKeyDown={
                  allIn
                    ? undefined
                    : (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          drop(b.id);
                        }
                      }
                }
                whileTap={allIn ? undefined : { scale: 0.98 }}
              >
                <span className="dw-box__bow">
                  <Bow color={b.tone === 'gold' ? '#e0218a' : '#ffd36b'} />
                </span>
                <span className="dw-box__title">{b.title}</span>
                <span className="dw-box__need">{b.need}</span>
                <span className="dw-box__cols">
                  {b.keys.map((k) => (
                    <span key={k} className="dw-chip is-key">
                      <KeyRound size={11} aria-hidden="true" />
                      {LABEL[k]}
                    </span>
                  ))}
                  {inside.map((id) => (
                    <motion.span layoutId={`chip-${id}`} key={id} className="dw-chip is-in">
                      {LABEL[id]}
                    </motion.span>
                  ))}
                </span>
                {allIn && (
                  <MiniTable
                    cols={[...b.keys, ...inside]}
                    rows={BOX_ROWS[b.id]}
                    keys={b.keys}
                    className="dw-tablewrap--inbox"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

// ── Step 3 ───────────────────────────────────────────────────────────────
function StepThree({ done, onDone }: { done: boolean; onDone: () => void }) {
  const [wrong, setWrong] = useState(false);

  const answer = (who: 'order' | 'customer') => {
    if (done) return;
    if (who === 'customer') onDone();
    else {
      audio.softNo();
      setWrong(true);
    }
  };

  return (
    <div>
      {!done ? (
        <>
          <p className="dw-ask">
            Look at the Orders box. Priya&rsquo;s phone is <b>still written twice</b>. Who does a phone number really
            belong to?
          </p>
          <SweetBox title="Orders" tone="pink" icon={<Receipt size={15} aria-hidden="true" />}>
            <MiniTable
              cols={['order', 'customer', 'phone']}
              rows={FINAL.orders}
              keys={['order']}
              mark={(r, c) => (c === 'phone' && r.customer === 'Priya' ? 'is-dup' : undefined)}
            />
          </SweetBox>
          <div className="dw-choices">
            <button type="button" className="dw-choice" onClick={() => answer('order')}>
              <Receipt size={18} aria-hidden="true" /> The order
            </button>
            <button type="button" className="dw-choice" onClick={() => answer('customer')}>
              <User size={18} aria-hidden="true" /> The customer
            </button>
          </div>
          <AnimatePresence>
            {wrong && (
              <motion.p className="dw-hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                An order doesn&rsquo;t have a phone. Priya does, and it&rsquo;s the same for all her orders.
              </motion.p>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="dw-split">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <SweetBox title="Orders" tone="pink" icon={<Receipt size={15} aria-hidden="true" />}>
              <MiniTable cols={['order', 'customer']} rows={FINAL.orders} keys={['order']} />
            </SweetBox>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <SweetBox title="Customers" tone="violet" icon={<User size={15} aria-hidden="true" />}>
              <MiniTable
                cols={['customer', 'phone']}
                rows={FINAL.customers}
                keys={['customer']}
                mark={(r, c) => (c === 'phone' && r.customer === 'Priya' ? 'is-fixed' : undefined)}
              />
            </SweetBox>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ── The activity ─────────────────────────────────────────────────────────
const STEPS = [
  { nf: '1NF', title: 'One thing per box', win: 'Every box now holds one thing. That’s 1NF.' },
  { nf: '2NF', title: 'Everything in its own box', win: 'Each detail now sits where it belongs. Ladoo’s price is written once. That’s 2NF.' },
  { nf: '3NF', title: 'No borrowed details', win: 'The phone hangs off the customer, not the order, so it gets its own box. That’s 3NF.' },
];
const PAINT = ['rani', 'gold', 'peacock'] as const;

export default function Activity({
  onLight,
  onComplete,
}: {
  onLight: (el: HTMLElement | null) => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState([false, false, false]);
  const [run, setRun] = useState(0);
  const diyaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);

  const light = (i: number) => {
    setLit((l) => l.map((v, k) => (k === i ? true : v)));
    onLight(diyaRefs.current[i]);
  };

  const next = () => {
    audio.tap();
    setStep((s) => s + 1);
    panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reset = () => {
    audio.tap();
    setStep(0);
    setLit([false, false, false]);
    setRun((r) => r + 1);
  };

  const current = STEPS[step];
  const done = lit[step];

  return (
    <div className="dw-act__card" ref={panel}>
      <div className="dw-act__lamps" role="list" aria-label="Your three diyas">
        {STEPS.map((s, i) => (
          <div
            key={s.nf}
            role="listitem"
            className={`dw-lamp ${lit[i] ? 'is-lit' : ''} ${i === step ? 'is-now' : ''}`}
            ref={(el) => {
              diyaRefs.current[i] = el;
            }}
          >
            <Diya lit={lit[i]} paint={PAINT[i]} size={64} />
            <span className="dw-lamp__nf">{s.nf}</span>
            <span className="dw-lamp__t">{s.title}</span>
            <span className="dw-sr">{lit[i] ? 'lit' : 'not lit yet'}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${run}-${step}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="dw-step"
        >
          <h3 className="dw-step__h">
            <span className="dw-step__n">Diya {step + 1}</span> {current.title}
          </h3>

          {step === 0 && <StepOne done={done} onDone={() => light(0)} />}
          {step === 1 && <StepTwo done={done} onDone={() => light(1)} />}
          {step === 2 && <StepThree done={done} onDone={() => light(2)} />}

          <AnimatePresence>
            {done && (
              <motion.div
                className="dw-win"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={18} aria-hidden="true" />
                <p>
                  <b>Diya {step + 1} is lit!</b> {current.win}
                </p>
                {step < 2 ? (
                  <button type="button" className="dw-btn dw-btn--small" onClick={next}>
                    Next diya →
                  </button>
                ) : (
                  <button type="button" className="dw-btn dw-btn--small dw-btn--glow" onClick={onComplete}>
                    Light up the sky ✨
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button type="button" className="dw-link dw-act__reset" onClick={reset}>
          <RotateCcw size={13} aria-hidden="true" /> Start again
        </button>
      )}
    </div>
  );
}
