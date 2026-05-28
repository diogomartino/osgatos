const fallbackSiteUrl = 'http://localhost:3000';

const siteConfig = {
  name: 'OsGatos.net',
  title: 'Os Gatos',
  description:
    'Biblioteca não oficial com a obra de Gato Fedorento, organizada por séries e sketches.',
  locale: 'pt_PT',
  defaultOgImage: 'https://i.imgur.com/bRD7sXs.png'
};

const getSiteUrl = () => process.env.NEXT_PUBLIC_URL ?? fallbackSiteUrl;

export { getSiteUrl, siteConfig };
