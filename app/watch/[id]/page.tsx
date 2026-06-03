import { Info } from '@/components/info';
import { VideoJsonLd } from '@/components/json-ld/video';
import { TranscriptDialog } from '@/components/transcript-dialog';
import { VideoPlayer } from '@/components/video-player';
import { getSiteUrl, siteConfig } from '@/config/site';
import { getFileUrl } from '@/helpers/get-file-url';
import { getVideoMetadataDescription } from '@/helpers/get-video-metadata-description';
import { getYoutubeId } from '@/helpers/get-youtube-id';
import { getShowByVideoId } from '@/queries/shows';
import { getPreviousAndNextVideoById, getVideoById } from '@/queries/videos';
import { ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = 604800; // 1 week

const getTranscriptText = (transcript: string | null | undefined) => {
  const text = transcript?.replace(/\r\n/g, '\n').trim();

  if (!text) return '';

  return text;
};

type TGenerateMetadataProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params
}: TGenerateMetadataProps): Promise<Metadata> {
  const { id } = await params;
  const [video, show] = await Promise.all([
    getVideoById(id),
    getShowByVideoId(id)
  ]);

  if (!video) {
    return {};
  }

  const youtubeId = getYoutubeId(video.videoUrl);
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}`
    : undefined;
  const description = getVideoMetadataDescription({
    title: video.title,
    showTitle: show?.title
  });
  const thumbnail =
    getFileUrl(video, video.thumbnail) || siteConfig.defaultOgImage;

  return {
    title: `Gato Fedorento - ${video.title}`,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: `/watch/${video.id}`
    },
    openGraph: {
      type: 'video.other',
      title: video.title,
      description,
      url: `/watch/${video.id}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: thumbnail,
          width: 1200,
          height: 675,
          alt: `Miniatura do sketch ${video.title}`
        }
      ],
      ...(embedUrl && {
        videos: [
          {
            url: embedUrl,
            secureUrl: embedUrl,
            type: 'text/html',
            width: 1280,
            height: 720
          }
        ]
      })
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description,
      images: [
        {
          url: thumbnail,
          alt: `Miniatura do sketch ${video.title}`
        }
      ]
    },
    robots: {
      index: true,
      follow: true
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

  const description = getVideoMetadataDescription({
    title: video.title,
    showTitle: show?.title
  });

  const transcriptSource = video.transcriptFinal?.trim()
    ? 'transcriptFinal'
    : video.transcriptv2?.trim()
      ? 'transcriptv2'
      : 'transcript';

  const transcriptText = getTranscriptText(
    transcriptSource === 'transcriptFinal'
      ? video.transcriptFinal
      : transcriptSource === 'transcriptv2'
        ? video.transcriptv2
        : video.transcript
  );

  const thumbnail =
    getFileUrl(video, video.thumbnail) || siteConfig.defaultOgImage;

  return (
    <>
      <div className="mx-auto -mt-2 flex w-full max-w-[100rem] flex-col gap-4 lg:-mt-4 lg:-mb-4 lg:flex-1 lg:justify-center lg:gap-4">
        <section
          className="bg-content1 shadow-frame flex items-center justify-center overflow-hidden rounded-lg lg:self-center"
          data-shell-frame="true"
        >
          <div className="aspect-video w-full bg-black lg:h-[54vh] lg:w-auto xl:h-[58vh]">
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

        <section className="grid gap-3 md:grid-cols-2 md:items-start md:gap-4">
          <article className="border-divider flex min-w-0 flex-col gap-2 border-b pb-3 md:border-b-0 md:pr-4 md:pb-0">
            <h1 className="line-clamp-2 max-w-4xl text-2xl leading-[0.97] md:text-3xl lg:text-[2.5rem]">
              {video.title}
            </h1>
            <div className="text-default-500 flex flex-wrap items-center gap-3 text-sm">
              <Info
                label={show ? show.title : 'Sketch'}
                duration={video.duration ?? 0}
                labelHref={show ? `/show/${show.slug}` : undefined}
              />
              {transcriptText ? (
                <TranscriptDialog
                  transcript={transcriptText}
                  transcriptFileUrl={`https://github.com/diogomartino/osgatos/blob/development/scripts/transcripts/${video.id}.txt`}
                  source={transcriptSource}
                />
              ) : null}
            </div>
            {!transcriptText ? (
              <p className="text-default-500 max-w-3xl text-sm">
                {description}
              </p>
            ) : null}
          </article>

          <nav
            aria-label="Navegação entre sketches"
            className="grid grid-cols-2 gap-2"
          >
            {previous ? (
              <Link
                href={`/watch/${previous.id}`}
                className="group bg-content1 hover:border-primary/50 hover:bg-content2 flex min-h-16 flex-col justify-between rounded-md border border-white/8 px-3 py-2"
                data-interactive="true"
              >
                <span className="text-foreground/80 ease-editorial group-hover:text-primary flex items-center gap-2 text-[0.66rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-200">
                  <ArrowBigLeftDash size="0.95rem" />
                  Anterior
                </span>
                <span className="text-foreground mt-1.5 line-clamp-2 block text-sm md:text-[0.92rem]">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {next ? (
              <Link
                href={`/watch/${next.id}`}
                className="group bg-content1 hover:border-primary/50 hover:bg-content2 flex min-h-16 flex-col justify-between rounded-md border border-white/8 px-3 py-2 text-right"
                data-interactive="true"
              >
                <span className="text-foreground/80 ease-editorial group-hover:text-primary flex items-center justify-end gap-2 text-[0.66rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-200">
                  Seguinte
                  <ArrowBigRightDash size="0.95rem" />
                </span>
                <span className="text-foreground mt-1.5 line-clamp-2 block text-sm md:text-[0.92rem]">
                  {next.title}
                </span>
              </Link>
            ) : previous ? null : (
              <div className="bg-content1 text-default-500 rounded-md border border-white/8 p-4 text-sm">
                Não existem sketches adjacentes nesta série.
              </div>
            )}
          </nav>
        </section>
      </div>

      <VideoJsonLd
        title={`Gato Fedorento - ${video.title}`}
        description={description}
        thumbnailUrl={thumbnail}
        uploadDate={new Date(video.created).toISOString()}
        duration={video.duration}
        youtubeUrl={video.videoUrl}
      />
    </>
  );
}
