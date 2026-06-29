import { TabsContent } from '@radix-ui/react-tabs';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import { ROUTES, statusMapping, typeMapping } from '@/app/(constants)';
import { Description, DetailItem, Frame } from '@/components/anime';
import {
  AspectRatio,
  badgeVariants,
  Button,
  buttonVariants,
  Tabs,
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

  return (
    <>
      <div className='bg-muted relative h-80 overflow-hidden'>
        <Image
          fill
          alt={'banner'}
          className={cn('size-full object-cover object-center', 'blur-sm')}
          src={anime.poster!}
        />
      </div>
      <div className='container flex gap-6 pb-4 max-sm:flex-col'>
        <div className='flex w-full max-w-[220px] min-w-[220px] flex-col gap-3 max-sm:m-0 max-sm:max-w-[unset] max-sm:min-w-[unset] max-sm:items-center'>
          <div className='overflow-hidden rounded-md max-sm:h-[315px] max-sm:w-[210px]'>
            <AspectRatio ratio={2 / 3}>
              {anime.poster && (
                <Image
                  alt={anime.title ?? 'Poster'}
                  className='size-full object-cover object-center select-none'
                  height={220}
                  quality={80}
                  src={anime.poster}
                  width={220}
                  decoding='sync'
                  loading='eager'
                  priority
                />
              )}
            </AspectRatio>
          </div>

          <Button className={cn(buttonVariants({ variant: 'default' }), 'w-full p-4.5')}>
            <Star /> Избранное
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
          <div className='flex justify-between'>
            <div>
              <Typography h3 as='h1' className='text-2xl'>
                {anime.title}
              </Typography>
              <p className={cn('text-muted-foreground', 'text-md')}>{anime?.slug}</p>
            </div>
            <div>
              {anime.shikimori_rating ||
                (anime.kinopoisk_rating && (
                  <p className='flex items-center font-semibold'>
                    <Star className='mr-1' fill='#FFD700' size={20} stroke='#FFD700' />
                    <span>
                      {anime.shikimori_rating?.toFixed(1) || anime.kinopoisk_rating?.toFixed(1)}
                    </span>
                  </p>
                ))}
              <p className={cn('text-muted-foreground', 'text-md')}>999 оценок</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {anime.tags!.map((tag) => (
              <Link
                key={tag.id}
                href={ROUTES.GENRE(tag.genre)}
                className={cn(badgeVariants({ variant: 'outline' }), 'px-2 text-sm font-bold')}
              >
                {tag.genre.charAt(0).toUpperCase() + tag.genre.slice(1)}
              </Link>
            ))}
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
            <TabsList className='my-2 bg-transparent'>
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
