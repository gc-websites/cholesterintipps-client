import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  findCategoryBySlug,
  getThreads,
  ThreadSort,
  ThreadSummary,
} from '../services/forumAPI';
import ThreadCard from '../components/forum/ThreadCard';
import Page404 from './Page404';
import { buildCanonical, useDocumentMeta } from '../utils/seo';
import '../styles/forum.css';

const PAGE_SIZE = 20;

const SORT_LABELS: Record<ThreadSort, string> = {
  latest: 'Neueste',
  active: 'Aktivste',
  top: 'Top',
};

const ForumCategory = () => {
  const { categoryKey } = useParams<{ categoryKey: string }>();
  const category = categoryKey ? findCategoryBySlug(categoryKey) : null;

  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ThreadSort>('latest');
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  useDocumentMeta({
    title: category ? `${category.key} — Community-Forum` : 'Forum-Kategorie',
    description: category
      ? `Diskussionen in der Kategorie ${category.key}. ${category.blurb}`
      : 'Forum-Kategorie nicht gefunden',
    canonical: buildCanonical(
      category ? `/forum/c/${category.slug}` : '/forum',
    ),
    noindex: !category,
  });

  useEffect(() => {
    if (!category) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getThreads({
          category: category.key,
          page,
          pageSize: PAGE_SIZE,
          sort,
          q: searchQuery,
        });
        setThreads(res.data || []);
        setTotal(res.meta?.pagination?.total ?? 0);
      } catch (err) {
        console.error('Category load error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, page, sort, searchQuery]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total],
  );

  const pageNumbers: (number | '…')[] = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const out: (number | '…')[] = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);
    if (left > 2) out.push('…');
    for (let i = left; i <= right; i += 1) out.push(i);
    if (right < totalPages - 1) out.push('…');
    out.push(totalPages);
    return out;
  }, [page, totalPages]);

  if (!category) return <Page404 />;

  return (
    <div className="cht-forum container">
      <nav aria-label="Brotkrumen" className="cht-forum__crumbs">
        <Link to="/">Startseite</Link>
        <span className="cht-forum__crumbSep" aria-hidden="true">
          /
        </span>
        <Link to="/forum">Forum</Link>
        <span className="cht-forum__crumbSep" aria-hidden="true">
          /
        </span>
        <span>{category.key}</span>
      </nav>

      <header className="cht-forum__hero">
        <p className="cht-forum__heroEyebrow">{category.emoji} Kategorie</p>
        <h1 className="cht-forum__heroTitle">{category.key}</h1>
        <p className="cht-forum__heroLead">{category.blurb}</p>
        <div className="cht-forum__heroActions">
          <Link to="/forum/new" className="cht-forum__cta">
            ✍️ Neue Diskussion starten
          </Link>
          <Link to="/forum" className="cht-forum__ctaGhost">
            ← Alle Kategorien
          </Link>
        </div>
      </header>

      <div className="cht-forum__sortBar">
        <div
          className="cht-forum__sortTabs"
          role="tablist"
          aria-label="Themen sortieren"
        >
          {(Object.keys(SORT_LABELS) as ThreadSort[]).map(s => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={sort === s}
              className={`cht-forum__sortTab${
                sort === s ? ' cht-forum__sortTab--active' : ''
              }`}
              onClick={() => {
                setSort(s);
                setPage(1);
              }}
            >
              {SORT_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="cht-forum__searchWrap">
          <span className="cht-forum__searchIcon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className="cht-forum__search"
            placeholder={`In ${category.key} suchen…`}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            aria-label="Themen durchsuchen"
          />
          {searchInput && (
            <button
              type="button"
              className="cht-forum__searchClear"
              onClick={() => setSearchInput('')}
              aria-label="Suche zurücksetzen"
            >
              ×
            </button>
          )}
        </div>
        <span className="cht-forum__sortLabel">
          <strong>{total}</strong> {total === 1 ? 'Diskussion' : 'Diskussionen'}
          {searchQuery && (
            <>
              {' '}
              zu <em>„{searchQuery}“</em>
            </>
          )}
        </span>
      </div>

      {loading ? (
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="cht-forum__skeleton" />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="cht-forum__empty">
          <div className="cht-forum__emptyIcon" aria-hidden="true">
            🌱
          </div>
          <p className="cht-forum__emptyTitle">Noch keine Diskussionen hier</p>
          <p className="cht-forum__emptyText">
            Starte als erste Person ein Thema in <strong>{category.key}</strong>
            .
          </p>
          <Link to="/forum/new" className="cht-forum__cta">
            Erstes Thema starten
          </Link>
        </div>
      ) : (
        <>
          <ul className="cht-forum__threadList">
            {threads.map(t => (
              <ThreadCard key={t.documentId} thread={t} />
            ))}
          </ul>

          {totalPages > 1 && (
            <nav
              className="cht-forum__pager"
              aria-label="Forum-Seitennavigation"
            >
              <button
                type="button"
                className="cht-forum__pagerBtn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Vorherige Seite"
              >
                ‹ Zurück
              </button>
              {pageNumbers.map((p, i) =>
                p === '…' ? (
                  <span
                    key={`gap-${i}`}
                    className="cht-forum__pagerBtn"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={`cht-forum__pagerBtn${
                      p === page ? ' cht-forum__pagerBtn--active' : ''
                    }`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                type="button"
                className="cht-forum__pagerBtn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Nächste Seite"
              >
                Weiter ›
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ForumCategory;
