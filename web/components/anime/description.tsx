/* eslint-disable azure-jsx-a11y/click-events-have-key-events */
/* eslint-disable azure-jsx-a11y/no-static-element-interactions */
'use client';

import { useBoolean, useRefState } from '@siberiacancode/reactuse';

import { useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';

interface DescriptionProps {
  value?: string | null;
  wordLimit?: number;
}

export function Description({ value }: DescriptionProps) {
  const [clamped, toggle] = useBoolean(true);
  const [shouldClamp, setShouldClamp] = useBoolean(false);
  const ref = useRefState<HTMLParagraphElement>();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isClamped = el.scrollHeight > el.clientHeight;
    setShouldClamp(isClamped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!value || value.trim().length === 0) return null;

  return (
    <div className='text-md flex flex-col'>
      <p
        className='text-muted-foreground'
        // ref={ref}
        // className={cn('text-muted-foreground', clamped ? 'line-clamp-4' : 'line-clamp-none')}
      >
        {value}
      </p>
      {/* {shouldClamp && (
        <span
          className='text-primary hover:text-primary/80 mt-1 w-0 cursor-pointer'
          onClick={() => toggle()}
        >
          {clamped ? 'Подробнее' : 'Свернуть'}
        </span>
      )} */}
    </div>
  );
}
