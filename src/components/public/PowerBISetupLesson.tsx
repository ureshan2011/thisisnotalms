import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Reveal, SaveAsPdf, SectionHead } from '../blend';
import ChartBuilder from './powerbi/ChartBuilder';
import { POWERBI_NOTES } from '../../content/notes/mbi806bPowerBi';

// ─── Power BI, from nothing to your first chart ───────────────────────────
// A beginner guide for MBI806B. Written because roughly half of any class
// arrives on a Mac, and the usual advice — "install Power BI Desktop" — is
// advice they cannot follow.
//
// The line this guide takes: everybody starts in the browser. Power BI
// Service runs at app.powerbi.com on any operating system, a free licence
// covers working in My Workspace, and it can create a semantic model from
// data you paste in by hand. That is the whole hello-world, so it is the
// path the course uses. Windows users can add Desktop when the course needs
// Power Query, which the comparison table below is honest about.
//
// Deliberately no virtual machine, Boot Camp or Parallels route. Asking a
// beginner to license and run a second operating system to open one
// application is not a setup step, it is a different project.
//
// Every claim here is checked against Microsoft's own documentation; the
// pages are linked at the bottom so a reader can verify any of it. Details
// like system requirements and licence names do change — if something below
// stops matching what Microsoft says, their docs win.

type Path = 'web' | 'windows' | 'locked';

const PATHS: { key: Path; label: string; sub: string }[] = [
  { key: 'web', label: 'I have a Mac', sub: 'Or a Chromebook, an iPad, or a Linux machine' },
  { key: 'windows', label: 'I have Windows', sub: 'A laptop or desktop running Windows 10 or later' },
  { key: 'locked', label: 'My laptop is locked down', sub: 'A work machine, or one where I cannot install things' },
];

const THREE_PARTS = [
  {
    name: 'Power BI Service',
    where: 'app.powerbi.com, in any browser',
    who: 'Everyone, on any operating system',
    body: 'The online half. You sign in, build reports, and share them with people who need to see them. This is where the course starts and where a Mac lives permanently.',
    lead: true,
  },
  {
    name: 'Power BI Desktop',
    where: 'An application you install',
    who: 'Windows only — there is no Mac version',
    body: 'The heavy end: full Power Query for reshaping messy data, deeper modelling, and many more connectors. Free to download. You publish finished work up to the Service.',
  },
  {
    name: 'Power BI mobile',
    where: 'iOS and Android app',
    who: 'Anyone, once a report exists',
    body: 'For reading reports somebody has already built and shared with you. You do not author in it, so it is not part of the setup.',
  },
];

const REQUIREMENTS: [string, string][] = [
  ['Operating system', 'Windows 10 or later, or Windows Server 2016 or later'],
  ['Architecture', '64-bit only — the 32-bit version is no longer supported'],
  ['Framework', '.NET 4.7.2 or later, plus WebView2'],
  ['Memory', '2 GB available at minimum, 4 GB or more recommended'],
  ['Screen', 'At least 1440×900 or 1600×900. Smaller and some dialogs sit off-screen'],
  ['Display scaling', 'Set text scaling to 100%, or some dialogs become unreachable'],
];

const COMPARISON: { task: string; web: 'yes' | 'no' | 'part'; desktop: 'yes' | 'no' | 'part'; note: string }[] = [
  { task: 'Type or paste a small table and build from it', web: 'yes', desktop: 'yes', note: 'The hello-world below. Works the same on both.' },
  { task: 'Upload an Excel or CSV file', web: 'yes', desktop: 'yes', note: 'Both take a file straight from your machine.' },
  { task: 'Build reports, charts, slicers and pages', web: 'yes', desktop: 'yes', note: 'The report editor in the browser is the same editor.' },
  { task: 'Edit the data model, relationships and measures', web: 'part', desktop: 'yes', note: 'The browser can edit models in a workspace; Desktop is more complete.' },
  { task: 'Reshape messy data with Power Query', web: 'no', desktop: 'yes', note: 'The one real gap. Merging, splitting, unpivoting and cleaning columns.' },
  { task: 'Connect to databases and the wider connector list', web: 'part', desktop: 'yes', note: 'Desktop reaches far more sources, including a local SQL Server.' },
  { task: 'Refresh data you pasted by hand', web: 'no', desktop: 'no', note: 'Pasted data is a snapshot. Re-paste, or move to a file, to update it.' },
  { task: 'Share a report with somebody else', web: 'part', desktop: 'no', note: 'Sharing is a Power BI Pro feature. Building alone is free.' },
];

