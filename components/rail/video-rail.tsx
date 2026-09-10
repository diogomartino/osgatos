import { TVideoCard } from '@/types/db';
import { memo } from 'react';
import { VideoCard } from '../video-card';
import { Rail } from './index';

type TVideoRailProps = {
  title: string;
  videos: TVideoCard[];
  href?: string;
  priority?: boolean;
};

const VideoRail = memo(({ title, videos, href, priority }: TVideoRailProps) => {
  if (videos.length === 0) return null;

  return (
    <Rail title={title} href={href}>
      {videos.map((video, index) => (
        <li key={video.id} className="rail-item w-[15rem] md:w-[18rem]">
          <VideoCard video={video} priority={priority && index < 3} />
        </li>
      ))}
    </Rail>
  );
});
VideoRail.displayName = 'VideoRail';

export { VideoRail };
