import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { Save, User, BookOpen, Globe, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout, { PageHeader } from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { StudentProfile } from '../../lib/types';

const COURSES = [
  'Master of Management',
  'Master of Software Engineering',
  'Master of Business Informatics - Business Analytics',
  'Master of Business Informatics - Healthcare Informatics',
];

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Brazil','Canada','Chile','China','Colombia','Croatia','Czech Republic',
  'Denmark','Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece','Hungary',
  'India','Indonesia','Iran','Iraq','Ireland','Italy','Japan','Jordan','Kenya',
  'Malaysia','Mexico','Morocco','Netherlands','New Zealand','Nigeria','Norway',
  'Pakistan','Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia',
  'Singapore','South Africa','South Korea','Spain','Sri Lanka','Sweden','Switzerland',
  'Thailand','Turkey','Ukraine','United Arab Emirates','United Kingdom','United States',
  'Vietnam','Other',
].sort();

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

const blank: Omit<StudentProfile, 'uid' | 'createdAt' | 'updatedAt'> = {
  fullName: '', studentId: '', email: '', course: '',
  homeCountry: '', workExperience: '', workIndustry: '', educationalBackground: '',
  specialNeeds: '',
};

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [form,    setForm]    = useState({ ...blank });
  const [notes,   setNotes]   = useState('');
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

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
          course: d.course || '',
          homeCountry: d.homeCountry || '',
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedStudentId = form.studentId.trim();

    if (!normalizedEmail.endsWith('@yoobeestudent.ac.nz')) {
      setError('Student email must end with @yoobeestudent.ac.nz.');
      return;
    }
    if (!/^\d{8}$/.test(normalizedStudentId)) {
      setError('Student ID must be numeric and exactly 8 digits (e.g. 27091691).');
      return;
    }

    setSaving(true); setError('');
    try {
      const studentsRef = collection(db, 'students');
      const [emailSnap, studentIdSnap] = await Promise.all([
        getDocs(query(studentsRef, where('email', '==', normalizedEmail), limit(1))),
        getDocs(query(studentsRef, where('studentId', '==', normalizedStudentId), limit(1))),
      ]);

      const emailTaken = !emailSnap.empty && emailSnap.docs[0].id !== user.uid;
      if (emailTaken) {
        setError('This student email is already used by another profile.');
        return;
      }

      const studentIdTaken = !studentIdSnap.empty && studentIdSnap.docs[0].id !== user.uid;
      if (studentIdTaken) {
        setError('This student ID is already used by another profile.');
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
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save. Please try again.');
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
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

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
            <Field label="Home country" required>
              <select className="input-field" value={form.homeCountry} onChange={set('homeCountry')} required>
                <option value="">Select country…</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
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
          <p className="text-xs text-slate-500 mb-3">
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
          {saved && <span className="text-emerald-600 text-sm font-medium">Profile saved!</span>}
        </div>
      </form>
    </Layout>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4 text-brand-600">
        {icon}
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
