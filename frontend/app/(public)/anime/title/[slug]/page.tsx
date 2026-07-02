import { CopyIcon, Play, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ROUTES, statusMapping, typeMapping } from '@/app/(constants)';
import { Description, DetailItem, Frame } from '@/components/anime';
import {
  AspectRatio,
  badgeVariants,
  Button,
  buttonVariants,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { getAnime } from '@/utils/api/request';
import { AnimePlayer } from '../../../../../components/anime/anime-player';
import { AnimeResponse } from '@/generated';

const fetchAnime = async (slug: string): Promise<AnimeResponse> =>
  (
    await getAnime({ params: { slug } }).catch(() => {
      console.error(`Anime not found: ${slug}`);
      notFound();
    })
  ).data;

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
  console.log(anime);

  return (
    <>
      <div className='relative h-[320px] overflow-hidden md:h-[380px] lg:h-[430px]'>
        <Image
          fill
          priority
          alt={`${anime.title ?? 'Anime'} banner`}
          src={anime.poster!}
          className='scale-105 object-cover object-center blur-sm'
          sizes='100vw'
        />

        {/* затемнение всего баннера */}
        <div className='absolute inset-0 bg-black/45' />

        {/* затемнение сверху для хедера */}
        <div className='absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 via-black/30 to-transparent' />

        {/* затемнение снизу, чтобы контент снизу читался лучше */}
        <div className='from-background via-background/85 absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent' />
      </div>
      <div className='relative z-10 container -mt-24 flex gap-6 pb-6 max-sm:mt-0 max-sm:flex-col md:-mt-28 lg:-mt-52'>
        <div className='flex w-full max-w-[220px] min-w-[220px] flex-col gap-3 max-sm:m-0 max-sm:max-w-[unset] max-sm:min-w-[unset] max-sm:items-center'>
          <div className='bg-card w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/40 max-sm:h-[315px] max-sm:w-[210px]'>
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

          <Button className={cn(buttonVariants({ variant: 'ghost' }), 'w-full p-4.5')}>
            <Play /> Смотреть
          </Button>

          <Button className={cn(buttonVariants({ variant: 'default' }), 'w-full p-4.5')}>
            <Star /> Избранное
          </Button>

          <Button className={cn(buttonVariants({ variant: 'outline' }), 'w-full p-4.5 text-white')}>
            <CopyIcon className='size-4' /> Поделиться
          </Button>

          <div className='flex flex-col gap-3 rounded-sm border p-5 max-sm:hidden'>
            <DetailItem danger label='Возрастное ограничение' value={`${anime.age_rating}+`} />
            <DetailItem label='Студия' value={anime.anime_studios as string} />
            <DetailItem
              label='Статус'
              value={statusMapping[anime.anime_status as keyof typeof statusMapping]}
            />
            <DetailItem label='Год выхода' value={anime.year as number} />
            <DetailItem label='Тип' value={typeMapping[anime.type!]} />
            <DetailItem label='Страна' value={anime.countries as string} />
            {!anime.seasons && (
              <DetailItem label='Продолжительность эпизода' value={`${anime.duration} мин.`} />
            )}
          </div>
        </div>

        <div className='mt-3 mb-6 flex grow flex-col gap-2.5 max-sm:mt-0'>
          <div className='flex flex-col'>
            <div className='mb-2 flex items-center'>
              <Typography h3 as='h1' className='mr-2 text-2xl'>
                {anime.title}
              </Typography>

              <Star className='mr-1' fill='#FFD700' size={20} stroke='#FFD700' />
              {anime.shikimori_rating ||
                (anime.kinopoisk_rating && (
                  <p className='flex items-center font-bold'>
                    <span>
                      {anime.shikimori_rating?.toFixed(1) || anime.kinopoisk_rating?.toFixed(1)}
                    </span>
                  </p>
                ))}
            </div>

            <div className='flex flex-wrap gap-2'>
              {anime.tags!.map((tag) => (
                <Link
                  key={tag.id}
                  href={ROUTES.GENRE(tag.genre)}
                  className={cn(
                    badgeVariants({ variant: 'default' }),
                    'rounded-md px-2 py-3 text-sm font-bold'
                  )}
                >
                  {tag.genre.charAt(0).toUpperCase() + tag.genre.slice(1)}
                </Link>
              ))}
            </div>

            {/* <p className={cn('text-muted-foreground', 'text-md')}>{anime?.slug}</p> */}
          </div>

          <Description value={anime?.description} />

          {anime.screenshots && (
            <div className='mt-3 mb-3 flex w-full flex-col gap-3'>
              <Typography h4 as='h3'>
                Кадры
              </Typography>
              <Frame screenshots={anime.screenshots} />
            </div>
          )}

          <Tabs defaultValue='player'>
            <TabsList className='my-2 bg-transparent' variant='line'>
              <TabsTrigger className='cursor-pointer' value='reviews'>
                Отзывы
              </TabsTrigger>
              <TabsTrigger className='cursor-pointer' value='player'>
                Плеер
              </TabsTrigger>
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
    </>
  );
}

export const revalidate = 600;
