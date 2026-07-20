import type { ShortAnimeSchema } from '@/shared/api/types.gen';
import { ArrowUpRight, Film } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES, statusMapping, typeMapping } from '@/app/(constants)';
import { Badge } from '@/components/ui';
import { cn } from '@/utils/lib/utils';

type SearchAnime = Pick<
  ShortAnimeSchema,
  'anime_status' | 'id' | 'poster' | 'slug' | 'title' | 'type' | 'year'
>;

interface AnimeSearchResultProps {
  anime: SearchAnime;
  compact?: boolean;
  onNavigate?: () => void;
}

export function AnimeSearchResult({ anime, compact = false, onNavigate }: AnimeSearchResultProps) {
  const type = anime.type ? typeMapping[anime.type] : null;
  const status = anime.anime_status
    ? statusMapping[anime.anime_status as keyof typeof statusMapping]
    : null;

  return (
    <Link
      href={ROUTES.ANIME(anime.slug.replace(/\s+/g, '_'))}
      prefetch
      onClick={onNavigate}
      className={cn(
        'group hover:bg-muted/60 focus-visible:ring-ring flex rounded-lg transition-colors outline-none focus-visible:ring-2',
        compact ? 'gap-3 p-2' : 'gap-4 border p-3'
      )}
    >
      <div
        className={cn(
          'bg-muted text-muted-foreground relative shrink-0 overflow-hidden rounded-md border',
          compact ? 'h-20 w-14' : 'h-32 w-22'
        )}
      >
        {anime.poster ? (
          <Image
            alt={`Постер: ${anime.title || anime.slug}`}
            src={anime.poster}
            fill
            sizes={compact ? '56px' : '88px'}
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div
            className='flex size-full items-center justify-center'
            aria-label='Постер отсутствует'
          >
            <Film aria-hidden='true' />
          </div>
        )}
      </div>

      <div className='flex min-w-0 flex-1 flex-col justify-center gap-2'>
        <div className='flex items-start justify-between gap-2'>
          <p className={cn('line-clamp-2 font-medium', compact ? 'text-sm' : 'text-base')}>
            {anime.title || 'Без названия'}
          </p>
          {!compact && (
            <ArrowUpRight className='text-muted-foreground shrink-0' aria-hidden='true' />
          )}
        </div>

        <div className='flex flex-wrap gap-1.5'>
          {type && <Badge variant='secondary'>{type}</Badge>}
          {anime.year && <Badge variant='outline'>{anime.year}</Badge>}
          {status && <Badge variant='outline'>{status}</Badge>}
        </div>
      </div>
    </Link>
  );
}
