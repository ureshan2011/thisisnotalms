// ─── The decision tree lab's numbers ─────────────────────────────────────
// Everything here comes from Kaggle's "Telco Customer Churn" (BlastChar;
// IBM sample data: a fictional telco with 7,043 customers in California)
// after the lab's own cleaning, split exactly as the lab splits it:
// train_test_split(test_size=0.2, random_state=42), scikit-learn 1.6.1.
// Rebuild them with the notebook in public/mbi806b/decision-tree/ if the
// code on the page ever changes.
//
// The dataset's licence is "Data files © Original Authors", so this file
// holds no customer rows: only counts, and the tree the lab trains.

/* ── The tree: DecisionTreeClassifier(max_depth=3, random_state=42) ──────
   Trained on 5,634 customers using tenure, MonthlyCharges, Contract (0 =
   month-to-month, 1 = one year, 2 = two year) and Fiber (1 = fibre).
   `stay` and `leave` are the training customers who reached each node.
   Questions are worded the way a person would ask them; sklearn's own
   wording is in the comment beside each. */

export interface Customer {
  tenure: number;
  monthly: number;
  contract: 0 | 1 | 2;
  fiber: 0 | 1;
}

export interface TreeNode {
  id: number;
  stay: number;
  leave: number;
  /** Internal nodes only. */
  question?: string;
  /** Short version for the drawn tree. */
  short?: string;
  test?: (c: Customer) => boolean;
  yes?: number;
  no?: number;
}

export const NODES: Record<number, TreeNode> = {
  // Contract <= 0.5
  0: { id: 0, stay: 4138, leave: 1496, question: 'Is the contract month-to-month?', short: 'Month-to-month?', test: c => c.contract === 0, yes: 1, no: 8 },
  // Fiber <= 0.5 (sklearn's True branch is "no fibre", so yes/no are swapped)
  1: { id: 1, stay: 1768, leave: 1315, question: 'Do they have fibre internet?', short: 'Fibre?', test: c => c.fiber === 1, yes: 5, no: 2 },
  // tenure <= 3.5
  2: { id: 2, stay: 987, leave: 399, question: 'A customer for 3 months or less?', short: '≤ 3 months?', test: c => c.tenure <= 3, yes: 3, no: 4 },
  3: { id: 3, stay: 251, leave: 210 },
  4: { id: 4, stay: 736, leave: 189 },
  // tenure <= 14.5
  5: { id: 5, stay: 781, leave: 916, question: 'A customer for 14 months or less?', short: '≤ 14 months?', test: c => c.tenure <= 14, yes: 6, no: 7 },
  6: { id: 6, stay: 239, leave: 546 },
  7: { id: 7, stay: 542, leave: 370 },
  // MonthlyCharges <= 93.675
  8: { id: 8, stay: 2370, leave: 181, question: 'Is the monthly bill $93.67 or less?', short: 'Bill ≤ $93.67?', test: c => c.monthly <= 93.675, yes: 9, no: 12 },
  // Contract <= 1.5 (already not month-to-month, so this means one year)
  9: { id: 9, stay: 1850, leave: 77, question: 'Is it a one-year contract?', short: 'One-year?', test: c => c.contract === 1, yes: 10, no: 11 },
  10: { id: 10, stay: 822, leave: 65 },
  11: { id: 11, stay: 1028, leave: 12 },
  12: { id: 12, stay: 520, leave: 104, question: 'Is it a one-year contract?', short: 'One-year?', test: c => c.contract === 1, yes: 13, no: 14 },
  13: { id: 13, stay: 247, leave: 78 },
  14: { id: 14, stay: 273, leave: 26 },
};

export const isLeaf = (n: TreeNode) => n.test === undefined;
export const leaveShare = (n: TreeNode) => n.leave / (n.stay + n.leave);
/** What the tree predicts at a leaf: whichever group is bigger. */
export const predictsLeave = (n: TreeNode) => n.leave > n.stay;

/** The nodes a customer passes through, root to leaf, with each answer. */
export function walk(c: Customer): { node: TreeNode; answer?: boolean }[] {
  const path: { node: TreeNode; answer?: boolean }[] = [];
  let node = NODES[0];
  for (;;) {
    if (isLeaf(node) || !node.test) {
      path.push({ node });
      return path;
    }
    const answer = node.test(c);
    path.push({ node, answer });
    node = NODES[(answer ? node.yes : node.no) as number];
  }
}

/* ── How deep should it grow? ──────────────────────────────────────────
   The same four inputs and split, a tree at each max_depth. "train" is the
   score on the 5,634 customers it learned from, "test" on the 1,409 kept
   back. 373 of the test customers really left; "caught" is how many of
   those the tree said would leave. null means no max_depth at all. */

export interface DepthResult {
  depth: number | null;
  train: number;
  test: number;
  caught: number;
  flagged: number;
  leaves: number;
}

export const DEPTHS: DepthResult[] = [
  { depth: 1, train: 0.734, test: 0.735, caught: 0, flagged: 0, leaves: 2 },
  { depth: 2, train: 0.758, test: 0.779, caught: 246, flagged: 431, leaves: 4 },
  { depth: 3, train: 0.789, test: 0.796, caught: 146, flagged: 207, leaves: 8 },
  { depth: 4, train: 0.793, test: 0.794, caught: 182, flagged: 281, leaves: 16 },
  { depth: 5, train: 0.798, test: 0.794, caught: 206, flagged: 329, leaves: 31 },
  { depth: 6, train: 0.803, test: 0.793, caught: 174, flagged: 267, leaves: 58 },
  { depth: 7, train: 0.813, test: 0.781, caught: 194, flagged: 324, leaves: 101 },
  { depth: 8, train: 0.824, test: 0.779, caught: 173, flagged: 284, leaves: 164 },
  { depth: 10, train: 0.853, test: 0.764, caught: 173, flagged: 306, leaves: 375 },
  { depth: 12, train: 0.886, test: 0.746, caught: 164, flagged: 313, leaves: 644 },
  { depth: 15, train: 0.932, test: 0.744, caught: 183, flagged: 353, leaves: 1015 },
  { depth: null, train: 0.983, test: 0.736, caught: 179, flagged: 357, leaves: 1455 },
];

