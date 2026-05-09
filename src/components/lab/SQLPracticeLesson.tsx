import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  BarChart2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Database,
  Loader2,
  Lock,
  Shield,
  XCircle,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  buildCreateTableSql,
  buildInsertSql,
  buildSelectSql,
  scenarios,
  type Scenario,
} from '../../lib/sqlPracticeScenarios';

// ── Types ─────────────────────────────────────────────────────────────────────

type TaskKey = 'createDb' | 'createTable' | 'insertData' | 'retrieveData';

interface VerifEntry {
  verifiedByName: string;
  verifiedAt: any;
}

interface SQLPracticeDoc {
  scenarioId: number;
  assignedAt: any;
  studentName: string;
  studentId: string;
  tasks: Record<TaskKey, boolean>;
  verifications: Partial<Record<TaskKey, VerifEntry | null>>;
}

type StaffRecord = SQLPracticeDoc & { uid: string };

// ── Constants ─────────────────────────────────────────────────────────────────

const TASK_KEYS: TaskKey[] = ['createDb', 'createTable', 'insertData', 'retrieveData'];

const TASK_META: Record<TaskKey, { label: string; num: number }> = {
  createDb:     { label: 'Create Database', num: 1 },
  createTable:  { label: 'Create Table',    num: 2 },
  insertData:   { label: 'Insert Data',     num: 3 },
  retrieveData: { label: 'Retrieve Data',   num: 4 },
};

const ACCENT = '#7c3aed';

// Module-level cache — survives component unmount/remount
let _staffCache: StaffRecord[] | null = null;

// ── Helpers ───────────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      style={{
        background: '#1e1b4b',
        color: '#c4b5fd',
        borderRadius: 8,
        padding: '14px 16px',
        fontSize: 13,
        lineHeight: 1.6,
        overflowX: 'auto',
        margin: '10px 0 0',
        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
        whiteSpace: 'pre',
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

function taskSqlFor(key: TaskKey, s: Scenario): string {
  if (key === 'createDb')     return `CREATE DATABASE ${s.dbName};`;
  if (key === 'createTable')  return buildCreateTableSql(s);
  if (key === 'insertData')   return buildInsertSql(s);
  return buildSelectSql(s);
}

function taskDescFor(key: TaskKey, s: Scenario): string {
  if (key === 'createDb')
    return `Create a new MySQL database named \`${s.dbName}\` using MySQL Workbench.`;
  if (key === 'createTable')
    return `Inside \`${s.dbName}\`, create a table named \`${s.tableName}\` with the following columns:`;
  if (key === 'insertData')
    return `Insert the following 3 rows of sample data into the \`${s.tableName}\` table:`;
  return `Write and run a SELECT query to ${s.selectTask.toLowerCase()}.`;
}

