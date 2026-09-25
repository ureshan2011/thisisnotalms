import { LessonHeader, Quiz, Recap, Reveal, SectionHead, type QuizQuestion } from '../blend';
import FitTheLine from './ml/FitTheLine';
import GrowTheTree from './ml/GrowTheTree';
import ForestSteps from './ml/ForestSteps';
import ForestVote from './ml/ForestVote';
import ForestScoreboard from './ml/ForestScoreboard';
import RandomSamples from './ml/RandomSamples';
import ModelCompare from './ml/ModelCompare';
import RuleVsExamples from './ml/RuleVsExamples';
import PythonPlayground, { COLAB_URL } from './ml/PythonPlayground';

// ─── MBI806B · Three ways to predict things ───────────────────────────────
// For postgraduates with no maths, coding or data background. Pitched at
// about year 12: short sentences, one idea per paragraph, and a picture or a
// widget doing the explaining wherever one can.
//
// Rules I held myself to while writing it:
//   • No formulas. Not one.
//   • Each model gets a story, a picture, a go, and two bullet points.
//   • If a paragraph runs past four lines, it is doing too much.
//   • Say "wrong" not "suboptimal", "guess" not "estimate".
//
// The widgets carry the argument rather than illustrating it. You cannot
// reach the overfitting paragraph without having overfitted a tree yourself
// two inches above it, which is the only reason it sticks.
//
// Numbers in the text are numbers the page's own code prints. The rent line
// is $222 + $6.72, which is what both the slider widget and the playground
// land on, because they run the same search.

const OBJECTIVES = [
  'Explain all three models to a friend, in your own words',
  'Pick the right one for a job',
  'Run all three in Python',
];

const QUESTIONS: QuizQuestion[] = [
  {
    q: 'You want to predict how much a flat will rent for. Which model?',
    answer: 0,
    options: [
      { text: 'Linear regression', why: 'Right. The answer is a number, so you want a line.' },
      { text: 'A decision tree', why: 'Trees are for picking between options — will they cancel, yes or no. Rent is a number.' },
      { text: 'A random forest', why: 'A forest can do numbers too, but for something this simple a line is easier and tells you more.' },
    ],
  },
  {
    q: 'A tree gets all 14 of your members right, but only 6 in 10 new ones. What happened?',
    answer: 1,
    options: [
      { text: 'It needs more questions', why: 'More questions is what caused this. It already has too many.' },
      { text: 'It memorised your 14 instead of learning the pattern', why: 'Yes. That is overfitting. Stop the tree earlier and it does better on new people.' },
      { text: 'The data was wrong', why: 'The data was fine. The tree was allowed to keep going until it had a branch for each person.' },
    ],
  },
  {
    q: 'Why does a random forest use hundreds of slightly different trees?',
    answer: 2,
    options: [
      { text: 'To make it run faster', why: 'It runs slower, not faster. Speed is not the reason.' },
      { text: 'Because one tree is not enough data', why: 'They all share the same data. It is not about having more.' },
      { text: 'So they make different mistakes, which cancel out in the vote', why: 'Exactly. Identical trees would all be wrong about the same person and the vote would change nothing.' },
    ],
  },
];

const RECAP: [string, string][] = [
  ['A model finds the rule for you.', 'You give it examples. It gives you back a rule. Nobody types the rule in.'],
  ['Linear regression draws one line.', 'Use it when the answer is a number. It also tells you things like "about $6.70 per square metre".'],
  ['A decision tree is a flowchart.', 'Use it when the answer is a choice, and when you have to explain yourself. Stop it early or it just memorises.'],
  ['A random forest is lots of trees voting.', 'More accurate, but you cannot print it. Good when being right matters more than explaining.'],
  ['Try the simple one first.', 'A line takes ten minutes and tells you if there is anything there at all.'],
];

const SKLEARN_SHAPE = `model = SomeModel()      # 1. pick a model
model.fit(X, y)          # 2. show it the examples
model.predict(new)       # 3. ask about someone new`;

const SKLEARN_THREE = `# A number, like rent
from sklearn.linear_model import LinearRegression
model = LinearRegression()

# A choice, with a flowchart you can print
from sklearn.tree import DecisionTreeClassifier
model = DecisionTreeClassifier(max_depth=3)

# A choice, as accurate as you can get
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=300)`;

