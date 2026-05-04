import { useDocumentMeta } from '../utils/seo';

const Page404 = () => {
  useDocumentMeta({
    title: 'Seite nicht gefunden',
    description: 'Diese Seite konnte leider nicht gefunden werden.',
    noindex: true,
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-mainText px-4 text-center">
      <h1 className="text-8xl font-bold text-main">404</h1>
      <p className="mt-4 text-2xl text-additionalText dark:text-white">
        Diese Seite konnte leider nicht gefunden werden.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-main text-white rounded-md hover:bg-main3 transition-colors"
      >
        Zur Startseite
      </a>
    </div>
  );
};

export default Page404;
