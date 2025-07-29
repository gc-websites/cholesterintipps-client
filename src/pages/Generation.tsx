import { useState } from 'react';

const Generation = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<React.ReactNode>(null);

  const toRichTextBlocks = (texts: string[] | undefined) => {
    if (!texts || !Array.isArray(texts)) return [];
    return texts.map(t => ({
      type: 'paragraph',
      children: [
        { type: 'text', text: typeof t === 'string' ? t : JSON.stringify(t) },
      ],
    }));
  };

  const generateImageAndUpload = async (prompt: string) => {
    const res = await fetch(
      'https://dev.nice-advice.info/api/generate-sora-image',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      },
    );
    const data = await res.json();
    if (!data.imageId) throw new Error('Image not generated');
    return data.imageId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 3) return;

    try {
      setStatus(
        <span className="flex items-center gap-2">
          🛠 Generating article...
          <span className="inline-flex ml-2">
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-main3 border-solid"></span>
          </span>
        </span>,
      );
      const articleRes = await fetch(
        'https://dev.nice-advice.info/api/generate-article',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        },
      );
      const { article } = await articleRes.json();

      article.description = toRichTextBlocks(article.description);
      article.paragraphs = article.paragraphs.map((p: any) => ({
        ...p,
        description: toRichTextBlocks(p.description),
      }));

      setStatus(
        <span className="flex items-center gap-2">
          🖼 Uploading images (main)...
          <span className="inline-flex ml-2">
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-main3 border-solid"></span>
          </span>
        </span>,
      );

      article.image = await generateImageAndUpload(article.image_prompt);
      delete article.image_prompt;

      setStatus(
        <span className="flex items-center gap-2">
          🖼 Uploading images (paragraphs)...
          <span className="inline-flex ml-2">
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-main3 border-solid"></span>
          </span>
        </span>,
      );
      for (let i = 0; i < article.paragraphs.length; ++i) {
        const image = await generateImageAndUpload(
          article.paragraphs[i].image_prompt,
        );
        article.paragraphs[i].image = image;
        delete article.paragraphs[i].image_prompt;
      }

      setStatus(
        <span className="flex items-center gap-2">
          🖼 Uploading images (banners)...
          <span className="inline-flex ml-2">
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-main3 border-solid"></span>
          </span>
        </span>,
      );
      article.firstAdBanner.image = await generateImageAndUpload(
        article.firstAdBanner.image_prompt,
      );
      delete article.firstAdBanner.image_prompt;

      article.secondAdBanner.image = await generateImageAndUpload(
        article.secondAdBanner.image_prompt,
      );
      delete article.secondAdBanner.image_prompt;

      article.category = 1;
      article.author = 1;

      setStatus(
        <span className="flex items-center gap-2">
          ⬆️ Saving article to CMS...
          <span className="inline-flex ml-2">
            <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-main3 border-solid"></span>
          </span>
        </span>,
      );

      const saveRes = await fetch(
        'https://dev.nice-advice.info/api/create-post',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article }),
        },
      );
      if (!saveRes.ok) {
        const err = await saveRes.text();
        throw new Error(err);
      }

      setStatus('✅ Article created successfully!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error occurred — check console.');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 max-w-2xl w-full px-4">
        <h2 className="text-mainText dark:text-white md:text-4xl text-xl font-bold text-left">
          Enter a topic for your article
        </h2>
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center justify-center w-full rounded-lg overflow-hidden shadow-md"
        >
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setStatus(null);
            }}
            placeholder="Enter topic"
            className="text-base flex-grow px-4 py-4 text-gray-800 dark:text-white focus:outline-none bg-white dark:bg-additionalText"
          />
          <button
            type="submit"
            disabled={query.length < 3}
            className={`absolute right-2 px-3 py-2 rounded-lg bg-main2 text-white hover:bg-main3 transition-all duration-300 ${query.length < 3 ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            ➔
          </button>
        </form>
        {status && (
          <p className="text-sm text-gray-700 dark:text-white mt-2">{status}</p>
        )}
      </div>
    </div>
  );
};

export default Generation;
