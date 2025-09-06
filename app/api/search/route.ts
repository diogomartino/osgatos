import { getAllVideos } from '@/queries/videos';
import { TVideo } from '@/types/db';
import Fuse, { IFuseOptions } from 'fuse.js';

const options: IFuseOptions<TVideo> = {
  includeScore: true,
  keys: [
    {
      name: 'title',
      weight: 0.7
    },
    {
      name: 'transcript',
      weight: 0.3
    }
  ],
  threshold: 0.5,
  isCaseSensitive: false,
  minMatchCharLength: 1,
  shouldSort: true,
  useExtendedSearch: true
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const videos = await getAllVideos();
  const fuse = new Fuse(videos, options);

  const results = fuse.search(query ? `'${query}` : '');
  const filteredVideos = results
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .map((result) => result.item);

  return Response.json(filteredVideos.slice(0, 20));
}
