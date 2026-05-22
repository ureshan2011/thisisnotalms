import { useEffect, useState, useCallback } from 'react';
import {
  Newspaper, RefreshCw, ExternalLink, Clock, TrendingUp,
  BookOpen, Briefcase, Code2, Database, BarChart3, AlertCircle,
  Cpu, Globe2, Zap,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────── */
type NewsCategory = 'technology' | 'business' | 'course';

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  source: string;
  sourceLogo?: string;
  category: NewsCategory;
  courseTag?: string;   // e.g. 'MBI802'
  publishedAt: string;
  description?: string;
  author?: string;
  score?: number;       // HackerNews score or reaction count
}

interface NewsWidgetProps {
  /** subjects from the student's profile, e.g. ['MBI800','MBI802'] */
  subjects?: string[];
}

/* ── Constants ──────────────────────────────────────────────── */
const CACHE_KEY = 'yb_news_v2';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const COURSE_TAG_MAP: Record<string, string[]> = {
  MBI800: ['cloud', 'webdev', 'javascript', 'ai', 'machinelearning'],
  MBI802: ['database', 'sql', 'mysql', 'postgresql', 'mongodb'],
  MBI804: ['agile', 'productivity', 'devops', 'career', 'management'],
};

const CATEGORY_GRADIENTS: Record<NewsCategory, string> = {
  technology: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
  business:   'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #0f766e 100%)',
  course:     'linear-gradient(135deg, #1e3a5f 0%, #1e40af 40%, #2563eb 100%)',
};

const CATEGORY_ICONS: Record<NewsCategory, React.ReactNode> = {
  technology: <Cpu size={20} />,
  business:   <BarChart3 size={20} />,
  course:     <BookOpen size={20} />,
};

const CATEGORY_COLORS: Record<NewsCategory, { bg: string; text: string; border: string }> = {
  technology: { bg: 'rgba(139,92,246,0.12)', text: '#7c3aed', border: 'rgba(139,92,246,0.2)' },
  business:   { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
  course:     { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', border: 'rgba(59,130,246,0.2)' },
};

const COURSE_LABELS: Record<string, string> = {
  MBI800: 'Business IS',
  MBI802: 'Database',
  MBI804: 'IT Project Mgmt',
};

/* ── Time helper ────────────────────────────────────────────── */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return 'Just now';
}

/* ── Fetch helpers ──────────────────────────────────────────── */
async function fetchDevToArticles(tags: string[], perPage = 5): Promise<NewsArticle[]> {
  const results: NewsArticle[] = [];
  const seen = new Set<string>();

  await Promise.allSettled(
    tags.slice(0, 3).map(async tag => {
      const res = await fetch(
        `https://dev.to/api/articles?per_page=${perPage}&tag=${tag}&top=1`,
        { signal: AbortSignal.timeout(8000) },
      );
      if (!res.ok) return;
      const data = await res.json() as Array<{
        id: number; title: string; description: string;
        cover_image: string | null; url: string; published_at: string;
        user: { name: string }; public_reactions_count: number;
      }>;
      for (const item of data) {
        const key = String(item.id);
        if (seen.has(key)) continue;
        seen.add(key);
        results.push({
          id:          `devto-${item.id}`,
          title:       item.title,
          url:         item.url,
          imageUrl:    item.cover_image || undefined,
          source:      'Dev.to',
          category:    'technology',
          publishedAt: item.published_at,
          description: item.description,
          author:      item.user?.name,
          score:       item.public_reactions_count,
        });
      }
    }),
  );
  return results;
}

async function fetchHackerNews(count = 8): Promise<NewsArticle[]> {
  const idsRes = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json',
    { signal: AbortSignal.timeout(6000) },
  );
  if (!idsRes.ok) return [];
  const ids = (await idsRes.json() as number[]).slice(0, 20);

  const items = await Promise.allSettled(
    ids.slice(0, count).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        signal: AbortSignal.timeout(5000),
      }).then(r => r.json() as Promise<{
        id: number; title: string; url?: string;
        score: number; by: string; time: number;
      }>),
    ),
  );

  return items
    .filter(r => r.status === 'fulfilled' && r.value?.title && r.value?.url)
    .map(r => {
      const item = (r as PromiseFulfilledResult<{ id: number; title: string; url?: string; score: number; by: string; time: number }>).value;
      return {
        id:          `hn-${item.id}`,
        title:       item.title,
        url:         item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        source:      'Hacker News',
        category:    'technology' as NewsCategory,
        publishedAt: new Date(item.time * 1000).toISOString(),
        author:      item.by,
        score:       item.score,
      };
    });
}

