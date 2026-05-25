import { useState } from 'react';
import { X, Linkedin, Copy, Check, ExternalLink, Award, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  certId: string;
  studentName: string;
  studentDisplayId: string;
  score: number;
  total: number;
  percentage: number;
  issuedAt: Date;
  onClose?: () => void;
  /** When true renders inline (no close button, no overlay styling) */
  inline?: boolean;
}

const CERT_BASE_URL = 'https://ureshan2011.github.io/YooBees/#/certificate/';

const LINKEDIN_POST_TEXT = (name: string, certUrl: string) =>
  `I'm thrilled to share that I've just earned my SQL Fundamentals Certificate on YooBees — an innovative learning platform! 🎓\n\nA huge thank you to Ureshan for creating such an engaging and practical learning experience.\n\nVerify my certificate here: ${certUrl}\n\n#SQL #DatabaseManagement #YooBees #LearningAndDevelopment #NewSkills #DataSkills`;

export default function SQLExamCertificate({
  certId, studentName, studentDisplayId, score, total, percentage, issuedAt, onClose, inline,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [postCopied, setPostCopied] = useState(false);

  const certUrl = `${CERT_BASE_URL}${certId}`;
  const issuedDate = format(issuedAt, 'MMMM d, yyyy');
  const postText = LINKEDIN_POST_TEXT(studentName, certUrl);

  function copyLink() {
    navigator.clipboard.writeText(certUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function copyPost() {
    navigator.clipboard.writeText(postText).then(() => {
      setPostCopied(true);
      setTimeout(() => setPostCopied(false), 2500);
    });
  }

  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  }

  return (
    <div className="space-y-4 p-4">
      {/* Close button */}
      {onClose && !inline && (
        <div className="flex justify-end">
          <button onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Close">
            <X size={18} style={{ color: '#6b7280' }} />
          </button>
        </div>
      )}

      {/* ── Certificate Card ─────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border-2"
        style={{ borderColor: 'rgba(180,147,0,0.5)', background: '#fffbeb' }}>

        {/* Gold header bar */}
        <div className="px-6 py-4 text-center"
          style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb,#1e3a5f)' }}>
          <p className="text-xs font-bold tracking-widest uppercase text-blue-200 mb-1">
            YooBees Learning Platform
          </p>
          <p className="text-lg font-extrabold text-white">
            Certificate of Achievement
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-center space-y-3"
          style={{ background: 'linear-gradient(135deg,#fffbeb,#fefce8)' }}>
          <Award size={40} style={{ color: '#b45309', margin: '0 auto' }} />

          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#78716c' }}>
            This certifies that
          </p>

          <p className="text-2xl font-extrabold" style={{ color: '#1c1917', lineHeight: 1.2 }}>
            {studentName || 'Student'}
          </p>
          {studentDisplayId && (
            <p className="text-xs font-medium" style={{ color: '#78716c' }}>
              ID: {studentDisplayId}
            </p>
          )}

          <p className="text-xs uppercase tracking-widest font-semibold mt-2" style={{ color: '#78716c' }}>
            has successfully passed
          </p>

          <p className="text-base font-bold" style={{ color: '#1e3a5f' }}>
            SQL Fundamentals Certificate Exam
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: 'rgba(180,83,9,0.12)', color: '#b45309', border: '1px solid rgba(180,83,9,0.25)' }}>
            Score: {score}/{total} — {percentage}%
          </div>

          <p className="text-xs" style={{ color: '#78716c' }}>
            Issued on {issuedDate}
          </p>

          {/* Divider */}
          <div className="border-t my-3" style={{ borderColor: 'rgba(180,147,0,0.3)' }} />

          {/* Verification */}
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} style={{ color: '#059669' }} />
            <p className="text-xs font-mono" style={{ color: '#374151' }}>
              {certId}
            </p>
          </div>
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            Verify at: yoobees.app/certificate
          </p>
        </div>

        {/* Footer stripe */}
        <div className="px-6 py-2 text-center"
          style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb,#1e3a5f)' }}>
          <p className="text-xs text-blue-200 font-medium">
            ureshan2011.github.io/YooBees
          </p>
        </div>
      </div>

      {/* ── LinkedIn Share Section ───────────────────────────────── */}
      <div className="rounded-2xl border p-4 space-y-3"
        style={{ background: 'rgba(240,247,255,0.9)', borderColor: 'rgba(37,99,235,0.2)' }}>
        <p className="text-sm font-bold" style={{ color: '#1e3a5f' }}>
          Share on LinkedIn
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={shareLinkedIn}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: '#0a66c2' }}>
            <Linkedin size={16} /> Share on LinkedIn
          </button>
          <button onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
            style={{
              borderColor: 'rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.08)',
              color: '#4338ca',
            }}>
            {copied ? <Check size={15} style={{ color: '#059669' }} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <a href={certUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#4338ca' }}>
            <ExternalLink size={15} /> Open Certificate
          </a>
        </div>

        {/* Suggested post */}
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>
            Suggested LinkedIn post — copy and paste:
          </p>
          <div className="relative">
            <div className="rounded-xl p-3 pr-10 text-xs leading-5 font-mono border whitespace-pre-wrap"
              style={{
                background: '#fff',
                borderColor: 'rgba(37,99,235,0.2)',
                color: '#374151',
                maxHeight: 180,
                overflowY: 'auto',
              }}>
              {postText}
            </div>
            <button onClick={copyPost}
              className="absolute top-2 right-2 p-1.5 rounded-lg transition-colors"
              style={{ background: postCopied ? 'rgba(5,150,105,0.1)' : 'rgba(99,102,241,0.1)' }}
              title="Copy post text">
              {postCopied
                ? <Check size={14} style={{ color: '#059669' }} />
                : <Copy size={14} style={{ color: '#4338ca' }} />}
            </button>
          </div>
          <p className="text-xs mt-1.5" style={{ color: '#9ca3af' }}>
            Paste this into your LinkedIn post after clicking "Share on LinkedIn".
          </p>
        </div>
      </div>
    </div>
  );
}
