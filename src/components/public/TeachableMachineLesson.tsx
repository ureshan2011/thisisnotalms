import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Reveal, SectionHead } from '../blend';
import TeachableMachineTrainer from './TeachableMachineTrainer';

// ─── Meet Teachable Machine ────────────────────────────────────────────────
// A public, ungated resource page for MBI800 in Blend (see
// src/components/blend/README.md), on its own indigo accent set by the
// shell (`accent="strategy"`).
//
// This page is about a real, external product — Google Creative Lab's
// Teachable Machine at teachablemachine.withgoogle.com. It is not affiliated
// with or endorsed by Google. Every factual claim about the tool (project
// types, transfer learning on MobileNet, on-device training, the Google
// account requirement only for saving to Drive, export formats) is checked
// against Google's own material: the tool itself, its Experiments with
// Google page, the "Teachable Machine 2.0" announcement on blog.google, and
// the TensorFlow.js codelab — all linked at the bottom of the page.

const WHY_IT_FITS: [string, string][] = [
  ['Business case, cheaply tested', 'Before a budget goes anywhere near a board, you can build a rough proof of concept yourself in an afternoon and show what "good enough" actually looks like.'],
  ['A third option besides build or buy', 'Most organisations either buy a vendor’s AI product or commission custom development. A no-code tool is a cheap way to test whether an idea is worth either commitment at all.'],
  ['Privacy by design, not just a slogan', 'Training happens on your own device by default. Nothing you show it leaves your computer unless you deliberately save the project to Google Drive — a concrete example of language strategy documents use constantly and rarely explain.'],
  ['Not every transformation is enterprise-sized', 'Some competitive advantage comes from a small, well-aimed automation nobody else in the room bothered to build, not from another platform rollout.'],
  ['It exposes the real bottleneck', 'Ask anyone to collect thirty photos of three things, and most of "the AI project" turns out to be patient, careful data collection — a more honest picture of the work than a vendor slide deck gives you.'],
];

const TUTORIAL_STEPS: [string, string][] = [
  ['Open teachablemachine.withgoogle.com and click "Get Started"', 'Nothing to sign in to and nothing to install. It runs in Chrome, Edge, Firefox and Safari.'],
  ['Choose a project type', 'Image Project for photos, Audio Project for sound, Pose Project for body position. The tutorial below uses Image Project, but the workflow is the same for all three.'],
  ['Pick "Standard image model"', 'The other option, "Embedded model", is tuned for microcontrollers and small devices — skip it unless you already know you need it.'],
  ['Name your first class and record samples', 'Click the webcam icon under the class and hold the record button to capture a burst of frames, or drag in your own photos instead.'],
  ['Add a second and third class the same way', 'Vary the angle, lighting, and background between samples. Ten photos taken in the same spot in a row teach the model your room, not the thing you’re trying to classify.'],
  ['Click "Train Model"', 'Training runs on your own device using transfer learning — more on what that means below — and usually finishes in under a minute for a small dataset like this one.'],
  ['Test it live in the Preview panel', 'Point your webcam at something and watch the percentage for each class update in real time, several times a second.'],
  ['Export it, if you want to keep it', '"Export Model" gives you working TensorFlow.js, TensorFlow Lite, or TensorFlow/Keras code, ready to drop into a website, an app, or a small device.'],
];

type ScenarioItem = { prompt: string; reveal: string };

