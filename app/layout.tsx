import { Footer } from '@/components/footer';
import { Topbar } from '@/components/top-bar';
import { fontSans } from '@/config/fonts';
import '@/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { Providers } from './providers';
// @ts-expect-error idfk
import { unstable_ViewTransition as ViewTransition } from 'react';

export const metadata: Metadata = {
  title: 'Gato Fedorento',
  description: 'Site não oficial dos Gato Fedorento',
  icons: {
    icon: '/favicon.ico'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_SCRIPT && (
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
            fontSans.variable
          )}
        >
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
            <div className="relative flex h-dvh flex-col">
              <Topbar />
              <main className="container mx-auto mt-4 max-w-7xl flex-grow">
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
