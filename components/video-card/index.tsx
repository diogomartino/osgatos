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
        className="relative w-full aspect-[16/9] bg-zinc-900 rounded-md overflow-hidden shadow-lg group cursor-pointer transition-transform duration-200 hover:scale-101 hover:shadow-2xl"
        tabIndex={0}
      >
        <NextImage
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover object-center group-hover:opacity-90 transition-opacity duration-200"
          quality={60}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
          <span className="text-white lg:text-base text-xs font-semibold drop-shadow line-clamp-2">
            {title}
          </span>
          <span className="text-[10px] lg:text-xs text-zinc-200 bg-zinc-800/80 rounded px-2 py-0.5 w-fit font-mono">
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
