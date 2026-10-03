import { useState, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { LessonHeader, Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import Shot, { Figure } from './regression/Shot';
import ColabCell, { type Output } from './regression/ColabCell';
import BandsChart from './regression/BandsChart';
import DataCardQuestions from './regression/DataCardQuestions';
import { BillBuilder, SplitDemo } from './regression/ModelWidgets';
import { TeamsDemo, UnzipDemo, UploadDemo, REPORT_FILE } from './regression/Walkthroughs';
import { Checklist, DoneButton } from './regression/Checklist';
import { FilterDemo, ReadADot, ReadAloud, WhyBlock } from './regression/Teaching';
import '../../styles/regression-lab.css';

// ─── MBI806B · Linear regression lab ──────────────────────────────────────
// The hands-on follow-up to "Three ways to predict things". That lesson
// taught linear regression on twelve made-up flats; this one has the
// student do the whole job on a real public dataset, end to end, and hand
// in a short report through Teams chat.
//
// The dataset is Kaggle's "Medical Cost Personal Datasets" (Miri Choi,
// mirichoi0218/insurance): 1,338 people, seven columns, one CSV, ODbL. It
// was chosen because it is small enough to read in a sitting, clean enough
// for a first attempt, and still has three real lessons hiding in it — one
// duplicate row, one text column a model can't read, and a data card that
// contradicts itself. It also has a business question an MBA student can
// feel: what drives a customer's medical bill.
//
// Every number on this page is real. The screenshots are genuine captures
// of kaggle.com and colab.research.google.com taken in October 2026. Every
// code output is what the lab's notebook printed when run on the real CSV
// under Colab's own library versions (pandas 2.2.3, scikit-learn 1.6.1),
// and the finished notebook is in public/mbi806b/linear-regression/. If
// Kaggle changes the page, retake the screenshots before changing the text.
//
// Written the way I'd say it in the room: short sentences, "you" and "I",
// and a reason for every step, because a step without a reason is the one
// a student skips.

const BASE = import.meta.env.BASE_URL;
const ASSETS = `${BASE}mbi806b/linear-regression/`;
const DATASET_URL = 'https://www.kaggle.com/datasets/mirichoi0218/insurance';
const COLAB_URL = 'https://colab.research.google.com';
const KAGGLE_URL = 'https://www.kaggle.com';

/** When reports are due. One place, so it is easy to change each intake. */
const DUE = 'before our next class';
const LECTURER = 'Yasas Sri Wickramasinghe';

/* ── Small pieces used throughout ──────────────────────────────────────── */

function Task({ title, time, children, foot }: { title: string; time?: string; children: ReactNode; foot?: ReactNode }) {
  return (
    <div className="lr-task">
      <div className="lr-task__head">
        <span className="lr-task__tag">Do this now</span>
        {time && <span className="lr-task__time">{time}</span>}
      </div>
      <h4>{title}</h4>
      {children}
      {foot && <div className="lr-task__foot">{foot}</div>}
    </div>
  );
}

function Answer({ label = 'Show the answer', children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 12 }}>
      <button type="button" className="lr-navbtn" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {open ? 'Hide the answer' : label}
      </button>
      {open && <div className="lr-q__ans" style={{ marginLeft: 0 }}>{children}</div>}
    </div>
  );
}

const c = (s: string) => <code className="lr-inline">{s}</code>;

/** An in-page link. A plain hash link would be read by the HashRouter as a
 *  route and navigate away, so this scrolls instead. */
function Jump({ to, children }: { to: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className="lr-jump"
      onClick={() => document.getElementById(to)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
    >
      {children}
    </button>
  );
}

/* ── The real outputs, as Colab printed them ───────────────────────────── */

const HEAD_COLS = ['age', 'sex', 'bmi', 'children', 'smoker', 'region', 'charges'];

const OUT_HEAD: Output[] = [
  {
    kind: 'table',
    columns: HEAD_COLS,
    rows: [
      [0, 19, 'female', '27.900', 0, 'yes', 'southwest', '16884.92400'],
      [1, 18, 'male', '33.770', 1, 'no', 'southeast', '1725.55230'],
      [2, 28, 'male', '33.000', 3, 'no', 'southeast', '4449.46200'],
      [3, 33, 'male', '22.705', 0, 'no', 'northwest', '21984.47061'],
      [4, 32, 'male', '28.880', 0, 'no', 'northwest', '3866.85520'],
    ],
  },
];

const OUT_INFO = `<class 'pandas.core.frame.DataFrame'>
RangeIndex: 1338 entries, 0 to 1337
Data columns (total 7 columns):
 #   Column    Non-Null Count  Dtype
---  ------    --------------  -----
 0   age       1338 non-null   int64
 1   sex       1338 non-null   object
 2   bmi       1338 non-null   float64
 3   children  1338 non-null   int64
 4   smoker    1338 non-null   object
 5   region    1338 non-null   object
 6   charges   1338 non-null   float64
dtypes: float64(2), int64(2), object(3)
memory usage: 73.3+ KB`;

const OUT_DESCRIBE: Output[] = [
  {
    kind: 'table',
    columns: ['age', 'bmi', 'children', 'charges'],
    rows: [
      ['count', '1338.0', '1338.0', '1338.0', '1338.0'],
      ['mean', '39.2', '30.7', '1.1', '13270.4'],
      ['std', '14.0', '6.1', '1.2', '12110.0'],
      ['min', '18.0', '16.0', '0.0', '1121.9'],
      ['25%', '27.0', '26.3', '0.0', '4740.3'],
      ['50%', '39.0', '30.4', '1.0', '9382.0'],
      ['75%', '51.0', '34.7', '2.0', '16639.9'],
      ['max', '64.0', '53.1', '5.0', '63770.4'],
    ],
    hot: [[1, 3], [5, 3], [7, 3]],
  },
];

const OUT_DUPES: Output[] = [
  {
    kind: 'table',
    columns: HEAD_COLS,
    rows: [
      [195, 19, 'male', '30.59', 0, 'no', 'northwest', '1639.5631'],
      [581, 19, 'male', '30.59', 0, 'no', 'northwest', '1639.5631'],
    ],
  },
];

const OUT_MAPPED: Output[] = [
  {
    kind: 'table',
    columns: HEAD_COLS,
    rows: [
      [0, 19, 'female', '27.900', 0, 1, 'southwest', '16884.92400'],
      [1, 18, 'male', '33.770', 1, 0, 'southeast', '1725.55230'],
      [2, 28, 'male', '33.000', 3, 0, 'southeast', '4449.46200'],
      [3, 33, 'male', '22.705', 0, 0, 'northwest', '21984.47061'],
      [4, 32, 'male', '28.880', 0, 0, 'northwest', '3866.85520'],
    ],
    hot: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]],
  },
];

const OUT_MASK = `0        True
1       False
2       False
3       False
4       False
        ...
1333    False
1334    False
1335    False
1336    False
1337     True
Name: smoker, Length: 1337, dtype: bool`;

const CHART = (src: string, alt: string): Output => ({ kind: 'image', src, alt, width: 848, height: 621 });

/* ── The code, exactly as the student types it ─────────────────────────── */

