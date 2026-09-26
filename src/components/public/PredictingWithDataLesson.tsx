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
import CodeWalk from './ml/CodeWalk';
import ModelSwap from './ml/ModelSwap';
import PythonWords from './ml/PythonWords';
import { PLAY_FOREST, PLAY_LINE, PLAY_TREE } from './ml/playgrounds';

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
            title="Six lines of Python"
            aside="You do not need to be a programmer. Every model is the same few lines, and we will read them together."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Here is a whole, real program. It trains a random forest on the 20 gym members you just met, then asks
              about two new people.
            </p>
            <p>Press <b>Next line</b> to walk through it. Watch the picture underneath change as you go.</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <CodeWalk />
          <p className="bt-note">
            Want to run it? Press <b>Copy</b>, then{' '}
            <a href={COLAB_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-600)' }}>
              open a free Colab notebook
            </a>
            , paste it into the box and press ▶. Colab already has scikit-learn, so there is nothing to install.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Swap one word, get a different model</h3>
          <p className="bt-note" style={{ maxWidth: '58ch' }}>
            Pick a model. Only the highlighted words change. The last two lines are the same for all three.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <ModelSwap />
        </Reveal>

        <Reveal delay={0.05}>
          <h3 style={{ fontSize: 19, marginTop: 40 }}>Look inside: run it right here</h3>
          <div className="bt-prose">
            <p>
              scikit-learn hides the work inside <code>fit</code>. The three boxes below do that work by hand, in
              plain Python, so you can see it. They run in your browser — nothing to install.
            </p>
            <p>
              Read each one line by line first. Then switch to <b>Edit and run</b>, change a number, and press Run.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h4 style={{ fontSize: 15, marginTop: 26 }}>The only Python you need for them</h4>
          <PythonWords />
        </Reveal>

        <Reveal delay={0.05}>
          <PythonPlayground
            label="1 — finding the best line"
            code={PLAY_LINE.code}
            notes={PLAY_LINE.notes}
            rows={22}
            note="Try this: change my_start and my_per_m2 and get your miss as low as you can. Can you beat the computer's $164?"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <PythonPlayground
            label="2 — a tree picking its first question"
            code={PLAY_TREE.code}
            notes={PLAY_TREE.notes}
            rows={22}
            note="Try this: does the winning cut-off match the question you picked in the tree widget above?"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <PythonPlayground
            label="3 — five tiny trees, then a vote"
            code={PLAY_FOREST.code}
            notes={PLAY_FOREST.notes}
            rows={22}
            note="Try this: change a cut-off in one of the trees, or change votes >= 3 to votes >= 2. The vote is hard to make worse — that is the useful part."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="bt-note" style={{ marginTop: 22 }}>
            Stuck? Press Reset to get the original back. And <code>while True:</code> will freeze the page, because
            Python is running in this tab — just reload.
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
