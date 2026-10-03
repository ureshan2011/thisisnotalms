import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

// ─── Eight questions you can answer from the data card alone ──────────────
// The student answers on paper first, then opens the answer. Every answer
// says where on the Kaggle page it lives, because the skill being taught is
// finding it, not knowing it. The answers are checked against the live page
// (October 2026) and against the CSV itself.

const QS: { q: string; where: string; a: ReactNode }[] = [
  {
    q: 'How many people are in it, and how many columns?',
    where: 'Data Explorer, below the card',
    a: <><b>1,338 rows and 7 columns.</b> The Data Explorer says "This dataset consists of 1338 rows", and the Summary on the right says 7 columns.</>,
  },
  {
    q: 'Which column are we trying to predict, and what does it measure?',
    where: 'Content → Columns, and Inspiration',
    a: <><b>charges.</b> Each person's individual medical costs, billed by their health insurance. The card's own Inspiration line asks "Can you accurately predict insurance costs?"</>,
  },
  {
    q: 'Which country are these people in, and what currency are the charges?',
    where: 'The description of the region column',
    a: <><b>The United States, so US dollars.</b> Region is "the beneficiary's residential area in the US". Nothing here describes New Zealand's health system.</>,
  },
  {
    q: 'Are these real patients?',
    where: 'The Context paragraph at the top',
    a: <><b>No.</b> The card says the data comes from a textbook, <i>Machine Learning with R</i> by Brett Lantz. The book says it was simulated from US Census Bureau statistics. Fine for learning. You wouldn't price a real policy off it.</>,
  },
  {
    q: 'Are you allowed to use it?',
    where: 'License, on the right',
    a: <><b>Yes.</b> It's under the Open Database License (ODbL). You can use it and share it as long as you credit where it came from, so name it and link it in your report.</>,
  },
  {
    q: 'Is anything missing?',
    where: 'Data Explorer → the Column tab',
    a: <><b>Nothing.</b> Every column shows 0 missing. You'll still check in Python in step 6, because "the website said so" isn't evidence.</>,
  },
  {
    q: 'Kaggle says the smoker column is 100% "mismatched". Is it broken?',
    where: 'Column tab → smoker',
    a: <><b>No.</b> Kaggle guessed it was a true/false column, but the file says "yes" and "no", so none of the values matched its guess. The data is fine. It's a useful hint, though: a model can't read "yes" either, which is why you'll turn it into 1 and 0.</>,
  },
  {
    q: 'Read the small grey line under each column name in the Data Explorer. Notice anything?',
    where: 'Data Explorer, Detail or Column tab',
    a: <><b>They're in Spanish, and one disagrees with the card.</b> Under charges it says "Prima del seguro", the insurance <i>premium</i>: what a customer pays. The English card says medical costs billed: what the insurer pays out. Those are different things. When two descriptions disagree, go back to the original source. The textbook treats them as medical costs, so trust the English card.</>,
  },
];

export default function DataCardQuestions() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="lr-qs">
      {QS.map((item, i) => (
        <div key={item.q} className="lr-q">
          <div className="lr-q__row">
            <span className="lr-q__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
            <h4>
              {item.q}
              <span className="lr-q__where">Where to look: {item.where}</span>
            </h4>
            <button type="button" className="lr-navbtn" aria-expanded={open.has(i)} onClick={() => toggle(i)}>
              {open.has(i) ? 'Hide' : 'Check my answer'}
            </button>
          </div>
          {open.has(i) && (
            <motion.p
              className="lr-q__ans"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {item.a}
            </motion.p>
          )}
        </div>
      ))}
    </div>
  );
}
