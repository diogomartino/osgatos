import { getPb } from '@/helpers/pb';
import { CacheKey, REVALIDATE_TIME } from '@/statics';
import { TVideo } from '@/types/db';
import { unstable_cache } from 'next/cache';
import 'server-only';

const getVideoById = async (id: string): Promise<TVideo | undefined> =>
  unstable_cache(
    async () => {
      try {
        const pb = await getPb();

        const video = await pb
          .collection('videos')
          .getFirstListItem<TVideo>(`id="${id}"`);

        return video;
      } catch {
        return undefined;
      }
    },
    [CacheKey.VIDEO_BY_ID, id],
    {
      revalidate: REVALIDATE_TIME,
      tags: [CacheKey.VIDEO_BY_ID]
    }
  )();

const getPreviousAndNextVideoById = async (
  videoId: string
): Promise<{ previous: TVideo | undefined; next: TVideo | undefined }> =>
  unstable_cache(
    async () => {
      try {
        const pb = await getPb();

        const currentVideo = await pb
          .collection('videos')
          .getFirstListItem<TVideo>(`id="${videoId}"`);

        const [previous, next] = await Promise.all([
          pb
            .collection('videos')
            .getFirstListItem<TVideo>(
              `show="${currentVideo.show}" && created < "${currentVideo.created}"`,
              { sort: '-created' }
            )
            .catch(() => null),
          pb
            .collection('videos')
            .getFirstListItem<TVideo>(
              `show="${currentVideo.show}" && created > "${currentVideo.created}"`,
              { sort: 'created' }
            )
            .catch(() => null)
        ]);

        return { previous: previous ?? undefined, next: next ?? undefined };
      } catch {
        return { previous: undefined, next: undefined };
      }
    },
    [CacheKey.PREV_NEXT_VIDEO_BY_ID, videoId],
    {
      revalidate: REVALIDATE_TIME,
      tags: [CacheKey.PREV_NEXT_VIDEO_BY_ID]
    }
  )();

const getVideosByShow = (showId: string): Promise<TVideo[]> =>
  unstable_cache(
    async () => {
      try {
        const pb = await getPb();

        const videos = await pb.collection('videos').getFullList<TVideo>({
          filter: `show="${showId}"`,
          sort: 'created'
        });

        return videos;
      } catch {
        return [];
      }
    },
    [CacheKey.VIDEOS_BY_SHOW, showId],
    { revalidate: REVALIDATE_TIME, tags: [CacheKey.VIDEOS_BY_SHOW] }
  )();

const getAllVideos = async (): Promise<TVideo[]> =>
  unstable_cache(
    async () => {
      try {
        const pb = await getPb();
        const videos = await pb.collection('videos').getFullList<TVideo>({
          expand: 'show',
          sort: 'created'
        });
        return videos;
      } catch {
        return [];
      }
    },
    [CacheKey.ALL_VIDEOS],
    {
      revalidate: REVALIDATE_TIME,
      tags: [CacheKey.ALL_VIDEOS]
    }
  )();

export {
  getAllVideos,
  getPreviousAndNextVideoById,
  getVideoById,
  getVideosByShow
};
