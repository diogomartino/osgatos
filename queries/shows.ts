import { getPb } from '@/helpers/pb';
import { CacheKey, REVALIDATE_TIME } from '@/statics';
import { TShow } from '@/types/db';
import { unstable_cache } from 'next/cache';
import 'server-only';

const getShows = async (): Promise<TShow[]> =>
  unstable_cache(
    async () => {
      const pb = await getPb();

      const shows = await pb.collection('shows').getFullList<TShow>({
        sort: '-title',
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
          .getFirstListItem<TShow>(`slug="${slug}"`);

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
          .getFirstListItem(`id="${videoId}"`);

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

export { getShowBySlug, getShowByVideoId, getShows };
