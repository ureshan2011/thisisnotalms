// ─── MBI806B · Dashboard design studio: the content ───────────────────────
// One source for the /dashboard-design-studio page and for the printable PDF
// (scripts/dashboard-studio-pdf). Both read this file, so a scenario can never
// say one thing on screen and another on paper.
//
// Every organisation below is fictional. The numbers are invented, but they
// are internally consistent: totals add up across tables, and rates are
// computed from the counts printed beside them rather than typed in, so a
// team that builds a chart from two tables gets the same answer both ways.
//
// The scenarios deliberately differ in four things a designer has to decide
// first: who is reading, on what device, how often, and what they must do
// afterwards. The data is small enough to type into a chart in a minute.

export const PDF_DIR = 'mbi806b/dashboard-studio';
export const PDF_FILE = 'MBI806B-Dashboard-Design-Studio.pdf';

// ── Number helpers ────────────────────────────────────────────────────────

const NZ = new Intl.NumberFormat('en-NZ');
export const num = (n: number): string => NZ.format(n);
export const money = (n: number): string => `$${NZ.format(n)}`;
export const pct = (part: number, whole: number, dp = 1): string => `${((part / whole) * 100).toFixed(dp)}%`;
const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);

// ── Types ─────────────────────────────────────────────────────────────────

export interface DataTable {
  title: string;
  /** One line on what the table is, or a warning about it. */
  note?: string;
  head: string[];
  rows: string[][];
}

export interface Scenario {
  n: number;
  /** Short tab label. */
  tab: string;
  client: string;
  /** Sector and place, one line. */
  about: string;
  /** The brief's headline: what is being designed. */
  title: string;
  /** Who reads it, on what, how often. */
  reader: { who: string; screen: string; cadence: string };
  /** The same three facts in a few words each, for the comparison table. */
  glance: [reader: string, screen: string, cadence: string];
  /** The situation, in two or three short paragraphs. */
  story: string[];
  /** The one decision the dashboard exists to support. */
  decision: string;
  /** What the reader must be able to answer within five seconds. */
  questions: string[];
  data: DataTable[];
  /** What the dashboard they have today gets wrong. A critique prompt. */
  today: string[];
  /** Hard limits on the design. */
  constraints: string[];
  stretch: string;
}

// ═══ Scenario 1 · Kōtuku Café Group ═══════════════════════════════════════

const cafes: [string, number, number, number][] = [
  // name, quarter revenue, quarter target, customers
  ['Ponsonby', 412000, 400000, 61200],
  ['Newmarket', 368500, 390000, 58900],
  ['Takapuna', 301200, 300000, 40100],
  ['Mt Eden', 254800, 280000, 38300],
  ['Botany', 223400, 250000, 36700],
  ['Henderson', 168900, 210000, 29800],
];
const cafeTotal = sum(cafes.map(c => c[1]));

const cafeWeeks = [128000, 130500, 127900, 133200, 135600, 132800, 136900, 139400, 137100, 141300, 129500, 124600];
// Week 13 is whatever makes the weeks add up to the quarter's revenue.
cafeWeeks.push(cafeTotal - sum(cafeWeeks));

const cafeDays: [string, number][] = [
  ['Monday', 13600], ['Tuesday', 14400], ['Wednesday', 15100], ['Thursday', 16500],
  ['Friday', 20300], ['Saturday', 28200], ['Sunday', 24900],
];

