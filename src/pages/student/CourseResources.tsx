import { useEffect, useState } from 'react';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Laptop,
  Monitor,
  Sparkles,
  Apple,
  MonitorSmartphone,
  FlaskConical,
  ExternalLink,
  Video,
  Presentation,
  ClipboardList,
  GitBranch,
  Film,
  Lock,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import MBI802Quiz from '../../components/quiz/MBI802Quiz';
import QuizResultsDashboard from '../../components/quiz/QuizResultsDashboard';
import ERMcq from '../../components/quiz/ERMcq';
import ERMcqDashboard from '../../components/quiz/ERMcqDashboard';
import SQLProgrammingDeck from '../../components/slides/SQLProgrammingDeck';
import ERDiagramsDeck from '../../components/slides/ERDiagramsDeck';
import VideoGallery, { type VideoClip } from '../../components/slides/VideoGallery';
import ERDiagramActivitiesDeck from '../../components/slides/ERDiagramActivitiesDeck';
import ERAdvancedConceptsDeck from '../../components/slides/ERAdvancedConceptsDeck';
import NormalizationDeck from '../../components/slides/NormalizationDeck';
import SISPPromptLab from '../../components/lab/SISPPromptLab';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import type { StudentProfile } from '../../lib/types';

// ── Course + Lesson definitions ────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  isCustom?: boolean;
}

// ── Module-level session cache for videoLessons ────────────────────────────
// Avoids re-reading Firestore every time Course Resources is opened.
// Cleared automatically on page refresh (module re-evaluates).
interface VideoLessonsCache {
  videoMap:    Record<string, VideoClip[]>;
  customMap:   Record<string, Lesson[]>;
}
let _videoLessonsCache: VideoLessonsCache | null = null;

interface Course {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  lessons: Lesson[];
}

// ── Video clip data — replace placeholder URLs with real SharePoint sharing links ──

const BASE = import.meta.env.BASE_URL;

const ADVANCED_ER_VIDEOS: VideoClip[] = [
  {
    title: 'Advanced ER Activities – Introduction',
    description: 'Introductory Video for the Adcanced ER Diagram Activities',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQCRe7UEzG6kS7qnD0YIKL26AXyVXup4iuZNvCtm-H_bWM0?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=YwGTJM',
    thumbnailUrl: `${BASE}Intro.png`,
  },
  {
    title: 'Advanced ER – Activity 1 Answer',
    description: 'Discussion for the Activity 1',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQCWj89h_cAfR5PdPJKJ6n6FAXxIUVcLFYr_ZWS9C2Z6jB4?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=KSzPeg',
    thumbnailUrl: `${BASE}Activity1.png`,
  },
  {
    title: 'Advanced ER – Activity 2 Answer',
    description: 'Discussion for the Activity 2',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQDIM1P8eEAGSJ40okuBoQIjAQWu9LRaOkyerxnAQSwuyps?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=OjX2gq',
    thumbnailUrl: `${BASE}Activity2.png`,
  },
  {
    title: 'Advanced ER – Activity 3 Answer',
    description: 'Discussion for the Activity 3',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQD5DSbZ-mhTTaozgGbU3wPxAe4p7vmen4W4ugIUFGPsBLY?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=DQzH0y',
    thumbnailUrl: `${BASE}Activity3.png`,
  },
  {
    title: 'Advanced ER – Activity 4 Answer',
    description: 'Discussion for the Activity 4',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQD5DSbZ-mhTTaozgGbU3wPxAe4p7vmen4W4ugIUFGPsBLY?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=sLu72l',
    thumbnailUrl: `${BASE}Activity4.png`,
  },
  {
    title: 'Advanced ER – Activity 5 Answer',
    description: 'Discussion for the Activity 5',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQCckQ8T7ucbT5G_5j-94JV8Aei2NKaqfnJQIaQ_30vBWDg?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=0HJNTl',
    thumbnailUrl: `${BASE}Activity5.png`,
  },
];

