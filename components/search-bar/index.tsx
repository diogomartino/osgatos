'use client';

import type { TVideo } from '@/types/db';
import { Input } from '@heroui/input';
import { debounce } from 'lodash';
import { Search, X } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { MenuItem } from './menu-item';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SearchBar = memo(() => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
      }, 400),
    []
  );

  const onValueChange = useCallback(
    (val: string) => {
      setSearch(val);
      debouncedSetSearch(val);
      setIsOpen(val.length > 0);
    },
    [debouncedSetSearch]
  );

  const onClearSearch = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setIsOpen(false);
  }, []);

  const onItemClick = useCallback((item: TVideo) => {
    window.location.href = `/watch/${item.id}`;
    setSearch('');
    setIsOpen(false);
  }, []);

  const { data, isLoading } = useSWR<TVideo[]>(
    debouncedSearch
      ? `/api/search?q=${encodeURIComponent(debouncedSearch)}`
      : null,
    fetcher
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[600px] lg:max-w-[500px]"
    >
      <Input
        placeholder="Procura um sketch..."
        value={search}
        onValueChange={onValueChange}
        onFocus={() => search.length > 0 && setIsOpen(true)}
        className="w-full"
        classNames={{
          input: 'text-sm lg:text-base',
          inputWrapper: 'bg-default-100'
        }}
        endContent={
          isOpen ? (
            <X
              className="text-foreground/60 hover:text-foreground/80 cursor-pointer transition-colors"
              size="1rem"
              onClick={onClearSearch}
            />
          ) : (
            <Search className="text-foreground/60" size="1rem" />
          )
        }
      />

      {isOpen && (
        <div className="border-divider bg-content1 absolute top-full left-0 z-50 mt-2 w-full rounded-lg border shadow-lg">
          <div className="max-h-[70vh] overflow-y-auto lg:max-h-[500px]">
            {isLoading && (
              <div className="text-foreground/60 p-4 text-center text-sm">
                A carregar resultados...
              </div>
            )}

            {!isLoading && data?.length === 0 && (
              <div className="text-foreground/60 p-4 text-center text-sm">
                Sem resultados.
              </div>
            )}

            {!isLoading && data && data.length > 0 && (
              <div className="flex flex-col gap-1 p-2">
                {data.map((item) => (
                  <MenuItem item={item} key={item.id} onClick={onItemClick} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
SearchBar.displayName = 'SearchBar';

export { SearchBar };