const S1: Scenario = {
  n: 1,
  tab: 'Kōtuku Café',
  client: 'Kōtuku Café Group',
  about: 'Six cafés across Auckland · hospitality',
  title: 'The Monday-morning sales review',
  reader: {
    who: 'Hana Rātana, the group’s regional manager',
    screen: 'A tablet, held in her hand in the weekly meeting with café managers',
    cadence: 'Every Monday, for ten minutes',
  },
  glance: ['Regional manager', 'Tablet, in a meeting', 'Weekly'],
  story: [
    'Kōtuku runs six cafés. Every Monday Hana meets the six café managers to review last week and decide where to move people and stock. Today she gets a spreadsheet with 40 columns, printed on three sheets of paper.',
    'She wants one screen she can hold up in the meeting. The managers should be able to see in seconds which café is ahead of target, which is behind, and whether the group as a whole is heading in the right direction.',
  ],
  decision: 'Which cafés need extra staff or stock this week, and which are on track?',
  questions: [
    'How is each café doing against its quarterly target?',
    'Is group revenue going up or down over the quarter, and when did it change?',
    'Which days of the week are busiest, so rosters can match demand?',
    'Which café has the weakest average spend per customer?',
  ],
  data: [
    {
      title: 'Table A · This quarter, by café',
      note: 'Average spend per customer is revenue divided by customers.',
      head: ['Café', 'Revenue', 'Target', 'Customers', 'Avg spend'],
      rows: cafes.map(([name, rev, target, cust]) => [name, money(rev), money(target), num(cust), `$${(rev / cust).toFixed(2)}`]),
    },
    {
      title: 'Table B · Group revenue by week (13-week quarter)',
      note: 'Weeks 11 and 12 were school holidays.',
      head: ['Week', 'Revenue', 'Week', 'Revenue'],
      rows: Array.from({ length: 7 }, (_, i) => [
        `Week ${i + 1}`, money(cafeWeeks[i]),
        i + 7 < 13 ? `Week ${i + 8}` : '', i + 7 < 13 ? money(cafeWeeks[i + 7]) : '',
      ]),
    },
    {
      title: 'Table C · Average group revenue per day of the week',
      note: 'Rounded to the nearest $100.',
      head: ['Day', 'Revenue', 'Day', 'Revenue'],
      rows: [
        [cafeDays[0][0], money(cafeDays[0][1]), cafeDays[4][0], money(cafeDays[4][1])],
        [cafeDays[1][0], money(cafeDays[1][1]), cafeDays[5][0], money(cafeDays[5][1])],
        [cafeDays[2][0], money(cafeDays[2][1]), cafeDays[6][0], money(cafeDays[6][1])],
        [cafeDays[3][0], money(cafeDays[3][1]), '', ''],
      ],
    },
  ],
  today: [
    'A 3D pie chart splits group revenue between the six cafés. The slices are nearly the same size and cannot be compared.',
    'Every café is shown in a different bright colour, so colour carries no meaning.',
    'Red and green traffic lights show “behind” and “ahead”, which a colour-blind manager cannot tell apart.',
    'The headline number is $1,728,800 with no target, no last-quarter figure and no arrow, so nobody knows whether it is good.',
  ],
  constraints: [
    'Landscape tablet, about 1024 × 768. Nothing smaller than a readable size.',
    'No more than six visuals. Hana has ten minutes.',
    'Must work for a colour-blind reader: never use colour as the only signal.',
  ],
  stretch:
    'The managers keep asking “is this a bad week or a bad café?” Add one element that separates a café problem from a group-wide dip, without adding a seventh chart.',
};

// ═══ Scenario 2 · Harbourview Medical Centre ══════════════════════════════

// Booked and did-not-attend counts per day and time of day, six months.
const slots = ['Early (8–10)', 'Midday (10–2)', 'Afternoon (2–5)'] as const;
const clinicDays: [string, [number, number][]][] = [
  ['Monday', [[310, 22], [520, 38], [410, 41]]],
  ['Tuesday', [[290, 20], [540, 35], [430, 37]]],
  ['Wednesday', [[280, 17], [500, 31], [390, 39]]],
  ['Thursday', [[300, 21], [530, 37], [420, 40]]],
  ['Friday', [[260, 19], [450, 33], [150, 26]]],
];
const clinicMonths: [string, number, number][] = [
  ['April', 940, 70], ['May', 960, 74], ['June', 1010, 85],
  ['July', 1020, 90], ['August', 950, 75], ['September', 900, 62],
];
const clinicTypes: [string, number, number][] = [
  ['Routine check', 2310, 139], ['Prescription review', 1090, 49], ['Child immunisation', 760, 29],
  ['Mental health and wellbeing', 640, 80], ['Allied health referral', 980, 159],
];
const clinicReminder: [string, number, number][] = [
  ['Text reminder sent', 3900, 218], ['No reminder (no mobile on file)', 1880, 238],
];
const clinicBooked = sum(clinicMonths.map(m => m[1]));
const clinicDna = sum(clinicMonths.map(m => m[2]));

