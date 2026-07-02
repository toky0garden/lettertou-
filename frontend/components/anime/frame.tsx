'use client';

import { useBoolean, useRefState } from '@siberiacancode/reactuse';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { FrameContent, FrameModal } from './frame-modal';
import { FrameCard } from './frame-card';

interface FrameProps {
  screenshots: string[];
}

export function Frame({ screenshots }: FrameProps) {
  console.log(screenshots);
  const [open, setOpen] = useBoolean(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openScreenshot = useCallback((index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  }, []);

  const prevScreenshot = () =>
    setCurrentIndex((i) => (i - 1 + screenshots.length) % screenshots.length);
  const nextScreenshot = () => setCurrentIndex((i) => (i + 1) % screenshots.length);

  return (
    <>
      <div className='flex flex-nowrap gap-2 overflow-x-hidden'>
        {screenshots.length > 0 &&
          screenshots
            .slice(0, 3)
            .map(
              (screenshot, index) =>
                screenshot && (
                  <FrameCard
                    src={screenshot}
                    key={index}
                    index={index}
                    onClick={() => openScreenshot(index)}
                  />
                )
            )}
      </div>
      <FrameModal onOpenChange={setOpen} open={open}>
        <FrameContent className='max-h-[90vh] max-w-5xl overflow-hidden rounded-lg bg-black p-0'>
          <Image
            alt={`Кадр ${currentIndex}`}
            className='h-full w-full rounded-md object-contain'
            height={720}
            quality={80}
            src={screenshots[currentIndex]}
            width={1280}
          />

          {/* Левая зона */}
          <button
            type='button'
            className='group absolute inset-y-0 left-0 w-1/2 cursor-pointer border-none bg-transparent outline-none'
            onClick={prevScreenshot}
            aria-label='Предыдущий кадр'
          >
            <span className='absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
              <ChevronLeft size={32} />
            </span>
          </button>

          {/* Правая зона */}
          <button
            type='button'
            className='group absolute inset-y-0 right-0 w-1/2 cursor-pointer border-none bg-transparent outline-none'
            onClick={nextScreenshot}
            aria-label='Следующий кадр'
          >
            <span className='absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
              <ChevronRight size={32} />
            </span>
          </button>

          <div className='bg-muted absolute right-4 bottom-4 rounded-lg p-2 text-lg text-white'>
            {currentIndex + 1} / {screenshots.length}
          </div>
        </FrameContent>
      </FrameModal>
    </>
  );
}
