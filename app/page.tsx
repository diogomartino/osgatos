import { Poster } from '@/components/poster';
import { getSiteUrl, siteConfig } from '@/config/site';
import { getFileUrl } from '@/helpers/get-file-url';
import { getShows } from '@/queries/shows';
import { Metadata } from 'next';

export const revalidate = 604800; // 1 week

export async function generateMetadata(): Promise<Metadata> {
  const title = siteConfig.title;
  const description =
    'Biblioteca editorial com séries e sketches completos de Gato Fedorento, organizada para descoberta rápida.';
  const url = getSiteUrl();

  return {
    title,
    description,
    keywords: [
      'Gato Fedorento',
      'comédia portuguesa',
      'sketches Gato Fedorento',
      'Os Gatos',
      'humor português',
      'os gatos net',
      'osgatos.net'
    ],
    metadataBase: new URL(url),
    alternates: {
      canonical: '/'
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: '/',
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: 'Cartaz editorial da biblioteca Os Gatos'
        }
      ],
      locale: siteConfig.locale
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.defaultOgImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    }
  };
}

export default async function Home() {
  const shows = await getShows();

  if (shows.length === 0) {
    return (
      <section
        aria-labelledby="empty-shows-heading"
        className="bg-content1/72 shadow-frame mx-auto flex min-h-72 w-full max-w-3xl flex-col justify-center rounded-[1.5rem] border border-white/8 px-6 py-10 text-center"
        data-shell-frame="true"
      >
        <h1 id="empty-shows-heading" className="text-2xl">
          Ainda não há séries disponíveis.
        </h1>
      </section>
    );
  }

  return (
    <section aria-label="Séries disponíveis" className="w-full">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {shows.map((show, index) => (
          <li key={show.id}>
            <Poster
              href={`/show/${show.slug}`}
              imageUrl={getFileUrl(show, show.cover)}
              title={show.title}
              priority={index < 6}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
