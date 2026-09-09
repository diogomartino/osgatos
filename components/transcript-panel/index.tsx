'use client';

import { track } from '@/helpers/track';
import { ChevronDown, Github } from 'lucide-react';
import Link from 'next/link';

type TTranscriptPanelProps = {
  transcript: string;
  fileUrl: string;
  isRevised: boolean;
  videoId: string;
};

const TranscriptPanel = ({
  transcript,
  fileUrl,
  isRevised,
  videoId
}: TTranscriptPanelProps) => (
  <details
    className="hairline bg-content1 group rounded-lg open:pb-1"
    // `toggle` fires on close too; only the open is interesting.
    onToggle={(event) =>
      event.currentTarget.open &&
      track('transcript-open', { videoId, revised: isRevised })
    }
  >
    <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
      <span className="eyebrow text-default-500 group-open:text-foreground">
        Transcrição
      </span>

      {isRevised ? (
        <span className="rounded-full border border-green-500/35 bg-green-500/10 px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.14em] text-green-400 uppercase">
          Revista
        </span>
      ) : (
        <span className="hairline text-default-500 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.14em] uppercase">
          Automática
        </span>
      )}

      <ChevronDown
        size="1rem"
        aria-hidden="true"
        className="text-default-500 ml-auto transition-transform duration-200 group-open:rotate-180"
      />
    </summary>

    <div className="border-divider mt-1 flex flex-col gap-3 border-t px-4 py-4">
      <p className="text-foreground/90 max-h-[22rem] max-w-none overflow-y-auto text-sm leading-6 whitespace-pre-wrap">
        {transcript}
      </p>

      <Link
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="text-default-500 hover:text-primary inline-flex items-center gap-2 self-start text-xs"
        onClick={() =>
          track('transcript-edit', { videoId, revised: isRevised })
        }
      >
        <Github size="0.9rem" />
        Corrigir esta transcrição no GitHub
      </Link>
    </div>
  </details>
);

export { TranscriptPanel };
