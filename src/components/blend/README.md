# Blend

The design system behind the public course pages — Blended Teaching Content by
Yasas Sri Wickramasinghe. Warm paper instead of a cool grey, one rationed
accent, big tight display type, pills for anything you can press and
soft-squares for anything that holds content.

Live examples: `/intro-to-dbms` (warm orange), `/intro-to-business-analytics`
and `/power-bi-setup` (teal), `/intro-to-sisp` (indigo),
`/intro-to-project-management` (plum).

- **Stylesheet** — `src/styles/blend.css`
- **Components** — `src/components/blend/`
- **Namespace** — everything is scoped under `.bt` ("Blended Teaching") and
  every class is prefixed `bt-`, so none of it reaches the rest of the app,
  which still runs on the violet Tailwind theme.

---

## Build a new lesson page

Four steps. The system gives you the header, nav, footer and theme; you write
a hero and the body.

```tsx
import { CoursePage, SectionHead, Reveal } from '../components/blend';

const NAV = [
  { id: 'why', label: 'Why it matters' },
  { id: 'outline', label: 'Outline' },
];

export default function MyLessonPage() {
  return (
    <CoursePage
      accent="analytics"                       // omit for the warm orange
      courseCode="MBI807B"
      courseName="Business Intelligence and Data Warehousing"
      nav={NAV}
      hero={
        <div className="bt-herogrid">
          <div>
            <span className="bt-flag">
              <span className="bt-dot" style={{ background: 'var(--accent-500)' }} />
              No login, no install
            </span>
            <h1>A warehouse nobody can <span className="bt-stop">query.</span></h1>
            <p className="bt-hero__lede">One sentence on what the reader is about to do.</p>
            <div className="bt-hero__cta">
              <button type="button" className="bt-btn">
                Start here<span className="bt-btn__badge" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className="bt-heroart">{/* a real object from the subject */}</div>
        </div>
      }
    >
      <section id="why" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Section 1.1 · Where this starts"
            title="The thing a reader can act on"
            stop="."
            aside="One or two sentences of context, 12–28 words. It sits to the right on desktop and drops below on mobile."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-prose"><p>Body copy.</p></div>
        </Reveal>
      </section>
    </CoursePage>
  );
}
```

Then add the route in `src/App.tsx`, lazily, the same way the existing course
pages are registered.

---

## Rules that keep pages looking like one family

**The accent is loud but rationed.** One accent thing per region of the
screen — a button, or a progress fill, or an eyebrow, or one card. Neutrals do
all the structural work. Never colour a whole paragraph in it.

**Headlines are sentence case**, 3–7 words, broken across lines by intent. The
line break is a design decision, not a wrap.

**The full stop is the signature.** A headline may close with a `.bt-stop`
period in the accent. At most once per screenful, and never on a headline that
already ends in a question mark — use `stop="?"` there instead, which colours
the mark you already have.

**Two radius families, deliberately far apart.** Pills (`--radius-pill`) for
anything actionable: buttons, chips, tabs, nav items, inputs. Soft-squares for
containers: 20px cards, 28px panels, 14px small tiles. A 4px "slightly
rounded" corner is off-system.

**Buttons carry an arrow badge.** A circular badge on the right of the pill,
inverted against the fill: `→` advances within the page, `↗` opens something
new or external. Never ALL CAPS.

**Not everything is a card.** Border, fill, radius and shadow each say
"separate object". Spend them on the one thing that needs lifting. A list that
is genuinely a sequence gets `.bt-track`, not eight identical cards.

**No gradients, no emoji, no bounce, no infinite loops.** Entrances are an
8–12px translate plus a fade. Hovers lift 2px. Presses scale to .97.

**Motion is fast and calm.** `--dur-fast` 120ms for colour, `--dur-base` 200ms
for transforms, `--dur-slow` 340ms for panels. `--ease` for almost everything.

---

## Accents

The accent is tokenised, so a course keeps its own hue inside one visual
language. Nothing but these seven values and the shadow changes between them.

| Variant | Class | Used by |
|---|---|---|
| Warm orange (default) | none | MBI802 — Database Management Systems |
| Teal | `.bt--analytics` | MBI806B — Business Data Analytics, Power BI setup |
| Indigo | `.bt--planning` | MBI800 — Strategic Information Systems Planning |
| Plum | `.bt--project` | MBI804 — IT Project Management |

