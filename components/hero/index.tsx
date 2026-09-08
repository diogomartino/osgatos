import { formatMinutes } from '@/helpers/format-duration';
import { getFileUrl } from '@/helpers/get-file-url';
import { TShow, TVideoListItem } from '@/types/db';
import { Play } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

type THeroProps = {
  video: TVideoListItem;
  show?: TShow;
};

const Hero = memo(({ video, show }: THeroProps) => (
  <section
    aria-label="Sketch em destaque"
    className="relative isolate -mt-8 mb-2 w-full lg:-mt-10"
  >
    <div className="relative aspect-[16/10] w-full sm:aspect-[16/7] lg:aspect-[21/8]">
      <NextImage
        src={getFileUrl(video, video.thumbnail)}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
        quality={60}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/45 to-transparent" />
    </div>

    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-4 pb-6 md:px-6 md:pb-8 lg:px-8 lg:pb-10">
      <span className="eyebrow text-primary">Em destaque</span>

      <h1 className="max-w-2xl text-2xl leading-[1] md:text-4xl lg:text-[3.4rem]">
        {video.title}
      </h1>

      <div className="text-default-400 flex flex-wrap items-center gap-2 text-sm">
        {show ? <span>{show.title}</span> : null}
        {show ? <span className="bg-primary h-1 w-1 rounded-full" /> : null}
        <span>{formatMinutes(video.duration)}</span>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <Link
          href={`/watch/${video.id}`}
          className="bg-foreground text-background inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold hover:opacity-90"
        >
          <Play size="1rem" fill="currentColor" />
          Reproduzir
        </Link>
        {show ? (
          <Link
            href={`/show/${show.slug}`}
            className="hairline bg-content1/80 text-foreground hover:border-primary/50 hover:text-primary inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold backdrop-blur-sm"
          >
            Ver série
          </Link>
        ) : null}
      </div>
    </div>
  </section>
));
Hero.displayName = 'Hero';

export { Hero };
