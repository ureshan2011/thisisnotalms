import { useId, type ReactNode } from 'react';

// ─── Drawings for /local-beats-global ──────────────────────────────────────
// Every landmark is hand-built line art on one 400×260 canvas with the ground
// at y=240, so any of them can sit in a postcard, a card or the hero frieze.
// Colour comes only from the lm-* classes in blend.css (ink lines, paper
// fills, the page accent for one or two pieces), so the drawings follow the
// course accent and need no colours of their own.

type DrawProps = { sun?: boolean };

/** One landmark as a standalone SVG. */
export function Landmark({ draw: Draw, label, className = '' }: { draw: (p: DrawProps) => ReactNode; label: string; className?: string }) {
  return (
    <svg className={`lm ${className}`} viewBox="0 0 400 260" role="img" aria-label={label}>
      <Draw sun />
    </svg>
  );
}

const Ground = () => <path className="lm-g" d="M10 240 H390" />;
const waves = (y: number, from = 10, to = 390) => {
  let d = `M${from} ${y}`;
  for (let x = from; x < to; x += 20) d += ` q5 -5 10 0 t10 0`;
  return d;
};

// ── Germany · Brandenburg Gate ────────────────────────────────────────────
export function Brandenburg({ sun }: DrawProps) {
  const cols = [84, 128, 172, 228, 272, 316];
  return (
    <g>
      {sun && <circle className="lm-sun" cx="318" cy="64" r="40" />}
      <rect className="lm-f" x="26" y="186" width="44" height="54" />
      <path className="lm-f" d="M20 188 L48 168 L76 188 Z" />
      <rect className="lm-f" x="330" y="186" width="44" height="54" />
      <path className="lm-f" d="M324 188 L352 168 L380 188 Z" />
      <path className="lm-t" d="M42 240 v-22 q6 -9 12 0 v22 M346 240 v-22 q6 -9 12 0 v22" />
      <rect className="lm-f" x="70" y="230" width="260" height="10" />
      {cols.map(x => (
        <g key={x}>
          <rect className="lm-f" x={x - 7} y="128" width="14" height="102" />
          <path className="lm-t" d={`M${x - 2} 134 V226 M${x + 2} 134 V226`} />
          <rect className="lm-f" x={x - 10} y="122" width="20" height="6" />
        </g>
      ))}
      <rect className="lm-f" x="64" y="102" width="272" height="20" />
      <path className="lm-t" d={'M64 110 H336' + Array.from({ length: 22 }, (_, i) => ` M${72 + i * 12} 112 V122`).join('')} />
      <rect className="lm-f" x="102" y="86" width="196" height="16" />
      <rect className="lm-f" x="150" y="72" width="100" height="14" />
      <path className="lm-a" d="M158 72 L160 62 Q164 52 171 56 L174 63 L179 56 Q185 47 192 52 L194 62 L203 54 Q209 46 215 52 L216 62 L221 56 Q228 48 234 56 L236 63 L240 62 L242 72 Z" />
      <path className="lm-a" d="M196 60 L198 38 Q200 32 202 38 L204 60 Z" />
      <path className="lm-l" d="M198 42 Q186 34 184 46 M202 42 Q214 34 216 46 M206 58 L211 20" />
      <circle className="lm-l" cx="212" cy="15" r="5" />
      <Ground />
    </g>
  );
}

