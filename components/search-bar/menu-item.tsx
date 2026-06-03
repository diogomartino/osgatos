import { getFileUrl } from '@/helpers/get-file-url';
import type { TVideo } from '@/types/db';
import NextImage from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

type TMenuItemProps = {
  item: TVideo;
  onClick?: () => void;
};

const MenuItem = memo(({ item, onClick }: TMenuItemProps) => {
  const minutes = Math.floor(item.duration / 60);
  const seconds = (item.duration % 60).toString().padStart(2, '0');

  return (
    <Link
      href={`/watch/${item.id}`}
      className="group flex min-h-[4.75rem] w-full items-center gap-3 px-3 py-2.5 hover:bg-white/4"
      onClick={onClick}
      data-interactive="true"
    >
      <div className="bg-content2 relative h-[4rem] w-[6.25rem] flex-shrink-0 overflow-hidden rounded-md">
        <NextImage
          src={getFileUrl(item, item.thumbnail)}
          alt={`Miniatura do sketch ${item.title}`}
          fill
          className="ease-editorial absolute inset-0 object-cover object-center transition-transform duration-200 group-hover:scale-[1.03]"
          sizes="96px"
          quality={40}
          loading="lazy"
        />
        <span className="absolute right-1.5 bottom-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-white uppercase">
          {minutes}:{seconds}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className="text-foreground ease-editorial group-hover:text-primary line-clamp-2 text-sm transition-colors duration-200 md:text-[0.98rem]">
          {item.title}
        </span>
        <div className="text-default-500 flex items-center gap-2 text-xs">
          {item.expand?.show?.title ? (
            <span className="max-w-[12rem] truncate">
              {item.expand.show.title}
            </span>
          ) : null}
          {item.expand?.show?.title ? (
            <span className="bg-primary h-1 w-1 rounded-full" />
          ) : null}
          <span>
            {minutes}:{seconds}
          </span>
        </div>
      </div>
    </Link>
  );
});
MenuItem.displayName = 'MenuItem';

export { MenuItem };
