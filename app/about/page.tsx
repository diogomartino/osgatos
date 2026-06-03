import { getSiteUrl, siteConfig } from '@/config/site';
import type { Metadata } from 'next';
import Link from 'next/link';

const title = 'Sobre';
const description =
  'Conhece o objetivo do OsGatos.net: preservar a obra de Gato Fedorento sem fins comerciais.';

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: '/about'
  },
  openGraph: {
    type: 'website',
    title: `${title} | ${siteConfig.name}`,
    description,
    url: '/about',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Os Gatos'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        alt: 'Os Gatos'
      }
    ]
  }
};

const officialLinks = [
  {
    label: 'Canal oficial no YouTube',
    url: 'https://www.youtube.com/c/gatofedorento'
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/gatofedorentooficial'
  },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/GatoFedorentoOficial'
  }
];

export default function AboutPage() {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl leading-[0.95] md:text-5xl">Sobre o Projeto</h1>
      </header>

      <section className="bg-content1 shadow-frame flex flex-col gap-5 rounded-lg border border-white/8 p-5 md:p-7">
        <h2 className="text-2xl">Porquê?</h2>

        <p>
          Sempre fui fã dos Gato Fedorento, mas nunca houve uma forma simples de
          ver a obra completa. Durante anos, a experiência foi feita de vídeos
          soltos no YouTube, muitas vezes com qualidade duvidosa, títulos
          inconsistentes e sketches que simplesmente não existiam online.
        </p>

        <p>
          O problema ficava ainda mais evidente quando queria rever um sketch do
          qual só me lembrava de uma palavra, uma frase ou uma deixa. Sem um
          arquivo organizado e pesquisável, encontrar esse momento era
          impossível.
        </p>

        <p>
          À data de criação deste site, não existia uma forma legítima e
          completa de aceder à obra dos Gato Fedorento. Este projeto nasceu
          dessa frustração: criar um ponto de acesso mais organizado para quem
          queria rever, descobrir ou simplesmente encontrar aquele sketch que
          tinha na memória.
        </p>
      </section>

      <section className="bg-content1 shadow-frame flex flex-col gap-5 rounded-lg border border-white/8 p-5 md:p-7">
        <h2 className="text-2xl">Apenas Preservação</h2>

        <p>
          O OsGatos.net é uma biblioteca não oficial dedicada a organizar e
          preservar sketches, séries e especiais dos Gato Fedorento. O objetivo
          é simples: manter este material acessível para consulta, descoberta e
          memória cultural.
        </p>

        <p>
          Este projeto não é comercial. Não vende acesso, não cobra subscrições
          e não pretende substituir fontes oficiais. Existe por respeito ao
          impacto que este trabalho teve no humor português e para facilitar a
          sua preservação ao longo do tempo.
        </p>

        <p>
          O site também procura melhorar a forma como o arquivo pode ser
          encontrado: séries organizadas, pesquisa por sketches e transcrições
          editáveis pela comunidade. Quando alguém corrige uma transcrição, está
          a ajudar a tornar este arquivo mais útil para todos.
        </p>
      </section>

      <section className="bg-content1 shadow-frame flex flex-col gap-5 rounded-lg border border-white/8 p-5 md:p-7">
        <h2 className="text-2xl">Links Oficiais</h2>

        <p>Sigam as páginas oficiais dos Gato Fedorento.</p>

        <ul className="flex flex-col gap-3">
          {officialLinks.map((link) => (
            <li key={link.url}>
              <Link
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="bg-content2 hover:border-primary/50 hover:text-primary flex flex-col gap-1 rounded-lg border border-white/8 px-4 py-3"
                data-interactive="true"
              >
                <span className="text-foreground text-sm font-semibold">
                  {link.label}
                </span>
                <span className="text-default-500 text-xs break-all">
                  {link.url}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
