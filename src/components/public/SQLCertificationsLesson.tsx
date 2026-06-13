import { ExternalLink, Sparkles } from 'lucide-react';

const certs = [
  {
    badge: 'MySQL Badge',
    badgeBg: 'rgba(204,7,30,0.10)',
    badgeColor: '#991b1b',
    title: 'Oracle MyLearn — MySQL Explorer',
    tag: 'VENDOR BADGE · BEGINNER · ≈5–7 hrs',
    tagColor: '#b91c1c',
    description:
      'The most credible free MySQL credential available — issued directly by Oracle, the company that owns MySQL. Complete the self-paced learning path covering the client/server model, MySQL Workbench, basic and complex queries, and troubleshooting. Earn an official "MySQL Explorer" digital badge from Oracle after passing a free online assessment. Free Oracle account only; no credit card.',
    linkLabel: 'mylearn.oracle.com',
    href: 'https://mylearn.oracle.com/ou/learning-path/mysql-explorer/79674',
    cardBg: 'linear-gradient(135deg, rgba(254,226,226,0.80), rgba(252,165,165,0.38))',
    borderColor: 'rgba(239,68,68,0.20)',
    accentColor: '#dc2626',
  },
  {
    badge: 'Verified Cert',
    badgeBg: 'rgba(5,150,105,0.10)',
    badgeColor: '#064e3b',
    title: 'HackerRank — SQL (Basic) Skills Certification',
    tag: 'SKILL EXAM · BEGINNER · 30 min',
    tagColor: '#059669',
    description:
      'A 30-minute online assessment — no course required, just study and sit it. Tests simple queries, relationships, and aggregators on relational databases including MySQL. You earn a verified Skills Certificate with a unique public URL, widely recognised by technical recruiters. Scores are private if you fail; retake after a waiting period. Intermediate (35 min) and Advanced (60 min) exams also free.',
    linkLabel: 'hackerrank.com',
    href: 'https://www.hackerrank.com/skills-verification/sql_basic',
    cardBg: 'linear-gradient(135deg, rgba(209,250,229,0.75), rgba(167,243,208,0.38))',
    borderColor: 'rgba(5,150,105,0.20)',
    accentColor: '#059669',
  },
  {
    badge: 'Credly Badge',
    badgeBg: 'rgba(37,99,235,0.10)',
    badgeColor: '#1e3a8a',
    title: 'Cisco NetAcad — Data Analytics Essentials',
    tag: 'DIGITAL BADGE + CERT · BEGINNER · ≈30 hrs',
    tagColor: '#1d4ed8',
    description:
      'One of the most generous truly-free programs online — 660,000+ learners enrolled. Covers Excel, an introduction to relational databases and SQL (Modules 6 & 7), Tableau, data visualisation, and data ethics across 10 modules and 29 hands-on labs. Earns a free Credly-verified digital badge and certificate of completion from Cisco. Free NetAcad account; no credit card.',
    linkLabel: 'netacad.com',
    href: 'https://www.netacad.com/catalogs/learn',
    cardBg: 'linear-gradient(135deg, rgba(219,234,254,0.80), rgba(186,230,253,0.42))',
    borderColor: 'rgba(37,99,235,0.18)',
    accentColor: '#1d4ed8',
  },
  {
    badge: 'ACE Cert',
    badgeBg: 'rgba(109,40,217,0.10)',
    badgeColor: '#4c1d95',
    title: 'Saylor Academy — CS403: Intro to Modern Database Systems',
    tag: 'COMPLETION CERT · BEGINNER · ≈42 hrs',
    tagColor: '#7c3aed',
    description:
      'The best single free option for database theory — one of the very few truly-free courses that covers both ER diagrams AND SQL in depth. Topics include database architecture, the Entity-Relationship model, relational algebra, data normalisation, SQL SELECT and JOINs, and database design. A free proctored final exam (≥70% to pass) earns an ACE-recommended completion certificate.',
    linkLabel: 'learn.saylor.org',
    href: 'https://learn.saylor.org/course/view.php?id=93',
    cardBg: 'linear-gradient(135deg, rgba(237,233,254,0.85), rgba(221,214,254,0.45))',
    borderColor: 'rgba(109,40,217,0.18)',
    accentColor: '#7c3aed',
  },
  {
    badge: 'Kaggle PDF',
    badgeBg: 'rgba(6,182,212,0.10)',
    badgeColor: '#164e63',
    title: 'Kaggle Learn — Intro to SQL (Google)',
    tag: 'PDF CERTIFICATE · BEGINNER · ≈3 hrs',
    tagColor: '#0891b2',
    description:
      'A practical browser-based course by Kaggle (a Google company) using BigQuery — covering SELECT, FROM, WHERE, GROUP BY, ORDER BY, AS, and WITH. A free downloadable PDF certificate is issued automatically when all module exercises are complete. Kaggle also offers a free "Advanced SQL" certificate (≈4 hrs) covering JOINs, analytic functions, nested data, and query efficiency.',
    linkLabel: 'kaggle.com/learn/intro-to-sql',
    href: 'https://www.kaggle.com/learn/intro-to-sql',
    cardBg: 'linear-gradient(135deg, rgba(207,250,254,0.80), rgba(165,243,252,0.42))',
    borderColor: 'rgba(6,182,212,0.20)',
    accentColor: '#0891b2',
  },
  {
    badge: 'Completion Cert',
    badgeBg: 'rgba(79,70,229,0.10)',
    badgeColor: '#312e81',
    title: 'SoloLearn — Introduction to SQL',
    tag: 'CERTIFICATE · BEGINNER · MOBILE-FRIENDLY',
    tagColor: '#4338ca',
    description:
      'A mobile-friendly ≈5–10-hour course covering SQL CRUD operations, filtering, sorting, joins, and basic relational concepts that apply directly to MySQL. A free completion certificate is issued after finishing all lessons and Code Coach problems. A free SQL Intermediate course is also available. Free SoloLearn account on web or mobile app; no credit card.',
    linkLabel: 'sololearn.com',
    href: 'https://www.sololearn.com/en/learn/courses/sql-introduction',
    cardBg: 'linear-gradient(135deg, rgba(224,231,255,0.85), rgba(199,210,254,0.45))',
    borderColor: 'rgba(79,70,229,0.18)',
    accentColor: '#4338ca',
  },
  {
    badge: 'IBM Badge',
    badgeBg: 'rgba(29,78,216,0.10)',
    badgeColor: '#1e3a8a',
    title: 'IBM / Cognitive Class — SQL and Relational Databases 101',
    tag: 'IBM DIGITAL BADGE · BEGINNER · ≈5–6 hrs',
    tagColor: '#1d4ed8',
    description:
      'An IBM-backed course covering relational model concepts, the five basic SQL statements, advanced SQL syntax, and JOIN statements — with hands-on exercises and a final exam. Passing the exam earns both a free completion certificate and an IBM digital badge issued via Credly. Free Cognitive Class / IBM ID account; no credit card required.',
    linkLabel: 'cognitiveclass.ai',
    href: 'https://cognitiveclass.ai/courses/learn-sql-relational-databases',
    cardBg: 'linear-gradient(135deg, rgba(219,234,254,0.85), rgba(191,219,254,0.42))',
    borderColor: 'rgba(29,78,216,0.18)',
    accentColor: '#1d4ed8',
  },
  {
    badge: 'FCC Cert',
    badgeBg: 'rgba(5,150,105,0.10)',
    badgeColor: '#064e3b',
    title: 'freeCodeCamp — Relational Database Certification',
    tag: 'PUBLIC CERT · PROJECT-BASED · ≈300 hrs',
    tagColor: '#047857',
    description:
      'One of the most respected truly-free programming certifications. Project-based work covering Bash, PostgreSQL/relational databases, Git, and building relational databases from scratch — with SQL skills that transfer directly to MySQL. Complete five required projects to earn a publicly verifiable certification on your freeCodeCamp profile. 100% open-source and free.',
    linkLabel: 'freecodecamp.org',
    href: 'https://www.freecodecamp.org/learn/relational-database/',
    cardBg: 'linear-gradient(135deg, rgba(209,250,229,0.85), rgba(187,247,208,0.42))',
    borderColor: 'rgba(5,150,105,0.20)',
    accentColor: '#047857',
  },
  {
    badge: 'SkillUp',
    badgeBg: 'rgba(217,119,6,0.10)',
    badgeColor: '#78350f',
    title: 'Simplilearn SkillUp — SQL & Database Course Bundle',
    tag: 'FREE CERT BUNDLE · BEGINNER · 1–9 hrs each',
    tagColor: '#b45309',
    description:
      "Multiple free SQL/database tracks on Simplilearn's SkillUp platform — covering Introduction to Databases, SQL Fundamentals, SQL for Data Analysis, SQL for Data Science, and SQL Projects. Each course issues a free downloadable PDF completion certificate automatically. All self-paced; free SkillUp account; no credit card required.",
    linkLabel: 'simplilearn.com/skillup',
    href: 'https://www.simplilearn.com/learn-basics-of-databases-free-course-skillup',
    cardBg: 'linear-gradient(135deg, rgba(254,243,199,0.90), rgba(253,230,138,0.42))',
    borderColor: 'rgba(217,119,6,0.20)',
    accentColor: '#b45309',
  },
];

