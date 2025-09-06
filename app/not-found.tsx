import { Button } from '@heroui/button';
import Image from 'next/image';
import Link from 'next/link';
import notFoundGif from '../public/notfound.gif';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full">
      <div className="flex flex-col items-center justify-center">
        <span className="text-8xl font-bold">404</span>
        <span className="text-sm">Essa página não existe.</span>
      </div>
      <Image src={notFoundGif} alt="404" width={300} height={300} />
      <Link href="/">
        <Button size="sm">Voltar para a página inicial</Button>
      </Link>
    </div>
  );
}
