import { useState, useEffect, useCallback } from 'react';
import {
  Brain, Target, Users, TrendingUp, Map, ChevronDown,
  CheckCircle, Circle, Copy, Check, AlertTriangle, Key,
  RotateCcw, Lightbulb, Eye, EyeOff, Loader2, Trophy,
  ChevronRight, Sparkles, BarChart2, BookOpen,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Challenge {
  id: string;
  number: number;
  title: string;
  concept: string;
  conceptIcon: React.ReactNode;
  accentColor: string;
  context: string;
  task: string;
  rubric: string[];
  weakPromptExample: string;
  guidance: string;
}

interface DimensionScores {
  specificity: number;
  conceptCoverage: number;
  outputClarity: number;
  contextRichness: number;
  actionability: number;
}

interface DimensionFeedback {
  specificity: string;
  conceptCoverage: string;
  outputClarity: string;
  contextRichness: string;
  actionability: string;
}

export interface EvaluationResult {
  scores: DimensionScores;
  totalScore: number;
  feedback: DimensionFeedback;
  keyInsight: string;
  improvedPrompt: string;
  performanceLevel: 'Weak' | 'Developing' | 'Competent' | 'Proficient' | 'Expert';
  overallFeedback: string;
}

interface ChallengeProgress {
  completed: boolean;
  bestScore: number;
  attempts: number;
}

type ProgressMap = Record<string, ChallengeProgress>;

interface ChallengeState {
  prompt: string;
  isEvaluating: boolean;
  result: EvaluationResult | null;
  showImproved: boolean;
  copied: boolean;
  error: string | null;
}

// ── Constants ──────────────────────────────────────────────────────────────

const ACCENT = '#0ea5e9';
const LS_PROGRESS = 'sisp_lab_v1_progress';
const LS_API_KEY  = 'sisp_lab_v1_groq_key';

const PERF_CONFIG = {
  Weak:       { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',    label: 'Weak',       range: '0–40'   },
  Developing: { color: '#f97316', bg: 'rgba(249,115,22,0.10)',   label: 'Developing', range: '41–60'  },
  Competent:  { color: '#eab308', bg: 'rgba(234,179,8,0.10)',    label: 'Competent',  range: '61–75'  },
  Proficient: { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)',   label: 'Proficient', range: '76–88'  },
  Expert:     { color: '#10b981', bg: 'rgba(16,185,129,0.10)',   label: 'Expert',     range: '89–100' },
} as const;

const DIMENSION_META: Record<keyof DimensionScores, { label: string; desc: string }> = {
  specificity:     { label: 'Specificity',      desc: 'Precise, targeted requests tied to the specific scenario' },
  conceptCoverage: { label: 'Concept Coverage', desc: 'Explicit invocation and correct application of SISP frameworks' },
  outputClarity:   { label: 'Output Clarity',   desc: 'Clearly specified expected output format, structure, and depth' },
  contextRichness: { label: 'Context Richness', desc: 'Organisational details from the scenario woven into the request' },
  actionability:   { label: 'Actionability',    desc: 'Output would be directly usable for real SISP work' },
};

// ── Challenge Data ─────────────────────────────────────────────────────────

const CHALLENGES: Challenge[] = [
  {
    id: 'iceberg',
    number: 1,
    title: 'Surfacing Hidden Causes',
    concept: 'Iceberg Model',
    conceptIcon: <Layers size={14} />,
    accentColor: '#0284c7',
    context: `TechCore Solutions, a mid-sized financial services firm, has experienced three consecutive IS project failures in 18 months. Each project ran 40–60% over budget and delivered systems that staff resisted using. The CTO's post-mortem reports focus on "poor vendor performance" and "inadequate testing." Staff surveys reveal frustration with lack of consultation, unclear ownership, and processes that "don't match how we actually work." Senior management insists the fix is a stricter procurement process.`,
    task: `You are advising TechCore's SISP team. Craft a prompt that uses the Iceberg Model to guide an AI in identifying the true systemic causes of TechCore's IS failures — going beyond visible symptoms to expose the organisational, cultural, and process-level factors driving these outcomes.`,
    rubric: [
      'Explicitly invokes the Iceberg Model or its levels (events, patterns, structures, mental models)',
      'Distinguishes observable symptoms from structural or cultural root causes',
      'References specific details from the TechCore scenario (failed projects, staff resistance, management framing)',
      'Requests actionable analysis structured by model level, not just a list',
      'Asks for output that can feed directly into SISP diagnosis or planning',
    ],
    weakPromptExample: '"Why do IS projects fail at TechCore? List the causes."',
    guidance: 'Each iceberg level should surface something different. Ask the AI to work through levels systematically, grounding its analysis in the specific evidence provided — not generic project failure theory.',
  },
  {
    id: 'six-dimensions',
    number: 2,
    title: 'Process Analysis Across Dimensions',
    concept: 'Six Process Dimensions',
    conceptIcon: <BarChart2 size={14} />,
    accentColor: '#7c3aed',
    context: `Pacific National Bank (PNB) is planning to replace its 20-year-old core banking system. The SISP team must first analyse the current mortgage approval process, which takes 14 days on average and involves 8 departments. Loan officers report duplicated data entry, inconsistent credit risk assessments, and unclear handoff points. Customer satisfaction for mortgage approvals is PNB's lowest-rated product. The replacement system must address these issues without disrupting live operations.`,
    task: `Craft a prompt that directs an AI to apply the Six Process Dimensions framework to produce a rigorous analysis of PNB's mortgage approval process — one that will form the basis of IS requirements for the new system.`,
    rubric: [
      'Names or clearly implies all six process dimensions (inputs, outputs, guides, enablers, resources, flow/sequence)',
      'Anchors the analysis in PNB\'s specific process details (14 days, 8 departments, duplicated entry)',
      'Requests findings per dimension, not generic commentary on the process',
      'Asks for IS implications or system requirements derived from each dimension',
      'Output format is appropriate for use as a planning artefact (table, structured report, etc.)',
    ],
    weakPromptExample: '"Analyse the bank\'s loan process using the six dimensions framework."',
    guidance: 'The Six Process Dimensions give you a structured analytical lens. Ask the AI to examine each dimension against specific evidence from the case, then derive IS requirements from the gaps it finds.',
  },
  {
    id: 'participation',
    number: 3,
    title: 'Designing Stakeholder Engagement',
    concept: 'Participation in SISP',
    conceptIcon: <Users size={14} />,
    accentColor: '#059669',
    context: `HealthFirst NZ, a government-funded regional health authority, is launching a 3-year SISP initiative to unify 12 disparate clinical information systems across 6 hospitals and 40+ community clinics. Stakeholders include clinicians (doctors, nurses, allied health), IS/IT staff, administrators, patients, and two commercial vendors with existing contracts. Previous IS planning attempts failed due to low clinician buy-in. The Minister of Health has publicly committed to a "clinician-led digital transformation."`,
    task: `Craft a prompt that uses SISP participation principles to guide an AI in designing a stakeholder engagement strategy for HealthFirst NZ's planning process — one that addresses the political realities, clinician resistance history, and diverse stakeholder needs.`,
    rubric: [
      'Explicitly invokes SISP participation principles (breadth, depth, legitimacy, representativeness)',
      'Acknowledges HealthFirst\'s specific political context and history of failed engagement',
      'Asks for differentiated engagement approaches per stakeholder group',
      'Requests mechanisms for surfacing and reconciling conflicting interests',
      'Output is framed as a usable engagement plan, not abstract participation theory',
    ],
    weakPromptExample: '"How should we involve stakeholders in the HealthFirst IS planning process?"',
    guidance: 'Participation in SISP is not just "consulting people." Think about power dynamics, legitimacy, the difference between informing and co-designing, and how engagement must vary by planning phase and stakeholder type.',
  },
  {
    id: 'consistency',
    number: 4,
    title: 'Evaluating Strategic Alignment',
    concept: 'Consistency in SISP',
    conceptIcon: <TrendingUp size={14} />,
    accentColor: '#d97706',
    context: `RetailMax Group's board approved a 5-year strategy centred on hyper-personalisation, seamless omnichannel customer experience, and data-driven decision making. The IS Department responded with a $12M proposal to upgrade server infrastructure, consolidate data centres, and migrate to a private cloud. The IS Director argues these are "foundational investments" that must precede any customer-facing initiatives. The Strategy Director argues the IS plan is "completely disconnected" from board priorities. The board must decide next month.`,
    task: `Craft a prompt that applies SISP consistency principles to produce a rigorous alignment analysis of the IS Department's proposal against the board's strategic intent — including specific gaps, risks, and a recommended path forward.`,
    rubric: [
      'Explicitly applies SISP consistency or alignment concepts (vertical, horizontal, or functional alignment)',
      'References both the board strategy themes and the IS proposal specifics',
      'Asks for a gap analysis, not just a summary of each plan',
      'Requests risk assessment for proceeding with misaligned investments',
      'Includes a recommendation element — what should the board decide, and on what basis?',
    ],
    weakPromptExample: '"Is the RetailMax IS plan aligned with their business strategy? Explain."',
    guidance: 'Consistency in SISP means every IS decision can be traced to strategic intent. Ask the AI to test each major IS proposal element against the strategic themes — and be explicit about what alignment means in this context.',
  },
  {
    id: 'methodology',
    number: 5,
    title: 'Designing a SISP Methodology',
    concept: 'SISP Methodology & Process',
    conceptIcon: <Map size={14} />,
    accentColor: '#dc2626',
    context: `Harbour University (15,000 students, 3 campuses) is undertaking its first formal SISP exercise after a decade of ad-hoc IS decisions. The new CIO has a mandate to "get everyone on the same page about IS direction." Key challenges: no shared IS governance structure, academic staff distrust of centralised IT decisions, 40+ legacy systems with no documentation, and a culture that values autonomy over standardisation. The board wants a 3-year IS strategy delivered in 6 months.`,
    task: `Craft a prompt that guides an AI to design a comprehensive, realistic SISP methodology for Harbour University — one appropriately tailored to the university's maturity level, culture, constraints, and stakeholder landscape.`,
    rubric: [
      'Specifies the SISP methodology components needed (phases, tools, deliverables, governance)',
      'Grounds the methodology design in Harbour University\'s specific constraints and culture',
      'Requests sequencing rationale — why this order, why these tools in this context',
      'Asks for risk mitigation for each major methodology risk specific to Harbour',
      'Output is structured as a deployable planning document, not generic SISP theory',
    ],
    weakPromptExample: '"Design an IS planning process for a university."',
    guidance: 'A good SISP methodology is not generic — it is calibrated to organisational maturity, culture, and constraints. Force the AI to justify every methodology choice against Harbour University\'s specific situation.',
  },
];

// placeholder for Layers icon used in challenge 1
function Layers({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

// ── localStorage helpers ───────────────────────────────────────────────────

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(LS_PROGRESS);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap) {
  try { localStorage.setItem(LS_PROGRESS, JSON.stringify(map)); } catch { /* noop */ }
}

function loadApiKey(): string {
  try { return localStorage.getItem(LS_API_KEY) ?? ''; } catch { return ''; }
}

function persistApiKey(key: string) {
  try { localStorage.setItem(LS_API_KEY, key); } catch { /* noop */ }
}

// ── Evaluation API ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert evaluator for Strategic Information Systems Planning (SISP) prompt quality at postgraduate level (MBI800 Business Information Systems).

Evaluate strictly and academically. A score above 80 requires genuine sophistication. Do not be lenient.

Scoring dimensions (each 0–20):
- specificity: Precise, targeted requests tied to the specific scenario. Penalise vague or generic questions.
- conceptCoverage: Explicit, correct invocation of SISP frameworks and concepts named in the challenge.
- outputClarity: Clear specification of expected output format, structure, and depth.
- contextRichness: Specific organisational details from the scenario woven meaningfully into the request.
- actionability: Output would be directly usable for real SISP work, not merely academically interesting.

Performance levels: Weak (0–40), Developing (41–60), Competent (61–75), Proficient (76–88), Expert (89–100).

Return ONLY a valid JSON object — no markdown fences, no text outside the JSON.`;

async function callEvaluationAPI(
  apiKey: string,
  challenge: Challenge,
  studentPrompt: string,
): Promise<EvaluationResult> {
  const userMessage = `CHALLENGE: ${challenge.title}
SISP CONCEPT: ${challenge.concept}

ORGANISATIONAL CONTEXT:
${challenge.context}

STUDENT TASK:
${challenge.task}

RUBRIC CRITERIA:
${challenge.rubric.map((r, i) => `${i + 1}. ${r}`).join('\n')}

STUDENT PROMPT TO EVALUATE:
"""
${studentPrompt}
"""

Return a JSON object with exactly these fields:
{
  "scores": { "specificity": <0-20>, "conceptCoverage": <0-20>, "outputClarity": <0-20>, "contextRichness": <0-20>, "actionability": <0-20> },
  "totalScore": <0-100>,
  "feedback": { "specificity": "<1-2 sentences>", "conceptCoverage": "<1-2 sentences>", "outputClarity": "<1-2 sentences>", "contextRichness": "<1-2 sentences>", "actionability": "<1-2 sentences>" },
  "keyInsight": "<single most important learning point for this student>",
  "improvedPrompt": "<a substantially improved version of the student prompt>",
  "performanceLevel": "<Weak|Developing|Competent|Proficient|Expert>",
  "overallFeedback": "<2-3 sentences: encouraging but honest professional assessment>"
}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 1400,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    const msg = err?.error?.message ?? `API error ${res.status}`;
    throw new Error(
      res.status === 429
        ? 'Rate limit reached. Wait a moment and try again — Groq\'s free tier allows 30 requests per minute.'
        : res.status === 401
        ? 'Invalid API key. Make sure you copied the full key from console.groq.com.'
        : msg,
    );
  }

  const data = await res.json() as { choices?: { message: { content: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse evaluation response. Please try again.');
  return JSON.parse(jsonMatch[0]) as EvaluationResult;
}

// ── Score Circle (SVG) ─────────────────────────────────────────────────────

function ScoreCircle({ score, level }: { score: number; level: keyof typeof PERF_CONFIG }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const { color } = PERF_CONFIG[level];
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={108} height={108} viewBox="0 0 108 108">
        <circle cx={54} cy={54} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={8} />
        <circle
          cx={54} cy={54} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 54 54)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x={54} y={50} textAnchor="middle" fontSize={22} fontWeight={700}
          fill={color} fontFamily="Inter,sans-serif">{score}</text>
        <text x={54} y={66} textAnchor="middle" fontSize={11} fill="#6b7280"
          fontFamily="Inter,sans-serif">/ 100</text>
      </svg>
    </div>
  );
}

// ── Dimension Bar ──────────────────────────────────────────────────────────

function DimensionBar({
  dim, score, feedback, accentColor,
}: {
  dim: keyof DimensionScores;
  score: number;
  feedback: string;
  accentColor: string;
}) {
  const { label, desc } = DIMENSION_META[dim];
  const pct = (score / 20) * 100;
  const barColor = score >= 16 ? '#10b981' : score >= 12 ? '#3b82f6' : score >= 8 ? '#eab308' : '#f97316';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: '#1e1b4b' }}>{label}</span>
        <span className="text-xs font-bold" style={{ color: barColor }}>{score}/20</span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: barColor, transition: 'width 0.6s ease' }}
        />
      </div>
      <p className="text-xs leading-4" style={{ color: '#6b7280' }}>{desc}</p>
      <p className="text-xs leading-5 mt-0.5 pl-2 border-l-2" style={{ color: '#374151', borderColor: accentColor + '60' }}>
        {feedback}
      </p>
    </div>
  );
}

