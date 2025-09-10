import { getAllVideos } from '@/queries/videos';
import { TVideo } from '@/types/db';
import Fuse, { IFuseOptions } from 'fuse.js';

const MAX_RESULTS = 20;

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const buildSearchData = (videos: TVideo[]) =>
  videos.flatMap((video) => {
    const sentences = video.transcript
      ? video.transcript.split(/[.!?]\s+/)
      : [];

    return sentences.map((sentence, idx) => ({
      ...video,
      searchChunk: normalize(sentence),
      chunkId: idx
    }));
  });

const options: IFuseOptions<ReturnType<typeof buildSearchData>[0]> = {
  includeScore: true,
  shouldSort: true,
  keys: [
    { name: 'title', weight: 0.8 },
    { name: 'searchChunk', weight: 0.2 }
  ],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 3,
  distance: 30,
  findAllMatches: false
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  const videos = await getAllVideos();

  if (!query) {
    return Response.json(videos.slice(0, 20));
  }

  const searchData = buildSearchData(videos);

  const seen = new Set<string>();
  const fuse = new Fuse(searchData, options);

  const results = fuse.search(normalize(query));

  const filteredVideos = results
    .map((r) => r.item)
    .filter((item) => {
      if (seen.has(item.id)) return false;

      seen.add(item.id);

      return true;
    });

  return Response.json(filteredVideos.slice(0, MAX_RESULTS));
}