const PLAY_LINE = `# Twelve flats: size in square metres, and monthly rent.
size = [28, 35, 41, 46, 52, 58, 63, 70, 76, 84, 91, 98]
rent = [410, 430, 505, 520, 585, 600, 665, 690, 760, 780, 870, 880]


def how_wrong(start, per_metre):
    """Add up how far this line misses all twelve flats."""
    total = 0
    for i in range(len(size)):
        guess = start + per_metre * size[i]
        total = total + abs(rent[i] - guess)
    return total


# Try thousands of lines. Keep the best one.
# This is exactly what you were doing with the sliders.
best = None
for start in range(150, 300):
    for cents in range(500, 900):
        miss = how_wrong(start, cents / 100)
        if best is None or miss < best[0]:
            best = (miss, start, cents / 100)

miss, start, per_metre = best
print("Best line: $%d, plus $%.2f for every square metre" % (start, per_metre))
print("It is wrong by $%d in total, across all twelve flats." % miss)
print()
print("A 65 m2 flat  ->  about $%.0f a month" % (start + per_metre * 65))`;

const PLAY_TREE = `# Fourteen gym members.
# visits a month, months as a member, and 1 if they cancelled.
members = [
    (1,  3, 1), (2,  5, 1), (2, 14, 1), (3,  2, 1),
    (3,  9, 1), (4,  4, 1), (4, 20, 0), (5,  6, 0),
    (6, 11, 0), (7,  3, 0), (8, 18, 0), (9,  7, 0),
    (11, 2, 0), (12, 25, 0),
]


def how_many_wrong(cut_off):
    """Split on 'visits < cut_off'. Guess the majority on each side.
    How many people do we get wrong?"""
    wrong = 0
    for group in [[m for m in members if m[0] <  cut_off],
                  [m for m in members if m[0] >= cut_off]]:
        if group:
            cancelled = sum(m[2] for m in group)
            stayed = len(group) - cancelled
            wrong = wrong + min(cancelled, stayed)
    return wrong


# Try every cut-off. Keep the best. That is all a tree does.
for cut_off in range(2, 10):
    print("visits < %d   ->  gets %d of 14 wrong" % (cut_off, how_many_wrong(cut_off)))`;

const PLAY_FOREST = `# The same 20 members from the box above.
# visits a month, months a member, and 1 if they quit.
members = [
    (1,  2, 1), (1,  9, 1), (2,  3, 1), (2, 18, 0), (3,  1, 1),
    (3,  7, 1), (3, 26, 0), (4,  4, 1), (4, 11, 1), (4, 30, 0),
    (5,  2, 1), (5, 13, 0), (6,  5, 1), (6, 20, 0), (7,  3, 0),
    (8, 10, 0), (9,  2, 0), (9, 22, 0), (11, 6, 0), (12, 15, 0),
]

# The same five tiny trees. Each asks ONE question. None of them is perfect.
# (which fact to look at, the cut-off, what it asks)
rules = [
    (0,  3, "comes less than 3 times a month"),
    (0,  5, "comes less than 5 times a month"),
    (0,  7, "comes less than 7 times a month"),
    (1,  6, "joined less than 6 months ago"),
    (1, 12, "joined less than a year ago"),
]


def says_quit(rule, member):
    fact, cut_off, name = rule
    return 1 if member[fact] < cut_off else 0


def score(guess):
    return sum(1 for m in members if guess(m) == m[2])


print("Each tree on its own:")
for rule in rules:
    print("   %-34s %2d / 20" % (rule[2], score(lambda m, r=rule: says_quit(r, m))))


def vote(member):
    quit_votes = sum(says_quit(r, member) for r in rules)
    return 1 if quit_votes > len(rules) / 2 else 0


print()
print("   %-34s %2d / 20" % ("ALL FIVE VOTING", score(vote)))`;

