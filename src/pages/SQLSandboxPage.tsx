import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Award, BookOpen, Flame, FileDown, GraduationCap, Swords, TerminalSquare, UserRound, Zap } from 'lucide-react';
import { CourseBrand } from '../components/blend';
import IdGate, { NameGate } from '../components/sqlsandbox/IdGate';
import LevelMap from '../components/sqlsandbox/LevelMap';
import LevelPlayer from '../components/sqlsandbox/LevelPlayer';
import { ChallengeList, ChallengePlayer } from '../components/sqlsandbox/Challenges';
import { Board, NotesTab, Playground } from '../components/sqlsandbox/Extras';
import CertificatesTab from '../components/sqlsandbox/CertificatesTab';
import { useProfile, type SyncState } from '../components/sqlsandbox/useProfile';
import { CHALLENGES } from '../lib/sqlSandbox/challenges';
import { LEVELS } from '../lib/sqlSandbox/levels';
import { forgetLocal, lastSynced, sheetEnabled, streak, totalXp } from '../lib/sqlSandbox/progress';
import { themeFor } from '../lib/sqlSandbox/themes';
import { loadSql } from '../lib/sqlSandbox/loadSql';
import { CERTIFICATES_ENABLED } from '../config/sqlSandbox';
import { report } from '../lib/sqlSandbox/activity';
import '../styles/blend.css';
import '../styles/sql-sandbox.css';

// ─── /sql-sandbox — MBI802, SQL in the browser ────────────────────────────
// No login and nothing to install. A student types their ID once per device;
// after that the browser remembers. Progress goes to the class Google Sheet
// when one is configured (src/config/sqlSandbox.ts).
//
// Four tabs: Learn (the beginner path), Challenges (for those who think they
// know it already), Playground (free practice) and Notes (PDF and cheat
// sheet). Which tab, level or challenge is open lives in the URL, so the
// phone's back button does what people expect.

type Tab = 'learn' | 'challenges' | 'play' | 'notes' | 'cert';

const ALL_TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: 'learn', label: 'Learn', icon: GraduationCap },
  { id: 'challenges', label: 'Challenges', icon: Swords },
  { id: 'play', label: 'Playground', icon: TerminalSquare },
  { id: 'cert', label: 'Certificate', icon: Award },
  { id: 'notes', label: 'Notes', icon: FileDown },
];

const TABS = ALL_TABS.filter(t => CERTIFICATES_ENABLED || t.id !== 'cert');

const SYNC_TEXT: Record<SyncState, string> = {
  local: 'Saved on this device',
  saving: 'Saving to the class sheet…',
  saved: 'Saved to the class sheet',
  offline: 'Saved on this device. Will sync when back online.',
};

