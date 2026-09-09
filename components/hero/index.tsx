import { formatMinutes } from '@/helpers/format-duration';
import { getFileUrl } from '@/helpers/get-file-url';
import { TShow, TVideoListItem } from '@/types/db';
import { Play } from 'lucide-react';
import NextImage from 'next/image';
import { memo } from 'react';
import { TrackedLink } from '../tracked-link';

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
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
    </div>

    <div className="shell absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-6 text-center md:pb-8 lg:pb-10">
      <span className="eyebrow text-primary">Em destaque</span>

      <h1 className="max-w-3xl text-2xl leading-[1] text-balance md:text-4xl lg:text-[3.4rem]">
        {video.title}
      </h1>

      <div className="text-default-400 flex flex-wrap items-center justify-center gap-2 text-sm">
        {show ? <span>{show.title}</span> : null}
        {show ? <span className="bg-primary h-1 w-1 rounded-full" /> : null}
        <span>{formatMinutes(video.duration)}</span>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        <TrackedLink
          href={`/watch/${video.id}`}
          event="hero-play"
          payload={{ videoId: video.id, show: show?.title }}
          className="bg-foreground text-background inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold hover:opacity-90"
        >
          <Play size="1rem" fill="currentColor" />
          Reproduzir
        </TrackedLink>
        {show ? (
          <TrackedLink
            href={`/show/${show.slug}`}
            event="hero-show"
            payload={{ show: show.title }}
            className="hairline bg-content1/80 text-foreground hover:border-primary/50 hover:text-primary inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold backdrop-blur-sm"
          >
            Ver série
          </TrackedLink>
        ) : null}
      </div>
    </div>
  </section>
));
Hero.displayName = 'Hero';

export { Hero };
