'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useState } from 'react';

interface EpisodeSelectorProps {
  episodes: number[];
  selectedEpisode: number;
  setSelectedEpisode: (episode: number) => void;
}

const EpisodeButton = memo(
  ({
    episode,
    selected,
    onClick
  }: {
    episode: number;
    selected: boolean;
    onClick: (ep: number) => void;
  }) => {
    return (
      <Button
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'text-primary border px-5 py-2',
          selected && 'border-primary border-2'
        )}
        onClick={() => onClick(episode)}
      >
        {episode}
      </Button>
    );
  }
);

export function EpisodeSelector({
  episodes,
  selectedEpisode,
  setSelectedEpisode
}: EpisodeSelectorProps) {
  const EPISODES_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(episodes.length / EPISODES_PER_PAGE);

  const paginatedEpisodes = episodes.slice(
    (currentPage - 1) * EPISODES_PER_PAGE,
    currentPage * EPISODES_PER_PAGE
  );

  return (
    <div className='flex flex-col gap-3'>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(62px,1fr))] gap-2'>
        {paginatedEpisodes.map((episode: number) => (
          <EpisodeButton
            key={episode}
            episode={episode}
            selected={selectedEpisode === episode}
            onClick={setSelectedEpisode}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className='flex gap-3'>
          <Button
            disabled={currentPage === 1}
            className={cn(buttonVariants({ variant: 'secondary' }), 'bg-background')}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            disabled={currentPage === totalPages}
            className={cn(buttonVariants({ variant: 'secondary' }), 'bg-background')}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
