type ShowJsonLdProps = {
  title: string;
  description: string;
  url: string; // page URL
  image?: string; // poster or thumbnail
  datePublished: string; // ISO 8601
  dateModified?: string; // ISO 8601
  episodes?: {
    // optional list of episodes
    name: string;
    url: string;
    episodeNumber?: number;
    datePublished?: string;
  }[];
};

const ShowJsonLd = ({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  episodes
}: ShowJsonLdProps) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: title,
    description,
    url,
    ...(image && { image }),
    datePublished,
    ...(dateModified && { dateModified }),
    ...(episodes &&
      episodes.length > 0 && {
        hasPart: episodes.map((ep) => ({
          '@type': 'TVEpisode',
          name: ep.name,
          url: ep.url,
          ...(ep.episodeNumber && { episodeNumber: ep.episodeNumber }),
          ...(ep.datePublished && { datePublished: ep.datePublished })
        }))
      })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export { ShowJsonLd };
