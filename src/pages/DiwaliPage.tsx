import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Music2, Receipt, Share2, User, VolumeX } from 'lucide-react';
import Sky, { sky } from '../components/public/diwali/Sky';
import { audio } from '../components/public/diwali/audio';
import { Diya, Divider, Lantern, Rangoli, Sweet, Toran } from '../components/public/diwali/Art';
import { PAINTS } from '../components/public/diwali/geometry';
import Activity, { FINAL, MiniTable, SweetBox } from '../components/public/diwali/Activity';
import { GREETINGS, TAMASO } from '../components/public/diwali/greetings';
import { cardBlob, cardFileName, drawCard } from '../components/public/diwali/card';
import '../styles/diwali.css';

// ─── /diwali — MBI802, a Diwali wish with a normalisation activity ────────
// Deliberately unlike every other page on the site: no Blend frame, a night
// sky instead of paper, and sound. A diya at the door has to be tapped first
// (browsers only allow sound after a tap); the doors open, a row of diyas
// lights up note by note and the music starts.
//
// Then: greetings in fourteen languages, one small activity that takes a
// sweet shop's order sheet through 1NF, 2NF and 3NF (each step lights a
// diya), a fireworks finale, a personal Diwali card the student can save or
// share, and a letter from the lecturer. Tap the sky anywhere for a firework.
//
// Pieces live in src/components/public/diwali/; styles are scoped `dw-` in
// src/styles/diwali.css. Nothing is stored and nothing is sent anywhere.

const FONTS =
  'https://fonts.googleapis.com/css2?family=Rozha+One&family=Yatra+One&family=Kalam:wght@400;700' +
  '&family=Arima:wght@600&family=Noto+Serif+Sinhala:wght@600&family=Noto+Serif+Telugu:wght@600' +
  '&family=Noto+Serif+Kannada:wght@600&family=Noto+Serif+Bengali:wght@600&family=Noto+Serif+Gujarati:wght@600' +
  '&family=Noto+Serif+Gurmukhi:wght@600&family=Noto+Serif+Oriya:wght@600&family=Noto+Nastaliq+Urdu:wght@600' +
  '&display=swap';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── The door ─────────────────────────────────────────────────────────────
