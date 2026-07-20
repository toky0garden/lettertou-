import { HomeGenresFallback, HomeHeroFallback } from '@/components/home';
import { SwiperListFallback } from '@/components/swiper';
import { Skeleton } from '@/components/ui';

function SectionHeaderFallback() {
  return (
    <div className='flex items-end justify-between gap-4'>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-7 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>
      <Skeleton className='hidden h-4 w-24 sm:block' />
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className='flex flex-col gap-12 py-8 sm:gap-14 sm:py-10 lg:gap-16 lg:py-12'>
      <HomeHeroFallback />

      {Array.from({ length: 2 }, (_, section) => (
        <section key={section} className='container flex flex-col gap-5'>
          <SectionHeaderFallback />
          <SwiperListFallback />
        </section>
      ))}

      <section className='container flex flex-col gap-5'>
        <SectionHeaderFallback />
        <HomeGenresFallback />
      </section>
    </div>
  );
}
