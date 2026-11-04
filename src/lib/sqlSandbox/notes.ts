// ─── The beginner path as PDF notes ───────────────────────────────────────
// Built from the same level data the app runs on, so the notes never drift
// from the lessons. Each student's PDF uses their own business, so their
// notes match what they typed.

import type { NoteBlock, NotesDoc, NoteSection } from '../notesPdf';
import { LEVELS } from './levels';
import type { Theme } from './themes';

const plain = (s: string) => s.replace(/`/g, '');

export function buildNotes(t: Theme): NotesDoc {
  const sections: NoteSection[] = [
    {
      heading: 'How to use these notes',
      standfirst: 'Eight short levels, from nothing to building a small database on your own.',
      blocks: [
        {
          type: 'p',
          text: `Every example uses your own business from the sandbox: ${t.business}, with a database called ${t.db} and a table called ${t.table}. Read a level here, then do it in the sandbox. Typing it yourself is what makes it stick.`,
        },
        {
          type: 'bullets',
          items: [
            'Text goes in single quotes. Numbers do not.',
            'Every statement ends with a semicolon.',
            'UPDATE and DELETE almost always need a WHERE.',
            'Errors are normal. Read them; they tell you what went wrong.',
          ],
        },
      ],
    },
  ];

  for (const level of LEVELS) {
    const blocks: NoteBlock[] = [{ type: 'bullets', items: level.learn.map(l => `You will: ${l}`) }];
    for (const s of level.steps(t)) {
      if (s.say) {
        const lines = s.say.split('\n');
        const text = lines.filter(l => !l.startsWith('- ')).join(' ');
        const items = lines.filter(l => l.startsWith('- ')).map(l => plain(l.slice(2)));
        if (text.trim()) blocks.push({ type: 'p', text: plain(text) });
        if (items.length) blocks.push({ type: 'bullets', items });
      }
      switch (s.kind) {
        case 'sql': {
          const code = s.solution ?? s.starter;
          blocks.push({ type: 'p', text: `Try it: ${plain(s.task)}` });
          if (code && !code.includes('___')) blocks.push({ type: 'code', text: code });
          if (s.after) blocks.push({ type: 'p', text: plain(s.after) });
          break;
        }
        case 'choose':
        case 'predict':
          blocks.push({
            type: 'callout',
            title: s.kind === 'predict' ? 'Predict first' : 'Quick check',
            text: `${s.question}${s.code ? `  ${s.code.replace(/\n/g, ' ')}` : ''}  Answer: ${s.options[s.answer]}. ${s.why[s.answer]}`,
          });
          break;
        case 'order':
          blocks.push({ type: 'code', text: s.pieces.join('\n') });
          if (s.after) blocks.push({ type: 'p', text: s.after });
          break;
        case 'boss':
          blocks.push({ type: 'bullets', items: s.items.map(i => i.label) });
          if (s.solution) blocks.push({ type: 'callout', title: 'One way to do it (try it yourself first)', text: s.solution.replace(/\n/g, ' ') });
          break;
      }
    }
    sections.push({ heading: `Level ${level.n}: ${level.title}`, standfirst: level.tagline, blocks });
  }

  sections.push({
    heading: 'Cheat sheet',
    standfirst: 'Every command from the eight levels, on one page.',
    blocks: [
      {
        type: 'table',
        head: ['Command', 'What it does', 'Example'],
        weights: [1.1, 1.4, 2.2],
        rows: [
          ['CREATE DATABASE', 'Makes a new, empty database', `CREATE DATABASE ${t.db};`],
          ['USE', 'Picks the database to work in', `USE ${t.db};`],
          ['SHOW TABLES', 'Lists the tables in it', 'SHOW TABLES;'],
          ['CREATE TABLE', 'Makes a table: column names and types', `CREATE TABLE ${t.table} (id INT, name VARCHAR(30));`],
          ['DESCRIBE', 'Shows a table\'s columns and types', `DESCRIBE ${t.table};`],
          ['INSERT INTO', 'Adds rows', `INSERT INTO ${t.table} (id, name) VALUES (1, 'Tea');`],
          ['SELECT', 'Reads rows', `SELECT name, price FROM ${t.table} WHERE price < 10;`],
          ['UPDATE', 'Changes rows that match the WHERE', `UPDATE ${t.table} SET price = 5 WHERE id = 1;`],
          ['DELETE FROM', 'Removes rows that match the WHERE', `DELETE FROM ${t.table} WHERE id = 1;`],
          ['DROP TABLE', 'Removes a whole table', 'DROP TABLE old_prices;'],
        ],
      },
      {
        type: 'kv',
        pairs: [
          ['INT', 'Whole numbers: 7, 120'],
          ['DECIMAL(6,2)', 'Money and measurements: 4.50'],
          ['VARCHAR(30)', 'Text, up to 30 characters'],
          ['DATE', "Dates as 'YYYY-MM-DD'"],
          ['PRIMARY KEY', 'A unique id for every row'],
          ['AUTO_INCREMENT', 'The database numbers the rows for you'],
          ['NOT NULL', 'Can not be left empty'],
          ['UNIQUE', 'No repeats'],
          ['DEFAULT', 'Used when a value is left out'],
        ],
      },
    ],
  });

  return {
    code: 'MBI802',
    course: 'Database Management Systems',
    title: 'SQL Sandbox: the basics',
    summary: 'CREATE, INSERT, SELECT, UPDATE and DELETE, one small step at a time, with your own business as the example.',
    accent: [244, 85, 30],
    fileName: 'MBI802-SQL-basics-notes',
    sections,
  };
}