// ── UAE · Burj Khalifa ────────────────────────────────────────────────────
export function Burj({ sun }: DrawProps) {
  return (
    <g>
      {sun && <circle className="lm-sun" cx="108" cy="82" r="48" />}
      <path className="lm-s" d="M0 218 Q60 198 122 212 T246 206 T400 212 V240 H0 Z" />
      <rect className="lm-f" x="118" y="196" width="22" height="44" />
      <rect className="lm-f" x="146" y="208" width="16" height="32" />
      <rect className="lm-f" x="248" y="168" width="22" height="72" />
      <rect className="lm-f" x="276" y="190" width="18" height="50" />
      <path className="lm-f" d="M302 240 V170 Q306 150 326 148 V240 Z" />
      <path className="lm-t" d="M310 168 V236 M318 160 V236" />
      <path className="lm-f" d="M176 240 V196 H180 V160 H184 V128 H188 V100 H191 V76 H194 V56 H197 V40 L200 6 L203 40 V56 H206 V76 H210 V100 H214 V128 H218 V160 H222 V196 H226 V240 Z" />
      <path className="lm-s" d="M200 40 H203 V56 H206 V76 H210 V100 H214 V128 H218 V160 H222 V196 H226 V240 H200 Z" />
      <path className="lm-l" d="M176 240 V196 H180 V160 H184 V128 H188 V100 H191 V76 H194 V56 H197 V40 L200 6 L203 40 V56 H206 V76 H210 V100 H214 V128 H218 V160 H222 V196 H226 V240" />
      <path className="lm-t" d="M200 40 V240 M188 120 H212 M184 150 H216 M180 186 H222" />
      <Ground />
    </g>
  );
}

// ── India · Taj Mahal ─────────────────────────────────────────────────────
export function Taj({ sun }: DrawProps) {
  return (
    <g>
      {sun && <circle className="lm-sun" cx="322" cy="62" r="36" />}
      {[56, 344].map(x => (
        <g key={x}>
          <rect className="lm-f" x={x - 6} y="112" width="12" height="116" />
          <path className="lm-t" d={`M${x - 6} 150 H${x + 6} M${x - 6} 188 H${x + 6}`} />
          <rect className="lm-f" x={x - 9} y="106" width="18" height="6" />
          <path className="lm-f" d={`M${x - 8} 106 Q${x} 88 ${x + 8} 106 Z`} />
          <path className="lm-l" d={`M${x} 93 V84`} />
        </g>
      ))}
      <rect className="lm-f" x="40" y="228" width="320" height="12" />
      <path className="lm-f" d="M116 228 V166 L126 152 H274 L284 166 V228 Z" />
      <path className="lm-t" d="M132 228 V206 Q143 192 154 206 V228 M132 190 V178 Q143 166 154 178 V190 M246 228 V206 Q257 192 268 206 V228 M246 190 V178 Q257 166 268 178 V190" />
      {[140, 260].map(cx => (
        <g key={cx}>
          <rect className="lm-f" x={cx - 12} y="140" width="24" height="12" />
          <path className="lm-f" d={`M${cx - 13} 140 Q${cx} 116 ${cx + 13} 140 Z`} />
          <path className="lm-l" d={`M${cx} 124 V116`} />
        </g>
      ))}
      <rect className="lm-f" x="168" y="138" width="64" height="90" />
      <path className="lm-s" d="M180 228 V182 Q200 152 220 182 V228 Z" />
      <path className="lm-l" d="M180 228 V182 Q200 152 220 182 V228" />
      <rect className="lm-f" x="172" y="120" width="56" height="18" />
      <path className="lm-f" d="M170 120 C150 94 166 64 200 52 C234 64 250 94 230 120 Z" />
      <path className="lm-s" d="M200 52 C234 64 250 94 230 120 H212 C222 96 218 70 200 52 Z" />
      <path className="lm-l" d="M170 120 C150 94 166 64 200 52 C234 64 250 94 230 120 M200 52 V32" />
      <circle className="lm-a" cx="200" cy="38" r="3.5" />
      <Ground />
      <rect className="lm-s" x="186" y="243" width="28" height="17" />
    </g>
  );
}

