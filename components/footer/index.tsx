import Link from 'next/link';
import { memo } from 'react';

const Separator = () => (
  <div className="mx-2 hidden h-3 border-l border-foreground/20 lg:block" />
);

const Footer = memo(() => {
  return (
    <footer className="mt-6 flex w-full flex-col items-center justify-center gap-2 py-4 lg:flex-row">
      <span className="text-center text-xs text-foreground/60">
        Todo o material é disponibilizado para fins educacionais e de
        preservação cultural, sem fins lucrativos
      </span>
      <Separator />
      <Link
        href="https://github.com/diogomartino/osgatos"
        target="_blank"
        className="text-xs text-foreground/60 transition-colors hover:text-foreground"
      >
        Github
      </Link>
      <Separator />
      <Link
        href="mailto:geral@osgatos.net"
        target="_blank"
        className="text-xs text-foreground/60 transition-colors hover:text-foreground"
      >
        Contacto
      </Link>
    </footer>
  );
});
Footer.displayName = 'Footer';

export { Footer };
