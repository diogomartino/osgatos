'use client';

import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@heroui/modal';
import { Captions, Check, ExternalLink } from 'lucide-react';

type TTranscriptDialogProps = {
  title: string;
  transcript: string;
  transcriptFileUrl: string;
  source: 'transcript' | 'transcriptv2' | 'transcriptFinal';
};

const TranscriptDialog = ({
  title,
  transcript,
  transcriptFileUrl,
  source
}: TTranscriptDialogProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const sourceLabel = source === 'transcriptv2' ? 'v2' : 'v1';

  return (
    <div className="text-sm">
      <Button
        isIconOnly
        aria-label="Ver transcrição"
        size="sm"
        variant="light"
        className="text-default-500 hover:text-foreground h-7 w-7 min-w-0 rounded-full"
        onPress={onOpen}
      >
        <Captions size="1rem" />
      </Button>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px overflow-hidden whitespace-pre-wrap opacity-0"
      >
        {transcript}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="2xl"
        classNames={{
          base: 'bg-content1 text-foreground',
          header: 'border-b border-white/8',
          body: 'py-5'
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-default-500 text-xs font-semibold tracking-[0.22em] uppercase">
                Transcrição
              </span>
              {source === 'transcriptFinal' ? (
                <span
                  aria-label="Transcrição final"
                  className="rounded-full border border-green-500/35 bg-green-500/10 p-1 text-green-400"
                >
                  <Check size="0.75rem" aria-hidden="true" />
                </span>
              ) : (
                <span className="text-default-500 rounded-full border border-white/8 px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] uppercase">
                  {sourceLabel}
                </span>
              )}
            </div>
            <span>{title}</span>
          </ModalHeader>
          <ModalBody>
            <p className="text-foreground leading-6 whitespace-pre-wrap">
              {transcript}
            </p>
          </ModalBody>
          <ModalFooter className="border-t border-white/8">
            <Button
              as="a"
              href={transcriptFileUrl}
              target="_blank"
              rel="noreferrer"
              size="sm"
              variant="flat"
              startContent={<ExternalLink size="0.95rem" />}
            >
              Ver ficheiro
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export { TranscriptDialog };
