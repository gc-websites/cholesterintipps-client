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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <span className="inline-block text-[11px] font-semibold tracking-wider uppercase bg-main/15 text-main3 dark:text-main px-3 py-1 rounded-full mb-3">
            Community
          </span>
          <h2 className="section__title m-0 text-2xl md:text-3xl leading-tight">
            Austausch im{' '}
            <span className="text-main3 dark:text-main">Community-Forum</span>
          </h2>
          <p className="section__description mt-3">
            Leser diskutieren über Cholesterin, Ernährung, Werte, Medikamente
            und persönliche Erfahrungen. Kein Konto nötig — einfach mitlesen
            oder mitschreiben.
          </p>
        </div>
        <Link
          to="/forum"
          className="hidden md:inline-flex items-center gap-2 text-main3 dark:text-main font-semibold hover:gap-3 transition-all shrink-0"
        >
          Zum gesamten Forum
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FORUM_CATEGORIES.map(cat => (
          <Link
            key={cat.key}
            to={`/forum/c/${cat.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-mainText/15 hover:border-main3 hover:bg-main/10 text-sm text-mainText dark:text-white dark:border-white/20 dark:hover:bg-white/10 transition"
          >
            <span aria-hidden="true">{cat.emoji}</span>
            <span className="font-medium">{cat.key}</span>
          </Link>
        ))}
      </div>

      {/* Threads list */}
      {loading ? (
        <ul className="grid gap-4 list-none p-0 m-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className="h-[132px] sm:h-[148px] rounded-2xl bg-light dark:bg-mainText/40 animate-pulse"
            />
          ))}
        </ul>
      ) : threads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-main3/40 dark:border-white/20 p-10 text-center">
          <p className="text-3xl mb-2" aria-hidden="true">
            🌱
          </p>
          <p className="font-semibold text-mainText dark:text-white">
            Noch keine Diskussionen — sei die erste Stimme im Forum.
          </p>
          <Link
            to="/forum/new"
            className="inline-flex mt-5 items-center gap-2 bg-main3 hover:bg-main2 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-md"
          >
            ✍️ Diskussion starten
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 list-none p-0 m-0">
          {threads.map(t => {
            const href = t.slug
              ? `/forum/t/${encodeURIComponent(t.slug)}`
              : `/forum/t/${encodeURIComponent(t.documentId)}`;
            const [c1, c2] = AVATAR_GRADIENTS[hashIdx(t.authorName || '?')];
            const catEmoji = findCategoryEmoji(t.category);
            const activity = t.lastActivityAt || t.createdAt;
            const relativeStr = formatRelative(activity, now);
            return (
              <li key={t.documentId}>
                <Link
                  to={href}
                  className="group relative block rounded-2xl border border-mainText/10 dark:border-white/10 hover:border-main3/60 dark:hover:border-main bg-white dark:bg-mainText/30 p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Accent stripe on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-main3 via-main2 to-main opacity-0 group-hover:opacity-100 transition-opacity"
                  />

                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div
                      className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md ring-2 ring-white dark:ring-mainText"
                      style={{
                        background: `linear-gradient(135deg, ${c1}, ${c2})`,
                      }}
                      aria-hidden="true"
                    >
                      {getInitials(t.authorName)}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      {/* Top meta row: author + time, with category chip if room */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-[13px] text-additionalText dark:text-white/60 mb-1.5">
                        <span className="font-semibold text-mainText dark:text-white">
                          {t.authorName}
                        </span>
                        {relativeStr && (
                          <>
                            <span aria-hidden="true" className="opacity-50">
                              ·
                            </span>
                            <time dateTime={activity}>{relativeStr}</time>
                          </>
                        )}
                        {t.category && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-main/15 text-main3 dark:text-main text-[11px] font-semibold">
                            <span aria-hidden="true">{catEmoji}</span>
                            {t.category}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-merriweather font-bold text-base sm:text-lg md:text-xl text-mainText dark:text-white group-hover:text-main3 dark:group-hover:text-main transition-colors leading-snug line-clamp-2 mb-2">
                        {t.title}
                      </h3>

                      {/* Excerpt */}
                      {t.body && (
                        <p className="text-sm text-additionalText dark:text-white/60 line-clamp-2 leading-relaxed mb-3">
                          {t.body}
                        </p>
                      )}

                      {/* Footer: stats + arrow */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-additionalText dark:text-white/60">
                          <span className="inline-flex items-center gap-1.5">
                            <span aria-hidden="true">💬</span>
                            <strong className="text-mainText dark:text-white">
                              {t.commentCount ?? 0}
                            </strong>
                            <span className="hidden sm:inline">
                              {t.commentCount === 1 ? 'Antwort' : 'Antworten'}
                            </span>
                          </span>
                          {typeof t.viewCount === 'number' &&
                            t.viewCount > 0 && (
                              <span className="inline-flex items-center gap-1.5">
                                <span aria-hidden="true">👁</span>
                                {t.viewCount}
                              </span>
                            )}
                        </div>
                        <span
                          aria-hidden="true"
                          className="text-main3 dark:text-main font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Diskussion öffnen →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Bottom CTA */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center">
        <Link
          to="/forum"
          className="md:hidden inline-flex justify-center items-center gap-2 text-main3 dark:text-main font-semibold hover:underline py-2"
        >
          Zum gesamten Forum
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          to="/forum/new"
          className="inline-flex justify-center items-center gap-2 bg-gradient-to-br from-main3 to-main2 hover:from-main2 hover:to-main text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
        >
          ✍️ Eigene Diskussion starten
        </Link>
      </div>
    </section>
  );
};

export default ForumPreview;
