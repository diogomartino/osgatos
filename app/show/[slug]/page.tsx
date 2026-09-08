import { BreadcrumbsJsonLd } from '@/components/json-ld/breadcrumbs';
import { ShowJsonLd } from '@/components/json-ld/show';
import { ShowBrowser } from '@/components/show-browser';
import { getSiteUrl } from '@/config/site';
import { formatMinutes } from '@/helpers/format-duration';
import { getFileUrl } from '@/helpers/get-file-url';
import { buildMetadata } from '@/helpers/metadata';
import { dailySeed, shuffle } from '@/helpers/shuffle';
import { toVideoCard } from '@/helpers/to-video-card';
import { getShowBySlug } from '@/queries/shows';
import { getVideosByShow } from '@/queries/videos';
import { Play, Shuffle } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 604800; // 1 week

type TPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: TPageProps): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShowBySlug(slug);

  if (!show) return {};

  return buildMetadata({
    title: `Gato Fedorento - Série ${show.title}`,
    description: `Arquivo completo da série ${show.title}, com sketches e especiais do Gato Fedorento.`,
    path: `/show/${show.slug}`,
    image: getFileUrl(show, show.cover),
    imageAlt: `Capa da série ${show.title}`,
    imageSize: { width: 800, height: 1200 }
  });
}

export default async function Page({ params }: TPageProps) {
  const { slug } = await params;
  const show = await getShowBySlug(slug);

  if (!show) notFound();

  const videos = await getVideosByShow(show.id);
  const toCards = (isSpecial: boolean) =>
    videos
      .filter((video) => Boolean(video.isSpecial) === isSpecial)
      .map((video) => toVideoCard(video));

  const sketches = toCards(false);
  const specials = toCards(true);
  const first = sketches[0] ?? specials[0];

  const totalDuration = videos.reduce((acc, v) => acc + (v.duration ?? 0), 0);
  const coverUrl = getFileUrl(show, show.cover);
  const randomId = shuffle([...sketches, ...specials], dailySeed())[0]?.id;
  const description = `Arquivo completo da série ${show.title}, com ${videos.length} sketches${specials.length > 0 ? ` e ${specials.length} especiais` : ''}.`;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] overflow-hidden"
      >
        <Image
          src={coverUrl}
          alt=""
          fill
          sizes="640px"
          quality={40}
          className="backdrop-fade scale-110 object-cover object-top opacity-25 blur-3xl"
        />
      </div>

      <div className="shell flex flex-col gap-8 lg:gap-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          <div className="bg-content2 shadow-lift relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-lg sm:w-44 lg:w-52">
            <div className="hairline pointer-events-none absolute inset-0 z-10 rounded-lg" />
            <Image
              src={coverUrl}
              alt={`Capa da série ${show.title}`}
              fill
              sizes="208px"
              className="object-cover"
              priority
              quality={60}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <span className="eyebrow text-primary">Série · {show.year}</span>

            <h1 className="text-3xl leading-[0.95] md:text-5xl lg:text-[3.6rem]">
              {show.title}
            </h1>

            <div className="text-default-500 flex flex-wrap items-center gap-2 text-sm">
              <span>{videos.length} sketches</span>
              <span className="bg-primary h-1 w-1 rounded-full" />
              <span>{formatMinutes(totalDuration)}</span>
              {specials.length > 0 ? (
                <>
                  <span className="bg-primary h-1 w-1 rounded-full" />
                  <span>{specials.length} especiais</span>
                </>
              ) : null}
            </div>

            {first ? (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Link
                  href={`/watch/${first.id}`}
                  className="bg-foreground text-background inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold hover:opacity-90"
                >
                  <Play size="1rem" fill="currentColor" />
                  Reproduzir
                </Link>
                <Link
                  href={`/watch/${randomId}`}
                  className="hairline bg-content1 text-foreground hover:border-primary/50 hover:text-primary inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold"
                >
                  <Shuffle size="1rem" />
                  Ao calhas
                </Link>
              </div>
            ) : null}
          </div>
        </header>

        <ShowBrowser sketches={sketches} specials={specials} />
      </div>

      <BreadcrumbsJsonLd
        trail={[{ name: show.title, path: `/show/${show.slug}` }]}
      />

      <ShowJsonLd
        title={show.title}
        description={description}
        url={`${getSiteUrl()}/show/${show.slug}`}
        image={coverUrl}
        datePublished={new Date(show.created).toISOString()}
        dateModified={new Date(show.updated).toISOString()}
        episodes={videos.map((video, index) => ({
          name: video.title,
          url: `${getSiteUrl()}/watch/${video.id}`,
          episodeNumber: index + 1,
          datePublished: new Date(video.created).toISOString()
        }))}
      />
    </>
  );
}
