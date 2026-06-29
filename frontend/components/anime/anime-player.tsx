'use client';

import type { AnimeResponse, TranslationResponse } from 'generated';
import { useParams } from 'next/navigation';
import { KodikPlayer, Player } from '@/components/player';
import { useConfig } from '@/hooks/useConfig';
import { cn } from '@/lib/utils';

interface AnimePlayerProps {
  anime: AnimeResponse;
}

export function AnimePlayer({ anime }: AnimePlayerProps) {
  const slug = useParams().slug as string;
  const shikiId = Number(slug.replace(/\s+/g, '_').match(/\d+$/)?.[0]);
  const config = useConfig()[0];

  return !config.authenticated ? (
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
  ) : !anime.translations ? (
    <div className='flex w-full flex-col'>
      <KodikPlayer
        className='aspect-video rounded-md'
        iframeUrl={anime.iframe_url as string}
        hide_selectors={false}
      />
    </div>
  ) : (
    <Player
      shikiId={shikiId}
      title={anime.title!}
      translations={anime?.translations as TranslationResponse[]}
    />
  );
}