// ── Sri Lanka · Sigiriya, with a tuk-tuk ──────────────────────────────────
export function Sigiriya({ sun }: DrawProps) {
  const rock = 'M120 240 C122 200 128 150 140 112 C146 88 154 70 172 64 L246 61 C264 64 272 82 278 104 C290 146 296 196 294 240';
  let trees = 'M10 240';
  for (let x = 10; x < 230; x += 22) trees += ` Q${x + 4} ${x % 44 ? 218 : 224} ${x + 11} ${x % 44 ? 222 : 226} Q${x + 18} ${x % 44 ? 214 : 220} ${x + 22} 228`;
  trees += ' V240 Z';
  return (
    <g>
      {sun && <circle className="lm-sun" cx="76" cy="70" r="38" />}
      <path className="lm-f" d={rock + ' Z'} />
      <path className="lm-s" d="M250 64 C266 70 272 86 278 106 C290 148 296 196 294 240 H258 C266 200 268 130 250 64 Z" />
      <path className="lm-l" d={rock} />
      <path className="lm-t" d="M146 96 Q206 88 272 94 M136 132 Q206 124 284 132 M128 170 Q206 160 290 170 M123 206 Q206 196 293 206 M196 240 L204 222 L196 206" />
      <path className="lm-l" d="M178 62 q5 -7 10 0 q5 -7 10 0 M224 61 q5 -7 10 0" />
      <path className="lm-fs" d={trees} />
      <path className="lm-l" d="M362 240 Q356 200 366 158" />
      <path className="lm-l" d="M366 158 q-20 -6 -30 6 M366 158 q-16 -16 -30 -12 M366 158 q4 -20 -6 -30 M366 158 q18 -14 30 -8 M366 158 q20 0 26 14" />
      <path className="lm-a" d="M232 226 L238 200 Q240 192 250 192 L254 226 Z" />
      <path className="lm-l" d="M244 192 L250 172" />
      <path className="lm-a" d="M246 176 Q248 162 262 162 H302 Q314 162 316 176 Z" />
      <path className="lm-a" d="M256 226 V200 H316 Q320 200 320 206 V226 Z" />
      <path className="lm-l" d="M314 176 V200 M262 200 V190 H290" />
      <circle className="lm-f" cx="244" cy="231" r="9" />
      <circle className="lm-f" cx="306" cy="231" r="9" />
      <circle className="lm-l" cx="244" cy="231" r="3" />
      <circle className="lm-l" cx="306" cy="231" r="3" />
      <Ground />
    </g>
  );
}

// ── Malaysia · Petronas Towers, with a motorbike ride ─────────────────────
function tower(cx: number) {
  return `M${cx - 26} 240 V120 H${cx - 22} V92 H${cx - 18} V70 H${cx - 13} V54 H${cx - 8} V42 H${cx - 3} L${cx} 8 L${cx + 3} 42 H${cx + 8} V54 H${cx + 13} V70 H${cx + 18} V92 H${cx + 22} V120 H${cx + 26} V240 Z`;
}
export function Petronas({ sun }: DrawProps) {
  return (
    <g>
      {sun && <circle className="lm-sun" cx="324" cy="62" r="36" />}
      {[150, 250].map(cx => (
        <g key={cx}>
          <path className="lm-f" d={tower(cx)} />
          <path className="lm-t" d={`M${cx} 236 V46 M${cx - 13} 236 V72 M${cx + 13} 236 V72` + Array.from({ length: 9 }, (_, i) => ` M${cx - 26} ${132 + i * 12} H${cx + 26}`).join('')} />
        </g>
      ))}
      <rect className="lm-a" x="176" y="146" width="48" height="8" />
      <path className="lm-l" d="M184 154 L200 174 L216 154" />
      <path className="lm-l" d="M352 240 Q348 208 356 180 M356 180 q-16 -4 -24 6 M356 180 q-12 -14 -24 -10 M356 180 q2 -16 -6 -24 M356 180 q14 -12 24 -6" />
      <path className="lm-a" d="M58 224 Q62 206 80 206 H92 L100 224 Z" />
      <path className="lm-l" d="M74 203 H94 M62 214 L56 190 L48 188" />
      <circle className="lm-a" cx="84" cy="174" r="8" />
      <path className="lm-l" d="M84 182 L88 204 L98 206 M86 190 L60 192" />
      <circle className="lm-f" cx="56" cy="231" r="9" />
      <circle className="lm-f" cx="102" cy="231" r="9" />
      <Ground />
    </g>
  );
}

