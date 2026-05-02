export type QuoteType = 'quote' | 'reminder';

export interface QuoteItem {
  text: string;
  author: string;
  label: string;
  type: QuoteType;
}

export const QUOTE_ITEMS: QuoteItem[] = [
  {
    text: 'Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.',
    author: 'Steve Jobs',
    label: 'Apple Co-Founder',
    type: 'quote',
  },
  {
    text: 'Never share your assessment answer scripts via email or Microsoft Teams — your academic integrity defines your professional future.',
    author: 'A reminder from your faculty',
    label: '',
    type: 'reminder',
  },
  {
    text: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.',
    author: 'Albert Einstein',
    label: 'Theoretical Physicist',
    type: 'quote',
  },
  {
    text: 'You are a postgraduate student. Your thesis will be read, cited, and remembered for years — make it something you are genuinely proud of.',
    author: 'A reminder from your faculty',
    label: '',
    type: 'reminder',
  },
  {
    text: 'You should hope to do something in your life that is hard. Things that are easy are not worth doing.',
    author: 'Jensen Huang',
    label: 'CEO, NVIDIA',
    type: 'quote',
  },
  {
    text: 'Logical reasoning is a skill built through practice and discipline — it cannot be outsourced to AI. It must be developed by you.',
    author: 'A reminder from your faculty',
    label: '',
    type: 'reminder',
  },
  {
    text: 'In the middle of every difficulty lies opportunity.',
    author: 'Albert Einstein',
    label: 'Theoretical Physicist',
    type: 'quote',
  },
  {
    text: 'Stay hungry, stay foolish.',
    author: 'Steve Jobs',
    label: 'Apple Co-Founder',
    type: 'quote',
  },
  {
    text: 'Do things others say cannot be done. The future belongs to those who refuse to accept limits.',
    author: 'Jensen Huang',
    label: 'CEO, NVIDIA',
    type: 'quote',
  },
  {
    text: 'The measure of intelligence is the ability to change.',
    author: 'Albert Einstein',
    label: 'Theoretical Physicist',
    type: 'quote',
  },
];

export const FADE_MS = 400;
export const HOLD_MS = 5_000;
