import NextImage from 'next/image';
import { memo } from 'react';

type TPosterProps = {
  title: string;
  imageUrl: string;
};

const Poster = memo(({ title, imageUrl }: TPosterProps) => {
  return (
    <div className="group relative flex h-[190px] w-[140px] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-md bg-black shadow-2xl transition-transform duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] md:h-[315px] md:w-[210px] lg:h-[400px] lg:w-[300px]">
      <NextImage
        src={imageUrl}
        alt="TV Show Poster"
        fill
        className="object-cover object-center transition-opacity duration-300 group-hover:opacity-90"
        sizes="(max-width: 768px) 140px, (max-width: 1024px) 210px, 300px"
        priority
        fetchPriority="high"
        quality={60}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />
      <div className="relative w-full p-5 text-center">
        <h2 className="mb-3 rounded bg-zinc-800/40 px-2 py-0.5 text-sm font-bold text-white drop-shadow transition-colors duration-300 lg:text-xl">
          {title}
        </h2>
      </div>
    </div>
  );
});
Poster.displayName = 'Poster';

export { Poster };
