import NextImage from 'next/image';
import { memo } from 'react';

type TPosterProps = {
  title: string;
  imageUrl: string;
};

const Poster = memo(({ title, imageUrl }: TPosterProps) => {
  return (
    <div
      className="
        relative
        w-[140px] h-[190px]
        md:w-[210px] md:h-[315px]
        lg:w-[240px] lg:h-[360px]
        bg-black rounded-md overflow-hidden shadow-2xl flex flex-col items-center justify-end cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] group
      "
      tabIndex={0}
    >
      <NextImage
        src={imageUrl}
        alt="TV Show Poster"
        fill
        className="object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent pointer-events-none" />
      <div className="relative p-5 w-full text-center">
        <h2 className="text-sm lg:text-2xl font-bold text-white drop-shadow mb-3 transition-colors duration-300">
          {title}
        </h2>
      </div>
    </div>
  );
});
Poster.displayName = 'Poster';

export { Poster };
