import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

.erc *{box-sizing:border-box;margin:0;padding:0}
.erc{font-family:'DM Sans',sans-serif}
.erc section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.erc .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none}
.erc .cr-light{color:rgba(255,255,255,.35)}
.erc .cr-dark{color:#94a3b8}

.erc .s-title{background:#0b1728;justify-content:center;align-items:center}
.erc .s-title .inner{text-align:center}
.erc .s-title .eyebrow{font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;margin-bottom:24px;font-weight:500}
.erc .s-title h1{font-family:'Playfair Display',serif;font-size:88px;color:#f8fafc;line-height:1.05;margin-bottom:32px}
.erc .s-title .sub{font-size:26px;color:#94a3b8;font-weight:300;letter-spacing:.03em}
.erc .s-title .sub2{font-size:18px;color:#475569;margin-top:18px;letter-spacing:.05em}
.erc .s-title .deco-line{width:120px;height:3px;background:#60a5fa;margin:36px auto}

.erc .s-overview{background:#0b1728}
.erc .overview-header{padding:58px 100px 28px;text-align:center;flex-shrink:0}
.erc .overview-header .eyebrow{font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#60a5fa;margin-bottom:14px;font-weight:600}
.erc .overview-header h2{font-family:'Playfair Display',serif;font-size:50px;color:#f1f5f9}
.erc .overview-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;padding:0 80px 68px;flex:1}
.erc .overview-card{border-radius:16px;padding:34px 30px 30px;display:flex;flex-direction:column;background:#0d1f36;border:1px solid}
.erc .overview-card-num{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:18px}
.erc .overview-card h3{font-size:27px;font-weight:700;color:#f1f5f9;margin-bottom:10px;line-height:1.2}
.erc .overview-card p{font-size:18px;color:#64748b;line-height:1.65;flex:1}
.erc .overview-card .ov-symbol{margin-bottom:18px}

.erc .s-concept{background:#0d1f36}
.erc .concept-body{display:flex;flex:1;min-height:0}
.erc .concept-left{width:790px;flex-shrink:0;padding:72px 68px 72px 96px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid #1e3a5a}
.erc .concept-right{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 48px;background:#091525}
.erc .concept-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:22px;width:fit-content}
.erc .concept-left h2{font-family:'Playfair Display',serif;font-size:54px;color:#f1f5f9;line-height:1.05;margin-bottom:20px}
.erc .concept-desc{font-size:20px;color:#94a3b8;line-height:1.75;margin-bottom:26px}
.erc .concept-desc strong{color:#e2e8f0;font-weight:600}
.erc .concept-rule{border-radius:12px;padding:20px 24px;background:#0f2744;border-left:5px solid;margin-bottom:20px}
.erc .concept-rule .rule-title{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.erc .concept-rule p{font-size:18px;color:#cbd5e1;line-height:1.65}
.erc .concept-rule strong{font-weight:700}
.erc .concept-chips{display:flex;flex-wrap:wrap;gap:10px}
.erc .concept-chip{padding:7px 16px;border-radius:8px;font-size:15px;font-weight:500;background:#0b1e35;border:1px solid}
.erc .concept-note{border-radius:10px;padding:18px 22px;margin-top:18px}
.erc .concept-note .note-label{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
.erc .concept-note p{font-size:18px;line-height:1.6}
.erc .derived-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.erc .derived-item{background:#0c3b4f;border-radius:8px;padding:12px 14px}
.erc .derived-item .di-key{font-size:15px;color:#67e8f9;font-weight:600;margin-bottom:3px}
.erc .derived-item .di-val{font-size:13px;color:#475569}

.erc .s-legend{background:#0d1f36}
.erc .s-legend .leg-header{padding:46px 96px 0;flex-shrink:0}
.erc .s-legend .leg-header h2{font-family:'Playfair Display',serif;font-size:44px;color:#f1f5f9}
.erc .s-legend .leg-header p{font-size:21px;color:#64748b;margin-top:8px}

.erc .s-act{background:#fdfaf5}
.erc .s-act .act-top{display:flex;height:100%}
.erc .s-act .act-left{width:840px;flex-shrink:0;padding:66px 74px 66px 90px;display:flex;flex-direction:column;border-right:1px solid #e8e0d4}
.erc .s-act .act-right{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:58px;position:relative}
.erc .act-badge{display:inline-flex;align-items:center;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:24px;width:fit-content}
.erc .act-left h2{font-family:'Playfair Display',serif;font-size:44px;color:#0f172a;line-height:1.1;margin-bottom:26px}
.erc .scenario-text{font-size:20px;color:#334155;line-height:1.72;margin-bottom:26px;flex:1}
.erc .scenario-text strong{color:#0f172a;font-weight:600}
.erc .entities-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:26px}
.erc .entity-pill{padding:6px 18px;border-radius:6px;font-size:15px;font-weight:600;letter-spacing:.03em}
.erc .task-card{border-radius:12px;padding:20px 26px;border-left:5px solid}
.erc .task-card .task-title{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.erc .task-card ul{list-style:none;padding:0}
.erc .task-card ul li{font-size:17px;color:#1e293b;padding:4px 0;display:flex;align-items:flex-start;gap:10px}
.erc .task-card ul li::before{content:'→';font-weight:700;flex-shrink:0;margin-top:1px}

.erc .s-ans{background:#f4f6fb}
.erc .ans-header{padding:0 90px;height:96px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #dde3f5;flex-shrink:0;background:#fff}
.erc .ans-badge{padding:7px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.erc .ans-header h2{font-family:'Playfair Display',serif;font-size:36px;color:#0f172a}
.erc .ans-header .micro-legend{margin-left:auto;display:flex;gap:22px;align-items:center}
.erc .micro-legend-item{display:flex;align-items:center;gap:8px;font-size:15px;color:#475569;font-weight:500}
.erc .ml-entity{width:34px;height:19px;background:#1e40af;border-radius:2px}
.erc .ml-weak{width:34px;height:19px;border:3px solid #1e40af;border-radius:2px;background:#1e3a8a}
.erc .ml-rel{width:19px;height:19px;background:#92400e;transform:rotate(45deg);flex-shrink:0}
.erc .ml-attr{width:38px;height:20px;border:2px solid #64748b;border-radius:50%}
.erc .ans-diagram{flex:1;display:flex;align-items:center;justify-content:center;padding:20px 60px 52px;min-height:0}
.erc .ans-diagram svg{width:100%;height:100%;display:block;overflow:visible}

.erc .et{font:700 22px 'DM Sans',sans-serif;fill:white}
.erc .rt{font:700 17px 'DM Sans',sans-serif;fill:white}
.erc .at{font:500 16px 'DM Sans',sans-serif;fill:#1e293b}
.erc .ct{font:700 26px 'DM Sans',sans-serif}
.erc .ln{stroke:#94a3b8;stroke-width:2.5;fill:none}`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  {
    classes: 's-title',
    label: '01 Title',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
    <pattern id="erc-dots" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
      <circle cx="32" cy="32" r="1.5" fill="rgba(148,163,184,0.14)"/>
    </pattern>
    <rect width="1920" height="1080" fill="url(#erc-dots)"/>
    <circle cx="1760" cy="120" r="340" fill="rgba(96,165,250,0.04)"/>
    <circle cx="1800" cy="160" r="180" fill="rgba(96,165,250,0.06)"/>
    <rect x="1530" y="200" width="280" height="88" rx="5" fill="none" stroke="rgba(59,130,246,0.10)" stroke-width="3"/>
    <rect x="1544" y="214" width="252" height="60" rx="4" fill="none" stroke="rgba(59,130,246,0.07)" stroke-width="2"/>
    <polygon points="1660,520 1790,600 1660,680 1530,600" fill="none" stroke="rgba(180,83,9,0.12)" stroke-width="2.5"/>
    <polygon points="1660,538 1770,600 1660,662 1550,600" fill="none" stroke="rgba(180,83,9,0.08)" stroke-width="2"/>
    <ellipse cx="200" cy="820" rx="150" ry="58" fill="none" stroke="rgba(6,182,212,0.12)" stroke-width="2" stroke-dasharray="12,7"/>
    <ellipse cx="160" cy="220" rx="130" ry="50" fill="none" stroke="rgba(168,85,247,0.10)" stroke-width="2"/>
    <ellipse cx="160" cy="220" rx="110" ry="33" fill="none" stroke="rgba(168,85,247,0.07)" stroke-width="2"/>
    <circle cx="300" cy="960" r="260" fill="rgba(96,165,250,0.03)"/>
  </svg>
  <div class="inner">
    <p class="eyebrow">Database Management Systems</p>
    <h1>Advanced ER<br/>Concepts</h1>
    <div class="deco-line"></div>
    <p class="sub">Chen's Notation · Weak Entities · Special Attributes</p>
    <p class="sub2">Prerequisite: Basic ER Diagram knowledge</p>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-overview',
    label: '02 What You Will Learn',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
    <circle cx="1820" cy="80" r="320" fill="rgba(96,165,250,0.04)"/>
    <circle cx="80" cy="1000" r="240" fill="rgba(96,165,250,0.03)"/>
  </svg>
  <div class="overview-header">
    <p class="eyebrow">This lesson covers</p>
    <h2>Four New Concepts to Master</h2>
  </div>
  <div class="overview-grid">
    <div class="overview-card" style="border-color:#1e3a8a;">
      <div class="ov-symbol">
        <svg viewBox="0 0 150 74" style="width:150px;height:74px">
          <rect x="3" y="3" width="144" height="68" rx="4" fill="none" stroke="#3b82f6" stroke-width="3"/>
          <rect x="14" y="14" width="122" height="46" rx="3" fill="#1e3a8a"/>
          <text x="75" y="42" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#93c5fd" font-weight="700">ENTITY</text>
        </svg>
      </div>
      <div class="overview-card-num" style="color:#3b82f6;">01 — Concept</div>
      <h3>Weak Entity</h3>
      <p>An entity that cannot be uniquely identified on its own — it depends on a stronger entity for its very existence.</p>
    </div>
    <div class="overview-card" style="border-color:#78350f;">
      <div class="ov-symbol">
        <svg viewBox="0 0 150 90" style="width:150px;height:90px">
          <polygon points="75,8 142,45 75,82 8,45" fill="none" stroke="#f59e0b" stroke-width="3"/>
          <polygon points="75,20 128,45 75,70 22,45" fill="#92400e"/>
          <text x="75" y="50" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="white" font-weight="700">REL</text>
        </svg>
      </div>
      <div class="overview-card-num" style="color:#f59e0b;">02 — Concept</div>
      <h3>Identifying Relationship</h3>
      <p>The special double-diamond that links a weak entity to its owner, providing the missing identity context.</p>
    </div>
    <div class="overview-card" style="border-color:#4c1d95;">
      <div class="ov-symbol">
        <svg viewBox="0 0 180 72" style="width:180px;height:72px">
          <ellipse cx="90" cy="36" rx="86" ry="32" fill="none" stroke="#a855f7" stroke-width="2.5"/>
          <ellipse cx="90" cy="36" rx="70" ry="20" fill="#2e1065" stroke="#a855f7" stroke-width="2"/>
          <text x="90" y="41" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#d8b4fe" font-weight="600">{attribute}</text>
        </svg>
      </div>
      <div class="overview-card-num" style="color:#a855f7;">03 — Concept</div>
      <h3>Multivalued Attribute</h3>
      <p>An attribute that holds multiple values for one entity — like a list of phone numbers or email addresses.</p>
    </div>
    <div class="overview-card" style="border-color:#164e63;">
      <div class="ov-symbol">
        <svg viewBox="0 0 180 72" style="width:180px;height:72px">
          <ellipse cx="90" cy="36" rx="82" ry="30" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
          <text x="90" y="41" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#67e8f9" font-style="italic">(attribute)</text>
        </svg>
      </div>
      <div class="overview-card-num" style="color:#06b6d4;">04 — Concept</div>
      <h3>Derived Attribute</h3>
      <p>An attribute computed from other data — like calculating Age from DateOfBirth. Never stored directly.</p>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-concept',
    label: '03 Weak Entity',
    html: `<div class="concept-body">
    <div class="concept-left">
      <div class="concept-badge" style="background:#1e3a5a;color:#60a5fa;">Concept 01</div>
      <h2>Weak Entity</h2>
      <p class="concept-desc">
        A <strong>weak entity</strong> cannot be uniquely identified by its own attributes alone. It <strong>depends entirely on another entity</strong> — called the <em>strong entity</em> or <em>owner</em> — for both existence and identity.
      </p>
      <div class="concept-rule" style="border-color:#3b82f6;">
        <div class="rule-title" style="color:#3b82f6;">Chen's Notation Symbol</div>
        <p>Drawn as a <strong>double rectangle</strong> — two concentric boxes. The outer border signals "this entity cannot stand alone."</p>
      </div>
      <div class="concept-chips">
        <span class="concept-chip" style="color:#93c5fd;border-color:#1e3a5a;">ROOM depends on BUILDING</span>
        <span class="concept-chip" style="color:#93c5fd;border-color:#1e3a5a;">ORDER_ITEM depends on ORDER</span>
        <span class="concept-chip" style="color:#93c5fd;border-color:#1e3a5a;">DEPENDENT depends on EMPLOYEE</span>
      </div>
    </div>
    <div class="concept-right">
      <svg viewBox="0 0 1010 730" style="width:100%;height:100%">
        <rect x="28" y="18" width="954" height="298" rx="12" fill="#0a1929"/>
        <text x="505" y="58" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#3b82f6" letter-spacing="3" font-weight="700">SYMBOL COMPARISON</text>
        <text x="210" y="96" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#64748b" font-weight="600">Strong Entity</text>
        <rect x="88" y="110" width="244" height="78" rx="4" fill="#1e40af"/>
        <text x="210" y="156" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="23" fill="white" font-weight="700">BUILDING</text>
        <text x="210" y="224" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#64748b">Single border</text>
        <text x="210" y="247" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Has its own primary key (PK)</text>
        <text x="210" y="268" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Can exist independently</text>
        <text x="505" y="162" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="20" fill="#1e293b" font-weight="700">vs</text>
        <text x="800" y="96" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#64748b" font-weight="600">Weak Entity</text>
        <rect x="678" y="108" width="244" height="84" rx="4" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
        <rect x="691" y="121" width="218" height="58" rx="3" fill="#1e3a8a"/>
        <text x="800" y="157" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="23" fill="#93c5fd" font-weight="700">ROOM</text>
        <text x="800" y="224" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#64748b">Double border</text>
        <text x="800" y="247" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Needs BUILDING to be identified</text>
        <text x="800" y="268" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Cannot exist without its owner</text>
        <rect x="28" y="336" width="954" height="376" rx="12" fill="#0a1929"/>
        <text x="505" y="376" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#3b82f6" letter-spacing="3" font-weight="700">PARTIAL KEY (DISCRIMINATOR)</text>
        <text x="505" y="408" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#64748b">Weak entities have a partial key — unique only within their owner entity</text>
        <text x="215" y="450" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Primary Key — solid underline</text>
        <ellipse cx="215" cy="525" rx="108" ry="40" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="215" y="522" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#93c5fd" font-weight="600">BuildingID</text>
        <line x1="120" y1="532" x2="310" y2="532" stroke="#93c5fd" stroke-width="2.5"/>
        <text x="215" y="600" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Uniquely identifies BUILDING</text>
        <text x="215" y="622" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">anywhere in the database</text>
        <text x="215" y="646" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">e.g. BuildingID = "B01"</text>
        <text x="505" y="533" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#1e293b" font-weight="700">vs</text>
        <text x="795" y="450" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Partial Key — dashed underline</text>
        <ellipse cx="795" cy="525" rx="96" ry="40" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="795" y="522" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#93c5fd" font-weight="600">RoomNo</text>
        <line x1="710" y1="532" x2="880" y2="532" stroke="#93c5fd" stroke-width="2.5" stroke-dasharray="6,3"/>
        <text x="795" y="600" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Unique only within one BUILDING</text>
        <text x="795" y="622" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Room 101 could be in ANY building!</text>
        <text x="795" y="646" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Combined key: (BuildingID + RoomNo)</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-concept',
    label: '04 Identifying Relationship',
    html: `<div class="concept-body">
    <div class="concept-left">
      <div class="concept-badge" style="background:#431407;color:#fbbf24;">Concept 02</div>
      <h2>Identifying Relationship</h2>
      <p class="concept-desc">
        The <strong>special relationship</strong> connecting a weak entity to its owner. It provides the ownership context needed to uniquely identify each weak entity instance.
      </p>
      <div class="concept-rule" style="border-color:#f59e0b;">
        <div class="rule-title" style="color:#f59e0b;">Chen's Notation Symbol</div>
        <p>Drawn as a <strong>double diamond</strong> — two concentric diamonds. It <strong>always</strong> connects a weak entity to its strong entity.</p>
      </div>
      <div class="concept-note" style="background:#1a0d00;">
        <div class="note-label" style="color:#fbbf24;">Remember</div>
        <p style="color:#d97706;font-size:18px;line-height:1.6;">If you draw a double diamond, one side <em>must</em> be a weak entity (double rectangle). They always appear together.</p>
      </div>
      <div class="concept-chips" style="margin-top:18px;">
        <span class="concept-chip" style="color:#fbbf24;border-color:#431407;">Cardinality: 1 (strong) to N (weak)</span>
        <span class="concept-chip" style="color:#fbbf24;border-color:#431407;">Weak side: total participation</span>
      </div>
    </div>
    <div class="concept-right">
      <svg viewBox="0 0 1100 590" style="width:100%;height:100%">
        <line x1="380" y1="282" x2="449" y2="282" stroke="#334155" stroke-width="2.5"/>
        <line x1="693" y1="282" x2="754" y2="282" stroke="#334155" stroke-width="2.5"/>
        <line x1="283" y1="247" x2="156" y2="120" stroke="#334155" stroke-width="2.5"/>
        <line x1="182" y1="282" x2="84" y2="282" stroke="#334155" stroke-width="2.5"/>
        <line x1="872" y1="247" x2="998" y2="120" stroke="#334155" stroke-width="2.5"/>
        <line x1="954" y1="282" x2="1050" y2="282" stroke="#334155" stroke-width="2.5"/>
        <rect x="182" y="247" width="198" height="70" rx="4" fill="#1e40af"/>
        <text x="281" y="288" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="white" font-weight="700">BUILDING</text>
        <polygon points="571,210 693,282 571,354 449,282" fill="none" stroke="#b45309" stroke-width="3.5"/>
        <polygon points="571,222 678,282 571,342 464,282" fill="#92400e"/>
        <text x="571" y="288" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="white" font-weight="700">has</text>
        <rect x="754" y="244" width="198" height="76" rx="4" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
        <rect x="767" y="257" width="172" height="50" rx="3" fill="#1e3a8a"/>
        <text x="853" y="288" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#93c5fd" font-weight="700">ROOM</text>
        <ellipse cx="143" cy="100" rx="100" ry="36" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="143" y="97" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#93c5fd" font-weight="600">BuildingID</text>
        <line x1="57" y1="107" x2="229" y2="107" stroke="#93c5fd" stroke-width="2"/>
        <ellipse cx="64" cy="282" rx="68" ry="30" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="64" y="287" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Name</text>
        <ellipse cx="1006" cy="100" rx="88" ry="36" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="1006" y="97" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#93c5fd" font-weight="600">RoomNo</text>
        <line x1="930" y1="107" x2="1082" y2="107" stroke="#93c5fd" stroke-width="2" stroke-dasharray="6,3"/>
        <ellipse cx="1072" cy="282" rx="74" ry="30" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="1072" y="287" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">RoomType</text>
        <text x="427" y="260" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="26" fill="#f59e0b" font-weight="700">1</text>
        <text x="717" y="260" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="26" fill="#f59e0b" font-weight="700">N</text>
        <text x="281" y="358" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Strong Entity</text>
        <text x="571" y="402" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b">Identifying</text>
        <text x="571" y="420" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b">Relationship</text>
        <text x="853" y="374" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#60a5fa">Weak Entity</text>
        <line x1="900" y1="120" x2="970" y2="145" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>
        <rect x="965" y="138" width="128" height="38" rx="6" fill="#0f2744" stroke="#1e3a5a" stroke-width="1.5"/>
        <text x="1029" y="155" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#60a5fa">Dashed underline</text>
        <text x="1029" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">= Partial key</text>
        <rect x="60" y="470" width="980" height="96" rx="8" fill="#1a0d00"/>
        <text x="550" y="507" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#f59e0b" font-weight="700">KEY INSIGHT</text>
        <text x="550" y="531" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#92400e">One BUILDING "owns" many ROOMs. RoomNo 101 only makes sense per building.</text>
        <text x="550" y="553" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#78350f">The combined (composite) key is:  BuildingID + RoomNo</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-concept',
    label: '05 Multivalued Attribute',
    html: `<div class="concept-body">
    <div class="concept-left">
      <div class="concept-badge" style="background:#2e1065;color:#d8b4fe;">Concept 03</div>
      <h2>Multivalued Attribute</h2>
      <p class="concept-desc">
        A <strong>multivalued attribute</strong> can hold <strong>more than one value</strong> for a single entity instance. Rather than one phone number per employee, you can store many.
      </p>
      <div class="concept-rule" style="border-color:#a855f7;">
        <div class="rule-title" style="color:#a855f7;">Chen's Notation Symbol</div>
        <p>Drawn as a <strong>double ellipse</strong> — two concentric ovals. In text notation, written with curly braces: <strong>{PhoneNumbers}</strong>.</p>
      </div>
      <div class="concept-chips">
        <span class="concept-chip" style="color:#d8b4fe;border-color:#3b1469;">{PhoneNumbers}</span>
        <span class="concept-chip" style="color:#d8b4fe;border-color:#3b1469;">{EmailAddresses}</span>
        <span class="concept-chip" style="color:#d8b4fe;border-color:#3b1469;">{Skills}</span>
        <span class="concept-chip" style="color:#d8b4fe;border-color:#3b1469;">{Languages}</span>
      </div>
      <div class="concept-note" style="background:#1a0533;margin-top:18px;">
        <div class="note-label" style="color:#a855f7;">Why not just add 3 phone attributes?</div>
        <p style="color:#7e22ce;font-size:17px;line-height:1.6;">Because we don't know in advance how many values a given instance will have. Double ellipse = flexible, open-ended list.</p>
      </div>
    </div>
    <div class="concept-right">
      <svg viewBox="0 0 940 640" style="width:100%;height:100%">
        <line x1="443" y1="270" x2="268" y2="137" stroke="#334155" stroke-width="2.5"/>
        <line x1="355" y1="308" x2="104" y2="308" stroke="#334155" stroke-width="2.5"/>
        <line x1="443" y1="346" x2="268" y2="479" stroke="#334155" stroke-width="2.5"/>
        <line x1="531" y1="270" x2="690" y2="137" stroke="#a855f7" stroke-width="2.5"/>
        <rect x="355" y="273" width="176" height="70" rx="3" fill="#1e40af"/>
        <text x="443" y="314" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="20" fill="white" font-weight="700">EMPLOYEE</text>
        <ellipse cx="228" cy="110" rx="90" ry="36" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="228" y="107" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#93c5fd" font-weight="600">EmpID</text>
        <line x1="152" y1="116" x2="304" y2="116" stroke="#93c5fd" stroke-width="2"/>
        <ellipse cx="58" cy="308" rx="62" ry="30" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="58" y="313" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Name</text>
        <ellipse cx="228" cy="490" rx="92" ry="34" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="228" y="495" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Department</text>
        <ellipse cx="690" cy="110" rx="136" ry="50" fill="rgba(168,85,247,0.07)"/>
        <ellipse cx="690" cy="110" rx="122" ry="42" fill="none" stroke="#a855f7" stroke-width="2.5"/>
        <ellipse cx="690" cy="110" rx="105" ry="28" fill="#2e1065" stroke="#a855f7" stroke-width="2"/>
        <text x="690" y="115" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#d8b4fe" font-weight="600">PhoneNumbers</text>
        <line x1="812" y1="100" x2="858" y2="88" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="4,3"/>
        <rect x="854" y="64" width="78" height="48" rx="6" fill="#1a0533" stroke="#7e22ce" stroke-width="1.5"/>
        <text x="893" y="85" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#c4b5fd">Double</text>
        <text x="893" y="102" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#c4b5fd">ellipse</text>
        <rect x="540" y="190" width="370" height="130" rx="10" fill="#1a0533"/>
        <text x="725" y="218" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#a855f7" font-weight="700" letter-spacing="1">EXAMPLE: ONE EMPLOYEE'S PHONES</text>
        <rect x="558" y="228" width="334" height="24" rx="4" fill="#2e1065"/>
        <text x="725" y="244" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#e9d5ff">021 123 4567</text>
        <rect x="558" y="258" width="334" height="24" rx="4" fill="#2e1065"/>
        <text x="725" y="274" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#e9d5ff">09 876 5432</text>
        <rect x="558" y="288" width="334" height="24" rx="4" fill="#2e1065"/>
        <text x="725" y="304" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#e9d5ff">027 111 2233</text>
        <rect x="30" y="548" width="880" height="68" rx="8" fill="#0a1929"/>
        <text x="470" y="578" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#a855f7" font-weight="700">In a relational database, multivalued attrs become their own table</text>
        <text x="470" y="600" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">e.g.  EMPLOYEE_PHONE (EmpID, PhoneNumber)</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-concept',
    label: '06 Derived Attribute',
    html: `<div class="concept-body">
    <div class="concept-left">
      <div class="concept-badge" style="background:#083344;color:#67e8f9;">Concept 04</div>
      <h2>Derived Attribute</h2>
      <p class="concept-desc">
        A <strong>derived attribute</strong> is <strong>calculated from other stored data</strong> — it doesn't need to be saved in the database because you can always compute it on demand.
      </p>
      <div class="concept-rule" style="border-color:#06b6d4;">
        <div class="rule-title" style="color:#06b6d4;">Chen's Notation Symbol</div>
        <p>Drawn as a <strong>dashed ellipse</strong> — the broken border signals "this value isn't stored directly." In text: written as <strong>(Age)</strong> with parentheses.</p>
      </div>
      <div class="concept-chips">
        <span class="concept-chip" style="color:#67e8f9;border-color:#083344;">(Age) from DateOfBirth</span>
        <span class="concept-chip" style="color:#67e8f9;border-color:#083344;">(TotalPrice) from UnitPrice × Qty</span>
        <span class="concept-chip" style="color:#67e8f9;border-color:#083344;">(YearsOfService) from HireDate</span>
      </div>
      <div class="concept-note" style="background:#041b24;margin-top:18px;">
        <div class="note-label" style="color:#06b6d4;">Why not just store it?</div>
        <p style="color:#0e7490;font-size:17px;line-height:1.6;">Storing derived data risks <strong style="color:#67e8f9;">inconsistency</strong>. If DateOfBirth changes, a stored Age becomes wrong. Compute it instead — always accurate.</p>
      </div>
    </div>
    <div class="concept-right">
      <svg viewBox="0 0 940 640" style="width:100%;height:100%">
        <line x1="400" y1="275" x2="215" y2="128" stroke="#334155" stroke-width="2.5"/>
        <line x1="325" y1="310" x2="84" y2="310" stroke="#334155" stroke-width="2.5"/>
        <line x1="400" y1="345" x2="215" y2="490" stroke="#334155" stroke-width="2.5"/>
        <line x1="475" y1="275" x2="650" y2="128" stroke="#06b6d4" stroke-width="2.5"/>
        <line x1="540" y1="310" x2="720" y2="310" stroke="#334155" stroke-width="2.5"/>
        <rect x="325" y="275" width="215" height="70" rx="3" fill="#1e40af"/>
        <text x="432" y="316" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="21" fill="white" font-weight="700">PERSON</text>
        <ellipse cx="175" cy="106" rx="98" ry="36" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
        <text x="175" y="103" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#93c5fd" font-weight="600">PersonID</text>
        <line x1="90" y1="113" x2="260" y2="113" stroke="#93c5fd" stroke-width="2"/>
        <ellipse cx="55" cy="310" rx="56" ry="28" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="55" y="315" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Name</text>
        <ellipse cx="180" cy="492" rx="102" ry="36" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="180" y="497" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#475569">DateOfBirth</text>
        <ellipse cx="660" cy="108" rx="110" ry="44" fill="rgba(6,182,212,0.05)"/>
        <ellipse cx="660" cy="108" rx="96" ry="38" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
        <text x="660" y="113" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="#67e8f9" font-style="italic">Age</text>
        <line x1="756" y1="94" x2="800" y2="78" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4,3"/>
        <rect x="796" y="54" width="100" height="52" rx="6" fill="#041b24" stroke="#0e7490" stroke-width="1.5"/>
        <text x="846" y="76" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#67e8f9">Dashed ellipse</text>
        <text x="846" y="93" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#475569">= Not stored</text>
        <ellipse cx="752" cy="310" rx="72" ry="28" fill="none" stroke="#334155" stroke-width="2"/>
        <text x="752" y="315" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Email</text>
        <rect x="180" y="390" width="590" height="130" rx="10" fill="#041b24"/>
        <text x="475" y="419" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#06b6d4" font-weight="700" letter-spacing="1">HOW AGE IS DERIVED</text>
        <rect x="200" y="428" width="160" height="46" rx="6" fill="#0e7490"/>
        <text x="280" y="447" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#e0f2fe">DateOfBirth</text>
        <text x="280" y="464" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#7dd3fc">1990-05-14 ✓ stored</text>
        <text x="400" y="456" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#334155">→</text>
        <rect x="420" y="428" width="150" height="46" rx="6" fill="#0c4a6e"/>
        <text x="495" y="447" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#e0f2fe">Today − DOB</text>
        <text x="495" y="464" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#7dd3fc">SQL: DATEDIFF()</text>
        <text x="610" y="456" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="22" fill="#334155">→</text>
        <rect x="630" y="428" width="120" height="46" rx="6" fill="#083344" stroke="#06b6d4" stroke-width="2" stroke-dasharray="6,3"/>
        <text x="690" y="447" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#67e8f9">Age</text>
        <text x="690" y="465" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#0e7490">34 ✗ not stored</text>
        <rect x="30" y="556" width="880" height="58" rx="8" fill="#0a1929"/>
        <text x="470" y="580" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="#06b6d4" font-weight="700">Dashed ellipse = "I can compute this — no need to store it"</text>
        <text x="470" y="602" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#475569">Always stays accurate — automatically reflects the latest data</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-legend',
    label: '07 Symbol Reference',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
    <circle cx="1800" cy="900" r="400" fill="rgba(96,165,250,0.03)"/>
  </svg>
  <div class="leg-header">
    <h2>Advanced Symbol Reference — Quick Guide</h2>
    <p>All four new symbols at a glance. Use this slide as your reference.</p>
  </div>
  <svg viewBox="0 0 1720 820" style="width:100%;flex:1;padding:0 40px">
    <g transform="translate(200,160)">
      <rect x="-105" y="-40" width="210" height="80" rx="4" fill="#1e40af"/>
      <text text-anchor="middle" dy="7" font-family="'DM Sans',sans-serif" font-size="21" fill="white" font-weight="700">ENTITY</text>
      <text x="0" y="72" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Strong Entity</text>
      <text x="0" y="96" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Single rectangle</text>
      <text x="0" y="116" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Has its own primary key</text>
    </g>
    <g transform="translate(640,160)">
      <rect x="-105" y="-46" width="210" height="92" rx="5" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
      <rect x="-90" y="-32" width="180" height="64" rx="3" fill="#1e3a8a"/>
      <text text-anchor="middle" dy="7" font-family="'DM Sans',sans-serif" font-size="21" fill="#93c5fd" font-weight="700">ENTITY</text>
      <text x="0" y="78" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Weak Entity</text>
      <text x="0" y="102" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Double rectangle</text>
      <text x="0" y="122" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Depends on strong entity</text>
    </g>
    <g transform="translate(1080,160)">
      <polygon points="0,-60 120,0 0,60 -120,0" fill="#92400e"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="18" fill="white" font-weight="700">REL</text>
      <text x="0" y="84" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Relationship</text>
      <text x="0" y="108" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Single diamond</text>
      <text x="0" y="128" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Between regular entities</text>
    </g>
    <g transform="translate(1530,160)">
      <polygon points="0,-66 128,0 0,66 -128,0" fill="none" stroke="#f59e0b" stroke-width="3.5"/>
      <polygon points="0,-50 106,0 0,50 -106,0" fill="#92400e"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="15" fill="white" font-weight="700">REL</text>
      <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Identifying Rel.</text>
      <text x="0" y="114" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Double diamond</text>
      <text x="0" y="134" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Links weak entity to owner</text>
    </g>
    <line x1="80" y1="360" x2="1640" y2="360" stroke="#1e3a5a" stroke-width="1.5"/>
    <g transform="translate(200,520)">
      <ellipse rx="105" ry="44" fill="none" stroke="#475569" stroke-width="2.5"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="17" fill="#94a3b8">attribute</text>
      <text x="0" y="70" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Attribute</text>
      <text x="0" y="94" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Single ellipse</text>
      <text x="0" y="114" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">One value per entity</text>
    </g>
    <g transform="translate(640,520)">
      <ellipse rx="105" ry="44" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
      <text text-anchor="middle" dy="2" font-family="'DM Sans',sans-serif" font-size="17" fill="#93c5fd" font-weight="600">attribute</text>
      <line x1="-54" y1="10" x2="54" y2="10" stroke="#93c5fd" stroke-width="2"/>
      <text x="0" y="70" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Key Attribute</text>
      <text x="0" y="94" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Solid underline = Primary Key</text>
      <text x="0" y="114" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Uniquely identifies entity</text>
    </g>
    <g transform="translate(1080,520)">
      <ellipse rx="108" ry="50" fill="rgba(168,85,247,0.05)"/>
      <ellipse rx="94" ry="42" fill="none" stroke="#a855f7" stroke-width="2.5"/>
      <ellipse rx="78" ry="28" fill="#2e1065" stroke="#a855f7" stroke-width="2"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="14" fill="#d8b4fe">{attribute}</text>
      <text x="0" y="74" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Multivalued</text>
      <text x="0" y="98" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Double ellipse — {curly braces}</text>
      <text x="0" y="118" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Multiple values per entity</text>
    </g>
    <g transform="translate(1530,520)">
      <ellipse rx="108" ry="44" fill="rgba(6,182,212,0.04)"/>
      <ellipse rx="94" ry="38" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
      <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="17" fill="#67e8f9" font-style="italic">(attribute)</text>
      <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Derived Attribute</text>
      <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Dashed ellipse — (parentheses)</text>
      <text x="0" y="110" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Calculated, never stored</text>
    </g>
    <g transform="translate(640,720)">
      <ellipse rx="105" ry="40" fill="#1e3a5a" stroke="#3b82f6" stroke-width="2.5"/>
      <text text-anchor="middle" dy="2" font-family="'DM Sans',sans-serif" font-size="17" fill="#93c5fd" font-weight="600">partialKey</text>
      <line x1="-54" y1="10" x2="54" y2="10" stroke="#93c5fd" stroke-width="2" stroke-dasharray="6,3"/>
      <text x="0" y="60" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="16" fill="#e2e8f0" font-weight="600">Partial Key</text>
      <text x="0" y="80" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">Dashed underline — belongs to weak entity</text>
    </g>
  </svg>
  <div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '08 Exercise 1 Scenario',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.35" viewBox="0 0 1920 1080">
    <circle cx="1700" cy="540" r="500" fill="none" stroke="#fde68a" stroke-width="1"/>
    <circle cx="1700" cy="540" r="330" fill="none" stroke="#fde68a" stroke-width="1"/>
    <circle cx="1700" cy="540" r="160" fill="none" stroke="#fde68a" stroke-width="1"/>
  </svg>
  <div class="act-top">
    <div class="act-left">
      <div class="act-badge" style="background:#fef3c7;color:#92400e;">Exercise 01</div>
      <h2>University Building &amp; Rooms</h2>
      <p class="scenario-text">
        A <strong>university</strong> manages its campus facilities. Each <strong>building</strong> has a building ID, name, and location. Each building has many <strong>rooms</strong>, but a room number (like "101") only makes sense within a specific building — Room 101 could exist in <em>every</em> building.<br/><br/>
        Each room has a room number and a room type (lecture hall, lab, office). A room <strong>cannot exist</strong> without its building. Additionally, each room has a <strong>seating capacity</strong> and a <em>utilisation rate</em> which is <strong>automatically calculated</strong> from bookings data. Buildings can have <strong>multiple contact phone numbers</strong> on record.
      </p>
      <div class="entities-row">
        <span class="entity-pill" style="background:#dbeafe;color:#1e40af;">BUILDING (strong)</span>
        <span class="entity-pill" style="background:#1e3a8a;color:#93c5fd;">ROOM (weak)</span>
        <span class="entity-pill" style="background:#fef3c7;color:#92400e;">HAS (identifying)</span>
      </div>
      <div class="task-card" style="background:#fffbeb;border-color:#d97706;">
        <div class="task-title" style="color:#d97706;">Your Task</div>
        <ul>
          <li>Draw BUILDING as a strong entity with its key attribute</li>
          <li>Draw ROOM as a weak entity with its partial key (RoomNo)</li>
          <li>Connect them with an identifying relationship (double diamond)</li>
          <li>Show PhoneNumbers as a multivalued attribute on BUILDING</li>
          <li>Show UtilisationRate as a derived attribute on ROOM</li>
        </ul>
      </div>
    </div>
    <div class="act-right">
      <svg viewBox="0 0 400 380" style="width:360px;height:auto;">
        <rect x="10" y="330" width="380" height="16" rx="4" fill="#d1c4a8"/>
        <rect x="60" y="120" width="280" height="210" rx="4" fill="#1e40af"/>
        <polygon points="40,120 200,40 360,120" fill="#1e3a8a"/>
        <rect x="88"  y="148" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="148" y="148" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="208" y="148" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="268" y="148" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="88"  y="204" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="148" y="204" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="208" y="204" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="268" y="204" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="88"  y="260" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="268" y="260" width="44" height="36" rx="2" fill="#bfdbfe"/>
        <rect x="168" y="268" width="64" height="62" rx="4" fill="#0b1728"/>
        <circle cx="224" cy="300" r="4" fill="#fbbf24"/>
        <rect x="110" y="68" width="180" height="28" rx="4" fill="#0b1728"/>
        <text x="200" y="87" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#60a5fa" font-weight="700" letter-spacing="2">BUILDING A</text>
        <text x="110" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#1e3a8a" font-weight="700">101</text>
        <text x="170" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#1e3a8a" font-weight="700">102</text>
        <text x="230" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#1e3a8a" font-weight="700">103</text>
        <text x="290" y="170" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#1e3a8a" font-weight="700">104</text>
        <text x="200" y="360" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#94a3b8">Room 101 exists in EVERY building!</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '09 Answer 1 Building Rooms',
    html: `<div class="ans-header">
    <span class="ans-badge" style="background:#fef3c7;color:#92400e;">Answer 01</span>
    <h2>University Building &amp; Rooms</h2>
    <div class="micro-legend">
      <div class="micro-legend-item"><div class="ml-entity"></div> Strong Entity</div>
      <div class="micro-legend-item"><div class="ml-weak"></div> Weak Entity</div>
      <div class="micro-legend-item"><div class="ml-rel"></div> Identifying Rel.</div>
      <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
    </div>
  </div>
  <div class="ans-diagram">
    <svg viewBox="0 0 1720 640" preserveAspectRatio="xMidYMid meet">
      <line x1="390" y1="310" x2="522" y2="310" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="698" y1="310" x2="810" y2="310" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="290" y1="275" x2="170" y2="130" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="190" y1="310" x2="52" y2="310" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="290" y1="345" x2="170" y2="490" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="210" y1="322" x2="90" y2="420" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="910" y1="275" x2="1030" y2="130" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="1010" y1="310" x2="1148" y2="310" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="910" y1="345" x2="1030" y2="490" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="1010" y1="270" x2="1160" y2="168" stroke="#94a3b8" stroke-width="2.5"/>
      <rect x="190" y="275" width="200" height="70" rx="3" fill="#1e40af"/>
      <text x="290" y="316" text-anchor="middle" class="et">BUILDING</text>
      <polygon points="610,238 698,310 610,382 522,310" fill="none" stroke="#b45309" stroke-width="3.5"/>
      <polygon points="610,250 686,310 610,370 534,310" fill="#92400e"/>
      <text x="610" y="316" text-anchor="middle" class="rt">has</text>
      <rect x="808" y="271" width="204" height="78" rx="4" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
      <rect x="821" y="283" width="178" height="54" rx="3" fill="#1e3a8a"/>
      <text x="910" y="316" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="21" fill="#93c5fd" font-weight="700">ROOM</text>
      <ellipse cx="148" cy="110" rx="104" ry="36" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
      <text x="148" y="107" text-anchor="middle" class="at" font-weight="600">BuildingID</text>
      <line x1="56" y1="117" x2="240" y2="117" stroke="#1e293b" stroke-width="2"/>
      <ellipse cx="42" cy="310" rx="62" ry="44" fill="none" stroke="#a855f7" stroke-width="2.5"/>
      <ellipse cx="42" cy="310" rx="48" ry="31" fill="#2e1065" stroke="#a855f7" stroke-width="1.8"/>
      <text x="42" y="306" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#d8b4fe" font-weight="600">{Phone</text>
      <text x="42" y="320" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="12" fill="#d8b4fe" font-weight="600">Numbers}</text>
      <ellipse cx="148" cy="490" rx="84" ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="148" y="495" text-anchor="middle" class="at">Name</text>
      <ellipse cx="78" cy="420" rx="76" ry="30" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="78" y="425" text-anchor="middle" class="at">Location</text>
      <ellipse cx="1060" cy="110" rx="98" ry="36" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.5"/>
      <text x="1060" y="107" text-anchor="middle" class="at" font-weight="600">RoomNo</text>
      <line x1="972" y1="117" x2="1148" y2="117" stroke="#1e293b" stroke-width="2" stroke-dasharray="6,3"/>
      <ellipse cx="1196" cy="310" rx="108" ry="38" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
      <text x="1196" y="306" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#67e8f9" font-style="italic">(Utilisation</text>
      <text x="1196" y="322" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#67e8f9" font-style="italic">Rate)</text>
      <ellipse cx="1060" cy="490" rx="86" ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="1060" y="495" text-anchor="middle" class="at">Capacity</text>
      <ellipse cx="1178" cy="168" rx="84" ry="30" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="1178" y="173" text-anchor="middle" class="at">RoomType</text>
      <text x="496" y="288" text-anchor="middle" class="ct" fill="#d97706">1</text>
      <text x="724" y="288" text-anchor="middle" class="ct" fill="#d97706">N</text>
      <rect x="1360" y="90" width="330" height="68" rx="8" fill="#1a0533"/>
      <text x="1525" y="116" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#a855f7" font-weight="700">Double ellipse = Multivalued</text>
      <text x="1525" y="138" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">{PhoneNumbers} → multiple values</text>
      <rect x="1360" y="185" width="330" height="68" rx="8" fill="#041b24"/>
      <text x="1525" y="211" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#06b6d4" font-weight="700">Dashed ellipse = Derived</text>
      <text x="1525" y="233" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">(UtilisationRate) → computed</text>
      <rect x="1360" y="280" width="330" height="68" rx="8" fill="#0a1929"/>
      <text x="1525" y="306" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#3b82f6" font-weight="700">Dashed underline = Partial Key</text>
      <text x="1525" y="328" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">RoomNo unique only per building</text>
      <rect x="1360" y="375" width="330" height="68" rx="8" fill="#1a0d00"/>
      <text x="1525" y="401" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b" font-weight="700">Double diamond = Identifying Rel.</text>
      <text x="1525" y="423" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">HAS links weak ROOM to BUILDING</text>
    </svg>
  </div>
  <div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '10 Exercise 2 Scenario',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
    <circle cx="1700" cy="540" r="480" fill="none" stroke="#a7f3d0" stroke-width="1"/>
    <circle cx="1700" cy="540" r="300" fill="none" stroke="#a7f3d0" stroke-width="1"/>
  </svg>
  <div class="act-top">
    <div class="act-left">
      <div class="act-badge" style="background:#d1fae5;color:#065f46;">Exercise 02</div>
      <h2>Employee &amp; Dependants</h2>
      <p class="scenario-text">
        A company tracks its <strong>employees</strong> and their <strong>dependants</strong> (family members covered by insurance). Each employee has an employee ID, name, hire date, and date of birth. A <strong>dependant</strong> has only a name and relationship (e.g. "spouse", "child") — and <strong>cannot exist in the system without their employee</strong>. A dependant named "Emma" only makes sense in the context of a specific employee.<br/><br/>
        Employees may speak <strong>multiple languages</strong>. The company also needs to display each employee's <em>years of service</em> on their profile — but this should <strong>never be stored</strong> directly in the database.
      </p>
      <div class="entities-row">
        <span class="entity-pill" style="background:#d1fae5;color:#065f46;">EMPLOYEE (strong)</span>
        <span class="entity-pill" style="background:#064e3b;color:#6ee7b7;">DEPENDANT (weak)</span>
        <span class="entity-pill" style="background:#fef3c7;color:#92400e;">HAS_DEPENDANT (identifying)</span>
      </div>
      <div class="task-card" style="background:#ecfdf5;border-color:#059669;">
        <div class="task-title" style="color:#059669;">Your Task</div>
        <ul>
          <li>Identify and draw EMPLOYEE as a strong entity with EmpID as key</li>
          <li>Draw DEPENDANT as a weak entity; DepName is the partial key</li>
          <li>Connect them with HAS_DEPENDANT as an identifying relationship</li>
          <li>Add Languages as a multivalued attribute on EMPLOYEE</li>
          <li>Add YearsOfService as a derived attribute on EMPLOYEE</li>
        </ul>
      </div>
    </div>
    <div class="act-right">
      <svg viewBox="0 0 400 380" style="width:340px;height:auto;">
        <rect x="10" y="340" width="380" height="14" rx="4" fill="#d1c4a8"/>
        <circle cx="180" cy="80" r="38" fill="#059669"/>
        <text x="180" y="87" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="white" font-weight="700">EMP</text>
        <rect x="148" y="124" width="64" height="88" rx="8" fill="#065f46"/>
        <rect x="96" y="132" width="52" height="14" rx="6" fill="#065f46"/>
        <rect x="212" y="132" width="52" height="14" rx="6" fill="#065f46"/>
        <rect x="155" y="212" width="22" height="64" rx="6" fill="#064e3b"/>
        <rect x="183" y="212" width="22" height="64" rx="6" fill="#064e3b"/>
        <rect x="160" y="138" width="40" height="28" rx="3" fill="#a7f3d0"/>
        <text x="180" y="158" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="9" fill="#065f46" font-weight="700">ID CARD</text>
        <circle cx="72" cy="200" r="26" fill="#34d399"/>
        <text x="72" y="207" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="white" font-weight="700">DEP</text>
        <rect x="56" y="230" width="32" height="50" rx="6" fill="#6ee7b7"/>
        <line x1="144" y1="175" x2="96" y2="205" stroke="#6ee7b7" stroke-width="3"/>
        <circle cx="290" cy="200" r="26" fill="#34d399"/>
        <text x="290" y="207" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="10" fill="white" font-weight="700">DEP</text>
        <rect x="274" y="230" width="32" height="50" rx="6" fill="#6ee7b7"/>
        <line x1="218" y1="175" x2="268" y2="205" stroke="#6ee7b7" stroke-width="3"/>
        <text x="72" y="296" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Emma (child)</text>
        <text x="290" y="296" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">James (spouse)</text>
        <text x="180" y="310" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#059669" font-weight="600">Sarah Chen — Emp #E042</text>
        <text x="180" y="362" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#94a3b8">"Emma" is meaningless without Sarah!</text>
      </svg>
    </div>
  </div>
  <div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '11 Answer 2 Employee Dependants',
    html: `<div class="ans-header">
    <span class="ans-badge" style="background:#d1fae5;color:#065f46;">Answer 02</span>
    <h2>Employee &amp; Dependants</h2>
    <div class="micro-legend">
      <div class="micro-legend-item"><div class="ml-entity"></div> Strong Entity</div>
      <div class="micro-legend-item"><div class="ml-weak"></div> Weak Entity</div>
      <div class="micro-legend-item"><div class="ml-rel"></div> Identifying Rel.</div>
      <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
    </div>
  </div>
  <div class="ans-diagram">
    <svg viewBox="0 0 1720 640" preserveAspectRatio="xMidYMid meet">
      <line x1="410" y1="300" x2="520" y2="300" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="700" y1="300" x2="810" y2="300" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="310" y1="265" x2="158" y2="108" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="210" y1="300" x2="52" y2="300" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="310" y1="335" x2="182" y2="492" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="310" y1="260" x2="78" y2="168" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="410" y1="270" x2="488" y2="120" stroke="#06b6d4" stroke-width="2.5"/>
      <line x1="910" y1="268" x2="1050" y2="108" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="1010" y1="300" x2="1158" y2="300" stroke="#94a3b8" stroke-width="2.5"/>
      <rect x="210" y="265" width="200" height="70" rx="3" fill="#059669"/>
      <text x="310" y="306" text-anchor="middle" class="et">EMPLOYEE</text>
      <polygon points="610,232 700,300 610,368 520,300" fill="none" stroke="#b45309" stroke-width="3.5"/>
      <polygon points="610,244 688,300 610,356 532,300" fill="#92400e"/>
      <text x="610" y="295" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="white" font-weight="700">has_</text>
      <text x="610" y="312" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="white" font-weight="700">dept</text>
      <rect x="808" y="261" width="204" height="78" rx="4" fill="none" stroke="#3b82f6" stroke-width="3.5"/>
      <rect x="820" y="272" width="180" height="56" rx="3" fill="#064e3b"/>
      <text x="910" y="306" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="19" fill="#6ee7b7" font-weight="700">DEPENDANT</text>
      <ellipse cx="133" cy="86" rx="100" ry="36" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
      <text x="133" y="83" text-anchor="middle" class="at" font-weight="600">EmpID</text>
      <line x1="46" y1="92" x2="220" y2="92" stroke="#1e293b" stroke-width="2"/>
      <ellipse cx="38" cy="300" rx="52" ry="42" fill="none" stroke="#a855f7" stroke-width="2.5"/>
      <ellipse cx="38" cy="300" rx="40" ry="28" fill="#2e1065" stroke="#a855f7" stroke-width="1.8"/>
      <text x="38" y="296" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#d8b4fe" font-weight="600">{Lang-</text>
      <text x="38" y="310" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="11" fill="#d8b4fe" font-weight="600">uages}</text>
      <ellipse cx="153" cy="492" rx="96" ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="153" y="497" text-anchor="middle" class="at">HireDate</text>
      <ellipse cx="56" cy="168" rx="66" ry="28" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="56" y="173" text-anchor="middle" class="at">Name</text>
      <ellipse cx="500" cy="100" rx="108" ry="38" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="9,5"/>
      <text x="500" y="96" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#67e8f9" font-style="italic">(YearsOf</text>
      <text x="500" y="112" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#67e8f9" font-style="italic">Service)</text>
      <ellipse cx="1066" cy="86" rx="100" ry="36" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.5"/>
      <text x="1066" y="83" text-anchor="middle" class="at" font-weight="600">DepName</text>
      <line x1="978" y1="92" x2="1154" y2="92" stroke="#1e293b" stroke-width="2" stroke-dasharray="6,3"/>
      <ellipse cx="1196" cy="300" rx="100" ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
      <text x="1196" y="305" text-anchor="middle" class="at">Relationship</text>
      <text x="496" y="278" text-anchor="middle" class="ct" fill="#059669">1</text>
      <text x="726" y="278" text-anchor="middle" class="ct" fill="#059669">N</text>
      <rect x="1350" y="60" width="340" height="66" rx="8" fill="#2e1065"/>
      <text x="1520" y="85" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#d8b4fe" font-weight="700">{Languages} — Multivalued</text>
      <text x="1520" y="108" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#7e22ce">Many languages per employee</text>
      <rect x="1350" y="148" width="340" height="66" rx="8" fill="#041b24"/>
      <text x="1520" y="173" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#67e8f9" font-weight="700">(YearsOfService) — Derived</text>
      <text x="1520" y="196" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#0e7490">Computed from HireDate</text>
      <rect x="1350" y="236" width="340" height="66" rx="8" fill="#0a1929"/>
      <text x="1520" y="261" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#60a5fa" font-weight="700">DepName — Partial Key</text>
      <text x="1520" y="284" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Unique only per employee</text>
      <rect x="1350" y="324" width="340" height="66" rx="8" fill="#1a0d00"/>
      <text x="1520" y="349" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b" font-weight="700">HAS_DEPT — Identifying Rel.</text>
      <text x="1520" y="372" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#78350f">DEPENDANT cannot exist alone</text>
      <rect x="1350" y="412" width="340" height="66" rx="8" fill="#0d1f36"/>
      <text x="1520" y="437" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#3b82f6" font-weight="700">DEPENDANT — Weak Entity</text>
      <text x="1520" y="460" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#475569">Double rectangle — depends on EMPLOYEE</text>
    </svg>
  </div>
  <div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
];

export default function ERAdvancedConceptsDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  useEffect(() => {
    const styleId = 'erc-deck-styles';
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
          <button
            onClick={() => setCurrent(c => Math.max(c - 1, 0))}
            disabled={current === 0}
            className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(96,165,250,0.3)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-600 min-w-[80px] text-center">
            {current + 1} / {total}
          </span>
          <button
            onClick={() => setCurrent(c => Math.min(c + 1, total - 1))}
            disabled={current === total - 1}
            className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(96,165,250,0.3)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <span className="text-xs font-medium text-gray-400 hidden sm:block">{slide.label}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(96,165,250,0.3)' }}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={fullscreen ? exitFs : goFs}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(96,165,250,0.3)' }}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="erc relative w-full overflow-hidden rounded-xl"
        style={{ border: '1px solid rgba(96,165,250,0.3)' }}
      >
        <div ref={canvasRef} style={{ width: 1920, height: 1080 }}>
          <section
            className={slide.classes}
            dangerouslySetInnerHTML={{ __html: slide.html }}
          />
        </div>
      </div>

      <div className={`flex flex-wrap justify-center gap-1.5 ${expanded ? 'mt-2' : ''}`}>
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            title={s.label}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? '#60a5fa' : 'rgba(96,165,250,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
