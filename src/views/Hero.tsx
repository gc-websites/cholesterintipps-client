import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPopularPosts } from '../services/postsAPI';

import Loader from '../components/Loader';
import Page404 from '../pages/Page404';
import RenderDescription from '../components/RenderDescription';

const DATE_FORMATTER = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const shortCategory = (name?: string): string | undefined => {
  if (!name) return undefined;
  const cleaned = name.replace(/\s+zum Thema Cholesterin$/i, '').trim();
  return cleaned.length > 32 ? `${cleaned.slice(0, 29)}…` : cleaned;
};

interface PostLike {
  documentId: string;
  title: string;
  description: unknown;
  createdAt: string;
  image: { url: string };
  author_2: { documentId: string; name: string; avatar: { url: string } };
  category_2?: { documentId: string; name: string };
}

const Hero = () => {
  const [popularPosts, setPopularPosts] = useState<PostLike[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getPopularPosts();
        setPopularPosts(data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Loader />;
  if (popularPosts.length === 0) return <Page404 />;

  const featured = popularPosts[0];
  const rest = popularPosts.slice(1, 5); // up to 4

  return (
    <section className="container section__padding pt-6 md:pt-10">
      <h1 className="sr-only">
        CholesterinTipps – aktuelle Artikel zu Cholesterin, Ernährung und
        Gesundheit
      </h1>

      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
        <div>
          <span className="inline-block text-[11px] font-semibold tracking-wider uppercase bg-main/15 text-main3 dark:text-main px-3 py-1 rounded-full mb-3">
            Aktuelle Highlights
          </span>
          <h2 className="font-merriweather text-2xl md:text-3xl font-bold text-mainText dark:text-white leading-tight m-0">
            Empfehlungen unserer Redaktion
          </h2>
        </div>
        <Link
          to="/search"
          className="hidden sm:inline-flex items-center gap-2 text-main3 dark:text-main font-semibold hover:gap-3 transition-all shrink-0"
        >
          Alle Artikel
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* ── Featured (full width, horizontal: image LEFT, text RIGHT) ── */}
      <Link
        to={`/post/${featured.documentId}`}
        className="group relative grid md:grid-cols-[1fr_1fr] overflow-hidden rounded-2xl bg-white dark:bg-mainText/40 border border-mainText/10 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-main3/40 dark:hover:border-main/50 transition-all duration-300 mb-5 md:mb-6"
      >
        <div className="relative w-full aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden bg-light dark:bg-mainText">
          <img
            src={featured.image.url}
            alt={featured.title}
            loading="eager"
            className="block w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-500"
          />
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-gradient-to-br from-main3 to-main2 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
            ⭐ Empfohlen
          </span>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:p-8 md:p-10 justify-center">
          {shortCategory(featured.category_2?.name) && (
            <p className="text-xs font-bold uppercase tracking-wider text-main3 dark:text-main">
              {shortCategory(featured.category_2?.name)}
            </p>
          )}

          <h3 className="font-merriweather text-2xl sm:text-3xl md:text-[2rem] md:leading-[1.2] font-bold text-mainText dark:text-white group-hover:text-main3 dark:group-hover:text-main transition-colors line-clamp-3 m-0">
            {featured.title}
          </h3>

          <RenderDescription
            description={featured.description}
            className="section__description text-base !leading-relaxed line-clamp-4 md:line-clamp-5"
            truncate={true}
          />

          <div className="mt-2 flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-mainText/10 dark:border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={featured.author_2.avatar.url}
                alt={featured.author_2.name}
                className="rounded-full w-10 h-10 object-cover ring-2 ring-white dark:ring-mainText/40 shadow-sm shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-mainText dark:text-white truncate">
                  {featured.author_2.name}
                </p>
                <p className="text-xs text-additionalText dark:text-white/60">
                  {DATE_FORMATTER.format(new Date(featured.createdAt))}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-main3 dark:text-main font-bold text-sm group-hover:gap-3 transition-all">
              Weiterlesen
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>

      {/* ── 4 small cards in a row ──────────────────────────── */}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {rest.map(post => (
            <Link
              key={post.documentId}
              to={`/post/${post.documentId}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-mainText/40 border border-mainText/10 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-main3/40 dark:hover:border-main/50 transition-all duration-300"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-light dark:bg-mainText shrink-0">
                <img
                  src={post.image.url}
                  alt={post.title}
                  loading="lazy"
                  className="block w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col gap-2 p-4 flex-1">
                {shortCategory(post.category_2?.name) && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-main3 dark:text-main">
                    {shortCategory(post.category_2?.name)}
                  </p>
                )}
                <h4 className="font-merriweather text-sm sm:text-base font-bold text-mainText dark:text-white leading-snug group-hover:text-main3 dark:group-hover:text-main transition-colors line-clamp-3 m-0">
                  {post.title}
                </h4>
                <p className="mt-auto pt-2 text-[11px] text-additionalText dark:text-white/60 border-t border-mainText/10 dark:border-white/10">
                  <span className="block pt-2 truncate">
                    {post.author_2.name}
                    <span aria-hidden="true" className="opacity-50 mx-1">
                      ·
                    </span>
                    {DATE_FORMATTER.format(new Date(post.createdAt))}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Mobile "Alle Artikel" link */}
      <div className="sm:hidden mt-6 text-center">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-main3 dark:text-main font-semibold"
        >
          Alle Artikel
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
