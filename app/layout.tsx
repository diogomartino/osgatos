import { Footer } from '@/components/footer';
import { Topbar } from '@/components/top-bar';
import { fontBody, fontDisplay } from '@/config/fonts';
import { getSiteUrl, siteConfig } from '@/config/site';
import '@/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { unstable_ViewTransition as ViewTransition } from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: '%s | Os Gatos'
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: getSiteUrl(),
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
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        alt: 'Os Gatos'
      }
    ]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export const viewport: Viewport = {
  themeColor: '#080808'
};

const enableAnalytics =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT &&
  process.env.NODE_ENV !== 'development';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="pt-PT">
      <head>
        {enableAnalytics && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          ></script>
        )}
      </head>
      <ViewTransition>
        <body
          className={clsx(
            'text-foreground bg-background min-h-screen font-sans antialiased',
            fontBody.variable,
            fontDisplay.variable
          )}
        >
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
            <div className="relative isolate flex min-h-dvh flex-col overflow-x-clip">
              <Topbar />
              <main className="pb-section lg:pb-section-lg mx-auto flex w-full max-w-[100rem] flex-1 px-4 pt-8 md:px-6 lg:px-8 lg:pt-10">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </body>
      </ViewTransition>
    </html>
  );
}