const CODE = {
  load: 'import pandas as pd\n\ndf = pd.read_csv("insurance.csv")\ndf.head()',
  shape: 'df.shape',
  info: 'df.info()',
  describe: 'df.describe().round(1)',
  counts: 'df["smoker"].value_counts()',
  missing: 'df.isnull().sum()',
  dupes: 'print(df.duplicated().sum())',
  showDupes: 'df[df.duplicated(keep=False)]',
  drop: 'df = df.drop_duplicates()\ndf.shape',
  map: 'df["smoker"] = df["smoker"].map({"yes": 1, "no": 0})\ndf.head()',
  mask: 'df["smoker"] == 1',
  filter:
    'smokers = df[df["smoker"] == 1]\nnon_smokers = df[df["smoker"] == 0]\n\nprint(len(smokers), "smokers")\nprint(len(non_smokers), "non-smokers")',
  means: 'print("Smokers:", round(smokers["charges"].mean()))\nprint("Non-smokers:", round(non_smokers["charges"].mean()))',
  groupby: 'df.groupby("smoker")["charges"].mean().round()',
  scatter:
    'import matplotlib.pyplot as plt\n\nplt.scatter(df["age"], df["charges"])\nplt.xlabel("Age")\nplt.ylabel("Charges ($)")\nplt.show()',
  scatterColour:
    'plt.scatter(df["age"], df["charges"], c=df["smoker"], cmap="coolwarm")\nplt.xlabel("Age")\nplt.ylabel("Charges ($)")\nplt.show()',
  split:
    'from sklearn.model_selection import train_test_split\n\nX = df[["age", "bmi", "children", "smoker"]]\ny = df["charges"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nprint(len(X_train), "people to learn from")\nprint(len(X_test), "people kept back for the test")',
  ageModel:
    'from sklearn.linear_model import LinearRegression\n\nmodel_age = LinearRegression()\nmodel_age.fit(X_train[["age"]], y_train)\n\nprint("Score:", round(model_age.score(X_test[["age"]], y_test), 2))',
  fullModel: 'model = LinearRegression()\nmodel.fit(X_train, y_train)\n\nprint("Score:", round(model.score(X_test, y_test), 2))',
  coef: 'print("Starting point:", round(model.intercept_))\npd.Series(model.coef_, index=X.columns).round()',
  mae:
    'from sklearn.metrics import mean_absolute_error\n\npredictions = model.predict(X_test)\nprint("Average miss in dollars:", round(mean_absolute_error(y_test, predictions)))',
  realVsPred:
    'plt.scatter(y_test, predictions)\nplt.plot([0, 60000], [0, 60000], color="black")\nplt.xlabel("Real charges ($)")\nplt.ylabel("Predicted charges ($)")\nplt.show()',
  predict:
    'new_people = pd.DataFrame({\n    "age":      [30, 30, 55],\n    "bmi":      [25, 25, 32],\n    "children": [0, 0, 2],\n    "smoker":   [0, 1, 0],\n})\n\nmodel.predict(new_people).round()',
};

/* ── Quiz and recap ───────────────────────────────────────────────────── */

