import { getFileUrl } from '@/helpers/get-file-url';
import type { TVideo } from '@/types/db';
import NextImage from 'next/image';
import { memo } from 'react';

type TMenuItemProps = {
  item: TVideo;
  onClick?: (item: TVideo) => void;
};

const MenuItem = memo(({ item, onClick }: TMenuItemProps) => {
  return (
    <div
      className="group flex h-16 min-h-[64px] w-full cursor-pointer items-center rounded transition-colors hover:bg-zinc-800"
      onClick={() => onClick?.(item)}
    >
      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
        <NextImage
          src={getFileUrl(item, item.thumbnail)}
          alt={item.title}
          fill
          className="absolute inset-0 object-cover object-center"
          sizes="96px"
          quality={40}
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 pl-4">
        <span className="line-clamp-2 text-sm font-medium text-white">
          {item.title}
        </span>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-400">
            {Math.floor(item.duration / 60)}:
            {(item.duration % 60).toString().padStart(2, '0')}
          </span>
          {item.expand?.show?.title && (
            <span className="max-w-[10rem] truncate text-xs text-zinc-500 italic">
              Série {item.expand.show.title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
MenuItem.displayName = 'MenuItem';

export { MenuItem };