async function fetchGuardianBusiness(count = 6): Promise<NewsArticle[]> {
  const url =
    `https://content.guardianapis.com/search?section=business&show-fields=thumbnail,trailText&page-size=${count}&order-by=newest&api-key=test`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return [];
  const data = await res.json() as {
    response: {
      results: Array<{
        id: string; webTitle: string; webUrl: string;
        webPublicationDate: string; fields?: { thumbnail?: string; trailText?: string };
      }>;
    };
  };
  return (data.response?.results || []).map(item => ({
    id:          `guardian-${item.id}`,
    title:       item.webTitle,
    url:         item.webUrl,
    imageUrl:    item.fields?.thumbnail || undefined,
    source:      'The Guardian',
    category:    'business' as NewsCategory,
    publishedAt: item.webPublicationDate,
    description: item.fields?.trailText?.replace(/<[^>]*>/g, ''),
  }));
}

async function fetchGuardianTech(count = 5): Promise<NewsArticle[]> {
  const url =
    `https://content.guardianapis.com/search?section=technology&show-fields=thumbnail,trailText&page-size=${count}&order-by=newest&api-key=test`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return [];
  const data = await res.json() as {
    response: {
      results: Array<{
        id: string; webTitle: string; webUrl: string;
        webPublicationDate: string; fields?: { thumbnail?: string; trailText?: string };
      }>;
    };
  };
  return (data.response?.results || []).map(item => ({
    id:          `guardian-tech-${item.id}`,
    title:       item.webTitle,
    url:         item.webUrl,
    imageUrl:    item.fields?.thumbnail || undefined,
    source:      'The Guardian',
    category:    'technology' as NewsCategory,
    publishedAt: item.webPublicationDate,
    description: item.fields?.trailText?.replace(/<[^>]*>/g, ''),
  }));
}

async function fetchCourseNews(subjects: string[]): Promise<NewsArticle[]> {
  const results: NewsArticle[] = [];
  await Promise.allSettled(
    subjects.map(async sub => {
      const tags = COURSE_TAG_MAP[sub];
      if (!tags) return;
      const articles = await fetchDevToArticles(tags.slice(0, 2), 3);
      for (const a of articles) {
        results.push({ ...a, category: 'course', courseTag: sub });
      }
    }),
  );
  return results;
}

/* ── Cache ──────────────────────────────────────────────────── */
interface CacheEntry {
  articles: NewsArticle[];
  fetchedAt: number;
}

function readCache(): NewsArticle[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.fetchedAt > CACHE_TTL) return null;
    return entry.articles;
  } catch { return null; }
}

