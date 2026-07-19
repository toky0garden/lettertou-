import { Skeleton } from '@/components/ui';

export default function GenreLoading() {
  return (
    <main className='container flex flex-col gap-8 py-8 sm:py-12'>
      <Skeleton className='h-64 w-full rounded-3xl' />
      <div className='flex flex-col gap-4'>
        <Skeleton className='h-8 w-56' />
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className='flex flex-col gap-3'>
              <Skeleton className='aspect-[2/3] w-full rounded-xl' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
