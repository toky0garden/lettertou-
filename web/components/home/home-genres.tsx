import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';

import { genres } from '@/components/catalog/genres';

// A compact preview of the catalog on the home page: the first handful of
// genres as square cards. The full grid lives on /catalog.
const PREVIEW_COUNT = 12;

export function HomeGenres() {
  const preview = genres.slice(0, PREVIEW_COUNT);

  return (
    <div className='grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
      {preview.map((genre) => (
        <Link
          key={genre.slug}
          href={`/catalog/genre/${encodeURIComponent(genre.slug)}`}
          className='group bg-muted focus-visible:ring-ring relative block aspect-square overflow-hidden rounded-2xl border shadow-sm transition-[transform,box-shadow] duration-600 outline-none hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2'
        >
          <Image
            alt=''
            className='object-cover transition-transform duration-800 group-hover:scale-105'
            fill
            sizes='(max-width: 420px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw'
            src={genre.image}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent' />
          <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white'>
            <span className='text-sm leading-tight font-semibold text-pretty'>{genre.title}</span>
            <span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'>
              <ArrowUpRightIcon className='size-3.5' aria-hidden='true' />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