const WEB_STEPS: [string, string][] = [
  ['Open app.powerbi.com', 'Any modern browser on any operating system. Safari, Chrome, Edge and Firefox all work. There is nothing to download.'],
  ['Sign in with your student email', 'Use the address your institution gave you. A personal Gmail or Hotmail address will not work here — see the warning below, it is the single most common thing that stops people.'],
  ['Accept the free licence if prompted', 'You may see "Start free" or a trial prompt. The free licence is enough for everything in this guide: you get My Workspace, and you can build and save reports in it.'],
  ['Find My Workspace', 'In the left-hand navigation. That is your own private area — nothing you put there is visible to anyone else until you deliberately share it.'],
];

const WINDOWS_STEPS: [string, string][] = [
  ['Do the browser steps first', 'Desktop is an addition, not a replacement. You still need the Service account to publish anything, and the course starts in the browser.'],
  ['Open the Microsoft Store and search "Power BI Desktop"', 'The Store version is the one to prefer: it updates itself, downloads only what changed, and does not need administrator rights on your machine.'],
  ['Or download the installer directly', 'If the Store is blocked, use the Microsoft Download Center link below and choose the 64-bit version. This route does need administrator rights.'],
  ['Open it and close the sign-in prompt', 'You can use Power BI Desktop without signing in. Sign in later, when you want to publish a report up to your workspace.'],
];

const LOCKED_STEPS: [string, string][] = [
  ['Use the browser. That is the whole answer.', 'app.powerbi.com needs no installation and no administrator rights, which is exactly why the course is built around it.'],
  ['If sign-in is blocked, it is a licence setting', 'Some organisations switch off self-service sign-up. The error is not your fault and not fixable from your end — your IT administrator has to enable it or assign you a licence.'],
  ['Bring it to class either way', 'Come along with whatever you have got. Sorting out an account is a five-minute conversation, and it is a far better use of class time than watching you wrestle with it alone.'],
];

const HELLO_STEPS: [string, string][] = [
  ['Go to My Workspace', 'In the left navigation of app.powerbi.com. In Power BI Desktop, start a new report from the Home tab instead.'],
  ['Choose New, then Semantic model', 'A semantic model is just Power BI’s name for "the data your report sits on". Older menus and guides call the same thing a dataset.'],
  ['Pick "Paste or manually enter data"', 'Rather than connecting to a real source. In Power BI Desktop the equivalent button is called Enter data, on the Home tab.'],
  ['Type two columns and three rows', 'Item and Sales. Coffee 120, Tea 90, Juice 60. If you paste a header row, tick "Use first row as headers".'],
  ['Load it, then create a report', 'Your table now exists as a semantic model. Next to it choose Create report, and the report editor opens on an empty canvas.'],
  ['Add a bar chart and fill the two wells', 'Click the bar chart icon in the Visualizations pane. Drag Item onto the axis and Sales onto the values. The chart draws itself.'],
  ['Save it', 'Give it a name you will recognise. It lives in My Workspace, private to you, and you can reopen it from any machine you sign in on.'],
];

const LINKS: { href: string; label: string; note: string }[] = [
  { href: 'https://app.powerbi.com', label: 'Power BI Service', note: 'The browser version. Start here, whatever you are running.' },
  { href: 'https://aka.ms/pbidesktopstore', label: 'Power BI Desktop on the Microsoft Store', note: 'The preferred Windows install. Auto-updates, no admin rights needed.' },
  { href: 'https://www.microsoft.com/download/details.aspx?id=58494', label: 'Power BI Desktop direct download', note: 'Windows, for when the Store is blocked. Choose 64-bit.' },
  { href: 'https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-get-the-desktop', label: 'Microsoft: download and install Power BI Desktop', note: 'The official page, including the full system requirements.' },
  { href: 'https://learn.microsoft.com/en-us/power-bi/fundamentals/service-self-service-signup-for-power-bi', label: 'Microsoft: sign up for the Power BI service', note: 'What each licence covers, and why sign-up sometimes fails.' },
  { href: 'https://learn.microsoft.com/en-us/power-bi/create-reports/service-report-create-new', label: 'Microsoft: create a report in the service', note: 'The same walkthrough as the hello-world, in Microsoft’s words.' },
  { href: 'https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started', label: 'Microsoft: getting started with Power BI Desktop', note: 'Worth reading once you are on Windows and past the basics.' },
  { href: 'https://www.linkedin.com/learning/power-bi-essential-training-2024/overview-power-bi-concepts', label: 'Power BI Essential Training, LinkedIn Learning', note: 'A full video course. Free through most institutional logins.' },
];