function writeCache(articles: NewsArticle[]) {
  try {
    const entry: CacheEntry = { articles, fetchedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch { /* storage full — skip */ }
}

/* ── Sub-components ─────────────────────────────────────────── */
function SkeletonCard({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden animate-pulse${wide ? ' col-span-full' : ''}`}
      style={{ border: '1px solid rgba(139,92,246,0.10)' }}
    >
      <div className="bg-gray-100" style={{ height: wide ? '220px' : '140px' }} />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

function CategoryBadge({ article }: { article: NewsArticle }) {
  const colors = CATEGORY_COLORS[article.category];
  const label  = article.courseTag
    ? COURSE_LABELS[article.courseTag] || article.courseTag
    : article.category === 'business'
    ? 'Business'
    : 'Technology';

  const Icon = article.courseTag
    ? (article.courseTag === 'MBI802' ? Database : article.courseTag === 'MBI804' ? Code2 : Globe2)
    : article.category === 'business'
    ? Briefcase
    : Zap;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      <Icon size={9} />
      {label}
    </span>
  );
}

interface ArticleImageProps {
  article: NewsArticle;
  className?: string;
  style?: React.CSSProperties;
}

function ArticleImage({ article, className = '', style }: ArticleImageProps) {
  const [failed, setFailed] = useState(false);

  if (!article.imageUrl || failed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ ...style, background: CATEGORY_GRADIENTS[article.category] }}
      >
        <div style={{ color: 'rgba(255,255,255,0.25)', transform: 'scale(2)' }}>
          {CATEGORY_ICONS[article.category]}
        </div>
      </div>
    );
  }

  return (
    <img
      src={article.imageUrl}
      alt={article.title}
      className={`object-cover ${className}`}
      style={style}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

/* ── Featured (hero) card ───────────────────────────────────── */
function FeaturedCard({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block col-span-full rounded-2xl overflow-hidden relative"
      style={{
        border: '1px solid rgba(139,92,246,0.15)',
        boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
        textDecoration: 'none',
        minHeight: '240px',
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <ArticleImage article={article} className="w-full h-full" />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(10,5,30,0.92) 0%, rgba(10,5,30,0.55) 50%, rgba(10,5,30,0.12) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-5 sm:p-6" style={{ minHeight: '240px' }}>
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)' }}
          >
            Featured
          </span>
          <CategoryBadge article={article} />
        </div>

        <h3
          className="text-white font-bold text-base sm:text-lg leading-snug group-hover:text-violet-200 transition-colors"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
        >
          {article.title}
        </h3>

        {article.description && (
          <p
            className="text-sm mt-1.5 line-clamp-2"
            style={{ color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
          >
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}
          >
            {article.source}
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            <Clock size={11} /> {timeAgo(article.publishedAt)}
          </span>
          {article.score !== undefined && article.score > 0 && (
            <span className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
              <TrendingUp size={11} /> {article.score}
            </span>
          )}
          <ExternalLink
            size={13}
            className="ml-auto group-hover:text-violet-300 transition-colors"
            style={{ color: 'rgba(255,255,255,0.50)' }}
          />
        </div>
      </div>
    </a>
  );
}

/* ── Regular news card ──────────────────────────────────────── */
function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid rgba(139,92,246,0.10)',
        boxShadow: '0 2px 12px rgba(99,102,241,0.06)',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(99,102,241,0.14)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(99,102,241,0.06)';
      }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: '140px' }}>
        <ArticleImage article={article} className="w-full h-full transition-transform duration-300 group-hover:scale-105" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <CategoryBadge article={article} />
        </div>

        <h4
          className="text-sm font-bold leading-snug flex-1 group-hover:text-violet-700 transition-colors"
          style={{ color: '#1e1b4b', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {article.title}
        </h4>

        {article.description && (
          <p
            className="text-xs mt-1.5 line-clamp-2"
            style={{ color: '#6b7280' }}
          >
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-2.5" style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
          <span className="text-[11px] font-semibold" style={{ color: '#9ca3af' }}>
            {article.source}
          </span>
          <div className="flex items-center gap-2">
            {article.score !== undefined && article.score > 0 && (
              <span className="text-[11px] flex items-center gap-0.5" style={{ color: '#c4b5fd' }}>
                <TrendingUp size={10} /> {article.score}
              </span>
            )}
            <span className="text-[11px] flex items-center gap-0.5" style={{ color: '#9ca3af' }}>
              <Clock size={10} /> {timeAgo(article.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ── Filter tabs ────────────────────────────────────────────── */
type FilterTab = 'all' | NewsCategory | string; // string = course code

interface TabsProps {
  active: FilterTab;
  subjects: string[];
  onSelect: (t: FilterTab) => void;
  counts: Record<string, number>;
}

function FilterTabs({ active, subjects, onSelect, counts }: TabsProps) {
  const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: 'all',        label: 'All',        icon: <Globe2 size={12} /> },
    { key: 'technology', label: 'Technology', icon: <Cpu size={12} /> },
    { key: 'business',   label: 'Business',   icon: <Briefcase size={12} /> },
    ...subjects
      .filter(s => COURSE_TAG_MAP[s])
      .map(s => ({
        key:   s as FilterTab,
        label: COURSE_LABELS[s] || s,
        icon:  <BookOpen size={12} />,
      })),
  ];

  return (
    <div className="flex gap-1.5 flex-wrap">
      {tabs.map(t => {
        const isActive = active === t.key;
        const count    = counts[t.key as string] || 0;
        return (
          <button
            key={String(t.key)}
            onClick={() => onSelect(t.key)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
            style={
              isActive
                ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: 'white', boxShadow: '0 4px 12px rgba(124,58,237,0.30)' }
                : { background: 'rgba(139,92,246,0.07)', color: '#6d28d9', border: '1px solid rgba(139,92,246,0.14)' }
            }
          >
            {t.icon}
            {t.label}
            {count > 0 && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(139,92,246,0.15)',
                  color: isActive ? 'white' : '#7c3aed',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Main widget ────────────────────────────────────────────── */
export default function NewsWidget({ subjects = [] }: NewsWidgetProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [filter,   setFilter]   = useState<FilterTab>('all');
  const [lastFetch, setLastFetch] = useState<number>(0);

  const loadNews = useCallback(async (force = false) => {
    if (!force) {
      const cached = readCache();
      if (cached && cached.length > 0) {
        setArticles(cached);
        setLoading(false);
        setLastFetch(Date.now());
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const fetches = await Promise.allSettled([
        fetchGuardianTech(5),
        fetchGuardianBusiness(6),
        fetchHackerNews(8),
        fetchDevToArticles(['webdev', 'programming', 'javascript', 'typescript'], 4),
        subjects.length > 0 ? fetchCourseNews(subjects) : Promise.resolve([]),
      ]);

      const all: NewsArticle[] = [];
      const seen = new Set<string>();

      for (const result of fetches) {
        if (result.status === 'fulfilled') {
          for (const a of result.value) {
            if (!seen.has(a.title)) { seen.add(a.title); all.push(a); }
          }
        }
      }

      if (all.length === 0) {
        setError('Could not load news right now. Please try again later.');
        setLoading(false);
        return;
      }

      // Sort: course-relevant first, then by score/recency
      all.sort((a, b) => {
        if (a.category === 'course' && b.category !== 'course') return -1;
        if (b.category === 'course' && a.category !== 'course') return  1;
        const scoreA = a.score ?? 0;
        const scoreB = b.score ?? 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });

      setArticles(all);
      writeCache(all);
      setLastFetch(Date.now());
    } catch {
      setError('Failed to load news. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [subjects]);

  useEffect(() => { loadNews(); }, [loadNews]);

  /* Filter */
  const filtered = articles.filter(a => {
    if (filter === 'all')        return true;
    if (filter === 'technology') return a.category === 'technology';
    if (filter === 'business')   return a.category === 'business';
    if (filter === 'course')     return a.category === 'course';
    // Course code filter (MBI802 etc.)
    return a.courseTag === filter || a.category === filter;
  });

  /* Tab counts */
  const counts: Record<string, number> = {
    all:        articles.length,
    technology: articles.filter(a => a.category === 'technology').length,
    business:   articles.filter(a => a.category === 'business').length,
    course:     articles.filter(a => a.category === 'course').length,
    ...Object.fromEntries(
      subjects.map(s => [s, articles.filter(a => a.courseTag === s).length])
    ),
  };

  const featured  = filtered[0];
  const rest      = filtered.slice(1);

  return (
    <div className="card p-6 mb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl p-2"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.14),rgba(99,102,241,0.08))' }}
          >
            <Newspaper size={16} style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#1e1b4b' }}>
              What's happening in your field
            </h3>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Tech, business &amp; course-relevant news — refreshed every 30 minutes
            </p>
          </div>
        </div>
        <button
          onClick={() => loadNews(true)}
          disabled={loading}
          title="Refresh news"
          className="p-2 rounded-xl transition-all duration-150 flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.16)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.08)')}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {lastFetch > 0 && !loading && (
        <p className="text-[11px] mb-3 ml-11" style={{ color: '#c4b5fd' }}>
          Updated {timeAgo(new Date(lastFetch).toISOString())}
        </p>
      )}

      <div className="divider" />

      {/* Filter tabs */}
      {!loading && !error && articles.length > 0 && (
        <div className="mb-4">
          <FilterTabs
            active={filter}
            subjects={subjects.filter(s => counts[s] > 0)}
            onSelect={setFilter}
            counts={counts}
          />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          className="flex flex-col items-center justify-center py-10 gap-3 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.04)', border: '1px dashed rgba(239,68,68,0.15)' }}
        >
          <AlertCircle size={28} style={{ color: '#f87171' }} />
          <p className="text-sm font-medium text-center" style={{ color: '#6b7280', maxWidth: '320px' }}>
            {error}
          </p>
          <button
            onClick={() => loadNews(true)}
            className="btn-primary text-xs px-4 py-2"
          >
            <RefreshCw size={12} /> Try again
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard wide />
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* News grid */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: '#9ca3af' }}>No news in this category right now.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured hero */}
          <FeaturedCard article={featured} />

          {/* Regular cards */}
          {rest.slice(0, 11).map(a => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {/* Footer note */}
      {!loading && !error && articles.length > 0 && (
        <p className="text-center text-[11px] mt-5" style={{ color: '#d1d5db' }}>
          Sources: Dev.to · Hacker News · The Guardian — all public APIs, no data stored
        </p>
      )}
    </div>
  );
}
