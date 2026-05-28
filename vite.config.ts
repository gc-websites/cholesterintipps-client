import { defineConfig } from 'vite';
import Sitemap from 'vite-plugin-sitemap';
import react from '@vitejs/plugin-react';

const STRAPI_BASE = 'https://vivid-triumph-4386b82e17.strapiapp.com/api';
const HOSTNAME = 'https://cholesterintipps.de';

// Mirror of FORUM_CATEGORIES.slug in src/services/forumAPI.ts — kept in sync
// manually because vite.config.ts runs before app code is loaded.
const FORUM_CATEGORY_SLUGS = [
  'ernaehrung',
  'bewegung',
  'werte',
  'medikamente',
  'natuerliche-hilfe',
  'erfahrungen',
];

interface StrapiListResponse {
  data?: Array<{ documentId?: string; slug?: string | null }>;
  meta?: { pagination?: { pageCount?: number } };
}

const fetchAllDocumentIds = async (
  resource: string,
  pathPrefix: string,
): Promise<string[]> => {
  const ids: string[] = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const url = `${STRAPI_BASE}/${resource}?fields[0]=documentId&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const json = (await res.json()) as StrapiListResponse;
      const data = json.data ?? [];
      for (const item of data) {
        if (item.documentId) ids.push(`${pathPrefix}/${item.documentId}`);
      }
      const pageCount = json.meta?.pagination?.pageCount ?? 1;
      if (page >= pageCount) break;
      page += 1;
    } catch (err) {
      console.warn(
        `[sitemap] could not fetch ${resource}: ${(err as Error).message}`,
      );
      break;
    }
  }
  return ids;
};

// Forum threads for site=cholesterin with a valid category — prefer slug, fall
// back to documentId (the Thread page resolves both).
const fetchForumThreadPaths = async (): Promise<string[]> => {
  const paths: string[] = [];
  let page = 1;
  const pageSize = 100;
  const baseQuery =
    '&filters[site][$eq]=cholesterin' +
    '&filters[category][$notNull]=true' +
    '&fields[0]=documentId&fields[1]=slug';
  while (true) {
    const url =
      `${STRAPI_BASE}/discussion-threads?pagination[page]=${page}&pagination[pageSize]=${pageSize}` +
      baseQuery;
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const json = (await res.json()) as StrapiListResponse;
      const data = json.data ?? [];
      for (const item of data) {
        const handle = item.slug || item.documentId;
        if (handle) paths.push(`/forum/t/${encodeURIComponent(handle)}`);
      }
      const pageCount = json.meta?.pagination?.pageCount ?? 1;
      if (page >= pageCount) break;
      page += 1;
    } catch (err) {
      console.warn(
        `[sitemap] could not fetch discussion-threads: ${(err as Error).message}`,
      );
      break;
    }
  }
  return paths;
};

const buildDynamicRoutes = async (): Promise<string[]> => {
  const [posts, categories, authors, forumThreads] = await Promise.all([
    fetchAllDocumentIds('post2s', '/post'),
    fetchAllDocumentIds('category2s', '/category'),
    fetchAllDocumentIds('author2s', '/author'),
    fetchForumThreadPaths(),
  ]);

  const forumCategoryRoutes = FORUM_CATEGORY_SLUGS.map(s => `/forum/c/${s}`);

  // SEO-relevant static pages — vite-plugin-sitemap only sees what we list.
  const staticRoutes = [
    '/forum',
    '/about',
    '/ueber-uns',
    '/impressum',
    '/rechner',
    '/privacy',
    '/terms',
  ];

  const all = [
    ...staticRoutes,
    ...forumCategoryRoutes,
    ...posts,
    ...categories,
    ...authors,
    ...forumThreads,
  ];
  return Array.from(new Set(all));
};

export default defineConfig(async () => {
  const dynamicRoutes = await buildDynamicRoutes();
  console.log(`[sitemap] ${dynamicRoutes.length} dynamic routes resolved`);

  return {
    plugins: [
      react(),
      Sitemap({
        hostname: HOSTNAME,
        dynamicRoutes,
        exclude: [
          '/generation',
          '/generation/product',
          '/search',
          '/forum/new',
        ],
        generateRobotsTxt: false,
      }),
    ],
  };
});