const TROUBLE: [string, string][] = [
  ['“We can’t find an account with that email”', 'You used a personal address. Sign out completely and try again with your institution’s email.'],
  ['“Your organisation doesn’t allow self-service sign-up”', 'An administrator switched it off. Email IT and ask for a Power BI licence. Nothing on your machine will fix this.'],
  ['I signed in but I cannot find My Workspace', 'Open the left navigation with the menu icon at the top of the page. My Workspace sits near the bottom of that list.'],
  ['The Store says Power BI Desktop is not available', 'Your Windows build may be too old, or the Store is managed. Use the direct download link, or work in the browser.'],
  ['Power BI Desktop opens with big black areas', 'A Windows display-scaling issue. Search Windows for “blurry” and turn on “Let Windows fix apps that are blurry”, then restart it.'],
  ['I am stuck and class is tomorrow', 'Come anyway. Turning up with an unsolved setup problem is completely fine, and faster to fix in person.'],
];

function Verdict({ v }: { v: 'yes' | 'no' | 'part' }) {
  const label = v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Partly';
  return <span className={`pbi-verdict pbi-verdict--${v}`}>{label}</span>;
}

function Steps({ items, start = 1 }: { items: [string, string][]; start?: number }) {
  return (
    <ol className="bt-flow bt-flow--tight">
      {items.map(([title, body], i) => (
        <li key={title}>
          <span className="bt-flow__n bt-tnum">{i + start}</span>
          <div><h4>{title}</h4><p>{body}</p></div>
        </li>
      ))}
    </ol>
  );
}

