'use client';

import { track } from '@/helpers/track';
import { TVideoCard } from '@/types/db';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Grid } from '../grid';

type TSort = 'default' | 'title' | 'shortest' | 'longest';

const SORTS: { value: TSort; label: string }[] = [
  { value: 'default', label: 'Ordem original' },
  { value: 'title', label: 'A-Z' },
  { value: 'shortest', label: 'Mais curtos' },
  { value: 'longest', label: 'Mais longos' }
];

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const sorters: Record<
  TSort,
  ((a: TVideoCard, b: TVideoCard) => number) | null
> = {
  default: null,
  title: (a, b) => a.title.localeCompare(b.title, 'pt'),
  shortest: (a, b) => a.duration - b.duration,
  longest: (a, b) => b.duration - a.duration
};

type TShowBrowserProps = {
  show: string;
  sketches: TVideoCard[];
  specials: TVideoCard[];
};

const ShowBrowser = ({ show, sketches, specials }: TShowBrowserProps) => {
  const [tab, setTab] = useState<'sketches' | 'specials'>('sketches');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<TSort>('default');

  const tabs = [
    { value: 'sketches' as const, label: 'Sketches', videos: sketches },
    { value: 'specials' as const, label: 'Especiais', videos: specials }
  ].filter(({ videos }) => videos.length > 0);

  const active = tabs.find(({ value }) => value === tab) ?? tabs[0];

  // Reported once the typing settles, not per keystroke.
  useEffect(() => {
    const needle = query.trim();

    if (!needle) return;

    const timeout = setTimeout(
      () => track('show-filter', { show, query: needle }),
      800
    );

    return () => clearTimeout(timeout);
  }, [query, show]);

  const visible = useMemo(() => {
    if (!active) return [];

    const needle = normalize(query.trim());
    const filtered = needle
      ? active.videos.filter((video) => normalize(video.title).includes(needle))
      : active.videos;
    const sorter = sorters[sort];

    return sorter ? [...filtered].sort(sorter) : filtered;
  }, [active, query, sort]);

  if (!active) {
    return (
      <div className="hairline bg-content1 flex min-h-56 flex-col justify-center rounded-lg px-6 py-10 text-center">
        <h2 className="text-xl">Ainda não existem sketches nesta série.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border-divider flex flex-wrap items-center gap-x-6 gap-y-3 border-b pb-3">
        <div role="tablist" className="flex items-center gap-5">
          {tabs.map(({ value, label, videos }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => {
                setTab(value);
                track('show-tab', { show, tab: value });
              }}
              className={`eyebrow -mb-3.5 border-b-2 pb-3 ${
                tab === value
                  ? 'border-primary text-foreground'
                  : 'text-default-500 hover:text-foreground border-transparent'
              }`}
            >
              {label}{' '}
              <span className="text-default-500 font-normal">
                {videos.length}
              </span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-1 items-center gap-2 sm:flex-none">
          <div className="hairline bg-content1 focus-within:bg-content2 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full px-3 sm:w-56">
            <Search size="0.85rem" className="text-default-500 shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrar por título"
              aria-label="Filtrar sketches por título"
              className="text-foreground placeholder:text-default-500 w-full min-w-0 bg-transparent text-sm outline-none"
            />
            {query ? (
              <button
                type="button"
                aria-label="Limpar filtro"
                onClick={() => setQuery('')}
                className="text-default-500 hover:text-foreground shrink-0"
              >
                <X size="0.85rem" />
              </button>
            ) : null}
          </div>

          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as TSort);
              track('show-sort', { show, sort: event.target.value });
            }}
            aria-label="Ordenar sketches"
            className="hairline bg-content1 text-default-500 hover:text-foreground h-9 shrink-0 rounded-full px-3 text-sm outline-none"
          >
            {SORTS.map(({ value, label }) => (
              <option key={value} value={value} className="bg-content1">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visible.length > 0 ? (
        <Grid videos={visible} />
      ) : (
        <p className="text-default-500 py-10 text-center text-sm">
          Nenhum sketch corresponde a “{query}”.
        </p>
      )}
    </div>
  );
};

export { ShowBrowser };
