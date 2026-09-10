import { buildMetadata } from '@/helpers/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = buildMetadata({
  title: 'Ajudar com Transcrições',
  description:
    'Tutorial para corrigir transcrições dos sketches diretamente no GitHub.',
  path: '/help-transcriptions'
});

const steps = [
  {
    title: 'Encontra o sketch',
    text: 'Abre a página do vídeo e clica no ícone de transcrição junto ao título.'
  },
  {
    title: 'Abre o ficheiro no GitHub',
    text: 'Dentro da janela da transcrição, clica no ícone do GitHub. Isso abre o ficheiro certo no repositório, onde podes editar o texto.'
  },
  {
    title: 'Edita o texto',
    text: 'No GitHub, usa o botão de edição do ficheiro. Corrige palavras, pontuação e quebras de linha mantendo apenas o texto falado.'
  },
  {
    title: 'Guarda a alteração',
    text: 'Quando terminares, cria uma pull request. Uma descrição simples como “Corrige transcrição de [nome do sketch]” é suficiente.'
  }
];

export default function HelpTranscriptionsPage() {
  return (
    <article className="shell flex max-w-4xl flex-col gap-8">
      <header className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-4xl leading-[0.95] md:text-5xl">
          Como corrigir transcrições.
        </h1>
        <p className="text-default-500 text-base">
          As transcrições ajudam a pesquisa, a acessibilidade e a preservação do
          arquivo. Qualquer correção pequena melhora o site.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="bg-content1 shadow-frame hairline rounded-lg p-5"
          >
            <span className="text-primary eyebrow">Passo {index + 1}</span>
            <h2 className="mt-3 text-xl">{step.title}</h2>
            <p className="text-default-500 mt-2 text-sm">{step.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-content1 shadow-frame hairline flex flex-col gap-4 rounded-lg p-5 md:p-7">
        <h2 className="text-2xl">O que deve ser corrigido?</h2>
        <ul className="text-default-500 flex list-disc flex-col gap-2 pl-5 text-sm">
          <li>Palavras mal reconhecidas.</li>
          <li>
            Nomes próprios, expressões portuguesas e referências culturais.
          </li>
          <li>Pontuação que torne o texto mais legível.</li>
          <li>Quebras de linha naturais, sem cortar frases a meio.</li>
        </ul>
      </section>

      <section className="bg-content1 shadow-frame hairline flex flex-col gap-4 rounded-lg p-5 md:p-7">
        <h2 className="text-2xl">Links úteis</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="https://github.com/diogomartino/osgatos/tree/development/scripts/transcripts"
            target="_blank"
            rel="noreferrer"
            className="bg-content2 hover:text-primary hairline rounded-full px-4 py-2"
          >
            Pasta das transcrições
          </Link>
          <Link
            href="https://github.com/diogomartino/osgatos/pulls"
            target="_blank"
            rel="noreferrer"
            className="bg-content2 hover:text-primary hairline rounded-full px-4 py-2"
          >
            Pull requests
          </Link>
        </div>
      </section>
    </article>
  );
}
