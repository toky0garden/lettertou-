'use client';

import { Expand } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui';

interface FrameCardProps {
  src: string;
  index: number;
  total: number;
  onClick: () => void;
}

export function FrameCard({ src, index, total, onClick }: FrameCardProps) {
  return (
    <Button
      variant='ghost'
      className='group relative h-36 w-64 shrink-0 overflow-hidden rounded-xl border p-0 shadow-sm sm:h-44 sm:w-80 lg:h-48 lg:w-[350px]'
      onClick={onClick}
      aria-label={`Открыть кадр ${index + 1} из ${total}`}
    >
      <Image
        alt={`Кадр ${index + 1}`}
        className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
        fill
        quality={75}
        src={src}
        sizes='(max-width: 640px) 256px, 350px'
        priority={index === 0}
      />
      <span className='absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100' />
      <span className='absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
        <Expand />
        Открыть
      </span>
    </Button>
  );
}
