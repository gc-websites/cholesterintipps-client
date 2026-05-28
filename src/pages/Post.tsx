import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getNewPosts, getPost, getRelatedPosts } from '../services/postsAPI';

import dot from '../assets/svg/dot.svg';

import Loader from '../components/Loader';
import Page404 from './Page404';
import Disclaimer from '../views/Disclaimer';
import RenderDescription from '../components/RenderDescription';
import InfinitePost from '../components/InfinitePost';
import Breadcrumbs from '../components/Breadcrumbs';
import Comments from '../components/Comments';
import {
  SITE_URL,
  buildCanonical,
  stripHtml,
  useDocumentMeta,
  useStructuredData,
} from '../utils/seo';
import { io } from 'socket.io-client';

const socket = io('https://vivid-triumph-4386b82e17.strapiapp.com');

const Post = () => {
  const [post, setPost] = useState<any>({});
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const postId = pathname.split('/').pop();
  const [postIds, setPostIds] = useState<string[]>([]);

  const [activeUsers, setActiveUsers] = useState<Record<string, number>>({});

  useEffect(() => {
    socket.on('updateAllActiveUsers', data => {
      setActiveUsers(data);
    });
    socket.on('updateActiveUsers', ({ postId, count }) => {
      setActiveUsers(prev => ({
        ...prev,
        [postId]: count,
      }));
    });

    return () => {
      socket.off('updateAllActiveUsers');
      socket.off('updateActiveUsers');
    };
  }, [postId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const post = await getPost(postId);
        const related = await getRelatedPosts();
        const ids = await getNewPosts();
        setPostIds(ids.data.map((post: any) => post.documentId));
        setRelatedPosts(related.data);
        setPost(post.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    socket.emit('joinPost', postId);
    socket.on('updateActiveUsers', data => {
      if (data.postId === postId) {
        setActiveUsers(prevActiveUsers => ({
          ...prevActiveUsers,
          [postId as string]: data.count,
        }));
      }
    });

    return () => {
      socket.emit('leavePost', postId);
      socket.off('updateActiveUsers');
    };
  }, [postId]);

  const hasPost = post && Object.keys(post).length > 0;

  const metaDescription = useMemo(
    () => (hasPost ? stripHtml(post.description, 160) : ''),
    [hasPost, post.description],
  );

  useDocumentMeta({
    title: hasPost ? post.title : undefined,
    description: metaDescription,
    canonical: hasPost ? buildCanonical(`/post/${post.documentId}`) : undefined,
    image: hasPost ? post.image?.url : undefined,
    type: 'article',
  });

  const articleSchema = useMemo(() => {
    if (!hasPost) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/post/${post.documentId}`,
      },
      headline: post.title,
      description: metaDescription,
      image: post.image?.url ? [post.image.url] : undefined,
      datePublished: post.createdAt,
      dateModified: post.updatedAt || post.createdAt,
      inLanguage: 'de-DE',
      articleSection: post.category_2?.name,
      author: post.author_2
        ? {
            '@type': 'Person',
            name: post.author_2.name,
            url: `${SITE_URL}/author/${post.author_2.documentId}`,
          }
        : undefined,
      publisher: {
        '@type': 'Organization',
        name: 'CholesterinTipps',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vivid-triumph-4386b82e17.media.strapiapp.com/tick_b2fcfe5480.svg',
        },
      },
    };
  }, [hasPost, post, metaDescription]);

  useStructuredData(articleSchema, `article-${post?.documentId || 'none'}`);

  const breadcrumbSchema = useMemo(() => {
    if (!hasPost) return null;
    const items: Array<Record<string, unknown>> = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: `${SITE_URL}/`,
      },
    ];
    if (post.category_2?.documentId && post.category_2?.name) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: post.category_2.name,
        item: `${SITE_URL}/category/${post.category_2.documentId}`,
      });
    }
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: post.title,
      item: `${SITE_URL}/post/${post.documentId}`,
    });
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
  }, [hasPost, post]);

  useStructuredData(
    breadcrumbSchema,
    `breadcrumb-${post?.documentId || 'none'}`,
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!hasPost) {
    return <Page404 />;
  }

  const filteredPostIds = postIds?.filter(id => id !== postId);

  const getReadingCount = (postId: string) => activeUsers[postId] || 0;

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        schemaId={`post-${post.documentId}`}
        items={
          [
            { name: 'Startseite', href: '/' },
            post.category_2
              ? {
                  name: post.category_2.name,
                  href: `/category/${post.category_2.documentId}`,
                }
              : null,
            { name: post.title },
          ].filter(Boolean) as any
        }
      />

      <section className="container grid md:grid-cols-[70%_30%] gap-6 py-10">
        <div className="group p-4 rounded-lg h-full bg-white dark:bg-additionalText flex flex-col">
          <div className="flex items-center py-4 flex-wrap gap-4">
            <Link
              to={`/author/${post.author_2.documentId}`}
              className="flex items-center flex-wrap gap-4"
            >
              <img
                src={post.author_2.avatar.url}
                alt={post.author_2.name}
                className="rounded-full w-12 h-12"
              />
              <h5 className="section__title underline hover:text-main transition text-base font-bold">
                {post.author_2.name}
              </h5>
            </Link>
            <img src={dot} alt="" className="w-2 h-2" />
            <p className="section__description text-additionalText text-sm">
              <time dateTime={post.createdAt}>
                {new Intl.DateTimeFormat('de-DE', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                }).format(new Date(post.createdAt))}
              </time>
            </p>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <>
                <img src={dot} alt="" className="w-2 h-2" />
                <p className="section__description text-additionalText text-sm">
                  Aktualisiert:{' '}
                  <time dateTime={post.updatedAt}>
                    {new Intl.DateTimeFormat('de-DE', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    }).format(new Date(post.updatedAt))}
                  </time>
                </p>
              </>
            )}
          </div>

          <h1 className="section__title text-4xl text-mainText mb-4">
            {post.title}
          </h1>
          {post.category_2 && (
            <Link
              to={`/category/${post.category_2.documentId}`}
              className="section__title block text-2xl text-main dark:text-main mb-6 hover:underline"
            >
              {post.category_2.name}
            </Link>
          )}

          <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={post.image.url}
              alt={post.title}
              className="w-full h-full object-cover object-center transform"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4 pb-4">
            <RenderDescription
              description={post.description}
              className="section__description text-base"
              truncate={false}
            />

            {post.paragraphs?.map(
              (
                paragraph: {
                  id: number | string;
                  subtitle: string;
                  description: string;
                  image?: { url: string };
                },
                idx: number,
              ) => (
                <div
                  key={paragraph.id ?? idx}
                  className="pt-6 flex flex-col gap-4"
                >
                  <h2 className="section__title text-2xl text-mainText">
                    {paragraph.subtitle}
                  </h2>
                  <RenderDescription
                    description={paragraph.description}
                    className="section__description text-base"
                    truncate={false}
                  />
                  {paragraph.image?.url && (
                    <img
                      src={paragraph.image.url}
                      alt={paragraph.subtitle}
                      className="w-full object-cover rounded"
                    />
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-6 h-full">
          <h2 className="section__title text-xl font-bold text-mainText">
            Verwandte Artikel
          </h2>
          {relatedPosts.slice(0, 4).map(post => (
            <Link
              key={post.documentId}
              to={`/post/${post.documentId}`}
              className="group p-4 hover:shadow-lg rounded-lg bg-white dark:bg-additionalText transition duration-300 flex flex-col"
            >
              <div className="flex items-center pb-2 flex-wrap gap-3">
                <img
                  src={post.author_2.avatar.url}
                  alt={post.author_2.name}
                  className="rounded-full w-9 h-9"
                />
                <h5 className="section__title text-sm font-bold">
                  {post.author_2.name}
                </h5>
                <img src={dot} alt="" className="w-2 h-2" />
                <p className="section__description text-additionalText text-xs">
                  <time dateTime={post.createdAt}>
                    {new Intl.DateTimeFormat('de-DE', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    }).format(new Date(post.createdAt))}
                  </time>
                </p>
              </div>
              <div className="w-full aspect-[4/3] overflow-hidden rounded-lg mb-3">
                <img
                  src={post.image.url}
                  alt={post.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                {getReadingCount(post.documentId) > 0 && (
                  <p className="section__description text-sm text-main dark:text-main">
                    {getReadingCount(post.documentId)} liest gerade
                  </p>
                )}
                <h3 className="section__title text-lg text-mainText">
                  {post.title}
                </h3>
                <RenderDescription
                  description={post.description}
                  className="section__description text-sm"
                  truncate={true}
                />
                <p className="section__description text-main dark:text-main text-sm mt-auto">
                  Weiterlesen
                </p>
              </div>
            </Link>
          ))}
        </aside>
      </section>

      <Comments
        postId={postId as string}
        initialComments={post.comments || []}
      />

      <Disclaimer />

      <InfinitePost
        postIds={filteredPostIds}
        getReadingCount={getReadingCount}
      />
    </div>
  );
};

export default Post;
