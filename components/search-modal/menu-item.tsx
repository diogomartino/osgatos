import { getFileUrl } from '@/helpers/get-file-url';
import type { TVideo } from '@/types/db';
import NextImage from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

type TMenuItemProps = {
  item: TVideo;
  onSelect?: () => void;
};

const MenuItem = memo(({ item, onSelect }: TMenuItemProps) => {
  return (
    <Link
      href={`/watch/${item.id}`}
      className="flex w-full h-16 items-center px-2 py-2 rounded group min-h-[64px]"
      onClick={onSelect}
    >
      <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-zinc-800">
        <NextImage
          src={getFileUrl(item, item.thumbnail)}
          alt={item.title}
          fill
          className="object-cover object-center absolute inset-0"
          sizes="96px"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0 flex-1 pl-4 gap-0.5">
        <span className="text-white font-medium text-sm line-clamp-2">
          {item.title}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-zinc-400 font-mono">
            {Math.floor(item.duration / 60)}:
            {(item.duration % 60).toString().padStart(2, '0')}
          </span>
          {item.expand?.show?.title && (
            <span className="text-xs text-zinc-500 italic truncate max-w-[10rem]">
              Série {item.expand.show.title}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});
MenuItem.displayName = 'MenuItem';

export { MenuItem };
