'use client';

import { useBoolean, useRefState } from '@siberiacancode/reactuse';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Button } from '../ui';
import { FrameContent, FrameModal } from './frame-modal';

interface FrameProps {
  screenshots: string[];
}

export function Frame({ screenshots }: FrameProps) {
  const [open, setOpen] = useBoolean(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevScreenshotRef = useRefState<HTMLButtonElement>();
  const nextScreenshotRef = useRefState<HTMLButtonElement>();

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
                  <Image
                    key={index}
                    alt={`Кадр ${index}`}
                    className='size-full h-[300px] w-auto cursor-pointer object-cover object-center select-none'
                    height={720}
                    quality={80}
                    src={screenshot}
                    width={1280}
                    decoding='sync'
                    loading='eager'
                    onClick={() => openScreenshot(index)}
                    priority
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

          <Button
            ref={prevScreenshotRef}
            className='absolute top-1/2 left-4 -translate-y-1/2 text-white'
            variant='secondary'
            onClick={prevScreenshot}
          >
            <ChevronLeft size={32} />
          </Button>
          <Button
            ref={nextScreenshotRef}
            className='rounded-fullp-2 absolute top-1/2 right-4 -translate-y-1/2 text-white'
            variant='secondary'
            onClick={nextScreenshot}
          >
            <ChevronRight size={32} />
          </Button>

          <div className='bg-muted absolute right-4 bottom-4 rounded-lg p-2 text-lg text-white'>
            {currentIndex + 1} / {screenshots.length}
          </div>
        </FrameContent>
      </FrameModal>
    </>
  );
}
