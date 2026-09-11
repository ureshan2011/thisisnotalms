import { useState } from 'react';
import { NOTES_PASSWORD, downloadNotes, type NotesDoc } from '../../lib/notesPdf';

// ─── Save these notes as a PDF ────────────────────────────────────────────
// Builds the document in the browser, encrypts it, and hands it over. The
// panel below the button tells the reader the password up front, because a
// file they cannot open is worse than no file — and shows the two notices
// the document itself carries, so nobody is surprised by them.
//
// The PDF is not the page. It is a written condensation declared per page in
// src/content/notes/, so the reader gets notes rather than a printout of
// dead widgets.

type State = 'idle' | 'working' | 'done' | 'failed';

export default function SaveAsPdf({ doc }: { doc: NotesDoc }) {
  const [state, setState] = useState<State>('idle');
  const [copied, setCopied] = useState(false);

  async function save() {
    setState('working');
    try {
      await downloadNotes(doc);
      setState('done');
    } catch {
      setState('failed');
    }
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(NOTES_PASSWORD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="bt-savepdf" aria-labelledby="savepdf-heading">
      <div className="bt-savepdf__main">
        <p className="bt-eyebrow">Take it with you</p>
        <h2 id="savepdf-heading">
          Save these as notes<span className="bt-stop">.</span>
        </h2>
        <p className="bt-savepdf__lead">
          A written summary of this page as a PDF: the explanations, tables and steps, without the interactive
          parts. Handy on a phone, or printed out.
        </p>

        <div className="bt-savepdf__actions">
          <button type="button" className="bt-btn" onClick={save} disabled={state === 'working'}>
            {state === 'working' ? 'Building the document' : state === 'done' ? 'Download again' : 'Save as PDF'}
            <span className="bt-btn__badge" aria-hidden="true">↓</span>
          </button>

          <span className="bt-savepdf__pw">
            <span className="bt-savepdf__pwlabel">Password to open it</span>
            <button type="button" className="bt-savepdf__code" onClick={copyPassword} title="Copy the password">
              <code>{NOTES_PASSWORD}</code>
              <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </span>
        </div>

        <p className="bt-savepdf__status" aria-live="polite">
          {state === 'done' && 'Downloaded. Your PDF reader will ask for the password above before it opens.'}
          {state === 'failed' && 'That didn’t work. Try again, and if it keeps failing tell me which browser you’re on.'}
          {state === 'idle' && 'Built here in your browser. Nothing is uploaded and no account is needed.'}
          {state === 'working' && 'One moment, laying out the pages.'}
        </p>
      </div>

      <div className="bt-savepdf__meta">
        <div>
          <h3>Extra reading only</h3>
          <p>
            A summary, not the primary lesson content. Your LMS holds the authoritative material, assessments,
            deadlines and announcements.
          </p>
        </div>
        <div>
          <h3>© {new Date().getFullYear()} Yasas Sri Wickramasinghe</h3>
          <p>
            All rights reserved. For enrolled students, for personal study. Not for redistribution, re-upload
            to study-notes services, or training automated systems.
          </p>
        </div>
      </div>
    </section>
  );
}