// ── China · Temple of Heaven ──────────────────────────────────────────────
export function TempleOfHeaven({ sun }: DrawProps) {
  return (
    <g>
      {sun && <circle className="lm-sun" cx="320" cy="60" r="36" />}
      <path className="lm-cloud" d="M40 92 q4 -14 18 -10 q6 -12 20 -4 q14 -2 12 12 H42 Z M300 126 q4 -12 16 -8 q6 -10 18 -2 q12 0 10 10 H302 Z" />
      <rect className="lm-f" x="70" y="228" width="260" height="12" />
      <rect className="lm-f" x="92" y="216" width="216" height="12" />
      <rect className="lm-f" x="114" y="204" width="172" height="12" />
      <path className="lm-t" d={Array.from({ length: 21 }, (_, i) => `M${74 + i * 12.6} 228 v-5`).join(' ')} />
      <rect className="lm-f" x="150" y="172" width="100" height="32" />
      <path className="lm-t" d={Array.from({ length: 9 }, (_, i) => `M${160 + i * 10} 174 V202`).join(' ')} />
      <path className="lm-l" d="M190 204 V186 H210 V204" />
      <path className="lm-a" d="M116 174 Q150 168 156 152 H244 Q250 168 284 174 Q200 182 116 174 Z" />
      <rect className="lm-f" x="162" y="138" width="76" height="14" />
      <path className="lm-a" d="M134 140 Q164 134 170 118 H230 Q236 134 266 140 Q200 148 134 140 Z" />
      <rect className="lm-f" x="176" y="106" width="48" height="12" />
      <path className="lm-a" d="M150 108 Q176 100 190 74 Q196 64 200 62 Q204 64 210 74 Q224 100 250 108 Q200 116 150 108 Z" />
      <path className="lm-t lm-t--on" d="M170 158 L166 172 M200 156 V176 M230 158 L234 172 M184 124 L180 138 M216 124 L220 138 M200 72 V108" />
      <path className="lm-l" d="M200 62 V48" />
      <circle className="lm-f" cx="200" cy="43" r="5" />
      <Ground />
    </g>
  );
}

// ── Philippines · a jeepney ───────────────────────────────────────────────
export function Jeepney({ sun }: DrawProps) {
  return (
    <g>
      {sun && <circle className="lm-sun" cx="322" cy="60" r="34" />}
      <path className="lm-l" d="M38 240 Q32 196 44 150 M44 150 q-20 -4 -30 8 M44 150 q-14 -16 -30 -12 M44 150 q2 -20 -8 -30 M44 150 q18 -14 30 -6 M44 150 q20 2 24 16" />
      <path className="lm-l" d="M70 140 V126 H300 V140 M96 126 V140 M134 126 V140 M172 126 V140 M210 126 V140 M248 126 V140 M286 126 V140" />
      <path className="lm-f" d="M62 220 V150 Q62 140 72 140 H292 Q302 140 302 150 V220 Z" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} className="lm-win" x={72 + i * 37} y="152" width="28" height="26" rx="3" />)}
      <rect className="lm-a" x="62" y="188" width="240" height="9" />
      <path className="lm-t" d="M62 204 H302 M120 214 q10 -6 20 0 t20 0 t20 0 t20 0" />
      <path className="lm-f" d="M302 220 V168 H338 Q352 168 354 182 L358 220 Z" />
      <path className="lm-l" d="M302 168 L294 146" />
      <path className="lm-a" d="M318 168 L320 154 Q324 148 330 152 L334 158 L330 160 L328 168 Z" />
      <path className="lm-t" d="M352 186 V214 M346 186 V214" />
      <circle className="lm-a" cx="350" cy="178" r="4" />
      <path className="lm-l" d="M300 222 H364" />
      <circle className="lm-f" cx="110" cy="226" r="14" />
      <circle className="lm-f" cx="322" cy="226" r="14" />
      <circle className="lm-l" cx="110" cy="226" r="5" />
      <circle className="lm-l" cx="322" cy="226" r="5" />
      <Ground />
    </g>
  );
}

