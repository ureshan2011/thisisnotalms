import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell, Calendar, Code, Eye, File, FileArchive, FileSpreadsheet, Folder, FolderPlus, HardDrive, Key, List,
  MessageSquare, Paperclip, Plus, RefreshCw, Search, Send, Table, Upload, Users,
} from 'lucide-react';
import Demo, { type DemoStep } from './Demo';

// ─── The three drawn walkthroughs ─────────────────────────────────────────
// Unzipping the download, uploading the CSV into Colab, and replying to the
// lab's announcement post in Teams. All three happen on screens that need
// you signed in, or on your own laptop, so they are drawn from the real
// layouts rather than captured. Each element the cursor visits carries a
// data-target the Demo frame looks up.
//
// Each lab passes its own file names, sizes, notebook name and post, so the
// same three walkthroughs serve every MBI806B lab.

const fade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.3 } };

/* ── 1. Unzip ─────────────────────────────────────────────────────────── */

type OS = 'mac' | 'windows';

export interface UnzipFiles {
  /** Size of Kaggle's archive.zip, e.g. "16 KB". */
  zipSize: string;
  /** The CSV inside it, e.g. "insurance.csv". */
  csvName: string;
  csvSize: string;
  /** If set, an extra step renames the CSV to this short name. */
  renameTo?: string;
}

function macSteps(f: UnzipFiles): DemoStep[] {
  const steps: DemoStep[] = [
    { caption: <>Open your <b>Downloads</b> folder. Kaggle's file is called <b>archive.zip</b>, and it's tiny: about {f.zipSize}.</>, cursor: 'zip' },
    { caption: <><b>Double-click</b> it. Your Mac unzips it on the spot. If you use Safari it may have done this for you already.</>, cursor: 'zip', click: true },
    {
      caption: f.renameTo ? (
        <>Now there's a file called <b>{f.csvName}</b>, sometimes inside a folder called archive. That's the one you'll upload.</>
      ) : (
        <>Now there's a file called <b>{f.csvName}</b>, sometimes inside a folder called archive. That's the one you'll upload. Leave the zip alone.</>
      ),
      cursor: 'csv',
    },
  ];
  if (f.renameTo) {
    steps.push({
      caption: <>That name is long and easy to mistype. Click it once, press <b>Return</b>, and rename it <b>{f.renameTo}</b>. Press Return again to save.</>,
      cursor: 'csv',
      click: true,
    });
  }
  return steps;
}

function winSteps(f: UnzipFiles): DemoStep[] {
  const steps: DemoStep[] = [
    { caption: <>Open your <b>Downloads</b> folder. Kaggle's file is called <b>archive.zip</b>, and it's tiny: about {f.zipSize}.</>, cursor: 'zip' },
    { caption: <><b>Right-click</b> it and choose <b>Extract All…</b></>, cursor: 'extract', click: true },
    { caption: <>A box opens asking where to put the files. The suggested place is fine. Click <b>Extract</b>.</>, cursor: 'extractbtn', click: true },
    { caption: <>Windows opens a new folder called archive. Inside is <b>{f.csvName}</b>. That's the one you'll upload.</>, cursor: 'csv' },
  ];
  if (f.renameTo) {
    steps.push({
      caption: <>That name is long and easy to mistype. Click it once, press <b>F2</b>, and rename it <b>{f.renameTo}</b>. Press Enter to save.</>,
      cursor: 'csv',
      click: true,
    });
  }
  return steps;
}

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

