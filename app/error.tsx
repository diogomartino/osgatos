'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl md:text-3xl">Algo correu mal.</h2>
      <button
        onClick={() => reset()}
        className="bg-primary text-primary-foreground rounded-full px-5 py-3 text-sm font-semibold hover:opacity-90"
        type="button"
      >
        Tentar novamente
      </button>
    </div>
  );
}
