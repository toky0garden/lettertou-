import { SwiperList } from '@/components/swiper';
import { Typography } from '@/components/ui';
import { getSwiper } from '@/utils/api/request';

export default async function RootPage() {
  const getSwiperResponse = await getSwiper({});

  return (
    <div className='py-8 sm:py-10 lg:py-12'>
      <section className='container flex flex-col gap-5'>
        <div className='flex items-end justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <Typography h3 as='h1'>
              Популярное
            </Typography>
            <Typography muted>То, что сейчас смотрят чаще всего</Typography>
          </div>
        </div>

        <SwiperList data={getSwiperResponse.data} />
      </section>
    </div>
  );
}

export const revalidate = 3600;
