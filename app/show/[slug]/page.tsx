import { Grid } from '@/components/grid';
import { Info } from '@/components/info';
import { ShowJsonLd } from '@/components/json-ld/show';
import { getSiteUrl, siteConfig } from '@/config/site';
import { getFileUrl } from '@/helpers/get-file-url';
import { getShowBySlug } from '@/queries/shows';
import { getVideosByShow } from '@/queries/videos';
import { TVideo } from '@/types/db';
import { Metadata } from 'next';
import Image from 'next/image';
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
  const description = `Arquivo editorial da série ${show.title}, com sketches completos e especiais do Gato Fedorento.`;
  const posterUrl = getFileUrl(show, show.cover) || siteConfig.defaultOgImage;

  return {
    title,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: `/show/${show.slug}`
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/show/${show.slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: posterUrl,
          width: 800,
          height: 1200,
          alt: `Capa da série ${show.title}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: posterUrl,
          alt: `Capa da série ${show.title}`
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
  const showDescription = `Arquivo completo da série ${show.title}, com ${videos.length} sketches${specialVideos.length > 0 ? ` e ${specialVideos.length} especiais` : ''}.`;

  return (
    <>
      <div className="mx-auto grid w-full max-w-[100rem] gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-5">
            <div className="bg-content2 shadow-lift relative mx-auto aspect-[2/3] w-full max-w-[18rem] overflow-hidden rounded-lg lg:mx-0">
              <div className="pointer-events-none absolute inset-0 z-10 border border-white/8" />
              <Image
                src={getFileUrl(show, show.cover)}
                alt={`Capa da série ${show.title}`}
                fill
                sizes="288px"
                className="object-cover"
                priority
                fetchPriority="high"
                quality={50}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-3xl leading-[0.95] md:text-4xl lg:text-[3.2rem]">
                {show.title}
              </h1>
              <Info
                label={`${videos.length} sketches`}
                duration={durationCount}
              />
              {specialVideos.length > 0 ? (
                <p className="text-default-500 text-sm">
                  {specialVideos.length} especiais
                </p>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-10">
          <section
            aria-labelledby="videos-heading"
            className="flex flex-col gap-5"
          >
            <h2
              id="videos-heading"
              className="border-primary text-foreground border-l-2 pl-3 text-sm font-semibold tracking-[0.24em] uppercase"
            >
              Sketches
            </h2>

            {normalVideos.length > 0 ? (
              <Grid videos={normalVideos} />
            ) : (
              <div
                className="bg-content1 shadow-frame flex min-h-56 flex-col justify-center rounded-lg px-6 py-10 text-center"
                data-shell-frame="true"
              >
                <h3 className="text-xl">
                  Ainda não existem sketches nesta série.
                </h3>
              </div>
            )}
          </section>

          {specialVideos.length > 0 && (
            <section
              aria-labelledby="specials-heading"
              className="flex flex-col gap-5"
            >
              <h2
                id="specials-heading"
                className="border-primary text-foreground border-l-2 pl-3 text-sm font-semibold tracking-[0.24em] uppercase"
              >
                Especiais
              </h2>

              <Grid videos={specialVideos} />
            </section>
          )}
        </div>
      </div>

      <ShowJsonLd
        title={show.title}
        description={showDescription}
        url={`${getSiteUrl()}/show/${show.slug}`}
        image={getFileUrl(show, show.cover)}
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
