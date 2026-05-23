import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

@keyframes ermFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes ermFadeIn { from { opacity:0; } to { opacity:1; } }
.erm .a1 { animation: ermFadeUp 0.5s ease forwards; }
.erm .a2 { animation: ermFadeUp 0.5s 0.15s ease forwards; opacity:0; }
.erm .a3 { animation: ermFadeUp 0.5s 0.30s ease forwards; opacity:0; }
.erm .a4 { animation: ermFadeUp 0.5s 0.45s ease forwards; opacity:0; }
.erm .a5 { animation: ermFadeUp 0.5s 0.60s ease forwards; opacity:0; }

.erm *{box-sizing:border-box;margin:0;padding:0}
.erm{font-family:'DM Sans',sans-serif}
.erm section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.erm .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none;color:rgba(255,255,255,.35)}
.erm .concept-body{display:flex;flex:1;min-height:0}
.erm .concept-left{width:790px;flex-shrink:0;padding:72px 68px 72px 96px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(255,255,255,.08)}
.erm .concept-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px;background:#130d36}
.erm .mono{font-family:'DM Mono',monospace}
.erm .act-body{display:flex;height:100%}
.erm .act-left{width:840px;flex-shrink:0;padding:66px 74px 66px 90px;display:flex;flex-direction:column;border-right:1px solid #e0d9f5}
.erm .act-right{flex:1;display:flex;align-items:center;justify-content:center;padding:52px}

.erm .s-title{background:#1e1b4b;justify-content:center;align-items:center}
.erm .s-title .inner{text-align:center;z-index:1}
.erm .s-title .eyebrow{font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;margin-bottom:28px;font-weight:600}
.erm .s-title h1{font-size:92px;color:#f8fafc;line-height:1.0;margin-bottom:28px;font-weight:700}
.erm .s-title h1 span{color:#a78bfa}
.erm .s-title .amber-bar{width:100px;height:4px;background:#d97706;margin:0 auto 28px;border-radius:2px}
.erm .s-title .sub{font-size:24px;color:#a78bfa;font-weight:300;letter-spacing:.02em}

.erm .s-agenda{background:#1e1b4b}
.erm .agenda-inner{padding:80px 100px;display:flex;flex-direction:column;justify-content:center;height:100%}
.erm .agenda-inner .eyebrow{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;margin-bottom:20px;font-weight:700}
.erm .agenda-inner h2{font-size:56px;color:#f8fafc;font-weight:700;margin-bottom:52px}
.erm .agenda-cards{display:flex;flex-direction:column;gap:22px}
.erm .agenda-card{display:flex;align-items:flex-start;gap:28px;padding:28px 36px;border-radius:16px;background:rgba(124,58,237,.10);border:1px solid rgba(167,139,250,.18)}
.erm .agenda-num{width:52px;height:52px;border-radius:12px;background:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:white;flex-shrink:0}
.erm .agenda-card h3{font-size:24px;font-weight:700;color:#f1f5f9;margin-bottom:6px}
.erm .agenda-card p{font-size:17px;color:#a78bfa;line-height:1.5}

.erm .s-bigpic{background:#1e1b4b;justify-content:center;align-items:center}
.erm .s-sectionbreak{background:#1e1b4b;justify-content:center;align-items:center}
.erm .sb-watermark{position:absolute;font-size:320px;font-weight:800;color:rgba(167,139,250,.06);line-height:1;pointer-events:none;user-select:none;bottom:-40px;right:80px}
.erm .sb-inner{text-align:center;z-index:1}
.erm .sb-eyebrow{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;margin-bottom:18px;font-weight:700}
.erm .sb-inner h2{font-size:66px;font-weight:700;color:#f8fafc;margin-bottom:20px;line-height:1.1}
.erm .sb-inner p{font-size:22px;color:#6d28d9;font-weight:300}

.erm .s-concept{background:#2e1065}
.erm .concept-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:22px;width:fit-content;background:#4c1d95;color:#ddd6fe}
.erm .concept-left h2{font-size:50px;color:#f1f5f9;line-height:1.05;margin-bottom:18px;font-weight:700}
.erm .concept-desc{font-size:19px;color:#c4b5fd;line-height:1.75;margin-bottom:22px}
.erm .concept-desc strong{color:#f1f5f9;font-weight:700}
.erm .step-cards{display:flex;flex-direction:column;gap:12px;margin-bottom:18px}
.erm .step-card{border-radius:10px;padding:16px 20px;background:#1e1040;border-left:4px solid #7c3aed;font-size:17px;color:#ddd6fe;line-height:1.5}
.erm .step-card strong{color:#a78bfa}
.erm .warn-card{border-radius:10px;padding:16px 20px;background:#431407;border-left:4px solid #d97706;font-size:16px;color:#fde68a;line-height:1.55;margin-bottom:16px}
.erm .warn-card strong{color:#fbbf24}
.erm .tip-card{border-radius:10px;padding:16px 20px;background:#0c3b4f;border-left:4px solid #0d9488;font-size:17px;color:#a7f3d0;line-height:1.55;margin-bottom:16px}
.erm .example-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.erm .chip{padding:7px 16px;border-radius:8px;font-size:14px;font-weight:500;background:#1e1040;border:1px solid #4c1d95;color:#c4b5fd}
.erm .example-rows{display:flex;flex-direction:column;gap:10px;margin-top:10px}
.erm .ex-row{font-size:16px;color:#c4b5fd;padding:12px 18px;background:#1e1040;border-radius:8px;border-left:3px solid #7c3aed}

.erm .s-fullwhite{background:#faf5ff}
.erm .s-fullwhite .schema-header{padding:56px 100px 32px;border-bottom:2px solid #e9d5ff;background:#fff;flex-shrink:0}
.erm .s-fullwhite .schema-header h2{font-size:44px;font-weight:700;color:#1e1b4b}
.erm .s-fullwhite .schema-header p{font-size:18px;color:#6d28d9;margin-top:6px}

.erm .s-act{background:#faf5ff}
.erm .s-act .act-left{border-right:1px solid #e0d9f5}
.erm .act-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:24px;width:fit-content}
.erm .act-left h2{font-size:40px;color:#1e1b4b;font-weight:700;line-height:1.1;margin-bottom:22px}
.erm .scenario-text{font-size:18px;color:#3b0764;line-height:1.72;margin-bottom:20px;flex:1}
.erm .scenario-text strong{color:#1e1b4b;font-weight:700}
.erm .task-box{border-radius:12px;padding:20px 24px;background:#f3e8ff;border-left:5px solid #7c3aed}
.erm .task-box .task-title{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7c3aed;margin-bottom:10px}
.erm .task-box p{font-size:17px;color:#3b0764;line-height:1.6}

.erm .s-ans-light{background:#f0fdf4}
.erm .ans-header{padding:0 90px;height:88px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #bbf7d0;flex-shrink:0;background:#fff}
.erm .ans-header h2{font-size:34px;font-weight:700;color:#14532d}

.erm .s-mistakes{background:#2e1065}
.erm .mistakes-inner{padding:60px 100px;display:flex;flex-direction:column;height:100%}
.erm .mistakes-inner h2{font-size:52px;font-weight:700;color:#f1f5f9;margin-bottom:40px}
.erm .mistake-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;flex:1}
.erm .mistake-pair{display:flex;flex-direction:column;gap:14px}
.erm .mk-wrong{border-radius:12px;padding:20px 24px;background:#450a0a;border-left:5px solid #ef4444;flex:1}
.erm .mk-wrong .mk-label{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ef4444;margin-bottom:8px}
.erm .mk-wrong p{font-size:17px;color:#fca5a5;line-height:1.55}
.erm .mk-right{border-radius:12px;padding:20px 24px;background:#052e16;border-left:5px solid #22c55e;flex:1}
.erm .mk-right .mk-label{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#22c55e;margin-bottom:8px}
.erm .mk-right p{font-size:17px;color:#86efac;line-height:1.55}

.erm .s-takeaways{background:#1e1b4b}
.erm .takeaways-inner{padding:72px 100px;display:flex;flex-direction:column;justify-content:center;height:100%}
.erm .takeaways-inner h2{font-size:52px;font-weight:700;color:#f1f5f9;margin-bottom:40px}
.erm .takeaway-list{display:flex;flex-direction:column;gap:18px}
.erm .takeaway-item{display:flex;align-items:flex-start;gap:20px;padding:22px 28px;border-radius:14px;background:rgba(124,58,237,.10);border:1px solid rgba(167,139,250,.15)}
.erm .takeaway-num{width:38px;height:38px;border-radius:50%;background:#7c3aed;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white;flex-shrink:0;margin-top:1px}
.erm .takeaway-item p{font-size:19px;color:#ddd6fe;line-height:1.6}
.erm .takeaway-item strong{color:#f8fafc}

.erm .s-end{background:#1e1b4b;justify-content:center;align-items:center}
.erm .end-inner{text-align:center;z-index:1}
.erm .end-inner h1{font-size:78px;font-weight:700;color:#f8fafc;margin-bottom:24px;line-height:1.1}
.erm .end-inner p{font-size:24px;color:#a78bfa;margin-bottom:14px;font-weight:300}
.erm .end-inner .end-note{font-size:16px;color:#6d28d9;margin-top:8px}
`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  // ── 01 TITLE ──────────────────────────────────────────────────────────────
  {
    classes: 's-title',
    label: '01 Title',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="erm-rg1" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="rgba(124,58,237,0.18)"/>
      <stop offset="100%" stop-color="rgba(30,27,75,0)"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#erm-rg1)"/>
  <circle cx="1720" cy="160" r="300" fill="rgba(124,58,237,0.07)"/>
  <circle cx="200" cy="900" r="260" fill="rgba(167,139,250,0.05)"/>
  <text x="1560" y="980" font-size="180" font-weight="800" fill="rgba(167,139,250,0.04)" font-family="'DM Sans',sans-serif" text-anchor="middle">ER→SQL</text>
</svg>
<div class="inner a1">
  <p class="eyebrow">DATABASE MANAGEMENT SYSTEMS · MBI802</p>
  <h1>ER to Relational<br/><span>Schema Mapping</span></h1>
  <div class="amber-bar"></div>
  <p class="sub">Lesson 5 of 5 · Translating ER diagrams into database tables</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 02 AGENDA ─────────────────────────────────────────────────────────────
  {
    classes: 's-agenda',
    label: '02 Agenda',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1820" cy="100" r="350" fill="rgba(124,58,237,0.06)"/>
  <circle cx="100" cy="980" r="260" fill="rgba(167,139,250,0.04)"/>
</svg>
<div class="agenda-inner">
  <p class="eyebrow a1">What you will learn</p>
  <h2 class="a1">What You'll Learn</h2>
  <div class="agenda-cards">
    <div class="agenda-card a2">
      <div class="agenda-num">1</div>
      <div>
        <h3>The Mapping Process</h3>
        <p>ER diagrams → relational model overview — why a deterministic set of rules makes schema design reliable</p>
      </div>
    </div>
    <div class="agenda-card a3">
      <div class="agenda-num">2</div>
      <div>
        <h3>8 Mapping Rules</h3>
        <p>Strong entity, composite attribute, multivalued, 1:N, M:N, 1:1, weak entity, derived attribute</p>
      </div>
    </div>
    <div class="agenda-card a4">
      <div class="agenda-num">3</div>
      <div>
        <h3>Activities</h3>
        <p>Worked university enrolment example + practice exercise (EMPLOYEE–PROJECT) with full answer</p>
      </div>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 03 BIG PICTURE ────────────────────────────────────────────────────────
  {
    classes: 's-bigpic',
    label: '03 The Big Picture',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="960" cy="540" r="600" fill="rgba(124,58,237,0.04)"/>
</svg>
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:60px 80px;gap:40px;z-index:1">
  <div class="a1" style="text-align:center">
    <p style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700;margin-bottom:14px">THE MAPPING PIPELINE</p>
    <h2 style="font-size:52px;font-weight:700;color:#f8fafc">From ER Diagram to Relational Tables</h2>
  </div>
  <div class="a2" style="display:flex;align-items:center;gap:32px;width:100%;max-width:1600px">
    <div style="flex:1;background:#2e1065;border:1.5px solid rgba(167,139,250,.3);border-radius:20px;padding:36px 32px;min-height:320px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:18px">
      <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#a78bfa;font-weight:700">Step 1</div>
      <div style="font-size:26px;font-weight:700;color:#f1f5f9;text-align:center">ER Diagram</div>
      <svg viewBox="0 0 320 200" style="width:280px;height:auto">
        <rect x="90" y="80" width="140" height="50" rx="3" fill="white" stroke="#4c1d95" stroke-width="2.5"/>
        <text x="160" y="110" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#1e1b4b" font-weight="700">STUDENT</text>
        <ellipse cx="60" cy="40" rx="52" ry="22" fill="white" stroke="#64748b" stroke-width="1.5"/>
        <text x="60" y="44" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#334155">StudentId</text>
        <line x1="90" y1="44" x2="115" y2="80" stroke="#94a3b8" stroke-width="1.5"/>
        <ellipse cx="260" cy="40" rx="52" ry="22" fill="white" stroke="#64748b" stroke-width="1.5"/>
        <text x="260" y="44" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#334155">FirstName</text>
        <line x1="236" y1="44" x2="210" y2="80" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="160,155 220,185 160,215 100,185" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
        <text x="160" y="190" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#92400e" font-weight="700">enrols</text>
        <line x1="160" y1="130" x2="160" y2="155" stroke="#94a3b8" stroke-width="1.5"/>
      </svg>
      <p style="font-size:15px;color:#a78bfa;text-align:center;line-height:1.5">Entities, attributes, and relationships drawn using Chen's notation</p>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
      <div style="font-size:48px;color:#7c3aed;font-weight:700">▶</div>
      <div style="font-size:12px;color:#6d28d9;font-weight:600;letter-spacing:.06em;text-transform:uppercase">Apply Rules</div>
    </div>
    <div style="flex:1;background:#2e1065;border:1.5px solid rgba(167,139,250,.3);border-radius:20px;padding:36px 32px;min-height:320px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:14px">
      <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#a78bfa;font-weight:700">Step 2</div>
      <div style="font-size:26px;font-weight:700;color:#f1f5f9;text-align:center">8 Mapping Rules</div>
      <div style="display:flex;flex-direction:column;gap:7px;width:100%">
        ${['1. Strong Entity → Table','2. Composite Attr → Flatten','3. Multivalued → New Table','4. 1:N → FK on N-side','5. M:N → Junction Table','6. 1:1 → FK Choice','7. Weak Entity → Composite PK','8. Derived → Do Not Store'].map(r=>`<div style="padding:7px 14px;background:#1e1040;border-radius:6px;font-size:13px;color:#ddd6fe;font-family:'DM Mono',monospace">${r}</div>`).join('')}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
      <div style="font-size:48px;color:#7c3aed;font-weight:700">▶</div>
      <div style="font-size:12px;color:#6d28d9;font-weight:600;letter-spacing:.06em;text-transform:uppercase">Result</div>
    </div>
    <div style="flex:1;background:#2e1065;border:1.5px solid rgba(167,139,250,.3);border-radius:20px;padding:36px 32px;min-height:320px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:18px">
      <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#a78bfa;font-weight:700">Step 3</div>
      <div style="font-size:26px;font-weight:700;color:#f1f5f9;text-align:center">Relational Tables</div>
      <svg viewBox="0 0 280 210" style="width:260px;height:auto">
        <rect x="10" y="10" width="260" height="36" rx="3" fill="#4c1d95"/>
        <text x="140" y="32" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">STUDENT</text>
        <rect x="10" y="46" width="260" height="30" rx="0" fill="#ede9fe"/>
        <text x="24" y="65" font-family="'DM Mono',monospace" font-size="11" fill="#4c1d95" font-weight="600">🔑 student_id</text>
        <text x="240" y="65" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK</text>
        <rect x="10" y="76" width="260" height="30" fill="white"/>
        <text x="24" y="95" font-family="'DM Mono',monospace" font-size="11" fill="#1e293b">first_name</text>
        <text x="240" y="95" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR</text>
        <rect x="10" y="106" width="260" height="30" fill="#f5f3ff"/>
        <text x="24" y="125" font-family="'DM Mono',monospace" font-size="11" fill="#1e293b">last_name</text>
        <text x="240" y="125" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR</text>
        <rect x="10" y="10" width="260" height="126" rx="3" fill="none" stroke="#7c3aed" stroke-width="1.5"/>
        <rect x="10" y="155" width="260" height="36" rx="3" fill="#4c1d95"/>
        <text x="140" y="177" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">ENROLMENT</text>
        <rect x="10" y="155" width="260" height="50" rx="3" fill="none" stroke="#7c3aed" stroke-width="1.5"/>
      </svg>
      <p style="font-size:15px;color:#a78bfa;text-align:center;line-height:1.5">Clean, normalised SQL tables ready for implementation</p>
    </div>
  </div>
  <div class="a3" style="text-align:center;max-width:1100px">
    <p style="font-size:18px;color:#6d28d9;line-height:1.65">Every construct in an ER diagram maps to a specific relational structure by following deterministic rules.</p>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 04 SECTION BREAK: THE 8 RULES ─────────────────────────────────────────
  {
    classes: 's-sectionbreak',
    label: '04 Section Break — The 8 Rules',
    html: `<div class="sb-watermark">01</div>
<div class="sb-inner a1">
  <p class="sb-eyebrow">THE MAPPING RULES</p>
  <h2>8 Rules to Transform<br/>Any ER Diagram</h2>
  <p>Each rule handles a different ER construct</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 05 RULE 1: STRONG ENTITY ──────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '05 Rule 1 — Strong Entity → Table',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 1</div>
    <h2 class="a1">Strong Entity → Table</h2>
    <p class="concept-desc a2">Each <strong>strong entity</strong> type becomes a <strong>relational table</strong>. Every simple attribute becomes a column. The key attribute becomes the <strong>primary key (PK)</strong>.</p>
    <div class="step-cards a3">
      <div class="step-card">① Entity name → <strong>Table name</strong></div>
      <div class="step-card">② Each attribute → <strong>Column</strong></div>
      <div class="step-card">③ Key attribute → <strong>PRIMARY KEY</strong></div>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 1000 580" style="width:100%;height:100%">
      <!-- ER Side -->
      <text x="210" y="38" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <!-- StudentId key ellipse -->
      <ellipse cx="110" cy="130" rx="72" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="110" y="128" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#1e1b4b" font-weight="600" text-decoration="underline">StudentId</text>
      <line x1="140" y1="150" x2="165" y2="220" stroke="#94a3b8" stroke-width="2"/>
      <!-- FirstName ellipse -->
      <ellipse cx="290" cy="130" rx="62" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="290" y="134" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#334155">FirstName</text>
      <line x1="283" y1="158" x2="250" y2="220" stroke="#94a3b8" stroke-width="2"/>
      <!-- LastName ellipse -->
      <ellipse cx="390" cy="240" rx="58" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="390" y="244" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#334155">LastName</text>
      <line x1="338" y1="248" x2="310" y2="255" stroke="#94a3b8" stroke-width="2"/>
      <!-- DateOfBirth ellipse -->
      <ellipse cx="155" cy="360" rx="72" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="155" y="364" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#334155">DateOfBirth</text>
      <line x1="175" y1="332" x2="200" y2="290" stroke="#94a3b8" stroke-width="2"/>
      <!-- STUDENT entity -->
      <rect x="110" y="220" width="200" height="70" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="210" y="260" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="20" fill="#1e1b4b" font-weight="700">STUDENT</text>
      <!-- Arrow -->
      <text x="475" y="285" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#7c3aed" font-weight="700">Maps to</text>
      <text x="475" y="308" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="24" fill="#7c3aed" font-weight="700">→</text>
      <!-- Table -->
      <text x="740" y="38" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">RELATIONAL TABLE</text>
      <rect x="520" y="170" width="440" height="55" fill="#4c1d95" rx="4"/>
      <text x="740" y="204" text-anchor="middle" font-family="'DM Mono',monospace" font-size="18" fill="white" font-weight="700">STUDENT</text>
      <!-- PK row -->
      <rect x="520" y="225" width="440" height="50" fill="#ede9fe"/>
      <text x="545" y="254" font-family="'DM Mono',monospace" font-size="15" fill="#4c1d95" font-weight="600">🔑 student_id</text>
      <text x="950" y="254" text-anchor="end" font-family="'DM Mono',monospace" font-size="13" fill="#6b7280">INT — PRIMARY KEY</text>
      <!-- Row 2 -->
      <rect x="520" y="275" width="440" height="50" fill="white"/>
      <text x="545" y="304" font-family="'DM Mono',monospace" font-size="15" fill="#1e293b">first_name</text>
      <text x="950" y="304" text-anchor="end" font-family="'DM Mono',monospace" font-size="13" fill="#6b7280">VARCHAR(50)</text>
      <!-- Row 3 -->
      <rect x="520" y="325" width="440" height="50" fill="#f5f3ff"/>
      <text x="545" y="354" font-family="'DM Mono',monospace" font-size="15" fill="#1e293b">last_name</text>
      <text x="950" y="354" text-anchor="end" font-family="'DM Mono',monospace" font-size="13" fill="#6b7280">VARCHAR(50)</text>
      <!-- Row 4 -->
      <rect x="520" y="375" width="440" height="50" fill="white"/>
      <text x="545" y="404" font-family="'DM Mono',monospace" font-size="15" fill="#1e293b">date_of_birth</text>
      <text x="950" y="404" text-anchor="end" font-family="'DM Mono',monospace" font-size="13" fill="#6b7280">DATE</text>
      <!-- Border -->
      <rect x="520" y="170" width="440" height="255" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 06 RULE 2: COMPOSITE ATTRIBUTE ────────────────────────────────────────
  {
    classes: 's-concept',
    label: '06 Rule 2 — Composite Attribute → Flatten',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 2</div>
    <h2 class="a1">Composite Attribute → Flatten</h2>
    <p class="concept-desc a2">A <strong>composite attribute</strong> is NOT stored as a single column. Instead, <strong>each sub-attribute becomes its own column</strong>. The composite parent is discarded — it exists only in the ER diagram, not in the table.</p>
    <div class="warn-card a3"><strong>NEVER</strong> create a column called <code style="background:#5c1a1a;padding:2px 6px;border-radius:4px;font-size:14px">address</code> or <code style="background:#5c1a1a;padding:2px 6px;border-radius:4px;font-size:14px">name</code> if it is composite in the ER diagram. Break it into its parts.</div>
    <div class="example-chips a4">
      <span class="chip">Address → street_name, city, post_code</span>
      <span class="chip">Name → first_name, last_name</span>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 560" style="width:100%;height:100%">
      <!-- ER side: CUSTOMER with Address composite -->
      <text x="200" y="30" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <!-- CUSTOMER entity -->
      <rect x="100" y="200" width="200" height="65" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="200" y="238" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="19" fill="#1e1b4b" font-weight="700">CUSTOMER</text>
      <!-- CustomerId key ellipse -->
      <ellipse cx="200" cy="110" rx="76" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="200" y="107" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#1e1b4b" font-weight="600" text-decoration="underline">CustomerId</text>
      <line x1="200" y1="136" x2="200" y2="200" stroke="#94a3b8" stroke-width="2"/>
      <!-- Address composite ellipse (dashed indicates composite - actually solid but parent) -->
      <ellipse cx="80" cy="350" rx="64" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="80" y="354" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#334155">Address</text>
      <line x1="100" y1="265" x2="104" y2="326" stroke="#94a3b8" stroke-width="2"/>
      <!-- Sub-attributes of Address -->
      <ellipse cx="20" cy="440" rx="58" ry="22" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="20" y="444" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#92400e">StreetName</text>
      <line x1="30" y1="376" x2="26" y2="418" stroke="#94a3b8" stroke-width="1.5"/>
      <ellipse cx="120" cy="440" rx="42" ry="22" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="120" y="444" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#92400e">City</text>
      <line x1="88" y1="374" x2="110" y2="418" stroke="#94a3b8" stroke-width="1.5"/>
      <ellipse cx="206" cy="440" rx="50" ry="22" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="206" y="444" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#92400e">PostCode</text>
      <line x1="120" y1="372" x2="186" y2="418" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Annotation bracket -->
      <text x="115" y="492" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#d97706" font-weight="600">sub-attributes</text>
      <!-- Arrow -->
      <text x="440" y="280" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#7c3aed" font-weight="700">Maps to</text>
      <text x="440" y="310" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#7c3aed" font-weight="700">→</text>
      <text x="440" y="340" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#ef4444" font-weight="700">❌ No 'address' column!</text>
      <!-- Table -->
      <text x="730" y="30" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">RELATIONAL TABLE</text>
      <rect x="530" y="120" width="420" height="48" fill="#4c1d95" rx="4"/>
      <text x="740" y="150" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">CUSTOMER</text>
      <rect x="530" y="168" width="420" height="44" fill="#ede9fe"/>
      <text x="550" y="194" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 customer_id</text>
      <text x="942" y="194" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK</text>
      <rect x="530" y="212" width="420" height="44" fill="white"/>
      <text x="550" y="238" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">street_name</text>
      <text x="942" y="238" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR(100)</text>
      <rect x="530" y="256" width="420" height="44" fill="#f5f3ff"/>
      <text x="550" y="282" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">city</text>
      <text x="942" y="282" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR(60)</text>
      <rect x="530" y="300" width="420" height="44" fill="white"/>
      <text x="550" y="326" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">post_code</text>
      <text x="942" y="326" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR(10)</text>
      <rect x="530" y="120" width="420" height="224" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- Crossed out 'address' column -->
      <rect x="530" y="390" width="420" height="44" fill="#fee2e2" rx="4"/>
      <text x="550" y="416" font-family="'DM Mono',monospace" font-size="13" fill="#ef4444" text-decoration="line-through">address</text>
      <text x="942" y="416" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#ef4444">❌ WRONG</text>
      <line x1="530" y1="412" x2="950" y2="412" stroke="#ef4444" stroke-width="2.5"/>
      <rect x="530" y="390" width="420" height="44" fill="none" stroke="#ef4444" stroke-width="1.5" rx="4"/>
      <!-- Brace annotation -->
      <line x1="952" y1="212" x2="968" y2="212" stroke="#d97706" stroke-width="1.5"/>
      <line x1="952" y1="344" x2="968" y2="344" stroke="#d97706" stroke-width="1.5"/>
      <line x1="968" y1="212" x2="968" y2="344" stroke="#d97706" stroke-width="1.5"/>
      <line x1="968" y1="278" x2="980" y2="278" stroke="#d97706" stroke-width="1.5"/>
      <text x="983" y="270" font-family="'DM Sans',sans-serif" font-size="11" fill="#d97706" font-weight="700">Flattened</text>
      <text x="983" y="284" font-family="'DM Sans',sans-serif" font-size="11" fill="#d97706" font-weight="700">from</text>
      <text x="983" y="298" font-family="'DM Sans',sans-serif" font-size="11" fill="#d97706" font-weight="700">Address</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 07 RULE 3: MULTIVALUED ────────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '07 Rule 3 — Multivalued → New Table',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 3</div>
    <h2 class="a1">Multivalued Attribute → New Table</h2>
    <p class="concept-desc a2">A <strong>multivalued attribute</strong> (drawn as double ellipse) creates a <strong>new table</strong>. The new table has: the multivalued attribute as a column, a foreign key to the original entity, and a composite primary key.</p>
    <div class="step-cards a3">
      <div class="step-card">① Create a new table named after the attribute</div>
      <div class="step-card">② Add the original entity's PK as a <strong>FK</strong></div>
      <div class="step-card">③ PK = <strong>(entity_pk + attribute_value)</strong> — composite</div>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 540" style="width:100%;height:100%">
      <!-- ER side -->
      <text x="190" y="28" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <rect x="90" y="200" width="200" height="65" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="190" y="238" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="19" fill="#1e1b4b" font-weight="700">MEMBER</text>
      <ellipse cx="190" cy="110" rx="72" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="190" y="107" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#1e1b4b" font-weight="600" text-decoration="underline">MemberId</text>
      <line x1="190" y1="136" x2="190" y2="200" stroke="#94a3b8" stroke-width="2"/>
      <!-- Double ellipse for PhoneNumber -->
      <ellipse cx="320" cy="340" rx="86" ry="34" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" stroke-width="2.5"/>
      <ellipse cx="320" cy="340" rx="72" ry="24" fill="#2e1065" stroke="#a78bfa" stroke-width="2"/>
      <text x="320" y="344" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#ddd6fe" font-weight="600">{PhoneNumber}</text>
      <line x1="240" y1="262" x2="296" y2="308" stroke="#a78bfa" stroke-width="2"/>
      <!-- Arrow -->
      <text x="480" y="275" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#7c3aed" font-weight="700">Maps to</text>
      <text x="480" y="300" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#7c3aed" font-weight="700">→</text>
      <!-- MEMBER table -->
      <rect x="560" y="100" width="380" height="44" fill="#4c1d95" rx="4"/>
      <text x="750" y="127" text-anchor="middle" font-family="'DM Mono',monospace" font-size="15" fill="white" font-weight="700">MEMBER</text>
      <rect x="560" y="144" width="380" height="40" fill="#ede9fe"/>
      <text x="576" y="168" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 member_id</text>
      <text x="932" y="168" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK</text>
      <rect x="560" y="184" width="380" height="40" fill="white"/>
      <text x="576" y="208" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">member_name</text>
      <text x="932" y="208" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR</text>
      <rect x="560" y="100" width="380" height="124" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK arrow between tables -->
      <line x1="750" y1="370" x2="750" y2="340" stroke="#0d9488" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#ermArrow)"/>
      <line x1="750" y1="228" x2="750" y2="300" stroke="#0d9488" stroke-width="2" stroke-dasharray="6,3"/>
      <text x="758" y="268" font-family="'DM Sans',sans-serif" font-size="11" fill="#0d9488">FK ref</text>
      <!-- MEMBER_PHONE table -->
      <rect x="560" y="340" width="380" height="44" fill="#4c1d95" rx="4"/>
      <text x="750" y="367" text-anchor="middle" font-family="'DM Mono',monospace" font-size="15" fill="white" font-weight="700">MEMBER_PHONE</text>
      <rect x="560" y="384" width="380" height="40" fill="#ede9fe"/>
      <text x="576" y="408" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑🔗 member_id</text>
      <text x="932" y="408" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK+FK</text>
      <rect x="560" y="424" width="380" height="40" fill="#f5f3ff"/>
      <text x="576" y="448" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 phone_number</text>
      <text x="932" y="448" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR PK</text>
      <rect x="560" y="340" width="380" height="124" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- Label -->
      <rect x="558" y="480" width="384" height="36" rx="6" fill="#1e1040"/>
      <text x="750" y="503" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa">PK = (member_id + phone_number) — composite</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 08 RULE 4: 1:N ────────────────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '08 Rule 4 — 1:N Relationship → FK',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 4</div>
    <h2 class="a1">1:N Relationship → FK on N-side</h2>
    <p class="concept-desc a2">In a 1:N relationship, the <strong>primary key of the '1' entity</strong> is added as a <strong>foreign key in the 'N' entity's table</strong>. No new table is needed.</p>
    <div class="tip-card a3">Memory tip: The FK always goes to the <strong>MANY side</strong> — where there are many instances, each pointing back to one.</div>
    <div class="example-rows a4">
      <div class="ex-row">DEPARTMENT (1) ── employs ──► EMPLOYEE (N)<br/><span style="color:#0d9488;font-size:13px;margin-top:4px;display:block">→ dept_id FK added to EMPLOYEE table</span></div>
      <div class="ex-row">CUSTOMER (1) ── places ──► ORDER (N)<br/><span style="color:#0d9488;font-size:13px;margin-top:4px;display:block">→ customer_id FK added to ORDER table</span></div>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 560" style="width:100%;height:100%">
      <!-- ER diagram top -->
      <text x="370" y="28" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <rect x="30" y="160" width="190" height="62" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="125" y="196" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">DEPARTMENT</text>
      <line x1="220" y1="191" x2="268" y2="191" stroke="#94a3b8" stroke-width="2"/>
      <text x="258" y="184" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">1</text>
      <polygon points="340,163 420,191 340,219 260,191" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="340" y="196" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#92400e" font-weight="700">employs</text>
      <line x1="420" y1="191" x2="466" y2="191" stroke="#94a3b8" stroke-width="2"/>
      <text x="428" y="184" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">N</text>
      <rect x="466" y="160" width="190" height="62" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="561" y="196" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">EMPLOYEE</text>
      <!-- Arrow down -->
      <text x="370" y="270" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#7c3aed" font-weight="700">Maps to ▼</text>
      <!-- DEPARTMENT table -->
      <rect x="30" y="310" width="380" height="44" fill="#4c1d95" rx="4"/>
      <text x="220" y="337" text-anchor="middle" font-family="'DM Mono',monospace" font-size="15" fill="white" font-weight="700">DEPARTMENT</text>
      <rect x="30" y="354" width="380" height="40" fill="#ede9fe"/>
      <text x="48" y="378" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 dept_id</text>
      <text x="402" y="378" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK</text>
      <rect x="30" y="394" width="380" height="40" fill="white"/>
      <text x="48" y="418" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">dept_name</text>
      <text x="402" y="418" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR(80)</text>
      <rect x="30" y="310" width="380" height="124" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- EMPLOYEE table -->
      <rect x="560" y="310" width="400" height="44" fill="#4c1d95" rx="4"/>
      <text x="760" y="337" text-anchor="middle" font-family="'DM Mono',monospace" font-size="15" fill="white" font-weight="700">EMPLOYEE</text>
      <rect x="560" y="354" width="400" height="40" fill="#ede9fe"/>
      <text x="578" y="378" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 employee_id</text>
      <text x="952" y="378" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT PK</text>
      <rect x="560" y="394" width="400" height="40" fill="white"/>
      <text x="578" y="418" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">first_name</text>
      <text x="952" y="418" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR</text>
      <rect x="560" y="434" width="400" height="40" fill="#e0f2fe"/>
      <text x="578" y="458" font-family="'DM Mono',monospace" font-size="13" fill="#0369a1" font-weight="600">🔗 dept_id</text>
      <text x="952" y="458" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#0369a1">INT FK → DEPARTMENT</text>
      <rect x="560" y="310" width="400" height="164" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK arrow -->
      <line x1="410" y1="362" x2="558" y2="452" stroke="#0d9488" stroke-width="2" stroke-dasharray="7,4"/>
      <text x="484" y="415" font-family="'DM Sans',sans-serif" font-size="12" fill="#0d9488" font-weight="600">FK ref</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 09 RULE 5: M:N ────────────────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '09 Rule 5 — M:N → Junction Table',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 5</div>
    <h2 class="a1">M:N Relationship → Junction Table</h2>
    <p class="concept-desc a2">A <strong>many-to-many relationship</strong> cannot be represented with a single FK. Instead, create a <strong>new junction (bridge) table</strong> containing the PKs of BOTH entities as foreign keys. Relationship attributes become columns in this table.</p>
    <div class="step-card a3" style="margin-bottom:12px">The junction table's PK is typically the <strong>combination of both FKs</strong> (composite PK).</div>
    <div class="tip-card a3">Example: STUDENT enrolls in MODULE — the Grade attribute belongs to the ENROLMENT junction table, not to STUDENT or MODULE alone.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 540" style="width:100%;height:100%">
      <!-- ER diagram -->
      <text x="370" y="26" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <rect x="20" y="130" width="170" height="58" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="105" y="164" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">STUDENT</text>
      <line x1="190" y1="159" x2="238" y2="159" stroke="#94a3b8" stroke-width="2"/>
      <text x="228" y="152" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">M</text>
      <polygon points="310,131 390,159 310,187 230,159" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="310" y="154" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#92400e" font-weight="700">enrols_in</text>
      <text x="310" y="168" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="#92400e">Grade ◆</text>
      <line x1="390" y1="159" x2="438" y2="159" stroke="#94a3b8" stroke-width="2"/>
      <text x="398" y="152" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">N</text>
      <rect x="438" y="130" width="170" height="58" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="523" y="164" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">MODULE</text>
      <!-- Arrow -->
      <text x="370" y="232" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#7c3aed" font-weight="700">Maps to ▼  (3 tables)</text>
      <!-- STUDENT table -->
      <rect x="20" y="268" width="270" height="40" fill="#4c1d95" rx="4"/>
      <text x="155" y="292" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">STUDENT</text>
      <rect x="20" y="308" width="270" height="36" fill="#ede9fe"/>
      <text x="36" y="330" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 student_id</text>
      <text x="282" y="330" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK</text>
      <rect x="20" y="344" width="270" height="36" fill="white"/>
      <text x="36" y="366" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">first_name</text>
      <rect x="20" y="268" width="270" height="112" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- MODULE table -->
      <rect x="680" y="268" width="280" height="40" fill="#4c1d95" rx="4"/>
      <text x="820" y="292" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">MODULE</text>
      <rect x="680" y="308" width="280" height="36" fill="#ede9fe"/>
      <text x="696" y="330" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 module_code</text>
      <text x="952" y="330" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR PK</text>
      <rect x="680" y="344" width="280" height="36" fill="white"/>
      <text x="696" y="366" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">module_name</text>
      <rect x="680" y="268" width="280" height="112" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- ENROLMENT table (junction) -->
      <rect x="310" y="370" width="360" height="40" fill="#4c1d95" rx="4"/>
      <text x="490" y="394" text-anchor="middle" font-family="'DM Mono',monospace" font-size="13" fill="white" font-weight="700">ENROLMENT</text>
      <rect x="310" y="410" width="360" height="36" fill="#ede9fe"/>
      <text x="326" y="432" font-family="'DM Mono',monospace" font-size="12" fill="#0369a1" font-weight="600">🔑🔗 student_id</text>
      <text x="662" y="432" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#0369a1">INT PK+FK</text>
      <rect x="310" y="446" width="360" height="36" fill="#f5f3ff"/>
      <text x="326" y="468" font-family="'DM Mono',monospace" font-size="12" fill="#0369a1" font-weight="600">🔑🔗 module_code</text>
      <text x="662" y="468" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#0369a1">VARCHAR PK+FK</text>
      <rect x="310" y="482" width="360" height="36" fill="white"/>
      <text x="326" y="504" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">grade</text>
      <text x="662" y="504" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">DECIMAL(4,2)</text>
      <rect x="310" y="370" width="360" height="148" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK arrows -->
      <line x1="155" y1="380" x2="350" y2="420" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="5,3"/>
      <line x1="820" y1="380" x2="640" y2="420" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="5,3"/>
      <!-- Label -->
      <rect x="380" y="528" width="220" height="24" rx="4" fill="#1e1040"/>
      <text x="490" y="544" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#a78bfa">Junction table resolves M:N</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 10 RULE 6: 1:1 ────────────────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '10 Rule 6 — 1:1 Relationship → FK Choice',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 6</div>
    <h2 class="a1">1:1 Relationship → FK Choice</h2>
    <p class="concept-desc a2">In a 1:1 relationship, add the FK in <strong>either table</strong>. Best practice: put the FK on the <strong>total-participation side</strong> (mandatory side), or the side that 'belongs to' the other. Alternatively, merge both entities into one table if they always co-exist.</p>
    <div class="step-cards a3">
      <div class="step-card"><strong>Option A:</strong> Add FK in the total-participation side table</div>
      <div class="step-card"><strong>Option B:</strong> Merge both entities into one table (if always co-exist)</div>
    </div>
    <div class="tip-card a4">Example: EMPLOYEE (1) ── assigned ── (1) COMPANY_CAR. Not every employee has a car, but every company car is assigned to one employee → put employee_id FK in COMPANY_CAR table (total participation side).</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 520" style="width:100%;height:100%">
      <!-- ER -->
      <text x="370" y="26" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <rect x="20" y="120" width="190" height="60" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="115" y="155" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">EMPLOYEE</text>
      <line x1="210" y1="150" x2="256" y2="150" stroke="#94a3b8" stroke-width="2"/>
      <text x="246" y="142" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">1</text>
      <polygon points="328,122 408,150 328,178 248,150" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="328" y="155" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#92400e" font-weight="700">assigned</text>
      <line x1="408" y1="150" x2="452" y2="150" stroke="#94a3b8" stroke-width="2"/>
      <text x="414" y="142" font-family="'DM Sans',sans-serif" font-size="20" fill="#d97706" font-weight="700">1</text>
      <rect x="452" y="120" width="220" height="60" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="562" y="148" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#1e1b4b" font-weight="700">COMPANY_CAR</text>
      <text x="562" y="168" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#6d28d9">(total participation)</text>
      <!-- double line on car side to indicate total participation -->
      <line x1="452" y1="143" x2="412" y2="151" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="455" y1="157" x2="412" y2="151" stroke="#94a3b8" stroke-width="2.5"/>
      <!-- Arrow -->
      <text x="370" y="226" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#7c3aed" font-weight="700">Option A: FK on COMPANY_CAR side ▼</text>
      <!-- EMPLOYEE table -->
      <rect x="20" y="258" width="320" height="40" fill="#4c1d95" rx="4"/>
      <text x="180" y="282" text-anchor="middle" font-family="'DM Mono',monospace" font-size="14" fill="white" font-weight="700">EMPLOYEE</text>
      <rect x="20" y="298" width="320" height="38" fill="#ede9fe"/>
      <text x="36" y="321" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 employee_id</text>
      <text x="332" y="321" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK</text>
      <rect x="20" y="336" width="320" height="38" fill="white"/>
      <text x="36" y="359" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">employee_name</text>
      <rect x="20" y="258" width="320" height="116" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- COMPANY_CAR table -->
      <rect x="560" y="258" width="400" height="40" fill="#4c1d95" rx="4"/>
      <text x="760" y="282" text-anchor="middle" font-family="'DM Mono',monospace" font-size="14" fill="white" font-weight="700">COMPANY_CAR</text>
      <rect x="560" y="298" width="400" height="38" fill="#ede9fe"/>
      <text x="576" y="321" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 car_reg</text>
      <text x="952" y="321" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR PK</text>
      <rect x="560" y="336" width="400" height="38" fill="white"/>
      <text x="576" y="359" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">car_model</text>
      <rect x="560" y="374" width="400" height="38" fill="#e0f2fe"/>
      <text x="576" y="397" font-family="'DM Mono',monospace" font-size="12" fill="#0369a1" font-weight="600">🔗 employee_id</text>
      <text x="952" y="397" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#0369a1">INT FK → EMPLOYEE</text>
      <rect x="560" y="258" width="400" height="154" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK line -->
      <line x1="340" y1="316" x2="558" y2="392" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="6,3"/>
      <text x="448" y="356" font-family="'DM Sans',sans-serif" font-size="12" fill="#0d9488">FK ref</text>
      <!-- Option B note -->
      <rect x="20" y="440" width="940" height="48" rx="8" fill="#1e1040"/>
      <text x="480" y="462" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#a78bfa" font-weight="700">Option B: Merge into one table → EMPLOYEE_CAR(employee_id PK, employee_name, car_reg, car_model)</text>
      <text x="480" y="480" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#6d28d9">Use only when every employee ALWAYS has a car (both sides are total participation)</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 11 RULE 7: WEAK ENTITY ────────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '11 Rule 7 — Weak Entity → Composite PK',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Mapping Rules</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Rule 7</div>
    <h2 class="a1">Weak Entity → Composite PK</h2>
    <p class="concept-desc a2">A <strong>weak entity</strong> becomes a table with a <strong>composite primary key</strong> = the partial key (discriminator) + the identifying entity's PK (as FK). The identifying entity's PK serves double duty as both FK and part of PK.</p>
    <div class="step-cards a3">
      <div class="step-card">① Identifying entity's PK → column in weak entity table (as FK)</div>
      <div class="step-card">② Partial key → column in weak entity table</div>
      <div class="step-card">③ PK of new table = <strong>(identifying_pk + partial_key)</strong></div>
    </div>
    <div class="tip-card a4">ROOM (partial key: RoomNo) identified by BUILDING (PK: BuildingId) → ROOM table PK = (building_id, room_no)</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 520" style="width:100%;height:100%">
      <!-- ER diagram -->
      <text x="370" y="26" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="2">ER DIAGRAM</text>
      <!-- BUILDING (strong) -->
      <rect x="20" y="130" width="190" height="60" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
      <text x="115" y="165" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">BUILDING</text>
      <!-- BuildingId ellipse (key) -->
      <ellipse cx="115" cy="56" rx="76" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="115" y="53" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#1e1b4b" font-weight="600" text-decoration="underline">BuildingId</text>
      <line x1="115" y1="82" x2="115" y2="130" stroke="#94a3b8" stroke-width="2"/>
      <!-- double diamond -->
      <line x1="210" y1="160" x2="260" y2="160" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="332,128 412,160 332,192 252,160" fill="none" stroke="#d97706" stroke-width="3"/>
      <polygon points="332,140 400,160 332,180 264,160" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="332" y="165" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#92400e" font-weight="700">located_in</text>
      <line x1="412" y1="160" x2="460" y2="160" stroke="#94a3b8" stroke-width="2"/>
      <!-- ROOM (weak, double rect) -->
      <rect x="458" y="126" width="200" height="68" rx="4" fill="none" stroke="#4c1d95" stroke-width="3"/>
      <rect x="468" y="136" width="180" height="48" rx="3" fill="white" stroke="#4c1d95" stroke-width="1.5"/>
      <text x="558" y="165" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#1e1b4b" font-weight="700">ROOM</text>
      <!-- RoomNo (partial key, dashed underline) -->
      <ellipse cx="558" cy="56" rx="68" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="558" y="53" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#334155">RoomNo</text>
      <line x1="504" y1="62" x2="612" y2="62" stroke="#334155" stroke-width="1.5" stroke-dasharray="5,3"/>
      <line x1="558" y1="82" x2="558" y2="126" stroke="#94a3b8" stroke-width="2"/>
      <!-- Arrow -->
      <text x="370" y="240" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#7c3aed" font-weight="700">Maps to ▼</text>
      <!-- BUILDING table -->
      <rect x="20" y="270" width="360" height="40" fill="#4c1d95" rx="4"/>
      <text x="200" y="294" text-anchor="middle" font-family="'DM Mono',monospace" font-size="14" fill="white" font-weight="700">BUILDING</text>
      <rect x="20" y="310" width="360" height="38" fill="#ede9fe"/>
      <text x="36" y="333" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 building_id</text>
      <text x="372" y="333" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK</text>
      <rect x="20" y="348" width="360" height="38" fill="white"/>
      <text x="36" y="371" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">building_name</text>
      <rect x="20" y="270" width="360" height="116" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- ROOM table -->
      <rect x="560" y="270" width="400" height="40" fill="#4c1d95" rx="4"/>
      <text x="760" y="294" text-anchor="middle" font-family="'DM Mono',monospace" font-size="14" fill="white" font-weight="700">ROOM</text>
      <rect x="560" y="310" width="400" height="38" fill="#ede9fe"/>
      <text x="576" y="333" font-family="'DM Mono',monospace" font-size="12" fill="#0369a1" font-weight="600">🔑🔗 building_id</text>
      <text x="952" y="333" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#0369a1">INT PK + FK</text>
      <rect x="560" y="348" width="400" height="38" fill="#f5f3ff"/>
      <text x="576" y="371" font-family="'DM Mono',monospace" font-size="12" fill="#4c1d95" font-weight="600">🔑 room_no</text>
      <text x="952" y="371" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">INT PK (partial key)</text>
      <rect x="560" y="386" width="400" height="38" fill="white"/>
      <text x="576" y="409" font-family="'DM Mono',monospace" font-size="12" fill="#1e293b">room_type</text>
      <text x="952" y="409" text-anchor="end" font-family="'DM Mono',monospace" font-size="10" fill="#6b7280">VARCHAR</text>
      <rect x="560" y="270" width="400" height="154" fill="none" stroke="#7c3aed" stroke-width="1.5" rx="4"/>
      <!-- FK arrow -->
      <line x1="380" y1="320" x2="558" y2="330" stroke="#0d9488" stroke-width="1.5" stroke-dasharray="6,3"/>
      <!-- PK annotation -->
      <rect x="560" y="434" width="400" height="36" rx="6" fill="#1e1040"/>
      <text x="760" y="456" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#a78bfa">PK = (building_id, room_no) — composite</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 12 RULE 8: DERIVED ATTRIBUTE ──────────────────────────────────────────
  {
    classes: 's-concept',
    label: '12 Rule 8 — Derived Attribute → Do Not Store',
    html: `<div style="padding:48px 100px 0;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700;margin-bottom:10px">Mapping Rules</div>
  <div style="display:flex;align-items:baseline;gap:20px">
    <div style="display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:#4c1d95;color:#ddd6fe">Rule 8</div>
    <h2 style="font-size:48px;font-weight:700;color:#f1f5f9">Derived Attribute → Do NOT Store</h2>
  </div>
</div>
<div style="flex:1;padding:32px 100px 60px;display:flex;gap:40px;align-items:stretch">
  <div style="flex:1;display:flex;flex-direction:column;gap:20px">
    <p style="font-size:20px;color:#c4b5fd;line-height:1.7">Derived attributes (dashed ellipse in Chen's notation) are <strong style="color:#f1f5f9">calculated from other data</strong>. They should <strong style="color:#f1f5f9">NOT be stored</strong> as columns — they become stale and waste storage. Compute them in queries instead.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1">
      <div style="background:#450a0a;border:1.5px solid #ef4444;border-radius:14px;padding:28px;display:flex;flex-direction:column;gap:12px">
        <div style="font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ef4444">❌ WRONG</div>
        <div style="font-family:'DM Mono',monospace;font-size:16px;color:#fca5a5;background:#3b0000;padding:14px;border-radius:8px">age INT</div>
        <p style="font-size:16px;color:#fca5a5;line-height:1.55">Becomes stale the next birthday. You would need to update every row every day — impossible at scale.</p>
      </div>
      <div style="background:#052e16;border:1.5px solid #22c55e;border-radius:14px;padding:28px;display:flex;flex-direction:column;gap:12px">
        <div style="font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#22c55e">✅ CORRECT</div>
        <div style="font-family:'DM Mono',monospace;font-size:12px;color:#86efac;background:#021a0e;padding:14px;border-radius:8px;line-height:1.7">SELECT<br/>  DATEDIFF(YEAR,<br/>    date_of_birth,<br/>    GETDATE()) AS age<br/>FROM EMPLOYEE</div>
        <p style="font-size:16px;color:#86efac;line-height:1.55">Always accurate. Computed at query time from the stored date_of_birth column.</p>
      </div>
    </div>
    <div style="background:#1e1040;border-radius:10px;padding:18px 24px;border-left:4px solid #7c3aed">
      <p style="font-size:16px;color:#a78bfa;line-height:1.6">Note: Some modern systems support <strong style="color:#ddd6fe">computed/virtual columns</strong> that are calculated automatically. The default mapping rule is still to omit derived attributes from the schema.</p>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 13 SECTION BREAK: WORKED EXAMPLE ─────────────────────────────────────
  {
    classes: 's-sectionbreak',
    label: '13 Section — Worked Example',
    html: `<div class="sb-watermark">02</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">WORKED EXAMPLE</p>
  <h2 class="a2">University Enrolment System</h2>
  <p class="a3" style="font-size:22px;color:rgba(255,255,255,.38);font-weight:300;margin-top:16px">Mapping a complete ER diagram step by step</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 14 UNIVERSITY ER DIAGRAM ──────────────────────────────────────────────
  {
    classes: '',
    label: '14 University ER Diagram',
    html: `<div style="position:absolute;inset:0;background:#0f172a"></div>
<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 1920 1080" font-family="'DM Sans',sans-serif">
  <text x="960" y="68" text-anchor="middle" font-size="22" font-weight="700" fill="#a78bfa" letter-spacing="0.14em">UNIVERSITY ENROLMENT — ER DIAGRAM</text>

  <!-- STUDENT entity -->
  <rect x="155" y="464" width="210" height="72" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
  <text x="260" y="506" text-anchor="middle" font-size="22" font-weight="700" fill="#1e1b4b">STUDENT</text>

  <!-- STUDENT key attribute: StudentId -->
  <line x1="210" y1="464" x2="162" y2="380" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="140" cy="358" rx="80" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="140" y="355" text-anchor="middle" font-size="14" fill="#1e1b4b" font-weight="600" text-decoration="underline">StudentId</text>

  <!-- STUDENT: FirstName -->
  <line x1="275" y1="464" x2="295" y2="380" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="308" cy="357" rx="70" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="308" y="362" text-anchor="middle" font-size="14" fill="#374151">FirstName</text>

  <!-- STUDENT: DateOfBirth -->
  <line x1="165" y1="520" x2="90" y2="520" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="38" cy="520" rx="62" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="38" y="525" text-anchor="middle" font-size="13" fill="#374151">DateOfBirth</text>

  <!-- STUDENT: Address composite -->
  <line x1="230" y1="536" x2="220" y2="610" stroke="#0f766e" stroke-width="1.5"/>
  <ellipse cx="220" cy="638" rx="80" ry="30" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
  <text x="220" y="644" text-anchor="middle" font-size="14" font-weight="700" fill="#0f766e">Address</text>
  <line x1="168" y1="662" x2="108" y2="706" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="76" cy="726" rx="66" ry="24" fill="#e6faf8" stroke="#0f766e" stroke-width="1.5"/>
  <text x="76" y="731" text-anchor="middle" font-size="12" fill="#065f46">StreetName</text>
  <line x1="220" y1="668" x2="220" y2="712" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="220" cy="734" rx="46" ry="22" fill="#e6faf8" stroke="#0f766e" stroke-width="1.5"/>
  <text x="220" y="739" text-anchor="middle" font-size="12" fill="#065f46">City</text>
  <line x1="272" y1="662" x2="332" y2="706" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="364" cy="726" rx="66" ry="24" fill="#e6faf8" stroke="#0f766e" stroke-width="1.5"/>
  <text x="364" y="731" text-anchor="middle" font-size="12" fill="#065f46">PostCode</text>

  <!-- enrols_in diamond -->
  <polygon points="640,432 756,500 640,568 524,500" fill="#1e1040" stroke="#d97706" stroke-width="3"/>
  <text x="640" y="507" text-anchor="middle" font-size="17" font-weight="700" fill="#fbbf24">enrols_in</text>

  <!-- Grade relationship attribute -->
  <line x1="640" y1="432" x2="640" y2="385" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,3"/>
  <ellipse cx="640" cy="360" rx="54" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="640" y="365" text-anchor="middle" font-size="14" fill="#374151">Grade</text>

  <!-- STUDENT ══ enrols_in (total participation) -->
  <line x1="365" y1="497" x2="524" y2="497" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="365" y1="503" x2="524" y2="503" stroke="#16a34a" stroke-width="2.5"/>
  <text x="444" y="484" text-anchor="middle" font-size="22" font-weight="700" fill="#16a34a">M</text>

  <!-- enrols_in ── MODULE (partial participation) -->
  <line x1="756" y1="500" x2="955" y2="500" stroke="#94a3b8" stroke-width="2"/>
  <text x="856" y="484" text-anchor="middle" font-size="22" font-weight="700" fill="#374151">N</text>

  <!-- MODULE entity -->
  <rect x="955" y="464" width="210" height="72" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
  <text x="1060" y="506" text-anchor="middle" font-size="22" font-weight="700" fill="#1e1b4b">MODULE</text>

  <!-- MODULE: ModuleCode (key) -->
  <line x1="1008" y1="464" x2="960" y2="382" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="938" cy="360" rx="78" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="938" y="357" text-anchor="middle" font-size="14" fill="#1e1b4b" font-weight="600" text-decoration="underline">ModuleCode</text>

  <!-- MODULE: ModuleName -->
  <line x1="1100" y1="464" x2="1130" y2="382" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1150" cy="360" rx="74" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1150" y="365" text-anchor="middle" font-size="14" fill="#374151">ModuleName</text>

  <!-- MODULE: Credits -->
  <line x1="1165" y1="490" x2="1230" y2="490" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1286" cy="490" rx="56" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1286" y="495" text-anchor="middle" font-size="14" fill="#374151">Credits</text>

  <!-- belongs_to diamond -->
  <polygon points="1380,432 1496,500 1380,568 1264,500" fill="#1e1040" stroke="#d97706" stroke-width="3"/>
  <text x="1380" y="507" text-anchor="middle" font-size="16" font-weight="700" fill="#fbbf24">belongs_to</text>

  <!-- MODULE ══ belongs_to (total) -->
  <line x1="1165" y1="497" x2="1264" y2="497" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="1165" y1="503" x2="1264" y2="503" stroke="#16a34a" stroke-width="2.5"/>
  <text x="1214" y="484" text-anchor="middle" font-size="22" font-weight="700" fill="#16a34a">N</text>

  <!-- belongs_to ── DEPARTMENT (partial) -->
  <line x1="1496" y1="500" x2="1580" y2="500" stroke="#94a3b8" stroke-width="2"/>
  <text x="1538" y="484" text-anchor="middle" font-size="22" font-weight="700" fill="#374151">1</text>

  <!-- DEPARTMENT entity -->
  <rect x="1580" y="464" width="240" height="72" rx="4" fill="white" stroke="#4c1d95" stroke-width="3"/>
  <text x="1700" y="506" text-anchor="middle" font-size="22" font-weight="700" fill="#1e1b4b">DEPARTMENT</text>

  <!-- DEPARTMENT: DeptId (key) -->
  <line x1="1640" y1="464" x2="1610" y2="382" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1594" cy="360" rx="64" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1594" y="357" text-anchor="middle" font-size="14" fill="#1e1b4b" font-weight="600" text-decoration="underline">DeptId</text>

  <!-- DEPARTMENT: DeptName -->
  <line x1="1780" y1="464" x2="1820" y2="384" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1840" cy="362" rx="70" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1840" y="367" text-anchor="middle" font-size="14" fill="#374151">DeptName</text>

  <!-- Legend -->
  <rect x="700" y="730" width="520" height="174" rx="12" fill="rgba(30,27,75,0.85)" stroke="rgba(167,139,250,0.25)" stroke-width="1"/>
  <text x="960" y="762" text-anchor="middle" font-size="13" font-weight="700" fill="#a78bfa" letter-spacing="0.12em">LEGEND</text>
  <line x1="728" y1="788" x2="784" y2="788" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="728" y1="794" x2="784" y2="794" stroke="#16a34a" stroke-width="2.5"/>
  <text x="798" y="795" font-size="14" fill="#e2e8f0">Double line = Total participation (mandatory)</text>
  <line x1="728" y1="822" x2="784" y2="822" stroke="#94a3b8" stroke-width="2"/>
  <text x="798" y="828" font-size="14" fill="#e2e8f0">Single line = Partial participation (optional)</text>
  <ellipse cx="756" cy="860" rx="46" ry="18" fill="#f0fdfa" stroke="#0f766e" stroke-width="2"/>
  <text x="756" y="865" text-anchor="middle" font-size="11" fill="#065f46">Composite</text>
  <text x="798" y="865" font-size="14" fill="#e2e8f0">= Composite attribute (flattened in SQL)</text>
  <line x1="728" y1="894" x2="784" y2="894" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="798" y="899" font-size="14" fill="#e2e8f0">Dashed line = Relationship attribute (Grade)</text>
</svg>
<div class="cr" style="color:rgba(255,255,255,.25);z-index:10;position:absolute">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 15 STEP 1: MAP ENTITIES ───────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '15 Step 1 — Map Entities to Tables',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Worked Example · Step 1 of 2</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Step 1</div>
    <h2 class="a1">Map Each Entity to a Table</h2>
    <p class="concept-desc a2">Apply <strong>Rule 1</strong> to all three entities. Each becomes a table; each attribute becomes a column; key attributes become primary keys.</p>
    <div class="step-cards a3">
      <div class="step-card">STUDENT → <strong>student</strong> table (7 columns incl. Address sub-attrs)</div>
      <div class="step-card">MODULE → <strong>module</strong> table (3 columns)</div>
      <div class="step-card">DEPARTMENT → <strong>department</strong> table (2 columns)</div>
    </div>
    <div class="tip-card a4">Address is composite → <strong>flatten</strong> to street_name, city, post_code columns. No "address" column is created.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 960 760" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- STUDENT table -->
      <rect x="10" y="20" width="290" height="44" rx="4" fill="#4c1d95"/>
      <text x="155" y="47" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">STUDENT</text>
      <rect x="10" y="64" width="290" height="40" fill="#ede9fe"/>
      <text x="25" y="89" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 student_id</text>
      <text x="294" y="89" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT  PK</text>
      <rect x="10" y="104" width="290" height="36" fill="white"/>
      <text x="25" y="127" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">first_name</text>
      <text x="294" y="127" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(50)</text>
      <rect x="10" y="140" width="290" height="36" fill="#f5f3ff"/>
      <text x="25" y="163" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">last_name</text>
      <text x="294" y="163" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(50)</text>
      <rect x="10" y="176" width="290" height="36" fill="white"/>
      <text x="25" y="199" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">date_of_birth</text>
      <text x="294" y="199" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">DATE</text>
      <rect x="10" y="212" width="290" height="36" fill="#ecfdf5"/>
      <text x="25" y="235" font-family="'DM Mono',monospace" font-size="13" fill="#065f46">street_name</text>
      <text x="294" y="235" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(80)</text>
      <rect x="10" y="248" width="290" height="36" fill="white"/>
      <text x="25" y="271" font-family="'DM Mono',monospace" font-size="13" fill="#065f46">city</text>
      <text x="294" y="271" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(50)</text>
      <rect x="10" y="284" width="290" height="36" fill="#ecfdf5"/>
      <text x="25" y="307" font-family="'DM Mono',monospace" font-size="13" fill="#065f46">post_code</text>
      <text x="294" y="307" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(10)</text>
      <rect x="10" y="20" width="290" height="300" rx="4" fill="none" stroke="#7c3aed" stroke-width="1.5"/>
      <text x="155" y="340" text-anchor="middle" font-size="12" fill="#0f766e">⤴ Address flattened → 3 columns</text>

      <!-- MODULE table -->
      <rect x="330" y="20" width="280" height="44" rx="4" fill="#4c1d95"/>
      <text x="470" y="47" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">MODULE</text>
      <rect x="330" y="64" width="280" height="40" fill="#ede9fe"/>
      <text x="345" y="89" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 module_code</text>
      <text x="604" y="89" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR PK</text>
      <rect x="330" y="104" width="280" height="36" fill="white"/>
      <text x="345" y="127" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">module_name</text>
      <text x="604" y="127" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(100)</text>
      <rect x="330" y="140" width="280" height="36" fill="#f5f3ff"/>
      <text x="345" y="163" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">credits</text>
      <text x="604" y="163" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">INT</text>
      <rect x="330" y="176" width="280" height="36" fill="#fef9c3"/>
      <text x="345" y="199" font-family="'DM Mono',monospace" font-size="12" fill="#92400e" font-style="italic">dept_id  ← added in Step 2</text>
      <rect x="330" y="20" width="280" height="192" rx="4" fill="none" stroke="#7c3aed" stroke-width="1.5"/>

      <!-- DEPARTMENT table -->
      <rect x="640" y="20" width="290" height="44" rx="4" fill="#4c1d95"/>
      <text x="785" y="47" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">DEPARTMENT</text>
      <rect x="640" y="64" width="290" height="40" fill="#ede9fe"/>
      <text x="655" y="89" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 dept_id</text>
      <text x="924" y="89" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">INT  PK</text>
      <rect x="640" y="104" width="290" height="36" fill="white"/>
      <text x="655" y="127" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">dept_name</text>
      <text x="924" y="127" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">VARCHAR(80)</text>
      <rect x="640" y="20" width="290" height="120" rx="4" fill="none" stroke="#7c3aed" stroke-width="1.5"/>

      <!-- Divider label -->
      <text x="480" y="420" text-anchor="middle" font-size="14" fill="#6d28d9" font-weight="600">Step 2 will add ENROLMENT junction table + dept_id FK to MODULE</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 16 STEP 2: MAP RELATIONSHIPS ─────────────────────────────────────────
  {
    classes: 's-concept',
    label: '16 Step 2 — Map Relationships',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa;font-weight:700">Worked Example · Step 2 of 2</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Step 2</div>
    <h2 class="a1">Map the Relationships</h2>
    <div class="step-cards a2">
      <div class="step-card"><strong>enrols_in (M:N)</strong> → new ENROLMENT junction table<br/><span style="font-size:14px;color:#a78bfa">PK = (student_id + module_code). Grade becomes a column.</span></div>
      <div class="step-card"><strong>belongs_to (1:N)</strong> → add dept_id FK to MODULE table<br/><span style="font-size:14px;color:#a78bfa">No new table needed — FK goes on the N-side (MODULE).</span></div>
    </div>
    <div class="tip-card a3">The M:N enrols_in relationship has a relationship attribute (Grade) — it goes inside the junction table, not in STUDENT or MODULE.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 980 680" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- ENROLMENT junction table -->
      <text x="300" y="28" text-anchor="middle" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="0.1em">NEW — Junction Table for M:N</text>
      <rect x="40" y="40" width="520" height="44" rx="4" fill="#4c1d95"/>
      <text x="300" y="67" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">ENROLMENT</text>
      <rect x="40" y="84" width="520" height="40" fill="#e0f2fe"/>
      <text x="56" y="109" font-family="'DM Mono',monospace" font-size="13" fill="#0369a1" font-weight="600">🔑🔗 student_id</text>
      <text x="554" y="109" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#0369a1">INT  PK + FK → STUDENT</text>
      <rect x="40" y="124" width="520" height="40" fill="#dbeafe"/>
      <text x="56" y="149" font-family="'DM Mono',monospace" font-size="13" fill="#1d4ed8" font-weight="600">🔑🔗 module_code</text>
      <text x="554" y="149" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#1d4ed8">VARCHAR  PK + FK → MODULE</text>
      <rect x="40" y="164" width="520" height="40" fill="white"/>
      <text x="56" y="189" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">grade</text>
      <text x="554" y="189" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#9ca3af">DECIMAL(4,2)</text>
      <rect x="40" y="40" width="520" height="164" rx="4" fill="none" stroke="#7c3aed" stroke-width="2"/>
      <text x="300" y="226" text-anchor="middle" font-size="12" fill="#7c3aed">PK = (student_id, module_code) — composite primary key</text>

      <!-- MODULE table (updated) -->
      <text x="760" y="28" text-anchor="middle" font-size="13" fill="#a78bfa" font-weight="700" letter-spacing="0.1em">UPDATED — FK added</text>
      <rect x="600" y="40" width="360" height="44" rx="4" fill="#4c1d95"/>
      <text x="780" y="67" text-anchor="middle" font-family="'DM Mono',monospace" font-size="16" fill="white" font-weight="700">MODULE</text>
      <rect x="600" y="84" width="360" height="38" fill="#ede9fe"/>
      <text x="615" y="107" font-family="'DM Mono',monospace" font-size="13" fill="#4c1d95" font-weight="600">🔑 module_code</text>
      <text x="954" y="107" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#6b7280">VARCHAR PK</text>
      <rect x="600" y="122" width="360" height="36" fill="white"/>
      <text x="615" y="145" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">module_name</text>
      <rect x="600" y="158" width="360" height="36" fill="#f5f3ff"/>
      <text x="615" y="181" font-family="'DM Mono',monospace" font-size="13" fill="#1e293b">credits</text>
      <rect x="600" y="194" width="360" height="38" fill="#e0f2fe"/>
      <text x="615" y="217" font-family="'DM Mono',monospace" font-size="13" fill="#0369a1" font-weight="600">🔗 dept_id</text>
      <text x="954" y="217" text-anchor="end" font-family="'DM Mono',monospace" font-size="11" fill="#0369a1">INT  FK → DEPARTMENT</text>
      <rect x="600" y="40" width="360" height="192" rx="4" fill="none" stroke="#7c3aed" stroke-width="2"/>

      <!-- FK arrows summary -->
      <rect x="40" y="290" width="920" height="130" rx="12" fill="rgba(30,27,75,0.6)" stroke="rgba(167,139,250,0.2)"/>
      <text x="500" y="320" text-anchor="middle" font-size="14" font-weight="700" fill="#a78bfa" letter-spacing="0.08em">FOREIGN KEY SUMMARY</text>
      <text x="80" y="352" font-size="14" fill="#c4b5fd">ENROLMENT.student_id  →  STUDENT.student_id</text>
      <text x="80" y="378" font-size="14" fill="#c4b5fd">ENROLMENT.module_code  →  MODULE.module_code</text>
      <text x="80" y="404" font-size="14" fill="#c4b5fd">MODULE.dept_id  →  DEPARTMENT.dept_id</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 17 COMPLETE SCHEMA ────────────────────────────────────────────────────
  {
    classes: 's-fullwhite',
    label: '17 Complete Relational Schema',
    html: `<div class="schema-header">
  <h2>Complete Relational Schema</h2>
  <p>4 tables — 3 entities + 1 junction table for the M:N relationship</p>
</div>
<div style="flex:1;padding:24px 60px 50px;display:flex;align-items:flex-start;justify-content:center;gap:24px;flex-wrap:wrap">
  <!-- DEPARTMENT -->
  <div style="display:flex;flex-direction:column">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:14px 20px;text-align:center">
      <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:white;letter-spacing:.04em">DEPARTMENT</span>
    </div>
    <div style="background:#ede9fe;padding:10px 20px;border-left:1px solid #7c3aed;border-right:1px solid #7c3aed">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#4c1d95;font-weight:600">🔑 dept_id  INT PK</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">dept_name  VARCHAR(80)</span>
    </div>
    <div style="background:#f5f3ff;padding:10px 20px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px">
    </div>
  </div>

  <!-- Arrow -->
  <div style="display:flex;align-items:center;padding-top:60px;color:#7c3aed;font-size:28px;font-weight:700">←</div>

  <!-- MODULE -->
  <div style="display:flex;flex-direction:column">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:14px 20px;text-align:center">
      <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:white">MODULE</span>
    </div>
    <div style="background:#ede9fe;padding:10px 20px;border-left:1px solid #7c3aed;border-right:1px solid #7c3aed">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#4c1d95;font-weight:600">🔑 module_code  VARCHAR PK</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">module_name  VARCHAR(100)</span>
    </div>
    <div style="background:#f5f3ff;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">credits  INT</span>
    </div>
    <div style="background:#e0f2fe;padding:10px 20px;border:1px solid #bae6fd;border-top:0;border-radius:0 0 8px 8px">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#0369a1;font-weight:600">🔗 dept_id  INT FK→DEPT</span>
    </div>
  </div>

  <!-- Arrow -->
  <div style="display:flex;align-items:center;padding-top:60px;color:#7c3aed;font-size:28px;font-weight:700">↔</div>

  <!-- ENROLMENT -->
  <div style="display:flex;flex-direction:column">
    <div style="background:#312e81;border-radius:8px 8px 0 0;padding:14px 20px;text-align:center">
      <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:white">ENROLMENT</span>
    </div>
    <div style="background:#dbeafe;padding:10px 20px;border-left:2px solid #2563eb;border-right:2px solid #2563eb">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1d4ed8;font-weight:700">🔑🔗 student_id  INT PK+FK→STUDENT</span>
    </div>
    <div style="background:#e0f2fe;padding:10px 20px;border:2px solid #2563eb;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1d4ed8;font-weight:700">🔑🔗 module_code  VARCHAR PK+FK→MODULE</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">grade  DECIMAL(4,2)</span>
    </div>
    <div style="background:#f0fdf4;padding:8px 20px;border-radius:6px;margin-top:8px;border:1px solid #bbf7d0">
      <span style="font-size:12px;color:#14532d">PK = (student_id, module_code)</span>
    </div>
  </div>

  <!-- Arrow -->
  <div style="display:flex;align-items:center;padding-top:60px;color:#7c3aed;font-size:28px;font-weight:700">↔</div>

  <!-- STUDENT -->
  <div style="display:flex;flex-direction:column">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:14px 20px;text-align:center">
      <span style="font-family:'DM Mono',monospace;font-size:15px;font-weight:700;color:white">STUDENT</span>
    </div>
    <div style="background:#ede9fe;padding:10px 20px;border-left:1px solid #7c3aed;border-right:1px solid #7c3aed">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#4c1d95;font-weight:600">🔑 student_id  INT PK</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">first_name  VARCHAR(50)</span>
    </div>
    <div style="background:#f5f3ff;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">last_name  VARCHAR(50)</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#1e293b">date_of_birth  DATE</span>
    </div>
    <div style="background:#ecfdf5;padding:10px 20px;border:1px solid #d1fae5;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#065f46">street_name  VARCHAR(80)</span>
    </div>
    <div style="background:white;padding:10px 20px;border:1px solid #e9d5ff;border-top:0">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#065f46">city  VARCHAR(50)</span>
    </div>
    <div style="background:#ecfdf5;padding:10px 20px;border:1px solid #d1fae5;border-top:0;border-radius:0 0 8px 8px">
      <span style="font-family:'DM Mono',monospace;font-size:13px;color:#065f46">post_code  VARCHAR(10)</span>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 18 SECTION BREAK: ACTIVITY ────────────────────────────────────────────
  {
    classes: 's-sectionbreak',
    label: '18 Section — Activity',
    html: `<div class="sb-watermark">03</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">ACTIVITY</p>
  <h2 class="a2">Map the ER Diagram</h2>
  <p class="a3" style="font-size:22px;color:rgba(255,255,255,.38);font-weight:300;margin-top:16px">Apply all 8 rules to a fresh scenario</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 19 ACTIVITY ───────────────────────────────────────────────────────────
  {
    classes: 's-act',
    label: '19 Activity — Project Management',
    html: `<div class="act-body">
  <div class="act-left">
    <div class="act-badge a1" style="background:#fef3c7;color:#92400e">Activity</div>
    <h2 class="a2">Project Management System</h2>
    <p class="scenario-text a3">A company tracks <strong>EMPLOYEE</strong> and <strong>PROJECT</strong> entities.<br/><br/>
      Each <strong>EMPLOYEE</strong> has an EmpId (key), a <strong>Name</strong> (composite: FirstName, LastName), and a <strong>{SkillSet}</strong> (multivalued).<br/><br/>
      Each <strong>PROJECT</strong> has a ProjectId (key), ProjectName, and StartDate.<br/><br/>
      An EMPLOYEE can work on many PROJECTs and a PROJECT can have many EMPLOYEEs. The <strong>WORKS_ON</strong> relationship records <strong>HoursPerWeek</strong>.<br/><br/>
      Every EMPLOYEE must work on at least one PROJECT. A PROJECT may exist before any employee is assigned.
    </p>
    <div class="task-box a4">
      <div class="task-title">Your Task</div>
      <p>Apply the 8 mapping rules. List <strong>all tables</strong> with their columns, PKs, and FKs. Which rule creates each table?</p>
    </div>
  </div>
  <div class="act-right">
    <div style="width:100%;height:100%;border:2px dashed #d8b4fe;border-radius:16px;display:flex;align-items:center;justify-content:center;background:#faf5ff">
      <p style="font-size:20px;color:#c4b5fd;font-weight:500">Your schema here</p>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 20 ACTIVITY ANSWER ────────────────────────────────────────────────────
  {
    classes: 's-ans-light',
    label: '20 Activity Answer — Project Management',
    html: `<div class="ans-header">
  <span style="background:#dcfce7;color:#14532d;padding:6px 18px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Answer</span>
  <h2>Project Management Schema</h2>
  <span style="margin-left:auto;font-size:14px;color:#6b7280">4 tables — 2 entities + 1 multivalued + 1 junction</span>
</div>
<div style="flex:1;padding:18px 50px 46px;display:flex;align-items:flex-start;gap:28px;overflow:hidden">
  <!-- EMPLOYEE table -->
  <div style="display:flex;flex-direction:column;flex-shrink:0">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:12px 18px;text-align:center"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:white">EMPLOYEE</span></div>
    <div style="background:#ede9fe;padding:9px 16px;border:1px solid #c4b5fd;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#4c1d95;font-weight:700">🔑 emp_id  INT PK</span></div>
    <div style="background:white;padding:9px 16px;border:1px solid #e9d5ff;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">first_name  VARCHAR(50)</span></div>
    <div style="background:#f5f3ff;padding:9px 16px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">last_name  VARCHAR(50)</span></div>
    <div style="font-size:11px;color:#7c3aed;text-align:center;margin-top:6px;font-weight:600">Rule 1 · Name flattened</div>
  </div>

  <div style="display:flex;align-items:center;padding-top:44px;font-size:20px;color:#a78bfa">→</div>

  <!-- EMPLOYEE_SKILL table -->
  <div style="display:flex;flex-direction:column;flex-shrink:0">
    <div style="background:#312e81;border-radius:8px 8px 0 0;padding:12px 18px;text-align:center"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:white">EMPLOYEE_SKILL</span></div>
    <div style="background:#dbeafe;padding:9px 16px;border:2px solid #3b82f6;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1d4ed8;font-weight:700">🔑🔗 emp_id  INT PK+FK→EMP</span></div>
    <div style="background:#e0f2fe;padding:9px 16px;border:2px solid #3b82f6;border-top:0;border-radius:0 0 8px 8px"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1d4ed8;font-weight:700">🔑 skill  VARCHAR(80) PK</span></div>
    <div style="font-size:11px;color:#7c3aed;text-align:center;margin-top:6px;font-weight:600">Rule 3 · {SkillSet} multivalued</div>
  </div>

  <div style="display:flex;align-items:center;padding-top:44px;font-size:20px;color:#a78bfa">↔</div>

  <!-- WORKS_ON table -->
  <div style="display:flex;flex-direction:column;flex-shrink:0">
    <div style="background:#312e81;border-radius:8px 8px 0 0;padding:12px 18px;text-align:center"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:white">WORKS_ON</span></div>
    <div style="background:#dbeafe;padding:9px 16px;border:2px solid #2563eb;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1d4ed8;font-weight:700">🔑🔗 emp_id  INT PK+FK→EMP</span></div>
    <div style="background:#e0f2fe;padding:9px 16px;border:2px solid #2563eb;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1d4ed8;font-weight:700">🔑🔗 project_id  INT PK+FK→PROJ</span></div>
    <div style="background:white;padding:9px 16px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">hours_per_week  DECIMAL(5,2)</span></div>
    <div style="font-size:11px;color:#7c3aed;text-align:center;margin-top:6px;font-weight:600">Rule 5 · M:N + relationship attr</div>
  </div>

  <div style="display:flex;align-items:center;padding-top:44px;font-size:20px;color:#a78bfa">←</div>

  <!-- PROJECT table -->
  <div style="display:flex;flex-direction:column;flex-shrink:0">
    <div style="background:#4c1d95;border-radius:8px 8px 0 0;padding:12px 18px;text-align:center"><span style="font-family:'DM Mono',monospace;font-size:14px;font-weight:700;color:white">PROJECT</span></div>
    <div style="background:#ede9fe;padding:9px 16px;border:1px solid #c4b5fd;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#4c1d95;font-weight:700">🔑 project_id  INT PK</span></div>
    <div style="background:white;padding:9px 16px;border:1px solid #e9d5ff;border-top:0"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">project_name  VARCHAR(100)</span></div>
    <div style="background:#f5f3ff;padding:9px 16px;border:1px solid #e9d5ff;border-top:0;border-radius:0 0 8px 8px"><span style="font-family:'DM Mono',monospace;font-size:12px;color:#1e293b">start_date  DATE</span></div>
    <div style="font-size:11px;color:#7c3aed;text-align:center;margin-top:6px;font-weight:600">Rule 1</div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 21 COMMON MISTAKES ────────────────────────────────────────────────────
  {
    classes: 's-mistakes',
    label: '21 Common Mapping Mistakes',
    html: `<div class="mistakes-inner">
  <h2 class="a1">Common Mapping Mistakes</h2>
  <div class="mistake-grid">
    <div class="mistake-pair a2">
      <div class="mk-wrong"><div class="mk-label">❌ Storing derived attributes</div><p>Adding an "age" column that goes stale every birthday. Never store what can be computed.</p></div>
      <div class="mk-right"><div class="mk-label">✅ Compute in queries</div><p>Store date_of_birth, then compute age with DATEDIFF() when needed.</p></div>
    </div>
    <div class="mistake-pair a3">
      <div class="mk-wrong"><div class="mk-label">❌ Composite attr as one column</div><p>Creating an "address VARCHAR(200)" column for a composite Address attribute.</p></div>
      <div class="mk-right"><div class="mk-label">✅ Flatten sub-attributes</div><p>Create street_name, city, post_code as separate columns — queryable individually.</p></div>
    </div>
    <div class="mistake-pair a4">
      <div class="mk-wrong"><div class="mk-label">❌ M:N with two FKs in one table</div><p>Adding both student_id and module_code as FKs in one of the entity tables.</p></div>
      <div class="mk-right"><div class="mk-label">✅ Always create a junction table</div><p>Create ENROLMENT(student_id FK, module_code FK, grade). Junction table is mandatory for M:N.</p></div>
    </div>
    <div class="mistake-pair a5">
      <div class="mk-wrong"><div class="mk-label">❌ FK on the wrong side of 1:N</div><p>Putting the FK in the "1" side table (e.g., dept_id in DEPARTMENT instead of MODULE).</p></div>
      <div class="mk-right"><div class="mk-label">✅ FK always on the N-side</div><p>The MANY side gets the FK — MODULE.dept_id references DEPARTMENT.dept_id.</p></div>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 22 KEY TAKEAWAYS ──────────────────────────────────────────────────────
  {
    classes: 's-takeaways',
    label: '22 Key Takeaways',
    html: `<div class="takeaways-inner">
  <h2 class="a1">Key Takeaways</h2>
  <div class="takeaway-list">
    <div class="takeaway-item a2"><div class="takeaway-num">1</div><p><strong>Each strong entity → one table.</strong> Key attribute → PRIMARY KEY. Simple attributes → columns.</p></div>
    <div class="takeaway-item a3"><div class="takeaway-num">2</div><p><strong>Composite attributes are flattened.</strong> Each sub-attribute becomes its own column. The composite parent is never stored.</p></div>
    <div class="takeaway-item a4"><div class="takeaway-num">3</div><p><strong>Multivalued attributes → separate table</strong> with FK + composite PK. M:N relationships → junction table with two FKs + relationship attributes.</p></div>
    <div class="takeaway-item a5"><div class="takeaway-num">4</div><p><strong>1:N → FK on the N-side.</strong> The many-side entity's table gets the FK column pointing to the one-side's PK.</p></div>
    <div class="takeaway-item a5" style="animation-delay:.75s"><div class="takeaway-num">5</div><p><strong>Derived attributes → do NOT store.</strong> Compute them at query time from stored data to avoid stale values.</p></div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 23 END ────────────────────────────────────────────────────────────────
  {
    classes: 's-end',
    label: '23 End',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1800" cy="200" r="380" fill="rgba(124,58,237,0.06)"/>
  <circle cx="120" cy="880" r="300" fill="rgba(167,139,250,0.04)"/>
</svg>
<div class="end-inner a1">
  <p style="font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:#6d28d9;margin-bottom:28px;font-weight:700">MBI802 · ER DIAGRAMS SERIES</p>
  <h1>End of Lesson 5</h1>
  <p>You can now translate any ER diagram into a full relational schema.</p>
  <p class="end-note">Use the flashcards below to review the 8 mapping rules.</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
];

const FLASHCARDS: { front: string; back: string }[] = [
  { front: 'What is ER-to-relational mapping?', back: 'The process of converting an ER diagram into a set of relational database tables by applying a set of deterministic rules — one rule per ER construct.' },
  { front: 'How does a strong entity map to a relational schema?', back: 'The entity becomes a table. Each simple attribute becomes a column. The key attribute becomes the PRIMARY KEY.' },
  { front: 'How does a composite attribute map?', back: 'Flatten each sub-attribute into its own column. The composite parent itself is NOT a column. E.g., Address → street_name, city, post_code.' },
  { front: 'How does a multivalued attribute map?', back: 'Create a new table with the attribute value as a column + FK to the original entity. The PK of the new table = (entity_pk + attribute_value).' },
  { front: 'How does a 1:N relationship map?', back: "Add the '1' side's primary key as a FOREIGN KEY in the 'N' side's table. No new table is created." },
  { front: 'How does a M:N relationship map?', back: 'Create a junction (bridge) table containing the PKs of both entities as foreign keys, plus any relationship attributes. The junction PK is a composite of both FKs.' },
  { front: 'How does a 1:1 relationship map?', back: 'Add the FK in either table — preferably the total-participation (mandatory) side. Alternatively, merge both entities into one table if they always co-exist.' },
  { front: 'How does a weak entity map?', back: 'Create a table with a COMPOSITE PRIMARY KEY = (partial key + identifying entity\'s PK). The identifying entity\'s PK also serves as a foreign key.' },
  { front: 'How does a derived attribute map?', back: 'Generally NOT stored as a column. Derived values are computed at query time from stored data (e.g., age from date_of_birth using DATEDIFF in SQL).' },
  { front: "Where does a relationship attribute (e.g., Grade) go in the schema?", back: 'In the junction table for the M:N relationship — it belongs to the relationship itself, not to either entity alone.' },
  { front: 'What is a junction table?', back: 'A table created to resolve a M:N relationship. It holds the PKs of both entities as foreign keys, plus any attributes of the relationship.' },
  { front: 'Which side gets the FK in a 1:N relationship?', back: "The MANY (N) side. Each 'many' row points back to its single parent via a FK column. E.g., ORDER.customer_id → CUSTOMER.customer_id." },
];

export default function ERMappingDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  useEffect(() => {
    const styleId = 'erm-deck-styles';
    if (!document.getElementById(styleId)) {
      const el = document.createElement('style');
      el.id = styleId;
      el.textContent = DECK_CSS;
      document.head.appendChild(el);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const observer = new ResizeObserver(() => {
      const { width, height } = wrap.getBoundingClientRect();
      const scale = Math.min(width / 1920, height / 1080);
      canvas.style.transform = `scale(${scale})`;
      canvas.style.transformOrigin = 'top left';
      wrap.style.height = `${1080 * scale}px`;
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrent(c => Math.min(c + 1, total - 1));
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setCurrent(c => Math.max(c - 1, 0));
      if (e.key === 'Escape' && fullscreen) exitFs();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, total]);

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  function goFs() { wrapRef.current?.requestFullscreen?.(); }
  function exitFs() { document.exitFullscreen?.(); }

  const slide = SLIDES[current];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrent(c => Math.max(c - 1, 0))} disabled={current === 0}
            className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(167,139,250,0.3)' }}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-600 min-w-[80px] text-center">{current + 1} / {total}</span>
          <button onClick={() => setCurrent(c => Math.min(c + 1, total - 1))} disabled={current === total - 1}
            className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(167,139,250,0.3)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
        <span className="text-xs font-medium text-gray-400 hidden sm:block">{slide.label}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(167,139,250,0.3)' }} title={expanded ? 'Collapse' : 'Expand'}>
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={fullscreen ? exitFs : goFs}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(167,139,250,0.3)' }} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div ref={wrapRef} className="erm relative w-full overflow-hidden rounded-xl"
        style={{ border: '1px solid rgba(167,139,250,0.3)' }}>
        <div ref={canvasRef} style={{ width: 1920, height: 1080 }}>
          <section className={slide.classes} dangerouslySetInnerHTML={{ __html: slide.html }} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => setCurrent(i)} title={s.label} className="rounded-full transition-all"
            style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#7c3aed' : 'rgba(124,58,237,0.25)' }} />
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 4, height: 24, borderRadius: 2, background: '#7c3aed', flexShrink: 0 }} />
          <h3 className="text-lg font-bold text-gray-800">Flashcards</h3>
          <span className="text-sm text-gray-400">· Click a card to flip</span>
          <button onClick={() => setFlipped({})}
            className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ color: '#7c3aed', borderColor: 'rgba(124,58,237,0.3)' }}>
            Reset all
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {FLASHCARDS.map((card, i) => (
            <div key={i} onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
              style={{ cursor: 'pointer', perspective: 1000, height: 170 }}>
              <div style={{
                position: 'relative', height: '100%', transformStyle: 'preserve-3d',
                transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: 'white', borderRadius: 12, padding: '18px 22px',
                  border: '1.5px solid rgba(124,58,237,0.2)',
                  display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Question</div>
                  <p style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.55, flex: 1 }}>{card.front}</p>
                  <div style={{ fontSize: 11, color: '#a78bfa', marginTop: 8, textAlign: 'right' }}>Tap to reveal ›</div>
                </div>
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: '#faf5ff', borderRadius: 12, padding: '18px 22px',
                  border: '1.5px solid rgba(124,58,237,0.35)',
                  display: 'flex', flexDirection: 'column',
                  transform: 'rotateY(180deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Answer</div>
                  <p style={{ fontSize: 14, color: '#3b0764', lineHeight: 1.55, flex: 1 }}>{card.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
