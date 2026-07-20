import { Play, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ROUTES, statusMapping, typeMapping } from '@/app/(constants)';
import { Description, DetailItem, Frame, ShareButton } from '@/components/anime';
import {
  AspectRatio,
  badgeVariants,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography
} from '@/components/ui';
import { cn } from '@/utils/lib/utils';
import { getTitle } from '@/shared/api';
import { AnimePlayer } from '../../../../../components/anime/AnimePlayer';
import type { AnimeSchema } from '@/shared/api/types.gen';

const fetchAnime = async (slug: string): Promise<AnimeSchema> =>
  (
    await getTitle({ query: { slug } }).catch(() => {
      console.error(`Anime not found: ${slug}`);
      notFound();
    })
  ).data as AnimeSchema;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const anime = await fetchAnime(slug);

  return {
    title: anime.title || '404',
    description: anime.description,
    alternates: {
      canonical: `/anime/title/${slug}`
    }
  };
}

export default async function AnimePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const anime = await fetchAnime(slug);
  const rating = anime.shikimori_rating ?? anime.kinopoisk_rating;

  return (
    <main className='container py-10 sm:py-12 lg:py-14'>
      <div className='grid items-start gap-8 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-10'>
        <aside className='flex w-full flex-col gap-3 max-md:mx-auto max-md:max-w-[220px]'>
          <div className='bg-card w-full overflow-hidden rounded-2xl border shadow-2xl shadow-black/30'>
            <AspectRatio ratio={2 / 3}>
              {anime.poster && (
                <Image
                  alt={anime.title ?? 'Poster'}
                  src={anime.poster}
                  fill
                  priority
                  quality={80}
                  sizes='(max-width: 640px) 210px, 220px'
                  className='object-cover object-center select-none'
                />
              )}
            </AspectRatio>
          </div>

          <Button size='lg' className='w-full'>
            <Play data-icon='inline-start' /> Смотреть
          </Button>

          <Button variant='secondary' size='lg' className='w-full'>
            <Star data-icon='inline-start' /> Избранное
          </Button>

          <ShareButton href={`/anime/title/${slug}`} />

          <div className='bg-card flex flex-col gap-4 rounded-xl border p-5 max-md:hidden'>
            <DetailItem danger label='Возрастное ограничение' value={`${anime.age_rating}+`} />
            <DetailItem label='Студия' value={anime.anime_studios?.join(', ') ?? ''} />
            <DetailItem
              label='Статус'
              value={statusMapping[anime.anime_status as keyof typeof statusMapping]}
            />
            <DetailItem label='Год выхода' value={anime.year as number} />
            <DetailItem label='Тип' value={typeMapping[anime.type!]} />
            <DetailItem label='Страна' value={anime.countries?.join(', ') ?? ''} />
            <DetailItem label='Продолжительность эпизода' value={`${anime.duration} мин.`} />
          </div>
        </aside>

        <div className='flex min-w-0 flex-col gap-6'>
          <header className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <Typography h2 as='h1' className='text-2xl sm:text-3xl lg:text-4xl'>
                {anime.title}
              </Typography>

              {rating && (
                <div className='bg-secondary text-secondary-foreground flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold'>
                  <Star fill='currentColor' />
                  {rating.toFixed(1)}
                </div>
              )}
            </div>

            <div className='flex flex-wrap gap-2'>
              {anime.tags?.map((tag) => (
                <Link
                  key={tag.id}
                  href={ROUTES.GENRE(tag.genre)}
                  className={cn(
                    badgeVariants({ variant: 'default' }),
                    'rounded-full px-3 py-2 text-sm'
                  )}
                >
                  {tag.genre.charAt(0).toUpperCase() + tag.genre.slice(1)}
                </Link>
              ))}
            </div>
          </header>

          <Description value={anime?.description} />

          {anime.screenshots && anime.screenshots.length > 0 && (
            <section className='flex min-w-0 flex-col gap-3'>
              <div className='flex items-baseline justify-between gap-4'>
                <Typography h3 as='h2' className='text-xl sm:text-2xl'>
                  Кадры
                </Typography>
                <span className='text-muted-foreground text-sm'>
                  {anime.screenshots.length} фото
                </span>
              </div>
              <Frame screenshots={anime.screenshots} title={anime.title} />
            </section>
          )}

          <Tabs defaultValue='player' className='mt-2'>
            <TabsList variant='line'>
              <TabsTrigger value='player'>Плеер</TabsTrigger>
              <TabsTrigger value='reviews'>Отзывы</TabsTrigger>
            </TabsList>
            <TabsContent value='player'>
              <AnimePlayer anime={anime} />
            </TabsContent>

            <TabsContent value='reviews'>
              <div>В процессе</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

export const revalidate = 600;
