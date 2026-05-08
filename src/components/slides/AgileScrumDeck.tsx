import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

.scrum *{box-sizing:border-box;margin:0;padding:0}
.scrum{font-family:'DM Sans',sans-serif;--title:64px;--subtitle:44px;--body:32px;--small:26px;--tiny:23px;--px:100px;--pt:80px;--pb:68px;--title-gap:40px;--item-gap:22px;--navy:#0d1b2a;--navy2:#052e16;--green:#059669;--green2:#10b981;--green-light:#d1fae5;--green-dark:#065f46;--cyan:#0891b2;--cyan-light:#cffafe;--amber:#d97706;--amber-light:#fef3c7;--purple:#7c3aed;--purple-light:#ede9fe;--red:#dc2626;--red-light:#fee2e2;--white:#f8fafc;--off-white:#f0fdf4;--slate:#64748b;--text:#0f172a}
.scrum section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:var(--pt) var(--px) var(--pb);background:var(--white);color:var(--text)}
.scrum section.dark{background:var(--navy);color:var(--white)}
.scrum section.dark-green{background:var(--navy2);color:var(--white)}
.scrum .slide-title{font-size:var(--title);font-weight:700;line-height:1.1;letter-spacing:-0.02em;margin-bottom:var(--title-gap);text-wrap:pretty}
.scrum .slide-title .accent{color:var(--green)}
.scrum section.dark .slide-title .accent,.scrum section.dark-green .slide-title .accent{color:#34d399}
.scrum .section-label{font-size:var(--small);font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--green);margin-bottom:18px}
.scrum section.dark .section-label,.scrum section.dark-green .section-label{color:#34d399}
.scrum .body{font-size:var(--body);line-height:1.55}
.scrum .small{font-size:var(--small);line-height:1.5}
.scrum .tiny{font-size:var(--tiny);line-height:1.5}
.scrum .two-col{display:grid;grid-template-columns:1fr 1fr;gap:44px;flex:1;align-items:start}
.scrum .two-col.wide{grid-template-columns:1.15fr 0.85fr}
.scrum .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;flex:1;align-items:stretch}
.scrum .four-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:24px;flex:1;align-items:stretch}
.scrum .callout{border-radius:16px;padding:22px 30px;font-size:var(--body);line-height:1.5}
.scrum .callout-green{background:var(--green-light);border-left:6px solid var(--green)}
.scrum .callout-cyan{background:var(--cyan-light);border-left:6px solid var(--cyan)}
.scrum .callout-amber{background:var(--amber-light);border-left:6px solid var(--amber)}
.scrum .callout-purple{background:var(--purple-light);border-left:6px solid var(--purple)}
.scrum .callout-red{background:var(--red-light);border-left:6px solid var(--red)}
.scrum .badge{display:inline-block;font-size:var(--tiny);font-weight:700;padding:6px 20px;border-radius:999px;letter-spacing:0.04em}
.scrum .badge-green{background:var(--green);color:#fff}
.scrum .badge-cyan{background:var(--cyan);color:#fff}
.scrum .badge-amber{background:var(--amber);color:#fff}
.scrum .badge-purple{background:var(--purple);color:#fff}
.scrum .badge-red{background:var(--red);color:#fff}
.scrum table{border-collapse:collapse;font-size:var(--small);width:100%}
.scrum th{background:var(--navy);color:#fff;padding:13px 20px;text-align:left;font-weight:500;font-size:var(--tiny)}
.scrum td{padding:11px 20px;border-bottom:1.5px solid #e2e8f0;vertical-align:middle}
.scrum tr:nth-child(even) td{background:#f8fafc}
.scrum tr:hover td{background:var(--green-light)}
.scrum .tbl-green th{background:var(--green)}
.scrum .tbl-red th{background:var(--red)}
.scrum .tbl-neutral th{background:#334155}
.scrum .role-card{border-radius:24px;padding:36px 32px;display:flex;flex-direction:column;gap:18px}
.scrum .role-icon{width:68px;height:68px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:34px;flex-shrink:0}
.scrum .role-title{font-size:var(--body);font-weight:700}
.scrum .role-subtitle{font-size:var(--small);opacity:0.72;line-height:1.4}
.scrum ul.check{list-style:none;display:flex;flex-direction:column;gap:9px}
.scrum ul.check li{font-size:var(--small);line-height:1.5;padding-left:32px;position:relative}
.scrum ul.check li::before{content:'✓';position:absolute;left:0;font-weight:700;color:var(--green)}
.scrum section.dark ul.check li::before,.scrum section.dark-green ul.check li::before{color:#34d399}
.scrum ul.dot{list-style:none;display:flex;flex-direction:column;gap:9px}
.scrum ul.dot li{font-size:var(--small);line-height:1.5;padding-left:28px;position:relative}
.scrum ul.dot li::before{content:'';position:absolute;left:0;top:10px;width:14px;height:14px;border-radius:50%;background:var(--green)}
.scrum section.dark ul.dot li::before{background:#34d399}
.scrum .step-list{display:flex;flex-direction:column;gap:14px}
.scrum .step-item{display:flex;gap:18px;align-items:flex-start}
.scrum .step-num{width:42px;height:42px;border-radius:50%;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;margin-top:2px}
.scrum .kanban-col{border-radius:16px;padding:18px 16px;display:flex;flex-direction:column;gap:10px;min-height:0}
.scrum .kanban-card{background:white;border-radius:10px;padding:13px 16px;font-size:var(--tiny);box-shadow:0 2px 8px rgba(0,0,0,0.08);border-left:4px solid;line-height:1.4}
.scrum .main-title{font-size:86px;font-weight:700;line-height:1.05;letter-spacing:-0.03em;color:#fff;margin-bottom:28px}
.scrum .main-title span{color:#34d399}
.scrum .title-slide-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:1200px}
.scrum .copyright{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:22px;color:rgba(0,0,0,0.22);letter-spacing:0.04em}
.scrum section.dark .copyright,.scrum section.dark-green .copyright{color:rgba(255,255,255,0.22)}
.scrum .deco-circle{position:absolute;border-radius:50%;pointer-events:none}
.scrum .pillar-card{border-radius:22px;padding:34px 30px;flex:1;display:flex;flex-direction:column;gap:14px}
.scrum .pillar-icon{font-size:52px;line-height:1}
.scrum .pillar-title{font-size:var(--body);font-weight:700}
.scrum .pillar-body{font-size:var(--small);line-height:1.55;opacity:0.85}
.scrum .event-card{border-radius:20px;padding:28px 24px;display:flex;flex-direction:column;gap:10px}
.scrum .event-title{font-size:var(--small);font-weight:700}
.scrum .event-time{font-size:var(--tiny);font-weight:700;padding:4px 14px;border-radius:99px;display:inline-block;margin-bottom:4px}
.scrum .event-desc{font-size:var(--tiny);line-height:1.55;opacity:0.85}
.scrum .artifact-card{border-radius:22px;padding:36px 32px;display:flex;flex-direction:column;gap:16px;height:100%}
.scrum .artifact-icon{font-size:48px;line-height:1}
.scrum .artifact-title{font-size:var(--body);font-weight:700}
.scrum .artifact-def{font-size:var(--small);line-height:1.55;opacity:0.85}
.scrum .manifesto-val{border-radius:20px;padding:28px 30px;display:flex;flex-direction:column;gap:10px}
.scrum .val-over{font-size:var(--tiny);font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.6}
.scrum .val-primary{font-size:var(--body);font-weight:700;line-height:1.3}
.scrum .val-secondary{font-size:var(--small);opacity:0.7;line-height:1.4}`;

const SLIDES: { classes: string; label: string; html: string; bg?: string }[] = [
  // ── 1. Title ──────────────────────────────────────────────────────────────
  {
    classes: 'dark',
    label: '1 Agile Scrum – Title',
    html: `
    <div class="deco-circle" style="width:700px;height:700px;background:radial-gradient(circle,rgba(16,185,129,0.18) 0%,transparent 70%);right:-120px;top:-160px;"></div>
    <div class="deco-circle" style="width:400px;height:400px;background:radial-gradient(circle,rgba(8,145,178,0.14) 0%,transparent 70%);left:-80px;bottom:-80px;"></div>
    <div class="title-slide-inner">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:36px;">
        <div style="width:56px;height:6px;background:#34d399;border-radius:3px;"></div>
        <span style="font-size:var(--small);font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#34d399;">MBI804 · IT Project Management</span>
      </div>
      <div class="main-title">Agile <span>Scrum</span><br/>Process in IT</div>
      <p style="font-size:var(--body);color:rgba(255,255,255,0.65);max-width:900px;line-height:1.6;margin-bottom:52px;">A complete visual guide to Scrum roles, artifacts, events, and the Sprint cycle as used in real-world IT software delivery.</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <span class="badge badge-green">Roles &amp; Teams</span>
        <span class="badge badge-cyan">Artifacts</span>
        <span class="badge badge-amber">Ceremonies</span>
        <span class="badge badge-purple">Sprint Cycle</span>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 2. What is Agile? ─────────────────────────────────────────────────────
  {
    classes: '',
    label: '2 What is Agile?',
    html: `
    <div class="section-label">Foundations</div>
    <div class="slide-title">What is <span class="accent">Agile?</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:22px;">
        <div class="callout callout-green">
          <strong>Agile</strong> is an iterative approach to software development and project management that helps teams deliver value to customers <em>faster</em> and with <em>fewer headaches</em>.
        </div>
        <div style="font-size:var(--small);line-height:1.7;color:var(--slate);">
          Instead of delivering everything at once at the end of a long project, Agile teams deliver work in small, workable increments — responding to change over following a fixed plan.
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;">
          <span class="badge badge-green">Iterative</span>
          <span class="badge badge-cyan">Collaborative</span>
          <span class="badge badge-amber">Adaptive</span>
          <span class="badge badge-purple">Customer-focused</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.06em;text-transform:uppercase;">Key Agile Characteristics</div>
        <ul class="check" style="gap:16px;">
          <li style="font-size:var(--body);">Short delivery cycles (sprints/iterations)</li>
          <li style="font-size:var(--body);">Continuous feedback from stakeholders</li>
          <li style="font-size:var(--body);">Self-organising, cross-functional teams</li>
          <li style="font-size:var(--body);">Embrace change — even late in development</li>
          <li style="font-size:var(--body);">Working software as the primary measure</li>
        </ul>
        <div class="callout callout-amber" style="margin-top:8px;">
          <strong>Origin:</strong> The Agile Manifesto was written in 2001 by 17 software practitioners in Snowbird, Utah.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 3. Agile Manifesto ────────────────────────────────────────────────────
  {
    classes: 'dark',
    label: '3 Agile Manifesto – 4 Values',
    html: `
    <div class="deco-circle" style="width:500px;height:500px;background:radial-gradient(circle,rgba(52,211,153,0.12) 0%,transparent 70%);right:-60px;top:-100px;"></div>
    <div class="section-label">Agile Manifesto · 2001</div>
    <div class="slide-title">Four <span class="accent">Core Values</span></div>
    <div class="four-col" style="gap:28px;">
      <div class="manifesto-val" style="background:rgba(16,185,129,0.15);border:1.5px solid rgba(52,211,153,0.3);">
        <div class="val-over">We value</div>
        <div class="val-primary" style="color:#34d399;">Individuals &amp; Interactions</div>
        <div class="val-over" style="opacity:0.5;">over</div>
        <div class="val-secondary">Processes &amp; Tools</div>
      </div>
      <div class="manifesto-val" style="background:rgba(8,145,178,0.15);border:1.5px solid rgba(34,211,238,0.3);">
        <div class="val-over">We value</div>
        <div class="val-primary" style="color:#22d3ee;">Working Software</div>
        <div class="val-over" style="opacity:0.5;">over</div>
        <div class="val-secondary">Comprehensive Documentation</div>
      </div>
      <div class="manifesto-val" style="background:rgba(217,119,6,0.15);border:1.5px solid rgba(251,191,36,0.3);">
        <div class="val-over">We value</div>
        <div class="val-primary" style="color:#fbbf24;">Customer Collaboration</div>
        <div class="val-over" style="opacity:0.5;">over</div>
        <div class="val-secondary">Contract Negotiation</div>
      </div>
      <div class="manifesto-val" style="background:rgba(124,58,237,0.15);border:1.5px solid rgba(167,139,250,0.3);">
        <div class="val-over">We value</div>
        <div class="val-primary" style="color:#a78bfa;">Responding to Change</div>
        <div class="val-over" style="opacity:0.5;">over</div>
        <div class="val-secondary">Following a Plan</div>
      </div>
    </div>
    <div style="margin-top:32px;text-align:center;font-size:var(--small);color:rgba(255,255,255,0.5);font-style:italic;">
      "That is, while there is value in the items on the right, we value the items on the left more."
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 4. Agile vs Waterfall ─────────────────────────────────────────────────
  {
    classes: '',
    label: '4 Agile vs Waterfall',
    html: `
    <div class="section-label">Comparison</div>
    <div class="slide-title">Agile vs <span class="accent">Waterfall</span></div>
    <table class="tbl-neutral" style="flex:1;">
      <thead>
        <tr>
          <th style="width:28%;">Aspect</th>
          <th style="background:#dc2626;width:36%;">🌊 Waterfall</th>
          <th style="background:#059669;width:36%;">⚡ Agile</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="font-weight:600;">Delivery approach</td><td>Single delivery at end of project</td><td>Incremental delivery every sprint</td></tr>
        <tr><td style="font-weight:600;">Requirements</td><td>Fixed upfront — changes are costly</td><td>Evolving — change welcomed anytime</td></tr>
        <tr><td style="font-weight:600;">Customer involvement</td><td>At start and end only</td><td>Continuous throughout the project</td></tr>
        <tr><td style="font-weight:600;">Testing phase</td><td>After development is complete</td><td>Continuous — every sprint</td></tr>
        <tr><td style="font-weight:600;">Team structure</td><td>Siloed (Dev, QA, BA separate)</td><td>Cross-functional, self-organising</td></tr>
        <tr><td style="font-weight:600;">Risk management</td><td>Risk discovered late (expensive)</td><td>Risks surfaced early, often</td></tr>
        <tr><td style="font-weight:600;">Best suited for</td><td>Fixed-scope, stable requirements</td><td>Complex, evolving software projects</td></tr>
      </tbody>
    </table>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 5. What is Scrum? ─────────────────────────────────────────────────────
  {
    classes: '',
    label: '5 What is Scrum?',
    html: `
    <div class="section-label">Scrum Framework</div>
    <div class="slide-title">What is <span class="accent">Scrum?</span></div>
    <div class="two-col wide">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="callout callout-green">
          <strong>Scrum</strong> is a lightweight Agile <em>framework</em> for developing, delivering, and sustaining complex products — most commonly used in software development.
        </div>
        <p style="font-size:var(--body);line-height:1.65;color:var(--slate);">Scrum uses short, fixed-length iterations called <strong>Sprints</strong> (1–4 weeks) where a cross-functional team produces a potentially shippable product increment.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:4px;">
          <div style="background:var(--green-light);border-radius:14px;padding:18px 20px;">
            <div style="font-size:var(--small);font-weight:700;color:var(--green-dark);">📅 Sprint Duration</div>
            <div style="font-size:var(--body);font-weight:700;color:var(--green);">1 – 4 weeks</div>
          </div>
          <div style="background:var(--cyan-light);border-radius:14px;padding:18px 20px;">
            <div style="font-size:var(--small);font-weight:700;color:#0e7490;">👥 Team Size</div>
            <div style="font-size:var(--body);font-weight:700;color:var(--cyan);">3 – 9 members</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;">Three Pillars of Scrum</div>
        <div class="pillar-card" style="background:var(--green-light);border:1.5px solid rgba(5,150,105,0.25);flex:0 0 auto;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:40px;">👁️</div>
            <div>
              <div class="pillar-title" style="color:var(--green-dark);">Transparency</div>
              <div class="pillar-body" style="color:var(--green-dark);">All significant aspects of the process must be visible to everyone responsible for the outcome.</div>
            </div>
          </div>
        </div>
        <div class="pillar-card" style="background:var(--amber-light);border:1.5px solid rgba(217,119,6,0.25);flex:0 0 auto;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:40px;">🔍</div>
            <div>
              <div class="pillar-title" style="color:#78350f;">Inspection</div>
              <div class="pillar-body" style="color:#78350f;">Scrum users must frequently inspect progress toward the Sprint Goal to detect undesirable variances.</div>
            </div>
          </div>
        </div>
        <div class="pillar-card" style="background:var(--cyan-light);border:1.5px solid rgba(8,145,178,0.25);flex:0 0 auto;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="font-size:40px;">🔄</div>
            <div>
              <div class="pillar-title" style="color:#0e4f5c;">Adaptation</div>
              <div class="pillar-body" style="color:#0e4f5c;">If inspection reveals deviation beyond acceptable limits, the process must be adjusted as soon as possible.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 6. Scrum at a Glance ──────────────────────────────────────────────────
  {
    classes: 'dark-green',
    label: '6 Scrum Framework at a Glance',
    html: `
    <div class="deco-circle" style="width:600px;height:600px;background:radial-gradient(circle,rgba(52,211,153,0.1) 0%,transparent 70%);right:-80px;bottom:-120px;"></div>
    <div class="section-label">Overview</div>
    <div class="slide-title">Scrum <span class="accent">Framework</span> at a Glance</div>

    <div style="display:flex;align-items:center;gap:0;flex:1;margin-top:8px;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:220px;flex-shrink:0;">
        <div style="background:rgba(52,211,153,0.15);border:2px solid rgba(52,211,153,0.4);border-radius:18px;padding:24px 20px;text-align:center;width:100%;">
          <div style="font-size:42px;">📋</div>
          <div style="font-size:var(--small);font-weight:700;color:#34d399;margin-top:8px;">Product</div>
          <div style="font-size:var(--small);font-weight:700;color:#34d399;">Backlog</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.55);margin-top:6px;">Prioritised list of all work</div>
        </div>
      </div>

      <div style="font-size:44px;color:#34d399;margin:0 12px;flex-shrink:0;">→</div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:210px;flex-shrink:0;">
        <div style="background:rgba(251,191,36,0.15);border:2px solid rgba(251,191,36,0.4);border-radius:18px;padding:24px 20px;text-align:center;width:100%;">
          <div style="font-size:40px;">🗓️</div>
          <div style="font-size:var(--small);font-weight:700;color:#fbbf24;margin-top:8px;">Sprint</div>
          <div style="font-size:var(--small);font-weight:700;color:#fbbf24;">Planning</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.55);margin-top:6px;">Select &amp; plan sprint work</div>
        </div>
      </div>

      <div style="font-size:44px;color:#34d399;margin:0 12px;flex-shrink:0;">→</div>

      <div style="background:rgba(16,185,129,0.12);border:2.5px solid rgba(52,211,153,0.5);border-radius:22px;padding:28px 24px;flex:1;position:relative;">
        <div style="font-size:var(--small);font-weight:700;color:#34d399;text-align:center;margin-bottom:16px;">⚡ THE SPRINT (1–4 weeks)</div>
        <div style="display:flex;align-items:center;gap:0;justify-content:center;">
          <div style="background:rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;text-align:center;width:200px;">
            <div style="font-size:34px;">📝</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#34d399;margin-top:6px;">Sprint Backlog</div>
          </div>
          <div style="font-size:36px;color:#34d399;margin:0 10px;">→</div>
          <div style="background:rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;text-align:center;width:200px;">
            <div style="font-size:34px;">⚙️</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#34d399;margin-top:6px;">Dev Work</div>
          </div>
        </div>
        <div style="text-align:center;margin-top:16px;">
          <div style="display:inline-flex;align-items:center;gap:10px;background:rgba(251,191,36,0.15);border-radius:99px;padding:8px 20px;">
            <span style="font-size:26px;">🌅</span>
            <span style="font-size:var(--tiny);font-weight:700;color:#fbbf24;">Daily Scrum · 15 min/day</span>
          </div>
        </div>
      </div>

      <div style="font-size:44px;color:#34d399;margin:0 12px;flex-shrink:0;">→</div>

      <div style="display:flex;flex-direction:column;gap:10px;width:200px;flex-shrink:0;">
        <div style="background:rgba(34,211,238,0.15);border:2px solid rgba(34,211,238,0.4);border-radius:16px;padding:18px 16px;text-align:center;">
          <div style="font-size:32px;">🎯</div>
          <div style="font-size:var(--tiny);font-weight:700;color:#22d3ee;margin-top:6px;">Sprint Review</div>
        </div>
        <div style="background:rgba(167,139,250,0.15);border:2px solid rgba(167,139,250,0.4);border-radius:16px;padding:18px 16px;text-align:center;">
          <div style="font-size:32px;">💡</div>
          <div style="font-size:var(--tiny);font-weight:700;color:#a78bfa;margin-top:6px;">Retrospective</div>
        </div>
      </div>

      <div style="font-size:44px;color:#34d399;margin:0 12px;flex-shrink:0;">→</div>

      <div style="width:200px;flex-shrink:0;">
        <div style="background:rgba(52,211,153,0.18);border:2px solid rgba(52,211,153,0.5);border-radius:18px;padding:24px 20px;text-align:center;">
          <div style="font-size:42px;">🚀</div>
          <div style="font-size:var(--small);font-weight:700;color:#34d399;margin-top:8px;">Increment</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.55);margin-top:6px;">Shippable product value</div>
        </div>
      </div>

    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 7. Scrum Roles Overview ───────────────────────────────────────────────
  {
    classes: '',
    label: '7 Scrum Roles Overview',
    html: `
    <div class="section-label">People · The Scrum Team</div>
    <div class="slide-title">Three <span class="accent">Scrum Roles</span></div>
    <div class="three-col">
      <div class="role-card" style="background:linear-gradient(135deg,rgba(5,150,105,0.08),rgba(16,185,129,0.04));border:1.5px solid rgba(5,150,105,0.2);">
        <div class="role-icon" style="background:rgba(5,150,105,0.12);font-size:36px;">🏆</div>
        <div>
          <div class="role-title" style="color:var(--green-dark);">Product Owner</div>
          <div class="role-subtitle">Maximises product value</div>
        </div>
        <ul class="dot" style="flex:1;">
          <li>Owns the Product Backlog</li>
          <li>Prioritises features by business value</li>
          <li>Defines acceptance criteria</li>
          <li>Voice of the customer &amp; stakeholders</li>
          <li>Accepts or rejects sprint outcomes</li>
        </ul>
        <div class="callout callout-green" style="font-size:var(--tiny);">
          <strong>Accountability:</strong> Maximising the value of the product resulting from the Scrum Team's work.
        </div>
      </div>

      <div class="role-card" style="background:linear-gradient(135deg,rgba(217,119,6,0.08),rgba(251,191,36,0.04));border:1.5px solid rgba(217,119,6,0.2);">
        <div class="role-icon" style="background:rgba(217,119,6,0.12);font-size:36px;">🛡️</div>
        <div>
          <div class="role-title" style="color:#78350f;">Scrum Master</div>
          <div class="role-subtitle">Servant-leader &amp; coach</div>
        </div>
        <ul class="dot" style="flex:1;">
          <li>Facilitates all Scrum events</li>
          <li>Removes impediments for the team</li>
          <li>Coaches team on Scrum practices</li>
          <li>Shields team from outside interruptions</li>
          <li>Promotes continuous improvement</li>
        </ul>
        <div class="callout callout-amber" style="font-size:var(--tiny);">
          <strong>Accountability:</strong> Ensuring Scrum is understood and enacted — serving the team, PO, and organisation.
        </div>
      </div>

      <div class="role-card" style="background:linear-gradient(135deg,rgba(8,145,178,0.08),rgba(34,211,238,0.04));border:1.5px solid rgba(8,145,178,0.2);">
        <div class="role-icon" style="background:rgba(8,145,178,0.12);font-size:36px;">👩‍💻</div>
        <div>
          <div class="role-title" style="color:#0e4f5c;">Developers</div>
          <div class="role-subtitle">Cross-functional delivery team</div>
        </div>
        <ul class="dot" style="flex:1;">
          <li>Build the product increment each sprint</li>
          <li>Self-organise and manage their own work</li>
          <li>Collectively own code quality</li>
          <li>Estimate effort (story points)</li>
          <li>Define and uphold "Definition of Done"</li>
        </ul>
        <div class="callout callout-cyan" style="font-size:var(--tiny);">
          <strong>Accountability:</strong> Creating a usable Increment every Sprint that meets the Definition of Done.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 8. Product Owner Deep Dive ────────────────────────────────────────────
  {
    classes: '',
    label: '8 Product Owner',
    html: `
    <div class="section-label">Role Deep Dive</div>
    <div class="slide-title">The <span class="accent">Product Owner</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="display:flex;align-items:center;gap:20px;padding:24px 28px;background:var(--green-light);border-radius:20px;border:1.5px solid rgba(5,150,105,0.25);">
          <div style="font-size:64px;line-height:1;">🏆</div>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:var(--green-dark);">Product Owner (PO)</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">One person — not a committee — who owns and prioritises the Product Backlog</div>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Core Responsibilities</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num">1</div><div style="font-size:var(--small);line-height:1.6;">Develop and communicate the <strong>Product Goal</strong> — the long-term objective for the product</div></div>
          <div class="step-item"><div class="step-num">2</div><div style="font-size:var(--small);line-height:1.6;"><strong>Create and refine</strong> Product Backlog items — writing and clarifying user stories</div></div>
          <div class="step-item"><div class="step-num">3</div><div style="font-size:var(--small);line-height:1.6;"><strong>Prioritise</strong> the backlog to maximise value delivered per sprint</div></div>
          <div class="step-item"><div class="step-num">4</div><div style="font-size:var(--small);line-height:1.6;"><strong>Accept or reject</strong> sprint deliverables during Sprint Review</div></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="callout callout-green">
          <strong>Key insight:</strong> The PO is the <em>bridge</em> between the business and the development team. Their decisions directly determine the ROI of the product.
        </div>
        <div style="background:white;border-radius:18px;padding:28px;border:1.5px solid rgba(0,0,0,0.08);box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;color:var(--slate);">PO interacts with…</div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;gap:12px;font-size:var(--tiny);"><span style="font-size:28px;">🏢</span> <span><strong>Stakeholders &amp; Customers</strong> — gather requirements, priorities</span></div>
            <div style="display:flex;align-items:center;gap:12px;font-size:var(--tiny);"><span style="font-size:28px;">👩‍💻</span> <span><strong>Developers</strong> — clarify stories, answer questions</span></div>
            <div style="display:flex;align-items:center;gap:12px;font-size:var(--tiny);"><span style="font-size:28px;">🛡️</span> <span><strong>Scrum Master</strong> — coaching on best practices</span></div>
          </div>
        </div>
        <div class="callout callout-amber">
          <strong>⚠️ Common mistake:</strong> Having multiple people act as Product Owner. The PO must be <em>one person</em> with final authority over backlog priorities.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 9. Scrum Master Deep Dive ─────────────────────────────────────────────
  {
    classes: '',
    label: '9 Scrum Master',
    html: `
    <div class="section-label">Role Deep Dive</div>
    <div class="slide-title">The <span class="accent">Scrum Master</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:20px;padding:24px 28px;background:var(--amber-light);border-radius:20px;border:1.5px solid rgba(217,119,6,0.25);">
          <div style="font-size:64px;line-height:1;">🛡️</div>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#78350f;">Scrum Master (SM)</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">A servant-leader who serves the Scrum Team, the Product Owner, and the organisation</div>
          </div>
        </div>
        <div class="three-col" style="gap:14px;flex:0 0 auto;">
          <div style="background:rgba(5,150,105,0.08);border-radius:14px;padding:18px 16px;text-align:center;border:1px solid rgba(5,150,105,0.2);">
            <div style="font-size:32px;">📚</div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-top:8px;">Educator</div>
            <div style="font-size:20px;color:var(--slate);margin-top:4px;line-height:1.4;">Teaches Scrum to everyone</div>
          </div>
          <div style="background:rgba(217,119,6,0.08);border-radius:14px;padding:18px 16px;text-align:center;border:1px solid rgba(217,119,6,0.2);">
            <div style="font-size:32px;">🚧</div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--amber);margin-top:8px;">Remover</div>
            <div style="font-size:20px;color:var(--slate);margin-top:4px;line-height:1.4;">Clears impediments &amp; blockers</div>
          </div>
          <div style="background:rgba(8,145,178,0.08);border-radius:14px;padding:18px 16px;text-align:center;border:1px solid rgba(8,145,178,0.2);">
            <div style="font-size:32px;">🎯</div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--cyan);margin-top:8px;">Facilitator</div>
            <div style="font-size:20px;color:var(--slate);margin-top:4px;line-height:1.4;">Runs all Scrum events</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Serves Three Groups</div>
        <div style="background:var(--green-light);border-radius:16px;padding:20px 24px;border:1px solid rgba(5,150,105,0.2);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:8px;">🏆 Serving the Product Owner</div>
          <ul class="check" style="gap:6px;"><li style="font-size:var(--tiny);">Help manage &amp; refine the Product Backlog</li><li style="font-size:var(--tiny);">Facilitate stakeholder collaboration</li><li style="font-size:var(--tiny);">Ensure PO knows how to maximise value</li></ul>
        </div>
        <div style="background:var(--cyan-light);border-radius:16px;padding:20px 24px;border:1px solid rgba(8,145,178,0.2);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--cyan);margin-bottom:8px;">👩‍💻 Serving the Developers</div>
          <ul class="check" style="gap:6px;"><li style="font-size:var(--tiny);">Coach self-management &amp; cross-functionality</li><li style="font-size:var(--tiny);">Remove external impediments</li><li style="font-size:var(--tiny);">Protect from interruptions &amp; distractions</li></ul>
        </div>
        <div style="background:var(--amber-light);border-radius:16px;padding:20px 24px;border:1px solid rgba(217,119,6,0.2);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--amber);margin-bottom:8px;">🏢 Serving the Organisation</div>
          <ul class="check" style="gap:6px;"><li style="font-size:var(--tiny);">Lead, train &amp; coach Scrum adoption</li><li style="font-size:var(--tiny);">Plan and advise on Scrum implementations</li><li style="font-size:var(--tiny);">Help employees understand empirical thinking</li></ul>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 10. Developers Deep Dive ──────────────────────────────────────────────
  {
    classes: '',
    label: '10 Developers (Dev Team)',
    html: `
    <div class="section-label">Role Deep Dive</div>
    <div class="slide-title">The <span class="accent">Developers</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="display:flex;align-items:center;gap:20px;padding:24px 28px;background:var(--cyan-light);border-radius:20px;border:1.5px solid rgba(8,145,178,0.25);">
          <div style="font-size:64px;line-height:1;">👩‍💻</div>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#0e4f5c;">Developers</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">The people who create the product — 3 to 9 members, cross-functional by design</div>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Team Characteristics</div>
        <ul class="check" style="gap:14px;">
          <li style="font-size:var(--body);"><strong>Cross-functional</strong> — collectively have all skills to create value</li>
          <li style="font-size:var(--body);"><strong>Self-organising</strong> — team decides how to do the work</li>
          <li style="font-size:var(--body);"><strong>Accountable as a team</strong> — no sub-teams or hierarchies within</li>
          <li style="font-size:var(--body);"><strong>Committed</strong> — to the Sprint Goal each iteration</li>
        </ul>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-cyan">
          <strong>Definition of Done (DoD):</strong> Developers create and enforce a shared agreement on what "done" means. No increment is released without meeting the DoD.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Typical Roles Within</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);font-size:var(--tiny);">
            <span style="font-size:28px;">💻</span><span><strong>Software Engineers</strong> — build features, APIs, databases</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);font-size:var(--tiny);">
            <span style="font-size:28px;">🎨</span><span><strong>UI/UX Designers</strong> — design user interface &amp; experience</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);font-size:var(--tiny);">
            <span style="font-size:28px;">🧪</span><span><strong>QA Engineers</strong> — test, validate, and ensure quality</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);font-size:var(--tiny);">
            <span style="font-size:28px;">☁️</span><span><strong>DevOps / Infrastructure</strong> — deployments, CI/CD pipelines</span>
          </div>
        </div>
        <div class="callout callout-amber" style="margin-top:4px;">
          <strong>Ideal team size:</strong> 3–9 people. Too small = lacks skills. Too large = communication overhead explodes.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 11. Scrum Artifacts Overview ──────────────────────────────────────────
  {
    classes: 'dark',
    label: '11 Scrum Artifacts',
    html: `
    <div class="deco-circle" style="width:500px;height:500px;background:radial-gradient(circle,rgba(52,211,153,0.1) 0%,transparent 70%);right:-60px;bottom:-80px;"></div>
    <div class="section-label">Artifacts · What We Track</div>
    <div class="slide-title">Three <span class="accent">Scrum Artifacts</span></div>
    <div class="three-col">
      <div class="artifact-card" style="background:rgba(52,211,153,0.12);border:1.5px solid rgba(52,211,153,0.35);">
        <div class="artifact-icon">📋</div>
        <div class="artifact-title" style="color:#34d399;">Product Backlog</div>
        <div class="artifact-def">The single, ordered list of everything that might be needed in the product. The Product Owner manages and prioritises it.</div>
        <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:var(--tiny);font-weight:700;color:#34d399;margin-bottom:6px;">Commitment →</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.7);background:rgba(52,211,153,0.15);border-radius:8px;padding:10px 14px;">🎯 <strong>Product Goal</strong> — the long-term objective for the Scrum Team</div>
        </div>
      </div>
      <div class="artifact-card" style="background:rgba(251,191,36,0.12);border:1.5px solid rgba(251,191,36,0.35);">
        <div class="artifact-icon">📝</div>
        <div class="artifact-title" style="color:#fbbf24;">Sprint Backlog</div>
        <div class="artifact-def">The Sprint Goal, the Product Backlog items selected for the Sprint, plus the plan for delivering the Increment. Updated daily by Developers.</div>
        <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:var(--tiny);font-weight:700;color:#fbbf24;margin-bottom:6px;">Commitment →</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.7);background:rgba(251,191,36,0.15);border-radius:8px;padding:10px 14px;">⚡ <strong>Sprint Goal</strong> — the single objective for the Sprint</div>
        </div>
      </div>
      <div class="artifact-card" style="background:rgba(167,139,250,0.12);border:1.5px solid rgba(167,139,250,0.35);">
        <div class="artifact-icon">🚀</div>
        <div class="artifact-title" style="color:#a78bfa;">Increment</div>
        <div class="artifact-def">A concrete stepping stone toward the Product Goal. Must be usable, meeting the Definition of Done. Multiple increments may exist in a single Sprint.</div>
        <div style="margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:var(--tiny);font-weight:700;color:#a78bfa;margin-bottom:6px;">Commitment →</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.7);background:rgba(167,139,250,0.15);border-radius:8px;padding:10px 14px;">✅ <strong>Definition of Done</strong> — quality standard for every increment</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 12. Product Backlog ───────────────────────────────────────────────────
  {
    classes: '',
    label: '12 Product Backlog',
    html: `
    <div class="section-label">Artifact 1</div>
    <div class="slide-title">The <span class="accent">Product Backlog</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-green">
          An <strong>ordered list of everything</strong> that needs to be done to improve the product. It is the single source of work for the Scrum Team. Never complete — always evolving.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Example Product Backlog</div>
        <table class="tbl-green">
          <thead><tr><th>#</th><th>User Story / Feature</th><th>Priority</th><th>Points</th></tr></thead>
          <tbody>
            <tr><td style="font-weight:600;">1</td><td>User can register with email &amp; password</td><td><span class="badge badge-red" style="font-size:18px;padding:3px 12px;">Critical</span></td><td>5</td></tr>
            <tr><td style="font-weight:600;">2</td><td>User can log in and see their dashboard</td><td><span class="badge badge-red" style="font-size:18px;padding:3px 12px;">Critical</span></td><td>8</td></tr>
            <tr><td style="font-weight:600;">3</td><td>User can upload a profile photo</td><td><span class="badge badge-amber" style="font-size:18px;padding:3px 12px;">High</span></td><td>3</td></tr>
            <tr><td style="font-weight:600;">4</td><td>Admin can view all user accounts</td><td><span class="badge badge-amber" style="font-size:18px;padding:3px 12px;">High</span></td><td>5</td></tr>
            <tr><td style="font-weight:600;">5</td><td>System sends email notification on signup</td><td><span class="badge badge-cyan" style="font-size:18px;padding:3px 12px;">Medium</span></td><td>3</td></tr>
          </tbody>
        </table>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Key Properties</div>
        <ul class="check" style="gap:14px;">
          <li style="font-size:var(--body);"><strong>Ordered</strong> by value, risk, and priority</li>
          <li style="font-size:var(--body);"><strong>Refined</strong> continuously (Backlog Refinement)</li>
          <li style="font-size:var(--body);"><strong>Estimated</strong> in story points (relative effort)</li>
          <li style="font-size:var(--body);"><strong>Transparent</strong> — visible to all stakeholders</li>
        </ul>
        <div class="callout callout-amber" style="margin-top:8px;">
          <strong>Backlog Refinement:</strong> The ongoing process of breaking down, detailing, and estimating backlog items. Recommended ~10% of team capacity each sprint.
        </div>
        <div class="callout callout-purple" style="margin-top:4px;">
          <strong>Product Goal:</strong> The long-term commitment embedded in the Product Backlog — it gives the team direction and purpose across multiple sprints.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 13. Sprint Backlog + Increment ────────────────────────────────────────
  {
    classes: '',
    label: '13 Sprint Backlog & Increment',
    html: `
    <div class="section-label">Artifacts 2 &amp; 3</div>
    <div class="slide-title"><span class="accent">Sprint Backlog</span> &amp; Increment</div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="padding:24px 28px;background:var(--amber-light);border-radius:18px;border:1.5px solid rgba(217,119,6,0.25);">
          <div style="font-size:36px;margin-bottom:10px;">📝</div>
          <div style="font-size:var(--body);font-weight:700;color:#78350f;">Sprint Backlog</div>
          <div style="font-size:var(--small);color:var(--slate);margin-top:8px;line-height:1.6;">A subset of the Product Backlog selected for the current Sprint, plus the plan for achieving the Sprint Goal. It belongs to the Developers — only they can change it during the Sprint.</div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Sprint Backlog contains</div>
        <ul class="dot" style="gap:10px;">
          <li style="font-size:var(--body);"><strong>Sprint Goal</strong> — the "why" of the sprint</li>
          <li style="font-size:var(--body);"><strong>Selected PBIs</strong> — the user stories / features chosen</li>
          <li style="font-size:var(--body);"><strong>Tasks</strong> — breakdown of work (hours or sub-items)</li>
          <li style="font-size:var(--body);"><strong>Daily plan</strong> — updated each day at Daily Scrum</li>
        </ul>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="padding:24px 28px;background:var(--purple-light);border-radius:18px;border:1.5px solid rgba(124,58,237,0.25);">
          <div style="font-size:36px;margin-bottom:10px;">🚀</div>
          <div style="font-size:var(--body);font-weight:700;color:#4c1d95;">Increment</div>
          <div style="font-size:var(--small);color:var(--slate);margin-top:8px;line-height:1.6;">The sum of all completed Product Backlog items in a Sprint plus previous increments. Must be usable and meet the Definition of Done — even if the PO decides not to release it.</div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Definition of Done (DoD)</div>
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:10px;">✅ Example DoD Checklist</div>
          <ul class="check" style="gap:7px;">
            <li style="font-size:var(--tiny);">All code reviewed by at least one peer</li>
            <li style="font-size:var(--tiny);">Unit tests written and passing (&gt;80% coverage)</li>
            <li style="font-size:var(--tiny);">Feature tested in staging environment</li>
            <li style="font-size:var(--tiny);">Accessibility standards met (WCAG 2.1 AA)</li>
            <li style="font-size:var(--tiny);">Documentation updated (API docs / README)</li>
            <li style="font-size:var(--tiny);">Product Owner has accepted the story</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 14. Scrum Events Overview ─────────────────────────────────────────────
  {
    classes: 'dark',
    label: '14 Scrum Events Overview',
    html: `
    <div class="deco-circle" style="width:450px;height:450px;background:radial-gradient(circle,rgba(34,211,238,0.1) 0%,transparent 70%);right:-40px;top:-80px;"></div>
    <div class="section-label">Ceremonies · Formal Scrum Events</div>
    <div class="slide-title">Five <span class="accent">Scrum Events</span></div>
    <div style="display:flex;gap:20px;flex:1;align-items:stretch;">

      <div class="event-card" style="background:rgba(52,211,153,0.12);border:1.5px solid rgba(52,211,153,0.35);flex:1;">
        <div class="event-time" style="background:rgba(52,211,153,0.2);color:#34d399;">⚡ 1–4 weeks</div>
        <div class="event-title" style="color:#34d399;">1. The Sprint</div>
        <div class="event-desc">The container for all other events. A fixed-length period where a "Done" usable Increment is created.</div>
      </div>

      <div class="event-card" style="background:rgba(251,191,36,0.12);border:1.5px solid rgba(251,191,36,0.35);flex:1;">
        <div class="event-time" style="background:rgba(251,191,36,0.2);color:#fbbf24;">⏱ max 8 hrs</div>
        <div class="event-title" style="color:#fbbf24;">2. Sprint Planning</div>
        <div class="event-desc">The entire Scrum Team plans the sprint. <em>Why</em> (Sprint Goal), <em>What</em> (PBIs selected), and <em>How</em> (tasks created).</div>
      </div>

      <div class="event-card" style="background:rgba(34,211,238,0.12);border:1.5px solid rgba(34,211,238,0.35);flex:1;">
        <div class="event-time" style="background:rgba(34,211,238,0.2);color:#22d3ee;">⏱ 15 min/day</div>
        <div class="event-title" style="color:#22d3ee;">3. Daily Scrum</div>
        <div class="event-desc">Daily 15-minute standup for Developers to inspect progress toward the Sprint Goal and adapt the Sprint Backlog.</div>
      </div>

      <div class="event-card" style="background:rgba(167,139,250,0.12);border:1.5px solid rgba(167,139,250,0.35);flex:1;">
        <div class="event-time" style="background:rgba(167,139,250,0.2);color:#a78bfa;">⏱ max 4 hrs</div>
        <div class="event-title" style="color:#a78bfa;">4. Sprint Review</div>
        <div class="event-desc">The team presents the Increment to stakeholders. Feedback is collected and the Product Backlog may be adjusted.</div>
      </div>

      <div class="event-card" style="background:rgba(244,114,182,0.12);border:1.5px solid rgba(244,114,182,0.35);flex:1;">
        <div class="event-time" style="background:rgba(244,114,182,0.2);color:#f472b6;">⏱ max 3 hrs</div>
        <div class="event-title" style="color:#f472b6;">5. Sprint Retrospective</div>
        <div class="event-desc">The Scrum Team inspects <em>how they worked</em>: individuals, interactions, processes, tools, and the DoD.</div>
      </div>

    </div>
    <div style="margin-top:18px;font-size:var(--tiny);color:rgba(255,255,255,0.45);text-align:center;">
      All timeboxes shown are for a 4-week Sprint. Scale proportionally for shorter sprints (e.g. 2-week Sprint → Sprint Planning max 4 hours).
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 15. The Sprint ────────────────────────────────────────────────────────
  {
    classes: '',
    label: '15 The Sprint',
    html: `
    <div class="section-label">Event 1</div>
    <div class="slide-title">The <span class="accent">Sprint</span> — Heartbeat of Scrum</div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="callout callout-green">
          The Sprint is a <strong>fixed-length event</strong> of one month or less. A new Sprint starts <em>immediately</em> after the conclusion of the previous one — no gaps.
        </div>
        <ul class="check" style="gap:14px;">
          <li style="font-size:var(--body);">Duration: <strong>1 to 4 weeks</strong> (consistent length)</li>
          <li style="font-size:var(--body);">Contains all Scrum events (Planning → Review → Retro)</li>
          <li style="font-size:var(--body);">No changes endangering the Sprint Goal</li>
          <li style="font-size:var(--body);">Scope may be clarified/renegotiated with PO</li>
          <li style="font-size:var(--body);">Can be <strong>cancelled</strong> by PO if Goal becomes obsolete</li>
        </ul>
        <div class="callout callout-amber">
          <strong>Why short sprints?</strong> Frequent checkpoints reduce risk. If you're heading the wrong direction, you find out in 1–2 weeks, not 6 months.
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Sprint Timeline (2-week example)</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--amber-light);border-radius:14px;border:1px solid rgba(217,119,6,0.2);">
            <div style="font-size:32px;">🗓️</div>
            <div style="flex:1;"><div style="font-size:var(--small);font-weight:700;color:#78350f;">Day 1 – Sprint Planning</div><div style="font-size:var(--tiny);color:var(--slate);">Set Sprint Goal, select PBIs, plan tasks (max 4 hrs)</div></div>
            <div style="font-size:var(--tiny);font-weight:700;background:rgba(217,119,6,0.2);color:var(--amber);padding:4px 12px;border-radius:99px;">Day 1</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--cyan-light);border-radius:14px;border:1px solid rgba(8,145,178,0.2);">
            <div style="font-size:32px;">🌅</div>
            <div style="flex:1;"><div style="font-size:var(--small);font-weight:700;color:#0e4f5c;">Days 2–9 – Development + Daily Scrums</div><div style="font-size:var(--tiny);color:var(--slate);">Build, test, integrate — 15 min standup each morning</div></div>
            <div style="font-size:var(--tiny);font-weight:700;background:rgba(8,145,178,0.2);color:var(--cyan);padding:4px 12px;border-radius:99px;">Day 2–9</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--purple-light);border-radius:14px;border:1px solid rgba(124,58,237,0.2);">
            <div style="font-size:32px;">🎯</div>
            <div style="flex:1;"><div style="font-size:var(--small);font-weight:700;color:#4c1d95;">Day 10 – Sprint Review</div><div style="font-size:var(--tiny);color:var(--slate);">Demo increment to stakeholders, gather feedback (max 2 hrs)</div></div>
            <div style="font-size:var(--tiny);font-weight:700;background:rgba(124,58,237,0.2);color:var(--purple);padding:4px 12px;border-radius:99px;">Day 10</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--green-light);border-radius:14px;border:1px solid rgba(5,150,105,0.2);">
            <div style="font-size:32px;">💡</div>
            <div style="flex:1;"><div style="font-size:var(--small);font-weight:700;color:var(--green-dark);">Day 10 – Sprint Retrospective</div><div style="font-size:var(--tiny);color:var(--slate);">Team improves process — what worked, what didn't (max 1.5 hrs)</div></div>
            <div style="font-size:var(--tiny);font-weight:700;background:rgba(5,150,105,0.2);color:var(--green);padding:4px 12px;border-radius:99px;">Day 10</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 16. Sprint Planning ───────────────────────────────────────────────────
  {
    classes: '',
    label: '16 Sprint Planning',
    html: `
    <div class="section-label">Event 2</div>
    <div class="slide-title"><span class="accent">Sprint Planning</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:14px;padding:18px 22px;background:var(--amber-light);border-radius:16px;border:1.5px solid rgba(217,119,6,0.25);">
          <span style="font-size:40px;">🗓️</span>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#78350f;">Sprint Planning</div>
            <div style="font-size:var(--small);color:var(--slate);">Attended by the entire Scrum Team — timeboxed to max 8 hours for a 4-week Sprint</div>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Three Topics Addressed</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:var(--green-light);border-radius:16px;padding:20px 22px;border:1px solid rgba(5,150,105,0.2);">
            <div style="font-size:var(--small);font-weight:700;color:var(--green);margin-bottom:6px;">Topic 1 — WHY is this Sprint valuable?</div>
            <div style="font-size:var(--tiny);color:var(--slate);line-height:1.5;">The PO proposes how the Sprint can increase value. The team collaboratively defines the <strong>Sprint Goal</strong>.</div>
          </div>
          <div style="background:var(--cyan-light);border-radius:16px;padding:20px 22px;border:1px solid rgba(8,145,178,0.2);">
            <div style="font-size:var(--small);font-weight:700;color:var(--cyan);margin-bottom:6px;">Topic 2 — WHAT can be Done this Sprint?</div>
            <div style="font-size:var(--tiny);color:var(--slate);line-height:1.5;">Developers select Product Backlog items they are confident completing this Sprint. Only they can judge their capacity.</div>
          </div>
          <div style="background:var(--purple-light);border-radius:16px;padding:20px 22px;border:1px solid rgba(124,58,237,0.2);">
            <div style="font-size:var(--small);font-weight:700;color:var(--purple);margin-bottom:6px;">Topic 3 — HOW will the work get done?</div>
            <div style="font-size:var(--tiny);color:var(--slate);line-height:1.5;">Developers decompose selected items into tasks (often under 1 day each). This creates the Sprint Backlog.</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="callout callout-green">
          <strong>Output:</strong> A Sprint Backlog containing the Sprint Goal, selected PBIs, and a plan (tasks) for delivering the Increment.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Story Point Estimation</div>
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div style="font-size:var(--tiny);color:var(--slate);line-height:1.65;margin-bottom:14px;">Teams use <strong>story points</strong> (Fibonacci: 1,2,3,5,8,13,21…) to estimate effort. Points are relative — "8" means roughly 8 times harder than a "1".</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <div style="background:var(--green-light);border-radius:10px;padding:10px 16px;text-align:center;">
              <div style="font-size:var(--body);font-weight:700;color:var(--green);">1–3</div>
              <div style="font-size:20px;color:var(--slate);">Small</div>
            </div>
            <div style="background:var(--amber-light);border-radius:10px;padding:10px 16px;text-align:center;">
              <div style="font-size:var(--body);font-weight:700;color:var(--amber);">5–8</div>
              <div style="font-size:20px;color:var(--slate);">Medium</div>
            </div>
            <div style="background:var(--red-light);border-radius:10px;padding:10px 16px;text-align:center;">
              <div style="font-size:var(--body);font-weight:700;color:var(--red);">13+</div>
              <div style="font-size:20px;color:var(--slate);">Large → Split!</div>
            </div>
          </div>
        </div>
        <div class="callout callout-amber">
          <strong>Velocity:</strong> The total story points completed in a Sprint. Used to forecast future sprint capacity (e.g. "our average velocity is 32 points per sprint").
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 17. Daily Scrum ───────────────────────────────────────────────────────
  {
    classes: '',
    label: '17 Daily Scrum (Standup)',
    html: `
    <div class="section-label">Event 3</div>
    <div class="slide-title">The <span class="accent">Daily Scrum</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:16px;padding:20px 24px;background:var(--cyan-light);border-radius:18px;border:1.5px solid rgba(8,145,178,0.25);">
          <span style="font-size:48px;">🌅</span>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#0e4f5c;">Daily Scrum (Standup)</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;"><strong>15 minutes · Every day · Same time &amp; place</strong> · For Developers only</div>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Purpose</div>
        <div class="callout callout-cyan">
          Inspect progress toward the <strong>Sprint Goal</strong> and adapt the Sprint Backlog as necessary — adjusting the upcoming planned work.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Three Classic Questions</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="display:flex;gap:16px;align-items:flex-start;padding:16px 20px;background:white;border-radius:14px;border:1.5px solid rgba(5,150,105,0.2);">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;">1</div>
            <div style="font-size:var(--small);padding-top:4px;line-height:1.5;"><strong>What did I do yesterday</strong> that helped the team meet the Sprint Goal?</div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;padding:16px 20px;background:white;border-radius:14px;border:1.5px solid rgba(8,145,178,0.2);">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--cyan);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;">2</div>
            <div style="font-size:var(--small);padding-top:4px;line-height:1.5;"><strong>What will I do today</strong> to help the team meet the Sprint Goal?</div>
          </div>
          <div style="display:flex;gap:16px;align-items:flex-start;padding:16px 20px;background:white;border-radius:14px;border:1.5px solid rgba(220,38,38,0.2);">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--red);color:white;display:flex;align-items:center;justify-content:center;font-size:var(--small);font-weight:700;flex-shrink:0;">3</div>
            <div style="font-size:var(--small);padding-top:4px;line-height:1.5;"><strong>Is there any impediment</strong> blocking me or the team from reaching the Sprint Goal?</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Key Rules</div>
        <ul class="check" style="gap:12px;">
          <li style="font-size:var(--body);">Strictly <strong>15 minutes</strong> — stand up to keep it short</li>
          <li style="font-size:var(--body);"><strong>Developers only</strong> — Scrum Master attends if needed, PO optional</li>
          <li style="font-size:var(--body);">Same time, same place every day for predictability</li>
          <li style="font-size:var(--body);">Not a status report to management — for the team</li>
          <li style="font-size:var(--body);">Impediments are noted; solved in <em>offline</em> conversation</li>
        </ul>
        <div class="callout callout-amber" style="margin-top:8px;">
          <strong>⚠️ Anti-pattern:</strong> Turning the Daily Scrum into a problem-solving session. Raise the issue, agree to discuss it after — keep the standup moving.
        </div>
        <div class="callout callout-green" style="margin-top:4px;">
          <strong>Impact:</strong> Eliminates the need for other meetings. Keeps the team aligned, surfaces blockers early, and creates team ownership of the Sprint Goal.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 18. Sprint Review ─────────────────────────────────────────────────────
  {
    classes: '',
    label: '18 Sprint Review',
    html: `
    <div class="section-label">Event 4</div>
    <div class="slide-title"><span class="accent">Sprint Review</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:16px;padding:20px 24px;background:var(--purple-light);border-radius:18px;border:1.5px solid rgba(124,58,237,0.25);">
          <span style="font-size:48px;">🎯</span>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:#4c1d95;">Sprint Review</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">End of Sprint · Max 4 hours · Entire Scrum Team + Stakeholders</div>
          </div>
        </div>
        <div class="callout callout-purple">
          The Scrum Team presents the results of their work to stakeholders and discusses <strong>progress toward the Product Goal</strong>. The Product Backlog may be adjusted based on feedback.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">What Happens</div>
        <div class="step-list">
          <div class="step-item"><div class="step-num" style="background:var(--purple);">1</div><div style="font-size:var(--small);line-height:1.6;">PO explains what was planned and what was completed</div></div>
          <div class="step-item"><div class="step-num" style="background:var(--purple);">2</div><div style="font-size:var(--small);line-height:1.6;">Developers <strong>demo</strong> the working increment — live demonstration</div></div>
          <div class="step-item"><div class="step-num" style="background:var(--purple);">3</div><div style="font-size:var(--small);line-height:1.6;">Stakeholders provide <strong>feedback</strong> — new ideas, adjustments</div></div>
          <div class="step-item"><div class="step-num" style="background:var(--purple);">4</div><div style="font-size:var(--small);line-height:1.6;">PO updates the <strong>Product Backlog</strong> based on discussion</div></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Who Attends</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);">
            <span style="font-size:28px;">🏆</span><span style="font-size:var(--small);">Product Owner — presents &amp; accepts work</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);">
            <span style="font-size:28px;">👩‍💻</span><span style="font-size:var(--small);">Developers — demo the increment live</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:white;border-radius:12px;border:1px solid rgba(0,0,0,0.08);">
            <span style="font-size:28px;">🛡️</span><span style="font-size:var(--small);">Scrum Master — facilitates the event</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--purple-light);border-radius:12px;border:1px solid rgba(124,58,237,0.2);">
            <span style="font-size:28px;">🏢</span><span style="font-size:var(--small);"><strong>Stakeholders</strong> — customers, managers, end users</span>
          </div>
        </div>
        <div class="callout callout-amber" style="margin-top:4px;">
          <strong>Key difference:</strong> Sprint Review is NOT a sign-off meeting. It's a collaborative working session for inspecting the increment and adapting the backlog.
        </div>
        <div class="callout callout-green">
          <strong>Output:</strong> A revised Product Backlog that defines probable items for next Sprint based on feedback received.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 19. Sprint Retrospective ──────────────────────────────────────────────
  {
    classes: '',
    label: '19 Sprint Retrospective',
    html: `
    <div class="section-label">Event 5</div>
    <div class="slide-title"><span class="accent">Sprint Retrospective</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div style="display:flex;align-items:center;gap:16px;padding:20px 24px;background:var(--green-light);border-radius:18px;border:1.5px solid rgba(5,150,105,0.25);">
          <span style="font-size:48px;">💡</span>
          <div>
            <div style="font-size:var(--body);font-weight:700;color:var(--green-dark);">Sprint Retrospective</div>
            <div style="font-size:var(--small);color:var(--slate);margin-top:4px;">End of Sprint · Max 3 hours · Scrum Team only (no external stakeholders)</div>
          </div>
        </div>
        <div class="callout callout-green">
          The team inspects <em>how they worked</em> — not what they built. The goal is to identify <strong>improvements</strong> to quality and effectiveness for the next Sprint.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Three Classic Questions</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;gap:14px;align-items:flex-start;padding:16px 20px;background:var(--green-light);border-radius:14px;border:1px solid rgba(5,150,105,0.2);">
            <span style="font-size:32px;">😊</span>
            <div style="font-size:var(--small);line-height:1.5;"><strong>What went well</strong> this Sprint? (Keep doing these)</div>
          </div>
          <div style="display:flex;gap:14px;align-items:flex-start;padding:16px 20px;background:var(--red-light);border-radius:14px;border:1px solid rgba(220,38,38,0.2);">
            <span style="font-size:32px;">😔</span>
            <div style="font-size:var(--small);line-height:1.5;"><strong>What did not go well?</strong> (Stop doing or change)</div>
          </div>
          <div style="display:flex;gap:14px;align-items:flex-start;padding:16px 20px;background:var(--amber-light);border-radius:14px;border:1px solid rgba(217,119,6,0.2);">
            <span style="font-size:32px;">🚀</span>
            <div style="font-size:var(--small);line-height:1.5;"><strong>What improvements</strong> will we commit to next Sprint?</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">What is Inspected</div>
        <ul class="check" style="gap:12px;">
          <li style="font-size:var(--body);"><strong>Individuals</strong> — team dynamics, communication</li>
          <li style="font-size:var(--body);"><strong>Interactions</strong> — how the team collaborates</li>
          <li style="font-size:var(--body);"><strong>Processes</strong> — workflow, ceremonies, practices</li>
          <li style="font-size:var(--body);"><strong>Tools</strong> — Jira, Confluence, CI/CD pipelines</li>
          <li style="font-size:var(--body);"><strong>Definition of Done</strong> — is it still appropriate?</li>
        </ul>
        <div class="callout callout-cyan" style="margin-top:4px;">
          <strong>Output:</strong> The most impactful improvement items are added to the Sprint Backlog for the next Sprint — so improvements happen immediately.
        </div>
        <div class="callout callout-amber">
          <strong>Safe space:</strong> What's said in the Retro stays in the Retro. Psychological safety is essential for honest, productive retrospectives.
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 20. User Stories ──────────────────────────────────────────────────────
  {
    classes: '',
    label: '20 User Stories',
    html: `
    <div class="section-label">Backlog Items</div>
    <div class="slide-title"><span class="accent">User Stories</span> &amp; Acceptance Criteria</div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:18px;">
        <div class="callout callout-green">
          A <strong>User Story</strong> is a short, plain-language description of a feature from the perspective of the end user. It captures <em>who</em> wants something, <em>what</em> they want, and <em>why</em>.
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Standard Format</div>
        <div style="background:white;border-radius:18px;padding:28px 32px;border:2px solid var(--green);">
          <div style="font-size:var(--body);font-family:'DM Mono',monospace;line-height:2;">
            <span style="color:var(--green);font-weight:700;">As a</span> &nbsp;<span style="background:var(--green-light);padding:2px 12px;border-radius:6px;">[type of user]</span><br/>
            <span style="color:var(--cyan);font-weight:700;">I want</span> &nbsp;<span style="background:var(--cyan-light);padding:2px 12px;border-radius:6px;">[to perform some action]</span><br/>
            <span style="color:var(--amber);font-weight:700;">So that</span> <span style="background:var(--amber-light);padding:2px 12px;border-radius:6px;">[I can achieve some goal]</span>
          </div>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;">Example Stories</div>
        <div style="background:white;border-radius:14px;padding:18px 22px;border:1px solid rgba(5,150,105,0.2);font-size:var(--tiny);line-height:1.7;">
          🟢 <strong>As a</strong> student, <strong>I want</strong> to view my attendance record, <strong>so that</strong> I know if I am at risk of failing due to absences.
        </div>
        <div style="background:white;border-radius:14px;padding:18px 22px;border:1px solid rgba(8,145,178,0.2);font-size:var(--tiny);line-height:1.7;">
          🔵 <strong>As a</strong> lecturer, <strong>I want</strong> to export attendance to CSV, <strong>so that</strong> I can share it with administration quickly.
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">Acceptance Criteria</div>
        <div class="callout callout-cyan">
          <strong>Acceptance Criteria</strong> define the specific conditions a story must meet to be considered Done. Written by the Product Owner — verified by the team.
        </div>
        <div style="background:white;border-radius:16px;padding:20px 24px;border:1.5px solid rgba(0,0,0,0.08);">
          <div style="font-size:var(--tiny);font-weight:700;color:var(--cyan);margin-bottom:10px;">Example AC for "view attendance record":</div>
          <ul class="check" style="gap:7px;">
            <li style="font-size:var(--tiny);">Student can see attendance % per subject</li>
            <li style="font-size:var(--tiny);">Dates of absences shown chronologically</li>
            <li style="font-size:var(--tiny);">A warning appears if attendance &lt; 80%</li>
            <li style="font-size:var(--tiny);">Page loads in under 2 seconds</li>
            <li style="font-size:var(--tiny);">Works on mobile and desktop browsers</li>
          </ul>
        </div>
        <div style="font-size:var(--small);font-weight:700;color:var(--slate);letter-spacing:0.08em;text-transform:uppercase;">INVEST Criteria for Good Stories</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <span class="badge badge-green">I — Independent</span>
          <span class="badge badge-cyan">N — Negotiable</span>
          <span class="badge badge-amber">V — Valuable</span>
          <span class="badge badge-purple">E — Estimable</span>
          <span class="badge badge-red">S — Small</span>
          <span class="badge" style="background:#0d9488;color:#fff;">T — Testable</span>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 21. Scrum Board ───────────────────────────────────────────────────────
  {
    classes: '',
    label: '21 Scrum Board (Kanban)',
    html: `
    <div class="section-label">Visual Management</div>
    <div class="slide-title">The <span class="accent">Scrum Board</span></div>
    <div style="margin-bottom:14px;font-size:var(--small);color:var(--slate);">A physical or digital board (e.g. Jira, Trello) tracking Sprint Backlog items across workflow stages. Updated daily at the Daily Scrum.</div>
    <div class="four-col" style="flex:1;">
      <div class="kanban-col" style="background:rgba(100,116,139,0.07);border:1.5px solid rgba(100,116,139,0.2);">
        <div class="kanban-header" style="color:var(--slate);border-bottom:3px solid var(--slate);">📋 TO DO</div>
        <div class="kanban-card" style="border-left-color:var(--slate);">User login page</div>
        <div class="kanban-card" style="border-left-color:var(--slate);">Password reset flow</div>
        <div class="kanban-card" style="border-left-color:var(--slate);">Email notifications</div>
        <div class="kanban-card" style="border-left-color:var(--slate);">Profile photo upload</div>
      </div>
      <div class="kanban-col" style="background:rgba(217,119,6,0.06);border:1.5px solid rgba(217,119,6,0.25);">
        <div class="kanban-header" style="color:var(--amber);border-bottom:3px solid var(--amber);">⚙️ IN PROGRESS</div>
        <div class="kanban-card" style="border-left-color:var(--amber);">User registration form<div style="margin-top:6px;font-size:18px;color:var(--amber);">👤 Sarah</div></div>
        <div class="kanban-card" style="border-left-color:var(--amber);">Dashboard UI layout<div style="margin-top:6px;font-size:18px;color:var(--amber);">👤 James</div></div>
      </div>
      <div class="kanban-col" style="background:rgba(8,145,178,0.06);border:1.5px solid rgba(8,145,178,0.25);">
        <div class="kanban-header" style="color:var(--cyan);border-bottom:3px solid var(--cyan);">🔍 IN REVIEW / QA</div>
        <div class="kanban-card" style="border-left-color:var(--cyan);">API authentication endpoint<div style="margin-top:6px;font-size:18px;color:var(--cyan);">👤 Priya reviewing</div></div>
        <div class="kanban-card" style="border-left-color:var(--cyan);">Database schema migration<div style="margin-top:6px;font-size:18px;color:var(--cyan);">👤 Mark reviewing</div></div>
      </div>
      <div class="kanban-col" style="background:rgba(5,150,105,0.06);border:1.5px solid rgba(5,150,105,0.25);">
        <div class="kanban-header" style="color:var(--green);border-bottom:3px solid var(--green);">✅ DONE</div>
        <div class="kanban-card" style="border-left-color:var(--green);">Project scaffolding &amp; CI setup</div>
        <div class="kanban-card" style="border-left-color:var(--green);">Database design &amp; ERD</div>
        <div class="kanban-card" style="border-left-color:var(--green);">Tech stack decision</div>
        <div class="kanban-card" style="border-left-color:var(--green);">Sprint 0 planning complete</div>
      </div>
    </div>
    <div style="margin-top:14px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
      <div style="font-size:var(--tiny);color:var(--slate);">Popular tools:</div>
      <span class="badge" style="background:#0052cc;color:#fff;">Jira</span>
      <span class="badge" style="background:#0079bf;color:#fff;">Trello</span>
      <span class="badge" style="background:#6366f1;color:#fff;">Linear</span>
      <span class="badge" style="background:#333;color:#fff;">GitHub Projects</span>
      <span class="badge" style="background:#059669;color:#fff;">Azure DevOps</span>
      <div style="font-size:var(--tiny);color:var(--slate);margin-left:8px;">Or a physical whiteboard with sticky notes!</div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },

  // ── 22. Scrum in IT Industry ──────────────────────────────────────────────
  {
    classes: 'dark-green',
    label: '22 Scrum in IT Industry',
    html: `
    <div class="deco-circle" style="width:600px;height:600px;background:radial-gradient(circle,rgba(52,211,153,0.12) 0%,transparent 70%);right:-80px;top:-100px;"></div>
    <div class="section-label">Real World · IT Industry</div>
    <div class="slide-title">Scrum in the <span class="accent">IT Industry</span></div>
    <div class="two-col">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:#34d399;letter-spacing:0.08em;text-transform:uppercase;">Where Scrum is Used</div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">🌐</span><span style="font-size:var(--small);"><strong>Web &amp; Mobile App Development</strong> — React, iOS, Android products</span>
          </div>
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">☁️</span><span style="font-size:var(--small);"><strong>Cloud &amp; SaaS Platforms</strong> — AWS, Azure product teams</span>
          </div>
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">🤖</span><span style="font-size:var(--small);"><strong>AI / Data Science Projects</strong> — model development cycles</span>
          </div>
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">🔒</span><span style="font-size:var(--small);"><strong>Cybersecurity &amp; Networking</strong> — vulnerability management</span>
          </div>
          <div style="display:flex;gap:14px;align-items:center;padding:14px 18px;background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:32px;">🏦</span><span style="font-size:var(--small);"><strong>Enterprise IT</strong> — SAP, ERP, CRM implementations</span>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:var(--small);font-weight:700;color:#34d399;letter-spacing:0.08em;text-transform:uppercase;">Business Benefits</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);border-radius:16px;padding:18px 16px;text-align:center;">
            <div style="font-size:44px;">⚡</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#34d399;margin-top:8px;">Faster Delivery</div>
            <div style="font-size:20px;color:rgba(255,255,255,0.6);margin-top:4px;">Value shipped every 1-4 weeks</div>
          </div>
          <div style="background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);border-radius:16px;padding:18px 16px;text-align:center;">
            <div style="font-size:44px;">🎯</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#fbbf24;margin-top:8px;">Lower Risk</div>
            <div style="font-size:20px;color:rgba(255,255,255,0.6);margin-top:4px;">Problems caught early &amp; often</div>
          </div>
          <div style="background:rgba(34,211,238,0.12);border:1px solid rgba(34,211,238,0.3);border-radius:16px;padding:18px 16px;text-align:center;">
            <div style="font-size:44px;">🤝</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#22d3ee;margin-top:8px;">Better Collaboration</div>
            <div style="font-size:20px;color:rgba(255,255,255,0.6);margin-top:4px;">Daily communication &amp; alignment</div>
          </div>
          <div style="background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.3);border-radius:16px;padding:18px 16px;text-align:center;">
            <div style="font-size:44px;">📈</div>
            <div style="font-size:var(--tiny);font-weight:700;color:#a78bfa;margin-top:8px;">Continuous Improvement</div>
            <div style="font-size:20px;color:rgba(255,255,255,0.6);margin-top:4px;">Retrospectives drive growth</div>
          </div>
        </div>
        <div style="text-align:center;margin-top:8px;padding:16px 20px;background:rgba(52,211,153,0.1);border-radius:14px;border:1px solid rgba(52,211,153,0.25);">
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.55);">Industry adoption</div>
          <div style="font-size:var(--body);font-weight:700;color:#34d399;">87% of Agile teams use Scrum</div>
          <div style="font-size:var(--tiny);color:rgba(255,255,255,0.45);">Source: 17th State of Agile Report</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
];

export default function AgileScrumDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  useEffect(() => {
    const styleId = 'scrum-deck-styles';
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrent(c => Math.max(c - 1, 0))}
            disabled={current === 0}
            className="p-1.5 rounded-lg border disabled:opacity-30 transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(5,150,105,0.3)' }}
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
            style={{ borderColor: 'rgba(5,150,105,0.3)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <span className="text-xs font-medium text-gray-400 hidden sm:block">{slide.label}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(5,150,105,0.3)' }}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={fullscreen ? exitFs : goFs}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(5,150,105,0.3)' }}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="scrum relative w-full overflow-hidden rounded-xl"
        style={{ border: '1px solid rgba(5,150,105,0.3)' }}
      >
        <div ref={canvasRef} style={{ width: 1920, height: 1080 }}>
          <section
            className={slide.classes}
            style={slide.bg ? { background: slide.bg } : undefined}
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
              background: i === current ? '#059669' : 'rgba(5,150,105,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
