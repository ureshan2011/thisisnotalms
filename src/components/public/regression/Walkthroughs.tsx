import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell, Calendar, Code, Eye, File, FileArchive, FileSpreadsheet, Folder, FolderPlus, HardDrive, Key, List,
  MessageSquare, Paperclip, Plus, RefreshCw, Search, Send, SquarePen, Table, Upload, Users,
} from 'lucide-react';
import Demo, { type DemoStep } from './Demo';

// ─── The three drawn walkthroughs ─────────────────────────────────────────
// Unzipping the download, uploading the CSV into Colab, and sending the
// report in Teams. All three happen on screens that need you signed in, or
// on your own laptop, so they are drawn from the real layouts rather than
// captured. Each element the cursor visits carries a data-target the Demo
// frame looks up.

export const REPORT_FILE = 'MBI806B-LR-Lab-YourName.pdf';
const fade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.3 } };

/* ── 1. Unzip ─────────────────────────────────────────────────────────── */

type OS = 'mac' | 'windows';

const MAC_STEPS: DemoStep[] = [
  { caption: <>Open your <b>Downloads</b> folder. Kaggle's file is called <b>archive.zip</b>, and it's tiny: about 16 KB.</>, cursor: 'zip' },
  { caption: <><b>Double-click</b> it. Your Mac unzips it on the spot. If you use Safari it may have done this for you already.</>, cursor: 'zip', click: true },
  { caption: <>Now there's a file called <b>insurance.csv</b>, sometimes inside a folder called archive. That's the one you'll upload. Leave the zip alone.</>, cursor: 'csv' },
];

const WIN_STEPS: DemoStep[] = [
  { caption: <>Open your <b>Downloads</b> folder. Kaggle's file is called <b>archive.zip</b>, and it's tiny: about 16 KB.</>, cursor: 'zip' },
  { caption: <><b>Right-click</b> it and choose <b>Extract All…</b></>, cursor: 'extract', click: true },
  { caption: <>A box opens asking where to put the files. The suggested place is fine. Click <b>Extract</b>.</>, cursor: 'extractbtn', click: true },
  { caption: <>Windows opens a new folder called archive. Inside is <b>insurance.csv</b>. That's the one you'll upload.</>, cursor: 'csv' },
];

function DeskItem({ icon, name, size, on, target }: { icon: 'zip' | 'csv' | 'folder'; name: string; size?: string; on?: boolean; target?: string }) {
  const Icon = icon === 'zip' ? FileArchive : icon === 'csv' ? FileSpreadsheet : Folder;
  const colour = icon === 'csv' ? '#1d7044' : icon === 'zip' ? '#8a6d3b' : '#3b82f6';
  return (
    <motion.div className={`lr-desk__item${on ? ' is-on' : ''}`} data-target={target} {...fade}>
      <Icon size={40} color={colour} strokeWidth={1.4} aria-hidden="true" />
      <span>{name}</span>
      {size && <small>{size}</small>}
    </motion.div>
  );
}

export function UnzipDemo() {
  const [os, setOs] = useState<OS>('mac');
  const steps = os === 'mac' ? MAC_STEPS : WIN_STEPS;

  return (
    <div>
      <div className="lr-pills" role="group" aria-label="Which computer are you on?" style={{ marginTop: 18 }}>
        <button type="button" aria-pressed={os === 'mac'} onClick={() => setOs('mac')}>Mac</button>
        <button type="button" aria-pressed={os === 'windows'} onClick={() => setOs('windows')}>Windows</button>
      </div>
      <Demo key={os} tag={`Drawn for this lab · ${os === 'mac' ? 'Mac Finder' : 'Windows File Explorer'}`} steps={steps}>
        {step => {
          const extracted = os === 'mac' ? step >= 2 : step >= 3;
          return (
            <div className="lr-desk">
              <div className="lr-desk__win">
                <div className="lr-desk__title">
                  <Folder size={14} aria-hidden="true" /> {os === 'windows' && extracted ? 'archive' : 'Downloads'}
                </div>
                <div className="lr-desk__grid">
                  <AnimatePresence>
                    {!(os === 'windows' && extracted) && (
                      <DeskItem key="zip" icon="zip" name="archive.zip" size="16 KB" on={step === 1 || (os === 'windows' && step === 2)} target="zip" />
                    )}
                    {extracted && <DeskItem key="csv" icon="csv" name="insurance.csv" size="55 KB" on target="csv" />}
                  </AnimatePresence>
                </div>
              </div>
              <AnimatePresence>
                {os === 'windows' && step === 1 && (
                  <motion.div key="ctx" className="lr-ctx" style={{ left: 120, top: 92 }} {...fade}>
                    <div>Open</div>
                    <div data-target="extract" className="is-on">Extract All…</div>
                    <div>Share</div>
                    <div>Copy as path</div>
                  </motion.div>
                )}
                {os === 'windows' && step === 2 && (
                  <motion.div key="dlg" className="lr-picker" {...fade}>
                    <div className="lr-picker__head">Extract Compressed (Zipped) Folders</div>
                    <div className="lr-picker__row">Files will be extracted to this folder:</div>
                    <div className="lr-picker__row" style={{ fontFamily: 'monospace', fontSize: 11 }}>C:\Users\you\Downloads\archive</div>
                    <div className="lr-picker__foot">
                      <span className="is-go" data-target="extractbtn">Extract</span>
                      <span>Cancel</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }}
      </Demo>
    </div>
  );
}

/* ── 2. Upload into Colab ─────────────────────────────────────────────── */

const UPLOAD_STEPS: DemoStep[] = [
  { caption: <>First, give it a name you'll recognise. Click <b>Untitled0.ipynb</b> at the top and call it <b>LR lab – your name</b>.</>, cursor: 'name', click: true },
  { caption: <>Down the left is a strip of icons. Click the <b>folder</b>. That's the Files panel.</>, cursor: 'folder', click: true },
  { caption: <>There's already a folder called sample_data. Ignore it. Click the <b>upload</b> icon, the page with an arrow on it.</>, cursor: 'upload', click: true },
  { caption: <>Your computer's file picker opens. Pick <b>insurance.csv</b> (not archive.zip) and click <b>Open</b>.</>, cursor: 'open', click: true },
  { caption: <>Colab warns you that uploaded files get wiped when the session ends. That's normal. Click <b>OK</b>.</>, cursor: 'ok', click: true },
  { caption: <><b>insurance.csv</b> is in the list now, so Python can see it. Click in the first cell, type the code, and press <b>▶</b>.</>, cursor: 'play', click: true },
];

export function UploadDemo() {
  return (
    <Demo tag="Drawn for this lab · Colab needs you signed in, so this part can't be screenshotted from outside" steps={UPLOAD_STEPS}>
      {step => (
        <div className="lr-colab">
          <div className="lr-colab__head">
            <span className="lr-colab__logo" aria-hidden="true">C<span>O</span></span>
            <span className="lr-colab__name" data-target="name">{step === 0 ? 'Untitled0.ipynb' : 'LR lab – your name.ipynb'}</span>
          </div>
          <div className="lr-colab__menu" aria-hidden="true">
            <span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Runtime</span><span>Tools</span><span>Help</span>
          </div>
          <div className="lr-colab__body">
            <div className="lr-colab__rail" aria-hidden="true">
              <span><List size={15} /></span>
              <span><Search size={15} /></span>
              <span><Code size={15} /></span>
              <span><Eye size={15} /></span>
              <span><Key size={15} /></span>
              <span data-target="folder" className={step >= 1 ? 'is-on' : undefined}><Folder size={15} /></span>
              <span><Table size={15} /></span>
            </div>
            <div className={`lr-colab__files${step >= 2 ? ' is-open' : ''}`}>
              <div className="lr-colab__files-inner">
                <h5>Files</h5>
                <div className="lr-colab__tools">
                  <span data-target="upload" className={step === 2 || step === 3 ? 'is-on' : undefined}><Upload size={14} /></span>
                  <span><RefreshCw size={14} /></span>
                  <span><FolderPlus size={14} /></span>
                  <span><HardDrive size={14} /></span>
                </div>
                <div className="lr-colab__file"><Folder size={14} /> ..</div>
                <div className="lr-colab__file"><Folder size={14} /> sample_data</div>
                <AnimatePresence>
                  {step >= 4 && (
                    <motion.div key="csv" className={`lr-colab__file${step === 4 ? ' is-new' : ''}`} {...fade}>
                      <File size={14} /> insurance.csv
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="lr-colab__nb">
              <div className="lr-colab__cell">
                <span className="lr-colab__play" data-target="play" aria-hidden="true">
                  <svg width="9" height="9" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
                </span>
                {step >= 5 && (
                  <motion.code initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ whiteSpace: 'pre-wrap' }}>
                    {'import pandas as pd\ndf = pd.read_csv("insurance.csv")'}
                  </motion.code>
                )}
              </div>
              <AnimatePresence>
                {step === 4 && (
                  <motion.div key="warn" className="lr-colab__warn" {...fade}>
                    Uploaded files are deleted when this runtime is recycled. Keep a copy somewhere else.{' '}
                    <b data-target="ok" style={{ color: '#0b57d0', marginLeft: 6 }}>OK</b>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <AnimatePresence>
            {step === 3 && (
              <motion.div key="picker" className="lr-picker" {...fade}>
                <div className="lr-picker__head">Downloads</div>
                <div className="lr-picker__row"><FileArchive size={14} /> archive.zip <small>16 KB</small></div>
                <div className="lr-picker__row is-on"><FileSpreadsheet size={14} /> insurance.csv <small>55 KB</small></div>
                <div className="lr-picker__foot">
                  <span>Cancel</span>
                  <span className="is-go" data-target="open">Open</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Demo>
  );
}

/* ── 3. Send the report in Teams ──────────────────────────────────────── */

const TEAMS_STEPS: DemoStep[] = [
  { caption: <>Open Microsoft <b>Teams</b> and click <b>Chat</b> on the left.</>, cursor: 'chat', click: true },
  { caption: <>Click the <b>new chat</b> button, the square with a pencil, at the top of your chat list.</>, cursor: 'newchat', click: true },
  { caption: <>In the <b>To</b> box, start typing my name and pick <b>Yasas Sri Wickramasinghe</b> when it comes up.</>, cursor: 'to', click: true },
  { caption: <>Under the message box, click the <b>paperclip</b> (on newer Teams it's the <b>+</b>, then <b>Attach file</b>). Choose <b>Upload from this device</b>.</>, cursor: 'attach', click: true },
  { caption: <>Pick your PDF. Then type one line so I know what it is, like the one below.</>, cursor: 'box' },
  { caption: <>Press <b>Send</b>. When the file shows in the chat, you're done. Tick the last box on your checklist.</>, cursor: 'send', click: true },
];

export function TeamsDemo() {
  return (
    <Demo tag="Drawn for this lab · the layout of Teams chat, simplified" steps={TEAMS_STEPS}>
      {step => (
        <div className="lr-teams">
          <div className="lr-teams__rail" aria-hidden="true">
            <span><Bell size={17} />Activity</span>
            <span data-target="chat" className={step >= 0 ? 'is-on' : undefined}><MessageSquare size={17} />Chat</span>
            <span><Users size={17} />Teams</span>
            <span><Calendar size={17} />Calendar</span>
          </div>
          <div className="lr-teams__list">
            <h5>
              Chat
              <span className={`lr-teams__newchat${step === 1 ? ' is-on' : ''}`} data-target="newchat"><SquarePen size={15} /></span>
            </h5>
            {step >= 2 && (
              <div className="lr-teams__chat is-on">
                <span className="lr-teams__ava">YS</span> Yasas Sri W…
              </div>
            )}
            <div className="lr-teams__chat"><span className="lr-teams__ava" style={{ background: '#f3d6c7', color: '#6b2c10' }}>MB</span> MBI806B class</div>
          </div>
          <div className="lr-teams__main">
            <div className="lr-teams__to">
              {step >= 1 && (
                <>
                  <span style={{ color: '#616161' }}>To:</span>
                  <span data-target="to" style={{ flex: 1, minHeight: 20 }}>
                    {step >= 2 && <span className="lr-teams__pill">Yasas Sri Wickramasinghe</span>}
                  </span>
                </>
              )}
            </div>
            <div className="lr-teams__conv">
              {step >= 5 && (
                <motion.div className="lr-teams__bubble" {...fade}>
                  Hi Yasas, here's my linear regression lab report.
                  <div className="lr-teams__file"><File size={16} color="#c4314b" /> {REPORT_FILE}</div>
                </motion.div>
              )}
            </div>
            <div className="lr-teams__box" data-target="box">
              {step === 4 && (
                <>
                  <motion.div className="lr-teams__file" style={{ marginTop: 0, alignSelf: 'flex-start' }} {...fade}>
                    <File size={16} color="#c4314b" /> {REPORT_FILE}
                  </motion.div>
                  <span>Hi Yasas, here's my linear regression lab report.</span>
                </>
              )}
              {step !== 4 && <span style={{ color: '#9e9e9e' }}>Type a message</span>}
              <div className="lr-teams__boxrow" aria-hidden="true">
                <span data-target="attach" className={step === 3 ? 'is-on' : undefined}><Paperclip size={15} /></span>
                <span><Plus size={15} /></span>
                <span className={`lr-teams__send${step >= 4 ? ' is-on' : ''}`} data-target="send"><Send size={15} /></span>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {step === 3 && (
              <motion.div key="menu" className="lr-teams__menu" style={{ right: 40 }} {...fade}>
                <div>Attach cloud files</div>
                <div className="is-on"><Upload size={14} /> Upload from this device</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Demo>
  );
}