const S2: Scenario = {
  n: 2,
  tab: 'Harbourview Medical',
  client: 'Harbourview Medical Centre',
  about: 'A GP practice with eight clinicians · health',
  title: 'The missed-appointments dashboard',
  reader: {
    who: 'Maria Fonoti, the practice manager',
    screen: 'A desktop monitor in her office, shared with the clinical lead on screen',
    cadence: 'The first working day of each month, for a 30-minute review',
  },
  glance: ['Practice manager', 'Desktop, shared on screen', 'Monthly'],
  story: [
    `When a patient does not turn up, the practice calls it a DNA (did not attend). Over the last six months Harbourview had ${num(clinicBooked)} bookings and ${num(clinicDna)} DNAs. Each one wastes a clinician’s time and delays someone else who needed the slot.`,
    'The practice is deciding where to spend a small budget: text reminders, a different booking system, or overbooking the worst slots. Maria needs a dashboard that shows where and when DNAs happen, in a way the clinical lead trusts.',
  ],
  decision: 'Where is the DNA problem biggest, and which fix should the practice spend its budget on?',
  questions: [
    'What is the overall DNA rate, and is it getting better or worse month to month?',
    'Which days and times have the highest DNA rate?',
    'Which appointment types are missed most often?',
    'Do text reminders make a difference?',
  ],
  data: [
    {
      title: 'Table A · By month',
      head: ['Month', 'Booked', 'DNAs'],
      rows: clinicMonths.map(([m, b, d]) => [m, num(b), num(d)]),
    },
    {
      title: 'Table B · By day and time of day (April to September)',
      note: 'Each cell is DNAs / booked. Friday afternoon is a short session because the practice closes at 3pm.',
      head: ['Day', ...slots],
      rows: clinicDays.map(([d, cells]) => [d, ...cells.map(([b, n]) => `${n} / ${b}`)]),
    },
    {
      title: 'Table C · By appointment type',
      head: ['Type', 'Booked', 'DNAs'],
      rows: clinicTypes.map(([t, b, d]) => [t, num(b), num(d)]),
    },
    {
      title: 'Table D · Reminders',
      head: ['Group', 'Booked', 'DNAs'],
      rows: clinicReminder.map(([t, b, d]) => [t, num(b), num(d)]),
    },
  ],
  today: [
    'A table lists each repeat no-show by patient name and NHI number. Anyone looking at the shared screen can read it.',
    'The chart shows raw DNA counts, so the busiest months and slots always look worst, even when their rate is no higher.',
    'Fourteen months of data sit on one line chart with a y-axis that starts at 40, which makes small changes look dramatic.',
    'Friday afternoon looks like the worst slot, but it is based on a handful of bookings. Nothing on the screen says so.',
  ],
  constraints: [
    'Desktop monitor, 1920 × 1080, shared with other people in the room.',
    'No patient names, IDs or anything that could identify a person. Show groups only.',
    'Rates and counts must both be available. A rate without its size can mislead.',
  ],
  stretch:
    'The clinical lead asks whether the afternoon difference is real or just chance. Show uncertainty or sample size so a small base is not read as a finding.',
};

// ═══ Scenario 3 · Tāmaki Courier Co. ══════════════════════════════════════

const depots: [string, number, number, number, number, number, number][] = [
  // depot, parcels today, delivered, delivered on time, failed attempts, vans out, vans > 30 min behind
  ['East Tāmaki', 2400, 1680, 1596, 38, 22, 2],
  ['Auckland Central', 1850, 1420, 1292, 41, 18, 4],
  ['Albany', 1300, 910, 882, 14, 12, 0],
  ['Manukau', 1150, 700, 560, 36, 11, 5],
  ['Henderson', 900, 640, 621, 9, 8, 1],
];
const dParcels = sum(depots.map(d => d[1]));
const dDelivered = sum(depots.map(d => d[2]));
const dOnTime = sum(depots.map(d => d[3]));
const dFailed = sum(depots.map(d => d[4]));
const hourly: [string, number][] = [
  ['8–9am', 430], ['9–10am', 850], ['10–11am', 1010], ['11am–12pm', 1090], ['12–1pm', 1060], ['1–2pm', 910],
];
// Twelve earlier days, then today, which is whatever Table A works out to.
const onTimeTrend = [94.1, 95.3, 95.8, 96.0, 94.7, 93.2, 95.5, 96.1, 95.4, 94.9, 95.7, 96.2];
onTimeTrend.push(Number(((dOnTime / dDelivered) * 100).toFixed(1)));
const trendDay = (k: number): string => (k === onTimeTrend.length - 1 ? 'Today' : `Day ${k + 1}`);
const failReasons: [string, number][] = [
  ['Nobody home', 61], ['Address problem', 34], ['Access or gate problem', 22], ['Customer refused', 12], ['Damaged or other', 9],
];

