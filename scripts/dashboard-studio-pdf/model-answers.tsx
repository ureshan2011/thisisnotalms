import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  cafes, cafeWeeks, cafeDays, clinicDays, clinicMonths, clinicTypes, clinicReminder, clinicBooked, clinicDna,
  depots, hourly, onTimeTrend, failReasons, channels, chSessions, chOrders, chRevenue, funnel, rimuMonths,
  waste, wasteTotal, wasteDiverted, diversionYears, suburbs, contaminants, slots,
} from '../../src/components/public/dashboard/studio';

// ─── Model answer dashboards ──────────────────────────────────────────────
// One finished dashboard per team scenario, drawn to look like a slide built
// in Google Slides: white background, Arial, flat rectangles with a thin
// outline, and charts in Google's default colours with plain gridlines. Each
// page is the size of the device in its brief.
//
// Every number is computed from the same data the briefs print
// (src/components/public/dashboard/studio.ts), so a label always agrees with
// the team's data tables.
//
// The design still follows what the activity teaches: one question per
// visual, the right chart for each question, a title that states the finding,
// one colour for what matters and neutral for the rest, a comparison next to
// every number, and a word or position beside any colour that carries meaning.

const G = {
  blue: '#4285F4', blueDark: '#1A73E8', blueLight: '#AECBFA', red: '#DB4437', yellow: '#F4B400', green: '#0F9D58',
  grey: '#9AA0A6', grid: '#E0E0E0', axis: '#BDBDBD', text: '#202124', sub: '#5F6368', shade: '#F1F3F4',
};

const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);
const nf = new Intl.NumberFormat('en-NZ');
const n0 = (n: number): string => nf.format(n);
const p1 = (x: number): string => `${(x * 100).toFixed(1)}%`;
const p0 = (x: number): string => `${Math.round(x * 100)}%`;
const k1 = (n: number): string => `$${(n / 1000).toFixed(1)}k`;
const k0 = (n: number): string => `$${Math.round(n / 1000)}k`;

// ── Chart pieces, in the manner of a Google Sheets chart ─────────────────

function T({ x, y, size = 11, weight = 400, fill = G.text, anchor = 'start', children }: {
  x: number; y: number; size?: number; weight?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; children: ReactNode;
}) {
  return <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor}>{children}</text>;
}

type LegendItem = { label: string; color: string; kind?: 'box' | 'line' | 'dash' };

/** A one-row legend, as Sheets draws at the top or bottom of a chart. */
function Legend({ x, y, items, size = 11 }: { x: number; y: number; items: LegendItem[]; size?: number }) {
  let cx = x;
  return (
    <g>
      {items.map(it => {
        const at = cx;
        cx += it.label.length * size * 0.56 + 38;
        const kind = it.kind ?? 'box';
        return (
          <g key={it.label}>
            {kind === 'box' && <rect x={at} y={y - size + 1} width={size} height={size} fill={it.color} />}
            {kind === 'line' && <line x1={at} x2={at + 18} y1={y - 4} y2={y - 4} stroke={it.color} strokeWidth={2} />}
            {kind === 'dash' && <line x1={at} x2={at + 18} y1={y - 4} y2={y - 4} stroke={it.color} strokeWidth={2} strokeDasharray="4 3" />}
            <T x={at + (kind === 'box' ? size + 6 : 24)} y={y} size={size} fill={G.sub}>{it.label}</T>
          </g>
        );
      })}
    </g>
  );
}

type Bar = { label: string; value: number; color: string; text: string };

/** Horizontal bar chart: category labels left, light vertical gridlines, a value label at the end of each bar. */
function HBars({ w, rows, max, ticks, tick, labelW = 100, pitch = 24, bar = 14, right = 70, top = 0, size = 11, refLine, legend }: {
  w: number; rows: Bar[]; max: number; ticks: number[]; tick: (v: number) => string; labelW?: number; pitch?: number; bar?: number;
  right?: number; top?: number; size?: number; refLine?: { value: number; label: string }; legend?: LegendItem[];
}) {
  const x = (v: number) => labelW + ((w - labelW - right) * v) / max;
  const base = top + rows.length * pitch;
  const labelX = (r: Bar) => {
    const at = x(r.value) + 5;
    if (!refLine) return at;
    const rx = x(refLine.value);
    return at < rx + 3 && at + r.text.length * size * 0.55 > rx - 3 && x(r.value) < rx ? rx + 7 : at;
  };
  return (
    <svg viewBox={`0 0 ${w} ${base + size + 10}`} width="100%">
      {legend && <Legend x={labelW} y={size + 1} items={legend} size={size} />}
      {ticks.map(v => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={top} y2={base} stroke={v === 0 ? G.axis : G.grid} />
          <T x={x(v)} y={base + size + 4} size={size} fill={G.sub} anchor="middle">{tick(v)}</T>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = top + i * pitch + (pitch - bar) / 2;
        return (
          <g key={r.label}>
            <T x={labelW - 8} y={y + bar - 3} size={size} anchor="end">{r.label}</T>
            <rect x={x(0)} y={y} width={x(r.value) - x(0)} height={bar} fill={r.color} />
            <T x={labelX(r)} y={y + bar - 3} size={size}>{r.text}</T>
          </g>
        );
      })}
      {refLine && (
        <g>
          <line x1={x(refLine.value)} x2={x(refLine.value)} y1={top - 3} y2={base} stroke={G.text} strokeWidth={1.5} strokeDasharray="5 3" />
          <T x={x(refLine.value)} y={top - 7} size={size} weight={700} anchor="middle">{refLine.label}</T>
        </g>
      )}
    </svg>
  );
}

