'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='container-wrapper'>
      <div className='flex h-screen flex-col items-center justify-center gap-5'>
        <h1 className='text-center text-8xl font-bold'>404</h1>
        <p className='text-center text-4xl'>Страница с материалом не найдена</p>
        <Button
          nativeButton={false}
          render={<Link href='/' prefetch={true} />}
          className='mt-5 cursor-pointer py-5'
          variant='default'
        >
          Вернуться главную
        </Button>
      </div>
    </div>
  );
}
