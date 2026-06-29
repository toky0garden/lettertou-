import { SwiperList } from '@/components/swiper';
import { Typography } from '@/components/ui';
import { getSwiper } from '@/utils/api/request';

export default async function RootPage() {
  const getSwiperResponse = await getSwiper({});

  return (
    <div className='my-4 space-y-6'>
      <div className='space-y-2 lg:container'>
        <Typography h4 as={'h3'} className='mb-2'>
          Популярное
        </Typography>
        <SwiperList data={getSwiperResponse.data} />
      </div>
    </div>
  );
}

export const revalidate = 3600;
