import Link from 'next/link';
import { memo } from 'react';

const Separator = () => (
  <div className="border-foreground/20 mx-2 hidden h-3 border-l lg:block" />
);

const Footer = memo(() => {
  return (
    <footer className="mt-6 flex w-full flex-col items-center justify-center gap-2 py-4 lg:flex-row">
      <span className="text-foreground/60 text-center text-xs">
        Este site não é oficial dos Gato Fedorento. Todo o material é
        disponibilizado para fins educacionais e de preservação cultural, sem
        fins lucrativos
      </span>
      <Separator />
      <Link
        href="https://github.com/diogomartino/osgatos"
        target="_blank"
        className="text-foreground/60 hover:text-foreground text-xs transition-colors"
      >
        Github
      </Link>
      <Separator />
      <Link
        href="mailto:geral@osgatos.net"
        target="_blank"
        className="text-foreground/60 hover:text-foreground text-xs transition-colors"
      >
        Contacto
      </Link>
    </footer>
  );
});
Footer.displayName = 'Footer';

export { Footer };
