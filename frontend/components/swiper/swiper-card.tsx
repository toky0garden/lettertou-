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
  return (
    <div className={cn('relative flex w-36 max-w-full flex-col gap-1', className)}>
      <Link href={ROUTES.ANIME(slug.replace(/\s+/g, '_'))} prefetch={true}>
        <div className='bg-primary/10 w-full overflow-hidden rounded-sm transition-all duration-300 ease-out select-none hover:brightness-80'>
          <AspectRatio ratio={2 / 3}>
            {poster && (
              <Image
                alt={title ?? 'Poster'}
                className='pointer-events-none relative size-full object-cover object-center select-none'
                height={200}
                quality={65}
                src={poster}
                width={200}
                decoding='sync'
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
              />
            )}
          </AspectRatio>
        </div>
      </Link>

      {title && (
        <Link
          href={ROUTES.ANIME(slug.replace(/\s+/g, '_'))}
          prefetch={true}
          className='line-clamp-2 w-full text-sm text-pretty text-ellipsis'
        >
          {title}
        </Link>
      )}
    </div>
  );
}