// ── Australia · Sydney Opera House ────────────────────────────────────────
function shellL(x0: number, x1: number, px: number, py: number) {
  return `M${x0} 214 Q${x0 - 6} ${py + 34} ${px} ${py} Q${x1 - 4} ${py + 44} ${x1} 214 Z`;
}
function shellR(x0: number, x1: number, px: number, py: number) {
  return `M${x0} 214 Q${x0 + 4} ${py + 44} ${px} ${py} Q${x1 + 6} ${py + 34} ${x1} 214 Z`;
}
export function OperaHouse({ sun }: DrawProps) {
  return (
    <g>
      {sun && <circle className="lm-sun" cx="326" cy="58" r="34" />}
      <path className="lm-t" d="M286 214 Q342 124 400 214 M298 196 Q342 140 390 196 M300 214 V196 M320 214 V170 M342 214 V156 M364 214 V166 M384 214 V188" />
      <path className="lm-f" d={shellR(196, 252, 246, 118)} />
      <path className="lm-s" d={shellL(150, 232, 160, 88)} />
      <path className="lm-l" d={shellL(150, 232, 160, 88)} />
      <path className="lm-f" d={shellL(118, 192, 126, 116)} />
      <path className="lm-f" d={shellL(92, 150, 96, 146)} />
      <path className="lm-t" d="M160 88 L190 214 M160 88 L210 214 M126 116 L152 214 M126 116 L170 214 M96 146 L118 214" />
      <path className="lm-f" d={shellL(244, 300, 250, 136)} />
      <path className="lm-f" d={shellL(226, 272, 230, 156)} />
      <path className="lm-t" d="M250 136 L274 214 M230 156 L250 214" />
      <path className="lm-f" d="M30 214 H330 L322 230 H38 Z" />
      <path className="lm-w" d={waves(240)} />
      <path className="lm-w" d={waves(252, 30, 370)} />
    </g>
  );
}

// ── New Zealand · Sky Tower and Rangitoto ─────────────────────────────────
export function SkyTower({ sun }: DrawProps) {
  return (
    <g>
      {sun && <circle className="lm-sun" cx="92" cy="66" r="34" />}
      <path className="lm-s" d="M0 226 C70 214 118 186 160 180 C202 186 250 214 320 226 Z" />
      <path className="lm-l" d="M0 226 C70 214 118 186 160 180 C202 186 250 214 320 226" />
      {[[216, 196, 18], [236, 206, 14], [292, 188, 20], [314, 202, 16], [334, 178, 22], [360, 198, 18]].map(([x, y, w]) => (
        <rect key={x} className="lm-f" x={x} y={y} width={w} height={226 - y} />
      ))}
      <path className="lm-f" d="M258 226 L264 150 H276 L282 226 Z" />
      <path className="lm-f" d="M265 150 L266 94 H274 L275 150 Z" />
      <path className="lm-f" d="M250 94 H290 L283 82 H257 Z" />
      <rect className="lm-a" x="255" y="72" width="30" height="10" rx="3" />
      <path className="lm-f" d="M259 72 L264 63 H276 L281 72 Z" />
      <path className="lm-l" d="M270 63 V12 M265 42 H275 M266 28 H274" />
      <path className="lm-g" d="M200 226 H392" />
      <path className="lm-f" d="M56 238 H104 L96 248 H64 Z" />
      <path className="lm-a" d="M80 236 V198 L100 234 Z" />
      <path className="lm-l" d="M78 236 V196" />
      <path className="lm-w" d={waves(234, 120, 390)} />
      <path className="lm-w" d={waves(250, 10, 390)} />
    </g>
  );
}

// ── Japan · a torii gate (used by a scenario card) ────────────────────────
export function Torii({ sun }: DrawProps) {
  return (
    <g>
      {sun && <circle className="lm-sun" cx="300" cy="64" r="36" />}
      <path className="lm-s" d="M20 240 L150 150 Q170 138 190 150 L320 240 Z" />
      <rect className="lm-a" x="128" y="108" width="14" height="132" />
      <rect className="lm-a" x="258" y="108" width="14" height="132" />
      <rect className="lm-a" x="112" y="126" width="176" height="10" />
      <rect className="lm-a" x="194" y="98" width="12" height="28" />
      <path className="lm-a" d="M92 82 Q200 96 308 82 L302 100 Q200 110 98 100 Z" />
      <Ground />
    </g>
  );
}

