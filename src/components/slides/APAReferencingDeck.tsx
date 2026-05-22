import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize, CheckCircle, XCircle, RotateCcw, Lock, Eye, EyeOff } from 'lucide-react';

const SESSION_KEY = 'apa-v7-unlocked';

const DECK_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

.apa *{box-sizing:border-box;margin:0;padding:0}
.apa{font-family:'Inter',sans-serif;
  --title:64px;--h2:48px;--body:32px;--small:26px;--tiny:22px;--micro:19px;
  --px:88px;--pt:68px;--pb:52px;--title-gap:30px;--item-gap:18px;
  --navy:#0f172a;--navy2:#1e1b4b;
  --indigo:#3730a3;--indigo2:#4338ca;--indigo3:#6366f1;--indigo-light:#e0e7ff;
  --purple:#7c3aed;--purple-light:#ede9fe;
  --amber:#b45309;--amber2:#d97706;--gold:#f59e0b;--gold-light:#fef3c7;
  --teal:#0d9488;--teal2:#14b8a6;--teal-light:#ccfbf1;
  --rose:#e11d48;--rose-light:#ffe4e6;
  --green:#059669;--green-light:#d1fae5;
  --slate:#475569;--white:#f8fafc;--off-white:#eef2ff
}
.apa section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:var(--pt) var(--px) var(--pb);background:var(--white);color:#1e293b}
.apa section.dark{background:var(--navy);color:#f1f5f9}
.apa section.dark-indigo{background:var(--navy2);color:#f1f5f9}
.apa section.warm{background:#fffbeb;color:#1e293b}
.apa section.slate-bg{background:#f1f5f9;color:#1e293b}

.apa .slide-title{font-size:var(--title);font-weight:800;line-height:1.08;letter-spacing:-0.025em;margin-bottom:var(--title-gap)}
.apa .slide-title .accent{color:var(--indigo2)}
.apa section.dark .slide-title .accent,.apa section.dark-indigo .slide-title .accent{color:#a5b4fc}
.apa .section-label{font-size:var(--small);font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--indigo2);margin-bottom:16px}
.apa section.dark .section-label,.apa section.dark-indigo .section-label{color:#a5b4fc}
.apa section.warm .section-label{color:var(--amber2)}

.apa .body{font-size:var(--body);line-height:1.55}
.apa .small{font-size:var(--small);line-height:1.5}
.apa .tiny{font-size:var(--tiny);line-height:1.5}
.apa .micro{font-size:var(--micro);line-height:1.5}

.apa .two-col{display:grid;grid-template-columns:1fr 1fr;gap:48px;flex:1;align-items:start}
.apa .two-col.eq{align-items:stretch}
.apa .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;flex:1;align-items:stretch}
.apa .four-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:24px;flex:1;align-items:stretch}
.apa .five-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:20px;flex:1;align-items:stretch}
.apa .two-row{display:grid;grid-template-rows:1fr 1fr;gap:24px;flex:1}

.apa .callout{border-radius:18px;padding:22px 30px;font-size:var(--body);line-height:1.55}
.apa .callout-indigo{background:var(--indigo-light);border-left:7px solid var(--indigo2)}
.apa .callout-amber{background:var(--gold-light);border-left:7px solid var(--gold)}
.apa .callout-teal{background:var(--teal-light);border-left:7px solid var(--teal)}
.apa .callout-rose{background:var(--rose-light);border-left:7px solid var(--rose)}
.apa .callout-green{background:var(--green-light);border-left:7px solid var(--green)}
.apa .callout-purple{background:var(--purple-light);border-left:7px solid var(--purple)}
.apa section.dark .callout-indigo{background:rgba(67,56,202,0.22);border-left-color:#818cf8;color:#c7d2fe}

.apa .badge{display:inline-block;font-size:var(--tiny);font-weight:700;padding:7px 22px;border-radius:999px;letter-spacing:0.04em}
.apa .badge-indigo{background:var(--indigo2);color:#fff}
.apa .badge-amber{background:var(--gold);color:#fff}
.apa .badge-teal{background:var(--teal);color:#fff}
.apa .badge-rose{background:var(--rose);color:#fff}
.apa .badge-green{background:var(--green);color:#fff}
.apa .badge-purple{background:var(--purple);color:#fff}
.apa .badge-ghost{background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.2)}

.apa table{border-collapse:collapse;font-size:var(--small);width:100%}
.apa th{background:var(--navy2);color:#fff;padding:14px 22px;text-align:left;font-weight:600;font-size:var(--tiny)}
.apa td{padding:12px 22px;border-bottom:1.5px solid #e2e8f0;vertical-align:middle;font-size:var(--tiny)}
.apa tr:nth-child(even) td{background:#f8fafc}
.apa tr:hover td{background:var(--indigo-light);transition:background 0.18s}
.apa .tbl-indigo th{background:var(--indigo2)}
.apa .tbl-dark th{background:#0f172a}
.apa .highlight-row td{background:#fef3c7 !important;font-weight:700}

.apa ul.check{list-style:none;display:flex;flex-direction:column;gap:10px}
.apa ul.check li{font-size:var(--small);line-height:1.5;padding-left:36px;position:relative}
.apa ul.check li::before{content:'✓';position:absolute;left:0;font-weight:800;color:var(--teal);font-size:var(--small)}
.apa section.dark ul.check li::before{color:#5eead4}
.apa ul.cross{list-style:none;display:flex;flex-direction:column;gap:10px}
.apa ul.cross li{font-size:var(--small);line-height:1.5;padding-left:36px;position:relative}
.apa ul.cross li::before{content:'✗';position:absolute;left:0;font-weight:800;color:var(--rose);font-size:var(--small)}

.apa .main-title{font-size:92px;font-weight:900;line-height:1.0;letter-spacing:-0.03em;color:#fff;margin-bottom:24px}
.apa .main-title .accent{color:#a5b4fc}
.apa .title-slide-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:1100px}
.apa .copyright{position:absolute;bottom:20px;left:0;right:0;text-align:center;font-size:18px;color:rgba(0,0,0,0.16);letter-spacing:0.04em}
.apa section.dark .copyright,.apa section.dark-indigo .copyright{color:rgba(255,255,255,0.16)}
.apa .deco-circle{position:absolute;border-radius:50%;pointer-events:none}

/* Interactive cite cards */
.apa .cite-card{border-radius:20px;padding:28px 26px;cursor:pointer;transition:all 0.28s cubic-bezier(0.34,1.56,0.64,1);border:2px solid rgba(99,102,241,0.15);background:rgba(255,255,255,0.85);user-select:none}
.apa .cite-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 16px 40px rgba(67,56,202,0.15);border-color:var(--indigo2)}
.apa .cite-card[data-revealed='true']{background:var(--indigo-light);border-color:var(--indigo2);transform:translateY(-4px);box-shadow:0 12px 32px rgba(67,56,202,0.2)}
.apa .cite-card .hint-text{font-size:var(--micro);color:var(--slate);margin-top:8px;opacity:0.7}
.apa .cite-card .reveal-content{display:none;margin-top:12px;padding-top:12px;border-top:1.5px dashed rgba(67,56,202,0.3);font-size:var(--micro);color:var(--indigo);font-weight:600;line-height:1.5}
.apa .cite-card[data-revealed='true'] .reveal-content{display:block}
.apa .cite-card[data-revealed='true'] .hint-text{display:none}

/* Mistake cards */
.apa .mistake-card{border-radius:18px;padding:22px 20px;cursor:pointer;transition:all 0.25s;background:rgba(255,255,255,0.9);border:2px solid rgba(225,29,72,0.15);user-select:none}
.apa .mistake-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(225,29,72,0.12);border-color:var(--rose)}
.apa .mistake-card[data-open='true']{background:var(--rose-light);border-color:var(--rose);transform:translateY(-4px);box-shadow:0 12px 28px rgba(225,29,72,0.18)}
.apa .mistake-card .fix{display:none;margin-top:10px;padding-top:10px;border-top:1.5px dashed rgba(225,29,72,0.3);font-size:var(--micro);color:#9f1239;line-height:1.5}
.apa .mistake-card[data-open='true'] .fix{display:block}
.apa .mistake-title{font-size:var(--tiny);font-weight:700;color:#1e293b;line-height:1.3}
.apa .mistake-card[data-open='true'] .mistake-title{color:#9f1239}

/* Code/citation blocks */
.apa .code-block{background:#1e293b;border-radius:16px;padding:26px 34px;font-family:'Courier New',monospace;font-size:var(--small);color:#e2e8f0;line-height:1.7;position:relative}
.apa .code-label{position:absolute;top:-14px;left:20px;background:var(--indigo2);color:white;font-family:'Inter',sans-serif;font-size:var(--micro);font-weight:700;padding:4px 18px;border-radius:999px;letter-spacing:0.06em}
.apa .ca{color:#a5b4fc}
.apa .cy{color:#fbbf24}
.apa .cp{color:#5eead4}
.apa .ct{color:#f9a8d4;font-style:italic}
.apa .cj{color:#86efac;font-style:italic}
.apa .cd{color:#fb923c}

/* Annotation labels */
.apa .ann{position:absolute;font-size:18px;font-weight:700;font-family:'Inter',sans-serif;white-space:nowrap;pointer-events:none}
.apa .ann-line{position:absolute;border:2px dashed;pointer-events:none}

/* Reference anatomy */
.apa .ref-part{display:inline;border-radius:6px;padding:2px 8px;cursor:pointer;transition:all 0.2s;position:relative}
.apa .ref-part:hover{filter:brightness(0.92);transform:scale(1.02)}
.apa .who-part{background:#ddd6fe;color:#4c1d95}
.apa .when-part{background:#fef3c7;color:#92400e}
.apa .what-part{background:#ccfbf1;color:#134e4a}
.apa .where-part{background:#ffe4e6;color:#9f1239}

/* Flow diagram */
.apa .flow-box{border-radius:24px;padding:32px 28px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;position:relative}
.apa .flow-box.in-text{background:linear-gradient(135deg,rgba(67,56,202,0.15),rgba(99,102,241,0.08));border:2.5px solid rgba(67,56,202,0.4)}
.apa .flow-box.ref-list{background:linear-gradient(135deg,rgba(13,148,136,0.15),rgba(20,184,166,0.08));border:2.5px solid rgba(13,148,136,0.4)}
.apa .flow-icon{font-size:52px;line-height:1}
.apa .flow-title{font-size:var(--body);font-weight:800;color:#fff}
.apa .flow-desc{font-size:var(--small);color:rgba(255,255,255,0.6);line-height:1.5}

/* Scenario compare */
.apa .scenario{border-radius:22px;padding:30px 34px;flex:1;display:flex;flex-direction:column;gap:14px}
.apa .scenario.bad{background:linear-gradient(135deg,rgba(254,226,226,0.95),rgba(252,165,165,0.45));border:2px solid rgba(239,68,68,0.3)}
.apa .scenario.good{background:linear-gradient(135deg,rgba(209,250,229,0.95),rgba(167,243,208,0.45));border:2px solid rgba(5,150,105,0.3)}
.apa .scenario-tag{font-size:var(--tiny);font-weight:800;letter-spacing:0.08em;text-transform:uppercase}
.apa .bad .scenario-tag{color:#dc2626}
.apa .good .scenario-tag{color:#059669}
.apa .scenario-quote{font-family:'Lora',serif;font-size:var(--small);font-style:italic;line-height:1.65;color:#334155}
.apa .scenario-note{font-size:var(--micro);font-weight:500;color:#64748b;margin-top:8px}
.apa .bad .scenario-note{color:#991b1b}
.apa .good .scenario-note{color:#065f46}

/* Pillar cards */
.apa .pillar{border-radius:24px;padding:34px 28px;display:flex;flex-direction:column;gap:14px;flex:1}
.apa .pillar-icon{font-size:54px;line-height:1}
.apa .pillar-title{font-size:var(--body);font-weight:800}
.apa .pillar-body{font-size:var(--small);line-height:1.55;opacity:0.85}

/* Animations */
@keyframes apa-fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes apa-pulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)}70%{box-shadow:0 0 0 22px rgba(99,102,241,0)}}
@keyframes apa-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes apa-glow{0%,100%{opacity:0.5}50%{opacity:1}}
@keyframes apa-bounce{0%,100%{transform:translateX(0)}25%{transform:translateX(8px)}75%{transform:translateX(-8px)}}

.apa .fu{animation:apa-fadeUp 0.55s ease-out both}
.apa .fu1{animation:apa-fadeUp 0.55s 0.1s ease-out both}
.apa .fu2{animation:apa-fadeUp 0.55s 0.22s ease-out both}
.apa .fu3{animation:apa-fadeUp 0.55s 0.36s ease-out both}
.apa .fu4{animation:apa-fadeUp 0.55s 0.5s ease-out both}
.apa .fu5{animation:apa-fadeUp 0.55s 0.64s ease-out both}
.apa .fu6{animation:apa-fadeUp 0.55s 0.78s ease-out both}
.apa .pulse-ring{animation:apa-pulse 2.2s ease-out infinite}
.apa .float{animation:apa-float 3s ease-in-out infinite}
.apa .glow{animation:apa-glow 2s ease-in-out infinite}

/* Step list */
.apa .step-list{display:flex;flex-direction:column;gap:16px}
.apa .step{display:flex;gap:18px;align-items:flex-start}
.apa .step-num{width:44px;height:44px;border-radius:50%;background:var(--indigo2);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;margin-top:2px}
.apa .step-text{font-size:var(--small);line-height:1.5;flex:1}
`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  // ── 1. Title ──────────────────────────────────────────────────────────────
  {
    classes: 'dark-indigo',
    label: '1 APA 7 – Introduction',
    html: `
    <div class="deco-circle" style="width:820px;height:820px;background:radial-gradient(circle,rgba(99,102,241,0.22) 0%,transparent 70%);right:-180px;top:-220px;"></div>
    <div class="deco-circle" style="width:560px;height:560px;background:radial-gradient(circle,rgba(245,158,11,0.14) 0%,transparent 70%);left:-100px;bottom:-120px;"></div>
    <div class="deco-circle float" style="width:200px;height:200px;background:radial-gradient(circle,rgba(165,180,252,0.18) 0%,transparent 70%);left:40%;top:10%;"></div>
    <div class="title-slide-inner fu">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:38px;">
        <div style="display:flex;gap:8px;align-items:center;">
          <div style="width:56px;height:7px;background:#818cf8;border-radius:4px;"></div>
          <div style="width:28px;height:7px;background:#f59e0b;border-radius:4px;"></div>
          <div style="width:14px;height:7px;background:#5eead4;border-radius:4px;"></div>
        </div>
        <span style="font-size:var(--small);font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#a5b4fc;">General Resources · Academic Writing Skills</span>
      </div>
      <div class="main-title">APA <span class="accent">7</span><br/>Citations</div>
      <p style="font-size:44px;color:rgba(255,255,255,0.55);margin-bottom:44px;font-weight:300;font-family:'Lora',serif;font-style:italic;">The Crash Course</p>
      <p style="font-size:var(--body);color:rgba(255,255,255,0.48);max-width:920px;line-height:1.65;margin-bottom:50px;">Everything you need to cite correctly — from the first in-text citation to the last reference entry. Built for your assignments. No textbooks required.</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <span class="badge badge-ghost">14 Slides</span>
        <span class="badge badge-amber">Interactive Examples</span>
        <span class="badge badge-teal">Reference Templates</span>
        <span class="badge badge-purple">Practice Quiz Included</span>
      </div>
    </div>
    <div style="position:absolute;right:var(--px);top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:24px;opacity:0.18;">
      <div style="width:140px;height:140px;border-radius:28px;border:3px solid #a5b4fc;display:flex;align-items:center;justify-content:center;font-size:72px;">📖</div>
      <div style="width:140px;height:140px;border-radius:28px;border:3px solid #f59e0b;display:flex;align-items:center;justify-content:center;font-size:72px;">✍️</div>
      <div style="width:140px;height:140px;border-radius:28px;border:3px solid #5eead4;display:flex;align-items:center;justify-content:center;font-size:72px;">🎓</div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 2. Why Cite? ──────────────────────────────────────────────────────────
  {
    classes: '',
    label: '2 Why Even Cite?',
    html: `
    <div class="section-label">The Foundation</div>
    <div class="slide-title">Why Even <span class="accent">Bother</span> Citing?</div>
    <div class="three-col">
      <div class="pillar fu1" style="background:linear-gradient(135deg,rgba(224,231,255,0.9),rgba(199,210,254,0.5));border:2px solid rgba(99,102,241,0.25);">
        <div class="pillar-icon">🛡️</div>
        <div class="pillar-title" style="color:var(--indigo2);">They Protect You</div>
        <div class="pillar-body" style="color:#334155;">Using someone's idea without credit is <strong>plagiarism</strong> — even accidentally. A citation is your proof you know the difference between your thinking and someone else's. No citation = no defence.</div>
        <div style="margin-top:auto;padding:12px 18px;background:rgba(67,56,202,0.1);border-radius:12px;font-size:var(--micro);color:var(--indigo2);font-weight:600;">Academic integrity shield</div>
      </div>
      <div class="pillar fu2" style="background:linear-gradient(135deg,rgba(204,251,241,0.9),rgba(153,246,228,0.5));border:2px solid rgba(13,148,136,0.25);">
        <div class="pillar-icon">💪</div>
        <div class="pillar-title" style="color:var(--teal);">They Strengthen You</div>
        <div class="pillar-body" style="color:#334155;"><em>"Immersion increases presence"</em> — opinion.<br/><br/><em>"Immersion increases presence (Slater, 2009)"</em> — claim backed by a decade of VR research.<br/><br/>Same sentence. <strong>Completely different weight.</strong></div>
        <div style="margin-top:auto;padding:12px 18px;background:rgba(13,148,136,0.1);border-radius:12px;font-size:var(--micro);color:var(--teal);font-weight:600;">Evidence = credibility</div>
      </div>
      <div class="pillar fu3" style="background:linear-gradient(135deg,rgba(254,243,199,0.9),rgba(253,230,138,0.5));border:2px solid rgba(245,158,11,0.3);">
        <div class="pillar-icon">💬</div>
        <div class="pillar-title" style="color:var(--amber2);">They Invite Conversation</div>
        <div class="pillar-body" style="color:#334155;">Academic writing isn't a monologue — it's you <strong>positioning your ideas</strong> within an ongoing scholarly debate. Citations show you've been listening, and you know who said what first.</div>
        <div style="margin-top:auto;padding:12px 18px;background:rgba(217,119,6,0.1);border-radius:12px;font-size:var(--micro);color:var(--amber2);font-weight:600;">Join the scholarly conversation</div>
      </div>
    </div>
    <div class="callout callout-indigo fu4" style="margin-top:24px;">
      <strong>The "says who?" test:</strong> Imagine your examiner asking <em>"says who?"</em> after every claim you make. Citations are your answer. Without them, you're just asserting things into the void.
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 3. Cite vs No-Cite Comparison ─────────────────────────────────────────
  {
    classes: 'slate-bg',
    label: '3 Citation vs No Citation',
    html: `
    <div class="section-label">Real Impact</div>
    <div class="slide-title">Same Sentence. <span class="accent">Different Weight.</span></div>
    <div class="two-col eq" style="gap:40px;flex:1;">
      <div class="scenario bad fu1">
        <div class="scenario-tag">❌ Without citation</div>
        <div class="scenario-quote">"Scientists say coffee makes you smarter."</div>
        <div style="margin-top:16px;padding:16px 20px;background:rgba(239,68,68,0.1);border-radius:14px;">
          <p style="font-size:var(--tiny);color:#7f1d1d;font-weight:600;margin-bottom:8px;">What happens:</p>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
            <li style="font-size:var(--micro);color:#991b1b;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">⚠️</span> Examiner asks: <em>"Which scientists? Where? When?"</em></li>
            <li style="font-size:var(--micro);color:#991b1b;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">⚠️</span> Sounds like an unverified social media claim</li>
            <li style="font-size:var(--micro);color:#991b1b;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">⚠️</span> Could be penalised for unsupported assertion</li>
            <li style="font-size:var(--micro);color:#991b1b;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">⚠️</span> If it's someone else's idea — this is plagiarism</li>
          </ul>
        </div>
        <div class="scenario-note">Your friend (the examiner) is far less forgiving.</div>
      </div>
      <div class="scenario good fu2">
        <div class="scenario-tag">✅ With citation</div>
        <div class="scenario-quote">"Caffeine consumption has been associated with enhanced cognitive performance in controlled studies (Smith et al., 2021, p. 14)."</div>
        <div style="margin-top:16px;padding:16px 20px;background:rgba(5,150,105,0.1);border-radius:14px;">
          <p style="font-size:var(--tiny);color:#064e3b;font-weight:600;margin-bottom:8px;">What happens:</p>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
            <li style="font-size:var(--micro);color:#065f46;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">✅</span> Reader can verify the source independently</li>
            <li style="font-size:var(--micro);color:#065f46;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">✅</span> Shows engagement with academic literature</li>
            <li style="font-size:var(--micro);color:#065f46;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">✅</span> Demonstrates scholarly credibility</li>
            <li style="font-size:var(--micro);color:#065f46;padding-left:24px;position:relative;"><span style="position:absolute;left:0;">✅</span> You are protected against plagiarism accusation</li>
          </ul>
        </div>
        <div class="scenario-note">Same idea. Now it's a <strong>verifiable academic claim.</strong></div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 4. When TO Cite (interactive) ─────────────────────────────────────────
  {
    classes: '',
    label: '4 When TO Cite (Interactive)',
    html: `
    <div class="section-label">Rule 1 of 2</div>
    <div class="slide-title">When <span class="accent">TO</span> Cite <span style="font-size:var(--small);font-weight:500;color:var(--slate);"> — click each card to reveal why</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;flex:1;">
      <div class="cite-card fu1" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">📊</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Facts, statistics &amp; findings</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Any fact that came from a specific study, dataset, or report. Even if widely known <em>within your field</em>, if it has a source — cite it. E.g. "87% of Agile teams use Scrum" needs the State of Agile report.</div>
      </div>
      <div class="cite-card fu2" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">💡</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Arguments &amp; theories</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Someone else's argument, model, or framework. Even if you're paraphrasing it — you're using their intellectual work. Presence theory (Witmer &amp; Singer), Agile Manifesto, TAM model — all need citations.</div>
      </div>
      <div class="cite-card fu3" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">📖</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Definitions</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Especially contested or field-specific definitions. "Presence is defined as..." is someone's definition — whose? Even for widely agreed terms, citing the first/key theorist shows depth and awareness.</div>
      </div>
      <div class="cite-card fu4" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">💬</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Direct quotes</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Obviously. Any word-for-word text from a source requires quote marks + author + year + page number. Even a single distinctive phrase taken verbatim needs a page-level citation.</div>
      </div>
      <div class="cite-card fu5" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">📏</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Scales &amp; instruments</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Surveys, questionnaires, measurement scales, or research instruments designed by others. The Presence Questionnaire, SUS, TAM scales — all have original authors who must be credited.</div>
      </div>
      <div class="cite-card fu6" onclick="this.setAttribute('data-revealed','true')">
        <div style="font-size:44px;margin-bottom:10px;">✍️</div>
        <div style="font-size:var(--small);font-weight:700;color:#1e293b;">Your own prior work</div>
        <div class="hint-text">Click to reveal →</div>
        <div class="reveal-content">Yes — even your own previously published work. Reusing your own ideas without citing yourself is called <strong>self-plagiarism</strong>. If you published it elsewhere, treat it like any other source.</div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 5. When NOT to Cite ───────────────────────────────────────────────────
  {
    classes: 'warm',
    label: '5 When NOT to Cite',
    html: `
    <div class="section-label">Rule 2 of 2</div>
    <div class="slide-title">When <span class="accent" style="color:var(--amber2);">NOT</span> to Cite</div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="callout callout-amber fu1">
          <strong>Over-citing</strong> clutters your writing and actually signals <em>low confidence</em> — it looks like you can't tell what's common knowledge and what isn't.
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;" class="fu2">
          <div style="display:flex;gap:16px;align-items:flex-start;padding:18px 22px;background:rgba(255,255,255,0.8);border-radius:16px;border:2px solid rgba(245,158,11,0.25);">
            <span style="font-size:36px;flex-shrink:0;">🌐</span>
            <div>
              <div style="font-size:var(--small);font-weight:700;color:#92400e;">Common knowledge</div>
              <div style="font-size:var(--micro);color:#78350f;margin-top:4px;">"The internet is widely used" — no citation needed. Any reasonably educated person already knows this.</div>
            </div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;padding:18px 22px;background:rgba(255,255,255,0.8);border-radius:16px;border:2px solid rgba(245,158,11,0.25);">
            <span style="font-size:36px;flex-shrink:0;">🔢</span>
            <div>
              <div style="font-size:var(--small);font-weight:700;color:#92400e;">Mathematical or logical facts</div>
              <div style="font-size:var(--micro);color:#78350f;margin-top:4px;">"The sample had 24 participants split into 4 groups of 6" — this is your own arithmetic. No source needed.</div>
            </div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;" class="fu3">
        <div style="display:flex;gap:16px;align-items:flex-start;padding:18px 22px;background:rgba(255,255,255,0.8);border-radius:16px;border:2px solid rgba(245,158,11,0.25);">
          <span style="font-size:36px;flex-shrink:0;">🧠</span>
          <div>
            <div style="font-size:var(--small);font-weight:700;color:#92400e;">Your own original analysis</div>
            <div style="font-size:var(--micro);color:#78350f;margin-top:4px;">Your interpretation, argument, and conclusions are <em>your contribution</em>. Don't undercut it by citing someone else — own it.</div>
          </div>
        </div>
        <div style="display:flex;gap:16px;align-items:flex-start;padding:18px 22px;background:rgba(255,255,255,0.8);border-radius:16px;border:2px solid rgba(245,158,11,0.25);">
          <span style="font-size:36px;flex-shrink:0;">🔬</span>
          <div>
            <div style="font-size:var(--small);font-weight:700;color:#92400e;">Your own firsthand observations</div>
            <div style="font-size:var(--micro);color:#78350f;margin-top:4px;">Things you observed, measured, or found in your own study. "Participants reported feeling dizzy" — this is your data.</div>
          </div>
        </div>
        <div style="padding:22px 26px;background:linear-gradient(135deg,rgba(180,83,9,0.12),rgba(217,119,6,0.08));border-radius:18px;border:2px solid rgba(217,119,6,0.3);">
          <div style="font-size:var(--small);font-weight:800;color:#92400e;margin-bottom:10px;">🎯 The Test</div>
          <div style="font-size:var(--tiny);color:#78350f;line-height:1.6;">Would a <strong>reasonable person in your field</strong> consider this general knowledge? If yes → no citation. If there's any doubt → cite it. When in doubt, cite.</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 6. The Core Rule ──────────────────────────────────────────────────────
  {
    classes: 'dark',
    label: '6 The Core Rule',
    html: `
    <div class="deco-circle" style="width:700px;height:700px;background:radial-gradient(circle,rgba(99,102,241,0.16) 0%,transparent 70%);right:-120px;top:-160px;"></div>
    <div class="section-label">The Golden Rule</div>
    <div class="slide-title">One In-Text → <span class="accent">One Entry.</span> Always.</div>
    <div style="display:flex;gap:48px;flex:1;align-items:center;">
      <div style="flex:1;display:flex;flex-direction:column;gap:20px;" class="fu1">
        <div style="padding:28px 32px;background:rgba(255,255,255,0.05);border-radius:24px;border:2px solid rgba(165,180,252,0.25);">
          <div style="font-size:var(--h2);font-weight:900;color:#e2e8f0;line-height:1.2;margin-bottom:16px;">Every in-text citation has exactly <span style="color:#a5b4fc;">one</span> matching entry in the reference list.</div>
          <div style="font-size:var(--body);color:rgba(255,255,255,0.5);line-height:1.6;">Every reference list entry is cited <span style="color:#5eead4;">somewhere</span> in the text. No orphans. No extras.</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div style="padding:18px 22px;background:rgba(225,29,72,0.1);border-radius:16px;border:1.5px solid rgba(225,29,72,0.3);">
            <div style="font-size:var(--tiny);font-weight:800;color:#fb7185;margin-bottom:8px;">❌ ORPHAN</div>
            <div style="font-size:var(--micro);color:rgba(255,255,255,0.5);line-height:1.5;">A reference list entry with no matching in-text citation. You read it, but never cited it. Remove it — APA is not a bibliography.</div>
          </div>
          <div style="padding:18px 22px;background:rgba(225,29,72,0.1);border-radius:16px;border:1.5px solid rgba(225,29,72,0.3);">
            <div style="font-size:var(--tiny);font-weight:800;color:#fb7185;margin-bottom:8px;">❌ GHOST</div>
            <div style="font-size:var(--micro);color:rgba(255,255,255,0.5);line-height:1.5;">An in-text citation (Brown, 2021) with no matching reference list entry. Always fatal — the reader can't find the source.</div>
          </div>
        </div>
      </div>
      <div style="flex:0 0 520px;display:flex;flex-direction:column;align-items:center;gap:20px;" class="fu2">
        <div class="flow-box in-text pulse-ring" style="width:100%;padding:36px 32px;">
          <div class="flow-icon">📝</div>
          <div class="flow-title">In-Text Citation</div>
          <div class="flow-desc">(Slater, 2009, p. 12)<br/>Smith and Jones (2021)</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0.6;">
          <div style="width:4px;height:28px;background:rgba(255,255,255,0.3);border-radius:2px;"></div>
          <div style="font-size:36px;color:rgba(255,255,255,0.4);">↕</div>
          <div style="font-size:var(--micro);color:rgba(255,255,255,0.35);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">One-to-one match</div>
          <div style="width:4px;height:28px;background:rgba(255,255,255,0.3);border-radius:2px;"></div>
        </div>
        <div class="flow-box ref-list" style="width:100%;padding:36px 32px;">
          <div class="flow-icon">📚</div>
          <div class="flow-title">Reference List Entry</div>
          <div class="flow-desc">Slater, M. (2009). Place illusion...<br/><em>Phil. Trans. R. Soc. B</em>, 364...</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 7. Two Flavours ───────────────────────────────────────────────────────
  {
    classes: '',
    label: '7 In-Text: Two Flavours',
    html: `
    <div class="section-label">In-Text Citations</div>
    <div class="slide-title">Two <span class="accent">Flavours</span> of In-Text Citation</div>
    <div class="two-col eq" style="gap:44px;flex:1;">
      <div style="display:flex;flex-direction:column;gap:20px;" class="fu1">
        <div style="padding:22px 28px;background:linear-gradient(135deg,rgba(224,231,255,0.9),rgba(199,210,254,0.5));border-radius:20px;border:2px solid rgba(99,102,241,0.3);">
          <div style="font-size:var(--small);font-weight:800;color:var(--indigo2);margin-bottom:4px;">1 — Parenthetical</div>
          <div style="font-size:var(--micro);color:var(--slate);">Citation lives in brackets at the end</div>
        </div>
        <div class="code-block">
          <div class="code-label">EXAMPLE</div>
          Virtual environments have been shown to enhance spatial memory <span class="ca">(Bowman &amp; McMahan, 2007)</span>.
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="padding:16px 20px;background:rgba(99,102,241,0.06);border-radius:14px;border:1.5px solid rgba(99,102,241,0.15);">
            <div style="font-size:var(--tiny);font-weight:700;color:var(--indigo2);margin-bottom:6px;">📌 Use this when:</div>
            <div style="font-size:var(--micro);color:var(--slate);line-height:1.5;">The <strong>idea</strong> matters more than the person who said it. You're reporting a finding, not engaging with a specific author's argument.</div>
          </div>
          <div style="padding:16px 20px;background:rgba(99,102,241,0.06);border-radius:14px;border:1.5px solid rgba(99,102,241,0.15);">
            <div style="font-size:var(--tiny);font-weight:700;color:var(--indigo2);margin-bottom:6px;">📐 Format:</div>
            <div style="font-size:var(--micro);color:var(--slate);font-family:'Courier New',monospace;">(Author, Year) or (Author, Year, p. N)</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px;" class="fu2">
        <div style="padding:22px 28px;background:linear-gradient(135deg,rgba(204,251,241,0.9),rgba(153,246,228,0.5));border-radius:20px;border:2px solid rgba(13,148,136,0.3);">
          <div style="font-size:var(--small);font-weight:800;color:var(--teal);margin-bottom:4px;">2 — Narrative</div>
          <div style="font-size:var(--micro);color:var(--slate);">Author is part of your sentence, year follows in brackets</div>
        </div>
        <div class="code-block">
          <div class="code-label">EXAMPLE</div>
          <span class="ca">Bowman and McMahan</span> <span class="cy">(2007)</span> demonstrated that virtual environments enhance spatial memory.
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="padding:16px 20px;background:rgba(13,148,136,0.06);border-radius:14px;border:1.5px solid rgba(13,148,136,0.2);">
            <div style="font-size:var(--tiny);font-weight:700;color:var(--teal);margin-bottom:6px;">📌 Use this when:</div>
            <div style="font-size:var(--micro);color:var(--slate);line-height:1.5;">You're specifically engaging with <strong>who</strong> said something. You're introducing their argument, critiquing it, or contrasting it with another author's view.</div>
          </div>
          <div style="padding:16px 20px;background:rgba(13,148,136,0.06);border-radius:14px;border:1.5px solid rgba(13,148,136,0.2);">
            <div style="font-size:var(--tiny);font-weight:700;color:var(--teal);margin-bottom:6px;">📐 Format:</div>
            <div style="font-size:var(--micro);color:var(--slate);font-family:'Courier New',monospace;">Author (Year) verb... or Author and Author (Year)...</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 8. Author-Year Cheat Sheet ────────────────────────────────────────────
  {
    classes: 'slate-bg',
    label: '8 Author–Year Cheat Sheet',
    html: `
    <div class="section-label">Quick Reference</div>
    <div class="slide-title">The Author–Year <span class="accent">Cheat Sheet</span></div>
    <table class="tbl-indigo fu1" style="flex:1;">
      <thead>
        <tr>
          <th style="width:34%;">Situation</th>
          <th style="width:40%;">Format</th>
          <th style="width:26%;">Example</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1 author</td><td>(Author, Year)</td><td>(Slater, 2009)</td></tr>
        <tr><td>2 authors</td><td>(Author &amp; Author, Year)</td><td>(Slater &amp; Sanchez-Vives, 2016)</td></tr>
        <tr class="highlight-row"><td>⭐ 3+ authors <span style="font-size:15px;font-weight:800;color:#92400e;"> APA 7 change!</span></td><td>First author + et al., from first use</td><td>(Cummings et al., 2020)</td></tr>
        <tr><td>Organisation (first mention)</td><td>(Full Name [ABBR], Year)</td><td>(World Health Organization [WHO], 2022)</td></tr>
        <tr><td>Organisation (subsequent)</td><td>(Abbreviation, Year)</td><td>(WHO, 2022)</td></tr>
        <tr><td>No date available</td><td>(Author, n.d.)</td><td>(Smith, n.d.)</td></tr>
        <tr><td>Same author, same year</td><td>(Author, Yeara, Yearb)</td><td>(Brown, 2021a, 2021b)</td></tr>
        <tr><td>Multiple sources together</td><td>(Auth1 &amp; Auth2, Year; Auth3, Year)</td><td>(Milgram &amp; Kishino, 1994; Witmer &amp; Singer, 1998)</td></tr>
        <tr><td>Direct quote</td><td>(Author, Year, p. N)</td><td>(Witmer &amp; Singer, 1998, p. 225)</td></tr>
      </tbody>
    </table>
    <div style="margin-top:18px;padding:14px 22px;background:linear-gradient(135deg,rgba(254,243,199,0.95),rgba(253,230,138,0.6));border-radius:14px;border:2px solid rgba(245,158,11,0.4);" class="fu2">
      <span style="font-size:var(--tiny);font-weight:800;color:#92400e;">⭐ APA 7 key change:</span><span style="font-size:var(--tiny);color:#78350f;"> Three or more authors → use <strong>et al.</strong> from the very FIRST citation. APA 6 made you write all names up to 5 authors first. That rule is gone.</span>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 9. Short Quotes ───────────────────────────────────────────────────────
  {
    classes: '',
    label: '9 Short Quotes (Under 40 Words)',
    html: `
    <div class="section-label">Direct Quotation · Part 1</div>
    <div class="slide-title">Short Quotes: <span class="accent">Under 40 Words</span></div>
    <div style="display:flex;flex-direction:column;gap:28px;flex:1;">
      <div style="display:flex;gap:32px;align-items:stretch;" class="fu1">
        <div style="flex:1;padding:32px 36px;background:linear-gradient(135deg,rgba(224,231,255,0.7),rgba(199,210,254,0.35));border-radius:22px;border:2.5px solid rgba(99,102,241,0.25);font-family:'Lora',serif;font-size:var(--small);font-style:italic;line-height:1.75;color:#1e293b;position:relative;">
          <span style="color:var(--indigo2);font-size:60px;line-height:0;vertical-align:-20px;font-weight:900;">"</span>Presence is defined as
          <span style="background:#ddd6fe;border-radius:4px;padding:1px 6px;font-style:normal;font-size:var(--tiny);font-weight:600;color:#4c1d95;">the subjective experience of being in one place or environment, even when one is physically situated in another</span>
          <span style="color:var(--indigo2);font-size:60px;line-height:0;vertical-align:-20px;font-weight:900;">"</span>
          <span style="font-style:normal;font-size:var(--tiny);color:var(--slate);"> (<span style="color:var(--indigo2);font-weight:700;">Witmer &amp; Singer</span>, <span style="color:var(--amber2);font-weight:700;">1998</span>, p. <span style="color:var(--teal);font-weight:700;">225</span>).</span>
        </div>
      </div>
      <div class="two-col fu2" style="gap:24px;flex:none;">
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:var(--small);font-weight:800;color:var(--indigo2);margin-bottom:4px;">✅ Format Rules</div>
          <ul class="check">
            <li>Quotation marks around the exact words</li>
            <li>Inline — <em>do not</em> break to a new paragraph</li>
            <li>Page number is required (<span style="font-family:'Courier New';font-size:22px;">p. 225</span>)</li>
            <li>Citation at end, before the full stop</li>
          </ul>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:var(--small);font-weight:800;color:var(--rose);margin-bottom:4px;">❌ Common Errors</div>
          <ul class="cross">
            <li>Missing page number on a direct quote</li>
            <li>Using a block quote format for under 40 words</li>
            <li>Altering words inside the quote without [brackets]</li>
            <li>Overusing quotes — paraphrase instead</li>
          </ul>
        </div>
      </div>
      <div class="callout callout-amber fu3">
        <strong>Honest advice:</strong> Your examiner wants to see you <em>synthesise</em> ideas, not collect them. Use direct quotes only when the exact wording matters — definitions, key terms, pivotal statements. A paraphrase that cites correctly shows more skill.
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 10. Block Quotes ──────────────────────────────────────────────────────
  {
    classes: 'dark',
    label: '10 Block Quotes (40+ Words)',
    html: `
    <div class="deco-circle" style="width:500px;height:500px;background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%);right:-80px;bottom:-80px;"></div>
    <div class="section-label">Direct Quotation · Part 2</div>
    <div class="slide-title">Block Quotes: <span class="accent">40+ Words</span></div>
    <div style="display:flex;gap:40px;flex:1;" class="fu1">
      <div style="flex:1.1;display:flex;flex-direction:column;gap:20px;">
        <div style="padding:28px 36px;background:rgba(255,255,255,0.05);border:2px solid rgba(165,180,252,0.25);border-radius:20px;">
          <div style="font-size:var(--tiny);font-weight:700;color:#a5b4fc;margin-bottom:14px;">Slater (2018) argued:</div>
          <div style="padding-left:48px;border-left:4px solid rgba(165,180,252,0.4);">
            <p style="font-family:'Lora',serif;font-size:var(--small);font-style:italic;color:rgba(255,255,255,0.8);line-height:1.75;">The concept of presence is not simply about visual fidelity but rather about the degree to which the virtual environment responds to the actions of the participant. A high-fidelity environment that does not react to user input will produce lower presence than a lower-fidelity, richly interactive one. <span style="font-style:normal;font-size:var(--micro);color:rgba(165,180,252,0.8);">(p. 431)</span></p>
          </div>
        </div>
        <div style="padding:18px 22px;background:rgba(245,158,11,0.12);border-radius:14px;border:1.5px solid rgba(245,158,11,0.3);">
          <div style="font-size:var(--tiny);font-weight:700;color:#fbbf24;margin-bottom:6px;">📌 Format note</div>
          <div style="font-size:var(--micro);color:rgba(255,255,255,0.6);line-height:1.5;">The author + year introduce the quote (narrative style), then the page number appears in brackets <em>after</em> the final full stop — not before it. This is reversed from short quotes.</div>
        </div>
      </div>
      <div style="flex:0.9;display:flex;flex-direction:column;gap:18px;" class="fu2">
        <div style="font-size:var(--small);font-weight:800;color:#a5b4fc;margin-bottom:4px;">Block Quote Rules</div>
        <ul class="check">
          <li>New paragraph for the quote</li>
          <li>Indent the entire block (0.5 inch / ~1.27 cm)</li>
          <li>No quotation marks</li>
          <li>Page number in brackets after the final stop</li>
          <li>Introduce with a colon or "X argued:" or "According to X (Year):"</li>
        </ul>
        <div style="margin-top:8px;padding:20px 24px;background:rgba(99,102,241,0.15);border-radius:16px;border:1.5px solid rgba(165,180,252,0.25);">
          <div style="font-size:var(--tiny);font-weight:800;color:#a5b4fc;margin-bottom:8px;">Short vs Block at a glance</div>
          <table style="font-size:var(--micro);color:rgba(255,255,255,0.7);border:none;">
            <tr><td style="border:none;padding:5px 12px 5px 0;font-weight:600;color:#a5b4fc;">Under 40 words</td><td style="border:none;padding:5px 0;">Inline, quotation marks, citation before the stop</td></tr>
            <tr><td style="border:none;padding:5px 12px 5px 0;font-weight:600;color:#fbbf24;">40+ words</td><td style="border:none;padding:5px 0;">Indented block, no quotes, citation <em>after</em> the stop</td></tr>
          </table>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 11. Building a Reference Entry ────────────────────────────────────────
  {
    classes: '',
    label: '11 Building a Reference Entry',
    html: `
    <div class="section-label">Reference Construction</div>
    <div class="slide-title">Every Reference Has <span class="accent">Four Parts</span></div>
    <div style="display:flex;flex-direction:column;gap:28px;flex:1;">
      <div class="four-col fu1" style="gap:20px;flex:none;">
        <div style="border-radius:22px;padding:26px 22px;background:linear-gradient(135deg,rgba(221,214,254,0.9),rgba(196,181,253,0.5));border:2px solid rgba(124,58,237,0.3);display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
          <div style="font-size:52px;">👤</div>
          <div style="font-size:var(--body);font-weight:900;color:#4c1d95;">WHO</div>
          <div style="font-size:var(--micro);color:#5b21b6;line-height:1.5;">Last name, Initials.<br/>For multiple: Last, I., &amp; Last, I.</div>
          <div style="background:rgba(124,58,237,0.15);border-radius:10px;padding:8px 14px;font-size:19px;font-family:'Courier New';color:#4c1d95;font-weight:600;">Slater, M.</div>
        </div>
        <div style="border-radius:22px;padding:26px 22px;background:linear-gradient(135deg,rgba(254,243,199,0.95),rgba(253,230,138,0.55));border:2px solid rgba(245,158,11,0.35);display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
          <div style="font-size:52px;">📅</div>
          <div style="font-size:var(--body);font-weight:900;color:#92400e;">WHEN</div>
          <div style="font-size:var(--micro);color:#78350f;line-height:1.5;">Publication year in brackets.<br/>Use n.d. if no date.</div>
          <div style="background:rgba(245,158,11,0.15);border-radius:10px;padding:8px 14px;font-size:19px;font-family:'Courier New';color:#92400e;font-weight:600;">(2009).</div>
        </div>
        <div style="border-radius:22px;padding:26px 22px;background:linear-gradient(135deg,rgba(204,251,241,0.95),rgba(153,246,228,0.55));border:2px solid rgba(13,148,136,0.35);display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
          <div style="font-size:52px;">📄</div>
          <div style="font-size:var(--body);font-weight:900;color:#134e4a;">WHAT</div>
          <div style="font-size:var(--micro);color:#0f766e;line-height:1.5;">Title in sentence case.<br/>Book/journal titles in italics.</div>
          <div style="background:rgba(13,148,136,0.15);border-radius:10px;padding:8px 14px;font-size:19px;font-family:'Courier New';color:#134e4a;font-weight:600;font-style:italic;">Place illusion...</div>
        </div>
        <div style="border-radius:22px;padding:26px 22px;background:linear-gradient(135deg,rgba(255,228,230,0.95),rgba(254,205,211,0.55));border:2px solid rgba(225,29,72,0.3);display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center;">
          <div style="font-size:52px;">🌐</div>
          <div style="font-size:var(--body);font-weight:900;color:#9f1239;">WHERE</div>
          <div style="font-size:var(--micro);color:#be123c;line-height:1.5;">Publisher, journal, DOI, or URL. Always prefer DOI.</div>
          <div style="background:rgba(225,29,72,0.12);border-radius:10px;padding:8px 14px;font-size:19px;font-family:'Courier New';color:#9f1239;font-weight:600;">https://doi.org/...</div>
        </div>
      </div>
      <div style="padding:28px 36px;background:linear-gradient(135deg,#1e293b,#334155);border-radius:20px;font-family:'Courier New',monospace;font-size:var(--small);line-height:1.85;color:#e2e8f0;" class="fu2">
        <span style="color:#ddd6fe;">Slater, M.</span> <span style="color:#fbbf24;">(2009).</span> <span style="color:#5eead4;">Place illusion and plausibility can lead to realistic behaviour in immersive virtual environments.</span> <span style="color:#f9a8d4;font-style:italic;">Philosophical Transactions of the Royal Society B, 364</span><span style="color:#f9a8d4;">(1535), 3549–3557.</span> <span style="color:#fb923c;">https://doi.org/10.1098/rstb.2009.0138</span>
      </div>
      <div style="display:flex;gap:14px;" class="fu3">
        <div style="flex:1;padding:10px 16px;background:#ddd6fe;border-radius:10px;text-align:center;font-size:var(--micro);font-weight:700;color:#4c1d95;">👤 WHO</div>
        <div style="flex:0.6;padding:10px 16px;background:#fef3c7;border-radius:10px;text-align:center;font-size:var(--micro);font-weight:700;color:#92400e;">📅 WHEN</div>
        <div style="flex:2.2;padding:10px 16px;background:#ccfbf1;border-radius:10px;text-align:center;font-size:var(--micro);font-weight:700;color:#134e4a;">📄 WHAT (title + journal)</div>
        <div style="flex:1.5;padding:10px 16px;background:#ffe4e6;border-radius:10px;text-align:center;font-size:var(--micro);font-weight:700;color:#9f1239;">🌐 WHERE (DOI)</div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 12. Reference Examples Part 1 ─────────────────────────────────────────
  {
    classes: 'slate-bg',
    label: '12 Reference Examples: Journal, Book, Webpage',
    html: `
    <div class="section-label">Reference Templates · Part 1</div>
    <div class="slide-title">Reference <span class="accent">Examples</span></div>
    <div class="three-col fu1" style="gap:26px;flex:1;">
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(224,231,255,0.85),rgba(199,210,254,0.4));border:2px solid rgba(99,102,241,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">📰</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--indigo2);letter-spacing:0.06em;text-transform:uppercase;">Journal Article</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:var(--micro);color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">Slater, M.</span> <span style="color:#92400e;">(2009).</span> Place illusion and plausibility can lead to realistic behaviour in immersive virtual environments. <span style="font-style:italic;color:#0f766e;">Philosophical Transactions of the Royal Society B, 364</span>(1535), 3549–3557. <span style="color:#9f1239;">https://doi.org/10.1098/rstb.2009.0138</span>
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Article title: sentence case, no italics</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Journal name: Title Case, italicised</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Always use https://doi.org/ prefix</li>
        </ul>
      </div>
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(209,250,229,0.85),rgba(167,243,208,0.4));border:2px solid rgba(5,150,105,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">📚</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--green);letter-spacing:0.06em;text-transform:uppercase;">Book</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:var(--micro);color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">Sherman, W. R., &amp; Craig, A. B.</span> <span style="color:#92400e;">(2018).</span> <span style="font-style:italic;color:#0f766e;">Understanding virtual reality: Interface, application, and design</span> (2nd ed.). Morgan Kaufmann.
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Book title: italicised, sentence case</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Edition in brackets if not first ed.</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Publisher name only (no location in APA 7)</li>
        </ul>
      </div>
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(254,243,199,0.85),rgba(253,230,138,0.4));border:2px solid rgba(245,158,11,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">🌐</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--amber2);letter-spacing:0.06em;text-transform:uppercase;">Webpage</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:var(--micro);color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">University of Canterbury.</span> <span style="color:#92400e;">(2023, August 1).</span> <span style="font-style:italic;color:#0f766e;">HIT Lab NZ research overview.</span> https://www.hitlabnz.org
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Include the specific date if shown on page</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Page title in italics, sentence case</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> No "Retrieved from" in APA 7</li>
        </ul>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 13. Reference Examples Part 2 ─────────────────────────────────────────
  {
    classes: '',
    label: '13 Reference Examples: Chapter, Conference, Software',
    html: `
    <div class="section-label">Reference Templates · Part 2</div>
    <div class="slide-title">More <span class="accent">Reference Types</span></div>
    <div class="three-col fu1" style="gap:26px;flex:1;">
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(237,233,254,0.85),rgba(221,214,254,0.4));border:2px solid rgba(124,58,237,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">📑</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--purple);letter-spacing:0.06em;text-transform:uppercase;">Book Chapter (Edited)</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:19px;color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">McMahan, R. P.</span> <span style="color:#92400e;">(2017).</span> Exploring the effects of higher-fidelity display and interaction. In F. R. Nack &amp; A. S. Gordon (Eds.), <span style="font-style:italic;color:#7c3aed;">Interactive storytelling</span> (pp. 59–68). Springer.
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--purple);">→</span> Chapter author is first; editors after "In"</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--purple);">→</span> Only the <em>book title</em> is italicised</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--purple);">→</span> Page range in (pp. x–x) format</li>
        </ul>
      </div>
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(204,251,241,0.85),rgba(153,246,228,0.4));border:2px solid rgba(13,148,136,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">🎤</span>
          <div style="font-size:var(--tiny);font-weight:800;color:var(--teal);letter-spacing:0.06em;text-transform:uppercase;">Conference Paper</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:19px;color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">Bowman, D. A., &amp; McMahan, R. P.</span> <span style="color:#92400e;">(2007).</span> Virtual reality: How much immersion is enough? In <span style="font-style:italic;color:#0f766e;">Proceedings of the ACM CHI Conference</span> (pp. 36–43). ACM. https://doi.org/10.1145/xxxxxxx
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Proceedings title italicised (like a book)</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> Include publisher (ACM, IEEE, Springer…)</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:var(--teal);">→</span> DOI strongly preferred over URL</li>
        </ul>
      </div>
      <div style="border-radius:20px;padding:26px 24px;background:linear-gradient(135deg,rgba(224,242,254,0.85),rgba(186,230,253,0.4));border:2px solid rgba(14,165,233,0.3);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:32px;">💻</span>
          <div style="font-size:var(--tiny);font-weight:800;color:#0284c7;letter-spacing:0.06em;text-transform:uppercase;">Software / App</div>
        </div>
        <div style="font-family:'Courier New',monospace;font-size:19px;color:#334155;line-height:1.8;background:rgba(255,255,255,0.7);padding:14px 16px;border-radius:12px;">
          <span style="color:#4c1d95;">Unity Technologies.</span> <span style="color:#92400e;">(2023).</span> <span style="font-style:italic;color:#0369a1;">Unity</span> (Version 2022.3 LTS) [Computer software]. https://unity.com
        </div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px;">
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:#0284c7;">→</span> Software name italicised</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:#0284c7;">→</span> Version number in regular brackets</li>
          <li style="font-size:var(--micro);color:var(--slate);padding-left:18px;position:relative;"><span style="position:absolute;left:0;color:#0284c7;">→</span> [Computer software] descriptor after title</li>
        </ul>
      </div>
    </div>
    <div class="callout callout-indigo fu2" style="margin-top:20px;">
      <strong>Based on:</strong> American Psychological Association. (2020). <em>Publication manual of the American Psychological Association</em> (7th ed.). https://doi.org/10.1037/0000165-000
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 14. Mistakes ──────────────────────────────────────────────────────────
  {
    classes: 'dark-indigo',
    label: '14 Five Mistakes to Avoid',
    html: `
    <div class="deco-circle" style="width:600px;height:600px;background:radial-gradient(circle,rgba(225,29,72,0.12) 0%,transparent 70%);right:-80px;top:-100px;"></div>
    <div class="section-label">Common Errors · Click each card to reveal the fix</div>
    <div class="slide-title">Five <span class="accent">Mistakes</span> to Avoid</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:18px;flex:1;">
      <div class="mistake-card fu1" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">🔀</div>
        <div class="mistake-title">Confusing et al. when names clash</div>
        <div class="fix">Two papers share first authors + year. APA says write enough names to distinguish them — then et al. Don't assume the first name is enough.</div>
      </div>
      <div class="mistake-card fu2" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">👻</div>
        <div class="mistake-title">Using ibid. or op. cit.</div>
        <div class="fix">These footnote shorthand terms belong to Chicago/Oxford style. APA never uses them. Ever. Just repeat the full author–year citation each time.</div>
      </div>
      <div class="mistake-card fu3" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">👁️</div>
        <div class="mistake-title">Citing only the abstract</div>
        <div class="fix">If you only read the abstract, you only read part of the paper. Don't cite findings from sections you haven't read. Read the paper. Then cite it.</div>
      </div>
      <div class="mistake-card fu4" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">📋</div>
        <div class="mistake-title">Padding the reference list</div>
        <div class="fix">APA reference list = only sources cited in the text. Nothing extra. A bibliography includes background reading — APA doesn't. Remove anything you didn't cite.</div>
      </div>
      <div class="mistake-card fu5" onclick="var o=this.getAttribute('data-open');this.setAttribute('data-open',o?'':'true')">
        <div style="font-size:38px;margin-bottom:10px;">🔗</div>
        <div class="mistake-title">Missing DOIs / using raw URLs</div>
        <div class="fix">Always search for a DOI before using a plain URL. DOIs are permanent — URLs rot. Always prefix: https://doi.org/ not dx.doi.org or just the number.</div>
      </div>
    </div>
    <div style="margin-top:20px;padding:16px 24px;background:rgba(165,180,252,0.12);border-radius:14px;border:1.5px solid rgba(165,180,252,0.25);" class="fu6">
      <p style="font-size:var(--tiny);color:rgba(255,255,255,0.55);text-align:center;">📚 Reference: American Psychological Association. (2020). <em>Publication manual of the APA</em> (7th ed.) · Scroll to the quiz below to test your knowledge</p>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
];

// ── Quiz Questions ──────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
  {
    q: 'In APA 7, how do you cite a source with 3 or more authors for the very first time?',
    options: ['Write all author names in full', 'First author + et al., from the first citation', 'Write first 3 names, then et al.', "Write only the first author's last name"],
    correct: 1,
    explain: 'APA 7 changed this from APA 6: use et al. from the very first citation for 3+ authors. APA 6 required all names up to 5 authors on first mention.',
  },
  {
    q: 'What does "n.d." stand for in a citation like (Smith, n.d.)?',
    options: ['Not documented', 'No date', 'Not determined', 'No digital copy'],
    correct: 1,
    explain: 'n.d. stands for "no date" — used when a source has no identifiable publication date. Common for some websites and unpublished works.',
  },
  {
    q: 'What is the minimum word count that triggers a block quote in APA 7?',
    options: ['25 words', '30 words', '40 words', '50 words'],
    correct: 2,
    explain: '40 or more words = block quote. Format: new paragraph, indented, no quotation marks, citation after the full stop.',
  },
  {
    q: 'Which is the correct APA 7 in-text format for two authors?',
    options: ['(Brown and Jones, 2021)', '(Brown & Jones, 2021)', '(Brown, Jones, 2021)', '(Brown-Jones, 2021)'],
    correct: 1,
    explain: 'Two authors use an ampersand (&) inside brackets. When authors are part of the narrative sentence, use "and" — e.g., Brown and Jones (2021).',
  },
  {
    q: 'In what order do you arrange the APA 7 reference list?',
    options: ['By year (newest first)', 'Alphabetically by first author\'s surname', 'Order of first appearance in text', 'By type (books before articles)'],
    correct: 1,
    explain: 'APA reference lists are always alphabetical by the first author\'s surname. Same-author entries are then sorted by year, oldest first.',
  },
  {
    q: 'Which DOI format is correct in APA 7?',
    options: ['doi:10.1234/example', 'dx.doi.org/10.1234/example', 'https://doi.org/10.1234/example', '10.1234/example'],
    correct: 2,
    explain: 'Always use https://doi.org/ as the prefix. The older dx.doi.org format is no longer recommended, and a bare number is incomplete.',
  },
  {
    q: 'Which title capitalisation is correct for a journal ARTICLE in APA 7?',
    options: ['"The Role of Presence in Virtual Reality" (Title Case)', '"The role of presence in virtual reality" (Sentence case)', '"THE ROLE OF PRESENCE IN VIRTUAL REALITY" (ALL CAPS)', '"the role of presence in virtual reality" (all lowercase)'],
    correct: 1,
    explain: 'Article titles use sentence case: only the first word, proper nouns, and the first word after a colon are capitalised. Journal names stay in Title Case and are italicised.',
  },
  {
    q: 'A paper has 5 reference list entries that are never cited in the text. What is the issue?',
    options: ['Nothing — APA uses bibliographies this way', 'APA reference lists must only contain sources actually cited in the text', 'The paper needs more in-text citations for each entry', 'The reference list is too long; remove all 5'],
    correct: 1,
    explain: 'An APA reference list ≠ bibliography. Only sources you actually cited go in the reference list. Remove anything uncited — it\'s not a "further reading" list.',
  },
];

// ── Interactive Quiz Component ──────────────────────────────────────────────

function APAQuiz() {
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
    <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid rgba(67,56,202,0.2)', background: 'rgba(255,255,255,0.9)' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1e1b4b, #3730a3)' }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a5b4fc' }}>Knowledge Check</p>
          <h3 className="text-base font-bold text-white mt-0.5">APA 7 Citation Quiz</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(165,180,252,0.2)', color: '#a5b4fc' }}>
            {current + 1} / {QUIZ_QUESTIONS.length}
          </span>
          {submitted && (
            <button onClick={reset} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80" style={{ background: 'rgba(165,180,252,0.2)', color: '#a5b4fc' }}>
              <RotateCcw size={12} /> Retry
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(67,56,202,0.1)' }}>
        <div style={{ width: `${((current + 1) / QUIZ_QUESTIONS.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #4338ca, #6366f1)', transition: 'width 0.3s ease', borderRadius: '0 2px 2px 0' }} />
      </div>

      {submitted ? (
        /* Results screen */
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '📚' : '💪'}</div>
            <div className="text-3xl font-black mb-1" style={{ color: '#1e1b4b' }}>{score}/{QUIZ_QUESTIONS.length}</div>
            <div className="text-sm font-semibold" style={{ color: pct >= 70 ? '#059669' : '#d97706' }}>{pct}% correct</div>
            <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
              {pct === 100 ? 'Perfect! You have mastered APA 7 citations.' : pct >= 70 ? 'Great work — a couple of areas to review.' : 'Go back through the slides and try again.'}
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
        /* Question screen */
        <div className="p-6">
          <p className="text-sm font-semibold mb-4 leading-relaxed" style={{ color: '#1e1b4b' }}>{q.q}</p>
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
                    background: isCorrect ? 'rgba(5,150,105,0.12)' : isWrong ? 'rgba(225,29,72,0.1)' : sel ? 'rgba(67,56,202,0.1)' : 'rgba(248,250,252,0.9)',
                    border: `1.5px solid ${isCorrect ? 'rgba(5,150,105,0.4)' : isWrong ? 'rgba(225,29,72,0.35)' : sel ? 'rgba(67,56,202,0.35)' : 'rgba(226,232,240,0.8)'}`,
                    color: isCorrect ? '#065f46' : isWrong ? '#9f1239' : sel ? '#1e1b4b' : '#374151',
                    cursor: submitted ? 'default' : 'pointer',
                  }}
                >
                  <span className="font-bold mr-2" style={{ color: isCorrect ? '#059669' : isWrong ? '#e11d48' : sel ? '#4338ca' : '#9ca3af' }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation after answering (non-submitted) */}
          {answered && !submitted && (
            <div className="rounded-xl px-4 py-3 mb-4" style={{ background: correct ? 'rgba(5,150,105,0.08)' : 'rgba(225,29,72,0.08)', border: `1.5px solid ${correct ? 'rgba(5,150,105,0.25)' : 'rgba(225,29,72,0.25)'}` }}>
              <p className="text-xs font-bold mb-1" style={{ color: correct ? '#059669' : '#e11d48' }}>
                {correct ? '✓ Correct!' : '✗ Not quite.'}
              </p>
              <p className="text-xs" style={{ color: '#6b7280' }}>{q.explain}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              className="text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-30"
              style={{ background: 'rgba(67,56,202,0.08)', color: '#4338ca' }}
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
                    background: answers[i] !== null ? (submitted && answers[i] === QUIZ_QUESTIONS[i].correct ? '#059669' : submitted ? '#e11d48' : '#4338ca') : i === current ? '#4338ca' : 'rgba(67,56,202,0.2)',
                  }}
                />
              ))}
            </div>
            {current < QUIZ_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrent(c => c + 1)}
                className="text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                style={{ background: 'rgba(67,56,202,0.08)', color: '#4338ca' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                disabled={!allAnswered}
                className="text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-40"
                style={{ background: allAnswered ? '#4338ca' : 'rgba(67,56,202,0.15)', color: allAnswered ? '#fff' : '#4338ca' }}
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

// ── Main Component ──────────────────────────────────────────────────────────

export default function APAReferencingDeck() {
  // ── Password gate ──
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') setUnlocked(true);
  }, []);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (pwInput.trim().toUpperCase() === 'APAV7') {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setUnlocked(true);
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput('');
    }
  }

  // ── Slide state ──
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  useEffect(() => {
    const styleId = 'apa-deck-styles';
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
  const accentColor = '#4338ca';

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div
          className="w-full max-w-sm rounded-2xl overflow-hidden"
          style={{ border: '2px solid rgba(67,56,202,0.2)', background: 'rgba(255,255,255,0.95)' }}
        >
          {/* Header */}
          <div
            className="px-6 py-5 text-center"
            style={{ background: 'linear-gradient(135deg, #1e1b4b, #3730a3)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(165,180,252,0.15)', border: '2px solid rgba(165,180,252,0.3)' }}
            >
              <Lock size={26} style={{ color: '#a5b4fc' }} />
            </div>
            <h3 className="text-base font-bold text-white">Password Required</h3>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              APA v7 Citations: The Crash Course
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleUnlock} className="p-6 flex flex-col gap-4">
            <p className="text-xs text-center" style={{ color: '#6b7280' }}>
              This resource is password-protected. Enter the access password provided by your lecturer.
            </p>

            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={pwInput}
                onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                placeholder="Enter password"
                autoFocus
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold tracking-widest outline-none transition-all"
                style={{
                  border: `2px solid ${pwError ? 'rgba(225,29,72,0.5)' : 'rgba(67,56,202,0.2)'}`,
                  background: pwError ? 'rgba(255,228,230,0.5)' : 'rgba(238,242,255,0.6)',
                  color: '#1e1b4b',
                  paddingRight: '44px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity hover:opacity-70"
                style={{ color: '#9ca3af' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {pwError && (
              <p className="text-xs text-center font-semibold" style={{ color: '#e11d48' }}>
                Incorrect password — please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #4338ca, #6366f1)', color: '#fff' }}
            >
              Unlock Lesson
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrent(c => Math.max(c - 1, 0))}
            disabled={current === 0}
            className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50"
            style={{ borderColor: `${accentColor}40` }}
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
            style={{ borderColor: `${accentColor}40` }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <span className="text-xs font-medium text-gray-400 hidden sm:block">{slide.label}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: `${accentColor}40` }}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={fullscreen ? exitFs : goFs}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: `${accentColor}40` }}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      {/* Slide canvas */}
      <div
        ref={wrapRef}
        className="apa relative w-full overflow-hidden rounded-xl"
        style={{ border: `1px solid ${accentColor}30` }}
      >
        <div ref={canvasRef} style={{ width: 1920, height: 1080 }}>
          <section
            className={slide.classes}
            dangerouslySetInnerHTML={{ __html: slide.html }}
          />
        </div>
      </div>

      {/* Dot navigation */}
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
              background: i === current ? accentColor : `${accentColor}30`,
            }}
          />
        ))}
      </div>

      {/* Quiz section */}
      <div className="mt-4">
        <div className="mb-3 px-1">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>After the Slides</p>
          <h3 className="text-base font-bold mt-1" style={{ color: '#1e1b4b' }}>Test Your APA 7 Knowledge</h3>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>8 questions · Click through each question · Instant feedback · No data stored</p>
        </div>
        <APAQuiz />
      </div>
    </div>
  );
}
