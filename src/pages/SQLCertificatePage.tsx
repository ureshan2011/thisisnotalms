import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { BadgeCheck, Copy, Download, FileText, Linkedin, ShieldAlert } from 'lucide-react';
import { CERT_H, CERT_W, drawCertificate, loadCertFonts } from '../lib/sqlSandbox/certificate';
import { certLevelOf, certUrl, linkedInUrl, verifyCertificate, type VerifiedCert } from '../lib/sqlSandbox/progress';
import '../styles/blend.css';
import '../styles/sql-sandbox.css';

// ─── /sql-certificate/:id — a certificate, and proof that it is real ──────
// Public, no login. Anyone with the link (a recruiter on LinkedIn, say) sees
// the certificate as the class sheet has it on record, with a green
// "verified" line. The student gets the PNG, a PDF and an "Add to LinkedIn"
// button from the same page.

type State = { s: 'loading' } | { s: 'bad'; error: string } | { s: 'ok'; cert: VerifiedCert };

const fileBase = (c: VerifiedCert) => `${c.level.replace(/\s+/g, '-')}-${c.name.replace(/\s+/g, '-')}`;

export default function SQLCertificatePage() {
  const { id = '' } = useParams();
  const [state, setState] = useState<State>({ s: 'loading' });
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const qr = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let alive = true;
    setState({ s: 'loading' });
    verifyCertificate(id)
      .then(r => alive && setState(r.ok ? { s: 'ok', cert: r.cert } : { s: 'bad', error: r.error }))
      .catch(() => alive && setState({ s: 'bad', error: 'Could not reach the record. Check your connection and try again.' }));
    return () => {
      alive = false;
    };
  }, [id]);

  const cert = state.s === 'ok' ? state.cert : null;

  useEffect(() => {
    if (!cert) return;
    const prev = document.title;
    document.title = `${cert.level} · ${cert.name}`;
    let alive = true;
    void loadCertFonts().then(() => {
      if (!alive || !canvas.current) return;
      drawCertificate(canvas.current, {
        name: cert.name,
        kind: certLevelOf(cert.level),
        title: cert.level,
        issued: cert.issued,
        id: cert.id,
        qr: qr.current,
      });
    });
    return () => {
      alive = false;
      document.title = prev;
    };
  }, [cert]);

  const save = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const downloadPng = useCallback(() => {
    if (!canvas.current || !cert) return;
    setBusy('png');
    canvas.current.toBlob(b => {
      if (b) save(b, `${fileBase(cert)}.png`);
      setBusy(null);
    }, 'image/png');
  }, [cert]);

  const downloadPdf = useCallback(async () => {
    if (!canvas.current || !cert) return;
    setBusy('pdf');
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.current.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, 297, 210);
      pdf.setProperties({ title: `${cert.level} · ${cert.name}`, author: 'Yasas Sri Wickramasinghe', subject: `Certificate ${cert.id}` });
      save(pdf.output('blob'), `${fileBase(cert)}.pdf`);
    } finally {
      setBusy(null);
    }
  }, [cert]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(certUrl(id));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bt sb cert-page">
      <header className="sb-header">
        <div className="sb-header__row">
          <span className="sb-brand__tag">Certificate</span>
          <Link to="/sql-sandbox?tab=cert" className="sb-tool">
            My certificates
          </Link>
        </div>
      </header>

      <main className="sb-main cert-main">
        {state.s === 'loading' && <p className="sb-muted">Checking this certificate…</p>}

        {state.s === 'bad' && (
          <div className="sb-card cert-bad">
            <ShieldAlert size={26} />
            <div>
              <p className="sb-step__task">This certificate could not be verified.</p>
              <p>{state.error}</p>
              <p className="sb-muted">Check the ID is typed exactly as printed on the certificate.</p>
            </div>
          </div>
        )}

        {cert && (
          <>
            <div className="cert-verified" role="status">
              <BadgeCheck size={22} />
              <div>
                <strong>Verified.</strong> Issued to {cert.name} on{' '}
                {new Date(cert.issued).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
                <span className="sb-muted"> ID {cert.id}</span>
              </div>
            </div>

            <div className="cert-poster">
              <canvas ref={canvas} width={CERT_W} height={CERT_H} aria-label={`${cert.level} awarded to ${cert.name}`} />
            </div>

            <div className="cert-actions">
              <button type="button" className="bt-btn" onClick={downloadPng} disabled={busy !== null}>
                {busy === 'png' ? 'Preparing…' : 'Download image'}
                <span className="bt-btn__badge" aria-hidden="true">
                  <Download size={14} />
                </span>
              </button>
              <a className="bt-btn bt-btn--dark" href={linkedInUrl(cert)} target="_blank" rel="noopener noreferrer">
                Add to LinkedIn
                <span className="bt-btn__badge" aria-hidden="true">
                  <Linkedin size={14} />
                </span>
              </a>
              <button type="button" className="sb-tool cert-tool" onClick={() => void downloadPdf()} disabled={busy !== null}>
                <FileText size={15} /> {busy === 'pdf' ? 'Preparing…' : 'PDF'}
              </button>
              <button type="button" className="sb-tool cert-tool" onClick={() => void copy()}>
                <Copy size={15} /> {copied ? 'Link copied' : 'Copy link'}
              </button>
            </div>

            <p className="sb-muted cert-help">
              On LinkedIn, &quot;Add to LinkedIn&quot; fills in the form for you, with a link anyone can use to check this certificate. To show the
              poster in a post, attach the downloaded image.
            </p>
          </>
        )}
      </main>

      {/* The QR code is drawn here, off screen, and copied onto the poster. */}
      {cert && (
        <div className="cert-qr" aria-hidden="true">
          <QRCodeCanvas ref={qr} value={certUrl(cert.id)} size={260} level="M" marginSize={0} />
        </div>
      )}
    </div>
  );
}