export default function PowerBISetupLesson() {
  const [path, setPath] = useState<Path>('web');

  return (
    <div>
      {/* ══ What it actually is ══════════════════════════════════════════ */}
      <section id="what" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Start here"
            title="Power BI is three things wearing one name"
            stop="."
            aside="Most of the confusion beginners hit comes from not knowing which of the three a set of instructions is talking about. Sort that out and the rest is easy."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="pbi-parts">
            {THREE_PARTS.map(p => (
              <div key={p.name} className={`pbi-part${p.lead ? ' pbi-part--lead' : ''}`}>
                {p.lead && <span className="pbi-part__flag">Where we start</span>}
                <h3>{p.name}</h3>
                <dl className="pbi-part__meta">
                  <div><dt>Where</dt><dd>{p.where}</dd></div>
                  <div><dt>Who</dt><dd>{p.who}</dd></div>
                </dl>
                <p>{p.body}</p>
              </div>
            ))}
          </div>

          <div className="pbi-flowpic">
            <svg viewBox="0 0 640 150" width="100%" style={{ maxWidth: 640, display: 'block', margin: '0 auto' }} role="img"
              aria-label="Your data goes into either the browser or Power BI Desktop; both produce a report that lives in the Power BI Service, which people read in a browser or on mobile.">
              <rect x="8" y="46" width="118" height="58" rx="12" fill="var(--paper-200)" stroke="var(--border-subtle)" strokeWidth="1.5" />
              <text x="67" y="71" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ink-900)" fontFamily="var(--font-display)">Your data</text>
              <text x="67" y="88" textAnchor="middle" fontSize="10.5" fill="var(--ink-400)" fontFamily="var(--font-body)">a table, a file</text>

              <path d="M130 66h44" stroke="var(--ink-300)" strokeWidth="1.5" fill="none" markerEnd="url(#pbiarrow)" />
              <path d="M130 86h44" stroke="var(--ink-300)" strokeWidth="1.5" fill="none" markerEnd="url(#pbiarrow)" />
              <defs>
                <marker id="pbiarrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0 0.5 L6 3.5 L0 6.5 z" fill="var(--ink-300)" />
                </marker>
              </defs>

              <rect x="180" y="20" width="150" height="52" rx="12" fill="var(--accent-500)" />
              <text x="255" y="42" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#fff" fontFamily="var(--font-display)">Browser</text>
              <text x="255" y="58" textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,.82)" fontFamily="var(--font-body)">any operating system</text>

              <rect x="180" y="80" width="150" height="52" rx="12" fill="var(--paper-0)" stroke="var(--ink-900)" strokeWidth="1.5" />
              <text x="255" y="102" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ink-900)" fontFamily="var(--font-display)">Desktop</text>
              <text x="255" y="118" textAnchor="middle" fontSize="10.5" fill="var(--ink-400)" fontFamily="var(--font-body)">Windows only</text>

              <path d="M334 46h40l0 30h40" stroke="var(--ink-300)" strokeWidth="1.5" fill="none" />
              <path d="M334 106h40l0-30h40" stroke="var(--ink-300)" strokeWidth="1.5" fill="none" markerEnd="url(#pbiarrow)" />

              <rect x="418" y="46" width="126" height="58" rx="12" fill="var(--accent-50)" stroke="var(--accent-300)" strokeWidth="1.5" />
              <text x="481" y="71" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--accent-700)" fontFamily="var(--font-display)">Your report</text>
              <text x="481" y="88" textAnchor="middle" fontSize="10.5" fill="var(--accent-600)" fontFamily="var(--font-body)">in My Workspace</text>

              <path d="M548 75h38" stroke="var(--ink-300)" strokeWidth="1.5" fill="none" markerEnd="url(#pbiarrow)" />
              <rect x="590" y="46" width="42" height="58" rx="12" fill="var(--paper-200)" stroke="var(--border-subtle)" strokeWidth="1.5" />
              <text x="611" y="71" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ink-900)" fontFamily="var(--font-display)">Read</text>
              <text x="611" y="87" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-body)">web,</text>
              <text x="611" y="97" textAnchor="middle" fontSize="9.5" fill="var(--ink-400)" fontFamily="var(--font-body)">mobile</text>
            </svg>
            <p className="bt-note">
              Both routes end in the same place. That is why starting in the browser costs you nothing later —
              a report you build there is a real report, in the same workspace Desktop would publish to.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Which path is yours ══════════════════════════════════════════ */}
      <section id="path" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Your setup"
            title="Which of these is you"
            stop="?"
            aside="Pick the one that matches the machine you will actually bring to class. Everyone ends up in the browser; only Windows users have anything extra to install."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="pbi-picker" role="group" aria-label="Choose your setup">
            {PATHS.map(p => (
              <button
                key={p.key}
                type="button"
                className="pbi-pick"
                aria-pressed={path === p.key}
                onClick={() => setPath(p.key)}
              >
                <span className="pbi-pick__label">{p.label}</span>
                <span className="pbi-pick__sub">{p.sub}</span>
              </button>
            ))}
          </div>

          <div className="pbi-route">
            {path === 'web' && (
              <>
                <p className="bt-eyebrow">Mac, Chromebook, iPad or Linux</p>
                <h3>You are using the browser, and that is not a compromise<span className="bt-stop">.</span></h3>
                <p className="bt-prose">
                  Power BI Desktop is a Windows application. Microsoft has never shipped a Mac version and has
                  not announced one. What they have shipped is the whole service as a web application, and it
                  runs on your machine today with nothing to install. You can type in data, build reports, save
                  them and reopen them anywhere. Every exercise in this guide works on your machine.
                </p>
                <Steps items={WEB_STEPS} />
                <div className="pbi-nudge">
                  <p className="bt-eyebrow">On purpose, no virtual machines</p>
                  <p>
                    Guides elsewhere will tell you to run Windows on your Mac through Parallels, Boot Camp or a
                    virtual machine. This course does not, and you should not need to. It means paying for and
                    maintaining a second operating system in order to open one application, and it is a far
                    bigger undertaking than the thing it is meant to solve. If you reach a point in the course
                    where the browser genuinely is not enough, ask me and we will sort it out properly.
                  </p>
                </div>
              </>
            )}

            {path === 'windows' && (
              <>
                <p className="bt-eyebrow">Windows 10 or later</p>
                <h3>Browser first, then add Desktop<span className="bt-stop">.</span></h3>
                <p className="bt-prose">
                  You get both halves, so use both. Start in the browser like everyone else, then install Power
                  BI Desktop for the parts of the course that want Power Query and deeper modelling. It is free,
                  and the Microsoft Store version keeps itself up to date without asking you for anything.
                </p>
                <Steps items={WINDOWS_STEPS} />
                <div className="pbi-reqs">
                  <p className="bt-eyebrow ">Before you install, check the machine</p>
                  <dl>
                    {REQUIREMENTS.map(([k, v]) => (
                      <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                    ))}
                  </dl>
                  <p className="bt-note">
                    Most laptops from the last few years clear all of this comfortably. The two that catch
                    people out are the screen size and the display scaling, and both produce the same symptom:
                    a dialog box you cannot reach or close.
                  </p>
                </div>
              </>
            )}

            {path === 'locked' && (
              <>
                <p className="bt-eyebrow">A managed or restricted machine</p>
                <h3>Nothing here needs administrator rights<span className="bt-stop">.</span></h3>
                <p className="bt-prose">
                  The browser route exists for exactly this situation. There is no installer, no admin prompt
                  and no change to your machine. The one thing that can still block you is an account setting,
                  and that is a message to IT rather than anything you can fix yourself.
                </p>
                <Steps items={LOCKED_STEPS} />
              </>
            )}
          </div>

          <div className="pbi-warn">
            <p className="bt-eyebrow">The thing that stops most people</p>
            <p>
              <b>Power BI sign-up needs a work or school email address.</b> A personal Gmail, Hotmail or Outlook.com
              address will be refused at the door, and the error message does not explain why. Use the email address
              your institution issued you. If you have already tried with a personal address, sign out completely,
              close the tab, and start again with the right one.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══ Hello world ══════════════════════════════════════════════════ */}
      <section id="hello" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Your first chart"
            title="Three rows of made-up data, one chart"
            stop="."
            aside="The smallest possible piece of real work. No data source, no download, nothing to go wrong. Have a practice run here first, then do it for real in seven steps."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <ChartBuilder />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="pbi-realsteps">
            <h3>Now the real thing<span className="bt-stop">.</span></h3>
            <p className="bt-prose">
              Same exercise, in Power BI itself. The menu names below are the browser’s; where Power BI Desktop
              calls something different, it says so.
            </p>
            <Steps items={HELLO_STEPS} />
            <div className="pbi-smallprint">
              <p className="bt-eyebrow">Worth knowing about pasted data</p>
              <p>
                Data you type in by hand is a snapshot, not a connection — there is no way to refresh it later,
                so to change it you re-paste or move to a file. It also has limits: about 512 KB of pasted data,
                table names up to 80 characters, column names up to 512. None of that will trouble three rows,
                but it is the reason real work starts from a file or a database instead.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ What the browser can and cannot do ═══════════════════════════ */}
      <section id="limits" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Honest limits"
            title="What the browser does, and where it stops"
            stop="."
            aside="The browser is not a cut-down demo, but it is not everything either. Here is the real division, so nobody is surprised later in the course."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-scroll">
            <table className="pbi-compare">
              <thead>
                <tr>
                  <th>What you want to do</th>
                  <th>Browser</th>
                  <th>Desktop</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(r => (
                  <tr key={r.task}>
                    <td>{r.task}</td>
                    <td><Verdict v={r.web} /></td>
                    <td><Verdict v={r.desktop} /></td>
                    <td className="pbi-compare__note">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bt-note" style={{ marginTop: 18 }}>
            The one row that matters is Power Query. If you are on a Mac and the course reaches a point where we
            are reshaping genuinely messy data, come and talk to me rather than buying anything — there are ways
            to work around it, and we will find the one that fits your machine.
          </p>
        </Reveal>
      </section>

      {/* ══ When it goes wrong ═══════════════════════════════════════════ */}
      <section id="trouble" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="When it goes wrong"
            title="Six things that break, and what each one means"
            stop="."
            aside="Every one of these has caught somebody before you. None of them means you have done anything wrong."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bt-rows">
            {TROUBLE.map(([q, a]) => (
              <div key={q}>
                <h4>{q}</h4>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══ Links ════════════════════════════════════════════════════════ */}
      <section id="links" className="bt-sec">
        <Reveal>
          <SectionHead
            eyebrow="Everything linked"
            title="The pages you actually need"
            stop="."
            aside="Microsoft changes their interface regularly, so if a menu name here stops matching what you see, their documentation is the thing to trust."
          />
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
        </Reveal>
      </section>

      <SaveAsPdf doc={POWERBI_NOTES} />

      {/* ══ Sign off ═════════════════════════════════════════════════════ */}
      <section className="bt-sec">
        <Reveal>
          <div className="bt-signoff">
            <p className="bt-eyebrow">Your lecturer</p>
            <h2>Bring whatever you have got<span className="bt-stop">.</span></h2>
            <p className="bt-signoff__body">
              If you have got as far as a chart of three drinks, you are ready. If you have not, come anyway —
              an unsolved setup problem takes five minutes in person and is a completely normal way to arrive.
              What matters is that nobody sits at the back unable to follow along because of a download.
            </p>
            <p className="bt-signoff__name">
              Yasas Sri Wickramasinghe
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
