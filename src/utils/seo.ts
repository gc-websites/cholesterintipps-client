import { useEffect } from 'react';

export const SITE_URL = 'https://cholesterintipps.de';
export const SITE_NAME = 'CholesterinTipps';

interface DocumentMeta {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

const setMetaByName = (name: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setMetaByProperty = (property: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export const useDocumentMeta = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noindex = false,
}: DocumentMeta) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} – Praktische Tipps zu Cholesterin, Ernährung & Gesundheit`;

    document.title = fullTitle;

    if (description) {
      setMetaByName('description', description);
      setMetaByProperty('og:description', description);
      setMetaByName('twitter:description', description);
    }

    setMetaByProperty('og:title', fullTitle);
    setMetaByName('twitter:title', fullTitle);
    setMetaByProperty('og:type', type);
    setMetaByProperty('og:site_name', SITE_NAME);
    setMetaByProperty('og:locale', 'de_DE');

    const url = canonical || window.location.origin + window.location.pathname;
    setLink('canonical', url);
    setMetaByProperty('og:url', url);

    if (image) {
      setMetaByProperty('og:image', image);
      setMetaByName('twitter:image', image);
      setMetaByName('twitter:card', 'summary_large_image');
    }

    setMetaByName('robots', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, canonical, image, type, noindex]);
};

export const useStructuredData = (
  data: Record<string, unknown> | Array<Record<string, unknown>> | null,
  id: string,
) => {
  useEffect(() => {
    if (!data) return;

    const scriptId = `ld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [data, id]);
};

export const buildCanonical = (path: string) => {
  if (!path.startsWith('/')) path = '/' + path;
  return SITE_URL + path;
};

export const stripHtml = (input: unknown, maxLength = 160): string => {
  if (typeof input !== 'string') return '';
  const text = input
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
};