/** Column chart. */
function VCols({ w, h, rows, max, ticks, tick, left = 40, size = 11 }: {
  w: number; h: number; rows: Bar[]; max: number; ticks: number[]; tick: (v: number) => string; left?: number; size?: number;
}) {
  const bottom = size + 12;
  const top = size + 8;
  const y = (v: number) => top + (h - top - bottom) * (1 - v / max);
  const pitch = (w - left) / rows.length;
  const bw = pitch * 0.62;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%">
      {ticks.map(v => (
        <g key={v}>
          <line x1={left} x2={w} y1={y(v)} y2={y(v)} stroke={v === 0 ? G.axis : G.grid} />
          <T x={left - 6} y={y(v) + 4} size={size} fill={G.sub} anchor="end">{tick(v)}</T>
        </g>
      ))}
      {rows.map((r, i) => {
        const cx = left + pitch * i + pitch / 2;
        return (
          <g key={r.label}>
            <rect x={cx - bw / 2} y={y(r.value)} width={bw} height={y(0) - y(r.value)} fill={r.color} />
            <T x={cx} y={y(r.value) - 4} size={size} anchor="middle">{r.text}</T>
            <T x={cx} y={h - 6} size={size} fill={G.sub} anchor="middle">{r.label}</T>
          </g>
        );
      })}
    </svg>
  );
}

type Series = { values: number[]; color: string; width?: number };
type Mark = { i: number; text: string; dy: number; color?: string };

/** Line chart with markers, optional reference lines, shaded spans and labelled points. */
function Lines({ w, h, labels, series, ymin, ymax, ticks, tick, refs = [], shades = [], marks = [], left = 44, right = 14, top = 22, size = 11, legend, labelEvery = 1 }: {
  w: number; h: number; labels: string[]; series: Series[]; ymin: number; ymax: number; ticks: number[]; tick: (v: number) => string;
  refs?: { value: number; label?: string }[]; shades?: { from: number; to: number; label: string }[]; marks?: Mark[];
  left?: number; right?: number; top?: number; size?: number; legend?: LegendItem[]; labelEvery?: number;
}) {
  const bottom = size + 12;
  const n = labels.length;
  const x = (i: number) => left + 12 + (i * (w - left - right - 24)) / (n - 1);
  const y = (v: number) => top + (h - top - bottom) * (1 - (v - ymin) / (ymax - ymin));
  const step = (w - left - right - 24) / (n - 1);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%">
      {legend && <Legend x={left} y={size + 1} items={legend} size={size} />}
      {shades.map(s => (
        <g key={s.label}>
          <rect x={x(s.from) - step / 2} y={top} width={x(s.to) - x(s.from) + step} height={y(ymin) - top} fill={G.shade} />
          <T x={(x(s.from) + x(s.to)) / 2} y={top + size + 2} size={size} fill={G.sub} anchor="middle">{s.label}</T>
        </g>
      ))}
      {ticks.map(v => (
        <g key={v}>
          <line x1={left} x2={w - right} y1={y(v)} y2={y(v)} stroke={v === ymin ? G.axis : G.grid} />
          <T x={left - 6} y={y(v) + 4} size={size} fill={G.sub} anchor="end">{tick(v)}</T>
        </g>
      ))}
      {refs.map(r => (
        <g key={r.value}>
          <line x1={left} x2={w - right} y1={y(r.value)} y2={y(r.value)} stroke={G.text} strokeWidth={1.5} strokeDasharray="5 3" />
          {r.label && <T x={w - right} y={y(r.value) - 5} size={size} weight={700} anchor="end">{r.label}</T>}
        </g>
      ))}
      {series.map(s => (
        <g key={s.color}>
          <polyline points={s.values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')} fill="none" stroke={s.color} strokeWidth={s.width ?? 2} strokeLinejoin="round" />
          {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill={s.color} />)}
        </g>
      ))}
      {marks.map(m => (
        <T key={m.i} x={x(m.i)} y={y(series[0].values[m.i]) + m.dy} size={size} weight={700} fill={m.color ?? G.text} anchor="middle">{m.text}</T>
      ))}
      {labels.map((l, i) => (i % labelEvery === 0 || i === n - 1) && (
        <T key={i} x={x(i)} y={h - 5} size={size} fill={G.sub} anchor="middle">{l}</T>
      ))}
    </svg>
  );
}

