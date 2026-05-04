import { FC } from 'react';
import { Link } from 'react-router-dom';
import { SITE_URL, useStructuredData } from '../utils/seo';

export interface Crumb {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  schemaId: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, schemaId }) => {
  useStructuredData(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.href ? SITE_URL + item.href : undefined,
      })),
    },
    `breadcrumbs-${schemaId}`,
  );

  return (
    <nav aria-label="Brotkrumen-Navigation" className="container pt-4 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-additionalText dark:text-white/70">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.name}-${index}`}
              className="flex items-center gap-2"
            >
              {item.href && !isLast ? (
                <Link to={item.href} className="hover:text-main underline">
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="text-mainText dark:text-white"
                >
                  {item.name}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
