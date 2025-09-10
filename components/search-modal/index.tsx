'use client';

import type { TVideo } from '@/types/db';
import { Input } from '@heroui/input';
import { Modal, ModalContent } from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import { debounce } from 'lodash';
import { HelpCircle, Search } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useModalHistory } from './hooks';
import { MenuItem } from './menu-item';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SearchModal = memo(() => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useModalHistory(open, () => setOpen(false));

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
    },
    [debouncedSetSearch]
  );

  const onInputClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(true);
  }, []);

  const onItemClick = useCallback((item: TVideo) => {
    window.location.href = `/watch/${item.id}`;

    setOpen(false);
  }, []);

  const { data, isLoading } = useSWR<TVideo[]>(
    debouncedSearch
      ? `/api/search?q=${encodeURIComponent(debouncedSearch)}`
      : null,
    fetcher
  );

  return (
    <div className="flex w-full justify-center">
      <Input
        className="w-full lg:w-[400px]"
        readOnly
        placeholder="Clica aqui para procurar..."
        onClick={onInputClick}
        endContent={<Search className="text-zinc-400" size="1rem" />}
      />

      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        size="lg"
        className="bg-background p-0"
        hideCloseButton
        backdrop="blur"
      >
        <ModalContent className="flex items-center justify-center p-0">
          <div className="bg-background text-foreground fixed inset-0 flex h-screen max-h-screen w-full max-w-full flex-col shadow-lg sm:static sm:h-[600px] sm:max-h-[600px] sm:w-[480px] sm:rounded-xl">
            <div className="flex w-full items-center">
              <Input
                autoFocus
                placeholder="Procura um sketch..."
                value={search}
                onValueChange={onValueChange}
                className="w-full p-4 text-base sm:text-lg"
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
            <div className="max-h-[calc(100vh-64px)] min-h-[200px] flex-1 overflow-y-auto sm:max-h-[536px]">
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

              <div className="flex flex-col gap-2">
                {data?.map((item) => (
                  <MenuItem item={item} key={item.id} onClick={onItemClick} />
                ))}
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
});
SearchModal.displayName = 'SearchModal';

export { SearchModal };
