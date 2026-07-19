'use client';

import { LoaderCircle } from 'lucide-react';
import { SwiperCard } from '@/components/swiper';
import { Button, Skeleton, Typography } from '@/components/ui';
import { useGetGenreAnime } from '@/utils/api/hooks';

interface GenreAnimeGridProps {
  slug: string;
}

function CardSkeleton() {
  return (
    <div className='flex flex-col gap-3'>
      <Skeleton className='aspect-[2/3] w-full rounded-xl' />
      <Skeleton className='h-4 w-3/4' />
    </div>
  );
}

export function GenreAnimeGrid({ slug }: GenreAnimeGridProps) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetGenreAnime(slug);

  const animeList = data?.pages.flatMap((page) => page.data.results) ?? [];

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {Array.from({ length: 12 }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-card flex min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border p-8 text-center'>
        <Typography large>Не удалось загрузить список</Typography>
        <Typography muted>Попробуйте обновить страницу чуть позже.</Typography>
      </div>
    );
  }

  if (!animeList.length) {
    return (
      <div className='bg-card flex min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border p-8 text-center'>
        <Typography large>Пока пусто</Typography>
        <Typography muted>В этом жанре ещё нет тайтлов.</Typography>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {animeList.map((anime, index) => (
          <SwiperCard
            key={anime.id}
            className='w-full sm:w-full lg:w-full xl:w-full'
            slug={anime.slug}
            title={anime.title}
            poster={anime.poster}
            priority={index < 6}
          />
        ))}
      </div>

      {hasNextPage && (
        <Button
          variant='secondary'
          size='lg'
          className='mx-auto w-fit'
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage && <LoaderCircle data-icon='inline-start' className='animate-spin' />}
          Показать ещё
        </Button>
      )}
    </div>
  );
}
