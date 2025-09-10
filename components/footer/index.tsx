import Link from 'next/link';
import { memo } from 'react';

const Separator = () => (
  <div className="mx-2 hidden h-3 border-l border-white/20 lg:block" />
);

const Footer = memo(() => {
  return (
    <footer className="mt-4 flex w-full flex-col items-center justify-center py-3 lg:flex-row">
      <span className="text-center text-[10px] text-white/60">
        Todo o material é disponibilizado para fins educacionais e de
        preservação cultural, sem fins lucrativos
      </span>
      <Separator />
      <Link
        href="https://github.com/diogomartino/osgatos"
        target="_blank"
        className="text-[10px] text-white/60 transition-colors hover:text-white"
      >
        Github
      </Link>
      <Separator />
      <Link
        href="mailto:geral@osgatos.net"
        target="_blank"
        className="text-[10px] text-white/60 transition-colors hover:text-white"
      >
        Contacto
      </Link>
    </footer>
  );
});
Footer.displayName = 'Footer';

export { Footer };