const SCENARIOS: ScenarioItem[] = [
  { prompt: 'Rock, paper, scissors referee', reveal: 'Three classes that look nothing alike to a camera. The standard first project, and the one the trainer above is modelled on.' },
  { prompt: 'Empty desk vs. occupied desk', reveal: 'Point a webcam at a hot-desk and get an instant occupancy signal — a rough sketch of the workplace-analytics products that carry real licensing fees.' },
  { prompt: 'Sort recyclables: paper, plastic, metal', reveal: 'An Image project a council or campus sustainability team could genuinely pilot in an afternoon, before commissioning anything custom.' },
  { prompt: 'Two hand signs as a silent remote', reveal: 'Train a "play" and a "pause" gesture, then wire the exported model into a slideshow or a smart-home API — a small sketch of the natural-user-interfaces market.' },
  { prompt: 'Spot your own product vs. a competitor’s', reveal: 'Feed it photos of both packagings and get a rough brand-detection classifier — the toy-sized version of the social-listening tools marketing teams pay for.' },
  { prompt: 'Clap once, clap twice, or silence', reveal: 'An Audio project, not Image — proof the same transfer-learning trick works on sound, which matters if your use case is voice or IoT rather than cameras.' },
];

const LIMITS: [string, string][] = [
  ['It only knows what you show it', 'Ten photos taken in the same room, same lighting, same shirt, will fail the moment any of those things change. A real deployment needs deliberately varied examples, not just more of them.'],
  ['It’s a prototype tool, not a shipped product', 'There’s no user management, no monitoring, no versioning and no support contract. Turning a Teachable Machine model into something a business actually runs on is still a real engineering project.'],
  ['Built for proof of concept, not production scale', 'It’s designed for a handful of classes and a modest number of examples per class. A model built here is a starting argument for a budget, not the finished system.'],
  ['Training data quietly encodes bias', 'If every "approved" example happens to share some trait that has nothing to do with what you’re actually classifying, the model learns that trait instead. A small, safe way to feel a risk that shows up in production AI constantly.'],
  ['Saving or sharing a project needs a Google account', 'Training and testing need nothing. The moment you want to save a project to Google Drive, or share a public link to it, you sign in.'],
];

const LINKS: { href: string; label: string; note: string }[] = [
  { href: 'https://teachablemachine.withgoogle.com/', label: 'Teachable Machine', note: 'The real thing. Where you’ll do the tutorial above. Free, no account needed to start.' },
  { href: 'https://experiments.withgoogle.com/teachable-machine', label: 'Teachable Machine, on Experiments with Google', note: 'Google Creative Lab’s own project page, with the story behind it.' },
  { href: 'https://blog.google/technology/ai/teachable-machine/', label: 'Teachable Machine 2.0 makes AI easier for everyone', note: 'Google’s own announcement, covering the Image, Audio and Pose projects.' },
  { href: 'https://codelabs.developers.google.com/tensorflowjs-transfer-learning-teachable-machine', label: 'Make your own "Teachable Machine" with TensorFlow.js', note: 'A Google codelab showing the transfer-learning code underneath, for anyone who wants to see past the interface.' },
  { href: 'https://www.tensorflow.org/js', label: 'TensorFlow.js', note: 'The library every exported model runs on.' },
];

function ScenarioCard({ item }: { item: ScenarioItem }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className={`bt-flip${flipped ? ' bt-flip--on' : ''}`}
      aria-pressed={flipped}
      onClick={() => setFlipped(f => !f)}
    >
      <span className="bt-flip__kicker">{flipped ? 'The strategic angle' : 'Tap to see why'}</span>
      <span className="bt-flip__body">{flipped ? item.reveal : item.prompt}</span>
    </button>
  );
}