const NORMALIZATION_VIDEOS: VideoClip[] = [
  {
    title: 'Normalization – Introduction',
    description: 'Introductory video for Database Normalization & Functional Dependencies',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQAowdJDkOhQTq1zdGLQEhuVAVOSCBFxoYfC_6R_udOvPx8?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=tDjwog',
    thumbnailUrl: `${BASE}NormIntro.png`,
  },
  {
    title: 'Normalization – Why Normalise?',
    description: 'Understanding the need for database normalization',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQB8pA9SvlmuQ7FBkSDvkwuAAabog23pf1imS32sfOJWjnU?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=y0Xrms',
    thumbnailUrl: `${BASE}NormWhy.png`,
  },
  {
    title: 'Normalization – Functional Dependencies',
    description: 'Introduction to functional dependencies in relational databases',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQBJVg0hKdB1SZJcHC2qHBxcASVGMpngLuFNOcPSWisP73Q?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=3AOjNd',
    thumbnailUrl: `${BASE}NormFD.png`,
  },
  {
    title: 'Normalization – First Normal Form (1NF)',
    description: 'Understanding and applying First Normal Form',
    url: 'https://myacg-my.sharepoint.com/:v:/g/personal/yasas_wickramasinghe_yoobeecolleges_com1/IQDwiXe1GAG4QornPClJYm6PAej3l8tqwmUvRsE9xRboIsA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=INiQAM',
    thumbnailUrl: `${BASE}Norm1NF.png`,
  },
];

const COURSES: Course[] = [
  {
    id: 'MBI800',
    name: 'MBI800',
    tagline: 'Business Information Systems',
    accentColor: '#0ea5e9',
    bgGradient: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(56,189,248,0.04))',
    lessons: [
      {
        id: 'sisp-lab',
        title: 'SISP Prompt Engineering Lab',
        subtitle: '5 scenario-based challenges · AI-evaluated · Covers Iceberg Model, Process Dimensions, Participation, Consistency & Methodology',
        icon: <FlaskConical size={18} />,
        accentColor: '#0ea5e9',
      },
    ],
  },
  {
    id: 'MBI802',
    name: 'MBI802',
    tagline: 'Database Management Systems',
    accentColor: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.04))',
    lessons: [
      {
        id: 'setup',
        title: 'MySQL Development Environment Setup',
        subtitle: 'Video tutorials for MacOS and Windows installation',
        icon: <Video size={18} />,
        accentColor: '#7c3aed',
      },
      {
        id: 'slides',
        title: 'SQL Programming Slides',
        subtitle: '13-slide interactive deck covering basic MySQL commands',
        icon: <Presentation size={18} />,
        accentColor: '#2563eb',
      },
      {
        id: 'er',
        title: 'ER Diagrams Basics',
        subtitle: '24-slide deck · Chen\'s notation · entities, attributes, relationships & cardinality',
        icon: <GitBranch size={18} />,
        accentColor: '#0d7a72',
      },
      {
        id: 'er-activities',
        title: 'ER Diagram Activities',
        subtitle: '12-slide activity deck · 5 real-world scenarios · Library, University, Hospital, Online Store, Hotel',
        icon: <FlaskConical size={18} />,
        accentColor: '#1d4ed8',
      },
      {
        id: 'er-advanced',
        title: 'Advanced ER Concepts',
        subtitle: '11-slide deck · Weak entities, identifying relationships, multivalued & derived attributes · 2 exercises',
        icon: <BookOpen size={18} />,
        accentColor: '#3b82f6',
      },
      {
        id: 'er-mcq',
        title: 'ER Knowledge Check',
        subtitle: '20 questions · 3 attempts · Score >50% to unlock remaining lessons · 90%+ on first attempt earns a badge',
        icon: <ClipboardList size={18} />,
        accentColor: '#6366f1',
      },
      {
        id: 'normalization',
        title: 'Database Normalization & Functional Dependencies',
        subtitle: '20-slide deck · 1NF, 2NF, 3NF, BCNF · Functional dependencies · Decomposition · 3 activities',
        icon: <BookOpen size={18} />,
        accentColor: '#6366f1',
      },
      {
        id: 'quiz',
        title: 'DBMS Knowledge Check',
        subtitle: '38 questions · No time limit · Unlimited attempts',
        icon: <ClipboardList size={18} />,
        accentColor: '#059669',
      },
    ],
  },
  {
    id: 'MBI804',
    name: 'MBI804',
    tagline: 'Networking & Systems',
    accentColor: '#059669',
    bgGradient: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(52,211,153,0.04))',
    lessons: [],
  },
];

// ── Lesson content renderers ────────────────────────────────────────────────

