'use client';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '../ui';

interface SeasonSelectorProps {
  seasons: number[];
  selectedSeason: number;
  setSelectedSeason: (season: number) => void;
  setSelectedEpisode: (episode: number) => void;
}

export function SeasonSelector({
  seasons,
  selectedSeason,
  setSelectedSeason,
  setSelectedEpisode
}: SeasonSelectorProps) {
  return (
    <div className='mb-2 flex gap-2'>
      {seasons.map((season: number) => (
        <Button
          key={season}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'text-primary border px-2 py-1',
            selectedSeason === season && 'border-primary border-2'
          )}
          onClick={() => {
            setSelectedSeason(season);
            setSelectedEpisode(1);
          }}
        >
          {season} сезон
        </Button>
      ))}
    </div>
  );
}
