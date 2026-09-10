import { Footer } from '@/components/footer';
import { Topbar } from '@/components/top-bar';
import { fontBody, fontDisplay } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import '@/globals.css';
import { buildMetadata } from '@/helpers/metadata';
import { Metadata, Viewport } from 'next';
import { ViewTransition } from 'react';

export const metadata: Metadata = {
  ...buildMetadata({
    title: siteConfig.title,
    description: siteConfig.description,
    path: '/'
  }),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: '%s | Os Gatos'
  },
  icons: { icon: '/favicon.ico' }
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
    <html lang="pt-PT" className="dark">
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
          className={`text-foreground bg-background min-h-screen font-sans antialiased ${fontBody.variable} ${fontDisplay.variable}`}
        >
          <div className="relative isolate flex min-h-dvh flex-col overflow-x-clip">
            <Topbar />
            <main className="pb-section lg:pb-section-lg flex w-full flex-1 flex-col pt-8 lg:pt-10">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </ViewTransition>
    </html>
  );
}
