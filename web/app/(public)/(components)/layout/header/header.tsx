'use client';

import { Loader2Icon } from 'lucide-react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SearchInput } from './search-input';

const ThemeButton = dynamic(() => import('./theme-button').then((module) => module.ThemeButton), {
  ssr: false,
  loading: () => (
    <Button size='icon' variant='ghost'>
      <Loader2Icon className='animate-spin' />
    </Button>
  )
});

const UserButton = dynamic(() => import('./user-button').then((module) => module.UserButton), {
  ssr: false,
  loading: () => (
    <Button size='icon' variant='ghost'>
      <Loader2Icon className='animate-spin' />
    </Button>
  )
});

const CatalogButton = dynamic(
  () => import('./catalog-button').then((module) => module.CatalogButton),
  {
    ssr: false,
    loading: () => (
      <Button size='icon' variant='ghost'>
        <Loader2Icon className='animate-spin' />
      </Button>
    )
  }
);

const MobileNavigation = dynamic(
  () => import('./mobile-navigation').then((module) => module.MobileNavigation),
  {
    ssr: false,
    loading: () => (
      <Button size='icon' variant='ghost'>
        <Loader2Icon className='animate-spin' />
      </Button>
    )
  }
);

export function Header() {
  return (
    <header className='bg-background/80 supports-backdrop-filter:bg-background/80 border-border/25 sticky top-0 z-50 w-full border-b backdrop-blur-2xl'>
      <div className='container-wrapper 3xl:fixed:px-0 px-6'>
        <div className='3xl:fixed:container flex h-14 items-center gap-2 **:data-[slot=separator]:!h-4'>
          <Link
            href='/'
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-base font-bold')}
          >
            letter to u!
          </Link>

          <div className='hidden w-full items-center justify-center gap-2 md:flex'>
            <SearchInput />
          </div>

          <div className='ml-auto flex items-center gap-2 md:flex-1 md:justify-end'>
            <ThemeButton />
            <div className='max-md:hidden'>
              <CatalogButton />
            </div>
            <div className='md:hidden'>
              <MobileNavigation />
            </div>
            <div className='max-md:hidden'>
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
