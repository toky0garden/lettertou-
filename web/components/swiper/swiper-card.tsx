'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/app/(constants)';
import { cn } from '@/lib/utils';
import { AspectRatio } from '../ui';

interface SwiperCardProps {
  className?: string;
  slug: string;
  title?: string | null;
  poster?: string | null;
  priority?: boolean;
}

export function SwiperCard({ slug, title, poster, priority, className }: SwiperCardProps) {
  const href = ROUTES.ANIME(slug.replace(/\s+/g, '_'));

  return (
    <article
      className={cn(
        'group relative flex w-36 shrink-0 flex-col gap-3 sm:w-40 lg:w-44 xl:w-48',
        className
      )}
    >
      <Link
        href={href}
        prefetch
        aria-label={title ? `Смотреть «${title}»` : 'Открыть аниме'}
        className='focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
      >
        <div className='bg-muted relative w-full overflow-hidden rounded-xl border shadow-sm transition duration-300 ease-out select-none group-hover:-translate-y-1 group-hover:shadow-xl'>
          <AspectRatio ratio={2 / 3}>
            {poster ? (
              <Image
                alt={title ?? 'Poster'}
                className='pointer-events-none size-full object-cover object-center transition-transform duration-500 ease-out select-none group-hover:scale-105'
                sizes='(max-width: 640px) 144px, (max-width: 1024px) 160px, 192px'
                quality={75}
                src={poster}
                fill
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
              />
            ) : (
              <div className='text-muted-foreground flex size-full items-center justify-center px-4 text-center text-sm'>
                Нет постера
              </div>
            )}
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5 opacity-70 transition-opacity group-hover:opacity-100' />
          </AspectRatio>
        </div>
      </Link>

      {title && (
        <Link
          href={href}
          prefetch
          className='hover:text-primary focus-visible:ring-ring line-clamp-2 min-h-10 w-full rounded-sm text-sm leading-5 font-medium text-pretty transition-colors outline-none focus-visible:ring-2'
        >
          {title}
        </Link>
      )}
    </article>
  );
}
