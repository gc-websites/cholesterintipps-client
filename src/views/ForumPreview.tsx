import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FORUM_CATEGORIES,
  getThreads,
  ThreadSummary,
} from '../services/forumAPI';

const RELATIVE_FORMATTER =
  typeof Intl !== 'undefined' && 'RelativeTimeFormat' in Intl
    ? new Intl.RelativeTimeFormat('de', { numeric: 'auto' })
    : null;

const formatRelative = (iso: string | undefined, now: number): string => {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const diffSec = Math.round((t - now) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 45) return 'gerade eben';
  if (abs < 3600) {
    const m = Math.round(diffSec / 60);
    return RELATIVE_FORMATTER
      ? RELATIVE_FORMATTER.format(m, 'minute')
      : `vor ${Math.abs(m)} Min.`;
  }
  if (abs < 86400) {
    const h = Math.round(diffSec / 3600);
    return RELATIVE_FORMATTER
      ? RELATIVE_FORMATTER.format(h, 'hour')
      : `vor ${Math.abs(h)} Std.`;
  }
  const d = Math.round(diffSec / 86400);
  return RELATIVE_FORMATTER
    ? RELATIVE_FORMATTER.format(d, 'day')
    : `vor ${Math.abs(d)} T.`;
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AVATAR_GRADIENTS: Array<[string, string]> = [
  ['#4BC8BE', '#039185'],
  ['#7c3aed', '#4f46e5'],
  ['#f59e0b', '#ef4444'],
  ['#3b82f6', '#0ea5e9'],
  ['#10b981', '#059669'],
  ['#ec4899', '#db2777'],
];

const hashIdx = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % AVATAR_GRADIENTS.length;
};

const findCategorySlug = (key: string): string => {
  const c = FORUM_CATEGORIES.find(cat => cat.key === key);
  return c ? c.slug : '';
};

const findCategoryEmoji = (key: string): string => {
  const c = FORUM_CATEGORIES.find(cat => cat.key === key);
  return c ? c.emoji : '💬';
};

const ForumPreview = () => {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await getThreads({ page: 1, pageSize: 5, sort: 'latest' });
        if (cancelled) return;
        setThreads(r.data || []);
      } catch (err) {
        console.error('ForumPreview load error', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container section__padding">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-main/15 text-main3 dark:text-main px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full mb-3">
            Community
          </span>
          <h2 className="section__title m-0">
            Austausch im{' '}
            <span className="text-main3 dark:text-main">Community-Forum</span>
          </h2>
          <p className="section__description mt-2 max-w-2xl">
            Hier diskutieren Leser über Cholesterin, Ernährung, Werte,
            Medikamente und persönliche Erfahrungen. Kein Konto nötig — einfach
            mitlesen oder mitschreiben.
          </p>
        </div>
        <Link
          to="/forum"
          className="hidden sm:inline-flex items-center gap-2 text-main3 dark:text-main font-semibold hover:underline shrink-0"
        >
          Zum gesamten Forum
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FORUM_CATEGORIES.map(cat => (
          <Link
            key={cat.key}
            to={`/forum/c/${cat.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-main/40 hover:border-main3 hover:bg-main/10 text-sm text-mainText dark:text-white dark:border-white/30 dark:hover:bg-white/10 transition"
          >
            <span aria-hidden="true">{cat.emoji}</span>
            <span className="font-medium">{cat.key}</span>
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-light dark:bg-mainText/40 animate-pulse"
            />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-main3/40 dark:border-white/20 p-8 text-center">
          <p className="text-2xl mb-2" aria-hidden="true">
            🌱
          </p>
          <p className="font-semibold text-mainText dark:text-white">
            Noch keine Diskussionen — sei die erste Stimme im Forum.
          </p>
          <Link
            to="/forum/new"
            className="inline-flex mt-4 items-center gap-2 bg-main3 hover:bg-main2 text-white px-5 py-2.5 rounded-xl font-semibold transition"
          >
            ✍️ Diskussion starten
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 list-none p-0 m-0">
          {threads.map(t => {
            const href = t.slug
              ? `/forum/t/${encodeURIComponent(t.slug)}`
              : `/forum/t/${encodeURIComponent(t.documentId)}`;
            const [c1, c2] = AVATAR_GRADIENTS[hashIdx(t.authorName || '?')];
            const catSlug = findCategorySlug(t.category);
            const catEmoji = findCategoryEmoji(t.category);
            const activity = t.lastActivityAt || t.createdAt;
            return (
              <li key={t.documentId} className="relative">
                <Link
                  to={href}
                  className="block group rounded-2xl border border-mainText/10 dark:border-white/10 hover:border-main3 dark:hover:border-main bg-white dark:bg-mainText/30 p-4 sm:p-5 transition shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${c1}, ${c2})`,
                      }}
                      aria-hidden="true"
                    >
                      {getInitials(t.authorName)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-xs text-additionalText dark:text-white/60 mb-1">
                        <span className="font-semibold text-mainText dark:text-white">
                          {t.authorName}
                        </span>
                        {t.category && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-main/15 text-main3 dark:text-main font-semibold"
                              onClick={e => {
                                e.preventDefault();
                                if (catSlug)
                                  window.location.href = `/forum/c/${catSlug}`;
                              }}
                            >
                              <span aria-hidden="true">{catEmoji}</span>
                              {t.category}
                            </span>
                          </>
                        )}
                        {activity && (
                          <>
                            <span aria-hidden="true">·</span>
                            <time dateTime={activity}>
                              {formatRelative(activity, now)}
                            </time>
                          </>
                        )}
                      </div>
                      <h3 className="font-merriweather font-bold text-base sm:text-lg text-mainText dark:text-white group-hover:text-main3 dark:group-hover:text-main transition leading-snug line-clamp-2">
                        {t.title}
                      </h3>
                      {t.body && (
                        <p className="hidden sm:block mt-1.5 text-sm text-additionalText dark:text-white/60 line-clamp-2 leading-relaxed">
                          {t.body}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-additionalText dark:text-white/60">
                        <span className="inline-flex items-center gap-1">
                          💬 <strong>{t.commentCount ?? 0}</strong>{' '}
                          {t.commentCount === 1 ? 'Antwort' : 'Antworten'}
                        </span>
                        {typeof t.viewCount === 'number' && t.viewCount > 0 && (
                          <span className="inline-flex items-center gap-1">
                            👁 {t.viewCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Link
          to="/forum"
          className="sm:hidden inline-flex justify-center items-center gap-2 text-main3 dark:text-main font-semibold hover:underline"
        >
          Zum gesamten Forum
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          to="/forum/new"
          className="inline-flex justify-center items-center gap-2 bg-main3 hover:bg-main2 text-white px-5 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
        >
          ✍️ Eigene Diskussion starten
        </Link>
      </div>
    </section>
  );
};

export default ForumPreview;