/** Guessing "stays" for every test customer. */
export const BASELINE = 0.735;
export const TEST_TOTAL = 1409;
export const TEST_LEAVERS = 373;

/** The depth-3 tree on the 1,409 test customers. */
export const CONFUSION = { stayedRight: 975, falseAlarm: 61, missed: 227, caught: 146 };

/* ── Counts for "make the first cut yourself" ──────────────────────────
   The 5,634 training customers, counted as [stayed, left]: by months as a
   customer (0 to 72), by monthly bill in whole dollars ($18 to $118), and
   by contract and fibre. This is exactly what the tree looked at when it
   chose its first question. */

export const TRAIN = { stay: 4138, leave: 1496 };

export const BY_TENURE: [number, number][] = [[10, 0], [180, 296], [83, 91], [85, 76], [78, 69], [53, 49], [55, 35], [67, 38], [71, 37], [56, 37], [61, 39], [53, 26], [62, 33], [55, 28], [42, 18], [52, 23], [43, 24], [47, 19], [63, 18], [46, 15], [45, 14], [40, 14], [53, 21], [47, 12], [59, 17], [47, 18], [48, 12], [52, 11], [36, 11], [47, 14], [44, 12], [39, 13], [46, 16], [42, 12], [43, 10], [54, 11], [34, 9], [40, 12], [38, 9], [32, 11], [38, 12], [45, 12], [43, 12], [47, 14], [41, 5], [39, 4], [47, 12], [51, 10], [44, 8], [39, 13], [46, 8], [51, 8], [47, 6], [39, 13], [40, 11], [43, 8], [55, 10], [50, 7], [46, 9], [43, 8], [57, 5], [52, 5], [59, 5], [56, 2], [61, 2], [53, 8], [62, 10], [70, 8], [75, 8], [64, 6], [70, 9], [135, 4], [282, 4]];

/** Index 0 is $18.00–$18.99, the last is $118.00–$118.99. */
export const BY_BILL: [number, number][] = [[17, 2], [424, 43], [398, 36], [17, 2], [1, 0], [18, 3], [122, 17], [131, 18], [27, 0], [0, 0], [0, 2], [27, 11], [18, 9], [3, 2], [0, 0], [6, 2], [14, 6], [29, 11], [8, 4], [1, 0], [9, 0], [20, 8], [25, 9], [5, 4], [3, 3], [19, 6], [55, 26], [44, 35], [10, 6], [6, 2], [19, 8], [59, 24], [69, 28], [27, 6], [6, 1], [31, 8], [76, 15], [61, 22], [35, 5], [9, 3], [26, 3], [53, 8], [38, 7], [33, 3], [11, 5], [14, 1], [57, 5], [44, 4], [28, 4], [15, 2], [19, 7], [68, 48], [66, 59], [29, 8], [20, 6], [33, 21], [76, 59], [76, 41], [25, 13], [10, 10], [38, 19], [76, 44], [88, 54], [49, 15], [23, 8], [22, 18], [73, 45], [66, 44], [42, 24], [21, 6], [28, 12], [80, 44], [77, 28], [32, 14], [28, 3], [28, 21], [71, 49], [61, 37], [25, 22], [24, 6], [28, 26], [56, 40], [59, 41], [25, 23], [14, 11], [32, 18], [59, 29], [59, 23], [31, 21], [19, 5], [35, 8], [37, 10], [34, 8], [22, 6], [5, 2], [15, 3], [19, 2], [25, 2], [16, 1], [3, 2], [3, 1]];
export const BILL_MIN = 18;

/** Month-to-month against one- and two-year contracts. */
export const BY_CONTRACT = { monthToMonth: [1768, 1315] as [number, number], longer: [2370, 181] as [number, number] };
export const BY_FIBER = { fibre: [1450, 1031] as [number, number], none: [2688, 465] as [number, number] };

/* ── How well a question separates leavers from stayers ────────────────
   The tree's own yardstick (Gini impurity): how mixed a group is, 0 when
   everyone in it did the same thing. A question's score is how much less
   mixed the two groups are than the whole crowd. Shown to students on a
   0–100 scale where 100 is the best single first question in this data. */

function gini([s, l]: [number, number]) {
  const n = s + l;
  return n === 0 ? 0 : 1 - (s / n) ** 2 - (l / n) ** 2;
}

export function separation(yes: [number, number], no: [number, number]) {
  const n = TRAIN.stay + TRAIN.leave;
  const whole = gini([TRAIN.stay, TRAIN.leave]);
  const after = ((yes[0] + yes[1]) / n) * gini(yes) + ((no[0] + no[1]) / n) * gini(no);
  return whole - after;
}

export const BEST_SEPARATION = separation(BY_CONTRACT.monthToMonth, BY_CONTRACT.longer);

export function sum(rows: [number, number][]): [number, number] {
  return rows.reduce<[number, number]>((a, [s, l]) => [a[0] + s, a[1] + l], [0, 0]);
}
