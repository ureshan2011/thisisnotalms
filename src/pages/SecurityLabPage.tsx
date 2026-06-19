import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from '../components/ui/BrandLogo';

const APPLE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", system-ui, sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

const TOPICS = [
  { emoji: '\u{1F4A5}', name: 'Input Attacks',          color: '#e5484d' },
  { emoji: '\u{1F511}', name: 'Authentication Flaws',   color: '#f59e0b' },
  { emoji: '\u{1F6E1}️', name: 'Access Control',  color: '#4f46e5' },
  { emoji: '\u{1F4E1}', name: 'Data Exposure',          color: '#0071e3' },
  { emoji: '\u{1F9E9}', name: 'Business Logic',         color: '#30a46c' },
  { emoji: '\u{1F489}', name: 'Injection',              color: '#d946ef' },
  { emoji: '\u{1F527}', name: 'Client-Side Tampering',  color: '#ea580c' },
];

/* -------------------------------------------------------------------------- */
/*  SwiftShop e-commerce simulation HTML (self-contained, deliberately vuln)  */
/* -------------------------------------------------------------------------- */
const SWIFTSHOP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SwiftShop — Security Lab</title>
<style>
  :root{
    --ink:#161B22;--ink-soft:#2A323D;--paper:#F6F8FA;--surface:#FFFFFF;--line:#D5DCE3;
    --blue:#2563EB;--blue-deep:#0F172A;--amber:#D97706;--amber-soft:#FEF3C7;
    --breach:#DC2626;--breach-soft:#FEE2E2;--ok:#059669;--ok-soft:#D1FAE5;
    --muted:#6B7280;--mono:'ui-monospace,SFMono-Regular,Menlo,monospace';
    --sans:'Inter,-apple-system,BlinkMacSystemFont,system-ui,sans-serif';
    --radius:10px;--shadow:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.06);
    --shadow-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--sans);color:var(--ink);background:var(--paper);line-height:1.5;font-size:14px}
  a{color:var(--blue);text-decoration:none}
  button{font-family:inherit;cursor:pointer;border:none;font-size:14px}
  h1,h2,h3,h4{margin:0;letter-spacing:-0.01em}
  input,textarea,select{font-family:inherit;font-size:14px}

  .lab-banner{background:var(--blue-deep);color:#94A3B8;padding:6px 16px;font-size:11px;text-align:center;letter-spacing:.03em;display:flex;align-items:center;justify-content:center;gap:8px}
  .lab-banner b{color:var(--amber)}
  .lab-banner .dot{width:6px;height:6px;border-radius:50%;background:var(--breach);animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

  header{background:var(--surface);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:30}
  .bar{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:10px 20px}
  .logo{font-weight:700;font-size:18px;display:flex;align-items:center;gap:8px;color:var(--ink)}
  .logo .mark{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--blue),#7C3AED);display:grid;place-items:center;color:#fff;font-size:14px;font-weight:800}
  .search-bar{flex:1;max-width:400px;margin:0 auto;position:relative}
  .search-bar input{width:100%;padding:8px 12px 8px 36px;border:1px solid var(--line);border-radius:8px;background:var(--paper);font-size:13px;outline:none;transition:border-color .2s}
  .search-bar input:focus{border-color:var(--blue)}
  .search-bar::before{content:'\\1F50D';position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:14px}
  nav{display:flex;gap:2px}
  nav button{background:none;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:500;color:var(--muted);transition:all .15s}
  nav button:hover{background:var(--paper);color:var(--ink)}
  nav button.active{color:var(--blue);background:rgba(37,99,235,.06);font-weight:600}
  .bar-right{margin-left:auto;display:flex;align-items:center;gap:10px}
  .wallet{font-size:12px;background:var(--amber-soft);color:#92400E;padding:5px 10px;border-radius:8px;font-weight:600;border:1px solid #FDE68A}
  .user-menu{display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:8px;background:var(--paper);border:1px solid var(--line);font-size:13px;font-weight:500;cursor:pointer;transition:all .15s}
  .user-menu:hover{border-color:var(--blue)}
  .user-menu .avatar{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--blue),#7C3AED);display:grid;place-items:center;color:#fff;font-size:11px;font-weight:700}
  .btn{border-radius:8px;padding:8px 16px;font-weight:600;font-size:13px;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
  .btn-primary{background:var(--blue);color:#fff}.btn-primary:hover{background:#1D4ED8}
  .btn-ghost{background:var(--surface);color:var(--ink);border:1px solid var(--line)}.btn-ghost:hover{background:var(--paper)}
  .btn-danger{background:var(--breach);color:#fff}.btn-danger:hover{background:#B91C1C}
  .btn-success{background:var(--ok);color:#fff}
  .btn-sm{padding:5px 10px;font-size:12px;border-radius:6px}

  .wrap{max-width:1200px;margin:0 auto;padding:20px;display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start}
  @media(max-width:920px){.wrap{grid-template-columns:1fr}}
  .main{min-width:0}

  .mission{position:sticky;top:70px;background:var(--blue-deep);color:#CBD5E1;border-radius:var(--radius);padding:20px;border:1px solid #1E293B}
  .mission h3{color:#fff;font-size:15px;display:flex;align-items:center;gap:8px;margin-bottom:4px}
  .mission .sub{font-size:12px;color:#64748B;margin-bottom:16px;line-height:1.5}
  .target-group{margin-bottom:12px}
  .target-group-label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#475569;margin-bottom:6px;font-weight:600}
  .target{display:flex;gap:10px;padding:7px 0;align-items:flex-start}
  .target .ic{font-size:14px;line-height:1.4;width:20px;text-align:center;flex-shrink:0}
  .target .tl{font-weight:600;font-size:12px;color:#E2E8F0}
  .target .td{font-size:11px;color:#64748B;margin-top:1px}
  .mission .foot{font-size:10px;color:#475569;margin-top:14px;border-top:1px solid #1E293B;padding-top:10px;line-height:1.5}

  .panel{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:20px;margin-bottom:16px;box-shadow:var(--shadow)}
  .panel h2{font-size:16px;margin-bottom:2px}
  .panel .lead{color:var(--muted);font-size:13px;margin-bottom:16px}
  .eyebrow{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--blue);font-weight:600;margin-bottom:4px}

  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
  @media(max-width:560px){.grid{grid-template-columns:1fr}}
  .product{border:1px solid var(--line);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:8px;transition:box-shadow .2s,border-color .2s;background:var(--surface)}
  .product:hover{box-shadow:var(--shadow-lg);border-color:var(--blue)}
  .product .emoji{font-size:36px;margin-bottom:4px}
  .product .pname{font-weight:600;font-size:14px}
  .product .pdesc{font-size:12px;color:var(--muted);flex:1;line-height:1.5}
  .product .prow{display:flex;align-items:center;justify-content:space-between;margin-top:6px}
  .price{font-weight:700;font-size:18px;color:var(--ink)}
  .price-old{font-size:13px;color:var(--muted);text-decoration:line-through;margin-left:6px}
  .stock{font-size:11px;color:var(--ok);font-weight:500}
  .stock.low{color:var(--breach)}
  .qtyrow{display:flex;gap:6px;align-items:center;margin-top:8px}
  .qtyrow input{width:56px;padding:6px 8px;border:1px solid var(--line);border-radius:6px;font-size:13px;text-align:center}
  .rating{color:#F59E0B;font-size:12px;letter-spacing:1px}

  .cart-line{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--line);font-size:13px}
  .cart-line:last-child{border-bottom:0}
  .cart-line .nm{flex:1;font-weight:500}
  .cart-line .lt{font-weight:600}
  .cart-empty{color:var(--muted);font-size:13px;padding:20px 0;text-align:center}
  .coupon{display:flex;gap:6px;margin:14px 0}
  .coupon input{flex:1;padding:8px 12px;border:1px solid var(--line);border-radius:8px;font-size:13px}
  .total{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:14px;border-top:2px solid var(--ink)}
  .total .big{font-size:22px;font-weight:700}

  .review{border:1px solid var(--line);border-radius:var(--radius);padding:12px;margin-bottom:8px;background:var(--surface)}
  .review .rh{font-weight:600;font-size:12px;margin-bottom:4px;display:flex;align-items:center;gap:6px}
  .review .rb{font-size:13px;color:var(--ink-soft);line-height:1.5}
  .review .rh .badge-user{font-size:10px;background:var(--paper);padding:2px 6px;border-radius:4px;color:var(--muted)}
  .rev-form textarea{width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:13px;resize:vertical;min-height:60px;outline:none}
  .rev-form textarea:focus{border-color:var(--blue)}

  .field{margin-bottom:12px}
  .field label{display:block;font-size:12px;font-weight:600;margin-bottom:4px;color:var(--ink-soft)}
  .field input,.field select{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;font-size:13px;outline:none}
  .field input:focus,.field select:focus{border-color:var(--blue)}
  .center-card{max-width:380px;margin:24px auto}

  table{width:100%;border-collapse:collapse;font-size:12px}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line)}
  th{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:600}
  td.mono{font-family:ui-monospace,monospace;font-size:11px}
  .badge{display:inline-block;font-size:10px;padding:2px 8px;border-radius:5px;background:var(--paper);font-weight:600}
  .badge.admin{background:var(--breach-soft);color:var(--breach)}
  .badge.user-badge{background:rgba(37,99,235,.08);color:var(--blue)}

  .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(10px);background:var(--ink);color:#fff;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:500;z-index:100;box-shadow:var(--shadow-lg);opacity:0;transition:all .3s;pointer-events:none}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
  .toast.bad{background:var(--breach)}
  .toast.good{background:var(--ok)}

  .loyalty{background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1px solid #FCD34D;border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;gap:14px;margin-bottom:16px}
  .loyalty .lt{flex:1;font-size:13px;color:#78350F}
  .referral-box{background:linear-gradient(135deg,#DBEAFE,#BFDBFE);border:1px solid #93C5FD;border-radius:var(--radius);padding:14px 16px;margin-bottom:16px}
  .referral-box .lt{font-size:13px;color:#1E3A5F}
  .hidden{display:none}

  .tab-bar{display:flex;gap:2px;border-bottom:1px solid var(--line);margin-bottom:16px}
  .tab-bar button{background:none;padding:10px 16px;font-size:13px;font-weight:500;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s}
  .tab-bar button.active{color:var(--blue);border-bottom-color:var(--blue)}
  .tab-bar button:hover{color:var(--ink)}

  .import-export{background:var(--paper);border-radius:8px;padding:12px;margin-top:12px}
  .import-export textarea{width:100%;min-height:50px;padding:8px;border:1px solid var(--line);border-radius:6px;font-family:ui-monospace,monospace;font-size:11px;resize:vertical}

  .order-card{border:1px solid var(--line);border-radius:var(--radius);padding:14px;margin-bottom:8px;background:var(--surface)}
  .order-card .order-id{font-weight:600;font-size:13px;color:var(--blue)}
  .order-card .order-details{font-size:12px;color:var(--muted);margin-top:4px}

  .stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
  .stat-card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:14px;text-align:center}
  .stat-card .val{font-size:24px;font-weight:700;color:var(--blue)}
  .stat-card .lbl{font-size:11px;color:var(--muted);margin-top:2px}
</style>
</head>
<body>

<div class="lab-banner"><span class="dot"></span> TRAINING ENVIRONMENT — <b>SwiftShop Security Lab</b> — deliberately insecure — all data is fake — do not enter real credentials</div>

<header>
  <div class="bar">
    <div class="logo"><span class="mark">S</span>SwiftShop</div>
    <div class="search-bar"><input type="text" placeholder="Search products..." id="searchInput"></div>
    <nav id="nav">
      <button data-view="shop" class="active">Shop</button>
      <button data-view="cart">Cart <span id="cartCount"></span></button>
      <button data-view="orders">Orders</button>
      <button data-view="account">Account</button>
      <button data-view="admin" id="navAdmin" class="hidden">Admin</button>
    </nav>
    <div class="bar-right">
      <span class="wallet" id="wallet">$0.00</span>
      <div class="user-menu" id="authBtn">
        <span class="avatar" id="avatarLetter">G</span>
        <span id="whoami">Guest</span>
      </div>
    </div>
  </div>
</header>

<div class="wrap">
  <div class="main" id="main"></div>

  <aside class="mission">
    <h3>\\u{1F3AF} Mission Control</h3>
    <p class="sub">SwiftShop was built fast and shipped with security as an afterthought. Sixteen classes of weakness are hiding in this app. Find them, exploit them, then explain how a security-first design would stop each one.</p>

    <div class="target-group">
      <div class="target-group-label">Input & Injection</div>
      <div class="target"><span class="ic">\\u{2328}\\uFE0F</span><div><div class="tl">1. Input Manipulation</div><div class="td">Feed the system values it should never accept (negative qty, decimals).</div></div></div>
      <div class="target"><span class="ic">\\u{1F489}</span><div><div class="tl">2. Stored XSS</div><div class="td">Inject HTML/JS via reviews that runs for every visitor.</div></div></div>
      <div class="target"><span class="ic">\\u{1F517}</span><div><div class="tl">3. Reflected XSS</div><div class="td">Craft a URL with a ?promo= param that renders unsanitised HTML.</div></div></div>
    </div>

    <div class="target-group">
      <div class="target-group-label">Auth & Access</div>
      <div class="target"><span class="ic">\\u{1F513}</span><div><div class="tl">4. Broken Authentication</div><div class="td">No rate limit, no lockout, plaintext passwords in the source.</div></div></div>
      <div class="target"><span class="ic">\\u{1F451}</span><div><div class="tl">5. Privilege Escalation</div><div class="td">Edit your session role in storage to reach the admin panel.</div></div></div>
      <div class="target"><span class="ic">\\u{1F4CB}</span><div><div class="tl">6. Mass Assignment</div><div class="td">The profile update takes every field \\u2014 including role and balance.</div></div></div>
    </div>

    <div class="target-group">
      <div class="target-group-label">Data & Storage</div>
      <div class="target"><span class="ic">\\u{1F4E4}</span><div><div class="tl">7. Data Theft</div><div class="td">Hardcoded API keys, credentials, and card numbers in the source.</div></div></div>
      <div class="target"><span class="ic">\\u{1F5C4}\\uFE0F</span><div><div class="tl">8. Direct Storage Tampering</div><div class="td">Edit localStorage directly \\u2014 change prices, balances, roles.</div></div></div>
      <div class="target"><span class="ic">\\u{1F4E6}</span><div><div class="tl">9. Insecure Deserialization</div><div class="td">Import a cart from base64 JSON \\u2014 the app trusts whatever you send.</div></div></div>
      <div class="target"><span class="ic">\\u{1F522}</span><div><div class="tl">10. IDOR</div><div class="td">Order IDs are sequential \\u2014 view any order by changing the number.</div></div></div>
      <div class="target"><span class="ic">\\u{1F4AC}</span><div><div class="tl">11. Information Disclosure</div><div class="td">Console.log leaks secrets; verbose errors expose internals.</div></div></div>
    </div>

    <div class="target-group">
      <div class="target-group-label">Business Logic</div>
      <div class="target"><span class="ic">\\u{1FA99}</span><div><div class="tl">12. Resource Misappropriation</div><div class="td">Unlimited loyalty bonus, staff coupon in the code.</div></div></div>
      <div class="target"><span class="ic">\\u{1F501}</span><div><div class="tl">13. Self-Referral Abuse</div><div class="td">Refer yourself or reuse the same referral code endlessly.</div></div></div>
      <div class="target"><span class="ic">\\u{26A1}</span><div><div class="tl">14. Race Condition</div><div class="td">Rapid-fire the bonus button \\u2014 no mutex means multiple credits.</div></div></div>
    </div>

    <div class="target-group">
      <div class="target-group-label">Sabotage & Tampering</div>
      <div class="target"><span class="ic">\\u{1F9EC}</span><div><div class="tl">15. Program Alteration</div><div class="td">Change GLOBAL_DISCOUNT or cart functions from the console.</div></div></div>
      <div class="target"><span class="ic">\\u{1F4A3}</span><div><div class="tl">16. Sabotage</div><div class="td">nukeStore() wipes everything \\u2014 no auth, no confirmation needed.</div></div></div>
    </div>

    <div class="foot">\\u{1F4A1} <b>Tip:</b> Open DevTools (F12) \\u2192 Console / Application / Sources. The source code IS the vulnerability surface.</div>
  </aside>
</div>

<div class="toast" id="toast"></div>

<script>
/* =========================================================================
   SwiftShop \\u2014 deliberately insecure training app (v3).
   Everything runs client-side. "The database" is localStorage.
   16 vulnerability classes for students to discover.
   ========================================================================= */

// --- VULNERABILITY 4 & 7: Secrets baked into front-end ---
const ADMIN_CREDENTIALS = { username: "admin", password: "SwiftAdmin#2026", role: "admin" };
const PAYMENT_API_SECRET = "sk_live_51Hx0FAKEkeyForClassDoNotUse_9920xZ";
const INTERNAL_API_ENDPOINT = "https://api.swiftshop-internal.fake/v2/payments";
const JWT_SIGNING_KEY = "super-secret-jwt-key-do-not-share-2026";
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const DB_CONNECTION = "postgres://admin:s3cretP@ss@db.swiftshop.fake/prod";
const STAFF_COUPON = "STAFF100"; // 100% off
const REFERRAL_BONUS = 15; // $15 per referral

// --- VULNERABILITY 15: Global the totals depend on ---
let GLOBAL_DISCOUNT = 0; // 0..1

// --- VULNERABILITY 11: Information Disclosure via console ---
console.log("[SwiftShop DEBUG] Payment API Secret:", PAYMENT_API_SECRET);
console.log("[SwiftShop DEBUG] JWT Key:", JWT_SIGNING_KEY);
console.log("[SwiftShop DEBUG] Internal endpoint:", INTERNAL_API_ENDPOINT);
console.log("[SwiftShop DEBUG] AWS Access Key:", AWS_ACCESS_KEY);
console.log("[SwiftShop DEBUG] Database connection:", DB_CONNECTION);
console.log("[SwiftShop DEBUG] Admin credentials loaded from config:", ADMIN_CREDENTIALS);
console.log("[SwiftShop DEBUG] App initialized. Environment: PRODUCTION");
console.log("[SwiftShop DEBUG] Server: swiftshop-api-prod.internal:3000");
console.log("[SwiftShop DEBUG] Internal endpoints: /api/admin/users, /api/admin/config, /api/debug/dump");
console.log("[SwiftShop DEBUG] Feature flags:", { enablePayments: true, debugMode: true, maintenanceMode: false });

const SEED_PRODUCTS = [
  { id:1, name:"Wireless Earbuds Pro", emoji:"\\u{1F3A7}", desc:"Active noise-cancelling, 36h battery, IPX5 waterproof.", price:89.00, stock:12, rating:4.7, reviews:234 },
  { id:2, name:"Mechanical Keyboard", emoji:"\\u{2328}\\uFE0F", desc:"Hot-swappable Cherry MX switches, per-key RGB.", price:119.00, stock:7, rating:4.9, reviews:89 },
  { id:3, name:"Smart Desk Lamp", emoji:"\\u{1F4A1}", desc:"Warm/cool dimmable LED, auto-brightness sensor.", price:34.50, stock:25, rating:4.3, reviews:156 },
  { id:4, name:"USB-C Hub 7-in-1", emoji:"\\u{1F50C}", desc:"4K HDMI, 100W PD, SD card, 3\\u00D7 USB-A.", price:45.00, stock:18, rating:4.5, reviews:312 },
  { id:5, name:"Webcam 4K Ultra", emoji:"\\u{1F4F7}", desc:"Auto-focus, built-in ring light, noise-cancelling mic.", price:79.00, stock:9, rating:4.6, reviews:67 },
  { id:6, name:"Portable SSD 1TB", emoji:"\\u{1F4BE}", desc:"USB 3.2 Gen 2, 1050 MB/s read, shock-resistant.", price:99.00, stock:14, rating:4.8, reviews:445 }
];

const SEED_USERS = [
  { id:1, username:"student", password:"student123", role:"user", balance:50.00, card:"4111-1111-1111-0042", email:"student@swiftshop.fake", referralCode:"STU-2026" },
  { id:2, username:"amir.k",  password:"letmein",     role:"user", balance:210.00, card:"4222-9087-1144-7781", email:"amir@swiftshop.fake", referralCode:"AMR-2026" },
  { id:3, username:"priya.n", password:"spring2026",  role:"user", balance:95.50,  card:"4539-6610-3320-9912", email:"priya@swiftshop.fake", referralCode:"PRI-2026" }
];

// --- localStorage "database" ---
const DB = {
  init(){
    if(!localStorage.getItem("swift_users"))    localStorage.setItem("swift_users", JSON.stringify(SEED_USERS));
    if(!localStorage.getItem("swift_products")) localStorage.setItem("swift_products", JSON.stringify(SEED_PRODUCTS));
    if(!localStorage.getItem("swift_reviews"))  localStorage.setItem("swift_reviews", JSON.stringify([
      { user:"amir.k", text:"Earbuds are great, fast delivery.", rating:5 },
      { user:"priya.n", text:"Keyboard feels premium for the price.", rating:4 },
      { user:"student", text:"USB-C hub works perfectly with my MacBook.", rating:5 }
    ]));
    if(!localStorage.getItem("swift_orders")) localStorage.setItem("swift_orders", JSON.stringify([
      { id:1001, user:"amir.k",  items:"Wireless Earbuds Pro \\u00D71, USB-C Hub 7-in-1 \\u00D72", total:179.00, address:"42 Oak Lane, Springfield", card:"**** 7781" },
      { id:1002, user:"priya.n", items:"Mechanical Keyboard \\u00D71",                     total:119.00, address:"15 Elm Street, Portland",   card:"**** 9912" },
      { id:1003, user:"student", items:"Smart Desk Lamp \\u00D72, Webcam 4K Ultra \\u00D71",    total:148.00, address:"88 Pine Ave, Denver",      card:"**** 0042" }
    ]));
  },
  users()    { return JSON.parse(localStorage.getItem("swift_users")); },
  setUsers(u){ localStorage.setItem("swift_users", JSON.stringify(u)); },
  products() { return JSON.parse(localStorage.getItem("swift_products")); },
  reviews()  { return JSON.parse(localStorage.getItem("swift_reviews")); },
  setReviews(r){ localStorage.setItem("swift_reviews", JSON.stringify(r)); },
  orders()   { return JSON.parse(localStorage.getItem("swift_orders")); },
  setOrders(o){ localStorage.setItem("swift_orders", JSON.stringify(o)); },
  session()  { const s=localStorage.getItem("swift_session"); return s?JSON.parse(s):null; },
  setSession(s){ localStorage.setItem("swift_session", JSON.stringify(s)); console.log("[SwiftShop DEBUG] Session saved:", s); },
  clearSession(){ localStorage.removeItem("swift_session"); }
};

// --- VULNERABILITY 16: Global wipe with no guard rails ---
function nukeStore(){ localStorage.clear(); location.reload(); }

let cart = [];
let currentView = "shop";

/* ---------- helpers ---------- */
function $(id){ return document.getElementById(id); }
function toast(msg, kind){
  const t=$("toast"); t.textContent=msg; t.className="toast show "+(kind||"");
  setTimeout(()=>{ t.className="toast"; }, 2800);
}
function currentUser(){
  const s=DB.session(); if(!s) return null;
  return DB.users().find(u=>u.username===s.username) || (s.role==="admin"?{username:s.username,role:"admin",balance:0}:null);
}

/* ---------- VULNERABILITY 3: Reflected XSS via URL param ---------- */
function getPromoFromURL(){
  const params = new URLSearchParams(window.location.search||window.location.hash.split('?')[1]||"");
  return params.get("promo") || "";
}

/* ---------- cart maths (VULNERABILITY 1 & 15) ---------- */
function lineTotal(item){ return item.price * item.qty; }
function cartSubtotal(){ return cart.reduce((a,i)=>a+lineTotal(i),0); }
function getCartTotal(){ return cartSubtotal() * (1 - GLOBAL_DISCOUNT); }

/* ---------- auth (VULNERABILITY 4) ---------- */
let loginAttempts = 0;
function login(username, password){
  // VULNERABILITY 4: No rate limiting, no account lockout, plaintext comparison
  loginAttempts++;
  console.log("[SwiftShop DEBUG] Login attempt #" + loginAttempts + " for user:", username, "password:", password);
  if(username===ADMIN_CREDENTIALS.username && password===ADMIN_CREDENTIALS.password){
    DB.setSession({username,role:"admin"}); return { success: true };
  }
  const u=DB.users().find(x=>x.username===username && x.password===password);
  if(u){ DB.setSession({username:u.username,role:u.role}); return { success: true }; }
  // VULNERABILITY 11: Verbose error discloses whether user exists
  const exists = DB.users().find(x=>x.username===username);
  if(exists){
    console.log("[SwiftShop DEBUG] Password mismatch for existing user:", username, "Expected:", exists.password);
    return { success: false, error: 'Incorrect password for "' + username + '". Hint: password starts with "' + exists.password.substring(0,3) + '..."' };
  }
  return { success: false, error: 'User "' + username + '" does not exist in the database. Try: student, amir.k, priya.n, or admin.' };
}
function logout(){ DB.clearSession(); cart=[]; render(); }

/* ---------- VULNERABILITY 9: Cart export/import (insecure deserialization) ---------- */
function exportCart(){
  const data = { cart: cart, discount: GLOBAL_DISCOUNT, session: DB.session(), timestamp: Date.now() };
  return btoa(JSON.stringify(data));
}
function importCart(b64){
  try{
    // VULNERABILITY 9: No validation \\u2014 trusts whatever comes in
    const data = JSON.parse(atob(b64));
    console.log("[SwiftShop DEBUG] Importing cart data (no validation):", data);
    if(data.cart) cart = data.cart; // Could have negative prices
    if(data.discount !== undefined) GLOBAL_DISCOUNT = data.discount; // Could set 100% off
    if(data.session) DB.setSession(data.session); // Could escalate privileges
    toast("Cart imported successfully","good");
    render();
  }catch(e){
    // VULNERABILITY 11: Verbose error exposes internals
    toast("Import error: " + e.message,"bad");
    console.error("[SwiftShop DEBUG] Full import error:", e.message, e.stack);
  }
}

/* ---------- views ---------- */
function shopView(){
  const products = DB.products();
  const promo = getPromoFromURL();
  // VULNERABILITY 3: promo is rendered as raw HTML
  const promoBanner = promo ? '<div style="background:linear-gradient(135deg,#DBEAFE,#EDE9FE);border:1px solid #93C5FD;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1E3A5F">\\u{1F389} '+promo+'</div>' : '';

  return promoBanner + '<div class="panel"><div class="eyebrow">Catalogue</div><h2>Today at SwiftShop</h2><p class="lead">Browse our curated selection. Add items to your cart, then head to checkout.</p><div class="grid">' +
    products.map(p => '<div class="product"><div class="emoji">'+p.emoji+'</div><div class="pname">'+p.name+'</div><div class="pdesc">'+p.desc+'</div><div class="rating">'+"\\u2605".repeat(Math.floor(p.rating))+(p.rating%1>=0.5?"\\u00BD":"")+" "+p.rating+' <span style="color:var(--muted)">('+p.reviews+')</span></div><div class="prow"><span><span class="price">$'+p.price.toFixed(2)+'</span></span><span class="stock'+(p.stock<10?" low":"")+'">'+p.stock+' in stock</span></div><div class="qtyrow"><input type="number" id="qty-'+p.id+'" value="1" min="1"><button class="btn btn-primary btn-sm" onclick="addToCart('+p.id+')">Add to cart</button></div></div>').join("") +
    '</div></div>' +
    '<div class="panel"><div class="eyebrow">Community</div><h2>Product reviews</h2><p class="lead">See what other shoppers think \\u2014 and leave your own.</p><div id="reviewList">'+reviewsHtml()+'</div><div class="rev-form" style="margin-top:12px"><textarea id="reviewText" placeholder="Write a review\\u2026"></textarea><button class="btn btn-primary btn-sm" style="margin-top:8px" onclick="postReview()">Post review</button></div></div>';
}

function reviewsHtml(){
  // VULNERABILITY 2: review text is inserted as raw HTML
  return DB.reviews().map(r =>
    '<div class="review"><div class="rh"><span class="avatar" style="width:20px;height:20px;font-size:9px;display:inline-grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#2563EB,#7C3AED);color:#fff">'+r.user[0].toUpperCase()+'</span> '+r.user+' <span class="badge-user">'+("\\u2605".repeat(r.rating||5))+'</span></div><div class="rb">'+r.text+'</div></div>'
  ).join("");
}

function cartView(){
  const lines = cart.length ? cart.map((i,idx)=>
    '<div class="cart-line"><span class="nm">'+i.name+' <span style="color:var(--muted)">\\u00D7 '+i.qty+'</span></span><span class="lt">$'+lineTotal(i).toFixed(2)+'</span><button class="btn btn-ghost btn-sm" onclick="removeLine('+idx+')">Remove</button></div>'
  ).join("") : '<div class="cart-empty">\\u{1F6D2} Your cart is empty. Start shopping!</div>';

  return '<div class="loyalty"><span style="font-size:24px">\\u{1FA99}</span><div class="lt"><b>Loyalty bonus:</b> Claim $10 store credit as a thank-you for shopping with us!</div><button class="btn btn-primary btn-sm" onclick="claimBonus()">Claim $10</button></div>' +

  '<div class="referral-box"><div class="lt"><b>\\u{1F381} Refer a friend:</b> Enter a referral code to earn $'+REFERRAL_BONUS+' credit.</div><div style="display:flex;gap:6px;margin-top:8px"><input id="referralInput" placeholder="Enter referral code" style="flex:1;padding:8px;border:1px solid #93C5FD;border-radius:6px;font-size:13px"><button class="btn btn-primary btn-sm" onclick="applyReferral()">Apply</button></div></div>' +

  '<div class="panel"><div class="eyebrow">Checkout</div><h2>Your cart</h2><p class="lead">Review your items and apply a coupon if you have one.</p>' +
  lines +
  '<div class="coupon"><input id="couponInput" placeholder="Coupon code"><button class="btn btn-ghost" onclick="applyCoupon()">Apply</button></div>' +
  '<div class="total"><span style="font-size:12px;color:var(--muted)">Total '+(GLOBAL_DISCOUNT>0?'(\\u2212'+Math.round(GLOBAL_DISCOUNT*100)+'%)':'')+'</span><span class="big">$'+getCartTotal().toFixed(2)+'</span></div>' +
  '<button class="btn btn-primary" style="width:100%;margin-top:14px;padding:11px" onclick="checkout()">Pay with wallet</button></div>' +

  '<div class="panel"><div class="eyebrow">Cart Tools</div><h2>Import / Export Cart</h2><p class="lead">Save or restore your cart using encoded data.</p><div class="import-export"><button class="btn btn-ghost btn-sm" onclick="document.getElementById(\'exportData\').value=exportCart()">Export cart</button><textarea id="exportData" placeholder="Encoded cart data will appear here..." style="margin-top:8px"></textarea><div style="margin-top:8px;display:flex;gap:6px"><input id="importData" placeholder="Paste encoded cart data..." style="flex:1;padding:8px;border:1px solid var(--line);border-radius:6px;font-size:12px;font-family:ui-monospace,monospace"><button class="btn btn-primary btn-sm" onclick="importCart(document.getElementById(\'importData\').value)">Import</button></div></div></div>';
}

function ordersView(){
  const s=DB.session();
  if(!s) return loginPrompt("Sign in to view your orders.");
  const orders=DB.orders();
  // VULNERABILITY 10: IDOR \\u2014 any user can view any order by sequential ID
  return '<div class="panel"><div class="eyebrow">Order History</div><h2>Your orders</h2><p class="lead">View details of any order by ID.</p>' +
    '<div style="display:flex;gap:6px;margin-bottom:16px"><input id="orderLookup" placeholder="Enter order ID (e.g. 1001, 1002, 1003...)" style="flex:1;padding:8px;border:1px solid var(--line);border-radius:6px"><button class="btn btn-ghost btn-sm" onclick="lookupOrder()">Look up</button></div>' +
    '<div id="orderResult"></div>' +
    (orders.length ? orders.map(o => '<div class="order-card"><div class="order-id">Order #'+o.id+'</div><div class="order-details">'+o.user+' \\u2014 '+o.items+' \\u2014 <b>$'+o.total.toFixed(2)+'</b></div></div>').join("") : '<p class="lead">No orders yet.</p>') +
    '</div>';
}

function accountView(){
  const u=currentUser();
  if(!u) return loginPrompt("Sign in to view your account.");
  // VULNERABILITY 6: Mass assignment \\u2014 profile form includes role and balance fields
  return '<div class="panel"><div class="eyebrow">Account</div><h2>'+u.username+'</h2><p class="lead">Manage your SwiftShop profile and wallet.</p>' +
    '<div class="stats-row"><div class="stat-card"><div class="val">$'+(u.balance||0).toFixed(2)+'</div><div class="lbl">Wallet Balance</div></div><div class="stat-card"><div class="val"><span class="badge '+(u.role==="admin"?"admin":"user-badge")+'">'+u.role+'</span></div><div class="lbl">Account Role</div></div><div class="stat-card"><div class="val">'+(u.card?u.card.slice(-4):"\\u2014")+'</div><div class="lbl">Card ending</div></div></div>' +
    '<div class="tab-bar"><button class="active">Profile</button><button>Security</button><button>Preferences</button></div>' +
    '<h3 style="font-size:14px;margin-bottom:12px">Update profile</h3>' +
    '<div class="field"><label>Username</label><input id="profUsername" value="'+u.username+'"></div>' +
    '<div class="field"><label>Email</label><input id="profEmail" value="'+(u.email||"")+'"></div>' +
    '<div class="field"><label>Card number</label><input id="profCard" value="'+(u.card||"")+'"></div>' +
    '<!-- VULNERABILITY 6: These hidden fields are still submitted -->' +
    '<div class="field"><label>Role <span style="font-size:10px;color:var(--muted)">(display only)</span></label><input id="profRole" value="'+u.role+'"></div>' +
    '<div class="field"><label>Balance <span style="font-size:10px;color:var(--muted)">(display only)</span></label><input id="profBalance" value="'+(u.balance||0).toFixed(2)+'"></div>' +
    '<button class="btn btn-primary" onclick="updateProfile()">Save changes</button>' +
    '<button class="btn btn-ghost" style="margin-left:8px" onclick="logout()">Sign out</button></div>';
}

function adminView(){
  const s=DB.session();
  // VULNERABILITY 5: Only checks session role, which can be edited in localStorage
  if(!s||s.role!=="admin") return loginPrompt("Admin access only.");
  const users=DB.users();
  const orders=DB.orders();
  return '<div class="panel"><div class="eyebrow">Admin \\u00B7 Restricted</div><h2>Control panel</h2><p class="lead">Full customer and order data. Handle with care.</p>' +
    '<h3 style="font-size:14px;margin:14px 0 8px">Customers</h3>' +
    '<table><tr><th>User</th><th>Email</th><th>Role</th><th>Balance</th><th>Saved card</th><th>Password</th></tr>' +
    users.map(u=>'<tr><td>'+u.username+'</td><td class="mono">'+(u.email||"\\u2014")+'</td><td><span class="badge '+(u.role==="admin"?"admin":"user-badge")+'">'+u.role+'</span></td><td class="mono">$'+u.balance.toFixed(2)+'</td><td class="mono">'+u.card+'</td><td class="mono">'+u.password+'</td></tr>').join("") +
    '</table>' +
    '<h3 style="font-size:14px;margin:20px 0 8px">System Configuration</h3>' +
    '<table><tr><th>Key</th><th>Value</th></tr>' +
    '<tr><td>STRIPE_SECRET_KEY</td><td class="mono" style="color:var(--breach)">'+PAYMENT_API_SECRET+'</td></tr>' +
    '<tr><td>DATABASE_URL</td><td class="mono" style="color:var(--breach)">'+DB_CONNECTION+'</td></tr>' +
    '<tr><td>JWT_SECRET</td><td class="mono" style="color:var(--breach)">'+JWT_SIGNING_KEY+'</td></tr>' +
    '<tr><td>AWS_ACCESS_KEY</td><td class="mono" style="color:var(--breach)">'+AWS_ACCESS_KEY+'</td></tr></table>' +
    '<h3 style="font-size:14px;margin:20px 0 8px">Orders ('+orders.length+')</h3>' +
    (orders.length ? '<table><tr><th>ID</th><th>By</th><th>Items</th><th>Paid</th><th>Address</th><th>Card</th></tr>'+orders.map(o=>'<tr><td class="mono">#'+o.id+'</td><td>'+o.user+'</td><td>'+o.items+'</td><td class="mono">$'+o.total.toFixed(2)+'</td><td>'+(o.address||"\\u2014")+'</td><td class="mono">'+(o.card||"\\u2014")+'</td></tr>').join("")+'</table>' : '<p class="lead">No orders yet.</p>') +
    '<div style="margin-top:20px;display:flex;gap:8px"><button class="btn btn-danger btn-sm" onclick="nukeStore()">Reset all data</button><button class="btn btn-ghost btn-sm" onclick="console.table(DB.users())">Dump users to console</button></div></div>';
}

function loginPrompt(msg){
  return '<div class="panel center-card"><div class="eyebrow">Sign in</div><h2>Welcome back</h2><p class="lead">'+(msg||"Sign in to your SwiftShop account.")+'</p>' +
    '<div class="field"><label>Username</label><input id="loginUser" placeholder="student"></div>' +
    '<div class="field"><label>Password</label><input id="loginPass" type="password" placeholder="\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022"></div>' +
    '<div id="loginError" style="display:none;color:var(--breach);font-size:12px;margin-bottom:10px;padding:8px;background:var(--breach-soft);border-radius:6px"></div>' +
    '<button class="btn btn-primary" style="width:100%" onclick="doLogin()">Sign in</button>' +
    '<p style="font-size:11px;color:var(--muted);margin-top:14px;text-align:center">Demo \\u2014 username <code>student</code>, password <code>student123</code></p></div>';
}

/* ---------- actions ---------- */
function addToCart(id){
  const p=DB.products().find(x=>x.id===id);
  // VULNERABILITY 1: parseFloat allows negatives, decimals \\u2014 no validation
  const qty=parseFloat($("qty-"+id).value);
  console.log("[SwiftShop DEBUG] Adding to cart:", p.name, "qty:", qty, "type:", typeof qty);
  const existing=cart.find(c=>c.id===id);
  if(existing){existing.qty+=qty;}else{cart.push({id:p.id,name:p.name,price:p.price,qty});}
  toast(p.name+" added (qty "+qty+")","good");
  updateChrome();
}
function removeLine(idx){cart.splice(idx,1);render();}

function applyCoupon(){
  const code=($("couponInput").value||"").trim().toUpperCase();
  // VULNERABILITY 12: No usage limit, no server validation
  if(code==="SAVE20"){GLOBAL_DISCOUNT=0.20;toast("20% coupon applied","good");}
  else if(code==="WELCOME10"){GLOBAL_DISCOUNT=0.10;toast("10% welcome discount applied","good");}
  else if(code===STAFF_COUPON){GLOBAL_DISCOUNT=1.0;toast("Staff coupon applied \\u2014 100% off!","good");}
  else if(code==="EMPLOYEE50"){GLOBAL_DISCOUNT=0.50;toast("50% employee discount applied","good");}
  else if(code==="VIP99"){GLOBAL_DISCOUNT=0.99;toast("99% VIP discount applied!","good");}
  else{
    // VULNERABILITY 11: Error reveals valid coupon codes
    toast("Invalid coupon. Try: SAVE20, WELCOME10, STAFF100, EMPLOYEE50, VIP99","bad");
  }
  render();
}

// VULNERABILITY 14 & 12: No limit, no mutex \\u2014 spam for unlimited credit
function claimBonus(){
  const s=DB.session();
  if(!s){toast("Sign in to claim your bonus","bad");return;}
  const users=DB.users();
  const u=users.find(x=>x.username===s.username);
  if(u){
    // VULNERABILITY 14: Race condition \\u2014 no debounce, no server-side idempotency
    u.balance+=10;
    DB.setUsers(users);
    console.log("[SwiftShop DEBUG] Loyalty bonus claimed. New balance:", u.balance, "No claim limit enforced.");
    toast("$10 credit added \\u{1FA99}","good");
    updateChrome();
  }
  else{toast("Bonus only for registered shoppers","bad");}
}

// VULNERABILITY 13: Self-referral, no usage tracking
function applyReferral(){
  const code=($("referralInput").value||"").trim().toUpperCase();
  const s=DB.session();
  if(!s){toast("Sign in first","bad");return;}
  const users=DB.users();
  const referrer=users.find(u=>u.referralCode&&u.referralCode.toUpperCase()===code);
  if(!referrer){
    // VULNERABILITY 11: error reveals valid codes
    toast("Invalid referral code. Codes look like: STU-2026, AMR-2026, PRI-2026","bad");
    return;
  }
  // No check: can refer yourself, can reuse codes
  console.log("[SwiftShop DEBUG] Referral applied:", code, "No self-referral or duplicate check.");
  const me=users.find(x=>x.username===s.username);
  if(me)me.balance+=REFERRAL_BONUS;
  if(referrer)referrer.balance+=REFERRAL_BONUS;
  DB.setUsers(users);
  toast("Referral applied! $"+REFERRAL_BONUS+" added to both accounts","good");
  updateChrome();
}

function checkout(){
  const s=DB.session();
  if(!s){toast("Sign in to check out","bad");return;}
  if(!cart.length){toast("Your cart is empty","bad");return;}
  const total=getCartTotal();
  const users=DB.users();
  const u=users.find(x=>x.username===s.username);
  if(!u){toast("Account not found","bad");return;}
  // VULNERABILITY 1: No check that total >= 0 \\u2014 negative total ADDS to wallet
  console.log("[SwiftShop DEBUG] Processing payment:", {user:u.username, total, card:u.card, address:u.address}); // info disclosure
  u.balance-=total;
  DB.setUsers(users);
  const orders=DB.orders();
  const nextId = orders.length ? Math.max(...orders.map(o=>o.id||0)) + 1 : 1001;
  orders.push({id:nextId, user:u.username,items:cart.map(c=>c.name+"\\u00D7"+c.qty).join(", "),total, address:"123 Student Rd", card:u.card?"**** "+u.card.slice(-4):"N/A"});
  DB.setOrders(orders);
  cart=[];GLOBAL_DISCOUNT=0;
  toast("Order placed \\u2014 charged $"+total.toFixed(2),"good");
  render();
}

// VULNERABILITY 10: Any user can look up any order by sequential ID
function lookupOrder(){
  const id=parseInt($("orderLookup").value);
  const orders=DB.orders();
  const el=$("orderResult");
  const order = orders.find(o => o.id === id);
  if(!order){
    // VULNERABILITY 11: reveals valid ID range
    const ids = orders.map(o=>o.id).join(", ");
    el.innerHTML='<div style="color:var(--breach);font-size:13px;padding:8px 0">Order not found. Valid order IDs: '+ids+'. Error ref: IDOR_LOOKUP_'+id+'</div>';
    return;
  }
  // Shows ALL order data regardless of who is viewing
  console.log("[SwiftShop DEBUG] IDOR: Order lookup for #"+id+" by user:", DB.session()?.username, "Order belongs to:", order.user);
  el.innerHTML='<div class="order-card" style="border-color:var(--blue)"><div class="order-id">Order #'+order.id+'</div><div class="order-details"><b>Customer:</b> '+order.user+'<br><b>Items:</b> '+order.items+'<br><b>Total:</b> $'+order.total.toFixed(2)+'<br><b>Address:</b> '+(order.address||"N/A")+'<br><b>Card:</b> '+(order.card||"N/A")+'</div></div>';
}

function postReview(){
  const s=DB.session();
  const text=$("reviewText").value.trim();
  if(!text)return;
  // VULNERABILITY 2: stored verbatim, rendered as raw HTML
  const reviews=DB.reviews();
  reviews.push({user:s?s.username:"guest",text,rating:5});
  DB.setReviews(reviews);
  $("reviewText").value="";
  $("reviewList").innerHTML=reviewsHtml();
  toast("Review posted");
}

// VULNERABILITY 6: Mass assignment \\u2014 takes ALL form fields
function updateProfile(){
  const s=DB.session();
  if(!s)return;
  const users=DB.users();
  const u=users.find(x=>x.username===s.username);
  if(!u){toast("User not found","bad");return;}
  // Blindly applies all fields including role and balance
  u.username=$("profUsername").value.trim()||u.username;
  u.email=$("profEmail").value.trim()||u.email;
  u.card=$("profCard").value.trim()||u.card;
  u.role=$("profRole").value.trim()||u.role;       // MASS ASSIGNMENT: role can be changed
  u.balance=parseFloat($("profBalance").value)||u.balance; // MASS ASSIGNMENT: balance too
  DB.setUsers(users);
  // Update session if role changed
  DB.setSession({username:u.username,role:u.role});
  console.log("[SwiftShop DEBUG] Profile updated (mass assignment):", {username:u.username, role:u.role, balance:u.balance});
  toast("Profile updated","good");
  render();
}

function doLogin(){
  const user=$("loginUser").value.trim();
  const pass=$("loginPass").value;
  const result = login(user,pass);
  if(result.success){
    toast("Signed in","good");
    render();
  } else {
    // VULNERABILITY 11: Verbose error shown to user
    const errEl = $("loginError");
    if(errEl){
      errEl.style.display = "block";
      errEl.textContent = result.error;
    }
    toast("Login failed","bad");
  }
}

/* ---------- chrome / routing ---------- */
function updateChrome(){
  const u=currentUser();
  const s=DB.session();
  $("whoami").textContent=s?s.username:"Guest";
  $("avatarLetter").textContent=s?s.username[0].toUpperCase():"G";
  $("wallet").textContent="$"+(u&&u.balance!=null?u.balance.toFixed(2):"0.00");
  $("navAdmin").className=(s&&s.role==="admin")?"":"hidden";
  $("cartCount").textContent=cart.length?"("+cart.length+")":"";
}

function render(){
  let html="";
  if(currentView==="shop") html=shopView();
  else if(currentView==="cart") html=cartView();
  else if(currentView==="orders") html=ordersView();
  else if(currentView==="account") html=accountView();
  else if(currentView==="admin") html=adminView();
  $("main").innerHTML=html;
  updateChrome();
  document.querySelectorAll("#nav button").forEach(b=>{
    b.classList.toggle("active",b.dataset.view===currentView);
  });
}

document.getElementById("nav").addEventListener("click",e=>{
  if(e.target.dataset&&e.target.dataset.view){currentView=e.target.dataset.view;render();}
});
$("authBtn").addEventListener("click",()=>{
  if(DB.session()){logout();}else{currentView="account";render();}
});

DB.init();
render();
</script>
</body>
</html>`;

export default function SecurityLabPage() {
  return (
    <div style={{ fontFamily: APPLE_FONT }} className="min-h-screen bg-white text-[#1d1d1f]">

      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b border-black/[0.07] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link to="/home" className="no-underline">
            <BrandLogo iconSize={28} variant="on-light" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-12 pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#e5484d]/[0.08] blur-3xl" />
          <div className="absolute bottom-[-8%] right-[5%] h-[360px] w-[360px] rounded-full bg-[#4f46e5]/[0.07] blur-3xl" />
          <div className="absolute bottom-[0%] left-[2%] h-[280px] w-[280px] rounded-full bg-[#d97706]/[0.06] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 text-[13px] font-semibold uppercase tracking-[0.24em] text-[#e5484d]"
          >
            MBI800 &middot; Strategic Information Systems
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.06 }}
            className="text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[64px]"
          >
            Security{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #e5484d, #d97706, #4f46e5)' }}
            >
              Threat Lab.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.14 }}
            className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[#6e6e73] sm:text-[19px]"
          >
            A deliberately insecure e-commerce app with 16 hidden vulnerabilities.
            Find them, exploit them, then explain how a secure design would stop each one.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
          >
            {TOPICS.map(t => (
              <span
                key={t.name}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-semibold"
                style={{ borderColor: t.color + '44', background: t.color + '10', color: t.color }}
              >
                {t.emoji} {t.name}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 flex flex-col items-center gap-1.5"
          >
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[13px] font-medium text-[#aeaeb2]"
            >
              Scroll to explore the lab
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Lab iframe */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="overflow-hidden rounded-2xl border border-black/[0.08]"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06)' }}
        >
          <iframe
            srcDoc={SWIFTSHOP_HTML}
            title="SwiftShop Security Lab"
            className="w-full border-0"
            style={{ minHeight: '860px', background: '#F6F8FA' }}
            sandbox="allow-scripts allow-same-origin"
          />
        </motion.div>
        <p className="mt-4 text-center text-[13px] text-[#aeaeb2]">
          Open DevTools (F12) to inspect the source, console, and Application storage. The code IS the vulnerability surface.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] px-6 py-12 text-center">
        <div className="mb-5 flex items-center justify-center">
          <BrandLogo iconSize={28} variant="on-light" />
        </div>
        <p className="mt-3">
          <Link to="/home" className="text-[13px] font-medium text-[#4f46e5] hover:underline">
            &lsaquo; Back to all lessons
          </Link>
        </p>
      </footer>
    </div>
  );
}
