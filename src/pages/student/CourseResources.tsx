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
  Award,
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
import ERAttributeConstraintsDeck from '../../components/slides/ERAttributeConstraintsDeck';
import ERMappingDeck from '../../components/slides/ERMappingDeck';
import NormalizationDeck from '../../components/slides/NormalizationDeck';
import SISPPromptLab from '../../components/lab/SISPPromptLab';
import SQLPracticeLesson from '../../components/lab/SQLPracticeLesson';
import AgileScrumDeck from '../../components/slides/AgileScrumDeck';
import AgileScrumMcq from '../../components/quiz/AgileScrumMcq';
import AgileScrumMcqDashboard from '../../components/quiz/AgileScrumMcqDashboard';
import APAReferencingDeck from '../../components/slides/APAReferencingDeck';
import FiveStoriesLesson from '../../components/slides/FiveStoriesLesson';
import PlatformStrategyDeck from '../../components/slides/PlatformStrategyDeck';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import type { StudentProfile } from '../../lib/types';
import LessonPlansSection from '../../components/lecturer/LessonPlansSection';

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
  alwaysVisible?: boolean;
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
        id: 'five-stories',
        title: 'Five Stories That Changed Everything',
        subtitle: 'Airbnb · Netflix · Xero · Canva · Alibaba — origin stories, IS architecture, growth, and strategic lessons · Embedded videos · Discussion questions',
        icon: <BookOpen size={18} />,
        accentColor: '#0ea5e9',
      },
      {
        id: 'sisp-lab',
        title: 'SISP Prompt Engineering Lab',
        subtitle: '5 scenario-based challenges · AI-evaluated · Covers Iceberg Model, Process Dimensions, Participation, Consistency & Methodology',
        icon: <FlaskConical size={18} />,
        accentColor: '#0ea5e9',
      },
      {
        id: 'platform-strategy',
        title: 'Platform Strategy',
        subtitle: '18-slide interactive deck · Network effects, chicken-and-egg, governance, Amazon vs. GE Predix · Live launch simulator · Knowledge check',
        icon: <BookOpen size={18} />,
        accentColor: '#2563eb',
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
      // NOTE: "SQL Programming Slides", "ER Diagrams Basics", "ER Diagram Activities",
      // "Advanced ER Concepts" and "Composite Attributes & Participation Constraints"
      // now live as public, standalone lessons on the home launchpad (no login needed):
      //   /sql-programming · /er-diagrams · /er-activities · /er-advanced · /er-attributes
      {
        id: 'er-mapping',
        title: 'ER to Relational Schema Mapping',
        subtitle: '23-slide deck · 8 mapping rules · Worked example · Activity with answer',
        icon: <BookOpen size={18} />,
        accentColor: '#7c3aed',
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
      {
        id: 'sql-practice',
        title: 'SQL Practice Lab',
        subtitle: 'Hands-on SQL activity · Personalised scenario · Create database, table, insert & retrieve data · TA-verified',
        icon: <FlaskConical size={18} />,
        accentColor: '#7c3aed',
      },
      // NOTE: "Free MySQL / SQL / Database Design Certifications" is now a public page at /sql-certifications
    ],
  },
  {
    id: 'MBI804',
    name: 'MBI804',
    tagline: 'IT Project Management',
    accentColor: '#059669',
    bgGradient: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(52,211,153,0.04))',
    lessons: [
      {
        id: 'agile-scrum',
        title: 'Agile Scrum Process in IT',
        subtitle: '22-slide interactive deck · Roles, Artifacts, Events, Sprint Cycle, User Stories & Scrum Board',
        icon: <GitBranch size={18} />,
        accentColor: '#059669',
      },
      {
        id: 'agile-scrum-mcq',
        title: 'Agile Scrum Knowledge Check',
        subtitle: '30 multiple-choice questions · 3 attempts · Score ≥90% on first attempt to earn a badge',
        icon: <ClipboardList size={18} />,
        accentColor: '#0d9488',
      },
      {
        id: 'free-agile-certs',
        title: 'Free Agile & Scrum Certifications',
        subtitle: 'Four no-cost options where both the course and the completion certificate are free · Recommended to complement your Agile Scrum coursework',
        icon: <Award size={18} />,
        accentColor: '#059669',
      },
    ],
  },
  {
    id: 'GENERAL',
    name: 'GENERAL',
    tagline: 'General Resources for All Students',
    accentColor: '#4338ca',
    bgGradient: 'linear-gradient(135deg, rgba(67,56,202,0.08), rgba(99,102,241,0.04))',
    alwaysVisible: true,
    lessons: [
      {
        id: 'apa-referencing',
        title: 'APA 7 Citations: The Crash Course',
        subtitle: '14-slide interactive deck · In-text citations, reference types, common mistakes · Includes a practice quiz',
        icon: <BookOpen size={18} />,
        accentColor: '#4338ca',
      },
    ],
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

function FreeMySQLCertsLesson() {
  const certs = [
    {
      badge: 'MySQL Badge',
      badgeBg: 'rgba(204,7,30,0.10)',
      badgeColor: '#991b1b',
      title: 'Oracle MyLearn — MySQL Explorer',
      tag: 'VENDOR BADGE · BEGINNER · ≈5–7 hrs',
      tagColor: '#b91c1c',
      description:
        'The most credible free MySQL credential available — issued directly by Oracle, the company that owns MySQL. Complete the self-paced learning path covering the client/server model, MySQL Workbench, basic and complex queries, and troubleshooting. Earn an official "MySQL Explorer" digital badge from Oracle after passing a free online assessment. Free Oracle account only; no credit card.',
      linkLabel: 'mylearn.oracle.com',
      href: 'https://mylearn.oracle.com/ou/learning-path/mysql-explorer/79674',
      cardBg: 'linear-gradient(135deg, rgba(254,226,226,0.80), rgba(252,165,165,0.38))',
      borderColor: 'rgba(239,68,68,0.20)',
      accentColor: '#dc2626',
    },
    {
      badge: 'Verified Cert',
      badgeBg: 'rgba(5,150,105,0.10)',
      badgeColor: '#064e3b',
      title: 'HackerRank — SQL (Basic) Skills Certification',
      tag: 'SKILL EXAM · BEGINNER · 30 min',
      tagColor: '#059669',
      description:
        'A 30-minute online assessment — no course required, just study and sit it. Tests simple queries, relationships, and aggregators on relational databases including MySQL. You earn a verified Skills Certificate with a unique public URL, widely recognised by technical recruiters. Scores are private if you fail; retake after a waiting period. Intermediate (35 min) and Advanced (60 min) exams also free.',
      linkLabel: 'hackerrank.com',
      href: 'https://www.hackerrank.com/skills-verification/sql_basic',
      cardBg: 'linear-gradient(135deg, rgba(209,250,229,0.75), rgba(167,243,208,0.38))',
      borderColor: 'rgba(5,150,105,0.20)',
      accentColor: '#059669',
    },
    {
      badge: 'Credly Badge',
      badgeBg: 'rgba(37,99,235,0.10)',
      badgeColor: '#1e3a8a',
      title: 'Cisco NetAcad — Data Analytics Essentials',
      tag: 'DIGITAL BADGE + CERT · BEGINNER · ≈30 hrs',
      tagColor: '#1d4ed8',
      description:
        'One of the most generous truly-free programs online — 660,000+ learners enrolled. Covers Excel, an introduction to relational databases and SQL (Modules 6 & 7), Tableau, data visualisation, and data ethics across 10 modules and 29 hands-on labs. Earns a free Credly-verified digital badge and certificate of completion from Cisco. Free NetAcad account; no credit card.',
      linkLabel: 'netacad.com',
      href: 'https://www.netacad.com/catalogs/learn',
      cardBg: 'linear-gradient(135deg, rgba(219,234,254,0.80), rgba(186,230,253,0.42))',
      borderColor: 'rgba(37,99,235,0.18)',
      accentColor: '#1d4ed8',
    },
    {
      badge: 'ACE Cert',
      badgeBg: 'rgba(109,40,217,0.10)',
      badgeColor: '#4c1d95',
      title: 'Saylor Academy — CS403: Intro to Modern Database Systems',
      tag: 'COMPLETION CERT · BEGINNER · ≈42 hrs',
      tagColor: '#7c3aed',
      description:
        'The best single free option for database theory — one of the very few truly-free courses that covers both ER diagrams AND SQL in depth. Topics include database architecture, the Entity-Relationship model, relational algebra, data normalisation, SQL SELECT and JOINs, and database design. A free proctored final exam (≥70% to pass) earns an ACE-recommended completion certificate.',
      linkLabel: 'learn.saylor.org',
      href: 'https://learn.saylor.org/course/view.php?id=93',
      cardBg: 'linear-gradient(135deg, rgba(237,233,254,0.85), rgba(221,214,254,0.45))',
      borderColor: 'rgba(109,40,217,0.18)',
      accentColor: '#7c3aed',
    },
    {
      badge: 'Kaggle PDF',
      badgeBg: 'rgba(6,182,212,0.10)',
      badgeColor: '#164e63',
      title: 'Kaggle Learn — Intro to SQL (Google)',
      tag: 'PDF CERTIFICATE · BEGINNER · ≈3 hrs',
      tagColor: '#0891b2',
      description:
        'A practical browser-based course by Kaggle (a Google company) using BigQuery — covering SELECT, FROM, WHERE, GROUP BY, ORDER BY, AS, and WITH. A free downloadable PDF certificate is issued automatically when all module exercises are complete. Kaggle also offers a free "Advanced SQL" certificate (≈4 hrs) covering JOINs, analytic functions, nested data, and query efficiency.',
      linkLabel: 'kaggle.com/learn/intro-to-sql',
      href: 'https://www.kaggle.com/learn/intro-to-sql',
      cardBg: 'linear-gradient(135deg, rgba(207,250,254,0.80), rgba(165,243,252,0.42))',
      borderColor: 'rgba(6,182,212,0.20)',
      accentColor: '#0891b2',
    },
    {
      badge: 'Completion Cert',
      badgeBg: 'rgba(79,70,229,0.10)',
      badgeColor: '#312e81',
      title: 'SoloLearn — Introduction to SQL',
      tag: 'CERTIFICATE · BEGINNER · MOBILE-FRIENDLY',
      tagColor: '#4338ca',
      description:
        'A mobile-friendly ≈5–10-hour course covering SQL CRUD operations, filtering, sorting, joins, and basic relational concepts that apply directly to MySQL. A free completion certificate is issued after finishing all lessons and Code Coach problems. A free SQL Intermediate course is also available. Free SoloLearn account on web or mobile app; no credit card.',
      linkLabel: 'sololearn.com',
      href: 'https://www.sololearn.com/en/learn/courses/sql-introduction',
      cardBg: 'linear-gradient(135deg, rgba(224,231,255,0.85), rgba(199,210,254,0.45))',
      borderColor: 'rgba(79,70,229,0.18)',
      accentColor: '#4338ca',
    },
    {
      badge: 'IBM Badge',
      badgeBg: 'rgba(29,78,216,0.10)',
      badgeColor: '#1e3a8a',
      title: 'IBM / Cognitive Class — SQL and Relational Databases 101',
      tag: 'IBM DIGITAL BADGE · BEGINNER · ≈5–6 hrs',
      tagColor: '#1d4ed8',
      description:
        'An IBM-backed course covering relational model concepts, the five basic SQL statements, advanced SQL syntax, and JOIN statements — with hands-on exercises and a final exam. Passing the exam earns both a free completion certificate and an IBM digital badge issued via Credly. Free Cognitive Class / IBM ID account; no credit card required.',
      linkLabel: 'cognitiveclass.ai',
      href: 'https://cognitiveclass.ai/courses/learn-sql-relational-databases',
      cardBg: 'linear-gradient(135deg, rgba(219,234,254,0.85), rgba(191,219,254,0.42))',
      borderColor: 'rgba(29,78,216,0.18)',
      accentColor: '#1d4ed8',
    },
    {
      badge: 'FCC Cert',
      badgeBg: 'rgba(5,150,105,0.10)',
      badgeColor: '#064e3b',
      title: 'freeCodeCamp — Relational Database Certification',
      tag: 'PUBLIC CERT · PROJECT-BASED · ≈300 hrs',
      tagColor: '#047857',
      description:
        'One of the most respected truly-free programming certifications. Project-based work covering Bash, PostgreSQL/relational databases, Git, and building relational databases from scratch — with SQL skills that transfer directly to MySQL. Complete five required projects to earn a publicly verifiable certification on your freeCodeCamp profile. 100% open-source and free.',
      linkLabel: 'freecodecamp.org',
      href: 'https://www.freecodecamp.org/learn/relational-database/',
      cardBg: 'linear-gradient(135deg, rgba(209,250,229,0.85), rgba(187,247,208,0.42))',
      borderColor: 'rgba(5,150,105,0.20)',
      accentColor: '#047857',
    },
    {
      badge: 'SkillUp',
      badgeBg: 'rgba(217,119,6,0.10)',
      badgeColor: '#78350f',
      title: 'Simplilearn SkillUp — SQL & Database Course Bundle',
      tag: 'FREE CERT BUNDLE · BEGINNER · 1–9 hrs each',
      tagColor: '#b45309',
      description:
        'Multiple free SQL/database tracks on Simplilearn\'s SkillUp platform — covering Introduction to Databases, SQL Fundamentals, SQL for Data Analysis, SQL for Data Science, and SQL Projects. Each course issues a free downloadable PDF completion certificate automatically. All self-paced; free SkillUp account; no credit card required.',
      linkLabel: 'simplilearn.com/skillup',
      href: 'https://www.simplilearn.com/learn-basics-of-databases-free-course-skillup',
      cardBg: 'linear-gradient(135deg, rgba(254,243,199,0.90), rgba(253,230,138,0.42))',
      borderColor: 'rgba(217,119,6,0.20)',
      accentColor: '#b45309',
    },
  ];

  const whyLinkedIn = [
    { icon: '👁️', title: 'Recruiter Visibility', desc: 'Database and SQL skills are in high demand — hiring managers actively search LinkedIn for certified candidates every single day.' },
    { icon: '🤝', title: 'Grow Your Network', desc: 'Your post reaches your connections, their connections, and beyond — compounding your professional presence.' },
    { icon: '💼', title: 'Instant Credibility', desc: 'A vendor-issued or verifiable certificate signals initiative and drive — the exact qualities employers look for in graduates.' },
    { icon: '🚀', title: 'Career Momentum', desc: 'Every credential you post builds a public track record that speaks for you before any interview begins.' },
  ];

  const bonusResources = [
    { label: 'W3Schools MySQL Tutorial', href: 'https://www.w3schools.com/mysql/', note: 'Free study material (cert exam is paid)' },
    { label: 'MySQL Official Documentation', href: 'https://dev.mysql.com/doc/', note: 'Free vendor reference' },
    { label: 'Kaggle — Advanced SQL', href: 'https://www.kaggle.com/learn/advanced-sql', note: 'Free cert · JOINs, analytic functions, nested data' },
    { label: 'HackerRank — SQL Intermediate', href: 'https://www.hackerrank.com/skills-verification/sql_intermediate', note: 'Free 35-min skill cert' },
    { label: 'HackerRank — SQL Advanced', href: 'https://www.hackerrank.com/skills-verification/sql_advanced', note: 'Free 60-min skill cert' },
    { label: 'Oracle SQL Explorer Path', href: 'https://mylearn.oracle.com', note: 'Free vendor-neutral SQL badge (search "Oracle SQL Explorer")' },
    { label: 'IBM SkillsBuild — Data Catalog', href: 'https://skillsbuild.org/', note: 'Free DB learning paths with completion certs' },
    { label: 'SoloLearn — SQL Intermediate', href: 'https://www.sololearn.com/en/learn/courses/sql-intermediate', note: 'Free completion cert' },
    { label: 'SQLZoo / SQLBolt / Mode SQL', href: 'https://sqlzoo.net/', note: 'Free interactive practice (no certificate)' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Keyframe animations (fmc- prefix to avoid conflicts) ── */}
      <style>{`
        @keyframes fmc-float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes fmc-float2 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50%       { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes fmc-float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.15); }
        }
        @keyframes fmc-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(0,119,181,0.35), 0 8px 32px rgba(0,119,181,0.2); }
          50%       { box-shadow: 0 0 48px rgba(0,119,181,0.65), 0 12px 48px rgba(0,119,181,0.35); }
        }
        @keyframes fmc-badge-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(109,40,217,0.0); }
          50%       { box-shadow: 0 0 16px 4px rgba(109,40,217,0.25); }
        }
        @keyframes fmc-shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes fmc-pop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fmc-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.25; transform: scale(0.6); }
        }
        @keyframes fmc-ping-slow {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fmc-slide-up {
          from { transform: translateY(14px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes fmc-rank-reveal {
          0%   { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .fmc-float-1 { animation: fmc-float  2.8s ease-in-out infinite; }
        .fmc-float-2 { animation: fmc-float2 3.2s ease-in-out infinite 0.4s; }
        .fmc-float-3 { animation: fmc-float3 2.4s ease-in-out infinite 0.8s; }
        .fmc-float-4 { animation: fmc-float  3.6s ease-in-out infinite 1.2s; }
        .fmc-float-5 { animation: fmc-float2 2.6s ease-in-out infinite 0.2s; }
        .fmc-glow-card { animation: fmc-glow 3s ease-in-out infinite; }
        .fmc-shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #bfdbfe 40%, #fff 60%, #93c5fd 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fmc-shimmer 4s linear infinite;
        }
        .fmc-btn-shimmer {
          background: linear-gradient(90deg, #fff 0%, #dbeafe 40%, #fff 60%, #e0f2fe 100%);
          background-size: 300% auto;
          animation: fmc-shimmer 2.5s linear infinite;
        }
        .fmc-pop-in { animation: fmc-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both; }
        .fmc-twinkle-1 { animation: fmc-twinkle 1.8s ease-in-out infinite; }
        .fmc-twinkle-2 { animation: fmc-twinkle 2.4s ease-in-out infinite 0.6s; }
        .fmc-twinkle-3 { animation: fmc-twinkle 1.5s ease-in-out infinite 1.1s; }
        .fmc-cert-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .fmc-cert-card:hover { transform: translateY(-4px) scale(1.015); box-shadow: 0 10px 28px rgba(0,0,0,0.10); }
        .fmc-slide-up { animation: fmc-slide-up 0.55s ease both; }
        .fmc-rank-pill { animation: fmc-rank-reveal 0.4s ease both; }
        .fmc-badge-pulse { animation: fmc-badge-glow 2.5s ease-in-out infinite; }
      `}</style>

      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#7c3aed' }}>
          Resource
        </p>
        <h3 className="text-lg font-bold mt-1" style={{ color: '#1e1b4b' }}>
          Free MySQL / SQL / Database Design Certifications
        </h3>
        <p
          className="text-xs mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ color: '#4c1d95', background: 'rgba(221,214,254,0.55)' }}
        >
          <Sparkles size={12} /> MBI802 · Database Management Systems
        </p>
      </div>

      {/* ── Terminology note ── */}
      <div
        className="rounded-2xl p-4 border fmc-slide-up"
        style={{
          background: 'linear-gradient(135deg, rgba(237,233,254,0.8), rgba(224,231,255,0.5))',
          borderColor: 'rgba(109,40,217,0.18)',
        }}
      >
        <p className="text-xs font-bold mb-2" style={{ color: '#5b21b6' }}>📖 Quick Terminology</p>
        <div className="space-y-1 text-xs" style={{ color: '#4c1d95' }}>
          <p><span className="font-semibold">Badge / digital credential</span> — Shareable, verifiable credential you can post directly to LinkedIn.</p>
          <p><span className="font-semibold">Certificate of completion</span> — Downloadable PDF awarded after finishing course materials.</p>
          <p><span className="font-semibold">Skill certification exam</span> — Assessment-based credential you can claim by passing a test, even without a course.</p>
        </div>
      </div>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        Nine genuinely free MySQL, SQL, and database-design credentials — from vendor badges to
        skill exams and project-based certifications. Every option below is completely free to earn
        (no credit card required). Recommended to complement your MBI802 coursework and strengthen
        your CV and LinkedIn profile.
      </p>

      {/* ── Certification cards (3-column on large, 2 on medium, 1 on small) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {certs.map((cert, idx) => (
          <div
            key={cert.badge + idx}
            className="fmc-cert-card rounded-2xl p-4 border flex flex-col gap-3"
            style={{ background: cert.cardBg, borderColor: cert.borderColor }}
          >
            {/* Rank pill + badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="fmc-rank-pill text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full shrink-0"
                  style={{
                    background: cert.accentColor,
                    color: '#fff',
                    animationDelay: `${idx * 0.08}s`,
                    fontSize: 11,
                  }}
                >
                  {idx + 1}
                </span>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: cert.tagColor }}>
                  {cert.tag}
                </p>
              </div>
              <span
                className="fmc-badge-pulse text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: cert.badgeBg, color: cert.badgeColor }}
              >
                {cert.badge}
              </span>
            </div>

            <p className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>
              {cert.title}
            </p>

            <p className="text-xs leading-5 flex-1" style={{ color: '#374151' }}>{cert.description}</p>

            <a
              href={cert.href}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              style={{ color: cert.accentColor }}
            >
              <ExternalLink size={13} />
              {cert.linkLabel}
            </a>
          </div>
        ))}
      </div>

      {/* ── Bonus free resources (no cert) ── */}
      <div
        className="rounded-2xl p-4 border"
        style={{
          background: 'linear-gradient(135deg, rgba(243,244,246,0.9), rgba(249,250,251,0.7))',
          borderColor: 'rgba(139,92,246,0.14)',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6d28d9' }}>
          🔗 Useful Free Learning Resources — No Certificate, But Great for Practice
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {bonusResources.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-0.5 p-2.5 rounded-xl border hover:border-violet-300 transition-all"
              style={{
                background: 'rgba(255,255,255,0.8)',
                borderColor: 'rgba(139,92,246,0.12)',
                textDecoration: 'none',
              }}
            >
              <span className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: '#5b21b6' }}>
                <ExternalLink size={11} />{r.label}
              </span>
              <span className="text-xs" style={{ color: '#6b7280' }}>{r.note}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          LinkedIn Success Stories CTA
      ══════════════════════════════════════════════ */}
      <div
        className="fmc-glow-card rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #004f80 0%, #0077B5 45%, #00a0dc 100%)', position: 'relative' }}
      >
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '55%', width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Floating celebration icons */}
        <div style={{ position: 'absolute', top: 14, right: 18, fontSize: 28, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-1">🎉</div>
        <div style={{ position: 'absolute', top: 52, right: 56, fontSize: 20, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-2">⭐</div>
        <div style={{ position: 'absolute', bottom: 18, right: 22, fontSize: 26, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-3">🏆</div>
        <div style={{ position: 'absolute', bottom: 56, right: 70, fontSize: 18, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-4">✨</div>
        <div style={{ position: 'absolute', top: 90, right: 16, fontSize: 16, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-5">🚀</div>
        <div style={{ position: 'absolute', top: 130, right: 44, fontSize: 14, zIndex: 1, pointerEvents: 'none' }} className="fmc-float-1">🗄️</div>

        {/* Twinkling stars */}
        <div style={{ position: 'absolute', top: 22, left: 130, fontSize: 10, color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }} className="fmc-twinkle-1">★</div>
        <div style={{ position: 'absolute', top: 60, left: 80, fontSize: 8, color: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }} className="fmc-twinkle-2">★</div>
        <div style={{ position: 'absolute', bottom: 40, left: 160, fontSize: 12, color: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }} className="fmc-twinkle-3">★</div>

        <div className="p-6" style={{ position: 'relative', zIndex: 2 }}>

          {/* ── Top bar: LinkedIn logo + title ── */}
          <div className="flex items-center gap-3 mb-5">
            <div style={{
              background: 'white', borderRadius: 12, padding: '8px 8px 6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#0077B5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <p className="fmc-shimmer-text font-extrabold text-xl leading-tight">
                Share Your Achievement!
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(186,230,253,0.9)' }}>
                Let the world know you levelled up 🌍
              </p>
            </div>
          </div>

          {/* ── Personal message from lecturer ── */}
          <div
            className="fmc-pop-in rounded-2xl p-4 mb-5"
            style={{
              background: 'rgba(255,255,255,0.13)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div className="flex items-start gap-3">
              <span style={{ fontSize: 36, lineHeight: 1, color: 'rgba(255,255,255,0.35)', fontFamily: 'Georgia, serif', flexShrink: 0 }}>"</span>
              <div>
                <p className="text-white text-sm leading-relaxed">
                  I am <span className="font-bold" style={{ color: '#bfdbfe' }}>genuinely excited</span> to see your certification!
                  Database skills are among the most in-demand competencies in the industry right now.
                  Earning a free credential shows initiative, dedication, and a growth mindset —
                  exactly the qualities that stand out to employers.
                  Please post your achievement on LinkedIn and <span className="font-bold text-white">tag me</span> — I personally celebrate every single one of my students who levels up! 🎓
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: '#4ade80', animation: 'fmc-ping-slow 1.5s ease-out infinite',
                    }} />
                    <div style={{ position: 'absolute', inset: '2px', borderRadius: '50%', background: '#22c55e' }} />
                  </div>
                  <a
                    href="https://www.linkedin.com/in/yasassri/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold hover:underline"
                    style={{ color: '#bfdbfe' }}
                  >
                    Yasas Sri Wickramasinghe
                  </a>
                  <span className="text-xs" style={{ color: 'rgba(186,230,253,0.7)' }}>· MBI802 Lecturer</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Why LinkedIn posts matter ── */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(186,230,253,0.85)' }}>
              Why your LinkedIn post matters
            </p>
            <div className="grid grid-cols-2 gap-2">
              {whyLinkedIn.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-xl p-3"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                  <p className="text-white text-xs font-bold">{item.title}</p>
                  <p className="text-xs leading-4 mt-0.5" style={{ color: 'rgba(186,230,253,0.8)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── What to write tip ── */}
          <div
            className="rounded-xl p-3 mb-5 text-xs leading-5"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <p className="font-bold text-white mb-1">💡 What to write in your post</p>
            <p style={{ color: 'rgba(219,234,254,0.9)' }}>
              Share what you learned, which certification you earned, and how database skills connect to your career goals.
              Tag <span className="font-semibold text-white">@YasasSriWickramasinghe</span> so I can celebrate with you!
            </p>
          </div>

          {/* ── CTA button ── */}
          <a
            href="https://www.linkedin.com/in/yasassri/"
            target="_blank"
            rel="noreferrer"
            className="fmc-btn-shimmer flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-extrabold transition-transform hover:scale-105 active:scale-95"
            style={{
              color: '#004f80',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              textDecoration: 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Tag Yasas Sri Wickramasinghe on LinkedIn
            <ExternalLink size={14} />
          </a>

        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div
        className="rounded-xl p-3 border text-xs leading-5"
        style={{
          background: 'rgba(249,250,251,0.8)',
          borderColor: 'rgba(209,213,219,0.6)',
          color: '#6b7280',
        }}
      >
        <span className="font-semibold" style={{ color: '#374151' }}>A note before you enrol: </span>
        These platforms may update their pricing, enrolment processes, or certificate availability at
        any time — always read the course page carefully before signing up to confirm it is still
        free. These are independent suggestions only. This course has no affiliation with,
        sponsorship from, or endorsement by any of the platforms listed above. All trademarks and
        certifications belong to their respective owners.
      </div>
    </div>
  );
}

function FreeAgileCertsLesson() {
  const certs = [
    {
      badge: 'SFC™',
      badgeBg: 'rgba(5,150,105,0.12)',
      badgeColor: '#065f46',
      title: 'SCRUMstudy – Scrum Fundamentals Certified',
      tag: 'SCRUM FUNDAMENTALS',
      tagColor: '#059669',
      description:
        'One of the most established free Scrum credentials. Covers all core Scrum principles, phases, and team roles based on the SBOK® Guide. No time limit — study at your own pace, then take a 40-question online exam (75% to pass). The certificate has no expiry and is recognised globally as a solid entry-level credential to add to your CV or LinkedIn.',
      linkLabel: 'scrumstudy.com',
      href: 'https://www.scrumstudy.com/certification/scrum-fundamentals-certified',
      cardBg: 'linear-gradient(135deg, rgba(209,250,229,0.7), rgba(167,243,208,0.4))',
      borderColor: 'rgba(5,150,105,0.2)',
      accentColor: '#059669',
    },
    {
      badge: 'RSB',
      badgeBg: 'rgba(37,99,235,0.1)',
      badgeColor: '#1e3a8a',
      title: 'Scrum Inc. – Registered Scrum Basics™',
      tag: 'SCRUM BASICS',
      tagColor: '#1d4ed8',
      description:
        'Developed by Scrum Inc. — the organisation founded by Scrum co-creator Dr. Jeff Sutherland — in partnership with Atlassian and Accenture. Covers the Agile mindset, the full Scrum framework, and how Scrum is applied in real teams. Complete the Atlassian Community learning path, then pass a short online assessment to receive a verifiable digital credential from Scrum Inc. Takes only a few hours.',
      linkLabel: 'community.atlassian.com',
      href: 'https://community.atlassian.com/t5/Agile/ct-p/agile',
      cardBg: 'linear-gradient(135deg, rgba(219,234,254,0.7), rgba(186,230,253,0.4))',
      borderColor: 'rgba(37,99,235,0.18)',
      accentColor: '#1d4ed8',
    },
    {
      badge: 'SkillUp',
      badgeBg: 'rgba(217,119,6,0.1)',
      badgeColor: '#78350f',
      title: 'Simplilearn SkillUp – Agile Scrum Master Basics',
      tag: 'SCRUM MASTER BASICS',
      tagColor: '#b45309',
      description:
        'A ~5-hour self-paced video course introducing Agile, the Scrum framework, the Scrum Master role, and an overview of the Scaled Agile Framework (SAFe). A course completion certificate is automatically unlocked in your dashboard once all modules are done — no extra exam or upgrade required. Best used as structured self-study to deepen understanding of the Scrum Master role before pursuing paid industry credentials.',
      linkLabel: 'simplilearn.com',
      href: 'https://www.simplilearn.com/agile-and-scrum-free-course-skillup',
      cardBg: 'linear-gradient(135deg, rgba(254,243,199,0.8), rgba(253,230,138,0.4))',
      borderColor: 'rgba(217,119,6,0.18)',
      accentColor: '#b45309',
    },
    {
      badge: 'ACH Badge',
      badgeBg: 'rgba(79,70,229,0.1)',
      badgeColor: '#312e81',
      title: 'Atlassian University – Agile & Jira Fundamentals',
      tag: 'AGILE + JIRA',
      tagColor: '#4338ca',
      description:
        'A practical, tool-focused credential from Atlassian covering Agile principles and how to manage Scrum teams using Jira — sprint planning, backlog management, Scrum boards, and Kanban. Complete a short course then pass a free online assessment (80% pass mark) to earn a free Atlassian Credentials Hub (ACH) digital badge. Especially useful as most real-world Scrum teams use Jira as their project tool.',
      linkLabel: 'university.atlassian.com',
      href: 'https://university.atlassian.com',
      cardBg: 'linear-gradient(135deg, rgba(237,233,254,0.8), rgba(224,231,255,0.5))',
      borderColor: 'rgba(79,70,229,0.18)',
      accentColor: '#4338ca',
    },
  ];

  const whyLinkedIn = [
    { icon: '👁️', title: 'Recruiter Visibility', desc: 'Hiring managers actively search LinkedIn for certified Agile & Scrum professionals every single day.' },
    { icon: '🤝', title: 'Grow Your Network', desc: 'Your post reaches your connections, their connections, and beyond — compounding your professional presence.' },
    { icon: '💼', title: 'Instant Credibility', desc: 'A public certificate post signals drive and initiative — the exact traits employers look for in graduates.' },
    { icon: '🚀', title: 'Career Momentum', desc: 'Every credential you post builds a public track record that speaks for you before any interview begins.' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Injected keyframe animations ── */}
      <style>{`
        @keyframes fac-float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes fac-float2 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50%       { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes fac-float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.15); }
        }
        @keyframes fac-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(0,119,181,0.35), 0 8px 32px rgba(0,119,181,0.2); }
          50%       { box-shadow: 0 0 48px rgba(0,119,181,0.65), 0 12px 48px rgba(0,119,181,0.35); }
        }
        @keyframes fac-shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes fac-pop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fac-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fac-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.25; transform: scale(0.6); }
        }
        @keyframes fac-ping-slow {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fac-slide-up {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .fac-float-1 { animation: fac-float  2.8s ease-in-out infinite; }
        .fac-float-2 { animation: fac-float2 3.2s ease-in-out infinite 0.4s; }
        .fac-float-3 { animation: fac-float3 2.4s ease-in-out infinite 0.8s; }
        .fac-float-4 { animation: fac-float  3.6s ease-in-out infinite 1.2s; }
        .fac-float-5 { animation: fac-float2 2.6s ease-in-out infinite 0.2s; }
        .fac-glow-card { animation: fac-glow 3s ease-in-out infinite; }
        .fac-shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #bfdbfe 40%, #fff 60%, #93c5fd 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fac-shimmer 4s linear infinite;
        }
        .fac-btn-shimmer {
          background: linear-gradient(90deg, #fff 0%, #dbeafe 40%, #fff 60%, #e0f2fe 100%);
          background-size: 300% auto;
          animation: fac-shimmer 2.5s linear infinite;
        }
        .fac-pop-in { animation: fac-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both; }
        .fac-twinkle-1 { animation: fac-twinkle 1.8s ease-in-out infinite; }
        .fac-twinkle-2 { animation: fac-twinkle 2.4s ease-in-out infinite 0.6s; }
        .fac-twinkle-3 { animation: fac-twinkle 1.5s ease-in-out infinite 1.1s; }
        .fac-cert-card:hover { transform: translateY(-3px) scale(1.01); transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .fac-cert-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fac-slide-up { animation: fac-slide-up 0.6s ease both; }
      `}</style>

      {/* ── Header ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#059669' }}>
          Resource
        </p>
        <h3 className="text-lg font-bold mt-1" style={{ color: '#1e1b4b' }}>
          Free Agile &amp; Scrum Certifications
        </h3>
        <p
          className="text-xs mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ color: '#065f46', background: 'rgba(167,243,208,0.45)' }}
        >
          <Sparkles size={12} /> MBI804 · IT Project Management
        </p>
      </div>

      <p className="text-sm leading-6" style={{ color: '#374151' }}>
        Four no-cost options where both the course and the completion certificate are free.
        Recommended to complement your Agile Scrum coursework.
      </p>

      {/* ── Certification cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((cert) => (
          <div
            key={cert.badge}
            className="fac-cert-card rounded-2xl p-4 border flex flex-col gap-3"
            style={{ background: cert.cardBg, borderColor: cert.borderColor }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: cert.tagColor }}>
                  {cert.tag}
                </p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: '#1e1b4b' }}>
                  {cert.title}
                </p>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: cert.badgeBg, color: cert.badgeColor }}
              >
                {cert.badge}
              </span>
            </div>
            <p className="text-xs leading-5" style={{ color: '#374151' }}>{cert.description}</p>
            <a
              href={cert.href}
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              style={{ color: cert.accentColor }}
            >
              <ExternalLink size={13} />
              {cert.linkLabel}
            </a>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          LinkedIn Success Stories CTA
      ══════════════════════════════════════════════ */}
      <div
        className="fac-glow-card rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #004f80 0%, #0077B5 45%, #00a0dc 100%)', position: 'relative' }}
      >
        {/* Decorative background orbs */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: -30, width: 140, height: 140,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />

        {/* Floating celebration characters */}
        <div style={{ position: 'absolute', top: 14, right: 18, fontSize: 28, zIndex: 1, pointerEvents: 'none' }} className="fac-float-1">🎉</div>
        <div style={{ position: 'absolute', top: 52, right: 56, fontSize: 20, zIndex: 1, pointerEvents: 'none' }} className="fac-float-2">⭐</div>
        <div style={{ position: 'absolute', bottom: 18, right: 22, fontSize: 26, zIndex: 1, pointerEvents: 'none' }} className="fac-float-3">🏆</div>
        <div style={{ position: 'absolute', bottom: 56, right: 70, fontSize: 18, zIndex: 1, pointerEvents: 'none' }} className="fac-float-4">✨</div>
        <div style={{ position: 'absolute', top: 90, right: 16, fontSize: 16, zIndex: 1, pointerEvents: 'none' }} className="fac-float-5">🚀</div>

        {/* Twinkling stars */}
        <div style={{ position: 'absolute', top: 22, left: 130, fontSize: 10, pointerEvents: 'none' }} className="fac-twinkle-1">★</div>
        <div style={{ position: 'absolute', top: 60, left: 80, fontSize: 8, color: 'rgba(255,255,255,0.6)', pointerEvents: 'none' }} className="fac-twinkle-2">★</div>
        <div style={{ position: 'absolute', bottom: 40, left: 160, fontSize: 12, color: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }} className="fac-twinkle-3">★</div>

        <div className="p-6" style={{ position: 'relative', zIndex: 2 }}>

          {/* ── Top bar: LinkedIn logo + title ── */}
          <div className="flex items-center gap-3 mb-5">
            <div style={{
              background: 'white', borderRadius: 12, padding: '8px 8px 6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#0077B5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <p className="fac-shimmer-text font-extrabold text-xl leading-tight">
                Share Your Achievement!
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(186,230,253,0.9)' }}>
                Let the world know you levelled up 🌍
              </p>
            </div>
          </div>

          {/* ── Personal message from lecturer ── */}
          <div
            className="fac-pop-in rounded-2xl p-4 mb-5"
            style={{
              background: 'rgba(255,255,255,0.13)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div className="flex items-start gap-3">
              {/* Quote mark decoration */}
              <span style={{ fontSize: 36, lineHeight: 1, color: 'rgba(255,255,255,0.35)', fontFamily: 'Georgia, serif', flexShrink: 0 }}>"</span>
              <div>
                <p className="text-white text-sm leading-relaxed">
                  I am <span className="font-bold" style={{ color: '#bfdbfe' }}>truly excited</span> to hear about your completion!
                  Earning a free certification shows initiative, dedication, and a growth mindset —
                  exactly the qualities that stand out in the industry.
                  Please post your achievement on LinkedIn and <span className="font-bold text-white">tag me</span> — I personally celebrate
                  every single one of my students who levels up! 🎓
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {/* Animated presence dot */}
                  <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: '#4ade80', animation: 'fac-ping-slow 1.5s ease-out infinite',
                    }} />
                    <div style={{ position: 'absolute', inset: '2px', borderRadius: '50%', background: '#22c55e' }} />
                  </div>
                  <a
                    href="https://www.linkedin.com/in/yasassri/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold hover:underline"
                    style={{ color: '#bfdbfe' }}
                  >
                    Yasas Sri Wickramasinghe
                  </a>
                  <span className="text-xs" style={{ color: 'rgba(186,230,253,0.7)' }}>· MBI804 Lecturer</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Why LinkedIn posts matter ── */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(186,230,253,0.85)' }}>
              Why your LinkedIn post matters
            </p>
            <div className="grid grid-cols-2 gap-2">
              {whyLinkedIn.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-xl p-3"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                  <p className="text-white text-xs font-bold">{item.title}</p>
                  <p className="text-xs leading-4 mt-0.5" style={{ color: 'rgba(186,230,253,0.8)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── What to write tip ── */}
          <div
            className="rounded-xl p-3 mb-5 text-xs leading-5"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <p className="font-bold text-white mb-1">💡 What to write in your post</p>
            <p style={{ color: 'rgba(219,234,254,0.9)' }}>
              Share what you learned, why you chose the certification, and how it connects to your career goals.
              Tag <span className="font-semibold text-white">@YasasSriWickramasinghe</span>
            </p>
          </div>

          {/* ── CTA button ── */}
          <a
            href="https://www.linkedin.com/in/yasassri/"
            target="_blank"
            rel="noreferrer"
            className="fac-btn-shimmer flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-extrabold transition-transform hover:scale-105 active:scale-95"
            style={{
              color: '#004f80',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              textDecoration: 'none',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Tag Yasas Sri Wickramasinghe on LinkedIn
            <ExternalLink size={14} />
          </a>

        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div
        className="rounded-xl p-3 border text-xs leading-5"
        style={{
          background: 'rgba(249,250,251,0.8)',
          borderColor: 'rgba(209,213,219,0.6)',
          color: '#6b7280',
        }}
      >
        <span className="font-semibold" style={{ color: '#374151' }}>A note before you enrol: </span>
        These platforms may update their pricing, enrolment processes, or certificate availability at
        any time — always read the course page carefully before signing up to confirm it is still
        free. These are independent suggestions only. This course has no affiliation with,
        sponsorship from, or endorsement by any of the platforms listed above. All trademarks and
        certifications belong to their respective owners.
      </div>
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
    c => isStaff || c.alwaysVisible || enrolledSubjects.includes(c.id)
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
                    {lesson.id === 'er-attr-constraints' && <ERAttributeConstraintsDeck />}
                    {lesson.id === 'er-mapping' && <ERMappingDeck />}
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
                    {lesson.id === 'agile-scrum' && <AgileScrumDeck />}
                    {lesson.id === 'agile-scrum-mcq' && isStaff && <AgileScrumMcqDashboard />}
                    {lesson.id === 'agile-scrum-mcq' && !isStaff && (
                      <AgileScrumMcq studentProfile={studentProfile} />
                    )}
                    {lesson.id === 'free-agile-certs' && <FreeAgileCertsLesson />}
                    {/* free-mysql-certs moved to public page /sql-certifications */}
                    {lesson.id === 'five-stories' && <FiveStoriesLesson />}
                    {lesson.id === 'sisp-lab' && <SISPPromptLab />}
                    {lesson.id === 'platform-strategy' && <PlatformStrategyDeck />}
                    {lesson.id === 'sql-practice' && <SQLPracticeLesson />}
                    {lesson.id === 'apa-referencing' && <APAReferencingDeck />}

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

          {/* ── Lesson Plans — MBI802, staff only ─────────────────────────── */}
          {isStaff && selectedCourse === 'MBI802' && <LessonPlansSection />}
        </div>
      </div>
    </Layout>
  );
}
