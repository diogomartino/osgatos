import Link from 'next/link';
import { memo } from 'react';
import { SearchBar } from '../search-bar';

const Topbar = memo(() => {
  return (
    <nav className="border-divider bg-background w-full border-b">
      <div className="flex w-full items-center gap-4 px-4 py-3 lg:px-8">
        <div className="min-w-fit lg:min-w-[200px]">
          <Link className="text-xl font-bold lg:text-2xl" href="/">
            <span className="hidden lg:inline">
              OsGatos<span className="text-xs">.net</span>
            </span>
            <span className="lg:hidden">OG</span>
          </Link>
        </div>

        <div className="flex flex-1 justify-center">
          <SearchBar />
        </div>

        <div className="hidden lg:block lg:min-w-[200px]" />
      </div>
    </nav>
  );
});

Topbar.displayName = 'Topbar';

export { Topbar };
