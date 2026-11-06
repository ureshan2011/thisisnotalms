// ─── The Diwali page's sound, made in the browser ─────────────────────────
// No audio files. Everything is synthesised with the Web Audio API, so the
// page costs nothing extra to download and works offline once loaded.
//
// Music: a tanpura drone (Sa and Pa plucked in a cycle), a santoor-like
// melody in Raag Bhupali (Sa Re Ga Pa Dha, a pentatonic scale that never
// sounds wrong), and a soft tabla in keherwa, an eight-beat folk cycle.
// Effects: a temple bell, sparkles, a match strike, firework whoosh, boom
// and crackle, and a gentle "not quite" for wrong answers.
//
// Browsers only allow sound after a tap, so nothing is created until init()
// runs inside one. Everything is quiet by design: the music bus sits low.

type AC = AudioContext;

const SA = 293.66; // D4, the tonic for the melody
const hz = (semi: number) => SA * 2 ** (semi / 12);

const BPM = 84;
const EIGHTH = 60 / BPM / 2;

// Bhupali phrases, one token per eighth note. S R G P D are Sa Re Ga Pa Dha;
// ' raises an octave, , lowers one, - is a rest.
const PHRASES = [
  "S R G - P - G R S - D, - S - - -",
  "G - P D - S' - D P G R G - - - -",
  "S' - D P G - P D S' R' S' - D P G -",
  "G P D S' D P G R G R S D, S - - -",
  "P - G R G P D P G - R - S R G -",
  "D, S R G - R G P D P G R S - - -",
];
const DEG: Record<string, number> = { S: 0, R: 2, G: 4, P: 7, D: 9 };

function parsePhrase(p: string): (number | null)[] {
  return p.split(/\s+/).map((tok) => {
    if (tok === '-') return null;
    let semi = DEG[tok[0]];
    if (tok.includes("'")) semi += 12;
    if (tok.includes(',')) semi -= 12;
    return semi;
  });
}
const MELODY = PHRASES.map(parsePhrase);

// Keherwa on eighth notes: Dha Ge Na Ti | Na Ka Dhi Na
const KEHERWA = ['dha', 'ge', 'na', 'ti', 'na', 'ka', 'dhi', 'na'] as const;

// Tanpura: Pa (low), Sa, Sa, Sa (lower octave), one pluck per quarter note.
const TANPURA = [SA / 2 * 2 ** (-5 / 12), SA / 2, SA / 2, SA / 4];

function makeImpulse(ctx: AC, seconds: number, decay: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay;
  }
  return buf;
}