function Gate({ onEnter }: { onEnter: (sound: boolean) => void }) {
  const [lit, setLit] = useState(false);
  const [open, setOpen] = useState(false);

  const go = (sound: boolean) => {
    if (lit) return;
    audio.init();
    if (!sound) audio.setMuted(true);
    audio.ignite();
    setLit(true);
    window.setTimeout(() => audio.bell(), 380);
    window.setTimeout(() => {
      setOpen(true);
      onEnter(sound);
    }, 1000);
  };

  return (
    <div className={`dw-gate ${lit ? 'is-lit' : ''} ${open ? 'is-open' : ''}`}>
      <div className="dw-door dw-door--l" aria-hidden="true">
        <Rangoli size="min(92vw, 560px)" bloom={false} className="dw-door__rangoli" />
      </div>
      <div className="dw-door dw-door--r" aria-hidden="true">
        <Rangoli size="min(92vw, 560px)" bloom={false} className="dw-door__rangoli" />
      </div>
      <Toran className="dw-gate__toran" />
      <div className="dw-gate__center">
        <p className="dw-gate__hi dw-f-deva" lang="hi">शुभ दीपावली</p>
        <button type="button" className="dw-gate__diya" onClick={() => go(true)} aria-label="Light the diya and come in">
          <Diya lit={lit} paint="gold" size={150} />
        </button>
        <p className="dw-gate__tap">{lit ? 'Welcome' : 'Tap the diya to light it'}</p>
        {!lit && (
          <>
            <p className="dw-gate__note">
              <Music2 size={14} aria-hidden="true" /> This page has music. Turn your sound on.
            </p>
            <button type="button" className="dw-link" onClick={() => go(false)}>
              Come in quietly, without sound
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Sound switch ─────────────────────────────────────────────────────────
function SoundToggle() {
  const [muted, setMuted] = useState(audio.muted);
  useEffect(() => audio.subscribe((s) => setMuted(s.muted)), []);
  const toggle = () => {
    audio.init();
    if (muted) {
      audio.setMuted(false);
      audio.startMusic();
    } else audio.setMuted(true);
  };
  return (
    <button type="button" className="dw-sound" onClick={toggle} aria-pressed={!muted}>
      {muted ? <VolumeX size={16} aria-hidden="true" /> : <Music2 size={16} aria-hidden="true" />}
      <span>{muted ? 'Sound off' : 'Music on'}</span>
      {!muted && (
        <span className="dw-sound__bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </button>
  );
}

// ── Greetings that change language ───────────────────────────────────────
function GreetingCycler() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % GREETINGS.length), 3200);
    return () => window.clearInterval(t);
  }, [paused]);
  const g = GREETINGS[i];
  const next = () => {
    audio.chime(i % 10);
    setPaused(true);
    setI((n) => (n + 1) % GREETINGS.length);
    window.setTimeout(() => setPaused(false), 6000);
  };
  return (
    <button type="button" className="dw-cycler" onClick={next} aria-label="Show the greeting in another language">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="dw-cycler__inner"
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          transition={{ duration: 0.5 }}
        >
          <span className={`dw-cycler__text dw-f-${g.font}`} dir={g.rtl ? 'rtl' : undefined} lang={g.code}>
            {g.text}
          </span>
          <span className="dw-cycler__meta">
            <b>{g.lang}</b> · {g.say} · <i>{g.means}</i>
          </span>
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

// ── A row of diyas that light one after another ──────────────────────────
function DiyaRow({ go, count = 9 }: { go: boolean; count?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    if (reducedMotion()) {
      setN(count);
      return;
    }
    const timers: number[] = [];
    for (let k = 0; k < count; k++) {
      timers.push(
        window.setTimeout(() => {
          setN(k + 1);
          audio.chime(k);
        }, 500 + k * 230),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [go, count]);
  return (
    <div className="dw-diyarow" aria-hidden="true">
      {Array.from({ length: count }, (_, k) => (
        <Diya
          key={k}
          lit={k < n}
          paint={PAINTS[k % PAINTS.length]}
          size={56}
          className="dw-bob"
          style={{ animationDelay: `${(k % 5) * -0.7}s` }}
        />
      ))}
    </div>
  );
}

// ── Wishes wall: tap to light each one ───────────────────────────────────
function Wishes() {
  const [lit, setLit] = useState<boolean[]>(() => GREETINGS.map(() => false));
  const count = lit.filter(Boolean).length;
  const all = count === GREETINGS.length;
  const tap = (i: number, el: HTMLElement) => {
    audio.init();
    audio.chime(i);
    const r = el.getBoundingClientRect();
    sky.burst(r.left + r.width / 2, r.top + 24, { size: 0.35, kind: 'ring' });
    if (lit[i]) return;
    const next = lit.map((v, k) => (k === i ? true : v));
    setLit(next);
    if (next.every(Boolean)) {
      window.setTimeout(() => {
        audio.bell();
        sky.show(3);
      }, 300);
    }
  };
  return (
    <>
      <div className="dw-wishes">
        {GREETINGS.map((g, i) => (
          <button
            key={g.lang + g.text}
            type="button"
            className={`dw-wish ${lit[i] ? 'is-lit' : ''}`}
            onClick={(e) => tap(i, e.currentTarget)}
          >
            <Diya lit={lit[i]} paint={PAINTS[i % PAINTS.length]} size={40} className="dw-wish__diya" />
            <span className={`dw-wish__text dw-f-${g.font}`} dir={g.rtl ? 'rtl' : undefined} lang={g.code}>
              {g.text}
            </span>
            <span className="dw-wish__lang">{g.lang}</span>
            <span className="dw-wish__say">{g.say}</span>
            <span className="dw-wish__means">{g.means}</span>
          </button>
        ))}
      </div>
      <p className="dw-wishes__count" aria-live="polite">
        {all ? `All ${GREETINGS.length} lit. You just wished Diwali in ${GREETINGS.length} languages!` : `${count} of ${GREETINGS.length} lit`}
      </p>
    </>
  );
}

// ── The personal card ────────────────────────────────────────────────────
function CardMaker() {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (canvas.current) void drawCard(canvas.current, name);
    }, 250);
    return () => window.clearTimeout(t);
  }, [name]);

  useEffect(() => {
    try {
      const probe = new File([new Blob()], 'x.png', { type: 'image/png' });
      setCanShare(typeof navigator.canShare === 'function' && navigator.canShare({ files: [probe] }));
    } catch {
      setCanShare(false);
    }
  }, []);

  const save = async () => {
    if (!canvas.current) return;
    setBusy(true);
    await drawCard(canvas.current, name);
    const blob = await cardBlob(canvas.current);
    setBusy(false);
    if (!blob) return;
    audio.sparkle();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cardFileName(name);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const share = async () => {
    if (!canvas.current) return;
    setBusy(true);
    await drawCard(canvas.current, name);
    const blob = await cardBlob(canvas.current);
    setBusy(false);
    if (!blob) return;
    const file = new File([blob], cardFileName(name), { type: 'image/png' });
    try {
      await navigator.share({ files: [file], title: 'Happy Diwali', text: 'शुभ दीपावली! Happy Diwali ✨' });
    } catch {
      /* the person closed the share sheet */
    }
  };

  return (
    <div className="dw-cardmaker">
      <div className="dw-cardmaker__form">
        <h3 className="dw-h3">Your Diwali card</h3>
        <p>Type your name. The card is yours to keep or send to family.</p>
        <label className="dw-field">
          <span>Your first name</span>
          <input
            value={name}
            maxLength={28}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya"
            autoComplete="given-name"
          />
        </label>
        <div className="dw-cardmaker__btns">
          <button type="button" className="dw-btn" onClick={save} disabled={busy}>
            <Download size={16} aria-hidden="true" /> Save my card
          </button>
          {canShare && (
            <button type="button" className="dw-btn dw-btn--ghost" onClick={share} disabled={busy}>
              <Share2 size={16} aria-hidden="true" /> Share
            </button>
          )}
        </div>
        <p className="dw-small">Made on your device. Nothing is uploaded.</p>
      </div>
      <canvas ref={canvas} className="dw-cardmaker__canvas" role="img" aria-label={`A Diwali card for ${name || 'you'}`} />
    </div>
  );
}

// ── The finale ───────────────────────────────────────────────────────────
function Finale() {
  return (
    <motion.section
      id="finale"
      className="dw-sec dw-finale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Rangoli size="min(120vw, 820px)" className="dw-finale__rangoli" />
      <div className="dw-wrap">
        <p className="dw-eyebrow">All three diyas are lit</p>
        <h2 className="dw-finale__h">
          <span className="dw-f-deva dw-shimmer" lang="hi">बधाई हो!</span>
          <span className="dw-finale__say">Badhai ho! Congratulations!</span>
          <span className="dw-finale__en">Your sweet shop is spotless.</span>
        </h2>

        <div className="dw-final">
          <SweetBox title="Customers" tone="violet" icon={<User size={15} aria-hidden="true" />}>
            <MiniTable cols={['customer', 'phone']} rows={FINAL.customers} keys={['customer']} />
          </SweetBox>
          <SweetBox title="Orders" tone="pink" icon={<Receipt size={15} aria-hidden="true" />}>
            <MiniTable cols={['order', 'customer']} rows={FINAL.orders} keys={['order']} />
          </SweetBox>
          <SweetBox title="Order lines" tone="teal">
            <MiniTable cols={['order', 'sweet', 'boxes']} rows={FINAL.lines} keys={['order', 'sweet']} />
          </SweetBox>
          <SweetBox title="Sweets" tone="gold" icon={<Sweet name="Ladoo" size={16} />}>
            <MiniTable cols={['sweet', 'price']} rows={FINAL.sweets} keys={['sweet']} />
          </SweetBox>
        </div>

        <div className="dw-stats">
          <div>
            <span className="dw-stats__n">
              <s>3</s> → 1
            </span>
            places Priya&rsquo;s phone is written
          </div>
          <div>
            <span className="dw-stats__n">
              <s>2</s> → 1
            </span>
            places the Ladoo price is written
          </div>
        </div>
        <p className="dw-motto">One fact, one place. A clean home for your data, just in time for Diwali.</p>

        <Divider />
        <CardMaker />
      </div>
    </motion.section>
  );
}

// ── The page ─────────────────────────────────────────────────────────────
export default function DiwaliPage() {
  const [entered, setEntered] = useState(false);
  const [gateGone, setGateGone] = useState(false);
  const [done, setDone] = useState(false);
  const [front, setFront] = useState(false);

  useEffect(() => {
    if (!document.getElementById('dw-fonts')) {
      const l = document.createElement('link');
      l.id = 'dw-fonts';
      l.rel = 'stylesheet';
      l.href = FONTS;
      document.head.appendChild(l);
    }
    const prev = document.body.style.background;
    document.body.style.background = '#0c041e';
    return () => {
      document.body.style.background = prev;
      audio.dispose();
    };
  }, []);

  useEffect(() => {
    if (!entered || gateGone) return;
    const t = window.setTimeout(() => setGateGone(true), reducedMotion() ? 300 : 1700);
    return () => window.clearTimeout(t);
  }, [entered, gateGone]);

  const enter = (sound: boolean) => {
    setEntered(true);
    if (sound) window.setTimeout(() => audio.startMusic(), 2600);
    window.setTimeout(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sky.firework(w * 0.25, h * 0.28, { size: 0.9 });
      window.setTimeout(() => sky.firework(w * 0.75, h * 0.22, { size: 0.9 }), 500);
    }, 1400);
  };

  const onLight = useCallback((el: HTMLElement | null) => {
    audio.bell();
    window.setTimeout(() => audio.sparkle(), 120);
    if (el) {
      const r = el.getBoundingClientRect();
      sky.burst(r.left + r.width / 2, r.top + r.height * 0.3, { size: 0.5, palette: 0 });
    }
  }, []);

  const onComplete = () => {
    audio.bell(0.8);
    setDone(true);
    setFront(true);
    sky.show(7);
    window.setTimeout(() => setFront(false), 9000);
    window.setTimeout(() => document.getElementById('finale')?.scrollIntoView({ behavior: 'smooth' }), 400);
  };

  const onSky = (e: MouseEvent<HTMLDivElement>) => {
    if (!entered) return;
    const t = e.target as HTMLElement;
    if (t.closest('button, a, input, label, canvas, table, .dw-act__card, .dw-box, .dw-letter, .dw-cardmaker')) return;
    audio.init();
    sky.firework(e.clientX, Math.min(e.clientY, window.innerHeight * 0.8));
  };

  return (
    <div className={`dw ${front ? 'dw--front' : ''}`} onClick={onSky}>
      <Sky />
      {!gateGone && <Gate onEnter={enter} />}
      {entered && <SoundToggle />}
      <Link to="/mbi802" className="dw-back">
        ← MBI802
      </Link>

      {/* Hero */}
      <header className="dw-hero">
        <Toran className="dw-hero__toran" />
        <div className="dw-hero__lanterns" aria-hidden="true">
          <Lantern color="#e0218a" string={40} className="dw-l1" />
          <Lantern color="#ff8c1a" string={110} className="dw-l2" />
          <Lantern color="#0fb5ae" string={70} className="dw-l3" />
          <Lantern color="#8e44ff" string={20} className="dw-l4" />
        </div>
        <Rangoli size="min(140vw, 760px)" className="dw-hero__rangoli" bloom={entered} />
        <div className="dw-hero__inner">
          <p className="dw-eyebrow">MBI802 · Database Management Systems · Diwali 2026</p>
          <h1 className="dw-hero__h">
            <span className="dw-hero__hi dw-f-deva dw-shimmer" lang="hi">शुभ दीपावली</span>
            <span className="dw-hero__en">Happy Diwali</span>
          </h1>
          <GreetingCycler />
          <p className="dw-hero__lede">
            To every one of my students: may the festival of lights fill your home with warmth, your plate with sweets,
            and your year with good news.
          </p>
          <div className="dw-hero__cta">
            <a href="#activity" className="dw-btn dw-btn--glow" onClick={(e) => { e.preventDefault(); document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Light the three diyas ↓
            </a>
            <span className="dw-hero__tip">Psst: tap the sky anywhere for a firework.</span>
          </div>
        </div>
        <DiyaRow go={entered} />
      </header>

      {/* The idea */}
      <section className="dw-sec dw-story">
        <div className="dw-wrap dw-wrap--narrow">
          <Divider />
          <p className="dw-story__p">
            Before Diwali, every home gets a <b>deep clean</b>. Everything goes back in <b>its own place</b>, ready for
            the lights.
          </p>
          <p className="dw-story__p dw-story__p--small">
            Let&rsquo;s do the same for a sweet shop&rsquo;s messy order sheet. Three small steps. Three diyas to light.
          </p>
        </div>
      </section>

      {/* Activity */}
      <section id="activity" className="dw-sec dw-act">
        <div className="dw-wrap">
          <p className="dw-eyebrow">The activity · about 3 minutes</p>
          <h2 className="dw-h2">
            The sweet shop&rsquo;s <span className="dw-gold">Diwali rush</span>
          </h2>
          <p className="dw-sub">
            Ladoo, barfi and jalebi orders are pouring in, all on one messy sheet. Tidy it up, one diya at a time.
          </p>
          <Activity onLight={onLight} onComplete={onComplete} />
        </div>
      </section>

      <AnimatePresence>{done && <Finale />}</AnimatePresence>

      {/* Wishes */}
      <section className="dw-sec dw-wishsec">
        <div className="dw-wrap">
          <p className="dw-eyebrow">One festival, many languages</p>
          <h2 className="dw-h2">
            Say it the way <span className="dw-gold">your family</span> says it
          </h2>
          <p className="dw-sub">Tap each wish to light its diya.</p>
          <Wishes />
        </div>
      </section>

      {/* Letter */}
      <section className="dw-sec">
        <div className="dw-wrap dw-wrap--narrow">
          <article className="dw-letter">
            <Diya paint="gold" size={54} className="dw-letter__diya" />
            <p className="dw-letter__hi">Dear students,</p>
            <p>
              Diwali celebrates light winning over darkness, and knowledge winning over confusion. Honestly, that&rsquo;s
              not a bad motto for a database class either.
            </p>
            <p>
              Thank you for the curiosity and the energy you bring to every class. Take a proper break, eat too many
              sweets, call the people you love, and enjoy the fireworks (from a safe distance!).
            </p>
            <p>Wishing you and your families a joyful, safe and bright Diwali.</p>
            <p className="dw-letter__sign">
              — Yasas
              <span>Your MBI802 lecturer</span>
            </p>
          </article>
        </div>
      </section>

      {/* River */}
      <footer className="dw-river">
        <p className="dw-river__q">
          <span className="dw-f-deva dw-shimmer" lang="sa">{TAMASO.text}</span>
          <span className="dw-river__say">
            {TAMASO.say} · <i>{TAMASO.means}</i>
          </span>
        </p>
        <div className="dw-river__water" aria-hidden="true">
          {[8, 22, 38, 55, 70, 86].map((left, i) => (
            <div key={left} className="dw-float" style={{ left: `${left}%`, animationDelay: `${i * -1.3}s` }}>
              <Diya paint={PAINTS[(i + 2) % PAINTS.length]} size={i % 2 ? 46 : 58} />
              <Diya paint={PAINTS[(i + 2) % PAINTS.length]} size={i % 2 ? 46 : 58} className="dw-float__reflect" />
            </div>
          ))}
          <div className="dw-river__waves" />
        </div>
        <p className="dw-river__foot">
          <Link to="/mbi802">Back to MBI802</Link> · Made with light for my students · Yasas Sri Wickramasinghe
        </p>
      </footer>
    </div>
  );
}
