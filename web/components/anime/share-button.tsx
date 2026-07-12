'use client';

import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { useClipboard } from '@/hooks/useClipboard/useClipboard';

interface ShareButtonProps {
  href: string;
}

export function ShareButton({ href }: ShareButtonProps) {
  const { copy } = useClipboard({ enabled: true });

  const handleCopy = async () => {
    try {
      const shareUrl = href.startsWith('http') ? href : `${window.location.origin}${href}`;

      await copy(shareUrl);
      toast.success('Ссылка скопирована');
    } catch (error) {
      console.error(error);
      toast.error('Не удалось скопировать ссылку');
    }
  };

  return (
    <Button variant='outline' size='lg' className='w-full' onClick={handleCopy}>
      <CopyIcon data-icon='inline-start' /> Поделиться
    </Button>
  );
}
