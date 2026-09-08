import { getSiteUrl } from '@/config/site';
import { JsonLd } from './index';

type TBreadcrumbsJsonLdProps = {
  trail: { name: string; path: string }[];
};

const BreadcrumbsJsonLd = ({ trail }: TBreadcrumbsJsonLdProps) => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Início', path: '/' }, ...trail].map(
        (crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${getSiteUrl()}${crumb.path}`
        })
      )
    }}
  />
);

export { BreadcrumbsJsonLd };
