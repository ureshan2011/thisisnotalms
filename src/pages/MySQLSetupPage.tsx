import { Apple, ExternalLink, Laptop, Monitor, MonitorSmartphone } from 'lucide-react';
import PublicLessonShell from '../components/public/PublicLessonShell';

// ─── /mysql-setup — installing MySQL before the first hands-on class ──────
// Public mirror of the gated "MySQL Development Environment Setup" post in
// Course Resources (lesson-docs/mbi802/15-mysql-setup.md), so the two guide
// videos and the Visual C++ note are reachable with no student login. The
// SharePoint video links are the lecturer's own institutional recordings —
// they open in a new tab rather than embedding, since SharePoint Stream
// requires the viewer's own institutional sign-in either way.

const VIDEOS = [
  {
    label: 'MacOS Guide Video',
    icon: Laptop,
    url: 'https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAdgK7LxBsxQ4OpdEwrXl17AX3mZyaMmmlXdA3xw4jSvcs?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=Ebi4ee',
  },
  {
    label: 'Windows Guide Video',
    icon: Monitor,
    url: 'https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAGNda_bc72R55878wdYxfRAbAKGBetSMR65xdEWdQO3ZU?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=wTx1An',
  },
];

export default function MySQLSetupPage() {
  return (
    <PublicLessonShell
      eyebrow="MBI802 · Database Management Systems"
      titleLead="Let's get your computer ready for"
      titleAccent="MySQL."
      gradient="linear-gradient(90deg, #7c3aed, #a78bfa, #c4b5fd)"
      accent="#7c3aed"
      orb2="#8b5cf6"
      orb3="#a78bfa"
      subtitle="Two short video walkthroughs — one for MacOS, one for Windows — so your MySQL client and Workbench are installed before the first hands-on class."
      pills={[
        { emoji: '🍎', name: 'MacOS path', color: '#1d4ed8' },
        { emoji: '🪟', name: 'Windows path', color: '#6d28d9' },
        { emoji: '🎬', name: '2 guide videos', color: '#7c3aed' },
      ]}
    >
      <div className="mx-auto max-w-2xl space-y-6 pt-4 text-[15px] leading-7 text-[#374151]">
        <p>Dear students, Ayubowan!</p>

        <p>
          I have created two video tutorials to help you set up MySQL on your Windows or Mac
          computer. Please try the installation on your own. You will also have time in class
          next week to set it up with support.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            className="rounded-2xl border p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(219,234,254,0.85), rgba(186,230,253,0.7))',
              borderColor: 'rgba(59,130,246,0.18)',
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1d4ed8' }}>
              <Apple size={16} /> MacOS Setup Path
            </div>
            <p className="mt-2 text-xs" style={{ color: '#1e3a8a' }}>
              Recommended for MacBook and iMac users. Follow this first before class support time.
            </p>
          </div>
          <div
            className="rounded-2xl border p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(237,233,254,0.9), rgba(224,231,255,0.75))',
              borderColor: 'rgba(124,58,237,0.20)',
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#6d28d9' }}>
              <MonitorSmartphone size={16} /> Windows Setup Path
            </div>
            <p className="mt-2 text-xs" style={{ color: '#4c1d95' }}>
              Best for Windows laptops and desktops. Keep screenshots ready if any installer error
              appears.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {VIDEOS.map(({ label, icon: Icon, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border p-4 transition-all hover:border-violet-300"
              style={{ borderColor: 'rgba(139,92,246,0.18)', background: 'rgba(245,243,255,0.6)' }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#5b21b6' }}>
                <Icon size={16} /> {label} <ExternalLink size={14} />
              </div>
            </a>
          ))}
        </div>

        <p>
          Some of you may see a popup asking to install Visual C++. If that happens, simply
          download the recommended file that appears on your screen, or use this link:{' '}
          <a
            href="https://aka.ms/vs/17/release/vc_redist.x64.exe"
            target="_blank"
            rel="noreferrer"
            className="font-semibold"
            style={{ color: '#6d28d9' }}
          >
            Visual C++ Redistributable
          </a>
          .
        </p>

        <p>
          Different computers can show different errors depending on the software versions you
          have. One full hour has been set aside in the next class for one-to-one in-person help
          from your teaching assistants. If you run into any issues, take screenshots and bring
          them to class.
        </p>

        <p>
          Comments and suggestions are welcome, especially if you would like more video
          tutorials.
        </p>

        <p>
          If your issue is still not solved by the end of the next class, a Google Form will be
          shared where you can submit your details. This is exactly why the database setup
          started early, so there is no pressure at all.
        </p>

        <p className="font-semibold" style={{ color: '#4c1d95' }}>
          Happy learning!
        </p>
      </div>
    </PublicLessonShell>
  );
}
