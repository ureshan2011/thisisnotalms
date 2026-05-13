import { motion } from 'framer-motion';
import { Flag, Trophy } from 'lucide-react';
import type { SqlRaceChallenge, SqlRaceSubmission } from '../../lib/sqlRaceTypes';
import {
  computeRacePositions, SECTION_COLORS, getSectionDisplayName, getSectionShortName,
  pointsToOvertake,
} from '../../lib/sqlRaceTypes';

interface Props {
  challenges: SqlRaceChallenge[];
  submissions: SqlRaceSubmission[];
  sectionStudentCounts?: Record<string, number>;
}

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣'];

function CarIcon({ color }: { color: string }) {
  return (
    <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
      <rect x="4" y="8" width="36" height="12" rx="3" fill={color} />
      <rect x="12" y="3" width="20" height="9" rx="3" fill={color} style={{ filter: 'brightness(1.2)' }} />
      <rect x="14" y="4" width="16" height="6" rx="2" fill="rgba(255,255,255,0.35)" />
      <circle cx="11" cy="20" r="4" fill="#1f2937" />
      <circle cx="11" cy="20" r="2" fill="#6b7280" />
      <circle cx="33" cy="20" r="4" fill="#1f2937" />
      <circle cx="33" cy="20" r="2" fill="#6b7280" />
      <rect x="4" y="10" width="36" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

export default function RaceTrack({ challenges, submissions, sectionStudentCounts = {} }: Props) {
  const positions = computeRacePositions(submissions, challenges, sectionStudentCounts);
  const leadPosition = positions[0];
  const activeChallengeCount = challenges.filter(c => c.status === 'active').length;
  const totalPoints = challenges.reduce((sum, c) => sum + c.pointValue, 0);

  // Recent activity: last 5 correct submissions sorted newest-first
  const recentActivity = [...submissions]
    .filter(s => s.isCorrect)
    .sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0))
    .slice(0, 5);

  return (
    <div className="card p-5 overflow-hidden space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
          <Trophy size={18} className="text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-sm">Live Race</h3>
          <p className="text-xs text-gray-500">
            {totalPoints > 0
              ? `${totalPoints} pts total · ${activeChallengeCount} challenge${activeChallengeCount !== 1 ? 's' : ''} active`
              : 'Waiting for challenges…'}
          </p>
        </div>
        {leadPosition.totalMarks > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Leading</p>
            <p className="text-sm font-black" style={{ color: leadPosition.color }}>
              {getSectionDisplayName(leadPosition.section)}
            </p>
          </div>
        )}
      </div>

      {/* 3D Track */}
      <div style={{ perspective: '520px', perspectiveOrigin: '50% 10%' }}>
        <div
          style={{
            transform: 'rotateX(18deg)',
            transformOrigin: 'top center',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #1c1917 0%, #292524 100%)',
              padding: '0 0 4px 0',
              position: 'relative',
            }}
          >
            {/* Distance markers */}
            {[25, 50, 75].map(pct => (
              <div
                key={pct}
                style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  left: `calc(${pct}% + 52px)`,
                  width: '1px',
                  background: 'rgba(255,255,255,0.08)',
                  zIndex: 0,
                }}
              />
            ))}

            {/* Start line */}
            <div
              style={{
                position: 'absolute',
                top: 0, bottom: 0,
                left: '52px',
                width: '3px',
                background: 'repeating-linear-gradient(to bottom, #fff 0px, #fff 6px, transparent 6px, transparent 12px)',
                opacity: 0.6,
                zIndex: 1,
              }}
            />

            {/* Finish flag */}
            <div
              style={{ position: 'absolute', top: 0, bottom: 0, right: '8px', display: 'flex', alignItems: 'center', zIndex: 2 }}
            >
              <Flag size={16} className="text-white opacity-80" />
            </div>

            {/* Lanes */}
            {positions.map((pos, i) => {
              const isLeading = i === 0 && pos.totalMarks > 0;

              return (
                <div
                  key={pos.section}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 36px 8px 8px',
                    borderBottom: i < positions.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    position: 'relative',
                    background: isLeading ? 'rgba(255,255,255,0.03)' : 'transparent',
                  }}
                >
                  {/* Section label + medal */}
                  <div style={{ width: '44px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                    <span style={{ fontSize: '13px', lineHeight: 1 }}>{MEDALS[i]}</span>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.05em' }}>
                      {getSectionShortName(pos.section)}
                    </span>
                  </div>

                  {/* Lane track */}
                  <div style={{ flex: 1, position: 'relative', height: '32px', marginRight: '4px' }}>
                    {/* Track groove */}
                    <div style={{ position: 'absolute', inset: '10px 0', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
                    {/* Progress fill */}
                    <motion.div
                      style={{
                        position: 'absolute', inset: '12px 0', borderRadius: '4px',
                        background: `linear-gradient(90deg, ${pos.color}40, ${pos.color}20)`,
                        transformOrigin: 'left',
                      }}
                      animate={{ scaleX: pos.progressPct }}
                      transition={{ type: 'spring', stiffness: 40, damping: 15 }}
                    />
                    {/* Car */}
                    <motion.div
                      style={{ position: 'absolute', top: '50%', translateY: '-50%', width: '44px' }}
                      animate={{ left: `${pos.progressPct * 84}%` }}
                      transition={{ type: 'spring', stiffness: 40, damping: 15 }}
                    >
                      <CarIcon color={pos.color} />
                      {isLeading && pos.totalMarks > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-4px', fontSize: '10px' }}>🔥</span>
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score legend */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {positions.map((pos, i) => {
          const gap = i > 0 && leadPosition.totalMarks > 0
            ? pointsToOvertake(leadPosition, pos)
            : null;

          return (
            <div
              key={pos.section}
              className="rounded-xl px-3 py-2 flex flex-col gap-0.5 relative overflow-hidden"
              style={{ background: `${pos.color}12`, border: `1px solid ${pos.color}30` }}
            >
              {i === 0 && pos.totalMarks > 0 && (
                <div
                  className="absolute top-0 right-0 px-1.5 py-0.5 rounded-bl-lg text-[9px] font-black"
                  style={{ background: pos.color, color: 'white' }}
                >
                  LEAD
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pos.color }} />
                <span className="text-[10px] font-semibold text-gray-700 truncate">
                  {getSectionDisplayName(pos.section)}
                </span>
              </div>
              <p className="text-base font-bold" style={{ color: pos.color }}>
                {pos.totalMarks} <span className="text-xs font-normal text-gray-400">pts</span>
              </p>
              <p className="text-[10px] text-gray-400">
                {pos.uniqueContributors}/{pos.studentCount} students
              </p>
              {gap !== null && (
                <p className="text-[9px] font-semibold mt-0.5" style={{ color: pos.color }}>
                  +{gap} pts to lead
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Live activity feed */}
      {recentActivity.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Recent correct answers</p>
          {recentActivity.map(sub => {
            const color = SECTION_COLORS[sub.studentSection] ?? '#8b5cf6';
            return (
              <div key={sub.id} className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="font-semibold text-gray-700 truncate flex-1">
                  {sub.studentName || 'A student'}
                </span>
                <span
                  className="font-bold flex-shrink-0 px-1.5 py-0.5 rounded-md text-[10px]"
                  style={{ background: `${color}15`, color }}
                >
                  +{sub.marksAwarded}pts
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
