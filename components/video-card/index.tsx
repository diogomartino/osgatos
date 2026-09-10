import { formatDuration } from '@/helpers/format-duration';
import { getFileUrl } from '@/helpers/get-file-url';
import { TVideoCard } from '@/types/db';
import NextImage from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

type TVideoCardProps = {
  video: TVideoCard;
  showTitle?: string | null;
  priority?: boolean;
};

const VideoCard = memo(({ video, showTitle, priority }: TVideoCardProps) => (
  <Link
    href={`/watch/${video.id}`}
    aria-label={`Ver o sketch ${video.title}`}
    className="group block h-full"
  >
    <article className="flex h-full flex-col gap-2.5">
      <div className="bg-content2 shadow-soft ease-editorial relative aspect-video w-full overflow-hidden rounded-md transition-transform duration-200 group-hover:scale-[1.02]">
        <div className="hairline pointer-events-none absolute inset-0 z-10 rounded-md opacity-70" />
        <NextImage
          src={getFileUrl(video, video.thumbnail)}
          alt={`Miniatura do sketch ${video.title}`}
          fill
          sizes="(max-width: 767px) 60vw, 300px"
          className="object-cover object-center"
          quality={50}
          priority={priority}
        />
        {(video.hasFinalTranscript ??
        Boolean(video.transcriptFinal?.trim())) ? (
          <span
            aria-hidden="true"
            title="Transcrição revista"
            className="absolute top-0 right-0 z-20 h-4 w-4 bg-green-400 opacity-45 transition-opacity duration-200 [clip-path:polygon(100%_0,0_0,100%_100%)] group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/75 to-transparent" />
        <span className="absolute right-2 bottom-2 z-20 rounded-full bg-black/75 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] text-white uppercase">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <h3 className="text-foreground ease-editorial group-hover:text-primary line-clamp-2 text-[0.82rem] transition-colors duration-200 md:text-[0.92rem] md:leading-[1.25]">
          {video.title}
        </h3>
        {(showTitle ?? video.showTitle) ? (
          <span className="text-default-500 truncate text-xs">
            {showTitle ?? video.showTitle}
          </span>
        ) : null}
        {video.snippet ? (
          <p className="text-default-500 mt-1 line-clamp-2 text-xs italic">
            “{video.snippet}”
          </p>
        ) : null}
      </div>
    </article>
  </Link>
));
VideoCard.displayName = 'VideoCard';

export { VideoCard };