const S3: Scenario = {
  n: 3,
  tab: 'Tāmaki Courier',
  client: 'Tāmaki Courier Co.',
  about: 'Same-day parcel delivery, five depots · logistics',
  title: 'The control-room wall screen',
  reader: {
    who: 'The duty controller and two dispatchers, in the control room',
    screen: 'A 55-inch TV on the wall, read from three to five metres away',
    cadence: 'All day. Glanced at many times an hour, refreshed every few minutes',
  },
  glance: ['Duty controllers', 'Wall TV, read from a distance', 'All day, glanced at'],
  story: [
    `It is 2pm. Tāmaki Courier has ${num(dParcels)} parcels to deliver today across five depots and ${num(dDelivered)} are delivered. The company promises 95% of parcels on time.`,
    'The controllers do not read this screen, they glance at it. They need to know in two seconds whether anything needs action right now, and if so where. Everything else is secondary.',
  ],
  decision: 'Which depot or van needs a controller’s attention right now, and is the day going to hit the 95% promise?',
  questions: [
    'Is the company on track for 95% on time today?',
    'Which depot is in trouble, and how bad is it?',
    'Are deliveries keeping pace through the day?',
    'Why are delivery attempts failing, and is that getting worse?',
  ],
  data: [
    {
      title: 'Table A · Depots, 2pm today',
      note: 'On-time % is delivered on time divided by delivered so far. The promise is 95%.',
      head: ['Depot', 'Parcels today', 'Delivered', 'On time', 'On-time %', 'Failed', 'Vans out', 'Vans 30+ min late'],
      rows: depots.map(([n, p, d, o, f, v, l]) => [n, num(p), num(d), num(o), pct(o, d), String(f), String(v), String(l)]),
    },
    {
      title: 'Table B · Parcels delivered per hour today (all depots)',
      head: ['Hour', 'Delivered'],
      rows: hourly.map(([h, n]) => [h, num(n)]),
    },
    {
      title: 'Table C · Company on-time % for the last 13 days (today is the last)',
      head: ['Day', 'On-time %', 'Day', 'On-time %'],
      rows: Array.from({ length: 7 }, (_, i) => [
        trendDay(i), `${onTimeTrend[i].toFixed(1)}%`,
        i + 7 < 13 ? trendDay(i + 7) : '', i + 7 < 13 ? `${onTimeTrend[i + 7].toFixed(1)}%` : '',
      ]),
    },
    {
      title: 'Table D · Why delivery attempts failed today',
      head: ['Reason', 'Failed attempts'],
      rows: failReasons.map(([r, n]) => [r, String(n)]),
    },
  ],
  today: [
    'Forty-two small charts fill the screen. From the back of the room none of the labels can be read.',
    'Everything is the same size and the same blue, so a van that is two hours late looks like a van that is two minutes late.',
    'The company-wide average hides the fact that one depot is far worse than the rest.',
    'There is no target line anywhere, so “92.5%” means nothing without knowing it should be 95%.',
  ],
  constraints: [
    'Wall-mounted TV, 1920 × 1080, read from several metres. Text must still be legible at a distance.',
    'Designed to be glanced at: the key message must be visible in two seconds, with no hovering or clicking.',
    'Colour may signal status, but it needs a second cue (a symbol, a label or a position) for colour-blind staff.',
  ],
  stretch:
    'Design what the screen looks like when everything is fine. A dashboard that shouts all day gets ignored. How does your layout stay quiet until something is wrong?',
};

// ═══ Scenario 4 · Rimu Outdoor Gear ═══════════════════════════════════════

const channels: [string, number, number, number, number][] = [
  // channel, sessions, orders, revenue, ad spend
  ['Organic search', 61500, 2310, 288750, 4000],
  ['Paid search', 38200, 1420, 163300, 31000],
  ['Paid social', 29700, 520, 54600, 22500],
  ['Email', 21400, 1640, 213200, 1800],
  ['Direct', 33200, 1010, 119180, 0],
];
const chSessions = sum(channels.map(c => c[1]));
const chOrders = sum(channels.map(c => c[2]));
const chRevenue = sum(channels.map(c => c[3]));
const funnel: [string, number][] = [
  ['Visited the site (sessions)', chSessions],
  ['Viewed a product', 121400],
  ['Added to cart', 24800],
  ['Started checkout', 12100],
  ['Completed a purchase', chOrders],
];
const rimuMonths: [string, number][] = [
  ['Oct 2025', 612400], ['Nov', 735900], ['Dec', 904200], ['Jan 2026', 587300], ['Feb', 523800], ['Mar', 548100],
  ['Apr', 631700], ['May', 702500], ['Jun', 811400], ['Jul', 868900], ['Aug', 797600], ['Sep', chRevenue],
];

