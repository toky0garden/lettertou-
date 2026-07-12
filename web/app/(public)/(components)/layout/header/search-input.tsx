'use client';

import type { AnimeResponse } from '@/generated';
import type { KeyboardEvent } from 'react';
import { useClickOutside, useDebounceValue } from '@siberiacancode/reactuse';
import { ArrowRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AnimeSearchResult } from '@/components/search/anime-search-result';
import { Button, Card, CardContent, CardFooter, Input, Skeleton } from '@/components/ui';
import { searchAnime } from '@/utils/api/request';

function SearchItemSkeleton() {
  return (
    <div className='flex gap-3 p-2'>
      <Skeleton className='h-20 w-14 shrink-0 rounded-md' />
      <div className='flex flex-1 flex-col justify-center gap-2'>
        <Skeleton className='h-4 w-4/5' />
        <Skeleton className='h-4 w-1/2' />
      </div>
    </div>
  );
}

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const router = useRouter();
  const debouncedQuery = useDebounceValue(query.trim(), 350);

  const closeSearch = useCallback(() => {
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  const containerRef = useClickOutside<HTMLDivElement>(closeSearch);

  const clearSearch = useCallback(() => {
    requestIdRef.current += 1;
    setQuery('');
    setResults([]);
    setIsLoading(false);
    inputRef.current?.focus();
  }, []);

  const goToFullSearch = useCallback(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 3) {
      toast.error('Введите не менее 3 символов');
      return;
    }
    router.push(`/catalog/search?query=${encodeURIComponent(normalizedQuery)}`);
    closeSearch();
  }, [closeSearch, query, router]);

  useEffect(() => {
    if (debouncedQuery.length < 3) return;

    const search = async () => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      try {
        const response = await searchAnime({
          params: { search: debouncedQuery, limit: 5 }
        });
        if (requestId === requestIdRef.current) {
          setResults(Array.isArray(response.data) ? response.data : [response.data]);
        }
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setResults([]);
          toast.error(error instanceof Error ? error.message : 'Не удалось выполнить поиск');
        }
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    };

    void search();
  }, [debouncedQuery]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') closeSearch();
    if (event.key === 'Enter') goToFullSearch();
  };

  return (
    <div ref={containerRef} className='relative w-full md:w-100 lg:w-150'>
      <Search
        className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2'
        aria-hidden='true'
      />
      <Input
        ref={inputRef}
        value={query}
        onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          setOpen(true);
          if (nextQuery.trim().length < 3) {
            requestIdRef.current += 1;
            setResults([]);
            setIsLoading(false);
          }
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className='h-10 rounded-xl pr-10 pl-10 shadow-sm'
        placeholder='Найти аниме…'
        aria-label='Быстрый поиск аниме'
        aria-expanded={open}
      />

      {query && (
        <Button
          type='button'
          size='icon-sm'
          variant='ghost'
          className='absolute top-1/2 right-2 -translate-y-1/2'
          onClick={clearSearch}
          aria-label='Очистить поиск'
        >
          <X />
        </Button>
      )}

      {open && (
        <Card className='absolute top-full mt-2 w-full gap-0 overflow-hidden py-0 shadow-xl'>
          <CardContent className='flex max-h-[min(65vh,32rem)] flex-col gap-1 overflow-y-auto p-2'>
            {query.trim().length < 3 ? (
              <div className='flex min-h-28 flex-col items-center justify-center gap-2 px-4 text-center'>
                <Search className='text-muted-foreground' aria-hidden='true' />
                <p className='text-sm font-medium'>Быстрый поиск по каталогу</p>
                <p className='text-muted-foreground text-xs'>Введите минимум три символа</p>
              </div>
            ) : isLoading ? (
              <>
                <SearchItemSkeleton />
                <SearchItemSkeleton />
                <SearchItemSkeleton />
              </>
            ) : results.length ? (
              results.map((anime) => (
                <AnimeSearchResult key={anime.id} anime={anime} compact onNavigate={closeSearch} />
              ))
            ) : (
              <div className='flex min-h-28 flex-col items-center justify-center gap-2 px-4 text-center'>
                <p className='text-sm font-medium'>Ничего не найдено</p>
                <p className='text-muted-foreground text-xs'>
                  Попробуйте другое написание названия
                </p>
              </div>
            )}
          </CardContent>

          {query.trim().length >= 3 && (
            <CardFooter className='bg-muted/40 border-t p-2'>
              <Button
                nativeButton={false}
                render={<Link href={`/catalog/search?query=${encodeURIComponent(query.trim())}`} />}
                variant='ghost'
                className='w-full justify-between'
                onClick={closeSearch}
              >
                Все результаты
                <ArrowRight data-icon='inline-end' />
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
