'use client';

import { getFileUrl } from '@/helpers/get-file-url';
import type { TVideo } from '@/types/db';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { debounce } from 'lodash';
import NextImage from 'next/image';
import Link from 'next/link';
import { memo, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const helpStr = `Procura sketches aqui. Podes pesquisar pelo nome do sketch ou por alguma palavra/frase proferida dentro do sketch. Experimenta 'ratazana'.`;

const VideoSearch = memo(() => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  const { data, isLoading } = useSWR<TVideo[]>(
    debouncedSearch
      ? `/api/search?q=${encodeURIComponent(debouncedSearch)}`
      : null,
    fetcher
  );

  return (
    <div className="flex items-center gap-4 w-full">
      <Autocomplete
        className="w-full"
        defaultItems={[]}
        items={data}
        isLoading={isLoading}
        placeholder="Procura sketches aqui..."
        variant="bordered"
        listboxProps={{
          emptyContent: !search ? helpStr : 'Sem resultados.'
        }}
        inputValue={search}
        onInputChange={setSearch}
        maxListboxHeight={600}
      >
        {(item) => (
          <AutocompleteItem
            key={item.id}
            as={Link}
            href={`/watch/${item.id}`}
            className="px-2 py-2 rounded group hover:bg-zinc-900/80 transition min-h-[64px] w-full"
          >
            <div className="flex w-full h-16 items-center">
              <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0 bg-zinc-800">
                <NextImage
                  src={getFileUrl(item, item.thumbnail)}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:opacity-90 transition absolute inset-0"
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
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
});
VideoSearch.displayName = 'VideoSearch';

export { VideoSearch };
