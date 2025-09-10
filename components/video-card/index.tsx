import NextImage from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

type TVideoCardProps = {
  title: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  href?: string;
};

const VideoCard = memo(
  ({ title, duration, thumbnailUrl, href }: TVideoCardProps) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const cardContent = (
      <div
        className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-md bg-zinc-900 shadow-lg transition-transform duration-200 hover:scale-101 hover:shadow-2xl"
        tabIndex={0}
      >
        <NextImage
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover object-center transition-opacity duration-200 group-hover:opacity-90"
          quality={60}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-1 p-3">
          <span className="line-clamp-2 w-fit rounded bg-zinc-800/40 px-2 py-0.5 text-[10px] font-semibold text-white drop-shadow lg:text-sm">
            {title}
          </span>
          <span className="w-fit rounded bg-zinc-800/40 px-2 py-0.5 font-mono text-[8px] text-zinc-200 lg:text-xs">
            {formattedDuration}
          </span>
        </div>
      </div>
    );

    if (href) {
      return <Link href={href}>{cardContent}</Link>;
    }

    return cardContent;
  }
);
VideoCard.displayName = 'VideoCard';

export { VideoCard };
