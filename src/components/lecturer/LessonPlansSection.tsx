import { BookOpen, Eye, FileDown, Clock, Lock } from 'lucide-react';

interface Plan {
  num: number;
  title: string;
  sub: string;
  topics: string[];
  methods: string[];
  accent: string;
  lightBg: string;
  lightBorder: string;
}

const PLANS: Plan[] = [
  {
    num: 1,
    title: 'Introduction to DBMS',
    sub: 'Foundations & MySQL Environment Setup',
    topics: ['Data vs. Information', 'DBMS vs. file-based systems', 'MySQL installation & first connection'],
    methods: ['Think-Pair-Share', 'Kahoot!', 'Live Demo', 'Exit Ticket'],
    accent: '#1e40af',
    lightBg: 'rgba(219,234,254,0.45)',
    lightBorder: 'rgba(59,130,246,0.22)',
  },
  {
    num: 2,
    title: 'SQL Programming Fundamentals',
    sub: 'DDL Commands, Data Types & Basic Data Retrieval',
    topics: ['CREATE DATABASE & CREATE TABLE', 'Data types and constraints', 'INSERT INTO & SELECT basics'],
    methods: ['Live Coding', 'Pair Programming', 'Scaffolded Learning'],
    accent: '#065f46',
    lightBg: 'rgba(209,250,229,0.45)',
    lightBorder: 'rgba(16,185,129,0.22)',
  },
  {
    num: 3,
    title: 'Advanced SQL Queries',
    sub: 'Filtering, Aggregations, JOINs & DML Operations',
    topics: ['WHERE, ORDER BY, LIMIT, OFFSET', 'COUNT, SUM, AVG, MAX, MIN, GROUP BY', 'UPDATE, DELETE, INNER JOIN'],
    methods: ['Query Olympics', 'Jigsaw Activity', 'Retrieval Practice'],
    accent: '#6d28d9',
    lightBg: 'rgba(237,233,254,0.45)',
    lightBorder: 'rgba(124,58,237,0.22)',
  },
  {
    num: 4,
    title: 'ER Diagrams — Foundations',
    sub: "Chen's Notation, Entities, Attributes & Cardinality",
    topics: ["Chen's notation symbols", 'Attribute types & cardinality (1:1, 1:N, M:N)', 'Group design challenge + Gallery Walk'],
    methods: ['Gallery Walk', 'Socratic Method', 'Collaborative Design'],
    accent: '#92400e',
    lightBg: 'rgba(254,243,199,0.45)',
    lightBorder: 'rgba(245,158,11,0.22)',
  },
  {
    num: 5,
    title: 'Advanced ER Concepts',
    sub: 'Weak Entities, Special Attributes & Participation Constraints',
    topics: ['Weak entities & identifying relationships', 'Composite, multivalued & derived attributes', 'Total vs. partial participation'],
    methods: ['Case-Based Learning', 'Annotation Activity', 'Peer Teaching'],
    accent: '#0e7490',
    lightBg: 'rgba(207,250,254,0.45)',
    lightBorder: 'rgba(8,145,178,0.22)',
  },
  {
    num: 6,
    title: 'ER to Relational Mapping',
    sub: '8 Mapping Rules — Conceptual Design to SQL Schema',
    topics: ['Rules 1–4: strong entity, weak entity, 1:1, 1:N', 'Rules 5–8: M:N, multivalued, ternary, composite', 'Peer assessment with 8-rule checklist'],
    methods: ['Worked Examples', 'Peer Assessment', 'Jigsaw Rules'],
    accent: '#9f1239',
    lightBg: 'rgba(255,241,242,0.55)',
    lightBorder: 'rgba(225,29,72,0.18)',
  },
  {
    num: 7,
    title: 'Database Normalization',
    sub: 'Functional Dependencies, 1NF, 2NF, 3NF & BCNF',
    topics: ['Insertion, deletion & update anomalies', 'Functional, partial & transitive dependencies', '1NF → 2NF → 3NF → BCNF steps'],
    methods: ['Discovery Learning', 'Socratic Seminar', 'Scaffolded Practice'],
    accent: '#1e3a8a',
    lightBg: 'rgba(239,246,255,0.6)',
    lightBorder: 'rgba(30,58,138,0.18)',
  },
  {
    num: 8,
    title: 'SQL Practice Lab & Final Assessment',
    sub: 'Integrated Lab · DBMS Knowledge Check · Certifications',
    topics: ['SQL Practice Lab — 10 personalised scenarios', 'DBMS Knowledge Check (38 MCQ, 60% pass)', 'Certification pathways + course reflection'],
    methods: ['Project-Based', 'Peer Code Review', 'Reflective Practice'],
    accent: '#374151',
    lightBg: 'rgba(249,250,251,0.7)',
    lightBorder: 'rgba(107,114,128,0.2)',
  },
];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function LessonPlansSection() {
  const openLesson = (num: number) => {
    window.open(`${base}/lesson-plans/class-${num}.html`, '_blank');
  };

  const downloadPDF = (num: number) => {
    window.open(`${base}/lesson-plans/class-${num}.html?pdf=1`, '_blank');
  };

  return (
    <section className="mt-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <BookOpen size={22} style={{ color: '#6d28d9' }} />
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#1e1b4b' }}>
            Lesson Plans
          </h2>
          <p className="text-xs" style={{ color: '#6b7280' }}>
            8 classes · 10:40 AM – 1:00 PM · 120 min teaching + 20 min break
          </p>
        </div>
      </div>

      {/* Staff-only badge */}
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-5"
        style={{
          background: 'rgba(109,40,217,0.09)',
          border: '1px solid rgba(109,40,217,0.22)',
        }}
      >
        <Lock size={11} style={{ color: '#6d28d9' }} />
        <span className="text-xs font-semibold" style={{ color: '#6d28d9' }}>
          Visible to lecturers & teaching assistants only
        </span>
      </div>

      {/* Plan cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.num}
            className="card overflow-hidden"
            style={{ border: `1px solid ${plan.lightBorder}` }}
          >
            {/* Card top bar */}
            <div
              className="px-5 py-3 flex items-center gap-3"
              style={{ background: plan.lightBg, borderBottom: `1px solid ${plan.lightBorder}` }}
            >
              {/* Class number badge */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                style={{ background: plan.accent }}
              >
                {plan.num}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: plan.accent }}>
                  Class {plan.num} of 8
                </div>
                <div className="font-bold text-sm leading-tight" style={{ color: '#1e1b4b' }}>
                  {plan.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                  {plan.sub}
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="px-5 py-4">
              {/* Topics */}
              <ul className="space-y-1.5 mb-4">
                {plan.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs" style={{ color: '#374151' }}>
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: plan.accent }}
                    />
                    {t}
                  </li>
                ))}
              </ul>

              {/* Teaching method tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {plan.methods.map((m) => (
                  <span
                    key={m}
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `${plan.lightBg}`,
                      border: `1px solid ${plan.lightBorder}`,
                      color: plan.accent,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Time info + action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: '#9ca3af' }}
                >
                  <Clock size={11} />
                  10:40 – 1:00 PM
                </span>
                <div className="flex-1" />
                <button
                  onClick={() => openLesson(plan.num)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    background: plan.lightBg,
                    border: `1px solid ${plan.lightBorder}`,
                    color: plan.accent,
                  }}
                >
                  <Eye size={13} />
                  View
                </button>
                <button
                  onClick={() => downloadPDF(plan.num)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: plan.accent }}
                >
                  <FileDown size={13} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => window.open(`${base}/lesson-plans/index.html`, '_blank')}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
            color: 'white',
          }}
        >
          <BookOpen size={15} />
          Open Full Lesson Plans Overview
        </button>
      </div>
    </section>
  );
}
