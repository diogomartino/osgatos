// components/seo/VideoJsonLd.tsx

type TVideoJsonLdProps = {
  title: string;
  description: string;
  thumbnailUrl: string | string[];
  uploadDate: string;
  duration?: number; // seconds
  youtubeUrl: string;
};

const VideoJsonLd = ({
  title,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  youtubeUrl
}: TVideoJsonLdProps) => {
  const isoDuration = duration
    ? `PT${Math.floor(Number(duration) / 60)}M${Number(duration) % 60}S`
    : undefined;
  const youtubeId = youtubeUrl?.split('/').pop();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    thumbnailUrl: Array.isArray(thumbnailUrl) ? thumbnailUrl : [thumbnailUrl],
    uploadDate,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    ...(isoDuration && { duration: isoDuration })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export { VideoJsonLd };