const S4: Scenario = {
  n: 4,
  tab: 'Rimu Outdoor Gear',
  client: 'Rimu Outdoor Gear',
  about: 'An online shop selling tramping and snow gear · e-commerce',
  title: 'Where do our customers come from, and where do we lose them?',
  reader: {
    who: 'Tom Nguyen, the marketing manager, presenting to the CEO',
    screen: 'A laptop, then projected onto a meeting-room screen',
    cadence: 'Monthly, as the first ten minutes of the budget meeting',
  },
  glance: ['Marketing manager and CEO', 'Laptop and projector', 'Monthly'],
  story: [
    `Last month (September) Rimu had ${num(chSessions)} visits, ${num(chOrders)} orders and ${money(chRevenue)} of revenue. The CEO wants to move next quarter’s marketing budget, but every channel reports its own flattering numbers.`,
    'Tom’s dashboard has to show the whole journey from a visit to a purchase, compare the channels fairly, and show whether the business is seasonal, so the budget goes where it earns the most.',
  ],
  decision: 'Which marketing channels get more budget next quarter, and where in the buying journey are we losing the most customers?',
  questions: [
    'How many visitors become buyers, and where do most drop out?',
    'Which channels earn the most revenue for the money spent, not just the most visits?',
    'How does this month compare with the same month and the months around it?',
    'What is the single number the CEO should remember from this page?',
  ],
  data: [
    {
      title: 'Table A · The buying journey, September',
      head: ['Step', 'People', '% of visits'],
      rows: funnel.map(([s, n]) => [s, num(n), pct(n, chSessions, 2)]),
    },
    {
      title: 'Table B · By channel, September',
      note: 'Conversion rate is orders divided by sessions. Revenue per $1 of ad spend is a dash where spend was $0.',
      head: ['Channel', 'Sessions', 'Orders', 'Conversion', 'Revenue', 'Ad spend', 'Revenue per $1 spent'],
      rows: channels.map(([c, s, o, r, a]) => [c, num(s), num(o), pct(o, s, 2), money(r), money(a), a ? `$${(r / a).toFixed(2)}` : '–']),
    },
    {
      title: 'Table C · Revenue by month, last 12 months',
      head: ['Month', 'Revenue', 'Month', 'Revenue'],
      rows: Array.from({ length: 6 }, (_, i) => [
        rimuMonths[i][0], money(rimuMonths[i][1]), rimuMonths[i + 6][0], money(rimuMonths[i + 6][1]),
      ]),
    },
    {
      title: 'Table D · Numbers the old dashboard led with',
      note: 'These are all real, but think about whether they help the decision.',
      head: ['Measure', 'Value'],
      rows: [['Total page views', '612,000'], ['Social media followers', '48,300'], ['Newsletter subscribers', '31,900']],
    },
  ],
  today: [
    'The page opens with total page views, followers and subscribers. All three are big and growing, and none of them says anything about revenue.',
    'Channel revenue is shown as a pie. Paid social looks like a reasonable slice, so no one notices it costs $22,500 and returns $54,600.',
    'The journey is a table of five numbers. The 72% who add to cart and do not buy is never highlighted.',
    'Two y-axes on the revenue chart (revenue and orders) make the lines cross at a meaningless point.',
  ],
  constraints: [
    'Laptop and projector, 16:9. Must still be readable when projected in a bright room.',
    'Exactly one headline number. A CEO will remember one thing.',
    'Every chart needs a title that states the finding, not just the topic.',
  ],
  stretch:
    'Tom says “the CEO will ask what happens if we move $10,000 from paid social to email.” Show what you would need to add, or what you must warn the CEO not to assume.',
};

// ═══ Scenario 5 · Tūī Valley Council ══════════════════════════════════════

const waste: [string, number][] = [
  ['Rubbish to landfill', 14200], ['Kerbside recycling', 5100], ['Food scraps', 2400], ['Green waste', 3300],
];
const wasteTotal = sum(waste.map(w => w[1]));
const wasteDiverted = wasteTotal - waste[0][1];
const diversionYears: [string, number][] = [
  ['2019', 32.0], ['2020', 33.5], ['2021', 35.1], ['2022', 37.9], ['2023', 39.6], ['2024', 41.0],
  ['2025', Number(((wasteDiverted / wasteTotal) * 100).toFixed(1))],
];
const suburbs: [string, number, number, number][] = [
  ['Riverbend', 3200, 52, 8], ['Hillcrest', 2900, 49, 11], ['Old Town', 1800, 47, 14], ['Parkside', 3600, 45, 12],
  ['Lakeview', 2700, 42, 17], ['Stonefields', 4100, 38, 19], ['The Flats', 2300, 34, 23], ['Industrial Row', 1400, 29, 27],
];
const contaminants: [string, number][] = [
  ['Soft plastics and plastic bags', 28], ['Food-soiled items such as pizza boxes', 21], ['Glass in the wrong bin', 17],
  ['Nappies and textiles', 11], ['Polystyrene', 9], ['Everything else', 14],
];

