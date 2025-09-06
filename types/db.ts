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
  created: Date;
  updated: Date;
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
  created: Date;
  updated: Date;
  public: boolean;
};

export type { TShow, TVideo };
