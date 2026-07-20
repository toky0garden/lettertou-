'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { ROUTES } from '@/app/(constants)';
import { AspectRatio, Typography } from '@/components/ui';
import { useWatchHistory } from '@/hooks/useWatchHistory';

export function ContinueWatching() {
  const [mounted, setMounted] = useState(false);
  const { history, remove } = useWatchHistory();

  useEffect(() => setMounted(true), []);

  // localStorage isn't available during SSR, so render nothing until mounted
  // and skip the section entirely when there is no history yet.
  if (!mounted || history.length === 0) {
    return null;
  }

  return (
    <section className='container flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <Typography h3 as='h2'>
          Продолжить просмотр
        </Typography>
        <Typography muted>Вернись к тому, что не досмотрел</Typography>
      </div>

      <ScrollContainer
        className='scrollbar-hide -mx-4 cursor-grab overflow-x-auto px-4 pb-4 active:cursor-grabbing lg:-mx-2 lg:px-2'
        vertical={false}
        horizontal
        nativeMobileScroll
      >
        <div className='flex w-max flex-nowrap gap-4 sm:gap-5'>
          {history.map((item) => (
            <article
              key={item.slug}
              className='group relative w-52 shrink-0 sm:w-60'
            >
              <Link
                href={ROUTES.ANIME(item.slug.replace(/\s+/g, '_'))}
                prefetch
                aria-label={`Продолжить «${item.title}»`}
                className='focus-visible:ring-ring block overflow-hidden rounded-xl border shadow-sm outline-none focus-visible:ring-2'
              >
                <div className='bg-muted relative'>
                  <AspectRatio ratio={16 / 9}>
                    {item.poster ? (
                      <Image
                        alt={item.title}
                        className='size-full object-cover object-center transition-transform duration-500 group-hover:scale-105'
                        fill
                        quality={70}
                        sizes='240px'
                        src={item.poster}
                      />
                    ) : (
                      <div className='text-muted-foreground flex size-full items-center justify-center text-sm'>
                        Нет постера
                      </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent' />
                    <div className='absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 text-white'>
                      <span className='line-clamp-1 text-sm font-semibold'>{item.title}</span>
                      <span className='text-xs text-white/70'>{item.episode} эпизод</span>
                    </div>
                  </AspectRatio>
                </div>
              </Link>
              <button
                type='button'
                aria-label='Убрать из истории'
                onClick={() => remove(item.slug)}
                className='absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100'
              >
                <X className='size-4' />
              </button>
            </article>
          ))}
        </div>
      </ScrollContainer>
    </section>
  );
}