const S5: Scenario = {
  n: 5,
  tab: 'Tūī Valley Council',
  client: 'Tūī Valley Council',
  about: 'A local council serving 22,000 households · public sector',
  title: 'The public recycling dashboard',
  reader: {
    who: 'Residents of the Tūī Valley, most with no data skills, many reading on a phone',
    screen: 'A phone in portrait, opened from a link on the rates letter',
    cadence: 'Once or twice a year, for about a minute',
  },
  glance: ['Residents of the valley', 'Phone, portrait', 'Once or twice a year'],
  story: [
    `The council’s goal is to divert 60% of household waste from landfill by 2030. Last year it collected ${num(wasteTotal)} tonnes and ${pct(wasteDiverted, wasteTotal)} was kept out of landfill.`,
    'The council wants to publish its progress so residents can see how their suburb compares, and what a household can do about it. The audience is the whole community, so it must be understood without explanation, by someone who has never used a dashboard.',
  ],
  decision: 'Do residents understand how the valley is doing, how their suburb compares, and the one thing they should change?',
  questions: [
    'How much of our waste stays out of landfill, and how far is that from the 60% goal?',
    'Are we improving year on year?',
    'How does my suburb compare with the others?',
    'What is the most common mistake, and what should I do instead?',
  ],
  data: [
    {
      title: 'Table A · Waste collected last year, by stream (tonnes)',
      note: 'Everything except “Rubbish to landfill” is diverted from landfill.',
      head: ['Stream', 'Tonnes', 'Share of total'],
      rows: waste.map(([s, t]) => [s, num(t), pct(t, wasteTotal)]),
    },
    {
      title: 'Table B · Share of waste diverted from landfill, by year',
      note: 'The 2030 goal is 60%.',
      head: ['Year', 'Diverted', 'Year', 'Diverted'],
      rows: [0, 1, 2, 3].map(i => [
        diversionYears[i][0], `${diversionYears[i][1].toFixed(1)}%`,
        diversionYears[i + 4] ? diversionYears[i + 4][0] : '', diversionYears[i + 4] ? `${diversionYears[i + 4][1].toFixed(1)}%` : '',
      ]),
    },
    {
      title: 'Table C · By suburb, last year',
      note: '“Contaminated” means the share of recycling bins checked that held items that do not belong.',
      head: ['Suburb', 'Households', 'Diverted', 'Bins contaminated'],
      rows: suburbs.map(([s, h, d, c]) => [s, num(h), `${d}%`, `${c}%`]),
    },
    {
      title: 'Table D · What goes wrong in contaminated recycling bins',
      head: ['Item', 'Share of contaminated bins'],
      rows: contaminants.map(([i, s]) => [i, `${s}%`]),
    },
  ],
  today: [
    'The page is a 12-page PDF report with a donut chart split into 14 slices.',
    'Terms like “diversion rate”, “contamination” and “tonnage” are never explained.',
    'Suburbs are listed alphabetically, so the best and worst are hidden in the middle.',
    'Light grey text on a white background is hard to read, particularly on a phone in sunlight.',
  ],
  constraints: [
    'Phone, portrait, about 390 × 844. One column. Thumb-friendly.',
    'Plain language. If a word needs explaining, replace it. No jargon on the screen.',
    'Meets accessibility basics: strong text contrast, and no meaning carried by colour alone.',
  ],
  stretch:
    'A resident should be able to find their own suburb in two taps. Show how you would highlight “you are here” without needing a search box or a long list.',
};

export const SCENARIOS: Scenario[] = [S1, S2, S3, S4, S5];

// ═══ The method ═══════════════════════════════════════════════════════════

export const STEPS: { title: string; body: string }[] = [
  {
    title: 'Name the reader and the decision',
    body: 'Write one sentence: “[Who] needs to decide [what], looking at [which screen], [how often].” If you cannot write it, you cannot design the dashboard. Every later choice comes back to this sentence.',
  },
  {
    title: 'Write the questions',
    body: 'List three to five questions the reader must be able to answer within five seconds. Each question will become one visual. A visual that answers no question is decoration, and it goes.',
  },
  {
    title: 'Match each question to a chart',
    body: 'Use the cheat sheet below. Decide the chart from the type of question, not from what looks interesting. Write down the chart you rejected and why. That sentence is half of your presentation.',
  },
  {
    title: 'Sketch the layout on paper',
    body: 'Five minutes, pencil, no computer. Put the most important thing top-left, group visuals that answer related questions, and keep the whole screen to six to nine items. Decide the layout before choosing colours.',
  },
  {
    title: 'Mock it up, then test it',
    body: 'Build the sketch in your tool using the real numbers from your data tables. Then run the five-second test: show another team the screen for five seconds, hide it, and ask what the main message was.',
  },
];

