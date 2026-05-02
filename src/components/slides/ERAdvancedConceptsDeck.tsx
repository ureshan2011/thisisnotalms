import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

.erc *{box-sizing:border-box;margin:0;padding:0}
.erc section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.erc .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none}
.erc .cr-light{color:rgba(255,255,255,.35)}
.erc .cr-dark{color:#94a3b8}

/* ── Title slide ─────────────────────────────────────── */
.erc .s-title{background:#0b1728;justify-content:center;align-items:center}
.erc .s-title .inner{text-align:center}
.erc .s-title .eyebrow{font-size:24px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;margin-bottom:28px;font-weight:500}
.erc .s-title h1{font-family:'Playfair Display',serif;font-size:90px;color:#f8fafc;line-height:1.05;margin-bottom:32px}
.erc .s-title .sub{font-size:26px;color:#94a3b8;font-weight:300;letter-spacing:.03em}
.erc .s-title .deco-line{width:120px;height:3px;background:#60a5fa;margin:36px auto}

/* ── Overview slide ──────────────────────────────────── */
.erc .s-overview{background:#0b1728;justify-content:flex-start}
.erc .overview-header{padding:60px 100px 40px;flex-shrink:0}
.erc .overview-header .eyebrow{font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;font-weight:600;margin-bottom:16px}
.erc .overview-header h2{font-family:'Playfair Display',serif;font-size:56px;color:#f1f5f9;line-height:1}
.erc .overview-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;padding:0 100px 80px;flex:1;align-content:center}
.erc .overview-card{background:rgba(255,255,255,.05);border:1px solid rgba(96,165,250,.15);border-radius:20px;padding:40px 36px;display:flex;flex-direction:column;gap:20px;transition:border-color .2s}
.erc .overview-card-num{font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#60a5fa}
.erc .ov-symbol{display:flex;align-items:center;justify-content:center;height:80px}
.erc .overview-card h3{font-family:'Playfair Display',serif;font-size:28px;color:#f1f5f9;line-height:1.2}
.erc .overview-card p{font-size:18px;color:#94a3b8;line-height:1.6;font-weight:300}

/* ── Concept slides ──────────────────────────────────── */
.erc .s-concept{background:#0d1f36;justify-content:flex-start}
.erc .concept-body{display:flex;flex:1;min-height:0}
.erc .concept-left{width:900px;flex-shrink:0;padding:64px 80px 80px 100px;display:flex;flex-direction:column;justify-content:flex-start;border-right:1px solid rgba(255,255,255,.07)}
.erc .concept-right{flex:1;display:flex;align-items:center;justify-content:center;padding:60px 80px}
.erc .concept-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:28px;width:fit-content}
.erc .concept-left h2{font-family:'Playfair Display',serif;font-size:52px;color:#f1f5f9;line-height:1.1;margin-bottom:24px}
.erc .concept-desc{font-size:21px;color:#94a3b8;line-height:1.7;margin-bottom:32px}
.erc .concept-rule{background:rgba(255,255,255,.05);border-radius:14px;padding:24px 28px;margin-bottom:24px;border-left:4px solid}
.erc .rule-title{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.erc .concept-rule ul{list-style:none;padding:0}
.erc .concept-rule ul li{font-size:18px;color:#cbd5e1;padding:4px 0;display:flex;align-items:flex-start;gap:10px;line-height:1.5}
.erc .concept-rule ul li::before{content:'→';font-weight:700;flex-shrink:0;margin-top:2px}
.erc .concept-chips{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px}
.erc .concept-chip{padding:6px 18px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:.02em}
.erc .concept-note{background:rgba(96,165,250,.08);border:1px solid rgba(96,165,250,.2);border-radius:12px;padding:18px 24px;margin-top:auto}
.erc .note-label{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#60a5fa;margin-bottom:6px}
.erc .concept-note p{font-size:17px;color:#94a3b8;line-height:1.5}

/* ── Legend slide ────────────────────────────────────── */
.erc .s-legend{background:#0d1f36}
.erc .s-legend .leg-header{padding:52px 100px 0}
.erc .s-legend .leg-header h2{font-family:'Playfair Display',serif;font-size:48px;color:#f1f5f9}

/* ── Activity slides ─────────────────────────────────── */
.erc .s-act{background:#fdfaf5}
.erc .s-act .act-top{display:flex;height:100%}
.erc .s-act .act-left{width:840px;flex-shrink:0;padding:70px 80px 70px 90px;display:flex;flex-direction:column;border-right:1px solid #e8e0d4}
.erc .s-act .act-right{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;position:relative}
.erc .act-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:28px;width:fit-content}
.erc .act-left h2{font-family:'Playfair Display',serif;font-size:46px;color:#0f172a;line-height:1.1;margin-bottom:32px}
.erc .scenario-text{font-size:21px;color:#334155;line-height:1.7;margin-bottom:32px;flex:1}
.erc .scenario-text strong{color:#0f172a;font-weight:600}
.erc .entities-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px}
.erc .entity-pill{padding:6px 18px;border-radius:6px;font-size:15px;font-weight:600;letter-spacing:.03em}
.erc .task-card{border-radius:12px;padding:24px 30px;border-left:5px solid}
.erc .task-card .task-title{font-size:14px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.erc .task-card ul{list-style:none;padding:0}
.erc .task-card ul li{font-size:18px;color:#1e293b;padding:4px 0;display:flex;align-items:flex-start;gap:10px}
.erc .task-card ul li::before{content:'→';font-weight:700;flex-shrink:0;margin-top:1px}

/* ── Answer slides ───────────────────────────────────── */
.erc .s-ans{background:#f4f6fb}
.erc .ans-header{padding:0 90px;height:96px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #dde3f5;flex-shrink:0;background:#fff}
.erc .ans-badge{padding:7px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.erc .ans-header h2{font-family:'Playfair Display',serif;font-size:36px;color:#0f172a}
.erc .ans-header .micro-legend{margin-left:auto;display:flex;gap:28px;align-items:center}
.erc .micro-legend-item{display:flex;align-items:center;gap:10px;font-size:16px;color:#475569;font-weight:500}
.erc .ml-entity{width:36px;height:20px;background:#1e40af;border-radius:2px}
.erc .ml-weak{width:36px;height:20px;border:3px solid #1e40af;border-radius:2px;outline:2px solid #1e40af;outline-offset:3px}
.erc .ml-rel{width:20px;height:20px;background:#92400e;transform:rotate(45deg);flex-shrink:0}
.erc .ml-attr{width:40px;height:22px;border:2px solid #64748b;border-radius:50%}
.erc .ans-diagram{flex:1;display:flex;align-items:center;justify-content:center;padding:24px 70px 56px;min-height:0}
.erc .ans-diagram svg{width:100%;height:100%;display:block;overflow:visible}
.erc .et{font:700 22px 'DM Sans',sans-serif;fill:white}
.erc .rt{font:700 18px 'DM Sans',sans-serif;fill:white}
.erc .at{font:500 17px 'DM Sans',sans-serif;fill:#1e293b}
.erc .ct{font:700 28px 'DM Sans',sans-serif}
.erc .ln{stroke:#94a3b8;stroke-width:2.5;fill:none}`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  {
    classes: 's-title',
    label: '01 Title',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="120" r="320" fill="rgba(96,165,250,0.05)"/>
  <circle cx="1750" cy="180" r="180" fill="rgba(96,165,250,0.07)"/>
  <circle cx="200"  cy="950" r="280" fill="rgba(96,165,250,0.04)"/>
  <pattern id="erc-dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
    <circle cx="30" cy="30" r="1.5" fill="rgba(148,163,184,0.2)"/>
  </pattern>
  <rect width="1920" height="1080" fill="url(#erc-dots)"/>
</svg>
<div class="inner">
  <p class="eyebrow">Database Design · Advanced Concepts</p>
  <h1>Advanced ER<br/>Concepts</h1>
  <div class="deco-line"></div>
  <p class="sub">Weak Entities · Identifying Relationships · Multivalued &amp; Derived Attributes</p>
</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-overview',
    label: '02 Overview',
    html: `<div class="overview-header">
  <p class="eyebrow">What You Will Learn</p>
  <h2>Four Advanced Concepts</h2>
</div>
<div class="overview-grid">
  <div class="overview-card">
    <span class="overview-card-num">Concept 01</span>
    <div class="ov-symbol">
      <svg viewBox="0 0 120 60" width="120" height="60">
        <rect x="4" y="4" width="112" height="52" rx="4" fill="none" stroke="#60a5fa" stroke-width="3"/>
        <rect x="10" y="10" width="100" height="40" rx="3" fill="none" stroke="#60a5fa" stroke-width="2" stroke-dasharray="5,3"/>
        <text x="60" y="34" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" font-weight="700" fill="#60a5fa">WEAK</text>
      </svg>
    </div>
    <h3>Weak Entity</h3>
    <p>An entity that cannot be uniquely identified by its own attributes alone — it depends on a strong entity.</p>
  </div>
  <div class="overview-card">
    <span class="overview-card-num">Concept 02</span>
    <div class="ov-symbol">
      <svg viewBox="0 0 120 60" width="120" height="60">
        <polygon points="60,4 116,30 60,56 4,30" fill="none" stroke="#a78bfa" stroke-width="3"/>
        <polygon points="60,10 108,30 60,50 12,30" fill="none" stroke="#a78bfa" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="60" y="34" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="11" font-weight="700" fill="#a78bfa">IDENTIFIES</text>
      </svg>
    </div>
    <h3>Identifying Relationship</h3>
    <p>A relationship that connects a weak entity to its owner — drawn with a double diamond.</p>
  </div>
  <div class="overview-card">
    <span class="overview-card-num">Concept 03</span>
    <div class="ov-symbol">
      <svg viewBox="0 0 120 60" width="120" height="60">
        <ellipse cx="60" cy="30" rx="54" ry="24" fill="none" stroke="#34d399" stroke-width="3"/>
        <ellipse cx="60" cy="30" rx="46" ry="16" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="60" y="34" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" font-weight="600" fill="#34d399">Multi</text>
      </svg>
    </div>
    <h3>Multivalued Attribute</h3>
    <p>An attribute that can hold multiple values for a single entity — drawn with a double ellipse.</p>
  </div>
  <div class="overview-card">
    <span class="overview-card-num">Concept 04</span>
    <div class="ov-symbol">
      <svg viewBox="0 0 120 60" width="120" height="60">
        <ellipse cx="60" cy="30" rx="54" ry="24" fill="none" stroke="#fb923c" stroke-width="3" stroke-dasharray="8,4"/>
        <text x="60" y="34" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" font-weight="600" fill="#fb923c">Derived</text>
      </svg>
    </div>
    <h3>Derived Attribute</h3>
    <p>An attribute whose value can be calculated from other stored data — drawn with a dashed ellipse.</p>
  </div>
</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-concept',
    label: '03 Weak Entity',
    html: `<div style="padding:52px 100px 32px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.07)">
  <p style="font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;font-weight:600;margin-bottom:14px">Concept 01 of 04</p>
  <h2 style="font-family:'Playfair Display',serif;font-size:54px;color:#f1f5f9">Weak Entity</h2>
</div>
<div class="concept-body">
  <div class="concept-left">
    <span class="concept-badge" style="background:rgba(96,165,250,.12);color:#60a5fa">Definition</span>
    <p class="concept-desc">A <strong style="color:#f1f5f9">Weak Entity</strong> is an entity that <strong style="color:#f1f5f9">cannot be uniquely identified</strong> using its own attributes alone. It must borrow the primary key of a related <em style="color:#94a3b8">strong (owner) entity</em> to form its own identifier.</p>
    <div class="concept-rule" style="border-left-color:#60a5fa">
      <p class="rule-title" style="color:#60a5fa">Key Rules</p>
      <ul>
        <li>Has no primary key of its own</li>
        <li>Identified by a <strong style="color:#f1f5f9">partial key</strong> (dashed underline) + owner's key</li>
        <li>Existence depends on the strong entity (existence dependency)</li>
        <li>Drawn with a <strong style="color:#f1f5f9">double rectangle</strong> in Chen's notation</li>
      </ul>
    </div>
    <div class="concept-chips">
      <span class="concept-chip" style="background:rgba(96,165,250,.1);color:#93c5fd">Double rectangle</span>
      <span class="concept-chip" style="background:rgba(96,165,250,.1);color:#93c5fd">Partial key</span>
      <span class="concept-chip" style="background:rgba(96,165,250,.1);color:#93c5fd">Owner entity</span>
    </div>
    <div class="concept-note">
      <p class="note-label">Example</p>
      <p>A <strong style="color:#f1f5f9">Room</strong> in a Building — Room 101 only makes sense relative to a specific Building. Without the building, the room number alone is not unique.</p>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 560 380" width="560" height="380" style="overflow:visible">
      <!-- Building (strong entity) -->
      <rect x="30" y="140" width="180" height="70" rx="4" fill="#1e40af"/>
      <text x="120" y="181" text-anchor="middle" class="et">BUILDING</text>
      <!-- Building attributes -->
      <ellipse cx="60" cy="60" rx="60" ry="26" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="60" y="65" text-anchor="middle" class="at" fill="#94a3b8">BuildingID</text>
      <line x1="60" y1="86" x2="90" y2="140" class="ln"/>
      <!-- PK underline on BuildingID -->
      <line x1="22" y1="73" x2="98" y2="73" stroke="#60a5fa" stroke-width="2"/>
      <ellipse cx="190" cy="60" rx="56" ry="26" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="190" y="65" text-anchor="middle" class="at" fill="#94a3b8">Name</text>
      <line x1="190" y1="86" x2="170" y2="140" class="ln"/>
      <!-- Identifying relationship (double diamond) -->
      <polygon points="280,175 330,155 380,175 330,195" fill="#92400e"/>
      <polygon points="280,175 326,157 380,175 326,193" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
      <text x="330" y="180" text-anchor="middle" class="rt">HAS</text>
      <line x1="210" y1="175" x2="280" y2="175" class="ln"/>
      <line x1="380" y1="175" x2="430" y2="175" class="ln"/>
      <!-- Room (weak entity, double rectangle) -->
      <rect x="428" y="140" width="120" height="70" rx="4" fill="#1e40af" opacity=".7"/>
      <rect x="434" y="146" width="108" height="58" rx="2" fill="none" stroke="#93c5fd" stroke-width="2.5"/>
      <text x="488" y="181" text-anchor="middle" class="et">ROOM</text>
      <!-- Room attributes -->
      <ellipse cx="488" cy="60" rx="52" ry="26" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <ellipse cx="488" cy="60" rx="58" ry="32" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="0"/>
      <text x="488" y="65" text-anchor="middle" class="at" fill="#94a3b8">RoomNo</text>
      <!-- Partial key dashed underline -->
      <line x1="460" y1="73" x2="516" y2="73" stroke="#60a5fa" stroke-width="2" stroke-dasharray="5,3"/>
      <line x1="488" y1="92" x2="488" y2="140" class="ln"/>
      <!-- Capacity attribute -->
      <ellipse cx="530" cy="310" rx="52" ry="26" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="530" y="315" text-anchor="middle" class="at" fill="#94a3b8">Capacity</text>
      <line x1="510" y1="284" x2="500" y2="210" class="ln"/>
      <!-- Labels -->
      <text x="120" y="240" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#60a5fa" font-weight="600">Strong Entity</text>
      <text x="488" y="240" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#93c5fd" font-weight="600">Weak Entity</text>
      <text x="330" y="220" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" fill="#fbbf24" font-weight="600">Identifying Rel.</text>
    </svg>
  </div>
</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-concept',
    label: '04 Identifying Relationship',
    html: `<div style="padding:52px 100px 32px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.07)">
  <p style="font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:#a78bfa;font-weight:600;margin-bottom:14px">Concept 02 of 04</p>
  <h2 style="font-family:'Playfair Display',serif;font-size:54px;color:#f1f5f9">Identifying Relationship</h2>
</div>
<div class="concept-body">
  <div class="concept-left">
    <span class="concept-badge" style="background:rgba(167,139,250,.12);color:#a78bfa">Definition</span>
    <p class="concept-desc">An <strong style="color:#f1f5f9">Identifying Relationship</strong> is a relationship between a <em style="color:#94a3b8">weak entity</em> and its <em style="color:#94a3b8">owner (strong) entity</em>. It supplies the key component the weak entity needs for identification.</p>
    <div class="concept-rule" style="border-left-color:#a78bfa">
      <p class="rule-title" style="color:#a78bfa">Key Rules</p>
      <ul>
        <li>Always connects a <strong style="color:#f1f5f9">weak entity</strong> to its owner</li>
        <li>Drawn with a <strong style="color:#f1f5f9">double diamond</strong> in Chen's notation</li>
        <li>Always has <strong style="color:#f1f5f9">total participation</strong> on the weak entity side</li>
        <li>When the owner is deleted, the weak entity is also deleted</li>
      </ul>
    </div>
    <div class="concept-chips">
      <span class="concept-chip" style="background:rgba(167,139,250,.1);color:#c4b5fd">Double diamond</span>
      <span class="concept-chip" style="background:rgba(167,139,250,.1);color:#c4b5fd">Total participation</span>
      <span class="concept-chip" style="background:rgba(167,139,250,.1);color:#c4b5fd">Cascading delete</span>
    </div>
    <div class="concept-note">
      <p class="note-label" style="color:#a78bfa">Contrast with Regular Relationship</p>
      <p>A regular relationship uses a <strong style="color:#f1f5f9">single diamond</strong>. A double diamond signals that the relationship is essential for the weak entity's existence and identification.</p>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 520 340" width="520" height="340" style="overflow:visible">
      <!-- Regular relationship (single diamond) at top -->
      <text x="150" y="30" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="16" fill="#94a3b8" font-weight="600">Regular Relationship</text>
      <rect x="30" y="50" width="130" height="55" rx="4" fill="#1e40af"/>
      <text x="95" y="83" text-anchor="middle" class="et" style="font-size:18px">STUDENT</text>
      <polygon points="195,77 240,55 285,77 240,99" fill="#92400e"/>
      <text x="240" y="82" text-anchor="middle" class="rt" style="font-size:14px">ENROLS</text>
      <line x1="160" y1="77" x2="195" y2="77" class="ln"/>
      <line x1="285" y1="77" x2="320" y2="77" class="ln"/>
      <rect x="320" y="50" width="130" height="55" rx="4" fill="#1e40af"/>
      <text x="385" y="83" text-anchor="middle" class="et" style="font-size:18px">COURSE</text>
      <!-- Identifying relationship (double diamond) at bottom -->
      <text x="260" y="185" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="16" fill="#a78bfa" font-weight="600">Identifying Relationship</text>
      <rect x="30" y="210" width="150" height="60" rx="4" fill="#1e40af"/>
      <text x="105" y="246" text-anchor="middle" class="et" style="font-size:18px">BUILDING</text>
      <!-- Double diamond -->
      <polygon points="215,240 265,215 315,240 265,265" fill="#7c2d92"/>
      <polygon points="215,240 261,217 315,240 261,263" fill="none" stroke="#c4b5fd" stroke-width="2.5"/>
      <text x="265" y="245" text-anchor="middle" class="rt" style="font-size:13px;fill:#e9d5ff">HAS</text>
      <line x1="180" y1="240" x2="215" y2="240" class="ln"/>
      <line x1="315" y1="240" x2="360" y2="240" class="ln"/>
      <!-- Weak entity (double rect) -->
      <rect x="358" y="210" width="130" height="60" rx="4" fill="#1e40af" opacity=".7"/>
      <rect x="364" y="216" width="118" height="48" rx="2" fill="none" stroke="#c4b5fd" stroke-width="2.5"/>
      <text x="423" y="246" text-anchor="middle" class="et" style="font-size:18px">ROOM</text>
      <!-- Labels -->
      <text x="240" y="296" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#c4b5fd">Double diamond = Identifying</text>
      <text x="240" y="315" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#94a3b8">Single diamond = Regular</text>
    </svg>
  </div>
</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-concept',
    label: '05 Multivalued Attribute',
    html: `<div style="padding:52px 100px 32px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.07)">
  <p style="font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:#34d399;font-weight:600;margin-bottom:14px">Concept 03 of 04</p>
  <h2 style="font-family:'Playfair Display',serif;font-size:54px;color:#f1f5f9">Multivalued Attribute</h2>
</div>
<div class="concept-body">
  <div class="concept-left">
    <span class="concept-badge" style="background:rgba(52,211,153,.12);color:#34d399">Definition</span>
    <p class="concept-desc">A <strong style="color:#f1f5f9">Multivalued Attribute</strong> is an attribute that can store <strong style="color:#f1f5f9">more than one value</strong> for a single entity instance — for example, a person can have multiple phone numbers.</p>
    <div class="concept-rule" style="border-left-color:#34d399">
      <p class="rule-title" style="color:#34d399">Key Rules</p>
      <ul>
        <li>Drawn with a <strong style="color:#f1f5f9">double ellipse</strong> in Chen's notation</li>
        <li>Can hold zero, one, or many values per entity instance</li>
        <li>Often implemented as a separate table in physical design</li>
        <li>Commonly confused with composite attributes — they are different</li>
      </ul>
    </div>
    <div class="concept-chips">
      <span class="concept-chip" style="background:rgba(52,211,153,.1);color:#6ee7b7">Double ellipse</span>
      <span class="concept-chip" style="background:rgba(52,211,153,.1);color:#6ee7b7">Multiple values</span>
      <span class="concept-chip" style="background:rgba(52,211,153,.1);color:#6ee7b7">Separate table (physical)</span>
    </div>
    <div class="concept-note">
      <p class="note-label" style="color:#34d399">Examples</p>
      <p>A <strong style="color:#f1f5f9">Person</strong> may have multiple <em style="color:#94a3b8">PhoneNumbers</em>. A <strong style="color:#f1f5f9">Product</strong> may belong to multiple <em style="color:#94a3b8">Categories</em>. A <strong style="color:#f1f5f9">Student</strong> may speak multiple <em style="color:#94a3b8">Languages</em>.</p>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 500 320" width="500" height="320" style="overflow:visible">
      <!-- Entity -->
      <rect x="160" y="130" width="160" height="65" rx="4" fill="#1e40af"/>
      <text x="240" y="168" text-anchor="middle" class="et">EMPLOYEE</text>
      <!-- Name (single ellipse = simple) -->
      <ellipse cx="100" cy="50" rx="68" ry="28" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="100" y="55" text-anchor="middle" class="at" fill="#94a3b8">Name</text>
      <line x1="148" y1="70" x2="185" y2="130" class="ln"/>
      <!-- EmployeeID (single, primary key) -->
      <ellipse cx="240" cy="45" rx="72" ry="28" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="240" y="50" text-anchor="middle" class="at" fill="#94a3b8">EmpID</text>
      <line x1="240" y1="73" x2="240" y2="130" class="ln"/>
      <!-- PK underline -->
      <line x1="208" y1="60" x2="272" y2="60" stroke="#60a5fa" stroke-width="2"/>
      <!-- PhoneNumber (double ellipse = multivalued) -->
      <ellipse cx="390" cy="50" rx="78" ry="30" fill="none" stroke="#34d399" stroke-width="2.5"/>
      <ellipse cx="390" cy="50" rx="68" ry="21" fill="none" stroke="#34d399" stroke-width="2"/>
      <text x="390" y="55" text-anchor="middle" class="at" fill="#6ee7b7" style="font-size:15px">PhoneNumber</text>
      <line x1="356" y1="76" x2="310" y2="130" class="ln"/>
      <!-- Dept (single) -->
      <ellipse cx="380" cy="240" rx="65" ry="28" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="380" y="245" text-anchor="middle" class="at" fill="#94a3b8">Department</text>
      <line x1="340" y1="218" x2="310" y2="195" class="ln"/>
      <!-- Legend labels -->
      <text x="100" y="110" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#94a3b8">Single value</text>
      <text x="390" y="100" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#34d399" font-weight="700">Multi-valued</text>
      <text x="390" y="118" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" fill="#6ee7b7">(double ellipse)</text>
    </svg>
  </div>
</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-concept',
    label: '06 Derived Attribute',
    html: `<div style="padding:52px 100px 32px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,.07)">
  <p style="font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:#fb923c;font-weight:600;margin-bottom:14px">Concept 04 of 04</p>
  <h2 style="font-family:'Playfair Display',serif;font-size:54px;color:#f1f5f9">Derived Attribute</h2>
</div>
<div class="concept-body">
  <div class="concept-left">
    <span class="concept-badge" style="background:rgba(251,146,60,.12);color:#fb923c">Definition</span>
    <p class="concept-desc">A <strong style="color:#f1f5f9">Derived Attribute</strong> is an attribute whose value can be <strong style="color:#f1f5f9">computed or derived</strong> from other stored data — so it does not need to be stored separately in the database.</p>
    <div class="concept-rule" style="border-left-color:#fb923c">
      <p class="rule-title" style="color:#fb923c">Key Rules</p>
      <ul>
        <li>Drawn with a <strong style="color:#f1f5f9">dashed ellipse</strong> in Chen's notation</li>
        <li>Value is calculated on demand, not stored</li>
        <li>Source data (base attribute) must exist in the database</li>
        <li>Reduces redundancy and maintains consistency</li>
      </ul>
    </div>
    <div class="concept-chips">
      <span class="concept-chip" style="background:rgba(251,146,60,.1);color:#fdba74">Dashed ellipse</span>
      <span class="concept-chip" style="background:rgba(251,146,60,.1);color:#fdba74">Computed value</span>
      <span class="concept-chip" style="background:rgba(251,146,60,.1);color:#fdba74">Not stored</span>
    </div>
    <div class="concept-note">
      <p class="note-label" style="color:#fb923c">Examples</p>
      <p><em style="color:#94a3b8">Age</em> can be derived from <strong style="color:#f1f5f9">DateOfBirth</strong>. <em style="color:#94a3b8">TotalSalary</em> from <strong style="color:#f1f5f9">BaseSalary + Allowances</strong>. <em style="color:#94a3b8">Duration</em> from <strong style="color:#f1f5f9">StartDate and EndDate</strong>.</p>
    </div>
  </div>
  <div class="concept-right">
    <svg viewBox="0 0 500 320" width="500" height="320" style="overflow:visible">
      <!-- Entity -->
      <rect x="155" y="130" width="160" height="65" rx="4" fill="#1e40af"/>
      <text x="235" y="168" text-anchor="middle" class="et">EMPLOYEE</text>
      <!-- DateOfBirth (regular ellipse = stored) -->
      <ellipse cx="80" cy="50" rx="72" ry="28" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="80" y="55" text-anchor="middle" class="at" fill="#94a3b8" style="font-size:14px">DateOfBirth</text>
      <line x1="130" y1="70" x2="180" y2="130" class="ln"/>
      <!-- Arrow indicating derivation -->
      <line x1="80" y1="78" x2="80" y2="115" stroke="#fb923c" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arr)"/>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c"/>
        </marker>
      </defs>
      <!-- Age (dashed ellipse = derived) -->
      <ellipse cx="80" cy="145" rx="55" ry="24" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-dasharray="8,4"/>
      <text x="80" y="150" text-anchor="middle" class="at" fill="#fdba74">Age</text>
      <line x1="135" y1="155" x2="155" y2="162" class="ln" stroke-dasharray="5,3"/>
      <!-- EmployeeID -->
      <ellipse cx="235" cy="45" rx="65" ry="26" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="235" y="50" text-anchor="middle" class="at" fill="#94a3b8">EmpID</text>
      <line x1="235" y1="71" x2="235" y2="130" class="ln"/>
      <line x1="200" y1="58" x2="270" y2="58" stroke="#60a5fa" stroke-width="2"/>
      <!-- Salary (regular) -->
      <ellipse cx="390" cy="50" rx="65" ry="26" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="390" y="55" text-anchor="middle" class="at" fill="#94a3b8">BaseSalary</text>
      <line x1="345" y1="68" x2="308" y2="130" class="ln"/>
      <!-- TotalSalary (derived) -->
      <ellipse cx="420" cy="230" rx="75" ry="28" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-dasharray="8,4"/>
      <text x="420" y="235" text-anchor="middle" class="at" fill="#fdba74" style="font-size:14px">TotalSalary</text>
      <line x1="360" y1="215" x2="315" y2="195" class="ln" stroke-dasharray="5,3"/>
      <!-- Labels -->
      <text x="80" y="195" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" fill="#fb923c" font-weight="700">Derived</text>
      <text x="420" y="275" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" fill="#fb923c" font-weight="700">Derived</text>
      <text x="390" y="100" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" fill="#94a3b8">Stored (regular ellipse)</text>
    </svg>
  </div>
</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-legend',
    label: '07 Symbol Reference',
    html: `<div class="leg-header">
  <p style="font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;font-weight:600;margin-bottom:14px">Quick Reference</p>
  <h2 style="font-family:'Playfair Display',serif;font-size:48px;color:#f1f5f9">Advanced Symbol Reference</h2>
</div>
<div style="padding:40px 100px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:28px">

  <div style="background:rgba(255,255,255,.05);border:1px solid rgba(96,165,250,.15);border-radius:16px;padding:32px">
    <svg viewBox="0 0 200 70" width="200" height="70" style="display:block;margin:0 auto 16px">
      <rect x="10" y="8" width="180" height="54" rx="4" fill="#1e40af"/>
      <rect x="17" y="15" width="166" height="40" rx="2" fill="none" stroke="#93c5fd" stroke-width="2.5"/>
      <text x="100" y="42" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="18" font-weight="700" fill="white">WEAK ENTITY</text>
    </svg>
    <p style="font-size:18px;color:#f1f5f9;font-weight:600;margin-bottom:6px">Weak Entity</p>
    <p style="font-size:15px;color:#94a3b8;line-height:1.5">Double rectangle. Cannot be identified without its owner entity.</p>
  </div>

  <div style="background:rgba(255,255,255,.05);border:1px solid rgba(96,165,250,.15);border-radius:16px;padding:32px">
    <svg viewBox="0 0 200 70" width="200" height="70" style="display:block;margin:0 auto 16px">
      <polygon points="100,6 190,35 100,64 10,35" fill="#7c2d92"/>
      <polygon points="100,12 182,35 100,58 18,35" fill="none" stroke="#c4b5fd" stroke-width="2.5"/>
      <text x="100" y="40" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" font-weight="700" fill="white">IDENTIFIES</text>
    </svg>
    <p style="font-size:18px;color:#f1f5f9;font-weight:600;margin-bottom:6px">Identifying Relationship</p>
    <p style="font-size:15px;color:#94a3b8;line-height:1.5">Double diamond. Links weak entity to its owner strong entity.</p>
  </div>

  <div style="background:rgba(255,255,255,.05);border:1px solid rgba(96,165,250,.15);border-radius:16px;padding:32px">
    <svg viewBox="0 0 200 70" width="200" height="70" style="display:block;margin:0 auto 16px">
      <ellipse cx="100" cy="35" rx="90" ry="30" fill="none" stroke="#34d399" stroke-width="2.5"/>
      <ellipse cx="100" cy="35" rx="76" ry="20" fill="none" stroke="#34d399" stroke-width="2"/>
      <text x="100" y="40" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="15" font-weight="600" fill="#6ee7b7">PhoneNumber</text>
    </svg>
    <p style="font-size:18px;color:#f1f5f9;font-weight:600;margin-bottom:6px">Multivalued Attribute</p>
    <p style="font-size:15px;color:#94a3b8;line-height:1.5">Double ellipse. Holds multiple values per entity instance.</p>
  </div>

  <div style="background:rgba(255,255,255,.05);border:1px solid rgba(96,165,250,.15);border-radius:16px;padding:32px">
    <svg viewBox="0 0 200 70" width="200" height="70" style="display:block;margin:0 auto 16px">
      <ellipse cx="100" cy="35" rx="90" ry="30" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-dasharray="10,5"/>
      <text x="100" y="40" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="15" font-weight="600" fill="#fdba74">Age</text>
    </svg>
    <p style="font-size:18px;color:#f1f5f9;font-weight:600;margin-bottom:6px">Derived Attribute</p>
    <p style="font-size:15px;color:#94a3b8;line-height:1.5">Dashed ellipse. Value is computed, not stored directly.</p>
  </div>

  <div style="background:rgba(255,255,255,.05);border:1px solid rgba(96,165,250,.15);border-radius:16px;padding:32px">
    <svg viewBox="0 0 200 70" width="200" height="70" style="display:block;margin:0 auto 16px">
      <ellipse cx="100" cy="35" rx="90" ry="30" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
      <text x="100" y="37" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="15" font-weight="600" fill="#94a3b8">AttrName</text>
      <line x1="20" y1="46" x2="180" y2="46" stroke="#60a5fa" stroke-width="2.5"/>
    </svg>
    <p style="font-size:18px;color:#f1f5f9;font-weight:600;margin-bottom:6px">Partial Key Attribute</p>
    <p style="font-size:15px;color:#94a3b8;line-height:1.5">Dashed underline inside ellipse. Identifies weak entity within its owner's scope.</p>
  </div>

  <div style="background:rgba(255,255,255,.05);border:1px solid rgba(96,165,250,.15);border-radius:16px;padding:32px">
    <svg viewBox="0 0 200 70" width="200" height="70" style="display:block;margin:0 auto 16px">
      <line x1="10" y1="35" x2="190" y2="35" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="10" y1="42" x2="190" y2="42" stroke="#94a3b8" stroke-width="2.5"/>
    </svg>
    <p style="font-size:18px;color:#f1f5f9;font-weight:600;margin-bottom:6px">Total Participation</p>
    <p style="font-size:15px;color:#94a3b8;line-height:1.5">Double line connecting entity to relationship. Every instance must participate.</p>
  </div>

</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '08 Exercise 1 — Building & Rooms',
    html: `<div class="act-top">
  <div class="act-left">
    <span class="act-badge" style="background:#fef3c7;color:#92400e">Exercise 01</span>
    <h2>University Buildings &amp; Rooms</h2>
    <p class="scenario-text">A university manages <strong>Buildings</strong> across its campus. Each Building has a unique <strong>BuildingCode</strong>, a Name, and a Location (campus area). Inside each building there are many <strong>Rooms</strong>. Rooms are identified only by their <strong>RoomNumber</strong> within a specific building — the same room number can exist in different buildings. Each room has a Capacity and a Type (lecture hall, lab, tutorial room). A room cannot exist without its building.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#dbeafe;color:#1e40af">Building</span>
      <span class="entity-pill" style="background:#ede9fe;color:#4c1d95">Room</span>
    </div>
    <div class="task-card" style="background:#fef9ee;border-left-color:#d97706">
      <p class="task-title" style="color:#92400e">Your Task</p>
      <ul>
        <li>Identify the weak entity and its owner</li>
        <li>Draw the identifying relationship (double diamond)</li>
        <li>Mark the partial key for the weak entity</li>
        <li>Add all attributes using correct Chen's notation</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 500 400" width="500" height="400" style="opacity:.15">
      <rect x="160" y="160" width="180" height="70" rx="4" fill="#64748b"/>
      <rect x="160" y="240" width="180" height="70" rx="4" fill="#64748b"/>
      <polygon points="250,50 320,100 250,150 180,100" fill="#78716c"/>
      <ellipse cx="80" cy="100" rx="55" ry="24" fill="none" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="420" cy="100" rx="55" ry="24" fill="none" stroke="#64748b" stroke-width="2"/>
    </svg>
    <div style="text-align:center;position:absolute">
      <p style="font-size:22px;font-weight:700;color:#92400e;margin-bottom:12px">Draw Your ER Diagram Here</p>
      <p style="font-size:17px;color:#78716c;line-height:1.6">Identify the weak entity.<br/>Use double rectangle + double diamond.</p>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '09 Answer 1 — Building & Rooms',
    html: `<div class="ans-header">
  <span class="ans-badge" style="background:#dbeafe;color:#1d4ed8">Answer 01</span>
  <h2>University Buildings &amp; Rooms</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div>Strong Entity</div>
    <div class="micro-legend-item"><div class="ml-weak"></div>Weak Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div>Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div>Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1100 560" preserveAspectRatio="xMidYMid meet">
    <!-- BUILDING attributes (top) -->
    <!-- BuildingCode -->
    <ellipse cx="160" cy="70" rx="88" ry="32" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="160" y="74" text-anchor="middle" class="at">BuildingCode</text>
    <line x1="160" y1="102" x2="210" y2="200" class="ln"/>
    <!-- PK underline -->
    <line x1="116" y1="83" x2="204" y2="83" stroke="#60a5fa" stroke-width="2"/>
    <!-- Name -->
    <ellipse cx="340" cy="70" rx="68" ry="32" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="340" y="74" text-anchor="middle" class="at">Name</text>
    <line x1="316" y1="100" x2="290" y2="200" class="ln"/>
    <!-- Location -->
    <ellipse cx="500" cy="70" rx="72" ry="32" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="500" y="74" text-anchor="middle" class="at">Location</text>
    <line x1="488" y1="102" x2="390" y2="200" class="ln"/>

    <!-- BUILDING entity -->
    <rect x="220" y="200" width="200" height="70" rx="4" fill="#1e40af"/>
    <text x="320" y="241" text-anchor="middle" class="et">BUILDING</text>

    <!-- Identifying relationship (double diamond) -->
    <polygon points="500,235 570,210 640,235 570,260" fill="#92400e"/>
    <polygon points="500,235 566,212 640,235 566,258" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
    <text x="570" y="240" text-anchor="middle" class="rt">HAS</text>
    <line x1="420" y1="235" x2="500" y2="235" class="ln"/>
    <!-- Total participation double line -->
    <line x1="640" y1="232" x2="710" y2="232" class="ln"/>
    <line x1="640" y1="238" x2="710" y2="238" class="ln"/>

    <!-- ROOM weak entity (double rectangle) -->
    <rect x="708" y="200" width="180" height="70" rx="4" fill="#1e40af" opacity=".75"/>
    <rect x="716" y="208" width="164" height="54" rx="2" fill="none" stroke="#93c5fd" stroke-width="2.5"/>
    <text x="798" y="241" text-anchor="middle" class="et">ROOM</text>

    <!-- ROOM attributes -->
    <!-- RoomNumber (partial key) -->
    <ellipse cx="798" cy="100" rx="80" ry="32" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="798" y="104" text-anchor="middle" class="at">RoomNumber</text>
    <!-- Partial key dashed underline -->
    <line x1="746" y1="113" x2="850" y2="113" stroke="#60a5fa" stroke-width="2" stroke-dasharray="5,3"/>
    <line x1="798" y1="132" x2="798" y2="200" class="ln"/>
    <!-- Capacity -->
    <ellipse cx="960" cy="120" rx="70" ry="32" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="960" y="124" text-anchor="middle" class="at">Capacity</text>
    <line x1="912" y1="140" x2="880" y2="200" class="ln"/>
    <!-- Type -->
    <ellipse cx="1030" cy="280" rx="55" ry="32" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="1030" y="284" text-anchor="middle" class="at">Type</text>
    <line x1="978" y1="272" x2="888" y2="264" class="ln"/>

    <!-- Cardinality labels -->
    <text x="470" y="226" text-anchor="middle" class="ct" fill="#1d4ed8">1</text>
    <text x="660" y="226" text-anchor="middle" class="ct" fill="#1d4ed8">N</text>
    <!-- Concept labels -->
    <text x="320" y="300" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="16" fill="#60a5fa" font-weight="600">Strong Entity</text>
    <text x="798" y="300" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="16" fill="#93c5fd" font-weight="600">Weak Entity</text>
    <text x="570" y="290" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#fbbf24" font-weight="600">Identifying Rel.</text>
    <text x="798" y="140" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" fill="#93c5fd">(partial key)</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '10 Exercise 2 — Employee & Dependants',
    html: `<div class="act-top">
  <div class="act-left">
    <span class="act-badge" style="background:#fce7f3;color:#831843">Exercise 02</span>
    <h2>Employee &amp; Dependants</h2>
    <p class="scenario-text">A company tracks <strong>Employees</strong>, each with a unique <strong>EmployeeID</strong>, a Name, a DateOfBirth, and one or more <strong>PhoneNumbers</strong>. From DateOfBirth, the employee's <strong>Age</strong> can be calculated. Employees may have <strong>Dependants</strong> (family members) registered for benefits. Each Dependant has a Name and a Relationship (spouse, child, parent). A dependant is identified by their name <em>within the context of a specific employee</em> — the same name can appear under different employees.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#dbeafe;color:#1e40af">Employee</span>
      <span class="entity-pill" style="background:#fce7f3;color:#831843">Dependant</span>
    </div>
    <div class="task-card" style="background:#fdf2f8;border-left-color:#db2777">
      <p class="task-title" style="color:#831843">Your Task</p>
      <ul>
        <li>Identify the weak entity and the identifying relationship</li>
        <li>Show the multivalued attribute (double ellipse)</li>
        <li>Show the derived attribute (dashed ellipse)</li>
        <li>Mark the partial key on the weak entity</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 500 400" width="500" height="400" style="opacity:.12">
      <rect x="150" y="170" width="200" height="70" rx="4" fill="#64748b"/>
      <ellipse cx="250" cy="70" rx="60" ry="25" fill="none" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="80" cy="140" rx="50" ry="22" fill="none" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="80" cy="148" rx="58" ry="30" fill="none" stroke="#64748b" stroke-width="2"/>
      <ellipse cx="420" cy="100" rx="55" ry="22" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="8,4"/>
      <rect x="320" y="310" width="170" height="60" rx="4" fill="#64748b"/>
    </svg>
    <div style="text-align:center;position:absolute">
      <p style="font-size:22px;font-weight:700;color:#831843;margin-bottom:12px">Draw Your ER Diagram Here</p>
      <p style="font-size:17px;color:#78716c;line-height:1.6">Use double ellipse for PhoneNumber.<br/>Use dashed ellipse for Age.<br/>Mark the weak entity with double rectangle.</p>
    </div>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '11 Answer 2 — Employee & Dependants',
    html: `<div class="ans-header">
  <span class="ans-badge" style="background:#fce7f3;color:#831843">Answer 02</span>
  <h2>Employee &amp; Dependants</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div>Strong Entity</div>
    <div class="micro-legend-item"><div class="ml-weak"></div>Weak Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div>Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div>Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1160 560" preserveAspectRatio="xMidYMid meet">
    <!-- EMPLOYEE attributes -->
    <!-- EmployeeID (PK) -->
    <ellipse cx="150" cy="70" rx="80" ry="30" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="150" y="74" text-anchor="middle" class="at">EmployeeID</text>
    <line x1="118" y1="82" x2="218" y2="82" stroke="#60a5fa" stroke-width="2"/>
    <line x1="150" y1="100" x2="230" y2="200" class="ln"/>
    <!-- Name -->
    <ellipse cx="330" cy="65" rx="65" ry="28" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="330" y="69" text-anchor="middle" class="at">Name</text>
    <line x1="310" y1="92" x2="310" y2="200" class="ln"/>
    <!-- DateOfBirth (stored) -->
    <ellipse cx="500" cy="65" rx="82" ry="28" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="500" y="69" text-anchor="middle" class="at">DateOfBirth</text>
    <line x1="475" y1="92" x2="390" y2="200" class="ln"/>
    <!-- Age (derived) -->
    <ellipse cx="640" cy="65" rx="55" ry="28" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-dasharray="8,4"/>
    <text x="640" y="69" text-anchor="middle" class="at" fill="#fdba74">Age</text>
    <line x1="612" y1="86" x2="430" y2="200" class="ln"/>
    <!-- PhoneNumber (multivalued) -->
    <ellipse cx="150" cy="340" rx="82" ry="30" fill="none" stroke="#34d399" stroke-width="2.5"/>
    <ellipse cx="150" cy="340" rx="70" ry="20" fill="none" stroke="#34d399" stroke-width="2"/>
    <text x="150" y="344" text-anchor="middle" class="at" fill="#6ee7b7" style="font-size:14px">PhoneNumber</text>
    <line x1="150" y1="310" x2="230" y2="270" class="ln"/>

    <!-- EMPLOYEE entity -->
    <rect x="210" y="200" width="210" height="70" rx="4" fill="#1e40af"/>
    <text x="315" y="241" text-anchor="middle" class="et">EMPLOYEE</text>

    <!-- Identifying relationship (double diamond) -->
    <polygon points="510,235 580,210 650,235 580,260" fill="#92400e"/>
    <polygon points="510,235 576,212 650,235 576,258" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
    <text x="580" y="240" text-anchor="middle" class="rt">HAS</text>
    <line x1="420" y1="235" x2="510" y2="235" class="ln"/>
    <!-- Total participation double line -->
    <line x1="650" y1="232" x2="720" y2="232" class="ln"/>
    <line x1="650" y1="238" x2="720" y2="238" class="ln"/>

    <!-- DEPENDANT weak entity (double rectangle) -->
    <rect x="718" y="200" width="200" height="70" rx="4" fill="#1e40af" opacity=".7"/>
    <rect x="726" y="208" width="184" height="54" rx="2" fill="none" stroke="#93c5fd" stroke-width="2.5"/>
    <text x="818" y="241" text-anchor="middle" class="et">DEPENDANT</text>

    <!-- DEPENDANT attributes -->
    <!-- Name (partial key) -->
    <ellipse cx="818" cy="110" rx="65" ry="28" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="818" y="114" text-anchor="middle" class="at">Name</text>
    <!-- Partial key dashed underline -->
    <line x1="768" y1="122" x2="868" y2="122" stroke="#60a5fa" stroke-width="2" stroke-dasharray="5,3"/>
    <line x1="818" y1="138" x2="818" y2="200" class="ln"/>
    <!-- Relationship -->
    <ellipse cx="980" cy="110" rx="82" ry="28" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="980" y="114" text-anchor="middle" class="at">Relationship</text>
    <line x1="930" y1="130" x2="900" y2="200" class="ln"/>

    <!-- Cardinality -->
    <text x="480" y="225" text-anchor="middle" class="ct" fill="#1d4ed8">1</text>
    <text x="670" y="225" text-anchor="middle" class="ct" fill="#1d4ed8">N</text>

    <!-- Concept annotations -->
    <text x="640" y="40" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#fb923c" font-weight="600">Derived (dashed)</text>
    <text x="150" y="395" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="14" fill="#34d399" font-weight="600">Multivalued (double ellipse)</text>
    <text x="315" y="300" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="15" fill="#60a5fa" font-weight="600">Strong Entity</text>
    <text x="818" y="300" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="15" fill="#93c5fd" font-weight="600">Weak Entity</text>
    <text x="580" y="290" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="13" fill="#fbbf24" font-weight="600">Identifying Rel.</text>
    <text x="818" y="150" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="12" fill="#93c5fd">(partial key)</text>
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

  function goFs() {
    wrapRef.current?.requestFullscreen?.();
  }
  function exitFs() {
    document.exitFullscreen?.();
  }

  const slide = SLIDES[current];

  return (
    <div className="flex flex-col gap-3">
      {/* Controls */}
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

      {/* Slide canvas */}
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

      {/* Dot nav */}
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
