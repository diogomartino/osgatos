import { Info } from '@/components/info';
import { VideoCard } from '@/components/video-card';
import { getFileUrl } from '@/helpers/get-file-url';
import { getShowBySlug } from '@/queries/shows';
import { getVideosByShow } from '@/queries/videos';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type TGenerateMetadataProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: TGenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShowBySlug(slug);

  return {
    title: `Gato Fedorento - Série ${show?.title}`,
    openGraph: {
      images: [getFileUrl(show, show?.cover)]
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
  const durationCount = videos.reduce((acc, v) => acc + (v.duration ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
          Série {show.title}
        </h1>
        <Info label={`${videos.length} sketches`} duration={durationCount} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            duration={video.duration}
            thumbnailUrl={getFileUrl(video, video.thumbnail)}
            title={video.title}
            href={`/watch/${video.id}`}
          />
        ))}
      </div>
    </div>
  );
}