export const CHARTS: { ask: string; use: string; avoid: string }[] = [
  { ask: 'Compare categories (cafés, channels, depots)', use: 'Horizontal bar chart, sorted from largest to smallest', avoid: 'Pie or donut with more than four slices, 3D charts, bright rainbow colours' },
  { ask: 'Show a trend over time', use: 'Line chart, with a target or last-year line where one exists', avoid: 'A y-axis that starts well above zero on a bar, columns for 60 data points' },
  { ask: 'Compare a result with a target', use: 'A bar with a target marker, or a progress bar, with the number written next to it', avoid: 'Speedometer gauges, red/green traffic lights on their own' },
  { ask: 'Show part of a whole (two to four parts)', use: 'A single stacked bar, or a donut with direct labels', avoid: 'Pies with many thin slices, two pies side by side to compare' },
  { ask: 'Find a pattern across two categories (day × time)', use: 'Heatmap with the values printed in the cells', avoid: 'Twelve line charts, a rainbow colour scale' },
  { ask: 'Show where people drop out of a process', use: 'A funnel, or horizontal bars with the percentage kept at each step', avoid: 'A table of five numbers with no visual' },
  { ask: 'Show one important number', use: 'A KPI tile: the number, the unit, and a comparison (target, last period)', avoid: 'A bare number that nobody can judge' },
  { ask: 'Relate two measures (spend and revenue)', use: 'Scatter plot, labelled points', avoid: 'A dual-axis line chart, where the crossing point means nothing' },
];

export const PRINCIPLES: { title: string; body: string }[] = [
  { title: 'Top-left is read first', body: 'Put the single most important item there. Readers scan roughly in a Z or an F shape, so size and position carry the priority.' },
  { title: 'Six to nine visuals, not twenty', body: 'Every extra chart steals attention from the others. If a team cannot say which question a visual answers, remove it.' },
  { title: 'Say the finding in the title', body: '“Saturday revenue is double Monday’s” tells the reader what to see. “Revenue by day” makes them work it out.' },
  { title: 'Use colour to point, not to decorate', body: 'Grey for everything, one strong colour for the thing that matters. Add a second cue (icon, label, position) so colour is never the only signal.' },
  { title: 'Compare with something', body: 'A number without a target, a last period or a benchmark cannot be judged. Show the comparison next to it.' },
  { title: 'Align, space, and remove clutter', body: 'Snap everything to a grid, leave white space between groups, and delete gridlines, borders and 3D effects that carry no information.' },
];

// ═══ Layout skeletons ═════════════════════════════════════════════════════
// Drawn as grids on the page and in the PDF. Each cell is [label, columns,
// rows], optionally flagged as the item the eye should land on first.

export type Cell = [string, number, number, boolean?];
export const WIRES: { name: string; cols: number; reader: string; cells: Cell[]; why: string }[] = [
  {
    name: 'Summary board',
    cols: 4,
    reader: 'A manager reviewing last week or last month',
    cells: [
      ['Headline KPI', 1, 1, true], ['KPI', 1, 1], ['KPI', 1, 1], ['KPI', 1, 1],
      ['Trend over time', 3, 2], ['Ranked bars', 1, 2],
      ['Detail table', 4, 1],
    ],
    why: 'Numbers first, then the trend that explains them, then the detail for anyone who wants it.',
  },
  {
    name: 'Glance board',
    cols: 3,
    reader: 'A team looking up from other work, from a distance',
    cells: [
      ['One status line', 3, 1, true],
      ['What needs action now', 2, 2], ['Trend against target', 1, 1], ['Breakdown', 1, 1],
    ],
    why: 'Almost nothing on it. The status says whether to act, and the biggest area says where.',
  },
  {
    name: 'Explorer',
    cols: 4,
    reader: 'An analyst who will filter and click',
    cells: [
      ['Filters', 1, 3],
      ['KPI', 1, 1, true], ['KPI', 1, 1], ['KPI', 1, 1],
      ['Main chart, changes with the filters', 3, 2],
    ],
    why: 'Controls on the left, results on the right. Only suits a reader who has time and a reason to explore.',
  },
];


// ═══ Tools ════════════════════════════════════════════════════════════════

