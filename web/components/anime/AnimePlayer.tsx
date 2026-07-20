'use client';

import type { AnimeSchema, PlayerSchema } from '@/shared/api/types.gen';
import { useEffect, useState } from 'react';
import { Player } from '@/components/player';
import { Skeleton } from '@/components/ui';
import { useConfig } from '@/hooks/useConfig';
import { useGetTitlePlayerQuery } from '@/shared/api';
import { cn } from '@/utils/lib/utils';

interface AnimePlayerProps {
  anime: AnimeSchema;
}

export function AnimePlayer({ anime }: AnimePlayerProps) {
  const [mounted, setMounted] = useState(false);
  const config = useConfig()[0];

  const { data, isLoading, isError } = useGetTitlePlayerQuery({
    request: { query: { slug: anime.slug } },
    params: { enabled: mounted && config.authenticated }
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className='aspect-video w-full rounded-lg' />;
  }

  if (!config.authenticated) {
    return (
      <div
        className={cn(
          'bg-background flex items-center justify-center rounded-lg',
          'text-muted-foreground p-8 text-center'
        )}
      >
        <div>
          <p className='mb-2 text-lg font-medium'>Плеер недоступен</p>
          <p className='text-sm'>Авторизируйтесь для просмотра</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className='aspect-video w-full rounded-lg' />;
  }

  if (isError || !data?.data) {
    return (
      <div
        className={cn(
          'bg-background flex items-center justify-center rounded-lg',
          'text-muted-foreground p-8 text-center'
        )}
      >
        <div>
          <p className='mb-2 text-lg font-medium'>Плеер недоступен</p>
          <p className='text-sm'>Не удалось загрузить данные плеера, попробуйте позже</p>
        </div>
      </div>
    );
  }

  const player = data.data as PlayerSchema;

  return (
    <Player
      slug={anime.slug}
      title={anime.title ?? player.translations.at(0)?.title ?? ''}
      poster={anime.poster ?? null}
      player={player}
    />
  );
}
