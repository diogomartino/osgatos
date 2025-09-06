import { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="w-full flex items-center justify-center py-3">
      <span className="text-[10px] text-white/60">
        Todo o material é disponibilizado para fins educacionais e de
        preservação cultural, sem fins lucrativos.
      </span>
    </footer>
  );
});
Footer.displayName = 'Footer';

export { Footer };
