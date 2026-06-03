import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="mx-auto mt-auto flex w-full max-w-[100rem] flex-col gap-4 px-4 pt-12 pb-6 md:px-6 lg:px-8 lg:pb-8">
      <div className="flex flex-col gap-4 border-t border-white/8 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-default-500 max-w-4xl text-xs">
          Este site não é oficial dos Gato Fedorento. Todo o material é
          disponibilizado para fins educacionais e de preservação cultural, sem
          fins lucrativos
        </p>

        <div className="text-default-500 flex flex-wrap items-center gap-1 text-xs">
          <Link href="/about" className="hover:text-foreground px-2 py-1">
            Sobre
          </Link>
          <Link
            href="/help-transcriptions"
            className="hover:text-foreground px-2 py-1"
          >
            Transcrições
          </Link>
          <Link
            href="https://www.reddit.com/r/gatofedorento"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground px-2 py-1"
          >
            Reddit
          </Link>
          <Link
            href="https://github.com/diogomartino/osgatos"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground px-2 py-1"
          >
            Github
          </Link>
          <Link
            href="mailto:geral@osgatos.net"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground px-2 py-1"
          >
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
