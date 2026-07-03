// PlatformStrategyDeck.tsx
// MBI800 · Strategic Information Systems
// "Platform Strategy" — pipes vs platforms, network effects, governance, and why some platforms fail

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const DECK_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

.pfs *{box-sizing:border-box;margin:0;padding:0}
.pfs{font-family:'Inter',sans-serif;
  --title:64px;--h2:48px;--body:32px;--small:27px;--tiny:23px;--micro:21px;
  --px:88px;--pt:68px;--pb:52px;--title-gap:30px;--item-gap:18px;
  --navy:#0b1220;--navy2:#111827;
  --blue:#2563eb;--blue2:#1d4ed8;--blue-light:#dbeafe;
  --violet:#7c3aed;--violet-light:#ede9fe;
  --amber:#b45309;--gold:#d97706;--gold-light:#fef3c7;
  --teal:#0d9488;--teal-light:#ccfbf1;
  --rose:#e11d48;--rose-light:#ffe4e6;
  --green:#059669;--green-light:#d1fae5;
  --slate:#475569;--white:#f8fafc;--off-white:#eff6ff
}
.pfs section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:var(--pt) var(--px) var(--pb);background:var(--white);color:#1e293b}
.pfs section.dark{background:var(--navy);color:#f1f5f9}
.pfs section.dark2{background:var(--navy2);color:#f1f5f9}
.pfs section.slate-bg{background:#f1f5f9;color:#1e293b}

.pfs .slide-title{font-size:var(--title);font-weight:800;line-height:1.08;letter-spacing:-0.025em;margin-bottom:var(--title-gap)}
.pfs .slide-title .accent{color:var(--blue2)}
.pfs section.dark .slide-title .accent,.pfs section.dark2 .slide-title .accent{color:#93c5fd}
.pfs .section-label{font-size:var(--small);font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--blue2);margin-bottom:16px}
.pfs section.dark .section-label,.pfs section.dark2 .section-label{color:#93c5fd}

.pfs .body{font-size:var(--body);line-height:1.55}
.pfs .small{font-size:var(--small);line-height:1.5}
.pfs .tiny{font-size:var(--tiny);line-height:1.5}
.pfs .micro{font-size:var(--micro);line-height:1.5}

.pfs .two-col{display:grid;grid-template-columns:1fr 1fr;gap:48px;flex:1;align-items:start}
.pfs .two-col.eq{align-items:stretch}
.pfs .two-col.wide{grid-template-columns:1.15fr 0.85fr}
.pfs .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;flex:1;align-items:stretch}
.pfs .four-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:24px;flex:1;align-items:stretch}
.pfs .five-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:20px;flex:1;align-items:stretch}

.pfs .callout{border-radius:18px;padding:22px 30px;font-size:var(--body);line-height:1.55}
.pfs .callout-blue{background:var(--blue-light);border-left:7px solid var(--blue2)}
.pfs .callout-amber{background:var(--gold-light);border-left:7px solid var(--gold)}
.pfs .callout-teal{background:var(--teal-light);border-left:7px solid var(--teal)}
.pfs .callout-rose{background:var(--rose-light);border-left:7px solid var(--rose)}
.pfs .callout-green{background:var(--green-light);border-left:7px solid var(--green)}
.pfs .callout-violet{background:var(--violet-light);border-left:7px solid var(--violet)}
.pfs section.dark .callout-blue,.pfs section.dark2 .callout-blue{background:rgba(37,99,235,0.18);border-left-color:#93c5fd;color:#dbeafe}

.pfs .badge{display:inline-block;font-size:var(--tiny);font-weight:700;padding:7px 22px;border-radius:999px;letter-spacing:0.04em}
.pfs .badge-blue{background:var(--blue2);color:#fff}
.pfs .badge-amber{background:var(--gold);color:#fff}
.pfs .badge-teal{background:var(--teal);color:#fff}
.pfs .badge-rose{background:var(--rose);color:#fff}
.pfs .badge-green{background:var(--green);color:#fff}
.pfs .badge-violet{background:var(--violet);color:#fff}
.pfs .badge-ghost{background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.72);border:1px solid rgba(255,255,255,0.2)}

.pfs table{border-collapse:collapse;font-size:var(--small);width:100%}
.pfs th{background:var(--navy2);color:#fff;padding:16px 22px;text-align:left;font-weight:700;font-size:var(--small)}
.pfs td{padding:14px 22px;border-bottom:1.5px solid #e2e8f0;vertical-align:middle;font-size:var(--small)}
.pfs tr:nth-child(even) td{background:#f8fafc}
.pfs tr:hover td{background:var(--blue-light);transition:background 0.18s}
.pfs .tbl-blue th{background:var(--blue2)}
.pfs .tbl-dark th{background:#0f172a}

.pfs ul.check{list-style:none;display:flex;flex-direction:column;gap:10px}
.pfs ul.check li{font-size:var(--small);line-height:1.5;padding-left:36px;position:relative}
.pfs ul.check li::before{content:'✓';position:absolute;left:0;font-weight:800;color:var(--teal);font-size:var(--small)}
.pfs section.dark ul.check li::before,.pfs section.dark2 ul.check li::before{color:#5eead4}
.pfs ul.cross{list-style:none;display:flex;flex-direction:column;gap:10px}
.pfs ul.cross li{font-size:var(--small);line-height:1.5;padding-left:36px;position:relative}
.pfs ul.cross li::before{content:'✗';position:absolute;left:0;font-weight:800;color:var(--rose);font-size:var(--small)}
.pfs ul.dot{list-style:none;display:flex;flex-direction:column;gap:9px}
.pfs ul.dot li{font-size:var(--small);line-height:1.5;padding-left:28px;position:relative}
.pfs ul.dot li::before{content:'';position:absolute;left:0;top:10px;width:14px;height:14px;border-radius:50%;background:var(--blue2)}

.pfs .main-title{font-size:88px;font-weight:900;line-height:1.02;letter-spacing:-0.03em;color:#fff;margin-bottom:24px}
.pfs .main-title .accent{color:#93c5fd}
.pfs .title-slide-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:1140px}
.pfs .copyright{position:absolute;bottom:20px;left:0;right:0;text-align:center;font-size:18px;color:rgba(0,0,0,0.16);letter-spacing:0.04em}
.pfs section.dark .copyright,.pfs section.dark2 .copyright{color:rgba(255,255,255,0.16)}
.pfs .deco-circle{position:absolute;border-radius:50%;pointer-events:none}

.pfs .step-list{display:flex;flex-direction:column;gap:16px}
.pfs .step{display:flex;gap:18px;align-items:flex-start}
.pfs .step-num{width:44px;height:44px;border-radius:50%;background:var(--blue2);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;margin-top:2px}
.pfs .step-text{font-size:var(--small);line-height:1.5;flex:1}

.pfs .pillar{border-radius:24px;padding:32px 28px;display:flex;flex-direction:column;gap:12px;flex:1}
.pfs .pillar-icon{font-size:48px;line-height:1}
.pfs .pillar-title{font-size:var(--body);font-weight:800}
.pfs .pillar-body{font-size:var(--small);line-height:1.55;opacity:0.85}

/* Click-to-reveal cards (stay open once clicked) */
.pfs .tactic-card{border-radius:20px;padding:26px 24px;cursor:pointer;transition:all 0.28s cubic-bezier(0.34,1.56,0.64,1);border:2px solid rgba(37,99,235,0.15);background:rgba(255,255,255,0.9);user-select:none}
.pfs .tactic-card:hover{transform:translateY(-5px);box-shadow:0 14px 32px rgba(37,99,235,0.14);border-color:var(--blue2)}
.pfs .tactic-card[data-revealed='true']{background:var(--blue-light);border-color:var(--blue2);transform:translateY(-3px)}
.pfs .tactic-card .hint-text{font-size:var(--tiny);color:var(--slate);margin-top:8px;opacity:0.75}
.pfs .tactic-card .reveal-content{display:none;margin-top:12px;padding-top:12px;border-top:1.5px dashed rgba(37,99,235,0.3);font-size:var(--tiny);color:var(--blue2);font-weight:600;line-height:1.45}
.pfs .tactic-card[data-revealed='true'] .reveal-content{display:block}
.pfs .tactic-card[data-revealed='true'] .hint-text{display:none}

/* Toggle-open cards (click to open/close) */
.pfs .fail-card{border-radius:18px;padding:22px 22px;cursor:pointer;transition:all 0.25s;background:rgba(255,255,255,0.92);border:2px solid rgba(225,29,72,0.15);user-select:none}
.pfs .fail-card:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(225,29,72,0.12);border-color:var(--rose)}
.pfs .fail-card[data-open='true']{background:var(--rose-light);border-color:var(--rose)}
.pfs .fail-card .fix{display:none;margin-top:10px;padding-top:10px;border-top:1.5px dashed rgba(225,29,72,0.3);font-size:var(--tiny);color:#9f1239;line-height:1.45}
.pfs .fail-card[data-open='true'] .fix{display:block}
.pfs .fail-title{font-size:var(--tiny);font-weight:700;color:#1e293b;line-height:1.3}
.pfs .fail-card[data-open='true'] .fail-title{color:#9f1239}
.pfs section.dark .tactic-card,.pfs section.dark2 .tactic-card,.pfs section.dark .fail-card,.pfs section.dark2 .fail-card{color:#1e293b}

/* Openness spectrum */
.pfs .spectrum-track{position:relative;height:10px;border-radius:999px;background:linear-gradient(90deg,#1e293b,var(--blue2),var(--teal),#5eead4);margin:56px 0 28px}
.pfs .spectrum-point{position:absolute;top:-14px;width:38px;height:38px;border-radius:50%;background:#fff;border:4px solid var(--navy2);transform:translateX(-50%)}
.pfs .spectrum-label{position:absolute;top:34px;width:220px;transform:translateX(-50%);text-align:center;font-size:var(--micro);line-height:1.4}

@keyframes pfs-fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
.pfs .fu{animation:pfs-fadeUp 0.55s ease-out both}
.pfs .fu1{animation:pfs-fadeUp 0.55s 0.08s ease-out both}
.pfs .fu2{animation:pfs-fadeUp 0.55s 0.18s ease-out both}
.pfs .fu3{animation:pfs-fadeUp 0.55s 0.28s ease-out both}
`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  // ── 1. Title ──────────────────────────────────────────────────────────────
  {
    classes: 'dark',
    label: '1 Platform Strategy – Title',
    html: `
    <div class="deco-circle" style="width:820px;height:820px;background:radial-gradient(circle,rgba(37,99,235,0.22) 0%,transparent 70%);right:-180px;top:-220px;"></div>
    <div class="deco-circle" style="width:520px;height:520px;background:radial-gradient(circle,rgba(124,58,237,0.14) 0%,transparent 70%);left:-100px;bottom:-120px;"></div>
    <div class="title-slide-inner fu">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:38px;">
        <div style="width:56px;height:7px;background:#93c5fd;border-radius:4px;"></div>
        <span style="font-size:var(--small);font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#93c5fd;">MBI800 · Strategic Information Systems</span>
      </div>
      <div class="main-title">Platform <span class="accent">Strategy</span></div>
      <p style="font-size:40px;color:rgba(255,255,255,0.55);margin-bottom:40px;font-weight:300;font-family:'Lora',serif;font-style:italic;">Why some of the biggest companies in the world don't make anything at all</p>
      <p style="font-size:var(--body);color:rgba(255,255,255,0.5);max-width:920px;line-height:1.65;margin-bottom:46px;">Uber owns no cars. Airbnb owns no rooms. The App Store doesn't write a single app. This session is about how that works — and what it means for how you plan information systems.</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <span class="badge badge-ghost">18 Slides</span>
        <span class="badge badge-blue">Network Effects</span>
        <span class="badge badge-amber">Case Studies</span>
        <span class="badge badge-teal">40-Min Group Activity</span>
        <span class="badge badge-violet">Knowledge Check</span>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 2. Why this belongs in SISP ──────────────────────────────────────────
  {
    classes: '',
    label: '2 Why This Belongs in SISP',
    html: `
    <div class="section-label">Framing</div>
    <div class="slide-title">Where This Fits in <span class="accent">Your Planning Toolkit</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="callout callout-blue">
          Classic SISP models assume the firm controls its whole value chain, end to end.
        </div>
        <p style="font-size:var(--small);line-height:1.6;color:var(--slate);">That breaks once a firm's biggest decisions involve a network it doesn't fully own — outside sellers, developers, drivers.</p>
        <div class="callout callout-amber">Platform strategy is what that shift looks like in practice.</div>
      </div>
      <table class="tbl-blue">
        <thead><tr><th style="width:46%;">A traditional plan asks…</th><th>A platform-era plan also asks…</th></tr></thead>
        <tbody>
          <tr><td>What systems does our value chain need?</td><td>What ecosystem are we part of?</td></tr>
          <tr><td>How do we align IT with the business?</td><td>How do outsiders safely build on us?</td></tr>
          <tr><td>What's our architecture roadmap?</td><td>Is our architecture open at the edges?</td></tr>
          <tr><td>How do we govern IT risk?</td><td>How do we govern a network we don't own?</td></tr>
        </tbody>
      </table>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 3. Pipes vs Platforms ─────────────────────────────────────────────────
  {
    classes: 'dark2',
    label: '3 Pipes, Products, Platforms',
    html: `
    <div class="deco-circle" style="width:520px;height:520px;background:radial-gradient(circle,rgba(37,99,235,0.14) 0%,transparent 70%);right:-80px;bottom:-100px;"></div>
    <div class="section-label">Foundations</div>
    <div class="slide-title">Pipes, Products, and <span class="accent">Platforms</span></div>
    <div class="three-col">
      <div class="pillar" style="background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.12);">
        <div class="pillar-icon">📦</div>
        <div class="pillar-title" style="color:#fff;">Pipeline business</div>
        <div class="pillar-body" style="color:rgba(255,255,255,0.75);">Value flows one way: design → build → sell. The firm owns the whole chain.</div>
      </div>
      <div class="pillar" style="background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.12);">
        <div class="pillar-icon">🎯</div>
        <div class="pillar-title" style="color:#fff;">Product business</div>
        <div class="pillar-body" style="color:rgba(255,255,255,0.75);">One offering, sold directly. No crowd of outside partners needed.</div>
      </div>
      <div class="pillar" style="background:rgba(37,99,235,0.16);border:1.5px solid rgba(147,197,253,0.4);">
        <div class="pillar-icon">🔗</div>
        <div class="pillar-title" style="color:#93c5fd;">Platform business</div>
        <div class="pillar-body" style="color:rgba(255,255,255,0.9);">Connects two or more groups. The owner supplies the rules and infrastructure — not always the product.</div>
      </div>
    </div>
    <div class="callout callout-blue" style="margin-top:28px;background:rgba(37,99,235,0.14);border-left-color:#93c5fd;color:#dbeafe;">
      Platforms <strong>orchestrate</strong> value. They don't have to <strong>own</strong> it.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 4. Network Effects (interactive reveal cards) ────────────────────────
  {
    classes: '',
    label: '4 Network Effects',
    html: `
    <div class="section-label">Core Mechanics · Click each card</div>
    <div class="slide-title">Why Platforms Get <span class="accent">Stronger With Size</span></div>
    <p class="small" style="color:var(--slate);margin-bottom:20px;">A <strong>network effect</strong>: the platform gets more valuable as more people use it. Click each card.</p>
    <div class="four-col">
      <div class="tactic-card fu1" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:34px;">🚗</div>
        <div style="font-weight:700;font-size:var(--small);margin-top:8px;">Cross-side, positive</div>
        <div class="hint-text">Ride-hailing example →</div>
        <div class="reveal-content">More drivers = shorter waits for riders. More riders = more fares for drivers.</div>
      </div>
      <div class="tactic-card fu2" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:34px;">💬</div>
        <div style="font-weight:700;font-size:var(--small);margin-top:8px;">Same-side, positive</div>
        <div class="hint-text">Messaging example →</div>
        <div class="reveal-content">More friends on a messaging app makes it more useful to you — no other side involved.</div>
      </div>
      <div class="tactic-card fu3" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:34px;">🚦</div>
        <div style="font-weight:700;font-size:var(--small);margin-top:8px;">Same-side, negative</div>
        <div class="hint-text">Congestion example →</div>
        <div class="reveal-content">Too many drivers in one area lowers earnings per driver. Growth isn't always good.</div>
      </div>
      <div class="tactic-card" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:34px;">🧠</div>
        <div style="font-weight:700;font-size:var(--small);margin-top:8px;">Data network effect</div>
        <div class="hint-text">Netflix example →</div>
        <div class="reveal-content">Every interaction improves recommendations for everyone — even without new users.</div>
      </div>
    </div>
    <div class="callout callout-amber" style="margin-top:24px;">
      <strong>Watch out:</strong> network effects aren't always good. Managing the negative ones matters as much as growing the positive ones.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 5. Chicken-and-Egg (interactive reveal cards) ────────────────────────
  {
    classes: 'dark2',
    label: '5 The Chicken-and-Egg Problem',
    html: `
    <div class="section-label">Two-Sided Markets · Click each tactic</div>
    <div class="slide-title">Solving the <span class="accent">Chicken-and-Egg Problem</span></div>
    <p class="small" style="color:rgba(255,255,255,0.65);margin-bottom:20px;">Neither side wants to join an empty platform. The fix: price the two sides differently. Click a tactic to see who used it.</p>
    <div class="five-col">
      <div class="tactic-card fu1" style="background:rgba(255,255,255,0.92);" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:30px;">💸</div>
        <div style="font-weight:700;font-size:var(--tiny);margin-top:6px;">Subsidise one side</div>
        <div class="hint-text">Click →</div>
        <div class="reveal-content">Uber paid early drivers to guarantee supply before riders trusted the app.</div>
      </div>
      <div class="tactic-card fu2" style="background:rgba(255,255,255,0.92);" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:30px;">🎮</div>
        <div style="font-weight:700;font-size:var(--tiny);margin-top:6px;">Single-player mode</div>
        <div class="hint-text">Click →</div>
        <div class="reveal-content">Early Airbnb worked as a browsing tool even with zero hosts nearby.</div>
      </div>
      <div class="tactic-card fu3" style="background:rgba(255,255,255,0.92);" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:30px;">📦</div>
        <div style="font-weight:700;font-size:var(--tiny);margin-top:6px;">Seed your own supply</div>
        <div class="hint-text">Click →</div>
        <div class="reveal-content">Amazon and Zappos listed their own inventory first, before opening to sellers.</div>
      </div>
      <div class="tactic-card" style="background:rgba(255,255,255,0.92);" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:30px;">🐴</div>
        <div style="font-weight:700;font-size:var(--tiny);margin-top:6px;">Piggyback a network</div>
        <div class="hint-text">Click →</div>
        <div class="reveal-content">PayPal grew by riding on eBay auctions — showing up where its users already were.</div>
      </div>
      <div class="tactic-card" style="background:rgba(255,255,255,0.92);" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:30px;">📍</div>
        <div style="font-weight:700;font-size:var(--tiny);margin-top:6px;">Target a micro-market</div>
        <div class="hint-text">Click →</div>
        <div class="reveal-content">Facebook launched at one campus first. Food-delivery apps still launch suburb by suburb.</div>
      </div>
    </div>
    <div class="callout callout-blue" style="margin-top:24px;background:rgba(37,99,235,0.16);border-left-color:#93c5fd;color:#dbeafe;">
      Today's group activity: find a real platform online and work out which of these tactics it actually used.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 6. Multi-homing ───────────────────────────────────────────────────────
  {
    classes: '',
    label: '6 Multi-Homing & Switching Costs',
    html: `
    <div class="section-label">Core Mechanics</div>
    <div class="slide-title">Multi-Homing: <span class="accent">Why Some Markets Tip, Others Don't</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="callout callout-teal">
          <strong>Single-homing:</strong> sticking to one platform. <strong>Multi-homing:</strong> using rival platforms at once — a hotel listed on Booking.com <em>and</em> Expedia.
        </div>
        <p class="small" style="color:var(--slate);">The easier it is to multi-home, the harder it is for one platform to become a monopoly.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="background:white;border-radius:18px;padding:24px 26px;border:1.5px solid rgba(0,0,0,0.08);box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          <div style="font-weight:700;color:var(--blue2);font-size:var(--small);margin-bottom:8px;">Low multi-homing cost →</div>
          <div class="small" style="color:var(--slate);">Several platforms survive side by side.</div>
        </div>
        <div style="background:white;border-radius:18px;padding:24px 26px;border:1.5px solid rgba(0,0,0,0.08);box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          <div style="font-weight:700;color:var(--rose);font-size:var(--small);margin-bottom:8px;">High multi-homing cost →</div>
          <div class="small" style="color:var(--slate);">The market tips toward one winner.</div>
        </div>
        <div class="callout callout-amber">Example: Alexa, Siri and Google Assistant — the winner depends on how easily people can switch between them.</div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 7. Three types of platforms ──────────────────────────────────────────
  {
    classes: '',
    label: '7 Transaction, Innovation, Hybrid',
    html: `
    <div class="section-label">Classification · Cusumano, Gawer &amp; Yoffie</div>
    <div class="slide-title">Three Kinds of <span class="accent">Platforms</span></div>
    <table class="tbl-blue" style="flex:1;">
      <thead>
        <tr><th style="width:22%;">Dimension</th><th style="width:39%;background:#0d9488;">🔁 Transaction platform</th><th style="width:39%;background:#7c3aed;">🛠️ Innovation platform</th></tr>
      </thead>
      <tbody>
        <tr><td style="font-weight:600;">What it does</td><td>Lets people find and transact with each other</td><td>Gives third parties a technology base to build on</td></tr>
        <tr><td style="font-weight:600;">Revenue</td><td>Commission, listing fees, subscription</td><td>Licensing, revenue share, cloud/hardware sales</td></tr>
        <tr><td style="font-weight:600;">Governance focus</td><td>Trust, ratings, fraud prevention</td><td>Developer relations, API stability, IP protection</td></tr>
        <tr><td style="font-weight:600;">Examples</td><td>eBay, Airbnb, Uber, Stripe</td><td>Windows, Android, AWS, Salesforce Platform</td></tr>
      </tbody>
    </table>
    <div class="callout callout-blue" style="margin-top:22px;">
      <strong>Hybrid platforms</strong> do both. Apple's iOS lets developers build apps (innovation); the App Store sells and distributes them (transaction). Amazon's Marketplace is transaction; AWS underneath is innovation.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 8. Four steps to build a platform ────────────────────────────────────
  {
    classes: 'dark',
    label: '8 Four Steps to Build a Platform',
    html: `
    <div class="deco-circle" style="width:560px;height:560px;background:radial-gradient(circle,rgba(37,99,235,0.14) 0%,transparent 70%);right:-100px;top:-140px;"></div>
    <div class="section-label">Design Discipline</div>
    <div class="slide-title">Four Decisions Every Platform <span class="accent">Has to Make</span></div>
    <div class="step-list" style="margin-top:8px;">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text" style="color:rgba(255,255,255,0.9);"><strong style="color:#93c5fd;">Choose your sides.</strong> Which groups will you connect?</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text" style="color:rgba(255,255,255,0.9);"><strong style="color:#93c5fd;">Solve chicken-and-egg.</strong> Which side do you seed first, and how?</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text" style="color:rgba(255,255,255,0.9);"><strong style="color:#93c5fd;">Design the business model.</strong> Who pays, how much, on each side?</div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-text" style="color:rgba(255,255,255,0.9);"><strong style="color:#93c5fd;">Set the governance rules.</strong> How open is it, and who shares in the value?</div>
      </div>
    </div>
    <div class="callout callout-blue" style="margin-top:26px;background:rgba(37,99,235,0.16);border-left-color:#93c5fd;color:#dbeafe;">Source: Cusumano, Gawer &amp; Yoffie, <em>The Business of Platforms</em> (2019).</div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 9. Governance & boundary resources ───────────────────────────────────
  {
    classes: '',
    label: '9 Boundary Resources & Governance',
    html: `
    <div class="section-label">The IS Research Lens · Ghazawneh &amp; Henfridsson</div>
    <div class="slide-title">Governance: <span class="accent">Enable, or Control?</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="callout callout-violet">
          Platform owners govern outsiders through <strong>boundary resources</strong> — APIs, SDKs, and review processes.
        </div>
        <p class="small" style="color:var(--slate);">Every boundary resource balances two things: enough capability for developers to build value, without losing control.</p>
        <div style="display:flex;gap:16px;">
          <div style="flex:1;background:var(--teal-light);border-radius:16px;padding:20px;">
            <div style="font-weight:700;color:#0f766e;font-size:var(--small);">Resourcing →</div>
            <div class="tiny" style="color:#0f766e;margin-top:6px;">Enable. Attract developers.</div>
          </div>
          <div style="flex:1;background:var(--rose-light);border-radius:16px;padding:20px;">
            <div style="font-weight:700;color:#9f1239;font-size:var(--small);">← Securing</div>
            <div class="tiny" style="color:#9f1239;margin-top:6px;">Control. Protect. Review.</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="background:white;border-radius:18px;padding:26px;border:1.5px solid rgba(0,0,0,0.08);box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          <div style="font-weight:700;font-size:var(--small);margin-bottom:10px;">Case in point: Apple's App Store</div>
          <p class="tiny" style="color:var(--slate);line-height:1.55;">Apple's app review does both jobs at once: it gives developers a huge market (resourcing), while reviewing every app and taking a commission (securing).</p>
        </div>
        <div class="callout callout-amber">
          Governance and architecture <em>co-evolve</em>. Open up the rules without redesigning the system to support it, and you create risk.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 10. Openness spectrum ─────────────────────────────────────────────────
  {
    classes: '',
    label: '10 The Openness Spectrum',
    html: `
    <div class="section-label">Governance Is Not Binary</div>
    <div class="slide-title">How Open Should <span class="accent">a Platform Be?</span></div>
    <p class="small" style="color:var(--slate);margin-bottom:8px;">Joel West's framing still holds: openness is "many shades of grey." Most successful commercial platforms sit somewhere in the middle — open enough to attract an ecosystem, controlled enough to stay trustworthy.</p>
    <div style="position:relative;flex:1;">
      <div class="spectrum-track" style="width:92%;margin-left:4%;">
        <div class="spectrum-point" style="left:2%;background:#1e293b;"></div>
        <div class="spectrum-label" style="left:2%;color:var(--slate);"><strong>Closed</strong><br/>Traditional mainframe software — single vendor, no outside development</div>
        <div class="spectrum-point" style="left:28%;background:var(--blue2);"></div>
        <div class="spectrum-label" style="left:28%;color:var(--slate);"><strong>Curated</strong><br/>Apple iOS / App Store — open to developers, tightly reviewed</div>
        <div class="spectrum-point" style="left:52%;background:var(--blue2);"></div>
        <div class="spectrum-label" style="left:52%;color:var(--slate);"><strong>Open core, curated layer</strong><br/>Android — open-source base, curated Play Store on top</div>
        <div class="spectrum-point" style="left:76%;background:var(--teal);"></div>
        <div class="spectrum-label" style="left:76%;color:var(--slate);"><strong>Open standard</strong><br/>An interoperability protocol donated to a neutral foundation so no single vendor controls it</div>
        <div class="spectrum-point" style="left:98%;background:#5eead4;"></div>
        <div class="spectrum-label" style="left:98%;color:var(--slate);"><strong>Fully open</strong><br/>Wikipedia — community-governed, no gatekeeping</div>
      </div>
    </div>
    <div class="callout callout-blue" style="margin-top:12px;">
      Where you sit on this spectrum is a strategic choice, not a technical afterthought — and it's one every SISP needs to make explicit.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 11. Envelopment (interactive toggle cards) ───────────────────────────
  {
    classes: 'dark2',
    label: '11 Platform Envelopment',
    html: `
    <div class="section-label">Competitive Strategy · Eisenmann, Parker &amp; Van Alstyne · Click each card</div>
    <div class="slide-title">Envelopment: <span class="accent">Winning by Bundling, Not Building</span></div>
    <p class="small" style="color:rgba(255,255,255,0.65);margin-bottom:18px;">An <strong>enveloper</strong> doesn't out-innovate a rival platform — it enters an adjacent market and bundles its own feature in, using a user base it already owns.</p>
    <div class="three-col">
      <div class="fail-card fu1" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div class="fail-title">1. Complements</div>
        <div class="micro" style="color:var(--slate);margin-top:4px;">Click for the example</div>
        <div class="fix">A social platform builds native messaging in, so users no longer need a separate standalone messaging app.</div>
      </div>
      <div class="fail-card fu2" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div class="fail-title">2. Weak substitutes</div>
        <div class="micro" style="color:var(--slate);margin-top:4px;">Click for the example</div>
        <div class="fix">A cloud storage platform adds lightweight document editing — enough overlap with a standalone office suite to erode its reason to exist.</div>
      </div>
      <div class="fail-card fu3" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div class="fail-title">3. Functionally unrelated</div>
        <div class="micro" style="color:var(--slate);margin-top:4px;">Click for the example</div>
        <div class="fix">A hardware ecosystem cross-sells an unrelated service — say, payments — to the installed base it already has, foreclosing a rival's entry point.</div>
      </div>
    </div>
    <div class="callout callout-blue" style="margin-top:22px;background:rgba(37,99,235,0.16);border-left-color:#93c5fd;color:#dbeafe;">
      <strong>Defending against it:</strong> open up your own layer to build allies, or build a comparable bundle yourself, first.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 12. Case: Amazon flywheel ─────────────────────────────────────────────
  {
    classes: '',
    label: '12 Case Study — Amazon',
    html: `
    <div class="section-label">Case Study 1</div>
    <div class="slide-title">Amazon: From <span class="accent">Bookstore to Hybrid Platform</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="padding:22px 24px;background:var(--teal-light);border-radius:16px;border:1.5px solid rgba(13,148,136,0.25);">
          <div style="font-weight:700;color:#0f766e;">🔁 Marketplace — transaction platform</div>
          <div class="tiny" style="color:#0f766e;margin-top:6px;line-height:1.5;">Opened to third-party sellers to fill selection gaps, without carrying inventory risk.</div>
        </div>
        <div style="padding:22px 24px;background:var(--violet-light);border-radius:16px;border:1.5px solid rgba(124,58,237,0.25);">
          <div style="font-weight:700;color:#5b21b6;">🛠️ AWS — innovation platform</div>
          <div class="tiny" style="color:#5b21b6;margin-top:6px;line-height:1.5;">Started as Amazon's own infrastructure, then sold externally — even to Amazon's retail rivals.</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-blue">
          <strong>The Flywheel:</strong> lower prices + more selection → more traffic → more sellers → lower costs → lower prices again.
        </div>
        <div class="callout callout-amber">
          <strong>SISP takeaway:</strong> internal infrastructure can become a second platform business. Who gets admitted is a governance call, not an operational one.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 13. Case: GE Predix failure (interactive toggle cards) ───────────────
  {
    classes: 'dark',
    label: '13 Case Study — GE Predix',
    html: `
    <div class="section-label">Case Study 2 · A Counter-Example · Click each card</div>
    <div class="slide-title">GE Predix: When a <span class="accent">Platform Strategy Fails</span></div>
    <p class="small" style="color:rgba(255,255,255,0.65);margin-bottom:16px;">GE launched Predix in 2014 to become "the Android of industry." It was quietly retired around 2022. Click each card.</p>
    <div class="three-col">
      <div class="fail-card fu1" style="background:rgba(255,255,255,0.94);" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div class="fail-title">Tried to serve too many sides</div>
        <div class="tiny" style="color:var(--slate);margin-top:4px;">Click for detail</div>
        <div class="fix">Aviation, healthcare and oil &amp; gas all need different things. One platform couldn't go deep enough in any of them.</div>
      </div>
      <div class="fail-card fu2" style="background:rgba(255,255,255,0.94);" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div class="fail-title">Built its own cloud, alone</div>
        <div class="tiny" style="color:var(--slate);margin-top:4px;">Click for detail</div>
        <div class="fix">GE built its own data centres instead of using AWS or Azure — competing with far bigger cloud players.</div>
      </div>
      <div class="fail-card fu3" style="background:rgba(255,255,255,0.94);" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div class="fail-title">Not developer-friendly</div>
        <div class="tiny" style="color:var(--slate);margin-top:4px;">Click for detail</div>
        <div class="fix">Hard for outsiders to build on. A platform with no developer ecosystem is just expensive custom software.</div>
      </div>
    </div>
    <div class="callout callout-rose" style="margin-top:20px;background:rgba(225,29,72,0.16);border-left-color:#fb7185;color:#fecdd3;">
      GE spent roughly $4 billion over six years on Predix. Most platform teaching leans on winners — this is the counter-example worth remembering.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 14. Platform premium ──────────────────────────────────────────────────
  {
    classes: '',
    label: '14 Does Platform Strategy Pay Off?',
    html: `
    <div class="section-label">The Evidence</div>
    <div class="slide-title">Does Being a Platform <span class="accent">Actually Pay Off?</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-blue">
          A study of 43 public platform companies found they did the same revenue with <strong>half the staff</strong>, <strong>twice the profit</strong>, and <strong>twice the growth</strong> of similar non-platform firms.
        </div>
        <p class="small" style="color:var(--slate);">A separate study of 959 unicorns found platform models carry a real valuation premium — though the size varies by region.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div class="small" style="font-weight:700;">North America</div>
          <div style="background:var(--blue-light);border-radius:8px;height:28px;width:100%;margin-top:8px;position:relative;"><div style="background:var(--blue2);height:100%;width:100%;border-radius:8px;"></div><span style="position:absolute;right:10px;top:2px;font-size:var(--tiny);font-weight:700;color:#fff;">+129%</span></div>
        </div>
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div class="small" style="font-weight:700;">Europe</div>
          <div style="background:var(--blue-light);border-radius:8px;height:28px;width:100%;margin-top:8px;position:relative;"><div style="background:var(--blue2);height:100%;width:53%;border-radius:8px;"></div><span style="position:absolute;left:calc(53% + 10px);top:2px;font-size:var(--tiny);font-weight:700;color:var(--blue2);">+68%</span></div>
        </div>
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div class="small" style="font-weight:700;">Asia-Pacific</div>
          <div style="background:var(--blue-light);border-radius:8px;height:28px;width:100%;margin-top:8px;position:relative;"><div style="background:var(--blue2);height:100%;width:30%;border-radius:8px;"></div><span style="position:absolute;left:calc(30% + 10px);top:2px;font-size:var(--tiny);font-weight:700;color:var(--blue2);">+39%</span></div>
        </div>
        <div class="tiny" style="color:var(--slate);">Valuation premium, platform vs. non-platform unicorns · one study, one point in time.</div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 15. Risks and critique ────────────────────────────────────────────────
  {
    classes: 'dark2',
    label: '15 Risks & Critique',
    html: `
    <div class="section-label">Don't Teach This Uncritically</div>
    <div class="slide-title">Where Platform Strategy <span class="accent">Goes Wrong</span></div>
    <div class="two-col">
      <ul class="cross" style="gap:18px;">
        <li style="font-size:var(--body);color:rgba(255,255,255,0.9);"><strong>Mispricing</strong> — subsidise the wrong side and liquidity never arrives.</li>
        <li style="font-size:var(--body);color:rgba(255,255,255,0.9);"><strong>Cold-start failure</strong> — most launches never solve chicken-and-egg.</li>
        <li style="font-size:var(--body);color:rgba(255,255,255,0.9);"><strong>Scope overreach</strong> — the Predix pattern: too many verticals at once.</li>
      </ul>
      <ul class="cross" style="gap:18px;">
        <li style="font-size:var(--body);color:rgba(255,255,255,0.9);"><strong>Trust collapse</strong> — weak governance can destroy the value fast.</li>
        <li style="font-size:var(--body);color:rgba(255,255,255,0.9);"><strong>Dependence</strong> — once sellers rely on you, you can change the rules on them.</li>
        <li style="font-size:var(--body);color:rgba(255,255,255,0.9);"><strong>Regulation</strong> — antitrust scrutiny grows with platform dominance.</li>
      </ul>
    </div>
    <div class="callout callout-blue" style="margin-top:24px;background:rgba(37,99,235,0.16);border-left-color:#93c5fd;color:#dbeafe;">
      This isn't "don't build platforms." It's: plan for the trade-offs — don't assume a guaranteed win.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 16. SISP diagnostic toolkit ───────────────────────────────────────────
  {
    classes: '',
    label: '16 A Diagnostic Toolkit',
    html: `
    <div class="section-label">Practical Toolkit</div>
    <div class="slide-title">Six Questions for <span class="accent">Your Own SISP Work</span></div>
    <div class="step-list">
      <div class="step"><div class="step-num">1</div><div class="step-text"><strong>Sides:</strong> do we connect two or more groups who need each other?</div></div>
      <div class="step"><div class="step-num">2</div><div class="step-text"><strong>Latent asset:</strong> do we have infrastructure or data others would value too?</div></div>
      <div class="step"><div class="step-num">3</div><div class="step-text"><strong>Network effect:</strong> does one more user make it better for everyone else?</div></div>
      <div class="step"><div class="step-num">4</div><div class="step-text"><strong>Chicken-and-egg:</strong> which side can we seed first, and how?</div></div>
      <div class="step"><div class="step-num">5</div><div class="step-text"><strong>Governance readiness:</strong> can we build the rules and APIs responsibly?</div></div>
      <div class="step"><div class="step-num">6</div><div class="step-text"><strong>Envelopment risk:</strong> who could bundle us out of our own market?</div></div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 17. Discussion questions ──────────────────────────────────────────────
  {
    classes: 'dark',
    label: '17 Discussion Questions',
    html: `
    <div class="deco-circle" style="width:480px;height:480px;background:radial-gradient(circle,rgba(124,58,237,0.14) 0%,transparent 70%);right:-60px;top:-100px;"></div>
    <div class="section-label">Before We Move to the Activity</div>
    <div class="slide-title">Questions Worth <span class="accent">Sitting With</span></div>
    <div class="step-list" style="margin-top:8px;">
      <div class="step"><div class="step-num">1</div><div class="step-text" style="color:rgba(255,255,255,0.9);">Name something you use weekly that's a pure pipeline business. Now name one that quietly became a hybrid platform without you noticing.</div></div>
      <div class="step"><div class="step-num">2</div><div class="step-text" style="color:rgba(255,255,255,0.9);">Pick a platform you use regularly. Which adjacent platform could envelop it — and how would you defend against that?</div></div>
      <div class="step"><div class="step-num">3</div><div class="step-text" style="color:rgba(255,255,255,0.9);">GE had money, engineers, and existing industrial customers. Which single decision point, if reversed, might have saved Predix?</div></div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 18. Activity bridge ───────────────────────────────────────────────────
  {
    classes: 'dark2',
    label: '18 Today\'s Activity',
    html: `
    <div class="deco-circle" style="width:600px;height:600px;background:radial-gradient(circle,rgba(37,99,235,0.16) 0%,transparent 70%);left:-120px;bottom:-140px;"></div>
    <div class="section-label">Group Activity · 4–6 Members · 40 Minutes</div>
    <div class="slide-title">Find a Platform. <span class="accent">Present It.</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-blue" style="background:rgba(37,99,235,0.16);border-left-color:#93c5fd;color:#dbeafe;">
          Get into groups of 4–6. Pick any real platform — one you use, or one you've heard of. Research it online, then prepare a short presentation for the class.
        </div>
        <ul class="check" style="gap:12px;">
          <li style="color:rgba(255,255,255,0.9);">Who are its two or more sides?</li>
          <li style="color:rgba(255,255,255,0.9);">How did it solve the chicken-and-egg problem?</li>
          <li style="color:rgba(255,255,255,0.9);">How does it make money, and how open is it?</li>
        </ul>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="background:rgba(255,255,255,0.08);border-radius:16px;padding:20px 22px;display:flex;justify-content:space-between;align-items:center;"><span class="small" style="color:#fff;font-weight:700;">Form groups, pick a platform</span><span class="badge badge-blue">5 min</span></div>
        <div style="background:rgba(255,255,255,0.08);border-radius:16px;padding:20px 22px;display:flex;justify-content:space-between;align-items:center;"><span class="small" style="color:#fff;font-weight:700;">Research online, build slides</span><span class="badge badge-teal">25 min</span></div>
        <div style="background:rgba(255,255,255,0.08);border-radius:16px;padding:20px 22px;display:flex;justify-content:space-between;align-items:center;"><span class="small" style="color:#fff;font-weight:700;">Present to the class</span><span class="badge badge-amber">10 min</span></div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
];

// ── Group Activity: Find a Platform, Present It ─────────────────────────────

const IDEA_LIST = [
  'Airbnb', 'Uber', 'Spotify', 'Etsy', 'Duolingo', 'Roblox', 'Twitch',
  'DoorDash', 'Discord', 'Shopify', 'Steam', 'Substack', 'YouTube',
  'TradeMe', 'LinkedIn', 'Fiverr', 'Booking.com', 'PlayStation Network',
];

const RESEARCH_QUESTIONS = [
  'Who are its two or more sides?',
  'How did it solve the chicken-and-egg problem when it launched?',
  'What kind of network effect does it rely on?',
  'How does it make money — who pays, and who doesn\'t?',
  'How open or closed is it to outsiders?',
  'What is one real risk it faces today?',
];

const PRESENTATION_SLIDES = [
  'Slide 1 — Name the platform and what it does',
  'Slide 2 — Its sides, and one network effect example',
  'Slide 3 — Business model and how open it is',
  'Slide 4 — One risk, or one question for the class',
];

function GroupResearchActivity() {
  const [idea, setIdea] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean[]>(Array(RESEARCH_QUESTIONS.length).fill(false));

  function shuffleIdea() {
    let next = idea;
    while (next === idea) {
      next = IDEA_LIST[Math.floor(Math.random() * IDEA_LIST.length)];
    }
    setIdea(next);
  }

  function toggle(i: number) {
    setChecked(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid rgba(37,99,235,0.2)', background: 'rgba(255,255,255,0.95)' }}>
      <div className="px-6 py-4" style={{ background: 'linear-gradient(135deg, #0b1220, #1d4ed8)' }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#93c5fd' }}>Group Activity · 4–6 Members · 40 Minutes</p>
        <h3 className="text-base font-bold text-white mt-0.5">Find a Platform. Present It.</h3>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Pick any real platform, research it online, and prepare a short presentation for the class.</p>
      </div>

      <div className="p-6 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold mb-2" style={{ color: '#1e1b4b' }}>Timing (40 minutes total)</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: 'rgba(37,99,235,0.06)' }}>
                <span className="text-xs font-semibold" style={{ color: '#1e1b4b' }}>Form groups of 4–6, pick a platform</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#1d4ed8', color: '#fff' }}>5 min</span>
              </div>
              <div className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: 'rgba(13,148,136,0.08)' }}>
                <span className="text-xs font-semibold" style={{ color: '#1e1b4b' }}>Research online, build simple slides</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#0d9488', color: '#fff' }}>25 min</span>
              </div>
              <div className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: 'rgba(217,119,6,0.08)' }}>
                <span className="text-xs font-semibold" style={{ color: '#1e1b4b' }}>Present to the class</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#d97706', color: '#fff' }}>10 min</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold" style={{ color: '#1e1b4b' }}>Stuck for an idea?</p>
              <button
                onClick={shuffleIdea}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                style={{ background: 'rgba(37,99,235,0.1)', color: '#1d4ed8' }}
              >
                <RotateCcw size={12} /> Shuffle
              </button>
            </div>
            <div className="rounded-xl px-4 py-3 text-sm font-semibold text-center" style={{ background: 'rgba(37,99,235,0.06)', color: '#1d4ed8', minHeight: 44 }}>
              {idea ?? 'Click shuffle for a suggestion — or pick your own'}
            </div>
            <p className="text-xs mt-2" style={{ color: '#6b7280' }}>Any real platform works. Use it, or something completely different — your choice.</p>
          </div>

          <div>
            <p className="text-xs font-bold mb-2" style={{ color: '#1e1b4b' }}>Your presentation should cover</p>
            <div className="flex flex-col gap-1.5">
              {PRESENTATION_SLIDES.map(s => (
                <p key={s} className="text-xs" style={{ color: '#374151' }}>{s}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold" style={{ color: '#1e1b4b' }}>Research checklist — tick as you go</p>
          {RESEARCH_QUESTIONS.map((q, i) => (
            <button
              key={q}
              onClick={() => toggle(i)}
              className="flex items-start gap-3 text-left rounded-xl px-4 py-3 transition-all"
              style={{
                background: checked[i] ? 'rgba(5,150,105,0.08)' : 'rgba(37,99,235,0.04)',
                border: `1.5px solid ${checked[i] ? 'rgba(5,150,105,0.3)' : 'rgba(37,99,235,0.15)'}`,
              }}
            >
              <span className="mt-0.5 flex-shrink-0">
                {checked[i] ? <CheckCircle size={16} style={{ color: '#059669' }} /> : <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 4, border: '1.5px solid #94a3b8' }} />}
              </span>
              <span className="text-xs font-medium" style={{ color: checked[i] ? '#065f46' : '#374151' }}>{q}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Knowledge Check ──────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
  {
    q: 'What is the defining feature of a platform business, compared to a pipeline business?',
    options: ['It sells software instead of physical goods', 'It orchestrates value created by outside participants rather than owning it', 'It has no employees', 'It only operates online'],
    correct: 1,
    explain: 'Platforms connect distinct groups and let them create value together — Uber owns no cars, Airbnb owns no rooms. Ownership of the means of production is not the point.',
  },
  {
    q: 'More drivers on a ride-hailing app means shorter wait times for riders. What kind of network effect is this?',
    options: ['Same-side, positive', 'Cross-side, positive', 'Cross-side, negative', 'Data network effect'],
    correct: 1,
    explain: 'Cross-side effects run between the two different groups — more of one side improves the experience for the other side.',
  },
  {
    q: 'Why does a two-sided platform often subsidise one side and charge the other?',
    options: ['To maximise short-term profit', 'Because one side is usually more price-sensitive, and subsidising it attracts the side that pays', 'It is a legal requirement in most markets', 'To reduce server costs'],
    correct: 1,
    explain: 'This is the "seesaw pricing" idea from two-sided market theory (Rochet & Tirole): get the structure of prices right across both sides, not just the total.',
  },
  {
    q: 'Facebook launching only at Harvard before expanding campus by campus is an example of which chicken-and-egg tactic?',
    options: ['Subsidise one side', 'Piggyback on an existing network', 'Target a micro-market first', 'Single-player mode'],
    correct: 2,
    explain: 'Seeding a small, well-defined market first makes liquidity achievable before expanding — the same tactic food-delivery apps use suburb by suburb.',
  },
  {
    q: 'In the Ghazawneh & Henfridsson boundary resources model, what does "securing" refer to?',
    options: ['Encrypting user data', 'Giving developers more capability', 'Controlling and protecting the platform — review, certification, IP protection', 'Raising the app store commission'],
    correct: 2,
    explain: 'Boundary resources balance resourcing (enabling developers) against securing (protecting platform integrity, security and business position).',
  },
  {
    q: 'Which of these is a genuine platform envelopment move?',
    options: ['Lowering your own prices to compete directly', 'Bundling a feature into your own platform using an existing shared user base, to foreclose a rival\'s access to users', 'Filing a patent on a competitor\'s technology', 'Acquiring a competitor outright'],
    correct: 1,
    explain: 'Envelopment specifically means leveraging an existing user relationship to bundle in adjacent functionality — not just competing on price or buying the rival.',
  },
  {
    q: 'What was a core reason GE Predix struggled, according to the case discussed in this lecture?',
    options: ['GE lacked capital to invest', 'It tried to serve too many unrelated industrial verticals with one undifferentiated platform, and built proprietary infrastructure competing with hyperscalers', 'No industrial company was interested in IoT data', 'GE never assigned it a dedicated business unit'],
    correct: 1,
    explain: 'Predix spread itself across aviation, healthcare, power and oil & gas at once, and built its own data centres instead of using existing cloud infrastructure — both classic platform scope-and-infrastructure mistakes.',
  },
  {
    q: 'In a strategic IS plan, what does the "envelopment-exposure" diagnostic question ask?',
    options: ['How much revenue comes from platform fees', 'Which adjacent platform could bundle our functionality and cut off our access to users', 'How many developers use our API', 'What our customer acquisition cost is'],
    correct: 1,
    explain: 'This diagnostic question is about defending your own position — identifying who could envelop you before they do.',
  },
];

function PlatformQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ_QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);

  const score = submitted ? answers.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length : 0;
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  function reset() {
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setSubmitted(false);
    setCurrent(0);
  }

  const q = QUIZ_QUESTIONS[current];
  const answered = answers[current] !== null;
  const correct = answered && answers[current] === q.correct;
  const allAnswered = answers.every(a => a !== null);

  function choose(idx: number) {
    if (submitted) return;
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid rgba(37,99,235,0.2)', background: 'rgba(255,255,255,0.9)' }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0b1220, #1d4ed8)' }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#93c5fd' }}>Knowledge Check</p>
          <h3 className="text-base font-bold text-white mt-0.5">Platform Strategy Quiz</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(147,197,253,0.2)', color: '#93c5fd' }}>
            {current + 1} / {QUIZ_QUESTIONS.length}
          </span>
          {submitted && (
            <button onClick={reset} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80" style={{ background: 'rgba(147,197,253,0.2)', color: '#93c5fd' }}>
              <RotateCcw size={12} /> Retry
            </button>
          )}
        </div>
      </div>

      <div style={{ height: 4, background: 'rgba(37,99,235,0.1)' }}>
        <div style={{ width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #1d4ed8, #2563eb)', transition: 'width 0.3s ease', borderRadius: '0 2px 2px 0' }} />
      </div>

      {submitted ? (
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '📚' : '💪'}</div>
            <div className="text-3xl font-black mb-1" style={{ color: '#0b1220' }}>{score}/{QUIZ_QUESTIONS.length}</div>
            <div className="text-sm font-semibold" style={{ color: pct >= 70 ? '#059669' : '#d97706' }}>{pct}% correct</div>
            <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
              {pct === 100 ? 'Perfect score — you\'ve got the core mechanics down.' : pct >= 70 ? 'Solid work — a couple of concepts worth a second look.' : 'Worth another pass through the slides before the next session.'}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {QUIZ_QUESTIONS.map((qn, i) => {
              const ans = answers[i];
              const isRight = ans === qn.correct;
              return (
                <div key={i} className="rounded-xl p-4" style={{ background: isRight ? 'rgba(5,150,105,0.07)' : 'rgba(225,29,72,0.07)', border: `1.5px solid ${isRight ? 'rgba(5,150,105,0.2)' : 'rgba(225,29,72,0.2)'}` }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {isRight ? <CheckCircle size={16} style={{ color: '#059669' }} /> : <XCircle size={16} style={{ color: '#e11d48' }} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#1e293b' }}>Q{i + 1}: {qn.q}</p>
                      {!isRight && (
                        <p className="text-xs mb-1" style={{ color: '#e11d48' }}>Your answer: {qn.options[ans!]}</p>
                      )}
                      <p className="text-xs font-semibold mb-1" style={{ color: '#059669' }}>✓ {qn.options[qn.correct]}</p>
                      <p className="text-xs" style={{ color: '#6b7280' }}>{qn.explain}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <p className="text-sm font-semibold mb-4 leading-relaxed" style={{ color: '#0b1220' }}>{q.q}</p>
          <div className="flex flex-col gap-2 mb-5">
            {q.options.map((opt, i) => {
              const sel = answers[current] === i;
              const isCorrect = submitted && i === q.correct;
              const isWrong = submitted && sel && !isCorrect;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={submitted}
                  className="text-left px-4 py-3 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: isCorrect ? 'rgba(5,150,105,0.12)' : isWrong ? 'rgba(225,29,72,0.1)' : sel ? 'rgba(37,99,235,0.1)' : 'rgba(248,250,252,0.9)',
                    border: `1.5px solid ${isCorrect ? 'rgba(5,150,105,0.4)' : isWrong ? 'rgba(225,29,72,0.35)' : sel ? 'rgba(37,99,235,0.35)' : 'rgba(226,232,240,0.8)'}`,
                    color: isCorrect ? '#065f46' : isWrong ? '#9f1239' : sel ? '#0b1220' : '#374151',
                    cursor: submitted ? 'default' : 'pointer',
                  }}
                >
                  <span className="font-bold mr-2" style={{ color: isCorrect ? '#059669' : isWrong ? '#e11d48' : sel ? '#1d4ed8' : '#9ca3af' }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && !submitted && (
            <div className="rounded-xl px-4 py-3 mb-4" style={{ background: correct ? 'rgba(5,150,105,0.08)' : 'rgba(225,29,72,0.08)', border: `1.5px solid ${correct ? 'rgba(5,150,105,0.25)' : 'rgba(225,29,72,0.25)'}` }}>
              <p className="text-xs font-bold mb-1" style={{ color: correct ? '#059669' : '#e11d48' }}>
                {correct ? '✓ Correct!' : '✗ Not quite.'}
              </p>
              <p className="text-xs" style={{ color: '#6b7280' }}>{q.explain}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              className="text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-30"
              style={{ background: 'rgba(37,99,235,0.08)', color: '#1d4ed8' }}
            >
              ← Previous
            </button>
            <div className="flex gap-1.5">
              {QUIZ_QUESTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === current ? 20 : 8,
                    height: 8,
                    background: answers[i] !== null ? (submitted && answers[i] === QUIZ_QUESTIONS[i].correct ? '#059669' : submitted ? '#e11d48' : '#1d4ed8') : i === current ? '#1d4ed8' : 'rgba(37,99,235,0.2)',
                  }}
                />
              ))}
            </div>
            {current < QUIZ_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrent(c => c + 1)}
                className="text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                style={{ background: 'rgba(37,99,235,0.08)', color: '#1d4ed8' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                disabled={!allAnswered}
                className="text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-40"
                style={{ background: allAnswered ? '#1d4ed8' : 'rgba(37,99,235,0.15)', color: allAnswered ? '#fff' : '#1d4ed8' }}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function PlatformStrategyDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  useEffect(() => {
    const styleId = 'pfs-deck-styles';
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
      const { width } = wrap.getBoundingClientRect();
      const scale = width / 1920;
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
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrent(c => Math.max(c - 1, 0));
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
            style={{ borderColor: 'rgba(37,99,235,0.3)' }}
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
            style={{ borderColor: 'rgba(37,99,235,0.3)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <span className="text-xs font-medium text-gray-400 hidden sm:block">{slide.label}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(37,99,235,0.3)' }}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={fullscreen ? exitFs : goFs}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(37,99,235,0.3)' }}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="pfs relative w-full overflow-hidden rounded-xl"
        style={{ border: '1px solid rgba(37,99,235,0.3)' }}
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
              background: i === current ? '#1d4ed8' : 'rgba(37,99,235,0.25)',
            }}
          />
        ))}
      </div>

      {/* In-class activity */}
      <div className="mt-4">
        <div className="mb-3 px-1">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>In-Class Activity · Group of 4–6 · 40 Minutes</p>
          <h3 className="text-base font-bold mt-1" style={{ color: '#0b1220' }}>Find a Platform. Present It.</h3>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>5 min form groups · 25 min research online and build slides · 10 min present</p>
        </div>
        <GroupResearchActivity />
      </div>

      {/* Quiz section */}
      <div className="mt-4">
        <div className="mb-3 px-1">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>After the Slides</p>
          <h3 className="text-base font-bold mt-1" style={{ color: '#0b1220' }}>Test Your Understanding</h3>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>8 questions · Instant feedback · No data stored</p>
        </div>
        <PlatformQuiz />
      </div>
    </div>
  );
}