export default function SQLSandboxPage() {
  const api = useProfile();
  const { profile } = api;
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'learn';
  const levelId = params.get('level');
  const chId = params.get('ch');
  const [menu, setMenu] = useState(false);
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Warm up the engine while the student reads the first screen.
  useEffect(() => {
    void loadSql().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menu]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab, levelId, chId]);

  const go = (next: Record<string, string>) => setParams(next);

  // Tell the TA screen where the student is when they're not inside a level
  // or a challenge (those report their own step).
  useEffect(() => {
    if (levelId || chId) return;
    const where = { learn: 'Levels map', challenges: 'Challenge list', play: 'Playground', notes: 'Notes', cert: 'Certificates' }[tab] ?? 'Levels map';
    report({ key: `tab:${tab}`, where });
  }, [tab, levelId, chId]);

  if (!profile) {
    return (
      <div className="bt sb">
        <Header />
        <IdGate onReady={api.start} />
      </div>
    );
  }

  if (!profile.name) {
    return (
      <div className="bt sb">
        <Header />
        <NameGate id={profile.id} onName={api.setName} />
      </div>
    );
  }

  const theme = themeFor(profile.id);
  const level = LEVELS.find(l => l.id === levelId);
  const ch = CHALLENGES.find(c => c.id === chId);
  const xp = totalXp(profile);
  const days = streak(profile);
  const synced = lastSynced();

  const switchId = () => {
    forgetLocal();
    api.setProfile(null);
    setMenu(false);
    setConfirmSwitch(false);
    setParams({});
  };

  return (
    <div className="bt sb">
      <Header>
        <div className="sb-stats">
          <span className={`sb-stat ${days > 0 ? 'is-hot' : ''}`} title={`${days}-day streak`}>
            <Flame size={15} fill={days > 0 ? 'currentColor' : 'none'} /> {days}
          </span>
          <span className="sb-stat" title="Experience points">
            <Zap size={15} fill="currentColor" /> {xp}
          </span>
          <div className="sb-me" ref={menuRef}>
            <button type="button" className="sb-stat sb-stat--btn" onClick={() => setMenu(m => !m)} aria-expanded={menu}>
              <UserRound size={15} /> {profile.id}
            </button>
            {menu && (
              <div className="sb-menu" role="dialog" aria-label="Your progress">
                <p>
                  Working as <strong>{profile.name}</strong> <span className="sb-muted">({profile.id})</span>
                </p>
                <p className="sb-muted">Your business: {theme.business}</p>
                <p className="sb-muted">
                  {SYNC_TEXT[api.sync]}
                  {api.sync === 'saved' && synced ? ` · ${new Date(synced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </p>
                {!sheetEnabled() && <p className="sb-muted">Progress stays on this device only.</p>}
                {confirmSwitch ? (
                  <div className="sb-menu__confirm">
                    <p>
                      {sheetEnabled()
                        ? 'This device forgets you. Your progress stays in the class sheet.'
                        : 'This deletes your progress on this device.'}
                    </p>
                    <button type="button" className="sb-tool sb-tool--danger" onClick={switchId}>
                      Yes, switch
                    </button>
                    <button type="button" className="sb-tool" onClick={() => setConfirmSwitch(false)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" className="sb-tool" onClick={() => setConfirmSwitch(true)}>
                    Not you? Use another ID
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Header>

      {!level && !ch && (
        <nav className="sb-nav" aria-label="Sections" style={{ ['--tabs' as string]: TABS.length }}>
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              className={`sb-nav__btn ${tab === t.id ? 'is-on' : ''}`}
              onClick={() => go({ tab: t.id })}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              <t.icon size={18} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}

      <main className="sb-main">
        {level ? (
          <LevelPlayer
            key={level.id}
            level={level}
            theme={theme}
            api={api}
            onExit={() => go({ tab: 'learn' })}
            onOpen={id => go({ tab: 'learn', level: id })}
          />
        ) : ch ? (
          <ChallengePlayer key={ch.id} ch={ch} api={api} onExit={() => go({ tab: 'challenges' })} />
        ) : tab === 'challenges' ? (
          <ChallengeList profile={profile} onOpen={id => go({ tab: 'challenges', ch: id })} />
        ) : tab === 'play' ? (
          <Playground theme={theme} />
        ) : tab === 'cert' && CERTIFICATES_ENABLED ? (
          <CertificatesTab api={api} />
        ) : tab === 'notes' ? (
          <NotesTab theme={theme} />
        ) : (
          <>
            <LevelMap profile={profile} theme={theme} onOpen={id => go({ tab: 'learn', level: id })} />
            {CERTIFICATES_ENABLED && LEVELS.every(l => profile.levels[l.id]) && !profile.certs?.basic && (
              <button type="button" className="sb-claim" onClick={() => go({ tab: 'cert' })}>
                <Award size={20} />
                <span>
                  <strong>You finished all 8 levels.</strong> Your certificate is ready.
                </span>
                <span aria-hidden="true">→</span>
              </button>
            )}
            <Board me={profile.id} />
          </>
        )}
      </main>
    </div>
  );
}

function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="sb-header">
      <div className="sb-header__row">
        <Link to="/mbi802" className="sb-brand" aria-label="Back to MBI802">
          <CourseBrand size={26} />
          <span className="sb-brand__tag">SQL Sandbox</span>
        </Link>
        {children}
      </div>
    </header>
  );
}