function Box({ title, sub, children, style }: { title: ReactNode; sub?: ReactNode; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <section className="box" style={style}>
      <h3>{title}</h3>
      {sub && <p className="sub">{sub}</p>}
      <div className="box__body">{children}</div>
    </section>
  );
}

function Slide({ id, title, sub, foot, children }: { id: string; title: string; sub?: string; foot: string; children: ReactNode }) {
  return (
    <section className={`pg pg--${id}`}>
      <div>
        <h1 className="title">{title}</h1>
        {sub && <p className="subtitle">{sub}</p>}
      </div>
      {children}
      <p className="foot">{foot}</p>
    </section>
  );
}

// ═══ Team 1 · Kōtuku Café Group · tablet 1024 × 768 ═══════════════════════

function Team1() {
  const total = sum(cafes.map(c => c[1]));
  const target = sum(cafes.map(c => c[2]));
  const rows = cafes.map(([n, r, t, cu]) => ({ n, r, t, p: r / t, gap: r - t, spend: r / cu })).sort((a, b) => b.p - a.p);
  const weekTarget = target / 13;
  const friSun = sum([cafeDays[4][1], cafeDays[5][1], cafeDays[6][1]]) / sum(cafeDays.map(d => d[1]));
  const groupSpend = total / sum(cafes.map(c => c[3]));
  const bySpend = [...rows].sort((a, b) => b.spend - a.spend);
  const gapTxt = (g: number) => `${g >= 0 ? '+' : '−'}$${(Math.abs(g) / 1000).toFixed(1)}k`;

  return (
    <Slide id="t1" title="Four of six cafés are behind target, and Henderson is furthest behind" sub="Kōtuku Café Group · this quarter, 13 weeks, six cafés" foot="Model answer · Team 1 · Kōtuku Café Group">
      <div className="row" style={{ gridTemplateColumns: '250px 1fr', height: 204 }}>
        <div className="kpi">
          <p className="kpi__lbl">Quarter revenue vs target</p>
          <p className="kpi__num">{p0(total / target)}</p>
          <p className="kpi__txt">${(total / 1e6).toFixed(2)}M of the ${(target / 1e6).toFixed(2)}M target</p>
          <p className="kpi__txt" style={{ color: G.red, fontWeight: 700, marginTop: 4 }}>${n0(target - total)} behind target</p>
        </div>
        <Box title="Henderson is furthest behind, at 80% of target" sub="Revenue as a share of each café’s target, with the gap in dollars">
          <HBars
            w={700} top={28} labelW={86} right={120} pitch={19} bar={12} max={110} ticks={[0, 20, 40, 60, 80, 100]} tick={v => `${v}%`}
            rows={rows.map(r => ({ label: r.n, value: r.p * 100, color: r.p >= 1 ? G.blue : G.red, text: `${p0(r.p)}  (${gapTxt(r.gap)})` }))}
            refLine={{ value: 100, label: 'Target' }}
            legend={[{ label: 'On or above target', color: G.blue }, { label: 'Behind target', color: G.red }]}
          />
        </Box>
      </div>
      <Box title="Revenue peaked in week 10, then fell through the school holidays" sub="Group revenue per week" style={{ height: 190 }}>
        <Lines
          w={950} h={140} left={50} top={26} labels={cafeWeeks.map((_, i) => `Week ${i + 1}`)} ymin={110000} ymax={150000}
          ticks={[110000, 120000, 130000, 140000, 150000]} tick={v => `$${v / 1000}k`}
          series={[{ values: cafeWeeks, color: G.blue }]} refs={[{ value: weekTarget }]}
          legend={[{ label: 'Group revenue', color: G.blue, kind: 'line' }, { label: `Weekly target ${k1(weekTarget)}`, color: G.text, kind: 'dash' }]}
          shades={[{ from: 10, to: 11, label: 'School holidays' }]}
          marks={[{ i: 9, text: k1(cafeWeeks[9]), dy: -9 }, { i: 11, text: k1(cafeWeeks[11]), dy: 18, color: G.red }]}
        />
      </Box>
      <div className="row" style={{ gridTemplateColumns: '1fr 1fr', height: 198 }}>
        <Box title="Saturday brings double Monday’s revenue" sub={`Average revenue per day. Friday to Sunday bring ${p0(friSun)} of the week`}>
          <VCols
            w={460} h={150} max={30000} ticks={[0, 10000, 20000, 30000]} tick={v => `$${v / 1000}k`}
            rows={cafeDays.map(([d, v]) => ({ label: d.slice(0, 3), value: v, color: d === 'Saturday' ? G.blueDark : G.blueLight, text: k1(v) }))}
          />
        </Box>
        <Box title="Henderson customers spend the least" sub="Average spend per customer this quarter">
          <HBars
            w={460} top={20} labelW={84} right={60} pitch={19} bar={12} max={8} ticks={[0, 2, 4, 6, 8]} tick={v => `$${v}`}
            rows={bySpend.map(r => ({ label: r.n, value: r.spend, color: r.n === 'Henderson' ? G.red : G.blueLight, text: `$${r.spend.toFixed(2)}` }))}
            refLine={{ value: groupSpend, label: `Group average $${groupSpend.toFixed(2)}` }}
          />
        </Box>
      </div>
    </Slide>
  );
}

