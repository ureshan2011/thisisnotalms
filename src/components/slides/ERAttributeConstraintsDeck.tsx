import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

@keyframes ecpFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes ecpFadeIn { from { opacity:0; } to { opacity:1; } }
.ecp .a1 { animation: ecpFadeUp 0.5s ease forwards; }
.ecp .a2 { animation: ecpFadeUp 0.5s 0.15s ease forwards; opacity:0; }
.ecp .a3 { animation: ecpFadeUp 0.5s 0.30s ease forwards; opacity:0; }
.ecp .a4 { animation: ecpFadeUp 0.5s 0.45s ease forwards; opacity:0; }
.ecp .a5 { animation: ecpFadeUp 0.5s 0.60s ease forwards; opacity:0; }

.ecp *{box-sizing:border-box;margin:0;padding:0}
.ecp{font-family:'DM Sans',sans-serif}
.ecp section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.ecp .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none;color:rgba(255,255,255,.32)}
.ecp .cr-dark{color:#94a3b8}

.ecp .s-title{background:#042f2e;justify-content:center;align-items:center}
.ecp .s-title .inner{text-align:center;z-index:1}
.ecp .s-title .eyebrow{font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;margin-bottom:28px;font-weight:600}
.ecp .s-title h1{font-size:90px;color:#f8fafc;line-height:1.0;margin-bottom:28px;font-weight:700}
.ecp .s-title h1 span{color:#2dd4bf}
.ecp .s-title .amber-bar{width:100px;height:4px;background:#b45309;margin:0 auto 28px;border-radius:2px}
.ecp .s-title .sub{font-size:24px;color:#5eead4;font-weight:300;letter-spacing:.02em}

.ecp .s-agenda{background:#042f2e}
.ecp .agenda-inner{padding:80px 100px;display:flex;flex-direction:column;justify-content:center;height:100%}
.ecp .agenda-inner .eyebrow{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;margin-bottom:20px;font-weight:700}
.ecp .agenda-inner h2{font-size:56px;color:#f8fafc;font-weight:700;margin-bottom:48px}
.ecp .agenda-cols{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.ecp .agenda-group h3{font-size:20px;font-weight:700;color:#5eead4;letter-spacing:.06em;text-transform:uppercase;margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid rgba(94,234,212,.2)}
.ecp .agenda-item{display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.ecp .agenda-dot{width:10px;height:10px;border-radius:50%;background:#0f766e;flex-shrink:0}
.ecp .agenda-item p{font-size:19px;color:#94a3b8;line-height:1.4}

.ecp .s-sectionbreak{background:#0d3d3a;justify-content:center;align-items:center}
.ecp .sb-watermark{position:absolute;font-size:320px;font-weight:800;color:rgba(94,234,212,.05);line-height:1;pointer-events:none;user-select:none;bottom:-40px;right:80px}
.ecp .sb-inner{text-align:center;z-index:1}
.ecp .sb-eyebrow{font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;margin-bottom:18px;font-weight:700}
.ecp .sb-inner h2{font-size:66px;font-weight:700;color:#f8fafc;margin-bottom:20px;line-height:1.1}
.ecp .sb-inner p{font-size:22px;color:#5eead4;font-weight:300;opacity:.7}

.ecp .s-concept{background:#0d3d3a}
.ecp .concept-body{display:flex;flex:1;min-height:0}
.ecp .concept-left{width:790px;flex-shrink:0;padding:72px 68px 72px 96px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(255,255,255,.07)}
.ecp .concept-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px;background:#051f1e}
.ecp .concept-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:22px;width:fit-content;background:#134e4a;color:#5eead4}
.ecp .concept-left h2{font-size:50px;color:#f1f5f9;line-height:1.05;margin-bottom:18px;font-weight:700}
.ecp .concept-desc{font-size:19px;color:#94a3b8;line-height:1.75;margin-bottom:22px}
.ecp .concept-desc strong{color:#f1f5f9;font-weight:700}
.ecp .rule-card{border-radius:10px;padding:18px 22px;background:rgba(255,255,255,.04);border-left:4px solid #0f766e;font-size:17px;color:#ccfbf1;line-height:1.55;margin-bottom:14px}
.ecp .rule-card strong{color:#5eead4}
.ecp .warn-card{border-radius:10px;padding:16px 20px;background:#422006;border-left:4px solid #b45309;font-size:16px;color:#fde68a;line-height:1.55;margin-bottom:14px}
.ecp .tip-card{border-radius:10px;padding:16px 20px;background:#052e16;border-left:4px solid #16a34a;font-size:17px;color:#bbf7d0;line-height:1.55;margin-bottom:14px}
.ecp .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
.ecp .chip{padding:7px 16px;border-radius:8px;font-size:14px;font-weight:500;background:rgba(255,255,255,.05);border:1px solid rgba(94,234,212,.25);color:#ccfbf1}

.ecp .s-light{background:#f0fdfa}
.ecp .s-light .concept-body{background:#f0fdfa}
.ecp .s-light .concept-left{border-right:1px solid #99f6e4;background:#f0fdfa}
.ecp .s-light .concept-right{background:#ccfbf1}
.ecp .s-light .concept-left h2{color:#042f2e}
.ecp .s-light .concept-desc{color:#134e4a}
.ecp .s-light .concept-desc strong{color:#042f2e}
.ecp .s-light .concept-badge{background:#ccfbf1;color:#0f766e}
.ecp .s-light .rule-card{background:white;border-left-color:#0f766e;color:#134e4a}
.ecp .s-light .rule-card strong{color:#0f766e}
.ecp .s-light .tip-card{background:#dcfce7;border-left-color:#16a34a;color:#14532d}

.ecp .s-compare{background:#f8fafc}
.ecp .compare-inner{padding:60px 80px;display:flex;flex-direction:column;height:100%}
.ecp .compare-inner h2{font-size:52px;font-weight:700;color:#1e1b4b;margin-bottom:36px}
.ecp .compare-cols{display:grid;grid-template-columns:1fr 1fr;gap:32px;flex:1}
.ecp .compare-card{border-radius:20px;padding:36px 40px;display:flex;flex-direction:column;gap:18px}
.ecp .compare-card.green{background:#f0fdf4;border:2px solid #86efac}
.ecp .compare-card.slate{background:#f8fafc;border:2px solid #cbd5e1}
.ecp .compare-title{font-size:28px;font-weight:700;margin-bottom:4px}
.ecp .compare-tag{font-size:16px;font-weight:500;margin-bottom:8px}
.ecp .compare-rule{font-size:15px;font-weight:600;padding:10px 16px;border-radius:8px;text-align:center}
.ecp .compare-item{font-size:17px;line-height:1.55;padding:10px 0;border-bottom:1px solid rgba(0,0,0,.06)}

.ecp .s-act{background:#fdfaf5}
.ecp .act-body{display:flex;height:100%}
.ecp .act-left{width:840px;flex-shrink:0;padding:66px 74px 66px 90px;display:flex;flex-direction:column;border-right:1px solid #e8e0d4}
.ecp .act-right{flex:1;display:flex;align-items:center;justify-content:center;padding:52px}
.ecp .act-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:24px;width:fit-content}
.ecp .act-left h2{font-size:40px;color:#1e1b4b;font-weight:700;line-height:1.1;margin-bottom:22px}
.ecp .scenario-text{font-size:18px;color:#334155;line-height:1.72;margin-bottom:20px;flex:1}
.ecp .scenario-text strong{color:#0f172a;font-weight:700}
.ecp .task-box{border-radius:12px;padding:20px 24px;background:#f0fdfa;border-left:5px solid #0f766e}
.ecp .task-box .task-title{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#0f766e;margin-bottom:10px}
.ecp .task-box p{font-size:17px;color:#134e4a;line-height:1.6}
.ecp .hint-card{border-radius:10px;padding:14px 20px;background:#fef9c3;border-left:4px solid #ca8a04;font-size:15px;color:#713f12;margin-top:14px;line-height:1.55}

.ecp .s-ans{background:#f0fdf4}
.ecp .ans-header{padding:0 90px;height:88px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #bbf7d0;flex-shrink:0;background:#fff}
.ecp .ans-header h2{font-size:34px;font-weight:700;color:#14532d}

.ecp .s-ref{background:#042f2e}
.ecp .ref-inner{padding:50px 80px;display:flex;flex-direction:column;height:100%}
.ecp .ref-inner h2{font-size:48px;font-weight:700;color:#f8fafc;margin-bottom:32px}
.ecp .ref-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;flex:1}
.ecp .ref-card{background:rgba(255,255,255,.04);border:1px solid rgba(94,234,212,.12);border-radius:14px;padding:20px 18px;display:flex;flex-direction:column;gap:10px}
.ecp .ref-card .ref-name{font-size:14px;font-weight:700;color:#5eead4;letter-spacing:.06em}
.ecp .ref-card .ref-desc{font-size:13px;color:#64748b;line-height:1.5}

.ecp .s-takeaways{background:#042f2e}
.ecp .takeaways-inner{padding:72px 100px;display:flex;flex-direction:column;justify-content:center;height:100%}
.ecp .takeaways-inner h2{font-size:52px;font-weight:700;color:#f1f5f9;margin-bottom:40px}
.ecp .takeaway-list{display:flex;flex-direction:column;gap:18px}
.ecp .takeaway-item{display:flex;align-items:flex-start;gap:20px;padding:22px 28px;border-radius:14px;background:rgba(15,118,110,.1);border:1px solid rgba(94,234,212,.12)}
.ecp .takeaway-num{width:38px;height:38px;border-radius:50%;background:#0f766e;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:white;flex-shrink:0;margin-top:1px}
.ecp .takeaway-item p{font-size:19px;color:#ccfbf1;line-height:1.6}
.ecp .takeaway-item strong{color:#f8fafc}

.ecp .s-end{background:#042f2e;justify-content:center;align-items:center}
.ecp .end-inner{text-align:center;z-index:1}
.ecp .end-inner h1{font-size:78px;font-weight:700;color:#f8fafc;margin-bottom:24px;line-height:1.1}
.ecp .end-inner p{font-size:24px;color:#5eead4;margin-bottom:14px;font-weight:300}
.ecp .end-note{font-size:16px;color:#134e4a;margin-top:8px}
`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  // ── 01 TITLE ──────────────────────────────────────────────────────────────
  {
    classes: 's-title',
    label: '01 Title',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="ecp-rg1" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="rgba(15,118,110,0.2)"/>
      <stop offset="100%" stop-color="rgba(4,47,46,0)"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#ecp-rg1)"/>
  <circle cx="1720" cy="160" r="320" fill="rgba(45,212,191,0.06)"/>
  <circle cx="200" cy="900" r="280" fill="rgba(15,118,110,0.05)"/>
  <text x="1560" y="980" font-size="200" font-weight="800" fill="rgba(45,212,191,0.04)" font-family="'DM Sans',sans-serif" text-anchor="middle">CP</text>
</svg>
<div class="inner a1">
  <p class="eyebrow">DATABASE MANAGEMENT SYSTEMS · MBI802</p>
  <h1>Composite Attributes<br/><span>&amp; Participation Constraints</span></h1>
  <div class="amber-bar"></div>
  <p class="sub">ER Chen's Notation — Lesson 4 of 5</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 02 AGENDA ─────────────────────────────────────────────────────────────
  {
    classes: 's-agenda',
    label: '02 What You Will Learn',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1820" cy="100" r="380" fill="rgba(15,118,110,0.05)"/>
</svg>
<div class="agenda-inner">
  <p class="eyebrow a1">Lesson Roadmap</p>
  <h2 class="a1">What You'll Learn</h2>
  <div class="agenda-cols">
    <div class="agenda-group a2">
      <h3>Part A — Composite Attributes</h3>
      <div class="agenda-item"><div class="agenda-dot"></div><p>What composite attributes are and why they matter</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Sub-attribute branching notation in Chen's diagrams</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Real-world examples — Name, Address</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Composite vs. simple vs. multivalued</p></div>
    </div>
    <div class="agenda-group a3">
      <h3>Part B — Participation Constraints</h3>
      <div class="agenda-item"><div class="agenda-dot"></div><p>What participation constraints are and why they matter</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Total participation — double line (══) notation</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Partial participation — single line (──) notation</p></div>
      <div class="agenda-item"><div class="agenda-dot"></div><p>Applying constraints to real business rules</p></div>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 03 SECTION BREAK: COMPOSITE ───────────────────────────────────────────
  {
    classes: 's-sectionbreak',
    label: '03 Section — Composite Attributes',
    html: `<div class="sb-watermark">01</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">PART ONE</p>
  <h2 class="a2">Composite Attributes</h2>
  <p class="a3">An attribute composed of smaller, meaningful sub-attributes</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 04 WHAT IS A COMPOSITE ATTRIBUTE ──────────────────────────────────────
  {
    classes: 's-concept',
    label: '04 What Is a Composite Attribute',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Composite Attributes</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Definition</div>
    <h2 class="a1">A Whole Made of Parts</h2>
    <p class="concept-desc a2">A <strong>composite attribute</strong> is an attribute that can be broken down into smaller sub-attributes, each representing a distinct, meaningful piece of information. Unlike a simple attribute, it has <strong>internal structure</strong>.</p>
    <div class="rule-card a3">Key Insight — When you need to <strong>query or process individual parts</strong> of an attribute (e.g., search by City, sort by LastName, extract PostCode for a report), model it as composite.</div>
    <div class="chips a4">
      <span class="chip">Has sub-attributes</span>
      <span class="chip">Branching notation</span>
      <span class="chip">Individually queryable</span>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 820 580" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- CUSTOMER entity -->
      <rect x="60" y="258" width="200" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="160" y="300" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">CUSTOMER</text>

      <!-- CustomerId (key) -->
      <line x1="120" y1="258" x2="90" y2="185" stroke="#64748b" stroke-width="1.5"/>
      <ellipse cx="70" cy="165" rx="74" ry="27" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="70" y="162" text-anchor="middle" font-size="14" fill="#042f2e" font-weight="600" text-decoration="underline">CustomerId</text>

      <!-- Line entity to Address -->
      <line x1="230" y1="294" x2="340" y2="248" stroke="#0f766e" stroke-width="2"/>

      <!-- Address composite ellipse -->
      <ellipse cx="420" cy="228" rx="96" ry="36" fill="#f0fdfa" stroke="#0f766e" stroke-width="3"/>
      <text x="420" y="234" text-anchor="middle" font-size="17" font-weight="700" fill="#0f766e">Address</text>

      <!-- Lines from Address to sub-attrs -->
      <line x1="366" y1="200" x2="288" y2="130" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="405" y1="193" x2="390" y2="120" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="464" y1="198" x2="540" y2="128" stroke="#0f766e" stroke-width="1.5"/>
      <line x1="504" y1="222" x2="618" y2="210" stroke="#0f766e" stroke-width="1.5"/>

      <!-- Sub-attribute ellipses -->
      <ellipse cx="250" cy="108" rx="78" ry="27" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="250" y="113" text-anchor="middle" font-size="13" fill="#134e4a">StreetNumber</text>

      <ellipse cx="398" cy="98" rx="70" ry="27" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="398" y="103" text-anchor="middle" font-size="13" fill="#134e4a">StreetName</text>

      <ellipse cx="564" cy="106" rx="52" ry="27" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="564" y="111" text-anchor="middle" font-size="13" fill="#134e4a">City</text>

      <ellipse cx="656" cy="222" rx="66" ry="27" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="656" y="227" text-anchor="middle" font-size="13" fill="#134e4a">PostCode</text>

      <!-- Annotation -->
      <rect x="50" y="390" width="720" height="72" rx="10" fill="rgba(15,118,110,0.12)" stroke="rgba(45,212,191,0.3)" stroke-width="1"/>
      <text x="410" y="420" text-anchor="middle" font-size="15" fill="#5eead4" font-weight="700">← Outer ellipse = composite attribute (thicker teal border)</text>
      <text x="410" y="446" text-anchor="middle" font-size="14" fill="#94a3b8">Small ellipses connected by lines = sub-attributes (each queryable separately)</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 05 NOTATION RULE ──────────────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '05 Chen\'s Notation — How to Draw',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Chen's Notation Rule</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">The Rule</div>
    <h2 class="a1">Parent → Children Branching</h2>
    <div class="rule-card a2">① Draw an ellipse for the <strong>composite attribute</strong> — use a thicker border to distinguish it</div>
    <div class="rule-card a3">② Draw smaller ellipses for each <strong>sub-attribute</strong>, connected to the parent by lines</div>
    <div class="rule-card a4">③ Sub-attributes can themselves be <strong>composite</strong> — nested branching is allowed</div>
    <div class="tip-card a5">In SQL mapping, the composite parent is <strong>never a column</strong>. Only the leaf sub-attributes become columns in the table.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 740 500" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- Parent composite ellipse (large, centre) -->
      <ellipse cx="370" cy="240" rx="110" ry="42" fill="#f0fdfa" stroke="#0f766e" stroke-width="3.5"/>
      <text x="370" y="246" text-anchor="middle" font-size="18" font-weight="700" fill="#0f766e">CompositeAttr</text>

      <!-- Sub-attribute 1 (top-left) -->
      <line x1="298" y1="204" x2="190" y2="130" stroke="#0f766e" stroke-width="1.5"/>
      <ellipse cx="142" cy="108" rx="86" ry="30" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="142" y="113" text-anchor="middle" font-size="14" fill="#134e4a">SubAttribute1</text>

      <!-- Sub-attribute 2 (top-centre) -->
      <line x1="370" y1="198" x2="370" y2="128" stroke="#0f766e" stroke-width="1.5"/>
      <ellipse cx="370" cy="102" rx="86" ry="30" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="370" y="107" text-anchor="middle" font-size="14" fill="#134e4a">SubAttribute2</text>

      <!-- Sub-attribute 3 (top-right) -->
      <line x1="442" y1="204" x2="548" y2="130" stroke="#0f766e" stroke-width="1.5"/>
      <ellipse cx="596" cy="108" rx="86" ry="30" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="596" y="113" text-anchor="middle" font-size="14" fill="#134e4a">SubAttribute3</text>

      <!-- Labels -->
      <text x="40" y="74" font-size="13" fill="#5eead4" font-weight="700">Sub-attributes (leaves)</text>
      <line x1="40" y1="80" x2="56" y2="96" stroke="#5eead4" stroke-width="1" stroke-dasharray="3,2"/>

      <text x="460" y="270" font-size="13" fill="#5eead4" font-weight="700">Parent composite</text>
      <text x="460" y="290" font-size="13" fill="#5eead4">(thicker border)</text>

      <!-- Bottom note box -->
      <rect x="60" y="370" width="620" height="62" rx="10" fill="rgba(15,118,110,0.15)" stroke="rgba(45,212,191,0.25)"/>
      <text x="370" y="396" text-anchor="middle" font-size="14" fill="#5eead4" font-weight="700">Example: Name → (FirstName, MiddleName, LastName)</text>
      <text x="370" y="418" text-anchor="middle" font-size="13" fill="#64748b">Each sub-attribute becomes its own column in SQL: first_name, middle_name, last_name</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 06 REAL EXAMPLE: PERSON ───────────────────────────────────────────────
  {
    classes: 's-light',
    label: '06 Real Example — PERSON Entity',
    html: `<div style="padding:38px 96px 18px;background:#f0fdfa;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#0f766e;font-weight:700">Real-World Example</div>
</div>
<div class="concept-body">
  <div class="concept-left" style="background:#f0fdfa">
    <div class="concept-badge a1">PERSON Entity</div>
    <h2 class="a1" style="color:#042f2e">Name &amp; Address as Composites</h2>
    <p class="concept-desc a2" style="color:#134e4a">A PERSON entity commonly has two composite attributes: <strong>Name</strong> (FirstName, MiddleName, LastName) and <strong>Address</strong> (StreetName, City, PostCode). Simple attributes like DateOfBirth and PersonId remain flat ellipses.</p>
    <div class="rule-card a3" style="background:white;border-left-color:#0f766e;color:#134e4a"><strong>SQL Impact:</strong> The PERSON table will NOT have "name" or "address" columns. Instead: first_name, middle_name, last_name, street_name, city, post_code.</div>
    <div class="hint-card a4">Always ask: "Will I ever need to search, sort, or filter by a <em>part</em> of this attribute?" If yes → make it composite.</div>
  </div>
  <div class="concept-right" style="background:#ccfbf1">
    <svg viewBox="0 0 960 700" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- PERSON entity -->
      <rect x="380" y="300" width="200" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="480" y="342" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">PERSON</text>

      <!-- PersonId (key) -->
      <line x1="430" y1="300" x2="365" y2="228" stroke="#64748b" stroke-width="1.5"/>
      <ellipse cx="328" cy="208" rx="72" ry="27" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="328" y="205" text-anchor="middle" font-size="14" fill="#042f2e" font-weight="600" text-decoration="underline">PersonId</text>

      <!-- DateOfBirth (simple) -->
      <line x1="530" y1="300" x2="592" y2="228" stroke="#64748b" stroke-width="1.5"/>
      <ellipse cx="628" cy="208" rx="80" ry="27" fill="white" stroke="#64748b" stroke-width="2"/>
      <text x="628" y="213" text-anchor="middle" font-size="14" fill="#374151">DateOfBirth</text>

      <!-- Name composite -->
      <line x1="400" y1="300" x2="240" y2="372" stroke="#0f766e" stroke-width="2"/>
      <ellipse cx="175" cy="388" rx="88" ry="32" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
      <text x="175" y="394" text-anchor="middle" font-size="16" font-weight="700" fill="#0f766e">Name</text>

      <!-- Name sub-attrs -->
      <line x1="120" y1="365" x2="68" y2="294" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="46" cy="270" rx="70" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="46" y="275" text-anchor="middle" font-size="12" fill="#134e4a">FirstName</text>

      <line x1="168" y1="356" x2="142" y2="282" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="136" cy="256" rx="74" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="136" y="261" text-anchor="middle" font-size="12" fill="#134e4a">MiddleName</text>

      <line x1="230" y1="360" x2="260" y2="290" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="274" cy="266" rx="66" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="274" y="271" text-anchor="middle" font-size="12" fill="#134e4a">LastName</text>

      <!-- Address composite -->
      <line x1="560" y1="300" x2="720" y2="372" stroke="#0f766e" stroke-width="2"/>
      <ellipse cx="782" cy="388" rx="88" ry="32" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
      <text x="782" y="394" text-anchor="middle" font-size="16" font-weight="700" fill="#0f766e">Address</text>

      <!-- Address sub-attrs -->
      <line x1="726" y1="362" x2="660" y2="290" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="638" cy="266" rx="72" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="638" y="271" text-anchor="middle" font-size="12" fill="#134e4a">StreetName</text>

      <line x1="782" y1="356" x2="800" y2="280" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="810" cy="256" rx="50" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="810" y="261" text-anchor="middle" font-size="12" fill="#134e4a">City</text>

      <line x1="840" y1="362" x2="900" y2="290" stroke="#0f766e" stroke-width="1"/>
      <ellipse cx="920" cy="266" rx="62" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      <text x="920" y="271" text-anchor="middle" font-size="12" fill="#134e4a">PostCode</text>

      <!-- Legend labels -->
      <text x="100" y="490" text-anchor="middle" font-size="13" fill="#0f766e" font-weight="700">Composite (teal)</text>
      <text x="490" y="490" text-anchor="middle" font-size="13" fill="#64748b" font-weight="700">Key attribute (underlined)</text>
      <text x="820" y="490" text-anchor="middle" font-size="13" fill="#94a3b8" font-weight="700">Simple attribute (gray)</text>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 07 COMPOSITE VS SIMPLE VS MULTIVALUED ─────────────────────────────────
  {
    classes: 's-compare',
    label: '07 Composite vs Simple vs Multivalued',
    html: `<div class="compare-inner">
  <h2 class="a1">Three Types of Attributes at a Glance</h2>
  <div class="compare-cols">
    <div class="compare-card a2" style="background:#f0fdfa;border:2px solid #5eead4">
      <div>
        <div class="compare-title" style="color:#0f766e">Composite Attribute</div>
        <div class="compare-tag" style="color:#134e4a">One value — broken into parts</div>
      </div>
      <svg viewBox="0 0 340 130" style="height:100px;width:auto" font-family="'DM Sans',sans-serif">
        <ellipse cx="170" cy="68" rx="80" ry="28" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
        <text x="170" y="73" text-anchor="middle" font-size="14" font-weight="700" fill="#0f766e">Address</text>
        <line x1="120" y1="44" x2="66" y2="18" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="46" cy="12" rx="52" ry="16" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <text x="46" y="17" text-anchor="middle" font-size="11" fill="#134e4a">City</text>
        <line x1="170" y1="40" x2="170" y2="16" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="170" cy="10" rx="62" ry="14" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <text x="170" y="15" text-anchor="middle" font-size="11" fill="#134e4a">StreetName</text>
        <line x1="220" y1="44" x2="274" y2="18" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="296" cy="12" rx="56" ry="16" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <text x="296" y="17" text-anchor="middle" font-size="11" fill="#134e4a">PostCode</text>
      </svg>
      <div class="compare-item" style="color:#134e4a;border-bottom-color:#99f6e4">Example: <strong>Address</strong> = StreetName + City + PostCode</div>
      <div class="compare-item" style="color:#134e4a;border-bottom:0">SQL: <strong>street_name, city, post_code</strong> columns (no "address" column)</div>
    </div>

    <div class="compare-card a3" style="background:#f8fafc;border:2px solid #cbd5e1">
      <div>
        <div class="compare-title" style="color:#475569">Simple Attribute</div>
        <div class="compare-tag" style="color:#64748b">One value — no internal parts</div>
      </div>
      <svg viewBox="0 0 340 130" style="height:100px;width:auto" font-family="'DM Sans',sans-serif">
        <ellipse cx="170" cy="68" rx="80" ry="28" fill="white" stroke="#64748b" stroke-width="2"/>
        <text x="170" y="73" text-anchor="middle" font-size="14" fill="#374151">DateOfBirth</text>
      </svg>
      <div class="compare-item" style="color:#475569;border-bottom-color:#e2e8f0">Example: <strong>DateOfBirth</strong> is always one date value</div>
      <div class="compare-item" style="color:#475569;border-bottom:0">SQL: <strong>date_of_birth</strong> column — stored directly as-is</div>
    </div>

    <div class="compare-card a4" style="background:#fef9c3;border:2px solid #fde68a;grid-column:1/-1">
      <div>
        <div class="compare-title" style="color:#92400e">Multivalued Attribute</div>
        <div class="compare-tag" style="color:#78350f">MULTIPLE values — no internal structure (double ellipse)</div>
      </div>
      <div style="display:flex;align-items:center;gap:48px">
        <svg viewBox="0 0 340 100" style="height:80px;width:auto" font-family="'DM Sans',sans-serif">
          <ellipse cx="170" cy="55" rx="84" ry="30" fill="white" stroke="#b45309" stroke-width="2"/>
          <ellipse cx="170" cy="55" rx="74" ry="22" fill="#fef9c3" stroke="#b45309" stroke-width="2"/>
          <text x="170" y="60" text-anchor="middle" font-size="14" fill="#92400e" font-weight="600">PhoneNumber</text>
        </svg>
        <div style="flex:1">
          <div class="compare-item" style="color:#78350f;border-bottom-color:#fde68a">Example: <strong>{PhoneNumber}</strong> holds 021-555-1234 AND 09-888-9999 simultaneously</div>
          <div class="compare-item" style="color:#78350f;border-bottom:0">SQL: creates a <strong>separate table</strong> — e.g. CUSTOMER_PHONE(customer_id FK, phone_number PK)</div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 08 SECTION BREAK: PARTICIPATION ───────────────────────────────────────
  {
    classes: 's-sectionbreak',
    label: '08 Section — Participation Constraints',
    html: `<div class="sb-watermark">02</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">PART TWO</p>
  <h2 class="a2">Participation Constraints</h2>
  <p class="a3">Do ALL entities have to join the relationship — or just SOME?</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 09 WHAT ARE PARTICIPATION CONSTRAINTS ─────────────────────────────────
  {
    classes: 's-concept',
    label: '09 What Are Participation Constraints',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Participation Constraints</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1">Definition</div>
    <h2 class="a1">Mandatory vs. Optional</h2>
    <p class="concept-desc a2">A <strong>participation constraint</strong> specifies whether ALL or only SOME entities in an entity set must participate in a relationship. It captures a <strong>business rule</strong> about obligation.</p>
    <div class="rule-card a3">Think of it as a contract: "<em>Every X must be linked to a Y</em>" (total) vs. "<em>Some X may be linked to a Y, but not required</em>" (partial).</div>
    <div class="chips a4">
      <span class="chip">Total = mandatory</span>
      <span class="chip">Partial = optional</span>
      <span class="chip">Enforced by DB constraints</span>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 820 520" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- Total card -->
      <rect x="40" y="40" width="340" height="200" rx="14" fill="rgba(22,163,74,0.08)" stroke="#16a34a" stroke-width="2"/>
      <text x="210" y="80" text-anchor="middle" font-size="16" font-weight="700" fill="#16a34a" letter-spacing="0.08em">TOTAL PARTICIPATION</text>
      <text x="210" y="108" text-anchor="middle" font-size="14" fill="#166534">Double line (══)</text>
      <line x1="100" y1="145" x2="180" y2="145" stroke="#16a34a" stroke-width="2.5"/>
      <line x1="100" y1="151" x2="180" y2="151" stroke="#16a34a" stroke-width="2.5"/>
      <text x="210" y="186" text-anchor="middle" font-size="14" fill="#166534" font-style="italic">"Every EMPLOYEE must</text>
      <text x="210" y="208" text-anchor="middle" font-size="14" fill="#166534" font-style="italic">work in a DEPARTMENT"</text>
      <text x="210" y="228" text-anchor="middle" font-size="13" fill="#4ade80">Key word: must / every / all / required</text>

      <!-- Partial card -->
      <rect x="440" y="40" width="340" height="200" rx="14" fill="rgba(100,116,139,0.08)" stroke="#94a3b8" stroke-width="2"/>
      <text x="610" y="80" text-anchor="middle" font-size="16" font-weight="700" fill="#475569" letter-spacing="0.08em">PARTIAL PARTICIPATION</text>
      <text x="610" y="108" text-anchor="middle" font-size="14" fill="#475569">Single line (──)</text>
      <line x1="500" y1="148" x2="580" y2="148" stroke="#94a3b8" stroke-width="2"/>
      <text x="610" y="186" text-anchor="middle" font-size="14" fill="#475569" font-style="italic">"Some EMPLOYEE may</text>
      <text x="610" y="208" text-anchor="middle" font-size="14" fill="#475569" font-style="italic">manage a DEPARTMENT"</text>
      <text x="610" y="228" text-anchor="middle" font-size="13" fill="#94a3b8">Key word: may / can / optional / might</text>

      <!-- Bottom diagram -->
      <rect x="40" y="320" width="740" height="140" rx="14" fill="rgba(15,118,110,0.08)" stroke="rgba(45,212,191,0.2)"/>
      <text x="420" y="355" text-anchor="middle" font-size="14" fill="#5eead4" font-weight="700">Why does it matter?</text>
      <text x="420" y="380" text-anchor="middle" font-size="14" fill="#94a3b8">Total participation maps to a NOT NULL FK constraint in SQL.</text>
      <text x="420" y="404" text-anchor="middle" font-size="14" fill="#94a3b8">Partial participation means the FK column allows NULL values.</text>
      <text x="420" y="428" text-anchor="middle" font-size="13" fill="#64748b">Getting this right prevents data integrity issues at the database level.</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 10 TOTAL PARTICIPATION ────────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '10 Total Participation — Double Line',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Participation Constraints</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1" style="background:#14532d;color:#86efac">Total Participation</div>
    <h2 class="a1">Double Line Notation ══</h2>
    <p class="concept-desc a2">When <strong>every entity</strong> in the set must participate in at least one relationship instance, we draw a <strong>double line</strong> between the entity and the relationship diamond.</p>
    <div class="rule-card a3">Also called <strong>mandatory</strong> or <strong>existence-dependent</strong> participation. Business rule language: <em>"Every X must…"</em>, <em>"All X are…"</em>, <em>"X is required to…"</em></div>
    <div class="tip-card a4">Business rule: "Every EMPLOYEE must belong to exactly one DEPARTMENT." → EMPLOYEE side gets a <strong>double line</strong> to the works_in relationship.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 960 500" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- EMPLOYEE entity -->
      <rect x="40" y="194" width="220" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="150" y="236" text-anchor="middle" font-size="20" font-weight="700" fill="#042f2e">EMPLOYEE</text>

      <!-- DOUBLE LINE from EMPLOYEE to diamond (total) -->
      <line x1="260" y1="226" x2="388" y2="226" stroke="#16a34a" stroke-width="2.5"/>
      <line x1="260" y1="233" x2="388" y2="233" stroke="#16a34a" stroke-width="2.5"/>
      <text x="324" y="214" text-anchor="middle" font-size="20" font-weight="700" fill="#16a34a">N</text>

      <!-- works_in diamond -->
      <polygon points="488,190 600,229 488,268 376,229" fill="#0d3d3a" stroke="#2dd4bf" stroke-width="3"/>
      <text x="488" y="235" text-anchor="middle" font-size="17" font-weight="700" fill="#5eead4">works_in</text>

      <!-- SINGLE LINE from diamond to DEPARTMENT (partial) -->
      <line x1="600" y1="229" x2="700" y2="229" stroke="#94a3b8" stroke-width="2"/>
      <text x="650" y="214" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">1</text>

      <!-- DEPARTMENT entity -->
      <rect x="700" y="194" width="240" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="820" y="236" text-anchor="middle" font-size="20" font-weight="700" fill="#042f2e">DEPARTMENT</text>

      <!-- Annotation: EMPLOYEE side -->
      <rect x="20" y="315" width="260" height="72" rx="10" fill="rgba(22,163,74,0.12)" stroke="#16a34a" stroke-width="1.5"/>
      <text x="150" y="344" text-anchor="middle" font-size="14" font-weight="700" fill="#16a34a">Total participation</text>
      <text x="150" y="366" text-anchor="middle" font-size="13" fill="#166534">Every employee MUST</text>
      <text x="150" y="384" text-anchor="middle" font-size="13" fill="#166534">work in a department</text>

      <!-- Annotation: DEPARTMENT side -->
      <rect x="680" y="315" width="260" height="72" rx="10" fill="rgba(100,116,139,0.1)" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="810" y="344" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial participation</text>
      <text x="810" y="366" text-anchor="middle" font-size="13" fill="#64748b">A department CAN exist</text>
      <text x="810" y="384" text-anchor="middle" font-size="13" fill="#64748b">with no employees yet</text>

      <!-- Double line label -->
      <text x="324" y="264" text-anchor="middle" font-size="12" fill="#4ade80">Double line ══</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 11 PARTIAL PARTICIPATION ──────────────────────────────────────────────
  {
    classes: 's-concept',
    label: '11 Partial Participation — Single Line',
    html: `<div style="padding:38px 96px 18px;flex-shrink:0">
  <div style="font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf;font-weight:700">Participation Constraints</div>
</div>
<div class="concept-body">
  <div class="concept-left">
    <div class="concept-badge a1" style="background:#1e293b;color:#94a3b8">Partial Participation</div>
    <h2 class="a1">Single Line Notation ──</h2>
    <p class="concept-desc a2">When only <strong>some entities</strong> need to participate in a relationship, we use the default <strong>single line</strong>. This is the optional constraint — entities may or may not be linked.</p>
    <div class="rule-card a3">Also called <strong>optional</strong> participation. Business rule language: <em>"Some X may…"</em>, <em>"An X can but doesn't have to…"</em>, <em>"X is not required to…"</em></div>
    <div class="tip-card a4">Business rule: "Some EMPLOYEE may manage a DEPARTMENT (but most employees don't manage anything)." → single line from EMPLOYEE to manages.</div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 960 500" style="width:100%;height:100%" font-family="'DM Sans',sans-serif">
      <!-- EMPLOYEE entity -->
      <rect x="40" y="194" width="220" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="150" y="236" text-anchor="middle" font-size="20" font-weight="700" fill="#042f2e">EMPLOYEE</text>

      <!-- SINGLE LINE both sides (partial) -->
      <line x1="260" y1="229" x2="376" y2="229" stroke="#94a3b8" stroke-width="2"/>
      <text x="318" y="214" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">1</text>

      <!-- manages diamond -->
      <polygon points="488,190 600,229 488,268 376,229" fill="#0d3d3a" stroke="#94a3b8" stroke-width="2.5"/>
      <text x="488" y="235" text-anchor="middle" font-size="17" font-weight="700" fill="#94a3b8">manages</text>

      <line x1="600" y1="229" x2="700" y2="229" stroke="#94a3b8" stroke-width="2"/>
      <text x="650" y="214" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">1</text>

      <!-- DEPARTMENT entity -->
      <rect x="700" y="194" width="240" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
      <text x="820" y="236" text-anchor="middle" font-size="20" font-weight="700" fill="#042f2e">DEPARTMENT</text>

      <!-- Annotation EMPLOYEE -->
      <rect x="20" y="315" width="270" height="72" rx="10" fill="rgba(100,116,139,0.1)" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="155" y="344" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial participation</text>
      <text x="155" y="366" text-anchor="middle" font-size="13" fill="#64748b">Only SOME employees</text>
      <text x="155" y="384" text-anchor="middle" font-size="13" fill="#64748b">manage a department</text>

      <!-- Annotation DEPARTMENT -->
      <rect x="680" y="315" width="270" height="72" rx="10" fill="rgba(100,116,139,0.1)" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="815" y="344" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial participation</text>
      <text x="815" y="366" text-anchor="middle" font-size="13" fill="#64748b">Some departments may</text>
      <text x="815" y="384" text-anchor="middle" font-size="13" fill="#64748b">have no manager yet</text>

      <!-- Single line label -->
      <text x="318" y="258" text-anchor="middle" font-size="12" fill="#94a3b8">Single line ──</text>
    </svg>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 12 SIDE-BY-SIDE COMPARISON ────────────────────────────────────────────
  {
    classes: 's-compare',
    label: '12 Total vs Partial — Side by Side',
    html: `<div class="compare-inner">
  <h2 class="a1">Total vs. Partial at a Glance</h2>
  <div class="compare-cols">
    <div class="compare-card green a2">
      <div>
        <div class="compare-title" style="color:#15803d">Total Participation (══)</div>
        <div class="compare-tag" style="color:#166534">EVERY entity must participate</div>
      </div>
      <div class="compare-rule" style="background:#dcfce7;color:#14532d">Entity ══ Relationship</div>
      <div class="compare-item" style="color:#166534">Every ORDER must belong to a CUSTOMER</div>
      <div class="compare-item" style="color:#166534">Every ORDER_ITEM must be part of an ORDER</div>
      <div class="compare-item" style="color:#166534;border-bottom:0">Every EMPLOYEE must work in a DEPARTMENT</div>
      <div class="compare-rule" style="background:#bbf7d0;color:#14532d;font-size:14px;margin-top:8px">Key words: <em>must · every · all · required · always</em></div>
    </div>

    <div class="compare-card slate a3">
      <div>
        <div class="compare-title" style="color:#475569">Partial Participation (──)</div>
        <div class="compare-tag" style="color:#64748b">SOME entities may not participate</div>
      </div>
      <div class="compare-rule" style="background:#f1f5f9;color:#475569">Entity ── Relationship</div>
      <div class="compare-item" style="color:#475569">Some CUSTOMER may not have placed any ORDER</div>
      <div class="compare-item" style="color:#475569">Some EMPLOYEE may not manage any DEPARTMENT</div>
      <div class="compare-item" style="color:#475569;border-bottom:0">Some LECTURER may not supervise any STUDENT</div>
      <div class="compare-rule" style="background:#e2e8f0;color:#475569;font-size:14px;margin-top:8px">Key words: <em>may · can · optional · might · not required</em></div>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 13 SECTION BREAK: ACTIVITIES ──────────────────────────────────────────
  {
    classes: 's-sectionbreak',
    label: '13 Section — Activities',
    html: `<div class="sb-watermark">03</div>
<div class="sb-inner">
  <p class="sb-eyebrow a1">ACTIVITIES</p>
  <h2 class="a2">Apply What You've Learned</h2>
  <p class="a3">2 activities · Composite attributes + Participation constraints</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 14 ACTIVITY 1 ─────────────────────────────────────────────────────────
  {
    classes: 's-act',
    label: '14 Activity 1 — Bookstore',
    html: `<div class="act-body">
  <div class="act-left">
    <div class="act-badge a1" style="background:#fef3c7;color:#92400e">Activity 1</div>
    <h2 class="a2">An Online Bookstore</h2>
    <p class="scenario-text a3">A bookstore system stores details about <strong>BOOK</strong> and <strong>AUTHOR</strong> entities.<br/><br/>
      Each <strong>BOOK</strong> has a BookId (key), a Title, a Price, and a full publication address comprising <strong>Building</strong>, <strong>StreetName</strong>, <strong>City</strong>, and <strong>Country</strong>.<br/><br/>
      Each <strong>AUTHOR</strong> has an AuthorId (key) and a full name with <strong>FirstName</strong> and <strong>LastName</strong>.
    </p>
    <div class="task-box a4">
      <div class="task-title">Your Task</div>
      <p>1. Identify the composite attributes in both entities.<br/>2. Draw the ER diagram showing both entities with all their attributes using Chen's notation. Show composite sub-attributes branching correctly.</p>
    </div>
    <div class="hint-card a5">Look for attributes described with "comprising", "consisting of", or that have multiple parts. Each part that could be queried independently is a sub-attribute.</div>
  </div>
  <div class="act-right">
    <div style="width:100%;height:100%;border:2px dashed #a7f3d0;border-radius:16px;display:flex;align-items:center;justify-content:center;background:#f0fdfa">
      <p style="font-size:20px;color:#5eead4;font-weight:500">Your diagram here</p>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 15 ACTIVITY 1 ANSWER ──────────────────────────────────────────────────
  {
    classes: 's-ans',
    label: '15 Answer 1 — Bookstore',
    html: `<div class="ans-header">
  <span style="background:#dcfce7;color:#14532d;padding:6px 18px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Answer</span>
  <h2>Activity 1 — Bookstore ER Diagram</h2>
</div>
<div style="flex:1;position:relative;overflow:hidden">
<svg style="width:100%;height:100%" viewBox="0 0 1920 870" font-family="'DM Sans',sans-serif">

  <!-- BOOK entity -->
  <rect x="200" y="360" width="200" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="300" y="402" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">BOOK</text>

  <!-- BookId (key) -->
  <line x1="250" y1="360" x2="200" y2="278" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="178" cy="258" rx="68" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="178" y="255" text-anchor="middle" font-size="14" fill="#042f2e" font-weight="600" text-decoration="underline">BookId</text>

  <!-- Title (simple) -->
  <line x1="310" y1="360" x2="340" y2="278" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="356" cy="258" rx="52" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="356" y="263" text-anchor="middle" font-size="14" fill="#374151">Title</text>

  <!-- Price (simple) -->
  <line x1="375" y1="375" x2="440" y2="318" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="468" cy="302" rx="52" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="468" y="307" text-anchor="middle" font-size="14" fill="#374151">Price</text>

  <!-- PublicationAddress (composite) -->
  <line x1="265" y1="432" x2="240" y2="510" stroke="#0f766e" stroke-width="2"/>
  <ellipse cx="235" cy="542" rx="122" ry="34" fill="#f0fdfa" stroke="#0f766e" stroke-width="3"/>
  <text x="235" y="549" text-anchor="middle" font-size="15" font-weight="700" fill="#0f766e">PublicationAddress</text>

  <!-- PublicationAddress sub-attrs -->
  <line x1="156" y1="568" x2="88" y2="638" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="66" cy="658" rx="66" ry="24" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="66" y="663" text-anchor="middle" font-size="12" fill="#134e4a">Building</text>

  <line x1="196" y1="575" x2="170" y2="650" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="166" cy="672" rx="72" ry="24" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="166" y="677" text-anchor="middle" font-size="12" fill="#134e4a">StreetName</text>

  <line x1="270" y1="576" x2="295" y2="650" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="300" cy="672" rx="50" ry="24" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="300" y="677" text-anchor="middle" font-size="12" fill="#134e4a">City</text>

  <line x1="340" y1="564" x2="405" y2="638" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="426" cy="658" rx="66" ry="24" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="426" y="663" text-anchor="middle" font-size="12" fill="#134e4a">Country</text>

  <!-- Composite label annotation -->
  <text x="235" y="730" text-anchor="middle" font-size="13" fill="#0f766e" font-weight="600">↑ Composite attribute (4 sub-attrs)</text>

  <!-- AUTHOR entity -->
  <rect x="1450" y="360" width="220" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="1560" y="402" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">AUTHOR</text>

  <!-- AuthorId (key) -->
  <line x1="1500" y1="360" x2="1440" y2="278" stroke="#64748b" stroke-width="1.5"/>
  <ellipse cx="1414" cy="258" rx="72" ry="26" fill="white" stroke="#64748b" stroke-width="2"/>
  <text x="1414" y="255" text-anchor="middle" font-size="14" fill="#042f2e" font-weight="600" text-decoration="underline">AuthorId</text>

  <!-- Name (composite) -->
  <line x1="1620" y1="360" x2="1690" y2="282" stroke="#0f766e" stroke-width="2"/>
  <ellipse cx="1720" cy="258" rx="72" ry="30" fill="#f0fdfa" stroke="#0f766e" stroke-width="3"/>
  <text x="1720" y="264" text-anchor="middle" font-size="16" font-weight="700" fill="#0f766e">Name</text>

  <!-- Name sub-attrs -->
  <line x1="1666" y1="234" x2="1600" y2="174" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="1570" cy="154" rx="72" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="1570" y="159" text-anchor="middle" font-size="13" fill="#134e4a">FirstName</text>

  <line x1="1774" y1="234" x2="1836" y2="174" stroke="#0f766e" stroke-width="1"/>
  <ellipse cx="1862" cy="154" rx="68" ry="26" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
  <text x="1862" y="159" text-anchor="middle" font-size="13" fill="#134e4a">LastName</text>

  <text x="1720" y="320" text-anchor="middle" font-size="13" fill="#0f766e" font-weight="600">↑ Composite attribute (2 sub-attrs)</text>

  <!-- Middle separator + labels -->
  <line x1="700" y1="100" x2="700" y2="750" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="8,6"/>
  <text x="960" y="130" text-anchor="middle" font-size="20" font-weight="700" fill="#0f766e" letter-spacing="0.08em">KEY: Composite attributes highlighted in teal</text>
  <rect x="720" y="152" width="480" height="44" rx="8" fill="rgba(15,118,110,0.08)" stroke="rgba(45,212,191,0.3)"/>
  <text x="960" y="180" text-anchor="middle" font-size="14" fill="#5eead4">Teal ellipse (thick border) = composite parent · Small teal ellipses = sub-attributes</text>
</svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 16 ACTIVITY 2 ─────────────────────────────────────────────────────────
  {
    classes: 's-act',
    label: '16 Activity 2 — University Participation',
    html: `<div class="act-body">
  <div class="act-left">
    <div class="act-badge a1" style="background:#fef3c7;color:#92400e">Activity 2</div>
    <h2 class="a2">A University System</h2>
    <p class="scenario-text a3">A university database tracks <strong>LECTURER</strong> and <strong>MODULE</strong> entities. The following business rules apply:<br/><br/>
      <strong>(1)</strong> Every LECTURER must teach at least one MODULE.<br/>
      <strong>(2)</strong> A MODULE may or may not currently be taught (some modules are inactive).<br/>
      <strong>(3)</strong> Every MODULE must be assigned to exactly one DEPARTMENT.<br/>
      <strong>(4)</strong> A DEPARTMENT can exist even if it currently has no MODULEs assigned.
    </p>
    <div class="task-box a4">
      <div class="task-title">Your Task</div>
      <p>Draw the ER diagram segment showing LECTURER, MODULE, and DEPARTMENT with their <strong>teaches</strong> and <strong>assigned_to</strong> relationships. Apply the correct participation constraints (double or single lines) based on the 4 business rules above.</p>
    </div>
  </div>
  <div class="act-right">
    <div style="width:100%;height:100%;border:2px dashed #a7f3d0;border-radius:16px;display:flex;align-items:center;justify-content:center;background:#f0fdfa">
      <p style="font-size:20px;color:#5eead4;font-weight:500">Your diagram here</p>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 17 ACTIVITY 2 ANSWER ──────────────────────────────────────────────────
  {
    classes: 's-ans',
    label: '17 Answer 2 — University Participation',
    html: `<div class="ans-header">
  <span style="background:#dcfce7;color:#14532d;padding:6px 18px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Answer</span>
  <h2>Activity 2 — University Participation Constraints</h2>
</div>
<div style="flex:1;position:relative;overflow:hidden">
<svg style="width:100%;height:100%" viewBox="0 0 1920 790" font-family="'DM Sans',sans-serif">

  <!-- LECTURER entity -->
  <rect x="80" y="330" width="240" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="200" y="372" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">LECTURER</text>

  <!-- teaches diamond -->
  <polygon points="620,296 760,368 620,440 480,368" fill="#0d3d3a" stroke="#2dd4bf" stroke-width="3"/>
  <text x="620" y="374" text-anchor="middle" font-size="18" font-weight="700" fill="#5eead4">teaches</text>

  <!-- MODULE entity -->
  <rect x="850" y="330" width="220" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="960" y="372" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">MODULE</text>

  <!-- assigned_to diamond -->
  <polygon points="1360,296 1500,368 1360,440 1220,368" fill="#0d3d3a" stroke="#2dd4bf" stroke-width="3"/>
  <text x="1360" y="374" text-anchor="middle" font-size="17" font-weight="700" fill="#5eead4">assigned_to</text>

  <!-- DEPARTMENT entity -->
  <rect x="1590" y="330" width="250" height="72" rx="4" fill="white" stroke="#134e4a" stroke-width="3"/>
  <text x="1715" y="372" text-anchor="middle" font-size="22" font-weight="700" fill="#042f2e">DEPARTMENT</text>

  <!-- LECTURER ══ teaches (Rule 1: every lecturer MUST teach) -->
  <line x1="320" y1="362" x2="480" y2="362" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="320" y1="369" x2="480" y2="369" stroke="#16a34a" stroke-width="2.5"/>
  <text x="400" y="348" text-anchor="middle" font-size="20" font-weight="700" fill="#16a34a">N</text>

  <!-- teaches ── MODULE (Rule 2: module MAY not be taught) -->
  <line x1="760" y1="366" x2="850" y2="366" stroke="#94a3b8" stroke-width="2"/>
  <text x="805" y="348" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">M</text>

  <!-- MODULE ══ assigned_to (Rule 3: every module MUST be in a dept) -->
  <line x1="1070" y1="362" x2="1220" y2="362" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="1070" y1="369" x2="1220" y2="369" stroke="#16a34a" stroke-width="2.5"/>
  <text x="1145" y="348" text-anchor="middle" font-size="20" font-weight="700" fill="#16a34a">N</text>

  <!-- assigned_to ── DEPARTMENT (Rule 4: dept CAN have no modules) -->
  <line x1="1500" y1="366" x2="1590" y2="366" stroke="#94a3b8" stroke-width="2"/>
  <text x="1545" y="348" text-anchor="middle" font-size="20" font-weight="700" fill="#374151">1</text>

  <!-- Annotation boxes -->
  <rect x="60" y="460" width="270" height="72" rx="10" fill="rgba(22,163,74,0.1)" stroke="#16a34a" stroke-width="1.5"/>
  <text x="195" y="487" text-anchor="middle" font-size="14" font-weight="700" fill="#16a34a">Total (Rule 1)</text>
  <text x="195" y="508" text-anchor="middle" font-size="13" fill="#166534">Every lecturer MUST</text>
  <text x="195" y="526" text-anchor="middle" font-size="13" fill="#166534">teach at least one module</text>

  <rect x="840" y="460" width="250" height="72" rx="10" fill="rgba(100,116,139,0.08)" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="965" y="487" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial (Rule 2)</text>
  <text x="965" y="508" text-anchor="middle" font-size="13" fill="#64748b">Some modules MAY</text>
  <text x="965" y="526" text-anchor="middle" font-size="13" fill="#64748b">be inactive (untaught)</text>

  <rect x="840" y="545" width="250" height="72" rx="10" fill="rgba(22,163,74,0.1)" stroke="#16a34a" stroke-width="1.5"/>
  <text x="965" y="572" text-anchor="middle" font-size="14" font-weight="700" fill="#16a34a">Total (Rule 3)</text>
  <text x="965" y="592" text-anchor="middle" font-size="13" fill="#166534">Every module MUST</text>
  <text x="965" y="610" text-anchor="middle" font-size="13" fill="#166534">be in a department</text>

  <rect x="1570" y="460" width="270" height="72" rx="10" fill="rgba(100,116,139,0.08)" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="1705" y="487" text-anchor="middle" font-size="14" font-weight="700" fill="#475569">Partial (Rule 4)</text>
  <text x="1705" y="508" text-anchor="middle" font-size="13" fill="#64748b">Departments CAN exist</text>
  <text x="1705" y="526" text-anchor="middle" font-size="13" fill="#64748b">with no modules yet</text>

  <!-- Legend -->
  <rect x="660" y="680" width="600" height="72" rx="10" fill="rgba(15,118,110,0.08)" stroke="rgba(45,212,191,0.2)"/>
  <line x1="700" y1="715" x2="750" y2="715" stroke="#16a34a" stroke-width="2.5"/>
  <line x1="700" y1="721" x2="750" y2="721" stroke="#16a34a" stroke-width="2.5"/>
  <text x="766" y="720" font-size="14" fill="#5eead4">Double line = Total (mandatory)</text>
  <line x1="950" y1="718" x2="1000" y2="718" stroke="#94a3b8" stroke-width="2"/>
  <text x="1016" y="720" font-size="14" fill="#94a3b8">Single line = Partial (optional)</text>
</svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 18 SYMBOL REFERENCE ───────────────────────────────────────────────────
  {
    classes: 's-ref',
    label: '18 Symbol Reference',
    html: `<div class="ref-inner">
  <h2 class="a1">Chen's Notation — Complete Symbol Reference</h2>
  <div class="ref-grid">
    <div class="ref-card a2">
      <div class="ref-name">Entity</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><rect x="10" y="8" width="140" height="44" rx="4" fill="white" stroke="#134e4a" stroke-width="2.5"/><text x="80" y="35" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" font-weight="700" fill="#042f2e">ENTITY</text></svg>
      <div class="ref-desc">Rectangle. Represents a real-world object or concept.</div>
    </div>
    <div class="ref-card a2">
      <div class="ref-name">Key Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><ellipse cx="80" cy="32" rx="68" ry="24" fill="white" stroke="#64748b" stroke-width="2"/><text x="80" y="29" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" font-weight="600" fill="#042f2e" text-decoration="underline">KeyAttr</text></svg>
      <div class="ref-desc">Ellipse with underlined text. Uniquely identifies each entity instance.</div>
    </div>
    <div class="ref-card a2">
      <div class="ref-name">Simple Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><ellipse cx="80" cy="32" rx="68" ry="24" fill="white" stroke="#64748b" stroke-width="2"/><text x="80" y="37" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#374151">Attribute</text></svg>
      <div class="ref-desc">Plain ellipse. Holds a single, indivisible value.</div>
    </div>
    <div class="ref-card a3">
      <div class="ref-name">Composite Attribute</div>
      <svg viewBox="0 0 160 80" style="height:60px;width:auto">
        <ellipse cx="80" cy="52" rx="68" ry="24" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.5"/>
        <text x="80" y="57" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" font-weight="700" fill="#0f766e">Composite</text>
        <line x1="44" y1="30" x2="26" y2="12" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="20" cy="8" rx="24" ry="10" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <line x1="80" y1="28" x2="80" y2="12" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="80" cy="8" rx="24" ry="10" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
        <line x1="116" y1="30" x2="134" y2="12" stroke="#0f766e" stroke-width="1.5"/>
        <ellipse cx="140" cy="8" rx="24" ry="10" fill="#ccfbf1" stroke="#0f766e" stroke-width="1.5"/>
      </svg>
      <div class="ref-desc">Outer teal ellipse with branching smaller ellipses for sub-attributes.</div>
    </div>
    <div class="ref-card a3">
      <div class="ref-name">Multivalued Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><ellipse cx="80" cy="32" rx="68" ry="24" fill="white" stroke="#b45309" stroke-width="2"/><ellipse cx="80" cy="32" rx="58" ry="16" fill="#fef9c3" stroke="#b45309" stroke-width="2"/><text x="80" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#92400e">{MultiValue}</text></svg>
      <div class="ref-desc">Double ellipse. Holds multiple values simultaneously.</div>
    </div>
    <div class="ref-card a3">
      <div class="ref-name">Derived Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><ellipse cx="80" cy="32" rx="68" ry="24" fill="white" stroke="#64748b" stroke-width="2" stroke-dasharray="7,4"/><text x="80" y="37" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#64748b">(Derived)</text></svg>
      <div class="ref-desc">Dashed ellipse. Computed from other data — never stored.</div>
    </div>
    <div class="ref-card a4">
      <div class="ref-name">Relationship</div>
      <svg viewBox="0 0 160 70" style="height:52px;width:auto"><polygon points="80,6 150,36 80,66 10,36" fill="white" stroke="#b45309" stroke-width="2.5"/><text x="80" y="40" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#7c2d12">rel_name</text></svg>
      <div class="ref-desc">Diamond. Links two or more entity types.</div>
    </div>
    <div class="ref-card a4">
      <div class="ref-name">Weak Entity</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><rect x="6" y="4" width="148" height="52" rx="4" fill="none" stroke="#4c1d95" stroke-width="2"/><rect x="14" y="10" width="132" height="40" rx="2" fill="white" stroke="#4c1d95" stroke-width="2"/><text x="80" y="35" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" font-weight="700" fill="#3b0764">WEAK</text></svg>
      <div class="ref-desc">Double rectangle. Cannot exist without its identifying entity.</div>
    </div>
    <div class="ref-card a4">
      <div class="ref-name">Total Participation</div>
      <svg viewBox="0 0 160 40" style="height:32px;width:auto">
        <line x1="10" y1="14" x2="150" y2="14" stroke="#16a34a" stroke-width="2.5"/>
        <line x1="10" y1="22" x2="150" y2="22" stroke="#16a34a" stroke-width="2.5"/>
        <text x="80" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#16a34a">══ double line</text>
      </svg>
      <div class="ref-desc">Double line. Every entity must participate (mandatory).</div>
    </div>
    <div class="ref-card a5">
      <div class="ref-name">Partial Participation</div>
      <svg viewBox="0 0 160 40" style="height:32px;width:auto">
        <line x1="10" y1="18" x2="150" y2="18" stroke="#94a3b8" stroke-width="2"/>
        <text x="80" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#94a3b8">── single line</text>
      </svg>
      <div class="ref-desc">Single line (default). Some entities may not participate (optional).</div>
    </div>
    <div class="ref-card a5">
      <div class="ref-name">Identifying Relationship</div>
      <svg viewBox="0 0 160 70" style="height:52px;width:auto"><polygon points="80,6 148,36 80,66 12,36" fill="none" stroke="#4c1d95" stroke-width="2.5"/><polygon points="80,16 136,36 80,56 24,36" fill="white" stroke="#4c1d95" stroke-width="2"/><text x="80" y="40" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#3b0764">id-rel</text></svg>
      <div class="ref-desc">Double diamond. Links weak entity to its identifying entity.</div>
    </div>
    <div class="ref-card a5">
      <div class="ref-name">Relationship Attribute</div>
      <svg viewBox="0 0 160 60" style="height:46px;width:auto"><line x1="80" y1="0" x2="80" y2="14" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,3"/><ellipse cx="80" cy="40" rx="68" ry="22" fill="white" stroke="#64748b" stroke-width="2"/><text x="80" y="44" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#374151">Grade</text></svg>
      <div class="ref-desc">Ellipse connected to diamond (dashed line). Attribute of the relationship.</div>
    </div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 19 KEY TAKEAWAYS ──────────────────────────────────────────────────────
  {
    classes: 's-takeaways',
    label: '19 Key Takeaways',
    html: `<div class="takeaways-inner">
  <h2 class="a1">Key Takeaways</h2>
  <div class="takeaway-list">
    <div class="takeaway-item a2"><div class="takeaway-num">1</div><p>A <strong>composite attribute</strong> has sub-attributes — draw as an outer teal ellipse with smaller ellipses branching off it via lines.</p></div>
    <div class="takeaway-item a3"><div class="takeaway-num">2</div><p>Sub-attributes represent <strong>individually meaningful parts</strong> — e.g., City and PostCode from Address. You can query each part independently in SQL.</p></div>
    <div class="takeaway-item a4"><div class="takeaway-num">3</div><p>In SQL mapping, <strong>only the leaf sub-attributes become columns</strong>. The composite parent is never a column — it only exists in the ER diagram.</p></div>
    <div class="takeaway-item a5"><div class="takeaway-num">4</div><p><strong>Total participation (══)</strong> = every entity MUST participate. The business rule says "must", "every", or "all". Maps to NOT NULL FK in SQL.</p></div>
    <div class="takeaway-item a5" style="animation-delay:.75s"><div class="takeaway-num">5</div><p><strong>Partial participation (──)</strong> = some entities are optional. The rule says "may", "can", or "optional". The FK column allows NULL in SQL.</p></div>
  </div>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },

  // ── 20 END ────────────────────────────────────────────────────────────────
  {
    classes: 's-end',
    label: '20 End',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1800" cy="200" r="380" fill="rgba(15,118,110,0.06)"/>
  <circle cx="120" cy="880" r="300" fill="rgba(45,212,191,0.04)"/>
</svg>
<div class="end-inner a1">
  <p style="font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:#134e4a;margin-bottom:28px;font-weight:700">MBI802 · ER DIAGRAMS SERIES</p>
  <h1>End of Lesson 4</h1>
  <p>Next up: ER to Relational Schema Mapping</p>
  <p class="end-note">Use the flashcards below to review key terms.</p>
</div>
<div class="cr">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
];

const FLASHCARDS: { front: string; back: string }[] = [
  { front: 'What is a composite attribute?', back: 'An attribute made up of multiple sub-attributes, each holding a distinct piece of information. Example: Address = StreetNumber + StreetName + City + PostCode.' },
  { front: 'How is a composite attribute drawn in Chen\'s notation?', back: 'An outer ellipse (the composite parent, drawn with a thicker teal border) with smaller sub-attribute ellipses connected to it by lines — like branches.' },
  { front: 'Give an example of a composite attribute in a booking system.', back: 'GuestName (FirstName, LastName), CheckInAddress (StreetName, Suburb, City, PostCode), or ContactDetails (PhoneNumber, Email).' },
  { front: 'Why break an attribute into composite sub-attributes?', back: 'To allow querying or processing individual parts — e.g., sorting by LastName, filtering by City, or extracting PostCode for delivery routing.' },
  { front: 'What is the difference between composite and multivalued?', back: 'Composite: ONE value split into parts (Name = First + Last). Multivalued: MULTIPLE separate values ({PhoneNumber} = 021…, 09…). Different notations and SQL mappings.' },
  { front: 'How does a composite attribute map to SQL?', back: 'Each sub-attribute becomes its own column. The composite parent itself does NOT become a column. E.g., Address → street_name, city, post_code columns.' },
  { front: 'What is a participation constraint?', back: 'A rule specifying whether ALL entities in an entity set (total participation) or just SOME (partial participation) must participate in at least one instance of a relationship.' },
  { front: 'What does total participation mean and how is it drawn?', back: 'Every entity instance MUST participate in at least one relationship instance. Drawn as a DOUBLE LINE (══) between the entity and the relationship diamond.' },
  { front: 'What does partial participation mean and how is it drawn?', back: 'Some entity instances do NOT have to participate in any relationship instance. Drawn as a SINGLE LINE (──) — the default notation.' },
  { front: 'A business rule says "Every ORDER must belong to a CUSTOMER". What participation does ORDER have?', back: 'Total participation — drawn as a double line from ORDER to the places/belongs_to relationship diamond. Maps to NOT NULL FK in SQL.' },
  { front: 'A business rule says "A CUSTOMER may or may not have placed an ORDER". What participation does CUSTOMER have?', back: 'Partial participation — drawn as a single line (default) from CUSTOMER to the relationship diamond. The FK column in ORDER allows NULL.' },
  { front: 'How do you identify total vs. partial participation from a business rule?', back: 'Total: key words are "must", "every", "all", "required", "always". Partial: key words are "may", "can", "optional", "might", "not necessarily".' },
];

export default function ERAttributeConstraintsDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  useEffect(() => {
    const styleId = 'ecp-deck-styles';
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
            style={{ borderColor: 'rgba(45,212,191,0.3)' }}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-600 min-w-[80px] text-center">{current + 1} / {total}</span>
          <button onClick={() => setCurrent(c => Math.min(c + 1, total - 1))} disabled={current === total - 1}
            className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(45,212,191,0.3)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
        <span className="text-xs font-medium text-gray-400 hidden sm:block">{slide.label}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(45,212,191,0.3)' }} title={expanded ? 'Collapse' : 'Expand'}>
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={fullscreen ? exitFs : goFs}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(45,212,191,0.3)' }} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div ref={wrapRef} className="ecp relative w-full overflow-hidden rounded-xl"
        style={{ border: '1px solid rgba(45,212,191,0.3)' }}>
        <div ref={canvasRef} style={{ width: 1920, height: 1080 }}>
          <section className={slide.classes} dangerouslySetInnerHTML={{ __html: slide.html }} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => setCurrent(i)} title={s.label} className="rounded-full transition-all"
            style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#0f766e' : 'rgba(15,118,110,0.25)' }} />
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 4, height: 24, borderRadius: 2, background: '#0f766e', flexShrink: 0 }} />
          <h3 className="text-lg font-bold text-gray-800">Flashcards</h3>
          <span className="text-sm text-gray-400">· Click a card to flip</span>
          <button onClick={() => setFlipped({})}
            className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ color: '#0f766e', borderColor: 'rgba(15,118,110,0.3)' }}>
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
                  border: '1.5px solid rgba(15,118,110,0.2)',
                  display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ fontSize: 11, color: '#0f766e', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Question</div>
                  <p style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.55, flex: 1 }}>{card.front}</p>
                  <div style={{ fontSize: 11, color: '#5eead4', marginTop: 8, textAlign: 'right' }}>Tap to reveal ›</div>
                </div>
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  background: '#f0fdfa', borderRadius: 12, padding: '18px 22px',
                  border: '1.5px solid rgba(15,118,110,0.35)',
                  display: 'flex', flexDirection: 'column',
                  transform: 'rotateY(180deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ fontSize: 11, color: '#0f766e', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Answer</div>
                  <p style={{ fontSize: 14, color: '#134e4a', lineHeight: 1.55, flex: 1 }}>{card.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
