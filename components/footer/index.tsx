import Link from 'next/link';
import { memo } from 'react';

const Separator = () => (
  <div className="hidden lg:block mx-2 h-3 border-l border-white/20" />
);

const Footer = memo(() => {
  return (
    <footer className="flex flex-col lg:flex-row items-center justify-center w-full py-3 mt-4">
      <span className="text-[10px] text-white/60 text-center">
        Todo o material é disponibilizado para fins educacionais e de
        preservação cultural, sem fins lucrativos
      </span>
      <Separator />
      <Link
        href="https://github.com/diogomartino/osgatos"
        target="_blank"
        className="text-[10px] text-white/60 hover:text-white transition-colors"
      >
        Github
      </Link>
      <Separator />
      <Link
        href="mailto:geral@osgatos.net"
        target="_blank"
        className="text-[10px] text-white/60 hover:text-white transition-colors"
      >
        Contacto
      </Link>
    </footer>
  );
});
Footer.displayName = 'Footer';

export { Footer };
