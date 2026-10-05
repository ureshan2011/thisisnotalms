import { type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { LessonHeader, Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import Shot, { Figure } from './lab/Shot';
import ColabCell, { type Output } from './lab/ColabCell';
import { TeamsDemo, UnzipDemo, UploadDemo } from './lab/Walkthroughs';
import { Checklist, DoneButton } from './lab/Checklist';
import { LabProvider, type LabConfig } from './lab/LabContext';
import { Answer, c, Jump, ReadAloud, Task, WhyBlock } from './lab/Bits';
import Countdown from './lab/Countdown';
import DataCardQuestions from './tree/DataCardQuestions';
import ShareOfOnes from './tree/ShareOfOnes';
import FirstCut from './tree/FirstCut';
import TreeWalk from './tree/TreeWalk';
import { Caught, DepthDial } from './tree/DepthWidgets';
import { DT_DEADLINE } from './tree/deadline';
import '../../styles/lab.css';
import '../../styles/tree-lab.css';

// ─── MBI806B · Decision tree lab ──────────────────────────────────────────
// The second hands-on lab, a week after the linear regression one. Same nine
// steps, same hand-in, so the familiar half goes quickly and the attention
// goes on what's new: predicting a category instead of a number, a dirty
// value that isnull() can't see, a duplicate check where the right answer is
// "keep them", a score that means nothing without a baseline, and a tree
// that overfits the moment you stop holding it back.
//
// The dataset is Kaggle's "Telco Customer Churn" (BlastChar, from IBM's
// sample data: a fictional phone and internet company with 7,043 customers
// in California). It was chosen because the business question is one every
// subscription company asks, the tree it grows is small enough to read
// aloud, and the data has exactly one real trap in it.
//
// Its licence is "Data files © Original Authors", not an open one. So the
// page quotes only what the notebook prints in the cells a student runs
// (five rows from df.head(), and the eleven blank TotalCharges rows), and
// the widgets work from counts and from the trained tree, never from rows.
//
// Every number on this page is real. The Kaggle screenshots are genuine
// captures taken in October 2026; the Colab ones are shared with the
// linear regression lab. Every output is what the lab's notebook printed
// under Colab's own library versions (pandas 2.2.3, scikit-learn 1.6.1),
// and the finished notebook is in public/mbi806b/decision-tree/.

const BASE = import.meta.env.BASE_URL;
const ASSETS = `${BASE}mbi806b/decision-tree/`;
const DATASET_URL = 'https://www.kaggle.com/datasets/blastchar/telco-customer-churn';
const IBM_URL = 'https://community.ibm.com/community/user/businessanalytics/blogs/steven-macko/2019/07/11/telco-customer-churn-1113';
const COLAB_URL = 'https://colab.research.google.com';
const KAGGLE_URL = 'https://www.kaggle.com';

const LECTURER = 'Yasas Sri Wickramasinghe';
const REPORT_FILE = 'MBI806B-DT-Lab-YourName.pdf';

/** The announcement post students reply to with their report. */
const TEAMS_POST = {
  title: 'New lab: who is about to cancel?',
  body: 'Hi everyone, the decision tree lab is up for MBI806B…',
  reply: 'Hi Yasas, here’s my decision tree lab report.',
  file: REPORT_FILE,
};

const LAB: LabConfig = {
  storageKey: 'mbi806b-decision-tree-lab-progress',
  assetDir: 'decision-tree',
  stages: [
    { id: 'find', label: 'Found the dataset on Kaggle' },
    { id: 'card', label: 'Read the data card' },
    { id: 'download', label: 'Downloaded, unzipped and renamed it' },
    { id: 'colab', label: 'Loaded it into Colab' },
    { id: 'explore', label: 'Got to know the data' },
    { id: 'clean', label: 'Cleaned it and compared groups' },
    { id: 'model', label: 'Grew and tested a tree' },
    { id: 'predict', label: 'Predicted three customers' },
    { id: 'report', label: 'Replied with my report in Teams' },
  ],
};

/* ── The real outputs, as Colab printed them ───────────────────────────── */

const HEAD_COLS = [
  'customerID', 'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure', 'PhoneService', 'MultipleLines',
  'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
  'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod', 'MonthlyCharges', 'TotalCharges', 'Churn',
];

const OUT_HEAD: Output[] = [
  {
    kind: 'table',
    columns: HEAD_COLS,
    rows: [
      [0, '7590-VHVEG', 'Female', 0, 'Yes', 'No', 1, 'No', 'No phone service', 'DSL', 'No', 'Yes', 'No', 'No', 'No', 'No', 'Month-to-month', 'Yes', 'Electronic check', '29.85', '29.85', 'No'],
      [1, '5575-GNVDE', 'Male', 0, 'No', 'No', 34, 'Yes', 'No', 'DSL', 'Yes', 'No', 'Yes', 'No', 'No', 'No', 'One year', 'No', 'Mailed check', '56.95', '1889.5', 'No'],
      [2, '3668-QPYBK', 'Male', 0, 'No', 'No', 2, 'Yes', 'No', 'DSL', 'Yes', 'Yes', 'No', 'No', 'No', 'No', 'Month-to-month', 'Yes', 'Mailed check', '53.85', '108.15', 'Yes'],
      [3, '7795-CFOCW', 'Male', 0, 'No', 'No', 45, 'No', 'No phone service', 'DSL', 'Yes', 'No', 'Yes', 'Yes', 'No', 'No', 'One year', 'No', 'Bank transfer (automatic)', '42.30', '1840.75', 'No'],
      [4, '9237-HQITU', 'Female', 0, 'No', 'No', 2, 'Yes', 'No', 'Fiber optic', 'No', 'No', 'No', 'No', 'No', 'No', 'Month-to-month', 'Yes', 'Electronic check', '70.70', '151.65', 'Yes'],
    ],
    hot: [[0, 20], [1, 20], [2, 20], [3, 20], [4, 20]],
  },
];

const OUT_INFO = `<class 'pandas.core.frame.DataFrame'>
RangeIndex: 7043 entries, 0 to 7042
Data columns (total 21 columns):
 #   Column            Non-Null Count  Dtype
---  ------            --------------  -----
 0   customerID        7043 non-null   object
 1   gender            7043 non-null   object
 2   SeniorCitizen     7043 non-null   int64
 3   Partner           7043 non-null   object
 4   Dependents        7043 non-null   object
 5   tenure            7043 non-null   int64
 6   PhoneService      7043 non-null   object
 7   MultipleLines     7043 non-null   object
 8   InternetService   7043 non-null   object
 9   OnlineSecurity    7043 non-null   object
 10  OnlineBackup      7043 non-null   object
 11  DeviceProtection  7043 non-null   object
 12  TechSupport       7043 non-null   object
 13  StreamingTV       7043 non-null   object
 14  StreamingMovies   7043 non-null   object
 15  Contract          7043 non-null   object
 16  PaperlessBilling  7043 non-null   object
 17  PaymentMethod     7043 non-null   object
 18  MonthlyCharges    7043 non-null   float64
 19  TotalCharges      7043 non-null   object
 20  Churn             7043 non-null   object
dtypes: float64(1), int64(2), object(18)
memory usage: 1.1+ MB`;

const OUT_DESCRIBE: Output[] = [
  {
    kind: 'table',
    columns: ['SeniorCitizen', 'tenure', 'MonthlyCharges'],
    rows: [
      ['count', '7043.0', '7043.0', '7043.0'],
      ['mean', '0.2', '32.4', '64.8'],
      ['std', '0.4', '24.6', '30.1'],
      ['min', '0.0', '0.0', '18.2'],
      ['25%', '0.0', '9.0', '35.5'],
      ['50%', '0.0', '29.0', '70.4'],
      ['75%', '0.0', '55.0', '89.8'],
      ['max', '1.0', '72.0', '118.8'],
    ],
    hot: [[3, 1], [7, 1]],
  },
];

const OUT_MISSING = `customerID          0
gender              0
SeniorCitizen       0
Partner             0
Dependents          0
tenure              0
PhoneService        0
MultipleLines       0
InternetService     0
OnlineSecurity      0
OnlineBackup        0
DeviceProtection    0
TechSupport         0
StreamingTV         0
StreamingMovies     0
Contract            0
PaperlessBilling    0
PaymentMethod       0
MonthlyCharges      0
TotalCharges        0
Churn               0
dtype: int64`;

const BLANKS: [number, string][] = [
  [488, '52.55'], [753, '20.25'], [936, '80.85'], [1082, '25.75'], [1340, '56.05'], [3331, '19.85'],
  [3826, '25.35'], [4380, '20.00'], [5218, '19.70'], [6670, '73.35'], [6754, '61.90'],
];

const OUT_BLANKS: Output[] = [
  {
    kind: 'table',
    columns: ['tenure', 'MonthlyCharges', 'TotalCharges', 'Churn'],
    rows: BLANKS.map(([i, m]) => [i, 0, m, '', 'No']),
    hot: BLANKS.map((_, r) => [r, 0] as [number, number]),
  },
];

const OUT_MAPPED: Output[] = [
  {
    kind: 'table',
    columns: ['Churn', 'Contract', 'InternetService', 'Fiber'],
    rows: [
      [0, 0, 0, 'DSL', 0],
      [1, 0, 1, 'DSL', 0],
      [2, 1, 0, 'DSL', 0],
      [3, 0, 1, 'DSL', 0],
      [4, 1, 0, 'Fiber optic', 1],
    ],
    hot: [0, 1, 2, 3, 4].flatMap(r => [[r, 0], [r, 1], [r, 3]] as [number, number][]),
  },
];

const OUT_EXPORT = `|--- Contract <= 0.50
|   |--- Fiber <= 0.50
|   |   |--- tenure <= 3.50
|   |   |   |--- class: 0
|   |   |--- tenure >  3.50
|   |   |   |--- class: 0
|   |--- Fiber >  0.50
|   |   |--- tenure <= 14.50
|   |   |   |--- class: 1
|   |   |--- tenure >  14.50
|   |   |   |--- class: 0
|--- Contract >  0.50
|   |--- MonthlyCharges <= 93.67
|   |   |--- Contract <= 1.50
|   |   |   |--- class: 0
|   |   |--- Contract >  1.50
|   |   |   |--- class: 0
|   |--- MonthlyCharges >  93.67
|   |   |--- Contract <= 1.50
|   |   |   |--- class: 0
|   |   |--- Contract >  1.50
|   |   |   |--- class: 0`;

const CHART = (src: string, alt: string, width = 828, height = 621, wide = false): Output => ({ kind: 'image', src, alt, width, height, wide });

/* ── The code, exactly as the student types it ─────────────────────────── */

const CODE = {
  load: 'import pandas as pd\n\ndf = pd.read_csv("telco.csv")\ndf.head()',
  shape: 'df.shape',
  info: 'df.info()',
  describe: 'df.describe().round(1)',
  counts: 'df["Churn"].value_counts()',
  missing: 'df.isnull().sum()',
  blanks: 'print((df["TotalCharges"] == " ").sum())',
  showBlanks: 'df[df["TotalCharges"] == " "][["tenure", "MonthlyCharges", "TotalCharges", "Churn"]]',
  fix: 'df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")\ndf["TotalCharges"] = df["TotalCharges"].fillna(0)\ndf["TotalCharges"].dtype',
  dupes:
    'print(df["customerID"].duplicated().sum(), "repeated customer IDs")\nprint(df.drop(columns="customerID").duplicated().sum(), "rows that match another row apart from the ID")',
  map:
    'df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})\ndf["Contract"] = df["Contract"].map({"Month-to-month": 0, "One year": 1, "Two year": 2})\ndf["Fiber"] = df["InternetService"].map({"Fiber optic": 1, "DSL": 0, "No": 0})\ndf[["Churn", "Contract", "InternetService", "Fiber"]].head()',
  byContract: 'df.groupby("Contract")["Churn"].mean().round(3)',
  byFiber: 'df.groupby("Fiber")["Churn"].mean().round(3)',
  barChart:
    'import matplotlib.pyplot as plt\n\nrates = df.groupby("Contract")["Churn"].mean()\nrates.plot(kind="bar", rot=0)\nplt.xlabel("Contract: 0 = month-to-month, 1 = one year, 2 = two year")\nplt.ylabel("Share who left")\nplt.show()',
  lineChart: 'df.groupby("tenure")["Churn"].mean().plot()\nplt.xlabel("Months as a customer")\nplt.ylabel("Share who left")\nplt.show()',
  split:
    'from sklearn.model_selection import train_test_split\n\nX = df[["tenure", "MonthlyCharges", "Contract", "Fiber"]]\ny = df["Churn"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nprint(len(X_train), "customers to learn from")\nprint(len(X_test), "customers kept back for the test")',
  baseline: 'print("Always guessing \'stays\':", round((y_test == 0).mean(), 3))',
  train:
    'from sklearn.tree import DecisionTreeClassifier\n\ntree = DecisionTreeClassifier(max_depth=3, random_state=42)\ntree.fit(X_train, y_train)\n\nprint("Score:", round(tree.score(X_test, y_test), 3))',
  plot:
    'from sklearn.tree import plot_tree\n\nplt.figure(figsize=(16, 7))\nplot_tree(tree, feature_names=list(X.columns), class_names=["Stays", "Leaves"], filled=True, rounded=True)\nplt.show()',
  text: 'from sklearn.tree import export_text\n\nprint(export_text(tree, feature_names=list(X.columns)))',
  caught:
    'predictions = tree.predict(X_test)\ncaught = ((predictions == 1) & (y_test == 1)).sum()\n\nprint("Customers in the test who really left:", y_test.sum())\nprint("Of those, the tree caught:", caught)',
  bigTree:
    'big_tree = DecisionTreeClassifier(random_state=42)\nbig_tree.fit(X_train, y_train)\n\nprint("On the customers it learned from:", round(big_tree.score(X_train, y_train), 3))\nprint("On customers it has never seen:", round(big_tree.score(X_test, y_test), 3))',
  predict:
    'new_customers = pd.DataFrame({\n    "tenure":         [2, 40, 60],\n    "MonthlyCharges": [95, 60, 25],\n    "Contract":       [0, 1, 2],\n    "Fiber":          [1, 0, 0],\n})\n\nprint(tree.predict(new_customers))\nprint(tree.predict_proba(new_customers).round(2))',
};

/* ── Quiz and recap ───────────────────────────────────────────────────── */

const QUESTIONS: QuizQuestion[] = [
  {
    q: 'isnull() said nothing was missing, yet 11 TotalCharges values weren’t numbers. Why didn’t isnull() catch them?',
    answer: 1,
    options: [
      { text: 'isnull() only checks the first 1,000 rows', why: 'It checks every row. That isn’t the reason.' },
      { text: 'They held a single space, and a space is text, not a gap', why: 'Right. pandas only counts a truly empty cell as missing. A space, a dash or "N/A" all look like real values to it.' },
      { text: 'Kaggle had already filled them in', why: 'Kaggle doesn’t touch your file. It even flagged them for you: 11 mismatched.' },
    ],
  },
  {
    q: 'Your tree scores 0.796 on the test customers. How good is that?',
    answer: 2,
    options: [
      { text: 'Excellent: it’s right about 80% of the time', why: 'Right 80% of the time sounds great until you notice that saying "stays" to everyone is right 73.5% of the time.' },
      { text: 'Useless: anything under 0.9 is a failure', why: 'There’s no magic number. A score only means something next to what you’d get without a model.' },
      { text: 'Better than guessing "stays" for everyone (0.735), but not by a lot', why: 'Yes. Always ask "compared with what?" The tree’s real value shows up in who it flags, not in this one number.' },
    ],
  },
  {
    q: 'With no max_depth, the tree scored 0.983 on the customers it learned from and 0.736 on new ones. What happened?',
    answer: 0,
    options: [
      { text: 'It memorised the training customers instead of learning a pattern', why: 'Yes. That’s overfitting. 1,455 leaves for 5,634 customers: about four people per leaf.' },
      { text: 'The test customers were harder than the training ones', why: 'The split is random. The test customers are just like the rest. The difference is the tree.' },
      { text: 'It needed more columns', why: 'More columns would give it even more to memorise. The fix is to stop it growing so deep.' },
    ],
  },
  {
    q: 'A customer is on month-to-month, has fibre, and joined 10 months ago. What does your tree say?',
    answer: 1,
    options: [
      { text: 'Stays, because most customers stay', why: 'Most customers do stay. But this one lands on the one leaf where most of them left.' },
      { text: 'Leaves, with a 70% chance', why: 'Right. 546 of the 785 training customers on that leaf left. The 70% is just that share.' },
      { text: 'Leaves, and the tree is certain', why: 'Three in ten customers like this stayed. A tree is never certain. It tells you which way the leaf leans.' },
    ],
  },
  {
    q: 'The tree caught 146 of the 373 customers who really left. Should the retention team bin it?',
    answer: 2,
    options: [
      { text: 'Yes. Missing 227 leavers is a failure', why: 'Missing leavers is a real limit. But compare it with having no list at all.' },
      { text: 'Yes. It’s only 6 points better than guessing', why: 'Guessing "stays" catches nobody. That’s the comparison that matters to the retention team.' },
      { text: 'No. Of the 207 customers it flags, 146 really leave, against about 55 if they called at random', why: 'Yes. For a team with limited calls to make, a list where 7 in 10 are real leavers is worth a lot.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['Check the licence, not just the columns.', 'This dataset is fictional, undated, and not openly licensed. All three change what you can claim and share.'],
  ['Clean data can still be dirty.', 'isnull() said zero. Eleven blanks were hiding as spaces. Check the types, not just the gaps.'],
  ['A duplicate check is a question, not a delete button.', '22 lookalike rows were 22 different new customers. Last week’s duplicate was a real copy. You only know by looking.'],
  ['The average of 1s and 0s is a share.', 'That one trick turned a Yes/No column into "42.7% of month-to-month customers left".'],
  ['Always ask: compared with what?', '0.796 sounds good. Guessing "stays" for everyone gets 0.735. That gap, and who it flags, is the tree’s real value.'],
  ['Hold the tree back.', 'Three questions deep, it beat every deeper tree on new customers. With no limit, it memorised.'],
];

const HELP: [string, ReactNode][] = [
  ['FileNotFoundError: telco.csv', <>Colab can't find a file with that name. Did you rename it? If not, either rename it now (in the Files panel: three dots next to the file → <b>Rename file</b>) or use the long name in cell 1. Also check it's in the Files panel at all: Colab wipes uploads whenever the session disconnects.</>],
  ['ValueError: could not convert string to float: \' \'', <>You've given TotalCharges to something that needs numbers, before fixing the blanks. Run cell 9, or click <b>Runtime → Run all</b>.</>],
  ['Churn or Contract is suddenly all NaN', <>You ran cell 11 twice. The first run turned the words into numbers. The second went looking for "Yes" and "Month-to-month", found none, and gave up. Click <b>Runtime → Run all</b> to start clean.</>],
  ['KeyError: \'churn\'', <>Column names are case-sensitive, and this dataset isn't consistent: it's {c('Churn')} and {c('Contract')} with capitals, but {c('tenure')} all lower case. Copy names exactly from {c('df.info()')}.</>],
  ['NameError: name \'tree\' is not defined', <>Colab has forgotten an earlier cell, usually after a disconnect or running cells out of order. Click <b>Runtime → Run all</b>.</>],
  ['The tree picture is too small to read', <>Check {c('plt.figure(figsize=(16, 7))')} is in the same cell, above {c('plot_tree')}. Still small? Right-click the picture and open it in a new tab, where you can zoom. Or use the text version from cell 20.</>],
  ['My numbers are slightly different from yours', <>Check you still have 7,043 rows (this lab doesn't drop any) and that {c('random_state=42')} is in both cell 16 and cell 18. A tree breaks ties at random too, so leaving it out of cell 18 can change the tree. Different isn't wrong, but say so in your report.</>],
  ['Kaggle won\'t let me download', <>You need to be signed in. Sign in with Google, then click Download again.</>],
  ['Still stuck', <>Reply under the announcement post in Teams, or message me, with a screenshot of the whole error, top to bottom. "It doesn't work" I can't do much with. A screenshot I can usually sort in a minute.</>],
];

const LINKS: { href: string; label: string; note: string }[] = [
  { href: DATASET_URL, label: 'Telco Customer Churn, on Kaggle', note: 'The dataset. BlastChar, from IBM’s sample data. Data files © Original Authors.' },
  { href: IBM_URL, label: 'IBM’s page about the data', note: 'Linked from the data card. Where "fictional telco company" comes from.' },
  { href: COLAB_URL, label: 'Google Colab', note: 'Where every step of the lab happens. Free, nothing to install.' },
  { href: `${ASSETS}MBI806B-decision-tree-report-template.docx`, label: 'Report template (Word)', note: 'The seven headings, with prompts. Fill it in, save as PDF.' },
  { href: `${ASSETS}MBI806B-decision-tree-lab.ipynb`, label: 'The finished notebook', note: 'Only if you’re stuck. In Colab: File → Upload notebook.' },
  { href: `${BASE}#/predicting-with-data`, label: 'Three ways to predict things', note: 'Where you first grew a tree, on fourteen gym members.' },
  { href: `${BASE}#/linear-regression-lab`, label: 'Linear regression lab', note: 'Last week’s lab. Steps 1 to 4 are the same, in more detail.' },
  { href: 'https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html', label: 'scikit-learn: DecisionTreeClassifier', note: 'The official page for the model you used, for when you want more.' },
];

/* ── The lesson ───────────────────────────────────────────────────────── */

export default function DecisionTreeLabLesson() {
  return (
    <LabProvider value={LAB}>
      <LabBody />
    </LabProvider>
  );
}

function LabBody() {
  return (
    <div className="lr-lab">
      <LessonHeader
        lesson={5}
        of={5}
        title="Decision trees on real data, start to finish"
        lead="In Three ways to predict things you grew a tree on fourteen gym members. Today you grow one for a phone and internet company with 7,043 customers, to answer the question every subscription business asks: who is about to leave? Find the data, clean it, grow the tree, read it, test it fairly. Then write it up and post it in Teams."
        meta={[
          ['Time', 'about 2 hours'],
          ['Needs', 'a laptop and a Google account'],
          ['Hand in', 'a short report, as a reply in Teams'],
        ]}
        objectives={[
          'Judge a dataset from its data card, licence included',
          'Find dirty values that isnull() can’t see, and fix them',
          'Compare groups by the share of customers who left',
          'Grow a decision tree and beat the “guess the obvious” score',
          'Read the tree as rules a manager can act on',
          'Spot overfitting, and say what the tree can’t tell you',
        ]}
      />

      {/* ══ The job ══════════════════════════════════════════════════════ */}
      <section id="brief" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before you start"
            title="The job"
            stop="."
            aside="Read this bit properly. Everything after it is just doing it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Imagine you've just joined a phone and internet company as a junior analyst. In your first week the head
              of customer retention comes over with a printout and a worried look.
            </p>
            <p>
              <b>"Last month 1,869 of our 7,043 customers left. My team can call a few hundred people a month and offer
              them a deal to stay. Who should we call? And give me a rule my team can actually follow. Not a black
              box."</b>
            </p>
            <p>
              That second sentence is why this is a job for a <b>decision tree</b>. Last week's linear regression
              predicted a <i>number</i>: a medical bill. This week the answer is a <i>choice</i>: leaves or stays. A
              decision tree answers with a short list of yes/no questions, like a flowchart. You can read it out in a
              meeting, and the retention team can follow it without opening Python.
            </p>
          </div>
          <div className="bt-stats">
            <div><b className="bt-tnum">7,043</b><span>customers in the dataset</span></div>
            <div><b className="bt-tnum">21</b><span>columns, one CSV file</span></div>
            <div><b className="bt-tnum">9</b><span>steps, each with a tick box</span></div>
            <div><b className="bt-tnum">1</b><span>short report, posted as a reply in Teams</span></div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>What you need</h3>
          <div className="bt-pairgrid">
            <div className="bt-card"><h4>A laptop</h4><p>Mac, Windows or Chromebook. Everything happens in the browser, so they all work the same.</p></div>
            <div className="bt-card"><h4>Your Google and Kaggle accounts</h4><p>The same ones as last week. No Kaggle account yet? Step 1 shows you, and it takes a minute.</p></div>
            <div className="bt-card"><h4>Last week's lab, ideally</h4><p>Steps 1 to 4 work the same way, so they'll go quickly. Missed it? Everything you need is still here.</p></div>
            <div className="bt-card"><h4>About two hours</h4><p>The steps take about an hour and a half if nothing goes wrong. Leave the rest for the report.</p></div>
          </div>
          <p className="bt-note">
            Tip: put this page on one half of your screen and Colab on the other. The new ideas are in steps 6, 7 and
            8, so save your energy for those.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <Checklist />
        </Reveal>
      </section>

      {/* ══ 1. Find ══════════════════════════════════════════════════════ */}
      <section id="step-find" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 1 · about 5 minutes"
            title="Find it on Kaggle"
            aside="Same place as last week. A different search."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-flow bt-flow--tight">
            <li>
              <span className="bt-flow__n bt-tnum">1</span>
              <div><h4>Go to kaggle.com and sign in</h4><p>No account? Click <b>Register</b>, top right, then <b>Register with Google</b>, using the same Google account you use for Colab.</p></div>
            </li>
            <li>
              <span className="bt-flow__n bt-tnum">2</span>
              <div><h4>Click Datasets in the menu on the left, then search</h4><p>Or skip straight there with the button below the screenshot.</p></div>
            </li>
          </ol>
        </Reveal>
        <Reveal delay={0.05}>
          <Shot
            src="kaggle-search.webp"
            url="kaggle.com/datasets?search=telco+customer+churn"
            alt="Kaggle's Datasets page with 'telco customer churn' in the search box and 318 results. The first is Telco Customer Churn by BlastChar: usability 8.8, 1 file (CSV), 176 kB, 616K downloads, 2,909 notebooks, 3,899 upvotes and a gold medal. Below it are a Telco Customer Churn by Abdallah Wagih Ibrahim with 74 upvotes, and Telco customer churn (11.1.3+) by Al Fath Terry with 85."
            width={1600}
            height={900}
            marks={[
              { x: 23.5, y: 24.8, w: 73, h: 7.2, text: 'Type **telco customer churn** into the search box and press Enter.' },
              { x: 23.5, y: 61.2, w: 73, h: 12.4, text: 'Click the one by **BlastChar**: about 3,900 upvotes, a gold medal, 616K downloads. The others are copies or later versions.' },
            ]}
            caption="Real screenshot, October 2026. Kaggle tweaks its layout now and then, so yours may look slightly different."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 26 }}>
            <p>
              318 results, and three of them on the first screen are called something like Telco Customer Churn. Go
              for the original, the same way as last week: most upvotes, most notebooks, oldest date. The third one,
              marked 11.1.3+, is a newer version from IBM with extra columns. It's a perfectly good dataset, but it
              isn't the one this lab is written for, and none of your numbers would match mine.
            </p>
          </div>
          <Task title="Open the dataset" time="5 min" foot={<DoneButton stage="find">I've found it</DoneButton>}>
            <ol>
              <li>Sign in to Kaggle.</li>
              <li>Search for <b>telco customer churn</b>.</li>
              <li>Open <b>Telco Customer Churn</b> by BlastChar.</li>
            </ol>
            <a className="bt-btn bt-btn--sm" href={DATASET_URL} target="_blank" rel="noreferrer" style={{ marginTop: 14, textDecoration: 'none' }}>
              Open the dataset on Kaggle
              <span className="bt-btn__badge" aria-hidden="true">↗</span>
            </a>
          </Task>
        </Reveal>
      </section>

      {/* ══ 2. Data card ═════════════════════════════════════════════════ */}
      <section id="step-card" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 2 · about 15 minutes"
            title="Read the data card first"
            aside="This card is shorter than last week's, and it hides more. Read the small print."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Same habit as last week: before you download anything, read the label. Who made this, what's in it,
              what are you allowed to do with it? This time pay extra attention to the licence on the right. It isn't
              the same kind as last week's.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <Shot
            src="kaggle-dataset.webp"
            url="kaggle.com/datasets/blastchar/telco-customer-churn"
            alt="The Kaggle page for Telco Customer Churn by BlastChar, updated 9 years ago, subtitled 'Focused customer retention programs'. Tabs read Data Card, Code (2909), Discussion (28) and Suggestions (1). On the right: Usability 8.82, License 'Data files © Original Authors', Expected update frequency 'Not specified', and the tag Business. The About Dataset section begins with a Context paragraph ending '[IBM Sample Data Sets]'."
            width={1600}
            height={950}
            marks={[
              { x: 24, y: 43.4, w: 7.4, h: 6.2, text: 'The **Data Card** tab. You land on it by default.' },
              { x: 23.4, y: 62.4, w: 50, h: 10.4, text: '**Context** ends with "[IBM Sample Data Sets]". That small bracket matters. It\'s question 3.' },
              { x: 78, y: 53, w: 8.8, h: 7.2, text: '**Usability 8.82** out of 10. Kaggle\'s score for how well a dataset is documented. Above 8 is good.' },
              { x: 78, y: 62, w: 16.6, h: 7.4, text: '**License**: "Data files © Original Authors". Not the open licence you had last week. Question 4.' },
              { x: 78, y: 71.2, w: 18.6, h: 7.2, text: '**Expected update frequency**: not specified. And there\'s no date anywhere. Question 5.' },
              { x: 78.6, y: 11.6, w: 10.4, h: 6, text: '**Download**. Not yet. Read first.' },
            ]}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Scroll down and keep reading</h3>
          <Figure
            src="kaggle-about.webp"
            alt="The full About Dataset section. Context: 'Predict behavior to retain customers. You can analyze all relevant customer data and develop focused customer retention programs.' [IBM Sample Data Sets]. Content: each row is a customer. The data set includes customers who left within the last month (the column is called Churn), the services each customer signed up for, account information such as tenure, contract, payment method and charges, and demographic information. Inspiration: 'To explore this type of models and learn more about the subject.' Then a link to a newer version from IBM."
            width={1600}
            height={1120}
            caption="About Dataset, in full. Four bullet points instead of a list of 21 columns."
          />
          <div className="bt-rows" style={{ marginTop: 22 }}>
            <div>
              <h4>Context</h4>
              <p>One borrowed sentence and a source: IBM's sample data sets. "Sample" is the word to notice.</p>
            </div>
            <div>
              <h4>Content</h4>
              <p>
                The most useful part. Instead of listing all 21 columns, it sorts them into four groups: whether the
                customer left (that's <b>Churn</b>, the thing to predict), the services they have, their account
                details, and a little about who they are. That's a map of the whole table.
              </p>
            </div>
            <div>
              <h4>Inspiration</h4>
              <p>
                Last week this told you what to predict. This one says "to explore this type of models", which tells
                you nothing. So the business question is yours to set, and that's normal at work.
              </p>
            </div>
            <div>
              <h4>What's missing</h4>
              <p>
                No column-by-column descriptions on the card, no date, no collection method. The column descriptions
                are hiding in the Data Explorer further down, so that's where you go next.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Figure
            src="kaggle-explorer.webp"
            alt="Kaggle's Data Explorer showing one file, WA_Fn-UseC_-Telco-Customer-Churn.csv at 977.5 kB, with Detail, Compact and Column tabs and '10 of 21 columns'. About this file reads: 'Telcom Customer Churn. Each row represents a customer, each column contains customer's attributes described on the column Metadata. The raw data contains 7043 rows (customers) and 21 columns (features). The “Churn” column is our target.' The Summary on the right says 1 file and 21 columns."
            width={1600}
            height={623}
            caption="The Data Explorer. Notice the file's long, awkward name. You'll rename it in step 3."
          />
          <p className="bt-note">Now click the <b>Column</b> tab inside the Data Explorer and scroll. Three columns are worth stopping at:</p>
          <div className="lr-figpair">
            <Figure
              src="kaggle-column-id.webp"
              alt="Column view for customerID, described as Customer ID. 7043 unique values. Valid 7043 (100%), Mismatched 0, Missing 0. Unique 7043."
              width={1380}
              height={426}
              caption="customerID: 7,043 unique values for 7,043 customers. Question 8."
            />
            <Figure
              src="kaggle-column-churn.webp"
              alt="Column view for Churn, described as 'Whether the customer churned or not (Yes or No)'. Valid 0 (0%), Mismatched 7043 (100%), Missing 0. True 0, False 0."
              width={1380}
              height={444}
              caption="Churn: 100% mismatched. Sound familiar? Question 6."
            />
            <Figure
              src="kaggle-column-total.webp"
              alt="Column view for TotalCharges, described as 'The total amount charged to the customer'. A histogram bunched at the low end, from 18.8 to 8.68k. Valid 7032 (100%), Mismatched 11 (0%), Missing 0. Mean 2.28k, median 1.4k."
              width={1380}
              height={624}
              caption="TotalCharges: 0 missing, but 11 mismatched. Question 7, and the most important one."
            />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Task title="Data card detective" time="10 min" foot={<DoneButton stage="card">I've read the card</DoneButton>}>
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              Answer these eight from the Kaggle page alone, before you download anything. Write your answers down:
              they go straight into section 1 of your report. Then check.
            </p>
            <DataCardQuestions />
          </Task>
        </Reveal>
      </section>

      {/* ══ 3. Download ══════════════════════════════════════════════════ */}
      <section id="step-download" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 3 · about 5 minutes"
            title="Download, unzip, rename"
            aside="One new step this time: give the file a name you can type."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Shot
            src="kaggle-download-menu.webp"
            url="kaggle.com/datasets/blastchar/telco-customer-churn"
            alt="Kaggle's Download menu open. The top part, 'Download via kagglehub', shows Python code. Below it are two options: 'Download dataset as zip (176 kB)' and 'Export metadata as Croissant'."
            width={1600}
            height={844}
            marks={[
              { x: 73.2, y: 5.6, w: 13.2, h: 8, text: 'Click **Download**, top right.' },
              { x: 52, y: 78, w: 27.4, h: 8.4, text: 'Ignore the code box. Click **Download dataset as zip (176 kB)**.' },
            ]}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="lr-split" style={{ marginTop: 26 }}>
            <div className="bt-prose">
              <p>
                <b>Seeing a sign-in page instead?</b> You're not signed in. Sign in with the same Google account, and
                Kaggle brings you back to the dataset. Click Download again.
              </p>
              <p>
                You get a zip again, and inside it a CSV with a long name: <b>WA_Fn-UseC_-Telco-Customer-Churn.csv</b>.
                That's IBM's internal file name. You'll have to type it into Python, and one wrong underscore means an
                error. So rename it <b>telco.csv</b>. Renaming changes the label on the file, not a single thing inside
                it.
              </p>
            </div>
            <Figure
              src="kaggle-signin.webp"
              dir="linear-regression"
              alt="Kaggle's sign-in page: 'Welcome!' with buttons to sign in with Google, Email, Facebook or Yahoo."
              width={960}
              height={1320}
              caption="What Kaggle shows if you click Download while signed out."
              narrow
            />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 34 }}>Unzip it and rename it</h3>
          <p className="bt-note" style={{ maxWidth: '58ch' }}>Pick your computer. The walkthrough plays once; use Back and Next to go at your own speed.</p>
          <UnzipDemo files={{ zipSize: '176 KB', csvName: 'WA_Fn-UseC_-Telco-Customer-Churn.csv', csvSize: '978 KB', renameTo: 'telco.csv' }} />
        </Reveal>
        <Reveal delay={0.05}>
          <Task title="Check what you've got" time="2 min" foot={<DoneButton stage="download">I've got telco.csv</DoneButton>}>
            <ul>
              <li>You should have a file called <b>telco.csv</b>, about 978 KB. Bigger than last week's: 7,043 customers instead of 1,338.</li>
              <li>Double-click it to open it in Excel or Numbers. 7,044 lines, including the header row, and 21 columns across.</li>
              <li>Close it <b>without saving</b>. If Excel offers to convert or fix anything, say no. You want the file exactly as Kaggle gave it.</li>
            </ul>
          </Task>
        </Reveal>
      </section>

      {/* ══ 4. Colab ═════════════════════════════════════════════════════ */}
      <section id="step-colab" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 4 · about 10 minutes"
            title="Into Google Colab"
            aside="A fresh notebook for this lab. Don't add to last week's."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Shot
            src="colab-home.webp"
            dir="linear-regression"
            url="colab.research.google.com"
            alt="Google Colab's start page with a blue New notebook button and an Upload notebook button, above a grid of example notebooks."
            width={1600}
            height={525}
            marks={[{ x: 10, y: 33.6, w: 13.6, h: 11.4, text: 'Go to **colab.research.google.com**, sign in, and click **New notebook**.' }]}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Shot
            src="colab-notebook.webp"
            dir="linear-regression"
            url="colab.research.google.com"
            alt="An empty Colab notebook: the name at the top, the File, Edit, View, Insert, Runtime, Tools and Help menus, a + Code button, a single empty code cell with a round play button, and a column of icons down the left, including a folder."
            width={1600}
            height={856}
            maxWidth={820}
            marks={[
              { x: 8, y: 1.4, w: 14, h: 7.8, text: 'Rename the notebook with **your name** in it. Your report screenshots need to show it.' },
              { x: 13, y: 31, w: 85.6, h: 11.2, text: 'A **code cell**. Code goes in here, and **▶** runs it. Shift + Enter does the same.' },
              { x: 16.4, y: 14.8, w: 8.6, h: 8.4, text: '**+ Code** adds a new cell. One cell per step below.' },
              { x: 1.4, y: 76.4, w: 6, h: 10.8, text: 'The **folder** opens the Files panel. telco.csv goes there.' },
            ]}
            caption="The same empty notebook as last week. It'll be called Untitled until you rename it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Upload the CSV</h3>
          <UploadDemo files={{ csvName: 'telco.csv', csvSize: '978 KB', zipSize: '176 KB', notebookName: 'DT lab – your name' }} />
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Load it with pandas</h3>
          <div className="bt-prose">
            <p>
              Same first cell as last week, with the new file name. {c('pd')} is pandas, Python's tool for tables, and{' '}
              {c('df')} is the table itself (short for <i>data frame</i>).
            </p>
          </div>
          <ColabCell
            label="Cell 1"
            code={CODE.load}
            out={OUT_HEAD}
            after={
              <>
                Five customers, 21 columns. Scroll sideways to see them all; Colab does the same. Most columns are Yes
                or No answers. Look at the last one, <b>Churn</b>: two of these five customers left. That's the column
                the whole lab is about.
              </>
            }
          />
          <Task title="Get your first five rows" time="5 min" foot={<DoneButton stage="colab">My data is loaded</DoneButton>}>
            <ol>
              <li>New notebook, renamed with your name in it.</li>
              <li>telco.csv uploaded into the Files panel.</li>
              <li>Cell 1 typed and run. You see the same five customers as above.</li>
            </ol>
            <p style={{ fontSize: 13.5, color: 'var(--ink-500)', marginTop: 10 }}>
              Red error instead? It's almost always the file name. Jump to <Jump to="help">Stuck?</Jump> at the bottom.
            </p>
          </Task>
        </Reveal>
      </section>

      {/* ══ 5. Explore ═══════════════════════════════════════════════════ */}
      <section id="step-explore" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 5 · about 15 minutes"
            title="Get to know your data"
            aside="The same four commands as last week. This time two of them are trying to warn you about something."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              A new cell for each, run it, and compare with mine. Then read the output properly before moving on. Two
              of these outputs carry a clue about a problem. See if you spot them before I point them out.
            </p>
          </div>
          <ColabCell
            label="Cell 2 · how big is it?"
            code={CODE.shape}
            out={[{ kind: 'text', text: '(7043, 21)' }]}
            after={<>7,043 rows and 21 columns, exactly what the Data Explorer said.</>}
          />
          <ColabCell
            label="Cell 3 · what's in each column?"
            code={CODE.info}
            out={[{ kind: 'text', text: OUT_INFO }]}
            after={
              <>
                <b>Non-Null Count</b> is 7043 everywhere, so nothing looks missing. Now the <b>Dtype</b> column. 18 of
                21 columns are object, which means text. That's expected: most are Yes/No answers. But look at line 19,{' '}
                <b>TotalCharges</b>. It's money. It should be a number, float64, like MonthlyCharges just above it.
                When a column of numbers comes in as text, something in it isn't a number. <b>Clue one.</b>
              </>
            }
          />
          <ColabCell
            label="Cell 4 · what do the numbers look like?"
            code={CODE.describe}
            out={OUT_DESCRIBE}
            after={
              <>
                Only three columns, because {c('describe()')} only does number columns. TotalCharges isn't here, because
                pandas thinks it's text. <b>Clue two.</b> Now read the tenure column, which is how many months
                someone has been a customer. It runs from <b>0</b> to <b>72</b>: some joined this month, the longest
                have been around for six years. SeniorCitizen is already 1s and 0s, so its mean of 0.2 says about one
                customer in six is a senior (0.16, rounded).
              </>
            }
          />
          <ColabCell
            label="Cell 5 · how many left?"
            code={CODE.counts}
            out={[{ kind: 'text', text: 'Churn\nNo     5174\nYes    1869\nName: count, dtype: int64' }]}
            after={
              <>
                1,869 of 7,043 left: about one in four (26.5%). Keep the other side in mind too: <b>73.5% stayed</b>.
                That number comes back in step 7, and it's more important than it looks.
              </>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Task title="Your turn: contracts" time="5 min" foot={<DoneButton stage="explore">I know my data</DoneButton>}>
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              In a new cell, count the contract types the same way: {c('df["Contract"].value_counts()')}. What share of
              customers can leave any month they like? Write one sentence about it for your report.
            </p>
            <Answer>
              Month-to-month 3,875, two year 1,695, one year 1,473. So 55% of customers (3,875 of 7,043) are on
              month-to-month and could leave next month with nothing to break. Hold on to that.
            </Answer>
          </Task>
        </Reveal>
      </section>

      {/* ══ 6. Clean ═════════════════════════════════════════════════════ */}
      <section id="step-clean" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 6 · about 30 minutes"
            title="Clean it, compare groups, look at it"
            aside="The longest step, and where most of the learning is. Read each reason before you type."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Same three jobs as last week: make sure the data is <b>clean</b>, <b>compare groups</b> to find the
              suspects, and <b>look</b> at them in a chart. But this dataset has a trap the last one didn't, and the
              first check you run will walk straight past it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Check 1: is anything missing?</h3>
          <WhyBlock
            task={<p>Count the empty cells in every column.</p>}
            why={
              <p>
                A model can't learn from a blank, and most tools either crash on gaps or quietly skip those rows. So you
                look for gaps first and decide what to do about them yourself.
              </p>
            }
          />
          <ColabCell
            label="Cell 6"
            code={CODE.missing}
            out={[{ kind: 'text', text: OUT_MISSING }]}
            after={
              <>
                Zero everywhere. Last week, that would have been the end of it. But you have two clues that something
                in TotalCharges isn't a number, and Kaggle told you 11 values were "mismatched". Zero missing and 11
                wrong can both be true. Here's how.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 56 }}>Check 2: the blanks that aren't missing</h3>
          <WhyBlock
            task={<p>Find the values in TotalCharges that aren't numbers, look at who they belong to, then fix them.</p>}
            why={
              <>
                <p>
                  pandas only counts a cell as missing if it's truly empty. A single space looks empty to you, but to
                  pandas it's a character, the same as a letter. So {c('isnull()')} says "nothing missing" and moves on.
                </p>
                <p>
                  That one space does real damage, though. One non-number in a column makes pandas read the{' '}
                  <i>whole column</i> as text. Text can't be added up, averaged or given to a model. Real company data is
                  full of these: a space, a dash, "N/A", "unknown", "?". None of them count as missing.
                </p>
              </>
            }
            which={
              <p>
                Because all three clues point at it: info() said text, describe() left it out, and Kaggle flagged 11
                values. Always follow the clues before you go looking anywhere else.
              </p>
            }
            whichLabel="Why TotalCharges?"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">A</span><h4>Count them</h4></div>
          <ReadAloud
            lines={[
              ['df["TotalCharges"] == " "', 'ask every value in the column: are you exactly one space? You get True or False for each customer'],
              ['.sum()', 'count the Trues. Python counts True as 1 and False as 0'],
              ['print( )', 'show the answer as a plain number'],
            ]}
          />
          <ColabCell
            label="Cell 7"
            code={CODE.blanks}
            out={[{ kind: 'text', text: '11' }]}
            after={<>Eleven, the same 11 that Kaggle called mismatched. Found them.</>}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">B</span><h4>Look at who they are before you decide anything</h4></div>
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            This is a filter, like last week's: the rule goes inside the square brackets. The second pair of brackets
            just picks four columns, so the output fits on screen.
          </p>
          <ColabCell
            label="Cell 8"
            code={CODE.showBlanks}
            out={OUT_BLANKS}
            after={
              <>
                Look down the tenure column: <b>every one of them is 0</b>. All eleven joined this month. They have a
                monthly price, but they haven't had their first bill yet, so there's no total. The blank isn't a mistake.
                It means "nothing yet". That changes what the right fix is.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">C</span><h4>Fix them</h4></div>
          <ReadAloud
            lines={[
              ['pd.to_numeric( ... , errors="coerce")', 'turn the column into numbers. Anything that can’t become a number becomes NaN, a real gap, instead of stopping with an error'],
              ['.fillna(0)', 'fill those gaps with 0'],
              ['.dtype', 'check the column’s type'],
            ]}
          />
          <ColabCell
            label="Cell 9"
            code={CODE.fix}
            out={[{ kind: 'text', text: "dtype('float64')" }]}
            after={
              <>
                float64: TotalCharges is numbers now. <b>Why 0, and not delete the rows?</b> Because 0 is true. Someone
                who hasn't been billed yet has been charged $0 in total. Dropping the eleven would also be fine, as it's
                only 11 out of 7,043. What matters is that you decide on purpose, and say why in your report.
                <br />
                <br />
                You won't actually give TotalCharges to the model (step 7 explains why). You fix it anyway, because a
                column that lies about its type will trip up the next person who uses your notebook. Often that's you, a
                month later.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 56 }}>Check 3: is anyone in here twice?</h3>
          <WhyBlock
            task={<p>Count repeated customer IDs. Then count rows that match another row in every column except the ID.</p>}
            why={
              <p>
                Same reason as last week: a customer in the data twice gets two votes when the model learns. This time
                you can check two ways. A repeated <b>ID</b> means the same customer was entered twice, so that's
                definitely a copy. Rows that match on everything <b>except</b> the ID are different customers who happen
                to look the same. Those need a closer look before you do anything.
              </p>
            }
          />
          <ColabCell
            label="Cell 10"
            code={CODE.dupes}
            out={[{ kind: 'text', text: '0 repeated customer IDs\n22 rows that match another row apart from the ID' }]}
            after={
              <>
                No customer is in twice. But 22 rows are exact lookalikes of another row. <b>Do you drop them? No.</b>{' '}
                They all have different IDs, so they're different people. Look at them and you'll find they're all in
                their first month, on month-to-month plans, with one bill each. With 20 columns, most of them Yes or No,
                and prices taken from a price list, two brand-new customers on the same basic plan can easily match.
                <br />
                <br />
                Compare last week. That duplicate matched to the cent on a medical bill, which doesn't come from a price
                list. Two identical rows mean different things in different data. A duplicate check is a question, not a
                delete button.
              </>
            }
          />
          <Task title="Don't take my word for it" time="2 min">
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              Check my claim that the lookalikes are all first-month customers. In a new cell:{' '}
              {c('df[df.drop(columns="customerID").duplicated(keep=False)]["tenure"].value_counts()')}. {c('keep=False')}{' '}
              means "show every copy, including the first", just like last week.
            </p>
            <Answer>
              <pre className="lr-answer-pre">{'tenure\n1    42\nName: count, dtype: int64'}</pre>
              All 42 rows involved (the 22 lookalikes plus the rows they match) have a tenure of 1. Checked. Get into
              the habit of checking claims like this, mine included.
            </Answer>
          </Task>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 56 }}>Check 4: can a model read every column you'll use?</h3>
          <WhyBlock
            task={<p>Turn Churn, Contract and InternetService from words into numbers.</p>}
            why={
              <p>
                A decision tree asks questions like "is this number 0.5 or less?" It can compare 0 with 0.5. It can't
                compare "Month-to-month" with anything. So every column the tree uses, and the answer it learns, has to
                be a number.
              </p>
            }
            which={
              <ul style={{ marginTop: 0 }}>
                <li><b>Churn</b> is the answer the tree learns to give: 1 for left, 0 for stayed. It's also the fix for Kaggle's "100% mismatched".</li>
                <li>
                  <b>Contract</b> gets 0, 1 and 2, in that order, because there's a real order: month-to-month is the
                  shortest, two years the longest. With the order kept, the tree can ask "is the contract shorter than a
                  year?" in one question.
                </li>
                <li>
                  <b>InternetService</b> has three answers: fibre, DSL, or no internet. We only want one question from it:
                  fibre or not? So you make a new column, <b>Fiber</b>, with 1 for fibre and 0 for anything else. Why
                  fibre? Cell 13 shows you in a minute.
                </li>
              </ul>
            }
            whichLabel="Why these three?"
          />
          <ColabCell
            label="Cell 11 · run this once only"
            code={CODE.map}
            out={OUT_MAPPED}
            after={
              <>
                Churn and Contract are numbers now, and Fiber is new. I left InternetService in the output on purpose,
                so you can check the new column against the old one: DSL became 0, Fiber optic became 1. Run this cell{' '}
                <b>once</b>. Run it twice and Churn and Contract turn into NaN, because the second run looks for "Yes"
                and "Month-to-month" and finds only numbers.
              </>
            }
          />
        </Reveal>

        {/* ── Compare ────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 56 }}>Compare groups: who leaves more?</h3>
          <WhyBlock
            task={<p>Work out what share of customers left for each contract type. Then do the same for fibre against no fibre.</p>}
            why={
              <>
                <p>
                  Go back to the retention manager's question: <i>who should we call?</i> You can't see the answer by
                  scrolling through 7,043 rows. What you can do is split customers into groups and compare. If one group
                  leaves far more than another, whatever makes those groups different is a suspect.
                </p>
                <p>
                  This matters even more today than last week, because finding groups that leave more is{' '}
                  <i>exactly</i> what a decision tree does. Doing it by hand first means you'll recognise the tree's
                  answer when you see it, and you'll know whether to trust it.
                </p>
              </>
            }
            which={
              <ul style={{ marginTop: 0 }}>
                <li>
                  <b>Contract</b> is the obvious suspect. A month-to-month customer can walk away any month at no cost.
                  Someone on a two-year contract usually has to pay to leave early.
                </li>
                <li>
                  <b>Fibre</b> is the company's fastest and most expensive service. Do people paying the most leave the
                  most? Worth checking.
                </li>
              </ul>
            }
            whichLabel="Why these two?"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">A</span><h4>The trick: the average of 1s and 0s is a share</h4></div>
          <div className="bt-prose">
            <p>
              Last week you compared average <i>bills</i>. Today the answer column is just 1s and 0s. So what's the
              average of a column of 1s and 0s? Try it on ten customers. Click a few to change them and watch the sum.
            </p>
          </div>
          <ShareOfOnes />
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            Add up the 1s and you've counted the customers who left. Divide by how many there are and you have the
            share who left. So {c('.mean()')} on Churn means "what share of this group left?". That's the whole trick.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">B</span><h4>By contract</h4></div>
          <ReadAloud
            lines={[
              ['df.groupby("Contract")', 'sort the customers into groups by contract: 0, 1 and 2'],
              ['["Churn"]', 'in each group, look only at the Churn column'],
              ['.mean()', 'average it, which, as you just saw, is the share who left'],
              ['.round(3)', 'three decimal places, so it’s readable'],
            ]}
          />
          <ColabCell
            label="Cell 12"
            code={CODE.byContract}
            out={[{ kind: 'text', text: 'Contract\n0    0.427\n1    0.113\n2    0.028\nName: Churn, dtype: float64' }]}
            after={
              <>
                <div className="lr-compare" aria-hidden="true">
                  {([['Month-to-month', 0.427], ['One year', 0.113], ['Two year', 0.028]] as [string, number][]).map(([label, v]) => (
                    <div key={label} className="lr-compare__row">
                      <span>{label}</span>
                      <span className="lr-compare__bar"><i style={{ width: `${(v / 0.427) * 100}%`, background: 'var(--cat-2)' }} /></span>
                      <b>{(v * 100).toFixed(1)}%</b>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: 14 }}>
                  0 is month-to-month, 1 is one year, 2 is two years. <b>42.7%</b> of month-to-month customers left
                  last month, against <b>2.8%</b> of two-year customers. That's about fifteen times as likely. If you
                  told the retention manager only one thing today, it would be this.
                </p>
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">C</span><h4>By fibre</h4></div>
          <ColabCell
            label="Cell 13"
            code={CODE.byFiber}
            out={[{ kind: 'text', text: 'Fiber\n0    0.145\n1    0.419\nName: Churn, dtype: float64' }]}
            after={
              <>
                <b>41.9%</b> of fibre customers left, against <b>14.5%</b> of everyone else. Nearly three times as
                many. So the most expensive service loses the most customers. Interesting, and it's exactly the sort of
                thing a manager will ask you "why?" about. Hold that question. It comes back in the limits section.
              </>
            }
          />
          <Task title="Your turn: two more suspects" time="10 min">
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              Same pattern, two new columns. These two are already usable as they are, because groupby can group by
              text. Only the thing you take the mean of has to be a number.
            </p>
            <ol>
              <li>{c('df.groupby("PaymentMethod")["Churn"].mean().round(3)')}. Which way of paying stands out?</li>
              <li>{c('df.groupby("SeniorCitizen")["Churn"].mean().round(3)')}. Do seniors leave more or less?</li>
            </ol>
            <Answer>
              <b>Electronic check: 0.453.</b> Every other method is between 0.152 and 0.191, so people paying by
              electronic check leave at more than twice the rate of everyone else. <b>Seniors: 0.417</b>, against 0.236
              for everyone else. Why might electronic check stand out? A good question for your report. Notice anything
              you write is a guess, though. The data shows <i>who</i> leaves, not <i>why</i>.
            </Answer>
          </Task>
        </Reveal>

        {/* ── Look ───────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 56 }}>Look before you model</h3>
          <WhyBlock
            task={<p>Draw two charts: the share who left for each contract type, and the share who left by months as a customer.</p>}
            why={
              <>
                <p>
                  The contract chart is for other people. Three numbers in a table are easy to skim past. Three bars,
                  one towering over the others, are not. It's the chart you'd put in front of the retention manager.
                </p>
                <p>
                  The tenure chart is for you. Tenure has 73 different values, from 0 to 72 months. That's far too many
                  to read as a table, but a line shows its shape in one glance: what happens to customers as they stay
                  longer.
                </p>
              </>
            }
            which={
              <p>
                It's the third suspect. You'd guess a customer who joined last month is easier to lose than one who's
                been around for five years. A chart will tell you whether that's true, and when the risk drops.
              </p>
            }
            whichLabel="Why tenure?"
          />
          <ReadAloud
            lines={[
              ['rates = df.groupby("Contract")["Churn"].mean()', 'the three shares from cell 12, saved under the name rates'],
              ['rates.plot(kind="bar", rot=0)', 'draw them as bars. rot=0 keeps the labels underneath upright'],
              ['plt.xlabel( ) and plt.ylabel( )', 'label both axes. A chart with no labels is a puzzle, not a chart'],
            ]}
          />
          <ColabCell
            label="Cell 14"
            code={CODE.barChart}
            out={[CHART('chart-contract.webp', 'Bar chart of the share of customers who left by contract type: about 0.43 for month-to-month, about 0.11 for one year, and about 0.03 for two year.')]}
            after={<>The same three numbers as cell 12, and now nobody can miss them.</>}
          />
          <ColabCell
            label="Cell 15"
            code={CODE.lineChart}
            out={[CHART('chart-tenure.webp', 'Line chart of the share of customers who left by months as a customer. It starts at 0 for month 0, jumps to about 0.62 at month 1, then zig-zags downward: about 0.47 at months 3 to 5, around 0.25 by month 20, about 0.2 at month 40, and under 0.1 by month 70, falling to about 0.02 at month 72.', 816, 621)]}
            after={
              <>
                Look at it for ten seconds before reading on.
                <br />
                <br />
                It starts at zero: those are the eleven brand-new customers from cell 8, who haven't had time to leave.
                Then it jumps to <b>62%</b> at one month and slides down from there. By two years it's down to about one
                in four, and at six years it's 2%. <b>The first months are the danger zone.</b> The zig-zag is
                just because each month is a smallish group of customers, so read the overall trend, not every wiggle.
                Remember "the first year or so". The tree is about to find its own cut-off.
              </>
            }
          />
          <div className="lr-task__foot" style={{ marginTop: 18 }}>
            <DoneButton stage="clean">I've cleaned, compared and looked</DoneButton>
          </div>
        </Reveal>
      </section>

      {/* ══ 7. Model ═════════════════════════════════════════════════════ */}
      <section id="step-model" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 7 · about 25 minutes"
            title="Grow a tree, then test it fairly"
            aside="You'll pick the first question yourself, then let the computer do the rest, and check it honestly."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              A decision tree is a flowchart of yes/no questions. Growing one, which is what "training" means here, is
              surprisingly simple. The computer tries every question it could ask and keeps the one that sorts leavers
              from stayers most cleanly. Then it does exactly the same thing again inside each of the two groups it
              made. And again. That's the whole method.
            </p>
            <p>Before the computer does it, you do it.</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">A</span><h4>Make the first cut yourself</h4></div>
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            These are the real 5,634 customers the tree will learn from. Pick a question and the crowd splits into a
            "yes" pile and a "no" pile. A good question puts most of the leavers (orange) in one pile. For the two number
            questions, drag the slider to find the best cut-off. Can you beat the contract question?
          </p>
          <FirstCut />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">B</span><h4>Split the customers, as last week</h4></div>
          <WhyBlock
            task={<p>Choose the columns the tree may use, then hide 20% of the customers for the test.</p>}
            why={
              <p>
                Same reason as last week. A model tested on the customers it learned from always looks brilliant, like a
                student marked on the exact questions they practised. So 20% are hidden until the test.
              </p>
            }
            which={
              <ul style={{ marginTop: 0 }}>
                <li><b>tenure, Contract and Fiber</b>: the three suspects you found in step 6.</li>
                <li><b>MonthlyCharges</b>: the price. A natural suspect too, so let the tree decide whether it matters.</li>
                <li>
                  <b>Not customerID</b>: it's a name tag (question 8). <b>Not TotalCharges</b>: it's almost exactly tenure
                  × MonthlyCharges, so it would tell the tree the same thing twice.
                </li>
                <li><b>Not the other fifteen</b>, for now. Fewer columns make a tree you can read. You can try adding more once it works.</li>
              </ul>
            }
            whichLabel="Why these four columns?"
          />
          <ColabCell
            label="Cell 16"
            code={CODE.split}
            out={[{ kind: 'text', text: '5634 customers to learn from\n1409 customers kept back for the test' }]}
            after={
              <>
                <b>X</b> is the four inputs, <b>y</b> is the answer: Churn. {c('test_size=0.2')} is the 20%, and{' '}
                {c('random_state=42')} makes the shuffle come out the same as mine. 5,634 + 1,409 = 7,043. Nobody lost.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">C</span><h4>The score to beat</h4></div>
          <WhyBlock
            task={<p>Before training anything, work out the score you'd get with no model at all, by saying "stays" to every test customer.</p>}
            why={
              <>
                <p>
                  Most customers stay. So a "model" that says <i>stays</i> to everyone is right most of the time, while
                  being completely useless: it never finds a single leaver. Whatever your tree scores, it has to beat
                  that, or it has learned nothing.
                </p>
                <p>
                  Take this habit to work. Whenever someone shows you an accuracy score, ask "compared with what?" A
                  model that's 95% accurate at spotting fraud sounds great, until you learn that 99% of payments aren't
                  fraud.
                </p>
              </>
            }
          />
          <ReadAloud
            lines={[
              ['y_test == 0', 'ask every test customer: did you stay? True or False for each'],
              ['.mean()', 'the share of Trues: the share who stayed'],
            ]}
          />
          <ColabCell
            label="Cell 17"
            code={CODE.baseline}
            out={[{ kind: 'text', text: "Always guessing 'stays': 0.735" }]}
            after={<>73.5% of the test customers stayed. So <b>0.735</b> is the bar. Anything below it is worse than not bothering.</>}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">D</span><h4>Grow the tree</h4></div>
          <ReadAloud
            lines={[
              ['DecisionTreeClassifier', 'a tree that sorts people into classes, here “stays” and “leaves”. Last week’s LinearRegression predicted a number; a classifier predicts a category'],
              ['max_depth=3', 'it may ask at most three questions about any customer. That keeps it small enough to read. “What if you let it grow?”, below, shows the other reason'],
              ['random_state=42', 'when two questions score exactly the same, the tree picks one at random. This makes it pick the same one as mine'],
              ['tree.fit(X_train, y_train)', 'grow the tree from the 5,634 training customers'],
              ['tree.score(X_test, y_test)', 'test it on the 1,409 hidden customers: the share it gets right'],
            ]}
          />
          <ColabCell
            label="Cell 18"
            code={CODE.train}
            out={[{ kind: 'text', text: 'Score: 0.796' }]}
            after={
              <>
                Right about 79.6% of the new customers, against 73.5% for guessing. Six points better. That might not
                sound like much. Hold on, because the score hides the most useful thing the tree does, and you'll find it
                in a moment.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 48 }}>Read the tree</h3>
          <div className="bt-prose">
            <p>
              This is the big advantage of a decision tree. Linear regression gave you five numbers. A tree gives you a
              picture you can follow with your finger.
            </p>
          </div>
          <ColabCell
            label="Cell 19"
            code={CODE.plot}
            out={[CHART('chart-tree.webp', 'The trained decision tree drawn by scikit-learn: 15 boxes in four rows. The top box asks Contract <= 0.5 with 5,634 samples, value [4138, 1496], class Stays. True leads left to Fiber <= 0.5, False leads right to MonthlyCharges <= 93.675. The second row splits on tenure <= 3.5 and tenure <= 14.5 on the left, and Contract <= 1.5 twice on the right. Of the eight boxes along the bottom, only one is blue, class Leaves: 785 samples, value [239, 546]. The other seven are orange, class Stays.', 1814, 804, true)]}
            after={<>Fifteen boxes. On a phone, scroll the picture sideways. Here's how to read one box, using the top one as the example.</>}
          />
          <div className="bt-rows" style={{ marginTop: 22 }}>
            <div><h4>Contract &lt;= 0.5</h4><p>The question. Contract is 0, 1 or 2, so "0.5 or less" is the computer's way of asking "is it 0?", meaning month-to-month. <b>True goes left, False goes right.</b></p></div>
            <div><h4>samples = 5634</h4><p>How many training customers reached this box. At the top, that's all of them.</p></div>
            <div><h4>value = [4138, 1496]</h4><p>Of those, how many stayed and how many left, in that order. 1,496 of 5,634 left.</p></div>
            <div><h4>class = Stays</h4><p>The bigger group, which is what the tree would predict if it stopped here.</p></div>
            <div><h4>gini = 0.39</h4><p>How mixed the box is. 0 means everyone did the same thing, and 0.5 is a fifty-fifty mix. The tree looks for questions that bring this down. You can mostly ignore it.</p></div>
            <div><h4>The colours</h4><p>Orange boxes say "stays", blue says "leaves". The stronger the colour, the more one-sided the box.</p></div>
          </div>
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            Watch out for one trap. The second question on the left is <b>Fiber &lt;= 0.5</b>, which means "is Fiber 0?",
            or <i>no fibre</i>. So for that box, True (left) means <b>no</b> fibre. When a column is 1s and 0s, read{' '}
            {c('<= 0.5')} as "is it 0?".
          </p>
          <ColabCell
            label="Cell 20 · the same tree, as text"
            code={CODE.text}
            out={[{ kind: 'text', text: OUT_EXPORT }]}
            after={
              <>
                Same tree, written as indented rules. Easier to copy into a report than a picture. Each{' '}
                {c('|---')} is one step down, and {c('class: 1')} means "leaves". Scan the bottom of each branch:{' '}
                <b>only one says class: 1.</b>
              </>
            }
          />
          <div className="bt-caution" style={{ marginTop: 22 }}>
            <p className="bt-eyebrow">The rule for the retention manager</p>
            <p>
              <b>Month-to-month, on fibre, and a customer for 14 months or less.</b> Of the 785 training customers who
              fit that description, 546 left. That's 7 in 10. It's the only leaf on the tree that says "leaves", and it's
              three things you found yourself in step 6: contract, fibre and the early months, now with a cut-off
              attached. Notice the tree also has seven leaves that say "stays", even where plenty of people left. More
              on that in step 8.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 48 }}>Who did it actually catch?</h3>
          <div className="bt-prose">
            <p>
              The score counts every right answer the same. But the retention manager doesn't care about the customers
              who were always going to stay. They care about the ones who leave. So count those.
            </p>
          </div>
          <ReadAloud
            lines={[
              ['tree.predict(X_test)', 'the tree’s answer for each of the 1,409 test customers: 1 for leaves, 0 for stays'],
              ['(predictions == 1) & (y_test == 1)', 'True only where the tree said “leaves” and the customer really did leave. & means both'],
              ['.sum()', 'count them'],
            ]}
          />
          <ColabCell
            label="Cell 21"
            code={CODE.caught}
            out={[{ kind: 'text', text: 'Customers in the test who really left: 373\nOf those, the tree caught: 146' }]}
            after={<>146 of 373. It misses more leavers than it catches. That sounds bad. Now look at it from the retention team's side.</>}
          />
          <Caught />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 48 }}>What if you let it grow?</h3>
          <div className="bt-prose">
            <p>
              Why stop at three questions? Surely more questions means a smarter tree. Take the limit off and see. In{' '}
              <i>Three ways to predict things</i> you watched a tree do this to fourteen gym members. Here it is on 5,634
              real ones.
            </p>
          </div>
          <ColabCell
            label="Cell 22"
            code={CODE.bigTree}
            out={[{ kind: 'text', text: 'On the customers it learned from: 0.983\nOn customers it has never seen: 0.736' }]}
            after={
              <>
                98.3% right on the customers it learned from. Then <b>73.6%</b> on new customers, which is worse than
                your small tree and barely above the 73.5% you get for guessing "stays". It hasn't learned a pattern.
                It's memorised 5,634 customers, quirks and all, and none of that carries over to anyone new. This is{' '}
                <b>overfitting</b>, and it's why {c('max_depth')} exists.
              </>
            }
          />
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            Every depth from 1 to "no limit", grown on your data with your split. Drag the dial and watch the two lines
            come apart.
          </p>
          <DepthDial />
        </Reveal>

        <Reveal delay={0.05}>
          <Task title="Your turn: change the depth" time="10 min" foot={<DoneButton stage="model">I've grown and tested a tree</DoneButton>}>
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              In cell 18, change {c('max_depth=3')} to 2, then 4, then 5. Each time, run cells 18 and 21 and write down
              the score and how many leavers it caught. Which would you hand to the retention manager, and why? Put it
              back to 3 when you're done.
            </p>
            <Answer>
              Depth 2: score 0.779, caught 246. Depth 4: 0.794, caught 182. Depth 5: 0.794, caught 206. Depth 3 has the
              best score, but depth 2 catches the most leavers, because it flags many more people: 431, against 207 for
              depth 3. There's no single right answer. It depends on how many calls the team can make. Saying that in
              your report, with the numbers, is exactly what a good analyst does.
            </Answer>
          </Task>
        </Reveal>
      </section>

      {/* ══ 8. Predict ═══════════════════════════════════════════════════ */}
      <section id="step-predict" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 8 · about 10 minutes"
            title="Now predict someone new"
            aside="Take a customer the tree has never seen, and follow them down the branches."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Here's your tree, drawn as a flowchart. Pick a customer or set your own, and watch their path light up:
              three questions, then a leaf. The leaf says what share of training customers like them left.
            </p>
          </div>
          <TreeWalk />
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            Try <b>A close call</b>. Month-to-month, two months in, no fibre: 46% of customers like that left. That's a
            lot, but a few more stayed than left, so the leaf says "stays". A tree only ever gives one answer per leaf.
            That's why the probability on the second line is worth reporting too.
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Do it in your notebook</h3>
          <ColabCell
            label="Cell 23"
            code={CODE.predict}
            out={[{ kind: 'text', text: '[1 0 0]\n[[0.3  0.7 ]\n [0.93 0.07]\n [0.99 0.01]]' }]}
            after={
              <>
                Three made-up customers, one per column of numbers. The first line is the answer: <b>A leaves</b>, B and C
                stay. The second line has one row per customer: the chance they stay, then the chance they leave.{' '}
                <b>A</b>, two months in, month-to-month, on fibre: <b>70%</b> likely to leave. That's the 546 out of 785
                from the leaf. <b>B</b>, on a one-year contract: 7%. <b>C</b>, a two-year customer of five years: 1%. The
                columns need the same names, in the same order, as the X you trained on.
              </>
            }
          />
          <div className="bt-caution">
            <p className="bt-eyebrow">Made-up customers only</p>
            <p>
              Not your own phone account, and definitely not real customers from a job. Customer records are personal
              information, and New Zealand's Privacy Act 2020 limits using them for anything other than the reason they
              were collected. A class notebook you'll screenshot into a report isn't that reason.
            </p>
          </div>
          <Task title="Your three customers" time="10 min" foot={<DoneButton stage="predict">I've made my predictions</DoneButton>}>
            <ol>
              <li>Change the numbers in cell 23 to three customers you make up. Make one of them a close call.</li>
              <li>Run it, and copy each prediction and chance of leaving into the table in your report.</li>
              <li>For each one, write whether it looks sensible to you, and why. "It seems low because…" is fine.</li>
            </ol>
          </Task>
        </Reveal>
      </section>

      {/* ══ Limits ═══════════════════════════════════════════════════════ */}
      <section id="limits" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Before you write it up"
            title="What it can’t tell you"
            aside="A tree looks so clear that people trust it more than they should. Your report needs a paragraph on this, so here's a head start."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-rows">
            <div>
              <h4>It learned from a made-up company</h4>
              <p>IBM's fictional telco, in California, in an unnamed year. The patterns are realistic, and that's all. It tells you nothing reliable about any real New Zealand provider today.</p>
            </div>
            <div>
              <h4>It misses six in ten leavers</h4>
              <p>227 of the 373 who left, the tree said would stay. Four columns can't see a competitor's offer, a bad call with the help desk, or someone moving house. The data doesn't have those things.</p>
            </div>
            <div>
              <h4>It thinks in steps, not slopes</h4>
              <p>Fourteen months on fibre and month-to-month: "leaves". Fifteen months: "stays". Nobody really changes overnight at month fifteen. A tree draws hard lines because questions have yes/no answers.</p>
            </div>
            <div>
              <h4>Everyone on a leaf gets the same chance</h4>
              <p>A customer one month in and one fourteen months in both get 70%. Your tenure chart showed the first month is far riskier. The tree can't see that difference once they share a leaf.</p>
            </div>
            <div>
              <h4>It shows who leaves, not why</h4>
              <p>Fibre customers leave more. That doesn't mean fibre makes them leave. Maybe fibre is where rivals compete hardest, or it's the priciest plan, or the fibre service is poor. The tree can't tell those apart, and neither can you, from this data alone.</p>
            </div>
            <div>
              <h4>Should it be used at all?</h4>
              <p>If only customers who look likely to leave get a discount, loyal customers end up paying more for the same service. Some people call that a loyalty penalty. In 2022 UK regulators banned home and car insurers from charging renewing customers more than new ones for exactly this reason. Is it fair for a phone company? Your report should give your view, and a reason for it.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ 9. Report ════════════════════════════════════════════════════ */}
      <section id="step-report" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 9 · the hand-in"
            title="Write it up. Reply in Teams."
            aside="Short and specific beats long and vague. I'd rather read 700 words that are yours than 2,000 that aren't."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Countdown deadline={DT_DEADLINE} />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ margin: '26px 0 22px' }}>
            <p>
              Write it for the retention manager from the start of the lab: someone smart who has never opened Python
              and wants to know who to call. Every number has to come from your own notebook, not from this page. If
              yours differ from mine, use yours and say why you think they differ.
            </p>
          </div>
          <div className="lr-brief">
            <ol className="lr-brief__sec">
              {[
                ['The dataset', '~100 words', 'Name it, link it, who made it. Is the company real, and what does the licence let you do? Rows, columns, and what Churn means. One thing on the card you would question.'],
                ['Cleaning', '~150 words', 'What was hiding in TotalCharges, how you found it, what you did and why. What the duplicate check showed, and why you kept those rows. Screenshot your cleaning cells.'],
                ['What I noticed before modelling', '~150 words', 'The share who left by contract and by fibre. One of your charts, described in plain English. Which group would you call first?'],
                ['My tree', '~200 words', 'The four columns, the score to beat, your score. Your tree, and its "leaves" path as one sentence a manager could act on. How many leavers it caught, and what happened with no max_depth.'],
                ['My predictions', '~150 words', 'Three made-up customers, the prediction and chance of leaving for each, and whether each looks sensible to you.'],
                ['What the tree can\'t tell us', '~150 words', 'At least two limits. Then your view: is it fair to give discounts only to customers the tree says are about to leave?'],
                ['Screenshots', 'at least 4', 'From your own notebook, with your name in its title: the data loaded, your TotalCharges fix, your tree, and your score.'],
              ].map(([t, n, body], i) => (
                <li key={t}>
                  <span className="lr-brief__n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{t} <small>{n}</small></h4>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="lr-facts">
              <dl>
                <div><dt>Length</dt><dd>600 to 1,000 words, plus your screenshots</dd></div>
                <div><dt>Format</dt><dd>PDF. In Word: File → Save As → PDF. A .docx is fine if PDF is a struggle.</dd></div>
                <div><dt>File name</dt><dd><code>{REPORT_FILE}</code></dd></div>
                <div><dt>Post it</dt><dd>As a <b>reply under my decision tree lab post</b> in the class channel. Not a new post, and not a private message.</dd></div>
                <div><dt>Due</dt><dd>{DT_DEADLINE.label}, New Zealand time</dd></div>
              </dl>
              <div className="lr-facts__actions">
                <a className="bt-btn" href={`${ASSETS}MBI806B-decision-tree-report-template.docx`} download style={{ textDecoration: 'none' }}>
                  Download the report template
                  <span className="bt-btn__badge" aria-hidden="true">↓</span>
                </a>
                <span className="lr-caption" style={{ color: 'var(--ink-300)' }}>Word, with all seven headings and prompts in grey.</span>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Replying to the post in Teams</h3>
          <p className="bt-note" style={{ maxWidth: '62ch' }}>
            Same as last week, but under the <b>decision tree</b> lab post, not the linear regression one. Check the
            title before you press Send.
          </p>
          <TeamsDemo post={TEAMS_POST} />
        </Reveal>
        <Reveal delay={0.05}>
          <Task title="Before you press Send" foot={<DoneButton stage="report">I've sent my report</DoneButton>}>
            <ul>
              <li>Your name is in your notebook's title and at the top of the report.</li>
              <li>Every number in the report came from your own notebook.</li>
              <li>At least four screenshots, including your tree.</li>
              <li>Saved as a PDF called {c(REPORT_FILE)}, with your name in place of YourName.</li>
              <li>Posted as a <b>reply under the decision tree lab post</b> in Teams, with one line saying what it is.</li>
            </ul>
          </Task>
        </Reveal>
      </section>

      {/* ══ Quiz ═════════════════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Quick quiz"
            title="Five questions"
            aside="Nothing is saved and nobody sees it. Read why the wrong answers are wrong. That's the useful part."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz questions={QUESTIONS} closing="If you missed one, go back to that step before you write your report." />
        </Reveal>
      </section>

      <Recap
        title="Six things to take away"
        points={RECAP}
        footnote="Data: BlastChar, Telco Customer Churn, Kaggle, from IBM's sample data sets (a fictional company); data files © original authors. Screenshots of Kaggle and Google Colab taken October 2026."
      />

      {/* ══ Stuck ════════════════════════════════════════════════════════ */}
      <section id="help" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Stuck?"
            title="When it goes wrong"
            aside="These are the ones that catch people. None of them mean you're bad at this."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-rows">
            {HELP.map(([q, a]) => (
              <div key={q}>
                <h4 style={{ fontFamily: q.includes('Error') ? 'var(--font-mono)' : undefined, fontSize: q.includes('Error') ? 13.5 : undefined }}>{q}</h4>
                <p>{a}</p>
              </div>
            ))}
          </div>
          <div className="lr-task" style={{ background: 'var(--paper-0)', borderColor: 'var(--border-subtle)' }}>
            <h4 style={{ marginTop: 0 }}>Completely lost?</h4>
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6, color: 'var(--ink-600)' }}>
              Here's my finished notebook. Download it, then in Colab choose <b>File → Upload notebook</b>. Compare it with
              yours cell by cell. Don't hand in mine: your report needs screenshots of your own notebook, with your
              name on it, and I can tell.
            </p>
            <a className="bt-btn bt-btn--sm bt-btn--tertiary" href={`${ASSETS}MBI806B-decision-tree-lab.ipynb`} download style={{ marginTop: 12, textDecoration: 'none' }}>
              Download the finished notebook
              <span className="bt-btn__badge" aria-hidden="true">↓</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* ══ Links ════════════════════════════════════════════════════════ */}
      <section id="links" className="bt-sec">
        <Reveal>
          <SectionHead eyebrow="Links" title="Everything in one place" aside="The dataset and Colab are the two you'll open most." />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="pbi-links">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <ExternalLink size={12} aria-hidden="true" />
                </a>
                <span>{l.note}</span>
              </li>
            ))}
          </ul>
          <p className="bt-note">
            Kaggle home: <a href={KAGGLE_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-600)' }}>kaggle.com</a>. Want
            more? Add PaymentMethod or SeniorCitizen to the tree (you'll need to turn them into numbers first), and see
            whether the score or the catch changes.
          </p>
        </Reveal>
      </section>

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>Always ask: compared with what<span className="bt-stop">?</span></h2>
            <p className="bt-signoff__body">
              Two labs in, you've now done the whole job twice, with two different models. Notice what didn't change:
              read the label, check the data properly, look before you model, test it on people it hasn't seen, and say
              what it can't do. The model was the shortest part both times. The habits around it are what make your
              numbers worth trusting.
            </p>
            <p className="bt-signoff__name">
              {LECTURER}
              <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer">
                MBI806B lecturer <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
