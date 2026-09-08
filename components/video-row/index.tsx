import { formatDuration } from '@/helpers/format-duration';
import { getFileUrl } from '@/helpers/get-file-url';
import { TVideoCard } from '@/types/db';
import NextImage from 'next/image';
import { memo } from 'react';

type TVideoRowProps = {
  video: TVideoCard;
};

const VideoRow = memo(({ video }: TVideoRowProps) => (
  <div className="group flex w-full items-center gap-3 text-left">
    <div className="bg-content2 relative h-[3.5rem] w-[6.25rem] flex-shrink-0 overflow-hidden rounded-md">
      <NextImage
        src={getFileUrl(video, video.thumbnail)}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100px"
        quality={40}
      />
      <span className="absolute right-1 bottom-1 rounded-full bg-black/75 px-1.5 py-0.5 text-[0.6rem] font-semibold text-white">
        {formatDuration(video.duration)}
      </span>
    </div>

    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="text-foreground line-clamp-1 text-sm">
        {video.title}
      </span>
      {video.showTitle ? (
        <span className="text-default-500 truncate text-xs">
          {video.showTitle}
        </span>
      ) : null}
      {video.snippet ? (
        <span className="text-default-500 line-clamp-1 text-xs italic">
          “{video.snippet}”
        </span>
      ) : null}
    </div>
  </div>
));
VideoRow.displayName = 'VideoRow';

export { VideoRow };
