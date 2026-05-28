import { Button } from '@heroui/button';
import Image from 'next/image';
import Link from 'next/link';
import notFoundGif from '../public/notfound.gif';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="text-7xl md:text-8xl">404</span>
        <h1 className="text-2xl md:text-3xl">Essa página não existe.</h1>
      </div>
      <Image src={notFoundGif} alt="" width={300} height={300} />
      <Link href="/">
        <Button size="sm" radius="full">
          Voltar para a página inicial
        </Button>
      </Link>
    </div>
  );
}
