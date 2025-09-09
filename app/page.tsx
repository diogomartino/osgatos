import { Poster } from '@/components/poster';
import { getFileUrl } from '@/helpers/get-file-url';
import { getShows } from '@/queries/shows';
import Link from 'next/link';

export default async function Home() {
  const shows = await getShows();

  return (
    <section className="flex flex-wrap items-center justify-center gap-4 h-full">
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