To add one, copy the `.bt--analytics` block in `blend.css`, redefine
`--accent-50` through `--accent-700` plus `--accent-shadow`, and add the name
to `BlendAccent` in `CoursePage.tsx`. Keep the ramp warm-compatible: it has to
sit on `#fdf4ee` paper without going sour.

---

## Tokens

Defined on `.bt` in `blend.css`. Always use the token, never the literal — that
is what lets a page swap accent without touching a component.

| Group | Tokens |
|---|---|
| Accent | `--accent-50` … `--accent-700`, `--accent-shadow` |
| Ink (warm near-blacks) | `--ink-900` … `--ink-200` |
| Paper (creams) | `--paper-0` … `--paper-300` |
| Status | `--green-500`, `--amber-500`, `--red-500`, `--blue-500` and their `-50` tints |
| Type | `--font-display` (Manrope 800), `--font-body` (DM Sans), `--font-mono` (JetBrains Mono) |
| Radius | `--radius-sm` 10, `--radius-md` 14, `--radius-card` 20, `--radius-panel` 28, `--radius-pill` |
| Motion | `--ease`, `--ease-out`, `--dur-fast`, `--dur-base`, `--dur-slow` |
| Shadow | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-brand`, `--inset-hi` |

Semantic hues are for 6px status dots, thin badges and tiny inline labels
only. Never as a fill for a large area.

The three faces load from `index.html` alongside Inter, in one request.

---

## Components

| Import | What it gives you |
|---|---|
| `CoursePage` | The whole frame: brand header, pill nav, hero slot, content column, dark footer. Imports the stylesheet for you. |
| `CourseBrand` | The Blended Teaching Content lockup. Takes its colour from the page accent. `variant="on-dark"` for the footer. |
| `PillNav` | Floating nav that tracks the section in view. `CoursePage` wires this up already. |
| `SectionHead` | Eyebrow + headline + right-hand standfirst. |
| `Reveal` | Scroll-in wrapper: 22px lift and fade, once per element. Wrap a section head and its body separately, with `delay={0.05}` on the body. |

---

## Classes worth knowing

Layout: `bt-wrap` (1180px column), `bt-sec` (a section with its top rhythm),
`bt-sechead`, `bt-aside`, `bt-prose` (62ch measure), `bt-note` (small muted).

Hero: `bt-herogrid`, `bt-flag`, `bt-hero__lede`, `bt-hero__meta`,
`bt-hero__cta`, `bt-heroart`, `bt-keyline`.

Actions: `bt-btn` with `--md`, `--sm`, `--dark`, `--tertiary`, and
`bt-btn__badge` for the arrow.

Content: `bt-card`, `bt-stats`, `bt-track` / `bt-trackrow` (a numbered
sequence), `bt-step` (a numbered preview block), `bt-figure`, `bt-code`,
`bt-grid` (a data table), `bt-plaintable`, `bt-scroll` (wrap anything wide),
`bt-flow` (numbered steps), `bt-rows`, `bt-pairgrid`, `bt-topics`,
`bt-signoff`.

Interactive: `bt-flip` (tap-to-reveal card), `bt-walk` (stepper with a rail),
`bt-verdict` (a tone-coloured response box), `bt-tab`, `bt-modeswitch`,
`bt-ctxchip`.

---

## Two traps

**Element resets are wrapped in `:where()`** so they carry zero specificity
and your component classes always win. If you add a reset, keep it inside
`:where()` — a bare `.bt p { margin: 0 }` out-specifies a single class and
silently kills its margin.

**Grid tracks holding wide content need `minmax(0, 1fr)`**, not `1fr`. A `1fr`
track will not shrink below a wide `<pre>` or table and pushes the whole page
sideways. Wrap the wide thing in `bt-scroll` as well.

---

## Checks before you ship a page

- Typecheck and build clean.
- No console errors.
- No horizontal scroll at 400px wide.
- Everything meant to be read is visible at rest, not parked at `opacity: 0`.
- Every interactive thing does something, and says what it did.
- Real course material throughout. No placeholder text, ever.
