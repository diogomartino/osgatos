import { getFileUrl } from '@/helpers/get-file-url';
import { TVideo } from '@/types/db';
import { memo } from 'react';
import { VideoCard } from '../video-card';

type TGridProps = {
  videos: TVideo[];
};

const Grid = memo(({ videos }: TGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          duration={video.duration}
          thumbnailUrl={getFileUrl(video, video.thumbnail)}
          title={video.title}
          href={`/watch/${video.id}`}
        />
      ))}
    </div>
  );
});
Grid.displayName = 'Grid';

export { Grid };
