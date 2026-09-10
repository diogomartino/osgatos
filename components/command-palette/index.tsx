'use client';

import { track } from '@/helpers/track';
import type { TVideoCard } from '@/types/db';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { VideoRow } from '../video-row';

const fetcher = async (url: string): Promise<TVideoCard[]> => {
  const response = await fetch(url);

  if (!response.ok) throw new Error('Search request failed');

  return response.json();
};

const useDebounced = (value: string, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

const CommandPalette = () => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const movedSelection = useRef(false);
  const debouncedQuery = useDebounced(query);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    }

    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen((open) => !open);
      }

      // <dialog> self-closes only on a real UA close request; keep state in sync.
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const { data, error, isLoading } = useSWR<TVideoCard[]>(
    debouncedQuery
      ? `/api/search?q=${encodeURIComponent(debouncedQuery)}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
      onSuccess(results) {
        track('search', { query: debouncedQuery, results: results.length });
      }
    }
  );

  const go = useCallback(
    (href: string) => {
      setIsOpen(false);
      setQuery('');
      router.push(href);
    },
    [router]
  );

  const results = data ?? [];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Procurar sketches"
        className="hairline bg-content1 text-default-500 hover:bg-content2 hover:text-foreground flex h-10 w-full max-w-[26rem] items-center gap-2.5 rounded-full px-4 text-sm"
      >
        <Search size="0.95rem" />
        <span className="flex-1 truncate text-left">
          Procura uma fala, um sketch...
        </span>
        <kbd className="hairline text-default-500 hidden rounded px-1.5 py-0.5 text-[0.65rem] lg:inline">
          ⌘K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Procurar sketches"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setIsOpen(false);
        }}
        className="hairline bg-content1 shadow-lift m-0 mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-xl p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {isOpen ? (
          <Command
            shouldFilter={false}
            loop
            label="Procurar sketches"
            className="flex max-h-[70vh] flex-col"
          >
            <div className="border-divider flex items-center gap-3 border-b px-4">
              <Search size="1rem" className="text-default-500 shrink-0" />
              <Command.Input
                ref={inputRef}
                value={query}
                onValueChange={(value) => {
                  movedSelection.current = false;
                  setQuery(value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    movedSelection.current = true;

                    return;
                  }

                  if (
                    event.key === 'Enter' &&
                    !movedSelection.current &&
                    query.trim()
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                    track('search-see-all', {
                      query: query.trim(),
                      results: results.length,
                      via: 'enter'
                    });
                    go(`/search?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
                placeholder="Procura uma fala, um sketch..."
                className="text-foreground placeholder:text-default-500 h-14 w-full bg-transparent text-base outline-none"
              />
            </div>

            <Command.List className="overflow-y-auto p-2">
              {!query ? (
                <div className="text-default-500 p-6 text-center text-sm">
                  Procura pelo título do sketch ou por uma frase dita nele.
                </div>
              ) : null}

              {query && isLoading && results.length === 0 ? (
                <div className="text-default-500 p-6 text-center text-sm">
                  A procurar...
                </div>
              ) : null}

              {error ? (
                <div className="text-default-500 p-6 text-center text-sm">
                  Não foi possível procurar agora.
                </div>
              ) : null}

              {query && !isLoading && !error && results.length === 0 ? (
                <Command.Empty className="text-default-500 p-6 text-center text-sm">
                  Sem resultados para “{query}”.
                </Command.Empty>
              ) : null}

              {results.map((video, index) => (
                <Command.Item
                  key={video.id}
                  value={video.id}
                  onSelect={() => {
                    track('search-select', {
                      query,
                      videoId: video.id,
                      position: index + 1,
                      // Whether the transcript, rather than the title, matched.
                      viaTranscript: Boolean(video.snippet)
                    });
                    go(`/watch/${video.id}`);
                  }}
                  className="data-[selected=true]:bg-content2 cursor-pointer rounded-md p-2"
                >
                  <VideoRow video={video} />
                </Command.Item>
              ))}

              {results.length > 0 ? (
                <Command.Item
                  value="__all"
                  onSelect={() => {
                    track('search-see-all', { query, results: results.length });
                    go(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="eyebrow text-primary data-[selected=true]:bg-content2 mt-1 cursor-pointer rounded-md px-3 py-3"
                >
                  Ver todos os resultados
                </Command.Item>
              ) : null}
            </Command.List>
          </Command>
        ) : null}
      </dialog>
    </>
  );
};

export { CommandPalette };
