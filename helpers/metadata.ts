import { getSiteUrl, siteConfig } from '@/config/site';
import { Metadata } from 'next';

type TBuildMetadataProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  imageSize?: { width: number; height: number };
  ogType?: 'website' | 'video.other';
  videoEmbedUrl?: string;
};

const buildMetadata = ({
  title,
  description,
  path,
  image = siteConfig.defaultOgImage,
  imageAlt = siteConfig.title,
  imageSize = { width: 1200, height: 630 },
  ogType = 'website',
  videoEmbedUrl
}: TBuildMetadataProps): Metadata => ({
  title,
  description,
  metadataBase: new URL(getSiteUrl()),
  alternates: { canonical: path },
  openGraph: {
    type: ogType,
    title,
    description,
    url: path,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: image, ...imageSize, alt: imageAlt }],
    ...(videoEmbedUrl && {
      videos: [
        {
          url: videoEmbedUrl,
          secureUrl: videoEmbedUrl,
          type: 'text/html',
          width: 1280,
          height: 720
        }
      ]
    })
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: image, alt: imageAlt }]
  },
  robots: { index: true, follow: true }
});

export { buildMetadata };
