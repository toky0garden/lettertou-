'use client';

import type { ShortAnimeSchema } from '@/shared/api/types.gen';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { SwiperCard } from '.';
import { Button } from '@/components/ui';

interface SwiperListProps {
  data: ShortAnimeSchema[];
}

const SCROLL_AMOUNT = 600;

export function SwiperList({ data }: SwiperListProps) {
  const scrollRef = useRef<HTMLElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth'
    });
  };

  if (!data || data.length === 0) {
    return <p className='text-muted-foreground py-10 text-center text-sm'>Список пока пуст</p>;
  }

  return (
    <div className='relative'>
      <ScrollContainer
        innerRef={scrollRef}
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

      <Button
        variant='secondary'
        size='icon'
        className='absolute top-1/3 -left-3 hidden rounded-md shadow-md sm:inline-flex'
        onClick={() => scroll('left')}
        aria-label='Назад'
      >
        <ChevronLeft />
      </Button>
      <Button
        variant='secondary'
        size='icon'
        className='absolute top-1/3 -right-3 hidden rounded-md shadow-md sm:inline-flex'
        onClick={() => scroll('right')}
        aria-label='Вперёд'
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
