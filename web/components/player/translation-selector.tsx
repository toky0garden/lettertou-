'use client';

import type { TranslationResponse } from '@/generated';
import {
  AudioLines,
  Captions,
  ChevronLeft,
  ChevronRight,
  Mic,
  StepBack,
  StepForward
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui';
import { useState } from 'react';

interface TranslationSelectorProps {
  title: string;
  selectedEpisode: number;
  translations: TranslationResponse[];
  selectedTranslation: TranslationResponse;
  setSelectedTranslation: (translation: TranslationResponse) => void;
}

export function TranslationSelector({
  title,
  selectedEpisode,
  translations,
  selectedTranslation,
  setSelectedTranslation
}: TranslationSelectorProps) {
  const TRANSLATIONS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(translations.length / TRANSLATIONS_PER_PAGE);

  const paginatedTranslations = translations.slice(
    (currentPage - 1) * TRANSLATIONS_PER_PAGE,
    currentPage * TRANSLATIONS_PER_PAGE
  );

  const getTranslationType = (translation: TranslationResponse) => {
    const title = translation.title.toLowerCase();

    if (title.includes('sub') || title.includes('суб')) {
      return 'captions';
    }

    return 'mic';
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col'>
        <p className='text-lg font-medium'>{title}</p>
        <p>{selectedEpisode} эпизод</p>
      </div>
      <div className='flex gap-2'>
        <Button
          className={cn(buttonVariants({ variant: 'secondary' }), 'bg-background')}
          size='icon'
        >
          <StepBack className='size-5' />
        </Button>
        <Sheet>
          <SheetTrigger
            render={<Button
              className={cn(buttonVariants({ variant: 'secondary' }), 'bg-background')}
              size='icon'
            />}
          >
              <AudioLines className='size-5' />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Выбрать озвучку</SheetTitle>
            </SheetHeader>
            <div className='grid flex-1 auto-rows-min items-center gap-6 px-4'>
              {paginatedTranslations.map((translation) => {
                const translationType = getTranslationType(translation);
                const Icon = translationType === 'captions' ? Captions : Mic;

                return (
                  <div
                    className='flex items-center gap-2'
                    key={translation.id}
                    onClick={() => setSelectedTranslation(translation)}
                  >
                    <Icon className='size-5' />
                    <p
                      className={cn(
                        'text-primary flex cursor-pointer items-center gap-3 text-left font-semibold',
                        selectedTranslation.id === translation.id &&
                          'font-bold underline underline-offset-8'
                      )}
                    >
                      {translation.title}
                    </p>
                  </div>
                );
              })}
              {totalPages > 1 && (
                <div className='flex gap-3'>
                  <Button
                    disabled={currentPage === 1}
                    className={cn(buttonVariants({ variant: 'secondary' }), 'bg-background')}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    disabled={currentPage === totalPages}
                    className={cn(buttonVariants({ variant: 'secondary' }), 'bg-background')}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Button
          className={cn(buttonVariants({ variant: 'secondary' }), 'bg-background')}
          size='icon'
        >
          <StepForward className='size-5' />
        </Button>
      </div>
    </div>
  );
}
