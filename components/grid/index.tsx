import { getFileUrl } from '@/helpers/get-file-url';
import { TVideo } from '@/types/db';
import { memo } from 'react';
import { VideoCard } from '../video-card';

type TGridProps = {
  videos: TVideo[];
};

const Grid = memo(({ videos }: TGridProps) => {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video, index) => (
        <li key={video.id}>
          <VideoCard
            duration={video.duration}
            episodeNumber={video.index}
            thumbnailUrl={getFileUrl(video, video.thumbnail)}
            title={video.title}
            href={`/watch/${video.id}`}
            priority={index === 0}
            hasFinalTranscript={Boolean(video.transcriptFinal?.trim())}
          />
        </li>
      ))}
    </ul>
  );
});
Grid.displayName = 'Grid';

export { Grid };
