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
    const transcript =
      video.transcriptFinal || video.transcriptv2 || video.transcript || '';
    const sentences = transcript ? transcript.split(/[.!?]\s+/) : [];

    const baseSearchData = {
      ...video,
      searchTitle: normalize(video.title),
      searchShow: normalize(video.expand?.show?.title ?? '')
    };

    if (sentences.length === 0) {
      return [
        {
          ...baseSearchData,
          searchChunk: '',
          chunkId: 0
        }
      ];
    }

    return sentences.map((sentence, idx) => ({
      ...baseSearchData,
      searchChunk: normalize(sentence),
      chunkId: idx
    }));
  });

const options: IFuseOptions<ReturnType<typeof buildSearchData>[0]> = {
  includeScore: true,
  shouldSort: true,
  keys: [
    { name: 'searchTitle', weight: 0.75 },
    { name: 'searchShow', weight: 0.15 },
    { name: 'searchChunk', weight: 0.1 }
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
