import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

.norm *{box-sizing:border-box;margin:0;padding:0}
.norm{font-family:'DM Sans',sans-serif;--title:64px;--subtitle:44px;--body:32px;--small:26px;--tiny:24px;--px:110px;--pt:96px;--pb:80px;--title-gap:48px;--item-gap:26px;--navy:#0d1b2a;--navy2:#132337;--blue:oklch(62% 0.18 250);--blue-light:oklch(94% 0.06 250);--amber:oklch(72% 0.17 55);--amber-light:oklch(96% 0.05 55);--green:oklch(62% 0.16 155);--green-light:oklch(94% 0.05 155);--red:oklch(58% 0.18 22);--red-light:oklch(95% 0.05 22);--white:#f8fafc;--off-white:#f1f5f9;--slate:#64748b;--text:#0f172a}
.norm section{width:1920px;height:1080px;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:var(--pt) var(--px) var(--pb);background:var(--white);color:var(--text)}
.norm section.dark{background:var(--navy);color:var(--white)}
.norm section.dark2{background:var(--navy2);color:var(--white)}
.norm .slide-title{font-size:var(--title);font-weight:700;line-height:1.1;letter-spacing:-0.02em;margin-bottom:var(--title-gap);text-wrap:pretty}
.norm .slide-title .accent{color:var(--blue)}
.norm section.dark .slide-title .accent{color:var(--amber)}
.norm .slide-subtitle{font-size:var(--subtitle);font-weight:400;opacity:0.75;margin-bottom:var(--item-gap)}
.norm .body{font-size:var(--body);line-height:1.55}
.norm .small{font-size:var(--small);line-height:1.5}
.norm .tiny{font-size:var(--tiny);line-height:1.5}
.norm .badge{display:inline-block;font-size:var(--small);font-weight:600;padding:6px 22px;border-radius:999px;letter-spacing:0.04em}
.norm .badge-blue{background:var(--blue);color:#fff}
.norm .badge-amber{background:var(--amber);color:#fff}
.norm .badge-green{background:var(--green);color:#fff}
.norm .badge-red{background:var(--red);color:#fff}
.norm .section-label{font-size:var(--small);font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--blue);margin-bottom:24px}
.norm section.dark .section-label{color:var(--amber)}
.norm table{border-collapse:collapse;font-size:var(--small);width:100%;font-family:'DM Mono',monospace}
.norm th{background:var(--navy);color:#fff;padding:14px 20px;text-align:left;font-weight:500;font-size:var(--tiny);letter-spacing:0.05em}
.norm td{padding:12px 20px;border-bottom:1.5px solid #e2e8f0;vertical-align:middle}
.norm tr:nth-child(even) td{background:#f8fafc}
.norm tr:hover td{background:var(--blue-light)}
.norm .tbl-bad th{background:var(--red)}
.norm .tbl-good th{background:var(--green)}
.norm .tbl-neutral th{background:#334155}
.norm .cell-bad{background:oklch(92% 0.06 22)!important;color:var(--red);font-weight:600}
.norm .cell-ok{background:oklch(93% 0.05 155)!important;color:var(--green);font-weight:600}
.norm .cell-pk{background:oklch(93% 0.05 250)!important;color:var(--blue);font-weight:700}
.norm .callout{border-radius:16px;padding:28px 36px;font-size:var(--body);line-height:1.5}
.norm .callout-blue{background:var(--blue-light);border-left:6px solid var(--blue)}
.norm .callout-amber{background:var(--amber-light);border-left:6px solid var(--amber)}
.norm .callout-green{background:var(--green-light);border-left:6px solid var(--green)}
.norm .callout-red{background:var(--red-light);border-left:6px solid var(--red)}
.norm .callout strong{font-weight:700}
.norm .formula{font-family:'DM Mono',monospace;font-size:var(--subtitle);font-weight:500;color:var(--blue);background:var(--blue-light);border-radius:12px;padding:20px 36px;display:inline-block;letter-spacing:0.02em}
.norm section.dark .formula{color:var(--amber);background:rgba(255,255,255,0.08)}
.norm .dep{font-family:'DM Mono',monospace;font-size:var(--body);color:var(--blue);background:var(--blue-light);padding:10px 24px;border-radius:8px;display:inline-block;margin:6px 0}
.norm .dep-bad{color:var(--red);background:var(--red-light)}
.norm .dep-good{color:var(--green);background:var(--green-light)}
.norm ul.styled{list-style:none}
.norm ul.styled li{font-size:var(--body);line-height:1.6;padding:10px 0 10px 44px;position:relative;border-bottom:1px solid rgba(0,0,0,0.06)}
.norm ul.styled li:last-child{border-bottom:none}
.norm ul.styled li::before{content:'';position:absolute;left:0;top:18px;width:18px;height:18px;border-radius:50%;background:var(--blue)}
.norm section.dark ul.styled li::before{background:var(--amber)}
.norm section.dark ul.styled li{border-bottom:1px solid rgba(255,255,255,0.08)}
.norm .two-col{display:grid;grid-template-columns:1fr 1fr;gap:48px;flex:1;align-items:start}
.norm .two-col.wide{grid-template-columns:1.1fr 0.9fr}
.norm .activity-num{font-size:180px;font-weight:700;line-height:1;color:var(--amber);opacity:0.18;position:absolute;right:80px;top:40px;font-family:'DM Mono',monospace;pointer-events:none}
.norm .copyright{position:absolute;bottom:24px;left:0;right:0;text-align:center;font-size:24px;color:rgba(0,0,0,0.25);letter-spacing:0.04em}
.norm section.dark .copyright{color:rgba(255,255,255,0.22)}
.norm .nf-bar{display:flex;gap:0;border-radius:12px;overflow:hidden;margin-bottom:40px;height:52px;min-height:52px;flex-shrink:0;font-size:var(--small);font-weight:600;letter-spacing:0.04em}
.norm .nf-bar-item{flex:1;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);background:#334155}
.norm .nf-bar-item.active{background:var(--blue);color:#fff}
.norm .nf-bar-item.done{background:#1e3a5f;color:rgba(255,255,255,0.4)}
.norm .answer-box{border-radius:16px;background:var(--green-light);border:2.5px solid var(--green);padding:28px 36px}
.norm .answer-label{font-size:var(--small);font-weight:700;color:var(--green);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px}
.norm .title-slide-inner{display:flex;flex-direction:column;justify-content:center;height:100%;max-width:1100px}
.norm .main-title{font-size:90px;font-weight:700;line-height:1.05;letter-spacing:-0.03em;color:#fff;margin-bottom:36px}
.norm .main-title span{color:var(--amber)}
.norm .anomaly-cards{display:flex;gap:32px;flex:1;align-items:stretch}
.norm .anomaly-card{flex:1;border-radius:20px;padding:32px 32px 28px;display:flex;flex-direction:column;gap:16px}
.norm .anomaly-card .ac-title{font-size:var(--body);font-weight:700}
.norm .anomaly-card .ac-desc{font-size:var(--small);line-height:1.5;flex:1}
.norm .anomaly-card .ac-example{font-size:var(--tiny);font-family:'DM Mono',monospace;background:rgba(0,0,0,0.06);border-radius:8px;padding:10px 14px;line-height:1.5}
.norm .summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;flex:1}
.norm .summary-card{border-radius:18px;padding:32px 36px;display:flex;flex-direction:column;gap:14px;color:var(--text)}
.norm .summary-card .sc-nf{font-size:var(--subtitle);font-weight:700;font-family:'DM Mono',monospace}
.norm .summary-card .sc-rule{font-size:var(--small);font-weight:600;line-height:1.4}
.norm .summary-card .sc-ex{font-size:var(--tiny);opacity:0.75;line-height:1.4}
.norm .visual-box{padding:24px 40px;border-radius:16px;font-size:40px;font-weight:700;display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1)}
.norm .visual-arrow{font-size:60px;color:var(--slate);font-weight:300}`;

const SLIDES: { classes: string; label: string; html: string; bg?: string }[] = [
  {
    classes: 'dark',
    label: '01 Title',
    html: `
    <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.04;pointer-events:none" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      <defs><pattern id="norm-grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" stroke-width="1"/></pattern></defs>
      <rect width="1920" height="1080" fill="url(#norm-grid)"/>
    </svg>
    <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--blue);"></div>
    <div style="position:absolute;right:180px;bottom:160px;width:320px;height:320px;border-radius:50%;border:3px solid var(--amber);opacity:0.15;"></div>
    <div style="position:absolute;right:280px;bottom:220px;width:180px;height:180px;border-radius:50%;background:var(--amber);opacity:0.08;"></div>
    <div class="title-slide-inner" style="padding-left:8px;">
      <div style="margin-bottom:32px;">
        <span class="badge badge-blue">CS / Database Systems</span>
      </div>
      <div class="main-title">Database<br/><span>Normalization</span> &amp;<br/>Functional Dependencies</div>
      <div style="font-size:var(--body);color:rgba(255,255,255,0.55);max-width:760px;line-height:1.6;">
        Understanding 1NF, 2NF, 3NF, BCNF and Decomposition with real-world examples and hands-on activities.
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '02 Why Normalize',
    html: `
    <div class="section-label">The Problem</div>
    <div class="slide-title">What goes wrong without <span class="accent">normalization?</span></div>
    <div style="margin-bottom:32px;">
      <div style="font-size:var(--small);font-weight:600;margin-bottom:10px;color:var(--slate);">⚠ Unnormalized table: Student_Courses</div>
      <table class="tbl-bad">
        <thead><tr><th>StudentID</th><th>StudentName</th><th>Dept</th><th>DeptHead</th><th>Courses</th><th>Instructor</th></tr></thead>
        <tbody>
          <tr><td class="cell-pk">S1</td><td>Alice</td><td>CS</td><td>Dr. Smith</td><td class="cell-bad">DB, OS, Networks</td><td class="cell-bad">Prof. Lee, Prof. Ray, Prof. Kim</td></tr>
          <tr><td class="cell-pk">S2</td><td>Bob</td><td>CS</td><td>Dr. Smith</td><td class="cell-bad">DB, AI</td><td class="cell-bad">Prof. Lee, Prof. Patel</td></tr>
          <tr><td class="cell-pk">S3</td><td>Carol</td><td>Math</td><td>Dr. Jones</td><td class="cell-bad">Calculus</td><td class="cell-bad">Prof. Wang</td></tr>
          <tr><td class="cell-pk">S3</td><td>Carol</td><td>Math</td><td>Dr. Jones</td><td class="cell-bad">Statistics</td><td class="cell-bad">Prof. Hill</td></tr>
        </tbody>
      </table>
    </div>
    <div class="anomaly-cards">
      <div class="anomaly-card" style="background:var(--red-light);border:2px solid var(--red);">
        <div class="ac-title" style="color:var(--red);">🔴 Update Anomaly</div>
        <div class="ac-desc">If Dr. Smith leaves, we must update <em>every row</em> for CS students — miss one and data is inconsistent.</div>
        <div class="ac-example">DeptHead = "Dr. Smith" repeated in S1 AND S2 rows</div>
      </div>
      <div class="anomaly-card" style="background:var(--amber-light);border:2px solid var(--amber);">
        <div class="ac-title" style="color:var(--amber);">🟡 Insertion Anomaly</div>
        <div class="ac-desc">We cannot add a new department unless at least one student is enrolled in it — student data is required!</div>
        <div class="ac-example">Can't record "Physics dept, Head: Dr. Gupta" alone</div>
      </div>
      <div class="anomaly-card" style="background:var(--blue-light);border:2px solid var(--blue);">
        <div class="ac-title" style="color:var(--blue);">🔵 Deletion Anomaly</div>
        <div class="ac-desc">If Carol drops Statistics, we lose the fact that Prof. Hill teaches Statistics entirely from our database.</div>
        <div class="ac-example">Deleting S3's Statistics row erases Prof. Hill's record</div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 'dark',
    label: '03 Functional Dependencies',
    html: `
    <div class="section-label">Core Concept</div>
    <div class="slide-title">Functional <span class="accent">Dependencies</span></div>
    <div class="two-col" style="align-items:start;gap:80px;">
      <div>
        <div style="font-size:var(--body);color:rgba(255,255,255,0.75);margin-bottom:32px;line-height:1.6;">
          Attribute <strong style="color:#fff;">Y</strong> is <em>functionally dependent</em> on <strong style="color:#fff;">X</strong> if knowing X uniquely determines the value of Y.
        </div>
        <div class="formula">X → Y</div>
        <div style="margin-top:20px;font-size:var(--small);color:rgba(255,255,255,0.55);">"X determines Y" &nbsp;·&nbsp; "Y depends on X"</div>
        <div style="margin-top:44px;">
          <div style="font-size:var(--small);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--amber);margin-bottom:20px;">Key Terminology</div>
          <ul class="styled">
            <li><strong>Determinant</strong> — the left-hand side (X)</li>
            <li><strong>Dependent</strong> — the right-hand side (Y)</li>
            <li><strong>Candidate Key</strong> — minimal set that determines all attributes</li>
            <li><strong>Prime Attribute</strong> — part of any candidate key</li>
          </ul>
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--amber);margin-bottom:20px;">Real-world examples</div>
        <div style="display:flex;flex-direction:column;gap:18px;">
          <div style="background:rgba(255,255,255,0.07);border-radius:14px;padding:24px 28px;">
            <div class="dep" style="color:var(--amber);background:rgba(255,255,255,0.1);">StudentID → StudentName</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.6);margin-top:10px;">One student ID maps to exactly one name</div>
          </div>
          <div style="background:rgba(255,255,255,0.07);border-radius:14px;padding:24px 28px;">
            <div class="dep" style="color:var(--amber);background:rgba(255,255,255,0.1);">Dept → DeptHead</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.6);margin-top:10px;">Each department has exactly one head</div>
          </div>
          <div style="background:rgba(255,255,255,0.07);border-radius:14px;padding:24px 28px;">
            <div class="dep" style="color:var(--amber);background:rgba(255,255,255,0.1);">{OrderID, ProductID} → Quantity</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.6);margin-top:10px;">Composite key: need both to know the quantity</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '04 Visual: 1NF',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item active">1NF</div>
      <div class="nf-bar-item">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title" style="text-align:center;margin-top:40px;">1NF in a Nutshell:<br/><span class="accent">Break apart the lists</span></div>
    <div style="display:flex;justify-content:center;align-items:center;flex:1;gap:60px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:20px;">
        <div class="visual-box" style="background:var(--red-light);border:4px solid var(--red);color:var(--red);">[ 🍎, 🍌, 🍒 ]</div>
        <div style="font-size:var(--small);color:var(--slate);font-weight:600;text-transform:uppercase;">Multi-valued (Bad)</div>
      </div>
      <div class="visual-arrow">➔</div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:20px;">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="visual-box" style="background:var(--green-light);border:4px solid var(--green);color:var(--green);">🍎</div>
          <div class="visual-box" style="background:var(--green-light);border:4px solid var(--green);color:var(--green);">🍌</div>
          <div class="visual-box" style="background:var(--green-light);border:4px solid var(--green);color:var(--green);">🍒</div>
        </div>
        <div style="font-size:var(--small);color:var(--slate);font-weight:600;text-transform:uppercase;">Atomic Values (Good)</div>
      </div>
    </div>
    <h2 style="text-align:center;color:var(--slate);font-size:var(--body);font-weight:500;margin-bottom:60px;">
      Rule: One single value per cell. No lists or arrays allowed!
    </h2>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '05 1NF Concept',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item active">1NF</div>
      <div class="nf-bar-item">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">First Normal Form <span class="accent">(1NF)</span></div>
    <div class="two-col wide">
      <div>
        <div class="callout callout-blue" style="margin-bottom:32px;">
          <strong>Definition:</strong> A table is in 1NF if every cell contains a single, atomic (indivisible) value and each column holds only one type of data.
        </div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:16px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Rules to satisfy 1NF</div>
        <ul class="styled">
          <li>No multi-valued attributes (no lists in a cell)</li>
          <li>No repeating groups of columns</li>
          <li>Each row must be uniquely identifiable (primary key exists)</li>
          <li>All values in a column must be the same data type</li>
        </ul>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:16px;letter-spacing:0.06em;text-transform:uppercase;color:var(--red);">❌ Violates 1NF</div>
        <table class="tbl-bad" style="margin-bottom:28px;">
          <thead><tr><th>OrderID</th><th>Products</th></tr></thead>
          <tbody>
            <tr><td>101</td><td class="cell-bad">Laptop, Mouse, Keyboard</td></tr>
            <tr><td>102</td><td class="cell-bad">Monitor, HDMI Cable</td></tr>
          </tbody>
        </table>
        <div style="font-size:var(--tiny);color:var(--red);margin-bottom:24px;">Multiple values in the "Products" cell — not atomic!</div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:16px;letter-spacing:0.06em;text-transform:uppercase;color:var(--green);">✅ Satisfies 1NF</div>
        <table class="tbl-good">
          <thead><tr><th>OrderID</th><th>Product</th></tr></thead>
          <tbody>
            <tr><td>101</td><td class="cell-ok">Laptop</td></tr>
            <tr><td>101</td><td class="cell-ok">Mouse</td></tr>
            <tr><td>101</td><td class="cell-ok">Keyboard</td></tr>
            <tr><td>102</td><td class="cell-ok">Monitor</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '06 1NF Example',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item active">1NF</div>
      <div class="nf-bar-item">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">1NF — <span class="accent">Library Book Example</span></div>
    <div class="two-col">
      <div>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
          <span class="badge badge-red">Before 1NF</span>
          <span style="font-size:var(--small);color:var(--slate);">Member borrows multiple books</span>
        </div>
        <table class="tbl-bad">
          <thead><tr><th>MemberID</th><th>Name</th><th>BooksCheckedOut</th><th>ReturnDates</th></tr></thead>
          <tbody>
            <tr><td>M1</td><td>Alice</td><td class="cell-bad">Harry Potter, Dune</td><td class="cell-bad">Dec 1, Dec 5</td></tr>
            <tr><td>M2</td><td>Bob</td><td class="cell-bad">1984, Brave New World, Hobbit</td><td class="cell-bad">Dec 3, Dec 3, Dec 10</td></tr>
          </tbody>
        </table>
        <div class="callout callout-red" style="margin-top:20px;font-size:var(--small);">
          <strong>Problems:</strong> BooksCheckedOut and ReturnDates are multi-valued. You can't query "who has Dune?" easily. Dates are ambiguously paired.
        </div>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
          <span class="badge badge-green">After 1NF</span>
          <span style="font-size:var(--small);color:var(--slate);">One book per row</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>MemberID</th><th>Name</th><th>Book</th><th>ReturnDate</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">M1</td><td>Alice</td><td class="cell-ok">Harry Potter</td><td>Dec 1</td></tr>
            <tr><td class="cell-pk">M1</td><td>Alice</td><td class="cell-ok">Dune</td><td>Dec 5</td></tr>
            <tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">1984</td><td>Dec 3</td></tr>
            <tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">Brave New World</td><td>Dec 3</td></tr>
            <tr><td class="cell-pk">M2</td><td>Bob</td><td class="cell-ok">The Hobbit</td><td>Dec 10</td></tr>
          </tbody>
        </table>
        <div class="callout callout-green" style="margin-top:20px;font-size:var(--small);">
          <strong>PK:</strong> (MemberID, Book) — composite key. Every cell is atomic. Easy to query!
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '07 Visual: 2NF',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item active">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title" style="text-align:center;margin-top:40px;">2NF in a Nutshell:<br/><span class="accent">Rely on the WHOLE key</span></div>
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;flex:1;gap:50px;">
      <div style="display:flex;align-items:center;gap:40px;">
        <div class="visual-box" style="background:var(--navy);color:white;">🔑 Student + 🔑 Course</div>
        <div class="visual-arrow">➔</div>
        <div class="visual-box" style="background:var(--green-light);border:4px solid var(--green);color:var(--green);">Course Grade ✅</div>
      </div>
      <div style="display:flex;align-items:center;gap:40px;">
        <div class="visual-box" style="background:var(--navy);color:white;opacity:0.6;">🔑 Student <span style="font-size:20px;margin-left:20px;font-weight:400;">(Only part of the key)</span></div>
        <div class="visual-arrow" style="color:var(--red);">➔</div>
        <div class="visual-box" style="background:var(--red-light);border:4px dashed var(--red);color:var(--red);">Student Phone ❌</div>
      </div>
    </div>
    <h2 style="text-align:center;color:var(--slate);font-size:var(--body);font-weight:500;margin-bottom:60px;">
      Rule: No "partial" dependencies. If your table has a two-part key, <br/>every other column must need BOTH parts to exist.
    </h2>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '08 2NF Concept',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item active">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">Second Normal Form <span class="accent">(2NF)</span></div>
    <div class="two-col wide">
      <div>
        <div class="callout callout-blue" style="margin-bottom:28px;">
          <strong>Definition:</strong> A table is in 2NF if it is in 1NF <em>and</em> every non-prime attribute is <em>fully functionally dependent</em> on the <strong>entire</strong> primary key (no partial dependencies).
        </div>
        <div class="callout callout-amber" style="margin-bottom:28px;">
          <strong>Partial Dependency:</strong> A non-key attribute depends on only <em>part</em> of a composite primary key.
        </div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Only matters when the PK is composite</div>
        <div style="font-size:var(--body);color:var(--text);line-height:1.6;">
          If the primary key is a <em>single</em> attribute, the table is automatically in 2NF (there's nothing to partially depend on).
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:18px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Spotting the violation</div>
        <div style="background:#f8fafc;border-radius:16px;padding:28px;border:2px solid #e2e8f0;">
          <div style="font-size:var(--small);font-weight:600;margin-bottom:14px;">Table: OrderItem (OrderID, ProductID, ProductName, Qty)</div>
          <div style="font-family:'DM Mono',monospace;font-size:var(--small);color:var(--blue);margin-bottom:8px;">PK = {OrderID, ProductID}</div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:18px;">
            <div class="dep dep-bad">{OrderID, ProductID} → Qty &nbsp;&nbsp; ✅ FULL</div>
            <div class="dep dep-bad">ProductID → ProductName &nbsp; ❌ PARTIAL</div>
          </div>
          <div style="font-size:var(--tiny);color:var(--red);margin-top:14px;line-height:1.5;">
            ProductName only depends on ProductID, not the full composite key. This is a partial dependency!
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '09 2NF Example',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item active">2NF</div>
      <div class="nf-bar-item">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">2NF — <span class="accent">Online Store Example</span></div>
    <div style="margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:10px;">
        <span class="badge badge-red">Before 2NF</span>
        <span style="font-family:'DM Mono',monospace;font-size:var(--small);color:var(--slate);">PK = {OrderID, ProductID}</span>
      </div>
      <table class="tbl-bad">
        <thead><tr><th>OrderID 🔑</th><th>ProductID 🔑</th><th>ProductName</th><th>UnitPrice</th><th>CustomerName</th><th>Qty</th></tr></thead>
        <tbody>
          <tr><td>O1</td><td>P10</td><td class="cell-bad">Laptop</td><td class="cell-bad">$999</td><td class="cell-bad">Alice</td><td>1</td></tr>
          <tr><td>O1</td><td>P20</td><td class="cell-bad">Mouse</td><td class="cell-bad">$29</td><td class="cell-bad">Alice</td><td>2</td></tr>
          <tr><td>O2</td><td>P10</td><td class="cell-bad">Laptop</td><td class="cell-bad">$999</td><td class="cell-bad">Bob</td><td>1</td></tr>
        </tbody>
      </table>
      <div style="font-size:var(--tiny);color:var(--red);margin-top:8px;">ProductName &amp; UnitPrice depend only on ProductID. CustomerName depends only on OrderID. Both are partial!</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">Orders</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: OrderID</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>OrderID</th><th>CustomerName</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">O1</td><td class="cell-ok">Alice</td></tr>
            <tr><td class="cell-pk">O2</td><td class="cell-ok">Bob</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">Products</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: ProductID</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>ProductID</th><th>ProductName</th><th>UnitPrice</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">P10</td><td class="cell-ok">Laptop</td><td>$999</td></tr>
            <tr><td class="cell-pk">P20</td><td class="cell-ok">Mouse</td><td>$29</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">OrderItems</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: {OrderID, ProductID}</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>OrderID</th><th>ProductID</th><th>Qty</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">O1</td><td class="cell-pk">P10</td><td class="cell-ok">1</td></tr>
            <tr><td class="cell-pk">O1</td><td class="cell-pk">P20</td><td class="cell-ok">2</td></tr>
            <tr><td class="cell-pk">O2</td><td class="cell-pk">P10</td><td class="cell-ok">1</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '10 Visual: 3NF',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item done">2NF ✓</div>
      <div class="nf-bar-item active">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title" style="text-align:center;margin-top:40px;">3NF in a Nutshell:<br/><span class="accent">Cut the Chain (No Middlemen)</span></div>
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;flex:1;gap:40px;">
      <div style="display:flex;align-items:center;gap:30px;">
        <div class="visual-box" style="background:var(--navy);color:white;">🧍 Employee</div>
        <div class="visual-arrow">➔</div>
        <div class="visual-box" style="background:var(--amber-light);border:4px solid var(--amber);color:var(--amber);">🏢 Department</div>
        <div class="visual-arrow" style="color:var(--red);">➔</div>
        <div class="visual-box" style="background:var(--red-light);border:4px dashed var(--red);color:var(--red);">📞 Dept Phone</div>
      </div>
      <div style="font-size:80px;margin:10px 0;">✂️</div>
      <div style="display:flex;gap:60px;">
        <div style="display:flex;align-items:center;gap:20px;padding:20px;border:3px solid var(--green);border-radius:16px;background:var(--green-light);">
          <span style="font-size:30px;font-weight:700;color:var(--green);">Table 1:</span>
          <span style="font-size:30px;">🧍 ➔ 🏢</span>
        </div>
        <div style="display:flex;align-items:center;gap:20px;padding:20px;border:3px solid var(--green);border-radius:16px;background:var(--green-light);">
          <span style="font-size:30px;font-weight:700;color:var(--green);">Table 2:</span>
          <span style="font-size:30px;">🏢 ➔ 📞</span>
        </div>
      </div>
    </div>
    <h2 style="text-align:center;color:var(--slate);font-size:var(--body);font-weight:500;margin-bottom:60px;">
      Rule: No "transitive" dependencies. If A finds B, and B finds C... <br/>take B and C and put them in their own separate table!
    </h2>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '11 3NF Concept',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item done">2NF ✓</div>
      <div class="nf-bar-item active">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">Third Normal Form <span class="accent">(3NF)</span></div>
    <div class="two-col wide">
      <div>
        <div class="callout callout-blue" style="margin-bottom:28px;">
          <strong>Definition:</strong> A table is in 3NF if it is in 2NF <em>and</em> no non-prime attribute is <em>transitively dependent</em> on the primary key.
        </div>
        <div class="callout callout-amber" style="margin-bottom:28px;">
          <strong>Transitive Dependency:</strong> A → B and B → C, therefore A → C. C depends on A <em>indirectly</em> through B. B and C are both non-prime.
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="dep">StudentID → ZipCode</div>
          <div class="dep">ZipCode → City</div>
          <div class="dep dep-bad">StudentID → City &nbsp; (transitive — via ZipCode)</div>
        </div>
        <div style="font-size:var(--small);color:var(--red);margin-top:12px;">City should NOT be in the Students table.</div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:18px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">The Intuition</div>
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div style="background:#f8fafc;border-radius:14px;padding:24px;border:2px solid #e2e8f0;">
            <div style="font-size:var(--small);font-weight:600;margin-bottom:8px;">Employee Table (violates 3NF)</div>
            <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);line-height:1.8;">
              EmpID → Dept → DeptPhone<br/>
              <span style="color:var(--red);">EmpID → DeptPhone (transitive!)</span>
            </div>
          </div>
          <div style="background:var(--green-light);border-radius:14px;padding:24px;border:2px solid var(--green);">
            <div style="font-size:var(--small);font-weight:600;margin-bottom:8px;color:var(--green);">Fix: split into two tables</div>
            <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);line-height:1.8;">
              Employees(EmpID, Name, DeptID)<br/>
              Departments(DeptID, DeptPhone)
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '12 3NF Example',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item done">2NF ✓</div>
      <div class="nf-bar-item active">3NF</div>
      <div class="nf-bar-item">BCNF</div>
    </div>
    <div class="slide-title">3NF — <span class="accent">Hospital Employee Example</span></div>
    <div style="margin-bottom:22px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:10px;">
        <span class="badge badge-red">Before 3NF</span>
        <span style="font-family:'DM Mono',monospace;font-size:var(--small);color:var(--slate);">PK: EmpID</span>
      </div>
      <table class="tbl-bad">
        <thead><tr><th>EmpID</th><th>EmpName</th><th>DeptID</th><th>DeptName</th><th>DeptLocation</th></tr></thead>
        <tbody>
          <tr><td class="cell-pk">E1</td><td>Alice</td><td>D1</td><td class="cell-bad">Cardiology</td><td class="cell-bad">Floor 3</td></tr>
          <tr><td class="cell-pk">E2</td><td>Bob</td><td>D1</td><td class="cell-bad">Cardiology</td><td class="cell-bad">Floor 3</td></tr>
          <tr><td class="cell-pk">E3</td><td>Carol</td><td>D2</td><td class="cell-bad">Neurology</td><td class="cell-bad">Floor 5</td></tr>
        </tbody>
      </table>
      <div style="font-size:var(--tiny);color:var(--red);margin-top:8px;">EmpID → DeptID → DeptName, DeptLocation. DeptName and DeptLocation are transitively dependent on EmpID!</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">Employees</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: EmpID</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>EmpID</th><th>EmpName</th><th>DeptID</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">E1</td><td class="cell-ok">Alice</td><td>D1</td></tr>
            <tr><td class="cell-pk">E2</td><td class="cell-ok">Bob</td><td>D1</td></tr>
            <tr><td class="cell-pk">E3</td><td class="cell-ok">Carol</td><td>D2</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span class="badge badge-green">Departments</span>
          <span style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);">PK: DeptID</span>
        </div>
        <table class="tbl-good">
          <thead><tr><th>DeptID</th><th>DeptName</th><th>DeptLocation</th></tr></thead>
          <tbody>
            <tr><td class="cell-pk">D1</td><td class="cell-ok">Cardiology</td><td>Floor 3</td></tr>
            <tr><td class="cell-pk">D2</td><td class="cell-ok">Neurology</td><td>Floor 5</td></tr>
          </tbody>
        </table>
        <div class="callout callout-green" style="margin-top:16px;font-size:var(--small);">
          If Cardiology moves floors, we update <strong>one row</strong> — no anomaly!
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '13 BCNF',
    html: `
    <div class="nf-bar">
      <div class="nf-bar-item done">1NF ✓</div>
      <div class="nf-bar-item done">2NF ✓</div>
      <div class="nf-bar-item done">3NF ✓</div>
      <div class="nf-bar-item active">BCNF</div>
    </div>
    <div class="slide-title">Boyce–Codd Normal Form <span class="accent">(BCNF)</span></div>
    <div class="two-col wide">
      <div>
        <div class="callout callout-blue" style="margin-bottom:24px;">
          <strong>Definition:</strong> For every non-trivial FD X → Y, X must be a <strong>superkey</strong> (a key that uniquely identifies rows). This is stricter than 3NF.
        </div>
        <div class="callout callout-amber" style="margin-bottom:24px;">
          <strong>3NF vs BCNF:</strong> 3NF allows FDs where the right side is a prime attribute. BCNF does not — the left side must always be a superkey.
        </div>
        <div style="font-size:var(--small);color:var(--text);line-height:1.6;">
          A table can be in 3NF but <em>not</em> BCNF when there are <strong>overlapping candidate keys</strong>. BCNF may not always preserve all functional dependencies — a trade-off to be aware of.
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Classic BCNF example — Course Scheduling</div>
        <table class="tbl-bad" style="margin-bottom:14px;">
          <thead><tr><th>Student</th><th>Subject</th><th>Teacher</th></tr></thead>
          <tbody>
            <tr><td>Alice</td><td>Math</td><td>Prof. Taylor</td></tr>
            <tr><td>Alice</td><td>Science</td><td>Prof. Adams</td></tr>
            <tr><td>Bob</td><td>Math</td><td>Prof. Lee</td></tr>
            <tr><td>Bob</td><td>Science</td><td>Prof. Adams</td></tr>
          </tbody>
        </table>
        <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--slate);margin-bottom:12px;line-height:1.6;">
          FDs: {Student, Subject} → Teacher &nbsp;·&nbsp; Teacher → Subject<br/>
          <span style="color:var(--red);">Teacher is NOT a superkey! Violates BCNF.</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">TeacherSubject</div>
            <table class="tbl-good" style="font-size:var(--tiny);">
              <thead><tr><th style="padding:8px 14px;">Teacher</th><th style="padding:8px 14px;">Subject</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk" style="padding:8px 14px;">Prof. Taylor</td><td class="cell-ok" style="padding:8px 14px;">Math</td></tr>
                <tr><td class="cell-pk" style="padding:8px 14px;">Prof. Lee</td><td class="cell-ok" style="padding:8px 14px;">Math</td></tr>
                <tr><td class="cell-pk" style="padding:8px 14px;">Prof. Adams</td><td class="cell-ok" style="padding:8px 14px;">Science</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">StudentTeacher</div>
            <table class="tbl-good" style="font-size:var(--tiny);">
              <thead><tr><th style="padding:8px 14px;">Student</th><th style="padding:8px 14px;">Teacher</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk" style="padding:8px 14px;">Alice</td><td class="cell-ok" style="padding:8px 14px;">Prof. Taylor</td></tr>
                <tr><td class="cell-pk" style="padding:8px 14px;">Alice</td><td class="cell-ok" style="padding:8px 14px;">Prof. Adams</td></tr>
                <tr><td class="cell-pk" style="padding:8px 14px;">Bob</td><td class="cell-ok" style="padding:8px 14px;">Prof. Lee</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 'dark',
    label: '14 Decomposition',
    html: `
    <div class="section-label">Key Concept</div>
    <div class="slide-title">Decomposition</div>
    <div class="two-col" style="align-items:start;gap:80px;">
      <div>
        <div style="font-size:var(--body);color:rgba(255,255,255,0.8);margin-bottom:36px;line-height:1.6;">
          Decomposition is the process of splitting one relation into two or more relations to eliminate anomalies. A good decomposition must satisfy two properties:
        </div>
        <div style="display:flex;flex-direction:column;gap:24px;">
          <div style="background:rgba(255,255,255,0.07);border-radius:18px;padding:30px 32px;border-left:5px solid var(--amber);">
            <div style="font-size:var(--body);font-weight:700;color:var(--amber);margin-bottom:12px;">1. Lossless-Join Decomposition</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.72);line-height:1.55;">
              Joining the decomposed tables back together must reproduce the <em>exact</em> original relation — no spurious (fake) tuples, no lost data.
            </div>
            <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--amber);margin-top:14px;">R = R₁ ⋈ R₂ &nbsp;(natural join)</div>
          </div>
          <div style="background:rgba(255,255,255,0.07);border-radius:18px;padding:30px 32px;border-left:5px solid var(--blue);">
            <div style="font-size:var(--body);font-weight:700;color:var(--blue);margin-bottom:12px;">2. Dependency-Preserving Decomposition</div>
            <div style="font-size:var(--small);color:rgba(255,255,255,0.72);line-height:1.55;">
              Every functional dependency in the original relation can still be enforced in the decomposed tables without needing to join them.
            </div>
            <div style="font-family:'DM Mono',monospace;font-size:var(--tiny);color:var(--blue);margin-top:14px;">F ≡ F₁ ∪ F₂ (FDs preserved in sub-relations)</div>
          </div>
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--amber);margin-bottom:22px;">The Trade-off</div>
        <div style="background:rgba(255,255,255,0.07);border-radius:16px;padding:30px;margin-bottom:24px;">
          <div style="font-size:var(--small);color:rgba(255,255,255,0.8);line-height:1.6;">
            BCNF always guarantees <strong style="color:var(--amber);">lossless-join</strong>, but may <strong style="color:var(--red);">lose dependency preservation</strong>.<br/><br/>
            3NF guarantees both lossless-join AND dependency preservation — which is why it's often the practical target in real systems.
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.07);border-radius:16px;padding:30px;">
          <div style="font-size:var(--small);font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:14px;">Practical guide to decomposition</div>
          <ul class="styled">
            <li>Find a violating FD: X → Y (X is not a superkey)</li>
            <li>Create new table: (X ∪ Y) with X as PK</li>
            <li>Remove Y from original table</li>
            <li>Repeat until all FDs are satisfied</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '15 Activity 1 Question',
    bg: 'var(--amber-light)',
    html: `
    <div class="activity-num">1</div>
    <div class="section-label" style="color:var(--amber);">Activity 1 — Identify the Normal Form</div>
    <div class="slide-title">Which normal form is <span style="color:var(--amber);">violated?</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div style="font-size:var(--small);font-weight:600;margin-bottom:12px;color:var(--slate);">Table: University Enrollment</div>
        <table class="tbl-neutral">
          <thead><tr><th>StudentID 🔑</th><th>CourseID 🔑</th><th>StudentName</th><th>CourseName</th><th>Grade</th></tr></thead>
          <tbody>
            <tr><td>S1</td><td>C101</td><td>Alice</td><td>Databases</td><td>A</td></tr>
            <tr><td>S1</td><td>C102</td><td>Alice</td><td>Algorithms</td><td>B</td></tr>
            <tr><td>S2</td><td>C101</td><td>Bob</td><td>Databases</td><td>A</td></tr>
            <tr><td>S2</td><td>C103</td><td>Bob</td><td>Networks</td><td>C</td></tr>
          </tbody>
        </table>
        <div style="margin-top:28px;">
          <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;">Known Functional Dependencies:</div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div class="dep">{StudentID, CourseID} → Grade</div>
            <div class="dep">StudentID → StudentName</div>
            <div class="dep">CourseID → CourseName</div>
          </div>
        </div>
      </div>
      <div>
        <div style="background:white;border-radius:20px;padding:36px;border:2px solid var(--amber);">
          <div style="font-size:var(--body);font-weight:700;margin-bottom:20px;">Question: What normal form is violated, and why?</div>
          <div style="font-size:var(--small);color:var(--slate);line-height:1.7;margin-bottom:24px;">
            Consider each functional dependency. Does every non-prime attribute depend on the <em>full</em> composite primary key?<br/><br/>
            Hint: Look at StudentName and CourseName.
          </div>
          <div style="font-size:var(--small);font-weight:600;color:var(--amber);">→ See next slide for the answer</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '16 Activity 1 Answer',
    bg: 'var(--green-light)',
    html: `
    <div class="activity-num" style="color:var(--green);">1</div>
    <div class="section-label" style="color:var(--green);">Activity 1 — Answer</div>
    <div class="slide-title">Violates <span style="color:var(--green);">2NF</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div class="answer-box" style="margin-bottom:24px;">
          <div class="answer-label">Violation: Partial Dependencies</div>
          <div style="font-size:var(--body);line-height:1.6;">
            <strong>StudentName</strong> depends only on StudentID (partial).<br/>
            <strong>CourseName</strong> depends only on CourseID (partial).<br/>
            Both are non-prime attributes that should depend on the <em>entire</em> key.
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="dep dep-bad">StudentID → StudentName &nbsp; ❌ Partial</div>
          <div class="dep dep-bad">CourseID → CourseName &nbsp;&nbsp; ❌ Partial</div>
          <div class="dep dep-good">{StudentID, CourseID} → Grade ✅ Full</div>
        </div>
      </div>
      <div>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:14px;letter-spacing:0.06em;text-transform:uppercase;color:var(--slate);">Fix: Decompose into 3 tables</div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Students(StudentID PK, StudentName)</div>
            <table class="tbl-good">
              <thead><tr><th>StudentID</th><th>StudentName</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">S1</td><td class="cell-ok">Alice</td></tr>
                <tr><td class="cell-pk">S2</td><td class="cell-ok">Bob</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Courses(CourseID PK, CourseName)</div>
            <table class="tbl-good">
              <thead><tr><th>CourseID</th><th>CourseName</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">C101</td><td class="cell-ok">Databases</td></tr>
                <tr><td class="cell-pk">C102</td><td class="cell-ok">Algorithms</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Enrollment(StudentID, CourseID, Grade)</div>
            <table class="tbl-good">
              <thead><tr><th>StudentID</th><th>CourseID</th><th>Grade</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">S1</td><td class="cell-pk">C101</td><td class="cell-ok">A</td></tr>
                <tr><td class="cell-pk">S1</td><td class="cell-pk">C102</td><td class="cell-ok">B</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '17 Activity 2 Question',
    bg: '#fdf4ff',
    html: `
    <div class="activity-num" style="color:#a855f7;">2</div>
    <div class="section-label" style="color:#a855f7;">Activity 2 — Normalize to 3NF</div>
    <div class="slide-title">Find the <span style="color:#a855f7;">transitive dependency</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div style="font-size:var(--small);font-weight:600;margin-bottom:12px;color:var(--slate);">Table: Employee_Project</div>
        <table class="tbl-neutral">
          <thead><tr><th>EmpID 🔑</th><th>EmpName</th><th>ProjectID</th><th>ProjectName</th><th>ManagerID</th><th>ManagerPhone</th></tr></thead>
          <tbody>
            <tr><td>E1</td><td>Alice</td><td>P1</td><td>Apollo</td><td>M1</td><td>555-0101</td></tr>
            <tr><td>E2</td><td>Bob</td><td>P1</td><td>Apollo</td><td>M1</td><td>555-0101</td></tr>
            <tr><td>E3</td><td>Carol</td><td>P2</td><td>Beacon</td><td>M2</td><td>555-0202</td></tr>
          </tbody>
        </table>
        <div style="margin-top:24px;">
          <div style="font-size:var(--small);font-weight:700;margin-bottom:12px;">Functional Dependencies:</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div class="dep">EmpID → EmpName, ProjectID, ManagerID</div>
            <div class="dep">ProjectID → ProjectName</div>
            <div class="dep">ManagerID → ManagerPhone</div>
          </div>
        </div>
      </div>
      <div>
        <div style="background:white;border-radius:20px;padding:36px;border:2px solid #a855f7;">
          <div style="font-size:var(--body);font-weight:700;margin-bottom:16px;">Your task:</div>
          <ul class="styled" style="margin-bottom:24px;">
            <li style="font-size:var(--small);">Assume this table is already in 2NF</li>
            <li style="font-size:var(--small);">Find all transitive dependencies</li>
            <li style="font-size:var(--small);">Decompose into tables that satisfy 3NF</li>
          </ul>
          <div style="font-size:var(--small);color:#a855f7;font-weight:600;">→ See next slide for the answer</div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '18 Activity 2 Answer',
    bg: '#fdf4ff',
    html: `
    <div class="activity-num" style="color:#a855f7;">2</div>
    <div class="section-label" style="color:#a855f7;">Activity 2 — Answer</div>
    <div class="slide-title">Decomposed into <span style="color:#a855f7;">3NF</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div class="answer-box" style="margin-bottom:24px;border-color:#a855f7;background:#f5f3ff;">
          <div class="answer-label" style="color:#a855f7;">Transitive Dependencies Found</div>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">
            <div class="dep dep-bad">EmpID → ProjectID → ProjectName</div>
            <div class="dep dep-bad">EmpID → ManagerID → ManagerPhone</div>
          </div>
          <div style="font-size:var(--small);color:var(--slate);margin-top:12px;line-height:1.5;">
            ProjectName and ManagerPhone are not directly determined by EmpID — they travel through intermediate attributes.
          </div>
        </div>
        <div class="callout callout-blue" style="font-size:var(--small);">
          <strong>Fix:</strong> Extract each transitive dependency into its own table. Keep only direct dependencies in the original.
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Employees(EmpID PK, EmpName, ProjectID FK, ManagerID FK)</div>
          <table class="tbl-good">
            <thead><tr><th>EmpID</th><th>EmpName</th><th>ProjectID</th><th>ManagerID</th></tr></thead>
            <tbody>
              <tr><td class="cell-pk">E1</td><td>Alice</td><td>P1</td><td>M1</td></tr>
              <tr><td class="cell-pk">E2</td><td>Bob</td><td>P1</td><td>M1</td></tr>
            </tbody>
          </table>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Projects(ProjectID PK, ProjectName)</div>
            <table class="tbl-good">
              <thead><tr><th>ProjectID</th><th>ProjectName</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">P1</td><td class="cell-ok">Apollo</td></tr>
                <tr><td class="cell-pk">P2</td><td class="cell-ok">Beacon</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style="font-size:var(--tiny);font-weight:700;color:var(--green);margin-bottom:6px;">Managers(ManagerID PK, ManagerPhone)</div>
            <table class="tbl-good">
              <thead><tr><th>ManagerID</th><th>ManagerPhone</th></tr></thead>
              <tbody>
                <tr><td class="cell-pk">M1</td><td class="cell-ok">555-0101</td></tr>
                <tr><td class="cell-pk">M2</td><td class="cell-ok">555-0202</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: '',
    label: '19 Activity 3',
    bg: '#fff7ed',
    html: `
    <div class="activity-num" style="color:var(--amber);">3</div>
    <div class="section-label" style="color:var(--amber);">Activity 3 — BCNF Challenge</div>
    <div class="slide-title">Is this table in <span style="color:var(--amber);">BCNF?</span></div>
    <div class="two-col wide" style="align-items:start;">
      <div>
        <div style="font-size:var(--small);font-weight:600;margin-bottom:12px;color:var(--slate);">Table: Advising (Student, Advisor, Department)</div>
        <table class="tbl-neutral" style="margin-bottom:20px;">
          <thead><tr><th>Student</th><th>Advisor</th><th>Department</th></tr></thead>
          <tbody>
            <tr><td>Alice</td><td>Dr. Smith</td><td>CS</td></tr>
            <tr><td>Alice</td><td>Dr. Jones</td><td>Math</td></tr>
            <tr><td>Bob</td><td>Dr. Smith</td><td>CS</td></tr>
            <tr><td>Carol</td><td>Dr. Jones</td><td>Math</td></tr>
          </tbody>
        </table>
        <div style="font-size:var(--small);font-weight:700;margin-bottom:12px;">Functional Dependencies:</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div class="dep">{Student, Department} → Advisor</div>
          <div class="dep">Advisor → Department</div>
        </div>
        <div style="font-size:var(--small);color:var(--slate);margin-top:14px;line-height:1.5;">
          Candidate keys: {Student, Department} and {Student, Advisor}
        </div>
      </div>
      <div>
        <div style="background:white;border-radius:20px;padding:36px;border:2px solid var(--amber);">
          <div style="font-size:var(--body);font-weight:700;margin-bottom:16px;">Questions to answer:</div>
          <ul class="styled" style="margin-bottom:28px;">
            <li style="font-size:var(--small);">Is this table in 3NF? Why?</li>
            <li style="font-size:var(--small);">Is this table in BCNF? Why?</li>
            <li style="font-size:var(--small);">If not in BCNF, decompose it</li>
            <li style="font-size:var(--small);">Is decomposition lossless? Dependency-preserving?</li>
          </ul>
          <div style="font-size:var(--tiny);font-weight:700;color:var(--amber);padding-top:14px;border-top:1.5px solid var(--amber-light);">Answer</div>
          <div style="font-size:var(--tiny);color:var(--text);margin-top:10px;line-height:1.6;">
            <strong>3NF?</strong> Yes — Advisor is a prime attribute.<br/>
            <strong>BCNF?</strong> No — Advisor → Dept, but Advisor is not a superkey.<br/>
            <strong>Decompose:</strong> R1(Advisor, Dept) · R2(Student, Advisor).<br/>
            <strong>Lossless?</strong> Yes — Advisor is PK of R1.<br/>
            <strong>Dep-preserving?</strong> No — {Student, Dept}→Advisor is lost.
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© All rights reserved · Yasas Sri Wickramasinghe</div>`,
  },
  {
    classes: 'dark',
    label: '20 Summary',
    html: `
    <div class="section-label">Summary</div>
    <div class="slide-title">Normal Forms — <span class="accent">Quick Reference</span></div>
    <div class="summary-grid">
      <div class="summary-card" style="background:var(--red-light);border:2px solid var(--red);">
        <div class="sc-nf" style="color:var(--red);">1NF</div>
        <div class="sc-rule">Every cell is atomic. No repeating groups. A primary key exists.</div>
        <div class="sc-ex">Fix: one value per cell, separate rows for multiple values.</div>
      </div>
      <div class="summary-card" style="background:var(--amber-light);border:2px solid var(--amber);">
        <div class="sc-nf" style="color:var(--amber);">2NF</div>
        <div class="sc-rule">In 1NF + no partial dependencies on a composite PK.</div>
        <div class="sc-ex">Fix: split attributes that depend on only part of the key into a new table.</div>
      </div>
      <div class="summary-card" style="background:var(--blue-light);border:2px solid var(--blue);">
        <div class="sc-nf" style="color:var(--blue);">3NF</div>
        <div class="sc-rule">In 2NF + no transitive dependencies (A→B→C where B is non-prime).</div>
        <div class="sc-ex">Fix: extract the transitive chain into its own table. Guarantees lossless + dependency preserving.</div>
      </div>
      <div class="summary-card" style="background:var(--green-light);border:2px solid var(--green);">
        <div class="sc-nf" style="color:var(--green);">BCNF</div>
        <div class="sc-rule">In 3NF + every determinant of any FD is a superkey.</div>
        <div class="sc-ex">Fix: decompose so left-hand side of every non-trivial FD is a superkey. May sacrifice dependency preservation.</div>
      </div>
    </div>
    <div style="margin-top:32px;display:flex;align-items:center;justify-content:space-between;">
      <div class="formula" style="font-size:var(--small);padding:14px 28px;">Unnormalized → 1NF → 2NF → 3NF → BCNF</div>
      <div style="text-align:right;">
        <div style="font-size:var(--small);color:rgba(255,255,255,0.5);line-height:1.8;">
          Database Normalization &amp; Functional Dependencies<br/>
          <strong style="color:rgba(255,255,255,0.85);">© All rights reserved · Yasas Sri Wickramasinghe</strong>
        </div>
      </div>
    </div>`,
  },
];

export default function NormalizationDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  useEffect(() => {
    const styleId = 'norm-deck-styles';
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
            style={{ borderColor: 'rgba(99,102,241,0.3)' }}
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
            style={{ borderColor: 'rgba(99,102,241,0.3)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <span className="text-xs font-medium text-gray-400 hidden sm:block">{slide.label}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(99,102,241,0.3)' }}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={fullscreen ? exitFs : goFs}
            className="p-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: 'rgba(99,102,241,0.3)' }}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="norm relative w-full overflow-hidden rounded-xl"
        style={{ border: '1px solid rgba(99,102,241,0.3)' }}
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
              background: i === current ? '#6366f1' : 'rgba(99,102,241,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
