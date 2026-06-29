import type { Metadata } from 'next';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { METADATA, ROUTES } from '@/app/(constants)';

import { Toaster } from '@/components/ui';

import { Provider } from './providers';
import '@/assets/styles/tailwind.css';
import SakuraFall from '@/components/ui/sakura-fall';

export const metadata: Metadata = {
  title: METADATA.NAME,
  metadataBase: new URL(METADATA.URL),
  description: METADATA.DESCRIPTION,
  applicationName: METADATA.NAME,
  keywords: METADATA.KEYWORDS,
  icons: {
    icon: '/favicon.ico'
  },
  alternates: {
    canonical: ROUTES.ROOT
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      className={`${GeistSans.variable} ${GeistMono.variable} layout-fixed`}
      lang='ru'
      suppressHydrationWarning
    >
      <head>
        <script
          // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{
            __html: `
              const mode = document.cookie.match(/mode=(.*?)(;|$)/)?.[1] || 'dark';
              document.documentElement.classList.add(mode);
            `
          }}
        />
      </head>
      <body className='min-h-screen font-sans antialiased'>
        {/* <SakuraFall /> */}
        <Provider>{children}</Provider>
        <Toaster position='bottom-right' />
      </body>
    </html>
  );
}
