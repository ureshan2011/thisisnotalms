import { ExternalLink } from 'lucide-react';
import { LessonHeader, Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import FitTheLine from './ml/FitTheLine';
import GrowTheTree from './ml/GrowTheTree';
import ForestVote from './ml/ForestVote';
import PythonPlayground, { COLAB_URL } from './ml/PythonPlayground';

// ─── MBI806B · Linear regression, decision trees and random forests ───────
// Written for the room this course actually has: postgraduate students from
// business, health, education and design, most of whom last met a formula
// some years ago and have never opened a data tool. So no summation signs,
// no matrices, no cost functions, no gradient descent. Where a real term is
// worth knowing because they will meet it everywhere — overfitting, feature,
// training — it is named once, in plain words, and then used.
//
// The three sections each run the same way: a real thing this model did in
// the world, then the idea in a sentence, then a widget where they do it by
// hand, then what it is good at and where it falls over. The widgets carry
// the argument rather than decorating it — you cannot read the overfitting
// section without having personally overfitted a tree two paragraphs above.
//
// The Python is real and runs on the page. The from-scratch versions are
// there because a student who can read twenty lines of arithmetic stops
// believing a model is magic, and the scikit-learn versions are there
// because those four lines are what anybody actually writes at work. The
// numbers the playgrounds print are the numbers quoted in the prose — the
// rent slope, the split on visits, the forest's score — because a page that
// quotes a figure its own code contradicts teaches the wrong lesson twice.
//
// Every historical claim here is one I can point at: Galton's 1886 height
// study and his 1907 Vox Populi note, the Ottawa ankle rules, and the Kinect
// pose work published by Shotton and colleagues in 2011.

const OBJECTIVES = [
  'Say what a model is, and what it is not, without using the word algorithm',
  'Explain linear regression, a decision tree and a random forest to somebody who has not done this course',
  'Say which of the three fits a problem put in front of you, and why',
  'Read the four lines of Python that fit any of them',
  'Name the trap that catches every beginner, and the usual way out of it',
];

const GLOSSARY: [string, string, string][] = [
  [
    'What we know',
    'The facts you hold about each thing',
    'Floor area. Visits a month. How long somebody has been a customer. One row per thing, one column per fact. Everywhere else these get called features, or inputs, or variables — same idea, four names.',
  ],
  [
    'What we want to know',
    'The answer you are after',
    'The rent. Whether they cancel. Written next to each row, for every example you already know the answer to. Called the target, or the label.',
  ],
  [
    'Showing it examples',
    'Handing over the rows and the answers',
    'The model reads them and works out a rule that fits. This is called training, or fitting. It happens once, takes seconds on data this size, and produces a rule you keep.',
  ],
  [
    'Asking it',
    'Giving it a row with the answer missing',
    'It applies the rule and hands back a guess. This is prediction, and it is the only part that happens over and over once the thing is live.',
  ],
];

const BREAKS: [string, string][] = [
  [
    'The relationship is not a straight line',
    'Ice cream sales climb with temperature, then flatten out when it is too hot to leave the house. A straight line forced through that shape is wrong at both ends and right in the middle, which is the most dangerous way for a model to be wrong.',
  ],
  [
    'You ask about something far outside the data',
    'Those twelve flats run from 28 to 98 square metres. Ask the line about a 400 square metre flat and it will answer, politely and confidently, having never seen anything remotely like one. A model has no way of telling you it is out of its depth.',
  ],
  [
    'Two of your inputs say the same thing',
    'Floor area and number of rooms move together almost perfectly. The model will fit fine, but it cannot tell you which of the two is doing the work, and the individual numbers it hands you become unreliable to quote.',
  ],
  [
    'Moving together is not the same as causing',
    'The line says size and rent rise together. It does not say that adding a square metre causes the rent to rise — here that happens to be true, but the model would say exactly the same thing about two numbers that merely drift in step. No amount of data settles that question on its own.',
  ],
];

const COMPARE: [string, string, string, string][] = [
  ['What it answers', 'How much? A number.', 'Which one? A category, usually.', 'Either.'],
  [
    'Shape it can learn',
    'A straight line. Bends have to be added by hand.',
    'Straight cuts, stacked up. Bends and corners come free.',
    'The same, but hundreds of times over, so the edges come out smoother.',
  ],
  [
    'Can you explain a decision',
    'Yes, and in one sentence per input.',
    'Yes. Read the branch out loud.',
    'Not really. You can say which inputs mattered overall, not why this person was declined.',
  ],
  [
    'Where it falls over',
    'Curves, and questions outside the data it has seen.',
    'Memorising the examples, unless you stop it early.',
    'Nothing you can print. Slower, and much larger to store.',
  ],
  [
    'Reach for it when',
    'The answer is a number and somebody will ask you what drives it.',
    'You have to show your working to a person, a customer or a regulator.',
    'You mostly need it to be right, and the explanation can be a separate conversation.',
  ],
];

const SKLEARN_LINES = `# The same three lines, whichever model you choose.
model = SomeModel()        # 1. pick the kind of rule you want
model.fit(X, y)            # 2. show it the examples
model.predict(new_rows)    # 3. ask it about something new`;

const SKLEARN_THREE = `# Predicting a number — the rent of a flat.
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)


# Predicting a category, with a flowchart you can print.
from sklearn.tree import DecisionTreeClassifier
model = DecisionTreeClassifier(max_depth=3)
model.fit(X, y)


# Predicting a category, as accurately as you reasonably can.
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=300)
model.fit(X, y)`;

const PLAY_LINE = `# Twelve flats: floor area in square metres, and monthly rent.
# The same twelve you dragged a line through further up this page.
size = [28, 35, 41, 46, 52, 58, 63, 70, 76, 84, 91, 98]
rent = [410, 430, 505, 520, 585, 600, 665, 690, 760, 780, 870, 880]

n = len(size)
mean_size = sum(size) / n
mean_rent = sum(rent) / n

# The best line, in one step. Top: how much do size and rent move together?
# Bottom: how much does size move on its own? Divide one by the other.
top = sum((size[i] - mean_size) * (rent[i] - mean_rent) for i in range(n))
bottom = sum((size[i] - mean_size) ** 2 for i in range(n))

slope = top / bottom
start = mean_rent - slope * mean_size

print("Rent = %.0f + %.2f x size" % (start, slope))
print("Each extra square metre is worth about $%.2f a month." % slope)
print()

# Now use it.
for s in [40, 65, 120]:
    print("A %d m2 flat  ->  about $%.0f a month" % (s, start + slope * s))

miss = sum(abs(rent[i] - (start + slope * size[i])) for i in range(n))
print()
print("Wrong by $%.0f in total, across all twelve. About $%.0f each." % (miss, miss / n))`;

const PLAY_TREE = `# Fourteen gym members: visits a month, months as a member,
# and whether they cancelled (1) or stayed (0).
members = [
    (1,  3, 1), (2,  5, 1), (2, 14, 1), (3,  2, 1),
    (3,  9, 1), (4,  4, 1), (4, 20, 0), (5,  6, 0),
    (6, 11, 0), (7,  3, 0), (8, 18, 0), (9,  7, 0),
    (11, 2, 0), (12, 25, 0),
]
COLUMNS = [(0, "visits"), (1, "months")]


def wrong_after_splitting(rows, column, threshold):
    """Split on this question, call each side by its majority, and count
    how many members we would get wrong."""
    low  = [r for r in rows if r[column] <  threshold]
    high = [r for r in rows if r[column] >= threshold]
    wrong = 0
    for group in (low, high):
        if not group:
            continue
        cancelled = sum(r[2] for r in group)
        stayed = len(group) - cancelled
        wrong += min(cancelled, stayed)   # the minority is who we get wrong
    return wrong


# A decision tree picks its question by trying all of them and keeping the
# best. That really is all this next bit does.
best = None
for column, name in COLUMNS:
    for threshold in range(1, 30):
        wrong = wrong_after_splitting(members, column, threshold)
        if best is None or wrong < best[0]:
            best = (wrong, column, name, threshold)

wrong, column, name, threshold = best
print("Best first question:  is %s less than %d ?" % (name, threshold))
print("It gets %d of the %d members wrong.\\n" % (wrong, len(members)))

for answer, group in [("YES", [r for r in members if r[column] <  threshold]),
                      ("NO ", [r for r in members if r[column] >= threshold])]:
    cancelled = sum(r[2] for r in group)
    call = "cancels" if cancelled * 2 > len(group) else "stays"
    print("%s -> %2d members, %d cancelled, %d stayed  =>  we say '%s'"
          % (answer, len(group), cancelled, len(group) - cancelled, call))

print()
for visits, months in [(2, 6), (5, 12), (4, 1)]:
    call = "cancels" if visits < threshold else "stays"
    print("New member, %d visits and %d months  ->  we say %s" % (visits, months, call))`;

const PLAY_FOREST = `import random
random.seed(4)

# 160 gym members. Somebody cancels if they rarely come AND they are new --
# except about one in six, because people are not tidy.
rows = []
for _ in range(160):
    visits = random.randint(0, 14)
    months = random.randint(1, 30)
    cancels = 1 if (visits < 5 and months < 12) else 0
    if random.random() < 0.22:
        cancels = 1 - cancels
    rows.append((visits, months, cancels))

train, test = rows[:110], rows[110:]   # learn on 110, judge on the other 50


def majority(group):
    return 1 if sum(r[2] for r in group) * 2 > len(group) else 0

def wrong_in(group):
    ones = sum(r[2] for r in group)
    return min(ones, len(group) - ones)

def grow(group, columns, depth):
    """Keep asking the best question until the group is clean, tiny, or we
    have run out of depth. Returns either a decision or another question."""
    if depth == 0 or wrong_in(group) == 0 or len(group) < 3:
        return majority(group)
    best = None
    for column in columns:
        for threshold in range(1, 31):
            low  = [r for r in group if r[column] <  threshold]
            high = [r for r in group if r[column] >= threshold]
            if not low or not high:
                continue
            score = wrong_in(low) + wrong_in(high)
            if best is None or score < best[0]:
                best = (score, column, threshold, low, high)
    if best is None:
        return majority(group)
    _, column, threshold, low, high = best
    return (column, threshold, grow(low, columns, depth - 1), grow(high, columns, depth - 1))

def ask(tree, row):
    while isinstance(tree, tuple):
        column, threshold, low, high = tree
        tree = low if row[column] < threshold else high
    return tree

def score(call, group):
    return sum(1 for r in group if call(r) == r[2]) / len(group) * 100


one = grow(train, [0, 1], 6)
print("ONE tree, allowed to grow as deep as it likes")
print("  on members it has already seen : %.0f%%" % score(lambda r: ask(one, r), train))
print("  on members it has never seen   : %.0f%%" % score(lambda r: ask(one, r), test))
print("  ^ that gap is the tree memorising.\\n")

# Now 60 trees. Each gets a random handful of the same members, drawn with
# replacement, and is only allowed to ask about a random subset of columns.
# The randomness is the point: it makes them disagree.
forest = []
for _ in range(60):
    sample = [random.choice(train) for _ in train]
    columns = random.sample([0, 1], random.choice([1, 2]))
    forest.append(grow(sample, columns, 6))

def vote(row):
    calls = [ask(t, row) for t in forest]
    return 1 if sum(calls) * 2 > len(calls) else 0

alone = [score(lambda r, t=t: ask(t, r), test) for t in forest]
print("60 trees, on members none of them has seen")
print("  best single tree in the forest : %.0f%%" % max(alone))
print("  worst single tree              : %.0f%%" % min(alone))
print("  average tree, on its own       : %.0f%%" % (sum(alone) / len(alone)))
print("  ALL SIXTY VOTING               : %.0f%%" % score(vote, test))`;

const QUESTIONS: QuizQuestion[] = [
  {
    q: 'A hotel wants to predict how many rooms will be booked next Saturday. Which of these is the job of a model, rather than something a person decides?',
    answer: 2,
    options: [
      { text: 'Deciding that Saturday is the day worth predicting', why: 'That is a business decision, and a good one, but no model made it. Somebody looked at the problem and chose the question. Models never choose the question.' },
      { text: 'Deciding to collect the weather forecast as an input', why: 'Also a person. Choosing which facts are worth gathering is judgement about the world, and it is usually where most of the value in a project sits.' },
      { text: 'Working out how much each input shifts the booking number', why: 'Yes. You supply the past Saturdays and what happened on each; the model works out how much weight to put on the weather, the month, the price. That weighting is the rule you did not write.' },
      { text: 'Deciding whether the prediction is good enough to act on', why: 'A person, again. A model reports a number. Whether that number is accurate enough to change a staffing roster is a decision with consequences, and it belongs to somebody accountable.' },
    ],
  },
  {
    q: 'Your line says rent goes up by about $7 for each extra square metre. A colleague asks what it predicts for a 400 square metre penthouse. What is the honest answer?',
    answer: 1,
    options: [
      { text: 'About $3,000, and that is what the model is for', why: 'The arithmetic is right and the answer is not. The line will produce a number for any input you hand it, including inputs nothing like anything it has ever seen.' },
      { text: 'It will give a number, but it has never seen a flat over 98 square metres, so the number is not worth much', why: 'Exactly right. The data ran from 28 to 98 square metres. Outside that range the line is extending a pattern on faith, and penthouses are priced by a different logic anyway.' },
      { text: 'It cannot answer, because 400 is outside the range', why: 'It can answer — that is the problem. Nothing stops it. A model has no sense of being out of its depth, which is why noticing that is your job.' },
      { text: 'It depends how many flats were in the original data', why: 'More flats would make the slope more trustworthy inside the range it covers. It would do nothing at all about a question four times beyond the largest one you measured.' },
    ],
  },
  {
    q: 'A tree grown without limits gets every one of your 14 training members right and about 6 in 10 of new ones. What has gone wrong?',
    answer: 0,
    options: [
      { text: 'It has learned the 14 members rather than the pattern behind them', why: 'That is it. Given enough branches a tree can carve out a rule for each individual. Perfect on the people it studied, guessing on everybody else. This is overfitting, and stopping the tree earlier is the usual fix.' },
      { text: 'There was not enough data to train on', why: 'Fourteen is certainly small, and more would help. But the specific symptom here — flawless on the old, poor on the new — is the signature of memorising, and it happens with 14 rows and with 14 million.' },
      { text: 'The wrong questions were available to it', why: 'If the questions were useless the tree would do badly on the training members too. Getting all 14 right means the questions were more than good enough — it was allowed to use too many of them.' },
      { text: 'Trees cannot predict categories reliably', why: 'They can, and a shallow one is one of the most trustworthy things in this toolkit. The problem is depth, not the method.' },
    ],
  },
  {
    q: 'Why does a random forest deliberately train each tree on a random slice of the data, rather than giving every tree everything?',
    answer: 3,
    options: [
      { text: 'To make training faster', why: 'Smaller samples are quicker, but that is a side effect. If speed were the aim you would simply build fewer trees.' },
      { text: 'Because there is not usually enough data for every tree', why: 'The trees share one dataset, and rows get reused freely — the same member can appear several times in one tree’s sample. Nothing is being rationed.' },
      { text: 'To keep some data back for testing', why: 'Holding data back for testing is a real and important practice, and a separate one. The random slicing here is about the trees themselves, not about how you judge them.' },
      { text: 'So the trees disagree with each other', why: 'Yes. Identical trees would make identical mistakes, and a vote among them would change nothing. Feeding each a different slice makes each wrong in a different place, and it is the disagreement that lets the errors cancel.' },
    ],
  },
  {
    q: 'A lender must, by law, tell a rejected applicant why they were rejected. A random forest scores best on their data. What follows?',
    answer: 2,
    options: [
      { text: 'Use the forest and write the reasons afterwards', why: 'Reasons reconstructed after the fact are not the reasons the decision was made for. If a regulator or a court asks, that gap is exactly what they will find.' },
      { text: 'Use the forest, since accuracy is what protects applicants', why: 'A more accurate model does reject fewer people wrongly, which matters. It does not satisfy an obligation to explain, and accuracy is not a defence against failing to meet one.' },
      { text: 'The requirement to explain is a constraint on the choice, not a detail to solve later', why: 'Right. Being able to state the reason is part of the specification, alongside accuracy. That usually points at a shallow tree or a regression — and if the accuracy gap turns out to be large, that is a finding to take to the business, not something to quietly work around.' },
      { text: 'Use the forest to decide and a tree to explain', why: 'Two models that can disagree, with the one nobody sees making the real decision. That is worse than either alone, and it is difficult to describe honestly to anybody.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['A model is a rule worked out from examples.', 'You hand over rows of facts and the answers that went with them. What comes back is a rule nobody typed in. Everything in this lesson is a different shape of rule.'],
  ['Linear regression draws the best straight line.', 'Use it when the answer is a number. Its real value is often the slope rather than the prediction: "each square metre is worth about seven dollars a month" is a sentence you can take into a meeting.'],
  ['A decision tree is a flowchart it wrote itself.', 'Try every question, keep the one that tidies the group most, repeat. You can print the result and hand it to a person, which is why it survives in medicine and in lending.'],
  ['Left alone, a tree memorises.', 'Grown deep enough it writes a rule for each individual — perfect on the people it studied, guessing on everybody else. Stopping it early trades a little accuracy on the old data for a lot on the new.'],
  ['A random forest votes.', 'Hundreds of trees, each trained on a random slice and allowed only a random set of questions, so their mistakes land in different places and cancel. You give up the printable flowchart to get it.'],
  ['The simple one first, always.', 'A regression takes ten minutes and tells you whether there is any signal worth chasing. A model people trust and act on beats a better one that stays in a notebook.'],
];

function Code({ title, children }: { title: string; children: string }) {
  return (
    <div className="bt-code">
      <div className="bt-code__bar">
        <span className="bt-dot" style={{ background: 'var(--green-500)', width: 6, height: 6, borderRadius: 999, display: 'inline-block' }} />
        {title}
      </div>
      <pre>{children}</pre>
    </div>
  );
}

export default function PredictingWithDataLesson() {
  return (
    <div>
      <LessonHeader
        lesson={3}
        of={3}
        title="Linear regression, decision trees and random forests"
        lead="Three models that do most of the work in business analytics, explained without the maths. You will fit a line by hand, grow a decision tree until it breaks, watch nine trees outvote the best one among them, and run real Python on this page without installing anything."
        meta={[
          ['Reading', 'about 40 minutes'],
          ['Assumes', 'nothing'],
          ['Needs', 'a browser'],
        ]}
        objectives={OBJECTIVES}
      />

      {/* ══ 3.1 ══════════════════════════════════════════════════════════ */}
      <section id="what" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.1 · The one idea underneath"
            title="A rule nobody wrote down"
            aside="Before the three models, the thing all three of them are. It takes two minutes and it makes the rest much easier."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Most software runs on rules somebody wrote. A bank might say: approve the loan if income is over
              $50,000 and there are no missed payments in the last two years. A person chose those two numbers,
              typed them in, and can change them on Monday morning.
            </p>
            <p>
              The three models in this lesson work the other way around. You do not give them the rule. You give
              them examples — a few thousand past loans, and what happened to each one — and the rule is what comes
              back.
            </p>
            <p>
              That is the whole idea. Everything else in this lesson is detail about what shape the rule is allowed
              to take.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 34 }}>Why not just write the rule?</h3>
          <div className="bt-rows">
            <div>
              <h4>Some rules cannot be written down</h4>
              <p>
                Nobody can tell you what makes a handwritten squiggle a 7 rather than a 1. You know one when you see
                one and you cannot say why. Postal sorting offices read millions of handwritten addresses a day on
                rules learned from examples, because there was never a rule available to type in.
              </p>
            </div>
            <div>
              <h4>Some rules are too big to hold in your head</h4>
              <p>
                If an answer depends on two hundred facts at once, no committee is going to argue its way to the
                right weighting for each of them. A model will settle it in seconds, and be consistent about it
                afterwards, which committees are not.
              </p>
            </div>
            <div>
              <h4>The world moves</h4>
              <p>
                Show the model this year&rsquo;s examples and the rule updates itself. The hand-typed rule is still
                sitting there with the numbers somebody chose in 2019, quietly getting worse.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Four words, and then we can stop defining things</h3>
          <div className="bt-pairgrid">
            {GLOSSARY.map(([term, gloss, body]) => (
              <div key={term} className="bt-card">
                <p className="bt-eyebrow">{gloss}</p>
                <h4 style={{ marginTop: 8 }}>{term}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p className="bt-note">
            You will meet all four under their textbook names — features, target, training, prediction. There is
            nothing behind those words except what is written above.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-caution" style={{ marginTop: 30 }}>
            <p className="bt-eyebrow">Worth saying once, early</p>
            <p>
              A model is a description of what happened before. It has no opinion about whether what happened
              before was fair, or whether next year will look anything like it. If your past lending decisions were
              biased, a model trained on them learns the bias and applies it faster and more consistently than any
              human ever could. Nothing in the rest of this lesson fixes that, and no amount of accuracy makes up
              for it.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.2 ══════════════════════════════════════════════════════════ */}
      <section id="line" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.2 · When the answer is a number"
            title="Draw the best straight line"
            stop="."
            aside="The oldest tool here, and still the first one to reach for. It is named after a Victorian observation about how tall children turn out."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              In 1886 Francis Galton plotted the heights of several hundred grown children against the heights of
              their parents. The cloud of dots leaned, clearly: taller parents, taller children. He drew a straight
              line through the lean — and noticed that children of very tall parents came out tall, but a little
              closer to average than their parents were. He called that drift back towards the middle{' '}
              <em>regression</em>.
            </p>
            <p>
              The name stuck to the method rather than to the observation. That is why the most widely used tool in
              business analytics is called regression, and why the word tells you nothing useful about what it does.
              What it does is draw a line.
            </p>
            <p>
              Modern versions of that line predict how much electricity a city will pull tomorrow evening, what a
              house is worth, how many units a shop will shift next week, and how long a patient is likely to stay.
              Anywhere the answer is a quantity, this is where you start.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Try it: twelve flats, one line</h3>
          <p className="bt-note" style={{ maxWidth: '62ch' }}>
            Twelve flats, plotted by floor area against monthly rent. Move the two sliders until the line sits as
            close as you can get it to all twelve at once. The readout is how much money the line is wrong by, added
            up across every flat — so lower is better, and zero is impossible.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <FitTheLine />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 34 }}>
            <p>
              The computer does not slide sliders. There is a formula that goes straight to the lowest possible
              total in one step, and it has been known since about 1805. Two small differences from what you just
              did: it squares each miss before adding them up, so that one enormous error hurts far more than
              several small ones, and squaring also stops a miss above the line quietly cancelling a miss below it.
            </p>
            <p>
              You do not need the formula. You need to know that a best line exists, that it is found rather than
              guessed, and that &ldquo;best&rdquo; means a specific measurable thing rather than a matter of taste.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-verdict bt-verdict--good" style={{ marginTop: 26 }}>
            <strong>The slope is usually the point, not the prediction.</strong> The line through those twelve flats
            adds about $7.07 for every extra square metre. That is not merely an ingredient in a calculation — it is
            a sentence you can say out loud in a meeting, and one that somebody can push back on. Linear regression
            survives in a world of much cleverer models largely because it hands you a number you can argue about.
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Where it lets you down</h3>
          <div className="bt-rows">
            {BREAKS.map(([head, body]) => (
              <div key={head}>
                <h4>{head}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ 3.3 ══════════════════════════════════════════════════════════ */}
      <section id="tree" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.3 · When the answer is a choice"
            title="A flowchart it wrote itself"
            aside="The model you can print out and pin to a wall — which turns out to matter more than accuracy in a surprising number of jobs."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Badly twist your ankle and, for a long time, you got an X-ray more or less automatically. In the early
              1990s a team of emergency doctors in Ottawa worked through thousands of ankle injuries and produced a
              very short flowchart. Can you put weight on it? Is there tenderness on these two particular points of
              bone? Answer those, and you know whether the X-ray is worth doing.
            </p>
            <p>
              Hospitals that adopted it ordered substantially fewer ankle X-rays without starting to miss fractures.
              A version of that flowchart is still pinned up in emergency departments around the world. It saved a
              great deal of money, and it saved a great many people several hours on a hospital trolley.
            </p>
            <p>
              A decision tree is that, built by a computer instead of by a research team over three years. Same
              shape — a handful of yes-or-no questions leading to a decision — found by reading the data rather than
              by studying it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 26 }}>
            <p>
              <b>How it picks the questions.</b> It tries all of them. Every fact you gave it, at every cut-off
              worth trying, and it keeps whichever question leaves the two resulting groups tidiest — meaning each
              side ends up as close to all-one-answer as possible. Then it does the same thing again on each side,
              and again, until the groups are small or already clean.
            </p>
            <p>
              That is genuinely the mechanism. The textbooks measure &ldquo;tidy&rdquo; with something called
              entropy or Gini impurity; below, it is simply how many members you would call wrong, which ranks the
              options the same way and needs no explaining.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Try it: fourteen gym members, one question</h3>
          <p className="bt-note" style={{ maxWidth: '62ch' }}>
            A gym wants to know who is about to cancel, so it can ring them first. Here are fourteen members it
            already knows the answer for. Pick the question you would ask first, and watch what it does to the
            group.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <GrowTheTree />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 34 }}>
            <p>
              <b>What a tree is worth.</b> You can print it. You can hand it to a nurse, a loan officer or a
              regulator, and every decision it makes has a reason you can read out loud in one sentence. In lending
              and in medicine that is frequently not a nice-to-have but a legal requirement, and it is the reason a
              method from the 1980s is still in daily use.
            </p>
            <p>
              <b>What it costs.</b> Left to itself, a tree memorises. Give it enough branches and it will invent a
              rule for each individual person in your data — flawless on everybody it has met, and guessing about
              everybody else. The name for that is <em>overfitting</em>, and it is the single most common way a
              first model fails.
            </p>
            <p>
              <b>The usual fix is embarrassingly simple.</b> Stop it early. A tree allowed only three questions deep
              cannot write a rule about one person, because it does not have the branches to spare. It will get a
              few more of your training examples wrong and noticeably more new ones right. In scikit-learn that is
              one argument: <code>max_depth=3</code>.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.4 ══════════════════════════════════════════════════════════ */}
      <section id="forest" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.4 · When you want the best answer you can get"
            title="Ask a crowd of trees"
            aside="One tree is easy to fool. Several hundred, each fooled by something different, are much harder to fool all at once."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Galton turns up again, twenty years later. At a country fair in Plymouth in 1906, visitors paid to
              guess the weight of an ox. Galton collected 787 of the tickets afterwards and did the arithmetic.
              Hardly anybody was close, and most of the crowd were not farmers. But the middle of all the guesses
              came to 1,207 pounds, and the ox weighed 1,198 — under one per cent out, and closer than the great
              majority of the individual guesses, expert or not.
            </p>
            <p>
              The reason is not that crowds are wise. It is that the mistakes pointed in both directions and largely
              cancelled, while whatever the crowd collectively knew about oxen pointed the same way and survived.
            </p>
            <p>
              A random forest does this on purpose, with trees instead of people.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <ul className="bt-flow" style={{ marginTop: 26 }}>
            <li>
              <span className="bt-flow__n">1</span>
              <div>
                <h4>Build hundreds of trees, not one</h4>
                <p>Three hundred is a perfectly ordinary number. They are cheap to build.</p>
              </div>
            </li>
            <li>
              <span className="bt-flow__n">2</span>
              <div>
                <h4>Give each one a random sample of the data</h4>
                <p>
                  Drawn with replacement, so some rows turn up twice in a tree&rsquo;s sample and some not at all.
                  Every tree sees a slightly different version of the world.
                </p>
              </div>
            </li>
            <li>
              <span className="bt-flow__n">3</span>
              <div>
                <h4>At each question, let it consider only a few of the facts</h4>
                <p>
                  Chosen at random. This stops every tree opening with the same obvious question and ending up as
                  near-copies of each other.
                </p>
              </div>
            </li>
            <li>
              <span className="bt-flow__n">4</span>
              <div>
                <h4>Take the vote</h4>
                <p>
                  Majority wins for a category; the average for a number. The randomness in steps 2 and 3 is not
                  sloppiness, it is the entire mechanism — identical trees would make identical mistakes and voting
                  would achieve precisely nothing.
                </p>
              </div>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Try it: follow one tree, or follow the vote</h3>
          <p className="bt-note" style={{ maxWidth: '62ch' }}>
            Five gym members none of these trees has ever seen. Nine trees call each one. Watch both scores: what
            the first tree would have managed alone, and what the nine of them managed together.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <ForestVote />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 34 }}>
            <p>
              <b>This is not a toy method.</b> In 2010 Microsoft shipped a camera that worked out where your head,
              elbows, hands and knees were, thirty times a second, for whoever happened to stand in front of it —
              different heights, different clothing, different living rooms, no calibration. The method underneath
              was a randomised decision forest trained on an enormous pile of example poses. It went into millions
              of homes, and for several years it was probably the most-used piece of machine learning that ordinary
              people had in the house.
            </p>
            <p>
              Away from the famous cases, random forests are the quiet workhorse of business analytics: fraud flags,
              churn, credit risk, demand forecasts, which customers are worth a phone call. They handle mixed
              inputs, they cope with a few odd values, they need very little fussing over, and they are frequently
              good enough that nothing more elaborate is ever needed.
            </p>
            <p>
              <b>What you give up.</b> You cannot print three hundred trees. You can still ask which facts mattered
              most across the whole forest, which is genuinely useful — but you cannot hand a rejected applicant the
              one-sentence reason a single tree would have given them. Where that sentence is required, a shallow
              tree or a regression may be the right choice even though it scores worse, and if the gap is large that
              is a finding to take to the business rather than something to quietly work around.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.5 ══════════════════════════════════════════════════════════ */}
      <section id="which" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.5 · Choosing"
            title="Which one, when"
            aside="Most of the time the answer is decided by what you have to be able to explain afterwards, not by which model scores highest."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="bt-plaintable">
              <thead>
                <tr>
                  <th />
                  <th>Linear regression</th>
                  <th>Decision tree</th>
                  <th>Random forest</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([row, a, b, c]) => (
                  <tr key={row}>
                    <th scope="row">{row}</th>
                    <td>{a}</td>
                    <td>{b}</td>
                    <td>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 32 }}>
            <p>
              <b>And one rule that outranks the table.</b> Run the simple model first, every time. A linear
              regression takes ten minutes and answers the only question that matters at the start: is there any
              signal in this data at all? If there is not, no forest will conjure one, and you have found that out
              on the first morning instead of the third week.
            </p>
            <p>
              A model people trust and actually act on is worth more than a better one that stays in a notebook. In
              this course, and in the job afterwards, the second is much more common than the first.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.6 ══════════════════════════════════════════════════════════ */}
      <section id="code" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.6 · The code you would actually write"
            title="All three are the same three lines"
            aside="This is the part people expect to be hard. It is four lines, and swapping one model for another is a one-word change."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Everything above is done in Python with a library called scikit-learn, and every model in it has the
              same shape. Once you have seen it once, you have seen all of them.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Code title="the shape of every model in scikit-learn">{SKLEARN_LINES}</Code>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 26 }}>
            <p>
              <b>What X and y are.</b> <code>X</code> is a table: one row per thing, one column per fact you know
              about it. <code>y</code> is a single column of answers, one for each row, in the same order. Twelve
              flats with their floor areas is an <code>X</code> of twelve rows and one column; the twelve rents are{' '}
              <code>y</code>. That is the entire convention, and it is the same for all three models.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Code title="the three models, in full">{SKLEARN_THREE}</Code>
          <p className="bt-note">
            Note what changes between them: the import line and the model name. Nothing else. Switching from a tree
            to a forest, or from a forest back to a regression, is a one-line edit — which is why trying all three
            is normal practice rather than an ambitious afternoon.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-caution" style={{ marginTop: 26 }}>
            <p className="bt-eyebrow">To run the scikit-learn versions</p>
            <p>
              scikit-learn is a large library, so this page does not ship it — the playgrounds below run on plain
              Python instead. To run the four-line versions above, open{' '}
              <a href={COLAB_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-600)' }}>
                a free Colab notebook <ExternalLink size={12} aria-hidden="true" />
              </a>
              , where scikit-learn, pandas and the rest are already installed. It needs a Google account and nothing
              else — no download, no setup, and it works the same on a Mac, a PC and a Chromebook.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ 3.7 ══════════════════════════════════════════════════════════ */}
      <section id="play" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 3.7 · Python, running on this page"
            title="Three spaces to poke at"
            stop="."
            aside="Real Python, in your own browser. Change a number, press Run, see what moves. Nothing is installed and nothing is sent anywhere."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              These do the same work as the four-line versions above, written out longhand so you can read every
              step. That is the point of them: a model stops feeling like magic at roughly the moment you can follow
              twenty lines of ordinary arithmetic doing it.
            </p>
            <p>
              The first press fetches Python, which takes about twenty seconds. After that everything is instant,
              including the other two boxes.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 34 }}>The line, worked out longhand</h3>
          <PythonPlayground
            label="Linear regression — the twelve flats"
            code={PLAY_LINE}
            rows={20}
            note="Try this: change one rent to something wild — make the 28 m² flat $2,000 — and run it again. Watch how far one strange row drags the whole line. That sensitivity is why people check their data before they trust a regression."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>The tree choosing its first question</h3>
          <PythonPlayground
            label="Decision tree — the fourteen members"
            code={PLAY_TREE}
            rows={22}
            note="Try this: add a third fact to each member — say, whether they are on a discounted plan — and add it to COLUMNS. The same loop will consider it, and tell you whether it beats asking about visits."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>One tree against sixty</h3>
          <p className="bt-note" style={{ maxWidth: '62ch' }}>
            The longest of the three, and the one worth reading twice. It builds 160 members with a known rule and
            some deliberate noise, trains on 110 of them, and judges everything on the 50 it held back — which is
            how you find out whether a model has learned anything or merely memorised.
          </p>
          <PythonPlayground
            label="Random forest — 160 members, 60 trees"
            code={PLAY_FOREST}
            rows={26}
            note="Try this: change 60 to 5 and run it again, then to 200. More trees help, then stop helping — and nowhere does adding trees make it worse, which is the pleasant thing about this method. Then set the noise from 0.22 to 0.0 and watch the single tree catch right up: with nothing to memorise, there is nothing for the vote to protect you from."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 26 }}>
            A warning about the boxes above: an endless loop — <code>while True:</code> with no way out — will lock
            the page up, because the Python runs in this tab rather than on a server. Reload and it comes back, and
            nothing you typed is kept anyway.
          </p>
        </Reveal>
      </section>

      {/* ══ Check ════════════════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Check yourself"
            title="Five questions"
            aside="Nothing is stored and nothing is reported. Pick the answer you would defend, then read why the others are wrong — that is where most of the value is."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz questions={QUESTIONS} closing="Anything you got wrong is worth a second look above." />
        </Reveal>
      </section>

      <Recap
        title="Six things worth keeping"
        points={RECAP}
        footnote="Galton's height study is from 1886 and his note on the ox is from 1907. The Ottawa ankle rules were developed by Stiell and colleagues in the early 1990s. The Kinect pose work was published by Shotton and colleagues in 2011. Decision trees in this form are Breiman and colleagues, 1984; random forests are Breiman, 2001."
      />
    </div>
  );
}
