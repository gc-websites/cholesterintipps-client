import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FORUM_CATEGORIES,
  postThread,
  findCategoryBySlug,
} from '../services/forumAPI';
import Identicon from '../components/forum/Identicon';
import { buildCanonical, useDocumentMeta } from '../utils/seo';
import '../styles/forum.css';

const STORAGE_KEY = 'cht_forum_name';
const MAX_NAME = 50;
const MIN_NAME = 2;
const MAX_TITLE = 200;
const MIN_TITLE = 5;
const MAX_BODY = 5000;
const MIN_BODY = 10;

const NewThread = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const prefilledCat = params.get('category');

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState(() => {
    if (prefilledCat) {
      const found = findCategoryBySlug(prefilledCat);
      if (found) return found.key;
    }
    return FORUM_CATEGORIES[0].key;
  });
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const t0Ref = useRef<number>(Date.now());

  useDocumentMeta({
    title: 'Neue Diskussion starten — Forum',
    description:
      'Starte ein neues Thema im CholesterinTipps Community-Forum. Kein Konto nötig.',
    canonical: buildCanonical('/forum/new'),
    noindex: true,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setName(saved);
    } catch {
      /* ignore */
    }
    t0Ref.current = Date.now();
  }, []);

  const trimmedName = name.trim();
  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();

  const canSubmit =
    !submitting &&
    trimmedName.length >= MIN_NAME &&
    trimmedName.length <= MAX_NAME &&
    trimmedTitle.length >= MIN_TITLE &&
    trimmedTitle.length <= MAX_TITLE &&
    trimmedBody.length >= MIN_BODY &&
    trimmedBody.length <= MAX_BODY;

  const titleCharsLeft = MAX_TITLE - title.length;
  const bodyCharsLeft = MAX_BODY - body.length;

  const titleCounterCls = useMemo(() => {
    if (titleCharsLeft < 0) return 'cht-forum__counter cht-forum__counter--bad';
    if (titleCharsLeft < 20)
      return 'cht-forum__counter cht-forum__counter--warn';
    return 'cht-forum__counter';
  }, [titleCharsLeft]);

  const bodyCounterCls = useMemo(() => {
    if (bodyCharsLeft < 0) return 'cht-forum__counter cht-forum__counter--bad';
    if (bodyCharsLeft < 100)
      return 'cht-forum__counter cht-forum__counter--warn';
    return 'cht-forum__counter';
  }, [bodyCharsLeft]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) form.requestSubmit();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await postThread({
        category,
        title: trimmedTitle,
        body: trimmedBody,
        authorName: trimmedName,
        website,
        t0: t0Ref.current,
      });
      try {
        localStorage.setItem(STORAGE_KEY, trimmedName);
      } catch {
        /* ignore */
      }
      const dest = res.slug
        ? `/forum/t/${encodeURIComponent(res.slug)}`
        : `/forum/t/${encodeURIComponent(res.documentId)}`;
      navigate(dest);
    } catch (err) {
      const e = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        'Diskussion konnte nicht erstellt werden. Bitte versuche es erneut.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
        <span>Neue Diskussion</span>
      </nav>

      <header className="cht-forum__hero" style={{ marginBottom: 20 }}>
        <p className="cht-forum__heroEyebrow">Neues Thema</p>
        <h1 className="cht-forum__heroTitle">Diskussion starten</h1>
        <p className="cht-forum__heroLead">
          Teile etwas, das dich beschäftigt — eine Frage, einen Tipp oder deine
          Erfahrung. Bleib freundlich und beim Thema. Kein Konto nötig; wir
          merken uns deinen Namen auf diesem Gerät.
        </p>
      </header>

      <form
        className="cht-forum__form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Neue Diskussion starten"
      >
        <div className="cht-forum__formFields">
          <div>
            <label className="cht-forum__label" htmlFor="thread-category">
              Kategorie
            </label>
            <select
              id="thread-category"
              className="cht-forum__select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              disabled={submitting}
            >
              {FORUM_CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>
                  {c.emoji} {c.key}
                </option>
              ))}
            </select>
          </div>

          <div className="cht-forum__formRow">
            <Identicon name={trimmedName || '?'} />
            <div className="cht-forum__formInputs">
              <div>
                <label className="cht-forum__label" htmlFor="thread-name">
                  Dein Name
                </label>
                <input
                  id="thread-name"
                  className="cht-forum__input"
                  type="text"
                  placeholder="Wie sollen wir dich nennen?"
                  value={name}
                  maxLength={MAX_NAME}
                  onChange={e => setName(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="cht-forum__label" htmlFor="thread-title">
                  Titel
                </label>
                <input
                  id="thread-title"
                  className="cht-forum__input"
                  type="text"
                  placeholder="Konkret und einladend — wie eine echte Frage…"
                  value={title}
                  maxLength={MAX_TITLE + 20}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={submitting}
                />
                <div style={{ textAlign: 'right', marginTop: 4 }}>
                  <span className={titleCounterCls}>
                    {Math.max(titleCharsLeft, 0)} Zeichen übrig
                  </span>
                </div>
              </div>

              <div>
                <label className="cht-forum__label" htmlFor="thread-body">
                  Deine Nachricht
                </label>
                <textarea
                  id="thread-body"
                  className="cht-forum__textarea"
                  placeholder="Schildere Details, stell Fragen oder erzähle, was du bereits versucht hast…"
                  value={body}
                  rows={8}
                  maxLength={MAX_BODY + 100}
                  onChange={e => setBody(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={submitting}
                />
                <div style={{ textAlign: 'right', marginTop: 4 }}>
                  <span className={bodyCounterCls}>
                    {Math.max(bodyCharsLeft, 0)} Zeichen übrig
                  </span>
                </div>
              </div>

              <input
                className="cht-forum__honeypot"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                name="website"
                aria-hidden="true"
              />

              <div className="cht-forum__formFooter">
                <span
                  style={{ fontSize: '0.82rem', color: 'var(--cht-muted)' }}
                >
                  Mit dem Veröffentlichen stimmst du unseren Community-Regeln
                  zu: freundlich bleiben, beim Thema bleiben, kein Spam.
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to="/forum" className="cht-forum__cancel">
                    Abbrechen
                  </Link>
                  <button
                    type="submit"
                    className="cht-forum__submit"
                    disabled={!canSubmit}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="cht-forum__spinner"
                          aria-hidden="true"
                        />
                        Wird gesendet…
                      </>
                    ) : (
                      <>✨ Diskussion starten</>
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p className="cht-forum__error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewThread;
