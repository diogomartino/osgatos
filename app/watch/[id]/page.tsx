import { Info } from '@/components/info';
import VideoPlayer from '@/components/video-player';
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

  return {
    title: `Gato Fedorento - ${video?.title}`,
    description: video?.transcript.slice(0, 160),
    openGraph: {
      images: [getFileUrl(video, video?.thumbnail)]
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
    <div className="flex justify-center items-center flex-col flex-1 w-full shadow-2xl h-full">
      <div className="w-full max-w-5xl flex flex-col gap-6 items-center">
        <div className="w-full text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
            {video.title}
          </h1>
          <Info
            label={`Série ${show?.title}`}
            duration={video.duration ?? 0}
            labelHref={`/show/${show?.slug}`}
          />
        </div>

        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-zinc-800 bg-black">
          <Suspense fallback={<div>Loading...</div>}>
            <VideoPlayer url={video.videoUrl} videoId={video.id} />
          </Suspense>
        </div>

        <div className="flex w-full justify-between">
          {previous ? (
            <Link href={`/watch/${previous?.id}`} className="group w-fit">
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg transition hover:shadow-md cursor-pointer">
                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  className="group-hover:bg-zinc-700/80 group-hover:text-primary-500 transition"
                >
                  <ArrowBigLeftDash size="0.9rem" />
                </Button>
                <span className="text-xs text-zinc-300 group-hover:text-white transition line-clamp-1">
                  {previous?.title}
                </span>
              </div>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link href={`/watch/${next?.id}`} className="group w-fit">
              <div className="flex items-center gap-2 justify-end px-2 py-1 rounded-lg transition hover:shadow-md cursor-pointer">
                <span className="text-xs text-zinc-300 group-hover:text-white transition line-clamp-1">
                  {next?.title}
                </span>
                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  className="group-hover:bg-zinc-700/80 group-hover:text-primary-500 transition"
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
  );
}
