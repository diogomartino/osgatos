import { getPb } from '@/helpers/pb';
import { CacheKey, REVALIDATE_TIME } from '@/statics';
import { TVideo, TVideoListItem } from '@/types/db';
import { unstable_cache } from 'next/cache';
import 'server-only';

const getVideoById = async (id: string): Promise<TVideo | undefined> =>
  unstable_cache(
    async () => {
      try {
        const pb = await getPb();

        const video = await pb
          .collection('videos')
          .getFirstListItem<TVideo>(`id="${id}" && show.public=true`);

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

const LIST_FIELDS = [
  'id',
  'collectionId',
  'show',
  'thumbnail',
  'index',
  'title',
  'slug',
  'videoUrl',
  'duration',
  'isSpecial',
  'created',
  'updated',
  'transcriptFinal:excerpt(1)'
].join(',');

const getVideosByShow = (showId: string): Promise<TVideoListItem[]> =>
  unstable_cache(
    async () => {
      try {
        const pb = await getPb();

        const videos = await pb
          .collection('videos')
          .getFullList<TVideoListItem>({
            filter: `show="${showId}" && show.public=true`,
            sort: 'created',
            fields: LIST_FIELDS
          });

        return videos;
      } catch {
        return [];
      }
    },
    [CacheKey.VIDEOS_BY_SHOW, showId],
    { revalidate: REVALIDATE_TIME, tags: [CacheKey.VIDEOS_BY_SHOW] }
  )();

// this one is uncached because it's hitting the nextjs hard limit of 2mb
const getAllVideos = async (): Promise<TVideo[]> => {
  try {
    const pb = await getPb();

    const videos = await pb.collection('videos').getFullList<TVideo>({
      expand: 'show',
      filter: 'show.public=true',
      sort: 'created'
    });

    return videos;
  } catch {
    return [];
  }
};

export { getAllVideos, getVideoById, getVideosByShow };
