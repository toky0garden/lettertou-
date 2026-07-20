import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon, SparklesIcon } from 'lucide-react';

import { genres } from '@/components/catalog/genres';
import { Badge, Typography } from '@/components/ui';
import { getGenres } from '@/shared/api';
import type { GenreSchema } from '@/shared/api/types.gen';

const formatCount = new Intl.NumberFormat('ru-RU');

export default async function CatalogPage() {
  // Counts are decorative: the page must render even when the API is down.
  const counts = await getGenres({})
    .then((response) =>
      Object.fromEntries(
        (response.data as GenreSchema[]).map((genre) => [genre.slug, genre.count])
      )
    )
    .catch(() => ({}) as Record<string, number | null | undefined>);

  return (
    <main className='container-wrapper py-8 sm:py-12'>
      <div className='container flex flex-col gap-8'>
        <header className='bg-card relative overflow-hidden rounded-3xl border px-5 py-8 shadow-sm sm:px-8 sm:py-10'>
          <div className='bg-primary/5 pointer-events-none absolute -top-24 -right-20 size-64 rounded-full blur-3xl' />
          <div className='relative flex max-w-2xl flex-col gap-4'>
            <Badge variant='secondary' className='w-fit'>
              <SparklesIcon data-icon='inline-start' />
              {genres.length} направлений
            </Badge>
            <div className='flex flex-col gap-2'>
              <Typography h1 as='h1' className='text-3xl sm:text-4xl'>
                Найди историю по настроению
              </Typography>
              <Typography muted className='max-w-xl text-base'>
                От лёгкой романтики до мрачных психологических драм — выбери жанр и открой новую
                историю.
              </Typography>
            </div>
          </div>
        </header>

        <section aria-labelledby='genres-heading' className='flex flex-col gap-4'>
          <div className='flex items-end justify-between gap-4'>
            <div className='flex flex-col gap-1'>
              <Typography h3 as='h2'>
                Все жанры
              </Typography>
              <Typography muted>Выбирай то, что хочется посмотреть сегодня</Typography>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {genres.map((genre) => (
              <article key={genre.slug}>
                <Link
                  href={`/catalog/genre/${encodeURIComponent(genre.slug)}`}
                  className='group bg-muted focus-visible:ring-ring relative block aspect-[230/181] overflow-hidden rounded-2xl border shadow-sm transition-[transform,box-shadow] duration-600 outline-none hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2'
                >
                  <Image
                    alt=''
                    className='object-cover transition-transform duration-800 group-hover:scale-105'
                    fill
                    sizes='(max-width: 420px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw'
                    src={genre.image}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent' />
                  <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white'>
                    <span className='flex flex-col gap-0.5'>
                      <span className='text-base leading-tight font-semibold text-pretty'>
                        {genre.title}
                      </span>
                      {typeof counts[genre.slug] === 'number' && (
                        <span className='text-xs text-white/70'>
                          {formatCount.format(counts[genre.slug] as number)} тайтлов
                        </span>
                      )}
                    </span>
                    <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'>
                      <ArrowUpRightIcon className='size-4' aria-hidden='true' />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
