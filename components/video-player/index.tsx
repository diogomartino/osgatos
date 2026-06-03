'use client';

import { getYoutubeId } from '@/helpers/get-youtube-id';
import type { TUmamiWindow } from '@/types';
import { YouTubeEmbed } from '@next/third-parties/google';
import { memo, useCallback, useMemo, useRef } from 'react';

type TVideoPlayerProps = {
  url: string;
  className?: string;
  videoId: string;
};

const VideoPlayer = memo(({ url, className, videoId }: TVideoPlayerProps) => {
  const playedFirst = useRef(false);
  const youtubeId = useMemo(() => getYoutubeId(url), [url]);

  const onPlay = useCallback(() => {
    if (playedFirst.current || typeof window === 'undefined') return;

    playedFirst.current = true;

    const umami = (window as TUmamiWindow).umami;

    umami?.track('play-video', {
      videoId
    });
  }, [videoId]);

  if (!youtubeId) {
    return (
      <div className={className ?? 'h-full w-full'}>
        <div className="bg-content2 text-default-500 flex h-full w-full items-center justify-center text-sm">
          Vídeo indisponível.
        </div>
      </div>
    );
  }

  return (
    <div
      className={className ?? 'video-player h-full w-full'}
      onClickCapture={onPlay}
    >
      <YouTubeEmbed
        videoid={youtubeId}
        playlabel="Reproduzir video"
        params="modestbranding=1&rel=0"
        style="display:block;width:100%;height:100%;max-width:none;"
      />
    </div>
  );
});
VideoPlayer.displayName = 'VideoPlayer';

export { VideoPlayer };
