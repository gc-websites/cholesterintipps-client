import { FC, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface EmailFormProps {
  handleFormClose: () => void;
}

const MAX_NAME = 60;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 2000;
const MIN_MESSAGE = 10;

const EmailForm: FC<EmailFormProps> = ({ handleFormClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  // Body scroll lock + Esc-to-close + focus first input
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleFormClose();
    };
    document.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => nameRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
    };
  }, [handleFormClose]);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  const canSubmit =
    !submitting &&
    trimmedName.length >= 2 &&
    trimmedName.length <= MAX_NAME &&
    emailValid &&
    trimmedMessage.length >= MIN_MESSAGE &&
    trimmedMessage.length <= MAX_MESSAGE;

  const charsLeft = MAX_MESSAGE - message.length;
  const counterCls = useMemo(() => {
    if (charsLeft < 0) return 'text-red-600 dark:text-red-400';
    if (charsLeft < 100) return 'text-amber-600 dark:text-amber-400';
    return 'text-additionalText dark:text-white/60';
  }, [charsLeft]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    // Open mail client as a graceful no-backend fallback
    try {
      const body = encodeURIComponent(
        `Name: ${trimmedName}\nE-Mail: ${trimmedEmail}\n\n${trimmedMessage}`,
      );
      const subject = encodeURIComponent(
        `Nachricht von ${trimmedName} via cholesterintipps.de`,
      );
      window.location.href = `mailto:kontakt@cholesterintipps.de?subject=${subject}&body=${body}`;
    } catch {
      /* ignore */
    }
    // Show success state after a brief simulated send
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleFormClose();
  };

  const modalRoot =
    typeof document !== 'undefined' ? document.querySelector('#modal') : null;

  const content = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-cht-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cht-contact-title"
      onClick={onBackdropClick}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-mainText shadow-2xl overflow-hidden animate-cht-pop max-h-[90vh] flex flex-col">
        {/* Brand header */}
        <div className="relative bg-gradient-to-br from-main3 via-main2 to-main p-5 sm:p-6 text-white">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-4 relative">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-white/20 inline-block px-2 py-0.5 rounded-full mb-2">
                Kontakt
              </p>
              <h2
                id="cht-contact-title"
                className="font-merriweather text-xl sm:text-2xl font-bold leading-tight"
              >
                Schreiben Sie uns
              </h2>
              <p className="text-white/85 text-sm mt-1">
                Wir antworten meist innerhalb von 1–2 Werktagen.
              </p>
            </div>
            <button
              type="button"
              onClick={handleFormClose}
              aria-label="Formular schließen"
              className="shrink-0 -mr-1 -mt-1 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-main/15 text-main3 dark:text-main flex items-center justify-center text-3xl mb-4">
                ✓
              </div>
              <h3 className="font-merriweather font-bold text-xl mb-2 text-mainText dark:text-white">
                Vielen Dank!
              </h3>
              <p className="text-additionalText dark:text-white/70 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                Ihre Nachricht wurde im E-Mail-Programm vorbereitet. Bitte
                schicken Sie sie dort ab — wir melden uns zeitnah zurück.
              </p>
              <button
                type="button"
                onClick={handleFormClose}
                className="inline-flex items-center gap-2 bg-main3 hover:bg-main2 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md"
              >
                Schließen
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <div>
                <label
                  htmlFor="cht-contact-name"
                  className="block text-xs font-bold uppercase tracking-wider text-additionalText dark:text-white/60 mb-1.5"
                >
                  Ihr Name
                </label>
                <input
                  id="cht-contact-name"
                  ref={nameRef}
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-mainText/15 dark:border-white/15 bg-light dark:bg-mainText/60 text-mainText dark:text-white placeholder:text-additionalText/70 focus:outline-none focus:border-main3 focus:ring-2 focus:ring-main/30 transition"
                  placeholder="Wie heißen Sie?"
                  value={name}
                  maxLength={MAX_NAME}
                  onChange={e => setName(e.target.value)}
                  disabled={submitting}
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="cht-contact-email"
                  className="block text-xs font-bold uppercase tracking-wider text-additionalText dark:text-white/60 mb-1.5"
                >
                  E-Mail-Adresse
                </label>
                <input
                  id="cht-contact-email"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-mainText/15 dark:border-white/15 bg-light dark:bg-mainText/60 text-mainText dark:text-white placeholder:text-additionalText/70 focus:outline-none focus:border-main3 focus:ring-2 focus:ring-main/30 transition"
                  placeholder="name@beispiel.de"
                  value={email}
                  maxLength={MAX_EMAIL}
                  onChange={e => setEmail(e.target.value)}
                  disabled={submitting}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="cht-contact-message"
                  className="block text-xs font-bold uppercase tracking-wider text-additionalText dark:text-white/60 mb-1.5"
                >
                  Ihre Nachricht
                </label>
                <textarea
                  id="cht-contact-message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-mainText/15 dark:border-white/15 bg-light dark:bg-mainText/60 text-mainText dark:text-white placeholder:text-additionalText/70 focus:outline-none focus:border-main3 focus:ring-2 focus:ring-main/30 transition resize-none"
                  placeholder="Worum geht es? Frage, Anregung, Hinweis…"
                  value={message}
                  maxLength={MAX_MESSAGE + 50}
                  onChange={e => setMessage(e.target.value)}
                  disabled={submitting}
                  required
                />
                <p className={`text-xs mt-1 text-right ${counterCls}`}>
                  {Math.max(charsLeft, 0)} Zeichen übrig
                </p>
              </div>

              <p className="text-xs text-additionalText dark:text-white/60 leading-relaxed">
                Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur
                Bearbeitung Ihrer Anfrage zu. Details:{' '}
                <a
                  href="/privacy"
                  className="underline text-main3 dark:text-main"
                >
                  Datenschutzerklärung
                </a>
                .
              </p>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-1">
                <button
                  type="button"
                  onClick={handleFormClose}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-mainText/20 dark:border-white/20 text-mainText dark:text-white hover:bg-light dark:hover:bg-white/10 font-semibold transition"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-main3 to-main2 hover:from-main2 hover:to-main text-white font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Wird gesendet…
                    </>
                  ) : (
                    <>📨 Nachricht senden</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (!modalRoot) return content;
  return createPortal(content, modalRoot as HTMLElement);
};

export default EmailForm;
