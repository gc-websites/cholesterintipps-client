import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Identicon from './Identicon';
import { ThreadSummary, findCategoryByKey } from '../../services/forumAPI';
import { formatRelative, formatAbsolute } from './timeFormat';

interface ThreadCardProps {
  thread: ThreadSummary;
}

const truncate = (text: string | undefined, max: number): string => {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
};

const ThreadCard: FC<ThreadCardProps> = ({ thread }) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const cat = findCategoryByKey(thread.category);
  const activity = thread.lastActivityAt || thread.createdAt;
  const relative = formatRelative(activity, now);
  const absolute = formatAbsolute(activity);

  const activityMs = activity ? new Date(activity).getTime() : 0;
  const isHot = activityMs && now - activityMs < 60 * 60 * 1000;
  const isFresh = activityMs && now - activityMs < 24 * 60 * 60 * 1000;

  const href = thread.slug
    ? `/forum/t/${encodeURIComponent(thread.slug)}`
    : `/forum/t/${encodeURIComponent(thread.documentId)}`;

  return (
    <li
      className={`cht-forum__threadCard${
        thread.isPinned ? ' cht-forum__threadCard--pinned' : ''
      }`}
    >
      <Link
        to={href}
        className="cht-forum__cardStretchedLink"
        aria-label={thread.title}
        tabIndex={-1}
      />
      <Identicon
        name={thread.authorName}
        seed={thread.authorAvatarIdenticon || thread.authorName}
      />
      <div className="cht-forum__threadBody">
        <div className="cht-forum__threadMeta">
          <span className="cht-forum__threadAuthor">{thread.authorName}</span>
          {cat && (
            <>
              <span className="cht-forum__threadDot" aria-hidden="true">
                ·
              </span>
              <Link
                to={`/forum/c/${cat.slug}`}
                className="cht-forum__threadCat"
                onClick={e => e.stopPropagation()}
              >
                {cat.key}
              </Link>
            </>
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
          {isHot && !thread.isLocked && (
            <span
              className="cht-forum__badge cht-forum__badge--new"
              title="Aktiv in der letzten Stunde"
            >
              <span className="cht-forum__pulse" aria-hidden="true" /> Live
            </span>
          )}
          {!isHot && isFresh && !thread.isLocked && (
            <span
              className="cht-forum__badge cht-forum__badge--fresh"
              title="Aktiv am letzten Tag"
            >
              Neu
            </span>
          )}
        </div>
        <Link to={href} className="cht-forum__threadTitle">
          {thread.title}
        </Link>
        {thread.body && (
          <p className="cht-forum__threadExcerpt">
            {truncate(thread.body, 220)}
          </p>
        )}
        <div className="cht-forum__threadFooter">
          <span className="cht-forum__threadFooterItem">
            💬 <strong>{thread.commentCount ?? 0}</strong>{' '}
            {thread.commentCount === 1 ? 'Antwort' : 'Antworten'}
          </span>
          {typeof thread.viewCount === 'number' && thread.viewCount > 0 && (
            <span className="cht-forum__threadFooterItem">
              👁 {thread.viewCount}
            </span>
          )}
          {relative && (
            <span className="cht-forum__threadFooterItem">
              ⏱{' '}
              <time dateTime={activity} title={absolute}>
                {relative}
              </time>
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default ThreadCard;