export default function TeachableMachineLesson() {
  return (
    <div>
      {/* ══ What it actually is ══════════════════════════════════════════ */}
      <section id="what" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Start here"
            title="A model that learns from examples"
            aside="Most software runs on rules a person wrote. This runs on examples a person collected. That difference is most of the subject."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose">
            <p>
              Teachable Machine is a free, browser-based tool from Google Creative Lab. You give it examples —
              photos from a webcam, sounds from a microphone, or body poses — sorted into two or more classes,
              and it trains a working classifier from them. No coding, and no account needed to build and test
              one.
            </p>
            <p>
              It offers three project types: <strong>Image Project</strong>, <strong>Audio Project</strong> and{' '}
              <strong>Pose Project</strong>. All three follow the same three-step shape — gather examples,
              train, test — whether the input is a picture, a sound, or a body position.
            </p>
            <p>
              Under the hood it uses a technique called <strong>transfer learning</strong>. Instead of starting
              from nothing, it reuses MobileNet, a neural network Google already trained on millions of photos to
              recognise general shapes and textures, and retrains only its last layer on the handful of examples
              you gave it. That is why a model that would normally need thousands of images can be trained on a
              few dozen, in under a minute, on an ordinary laptop.
            </p>
            <p>
              Training happens on your own device. Your webcam frames, audio clips or pose data never leave your
              computer during training — the only time a Google account comes into it is if you choose to save
              a project to Google Drive, or share a public link to one.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Why it belongs in a strategy course ═══════════════════════════ */}
      <section id="why" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Why this belongs in MBI800"
            title="AI you can pilot before lunch"
            aside="Strategic planning usually treats AI as a multi-year IT project. Tools like this are the counter-argument: a working proof of concept costs nothing and takes minutes."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-track bt-track--compact">
            {WHY_IT_FITS.map(([title, body]) => (
              <li key={title} className="bt-trackrow bt-trackrow--plain">
                <div className="bt-trackrow__body">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ══ Try it here first ══════════════════════════════════════════════ */}
      <section id="train" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Try it here first"
            title="Train a tiny rock, paper, scissors model"
            aside="Add samples, train, then test — and see what happens when you don’t add enough, or add far more of one class than the others."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <TeachableMachineTrainer />
        </Reveal>
      </section>

      {/* ══ Build the real thing ═══════════════════════════════════════════ */}
      <section id="tutorial" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Your turn, for real"
            title="Build the real thing in eight steps"
            aside="Same idea as the trainer above, using the actual tool and your actual webcam. Ten minutes, start to finish."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ol className="bt-flow">
            {TUTORIAL_STEPS.map(([title, body], i) => (
              <li key={title}>
                <span className="bt-flow__n bt-tnum">{i + 1}</span>
                <div><h4>{title}</h4><p>{body}</p></div>
              </li>
            ))}
          </ol>
          <a
            className="bt-btn"
            href="https://teachablemachine.withgoogle.com/"
            target="_blank"
            rel="noreferrer"
            style={{ marginTop: 22, textDecoration: 'none' }}
          >
            Open Teachable Machine
            <span className="bt-btn__badge" aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </section>

      {/* ══ Try these scenarios ═════════════════════════════════════════════ */}
      <section id="scenarios" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Ideas worth trying"
            title="Six scenarios, each a real project"
            aside="Pick one, build a rough version on the real site, and bring it to class. Tap a card to see why it’s on this list."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-flipgrid">
            {SCENARIOS.map(item => (
              <ScenarioCard key={item.prompt} item={item} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Read this before you trust it too much ═════════════════════════ */}
      <section id="limits" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="The fine print"
            title="Read this before you trust it too much"
            aside="Everything above is a genuine strength. Here is where it stops, so it isn’t a surprise in front of a client."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-rows">
            {LIMITS.map(([q, a]) => (
              <div key={q}>
                <h4>{q}</h4>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Links ═══════════════════════════════════════════════════════════ */}
      <section id="links" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Links"
            title="Where this page got its facts"
            aside="Google changes the interface from time to time. If a menu name here stops matching what you see, trust their own material over this page."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ul className="tm-links">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label} <ExternalLink size={12} aria-hidden="true" />
                </a>
                <span>{l.note}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ══ Sign off ═══════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>Go build something small<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              You don’t need permission to try this. Open the real site, pick three things you can hold up to
              a camera, and see how fast you get from nothing to a working model. Bring whatever confused you to
              class — that’s usually the more useful conversation.
            </p>
            <p className="bt-signoff__name">
              Yasas Sri Wickramasinghe
              <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer">
                MBI800 lecturer <ExternalLink size={12} aria-hidden="true" />
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
