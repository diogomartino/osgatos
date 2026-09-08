import { getYoutubeId } from '@/helpers/get-youtube-id';
import { JsonLd } from './index';

type TVideoJsonLdProps = {
  title: string;
  description: string;
  thumbnailUrl: string | string[];
  uploadDate: string;
  duration?: number; // seconds
  youtubeUrl: string;
  url: string;
  transcript?: string;
  series?: { name: string; url: string };
};

const VideoJsonLd = ({
  title,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  youtubeUrl,
  url,
  transcript,
  series
}: TVideoJsonLdProps) => {
  const isoDuration = duration
    ? `PT${Math.floor(Number(duration) / 60)}M${Number(duration) % 60}S`
    : undefined;
  const youtubeId = getYoutubeId(youtubeUrl);
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}`
    : undefined;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: title,
        description,
        url,
        inLanguage: 'pt-PT',
        thumbnailUrl: Array.isArray(thumbnailUrl)
          ? thumbnailUrl
          : [thumbnailUrl],
        uploadDate,
        ...(embedUrl && { embedUrl }),
        contentUrl: youtubeUrl,
        ...(isoDuration && { duration: isoDuration }),
        ...(transcript && { transcript }),
        ...(series && {
          partOfSeries: {
            '@type': 'TVSeries',
            name: series.name,
            url: series.url
          }
        })
      }}
    />
  );
};

export { VideoJsonLd };
