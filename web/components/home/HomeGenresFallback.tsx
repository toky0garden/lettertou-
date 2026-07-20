import { Skeleton } from '../ui';

export function HomeGenresFallback() {
  return (
    <div className='grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className='aspect-square rounded-2xl' />
      ))}
    </div>
  );
}