function Code({ title, children }: { title: string; children: string }) {
  return (
    <div className="bt-code">
      <div className="bt-code__bar">
        <span style={{ background: 'var(--green-500)', width: 6, height: 6, borderRadius: 999, display: 'inline-block' }} />
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
        title="Three ways to predict things"
        lead="Linear regression, decision trees and random forests. These three do most of the work in business analytics. You will use all three without writing a single formula."
        meta={[
          ['Reading', 'about 25 minutes'],
          ['Assumes', 'nothing'],
          ['Needs', 'a browser'],
        ]}
        objectives={OBJECTIVES}
      />

      {/* ══ What is a model ══════════════════════════════════════════════ */}
      <section id="what" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="First"
            title="What is a model?"
            aside="Two minutes on the one idea all three share. Then we get to the models."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Normally, a person writes the rule. Someone at a bank decides: approve the loan if income is over
              $50,000. They typed that in. They can change it tomorrow.
            </p>
            <p>A model works the other way round. You give it examples. It works out the rule itself.</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <RuleVsExamples />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 26 }}>
            <p>
              Why bother? Because some rules are too hard to write. Nobody can explain what makes a squiggle a 7 and
              not a 1. You just know. Show a computer a million squiggles and it works it out.
            </p>
            <p>
              Two words you will keep seeing. The facts you have — size, visits, age — are the <b>inputs</b>. The
              thing you want to know is the <b>answer</b>. That is it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-caution" style={{ marginTop: 26 }}>
            <p className="bt-eyebrow">Worth knowing</p>
            <p>
              A model copies the past. If your old decisions were unfair, it learns to be unfair too — just faster.
              Nothing in this lesson fixes that.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Linear regression ════════════════════════════════════════════ */}
      <section id="line" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Model 1 of 3"
            title="Linear regression"
            stop="."
            aside="Use it when the answer is a number. How much will this flat rent for? How many will we sell?"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>Put your data on a chart. Draw one straight line through the dots. That is the whole model.</p>
            <p>The line is the rule. Give it a new flat size, read the rent off the line.</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 34 }}>Your turn</h3>
          <p className="bt-note" style={{ maxWidth: '58ch' }}>
            Twelve flats. Move the two sliders and get the line as close to all of them as you can.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <FitTheLine />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose" style={{ marginTop: 30 }}>
            <p>
              That was hard work. The computer does the same thing in a fraction of a second: it tries thousands of
              lines and keeps the one that misses least.
            </p>
            <p>
              And look at what it found. About <b>$6.70 for every extra square metre</b>. That is not just a
              prediction — it is a sentence you can say in a meeting. That is why people still use this model.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-rows">
            <div>
              <h4>It goes wrong when the dots make a curve</h4>
              <p>Ice cream sales climb with heat, then drop when it is too hot to go out. A straight line cannot do that.</p>
            </div>
            <div>
              <h4>And when you ask about something it has never seen</h4>
              <p>
                These flats are 28 to 98 square metres. Ask about a 400 square metre penthouse and it will still give
                you a number. It should not be trusted.
              </p>
            </div>
          </div>
          <p className="bt-note">
            Where the name comes from: an 1886 study of how tall children turn out. It tells you nothing about what
            the model does. Everyone just calls it regression.
          </p>
        </Reveal>
      </section>

      {/* ══ Decision tree ════════════════════════════════════════════════ */}
      <section id="tree" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Model 2 of 3"
            title="Decision tree"
            aside="Use it when the answer is a choice. Will this customer cancel — yes or no?"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Twist your ankle badly and you used to get an X-ray, almost automatically. Then some doctors in Ottawa
              wrote a short flowchart. Can you walk on it? Does this bone hurt? Answer those and you know if the
              X-ray is worth doing.
            </p>
            <p>Hospitals that use it do far fewer X-rays and still catch the breaks. It is still on the wall today.</p>
            <p>A decision tree is that flowchart, except the computer writes it.</p>
            <p>
              <b>How it picks the questions.</b> It tries all of them and keeps whichever one splits the group best.
              Then it does the same again on each half.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 34 }}>Your turn</h3>
          <p className="bt-note" style={{ maxWidth: '58ch' }}>
            A gym wants to ring people before they cancel. Here are fourteen members it already knows about. Which
            question should the tree ask first?
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <GrowTheTree />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-rows" style={{ marginTop: 30 }}>
            <div>
              <h4>Good: you can print it</h4>
              <p>
                Hand it to a nurse or a loan officer and every decision has a reason you can read out loud. In
                medicine and lending that is often the law, not a nice-to-have.
              </p>
            </div>
            <div>
              <h4>Bad: it memorises</h4>
              <p>You just saw this. Let it keep asking questions and it ends up with one branch per person.</p>
            </div>
            <div>
              <h4>The fix is one word</h4>
              <p>
                Stop it early. Three questions deep is plenty. In Python that is <code>max_depth=3</code>.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Random forest ════════════════════════════════════════════════ */}
      <section id="forest" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Model 3 of 3"
            title="Random forest"
            aside="Many small trees. Each one votes. The answer with the most votes wins."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>One decision tree can be wrong.</p>
            <p>
              So make lots of small trees. Ask every one of them. Go with the answer most of them give. That is a
              random forest.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <ForestSteps />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Your turn: ask the trees</h3>
          <p className="bt-note" style={{ maxWidth: '58ch' }}>
            The same gym. We want to know who will quit. Here are five tiny trees — each asks just one question, so you
            can read them. Pick a member and watch each tree vote.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <ForestVote />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Now check all 20 at once</h3>
          <p className="bt-note" style={{ maxWidth: '58ch' }}>
            We already know who really quit. So we can mark every tree, and the forest, on every member.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <ForestScoreboard />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-verdict bt-verdict--good" style={{ marginTop: 26 }}>
            <strong>The big idea:</strong> each tree makes mistakes, but on different people. When they vote, the
            right answers outnumber the wrong ones.
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Why is it called a random forest?</h3>
          <div className="bt-pairgrid">
            <div className="bt-card">
              <h4>Forest</h4>
              <p>Because it is lots of trees.</p>
            </div>
            <div className="bt-card">
              <h4>Random</h4>
              <p>
                Because each tree learns from a random handful of the data. So every tree comes out a little
                different — and makes different mistakes.
              </p>
            </div>
          </div>
          <p className="bt-note" style={{ maxWidth: '58ch' }}>
            Above, we wrote the five questions by hand so you could read them. A real random forest does it for you:
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <RandomSamples />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-rows" style={{ marginTop: 30 }}>
            <div>
              <h4>Good: it is right more often</h4>
              <p>One tree is easy to fool. It is much harder to fool most of them at the same time.</p>
            </div>
            <div>
              <h4>Not so good: it is hard to explain</h4>
              <p>
                You can read one tree. You cannot read 300. If you have to tell someone why, use one decision tree
                instead.
              </p>
            </div>
            <div>
              <h4>In Python you only choose how many trees</h4>
              <p>
                <code>n_estimators=300</code> just means 300 trees. The computer grows them and counts the votes.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Which one ════════════════════════════════════════════════════ */}
      <section id="which" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="All three, side by side"
            title="Which one do I use?"
            aside="Usually decided by what you have to explain afterwards, not by which one scores highest."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <ModelCompare />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-verdict bt-verdict--good" style={{ marginTop: 26 }}>
            <strong>Always try the simple one first.</strong> A line takes ten minutes and tells you whether there is
            anything in your data at all. If there is not, no forest will save you.
          </div>
        </Reveal>
      </section>

      {/* ══ Python ═══════════════════════════════════════════════════════ */}
      <section id="code" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The code"
            title="Three lines each"
            aside="This is the part people expect to be hard. Swapping one model for another is a one-word change."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <Code title="every model looks like this">{SKLEARN_SHAPE}</Code>
          <p className="bt-note">
            <code>X</code> is your table of facts, one row per thing. <code>y</code> is the column of answers. Same
            for all three.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <Code title="the three models">{SKLEARN_THREE}</Code>
          <p className="bt-note">
            Only the name changes. That is why people just try all three.{' '}
            <a href={COLAB_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-600)' }}>
              Open a free Colab notebook
            </a>{' '}
            to run these — it has the libraries already.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Or run it right here</h3>
          <div className="bt-prose">
            <p>
              These three boxes run real Python in your browser. Change a number, press Run, see what happens. The
              first press takes about twenty seconds to fetch Python. After that it is instant.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <PythonPlayground
            label="1 — finding the best line"
            code={PLAY_LINE}
            rows={20}
            note="Try this: change one rent to $2,000 and run it again. One odd flat drags the whole line."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <PythonPlayground
            label="2 — a tree picking its first question"
            code={PLAY_TREE}
            rows={20}
            note="Try this: which cut-off wins? It should match the one you picked in the widget above."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <PythonPlayground
            label="3 — five tiny trees, then a vote"
            code={PLAY_FOREST}
            rows={20}
            note="Try adding a sixth tree to the list, or taking one away. The vote is hard to make worse — that is the useful part."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 22 }}>
            One warning: <code>while True:</code> will freeze the page, because Python is running in this tab. Just
            reload.
          </p>
        </Reveal>
      </section>

      {/* ══ Quiz ═════════════════════════════════════════════════════════ */}
      <section id="check" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Quick quiz"
            title="Three questions"
            aside="Nothing is saved and nobody sees it. Read why the wrong ones are wrong — that is the useful bit."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Quiz questions={QUESTIONS} closing="Go back over anything you missed." />
        </Reveal>
      </section>

      <Recap
        title="Five things to remember"
        points={RECAP}
        footnote="Sources: Galton's height study (1886); the Ottawa ankle rules (Stiell and colleagues, early 1990s)."
      />
    </div>
  );
}
