import NextImage from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

type TVideoCardProps = {
  title: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  href?: string;
  episodeNumber?: number;
  priority?: boolean;
};

const VideoCard = memo(
  ({ title, duration, thumbnailUrl, href, priority }: TVideoCardProps) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const cardContent = (
      <article className="group ease-editorial flex h-full flex-col gap-2.5 transition-transform duration-200 hover:scale-[1.02]">
        <div className="bg-content2 shadow-soft relative aspect-[16/9] w-full overflow-hidden rounded-md">
          <div className="pointer-events-none absolute inset-0 z-10 border border-white/8 opacity-70" />
          <NextImage
            src={thumbnailUrl}
            alt={`Miniatura do sketch ${title}`}
            fill
            sizes="(max-width: 767px) calc((100vw - 2.75rem) / 2), (max-width: 1023px) calc((100vw - 4.5rem) / 3), (max-width: 1599px) calc((100vw - 26.75rem) / 4), 307px"
            className="object-cover object-center"
            quality={50}
            priority={priority}
            fetchPriority={priority ? 'high' : undefined}
          />
          <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/75 to-transparent" />
          <div className="absolute right-2 bottom-2 z-20">
            <span className="rounded-full bg-black/75 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] text-white uppercase">
              {formattedDuration}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-foreground ease-editorial group-hover:text-primary line-clamp-2 text-[0.82rem] transition-colors duration-200 md:text-[0.92rem] md:leading-[1.25]">
            {title}
          </h3>
        </div>
      </article>
    );

    if (href) {
      return (
        <Link href={href} className="block h-full" data-interactive="true">
          {cardContent}
        </Link>
      );
    }

    return cardContent;
  }
);
VideoCard.displayName = 'VideoCard';

export { VideoCard };