function makeNoise(ctx: AC, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

type Listener = (state: { muted: boolean; started: boolean }) => void;

class DiwaliAudio {
  private ctx: AC | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private reverb!: ConvolverNode;
  private noise!: AudioBuffer;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  private listeners = new Set<Listener>();

  muted = false;
  /** The visitor chose to hear music (the gate's main button). */
  wantsMusic = false;

  get started() {
    return this.ctx !== null;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    for (const fn of this.listeners) fn({ muted: this.muted, started: this.started });
  }

  /** Must be called from inside a tap or click. */
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 4;
    comp.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(comp);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = makeImpulse(ctx, 2.6, 2.4);
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    this.reverb.connect(wet).connect(this.master);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0;
    this.musicBus.connect(this.master);
    const musicSend = ctx.createGain();
    musicSend.gain.value = 0.55;
    this.musicBus.connect(musicSend).connect(this.reverb);

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.75;
    this.sfxBus.connect(this.master);
    const sfxSend = ctx.createGain();
    sfxSend.gain.value = 0.4;
    this.sfxBus.connect(sfxSend).connect(this.reverb);

    this.noise = makeNoise(ctx, 2);

    document.addEventListener('visibilitychange', this.onVisibility);
    this.emit();
  }

  private onVisibility = () => {
    if (!this.ctx) return;
    if (document.hidden) void this.ctx.suspend();
    else void this.ctx.resume();
  };

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(m ? 0 : 0.9, t, 0.08);
      if (m) this.stopMusic();
      else if (this.wantsMusic) this.startMusic();
    }
    this.emit();
  }

  startMusic() {
    this.wantsMusic = true;
    const ctx = this.ctx;
    if (!ctx || this.timer !== null || this.muted) return;
    this.nextTime = ctx.currentTime + 0.12;
    this.step = 0;
    const g = this.musicBus.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(0, ctx.currentTime);
    g.linearRampToValueAtTime(0.55, ctx.currentTime + 2.5);
    this.timer = window.setInterval(this.schedule, 40);
  }

  stopMusic() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      const g = this.musicBus.gain;
      g.cancelScheduledValues(this.ctx.currentTime);
      g.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
  }

  dispose() {
    this.stopMusic();
    document.removeEventListener('visibilitychange', this.onVisibility);
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
    this.wantsMusic = false;
    this.emit();
  }

  // ── The music scheduler ──────────────────────────────────────────────
  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextTime < ctx.currentTime + 0.3) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += EIGHTH;
      this.step++;
    }
  };

  private playStep(step: number, t: number) {
    const beat = step % 8;
    if (beat % 2 === 0) this.tanpura(t, TANPURA[beat / 2]);

    // Two bars of drone alone, then the melody comes in.
    if (step >= 16) {
      const phrase = MELODY[(Math.floor(step / 16) - 1) % MELODY.length];
      const semi = phrase[step % 16];
      if (semi !== null && semi !== undefined) {
        const next = phrase[(step % 16) + 1];
        const long = next === null || next === undefined;
        this.santoor(t, hz(semi), 0.9, long ? 1.8 : 1.1, this.musicBus);
        // Santoor players often strike a note twice, quickly.
        if (!long && Math.random() < 0.22) this.santoor(t + EIGHTH / 2, hz(semi), 0.45, 0.6, this.musicBus);
      }
    }

    // The tabla joins after four bars.
    if (step >= 32) this.tabla(t, KEHERWA[beat], beat === 0 ? 1 : 0.75);
  }

  // ── Instruments ──────────────────────────────────────────────────────
  private env(t: number, peak: number, attack: number, decay: number): GainNode {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    return g;
  }

  private osc(type: OscillatorType, f: number, t: number, stop: number, dest: AudioNode, detune = 0) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    o.detune.value = detune;
    o.connect(dest);
    o.start(t);
    o.stop(stop);
    return o;
  }

  private santoor(t: number, f: number, vel: number, dur: number, bus: AudioNode) {
    const g = this.env(t, 0.16 * vel, 0.004, dur);
    g.connect(bus);
    this.osc('triangle', f, t, t + dur + 0.1, g);
    this.osc('triangle', f, t, t + dur + 0.1, g, 7);
    const bright = this.env(t, 0.05 * vel, 0.002, dur * 0.35);
    bright.connect(bus);
    this.osc('sine', f * 3, t, t + dur * 0.4, bright);
    this.osc('sine', f * 4.02, t, t + dur * 0.3, bright);
  }

  private tanpura(t: number, f: number) {
    const ctx = this.ctx!;
    const dur = 4.2;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.Q.value = 2;
    lp.frequency.setValueAtTime(2400, t);
    lp.frequency.exponentialRampToValueAtTime(500, t + dur);
    const g = this.env(t, 0.05, 0.03, dur);
    lp.connect(g).connect(this.musicBus);
    this.osc('sawtooth', f, t, t + dur + 0.1, lp);
    this.osc('sawtooth', f, t, t + dur + 0.1, lp, 4);
  }

  private noiseHit(t: number, dur: number, peak: number, type: BiquadFilterType, freq: number, dest: AudioNode, q = 1) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.env(t, peak, 0.002, dur);
    src.connect(f).connect(g).connect(dest);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
    return { src, f, g };
  }

  private bayan(t: number, vel: number) {
    const ctx = this.ctx!;
    const g = this.env(t, 0.3 * vel, 0.005, 0.45);
    g.connect(this.musicBus);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(72, t + 0.3);
    o.connect(g);
    o.start(t);
    o.stop(t + 0.55);
  }

  private dayan(t: number, vel: number, ring: number) {
    const g = this.env(t, 0.22 * vel, 0.002, ring);
    g.connect(this.musicBus);
    this.osc('sine', SA * 2, t, t + ring + 0.05, g);
    this.osc('sine', SA * 2 * 2.01, t, t + ring * 0.6, g);
    this.noiseHit(t, 0.02, 0.08 * vel, 'highpass', 3000, this.musicBus);
  }

  private tabla(t: number, bol: (typeof KEHERWA)[number], vel: number) {
    switch (bol) {
      case 'dha':
        this.bayan(t, vel);
        this.dayan(t, vel, 0.35);
        break;
      case 'ge':
        this.bayan(t, vel * 0.8);
        break;
      case 'na':
        this.dayan(t, vel * 0.85, 0.3);
        break;
      case 'ti':
        this.dayan(t, vel * 0.6, 0.07);
        break;
      case 'ka':
        this.noiseHit(t, 0.06, 0.18 * vel, 'lowpass', 600, this.musicBus);
        break;
      case 'dhi':
        this.bayan(t, vel * 0.9);
        this.dayan(t, vel * 0.7, 0.1);
        break;
    }
  }

  // ── Effects (public) ─────────────────────────────────────────────────
  private ready() {
    return this.ctx !== null && !this.muted;
  }

  /** A temple bell: inharmonic partials with long, staggered decays. */
  bell(pitch = 1) {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime + 0.01;
    const base = 620 * pitch;
    const partials: [number, number, number][] = [
      [1, 0.18, 3.2],
      [2.32, 0.1, 2.2],
      [4.25, 0.06, 1.4],
      [6.63, 0.035, 0.9],
      [9.38, 0.02, 0.6],
    ];
    for (const [ratio, amp, dur] of partials) {
      const g = this.env(t, amp, 0.003, dur);
      g.connect(this.sfxBus);
      this.osc('sine', base * ratio, t, t + dur + 0.1, g, (Math.random() - 0.5) * 6);
    }
  }

  /** One high santoor note, for lighting diyas in a chain. */
  chime(i: number) {
    if (!this.ready()) return;
    const scale = [0, 2, 4, 7, 9];
    const semi = 12 + scale[i % 5] + 12 * Math.floor(i / 5);
    this.santoor(this.ctx!.currentTime + 0.01, hz(semi), 0.9, 1.4, this.sfxBus);
  }

  /** A quick rising run, for a right answer. */
  sparkle() {
    if (!this.ready()) return;
    const t0 = this.ctx!.currentTime + 0.01;
    [12, 16, 19, 21, 24, 28].forEach((s, i) => {
      this.santoor(t0 + i * 0.055, hz(s), 0.55, 0.7, this.sfxBus);
    });
  }

  /** Not wrong, just not yet: two soft falling notes. */
  softNo() {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime + 0.01;
    [7, 4].forEach((s, i) => {
      const g = this.env(t + i * 0.13, 0.09, 0.01, 0.35);
      g.connect(this.sfxBus);
      this.osc('sine', hz(s - 12), t + i * 0.13, t + i * 0.13 + 0.45, g);
    });
  }

  tap() {
    if (!this.ready()) return;
    this.santoor(this.ctx!.currentTime + 0.005, hz(24), 0.35, 0.25, this.sfxBus);
  }

  /** A match striking, then catching. */
  ignite() {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime + 0.01;
    this.noiseHit(t, 0.12, 0.35, 'highpass', 2500, this.sfxBus);
    this.noiseHit(t + 0.08, 0.7, 0.12, 'bandpass', 700, this.sfxBus, 0.6);
  }

  /** A rocket going up. `dur` should match the picture. */
  launch(dur: number) {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime + 0.01;
    const { f, g } = this.noiseHit(t, dur, 0.07, 'bandpass', 500, this.sfxBus, 4);
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(2600, t + dur);
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }

  /** The burst and its crackle. `size` 0–1. */
  boom(size = 1) {
    if (!this.ready()) return;
    const ctx = this.ctx!;
    const t = ctx.currentTime + 0.01;
    this.noiseHit(t, 1.1, 0.35 * size, 'lowpass', 900, this.sfxBus);
    const g = this.env(t, 0.35 * size, 0.004, 0.5);
    g.connect(this.sfxBus);
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.45);
    o.connect(g);
    o.start(t);
    o.stop(t + 0.6);
    const pops = Math.round(14 * size);
    for (let i = 0; i < pops; i++) {
      this.noiseHit(t + 0.35 + Math.random() * 1.1, 0.012, 0.12 + Math.random() * 0.1, 'highpass', 3500, this.sfxBus);
    }
  }
}

export const audio = new DiwaliAudio();
