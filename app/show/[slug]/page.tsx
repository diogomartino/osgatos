import { Grid } from '@/components/grid';
import { Info } from '@/components/info';
import { ShowJsonLd } from '@/components/json-ld/show';
import { getFileUrl } from '@/helpers/get-file-url';
import { getShowBySlug } from '@/queries/shows';
import { getVideosByShow } from '@/queries/videos';
import { TVideo } from '@/types/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 604800; // 1 week

type TGenerateMetadataProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: TGenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShowBySlug(slug);

  if (!show) {
    return {};
  }

  const title = `Gato Fedorento - Série ${show.title}`;
  const description = `Série ${show.title} do Gato Fedorento.`;
  const posterUrl = getFileUrl(show, show.cover);

  return {
    title,
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_URL}/shows/${show.slug}`,
      siteName: 'OsGatos.net',
      images: [posterUrl]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [posterUrl]
    }
  };
}

type TPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { slug } = await params;

  const show = await getShowBySlug(slug);

  if (!show) {
    notFound();
  }

  const videos = await getVideosByShow(show?.id);
  const { normalVideos, specialVideos } = videos.reduce<{
    normalVideos: TVideo[];
    specialVideos: TVideo[];
  }>(
    (acc, video) => {
      if (video.isSpecial) {
        acc.specialVideos.push(video);
      } else {
        acc.normalVideos.push(video);
      }
      return acc;
    },
    { normalVideos: [], specialVideos: [] }
  );

  const durationCount = videos.reduce((acc, v) => acc + (v.duration ?? 0), 0);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-2 text-3xl font-bold drop-shadow-lg md:text-5xl">
            Série {show.title}
          </h1>
          <Info label={`${videos.length} sketches`} duration={durationCount} />
        </div>

        <Grid videos={normalVideos} />

        {specialVideos.length > 0 && (
          <>
            <div>
              <div className="border-divider border-t" />
              <h2 className="col-span-full mt-6 text-xl font-semibold">
                Especiais
              </h2>
            </div>
            <Grid videos={specialVideos} />
          </>
        )}
      </div>

      <ShowJsonLd
        title={show.title}
        description={`Série ${show.title} do Gato Fedorento.`}
        url={`${process.env.NEXT_PUBLIC_URL}/show/${show.slug}`}
        image={getFileUrl(show, show.cover)}
        datePublished={new Date(show.created).toISOString()}
        dateModified={new Date(show.updated).toISOString()}
        episodes={videos.map((video, index) => ({
          name: video.title,
          url: `${process.env.NEXT_PUBLIC_URL}/watch/${video.id}`,
          episodeNumber: index + 1,
          datePublished: new Date(video.created).toISOString()
        }))}
      />
    </>
  );
}
