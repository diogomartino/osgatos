import Image from 'next/image';
import Link from 'next/link';
import notFoundGif from '../public/notfound.gif';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="text-7xl md:text-8xl">404</span>
        <h1 className="text-2xl md:text-3xl">Essa página não existe.</h1>
      </div>
      <Image src={notFoundGif} alt="" width={280} height={280} priority />
      <Link
        href="/"
        className="bg-foreground text-background inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold hover:opacity-90"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