function formatVerifDate(ts: any): string {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Password Gate ─────────────────────────────────────────────────────────────

const LAB_PASSWORD = 'READY';

function unlockKey(uid: string) {
  return `sql_lab_unlocked_${uid}`;
}

function PasswordGate({ uid, onUnlock }: { uid: string; onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const attempt = () => {
    if (value.trim() === LAB_PASSWORD) {
      localStorage.setItem(unlockKey(uid), '1');
      onUnlock();
    } else {
      setError(true);
      setValue('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className="rounded-xl p-8 w-full max-w-sm"
        style={{ border: '1px solid rgba(124,58,237,0.2)', background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.03))' }}
      >
        <Lock size={32} className="mx-auto mb-4" style={{ color: ACCENT }} />
        <p className="text-base font-bold mb-1" style={{ color: '#1e1b4b' }}>Lab Access Required</p>
        <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
          Enter the password provided by your lecturer to unlock this lab.
        </p>
        <input
          type="text"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Enter password…"
          autoFocus
          className="w-full text-center text-sm rounded-lg px-3 py-2.5 outline-none mb-3"
          style={{
            border: `1px solid ${error ? '#ef4444' : 'rgba(124,58,237,0.25)'}`,
            background: '#fff',
            letterSpacing: '0.1em',
          }}
        />
        {error && (
          <p className="text-xs mb-3" style={{ color: '#ef4444' }}>Incorrect password. Try again.</p>
        )}
        <button
          onClick={attempt}
          className="w-full text-sm font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: ACCENT, color: '#fff' }}
        >
          Unlock Lab
        </button>
      </div>
    </div>
  );
}

// ── Student Practice View ─────────────────────────────────────────────────────

function StudentPractice() {
  const { user, studentProfile } = useAuth();
  const [unlocked, setUnlocked] = useState(() =>
    user ? localStorage.getItem(unlockKey(user.uid)) === '1' : false
  );
  const [data, setData] = useState<SQLPracticeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<TaskKey | null>(null);
  const [confirming, setConfirming] = useState<TaskKey | null>(null);

  if (!unlocked) {
    return <PasswordGate uid={user!.uid} onUnlock={() => setUnlocked(true)} />;
  }

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const ref = doc(db, 'sqlPractice', user.uid);
      const snap = await getDoc(ref);
      if (cancelled) return;
      if (snap.exists()) {
        setData(snap.data() as SQLPracticeDoc);
      } else {
        const scenarioId = Math.floor(Math.random() * scenarios.length);
        const newDoc: Omit<SQLPracticeDoc, 'assignedAt'> & { assignedAt: any } = {
          scenarioId,
          assignedAt: serverTimestamp(),
          studentName: studentProfile?.fullName ?? user.email ?? '',
          studentId: studentProfile?.studentId ?? '',
          tasks: { createDb: false, createTable: false, insertData: false, retrieveData: false },
          verifications: {},
        };
        await setDoc(ref, newDoc);
        if (!cancelled) setData({ ...newDoc, assignedAt: null });
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const handleMarkDone = async (key: TaskKey) => {
    if (!user || !data) return;
    if (confirming === key) {
      setSaving(key);
      setConfirming(null);
      try {
        await updateDoc(doc(db, 'sqlPractice', user.uid), { [`tasks.${key}`]: true });
        setData(prev => prev ? { ...prev, tasks: { ...prev.tasks, [key]: true } } : prev);
      } finally {
        setSaving(null);
      }
    } else {
      setConfirming(key);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-purple-600">
        <Loader2 size={20} className="animate-spin mr-2" />
        <span className="text-sm">Loading your scenario…</span>
      </div>
    );
  }

  if (!data) return null;

  const scenario = scenarios[data.scenarioId];
  const completedCount = TASK_KEYS.filter(k => data.tasks[k]).length;
  const allDone = completedCount === 4;

  // Find the index of the first incomplete task (that's the current active task)
  const activeTaskIdx = TASK_KEYS.findIndex(k => !data.tasks[k]);

  return (
    <div className="space-y-5 py-2">
      {/* Scenario card */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.04))', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="rounded-lg p-2 flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.12)' }}
          >
            <Database size={18} style={{ color: ACCENT }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
              Your Scenario — {scenario.theme}
            </p>
            <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>
              Client: {scenario.company}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
              {scenario.caseStudy}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex gap-1">
            {TASK_KEYS.map(k => (
              <div
                key={k}
                className="w-8 h-1.5 rounded-full"
                style={{ background: data.tasks[k] ? ACCENT : 'rgba(124,58,237,0.2)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: '#9ca3af' }}>
            {completedCount}/4 tasks completed
          </span>
        </div>
      </div>

      {/* Tasks */}
      {TASK_KEYS.map((key, idx) => {
        const isDone = data.tasks[key];
        const isActive = idx === activeTaskIdx;
        const isLocked = !isDone && idx > activeTaskIdx;
        const verif = data.verifications[key];
        const meta = TASK_META[key];

        if (isLocked) return null;

        return (
          <div
            key={key}
            className="rounded-xl overflow-hidden"
            style={{
              border: isDone
                ? '1px solid rgba(124,58,237,0.25)'
                : '1px solid rgba(124,58,237,0.3)',
              background: isDone ? 'rgba(124,58,237,0.04)' : '#fff',
            }}
          >
            {/* Task header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background: isDone ? 'rgba(124,58,237,0.07)' : 'rgba(124,58,237,0.04)',
                borderBottom: '1px solid rgba(124,58,237,0.12)',
              }}
            >
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 size={17} style={{ color: '#059669' }} />
                ) : (
                  <Circle size={17} style={{ color: ACCENT }} />
                )}
                <span className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>
                  Task {meta.num} of 4 — {meta.label}
                </span>
              </div>
              {isDone && verif && (
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#059669' }}>
                  <Shield size={13} />
                  <span>Verified by {verif.verifiedByName}</span>
                </div>
              )}
              {isDone && !verif && (
                <span className="text-xs" style={{ color: '#9ca3af' }}>Awaiting TA verification</span>
              )}
            </div>

            {/* Task body */}
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm" style={{ color: '#374151' }}>
                {taskDescFor(key, scenario)}
              </p>

              {/* Column list for createTable */}
              {key === 'createTable' && (
                <ul className="text-sm space-y-1 pl-1">
                  {scenario.columns.map(col => (
                    <li key={col.name} className="flex items-baseline gap-2">
                      <span
                        className="font-mono text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(124,58,237,0.1)', color: ACCENT }}
                      >
                        {col.name}
                      </span>
                      <span className="text-xs" style={{ color: '#6b7280' }}>
                        {col.definition}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Sample data table for insertData */}
              {key === 'insertData' && (
                <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid rgba(124,58,237,0.15)' }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: 'rgba(124,58,237,0.08)' }}>
                        {scenario.columns.filter(c => !c.autoGenerated).map(col => (
                          <th
                            key={col.name}
                            className="px-3 py-2 text-left font-semibold"
                            style={{ color: ACCENT }}
                          >
                            {col.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scenario.sampleData.map((row, ri) => (
                        <tr
                          key={ri}
                          style={{ borderTop: '1px solid rgba(124,58,237,0.08)', background: ri % 2 === 1 ? 'rgba(124,58,237,0.02)' : 'transparent' }}
                        >
                          {row.map((val, ci) => (
                            <td key={ci} className="px-3 py-2" style={{ color: '#374151' }}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Action */}
              {!isDone && (
                <div className="pt-1 flex items-center gap-3">
                  {confirming === key ? (
                    <>
                      <span className="text-xs" style={{ color: '#6b7280' }}>
                        Have you completed this task in MySQL Workbench?
                      </span>
                      <button
                        onClick={() => handleMarkDone(key)}
                        disabled={saving === key}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ background: '#059669', color: '#fff' }}
                      >
                        {saving === key ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                        Yes, mark done
                      </button>
                      <button
                        onClick={() => setConfirming(null)}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ background: '#f3f4f6', color: '#6b7280' }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleMarkDone(key)}
                      disabled={saving !== null}
                      className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                      style={{ background: ACCENT, color: '#fff' }}
                    >
                      <CheckCircle2 size={15} />
                      Mark as Done
                    </button>
                  )}
                </div>
              )}

              {isDone && (
                <div className="flex items-center gap-2 pt-1">
                  <CheckCircle2 size={15} style={{ color: '#059669' }} />
                  <span className="text-sm font-medium" style={{ color: '#059669' }}>Completed</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Locked task hint */}
      {activeTaskIdx !== -1 && activeTaskIdx < 3 && (
        <div
          className="rounded-xl px-5 py-3 flex items-center gap-2"
          style={{ background: '#f9fafb', border: '1px dashed #e5e7eb' }}
        >
          <Lock size={14} style={{ color: '#9ca3af' }} />
          <span className="text-xs" style={{ color: '#9ca3af' }}>
            {3 - activeTaskIdx} more task{3 - activeTaskIdx !== 1 ? 's' : ''} will unlock as you complete each step.
          </span>
        </div>
      )}

      {/* All done */}
      {allDone && (
        <div
          className="rounded-xl p-5 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(16,185,129,0.04))', border: '1px solid rgba(5,150,105,0.2)' }}
        >
          <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: '#059669' }} />
          <p className="text-base font-bold" style={{ color: '#065f46' }}>All tasks completed!</p>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Your teaching assistant will review and verify each task.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Staff Panel ───────────────────────────────────────────────────────────────

function TaskBadge({ done, verified }: { done: boolean; verified: boolean }) {
  if (!done) return <span className="text-xs text-gray-300">—</span>;
  return (
    <span className="inline-flex items-center gap-1">
      <CheckCircle2 size={13} style={{ color: '#059669' }} />
      {verified && <Shield size={11} style={{ color: '#7c3aed' }} />}
    </span>
  );
}

function StaffDetail({
  record,
  currentUserName,
  onUpdate,
  onClose,
}: {
  record: StaffRecord;
  currentUserName: string;
  onUpdate: (uid: string, key: TaskKey, entry: VerifEntry | null) => void;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState<TaskKey | null>(null);
  const scenario = scenarios[record.scenarioId];

  const toggleVerify = async (key: TaskKey) => {
    const existing = record.verifications[key];
    setSaving(key);
    const newEntry: VerifEntry | null = existing
      ? null
      : { verifiedByName: currentUserName, verifiedAt: serverTimestamp() };
    try {
      await updateDoc(doc(db, 'sqlPractice', record.uid), {
        [`verifications.${key}`]: newEntry,
      });
      onUpdate(record.uid, key, newEntry);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(124,58,237,0.2)', background: '#fafafa' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(124,58,237,0.06)', borderBottom: '1px solid rgba(124,58,237,0.12)' }}
      >
        <div>
          <span className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>
            {record.studentName || 'Unknown'}
          </span>
          {record.studentId && (
            <span className="ml-2 text-xs" style={{ color: '#9ca3af' }}>#{record.studentId}</span>
          )}
          <span
            className="ml-3 text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(124,58,237,0.1)', color: ACCENT }}
          >
            {scenario.theme}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XCircle size={18} />
        </button>
      </div>

      {/* Scenario summary */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(124,58,237,0.08)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
          Scenario — {scenario.company}
        </p>
        <p className="text-xs" style={{ color: '#6b7280' }}>{scenario.caseStudy}</p>
      </div>

      {/* Per-task verification */}
      <div className="divide-y" style={{ borderColor: 'rgba(124,58,237,0.08)' }}>
        {TASK_KEYS.map((key, idx) => {
          const isDone = record.tasks[key];
          const verif = record.verifications[key];
          const meta = TASK_META[key];

          return (
            <div key={key} className="px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#374151' }}>
                      Task {meta.num}: {meta.label}
                    </span>
                    {isDone ? (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#dcfce7', color: '#166534' }}>
                        Student done
                      </span>
                    ) : (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#9ca3af' }}>
                        Not done yet
                      </span>
                    )}
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#6b7280' }}>
                    {taskDescFor(key, scenario)}
                  </p>
                  <CodeBlock code={taskSqlFor(key, scenario)} />
                  {verif && (
                    <p className="text-xs mt-2" style={{ color: '#7c3aed' }}>
                      <Shield size={11} className="inline mr-1" />
                      Verified by {verif.verifiedByName}
                      {verif.verifiedAt && ` · ${formatVerifDate(verif.verifiedAt)}`}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 pt-1">
                  <button
                    onClick={() => toggleVerify(key)}
                    disabled={saving === key || !isDone}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-40"
                    style={{
                      background: verif ? 'rgba(124,58,237,0.1)' : ACCENT,
                      color: verif ? ACCENT : '#fff',
                      border: verif ? `1px solid ${ACCENT}` : 'none',
                    }}
                    title={!isDone ? 'Student has not completed this task yet' : ''}
                  >
                    {saving === key ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : verif ? (
                      <><Shield size={12} /> Verified</>
                    ) : (
                      <><Shield size={12} /> Verify</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StaffPanel({ isLecturer }: { isLecturer: boolean }) {
  const { user, studentProfile } = useAuth();
  const [records, setRecords] = useState<StaffRecord[] | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [listLoaded, setListLoaded] = useState(false);
  const [expandedUid, setExpandedUid] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const currentUserName =
    user?.displayName || studentProfile?.fullName || user?.email || 'Staff';

  const loadRecords = async () => {
    if (_staffCache) {
      setRecords(_staffCache);
      setListLoaded(true);
      return;
    }
    setLoadingList(true);
    try {
      const snap = await getDocs(collection(db, 'sqlPractice'));
      const data: StaffRecord[] = snap.docs.map(d => ({ uid: d.id, ...(d.data() as SQLPracticeDoc) }));
      data.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''));
      _staffCache = data;
      setRecords(data);
    } finally {
      setLoadingList(false);
      setListLoaded(true);
    }
  };

  const handleUpdateVerif = (uid: string, key: TaskKey, entry: VerifEntry | null) => {
    setRecords(prev => {
      if (!prev) return prev;
      const updated = prev.map(r =>
        r.uid === uid
          ? { ...r, verifications: { ...r.verifications, [key]: entry } }
          : r
      );
      _staffCache = updated;
      return updated;
    });
  };

  // Derived stats for lecturer
  const stats = records
    ? TASK_KEYS.map(key => ({
        key,
        label: TASK_META[key].label,
        studentDone: records.filter(r => r.tasks[key]).length,
        taVerified: records.filter(r => !!r.verifications[key]).length,
        total: records.length,
      }))
    : null;

  const filtered = records
    ? records.filter(r => {
        const q = search.toLowerCase();
        return (
          !q ||
          r.studentName?.toLowerCase().includes(q) ||
          r.studentId?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="space-y-4 py-2">
      {!listLoaded ? (
        <div className="text-center py-8">
          <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
            View student progress and verify completed tasks.
          </p>
          <button
            onClick={loadRecords}
            disabled={loadingList}
            className="flex items-center gap-2 mx-auto text-sm font-semibold px-5 py-2.5 rounded-lg"
            style={{ background: ACCENT, color: '#fff' }}
          >
            {loadingList ? <Loader2 size={15} className="animate-spin" /> : <BarChart2 size={15} />}
            {loadingList ? 'Loading…' : 'Load Student Progress'}
          </button>
        </div>
      ) : (
        <>
          {/* Lecturer stats */}
          {isLecturer && stats && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(167,139,250,0.03))', border: '1px solid rgba(124,58,237,0.15)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: ACCENT }}>
                Summary — {records!.length} student{records!.length !== 1 ? 's' : ''} started
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map(s => (
                  <div
                    key={s.key}
                    className="rounded-lg p-3"
                    style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(124,58,237,0.1)' }}
                  >
                    <p className="text-xs font-medium mb-2" style={{ color: '#374151' }}>{s.label}</p>
                    <p className="text-lg font-bold leading-none" style={{ color: ACCENT }}>
                      {s.studentDone}<span className="text-sm font-normal text-gray-400">/{s.total}</span>
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                      <Shield size={10} className="inline mr-0.5" />
                      {s.taVerified} verified
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or student ID…"
              className="flex-1 text-sm rounded-lg px-3 py-2 outline-none"
              style={{ border: '1px solid rgba(124,58,237,0.2)', background: '#fff' }}
            />
            <button
              onClick={() => { _staffCache = null; setRecords(null); setListLoaded(false); setExpandedUid(null); }}
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }}
            >
              Refresh
            </button>
          </div>

          {/* Student list */}
          {filtered.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#9ca3af' }}>
              {search ? 'No students match your search.' : 'No students have started this lesson yet.'}
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map(record => {
                const isExpanded = expandedUid === record.uid;
                const allDone = TASK_KEYS.every(k => record.tasks[k]);
                const allVerified = TASK_KEYS.every(k => !!record.verifications[k]);
                const doneCt = TASK_KEYS.filter(k => record.tasks[k]).length;
                const verifCt = TASK_KEYS.filter(k => !!record.verifications[k]).length;

                return (
                  <div
                    key={record.uid}
                    className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(124,58,237,0.15)' }}
                  >
                    <button
                      onClick={() => setExpandedUid(isExpanded ? null : record.uid)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-50 transition-colors"
                      style={{ background: isExpanded ? 'rgba(124,58,237,0.06)' : '#fff' }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: '#1e1b4b' }}>
                            {record.studentName || '(No name)'}
                          </p>
                          <p className="text-xs" style={{ color: '#9ca3af' }}>
                            {record.studentId ? `#${record.studentId} · ` : ''}
                            {scenarios[record.scenarioId]?.theme}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                        {/* Task badges */}
                        <div className="hidden sm:flex items-center gap-3">
                          {TASK_KEYS.map(k => (
                            <div key={k} className="flex flex-col items-center">
                              <TaskBadge done={record.tasks[k]} verified={!!record.verifications[k]} />
                              <span className="text-xs mt-0.5" style={{ color: '#d1d5db', fontSize: 9 }}>
                                {TASK_META[k].label.split(' ')[0]}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Mobile progress pill */}
                        <span
                          className="sm:hidden text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: allDone ? '#dcfce7' : 'rgba(124,58,237,0.1)',
                            color: allDone ? '#166534' : ACCENT,
                          }}
                        >
                          {doneCt}/4
                        </span>
                        {/* Verification pill */}
                        {verifCt > 0 && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(124,58,237,0.1)', color: ACCENT }}
                          >
                            <Shield size={10} className="inline mr-0.5" />
                            {verifCt}/4
                          </span>
                        )}
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <StaffDetail
                          record={record}
                          currentUserName={currentUserName}
                          onUpdate={handleUpdateVerif}
                          onClose={() => setExpandedUid(null)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function SQLPracticeLesson() {
  const { role } = useAuth();
  const isStaff = role === 'lecturer' || role === 'teachingAssistant';
  if (isStaff) return <StaffPanel isLecturer={role === 'lecturer'} />;
  return <StudentPractice />;
}
