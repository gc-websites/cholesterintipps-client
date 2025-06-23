import { useState } from 'react';

const STRAPI_API_URL = 'https://vivid-triumph-4386b82e17.strapiapp.com';
const STRAPI_TOKEN =
  'Bearer e978fa4adf9de867ba4e4995ea700b6c6a57a89292646fb190ff48d45e02b136dba85b0924b3e5648a5b7dcfcd6fbc671c0a141093752ae2d92beb420e0e9ef20dce76ea8185baf29592f0760cb2296e17c2c2f472907268b8b1a299c6a48bec94eb7ad62a6fd68992975babf3f81c14ee32efe761fc2400a27e847c49371ef5';
const OPENAI_API_KEY =
  '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';

// const STRAPI_API_URL = 'http://localhost:1337';
// const STRAPI_TOKEN =
//   'Bearer 25ae49558cdd2899ce446ec68a8b44cbb22a580c7542627eb20003b024ee81fda97a4e1225aa7ffdf472329a4e30b59d9f304553b51f1dcfee36eee0a8180239f790cbe91c6b9f9ffce2b233ea9e80eb8df1d9315717e446393b40d65bbed275e39131e66bb5fac15c8a7face9c1baff5adbf7080ae6624eff6ecdb8538179c8';
// const OPENAI_API_KEY =
//   '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';

const Generation = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const toRichTextBlocks = texts => {
    if (!texts || !Array.isArray(texts)) return [];
    return texts.map(t => {
      let textValue = t;
      if (typeof t === 'string') {
        try {
          const parsed = JSON.parse(t);
          if (parsed && typeof parsed === 'object' && 'content' in parsed) {
            textValue = parsed.content;
          } else {
            textValue = t;
          }
        } catch {
          textValue = t;
        }
      }
      return {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: textValue,
          },
        ],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 3) return;

    try {
      setStatus('🛠 Generating article content...');

      const chatRes = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: `You are a CMS content generator. Return ONLY a valid raw JSON object — no markdown, no explanations, no comments. Create an article in JSON format based on the topic: "${query}". The article should match this structure:
{
  "title": "...",
  "description": ["... (min 700 characters)"],
  "isPopular": false,
  "paragraphs": [
    {
      "subtitle": "...",
      "description": ["... (min 700 characters)"],
      "ads": [
        { "title": "...", "url": "https://..." },
        { "title": "...", "url": "https://..." }
      ],
      "image_prompt": "prompt for image generation"
    }
  ],
  "ads": [
    { "title": "...", "url": "https://..." },
    { "title": "...", "url": "https://..." },
    { "title": "...", "url": "https://..." }
  ],
  "image_prompt": "main image prompt",
  "firstAdBanner": { "url": "https://...", "image_prompt": "..." },
  "secondAdBanner": { "url": "https://...", "image_prompt": "..." }
}`,
              },
              { role: 'user', content: query },
            ],
            temperature: 0.7,
          }),
        },
      );

      const chatData = await chatRes.json();
      const article = JSON.parse(chatData.choices[0].message.content);

      article.description = toRichTextBlocks(article.description);
      article.paragraphs = article.paragraphs.map(p => ({
        ...p,
        description: toRichTextBlocks(p.description),
      }));

      setStatus('🖼 Generating and uploading images...');

      const uploadImageFromUrl = async (imageUrl: string) => {
        const res = await fetch(`${STRAPI_API_URL}/api/upload-from-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: STRAPI_TOKEN,
          },
          body: JSON.stringify({ imageUrl }),
        });
        const data = await res.json();
        return data[0]?.id;
      };

      const generateImageAndUpload = async (prompt: string) => {
        const imageGenRes = await fetch(
          'https://api.openai.com/v1/images/generations',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt,
              n: 1,
              size: '1024x1024',
            }),
          },
        );
        const imageGenData = await imageGenRes.json();
        const imageUrl = imageGenData.data[0].url;
        return await uploadImageFromUrl(imageUrl);
      };

      article.image = await generateImageAndUpload(article.image_prompt);
      delete article.image_prompt;

      for (const p of article.paragraphs) {
        p.image = await generateImageAndUpload(p.image_prompt);
        delete p.image_prompt;
      }

      for (const key of ['firstAdBanner', 'secondAdBanner']) {
        article[key].image = await generateImageAndUpload(
          article[key].image_prompt,
        );
        delete article[key].image_prompt;
      }

      article.category = 1;
      article.author = 1;

      setStatus('⬆️ Uploading to Strapi...');
      const res = await fetch(`${STRAPI_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: STRAPI_TOKEN,
        },
        body: JSON.stringify({ data: article }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Strapi error:', errorText);
        throw new Error('Failed to upload article');
      }

      setStatus('✅ Article created successfully!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error: Check console for details.');
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
            className="text-base flex-grow px-4 py-4 text-gray-800 focus:outline-none bg-white dark:bg-additionalText"
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
