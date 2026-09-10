import Link from 'next/link';
import { memo } from 'react';
import { CommandPalette } from '../command-palette';

const Topbar = memo(() => (
  <header className="bg-background/85 sticky top-0 z-40 w-full border-b border-white/8 backdrop-blur-xl">
    <nav
      className="shell grid gap-3 py-3.5 lg:grid-cols-[1fr_minmax(18rem,26rem)_1fr] lg:items-center"
      aria-label="Principal"
    >
      <div className="min-w-0 lg:justify-self-start">
        <Link className="group inline-flex max-w-full items-end" href="/">
          <span className="font-display text-foreground truncate text-3xl font-extrabold">
            OS<span className="text-primary">GATOS</span>
            <span className="text-sm">.NET</span>
          </span>
        </Link>
      </div>

      <div className="flex justify-center lg:col-start-2">
        <CommandPalette />
      </div>

      <div className="hidden lg:block" />
    </nav>
  </header>
));
Topbar.displayName = 'Topbar';

export { Topbar };
