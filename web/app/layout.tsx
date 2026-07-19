import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import Script from 'next/script';

import { METADATA, ROUTES } from '@/app/(constants)';

import { Toaster } from '@/components/ui';

import { Provider } from './providers';
import '@/assets/styles/tailwind.css';
import SakuraFall from '@/components/ui/sakura-fall';
import { cn } from '@/utils/lib/utils';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  weight: ['400', '500', '600', '700', '800']
});

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
    <html className={cn('layout-fixed', onest.variable)} lang='ru' suppressHydrationWarning>
      <head>
        <Script id='theme-init' strategy='beforeInteractive'>
          {`
              const mode = document.cookie.match(/mode=(.*?)(;|$)/)?.[1] || 'dark';
              const accent = document.cookie.match(/accent=(.*?)(;|$)/)?.[1] || 'neutral';
              document.documentElement.classList.add(mode, 'theme-' + accent);
            `}
        </Script>
      </head>
      <body className='min-h-screen font-sans antialiased'>
        {/* <SakuraFall /> */}
        <Provider>{children}</Provider>
        <Toaster position='bottom-right' />
      </body>
    </html>
  );
}
