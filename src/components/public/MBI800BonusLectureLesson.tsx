import { useState } from 'react';
import {
  LayoutTemplate,
  Terminal,
  Rocket,
  Mail,
  Check,
  Copy,
  ArrowDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

// ─── MBI800 Bonus Lecture — "From Vibe to Production" ───────────────────────
// The capstone pipeline: Google Stitch 2.0 → Claude Code on the Web →
// GitHub Pages. Matches the visual language of the other public lessons
// (SQLCertificationsLesson, JiraCertificationsLesson): Tailwind utility
// cards, inline style for gradients/accents, a local <style> block for
// scoped keyframes, lucide-react icons.

interface Stage {
  id: string;
  number: string;
  tool: string;
  icon: typeof LayoutTemplate;
  color: string;
  colorBg: string;
  colorBorder: string;
  title: string;
  body: string;
  notes: string[];
}

const STAGES: Stage[] = [
  {
    id: 'stitch',
    number: '01',
    tool: 'GOOGLE STITCH 2.0',
    icon: LayoutTemplate,
    color: '#7c3aed',
    colorBg: 'rgba(124,58,237,0.07)',
    colorBorder: 'rgba(124,58,237,0.22)',
    title: 'Design the layout.',
    body: 'Describe the site you want in plain language — the audience, the sections, the mood. Stitch turns that into real screens: hero, nav, content blocks. Then you refine in rounds — "make the hero calmer," "give the projects section more air" — until it looks right.',
    notes: [
      'One instruction at a time. Don\'t describe the whole site in one prompt.',
      'Export the HTML/CSS once you\'re happy — that\'s your starting repo.',
      'This stage is sketching, not shipping. It doesn\'t need to be production-ready.',
    ],
  },
  {
    id: 'claude',
    number: '02',
    tool: 'CLAUDE CODE ON THE WEB',
    icon: Terminal,
    color: '#4f46e5',
    colorBg: 'rgba(79,70,229,0.07)',
    colorBorder: 'rgba(79,70,229,0.22)',
    title: 'Turn it into real code.',
    body: 'Bring the Stitch export into Claude Code, running in your browser — no local setup needed. Ask it to add the contact form, wire up the project grid, make the nav responsive, write tests. It reads the repo, makes the changes, runs checks, and shows you the diff before anything ships.',
    notes: [
      'Describe outcomes, not implementations: "let visitors book a call from the hero" beats "add a button."',
      'Ask for a review pass — accessibility, broken links, mobile layout.',
      'This is where the site stops being a mockup and becomes software.',
    ],
  },
  {
    id: 'pages',
    number: '03',
    tool: 'GITHUB PAGES',
    icon: Rocket,
    color: '#059669',
    colorBg: 'rgba(5,150,105,0.07)',
    colorBorder: 'rgba(5,150,105,0.22)',
    title: 'Ship it.',
    body: 'Push the repo to GitHub and turn on Pages in the repository settings. Your site is live at yourname.github.io within minutes. Every future push republishes it. No hosting bill, no server to manage — just a URL you can put on a resume or a business card.',
    notes: [
      'Point a custom domain at it later with a CNAME file.',
      'Commit often — your git history is a record of the site improving.',
      'This is the step most courses skip, and the one that makes the other two matter.',
    ],
  },
];

interface Preset {
  key: string;
  label: string;
  for: string;
  color: string;
  colorBg: string;
  file: string;
  prompt: string;
}

const PRESETS: Preset[] = [
  {
    key: 'academic',
    label: 'The Minimalist Academic',
    for: 'For research & long-form credibility',
    color: '#059669',
    colorBg: 'rgba(5,150,105,0.09)',
    file: 'academic_portfolio.prompt.md',
    prompt: `# SYSTEM PROMPT — Stitch + Claude Code

ROLE
You are designing a personal academic portfolio for [YOUR NAME], a
[FIELD] researcher. Optimize for a reader who has 20 seconds and a lot
of judgment.

VISUAL DIRECTION
- Palette: warm paper white (#FAFAF7) background, near-black ink, one
  restrained accent (deep forest or oxblood) used only for links and
  a single hero rule.
- Typography: a serif built for long-form reading, paired with a quiet
  sans for labels and metadata. Line-height 1.6+, body measure capped
  at ~68 characters.
- Layout: single column, generous white space, no cards, no shadows.
  Let whitespace and thin rules do the separating, not boxes.

STRUCTURE
1. Hero — name, title, one-line research thesis. No photo required.
2. Selected Publications — a list, not cards: title, venue, year,
   PDF/DOI link.
3. Research Interests — 3-4 short paragraphs, not a bullet dump.
4. CV download, plus contact: email, Google Scholar, ORCID.
5. Optional: Teaching, Talks & Media.

BUILD NOTES FOR CLAUDE CODE
- Static HTML/CSS, no build step — deploy straight to GitHub Pages.
- Semantic HTML (article, section, nav) for accessibility and
  citation crawlers.
- Add a print stylesheet so the page exports cleanly to PDF for
  tenure or grant packets.
- No animation beyond a 150ms link-underline transition.

# Ship something a hiring committee can read in 20 seconds
# and trust in 20 more.`,
  },
  {
    key: 'innovator',
    label: 'The Creative Tech Innovator',
    for: 'For builders, devs & makers',
    color: '#7c3aed',
    colorBg: 'rgba(124,58,237,0.09)',
    file: 'tech_innovator_portfolio.prompt.md',
    prompt: `# SYSTEM PROMPT — Stitch + Claude Code

ROLE
You are designing a personal portfolio for [YOUR NAME], a builder who
ships things — part developer, part designer, part indie hacker.

VISUAL DIRECTION
- Palette: near-black (#0B0E14) base, exactly one neon accent (electric
  violet or emerald) used for glow, hover states, and a single hero
  gradient. Never stack more than one accent hue at a time.
- Typography: a bold geometric display face for the hero headline,
  monospace for meta text — dates, stack tags, terminal captions.
- Motion: subtle. A glow that breathes, a card that lifts 4px on
  hover, a terminal cursor that blinks. Nothing that fights the reader.

STRUCTURE
1. Hero — one punchy line about what you build, animated gradient
   mesh behind it, a live status pill ("Currently building X").
2. Project Grid — 3-6 cards: live demo link, GitHub link, stack
   chips, one line on why it matters.
3. Now — a dated "what I'm building this month" block.
4. Contact as a terminal prompt: "> email me" / "> book a call".

BUILD NOTES FOR CLAUDE CODE
- Vanilla or React + utility CSS, componentized project cards, dark
  mode as the only mode unless asked otherwise.
- Pull pinned repos from the GitHub REST API into the project grid so
  it never goes stale.
- CSS-only or canvas background accent — keep it under 5% CPU and
  respect prefers-reduced-motion.
- Deploy via a GitHub Actions workflow to Pages so every push to main
  re-publishes automatically.

# Make it feel like a live workshop, not a brochure.`,
  },
  {
    key: 'executive',
    label: 'The Executive Consultant',
    for: 'For enterprise & consulting',
    color: '#4f46e5',
    colorBg: 'rgba(79,70,229,0.09)',
    file: 'executive_consultant_portfolio.prompt.md',
    prompt: `# SYSTEM PROMPT — Stitch + Claude Code

ROLE
You are designing a personal site for [YOUR NAME], an independent
consultant or fractional executive who needs credibility to convert
into booked calls.

VISUAL DIRECTION
- Palette: deep navy or charcoal (#111827) with warm off-white, one
  confident accent (muted gold or steel blue) reserved for CTAs only.
- Typography: a refined serif or high-contrast sans for headlines, a
  neutral grotesk for body copy — measured, never playful.
- Layout: wide hero with a one-sentence value proposition, generous
  section padding, thin 1px borders instead of heavy shadows.

STRUCTURE
1. Hero — who you help and the outcome you deliver, one sentence.
   Primary CTA: "Book a call."
2. Case Studies — 2-4 entries framed Challenge → Approach → Result,
   one hard number per case.
3. Credentials strip — past clients or employers, in grayscale.
4. Services — three clear offers, scoped or priced. No "let's chat
   about everything."
5. Contact — a real calendar embed or booking link, plus email.

BUILD NOTES FOR CLAUDE CODE
- Server-light static build, optimized for fast first paint — this
  audience will not wait.
- Add schema.org Person / ProfessionalService markup for SEO and rich
  results.
- Wire a real booking link (Calendly or Cal.com) into the primary
  CTA — no dead buttons.
- Deploy to GitHub Pages with a custom domain via CNAME so it reads
  as a firm, not a student project.

# A stranger lands, understands the offer, and books —
# in under 30 seconds.`,
  },
];

function CopyButton({ text, color }: { text: string; color: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
      style={{
        color: copied ? '#059669' : '#e5e7eb',
        background: copied ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${copied ? 'rgba(5,150,105,0.4)' : 'rgba(255,255,255,0.14)'}`,
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied' : 'Copy prompt'}
      {!copied && <span style={{ color }} className="sr-only" />}
    </button>
  );
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function VaultGateway() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!emailPattern.test(value)) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);

    const entry = { email: value, submittedAt: new Date().toISOString() };

    window.setTimeout(() => {
      try {
        const store = JSON.parse(localStorage.getItem('mbi800_vault_signups') || '[]');
        store.push(entry);
        localStorage.setItem('mbi800_vault_signups', JSON.stringify(store));
      } catch { /* localStorage unavailable — non-fatal */ }
      console.log('[MBI800 Vault] New signup captured:', entry);
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div
      className="mbc-glow rounded-3xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #059669 130%)' }}
    >
      <div style={{ position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

      <div className="p-6 sm:p-8 relative" style={{ zIndex: 1 }}>
        <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold" style={{ color: '#c7d2fe', background: 'rgba(255,255,255,0.10)' }}>
          <Sparkles size={12} /> Alumni Resource Vault
        </p>

        <h3 className="mt-4 text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          More resources, after the course
        </h3>
        <p className="mt-3 text-sm sm:text-[15px] leading-relaxed max-w-xl" style={{ color: 'rgba(224,231,255,0.85)' }}>
          Drop your Gmail and I'll send a system-prompt library, a deployment checklist, and an
          invite to future alumni build sessions. No spam.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {['System prompt library', 'Deployment checklist', 'Alumni workshop access'].map((perk) => (
            <span key={perk} className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(224,231,255,0.9)' }}>
              {perk}
            </span>
          ))}
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(false); }}
                placeholder="you@gmail.com"
                autoComplete="email"
                className="flex-1 rounded-xl px-4 py-3.5 text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: `1px solid ${error ? '#fca5a5' : 'rgba(255,255,255,0.20)'}`,
                  color: '#fff',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                style={{ background: '#fff', color: '#312e81' }}
              >
                <Mail size={15} />
                {loading ? 'Sending…' : 'Unlock Bonus AI Resources'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs" style={{ color: '#fecaca' }}>
                That doesn't look like a valid email yet — check for typos and try again.
              </p>
            )}
            <p className="mt-2 text-xs" style={{ color: 'rgba(199,210,254,0.7)' }}>
              Unsubscribe whenever.
            </p>
          </form>
        ) : (
          <div className="mbc-rise mt-6 flex items-start gap-3 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="flex-none w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: '#34d399', color: '#022c22' }}>
              <Check size={16} />
            </span>
            <div>
              <p className="text-white font-semibold text-sm">✨ Verification sent!</p>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(224,231,255,0.85)' }}>
                Check your email for the MBI800 Ultimate Vault link.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MBI800BonusLectureLesson() {
  const [activePreset, setActivePreset] = useState<string>('academic');
  const preset = PRESETS.find((p) => p.key === activePreset) ?? PRESETS[0];

  return (
    <div className="space-y-10">
      <style>{`
        @keyframes mbc-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .mbc-rise { animation: mbc-rise 0.5s ease both; }
        @keyframes mbc-glow-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(67,56,202,0); } 50% { box-shadow: 0 10px 40px -8px rgba(67,56,202,0.45); } }
        .mbc-glow { animation: mbc-glow-pulse 4s ease-in-out infinite; }
      `}</style>

      {/* ── Intro tag ── */}
      <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ color: '#3730a3', background: 'rgba(199,210,254,0.5)' }}>
        <Sparkles size={12} /> MBI800 · Capstone Bonus Lecture
      </p>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        Three tools, one afternoon: describe what you want, one AI designs it, another AI builds
        it, and GitHub Pages puts it online for free. Here's each stage, in order.
      </p>

      {/* ── Pipeline ── */}
      <div>
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div key={stage.id}>
              <div
                className="rounded-2xl p-5 sm:p-6 border"
                style={{ background: stage.colorBg, borderColor: stage.colorBorder }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex-none w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: stage.color, color: '#fff' }}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold tracking-widest" style={{ color: stage.color }}>
                        STAGE {stage.number}
                      </span>
                      <span
                        className="text-[11px] font-mono font-semibold tracking-wide px-2 py-0.5 rounded-full"
                        style={{ background: stage.color, color: '#fff' }}
                      >
                        {stage.tool}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-lg sm:text-xl font-semibold" style={{ color: '#111827' }}>
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: '#374151' }}>
                      {stage.body}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {stage.notes.map((n) => (
                        <li key={n} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: '#4b5563' }}>
                          <span className="mt-1.5 flex-none w-1 h-1 rounded-full" style={{ background: stage.color }} />
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className="flex justify-center py-1.5">
                  <ArrowDown size={16} style={{ color: '#c4b5fd' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Prompt Foundry ── */}
      <div>
        <p className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ color: '#3730a3', background: 'rgba(199,210,254,0.5)' }}>
          <Sparkles size={12} /> The Interactive Prompt Foundry
        </p>
        <h3 className="mt-3 text-xl sm:text-2xl font-semibold" style={{ color: '#111827' }}>
          Pick a style for your site.
        </h3>
        <p className="mt-2 text-sm leading-relaxed max-w-2xl" style={{ color: '#374151' }}>
          Choose the one closest to what you want, then copy the prompt into Stitch and Claude Code.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePreset(p.key)}
              className="text-left rounded-2xl p-4 border transition-all"
              style={{
                background: activePreset === p.key ? p.colorBg : '#fff',
                borderColor: activePreset === p.key ? p.color : 'rgba(0,0,0,0.08)',
              }}
            >
              <span className="text-sm font-semibold block" style={{ color: '#111827' }}>{p.label}</span>
              <span className="text-xs mt-1 block" style={{ color: activePreset === p.key ? p.color : '#9ca3af' }}>{p.for}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl overflow-hidden border" style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between px-4 sm:px-5 py-3" style={{ background: '#0b0f19', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="inline-flex items-center gap-2 text-xs font-mono" style={{ color: '#9ca3af' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: preset.color }} />
              {preset.file}
            </span>
            <CopyButton text={preset.prompt} color={preset.color} />
          </div>
          <pre className="px-4 sm:px-5 py-4 text-xs sm:text-[13px] leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto" style={{ color: '#d1d5db', margin: 0, maxHeight: 440, overflowY: 'auto' }}>
            {preset.prompt}
          </pre>
        </div>
      </div>

      {/* ── Vault Gateway ── */}
      <VaultGateway />

      {/* ── Send-off ── */}
      <div className="rounded-2xl p-6 sm:p-8 border text-center" style={{ background: 'rgba(249,250,251,0.8)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <h3 className="text-xl sm:text-2xl font-semibold max-w-xl mx-auto" style={{ color: '#111827' }}>
          That's the course.
        </h3>
        <p className="mt-3 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: '#4b5563' }}>
          This pipeline doesn't end with the course. Keep the repo, keep pushing commits, and let
          an agent take the first pass so you can spend your time on the parts only you can judge.
        </p>
        <p className="mt-5 text-xs font-medium inline-flex items-center gap-1.5" style={{ color: '#6b7280' }}>
          — Yasas Sri Wickramasinghe
          <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline" style={{ color: '#4338ca' }}>
            MBI800 Lecturer <ExternalLink size={11} />
          </a>
        </p>
      </div>
    </div>
  );
}
