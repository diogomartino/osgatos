import { Poster } from '@/components/poster';
import { getFileUrl } from '@/helpers/get-file-url';
import { getShows } from '@/queries/shows';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 604800; // 1 week

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Os Gatos';
  const description =
    'Site não oficial com toda a obra de Gato Fedorento. Encontra todos os sketches aqui!';
  const thumbnail = 'https://i.imgur.com/bRD7sXs.png';
  const url = `${process.env.NEXT_PUBLIC_URL}/`;

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
      canonical: url
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: 'OsGatos.net',
      images: [
        {
          url: thumbnail,
          width: 1200,
          height: 630,
          alt: 'Gato Fedorento'
        }
      ],
      locale: 'pt_PT'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [thumbnail]
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

  return (
    <section className="flex flex-wrap items-start justify-center gap-6 lg:h-full lg:items-center">
      {shows.map((show) => (
        <Link key={show.id} href={`/show/${show.slug}`}>
          <Poster
            key={show.id}
            imageUrl={getFileUrl(show, show.cover)}
            title={show.title}
          />
        </Link>
      ))}
    </section>
  );
}