// ═══ Team 2 · Harbourview Medical Centre · desktop 1280 × 720 ═════════════

function shade(rate: number): { bg: string; fg: string } {
  if (rate >= 0.14) return { bg: G.red, fg: '#fff' };
  if (rate >= 0.095) return { bg: '#EE8B82', fg: G.text };
  if (rate >= 0.075) return { bg: '#F6C0BB', fg: G.text };
  return { bg: '#FCE8E6', fg: G.text };
}

function Team2() {
  const rate = (d: number, b: number) => d / b;
  const overall = clinicDna / clinicBooked;
  const [txt, none] = clinicReminder;
  const months = clinicMonths.map(([m, b, d]) => ({ m, r: rate(d, b) }));
  const types = clinicTypes.map(([t, b, d]) => ({ t, b, d, r: rate(d, b) })).sort((a, b) => b.r - a.r);
  const fri = clinicDays[4][1][2];
  const hi = months.reduce((a, b, i) => (b.r > months[a].r ? i : a), 0);

  const kpi = (lbl: string, num: string, txtLine: string, color?: string) => (
    <div className="kpi" style={{ padding: '8px 14px' }}>
      <p className="kpi__lbl">{lbl}</p>
      <p className="kpi__num" style={{ color: color ?? G.text, fontSize: 30 }}>{num}</p>
      <p className="kpi__txt">{txtLine}</p>
    </div>
  );

  return (
    <Slide id="t2" title="Afternoons and patients with no reminder miss the most appointments" sub="Harbourview Medical Centre · missed appointments (DNAs), April to September · groups only, no patient names or identifiers" foot="Model answer · Team 2 · Harbourview Medical Centre">
      <div className="row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', height: 112 }}>
        {kpi('Overall missed-appointment rate', p1(overall), `${clinicDna} of ${n0(clinicBooked)} bookings. September ${p1(months[5].r)}, down from ${p1(months[hi].r)} in July`)}
        {kpi('No reminder, compared with a text reminder', p1(none[2] / none[1]), `against ${p1(txt[2] / txt[1])} when a text was sent: ${(none[2] / none[1] / (txt[2] / txt[1])).toFixed(1)} times as likely`, G.red)}
        {kpi('Highest single slot', p1(fri[1] / fri[0]), `Friday afternoon. Small base: only ${fri[0]} bookings, so treat with care`)}
      </div>
      <div className="row" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', flex: 1 }}>
        <Box title="Monday to Thursday afternoons are missed most often" sub="Missed share of bookings, by day and time. Counts in small type">
          <div style={{ width: '100%' }}>
            <table className="heat">
              <thead><tr><th>Day</th>{slots.map(s => <th key={s}>{s}</th>)}</tr></thead>
              <tbody>
                {clinicDays.map(([day, cells]) => (
                  <tr key={day}>
                    <td>{day}</td>
                    {cells.map(([b, d], i) => {
                      const c = shade(rate(d, b));
                      return <td key={i} style={{ background: c.bg, color: c.fg, outline: b < 200 ? `2px solid ${G.text}` : undefined, outlineOffset: -2 }}>{p1(rate(d, b))}<small>{d} of {b}{b < 200 ? ' (small base)' : ''}</small></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="note">Shading: under 7.5% · 7.5 to 9.5% · 9.5 to 14% · over 14%, light to dark.</p>
          </div>
        </Box>
        <Box title="Allied health and mental health are missed most" sub="Missed share by appointment type, against the overall rate">
          <HBars
            w={590} top={18} labelW={170} right={140} pitch={28} bar={16} max={20} ticks={[0, 5, 10, 15, 20]} tick={v => `${v}%`}
            rows={types.map((t, i) => ({ label: t.t, value: t.r * 100, color: i < 2 ? G.red : G.blueLight, text: `${p1(t.r)}  (${t.d} of ${n0(t.b)})` }))}
            refLine={{ value: overall * 100, label: `All visits ${p1(overall)}` }}
          />
        </Box>
        <Box title="The rate peaked in July and is now the lowest of the six months" sub="Missed share of bookings each month, starting from zero">
          <Lines
            w={590} h={172} left={40} top={28} labels={months.map(m => m.m)} ymin={0} ymax={0.1} ticks={[0, 0.02, 0.04, 0.06, 0.08, 0.1]} tick={v => `${Math.round(v * 100)}%`}
            series={[{ values: months.map(m => m.r), color: G.blue }]} refs={[{ value: overall }]}
            legend={[{ label: 'Missed share of bookings', color: G.blue, kind: 'line' }, { label: `Six-month average ${p1(overall)}`, color: G.text, kind: 'dash' }]}
            marks={months.map((m, i) => ({ i, text: p1(m.r), dy: m.r < overall ? 18 : -9, color: i === hi ? G.red : G.text }))}
          />
        </Box>
        <Box title="Patients with no reminder miss twice as often" sub="Missed share, by whether a reminder was sent">
          <div style={{ width: '100%' }}>
            <HBars
              w={590} top={4} labelW={190} right={150} pitch={40} bar={24} max={15} ticks={[0, 5, 10, 15]} tick={v => `${v}%`}
              rows={[
                { label: 'Text reminder sent', value: (txt[2] / txt[1]) * 100, color: G.blue, text: `${p1(txt[2] / txt[1])}  (${txt[2]} of ${n0(txt[1])})` },
                { label: 'No reminder', value: (none[2] / none[1]) * 100, color: G.red, text: `${p1(none[2] / none[1])}  (${none[2]} of ${n0(none[1])})` },
              ]}
            />
            <p className="note" style={{ fontSize: 12, color: G.text }}>
              {p0(none[1] / clinicBooked)} of bookings had no reminder, and they made up {p0(none[2] / clinicDna)} of all DNAs.
            </p>
          </div>
        </Box>
      </div>
    </Slide>
  );
}

// ═══ Team 3 · Tāmaki Courier Co. · wall TV 1280 × 720 ═════════════════════

function Team3() {
  const delivered = sum(depots.map(d => d[2]));
  const parcels = sum(depots.map(d => d[1]));
  const onTime = sum(depots.map(d => d[3]));
  const failed = sum(depots.map(d => d[4]));
  const today = onTime / delivered;
  const rows = depots
    .map(([name, , del, ot, , vans, late]) => ({ name, p: ot / del, vans, late, kind: (late >= 4 ? 'act' : late >= 1 ? 'watch' : 'ok') as 'act' | 'watch' | 'ok' }))
    .sort((a, b) => b.late - a.late || a.p - b.p);
  const actNow = rows.filter(r => r.kind === 'act');
  const left = parcels - delivered;
  const lastHour = hourly[hourly.length - 1][1];
  const hourLbl = ['8am', '9', '10', '11', '12pm', '1pm'];
  const reason = (r: string) => r.replace('Address problem', 'Wrong address').replace('Access or gate problem', 'Gate or access');

  return (
    <Slide
      id="t3"
      title={`${actNow.map(r => r.name).join(' and ')} need action: ${p1(today)} on time against a 95% promise`}
      foot="Model answer · Team 3 · Tāmaki Courier Co. · control room, 2:00 pm"
    >
      <div className="row" style={{ gridTemplateColumns: '1.15fr 1fr 1fr', height: 112 }}>
        <div className="kpi kpi--red">
          <p className="kpi__lbl">On time today (promise 95%)</p>
          <p className="kpi__num">{p1(today)}</p>
          <p className="kpi__txt">{(95 - today * 100).toFixed(1)} points under the promise</p>
        </div>
        <div className="kpi">
          <p className="kpi__lbl">Delivered so far</p>
          <p className="kpi__num">{n0(delivered)}</p>
          <p className="kpi__txt">of {n0(parcels)} parcels today</p>
        </div>
        <div className="kpi">
          <p className="kpi__lbl">Still to deliver</p>
          <p className="kpi__num">{n0(left)}</p>
          <p className="kpi__txt">about {(left / lastHour).toFixed(1)} hours at the last hour’s pace</p>
        </div>
      </div>
      <div className="row" style={{ gridTemplateColumns: '620px 1fr', flex: 1 }}>
        <Box title="Where to act, worst first" sub="On-time share by depot, with vans running 30 or more minutes late">
          <div style={{ width: '100%' }}>
            <table className="wall">
              <thead><tr><th>Status</th><th>Depot</th><th style={{ textAlign: 'right' }}>On time</th><th>Vans 30+ min late</th></tr></thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.name}>
                    <td className={`st st--${r.kind}`}>{r.kind === 'act' ? 'ACT NOW' : r.kind === 'watch' ? 'WATCH' : 'ON TRACK'}</td>
                    <td style={{ fontWeight: 700 }}>{r.name}</td>
                    <td className="pc" style={{ color: r.p < 0.95 ? G.red : G.text }}>{p1(r.p)}</td>
                    <td>{r.late} of {r.vans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="note" style={{ fontSize: 13 }}>ACT NOW: 4 or more vans late · WATCH: 1 to 3 vans late · ON TRACK: none late. Promise: 95% on time.</p>
          </div>
        </Box>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 10, minHeight: 0 }}>
          <Box title="Today is the lowest of the last 13 days" sub="Company on-time share">
            <Lines
              w={560} h={160} left={46} top={26} size={13} labels={onTimeTrend.map((_, i) => (i === 12 ? 'Today' : i === 0 ? '13 days ago' : ''))}
              ymin={91} ymax={97} ticks={[91, 93, 95, 97]} tick={v => `${v}%`}
              series={[{ values: onTimeTrend, color: G.blue }]} refs={[{ value: 95 }]}
              legend={[{ label: 'Company on-time share', color: G.blue, kind: 'line' }, { label: 'Promise 95%', color: G.text, kind: 'dash' }]}
              marks={[{ i: 12, text: p1(today), dy: 22, color: G.red }]}
            />
          </Box>
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 10, minHeight: 0 }}>
            <Box title="Pace is slipping" sub={`${n0(lastHour)} in the last hour, down from ${n0(Math.max(...hourly.map(h => h[1])))}`}>
              <VCols
                w={270} h={150} size={12} left={34} max={1200} ticks={[0, 400, 800, 1200]} tick={v => n0(v)}
                rows={hourly.map(([, v], i) => ({ label: hourLbl[i], value: v, color: i === hourly.length - 1 ? G.red : G.blueLight, text: i === 3 || i === 5 ? n0(v) : '' }))}
              />
            </Box>
            <Box title="Why deliveries fail" sub={`${p0(failReasons[0][1] / failed)} of ${failed} failed attempts: nobody home`}>
              <HBars
                w={300} top={0} labelW={128} right={30} pitch={29} bar={17} size={12} max={70} ticks={[0, 35, 70]} tick={v => String(v)}
                rows={failReasons.map(([r, v], i) => ({ label: reason(r), value: v, color: i === 0 ? G.red : G.blueLight, text: String(v) }))}
              />
            </Box>
          </div>
        </div>
      </div>
    </Slide>
  );
}

// ═══ Team 4 · Rimu Outdoor Gear · projector 1280 × 720 ════════════════════

function Team4() {
  const spend = sum(channels.map(c => c[4]));
  const rows = channels
    .map(([n, , , r, a]) => ({ n, rev: r / chRevenue, sp: a / spend }))
    .sort((a, b) => b.rev - b.sp - (a.rev - a.sp));
  const social = rows.find(r => r.n === 'Paid social')!;
  const leak = 1 - chOrders / funnel[2][1];
  const names = ['Visited', 'Viewed a product', 'Added to cart', 'Started checkout', 'Bought'];

  // Clustered horizontal bars: two series per channel.
  const W = 916, labelW = 110, right = 60, pitch = 35, top = 28;
  const x = (v: number) => labelW + ((W - labelW - right) * v) / 0.6;
  const base = top + rows.length * pitch;
  const clustered = (
    <svg viewBox={`0 0 ${W} ${base + 22}`} width="100%">
      <Legend x={labelW} y={13} size={12} items={[{ label: 'Share of ad spend', color: G.grey }, { label: 'Share of revenue', color: G.blue }]} />
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map(v => (
        <g key={v}>
          <line x1={x(v)} x2={x(v)} y1={top} y2={base} stroke={v === 0 ? G.axis : G.grid} />
          <T x={x(v)} y={base + 16} size={12} fill={G.sub} anchor="middle">{`${Math.round(v * 100)}%`}</T>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = top + i * pitch + 4;
        const loses = r.rev < r.sp;
        return (
          <g key={r.n}>
            <T x={labelW - 8} y={y + 22} size={12} weight={700} anchor="end">{r.n}</T>
            <rect x={x(0)} y={y} width={x(r.sp) - x(0)} height={14} fill={G.grey} />
            <T x={x(r.sp) + 5} y={y + 11} size={12}>{p0(r.sp)}</T>
            <rect x={x(0)} y={y + 15} width={x(r.rev) - x(0)} height={14} fill={loses ? G.red : G.blue} />
            <T x={x(r.rev) + 5} y={y + 26} size={12} weight={700} fill={loses ? G.red : G.text}>{p0(r.rev)}</T>
          </g>
        );
      })}
    </svg>
  );

  return (
    <Slide id="t4" title="Paid social takes 38% of the ad budget and returns 7% of revenue" sub={`Rimu Outdoor Gear · September · ${n0(chSessions)} visits, ${n0(chOrders)} orders, $${n0(chRevenue)} revenue`} foot="Model answer · Team 4 · Rimu Outdoor Gear">
      <div className="row" style={{ gridTemplateColumns: '270px 1fr', height: 276 }}>
        <div className="headline">
          <p className="headline__lbl">Paid social’s share of September revenue</p>
          <p className="headline__num">{p0(social.rev)}</p>
          <p className="headline__txt">It took {p0(social.sp)} of the ad budget. Each $1 spent on paid social earned ${(channels[2][3] / channels[2][4]).toFixed(2)}.</p>
        </div>
        <Box title="Organic search and email earn far more than they cost; both paid channels earn less" sub="Each channel’s share of ad spend against its share of revenue">
          {clustered}
        </Box>
      </div>
      <div className="row" style={{ gridTemplateColumns: '1fr 1fr', flex: 1 }}>
        <Box title="Most shoppers leave after adding to the cart" sub="People at each step of the buying journey, and share of all visits">
          <div style={{ width: '100%' }}>
            <HBars
              w={580} top={0} labelW={120} right={150} pitch={30} bar={18} size={12} max={184000} ticks={[0, 46000, 92000, 138000, 184000]} tick={v => (v === 0 ? '0' : `${n0(v / 1000)}k`)}
              rows={funnel.map(([, v], i) => ({ label: names[i], value: v, color: i === 4 ? G.blue : G.blueLight, text: `${n0(v)}  (${i ? p1(v / funnel[0][1]) : '100%'})` }))}
            />
            <p className="note" style={{ fontSize: 13, color: G.red, fontWeight: 700 }}>{p0(leak)} of carts never become orders: {n0(funnel[2][1])} added, {n0(chOrders)} bought.</p>
          </div>
        </Box>
        <Box title="Revenue peaks in December and July" sub="Revenue per month, last 12 months. February is the low">
          <Lines
            w={580} h={178} left={46} top={14} labels={rimuMonths.map(([m]) => m.slice(0, 3))} ymin={400000} ymax={1000000}
            ticks={[400000, 600000, 800000, 1000000]} tick={v => (v === 1000000 ? '$1M' : `$${v / 1000}k`)}
            series={[{ values: rimuMonths.map(([, v]) => v), color: G.blue }]}
            marks={[
              { i: rimuMonths.findIndex(([m]) => m === 'Dec'), text: k0(904200), dy: -9 },
              { i: rimuMonths.findIndex(([m]) => m === 'Jul'), text: k0(868900), dy: -9 },
              { i: rimuMonths.findIndex(([m]) => m === 'Feb'), text: k0(523800), dy: 18, color: G.red },
              { i: 11, text: k0(chRevenue), dy: -9 },
            ]}
          />
        </Box>
      </div>
    </Slide>
  );
}

// ═══ Team 5 · Tūī Valley Council · phone 390 wide ═════════════════════════

function Team5() {
  const diverted = wasteDiverted / wasteTotal;
  const goal = 0.6;
  const W = 358;
  const first = diversionYears[0][1];
  const last = diversionYears[diversionYears.length - 1][1];
  const ranked = [...suburbs].sort((a, b) => b[2] - a[2]);
  const avg = diverted * 100;
  const mine = 'Parkside';
  const parts = [
    { n: 'Rubbish to landfill', t: waste[0][1], fill: G.grey },
    { n: 'Recycling', t: waste[1][1], fill: G.blueDark },
    { n: 'Green waste', t: waste[3][1], fill: G.blue },
    { n: 'Food scraps', t: waste[2][1], fill: G.blueLight },
  ];
  let acc = 0;
  const mistake = (n: string) => n.replace('Food-soiled items such as pizza boxes', 'Greasy food packaging').replace('Soft plastics and plastic bags', 'Soft plastics and bags');

  return (
    <Slide id="t5" title="How is the valley doing with waste?" sub="Tūī Valley Council · waste and recycling" foot="Model answer · Team 5 · Tūī Valley Council">
      <div>
        <p className="phone-big">{(diverted * 100).toFixed(0)}%</p>
        <p className="phone-line">of our waste stays out of landfill. We need about {Math.round((goal - diverted) * 100)} more points to reach our goal of 60% by 2030.</p>
        <svg viewBox={`0 0 ${W} 58`} width="100%" style={{ marginTop: 10 }}>
          <rect x={0} y={20} width={W} height={18} fill={G.grid} />
          <rect x={0} y={20} width={W * diverted} height={18} fill={G.blue} />
          <line x1={W * goal} x2={W * goal} y1={14} y2={44} stroke={G.text} strokeWidth={2} />
          <T x={W * goal} y={10} size={13} weight={700} anchor="middle">Goal 60% by 2030</T>
          <T x={0} y={56} size={12} fill={G.sub}>0%</T>
          <T x={W} y={56} size={12} fill={G.sub} anchor="end">100%</T>
        </svg>
        <p className="phone-line" style={{ fontSize: 14, color: G.sub, marginTop: 4 }}>Last year we collected {n0(wasteTotal)} tonnes. {n0(wasteDiverted)} tonnes did not go to landfill.</p>
      </div>

      <Box title="We are getting better every year" sub={`Up ${Math.round(last - first)} points since 2019`}>
        <Lines
          w={W} h={170} size={13} left={40} right={12} top={12} labels={diversionYears.map(([y]) => y)} labelEvery={2}
          ymin={30} ymax={60} ticks={[30, 40, 50, 60]} tick={v => `${v}%`}
          series={[{ values: diversionYears.map(([, v]) => v), color: G.blue }]} refs={[{ value: 60, label: 'Goal 60%' }]}
          marks={[{ i: 0, text: `${first.toFixed(0)}%`, dy: -10 }, { i: diversionYears.length - 1, text: `${last.toFixed(0)}%`, dy: -10 }]}
        />
      </Box>

      <Box title="Where our waste went last year" sub={`${n0(wasteTotal)} tonnes in total`}>
        <div style={{ width: '100%' }}>
          <svg viewBox={`0 0 ${W} 28`} width="100%">
            {parts.map(p => {
              const x = (acc / wasteTotal) * W;
              const w = (p.t / wasteTotal) * W;
              acc += p.t;
              return <rect key={p.n} x={x} y={0} width={w} height={28} fill={p.fill} stroke="#fff" strokeWidth={1} />;
            })}
          </svg>
          <ul style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 7, fontSize: 15 }}>
            {parts.map(p => (
              <li key={p.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i style={{ width: 13, height: 13, background: p.fill, flex: 'none' }} />
                <span style={{ flex: 1 }}>{p.n}</span>
                <b style={{ width: 40, textAlign: 'right' }}>{p0(p.t / wasteTotal)}</b>
                <span style={{ width: 72, textAlign: 'right', color: G.sub }}>{n0(p.t)} t</span>
              </li>
            ))}
          </ul>
        </div>
      </Box>

      <Box title="How does your suburb compare?" sub="Share of waste kept out of landfill, best first">
        <div style={{ width: '100%' }}>
          <div className="select"><span>My suburb</span><span>{mine} ▼</span></div>
          <ul className="suburbs" style={{ marginTop: 8 }}>
            {ranked.map(([name, , d]) => (
              <li key={name} className={name === mine ? 'you' : ''}>
                <span className="nm">{name}{name === mine && <em>You are here</em>}</span>
                <svg viewBox="0 0 150 16" width={134} height={14} style={{ flex: 'none' }}>
                  <rect x={0} y={1} width={(150 * d) / 60} height={14} fill={d >= avg ? G.blue : G.grey} />
                  <line x1={(150 * avg) / 60} x2={(150 * avg) / 60} y1={0} y2={16} stroke={G.text} strokeWidth={1.5} strokeDasharray="3 2" />
                </svg>
                <span className="pc">{d}%</span>
                <span className="ar" style={{ color: d >= avg ? G.blueDark : G.sub }}>{d >= avg ? '▲' : '▼'}</span>
              </li>
            ))}
          </ul>
          <p className="note" style={{ fontSize: 13 }}>Dashed line: valley average, {avg.toFixed(0)}%. ▲ above it, ▼ below it.</p>
        </div>
      </Box>

      <Box title="The most common recycling mistake" sub="Soft plastics and bags are in 28% of bins with the wrong items">
        <div style={{ width: '100%' }}>
          <HBars
            w={W} top={0} labelW={148} right={40} pitch={30} bar={16} size={13} max={30} ticks={[0, 10, 20, 30]} tick={v => `${v}%`}
            rows={contaminants.slice(0, 5).map(([n, v], i) => ({ label: mistake(n), value: v, color: i === 0 ? G.red : G.blueLight, text: `${v}%` }))}
          />
          <p className="todo"><b>Do this:</b> keep soft plastics and bags out of your recycling bin. Put them in your rubbish instead.</p>
        </div>
      </Box>
    </Slide>
  );
}

// ── The document ─────────────────────────────────────────────────────────

export function modelDoc(): { html: string } {
  const html = '<!doctype html>' + renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>MBI806B Dashboard Design Studio: model answers</title>
        {/* build.mjs swaps this for model.css. */}
        <style>{'/*CSS*/'}</style>
      </head>
      <body>
        <Team1 />
        <Team2 />
        <Team3 />
        <Team4 />
        <Team5 />
      </body>
    </html>,
  );
  return { html };
}
