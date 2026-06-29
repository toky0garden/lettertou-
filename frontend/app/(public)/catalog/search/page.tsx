'use client';

import type { AnimeResponse } from 'generated';
import Image from 'next/image';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { toast } from 'sonner';
import { AUTH, ROUTES, statusMapping, typeMapping } from '@/app/(constants)';
import {
  AspectRatio,
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardHeader,
  Input,
  ScrollArea,
  ScrollBar
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { searchAnime } from '@/utils/api/request';

interface SearchItemProps {
  className?: string;
  anime: Pick<AnimeResponse, 'anime_status' | 'id' | 'poster' | 'slug' | 'title' | 'type' | 'year'>;
}

function SearchItem({ anime, className }: SearchItemProps) {
  return (
    <Link
      href={ROUTES.ANIME(anime.slug.replace(/\s+/g, '_'))}
      prefetch={true}
      className={cn(
        'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 ease-out',
        className
      )}
    >
      <div className='bg-muted w-14 max-w-[56px] min-w-[56px] overflow-hidden rounded border'>
        <AspectRatio ratio={2 / 3}>
          <Image
            alt={anime.slug ?? 'Poster'}
            className='relative size-full object-cover object-center'
            height={56}
            quality={65}
            src={anime.poster || ''}
            width={56}
            decoding='sync'
            loading='eager'
          />
        </AspectRatio>
      </div>
      <div className='flex flex-col self-stretch py-1.5'>
        <p className='line-clamp-2'>{`${anime.title}`}</p>
        <div className='text-muted-foreground text-xs'>
          <span>{typeMapping[anime.type as string]}</span>
        </div>
        {anime.anime_status && (
          <span className='text-muted-foreground text-xs'>
            {statusMapping[anime.anime_status as keyof typeof statusMapping]}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function CatalogSearchPage() {
  const paramsQuery = useSearchParams().get('query') as string;
  const [query, setQuery] = useState(paramsQuery || '');
  const [results, setResults] = useState<AnimeResponse[]>([]);

  const handleSearch = useCallback(async () => {
    if (query.length < 3) {
      toast.error('Для точного поиска нужно не менее 3 слов');
      return;
    }

    try {
      const response = await searchAnime({
        params: {
          search: query,
          limit: 20
        }
      });
      setResults(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      toast.error(`Произошла ошибка, попробуйте позже. ${error}`);
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (paramsQuery) {
      handleSearch();
    }
  }, [paramsQuery]);

  return (
    <div className='container-wrapper'>
      <div className='flex w-full flex-col items-center justify-center max-sm:mt-20 sm:h-[100vh]'>
        <div className='mb-5 flex flex-col items-center gap-y-2'>
          <h1 className='text-center text-4xl font-semibold'>Поиск</h1>
        </div>
        <div className='w-full max-w-xl'>
          <Card className={AUTH.CARD}>
            <CardHeader>
              <div className='flex gap-3'>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder='Введите запрос...'
                />
                <Button
                  className={cn(buttonVariants({ variant: 'default' }))}
                  onClick={handleSearch}
                >
                  Найти
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {results.length ? (
                <ScrollArea>
                  <div className='mt-5 max-h-[52vh]'>
                    <div className='flex flex-col flex-nowrap gap-3'>
                      {results.map((anime) => (
                        <SearchItem key={anime.id} anime={anime} />
                      ))}
                    </div>
                  </div>
                  <ScrollBar orientation='vertical' />
                </ScrollArea>
              ) : (
                <p className='mt-5 text-center text-lg'>По вашему запросу ничего не найдено</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