export const TOOLS: { name: string; tag: string; url: string; good: string; watch: string; pick?: boolean }[] = [
  {
    name: 'Google Slides',
    tag: 'Our pick',
    url: 'https://slides.google.com',
    good: 'Free with any Google account, nothing to install, and the whole team edits the same file at once. A slide is a ready-made 16:9 canvas, and Insert → Chart gives you real bar, line and pie charts you can edit with your own numbers. Everybody already knows how to use it.',
    watch: 'It has no dashboard templates, so you build the layout from rectangles and text boxes. That is a feature for this activity: you decide the layout instead of filling in a template.',
    pick: true,
  },
  {
    name: 'Canva',
    tag: 'Prettier, if someone knows it',
    url: 'https://www.canva.com',
    good: 'Free plan, runs in the browser, lots of dashboard-style templates, and a built-in chart tool where you type the numbers in.',
    watch: 'Templates tempt teams to fill boxes instead of choosing charts. Check that your team can edit the same design at once on the free plan before you start, and note that some elements are paid.',
  },
  {
    name: 'Figma',
    tag: 'Most control, steepest to learn',
    url: 'https://www.figma.com',
    good: 'The free plan is what professional designers use for screen mockups, with precise grids and alignment.',
    watch: 'There is a learning curve, and the free plan limits how many files a team can share, so only pick it if a team member already uses it.',
  },
  {
    name: 'Excalidraw (for the sketch)',
    tag: 'Free, no sign-up',
    url: 'https://excalidraw.com',
    good: 'A shared whiteboard that looks hand-drawn. Perfect for the five-minute layout sketch before you open a mockup tool. Paper and pencil work just as well.',
    watch: 'It cannot draw charts from data. Use it for the sketch, then move to Slides, Canva or Figma.',
  },
];

export const SLIDES_STEPS: string[] = [
  'Go to slides.google.com and create a blank presentation. Name it with your team number and client, for example “Team 3 · Tāmaki Courier”.',
  'Check the slide size under File → Page setup. Choose the size that matches your brief: widescreen 16:9 for a desktop, TV or projector, or a custom portrait size for a phone.',
  'Turn on guides and snapping from the View menu, so rectangles and charts line up on a grid.',
  'Draw one rectangle per visual first, in light grey, and label each with the question it answers. This is your layout. Move things around until the priority order is right.',
  'Replace each grey rectangle with a real chart: Insert → Chart, then choose bar, column, line or pie. Use “Open source” to edit the numbers in the linked Google Sheet and paste in your data table.',
  'Format for the reader: one strong colour plus greys, big enough text for the screen, direct labels instead of legends, and a title that states the finding.',
  'Share the file with your teammates as editors so you can all work at once. Keep a final copy as a PDF or PNG for the presentation.',
];

// ═══ Running the session ══════════════════════════════════════════════════

export const AGENDA: [string, string, string][] = [
  ['10 min', 'Form teams and read your brief', 'Five teams of four to six. Each team takes the next scenario, reads the brief out loud, and agrees the one-sentence reader and decision statement.'],
  ['10 min', 'Critique the dashboard they have today', 'Go through the “what the current dashboard gets wrong” list. For each item, say why it fails the reader. This is your design checklist.'],
  ['15 min', 'Questions, then charts', 'Write the questions, then choose a chart for each from the cheat sheet. Write down one chart you rejected.'],
  ['10 min', 'Sketch the layout on paper', 'Pencil on the sketch page. Priority top-left, related visuals together. Photograph it.'],
  ['25 min', 'Build the mockup', 'Divide the work: one person per two or three visuals, one person owns layout and consistency. Use the real numbers from your data tables.'],
  ['5 min', 'Five-second test', 'Swap with another team. Show for five seconds, hide, and ask what the main message was. Write down what they said.'],
  ['15 min', 'Present and give feedback', 'Three minutes per team: the reader, the layout, and two design decisions with the chart you rejected. Then two minutes of feedback each.'],
];

export const DELIVERABLES: [string, string][] = [
  ['A one-page mockup', 'The dashboard as the reader will see it, built from the real numbers in your data tables, in the tool you chose.'],
  ['A design rationale table', 'One row per visual: the question it answers, the chart you chose, the chart you rejected and why, and how you used colour.'],
  ['A three-minute pitch', 'Who the reader is, how the layout leads their eye, and two decisions you are proud of. Everyone in the team speaks.'],
];

export const FEEDBACK: string[] = [
  'Five-second test: could a stranger say the main message after five seconds?',
  'Is the most important item in the most prominent position?',
  'Can you point to the question each visual answers?',
  'Is every chart the right type for its question?',
  'Does every number have something to compare against?',
  'Do the titles state findings rather than topics?',
  'Is colour used with purpose, with a second cue for status?',
  'Could the screen be read on the device and from the distance in the brief?',
  'Has anything been included that the reader does not need?',
  'Is anything shown that should not be, such as identifying information?',
];
