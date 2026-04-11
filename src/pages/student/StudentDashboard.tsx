import { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Briefcase, Clock, Cloud, CloudFog, CloudRain, CloudSun, Globe, GraduationCap, Mail, MapPin, Sparkles, Sun, Users, BookOpen } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StudentPhotoCollage from '../../components/ui/StudentPhotoCollage';
import { avatarGradient } from '../../components/ui/PhotoUploadModal';
import type { StudentProfile } from '../../lib/types';
import { useFeatureTracking } from '../../lib/useFeatureTracking';

/* ── Greeting helpers ───────────────────────────────────────── */
function timeOfDayGreeting(date: Date): string {
  const h = date.getHours();
  if (h < 12)  return 'Good morning';
  if (h < 17)  return 'Good afternoon';
  return 'Good evening';
}

function firstName(fullName: string, emailFallback: string): string {
  const trimmed = (fullName || '').trim();
  if (trimmed) return trimmed.split(/\s+/)[0];
  const localPart = (emailFallback || '').split('@')[0] || '';
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

/* ── Daily match scoring ────────────────────────────────────── */
function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
}

function dateSeed(date: Date, extra: string): number {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${extra}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return (h >>> 0) / 0xffffffff;
}

interface ScoredMatch {
  student: StudentProfile;
  score: number;
  reasons: string[];
}

interface WeatherInfo {
  city: 'Auckland' | 'Christchurch';
  temperature: number;
  windSpeed: number;
  weatherCode: number;
}

function pickDailyMatch(me: StudentProfile, pool: StudentProfile[]): ScoredMatch | null {
  if (pool.length === 0) return null;

  const scored: ScoredMatch[] = pool.map(s => {
    let score = 0;
    const reasons: string[] = [];

    // Similar educational background
    if (me.educationalBackground && s.educationalBackground === me.educationalBackground) {
      score += 40;
      reasons.push(`Same study background: ${s.educationalBackground}`);
    }

    // Similar previous work industry
    if (me.workIndustry && s.workIndustry && s.workIndustry === me.workIndustry) {
      score += 25;
      reasons.push(`Worked in ${s.workIndustry} too`);
    }

    // Same home country
    if (me.homeCountry && s.homeCountry === me.homeCountry) {
      score += 30;
      reasons.push(`Also from ${s.homeCountry}`);
    }

    // Hometown proximity (within 400 km of each other)
    if (
      typeof me.hometownLat === 'number' && typeof me.hometownLng === 'number' &&
      typeof s.hometownLat === 'number' && typeof s.hometownLng === 'number'
    ) {
      const distance = haversineKm(
        [me.hometownLat, me.hometownLng],
        [s.hometownLat, s.hometownLng],
      );
      if (distance < 50)        { score += 25; reasons.push('Hometown just around the corner'); }
      else if (distance < 200)  { score += 18; reasons.push('Hometown nearby'); }
      else if (distance < 800)  { score += 10; reasons.push('Hometown in the same region'); }
    }

    // Same course
    if (me.course && s.course === me.course) {
      score += 10;
      reasons.push(`Enrolled in ${s.course}`);
    }

    return { student: s, score, reasons };
  });

  // Keep only students that actually share something
  const meaningful = scored.filter(m => m.score > 0);
  const fallback   = scored;

  // Pick the top-N candidates, then rotate the pick daily so each day
  // feels fresh instead of always showing the exact same person.
  const candidates = (meaningful.length > 0 ? meaningful : fallback)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(6, fallback.length));

  if (candidates.length === 0) return null;

  const seed = dateSeed(new Date(), me.uid || 'anon');
  const idx  = Math.floor(seed * candidates.length) % candidates.length;
  return candidates[idx];
}

