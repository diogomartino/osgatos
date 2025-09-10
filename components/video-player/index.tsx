'use client';

import { memo, useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';

type TVideoPlayerProps = {
  url: string;
  className?: string;
  videoId: string;
};

const VideoPlayer = memo(({ url, className, videoId }: TVideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const initCounter = useRef(0);
  const playedFirst = useRef(false);

  useEffect(() => {
    let mounted = true;
    const thisInit = ++initCounter.current;

    async function init() {
      if (!containerRef.current || !mounted) return;

      try {
        playerRef.current?.dispose();
      } catch {
        // ignore
      }

      playerRef.current = null;
      containerRef.current.innerHTML = '';

      // dynamic import ensures this runs client-side and that the plugin
      // registers on the same videojs instance we're about to use
      const vjsModule = await import('video.js');
      const videojs = (vjsModule && (vjsModule as any).default) || vjsModule;

      // @ts-expect-error no types
      await import('videojs-youtube');

      // bail if a newer init started or component unmounted
      if (!mounted || thisInit !== initCounter.current) return;

      // create fresh <video> element
      const videoEl = document.createElement('video');

      videoEl.className = 'video-js vjs-big-play-centered';
      videoEl.setAttribute('playsInline', 'true');
      videoEl.setAttribute('preload', 'metadata');
      containerRef.current.appendChild(videoEl);

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

          const umami = (window as any).umami;

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

      initCounter.current++;

      try {
        playerRef.current?.dispose();
      } catch {
        // ignore
      }

      playerRef.current = null;

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [url, videoId]);

  return (
    <div
      data-vjs-player
      ref={containerRef}
      className={className ?? 'w-full h-full'}
    />
  );
});
VideoPlayer.displayName = 'VideoPlayer';

export { VideoPlayer };
