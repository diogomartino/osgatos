const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;

  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const shuffle = <T>(items: T[], seed?: number): T[] => {
  const out = [...items];
  const random = seed === undefined ? Math.random : seededRandom(seed);

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
};

const dailySeed = () => Math.floor(Date.now() / 86_400_000);

const sample = <T>(items: T[], count: number, offset: number): T[] =>
  shuffle(items, dailySeed() + offset).slice(0, count);

export { dailySeed, sample, shuffle };
