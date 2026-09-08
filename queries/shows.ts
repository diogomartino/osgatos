import { getPb } from '@/helpers/pb';
import { getVideosByShow } from '@/queries/videos';
import { CacheKey, REVALIDATE_TIME } from '@/statics';
import { TShow, TVideoListItem } from '@/types/db';
import { unstable_cache } from 'next/cache';
import 'server-only';

const getShows = async (): Promise<TShow[]> =>
  unstable_cache(
    async () => {
      const pb = await getPb();

      const shows = await pb.collection('shows').getFullList<TShow>({
        sort: 'year',
        filter: 'public=true'
      });

      return shows;
    },
    [CacheKey.ALL_SHOWS],
    {
      revalidate: REVALIDATE_TIME,
      tags: [CacheKey.ALL_SHOWS]
    }
  )();

const getShowBySlug = async (slug: string): Promise<TShow | undefined> =>
  unstable_cache(
    async () => {
      try {
        const pb = await getPb();

        const show = await pb
          .collection('shows')
          .getFirstListItem<TShow>(`slug="${slug}" && public=true`);

        return show;
      } catch {
        return undefined;
      }
    },
    [CacheKey.SHOW_BY_SLUG, slug],
    {
      revalidate: REVALIDATE_TIME,
      tags: [CacheKey.SHOW_BY_SLUG]
    }
  )();

const getShowByVideoId = async (videoId: string): Promise<TShow | undefined> =>
  unstable_cache(
    async () => {
      try {
        const pb = await getPb();

        const video = await pb
          .collection('videos')
          .getFirstListItem(`id="${videoId}" && show.public=true`);

        if (!video) return undefined;

        const show = await pb.collection('shows').getOne<TShow>(video.show);

        return show;
      } catch {
        return undefined;
      }
    },
    [CacheKey.SHOW_BY_VIDEO_ID, videoId],
    {
      revalidate: REVALIDATE_TIME,
      tags: [CacheKey.SHOW_BY_VIDEO_ID]
    }
  )();

const getShowsWithVideos = async (): Promise<
  { show: TShow; videos: TVideoListItem[] }[]
> => {
  const shows = await getShows();

  return Promise.all(
    shows.map(async (show) => ({
      show,
      videos: await getVideosByShow(show.id)
    }))
  );
};

export { getShowBySlug, getShowByVideoId, getShows, getShowsWithVideos };
