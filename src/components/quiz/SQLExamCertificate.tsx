import { useState } from 'react';
import { X, ShieldCheck, Linkedin, Copy, Check, ExternalLink } from 'lucide-react';
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
  inline?: boolean;
}

const CERT_BASE_URL = 'https://ureshan2011.github.io/YooBees/#/certificate/';

function buildPost(certUrl: string, percentage: number): string {
  return `Just passed the SQL Fundamentals Exam on YooBees with ${percentage}% and earned a verified certificate.\n\nThe platform covers ER diagrams, SQL Grand Prix races, and 1v1 Arena duels. A genuinely well-built learning environment by Dr. Yasas Sri Wickramasinghe at Yoobee College of Creative Innovation.\n\nVerify my certificate: ${certUrl}\n\nTag: @Dr. Yasas Sri Wickramasinghe (https://nz.linkedin.com/in/yasassri)\n@Yoobee College of Creative Innovation (https://nz.linkedin.com/school/yoobeecollegeofcreativeinnovation/)\n\n#YooBees #Yoobee #technology #MBI #studentfeedback #successstories #SQL #DatabaseManagement`;
}

export default function SQLExamCertificate({
  certId, studentName, studentDisplayId, score, total, percentage, issuedAt, onClose, inline,
}: Props) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [postCopied, setPostCopied] = useState(false);

  const certUrl    = `${CERT_BASE_URL}${certId}`;
  const issuedDate = format(issuedAt, 'MMMM d, yyyy');
  const postText   = buildPost(certUrl, percentage);

  function copyLink() {
    navigator.clipboard.writeText(certUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
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
    <div style={{ padding: inline ? 0 : 16, maxWidth: 560, margin: '0 auto' }}>
      {/* Close */}
      {onClose && !inline && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── Certificate ──────────────────────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #1f2937',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        {/* Amber accent bar */}
        <div style={{ height: 4, background: '#ca8a04' }} />

        {/* Main body */}
        <div style={{ padding: '36px 44px 28px', textAlign: 'center' }}>
          {/* Wordmark */}
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: '#9ca3af',
            marginBottom: 28,
          }}>
            YooBees · Learning Platform
          </p>

          {/* Title */}
          <p style={{
            fontSize: 20, fontWeight: 800, color: '#111827',
            letterSpacing: '-0.3px', margin: 0,
          }}>
            Certificate of Achievement
          </p>

          {/* Amber divider */}
          <div style={{ width: 36, height: 2, background: '#ca8a04', margin: '14px auto 22px' }} />

          {/* Recipient */}
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
            Presented to
          </p>
          <p style={{
            fontSize: 26, fontWeight: 700, color: '#111827',
            letterSpacing: '-0.4px', lineHeight: 1.2, margin: 0,
          }}>
            {studentName || 'Student'}
          </p>
          {studentDisplayId && (
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 5, marginBottom: 22, letterSpacing: '0.3px' }}>
              {studentDisplayId}
            </p>
          )}
          {!studentDisplayId && <div style={{ height: 22 }} />}

          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
            for completing the
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 20 }}>
            SQL Fundamentals Certificate Exam
          </p>

          {/* Score pills */}
          <div style={{ display: 'inline-flex', gap: 8, marginBottom: 22 }}>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#92400e',
              background: '#fef3c7', border: '1px solid #fde68a',
              padding: '4px 14px', borderRadius: 100,
            }}>
              {score} / {total} correct
            </span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#374151',
              background: '#f9fafb', border: '1px solid #e5e7eb',
              padding: '4px 14px', borderRadius: 100,
            }}>
              {percentage}%
            </span>
          </div>

          <p style={{ fontSize: 11, color: '#9ca3af' }}>
            Issued {issuedDate}
          </p>
        </div>

        {/* Verification footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
          padding: '11px 22px',
          background: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <ShieldCheck size={12} style={{ color: '#16a34a' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#15803d', letterSpacing: '0.8px' }}>
              VERIFIED
            </span>
          </div>
          <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace', letterSpacing: '0.2px' }}>
            {certId}
          </span>
          <span style={{ fontSize: 10, color: '#9ca3af' }}>
            ureshan2011.github.io/YooBees
          </span>
        </div>
      </div>

      {/* ── LinkedIn share section ───────────────────────────────────────── */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', marginTop: 16 }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#f9fafb',
          borderBottom: '1px solid #f3f4f6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Linkedin size={14} style={{ color: '#0a66c2' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
              Post preview
            </span>
          </div>
          <button onClick={copyPost} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: '#6b7280', background: 'none',
            border: 'none', cursor: 'pointer', padding: '3px 8px', borderRadius: 6,
          }}>
            {postCopied ? <Check size={13} style={{ color: '#16a34a' }} /> : <Copy size={13} />}
            {postCopied ? 'Copied' : 'Copy text'}
          </button>
        </div>

        {/* Post body */}
        <div style={{ padding: '14px 16px', background: '#ffffff' }}>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, whiteSpace: 'pre-line', margin: 0 }}>
            {postText}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          padding: '10px 14px',
          background: '#f9fafb',
          borderTop: '1px solid #f3f4f6',
        }}>
          <button onClick={shareLinkedIn} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: '#ffffff',
            background: '#0a66c2', border: 'none', cursor: 'pointer',
            padding: '7px 14px', borderRadius: 7,
          }}>
            <Linkedin size={14} /> Share on LinkedIn
          </button>
          <button onClick={copyLink} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, fontWeight: 500, color: '#6b7280',
            background: 'none', cursor: 'pointer',
            border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: 7,
          }}>
            {linkCopied ? <Check size={13} style={{ color: '#16a34a' }} /> : <Copy size={13} />}
            {linkCopied ? 'Copied' : 'Copy link'}
          </button>
          <a href={certUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, fontWeight: 500, color: '#6b7280',
            textDecoration: 'none',
            border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: 7,
          }}>
            <ExternalLink size={13} /> Open certificate
          </a>
        </div>
      </div>
    </div>
  );
}
