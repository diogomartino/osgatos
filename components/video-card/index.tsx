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
      <div className="group cursor-pointer transition-transform duration-200 hover:scale-105">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-lg transition-shadow duration-200 hover:shadow-2xl">
          <NextImage
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover object-center transition-opacity duration-200 group-hover:opacity-90"
            quality={60}
            priority
          />
          <div className="absolute right-2 bottom-2">
            <span className="rounded-md bg-black/80 px-2 py-0.5 font-mono text-xs text-white">
              {formattedDuration}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-foreground line-clamp-2 text-sm font-semibold">
            {title}
          </h3>
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