function SetupLesson() {
  return (
    <div className="space-y-4">
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: '#8b5cf6' }}
        >
          Post
        </p>
        <h3 className="text-lg font-bold mt-1" style={{ color: '#1e1b4b' }}>
          MySQL Development Environment Setup Video Tutorials
        </h3>
        <p className="text-sm mt-3" style={{ color: '#4b5563' }}>
          Dear students, Ayubowan!
        </p>
        <p
          className="text-xs mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ color: '#6d28d9', background: 'rgba(221,214,254,0.55)' }}
        >
          <Sparkles size={12} /> Author: MBI802 Lecturer
        </p>
      </div>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        I have created two video tutorials to help you set up MySQL on your Windows or Mac
        computer. Please try the installation on your own. You will also have time in class next
        week to set it up with support.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: 'linear-gradient(135deg, rgba(219,234,254,0.85), rgba(186,230,253,0.7))',
            borderColor: 'rgba(59,130,246,0.18)',
          }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#1d4ed8' }}>
            <Apple size={16} /> MacOS Setup Path
          </div>
          <p className="text-xs mt-2" style={{ color: '#1e3a8a' }}>
            Recommended for MacBook and iMac users. Follow this first before class support time.
          </p>
        </div>
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: 'linear-gradient(135deg, rgba(237,233,254,0.9), rgba(224,231,255,0.75))',
            borderColor: 'rgba(124,58,237,0.20)',
          }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#6d28d9' }}>
            <MonitorSmartphone size={16} /> Windows Setup Path
          </div>
          <p className="text-xs mt-2" style={{ color: '#4c1d95' }}>
            Best for Windows laptops and desktops. Keep screenshots ready if any installer error
            appears.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a
          href="https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAdgK7LxBsxQ4OpdEwrXl17AX3mZyaMmmlXdA3xw4jSvcs?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=Ebi4ee"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl border hover:border-violet-300 transition-all"
          style={{ borderColor: 'rgba(139,92,246,0.18)', background: 'rgba(245,243,255,0.6)' }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#5b21b6' }}>
            <Laptop size={16} /> MacOS Guide Video <ExternalLink size={14} />
          </div>
        </a>
        <a
          href="https://myacg.sharepoint.com/:v:/s/2511-YCCI-MBI-Blended-TeachingSpace/IQAGNda_bc72R55878wdYxfRAbAKGBetSMR65xdEWdQO3ZU?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=wTx1An"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl border hover:border-violet-300 transition-all"
          style={{ borderColor: 'rgba(139,92,246,0.18)', background: 'rgba(245,243,255,0.6)' }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#5b21b6' }}>
            <Monitor size={16} /> Windows Guide Video <ExternalLink size={14} />
          </div>
        </a>
      </div>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        Some of you may see a popup asking to install Visual C++. If that happens, simply download
        the recommended file that appears on your screen, or use this link:{' '}
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

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        Different computers can show different errors depending on the software versions you have.
        One full hour has been set aside in the next class for one-to-one in-person help from your
        teaching assistants. If you run into any issues, take screenshots and bring them to class.
      </p>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        Please avoid posting errors here, since there are more than one hundred students and it
        becomes difficult to manage. Comments and suggestions are welcome, especially if you would
        like more video tutorials.
      </p>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        If your issue is still not solved by the end of the next class, a Google Form will be
        shared where you can submit your details. This is exactly why the database setup started
        early, so there is no pressure at all.
      </p>

      <p className="text-sm font-semibold" style={{ color: '#4c1d95' }}>
        Happy learning!
      </p>
    </div>
  );
}

function SlidesLesson() {
  return <SQLProgrammingDeck />;
}

function QuizLesson({
  studentProfile,
  isStaff,
}: {
  studentProfile: StudentProfile | null;
  isStaff: boolean;
}) {
  return (
    <div className="space-y-4">
      {!isStaff && (
        <div
          className="flex items-start gap-3 rounded-2xl px-4 py-3 border"
          style={{
            background: 'linear-gradient(135deg, rgba(254,243,199,0.95), rgba(253,230,138,0.6))',
            borderColor: 'rgba(245,158,11,0.35)',
          }}
        >
          <FlaskConical size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#92400e' }}>
              Try this only if you have your MySQL setup ready!
            </p>
            <p className="text-xs mt-0.5 leading-5" style={{ color: '#78350f' }}>
              These questions are designed for students who have already completed the MySQL
              installation. If your setup is still in progress, finish the setup first — come back
              to this quiz once you are ready. The quiz covers Database Management System theory
              and real-world scenarios, not SQL coding.
            </p>
          </div>
        </div>
      )}
      {isStaff ? (
        <QuizResultsDashboard />
      ) : (
        <MBI802Quiz studentProfile={studentProfile} />
      )}
    </div>
  );
}