/** All nine stops standing on one horizon, for the hero. */
export function Frieze() {
  const parts = [Brandenburg, Burj, Taj, Sigiriya, Petronas, TempleOfHeaven, Jeepney, OperaHouse, SkyTower];
  const step = 330;
  return (
    <svg className="lm lbg-frieze" viewBox={`0 0 ${step * (parts.length - 1) + 400} 260`} role="img" aria-label="Nine landmarks in a row: Brandenburg Gate, Burj Khalifa, Taj Mahal, Sigiriya, the Petronas Towers, the Temple of Heaven, a jeepney, Sydney Opera House and the Sky Tower">
      <circle className="lm-sun" cx="1520" cy="74" r="64" />
      {parts.map((Draw, i) => (
        <svg key={i} x={i * step} y="0" width="400" height="260" viewBox="0 0 400 260">
          <Draw />
        </svg>
      ))}
      <path className="lm-g" d={`M0 240 H${step * (parts.length - 1) + 400}`} />
    </svg>
  );
}

// ── Six things that don't travel, as icons (64×64) ────────────────────────
export const LENS_ICONS: Record<string, ReactNode> = {
  Money: (
    <>
      <rect className="lm-f" x="6" y="14" width="40" height="24" rx="3" />
      <circle className="lm-l" cx="26" cy="26" r="6" />
      <ellipse className="lm-a" cx="46" cy="54" rx="12" ry="4" />
      <ellipse className="lm-a" cx="46" cy="47" rx="12" ry="4" />
      <ellipse className="lm-a" cx="46" cy="40" rx="12" ry="4" />
    </>
  ),
  Habits: (
    <>
      <path className="lm-t" d="M22 18 q-4 -5 0 -10 M30 18 q-4 -5 0 -10 M38 18 q-4 -5 0 -10" />
      <path className="lm-f" d="M14 24 H44 V38 Q44 50 29 50 Q14 50 14 38 Z" />
      <path className="lm-l" d="M44 28 Q54 28 54 36 Q54 42 44 42 M8 56 H52" />
      <rect className="lm-a" x="14" y="30" width="30" height="4" />
    </>
  ),
  Values: (
    <>
      <path className="lm-f" d="M6 8 H38 V30 H18 L10 38 V30 H6 Z" />
      <path className="lm-a" d="M26 26 H58 V48 H54 V56 L46 48 H26 Z" />
      <path className="lm-l" d="M14 18 H30 M14 23 H24" />
    </>
  ),
  Faith: (
    <>
      <circle className="lm-f" cx="32" cy="34" r="24" />
      <circle className="lm-t" cx="32" cy="34" r="16" />
      <path className="lm-a" d="M22 42 Q24 24 44 26 Q42 44 22 42 Z" />
      <path className="lm-l" d="M22 42 L38 30" />
    </>
  ),
  Trust: (
    <>
      <path className="lm-l" d="M22 28 V20 Q22 8 32 8 Q42 8 42 20 V28" />
      <rect className="lm-a" x="14" y="28" width="36" height="28" rx="4" />
      <circle className="lm-f" cx="32" cy="40" r="4" />
      <path className="lm-l" d="M32 44 V50" />
    </>
  ),
  Rules: (
    <>
      <path className="lm-f" d="M26 4 Q32 0 38 4 V18 H26 Z" />
      <rect className="lm-a" x="16" y="18" width="32" height="12" rx="2" />
      <rect className="lm-f" x="12" y="30" width="40" height="8" />
      <path className="lm-t lm-t--on" d="M10 50 H54 M16 57 H48" />
    </>
  ),
};

export function LensIcon({ name, size = 56 }: { name: string; size?: number }) {
  return (
    <svg className="lm lbg-icon" viewBox="0 0 64 64" style={{ width: size, height: size }} aria-hidden="true">
      {LENS_ICONS[name]}
    </svg>
  );
}

