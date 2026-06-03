'use client';

import type { TUmamiWindow } from '@/types';
import type { TVideo } from '@/types/db';
import { Input } from '@heroui/input';
import { debounce } from 'lodash';
import { Search, X } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { MenuItem } from './menu-item';

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Search request failed');
  }

  return response.json();
};

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

  const onItemClick = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setIsOpen(false);
  }, []);

  const { data, error, isLoading, mutate } = useSWR<TVideo[]>(
    debouncedSearch
      ? `/api/search?q=${encodeURIComponent(debouncedSearch)}`
      : null,
    fetcher,
    {
      onSuccess(_, key) {
        const url = new URL(key, window.location.href);
        const query = url.searchParams.get('q') || '';
        const umami = (window as TUmamiWindow).umami;

        if (umami) {
          umami.track('search', {
            query
          });
        }
      }
    }
  );
  const results = useMemo(() => data ?? [], [data]);

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
    <div ref={containerRef} className="relative w-full max-w-[26rem]">
      <Input
        placeholder="Procura um sketch..."
        value={search}
        onValueChange={onValueChange}
        onFocus={() => search.length > 0 && setIsOpen(true)}
        aria-label="Procurar sketches"
        className="w-full"
        classNames={{
          base: 'data-[hover=true]:opacity-100',
          input:
            'text-sm text-foreground placeholder:text-default-500 md:text-sm',
          inputWrapper:
            'rounded-md border border-white/8 bg-content1 px-3 min-h-11 shadow-none transition-colors duration-200 ease-editorial data-[hover=true]:bg-content2 data-[focus=true]:bg-content2'
        }}
        endContent={
          isOpen ? (
            <button
              type="button"
              aria-label="Limpar pesquisa"
              onClick={onClearSearch}
              className="text-default-500 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-sm"
            >
              <X size="1rem" />
            </button>
          ) : (
            <span className="text-default-500 flex h-8 w-8 items-center justify-center rounded-sm">
              <Search size="0.95rem" />
            </span>
          )
        }
      />

      {isOpen && (
        <div className="bg-content1 shadow-lift absolute top-full right-0 z-50 mt-2 w-full overflow-hidden rounded-md border border-white/8">
          <div className="text-default-500 border-divider flex items-center justify-between border-b px-3 py-2 text-[0.64rem] font-semibold tracking-[0.22em] uppercase">
            <span>Resultados</span>
            {results.length > 0 ? <span>{results.length}</span> : null}
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-2 lg:max-h-[32rem]">
            {isLoading && (
              <div className="text-default-500 p-4 text-center text-sm">
                A carregar resultados...
              </div>
            )}

            {!isLoading && error && (
              <div className="text-default-500 flex flex-col items-center gap-3 p-4 text-center text-sm">
                <span>Não foi possível carregar resultados.</span>
                <button
                  type="button"
                  onClick={() => mutate()}
                  className="text-primary hover:text-primary-400 rounded-sm text-xs font-semibold tracking-[0.18em] uppercase"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!isLoading && !error && data?.length === 0 && (
              <div className="text-default-500 p-4 text-center text-sm">
                Sem resultados.
              </div>
            )}

            {!isLoading && !error && results.length > 0 && (
              <div className="flex flex-col gap-1">
                {results.map((item) => (
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
