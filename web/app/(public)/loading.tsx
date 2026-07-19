import { Skeleton } from '@/components/ui';

export default function HomeLoading() {
  return (
    <div className='flex flex-col gap-12 py-8 sm:gap-14 sm:py-10 lg:gap-16 lg:py-12'>
      <section className='container'>
        <Skeleton className='h-[380px] w-full rounded-3xl sm:h-[440px] lg:h-[520px]' />
      </section>

      {Array.from({ length: 2 }, (_, section) => (
        <section key={section} className='container flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-7 w-48' />
            <Skeleton className='h-4 w-64' />
          </div>
          <div className='flex gap-4 sm:gap-5 lg:gap-6'>
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className='flex w-36 shrink-0 flex-col gap-3 sm:w-40 lg:w-44 xl:w-48'>
                <Skeleton className='aspect-[2/3] w-full rounded-xl' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className='container flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-7 w-32' />
          <Skeleton className='h-4 w-56' />
        </div>
        <div className='grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
          {Array.from({ length: 12 }, (_, index) => (
            <Skeleton key={index} className='aspect-square w-full rounded-2xl' />
          ))}
        </div>
      </section>
    </div>
  );
}
