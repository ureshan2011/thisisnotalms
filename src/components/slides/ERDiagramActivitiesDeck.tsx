import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

.era *{box-sizing:border-box;margin:0;padding:0}
.era section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.era .cr{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:14px;letter-spacing:.04em;pointer-events:none}
.era .cr-light{color:rgba(255,255,255,.35)}
.era .cr-dark{color:#94a3b8}

.era .s-title{background:#0b1728;justify-content:center;align-items:center}
.era .s-title .inner{text-align:center}
.era .s-title .eyebrow{font-size:24px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa;margin-bottom:28px;font-weight:500}
.era .s-title h1{font-family:'Playfair Display',serif;font-size:90px;color:#f8fafc;line-height:1.05;margin-bottom:32px}
.era .s-title .sub{font-size:26px;color:#94a3b8;font-weight:300;letter-spacing:.03em}
.era .s-title .deco-line{width:120px;height:3px;background:#60a5fa;margin:36px auto}

.era .s-legend{background:#0d1f36}
.era .s-legend .leg-header{padding:52px 100px 0}
.era .s-legend .leg-header h2{font-family:'Playfair Display',serif;font-size:48px;color:#f1f5f9}

.era .s-act{background:#fdfaf5}
.era .s-act .act-top{display:flex;height:100%}
.era .s-act .act-left{width:840px;flex-shrink:0;padding:70px 80px 70px 90px;display:flex;flex-direction:column;border-right:1px solid #e8e0d4}
.era .s-act .act-right{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;position:relative}
.era .act-badge{display:inline-flex;align-items:center;gap:10px;padding:8px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:28px;width:fit-content}
.era .act-left h2{font-family:'Playfair Display',serif;font-size:46px;color:#0f172a;line-height:1.1;margin-bottom:32px}
.era .scenario-text{font-size:21px;color:#334155;line-height:1.7;margin-bottom:32px;flex:1}
.era .scenario-text strong{color:#0f172a;font-weight:600}
.era .entities-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px}
.era .entity-pill{padding:6px 18px;border-radius:6px;font-size:15px;font-weight:600;letter-spacing:.03em}
.era .task-card{border-radius:12px;padding:24px 30px;border-left:5px solid}
.era .task-card .task-title{font-size:14px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.era .task-card ul{list-style:none;padding:0}
.era .task-card ul li{font-size:18px;color:#1e293b;padding:4px 0;display:flex;align-items:flex-start;gap:10px}
.era .task-card ul li::before{content:'→';font-weight:700;flex-shrink:0;margin-top:1px}

.era .s-ans{background:#f4f6fb}
.era .ans-header{padding:0 90px;height:96px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #dde3f5;flex-shrink:0;background:#fff}
.era .ans-badge{padding:7px 22px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.era .ans-header h2{font-family:'Playfair Display',serif;font-size:36px;color:#0f172a}
.era .ans-header .micro-legend{margin-left:auto;display:flex;gap:28px;align-items:center}
.era .micro-legend-item{display:flex;align-items:center;gap:10px;font-size:16px;color:#475569;font-weight:500}
.era .ml-entity{width:36px;height:20px;background:#1e40af;border-radius:2px}
.era .ml-rel{width:20px;height:20px;background:#92400e;transform:rotate(45deg);flex-shrink:0}
.era .ml-attr{width:40px;height:22px;border:2px solid #64748b;border-radius:50%}
.era .ans-diagram{flex:1;display:flex;align-items:center;justify-content:center;padding:24px 70px 56px;min-height:0}
.era .ans-diagram svg{width:100%;height:100%;display:block;overflow:visible}
.era .et{font:700 22px 'DM Sans',sans-serif;fill:white}
.era .rt{font:700 18px 'DM Sans',sans-serif;fill:white}
.era .at{font:500 17px 'DM Sans',sans-serif;fill:#1e293b}
.era .ct{font:700 28px 'DM Sans',sans-serif}
.era .ln{stroke:#94a3b8;stroke-width:2.5;fill:none}`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  {
    classes: 's-title',
    label: '01 Title',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="120" r="320" fill="rgba(96,165,250,0.05)"/>
  <circle cx="1750" cy="180" r="180" fill="rgba(96,165,250,0.07)"/>
  <circle cx="200"  cy="950" r="280" fill="rgba(96,165,250,0.04)"/>
  <pattern id="era-dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
    <circle cx="30" cy="30" r="1.5" fill="rgba(148,163,184,0.2)"/>
  </pattern>
  <rect width="1920" height="1080" fill="url(#era-dots)"/>
</svg>
<div class="inner">
  <p class="eyebrow">Database Design · Activity Series</p>
  <h1>ER Diagram<br/>Activities</h1>
  <div class="deco-line"></div>
  <p class="sub">Chen's Notation · 5 Real-World Scenarios</p>
</div>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-legend',
    label: '02 Notation Legend',
    html: `<div class="leg-header">
  <h2>Chen's Notation — Symbol Reference</h2>
  <p style="font-size:24px;color:#64748b;margin-top:8px">Use this guide while completing each activity</p>
</div>
<svg viewBox="0 0 1720 760" style="width:100%;flex:1;padding:0 40px">
  <g transform="translate(170,130)">
    <rect x="-85" y="-36" width="170" height="72" rx="3" fill="#1e40af"/>
    <text text-anchor="middle" dy="7" font-family="'DM Sans',sans-serif" font-size="20" fill="white" font-weight="700">ENTITY</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Entity</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">A real-world object or concept</text>
  </g>
  <g transform="translate(530,130)">
    <rect x="-85" y="-36" width="170" height="72" rx="3" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <rect x="-77" y="-28" width="154" height="56" rx="2" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
    <text text-anchor="middle" dy="7" font-family="'DM Sans',sans-serif" font-size="18" fill="#60a5fa" font-weight="700">ENTITY</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Weak Entity</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Depends on a strong entity</text>
  </g>
  <g transform="translate(900,130)">
    <polygon points="0,-60 110,0 0,60 -110,0" fill="#92400e"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="18" fill="white" font-weight="700">REL</text>
    <text x="0" y="84" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Relationship</text>
    <text x="0" y="108" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Association between entities</text>
  </g>
  <g transform="translate(1320,130)">
    <polygon points="0,-60 110,0 0,60 -110,0" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
    <polygon points="0,-50 94,0 0,50 -94,0" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="14" fill="#f59e0b" font-weight="700">REL</text>
    <text x="0" y="84" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Identifying Rel.</text>
    <text x="0" y="108" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Links weak entity to strong</text>
  </g>
  <line x1="100" y1="310" x2="1620" y2="310" stroke="#1e3a5a" stroke-width="1"/>
  <g transform="translate(170,420)">
    <ellipse rx="85" ry="36" fill="white" stroke="#475569" stroke-width="2"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="16" fill="#1e293b">attribute</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Attribute</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Property of an entity</text>
  </g>
  <g transform="translate(530,420)">
    <ellipse rx="85" ry="36" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
    <text text-anchor="middle" dy="2" font-family="'DM Sans',sans-serif" font-size="16" fill="#1e293b" font-weight="600">attribute</text>
    <line x1="-45" y1="10" x2="45" y2="10" stroke="#1e293b" stroke-width="2"/>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Key Attribute</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Uniquely identifies entity (PK)</text>
  </g>
  <g transform="translate(900,420)">
    <ellipse rx="85" ry="36" fill="none" stroke="#475569" stroke-width="2"/>
    <ellipse rx="73" ry="25" fill="white" stroke="#475569" stroke-width="2"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="14" fill="#1e293b">{attribute}</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Multi-valued</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Can have multiple values</text>
  </g>
  <g transform="translate(1320,420)">
    <ellipse rx="85" ry="36" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="8,5"/>
    <text text-anchor="middle" dy="6" font-family="'DM Sans',sans-serif" font-size="16" fill="#475569" font-style="italic">attribute</text>
    <text x="0" y="66" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="18" fill="#e2e8f0" font-weight="600">Derived Attribute</text>
    <text x="0" y="90" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="14" fill="#64748b">Calculated from other attributes</text>
  </g>
  <g transform="translate(100,630)">
    <text font-family="'DM Sans',sans-serif" font-size="16" fill="#64748b" font-weight="500">CARDINALITY NOTATION</text>
    <line x1="0" y1="40" x2="220" y2="40" stroke="#475569" stroke-width="2"/>
    <text x="10"  y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#1e40af" font-weight="700">1</text>
    <text x="210" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#1e40af" font-weight="700">1</text>
    <text x="110" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">One-to-One (1:1)</text>
    <line x1="340" y1="40" x2="560" y2="40" stroke="#475569" stroke-width="2"/>
    <text x="350" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#1e40af" font-weight="700">1</text>
    <text x="550" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#dc2626" font-weight="700">N</text>
    <text x="450" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">One-to-Many (1:N)</text>
    <line x1="680" y1="40" x2="900" y2="40" stroke="#475569" stroke-width="2"/>
    <text x="690" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#dc2626" font-weight="700">M</text>
    <text x="890" y="68" font-family="'DM Sans',sans-serif" font-size="22" fill="#dc2626" font-weight="700">N</text>
    <text x="790" y="36" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="13" fill="#64748b">Many-to-Many (M:N)</text>
  </g>
</svg>
<div class="cr cr-light">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '03 Activity 1 – Library',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.4" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#bfdbfe" stroke-width="1"/>
  <circle cx="1700" cy="540" r="340" fill="none" stroke="#bfdbfe" stroke-width="1"/>
  <circle cx="1700" cy="540" r="180" fill="none" stroke="#bfdbfe" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#dbeafe;color:#1d4ed8;">Activity 01</div>
    <h2>Library Management System</h2>
    <p class="scenario-text">A <strong>library</strong> lends books to its members. Each <strong>book</strong> has an ISBN, title, and genre. Each <strong>member</strong> has a member ID, name, and email address.<br><br>A member can <strong>borrow</strong> multiple books over time, and the same book may be borrowed by many different members. Each borrowing transaction records a <em>borrow date</em> and a <em>return date</em>.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#dbeafe;color:#1e40af;">MEMBER</span>
      <span class="entity-pill" style="background:#dbeafe;color:#1e40af;">BOOK</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">BORROWS</span>
    </div>
    <div class="task-card" style="background:#eff6ff;border-color:#1d4ed8;">
      <div class="task-title" style="color:#1d4ed8;">Your Task</div>
      <ul>
        <li>Identify all entities and their attributes</li>
        <li>Mark each primary key (underline it)</li>
        <li>Draw the BORROWS relationship with correct cardinality</li>
        <li>Add relationship attributes (BorrowDate, ReturnDate)</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 420 380" style="width:380px;height:auto">
      <rect x="20" y="310" width="380" height="16" rx="4" fill="#d1c4a8"/>
      <rect x="40"  y="140" width="52" height="172" rx="4" fill="#1d4ed8"/>
      <rect x="100" y="110" width="44" height="200" rx="4" fill="#7c3aed"/>
      <rect x="152" y="150" width="38" height="160" rx="4" fill="#dc2626"/>
      <rect x="198" y="125" width="50" height="185" rx="4" fill="#059669"/>
      <rect x="256" y="155" width="42" height="155" rx="4" fill="#d97706"/>
      <rect x="306" y="130" width="46" height="180" rx="4" fill="#0891b2"/>
      <g transform="translate(90,260)">
        <path d="M0,0 Q30,-20 60,0 Q90,-20 120,0 L120,60 Q90,40 60,60 Q30,40 0,60 Z" fill="#fef9ee" stroke="#d1c4a8" stroke-width="1.5"/>
        <line x1="60" y1="0" x2="60" y2="60" stroke="#d1c4a8" stroke-width="1"/>
        <line x1="10" y1="20" x2="55" y2="22" stroke="#cbd5e1" stroke-width="1"/>
        <line x1="10" y1="30" x2="55" y2="32" stroke="#cbd5e1" stroke-width="1"/>
        <line x1="65" y1="20" x2="110" y2="22" stroke="#cbd5e1" stroke-width="1"/>
        <line x1="65" y1="30" x2="110" y2="32" stroke="#cbd5e1" stroke-width="1"/>
      </g>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '04 Answer 1 – Library',
    html: `<div class="ans-header">
  <span class="ans-badge" style="background:#dbeafe;color:#1d4ed8;">Answer 01</span>
  <h2>Library Management System</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1720 600" preserveAspectRatio="xMidYMid meet">
    <line x1="295" y1="300" x2="855" y2="300" class="ln"/>
    <line x1="855" y1="300" x2="1415" y2="300" class="ln"/>
    <line x1="295" y1="300" x2="100" y2="115" class="ln"/>
    <line x1="295" y1="300" x2="48"  y2="300" class="ln"/>
    <line x1="295" y1="300" x2="100" y2="485" class="ln"/>
    <line x1="855" y1="300" x2="625" y2="95"  class="ln"/>
    <line x1="855" y1="300" x2="1085" y2="95" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="115" class="ln"/>
    <line x1="1415" y1="300" x2="1662" y2="300" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="485" class="ln"/>
    <polygon points="855,228 970,300 855,372 740,300" fill="#92400e"/>
    <text x="855" y="306" text-anchor="middle" class="rt">BORROWS</text>
    <rect x="195" y="265" width="200" height="70" rx="3" fill="#1e40af"/>
    <text x="295" y="306" text-anchor="middle" class="et">MEMBER</text>
    <rect x="1315" y="265" width="200" height="70" rx="3" fill="#1e40af"/>
    <text x="1415" y="306" text-anchor="middle" class="et">BOOK</text>
    <ellipse cx="100" cy="100" rx="95" ry="36" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
    <text x="100" y="97" text-anchor="middle" class="at" font-weight="600">MemberID</text>
    <line x1="28" y1="108" x2="172" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="48" cy="300" rx="80" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="48" y="305" text-anchor="middle" class="at">Name</text>
    <ellipse cx="100" cy="490" rx="80" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="100" y="495" text-anchor="middle" class="at">Email</text>
    <ellipse cx="625"  cy="78" rx="105" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="625"  y="83" text-anchor="middle" class="at">BorrowDate</text>
    <ellipse cx="1085" cy="78" rx="105" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1085" y="83" text-anchor="middle" class="at">ReturnDate</text>
    <ellipse cx="1610" cy="100" rx="82" ry="36" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
    <text x="1610" y="97" text-anchor="middle" class="at" font-weight="600">ISBN</text>
    <line x1="1546" y1="108" x2="1674" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1662" cy="300" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1662" y="305" text-anchor="middle" class="at">Title</text>
    <ellipse cx="1610" cy="490" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1610" y="495" text-anchor="middle" class="at">Genre</text>
    <text x="590"  y="275" text-anchor="middle" class="ct" fill="#1d4ed8">M</text>
    <text x="1120" y="275" text-anchor="middle" class="ct" fill="#1d4ed8">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '05 Activity 2 – University',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#ddd6fe" stroke-width="1"/>
  <circle cx="1700" cy="540" r="340" fill="none" stroke="#ddd6fe" stroke-width="1"/>
  <circle cx="1700" cy="540" r="180" fill="none" stroke="#ddd6fe" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#ede9fe;color:#7c3aed;">Activity 02</div>
    <h2>University Course Enrollment</h2>
    <p class="scenario-text">A <strong>university</strong> manages student enrollments in courses. Each <strong>student</strong> has a student ID, full name, and GPA. Each <strong>course</strong> has a course code, title, and number of credits.<br><br>Students can <strong>enroll in</strong> multiple courses each semester, and each course can have many students enrolled. The enrollment records the <em>semester</em> and <em>grade</em> the student received.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#ede9fe;color:#7c3aed;">STUDENT</span>
      <span class="entity-pill" style="background:#ede9fe;color:#7c3aed;">COURSE</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">ENROLLS_IN</span>
    </div>
    <div class="task-card" style="background:#f5f3ff;border-color:#7c3aed;">
      <div class="task-title" style="color:#7c3aed;">Your Task</div>
      <ul>
        <li>Identify all entities and their key attributes</li>
        <li>Determine the cardinality of the enrollment relationship</li>
        <li>Add Semester and Grade as relationship attributes</li>
        <li>Underline the primary key in each entity</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 400 360" style="width:360px;height:auto">
      <rect x="60" y="160" width="280" height="160" fill="#7c3aed" rx="4"/>
      <rect x="80"  y="160" width="20" height="160" fill="rgba(255,255,255,0.1)"/>
      <rect x="130" y="160" width="20" height="160" fill="rgba(255,255,255,0.1)"/>
      <rect x="250" y="160" width="20" height="160" fill="rgba(255,255,255,0.1)"/>
      <rect x="300" y="160" width="20" height="160" fill="rgba(255,255,255,0.1)"/>
      <rect x="95"  y="190" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="150" y="190" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="215" y="190" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="270" y="190" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="95"  y="240" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="150" y="240" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="215" y="240" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="270" y="240" width="35" height="30" rx="2" fill="#bfdbfe"/>
      <rect x="175" y="280" width="50" height="40" rx="3" fill="#4c1d95"/>
      <polygon points="40,160 200,60 360,160" fill="#5b21b6"/>
      <rect x="80"  y="130" width="16" height="30" fill="#6d28d9"/>
      <rect x="180" y="100" width="16" height="60" fill="#6d28d9"/>
      <rect x="304" y="130" width="16" height="30" fill="#6d28d9"/>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '06 Answer 2 – University',
    html: `<div class="ans-header">
  <span class="ans-badge" style="background:#ede9fe;color:#7c3aed;">Answer 02</span>
  <h2>University Course Enrollment</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1720 600" preserveAspectRatio="xMidYMid meet">
    <line x1="295" y1="300" x2="855" y2="300" class="ln"/>
    <line x1="855" y1="300" x2="1415" y2="300" class="ln"/>
    <line x1="295" y1="300" x2="100" y2="115" class="ln"/>
    <line x1="295" y1="300" x2="48"  y2="300" class="ln"/>
    <line x1="295" y1="300" x2="100" y2="485" class="ln"/>
    <line x1="855" y1="300" x2="625" y2="95"  class="ln"/>
    <line x1="855" y1="300" x2="1085" y2="95" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="115" class="ln"/>
    <line x1="1415" y1="300" x2="1662" y2="300" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="485" class="ln"/>
    <polygon points="855,228 970,300 855,372 740,300" fill="#6d28d9"/>
    <text x="855" y="298" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="white" font-weight="700">ENROLLS</text>
    <text x="855" y="317" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="17" fill="white" font-weight="700">_IN</text>
    <rect x="195" y="265" width="200" height="70" rx="3" fill="#6d28d9"/>
    <text x="295" y="306" text-anchor="middle" class="et">STUDENT</text>
    <rect x="1315" y="265" width="200" height="70" rx="3" fill="#6d28d9"/>
    <text x="1415" y="306" text-anchor="middle" class="et">COURSE</text>
    <ellipse cx="100" cy="100" rx="100" ry="36" fill="#ede9fe" stroke="#6d28d9" stroke-width="2.5"/>
    <text x="100" y="97" text-anchor="middle" class="at" font-weight="600">StudentID</text>
    <line x1="24"  y1="108" x2="176" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="48"  cy="300" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="48"  y="305" text-anchor="middle" class="at">Name</text>
    <ellipse cx="100" cy="490" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="100" y="495" text-anchor="middle" class="at">GPA</text>
    <ellipse cx="625"  cy="78" rx="105" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="625"  y="83" text-anchor="middle" class="at">Semester</text>
    <ellipse cx="1085" cy="78" rx="90"  ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1085" y="83" text-anchor="middle" class="at">Grade</text>
    <ellipse cx="1610" cy="100" rx="105" ry="36" fill="#ede9fe" stroke="#6d28d9" stroke-width="2.5"/>
    <text x="1610" y="97" text-anchor="middle" class="at" font-weight="600">CourseCode</text>
    <line x1="1530" y1="108" x2="1690" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1662" cy="300" rx="78" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1662" y="305" text-anchor="middle" class="at">Title</text>
    <ellipse cx="1610" cy="490" rx="85" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1610" y="495" text-anchor="middle" class="at">Credits</text>
    <text x="590"  y="275" text-anchor="middle" class="ct" fill="#7c3aed">M</text>
    <text x="1120" y="275" text-anchor="middle" class="ct" fill="#7c3aed">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '07 Activity 3 – Hospital',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#fecaca" stroke-width="1"/>
  <circle cx="1700" cy="540" r="320" fill="none" stroke="#fecaca" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#fee2e2;color:#dc2626;">Activity 03</div>
    <h2>Hospital Patient Management</h2>
    <p class="scenario-text">A <strong>hospital</strong> manages doctors, patients, and departments. Each <strong>doctor</strong> has a doctor ID, name, and specialization. Each <strong>patient</strong> has a patient ID, name, and date of birth. Each <strong>department</strong> has a department ID and name.<br><br>Each doctor <strong>works in</strong> exactly one department (a department has many doctors). Doctors can <strong>treat</strong> many patients, and patients may be treated by many doctors. Each treatment records a <em>treatment date</em>.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#fee2e2;color:#dc2626;">DOCTOR</span>
      <span class="entity-pill" style="background:#fee2e2;color:#dc2626;">PATIENT</span>
      <span class="entity-pill" style="background:#fee2e2;color:#dc2626;">DEPARTMENT</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">WORKS_IN</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">TREATS</span>
    </div>
    <div class="task-card" style="background:#fff1f2;border-color:#dc2626;">
      <div class="task-title" style="color:#dc2626;">Your Task</div>
      <ul>
        <li>Draw all three entities with their attributes and PKs</li>
        <li>Show WORKS_IN (M:1) between DOCTOR and DEPARTMENT</li>
        <li>Show TREATS (M:N) between DOCTOR and PATIENT</li>
        <li>Add TreatmentDate as a relationship attribute on TREATS</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 380 360" style="width:340px;height:auto">
      <rect x="60" y="120" width="260" height="210" fill="#dc2626" rx="4"/>
      <rect x="80"  y="145" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="167" y="145" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="255" y="145" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="80"  y="207" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="255" y="207" width="45" height="40" rx="2" fill="#fca5a5"/>
      <rect x="158" y="270" width="64" height="60" rx="3" fill="#991b1b"/>
      <rect x="40" y="108" width="300" height="20" rx="3" fill="#b91c1c"/>
      <line x1="190" y1="20" x2="190" y2="110" stroke="#b91c1c" stroke-width="3"/>
      <rect x="190" y="20" width="40" height="24" fill="#fca5a5" rx="2"/>
      <rect x="20" y="328" width="340" height="12" rx="4" fill="#d1c4a8"/>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '08 Answer 3 – Hospital',
    html: `<div class="ans-header">
  <span class="ans-badge" style="background:#fee2e2;color:#dc2626;">Answer 03</span>
  <h2>Hospital Patient Management</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1760 640" preserveAspectRatio="xMidYMid meet">
    <line x1="280" y1="440" x2="600" y2="270" class="ln"/>
    <line x1="600" y1="270" x2="1000" y2="170" class="ln"/>
    <line x1="280" y1="440" x2="860" y2="440" class="ln"/>
    <line x1="860" y1="440" x2="1440" y2="440" class="ln"/>
    <line x1="280" y1="440" x2="85"  y2="290" class="ln"/>
    <line x1="280" y1="440" x2="45"  y2="440" class="ln"/>
    <line x1="280" y1="440" x2="85"  y2="580" class="ln"/>
    <line x1="1000" y1="170" x2="840" y2="58"  class="ln"/>
    <line x1="1000" y1="170" x2="1200" y2="75" class="ln"/>
    <line x1="1440" y1="440" x2="1635" y2="290" class="ln"/>
    <line x1="1440" y1="440" x2="1675" y2="440" class="ln"/>
    <line x1="1440" y1="440" x2="1635" y2="580" class="ln"/>
    <line x1="860" y1="440" x2="860" y2="560" class="ln"/>
    <polygon points="600,200 690,270 600,340 510,270" fill="#b91c1c"/>
    <text x="600" y="266" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="white" font-weight="700">WORKS</text>
    <text x="600" y="283" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="15" fill="white" font-weight="700">_IN</text>
    <polygon points="860,372 960,440 860,508 760,440" fill="#b91c1c"/>
    <text x="860" y="446" text-anchor="middle" class="rt">TREATS</text>
    <rect x="180" y="405" width="200" height="70" rx="3" fill="#dc2626"/>
    <text x="280" y="446" text-anchor="middle" class="et">DOCTOR</text>
    <rect x="900" y="135" width="200" height="70" rx="3" fill="#dc2626"/>
    <text x="1000" y="176" text-anchor="middle" class="et">DEPARTMENT</text>
    <rect x="1340" y="405" width="200" height="70" rx="3" fill="#dc2626"/>
    <text x="1440" y="446" text-anchor="middle" class="et">PATIENT</text>
    <ellipse cx="85"  cy="272" rx="95"  ry="34" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
    <text x="85"  y="269" text-anchor="middle" class="at" font-weight="600">DoctorID</text>
    <line x1="14"  y1="278" x2="156" y2="278" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="45"  cy="440" rx="72"  ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="45"  y="445" text-anchor="middle" class="at">Name</text>
    <ellipse cx="85"  cy="590" rx="108" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="85"  y="595" text-anchor="middle" class="at">Specialization</text>
    <ellipse cx="840"  cy="40" rx="88"  ry="34" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
    <text x="840"  y="37" text-anchor="middle" class="at" font-weight="600">DeptID</text>
    <line x1="776"  y1="46" x2="904" y2="46" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1210" cy="55" rx="100" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1210" y="60" text-anchor="middle" class="at">DeptName</text>
    <ellipse cx="1635" cy="272" rx="95"  ry="34" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
    <text x="1635" y="269" text-anchor="middle" class="at" font-weight="600">PatientID</text>
    <line x1="1564" y1="278" x2="1706" y2="278" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1675" cy="440" rx="72"  ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1675" y="445" text-anchor="middle" class="at">Name</text>
    <ellipse cx="1635" cy="590" rx="72"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1635" y="595" text-anchor="middle" class="at">DOB</text>
    <ellipse cx="860"  cy="578" rx="115" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="860"  y="583" text-anchor="middle" class="at">TreatmentDate</text>
    <text x="424" y="385" text-anchor="middle" class="ct" fill="#dc2626">M</text>
    <text x="808" y="218" text-anchor="middle" class="ct" fill="#dc2626">1</text>
    <text x="556" y="424" text-anchor="middle" class="ct" fill="#dc2626">M</text>
    <text x="1165" y="424" text-anchor="middle" class="ct" fill="#dc2626">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '09 Activity 4 – Online Store',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#fde68a" stroke-width="1"/>
  <circle cx="1700" cy="540" r="320" fill="none" stroke="#fde68a" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#fef3c7;color:#d97706;">Activity 04</div>
    <h2>Online Store Orders</h2>
    <p class="scenario-text">An <strong>online store</strong> tracks customers, their orders, and products. Each <strong>customer</strong> has a customer ID, name, and address. Each <strong>product</strong> has a product ID, name, and unit price. Each <strong>order</strong> has an order ID and order date.<br><br>A customer can <strong>place</strong> many orders (each order belongs to one customer). An order can <strong>contain</strong> multiple products, and a product can appear in many orders. Each order-line records the <em>quantity</em> ordered.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#fef3c7;color:#d97706;">CUSTOMER</span>
      <span class="entity-pill" style="background:#fef3c7;color:#d97706;">ORDER</span>
      <span class="entity-pill" style="background:#fef3c7;color:#d97706;">PRODUCT</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">PLACES</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">CONTAINS</span>
    </div>
    <div class="task-card" style="background:#fffbeb;border-color:#d97706;">
      <div class="task-title" style="color:#d97706;">Your Task</div>
      <ul>
        <li>Draw all three entities with their key attributes</li>
        <li>Show PLACES (1:N) between CUSTOMER and ORDER</li>
        <li>Show CONTAINS (M:N) between ORDER and PRODUCT</li>
        <li>Add Quantity as a relationship attribute on CONTAINS</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 380 360" style="width:340px;height:auto">
      <path d="M60,120 L60,310 Q60,330 80,330 L300,330 Q320,330 320,310 L320,120 Z" fill="#d97706"/>
      <rect x="60" y="108" width="260" height="22" rx="4" fill="#b45309"/>
      <path d="M130,108 Q130,50 190,50 Q250,50 250,108" fill="none" stroke="#92400e" stroke-width="14" stroke-linecap="round"/>
      <rect x="90"  y="160" width="70" height="80" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
      <rect x="100" y="170" width="50" height="10" rx="2" fill="#d97706"/>
      <rect x="180" y="145" width="70" height="95" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
      <rect x="190" y="157" width="50" height="10" rx="2" fill="#d97706"/>
      <rect x="240" y="258" width="60" height="30" rx="4" fill="white" stroke="#d97706" stroke-width="1.5"/>
      <text x="270" y="278" text-anchor="middle" font-size="14" font-family="monospace" fill="#d97706" font-weight="700">$24</text>
      <rect x="20" y="338" width="340" height="12" rx="4" fill="#d1c4a8"/>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '10 Answer 4 – Online Store',
    html: `<div class="ans-header">
  <span class="ans-badge" style="background:#fef3c7;color:#d97706;">Answer 04</span>
  <h2>Online Store Orders</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1740 590" preserveAspectRatio="xMidYMid meet">
    <line x1="185" y1="310" x2="510" y2="310" class="ln"/>
    <line x1="510" y1="310" x2="845" y2="310" class="ln"/>
    <line x1="845" y1="310" x2="1180" y2="310" class="ln"/>
    <line x1="1180" y1="310" x2="1535" y2="310" class="ln"/>
    <line x1="185" y1="310" x2="65"  y2="148" class="ln"/>
    <line x1="185" y1="310" x2="0"   y2="320" class="ln"/>
    <line x1="185" y1="310" x2="65"  y2="475" class="ln"/>
    <line x1="845" y1="310" x2="845" y2="148" class="ln"/>
    <line x1="845" y1="310" x2="845" y2="475" class="ln"/>
    <line x1="1180" y1="310" x2="1180" y2="148" class="ln"/>
    <line x1="1535" y1="310" x2="1655" y2="148" class="ln"/>
    <line x1="1535" y1="310" x2="1720" y2="320" class="ln"/>
    <line x1="1535" y1="310" x2="1655" y2="475" class="ln"/>
    <polygon points="510,242 620,310 510,378 400,310" fill="#b45309"/>
    <text x="510" y="316" text-anchor="middle" class="rt">PLACES</text>
    <polygon points="1180,242 1290,310 1180,378 1070,310" fill="#b45309"/>
    <text x="1180" y="316" text-anchor="middle" class="rt">CONTAINS</text>
    <rect x="85"  y="275" width="200" height="70" rx="3" fill="#d97706"/>
    <text x="185" y="316" text-anchor="middle" class="et">CUSTOMER</text>
    <rect x="745" y="275" width="200" height="70" rx="3" fill="#d97706"/>
    <text x="845" y="316" text-anchor="middle" class="et">ORDER</text>
    <rect x="1435" y="275" width="200" height="70" rx="3" fill="#d97706"/>
    <text x="1535" y="316" text-anchor="middle" class="et">PRODUCT</text>
    <ellipse cx="65"  cy="128" rx="105" ry="36" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <text x="65"  y="125" text-anchor="middle" class="at" font-weight="600">CustomerID</text>
    <line x1="-20" y1="135" x2="150" y2="135" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="0"   cy="320" rx="72"  ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="0"   y="325" text-anchor="middle" class="at">Name</text>
    <ellipse cx="65"  cy="490" rx="88"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="65"  y="495" text-anchor="middle" class="at">Address</text>
    <ellipse cx="845" cy="125" rx="90"  ry="36" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <text x="845" y="122" text-anchor="middle" class="at" font-weight="600">OrderID</text>
    <line x1="775" y1="132" x2="915" y2="132" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="845" cy="490" rx="100" ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="845" y="495" text-anchor="middle" class="at">OrderDate</text>
    <ellipse cx="1180" cy="120" rx="96"  ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1180" y="125" text-anchor="middle" class="at">Quantity</text>
    <ellipse cx="1655" cy="128" rx="98"  ry="36" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <text x="1655" y="125" text-anchor="middle" class="at" font-weight="600">ProductID</text>
    <line x1="1577" y1="135" x2="1733" y2="135" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1720" cy="320" rx="74"  ry="32" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1720" y="325" text-anchor="middle" class="at">Name</text>
    <ellipse cx="1655" cy="490" rx="74"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1655" y="495" text-anchor="middle" class="at">Price</text>
    <text x="360"  y="288" text-anchor="middle" class="ct" fill="#d97706">1</text>
    <text x="660"  y="288" text-anchor="middle" class="ct" fill="#d97706">N</text>
    <text x="1035" y="288" text-anchor="middle" class="ct" fill="#d97706">M</text>
    <text x="1325" y="288" text-anchor="middle" class="ct" fill="#d97706">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-act',
    label: '11 Activity 5 – Hotel',
    html: `<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.3" viewBox="0 0 1920 1080">
  <circle cx="1700" cy="540" r="500" fill="none" stroke="#a7f3d0" stroke-width="1"/>
  <circle cx="1700" cy="540" r="320" fill="none" stroke="#a7f3d0" stroke-width="1"/>
</svg>
<div class="act-top">
  <div class="act-left">
    <div class="act-badge" style="background:#d1fae5;color:#059669;">Activity 05</div>
    <h2>Hotel Room Booking</h2>
    <p class="scenario-text">A <strong>hotel</strong> manages guest reservations for its rooms. Each <strong>guest</strong> has a guest ID, full name, and phone number. Each <strong>room</strong> has a room number, room type (single/double/suite), and nightly rate.<br><br>A guest can <strong>book</strong> multiple rooms over different stays, and the same room can be booked by many guests across different periods. Each booking records a <em>check-in date</em> and a <em>check-out date</em>.</p>
    <div class="entities-row">
      <span class="entity-pill" style="background:#d1fae5;color:#059669;">GUEST</span>
      <span class="entity-pill" style="background:#d1fae5;color:#059669;">ROOM</span>
      <span class="entity-pill" style="background:#fef3c7;color:#92400e;">BOOKS</span>
    </div>
    <div class="task-card" style="background:#ecfdf5;border-color:#059669;">
      <div class="task-title" style="color:#059669;">Your Task</div>
      <ul>
        <li>Identify all entities and their primary keys</li>
        <li>Determine the correct cardinality for BOOKS</li>
        <li>Add CheckInDate and CheckOutDate as relationship attributes</li>
        <li>Ensure all attributes connect to the correct entity or relationship</li>
      </ul>
    </div>
  </div>
  <div class="act-right">
    <svg viewBox="0 0 380 360" style="width:340px;height:auto">
      <rect x="80" y="100" width="220" height="228" fill="#059669" rx="4"/>
      <rect x="30" y="160" width="60" height="168" fill="#047857" rx="4"/>
      <rect x="290" y="160" width="60" height="168" fill="#047857" rx="4"/>
      <rect x="100" y="120" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="145" y="120" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="190" y="120" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="235" y="120" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="100" y="165" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="145" y="165" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="190" y="165" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="235" y="165" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="100" y="210" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="235" y="210" width="32" height="28" rx="2" fill="#a7f3d0"/>
      <rect x="38" y="178" width="28" height="22" rx="2" fill="#a7f3d0"/>
      <rect x="314" y="178" width="28" height="22" rx="2" fill="#a7f3d0"/>
      <rect x="155" y="268" width="70" height="60" rx="3" fill="#064e3b"/>
      <rect x="135" y="78" width="110" height="28" rx="4" fill="#065f46"/>
      <text x="190" y="97" text-anchor="middle" font-size="16" font-family="'DM Sans',sans-serif" fill="#a7f3d0" font-weight="700" letter-spacing="3">HOTEL</text>
      <rect x="10" y="328" width="360" height="12" rx="4" fill="#d1c4a8"/>
    </svg>
  </div>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 's-ans',
    label: '12 Answer 5 – Hotel',
    html: `<div class="ans-header">
  <span class="ans-badge" style="background:#d1fae5;color:#059669;">Answer 05</span>
  <h2>Hotel Room Booking</h2>
  <div class="micro-legend">
    <div class="micro-legend-item"><div class="ml-entity"></div> Entity</div>
    <div class="micro-legend-item"><div class="ml-rel"></div> Relationship</div>
    <div class="micro-legend-item"><div class="ml-attr"></div> Attribute</div>
  </div>
</div>
<div class="ans-diagram">
  <svg viewBox="0 0 1720 600" preserveAspectRatio="xMidYMid meet">
    <line x1="295"  y1="300" x2="855"  y2="300" class="ln"/>
    <line x1="855"  y1="300" x2="1415" y2="300" class="ln"/>
    <line x1="295"  y1="300" x2="100"  y2="115" class="ln"/>
    <line x1="295"  y1="300" x2="48"   y2="300" class="ln"/>
    <line x1="295"  y1="300" x2="100"  y2="485" class="ln"/>
    <line x1="855"  y1="300" x2="625"  y2="95"  class="ln"/>
    <line x1="855"  y1="300" x2="1085" y2="95"  class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="115" class="ln"/>
    <line x1="1415" y1="300" x2="1662" y2="300" class="ln"/>
    <line x1="1415" y1="300" x2="1610" y2="485" class="ln"/>
    <polygon points="855,228 970,300 855,372 740,300" fill="#047857"/>
    <text x="855" y="306" text-anchor="middle" class="rt">BOOKS</text>
    <rect x="195" y="265" width="200" height="70" rx="3" fill="#059669"/>
    <text x="295" y="306" text-anchor="middle" class="et">GUEST</text>
    <rect x="1315" y="265" width="200" height="70" rx="3" fill="#059669"/>
    <text x="1415" y="306" text-anchor="middle" class="et">ROOM</text>
    <ellipse cx="100"  cy="100" rx="92"  ry="36" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
    <text x="100"  y="97"  text-anchor="middle" class="at" font-weight="600">GuestID</text>
    <line x1="30"   y1="108" x2="170" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="48"   cy="300" rx="78"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="48"   y="305" text-anchor="middle" class="at">Name</text>
    <ellipse cx="100"  cy="490" rx="80"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="100"  y="495" text-anchor="middle" class="at">Phone</text>
    <ellipse cx="625"  cy="78"  rx="112" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="625"  y="83"  text-anchor="middle" class="at">CheckInDate</text>
    <ellipse cx="1085" cy="78"  rx="120" ry="36" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1085" y="83"  text-anchor="middle" class="at">CheckOutDate</text>
    <ellipse cx="1610" cy="100" rx="88"  ry="36" fill="#d1fae5" stroke="#059669" stroke-width="2.5"/>
    <text x="1610" y="97"  text-anchor="middle" class="at" font-weight="600">RoomNo</text>
    <line x1="1546" y1="108" x2="1674" y2="108" stroke="#1e293b" stroke-width="2"/>
    <ellipse cx="1662" cy="300" rx="78"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1662" y="305" text-anchor="middle" class="at">Type</text>
    <ellipse cx="1610" cy="490" rx="78"  ry="34" fill="white" stroke="#94a3b8" stroke-width="2"/>
    <text x="1610" y="495" text-anchor="middle" class="at">Rate</text>
    <text x="590"  y="275" text-anchor="middle" class="ct" fill="#059669">M</text>
    <text x="1120" y="275" text-anchor="middle" class="ct" fill="#059669">N</text>
  </svg>
</div>
<div class="cr cr-dark">© All Rights Reserved by Yasas Sri Wickramasinghe</div>`,
  },
];

export default function ERDiagramActivitiesDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded]     = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale]   = useState(0.5);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const id = 'era-deck-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = DECK_CSS;
      document.head.appendChild(el);
    }
    return () => { document.getElementById('era-deck-styles')?.remove(); };
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (isFullscreen && h > 0) {
        const s = Math.min(w / 1920, h / 1080);
        setScale(s);
        setOffset({ x: (w - 1920 * s) / 2, y: (h - 1080 * s) / 2 });
      } else {
        setScale(w / 1920);
        setOffset({ x: 0, y: 0 });
      }
    };
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    measure();
    return () => obs.disconnect();
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) deckRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(c + 1, SLIDES.length - 1));
      if (e.key === 'ArrowLeft')  setCurrent(c => Math.max(c - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const slide = SLIDES[current];
  const total = SLIDES.length;
  const DOT_ACTIVE = '#1d4ed8';

  return (
    <div
      ref={deckRef}
      style={{
        background: '#0f172a',
        borderRadius: isFullscreen ? 0 : 16,
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1.5px solid rgba(29,78,216,0.3)',
        boxShadow: isFullscreen ? 'none' : '0 8px 32px rgba(0,0,0,0.25)',
        ...(isFullscreen ? { display: 'flex', flexDirection: 'column' as const, height: '100%' } : {}),
      }}
    >
      {/* toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F87171' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FBBF24' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#34D399' }} />
          <span style={{ marginLeft: 10, fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            MBI802 · ER Diagram Activities · {current + 1} / {total} · ← → to navigate
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {!isFullscreen && (
            <button onClick={() => setExpanded(v => !v)}
              style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          )}
          <button onClick={toggleFullscreen}
            style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* slide canvas */}
      <div ref={wrapRef} style={{
        position: 'relative', width: '100%',
        ...(isFullscreen ? { flex: 1 } : { paddingBottom: expanded ? '75%' : '56.25%', transition: 'padding-bottom 0.3s ease' }),
        overflow: 'hidden', background: '#111',
      }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="era" style={{
            width: 1920, height: 1080,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'top left', position: 'relative',
          }}>
            <section className={slide.classes || undefined}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              dangerouslySetInnerHTML={{ __html: slide.html }}
            />
          </div>
        </div>
      </div>

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <button onClick={() => setCurrent(c => Math.max(c - 1, 0))} disabled={current === 0}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '6px 14px', color: current === 0 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: current === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
          <ChevronLeft size={14} /> Prev
        </button>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 400 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} title={SLIDES[i].label}
              style={{ width: i === current ? 20 : 7, height: 7, borderRadius: 999, background: i === current ? DOT_ACTIVE : 'rgba(255,255,255,0.2)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.25s ease', flexShrink: 0 }}
            />
          ))}
        </div>
        <button onClick={() => setCurrent(c => Math.min(c + 1, total - 1))} disabled={current === total - 1}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '6px 14px', color: current === total - 1 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: current === total - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
