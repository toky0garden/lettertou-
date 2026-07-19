import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

import { ROUTES } from '@/app/(constants)';
import { ContinueWatching, HomeGenres, HomeHero } from '@/components/home';
import { SwiperList } from '@/components/swiper';
import { Typography } from '@/components/ui';
import { getSwiper, getSwiperBanner, getUpdates } from '@/utils/api/request';
import type { SwiperBannerResponse, SwiperResponse } from '@/generated';

interface SectionHeaderProps {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}

function SectionHeader({ title, description, href, linkLabel }: SectionHeaderProps) {
  return (
    <div className='flex items-end justify-between gap-4'>
      <div className='flex flex-col gap-1'>
        <Typography h3 as='h2'>
          {title}
        </Typography>
        <Typography muted>{description}</Typography>
      </div>
      {href && (
        <Link
          href={href}
          className='text-muted-foreground hover:text-foreground focus-visible:ring-ring hidden shrink-0 items-center gap-1 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2 sm:flex'
        >
          {linkLabel ?? 'Смотреть все'}
          <ArrowRightIcon className='size-4' aria-hidden='true' />
        </Link>
      )}
    </div>
  );
}

export default async function RootPage() {
  // Every section degrades independently: a single failing request must not
  // take down the whole home page.
  const [bannerResult, popularResult, updatesResult] = await Promise.allSettled([
    getSwiperBanner({}),
    getSwiper({}),
    getUpdates()
  ]);

  const banners: SwiperBannerResponse[] =
    bannerResult.status === 'fulfilled' ? bannerResult.value.data : [];
  const populars: SwiperResponse[] =
    popularResult.status === 'fulfilled' ? popularResult.value.data : [];
  const updates: SwiperResponse[] =
    updatesResult.status === 'fulfilled' ? updatesResult.value.data : [];

  return (
    <div className='flex flex-col gap-12 py-8 sm:gap-14 sm:py-10 lg:gap-16 lg:py-12'>
      {banners.length > 0 && <HomeHero banners={banners} />}

      <ContinueWatching />

      {populars.length > 0 && (
        <section className='container flex flex-col gap-5'>
          <SectionHeader
            title='Популярное'
            description='То, что сейчас смотрят чаще всего'
            href={ROUTES.CATALOG}
          />
          <SwiperList data={populars} />
        </section>
      )}

      {updates.length > 0 && (
        <section className='container flex flex-col gap-5'>
          <SectionHeader
            title='Новинки'
            description='Свежие серии и недавно добавленные тайтлы'
            href={ROUTES.CATALOG}
          />
          <SwiperList data={updates} />
        </section>
      )}

      <section className='container flex flex-col gap-5'>
        <SectionHeader
          title='Жанры'
          description='Выбери настроение и открой новую историю'
          href={ROUTES.CATALOG}
          linkLabel='Все жанры'
        />
        <HomeGenres />
      </section>
    </div>
  );
}

export const revalidate = 3600;
