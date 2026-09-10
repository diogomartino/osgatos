import { getSiteUrl, siteConfig } from '@/config/site';
import { JsonLd } from './index';

const SiteJsonLd = () => {
  const url = getSiteUrl();

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        alternateName: siteConfig.title,
        url,
        inLanguage: 'pt-PT',
        description: siteConfig.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${url}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }}
    />
  );
};

export { SiteJsonLd };
