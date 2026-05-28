'use client';

import type { TUmamiWindow } from '@/types';
import { memo, useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';

type TVideoPlayerProps = {
  url: string;
  className?: string;
  videoId: string;
};

type TVideoJsPlayer = ReturnType<(typeof import('video.js'))['default']>;

const VideoPlayer = memo(({ url, className, videoId }: TVideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<TVideoJsPlayer | null>(null);
  const playedFirst = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    let mounted = true;

    async function init() {
      if (!container || !mounted) return;

      try {
        playerRef.current?.dispose();
      } catch {
        // ignore
      }

      playerRef.current = null;
      container.innerHTML = '';

      // dynamic import ensures this runs client-side and that the plugin
      // registers on the same videojs instance we're about to use
      const { default: videojs } = await import('video.js');

      // @ts-expect-error no types
      await import('videojs-youtube');

      if (!mounted) return;

      // create fresh <video> element
      const videoEl = document.createElement('video');

      videoEl.className = 'video-js vjs-big-play-centered';
      videoEl.setAttribute('playsInline', 'true');
      videoEl.setAttribute('preload', 'metadata');
      container.appendChild(videoEl);

      // initialize player
      playerRef.current = videojs(videoEl, {
        autoplay: false,
        controls: true,
        fluid: true,
        techOrder: ['youtube'],
        sources: [{ src: url, type: 'video/youtube' }],
        youtube: {
          modestbranding: 1,
          iv_load_policy: 3
        }
      });

      if (playerRef.current) {
        playerRef.current.on('play', () => {
          if (typeof window === 'undefined') return;

          const umami = (window as TUmamiWindow).umami;

          if (!playedFirst.current) {
            playedFirst.current = true;
          }

          if (umami) {
            umami.track('play-video', {
              videoId
            });
          }
        });
      }
    }

    init().catch((err) => {
      console.error('VideoPlayer init failed:', err);
    });

    return () => {
      mounted = false;

      try {
        playerRef.current?.dispose();
      } catch {
        // ignore
      }

      playerRef.current = null;

      if (container) {
        container.innerHTML = '';
      }
    };
  }, [url, videoId]);

  return (
    <div
      data-vjs-player
      ref={containerRef}
      className={className ?? 'h-full w-full'}
    />
  );
});
VideoPlayer.displayName = 'VideoPlayer';

export { VideoPlayer };
