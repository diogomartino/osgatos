import Link from 'next/link';
import { memo } from 'react';
import { SearchBar } from '../search-bar';

const Topbar = memo(() => {
  return (
    <header className="bg-background/88 sticky top-0 z-40 w-full border-b border-white/8 backdrop-blur-xl">
      <nav
        className="mx-auto grid w-full max-w-[100rem] gap-3 px-4 py-4 md:px-6 lg:grid-cols-[1fr_minmax(18rem,26rem)_1fr] lg:items-center lg:px-8"
        aria-label="Principal"
      >
        <div className="min-w-0 lg:justify-self-start">
          <Link
            className="group inline-flex max-w-full items-end"
            href="/"
            data-interactive="true"
          >
            <span className="font-display text-foreground truncate text-[1.6rem] font-extrabold tracking-[-0.08em] uppercase md:text-[2.15rem] md:leading-none">
              Os <span className="text-primary">Gatos</span>
            </span>
          </Link>
        </div>

        <div className="flex justify-center lg:col-start-2 lg:justify-center">
          <SearchBar />
        </div>

        <div className="hidden lg:block" />
      </nav>
    </header>
  );
});

Topbar.displayName = 'Topbar';

export { Topbar };
