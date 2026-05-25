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
  const [status, setStatus] = useState<'loading' | 'found' | 'notfound'>('loading');
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#f0f4ff,#e8f4fd,#f5f3ff)' }}>
      {/* Nav */}
      <div className="max-w-xl mx-auto px-4 pt-6">
        <Link to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline mb-4"
          style={{ color: '#4338ca' }}>
          <ArrowLeft size={15} /> Back to YooBees
        </Link>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-12">
        {/* Loading */}
        {status === 'loading' && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
          </div>
        )}

        {/* Not found */}
        {status === 'notfound' && (
          <div className="rounded-2xl p-8 text-center border"
            style={{ background: 'rgba(254,226,226,0.8)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <ShieldX size={40} style={{ color: '#dc2626', margin: '0 auto 12px' }} />
            <p className="text-lg font-bold" style={{ color: '#991b1b' }}>
              Certificate Not Found
            </p>
            <p className="text-sm mt-2" style={{ color: '#b91c1c' }}>
              The certificate ID <code className="font-mono bg-red-100 px-1 rounded">{certId}</code> is invalid or does not exist.
            </p>
          </div>
        )}

        {/* Found */}
        {status === 'found' && certData && (
          <div className="space-y-4">
            {/* Verified badge */}
            <div className="rounded-xl px-4 py-3 flex items-center gap-3 border"
              style={{ background: 'rgba(209,250,229,0.8)', borderColor: 'rgba(16,185,129,0.3)' }}>
              <ShieldCheck size={20} style={{ color: '#059669', flexShrink: 0 }} />
              <div>
                <p className="text-sm font-bold" style={{ color: '#065f46' }}>
                  Verified Certificate
                </p>
                <p className="text-xs" style={{ color: '#047857' }}>
                  This certificate was issued by YooBees and is authentic.
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
