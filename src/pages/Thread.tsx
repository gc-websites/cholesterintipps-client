import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  findCategoryByKey,
  getComments,
  getThreadByDocumentId,
  getThreadBySlug,
  incrementThreadView,
  ThreadComment,
  ThreadSummary,
} from '../services/forumAPI';
import Identicon from '../components/forum/Identicon';
import CommentTree, { CommentSort } from '../components/forum/CommentTree';
import ReplyForm from '../components/forum/ReplyForm';
import Toast from '../components/forum/Toast';
import { linkify } from '../components/forum/linkify';
import { formatAbsolute, formatRelative } from '../components/forum/timeFormat';
import Loader from '../components/Loader';
import Page404 from './Page404';
import {
  buildCanonical,
  SITE_URL,
  stripHtml,
  useDocumentMeta,
  useStructuredData,
} from '../utils/seo';
import '../styles/forum.css';

const SORT_LABELS: Record<CommentSort, string> = {
  oldest: 'Älteste zuerst',
  newest: 'Neueste zuerst',
  likes: 'Beliebteste',
};

const estimateReadMinutes = (text: string | undefined): number => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
};

const Thread = () => {
  const { slug } = useParams<{ slug: string }>();
  const [thread, setThread] = useState<ThreadSummary | null>(null);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [replyTo, setReplyTo] = useState<ThreadComment | null>(null);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(() => Date.now());
  const [sort, setSort] = useState<CommentSort>('oldest');
  const [toast, setToast] = useState<string>('');
  const viewedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const seoTitle = thread?.title || 'Forum-Thema';
  const seoDescription = thread
    ? stripHtml(thread.body || '', 160) || `Diskussion: ${thread.title}`
    : 'Forum-Thema';

  useDocumentMeta({
    title: seoTitle,
    description: seoDescription,
    canonical: buildCanonical(
      thread?.slug
        ? `/forum/t/${thread.slug}`
        : thread
          ? `/forum/t/${thread.documentId}`
          : '/forum',
    ),
    type: 'article',
    noindex: notFound,
  });

  const jsonLd = useMemo(
    () =>
      thread
        ? {
            '@context': 'https://schema.org',
            '@type': 'DiscussionForumPosting',
            headline: thread.title,
            articleBody: thread.body,
            datePublished: thread.createdAt,
            dateModified: thread.updatedAt || thread.createdAt,
            inLanguage: 'de-DE',
            author: { '@type': 'Person', name: thread.authorName },
            interactionStatistic: {
              '@type': 'InteractionCounter',
              interactionType: 'https://schema.org/CommentAction',
              userInteractionCount: thread.commentCount ?? comments.length,
            },
            url: `${SITE_URL}/forum/t/${thread.slug || thread.documentId}`,
          }
        : null,
    [thread, comments.length],
  );
  useStructuredData(jsonLd, 'forum-thread');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        let t = await getThreadBySlug(slug);
        if (!t) {
          t = await getThreadByDocumentId(slug);
        }
        if (cancelled) return;
        if (!t) {
          setNotFound(true);
          return;
        }
        setThread(t);

        if (!viewedRef.current) {
          viewedRef.current = true;
          incrementThreadView(t.documentId, t.viewCount ?? 0);
        }

        const cRes = await getComments(t.documentId);
        if (cancelled) return;
        setComments(cRes.data || []);
      } catch (err) {
        console.error('Thread load error', err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const cat = useMemo(
    () => (thread ? findCategoryByKey(thread.category) : null),
    [thread],
  );

  const handleReplyTo = useCallback((c: ThreadComment) => {
    setReplyTo(c);
  }, []);

  const handleSubmitted = useCallback(
    (newComment: ThreadComment) => {
      setComments(prev => [...prev, newComment]);
      setFreshIds(prev => {
        const next = new Set(prev);
        next.add(newComment.documentId);
        return next;
      });
      setReplyTo(null);
      if (thread) {
        setThread({
          ...thread,
          commentCount: (thread.commentCount ?? 0) + 1,
        });
      }
    },
    [thread],
  );

  const handleCopyLink = useCallback((commentId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#comment-${commentId}`;
    try {
      window.history.replaceState(null, '', `#comment-${commentId}`);
    } catch {
      /* ignore */
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => setToast('Link kopiert'))
        .catch(() => setToast('Konnte nicht kopieren — URL lange drücken'));
    } else {
      setToast('Link kopiert');
    }
  }, []);

  const handleCopyThreadLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => setToast('Link kopiert'))
        .catch(() => setToast('Konnte nicht kopieren'));
    } else {
      setToast('Link kopiert');
    }
  }, []);

  const uniqueParticipants = useMemo(() => {
    if (!thread) return 0;
    const set = new Set<string>();
    set.add(thread.authorName?.trim().toLowerCase() || '');
    comments.forEach(c => set.add(c.authorName?.trim().toLowerCase() || ''));
    set.delete('');
    return set.size;
  }, [comments, thread]);

  const readTime = useMemo(
    () => estimateReadMinutes(thread?.body),
    [thread?.body],
  );

  if (loading && !thread) return <Loader />;
  if (notFound || !thread) return <Page404 />;

  const activity = thread.lastActivityAt || thread.createdAt;

  return (
    <div className="cht-forum container">
      <nav aria-label="Brotkrumen" className="cht-forum__crumbs">
        <Link to="/">Startseite</Link>
        <span className="cht-forum__crumbSep" aria-hidden="true">
          /
        </span>
        <Link to="/forum">Forum</Link>
        {cat && (
          <>
            <span className="cht-forum__crumbSep" aria-hidden="true">
              /
            </span>
            <Link to={`/forum/c/${cat.slug}`}>{cat.key}</Link>
          </>
        )}
        <span className="cht-forum__crumbSep" aria-hidden="true">
          /
        </span>
        <span>{thread.title}</span>
      </nav>

      <article className="cht-forum__op">
        <header className="cht-forum__opHeader">
          <Identicon
            name={thread.authorName}
            seed={thread.authorAvatarIdenticon || thread.authorName}
            size={56}
          />
          <div className="cht-forum__opMeta">
            <div className="cht-forum__opAuthor">
              <strong>{thread.authorName}</strong>
              {cat && (
                <Link
                  to={`/forum/c/${cat.slug}`}
                  className="cht-forum__threadCat"
                >
                  {cat.key}
                </Link>
              )}
              {thread.isPinned && (
                <span className="cht-forum__badge cht-forum__badge--pinned">
                  📌 Angeheftet
                </span>
              )}
              {thread.isLocked && (
                <span className="cht-forum__badge cht-forum__badge--locked">
                  🔒 Geschlossen
                </span>
              )}
            </div>
            <div className="cht-forum__opSub">
              <time
                dateTime={thread.createdAt}
                title={formatAbsolute(thread.createdAt)}
              >
                {formatRelative(thread.createdAt, now) ||
                  formatAbsolute(thread.createdAt)}
              </time>
              {' · '}
              <span>
                💬 {comments.length}{' '}
                {comments.length === 1 ? 'Antwort' : 'Antworten'}
              </span>
              {uniqueParticipants > 1 && (
                <>
                  {' · '}
                  <span>
                    👥 {uniqueParticipants} Teilnehmer in dieser Diskussion
                  </span>
                </>
              )}
              {typeof thread.viewCount === 'number' && thread.viewCount > 0 && (
                <>
                  {' · '}
                  <span>👁 {thread.viewCount} Aufrufe</span>
                </>
              )}
              {readTime > 1 && (
                <>
                  {' · '}
                  <span>📖 {readTime} Min. Lesezeit</span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyThreadLink}
            className="cht-forum__shareBtn"
            aria-label="Link zu dieser Diskussion kopieren"
            title="Link kopieren"
          >
            🔗 Teilen
          </button>
        </header>

        <h1 className="cht-forum__opTitle">{thread.title}</h1>
        {thread.body && (
          <div className="cht-forum__opBody">{linkify(thread.body)}</div>
        )}
        {activity && activity !== thread.createdAt && (
          <p className="cht-forum__opSub" style={{ marginTop: 14 }}>
            Letzte Aktivität {formatRelative(activity, now)}
          </p>
        )}
      </article>

      <div className="cht-forum__sortBar" style={{ marginBottom: 12 }}>
        <h2
          className="cht-forum__sectionTitle"
          style={{ margin: 0, fontSize: '1.1rem' }}
        >
          Antworten ({comments.length})
        </h2>
        {comments.length > 1 && (
          <div
            className="cht-forum__sortTabs"
            role="tablist"
            aria-label="Antworten sortieren"
          >
            {(Object.keys(SORT_LABELS) as CommentSort[]).map(s => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={sort === s}
                className={`cht-forum__sortTab${
                  sort === s ? ' cht-forum__sortTab--active' : ''
                }`}
                onClick={() => setSort(s)}
              >
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </div>

      <CommentTree
        comments={comments}
        freshIds={freshIds}
        onReplyTo={handleReplyTo}
        isLocked={thread.isLocked}
        opAuthorName={thread.authorName}
        sort={sort}
        onCopyLink={handleCopyLink}
      />

      {thread.isLocked ? (
        <div className="cht-forum__locked">
          🔒 Diese Diskussion ist geschlossen. Neue Antworten sind deaktiviert.
        </div>
      ) : (
        <ReplyForm
          threadDocumentId={thread.documentId}
          parentComment={replyTo}
          onCancelReplyTo={() => setReplyTo(null)}
          onSubmitted={handleSubmitted}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
};

export default Thread;
