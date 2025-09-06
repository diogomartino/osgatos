export enum CacheKey {
  ALL_VIDEOS = 'all_videos',
  VIDEO_BY_ID = 'video_by_id',
  VIDEOS_BY_SHOW = 'videos_by_show',
  PREV_NEXT_VIDEO_BY_ID = 'prev_next_video_by_id',
  ALL_SHOWS = 'all_shows',
  SHOW_BY_SLUG = 'show_by_slug',
  SHOW_BY_VIDEO_ID = 'show_by_video_id'
}

const DISABLE_DEV_CACHE = true;

// 7 days in production, no caching in development if DISABLE_DEV_CACHE is true
export const REVALIDATE_TIME =
  process.env.NODE_ENV === 'development' && DISABLE_DEV_CACHE
    ? 1
    : 60 * 60 * 24 * 7;
