'use client';

import type { SwiperResponse } from '@/generated';
import ScrollContainer from 'react-indiana-drag-scroll';
import { cn } from '@/lib/utils';
import { SwiperCard } from '.';

interface SwiperListProps {
  data: SwiperResponse[];
}

export function SwiperList({ data }: SwiperListProps) {
  if (!data || data.length === 0) {
    return <span>No data...</span>;
  }
  return (
    <div className='w-full'>
      <div className='overflow-x-hidden'>
        <ScrollContainer
          className='active:cursor-grabbing'
          vertical={false}
          horizontal={true}
          nativeMobileScroll={true}
        >
          <div className='flex flex-nowrap'>
            {data.map((anime, index) => (
              <div
                key={anime.id}
                className={cn('!w-auto', index !== 0 ? 'ml-5' : '', 'flex-shrink-0')}
              >
                <SwiperCard
                  slug={anime.slug}
                  title={anime.title}
                  poster={anime.poster}
                  priority={index <= 10}
                />
              </div>
            ))}
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
}
