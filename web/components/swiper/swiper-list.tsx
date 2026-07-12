'use client';

import type { SwiperResponse } from '@/generated';
import ScrollContainer from 'react-indiana-drag-scroll';
import { SwiperCard } from '.';

interface SwiperListProps {
  data: SwiperResponse[];
}

export function SwiperList({ data }: SwiperListProps) {
  if (!data || data.length === 0) {
    return <p className='text-muted-foreground py-10 text-center text-sm'>Список пока пуст</p>;
  }

  return (
    <ScrollContainer
      className='scrollbar-hide -mx-4 cursor-grab overflow-x-auto px-4 pb-4 active:cursor-grabbing lg:-mx-2 lg:px-2'
      vertical={false}
      horizontal
      nativeMobileScroll
    >
      <div className='flex w-max flex-nowrap gap-4 sm:gap-5 lg:gap-6'>
        {data.map((anime, index) => (
          <SwiperCard
            key={anime.id}
            slug={anime.slug}
            title={anime.title}
            poster={anime.poster}
            priority={index <= 7}
          />
        ))}
      </div>
    </ScrollContainer>
  );
}