export function UnzipDemo({ files }: { files: UnzipFiles }) {
  const [os, setOs] = useState<OS>('mac');
  const steps = os === 'mac' ? macSteps(files) : winSteps(files);
  // The step at which the CSV has been renamed, if this lab renames it.
  const renamedAt = files.renameTo ? steps.length - 1 : Infinity;

  return (
    <div>
      <div className="lr-pills" role="group" aria-label="Which computer are you on?" style={{ marginTop: 18 }}>
        <button type="button" aria-pressed={os === 'mac'} onClick={() => setOs('mac')}>Mac</button>
        <button type="button" aria-pressed={os === 'windows'} onClick={() => setOs('windows')}>Windows</button>
      </div>
      <Demo key={os} tag={`Drawn for this lab · ${os === 'mac' ? 'Mac Finder' : 'Windows File Explorer'}`} steps={steps}>
        {step => {
          const extracted = os === 'mac' ? step >= 2 : step >= 3;
          const csvShown = step >= renamedAt && files.renameTo ? files.renameTo : files.csvName;
          return (
            <div className="lr-desk">
              <div className="lr-desk__win">
                <div className="lr-desk__title">
                  <Folder size={14} aria-hidden="true" /> {os === 'windows' && extracted ? 'archive' : 'Downloads'}
                </div>
                <div className="lr-desk__grid">
                  <AnimatePresence>
                    {!(os === 'windows' && extracted) && (
                      <DeskItem key="zip" icon="zip" name="archive.zip" size={files.zipSize} on={step === 1 || (os === 'windows' && step === 2)} target="zip" />
                    )}
                    {extracted && <DeskItem key="csv" icon="csv" name={csvShown} size={files.csvSize} on target="csv" />}
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

export interface UploadFiles {
  /** The CSV the student uploads, under the name they gave it. */
  csvName: string;
  csvSize: string;
  zipSize: string;
  /** What to rename the notebook to, e.g. "LR lab – your name". */
  notebookName: string;
}

function uploadSteps(f: UploadFiles): DemoStep[] {
  return [
    { caption: <>First, give it a name you'll recognise. Click <b>Untitled0.ipynb</b> at the top and call it <b>{f.notebookName}</b>.</>, cursor: 'name', click: true },
    { caption: <>Down the left is a strip of icons. Click the <b>folder</b>. That's the Files panel.</>, cursor: 'folder', click: true },
    { caption: <>There's already a folder called sample_data. Ignore it. Click the <b>upload</b> icon, the page with an arrow on it.</>, cursor: 'upload', click: true },
    { caption: <>Your computer's file picker opens. Pick <b>{f.csvName}</b> (not archive.zip) and click <b>Open</b>.</>, cursor: 'open', click: true },
    { caption: <>Colab warns you that uploaded files get wiped when the session ends. That's normal. Click <b>OK</b>.</>, cursor: 'ok', click: true },
    { caption: <><b>{f.csvName}</b> is in the list now, so Python can see it. Click in the first cell, type the code, and press <b>▶</b>.</>, cursor: 'play', click: true },
  ];
}

export function UploadDemo({ files }: { files: UploadFiles }) {
  return (
    <Demo tag="Drawn for this lab · Colab needs you signed in, so this part can't be screenshotted from outside" steps={uploadSteps(files)}>
      {step => (
        <div className="lr-colab">
          <div className="lr-colab__head">
            <span className="lr-colab__logo" aria-hidden="true">C<span>O</span></span>
            <span className="lr-colab__name" data-target="name">{step === 0 ? 'Untitled0.ipynb' : `${files.notebookName}.ipynb`}</span>
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
                      <File size={14} /> {files.csvName}
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
                    {`import pandas as pd\ndf = pd.read_csv("${files.csvName}")`}
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
                <div className="lr-picker__row"><FileArchive size={14} /> archive.zip <small>{files.zipSize}</small></div>
                <div className="lr-picker__row is-on"><FileSpreadsheet size={14} /> {files.csvName} <small>{files.csvSize}</small></div>
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

/* ── 3. Reply to the announcement post in Teams ──────────────────────── */

export interface TeamsPost {
  /** The announcement post's title, as it appears in the channel. */
  title: string;
  /** Its first line. */
  body: string;
  /** The one line the student writes with their file. */
  reply: string;
  /** The PDF's name, e.g. "MBI806B-LR-Lab-YourName.pdf". */
  file: string;
}

function teamsSteps(post: TeamsPost): DemoStep[] {
  return [
    { caption: <>Open Microsoft <b>Teams</b> and click <b>Teams</b> on the left, then your <b>MBI806B</b> class team.</>, cursor: 'teams', click: true },
    { caption: <>Open the <b>General</b> channel. Look for my post called <b>“{post.title}”</b>. That’s the one the lab came from.</>, cursor: 'channel', click: true },
    { caption: <>Don’t press <b>New post</b>. Your report goes <b>under my post</b>, so everyone’s sit together. Click <b>Reply</b>.</>, cursor: 'reply', click: true },
    { caption: <>A reply box opens under the post. Click the <b>paperclip</b> (on newer Teams it’s the <b>+</b>, then <b>Attach file</b>).</>, cursor: 'attach', click: true },
    { caption: <>Choose <b>Upload from this device</b>, then pick your PDF.</>, cursor: 'upload', click: true },
    { caption: <>Your PDF shows in the box. Type one line, like this one, so I know whose it is.</>, cursor: 'box' },
    { caption: <>Press <b>Send</b>.</>, cursor: 'send', click: true },
    { caption: <>Your report now sits <b>under my post</b>, as a reply. If you can see it there, you’re done. Tick the last box on your checklist.</>, cursor: 'posted' },
  ];
}

export function TeamsDemo({ post }: { post: TeamsPost }) {
  return (
    <Demo tag="Drawn for this lab · the layout of a Teams channel, simplified" steps={teamsSteps(post)}>
      {step => (
        <div className="lr-teams">
          <div className="lr-teams__rail" aria-hidden="true">
            <span><Bell size={17} />Activity</span>
            <span><MessageSquare size={17} />Chat</span>
            <span data-target="teams" className={step >= 0 ? 'is-on' : undefined}><Users size={17} />Teams</span>
            <span><Calendar size={17} />Calendar</span>
          </div>
          <div className="lr-teams__list">
            <h5>Teams</h5>
            <div className="lr-teams__team"><span className="lr-teams__ava" style={{ background: '#f3d6c7', color: '#6b2c10' }}>MB</span> MBI806B class</div>
            <div className={`lr-teams__channel${step >= 1 ? ' is-on' : ''}`} data-target="channel"># General</div>
            <div className="lr-teams__channel"># Assignments</div>
          </div>
          <div className="lr-teams__main">
            <div className="lr-teams__to">
              <b># General</b>
              <span style={{ color: '#616161' }}>Posts · Files · Notes</span>
              <span className="lr-teams__newpost">New post</span>
            </div>
            <div className="lr-teams__feed">
              {step >= 1 && (
                <motion.div className="lr-teams__post" {...fade}>
                  <div className="lr-teams__postrow">
                    <span className="lr-teams__ava">YS</span>
                    <div>
                      <b>Yasas Sri Wickramasinghe</b>
                      <div className="lr-teams__posttitle">{post.title}</div>
                      <div style={{ color: '#616161' }}>{post.body}</div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {step >= 7 && (
                      <motion.div key="r" className="lr-teams__reply" {...fade}>
                        <span className="lr-teams__ava" style={{ background: '#d4ecd9', color: '#1d5a2f' }}>You</span>
                        <div>
                          <div className="lr-teams__bubble" data-target="posted">
                            {post.reply}
                            <div className="lr-teams__file"><File size={16} color="#c4314b" /> {post.file}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {step < 3 || step >= 7 ? (
                    <span className="lr-teams__replylink" data-target="reply">↩ Reply</span>
                  ) : (
                    <div className="lr-teams__box" data-target="box">
                      {step >= 5 ? (
                        <>
                          <motion.div className="lr-teams__file" style={{ marginTop: 0, alignSelf: 'flex-start' }} {...fade}>
                            <File size={16} color="#c4314b" /> {post.file}
                          </motion.div>
                          <span>{post.reply}</span>
                        </>
                      ) : (
                        <span style={{ color: '#9e9e9e' }}>Reply</span>
                      )}
                      <div className="lr-teams__boxrow" aria-hidden="true">
                        <span data-target="attach" className={step === 3 || step === 4 ? 'is-on' : undefined}><Paperclip size={15} /></span>
                        <span><Plus size={15} /></span>
                        <span className={`lr-teams__send${step >= 6 ? ' is-on' : ''}`} data-target="send"><Send size={15} /></span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {step === 4 && (
              <motion.div key="menu" className="lr-teams__menu" style={{ left: '38%' }} {...fade}>
                <div>Attach cloud files</div>
                <div className="is-on" data-target="upload"><Upload size={14} /> Upload from this device</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Demo>
  );
}
