import { highlight } from './pyHighlight';

// ─── The only Python the playgrounds use ──────────────────────────────────
// Ten pieces, each with an example taken from the programs below it and a
// meaning in plain words. If a line in a playground uses something that is
// not on this card, the playground is too hard and should be rewritten.

const WORDS: [string, string][] = [
  ['# a note', 'A note for people. Python skips everything after the #.'],
  ['size = 52', 'Store a value under a name. Read = as “is now”.'],
  ['[28, 35, 41]', 'A list: several values in order, inside square brackets.'],
  ['size[0]', 'Pick one item from a list. Counting starts at 0, so this is the first.'],
  ['print("hello")', 'Show something on the screen.'],
  ['f"Rent is {rent}"', 'Text with a value dropped in. The f in front lets you put a name inside { }.'],
  ['for i in range(12):', 'Repeat the lines under it 12 times, with i = 0, 1, 2 … 11.'],
  ['if visits < 4:', 'Only run the lines under it when this is true. else: is what happens otherwise.'],
  ['def total_miss(…):', 'Make your own command. return hands the answer back.'],
  ['    (four spaces)', 'The spaces at the start of a line matter. They show which lines belong together.'],
];

export default function PythonWords() {
  return (
    <ul className="bt-pw">
      {WORDS.map(([code, meaning]) => (
        <li key={code}>
          <code>{highlight(code)}</code>
          <span>{meaning}</span>
        </li>
      ))}
    </ul>
  );
}
