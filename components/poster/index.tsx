import NextImage from 'next/image';
import { memo } from 'react';

type TPosterProps = {
  title: string;
  imageUrl: string;
};

const Poster = memo(({ title, imageUrl }: TPosterProps) => {
  return (
    <div className="group w-[140px] cursor-pointer transition-transform duration-200 hover:scale-105 md:w-[210px] lg:w-[280px]">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900 shadow-lg transition-shadow duration-200 hover:shadow-2xl">
        <NextImage
          src={imageUrl}
          alt="TV Show Poster"
          fill
          className="object-cover object-center transition-opacity duration-200 group-hover:opacity-90"
          sizes="(max-width: 768px) 140px, (max-width: 1024px) 210px, 280px"
          priority
          fetchPriority="high"
          quality={60}
        />
      </div>

      <div className="mt-3 text-center">
        <h2 className="text-foreground text-sm font-semibold lg:text-base">
          {title}
        </h2>
      </div>
    </div>
  );
});
Poster.displayName = 'Poster';

export { Poster };
