'use client';

import Image from 'next/image';
import Link from 'next/link';
import { InfoIcon, PlayIcon, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SwiperBannerResponse } from '@/generated';
import { ROUTES } from '@/app/(constants)';
import { Badge, Button, Typography } from '@/components/ui';
import { cn } from '@/utils/lib/utils';

interface HomeHeroProps {
  banners: SwiperBannerResponse[];
}

const ROTATE_MS = 8000;

export function HomeHero({ banners }: HomeHeroProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => {
      setActive((current) => (current + 1) % banners.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  const banner = banners[active];
  const href = ROUTES.ANIME(banner.slug.replace(/\s+/g, '_'));

  return (
    <section className='container'>
      <div className='relative overflow-hidden rounded-3xl border shadow-sm'>
        <div className='bg-muted absolute inset-0'>
          <Image
            key={banner.id}
            alt=''
            className='size-full object-cover object-center'
            fill
            priority
            quality={85}
            sizes='100vw'
            src={banner.poster}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 to-transparent' />
        </div>

        <div className='relative flex min-h-[380px] flex-col justify-end gap-5 p-6 sm:min-h-[440px] sm:p-10 lg:min-h-[520px] lg:p-14'>
          <div className='flex max-w-2xl flex-col gap-4 text-white'>
            <div className='flex flex-wrap items-center gap-2'>
              {typeof banner.shikimori_rating === 'number' && banner.shikimori_rating > 0 && (
                <Badge className='gap-1 bg-white/15 text-white backdrop-blur-sm'>
                  <Star className='size-3.5' fill='currentColor' />
                  {banner.shikimori_rating.toFixed(1)}
                </Badge>
              )}
              {banner.type && (
                <Badge variant='secondary' className='backdrop-blur-sm'>
                  {banner.type}
                </Badge>
              )}
            </div>

            <Typography h1 as='h2' className='text-3xl text-white sm:text-4xl lg:text-5xl'>
              {banner.title}
            </Typography>

            <p className='line-clamp-3 max-w-xl text-sm text-white/80 sm:text-base'>
              {banner.description}
            </p>

            <div className='flex flex-wrap gap-3'>
              <Button size='lg' render={<Link href={href} />}>
                <PlayIcon data-icon='inline-start' fill='currentColor' /> Смотреть
              </Button>
              <Button
                size='lg'
                variant='secondary'
                className='bg-white/15 text-white backdrop-blur-sm hover:bg-white/25'
                render={<Link href={href} />}
              >
                <InfoIcon data-icon='inline-start' /> Подробнее
              </Button>
            </div>
          </div>

          {banners.length > 1 && (
            <div className='flex gap-2'>
              {banners.map((item, index) => (
                <button
                  key={item.id}
                  type='button'
                  aria-label={`Показать ${item.title}`}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    index === active ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/70'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
