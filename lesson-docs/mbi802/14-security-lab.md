# SwiftShop Security Lab — MBI802

- **Subject:** MBI802 — Database Management Systems
- **Gating:** Non-gated (public)
- **Route(s):** `/security-lab` (a React Router route that immediately redirects; the real content lives at the static path the redirect targets, effectively `/security-lab.html`)
- **Source files:**
  - `src/pages/SecurityLabPage.tsx` (~8 lines — NOT a lesson, a redirect stub)
  - `public/security-lab.html` (~695 lines — the actual lesson: a standalone static HTML/CSS/JS page)
- **Depends on:** Nothing external at runtime — no Firestore, no shared React components, no npm libraries. It is a hand-rolled, dependency-free HTML/CSS/vanilla-JS single-page app that uses the browser's `localStorage` as its entire "database" and UI-state store. It is served as a static file straight out of `public/`, bypassing the React app entirely once the redirect fires.

**IMPORTANT — this is not a React lesson.** `/security-lab` is a client-side-redirect-only stub inside the SPA; the actual teaching artifact is a self-contained static HTML document with inline `<style>` and `<script>` blocks, unrelated to the React/Vite/Firebase app architecture used everywhere else in this repo.

### Exact redirect mechanism (`SecurityLabPage.tsx`, full file)

```tsx
import { useEffect } from 'react';

export default function SecurityLabPage() {
  useEffect(() => {
    window.location.href = import.meta.env.BASE_URL + 'security-lab.html';
  }, []);
  return null;
}
```

The component renders `null` (no visible UI of its own) and, on mount, performs a **hard browser navigation** (`window.location.href = ...`, not a React Router navigation) to `import.meta.env.BASE_URL + 'security-lab.html'`. `import.meta.env.BASE_URL` is Vite's configured base path for the app (typically `/` in this project unless overridden at build time), so in the common case this resolves to `/security-lab.html` — the static file served from `public/security-lab.html`. Because this is a full page navigation (not client-side routing), the browser leaves the React SPA entirely and loads the static HTML document fresh.

## 1. Purpose & learning objectives

The page's own on-page framing (from the sticky top banner and the "Mission Control" sidebar) states the intent directly:

> "TRAINING ENVIRONMENT — SwiftShop Security Lab — deliberately insecure — all data is fake — do not enter real credentials"

> "SwiftShop was built fast and shipped with security as an afterthought. Twenty classes of weakness are hiding in this app. Find them, exploit them, then explain how a security-first design would stop each one."

This is a hands-on, "break the app" style lab: a fake e-commerce storefront ("SwiftShop") deliberately riddled with realistic web-application security flaws for students to discover and exploit using only their browser (DevTools console, page source, `localStorage`, URL parameters — no external tools required). Despite the naming used in the parent task ("SQL injection attack lab") and despite this file living in an MBI802 (database) course, **the lab as actually implemented contains no SQL and no server/database layer at all** — "the database" is entirely simulated client-side via `localStorage` (see the `DB` object, Section 4). The vulnerability classes taught are broader general web-appsec issues: XSS (stored & reflected), broken authentication, privilege escalation, mass assignment, IDOR, insecure deserialization, information disclosure, business-logic abuse (race conditions, referral/coupon abuse), and outright client-side sabotage — not classic SQL injection. This should be flagged to an instructor/rebuilder as a naming mismatch against the course's SQL-focused framing (see Rebuild notes).

Learning objectives (inferred from the 20 catalogued "targets"):
- Learn to use browser DevTools (View Source, Console, Application/Storage, Network) as a security-inspection toolkit.
- Recognize that any logic, secret, or check that lives only in client-side code/storage is trivially bypassable.
- Practice identifying and exploiting: exposed secrets in HTML comments and JS source; insecure "password recovery" that leaks the real password; client-trusted price/quantity fields; hidden/obscured UI elements; stored and reflected XSS; weak/rate-limitless authentication; role/privilege tampering via storage; mass-assignment via an over-permissive profile form; hardcoded API keys/credentials; direct localStorage tampering; insecure deserialization of an imported cart blob; IDOR via sequential order IDs; verbose console/error information disclosure; unlimited loyalty-bonus and self-referral abuse; race conditions from an unguarded bonus-claim action; live tampering with global variables/functions from the console; and an unguarded "nuke everything" function.
- For each, be able to explain the secure-design fix (e.g., server-side authorization, rate limiting, parameterised/validated inputs, escaping output, not trusting client-supplied prices/roles, idempotent/locked business operations).

