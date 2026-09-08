import { toVideoCard } from '@/helpers/to-video-card';
import { getAllVideos } from '@/queries/videos';
import { REVALIDATE_TIME } from '@/statics';
import { TVideo, TVideoCard } from '@/types/db';
import Fuse, { IFuseOptions } from 'fuse.js';
import 'server-only';

const MAX_RESULTS = 24;

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

type TEntry = {
  video: TVideo;
  searchTitle: string;
  searchShow: string;
  chunk: string;
  searchChunk: string;
};

const buildEntries = (videos: TVideo[]): TEntry[] =>
  videos.flatMap((video) => {
    const base = {
      video,
      searchTitle: normalize(video.title),
      searchShow: normalize(video.expand?.show?.title ?? '')
    };

    const transcript =
      video.transcriptFinal || video.transcriptv2 || video.transcript || '';
    const sentences = transcript
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    if (sentences.length === 0) {
      return [{ ...base, chunk: '', searchChunk: '' }];
    }

    return sentences.map((chunk) => ({
      ...base,
      chunk,
      searchChunk: normalize(chunk)
    }));
  });

const options: IFuseOptions<TEntry> = {
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

let cache: { fuse: Fuse<TEntry>; videos: TVideo[]; builtAt: number } | null =
  null;

const getIndex = async () => {
  if (cache && Date.now() - cache.builtAt < REVALIDATE_TIME * 1000) {
    return cache;
  }

  const videos = await getAllVideos();

  cache = {
    fuse: new Fuse(buildEntries(videos), options),
    videos,
    builtAt: Date.now()
  };

  return cache;
};

const clearSearchIndex = () => {
  cache = null;
};

const MAX_QUERY_LENGTH = 200;

const searchVideos = async (rawQuery: string): Promise<TVideoCard[]> => {
  const query = rawQuery.trim().slice(0, MAX_QUERY_LENGTH);
  const { fuse, videos } = await getIndex();

  if (!query)
    return videos.slice(0, MAX_RESULTS).map((video) => toVideoCard(video));

  const normalized = normalize(query);
  const seen = new Set<string>();
  const results: TVideoCard[] = [];

  for (const { item } of fuse.search(normalized)) {
    if (seen.has(item.video.id)) continue;

    seen.add(item.video.id);

    const matchedTitle = item.searchTitle.includes(normalized);

    results.push(
      toVideoCard(item.video, null, matchedTitle ? null : item.chunk || null)
    );

    if (results.length === MAX_RESULTS) break;
  }

  return results;
};

export { clearSearchIndex, searchVideos };
