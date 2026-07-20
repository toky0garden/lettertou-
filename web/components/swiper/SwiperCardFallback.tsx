import { Skeleton } from '../ui';

// Один в один повторяет геометрию SwiperCard: постер 2:3 + две строки названия.
export function SwiperCardFallback() {
  return (
    <div className='flex w-36 shrink-0 flex-col gap-3 sm:w-40 lg:w-44 xl:w-48'>
      <Skeleton className='aspect-[2/3] w-full rounded-xl' />
      <div className='flex min-h-10 flex-col gap-1.5'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </div>
    </div>
  );
}

// Ряд карточек с теми же отступами, что и лента в SwiperList.
export function SwiperListFallback({ count = 8 }: { count?: number }) {
  return (
    <div className='flex flex-nowrap gap-4 overflow-hidden pb-4 sm:gap-5 lg:gap-6'>
      {Array.from({ length: count }, (_, index) => (
        <SwiperCardFallback key={index} />
      ))}
    </div>
  );
}
