const sketchesOnly = <T extends { isSpecial: boolean }>(videos: T[]) =>
  videos.filter((video) => !video.isSpecial);

export { sketchesOnly };
