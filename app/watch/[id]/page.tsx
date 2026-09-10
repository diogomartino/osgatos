import { BreadcrumbsJsonLd } from '@/components/json-ld/breadcrumbs';
import { VideoJsonLd } from '@/components/json-ld/video';
import { VideoRail } from '@/components/rail/video-rail';
import { TranscriptPanel } from '@/components/transcript-panel';
import { VideoPlayer } from '@/components/video-player';
import { getSiteUrl, siteConfig } from '@/config/site';
import { formatMinutes } from '@/helpers/format-duration';
import { getFileUrl } from '@/helpers/get-file-url';
import { getVideoMetadataDescription } from '@/helpers/get-video-metadata-description';
import { getYoutubeId } from '@/helpers/get-youtube-id';
import { buildMetadata } from '@/helpers/metadata';
import { toVideoCard } from '@/helpers/to-video-card';
import { getShowByVideoId } from '@/queries/shows';
import { getVideoById, getVideosByShow } from '@/queries/videos';
import { TVideo } from '@/types/db';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = 604800; // 1 week

const UP_NEXT_SIZE = 20;

const TRANSCRIPT_FIELDS = [
  'transcriptFinal',
  'transcriptv2',
  'transcript'
] as const;

const pickTranscript = (video: TVideo) => {
  for (const field of TRANSCRIPT_FIELDS) {
    const text = video[field]?.replace(/\r\n/g, '\n').trim();

    if (text) return { text, field };
  }

  return { text: '', field: 'transcript' as const };
};

type TPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params
}: TPageProps): Promise<Metadata> {
  const { id } = await params;
  const [video, show] = await Promise.all([
    getVideoById(id),
    getShowByVideoId(id)
  ]);

  if (!video) return {};

  const youtubeId = getYoutubeId(video.videoUrl);

  return buildMetadata({
    title: `Gato Fedorento - ${video.title}`,
    description: getVideoMetadataDescription({
      title: video.title,
      showTitle: show?.title
    }),
    path: `/watch/${video.id}`,
    image: getFileUrl(video, video.thumbnail) || siteConfig.defaultOgImage,
    imageAlt: `Miniatura do sketch ${video.title}`,
    imageSize: { width: 1200, height: 675 },
    ogType: 'video.other',
    videoEmbedUrl: youtubeId
      ? `https://www.youtube.com/embed/${youtubeId}`
      : undefined
  });
}

export default async function Page({ params }: TPageProps) {
  const { id } = await params;

  const [video, show] = await Promise.all([
    getVideoById(id),
    getShowByVideoId(id)
  ]);

  if (!video) notFound();

  const description = getVideoMetadataDescription({
    title: video.title,
    showTitle: show?.title
  });
  const transcript = pickTranscript(video);

  const siblings = show ? await getVideosByShow(show.id) : [];
  const position = siblings.findIndex((sibling) => sibling.id === video.id);
  const previous = position > 0 ? siblings[position - 1] : undefined;
  const next = position >= 0 ? siblings[position + 1] : undefined;

  const upNext = [
    ...siblings.slice(position + 1),
    ...siblings.slice(0, Math.max(position, 0))
  ]
    .slice(0, UP_NEXT_SIZE)
    .map((sibling) => toVideoCard(sibling));

  const navLink =
    'hairline bg-content1 hover:border-primary/50 hover:text-primary text-default-500 flex h-10 w-10 items-center justify-center rounded-full';

  return (
    <>
      <div className="flex w-full flex-col gap-8">
        <div className="shell flex flex-col gap-5">
          <section className="bg-content1 hairline flex items-center justify-center overflow-hidden rounded-lg lg:self-center">
            <div className="aspect-video w-full bg-black lg:h-[58vh] lg:w-auto">
              <Suspense
                fallback={
                  <div className="bg-content2 text-default-500 flex h-full w-full items-center justify-center text-sm">
                    A carregar o player...
                  </div>
                }
              >
                <VideoPlayer url={video.videoUrl} videoId={video.id} />
              </Suspense>
            </div>
          </section>

          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h1 className="text-2xl leading-[1.02] md:text-3xl lg:text-[2.4rem]">
                  {video.title}
                </h1>

                <div className="text-default-500 flex flex-wrap items-center gap-2 text-sm">
                  {show ? (
                    <Link
                      href={`/show/${show.slug}`}
                      className="hover:text-primary text-foreground/85"
                    >
                      {show.title}
                    </Link>
                  ) : (
                    <span>Sketch</span>
                  )}
                  <span className="bg-primary h-1 w-1 rounded-full" />
                  <span>{formatMinutes(video.duration)}</span>
                </div>
              </div>

              <nav
                aria-label="Navegação entre sketches"
                className="flex shrink-0 items-center gap-2 pt-1"
              >
                {previous ? (
                  <Link
                    href={`/watch/${previous.id}`}
                    aria-label={`Anterior: ${previous.title}`}
                    title={previous.title}
                    className={navLink}
                  >
                    <ChevronLeft size="1.1rem" />
                  </Link>
                ) : null}
                {next ? (
                  <Link
                    href={`/watch/${next.id}`}
                    aria-label={`Seguinte: ${next.title}`}
                    title={next.title}
                    className={navLink}
                  >
                    <ChevronRight size="1.1rem" />
                  </Link>
                ) : null}
              </nav>
            </div>

            {transcript.text ? (
              <TranscriptPanel
                videoId={video.id}
                transcript={transcript.text}
                isRevised={transcript.field === 'transcriptFinal'}
                fileUrl={`https://github.com/diogomartino/osgatos/blob/development/scripts/transcripts/${video.id}.txt`}
              />
            ) : (
              <p className="text-default-500 text-sm">{description}</p>
            )}
          </div>
        </div>

        <VideoRail
          title={show ? `Mais de ${show.title}` : 'Mais sketches'}
          href={show ? `/show/${show.slug}` : undefined}
          videos={upNext}
        />
      </div>

      <BreadcrumbsJsonLd
        trail={[
          ...(show ? [{ name: show.title, path: `/show/${show.slug}` }] : []),
          { name: video.title, path: `/watch/${video.id}` }
        ]}
      />

      <VideoJsonLd
        title={`Gato Fedorento - ${video.title}`}
        description={description}
        url={`${getSiteUrl()}/watch/${video.id}`}
        transcript={transcript.text || undefined}
        series={
          show
            ? { name: show.title, url: `${getSiteUrl()}/show/${show.slug}` }
            : undefined
        }
        thumbnailUrl={
          getFileUrl(video, video.thumbnail) || siteConfig.defaultOgImage
        }
        uploadDate={new Date(video.created).toISOString()}
        duration={video.duration}
        youtubeUrl={video.videoUrl}
      />
    </>
  );
}
