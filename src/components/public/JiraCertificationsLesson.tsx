import { ExternalLink, Sparkles } from 'lucide-react';

const certs = [
  {
    badge: 'Atlassian Official',
    badgeBg: 'rgba(0,82,204,0.10)',
    badgeColor: '#0747a6',
    title: 'Atlassian Community — Get the Most Out of Jira',
    tag: 'LEARNING PATH · BEGINNER · SELF-PACED',
    tagColor: '#0052CC',
    description:
      'The most credible free Jira training available — published directly by Atlassian, the company that builds Jira. A guided learning path that walks you from your first project through boards, backlogs, sprints, workflows, and reporting. Bite-sized lessons you can finish in a sitting, with a completion record on your Atlassian Community profile. Free Atlassian account only; no credit card.',
    linkLabel: 'community.atlassian.com',
    href: 'https://community.atlassian.com/learning/path/get-the-most-out-of-jira',
    cardBg: 'linear-gradient(135deg, rgba(219,234,254,0.85), rgba(191,219,254,0.42))',
    borderColor: 'rgba(0,82,204,0.20)',
    accentColor: '#0052CC',
  },
  {
    badge: 'Professional Certificate',
    badgeBg: 'rgba(10,102,194,0.10)',
    badgeColor: '#0a4f8a',
    title: 'LinkedIn Learning — Atlassian Agile Project Management Professional Certificate',
    tag: 'CERTIFICATE PATH · INTERMEDIATE · MULTI-COURSE',
    tagColor: '#0A66C2',
    description:
      'A structured, multi-course path that earns a Professional Certificate displayed directly on your LinkedIn profile — no copy-pasting required. Covers Agile foundations, Scrum, Kanban, and hands-on Jira project management, built in partnership with Atlassian. LinkedIn Learning is often free through your university library or a one-month free trial — check your student access before subscribing.',
    linkLabel: 'linkedin.com/learning',
    href: 'https://www.linkedin.com/learning/paths/atlassian-agile-project-management-professional-certificate',
    cardBg: 'linear-gradient(135deg, rgba(224,242,254,0.85), rgba(186,230,253,0.45))',
    borderColor: 'rgba(10,102,194,0.20)',
    accentColor: '#0A66C2',
  },
  {
    badge: 'Free Certificate',
    badgeBg: 'rgba(5,150,105,0.10)',
    badgeColor: '#064e3b',
    title: 'Great Learning Academy — Jira Project Management',
    tag: 'COMPLETION CERT · BEGINNER · ≈1–2 hrs',
    tagColor: '#059669',
    description:
      'A short, practical, completely free course that gets you hands-on with Jira fast — creating projects, issues, boards, and tracking work through to delivery. A free downloadable certificate of completion is issued automatically when you finish, ready to add to your CV and LinkedIn profile the same day. Free Great Learning account; no credit card required.',
    linkLabel: 'mygreatlearning.com',
    href: 'https://www.mygreatlearning.com/academy/learn-for-free/courses/jira-project-management',
    cardBg: 'linear-gradient(135deg, rgba(209,250,229,0.85), rgba(187,247,208,0.42))',
    borderColor: 'rgba(5,150,105,0.20)',
    accentColor: '#059669',
  },
];

const whyLinkedIn = [
  { icon: '👁️', title: 'Recruiter Visibility', desc: 'Agile and Jira skills are in high demand — hiring managers actively search LinkedIn for certified candidates every single day.' },
  { icon: '🤝', title: 'Grow Your Network', desc: 'Your post reaches your connections, their connections, and beyond — compounding your professional presence.' },
  { icon: '💼', title: 'Instant Credibility', desc: 'A vendor-backed or verifiable certificate signals initiative and drive — the exact qualities employers look for in graduates.' },
  { icon: '🚀', title: 'Career Momentum', desc: 'Every credential you post builds a public track record that speaks for you before any interview begins.' },
];

