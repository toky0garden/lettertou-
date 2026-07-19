'use client';

import { useHotkeys, useLockScroll, useSwipe } from '@siberiacancode/reactuse';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/utils/lib/utils';
import { FrameCard } from './frame-card';

interface FrameProps {
  screenshots: string[];
  title?: string | null;
}

export function Frame({ screenshots, title }: FrameProps) {
  const validScreenshots = screenshots.filter(Boolean);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  useLockScroll({ enabled: open });

  const swipe = useSwipe<HTMLDivElement>({
    threshold: 64,
    onEnd: ({ direction }) => {
      if (!open || validScreenshots.length < 2) return;
      if (direction === 'left') showNext();
      if (direction === 'right') showPrevious();
    }
  });

  const openScreenshot = useCallback((index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  }, []);

  const showPrevious = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + validScreenshots.length) % validScreenshots.length);
  }, [validScreenshots.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % validScreenshots.length);
  }, [validScreenshots.length]);

  useHotkeys(
    'arrowleft, arrowright',
    (event) => {
      const target = event.target;
      const isTextControl =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if (isTextControl) return;
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    },
    { enabled: open && validScreenshots.length > 1 }
  );

  if (validScreenshots.length === 0) return null;

  return (
    <>
      <div className='-mx-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0'>
        <div className='flex w-max gap-3 sm:gap-4'>
          {validScreenshots.map((screenshot, index) => (
            <FrameCard
              src={screenshot}
              key={`${screenshot}-${index}`}
              index={index}
              total={validScreenshots.length}
              onClick={() => openScreenshot(index)}
            />
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className='top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none bg-black/95 p-0 text-white ring-0 sm:max-w-none'
        >
          <DialogTitle className='sr-only'>Кадры из аниме {title}</DialogTitle>
          <DialogDescription className='sr-only'>
            Используйте стрелки для переключения между кадрами
          </DialogDescription>

          <div
            ref={swipe.ref}
            className='relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-3 py-12 sm:px-12 sm:py-10 lg:px-24'
          >
            <Image
              key={validScreenshots[currentIndex]}
              alt={`Кадр ${currentIndex + 1} из аниме ${title ?? ''}`}
              className='h-auto max-h-[82dvh] w-auto max-w-[92vw] object-contain shadow-2xl ring-1 ring-white/10 select-none'
              width={1600}
              height={900}
              priority
              quality={95}
              sizes='92vw'
              src={validScreenshots[currentIndex]}
            />

            {validScreenshots.length > 1 && (
              <>
                <Button
                  variant='secondary'
                  size='icon-lg'
                  className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/85 text-black opacity-90 shadow-lg hover:bg-white sm:left-5'
                  onClick={showPrevious}
                  aria-label='Предыдущий кадр'
                >
                  <ChevronLeft data-icon='inline-start' />
                </Button>
                <Button
                  variant='secondary'
                  size='icon-lg'
                  className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/85 text-black opacity-90 shadow-lg hover:bg-white sm:right-5'
                  onClick={showNext}
                  aria-label='Следующий кадр'
                >
                  <ChevronRight data-icon='inline-start' />
                </Button>
              </>
            )}

            <DialogClose
              render={
                <Button
                  variant='secondary'
                  size='icon-lg'
                  className='absolute top-3 right-3 rounded-full bg-white/85 text-black shadow-lg hover:bg-white sm:top-5 sm:right-5'
                  aria-label='Закрыть просмотр кадра'
                />
              }
            >
              <X data-icon='inline-start' />
            </DialogClose>

            <p className='absolute bottom-5 left-4 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:left-6'>
              <Images data-icon='inline-start' />
              <span className='truncate'>
                Кадр {currentIndex + 1} из {validScreenshots.length}
                {title ? ` · ${title}` : ''}
              </span>
            </p>
          </div>

          {validScreenshots.length > 1 && (
            <div className='border-t border-white/10 bg-black/80 px-3 py-3 sm:px-6'>
              <div className='flex gap-2 overflow-x-auto pb-1'>
                {validScreenshots.map((screenshot, index) => (
                  <Button
                    key={`${screenshot}-${index}`}
                    variant='ghost'
                    className={cn(
                      'h-14 w-24 shrink-0 overflow-hidden rounded-md border border-white/10 p-0 opacity-55 hover:opacity-100 sm:h-16 sm:w-28',
                      index === currentIndex && 'border-white opacity-100 ring-2 ring-white/40'
                    )}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Открыть кадр ${index + 1}`}
                  >
                    <Image
                      alt=''
                      src={screenshot}
                      width={160}
                      height={90}
                      className='size-full object-cover'
                    />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
