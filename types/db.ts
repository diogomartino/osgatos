type TVideo = {
  id: string;
  collectionId: string;
  show: string;
  thumbnail: string;
  index: number;
  title: string;
  slug: string;
  transcript: string;
  transcriptv2: string | null;
  transcriptFinal: string | null;
  transcriptv2Segments:
    | { duration: number; start: number; text: string }[]
    | null;
  srt: string;
  videoUrl: string;
  duration: number;
  isSpecial: boolean;
  created: string;
  updated: string;
  expand?: {
    show: TShow;
  };
};

type TShow = {
  id: string;
  collectionId: string;
  title: string;
  slug: string;
  cover: string;
  year: number;
  created: string;
  updated: string;
  public: boolean;
};

type TVideoListItem = Omit<
  TVideo,
  'transcript' | 'transcriptv2' | 'transcriptv2Segments' | 'srt'
>;

type TVideoCard = Pick<
  TVideo,
  'id' | 'collectionId' | 'title' | 'thumbnail' | 'duration'
> & {
  transcriptFinal?: string | null;
  hasFinalTranscript?: boolean;
  snippet?: string | null;
  showTitle?: string | null;
};

export type { TShow, TVideo, TVideoCard, TVideoListItem };
