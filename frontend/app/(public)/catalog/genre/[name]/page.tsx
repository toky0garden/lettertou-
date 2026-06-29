import { AspectRatio, Typography } from '@/components/ui';
import Image from 'next/image';

export default async function GenrePage({ params }: { params: { name: string } }) {
  const genre = decodeURIComponent(await params.name);

  return (
    <div className='container flex gap-6 pb-4 max-sm:flex-col'>
      <div className='flex w-full max-w-[220px] min-w-[220px] flex-col gap-2 max-sm:m-0 max-sm:max-w-[unset] max-sm:min-w-[unset] max-sm:items-center'>
        <div className='overflow-hidden rounded-md max-sm:h-[315px] max-sm:w-[210px]'>
          <AspectRatio ratio={2 / 3}>
            <Image
              alt={'Genre'}
              className='size-full object-cover object-center select-none'
              height={220}
              quality={80}
              src={'/catalog/sedze.png'}
              width={220}
              decoding='sync'
              loading='eager'
              priority
            />
          </AspectRatio>
        </div>

        <Typography h3 as='h1' className='text-2xl'>
          {genre}
        </Typography>
      </div>
      <div className='mt-3 mb-6 flex grow flex-col gap-2.5 max-sm:mt-0'>asd</div>
    </div>
  );
}