const whyLinkedIn = [
  { icon: '👁️', title: 'Recruiter Visibility', desc: 'Database and SQL skills are in high demand — hiring managers actively search LinkedIn for certified candidates every single day.' },
  { icon: '🤝', title: 'Grow Your Network', desc: 'Your post reaches your connections, their connections, and beyond — compounding your professional presence.' },
  { icon: '💼', title: 'Instant Credibility', desc: 'A vendor-issued or verifiable certificate signals initiative and drive — the exact qualities employers look for in graduates.' },
  { icon: '🚀', title: 'Career Momentum', desc: 'Every credential you post builds a public track record that speaks for you before any interview begins.' },
];

const bonusResources = [
  { label: 'W3Schools MySQL Tutorial', href: 'https://www.w3schools.com/mysql/', note: 'Free study material (cert exam is paid)' },
  { label: 'MySQL Official Documentation', href: 'https://dev.mysql.com/doc/', note: 'Free vendor reference' },
  { label: 'Kaggle — Advanced SQL', href: 'https://www.kaggle.com/learn/advanced-sql', note: 'Free cert · JOINs, analytic functions, nested data' },
  { label: 'HackerRank — SQL Intermediate', href: 'https://www.hackerrank.com/skills-verification/sql_intermediate', note: 'Free 35-min skill cert' },
  { label: 'HackerRank — SQL Advanced', href: 'https://www.hackerrank.com/skills-verification/sql_advanced', note: 'Free 60-min skill cert' },
  { label: 'Oracle SQL Explorer Path', href: 'https://mylearn.oracle.com', note: 'Free vendor-neutral SQL badge (search "Oracle SQL Explorer")' },
  { label: 'IBM SkillsBuild — Data Catalog', href: 'https://skillsbuild.org/', note: 'Free DB learning paths with completion certs' },
  { label: 'SoloLearn — SQL Intermediate', href: 'https://www.sololearn.com/en/learn/courses/sql-intermediate', note: 'Free completion cert' },
  { label: 'SQLZoo / SQLBolt / Mode SQL', href: 'https://sqlzoo.net/', note: 'Free interactive practice (no certificate)' },
];

