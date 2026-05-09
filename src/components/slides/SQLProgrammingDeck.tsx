import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Maximize, Minimize } from 'lucide-react';

const DECK_CSS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

:root {
    --navy:   #1C1E2E;
    --navy2:  #252840;
    --white:  #F8F9FC;
    --blue:   #4A8EF5;
    --blue2:  #2563EB;
    --green:  #34D399;
    --yellow: #FBBF24;
    --red:    #F87171;
    --gray:   #6B7280;
    --gray2:  #E5E7EB;
    --code-bg:#1E1E2E;
    --sans: 'Plus Jakarta Sans', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
.sqld * { box-sizing: border-box; margin: 0; padding: 0; }
.sqld section {
    width: 100%; height: 100%;
    font-family: var(--sans);
    color: var(--navy);
    background: var(--white);
    display: flex; flex-direction: column;
    position: relative;
  }
.sqld section.dark {
    background: var(--navy);
    color: var(--white);
  }
.sqld section.dark .tag { background: rgba(74,142,245,.25); color: var(--blue); }
.sqld .tag {
    display: inline-block;
    background: rgba(74,142,245,.12);
    color: var(--blue2);
    font-size: 24px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 6px 18px; border-radius: 6px;
    font-family: var(--mono);
    margin-bottom: 28px;
  }
.sqld .slide-title {
    font-size: 68px; font-weight: 800; line-height: 1.1;
    letter-spacing: -.02em;
  }
.sqld .slide-subtitle {
    font-size: 36px; font-weight: 500; line-height: 1.45;
    opacity: .7; margin-top: 20px;
  }
.sqld .body-text { font-size: 34px; font-weight: 400; line-height: 1.55; }
.sqld .small-text { font-size: 28px; line-height: 1.5; }
.sqld .label { font-size: 24px; font-weight: 600; opacity: .55; text-transform: uppercase; letter-spacing: .08em; }
.sqld .pad { padding: 90px 110px 80px; }
.sqld .pad-sm { padding: 70px 110px 0; }
.sqld .col2 { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
.sqld .col3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; }
.sqld .gap { margin-top: 52px; }
.sqld .gap-sm { margin-top: 28px; }
.sqld .code-block {
    background: var(--code-bg);
    border-radius: 16px;
    padding: 36px 44px;
    font-family: var(--mono);
    font-size: 30px;
    line-height: 1.7;
    color: #CDD6F4;
    position: relative;
    border: 1px solid rgba(255,255,255,.06);
  }
.sqld .code-block .kw { color: #89B4FA; font-weight: 700; }
.sqld .code-block .fn { color: #94E2D5; }
.sqld .code-block .str { color: #A6E3A1; }
.sqld .code-block .num { color: #FAB387; }
.sqld .code-block .cmt { color: #585B70; font-style: italic; }
.sqld .code-block .tbl { color: #F38BA8; }
.sqld .code-block .col { color: #CBA6F7; }
.sqld .code-block .op { color: #89DCEB; }
.sqld .code-label {
    font-family: var(--mono);
    font-size: 24px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .1em;
    margin-bottom: 12px;
    opacity: .45;
  }
.sqld .result-table {
    border-radius: 12px;
    overflow: hidden;
    font-family: var(--mono);
    font-size: 26px;
    width: 100%;
    border-collapse: collapse;
  }
.sqld .result-table th {
    background: var(--blue2);
    color: #fff;
    padding: 14px 24px;
    text-align: left;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: .04em;
  }
.sqld .result-table td {
    padding: 13px 24px;
    border-bottom: 1px solid var(--gray2);
    background: #fff;
  }
.sqld .result-table tr:last-child td { border-bottom: none; }
.sqld .result-table tr:nth-child(even) td { background: #F0F4FF; }
.sqld .result-label {
    font-size: 24px; font-weight: 700; color: var(--green);
    font-family: var(--mono); text-transform: uppercase;
    letter-spacing: .08em; margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
.sqld .result-label::before { content: '▶ '; opacity: .6; }
.sqld .card {
    background: #fff;
    border-radius: 16px;
    padding: 36px;
    border: 1.5px solid var(--gray2);
  }
.sqld .card.blue-card {
    background: #EFF6FF;
    border-color: #BFDBFE;
  }
.sqld .card.green-card {
    background: #ECFDF5;
    border-color: #6EE7B7;
  }
.sqld .card.dark-card {
    background: var(--navy2);
    border-color: rgba(255,255,255,.08);
    color: var(--white);
  }
.sqld .card-title {
    font-size: 30px; font-weight: 700; margin-bottom: 12px;
  }
.sqld .card-

  
  .badge {
    display: inline-block;
    padding: 5px 16px;
    border-radius: 999px;
    font-size: 24px; font-weight: 600;
    font-family: var(--mono);
  }
.sqld .badge-blue { background: #DBEAFE; color: var(--blue2); }
.sqld .badge-green { background: #D1FAE5; color: #059669; }
.sqld .badge-red { background: #FEE2E2; color: #DC2626; }
.sqld .badge-yellow { background: #FEF3C7; color: #D97706; }
.sqld .arrow-right {
    display: flex; align-items: center;
    font-size: 32px; color: var(--blue); font-weight: 700;
    gap: 12px; margin: 16px 0;
  }
.sqld .section-num {
    font-family: var(--mono);
    font-size: 24px; font-weight: 700;
    color: var(--blue);
    letter-spacing: .15em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
.sqld .hero-num {
    font-size: 180px; font-weight: 800;
    line-height: 1; opacity: .05;
    font-family: var(--mono);
    position: absolute; right: 60px; bottom: 20px;
    color: var(--blue);
    pointer-events: none;
    z-index: 0;
  }
.sqld .db-diagram { display: flex; flex-direction: column; gap: 0; }
.sqld .db-layer {
    border-radius: 12px;
    padding: 20px 28px;
    font-family: var(--mono);
    font-size: 26px; font-weight: 600;
    text-align: center;
  }
.sqld .db-arrow {
    display: flex; justify-content: center;
    font-size: 28px; color: var(--gray); padding: 4px 0;
  }
.sqld .highlight-box {
    border-left: 5px solid var(--blue);
    padding: 20px 28px;
    background: rgba(74,142,245,.07);
    border-radius: 0 12px 12px 0;
    font-size: 30px;
    line-height: 1.5;
  }
.sqld .highlight-box.green { border-color: var(--green); background: rgba(52,211,153,.07); }
.sqld .highlight-box.yellow { border-color: var(--yellow); background: rgba(251,191,36,.07); }
.sqld .step-list { list-style: none; display: flex; flex-direction: column; gap: 24px; }
.sqld .step-list li {
    display: flex; align-items: flex-start; gap: 20px;
    font-size: 32px; line-height: 1.4;
  }
.sqld .step-num {
    min-width: 44px; height: 44px;
    background: var(--blue2); color: #fff;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 22px; font-family: var(--mono);
    margin-top: 2px; flex-shrink: 0;
  }
.sqld .dtype-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
.sqld .dtype-card {
    border-radius: 14px;
    padding: 28px 30px;
    border: 2px solid transparent;
  }
.sqld .dtype-name {
    font-family: var(--mono);
    font-size: 28px; font-weight: 700;
    margin-bottom: 8px;
  }
.sqld .dtype-desc { font-size: 25px; opacity: .75; line-height: 1.4; }
.sqld .dtype-eg { font-family: var(--mono); font-size: 24px; opacity: .55; margin-top: 6px; }
.sqld .join-circles {
    display: flex; align-items: center; justify-content: center;
    position: relative; height: 200px;
  }
.sqld .slide-footer {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 0 110px;
    height: 80px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 24px;
    border-top: 1px solid rgba(0,0,0,.07);
  }
.sqld section.dark .slide-footer {
    color: var(--white);
    border-top-color: rgba(255,255,255,.08);
  }
.sqld .footer-left { display:flex; align-items:center; gap:14px; opacity:.5; white-space:nowrap; }
.sqld .footer-right { display:flex; align-items:center; gap:10px; opacity:.45; font-family:var(--mono); white-space:nowrap; }
.sqld .footer-dot { width:4px; height:4px; border-radius:50%; background:currentColor; opacity:.5; }
.sqld .code-line { display: block; }
.sqld .big-stat { font-size: 120px; font-weight: 800; line-height: 1; font-family: var(--mono); color: var(--blue); }
.sqld .where-demo { display: flex; align-items: center; gap: 32px; font-family: var(--mono); font-size: 28px; }
.sqld code {
    font-family: var(--mono);
    background: rgba(74,142,245,.12);
    color: var(--blue2);
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 1em;
  }
.sqld section.dark code { background: rgba(137,180,250,.15); color: #89B4FA; }`;

const SLIDES: { classes: string; label: string; html: string }[] = [
  { classes: "dark", label: "01 Title", html: `<div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;">
      <!-- grid decoration -->
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="opacity:.06">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#4A8EF5" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      <!-- glowing circle -->
      <div style="position:absolute;top:-200px;right:-100px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(74,142,245,.18) 0%,transparent 70%);"></div>
      <div style="position:absolute;bottom:-150px;left:-80px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(52,211,153,.1) 0%,transparent 70%);"></div>
    </div>

    <div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:100px 130px;">
      <div class="section-num">MBI802 · Database Management Systems</div>
      <div class="slide-title" style="color:#fff;font-size:90px;max-width:1100px;line-height:1.05;">
        Introduction to<br/><span style="color:var(--blue);">SQL</span> with MySQL
      </div>
      <div class="slide-subtitle" style="max-width:800px;margin-top:32px;">
        From databases to your first queries — a beginner-friendly guide to structured data.
      </div>

      <!-- terminal decoration -->
      <div style="margin-top:70px;display:flex;align-items:center;gap:16px;">
        <div style="width:14px;height:14px;border-radius:50%;background:#F87171;"></div>
        <div style="width:14px;height:14px;border-radius:50%;background:#FBBF24;"></div>
        <div style="width:14px;height:14px;border-radius:50%;background:#34D399;"></div>
        <div style="font-family:var(--mono);font-size:26px;color:#6B7280;margin-left:8px;">mysql&gt; <span style="color:#89B4FA;">SELECT</span> * <span style="color:#89B4FA;">FROM</span> <span style="color:#F38BA8;">knowledge</span>;<span style="animation:blink 1s step-end infinite;color:#fff;">█</span></div>
      </div>
    </div>

    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "dark", label: "03 What is SQL", html: `<div class="pad" style="display:flex;flex-direction:column;height:100%;padding-bottom:88px;position:relative;">

      <div class="tag">The Language</div>
      <div class="slide-title" style="color:#fff;">What is SQL?</div>

      <div class="col2 gap" style="flex:1;">
        <div style="display:flex;flex-direction:column;gap:32px;">
          <div class="body-text" style="color:rgba(255,255,255,.85);">
            <strong style="color:#fff;">SQL</strong> (Structured Query Language) is the standard language for talking to relational databases.
          </div>

          <div style="display:flex;flex-direction:column;gap:20px;">
            <div class="card dark-card" style="border-color:rgba(74,142,245,.3);">
              <div class="card-title" style="color:var(--blue);font-family:var(--mono);">CREATE</div>
              <div class="card-body" style="color:rgba(255,255,255,.7);">Make databases and tables</div>
            </div>
            <div class="card dark-card" style="border-color:rgba(74,142,245,.3);">
              <div class="card-title" style="color:var(--green);font-family:var(--mono);">INSERT / SELECT</div>
              <div class="card-body" style="color:rgba(255,255,255,.7);">Add and read data</div>
            </div>
            <div class="card dark-card" style="border-color:rgba(74,142,245,.3);">
              <div class="card-title" style="color:var(--yellow);font-family:var(--mono);">UPDATE / DELETE</div>
              <div class="card-body" style="color:rgba(255,255,255,.7);">Modify and remove data</div>
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;justify-content:center;gap:24px;">
          <div style="font-size:26px;color:rgba(255,255,255,.5);font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">MySQL = SQL + Database Server</div>

          <!-- MySQL logo style box -->
          <div style="background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:18px;padding:36px;display:flex;flex-direction:column;gap:20px;">
            <div style="display:flex;align-items:center;gap:20px;">
              <div style="width:60px;height:60px;background:var(--blue2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:#fff;font-family:var(--mono);">M</div>
              <div>
                <div style="font-size:32px;font-weight:700;color:#fff;">MySQL</div>
                <div style="font-size:24px;color:rgba(255,255,255,.5);">The world's most popular open-source database</div>
              </div>
            </div>
            <div style="width:100%;height:1px;background:rgba(255,255,255,.08);"></div>
            <div style="font-size:26px;color:rgba(255,255,255,.6);line-height:1.5;">
              Used by <strong style="color:#fff;">Facebook, Twitter, YouTube</strong> and thousands of other applications worldwide.
            </div>
          </div>

          <div class="highlight-box" style="border-color:var(--green);background:rgba(52,211,153,.08);">
            <span style="color:var(--green);font-weight:700;">SQL is not case-sensitive</span> — <code>SELECT</code> = <code>select</code> = <code>Select</code>. But writing keywords in UPPERCASE is standard practice.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "", label: "04 MySQL Data Types", html: `<div class="pad-sm" style="display:flex;flex-direction:column;height:100%;">
      <div class="tag">Building Blocks</div>
      <div class="slide-title">MySQL Data Types</div>
      <div class="body-text gap-sm" style="opacity:.6;">Every column in a table must have a data type — it tells MySQL <strong>what kind of value</strong> to expect.</div>

      <div class="dtype-grid gap">
        <div class="dtype-card" style="background:#EFF6FF;border-color:#BFDBFE;">
          <div class="dtype-name" style="color:var(--blue2);">INT</div>
          <div class="dtype-desc">Whole numbers</div>
          <div class="dtype-eg">e.g. 1, 25, 1000</div>
        </div>
        <div class="dtype-card" style="background:#EFF6FF;border-color:#BFDBFE;">
          <div class="dtype-name" style="color:var(--blue2);">FLOAT / DECIMAL</div>
          <div class="dtype-desc">Decimal numbers</div>
          <div class="dtype-eg">e.g. 3.14, 99.99</div>
        </div>
        <div class="dtype-card" style="background:#EFF6FF;border-color:#BFDBFE;">
          <div class="dtype-name" style="color:var(--blue2);">BIGINT</div>
          <div class="dtype-desc">Very large whole numbers</div>
          <div class="dtype-eg">e.g. 9,223,372,036…</div>
        </div>
        <div class="dtype-card" style="background:#ECFDF5;border-color:#6EE7B7;">
          <div class="dtype-name" style="color:#059669;">VARCHAR(n)</div>
          <div class="dtype-desc">Text up to <em>n</em> characters</div>
          <div class="dtype-eg">e.g. 'Alice', 'Hello'</div>
        </div>
        <div class="dtype-card" style="background:#ECFDF5;border-color:#6EE7B7;">
          <div class="dtype-name" style="color:#059669;">TEXT</div>
          <div class="dtype-desc">Long text (no length limit)</div>
          <div class="dtype-eg">e.g. blog post content</div>
        </div>
        <div class="dtype-card" style="background:#ECFDF5;border-color:#6EE7B7;">
          <div class="dtype-name" style="color:#059669;">CHAR(n)</div>
          <div class="dtype-desc">Fixed-length text</div>
          <div class="dtype-eg">e.g. country codes 'MY'</div>
        </div>
        <div class="dtype-card" style="background:#FEF3C7;border-color:#FCD34D;">
          <div class="dtype-name" style="color:#D97706;">DATE</div>
          <div class="dtype-desc">Calendar date</div>
          <div class="dtype-eg">e.g. '2024-09-01'</div>
        </div>
        <div class="dtype-card" style="background:#FEF3C7;border-color:#FCD34D;">
          <div class="dtype-name" style="color:#D97706;">DATETIME</div>
          <div class="dtype-desc">Date + time combined</div>
          <div class="dtype-eg">e.g. '2024-09-01 09:30:00'</div>
        </div>
        <div class="dtype-card" style="background:#FEE2E2;border-color:#FCA5A5;">
          <div class="dtype-name" style="color:#DC2626;">BOOLEAN</div>
          <div class="dtype-desc">True or False (1 or 0)</div>
          <div class="dtype-eg">e.g. is_active = TRUE</div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "", label: "05 CREATE", html: `<div class="pad-sm" style="display:flex;flex-direction:column;height:100%;">
      <div class="tag">Command 1 of 5</div>
      <div class="slide-title">Creating Databases &amp; Tables</div>

      <div class="col2 gap" style="flex:1;align-items:start;">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="code-label">Step 1 — Create a Database</div>
          <div class="code-block">
            <span class="kw">CREATE DATABASE</span> <span class="tbl">school_db</span>;<br/>
            <span class="kw">USE</span> <span class="tbl">school_db</span>;
          </div>

          <div class="code-label" style="margin-top:12px;">Step 2 — Create a Table</div>
          <div class="code-block" style="font-size:27px;">
            <span class="kw">CREATE TABLE</span> <span class="tbl">students</span> (<br/>
            &nbsp;&nbsp;<span class="col">id</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">INT</span> <span class="kw">PRIMARY KEY</span>,<br/>
            &nbsp;&nbsp;<span class="col">name</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">VARCHAR</span>(<span class="num">100</span>),<br/>
            &nbsp;&nbsp;<span class="col">age</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">INT</span>,<br/>
            &nbsp;&nbsp;<span class="col">email</span>&nbsp;&nbsp;&nbsp;<span class="fn">VARCHAR</span>(<span class="num">150</span>),<br/>
            &nbsp;&nbsp;<span class="col">gpa</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">DECIMAL</span>(<span class="num">3</span>,<span class="num">2</span>)<br/>
            );
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="card blue-card" style="padding:28px 32px;">
            <div class="card-title" style="color:var(--blue2);font-size:26px;margin-bottom:16px;">🔑 Key Concepts</div>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:14px;">
              <li style="display:flex;gap:14px;align-items:flex-start;font-size:26px;"><span style="color:var(--blue2);font-weight:700;font-family:var(--mono);">PRIMARY KEY</span><span style="opacity:.8;">— unique identifier for each row</span></li>
              <li style="display:flex;gap:14px;align-items:flex-start;font-size:26px;"><span style="color:var(--blue2);font-weight:700;font-family:var(--mono);">VARCHAR(n)</span><span style="opacity:.8;">— text up to <em>n</em> characters</span></li>
              <li style="display:flex;gap:14px;align-items:flex-start;font-size:26px;"><span style="color:var(--blue2);font-weight:700;font-family:var(--mono);">DECIMAL(3,2)</span><span style="opacity:.8;">— 3 digits, 2 after decimal (e.g. 3.75)</span></li>
            </ul>
          </div>

          <!-- result viz -->
          <div style="margin-top:8px;">
            <div class="result-label">Result — empty table created</div>
            <table class="result-table">
              <thead><tr><th>id</th><th>name</th><th>age</th><th>email</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td colspan="5" style="text-align:center;color:#9CA3AF;font-style:italic;padding:18px;">(no rows yet)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "", label: "06 INSERT INTO", html: `<div class="pad-sm" style="display:flex;flex-direction:column;height:100%;">
      <div class="tag">Command 2 of 5</div>
      <div class="slide-title">Inserting Data</div>

      <div class="col2 gap" style="flex:1;align-items:start;">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="code-label">Syntax</div>
          <div class="code-block" style="font-size:28px;">
            <span class="kw">INSERT INTO</span> <span class="tbl">table_name</span><br/>
            &nbsp;&nbsp;(<span class="col">column1</span>, <span class="col">column2</span>, ...)<br/>
            <span class="kw">VALUES</span><br/>
            &nbsp;&nbsp;(<span class="str">value1</span>, <span class="str">value2</span>, ...);
          </div>

          <div class="code-label" style="margin-top:12px;">Example — Insert 3 students</div>
          <div class="code-block" style="font-size:26px;">
            <span class="kw">INSERT INTO</span> <span class="tbl">students</span> (<span class="col">id</span>, <span class="col">name</span>, <span class="col">age</span>, <span class="col">email</span>, <span class="col">gpa</span>)<br/>
            <span class="kw">VALUES</span><br/>
            &nbsp;&nbsp;(<span class="num">1</span>, <span class="str">'Alice'</span>, <span class="num">20</span>, <span class="str">'alice@uni.edu'</span>, <span class="num">3.80</span>),<br/>
            &nbsp;&nbsp;(<span class="num">2</span>, <span class="str">'Bob'</span>,&nbsp;&nbsp; <span class="num">22</span>, <span class="str">'bob@uni.edu'</span>,&nbsp;&nbsp;<span class="num">3.50</span>),<br/>
            &nbsp;&nbsp;(<span class="num">3</span>, <span class="str">'Carol'</span>, <span class="num">21</span>, <span class="str">'carol@uni.edu'</span>,<span class="num">3.90</span>);
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- anatomy labels -->
          <div style="background:#F8F9FC;border-radius:14px;padding:28px;border:1.5px solid var(--gray2);">
            <div style="font-size:26px;font-weight:700;margin-bottom:18px;color:var(--navy);">Anatomy of INSERT</div>
            <div style="display:flex;flex-direction:column;gap:14px;">
              <div style="display:flex;align-items:center;gap:14px;font-size:26px;">
                <span class="badge badge-blue">INSERT INTO</span> <span style="opacity:.7;">which table to add rows to</span>
              </div>
              <div style="display:flex;align-items:center;gap:14px;font-size:26px;">
                <span class="badge badge-blue">(columns)</span> <span style="opacity:.7;">which columns you're filling</span>
              </div>
              <div style="display:flex;align-items:center;gap:14px;font-size:26px;">
                <span class="badge badge-green">VALUES</span> <span style="opacity:.7;">the actual data — match column order!</span>
              </div>
            </div>
          </div>

          <div class="result-label">Result — students table now has rows</div>
          <table class="result-table">
            <thead><tr><th>id</th><th>name</th><th>age</th><th>gpa</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Alice</td><td>20</td><td>3.80</td></tr>
              <tr><td>2</td><td>Bob</td><td>22</td><td>3.50</td></tr>
              <tr><td>3</td><td>Carol</td><td>21</td><td>3.90</td></tr>
            </tbody>
          </table>

          <div class="highlight-box green" style="font-size:26px;">
            💡 You must supply a value for <code>id</code> — it is the PRIMARY KEY and must be unique for every row.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "dark", label: "07 SELECT", html: `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:60px 110px 0;;padding-bottom:88px">
      <div class="tag">Command 3 of 5</div>
      <div class="slide-title" style="color:#fff;">Querying Data with SELECT</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:36px;">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="code-label" style="color:rgba(255,255,255,.4);">Select ALL columns</div>
          <div class="code-block" style="font-size:28px;padding:24px 36px;">
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span>;
          </div>
          <div class="code-label" style="color:rgba(255,255,255,.4);">Select SPECIFIC columns</div>
          <div class="code-block" style="font-size:28px;padding:24px 36px;">
            <span class="kw">SELECT</span> <span class="col">name</span>, <span class="col">gpa</span><br/>
            <span class="kw">FROM</span> <span class="tbl">students</span>;
          </div>
          <div class="code-label" style="color:rgba(255,255,255,.4);">Select with an alias</div>
          <div class="code-block" style="font-size:28px;padding:24px 36px;">
            <span class="kw">SELECT</span> <span class="col">name</span> <span class="kw">AS</span> <span class="str">'Student Name'</span>,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="col">gpa</span>&nbsp; <span class="kw">AS</span> <span class="str">'Grade Point'</span><br/>
            <span class="kw">FROM</span> <span class="tbl">students</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:16px;">
          <div style="background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:16px;padding:22px;">
            <div style="font-size:24px;color:rgba(255,255,255,.5);font-weight:600;margin-bottom:12px;text-transform:uppercase;letter-spacing:.08em;">SELECT * → all columns</div>
            <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
              <thead>
                <tr>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">id</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">name</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">age</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">email</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 14px;text-align:left;">gpa</th>
                </tr>
              </thead>
              <tbody>
                <tr style="color:#CDD6F4;border-bottom:1px solid rgba(255,255,255,.06);">
                  <td style="padding:7px 14px;">1</td><td style="padding:7px 14px;">Alice</td><td style="padding:7px 14px;">20</td><td style="padding:7px 14px;">alice@…</td><td style="padding:7px 14px;">3.80</td>
                </tr>
                <tr style="color:#CDD6F4;border-bottom:1px solid rgba(255,255,255,.06);">
                  <td style="padding:7px 14px;">2</td><td style="padding:7px 14px;">Bob</td><td style="padding:7px 14px;">22</td><td style="padding:7px 14px;">bob@…</td><td style="padding:7px 14px;">3.50</td>
                </tr>
                <tr style="color:#CDD6F4;">
                  <td style="padding:7px 14px;">3</td><td style="padding:7px 14px;">Carol</td><td style="padding:7px 14px;">21</td><td style="padding:7px 14px;">carol@…</td><td style="padding:7px 14px;">3.90</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:16px;padding:22px;">
            <div style="font-size:24px;color:rgba(255,255,255,.5);font-weight:600;margin-bottom:12px;text-transform:uppercase;letter-spacing:.08em;">SELECT name, gpa → 2 columns only</div>
            <table style="border-collapse:collapse;font-family:var(--mono);font-size:24px;">
              <thead>
                <tr>
                  <th style="background:var(--blue2);color:#fff;padding:8px 20px;text-align:left;">name</th>
                  <th style="background:var(--blue2);color:#fff;padding:8px 20px;text-align:left;">gpa</th>
                </tr>
              </thead>
              <tbody>
                <tr style="color:#CDD6F4;border-bottom:1px solid rgba(255,255,255,.06);"><td style="padding:7px 20px;">Alice</td><td style="padding:7px 20px;">3.80</td></tr>
                <tr style="color:#CDD6F4;border-bottom:1px solid rgba(255,255,255,.06);"><td style="padding:7px 20px;">Bob</td><td style="padding:7px 20px;">3.50</td></tr>
                <tr style="color:#CDD6F4;"><td style="padding:7px 20px;">Carol</td><td style="padding:7px 20px;">3.90</td></tr>
              </tbody>
            </table>
          </div>
          <div class="highlight-box" style="border-color:var(--yellow);background:rgba(251,191,36,.08);font-size:26px;color:rgba(255,255,255,.8);">
            ⭐ Use <code>SELECT *</code> for exploration; use specific columns in real apps for speed.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "", label: "08 WHERE", html: `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:55px 110px 0;;padding-bottom:88px">
      <div class="tag">Filtering</div>
      <div class="slide-title">Filtering with WHERE</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="code-label">Syntax</div>
          <div class="code-block" style="font-size:27px;padding:18px 28px;line-height:1.6;">
            <span class="kw">SELECT</span> <span class="col">columns</span><br/>
            <span class="kw">FROM</span> <span class="tbl">table</span><br/>
            <span class="kw">WHERE</span> <span class="col">condition</span>;
          </div>

          <div class="code-label">Examples</div>
          <div class="code-block" style="font-size:25px;padding:18px 28px;line-height:1.6;">
            <span class="cmt">-- students older than 20</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">age</span> <span class="op">&gt;</span> <span class="num">20</span>;<br/><br/>
            <span class="cmt">-- find a specific student</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">name</span> <span class="op">=</span> <span class="str">'Alice'</span>;<br/><br/>
            <span class="cmt">-- multiple conditions</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">age</span> <span class="op">&gt;</span> <span class="num">20</span> <span class="kw">AND</span> <span class="col">gpa</span> <span class="op">&gt;=</span> <span class="num">3.70</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:18px;">
          <div class="card" style="padding:24px 28px;">
            <div class="card-title" style="font-size:26px;margin-bottom:14px;">Comparison Operators</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">=</span> equal to</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-red">!=</span> not equal</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">&gt;</span> greater than</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">&lt;</span> less than</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">&gt;=</span> ≥</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-blue">&lt;=</span> ≤</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-green">AND</span> both true</div>
              <div style="display:flex;gap:12px;align-items:center;font-size:25px;"><span class="badge badge-yellow">OR</span> either true</div>
            </div>
          </div>

          <div>
            <div class="result-label">WHERE age &gt; 20</div>
            <table class="result-table" style="font-size:25px;">
              <thead><tr><th>id</th><th>name</th><th>age</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td>2</td><td>Bob</td><td>22</td><td>3.50</td></tr>
                <tr><td>3</td><td>Carol</td><td>21</td><td>3.90</td></tr>
              </tbody>
            </table>
          </div>

          <div class="highlight-box" style="font-size:25px;">
            💡 Use <code>LIKE '%term%'</code> to search text — e.g. <code>WHERE name LIKE 'A%'</code> finds all names starting with A.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "", label: "09 ORDER BY", html: `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:55px 110px 0;;padding-bottom:88px">
      <div class="tag">Sorting</div>
      <div class="slide-title">Sorting with ORDER BY</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="code-label">Syntax</div>
          <div class="code-block" style="font-size:27px;padding:18px 28px;line-height:1.6;">
            <span class="kw">SELECT</span> <span class="col">columns</span><br/>
            <span class="kw">FROM</span> <span class="tbl">table</span><br/>
            <span class="kw">ORDER BY</span> <span class="col">column</span> <span class="op">ASC</span>|<span class="op">DESC</span>;
          </div>

          <div class="code-label">Examples</div>
          <div class="code-block" style="font-size:25px;padding:18px 28px;line-height:1.6;">
            <span class="cmt">-- highest GPA first</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">ORDER BY</span> <span class="col">gpa</span> <span class="op">DESC</span>;<br/><br/>
            <span class="cmt">-- alphabetical by name</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">ORDER BY</span> <span class="col">name</span> <span class="op">ASC</span>;<br/><br/>
            <span class="cmt">-- combined with WHERE + LIMIT</span><br/>
            <span class="kw">SELECT</span> * <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">age</span> <span class="op">&gt;</span> <span class="num">20</span><br/>
            <span class="kw">ORDER BY</span> <span class="col">gpa</span> <span class="op">DESC</span> <span class="kw">LIMIT</span> <span class="num">10</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:18px;">
          <div class="col2" style="gap:16px;">
            <div style="border-radius:14px;background:#EFF6FF;border:1.5px solid #BFDBFE;padding:22px 16px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--blue2);margin-bottom:8px;text-align:center;">ASC</div>
              <div style="font-size:24px;color:var(--navy);opacity:.7;margin-bottom:14px;text-align:center;">Ascending (default)<br/>smallest → largest</div>
              <div style="background:#dbeafe;border-radius:8px;padding:12px 16px;font-family:var(--mono);font-size:24px;color:var(--blue2);">
                1 &nbsp;→&nbsp; 2 &nbsp;→&nbsp; 3<br/>
                A &nbsp;→&nbsp; B &nbsp;→&nbsp; C
              </div>
            </div>
            <div style="border-radius:14px;background:#ECFDF5;border:1.5px solid #6EE7B7;padding:22px 16px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#059669;margin-bottom:8px;text-align:center;">DESC</div>
              <div style="font-size:24px;color:var(--navy);opacity:.7;margin-bottom:14px;text-align:center;">Descending<br/>largest → smallest</div>
              <div style="background:#d1fae5;border-radius:8px;padding:12px 16px;font-family:var(--mono);font-size:24px;color:#059669;">
                3 &nbsp;→&nbsp; 2 &nbsp;→&nbsp; 1<br/>
                C &nbsp;→&nbsp; B &nbsp;→&nbsp; A
              </div>
            </div>
          </div>

          <div>
            <div class="result-label">ORDER BY gpa DESC</div>
            <table class="result-table" style="font-size:25px;">
              <thead><tr><th>#</th><th>name</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td>1st</td><td>Carol</td><td style="color:#059669;font-weight:700;">3.90</td></tr>
                <tr><td>2nd</td><td>Alice</td><td>3.80</td></tr>
                <tr><td>3rd</td><td>Bob</td><td style="color:#DC2626;">3.50</td></tr>
              </tbody>
            </table>
          </div>

          <div class="highlight-box green" style="font-size:25px;">
            💡 Add <code>LIMIT 10</code> at the end to get only the top N results — great for leaderboards!
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "dark", label: "10 UPDATE", html: `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:55px 110px 0;;padding-bottom:88px">
      <div class="tag">Command 4 of 5</div>
      <div class="slide-title" style="color:#fff;">Updating Records</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="code-label" style="color:rgba(255,255,255,.4);">Syntax</div>
          <div class="code-block" style="font-size:27px;padding:18px 28px;line-height:1.6;">
            <span class="kw">UPDATE</span> <span class="tbl">table</span><br/>
            <span class="kw">SET</span> <span class="col">column1</span> <span class="op">=</span> <span class="str">new_value</span><br/>
            <span class="kw">WHERE</span> <span class="col">condition</span>;
          </div>

          <div class="code-label" style="color:rgba(255,255,255,.4);">Examples</div>
          <div class="code-block" style="font-size:25px;padding:18px 28px;line-height:1.6;">
            <span class="cmt">-- Bob got a better grade!</span><br/>
            <span class="kw">UPDATE</span> <span class="tbl">students</span><br/>
            <span class="kw">SET</span> <span class="col">gpa</span> <span class="op">=</span> <span class="num">3.75</span><br/>
            <span class="kw">WHERE</span> <span class="col">id</span> <span class="op">=</span> <span class="num">2</span>;<br/><br/>
            <span class="cmt">-- Update multiple columns</span><br/>
            <span class="kw">UPDATE</span> <span class="tbl">students</span><br/>
            <span class="kw">SET</span> <span class="col">age</span> <span class="op">=</span> <span class="num">23</span>, <span class="col">email</span> <span class="op">=</span> <span class="str">'bob.new@uni.edu'</span><br/>
            <span class="kw">WHERE</span> <span class="col">id</span> <span class="op">=</span> <span class="num">2</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:22px;">
          <!-- before / after visual -->
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div>
              <div style="font-size:24px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">Before UPDATE</div>
              <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
                <thead><tr style="background:rgba(255,255,255,.08);">
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">id</th>
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">name</th>
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">gpa</th>
                </tr></thead>
                <tbody>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:9px 16px;">1</td><td style="padding:9px 16px;">Alice</td><td style="padding:9px 16px;">3.80</td></tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#F87171;background:rgba(248,113,113,.08);"><td style="padding:9px 16px;">2</td><td style="padding:9px 16px;">Bob</td><td style="padding:9px 16px;">3.50 ←</td></tr>
                  <tr style="color:#CDD6F4;"><td style="padding:9px 16px;">3</td><td style="padding:9px 16px;">Carol</td><td style="padding:9px 16px;">3.90</td></tr>
                </tbody>
              </table>
            </div>

            <div style="display:flex;justify-content:center;font-size:36px;">↓</div>

            <div>
              <div style="font-size:24px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">After UPDATE</div>
              <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
                <thead><tr style="background:rgba(255,255,255,.08);">
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">id</th>
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">name</th>
                  <th style="padding:10px 16px;text-align:left;color:rgba(255,255,255,.6);">gpa</th>
                </tr></thead>
                <tbody>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:9px 16px;">1</td><td style="padding:9px 16px;">Alice</td><td style="padding:9px 16px;">3.80</td></tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#34D399;background:rgba(52,211,153,.08);"><td style="padding:9px 16px;">2</td><td style="padding:9px 16px;">Bob</td><td style="padding:9px 16px;">3.75 ✓</td></tr>
                  <tr style="color:#CDD6F4;"><td style="padding:9px 16px;">3</td><td style="padding:9px 16px;">Carol</td><td style="padding:9px 16px;">3.90</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="highlight-box" style="border-color:var(--red);background:rgba(248,113,113,.1);color:rgba(255,255,255,.85);font-size:26px;">
            ⚠️ <strong style="color:var(--red);">Always use WHERE!</strong> Without it, every row gets updated — a common mistake!
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "", label: "11 DELETE", html: `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:55px 110px 0;;padding-bottom:88px">
      <div class="tag">Command 5 of 5</div>
      <div class="slide-title">Deleting Records</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div class="code-label">Syntax</div>
          <div class="code-block" style="font-size:27px;padding:18px 28px;line-height:1.6;">
            <span class="kw">DELETE FROM</span> <span class="tbl">table</span><br/>
            <span class="kw">WHERE</span> <span class="col">condition</span>;
          </div>

          <div class="code-label">Example</div>
          <div class="code-block" style="font-size:25px;padding:18px 28px;line-height:1.6;">
            <span class="cmt">-- remove one student</span><br/>
            <span class="kw">DELETE FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">id</span> <span class="op">=</span> <span class="num">2</span>;<br/><br/>
            <span class="cmt">-- remove low-GPA records</span><br/>
            <span class="kw">DELETE FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">WHERE</span> <span class="col">gpa</span> <span class="op">&lt;</span> <span class="num">3.60</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:24px;">
          <div>
            <div class="result-label">Before DELETE WHERE id = 2</div>
            <table class="result-table">
              <thead><tr><th>id</th><th>name</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Alice</td><td>3.80</td></tr>
                <tr style="background:#FEE2E2 !important;"><td><s style="color:#DC2626;">2</s></td><td><s style="color:#DC2626;">Bob</s></td><td><s style="color:#DC2626;">3.75</s></td></tr>
                <tr><td>3</td><td>Carol</td><td>3.90</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div class="result-label" style="color:var(--blue);">After DELETE</div>
            <table class="result-table">
              <thead><tr><th>id</th><th>name</th><th>gpa</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Alice</td><td>3.80</td></tr>
                <tr><td>3</td><td>Carol</td><td>3.90</td></tr>
              </tbody>
            </table>
          </div>

          <div style="background:#FEF3C7;border:1.5px solid #FCD34D;border-radius:14px;padding:24px 28px;">
            <div style="font-size:26px;font-weight:700;color:#D97706;margin-bottom:12px;">⚠️ DELETE vs TRUNCATE</div>
            <div style="font-size:25px;line-height:1.5;">
              <code>DELETE FROM t WHERE …</code> — removes specific rows<br/>
              <code>DELETE FROM t</code> — removes all rows (slow)<br/>
              <code>TRUNCATE TABLE t</code> — wipes all rows instantly, resets IDs
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "", label: "12 Aggregate Functions", html: `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:45px 110px 0;padding-bottom:88px">
      <div class="tag">Going Further</div>
      <div class="slide-title">Aggregate Functions</div>
      <div class="body-text" style="opacity:.6;margin-top:12px;">Perform calculations <strong>across many rows</strong> and return a single result.</div>

      <div class="col2" style="flex:1;align-items:start;margin-top:16px;">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="code-block" style="font-size:27px;">
            <span class="cmt">-- count all students</span><br/>
            <span class="kw">SELECT</span> <span class="fn">COUNT</span>(*) <span class="kw">FROM</span> <span class="tbl">students</span>;<br/><br/>
            <span class="cmt">-- average GPA</span><br/>
            <span class="kw">SELECT</span> <span class="fn">AVG</span>(<span class="col">gpa</span>) <span class="kw">FROM</span> <span class="tbl">students</span>;<br/><br/>
            <span class="cmt">-- highest and lowest GPA</span><br/>
            <span class="kw">SELECT</span> <span class="fn">MAX</span>(<span class="col">gpa</span>), <span class="fn">MIN</span>(<span class="col">gpa</span>)<br/>
            <span class="kw">FROM</span> <span class="tbl">students</span>;<br/><br/>
            <span class="cmt">-- group by + count</span><br/>
            <span class="kw">SELECT</span> <span class="col">age</span>, <span class="fn">COUNT</span>(*) <span class="kw">AS</span> <span class="str">total</span><br/>
            <span class="kw">FROM</span> <span class="tbl">students</span><br/>
            <span class="kw">GROUP BY</span> <span class="col">age</span>;
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- function cards grid -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div style="border-radius:14px;background:#EFF6FF;border:1.5px solid #BFDBFE;padding:24px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:var(--blue2);">COUNT()</div>
              <div style="font-size:24px;margin-top:8px;opacity:.7;">Counts number of rows</div>
              <div style="font-family:var(--mono);font-size:24px;margin-top:6px;color:var(--blue2);">→ 3</div>
            </div>
            <div style="border-radius:14px;background:#ECFDF5;border:1.5px solid #6EE7B7;padding:24px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#059669;">AVG()</div>
              <div style="font-size:24px;margin-top:8px;opacity:.7;">Average of a column</div>
              <div style="font-family:var(--mono);font-size:24px;margin-top:6px;color:#059669;">→ 3.83</div>
            </div>
            <div style="border-radius:14px;background:#FEF3C7;border:1.5px solid #FCD34D;padding:24px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#D97706;">MAX()</div>
              <div style="font-size:24px;margin-top:8px;opacity:.7;">Highest value</div>
              <div style="font-family:var(--mono);font-size:24px;margin-top:6px;color:#D97706;">→ 3.90</div>
            </div>
            <div style="border-radius:14px;background:#FEE2E2;border:1.5px solid #FCA5A5;padding:24px;">
              <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#DC2626;">MIN()</div>
              <div style="font-size:24px;margin-top:8px;opacity:.7;">Lowest value</div>
              <div style="font-family:var(--mono);font-size:24px;margin-top:6px;color:#DC2626;">→ 3.50</div>
            </div>
          </div>

          <div>
            <div class="result-label">GROUP BY age result</div>
            <table class="result-table">
              <thead><tr><th>age</th><th>total</th></tr></thead>
              <tbody>
                <tr><td>20</td><td>1</td></tr>
                <tr><td>21</td><td>1</td></tr>
                <tr><td>22</td><td>1</td></tr>
              </tbody>
            </table>
          </div>

          <div style="border-left:4px solid var(--blue);padding:12px 18px;background:rgba(74,142,245,.07);border-radius:0 8px 8px 0;font-size:25px;line-height:1.4;">
            💡 <code>GROUP BY</code> groups rows so functions run <em>per group</em>.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "dark", label: "13 Joining Tables", html: `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:45px 110px 0;padding-bottom:88px;">
      <div class="tag">Relationships</div>
      <div class="slide-title" style="color:#fff;">Joining Tables</div>

      <div class="col2" style="flex:1;align-items:start;gap:48px;margin-top:28px;">
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- Two tables visual -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div>
              <div style="font-size:24px;color:rgba(255,255,255,.4);font-family:var(--mono);font-weight:600;text-transform:uppercase;margin-bottom:8px;">students</div>
              <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
                <thead><tr style="background:var(--blue2);color:#fff;">
                  <th style="padding:8px 12px;text-align:left;">id</th>
                  <th style="padding:8px 12px;text-align:left;">name</th>
                </tr></thead>
                <tbody style="background:#0f1117;">
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:7px 12px;">1</td><td style="padding:7px 12px;">Alice</td></tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:7px 12px;">2</td><td style="padding:7px 12px;">Bob</td></tr>
                  <tr style="color:#CDD6F4;"><td style="padding:7px 12px;">3</td><td style="padding:7px 12px;">Carol</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <div style="font-size:24px;color:rgba(255,255,255,.4);font-family:var(--mono);font-weight:600;text-transform:uppercase;margin-bottom:8px;">grades</div>
              <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:24px;">
                <thead><tr style="background:#059669;color:#fff;">
                  <th style="padding:8px 12px;text-align:left;">student_id</th>
                  <th style="padding:8px 12px;text-align:left;">score</th>
                </tr></thead>
                <tbody style="background:#0f1117;">
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:7px 12px;">1</td><td style="padding:7px 12px;">88</td></tr>
                  <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:7px 12px;">2</td><td style="padding:7px 12px;">75</td></tr>
                  <tr style="color:#CDD6F4;"><td style="padding:7px 12px;">3</td><td style="padding:7px 12px;">95</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="display:flex;justify-content:center;align-items:center;gap:16px;font-size:26px;color:rgba(255,255,255,.4);font-family:var(--mono);font-weight:600;">
            <div style="width:120px;height:120px;border-radius:50%;background:rgba(74,142,245,.25);border:2px solid var(--blue);display:flex;align-items:center;justify-content:center;font-size:24px;">students</div>
            <div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.3);margin:0 -20px;display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--navy2);font-weight:700;">JOIN</div>
            <div style="width:120px;height:120px;border-radius:50%;background:rgba(5,150,105,.25);border:2px solid #34D399;display:flex;align-items:center;justify-content:center;font-size:24px;">grades</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="code-label" style="color:rgba(255,255,255,.4);">INNER JOIN query</div>
          <div class="code-block" style="font-size:27px;">
            <span class="kw">SELECT</span><br/>
            &nbsp;&nbsp;<span class="tbl">s</span>.<span class="col">name</span>,<br/>
            &nbsp;&nbsp;<span class="tbl">g</span>.<span class="col">score</span><br/>
            <span class="kw">FROM</span> <span class="tbl">students</span> <span class="kw">AS</span> <span class="tbl">s</span><br/>
            <span class="kw">INNER JOIN</span> <span class="tbl">grades</span> <span class="kw">AS</span> <span class="tbl">g</span><br/>
            &nbsp;&nbsp;<span class="kw">ON</span> <span class="tbl">s</span>.<span class="col">id</span> <span class="op">=</span> <span class="tbl">g</span>.<span class="col">student_id</span>;
          </div>

          <div class="result-label">Combined result</div>
          <table style="width:100%;border-collapse:collapse;font-family:var(--mono);font-size:26px;">
            <thead><tr style="background:linear-gradient(90deg, var(--blue2) 50%, #059669 50%);color:#fff;">
              <th style="padding:10px 16px;text-align:left;background:var(--blue2);">name</th>
              <th style="padding:10px 16px;text-align:left;background:#059669;">score</th>
            </tr></thead>
            <tbody style="background:#0f1117;">
              <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:10px 16px;">Alice</td><td style="padding:10px 16px;">88</td></tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,.06);color:#CDD6F4;"><td style="padding:10px 16px;">Bob</td><td style="padding:10px 16px;">75</td></tr>
              <tr style="color:#CDD6F4;"><td style="padding:10px 16px;">Carol</td><td style="padding:10px 16px;">95</td></tr>
            </tbody>
          </table>

          <div style="border-left:4px solid var(--blue);padding:12px 18px;background:rgba(74,142,245,.08);border-radius:0 8px 8px 0;color:rgba(255,255,255,.8);font-size:25px;line-height:1.4;">
            <strong style="color:var(--blue);">INNER JOIN</strong> returns only matching rows from <em>both</em> tables.
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
  { classes: "", label: "14 Summary", html: `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;padding:45px 110px 0;padding-bottom:88px;" style="display:flex;flex-direction:column;height:100%;">
      <div class="tag">Quick Reference</div>
      <div class="slide-title">Summary &amp; Quick Reference</div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;flex:1;margin-top:28px;">
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#89B4FA;">CREATE</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Make a new database or table</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">CREATE TABLE t (…);</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#A6E3A1;">INSERT</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Add rows to a table</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">INSERT INTO t (…) VALUES (…);</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#89DCEB;">SELECT</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Read / query data</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">SELECT * FROM t WHERE …;</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#FAB387;">UPDATE</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Modify existing rows</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">UPDATE t SET col=v WHERE …;</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#F38BA8;">DELETE</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Remove rows</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">DELETE FROM t WHERE …;</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#CBA6F7;">ORDER BY</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Sort results</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">ORDER BY col ASC|DESC;</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#94E2D5;">Aggregates</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Calculate across rows</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">COUNT · AVG · MAX · MIN · SUM</div>
        </div>
        <div style="border-radius:16px;background:var(--navy);color:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;">
          <div style="font-family:var(--mono);font-size:28px;font-weight:700;color:#F9E2AF;">JOIN</div>
          <div style="font-size:24px;opacity:.7;line-height:1.4;">Combine multiple tables</div>
          <div style="background:#0f1117;border-radius:8px;padding:12px;font-family:var(--mono);font-size:24px;color:#CDD6F4;margin-top:auto;">INNER JOIN t ON a.id=b.id;</div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-left">
        <span style="font-weight:700;font-size:24px;">MBI802</span>
        <span class="footer-dot"></span>
        <span>Database Management Systems</span>
      </div>
      <div class="footer-right">
        <span>© Yasas Sri Wickramasinghe</span>
        <span class="footer-dot"></span>
        <span>All Rights Reserved</span>
      </div>
    </div>` },
];

export default function SQLProgrammingDeck() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const id = 'sql-deck-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = DECK_CSS;
      document.head.appendChild(el);
    }
    return () => { document.getElementById('sql-deck-styles')?.remove(); };
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
        border: isFullscreen ? 'none' : '1.5px solid rgba(74,142,245,0.2)',
        boxShadow: isFullscreen ? 'none' : '0 8px 32px rgba(0,0,0,0.25)',
        ...(isFullscreen ? { display: 'flex', flexDirection: 'column' as const, height: '100%' } : {}),
      }}
    >
      {/* macOS-style toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F87171' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FBBF24' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#34D399' }} />
          <span style={{ marginLeft: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            MBI802 · SQL Deck · {current + 1} / {total} · ← → to navigate
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
          background: '#0f1117',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div
            className="sqld"
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
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              dangerouslySetInnerHTML={{ __html: slide.html }}
            />
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <button
          onClick={() => setCurrent(c => Math.max(c - 1, 0))}
          disabled={current === 0}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '6px 14px', color: current === 0 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: current === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}
        >
          <ChevronLeft size={14} /> Prev
        </button>

        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              title={SLIDES[i].label}
              style={{
                width: i === current ? 22 : 8,
                height: 8,
                borderRadius: 999,
                background: i === current ? '#4A8EF5' : 'rgba(255,255,255,0.2)',
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
