import { Hero } from '@/components/hero';
import { SiteJsonLd } from '@/components/json-ld/site';
import { ShowRail } from '@/components/rail/show-rail';
import { VideoRail } from '@/components/rail/video-rail';
import { buildMetadata } from '@/helpers/metadata';
import { sample } from '@/helpers/shuffle';
import { toVideoCard } from '@/helpers/to-video-card';
import { getShowsWithVideos } from '@/queries/shows';
import { TVideoListItem } from '@/types/db';
import { Metadata } from 'next';

export const revalidate = 3600; // 1 hour

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...buildMetadata({
      title: 'Os Gatos',
      description:
        'Biblioteca completa de Gato Fedorento: séries, sketches e especiais, com pesquisa por transcrição.',
      path: '/',
      imageAlt: 'Biblioteca Os Gatos'
    }),
    keywords: [
      'Gato Fedorento',
      'comédia portuguesa',
      'sketches Gato Fedorento',
      'Os Gatos',
      'humor português',
      'os gatos net',
      'osgatos.net'
    ]
  };
}

const RAIL_SIZE = 16;

export default async function Home() {
  // Specials are long-form and belong on their series page, not the home rails.
  const showsWithVideos = (await getShowsWithVideos()).map(
    ({ show, videos }) => ({
      show,
      videos: videos.filter((video) => !video.isSpecial)
    })
  );
  const shows = showsWithVideos.map(({ show }) => show);

  const allVideos = showsWithVideos.flatMap(({ show, videos }) =>
    videos.map((video) => ({ video, show }))
  );

  if (allVideos.length === 0) {
    return (
      <section className="shell hairline bg-content1/70 mx-auto flex min-h-72 max-w-3xl flex-col justify-center rounded-2xl py-10 text-center">
        <h1 className="text-2xl">Ainda não há séries disponíveis.</h1>
      </section>
    );
  }

  const toCards = (
    offset: number,
    filter?: (video: TVideoListItem) => boolean
  ) =>
    sample(
      filter ? allVideos.filter(({ video }) => filter(video)) : allVideos,
      RAIL_SIZE,
      offset
    ).map(({ video, show }) => toVideoCard(video, show));

  const featured = sample(allVideos, 1, 0)[0];

  return (
    <div className="flex w-full flex-col gap-8 lg:gap-10">
      <SiteJsonLd />

      <Hero video={featured.video} show={featured.show} />

      <ShowRail title="Séries" shows={shows} />

      <VideoRail title="Ao calhas" videos={toCards(1)} />

      {showsWithVideos.map(({ show, videos }, index) => (
        <VideoRail
          key={show.id}
          title={show.title}
          href={`/show/${show.slug}`}
          videos={sample(videos, RAIL_SIZE, index + 3).map((video) =>
            toVideoCard(video)
          )}
        />
      ))}

      <VideoRail
        title="Com transcrição revista"
        videos={toCards(2, (video) => Boolean(video.transcriptFinal?.trim()))}
      />
    </div>
  );
}
