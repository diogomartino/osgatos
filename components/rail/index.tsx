'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { memo, ReactNode, useCallback, useEffect, useState } from 'react';

type TRailProps = {
  title: string;
  href?: string;
  children: ReactNode;
};

const Rail = memo(({ title, href, children }: TRailProps) => {
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    slidesToScroll: 'auto'
  });
  const [edges, setEdges] = useState({ prev: false, next: false });

  const update = useCallback(() => {
    if (!embla) return;

    setEdges({ prev: embla.canScrollPrev(), next: embla.canScrollNext() });
  }, [embla]);

  useEffect(() => {
    if (!embla) return;

    update();
    embla.on('select', update).on('reInit', update).on('scroll', update);

    return () => {
      embla.off('select', update).off('reInit', update).off('scroll', update);
    };
  }, [embla, update]);

  const heading = (
    <>
      <span className="text-foreground text-lg md:text-xl">{title}</span>
      {href ? (
        <ChevronRight
          size="1.1rem"
          className="text-default-500 group-hover:text-primary transition-transform duration-200 group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );

  const arrow =
    'hairline bg-background/80 text-foreground hover:bg-content2 hover:border-primary/50 absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm md:inline-flex';

  return (
    <section aria-label={title} className="flex min-w-0 flex-col gap-3">
      <h2 className="shell">
        {href ? (
          <Link
            href={href}
            className="group hover:text-primary inline-flex items-center gap-1.5"
          >
            {heading}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5">{heading}</span>
        )}
      </h2>

      <div className="shell">
        <div className="relative">
          <div
            ref={emblaRef}
            className="rail"
            data-fade-start={edges.prev ? 'true' : undefined}
            data-fade-end={edges.next ? 'true' : undefined}
          >
            <ul className="rail-track">{children}</ul>
          </div>

          {edges.prev ? (
            <button
              type="button"
              aria-label={`${title}: ver anteriores`}
              onClick={() => embla?.scrollPrev()}
              className={`${arrow} left-0 -translate-x-1/2`}
            >
              <ChevronLeft size="1.2rem" />
            </button>
          ) : null}

          {edges.next ? (
            <button
              type="button"
              aria-label={`${title}: ver mais`}
              onClick={() => embla?.scrollNext()}
              className={`${arrow} right-0 translate-x-1/2`}
            >
              <ChevronRight size="1.2rem" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
});
Rail.displayName = 'Rail';

export { Rail };
