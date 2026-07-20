'use client';

import type { ShortAnimeSchema } from '@/shared/api/types.gen';
import { LoaderCircle, Search, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AnimeSearchResult } from '@/components/search/AnimeSearchResult';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Skeleton
} from '@/components/ui';
import { getShortSearch } from '@/shared/api';

function ResultSkeleton() {
  return (
    <div className='flex gap-4 rounded-lg border p-3'>
      <Skeleton className='h-32 w-22 shrink-0 rounded-md' />
      <div className='flex flex-1 flex-col justify-center gap-3'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-5 w-1/2' />
        <div className='flex gap-2'>
          <Skeleton className='h-5 w-20 rounded-full' />
          <Skeleton className='h-5 w-14 rounded-full' />
        </div>
      </div>
    </div>
  );
}

function CatalogSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsQuery = searchParams.get('query')?.trim() || '';
  const [query, setQuery] = useState(paramsQuery);
  const [results, setResults] = useState<ShortAnimeSchema[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(Boolean(paramsQuery));

  const handleSearch = useCallback(
    async (searchQuery = query) => {
      const normalizedQuery = searchQuery.trim();
      if (normalizedQuery.length < 3) {
        toast.error('Введите не менее 3 символов');
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      try {
        const response = await getShortSearch({
          query: { search: normalizedQuery, limit: 20 }
        });
        setResults(response.data as ShortAnimeSchema[]);
        router.replace(`/catalog/search?query=${encodeURIComponent(normalizedQuery)}`, {
          scroll: false
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Не удалось выполнить поиск');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [query, router]
  );

  useEffect(() => {
    if (paramsQuery) handleSearch(paramsQuery);
  }, []);

  return (
    <main className='container-wrapper min-h-screen px-4 pt-28 pb-16 sm:px-6'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-8'>
        <section className='flex flex-col gap-3'>
          <Badge variant='secondary' className='w-fit'>
            <Sparkles data-icon='inline-start' />
            Каталог Kodik
          </Badge>
          <h1 className='max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            Найдите аниме для следующего просмотра
          </h1>
          <p className='text-muted-foreground max-w-2xl text-base sm:text-lg'>
            Ищите по русскому, английскому или оригинальному названию.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Расширенный поиск</CardTitle>
            <CardDescription>
              Введите название — покажем до 20 наиболее подходящих тайтлов.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className='flex flex-col gap-3 sm:flex-row'
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
            >
              <div className='relative flex-1'>
                <Search
                  className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2'
                  aria-hidden='true'
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className='h-11 pl-10'
                  placeholder='Например, Баскетбол Куроко'
                  aria-label='Название аниме'
                  autoFocus
                />
              </div>
              <Button type='submit' size='lg' disabled={isLoading || query.trim().length < 3}>
                {isLoading ? (
                  <LoaderCircle data-icon='inline-start' className='animate-spin' />
                ) : (
                  <Search data-icon='inline-start' />
                )}
                Найти
              </Button>
            </form>
          </CardContent>
        </Card>

        <section className='flex flex-col gap-4' aria-live='polite'>
          <div className='flex items-end justify-between gap-4'>
            <div>
              <h2 className='text-xl font-semibold'>Результаты</h2>
              <p className='text-muted-foreground text-sm'>
                {isLoading
                  ? 'Ищем совпадения…'
                  : results.length
                    ? `Найдено: ${results.length}`
                    : hasSearched
                      ? 'Совпадений не найдено'
                      : 'Начните с названия тайтла'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className='grid gap-3 md:grid-cols-2'>
              {Array.from({ length: 6 }, (_, index) => (
                <ResultSkeleton key={index} />
              ))}
            </div>
          ) : results.length ? (
            <div className='grid gap-3 md:grid-cols-2'>
              {results.map((anime) => (
                <AnimeSearchResult key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className='flex min-h-48 flex-col items-center justify-center gap-2 text-center'>
                <Search className='text-muted-foreground' aria-hidden='true' />
                <p className='font-medium'>
                  {hasSearched ? 'Попробуйте другое название' : 'Здесь появятся результаты'}
                </p>
                <p className='text-muted-foreground max-w-md text-sm'>
                  {hasSearched
                    ? 'Проверьте написание или используйте оригинальное название аниме.'
                    : 'Введите минимум три символа в строку поиска выше.'}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}

export default function CatalogSearchPage() {
  return (
    <Suspense fallback={<div className='container-wrapper min-h-screen' />}>
      <CatalogSearchContent />
    </Suspense>
  );
}
