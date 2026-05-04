import { defineConfig } from 'vite';
import Sitemap from 'vite-plugin-sitemap';
import react from '@vitejs/plugin-react';

const STRAPI_BASE = 'https://vivid-triumph-4386b82e17.strapiapp.com/api';
const HOSTNAME = 'https://cholesterintipps.de';

const fetchAllDocumentIds = async (
  resource: string,
  pathPrefix: string,
): Promise<string[]> => {
  const ids: string[] = [];
  let page = 1;
  const pageSize = 100;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `${STRAPI_BASE}/${resource}?fields[0]=documentId&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const json = (await res.json()) as {
        data?: Array<{ documentId?: string }>;
        meta?: { pagination?: { pageCount?: number } };
      };
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

const buildDynamicRoutes = async (): Promise<string[]> => {
  const [posts, categories, authors] = await Promise.all([
    fetchAllDocumentIds('post2s', '/post'),
    fetchAllDocumentIds('category2s', '/category'),
    fetchAllDocumentIds('author2s', '/author'),
  ]);
  return [...posts, ...categories, ...authors];
};

export default defineConfig(async () => {
  const dynamicRoutes = await buildDynamicRoutes();

  return {
    plugins: [
      react(),
      Sitemap({
        hostname: HOSTNAME,
        dynamicRoutes,
        exclude: ['/generation', '/generation/product', '/search'],
        generateRobotsTxt: false,
      }),
    ],
  };
});
