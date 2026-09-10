import { TVideoCard } from '@/types/db';
import { memo } from 'react';
import { VideoCard } from '../video-card';

type TGridProps = {
  videos: TVideoCard[];
};

const Grid = memo(({ videos }: TGridProps) => (
  <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
    {videos.map((video, index) => (
      <li key={video.id}>
        <VideoCard video={video} priority={index < 4} />
      </li>
    ))}
  </ul>
));
Grid.displayName = 'Grid';

export { Grid };
