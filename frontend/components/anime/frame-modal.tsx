'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import * as React from 'react';
import { cn } from '@/lib/utils';

function FrameModal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot='dialog' {...props} />;
}

function FramePortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
}

function FrameOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      data-slot='dialog-overlay'
      {...props}
    />
  );
}

function FrameTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg leading-none font-semibold', className)}
      data-slot='dialog-title'
      {...props}
    />
  );
}

function FrameContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <FramePortal data-slot='dialog-portal'>
      <FrameOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-black p-0',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className
        )}
        data-slot='dialog-content'
        {...props}
      >
        <VisuallyHidden>
          <FrameTitle>hidden</FrameTitle>
        </VisuallyHidden>
        {children}
      </DialogPrimitive.Content>
    </FramePortal>
  );
}

export { FrameContent, FrameModal, FrameOverlay, FramePortal };
