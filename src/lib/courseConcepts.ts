// ─── Curated course concept pools ─────────────────────────────────
// Short glossary terms that float as glowing particles on the pre-class
// "Idea Swarm" display. Keep terms 1–2 words so the word-sprites stay
// legible at small sizes. No student data — just course vocabulary.

import type { CourseCode } from './courseTheme';

export const COURSE_CONCEPTS: Record<CourseCode, string[]> = {
  // MBI800 — Strategic Information System Planning
  MBI800: [
    'Strategy', 'Value Chain', 'SWOT', "Porter's 5", 'Alignment',
    'Governance', 'Roadmap', 'Stakeholders', 'BPR', 'Digital',
    'Capability', 'KPI', 'Outsourcing', 'ROI', 'Disruption',
    'Vision', 'Competitive Edge', 'IS Strategy', 'Innovation', 'Agility',
    'Business Case', 'Portfolio', 'Maturity', 'Transformation',
  ],
  // MBI802 — Database Management Systems
  MBI802: [
    'SELECT', 'JOIN', 'Normalization', 'Primary Key', 'Foreign Key',
    'Index', 'Transaction', 'ACID', 'Schema', 'ER Model',
    'Aggregate', 'GROUP BY', 'Subquery', 'Trigger', 'View',
    'WHERE', 'Constraint', 'Relation', 'Tuple', 'Cardinality',
    'Query Plan', 'Concurrency', 'Rollback', 'Entity',
  ],
  // MBI804 — IT Project Management
  MBI804: [
    'Scope', 'Gantt', 'Agile', 'Scrum', 'Sprint',
    'Risk', 'Stakeholder', 'Milestone', 'Budget', 'WBS',
    'Critical Path', 'Kanban', 'Backlog', 'Charter', 'Deliverable',
    'Velocity', 'Baseline', 'Retrospective', 'Triple Constraint',
    'Resource', 'Quality', 'Procurement', 'Lessons Learned', 'Standup',
  ],
};

export function getConcepts(code: CourseCode): string[] {
  return COURSE_CONCEPTS[code];
}