export default function SQLCertificationsLesson() {
  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fmc-float  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        @keyframes fmc-float2 { 0%,100%{transform:translateY(0) rotate(5deg)} 50%{transform:translateY(-10px) rotate(-5deg)} }
        @keyframes fmc-float3 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.15)} }
        @keyframes fmc-glow   { 0%,100%{box-shadow:0 0 24px rgba(0,119,181,.35),0 8px 32px rgba(0,119,181,.2)} 50%{box-shadow:0 0 48px rgba(0,119,181,.65),0 12px 48px rgba(0,119,181,.35)} }
        @keyframes fmc-badge-glow { 0%,100%{box-shadow:0 0 0 0 rgba(109,40,217,0)} 50%{box-shadow:0 0 16px 4px rgba(109,40,217,.25)} }
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
        style={{ color: '#4c1d95', background: 'rgba(221,214,254,0.55)' }}
      >
        <Sparkles size={12} /> MBI802 · Database Management Systems
      </p>

      {/* ── Terminology note ── */}
      <div
        className="rounded-2xl p-4 border fmc-slide-up"
        style={{ background: 'linear-gradient(135deg,rgba(237,233,254,.8),rgba(224,231,255,.5))', borderColor: 'rgba(109,40,217,.18)' }}
      >
        <p className="text-xs font-bold mb-2" style={{ color: '#5b21b6' }}>📖 Quick Terminology</p>
        <div className="space-y-1 text-xs" style={{ color: '#4c1d95' }}>
          <p><span className="font-semibold">Badge / digital credential</span> — Shareable, verifiable credential you can post directly to LinkedIn.</p>
          <p><span className="font-semibold">Certificate of completion</span> — Downloadable PDF awarded after finishing course materials.</p>
          <p><span className="font-semibold">Skill certification exam</span> — Assessment-based credential you can claim by passing a test, even without a course.</p>
        </div>
      </div>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        Nine genuinely free MySQL, SQL, and database-design credentials — from vendor badges to skill exams and project-based certifications.
        Every option below is completely free to earn (no credit card required). Recommended to complement your MBI802 coursework and strengthen your CV and LinkedIn profile.
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

            <p className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>{cert.title}</p>
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

      {/* ── Bonus free resources ── */}
      <div
        className="rounded-2xl p-4 border"
        style={{ background: 'linear-gradient(135deg,rgba(243,244,246,.9),rgba(249,250,251,.7))', borderColor: 'rgba(139,92,246,.14)' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6d28d9' }}>
          🔗 Useful Free Learning Resources — No Certificate, But Great for Practice
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {bonusResources.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-0.5 p-2.5 rounded-xl border hover:border-violet-300 transition-all"
              style={{ background: 'rgba(255,255,255,.8)', borderColor: 'rgba(139,92,246,.12)', textDecoration: 'none' }}
            >
              <span className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: '#5b21b6' }}>
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
                  I am <span className="font-bold" style={{ color: '#bfdbfe' }}>genuinely excited</span> to see your certification!
                  Database skills are among the most in-demand competencies in the industry right now.
                  Earning a free credential shows initiative, dedication, and a growth mindset —
                  exactly the qualities that stand out to employers.
                  Please post your achievement on LinkedIn and <span className="font-bold text-white">tag me</span> — I personally celebrate every single one of my students who levels up! 🎓
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', animation: 'fmc-ping-slow 1.5s ease-out infinite' }} />
                    <div style={{ position: 'absolute', inset: '2px', borderRadius: '50%', background: '#22c55e' }} />
                  </div>
                  <a href="https://www.linkedin.com/in/yasassri/" target="_blank" rel="noreferrer" className="text-xs font-bold hover:underline" style={{ color: '#bfdbfe' }}>
                    Yasas Sri Wickramasinghe
                  </a>
                  <span className="text-xs" style={{ color: 'rgba(186,230,253,.7)' }}>· MBI802 Lecturer</span>
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
              Share what you learned, which certification you earned, and how database skills connect to your career goals.
              Tag <span className="font-semibold text-white">@YasasSriWickramasinghe</span> so I can celebrate with you!
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
            Tag Yasas Sri Wickramasinghe on LinkedIn
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="rounded-xl p-3 border text-xs leading-5" style={{ background: 'rgba(249,250,251,.8)', borderColor: 'rgba(209,213,219,.6)', color: '#6b7280' }}>
        <span className="font-semibold" style={{ color: '#374151' }}>A note before you enrol: </span>
        These platforms may update their pricing, enrolment processes, or certificate availability at any time — always read the course page carefully before signing up to confirm it is still free.
        These are independent suggestions only. This course has no affiliation with, sponsorship from, or endorsement by any of the platforms listed above. All trademarks and certifications belong to their respective owners.
      </div>
    </div>
  );
}
