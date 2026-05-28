import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FORUM_CATEGORIES,
  getThreads,
  getTrendingThreads,
  ThreadSummary,
} from '../services/forumAPI';
import CategoryCard from '../components/forum/CategoryCard';
import ThreadCard from '../components/forum/ThreadCard';
import {
  buildCanonical,
  SITE_URL,
  useDocumentMeta,
  useStructuredData,
} from '../utils/seo';
import '../styles/forum.css';

const Forum = () => {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [trending, setTrending] = useState<ThreadSummary[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: 'Forum — Austausch rund um Cholesterin',
    description:
      'Diskutiere mit anderen über Cholesterin: Ernährung, Bewegung, Werte, Medikamente und Erfahrungen. Kein Konto nötig — wähle einfach einen Namen.',
    canonical: buildCanonical('/forum'),
  });

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      name: 'CholesterinTipps Community-Forum',
      url: `${SITE_URL}/forum`,
      inLanguage: 'de-DE',
    }),
    [],
  );
  useStructuredData(jsonLd, 'forum-home');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [latest, trend] = await Promise.all([
          getThreads({ page: 1, pageSize: 10, sort: 'latest' }),
          getTrendingThreads({ pageSize: 4 }),
        ]);
        setThreads(latest.data || []);
        setTrending(trend);

        const counts: Record<string, number> = {};
        await Promise.all(
          FORUM_CATEGORIES.map(async cat => {
            try {
              const r = await getThreads({
                category: cat.key,
                page: 1,
                pageSize: 1,
              });
              counts[cat.key] = r.meta?.pagination?.total ?? 0;
            } catch {
              counts[cat.key] = 0;
            }
          }),
        );
        setCategoryCounts(counts);
      } catch (err) {
        console.error('Forum load error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="cht-forum container">
      <header className="cht-forum__hero">
        <p className="cht-forum__heroEyebrow">Community</p>
        <h1 className="cht-forum__heroTitle">
          Das Forum rund um Cholesterin, Ernährung &amp; Gesundheit
        </h1>
        <p className="cht-forum__heroLead">
          Stelle Fragen, teile deine Erfahrungen und tausche dich mit anderen
          aus, die ihr Cholesterin im Blick behalten. Kein Konto nötig — wähle
          einfach einen Namen und schreibe los.
        </p>
        <div className="cht-forum__heroActions">
          <Link to="/forum/new" className="cht-forum__cta">
            ✍️ Neue Diskussion starten
          </Link>
          <a href="#latest" className="cht-forum__ctaGhost">
            Aktuelle Themen ansehen →
          </a>
        </div>
      </header>

      {trending.length > 0 && (
        <>
          <h2 className="cht-forum__sectionTitle">
            🔥 Gerade angesagt
            <span className="cht-forum__sectionEyebrow">
              meist diskutiert in den letzten 2 Wochen
            </span>
          </h2>
          <ul className="cht-forum__threadList" style={{ marginBottom: 36 }}>
            {trending.map(t => (
              <ThreadCard key={t.documentId} thread={t} />
            ))}
          </ul>
        </>
      )}

      <h2 className="cht-forum__sectionTitle">Kategorien durchstöbern</h2>
      <div className="cht-forum__catGrid">
        {FORUM_CATEGORIES.map(cat => (
          <CategoryCard
            key={cat.key}
            category={cat}
            threadCount={categoryCounts[cat.key]}
          />
        ))}
      </div>

      <h2 className="cht-forum__sectionTitle" id="latest">
        Neueste Diskussionen
      </h2>

      {loading ? (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="cht-forum__skeleton" />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="cht-forum__empty">
          <div className="cht-forum__emptyIcon" aria-hidden="true">
            🌱
          </div>
          <p className="cht-forum__emptyTitle">Noch keine Diskussionen</p>
          <p className="cht-forum__emptyText">
            Sei der oder die Erste und starte ein Thema — wähle eine Kategorie
            und teile, was dich beschäftigt.
          </p>
          <Link to="/forum/new" className="cht-forum__cta">
            Erstes Thema starten
          </Link>
        </div>
      ) : (
        <ul className="cht-forum__threadList">
          {threads.map(t => (
            <ThreadCard key={t.documentId} thread={t} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Forum;
