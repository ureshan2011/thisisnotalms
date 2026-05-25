import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ShieldCheck, ShieldX, ArrowLeft } from 'lucide-react';
import { db } from '../lib/firebase';
import { SQL_EXAM_CERTIFICATES_COLLECTION } from '../lib/sqlExamData';
import SQLExamCertificate from '../components/quiz/SQLExamCertificate';

interface CertData {
  certId: string;
  studentName: string;
  studentDisplayId: string;
  score: number;
  total: number;
  percentage: number;
  issuedAt: Date;
}

export default function CertificateView() {
  const { certId } = useParams<{ certId: string }>();
  const [status, setStatus]     = useState<'loading' | 'found' | 'notfound'>('loading');
  const [certData, setCertData] = useState<CertData | null>(null);

  useEffect(() => {
    if (!certId) { setStatus('notfound'); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, SQL_EXAM_CERTIFICATES_COLLECTION, certId));
        if (snap.exists()) {
          const d = snap.data();
          setCertData({
            certId: d.certId,
            studentName: d.studentName,
            studentDisplayId: d.studentDisplayId ?? '',
            score: d.score,
            total: d.total,
            percentage: d.percentage,
            issuedAt: d.issuedAt?.toDate?.() ?? new Date(),
          });
          setStatus('found');
        } else {
          setStatus('notfound');
        }
      } catch {
        setStatus('notfound');
      }
    })();
  }, [certId]);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Nav */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 0' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 13, color: '#6b7280', textDecoration: 'none',
          marginBottom: 16,
        }}>
          <ArrowLeft size={14} /> Back to YooBees
        </Link>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px 48px' }}>

        {/* Loading */}
        {status === 'loading' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="w-7 h-7 rounded-full border-2 animate-spin"
              style={{ borderColor: '#e5e7eb', borderTopColor: '#374151' }} />
          </div>
        )}

        {/* Not found */}
        {status === 'notfound' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '48px 24px', textAlign: 'center',
            background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 10,
          }}>
            <ShieldX size={36} style={{ color: '#9ca3af', marginBottom: 12 }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>
              Certificate not found
            </p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
              The ID <code style={{ fontFamily: 'monospace', background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>{certId}</code> doesn't match any issued certificate.
            </p>
          </div>
        )}

        {/* Found */}
        {status === 'found' && certData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Verified badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
            }}>
              <ShieldCheck size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#15803d', margin: 0 }}>
                  Verified certificate
                </p>
                <p style={{ fontSize: 11, color: '#16a34a', margin: 0 }}>
                  Issued by YooBees Learning Platform. This certificate is authentic.
                </p>
              </div>
            </div>

            <SQLExamCertificate
              certId={certData.certId}
              studentName={certData.studentName}
              studentDisplayId={certData.studentDisplayId}
              score={certData.score}
              total={certData.total}
              percentage={certData.percentage}
              issuedAt={certData.issuedAt}
              inline
            />
          </div>
        )}
      </div>
    </div>
  );
}
