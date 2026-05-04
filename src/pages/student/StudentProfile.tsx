import React, { useCallback, useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { MapPin, Save, User, BookOpen, Globe, Briefcase, GraduationCap, Heart, Camera, KeyRound, Star } from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PhotoUploadModal, { avatarGradient } from '../../components/ui/PhotoUploadModal';
import type { StudentProfile } from '../../lib/types';
import { useToast } from '../../components/ui/ToastProvider';
import { logEvent } from '../../lib/eventLog';
import { useFeatureTracking } from '../../lib/useFeatureTracking';

const COURSES = [
  'Master of Management',
  'Master of Software Engineering',
  'Master of Business Informatics - Business Analytics',
  'Master of Business Informatics - Healthcare Informatics',
];

const WORK_EXP = [
  'No work experience',
  'Less than 1 year',
  '1–2 years',
  '3–5 years',
  '6–10 years',
  'More than 10 years',
];

const WORK_INDUSTRIES = [
  'Banking',
  'Telecommunications',
  'Information Technology',
  'Finance',
  'Marketing',
  'Arts & Creative',
  'Healthcare',
  'Medical',
  'Political / Government',
  'Social Services',
  'Education',
  'Software Engineering',
  'Design',
  'Beauty Salon & Personal Care',
  'Hospitality & Tourism',
  'Retail',
  'Manufacturing',
  'Construction',
  'Logistics & Supply Chain',
  'Real Estate',
  'Legal',
  'Media & Communications',
  'Non-profit / NGO',
  'Entrepreneurship / Startup',
  'Other',
];

const PREVIOUS_QUALIFICATION_OPTIONS = [
  'Accounting',
  'Agriculture',
  'Architecture',
  'Arts & Design',
  'Biotechnology',
  'Business Administration',
  'Business Analytics',
  'Chemical Engineering',
  'Civil Engineering',
  'Commerce',
  'Communications & Media',
  'Computer Science',
  'Construction Management',
  'Data Science',
  'Dental',
  'Economics',
  'Education',
  'Electrical Engineering',
  'Engineering (General)',
  'Environmental Science',
  'Finance',
  'Food Science',
  'Hospitality & Tourism',
  'Human Resource Management',
  'Information Technology (IT)',
  'International Relations',
  'Law',
  'Logistics & Supply Chain',
  'Management',
  'Marketing',
  'Mechanical Engineering',
  'Medicine',
  'Nursing',
  'Pharmacy',
  'Political Science',
  'Project Management',
  'Psychology',
  'Public Health',
  'Social Sciences',
  'Software Engineering',
  'Statistics',
  'Veterinary Science',
  'Other',
];

const EDU_BG = [
  'Medical',
  'Nursing / Allied Health',
  'Political Science / Public Policy',
  'Social Science',
  'Humanities',
  'Finance',
  'Accounting',
  'Information Technology',
  'Software Engineering',
  'Computer Science',
  'Business / Management',
  'Design',
  'Beauty Salon / Cosmetology',
  'Law',
  'Education',
  'Arts & Creative',
  'Science',
  'Engineering',
  'Other / Not listed',
];

const SPECIAL_NEEDS_OPTIONS = [
  'None',
  'Visual impairment',
  'Hearing impairment',
  'Learning support needs (e.g. dyslexia)',
  'Mobility-related needs',
  'Mental health support',
  'Other — see notes',
];

const CAMPUSES = ['Auckland', 'Christchurch'] as const;
const AUCKLAND_SECTIONS = ['Section A', 'Section B', 'Section C'] as const;
const CHRISTCHURCH_DEFAULT_SECTION = 'Section Default (No Section)';
const INTAKES = ['2511', '2604'] as const;

function subjectsForIntake(intake: StudentProfile['intake']): string[] {
  if (intake === '2511') return ['MBI804'];
  if (intake === '2604') return ['MBI800', 'MBI802'];
  return [];
}

const blank: Omit<StudentProfile, 'uid' | 'createdAt' | 'updatedAt'> = {
  fullName: '', studentId: '', email: '', campus: '', section: '', intake: '', subjects: [], course: '',
  homeCountry: '', hometown: '', hometownLat: null, hometownLng: null,
  workExperience: '', workIndustry: '', educationalBackground: '',
  specialNeeds: '', photoURL: '',
};

export default function StudentProfilePage() {
  const { user, changePassword } = useAuth();
  useFeatureTracking('Student Profile');
  const [form,    setForm]    = useState({ ...blank });
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [erMcqBadge, setErMcqBadge] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const { showToast } = useToast();

  // Change-password state
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [savingPw,   setSavingPw]   = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) {
      showToast({ type: 'error', title: 'Password too short', description: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPw !== confirmPw) {
      showToast({ type: 'error', title: 'Passwords do not match', description: 'New password and confirmation must match.' });
      return;
    }
    setSavingPw(true);
    try {
      await changePassword(currentPw, newPw);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      showToast({ type: 'success', title: 'Password changed', description: 'Your password has been updated.' });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        showToast({ type: 'error', title: 'Wrong current password', description: 'The current password you entered is incorrect.' });
      } else if (code === 'auth/requires-recent-login') {
        showToast({ type: 'error', title: 'Session expired', description: 'Please sign out and sign back in, then try again.' });
      } else {
        showToast({ type: 'error', title: 'Failed to update password', description: 'Please try again.' });
      }
    } finally {
      setSavingPw(false);
    }
  };
  const [countryLookupLoading, setCountryLookupLoading] = useState(false);
  const [countryLookupError, setCountryLookupError] = useState('');
  const latestLookupRequestId = useRef(0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(doc(db, 'students', user.uid));
      if (snap.exists()) {
        const d = snap.data() as StudentProfile & { specialNeedsNotes?: string };
        setForm({
          fullName: d.fullName || '',
          studentId: d.studentId || '',
          email: d.email || user.email || '',
          campus: (d.campus as StudentProfile['campus']) || '',
          section: d.section || '',
          intake: (d.intake as StudentProfile['intake']) || '',
          subjects: Array.isArray(d.subjects) ? d.subjects.filter((s): s is string => typeof s === 'string') : subjectsForIntake((d.intake as StudentProfile['intake']) || ''),
          course: d.course || '',
          homeCountry: d.homeCountry || '',
          hometown: d.hometown || '',
          hometownLat: typeof d.hometownLat === 'number' ? d.hometownLat : null,
          hometownLng: typeof d.hometownLng === 'number' ? d.hometownLng : null,
          workExperience: d.workExperience || '',
          workIndustry: d.workIndustry || '',
          educationalBackground: d.educationalBackground || '',
          specialNeeds: d.specialNeeds || '',
          photoURL: d.photoURL || '',
        });
        setNotes(d.specialNeedsNotes || '');
        if (d.erMcqBadge) setErMcqBadge(true);
      } else {
        setForm(f => ({ ...f, email: user.email || '' }));
      }
      setLoading(false);
    })();
  }, [user]);

  const set = (key: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const detectCountryFromPin = useCallback(async (lat: number, lng: number): Promise<string> => {
    const nominatimUrl =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&accept-language=en`;

    try {
      const response = await fetch(nominatimUrl);
      if (response.ok) {
        const data = await response.json() as {
          address?: { country?: string; country_code?: string };
        };

        const explicitCountry = data.address?.country?.trim();
        if (explicitCountry) return explicitCountry;

        const countryCode = data.address?.country_code?.trim();
        if (countryCode) {
          try {
            const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
            const countryFromCode = displayNames.of(countryCode.toUpperCase())?.trim();
            if (countryFromCode) return countryFromCode;
          } catch {
            // ignore locale/display-name failures and continue to fallback provider
          }
        }
      }
    } catch {
      // continue to fallback provider
    }

    const fallbackUrl =
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const fallbackResponse = await fetch(fallbackUrl);
    if (!fallbackResponse.ok) {
      throw new Error('Fallback reverse geocode provider failed.');
    }

    const fallbackData = await fallbackResponse.json() as { countryName?: string };
    return fallbackData.countryName?.trim() || '';
  }, []);

  const updatePinAndCountry = useCallback(async (lat: number, lng: number) => {
    setForm(f => ({ ...f, hometownLat: lat, hometownLng: lng }));
    const requestId = ++latestLookupRequestId.current;
    setCountryLookupError('');
    setCountryLookupLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=3&addressdetails=1&accept-language=en`,
      );
      if (!response.ok) {
        throw new Error('Unable to reverse geocode location.');
      }

      const data = await response.json() as { address?: { country?: string } };
      const country = data.address?.country?.trim() || '';
      setForm(f => ({ ...f, homeCountry: country }));
      if (!country) {
        setCountryLookupError('Pin placed, but country could not be detected. Try another nearby point.');
      }
    } catch {
      setCountryLookupError('Pin placed, but country lookup failed. Please try again.');
      setForm(f => ({ ...f, homeCountry: '' }));
    } finally {
      setCountryLookupLoading(false);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedStudentId = form.studentId.trim();

    if (!normalizedEmail.endsWith('@yoobeestudent.ac.nz')) {
      showToast({ type: 'error', title: 'Invalid email', description: 'Student email must end with @yoobeestudent.ac.nz.' });
      return;
    }
    if (!/^\d{8,9}$/.test(normalizedStudentId)) {
      showToast({ type: 'error', title: 'Invalid student ID', description: 'Student ID must be numeric and 8 to 9 digits (e.g. 27091691 or 270916912).' });
      return;
    }
    if (!form.campus) {
      showToast({ type: 'error', title: 'Missing campus', description: 'Please select your campus.' });
      return;
    }
    if (!form.section) {
      showToast({ type: 'error', title: 'Missing section', description: 'Please select your section.' });
      return;
    }
    if (form.campus === 'Auckland' && !AUCKLAND_SECTIONS.includes(form.section as typeof AUCKLAND_SECTIONS[number])) {
      showToast({ type: 'error', title: 'Invalid section', description: 'For Auckland campus, please choose Section A, Section B, or Section C.' });
      return;
    }
    if (form.campus === 'Christchurch' && form.section !== CHRISTCHURCH_DEFAULT_SECTION) {
      showToast({ type: 'error', title: 'Invalid section', description: 'For Christchurch campus, section must be set to Section Default (No Section).' });
      return;
    }
    if (form.hometownLat === null || form.hometownLng === null) {
      showToast({ type: 'error', title: 'Hometown pin required', description: 'Please drop a hometown pin on the map.' });
      return;
    }
    if (!form.intake) {
      showToast({ type: 'error', title: 'Missing intake', description: 'Please select your intake.' });
      return;
    }
    setSaving(true);
    try {
      const studentsRef = collection(db, 'students');
      const [emailSnap, studentIdSnap] = await Promise.all([
        getDocs(query(studentsRef, where('email', '==', normalizedEmail), limit(1))),
        getDocs(query(studentsRef, where('studentId', '==', normalizedStudentId), limit(1))),
      ]);

      const emailTaken = !emailSnap.empty && emailSnap.docs[0].id !== user.uid;
      if (emailTaken) {
        showToast({ type: 'error', title: 'Email already in use', description: 'This student email is already used by another profile.' });
        return;
      }

      const studentIdTaken = !studentIdSnap.empty && studentIdSnap.docs[0].id !== user.uid;
      if (studentIdTaken) {
        showToast({ type: 'error', title: 'Student ID already in use', description: 'This student ID is already used by another profile.' });
        return;
      }

      const payload = {
        ...form,
        subjects: subjectsForIntake(form.intake),
        email: normalizedEmail,
        studentId: normalizedStudentId,
        uid: user.uid,
        specialNeedsNotes: notes,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };
      const existingProfile = await getDoc(doc(db, 'students', user.uid));
      await setDoc(doc(db, 'students', user.uid), payload, { merge: true });
      await logEvent({
        type: existingProfile.exists() ? 'student_profile_updated' : 'student_profile_created',
        description: existingProfile.exists()
          ? `${payload.fullName || payload.email} updated their student profile.`
          : `${payload.fullName || payload.email} created a new student profile.`,
        actorUid: user.uid,
        actorEmail: user.email,
        actorRole: 'student',
        targetUid: user.uid,
        targetName: payload.fullName || payload.email,
      }).catch(() => undefined);
      showToast({ type: 'success', title: 'Profile saved', description: 'Your profile has been updated successfully.' });
    } catch {
      showToast({ type: 'error', title: 'Save failed', description: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;

  return (
    <Layout>
      {photoModalOpen && (
        <PhotoUploadModal
          currentPhotoURL={form.photoURL || undefined}
          onClose={() => setPhotoModalOpen(false)}
          onUploaded={url => {
            setForm(f => ({ ...f, photoURL: url }));
            setPhotoModalOpen(false);
          }}
          skipable
        />
      )}

      <PageHeader
        title="My Profile"
        subtitle="Keep your information up to date"
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">

        {/* Photo section */}
        <div
          className="rounded-3xl p-6 animate-fadeIn"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(167,139,250,0.04) 100%)',
            border: '1px solid rgba(139,92,246,0.14)',
            boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
          }}
        >
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                style={{
                  background: form.photoURL
                    ? 'transparent'
                    : (user ? avatarGradient(user.uid) : 'linear-gradient(135deg, #7c3aed, #a78bfa)'),
                  border: '3px solid rgba(139,92,246,0.25)',
                  boxShadow: '0 6px 24px rgba(124,58,237,0.22)',
                }}
              >
                {form.photoURL
                  ? <img src={form.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  : (user?.email?.[0]?.toUpperCase() ?? '?')}
              </div>
              {/* Camera badge */}
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
              >
                <Camera size={13} color="white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm mb-0.5" style={{ color: '#1e1b4b' }}>
                {form.photoURL ? 'Profile photo added' : 'Add a profile photo'}
              </h3>
              <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>
                {form.photoURL
                  ? 'Your photo is visible to lecturers and appears in the class gallery.'
                  : 'Upload a clear photo so your lecturers and classmates can recognise you.'}
              </p>
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: form.photoURL
                    ? 'rgba(124,58,237,0.08)'
                    : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  color: form.photoURL ? '#7c3aed' : 'white',
                  border: form.photoURL ? '1px solid rgba(139,92,246,0.20)' : 'none',
                  boxShadow: form.photoURL ? 'none' : '0 4px 14px rgba(124,58,237,0.30)',
                }}
              >
                <Camera size={14} />
                {form.photoURL ? 'Change photo' : 'Upload photo'}
              </button>
            </div>
          </div>
        </div>

        {/* ER Distinction Badge */}
        {erMcqBadge && (
          <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.06))',
              border: '1.5px solid rgba(251,191,36,0.35)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(251,191,36,0.18)' }}>
              <Star size={22} fill="#f59e0b" strokeWidth={0} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#92400e' }}>ER Distinction Badge</p>
              <p className="text-xs mt-0.5" style={{ color: '#b45309' }}>
                Awarded for scoring 90%+ on the ER Knowledge Check on your first attempt.
              </p>
            </div>
          </div>
        )}

        {/* Personal Details */}
        <Section icon={<User size={16} />} title="Personal details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" required>
              <input className="input-field" value={form.fullName} onChange={set('fullName')} required placeholder="e.g. Maria Garcia" />
            </Field>
            <Field label="Student ID" required>
              <input className="input-field" value={form.studentId} onChange={set('studentId')} required placeholder="e.g. 27091691 or 270916912" />
            </Field>
            <Field label="Email address" required>
              <input className="input-field" type="email" value={form.email} onChange={set('email')} required placeholder="you@yoobeestudent.ac.nz" />
            </Field>
            <Field label="Home country (auto from map pin)">
              <input
                className="input-field"
                style={{ cursor: 'default', opacity: 0.8 }}
                value={form.homeCountry || (countryLookupLoading ? 'Detecting country…' : '')}
                readOnly
                placeholder="Set a hometown pin to detect country (optional)"
              />
            </Field>
          </div>
        </Section>

        {/* Hometown Pin */}
        <Section icon={<MapPin size={16} />} title="Hometown pin">
          <p className="text-xs font-medium mb-3" style={{ color: '#9ca3af' }}>
            Drop a pin on your hometown for a more accurate location than country only.
          </p>
          <WorldMapPicker
            lat={form.hometownLat}
            lng={form.hometownLng}
            onPick={updatePinAndCountry}
          />
          {form.hometownLat === null || form.hometownLng === null ? (
            <p className="text-xs font-medium mt-2" style={{ color: '#d97706' }}>Please click on the map to set your hometown pin.</p>
          ) : (
            <div className="text-xs mt-2 space-y-1">
              <p className="font-medium" style={{ color: '#9ca3af' }}>Pin set at {form.hometownLat.toFixed(4)}, {form.hometownLng.toFixed(4)}</p>
              {countryLookupLoading && <p className="font-medium" style={{ color: '#9ca3af' }}>Detecting country from pin…</p>}
              {countryLookupError && <p className="font-medium" style={{ color: '#d97706' }}>{countryLookupError}</p>}
            </div>
          )}
        </Section>

        {/* Course */}
        <Section icon={<Globe size={16} />} title="Campus and section">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Select Your Campus" required>
              <select
                className="input-field"
                value={form.campus}
                onChange={e => {
                  const selectedCampus = e.target.value as StudentProfile['campus'];
                  const section = selectedCampus === 'Auckland'
                    ? ''
                    : selectedCampus === 'Christchurch'
                      ? CHRISTCHURCH_DEFAULT_SECTION
                      : '';
                  setForm(f => ({ ...f, campus: selectedCampus, section }));
                }}
                required
              >
                <option value="">Select campus…</option>
                {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Select your Section" required>
              <select
                className="input-field"
                value={form.section}
                onChange={set('section')}
                required
                disabled={!form.campus}
              >
                <option value="">{form.campus ? 'Select section…' : 'Select campus first…'}</option>
                {form.campus === 'Auckland' && AUCKLAND_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                {form.campus === 'Christchurch' && (
                  <option value={CHRISTCHURCH_DEFAULT_SECTION}>{CHRISTCHURCH_DEFAULT_SECTION}</option>
                )}
              </select>
            </Field>
          </div>
        </Section>

        <Section icon={<BookOpen size={16} />} title="Intake and subjects">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Intake" required>
              <select
                className="input-field"
                value={form.intake}
                onChange={e => {
                  const intake = e.target.value as StudentProfile['intake'];
                  setForm(f => ({ ...f, intake, subjects: subjectsForIntake(intake) }));
                }}
                required
              >
                <option value="">Select intake…</option>
                {INTAKES.map(intake => <option key={intake} value={intake}>{intake}</option>)}
              </select>
            </Field>
            <Field label="Subjects for selected intake">
              <div
                className="rounded-2xl px-3 py-3 min-h-[44px] flex flex-wrap items-center gap-2"
                style={{ background: 'rgba(245,243,255,0.6)', border: '1px solid rgba(139,92,246,0.10)' }}
              >
                {subjectsForIntake(form.intake).length === 0 ? (
                  <span className="text-sm font-medium" style={{ color: '#9ca3af' }}>Select intake to view subjects</span>
                ) : (
                  subjectsForIntake(form.intake).map(subject => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
                    >
                      {subject}
                    </span>
                  ))
                )}
              </div>
            </Field>
          </div>
        </Section>

        {/* Course */}
        <Section icon={<BookOpen size={16} />} title="Course">
          <Field label="Enrolled course" required>
            <select className="input-field" value={form.course} onChange={set('course')} required>
              <option value="">Select course…</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </Section>

        {/* Education */}
        <Section icon={<GraduationCap size={16} />} title="Educational background">
          <Field label="Select Your Previous Bachelors/Diploma Qualification Field" required>
            <select className="input-field" value={form.educationalBackground} onChange={set('educationalBackground')} required>
              <option value="">Select…</option>
              {PREVIOUS_QUALIFICATION_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </Field>
        </Section>

        {/* Work Experience */}
        <Section icon={<Briefcase size={16} />} title="Work experience">
          <Field label="Years of professional experience" required>
            <select className="input-field" value={form.workExperience} onChange={set('workExperience')} required>
              <option value="">Select…</option>
              {WORK_EXP.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </Field>
          <div className="mt-4">
            <Field label="Previous work industry" required>
              <select className="input-field" value={form.workIndustry || ''} onChange={set('workIndustry')} required>
                <option value="">Select…</option>
                {WORK_INDUSTRIES.map(industry => <option key={industry} value={industry}>{industry}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* Special Needs */}
        <Section icon={<Heart size={16} />} title="Special needs or accommodations">
          <p className="text-xs font-medium mb-3" style={{ color: '#9ca3af' }}>
            This is optional and confidential. Please share anything that may help your lecturer support you effectively.
          </p>
          <Field label="Accommodation needs">
            <select className="input-field" value={form.specialNeeds} onChange={set('specialNeeds')}>
              <option value="">Prefer not to say / None</option>
              {SPECIAL_NEEDS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          {(form.specialNeeds === 'Other — see notes' || form.specialNeeds) && form.specialNeeds !== 'None' && (
            <div className="mt-4">
              <Field label="Additional notes (optional)">
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any details you'd like to share…"
                />
              </Field>
            </div>
          )}
        </Section>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <><LoadingSpinner size="sm" />Saving…</>
            ) : (
              <><Save size={16} />Save profile</>
            )}
          </button>
        </div>
      </form>

      {/* ── Change Password ── */}
      <Section icon={<KeyRound size={16} />} title="Change password">
        <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
          <div>
            <label className="label">Current password</label>
            <input
              type="password"
              className="input-field"
              value={currentPw}
              onChange={e => setCurrentPw(e.target.value)}
              placeholder="Enter your current password"
              required
            />
          </div>
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              className="input-field"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="label">Confirm new password</label>
            <input
              type="password"
              className="input-field"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              required
            />
          </div>
          <button type="submit" disabled={savingPw} className="btn-primary !py-2">
            {savingPw ? <><LoadingSpinner size="sm" />Updating…</> : <><KeyRound size={14} />Update password</>}
          </button>
        </form>
      </Section>
    </Layout>
  );
}

function WorldMapPicker({
  lat, lng, onPick,
}: {
  lat: number | null;
  lng: number | null;
  onPick: (lat: number, lng: number) => void;
}) {
  const defaultCenter: [number, number] = [20, 0];
  const worldBounds: [[number, number], [number, number]] = [[-90, -180], [90, 180]];
  const markerPos = lat !== null && lng !== null ? ([lat, lng] as [number, number]) : null;

  return (
    <div className="h-72 w-full rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.12)' }}>
      <MapContainer
        center={markerPos || defaultCenter}
        zoom={markerPos ? 4 : 2}
        minZoom={2}
        maxBounds={worldBounds}
        maxBoundsViscosity={1}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap
        />
        <MapClickHandler onPick={onPick} />
        {markerPos && <Marker position={markerPos} />}
      </MapContainer>
    </div>
  );
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => onPick(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 animate-fadeIn"
      style={{
        background: 'rgba(255,255,255,0.90)',
        border: '1px solid rgba(139,92,246,0.10)',
        boxShadow: '0 2px 16px rgba(124,106,247,0.06)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
        >
          {icon}
        </div>
        <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span style={{ color: '#e11d48' }}>*</span>}
      </label>
      {children}
    </div>
  );
}
