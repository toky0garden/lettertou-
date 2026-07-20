import { Skeleton } from '../ui';

export function HomeHeroFallback() {
  return (
    <section className='container'>
      <Skeleton className='min-h-[380px] w-full rounded-3xl sm:min-h-[440px] lg:min-h-[520px]' />
    </section>
  );
}
