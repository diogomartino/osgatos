import NextImage from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

type TPosterProps = {
  title: string;
  imageUrl: string;
  href: string;
  priority?: boolean;
};

const Poster = memo(({ title, imageUrl, href, priority }: TPosterProps) => {
  return (
    <Link
      href={href}
      className="group block h-full"
      data-interactive="true"
      aria-label={`Abrir a série ${title}`}
    >
      <article className="bg-content2 shadow-soft ease-editorial relative h-full overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-[1.02]">
        <div className="absolute inset-0 z-10 border border-white/8 opacity-70" />
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <NextImage
            src={imageUrl}
            alt={`Capa da série ${title}`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
            priority={priority}
            fetchPriority="high"
            quality={60}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90" />
          <div className="absolute inset-x-0 bottom-0 z-20 p-3 md:p-4">
            <h3 className="ease-editorial group-hover:text-primary text-base leading-[1.05] text-white transition-colors duration-200 md:text-lg">
              {title}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  );
});
Poster.displayName = 'Poster';

export { Poster };
