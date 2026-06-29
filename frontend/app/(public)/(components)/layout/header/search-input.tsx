'use client';

import type { AnimeResponse } from 'generated';
import type { KeyboardEvent } from 'react';
import { useBoolean, useDebounceValue } from '@siberiacancode/reactuse';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ROUTES, statusMapping, typeMapping } from '@/app/(constants)';
import { AspectRatio, Input, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';
import { searchAnime } from '@/utils/api/request';

interface SearchItemProps {
  className?: string;
  anime: Pick<AnimeResponse, 'anime_status' | 'id' | 'poster' | 'slug' | 'title' | 'type' | 'year'>;
  onNavigate: () => void;
}

function SearchItem({ anime, className, onNavigate }: SearchItemProps) {
  return (
    <Link
      href={ROUTES.ANIME(anime.slug.replace(/\s+/g, '_'))}
      prefetch={true}
      className={cn(
        'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 ease-out',
        className
      )}
      onClick={onNavigate}
    >
      <div className='w-14 max-w-[56px] min-w-[56px] overflow-hidden rounded border'>
        <AspectRatio ratio={2 / 3}>
          {anime.poster && (
            <Image
              alt={anime.slug ?? 'Poster'}
              className='relative size-full object-cover object-center'
              height={56}
              quality={65}
              src={anime.poster}
              width={56}
              decoding='sync'
              loading='eager'
              priority
            />
          )}
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

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeResponse[]>([]);
  const [open, setOpen] = useBoolean(false);
  const [isLoading, setIsLoading] = useBoolean(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounceValue(query, 500);
  const router = useRouter();

  const handleSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await searchAnime({
        params: {
          search: query
        }
      });
      setResults(Array.isArray(response.data) ? response.data : [response.data]);
      setIsLoading(false);
    } catch (error) {
      toast.error(`Произошла ошибка, попробуйте позже. ${error}`);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() && query.length >= 3) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [containerRef]);

  const handleNavigate = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
  }, [setOpen]);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (query.length < 3) {
        toast.error('Для поиска нужно не менее 3 слов');
        return;
      }

      if (query.length > 25) {
        toast.error('Слишком много слов для поиска');
        return;
      }

      router.push(`/catalog/search?query=${query}`);
      handleNavigate();
    }
  };

  return (
    <>
      <div ref={containerRef} className='relative md:block md:w-100 lg:w-175'>
        <Search
          className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'
          size={20}
        />
        <Input
          ref={inputRef}
          className='pl-10'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder='Поиск...'
        />
        {open && (
          <div className='bg-muted absolute mt-2 flex min-h-25 w-full flex-col rounded-md border-2 shadow-lg'>
            <div className='ml-auto flex pt-2 pr-2'>
              <X className='cursor-pointer' onClick={() => setOpen(false)} />
            </div>

            {results.length !== 0 ? (
              <div className='max-h-[80vh] overflow-y-auto'>
                {results.map((anime) => (
                  <SearchItem key={anime.id} anime={anime} onNavigate={handleNavigate} />
                ))}
                <p className='mr-2 flex justify-end'>
                  Если хотите больше информации, нажмите Enter
                </p>
              </div>
            ) : isLoading ? (
              <>
                <SearchItemSkeleton />
                <SearchItemSkeleton />
                <SearchItemSkeleton />
              </>
            ) : (
              <p className='text-center'>По вашему запросу ничего не найдено</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export function SearchItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 px-4 py-2 text-sm', className)}>
      <div className='bg-muted w-14 max-w-[56px] min-w-[56px] overflow-hidden rounded border'>
        <AspectRatio ratio={2 / 3}>
          <Skeleton className='h-full w-full' />
        </AspectRatio>
      </div>
      <div className='flex flex-1 flex-col gap-1 py-1.5'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
        <Skeleton className='h-3 w-1/3' />
      </div>
    </div>
  );
}
