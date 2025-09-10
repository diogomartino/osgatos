import { Info } from '@/components/info';
import { VideoJsonLd } from '@/components/json-ld/video';
import { VideoPlayer } from '@/components/video-player';
import { getFileUrl } from '@/helpers/get-file-url';
import { getShowByVideoId } from '@/queries/shows';
import { getPreviousAndNextVideoById, getVideoById } from '@/queries/videos';
import { Button } from '@heroui/button';
import { ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type TGenerateMetadataProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params
}: TGenerateMetadataProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    return {};
  }

  const youtubeId = video.videoUrl.split('/').pop();
  const description = video.transcript.slice(0, 160);
  const thumbnail = getFileUrl(video, 'thumbnail');

  return {
    title: `Gato Fedorento - ${video.title}`,
    description,
    openGraph: {
      type: 'video.other',
      title: video.title,
      description,
      url: `${process.env.NEXT_PUBLIC_URL}/videos/${video.slug}`,
      siteName: 'My Video Platform',
      images: [thumbnail],
      videos: [
        {
          url: `https://www.youtube.com/embed/${youtubeId}`,
          type: 'application/x-shockwave-flash',
          width: 1280,
          height: 720
        }
      ]
    },
    twitter: {
      card: 'player',
      title: video.title,
      description,
      images: [thumbnail],
      site: '@YourTwitterHandle',
      creator: '@YourTwitterHandle'
    }
  };
}

type TPageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { id } = await params;

  const [video, show, { previous, next }] = await Promise.all([
    getVideoById(id),
    getShowByVideoId(id),
    getPreviousAndNextVideoById(id)
  ]);

  if (!video) {
    notFound();
  }

  return (
    <>
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center shadow-2xl">
        <div className="flex w-full max-w-5xl flex-col items-center gap-6">
          <div className="w-full text-center">
            <h1 className="mb-2 text-2xl font-bold drop-shadow-lg md:text-3xl">
              {video.title}
            </h1>
            <Info
              label={`Série ${show?.title}`}
              duration={video.duration ?? 0}
              labelHref={`/show/${show?.slug}`}
            />
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-800 bg-black shadow-lg">
            <Suspense fallback={<div>Loading...</div>}>
              <VideoPlayer url={video.videoUrl} videoId={video.id} />
            </Suspense>
          </div>

          <div className="flex w-full justify-between">
            {previous ? (
              <Link href={`/watch/${previous?.id}`} className="group w-fit">
                <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition hover:shadow-md">
                  <Button
                    size="sm"
                    isIconOnly
                    variant="flat"
                    className="group-hover:text-primary-500 transition group-hover:bg-zinc-700/80"
                  >
                    <ArrowBigLeftDash size="0.9rem" />
                  </Button>
                  <span className="line-clamp-1 text-xs text-zinc-300 transition group-hover:text-white">
                    {previous?.title}
                  </span>
                </div>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link href={`/watch/${next?.id}`} className="group w-fit">
                <div className="flex cursor-pointer items-center justify-end gap-2 rounded-lg px-2 py-1 transition hover:shadow-md">
                  <span className="line-clamp-1 text-xs text-zinc-300 transition group-hover:text-white">
                    {next?.title}
                  </span>
                  <Button
                    size="sm"
                    isIconOnly
                    variant="flat"
                    className="group-hover:text-primary-500 transition group-hover:bg-zinc-700/80"
                  >
                    <ArrowBigRightDash size="0.9rem" />
                  </Button>
                </div>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </div>
        </div>
      </div>

      <VideoJsonLd
        title={`Gato Fedorento - ${video.title}`}
        description={video.transcript.slice(0, 160)}
        thumbnailUrl={getFileUrl(video, video?.thumbnail)}
        uploadDate={new Date(video.created).toISOString()}
        duration={video.duration}
        youtubeUrl={video.videoUrl}
      />
    </>
  );
}
