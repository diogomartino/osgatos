import { TShow, TVideoCard, TVideoListItem } from '@/types/db';

const toVideoCard = (
  video: TVideoListItem,
  show?: TShow | null,
  snippet?: string | null
): TVideoCard => ({
  id: video.id,
  collectionId: video.collectionId,
  title: video.title,
  thumbnail: video.thumbnail,
  duration: video.duration,
  hasFinalTranscript: Boolean(video.transcriptFinal?.trim()),
  showTitle: (show ?? video.expand?.show)?.title ?? null,
  snippet: snippet ?? null
});

export { toVideoCard };