/* ── Main component ─────────────────────────────────────────── */
export default function StudentDashboard() {
  const { user } = useAuth();
  useFeatureTracking('Student Dashboard');

  const [me, setMe] = useState<StudentProfile | null>(null);
  const [batchMates, setBatchMates] = useState<StudentProfile[]>([]);
  const [batchTotal, setBatchTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [mySnap, allSnap] = await Promise.all([
          getDoc(doc(db, 'students', user.uid)),
          getDocs(collection(db, 'students')),
        ]);

        const myProfile = mySnap.exists() ? (mySnap.data() as StudentProfile) : null;
        setMe(myProfile);

        // Normalize intake to a trimmed string so '2511 ' == '2511' etc.
        // The batch is defined by intake ONLY — subjects (MBI800/802/804)
        // are derived from intake, never used to narrow peers.
        const myIntake = (myProfile?.intake || '').toString().trim();

        if (myIntake) {
          const allStudents = allSnap.docs.map(d => d.data() as StudentProfile);
          const inBatch = allStudents.filter(
            s => (s.intake || '').toString().trim() === myIntake,
          );
          // Total includes the viewer, peers excludes them.
          setBatchTotal(inBatch.length);
          setBatchMates(inBatch.filter(s => s.uid !== user.uid));
        } else {
          setBatchTotal(0);
          setBatchMates([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    const campus = me?.campus;
    if (campus !== 'Auckland' && campus !== 'Christchurch') {
      setWeather(null);
      return;
    }

    const cityConfig = campus === 'Auckland'
      ? { city: 'Auckland' as const, latitude: -36.8485, longitude: 174.7633 }
      : { city: 'Christchurch' as const, latitude: -43.5321, longitude: 172.6362 };

    const controller = new AbortController();
    setWeatherLoading(true);

    (async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${cityConfig.latitude}&longitude=${cityConfig.longitude}&current=temperature_2m,wind_speed_10m,weather_code`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('Failed weather request');
        const data = await response.json() as {
          current?: {
            temperature_2m?: number;
            wind_speed_10m?: number;
            weather_code?: number;
          };
        };
        if (typeof data.current?.temperature_2m !== 'number') return;
        setWeather({
          city: cityConfig.city,
          temperature: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m ?? 0,
          weatherCode: data.current.weather_code ?? 0,
        });
      } catch {
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    })();

    return () => controller.abort();
  }, [me?.campus]);

  const peersWithPins = useMemo(
    () => batchMates.filter(
      s => typeof s.hometownLat === 'number' && typeof s.hometownLng === 'number',
    ),
    [batchMates],
  );

  const dailyMatch = useMemo(
    () => (me ? pickDailyMatch(me, batchMates) : null),
    [me, batchMates],
  );

  if (loading) {
    return <Layout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></Layout>;
  }

  const displayName = firstName(me?.fullName || '', user?.email || '');
  const greeting    = timeOfDayGreeting(new Date());
  const weatherIcon = (() => {
    if (!weather) return <Cloud size={18} />;
    if (weather.weatherCode === 0) return <Sun size={18} />;
    if ([1, 2].includes(weather.weatherCode)) return <CloudSun size={18} />;
    if ([3, 45, 48].includes(weather.weatherCode)) return <CloudFog size={18} />;
    if (weather.weatherCode >= 51) return <CloudRain size={18} />;
    return <Cloud size={18} />;
  })();

  return (
    <Layout>
      {/* ── Greeting hero ── */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8 animate-fadeIn"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.95) 0%, rgba(99,102,241,0.92) 50%, rgba(14,165,233,0.90) 100%)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 14px 44px rgba(76,51,176,0.32)',
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute -top-24 -right-16 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.30) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div
            className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{
              background: me?.photoURL
                ? 'transparent'
                : (user ? avatarGradient(user.uid) : 'linear-gradient(135deg,#a78bfa,#c4b5fd)'),
              border: '3px solid rgba(255,255,255,0.35)',
              boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
            }}
          >
            {me?.photoURL
              ? <img src={me.photoURL} alt={me.fullName || 'You'} className="w-full h-full object-cover" />
              : displayName.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <Sparkles size={12} className="inline mr-1 -mt-0.5" />
              Kia ora
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 leading-tight">
              {greeting}, {displayName}!
            </h1>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {me?.intake
                ? <>Welcome to your <span className="font-semibold">Intake {me.intake}</span> home base. {batchTotal} student{batchTotal === 1 ? '' : 's'} in your batch{batchMates.length > 0 ? <> — {batchMates.length} classmate{batchMates.length === 1 ? '' : 's'} besides you</> : null}.</>
                : <>Set your intake in your profile to see your batch-mates here.</>}
            </p>
          </div>

          {me?.intake && (
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <BookOpen size={12} />
                Intake {me.intake}
              </span>
              {(me.subjects || []).map(sub => (
                <span
                  key={sub}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(255,255,255,0.14)', color: 'white', border: '1px solid rgba(255,255,255,0.22)' }}
                >
                  {sub}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,243,255,0.92) 100%)',
            border: '1px solid rgba(139,92,246,0.16)',
            boxShadow: '0 10px 28px rgba(124,58,237,0.10)',
          }}
        >
          <div className="flex items-center gap-2.5 text-gray-800">
            <Clock size={16} className="text-brand-500" />
            <p className="text-sm font-semibold">{greeting}, {displayName}</p>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <span className="text-brand-500">{weatherIcon}</span>
            {weatherLoading ? (
              <p className="text-sm">Loading campus weather...</p>
            ) : weather ? (
              <p className="text-sm font-medium">
                {weather.city}: {Math.round(weather.temperature)}°C · Wind {Math.round(weather.windSpeed)} km/h
              </p>
            ) : (
              <p className="text-sm">Set your campus to see local weather.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── If the student has no intake yet, stop here with a prompt ── */}
      {!me?.intake && (
        <div className="card p-6 text-center animate-fadeIn">
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Once you pick your intake (2511 or 2604) on your profile page, this dashboard will show
            photos, hometowns and daily connection suggestions from your batch.
          </p>
        </div>
      )}

      {me?.intake && (
        <>
          {/* ── Daily Connect card ── */}
          <DailyConnectCard match={dailyMatch} />

          {/* ── Batch photo collage ── */}
          <StudentPhotoCollage students={batchMates} />

          {/* ── Batch hometown map ── */}
          <div className="card p-6 mb-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="rounded-xl p-2"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(96,165,250,0.08))' }}
              >
                <Globe size={16} style={{ color: '#0ea5e9' }} />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>
                  Where my batch is from
                </h3>
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  Hometowns of your Intake {me.intake} classmates
                </p>
              </div>
              <span
                className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}
              >
                <Users size={11} className="inline mr-1 -mt-0.5" />
                {peersWithPins.length} pinned
              </span>
            </div>

            <div className="divider" />

            {peersWithPins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(167,139,250,0.05))' }}
                >
                  <MapPin size={20} style={{ color: '#a78bfa' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>
                  None of your batch-mates have dropped a hometown pin yet.
                </p>
              </div>
            ) : (
              <div
                className="h-96 w-full overflow-hidden rounded-2xl"
                style={{ border: '1px solid rgba(139,92,246,0.10)' }}
              >
                <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {peersWithPins.map(s => (
                    <Marker key={s.uid} position={[s.hometownLat as number, s.hometownLng as number]}>
                      <Popup>
                        <div className="text-xs p-1">
                          <p className="font-bold text-gray-800">{s.fullName || 'Classmate'}</p>
                          <p className="text-gray-500 mt-0.5">
                            {s.hometown || s.homeCountry || 'Unknown hometown'}
                          </p>
                          {s.course && (
                            <p className="text-brand-500 font-medium mt-0.5">{s.course}</p>
                          )}
                          {s.email && (
                            <a
                              href={`mailto:${s.email}`}
                              className="text-indigo-500 mt-1 inline-block underline"
                            >
                              {s.email}
                            </a>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

/* ── Daily Connect card ─────────────────────────────────────── */
function DailyConnectCard({ match }: { match: ScoredMatch | null }) {
  if (!match) {
    return (
      <div className="card p-6 mb-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="rounded-xl p-2"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(167,139,250,0.08))' }}
          >
            <Sparkles size={16} style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Your daily connection</h3>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Fresh pick each day from your batch
            </p>
          </div>
        </div>
        <div className="divider" />
        <p className="text-sm text-center py-4" style={{ color: '#9ca3af' }}>
          No classmates to suggest yet — check back once more students join your intake.
        </p>
      </div>
    );
  }

  const { student, reasons } = match;
  const mailSubject = encodeURIComponent(`Hey ${student.fullName?.split(' ')[0] || ''} — from YooBees`);
  const mailBody    = encodeURIComponent(
    `Hi ${student.fullName?.split(' ')[0] || ''},\n\n` +
    `YooBees suggested we connect today — we're in the same batch and seem to have a bit in common. ` +
    `Thought I'd say hello!\n\n`,
  );

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 mb-6 animate-fadeIn"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(245,243,255,0.95) 100%)',
        border: '1px solid rgba(139,92,246,0.18)',
        boxShadow: '0 8px 32px rgba(124,58,237,0.12)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="rounded-xl p-2"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.14), rgba(167,139,250,0.10))' }}
        >
          <Sparkles size={16} style={{ color: '#7c3aed' }} />
        </div>
        <div>
          <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>Say hi to a classmate today</h3>
          <p className="text-xs" style={{ color: '#9ca3af' }}>A fresh match from your batch each day</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: avatar + details */}
        <div className="flex flex-col sm:flex-row gap-5 flex-1 min-w-0">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-3xl overflow-hidden flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 mx-auto sm:mx-0"
            style={{
              background: student.photoURL ? 'transparent' : avatarGradient(student.uid),
              border: '3px solid rgba(139,92,246,0.22)',
              boxShadow: '0 10px 28px rgba(124,58,237,0.22)',
            }}
          >
            {student.photoURL
              ? <img src={student.photoURL} alt={student.fullName} className="w-full h-full object-cover" />
              : (student.fullName?.[0] || student.email?.[0] || '?').toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold leading-tight" style={{ color: '#1e1b4b' }}>
              {student.fullName || 'Classmate'}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs" style={{ color: '#6b7280' }}>
              {student.course && (
                <span className="inline-flex items-center gap-1">
                  <GraduationCap size={12} /> {student.course}
                </span>
              )}
              {(student.hometown || student.homeCountry) && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {student.hometown || student.homeCountry}
                </span>
              )}
            </div>

            {/* Background highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              <BackgroundFact
                icon={<GraduationCap size={12} />}
                label="Academic background"
                value={student.educationalBackground}
              />
              <BackgroundFact
                icon={<Briefcase size={12} />}
                label="Career background"
                value={student.workIndustry}
              />
              <BackgroundFact
                icon={<Clock size={12} />}
                label="Experience"
                value={student.workExperience}
              />
              <BackgroundFact
                icon={<Globe size={12} />}
                label="Home country"
                value={student.homeCountry}
              />
            </div>

            {reasons.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {reasons.slice(0, 3).map((r, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      background: 'rgba(124,58,237,0.08)',
                      color: '#6d28d9',
                      border: '1px solid rgba(139,92,246,0.15)',
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}

            {student.email && (
              <a
                href={`mailto:${student.email}?subject=${mailSubject}&body=${mailBody}`}
                className="btn-primary mt-4 inline-flex"
                style={{ textDecoration: 'none' }}
              >
                <Mail size={14} />
                Email {student.fullName?.split(' ')[0] || 'them'}
              </a>
            )}
            {student.email && (
              <p className="text-[11px] mt-2 font-medium" style={{ color: '#9ca3af' }}>
                {student.email}
              </p>
            )}
          </div>
        </div>

        {/* Right: tiny hometown map */}
        <MiniHometownMap student={student} />
      </div>
    </div>
  );
}

