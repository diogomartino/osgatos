import Link from 'next/link';
import { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="w-full flex items-center justify-center py-3 mt-4">
      <span className="text-[10px] text-white/60">
        Todo o material é disponibilizado para fins educacionais e de
        preservação cultural, sem fins lucrativos
      </span>
      <div className="mx-2 h-3 border-l border-white/20" />
      <Link
        href="https://github.com/diogomartino/osgatos"
        target="_blank"
        className="text-[10px] text-white/60 hover:text-white transition-colors"
      >
        Github
      </Link>
    </footer>
  );
});
Footer.displayName = 'Footer';

export { Footer };
