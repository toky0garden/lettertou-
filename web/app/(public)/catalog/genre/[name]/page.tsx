import { AspectRatio, Badge, Typography } from '@/components/ui';
import { genres, getGenreBySlug } from '@/components/catalog/genres';
import { GenreAnimeGrid } from '@/components/catalog/genre-anime-grid';
import Image from 'next/image';
import Link from 'next/link';

export function generateStaticParams() {
  return genres.map((genre) => ({ name: genre.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const slug = decodeURIComponent((await params).name);
  const genre = getGenreBySlug(slug);
  const title = genre?.title ?? slug;

  return {
    title: `${title} — аниме по жанру`,
    description: `Подборка аниме в жанре «${title.toLocaleLowerCase('ru')}».`
  };
}

export default async function GenrePage({ params }: { params: Promise<{ name: string }> }) {
  const slug = decodeURIComponent((await params).name);
  // Tags coming from Kodik may reference genres outside the curated list —
  // render a plain header for them instead of a 404.
  const genre = getGenreBySlug(slug);
  const title = genre?.title ?? slug.charAt(0).toLocaleUpperCase('ru') + slug.slice(1);

  return (
    <main className='container flex flex-col gap-8 py-8 sm:py-12'>
      <div className='bg-card grid overflow-hidden rounded-3xl border shadow-sm md:grid-cols-[minmax(280px,420px)_1fr]'>
        {genre && (
          <div className='bg-muted relative'>
            <AspectRatio ratio={230 / 181}>
              <Image
                alt=''
                className='size-full object-cover object-center select-none'
                fill
                quality={80}
                sizes='(max-width: 768px) 100vw, 420px'
                src={genre.image}
                priority
              />
            </AspectRatio>
            <div className='absolute inset-0 bg-gradient-to-t from-black/45 to-transparent md:bg-gradient-to-r' />
          </div>
        )}
        <div className='flex flex-col justify-center gap-5 p-6 sm:p-8'>
          <Badge variant='secondary' className='w-fit'>
            Жанр
          </Badge>
          <div className='flex flex-col gap-2'>
            <Typography h1 as='h1' className='text-3xl sm:text-4xl'>
              {title}
            </Typography>
            <Typography muted className='text-base'>
              Подборка аниме в жанре «{title.toLocaleLowerCase('ru')}».
            </Typography>
          </div>
          <Link
            href='/catalog'
            className='text-muted-foreground hover:text-foreground w-fit text-sm'
          >
            ← Вернуться ко всем жанрам
          </Link>
        </div>
      </div>

      <section aria-label='Аниме в жанре' className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <Typography h3 as='h2'>
            Аниме в жанре
          </Typography>
          <Typography muted>Отсортировано по рейтингу Shikimori</Typography>
        </div>

        <GenreAnimeGrid slug={slug} />
      </section>
    </main>
  );
}