const bonusResources = [
  { label: 'Atlassian University', href: 'https://university.atlassian.com/', note: 'Free Jira & Confluence courses + paid certifications' },
  { label: 'Jira Software Documentation', href: 'https://support.atlassian.com/jira-software-cloud/', note: 'Free official vendor reference' },
  { label: 'Atlassian Agile Coach', href: 'https://www.atlassian.com/agile', note: 'Free guides on Scrum, Kanban & Agile delivery' },
  { label: 'Scrum.org — What is Scrum?', href: 'https://www.scrum.org/learning-series/what-is-scrum', note: 'Free Scrum foundations from the source' },
  { label: 'Free Jira Cloud Site', href: 'https://www.atlassian.com/software/jira/free', note: 'Free for up to 10 users — practice for real' },
  { label: 'Atlassian Community', href: 'https://community.atlassian.com/', note: 'Free Q&A, events & more learning paths' },
];

export default function JiraCertificationsLesson() {
  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fmc-float  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        @keyframes fmc-float2 { 0%,100%{transform:translateY(0) rotate(5deg)} 50%{transform:translateY(-10px) rotate(-5deg)} }
        @keyframes fmc-float3 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.15)} }
        @keyframes fmc-glow   { 0%,100%{box-shadow:0 0 24px rgba(0,119,181,.35),0 8px 32px rgba(0,119,181,.2)} 50%{box-shadow:0 0 48px rgba(0,119,181,.65),0 12px 48px rgba(0,119,181,.35)} }
        @keyframes fmc-badge-glow { 0%,100%{box-shadow:0 0 0 0 rgba(0,82,204,0)} 50%{box-shadow:0 0 16px 4px rgba(0,82,204,.25)} }
        @keyframes fmc-shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
        @keyframes fmc-pop    { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
        @keyframes fmc-twinkle{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(.6)} }
        @keyframes fmc-ping-slow { 0%{transform:scale(1);opacity:.7} 70%,100%{transform:scale(1.6);opacity:0} }
        @keyframes fmc-slide-up  { from{transform:translateY(14px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fmc-rank-reveal { 0%{opacity:0;transform:translateX(-8px)} 100%{opacity:1;transform:translateX(0)} }
        .fmc-float-1{animation:fmc-float  2.8s ease-in-out infinite}
        .fmc-float-2{animation:fmc-float2 3.2s ease-in-out infinite .4s}
        .fmc-float-3{animation:fmc-float3 2.4s ease-in-out infinite .8s}
        .fmc-float-4{animation:fmc-float  3.6s ease-in-out infinite 1.2s}
        .fmc-float-5{animation:fmc-float2 2.6s ease-in-out infinite .2s}
        .fmc-glow-card{animation:fmc-glow 3s ease-in-out infinite}
        .fmc-shimmer-text{background:linear-gradient(90deg,#fff 0%,#bfdbfe 40%,#fff 60%,#93c5fd 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:fmc-shimmer 4s linear infinite}
        .fmc-btn-shimmer{background:linear-gradient(90deg,#fff 0%,#dbeafe 40%,#fff 60%,#e0f2fe 100%);background-size:300% auto;animation:fmc-shimmer 2.5s linear infinite}
        .fmc-pop-in{animation:fmc-pop .5s cubic-bezier(.175,.885,.32,1.275) both}
        .fmc-twinkle-1{animation:fmc-twinkle 1.8s ease-in-out infinite}
        .fmc-twinkle-2{animation:fmc-twinkle 2.4s ease-in-out infinite .6s}
        .fmc-twinkle-3{animation:fmc-twinkle 1.5s ease-in-out infinite 1.1s}
        .fmc-cert-card{transition:transform .22s ease,box-shadow .22s ease}
        .fmc-cert-card:hover{transform:translateY(-4px) scale(1.015);box-shadow:0 10px 28px rgba(0,0,0,.10)}
        .fmc-slide-up{animation:fmc-slide-up .55s ease both}
        .fmc-rank-pill{animation:fmc-rank-reveal .4s ease both}
        .fmc-badge-pulse{animation:fmc-badge-glow 2.5s ease-in-out infinite}
      `}</style>

      {/* ── Intro tag ── */}
      <p
        className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
        style={{ color: '#0747a6', background: 'rgba(191,219,254,0.55)' }}
      >
        <Sparkles size={12} /> Career development · Project Management
      </p>

      {/* ── Terminology note ── */}
      <div
        className="rounded-2xl p-4 border fmc-slide-up"
        style={{ background: 'linear-gradient(135deg,rgba(219,234,254,.8),rgba(224,242,254,.5))', borderColor: 'rgba(0,82,204,.18)' }}
      >
        <p className="text-xs font-bold mb-2" style={{ color: '#0747a6' }}>📖 Quick Terminology</p>
        <div className="space-y-1 text-xs" style={{ color: '#0a4f8a' }}>
          <p><span className="font-semibold">Jira</span> — Atlassian's industry-standard tool for planning, tracking, and managing software and project work.</p>
          <p><span className="font-semibold">Agile</span> — A way of delivering work in small, iterative cycles; Scrum and Kanban are its two most common frameworks.</p>
          <p><span className="font-semibold">Professional Certificate</span> — A multi-course credential that appears directly on your LinkedIn profile once earned.</p>
        </div>
      </div>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        Three genuinely useful, free (or free-to-access) Jira and Agile credentials — from Atlassian's own learning path to a LinkedIn
        Professional Certificate and a quick certificate of completion. Each one is recommended to complement your studies, sharpen a skill
        employers actively hire for, and give your CV and LinkedIn profile something concrete to show. Work through them in order, or pick the one that fits your time.
      </p>

      {/* ── Certification cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {certs.map((cert, idx) => (
          <div
            key={cert.badge + idx}
            className="fmc-cert-card rounded-2xl p-4 border flex flex-col gap-3"
            style={{ background: cert.cardBg, borderColor: cert.borderColor }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="fmc-rank-pill text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full shrink-0"
                  style={{ background: cert.accentColor, color: '#fff', animationDelay: `${idx * 0.08}s`, fontSize: 11 }}
                >
                  {idx + 1}
                </span>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: cert.tagColor }}>{cert.tag}</p>
              </div>
              <span
                className="fmc-badge-pulse text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: cert.badgeBg, color: cert.badgeColor }}
              >
                {cert.badge}
              </span>
            </div>

            <p className="text-sm font-semibold" style={{ color: '#0b1f44' }}>{cert.title}</p>
            <p className="text-xs leading-5 flex-1" style={{ color: '#374151' }}>{cert.description}</p>

            <a
              href={cert.href}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              style={{ color: cert.accentColor }}
            >
              <ExternalLink size={13} />
              {cert.linkLabel}
            </a>
          </div>
        ))}
      </div>

      {/* ── Suggested order callout ── */}
      <div
        className="rounded-2xl p-4 border"
        style={{ background: 'linear-gradient(135deg,rgba(219,234,254,.7),rgba(236,254,255,.6))', borderColor: 'rgba(0,82,204,.16)' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0052CC' }}>🧭 A suggested path</p>
        <p className="text-xs leading-5" style={{ color: '#1e3a5f' }}>
          Start with <span className="font-semibold">Atlassian's own learning path</span> to get comfortable inside Jira, take the quick
          <span className="font-semibold"> Great Learning</span> course to lock in the certificate, then invest in the
          <span className="font-semibold"> LinkedIn Learning Professional Certificate</span> when you have a longer block of time — it's the one that lands as a badge on your profile.
        </p>
      </div>

      {/* ── Bonus free resources ── */}
      <div
        className="rounded-2xl p-4 border"
        style={{ background: 'linear-gradient(135deg,rgba(243,244,246,.9),rgba(249,250,251,.7))', borderColor: 'rgba(0,82,204,.14)' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#0052CC' }}>
          🔗 More Free Resources — Keep Practising
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {bonusResources.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-0.5 p-2.5 rounded-xl border hover:border-blue-300 transition-all"
              style={{ background: 'rgba(255,255,255,.8)', borderColor: 'rgba(0,82,204,.12)', textDecoration: 'none' }}
            >
              <span className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: '#0a4f8a' }}>
                <ExternalLink size={11} />{r.label}
              </span>
              <span className="text-xs" style={{ color: '#6b7280' }}>{r.note}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── LinkedIn CTA ── */}
      <div
        className="fmc-glow-card rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#004f80 0%,#0077B5 45%,#00a0dc 100%)', position: 'relative' }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 14, right: 18, fontSize: 28, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-1">🎉</div>
        <div style={{ position: 'absolute', top: 52, right: 56, fontSize: 20, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-2">⭐</div>
        <div style={{ position: 'absolute', bottom: 18, right: 22, fontSize: 26, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-3">🏆</div>
        <div style={{ position: 'absolute', bottom: 56, right: 70, fontSize: 18, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-4">✨</div>
        <div style={{ position: 'absolute', top: 90, right: 16, fontSize: 16, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-5">🚀</div>
        <div style={{ position: 'absolute', top: 22, left: 130, fontSize: 10, color: 'rgba(255,255,255,.7)', pointerEvents: 'none' }} className="fmc-twinkle-1">★</div>
        <div style={{ position: 'absolute', top: 60, left: 80, fontSize: 8, color: 'rgba(255,255,255,.6)', pointerEvents: 'none' }} className="fmc-twinkle-2">★</div>
        <div style={{ position: 'absolute', bottom: 40, left: 160, fontSize: 12, color: 'rgba(255,255,255,.5)', pointerEvents: 'none' }} className="fmc-twinkle-3">★</div>

        <div className="p-6" style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex items-center gap-3 mb-5">
            <div style={{ background: 'white', borderRadius: 12, padding: '8px 8px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,.18)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#0077B5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <p className="fmc-shimmer-text font-extrabold text-xl leading-tight">Share Your Achievement!</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(186,230,253,.9)' }}>Let the world know you levelled up 🌍</p>
            </div>
          </div>

          <div className="fmc-pop-in rounded-2xl p-4 mb-5" style={{ background: 'rgba(255,255,255,.13)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(6px)' }}>
            <div className="flex items-start gap-3">
              <span style={{ fontSize: 36, lineHeight: 1, color: 'rgba(255,255,255,.35)', fontFamily: 'Georgia,serif', flexShrink: 0 }}>"</span>
              <div>
                <p className="text-white text-sm leading-relaxed">
                  I'd genuinely love to see what you accomplish here. Agile and Jira skills are among the most
                  in-demand competencies in industry right now, and earning a credential on your own initiative says a lot about your
                  drive and growth mindset — exactly what employers notice. If you post your achievement on LinkedIn, feel free to
                  tag me so I can cheer you on and help amplify it — I genuinely enjoy celebrating every student who levels up. 🎓
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', animation: 'fmc-ping-slow 1.5s ease-out infinite' }} />
                    <div style={{ position: 'absolute', inset: '2px', borderRadius: '50%', background: '#22c55e' }} />
                  </div>
                  <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer" className="text-xs font-bold hover:underline" style={{ color: '#bfdbfe' }}>
                    Yasas Sri Wickramasinghe
                  </a>
                  <span className="text-xs" style={{ color: 'rgba(186,230,253,.7)' }}>· Lecturer</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(186,230,253,.85)' }}>Why your LinkedIn post matters</p>
            <div className="grid grid-cols-2 gap-2">
              {whyLinkedIn.map((item, i) => (
                <div key={item.title} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.15)', animationDelay: `${i * 0.1}s` }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                  <p className="text-white text-xs font-bold">{item.title}</p>
                  <p className="text-xs leading-4 mt-0.5" style={{ color: 'rgba(186,230,253,.8)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3 mb-5 text-xs leading-5" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)' }}>
            <p className="font-bold text-white mb-1">💡 What to write in your post</p>
            <p style={{ color: 'rgba(219,234,254,.9)' }}>
              Share which credential you earned, one thing that genuinely clicked for you, and how Agile or Jira skills connect to where
              you want your career to go. A screenshot of your certificate makes it land even better — posts with images get noticeably more engagement.
            </p>
          </div>

          <a
            href="https://www.linkedin.com/in/yasassri/"
            target="_blank"
            rel="noreferrer"
            className="fmc-btn-shimmer flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-extrabold transition-transform hover:scale-105 active:scale-95"
            style={{ color: '#004f80', boxShadow: '0 4px 20px rgba(0,0,0,.25)', textDecoration: 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Connect with Yasas Sri Wickramasinghe on LinkedIn
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="rounded-xl p-3 border text-xs leading-5" style={{ background: 'rgba(249,250,251,.8)', borderColor: 'rgba(209,213,219,.6)', color: '#6b7280' }}>
        <span className="font-semibold" style={{ color: '#374151' }}>A note before you enrol: </span>
        These platforms may update their pricing, enrolment processes, or certificate availability at any time — always read the course page carefully before signing up to confirm it is still free.
        These are independent suggestions only. This course has no affiliation with, sponsorship from, or endorsement by Atlassian, LinkedIn, Great Learning, or any platform listed above. All trademarks and certifications belong to their respective owners.
      </div>
    </div>
  );
}
