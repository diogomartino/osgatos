'use client';

import type { TVideo } from '@/types/db';
import { Input } from '@heroui/input';
import { Kbd } from '@heroui/kbd';
import { Modal, ModalContent } from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import { debounce } from 'lodash';
import { HelpCircle, Search } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { MenuItem } from './menu-item';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SearchModal = memo(() => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
      }, 400),
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

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Keyboard navigation inside results
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!data || data.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % data.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((i) => (i - 1 + data.length) % data.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const item = data[highlightedIndex];
        if (item) {
          window.location.href = `/watch/${item.id}`;
          setOpen(false);
        }
      }
    },
    [data, highlightedIndex]
  );

  return (
    <div className="w-full">
      <Input
        readOnly
        placeholder="Clica aqui para pesquisar..."
        onClick={() => setOpen(true)}
        endContent={
          /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? (
            <Kbd keys={['command']}>K</Kbd>
          ) : (
            <Kbd keys={['ctrl']}>K</Kbd>
          )
        }
      />

      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        size="lg"
        className="p-0 bg-background"
        hideCloseButton
        backdrop="blur"
      >
        <ModalContent className="p-0 flex items-center justify-center">
          <div className="w-full h-screen sm:h-[600px] sm:w-[480px] sm:rounded-xl bg-background text-foreground shadow-lg flex flex-col fixed inset-0 sm:static max-w-full max-h-screen sm:max-h-[600px]">
            <div className="flex items-center w-full">
              <Input
                autoFocus
                placeholder="Procura um sketch..."
                value={search}
                onValueChange={setSearch}
                onKeyDown={handleKeyDown}
                className="p-4 w-full text-base sm:text-lg"
                endContent={<Search className="text-zinc-400" size="1rem" />}
              />

              <Tooltip
                content="Podes pesquisar pelo nome do sketch ou por alguma palavra/frase proferida dentro do sketch. Experimenta 'ratazana'."
                placement="top"
                closeDelay={100}
              >
                <HelpCircle className="text-zinc-400" size="0.9rem" />
              </Tooltip>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[calc(100vh-64px)] sm:max-h-[536px]">
              {isLoading && (
                <div className="p-4 text-center text-sm text-zinc-400">
                  A carregar resultados...
                </div>
              )}

              {!isLoading && data?.length === 0 && (
                <div className="p-4 text-center text-sm text-zinc-400">
                  Sem resultados.
                </div>
              )}

              {data?.map((item, i) => (
                <div
                  key={item.id}
                  className={`cursor-pointer px-4 py-3 sm:px-2 sm:py-2 ${i === highlightedIndex ? 'bg-zinc-800' : ''}`}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onClick={() => {
                    window.location.href = `/watch/${item.id}`;
                    setOpen(false);
                  }}
                >
                  <MenuItem item={item} />
                </div>
              ))}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
});
SearchModal.displayName = 'SearchModal';

export { SearchModal };
