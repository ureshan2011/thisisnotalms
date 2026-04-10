import React, { useCallback, useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { MapPin, Save, User, BookOpen, Globe, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { StudentProfile } from '../../lib/types';
import { useToast } from '../../components/ui/ToastProvider';

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

const blank: Omit<StudentProfile, 'uid' | 'createdAt' | 'updatedAt'> = {
  fullName: '', studentId: '', email: '', campus: '', section: '', course: '',
  homeCountry: '', hometown: '', hometownLat: null, hometownLng: null,
  workExperience: '', workIndustry: '', educationalBackground: '',
  specialNeeds: '',
};

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [form,    setForm]    = useState({ ...blank });
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const { showToast } = useToast();
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
          course: d.course || '',
          homeCountry: d.homeCountry || '',
          hometown: d.hometown || '',
          hometownLat: typeof d.hometownLat === 'number' ? d.hometownLat : null,
          hometownLng: typeof d.hometownLng === 'number' ? d.hometownLng : null,
          workExperience: d.workExperience || '',
          workIndustry: d.workIndustry || '',
          educationalBackground: d.educationalBackground || '',
          specialNeeds: d.specialNeeds || '',
        });
        setNotes(d.specialNeedsNotes || '');
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
    if (!/^\d{8}$/.test(normalizedStudentId)) {
      showToast({ type: 'error', title: 'Invalid student ID', description: 'Student ID must be numeric and exactly 8 digits (e.g. 27091691).' });
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
    if (!form.homeCountry) {
      showToast({ type: 'error', title: 'Country not detected', description: 'Please place your pin again so we can detect your home country.' });
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
        email: normalizedEmail,
        studentId: normalizedStudentId,
        uid: user.uid,
        specialNeedsNotes: notes,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'students', user.uid), payload, { merge: true });
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
      <PageHeader
        title="My Profile"
        subtitle="Keep your information up to date"
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">

        {/* Personal Details */}
        <Section icon={<User size={16} />} title="Personal details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" required>
              <input className="input-field" value={form.fullName} onChange={set('fullName')} required placeholder="e.g. Maria Garcia" />
            </Field>
            <Field label="Student ID" required>
              <input className="input-field" value={form.studentId} onChange={set('studentId')} required placeholder="e.g. 27091691" />
            </Field>
            <Field label="Email address" required>
              <input className="input-field" type="email" value={form.email} onChange={set('email')} required placeholder="you@yoobeestudent.ac.nz" />
            </Field>
            <Field label="Home country (auto from map pin)" required>
              <input
                className="input-field"
                style={{ cursor: 'default', opacity: 0.8 }}
                value={form.homeCountry || (countryLookupLoading ? 'Detecting country…' : '')}
                readOnly
                required
                placeholder="Set a hometown pin to detect country"
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
            <Field label="Additional notes (optional)">
              <textarea
                className="input-field resize-none"
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any details you'd like to share…"
              />
            </Field>
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
  const markerPos = lat !== null && lng !== null ? ([lat, lng] as [number, number]) : null;

  return (
    <div className="h-72 w-full rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.12)' }}>
      <MapContainer center={markerPos || defaultCenter} zoom={markerPos ? 4 : 2} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