## 2. Full content

### Page framing / chrome

- **Top banner** (dark, pulsing red dot): "TRAINING ENVIRONMENT — **SwiftShop Security Lab** — deliberately insecure — all data is fake — do not enter real credentials"
- **Header**: logo "S SwiftShop"; a search box (placeholder "Search products...", present but not wired to any handler); nav buttons **Shop / Cart / Orders / Account** (plus a hidden **Admin** button that appears only once an admin session exists); wallet balance display; a user-menu chip showing the current username/avatar (click = sign out if logged in, else jump to Account/login).
- **Footer**: "© 2026 SwiftShop. All rights reserved." plus About/Contact/Returns links (non-functional `#` anchors) and one deliberately near-invisible link: **"Staff portal — quick admin login (coupon: STAFF100)"**, styled white-on-white (`color:#FFFFFF;background:#FFFFFF`) so it is invisible until the user selects all page text (Ctrl+A). Clicking it calls `loginAsStaff()`, which silently signs the visitor in as `admin` with no credential check at all.
- A large **HTML comment** sits directly in the page source (right after the banner), containing plaintext secrets a student can find via View Source / Ctrl+U:
  ```
  EASY WIN #17 (Secrets left in the page source):
  A developer left these notes in an HTML comment...
  TODO before launch — REMOVE THIS COMMENT!
    Admin login ........ username: admin   password: SwiftAdmin#2026
    Staff coupon ....... STAFF100  (gives 100% off everything)
    Free-money coupon .. VIP99     (99% off)
    Backup admin ....... username: backup_admin  password: ChangeMe123!
  ```
  (Note: "backup_admin" is referenced only in this comment — there is no such account in `SEED_USERS` or `ADMIN_CREDENTIALS`, so this credential is a red herring / unimplemented in the current script.)

### "Mission Control" sidebar — the full catalogue of 20 vulnerability targets

The sidebar groups all 20 targets under six labeled categories, each with an icon, a numbered title, and a one-line hint:

**⭐ Start here (easy wins)**
17. **Secrets in page source** — "Right-click → View Page Source (Ctrl+U), search 'password'."
18. **Password "recovery"** — "Account → Forgot password? shows the real password on screen."
19. **Editable price tag** — "Click a product's price, change it, then add to cart."
20. **Hidden staff link** — "Press Ctrl+A to reveal the white-on-white admin link in the footer."

**Input & Injection**
1. **Input Manipulation** — "Feed the system values it should never accept (negative qty, decimals)."
2. **Stored XSS** — "Inject HTML/JS via reviews that runs for every visitor."
3. **Reflected XSS** — "Craft a URL with a ?promo= param that renders unsanitised HTML."

**Auth & Access**
4. **Broken Authentication** — "No rate limit, no lockout, plaintext passwords in the source."
5. **Privilege Escalation** — "Edit your session role in storage to reach the admin panel."
6. **Mass Assignment** — "The profile update takes every field — including role and balance."

**Data & Storage**
7. **Data Theft** — "Hardcoded API keys, credentials, and card numbers in the source."
8. **Direct Storage Tampering** — "Edit localStorage directly — change prices, balances, roles."
9. **Insecure Deserialization** — "Import a cart from base64 JSON — the app trusts whatever you send."
10. **IDOR** — "Order IDs are sequential — view any order by changing the number."
11. **Information Disclosure** — "Console.log leaks secrets; verbose errors expose internals."

**Business Logic**
12. **Resource Misappropriation** — "Unlimited loyalty bonus, staff coupon in the code."
13. **Self-Referral Abuse** — "Refer yourself or reuse the same referral code endlessly."
14. **Race Condition** — "Rapid-fire the bonus button — no mutex means multiple credits."

