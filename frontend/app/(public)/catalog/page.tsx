import Image from 'next/image';
import Link from 'next/link';
import { AspectRatio, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function CatalogPage() {
  const genres = [
    { title: 'экшен', image: '/catalog/action.png' },
    { title: 'фэнтези', image: '/catalog/fantasy.png' },
    { title: 'комедия', image: '/catalog/comedy.png' },
    { title: 'приключения', image: '/catalog/adventure.png' },
    { title: 'сёнен', image: '/catalog/shounen.png' },
    { title: 'школа', image: '/catalog/school.png' },
    { title: 'романтика', image: '/catalog/romance.png' },
    { title: 'драма', image: '/catalog/drama.png' },
    { title: 'фантастика', image: '/catalog/fantastic.png' },
    { title: 'сверхъестественное', image: '/catalog/supernatural.png' },
    { title: 'сэйнэн', image: '/catalog/shounen.png' },
    { title: 'тайна', image: '/catalog/secret.jpg' },
    { title: 'исторический', image: '/catalog/history.jpg' },
    { title: 'исэкай', image: '/catalog/isakei.png' },
    { title: 'триллер', image: '/catalog/thriller.png' },
    { title: 'гарем', image: '/catalog/harem.png' },
    { title: 'повседневность', image: '/catalog/everydaylife.png' },
    { title: 'психологическое', image: '/catalog/psychological.png' },
    { title: 'военное', image: '/catalog/military.jpg' },
    { title: 'боевые искусства', image: '/catalog/martial_arts.jpg' },
    { title: 'реинкарнация', image: '/catalog/reincarnation.png' },
    { title: 'меха', image: '/catalog/meha.png' },
    { title: 'ужасы', image: '/catalog/horror.png' },
    { title: 'сёдзё', image: '/catalog/sedze.png' },
    { title: 'спорт', image: '/catalog/sport.png' },
    { title: 'музыка', image: '/catalog/music.png' },
    { title: 'вампиры', image: '/catalog/vamp.png' },
    { title: 'детектив', image: '/catalog/detective.png' }
  ];
  return (
    <div className='container-wrapper mt-5'>
      <div className='lg:container'>
        <Typography h4 as={'h3'} className='mb-3'>
          Жанры
        </Typography>
        <div className='grid grid-cols-10 gap-4'>
          {genres.map((genre) => (
            <div key={genre.title} className={cn('relative flex w-36 max-w-full flex-col gap-1')}>
              <Link href='/' prefetch={true}>
                <div className='bg-primary/10 w-full overflow-hidden rounded-sm transition-all duration-300 ease-out select-none hover:brightness-125'>
                  <AspectRatio ratio={2 / 3}>
                    <Image
                      alt={'Genre'}
                      className='pointer-events-none relative size-full object-cover object-center select-none'
                      height={200}
                      quality={65}
                      src={genre.image}
                      width={200}
                      decoding='sync'
                      loading={'eager'}
                      priority
                    />
                  </AspectRatio>
                </div>
              </Link>

              <Link
                href='/'
                prefetch={true}
                className='line-clamp-2 w-full text-sm text-pretty text-ellipsis'
              >
                {genre.title.charAt(0).toUpperCase() + genre.title.slice(1)}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
