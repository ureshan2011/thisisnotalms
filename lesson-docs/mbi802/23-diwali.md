# Happy Diwali: light three diyas — MBI802

- **Subject:** MBI802 — Database Management Systems. Listed on the MBI802 course page after
  Normalisation activities.
- **Gating:** Non-gated (public). No login, nothing stored, nothing sent anywhere.
- **Route(s):** `/diwali`, registered in both `AppRoutes` and `ShutdownRoutes` in `src/App.tsx`.
- **Source files:**
  - `src/pages/DiwaliPage.tsx` — the page: door gate, sound switch, hero, story line, activity
    section, finale, card maker, wishes wall, letter, river footer.
  - `src/components/public/diwali/Activity.tsx` — the three-step activity, the sweet shop data,
    `MiniTable` and `SweetBox`.
  - `src/components/public/diwali/Art.tsx` — SVG drawings: `Diya`, `Lantern`, `Toran`, `Rangoli`,
    `Sweet` (ladoo, barfi, jalebi), `Bow`, `Divider`.
  - `src/components/public/diwali/geometry.ts` — path strings and the rangoli layers, shared by the
    SVGs and the canvas card.
  - `src/components/public/diwali/Sky.tsx` — the fixed canvas: twinkling stars, shooting stars,
    fireworks, sparkler trail. Exposes `sky.firework(x, y)`, `sky.burst(x, y)`, `sky.show(seconds)`.
  - `src/components/public/diwali/audio.ts` — all sound, synthesised with the Web Audio API.
  - `src/components/public/diwali/card.ts` — draws the personal Diwali card on a canvas.
  - `src/components/public/diwali/greetings.ts` — the fourteen greetings and the Sanskrit line.
  - `src/styles/diwali.css` — all styles, scoped `dw-` inside `.dw`.
  - `src/content/courses.ts` — the `diwali` entry in `MBI802.lessons` (`kind: 'Practice'`).
- **Depends on:** `framer-motion`, `lucide-react`. Google Fonts loaded by the page itself: Rozha
  One, Yatra One, Kalam, Arima, Noto Serif Sinhala / Telugu / Kannada / Bengali / Gujarati /
  Gurmukhi / Oriya, Noto Nastaliq Urdu (system fonts are the fallback). No Blend, no Firebase,
  no audio files.

## 1. Purpose & learning objectives

A Diwali wish from the lecturer to the class, built to be memorable, with one very small
normalisation activity woven in. The link: before Diwali every home gets a deep clean and
everything goes back in its own place; normalisation does the same for a table. The activity
uses almost no jargon and takes about three minutes. Deliberately unlike every other page on the
site (night sky, sound, no Blend frame).

## 2. Full content

**Door (gate).** Full screen: two maroon door panels with gold borders and a dotted pattern, a
rangoli split between them, a marigold toran across the top. Centre: "शुभ दीपावली", an unlit diya
(the button), "Tap the diya to light it", "This page has music. Turn your sound on.", and a link
"Come in quietly, without sound". Tapping lights the diya (match strike, then a temple bell), the
doors slide apart, the hero's row of diyas lights one by one with a rising note each, two
fireworks go off, and the music fades in.

**Hero.** Toran, four swaying sky lanterns, a large slowly spinning rangoli behind the text that
blooms in layer by layer. Eyebrow "MBI802 · Database Management Systems · Diwali 2026". Headline
"शुभ दीपावली" (gold, shimmering) over "Happy Diwali". A greeting that changes language every 3.2 s
(tap for the next): script, language, how to say it, what it means. Lede: "To every one of my
students: may the festival of lights fill your home with warmth, your plate with sweets, and your
year with good news." Button "Light the three diyas ↓", tip "Psst: tap the sky anywhere for a
firework." Row of nine diyas (seven on phones).

**Story line.** "Before Diwali, every home gets a deep clean. Everything goes back in its own
place, ready for the lights." / "Let's do the same for a sweet shop's messy order sheet. Three
small steps. Three diyas to light."

**Activity: "The sweet shop's Diwali rush".** "Ladoo, barfi and jalebi orders are pouring in, all
on one messy sheet. Tidy it up, one diya at a time." Three unlit diyas at the top: 1NF "One thing
per box", 2NF "Everything in its own box", 3NF "No borrowed details". The data (made up):

| Order | Sweet | Boxes | Price | Customer | Phone |
|---|---|---|---|---|---|
| 101 | Ladoo, Barfi | 2, 1 | $12, $15 | Priya | 021 555 0101 |
| 102 | Jalebi | 3 | $10 | Arjun | 022 555 0202 |
| 103 | Ladoo | 1 | $12 | Priya | 021 555 0101 |

