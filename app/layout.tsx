import { Footer } from '@/components/footer';
import { Topbar } from '@/components/top-bar';
import { fontSans } from '@/config/fonts';
import '@/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { unstable_ViewTransition as ViewTransition } from 'react';
import { Providers } from './providers';

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

const enableAnalytics =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT &&
  process.env.NODE_ENV !== 'development';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
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
            fontSans.variable
          )}
        >
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
            <div className="relative flex h-dvh flex-col">
              <Topbar />
              <main className="container mx-auto mt-6 max-w-7xl flex-grow px-4 lg:px-8">
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