// ── Lesson row component ────────────────────────────────────────────────────

function LessonRow({
  lesson,
  index,
  isOpen,
  onToggle,
  children,
  locked = false,
}: {
  lesson: Lesson;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  locked?: boolean;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        border: locked
          ? '1.5px solid rgba(156,163,175,0.25)'
          : isOpen
            ? `1.5px solid ${lesson.accentColor}40`
            : '1.5px solid rgba(139,92,246,0.10)',
        background: locked ? 'rgba(249,250,251,0.7)' : isOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)',
        boxShadow: locked ? 'none' : isOpen
          ? `0 4px 24px ${lesson.accentColor}18`
          : '0 1px 4px rgba(0,0,0,0.04)',
        opacity: locked ? 0.7 : 1,
      }}
    >
      {/* Header */}
      <button
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        className="w-full text-left flex items-center gap-4 px-5 py-4 transition-all"
        style={{
          background: locked ? 'transparent' : isOpen ? `${lesson.accentColor}08` : 'transparent',
          cursor: locked ? 'not-allowed' : 'pointer',
        }}
      >
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: locked ? 'rgba(156,163,175,0.12)' : `${lesson.accentColor}15`,
            color: locked ? '#9ca3af' : lesson.accentColor,
          }}
        >
          {locked ? <Lock size={18} /> : lesson.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: locked ? '#9ca3af' : lesson.accentColor, opacity: locked ? 1 : 0.7 }}
            >
              Lesson {index + 1}
            </span>
            {locked && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
                Locked
              </span>
            )}
          </div>
          <p className="text-sm font-semibold mt-0.5" style={{ color: locked ? '#9ca3af' : '#1e1b4b' }}>
            {lesson.title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: locked ? '#d1d5db' : '#6b7280' }}>
            {locked ? 'Score above 50% in the ER Knowledge Check to unlock this lesson.' : lesson.subtitle}
          </p>
        </div>
        <div
          className="flex-shrink-0 transition-transform duration-200"
          style={{
            color: locked ? '#d1d5db' : lesson.accentColor,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          {!locked && <ChevronDown size={18} />}
        </div>
      </button>

      {/* Content */}
      {isOpen && !locked && (
        <div
          className="px-5 pb-5 pt-1 border-t animate-fadeIn"
          style={{ borderColor: `${lesson.accentColor}20` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function CourseResources() {
  const { user, role } = useAuth();
  const isStaff = role === 'lecturer' || role === 'teachingAssistant';

  const [loading, setLoading] = useState(role === 'student');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>(
    isStaff ? ['MBI800', 'MBI802', 'MBI804'] : []
  );
  const [erMcqPassed, setErMcqPassed] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState('MBI802');
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  // Dynamic videos loaded from Firestore (lecturer-managed)
  // Key: `${courseId}_${lessonId}` → extra VideoClip[] for that lesson
  const [dynamicVideoMap, setDynamicVideoMap] = useState<Record<string, VideoClip[]>>({});
  // Custom lessons added by lecturers (not in COURSES array)
  const [customLessonsByCourse, setCustomLessonsByCourse] = useState<
    Record<string, Lesson[]>
  >({});

  useEffect(() => {
    if (!user || isStaff) return;
    (async () => {
      const [studentSnap, erMcqSnap] = await Promise.all([
        getDoc(doc(db, 'students', user.uid)),
        getDoc(doc(db, 'erMcqResults', user.uid)),
      ]);
      const profile = studentSnap.exists() ? (studentSnap.data() as StudentProfile) : null;
      setStudentProfile(profile);
      const subjects = profile?.subjects ?? [];
      setEnrolledSubjects(subjects);
      // Default selected course to first enrolled
      const known = COURSES.map(c => c.id);
      const first = known.find(id => subjects.includes(id));
      if (first) setSelectedCourse(first);
      // Check er-mcq gate
      if (erMcqSnap.exists()) {
        const best = erMcqSnap.data().bestPercentage ?? 0;
        setErMcqPassed(best > 50);
      }
      setLoading(false);
    })();
  }, [user, isStaff]);

  // Fetch lecturer-managed video lessons — uses a module-level cache so
  // navigating away and back doesn't re-read Firestore within the same session.
  useEffect(() => {
    if (_videoLessonsCache) {
      setDynamicVideoMap(_videoLessonsCache.videoMap);
      setCustomLessonsByCourse(_videoLessonsCache.customMap);
      return;
    }
    (async () => {
      const snap = await getDocs(collection(db, 'videoLessons'));
      const videoMap: Record<string, VideoClip[]>  = {};
      const customMap: Record<string, Lesson[]>    = {};

      snap.docs.forEach(d => {
        const data = d.data() as {
          courseId: string;
          lessonId: string;
          lessonTitle: string;
          lessonSubtitle?: string;
          accentColor?: string;
          isCustomLesson: boolean;
          videos?: VideoClip[];
        };
        const videos = data.videos ?? [];
        if (data.isCustomLesson) {
          if (!customMap[data.courseId]) customMap[data.courseId] = [];
          customMap[data.courseId].push({
            id:          data.lessonId,
            title:       data.lessonTitle,
            subtitle:    data.lessonSubtitle ?? '',
            icon:        <Film size={18} />,
            accentColor: data.accentColor ?? '#7c3aed',
            isCustom:    true,
          });
          if (videos.length > 0) {
            videoMap[`${data.courseId}_${data.lessonId}`] = videos;
          }
        } else if (videos.length > 0) {
          videoMap[`${data.courseId}_${data.lessonId}`] = videos;
        }
      });

      _videoLessonsCache = { videoMap, customMap };
      setDynamicVideoMap(videoMap);
      setCustomLessonsByCourse(customMap);
    })();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const visibleCourses = COURSES.filter(
    c => isStaff || enrolledSubjects.includes(c.id)
  );

  if (!isStaff && visibleCourses.length === 0) {
    return (
      <Layout>
        <div className="card p-6">
          <h1 className="page-title">Course Resources</h1>
          <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
            You are not enrolled in any subjects that have resources available yet.
          </p>
        </div>
      </Layout>
    );
  }

  const baseCourse = COURSES.find(c => c.id === selectedCourse) ?? visibleCourses[0];
  // Merge hardcoded lessons with any custom ones added by lecturers
  const course = {
    ...baseCourse,
    lessons: [
      ...baseCourse.lessons,
      ...(customLessonsByCourse[baseCourse.id] ?? []),
    ],
  };

  const toggleLesson = (id: string) =>
    setOpenLesson(prev => (prev === id ? null : id));

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="page-title">Course Resources</h1>
        <p className="page-subtitle">
          {isStaff
            ? 'All course content — visible to staff across all subjects.'
            : 'Your enrolled subject resources, lessons, and assessments.'}
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── Left course panel ──────────────────────────────────── */}
        <div className="lg:w-56 flex-shrink-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: '#9ca3af' }}>
            Subjects
          </p>

          {/* Mobile: horizontal pill row */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {visibleCourses.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedCourse(c.id); setOpenLesson(null); }}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: selectedCourse === c.id ? c.accentColor : 'rgba(255,255,255,0.8)',
                  color: selectedCourse === c.id ? '#fff' : '#374151',
                  border: selectedCourse === c.id ? 'none' : '1.5px solid rgba(0,0,0,0.08)',
                }}
              >
                {c.id}
              </button>
            ))}
          </div>

          {/* Desktop: vertical card list */}
          <div className="hidden lg:flex flex-col gap-2">
            {visibleCourses.map(c => {
              const isActive = selectedCourse === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCourse(c.id); setOpenLesson(null); }}
                  className="text-left rounded-2xl px-4 py-3 transition-all w-full group"
                  style={{
                    background: isActive ? c.accentColor : 'rgba(255,255,255,0.8)',
                    border: isActive ? 'none' : '1.5px solid rgba(139,92,246,0.10)',
                    boxShadow: isActive ? `0 4px 20px ${c.accentColor}30` : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-bold"
                      style={{ color: isActive ? '#fff' : '#1e1b4b' }}
                    >
                      {c.id}
                    </span>
                    {isActive && <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />}
                  </div>
                  <p
                    className="text-xs mt-0.5 leading-4"
                    style={{ color: isActive ? 'rgba(255,255,255,0.75)' : '#6b7280' }}
                  >
                    {c.tagline}
                  </p>
                  <p
                    className="text-xs mt-1.5 font-semibold"
                    style={{ color: isActive ? 'rgba(255,255,255,0.6)' : c.accentColor, opacity: isActive ? 1 : 0.8 }}
                  >
                    {(() => {
                      const total = c.lessons.length + (customLessonsByCourse[c.id]?.length ?? 0);
                      return total > 0 ? `${total} lesson${total !== 1 ? 's' : ''}` : 'Coming soon';
                    })()}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right content panel ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Course header */}
          <div
            className="rounded-2xl px-5 py-4 mb-4 flex items-center gap-4"
            style={{ background: course.bgGradient, border: `1.5px solid ${course.accentColor}20` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${course.accentColor}15` }}
            >
              <BookOpen size={20} style={{ color: course.accentColor }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: '#1e1b4b' }}>
                {course.id}
              </h2>
              <p className="text-xs" style={{ color: '#6b7280' }}>
                {course.tagline}
              </p>
            </div>
            {isStaff && (
              <span
                className="ml-auto text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: `${course.accentColor}15`, color: course.accentColor }}
              >
                Staff view
              </span>
            )}
          </div>

          {/* Lessons or coming soon */}
          {course.lessons.length === 0 ? (
            <div
              className="rounded-2xl px-6 py-12 text-center"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(139,92,246,0.10)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${course.accentColor}12` }}
              >
                <GraduationCap size={26} style={{ color: course.accentColor }} />
              </div>
              <p className="text-sm font-bold" style={{ color: '#1e1b4b' }}>
                Content coming soon
              </p>
              <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                Lessons for {course.id} are being prepared. Check back later.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {course.lessons.map((lesson, i) => {
                const gated = !isStaff && ['normalization', 'quiz'].includes(lesson.id) && !erMcqPassed;
                return (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    index={i}
                    isOpen={openLesson === lesson.id}
                    onToggle={() => toggleLesson(lesson.id)}
                    locked={gated}
                  >
                    {lesson.id === 'setup' && <SetupLesson />}
                    {lesson.id === 'slides' && <SlidesLesson />}
                    {lesson.id === 'er' && <ERDiagramsDeck />}
                    {lesson.id === 'er-activities' && (
                      <div>
                        <ERDiagramActivitiesDeck />
                        <VideoGallery
                          videos={[...ADVANCED_ER_VIDEOS, ...(dynamicVideoMap[`${course.id}_${lesson.id}`] ?? [])]}
                          accentColor="#0d7a72"
                        />
                      </div>
                    )}
                    {lesson.id === 'er-advanced' && <ERAdvancedConceptsDeck />}
                    {lesson.id === 'er-mcq' && isStaff && <ERMcqDashboard />}
                    {lesson.id === 'er-mcq' && !isStaff && (
                      <ERMcq
                        studentProfile={studentProfile}
                        onPassStatusChange={(passed) => setErMcqPassed(passed)}
                      />
                    )}
                    {lesson.id === 'normalization' && (
                      <div>
                        <NormalizationDeck />
                        <VideoGallery
                          videos={[...NORMALIZATION_VIDEOS, ...(dynamicVideoMap[`${course.id}_${lesson.id}`] ?? [])]}
                          accentColor="#6366f1"
                        />
                      </div>
                    )}
                    {lesson.id === 'quiz' && (
                      <QuizLesson studentProfile={studentProfile} isStaff={isStaff} />
                    )}
                    {lesson.id === 'sisp-lab' && <SISPPromptLab />}

                    {/* Lecturer-added videos — skipped for lessons that already merged them above */}
                    {(() => {
                      if (['er-activities', 'normalization'].includes(lesson.id)) return null;
                      const extra = dynamicVideoMap[`${course.id}_${lesson.id}`];
                      if (!extra?.length) return null;
                      return (
                        <VideoGallery
                          videos={extra}
                          accentColor={lesson.accentColor}
                        />
                      );
                    })()}

                    {/* Empty state for custom lessons with no videos yet */}
                    {lesson.isCustom && !dynamicVideoMap[`${course.id}_${lesson.id}`]?.length && (
                      <p className="text-sm text-center py-6" style={{ color: '#9ca3af' }}>
                        No videos have been added to this lesson yet.
                      </p>
                    )}
                  </LessonRow>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