const QUESTIONS: QuizQuestion[] = [
  {
    q: 'Kaggle said the smoker column was 100% "mismatched". What was actually going on?',
    answer: 1,
    options: [
      { text: 'Every value in it was missing', why: 'The Column tab showed 0 missing. Mismatched and missing are two different counts.' },
      { text: 'Kaggle expected true/false, but the file says yes and no', why: 'Right. The data was fine; Kaggle guessed the wrong type. It’s also exactly why you turned it into 1 and 0.' },
      { text: 'The column was corrupted and had to be deleted', why: 'Deleting it would have thrown away the single most useful column in the whole dataset.' },
    ],
  },
  {
    q: 'Why did you hide 20% of the people before training?',
    answer: 0,
    options: [
      { text: 'So you could test the model on people it had never seen', why: 'Yes. Testing it on the people it learned from is marking your own homework.' },
      { text: 'Because 1,337 rows was too many for Colab', why: 'Colab copes with millions of rows. Size had nothing to do with it.' },
      { text: 'To get rid of the outliers', why: 'The split is random. An outlier can land in either pile.' },
    ],
  },
  {
    q: 'Your model’s number for smoker is 23,043. Which sentence says what it means?',
    answer: 2,
    options: [
      { text: 'Every smoker’s bill is $23,043', why: 'Smokers’ bills range from about $12,000 to over $60,000. 23,043 is what smoking adds, not the whole bill.' },
      { text: 'Smoking causes $23,043 of medical costs', why: 'The model shows a link in this data. On its own it can’t prove a cause.' },
      { text: 'Compared with an otherwise identical non-smoker, the model predicts about $23,043 more', why: 'That’s it. Same age, same BMI, same children. The only difference is smoking.' },
    ],
  },
  {
    q: 'The age-only model scored 0.10. The four-input model scored 0.80. What made the difference?',
    answer: 1,
    options: [
      { text: 'The four-input model had more rows to learn from', why: 'Same rows, same split. Only the inputs changed.' },
      { text: 'It could see who smokes, and that explains the bands', why: 'Right. The bands were mostly smokers against non-smokers. Take smoker out and the score falls to 0.14.' },
      { text: 'It used a different kind of model', why: 'Both are LinearRegression. Same model, more information.' },
    ],
  },
  {
    q: 'The model predicts −$1,887 for an 18-year-old non-smoker with a BMI of 16. What should you do?',
    answer: 0,
    options: [
      { text: 'Treat it as a limit of the model, and say so in your report', why: 'Yes. A straight line doesn’t know bills stop at zero. Saying so is more useful than hiding it.' },
      { text: 'Report it anyway, because the model scored 0.80', why: 'A score is an average across many people. It doesn’t make every single prediction sensible.' },
      { text: 'Delete that person from the dataset', why: 'They aren’t in the dataset. They’re someone you asked about. The problem is the model, not the person.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['Read the data card first.', 'This one turned out to be simulated American data with a column description that contradicts itself. You only know because you read it.'],
  ['Check, even when it looks clean.', 'No missing values, but one duplicate row and a text column the model couldn’t use.'],
  ['Look before you model.', 'The three bands told you smoking mattered before any model did.'],
  ['Test on people the model hasn’t seen.', 'Hold back 20%. Otherwise every model looks brilliant.'],
  ['A model is a sum you can read.', '$249 a year, $305 a BMI point, $538 a child, $23,043 for smoking. That’s a sentence you can say in a meeting.'],
  ['Say what it can’t do.', 'Straight lines, simulated US data, bills below zero. Saying so is part of the job, not an admission of failure.'],
];

const HELP: [string, ReactNode][] = [
  ['FileNotFoundError: insurance.csv', <>Colab can't see the file. Open the Files panel. If it isn't listed, upload it again: Colab wipes uploads whenever the session disconnects, for example after you've been away for a while. Check the spelling too. It's all lower case.</>],
  ['I uploaded archive.zip by mistake', <>You'll actually get away with it. {c('pd.read_csv("archive.zip")')} works, because there's only one file inside. Better to unzip and upload the CSV, though, so you know what you're working with.</>],
  ['NameError: name \'df\' is not defined', <>Colab has forgotten your earlier cells. That happens after a disconnect, or if you run cells out of order. Click <b>Runtime</b>, then <b>Run all</b>.</>],
  ['The smoker column is suddenly all NaN', <>You ran the {c('.map(...)')} cell twice. The first run turned yes/no into 1/0. The second run went looking for "yes" and "no", found none, and gave up. Click <b>Runtime → Run all</b> to start clean.</>],
  ['KeyError: \'Smoker\'', <>Column names are case-sensitive. It's {c('smoker')}, all lower case. Copy names exactly as they appear in {c('df.head()')}.</>],
  ['My numbers are slightly different from yours', <>Check you have 1,337 rows after dropping the duplicate, and that you used {c('random_state=42')}. A different shuffle means different test people and slightly different scores. That isn't wrong, but say so in your report.</>],
  ['Kaggle won\'t let me download', <>You need to be signed in. Sign in with Google, then click Download again.</>],
  ['Still stuck', <>Message me in Teams with a screenshot of the whole error, top to bottom. "It doesn't work" I can't do much with. A screenshot I can usually sort in a minute.</>],
];

const LINKS: { href: string; label: string; note: string }[] = [
  { href: DATASET_URL, label: 'Medical Cost Personal Datasets, on Kaggle', note: 'The dataset. Miri Choi, Open Database License.' },
  { href: COLAB_URL, label: 'Google Colab', note: 'Where every step of the lab happens. Free, nothing to install.' },
  { href: `${ASSETS}MBI806B-linear-regression-report-template.docx`, label: 'Report template (Word)', note: 'The seven headings, with prompts. Fill it in, save as PDF.' },
  { href: `${ASSETS}MBI806B-linear-regression-lab.ipynb`, label: 'The finished notebook', note: 'Only if you’re stuck. In Colab: File → Upload notebook.' },
  { href: `${BASE}#/python-setup`, label: 'Setting up Python', note: 'If Colab is new to you, do this five-minute lesson first.' },
  { href: `${BASE}#/predicting-with-data`, label: 'Three ways to predict things', note: 'The lesson before this one: linear regression with no maths.' },
  { href: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html', label: 'scikit-learn: LinearRegression', note: 'The official page for the model you used, for when you want more.' },
];

/* ── The lesson ───────────────────────────────────────────────────────── */

export default function LinearRegressionLabLesson() {
  return (
    <div className="lr-lab">
      <LessonHeader
        lesson={4}
        of={4}
        title="Linear regression on real data, start to finish"
        lead="Last lesson you fitted a line to twelve made-up flats. Today you do the whole job yourself, on a real public dataset of 1,338 people: find it, read it, clean it, model it, and use it to predict a medical bill. Then you write it up and send it to me."
        meta={[
          ['Time', 'about 2 hours'],
          ['Needs', 'a laptop and a Google account'],
          ['Hand in', 'a short report, in Teams'],
        ]}
        objectives={[
          'Find a dataset on Kaggle and judge it from its data card',
          'Get a CSV into Google Colab and load it with pandas',
          'Check for missing values and duplicates, and fix what you find',
          'Train a linear regression model and test it fairly',
          'Read what the model learned and use it to predict',
          'Say clearly what the model can’t tell you',
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
              Imagine you've just started as a junior analyst at a health insurer. On your second day the pricing
              manager stops by your desk with two questions.
            </p>
            <p>
              <b>"What actually makes one customer's medical bill bigger than another's? And if someone new signs up
              tomorrow, roughly what should we expect them to cost us?"</b>
            </p>
            <p>
              You don't have to guess. There's a free dataset on Kaggle of 1,338 insured people: their age, BMI,
              number of children, whether they smoke, and what their medical bills came to. By the end of this lab
              you'll have answered both questions with a model you built yourself. You'll also know exactly how far to
              trust it, which is the part most people skip.
            </p>
          </div>
          <div className="bt-stats">
            <div><b className="bt-tnum">1,338</b><span>people in the dataset</span></div>
            <div><b className="bt-tnum">7</b><span>columns, one CSV file</span></div>
            <div><b className="bt-tnum">9</b><span>steps, each with a tick box</span></div>
            <div><b className="bt-tnum">1</b><span>short report, sent to me in Teams</span></div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>What you need</h3>
          <div className="bt-pairgrid">
            <div className="bt-card"><h4>A laptop</h4><p>Mac, Windows or Chromebook. Everything happens in the browser, so they all work the same.</p></div>
            <div className="bt-card"><h4>A Google account</h4><p>For Colab. A personal Gmail is fine. You'll use it to sign in to Kaggle too.</p></div>
            <div className="bt-card"><h4>A free Kaggle account</h4><p>You make it in step 1. It takes a minute with the Google account above.</p></div>
            <div className="bt-card"><h4>About two hours</h4><p>The steps take about an hour if nothing goes wrong. Leave the rest for the report.</p></div>
          </div>
          <p className="bt-note">
            Tip: put this page on one half of your screen and Colab on the other, or keep this page open on your phone
            next to your laptop. You'll be going back and forth a lot.
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
            eyebrow="Step 1 · about 10 minutes"
            title="Find it on Kaggle"
            aside="Kaggle is where data people share datasets. Hundreds of thousands of them, most of them free."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Kaggle is owned by Google, and it's the biggest free library of datasets around. You can browse without
              an account, but you need one to download. So make that first.
            </p>
          </div>
          <ol className="bt-flow bt-flow--tight">
            <li>
              <span className="bt-flow__n bt-tnum">1</span>
              <div><h4>Go to kaggle.com and click Register, top right</h4><p>Choose <b>Register with Google</b> and use the same Google account you use for Colab. One account, fewer passwords.</p></div>
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
            url="kaggle.com/datasets?search=medical+cost+personal"
            alt="Kaggle's Datasets page with 'medical cost personal' in the search box. The first result is Medical Cost Personal Datasets by Miri Choi: usability 8.8, 1 file (CSV), 16 kB, 433K downloads, 2,220 notebooks, 3,339 upvotes and a gold medal."
            width={1600}
            height={900}
            marks={[
              { x: 23.5, y: 24.5, w: 73, h: 7.4, text: 'Type **medical cost personal** into the search box and press Enter.' },
              { x: 23.5, y: 61, w: 73, h: 12.6, text: 'Click the one by **Miri Choi**: about 3,300 upvotes, a gold medal, 433K downloads. The ones underneath are copies.' },
            ]}
            caption="Real screenshot, October 2026. Kaggle tweaks its layout now and then, so yours may look slightly different. The button names rarely change."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 26 }}>
            <p>
              Notice there are several datasets with the same name. That's normal on Kaggle: people re-upload popular
              datasets all the time. Go for the original, which is usually the one with the most upvotes, the most
              notebooks and the oldest date. Copies sometimes have rows changed or missing, and nobody tells you.
            </p>
          </div>
          <Task title="Make your account and open the dataset" time="10 min" foot={<DoneButton stage="find">I've found it</DoneButton>}>
            <ol>
              <li>Register on Kaggle with Google.</li>
              <li>Search for <b>medical cost personal</b>.</li>
              <li>Open <b>Medical Cost Personal Datasets</b> by Miri Choi.</li>
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
            aside="Skipping this is the most common mistake in analytics, and the cheapest one to avoid."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              The Data Card is the dataset's label. It tells you who made it, what each column means, where it came
              from and what you're allowed to do with it. Two minutes reading it can save you a week of carefully
              analysing the wrong thing.
            </p>
            <p>Here's the top of the page. Watch where the cursor goes, then find the same things on your screen.</p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <Shot
            src="kaggle-dataset.webp"
            url="kaggle.com/datasets/mirichoi0218/insurance"
            alt="The Kaggle page for Medical Cost Personal Datasets by Miri Choi, updated 9 years ago. Tabs read Data Card, Code (2220), Discussion (19) and Suggestions (0). On the right: Usability 8.82, License 'Database: Open Database, Contents: Database Contents', and tags Education, Health, Finance, Insurance and Healthcare. A Download button sits top right."
            width={1600}
            height={950}
            marks={[
              { x: 24, y: 43.2, w: 7.4, h: 6.2, text: 'The **Data Card** tab. You land on it by default, and it\'s what you\'re reading now.' },
              { x: 78, y: 52.8, w: 8.8, h: 7.6, text: '**Usability 8.82** out of 10. Kaggle\'s score for how well a dataset is documented. Above 8 is good.' },
              { x: 78, y: 61.8, w: 19, h: 7.6, text: '**License**. What you\'re allowed to do with the data. Hover over it to see the full name.' },
              { x: 31.8, y: 43.2, w: 8.8, h: 6.2, text: '**Code (2220)**. Notebooks other people have written with this data. Handy later, ignore it for now.' },
              { x: 78.6, y: 11.6, w: 10.4, h: 6, text: '**Download**. Not yet. Read first.' },
            ]}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Scroll down and keep reading</h3>
          <div className="lr-split">
            <Figure
              src="kaggle-columns.webp"
              alt="The About Dataset section: a Context paragraph about Brett Lantz's book Machine Learning with R, then the seven columns: age, sex, bmi, children, smoker, region (the beneficiary's residential area in the US) and charges (individual medical costs billed by health insurance). Then Acknowledgements, and an Inspiration line asking 'Can you accurately predict insurance costs?'"
              width={1420}
              height={1880}
              caption="About Dataset, with the column list opened. Click View more under the first paragraph if yours is cut short."
            />
            <div className="bt-prose">
              <p><b>Context</b> says where the data came from. Here, a textbook.</p>
              <p><b>Columns</b> is the most important part of any data card. One line per column. Read every one.</p>
              <p><b>Inspiration</b> is the question the uploader had in mind. It tells you which column is the thing to predict.</p>
              <p>
                Notice what's <i>not</i> here: no date range, no collection method. The Metadata section further down is
                mostly empty. That doesn't make the data useless. It means you should be careful what you claim from it.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Figure
            src="kaggle-explorer.webp"
            alt="Kaggle's Data Explorer showing one file, insurance.csv at 55.63 kB, with Detail, Compact and Column tabs. It reads 'This dataset consists of 1338 rows.' Each column has a small chart and a grey description in Spanish: Edad del asegurado, Género, Indice de masa corporal, Número de hijos. The Summary on the right says 1 file and 7 columns."
            width={1600}
            height={876}
            caption="Further down: the Data Explorer. One file, its size, the row count, and a little chart for each column."
          />
          <p className="bt-note">Now click the <b>Column</b> tab inside the Data Explorer. You get a health check for every column:</p>
          <div className="lr-figpair">
            <Figure
              src="kaggle-column-age.webp"
              alt="Column view for age: a histogram from 18 to 64. Valid 1338 (100%), Mismatched 0, Missing 0. Mean 39.2, standard deviation 14."
              width={1330}
              height={644}
              caption="age: 1,338 valid, 0 missing. Healthy."
            />
            <Figure
              src="kaggle-column-smoker.webp"
              alt="Column view for smoker, described in Spanish as 'Indicador si fuma'. Valid 0 (0%), Mismatched 1338 (100%), Missing 0. True 0, False 0."
              width={1330}
              height={444}
              caption="smoker: 100% mismatched. Hold that thought. It's question 7."
            />
            <Figure
              src="kaggle-column-charges.webp"
              alt="Column view for charges, described in Spanish as 'Prima del seguro'. A histogram heavily bunched at the low end, from 1.12k to 63.8k. Valid 1338, Missing 0. Mean 13.3k, median 9.39k, max 63.8k."
              width={1330}
              height={606}
              caption="charges: look at the grey line under the name. It's question 8."
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
            title="Download and unzip"
            aside="One click to download, one more to unzip. The unzip is the step people forget."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Shot
            src="kaggle-download-menu.webp"
            url="kaggle.com/datasets/mirichoi0218/insurance"
            alt="Kaggle's Download menu open. The top part, 'Download via kagglehub', shows Python code. Below it are two options: 'Download dataset as zip (16 kB)' and 'Export metadata as Croissant'."
            width={1600}
            height={844}
            marks={[
              { x: 73, y: 5.2, w: 13.4, h: 8.8, text: 'Click **Download**, top right.' },
              { x: 52, y: 77.6, w: 27, h: 9.2, text: 'Ignore the code box. Click **Download dataset as zip (16 kB)**.' },
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
                Kaggle always hands you a zip, even for one small file. A zip is a box, not the thing itself. Colab
                wants the CSV that's inside it, so open the box first.
              </p>
            </div>
            <Figure
              src="kaggle-signin.webp"
              alt="Kaggle's sign-in page: 'Welcome!' with buttons to sign in with Google, Email, Facebook or Yahoo."
              width={960}
              height={1320}
              caption="What Kaggle shows if you click Download while signed out."
              narrow
            />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 34 }}>Unzip it</h3>
          <p className="bt-note" style={{ maxWidth: '58ch' }}>Pick your computer. The walkthrough plays once; use Back and Next to go at your own speed.</p>
          <UnzipDemo />
        </Reveal>
        <Reveal delay={0.05}>
          <Task title="Check what you've got" time="2 min" foot={<DoneButton stage="download">I've got insurance.csv</DoneButton>}>
            <ul>
              <li>You should have a file called <b>insurance.csv</b>, about 55 KB.</li>
              <li>Double-click it. It opens in Excel or Numbers. Scroll down. It's just a table, 1,339 lines long including the header row.</li>
              <li>Close it <b>without saving</b>. If Excel offers to convert or fix anything, say no. Excel sometimes quietly changes data, and you want the file exactly as Kaggle gave it.</li>
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
            aside="Colab is Python in your browser. If you did the Python setup lesson, you've been here before."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Shot
            src="colab-home.webp"
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
            url="colab.research.google.com"
            alt="An empty Colab notebook: the name at the top, the File, Edit, View, Insert, Runtime, Tools and Help menus, a + Code button, a single empty code cell with a round play button, and a column of icons down the left, including a folder."
            width={1600}
            height={856}
            maxWidth={820}
            marks={[
              { x: 8, y: 1.4, w: 14, h: 7.8, text: 'The notebook\'s **name**. Click it and rename it, with your own name in it. Your report screenshots need to show it.' },
              { x: 13, y: 31, w: 85.6, h: 11.2, text: 'A **code cell**. Code goes in here, and the round **▶** runs it. Shift + Enter does the same.' },
              { x: 16.4, y: 14.8, w: 8.6, h: 8.4, text: '**+ Code** adds a new cell underneath. Use a new cell for each step below. It keeps things tidy.' },
              { x: 1.4, y: 76.4, w: 6, h: 10.8, text: 'The **folder** opens the Files panel. That\'s where your CSV goes.' },
            ]}
            caption="A real, empty Colab notebook. Yours will be called Untitled0.ipynb until you rename it."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Upload the CSV</h3>
          <UploadDemo />
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Load it with pandas</h3>
          <div className="bt-prose">
            <p>
              <b>pandas</b> is the Python tool for tables. Everyone gives it the short name {c('pd')}, because you'll
              type it a lot. {c('df')} is short for <i>data frame</i>, which is pandas' word for a table. Again, everyone
              calls it df.
            </p>
          </div>
          <ColabCell
            label="Cell 1"
            code={CODE.load}
            out={OUT_HEAD}
            after={
              <>
                Five rows, seven columns, and an extra column down the left: 0, 1, 2, 3, 4. That's pandas numbering
                the rows. It isn't part of your data. {c('.head()')} only shows the first five so your screen doesn't
                fill up.
              </>
            }
          />
          <Task title="Get your first five rows" time="5 min" foot={<DoneButton stage="colab">My data is loaded</DoneButton>}>
            <ol>
              <li>New notebook, renamed with your name in it.</li>
              <li>insurance.csv uploaded into the Files panel.</li>
              <li>Cell 1 typed and run. You see the same five rows as above.</li>
            </ol>
            <p style={{ fontSize: 13.5, color: 'var(--ink-500)', marginTop: 10 }}>
              Red error instead? It's almost always the file. Jump to <Jump to="help">Stuck?</Jump> at the bottom.
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
            aside="Four short commands. Each one answers a question a manager would ask."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Add a new cell for each one (<b>+ Code</b>), type it, run it, and compare with mine. Read the output
              before you move on. That reading is the actual skill here. The typing is easy.
            </p>
          </div>
          <ColabCell
            label="Cell 2 · how big is it?"
            code={CODE.shape}
            out={[{ kind: 'text', text: '(1338, 7)' }]}
            after={<>1,338 rows and 7 columns, the same as the data card said. Nothing got lost on the way.</>}
          />
          <ColabCell
            label="Cell 3 · what's in each column?"
            code={CODE.info}
            out={[{ kind: 'text', text: OUT_INFO }]}
            after={
              <>
                Look at two things. <b>Non-Null Count</b> is 1338 for every column, so nothing is missing.{' '}
                <b>Dtype</b> is the type: int64 and float64 are numbers, object means text. Three columns are text:
                sex, smoker and region. A model can't do maths on text, so remember that for step 6. (Newer versions of
                pandas say str instead of object. Same thing.)
              </>
            }
          />
          <ColabCell
            label="Cell 4 · what do the numbers look like?"
            code={CODE.describe}
            out={OUT_DESCRIBE}
            after={
              <>
                Only the number columns show up. Read it one line at a time. The youngest person is 18 and the oldest
                64. Look at charges: half the bills are under $9,382 (the 50% row), but the <b>mean</b> is $13,270.
                When the average sits well above the middle value, a few very big bills are dragging it up. The
                biggest is $63,770. ({c('.round(1)')} just cuts the decimals down to one, so it's readable.)
              </>
            }
          />
          <ColabCell
            label="Cell 5 · how many smoke?"
            code={CODE.counts}
            out={[{ kind: 'text', text: 'smoker\nno     1064\nyes     274\nName: count, dtype: int64' }]}
            after={<>274 smokers out of 1,338. About one person in five.</>}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Task title="Your turn: regions" time="5 min" foot={<DoneButton stage="explore">I know my data</DoneButton>}>
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              In a new cell, count the regions the same way: {c('df["region"].value_counts()')}. Is any region much
              bigger than the others? Write one sentence about it for your report.
            </p>
            <Answer>
              southeast has 364 people. The other three have 324 or 325 each. So it's fairly even, with slightly more
              people from the southeast. Not enough to worry about.
            </Answer>
          </Task>
        </Reveal>
      </section>

      {/* ══ 6. Clean ═════════════════════════════════════════════════════ */}
      <section id="step-clean" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 6 · about 30 minutes"
            title="Clean it, filter it, look at it"
            aside="Three jobs, each with a reason. Read the reason first. The code is the easy part."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              A model learns from whatever you give it, mistakes included. So before any model, you do three things:
              make sure the data is <b>clean</b>, <b>filter</b> it to compare groups, and <b>look</b> at it in a chart.
              Each one answers a different question, and each one changes what you do next.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Check 1: is anything missing?</h3>
          <WhyBlock
            task={<p>Count the empty cells in every column.</p>}
            why={
              <p>
                A model can't learn from a blank. Most Python tools either stop with an error or quietly skip rows that
                have gaps, and then your numbers are based on fewer people than you think. So you look for gaps first
                and decide what to do about them yourself, rather than letting the tool decide for you.
              </p>
            }
          />
          <ColabCell
            label="Cell 6"
            code={CODE.missing}
            out={[{ kind: 'text', text: 'age         0\nsex         0\nbmi         0\nchildren    0\nsmoker      0\nregion      0\ncharges     0\ndtype: int64' }]}
            after={
              <>
                Zero everywhere. If there were gaps, you'd have to decide what to do: drop those rows, or fill them in
                with something sensible. Neither choice is free. Today you don't have to make it.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Check 2: is anyone in here twice?</h3>
          <WhyBlock
            task={<p>Find any row that's an exact copy of another one, look at it, and remove the extra copy.</p>}
            why={
              <p>
                If one person is in the data twice, they get two votes when the model learns, and your counts and
                averages are slightly off. Here it's one row. In a real company, duplicates come from double-clicks,
                re-imported files and system glitches, and they can be thousands of rows.
              </p>
            }
          />
          <ColabCell
            label="Cell 7"
            code={CODE.dupes}
            out={[{ kind: 'text', text: '1' }]}
            after={<>One row is an exact copy of another. Let's look at it.</>}
          />
          <ColabCell
            label="Cell 8"
            code={CODE.showDupes}
            out={OUT_DUPES}
            after={
              <>
                Rows 195 and 581 match down to the cent: 19, male, BMI 30.59, no children, doesn't smoke, northwest,
                $1,639.56. Could two different people match that closely? Possible, but very unlikely. It's almost
                certainly one record entered twice. ({c('keep=False')} means "show me both copies, not just the second
                one".)
              </>
            }
          />
          <ColabCell
            label="Cell 9"
            code={CODE.drop}
            out={[{ kind: 'text', text: '(1337, 7)' }]}
            after={<>1,337 now. Write that number down. Everything from here on is based on 1,337 people, not 1,338.</>}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Check 3: can a model read every column you'll use?</h3>
          <WhyBlock
            task={<p>Turn the smoker column's "yes" and "no" into 1 and 0.</p>}
            why={
              <p>
                A model is arithmetic. It multiplies each input by a number and adds them up. You can multiply 1 by
                $23,000. You can't multiply "yes" by anything. So every column the model uses has to be a number. This
                is also the fix for Kaggle's "100% mismatched" warning from step 2.
              </p>
            }
            which={
              <p>
                Because it's the only text column we're going to give the model. The model will use age, bmi, children
                and smoker. sex and region are text too, but we're leaving them out on purpose, and{' '}
                <Jump to="limits">the limits section</Jump> explains why.
              </p>
            }
            whichLabel="Why only smoker?"
          />
          <ColabCell
            label="Cell 10 · run this once only"
            code={CODE.map}
            out={OUT_MAPPED}
            after={
              <>
                The smoker column said yes and no; now it says 1 and 0. Run this cell <b>once</b>. Run it twice and the
                whole column turns into NaN, because the second run goes looking for "yes" and "no" and finds none (see
                Stuck? at the bottom).
              </>
            }
          />
        </Reveal>

        {/* ── Filter ─────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 56 }}>Filter: keep only the rows you want</h3>
          <WhyBlock
            task={
              <p>
                Split the 1,337 people into two groups, smokers and non-smokers. Work out the average bill in each
                group. Then compare the two numbers.
              </p>
            }
            why={
              <>
                <p>
                  Go back to the pricing manager's question: <i>what makes one customer's bill bigger than another's?</i>{' '}
                  You can't answer that by staring at 1,337 rows. Nobody can. What you <b>can</b> do is compare groups.
                  If one group's bills are much bigger than another group's, whatever makes those two groups different
                  is a strong suspect.
                </p>
                <p>
                  To compare groups, you first have to pull each group out of the big table. That's all filtering is:
                  keep the rows that match a rule, and set the rest aside for now. Nothing gets deleted. The full table
                  is still there in {c('df')}.
                </p>
                <p>
                  You've probably done this in Excel already. Click the little arrow at the top of a column, untick
                  everything except "yes", and only those rows stay on screen. Python does the same thing in one line,
                  and you can rerun it any time.
                </p>
              </>
            }
            which={
              <>
                <p>Three reasons to start with <b>smoker</b>:</p>
                <ul>
                  <li>
                    <b>It's the strongest suspect.</b> Smoking is one of the best-known causes of lung and heart
                    disease, and those are expensive to treat. If anything in this table moves a medical bill, this
                    should.
                  </li>
                  <li>
                    <b>It splits people cleanly in two.</b> Smoker only has two values, 1 or 0, so it gives exactly two
                    groups and two averages to compare. Age has 47 different values, so it would give 47 little groups.
                    That's a job for a chart, which is the next part.
                  </li>
                  <li>
                    <b>Both groups are big enough to trust.</b> Cell 5 showed 274 smokers and over a thousand
                    non-smokers. An average of 274 people means something. An average of three people wouldn't.
                  </li>
                </ul>
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">A</span><h4>See it first, on ten real people</h4></div>
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            Ten rows from your cleaned data, no code yet. Pick a rule. Every row gets asked the question, the rows that
            answer False are set aside, and the average bill of the rows that are left updates. Try <b>Smokers</b>, then{' '}
            <b>Non-smokers</b>, and watch the average.
          </p>
          <FilterDemo />
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            With no filter, the average mixes everybody together, about $22,600 here. Split them, and the smokers
            average about $34,600 while the non-smokers average about $10,500. That gap is the reason we filter. Now do
            the same thing for all 1,337 people.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">B</span><h4>Ask every row the question</h4></div>
          <ReadAloud
            lines={[
              ['df["smoker"]', 'take the smoker column: one value for each of the 1,337 people'],
              ['== 1', 'ask each value: are you equal to 1? (1 means they smoke)'],
            ]}
          />
          <ColabCell
            label="Cell 11"
            code={CODE.mask}
            out={[{ kind: 'text', text: OUT_MASK }]}
            after={
              <>
                You get back one answer per person: True or False. Row 0 smokes, so True. Rows 1 to 4 don't, so False.
                The {c('...')} is pandas saving space: there are 1,337 answers, it just shows the first five and the last
                five. This column of True and False <i>is</i> the rule. It's what goes inside the square brackets next.
                ({c('==')} has two equals signs because one equals sign already means "store this under that name".)
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">C</span><h4>Keep the rows that said True</h4></div>
          <ReadAloud
            lines={[
              ['df[ ... ]', 'from df, keep only the rows where the rule inside the brackets is True'],
              ['smokers =', 'save the rows you kept under a new name, so you can use them again. df itself is untouched'],
              ['len(smokers)', 'count the rows in it'],
            ]}
          />
          <ColabCell
            label="Cell 12"
            code={CODE.filter}
            out={[{ kind: 'text', text: '274 smokers\n1063 non-smokers' }]}
            after={
              <>
                Two new tables, made from the one you had. Now check them: 274 + 1,063 = 1,337. Every person landed in
                exactly one group, so nobody fell through the cracks. Checking that the pieces add back up is the first
                thing to do after any filter.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">D</span><h4>Now compare the two groups</h4></div>
          <ReadAloud
            lines={[
              ['smokers["charges"]', 'just the bills, from the smokers table'],
              ['.mean()', 'add them all up and divide by how many there are: the average'],
              ['round( )', 'drop the cents, so it’s easy to read'],
            ]}
          />
          <ColabCell
            label="Cell 13"
            code={CODE.means}
            out={[{ kind: 'text', text: 'Smokers: 32050\nNon-smokers: 8441' }]}
            after={
              <>
                <div className="lr-compare" aria-hidden="true">
                  <div className="lr-compare__row">
                    <span>Smokers</span>
                    <span className="lr-compare__bar"><i style={{ width: '100%', background: 'var(--cat-2)' }} /></span>
                    <b>$32,050</b>
                  </div>
                  <div className="lr-compare__row">
                    <span>Non-smokers</span>
                    <span className="lr-compare__bar"><i style={{ width: `${(8441 / 32050) * 100}%`, background: 'var(--cat-3)' }} /></span>
                    <b>$8,441</b>
                  </div>
                </div>
                <p style={{ marginTop: 14 }}>
                  This is the headline of the whole lab. On average a smoker's bill is <b>$32,050</b> and a non-smoker's
                  is <b>$8,441</b>, nearly four times as much. One column, and the gap is enormous. That's your first
                  real answer for the pricing manager, and it's why smoker will turn out to be the most important thing
                  your model learns.
                </p>
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">E</span><h4>The shortcut you'll see everywhere</h4></div>
          <p className="bt-note" style={{ maxWidth: '64ch' }}>
            B, C and D in one line. {c('groupby("smoker")')} means "split the rows into groups by smoker", and the rest
            means "then take the average of charges in each group". Same numbers as cell 13, which makes it a good check.
            You'll see this in almost every notebook on Kaggle.
          </p>
          <ColabCell
            label="Cell 14"
            code={CODE.groupby}
            out={[{ kind: 'text', text: 'smoker\n0     8441.0\n1    32050.0\nName: charges, dtype: float64' }]}
            after={<>0 is non-smokers, 1 is smokers. $8,441 and $32,050, exactly what you worked out by hand.</>}
          />
          <Task title="Your turn: two filters of your own" time="10 min">
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              The first one practises asking two questions at once. The second one checks a hunch: does a high BMI make
              smoking even more expensive?
            </p>
            <ol>
              <li>
                How many smokers are over 50? Try {c('df[(df["age"] > 50) & (df["smoker"] == 1)]')}. The {c('&')} means
                "both have to be True". Each question needs its own round brackets.
              </li>
              <li>
                Compare {c('smokers[smokers["bmi"] >= 30]["charges"].mean()')} with the same thing using {c('< 30')}.
                Notice you're filtering the smokers table this time, not df.
              </li>
            </ol>
            <Answer>
              64 smokers are over 50. Smokers with a BMI of 30 or more average <b>$41,558</b> (145 people), against{' '}
              <b>$21,363</b> for smokers under 30 (129 people). Smoking and a high BMI together cost about twice what
              smoking alone does. Remember this. It comes back in the chart below, and again in the limits section.
            </Answer>
          </Task>
        </Reveal>

        {/* ── Look ───────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 56 }}>Look before you model</h3>
          <WhyBlock
            task={
              <p>
                Draw every person as a dot on a chart, with their age along the bottom and their bill up the side. Then
                look at the shape the dots make.
              </p>
            }
            why={
              <>
                <p>
                  Your filter compared two averages. An average is useful, but it squashes 274 people into one number and
                  hides everything else about them. A chart hides nothing. You see all 1,337 people at once, and your
                  eyes find a pattern in a picture far faster than in a table.
                </p>
                <p>
                  There's a bigger reason too. Linear regression draws <b>straight lines</b> through dots. Before you ask
                  a computer to draw a line, look at whether the dots even look like a line. If they don't, you need to
                  know why, because that tells you what the model has to be given.
                </p>
                <p>
                  Statisticians learned this the hard way. In 1973 Francis Anscombe published four small datasets that
                  had the same averages and the same best-fit line. Drawn as charts, they looked nothing alike: one a
                  neat line, one a curve, two thrown off by a single odd point. The numbers couldn't tell them apart. The
                  pictures could. It's known as{' '}
                  <a href="https://en.wikipedia.org/wiki/Anscombe%27s_quartet" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-600)' }}>
                    Anscombe's quartet
                  </a>
                  .
                </p>
              </>
            }
            which={
              <ul style={{ marginTop: 0 }}>
                <li>
                  <b>Charges goes up the side</b> because it's the thing we want to predict. By convention, the thing you
                  predict always goes on the vertical axis.
                </li>
                <li>
                  <b>Age goes along the bottom</b> because it has lots of different values, 18 to 64, so the dots spread
                  out sideways and a trend can show. It's also the input most likely to push bills up steadily as people
                  get older.
                </li>
                <li>
                  <b>Smoker can't go along the bottom.</b> It only has two values, so you'd get two tall stacks of dots
                  and learn nothing new. Instead you'll use it as <b>colour</b>: a third piece of information on the same
                  chart.
                </li>
              </ul>
            }
            whichLabel="Why these columns?"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">A</span><h4>How to read a dot</h4></div>
          <ReadADot />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">B</span><h4>Draw all 1,337</h4></div>
          <ReadAloud
            lines={[
              ['import matplotlib.pyplot as plt', 'bring in Python’s drawing tool. plt is its nickname'],
              ['plt.scatter(df["age"], df["charges"])', 'one dot per row. The first column goes along the bottom, the second goes up the side'],
              ['plt.xlabel("Age")', 'write a label under the bottom axis. ylabel does the same for the side'],
              ['plt.show()', 'put the finished chart on the screen'],
            ]}
          />
          <ColabCell
            label="Cell 15"
            code={CODE.scatter}
            out={[CHART('chart-age-charges.webp', 'Matplotlib scatter plot of age against charges. The dots form three separate upward-sloping bands: a dense one at the bottom from about $2,000 to $15,000, a scattered middle band, and a top band from about $35,000 to $50,000.')]}
            after={
              <>
                Stop and look for ten seconds before you read on. What do you notice?
                <br />
                <br />
                Here's what I see. Not one cloud of dots, but <b>three bands</b>, stacked on top of each other, all
                climbing as people get older. Climbing with age makes sense. But why three separate bands? Something is
                splitting these people into groups.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="lr-substep"><span className="lr-substep__n">C</span><h4>Test your suspect with colour</h4></div>
          <div className="bt-prose">
            <p>
              You already have a suspect. Your filter showed smokers' bills are nearly four times bigger. If smoking is
              what splits the bands, then colouring every dot by smoker should make the colours line up with the bands.
              If it isn't, the colours will be mixed up in every band. Either way, you learn something.
            </p>
          </div>
          <ReadAloud
            lines={[
              ['c=df["smoker"]', 'colour each dot using that person’s smoker value'],
              ['cmap="coolwarm"', 'the colour scheme: 0 comes out blue, 1 comes out red'],
            ]}
          />
          <ColabCell
            label="Cell 16"
            code={CODE.scatterColour}
            out={[CHART('chart-age-charges-smoker.webp', 'The same scatter plot coloured by smoker. The bottom band is all blue (non-smokers), the top band is all red (smokers), and the middle band is a mix of both.')]}
            after={
              <>
                The colours line up with the bands. The bottom band is nearly all blue: people who don't smoke. The top
                band is all red: smokers. The middle band is a mix, mostly smokers with a BMI under 30 plus a few
                non-smokers with unusually big bills. That's the high-BMI hunch from your filter task, showing up in the
                picture.
                <br />
                <br />
                <b>What this tells you:</b> the model must be told who smokes. A straight line drawn through age alone
                would run through the gap between the bands and fit almost nobody. You'll prove that in step 7.
              </>
            }
          />
          <Task title="Your turn: test a different suspect" time="5 min">
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              Change {c('c=df["smoker"]')} to {c('c=df["children"]')} and run the cell again. Do the colours line up
              with the bands now? Write one sentence about what that tells you.
            </p>
            <Answer>
              <Figure
                src="chart-age-charges-children.webp"
                alt="The same scatter plot coloured by number of children. Every band contains every colour, with no pattern."
                width={848}
                height={621}
                caption="Coloured by children. Every band has every colour in it."
                narrow
              />
              <p style={{ marginTop: 10 }}>
                No. Every band has every colour in it, so the number of children doesn't explain the bands. A chart can
                rule a suspect <i>out</i> just as clearly as it rules one in. That's why smoker, not children, is the
                column to watch.
              </p>
            </Answer>
          </Task>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 48 }}>Play with the same dots</h3>
          <p className="bt-note" style={{ maxWidth: '62ch' }}>
            All 1,337 people, from the cleaned data. Hover any dot to see who it is. Views 1 and 2 match your two charts.
            Views 3 and 4 are a preview of step 7, so have a look now and they'll make sense in ten minutes.
          </p>
          <BandsChart />
          <div className="lr-task__foot" style={{ marginTop: 18 }}>
            <DoneButton stage="clean">I've cleaned, filtered and looked</DoneButton>
          </div>
        </Reveal>
      </section>

      {/* ══ 7. Model ═════════════════════════════════════════════════════ */}
      <section id="step-model" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 7 · about 20 minutes"
            title="Train it, then test it fairly"
            aside="The model learns from most of the people, then gets tested on ones it has never seen."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Here's the trap. Test a model on the same people it learned from and it looks brilliant. It's like
              marking a student on the exact questions they practised with. So before training, you hide 20% of the
              people. The model doesn't see them until the test.
            </p>
          </div>
          <SplitDemo />
          <ColabCell
            label="Cell 17"
            code={CODE.split}
            out={[{ kind: 'text', text: '1069 people to learn from\n268 people kept back for the test' }]}
            after={
              <>
                <b>X</b> is the inputs: age, BMI, children and smoker. <b>y</b> is the answer it should learn to give:
                charges. Capital X, small y is just the convention. {c('test_size=0.2')} is the 20%.{' '}
                {c('random_state=42')} makes the shuffle come out the same every time, so your numbers match mine. Any
                number would do. 42 is a programmers' joke.
              </>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 34 }}>First, a model that only knows age</h3>
          <ColabCell
            label="Cell 18"
            code={CODE.ageModel}
            out={[{ kind: 'text', text: 'Score: 0.1' }]}
            after={
              <>
                {c('.fit()')} is the learning. {c('.score()')} tests it on the hidden people. The score runs from 0 to
                1: roughly, how much of the difference between people's bills the model can explain. 1 would be
                perfect. 0.1 is close to useless. That's view 3 of the chart above: one line through the gap between
                the bands. The score's proper name is R², said "R-squared".
              </>
            }
          />
          <h3 style={{ fontSize: 19, marginTop: 34 }}>Now give it all four inputs</h3>
          <ColabCell
            label="Cell 19"
            code={CODE.fullModel}
            out={[{ kind: 'text', text: 'Score: 0.8' }]}
            after={
              <>
                From 0.1 to 0.8, on people it had never seen. Mostly because it now knows who smokes. That's view 4 of
                the chart: two lines, one per group.
              </>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Read what it learned</h3>
          <ColabCell
            label="Cell 20"
            code={CODE.coef}
            out={[{ kind: 'text', text: 'Starting point: -11257\nage           249.0\nbmi           305.0\nchildren      538.0\nsmoker      23043.0\ndtype: float64' }]}
            after={<>These five numbers <i>are</i> the model. Here they are in plain English.</>}
          />
          <div className="bt-rows" style={{ marginTop: 22 }}>
            <div><h4>age · 249</h4><p>Each extra year of age adds about $249 to the predicted bill, if everything else stays the same.</p></div>
            <div><h4>bmi · 305</h4><p>Each extra point of BMI adds about $305.</p></div>
            <div><h4>children · 538</h4><p>Each child on the policy adds about $538.</p></div>
            <div><h4>smoker · 23,043</h4><p>Smoking adds about $23,043. Same age, same BMI, same children; the only difference is smoking.</p></div>
            <div><h4>Starting point · −11,257</h4><p>Where the sum starts before any inputs are added. Nobody is aged 0 with a BMI of 0, so don't read meaning into it. It's just where the line has to start to fit everyone else.</p></div>
          </div>
          <ColabCell
            label="Cell 21 · how far off is it, in dollars?"
            code={CODE.mae}
            out={[{ kind: 'text', text: 'Average miss in dollars: 4199' }]}
            after={
              <>
                On the 268 test people, the model's guess was <b>$4,199</b> away from the real bill, on average. Some
                were much closer, some much further. Is that good enough? It depends on the job. To estimate next
                year's total claims across thousands of customers, probably. To set one person's price on its own,
                no.
              </>
            }
          />
          <ColabCell
            label="Cell 22 · real against predicted"
            code={CODE.realVsPred}
            out={[CHART('chart-real-vs-predicted.webp', 'Scatter plot of real charges against predicted charges for the 268 test people, with a black diagonal line where a perfect prediction would sit. Most dots cluster near the line. A group of expensive real bills on the right sits well below it, and two predictions at the bottom left are below zero.')]}
            after={
              <>
                Each dot is one test person. A perfect model would put every dot on the black line. Most are close. See
                the group sitting well under the line on the right? Real bills of $35,000 to $60,000 that the model
                guessed too low. Those are mostly smokers with a high BMI. And at the bottom left, two predictions are
                below zero.
              </>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Task title="Your turn: take one input away" time="10 min" foot={<DoneButton stage="model">I've trained and tested it</DoneButton>}>
            <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>
              Go back to cell 17 and take one name out of the X list, say {c('"bmi"')}. Then run cells 17 and 19 again
              and write down the new score. Try each of the four in turn. Which one does the model miss most when it's
              gone? Put back all four when you're done.
            </p>
            <Answer>
              Without smoker: <b>0.14</b>. Without age: 0.71. Without bmi: 0.77. Without children: 0.80, the same as
              with it. Smoking carries almost the whole model. Children barely matters.
            </Answer>
          </Task>
        </Reveal>
      </section>

      {/* ══ 8. Predict ═══════════════════════════════════════════════════ */}
      <section id="step-predict" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 8 · about 10 minutes"
            title="Now predict something"
            aside="This is the bit the pricing manager actually asked for."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              A trained linear regression is just a sum. Here's the one your notebook learned, taken apart. Pick a
              customer or move the sliders, and watch the bill add up line by line.
            </p>
          </div>
          <BillBuilder />
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Do it in your notebook</h3>
          <ColabCell
            label="Cell 23"
            code={CODE.predict}
            out={[{ kind: 'text', text: 'array([ 3851., 26893., 13293.])' }]}
            after={
              <>
                Three made-up customers, one per column of numbers. <b>A</b> is 30, healthy BMI, no children, doesn't
                smoke: about <b>$3,851</b>. <b>B</b> is exactly the same person, but smokes: <b>$26,893</b>. That's the
                $23,043 at work, and nearly seven times the bill. <b>C</b> is 55 with two children and a BMI of 32:{' '}
                <b>$13,293</b>. The columns have to have the same names, in the same order, as the X you trained on.
              </>
            }
          />
          <div className="bt-caution">
            <p className="bt-eyebrow">Made-up people only</p>
            <p>
              Not you, not your flatmate, not your mum. Health details are some of the most sensitive personal
              information there is, and a notebook you'll screenshot into a report is no place for them. That's true
              in this lab, and it's true at work.
            </p>
          </div>
          <Task title="Your three customers" time="10 min" foot={<DoneButton stage="predict">I've made my predictions</DoneButton>}>
            <ol>
              <li>Change the numbers in cell 23 to three customers you make up. Make them different from each other.</li>
              <li>Run it, and copy the predictions into the table in your report.</li>
              <li>For each one, write whether the prediction looks sensible to you, and why. "It seems high because…" is fine.</li>
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
            aside="A number with decimals looks more certain than it is. Your report needs a paragraph on this, so here's a head start."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-rows">
            <div>
              <h4>It learned from simulated American data</h4>
              <p>The textbook it comes from built these people from US Census figures. US dollars, US health system. It tells you nothing reliable about medical costs in New Zealand.</p>
            </div>
            <div>
              <h4>It draws straight lines, and real life bends</h4>
              <p>Smokers with a BMI of 30 or more average $41,558. Smokers under 30 average $21,363. The two together cost far more than you'd get by adding them up separately, which is exactly what a straight-line model does. So it under-guesses those people. You saw them, under the line on the right of cell 22.</p>
            </div>
            <div>
              <h4>It will happily predict nonsense</h4>
              <p>Below-zero bills for young, slim non-smokers. Any age outside 18 to 64 is a guess in the dark, and it won't warn you.</p>
            </div>
            <div>
              <h4>It shows a link, not a cause</h4>
              <p>The model says smokers' bills are higher in this data. On its own, that doesn't prove smoking is the reason. Regression finds links. Proving causes takes more than one dataset and one model.</p>
            </div>
            <div>
              <h4>Should it be used at all?</h4>
              <p>We left out sex and region on purpose. Should an insurer price someone on their sex? On where they live? On their BMI? Countries answer this differently, and reasonable people disagree. Your report should give your view, and a reason for it.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ 9. Report ════════════════════════════════════════════════════ */}
      <section id="step-report" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Step 9 · the hand-in"
            title="Write it up. Send it in Teams."
            aside="Short and specific beats long and vague. I'd rather read 700 words that are yours than 2,000 that aren't."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginBottom: 22 }}>
            <p>
              Write it for the pricing manager from the start of the lab: someone smart who has never opened Python.
              Every number has to come from your own notebook, not from this page. If yours differ from mine, use yours
              and say why you think they differ.
            </p>
          </div>
          <div className="lr-brief">
            <ol className="lr-brief__sec">
              {[
                ['The dataset', '~100 words', 'Name it, link it, say who made it and what licence it uses. Rows, columns, and what each column means in your own words. One thing on the data card you would question.'],
                ['Cleaning and filtering', '~150 words', 'Missing values, the duplicate and what you did with it, and why the smoker column had to change. Screenshot your cleaning cells.'],
                ['What you noticed', '~150 words', 'Your coloured scatter chart, described in plain English. Average charges for smokers and non-smokers.'],
                ['Your model', '~200 words', 'The inputs, both scores, the average miss, and each learned number as one plain sentence. There\'s a table for it in the template.'],
                ['Your predictions', '~150 words', 'Three made-up customers, their predicted charges, and whether each looks sensible to you.'],
                ['What it can\'t tell us', '~150 words', 'At least two limits. Then your view: should an insurer use smoking or BMI to set prices? Sex or region?'],
                ['Screenshots', 'at least 4', 'From your own notebook, with your name visible in its title: data loaded, cleaning, a chart, the score.'],
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
                <div><dt>Send to</dt><dd>{LECTURER}, in a Teams chat. Not the class channel.</dd></div>
                <div><dt>Due</dt><dd>{DUE[0].toUpperCase() + DUE.slice(1)}</dd></div>
              </dl>
              <div className="lr-facts__actions">
                <a className="bt-btn" href={`${ASSETS}MBI806B-linear-regression-report-template.docx`} download style={{ textDecoration: 'none' }}>
                  Download the report template
                  <span className="bt-btn__badge" aria-hidden="true">↓</span>
                </a>
                <span className="lr-caption" style={{ color: 'var(--ink-300)' }}>Word, with all seven headings and prompts in grey.</span>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Sending it in Teams</h3>
          <TeamsDemo />
        </Reveal>
        <Reveal delay={0.05}>
          <Task title="Before you press Send" foot={<DoneButton stage="report">I've sent my report</DoneButton>}>
            <ul>
              <li>Your name is in your notebook's title and at the top of the report.</li>
              <li>Every number in the report came from your own notebook.</li>
              <li>At least four screenshots.</li>
              <li>Saved as a PDF called {c(REPORT_FILE)}, with your name in place of YourName.</li>
              <li>Sent to me as a Teams chat message, with one line saying what it is.</li>
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
        footnote="Data: Miri Choi, Medical Cost Personal Datasets, Kaggle, Open Database License; originally from Brett Lantz, Machine Learning with R (Packt). Screenshots of Kaggle and Google Colab taken October 2026."
      />

      {/* ══ Stuck ════════════════════════════════════════════════════════ */}
      <section id="help" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Stuck?"
            title="When it goes wrong"
            aside="These come up every time I run this lab. None of them mean you're bad at this."
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
            <a className="bt-btn bt-btn--sm bt-btn--tertiary" href={`${ASSETS}MBI806B-linear-regression-lab.ipynb`} download style={{ marginTop: 12, textDecoration: 'none' }}>
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
            Kaggle home: <a href={KAGGLE_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-600)' }}>kaggle.com</a>. When you've done
            this one, try the same nine steps on another dataset you find yourself. That's the real test.
          </p>
        </Reveal>
      </section>

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>Do it yourself, even when it's slow<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              The first time through, every step feels fiddly. The second time, it's twenty minutes. What you're really
              learning today isn't pandas or scikit-learn. It's the habit: read the label, check the data, look before
              you model, test it fairly, and say what it can't do. That habit is what gets you trusted with the
              important numbers.
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
