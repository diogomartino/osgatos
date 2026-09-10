import { Grid } from '@/components/grid';
import { buildMetadata } from '@/helpers/metadata';
import { searchVideos } from '@/queries/search';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Procurar',
    description:
      'Procura qualquer sketch de Gato Fedorento pelo título ou por uma frase dita nele.',
    path: '/search'
  }),
  // Query pages are infinite; only the empty page is worth indexing.
  robots: { index: false, follow: true }
};

type TPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: TPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  const results = query ? await searchVideos(query) : [];

  return (
    <div className="shell flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <span className="eyebrow text-default-500">Resultados</span>
        <h1 className="text-3xl md:text-4xl">
          {query ? `“${query}”` : 'Procurar'}
        </h1>
        <p className="text-default-500 text-sm">
          {query
            ? `${results.length} sketch${results.length === 1 ? '' : 'es'} encontrado${results.length === 1 ? '' : 's'}.`
            : 'Usa ⌘K para procurar por título ou por uma frase dita no sketch.'}
        </p>
      </header>

      {results.length > 0 ? <Grid videos={results} /> : null}
    </div>
  );
}
