import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

* {box-sizing:border-box;margin:0;padding:0}
.erd section {background:#FAF9F6;color:#1a2744;overflow:hidden;position:relative}
.erd .inner {position:absolute;inset:0;display:flex;flex-direction:column;padding:78px 108px 68px}
.erd .inner.center {align-items:center;justify-content:center;text-align:center}
.erd .kicker {font-size:24px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#0d7a72;margin-bottom:14px}
.erd .stitle {font-size:58px;font-weight:700;line-height:1.1}
.erd .body {font-size:31px;line-height:1.6}
.erd .small {font-size:25px;line-height:1.55}
.erd .cap {font-size:19px;color:#9ca3af;font-style:italic;text-align:center;margin-top:8px}
.erd .dark {background:#1a2744!important;color:#FAF9F6!important}
.erd .navy2 {background:#1e3a6e!important;color:#FAF9F6!important}
.erd .dark .kicker, .erd .navy2 .kicker {color:#5eead4}
.erd .bar {width:60px;height:6px;border-radius:3px;background:#0d7a72;margin-bottom:32px}
.erd .bar-amber {background:#c47c1a}
.erd .two {display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:start}
.erd .three {display:grid;grid-template-columns:1fr 1fr 1fr;gap:36px;align-items:start}
.erd .card {background:white;border-radius:14px;padding:32px 38px;box-shadow:0 2px 16px rgba(0,0,0,.07)}
.erd .card-t {background:#e6f4f3;border-left:5px solid #0d7a72;border-radius:10px;padding:28px 34px}
.erd .card-a {background:#fdf4e3;border-left:5px solid #c47c1a;border-radius:10px;padding:28px 34px}
.erd ul.clean {list-style:none}
.erd ul.clean li {display:flex;align-items:flex-start;gap:14px;font-size:29px;line-height:1.5;margin-bottom:20px}
.erd ul.clean li::before {content:'';display:block;width:9px;height:9px;border-radius:50%;background:#0d7a72;flex-shrink:0;margin-top:11px}
.erd .cr {position:absolute;bottom:26px;left:0;right:0;text-align:center;font-size:24px;color:#9ca3af;z-index:2}
.erd .dark .cr, .erd .navy2 .cr {color:rgba(255,255,255,.28)}
.erd .sec-num {font-size:200px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;position:absolute;right:80px;bottom:50px;z-index:0;pointer-events:none}
.erd svg text {font-family:'DM Sans',sans-serif}
.erd .shape-row {display:flex;align-items:center;gap:24px;margin-bottom:18px}
.erd .shape-label {font-size:26px;font-weight:700;min-width:200px}
.erd .shape-desc {font-size:22px;color:#374151;line-height:1.4}
.erd .pill {display:inline-block;padding:4px 16px;border-radius:100px;font-size:20px;font-weight:600}
.erd .step {display:flex;gap:20px;align-items:flex-start;margin-bottom:24px}
.erd .snum {width:48px;height:48px;border-radius:50%;background:#1a2744;color:white;font-size:22px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.erd .sbody {font-size:27px;line-height:1.5;padding-top:8px}`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  { classes: "dark", label: "01 Title", html: `<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.04" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0L0 0 0 60" fill="none" stroke="white" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>
<div style="position:absolute;bottom:60px;right:60px;font-size:260px;font-weight:700;color:rgba(255,255,255,.04);line-height:1;user-select:none">ER</div>
<div class="inner center">
  <div class="kicker" style="margin-bottom:28px">Database Management Systems</div>
  <h1 style="font-size:84px;font-weight:700;line-height:1.05;color:white;margin-bottom:28px">Entity-Relationship<br><span style="color:#5eead4">Diagrams</span></h1>
  <div style="width:80px;height:6px;border-radius:3px;background:#c47c1a;margin:0 auto 32px"></div>
  <p style="font-size:30px;color:rgba(255,255,255,.55);max-width:640px;line-height:1.6">A visual language for designing databases — from idea to blueprint</p>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "02 Agenda", html: `<div class="inner">
  <div class="kicker">Lesson Plan</div>
  <div class="stitle" style="margin-bottom:44px">What We'll Cover</div>
  <div style="display:flex;flex-direction:column;gap:18px;max-width:880px">
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#1a2744;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">1</div><div class="body">What is an ER diagram &amp; why do we use it?</div></div>
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#1a2744;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">2</div><div class="body">Two notations — Chen's vs. Crow's Foot</div></div>
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#0d7a72;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">3</div><div class="body">Chen's shapes — entity, attribute, key attribute, relationship</div></div>
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#0d7a72;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">4</div><div class="body">Cardinality — 1:1, 1:N, M:N</div></div>
    <div style="display:flex;align-items:center;gap:24px"><div style="width:52px;height:52px;background:#c47c1a;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:white;flex-shrink:0">5</div><div class="body">Drawing a complete ER diagram — step by step</div></div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "navy2", label: "03 Sec What Why", html: `<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">01</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">What &amp; Why ER Diagrams?</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:640px;line-height:1.6">Before we draw shapes — let's understand the purpose</p>
</div>
<div class="sec-num">01</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "04 What Is ER", html: `<div class="inner">
  <div class="kicker">Section 01</div>
  <div class="stitle" style="margin-bottom:40px">What Is an ER Diagram?</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean" style="padding:0">
        <li style="margin-bottom:20px"><span style="display:block;text-wrap:pretty">A <strong>blueprint</strong> for a database drawn <em>before</em> any code is written</span></li>
        <li style="margin-bottom:20px"><span style="display:block;text-wrap:pretty">Shows real-world <strong>things</strong>, their <strong>properties</strong>, and how they <strong>connect</strong></span></li>
        <li style="margin-bottom:20px"><span style="display:block;text-wrap:pretty">Invented by <strong>Peter Chen in 1976</strong></span></li>
        <li><span style="display:block;text-wrap:pretty">Language-neutral — any team can read it</span></li>
      </ul>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card" style="display:flex;align-items:center;gap:20px">
        <div style="font-size:48px">🏗️</div>
        <div><div style="font-size:24px;font-weight:700;margin-bottom:4px">Architect's Blueprint</div><div class="small" style="color:#6b7280">Plans rooms before building a house</div></div>
      </div>
      <div style="text-align:center;font-size:32px;color:#9ca3af">≈</div>
      <div class="card" style="display:flex;align-items:center;gap:20px;border-left:5px solid #0d7a72">
        <div style="font-size:48px">🗂️</div>
        <div><div style="font-size:24px;font-weight:700;margin-bottom:4px">ER Diagram</div><div class="small" style="color:#6b7280">Plans tables before coding a database</div></div>
      </div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "05 Why ER", html: `<div class="inner" style="padding-top:60px">
  <div class="kicker">Section 01</div>
  <div class="stitle" style="margin-bottom:36px">Why Do We Need Them?</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;flex:1">

    <!-- Card 1: Common Language -->
    <div style="background:white;border-radius:18px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.08);display:flex;flex-direction:column">
      <div style="background:linear-gradient(135deg,#0d7a72,#14b8a6);padding:36px 32px 28px;display:flex;flex-direction:column;align-items:flex-start;gap:16px">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,.15)"/>
          <rect x="12" y="20" width="20" height="15" rx="3" fill="white" opacity=".9"/>
          <rect x="32" y="26" width="20" height="15" rx="3" fill="white" opacity=".9"/>
          <rect x="22" y="34" width="20" height="15" rx="3" fill="white" opacity=".6"/>
          <circle cx="20" cy="46" r="3" fill="white" opacity=".9"/>
          <circle cx="32" cy="46" r="3" fill="white" opacity=".9"/>
          <circle cx="44" cy="46" r="3" fill="white" opacity=".9"/>
        </svg>
        <div style="font-size:26px;font-weight:700;color:white;line-height:1.2">Common Language</div>
      </div>
      <div style="padding:28px 32px;flex:1;display:flex;flex-direction:column;gap:16px">
        <div style="font-size:25px;color:#374151;line-height:1.55">One diagram everyone understands — developers, managers, and clients — no technical jargon needed.</div>
        <div style="margin-top:auto;display:flex;gap:10px;flex-wrap:wrap">
          <span style="background:#e6f4f3;color:#0d7a72;border-radius:100px;padding:4px 14px;font-size:21px;font-weight:600">Developers</span>
          <span style="background:#e6f4f3;color:#0d7a72;border-radius:100px;padding:4px 14px;font-size:21px;font-weight:600">Managers</span>
          <span style="background:#e6f4f3;color:#0d7a72;border-radius:100px;padding:4px 14px;font-size:21px;font-weight:600">Clients</span>
        </div>
      </div>
    </div>

    <!-- Card 2: Catch Errors Early -->
    <div style="background:white;border-radius:18px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.08);display:flex;flex-direction:column">
      <div style="background:linear-gradient(135deg,#c47c1a,#f59e0b);padding:36px 32px 28px;display:flex;flex-direction:column;align-items:flex-start;gap:16px">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,.15)"/>
          <!-- paper/diagram -->  
          <rect x="14" y="12" width="28" height="36" rx="3" fill="white" opacity=".9"/>
          <line x1="19" y1="20" x2="36" y2="20" stroke="rgba(196,124,26,.6)" stroke-width="2"/>
          <line x1="19" y1="26" x2="36" y2="26" stroke="rgba(196,124,26,.6)" stroke-width="2"/>
          <line x1="19" y1="32" x2="30" y2="32" stroke="rgba(196,124,26,.6)" stroke-width="2"/>
          <!-- magnify -->  
          <circle cx="42" cy="42" r="10" stroke="white" stroke-width="2.5" fill="none"/>
          <line x1="49" y1="49" x2="55" y2="55" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <text x="38" y="47" font-size="10" fill="white" font-weight="700">!</text>
        </svg>
        <div style="font-size:26px;font-weight:700;color:white;line-height:1.2">Catch Errors Early</div>
      </div>
      <div style="padding:28px 32px;flex:1;display:flex;flex-direction:column;gap:16px">
        <div style="font-size:25px;color:#374151;line-height:1.55">Fixing a design mistake on paper takes minutes. Fixing the same mistake in a live database can take days.</div>
        <div style="margin-top:auto;display:flex;align-items:center;gap:16px;background:#fdf4e3;border-radius:10px;padding:14px 18px">
          <div style="text-align:center">
            <div style="font-size:26px;font-weight:700;color:#c47c1a">Paper</div>
            <div style="font-size:22px;color:#6b7280">minutes</div>
          </div>
          <div style="font-size:28px;color:#9ca3af;font-weight:300">vs</div>
          <div style="text-align:center">
            <div style="font-size:26px;font-weight:700;color:#991b1b">Live DB</div>
            <div style="font-size:22px;color:#6b7280">days</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 3: Road Map to Tables -->
    <div style="background:white;border-radius:18px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.08);display:flex;flex-direction:column">
      <div style="background:linear-gradient(135deg,#5b21b6,#7c3aed);padding:36px 32px 28px;display:flex;flex-direction:column;align-items:flex-start;gap:16px">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,.15)"/>
          <!-- ER box --> 
          <rect x="8" y="20" width="18" height="12" rx="2" fill="white" opacity=".9"/>
          <!-- arrow -->
          <line x1="26" y1="26" x2="36" y2="26" stroke="white" stroke-width="2" opacity=".8"/>
          <polygon points="36,22 42,26 36,30" fill="white" opacity=".8"/>
          <!-- DB table -->
          <rect x="42" y="14" width="16" height="24" rx="2" fill="white" opacity=".9"/>
          <line x1="42" y1="20" x2="58" y2="20" stroke="rgba(91,33,182,.4)" stroke-width="1.5"/>
          <line x1="42" y1="26" x2="58" y2="26" stroke="rgba(91,33,182,.4)" stroke-width="1.5"/>
          <line x1="42" y1="32" x2="58" y2="32" stroke="rgba(91,33,182,.4)" stroke-width="1.5"/>
          <!-- labels -->
          <text x="12" y="46" font-size="8" fill="white" opacity=".8">Entity</text>
          <text x="42" y="46" font-size="8" fill="white" opacity=".8">Table</text>
        </svg>
        <div style="font-size:26px;font-weight:700;color:white;line-height:1.2">Road Map to Tables</div>
      </div>
      <div style="padding:28px 32px;flex:1;display:flex;flex-direction:column;gap:14px">
        <div style="font-size:25px;color:#374151;line-height:1.55">Each shape maps directly to a database structure — no guesswork when building.</div>
        <div style="margin-top:auto;display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;gap:10px;font-size:22px">
            <span style="background:#ede9fe;color:#5b21b6;border-radius:6px;padding:3px 10px;font-weight:600">Entity</span>
            <span style="color:#9ca3af">→</span>
            <span style="color:#374151;font-weight:600">Table</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:22px">
            <span style="background:#ede9fe;color:#5b21b6;border-radius:6px;padding:3px 10px;font-weight:600">Attribute</span>
            <span style="color:#9ca3af">→</span>
            <span style="color:#374151;font-weight:600">Column</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:22px">
            <span style="background:#ede9fe;color:#5b21b6;border-radius:6px;padding:3px 10px;font-weight:600">Key Attr</span>
            <span style="color:#9ca3af">→</span>
            <span style="color:#374151;font-weight:600">Primary Key</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "navy2", label: "06 Sec Notations", html: `<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">02</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">Two Popular Notations</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:640px;line-height:1.6">Same concept — different visual style</p>
</div>
<div class="sec-num">02</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "07 Notations Compare", html: `<div class="inner">
  <div class="kicker">Section 02</div>
  <div class="stitle" style="margin-bottom:40px">Chen's vs. Crow's Foot Notation</div>
  <div class="two" style="gap:44px;align-items:stretch">
    <!-- CHEN -->
    <div class="card" style="border-top:6px solid #0d7a72;display:flex;flex-direction:column;align-items:center;gap:16px">
      <div style="font-size:28px;font-weight:700;color:#0d7a72">Chen's Notation (1976)</div>
      <p class="small" style="text-align:center;color:#374151">Uses <strong>geometric shapes</strong> — rectangles, diamonds &amp; ellipses</p>
      <svg width="340" height="150" viewBox="0 0 340 150">
        <rect x="10" y="55" width="110" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="65" y="84" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <line x1="120" y1="79" x2="144" y2="79" stroke="#374151" stroke-width="2"/>
        <polygon points="178,54 222,79 178,104 134,79" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="178" y="84" font-size="13" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text>
        <line x1="222" y1="79" x2="244" y2="79" stroke="#374151" stroke-width="2"/>
        <rect x="244" y="55" width="88" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="288" y="84" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <ellipse cx="65" cy="22" rx="40" ry="18" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="65" y="27" font-size="13" fill="#064e3b" text-anchor="middle">Name</text>
        <line x1="65" y1="40" x2="65" y2="55" stroke="#374151" stroke-width="1.5"/>
        <text x="126" y="70" font-size="17" font-weight="700" fill="#1d4ed8">M</text>
        <text x="226" y="70" font-size="17" font-weight="700" fill="#1d4ed8">N</text>
      </svg>
      <div class="small" style="text-align:center;color:#374151">Classic academic notation · Easy to learn</div>
      <div style="display:inline-block;background:#0d7a72;color:white;border-radius:100px;padding:6px 20px;font-size:19px;font-weight:600">✅ Used in MBI802</div>
    </div>
    <!-- CROW'S FOOT -->
    <div class="card" style="border-top:6px solid #6b7280;display:flex;flex-direction:column;align-items:center;gap:16px">
      <div style="font-size:28px;font-weight:700;color:#374151">Crow's Foot Notation</div>
      <p class="small" style="text-align:center;color:#374151">Uses <strong>line-end symbols</strong> on connecting lines to show cardinality</p>
      <svg width="340" height="150" viewBox="0 0 340 150">
        <rect x="10" y="45" width="120" height="72" rx="0" fill="white" stroke="#374151" stroke-width="2.5"/>
        <rect x="10" y="45" width="120" height="26" fill="#374151"/>
        <text x="70" y="64" font-size="14" font-weight="700" fill="white" text-anchor="middle">STUDENT</text>
        <text x="70" y="94" font-size="12" fill="#374151" text-anchor="middle">StudentID (PK)</text>
        <text x="70" y="110" font-size="12" fill="#374151" text-anchor="middle">Name</text>
        <rect x="210" y="45" width="120" height="72" rx="0" fill="white" stroke="#374151" stroke-width="2.5"/>
        <rect x="210" y="45" width="120" height="26" fill="#374151"/>
        <text x="270" y="64" font-size="14" font-weight="700" fill="white" text-anchor="middle">COURSE</text>
        <text x="270" y="94" font-size="12" fill="#374151" text-anchor="middle">CourseID (PK)</text>
        <text x="270" y="110" font-size="12" fill="#374151" text-anchor="middle">Title</text>
        <line x1="130" y1="81" x2="210" y2="81" stroke="#374151" stroke-width="2.5"/>
        <line x1="136" y1="74" x2="136" y2="88" stroke="#374151" stroke-width="2.5"/>
        <line x1="143" y1="74" x2="143" y2="88" stroke="#374151" stroke-width="2.5"/>
        <line x1="204" y1="81" x2="192" y2="71" stroke="#374151" stroke-width="2"/>
        <line x1="204" y1="81" x2="192" y2="81" stroke="#374151" stroke-width="2"/>
        <line x1="204" y1="81" x2="192" y2="91" stroke="#374151" stroke-width="2"/>
        <line x1="197" y1="74" x2="197" y2="88" stroke="#374151" stroke-width="2"/>
      </svg>
      <div class="small" style="text-align:center;color:#374151">Common in industry tools (Lucidchart, Visio, draw.io)</div>
      <div style="display:inline-block;background:#6b7280;color:white;border-radius:100px;padding:6px 20px;font-size:19px;font-weight:600">📌 For reference only</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "navy2", label: "08 Sec Chen Shapes", html: `<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">03</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">Chen's Notation — The Shapes</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:660px;line-height:1.6">Four shapes. Each shape has one specific job.</p>
</div>
<div class="sec-num">03</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "09 Entity Shape", html: `<div class="inner">
  <div class="kicker">Chen's Shapes · 1 of 4</div>
  <div class="stitle" style="margin-bottom:36px">Entity — The Rectangle</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean">
        <li>A real-world <strong>"thing"</strong> we want to track</li>
        <li>Always a <strong>noun</strong>: Student, Course, Teacher, Product…</li>
        <li>Each entity will become a <strong>table</strong> in the database</li>
        <li>Written in <strong>UPPERCASE</strong> inside the rectangle</li>
      </ul>
      <div class="card-t" style="margin-top:24px">
        <div class="small"><strong>Test:</strong> Can you list many of them? (Many students, many courses?) → It's an entity.</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:24px">
      <svg width="300" height="100" viewBox="0 0 300 100">
        <rect x="10" y="10" width="280" height="80" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/>
        <text x="150" y="60" font-size="28" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
      </svg>
      <div class="cap">An entity named STUDENT</div>
      <div style="display:flex;gap:18px">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <svg width="130" height="64" viewBox="0 0 130 64"><rect x="4" y="4" width="122" height="56" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/><text x="65" y="37" font-size="18" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text></svg>
          <div class="cap">COURSE</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <svg width="130" height="64" viewBox="0 0 130 64"><rect x="4" y="4" width="122" height="56" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/><text x="65" y="37" font-size="18" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text></svg>
          <div class="cap">TEACHER</div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "10 Attribute Shape", html: `<div class="inner">
  <div class="kicker">Chen's Shapes · 2 of 4</div>
  <div class="stitle" style="margin-bottom:32px">Attribute — The Ellipse</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean">
        <li>A <strong>property</strong> of an entity</li>
        <li>Connected to their entity by a line</li>
        <li>STUDENT attributes: <em>Name, Email, BirthDate…</em></li>
        <li>Will become a <strong>column</strong> in the database table</li>
      </ul>
      <div class="card-t" style="margin-top:24px">
        <div class="small"><strong>Rule:</strong> Does it describe a property of an entity? → it's an attribute</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center">
      <svg width="360" height="300" viewBox="0 0 360 300">
        <rect x="110" y="130" width="140" height="54" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="180" y="163" font-size="18" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <ellipse cx="60" cy="52" rx="50" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="60" y="57" font-size="13" fill="#064e3b" text-anchor="middle">StudentID</text>
        <line x1="97" y1="66" x2="128" y2="130" stroke="#374151" stroke-width="1.5"/>
        <ellipse cx="180" cy="46" rx="40" ry="20" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="180" y="51" font-size="13" fill="#064e3b" text-anchor="middle">Name</text>
        <line x1="180" y1="66" x2="180" y2="130" stroke="#374151" stroke-width="1.5"/>
        <ellipse cx="300" cy="52" rx="48" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="300" y="57" font-size="13" fill="#064e3b" text-anchor="middle">Email</text>
        <line x1="264" y1="66" x2="232" y2="130" stroke="#374151" stroke-width="1.5"/>
        <ellipse cx="180" cy="262" rx="52" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="180" y="267" font-size="13" fill="#064e3b" text-anchor="middle">BirthDate</text>
        <line x1="180" y1="240" x2="180" y2="184" stroke="#374151" stroke-width="1.5"/>
      </svg>
      <div class="cap">STUDENT entity with 4 attributes</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "11 Key Attribute", html: `<div class="inner">
  <div class="kicker">Chen's Shapes · 2b — Special Attribute</div>
  <div class="stitle" style="margin-bottom:32px">Key Attribute — Underlined Ellipse</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean">
        <li>A <strong>unique identifier</strong> — no two rows can share the same value</li>
        <li>Drawn as an ellipse with the attribute name <strong>underlined</strong></li>
        <li>Becomes the <strong>Primary Key</strong> of the table</li>
        <li>Every entity must have one</li>
      </ul>
      <div class="card-a" style="margin-top:24px">
        <div class="small">🔑 Two students may share a name — but each must have a unique <strong>StudentID</strong>. Therefore StudentID is the key attribute.</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:28px">
      <div style="display:flex;gap:44px;align-items:center">
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <svg width="130" height="54" viewBox="0 0 130 54"><ellipse cx="65" cy="27" rx="58" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/><text x="65" y="32" font-size="15" fill="#064e3b" text-anchor="middle">Name</text></svg>
          <div class="cap">Regular attribute</div>
        </div>
        <div style="font-size:38px;color:#9ca3af">vs</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <svg width="140" height="54" viewBox="0 0 140 54"><ellipse cx="70" cy="27" rx="62" ry="22" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/><text x="70" y="30" font-size="14" font-weight="700" fill="#3b0764" text-anchor="middle">StudentID</text><line x1="28" y1="35" x2="112" y2="35" stroke="#3b0764" stroke-width="1.8"/></svg>
          <div class="cap">Key attribute (underlined)</div>
        </div>
      </div>
      <svg width="300" height="190" viewBox="0 0 300 190">
        <rect x="85" y="100" width="130" height="50" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="150" y="131" font-size="17" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <ellipse cx="68" cy="42" rx="56" ry="22" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>
        <text x="68" y="46" font-size="13" font-weight="700" fill="#3b0764" text-anchor="middle">StudentID</text>
        <line x1="22" y1="51" x2="114" y2="51" stroke="#3b0764" stroke-width="1.5"/>
        <line x1="80" y1="64" x2="112" y2="100" stroke="#374151" stroke-width="1.5"/>
        <ellipse cx="232" cy="42" rx="50" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
        <text x="232" y="47" font-size="13" fill="#064e3b" text-anchor="middle">Name</text>
        <line x1="200" y1="62" x2="188" y2="100" stroke="#374151" stroke-width="1.5"/>
      </svg>
      <div class="cap">StudentID is the key; Name is a regular attribute</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "12 Relationship Shape", html: `<div class="inner">
  <div class="kicker">Chen's Shapes · 3 of 4</div>
  <div class="stitle" style="margin-bottom:32px">Relationship — The Diamond</div>
  <div class="two" style="align-items:center">
    <div>
      <ul class="clean">
        <li>Describes <strong>how two entities connect</strong></li>
        <li>Written as a <strong>verb</strong> inside the diamond</li>
        <li>Lines connect the diamond to both entities</li>
        <li>Examples: <em>enrolls, teaches, manages, owns</em></li>
      </ul>
      <div class="card-t" style="margin-top:24px">
        <div class="small"><strong>Memory tip:</strong> Entity = noun · Relationship = verb<br>"STUDENT <em>enrolls</em> COURSE" → diamond says <em>enrolls</em></div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:24px">
      <svg width="380" height="120" viewBox="0 0 380 120">
        <rect x="8" y="36" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="62" y="65" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <line x1="116" y1="60" x2="138" y2="60" stroke="#374151" stroke-width="2"/>
        <polygon points="175,36 218,60 175,84 132,60" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="175" y="65" font-size="13" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text>
        <line x1="218" y1="60" x2="240" y2="60" stroke="#374151" stroke-width="2"/>
        <rect x="240" y="36" width="100" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="290" y="65" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
      </svg>
      <div class="cap">STUDENT enrolls COURSE</div>
      <svg width="380" height="100" viewBox="0 0 380 100">
        <rect x="8" y="26" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="62" y="55" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text>
        <line x1="116" y1="50" x2="138" y2="50" stroke="#374151" stroke-width="2"/>
        <polygon points="175,26 218,50 175,74 132,50" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="175" y="55" font-size="13" font-weight="600" fill="#92400e" text-anchor="middle">teaches</text>
        <line x1="218" y1="50" x2="240" y2="50" stroke="#374151" stroke-width="2"/>
        <rect x="240" y="26" width="100" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="290" y="55" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
      </svg>
      <div class="cap">TEACHER teaches COURSE</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "13 Shapes Summary", html: `<div class="inner">
  <div class="kicker">Chen's Shapes — Summary</div>
  <div class="stitle" style="margin-bottom:40px">Four Shapes, Four Jobs</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #1e40af">
      <svg width="96" height="56" viewBox="0 0 96 56"><rect x="3" y="4" width="90" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/><text x="48" y="33" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">ENTITY</text></svg>
      <div><div style="font-size:26px;font-weight:700;margin-bottom:4px">Rectangle</div><div class="small" style="color:#374151">A real-world thing → becomes a <strong>table</strong></div></div>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #065f46">
      <svg width="96" height="56" viewBox="0 0 96 56"><ellipse cx="48" cy="28" rx="43" ry="22" fill="#d1fae5" stroke="#065f46" stroke-width="2.5"/><text x="48" y="33" font-size="13" fill="#064e3b" text-anchor="middle">attribute</text></svg>
      <div><div style="font-size:26px;font-weight:700;margin-bottom:4px">Ellipse</div><div class="small" style="color:#374151">A property → becomes a <strong>column</strong></div></div>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #5b21b6">
      <svg width="96" height="56" viewBox="0 0 96 56"><ellipse cx="48" cy="28" rx="43" ry="22" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/><text x="48" y="31" font-size="12" font-weight="700" fill="#3b0764" text-anchor="middle">keyAttr</text><line x1="14" y1="36" x2="82" y2="36" stroke="#3b0764" stroke-width="1.5"/></svg>
      <div><div style="font-size:26px;font-weight:700;margin-bottom:4px">Underlined Ellipse</div><div class="small" style="color:#374151">Unique identifier → <strong>Primary Key</strong></div></div>
    </div>
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #d97706">
      <svg width="96" height="56" viewBox="0 0 96 56"><polygon points="48,4 90,28 48,52 6,28" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/><text x="48" y="32" font-size="11" font-weight="600" fill="#92400e" text-anchor="middle">relation</text></svg>
      <div><div style="font-size:26px;font-weight:700;margin-bottom:4px">Diamond</div><div class="small" style="color:#374151">A verb linking two entities → <strong>relationship</strong></div></div>
    </div>
  </div>
  <div class="card-t" style="margin-top:24px">
    <div class="small">Lines connect everything — attributes to entities, entities to diamonds. <strong>No floating shapes.</strong></div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "navy2", label: "14 Sec Cardinality", html: `<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">04</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">Cardinality</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:660px;line-height:1.6">The numbers on relationship lines — how many can relate to how many?</p>
</div>
<div class="sec-num">04</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "15 Cardinality 1-1", html: `<div class="inner">
  <div class="kicker">Cardinality · One-to-One</div>
  <div class="stitle" style="margin-bottom:32px">1 : 1 — Each side has exactly one match</div>
  <div class="two" style="align-items:center">
    <div>
      <div class="body" style="margin-bottom:22px">Each instance on side A relates to <strong>exactly one</strong> on side B, and vice versa.</div>
      <div class="card-t" style="margin-bottom:16px"><div class="small">🧑‍💼 One <strong>Employee</strong> holds one <strong>Passport</strong><br>One <strong>Passport</strong> belongs to one <strong>Employee</strong></div></div>
      <div class="card-a"><div class="small">🏫 One <strong>Principal</strong> leads one <strong>School</strong></div></div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:20px">
      <svg width="380" height="110" viewBox="0 0 380 110">
        <rect x="8" y="32" width="114" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="65" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">EMPLOYEE</text>
        <line x1="122" y1="56" x2="144" y2="56" stroke="#374151" stroke-width="2.5"/>
        <polygon points="178,33 220,56 178,79 136,56" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="178" y="61" font-size="12" font-weight="600" fill="#92400e" text-anchor="middle">holds</text>
        <line x1="220" y1="56" x2="244" y2="56" stroke="#374151" stroke-width="2.5"/>
        <rect x="244" y="32" width="126" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="307" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">PASSPORT</text>
        <text x="128" y="46" font-size="20" font-weight="700" fill="#1d4ed8">1</text>
        <text x="224" y="46" font-size="20" font-weight="700" fill="#1d4ed8">1</text>
      </svg>
      <div class="cap">The "1" and "1" labels mean one-to-one</div>
      <!-- mapping diagram -->
      <svg width="320" height="130" viewBox="0 0 320 130">
        <text x="80" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">EMPLOYEE</text>
        <text x="240" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">PASSPORT</text>
        <rect x="20" y="24" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="43" font-size="13" fill="#1e3a8a" text-anchor="middle">Alice</text>
        <rect x="20" y="60" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="79" font-size="13" fill="#1e3a8a" text-anchor="middle">Bob</text>
        <rect x="20" y="96" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="115" font-size="13" fill="#1e3a8a" text-anchor="middle">Carol</text>
        <rect x="180" y="24" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="43" font-size="13" fill="#064e3b" text-anchor="middle">P-001</text>
        <rect x="180" y="60" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="79" font-size="13" fill="#064e3b" text-anchor="middle">P-002</text>
        <rect x="180" y="96" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="115" font-size="13" fill="#064e3b" text-anchor="middle">P-003</text>
        <line x1="140" y1="38" x2="180" y2="38" stroke="#0d7a72" stroke-width="1.8"/>
        <line x1="140" y1="74" x2="180" y2="74" stroke="#0d7a72" stroke-width="1.8"/>
        <line x1="140" y1="110" x2="180" y2="110" stroke="#0d7a72" stroke-width="1.8"/>
      </svg>
      <div class="cap">Each employee ↔ exactly one passport</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "16 Cardinality 1-N", html: `<div class="inner">
  <div class="kicker">Cardinality · One-to-Many</div>
  <div class="stitle" style="margin-bottom:32px">1 : N — One side, many on the other</div>
  <div class="two" style="align-items:center">
    <div>
      <div class="body" style="margin-bottom:22px">One instance on side A relates to <strong>many</strong> on side B. But each B belongs to <strong>only one</strong> A.</div>
      <div class="card-t" style="margin-bottom:16px"><div class="small">🏫 One <strong>Teacher</strong> teaches many <strong>Courses</strong><br>Each <strong>Course</strong> has only one <strong>Teacher</strong></div></div>
      <div class="card-a"><div class="small">👩‍👧 One <strong>Mother</strong> has many <strong>Children</strong><br>Each <strong>Child</strong> has one <strong>Mother</strong></div></div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:20px">
      <svg width="380" height="110" viewBox="0 0 380 110">
        <rect x="8" y="32" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="62" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text>
        <line x1="116" y1="56" x2="138" y2="56" stroke="#374151" stroke-width="2.5"/>
        <polygon points="175,33 218,56 175,79 132,56" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="175" y="61" font-size="12" font-weight="600" fill="#92400e" text-anchor="middle">teaches</text>
        <line x1="218" y1="56" x2="242" y2="56" stroke="#374151" stroke-width="2.5"/>
        <rect x="242" y="32" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="296" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <text x="122" y="46" font-size="20" font-weight="700" fill="#1d4ed8">1</text>
        <text x="222" y="46" font-size="20" font-weight="700" fill="#1d4ed8">N</text>
      </svg>
      <div class="cap">"1" on teacher side, "N" on course side</div>
      <svg width="320" height="150" viewBox="0 0 320 150">
        <text x="80" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text>
        <text x="240" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <rect x="20" y="24" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="43" font-size="13" fill="#1e3a8a" text-anchor="middle">Dr. Smith</text>
        <rect x="20" y="80" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="99" font-size="13" fill="#1e3a8a" text-anchor="middle">Dr. Lee</text>
        <rect x="180" y="24" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="43" font-size="13" fill="#064e3b" text-anchor="middle">MBI802</text>
        <rect x="180" y="60" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="79" font-size="13" fill="#064e3b" text-anchor="middle">MBI803</text>
        <rect x="180" y="96" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="115" font-size="13" fill="#064e3b" text-anchor="middle">MBI810</text>
        <rect x="180" y="118" width="120" height="28" rx="4" fill="#fef9c3" stroke="#d97706" stroke-width="1.5"/><text x="240" y="137" font-size="13" fill="#92400e" text-anchor="middle">MBI820</text>
        <line x1="140" y1="38" x2="180" y2="38" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="38" x2="180" y2="74" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="38" x2="180" y2="110" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="94" x2="180" y2="132" stroke="#c47c1a" stroke-width="1.5"/>
      </svg>
      <div class="cap">Dr. Smith → 3 courses; Dr. Lee → 1 course</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "17 Cardinality M-N", html: `<div class="inner">
  <div class="kicker">Cardinality · Many-to-Many</div>
  <div class="stitle" style="margin-bottom:32px">M : N — Many on both sides</div>
  <div class="two" style="align-items:center">
    <div>
      <div class="body" style="margin-bottom:22px">Many instances on side A relate to many instances on side B, and vice versa.</div>
      <div class="card-t" style="margin-bottom:16px"><div class="small">📚 One <strong>Student</strong> enrolls in many <strong>Courses</strong><br>One <strong>Course</strong> has many <strong>Students</strong></div></div>
      <div class="card-a"><div class="small">🎬 One <strong>Actor</strong> appears in many <strong>Movies</strong><br>One <strong>Movie</strong> has many <strong>Actors</strong></div></div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:20px">
      <svg width="380" height="110" viewBox="0 0 380 110">
        <rect x="8" y="32" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="62" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <line x1="116" y1="56" x2="138" y2="56" stroke="#374151" stroke-width="2.5"/>
        <polygon points="175,33 218,56 175,79 132,56" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
        <text x="175" y="61" font-size="12" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text>
        <line x1="218" y1="56" x2="242" y2="56" stroke="#374151" stroke-width="2.5"/>
        <rect x="242" y="32" width="108" height="48" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5"/>
        <text x="296" y="61" font-size="16" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <text x="122" y="46" font-size="20" font-weight="700" fill="#1d4ed8">M</text>
        <text x="222" y="46" font-size="20" font-weight="700" fill="#1d4ed8">N</text>
      </svg>
      <div class="cap">"M" and "N" both mean "many"</div>
      <svg width="320" height="150" viewBox="0 0 320 150">
        <text x="80" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>
        <text x="240" y="18" font-size="13" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>
        <rect x="20" y="24" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="43" font-size="13" fill="#1e3a8a" text-anchor="middle">Alice</text>
        <rect x="20" y="60" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="79" font-size="13" fill="#1e3a8a" text-anchor="middle">Bob</text>
        <rect x="20" y="96" width="120" height="28" rx="4" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/><text x="80" y="115" font-size="13" fill="#1e3a8a" text-anchor="middle">Carol</text>
        <rect x="180" y="24" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="43" font-size="13" fill="#064e3b" text-anchor="middle">MBI802</text>
        <rect x="180" y="60" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="79" font-size="13" fill="#064e3b" text-anchor="middle">MBI803</text>
        <rect x="180" y="96" width="120" height="28" rx="4" fill="#d1fae5" stroke="#065f46" stroke-width="1.5"/><text x="240" y="115" font-size="13" fill="#064e3b" text-anchor="middle">MBI810</text>
        <!-- many-to-many lines -->
        <line x1="140" y1="38" x2="180" y2="38" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="38" x2="180" y2="74" stroke="#0d7a72" stroke-width="1.5"/>
        <line x1="140" y1="74" x2="180" y2="38" stroke="#c47c1a" stroke-width="1.5"/>
        <line x1="140" y1="74" x2="180" y2="110" stroke="#c47c1a" stroke-width="1.5"/>
        <line x1="140" y1="110" x2="180" y2="74" stroke="#7c3aed" stroke-width="1.5"/>
        <line x1="140" y1="110" x2="180" y2="110" stroke="#7c3aed" stroke-width="1.5"/>
      </svg>
      <div class="cap">Students and courses are connected in many directions</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "18 Cardinality Summary", html: `<div class="inner">
  <div class="kicker">Cardinality — Summary</div>
  <div class="stitle" style="margin-bottom:36px">Three Types at a Glance</div>
  <div style="display:flex;flex-direction:column;gap:20px">
    <!-- 1:1 -->
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #0d7a72">
      <div style="min-width:80px;text-align:center;font-size:32px;font-weight:700;color:#0d7a72">1:1</div>
      <svg width="260" height="52" viewBox="0 0 260 52"><rect x="2" y="11" width="80" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="42" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">EMPLOYEE</text><line x1="82" y1="26" x2="98" y2="26" stroke="#374151" stroke-width="2"/><polygon points="118,12 148,26 118,40 88,26" fill="#fef9c3" stroke="#d97706" stroke-width="2"/><text x="118" y="30" font-size="10" font-weight="600" fill="#92400e" text-anchor="middle">holds</text><line x1="148" y1="26" x2="162" y2="26" stroke="#374151" stroke-width="2"/><rect x="162" y="11" width="88" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="206" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">PASSPORT</text><text x="86" y="10" font-size="14" font-weight="700" fill="#1d4ed8">1</text><text x="150" y="10" font-size="14" font-weight="700" fill="#1d4ed8">1</text></svg>
      <div class="small" style="color:#374151">Each instance matches <strong>exactly one</strong> on the other side</div>
    </div>
    <!-- 1:N -->
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #c47c1a">
      <div style="min-width:80px;text-align:center;font-size:32px;font-weight:700;color:#c47c1a">1:N</div>
      <svg width="260" height="52" viewBox="0 0 260 52"><rect x="2" y="11" width="80" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="42" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text><line x1="82" y1="26" x2="98" y2="26" stroke="#374151" stroke-width="2"/><polygon points="118,12 148,26 118,40 88,26" fill="#fef9c3" stroke="#d97706" stroke-width="2"/><text x="118" y="30" font-size="10" font-weight="600" fill="#92400e" text-anchor="middle">teaches</text><line x1="148" y1="26" x2="162" y2="26" stroke="#374151" stroke-width="2"/><rect x="162" y="11" width="88" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="206" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text><text x="86" y="10" font-size="14" font-weight="700" fill="#1d4ed8">1</text><text x="150" y="10" font-size="14" font-weight="700" fill="#1d4ed8">N</text></svg>
      <div class="small" style="color:#374151">One on side A → <strong>many</strong> on side B; each B has only one A</div>
    </div>
    <!-- M:N -->
    <div class="card" style="display:flex;align-items:center;gap:24px;border-left:5px solid #7c3aed">
      <div style="min-width:80px;text-align:center;font-size:32px;font-weight:700;color:#7c3aed">M:N</div>
      <svg width="260" height="52" viewBox="0 0 260 52"><rect x="2" y="11" width="80" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="42" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text><line x1="82" y1="26" x2="98" y2="26" stroke="#374151" stroke-width="2"/><polygon points="118,12 148,26 118,40 88,26" fill="#fef9c3" stroke="#d97706" stroke-width="2"/><text x="118" y="30" font-size="10" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text><line x1="148" y1="26" x2="162" y2="26" stroke="#374151" stroke-width="2"/><rect x="162" y="11" width="88" height="30" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/><text x="206" y="31" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text><text x="86" y="10" font-size="14" font-weight="700" fill="#1d4ed8">M</text><text x="150" y="10" font-size="14" font-weight="700" fill="#1d4ed8">N</text></svg>
      <div class="small" style="color:#374151">Many on side A ↔ <strong>many</strong> on side B simultaneously</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "navy2", label: "19 Sec Full ER", html: `<div class="inner" style="justify-content:center">
  <div style="font-size:130px;font-weight:700;color:rgba(255,255,255,.05);line-height:1;margin-bottom:-10px">05</div>
  <div class="bar bar-amber" style="margin-bottom:24px"></div>
  <div class="stitle" style="color:white">Drawing a Complete ER Diagram</div>
  <p style="font-size:28px;color:rgba(255,255,255,.5);margin-top:18px;max-width:660px;line-height:1.6">Let's put it all together — step by step</p>
</div>
<div class="sec-num">05</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "20 How To Draw Steps", html: `<div class="inner">
  <div class="kicker">Section 05</div>
  <div class="stitle" style="margin-bottom:36px">How to Draw an ER Diagram</div>
  <div class="two" style="align-items:center">
    <div>
      <div class="step"><div class="snum">1</div><div class="sbody"><strong>Identify the entities</strong> — what real-world things do we store data about? (nouns)</div></div>
      <div class="step"><div class="snum">2</div><div class="sbody"><strong>List attributes</strong> for each entity — what properties does it have?</div></div>
      <div class="step"><div class="snum">3</div><div class="sbody"><strong>Mark the key attribute</strong> — which attribute uniquely identifies each instance?</div></div>
      <div class="step"><div class="snum">4</div><div class="sbody"><strong>Identify relationships</strong> — how do entities connect? (verbs)</div></div>
      <div class="step"><div class="snum">5</div><div class="sbody"><strong>Add cardinality</strong> — 1:1, 1:N, or M:N on each relationship line</div></div>
    </div>
    <div class="card-t">
      <div class="small" style="margin-bottom:16px"><strong>Scenario:</strong> A university has <em>students</em> and <em>courses</em>. Students can enroll in many courses. Each course is taught by one teacher. Teachers can teach many courses.</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div class="small">📦 <strong>Entities:</strong> STUDENT, COURSE, TEACHER</div>
        <div class="small">🔗 <strong>Relationships:</strong> enrolls (M:N), teaches (1:N)</div>
      </div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "21 Full ER Diagram", html: `<div class="inner">
  <div class="kicker">Section 05 — Complete Example</div>
  <div class="stitle" style="margin-bottom:28px">University Enrollment — Full ER Diagram</div>
  <div style="display:flex;justify-content:center">
    <svg width="1500" height="560" viewBox="0 0 1500 560" style="max-width:100%;height:auto">

      <!-- ══ TEACHER entity ══ -->
      <rect x="60" y="230" width="160" height="60" rx="5" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/>
      <text x="140" y="266" font-size="20" font-weight="700" fill="#1e3a8a" text-anchor="middle">TEACHER</text>

      <!-- TEACHER attrs -->
      <!-- TeacherID (key) -->
      <ellipse cx="80" cy="110" rx="68" ry="28" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>
      <text x="80" y="114" font-size="15" font-weight="700" fill="#3b0764" text-anchor="middle">TeacherID</text>
      <line x1="80" y1="126" x2="80" y2="138" stroke="#3b0764" stroke-width="1.8"/>
      <line x1="26" y1="120" x2="134" y2="120" stroke="#3b0764" stroke-width="1.5"/>
      <line x1="80" y1="138" x2="105" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- TName -->
      <ellipse cx="210" cy="110" rx="52" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="210" y="115" font-size="15" fill="#064e3b" text-anchor="middle">T_Name</text>
      <line x1="210" y1="136" x2="185" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Department -->
      <ellipse cx="310" cy="146" rx="68" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="310" y="151" font-size="15" fill="#064e3b" text-anchor="middle">Department</text>
      <line x1="272" y1="158" x2="220" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- teaches relationship -->
      <line x1="220" y1="260" x2="290" y2="260" stroke="#374151" stroke-width="2.5"/>
      <polygon points="340,234 388,260 340,286 292,260" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
      <text x="340" y="265" font-size="15" font-weight="600" fill="#92400e" text-anchor="middle">teaches</text>
      <line x1="388" y1="260" x2="430" y2="260" stroke="#374151" stroke-width="2.5"/>
      <!-- cardinality -->
      <text x="228" y="252" font-size="22" font-weight="700" fill="#1d4ed8">1</text>
      <text x="392" y="252" font-size="22" font-weight="700" fill="#1d4ed8">N</text>

      <!-- ══ COURSE entity ══ -->
      <rect x="430" y="230" width="160" height="60" rx="5" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/>
      <text x="510" y="266" font-size="20" font-weight="700" fill="#1e3a8a" text-anchor="middle">COURSE</text>

      <!-- COURSE attrs -->
      <!-- CourseID (key) -->
      <ellipse cx="438" cy="110" rx="66" ry="28" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>
      <text x="438" y="114" font-size="15" font-weight="700" fill="#3b0764" text-anchor="middle">CourseID</text>
      <line x1="372" y1="120" x2="504" y2="120" stroke="#3b0764" stroke-width="1.5"/>
      <line x1="438" y1="138" x2="460" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Title -->
      <ellipse cx="548" cy="100" rx="46" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="548" y="105" font-size="15" fill="#064e3b" text-anchor="middle">Title</text>
      <line x1="548" y1="126" x2="530" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Credits -->
      <ellipse cx="644" cy="116" rx="50" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="644" y="121" font-size="15" fill="#064e3b" text-anchor="middle">Credits</text>
      <line x1="614" y1="136" x2="590" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- enrolls relationship -->
      <line x1="590" y1="260" x2="680" y2="260" stroke="#374151" stroke-width="2.5"/>
      <polygon points="740,234 788,260 740,286 692,260" fill="#fef9c3" stroke="#d97706" stroke-width="2.5"/>
      <text x="740" y="265" font-size="15" font-weight="600" fill="#92400e" text-anchor="middle">enrolls</text>
      <line x1="788" y1="260" x2="840" y2="260" stroke="#374151" stroke-width="2.5"/>
      <!-- cardinality -->
      <text x="600" y="252" font-size="22" font-weight="700" fill="#1d4ed8">M</text>
      <text x="792" y="252" font-size="22" font-weight="700" fill="#1d4ed8">N</text>

      <!-- ══ STUDENT entity ══ -->
      <rect x="840" y="230" width="160" height="60" rx="5" fill="#dbeafe" stroke="#1e40af" stroke-width="3"/>
      <text x="920" y="266" font-size="20" font-weight="700" fill="#1e3a8a" text-anchor="middle">STUDENT</text>

      <!-- STUDENT attrs -->
      <!-- StudentID (key) -->
      <ellipse cx="860" cy="110" rx="66" ry="28" fill="#ede9fe" stroke="#5b21b6" stroke-width="2.5"/>
      <text x="860" y="114" font-size="15" font-weight="700" fill="#3b0764" text-anchor="middle">StudentID</text>
      <line x1="794" y1="120" x2="926" y2="120" stroke="#3b0764" stroke-width="1.5"/>
      <line x1="860" y1="138" x2="880" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Sname -->
      <ellipse cx="970" cy="106" rx="46" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="970" y="111" font-size="15" fill="#064e3b" text-anchor="middle">S_Name</text>
      <line x1="970" y1="132" x2="950" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Email -->
      <ellipse cx="1060" cy="110" rx="44" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="1060" y="115" font-size="15" fill="#064e3b" text-anchor="middle">Email</text>
      <line x1="1030" y1="128" x2="1000" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- Major -->
      <ellipse cx="1140" cy="128" rx="46" ry="26" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="1140" y="133" font-size="15" fill="#064e3b" text-anchor="middle">Major</text>
      <line x1="1118" y1="144" x2="1000" y2="230" stroke="#374151" stroke-width="1.5"/>

      <!-- ══ LEGEND ══ -->
      <rect x="1200" y="200" width="270" height="200" rx="10" fill="white" stroke="#e5e7eb" stroke-width="1.5"/>
      <text x="1335" y="226" font-size="16" font-weight="700" fill="#1a2744" text-anchor="middle">LEGEND</text>
      <line x1="1210" y1="234" x2="1462" y2="234" stroke="#e5e7eb" stroke-width="1"/>

      <rect x="1218" y="244" width="40" height="22" rx="3" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
      <text x="1268" y="260" font-size="14" fill="#374151">Entity</text>

      <ellipse cx="1238" cy="284" rx="20" ry="12" fill="#d1fae5" stroke="#065f46" stroke-width="2"/>
      <text x="1268" y="289" font-size="14" fill="#374151">Attribute</text>

      <ellipse cx="1238" cy="316" rx="20" ry="12" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/>
      <text x="1230" y="319" font-size="10" font-weight="700" fill="#3b0764" text-anchor="middle">key</text>
      <line x1="1218" y1="322" x2="1258" y2="322" stroke="#3b0764" stroke-width="1.3"/>
      <text x="1268" y="321" font-size="14" fill="#374151">Key Attribute</text>

      <polygon points="1238,336 1258,348 1238,360 1218,348" fill="#fef9c3" stroke="#d97706" stroke-width="2"/>
      <text x="1268" y="353" font-size="14" fill="#374151">Relationship</text>

      <text x="1218" y="388" font-size="14" fill="#374151">1 / N / M = Cardinality</text>
    </svg>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "", label: "22 Reading the Diagram", html: `<div class="inner">
  <div class="kicker">Section 05</div>
  <div class="stitle" style="margin-bottom:32px">How to Read the Diagram</div>
  <div class="two" style="align-items:start">
    <div>
      <div class="body" style="margin-bottom:24px">Reading the university ER diagram:</div>
      <div class="step"><div class="snum" style="background:#0d7a72">→</div><div class="sbody">One <strong>TEACHER</strong> teaches many <strong>COURSES</strong> (1:N)</div></div>
      <div class="step"><div class="snum" style="background:#0d7a72">→</div><div class="sbody">One <strong>COURSE</strong> is taught by one <strong>TEACHER</strong> (back-link of 1:N)</div></div>
      <div class="step"><div class="snum" style="background:#c47c1a">→</div><div class="sbody">A <strong>STUDENT</strong> can enroll in many <strong>COURSES</strong> (M:N)</div></div>
      <div class="step"><div class="snum" style="background:#c47c1a">→</div><div class="sbody">A <strong>COURSE</strong> can have many <strong>STUDENTS</strong> enrolled (M:N)</div></div>
    </div>
    <div>
      <div class="card-t" style="margin-bottom:20px">
        <div style="font-size:24px;font-weight:700;margin-bottom:10px">What becomes what in the DB?</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px">
          <div class="small">STUDENT entity</div><div class="small">→ <strong>STUDENT table</strong></div>
          <div class="small">COURSE entity</div><div class="small">→ <strong>COURSE table</strong></div>
          <div class="small">TEACHER entity</div><div class="small">→ <strong>TEACHER table</strong></div>
          <div class="small">StudentID (key)</div><div class="small">→ <strong>Primary Key</strong></div>
          <div class="small">Name, Email…</div><div class="small">→ <strong>Columns</strong></div>
          <div class="small">enrolls (M:N)</div><div class="small">→ <strong>Junction table</strong></div>
        </div>
      </div>
      <div class="card-a">
        <div class="small">💡 Every M:N relationship becomes a separate <em>junction table</em> (e.g., ENROLLMENT) in the relational database. 1:N relationships become a <em>foreign key</em>.</div>
      </div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "dark", label: "23 Key Takeaways", html: `<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.04" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="g2" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0L0 0 0 60" fill="none" stroke="white" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#g2)"/></svg>
<div class="inner">
  <div class="kicker">Summary</div>
  <div class="stitle" style="color:white;margin-bottom:40px">Key Takeaways</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div style="background:rgba(255,255,255,.07);border-radius:14px;padding:30px 36px;border-left:5px solid #5eead4">
      <div style="font-size:26px;font-weight:700;color:#5eead4;margin-bottom:10px">ER diagrams are design tools</div>
      <div class="small" style="color:rgba(255,255,255,.75)">Draw before you code — saves enormous time &amp; effort later</div>
    </div>
    <div style="background:rgba(255,255,255,.07);border-radius:14px;padding:30px 36px;border-left:5px solid #fbbf24">
      <div style="font-size:26px;font-weight:700;color:#fbbf24;margin-bottom:10px">Rectangle = Entity → Table</div>
      <div class="small" style="color:rgba(255,255,255,.75)">Real-world "things" we track; become database tables</div>
    </div>
    <div style="background:rgba(255,255,255,.07);border-radius:14px;padding:30px 36px;border-left:5px solid #86efac">
      <div style="font-size:26px;font-weight:700;color:#86efac;margin-bottom:10px">Ellipse = Attribute → Column</div>
      <div class="small" style="color:rgba(255,255,255,.75)">Properties of entities; underlined ellipse = primary key</div>
    </div>
    <div style="background:rgba(255,255,255,.07);border-radius:14px;padding:30px 36px;border-left:5px solid #f9a8d4">
      <div style="font-size:26px;font-weight:700;color:#f9a8d4;margin-bottom:10px">Diamond = Relationship → Link</div>
      <div class="small" style="color:rgba(255,255,255,.75)">Verbs connecting entities; labeled with 1:1, 1:N, or M:N</div>
    </div>
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
  { classes: "navy2", label: "24 End", html: `<div class="inner center">
  <div style="font-size:96px;margin-bottom:24px">🎓</div>
  <div style="font-size:64px;font-weight:700;color:white;margin-bottom:20px">Questions?</div>
  <div style="width:80px;height:5px;background:#fbbf24;border-radius:3px;margin:0 auto 28px"></div>
  <div style="font-size:28px;color:rgba(255,255,255,.55);max-width:580px;line-height:1.7">
    MBI802 · Database Management Systems<br>Entity-Relationship Diagrams
  </div>
</div>
<div class="cr">© Yasas Sri Wickramasinghe · All Rights Reserved</div>` },
];

export default function ERDiagramsDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const id = 'er-deck-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = DECK_CSS;
      document.head.appendChild(el);
    }
    return () => { document.getElementById('er-deck-styles')?.remove(); };
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
    if (!document.fullscreenElement) {
      deckRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
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

  return (
    <div
      ref={deckRef}
      style={{
        background: '#0f1117',
        borderRadius: isFullscreen ? 0 : 16,
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1.5px solid rgba(13,122,114,0.3)',
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
            MBI802 · ER Diagrams · {current + 1} / {total} · ← → to navigate
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {!isFullscreen && (
            <button
              onClick={() => setExpanded(v => !v)}
              style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
            >
              {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* 16:9 scaled slide canvas */}
      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          width: '100%',
          ...(isFullscreen
            ? { flex: 1 }
            : { paddingBottom: expanded ? '75%' : '56.25%', transition: 'padding-bottom 0.3s ease' }
          ),
          overflow: 'hidden',
          background: '#111',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div
            className="erd"
            style={{
              width: 1920,
              height: 1080,
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: 'top left',
              position: 'relative',
            }}
          >
            <section
              className={slide.classes || undefined}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              dangerouslySetInnerHTML={{ __html: slide.html }}
            />
          </div>
        </div>
      </div>

      {/* nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <button
          onClick={() => setCurrent(c => Math.max(c - 1, 0))}
          disabled={current === 0}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '6px 14px', color: current === 0 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: current === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}
        >
          <ChevronLeft size={14} /> Prev
        </button>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 360 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              title={SLIDES[i].label}
              style={{
                width: i === current ? 20 : 7,
                height: 7,
                borderRadius: 999,
                background: i === current ? '#0d7a72' : 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrent(c => Math.min(c + 1, total - 1))}
          disabled={current === total - 1}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '6px 14px', color: current === total - 1 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: current === total - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