**Sabotage & Tampering**
15. **Program Alteration** — "Change GLOBAL_DISCOUNT or cart functions from the console."
16. **Sabotage** — "nukeStore() wipes everything — no auth, no confirmation needed."

Sidebar footer tip: "💡 Tip: Open DevTools (F12) → Console / Application / Sources. The source code IS the vulnerability surface."

### Shop view (default view)

- Panel "Catalogue" — "Today at SwiftShop" / "Browse our curated selection. Add items to your cart, then head to checkout." If a `?promo=` URL query param is present, its **raw, unescaped** value is injected directly into a banner div above the catalogue (`🎉 <promo value>`) — this is the reflected-XSS vector (target #3).
- Six seed products, each rendered as a card with emoji, name, description, a star rating + review count, an **editable price** (`contenteditable="true"`, title tooltip: "EASY WIN #19: click and edit this price before adding to cart"), a stock count (turns red/"low" styling under 10 units), a quantity input, and an "Add to cart" button:

  | id | name | emoji | description | price | stock | rating | reviews |
  |---|---|---|---|---|---|---|---|
  | 1 | Wireless Earbuds Pro | 🎧 | Active noise-cancelling, 36h battery, IPX5 waterproof. | $89.00 | 12 | 4.7 | 234 |
  | 2 | Mechanical Keyboard | ⌨️ | Hot-swappable Cherry MX switches, per-key RGB. | $119.00 | 7 | 4.9 | 89 |
  | 3 | Smart Desk Lamp | 💡 | Warm/cool dimmable LED, auto-brightness sensor. | $34.50 | 25 | 4.3 | 156 |
  | 4 | USB-C Hub 7-in-1 | 🔌 | 4K HDMI, 100W PD, SD card, 3× USB-A. | $45.00 | 18 | 4.5 | 312 |
  | 5 | Webcam 4K Ultra | 📷 | Auto-focus, built-in ring light, noise-cancelling mic. | $79.00 | 9 | 4.6 | 67 |
  | 6 | Portable SSD 1TB | 💾 | USB 3.2 Gen 2, 1050 MB/s read, shock-resistant. | $99.00 | 14 | 4.8 | 445 |

- Panel "Community" — "Product reviews" / "See what other shoppers think — and leave your own." Lists all reviews (seeded + posted), each rendered with the raw review text dropped straight into the DOM via `innerHTML` (no escaping) — this is the stored-XSS vector (target #2). Seed reviews:
  - amir.k, ★5: "Earbuds are great, fast delivery."
  - priya.n, ★4: "Keyboard feels premium for the price."
  - student, ★5: "USB-C hub works perfectly with my MacBook."
  A free-text "Write a review…" textarea + "Post review" button lets anyone (including guests, attributed as `"guest"`) add a review, again rendered unescaped.

### Cart view

- **Loyalty bonus banner**: 🪙 "Loyalty bonus: Claim $10 store credit as a thank-you for shopping with us!" + "Claim $10" button — calls `claimBonus()`, which adds $10 to the logged-in user's balance with **no cap, no cooldown, no idempotency check** (targets #12 resource misappropriation and #14 race condition — rapid clicking credits repeatedly).
- **Referral banner**: 🎁 "Refer a friend: Enter a referral code to earn $15 credit." + input/"Apply" button — calls `applyReferral()`, which credits **both** the referrer and the current user $15 with no check against self-referral or repeat use (target #13). Valid seed referral codes: `STU-2026` (student), `AMR-2026` (amir.k), `PRI-2026` (priya.n).
- **Checkout panel**: lists cart line items (name, qty, line total, "Remove" button) or an empty-cart message "🛒 Your cart is empty. Start shopping!"; a coupon code input + "Apply" button; a running total (showing the active discount percentage if any); a "Pay with wallet" button that calls `checkout()`.
  - Valid coupon codes and their discounts: `SAVE20` → 20% off ("20% coupon applied"), `WELCOME10` → 10% off ("10% welcome discount applied"), `STAFF100` → 100% off ("Staff coupon applied — 100% off!"), `EMPLOYEE50` → 50% off ("50% employee discount applied"), `VIP99` → 99% off ("99% VIP discount applied!"). Any other code: "Invalid coupon. Try: SAVE20, WELCOME10, STAFF100, EMPLOYEE50, VIP99" (the error message itself leaks all valid codes).
- **Import/Export Cart panel**: "Save or restore your cart using encoded data." — "Export cart" button base64-encodes the current cart + discount + session into a textarea; a second input/"Import" button decodes and **trusts without validation** whatever base64 JSON blob is pasted in, including overwriting the current session (target #9, insecure deserialization — e.g. a student can craft a payload with `"session":{"username":"admin","role":"admin"}` and import their way into an admin session).

### Orders view

- Requires login ("Sign in to view your orders."). Shows an "Order History" panel with an **order-ID lookup box** ("Enter order ID (e.g. 1001, 1002, 1003...)" + "Look up" button) that returns **any** order regardless of who owns it — no ownership check (target #10, IDOR). A failed lookup's error message intentionally leaks all valid order IDs: "Order not found. Valid order IDs: 1001, 1002, 1003. Error ref: IDOR_LOOKUP_<id>". Below the lookup, all orders are also listed outright.
  Seed orders:
  | id | user | items | total | address | card (masked) |
  |---|---|---|---|---|---|
  | 1001 | amir.k | Wireless Earbuds Pro ×1, USB-C Hub 7-in-1 ×2 | $179.00 | 42 Oak Lane, Springfield | **** 7781 |
  | 1002 | priya.n | Mechanical Keyboard ×1 | $119.00 | 15 Elm Street, Portland | **** 9912 |
  | 1003 | student | Smart Desk Lamp ×2, Webcam 4K Ultra ×1 | $148.00 | 88 Pine Ave, Denver | **** 0042 |

### Account view

- Requires login. Shows wallet balance, role badge, and last-4 of saved card as stat tiles, then an editable **"Update profile"** form with fields Username, Email, Card number, and — critically — **Role** and **Balance**, both labeled "(display only)" but in fact fully writable and saved verbatim by `updateProfile()` with no server-side (or any) authorization check (target #6, mass assignment — a student can type `admin` into the Role field and save their way into admin access, or set an arbitrary Balance).

### Admin view

- Gated only by `session.role === "admin"` (trivially reachable via the staff-portal link, storage tampering, or mass-assignment escalation above — there is no real access control). Shows:
  - A **Customers** table listing every user's username, email, role, balance, saved card number, and **plaintext password** in the clear (target #7/#8 data theft).
  - A **System Configuration** table exposing hardcoded "secrets" in red: `STRIPE_SECRET_KEY`, `DATABASE_URL`, `JWT_SECRET`, `AWS_ACCESS_KEY` (see literal values in Section 4).
  - An **Orders** table (all orders, full address + card).
  - Two admin action buttons: "Reset all data" (`nukeStore()` — wipes all `localStorage` with zero confirmation or auth check, target #16) and "Dump users to console" (`console.table(DB.users())`).

### Login / "Forgot password" flow

- A centered login card: Username + Password fields, an inline error box, "Sign in" button, and a "Forgot password?" link. Demo hint printed on the card: "Demo — username `student`, password `student123`".
- `doLogin()` calls `login(username, password)`, which: matches against the hardcoded `ADMIN_CREDENTIALS` first, then against `SEED_USERS`; on any failed attempt where the username exists, it returns a hint error exposing the **first 3 characters of the real password**, e.g. `Incorrect password for "student". Hint: password starts with "stu..."`; on a fully unknown username it lists all valid usernames: `User "xyz" does not exist in the database. Try: student, amir.k, priya.n, or admin.` There is no rate limiting or lockout across attempts (target #4).
- **"Forgot password?"** (`forgotPassword()`) — target #18, an "easy win": given any typed username, if it exists, the page displays the real plaintext password directly on screen: `Your password is: <password>`. If it doesn't exist: `No account named "<name>". Try: student, amir.k, priya.n`.

## 3. UI & interaction design

The visual design deliberately mimics a plausible, professional-looking e-commerce SPA (not an obviously "hacky" teaching page) so that the vulnerabilities feel discovered rather than telegraphed by ugly styling:

- **Palette**: near-black ink (`#161B22`) on light paper (`#F6F8FA`)/white surfaces, a blue accent (`#2563EB`), amber for warnings/loyalty (`#D97706`/`#FEF3C7`), red for "breach"/danger states (`#DC2626`/`#FEE2E2`), green for success/ok (`#059669`/`#D1FAE5`). Typography: Inter / system sans-serif stack, 14px base.
- **Layout**: sticky header with logo, search bar, view-switching nav (Shop/Cart/Orders/Account/[Admin]), wallet balance chip, and a user-menu chip. Main content area is a two-column CSS grid (`1fr 300px`) — the active view on the left, a persistent sticky "Mission Control" sidebar (dark `--blue-deep` background) on the right — collapsing to a single column under 920px. Product grid within Shop is itself a 2-column responsive grid (`repeat(2,1fr)`, collapsing to 1 column under 560px).
- **Feedback**: a bottom-centered toast notification (`#toast`) slides/fades in for ~2.8s on most actions, color-coded neutral/red("bad")/green("good") for failures vs successes (e.g. coupon applied, item added, login failed).
- **Distinct "training" chrome**: the persistent dark top banner with a pulsing red dot signals this is a lab, not a real store, and the sidebar mission list is the primary pedagogical UI — it's presented as a checklist/scoreboard of things to go find, not hidden from the student.
- **Deliberately discoverable "tells"**: contenteditable price text with a tooltip pointing at the vulnerability; a large developer-note HTML comment; a coupon-error message that leaks valid codes; an order-not-found message that leaks valid IDs; white-on-white hidden link revealed by Select All. These are intentional pedagogical breadcrumbs, not just bugs.
- No animation/transition library — simple CSS `transition` on hover states (buttons, product cards lifting slightly with `box-shadow` on hover) and a CSS `@keyframes pulse` on the banner's status dot.
- No responsive images/video; everything is emoji + CSS.

## 4. Component & state architecture

There is no React component tree — this is a hand-written vanilla-JS single-page app using string-concatenated HTML injected via `innerHTML`. Its structure:

- **Simulated "database"**: a `DB` object wrapping the browser's `localStorage` (keys: `swift_users`, `swift_products`, `swift_reviews`, `swift_orders`, `swift_session`). `DB.init()` seeds all four collections on first load if not already present, from the module-level constants `SEED_PRODUCTS` (6 products), `SEED_USERS` (3 users), plus inline-seeded reviews (3) and orders (3) — see Section 2 tables for exact values. `DB.session()`/`setSession()`/`clearSession()` manage the logged-in identity, stored plaintext in `localStorage` under `swift_session` as `{username, role}` — directly editable by any user via DevTools → Application → Local Storage (target #8).
- **Global mutable state**: `cart` (array, in-memory only, not persisted — lost on reload), `currentView` (string: `"shop" | "cart" | "orders" | "account" | "admin"`), `GLOBAL_DISCOUNT` (number 0–1, the active coupon discount, also editable live from the console — target #15), `loginAttempts` (counter, never enforced against anything).
- **Hardcoded "secrets" baked into the client bundle** (all fake but styled as real-looking values for the lesson):
  ```js
  ADMIN_CREDENTIALS = { username: "admin", password: "SwiftAdmin#2026", role: "admin" }
  PAYMENT_API_SECRET = "sk_live_51Hx0FAKEkeyForClassDoNotUse_9920xZ"
  INTERNAL_API_ENDPOINT = "https://api.swiftshop-internal.fake/v2/payments"
  JWT_SIGNING_KEY = "super-secret-jwt-key-do-not-share-2026"
  AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE"
  DB_CONNECTION = "postgres://admin:s3cretP@ss@db.swiftshop.fake/prod"
  STAFF_COUPON = "STAFF100"
  REFERRAL_BONUS = 15
  ```
  On every page load, several of these (plus admin credentials and a fake internal server/endpoint list) are also dumped to `console.log` under an explicit `[SwiftShop DEBUG]` prefix (target #11, information disclosure) — e.g. `"[SwiftShop DEBUG] Payment API Secret:", PAYMENT_API_SECRET`.
- **Rendering model**: a single `render()` function switches on `currentView` and calls one of `shopView()`, `cartView()`, `ordersView()`, `accountView()`, `adminView()` (or `loginPrompt(msg)` when not authenticated for a gated view) — each returns an HTML string that is assigned wholesale to `#main`'s `innerHTML`. `updateChrome()` syncs the header (username, avatar initial, wallet balance, cart count badge, admin-nav visibility) after every render. Nav clicks are handled by one delegated `click` listener on `#nav` that reads `data-view` off the clicked button and re-renders.
- **Key functions** (each corresponds to a numbered vulnerability target described in Section 2): `login()`, `logout()`, `forgotPassword()`, `loginAsStaff()`, `addToCart()` (trusts the on-page editable price text over the seed price), `removeLine()`, `applyCoupon()`, `claimBonus()`, `applyReferral()`, `checkout()` (decrements the user's stored balance and appends a new sequential-ID order), `lookupOrder()`, `postReview()` (unescaped `innerHTML`), `updateProfile()` (mass assignment — writes every form field including `role`/`balance` straight back to the stored user record), `exportCart()`/`importCart()` (base64 JSON round-trip with zero validation on import), `getPromoFromURL()` (reads `?promo=` from `window.location.search`, or from a `#...?promo=` hash fallback, unescaped into the shop banner), and `nukeStore()` (`localStorage.clear(); location.reload();`, bound to the admin "Reset all data" button with no confirmation dialog or auth re-check beyond already being in the admin view).
- **No build step, no framework, no module system** — everything is defined as global `var`/`function` declarations in one inline `<script>` block, runs immediately on `DB.init(); render();` at the bottom of the script.

## 5. Rebuild notes

- **Scope/naming mismatch to flag for an instructor**: this lab is filed under MBI802 (a database course) and is commonly referred to informally as a "SQL injection lab," but the actual implementation contains no SQL, no server, and no database in the traditional sense — it is a client-only, `localStorage`-backed general web-appsec lab covering 20 vulnerability classes (XSS, IDOR, mass assignment, insecure deserialization, broken auth, business-logic abuse, race conditions, and outright sabotage), none of which are SQL injection. If a rebuild is meant to specifically teach SQL injection (matching the course subject), this file's scope may need to be reconsidered or a genuinely separate SQL-injection-specific lab built — this is a notable ambiguity between the task framing and the actual source.
- The redirect page (`SecurityLabPage.tsx`) intentionally performs a hard `window.location.href` navigation rather than a client-side route render, specifically so the static file (with its own independent `<html>`/`<head>`/inline styles/scripts) can be served outside the React app's bundling/routing — a rebuilder should preserve this pattern rather than trying to port the HTML into a React component, since the lab depends on being a "flat," inspectable static artifact (part of its pedagogy is literally "View Source").
- All "secrets," API keys, card numbers, and passwords in the file are explicitly fake, marked as such multiple times (banner, comments, key names like `..._fake`), and should stay fake in any rebuild — do not swap in real-looking production-style secrets beyond what's already templated.
- The "backup_admin / ChangeMe123!" credential mentioned in the page-source HTML comment (target #17) does not actually exist in `SEED_USERS` or `ADMIN_CREDENTIALS` — it's a documented discrepancy in the current source (a dead/unimplemented Easter egg or leftover from an earlier draft), not something this doc invented.
- No images/video assets; all visuals are CSS + emoji, self-contained in the single file — nothing else needs to ship alongside `security-lab.html`.
- The lab has no server-side component and no Firestore integration at all — all "progress" (users/products/reviews/orders/session) lives in the browser's `localStorage` and is trivially resettable (by the student, intentionally, or via the admin "Reset all data" button) — there is no cross-device or cross-session persistence, and nothing here is graded/tracked by the platform.