/** A round postmark with the place and year on its ring, and the wavy cancel lines. */
export function Postmark({ place, year }: { place: string; year: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="lbg-postmark" viewBox="0 0 170 90" aria-hidden="true">
      <defs>
        <path id={`pm${id}`} d="M45 45 m-29 0 a29 29 0 1 1 58 0 a29 29 0 1 1 -58 0" />
      </defs>
      <circle cx="45" cy="45" r="38" />
      <circle cx="45" cy="45" r="22" />
      <text className="lbg-postmark__ring">
        <textPath href={`#pm${id}`} startOffset="0">{`${place.toUpperCase()} · ${place.toUpperCase()} ·`}</textPath>
      </text>
      <text className="lbg-postmark__year" x="45" y="50" textAnchor="middle">{year}</text>
      <path d="M90 30 q8 -6 16 0 t16 0 t16 0 t16 0 M90 42 q8 -6 16 0 t16 0 t16 0 t16 0 M90 54 q8 -6 16 0 t16 0 t16 0 t16 0 M90 66 q8 -6 16 0 t16 0 t16 0 t16 0" />
    </svg>
  );
}

/** A perforated postage stamp. The holes are the page showing through. */
export function Stamp({ value, label, place, className = '' }: { value: string; label: string; place: string; className?: string }) {
  return (
    <div className={`lbg-stamp ${className}`}>
      <div className="lbg-stamp__inner">
        <span className="lbg-stamp__place">{place}</span>
        <b className="lbg-stamp__value bt-tnum">{value}</b>
        <span className="lbg-stamp__label">{label}</span>
      </div>
    </div>
  );
}

// ── The route ─────────────────────────────────────────────────────────────
// A plain equirectangular projection, no coastlines: longitude 0–180 east and
// latitude 60 north to 45 south. Only the stops and the grid are drawn, so
// the distances and the north–south spread are real.
const px = (lon: number) => 40 + lon * 5.4;
const py = (lat: number) => 20 + (60 - lat) * 4;

export type RouteStop = { n: number; name: string; lon: number; lat: number; place?: 'r' | 'l' | 't' | 'b' };

export function RouteMap({ stops }: { stops: RouteStop[] }) {
  const pts = stops.map(s => [px(s.lon), py(s.lat)] as const);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const len = Math.hypot(x1 - x0, y1 - y0) || 1;
    const bend = Math.min(60, len * 0.28);
    d += ` Q${mx + ((y1 - y0) / len) * bend} ${my - ((x1 - x0) / len) * bend} ${x1} ${y1}`;
  }
  const lons = [0, 30, 60, 90, 120, 150, 180];
  const lats = [60, 40, 20, 0, -20, -40];
  return (
    <svg className="lbg-route" viewBox="0 0 1060 440" role="img" aria-label={`The route: ${stops.map(s => s.name).join(', ')}`}>
      {lons.map(l => <path key={`o${l}`} className="lbg-route__grid" d={`M${px(l)} 20 V420`} />)}
      {lats.map(l => <path key={`a${l}`} className={`lbg-route__grid${l === 0 ? ' lbg-route__grid--eq' : ''}`} d={`M40 ${py(l)} H1012`} />)}
      <text className="lbg-route__tag" x="1008" y={py(0) - 8} textAnchor="end">EQUATOR</text>
      {lons.map(l => <text key={`t${l}`} className="lbg-route__tag" x={px(l) + 4} y="434">{l}°E</text>)}
      <path className="lbg-route__path" d={d} />
      {stops.map((s, i) => (
        <g key={s.n} className="lbg-route__stop">
          <circle cx={pts[i][0]} cy={pts[i][1]} r="17" />
          <text className="lbg-route__n" x={pts[i][0]} y={pts[i][1] + 5} textAnchor="middle">{s.n}</text>
          <text
            className="lbg-route__name"
            x={pts[i][0] + { r: 26, l: -26, t: 0, b: 0 }[s.place ?? 'r']}
            y={pts[i][1] + { r: 8, l: 8, t: -28, b: 44 }[s.place ?? 'r']}
            textAnchor={({ r: 'start', l: 'end', t: 'middle', b: 'middle' } as const)[s.place ?? 'r']}
          >
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
