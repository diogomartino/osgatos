type TVideo = {
  id: string;
  show: string;
  thumbnail: string;
  index: number;
  title: string;
  slug: string;
  transcript: string;
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
  title: string;
  slug: string;
  cover: string;
  year: number;
  created: string;
  updated: string;
  public: boolean;
};

export type { TShow, TVideo };