/* ── Small helpers for the match card ──────────────────────── */
function BackgroundFact({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value?: string }) {
  const display = (value || '').trim() || 'Not shared';
  const isEmpty = !(value || '').trim();
  return (
    <div
      className="flex items-start gap-2 px-3 py-2 rounded-xl"
      style={{
        background: 'rgba(245,243,255,0.7)',
        border: '1px solid rgba(139,92,246,0.10)',
      }}
    >
      <span
        className="mt-0.5 rounded-md p-1 flex-shrink-0"
        style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
          {label}
        </p>
        <p
          className="text-xs font-semibold truncate"
          style={{ color: isEmpty ? '#c4b5fd' : '#1e1b4b' }}
          title={display}
        >
          {display}
        </p>
      </div>
    </div>
  );
}

function MiniHometownMap({ student }: { student: StudentProfile }) {
  const hasPin =
    typeof student.hometownLat === 'number' &&
    typeof student.hometownLng === 'number';

  return (
    <div
      className="w-full lg:w-56 flex-shrink-0 rounded-2xl overflow-hidden relative"
      style={{
        border: '1px solid rgba(139,92,246,0.15)',
        background: 'linear-gradient(135deg, rgba(245,243,255,0.9), rgba(237,233,254,0.6))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
        height: '192px',
      }}
    >
      {hasPin ? (
        <>
          <MapContainer
            center={[student.hometownLat as number, student.hometownLng as number]}
            zoom={4}
            className="h-full w-full"
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            zoomControl={false}
            attributionControl={false}
            keyboard={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[student.hometownLat as number, student.hometownLng as number]} />
          </MapContainer>
          <div
            className="absolute bottom-0 left-0 right-0 px-3 py-2"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(15,8,50,0.75))',
              pointerEvents: 'none',
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Hometown
            </p>
            <p className="text-xs font-bold text-white truncate" title={student.hometown || student.homeCountry || ''}>
              {student.hometown || student.homeCountry || 'Pinned'}
            </p>
          </div>
        </>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-center px-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(167,139,250,0.08))' }}
          >
            <MapPin size={18} style={{ color: '#a78bfa' }} />
          </div>
          <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>
            {student.homeCountry || 'Hometown not shared yet'}
          </p>
        </div>
      )}
    </div>
  );
}