1. **Diya 1 · One thing per box.** "One box in this order sheet is holding two sweets. Tap it."
   Every cell is tappable. A wrong cell shakes: "That box holds just one thing. Look for a comma."
   Any of the three list cells in row 101 is right: the row splits into 101 Ladoo and 101 Barfi.
   Win: "Every box now holds one thing. That's 1NF."
2. **Diya 2 · Everything in its own box.** "Order + Sweet together pick out one line. But does
   every detail need both? Ask: what do I need to know this?" The four-row table with Order and
   Sweet marked as the key. Chips Customer, Price, Boxes, Phone; three sweet boxes: Orders ("the
   order no. tells you", key Order), Sweets ("the sweet tells you", key Sweet), Order lines ("you
   need both", key Order + Sweet). Tap a chip, then a box. Answers: Customer → Orders, Phone →
   Orders, Price → Sweets, Boxes → Order lines. Wrong drops shake the box and explain:
   - Customer: "Who placed order 102? The order number alone tells you: Arjun."
   - Price: "A Ladoo is $12 in every order. The sweet alone tells you the price."
   - Boxes: "How many boxes? You need both: which order, and which sweet."
   - Phone: "The phone for order 102? The order number is enough."
   Placed columns tint in the table with their box's colour. When all four are in, each box shows
   its rows. Win: "Each detail now sits where it belongs. Ladoo's price is written once. That's 2NF."
3. **Diya 3 · No borrowed details.** "Look at the Orders box. Priya's phone is still written twice.
   Who does a phone number really belong to?" Orders (Order, Customer, Phone) with Priya's two phone
   cells pulsing. Buttons "The order" / "The customer". Wrong: "An order doesn't have a phone. Priya
   does, and it's the same for all her orders." Right: Orders (Order, Customer) and Customers
   (Customer, Phone) slide in. Win: "The phone hangs off the customer, not the order, so it gets its
   own box. That's 3NF." Button "Light up the sky ✨".

Each lit diya rings a bell, plays a sparkle run and bursts gold sparks at the diya. "Start again"
resets.

**Finale** (appears after step 3; seven seconds of fireworks drawn in front of the page). "All
three diyas are lit", "बधाई हो!" / "Badhai ho! Congratulations!", "Your sweet shop is spotless."
The four final tables as sweet boxes with bows: Customers (Customer, Phone), Orders (Order,
Customer), Order lines (Order, Sweet, Boxes), Sweets (Sweet, Price). Stats: 3 → 1 places Priya's
phone is written; 2 → 1 places the Ladoo price is written. "One fact, one place. A clean home for
your data, just in time for Diwali."

**Your Diwali card.** Type a first name (max 28 characters); a 1080 × 1350 card redraws live:
toran, "शुभ दीपावली", "Happy Diwali", rangoli, "Dear {name}," (or "friend"), "Wishing you a Diwali
full of light, / sweets, laughter and good news.", "— Yasas, your MBI802 lecturer", seven diyas,
"All three diyas lit · 1NF · 2NF · 3NF · Diwali 2026". "Save my card" downloads a PNG; "Share"
appears where the browser can share files (phones). "Made on your device. Nothing is uploaded."

**Wishes wall: "Say it the way your family says it".** Fourteen cards, tap to light each one's
diya (with a note and a small burst); lighting all fourteen fires a short show.

| Language | Text | Say | Means |
|---|---|---|---|
| Hindi | शुभ दीपावली | Shubh Deepavali | Happy Deepavali |
| Tamil | தீபாவளி நல்வாழ்த்துக்கள் | Deepavali Nalvazhthukkal | Good wishes for Deepavali |
| Sinhala | සුබ දීපවාලියක් වේවා | Suba Deepavaliyak Wewa | May you have a happy Deepavali |
| Telugu | దీపావళి శుభాకాంక్షలు | Deepavali Shubhakankshalu | Deepavali greetings |
| Malayalam | ദീപാവലി ആശംസകൾ | Deepavali Aashamsakal | Deepavali wishes |
| Kannada | ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು | Deepavali Habbada Shubhashayagalu | Greetings for the festival of Deepavali |
| Bengali | শুভ দীপাবলি | Shubho Dipaboli | Happy Dipaboli |
| Gujarati | શુભ દિવાળી | Shubh Diwali | Happy Diwali |
| Marathi | दिवाळीच्या हार्दिक शुभेच्छा | Diwalichya Hardik Shubhechha | Heartfelt Diwali wishes |
| Punjabi | ਦੀਵਾਲੀ ਦੀਆਂ ਵਧਾਈਆਂ | Diwali Diyan Vadhaiyan | Diwali congratulations |
| Odia | ଶୁଭ ଦୀପାବଳି | Shubha Dipabali | Happy Dipabali |
| Nepali | शुभ तिहार | Shubha Tihar | Happy Tihar, as Diwali is called in Nepal |
| Urdu | دیوالی مبارک | Diwali Mubarak | Blessed Diwali |
| English | Happy Diwali | Happy Diwali | The festival of lights |

**Letter** (cream paper, handwriting font, a diya on top): "Dear students, / Diwali celebrates
light winning over darkness, and knowledge winning over confusion. Honestly, that's not a bad
motto for a database class either. / Thank you for the curiosity and the energy you bring to every
class. Take a proper break, eat too many sweets, call the people you love, and enjoy the fireworks
(from a safe distance!). / Wishing you and your families a joyful, safe and bright Diwali. / —
Yasas, Your MBI802 lecturer".

**River footer.** "तमसो मा ज्योतिर्गमय" · "Tamaso mā jyotir gamaya · Lead me from darkness to light",
six diyas floating on shimmering water with reflections, then "Back to MBI802 · Made with light for
my students · Yasas Sri Wickramasinghe".

## 3. UI & interaction design

Always dark: deep indigo to plum, gold, marigold, rani pink, peacock teal, violet, cream text.
Rozha One for Latin display, Yatra One for Devanagari display, Kalam for handwriting, DM Sans for
body text. Fixed pills: "← MBI802" top left, the sound switch top right (animated bars while music
plays; "Sound off" when muted). Clicking anywhere that is not a control, table or card launches a
firework at that point (click, not pointerdown, so scrolling on a phone does not). A sparkler trail
follows the pointer. Animations: flame flicker and glow, lantern sway, rangoli bloom and slow spin,
shimmering gold text, bobbing and floating diyas, shake on wrong answers, layout animation of chips
into boxes. Phones: one column, seven diyas in the hero row, two lanterns, the step-2 chip tray
sticks under the top bar while scrolling to the boxes, wide tables scroll inside their frame (the
list columns come first so the cell to find is on screen). `prefers-reduced-motion` stops CSS
animation, keeps stars still, removes the sparkler, and fires far fewer rockets.

## 4. Component & state architecture

- Page: `entered` (doors opening), `gateGone` (gate unmounted 1.7 s later), `done` (finale shown),
  `front` (sky canvas raised above the page for 9 s during the finale show). On mount the page adds
  the font `<link>` (id `dw-fonts`) and sets the body background; on unmount it restores the
  background and calls `audio.dispose()`.
- `Activity`: `step` 0–2, `lit[3]`, `run` (reset key). `StepOne` (`hint`, `shake`), `StepTwo`
  (`placed: Partial<Record<ChipId, BoxId>>`, `picked`, `why`, `shake`; chips use framer-motion
  `layoutId` so they fly into the box), `StepThree` (`wrong`). `onLight(el)` lets the page ring the
  bell and burst sparks at the diya's screen position.
- `audio.ts`: a singleton. `init()` must run inside a tap. Master → compressor → destination, a
  generated-noise convolver reverb, music and effect buses. Music: tanpura (sawtooth through a
  closing low-pass, Pa Sa Sa Sa low), santoor-like melody in Raag Bhupali from six 16-step phrases
  at 84 BPM (occasional double strikes), tabla in keherwa (Dha Ge Na Ti Na Ka Dhi Na) from bar 5,
  scheduled 0.3 s ahead on a 40 ms timer. Effects: `bell`, `chime(i)`, `sparkle`, `softNo`, `tap`,
  `ignite`, `launch(dur)`, `boom(size)`. Suspends when the tab is hidden. Measured in headless
  Chromium: effects peak about 0.27, music about 0.2 (0.48 with tabla), no clipping.
- `Sky.tsx`: rockets, particles (peony, ring, double ring, willow, palm), flashes, stars, shooting
  stars; additive blending; pixel ratio capped at 2; paused while hidden.
- `card.ts`: draws on a canvas with the 2D API (Path2D from the shared path strings) after
  `document.fonts.load` for the three faces; `toBlob` for download or `navigator.share`.

## 5. Rebuild notes

- The site's global `index.css` colours every h1–h3 navy and Tailwind's preflight makes every svg
  a block; `diwali.css` overrides both inside `.dw` (headings cream, `.lucide` icons inline).
- Rangoli layers use `transform-box: view-box; transform-origin: 0 0` so spin and bloom happen
  around the centre (the viewBox is centred on 0,0). Each layer is two nested groups so the bloom
  and the spin do not fight over `transform`.
- Names, phone numbers and prices are made up.