// ── Results Panel ──────────────────────────────────────────────────────────

function ResultsPanel({
  result,
  challenge,
  showImproved,
  onToggleImproved,
  copied,
  onCopy,
  onRetry,
}: {
  result: EvaluationResult;
  challenge: Challenge;
  showImproved: boolean;
  onToggleImproved: () => void;
  copied: boolean;
  onCopy: () => void;
  onRetry: () => void;
}) {
  const perf = PERF_CONFIG[result.performanceLevel];
  const dims = Object.keys(result.scores) as (keyof DimensionScores)[];

  return (
    <div className="mt-5 space-y-4 animate-fadeIn">
      {/* Score header */}
      <div
        className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5"
        style={{ background: `${perf.color}08`, border: `1.5px solid ${perf.color}30` }}
      >
        <ScoreCircle score={result.totalScore} level={result.performanceLevel} />
        <div className="flex-1 text-center sm:text-left">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2"
            style={{ background: perf.bg, color: perf.color }}
          >
            <Trophy size={12} /> {perf.label} · {perf.range}
          </div>
          <p className="text-sm leading-6" style={{ color: '#374151' }}>{result.overallFeedback}</p>
        </div>
      </div>

      {/* Dimension breakdown */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(139,92,246,0.10)' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
          Dimension Breakdown
        </p>
        {dims.map(dim => (
          <DimensionBar
            key={dim}
            dim={dim}
            score={result.scores[dim]}
            feedback={result.feedback[dim]}
            accentColor={challenge.accentColor}
          />
        ))}
      </div>

      {/* Key insight */}
      <div
        className="rounded-2xl px-5 py-4 flex gap-3"
        style={{ background: `${ACCENT}08`, border: `1.5px solid ${ACCENT}25` }}
      >
        <Lightbulb size={18} style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
            Key Learning Insight
          </p>
          <p className="text-sm leading-6" style={{ color: '#1e1b4b' }}>{result.keyInsight}</p>
        </div>
      </div>

      {/* Improved prompt (collapsible) */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1.5px solid rgba(139,92,246,0.12)' }}
      >
        <button
          onClick={onToggleImproved}
          className="w-full flex items-center justify-between px-5 py-3 transition-all"
          style={{ background: showImproved ? 'rgba(124,58,237,0.05)' : 'rgba(255,255,255,0.8)' }}
        >
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#7c3aed' }}>
            <Sparkles size={12} className="inline mr-1" />
            View Improved Prompt
          </span>
          <ChevronDown
            size={16}
            style={{ color: '#7c3aed', transform: showImproved ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>
        {showImproved && (
          <div className="px-5 pb-5 pt-3 animate-fadeIn" style={{ borderTop: '1.5px solid rgba(124,58,237,0.08)' }}>
            <pre
              className="text-sm leading-6 whitespace-pre-wrap font-sans rounded-xl p-4"
              style={{ background: 'rgba(245,243,255,0.7)', color: '#1e1b4b', border: '1px solid rgba(124,58,237,0.10)' }}
            >
              {result.improvedPrompt}
            </pre>
            <button
              onClick={onCopy}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: copied ? 'rgba(16,185,129,0.12)' : 'rgba(124,58,237,0.10)',
                color: copied ? '#10b981' : '#7c3aed',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy prompt'}
            </button>
          </div>
        )}
      </div>

      {/* Retry */}
      <button onClick={onRetry} className="inline-flex items-center gap-2 text-xs font-semibold"
        style={{ color: '#6b7280' }}>
        <RotateCcw size={13} /> Revise and resubmit
      </button>
    </div>
  );
}

// ── Challenge Panel ────────────────────────────────────────────────────────

function ChallengePanel({
  challenge,
  isOpen,
  onToggle,
  progress,
  state,
  onPromptChange,
  onEvaluate,
  onToggleImproved,
  onCopy,
  onRetry,
}: {
  challenge: Challenge;
  isOpen: boolean;
  onToggle: () => void;
  progress: ChallengeProgress | undefined;
  state: ChallengeState;
  onPromptChange: (v: string) => void;
  onEvaluate: () => void;
  onToggleImproved: () => void;
  onCopy: () => void;
  onRetry: () => void;
}) {
  const ac = challenge.accentColor;
  const done = progress?.completed ?? false;
  const best = progress?.bestScore ?? 0;
  const minChars = 80;
  const canSubmit = state.prompt.trim().length >= minChars && !state.isEvaluating;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        border: isOpen ? `1.5px solid ${ac}40` : '1.5px solid rgba(139,92,246,0.10)',
        background: isOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.75)',
        boxShadow: isOpen ? `0 4px 24px ${ac}18` : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header */}
      <button onClick={onToggle} className="w-full text-left flex items-center gap-4 px-5 py-4 transition-all"
        style={{ background: isOpen ? `${ac}08` : 'transparent' }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${ac}15`, color: ac }}>
          <span className="text-sm font-bold">{challenge.number}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: ac, opacity: 0.75 }}>
              Challenge {challenge.number}
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `${ac}15`, color: ac }}>
              {challenge.conceptIcon} {challenge.concept}
            </span>
            {done && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                <CheckCircle size={11} /> {best}/100
              </span>
            )}
          </div>
          <p className="text-sm font-semibold mt-0.5" style={{ color: '#1e1b4b' }}>{challenge.title}</p>
        </div>
        <ChevronDown size={18} style={{ color: ac, flexShrink: 0,
          transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-5 pb-6 pt-2 animate-fadeIn" style={{ borderTop: `1.5px solid ${ac}20` }}>

          {/* Context */}
          <div className="rounded-xl p-4 mb-4"
            style={{ background: `${ac}08`, border: `1px solid ${ac}20` }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ac }}>
              <BookOpen size={11} className="inline mr-1" /> Organisational Context
            </p>
            <p className="text-sm leading-6" style={{ color: '#374151' }}>{challenge.context}</p>
          </div>

          {/* Task */}
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6b7280' }}>Your Task</p>
            <p className="text-sm leading-6 font-medium" style={{ color: '#1e1b4b' }}>{challenge.task}</p>
          </div>

          {/* Rubric */}
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>
              What Makes a Strong Prompt
            </p>
            <div className="space-y-1.5">
              {challenge.rubric.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ChevronRight size={13} style={{ color: ac, flexShrink: 0, marginTop: 3 }} />
                  <p className="text-xs leading-5" style={{ color: '#374151' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weak example */}
          <div className="rounded-xl px-4 py-3 mb-4"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#ef4444' }}>
              <AlertTriangle size={11} className="inline mr-1" /> Example of a Weak Prompt
            </p>
            <p className="text-sm italic" style={{ color: '#7f1d1d' }}>{challenge.weakPromptExample}</p>
          </div>

          {/* Guidance tip */}
          <div className="rounded-xl px-4 py-3 mb-5"
            style={{ background: `${ACCENT}07`, border: `1px solid ${ACCENT}20` }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
              <Lightbulb size={11} className="inline mr-1" /> Guidance
            </p>
            <p className="text-xs leading-5" style={{ color: '#1e40af' }}>{challenge.guidance}</p>
          </div>

          {/* Prompt textarea */}
          {(!state.result || state.isEvaluating) && (
            <>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: '#374151' }}>
                Write Your Prompt
              </label>
              <textarea
                value={state.prompt}
                onChange={e => onPromptChange(e.target.value)}
                disabled={state.isEvaluating}
                rows={6}
                placeholder="Craft a prompt that applies SISP concepts to this scenario. Be specific about the framework, the context, and the output you need…"
                className="w-full rounded-xl px-4 py-3 text-sm leading-6 resize-y outline-none transition-all"
                style={{
                  border: `1.5px solid ${state.prompt.trim().length >= minChars ? ac + '60' : 'rgba(139,92,246,0.15)'}`,
                  background: 'rgba(255,255,255,0.9)',
                  color: '#1e1b4b',
                  minHeight: 120,
                }}
              />
              <div className="flex items-center justify-between mt-1 mb-4">
                <span className="text-xs" style={{ color: state.prompt.trim().length >= minChars ? '#10b981' : '#9ca3af' }}>
                  {state.prompt.trim().length < minChars
                    ? `${minChars - state.prompt.trim().length} more characters to unlock evaluation`
                    : 'Ready to evaluate'}
                </span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>
                  {state.prompt.trim().length} chars
                </span>
              </div>

              {state.error && (
                <div className="rounded-xl px-4 py-3 mb-4 flex gap-2"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertTriangle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs leading-5" style={{ color: '#991b1b' }}>{state.error}</p>
                </div>
              )}

              <button
                onClick={onEvaluate}
                disabled={!canSubmit}
                className="btn-primary w-full sm:w-auto justify-center"
              >
                {state.isEvaluating
                  ? <><Loader2 size={15} className="animate-spin" /> Evaluating…</>
                  : <><Sparkles size={15} /> Evaluate My Prompt</>
                }
              </button>
            </>
          )}

          {/* Results */}
          {state.result && !state.isEvaluating && (
            <ResultsPanel
              result={state.result}
              challenge={challenge}
              showImproved={state.showImproved}
              onToggleImproved={onToggleImproved}
              copied={state.copied}
              onCopy={onCopy}
              onRetry={onRetry}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

function makeDefaultState(): ChallengeState {
  return { prompt: '', isEvaluating: false, result: null, showImproved: false, copied: false, error: null };
}

export default function SISPPromptLab() {
  const [apiKey, setApiKey]         = useState(() => loadApiKey());
  const [showKey, setShowKey]       = useState(false);
  const [keyDraft, setKeyDraft]     = useState(() => loadApiKey());
  const [keySaved, setKeySaved]     = useState(false);
  const [showKeyPanel, setShowKeyPanel] = useState(() => !loadApiKey());

  const [progress, setProgress]     = useState<ProgressMap>(() => loadProgress());
  const [openId, setOpenId]         = useState<string | null>(null);
  const [states, setStates]         = useState<Record<string, ChallengeState>>(
    () => Object.fromEntries(CHALLENGES.map(c => [c.id, makeDefaultState()]))
  );

  const updateState = useCallback((id: string, patch: Partial<ChallengeState>) => {
    setStates(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  const handleSaveKey = useCallback(() => {
    const trimmed = keyDraft.trim();
    persistApiKey(trimmed);
    setApiKey(trimmed);
    setKeySaved(true);
    setShowKeyPanel(false);
    setTimeout(() => setKeySaved(false), 2500);
  }, [keyDraft]);

  const handleEvaluate = useCallback(async (challenge: Challenge) => {
    if (!apiKey) { updateState(challenge.id, { error: 'Please save your Groq API key first. Get one free at console.groq.com — no credit card required.' }); return; }
    const prompt = states[challenge.id].prompt.trim();
    if (prompt.length < 80) return;

    updateState(challenge.id, { isEvaluating: true, error: null, result: null });
    try {
      const result = await callEvaluationAPI(apiKey, challenge, prompt);
      updateState(challenge.id, { isEvaluating: false, result });
      setProgress(prev => {
        const existing = prev[challenge.id];
        const attempts = (existing?.attempts ?? 0) + 1;
        const bestScore = Math.max(existing?.bestScore ?? 0, result.totalScore);
        const completed = bestScore >= 61;
        const next = { ...prev, [challenge.id]: { completed, bestScore, attempts } };
        saveProgress(next);
        return next;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Evaluation failed. Check your API key and try again.';
      updateState(challenge.id, { isEvaluating: false, error: msg });
    }
  }, [apiKey, states, updateState]);

  const handleCopy = useCallback((id: string) => {
    const text = states[id].result?.improvedPrompt ?? '';
    navigator.clipboard.writeText(text).then(() => {
      updateState(id, { copied: true });
      setTimeout(() => updateState(id, { copied: false }), 2200);
    });
  }, [states, updateState]);

  const completedCount = CHALLENGES.filter(c => progress[c.id]?.completed).length;

  return (
    <div className="space-y-6">

      {/* ── Intro header ────────────────────────────────────────── */}
      <div className="rounded-2xl px-6 py-5"
        style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.09), rgba(56,189,248,0.05))', border: `1.5px solid ${ACCENT}25` }}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${ACCENT}18` }}>
            <Brain size={22} style={{ color: ACCENT }} />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#1e1b4b' }}>SISP Prompt Engineering Lab</h2>
            <p className="text-xs mt-0.5 leading-5" style={{ color: '#0369a1' }}>
              MBI800 · Business Information Systems · Strategic IS Planning
            </p>
            <p className="text-sm mt-2 leading-6" style={{ color: '#374151' }}>
              Each challenge places you inside a real organisational scenario and asks you to craft a prompt
              that applies a core SISP concept — not describe it. Your prompt is evaluated across five
              dimensions by an AI model, giving you immediate, specific feedback on how to think and communicate
              as a strategic IS practitioner.
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs" style={{ color: '#0369a1' }}>
              <span>· 5 scenario-based challenges</span>
              <span>· AI-evaluated against SISP rubrics</span>
              <span>· Iterative — revise and resubmit freely</span>
              <span>· Progress saved locally in your browser</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Progress summary ─────────────────────────────────────── */}
      <div className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(139,92,246,0.10)' }}>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>
            Your Progress
          </p>
          <div className="flex gap-2 flex-wrap">
            {CHALLENGES.map(c => {
              const p = progress[c.id];
              const done = p?.completed;
              const attempted = (p?.attempts ?? 0) > 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setOpenId(id => id === c.id ? null : c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: done ? 'rgba(16,185,129,0.12)' : attempted ? `${c.accentColor}12` : 'rgba(0,0,0,0.04)',
                    color: done ? '#10b981' : attempted ? c.accentColor : '#9ca3af',
                    border: `1.5px solid ${done ? 'rgba(16,185,129,0.3)' : attempted ? c.accentColor + '30' : 'transparent'}`,
                  }}
                >
                  {done ? <CheckCircle size={12} /> : <Circle size={12} />}
                  {c.number}. {c.concept}
                  {p?.bestScore ? ` · ${p.bestScore}` : ''}
                </button>
              );
            })}
          </div>
        </div>
        <div className="text-center sm:text-right flex-shrink-0">
          <p className="text-2xl font-bold" style={{ color: completedCount > 0 ? '#10b981' : '#9ca3af' }}>
            {completedCount}<span className="text-base font-normal" style={{ color: '#9ca3af' }}>/5</span>
          </p>
          <p className="text-xs" style={{ color: '#9ca3af' }}>completed</p>
        </div>
      </div>

      {/* ── API Key panel ────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ border: `1.5px solid ${apiKey ? 'rgba(16,185,129,0.25)' : 'rgba(234,179,8,0.35)'}` }}>
        <button
          onClick={() => setShowKeyPanel(p => !p)}
          className="w-full flex items-center justify-between px-5 py-3 transition-all"
          style={{ background: apiKey ? 'rgba(16,185,129,0.05)' : 'rgba(234,179,8,0.06)' }}
        >
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
            style={{ color: apiKey ? '#10b981' : '#d97706' }}>
            <Key size={13} />
            {apiKey ? 'Groq API Key · Configured' : 'Groq API Key · Required to Evaluate (100% Free)'}
            {keySaved && <Check size={13} />}
          </span>
          <ChevronDown size={16} style={{
            color: apiKey ? '#10b981' : '#d97706',
            transform: showKeyPanel ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s',
          }} />
        </button>
        {showKeyPanel && (
          <div className="px-5 pb-5 pt-3 animate-fadeIn"
            style={{ borderTop: `1px solid ${apiKey ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.2)'}` }}>
            <p className="text-xs leading-5 mb-3" style={{ color: '#6b7280' }}>
              This lab uses the <strong>Groq API</strong> — completely free, no credit card required,
              no usage fees. Your key is stored only in this browser's localStorage and sent only to
              Groq's servers during evaluation. Get a free key at{' '}
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer"
                className="font-semibold underline" style={{ color: ACCENT }}>
                console.groq.com/keys
              </a>{' '}
              (sign up with email or Google, then click <em>Create API key</em>).
              Your key will start with <code className="font-mono">gsk_</code>.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyDraft}
                  onChange={e => setKeyDraft(e.target.value)}
                  placeholder="gsk_…"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all pr-10"
                  style={{ border: '1.5px solid rgba(139,92,246,0.20)', background: 'rgba(255,255,255,0.9)', color: '#1e1b4b' }}
                />
                <button onClick={() => setShowKey(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }}>
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button onClick={handleSaveKey} className="btn-primary flex-shrink-0">
                {keySaved ? <><Check size={14} /> Saved</> : 'Save Key'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Challenges ───────────────────────────────────────────── */}
      <div className="space-y-3">
        {CHALLENGES.map(challenge => (
          <ChallengePanel
            key={challenge.id}
            challenge={challenge}
            isOpen={openId === challenge.id}
            onToggle={() => setOpenId(id => id === challenge.id ? null : challenge.id)}
            progress={progress[challenge.id]}
            state={states[challenge.id]}
            onPromptChange={v => updateState(challenge.id, { prompt: v })}
            onEvaluate={() => handleEvaluate(challenge)}
            onToggleImproved={() => updateState(challenge.id, { showImproved: !states[challenge.id].showImproved })}
            onCopy={() => handleCopy(challenge.id)}
            onRetry={() => updateState(challenge.id, { result: null, showImproved: false, error: null })}
          />
        ))}
      </div>

      {/* ── Completion banner ───────────────────────────────────── */}
      {completedCount === CHALLENGES.length && (
        <div className="rounded-2xl px-6 py-5 text-center animate-scaleIn"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(5,150,105,0.06))', border: '1.5px solid rgba(16,185,129,0.30)' }}>
          <Trophy size={28} style={{ color: '#10b981', margin: '0 auto 8px' }} />
          <p className="text-sm font-bold" style={{ color: '#065f46' }}>
            All challenges completed!
          </p>
          <p className="text-xs mt-1" style={{ color: '#047857' }}>
            You've worked through all five SISP concept areas. Review your best scores above and reflect
            on which dimensions you found most challenging.
          </p>
        </div>
      )}
    </div>
  );
}
